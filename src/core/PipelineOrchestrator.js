/**
 * PipelineOrchestrator — ядро автоматизации бизнес-процессов OperonForge.
 *
 * Координирует цепочки задач: приём заявок → валидация → маршрутизация →
 * уведомления → синхронизация с CRM. Поддерживает retry, dead-letter queue,
 * приоритеты и параллельное выполнение независимых шагов.
 *
 * @module core/PipelineOrchestrator
 */

const DEFAULT_RETRY_POLICY = {
  maxAttempts: 5,
  baseDelayMs: 1_000,
  maxDelayMs: 60_000,
  jitterFactor: 0.25,
}

const PIPELINE_STATES = Object.freeze({
  IDLE: 'idle',
  QUEUED: 'queued',
  RUNNING: 'running',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
})

const STEP_OUTCOMES = Object.freeze({
  SUCCESS: 'success',
  SKIPPED: 'skipped',
  RETRY: 'retry',
  FATAL: 'fatal',
})

/** @typedef {Object} PipelineContext
 * @property {string} runId
 * @property {string} tenantId
 * @property {Record<string, unknown>} payload
 * @property {Record<string, unknown>} metadata
 * @property {Map<string, unknown>} artifacts
 * @property {Date} startedAt
 */

/** @typedef {Object} PipelineStep
 * @property {string} id
 * @property {string} name
 * @property {number} [priority=0]
 * @property {string[]} [dependsOn=[]]
 * @property {(ctx: PipelineContext) => Promise<{ outcome: string, data?: unknown }>} execute
 * @property {(ctx: PipelineContext, error: Error) => Promise<boolean>} [shouldRetry]
 */

/** @typedef {Object} RunOptions
 * @property {string} [correlationId]
 * @property {number} [priority=0]
 * @property {Partial<typeof DEFAULT_RETRY_POLICY>} [retryPolicy]
 * @property {AbortSignal} [signal]
 * @property {(event: PipelineEvent) => void} [onEvent]
 */

/**
 * @typedef {Object} PipelineEvent
 * @property {string} type
 * @property {string} runId
 * @property {string} [stepId]
 * @property {number} timestamp
 * @property {Record<string, unknown>} [detail]
 */

/**
 * Экспоненциальный backoff с джиттером для повторных попыток.
 */
function computeRetryDelay(attempt, policy = DEFAULT_RETRY_POLICY) {
  const exponential = Math.min(
    policy.baseDelayMs * 2 ** (attempt - 1),
    policy.maxDelayMs,
  )
  const jitter = exponential * policy.jitterFactor * (Math.random() * 2 - 1)
  return Math.max(0, Math.round(exponential + jitter))
}

function sleep(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Pipeline run aborted', 'AbortError'))
      return
    }

    const timer = setTimeout(resolve, ms)
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer)
        reject(new DOMException('Pipeline run aborted', 'AbortError'))
      },
      { once: true },
    )
  })
}

function topologicalSort(steps) {
  const byId = new Map(steps.map((step) => [step.id, step]))
  const visited = new Set()
  const visiting = new Set()
  const sorted = []

  function visit(stepId) {
    if (visited.has(stepId)) return
    if (visiting.has(stepId)) {
      throw new Error(`Circular dependency detected at step "${stepId}"`)
    }

    visiting.add(stepId)
    const step = byId.get(stepId)
    if (!step) {
      throw new Error(`Unknown dependency "${stepId}"`)
    }

    for (const depId of step.dependsOn ?? []) {
      visit(depId)
    }

    visiting.delete(stepId)
    visited.add(stepId)
    sorted.push(step)
  }

  for (const step of steps) {
    visit(step.id)
  }

  return sorted
}

function groupParallelLayers(sortedSteps) {
  const completed = new Set()
  const layers = []

  while (completed.size < sortedSteps.length) {
    const layer = sortedSteps.filter((step) => {
      if (completed.has(step.id)) return false
      return (step.dependsOn ?? []).every((dep) => completed.has(dep))
    })

    if (layer.length === 0) {
      throw new Error('Unable to resolve pipeline layers — possible cycle')
    }

    layers.push(layer)
    for (const step of layer) {
      completed.add(step.id)
    }
  }

  return layers
}

/**
 * In-memory event bus для наблюдаемости пайплайнов.
 * TODO: заменить на Redis Streams в production.
 */
class PipelineEventBus {
  #listeners = new Map()

  subscribe(eventType, handler) {
    if (!this.#listeners.has(eventType)) {
      this.#listeners.set(eventType, new Set())
    }
    this.#listeners.get(eventType).add(handler)

    return () => {
      this.#listeners.get(eventType)?.delete(handler)
    }
  }

  emit(event) {
    const handlers = this.#listeners.get(event.type)
    if (!handlers) return

    for (const handler of handlers) {
      try {
        handler(event)
      } catch (err) {
        console.error('[PipelineEventBus] handler error:', err)
      }
    }

    const wildcard = this.#listeners.get('*')
    if (wildcard) {
      for (const handler of wildcard) {
        try {
          handler(event)
        } catch (err) {
          console.error('[PipelineEventBus] wildcard handler error:', err)
        }
      }
    }
  }
}

/**
 * Dead-letter queue для шагов, исчерпавших все попытки.
 */
class DeadLetterQueue {
  #entries = []

  push(entry) {
    this.#entries.push({
      ...entry,
      enqueuedAt: new Date().toISOString(),
    })
  }

  drain() {
    const copy = [...this.#entries]
    this.#entries = []
    return copy
  }

  peek(limit = 50) {
    return this.#entries.slice(0, limit)
  }

  get size() {
    return this.#entries.length
  }
}

/**
 * Главный оркестратор пайплайнов.
 */
export class PipelineOrchestrator {
  #steps = []
  #runs = new Map()
  #queue = []
  #processing = false
  #eventBus = new PipelineEventBus()
  #dlq = new DeadLetterQueue()
  #metrics = {
    totalRuns: 0,
    successfulRuns: 0,
    failedRuns: 0,
    retriedSteps: 0,
    avgDurationMs: 0,
  }

  constructor(options = {}) {
    this.tenantId = options.tenantId ?? 'default'
    this.concurrency = options.concurrency ?? 3
    this.defaultRetryPolicy = {
      ...DEFAULT_RETRY_POLICY,
      ...options.retryPolicy,
    }
  }

  registerStep(step) {
    if (!step.id || typeof step.execute !== 'function') {
      throw new Error('Invalid pipeline step: id and execute are required')
    }

    this.#steps.push({
      priority: 0,
      dependsOn: [],
      ...step,
    })

    return this
  }

  registerSteps(steps) {
    for (const step of steps) {
      this.registerStep(step)
    }
    return this
  }

  on(eventType, handler) {
    return this.#eventBus.subscribe(eventType, handler)
  }

  /**
   * Поставить пайплайн в очередь на выполнение.
   */
  async enqueue(payload, options = {}) {
    const runId = crypto.randomUUID()
    const run = {
      id: runId,
      tenantId: this.tenantId,
      state: PIPELINE_STATES.QUEUED,
      payload,
      options,
      createdAt: Date.now(),
      correlationId: options.correlationId ?? runId,
    }

    this.#runs.set(runId, run)
    this.#queue.push(run)
    this.#metrics.totalRuns += 1

    this.#emit('pipeline.queued', runId, { correlationId: run.correlationId })

    if (!this.#processing) {
      this.#processQueue()
    }

    return runId
  }

  getRun(runId) {
    return this.#runs.get(runId) ?? null
  }

  getMetrics() {
    return { ...this.#metrics, dlqSize: this.#dlq.size }
  }

  getDeadLetterEntries(limit) {
    return this.#dlq.peek(limit)
  }

  async #processQueue() {
    if (this.#processing) return
    this.#processing = true

    try {
      while (this.#queue.length > 0) {
        this.#queue.sort((a, b) => (b.options.priority ?? 0) - (a.options.priority ?? 0))
        const batch = this.#queue.splice(0, this.concurrency)

        await Promise.allSettled(
          batch.map((run) => this.#executeRun(run)),
        )
      }
    } finally {
      this.#processing = false
    }
  }

  async #executeRun(run) {
    const startedAt = Date.now()
    run.state = PIPELINE_STATES.RUNNING
    run.startedAt = startedAt

    const ctx = {
      runId: run.id,
      tenantId: run.tenantId,
      payload: structuredClone(run.payload),
      metadata: {
        correlationId: run.correlationId,
        attempt: 1,
      },
      artifacts: new Map(),
      startedAt: new Date(startedAt),
    }

    const retryPolicy = {
      ...this.defaultRetryPolicy,
      ...run.options.retryPolicy,
    }

    const signal = run.options.signal
    const layers = groupParallelLayers(topologicalSort(this.#steps))

    this.#emit('pipeline.started', run.id, {
      stepCount: this.#steps.length,
      layerCount: layers.length,
    })

    try {
      for (const layer of layers) {
        if (signal?.aborted) {
          throw new DOMException('Pipeline run aborted', 'AbortError')
        }

        const results = await Promise.all(
          layer.map((step) =>
            this.#executeStep(step, ctx, retryPolicy, signal, run.options.onEvent),
          ),
        )

        for (const result of results) {
          if (result.outcome === STEP_OUTCOMES.FATAL) {
            throw result.error ?? new Error(`Step "${result.stepId}" failed fatally`)
          }
        }
      }

      run.state = PIPELINE_STATES.COMPLETED
      run.completedAt = Date.now()
      run.durationMs = run.completedAt - startedAt

      this.#metrics.successfulRuns += 1
      this.#updateAvgDuration(run.durationMs)

      this.#emit('pipeline.completed', run.id, {
        durationMs: run.durationMs,
        artifactCount: ctx.artifacts.size,
      })

      return ctx
    } catch (error) {
      run.state = PIPELINE_STATES.FAILED
      run.error = error
      run.completedAt = Date.now()
      run.durationMs = run.completedAt - startedAt

      this.#metrics.failedRuns += 1

      this.#dlq.push({
        runId: run.id,
        tenantId: run.tenantId,
        payload: run.payload,
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
      })

      this.#emit('pipeline.failed', run.id, {
        error: error.message,
        durationMs: run.durationMs,
      })

      throw error
    }
  }

  async #executeStep(step, ctx, retryPolicy, signal, onEvent) {
    let attempt = 0

    while (attempt < retryPolicy.maxAttempts) {
      attempt += 1
      ctx.metadata.attempt = attempt

      const stepStarted = Date.now()

      this.#emit('step.started', ctx.runId, { stepId: step.id, attempt })
      onEvent?.({
        type: 'step.started',
        runId: ctx.runId,
        stepId: step.id,
        timestamp: stepStarted,
        detail: { attempt },
      })

      try {
        const result = await step.execute(ctx)
        const durationMs = Date.now() - stepStarted

        if (result.outcome === STEP_OUTCOMES.RETRY) {
          this.#metrics.retriedSteps += 1
          const delay = computeRetryDelay(attempt, retryPolicy)
          this.#emit('step.retry', ctx.runId, { stepId: step.id, attempt, delay })
          await sleep(delay, signal)
          continue
        }

        if (result.data !== undefined) {
          ctx.artifacts.set(step.id, result.data)
        }

        this.#emit('step.completed', ctx.runId, {
          stepId: step.id,
          outcome: result.outcome,
          durationMs,
        })

        onEvent?.({
          type: 'step.completed',
          runId: ctx.runId,
          stepId: step.id,
          timestamp: Date.now(),
          detail: { outcome: result.outcome, durationMs },
        })

        return { stepId: step.id, outcome: result.outcome }
      } catch (error) {
        const durationMs = Date.now() - stepStarted
        const canRetry =
          attempt < retryPolicy.maxAttempts &&
          (step.shouldRetry ? await step.shouldRetry(ctx, error) : true)

        this.#emit('step.error', ctx.runId, {
          stepId: step.id,
          attempt,
          message: error.message,
          willRetry: canRetry,
          durationMs,
        })

        if (!canRetry) {
          return { stepId: step.id, outcome: STEP_OUTCOMES.FATAL, error }
        }

        this.#metrics.retriedSteps += 1
        const delay = computeRetryDelay(attempt, retryPolicy)
        await sleep(delay, signal)
      }
    }

    return {
      stepId: step.id,
      outcome: STEP_OUTCOMES.FATAL,
      error: new Error(`Step "${step.id}" exhausted ${retryPolicy.maxAttempts} attempts`),
    }
  }

  #emit(type, runId, detail = {}) {
    this.#eventBus.emit({
      type,
      runId,
      timestamp: Date.now(),
      detail,
    })
  }

  #updateAvgDuration(durationMs) {
    const n = this.#metrics.successfulRuns
    this.#metrics.avgDurationMs =
      (this.#metrics.avgDurationMs * (n - 1) + durationMs) / n
  }
}

// ─── Предустановленные шаги для типового CRM-пайплайна ───────────────────────

export const standardCrmSteps = [
  {
    id: 'validate-lead',
    name: 'Validate incoming lead payload',
    execute: async (ctx) => {
      const { email, phone, source } = ctx.payload

      if (!email && !phone) {
        return { outcome: STEP_OUTCOMES.FATAL }
      }

      if (source && !['website', 'telegram', 'referral', 'ads'].includes(source)) {
        ctx.metadata.normalizedSource = 'unknown'
      } else {
        ctx.metadata.normalizedSource = source ?? 'website'
      }

      return { outcome: STEP_OUTCOMES.SUCCESS, data: { valid: true } }
    },
  },
  {
    id: 'deduplicate',
    name: 'Check for duplicate contacts in CRM',
    dependsOn: ['validate-lead'],
    execute: async (ctx) => {
      // TODO: подключить реальный CRM adapter (AmoCRM / Bitrix24)
      const fingerprint = [
        ctx.payload.email?.toLowerCase(),
        ctx.payload.phone?.replace(/\D/g, ''),
      ]
        .filter(Boolean)
        .join('|')

      ctx.metadata.contactFingerprint = fingerprint

      const isDuplicate = false // stub — заменить на API-запрос

      if (isDuplicate) {
        ctx.metadata.duplicateHandling = 'merge'
        return { outcome: STEP_OUTCOMES.SKIPPED, data: { duplicate: true } }
      }

      return { outcome: STEP_OUTCOMES.SUCCESS, data: { duplicate: false } }
    },
  },
  {
    id: 'score-lead',
    name: 'Calculate lead score based on rules engine',
    dependsOn: ['deduplicate'],
    execute: async (ctx) => {
      let score = 0
      const { budget, urgency, companySize } = ctx.payload

      if (budget === 'high') score += 40
      else if (budget === 'medium') score += 20

      if (urgency === 'asap') score += 30
      if (companySize && companySize > 50) score += 15

      if (ctx.metadata.normalizedSource === 'referral') score += 25

      const tier = score >= 70 ? 'hot' : score >= 40 ? 'warm' : 'cold'

      return {
        outcome: STEP_OUTCOMES.SUCCESS,
        data: { score, tier },
      }
    },
  },
  {
    id: 'assign-manager',
    name: 'Route lead to available sales manager',
    dependsOn: ['score-lead'],
    execute: async (ctx) => {
      const scoring = ctx.artifacts.get('score-lead')
      const tier = scoring?.tier ?? 'cold'

      const routingTable = {
        hot: 'senior-pool',
        warm: 'general-pool',
        cold: 'nurture-pool',
      }

      const pool = routingTable[tier]
      const assignee = await pickNextAvailableManager(pool) // stub

      ctx.metadata.assignedPool = pool
      ctx.metadata.assigneeId = assignee?.id ?? null

      return {
        outcome: STEP_OUTCOMES.SUCCESS,
        data: { pool, assigneeId: assignee?.id },
      }
    },
  },
  {
    id: 'notify-team',
    name: 'Send Slack + Telegram notifications',
    dependsOn: ['assign-manager'],
    execute: async (ctx) => {
      const assignment = ctx.artifacts.get('assign-manager')
      const scoring = ctx.artifacts.get('score-lead')

      const message = formatLeadNotification({
        payload: ctx.payload,
        tier: scoring?.tier,
        assigneeId: assignment?.assigneeId,
        correlationId: ctx.metadata.correlationId,
      })

      // Параллельная отправка — ошибка одного канала не блокирует другой
      const results = await Promise.allSettled([
        sendSlackNotification(message),
        sendTelegramNotification(message),
      ])

      const failures = results.filter((r) => r.status === 'rejected')
      if (failures.length === results.length) {
        return { outcome: STEP_OUTCOMES.RETRY }
      }

      return {
        outcome: STEP_OUTCOMES.SUCCESS,
        data: {
          slack: results[0].status === 'fulfilled',
          telegram: results[1].status === 'fulfilled',
        },
      }
    },
    shouldRetry: (_ctx, error) => {
      return error.name !== 'ValidationError'
    },
  },
  {
    id: 'sync-crm',
    name: 'Create or update CRM deal',
    dependsOn: ['assign-manager'],
    execute: async (ctx) => {
      const crmPayload = buildCrmPayload(ctx)
      const response = await pushToCrm(crmPayload)

      if (response.status === 429) {
        return { outcome: STEP_OUTCOMES.RETRY }
      }

      if (!response.ok) {
        throw new Error(`CRM sync failed: ${response.status} ${response.body}`)
      }

      return {
        outcome: STEP_OUTCOMES.SUCCESS,
        data: { crmDealId: response.dealId },
      }
    },
  },
  {
    id: 'audit-log',
    name: 'Write immutable audit trail entry',
    dependsOn: ['notify-team', 'sync-crm'],
    execute: async (ctx) => {
      const entry = {
        runId: ctx.runId,
        tenantId: ctx.tenantId,
        correlationId: ctx.metadata.correlationId,
        fingerprint: ctx.metadata.contactFingerprint,
        artifacts: Object.fromEntries(ctx.artifacts),
        completedAt: new Date().toISOString(),
      }

      await appendAuditLog(entry)

      return { outcome: STEP_OUTCOMES.SUCCESS, data: { logged: true } }
    },
  },
]

// ─── Stubs — заменить реальными интеграциями ─────────────────────────────────

async function pickNextAvailableManager(pool) {
  const roster = {
    'senior-pool': [{ id: 'mgr-001', name: 'Анна' }, { id: 'mgr-002', name: 'Дмитрий' }],
    'general-pool': [{ id: 'mgr-010', name: 'Елена' }, { id: 'mgr-011', name: 'Игорь' }],
    'nurture-pool': [{ id: 'mgr-020', name: 'bot-nurture' }],
  }

  const managers = roster[pool] ?? roster['general-pool']
  const index = Math.floor(Math.random() * managers.length)
  return managers[index]
}

function formatLeadNotification({ payload, tier, assigneeId, correlationId }) {
  const lines = [
    `🔔 Новая заявка [${tier?.toUpperCase() ?? 'UNKNOWN'}]`,
    `Имя: ${payload.name ?? '—'}`,
    `Email: ${payload.email ?? '—'}`,
    `Телефон: ${payload.phone ?? '—'}`,
    `Источник: ${payload.source ?? 'website'}`,
    `Менеджер: ${assigneeId ?? 'не назначен'}`,
    `Correlation: ${correlationId}`,
  ]
  return lines.join('\n')
}

async function sendSlackNotification(message) {
  const webhookUrl = import.meta.env.VITE_SLACK_WEBHOOK_URL
  if (!webhookUrl) {
    console.warn('[notify] Slack webhook not configured, skipping')
    return { skipped: true }
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: message }),
  })

  if (!response.ok) {
    throw new Error(`Slack notification failed: ${response.status}`)
  }

  return { sent: true }
}

async function sendTelegramNotification(message) {
  const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID

  if (!botToken || !chatId) {
    console.warn('[notify] Telegram not configured, skipping')
    return { skipped: true }
  }

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' }),
  })

  if (!response.ok) {
    throw new Error(`Telegram notification failed: ${response.status}`)
  }

  return { sent: true }
}

function buildCrmPayload(ctx) {
  const scoring = ctx.artifacts.get('score-lead')
  const assignment = ctx.artifacts.get('assign-manager')

  return {
    contact: {
      name: ctx.payload.name,
      email: ctx.payload.email,
      phone: ctx.payload.phone,
      source: ctx.metadata.normalizedSource,
      fingerprint: ctx.metadata.contactFingerprint,
    },
    deal: {
      title: `Заявка: ${ctx.payload.name ?? ctx.payload.email ?? 'Без имени'}`,
      score: scoring?.score ?? 0,
      tier: scoring?.tier ?? 'cold',
      assigneeId: assignment?.assigneeId,
      pipelineStage: mapTierToCrmStage(scoring?.tier),
    },
    meta: {
      correlationId: ctx.metadata.correlationId,
      operonRunId: ctx.runId,
    },
  }
}

function mapTierToCrmStage(tier) {
  const stages = {
    hot: 'negotiation',
    warm: 'qualified',
    cold: 'nurture',
  }
  return stages[tier] ?? 'new'
}

async function pushToCrm(payload) {
  // TODO: AmoCRM REST API v4 — payload пойдёт в тело запроса
  void payload
  await sleep(120 + Math.random() * 200)
  return { ok: true, status: 200, dealId: `deal-${crypto.randomUUID().slice(0, 8)}` }
}

async function appendAuditLog(entry) {
  const storageKey = `operon:audit:${entry.tenantId}`
  const existing = JSON.parse(localStorage.getItem(storageKey) ?? '[]')
  existing.push(entry)

  // Храним последние 500 записей локально; в prod — PostgreSQL + S3
  if (existing.length > 500) {
    existing.splice(0, existing.length - 500)
  }

  localStorage.setItem(storageKey, JSON.stringify(existing))
}

/**
 * Фабрика: готовый оркестратор для обработки заявок с сайта.
 */
export function createLeadPipelineOrchestrator(tenantId) {
  const orchestrator = new PipelineOrchestrator({ tenantId, concurrency: 2 })
  orchestrator.registerSteps(standardCrmSteps)

  orchestrator.on('pipeline.completed', (event) => {
    console.info(`[operon] pipeline ${event.runId} completed`, event.detail)
  })

  orchestrator.on('pipeline.failed', (event) => {
    console.error(`[operon] pipeline ${event.runId} failed`, event.detail)
  })

  return orchestrator
}

export default PipelineOrchestrator

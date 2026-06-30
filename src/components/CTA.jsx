import { useState } from 'react'
import { Send, Mail, MessageCircle } from 'lucide-react'
import AnimatedSection from './AnimatedSection'

const TELEGRAM_LINK = 'https://t.me/operonforge'
const EMAIL = 'operonforge@gmail.com'

export default function CTA() {
  const [status, setStatus] = useState('idle')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.target
    setStatus('sending')
    try {
      const formData = new FormData(form)
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString(),
      })
      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <AnimatedSection id="contact" className="section-padding relative">
      <div className="container-main relative">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold leading-tight text-white mb-5">
              Свяжитесь с нами
            </h2>
            <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-8">
              Обсудим вашу задачу и предложим решение, которое действительно
              поможет вашему бизнесу.
            </p>
            <div className="space-y-3">
              <a
                href={`mailto:${EMAIL}`}
                className="flex items-center gap-3 rounded-xl bg-surface/80 backdrop-blur-sm border border-white/[0.08] p-4 hover:border-primary/40 transition-colors"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 border border-primary/30">
                  <Mail size={18} className="text-primary-light" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-white">{EMAIL}</span>
                  <span className="block text-xs text-text-muted">Email — для связи</span>
                </span>
              </a>
              <a
                href={TELEGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl bg-surface/80 backdrop-blur-sm border border-white/[0.08] p-4 hover:border-primary/40 transition-colors"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 border border-primary/30">
                  <MessageCircle size={18} className="text-primary-light" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-white">t.me/operonforge</span>
                  <span className="block text-xs text-text-muted">Официальный канал OperonForge</span>
                </span>
              </a>
            </div>
          </div>

          <form
            id="form"
            name="contact"
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
            onSubmit={handleSubmit}
            className="p-6 md:p-8 rounded-2xl bg-surface/80 backdrop-blur-sm border border-white/[0.08] space-y-4"
          >
            <input type="hidden" name="form-name" value="contact" />
            <p className="hidden">
              <label>
                Не заполняйте это поле: <input name="bot-field" />
              </label>
            </p>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1.5">
                Имя
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Как к вам обращаться"
                className="w-full px-4 py-3 text-sm text-white bg-surface-secondary/80 border border-white/[0.08] rounded-lg outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors placeholder:text-text-muted"
              />
            </div>

            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-text-secondary mb-1.5">
                Telegram / телефон
              </label>
              <input
                id="contact"
                name="contact"
                type="text"
                required
                placeholder="@username или +7..."
                className="w-full px-4 py-3 text-sm text-white bg-surface-secondary/80 border border-white/[0.08] rounded-lg outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors placeholder:text-text-muted"
              />
            </div>

            <div>
              <label htmlFor="task" className="block text-sm font-medium text-text-secondary mb-1.5">
                Что нужно сделать?
              </label>
              <textarea
                id="task"
                name="task"
                rows={3}
                required
                placeholder="Сайт, система заявок, автоматизация..."
                className="w-full px-4 py-3 text-sm text-white bg-surface-secondary/80 border border-white/[0.08] rounded-lg outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors placeholder:text-text-muted resize-none"
              />
            </div>

            <div>
              <label htmlFor="problem" className="block text-sm font-medium text-text-secondary mb-1.5">
                Где сейчас основная проблема?
              </label>
              <textarea
                id="problem"
                name="problem"
                rows={2}
                placeholder="Заявки теряются, нет единой системы..."
                className="w-full px-4 py-3 text-sm text-white bg-surface-secondary/80 border border-white/[0.08] rounded-lg outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors placeholder:text-text-muted resize-none"
              />
            </div>

            <button type="submit" disabled={status === 'sending'} className="btn-primary w-full disabled:opacity-60">
              {status === 'sending' ? 'Отправляем…' : 'Обсудить проект'}
              <Send size={18} />
            </button>

            {status === 'success' && (
              <p className="text-sm text-primary-light text-center">
                Заявка отправлена. Мы свяжемся с вами в ближайшее время.
              </p>
            )}
            {status === 'error' && (
              <p className="text-sm text-red-400 text-center">
                Не удалось отправить. Напишите нам на {EMAIL}.
              </p>
            )}
          </form>
        </div>
      </div>
    </AnimatedSection>
  )
}

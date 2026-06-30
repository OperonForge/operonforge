import { useState } from 'react'
import { Send, Check } from 'lucide-react'
import AnimatedSection from './AnimatedSection'

const TELEGRAM_LINK = 'https://t.me/operonforge'
const EMAIL = 'hello@operonforge.com'

const points = [
  'где теряются заявки',
  'что можно автоматизировать',
  'какие процессы можно объединить в систему',
]

export default function CTA() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = new FormData(e.target)
    const name = data.get('name')
    const contact = data.get('contact')
    const task = data.get('task')
    const problem = data.get('problem')

    const subject = encodeURIComponent(`Заявка от ${name}`)
    const body = encodeURIComponent(
      `Имя: ${name}\nКонтакт: ${contact}\n\nЧто нужно сделать:\n${task}\n\nОсновная проблема:\n${problem}`
    )

    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`
    setSubmitted(true)
  }

  return (
    <AnimatedSection id="contact" className="section-padding relative">
      <div className="container-main relative">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold leading-tight text-white mb-5">
              Разберём ваш процесс бесплатно
            </h2>
            <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
              Расскажите, как сейчас работает ваш бизнес. Мы покажем:
            </p>
            <ul className="space-y-3 mb-8">
              {points.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 border border-primary/30">
                    <Check size={12} className="text-primary-light" />
                  </span>
                  <span className="text-base text-text-secondary">{p}</span>
                </li>
              ))}
            </ul>
            <a
              href={TELEGRAM_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <Send size={18} />
              Написать в Telegram
            </a>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-6 md:p-8 rounded-2xl bg-surface/80 backdrop-blur-sm border border-white/[0.08] space-y-4"
          >
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

            <button type="submit" className="btn-primary w-full">
              Обсудить проект
              <Send size={18} />
            </button>

            {submitted && (
              <p className="text-sm text-primary-light text-center">
                Открывается почтовый клиент для отправки заявки.
              </p>
            )}
          </form>
        </div>
      </div>
    </AnimatedSection>
  )
}

import {
  Globe,
  ClipboardList,
  Send,
  UserCircle,
  LayoutDashboard,
  Workflow,
  ArrowRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import AnimatedSection, { SectionHeading } from './AnimatedSection'

const services = [
  {
    icon: Globe,
    title: 'Корпоративный сайт',
    description:
      'Современный сайт, который помогает объяснить услуги и получать заявки.',
  },
  {
    icon: ClipboardList,
    title: 'Система обработки заявок',
    description:
      'Формы, статусы, уведомления и удобная обработка обращений.',
  },
  {
    icon: Send,
    title: 'Telegram-интеграции',
    description:
      'Все важные уведомления и обращения приходят напрямую в Telegram.',
  },
  {
    icon: UserCircle,
    title: 'Личный кабинет клиента',
    description:
      'Статусы заявок, история обращений, документы и важная информация.',
  },
  {
    icon: LayoutDashboard,
    title: 'Внутренняя панель управления',
    description:
      'Управление заявками, клиентами, статусами и контентом.',
  },
  {
    icon: Workflow,
    title: 'Автоматизация бизнес-процессов',
    description:
      'Объединяем сайт, формы, уведомления и внутренние процессы в одну систему.',
  },
]

export default function Services({
  hideHeading = false,
  limit,
  title = 'Что мы создаём',
  subtitle = 'Не просто сайты. Мы собираем цифровые системы под реальные процессы бизнеса.',
  moreLink,
}) {
  const items = limit ? services.slice(0, limit) : services

  return (
    <AnimatedSection id="services" className={`section-padding relative ${hideHeading ? '!pt-0' : ''}`}>
      <div className="container-main">
        {!hideHeading && <SectionHeading title={title} subtitle={subtitle} />}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {items.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="card-glow group p-5 md:p-6 rounded-xl bg-surface/80 backdrop-blur-sm border border-white/[0.08]"
            >
              <div className="relative mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-primary/25 bg-gradient-to-br from-primary/25 to-primary/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_8px_20px_-8px_rgba(59,130,246,0.55)] transition-all duration-300 group-hover:scale-105 group-hover:border-primary/45">
                <Icon size={22} strokeWidth={2} className="text-primary-light" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>

        {moreLink && (
          <div className="text-center mt-10">
            <Link to={moreLink.to} className="btn-link inline-flex justify-center">
              {moreLink.label}
              <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </AnimatedSection>
  )
}

import {
  Globe,
  ClipboardList,
  Send,
  UserCircle,
  LayoutDashboard,
  Workflow,
} from 'lucide-react'
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

export default function Services({ hideHeading = false }) {
  return (
    <AnimatedSection id="services" className={`section-padding relative ${hideHeading ? '!pt-0' : ''}`}>
      <div className="container-main">
        {!hideHeading && (
          <SectionHeading
            title="Что мы создаём"
            subtitle="Не просто сайты. Мы собираем цифровые системы под реальные процессы бизнеса."
          />
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {services.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="card-glow group p-5 md:p-6 rounded-xl bg-surface/80 backdrop-blur-sm border border-white/[0.08]"
            >
              <div className="w-11 h-11 flex items-center justify-center rounded-lg bg-primary/10 border border-primary/20 mb-4 group-hover:bg-primary/15 transition-colors">
                <Icon size={22} className="text-primary-light" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}

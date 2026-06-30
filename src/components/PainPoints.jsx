import { MessageSquareOff, Search, Layers, TrendingUp } from 'lucide-react'
import AnimatedSection, { SectionHeading } from './AnimatedSection'

const pains = [
  {
    icon: MessageSquareOff,
    title: 'Потерянные заявки',
    description:
      'Клиенты пишут в разные мессенджеры. Часть обращений забывается или теряется.',
  },
  {
    icon: Search,
    title: 'Ручная обработка',
    description:
      'Владелец ищет сообщения, скрины, даты и детали заказа вручную.',
  },
  {
    icon: Layers,
    title: 'Нет единой системы',
    description:
      'Заявки, оплаты, статусы и клиенты находятся в разных местах.',
  },
  {
    icon: TrendingUp,
    title: 'Сложно масштабироваться',
    description:
      'Когда всё держится на ручном контроле, бизнес сложно передать помощнику или команде.',
  },
]

export default function PainPoints({ hideHeading = false }) {
  return (
    <AnimatedSection id="problems" className={`section-padding relative ${hideHeading ? '!pt-0' : ''}`}>
      <div className="container-main">
        {!hideHeading && (
          <SectionHeading
            title="Когда бизнес растёт, хаос начинает стоить денег"
            subtitle="Заявки приходят из разных источников. Сообщения теряются. Статусы держатся в голове. А время владельца уходит на постоянный ручной контроль."
          />
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {pains.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="card-glow p-5 md:p-6 rounded-xl bg-surface/80 backdrop-blur-sm border border-white/[0.08]"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10 border border-primary/20 mb-4">
                <Icon size={20} className="text-primary-light" />
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

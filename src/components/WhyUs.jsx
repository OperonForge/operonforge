import {
  Route,
  Zap,
  GitBranch,
  Sliders,
  LifeBuoy,
  Rocket,
} from 'lucide-react'
import AnimatedSection, { SectionHeading } from './AnimatedSection'

const reasons = [
  {
    icon: Route,
    title: 'Сначала процесс — потом дизайн',
    description:
      'Мы изучаем, как работает бизнес, а не просто рисуем страницы.',
  },
  {
    icon: Zap,
    title: 'Быстрая разработка',
    description:
      'Используем современные AI-инструменты для ускорения создания решений.',
  },
  {
    icon: GitBranch,
    title: 'Понятная структура',
    description:
      'Разделяем хаос на логичные процессы и понятные сценарии.',
  },
  {
    icon: Sliders,
    title: 'Под каждую задачу отдельно',
    description:
      'Не используем один шаблон для всех клиентов.',
  },
  {
    icon: LifeBuoy,
    title: 'Развитие после запуска',
    description:
      'Проект можно расширять и улучшать по мере роста бизнеса.',
  },
  {
    icon: Rocket,
    title: 'Основа для будущих систем',
    description:
      'Любой проект можно развить в CRM, кабинет клиента или внутреннюю платформу.',
  },
]

export default function WhyUs({ hideHeading = false }) {
  return (
    <AnimatedSection id="why" className={`section-padding relative ${hideHeading ? '!pt-0' : ''}`}>
      <div className="container-main">
        {!hideHeading && (
          <SectionHeading title="Почему OperonForge" />
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {reasons.map(({ icon: Icon, title, description }) => (
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

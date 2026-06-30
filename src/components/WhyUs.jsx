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
    title: 'Быстрый запуск',
    description:
      'Благодаря современным инструментам разработки запускаем проекты быстрее без потери качества.',
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
          <SectionHeading title="Почему компании выбирают OperonForge" />
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {reasons.map(({ icon: Icon, title, description }) => (
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
      </div>
    </AnimatedSection>
  )
}

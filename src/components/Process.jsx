import AnimatedSection, { SectionHeading } from './AnimatedSection'

const steps = [
  {
    num: '01',
    title: 'Обсуждение задачи',
    description:
      'Разбираемся, как сейчас работает ваш бизнес и где возникают потери времени.',
  },
  {
    num: '02',
    title: 'Поиск хаоса',
    description:
      'Находим места, где теряются заявки, информация или деньги.',
  },
  {
    num: '03',
    title: 'Проектирование решения',
    description:
      'Продумываем структуру системы под ваши процессы.',
  },
  {
    num: '04',
    title: 'Разработка',
    description:
      'Создаём сайт, систему или автоматизацию.',
  },
  {
    num: '05',
    title: 'Тестирование',
    description:
      'Проверяем работу сценариев, форм и уведомлений.',
  },
  {
    num: '06',
    title: 'Запуск',
    description:
      'Запускаем проект и помогаем с дальнейшим развитием.',
  },
]

export default function Process({ hideHeading = false }) {
  return (
    <AnimatedSection id="process" className={`section-padding relative ${hideHeading ? '!pt-0' : ''}`}>
      <div className="container-main">
        {!hideHeading && (
          <SectionHeading
            title="Как мы работаем"
            subtitle="Сначала разбираем процесс, затем создаём решение под ваш бизнес."
          />
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {steps.map((step, index) => (
            <div
              key={step.num}
              className="card-glow relative p-5 md:p-6 rounded-xl bg-surface/80 backdrop-blur-sm border border-white/[0.08]"
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl font-bold text-primary/40 shrink-0">
                  {step.num}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-primary/20" />
              )}
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}

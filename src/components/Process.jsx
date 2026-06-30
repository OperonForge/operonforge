import { ChevronDown } from 'lucide-react'
import AnimatedSection, { SectionHeading } from './AnimatedSection'
import { useLang } from '../i18n/LanguageContext'

export default function Process({ hideHeading = false }) {
  const { t } = useLang()
  const steps = t.process.steps

  return (
    <AnimatedSection id="process" className={`section-padding relative ${hideHeading ? '!pt-0' : ''}`}>
      <div className="container-main">
        {!hideHeading && (
          <SectionHeading title={t.process.title} subtitle={t.process.subtitle} />
        )}

        <div className="max-w-md mx-auto">
          {steps.map((title, i) => (
            <div key={title}>
              <div className="card-glow flex items-center gap-4 rounded-xl bg-surface/80 backdrop-blur-sm border border-white/[0.08] px-5 py-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 border border-primary/30 text-primary-light font-bold">
                  {i + 1}
                </span>
                <h3 className="text-base md:text-lg font-semibold text-white">
                  {title}
                </h3>
              </div>
              {i < steps.length - 1 && (
                <div className="flex justify-center py-2">
                  <ChevronDown size={20} className="text-primary/40" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}

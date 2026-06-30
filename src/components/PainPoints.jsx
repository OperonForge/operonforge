import { MessageSquareOff, Search, Layers, TrendingUp } from 'lucide-react'
import AnimatedSection, { SectionHeading } from './AnimatedSection'
import { useLang } from '../i18n/LanguageContext'

const icons = [MessageSquareOff, Search, Layers, TrendingUp]

export default function PainPoints({ hideHeading = false }) {
  const { t } = useLang()
  const pains = t.pains.items.map((item, i) => ({ ...item, icon: icons[i] }))

  return (
    <AnimatedSection id="problems" className={`section-padding relative ${hideHeading ? '!pt-0' : ''}`}>
      <div className="container-main">
        {!hideHeading && (
          <SectionHeading title={t.pains.title} subtitle={t.pains.subtitle} />
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {pains.map(({ icon: Icon, title, description }) => (
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

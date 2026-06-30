import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function PreFooterCTA() {
  return (
    <section className="section-padding relative">
      <div className="container-main relative">
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-surface/70 backdrop-blur-sm px-6 py-12 md:px-14 md:py-16 text-center">
          <div className="glow-orb absolute -top-1/2 left-1/2 -translate-x-1/2 opacity-60" aria-hidden="true" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold leading-tight text-white mb-4">
              Готовы обсудить задачу?
            </h2>
            <p className="text-base md:text-lg text-text-secondary leading-relaxed max-w-xl mx-auto mb-8">
              Расскажите, как сейчас работает ваш процесс. Мы покажем, где
              теряются заявки, время или деньги, и предложим решение.
            </p>
            <Link
              to="/contact"
              className="btn-primary uppercase tracking-wide !text-sm"
            >
              Обсудить проект
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

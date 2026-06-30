import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'

export default function Hero() {
  const { t } = useLang()
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="container-wide relative z-10 w-full px-5 md:px-10 lg:px-14 pt-28 pb-16 md:pt-32 md:pb-20">
        <div className="grid lg:grid-cols-2 lg:gap-12 items-center min-h-[calc(100vh-8rem)]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl lg:max-w-none"
          >
            <h1 className="text-[2.25rem] sm:text-5xl md:text-[3.25rem] lg:text-[3.5rem] font-bold leading-[1.08] tracking-tight mb-6">
              <span className="block text-white">{t.hero.title1}</span>
              <span className="block text-primary-light mt-1">{t.hero.title2}</span>
            </h1>

            <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-10 max-w-lg">
              {t.hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
              <Link to="/contact#form" className="btn-primary w-full sm:w-auto uppercase tracking-wide !text-sm">
                {t.hero.discuss}
              </Link>
              <Link to="/portfolio" className="btn-link w-full sm:w-auto">
                {t.hero.cases}
                <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>

          <div className="hidden lg:block" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}

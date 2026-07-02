import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import WhyUs from '../components/WhyUs'
import AnimatedSection from '../components/AnimatedSection'
import Seo from '../components/Seo'
import { useLang } from '../i18n/LanguageContext'

export default function WhyPage() {
  const { t } = useLang()

  return (
    <>
      <Seo pageKey="why" />
      <PageHeader title={t.why.pageTitle} subtitle={t.why.pageSubtitle} />

      <AnimatedSection className="section-padding relative !pt-0">
        <div className="container-main max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            {t.why.aboutTitle}
          </h2>

          <div className="space-y-4">
            <p className="text-base md:text-lg text-text-secondary leading-relaxed">
              {t.why.aboutIntro}
            </p>
            <p className="text-base md:text-lg text-text-secondary leading-relaxed">
              {t.why.aboutFounder}
            </p>
            <p className="text-base md:text-lg text-text-secondary leading-relaxed">
              {t.why.aboutProcess}
            </p>

            <p className="text-base md:text-lg text-text-secondary leading-relaxed">
              {t.why.aboutCases.before}
              <Link
                to="/portfolio"
                className="text-primary-light hover:text-white font-medium transition-colors"
              >
                {t.nav.cases.toLowerCase()}
              </Link>
              {t.why.aboutCases.after}
            </p>
          </div>
        </div>
      </AnimatedSection>

      <WhyUs limit={3} title={t.why.thinkTitle} />
    </>
  )
}

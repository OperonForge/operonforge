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
            {t.why.about.map((paragraph, i) => (
              <p key={i} className="text-base md:text-lg text-text-secondary leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <WhyUs limit={3} title={t.why.thinkTitle} />
    </>
  )
}

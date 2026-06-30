import PageHeader from '../components/PageHeader'
import WhyUs from '../components/WhyUs'
import { useLang } from '../i18n/LanguageContext'

export default function WhyPage() {
  const { t } = useLang()
  return (
    <>
      <PageHeader title={t.why.title} subtitle={t.why.subtitle} />
      <WhyUs hideHeading />
    </>
  )
}

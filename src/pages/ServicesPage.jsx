import PageHeader from '../components/PageHeader'
import PainPoints from '../components/PainPoints'
import Services from '../components/Services'
import { useLang } from '../i18n/LanguageContext'

export default function ServicesPage() {
  const { t } = useLang()
  return (
    <>
      <PageHeader title={t.services.title} subtitle={t.services.subtitle} />
      <PainPoints />
      <Services hideHeading />
    </>
  )
}

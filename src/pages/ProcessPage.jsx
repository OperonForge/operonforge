import PageHeader from '../components/PageHeader'
import Process from '../components/Process'
import { useLang } from '../i18n/LanguageContext'

export default function ProcessPage() {
  const { t } = useLang()
  return (
    <>
      <PageHeader title={t.process.title} subtitle={t.process.subtitle} />
      <Process hideHeading />
    </>
  )
}

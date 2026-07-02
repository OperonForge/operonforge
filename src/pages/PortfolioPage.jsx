import PageHeader from '../components/PageHeader'
import Portfolio from '../components/Portfolio'
import Seo from '../components/Seo'
import { useLang } from '../i18n/LanguageContext'

export default function PortfolioPage() {
  const { t } = useLang()
  return (
    <>
      <Seo pageKey="portfolio" />
      <PageHeader title={t.portfolio.title} subtitle={t.portfolio.subtitle} />
      <Portfolio hideHeading />
    </>
  )
}

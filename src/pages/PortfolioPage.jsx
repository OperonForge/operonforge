import PageHeader from '../components/PageHeader'
import Portfolio from '../components/Portfolio'

export default function PortfolioPage() {
  return (
    <>
      <PageHeader title="Кейсы" subtitle="Реальные проекты и рабочие сценарии." />
      <Portfolio hideHeading />
    </>
  )
}

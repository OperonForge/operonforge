import PageHeader from '../components/PageHeader'
import PainPoints from '../components/PainPoints'
import Services from '../components/Services'

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        title="Что мы создаём"
        subtitle="Не просто сайты. Мы собираем цифровые системы под реальные процессы бизнеса."
      />
      <PainPoints />
      <Services hideHeading />
    </>
  )
}

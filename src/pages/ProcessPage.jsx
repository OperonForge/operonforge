import PageHeader from '../components/PageHeader'
import Process from '../components/Process'

export default function ProcessPage() {
  return (
    <>
      <PageHeader
        title="Как мы работаем"
        subtitle="Сначала разбираем процесс, затем создаём решение под ваш бизнес."
      />
      <Process hideHeading />
    </>
  )
}

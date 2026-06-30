import PageHeader from '../components/PageHeader'
import WhyUs from '../components/WhyUs'

export default function WhyPage() {
  return (
    <>
      <PageHeader
        title="Почему OperonForge"
        subtitle="Мы изучаем, как работает бизнес, а не просто рисуем страницы."
      />
      <WhyUs hideHeading />
    </>
  )
}

import Hero from '../components/Hero'
import Services from '../components/Services'
import WhyUs from '../components/WhyUs'
import Portfolio from '../components/Portfolio'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services
        limit={4}
        title="Чем мы занимаемся"
        subtitle="Создаём цифровые системы под реальные процессы бизнеса."
        moreLink={{ to: '/services', label: 'Все услуги' }}
      />
      <WhyUs />
      <Portfolio limit={3} moreLink={{ to: '/portfolio', label: 'Все кейсы' }} />
    </>
  )
}

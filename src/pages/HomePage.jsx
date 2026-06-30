import Hero from '../components/Hero'
import Services from '../components/Services'
import WhyUs from '../components/WhyUs'
import Portfolio from '../components/Portfolio'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services limit={4} variant="home" />
      <WhyUs />
      <Portfolio limit={3} variant="home" />
    </>
  )
}

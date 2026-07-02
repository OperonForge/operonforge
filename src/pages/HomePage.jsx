import Hero from '../components/Hero'
import Services from '../components/Services'
import WhyUs from '../components/WhyUs'
import Portfolio from '../components/Portfolio'
import Seo from '../components/Seo'

export default function HomePage() {
  return (
    <>
      <Seo pageKey="home" />
      <Hero />
      <Services limit={4} variant="home" />
      <WhyUs />
      <Portfolio variant="home" />
    </>
  )
}

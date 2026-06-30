import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import PreFooterCTA from './PreFooterCTA'
import heroBg from '../assets/hero-system-bg.png'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function Layout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const isContact = pathname === '/contact'

  return (
    <div id="top" className="relative min-h-screen text-text">
      <ScrollToTop />

      <div
        className="page-background"
        style={{ backgroundImage: `url(${heroBg})` }}
        aria-hidden="true"
      />
      <div
        className={`page-overlay ${isHome ? 'page-overlay--home' : 'page-overlay--inner'}`}
        aria-hidden="true"
      />

      <Header />
      <main className="relative z-10">
        <Outlet />
        {!isContact && <PreFooterCTA />}
      </main>
      <Footer />
    </div>
  )
}

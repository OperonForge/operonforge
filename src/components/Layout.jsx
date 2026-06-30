import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import heroBg from '../assets/hero-system-bg.webp'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        requestAnimationFrame(() =>
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        )
        return
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])
  return null
}

export default function Layout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

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
      </main>
      <Footer />
    </div>
  )
}

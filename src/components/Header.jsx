import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'
import LanguageSwitch from './LanguageSwitch'
import { useLang } from '../i18n/LanguageContext'

export default function Header() {
  const { t } = useLang()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.innerWidth >= 1024
  )

  const navLinks = [
    { to: '/services', label: t.nav.services },
    { to: '/portfolio', label: t.nav.cases },
    { to: '/process', label: t.nav.process },
    { to: '/why', label: t.nav.about },
    { to: '/contact', label: t.nav.contacts },
  ]

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const update = () => {
      setIsDesktop(mq.matches)
      if (mq.matches) setOpen(false)
    }
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const closeMenu = () => setOpen(false)

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        open || scrolled
          ? 'bg-bg shadow-[0_4px_24px_rgba(0,0,0,0.5)]'
          : 'bg-transparent'
      }`}
    >
      <div className="container-wide flex items-center justify-between gap-4 h-[4.25rem] md:h-[5rem] px-5 md:px-10 lg:px-14">
        <Logo size="lg" className="shrink-0" />

        {isDesktop && (
          <nav className="flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `nav-link${isActive ? ' nav-link--active' : ''}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <LanguageSwitch />
          {isDesktop ? (
            <Link to="/contact#form" className="btn-primary inline-flex !py-2.5 !px-5 !text-xs uppercase tracking-wide">
              {t.nav.discuss}
            </Link>
          ) : (
            <button
              type="button"
              className="flex items-center justify-center h-9 w-9 rounded-lg border border-white/15 bg-surface/60 text-white hover:border-primary/40 transition-colors"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
              aria-expanded={open}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </div>

      {open && !isDesktop && (
        <div className="fixed inset-0 top-[4.25rem] md:top-[5rem] z-40 bg-bg border-t border-white/10">
          <nav className="flex flex-col p-6 gap-1 overflow-y-auto max-h-[calc(100dvh-4.25rem)] md:max-h-[calc(100dvh-5rem)]">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `py-4 text-lg border-b border-white/[0.06] transition-colors uppercase tracking-wider ${
                    isActive ? 'text-white' : 'text-text-secondary hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link to="/contact#form" onClick={closeMenu} className="btn-primary mt-6 w-full uppercase tracking-wide">
              {t.nav.discuss}
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}

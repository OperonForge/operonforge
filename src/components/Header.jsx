import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'

const navLinks = [
  { to: '/services', label: 'Услуги' },
  { to: '/portfolio', label: 'Кейсы' },
  { to: '/process', label: 'Процесс' },
  { to: '/why', label: 'Почему OperonForge' },
  { to: '/contact', label: 'Контакты' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

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
        scrolled
          ? 'bg-bg/90 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.5)]'
          : 'bg-transparent'
      }`}
    >
      <div className="container-wide flex items-center justify-between gap-6 h-[4.25rem] md:h-[5rem] px-5 md:px-10 lg:px-14">
        <Logo size="lg" className="shrink-0" />

        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
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

        <div className="flex items-center gap-3 shrink-0">
          <Link to="/contact" className="btn-outline hidden sm:inline-flex !py-2 !px-5 !text-xs">
            Связаться
          </Link>
          <button
            type="button"
            className="lg:hidden p-2 text-text-secondary hover:text-white transition-colors"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden fixed inset-0 top-[4.25rem] md:top-[5rem] bg-bg/98 backdrop-blur-xl z-40">
          <nav className="flex flex-col p-6 gap-1">
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
            <Link to="/contact" onClick={closeMenu} className="btn-outline mt-6 w-full">
              Связаться
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}

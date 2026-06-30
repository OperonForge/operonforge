import { Link } from 'react-router-dom'
import Logo from './Logo'

const footerLinks = [
  { to: '/services', label: 'Услуги' },
  { to: '/portfolio', label: 'Кейсы' },
  { to: '/process', label: 'Процесс' },
  { to: '/contact', label: 'Контакты' },
]

const socials = [
  { href: 'https://t.me/operonforge', label: 'Telegram' },
  { href: 'mailto:hello@operonforge.com', label: 'Email' },
  { href: 'https://instagram.com/operonforge', label: 'Instagram' },
  { href: 'https://tiktok.com/@operonforge', label: 'TikTok' },
]

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.08] bg-bg/40 backdrop-blur-sm">
      <div className="container-main section-padding !py-12 md:!py-16 px-5 md:px-8">
        <div className="grid md:grid-cols-3 gap-10 md:gap-8 mb-10">
          <div>
            <Logo size="sm" />
            <p className="mt-4 text-sm text-text-secondary leading-relaxed max-w-xs">
              Разрозненные процессы → единая работающая система.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Навигация
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-text-secondary hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Контакты
            </h4>
            <ul className="space-y-2.5">
              {socials.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-sm text-text-secondary hover:text-primary-light transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.06]">
          <p className="text-xs text-text-muted text-center md:text-left">
            © 2026 OperonForge. Digital systems & automation.
          </p>
        </div>
      </div>
    </footer>
  )
}

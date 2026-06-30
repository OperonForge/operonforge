import { Link } from 'react-router-dom'
import Logo from './Logo'
import logoSymbol from '../assets/logo-symbol-trimmed.png'
import { useLang } from '../i18n/LanguageContext'

const socials = [
  { href: 'https://t.me/operonforge', key: 'telegram' },
  { href: 'mailto:operonforge@gmail.com', label: 'operonforge@gmail.com' },
]

export default function Footer() {
  const { t } = useLang()

  const footerLinks = [
    { to: '/services', label: t.nav.services },
    { to: '/portfolio', label: t.nav.cases },
    { to: '/process', label: t.nav.process },
    { to: '/why', label: t.nav.about },
    { to: '/contact', label: t.nav.contacts },
  ]

  return (
    <footer className="relative z-10 border-t border-white/[0.08] bg-bg/40 backdrop-blur-sm">
      <div className="container-main section-padding !py-12 md:!py-16 px-5 md:px-8">
        <div className="grid md:grid-cols-3 gap-10 md:gap-8 mb-10">
          <div>
            <Logo size="sm" />
            <p className="mt-4 text-sm text-text-secondary leading-relaxed max-w-xs">
              {t.footer.slogan}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              {t.footer.navTitle}
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
              {t.footer.contactsTitle}
            </h4>
            <ul className="space-y-2.5">
              {socials.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-sm text-text-secondary hover:text-primary-light transition-colors"
                  >
                    {link.key ? t.footer[link.key] : link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.06] flex items-center justify-center md:justify-start gap-2.5">
          <img
            src={logoSymbol}
            alt=""
            aria-hidden="true"
            className="h-6 w-auto object-contain logo-symbol"
          />
          <p className="text-xs text-text-muted">
            {t.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  )
}

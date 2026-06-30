import { useLang } from '../i18n/LanguageContext'

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
]

export default function LanguageSwitch({ className = '' }) {
  const { lang, setLang } = useLang()

  return (
    <div
      className={`inline-flex items-center rounded-lg border border-white/[0.12] bg-surface/60 backdrop-blur-sm p-0.5 ${className}`}
      role="group"
      aria-label="Language"
    >
      {LANGS.map(({ code, label }) => {
        const active = lang === code
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={active}
            className={`px-2.5 py-1 text-xs font-semibold uppercase tracking-wide rounded-md transition-colors ${
              active
                ? 'bg-primary/20 text-primary-light'
                : 'text-text-muted hover:text-white'
            }`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

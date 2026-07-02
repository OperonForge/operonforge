import { useEffect, useState } from 'react'
import { translations } from './translations'
import { LanguageContext } from './LanguageContext'

const STORAGE_KEY = 'operonforge-lang'
const DEFAULT_LANG = 'en'
const CIS_LANG_PREFIXES = ['ru', 'be', 'uk']

function detectBrowserLang() {
  const langs = navigator.languages?.length
    ? navigator.languages
    : [navigator.language || '']

  for (const raw of langs) {
    const code = raw.toLowerCase().split('-')[0]
    if (CIS_LANG_PREFIXES.includes(code)) return 'ru'
  }
  return DEFAULT_LANG
}

function getInitialLang() {
  if (typeof window === 'undefined') return DEFAULT_LANG
  const saved = window.localStorage.getItem(STORAGE_KEY)
  if (saved === 'ru' || saved === 'en') return saved
  return detectBrowserLang()
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(getInitialLang)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.lang = lang
  }, [lang])

  const toggle = () => setLang((l) => (l === 'en' ? 'ru' : 'en'))

  const value = {
    lang,
    setLang,
    toggle,
    t: translations[lang],
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

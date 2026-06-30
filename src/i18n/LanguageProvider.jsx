import { useEffect, useState } from 'react'
import { translations } from './translations'
import { LanguageContext } from './LanguageContext'

const STORAGE_KEY = 'operonforge-lang'
const DEFAULT_LANG = 'en'

function getInitialLang() {
  if (typeof window === 'undefined') return DEFAULT_LANG
  const saved = window.localStorage.getItem(STORAGE_KEY)
  return saved === 'ru' || saved === 'en' ? saved : DEFAULT_LANG
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(getInitialLang)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.lang = lang
    document.title = translations[lang].meta.title
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

import { useEffect } from 'react'
import { useLang } from '../i18n/LanguageContext'

function setMeta(name, content) {
  if (!content) return
  let el = document.head.querySelector(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setPropertyMeta(property, content) {
  if (!content) return
  let el = document.head.querySelector(`meta[property="${property}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('property', property)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export default function Seo({ pageKey }) {
  const { t, lang } = useLang()

  useEffect(() => {
    const meta = t.seo?.[pageKey]
    if (!meta) return
    document.title = meta.title
    setMeta('description', meta.description)
    if (pageKey === 'home') {
      setPropertyMeta('og:description', meta.description)
      setMeta('twitter:description', meta.description)
    }
  }, [t, lang, pageKey])

  return null
}

import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'

const SITE_ORIGIN = 'https://operonforge.com'

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

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function canonicalFromPath(pathname) {
  if (pathname === '/') return `${SITE_ORIGIN}/`
  const clean = pathname.replace(/\/+$/, '') || '/'
  return `${SITE_ORIGIN}${clean}`
}

export default function Seo({ pageKey }) {
  const { t, lang } = useLang()
  const { pathname } = useLocation()

  useEffect(() => {
    const meta = t.seo?.[pageKey]
    if (!meta) return
    document.title = meta.title
    setMeta('description', meta.description)
    setCanonical(canonicalFromPath(pathname))
    if (pageKey === 'home') {
      setPropertyMeta('og:description', meta.description)
      setMeta('twitter:description', meta.description)
    }
  }, [t, lang, pageKey, pathname])

  return null
}

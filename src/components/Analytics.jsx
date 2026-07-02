import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const GTM_BASE = 'https://www.googletagmanager.com/gtag/js'
const METRIKA_SRC = 'https://mc.yandex.ru/metrika/tag.js'

function getAnalyticsIds() {
  return {
    gaId: String(import.meta.env.VITE_GA_ID ?? '').trim(),
    ymId: String(import.meta.env.VITE_YM_ID ?? '').trim(),
  }
}

function loadScript(src) {
  if (document.querySelector(`script[src="${src}"]`)) return
  const script = document.createElement('script')
  script.async = true
  script.src = src
  document.head.appendChild(script)
}

function initGA(gaId) {
  loadScript(`${GTM_BASE}?id=${gaId}`)
  window.dataLayer = window.dataLayer || []
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments)
    }
  window.gtag('js', new Date())
  window.gtag('config', gaId, { send_page_view: false })
}

function initYM(ymId) {
  window.ym =
    window.ym ||
    function ym(...args) {
      ;(window.ym.a = window.ym.a || []).push(args)
    }
  window.ym.l = Date.now()

  loadScript(METRIKA_SRC)

  window.ym(Number(ymId), 'init', {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
    defer: true,
  })
}

export default function Analytics() {
  const location = useLocation()

  useEffect(() => {
    const { gaId, ymId } = getAnalyticsIds()
    if (gaId) initGA(gaId)
    if (ymId) initYM(ymId)
  }, [])

  useEffect(() => {
    const { gaId, ymId } = getAnalyticsIds()
    const path = location.pathname + location.search
    const url = window.location.href

    if (gaId && window.gtag) {
      window.gtag('config', gaId, { page_path: path })
    }

    if (ymId && window.ym) {
      window.ym(Number(ymId), 'hit', url, { title: document.title })
    }
  }, [location])

  return null
}

import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const GA_ID = import.meta.env.VITE_GA_ID
const YM_ID = import.meta.env.VITE_YM_ID

function initGA() {
  if (!GA_ID || window.gtag) return

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_ID, { send_page_view: false })
}

function initYM() {
  if (!YM_ID || window.ym) return

  window.ym =
    window.ym ||
    function ym(...args) {
      ;(window.ym.a = window.ym.a || []).push(args)
    }
  window.ym.l = Date.now()

  const script = document.createElement('script')
  script.async = true
  script.src = 'https://mc.yandex.ru/metrika/tag.js'
  document.head.appendChild(script)

  window.ym(Number(YM_ID), 'init', {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
  })
}

export default function Analytics() {
  const location = useLocation()
  const inited = useRef(false)

  useEffect(() => {
    if (inited.current) return
    initGA()
    initYM()
    inited.current = true
  }, [])

  useEffect(() => {
    const path = location.pathname + location.search

    if (GA_ID && window.gtag) {
      window.gtag('config', GA_ID, { page_path: path })
    }

    if (YM_ID && window.ym) {
      window.ym(Number(YM_ID), 'hit', path)
    }
  }, [location])

  return null
}

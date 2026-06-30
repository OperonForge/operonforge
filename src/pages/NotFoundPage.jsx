import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext'

export default function NotFoundPage() {
  const { t } = useLang()
  return (
    <section className="min-h-[70vh] flex items-center section-padding relative">
      <div className="container-main text-center">
        <span className="block text-6xl md:text-8xl font-bold text-primary/30 mb-4">
          404
        </span>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
          {t.notFound.title}
        </h1>
        <p className="text-text-secondary mb-8 max-w-md mx-auto">
          {t.notFound.text}
        </p>
        <Link to="/" className="btn-primary">
          <ArrowLeft size={18} />
          {t.notFound.home}
        </Link>
      </div>
    </section>
  )
}

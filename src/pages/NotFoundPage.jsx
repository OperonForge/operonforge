import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <section className="min-h-[70vh] flex items-center section-padding relative">
      <div className="container-main text-center">
        <span className="block text-6xl md:text-8xl font-bold text-primary/30 mb-4">
          404
        </span>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Страница не найдена
        </h1>
        <p className="text-text-secondary mb-8 max-w-md mx-auto">
          Возможно, ссылка устарела или страница была перемещена.
        </p>
        <Link to="/" className="btn-primary">
          <ArrowLeft size={18} />
          На главную
        </Link>
      </div>
    </section>
  )
}

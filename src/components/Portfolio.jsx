import { motion } from 'framer-motion'
import { ExternalLink, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import AnimatedSection, { SectionHeading } from './AnimatedSection'
import imgFdPortal from '../assets/case-fd-portal.webp'
import imgAtelier from '../assets/case-atelier-restauro.webp'
import imgCafe from '../assets/case-cafe555.webp'

const cases = [
  {
    title: 'FD Federation',
    type: 'Портал игрового сообщества',
    image: imgFdPortal,
    link: 'https://fd-federation.netlify.app/server150.html',
    was: 'Информация, состав и навигация сообщества были разбросаны по разным местам.',
    did: 'Собрали единый портал: разделы, ростер, статусы серверов и точки входа для участников.',
    result:
      'Участники получили единую точку входа для материалов, структуры и внутренних процессов сообщества.',
    tags: ['Портал', 'Навигация', 'Ростер', 'Разделы'],
  },
  {
    title: 'Atelier Restauro',
    type: 'Сайт реставрационной мастерской',
    image: imgAtelier,
    link: 'https://atelier-restauro.netlify.app/',
    was: 'Клиентам было сложно быстро понять услуги и связаться с мастером.',
    did: 'Создали сайт с понятной структурой, примерами работ и удобным сценарием обращения.',
    result:
      'Клиент может за 1–2 минуты понять услуги и оставить заявку без лишних звонков и переписок.',
    tags: ['Сайт услуг', 'Примеры работ', 'Контакт', 'Локальный бизнес'],
  },
  {
    title: 'Комплекс 555',
    type: 'Сайт придорожного кафе и гостиницы',
    image: imgCafe,
    link: 'https://kompleks-555.netlify.app/',
    was: 'Придорожному кафе и гостинице нужно показать формат и принимать заказы и брони, не теряя обращений.',
    did: 'Собрали сайт: кафе с предзаказом меню, гостиница, контакты и быстрый звонок.',
    result:
      'Гости могут изучить формат, заказать еду заранее и забронировать номер в одном месте.',
    tags: ['Кафе', 'Гостиница', 'Предзаказ', 'Бронирование'],
  },
]

export default function Portfolio({ hideHeading = false, limit, moreLink }) {
  const items = limit ? cases.slice(0, limit) : cases

  return (
    <AnimatedSection id="cases" className={`section-padding relative ${hideHeading ? '!pt-0' : ''}`}>
      <div className="container-main">
        {!hideHeading && (
          <SectionHeading
            title="Кейсы"
            subtitle="Реальные проекты и рабочие сценарии."
          />
        )}

        <div className="grid md:grid-cols-2 gap-5 md:gap-6">
          {items.map((item, i) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
              className="card-glow group flex flex-col overflow-hidden rounded-xl bg-surface/80 backdrop-blur-sm border border-white/[0.08]"
            >
              <a
                href={item.link || undefined}
                target={item.link ? '_blank' : undefined}
                rel={item.link ? 'noopener noreferrer' : undefined}
                className={`relative block aspect-[16/10] overflow-hidden border-b border-white/[0.06] ${
                  item.link ? 'cursor-pointer' : 'pointer-events-none'
                }`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface/90 via-surface/10 to-transparent" />
                <span className="absolute bottom-3 left-4 text-xs font-medium uppercase tracking-wider text-primary-light">
                  {item.type}
                </span>
                {item.link && (
                  <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-white bg-bg/70 backdrop-blur-sm border border-white/15 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                    Открыть
                    <ExternalLink size={13} />
                  </span>
                )}
              </a>

              <div className="flex flex-col flex-grow p-6 md:p-7">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
                  {item.title}
                </h3>

                <div className="space-y-3 mb-6 flex-grow">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                      Что было
                    </span>
                    <p className="text-sm text-text-secondary mt-1">{item.was}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                      Что сделали
                    </span>
                    <p className="text-sm text-text-secondary mt-1">{item.did}</p>
                  </div>
                  {item.result && (
                    <div className="rounded-lg bg-primary/[0.07] border border-primary/20 p-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary-light">
                        Результат
                      </span>
                      <p className="text-sm text-text-secondary mt-1">{item.result}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-xs text-text-secondary bg-surface-secondary/80 border border-white/[0.06] rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary-light hover:text-white transition-colors"
                  >
                    Открыть сайт
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </div>

        {moreLink && (
          <div className="text-center mt-10">
            <Link to={moreLink.to} className="btn-link inline-flex justify-center">
              {moreLink.label}
              <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </AnimatedSection>
  )
}

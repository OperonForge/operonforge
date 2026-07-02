import { motion } from 'framer-motion'
import { ExternalLink, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import AnimatedSection, { SectionHeading } from './AnimatedSection'
import { useLang } from '../i18n/LanguageContext'
import imgFdPortal from '../assets/case-fd-portal.webp'
import imgAtelier from '../assets/case-atelier-restauro.webp'
import imgCafe from '../assets/case-cafe555.webp'

const caseAssets = {
  fd: { image: imgFdPortal, link: 'https://fd-federation.netlify.app/server150.html' },
  atelier: { image: imgAtelier, link: 'https://atelier-restauro.netlify.app/' },
  kompleks: { image: imgCafe, link: 'https://kompleks-555.netlify.app/' },
}

const order = ['sokrat', 'fd', 'atelier', 'kompleks']

function CaseCard({ item, index, t }) {
  const labels = t.portfolio.labels[item.group] ?? t.portfolio.labels.client
  const isConcept = item.group === 'concept'

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: (index % 2) * 0.1 }}
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
        {isConcept && (
          <span className="absolute top-3 left-3 inline-flex items-center px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary-light bg-transparent border border-primary-light/50 rounded-md backdrop-blur-sm">
            {t.portfolio.conceptBadge}
          </span>
        )}
        {item.link && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-white bg-bg/70 backdrop-blur-sm border border-white/15 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
            {t.portfolio.open}
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
              {labels.was}
            </span>
            <p className="text-sm text-text-secondary mt-1">{item.was}</p>
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              {labels.did}
            </span>
            <p className="text-sm text-text-secondary mt-1">{item.did}</p>
          </div>
          {item.result && (
            <div className="rounded-lg bg-primary/[0.07] border border-primary/20 p-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-light">
                {t.portfolio.result}
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
            {t.portfolio.openSite}
            <ExternalLink size={16} />
          </a>
        )}
      </div>
    </motion.article>
  )
}

export default function Portfolio({ hideHeading = false, variant }) {
  const { t } = useLang()
  const isHome = variant === 'home'

  const cases = order
    .map((id) => ({ id, ...caseAssets[id], ...t.portfolio.cases[id] }))
    .filter((c) => !c.draft && c.image)

  const clientCases = cases.filter((c) => c.group === 'client')
  const conceptCases = cases.filter((c) => c.group === 'concept')

  const renderGroup = (title, groupCases, intro) => {
    if (groupCases.length === 0) return null
    return (
      <div className="mb-12 last:mb-0">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{title}</h3>
        {intro && (
          <p className="text-sm md:text-base text-text-secondary max-w-2xl mb-6 leading-relaxed">
            {intro}
          </p>
        )}
        <div className={`grid md:grid-cols-2 gap-5 md:gap-6 ${intro ? '' : 'mt-6'}`}>
          {groupCases.map((item, i) => (
            <CaseCard key={item.id} item={item} index={i} t={t} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <AnimatedSection id="cases" className={`section-padding relative ${hideHeading ? '!pt-0' : ''}`}>
      <div className="container-main">
        {!hideHeading && (
          <SectionHeading title={t.portfolio.title} subtitle={t.portfolio.subtitle} />
        )}

        {renderGroup(t.portfolio.clientTitle, clientCases)}
        {renderGroup(
          t.portfolio.readyTitle,
          conceptCases,
          isHome ? null : t.portfolio.readyIntro,
        )}

        {isHome && (
          <div className="text-center mt-4">
            <Link to="/portfolio" className="btn-link inline-flex justify-center">
              {t.portfolio.more}
              <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </AnimatedSection>
  )
}

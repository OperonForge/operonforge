export default function PageHeader({ title, subtitle, badge }) {
  return (
    <div className="container-wide px-5 md:px-10 lg:px-14 pt-28 pb-10 md:pt-32 md:pb-14">
      {badge && (
        <span className="inline-block mb-4 px-3 py-1 text-xs font-medium tracking-wide uppercase text-primary-light bg-primary/10 border border-primary/20 rounded-full">
          {badge}
        </span>
      )}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white mb-4 max-w-3xl">
        {title}
      </h1>
      {subtitle && (
        <p className="text-base md:text-lg text-text-secondary leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  )
}

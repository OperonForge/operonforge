import { Link } from 'react-router-dom'
import logoSymbol from '../assets/logo-symbol-trimmed.png'
import logoText from '../assets/logo-text-trimmed.png'

export default function Logo({ className = '', showText = true, size = 'md' }) {
  const sizes = {
    sm: {
      icon: 'h-9 w-auto',
      text: 'h-4 w-auto',
      gap: 'gap-2.5',
    },
    md: {
      icon: 'h-11 w-auto',
      text: 'h-5 md:h-6 w-auto',
      gap: 'gap-3',
    },
    lg: {
      icon: 'h-8 w-auto sm:h-9 md:h-10',
      text: 'h-4 w-auto sm:h-5 md:h-[1.4rem]',
      gap: 'gap-2 sm:gap-2.5 md:gap-3',
    },
  }

  const s = sizes[size] || sizes.md

  return (
    <Link
      to="/"
      className={`inline-flex items-center ${s.gap} group ${className}`}
    >
      <img
        src={logoSymbol}
        alt=""
        aria-hidden="true"
        className={`${s.icon} shrink-0 object-contain transition-transform duration-300 group-hover:scale-105 logo-symbol`}
      />
      {showText && (
        <img
          src={logoText}
          alt="OperonForge"
          className={`${s.text} object-contain object-left logo-text`}
        />
      )}
    </Link>
  )
}

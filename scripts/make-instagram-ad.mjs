import sharp from 'sharp'
import fs from 'fs'

const W = 1080
const H = 1350

function buildAdSvg() {
  return `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#060a12"/>
      <stop offset="45%" stop-color="#05070a"/>
      <stop offset="100%" stop-color="#030508"/>
    </linearGradient>
    <radialGradient id="glowMain" cx="50%" cy="34%" r="52%">
      <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.42"/>
      <stop offset="45%" stop-color="#2563eb" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="#1d4ed8" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowSide" cx="82%" cy="72%" r="38%">
      <stop offset="0%" stop-color="#60a5fa" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#60a5fa" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="gridFade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="35%" stop-color="#ffffff" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="headlineAccent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#93c5fd"/>
      <stop offset="50%" stop-color="#60a5fa"/>
      <stop offset="100%" stop-color="#3b82f6"/>
    </linearGradient>
    <linearGradient id="cta" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#2563eb"/>
    </linearGradient>
    <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="28"/>
    </filter>
    <filter id="cardShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="18" stdDeviation="24" flood-color="#000000" flood-opacity="0.45"/>
      <feDropShadow dx="0" dy="0" stdDeviation="1" flood-color="#60a5fa" flood-opacity="0.18"/>
    </filter>
    <clipPath id="round24"><rect x="0" y="0" width="100%" height="100%" rx="24" ry="24"/></clipPath>
    <pattern id="grid" width="54" height="54" patternUnits="userSpaceOnUse">
      <path d="M 54 0 L 0 0 0 54" fill="none" stroke="#ffffff" stroke-opacity="0.045" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <rect width="${W}" height="${H}" fill="url(#glowMain)"/>
  <rect width="${W}" height="${H}" fill="url(#glowSide)"/>

  <!-- perspective floor -->
  <g opacity="0.55">
    <ellipse cx="540" cy="1180" rx="520" ry="120" fill="#3b82f6" opacity="0.08" filter="url(#blur)"/>
    ${Array.from({ length: 14 }, (_, i) => {
      const y = 760 + i * 34
      const spread = 90 + i * 34
      return `<line x1="${540 - spread}" y1="${y}" x2="${540 + spread}" y2="${y}" stroke="#60a5fa" stroke-opacity="${0.05 + i * 0.012}" stroke-width="1"/>`
    }).join('')}
    ${Array.from({ length: 11 }, (_, i) => {
      const x = 180 + i * 72
      return `<line x1="${x}" y1="760" x2="540" y2="1240" stroke="#60a5fa" stroke-opacity="0.05" stroke-width="1"/>`
    }).join('')}
  </g>

  <!-- floating system nodes -->
  <g opacity="0.9">
    <circle cx="170" cy="360" r="5" fill="#60a5fa"/>
    <circle cx="910" cy="430" r="4" fill="#93c5fd"/>
    <circle cx="820" cy="250" r="3" fill="#3b82f6"/>
    <circle cx="250" cy="560" r="3" fill="#60a5fa"/>
    <path d="M170 360 C360 300, 520 320, 700 390" fill="none" stroke="#60a5fa" stroke-opacity="0.22" stroke-width="1.5" stroke-dasharray="6 8"/>
    <path d="M700 390 C780 410, 860 420, 910 430" fill="none" stroke="#60a5fa" stroke-opacity="0.18" stroke-width="1.5"/>
    <path d="M700 390 C640 470, 420 520, 250 560" fill="none" stroke="#60a5fa" stroke-opacity="0.16" stroke-width="1.5"/>
  </g>

  <!-- left glass card -->
  <g filter="url(#cardShadow)">
    <rect x="72" y="250" width="300" height="168" rx="24" fill="#0b0f14" fill-opacity="0.72" stroke="#ffffff" stroke-opacity="0.1"/>
    <rect x="72" y="250" width="300" height="168" rx="24" fill="url(#gridFade)" clip-path="url(#round24)"/>
    <circle cx="104" cy="282" r="10" fill="#22c55e" fill-opacity="0.9"/>
    <text x="126" y="288" font-family="DejaVu Sans, Arial, sans-serif" font-size="18" font-weight="700" fill="#ffffff">Заявка #2847</text>
    <text x="96" y="326" font-family="DejaVu Sans, Arial, sans-serif" font-size="15" fill="#9ca3af">Статус: в работе</text>
    <rect x="96" y="346" width="188" height="10" rx="5" fill="#111827"/>
    <rect x="96" y="346" width="132" height="10" rx="5" fill="url(#cta)"/>
    <text x="96" y="392" font-family="DejaVu Sans, Arial, sans-serif" font-size="13" fill="#60a5fa">Код отслеживания: OF-2847</text>
  </g>

  <!-- right glass card -->
  <g filter="url(#cardShadow)">
    <rect x="708" y="300" width="300" height="148" rx="24" fill="#0b0f14" fill-opacity="0.72" stroke="#ffffff" stroke-opacity="0.1"/>
    <rect x="708" y="300" width="300" height="148" rx="24" fill="url(#gridFade)"/>
    <text x="736" y="338" font-family="DejaVu Sans, Arial, sans-serif" font-size="14" font-weight="700" fill="#60a5fa" letter-spacing="1.2">TELEGRAM</text>
    <text x="860" y="338" font-family="DejaVu Sans, Arial, sans-serif" font-size="18" fill="#6b7280">→</text>
    <text x="888" y="338" font-family="DejaVu Sans, Arial, sans-serif" font-size="14" font-weight="700" fill="#ffffff" letter-spacing="1.2">СИСТЕМА</text>
    <text x="736" y="372" font-family="DejaVu Sans, Arial, sans-serif" font-size="15" fill="#9ca3af">Новая заявка автоматически</text>
    <text x="736" y="396" font-family="DejaVu Sans, Arial, sans-serif" font-size="15" fill="#9ca3af">попала в общий поток</text>
    <rect x="736" y="412" width="118" height="24" rx="12" fill="#3b82f6" fill-opacity="0.18" stroke="#60a5fa" stroke-opacity="0.35"/>
    <text x="754" y="429" font-family="DejaVu Sans, Arial, sans-serif" font-size="13" font-weight="700" fill="#93c5fd">Без потерь</text>
  </g>

  <!-- center dashboard card -->
  <g filter="url(#cardShadow)">
    <rect x="250" y="560" width="580" height="250" rx="28" fill="#0b0f14" fill-opacity="0.78" stroke="#60a5fa" stroke-opacity="0.22"/>
    <rect x="250" y="560" width="580" height="250" rx="28" fill="url(#gridFade)"/>
    <text x="286" y="606" font-family="DejaVu Sans, Arial, sans-serif" font-size="16" font-weight="700" fill="#9ca3af" letter-spacing="2">OPERONFORGE</text>
    <text x="286" y="652" font-family="DejaVu Sans, Arial, sans-serif" font-size="34" font-weight="700" fill="#ffffff">Единая система</text>
    <text x="286" y="694" font-family="DejaVu Sans, Arial, sans-serif" font-size="34" font-weight="700" fill="url(#headlineAccent)">вместо хаоса</text>
    <g>
      ${[
        { x: 286, label: 'Сайт' },
        { x: 430, label: 'Заявки' },
        { x: 590, label: 'Telegram' },
        { x: 760, label: 'Админка' },
      ]
        .map(
          ({ x, label }) => `
        <rect x="${x}" y="726" width="118" height="42" rx="21" fill="#111827" stroke="#ffffff" stroke-opacity="0.08"/>
        <text x="${x + 59}" y="753" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-size="15" font-weight="600" fill="#d1d5db">${label}</text>`
        )
        .join('')}
    </g>
  </g>

  <!-- headline block -->
  <text x="540" y="980" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-size="58" font-weight="800" fill="#ffffff">Мы превращаем</text>
  <text x="540" y="1058" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-size="58" font-weight="800" fill="url(#headlineAccent)">хаос в систему</text>
  <text x="540" y="1120" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-size="24" fill="#9ca3af">Сайты · Заявки · Автоматизация</text>

  <!-- CTA -->
  <rect x="250" y="1168" width="580" height="78" rx="39" fill="url(#cta)" filter="url(#cardShadow)"/>
  <text x="540" y="1218" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-size="28" font-weight="800" fill="#ffffff">operonforge.com</text>

  <text x="540" y="1288" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-size="18" fill="#6b7280">Цифровые системы для бизнеса</text>
</svg>`
}

async function renderVariant({ width, height, outPath, logoScale = 0.34, logoTop = 56, fit = 'cover' }) {
  const svg = buildAdSvg()

  let pipeline = sharp(Buffer.from(svg)).resize(width, height, { fit, background: '#05070a' })

  const emblem = await sharp('src/assets/logo-symbol-trimmed.png')
    .resize({ height: Math.round(height * logoScale * (1080 / 1350)) })
    .toBuffer()
  const eMeta = await sharp(emblem).metadata()

  const text = await sharp('src/assets/logo-text-trimmed.png')
    .resize({ width: Math.round(width * 0.34) })
    .toBuffer()
  const tMeta = await sharp(text).metadata()

  const stackW = Math.max(eMeta.width, tMeta.width)
  const emblemLeft = Math.round((width - eMeta.width) / 2)
  const textLeft = Math.round((width - tMeta.width) / 2)
  const top = Math.round(logoTop * (height / H))

  pipeline = pipeline.composite([
    { input: emblem, left: emblemLeft, top },
    { input: text, left: textLeft, top: top + eMeta.height + Math.round(18 * (height / H)) },
  ])

  await pipeline.jpeg({ quality: 92, mozjpeg: true }).toFile(outPath)
  const sizeKb = (fs.statSync(outPath).size / 1024).toFixed(0)
  console.log(`saved ${outPath} (${sizeKb} KB)`)
}

fs.mkdirSync('brand', { recursive: true })

await renderVariant({
  width: 1080,
  height: 1350,
  outPath: 'brand/operonforge-instagram-feed-1080x1350.jpg',
})

await renderVariant({
  width: 1080,
  height: 1080,
  outPath: 'brand/operonforge-instagram-square-1080x1080.jpg',
  logoScale: 0.24,
  logoTop: 28,
  fit: 'contain',
})

function buildStorySvg() {
  const SH = 1920
  return buildAdSvg()
    .replace(`height="${H}"`, `height="${SH}"`)
    .replace(`viewBox="0 0 ${W} ${H}"`, `viewBox="0 0 ${W} ${SH}"`)
    .replace('y="980"', 'y="1180"')
    .replace('y="1058"', 'y="1258"')
    .replace('y="1120"', 'y="1320"')
    .replace('y="1168"', 'y="1450"')
    .replace('y="1218"', 'y="1500"')
    .replace('y="1288"', 'y="1580"')
    .replace('y="560"', 'y="700"')
    .replace('y="250"', 'y="390"')
    .replace('y="300"', 'y="440"')
}

async function renderStory() {
  const svg = buildStorySvg()
  let pipeline = sharp(Buffer.from(svg))

  const emblem = await sharp('src/assets/logo-symbol-trimmed.png').resize({ height: 300 }).toBuffer()
  const eMeta = await sharp(emblem).metadata()
  const text = await sharp('src/assets/logo-text-trimmed.png').resize({ width: 360 }).toBuffer()
  const tMeta = await sharp(text).metadata()

  const top = 110
  pipeline = pipeline.composite([
    { input: emblem, left: Math.round((W - eMeta.width) / 2), top },
    { input: text, left: Math.round((W - tMeta.width) / 2), top: top + eMeta.height + 20 },
  ])

  await pipeline.jpeg({ quality: 92, mozjpeg: true }).toFile('brand/operonforge-instagram-story-1080x1920.jpg')
  const sizeKb = (fs.statSync('brand/operonforge-instagram-story-1080x1920.jpg').size / 1024).toFixed(0)
  console.log(`saved brand/operonforge-instagram-story-1080x1920.jpg (${sizeKb} KB)`)
}

await renderStory()

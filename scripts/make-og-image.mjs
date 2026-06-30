import sharp from 'sharp'

const W = 1200
const H = 630

const bgSvg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g" cx="50%" cy="38%" r="75%">
      <stop offset="0%" stop-color="#0f1a2e"/>
      <stop offset="55%" stop-color="#080d15"/>
      <stop offset="100%" stop-color="#05070a"/>
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="32%" r="45%">
      <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#3b82f6" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <text x="${W / 2}" y="470" text-anchor="middle"
        font-family="Arial, 'Segoe UI', sans-serif" font-size="34" font-weight="400" fill="#9ca3af">
    Превращаем хаос в работающую систему
  </text>
  <text x="${W / 2}" y="545" text-anchor="middle"
        font-family="Arial, 'Segoe UI', sans-serif" font-size="22" font-weight="500" fill="#60a5fa" letter-spacing="2">
    САЙТЫ · ЗАЯВКИ · АВТОМАТИЗАЦИЯ
  </text>
</svg>`

const background = await sharp(Buffer.from(bgSvg)).png().toBuffer()

const emblem = await sharp('src/assets/logo-symbol-trimmed.png')
  .resize({ height: 190 })
  .toBuffer()
const eMeta = await sharp(emblem).metadata()

const text = await sharp('src/assets/logo-text-trimmed.png')
  .resize({ width: 420 })
  .toBuffer()
const tMeta = await sharp(text).metadata()

await sharp(background)
  .composite([
    { input: emblem, left: Math.round((W - eMeta.width) / 2), top: 110 },
    { input: text, left: Math.round((W - tMeta.width) / 2), top: 110 + eMeta.height + 30 },
  ])
  .jpeg({ quality: 88 })
  .toFile('public/og-image.jpg')

console.log('saved public/og-image.jpg')

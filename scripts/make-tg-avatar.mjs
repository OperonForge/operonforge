import sharp from 'sharp'

const SIZE = 1024

// Premium dark background with a soft blue radial glow (fills the TG circle nicely)
const bgSvg = `
<svg width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g" cx="50%" cy="42%" r="70%">
      <stop offset="0%" stop-color="#0f1a2e"/>
      <stop offset="55%" stop-color="#080d15"/>
      <stop offset="100%" stop-color="#05070a"/>
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="42%">
      <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.30"/>
      <stop offset="100%" stop-color="#3b82f6" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#g)"/>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#glow)"/>
</svg>`

const background = await sharp(Buffer.from(bgSvg)).png().toBuffer()

// ---- Variant 1: emblem + text (vertical stack) ----
{
  const emblemH = 430
  const emblem = await sharp('src/assets/logo-symbol-trimmed.png')
    .resize({ height: emblemH })
    .toBuffer()
  const eMeta = await sharp(emblem).metadata()

  const textW = 600
  const text = await sharp('src/assets/logo-text-trimmed.png')
    .resize({ width: textW })
    .toBuffer()
  const tMeta = await sharp(text).metadata()

  const gap = 46
  const stackH = eMeta.height + gap + tMeta.height
  const topY = Math.round((SIZE - stackH) / 2)

  await sharp(background)
    .composite([
      { input: emblem, left: Math.round((SIZE - eMeta.width) / 2), top: topY },
      { input: text, left: Math.round((SIZE - tMeta.width) / 2), top: topY + eMeta.height + gap },
    ])
    .png()
    .toFile('brand/operonforge-tg-avatar-emblem-text.png')
  console.log('saved brand/operonforge-tg-avatar-emblem-text.png')
}

// ---- Variant 2: emblem only (best for small circle) ----
{
  const emblemH = 620
  const emblem = await sharp('src/assets/logo-symbol-trimmed.png')
    .resize({ height: emblemH })
    .toBuffer()
  const eMeta = await sharp(emblem).metadata()

  await sharp(background)
    .composite([
      { input: emblem, left: Math.round((SIZE - eMeta.width) / 2), top: Math.round((SIZE - eMeta.height) / 2) },
    ])
    .png()
    .toFile('brand/operonforge-tg-avatar-emblem.png')
  console.log('saved brand/operonforge-tg-avatar-emblem.png')
}

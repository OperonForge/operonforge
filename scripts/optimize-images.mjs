import sharp from 'sharp'
import fs from 'fs'

const files = [
  { in: 'src/assets/hero-system-bg.png', out: 'src/assets/hero-system-bg.webp', q: 82 },
  { in: 'src/assets/case-fd-portal.png', out: 'src/assets/case-fd-portal.webp', q: 80 },
  { in: 'src/assets/case-atelier-restauro.png', out: 'src/assets/case-atelier-restauro.webp', q: 80 },
  { in: 'src/assets/case-cafe555.png', out: 'src/assets/case-cafe555.webp', q: 80 },
]

for (const f of files) {
  const before = fs.statSync(f.in).size
  await sharp(f.in).webp({ quality: f.q }).toFile(f.out)
  const after = fs.statSync(f.out).size
  console.log(
    `${f.out}  ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`
  )
}

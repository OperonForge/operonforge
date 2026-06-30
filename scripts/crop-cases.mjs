import sharp from 'sharp'

const SRC = 'C:/Users/skanj/AppData/Local/Temp/cursor/screenshots/'

// Source shots are 2544x1616 with a scrollbar near the right edge.
// Crop to content in a 16:10 ratio, then downscale to 1280px wide.
const jobs = [
  { in: 'atelier-shot.png', out: 'src/assets/case-atelier-restauro.png' },
  { in: 'kompleks555-shot.png', out: 'src/assets/case-cafe555.png' },
]

const CROP_W = 2120
const CROP_H = Math.round((CROP_W * 10) / 16) // 1325

for (const j of jobs) {
  await sharp(SRC + j.in)
    .extract({ left: 0, top: 0, width: CROP_W, height: CROP_H })
    .resize({ width: 1280 })
    .png()
    .toFile(j.out)
  console.log('saved', j.out)
}

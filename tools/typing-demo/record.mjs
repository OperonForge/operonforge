/**
 * Запись видео с набором кода (высокое качество).
 * Запуск: node tools/typing-demo/record.mjs
 */
import { chromium } from 'playwright'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const htmlPath = path.join(__dirname, 'index.html')
const outputDir = path.join(__dirname, 'output')
const sourcePath = path.join(__dirname, '../../src/core/PipelineOrchestrator.js')

const WIDTH = 2560
const HEIGHT = 1440

fs.mkdirSync(outputDir, { recursive: true })

const source = fs.readFileSync(sourcePath, 'utf8')

// Старт с середины файла — метод #executeRun
const splitMarker = 'async #executeRun(run) {'
let prefillLength = source.indexOf(splitMarker)
if (prefillLength === -1) {
  prefillLength = Math.floor(source.length * 0.48)
}

const demoData = {
  source,
  prefillLength,
  typing: {
    charDelayMin: 5,
    charDelayMax: 13,
    newlinePauseMin: 18,
    newlinePauseMax: 40,
  },
}

const demoDataJs = `window.__TYPING_DEMO__ = ${JSON.stringify(demoData)}`
fs.writeFileSync(path.join(__dirname, 'demo-data.js'), demoDataJs)

const startLine = source.slice(0, prefillLength).split('\n').length
const charsToType = source.length - prefillLength
console.log(`Источник: ${sourcePath}`)
console.log(`Старт: строка ~${startLine}, печатаем ещё ~${charsToType} символов`)
console.log('Запись', `${WIDTH}x${HEIGHT}`, '…')

const htmlUrl = `file:///${htmlPath.replace(/\\/g, '/')}`

const browser = await chromium.launch({
  headless: true,
  args: ['--disable-dev-shm-usage'],
})

const context = await browser.newContext({
  recordVideo: {
    dir: outputDir,
    size: { width: WIDTH, height: HEIGHT },
  },
  viewport: { width: WIDTH, height: HEIGHT },
  deviceScaleFactor: 1,
})

const page = await context.newPage()
page.setDefaultTimeout(10 * 60 * 1000)
await page.goto(htmlUrl)

await page.waitForFunction(
  () => window.typingComplete === true,
  undefined,
  { timeout: 10 * 60 * 1000 },
)

await page.waitForTimeout(800)

const video = page.video()
await context.close()
await browser.close()

const savedPath = await video.path()
const targetWebm = path.join(outputDir, 'typing-demo.webm')

if (fs.existsSync(targetWebm)) fs.unlinkSync(targetWebm)
fs.renameSync(savedPath, targetWebm)

const sizeMb = (fs.statSync(targetWebm).size / 1024 / 1024).toFixed(1)
console.log(`\n✓ Видео: ${targetWebm}`)
console.log(`  Размер: ${sizeMb} MB · ${WIDTH}x${HEIGHT}`)

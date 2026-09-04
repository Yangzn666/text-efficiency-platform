// 抓取研砖（mathbrick.cn）考研英语一翻译真题数据
// 数据源：GET https://www.mathbrick.cn/api/passages/en1/{year}-t5（免登录）
// 产出：public/data/english/translation-exams.json
// 用法：node scripts/fetch-translation-exams.mjs
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const START = 2005
const END = 2025

const years = []
for (let y = START; y <= END; y++) {
  const url = `https://www.mathbrick.cn/api/passages/en1/${y}-t5`
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    const sentences = (data.sentences || []).map((s, i) => ({
      id: s.sid || `en1-${y}-t5-s${i + 1}`,
      no: i + 1,
      en: s.s || '',
      zh: s.zh || '',
      trunk: s.trunk || null,
      components: s.components || []
    }))
    if (!sentences.length) throw new Error('无句子数据')
    years.push({ year: y, title: data.title || '', sentences })
    console.log(`✅ ${y}：${sentences.length} 句`)
  } catch (e) {
    console.error(`❌ ${y}：${e.message}`)
  }
}

const out = {
  source: 'mathbrick.cn（研砖）',
  fetchedAt: new Date().toISOString().slice(0, 10),
  years
}
const outPath = join(__dirname, '..', 'public', 'data', 'english', 'translation-exams.json')
mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf-8')
console.log(`\n共 ${years.length} 个年份，已写入 ${outPath}`)

// 英语阅读题库按年拆分生成器（P2 数据与性能）
// ---------------------------------------------------------------------------
// 作用：把 public/data/english/reading-questions.json（整文件 ~6MB）拆成
//   - public/data/english/reading/index.json       轻量索引（题干/选项/答案/元信息，~400KB）
//   - public/data/english/reading/by-year/<年>.json 该年重字段(article/analysis/tips/errorAnalysis)
// ReadingPractice.vue 首屏只 fetch index，点开某年/某篇时才按需拉对应年份，
// 手机端首开英语阅读网络量从 ~6MB 降到几十 KB。原整文件保留供精读页(IntensiveReadingView)使用。
//
// ★ 维护：每次编辑 reading-questions.json（新增题/改解析）后，必须重跑本脚本再 build，
//   否则 index/by-year 会与源文件不一致。命令：
//     node scripts/gen-reading-split.js                       # 个人版 frontend
//     node scripts/gen-reading-split.js ../frontend-share      # 共享版
// ---------------------------------------------------------------------------
const fs = require('fs')
const path = require('path')

// 默认作用于本脚本所在工程的前端根目录；也可用 argv[2] 指定前端根（如 ../frontend-share）
const FE_ROOT = process.argv[2]
  ? path.resolve(__dirname, '..', process.argv[2])
  : path.resolve(__dirname, '..')
const PUB = path.join(FE_ROOT, 'public', 'data', 'english')
const SRC = path.join(PUB, 'reading-questions.json')
const OUT = path.join(PUB, 'reading')
const BY = path.join(OUT, 'by-year')
const HEAVY = ['article', 'analysis', 'tips', 'errorAnalysis']

if (!fs.existsSync(SRC)) { console.error('找不到源文件：' + SRC); process.exit(1) }

const doc = JSON.parse(fs.readFileSync(SRC, 'utf8'))
const qs = doc.questions || []
if (!qs.length) throw new Error('no questions')

const qkey = (q) => `${q.year}-${q.section}-${q.textNumber}-${q.number}`

const lightList = []
const yearMap = {} // year -> { [key]: {heavy fields} }
let heavyBytes = 0, lightBytes = 0
for (const q of qs) {
  const light = {}
  const heavy = {}
  for (const k of Object.keys(q)) {
    if (HEAVY.includes(k)) {
      if (q[k] !== undefined && q[k] !== null && q[k] !== '') heavy[k] = q[k]
    } else light[k] = q[k]
  }
  lightList.push(light)
  const y = q.year
  if (!yearMap[y]) yearMap[y] = {}
  yearMap[y][qkey(q)] = heavy
  lightBytes += JSON.stringify(light).length
  heavyBytes += JSON.stringify(heavy).length
}

fs.mkdirSync(BY, { recursive: true })
const indexDoc = { meta: doc.meta || {}, questions: lightList }
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(indexDoc), 'utf8')
let files = []
for (const y of Object.keys(yearMap).sort()) {
  const name = `${y}.json`
  fs.writeFileSync(path.join(BY, name), JSON.stringify(yearMap[y]), 'utf8')
  files.push(name)
}
console.log('[gen-reading-split] 目标:', FE_ROOT)
console.log('questions', qs.length)
console.log('index.json ~', lightBytes.toLocaleString(), 'bytes => on disk', fs.statSync(path.join(OUT, 'index.json')).size.toLocaleString())
console.log('heavy total ~', heavyBytes.toLocaleString(), 'bytes across', files.length, 'year files')
console.log('years:', files.map(f => f.replace('.json', '')).join(','))

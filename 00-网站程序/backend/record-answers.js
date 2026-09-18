/**
 * 英语真题作答录入（个人版网站）
 *
 * 用法：
 *   node record-answers.js <年份> <完型|textN> "<答案串>" [作答日期YYYY-MM-DD]
 * 示例：
 *   node record-answers.js 2006 完型 "DADAD CBCAD DBDCC DBDAB"
 *   node record-answers.js 2006 text4 "DDDBD" 2026-09-06
 *
 * 写入 frontend/public/data/english/reading-questions.json 的 userAnswer 与 answeredAt 字段，
 * 并同步到 dist/，保持原有 CRLF 与 2 空格缩进。
 * 第四个参数缺省时取当天日期；补录历史作答时必须显式传入，否则会把旧数据错标成今天。
 */
const fs = require('fs')
const path = require('path')

const PUBLIC_FILE = path.join(__dirname, '../frontend/public/data/english/reading-questions.json')
const DIST_FILE = path.join(__dirname, '../frontend/dist/data/english/reading-questions.json')

const [yearArg, targetArg, answersArg, dateArg] = process.argv.slice(2)
if (!yearArg || !targetArg || !answersArg) {
  console.error('用法：node record-answers.js <年份> <完型|textN> "<答案串>" [作答日期YYYY-MM-DD]')
  process.exit(1)
}

const YEAR = Number(yearArg)
const ANSWERS = answersArg.toUpperCase().replace(/[^A-D]/g, '').split('')
// 取本地日期（toISOString 是 UTC，深夜刷题会少一天）
const now = new Date()
const LOCAL_TODAY = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
const ANSWERED_AT = dateArg || LOCAL_TODAY
if (!/^\d{4}-\d{2}-\d{2}$/.test(ANSWERED_AT)) {
  console.error('作答日期格式必须是 YYYY-MM-DD')
  process.exit(1)
}

let SECTION, TEXT
if (/^完型$|^cloze$/i.test(targetArg)) {
  SECTION = 'Use of English'
  TEXT = 0
} else {
  const m = targetArg.match(/^text\s*(\d+)$/i)
  if (!m) {
    console.error('第二个参数必须是「完型」或「textN」')
    process.exit(1)
  }
  SECTION = 'Traditional Reading'
  TEXT = Number(m[1])
}

const data = JSON.parse(fs.readFileSync(PUBLIC_FILE, 'utf8'))
const targets = data.questions
  .filter(q => q.year === YEAR && q.section === SECTION && q.textNumber === TEXT)
  .sort((a, b) => a.number - b.number)

if (targets.length === 0) {
  console.error(`未找到题目：${YEAR} / ${SECTION} / textNumber=${TEXT}`)
  process.exit(1)
}
if (targets.length !== ANSWERS.length) {
  console.error(`答案数量不匹配：题目 ${targets.length} 道，答案 ${ANSWERS.length} 个`)
  process.exit(1)
}

const label = TEXT ? `${YEAR} Text ${TEXT}` : `${YEAR} 完型填空`
console.log(`\n录入 ${label}（作答日期 ${ANSWERED_AT}）\n${'='.repeat(52)}`)

let correct = 0
const wrongList = []
const typeStat = {}

targets.forEach((q, i) => {
  q.userAnswer = ANSWERS[i]
  q.answeredAt = ANSWERED_AT
  const ok = q.userAnswer === q.correctAnswer
  if (ok) correct++
  else wrongList.push({ number: q.number, type: q.type, user: q.userAnswer, right: q.correctAnswer })

  const t = q.type || '未分类'
  typeStat[t] = typeStat[t] || { total: 0, correct: 0 }
  typeStat[t].total++
  if (ok) typeStat[t].correct++

  console.log(`第${String(q.number).padStart(2)}题 [${q.type}] 你 ${q.userAnswer} / 正确 ${q.correctAnswer} ${ok ? '✅' : '❌'}`)
})

const output = JSON.stringify(data, null, 2).replace(/\n/g, '\r\n')
fs.writeFileSync(PUBLIC_FILE, output, 'utf8')
if (fs.existsSync(path.dirname(DIST_FILE))) {
  fs.writeFileSync(DIST_FILE, output, 'utf8')
  console.log('\n已同步 dist/')
}

console.log(`${'='.repeat(52)}`)
console.log(`${label}：${correct}/${targets.length}（${Math.round((correct / targets.length) * 100)}%）`)

if (wrongList.length) {
  console.log('\n错题清单：')
  wrongList.forEach(w => console.log(`  第${w.number}题 [${w.type}] ${w.user} → ${w.right}`))
}

console.log('\n按题型统计：')
Object.entries(typeStat).forEach(([t, s]) => {
  console.log(`  ${t}：${s.correct}/${s.total}`)
})
console.log('')

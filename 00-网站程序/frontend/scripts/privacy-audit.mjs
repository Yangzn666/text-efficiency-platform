// 隐私审计（#16）· 构建后扫描 dist，防止私人数据被打进公开版
//
// 背景：站点部署在 GitHub Pages，public/ 下的 JSON 谁都能直接下载。
// 「今日回炉」的到期队列、408 进度、政治漏洞地图、公式背诵卡、费曼/技能树状态
// 都是个人学习数据，一旦进公开站等于把底牌挂在网上。
//
// 用法：
//   node scripts/privacy-audit.mjs            # 审计个人版 dist（只报告，不判失败）
//   node scripts/privacy-audit.mjs dist --share  # 审计共享版 dist（发现私有数据即退出码 1）
//
// 检查两类：
//   ① 私有文件/目录是否存在于 dist（按路径前缀）；
//   ② 构建产物里是否残留个人信息字符串（院校、邮箱、绝对路径、私人队列名）。
import { readdirSync, statSync, readFileSync, existsSync } from 'fs'
import { resolve, join, extname, relative } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const here = dirname(fileURLToPath(import.meta.url))
const args = process.argv.slice(2)
const distArg = args.find(a => !a.startsWith('--')) || 'dist'
const dist = resolve(here, '..', distArg)
const share = args.includes('--share')

if (!existsSync(dist)) {
  console.error(`[privacy-audit] 找不到构建目录：${dist}`)
  process.exit(2)
}

const PRIVATE_PREFIXES = [
  'data/queues/',
  'data/formulas/',
  'data/feynman/',
  'data/skilltree/',
  'data/408-exam/progress.json',
  'data/408-exam/choice-progress.json',
  'data/politics/vuln-map.json',
  'data/politics/wrong-letters.json',
  'data/english/translation-progress.json',
  'data/english/intensive-reading-analysis.json',
  'data/math/drill-plan.json'
]

const SENSITIVE = [
  { re: /浙大海宁/g, label: '目标院校（浙大海宁）' },
  { re: /2142744149/g, label: 'QQ 邮箱号' },
  { re: /yangzhenning|Yangzn666/gi, label: 'GitHub/用户名' },
  { re: /[A-Za-z]:[\\/]学习[\\/]效率/g, label: '本机绝对路径 D:\\学习\\效率' },
  { re: /essay-recite|writing-coach|long-sentence-drill|feishu-sync|study-notify/gi, label: '本地私人队列目录名' }
]

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const st = statSync(p)
    if (st.isDirectory()) walk(p, out)
    else out.push({ p, size: st.size })
  }
  return out
}

const files = walk(dist)
const privateHits = []
let privateBytes = 0
for (const f of files) {
  const rel = relative(dist, f.p).replace(/\\/g, '/')
  if (PRIVATE_PREFIXES.some(pre => rel === pre || rel.startsWith(pre))) {
    privateHits.push(rel)
    privateBytes += f.size
  }
}

// 字符串扫描：跳过图片/字体/大压缩包，只扫 js/css/html/json/md/sw
const TEXT_EXT = new Set(['.js', '.css', '.html', '.json', '.md', '.mjs'])
const strHits = []
for (const f of files) {
  if (!TEXT_EXT.has(extname(f.p).toLowerCase())) continue
  if (f.size > 3 * 1024 * 1024) continue
  let text = ''
  try { text = readFileSync(f.p, 'utf8') } catch { continue }
  for (const s of SENSITIVE) {
    s.re.lastIndex = 0
    const m = s.re.exec(text)
    if (m) {
      strHits.push({ file: relative(dist, f.p).replace(/\\/g, '/'), label: s.label, sample: m[0].slice(0, 60) })
    }
  }
}

const mb = (n) => (n / 1048576).toFixed(2) + 'MB'
console.log(`\n[privacy-audit] 目录 ${dist}${share ? '（共享版，严格模式）' : '（个人版，仅报告）'}`)
console.log(`[privacy-audit] 文件 ${files.length} 个，总体积 ${mb(files.reduce((s, f) => s + f.size, 0))}`)
console.log(`\n① 私有数据文件：${privateHits.length} 个，合计 ${mb(privateBytes)}`)
privateHits.slice(0, 30).forEach(h => console.log('   · ' + h))
if (privateHits.length > 30) console.log(`   … 其余 ${privateHits.length - 30} 个省略`)
if (share && privateHits.length) {
  console.log('   ✗ 共享版不允许包含私有数据：检查 vite.config 的 shareGlobIgnores 与 prune-share-dist.mjs')
}

console.log(`\n② 个人信息字符串：${strHits.length} 处`)
const seen = new Set()
strHits.forEach(h => {
  const k = h.file + '|' + h.label
  if (seen.has(k)) return
  seen.add(k)
  console.log(`   · ${h.file} → ${h.label}（${h.sample}）`)
})

const fail = share && (privateHits.length > 0)
if (!share) {
  console.log('\n提示：个人版本来就有这些数据；真正要防的是共享版。发布前跑 npm run build:share 会自动执行严格审计。')
  console.log('剩余需人工决策：① 两个 GitHub 仓库是否转私有（需 Pro）；② 或给 Pages 加 Cloudflare Access/加密代理。')
}
console.log(fail ? '\n[privacy-audit] 结果：失败 ✗' : '\n[privacy-audit] 结果：通过 ✓')
process.exit(fail ? 1 : 0)

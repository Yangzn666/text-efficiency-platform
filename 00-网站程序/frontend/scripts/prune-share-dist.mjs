// P5 方案 B：共享版构建产物裁剪（排除清单执行端）
// 由 `npm run build:share` 在 vite build 之后调用：把个人 public/ 拷进 dist 的
// 私有静态资源删除，使 share dist ≈ frontend-share 现状（其 public 本就没有这些文件）。
// 与 vite.config 的 shareGlobIgnores 一一对应（那边管 sw 预缓存，这边管物理删除）。
import { rmSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const here = dirname(fileURLToPath(import.meta.url))
const dist = resolve(here, '..', 'dist')

// 相对 dist 根的私有路径（含目录）
const PRIVATE = [
  '1000题A组第一章错题.json',
  '1000题A组错题导入模板.json',
  '1000题A组错题导入说明.md',
  'cloze-test.html',
  'init-math-chapters.html',
  'english-resources',
  'data/english/intensive-reading-analysis.json',
  'data/english/translation-exams.json'
]

let removed = 0
for (const rel of PRIVATE) {
  const p = resolve(dist, rel)
  if (existsSync(p)) {
    rmSync(p, { recursive: true, force: true })
    removed++
    console.log('[prune-share-dist] 删除', rel)
  }
}
console.log(`[prune-share-dist] 完成，删除 ${removed}/${PRIVATE.length} 项`)

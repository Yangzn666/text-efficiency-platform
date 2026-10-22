// 把 408 真题大题渲染成手机友好的 HTML（供 headless Edge 截图发微信）
// 用法: node scripts/gen-408-question-image.mjs <slug> [q|a]
//   q = 只渲染题干(默认)   a = 题干+解析(带 KaTeX)
import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

const ROOT = 'D:/学习/效率/00-网站程序/frontend';
const DATA = path.join(ROOT, 'public/data/408-exam/questions.json');
const DIST = path.join(ROOT, 'dist');
const BASE = '/text-efficiency-platform';

const slug = process.argv[2];
const mode = (process.argv[3] || 'q').toLowerCase();
if (!slug) { console.error('need slug'); process.exit(1); }

const d = JSON.parse(fs.readFileSync(DATA, 'utf8'));
const it = d.items.find(x => x.slug === slug);
if (!it) { console.error('slug not found: ' + slug); process.exit(1); }

// 幂等：把本地 katex/dist 拷进 dist/vendor/katex，供 file:// 离线渲染公式
const katexSrc = path.join(ROOT, 'node_modules/katex/dist');
const katexDst = path.join(DIST, 'vendor/katex');
if (!fs.existsSync(path.join(katexDst, 'katex.min.js'))) {
  fs.mkdirSync(katexDst, { recursive: true });
  fs.cpSync(katexSrc, katexDst, { recursive: true });
}

const SUBJ = { ds: '数据结构', co: '计算机组成原理', os: '操作系统', cn: '计算机网络' };
const tags = (it.tags || []).map(t => `<span class="tag">${t}</span>`).join('');

// 图片路径转成相对 dist 根的路径（file:// 与 http server 两种方式都能加载）
function fixImgs(md) {
  return md.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (m, alt, src) => {
    if (/^https?:/.test(src)) return m;
    let s = src.replace(/^\.?\/?(text-efficiency-platform\/)?data\/408-exam\//, '');
    return `![${alt}](data/408-exam/${s})`;
  });
}

// 把 ```bits-layout``` 代码块渲染成真正的字段框图（位号 + 字段名 + 分组）
function renderBitsLayout(block) {
  const lines = block.split('\n');
  let width = 0;
  const fields = [];
  const groups = [];
  let section = null;
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    let m;
    if ((m = line.match(/^width\s*[:：]\s*(\d+)/))) { width = +m[1]; section = 'width'; continue; }
    if (/^fields\s*[:：]/.test(line)) { section = 'fields'; continue; }
    if (/^groups\s*[:：]/.test(line)) { section = 'groups'; continue; }
    if ((m = line.match(/^\[(\d+)\s*[,，]\s*(\d+)\]\s*(.*)$/))) {
      const hi = +m[1], lo = +m[2], name = m[3].trim();
      (section === 'groups' ? groups : fields).push({ hi, lo, name });
    }
  }
  if (!width) {
    const maxb = Math.max(0, ...fields.map(f => f.hi), ...groups.map(g => g.hi));
    width = maxb + 1;
  }
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  // 位号行：从 width-1 到 0
  let numRow = '';
  for (let b = width - 1; b >= 0; b--) numRow += `<td>${b}</td>`;
  // 字段行：按 hi 降序合并
  const fs = fields.slice().sort((a, b) => b.hi - a.hi);
  let fieldRow = '';
  fs.forEach((f, i) => {
    const span = f.hi - f.lo + 1;
    const tint = i % 2 ? 'bf-b' : 'bf-a';
    fieldRow += `<td colspan="${span}" class="${tint}">${esc(f.name)}</td>`;
  });
  // 分组行（可选）
  let groupRow = '';
  if (groups.length) {
    const gs = groups.slice().sort((a, b) => b.hi - a.hi);
    groupRow = '<tr class="bitgroup">' + gs.map(g =>
      `<td colspan="${g.hi - g.lo + 1}">${esc(g.name)}</td>`).join('') + '</tr>';
  }
  return `<div class="bitswrap"><table class="bitmap">` +
    `<tr class="bitnum">${numRow}</tr>` +
    `<tr class="bitfield">${fieldRow}</tr>` +
    groupRow +
    `</table></div>`;
}

function expandBits(md) {
  return String(md).replace(/```bits-layout\s*\n([\s\S]*?)```/g, (m, body) => '\n' + renderBitsLayout(body) + '\n');
}

const bodyHtml =
  marked(fixImgs(expandBits(it.stem || ''))) +
  (mode === 'a' ? `<hr class="sep"/><div class="ans"><h3>答案与解析</h3>${marked(fixImgs(expandBits(it.explanation || '')))}</div>` : '');

const katex = `<link rel="stylesheet" href="vendor/katex/katex.min.css">`;
const katexJs = `
<script src="vendor/katex/katex.min.js"></script>
<script src="vendor/katex/contrib/auto-render.min.js"
  onload="renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],throwOnError:false});"></script>`;

const html = `<!doctype html><html lang="zh"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">${katex}
<style>
  html,body{margin:0;padding:0;background:#f4f1ea;}
  .card{width:560px;margin:0 auto;background:#fffdf7;
    font-family:-apple-system,"Segoe UI","Microsoft YaHei",sans-serif;
    color:#2b2b2b;padding:30px 26px 36px;box-sizing:border-box;line-height:2.0;font-size:19px;}
  .hd{border-left:6px solid #c0392b;padding-left:12px;margin-bottom:10px;}
  .hd .kicker{color:#c0392b;font-weight:700;font-size:16px;letter-spacing:1px;}
  .hd .title{font-size:26px;font-weight:800;margin-top:3px;}
  .meta{color:#7a6f5f;font-size:15.5px;margin:12px 0 20px;}
  .tag{display:inline-block;background:#efe6d3;color:#8a6d3b;border-radius:10px;
    padding:2px 11px;font-size:14px;margin:0 5px 5px 0;}
  p{margin:16px 0;}
  pre{background:#2d2a26;color:#e8e2d5;border-radius:10px;padding:18px 18px;
    white-space:pre-wrap;word-break:break-word;overflow-x:hidden;font-size:16.5px;line-height:2.0;font-family:"Cascadia Code",Consolas,monospace;}
  code{font-family:"Cascadia Code",Consolas,monospace;}
  p>code,li>code{background:#f0e9db;color:#b03a2e;padding:1px 6px;border-radius:5px;font-size:17px;}
  ol,ul{padding-left:26px;} li{margin:9px 0;}
  hr.sep{border:none;border-top:2px dashed #d9cbb0;margin:26px 0;}
  .ans h3{color:#1e6b52;border-left:6px solid #1e6b52;padding-left:10px;font-size:22px;}
  img{max-width:100%;border-radius:6px;display:block;margin:16px auto;}
  table{border-collapse:collapse;width:100%;margin:16px 0;font-size:16.5px;table-layout:fixed;}
  th,td{border:1px solid #d9cbb0;padding:9px 8px;text-align:center;word-break:break-word;}
  .qno{color:#c0392b;font-weight:700;}
  .bitswrap{overflow-x:auto;margin:18px 0;}
  .bitmap{border-collapse:collapse;width:100%;table-layout:fixed;margin:0 auto;}
  .bitmap td{border:1px solid #b9a887;padding:0;text-align:center;}
  .bitnum td{background:#efe6d3;color:#8a6d3b;font-size:12px;padding:3px 0;font-family:"Cascadia Code",Consolas,monospace;}
  .bitfield td{height:46px;font-weight:800;color:#122019;font-size:16px;}
  .bitfield .bf-a{background:#fdf3e7;}
  .bitfield .bf-b{background:#eaf1ec;}
  .bitgroup td{background:#f3ecdd;color:#8a6414;font-size:14px;padding:6px 0;font-weight:700;}
</style></head><body>
<div class="card" id="card">
  <div class="hd">
    <div class="kicker">408 真题 · 综合应用题</div>
    <div class="title">${SUBJ[it.subject] || it.subject} · ${it.year} 年第 ${it.index} 题</div>
  </div>
  <div class="meta">分值 ${it.score} 分 ｜ ${it.chapterName} ${tags}</div>
  ${bodyHtml}
</div>
<script>document.title='H:'+document.getElementById('card').getBoundingClientRect().height;</script>
${katexJs}
</body></html>`;

const fname = `q408-${slug}${mode === 'a' ? '-a' : ''}.html`;
fs.writeFileSync(path.join(DIST, fname), html, 'utf8');
const fileUrl = 'file:///' + path.join(DIST, fname).replace(/\\/g, '/');
console.log(JSON.stringify({ file: fname, fileUrl, url: `http://localhost:4173${BASE}/${fname}`, width: 560 }));

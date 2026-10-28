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

// 把 ```file-system-tree``` 代码块渲染成目录树图 + 簇号表
function renderFileSystemTree(block) {
  const lines = block.split('\n');
  let section = null;
  const nodes = {};      // name -> {type, children[]}
  const order = [];
  let columns = [];
  const rows = [];
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    let m;
    if (/^tree\s*[:：]/.test(line)) { section = 'tree'; continue; }
    if ((m = line.match(/^columns?\s*[:：]\s*(.*)$/))) {
      section = 'columns';
      columns = m[1].split(/[,，]/).map(s => s.trim()).filter(Boolean);
      continue;
    }
    if (/^rows?\s*[:：]/.test(line)) { section = 'rows'; continue; }
    if (section === 'tree') {
      const g = line.match(/^([A-Za-z0-9_\-\u4e00-\u9fa5]+)\s*(?:\[(\w+)\])?\s*(?::\s*(.*))?$/);
      if (g) {
        const name = g[1];
        const type = (g[2] || '').toLowerCase();
        const kids = (g[3] || '').split(/[,，、]/).map(s => s.trim()).filter(Boolean);
        if (!nodes[name]) { nodes[name] = { type, children: [] }; order.push(name); }
        if (type) nodes[name].type = type;
        nodes[name].children.push(...kids.filter(k => !nodes[name].children.includes(k)));
      }
    } else if (section === 'rows') {
      rows.push(line.split('|').map(s => s.trim()));
    }
  }
  // 根节点 = 从没当过别人孩子的节点
  const childSet = new Set();
  order.forEach(n => nodes[n].children.forEach(c => childSet.add(c)));
  const roots = order.filter(n => !childSet.has(n));
  function nodeHtml(name) {
    const nd = nodes[name] || { type: '', children: [] };
    const cls = nd.type === 'dir' ? 'ftdir' : 'ftfile';
    const badge = nd.type ? `<span class="ftbadge">${esc(nd.type)}</span>` : '';
    let html = `<li><span class="ftnode ${cls}">${esc(name)}</span>${badge}`;
    if (nd.children.length) html += '<ul>' + nd.children.map(nodeHtml).join('') + '</ul>';
    return html + '</li>';
  }
  const treeHtml = `<ul class="fstree">` + roots.map(nodeHtml).join('') + `</ul>`;
  let tableHtml = '';
  if (columns.length && rows.length) {
    tableHtml = `<table class="fstab"><thead><tr>` +
      columns.map(c => `<th>${esc(c)}</th>`).join('') + `</tr></thead><tbody>` +
      rows.map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('') +
      `</tbody></table>`;
  }
  return `<div class="fswrap"><div class="fslabel">目录树结构</div>${treeHtml}` +
    (tableHtml ? `<div class="fslabel" style="margin-top:14px">各文件占用的簇号</div>${tableHtml}` : '') +
    `</div>`;
}

function expandBits(md) {
  return String(md)
    .replace(/```bits-layout\s*\n([\s\S]*?)```/g, (m, body) => '\n' + renderBitsLayout(body) + '\n')
    .replace(/```file-system-tree\s*\n([\s\S]*?)```/g, (m, body) => '\n' + renderFileSystemTree(body) + '\n');
}

// 保护 LaTeX：marked 会把公式里的 \& 反斜杠吃掉变成裸 &，导致 KaTeX 报错(渲染成红色源码)。
// 先把 $$..$$ / $..$ 换成占位符交给 marked，事后再还原并对 & < > 做 HTML 转义，
// 这样 DOM textContent 会原样回到 KaTeX 需要的 LaTeX(含 \&)。
function protectMath(md) {
  const store = [];
  const s = String(md)
    .replace(/\$\$[\s\S]+?\$\$/g, m => { store.push(m); return '@@QMX' + (store.length - 1) + '@@'; })
    .replace(/\$([^$\n]+?)\$/g, (m, g) => { store.push('$' + g + '$'); return '@@QMX' + (store.length - 1) + '@@'; });
  return { s, store };
}
function restoreMath(html, store) {
  return html.replace(/@@QMX(\d+)@@/g, (m, i) => {
    const raw = store[+i] || m;
    return raw.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  });
}
function renderMd(md) {
  const { s, store } = protectMath(md);
  return restoreMath(marked(s), store);
}

const bodyHtml =
  renderMd(fixImgs(expandBits(it.stem || ''))) +
  (mode === 'a' ? `<div class="gap"></div><hr class="sep"/><div class="ans"><h3>答案与解析</h3>${renderMd(fixImgs(expandBits(it.explanation || '')))}</div>` : '');

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
  .gap{height:1050px;}
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
  .fswrap{background:#f3ecdd;border:1px solid #d9cbb0;border-radius:10px;padding:16px 18px;margin:18px 0;}
  .fslabel{font-weight:800;color:#8a6d3b;font-size:16px;margin-bottom:8px;}
  .fstree,.fstree ul{list-style:none;margin:0;padding-left:0;}
  .fstree ul{margin:4px 0 4px 9px;padding-left:20px;border-left:2px solid #cbb98f;}
  .fstree li{margin:7px 0;}
  .ftnode{display:inline-block;padding:4px 13px;border-radius:8px;font-weight:800;font-size:16px;}
  .ftdir{background:#e7efe7;color:#3f6b45;border:1.5px solid #a9c7a9;}
  .ftfile{background:#f6e3d8;color:#a4472f;border:1.5px solid #d9a488;}
  .ftbadge{font-size:12px;color:#8a6d3b;background:#fff;border:1px solid #d9cbb0;border-radius:6px;padding:1px 7px;margin-left:7px;}
  .fstab{margin-top:4px;}
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

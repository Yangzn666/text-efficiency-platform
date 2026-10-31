// 公式挖空 · 挖哪个洞、怎么判分、什么时候毕业
//
// 规则（尽量避免「明明写对了判错」）：
//   1) 每条公式只挖 1 个洞，优先挖「最容易被记错的那一位」：系数/分数 > 指数 > 希腊字母 > 函数名 > 运算符
//   2) 同一条卡每次都挖同一个洞（按 id 哈希选），避免今天挖系数明天挖符号，复习不可比
//   3) 判分先做等价归一（\frac{1}{2} = 1/2 = 0.5、（−2）=−2、π = pi），再比字符串；
//      仍判错时给「我写对了（等价）」自判出口，点了就算对——机器不懂你的写法，你懂。
//   4) 连对 2 次毕业（与错题本 GRADUATE_STREAK 一致），答错清零、当天回炉。
import { ref } from 'vue'

export interface ClozeCard {
  blanked: string
  answer: string
  answerLatex?: string
  mode: 'latex' | 'text'
  hasBlank: boolean
}

export interface ClozeRecord {
  streak: number
  wrong: number
  last: string
  due: string
  done: number
}

const KEY = 'formula-cloze-v1'
export const GRADUATE_STREAK = 2

const GREEK: Record<string, string> = {
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', theta: 'θ', lambda: 'λ',
  mu: 'μ', sigma: 'σ', pi: 'π', rho: 'ρ', varphi: 'φ', phi: 'φ', omega: 'ω',
  Delta: 'Δ', Sigma: 'Σ', varepsilon: 'ε', epsilon: 'ε', eta: 'η', tau: 'τ'
}
const GREEK_NAME = Object.fromEntries(Object.entries(GREEK).map(([k, v]) => [v, k]))

const FUNCS = ['sin', 'cos', 'tan', 'cot', 'sec', 'csc', 'ln', 'log', 'arcsin', 'arccos', 'arctan', 'lim', 'max', 'min']
const OPS: Record<string, string> = {
  pm: '±', mp: '∓', le: '≤', ge: '≥', ne: '≠', to: '→', approx: '≈',
  times: '×', cdot: '·', div: '÷', infty: '∞'
}

function today(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function shift(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

const isLatex = (s: string) => /\\[a-zA-Z]+|[{}^_]/.test(s)

interface Cand { start: number; end: number; score: number; answer: string; latex?: string }

/** 找出可挖的候选（越靠前分数越高；最终取最高分档里按 id 哈希挑一个） */
function candidates(src: string, latex: boolean): Cand[] {
  const out: Cand[] = []
  const push = (m: RegExpExecArray, score: number, answer: string, latexAnswer?: string) => {
    // 太短或整个公式唯一的 token 都跳过（挖掉就等于整题没给）
    if (m[0].length >= src.length - 2) return
    out.push({ start: m.index, end: m.index + m[0].length, score, answer, latex: latexAnswer })
  }

  if (latex) {
    // 分数
    for (const m of src.matchAll(/\\[dt]?frac\{([^{}]+)\}\{([^{}]+)\}/g)) {
      const a = m[1], b = m[2]
      if (a.length > 14 || b.length > 14) continue
      push(m as RegExpExecArray, 10, `${plainOf(a)}/${plainOf(b)}`, `\\frac{${a}}{${b}}`)
    }
    // 数字（排除下标/上标里的索引与命令名里的数字）
    for (const m of src.matchAll(/\d+(?:\.\d+)?/g)) {
      const idx = m.index ?? 0
      const before = src[idx - 1] || ''
      const after = src[idx + m[0].length] || ''
      if (/[\d._{^\\]/.test(before) || /[\d.]/.test(after)) continue
      push(m as RegExpExecArray, 8, m[0])
    }
    // 指数
    for (const m of src.matchAll(/\^\{([^{}]{1,8})\}|\^(\w)/g)) {
      const v = m[1] || m[2]
      if (!v) continue
      push(m as RegExpExecArray, 7, plainOf(v), v)
    }
    // 希腊字母
    for (const m of src.matchAll(/\\(alpha|beta|gamma|delta|theta|lambda|mu|sigma|pi|rho|varphi|phi|omega|Delta|Sigma|varepsilon|epsilon|eta|tau)\b/g)) {
      push(m as RegExpExecArray, 6, GREEK[m[1]] || m[1], `\\${m[1]}`)
    }
    // 运算符/常量
    for (const m of src.matchAll(/\\(pm|mp|le|ge|ne|to|approx|times|cdot|div|infty)\b/g)) {
      push(m as RegExpExecArray, 6, OPS[m[1]] || m[1], `\\${m[1]}`)
    }
    // 函数名
    for (const m of src.matchAll(/\\(sin|cos|tan|cot|sec|csc|ln|log|arcsin|arccos|arctan|lim|max|min)\b/g)) {
      push(m as RegExpExecArray, 4, m[1], `\\${m[1]}`)
    }
  } else {
    for (const m of src.matchAll(/\d+(?:\.\d+)?/g)) push(m as RegExpExecArray, 8, m[0])
    for (const m of src.matchAll(/sin|cos|tan|cot|sec|csc|ln|log|arcsin|arccos|arctan|lim/g)) {
      push(m as RegExpExecArray, 4, m[0])
    }
    for (const m of src.matchAll(/[±∓≤≥≠→≈∞×·÷πΣΔ]/g)) push(m as RegExpExecArray, 6, m[0])
  }
  return out.sort((a, b) => a.start - b.start)
}

/** 从 latex 片段里抽人能读的文字答案（用于 \pi^2 这类嵌套） */
function plainOf(s: string): string {
  return s
    .replace(/\\(alpha|beta|gamma|delta|theta|lambda|mu|sigma|pi|rho|varphi|phi|omega|Delta|Sigma|varepsilon|epsilon|eta|tau)\b/g, (_, n) => GREEK[n] || n)
    .replace(/\\[dt]?frac\{([^{}]+)\}\{([^{}]+)\}/g, '$1/$2')
    .replace(/\\left|\\right/g, '')
    .replace(/[{}]/g, '')
    .replace(/\\/g, '')
}

/** 生成一条卡的挖空视图 */
export function makeCloze(id: string, latex: string): ClozeCard {
  const isL = isLatex(latex)
  const cands = candidates(latex, isL)
  if (!cands.length) return { blanked: latex, answer: '', mode: isL ? 'latex' : 'text', hasBlank: false }
  const max = Math.max(...cands.map(c => c.score))
  const top = cands.filter(c => c.score >= max - 1)
  const pick = top[hash(id) % top.length]
  const blank = isL ? '\\underline{\\quad\\quad}' : '______'
  return {
    blanked: latex.slice(0, pick.start) + blank + latex.slice(pick.end),
    answer: pick.answer,
    answerLatex: pick.latex,
    mode: isL ? 'latex' : 'text',
    hasBlank: true
  }
}

// ---------- 判分 ----------
function canon(s: string): string {
  let t = String(s || '').trim().toLowerCase()
  t = t.replace(/\$/g, '').replace(/\\left|\\right/g, '')
  t = t.replace(/\\[dt]?frac\{([^{}]+)\}\{([^{}]+)\}/g, '$1/$2')
  t = t.replace(/\\[dt]?frac(\d)(\d)/g, '$1/$2')
  t = t.replace(/\\(alpha|beta|gamma|delta|theta|lambda|mu|sigma|pi|rho|varphi|phi|omega|Delta|Sigma|varepsilon|epsilon|eta|tau)\b/g, (_, n) => GREEK_NAME[GREEK[n]] || n)
  t = t.replace(/α/g, 'alpha').replace(/β/g, 'beta').replace(/γ/g, 'gamma').replace(/δ/g, 'delta')
    .replace(/θ/g, 'theta').replace(/λ/g, 'lambda').replace(/μ/g, 'mu').replace(/σ/g, 'sigma')
    .replace(/π/g, 'pi').replace(/φ/g, 'phi').replace(/ω/g, 'omega').replace(/Δ/g, 'delta')
    .replace(/Σ/g, 'sigma').replace(/ε/g, 'epsilon').replace(/η/g, 'eta').replace(/τ/g, 'tau')
  t = t.replace(/∞/g, 'infty').replace(/±/g, '+-').replace(/∓/g, '-+')
    .replace(/≤/g, '<=').replace(/≥/g, '>=').replace(/≠/g, '!=')
    .replace(/→/g, 'to').replace(/≈/g, 'approx')
  t = t.replace(/[−–—]/g, '-').replace(/[×·∙*]/g, '*').replace(/÷/g, '/')
  t = t.replace(/[{}()[\]]/g, '').replace(/\\/g, '').replace(/\s+/g, '')
  t = t.replace(/[。．.]$/g, '')
  return t
}

function numeric(s: string): number | null {
  if (!/^[-+]?\d+(?:\.\d+)?(?:\/[-+]?\d+(?:\.\d+)?)?$/.test(s)) return null
  if (s.includes('/')) {
    const [a, b] = s.split('/').map(Number)
    return b ? a / b : null
  }
  return Number(s)
}

export function judgeCloze(input: string, answer: string): boolean {
  const a = canon(answer)
  const b = canon(input)
  if (!b) return false
  if (a === b) return true
  const na = numeric(a), nb = numeric(b)
  if (na !== null && nb !== null) return Math.abs(na - nb) < 1e-9
  return false
}

// ---------- 本地进度 ----------
const recs = ref<Record<string, ClozeRecord>>({})
let loaded = false

export function loadCloze() {
  if (loaded) return
  loaded = true
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === 'object') recs.value = parsed
    }
  } catch { recs.value = {} }
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(recs.value)) } catch { /* 忽略 */ }
}

export function recordOf(id: string): ClozeRecord | undefined {
  loadCloze()
  return recs.value[id]
}
export function isGraduated(id: string): boolean {
  return (recordOf(id)?.streak || 0) >= GRADUATE_STREAK
}
export function isDue(id: string): boolean {
  const r = recordOf(id)
  if (!r) return true
  if (r.streak >= GRADUATE_STREAK) return false
  return r.due <= today()
}
/** 记一次默写结果；返回是否刚好毕业 */
export function recordCloze(id: string, ok: boolean): boolean {
  loadCloze()
  const prev = recs.value[id] || { streak: 0, wrong: 0, last: '', due: today(), done: 0 }
  const before = prev.streak >= GRADUATE_STREAK
  const next: ClozeRecord = {
    streak: ok ? prev.streak + 1 : 0,
    wrong: prev.wrong + (ok ? 0 : 1),
    last: today(),
    due: ok ? (prev.streak + 1 >= GRADUATE_STREAK ? '9999-12-31' : shift(1)) : today(),
    done: prev.done + 1
  }
  recs.value = { ...recs.value, [id]: next }
  save()
  return !before && next.streak >= GRADUATE_STREAK
}
export function resetCloze(id?: string) {
  loadCloze()
  if (id) {
    const c = { ...recs.value }
    delete c[id]
    recs.value = c
  } else {
    recs.value = {}
  }
  save()
}
export function clozeSummary() {
  loadCloze()
  const list = Object.values(recs.value)
  return {
    touched: list.length,
    graduated: list.filter(r => r.streak >= GRADUATE_STREAK).length,
    todayDone: list.filter(r => r.last === today()).length
  }
}
export { today as clozeToday }

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'

// ===== 数据类型 =====
interface SkillItem {
  id: string
  title: string
  short: string
  freq: string
  tags: string[]
  mastery: string
  chapter: string
  chapterName: string
  subject: string
}
interface SkillChapterMeta { id: string; name: string; subject: string }
interface SkillData {
  chapterPrereqs: Record<string, string[]>
  subjects: Record<string, { name: string; chapters: { id: string; name: string; items: any[] }[] }>
}

// ===== 响应式状态 =====
const cyContainer = ref<HTMLElement | null>(null)
const loading = ref(true)
const loadError = ref('')
const currentSubject = ref('gaoshu')
const subjectList = ref<{ key: string; name: string }[]>([])
const progressPct = ref(0)
const progressText = ref('0 / 0 掌握')
const panel = reactive({
  visible: false,
  title: '',
  sub: '',
  freq: '',
  freqClass: '',
  tags: [] as string[],
  status: '',
  hint: ''
})

// ===== 非响应式内部状态（cytoscape 直接渲染）=====
let cy: any = null
let skillData: SkillData | null = null
let items: Record<string, SkillItem> = {}
let chapters: Record<string, SkillChapterMeta> = {}
let itemsOfChapter: Record<string, string[]> = {}
let mastery: Record<string, string> = {}
let chapterUnlocked: Record<string, boolean> = {}
let itemUnlocked: Record<string, boolean> = {}

const FREQ_CLASS: Record<string, string> = { '年年考': 'freq-nnk', '高频': 'freq-gp', '中频': 'freq-zp', '低频': 'freq-dp' }
const MASTERY_TEXT: Record<string, string> = { untested: '可学习（未测）', learning: '学习中', mastered: '已掌握' }

// ===== 数据加载与展开 =====
async function loadData() {
  const base = import.meta.env.BASE_URL || '/'
  const resp = await fetch(`${base}data/skilltree/math.json?t=${Date.now()}`)
  if (!resp.ok) throw new Error('数据加载失败 ' + resp.status)
  skillData = await resp.json()
  items = {}
  chapters = {}
  itemsOfChapter = {}
  for (const [subjKey, subj] of Object.entries(skillData!.subjects)) {
    for (const ch of subj.chapters) {
      chapters[ch.id] = { id: ch.id, name: ch.name, subject: subjKey }
      itemsOfChapter[ch.id] = []
      for (const it of ch.items) {
        items[it.id] = {
          id: it.id, title: it.title, short: it.short, freq: it.freq,
          tags: it.tags || [], mastery: it.mastery || 'untested',
          chapter: ch.id, chapterName: ch.name, subject: subjKey
        }
        itemsOfChapter[ch.id].push(it.id)
        mastery[it.id] = it.mastery || 'untested'
      }
    }
  }
  subjectList.value = Object.keys(skillData!.subjects).map(k => ({ key: k, name: skillData!.subjects[k].name }))
}

// ===== 解锁逻辑（章节关卡制）=====
function chapterComplete(chId: string): boolean {
  const ids = itemsOfChapter[chId] || []
  return ids.length > 0 && ids.every(id => mastery[id] === 'mastered')
}
function recompute() {
  if (!skillData) return
  const prereqs = skillData.chapterPrereqs
  const chIds = Object.keys(chapters)
  for (let pass = 0; pass < chIds.length; pass++) {
    let changed = false
    for (const ch of chIds) {
      const ps = prereqs[ch] || []
      const unlocked = ps.every(p => chapterComplete(p))
      if (chapterUnlocked[ch] !== unlocked) { chapterUnlocked[ch] = unlocked; changed = true }
    }
    if (!changed) break
  }
  for (const id of Object.keys(items)) {
    itemUnlocked[id] = !!chapterUnlocked[items[id].chapter]
  }
}

// ===== 样式应用 =====
function applyStyles() {
  if (!cy) return
  cy.nodes().forEach((n: any) => {
    const id = n.id()
    n.removeClass('mastered learning untested locked freq-nnk freq-gp freq-zp freq-dp')
    if (n.data('type') === 'chapter') {
      if (!chapterUnlocked[id]) n.addClass('locked')
      else if (chapterComplete(id)) n.addClass('mastered')
    } else {
      const fc = FREQ_CLASS[items[id]?.freq]
      if (fc) n.addClass(fc)
      n.addClass(!itemUnlocked[id] ? 'locked' : mastery[id])
    }
  })
  cy.edges().forEach((e: any) => {
    e.removeClass('edge-active')
    const sid = e.source().id()
    const isOn = chapters[sid] ? !!chapterUnlocked[sid] : mastery[sid] === 'mastered'
    if (isOn) e.addClass('edge-active')
  })
}

// ===== 按章节分行布局（紧凑宽度，保证可读缩放）=====
function computePositions() {
  if (!skillData) return {} as Record<string, { x: number; y: number }>
  const prereqs = skillData.chapterPrereqs
  const chIds = Object.keys(chapters).filter(c => chapters[c].subject === currentSubject.value)
  const cmemo: Record<string, number> = {}
  const crank = (id: string): number => {
    if (cmemo[id] !== undefined) return cmemo[id]
    cmemo[id] = 0
    const ps = prereqs[id] || []
    cmemo[id] = ps.length ? Math.max(...ps.map(crank)) + 1 : 0
    return cmemo[id]
  }
  chIds.forEach(crank)
  const sorted = chIds.slice().sort((a, b) => (cmemo[a] - cmemo[b]) || a.localeCompare(b))
  const pos: Record<string, { x: number; y: number }> = {}
  const rowH = 80, colW = 140, itemsStartX = 235
  sorted.forEach((ch, r) => {
    pos[ch] = { x: 0, y: r * rowH }
    ;(itemsOfChapter[ch] || []).forEach((it, i) => {
      pos[it] = { x: itemsStartX + i * colW, y: r * rowH }
    })
  })
  return pos
}

// ===== 进度 =====
function updateProgress() {
  const ids = Object.keys(items).filter(id => items[id].subject === currentSubject.value)
  const mastered = ids.filter(id => mastery[id] === 'mastered').length
  const learning = ids.filter(id => mastery[id] === 'learning').length
  progressPct.value = ids.length ? (mastered / ids.length) * 100 : 0
  progressText.value = `${mastered} / ${ids.length} 掌握` + (learning ? `（+${learning}学习中）` : '')
}

// ===== 整树适配：把全部节点 fit 进固定高度的画布，一眼看全，无需滚动 =====
function fitReadable() {
  if (!cy || !cyContainer.value) return
  cy.resize()
  cy.fit(undefined, 40)
}

// ===== 加载科目 =====
function loadSubject(subj: string) {
  currentSubject.value = subj
  if (!cy) return
  const nodes: any[] = []
  for (const ch of Object.values(chapters)) {
    if (ch.subject !== subj) continue
    nodes.push({ group: 'nodes', data: { id: ch.id, label: ch.name, type: 'chapter' } })
  }
  const edges: any[] = []
  for (const id of Object.keys(items)) {
    const it = items[id]
    if (it.subject !== subj) continue
    nodes.push({ group: 'nodes', data: { id: it.id, label: it.short, type: 'item' } })
  }
  // 章内链：章→第一个题型，题型依次相连（仅展示用）
  for (const ch of Object.values(chapters)) {
    if (ch.subject !== subj) continue
    const its = itemsOfChapter[ch.id] || []
    its.forEach((it, i) => {
      if (i === 0) edges.push({ group: 'edges', data: { source: ch.id, target: it } })
      else edges.push({ group: 'edges', data: { source: its[i - 1], target: it } })
    })
  }
  cy.elements().remove()
  cy.add([...nodes, ...edges])
  recompute()
  applyStyles()
  const pos = computePositions()
  cy.nodes().forEach((n: any) => { if (pos[n.id()]) n.position(pos[n.id()]) })
  // width:'label' 的节点宽度要等字体/纹理就绪后才测得准，立即 fit 拿到的边界框可能不准；
  // 且首帧渲染可能漏画（渲染器未被失效），导致画布一片空白、非得点击某个节点才全部显示。
  // 先粗 fit，再等"两帧后"与"字体就绪后"各做一次：强制失效重绘 + 用稳定宽度精确 fit，兜底保证首屏可见。
  fitReadable()
  const refine = () => {
    if (!cy || cy.destroyed()) return
    applyStyles()   // 对全部节点增删类名，强制渲染器失效并重绘（等价于点击节点触发的重绘）
    fitReadable()   // 用稳定的标签宽度重新适配视口
    // 兜底：直接驱动渲染器同步绘制一帧，避免依赖 rAF（其可能被节流/错过）
    try {
      const r = cy.renderer && cy.renderer()
      if (r && typeof r.render === 'function') {
        if (typeof r.redrawHint === 'function') { r.redrawHint('ele', true); r.redrawHint('viewport', true) }
        r.render()
      }
    } catch (e) { /* 内部 API 不可用时退化为自动渲染 */ }
  }
  requestAnimationFrame(() => requestAnimationFrame(refine))
  const fonts: any = (document as any).fonts
  if (fonts && fonts.ready) fonts.ready.then(() => requestAnimationFrame(refine))
  setTimeout(refine, 400)   // 不依赖 rAF 的超时兜底，保证至少执行一次
  updateProgress()
  panel.visible = false
}

// ===== 详情面板（只读）=====
function showPanel(id: string) {
  if (chapters[id]) {
    const ch = chapters[id]
    const its = itemsOfChapter[id] || []
    const m = its.filter(i => mastery[i] === 'mastered').length
    panel.visible = true
    panel.title = '📚 ' + ch.name
    panel.sub = `章节里程碑 · 共 ${its.length} 个题型`
    panel.freq = ''
    panel.freqClass = ''
    panel.tags = []
    panel.status = !chapterUnlocked[id] ? '🔒 未解锁（前置章节未完成）' : chapterComplete(id) ? '🏆 已完成' : '📖 已解锁，可学习本章题型'
    panel.hint = `本章掌握 ${m} / ${its.length}。完成前置章节全部题型后本章自动解锁；掌握本章全部题型后章节点亮为金色。通过费曼复习诊断来点亮题型。`
    return
  }
  const it = items[id]
  if (!it) return
  panel.visible = true
  panel.title = it.title
  panel.sub = it.chapterName
  panel.freq = it.freq
  panel.freqClass = FREQ_CLASS[it.freq] || ''
  panel.tags = it.tags
  panel.status = !itemUnlocked[id] ? '🔒 未解锁（所在章节未解锁）' : MASTERY_TEXT[mastery[id]] || mastery[id]
  panel.hint = '节点掌握度由费曼复习自动同步：在费曼诊断中答对该题型即可点亮，答错会记入薄弱点并间隔复习。'
}

// ===== 关闭详情面板 =====
function closePanel() {
  panel.visible = false
  if (cy) cy.nodes().removeClass('selected')
}

// ===== 初始化 cytoscape =====
function cyStyles() {
  return [
    { selector: 'node', style: { 'label': 'data(label)', 'font-family': 'system-ui,"Microsoft YaHei",sans-serif', 'font-weight': 'normal', 'color': '#E2E8F0', 'text-valign': 'center', 'text-halign': 'center', 'font-size': '15px', 'text-outline-color': 'rgba(11,17,32,0.9)', 'text-outline-width': 1, 'transition-property': 'opacity, background-color, border-color, border-width', 'transition-duration': '0.2s' } },
    { selector: 'node[type="chapter"]', style: { 'shape': 'round-rectangle', 'background-color': '#312E81', 'border-width': 2, 'border-color': '#6366F1', 'width': 'label', 'height': 40, 'padding': '14px', 'font-size': '16px', 'color': '#E0E7FF', 'text-outline-width': 0 } },
    { selector: 'node[type="item"]', style: { 'shape': 'round-rectangle', 'width': 'label', 'height': 30, 'padding': '10px', 'font-size': '14px', 'font-weight': '500', 'text-outline-width': 0, 'border-width': 2 } },
    { selector: 'node.freq-nnk', style: { 'background-color': '#F59E0B', 'border-color': '#FCD34D', 'color': '#1A1206' } },
    { selector: 'node.freq-gp', style: { 'background-color': '#3B82F6', 'border-color': '#93C5FD', 'color': '#fff' } },
    { selector: 'node.freq-zp', style: { 'background-color': '#14B8A6', 'border-color': '#5EEAD4', 'color': '#04211D' } },
    { selector: 'node.freq-dp', style: { 'background-color': '#64748B', 'border-color': '#CBD5E1', 'color': '#fff' } },
    { selector: 'node.mastered', style: { 'opacity': 1, 'border-width': 3, 'border-color': '#FDE047' } },
    { selector: 'node.learning', style: { 'opacity': 0.95, 'border-width': 2, 'border-style': 'dashed', 'border-color': '#F8FAFC' } },
    { selector: 'node.untested', style: { 'opacity': 1 } },
    { selector: 'node.locked', style: { 'opacity': 0.85, 'background-color': '#3E4C63', 'border-color': '#64748B', 'border-style': 'dashed', 'color': '#C7D2E0' } },
    { selector: 'node[type="chapter"].mastered', style: { 'background-color': '#4C1D95', 'border-color': '#FDE047', 'color': '#FEF9C3', 'opacity': 1 } },
    { selector: 'node[type="chapter"].locked', style: { 'opacity': 0.85, 'background-color': '#2B3648', 'border-color': '#64748B', 'border-style': 'dashed', 'color': '#C7D2E0' } },
    { selector: 'node.selected', style: { 'border-width': 3, 'border-color': '#FDE047' } },
    { selector: 'edge', style: { 'width': 2, 'line-color': '#3B4A63', 'target-arrow-color': '#3B4A63', 'target-arrow-shape': 'triangle', 'curve-style': 'bezier', 'arrow-scale': 0.8, 'opacity': 0.5 } },
    { selector: 'edge.edge-active', style: { 'line-color': '#F59E0B', 'target-arrow-color': '#F59E0B', 'opacity': 0.9, 'width': 2.5 } }
  ]
}

async function initCy() {
  const module: any = await import('cytoscape')
  const cytoscape = module.default || module
  cy = cytoscape({
    container: cyContainer.value,
    style: cyStyles(),
    wheelSensitivity: 0.2,
    selectionType: 'single',
    boxSelectionEnabled: false
  })
  cy.on('tap', 'node', (evt: any) => {
    cy.nodes().removeClass('selected')
    evt.target.addClass('selected')
    showPanel(evt.target.id())
  })
  cy.on('tap', (evt: any) => {
    if (evt.target === cy) closePanel()
  })
  loadSubject(currentSubject.value)
}

function zoomIn() { if (cy) cy.zoom({ level: cy.zoom() * 1.3, renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 } }) }
function zoomOut() { if (cy) cy.zoom({ level: cy.zoom() / 1.3, renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 } }) }
function zoomFit() { fitReadable() }

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') closePanel()
}

onMounted(async () => {
  window.addEventListener('keydown', onKeydown)
  try {
    await loadData()
    loading.value = false
    await initCy()
  } catch (e: any) {
    loading.value = false
    loadError.value = e?.message || '技能树加载失败'
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  if (cy) { cy.destroy(); cy = null }
})
</script>

<template>
  <div class="skilltree-page">
    <div class="skilltree-card">
      <div class="st-header">
        <h2 class="st-title">🌳 数学题型技能树</h2>
        <div class="st-tabs">
          <button
            v-for="s in subjectList"
            :key="s.key"
            class="st-tab"
            :class="{ active: currentSubject === s.key }"
            @click="loadSubject(s.key)"
          >{{ s.name }}</button>
        </div>
        <div class="st-progress">
          <div class="st-progress-bar"><div class="st-progress-fill" :style="{ width: progressPct + '%' }"></div></div>
          <span class="st-progress-text">{{ progressText }}</span>
        </div>
      </div>

      <div v-if="loading" class="st-state">正在加载技能树…</div>
      <div v-else-if="loadError" class="st-state st-error">{{ loadError }}</div>

      <template v-if="!loading && !loadError">
        <div class="st-toolbar">
          <div class="st-legend-h">
            <span class="st-legend-label">考频</span>
            <span class="st-chip"><span class="st-swatch" style="background:#F59E0B"></span>年年考</span>
            <span class="st-chip"><span class="st-swatch" style="background:#3B82F6"></span>高频</span>
            <span class="st-chip"><span class="st-swatch" style="background:#14B8A6"></span>中频</span>
            <span class="st-chip"><span class="st-swatch" style="background:#64748B"></span>低频</span>
            <span class="st-legend-label">掌握度</span>
            <span class="st-chip"><span class="st-swatch" style="background:#3B82F6;border:2px solid #FDE047"></span>已掌握</span>
            <span class="st-chip"><span class="st-swatch" style="background:#3B82F6;border:2px dashed #F8FAFC"></span>学习中</span>
            <span class="st-chip"><span class="st-swatch" style="background:#3B82F6"></span>未测</span>
            <span class="st-chip"><span class="st-swatch" style="background:#3E4C63;border:2px dashed #64748B"></span>未解锁</span>
          </div>
          <div class="st-zoom-h">
            <button class="st-btn" title="放大" @click="zoomIn">+</button>
            <button class="st-btn" title="缩小" @click="zoomOut">−</button>
            <button class="st-btn" title="适应宽度" @click="zoomFit">⤢</button>
          </div>
        </div>

        <div class="st-main">
          <div ref="cyContainer" class="st-cy"></div>
          <aside v-if="panel.visible" class="st-panel">
            <button class="st-panel-close" title="关闭" @click="closePanel">×</button>
            <div class="st-panel-title">{{ panel.title }}</div>
            <div class="st-panel-sub">{{ panel.sub }}</div>
            <div v-if="panel.freq" class="st-panel-row">
              <span class="st-panel-label">考频</span>
              <span class="st-badge" :class="panel.freqClass">{{ panel.freq }}</span>
            </div>
            <div v-if="panel.tags && panel.tags.length" class="st-panel-row">
              <span class="st-panel-label">标记</span>
              <span class="st-tags">{{ panel.tags.join(' · ') }}</span>
            </div>
            <div class="st-panel-row">
              <span class="st-panel-label">状态</span>
              <span>{{ panel.status }}</span>
            </div>
            <div class="st-panel-hint">{{ panel.hint }}</div>
          </aside>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.skilltree-page {
  width: 100%;
}

.skilltree-card {
  background: #0B1120;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.28);
  display: flex;
  flex-direction: column;
}

.st-header {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 14px 20px;
  background: #1E293B;
  border-bottom: 1px solid #334155;
  flex-wrap: wrap;
}

.st-title {
  font-size: 18px;
  font-weight: normal;
  color: #FDE047;
  letter-spacing: 1px;
  margin: 0;
}

.st-tabs { display: flex; gap: 6px; }
.st-tab {
  padding: 6px 16px;
  border-radius: 8px;
  background: #0F172A;
  border: 1px solid #334155;
  color: #94A3B8;
  cursor: pointer;
  font-size: 14px;
  transition: 0.2s;
  &:hover { border-color: #FDE047; color: #FDE047; }
  &.active { background: #FDE047; color: #1A1206; border-color: #FDE047; }
}

.st-progress { display: flex; align-items: center; gap: 10px; margin-left: auto; }
.st-progress-bar {
  width: 160px; height: 10px; background: #0F172A;
  border-radius: 5px; overflow: hidden; border: 1px solid #334155;
}
.st-progress-fill { height: 100%; background: linear-gradient(90deg, #F59E0B, #FDE047); transition: width 0.4s; }
.st-progress-text { font-size: 13px; color: #CBD5E1; min-width: 96px; }

.st-state {
  padding: 60px 20px;
  text-align: center;
  color: #94A3B8;
  font-size: 15px;
}
.st-error { color: #FCA5A5; }

.st-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 20px;
  background: #0F172A;
  border-bottom: 1px solid #1E293B;
  flex-wrap: wrap;
}
.st-legend-h { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.st-legend-label { color: #64748B; font-size: 12px; margin-left: 4px; }
.st-chip {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 3px 10px; border-radius: 12px;
  background: #1E293B; border: 1px solid #334155;
  color: #CBD5E1; font-size: 12px;
}
.st-swatch { width: 12px; height: 12px; border-radius: 3px; box-sizing: border-box; }
.st-swatch.st-mastered { box-shadow: 0 0 0 2px #FDE047; }
.st-zoom-h { display: flex; gap: 6px; }
.st-btn {
  width: 32px; height: 32px;
  border-radius: 8px; background: #1E293B;
  border: 1px solid #334155; color: #94A3B8;
  cursor: pointer; font-size: 16px;
  display: flex; align-items: center; justify-content: center;
  transition: 0.2s;
  &:hover { border-color: #FDE047; color: #FDE047; }
}

.st-main { position: relative; }
.st-cy {
  width: 100%;
  height: 700px;
  background:
    radial-gradient(circle at 28% 18%, rgba(99, 102, 241, 0.10), transparent 42%),
    radial-gradient(circle at 82% 82%, rgba(245, 158, 11, 0.07), transparent 42%),
    #0B1120;
}

.st-panel {
  position: absolute; right: 16px; top: 16px;
  width: 280px; max-height: calc(100% - 32px);
  overflow-y: auto;
  background: rgba(30, 41, 59, 0.96);
  border: 1px solid #334155; border-radius: 12px;
  padding: 16px;
}
.st-panel-close {
  position: absolute; top: 8px; right: 8px;
  width: 26px; height: 26px;
  border-radius: 8px; border: 1px solid #334155;
  background: #1E293B; color: #94A3B8;
  font-size: 16px; line-height: 1; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: 0.2s;
  &:hover { border-color: #FDE047; color: #FDE047; }
}
.st-panel-title { font-size: 15px; color: #F8FAFC; margin-bottom: 6px; line-height: 1.45; }
.st-panel-sub { font-size: 12px; color: #94A3B8; margin-bottom: 12px; }
.st-panel-row { display: flex; align-items: center; gap: 8px; margin-bottom: 9px; font-size: 13px; color: #E2E8F0; }
.st-panel-label { color: #64748B; min-width: 40px; }
.st-badge { padding: 2px 10px; border-radius: 10px; font-size: 12px; }
.st-badge.freq-nnk { background: #F59E0B; color: #1A1206; }
.st-badge.freq-gp { background: #3B82F6; color: #fff; }
.st-badge.freq-zp { background: #14B8A6; color: #04211D; }
.st-badge.freq-dp { background: #64748B; color: #fff; }
.st-tags { color: #CBD5E1; }
.st-panel-hint {
  margin-top: 12px; padding: 10px;
  background: #0F172A; border: 1px solid #334155;
  border-radius: 8px; font-size: 12px;
  color: #94A3B8; line-height: 1.6;
}

/* ===== 移动端适配 ===== */
@media (max-width: 768px) {
  .st-header {
    gap: 10px;
    padding: 12px 14px;
  }
  .st-title { font-size: 16px; }
  .st-tab { padding: 5px 12px; font-size: 13px; }
  /* 进度条独占一行，避免被挤溢出 */
  .st-progress {
    margin-left: 0;
    width: 100%;
  }
  .st-progress-bar { flex: 1; width: auto; }
  .st-progress-text { min-width: 0; white-space: nowrap; }

  .st-toolbar { padding: 8px 14px; }
  .st-chip { padding: 2px 8px; font-size: 11px; }

  /* 画布降低高度，整图 fit 后可双指缩放细看 */
  .st-cy { height: 460px; }

  /* 详情面板改为底部抽屉，避免遮挡画布 */
  .st-panel {
    left: 0; right: 0; top: auto; bottom: 0;
    width: 100%;
    max-height: 56%;
    border-radius: 14px 14px 0 0;
    border-left: none; border-right: none; border-bottom: none;
    padding: 16px 16px 20px;
  }
}

@media (max-width: 420px) {
  .st-cy { height: 400px; }
  /* 超窄屏隐藏图例文字标签，只留色块 */
  .st-legend-label { display: none; }
  .st-zoom-h { margin-left: auto; }
}
</style>

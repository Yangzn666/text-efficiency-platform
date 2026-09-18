<script setup lang="ts">
import { computed } from 'vue'

// 全文脉络卡：放在每篇第一题之前，用考研「串读法」先搭论证骨架。
// 只输出"每段在论证中干什么 + 段间逻辑关系 + 一条论证主线"，不重复原文与译文
// （原文/译文正文里已有，重复无意义）。只读段落文本做角色判定，不碰作答数据，两站共用。
const props = defineProps<{ paragraphs: string[]; translations?: string[] }>()

const strip = (html: string) =>
  String(html || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&#160;/g, ' ').replace(/\s+/g, ' ').trim()

interface Role {
  name: string      // 角色标签
  short: string     // 论证主线里的简称
  link: string      // 与上段的逻辑关系
  func: string      // 这段在论证中干什么 + 对应的解题动作
  color: string
}
const ROLES: Record<string, Role> = {
  intro: {
    name: '引入话题 / 现象', short: '立话题', link: '开篇立靶', color: '#2c7be5',
    func: '抛出话题或现象，全文的"靶子"在这；主旨题先回这段圈话题词。'
  },
  turn: {
    name: '转折 · 作者立场', short: '亮立场', link: '↩ 转折上段', color: '#e5484d',
    func: '转折=作者真正立场。But/However 后一句是全文最重要的一句，态度题、主旨题的答案区。'
  },
  example: {
    name: '举例 / 论据', short: '举例证', link: '↳ 举例证上段', color: '#30a46c',
    func: '举例只为证明上一段的观点；例子本身的人名、数字、细节一律不是答案，问"例子说明什么"要往上找观点句。'
  },
  conclude: {
    name: '结论 / 态度 · 主旨区', short: '收主旨', link: '↳ 收束全文', color: '#8e4ec6',
    func: '收束全文，主旨与作者态度藏在这；主旨题正确项常是这段的同义改写。'
  },
  list: {
    name: '并列 / 递进展开', short: '并列展', link: '↳ 同向补充', color: '#12a594',
    func: '并列/递进补充论据，与上段同向、不产生新立场；多为细节题定位区。'
  },
  quote: {
    name: '引观点 / 设问', short: '引观点', link: '↳ 引入他者', color: '#f5a623',
    func: '引他人观点或设问；分清"别人的话"和"作者的话"，态度题别把引用当作者立场。'
  },
  develop: {
    name: '展开 · 分析论证', short: '析论证', link: '↳ 承接展开', color: '#697386',
    func: '承接上文展开分析论证；抓段首主题句即可，不必逐句细读。'
  }
}

/** 段首句（到第一个句末标点为止），仅用于角色判定 */
const firstSentence = (text: string) => (text.match(/^[^.!?]*[.!?]/)?.[0] || text).trim()

/** 段落功能判定：话语标记优先，位置先验兜底（P1 引入 / 末段结论） */
function roleOf(text: string, idx: number, total: number): Role {
  const lower = text.toLowerCase()
  const firstSent = firstSentence(lower)
  const head = lower.split(/\s+/).slice(0, 12).join(' ')
  if (firstSent.includes('?')) return ROLES.quote
  if (/\b(but|however|yet|nevertheless|nonetheless|instead|indeed|in fact|actually|in reality)\b/.test(head)) return ROLES.turn
  if (/\b(for example|for instance|such as|as an example|take|consider|look at)\b/.test(firstSent)
    || /\b(study|studies|research|survey|experiment|report)\b/.test(head)) return ROLES.example
  if (/\b(therefore|thus|hence|in short|in conclusion|to sum|overall|ultimately|in effect|in sum|clearly)\b/.test(head)) return ROLES.conclude
  if (/\b(first|second|third|finally|moreover|furthermore|in addition|additionally|meanwhile|another|also|besides)\b/.test(head)) return ROLES.list
  if (idx === 0) return ROLES.intro
  if (idx === total - 1) return ROLES.conclude
  return ROLES.develop
}

const skeleton = computed(() => {
  const paras = (props.paragraphs || []).map(strip)
  const total = paras.length
  return paras
    .map((text, i) => ({ text, i }))
    .filter(x => x.text.length > 40)
    .map(({ text, i }) => ({ p: i + 1, role: roleOf(text, i, total) }))
})

/** 顶部一条论证主线：把各段角色串成流向 */
const flowLine = computed(() => skeleton.value.map(s => s.role.short).join(' → '))
</script>

<template>
  <div v-if="skeleton.length" class="passage-skeleton">
    <div class="ps-head">
      <span class="ps-badge">🧭 全文脉络</span>
      <span class="ps-sub">论证骨架 · 每段在干什么、段间怎么连，先搭骨架再解题</span>
    </div>
    <div class="ps-flow">论证主线：{{ flowLine }}</div>
    <div class="ps-list">
      <div v-for="s in skeleton" :key="s.p" class="ps-row">
        <span class="ps-p">P{{ s.p }}</span>
        <div class="ps-body">
          <div class="ps-tags">
            <span
              class="ps-role"
              :style="{ color: s.role.color, borderColor: s.role.color, background: s.role.color + '14' }"
            >{{ s.role.name }}</span>
            <span class="ps-link">{{ s.role.link }}</span>
          </div>
          <div class="ps-func">{{ s.role.func }}</div>
        </div>
      </div>
    </div>
    <div class="ps-note">串读口诀：首段立话题、转折见态度、例子服务论点、末段收主旨——主旨题的正确项常是这条骨架的同义改写。</div>
  </div>
</template>

<style scoped>
.passage-skeleton {
  margin: 0 0 18px;
  border: 1px solid #e4d9b8;
  border-left: 3px solid #d9a514;
  border-radius: 10px;
  background: linear-gradient(135deg, #fffdf5 0%, #fbf7ea 100%);
  padding: 12px 16px 12px;
}
.ps-head {
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 6px;
}
.ps-badge {
  font-size: 0.88rem;
  font-weight: 700;
  color: #7a5b00;
  letter-spacing: 0.03em;
}
.ps-sub {
  font-size: 0.76rem;
  color: #a08b4f;
}
.ps-flow {
  font-size: 0.8rem;
  font-weight: 600;
  color: #8a6a00;
  background: #f7edd0;
  border-radius: 8px;
  padding: 5px 10px;
  margin-bottom: 10px;
  letter-spacing: 0.02em;
}
.ps-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.ps-row {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}
.ps-p {
  flex-shrink: 0;
  min-width: 30px;
  text-align: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.74rem;
  font-weight: 700;
  color: #7a5b00;
  background: #f5e9c8;
  border-radius: 6px;
  padding: 2px 6px;
  margin-top: 1px;
}
.ps-body { flex: 1; min-width: 0; }
.ps-tags {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 3px;
}
.ps-role {
  display: inline-block;
  padding: 1px 9px;
  border: 1px solid;
  border-radius: 10px;
  font-size: 0.72rem;
  font-weight: 600;
}
.ps-link {
  font-size: 0.72rem;
  color: #9a8a5c;
}
.ps-func {
  font-size: 0.78rem;
  line-height: 1.6;
  color: #5c5340;
}
.ps-note {
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px dashed #e0d5b0;
  font-size: 0.78rem;
  line-height: 1.6;
  color: #7a5b00;
}
@media (max-width: 768px) {
  .passage-skeleton { padding: 10px 10px; }
  .ps-sub { display: none; }
}
</style>

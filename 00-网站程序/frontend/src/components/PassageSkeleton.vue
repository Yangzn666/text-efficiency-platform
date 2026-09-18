<script setup lang="ts">
import { computed } from 'vue'

// 全文脉络卡：放在每篇第一题之前，用考研「串读法」先搭骨架——
// 各段功能角色（段首话语标记 + 位置先验）+ 段首句 + 段落译文大意。
// 只读原文段落与译文，不碰作答数据，个人版 / 共享版两站共用。
const props = defineProps<{ paragraphs: string[]; translations: string[] }>()

const strip = (html: string) =>
  String(html || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&#160;/g, ' ').replace(/\s+/g, ' ').trim()

interface Role { name: string; color: string }
const ROLES: Record<string, Role> = {
  intro:    { name: '引入话题 / 现象', color: '#2c7be5' },
  turn:     { name: '转折 · 作者立场', color: '#e5484d' },
  example:  { name: '举例 / 论据 · 服务论点', color: '#30a46c' },
  conclude: { name: '结论 / 态度 · 主旨区', color: '#8e4ec6' },
  list:     { name: '并列 / 递进展开', color: '#12a594' },
  quote:    { name: '引观点 / 设问', color: '#f5a623' },
  develop:  { name: '展开 · 分析论证', color: '#697386' }
}

/** 段首句（到第一个句末标点为止） */
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
    .map(({ text, i }) => {
      const en = firstSentence(text)
      const cn = (props.translations?.[i] || '').replace(/[①-⑳]/g, '').replace(/\s+/g, ' ').trim()
      return {
        p: i + 1,
        role: roleOf(text, i, total),
        en: en.length > 96 ? en.slice(0, 96) + '…' : en,
        cn: cn ? (cn.length > 42 ? cn.slice(0, 42) + '…' : cn) : ''
      }
    })
})
</script>

<template>
  <div v-if="skeleton.length" class="passage-skeleton">
    <div class="ps-head">
      <span class="ps-badge">🧭 全文脉络</span>
      <span class="ps-sub">串读骨架 · 各段首句 + 转折串起来，先搭骨架再解题</span>
    </div>
    <div class="ps-list">
      <div v-for="s in skeleton" :key="s.p" class="ps-row">
        <span class="ps-p">P{{ s.p }}</span>
        <div class="ps-body">
          <span
            class="ps-role"
            :style="{ color: s.role.color, borderColor: s.role.color, background: s.role.color + '14' }"
          >{{ s.role.name }}</span>
          <div class="ps-en">{{ s.en }}</div>
          <div v-if="s.cn" class="ps-cn">{{ s.cn }}</div>
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
  margin-bottom: 8px;
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
.ps-role {
  display: inline-block;
  padding: 1px 9px;
  border: 1px solid;
  border-radius: 10px;
  font-size: 0.72rem;
  font-weight: 600;
  margin-bottom: 3px;
}
.ps-en {
  font-family: 'Georgia', serif;
  font-size: 0.84rem;
  line-height: 1.55;
  color: #4a4436;
}
.ps-cn {
  font-size: 0.78rem;
  line-height: 1.6;
  color: #8a7d55;
  margin-top: 2px;
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

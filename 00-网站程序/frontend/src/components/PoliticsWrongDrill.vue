<script setup lang="ts">
// 错题再练闭环 · 演练室
// 从错题本 store 取"未掌握"的政治错题（默认新思想），逐题重做 → 实时判分 → 错因提示 → recordReview 毕业闭环
import { ref, computed } from 'vue'
import { useWrongProblemsStore } from '@/stores/wrongProblems'
import {
  parseChoice, parseStem, isMulti, isXxs,
  deriveCauseFromSelection, CAUSE_META, type CauseKey
} from '@/data/politicsWrongCause'
import { POLITICS_WRONG_SEED } from '@/data/politicsWrongSeed'
import type { WrongProblem } from '@/data/wrongProblemTypes'

const wp = useWrongProblemsStore()
wp.bind('politics', POLITICS_WRONG_SEED)

const scope = ref<'xxs' | 'all'>('xxs')
const pool = computed<WrongProblem[]>(() => {
  const base = wp.db.politics.filter(p => !p.mastered)
  return scope.value === 'xxs' ? base.filter(isXxs) : base
})

const idx = ref(0)
const current = computed<WrongProblem | null>(() => pool.value[idx.value] ?? null)

// 题面解析
const parsed = computed(() => {
  const p = current.value
  if (!p) return { stem: '', options: [] as { key: string; text: string }[], multi: false }
  const { stem, options } = parseStem(p.content)
  return { stem, options, multi: isMulti(p) }
})

// 作答选择
const picked = ref<string[]>([])
const togglePick = (key: string) => {
  if (judged.value) return
  if (parsed.value.multi) {
    const s = new Set(picked.value)
    s.has(key) ? s.delete(key) : s.add(key)
    picked.value = [...s].sort()
  } else {
    picked.value = [key]
  }
}

// 判分
const judged = ref(false)
const isRight = ref(false)
const causeKey = ref<CauseKey | null>(null)
const prevMine = ref<string[]>([])

const submit = () => {
  const p = current.value
  if (!p || picked.value.length === 0) return
  const { correct, mine } = parseChoice(p.correction)
  const myPick = [...picked.value].sort()
  const right = myPick.length === correct.length && myPick.every(x => correct.includes(x))
  isRight.value = right
  prevMine.value = mine
  causeKey.value = right ? null : deriveCauseFromSelection(correct, myPick, parsed.value.multi)
  judged.value = true
  // 会话累计
  sessionTotal.value++
  if (right) sessionRight.value++
  // 毕业闭环：写回 store（答对 streak+1，满 2 次自动 mastered；答错清零）
  wp.recordReview(p, right)
}

const next = () => {
  judged.value = false; isRight.value = false; causeKey.value = null; picked.value = []
  // pool 会因 mastered 变化而缩短；保持在合法范围
  if (idx.value > pool.value.length - 1) idx.value = Math.max(0, pool.value.length - 1)
}
const skip = () => {
  judged.value = false; isRight.value = false; causeKey.value = null; picked.value = []
  if (idx.value < pool.value.length - 1) idx.value++
}
const restart = () => { idx.value = 0; judged.value = false; picked.value = [] }

// 会话统计
const sessionRight = ref(0)
const sessionTotal = ref(0)

const causeMeta = computed(() => causeKey.value ? CAUSE_META[causeKey.value] : null)
const correctLetters = computed(() => current.value ? parseChoice(current.value.correction).correct : [])
const done = computed(() => pool.value.length === 0)
const remaining = computed(() => Math.max(0, pool.value.length - idx.value))

const optClass = (key: string) => {
  if (!judged.value) return picked.value.includes(key) ? 'sel' : ''
  const isCorrect = correctLetters.value.includes(key)
  const isPicked = picked.value.includes(key)
  if (isCorrect) return 'right'
  if (isPicked && !isCorrect) return 'wrong'
  return 'dim'
}
</script>

<template>
  <div class="dr">
    <div class="dr-head">
      <div>
        <span class="dr-kicker">错题再练 · 闭环回炉</span>
        <h3 class="dr-title">按错因重做未掌握的政治错题</h3>
        <p class="dr-note">做对记一次（连续做对 2 次自动毕业），做错当场给出错因诊断。数据实时读写错题本，不用来回切页。</p>
      </div>
      <div class="dr-scope">
        <button :class="{ on: scope === 'xxs' }" @click="scope = 'xxs'; restart()">🌱 新思想</button>
        <button :class="{ on: scope === 'all' }" @click="scope = 'all'; restart()">📚 全部政治</button>
      </div>
    </div>

    <div class="dr-strip">
      <div class="dr-stat"><strong>{{ pool.length }}</strong><span>待练未掌握</span></div>
      <div class="dr-stat"><strong>{{ sessionRight }}/{{ sessionTotal }}</strong><span>本次连对</span></div>
      <div class="dr-stat coral"><strong>GRAD=2</strong><span>连对 2 次即毕业</span></div>
    </div>

    <!-- 全部刷完 -->
    <div v-if="done" class="dr-clear">
      <div class="dc-emoji">🎉</div>
      <p>当前{{ scope === 'xxs' ? '新思想' : '政治' }}没有未掌握错题了 —— 要么已全毕业，要么还没录入。去「<b>错因诊断</b>」看看下一个该攻的点。</p>
    </div>

    <!-- 题目卡 -->
    <div v-else-if="current" class="dr-card">
      <div class="dr-meta">
        <span class="dm-chap">{{ current.chapterName || '未分类' }}</span>
        <span class="dm-sec">{{ parsed.multi ? '多选' : '单选' }}</span>
        <span class="dm-pos">第 {{ idx + 1 }} / {{ pool.length }} 题 · 剩 {{ remaining }}</span>
      </div>

      <p class="dr-stem">{{ parsed.stem }}</p>

      <div class="dr-opts">
        <button
          v-for="o in parsed.options" :key="o.key"
          class="dr-opt" :class="optClass(o.key)" :disabled="judged"
          @click="togglePick(o.key)"
        >
          <span class="do-key">{{ o.key }}</span>
          <span class="do-txt">{{ o.text }}</span>
        </button>
      </div>

      <div v-if="!judged" class="dr-actions">
        <button class="da-submit" :disabled="picked.length === 0" @click="submit">提交答案</button>
        <button class="da-skip" @click="skip">不会 → 看解析并跳过</button>
      </div>

      <!-- 判分结果 -->
      <div v-else class="dr-result" :class="isRight ? 'good' : 'bad'">
        <div class="dr-verdict">
          <span class="dv-mark">{{ isRight ? '✓ 做对了' : '✗ 还没稳' }}</span>
          <span class="dv-ans">正确答案：<b>{{ correctLetters.join('') }}</b></span>
          <span v-if="prevMine.length" class="dv-first">上次你答：{{ prevMine.join('') }}</span>
        </div>

        <div v-if="causeMeta" class="dr-cause" :style="{ borderColor: causeMeta.hex }">
          <div class="dc-tag" :style="{ background: causeMeta.hex }">{{ causeMeta.label }}</div>
          <p class="dc-diag"><b>病因：</b>{{ causeMeta.diag }}</p>
          <p class="dc-cure"><b>对策：</b>{{ causeMeta.cure }}</p>
        </div>

        <details v-if="!isRight" class="dr-prev">
          <summary>看原始订正</summary>
          <pre>{{ current.correction }}</pre>
        </details>

        <div class="dr-actions">
          <button class="da-submit" @click="next">下一题 →</button>
        </div>
      </div>
    </div>

    <p class="dr-foot">💡 需要看整题清单或改标记，去 <router-link to="/wrong-problems" class="dr-link">全科错题本</router-link>。</p>
  </div>
</template>

<style scoped>
.dr {
  --dr-ink: #1f2d3d; --dr-body: #303133; --dr-muted: #5b6b7f;
  --dr-gold: #ffc53d; --dr-navy: #16345c; --dr-navy-deep: #0d2137;
  --dr-coral: #e8604c; --dr-green: #2e9e6b; --dr-blue: #3a7ca5; --dr-line: #e4ebf3; --dr-soft: #f5f8fc;
  --font-display: 'Barlow Condensed', 'FZCuHei', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  color: var(--dr-body);
}
.dr-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 18px; flex-wrap: wrap; margin-bottom: 16px; }
.dr-kicker { font-family: var(--font-mono); font-size: .7rem; letter-spacing: .16em; color: var(--dr-blue); }
.dr-title { font-size: 1.3rem; color: var(--dr-ink); margin: 4px 0 8px; font-weight: 800; }
.dr-note { font-size: .88rem; color: var(--dr-muted); line-height: 1.7; margin: 0; max-width: 640px; }
.dr-scope { display: flex; gap: 8px; }
.dr-scope button { border: 1px solid var(--dr-line); background: #fff; color: var(--dr-muted); padding: 8px 16px; border-radius: 999px; font-size: .88rem; font-weight: 600; cursor: pointer; transition: all .18s; }
.dr-scope button.on { background: var(--dr-navy); color: #fff; border-color: var(--dr-navy); }

.dr-strip { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 18px; }
.dr-stat { background: #fff; border: 1px solid var(--dr-line); border-left: 4px solid var(--dr-blue); border-radius: 10px; padding: 12px 16px; text-align: center; }
.dr-stat strong { display: block; font-family: var(--font-display); font-size: 1.5rem; color: var(--dr-navy); line-height: 1.2; }
.dr-stat span { font-size: .74rem; color: var(--dr-muted); }
.dr-stat.coral { border-left-color: var(--dr-coral); }
.dr-stat.coral strong { font-size: 1.15rem; color: var(--dr-coral); }

.dr-clear { background: #eef8f2; border: 1px solid rgba(46,158,107,.35); border-radius: 14px; padding: 40px 24px; text-align: center; }
.dc-emoji { font-size: 2.4rem; }
.dr-clear p { color: #1f4d38; font-size: .95rem; line-height: 1.7; margin: 10px 0 0; }
.dr-clear p b { color: var(--dr-coral); }

.dr-card { border: 1px solid var(--dr-line); border-radius: 14px; background: #fff; padding: 20px 22px; }
.dr-meta { display: flex; gap: 10px; align-items: center; margin-bottom: 12px; flex-wrap: wrap; }
.dm-chap { font-size: .82rem; font-weight: 700; color: #fff; background: var(--dr-navy); border-radius: 6px; padding: 3px 10px; }
.dm-sec { font-size: .78rem; color: var(--dr-blue); background: #e7f0f6; border-radius: 6px; padding: 3px 9px; }
.dm-pos { margin-left: auto; font-family: var(--font-mono); font-size: .78rem; color: var(--dr-muted); }
.dr-stem { font-size: .98rem; line-height: 1.75; color: var(--dr-ink); margin: 0 0 16px; white-space: pre-wrap; }
.dr-opts { display: flex; flex-direction: column; gap: 9px; }
.dr-opt { display: flex; align-items: flex-start; gap: 10px; text-align: left; border: 1.5px solid var(--dr-line); background: #fff; border-radius: 10px; padding: 11px 14px; cursor: pointer; transition: all .15s; font-size: .9rem; line-height: 1.55; color: var(--dr-body); }
.dr-opt:hover:not(:disabled) { border-color: var(--dr-navy); background: #f8fbff; }
.dr-opt:disabled { cursor: default; }
.dr-opt.sel { border-color: var(--dr-navy); background: #eef3f9; box-shadow: 0 0 0 2px rgba(22,52,92,.12); }
.dr-opt.right { border-color: var(--dr-green); background: #eef8f2; }
.dr-opt.wrong { border-color: var(--dr-coral); background: #fff1ee; box-shadow: 0 0 0 2px rgba(232,96,76,.15); }
.dr-opt.dim { opacity: .55; }
.do-key { font-family: var(--font-mono); font-weight: 700; color: var(--dr-navy); flex-shrink: 0; }
.dr-opt.right .do-key { color: var(--dr-green); }
.dr-opt.wrong .do-key { color: var(--dr-coral); }
.do-txt { flex: 1; }

.dr-actions { display: flex; gap: 12px; margin-top: 16px; flex-wrap: wrap; }
.da-submit { background: var(--dr-navy); color: #fff; border: none; border-radius: 9px; padding: 10px 22px; font-size: .92rem; font-weight: 700; cursor: pointer; }
.da-submit:disabled { opacity: .45; cursor: not-allowed; }
.da-skip { background: transparent; color: var(--dr-muted); border: 1px dashed var(--dr-line); border-radius: 9px; padding: 10px 18px; font-size: .88rem; cursor: pointer; }
.da-skip:hover { color: var(--dr-coral); border-color: var(--dr-coral); }

.dr-result { margin-top: 16px; padding-top: 16px; border-top: 1px dashed var(--dr-line); }
.dr-verdict { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
.dv-mark { font-weight: 800; font-size: 1rem; }
.dr-result.good .dv-mark { color: var(--dr-green); }
.dr-result.bad .dv-mark { color: var(--dr-coral); }
.dv-ans { font-size: .9rem; color: var(--dr-body); }
.dv-ans b { color: var(--dr-green); font-family: var(--font-mono); }
.dv-first { font-size: .84rem; color: var(--dr-muted); }

.dr-cause { margin-top: 14px; border: 1px solid var(--dr-line); border-left-width: 4px; border-radius: 10px; padding: 14px 16px; background: var(--dr-soft); }
.dc-tag { display: inline-block; color: #fff; font-size: .78rem; font-weight: 700; border-radius: 6px; padding: 3px 12px; margin-bottom: 8px; }
.dc-diag, .dc-cure { margin: 5px 0 0; font-size: .88rem; line-height: 1.65; color: var(--dr-body); }
.dc-diag b { color: var(--dr-coral); } .dc-cure b { color: var(--dr-green); }

.dr-prev { margin-top: 12px; font-size: .86rem; color: var(--dr-muted); }
.dr-prev summary { cursor: pointer; color: var(--dr-blue); }
.dr-prev pre { white-space: pre-wrap; background: #fff; border: 1px solid var(--dr-line); border-radius: 8px; padding: 10px 12px; margin: 8px 0 0; font-family: var(--font-mono); font-size: .8rem; color: var(--dr-body); }

.dr-foot { margin-top: 22px; font-size: .84rem; color: var(--dr-muted); }
.dr-link { color: var(--dr-navy); font-weight: 700; text-decoration: none; border-bottom: 1px solid var(--dr-gold); }

@media (max-width: 768px) {
  .dr-strip { grid-template-columns: 1fr; }
  .dr-card { padding: 16px; }
}
</style>

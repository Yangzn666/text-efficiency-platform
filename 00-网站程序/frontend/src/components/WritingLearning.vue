<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('small')

// ══════════════ 页签1：小作文模板 ══════════════
interface LetterTemplate {
  id: string
  name: string
  icon: string
  scene: string
  skeleton: string[]
  openers: string[]
  body: string[]
  closers: string[]
  tips: string[]
}

const letterTemplates: LetterTemplate[] = [
  {
    id: 'suggestion', name: '建议信', icon: '💡', scene: '给朋友/机构提出建议',
    skeleton: ['Dear ...,', '① 说明写信目的：针对……提出建议', '② 具体建议 2-3 条（First / Besides / Last）', '③ 感谢并期待采纳', 'Yours sincerely,', 'Li Ming'],
    openers: ['I am writing to offer some practical suggestions regarding ...', 'Learning that you are troubled by ..., I would like to propose the following advice.'],
    body: ['First and foremost, it is advisable for you to ...', 'In addition, ... would be of great help to you.', 'Last but not least, you are supposed to ...'],
    closers: ['I sincerely hope my suggestions will be taken into consideration.', 'I am looking forward to your favorable reply at your earliest convenience.'],
    tips: ['语气委婉：多用 it is advisable that / would be better 等缓和表达', '建议不少于两条，每条带简要理由']
  },
  {
    id: 'apology', name: '道歉信', icon: '🙏', scene: '失约/失误/无法履约',
    skeleton: ['Dear ...,', '① 开门见山致歉并说明缘由', '② 解释原因 + 补救措施', '③ 再次道歉恳请谅解', 'Yours sincerely,', 'Li Ming'],
    openers: ['I am writing to express my sincere apology for ...', 'Please accept my heartfelt apology for failing to ...'],
    body: ['The reason is that ..., which was beyond my control.', 'To make up for it, I would like to ... at your convenience.'],
    closers: ['Once again, I am sorry for any inconvenience caused.', 'I hope you can accept my apology and understand my situation.'],
    tips: ['道歉要诚恳，原因要合理，务必给出补救方案', '切忌推卸责任，结尾再次致歉加深印象']
  },
  {
    id: 'invitation', name: '邀请信', icon: '✉️', scene: '邀请参加活动/发言',
    skeleton: ['Dear ...,', '① 说明活动并发出邀请', '② 活动时间地点 + 具体内容', '③ 期待参与并请回复确认', 'Yours sincerely,', 'Li Ming'],
    openers: ['I am writing to invite you to attend ...', 'On behalf of the Students\' Union, I cordially invite you to ...'],
    body: ['The activity will be held in the lecture hall at 7 p.m. next Friday.', 'It would be a great honor if you could give us a speech on ...'],
    closers: ['I am looking forward to your participation.', 'Please confirm your attendance at your earliest convenience.'],
    tips: ['时间、地点、主题三要素缺一不可', '对长辈/专家用词恭敬：cordially / a great honor']
  },
  {
    id: 'complaint', name: '投诉信', icon: '⚠️', scene: '对商品/服务表达不满',
    skeleton: ['Dear Sir or Madam,', '① 表明身份与投诉事由', '② 具体问题 2 条 + 影响', '③ 提出诉求（退换/整改）', 'Yours faithfully,', 'Li Ming'],
    openers: ['I am writing to express my dissatisfaction with ...', 'I regret to inform you that I am not satisfied with the service I received.'],
    body: ['To begin with, ...; moreover, ...', 'I strongly request that immediate measures be taken to solve this problem.'],
    closers: ['I trust you will handle this matter promptly and properly.', 'I am awaiting your reply and a reasonable solution.'],
    tips: ['陈述事实为主，避免情绪化表达', '诉求要具体：refund / replacement / improvement']
  },
  {
    id: 'application', name: '申请信', icon: '📋', scene: '申请职位/志愿者',
    skeleton: ['Dear Sir or Madam,', '① 说明申请职位及信息来源', '② 自身优势 2-3 条（能力+经历）', '③ 表达渴望并附简历', 'Yours faithfully,', 'Li Ming'],
    openers: ['I am writing to apply for the position of ...', 'Having learned that you are recruiting volunteers for ..., I am eager to apply.'],
    body: ['I am confident that I am qualified for the post for the following reasons.', 'With a good command of English and rich experience in ..., I can ...'],
    closers: ['I would appreciate it if you could grant me the opportunity.', 'Enclosed is my résumé for your reference.'],
    tips: ['优势要与岗位要求对应，忌空泛自夸', '结尾惯用 enclosed is my résumé（附简历）']
  },
  {
    id: 'thanks', name: '感谢信', icon: '💐', scene: '感谢帮助/款待/指导',
    skeleton: ['Dear ...,', '① 开门见山表达感谢', '② 回顾对方帮助的具体细节与影响', '③ 再次致谢并表达回报意愿', 'Yours sincerely,', 'Li Ming'],
    openers: ['I am writing to convey my heartfelt gratitude to you for ...', 'Words fail me when I wish to express my sincere thanks to you.'],
    body: ['Without your generous help, I could not have ...', 'Your kindness and patience have deeply impressed me and benefited me a lot.'],
    closers: ['Once again, thank you from the bottom of my heart.', 'I do hope that I will have the opportunity to repay your kindness.'],
    tips: ['必须有具体细节，避免通篇客套话', '虚拟语气 Without your help, I could not have... 是加分句型']
  },
  {
    id: 'notice', name: '通知', icon: '📢', scene: '学生会/社团发布活动通知',
    skeleton: ['NOTICE（标题居中）', '① 活动目的 + 主办方', '② 时间地点 + 内容安排', '③ 参与方式与要求', '发布单位（右对齐）', '日期（右对齐）'],
    openers: ['In order to enrich campus life, the Students\' Union will hold ...', 'A lecture on ... will be held in the lecture hall on June 10.'],
    body: ['The details are arranged as follows: ...', 'All students are welcome to attend and please arrive ten minutes earlier.'],
    closers: ['Those who want to participate please sign up at the office before Friday.', 'The Students\' Union'],
    tips: ['通知无称呼落款，格式：标题居中 + 落款单位日期右对齐', '用第三人称、被动语态为主，时态以将来时为主']
  }
]

const activeLetter = ref('suggestion')
const currentLetter = computed(() => letterTemplates.find(l => l.id === activeLetter.value)!)

// ══════════════ 页签2：大作文模板 ══════════════
const bigParagraphs = [
  {
    name: '第一段 · 描图句库',
    color: 'gold',
    role: '2-3 句客观描述图片内容 + 引出寓意，忌过度解读',
    sentences: [
      'As is vividly depicted in the cartoon, ...',
      'What is presented in the picture is quite thought-provoking.',
      'Simple as the picture is, the symbolic meaning behind it is as deep as the ocean.',
      'The drawing shows that ..., which immediately arrests our attention.',
      'The caption beneath the picture reads, "..."'
    ]
  },
  {
    name: '第二段 · 寓意阐释句库',
    color: 'red',
    role: '点明寓意 + 原因分析/举例论证，4-5 句为正文核心',
    sentences: [
      'The cartoon conveys a clear message that ...',
      'The primary purpose of the drawing is to remind us of the importance of ...',
      'Why does ... play such an indispensable role? The reasons can be listed as follows.',
      'To begin with, ...; furthermore, ...',
      'Take ... as a convincing example.',
      'Were it not for ..., we could hardly achieve success.'
    ]
  },
  {
    name: '第三段 · 建议升华句库',
    color: 'navy',
    role: '结论 + 建议措施 + 展望升华，3-4 句收尾有力',
    sentences: [
      'From what has been discussed above, we may safely draw the conclusion that ...',
      'It is high time that we took effective measures to ...',
      'On the one hand, the authorities should ...; on the other hand, we individuals ought to ...',
      'Only in this way can we embrace a brighter future.',
      'I firmly believe that with joint efforts, the problem will be solved in the near future.'
    ]
  }
]

const modelEssay = {
  theme: '坚持（Persistence）· 图画作文范例',
  paragraphs: [
    { label: '描图段', text: 'As is clearly shown in the picture, a young man is climbing a steep mountain, sweating all over but refusing to give up. The caption beneath reads, "Persistence leads to success."', note: '2 句完成：客观描述 + 引文字说明' },
    { label: '阐释段', text: 'The picture intends to tell us the significance of persistence. To begin with, only by persisting can we overcome the inevitable obstacles on the road to success. Furthermore, persistence distinguishes the successful from the mediocre. Take Thomas Edison as a convincing example: had he given up after thousands of failed experiments, the light bulb would never have been invented.', note: '观点句 + 两层理由 + 例证（倒装虚拟句加分）' },
    { label: '升华段', text: 'From what has been discussed above, we may safely draw the conclusion that persistence is the key to realizing our dreams. It is high time that we bore this quality in mind and put it into practice. Only by persisting in what we pursue can we reach the summit of our life.', note: '结论 + 建议 + Only 倒装收尾' }
  ]
}

// ══════════════ 页签3：语料升级库 ══════════════
const themeWords = [
  { theme: '坚持', icon: '🧗', words: 'perseverance / persistence；persist in；stick to one\'s dream；never give up in the face of difficulties' },
  { theme: '合作', icon: '🤝', words: 'cooperation / teamwork；cooperate with；make concerted efforts；unity is strength' },
  { theme: '文化', icon: '🏮', words: 'traditional culture；cultural heritage；cultural confidence；inherit and carry forward' },
  { theme: '环保', icon: '🌱', words: 'environmental protection；eco-friendly；sustainable development；live in harmony with nature' },
  { theme: '科技', icon: '🤖', words: 'artificial intelligence；technological innovation；a double-edged sword；keep pace with the times' },
  { theme: '诚信', icon: '🤲', words: 'honesty / integrity；keep one\'s promise；trustworthiness；a man of his word' },
  { theme: '乐观', icon: '☀️', words: 'optimism；positive attitude；face challenges with courage；turn pressure into motivation' },
  { theme: '创新', icon: '🚀', words: 'innovation；originality；blaze new trails；think outside the box' }
]

const wordUpgrades = [
  ['think', 'hold the view that / maintain that'],
  ['important', 'of vital significance / indispensable'],
  ['more and more', 'an increasing number of'],
  ['very', 'exceedingly / remarkably'],
  ['good', 'beneficial / rewarding'],
  ['bad', 'detrimental / adverse'],
  ['want', 'be eager to / desire'],
  ['like', 'be fond of / be keen on'],
  ['show', 'demonstrate / illustrate'],
  ['many', 'a host of / a multitude of'],
  ['should', 'be supposed to / it is imperative that'],
  ['get', 'acquire / obtain']
]

const quotes = [
  { text: 'Where there is a will, there is a way.', topic: '坚持 / 意志' },
  { text: 'Success is one percent inspiration and ninety-nine percent perspiration.', topic: '勤奋 / 努力' },
  { text: 'A journey of a thousand miles begins with a single step.', topic: '实践 / 积累' },
  { text: 'No pains, no gains.', topic: '付出 / 收获' },
  { text: 'Knowledge is power.', topic: '知识 / 学习' },
  { text: 'Unity is strength.', topic: '合作 / 团结' },
  { text: 'Every coin has two sides.', topic: '辩证 / 科技双刃剑' },
  { text: 'Practice makes perfect.', topic: '练习 / 熟能生巧' }
]

// ══════════════ 页签4：实战演练室 ══════════════
interface PracticeRecord {
  type: string
  words: number
  timeUsed: number
  overtime: boolean
  checks: number
  date: string
}

const STORAGE_KEY = 'writing-practice-history-v1'
const writeTypes = [
  { id: 'small', name: '小作文', target: '约100词', minutes: 20 },
  { id: 'big', name: '大作文', target: '160-200词', minutes: 35 }
]

const writeType = ref('small')
const currentWriteType = computed(() => writeTypes.find(t => t.id === writeType.value)!)
const draft = ref('')
const wordCount = computed(() => {
  const t = draft.value.trim()
  return t ? t.split(/\s+/).length : 0
})

// 计时器（倒计时）
const totalSeconds = ref(20 * 60)
const remainSeconds = ref(20 * 60)
const timerRunning = ref(false)
let timerHandle: ReturnType<typeof setInterval> | null = null

const switchType = (id: string) => {
  writeType.value = id
  const t = writeTypes.find(x => x.id === id)!
  totalSeconds.value = t.minutes * 60
  remainSeconds.value = t.minutes * 60
  stopTimer()
}

const startTimer = () => {
  if (timerRunning.value) return
  timerRunning.value = true
  timerHandle = setInterval(() => {
    remainSeconds.value -= 1
    if (remainSeconds.value <= 0) {
      remainSeconds.value = 0
      stopTimer()
      ElMessage.warning('建议用时已到，尽量收笔进入自检！')
    }
  }, 1000)
}

const stopTimer = () => {
  timerRunning.value = false
  if (timerHandle) { clearInterval(timerHandle); timerHandle = null }
}

const resetTimer = () => {
  stopTimer()
  remainSeconds.value = totalSeconds.value
}

onUnmounted(() => stopTimer())

const timeText = computed(() => {
  const s = Math.abs(remainSeconds.value)
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
})
const isOvertime = computed(() => remainSeconds.value <= 0)

// 自检清单
const checklist = [
  '格式正确（称呼/落款/标题无遗漏）',
  '三段结构完整，段落分工清晰',
  '无主谓一致、时态等低级语法错误',
  '使用至少 2 个复杂句（定语从句/倒装/虚拟）',
  '套用模板句自然，无生硬堆砌',
  '卷面整洁，词数符合要求'
]
const checked = ref<boolean[]>(checklist.map(() => false))
const history = ref<PracticeRecord[]>([])

const loadHistory = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) history.value = JSON.parse(raw)
  } catch { history.value = [] }
}
loadHistory()

const submit = () => {
  if (!draft.value.trim()) {
    ElMessage.warning('请先写点什么再交卷～')
    return
  }
  const record: PracticeRecord = {
    type: currentWriteType.value.name,
    words: wordCount.value,
    timeUsed: totalSeconds.value - remainSeconds.value,
    overtime: isOvertime.value,
    checks: checked.value.filter(Boolean).length,
    date: new Date().toLocaleString('zh-CN', { hour12: false })
  }
  history.value.unshift(record)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.value))
  stopTimer()
  ElMessage.success(`交卷成功：${record.words}词，用时${Math.max(0, Math.round(record.timeUsed / 60))}分钟`)
  draft.value = ''
  checked.value = checklist.map(() => false)
  resetTimer()
}

const fmtTime = (sec: number) => `${Math.max(0, Math.round(sec / 60))}分钟`
</script>

<template>
  <div class="wl-wrap">
    <el-tabs v-model="activeTab" class="wl-tabs">
      <!-- ══ 小作文模板 ══ -->
      <el-tab-pane label="✉️ 小作文模板" name="small">
        <div class="letter-layout">
          <aside class="letter-nav">
            <button
              v-for="l in letterTemplates"
              :key="l.id"
              class="letter-nav-item"
              :class="{ active: l.id === activeLetter }"
              @click="activeLetter = l.id"
            >
              <span>{{ l.icon }} {{ l.name }}</span>
              <em>{{ l.scene }}</em>
            </button>
          </aside>
          <div class="letter-body">
            <h3>{{ currentLetter.icon }} {{ currentLetter.name }} · 格式骨架</h3>
            <div class="skeleton">
              <div v-for="(line, i) in currentLetter.skeleton" :key="i" class="skeleton-line">{{ line }}</div>
            </div>
            <div class="sentence-groups">
              <div class="sg">
                <h4>开头句（表明目的）</h4>
                <p v-for="(s, i) in currentLetter.openers" :key="i">{{ s }}</p>
              </div>
              <div class="sg">
                <h4>正文句（展开细节）</h4>
                <p v-for="(s, i) in currentLetter.body" :key="i">{{ s }}</p>
              </div>
              <div class="sg">
                <h4>结尾句（收束致意）</h4>
                <p v-for="(s, i) in currentLetter.closers" :key="i">{{ s }}</p>
              </div>
            </div>
            <div class="letter-tips">
              <span v-for="(t, i) in currentLetter.tips" :key="i">⚠️ {{ t }}</span>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <!-- ══ 大作文模板 ══ -->
      <el-tab-pane label="🖼️ 大作文模板" name="big">
        <div class="big-intro">
          <strong>英一大作文 = 图画作文三段式</strong>
          <p>160-200 词：第一段描图（约40词）→ 第二段阐释寓意（约90词）→ 第三段建议升华（约50词）。背诵句库后按框架组句，考场上 35 分钟内完成。</p>
        </div>
        <div class="big-para-grid">
          <section v-for="(p, i) in bigParagraphs" :key="i" class="big-para-card" :class="p.color">
            <h4>{{ p.name }}</h4>
            <div class="bp-role">{{ p.role }}</div>
            <ul>
              <li v-for="(s, j) in p.sentences" :key="j">{{ s }}</li>
            </ul>
          </section>
        </div>
        <section class="model-essay">
          <h3>📄 完整范文结构拆解 · {{ modelEssay.theme }}</h3>
          <div v-for="(p, i) in modelEssay.paragraphs" :key="i" class="me-para">
            <div class="me-label">{{ p.label }}<em>{{ p.note }}</em></div>
            <p>{{ p.text }}</p>
          </div>
        </section>
      </el-tab-pane>

      <!-- ══ 语料升级库 ══ -->
      <el-tab-pane label="💎 语料升级库" name="corpus">
        <h3 class="corpus-h3">🗂️ 高频主题词</h3>
        <div class="theme-grid">
          <div v-for="t in themeWords" :key="t.theme" class="theme-card">
            <strong>{{ t.icon }} {{ t.theme }}</strong>
            <p>{{ t.words }}</p>
          </div>
        </div>
        <h3 class="corpus-h3">🔁 低级词 → 高分替换</h3>
        <div class="upgrade-table">
          <div class="ut-row ut-head">
            <span>避免使用</span><span></span><span>高分替换</span>
          </div>
          <div v-for="([low, high], i) in wordUpgrades" :key="i" class="ut-row">
            <span class="ut-low">{{ low }}</span>
            <span class="ut-arrow">→</span>
            <span class="ut-high">{{ high }}</span>
          </div>
        </div>
        <h3 class="corpus-h3">📜 名言储备</h3>
        <div class="quote-grid">
          <div v-for="q in quotes" :key="q.text" class="quote-card">
            <p>"{{ q.text }}"</p>
            <span>{{ q.topic }}</span>
          </div>
        </div>
      </el-tab-pane>

      <!-- ══ 实战演练室 ══ -->
      <el-tab-pane label="⏱️ 实战演练室" name="drill">
        <div class="drill-top">
          <div class="drill-type-btns">
            <button
              v-for="t in writeTypes"
              :key="t.id"
              class="drill-type"
              :class="{ active: t.id === writeType }"
              @click="switchType(t.id)"
            >{{ t.name }}（{{ t.target }} · 限时{{ t.minutes }}分钟）</button>
          </div>
          <div class="drill-timer" :class="{ overtime: isOvertime }">
            <span class="timer-label">{{ isOvertime ? '已超时' : '剩余' }}</span>
            <span class="timer-num">{{ timeText }}</span>
            <button @click="timerRunning ? stopTimer() : startTimer()">{{ timerRunning ? '暂停' : '开始' }}</button>
            <button @click="resetTimer">重置</button>
          </div>
        </div>

        <div class="answer-sheet">
          <div class="sheet-head">
            <span>ANSWER SHEET · {{ currentWriteType.name }}答题纸</span>
            <span class="sheet-count" :class="{ ok: currentWriteType.id === 'small' ? wordCount >= 80 : wordCount >= 160 }">
              当前词数 {{ wordCount }} / 目标 {{ currentWriteType.target }}
            </span>
          </div>
          <textarea v-model="draft" placeholder="在此书写你的作文，建议先默写框架再填充内容…"></textarea>
        </div>

        <div class="check-panel">
          <h4>✅ 交卷自检清单</h4>
          <div class="check-grid">
            <label v-for="(c, i) in checklist" :key="i">
              <input type="checkbox" v-model="checked[i]"> {{ c }}
            </label>
          </div>
          <button class="submit-btn" @click="submit">📮 交卷并记录</button>
        </div>

        <div v-if="history.length" class="history-panel">
          <h4>📚 练习历史（{{ history.length }}次）</h4>
          <div class="history-row head">
            <span>时间</span><span>类型</span><span>词数</span><span>用时</span><span>自检</span>
          </div>
          <div v-for="(r, i) in history" :key="i" class="history-row">
            <span>{{ r.date }}</span>
            <span>{{ r.type }}</span>
            <span>{{ r.words }}词</span>
            <span :class="{ over: r.overtime }">{{ fmtTime(r.timeUsed) }}{{ r.overtime ? '（超时）' : '' }}</span>
            <span>{{ r.checks }}/6</span>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.wl-wrap {
  --ink: #1f2d3d;
  --body: #303133;
  --gold: #ffc53d;
  --navy-deep: #0d2137;
  --navy: #16345c;
  --line: #e4ebf3;
  --bg-soft: #f5f8fc;
  --subject: #f0a820;
}

.wl-tabs :deep(.el-tabs__item) {
  font-size: 0.98rem;
  height: 44px;
  line-height: 44px;
}
.wl-tabs :deep(.el-tabs__item.is-active) {
  color: var(--navy);
  font-weight: 700;
}
.wl-tabs :deep(.el-tabs__active-bar) {
  background: linear-gradient(90deg, var(--gold), #f0a820);
  height: 3px;
}

/* ══ 小作文 ══ */
.letter-layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 18px;
  align-items: start;
}
.letter-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: var(--bg-soft);
  border-radius: 12px;
  padding: 12px;
}
.letter-nav-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
  text-align: left;
  padding: 10px 14px;
  border: 1px solid transparent;
  border-radius: 9px;
  background: #fff;
  cursor: pointer;
  transition: all 0.22s ease;
}
.letter-nav-item span {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--ink);
}
.letter-nav-item em {
  font-style: normal;
  font-size: 0.72rem;
  color: #5b6b7f;
}
.letter-nav-item:hover {
  transform: translateX(3px);
  border-color: var(--gold);
}
.letter-nav-item.active {
  background: linear-gradient(135deg, var(--navy-deep), var(--navy));
  border-color: var(--navy);
}
.letter-nav-item.active span { color: var(--gold); }
.letter-nav-item.active em { color: #a8bdd4; }

.letter-body h3 {
  margin: 0 0 14px;
  font-size: 1.1rem;
  color: var(--ink);
}
.skeleton {
  background: #fffdf5;
  border: 1px dashed var(--gold);
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 18px;
  font-family: 'Georgia', serif;
}
.skeleton-line {
  padding: 5px 0;
  color: #4a3d1a;
  font-size: 0.92rem;
  border-bottom: 1px dotted rgba(212, 160, 18, 0.25);
}
.skeleton-line:last-child { border-bottom: none; }

.sentence-groups {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 14px;
  margin-bottom: 16px;
}
.sg {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 14px 16px;
}
.sg h4 {
  margin: 0 0 10px;
  font-size: 0.85rem;
  color: var(--navy);
  padding-bottom: 6px;
  border-bottom: 2px solid var(--gold);
}
.sg p {
  margin: 8px 0;
  font-size: 0.82rem;
  line-height: 1.7;
  color: var(--body);
  font-family: 'Georgia', serif;
  padding-left: 14px;
  position: relative;
}
.sg p::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--gold);
  font-weight: 800;
}
.letter-tips {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.letter-tips span {
  font-size: 0.8rem;
  color: #a06a00;
  background: #fff8ec;
  border-radius: 8px;
  padding: 7px 12px;
}

/* ══ 大作文 ══ */
.big-intro {
  background: linear-gradient(135deg, #fff8ec, #fffdf5);
  border: 1px solid rgba(255, 197, 61, 0.45);
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 18px;
}
.big-intro strong {
  display: block;
  color: var(--ink);
  font-size: 1rem;
  margin-bottom: 6px;
}
.big-intro p {
  margin: 0;
  color: var(--body);
  font-size: 0.86rem;
  line-height: 1.75;
}
.big-para-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}
.big-para-card {
  border-radius: 14px;
  padding: 18px 20px;
  border: 1px solid var(--line);
  background: #fff;
}
.big-para-card.gold { border-top: 4px solid var(--gold); }
.big-para-card.red { border-top: 4px solid #f56c6c; }
.big-para-card.navy { border-top: 4px solid var(--navy); }
.big-para-card h4 {
  margin: 0 0 6px;
  font-size: 0.98rem;
  color: var(--ink);
}
.bp-role {
  font-size: 0.75rem;
  color: #5b6b7f;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px dashed var(--line);
}
.big-para-card ul {
  margin: 0;
  padding-left: 18px;
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.big-para-card li {
  font-size: 0.8rem;
  line-height: 1.65;
  color: var(--body);
  font-family: 'Georgia', serif;
}
.model-essay {
  background: var(--bg-soft);
  border-radius: 14px;
  padding: 20px 24px;
}
.model-essay h3 {
  margin: 0 0 14px;
  font-size: 1.02rem;
  color: var(--ink);
}
.me-para {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 14px 18px;
  margin-bottom: 10px;
}
.me-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--navy);
  margin-bottom: 8px;
}
.me-label em {
  font-style: normal;
  font-weight: 400;
  font-size: 0.72rem;
  color: #5b6b7f;
  margin-left: 10px;
}
.me-para p {
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.85;
  color: var(--body);
  font-family: 'Georgia', serif;
}

/* ══ 语料库 ══ */
.corpus-h3 {
  font-size: 1.02rem;
  color: var(--ink);
  margin: 22px 0 12px;
}
.corpus-h3:first-child { margin-top: 0; }
.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
}
.theme-card {
  background: #fff;
  border: 1px solid var(--line);
  border-left: 4px solid var(--gold);
  border-radius: 10px;
  padding: 12px 16px;
  transition: all 0.22s ease;
}
.theme-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 18px rgba(13, 33, 55, 0.1);
}
.theme-card strong {
  color: var(--ink);
  font-size: 0.92rem;
}
.theme-card p {
  margin: 6px 0 0;
  font-size: 0.78rem;
  line-height: 1.7;
  color: var(--body);
}
.upgrade-table {
  border: 1px solid var(--line);
  border-radius: 12px;
  overflow: hidden;
}
.ut-row {
  display: grid;
  grid-template-columns: 1fr 40px 2fr;
  align-items: center;
  padding: 9px 18px;
  font-size: 0.85rem;
}
.ut-row:nth-child(even) { background: var(--bg-soft); }
.ut-head {
  background: var(--navy) !important;
  color: var(--gold);
  font-weight: 700;
  font-size: 0.8rem;
}
.ut-low {
  color: #c0392b;
  text-decoration: line-through;
  font-family: 'Georgia', serif;
}
.ut-arrow { text-align: center; color: var(--gold); font-weight: 800; }
.ut-high {
  color: #1e7a45;
  font-weight: 600;
  font-family: 'Georgia', serif;
}
.quote-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px;
}
.quote-card {
  background: linear-gradient(160deg, var(--navy-deep), var(--navy));
  border-radius: 12px;
  padding: 16px 18px;
  transition: transform 0.22s ease;
}
.quote-card:hover { transform: translateY(-3px); }
.quote-card p {
  margin: 0 0 8px;
  color: #fff;
  font-size: 0.86rem;
  line-height: 1.7;
  font-family: 'Georgia', serif;
}
.quote-card span {
  display: inline-block;
  font-size: 0.68rem;
  color: var(--gold);
  border: 1px solid rgba(255, 197, 61, 0.5);
  padding: 2px 10px;
  border-radius: 999px;
}

/* ══ 实战演练室 ══ */
.drill-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.drill-type-btns { display: flex; gap: 10px; flex-wrap: wrap; }
.drill-type {
  border: 1px solid var(--line);
  background: #fff;
  color: var(--navy);
  font-weight: 600;
  font-size: 0.82rem;
  padding: 8px 16px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s;
}
.drill-type:hover { border-color: var(--gold); }
.drill-type.active {
  background: linear-gradient(135deg, var(--gold), #f0a820);
  color: var(--navy-deep);
  border-color: var(--gold);
  font-weight: 700;
}
.drill-timer {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--navy-deep);
  border-radius: 12px;
  padding: 8px 16px;
}
.drill-timer .timer-label {
  font-size: 0.72rem;
  color: #a8bdd4;
  letter-spacing: 0.1em;
}
.drill-timer .timer-num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.5rem;
  color: var(--gold);
  letter-spacing: 0.05em;
}
.drill-timer.overtime .timer-num { color: #f56c6c; }
.drill-timer button {
  border: 1px solid rgba(255, 197, 61, 0.5);
  background: transparent;
  color: var(--gold);
  font-size: 0.75rem;
  padding: 4px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}
.drill-timer button:hover { background: rgba(255, 197, 61, 0.15); }

.answer-sheet {
  border: 1px solid var(--line);
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 18px;
}
.sheet-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  background: var(--bg-soft);
  padding: 10px 18px;
  font-size: 0.78rem;
  color: var(--navy);
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 0.06em;
}
.sheet-count { color: #a06a00; font-weight: 700; }
.sheet-count.ok { color: #1e7a45; }
.answer-sheet textarea {
  width: 100%;
  min-height: 320px;
  border: none;
  outline: none;
  resize: vertical;
  padding: 20px 24px;
  font-family: 'Georgia', serif;
  font-size: 1rem;
  line-height: 2.2;
  color: var(--body);
  background:
    repeating-linear-gradient(transparent, transparent 2.1rem, rgba(22, 52, 92, 0.08) 2.2rem);
}

.check-panel {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 18px 22px;
  margin-bottom: 18px;
}
.check-panel h4 {
  margin: 0 0 12px;
  font-size: 0.95rem;
  color: var(--ink);
}
.check-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 8px;
  margin-bottom: 14px;
}
.check-grid label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  color: var(--body);
  cursor: pointer;
}
.check-grid input { accent-color: #f0a820; width: 15px; height: 15px; }
.submit-btn {
  background: linear-gradient(135deg, #f0a820, #d98c0f);
  color: #fff;
  border: none;
  font-weight: 700;
  font-size: 0.92rem;
  padding: 11px 30px;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(240, 168, 32, 0.35);
  transition: all 0.22s;
}
.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(240, 168, 32, 0.45);
}

.history-panel {
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 16px 20px;
}
.history-panel h4 {
  margin: 0 0 12px;
  font-size: 0.95rem;
  color: var(--ink);
}
.history-row {
  display: grid;
  grid-template-columns: 1.6fr 0.7fr 0.7fr 1.1fr 0.6fr;
  gap: 8px;
  padding: 8px 10px;
  font-size: 0.8rem;
  color: var(--body);
  border-bottom: 1px solid var(--line);
}
.history-row:last-child { border-bottom: none; }
.history-row.head {
  background: var(--navy);
  color: var(--gold);
  font-weight: 700;
  border-radius: 8px;
  border-bottom: none;
}
.history-row .over { color: #c0392b; }

@media (max-width: 760px) {
  .letter-layout { grid-template-columns: 1fr; }
  .letter-nav { flex-direction: row; flex-wrap: wrap; }
  .letter-nav-item { flex: 1 1 40%; }
  .drill-top { flex-direction: column; align-items: stretch; }
}
</style>

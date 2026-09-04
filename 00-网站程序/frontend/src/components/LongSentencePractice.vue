<script setup lang="ts">
import { ref, computed } from 'vue'

interface Segment { role: string; text: string; note: string }
interface SentenceItem {
  id: number
  source: string
  sentence: string
  hint: string
  segments: Segment[]
  translation: string
  analysis: string
}

const sentences: SentenceItem[] = [
  {
    id: 1,
    source: '2005年 翻译第1句',
    sentence: 'Television is one of the means by which these feelings are created and conveyed—and perhaps never before has it served so much to connect different peoples and nations as in the recent events in Europe.',
    hint: '破折号后是并列分句，注意 never before 前置引起的倒装',
    segments: [
      { role: '主干', text: 'Television is one of the means', note: '电视是手段之一' },
      { role: '定语从句', text: 'by which these feelings are created and conveyed', note: '介词 by 提前，被动语态，修饰 means' },
      { role: '并列分句（倒装）', text: 'perhaps never before has it served so much to connect different peoples and nations', note: '否定副词 never before 前置 → 部分倒装 has it served' },
      { role: '比较状语', text: 'as in the recent events in Europe', note: 'so much...as... 比较结构' }
    ],
    translation: '电视是引发和传递这些感受的手段之一——在欧洲近来发生的事件中，它把不同的民族和国家连在一起，其作用之大，前所未有。',
    analysis: '本句两大考点：①介词+which 定语从句的被动翻译（转主动"……的"字结构）；②否定词前置的部分倒装，翻译时先还原语序再处理，"前所未有"放到句末更符合中文习惯。'
  },
  {
    id: 2,
    source: '2026年 翻译第1句',
    sentence: 'Tracing the history of the term, we can see how the definition of scientific literacy has shifted over time, muddying the waters when it comes to determining the goals of science education.',
    hint: '句首分词、how宾语从句、句尾分词三连结构',
    segments: [
      { role: '状语（非谓语）', text: 'Tracing the history of the term', note: '现在分词作状语，逻辑主语是 we' },
      { role: '主干', text: 'we can see', note: '主谓结构' },
      { role: '宾语从句', text: 'how the definition of scientific literacy has shifted over time', note: 'how 引导，作 see 的宾语' },
      { role: '状语（非谓语）', text: 'muddying the waters', note: '现在分词作结果状语；习语"把水搅浑＝使复杂化"' },
      { role: '时间状语从句', text: 'when it comes to determining the goals of science education', note: 'when it comes to 固定搭配，to 为介词' }
    ],
    translation: '追溯这一术语的历史，我们可以看到"科学素养"的定义随着时间推移不断变化，这也使得确定科学教育的目标变得棘手。',
    analysis: '典型的"主干+两端分词"结构：句首分词译成独立小句"追溯……"，句尾分词译出结果意味"这也使得……"。习语 muddying the waters 必须意译。'
  },
  {
    id: 3,
    source: '2013年 翻译第3句',
    sentence: 'The emphasis on data gathered first-hand, combined with a cross-cultural perspective brought to the analysis of cultures past and present, makes this study a unique and distinctly important social science.',
    hint: '主语很长：先找谓语 makes，再看两个过去分词短语',
    segments: [
      { role: '主语', text: 'The emphasis on data gathered first-hand', note: 'gathered first-hand 是后置定语，修饰 data' },
      { role: '插入成分', text: 'combined with a cross-cultural perspective brought to the analysis of cultures past and present', note: '过去分词短语作伴随/定语，修饰 perspective 的 brought...' },
      { role: '谓语+宾补', text: 'makes this study a unique and distinctly important social science', note: 'make + 宾语 + 宾补结构' }
    ],
    translation: '强调收集第一手资料，加上在分析过去和现在的文化形态时采用的跨文化视角，使得这一研究成为一门独特并且极其重要的社会科学。',
    analysis: '长主语句子拆分关键：谓语 makes 是定位锚点。两个过去分词（gathered / brought）都是后置定语，中文需前置翻译；past and present 后置修饰 cultures。'
  },
  {
    id: 4,
    source: '2008年 翻译第4句',
    sentence: 'On the other, it links these concepts to everyday realities in a manner which is parallel to the links journalists forge on a daily basis between their news coverage and their background knowledge.',
    hint: 'which 定语从句里又套了一个省略 that 的定语从句',
    segments: [
      { role: '主干', text: 'it links these concepts to everyday realities', note: 'link A to B 结构' },
      { role: '方式状语', text: 'in a manner', note: '以……方式' },
      { role: '定语从句', text: 'which is parallel to the links', note: '修饰 manner' },
      { role: '嵌套定语从句', text: 'journalists forge on a daily basis', note: '省略了 that/which，修饰 links；forge 是谓语' },
      { role: '介词短语', text: 'between their news coverage and their background knowledge', note: '与 links 搭配：coverage 与知识之间的联系' }
    ],
    translation: '另一方面，这一学科把传统观念与日常现实结合起来，其方式与记者每天在报道新闻时结合背景知识的做法如出一辙。',
    analysis: '从句套从句时逐层剥开：先主干，再处理 which 从句，最后发现 links 后面还藏着一个省略关系词的定语从句。between...and... 与 links 搭配要还原。'
  },
  {
    id: 5,
    source: '2016年 翻译第2句',
    sentence: 'We define such a mental state as "flow", in which people are so immersed in an activity that nothing else seems to matter.',
    hint: 'define...as... + in which 非限制性定语从句 + so...that 结果从句',
    segments: [
      { role: '主干', text: 'We define such a mental state as "flow"', note: 'define A as B：把A定义为B' },
      { role: '非限制性定语从句', text: 'in which people are so immersed in an activity', note: 'in which 指代 flow 这种状态' },
      { role: '结果状语从句', text: 'that nothing else seems to matter', note: 'so...that... 结果从句' }
    ],
    translation: '我们把这种心理状态定义为"心流"，在这种状态下，人们沉浸于某项活动中，以至于其他一切都显得无关紧要。',
    analysis: '三个结构环环相扣：define...as 主干 + 非限定从句补充说明 + so...that 表结果。"nothing else seems to matter" 意译为"其他一切都显得无关紧要"。'
  },
  {
    id: 6,
    source: '2011年 翻译第5句',
    sentence: 'Whorf developed the idea that the structure of language determines the structure of habitual thought in a society.',
    hint: 'that 从句是同位语从句还是定语从句？看 that 在从句中是否作成分',
    segments: [
      { role: '主干', text: 'Whorf developed the idea', note: '主谓宾' },
      { role: '同位语从句', text: 'that the structure of language determines the structure of habitual thought in a society', note: 'that 不作成分，解释 idea 的内容 → 同位语从句' }
    ],
    translation: '沃尔夫提出了这样一个观点：语言的结构决定了一个社会中习惯性思维的结构。',
    analysis: '同位语从句判定法：that 在从句中不充当任何成分（从句本身主谓宾完整），则是同位语从句。翻译时用"……的观点："或"即"引出。'
  },
  {
    id: 7,
    source: '2014年 翻译第1句',
    sentence: 'It is also the reason why the 21st century will be dominated by the struggle for water, unless we begin to value it as we value the air we breathe.',
    hint: 'It is the reason why... + unless 条件从句 + as 比较从句三层嵌套',
    segments: [
      { role: '主干', text: 'It is also the reason', note: 'It 指代前文内容' },
      { role: '定语从句', text: 'why the 21st century will be dominated by the struggle for water', note: 'why 修饰 reason；被动语态' },
      { role: '条件状语从句', text: 'unless we begin to value it', note: 'unless = if...not' },
      { role: '比较状语从句', text: 'as we value the air we breathe', note: 'as 表"像……一样"；air 后又省略了 that 的定语从句' }
    ],
    translation: '这也是为什么21世纪将被对水的争夺所主宰的原因，除非我们开始像珍视呼吸的空气那样珍视水。',
    analysis: '三层从句依次处理：why 从句译成"为什么……的原因"，unless 提前的假设意味，as 比较从句中嵌套的省略定语从句（the air we breathe）。'
  },
  {
    id: 8,
    source: '2019年 翻译第3句',
    sentence: 'This alone demonstrates that the television business is not an easy world to survive in—a fact underlined by statistics that show that out of eighty European television networks, no less than 50% took a loss in 1989.',
    hint: 'that 宾语从句 + 破折号同位语 + 双重 that 嵌套',
    segments: [
      { role: '主干', text: 'This alone demonstrates', note: '这本身就证明了' },
      { role: '宾语从句', text: 'that the television business is not an easy world to survive in', note: '不定式 to survive in 作后置定语' },
      { role: '同位语', text: 'a fact underlined by statistics', note: '破折号引出同位语，补充说明前面整个事实；过去分词 underlined 作定语' },
      { role: '定语从句', text: 'that show that out of eighty European television networks, no less than 50% took a loss in 1989', note: '第一个 that 修饰 statistics，第二个 that 引导 show 的宾语从句' }
    ],
    translation: '这本身就表明，电视行业绝不是一个容易生存的世界——统计数据更印证了这一事实：1989年，欧洲80个电视网中有50%以上出现亏损。',
    analysis: '本句考点密集：宾语从句中不定式作定语、破折号同位语结构、statistics 后定语从句内再套宾语从句（双重that）。no less than 译"多达/不少于"。'
  }
]

const doneIds = ref<number[]>([])
const currentIdx = ref(0)
const showAnswer = ref(false)
const mySplit = ref('')

const current = computed(() => sentences[currentIdx.value])
const isDone = (id: number) => doneIds.value.includes(id)

const goto = (i: number) => {
  currentIdx.value = i
  showAnswer.value = false
  mySplit.value = ''
}

const markDone = () => {
  if (!doneIds.value.includes(current.value.id)) {
    doneIds.value.push(current.value.id)
  }
  showAnswer.value = true
}

const nextUnfinished = () => {
  const idx = sentences.findIndex((s, i) => i > currentIdx.value && !doneIds.value.includes(s.id))
  goto(idx > -1 ? idx : (currentIdx.value + 1) % sentences.length)
}
</script>

<template>
  <div class="lsp-wrap">
    <div class="lsp-intro">
      <strong>真题长难句拆解训练</strong>
      <p>流程：① 自己先在纸上/输入框里划分结构 → ② 展开对照标注 → ③ 掌握后标记完成。共 {{ sentences.length }} 句，全部取自英一翻译真题。</p>
    </div>

    <!-- 题目导航 -->
    <div class="lsp-nav">
      <button
        v-for="(s, i) in sentences"
        :key="s.id"
        class="lsp-nav-btn"
        :class="{ active: i === currentIdx, done: isDone(s.id) }"
        @click="goto(i)"
      >{{ i + 1 }}{{ isDone(s.id) ? '✓' : '' }}</button>
      <span class="lsp-progress">已完成 {{ doneIds.length }}/{{ sentences.length }}</span>
    </div>

    <!-- 当前题目 -->
    <section class="lsp-card">
      <div class="lsp-source">📌 {{ current.source }}</div>
      <p class="lsp-sentence">{{ current.sentence }}</p>
      <div class="lsp-hint">🔍 提示：{{ current.hint }}</div>

      <div class="lsp-mytry">
        <label>你的拆解（先试着自己标主干/从句）：</label>
        <textarea v-model="mySplit" placeholder="例如：主干是 Television is one of the means；by which 是定语从句……"></textarea>
      </div>

      <button v-if="!showAnswer" class="lsp-reveal" @click="markDone">▼ 我拆完了，展开结构标注与译文</button>

      <div v-if="showAnswer" class="lsp-answer">
        <div class="lsp-segments">
          <div v-for="(seg, i) in current.segments" :key="i" class="lsp-seg">
            <span class="seg-role">{{ seg.role }}</span>
            <div>
              <div class="seg-text">{{ seg.text }}</div>
              <div class="seg-note">{{ seg.note }}</div>
            </div>
          </div>
        </div>
        <div class="lsp-trans">
          <span class="lsp-label">参考译文</span>
          <p>{{ current.translation }}</p>
        </div>
        <div class="lsp-analysis">
          <span class="lsp-label gold">拆解要点</span>
          <p>{{ current.analysis }}</p>
        </div>
        <div class="lsp-actions">
          <button class="lsp-btn" @click="goto((currentIdx - 1 + sentences.length) % sentences.length)">← 上一句</button>
          <button class="lsp-btn primary" @click="nextUnfinished">下一句未完成 →</button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.lsp-wrap {
  --ink: #1f2d3d;
  --body: #303133;
  --gold: #ffc53d;
  --navy: #16345c;
  --navy-deep: #0d2137;
  --line: #e4ebf3;
  --bg-soft: #f5f8fc;
  max-width: 860px;
  margin: 0 auto;
}

.lsp-intro {
  background: linear-gradient(135deg, #fff8ec, #fffdf5);
  border: 1px solid rgba(255, 197, 61, 0.45);
  border-radius: 12px;
  padding: 14px 20px;
  margin-bottom: 16px;
}
.lsp-intro strong { display: block; color: var(--ink); font-size: 0.98rem; margin-bottom: 4px; }
.lsp-intro p { margin: 0; font-size: 0.82rem; color: #5b6b7f; line-height: 1.7; }

.lsp-nav {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.lsp-nav-btn {
  width: 38px;
  height: 38px;
  border-radius: 9px;
  border: 1px solid var(--line);
  background: #fff;
  color: var(--navy);
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}
.lsp-nav-btn:hover { border-color: var(--gold); transform: translateY(-2px); }
.lsp-nav-btn.active {
  background: linear-gradient(135deg, var(--navy-deep), var(--navy));
  color: var(--gold);
  border-color: var(--navy);
}
.lsp-nav-btn.done { border-color: #2fae62; color: #1e7a45; }
.lsp-progress {
  margin-left: auto;
  font-size: 0.78rem;
  color: #5b6b7f;
  font-family: 'JetBrains Mono', monospace;
}

.lsp-card {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 22px 26px;
}
.lsp-source {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--navy);
  background: var(--bg-soft);
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  margin-bottom: 12px;
}
.lsp-sentence {
  font-family: 'Georgia', serif;
  font-size: 1.1rem;
  line-height: 2;
  color: var(--ink);
  margin: 0 0 12px;
}
.lsp-hint {
  font-size: 0.8rem;
  color: #a06a00;
  background: #fff8ec;
  border-radius: 8px;
  padding: 8px 12px;
  margin-bottom: 14px;
}

.lsp-mytry label {
  display: block;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--navy);
  margin-bottom: 6px;
}
.lsp-mytry textarea {
  width: 100%;
  min-height: 70px;
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 0.88rem;
  line-height: 1.8;
  resize: vertical;
  outline: none;
  font-family: inherit;
}
.lsp-mytry textarea:focus { border-color: var(--gold); }

.lsp-reveal {
  margin-top: 12px;
  border: none;
  background: linear-gradient(135deg, var(--gold), #f0a820);
  color: var(--navy-deep);
  font-weight: 800;
  font-size: 0.88rem;
  padding: 10px 24px;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(255, 197, 61, 0.35);
  transition: all 0.2s;
}
.lsp-reveal:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(255, 197, 61, 0.45); }

.lsp-answer { margin-top: 16px; }
.lsp-segments { display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px; }
.lsp-seg {
  display: flex;
  gap: 12px;
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 10px 14px;
}
.seg-role {
  flex-shrink: 0;
  font-size: 0.68rem;
  font-weight: 800;
  color: #fff;
  background: var(--navy);
  padding: 3px 10px;
  border-radius: 999px;
  height: fit-content;
  white-space: nowrap;
}
.seg-text {
  font-family: 'Georgia', serif;
  font-size: 0.88rem;
  color: var(--ink);
  line-height: 1.7;
}
.seg-note { font-size: 0.76rem; color: #5b6b7f; margin-top: 3px; }

.lsp-label {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: var(--navy);
  background: var(--bg-soft);
  padding: 2px 10px;
  border-radius: 999px;
  margin-bottom: 6px;
}
.lsp-label.gold { color: #a06a00; background: #fff8ec; }
.lsp-trans p, .lsp-analysis p {
  margin: 0 0 12px;
  font-size: 0.9rem;
  line-height: 1.85;
  color: var(--body);
}
.lsp-analysis p { color: #4a3d1a; }

.lsp-actions { display: flex; gap: 10px; flex-wrap: wrap; }
.lsp-btn {
  border: 1px solid var(--line);
  background: #fff;
  color: var(--navy);
  font-size: 0.84rem;
  font-weight: 700;
  padding: 8px 18px;
  border-radius: 9px;
  cursor: pointer;
  transition: all 0.2s;
}
.lsp-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(13, 33, 55, 0.1); }
.lsp-btn.primary {
  background: linear-gradient(135deg, var(--navy-deep), var(--navy));
  color: var(--gold);
  border-color: var(--navy);
}
</style>

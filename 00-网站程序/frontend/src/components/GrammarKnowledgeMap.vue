<script setup lang="ts">
import { ref } from 'vue'

interface GrammarPoint {
  name: string
  key: string
  examples: string[]
}
interface GrammarBlock {
  id: string
  icon: string
  title: string
  desc: string
  points: GrammarPoint[]
}

const blocks: GrammarBlock[] = [
  {
    id: 'components',
    icon: '🧩',
    title: '句子成分',
    desc: '主谓宾定状补 + 表语与同位语，长难句拆分的起点',
    points: [
      {
        name: '主干三要素（主谓宾/主系表）',
        key: '找谓语动词 → 往前找主语 → 往后找宾语/表语，其余都是修饰',
        examples: [
          'The idea // that groups have identity // is rejected.（主干：The idea is rejected）',
          'Behavior // is determined // by environment.（主干：Behavior is determined）'
        ]
      },
      {
        name: '定语（修饰名词）',
        key: '单词定语前置，短语/从句定语后置——后置定语是英译汉调整语序的重灾区',
        examples: [
          'the book written by Lu Xun（过去分词短语后置定语 → 鲁迅写的书）',
          'a method of solving problems（介词短语后置定语）'
        ]
      },
      {
        name: '状语（修饰动词/句子）',
        key: '时间/地点/方式/原因/让步，注意位于句首的分词状语与独立主格',
        examples: [
          'Tracing the history of the term, we can see...（现在分词作状语，2026翻译真题句1）',
          'Time permitting, we will finish it today.（独立主格）'
        ]
      },
      {
        name: '同位语与插入语',
        key: '同位语解释说明前一名词；插入语用逗号/破折号隔开，阅读时可先跳过',
        examples: [
          'The news that he won the prize surprised us.（that从句是同位语从句，解释news）',
          'The report, as experts believe, will be delayed.（插入语）'
        ]
      }
    ]
  },
  {
    id: 'clauses',
    icon: '🔗',
    title: '三大从句',
    desc: '定语从句 · 名词性从句 · 状语从句，英一阅读与翻译的绝对核心',
    points: [
      {
        name: '定语从句',
        key: '判断先行词 + 关系词在从句中作什么成分；介词+which/whom 是高频考点',
        examples: [
          'the means by which these feelings are created（介词by提前，2005翻译真题）',
          'Those who ignore facts are likely to make mistakes.（who指人）'
        ]
      },
      {
        name: '名词性从句（主/宾/表/同位语）',
        key: 'that 无实义不作成分；what = the thing that；whether/if 区别；同位语从句解释抽象名词',
        examples: [
          'What matters most is not the result but the process.（主语从句）',
          'We can see how the definition has shifted.（how引导宾语从句，2026翻译真题）'
        ]
      },
      {
        name: '状语从句',
        key: '九大类：时间/原因/条件/让步/目的/结果/方式/比较/地点；让步从句（although）与比较从句是陷阱常客',
        examples: [
          'Although he failed many times, he never gave up.（让步）',
          'He served so much to connect peoples as never before.（比较，倒装变体见特殊句式）'
        ]
      }
    ]
  },
  {
    id: 'nonfinite',
    icon: '🪜',
    title: '非谓语动词',
    desc: '不定式 / 现在分词 / 过去分词——一个句子只能有一个谓语，多出来的动词必是非谓语',
    points: [
      {
        name: '不定式 to do',
        key: '常作目的状语（为了……）、后置定语、主语（It is ... to do）',
        examples: [
          'He works hard to support his family.（目的状语）',
          'It is necessary to master basic grammar.（形式主语）'
        ]
      },
      {
        name: '现在分词 -ing',
        key: '主动/进行意味；作状语时逻辑主语须与主句主语一致（否则为独立主格或悬垂错误）',
        examples: [
          'Seeing the teacher, the students stood up.（时间状语）',
          'The definition has shifted, muddying the waters...（结果状语，2026翻译真题）'
        ]
      },
      {
        name: '过去分词 -ed',
        key: '被动/完成意味；作定语后置、作状语表被动原因',
        examples: [
          'Given more time, we could do better.（条件状语，被动）',
          'a problem left unsolved（后置定语）'
        ]
      }
    ]
  },
  {
    id: 'special',
    icon: '🎭',
    title: '特殊句式',
    desc: '倒装 · 强调 · 省略 · 虚拟——命题人最爱的"看不懂"制造机',
    points: [
      {
        name: '倒装句',
        key: '否定词（never/seldom/not only）前置 → 部分倒装；only+状语前置 → 部分倒装；翻译前先还原语序',
        examples: [
          'Never before has it served so much to connect peoples.（2005翻译真题，还原：it has never before served...）',
          'Only in this way can we solve the problem.'
        ]
      },
      {
        name: '强调句',
        key: 'It is/was + 被强调部分 + that/who + 其余；去掉 It is...that 结构仍完整即为强调句',
        examples: [
          'It was persistence that led him to success.',
          'It is not the result but the process that matters.'
        ]
      },
      {
        name: '省略',
        key: '状语从句省略（主语与主句一致时省略主语+be）；并列结构省略重复成分',
        examples: [
          'When (he was) asked about the plan, he smiled.',
          'Some like tea; others (like) coffee.'
        ]
      },
      {
        name: '虚拟语气',
        key: '三大条件句时态规则 + wish/suggest/demand 等动词后的从句；写作加分句型储备',
        examples: [
          'Were it not for their help, we could hardly succeed.（省略if的倒装虚拟）',
          'It is high time that we took action.（that从句用过去式）'
        ]
      }
    ]
  },
  {
    id: 'tense',
    icon: '⏳',
    title: '时态与语态',
    desc: '英一以一般现在时/过去时/完成时为主，被动语态在学术文章中密集出现',
    points: [
      {
        name: '完成时家族',
        key: '现在完成时：过去对现在的影响；过去完成时：过去的过去（需有过去时间参照）',
        examples: [
          'The definition has shifted over time.（现在完成时，2026翻译真题）',
          'By 1990, the theory had been widely accepted.（过去完成时被动）'
        ]
      },
      {
        name: '被动语态',
        key: '学术文体高频；翻译时多用"被/受到/得以"或直接转主动',
        examples: [
          'These feelings are created and conveyed by television.（2005翻译真题被动）',
          'It is generally believed that...（形式主语+被动，译"人们普遍认为"）'
        ]
      },
      {
        name: '时态一致与呼应',
        key: '主句过去时，从句相应后退；客观真理永远用一般现在时',
        examples: [
          'He said that the earth moves around the sun.（真理不倒退）',
          'What he had done was later proved correct.（双时态呼应）'
        ]
      }
    ]
  }
]

const expanded = ref<string[]>(['components'])
const toggle = (id: string) => {
  const i = expanded.value.indexOf(id)
  i > -1 ? expanded.value.splice(i, 1) : expanded.value.push(id)
}
</script>

<template>
  <div class="gkm-wrap">
    <div class="gkm-intro">
      <strong>英一考纲语法点全覆盖</strong>
      <p>五大板块 · 点击卡片展开知识点与例句。例句大量取自/改编自翻译真题，学完直接去「真题实战」检验。</p>
    </div>

    <div class="gkm-list">
      <section
        v-for="b in blocks"
        :key="b.id"
        class="gkm-block"
        :class="{ open: expanded.includes(b.id) }"
      >
        <header class="gkm-head" @click="toggle(b.id)">
          <span class="gkm-icon">{{ b.icon }}</span>
          <div class="gkm-title">
            <strong>{{ b.title }}</strong>
            <em>{{ b.desc }}</em>
          </div>
          <span class="gkm-arrow">{{ expanded.includes(b.id) ? '▲' : '▼' }}</span>
        </header>

        <div v-show="expanded.includes(b.id)" class="gkm-body">
          <div v-for="p in b.points" :key="p.name" class="gkm-point">
            <div class="gp-name">{{ p.name }}</div>
            <div class="gp-key">💡 {{ p.key }}</div>
            <ul class="gp-examples">
              <li v-for="(e, i) in p.examples" :key="i">{{ e }}</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.gkm-wrap {
  --ink: #1f2d3d;
  --body: #303133;
  --gold: #ffc53d;
  --navy: #16345c;
  --line: #e4ebf3;
  --bg-soft: #f5f8fc;
}

.gkm-intro {
  background: linear-gradient(135deg, #fff8ec, #fffdf5);
  border: 1px solid rgba(255, 197, 61, 0.45);
  border-radius: 12px;
  padding: 14px 20px;
  margin-bottom: 18px;
}
.gkm-intro strong {
  display: block;
  color: var(--ink);
  font-size: 0.98rem;
  margin-bottom: 4px;
}
.gkm-intro p {
  margin: 0;
  font-size: 0.82rem;
  color: #5b6b7f;
  line-height: 1.7;
}

.gkm-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.gkm-block {
  border: 1px solid var(--line);
  border-radius: 14px;
  background: #fff;
  overflow: hidden;
  transition: box-shadow 0.25s;
}
.gkm-block.open {
  box-shadow: 0 6px 22px rgba(13, 33, 55, 0.08);
  border-color: rgba(255, 197, 61, 0.6);
}

.gkm-head {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  cursor: pointer;
  background: var(--bg-soft);
  transition: background 0.2s;
}
.gkm-head:hover { background: #eef3fa; }
.gkm-block.open .gkm-head { background: linear-gradient(150deg, #0d2137, #16345c); }

.gkm-icon { font-size: 1.6rem; flex-shrink: 0; }
.gkm-title { flex: 1; }
.gkm-title strong {
  display: block;
  font-size: 1.02rem;
  color: var(--ink);
  letter-spacing: 0.02em;
}
.gkm-title em {
  display: block;
  font-style: normal;
  font-size: 0.75rem;
  color: #5b6b7f;
  margin-top: 3px;
}
.gkm-block.open .gkm-title strong { color: var(--gold); }
.gkm-block.open .gkm-title em { color: #a8bdd4; }
.gkm-arrow {
  color: var(--navy);
  font-size: 0.8rem;
}
.gkm-block.open .gkm-arrow { color: var(--gold); }

.gkm-body {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.gkm-point {
  border: 1px solid var(--line);
  border-left: 4px solid var(--gold);
  border-radius: 10px;
  padding: 13px 16px;
  background: #fff;
}
.gp-name {
  font-weight: 700;
  color: var(--ink);
  font-size: 0.9rem;
  margin-bottom: 6px;
}
.gp-key {
  font-size: 0.8rem;
  color: #a06a00;
  background: #fff8ec;
  border-radius: 7px;
  padding: 6px 10px;
  margin-bottom: 8px;
  line-height: 1.6;
}
.gp-examples {
  margin: 0;
  padding-left: 18px;
}
.gp-examples li {
  font-family: 'Georgia', serif;
  font-size: 0.82rem;
  color: var(--body);
  line-height: 1.8;
  margin: 3px 0;
}
</style>

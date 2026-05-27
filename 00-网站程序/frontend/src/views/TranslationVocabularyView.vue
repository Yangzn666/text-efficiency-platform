<template>
  <div class="translation-vocabulary">
    <div class="page-header">
      <el-button type="primary" link @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        返回翻译主页
      </el-button>
      <h2>📖 核心词汇积累</h2>
      <p>翻译高频词 · 熟词僻义 · 同义替换</p>
    </div>

    <!-- 分类标签 -->
    <div class="category-tabs">
      <el-tabs v-model="activeCategory">
        <el-tab-pane label="全部词汇" name="all">
          <VocabularyList :vocabulary="filteredVocabulary" />
        </el-tab-pane>
        <el-tab-pane label="翻译高频词" name="common">
          <VocabularyList :vocabulary="filteredVocabulary" />
        </el-tab-pane>
        <el-tab-pane label="熟词僻义" name="rare">
          <VocabularyList :vocabulary="filteredVocabulary" />
        </el-tab-pane>
        <el-tab-pane label="同义替换" name="synonym">
          <VocabularyList :vocabulary="filteredVocabulary" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowLeft } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import VocabularyList from '@/components/VocabularyList.vue'

const router = useRouter()
const activeCategory = ref('all')

function goBack() {
  router.push({ path: '/english', query: { tab: 'translation' } })
}

interface VocabularyItem {
  word: string
  phonetic?: string
  meaning: string
  type?: 'common' | 'rare' | 'synonym'
  priority: 'high' | 'medium' | 'low'
  example?: string
  exampleCn?: string
  mastered?: boolean
}

// 核心词汇数据
const vocabularyData: VocabularyItem[] = [
  // === 翻译高频词 ===
  {
    word: 'phenomenon',
    phonetic: '/fəˈnɒmɪnən/',
    meaning: 'n. 现象',
    type: 'common',
    priority: 'high',
    example: 'This is a common phenomenon in modern society.',
    exampleCn: '这是现代社会中的常见现象。'
  },
  {
    word: 'inevitable',
    phonetic: '/ɪnˈevɪtəbl/',
    meaning: 'adj. 不可避免的',
    type: 'common',
    priority: 'high',
    example: 'Change is inevitable in today\'s world.',
    exampleCn: '在当今世界，变化是不可避免的。'
  },
  {
    word: 'significant',
    phonetic: '/sɪɡˈnɪfɪkənt/',
    meaning: 'adj. 重要的；显著的',
    type: 'common',
    priority: 'high',
    example: 'Technology has made significant progress.',
    exampleCn: '技术取得了显著进步。'
  },
  {
    word: 'contribute',
    phonetic: '/kənˈtrɪbjuːt/',
    meaning: 'v. 贡献；促成',
    type: 'common',
    priority: 'high',
    example: 'Education contributes to social development.',
    exampleCn: '教育促进了社会发展。'
  },
  {
    word: 'emphasize',
    phonetic: '/emfəsaɪz/',
    meaning: 'v. 强调；重视',
    type: 'common',
    priority: 'high',
    example: 'We should emphasize the importance of education.',
    exampleCn: '我们应该强调教育的重要性。'
  },
  {
    word: 'perspective',
    phonetic: '/pəˈspektɪv/',
    meaning: 'n. 观点；角度',
    type: 'common',
    priority: 'high',
    example: 'From a different perspective, this issue looks different.',
    exampleCn: '从不同的角度来看，这个问题看起来不同。'
  },
  {
    word: 'crucial',
    phonetic: '/ˈkruːʃl/',
    meaning: 'adj. 关键的；至关重要的',
    type: 'common',
    priority: 'high',
    example: 'Education plays a crucial role in national development.',
    exampleCn: '教育在国家发展中起着至关重要的作用。'
  },
  {
    word: 'demonstrate',
    phonetic: '/ˈdemənstreɪt/',
    meaning: 'v. 证明；演示',
    type: 'common',
    priority: 'medium',
    example: 'Studies demonstrate the benefits of exercise.',
    exampleCn: '研究证明了运动的好处。'
  },
  {
    word: 'fundamental',
    phonetic: '/fʌndəˈmentl/',
    meaning: 'adj. 基本的；根本的',
    type: 'common',
    priority: 'medium',
    example: 'Education is a fundamental right.',
    exampleCn: '教育是一项基本权利。'
  },
  {
    word: 'implement',
    phonetic: '/ˈɪmplɪment/',
    meaning: 'v. 实施；执行',
    type: 'common',
    priority: 'medium',
    example: 'The government plans to implement new policies.',
    exampleCn: '政府计划实施新政策。'
  },

  // === 熟词僻义 ===
  {
    word: 'sound',
    phonetic: '/sand/',
    meaning: 'adj. 健康的；合理的（非“声音”）',
    type: 'rare',
    priority: 'high',
    example: 'He is of sound mind and body.',
    exampleCn: '他身心健康。'
  },
  {
    word: 'address',
    phonetic: '/əˈdres/',
    meaning: 'v. 解决；处理（非“地址”）',
    type: 'rare',
    priority: 'high',
    example: 'We need to address this problem immediately.',
    exampleCn: '我们需要立即解决这个问题。'
  },
  {
    word: 'consume',
    phonetic: '/kənˈsjuːm/',
    meaning: 'v. 充满（思想）；毁灭（非“消耗”）',
    type: 'rare',
    priority: 'medium',
    example: 'He was consumed with guilt.',
    exampleCn: '他充满了内疚感。'
  },
  {
    word: 'weather',
    phonetic: '/ˈweðə(r)/',
    meaning: 'v. 经受住；度过难关（非“天气”）',
    type: 'rare',
    priority: 'medium',
    example: 'The company weathered the economic crisis.',
    exampleCn: '公司经受住了经济危机。'
  },
  {
    word: 'spring',
    phonetic: '/sprɪŋ/',
    meaning: 'v. 突然出现；涌现（非“春天”）',
    type: 'rare',
    priority: 'medium',
    example: 'New businesses are springing up everywhere.',
    exampleCn: '新企业如雨后春笋般涌现。'
  },
  {
    word: 'novel',
    phonetic: '/ˈnɒvl/',
    meaning: 'adj. 新颖的（非“小说”）',
    type: 'rare',
    priority: 'high',
    example: 'This is a novel approach to the problem.',
    exampleCn: '这是解决问题的新方法。'
  },
  {
    word: 'promising',
    phonetic: '/ˈprɒmɪsɪ/',
    meaning: 'adj. 有前途的；有希望的（非“承诺的”）',
    type: 'rare',
    priority: 'medium',
    example: 'She is a promising young scientist.',
    exampleCn: '她是一位有前途的年轻科学家。'
  },
  {
    word: 'deliberate',
    phonetic: '/dɪˈlɪbərət/',
    meaning: 'adj. 故意的；蓄意的（非“慎重的”）',
    type: 'rare',
    priority: 'medium',
    example: 'It was a deliberate attempt to mislead people.',
    exampleCn: '这是一次蓄意误导人们的企图。'
  },
  {
    word: 'obscure',
    phonetic: '/əbˈskjʊə(r)/',
    meaning: 'v. 使模糊；掩盖（非“模糊的”）',
    type: 'rare',
    priority: 'low',
    example: 'Smog obscures the view of the city.',
    exampleCn: '雾霾使城市景观变得模糊。'
  },
  {
    word: 'fine',
    phonetic: '/faɪn/',
    meaning: 'v. 罚款（非“好的”）',
    type: 'rare',
    priority: 'low',
    example: 'He was fined for speeding.',
    exampleCn: '他因超速被罚款。'
  },

  // === 同义替换 ===
  {
    word: 'important → crucial / vital / essential',
    meaning: '重要的 → 关键的/至关重要的/本质的',
    type: 'synonym',
    priority: 'high',
    example: 'Education is crucial/vital/essential for development.',
    exampleCn: '教育对发展至关重要。'
  },
  {
    word: 'show → demonstrate / illustrate / reveal',
    meaning: '显示 → 证明/说明/揭示',
    type: 'synonym',
    priority: 'high',
    example: 'Studies demonstrate/illustrate/reveal the trend.',
    exampleCn: '研究表明了这一趋势。'
  },
  {
    word: 'help → assist / facilitate / promote',
    meaning: '帮助 → 协助/促进/推动',
    type: 'synonym',
    priority: 'high',
    example: 'Technology helps/assists/facilitates our work.',
    exampleCn: '技术帮助/促进了我们的工作。'
  },
  {
    word: 'change → transform / alter / modify',
    meaning: '改变 → 转变/改变/修改',
    type: 'synonym',
    priority: 'high',
    example: 'Technology transforms/alters our lifestyle.',
    exampleCn: '技术改变了我们的生活方式。'
  },
  {
    word: 'get → obtain / acquire / gain',
    meaning: '获得 → 获得/获取/赢得',
    type: 'synonym',
    priority: 'medium',
    example: 'Students obtain/acquire/gain knowledge.',
    exampleCn: '学生获得知识。'
  },
  {
    word: 'think → believe / maintain / argue',
    meaning: '认为 → 相信/坚持认为/论证',
    type: 'synonym',
    priority: 'medium',
    example: 'Experts believe/maintain/argue that...',
    exampleCn: '专家认为...'
  },
  {
    word: 'use → utilize / employ / apply',
    meaning: '使用 → 利用/采用/应用',
    type: 'synonym',
    priority: 'medium',
    example: 'We utilize/employ/apply new technology.',
    exampleCn: '我们利用/采用/应用新技术。'
  },
  {
    word: 'big → significant / substantial / considerable',
    meaning: '大的 → 重要的/大量的/相当大的',
    type: 'synonym',
    priority: 'medium',
    example: 'There is a significant/substantial difference.',
    exampleCn: '存在显著/相当大的差异。'
  },
  {
    word: 'make → generate / produce / create',
    meaning: '制造 → 产生/生成/创造',
    type: 'synonym',
    priority: 'low',
    example: 'This policy generates/produces positive effects.',
    exampleCn: '这项政策产生了积极影响。'
  },
  {
    word: 'problem → issue / challenge / dilemma',
    meaning: '问题 → 议题/挑战/困境',
    type: 'synonym',
    priority: 'low',
    example: 'We face a serious issue/challenge/dilemma.',
    exampleCn: '我们面临一个严重的议题/挑战/困境。'
  },
  {
    word: 'many → numerous / various / multiple',
    meaning: '许多 → 大量的/各种的/多个的',
    type: 'synonym',
    priority: 'medium',
    example: 'There are numerous/various reasons.',
    exampleCn: '有许多/各种原因。'
  },
  {
    word: 'good → beneficial / favorable / positive',
    meaning: '好的 → 有益的/有利的/积极的',
    type: 'synonym',
    priority: 'medium',
    example: 'This has beneficial/favorable effects.',
    exampleCn: '这有有益/有利的影响。'
  },
  {
    word: 'bad → detrimental / adverse / negative',
    meaning: '坏的 → 有害的/不利的/消极的',
    type: 'synonym',
    priority: 'medium',
    example: 'This has detrimental/adverse impacts.',
    exampleCn: '这有有害/不利的影响。'
  },
  {
    word: 'develop → cultivate / foster / nurture',
    meaning: '发展 → 培养/ fostering /培育',
    type: 'synonym',
    priority: 'low',
    example: 'We should cultivate/foster talents.',
    exampleCn: '我们应该培养人才。'
  },
  {
    word: 'support → advocate / endorse / uphold',
    meaning: '支持 → 倡导/赞同/维护',
    type: 'synonym',
    priority: 'low',
    example: 'Many experts advocate/endorse this view.',
    exampleCn: '许多专家倡导/赞同这个观点。'
  },

  // === 更多翻译高频词 ===
  {
    word: 'widespread',
    phonetic: '/ˈwaɪdspred/',
    meaning: 'adj. 广泛的；普遍的',
    type: 'common',
    priority: 'high',
    example: 'There is widespread concern about this issue.',
    exampleCn: '人们对这个问题普遍关注。'
  },
  {
    word: 'remarkable',
    phonetic: '/rɪˈmɑːkəbl/',
    meaning: 'adj. 显著的；非凡的',
    type: 'common',
    priority: 'high',
    example: 'China has made remarkable achievements.',
    exampleCn: '中国取得了显著成就。'
  },
  {
    word: 'enhance',
    phonetic: '/ɪnˈhɑːns/',
    meaning: 'v. 提高；增强',
    type: 'common',
    priority: 'high',
    example: 'Education can enhance our abilities.',
    exampleCn: '教育可以提高我们的能力。'
  },
  {
    word: 'promote',
    phonetic: '/prəˈməʊt/',
    meaning: 'v. 促进；推动',
    type: 'common',
    priority: 'high',
    example: 'Technology promotes economic growth.',
    exampleCn: '技术促进了经济增长。'
  },
  {
    word: 'maintain',
    phonetic: '/meɪnˈteɪn/',
    meaning: 'v. 维持；坚持认为',
    type: 'common',
    priority: 'medium',
    example: 'Experts maintain that education is important.',
    exampleCn: '专家坚持认为教育很重要。'
  },

  // === 更多熟词僻义 ===
  {
    word: 'present',
    phonetic: '/prɪzent/',
    meaning: 'v. 呈现；提出（非“礼物”）',
    type: 'rare',
    priority: 'high',
    example: 'The data presents a clear picture.',
    exampleCn: '数据呈现出清晰的图景。'
  },
  {
    word: 'minute',
    phonetic: '/maɪˈnjuːt/',
    meaning: 'adj. 微小的；详细的（非“分钟”）',
    type: 'rare',
    priority: 'medium',
    example: 'Pay attention to minute details.',
    exampleCn: '注意微小的细节。'
  },
  {
    word: 'plant',
    phonetic: '/plɑːnt/',
    meaning: 'n. 工厂；设备（非“植物”）',
    type: 'rare',
    priority: 'medium',
    example: 'The company built a new manufacturing plant.',
    exampleCn: '公司建造了一个新的制造工厂。'
  },
  {
    word: 'fair',
    phonetic: '/feə(r)/',
    meaning: 'adj. 相当大的；相当好的（非“公平的”）',
    type: 'rare',
    priority: 'low',
    example: 'There is a fair chance of success.',
    exampleCn: '有相当大的成功机会。'
  },
  {
    word: 'coach',
    phonetic: '/kəʊtʃ/',
    meaning: 'v. 指导；辅导（非"教练"）',
    type: 'rare',
    priority: 'low',
    example: 'She coached students for the exam.',
    exampleCn: '她辅导学生准备考试。'
  },
  {
    word: 'count',
    phonetic: '/kaʊnt/',
    meaning: 'v. 有价值；重要（非"数数"）',
    type: 'rare',
    priority: 'medium',
    example: 'Every second counts.',
    exampleCn: '每一秒都很重要。'
  },
  {
    word: 'game',
    phonetic: '/ɡeɪm/',
    meaning: 'n. 猎物；野味（非"游戏"）',
    type: 'rare',
    priority: 'low',
    example: 'They hunted game in the forest.',
    exampleCn: '他们在森林里猎取野味。'
  },
  {
    word: 'house',
    phonetic: '/haʊz/',
    meaning: 'v. 收藏；容纳（非"房子"）',
    type: 'rare',
    priority: 'medium',
    example: 'The museum houses valuable artifacts.',
    exampleCn: '博物馆收藏着珍贵的文物。'
  },
  {
    word: 'blue',
    phonetic: '/bluː/',
    meaning: 'adj. 忧郁的；沮丧的（非"蓝色的"）',
    type: 'rare',
    priority: 'low',
    example: 'She felt blue after hearing the news.',
    exampleCn: '听到消息后她感到沮丧。'
  },

  // === 更多同义替换 ===
  {
    word: 'because → since / as / given that',
    meaning: '因为 → 由于/鉴于',
    type: 'synonym',
    priority: 'high',
    example: 'Since/As/Given that education is important...',
    exampleCn: '由于/鉴于教育很重要...'
  },
  {
    word: 'but → however / yet / nevertheless',
    meaning: '但是 → 然而/不过/尽管如此',
    type: 'synonym',
    priority: 'high',
    example: 'However/Yet/Nevertheless, challenges remain.',
    exampleCn: '然而/不过，挑战依然存在。'
  },
  {
    word: 'so → therefore / consequently / hence',
    meaning: '所以 → 因此/结果/因而',
    type: 'synonym',
    priority: 'high',
    example: 'Therefore/Consequently, we must act now.',
    exampleCn: '因此/所以，我们必须现在行动。'
  },
  {
    word: 'about → regarding / concerning / with respect to',
    meaning: '关于 → 关于/涉及/就...而言',
    type: 'synonym',
    priority: 'medium',
    example: 'Regarding/Concerning this issue...',
    exampleCn: '关于这个问题...'
  },
  {
    word: 'also → additionally / moreover / furthermore',
    meaning: '也 → 此外/而且/再者',
    type: 'synonym',
    priority: 'medium',
    example: 'Additionally/Moreover, we need more resources.',
    exampleCn: '此外/而且，我们需要更多资源。'
  },

  // === 更多翻译高频词 ===
  {
    word: 'inevitable',
    phonetic: '/ɪnˈevtəbl/',
    meaning: 'adj. 不可避免的',
    type: 'common',
    priority: 'high',
    example: 'Change is inevitable.',
    exampleCn: '变化是不可避免的。'
  },
  {
    word: 'controversy',
    phonetic: '/ˈkɒntrəvɜːsi/',
    meaning: 'n. 争议；争论',
    type: 'common',
    priority: 'high',
    example: 'This issue has sparked widespread controversy.',
    exampleCn: '这个问题引发了广泛争议。'
  },
  {
    word: 'perspective',
    phonetic: '/pəspektɪv/',
    meaning: 'n. 观点；视角',
    type: 'common',
    priority: 'high',
    example: 'From a different perspective...',
    exampleCn: '从不同的视角来看...'
  },
  {
    word: 'consequence',
    phonetic: '/ˈkɒnsɪkwəns/',
    meaning: 'n. 结果；后果',
    type: 'common',
    priority: 'high',
    example: 'We must consider the consequences.',
    exampleCn: '我们必须考虑后果。'
  },
  {
    word: 'opportunity',
    phonetic: '/ˌɒpəˈtjunəti/',
    meaning: 'n. 机会；时机',
    type: 'common',
    priority: 'high',
    example: 'Education provides opportunities for growth.',
    exampleCn: '教育提供了成长的机会。'
  },
  {
    word: 'approach',
    phonetic: '/əprəʊtʃ/',
    meaning: 'n. 方法；途径',
    type: 'common',
    priority: 'high',
    example: 'We need a new approach to this problem.',
    exampleCn: '我们需要解决这个问题的新方法。'
  },
  {
    word: 'available',
    phonetic: '/əveɪləbl/',
    meaning: 'adj. 可获得的；可用的',
    type: 'common',
    priority: 'high',
    example: 'Resources are limited and not always available.',
    exampleCn: '资源有限，并不总是可用的。'
  },
  {
    word: 'circumstance',
    phonetic: '/sɜːkəmstəns/',
    meaning: 'n. 情况；环境',
    type: 'common',
    priority: 'medium',
    example: 'Under no circumstances should we give up.',
    exampleCn: '在任何情况下我们都不应该放弃。'
  },
  {
    word: 'establish',
    phonetic: '/ɪstæblɪ/',
    meaning: 'v. 建立；确立',
    type: 'common',
    priority: 'medium',
    example: 'We need to establish clear goals.',
    exampleCn: '我们需要确立明确的目标。'
  },
  {
    word: 'wage',
    phonetic: '/weɪdʒ/',
    meaning: 'v. 开展；进行（非"工资"）',
    type: 'rare',
    priority: 'high',
    example: 'The government waged a campaign against poverty.',
    exampleCn: '政府开展了反贫困运动。'
  },
  {
    word: 'subject',
    phonetic: '/sʌbdʒkt/',
    meaning: 'adj. 易受...影响的（非"主题"）',
    type: 'rare',
    priority: 'medium',
    example: 'The area is subject to earthquakes.',
    exampleCn: '该地区易受地震影响。'
  },
  {
    word: 'table',
    phonetic: '/teɪbl/',
    meaning: 'v. 提出；提交（非"桌子"）',
    type: 'rare',
    priority: 'medium',
    example: 'They tabled a motion for discussion.',
    exampleCn: '他们提出了一项动议供讨论。'
  },
  {
    word: 'lean',
    phonetic: '/liːn/',
    meaning: 'adj. 瘦的；贫乏的（非"倾斜"）',
    type: 'rare',
    priority: 'low',
    example: 'The company went through lean years.',
    exampleCn: '公司经历了贫乏的年份。'
  },
  {
    word: 'important → critical / pivotal / indispensable',
    meaning: '重要的 → 关键的/核心的/不可或缺的',
    type: 'synonym',
    priority: 'high',
    example: 'Education is critical/pivotal/indispensable.',
    exampleCn: '教育是关键/核心/不可或缺的。'
  },
  {
    word: 'improve → enhance / upgrade / refine',
    meaning: '改善 → 提高/升级/完善',
    type: 'synonym',
    priority: 'high',
    example: 'We need to improve/enhance/refine our skills.',
    exampleCn: '我们需要改善/提高/完善我们的技能。'
  },
  {
    word: 'decrease → decline / diminish / reduce',
    meaning: '减少 → 下降/减少/降低',
    type: 'synonym',
    priority: 'medium',
    example: 'Sales decreased/declined/diminished last year.',
    exampleCn: '去年销售额下降/减少了。'
  },
  {
    word: 'increase → surge / soar / escalate',
    meaning: '增加 → 激增/飙升/加剧',
    type: 'synonym',
    priority: 'medium',
    example: 'Prices increased/surged/soared dramatically.',
    exampleCn: '价格急剧增加/激增/飙升。'
  },
  {
    word: 'difficult → challenging / demanding / tough',
    meaning: '困难的 → 具有挑战性的/要求高的/艰难的',
    type: 'synonym',
    priority: 'low',
    example: 'This is a difficult/challenging/demanding task.',
    exampleCn: '这是一项困难的/具有挑战性的任务。'
  },
  {
    word: 'domestic',
    phonetic: '/dəˈmestk/',
    meaning: 'adj. 国内的；家庭的',
    type: 'common',
    priority: 'high',
    example: 'Domestic demand continues to grow.',
    exampleCn: '国内需求持续增长。'
  },
  {
    word: 'phenomenon',
    phonetic: '/fɪˈnɒmɪnən/',
    meaning: 'n. 现象',
    type: 'common',
    priority: 'high',
    example: 'This is a common phenomenon.',
    exampleCn: '这是一个常见现象。'
  },
  {
    word: 'sufficient',
    phonetic: '/səˈfɪʃnt/',
    meaning: 'adj. 足够的；充分的',
    type: 'common',
    priority: 'high',
    example: 'We have sufficient evidence.',
    exampleCn: '我们有充分的证据。'
  },
  {
    word: 'tendency',
    phonetic: '/ˈtendənsi/',
    meaning: 'n. 趋势；倾向',
    type: 'common',
    priority: 'medium',
    example: 'There is a growing tendency toward...',
    exampleCn: '有一种日益增长的趋势...'
  },
  {
    word: 'spring',
    phonetic: '/sprɪŋ/',
    meaning: 'v. 突然出现；涌现（非"春天"）',
    type: 'rare',
    priority: 'high',
    example: 'New businesses are springing up.',
    exampleCn: '新企业如雨后春笋般涌现。'
  },
  {
    word: 'consume',
    phonetic: '/kənˈsjuːm/',
    meaning: 'v. 充满（思想）；毁灭（非"消耗"）',
    type: 'rare',
    priority: 'medium',
    example: 'He was consumed with guilt.',
    exampleCn: '他充满了内疚感。'
  },
  {
    word: 'weather',
    phonetic: '/weðə(r)/',
    meaning: 'v. 经受住；度过难关（非"天气"）',
    type: 'rare',
    priority: 'medium',
    example: 'The company weathered the crisis.',
    exampleCn: '公司经受住了危机。'
  },
  {
    word: 'obscure',
    phonetic: '/əbˈskjʊə(r)/',
    meaning: 'v. 使模糊；掩盖（非"模糊的"）',
    type: 'rare',
    priority: 'low',
    example: 'Smog obscures the view.',
    exampleCn: '雾霾使视野模糊。'
  },
  {
    word: 'therefore → thus / hence / accordingly',
    meaning: '因此 → 所以/因而/相应地',
    type: 'synonym',
    priority: 'high',
    example: 'Therefore/Thus/Hence, we should act now.',
    exampleCn: '因此/所以/因而，我们应该现在行动。'
  },
  {
    word: 'although → though / even though / despite',
    meaning: '虽然 → 尽管/即使',
    type: 'synonym',
    priority: 'high',
    example: 'Although/Though/Despite the difficulties...',
    exampleCn: '虽然/尽管有困难...'
  },
  {
    word: 'quickly → rapidly / swiftly / promptly',
    meaning: '快速地 → 迅速地/敏捷地/及时地',
    type: 'synonym',
    priority: 'medium',
    example: 'Technology develops quickly/rapidly.',
    exampleCn: '技术发展迅速。'
  },
  {
    word: 'finally → eventually / ultimately / in the end',
    meaning: '最后 → 最终/终究',
    type: 'synonym',
    priority: 'medium',
    example: 'Finally/Eventually/Ultimately, success came.',
    exampleCn: '最后/最终，成功到来了。'
  },
  {
    word: 'actually → in fact / indeed / as a matter of fact',
    meaning: '实际上 → 事实上/的确',
    type: 'synonym',
    priority: 'low',
    example: 'Actually/In fact/Indeed, it is true.',
    exampleCn: '实际上/事实上，这是真的。'
  }
]

// 根据分类过滤词汇
const filteredVocabulary = computed(() => {
  if (activeCategory.value === 'all') {
    return vocabularyData
  }
  return vocabularyData.filter(v => v.type === activeCategory.value)
})
</script>

<style scoped>
.translation-vocabulary {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 30px 20px;
  background: linear-gradient(135deg, #f5576c 0%, #ff6b9d 100%);
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(245, 87, 108, 0.3);
}

.page-header h2 {
  font-size: 2.2em;
  font-weight: 700;
  color: #ffffff;
  margin: 15px 0 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  letter-spacing: 1px;
}

.page-header p {
  font-size: 1.1em;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 500;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.content-section {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}
</style>

<template>
  <div class="translation-phrases">
    <div class="page-header">
      <el-button type="primary" link @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        返回翻译主页
      </el-button>
      <h2>📚 翻译词组积累</h2>
      <p>高频搭配 · 固定用法 · 主题词汇</p>
    </div>

    <!-- 优先级筛选 -->
    <div class="filter-section">
      <el-radio-group v-model="currentPriority" size="large">
        <el-radio-button label="all">全部</el-radio-button>
        <el-radio-button label="high">⭐ 高频必背</el-radio-button>
        <el-radio-button label="medium">⭐⭐ 重要掌握</el-radio-button>
        <el-radio-button label="low">⭐⭐⭐ 了解即可</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 分类标签 -->
    <div class="category-tabs">
      <el-tabs v-model="activeCategory">
        <el-tab-pane label="全部词组" name="all">
          <PhraseList :phrases="filteredPhrases" />
        </el-tab-pane>
        <el-tab-pane label="文化教育" name="culture">
          <PhraseList :phrases="filteredPhrases" />
        </el-tab-pane>
        <el-tab-pane label="科技经济" name="tech">
          <PhraseList :phrases="filteredPhrases" />
        </el-tab-pane>
        <el-tab-pane label="社会生活" name="society">
          <PhraseList :phrases="filteredPhrases" />
        </el-tab-pane>
        <el-tab-pane label="环境健康" name="environment">
          <PhraseList :phrases="filteredPhrases" />
        </el-tab-pane>
        <el-tab-pane label="连接过渡" name="transition">
          <PhraseList :phrases="filteredPhrases" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowLeft } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import PhraseList from '@/components/PhraseList.vue'

const router = useRouter()
const currentPriority = ref('all')
const activeCategory = ref('all')

function goBack() {
  router.push({ path: '/english', query: { tab: 'translation' } })
}

interface PhraseItem {
  en: string
  cn: string
  category: string
  priority: 'high' | 'medium' | 'low'
  example: string
  mastered?: boolean
}

// 翻译词组数据库
const phrasesData: PhraseItem[] = [
  // ===== 文化教育类 =====
  {
    en: 'date back to / trace back to',
    cn: '追溯到',
    category: 'culture',
    priority: 'high',
    example: 'Chinese tea culture dates back thousands of years.'
  },
  {
    en: 'cultural heritage',
    cn: '文化遗产',
    category: 'culture',
    priority: 'high',
    example: 'We should protect our cultural heritage.'
  },
  {
    en: 'attach great importance to',
    cn: '高度重视',
    category: 'culture',
    priority: 'high',
    example: 'The government attaches great importance to education.'
  },
  {
    en: 'play a vital/crucial role in',
    cn: '在...中起关键作用',
    category: 'culture',
    priority: 'high',
    example: 'Education plays a vital role in national development.'
  },
  {
    en: 'serve as a bridge/link',
    cn: '充当桥梁/纽带',
    category: 'culture',
    priority: 'high',
    example: 'Cultural exchange serves as a bridge between nations.'
  },
  {
    en: 'pass down from generation to generation',
    cn: '代代相传',
    category: 'culture',
    priority: 'medium',
    example: 'Traditional customs are passed down from generation to generation.'
  },
  {
    en: 'have a profound influence on',
    cn: '对...有深远影响',
    category: 'culture',
    priority: 'high',
    example: 'Confucianism has a profound influence on Chinese culture.'
  },
  {
    en: 'promote cultural diversity',
    cn: '促进文化多样性',
    category: 'culture',
    priority: 'medium',
    example: 'We should promote cultural diversity in the world.'
  },
  {
    en: 'preserve traditional values',
    cn: '保护传统价值观',
    category: 'culture',
    priority: 'medium',
    example: 'It is important to preserve traditional values.'
  },
  {
    en: 'foster mutual understanding',
    cn: '促进相互理解',
    category: 'culture',
    priority: 'medium',
    example: 'Cultural exchange fosters mutual understanding.'
  },

  // ===== 科技经济类 =====
  {
    en: 'with the rapid development of',
    cn: '随着...的快速发展',
    category: 'tech',
    priority: 'high',
    example: 'With the rapid development of technology, life has changed greatly.'
  },
  {
    en: 'artificial intelligence (AI)',
    cn: '人工智能',
    category: 'tech',
    priority: 'high',
    example: 'Artificial intelligence is transforming various industries.'
  },
  {
    en: 'digital economy',
    cn: '数字经济',
    category: 'tech',
    priority: 'high',
    example: 'The digital economy is growing rapidly.'
  },
  {
    en: 'technological innovation',
    cn: '技术创新',
    category: 'tech',
    priority: 'high',
    example: 'Technological innovation drives economic growth.'
  },
  {
    en: 'bring about tremendous changes',
    cn: '带来巨大变化',
    category: 'tech',
    priority: 'high',
    example: 'The Internet has brought about tremendous changes.'
  },
  {
    en: 'pose challenges and opportunities',
    cn: '带来挑战和机遇',
    category: 'tech',
    priority: 'medium',
    example: 'New technology poses both challenges and opportunities.'
  },
  {
    en: 'boost economic growth',
    cn: '促进经济增长',
    category: 'tech',
    priority: 'high',
    example: 'Innovation can boost economic growth.'
  },
  {
    en: 'enhance productivity',
    cn: '提高生产力',
    category: 'tech',
    priority: 'medium',
    example: 'Automation helps enhance productivity.'
  },
  {
    en: 'bridge the digital divide',
    cn: '缩小数字鸿沟',
    category: 'tech',
    priority: 'medium',
    example: 'We need to bridge the digital divide.'
  },
  {
    en: 'sustainable development',
    cn: '可持续发展',
    category: 'tech',
    priority: 'high',
    example: 'Sustainable development is crucial for the future.'
  },

  // ===== 社会生活类 =====
  {
    en: 'improve living standards',
    cn: '提高生活水平',
    category: 'society',
    priority: 'high',
    example: 'Economic growth helps improve living standards.'
  },
  {
    en: 'social welfare',
    cn: '社会福利',
    category: 'society',
    priority: 'medium',
    example: 'The government invests in social welfare.'
  },
  {
    en: 'urbanization process',
    cn: '城市化进程',
    category: 'society',
    priority: 'medium',
    example: 'The urbanization process is accelerating.'
  },
  {
    en: 'address social issues',
    cn: '解决社会问题',
    category: 'society',
    priority: 'high',
    example: 'We must address social issues effectively.'
  },
  {
    en: 'promote social harmony',
    cn: '促进社会和谐',
    category: 'society',
    priority: 'medium',
    example: 'Education can promote social harmony.'
  },
  {
    en: ' narrowing the gap between',
    cn: '缩小...之间的差距',
    category: 'society',
    priority: 'high',
    example: 'Policies aim at narrowing the gap between rich and poor.'
  },
  {
    en: 'ensure equal access to',
    cn: '确保平等获得',
    category: 'society',
    priority: 'medium',
    example: 'Everyone should have equal access to education.'
  },
  {
    en: 'raise public awareness of',
    cn: '提高公众对...的意识',
    category: 'society',
    priority: 'high',
    example: 'We need to raise public awareness of environmental protection.'
  },
  {
    en: 'contribute to social stability',
    cn: '有助于社会稳定',
    category: 'society',
    priority: 'medium',
    example: 'Employment contributes to social stability.'
  },
  {
    en: 'meet people\'s growing demands',
    cn: '满足人们日益增长的需求',
    category: 'society',
    priority: 'medium',
    example: 'Services should meet people\'s growing demands.'
  },

  // ===== 环境健康类 =====
  {
    en: 'environmental protection',
    cn: '环境保护',
    category: 'environment',
    priority: 'high',
    example: 'Environmental protection is everyone\'s responsibility.'
  },
  {
    en: 'climate change',
    cn: '气候变化',
    category: 'environment',
    priority: 'high',
    example: 'Climate change poses a serious threat.'
  },
  {
    en: 'reduce carbon emissions',
    cn: '减少碳排放',
    category: 'environment',
    priority: 'high',
    example: 'We must reduce carbon emissions.'
  },
  {
    en: 'renewable energy',
    cn: '可再生能源',
    category: 'environment',
    priority: 'medium',
    example: 'Renewable energy is the future.'
  },
  {
    en: 'ecological balance',
    cn: '生态平衡',
    category: 'environment',
    priority: 'medium',
    example: 'We should maintain ecological balance.'
  },
  {
    en: 'combat pollution',
    cn: '治理污染',
    category: 'environment',
    priority: 'high',
    example: 'Cities are taking measures to combat pollution.'
  },
  {
    en: 'preserve natural resources',
    cn: '保护自然资源',
    category: 'environment',
    priority: 'medium',
    example: 'We must preserve natural resources for future generations.'
  },
  {
    en: 'promote green lifestyle',
    cn: '倡导绿色生活方式',
    category: 'environment',
    priority: 'medium',
    example: 'Schools promote green lifestyle among students.'
  },
  {
    en: 'biodiversity conservation',
    cn: '生物多样性保护',
    category: 'environment',
    priority: 'low',
    example: 'Biodiversity conservation is essential.'
  },
  {
    en: 'achieve carbon neutrality',
    cn: '实现碳中和',
    category: 'environment',
    priority: 'medium',
    example: 'Many countries aim to achieve carbon neutrality.'
  },

  // ===== 连接过渡类 =====
  {
    en: 'not only... but also...',
    cn: '不仅...而且...',
    category: 'transition',
    priority: 'high',
    example: 'Tea is not only a beverage, but also a cultural symbol.'
  },
  {
    en: 'on the one hand... on the other hand...',
    cn: '一方面...另一方面...',
    category: 'transition',
    priority: 'high',
    example: 'On the one hand, technology brings convenience; on the other hand, it creates problems.'
  },
  {
    en: 'in addition / furthermore / moreover',
    cn: '此外/而且',
    category: 'transition',
    priority: 'high',
    example: 'Furthermore, we need to consider environmental factors.'
  },
  {
    en: 'however / nevertheless',
    cn: '然而/不过',
    category: 'transition',
    priority: 'high',
    example: 'However, this approach has some limitations.'
  },
  {
    en: 'therefore / thus / hence',
    cn: '因此/所以',
    category: 'transition',
    priority: 'high',
    example: 'Therefore, we should take immediate action.'
  },
  {
    en: 'for instance / for example',
    cn: '例如',
    category: 'transition',
    priority: 'high',
    example: 'For instance, many cities have implemented recycling programs.'
  },
  {
    en: 'in contrast / by comparison',
    cn: '相比之下',
    category: 'transition',
    priority: 'medium',
    example: 'In contrast, rural areas face different challenges.'
  },
  {
    en: 'as a result / consequently',
    cn: '结果/因此',
    category: 'transition',
    priority: 'high',
    example: 'As a result, the quality of life has improved.'
  },
  {
    en: 'in terms of / with regard to',
    cn: '就...而言/关于',
    category: 'transition',
    priority: 'medium',
    example: 'In terms of education, China has made great progress.'
  },
  {
    en: 'despite / in spite of',
    cn: '尽管/虽然',
    category: 'transition',
    priority: 'high',
    example: 'Despite the challenges, we remain optimistic.'
  },

  // ===== 更多文化教育类 =====
  {
    en: 'lay emphasis on / place emphasis on',
    cn: '强调；重视',
    category: 'culture',
    priority: 'high',
    example: 'We should lay emphasis on practical skills.'
  },
  {
    en: 'take ... into account / consideration',
    cn: '把...考虑在内',
    category: 'culture',
    priority: 'high',
    example: 'We must take all factors into account.'
  },
  {
    en: 'give rise to / lead to / result in',
    cn: '导致；引起',
    category: 'culture',
    priority: 'high',
    example: 'Poor education gives rise to social problems.'
  },
  {
    en: 'be confronted with / be faced with',
    cn: '面临；面对',
    category: 'culture',
    priority: 'high',
    example: 'We are confronted with many challenges.'
  },
  {
    en: 'make contributions to',
    cn: '对...做出贡献',
    category: 'culture',
    priority: 'high',
    example: 'Scientists make contributions to society.'
  },

  // ===== 更多科技经济类 =====
  {
    en: 'keep pace with',
    cn: '跟上...的步伐',
    category: 'tech',
    priority: 'high',
    example: 'We must keep pace with technological development.'
  },
  {
    en: 'give priority to',
    cn: '优先考虑',
    category: 'tech',
    priority: 'high',
    example: 'The government gives priority to education.'
  },
  {
    en: 'be associated with / be related to',
    cn: '与...相关',
    category: 'tech',
    priority: 'high',
    example: 'Health is closely associated with lifestyle.'
  },
  {
    en: 'have access to',
    cn: '有机会使用/获得',
    category: 'tech',
    priority: 'high',
    example: 'Everyone should have access to education.'
  },
  {
    en: 'be responsible for',
    cn: '对...负责',
    category: 'tech',
    priority: 'medium',
    example: 'Everyone is responsible for environmental protection.'
  },

  // ===== 更多社会生活类 =====
  {
    en: 'play an important role in',
    cn: '在...中起重要作用',
    category: 'society',
    priority: 'high',
    example: 'Education plays an important role in society.'
  },
  {
    en: 'make efforts to / strive to',
    cn: '努力做...',
    category: 'society',
    priority: 'high',
    example: 'We should make efforts to improve education.'
  },
  {
    en: 'devote oneself to',
    cn: '致力于；献身于',
    category: 'society',
    priority: 'medium',
    example: 'He devoted himself to education.'
  },
  {
    en: 'benefit from',
    cn: '从...中受益',
    category: 'society',
    priority: 'high',
    example: 'Students benefit from good education.'
  },
  {
    en: 'be aware of / be conscious of',
    cn: '意识到；认识到',
    category: 'society',
    priority: 'high',
    example: 'People should be aware of environmental issues.'
  },

  // ===== 更多环境健康类 =====
  {
    en: 'pose a threat to',
    cn: '对...构成威胁',
    category: 'environment',
    priority: 'high',
    example: 'Pollution poses a threat to our health.'
  },
  {
    en: 'take measures to / take steps to',
    cn: '采取措施做...',
    category: 'environment',
    priority: 'high',
    example: 'We must take measures to protect the environment.'
  },
  {
    en: 'raise awareness of',
    cn: '提高...的意识',
    category: 'environment',
    priority: 'high',
    example: 'We should raise awareness of climate change.'
  },
  {
    en: 'contribute to / make contributions to',
    cn: '有助于；为...做贡献',
    category: 'environment',
    priority: 'high',
    example: 'Everyone can contribute to environmental protection.'
  },
  {
    en: 'be committed to',
    cn: '致力于；承诺',
    category: 'environment',
    priority: 'medium',
    example: 'The company is committed to sustainable development.'
  },

  // ===== 更多连接过渡类 =====
  {
    en: 'on the one hand ... on the other hand',
    cn: '一方面...另一方面',
    category: 'transition',
    priority: 'high',
    example: 'On the one hand, technology helps us. On the other hand, it creates problems.'
  },
  {
    en: 'not only ... but also',
    cn: '不仅...而且',
    category: 'transition',
    priority: 'high',
    example: 'Education not only improves skills but also broadens horizons.'
  },
  {
    en: 'as far as ... is concerned',
    cn: '就...而言',
    category: 'transition',
    priority: 'high',
    example: 'As far as education is concerned, quality matters most.'
  },
  {
    en: 'in terms of / with regard to',
    cn: '在...方面；关于',
    category: 'transition',
    priority: 'high',
    example: 'In terms of economic growth, China has achieved great success.'
  },
  {
    en: 'from my perspective / point of view',
    cn: '从我的角度来看',
    category: 'transition',
    priority: 'medium',
    example: 'From my perspective, education is the key to success.'
  },

  // ===== 补充文化教育类 =====
  {
    en: 'attach importance to',
    cn: '重视；看重',
    category: 'culture',
    priority: 'high',
    example: 'We should attach importance to moral education.'
  },
  {
    en: 'cultivate the ability to',
    cn: '培养...的能力',
    category: 'culture',
    priority: 'high',
    example: 'Education should cultivate the ability to think critically.'
  },
  {
    en: 'broaden one\'s horizons',
    cn: '开阔视野',
    category: 'culture',
    priority: 'high',
    example: 'Traveling can broaden our horizons.'
  },
  {
    en: 'keep up with the times',
    cn: '与时俱进',
    category: 'culture',
    priority: 'medium',
    example: 'We must keep up with the times.'
  },
  {
    en: 'inherit and carry forward',
    cn: '继承和发扬',
    category: 'culture',
    priority: 'medium',
    example: 'We should inherit and carry forward traditional culture.'
  },

  // ===== 补充科技经济类 =====
  {
    en: 'boost economic growth',
    cn: '促进经济增长',
    category: 'tech',
    priority: 'high',
    example: 'Innovation can boost economic growth.'
  },
  {
    en: 'bridge the gap between',
    cn: '缩小...之间的差距',
    category: 'tech',
    priority: 'high',
    example: 'Technology helps bridge the gap between rich and poor.'
  },
  {
    en: 'stimulate innovation',
    cn: '激发创新',
    category: 'tech',
    priority: 'high',
    example: 'Competition can stimulate innovation.'
  },
  {
    en: 'optimize resource allocation',
    cn: '优化资源配置',
    category: 'tech',
    priority: 'medium',
    example: 'Market mechanisms optimize resource allocation.'
  },
  {
    en: 'enhance competitiveness',
    cn: '提高竞争力',
    category: 'tech',
    priority: 'medium',
    example: 'Quality education enhances competitiveness.'
  },

  // ===== 补充社会生活类 =====
  {
    en: 'alleviate poverty',
    cn: '减轻贫困',
    category: 'society',
    priority: 'high',
    example: 'Education can help alleviate poverty.'
  },
  {
    en: 'promote social harmony',
    cn: '促进社会和谐',
    category: 'society',
    priority: 'high',
    example: 'Mutual understanding promotes social harmony.'
  },
  {
    en: 'ensure equal opportunities',
    cn: '确保平等机会',
    category: 'society',
    priority: 'high',
    example: 'We should ensure equal educational opportunities.'
  },
  {
    en: 'address social issues',
    cn: '解决社会问题',
    category: 'society',
    priority: 'medium',
    example: 'Government policies should address social issues.'
  },
  {
    en: 'foster a sense of responsibility',
    cn: '培养责任感',
    category: 'society',
    priority: 'medium',
    example: 'Education should foster a sense of social responsibility.'
  }
]

// 根据当前选择过滤词组
const filteredPhrases = computed(() => {
  let result = phrasesData
  
  // 按优先级过滤
  if (currentPriority.value !== 'all') {
    result = result.filter(p => p.priority === currentPriority.value)
  }
  
  // 按分类过滤
  if (activeCategory.value !== 'all') {
    result = result.filter(p => p.category === activeCategory.value)
  }
  
  return result
})
</script>

<style scoped>
.translation-phrases {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 30px 20px;
  background: linear-gradient(135deg, #16345c 0%, #1e4576 100%);
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(13, 33, 55, 0.3);
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

.filter-section {
  background: white;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.category-tabs {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}
</style>

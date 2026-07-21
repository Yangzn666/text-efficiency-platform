<template>
  <div class="translation-patterns">
    <div class="page-header">
      <el-button type="primary" link @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        返回翻译主页
      </el-button>
      <h2>🔗 万能句型积累</h2>
      <p>开头句型 · 过渡句型 · 结尾句型</p>
    </div>

    <!-- 分类标签 -->
    <div class="category-tabs">
      <el-tabs v-model="activeCategory">
        <el-tab-pane label="全部句型" name="all">
          <PatternList :patterns="filteredPatterns" />
        </el-tab-pane>
        <el-tab-pane label="开头句型" name="opening">
          <PatternList :patterns="filteredPatterns" />
        </el-tab-pane>
        <el-tab-pane label="过渡句型" name="transition">
          <PatternList :patterns="filteredPatterns" />
        </el-tab-pane>
        <el-tab-pane label="结尾句型" name="ending">
          <PatternList :patterns="filteredPatterns" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowLeft } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import PatternList from '@/components/PatternList.vue'

const router = useRouter()
const activeCategory = ref('all')

function goBack() {
  router.push({ path: '/english', query: { tab: 'translation' } })
}

interface PatternItem {
  en: string
  cn: string
  type: 'opening' | 'transition' | 'ending'
  priority: 'high' | 'medium' | 'low'
  example?: string
  mastered?: boolean
}

// 万能句型数据库
const patternsData: PatternItem[] = [
  // ===== 开头句型 =====
  {
    en: 'It is widely believed that ...',
    cn: '人们普遍认为...',
    type: 'opening',
    priority: 'high',
    example: 'It is widely believed that education plays a vital role in society.'
  },
  {
    en: 'There is no doubt that ...',
    cn: '毫无疑问...',
    type: 'opening',
    priority: 'high',
    example: 'There is no doubt that technology has transformed our lives.'
  },
  {
    en: 'In recent years, ... has/have become increasingly important.',
    cn: '近年来，...变得越来越重要。',
    type: 'opening',
    priority: 'high',
    example: 'In recent years, environmental protection has become increasingly important.'
  },
  {
    en: 'With the rapid development of ..., ...',
    cn: '随着...的快速发展，...',
    type: 'opening',
    priority: 'high',
    example: 'With the rapid development of technology, our lifestyle has changed dramatically.'
  },
  {
    en: 'Nowadays, there is a growing concern about ...',
    cn: '如今，人们对...越来越关注。',
    type: 'opening',
    priority: 'high',
    example: 'Nowadays, there is a growing concern about climate change.'
  },
  {
    en: 'The issue of ... has aroused wide public concern.',
    cn: '...的问题引起了广泛的公众关注。',
    type: 'opening',
    priority: 'high',
    example: 'The issue of food safety has aroused wide public concern.'
  },
  {
    en: 'When it comes to ..., people\'s opinions vary.',
    cn: '当谈到...时，人们的观点各不相同。',
    type: 'opening',
    priority: 'medium',
    example: 'When it comes to online education, people\'s opinions vary.'
  },
  {
    en: 'According to a recent survey, ...',
    cn: '根据最近的一项调查，...',
    type: 'opening',
    priority: 'medium',
    example: 'According to a recent survey, most students prefer online learning.'
  },
  {
    en: 'It is universally acknowledged that ...',
    cn: '众所周知...',
    type: 'opening',
    priority: 'medium',
    example: 'It is universally acknowledged that health is wealth.'
  },
  {
    en: 'In today\'s society, ... has/have become a hot topic.',
    cn: '在当今社会，...已成为热门话题。',
    type: 'opening',
    priority: 'medium',
    example: 'In today\'s society, artificial intelligence has become a hot topic.'
  },

  // ===== 过渡句型 =====
  {
    en: 'On the one hand, ... On the other hand, ...',
    cn: '一方面...另一方面...',
    type: 'transition',
    priority: 'high',
    example: 'On the one hand, technology brings convenience. On the other hand, it creates new problems.'
  },
  {
    en: 'However, we should not ignore the fact that ...',
    cn: '然而，我们不应忽视这样一个事实：...',
    type: 'transition',
    priority: 'high',
    example: 'However, we should not ignore the fact that education requires long-term investment.'
  },
  {
    en: 'In addition / Moreover / Furthermore, ...',
    cn: '此外/而且/再者，...',
    type: 'transition',
    priority: 'high',
    example: 'Moreover, education can broaden our horizons.'
  },
  {
    en: 'Therefore / Thus / Consequently, ...',
    cn: '因此/所以/结果，...',
    type: 'transition',
    priority: 'high',
    example: 'Therefore, we must take immediate action.'
  },
  {
    en: 'Despite / In spite of ..., ...',
    cn: '尽管...，但是...',
    type: 'transition',
    priority: 'high',
    example: 'Despite the challenges, we remain optimistic.'
  },
  {
    en: 'From my perspective / point of view, ...',
    cn: '从我的角度来看，...',
    type: 'transition',
    priority: 'medium',
    example: 'From my perspective, quality education is more important than quantity.'
  },
  {
    en: 'It is worth noting that ...',
    cn: '值得注意的是...',
    type: 'transition',
    priority: 'medium',
    example: 'It is worth noting that not all technologies are beneficial.'
  },
  {
    en: 'What\'s more, ...',
    cn: '更重要的是，...',
    type: 'transition',
    priority: 'medium',
    example: 'What\'s more, we need to consider the long-term effects.'
  },
  {
    en: 'In contrast / By comparison, ...',
    cn: '相比之下，...',
    type: 'transition',
    priority: 'medium',
    example: 'In contrast, traditional methods are more reliable.'
  },
  {
    en: 'As far as ... is concerned, ...',
    cn: '就...而言，...',
    type: 'transition',
    priority: 'medium',
    example: 'As far as education is concerned, practice matters most.'
  },

  // ===== 结尾句型 =====
  {
    en: 'In conclusion / To sum up / In summary, ...',
    cn: '总之/综上所述，...',
    type: 'ending',
    priority: 'high',
    example: 'In conclusion, education is the foundation of success.'
  },
  {
    en: 'All in all, ...',
    cn: '总而言之，...',
    type: 'ending',
    priority: 'high',
    example: 'All in all, we should take action immediately.'
  },
  {
    en: 'From what has been discussed above, we can conclude that ...',
    cn: '综上所述，我们可以得出结论：...',
    type: 'ending',
    priority: 'high',
    example: 'From what has been discussed above, we can conclude that technology benefits society.'
  },
  {
    en: 'Taking all these factors into consideration, ...',
    cn: '综合考虑所有这些因素，...',
    type: 'ending',
    priority: 'high',
    example: 'Taking all these factors into consideration, we should prioritize education.'
  },
  {
    en: 'It is high time that we took effective measures to ...',
    cn: '是我们采取有效措施...的时候了。',
    type: 'ending',
    priority: 'high',
    example: 'It is high time that we took effective measures to protect the environment.'
  },
  {
    en: 'Only in this way can we ...',
    cn: '只有这样我们才能...',
    type: 'ending',
    priority: 'high',
    example: 'Only in this way can we achieve sustainable development.'
  },
  {
    en: 'Therefore, it is essential/necessary/crucial to ...',
    cn: '因此，...是至关重要的。',
    type: 'ending',
    priority: 'high',
    example: 'Therefore, it is essential to improve our education system.'
  },
  {
    en: 'We should spare no effort to ...',
    cn: '我们应该不遗余力地...',
    type: 'ending',
    priority: 'medium',
    example: 'We should spare no effort to promote cultural exchange.'
  },
  {
    en: 'It is hoped that ...',
    cn: '希望...',
    type: 'ending',
    priority: 'medium',
    example: 'It is hoped that more people will pay attention to this issue.'
  },
  {
    en: 'Looking forward, ...',
    cn: '展望未来，...',
    type: 'ending',
    priority: 'medium',
    example: 'Looking forward, we believe the future is bright.'
  },

  // ===== 更多开头句型 =====
  {
    en: 'Recently, the problem/issue of ... has been brought to public attention.',
    cn: '最近，...的问题引起了公众的关注。',
    type: 'opening',
    priority: 'medium',
    example: 'Recently, the issue of online privacy has been brought to public attention.'
  },
  {
    en: 'Nowadays, more and more people are beginning to realize that ...',
    cn: '如今，越来越多的人开始意识到...',
    type: 'opening',
    priority: 'medium',
    example: 'Nowadays, more and more people are beginning to realize the importance of health.'
  },
  {
    en: 'The question of whether ... has aroused a heated debate.',
    cn: '关于是否...的问题已经引发了激烈的辩论。',
    type: 'opening',
    priority: 'medium',
    example: 'The question of whether AI will replace humans has aroused a heated debate.'
  },
  {
    en: 'Some people believe/argue that ..., while others hold a different view.',
    cn: '有些人认为...，而另一些人则持不同观点。',
    type: 'opening',
    priority: 'medium',
    example: 'Some people believe that online education is better, while others hold a different view.'
  },
  {
    en: 'With the advent/improvement/popularity of ..., ...',
    cn: '随着...的出现/改进/普及，...',
    type: 'opening',
    priority: 'low',
    example: 'With the popularity of smartphones, our communication has become easier.'
  },

  // ===== 更多过渡句型 =====
  {
    en: 'For one thing, ... For another, ...',
    cn: '一方面...另一方面...',
    type: 'transition',
    priority: 'medium',
    example: 'For one thing, it saves time. For another, it reduces costs.'
  },
  {
    en: 'Similarly / Likewise, ...',
    cn: '同样地，...',
    type: 'transition',
    priority: 'medium',
    example: 'Similarly, other countries have faced the same problem.'
  },
  {
    en: 'On the contrary, ...',
    cn: '相反，...',
    type: 'transition',
    priority: 'medium',
    example: 'On the contrary, evidence suggests otherwise.'
  },
  {
    en: 'In other words, ...',
    cn: '换句话说，...',
    type: 'transition',
    priority: 'medium',
    example: 'In other words, we need to change our approach.'
  },
  {
    en: 'As a result / As a consequence, ...',
    cn: '结果，...',
    type: 'transition',
    priority: 'medium',
    example: 'As a result, many people lost their jobs.'
  },
  {
    en: 'Meanwhile / At the same time, ...',
    cn: '同时，...',
    type: 'transition',
    priority: 'low',
    example: 'Meanwhile, technology continues to advance rapidly.'
  },
  {
    en: 'To be specific / Specifically, ...',
    cn: '具体来说，...',
    type: 'transition',
    priority: 'low',
    example: 'Specifically, we need to focus on three areas.'
  },
  {
    en: 'For instance / For example, ...',
    cn: '例如，...',
    type: 'transition',
    priority: 'high',
    example: 'For instance, many companies have adopted remote work.'
  },
  {
    en: 'In particular / Particularly, ...',
    cn: '特别是，...',
    type: 'transition',
    priority: 'medium',
    example: 'In particular, young people are affected by this trend.'
  },

  // ===== 更多结尾句型 =====
  {
    en: 'Based on the above analysis, ...',
    cn: '基于以上分析，...',
    type: 'ending',
    priority: 'high',
    example: 'Based on the above analysis, we can see the importance of education.'
  },
  {
    en: 'To conclude, ...',
    cn: '最后，...',
    type: 'ending',
    priority: 'high',
    example: 'To conclude, cooperation is essential for success.'
  },
  {
    en: 'Given these reasons, ...',
    cn: '鉴于这些原因，...',
    type: 'ending',
    priority: 'medium',
    example: 'Given these reasons, we should take immediate action.'
  },
  {
    en: 'In brief / In short, ...',
    cn: '简而言之，...',
    type: 'ending',
    priority: 'medium',
    example: 'In short, education changes lives.'
  },
  {
    en: 'It is clear/evident/obvious that ...',
    cn: '显然/明显的是...',
    type: 'ending',
    priority: 'medium',
    example: 'It is clear that we need to address this issue urgently.'
  },
  {
    en: 'There is no denying that ...',
    cn: '不可否认的是...',
    type: 'ending',
    priority: 'medium',
    example: 'There is no denying that technology has improved our lives.'
  },
  {
    en: 'We may safely draw the conclusion that ...',
    cn: '我们可以稳妥地得出结论：...',
    type: 'ending',
    priority: 'low',
    example: 'We may safely draw the conclusion that practice makes perfect.'
  },
  {
    en: 'Last but not least, ...',
    cn: '最后但同样重要的是，...',
    type: 'ending',
    priority: 'low',
    example: 'Last but not least, we should never give up hope.'
  }
]

// 根据分类过滤句型
const filteredPatterns = computed(() => {
  if (activeCategory.value === 'all') {
    return patternsData
  }
  return patternsData.filter(p => p.type === activeCategory.value)
})
</script>

<style scoped>
.translation-patterns {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 30px 20px;
  background: linear-gradient(135deg, #16345c 0%, #1e4576 100%);
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(13, 33, 55, 0.25);
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

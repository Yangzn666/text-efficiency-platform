<script setup lang="ts">
import { ref, computed } from 'vue'

const activeCategory = ref('all')

// 励志格言分类
const quoteCategories = [
  { id: 'all', name: '全部', icon: '🌟' },
  { id: 'persistence', name: '坚持到底', icon: '💪' },
  { id: 'discipline', name: '自律自强', icon: '🎯' },
  { id: 'courage', name: '勇气信心', icon: '🔥' },
  { id: 'wisdom', name: '智慧方法', icon: '💡' }
]

// 励志格言数据
const quotes = {
  persistence: [
    {
      content: "步子乱作一团，继续跳就好了",
      author: "佚名",
      tags: ["坚持", "勇气"]
    },
    {
      content: "世界上有太多孤独的人害怕踏出第一步",
      author: "电影《绿皮书》",
      tags: ["勇气", "行动"]
    },
    {
      content: "鸡蛋从外打破是食物，从内打破才是生命",
      author: "李嘉诚",
      tags: ["成长", "突破"]
    },
    {
      content: "不要害怕人生的结束，他不是句号，而是括号，后面还可以加一个乘号",
      author: "佚名",
      tags: ["希望", "未来"]
    }
  ],
  discipline: [
    {
      content: "你的情绪理应由你自己支配",
      author: "佚名",
      tags: ["自律", "情绪管理"]
    },
    {
      content: "清醒时做事，迷茫时读书，独处时思考，烦躁时运动；焦虑时行动，得意时淡然，失意时坦然，忙碌时专注，闲暇时蓄力。",
      author: "佚名",
      tags: ["自律", "生活智慧"]
    },
    {
      content: "没有什么比进步更性感的词了",
      author: "佚名",
      tags: ["进步", "动力"]
    }
  ],
  courage: [
    {
      content: "信任 倾听 理解",
      author: "佚名",
      tags: ["人际", "沟通"]
    },
    {
      content: "你眼中的自己不是自己\n别人眼中的自己也不是自己\n你眼中的别人才是自己",
      author: "佚名",
      tags: ["自我认知", "哲理"]
    },
    {
      content: "随机性带来的是反脆弱",
      author: "纳西姆·塔勒布《反脆弱》",
      tags: ["哲学", "成长"]
    },
    {
      content: "安得倚天剑，跨海斩长鲸",
      author: "李白《临江王节士歌》",
      tags: ["勇气", "豪情"]
    }
  ],
  wisdom: [
    {
      content: "游戏的四大特征：目标，规则，反馈，自愿参与。它有一个能力让你一直呆在能力的边缘，让你感觉你一直在进步。",
      author: "简·麦戈尼格尔《游戏改变世界》",
      tags: ["游戏化", "学习方法"]
    },
    {
      content: "'Just do it' 还有下一句 'let it go'。努力和期待总是相辅相成的。",
      author: "佚名",
      tags: ["努力", "心态"]
    },
    {
      content: "冠军们认为，他们的优势不在于拥有更多的东西，而是已有的能够被更充分地发挥。Champion endurance athletes insist on their advantages lies not in having more to give, but rather in being able to give more of what they have.",
      author: "佚名",
      tags: ["潜能", "发挥"]
    }
  ]
}

// 每日一句（随机）
const dailyQuote = computed(() => {
  const allQuotes = Object.values(quotes).flat()
  const randomIndex = Math.floor(Math.random() * allQuotes.length)
  return allQuotes[randomIndex]
})

// 获取当前分类的格言
const currentQuotes = computed(() => {
  if (activeCategory.value === 'all') {
    // 返回所有格言
    return Object.values(quotes).flat()
  }
  return quotes[activeCategory.value as keyof typeof quotes] || []
})

// 获取分类的格言数量
const getCategoryCount = (categoryId: string) => {
  if (categoryId === 'all') {
    return Object.values(quotes).flat().length
  }
  return quotes[categoryId as keyof typeof quotes]?.length || 0
}

// 当前分类信息
const currentCategory = computed(() => {
  return quoteCategories.find(c => c.id === activeCategory.value)
})
</script>

<template>
  <div class="energy-page">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
    </div>

    <!-- 英雄区域 -->
    <div class="hero-section">
      <div class="hero-badge">
        <span class="badge-icon"></span>
        <span class="badge-text">ENERGY STATION</span>
      </div>
      <h1 class="hero-title">学习能量站</h1>
      <p class="hero-subtitle">每一句格言，都是前进的动力</p>
      
      <!-- 每日金句卡片 -->
      <div class="daily-quote-card">
        <div class="card-shimmer"></div>
        <div class="quote-mark-left">"</div>
        <div class="daily-content">
          <p class="daily-text">{{ dailyQuote.content }}</p>
          <div class="daily-meta">
            <span class="daily-author">—— {{ dailyQuote.author }}</span>
            <div class="daily-tags">
              <span v-for="tag in dailyQuote.tags" :key="tag" class="tag-pill">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
        <div class="quote-mark-right">"</div>
        <div class="sparkle-effects">
          <span class="sparkle">✨</span>
          <span class="sparkle sparkle-2">⭐</span>
          <span class="sparkle sparkle-3"></span>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="content-wrapper">
      <!-- 分类导航 -->
      <div class="category-navigation">
        <button 
          v-for="cat in quoteCategories" 
          :key="cat.id"
          :class="['category-btn', { active: activeCategory === cat.id }]"
          @click="activeCategory = cat.id"
        >
          <span class="cat-icon">{{ cat.icon }}</span>
          <span class="cat-name">{{ cat.name }}</span>
          <span class="cat-count">{{ getCategoryCount(cat.id) }}条</span>
          <div class="btn-glow"></div>
        </button>
      </div>

      <!-- 格言展示区 -->
      <div class="quotes-display">
        <div class="display-header">
          <h2 class="display-title">
            <span class="title-icon">{{ currentCategory?.icon }}</span>
            <span class="title-text">{{ currentCategory?.name }}</span>
          </h2>
          <div class="title-divider"></div>
        </div>

        <div class="quotes-container">
          <div 
            v-for="(quote, index) in currentQuotes" 
            :key="index"
            class="quote-card-modern"
            :style="{ '--delay': `${index * 0.08}s` }"
          >
            <div class="card-accent"></div>
            <div class="card-number">{{ String(index + 1).padStart(2, '0') }}</div>
            
            <div class="card-body">
              <p class="card-quote">{{ quote.content }}</p>
              
              <div class="card-footer">
                <span class="card-author">{{ quote.author }}</span>
                <div class="card-tags">
                  <span v-for="tag in quote.tags" :key="tag" class="mini-tag">
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="hover-effect"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.energy-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  position: relative;
  overflow: hidden;
  padding-bottom: 80px;
}

/* 背景装饰球 */
.bg-decoration {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
  animation: orbFloat 20s ease-in-out infinite;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  top: -100px;
  right: -100px;
  animation-delay: 0s;
}

.orb-2 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  bottom: 20%;
  left: -50px;
  animation-delay: -7s;
}

.orb-3 {
  width: 350px;
  height: 350px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  bottom: -100px;
  right: 10%;
  animation-delay: -14s;
}

@keyframes orbFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}

/* 英雄区域 */
.hero-section {
  position: relative;
  z-index: 1;
  padding: 60px 20px 50px;
  text-align: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  background: rgba(102, 126, 234, 0.15);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 50px;
  margin-bottom: 24px;
  backdrop-filter: blur(10px);
  animation: badgePulse 3s ease-in-out infinite;
}

.badge-icon {
  font-size: 1.2em;
}

.badge-text {
  color: #667eea;
  font-size: 0.9em;
  font-weight: 600;
  letter-spacing: 2px;
}

@keyframes badgePulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.4); }
  50% { box-shadow: 0 0 0 10px rgba(102, 126, 234, 0); }
}

.hero-title {
  font-size: 3.5em;
  font-weight: 800;
  background: linear-gradient(135deg, #ffffff 0%, #e0e7ff 50%, #667eea 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
  text-shadow: 0 0 40px rgba(102, 126, 234, 0.3);
  letter-spacing: 2px;
}

.hero-subtitle {
  font-size: 1.3em;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 40px;
  font-weight: 400;
}

/* 每日金句卡片 */
.daily-quote-card {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 40px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.daily-quote-card:hover {
  transform: translateY(-5px);
  border-color: rgba(102, 126, 234, 0.3);
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.2);
}

.card-shimmer {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  animation: shimmer 8s infinite;
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

.quote-mark-left,
.quote-mark-right {
  position: absolute;
  font-size: 6em;
  color: rgba(102, 126, 234, 0.15);
  font-family: Georgia, serif;
  line-height: 1;
}

.quote-mark-left {
  top: 10px;
  left: 20px;
}

.quote-mark-right {
  bottom: -20px;
  right: 20px;
}

.daily-content {
  position: relative;
  z-index: 1;
}

.daily-text {
  font-size: 1.5em;
  color: #ffffff;
  line-height: 1.8;
  margin-bottom: 24px;
  font-weight: 500;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.daily-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.daily-author {
  color: rgba(255, 255, 255, 0.6);
  font-size: 1em;
  font-style: italic;
}

.daily-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tag-pill {
  padding: 6px 16px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%);
  border: 1px solid rgba(102, 126, 234, 0.4);
  color: #e0e7ff;
  border-radius: 20px;
  font-size: 0.85em;
  font-weight: 500;
  backdrop-filter: blur(10px);
}

.sparkle-effects {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.sparkle {
  position: absolute;
  font-size: 1.5em;
  animation: sparkleFloat 4s ease-in-out infinite;
}

.sparkle-2 {
  top: 20%;
  right: 10%;
  animation-delay: -1s;
}

.sparkle-3 {
  bottom: 15%;
  left: 8%;
  animation-delay: -2s;
}

@keyframes sparkleFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
  50% { transform: translateY(-10px) rotate(180deg); opacity: 1; }
}

/* 主内容区 */
.content-wrapper {
  position: relative;
  z-index: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 分类导航 */
.category-navigation {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 50px;
  flex-wrap: wrap;
}

.category-btn {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.category-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(102, 126, 234, 0.4);
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
}

.category-btn.active {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%);
  border-color: rgba(102, 126, 234, 0.6);
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
}

.btn-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.4) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.5s ease;
}

.category-btn.active .btn-glow {
  width: 200px;
  height: 200px;
}

.cat-icon {
  font-size: 1.5em;
  position: relative;
  z-index: 1;
}

.cat-name {
  color: #ffffff;
  font-size: 1em;
  font-weight: 600;
  position: relative;
  z-index: 1;
}

.cat-count {
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8em;
  position: relative;
  z-index: 1;
}

/* 格言展示区 */
.quotes-display {
  margin-top: 40px;
}

.display-header {
  margin-bottom: 40px;
  text-align: center;
}

.display-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 2.5em;
  color: #ffffff;
  font-weight: 700;
  margin-bottom: 16px;
}

.title-icon {
  font-size: 1.2em;
}

.title-divider {
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, transparent, #667eea, transparent);
  margin: 0 auto;
  border-radius: 2px;
}

/* 格言容器 */
.quotes-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 24px;
}

.quote-card-modern {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: cardFadeIn 0.6s ease-out both;
  animation-delay: var(--delay);
}

@keyframes cardFadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.quote-card-modern:hover {
  transform: translateY(-8px);
  border-color: rgba(102, 126, 234, 0.4);
  box-shadow: 0 20px 50px rgba(102, 126, 234, 0.25);
}

.card-accent {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #667eea 100%);
  background-size: 200% 100%;
  animation: accentSlide 3s linear infinite;
}

@keyframes accentSlide {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}

.card-number {
  position: absolute;
  top: 20px;
  right: 24px;
  font-size: 2.5em;
  font-weight: 800;
  color: rgba(102, 126, 234, 0.1);
  line-height: 1;
}

.card-body {
  padding: 32px 28px 28px;
  position: relative;
  z-index: 1;
}

.card-quote {
  font-size: 1.15em;
  color: #e0e7ff;
  line-height: 1.8;
  margin-bottom: 24px;
  font-weight: 400;
  white-space: pre-line;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  flex-wrap: wrap;
  gap: 12px;
}

.card-author {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.95em;
  font-style: italic;
}

.card-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.mini-tag {
  padding: 4px 12px;
  background: rgba(102, 126, 234, 0.15);
  border: 1px solid rgba(102, 126, 234, 0.3);
  color: #a5b4fc;
  border-radius: 12px;
  font-size: 0.8em;
  font-weight: 500;
  transition: all 0.3s ease;
}

.quote-card-modern:hover .mini-tag {
  background: rgba(102, 126, 234, 0.25);
  border-color: rgba(102, 126, 234, 0.5);
}

.hover-effect {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(102, 126, 234, 0.15) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.quote-card-modern:hover .hover-effect {
  opacity: 1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5em;
  }
  
  .hero-subtitle {
    font-size: 1.1em;
  }
  
  .daily-quote-card {
    padding: 28px 24px;
  }
  
  .daily-text {
    font-size: 1.2em;
  }
  
  .quotes-container {
    grid-template-columns: 1fr;
  }
  
  .display-title {
    font-size: 2em;
  }
  
  .category-btn {
    padding: 12px 20px;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 40px 16px 30px;
  }
  
  .hero-title {
    font-size: 2em;
  }
  
  .category-navigation {
    gap: 12px;
  }
  
  .category-btn {
    padding: 10px 16px;
    flex: 1;
    min-width: calc(50% - 6px);
  }
  
  .cat-name {
    font-size: 0.9em;
  }
}
</style>

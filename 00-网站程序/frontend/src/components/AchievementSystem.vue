<template>
  <div class="achievement-system">
    <!-- 成就概览 -->
    <div class="achievements-overview">
      <div class="overview-cards">
        <div class="overview-card">
          <div class="card-icon">🏆</div>
          <div class="card-info">
            <div class="card-number">{{ psychologyStore.unlockedAchievements.length }}</div>
            <div class="card-label">已解锁成就</div>
          </div>
        </div>
        
        <div class="overview-card">
          <div class="card-icon">⭐</div>
          <div class="card-info">
            <div class="card-number">{{ totalAchievementPoints }}</div>
            <div class="card-label">成就积分</div>
          </div>
        </div>
        
        <div class="overview-card">
          <div class="card-icon">🎯</div>
          <div class="card-info">
            <div class="card-number">{{ achievementCategories.size }}</div>
            <div class="card-label">成就类别</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 成就分类展示 -->
    <div class="achievements-by-category">
      <div 
        v-for="[category, achievementsInCategory] in Array.from(achievementsByCategory)" 
        :key="category"
        class="category-section"
      >
        <h3 class="category-title">{{ category }}</h3>
        <div class="achievements-grid">
          <div 
            v-for="achievement in achievementsInCategory" 
            :key="achievement.id"
            class="achievement-card"
            :class="{ 'unlocked': isUnlocked(achievement) }"
          >
            <div class="achievement-icon">
              {{ isUnlocked(achievement) ? '🏆' : '🔒' }}
            </div>
            
            <div class="achievement-info">
              <h4>{{ achievement.title }}</h4>
              <p>{{ achievement.description }}</p>
              
              <div class="achievement-meta">
                <div class="points-display">
                  <span class="points-value">{{ achievement.points }}</span>
                  <span class="points-label">积分</span>
                </div>
                
                <div v-if="isUnlocked(achievement)" class="unlock-date">
                  解锁于 {{ formatDate(achievement.unlockedAt) }}
                </div>
              </div>
            </div>
            
            <div class="achievement-status">
              <el-tag 
                :type="isUnlocked(achievement) ? 'success' : 'info'"
                effect="dark"
              >
                {{ isUnlocked(achievement) ? '已解锁' : '未解锁' }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 进度成就 -->
    <div class="progress-achievements">
      <h3>📈 进度成就</h3>
      <div class="progress-grid">
        <div class="progress-item">
          <div class="progress-header">
            <span class="progress-title">认知重构练习</span>
            <span class="progress-count">{{ psychologyStore.cognitiveRecords.length }}/10</span>
          </div>
          <el-progress 
            :percentage="(psychologyStore.cognitiveRecords.length / 10) * 100" 
            :stroke-width="12"
            :show-text="false"
          />
        </div>
        
        <div class="progress-item">
          <div class="progress-header">
            <span class="progress-title">行为激活活动</span>
            <span class="progress-count">{{ completedActivitiesCount }}/20</span>
          </div>
          <el-progress 
            :percentage="(completedActivitiesCount / 20) * 100" 
            :stroke-width="12"
            :show-text="false"
            status="success"
          />
        </div>
        
        <div class="progress-item">
          <div class="progress-header">
            <span class="progress-title">累计积分</span>
            <span class="progress-count">{{ psychologyStore.totalPoints }}/1000</span>
          </div>
          <el-progress 
            :percentage="(psychologyStore.totalPoints / 1000) * 100" 
            :stroke-width="12"
            :show-text="false"
            status="warning"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePsychologyStore } from '@/stores/psychology'
import type { Achievement } from '@/stores/psychology'

const psychologyStore = usePsychologyStore()

// 计算属性
const achievementsByCategory = computed(() => {
  const grouped = new Map<string, Achievement[]>()
  
  psychologyStore.achievements.forEach(achievement => {
    if (!grouped.has(achievement.category)) {
      grouped.set(achievement.category, [])
    }
    grouped.get(achievement.category)?.push(achievement)
  })
  
  return grouped
})

const achievementCategories = computed(() => {
  return new Set(psychologyStore.achievements.map(a => a.category))
})

const totalAchievementPoints = computed(() => {
  return psychologyStore.unlockedAchievements.reduce((sum, achievement) => 
    sum + achievement.points, 0
  )
})

const completedActivitiesCount = computed(() => {
  // 这里需要从行为激活组件获取数据
  const activities = localStorage.getItem('behaviorActivities')
  if (activities) {
    try {
      const parsed = JSON.parse(activities)
      return parsed.filter((a: any) => a.completed).length
    } catch {
      return 0
    }
  }
  return 0
})

// 方法
const isUnlocked = (achievement: Achievement) => {
  return psychologyStore.unlockedAchievements.some(a => a.id === achievement.id)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.achievement-system {
  padding: 20px 0;
}

.achievements-overview {
  margin-bottom: 40px;
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.overview-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 25px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.card-icon {
  font-size: 2.5em;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  color: white;
}

.card-info {
  flex: 1;
}

.card-number {
  font-size: 2em;
  font-weight: 800;
  color: #333;
  margin-bottom: 5px;
}

.card-label {
  color: #666;
  font-size: 1em;
}

.category-section {
  margin-bottom: 40px;
}

.category-title {
  color: #333;
  margin: 0 0 25px 0;
  font-size: 1.6em;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.achievement-card {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 25px;
  background: #fafafa;
  border-radius: 15px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.achievement-card:hover {
  background: #f0f8ff;
  transform: translateX(5px);
}

.achievement-card.unlocked {
  background: #f5fff5;
  border-color: #4CAF50;
}

.achievement-icon {
  font-size: 2em;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.achievement-info {
  flex: 1;
}

.achievement-info h4 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.2em;
}

.achievement-info p {
  margin: 0 0 15px 0;
  color: #666;
  line-height: 1.5;
}

.achievement-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.points-display {
  text-align: center;
}

.points-value {
  display: block;
  font-size: 1.5em;
  font-weight: 800;
  color: #FF9800;
}

.points-label {
  font-size: 0.8em;
  color: #666;
}

.unlock-date {
  color: #4CAF50;
  font-size: 0.9em;
  font-weight: 500;
}

.achievement-status {
  align-self: flex-start;
}

.progress-achievements {
  background: #f8f9ff;
  border-radius: 15px;
  padding: 25px;
  border: 1px solid #e0e7ff;
}

.progress-achievements h3 {
  color: #333;
  margin: 0 0 25px 0;
  font-size: 1.5em;
}

.progress-grid {
  display: grid;
  gap: 25px;
}

.progress-item {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.progress-title {
  font-weight: 600;
  color: #333;
  font-size: 1.1em;
}

.progress-count {
  color: #667eea;
  font-weight: 700;
  font-size: 1.1em;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .overview-cards {
    grid-template-columns: 1fr;
  }
  
  .achievements-grid {
    grid-template-columns: 1fr;
  }
  
  .achievement-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .achievement-meta {
    width: 100%;
    justify-content: space-between;
  }
  
  .progress-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
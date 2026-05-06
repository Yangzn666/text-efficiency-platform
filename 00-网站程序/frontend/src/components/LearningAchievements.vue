<template>
  <div class="learning-achievements">
    <div class="achievements-header">
      <h2 class="header-title">🎓 学习成就系统</h2>
      <p class="header-subtitle">记录你的每一次进步，见证成长的力量</p>
    </div>

    <!-- 总体统计 -->
    <div class="stats-overview">
      <div class="stat-card highlight">
        <div class="stat-icon">⭐</div>
        <div class="stat-info">
          <div class="stat-value">{{ totalPoints }}</div>
          <div class="stat-label">总积分</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">🏆</div>
        <div class="stat-info">
          <div class="stat-value">{{ unlockedCount }}</div>
          <div class="stat-label">已解锁成就</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">🔥</div>
        <div class="stat-info">
          <div class="stat-value">{{ streakDays }}</div>
          <div class="stat-label">连续学习天数</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">📈</div>
        <div class="stat-info">
          <div class="stat-value">{{ completionRate }}%</div>
          <div class="stat-label">完成率</div>
        </div>
      </div>
    </div>

    <!-- 成就分类展示 -->
    <div class="achievements-container">
      <!-- 里程碑成就 -->
      <div class="achievement-category">
        <h3 class="category-title">🌟 里程碑成就</h3>
        <div class="achievements-grid">
          <div 
            v-for="achievement in milestoneAchievements" 
            :key="achievement.id"
            class="achievement-card milestone"
            :class="{ 'unlocked': isUnlocked(achievement) }"
          >
            <div class="achievement-badge">
              {{ isUnlocked(achievement) ? '🏆' : '🔒' }}
            </div>
            <div class="achievement-content">
              <h4>{{ achievement.title }}</h4>
              <p>{{ achievement.description }}</p>
              <div class="achievement-footer">
                <span class="points-badge">{{ achievement.points }} 积分</span>
                <span v-if="isUnlocked(achievement)" class="unlock-date">
                  {{ formatDate(achievement.unlockedAt) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 学习成就 -->
      <div class="achievement-category">
        <h3 class="category-title">📚 学习成就</h3>
        <div class="achievements-grid">
          <div 
            v-for="achievement in studyAchievements" 
            :key="achievement.id"
            class="achievement-card study"
            :class="{ 'unlocked': isUnlocked(achievement) }"
          >
            <div class="achievement-badge">
              {{ isUnlocked(achievement) ? '📖' : '🔒' }}
            </div>
            <div class="achievement-content">
              <h4>{{ achievement.title }}</h4>
              <p>{{ achievement.description }}</p>
              <div class="achievement-footer">
                <span class="points-badge">{{ achievement.points }} 积分</span>
                <span v-if="isUnlocked(achievement)" class="unlock-date">
                  {{ formatDate(achievement.unlockedAt) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 专注成就 -->
      <div class="achievement-category">
        <h3 class="category-title">🎯 专注成就</h3>
        <div class="achievements-grid">
          <div 
            v-for="achievement in attentionAchievements" 
            :key="achievement.id"
            class="achievement-card attention"
            :class="{ 'unlocked': isUnlocked(achievement) }"
          >
            <div class="achievement-badge">
              {{ isUnlocked(achievement) ? '⏱️' : '🔒' }}
            </div>
            <div class="achievement-content">
              <h4>{{ achievement.title }}</h4>
              <p>{{ achievement.description }}</p>
              <div class="achievement-footer">
                <span class="points-badge">{{ achievement.points }} 积分</span>
                <span v-if="isUnlocked(achievement)" class="unlock-date">
                  {{ formatDate(achievement.unlockedAt) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 任务成就 -->
      <div class="achievement-category">
        <h3 class="category-title">✅ 任务成就</h3>
        <div class="achievements-grid">
          <div 
            v-for="achievement in todoAchievements" 
            :key="achievement.id"
            class="achievement-card todo"
            :class="{ 'unlocked': isUnlocked(achievement) }"
          >
            <div class="achievement-badge">
              {{ isUnlocked(achievement) ? '✓' : '🔒' }}
            </div>
            <div class="achievement-content">
              <h4>{{ achievement.title }}</h4>
              <p>{{ achievement.description }}</p>
              <div class="achievement-footer">
                <span class="points-badge">{{ achievement.points }} 积分</span>
                <span v-if="isUnlocked(achievement)" class="unlock-date">
                  {{ formatDate(achievement.unlockedAt) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 连击成就 -->
      <div class="achievement-category">
        <h3 class="category-title">🔥 连击成就</h3>
        <div class="achievements-grid">
          <div 
            v-for="achievement in streakAchievements" 
            :key="achievement.id"
            class="achievement-card streak"
            :class="{ 'unlocked': isUnlocked(achievement) }"
          >
            <div class="achievement-badge">
              {{ isUnlocked(achievement) ? '⚡' : '🔒' }}
            </div>
            <div class="achievement-content">
              <h4>{{ achievement.title }}</h4>
              <p>{{ achievement.description }}</p>
              <div class="achievement-footer">
                <span class="points-badge">{{ achievement.points }} 积分</span>
                <span v-if="isUnlocked(achievement)" class="unlock-date">
                  {{ formatDate(achievement.unlockedAt) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 下一步目标 -->
    <div class="next-goals">
      <h3 class="goals-title">🎯 下一步目标</h3>
      <div class="goals-list">
        <div 
          v-for="(goal, index) in nextGoals" 
          :key="index"
          class="goal-item"
        >
          <div class="goal-progress">
            <el-progress 
              :percentage="goal.progress" 
              :stroke-width="15"
              :color="getProgressColor(goal.progress)"
            />
          </div>
          <div class="goal-info">
            <div class="goal-title">{{ goal.title }}</div>
            <div class="goal-detail">{{ goal.current }} / {{ goal.target }}</div>
          </div>
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
const totalPoints = computed(() => psychologyStore.totalPoints)
const unlockedCount = computed(() => psychologyStore.unlockedAchievements.length)
const streakDays = computed(() => psychologyStore.streakInfo.count)
const completionRate = computed(() => {
  const total = psychologyStore.achievements.length
  if (total === 0) return 0
  return Math.round((unlockedCount.value / total) * 100)
})

// 按类别分组成就
const milestoneAchievements = computed(() => {
  return psychologyStore.achievements.filter(a => a.category === '里程碑')
})

const studyAchievements = computed(() => {
  return psychologyStore.achievements.filter(a => a.category === '学习成就')
})

const attentionAchievements = computed(() => {
  return psychologyStore.achievements.filter(a => a.category === '专注成就')
})

const todoAchievements = computed(() => {
  return psychologyStore.achievements.filter(a => a.category === '任务成就')
})

const streakAchievements = computed(() => {
  return psychologyStore.achievements.filter(a => a.category === '连击成就')
})

// 判断是否解锁
const isUnlocked = (achievement: Achievement) => {
  return psychologyStore.unlockedAchievements.some(a => a.id === achievement.id)
}

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric'
  })
}

// 获取进度条颜色
const getProgressColor = (progress: number) => {
  if (progress >= 80) return '#67C23A'
  if (progress >= 50) return '#E6A23C'
  return '#409EFF'
}

// 下一步目标
const nextGoals = computed(() => {
  const goals = []
  
  // 积分目标
  const nextMilestone = [100, 500, 1000, 2000].find(m => m > totalPoints.value) || 2000
  goals.push({
    title: '累计积分',
    current: totalPoints.value,
    target: nextMilestone,
    progress: Math.min(Math.round((totalPoints.value / nextMilestone) * 100), 100)
  })
  
  // 连击目标
  const nextStreak = [7, 14, 30, 60].find(s => s > streakDays.value) || 60
  goals.push({
    title: '连续学习天数',
    current: streakDays.value,
    target: nextStreak,
    progress: Math.min(Math.round((streakDays.value / nextStreak) * 100), 100)
  })
  
  // 成就解锁目标
  const totalAchievements = psychologyStore.achievements.length
  const nextAchievementCount = Math.ceil(unlockedCount.value / 5) * 5 + 5
  goals.push({
    title: '解锁成就数量',
    current: unlockedCount.value,
    target: nextAchievementCount,
    progress: Math.min(Math.round((unlockedCount.value / nextAchievementCount) * 100), 100)
  })
  
  return goals
})
</script>

<style scoped>
.learning-achievements {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 头部 */
.achievements-header {
  text-align: center;
  margin-bottom: 30px;
}

.header-title {
  font-size: 2em;
  color: #333;
  margin-bottom: 10px;
}

.header-subtitle {
  color: #666;
  font-size: 1em;
}

/* 统计概览 */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 25px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.stat-card.highlight {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stat-icon {
  font-size: 2.5em;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 15px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 2.2em;
  font-weight: 800;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 1em;
  opacity: 0.9;
}

/* 成就容器 */
.achievements-container {
  margin-bottom: 40px;
}

.achievement-category {
  margin-bottom: 40px;
}

.category-title {
  font-size: 1.5em;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 3px solid #667eea;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.achievement-card {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 20px;
  background: #fafafa;
  border-radius: 12px;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.achievement-card:hover {
  transform: translateX(5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.achievement-card.unlocked {
  background: #f5fff5;
  border-left-color: #67C23A;
}

.achievement-card.milestone {
  border-top: 3px solid #FFD700;
}

.achievement-card.study {
  border-top: 3px solid #4CAF50;
}

.achievement-card.attention {
  border-top: 3px solid #2196F3;
}

.achievement-card.todo {
  border-top: 3px solid #FF9800;
}

.achievement-card.streak {
  border-top: 3px solid #F44336;
}

.achievement-badge {
  font-size: 2em;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.achievement-content {
  flex: 1;
}

.achievement-content h4 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 1.1em;
}

.achievement-content p {
  margin: 0 0 12px 0;
  color: #666;
  font-size: 0.9em;
  line-height: 1.5;
}

.achievement-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.points-badge {
  padding: 4px 12px;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: white;
  border-radius: 12px;
  font-size: 0.85em;
  font-weight: 600;
}

.unlock-date {
  color: #67C23A;
  font-size: 0.85em;
  font-weight: 500;
}

/* 下一步目标 */
.next-goals {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 8px 25px rgba(33, 150, 243, 0.15);
}

.goals-title {
  font-size: 1.5em;
  color: #1976D2;
  margin-bottom: 25px;
  text-align: center;
}

.goals-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.goal-item {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
}

.goal-progress {
  margin-bottom: 12px;
}

.goal-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.goal-title {
  font-size: 1.1em;
  font-weight: 600;
  color: #333;
}

.goal-detail {
  font-size: 1em;
  color: #667eea;
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .learning-achievements {
    padding: 15px;
  }
  
  .stats-overview {
    grid-template-columns: 1fr;
  }
  
  .achievements-grid {
    grid-template-columns: 1fr;
  }
  
  .achievement-card {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .achievement-footer {
    width: 100%;
  }
}
</style>

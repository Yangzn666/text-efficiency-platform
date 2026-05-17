<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useLearningPathStore } from '@/stores/learningPath'
import { ElMessage } from 'element-plus'

const learningPathStore = useLearningPathStore()

// 计算属性
const userLevel = computed(() => learningPathStore.userLevel)
const streakData = computed(() => learningPathStore.streakData)
const unlockedAchievements = computed(() => learningPathStore.getUnlockedAchievements())
const lockedAchievements = computed(() => learningPathStore.getLockedAchievements())
const achievementProgress = computed(() => learningPathStore.getAchievementProgress())

// XP进度百分比
const xpProgress = computed(() => {
  return Math.round((userLevel.value.currentXP / userLevel.value.nextLevelXP) * 100)
})

// 方法
const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    study: '📚',
    streak: '🔥',
    milestone: '🎯',
    mastery: '⭐'
  }
  return icons[category] || '🏆'
}

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    study: '#4CAF50',
    streak: '#FF6B6B',
    milestone: '#2196F3',
    mastery: '#FFD700'
  }
  return colors[category] || '#999'
}

const formatUnlockDate = (dateStr?: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

// 初始化
onMounted(() => {
  // 更新Streaks
  learningPathStore.updateStreak()
})
</script>

<template>
  <div class="gamification-dashboard">
    <!-- 等级和XP -->
    <div class="section-card level-card">
      <div class="level-header">
        <div class="level-info">
          <div class="level-badge">{{ userLevel.level }}</div>
          <div class="level-details">
            <div class="level-title">{{ userLevel.title }}</div>
            <div class="level-xp">
              {{ userLevel.currentXP }} / {{ userLevel.nextLevelXP }} XP
            </div>
          </div>
        </div>
        <div class="xp-bar-container">
          <div class="xp-bar">
            <div 
              class="xp-fill"
              :style="{ width: xpProgress + '%' }"
            ></div>
          </div>
          <div class="xp-progress">{{ xpProgress }}%</div>
        </div>
      </div>
    </div>

    <!-- Streaks连续学习 -->
    <div class="section-card streak-card">
      <div class="streak-header">
        <h3>🔥 连续学习</h3>
        <div class="streak-badge" v-if="streakData.currentStreak > 0">
          {{ streakData.currentStreak }}天
        </div>
      </div>
      
      <div class="streak-stats">
        <div class="streak-stat">
          <div class="stat-icon">🔥</div>
          <div class="stat-info">
            <div class="stat-value">{{ streakData.currentStreak }}</div>
            <div class="stat-label">当前连续</div>
          </div>
        </div>
        
        <div class="streak-stat">
          <div class="stat-icon">🏆</div>
          <div class="stat-info">
            <div class="stat-value">{{ streakData.longestStreak }}</div>
            <div class="stat-label">最长记录</div>
          </div>
        </div>
        
        <div class="streak-stat">
          <div class="stat-icon">📅</div>
          <div class="stat-info">
            <div class="stat-value">{{ streakData.streakHistory.length }}</div>
            <div class="stat-label">总学习天数</div>
          </div>
        </div>
      </div>
      
      <div class="streak-tip" v-if="streakData.currentStreak === 0">
        💡 今天学习即可开始你的连续学习之旅！
      </div>
      <div class="streak-tip" v-else-if="streakData.currentStreak < 7">
        🎯 再坚持{{ 7 - streakData.currentStreak }}天，解锁"一周不间断"成就！
      </div>
      <div class="streak-tip" v-else-if="streakData.currentStreak < 30">
        🔥 太棒了！再坚持{{ 30 - streakData.currentStreak }}天，成为月度冠军！
      </div>
    </div>

    <!-- 成就进度 -->
    <div class="section-card">
      <div class="section-header">
        <h3>🏅 成就系统</h3>
        <el-tag type="success" size="large">
          {{ achievementProgress.unlocked }} / {{ achievementProgress.total }}
        </el-tag>
      </div>
      
      <div class="achievement-progress">
        <el-progress 
          :percentage="achievementProgress.percentage" 
          :stroke-width="12"
          :color="'linear-gradient(90deg, #FFD700, #FFA500)'"
        />
        <div class="progress-text">
          已解锁 {{ achievementProgress.percentage }}% 的成就
        </div>
      </div>
    </div>

    <!-- 已解锁成就 -->
    <div class="section-card" v-if="unlockedAchievements.length > 0">
      <div class="section-header">
        <h3>✅ 已解锁成就</h3>
      </div>
      
      <div class="achievements-grid">
        <div 
          v-for="achievement in unlockedAchievements" 
          :key="achievement.id"
          class="achievement-card unlocked"
        >
          <div class="achievement-icon">{{ achievement.icon }}</div>
          <div class="achievement-content">
            <div class="achievement-name">{{ achievement.name }}</div>
            <div class="achievement-desc">{{ achievement.description }}</div>
            <div class="achievement-meta">
              <span class="category-tag" :style="{ color: getCategoryColor(achievement.category) }">
                {{ getCategoryIcon(achievement.category) }} {{ achievement.category }}
              </span>
              <span class="unlock-date" v-if="achievement.unlockedAt">
                {{ formatUnlockDate(achievement.unlockedAt) }}
              </span>
            </div>
            <div class="xp-reward">+{{ achievement.xpReward }} XP</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 未解锁成就 -->
    <div class="section-card" v-if="lockedAchievements.length > 0">
      <div class="section-header">
        <h3>🔒 待解锁成就</h3>
      </div>
      
      <div class="achievements-grid">
        <div 
          v-for="achievement in lockedAchievements.slice(0, 6)" 
          :key="achievement.id"
          class="achievement-card locked"
        >
          <div class="achievement-icon">🔒</div>
          <div class="achievement-content">
            <div class="achievement-name">???</div>
            <div class="achievement-desc">{{ achievement.description }}</div>
            <div class="achievement-meta">
              <span class="category-tag" :style="{ color: getCategoryColor(achievement.category) }">
                {{ getCategoryIcon(achievement.category) }} {{ achievement.category }}
              </span>
            </div>
            <div class="xp-reward">+{{ achievement.xpReward }} XP</div>
          </div>
        </div>
      </div>
      
      <div class="more-hint" v-if="lockedAchievements.length > 6">
        还有 {{ lockedAchievements.length - 6 }} 个成就等待解锁...
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="unlockedAchievements.length === 0 && lockedAchievements.length === 0" class="empty-state">
      <el-icon :size="60" color="#ccc"><Trophy /></el-icon>
      <p>开始学习，解锁你的第一个成就！</p>
      <p class="hint">完成学习任务、保持连续学习，收集所有徽章</p>
    </div>
  </div>
</template>

<style scoped>
.gamification-dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  font-size: 1.3em;
  color: #333;
  margin: 0;
}

/* 等级卡片 */
.level-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.level-header {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.level-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.level-badge {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8em;
  font-weight: 700;
  border: 3px solid rgba(255, 255, 255, 0.5);
}

.level-details {
  flex: 1;
}

.level-title {
  font-size: 1.5em;
  font-weight: 700;
  margin-bottom: 5px;
}

.level-xp {
  font-size: 0.9em;
  opacity: 0.9;
}

.xp-bar-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.xp-bar {
  flex: 1;
  height: 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  overflow: hidden;
}

.xp-fill {
  height: 100%;
  background: linear-gradient(90deg, #FFD700, #FFA500);
  border-radius: 6px;
  transition: width 0.5s ease;
}

.xp-progress {
  font-weight: 600;
  min-width: 45px;
  text-align: right;
}

/* Streaks卡片 */
.streak-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.streak-header h3 {
  font-size: 1.3em;
  color: #333;
  margin: 0;
}

.streak-badge {
  padding: 8px 16px;
  background: linear-gradient(135deg, #FF6B6B, #FF8E53);
  color: white;
  border-radius: 20px;
  font-weight: 700;
  font-size: 1.1em;
}

.streak-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
  margin-bottom: 15px;
}

.streak-stat {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
}

.stat-icon {
  font-size: 1.8em;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 1.5em;
  font-weight: 700;
  color: #333;
  margin-bottom: 3px;
}

.stat-label {
  font-size: 0.85em;
  color: #666;
}

.streak-tip {
  padding: 12px;
  background: linear-gradient(135deg, #fff9e6, #fff3cd);
  border-left: 4px solid #FFD700;
  border-radius: 8px;
  color: #666;
  font-size: 0.95em;
}

/* 成就进度 */
.achievement-progress {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.progress-text {
  text-align: center;
  color: #666;
  font-size: 0.9em;
}

/* 成就网格 */
.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 15px;
}

.achievement-card {
  display: flex;
  gap: 15px;
  padding: 15px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.achievement-card.unlocked {
  background: linear-gradient(135deg, #fff9e6, #fff3cd);
  border: 2px solid #FFD700;
}

.achievement-card.locked {
  background: #f8f9fa;
  border: 2px dashed #ddd;
  opacity: 0.7;
}

.achievement-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.achievement-icon {
  font-size: 2.5em;
  display: flex;
  align-items: center;
}

.achievement-content {
  flex: 1;
}

.achievement-name {
  font-weight: 700;
  color: #333;
  font-size: 1.05em;
  margin-bottom: 5px;
}

.achievement-desc {
  font-size: 0.9em;
  color: #666;
  margin-bottom: 8px;
  line-height: 1.4;
}

.achievement-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.category-tag {
  font-size: 0.8em;
  font-weight: 600;
}

.unlock-date {
  font-size: 0.8em;
  color: #999;
}

.xp-reward {
  display: inline-block;
  padding: 4px 10px;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: white;
  border-radius: 15px;
  font-size: 0.85em;
  font-weight: 700;
}

.more-hint {
  text-align: center;
  color: #999;
  font-size: 0.9em;
  margin-top: 15px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.empty-state p {
  color: #999;
  margin: 10px 0;
}

.empty-state .hint {
  font-size: 0.9em;
  font-style: italic;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .section-card {
    padding: 20px;
  }
  
  .achievements-grid {
    grid-template-columns: 1fr;
  }
  
  .streak-stats {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .section-card {
    padding: 15px;
  }
  
  .section-header h3 {
    font-size: 1.15em;
  }
  
  .level-badge {
    width: 50px;
    height: 50px;
    font-size: 1.5em;
  }
  
  .level-title {
    font-size: 1.3em;
  }
  
  .achievement-icon {
    font-size: 2em;
  }
  
  .achievement-name {
    font-size: 0.95em;
  }
  
  .achievement-desc {
    font-size: 0.85em;
  }
}
</style>

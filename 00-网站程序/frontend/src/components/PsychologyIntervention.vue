<template>
  <div class="psychology-intervention">
    <!-- 积分和成就概览 -->
    <div class="dashboard-section">
      <div class="points-overview">
        <div class="points-card">
          <div class="points-icon">⭐</div>
          <div class="points-info">
            <div class="points-number">{{ psychologyStore.totalPoints }}</div>
            <div class="points-label">总积分</div>
          </div>
        </div>
        
        <div class="points-card">
          <div class="points-icon">📅</div>
          <div class="points-info">
            <div class="points-number">{{ psychologyStore.dailyPoints }}</div>
            <div class="points-label">今日积分</div>
          </div>
        </div>
        
        <div class="points-card">
          <div class="points-icon">🏆</div>
          <div class="points-info">
            <div class="points-number">{{ psychologyStore.unlockedAchievements.length }}</div>
            <div class="points-label">已解锁成就</div>
          </div>
        </div>
        
        <div class="points-card">
          <div class="points-icon">📝</div>
          <div class="points-info">
            <div class="points-number">{{ psychologyStore.todayRecords.length }}</div>
            <div class="points-label">今日练习</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 标签页导航 -->
    <div class="tabs-navigation">
      <el-tabs v-model="activeTab" class="psychology-tabs">
        <el-tab-pane label="情绪追踪" name="mood">
          <EnhancedMoodTracker />
        </el-tab-pane>
        
        <el-tab-pane label="认知重构" name="cognitive">
          <CognitiveReframe />
        </el-tab-pane>
        
        <el-tab-pane label="行为激活" name="behavior">
          <BehaviorActivation />
        </el-tab-pane>
        
        <el-tab-pane label="奖励商城" name="rewards">
          <EnhancedRewardShop />
        </el-tab-pane>
        
        <el-tab-pane label="成就系统" name="achievements">
          <AchievementSystem />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePsychologyStore } from '@/stores/psychology'
import CognitiveReframe from './CognitiveReframe.vue'
import BehaviorActivation from './BehaviorActivation.vue'
import EnhancedRewardShop from './EnhancedRewardShop.vue'
import AchievementSystem from './AchievementSystem.vue'
import EnhancedMoodTracker from './EnhancedMoodTracker.vue'

const psychologyStore = usePsychologyStore()
const activeTab = ref('mood')

onMounted(() => {
  psychologyStore.loadData()
})
</script>

<style scoped>
.psychology-intervention {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.dashboard-section {
  margin-bottom: 30px;
}

.points-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.points-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 25px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.points-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.points-icon {
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

.points-info {
  flex: 1;
}

.points-number {
  font-size: 2.2em;
  font-weight: 800;
  color: #333;
  margin-bottom: 5px;
}

.points-label {
  color: #666;
  font-size: 1.1em;
}

.tabs-navigation {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.psychology-tabs :deep(.el-tabs__header) {
  margin-bottom: 30px;
}

.psychology-tabs :deep(.el-tabs__nav-wrap)::after {
  display: none;
}

.psychology-tabs :deep(.el-tabs__item) {
  font-size: 1.2em;
  font-weight: 600;
  padding: 0 30px;
  height: 60px;
  line-height: 60px;
  color: #666;
}

.psychology-tabs :deep(.el-tabs__item.is-active) {
  color: #667eea;
}

.psychology-tabs :deep(.el-tabs__active-bar) {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  height: 4px;
  border-radius: 2px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .psychology-intervention {
    padding: 15px;
  }
  
  .points-overview {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .points-card {
    padding: 20px;
  }
  
  .points-icon {
    width: 60px;
    height: 60px;
    font-size: 2em;
  }
  
  .points-number {
    font-size: 1.8em;
  }
  
  .tabs-navigation {
    padding: 20px;
  }
  
  .psychology-tabs :deep(.el-tabs__item) {
    padding: 0 15px;
    font-size: 1em;
  }
}
</style>
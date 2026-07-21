<template>
  <div class="enhanced-reward-shop">
    <!-- 积分概览 -->
    <div class="points-overview">
      <div class="points-card">
        <div class="points-icon">
          <el-icon size="32" color="#FFD700"><Star /></el-icon>
        </div>
        <div class="points-info">
          <div class="points-total">{{ totalPoints }}</div>
          <div class="points-label">总积分</div>
        </div>
      </div>
      
      <div class="points-breakdown">
        <div class="breakdown-item">
          <span class="source">今日获得</span>
          <span class="amount">+{{ dailyPoints }}</span>
        </div>
        <div class="breakdown-item">
          <span class="source">代办联动</span>
          <span class="amount">{{ integrationPoints.todos }}</span>
        </div>
        <div class="breakdown-item">
          <span class="source">学习奖励</span>
          <span class="amount">{{ integrationPoints.study }}</span>
        </div>
        <div class="breakdown-item">
          <span class="source">专注奖励</span>
          <span class="amount">{{ integrationPoints.attention }}</span>
        </div>
      </div>
    </div>

    <!-- 奖励分类 -->
    <div class="shop-categories">
      <el-tabs v-model="activeCategory" class="categories-tabs">
        <el-tab-pane label="学习奖励" name="study">
          <div class="rewards-grid">
            <div 
              v-for="reward in studyRewards" 
              :key="reward.id"
              class="reward-card"
              :class="{ 'unavailable': reward.cost > totalPoints }"
            >
              <div class="reward-icon">
                <el-icon size="28" :color="getRewardColor(reward.type)">
                  <component :is="getRewardIcon(reward.type)" />
                </el-icon>
              </div>
              <div class="reward-content">
                <h4>{{ reward.title }}</h4>
                <p>{{ reward.description }}</p>
                <div class="reward-meta">
                  <span class="cost">{{ reward.cost }}积分</span>
                  <span class="category">{{ reward.category }}</span>
                </div>
              </div>
              <div class="reward-actions">
                <el-button 
                  type="primary" 
                  @click="redeemReward(reward)"
                  :disabled="reward.cost > totalPoints || reward.redeemed"
                  size="small"
                >
                  {{ reward.redeemed ? '已兑换' : '兑换' }}
                </el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="生活奖励" name="life">
          <div class="rewards-grid">
            <div 
              v-for="reward in lifeRewards" 
              :key="reward.id"
              class="reward-card"
              :class="{ 'unavailable': reward.cost > totalPoints }"
            >
              <div class="reward-icon">
                <el-icon size="28" :color="getRewardColor(reward.type)">
                  <component :is="getRewardIcon(reward.type)" />
                </el-icon>
              </div>
              <div class="reward-content">
                <h4>{{ reward.title }}</h4>
                <p>{{ reward.description }}</p>
                <div class="reward-meta">
                  <span class="cost">{{ reward.cost }}积分</span>
                  <span class="category">{{ reward.category }}</span>
                </div>
              </div>
              <div class="reward-actions">
                <el-button 
                  type="primary" 
                  @click="redeemReward(reward)"
                  :disabled="reward.cost > totalPoints || reward.redeemed"
                  size="small"
                >
                  {{ reward.redeemed ? '已兑换' : '兑换' }}
                </el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="健康奖励" name="health">
          <div class="rewards-grid">
            <div 
              v-for="reward in healthRewards" 
              :key="reward.id"
              class="reward-card"
              :class="{ 'unavailable': reward.cost > totalPoints }"
            >
              <div class="reward-icon">
                <el-icon size="28" :color="getRewardColor(reward.type)">
                  <component :is="getRewardIcon(reward.type)" />
                </el-icon>
              </div>
              <div class="reward-content">
                <h4>{{ reward.title }}</h4>
                <p>{{ reward.description }}</p>
                <div class="reward-meta">
                  <span class="cost">{{ reward.cost }}积分</span>
                  <span class="category">{{ reward.category }}</span>
                </div>
              </div>
              <div class="reward-actions">
                <el-button 
                  type="primary" 
                  @click="redeemReward(reward)"
                  :disabled="reward.cost > totalPoints || reward.redeemed"
                  size="small"
                >
                  {{ reward.redeemed ? '已兑换' : '兑换' }}
                </el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 已兑换奖励 -->
    <div class="redeemed-section">
      <h3>🎁 已兑换奖励</h3>
      <div class="redeemed-grid">
        <div 
          v-for="reward in redeemedRewards" 
          :key="reward.id"
          class="redeemed-card"
        >
          <div class="redeemed-header">
            <h4>{{ reward.title }}</h4>
            <span class="redeem-date">{{ formatDate(reward.redeemedAt!) }}</span>
          </div>
          <p>{{ reward.description }}</p>
        </div>
      </div>
    </div>

    <!-- 成就展示 -->
    <div class="achievements-section">
      <h3>🏆 我的成就</h3>
      <div class="achievements-grid">
        <div 
          v-for="achievement in unlockedAchievements" 
          :key="achievement.id"
          class="achievement-card"
          :class="achievement.category.toLowerCase()"
        >
          <div class="achievement-icon">
            <el-icon size="24" color="white">
              <Trophy />
            </el-icon>
          </div>
          <div class="achievement-content">
            <h4>{{ achievement.title }}</h4>
            <p>{{ achievement.description }}</p>
            <div class="achievement-points">
              <el-icon color="#FFD700"><Star /></el-icon>
              {{ achievement.points }}积分
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePsychologyStore } from '@/stores/psychology'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Star, 
  Trophy,
  Coffee, 
  Headset, 
  IceCream, 
  ShoppingBag, 
  VideoCamera, 
  Soccer, 
  Basketball, 
  Apple,
  Notebook,
  MagicStick
} from '@element-plus/icons-vue'

const psychologyStore = usePsychologyStore()
const activeCategory = ref('study')

// 计算属性
const totalPoints = computed(() => psychologyStore.totalPoints)
const dailyPoints = computed(() => psychologyStore.dailyPoints)
const integrationPoints = computed(() => psychologyStore.integrationPoints)
const availableRewards = computed(() => psychologyStore.availableRewards)
const redeemedRewards = computed(() => 
  psychologyStore.rewards.filter(r => r.redeemed)
)
const unlockedAchievements = computed(() => psychologyStore.unlockedAchievements)

// 奖励分类
const studyRewards = computed(() => [
  {
    id: 'study_1',
    title: '高效学习时段',
    description: '兑换2小时高效学习时间（无干扰模式）',
    cost: 150,
    type: 'study',
    category: '专注力',
    redeemed: false
  },
  {
    id: 'study_2',
    title: '智能复习提醒',
    description: '开启AI智能复习提醒服务7天',
    cost: 100,
    type: 'study',
    category: '学习工具',
    redeemed: false
  },
  {
    id: 'study_3',
    title: '错题本扩容',
    description: '增加错题本容量50条',
    cost: 80,
    type: 'study',
    category: '学习资源',
    redeemed: false
  }
])

const lifeRewards = computed(() => [
  {
    id: 'life_1',
    title: '咖啡时光',
    description: '兑换一杯精品咖啡',
    cost: 60,
    type: 'coffee',
    category: '美食',
    redeemed: false
  },
  {
    id: 'life_2',
    title: '电影之夜',
    description: '兑换一部电影观看权限',
    cost: 120,
    type: 'movie',
    category: '娱乐',
    redeemed: false
  },
  {
    id: 'life_3',
    title: '购物基金',
    description: '获得50元小额购物基金',
    cost: 200,
    type: 'shopping',
    category: '购物',
    redeemed: false
  }
])

const healthRewards = computed(() => [
  {
    id: 'health_1',
    title: '运动时间',
    description: '兑换健身房1小时使用权',
    cost: 90,
    type: 'sport',
    category: '运动',
    redeemed: false
  },
  {
    id: 'health_2',
    title: '健康零食',
    description: '兑换健康零食礼包一份',
    cost: 40,
    type: 'food',
    category: '饮食',
    redeemed: false
  },
  {
    id: 'health_3',
    title: '冥想课程',
    description: '兑换15分钟冥想指导课程',
    cost: 70,
    type: 'meditation',
    category: '心理健康',
    redeemed: false
  }
])

// 方法
const getRewardColor = (type: string) => {
  const colors: Record<string, string> = {
    'study': '#4CAF50',
    'coffee': '#795548',
    'movie': '#FF5722',
    'shopping': '#9C27B0',
    'sport': '#03A9F4',
    'food': '#FF9800',
    'meditation': '#607D8B'
  }
  return colors[type] || '#9E9E9E'
}

const getRewardIcon = (type: string) => {
  const icons: Record<string, any> = {
    'study': Notebook,
    'coffee': Coffee,
    'movie': VideoCamera,
    'shopping': ShoppingBag,
    'sport': Basketball,
    'food': IceCream,
    'meditation': MagicStick
  }
  return icons[type] || Star
}

const redeemReward = async (reward: any) => {
  if (reward.cost > totalPoints.value) {
    ElMessage.warning('积分不足，无法兑换此奖励')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确定要花费${reward.cost}积分兑换"${reward.title}"吗？`,
      '兑换确认',
      {
        confirmButtonText: '确认兑换',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    // 这里应该调用实际的兑换逻辑
    const success = psychologyStore.redeemReward(reward.id)
    
    if (success) {
      ElMessage.success(`成功兑换"${reward.title}"！`)
    } else {
      ElMessage.error('兑换失败，请重试')
    }
  } catch {
    // 用户取消兑换
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}
</script>

<style scoped>
.enhanced-reward-shop {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.points-overview {
  background: linear-gradient(135deg, #16345c 0%, #1e4576 100%);
  border-radius: 20px;
  padding: 30px;
  color: white;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.points-card {
  display: flex;
  align-items: center;
  gap: 20px;
}

.points-icon {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  padding: 15px;
}

.points-total {
  font-size: 2.5em;
  font-weight: bold;
}

.points-label {
  font-size: 1.1em;
  opacity: 0.9;
}

.points-breakdown {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.source {
  font-size: 0.9em;
}

.amount {
  font-weight: bold;
  color: #FFD700;
}

.shop-categories {
  background: white;
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
}

.categories-tabs :deep(.el-tabs__nav-wrap)::after {
  display: none;
}

.rewards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.reward-card {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 20px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  position: relative;
}

.reward-card:hover:not(.unavailable) {
  border-color: #ffc53d;
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(13, 33, 55, 0.2);
}

.reward-card.unavailable {
  opacity: 0.6;
  cursor: not-allowed;
}

.reward-icon {
  text-align: center;
  margin-bottom: 15px;
}

.reward-content h4 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.2em;
}

.reward-content p {
  color: #666;
  margin: 0 0 15px 0;
  line-height: 1.5;
}

.reward-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.cost {
  font-weight: bold;
  color: #FF9800;
  font-size: 1.1em;
}

.category {
  background: #eef3fa;
  color: #16345c;
  padding: 4px 10px;
  border-radius: 15px;
  font-size: 0.8em;
}

.redeemed-section, .achievements-section {
  background: white;
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
}

.redeemed-section h3, .achievements-section h3 {
  color: #333;
  margin: 0 0 20px 0;
  font-size: 1.4em;
}

.redeemed-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
}

.redeemed-card {
  background: #e8f5e8;
  border-radius: 15px;
  padding: 20px;
  border-left: 4px solid #4CAF50;
}

.redeemed-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.redeemed-header h4 {
  margin: 0;
  color: #333;
}

.redeem-date {
  color: #666;
  font-size: 0.9em;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.achievement-card {
  background: linear-gradient(135deg, #ffd700 0%, #ffb74d 100%);
  border-radius: 15px;
  padding: 20px;
  display: flex;
  gap: 15px;
  color: #333;
}

.achievement-card.milestone {
  background: linear-gradient(135deg, #4CAF50 0%, #81C784 100%);
  color: white;
}

.achievement-card.practice {
  background: linear-gradient(135deg, #16345c 0%, #2a5290 100%);
  color: white;
}

.achievement-icon {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  padding: 10px;
  flex-shrink: 0;
}

.achievement-content {
  flex: 1;
}

.achievement-content h4 {
  margin: 0 0 8px 0;
  font-size: 1.1em;
}

.achievement-content p {
  margin: 0 0 10px 0;
  font-size: 0.9em;
  opacity: 0.9;
}

.achievement-points {
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: bold;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .points-overview {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .rewards-grid, .redeemed-grid, .achievements-grid {
    grid-template-columns: 1fr;
  }
  
  .reward-card {
    padding: 15px;
  }
}
</style>
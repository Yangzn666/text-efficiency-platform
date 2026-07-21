<template>
  <div class="reward-shop">
    <!-- 积分显示 -->
    <div class="points-display">
      <div class="points-card">
        <div class="points-icon">💰</div>
        <div class="points-info">
          <div class="points-label">当前积分</div>
          <div class="points-value">{{ psychologyStore.totalPoints }}</div>
        </div>
      </div>
      <div class="points-card">
        <div class="points-icon">🎁</div>
        <div class="points-info">
          <div class="points-label">已兑换</div>
          <div class="points-value">{{ redeemedRewards.length }}</div>
        </div>
      </div>
    </div>

    <!-- 可兑换奖励 -->
    <div class="available-rewards">
      <h3>🏪 可兑换奖励</h3>
      
      <!-- 日常小奖励 -->
      <div class="reward-category">
        <h4 class="category-title">☕ 日常小奖励</h4>
        <div class="rewards-grid">
          <div 
            v-for="reward in dailyRewards" 
            :key="reward.id"
            class="reward-card daily"
            :class="{ 'can-afford': psychologyStore.totalPoints >= reward.cost }"
          >
            <div class="reward-header">
              <h4>{{ reward.title }}</h4>
              <div class="reward-cost">
                <span class="cost-number">{{ reward.cost }}</span>
                <span class="cost-label">积分</span>
              </div>
            </div>
            
            <p class="reward-description">{{ reward.description }}</p>
            
            <el-button 
              type="primary" 
              @click="redeemReward(reward.id)"
              :loading="redeemingReward === reward.id"
              :disabled="psychologyStore.totalPoints < reward.cost"
              size="large"
            >
              {{ psychologyStore.totalPoints >= reward.cost ? '立即兑换' : '积分不足' }}
            </el-button>
          </div>
        </div>
      </div>
      
      <!-- 中等奖励 -->
      <div class="reward-category">
        <h4 class="category-title">🎬 中等奖励</h4>
        <div class="rewards-grid">
          <div 
            v-for="reward in mediumRewards" 
            :key="reward.id"
            class="reward-card medium"
            :class="{ 'can-afford': psychologyStore.totalPoints >= reward.cost }"
          >
            <div class="reward-header">
              <h4>{{ reward.title }}</h4>
              <div class="reward-cost">
                <span class="cost-number">{{ reward.cost }}</span>
                <span class="cost-label">积分</span>
              </div>
            </div>
            
            <p class="reward-description">{{ reward.description }}</p>
            
            <el-button 
              type="success" 
              @click="redeemReward(reward.id)"
              :loading="redeemingReward === reward.id"
              :disabled="psychologyStore.totalPoints < reward.cost"
              size="large"
            >
              {{ psychologyStore.totalPoints >= reward.cost ? '立即兑换' : '积分不足' }}
            </el-button>
          </div>
        </div>
      </div>
      
      <!-- 高级奖励 -->
      <div class="reward-category">
        <h4 class="category-title">🏖️ 终极奖励</h4>
        <div class="rewards-grid">
          <div 
            v-for="reward in premiumRewards" 
            :key="reward.id"
            class="reward-card premium"
            :class="{ 'can-afford': psychologyStore.totalPoints >= reward.cost }"
          >
            <div class="reward-header">
              <h4>{{ reward.title }}</h4>
              <div class="reward-cost">
                <span class="cost-number">{{ reward.cost }}</span>
                <span class="cost-label">积分</span>
              </div>
            </div>
            
            <p class="reward-description">{{ reward.description }}</p>
            
            <el-button 
              type="warning" 
              @click="redeemReward(reward.id)"
              :loading="redeemingReward === reward.id"
              :disabled="psychologyStore.totalPoints < reward.cost"
              size="large"
            >
              {{ psychologyStore.totalPoints >= reward.cost ? '立即兑换' : '积分不足' }}
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 已兑换奖励 -->
    <div class="redeemed-rewards">
      <h3>🎁 已兑换奖励</h3>
      <div class="redeemed-grid">
        <div 
          v-for="reward in redeemedRewards" 
          :key="reward.id"
          class="redeemed-card"
        >
          <div class="redeemed-header">
            <h4>{{ reward.title }}</h4>
            <el-tag type="success" effect="dark">已兑换</el-tag>
          </div>
          
          <p class="reward-description">{{ reward.description }}</p>
          
          <div class="redeem-date">
            📅 兑换时间: {{ formatDate(reward.redeemedAt!) }}
          </div>
        </div>
      </div>
      
      <div v-if="redeemedRewards.length === 0" class="empty-state">
        <div class="empty-icon">🎁</div>
        <h4>暂无已兑换奖励</h4>
        <p>快去赚取积分兑换奖励吧！</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { usePsychologyStore } from '@/stores/psychology'

const psychologyStore = usePsychologyStore()
const redeemingReward = ref<string | null>(null)

const redeemedRewards = computed(() => {
  return psychologyStore.rewards.filter(reward => reward.redeemed)
})

// 按类别分组奖励
const dailyRewards = computed(() => {
  return psychologyStore.availableRewards.filter(r => r.cost <= 50)
})

const mediumRewards = computed(() => {
  return psychologyStore.availableRewards.filter(r => r.cost > 50 && r.cost <= 200)
})

const premiumRewards = computed(() => {
  return psychologyStore.availableRewards.filter(r => r.cost > 200)
})

const redeemReward = async (rewardId: string) => {
  redeemingReward.value = rewardId
  try {
    const success = psychologyStore.redeemReward(rewardId)
    if (success) {
      ElMessage.success('🎉 兑换成功！好好享受你的奖励吧！')
    } else {
      ElMessage.error('兑换失败，请检查积分是否足够')
    }
  } finally {
    redeemingReward.value = null
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.reward-shop {
  padding: 20px 0;
}

/* 积分显示 */
.points-display {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.points-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 25px;
  background: linear-gradient(135deg, #16345c 0%, #1e4576 100%);
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(13, 33, 55, 0.3);
  color: white;
  transition: all 0.3s ease;
}

.points-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(13, 33, 55, 0.4);
}

.points-icon {
  font-size: 2.5em;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 15px;
}

.points-info {
  flex: 1;
}

.points-label {
  font-size: 1em;
  opacity: 0.9;
  margin-bottom: 8px;
}

.points-value {
  font-size: 2.5em;
  font-weight: 800;
}

.available-rewards,
.redeemed-rewards {
  margin-bottom: 40px;
}

.available-rewards h3,
.redeemed-rewards h3 {
  color: #333;
  margin: 0 0 25px 0;
  font-size: 1.5em;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

/* 奖励分类 */
.reward-category {
  margin-bottom: 30px;
}

.category-title {
  font-size: 1.3em;
  color: #16345c;
  margin: 0 0 20px 0;
  padding-left: 15px;
  border-left: 4px solid #16345c;
}

.rewards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.reward-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.reward-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.reward-card.can-afford {
  border-color: #67C23A;
}

.reward-card.daily {
  border-top: 4px solid #4CAF50;
}

.reward-card.medium {
  border-top: 4px solid #FF9800;
}

.reward-card.premium {
  border-top: 4px solid #F44336;
}

.reward-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.reward-header h4 {
  margin: 0;
  color: #333;
  font-size: 1.3em;
}

.reward-cost {
  text-align: right;
}

.cost-number {
  display: block;
  font-size: 1.8em;
  font-weight: 800;
  color: #FF9800;
}

.cost-label {
  font-size: 0.9em;
  color: #666;
}

.reward-description {
  color: #666;
  line-height: 1.6;
  margin: 0 0 20px 0;
}

.redeemed-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.redeemed-card {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  border-radius: 15px;
  padding: 25px;
  border: 2px solid #4CAF50;
  transition: all 0.3s ease;
}

.redeemed-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(76, 175, 80, 0.2);
}

.redeemed-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.redeemed-header h4 {
  margin: 0;
  color: #2e7d32;
  font-size: 1.2em;
}

.redeem-date {
  color: #555;
  font-size: 0.9em;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px dashed #4CAF50;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-icon {
  font-size: 4em;
  margin-bottom: 20px;
}

.empty-state h4 {
  margin: 20px 0 10px 0;
  color: #666;
  font-size: 1.3em;
}

.empty-state p {
  color: #999;
  font-size: 1em;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .points-display {
    grid-template-columns: 1fr;
  }
  
  .rewards-grid,
  .redeemed-grid {
    grid-template-columns: 1fr;
  }
  
  .reward-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .cost-number {
    font-size: 1.5em;
  }
}
</style>
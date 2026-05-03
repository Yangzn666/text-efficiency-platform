<template>
  <div class="reward-shop">
    <!-- 可兑换奖励 -->
    <div class="available-rewards">
      <h3>🏪 可兑换奖励</h3>
      <div class="rewards-grid">
        <div 
          v-for="reward in psychologyStore.availableRewards" 
          :key="reward.id"
          class="reward-card"
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
          >
            立即兑换
          </el-button>
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
            <el-tag type="success">已兑换</el-tag>
          </div>
          
          <p class="reward-description">{{ reward.description }}</p>
          
          <div class="redeem-date">
            兑换时间: {{ formatDate(reward.redeemedAt!) }}
          </div>
        </div>
      </div>
      
      <div v-if="redeemedRewards.length === 0" class="empty-state">
        <el-icon size="60" color="#999"><Gift /></el-icon>
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

const redeemReward = async (rewardId: string) => {
  redeemingReward.value = rewardId
  try {
    const success = psychologyStore.redeemReward(rewardId)
    if (success) {
      ElMessage.success('兑换成功！')
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
  border-color: #667eea;
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.2);
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
  background: #f8f9ff;
  border-radius: 15px;
  padding: 25px;
  border: 1px solid #e0e7ff;
}

.redeemed-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.redeemed-header h4 {
  margin: 0;
  color: #333;
  font-size: 1.2em;
}

.redeem-date {
  color: #999;
  font-size: 0.9em;
  margin-top: 15px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-state h4 {
  margin: 20px 0 10px 0;
  color: #666;
}

/* 响应式设计 */
@media (max-width: 768px) {
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
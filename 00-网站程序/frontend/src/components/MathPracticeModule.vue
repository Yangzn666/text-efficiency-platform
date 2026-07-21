<template>
  <div class="math-practice-module">
    <!-- 练习模块导航 -->
    <div class="practice-navigation" v-if="!currentSubModule">
      <div class="module-header">
        <h2>📚 数学练习中心</h2>
        <p>系统化的数学专项练习平台</p>
      </div>
      
      <div class="submodules-grid">
        <!-- 高等数学练习 -->
        <div 
          class="submodule-card"
          @click="selectSubModule('advancedMath')"
        >
          <div class="card-icon">∫</div>
          <div class="card-content">
            <h3>高等数学练习</h3>
            <p>函数、极限、连续、一元函数微积分学、多元函数微积分学、无穷级数、常微分方程</p>
            <div class="card-stats">
              <div class="stat-item">
                <span class="stat-number">{{ advancedMathStats.total }}</span>
                <span class="stat-label">总题数</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ advancedMathStats.completed }}</span>
                <span class="stat-label">已完成</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ advancedMathStats.accuracy }}%</span>
                <span class="stat-label">准确率</span>
              </div>
            </div>
          </div>
          <div class="card-action">
            <el-button type="primary" size="large">
              开始练习
              <el-icon class="arrow-icon"><ArrowRight /></el-icon>
            </el-button>
          </div>
        </div>
        
        <!-- 线性代数练习 -->
        <div 
          class="submodule-card"
          @click="selectSubModule('linearAlgebra')"
        >
          <div class="card-icon">📐</div>
          <div class="card-content">
            <h3>线性代数练习</h3>
            <p>行列式、矩阵、向量、线性方程组、矩阵的特征值和特征向量、二次型</p>
            <div class="card-stats">
              <div class="stat-item">
                <span class="stat-number">{{ linearAlgebraStats.total }}</span>
                <span class="stat-label">总题数</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ linearAlgebraStats.completed }}</span>
                <span class="stat-label">已完成</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ linearAlgebraStats.accuracy }}%</span>
                <span class="stat-label">准确率</span>
              </div>
            </div>
          </div>
          <div class="card-action">
            <el-button type="primary" size="large">
              开始练习
              <el-icon class="arrow-icon"><ArrowRight /></el-icon>
            </el-button>
          </div>
        </div>
        
        <!-- 概率论与数理统计练习 -->
        <div 
          class="submodule-card"
          @click="selectSubModule('probability')"
        >
          <div class="card-icon">📊</div>
          <div class="card-content">
            <h3>概率论与数理统计</h3>
            <p>随机事件和概率、随机变量及其分布、多维随机变量及其分布、随机变量的数字特征、大数定律和中心极限定理、数理统计的基本概念、参数估计、假设检验</p>
            <div class="card-stats">
              <div class="stat-item">
                <span class="stat-number">--</span>
                <span class="stat-label">总题数</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">--</span>
                <span class="stat-label">已完成</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">--%</span>
                <span class="stat-label">准确率</span>
              </div>
            </div>
          </div>
          <div class="card-action">
            <el-button type="primary" size="large" disabled>
              即将开放
            </el-button>
          </div>
        </div>
        
        <!-- 综合模拟练习 -->
        <div 
          class="submodule-card"
          @click="selectSubModule('comprehensive')"
        >
          <div class="card-icon">🎯</div>
          <div class="card-content">
            <h3>综合模拟练习</h3>
            <p>考研真题模拟、限时训练、全真考场体验</p>
            <div class="card-stats">
              <div class="stat-item">
                <span class="stat-number">--</span>
                <span class="stat-label">套卷数</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">--</span>
                <span class="stat-label">已完成</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">--分</span>
                <span class="stat-label">平均分</span>
              </div>
            </div>
          </div>
          <div class="card-action">
            <el-button type="primary" size="large" disabled>
              即将开放
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 子模块内容区 -->
    <div class="submodule-content" v-else>
      <!-- 返回按钮 -->
      <div class="back-navigation">
        <el-button @click="backToMain" type="primary" plain>
          <el-icon><ArrowLeft /></el-icon>
          返回练习中心
        </el-button>
        <div class="current-submodule">
          <span class="submodule-icon">{{ getCurrentSubmoduleIcon() }}</span>
          <span class="submodule-name">{{ getCurrentSubmoduleName() }}</span>
        </div>
      </div>

      <!-- 线性代数练习子模块 -->
      <LinearAlgebraPractice 
        v-if="currentSubModule === 'linearAlgebra'"
        @exit="backToMain"
      />
      
      <!-- 高等数学练习子模块 -->
      <AdvancedMathExercises 
        v-else-if="currentSubModule === 'advancedMath'"
        @exit="backToMain"
      />

      <!-- 其他子模块占位符 -->
      <div v-else class="coming-soon">
        <div class="coming-soon-content">
          <el-icon size="80" color="#999"><Clock /></el-icon>
          <h3>{{ getCurrentSubmoduleName() }}</h3>
          <p>功能正在紧张开发中，敬请期待！</p>
          <el-button @click="backToMain" type="primary">
            返回练习中心
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import LinearAlgebraPractice from './LinearAlgebraPractice.vue'
import AdvancedMathExercises from './AdvancedMathExercises.vue'
import { useLinearAlgebraStore } from '@/stores/linearAlgebra'

const linearAlgebraStore = useLinearAlgebraStore()

// 状态
const currentSubModule = ref<string | null>(null)

// 计算属性
const linearAlgebraStats = computed(() => {
  const total = linearAlgebraStore.problems.length
  const completed = linearAlgebraStore.problems.filter(p => p.completed).length
  const accuracy = total > 0 ? Math.round((completed / total) * 100) : 0
  
  return {
    total,
    completed,
    accuracy
  }
})

const advancedMathStats = computed(() => {
  // 模拟高等数学统计数据
  return {
    total: 57,
    completed: 12,
    accuracy: 75
  }
})

// 方法
const selectSubModule = (moduleId: string) => {
  currentSubModule.value = moduleId
}

const backToMain = () => {
  currentSubModule.value = null
}

const getCurrentSubmoduleIcon = () => {
  const icons: Record<string, string> = {
    'linearAlgebra': '📐',
    'advancedMath': '∫',
    'probability': '📊',
    'comprehensive': '🎯'
  }
  return icons[currentSubModule.value || ''] || '📚'
}

const getCurrentSubmoduleName = () => {
  const names: Record<string, string> = {
    'advancedMath': '高等数学练习',
    'linearAlgebra': '线性代数练习',
    'probability': '概率论与数理统计',
    'comprehensive': '综合模拟练习'
  }
  return names[currentSubModule.value || ''] || '未知模块'
}

onMounted(() => {
  linearAlgebraStore.loadProblems()
})
</script>

<style scoped>
.math-practice-module {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

/* 主模块导航样式 */
.module-header {
  text-align: center;
  margin-bottom: 40px;
}

.module-header h2 {
  color: #333;
  margin-bottom: 15px;
  font-size: 2.2em;
}

.module-header p {
  color: #666;
  font-size: 1.2em;
}

.submodules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 25px;
}

.submodule-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  border: 2px solid transparent;
}

.submodule-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  border-color: #ffc53d;
}

.card-icon {
  font-size: 3em;
  text-align: center;
  margin-bottom: 20px;
}

.card-content {
  flex: 1;
  margin-bottom: 25px;
}

.card-content h3 {
  color: #333;
  margin: 0 0 15px 0;
  font-size: 1.4em;
}

.card-content p {
  color: #666;
  line-height: 1.6;
  margin: 0 0 20px 0;
}

.card-stats {
  display: flex;
  justify-content: space-between;
  gap: 15px;
}

.stat-item {
  text-align: center;
  flex: 1;
}

.stat-number {
  display: block;
  font-size: 1.4em;
  font-weight: 700;
  color: #16345c;
}

.stat-label {
  font-size: 0.85em;
  color: #999;
}

.card-action {
  text-align: center;
}

.arrow-icon {
  margin-left: 8px;
  transition: transform 0.2s ease;
}

.submodule-card:hover .arrow-icon {
  transform: translateX(5px);
}

/* 子模块内容区样式 */
.back-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
}

.current-submodule {
  display: flex;
  align-items: center;
  gap: 15px;
}

.submodule-icon {
  font-size: 2em;
}

.submodule-name {
  font-size: 1.5em;
  font-weight: 600;
  color: #333;
}

.coming-soon {
  background: white;
  border-radius: 20px;
  padding: 60px 40px;
  text-align: center;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
}

.coming-soon-content {
  max-width: 500px;
  margin: 0 auto;
}

.coming-soon h3 {
  color: #333;
  margin: 25px 0 15px 0;
  font-size: 2em;
}

.coming-soon p {
  color: #666;
  font-size: 1.2em;
  margin-bottom: 30px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .math-practice-module {
    padding: 15px;
  }
  
  .submodules-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .submodule-card {
    padding: 25px;
  }
  
  .card-stats {
    flex-direction: column;
    gap: 10px;
  }
  
  .back-navigation {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }
  
  .module-header h2 {
    font-size: 1.8em;
  }
}
</style>
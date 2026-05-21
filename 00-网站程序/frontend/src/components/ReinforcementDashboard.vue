<template>
  <div class="reinforcement-dashboard">
    <!-- 导航菜单 -->
    <MathReinforcementNav />
    
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>📊 数学强化学习仪表盘</h1>
      <p class="subtitle">精准追踪 · 智能复习 · 高效提升</p>
    </div>

    <!-- 总体进度概览 -->
    <div class="progress-overview">
      <!-- 高等数学 -->
      <div class="subject-progress-card">
        <div class="subject-icon math">数</div>
        <div class="subject-info">
          <h3>高等数学</h3>
          <p class="teacher-name">武忠祥强化 · 46学时</p>
          <el-progress 
            :percentage="mathProgress" 
            :color="getProgressColor(mathProgress)"
            :stroke-width="12"
          />
          <p class="progress-text">正在学习第一章 (10学时)</p>
          <p class="progress-detail">1000题B组: 未开始</p>
        </div>
      </div>

      <!-- 线性代数 -->
      <div class="subject-progress-card">
        <div class="subject-icon linear">线</div>
        <div class="subject-info">
          <h3>线性代数</h3>
          <p class="teacher-name">待确认教师</p>
          <el-progress 
            :percentage="linearProgress" 
            :color="getProgressColor(linearProgress)"
            :stroke-width="12"
          />
          <p class="progress-text">待补充进度</p>
          <p class="progress-detail">1000题B组: 未开始</p>
        </div>
      </div>

      <!-- 概率论 -->
      <div class="subject-progress-card">
        <div class="subject-icon prob">概</div>
        <div class="subject-info">
          <h3>概率论</h3>
          <p class="teacher-name">方浩强化 · 21学时</p>
          <el-progress 
            :percentage="probProgress" 
            :color="getProgressColor(probProgress)"
            :stroke-width="12"
          />
          <p class="progress-text">已完成 9/21 学时 (约2.6讲)</p>
          <p class="progress-detail">1000题B组: 未开始</p>
        </div>
      </div>
    </div>

    <!-- 今日任务 -->
    <div class="today-tasks-section">
      <div class="section-header">
        <h2>📅 今日学习任务</h2>
        <el-button type="primary" size="small" @click="refreshTodayPlan">
          <el-icon><Refresh /></el-icon>
          刷新计划
        </el-button>
      </div>

      <div v-if="todayPlan.tasks.length === 0" class="empty-state">
        <el-empty description="今日暂无任务,点击刷新生成计划" />
      </div>

      <div v-else class="tasks-list">
        <div 
          v-for="task in todayPlan.tasks" 
          :key="task.id"
          class="task-item"
          :class="{ completed: task.completed }"
        >
          <div class="task-checkbox">
            <el-checkbox 
              v-model="task.completed" 
              @change="onTaskComplete(task)"
            />
          </div>
          <div class="task-content">
            <div class="task-title">{{ task.title }}</div>
            <div class="task-meta">
              <span class="task-type">{{ getTaskTypeLabel(task.type) }}</span>
              <span class="task-time">预计 {{ task.estimatedTime }} 分钟</span>
              <span v-if="task.problemCount" class="task-problems">共 {{ task.problemCount }} 道题</span>
            </div>
          </div>
          <div class="task-action">
            <el-button size="small" @click="startTask(task)">
              开始
            </el-button>
          </div>
        </div>
      </div>

      <!-- 今日统计 -->
      <div class="today-stats">
        <div class="stat-item">
          <span class="stat-label">目标时长:</span>
          <span class="stat-value">{{ todayPlan.targetStudyTime }} 分钟</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">已完成:</span>
          <span class="stat-value">{{ completedTasksCount }} / {{ todayPlan.tasks.length }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">完成率:</span>
          <span class="stat-value">{{ completionRate }}%</span>
        </div>
      </div>
    </div>

    <!-- 智能提醒区 -->
    <div class="alerts-section">
      <div class="alert-card" v-if="store.todayReviews.length > 0">
        <div class="alert-icon warning">⚠️</div>
        <div class="alert-content">
          <h4>需要复习的知识点</h4>
          <p>{{ store.todayReviews.length }} 个知识点到期需要复习</p>
          <el-button size="small" type="warning" @click="goToReview">
            立即复习
          </el-button>
        </div>
      </div>

      <div class="alert-card" v-if="store.needsSpecialTrainingTopics.length > 0">
        <div class="alert-icon info">💡</div>
        <div class="alert-content">
          <h4>建议专题突破</h4>
          <p>{{ store.needsSpecialTrainingTopics.length }} 个知识点掌握度较低</p>
          <el-button size="small" type="primary" @click="goToSpecialTraining">
            专题突破
          </el-button>
        </div>
      </div>
    </div>

    <!-- 总体统计 -->
    <div class="statistics-section">
      <h2>📈 学习统计</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number">{{ store.statistics.totalTopics }}</div>
          <div class="stat-label">知识点总数</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ store.statistics.masteredTopics }}</div>
          <div class="stat-label">已掌握</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ Math.round(store.statistics.totalLectureTime / 60) }}h</div>
          <div class="stat-label">听课总时长</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ Math.round(store.statistics.totalPracticeTime / 60) }}h</div>
          <div class="stat-label">做题总时长</div>
        </div>
        <div class="stat-card highlight">
          <div class="stat-number">1:{{ store.statistics.lectureToPracticeRatio }}</div>
          <div class="stat-label">听课:做题比例</div>
          <p class="ratio-tip" :class="{ good: isGoodRatio(store.statistics.lectureToPracticeRatio) }">
            {{ isGoodRatio(store.statistics.lectureToPracticeRatio) ? '✅ 合理' : '⚠️ 需调整' }}
          </p>
        </div>
      </div>
    </div>

    <!-- 快速操作 -->
    <div class="quick-actions">
      <el-button type="primary" size="large" @click="goToTopics">
        <el-icon><Document /></el-icon>
        知识点管理
      </el-button>
      <el-button type="success" size="large" @click="goToSpecialTraining">
        <el-icon><Document /></el-icon>
        专题突破
      </el-button>
      <el-button type="info" size="large" @click="generateWeeklyReport">
        <el-icon><DataAnalysis /></el-icon>
        生成周报
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Refresh, Document, CircleClose, DataAnalysis } from '@element-plus/icons-vue'
import { useMathReinforcementStore } from '@/stores/mathReinforcement'
import type { DailyTask } from '@/stores/mathReinforcement'
import MathReinforcementNav from './MathReinforcementNav.vue'

const router = useRouter()
const store = useMathReinforcementStore()

// 根据真实课程进度计算
const mathProgress = ref(0) // 高数第一章正在听，0%
const linearProgress = ref(0) // 待补充
const probProgress = ref(Math.round(9 / 21 * 100)) // 概率论 9/21 = 43%

const todayPlan = ref(store.getTodayPlan())

// 计算属性
const completedTasksCount = computed(() => {
  return todayPlan.value.tasks.filter(t => t.completed).length
})

const completionRate = computed(() => {
  if (todayPlan.value.tasks.length === 0) return 0
  return Math.round((completedTasksCount.value / todayPlan.value.tasks.length) * 100)
})

// 方法
const getProgressColor = (progress: number) => {
  if (progress >= 80) return '#67C23A'
  if (progress >= 60) return '#E6A23C'
  return '#F56C6C'
}

const getTaskTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    lecture: '📺 听课',
    practice: '✍️ 做题',
    review: '🔄 复习',
    special_training: '🎯 专题'
  }
  return labels[type] || type
}

const isGoodRatio = (ratio: string) => {
  const num = parseFloat(ratio)
  return num >= 0.25 && num <= 0.5 // 1:2 到 1:4 之间
}

const refreshTodayPlan = () => {
  todayPlan.value = store.generateTodayPlan()
  store.saveDailyPlan(todayPlan.value)
  ElMessage.success('今日计划已刷新')
}

const onTaskComplete = (task: DailyTask) => {
  if (task.completed) {
    task.actualTime = task.estimatedTime
    ElMessage.success('任务完成!继续保持!')
  }
  store.saveDailyPlan(todayPlan.value)
}

const startTask = (task: DailyTask) => {
  if (task.topicId) {
    router.push(`/math/reinforcement/topics/${task.topicId}`)
  } else if (task.type === 'wrong_review') {
    router.push('/math/reinforcement/wrong-book')
  } else if (task.type === 'special_training') {
    router.push('/math/reinforcement/special-training')
  }
}

const goToReview = () => {
  router.push('/math/reinforcement/topics?filter=review')
}

const goToSpecialTraining = () => {
  router.push('/math/reinforcement/special-training')
}

const goToTopics = () => {
  router.push('/math/reinforcement/topics')
}

const generateWeeklyReport = () => {
  ElMessage.info('周报生成功能开发中...')
}

onMounted(() => {
  console.log('强化学习仪表盘已加载')
  
  // 初始化第一章函数知识点(如果不存在)
  if (!localStorage.getItem('mathReinforcement_topics')) {
    initFirstChapterTopics()
  }
})

// 初始化第一章函数部分知识点
const initFirstChapterTopics = () => {
  const topics = [
    // ==================== 第一章 函数 极限 连续 ====================
    {
      id: 'ch1_func_concept',
      subject: '高等数学',
      chapter: '第一章 函数 极限 连续',
      topicName: '函数概念及常见函数',
      questionTypes: [
        { type: '求定义域', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '求复合函数', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '判断初等函数', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '求反函数', solvedCount: 0, correctCount: 0, wrongProblems: [] }
      ],
      masteryLevel: 0,
      lectureTime: 0,
      practiceTime: 0,
      problemCount: 0,
      correctCount: 0,
      nextReviewDate: new Date().toISOString().split('T')[0],
      needsSpecialTraining: false,
      isTextbookExample: false,
      reviewCount: 0,
      notes: `# 一、函数的概念

## 1. 函数的两个基本要素
- **定义域 D**: 自变量 x 的取值范围
- **对应法则 f**: x 与 y 的对应关系
- **注意**: 两个函数相同 ⇔ 定义域相同 且 对应法则相同

## 2. 常见函数类型
### (1) 基本初等函数
- 幂函数: y = x^α
- 指数函数: y = a^x (a>0, a≠1)
- 对数函数: y = log_a x
- 三角函数: sinx, cosx, tanx, cotx
- 反三角函数: arcsinx, arccosx, arctanx

### (2) 初等函数
- **定义**: 由基本初等函数经过**有限次**四则运算和复合得到的函数
- **特点**: 能用**一个解析式**表示
- **例子**: 
  ✓ y = sin(x²) + e^x (初等)
  ✓ y = |x| = √(x²) (初等)
  ✗ 分段函数一般不是初等函数

## 3. 复合函数
- **定义**: y = f[g(x)]
- **复合的关键**: **内层函数的值域 ⊆ 外层函数的定义域**
- **分解方法**: 从外到内逐层分解
- **例题**: y = sin(ln(x²+1))
  分解: y = sin u, u = ln v, v = x²+1

## 4. 反函数
- **存在条件**: 函数必须**严格单调**(一一对应)
- **核心**: 每个 y 值对应**唯一**的 x 值
- **求法**: 
  1. 从 y = f(x) 解出 x = f⁻¹(y)
  2. 交换 x, y 得 y = f⁻¹(x)
- **性质**:
  - 图像关于 y = x 对称
  - f[f⁻¹(x)] = x
  - 单调性相同`,
      createdAt: new Date().toISOString()
    },
    {
      id: 'ch1_func_properties',
      subject: '高等数学',
      chapter: '第一章 函数 极限 连续',
      topicName: '函数性态(单调、奇偶、周期、有界)',
      questionTypes: [
        { type: '判断单调性', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '判断奇偶性', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '判断周期性', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '判断有界性', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '利用性态简化计算', solvedCount: 0, correctCount: 0, wrongProblems: [] }
      ],
      masteryLevel: 0,
      lectureTime: 0,
      practiceTime: 0,
      problemCount: 0,
      correctCount: 0,
      nextReviewDate: new Date().toISOString().split('T')[0],
      needsSpecialTraining: false,
      isTextbookExample: false,
      reviewCount: 0,
      notes: `# 函数四大性态

## 一、单调性
**定义**: 
- 增函数: x₁ < x₂ ⇒ f(x₁) < f(x₂)
- 减函数: x₁ < x₂ ⇒ f(x₁) > f(x₂)

**判定方法**:
1. **定义法**: 比较 f(x₁) 与 f(x₂)
2. **导数法**(常用): 
   - f'(x) > 0 ⇒ 单调递增
   - f'(x) < 0 ⇒ 单调递减

**性质**:
- 增+增=增, 减+减=减
- 增×增(正) = 增
- 反函数单调性相同

## 二、奇偶性
**定义**:
- 奇函数: f(-x) = -f(x), 图像关于原点对称
- 偶函数: f(-x) = f(x), 图像关于y轴对称

**判定步骤**:
1. **先看定义域**: 必须关于原点对称!
2. 计算 f(-x)
3. 比较 f(-x) 与 f(x)、-f(x)

**常见奇偶函数**:
- 奇: sinx, tanx, x, x³, arcsinx, arctanx
- 偶: cosx, x², |x|, arccosx

**性质**:
- 奇+奇=奇, 偶+偶=偶
- 奇×奇=偶, 偶×偶=偶, 奇×偶=奇
- 奇函数的原函数是偶函数
- 偶函数的原函数不一定是奇函数

## 三、周期性
**定义**: f(x+T) = f(x), T为周期

**常见周期**:
- sinx, cosx: T = 2π
- tanx, cotx: T = π
- |sinx|, |cosx|: T = π
- sin²x, cos²x: T = π

**性质**:
- 若T是周期,则nT也是周期
- 两个周期函数之和不一定周期
- 周期函数在任意长度为T的区间上积分相等

## 四、有界性
**定义**: M>0, 使 |f(x)| ≤ M

**判定方法**:
1. **闭区间上连续函数**必有界(最值定理)
2. **极限存在**的函数在去心邻域内有界
3. **单调有界**数列必收敛

**常见有界函数**:
- |sinx| ≤ 1, |cosx| ≤ 1
- |arcsinx| ≤ π/2, |arccosx| ≤ π
- |arctanx| < π/2

**无界函数**:
- tanx (在π/2附近)
- 1/x (在0附近)
- e^x (x→+∞)`,
      createdAt: new Date().toISOString()
    },
    {
      id: 'ch1_limit_calculation',
      subject: '高等数学',
      chapter: '第一章 函数 极限 连续',
      topicName: '极限计算方法',
      questionTypes: [
        { type: '代入法求极限', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '因式分解消零因子', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '有理化求极限', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '等价无穷小替换', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '洛必达法则', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '泰勒公式求极限', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '夹逼准则', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '单调有界准则', solvedCount: 0, correctCount: 0, wrongProblems: [] }
      ],
      masteryLevel: 0,
      lectureTime: 0,
      practiceTime: 0,
      problemCount: 0,
      correctCount: 0,
      nextReviewDate: new Date().toISOString().split('T')[0],
      needsSpecialTraining: false,
      isTextbookExample: false,
      reviewCount: 0,
      notes: `# 极限计算方法汇总

## 一、基本方法
1. **代入法**: 直接代入,若不是未定式即可得结果
2. **因式分解**: 消去零因子后代入
3. **有理化**: 分子或分母有根号时使用
4. **等价无穷小**: x→0时, sinx~x, tanx~x, 1-cosx~x²/2, e^x-1~x, ln(1+x)~x

## 二、重要方法
5. **洛必达法则**: 0/0型或∞/∞型,上下分别求导
6. **泰勒公式**: 复杂函数展开成多项式
7. **夹逼准则**: 找到上下界,证明极限存在
8. **单调有界准则**: 证明数列收敛`,
      createdAt: new Date().toISOString()
    },
    {
      id: 'ch1_continuity',
      subject: '高等数学',
      chapter: '第一章 函数 极限 连续',
      topicName: '连续性与间断点',
      questionTypes: [
        { type: '判断连续性', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '求间断点并分类', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '讨论参数使函数连续', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '闭区间上连续函数性质', solvedCount: 0, correctCount: 0, wrongProblems: [] }
      ],
      masteryLevel: 0,
      lectureTime: 0,
      practiceTime: 0,
      problemCount: 0,
      correctCount: 0,
      nextReviewDate: new Date().toISOString().split('T')[0],
      needsSpecialTraining: false,
      isTextbookExample: false,
      reviewCount: 0,
      notes: `# 连续性与间断点

## 一、连续的定义
lim(x→x₀) f(x) = f(x₀)

**三个条件**:
1. f(x)在x₀处有定义
2. lim(x→x₀) f(x) 存在
3. 极限值等于函数值

## 二、间断点分类
**第一类间断点**(左右极限都存在):
- 可去间断点: 左右极限相等
- 跳跃间断点: 左右极限不相等

**第二类间断点**(至少一个极限不存在):
- 无穷间断点
- 振荡间断点

## 三、闭区间上连续函数性质
1. **最值定理**: 必有最大值和最小值
2. **介值定理**: 介于f(a)和f(b)之间的任何值都能取到
3. **零点定理**: f(a)·f(b)<0,则存在ξ使f(ξ)=0`,
      createdAt: new Date().toISOString()
    },
    
    // ==================== 第二章 一元函数微分学的概念与计算 ====================
    {
      id: 'ch2_derivative_concept',
      subject: '高等数学',
      chapter: '第二章 一元函数微分学的概念与计算',
      topicName: '导数与微分的概念',
      questionTypes: [
        { type: '用定义求导数', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '判断可导性', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '导数的几何意义', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '导数的物理意义', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '微分的概念与计算', solvedCount: 0, correctCount: 0, wrongProblems: [] }
      ],
      masteryLevel: 0,
      lectureTime: 0,
      practiceTime: 0,
      problemCount: 0,
      correctCount: 0,
      nextReviewDate: new Date().toISOString().split('T')[0],
      needsSpecialTraining: false,
      isTextbookExample: false,
      reviewCount: 0,
      notes: `# 导数与微分的概念

## 一、导数的定义
f'(x₀) = lim(Δx→0) [f(x₀+Δx) - f(x₀)] / Δx

**几何意义**: 切线斜率
**物理意义**: 瞬时变化率

## 二、可导与连续的关系
- 可导 ⇒ 连续
- 连续 ⇏ 可导 (如|x|在x=0处)

## 三、微分
dy = f'(x)dx

**几何意义**: 切线纵坐标的增量
**近似计算**: f(x₀+Δx) ≈ f(x₀) + f'(x₀)Δx`,
      createdAt: new Date().toISOString()
    },
    {
      id: 'ch2_derivative_calculation',
      subject: '高等数学',
      chapter: '第二章 一元函数微分学的概念与计算',
      topicName: '导数计算方法',
      questionTypes: [
        { type: '基本求导公式', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '四则运算求导', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '复合函数求导(链式法则)', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '隐函数求导', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '参数方程求导', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '对数求导法', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '高阶导数', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '分段函数求导', solvedCount: 0, correctCount: 0, wrongProblems: [] }
      ],
      masteryLevel: 0,
      lectureTime: 0,
      practiceTime: 0,
      problemCount: 0,
      correctCount: 0,
      nextReviewDate: new Date().toISOString().split('T')[0],
      needsSpecialTraining: false,
      isTextbookExample: false,
      reviewCount: 0,
      notes: `# 导数计算方法

## 一、基本求导公式
(x^n)' = nx^(n-1)
(sinx)' = cosx, (cosx)' = -sinx
(e^x)' = e^x, (a^x)' = a^x lna
(lnx)' = 1/x, (log_a x)' = 1/(xlna)
(arcsinx)' = 1/√(1-x²)
(arctanx)' = 1/(1+x²)

## 二、求导法则
1. **四则运算**: (u±v)' = u'±v', (uv)' = u'v+uv', (u/v)' = (u'v-uv')/v²
2. **链式法则**: [f(g(x))]' = f'(g(x))·g'(x)
3. **隐函数求导**: 方程两边对x求导
4. **参数方程**: dy/dx = (dy/dt)/(dx/dt)
5. **对数求导法**: 先取对数再求导,适合幂指函数
6. **高阶导数**: 反复求导,找规律`,
      createdAt: new Date().toISOString()
    },
    
    // ==================== 第三章 中值定理及导数应用 ====================
    {
      id: 'ch3_mean_value_theorem',
      subject: '高等数学',
      chapter: '第三章 中值定理及导数应用',
      topicName: '微分中值定理',
      questionTypes: [
        { type: '罗尔定理证明', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '拉格朗日中值定理证明', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '柯西中值定理证明', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '泰勒中值定理证明', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '构造辅助函数', solvedCount: 0, correctCount: 0, wrongProblems: [] }
      ],
      masteryLevel: 0,
      lectureTime: 0,
      practiceTime: 0,
      problemCount: 0,
      correctCount: 0,
      nextReviewDate: new Date().toISOString().split('T')[0],
      needsSpecialTraining: false,
      isTextbookExample: false,
      reviewCount: 0,
      notes: `# 微分中值定理

## 一、罗尔定理
条件: f在[a,b]连续,(a,b)可导,f(a)=f(b)
结论: 存在ξ∈(a,b),使f'(ξ)=0

## 二、拉格朗日中值定理
条件: f在[a,b]连续,(a,b)可导
结论: 存在ξ∈(a,b),使f'(ξ)=[f(b)-f(a)]/(b-a)

## 三、柯西中值定理
条件: f,g在[a,b]连续,(a,b)可导,g'(x)≠0
结论: 存在ξ∈(a,b),使[f(b)-f(a)]/[g(b)-g(a)]=f'(ξ)/g'(ξ)

## 四、泰勒中值定理
f(x) = f(x₀) + f'(x₀)(x-x₀) + ... + f^(n)(x₀)(x-x₀)^n/n! + R_n(x)

**关键**: 构造合适的辅助函数`,
      createdAt: new Date().toISOString()
    },
    {
      id: 'ch3_derivative_application',
      subject: '高等数学',
      chapter: '第三章 中值定理及导数应用',
      topicName: '导数的应用',
      questionTypes: [
        { type: '求单调区间', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '求极值', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '求最值', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '判断凹凸性', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '求拐点', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '求渐近线', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '作函数图形', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '证明不等式', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '求方程根的个数', solvedCount: 0, correctCount: 0, wrongProblems: [] }
      ],
      masteryLevel: 0,
      lectureTime: 0,
      practiceTime: 0,
      problemCount: 0,
      correctCount: 0,
      nextReviewDate: new Date().toISOString().split('T')[0],
      needsSpecialTraining: false,
      isTextbookExample: false,
      reviewCount: 0,
      notes: `# 导数的应用

## 一、单调性与极值
- f'(x)>0 ⇒ 递增; f'(x)<0 ⇒ 递减
- 极值点: f'(x)=0或f'(x)不存在
- 判别法: 一阶导数变号法,二阶导数法

## 二、凹凸性与拐点
- f''(x)>0 ⇒ 凹; f''(x)<0 ⇒ 凸
- 拐点: f''(x)=0且两侧异号

## 三、渐近线
- 水平: lim(x→∞) f(x) = A
- 垂直: lim(x→x₀) f(x) = ∞
- 斜: y=kx+b, k=lim f(x)/x, b=lim[f(x)-kx]

## 四、应用
1. **证明不等式**: 构造函数,利用单调性或最值
2. **求方程根**: 利用零点定理+单调性`,
      createdAt: new Date().toISOString()
    },
    
    // ==================== 第四章 一元函数积分学的概念与计算 ====================
    {
      id: 'ch4_integral_concept',
      subject: '高等数学',
      chapter: '第四章 一元函数积分学的概念与计算',
      topicName: '不定积分的概念与性质',
      questionTypes: [
        { type: '原函数与不定积分的概念', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '基本积分公式', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '不定积分的性质', solvedCount: 0, correctCount: 0, wrongProblems: [] }
      ],
      masteryLevel: 0,
      lectureTime: 0,
      practiceTime: 0,
      problemCount: 0,
      correctCount: 0,
      nextReviewDate: new Date().toISOString().split('T')[0],
      needsSpecialTraining: false,
      isTextbookExample: false,
      reviewCount: 0,
      notes: `# 不定积分

## 一、基本概念
- **原函数**: F'(x) = f(x),则F(x)是f(x)的原函数
- **不定积分**: ∫f(x)dx = F(x) + C

## 二、基本积分公式
∫x^n dx = x^(n+1)/(n+1) + C (n≠-1)
∫1/x dx = ln|x| + C
∫e^x dx = e^x + C
∫a^x dx = a^x/lna + C
∫sinx dx = -cosx + C
∫cosx dx = sinx + C
∫sec²x dx = tanx + C
∫csc²x dx = -cotx + C
∫1/(1+x²) dx = arctanx + C
∫1/√(1-x²) dx = arcsinx + C`,
      createdAt: new Date().toISOString()
    },
    {
      id: 'ch4_integral_calculation',
      subject: '高等数学',
      chapter: '第四章 一元函数积分学的概念与计算',
      topicName: '积分计算方法',
      questionTypes: [
        { type: '第一类换元法(凑微分)', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '第二类换元法(三角代换)', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '分部积分法', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '有理函数积分', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '三角函数积分', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '简单无理函数积分', solvedCount: 0, correctCount: 0, wrongProblems: [] }
      ],
      masteryLevel: 0,
      lectureTime: 0,
      practiceTime: 0,
      problemCount: 0,
      correctCount: 0,
      nextReviewDate: new Date().toISOString().split('T')[0],
      needsSpecialTraining: false,
      isTextbookExample: false,
      reviewCount: 0,
      notes: `# 积分计算方法

## 一、换元积分法
1. **第一类(凑微分)**: ∫f[g(x)]g'(x)dx = ∫f(u)du
   - 关键: 识别被积函数的结构
   
2. **第二类(三角代换)**:
   - √(a²-x²): 令x=asin t
   - √(a²+x²): 令x=atan t
   - √(x²-a²): 令x=asec t

## 二、分部积分法
∫udv = uv - ∫vdu

**选u原则**(LIATE):
L-对数函数, I-反三角函数, A-代数函数, T-三角函数, E-指数函数

## 三、特殊函数积分
1. **有理函数**: 部分分式分解
2. **三角函数**: 万能代换或倍角公式
3. **无理函数**: 根式代换`,
      createdAt: new Date().toISOString()
    },
    {
      id: 'ch4_definite_integral',
      subject: '高等数学',
      chapter: '第四章 一元函数积分学的概念与计算',
      topicName: '定积分的概念与性质',
      questionTypes: [
        { type: '定积分的定义与几何意义', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '定积分的性质', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '变上限积分函数', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '牛顿-莱布尼茨公式', solvedCount: 0, correctCount: 0, wrongProblems: [] }
      ],
      masteryLevel: 0,
      lectureTime: 0,
      practiceTime: 0,
      problemCount: 0,
      correctCount: 0,
      nextReviewDate: new Date().toISOString().split('T')[0],
      needsSpecialTraining: false,
      isTextbookExample: false,
      reviewCount: 0,
      notes: `# 定积分

## 一、定义
∫[a,b] f(x)dx = lim(n→∞) Σf(ξᵢ)Δxᵢ

**几何意义**: 曲边梯形面积(带符号)

## 二、重要性质
1. **线性性**: ∫(af+bg) = a∫f + b∫g
2. **区间可加性**: ∫[a,c] = ∫[a,b] + ∫[b,c]
3. **保号性**: f≥0 ⇒ ∫f≥0
4. **估值定理**: m(b-a) ≤ ∫f ≤ M(b-a)
5. **积分中值定理**: ∫[a,b]f = f(ξ)(b-a)

## 三、变上限积分
Φ(x) = ∫[a,x] f(t)dt

**重要结论**: Φ'(x) = f(x)

## 四、牛顿-莱布尼茨公式
∫[a,b] f(x)dx = F(b) - F(a)`,
      createdAt: new Date().toISOString()
    },
    
    // ==================== 第五章 一元函数积分学的应用 ====================
    {
      id: 'ch5_integral_application',
      subject: '高等数学',
      chapter: '第五章 一元函数积分学的应用',
      topicName: '定积分的几何应用',
      questionTypes: [
        { type: '求平面图形面积', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '求旋转体体积', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '求曲线弧长', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '求旋转曲面面积', solvedCount: 0, correctCount: 0, wrongProblems: [] }
      ],
      masteryLevel: 0,
      lectureTime: 0,
      practiceTime: 0,
      problemCount: 0,
      correctCount: 0,
      nextReviewDate: new Date().toISOString().split('T')[0],
      needsSpecialTraining: false,
      isTextbookExample: false,
      reviewCount: 0,
      notes: `# 定积分的几何应用

## 一、平面图形面积
1. **直角坐标**: A = ∫[a,b] |f(x)|dx
2. **参数方程**: A = ∫[α,β] |y(t)x'(t)|dt
3. **极坐标**: A = (1/2)∫[α,β] r²(θ)dθ

## 二、旋转体体积
1. **绕x轴**: V = π∫[a,b] f²(x)dx
2. **绕y轴**: V = 2π∫[a,b] xf(x)dx (柱壳法)

## 三、曲线弧长
1. **直角坐标**: s = ∫[a,b] √(1+y'²)dx
2. **参数方程**: s = ∫[α,β] √(x'²+y'²)dt
3. **极坐标**: s = ∫[α,β] √(r²+r'²)dθ

## 四、旋转曲面面积
S = 2π∫[a,b] |f(x)|√(1+f'²(x))dx`,
      createdAt: new Date().toISOString()
    },
    {
      id: 'ch5_physical_application',
      subject: '高等数学',
      chapter: '第五章 一元函数积分学的应用',
      topicName: '定积分的物理与经济应用',
      questionTypes: [
        { type: '求功', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '求水压力', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '求引力', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '经济应用(边际、弹性)', solvedCount: 0, correctCount: 0, wrongProblems: [] }
      ],
      masteryLevel: 0,
      lectureTime: 0,
      practiceTime: 0,
      problemCount: 0,
      correctCount: 0,
      nextReviewDate: new Date().toISOString().split('T')[0],
      needsSpecialTraining: false,
      isTextbookExample: false,
      reviewCount: 0,
      notes: `# 定积分的物理与经济应用

## 一、物理应用
1. **功**: W = ∫F(x)dx
2. **水压力**: P = ρg∫h(x)·宽度·dx
3. **引力**: 万有引力定律积分
4. **质心**: x̄ = (1/A)∫xdA

## 二、经济应用
1. **边际分析**: 边际成本C'(x),边际收益R'(x)
2. **弹性**: η = (x/y)·(dy/dx)
3. **消费者剩余**: CS = ∫[0,Q₀][D(Q)-P₀]dQ
4. **生产者剩余**: PS = ∫[0,Q₀][P₀-S(Q)]dQ`,
      createdAt: new Date().toISOString()
    },
    
    // ==================== 第六章 二重积分 ====================
    {
      id: 'ch6_double_integral',
      subject: '高等数学',
      chapter: '第六章 二重积分',
      topicName: '二重积分的计算',
      questionTypes: [
        { type: '直角坐标系计算', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '极坐标系计算', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '交换积分次序', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '利用对称性简化', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '利用区域对称性', solvedCount: 0, correctCount: 0, wrongProblems: [] }
      ],
      masteryLevel: 0,
      lectureTime: 0,
      practiceTime: 0,
      problemCount: 0,
      correctCount: 0,
      nextReviewDate: new Date().toISOString().split('T')[0],
      needsSpecialTraining: false,
      isTextbookExample: false,
      reviewCount: 0,
      notes: `# 二重积分

## 一、直角坐标系
∬_D f(x,y)dσ = ∫[a,b]dx∫[φ₁(x),φ₂(x)] f(x,y)dy

**X型区域**: 先y后x
**Y型区域**: 先x后y

## 二、极坐标系
x = rcosθ, y = rsinθ, dσ = rdrdθ

∬_D f(x,y)dσ = ∫[α,β]dθ∫[r₁(θ),r₂(θ)] f(rcosθ,rsinθ)rdr

**适用**: 圆形、扇形区域或被积函数含x²+y²

## 三、对称性
1. **区域对称+函数奇偶**: 简化计算
2. **轮换对称**: x↔y,区域不变,则可互换

## 四、交换积分次序
画出积分区域,重新确定积分限`,
      createdAt: new Date().toISOString()
    },
    {
      id: 'ch6_double_integral_application',
      subject: '高等数学',
      chapter: '第六章 二重积分',
      topicName: '二重积分的应用',
      questionTypes: [
        { type: '求体积', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '求曲面面积', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '求质量与质心', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '求转动惯量', solvedCount: 0, correctCount: 0, wrongProblems: [] }
      ],
      masteryLevel: 0,
      lectureTime: 0,
      practiceTime: 0,
      problemCount: 0,
      correctCount: 0,
      nextReviewDate: new Date().toISOString().split('T')[0],
      needsSpecialTraining: false,
      isTextbookExample: false,
      reviewCount: 0,
      notes: `# 二重积分的应用

## 一、几何应用
1. **体积**: V = ∬_D f(x,y)dσ (曲顶柱体)
2. **曲面面积**: S = ∬_D √(1+z_x²+z_y²)dσ

## 二、物理应用
1. **质量**: m = ∬_D ρ(x,y)dσ
2. **质心**: x̄ = (1/m)∬_D xρdσ, ȳ = (1/m)∬_D yρdσ
3. **转动惯量**: 
   - I_x = ∬_D y²ρdσ
   - I_y = ∬_D x²ρdσ
   - I_o = ∬_D (x²+y²)ρdσ`,
      createdAt: new Date().toISOString()
    },
    
    // ==================== 第七章 无穷级数 ====================
    {
      id: 'ch7_series_convergence',
      subject: '高等数学',
      chapter: '第七章 无穷级数',
      topicName: '常数项级数的审敛法',
      questionTypes: [
        { type: '正项级数审敛(比值、根值)', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '正项级数审敛(比较、极限比较)', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '交错级数审敛(莱布尼茨)', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '绝对收敛与条件收敛', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '任意项级数审敛', solvedCount: 0, correctCount: 0, wrongProblems: [] }
      ],
      masteryLevel: 0,
      lectureTime: 0,
      practiceTime: 0,
      problemCount: 0,
      correctCount: 0,
      nextReviewDate: new Date().toISOString().split('T')[0],
      needsSpecialTraining: false,
      isTextbookExample: false,
      reviewCount: 0,
      notes: `# 常数项级数审敛法

## 一、正项级数
1. **比较判别法**: 与大/小级数比较
2. **极限比较法**: lim(a_n/b_n) = l
3. **比值判别法**: lim(a_{n+1}/a_n) = ρ
   - ρ<1收敛, ρ>1发散, ρ=1不确定
4. **根值判别法**: lim(ⁿ√a_n) = ρ

## 二、交错级数
**莱布尼茨判别法**:
- u_n单调递减
- lim u_n = 0
⇒ 级数收敛

## 三、任意项级数
- **绝对收敛**: ∑|a_n|收敛 ⇒ ∑a_n收敛
- **条件收敛**: ∑a_n收敛但∑|a_n|发散`,
      createdAt: new Date().toISOString()
    },
    {
      id: 'ch7_power_series',
      subject: '高等数学',
      chapter: '第七章 无穷级数',
      topicName: '幂级数',
      questionTypes: [
        { type: '求收敛半径与收敛域', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '幂级数求和函数', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '函数展开成幂级数', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '逐项求导与逐项积分', solvedCount: 0, correctCount: 0, wrongProblems: [] }
      ],
      masteryLevel: 0,
      lectureTime: 0,
      practiceTime: 0,
      problemCount: 0,
      correctCount: 0,
      nextReviewDate: new Date().toISOString().split('T')[0],
      needsSpecialTraining: false,
      isTextbookExample: false,
      reviewCount: 0,
      notes: `# 幂级数

## 一、收敛半径
∑a_n(x-x₀)^n

**求法**: R = lim|a_n/a_{n+1}| 或 R = 1/lim(ⁿ√|a_n|)

**收敛域**: (x₀-R, x₀+R),需检验端点

## 二、求和函数
1. **逐项求导/积分**: 转化为已知级数
2. **分解法**: 拆成简单级数
3. **微分方程法**: 建立S(x)的微分方程

## 三、函数展开
**泰勒级数**: f(x) = ∑[f^(n)(x₀)/n!](x-x₀)^n

**常见展开**:
e^x = ∑x^n/n!
sinx = ∑(-1)^n x^(2n+1)/(2n+1)!
cosx = ∑(-1)^n x^(2n)/(2n)!
ln(1+x) = ∑(-1)^(n-1) x^n/n
(1+x)^α = ∑C(α,n)x^n`,
      createdAt: new Date().toISOString()
    },
    {
      id: 'ch7_fourier_series',
      subject: '高等数学',
      chapter: '第七章 无穷级数',
      topicName: '傅里叶级数',
      questionTypes: [
        { type: '求傅里叶系数', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '傅里叶级数展开', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '正弦级数与余弦级数', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '周期延拓', solvedCount: 0, correctCount: 0, wrongProblems: [] }
      ],
      masteryLevel: 0,
      lectureTime: 0,
      practiceTime: 0,
      problemCount: 0,
      correctCount: 0,
      nextReviewDate: new Date().toISOString().split('T')[0],
      needsSpecialTraining: false,
      isTextbookExample: false,
      reviewCount: 0,
      notes: `# 傅里叶级数

## 一、傅里叶系数
f(x) ~ a₀/2 + ∑(a_n cosnx + b_n sinnx)

a₀ = (1/π)∫[-π,π] f(x)dx
a_n = (1/π)∫[-π,π] f(x)cosnxdx
b_n = (1/π)∫[-π,π] f(x)sinnxdx

## 二、收敛定理(狄利克雷)
- 连续点: 收敛于f(x)
- 间断点: 收敛于[f(x⁺)+f(x⁻)]/2

## 三、奇偶函数
- **奇函数**: a_n=0,只有正弦项
- **偶函数**: b_n=0,只有余弦项

## 四、周期延拓
将[0,l]上的函数延拓为[-l,l]上的奇/偶函数`,
      createdAt: new Date().toISOString()
    },
    
    // ==================== 第八章 空间解析几何及其应用 ====================
    {
      id: 'ch8_vector_geometry',
      subject: '高等数学',
      chapter: '第八章 空间解析几何及其应用',
      topicName: '向量代数与空间解析几何',
      questionTypes: [
        { type: '向量的运算(点积、叉积)', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '求平面方程', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '求直线方程', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '求距离(点到面、线到线)', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '求夹角(面面、线面、线线)', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '二次曲面方程', solvedCount: 0, correctCount: 0, wrongProblems: [] }
      ],
      masteryLevel: 0,
      lectureTime: 0,
      practiceTime: 0,
      problemCount: 0,
      correctCount: 0,
      nextReviewDate: new Date().toISOString().split('T')[0],
      needsSpecialTraining: false,
      isTextbookExample: false,
      reviewCount: 0,
      notes: `# 空间解析几何

## 一、向量运算
- **点积**: a·b = |a||b|cosθ = x₁x₂+y₁y₂+z₁z₂
- **叉积**: a×b = |i j k; x₁ y₁ z₁; x₂ y₂ z₂|
- **混合积**: (a×b)·c

## 二、平面方程
- **点法式**: A(x-x₀)+B(y-y₀)+C(z-z₀)=0
- **一般式**: Ax+By+Cz+D=0
- **截距式**: x/a+y/b+z/c=1

## 三、直线方程
- **对称式**: (x-x₀)/m=(y-y₀)/n=(z-z₀)/p
- **参数式**: x=x₀+mt, y=y₀+nt, z=z₀+pt

## 四、距离与夹角
- **点到平面**: d = |Ax₀+By₀+Cz₀+D|/√(A²+B²+C²)
- **夹角**: 用法向量或方向向量计算`,
      createdAt: new Date().toISOString()
    },
    
    // ==================== 第九章 多元积分学及其应用 ====================
    {
      id: 'ch9_multivariable_function',
      subject: '高等数学',
      chapter: '第九章 多元积分学及其应用',
      topicName: '多元函数微分学',
      questionTypes: [
        { type: '求偏导数', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '求全微分', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '复合函数求偏导', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '隐函数求偏导', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '求多元函数极值', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '条件极值(拉格朗日乘数法)', solvedCount: 0, correctCount: 0, wrongProblems: [] }
      ],
      masteryLevel: 0,
      lectureTime: 0,
      practiceTime: 0,
      problemCount: 0,
      correctCount: 0,
      nextReviewDate: new Date().toISOString().split('T')[0],
      needsSpecialTraining: false,
      isTextbookExample: false,
      reviewCount: 0,
      notes: `# 多元函数微分学

## 一、偏导数
∂z/∂x: 对x求导,y视为常数

**高阶偏导**: ∂²z/∂x², ∂²z/∂x∂y, ∂²z/∂y²

## 二、全微分
dz = (∂z/∂x)dx + (∂z/∂y)dy

**可微条件**: 偏导数连续

## 三、复合函数求导
链式法则: ∂z/∂x = (∂z/∂u)(∂u/∂x) + (∂z/∂v)(∂v/∂x)

## 四、隐函数求导
F(x,y,z)=0:
- ∂z/∂x = -F_x/F_z
- ∂z/∂y = -F_y/F_z

## 五、极值
**无条件极值**:
1. 求驻点: ∂z/∂x=0, ∂z/∂y=0
2. 判别: AC-B²>0且A<0为极大,A>0为极小

**条件极值**: 拉格朗日乘数法
L = f(x,y) + λφ(x,y)`,
      createdAt: new Date().toISOString()
    },
    {
      id: 'ch9_triple_integral',
      subject: '高等数学',
      chapter: '第九章 多元积分学及其应用',
      topicName: '三重积分',
      questionTypes: [
        { type: '直角坐标系计算', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '柱面坐标系计算', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '球面坐标系计算', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '利用对称性简化', solvedCount: 0, correctCount: 0, wrongProblems: [] }
      ],
      masteryLevel: 0,
      lectureTime: 0,
      practiceTime: 0,
      problemCount: 0,
      correctCount: 0,
      nextReviewDate: new Date().toISOString().split('T')[0],
      needsSpecialTraining: false,
      isTextbookExample: false,
      reviewCount: 0,
      notes: `# 三重积分

## 一、直角坐标系
∭_Ω f(x,y,z)dV = ∫dx∫dy∫f(x,y,z)dz

**投影法**: 先z后y再x
**截面法**: 先xy后z

## 二、柱面坐标系
x=rcosθ, y=rsinθ, z=z
dV = rdrdθdz

**适用**: 圆柱形区域或含x²+y²

## 三、球面坐标系
x=rsinφcosθ, y=rsinφsinθ, z=rcosφ
dV = r²sinφdrdφdθ

**适用**: 球形区域或含x²+y²+z²

## 四、对称性
类似二重积分,利用区域和函数的对称性简化`,
      createdAt: new Date().toISOString()
    },
    {
      id: 'ch9_line_surface_integral',
      subject: '高等数学',
      chapter: '第九章 多元积分学及其应用',
      topicName: '曲线积分与曲面积分',
      questionTypes: [
        { type: '第一类曲线积分(对弧长)', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '第二类曲线积分(对坐标)', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '格林公式', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '第一类曲面积分(对面积)', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '第二类曲面积分(对坐标)', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '高斯公式', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '斯托克斯公式', solvedCount: 0, correctCount: 0, wrongProblems: [] },
        { type: '曲线积分与路径无关', solvedCount: 0, correctCount: 0, wrongProblems: [] }
      ],
      masteryLevel: 0,
      lectureTime: 0,
      practiceTime: 0,
      problemCount: 0,
      correctCount: 0,
      nextReviewDate: new Date().toISOString().split('T')[0],
      needsSpecialTraining: false,
      isTextbookExample: false,
      reviewCount: 0,
      notes: `# 曲线积分与曲面积分

## 一、曲线积分
**第一类**(对弧长): ∫_L f(x,y)ds
- 参数化: ds = √(x'²+y'²)dt

**第二类**(对坐标): ∫_L Pdx+Qdy
- 参数化: 代入x(t),y(t)

**格林公式**: ∮_L Pdx+Qdy = ∬_D (∂Q/∂x-∂P/∂y)dxdy

**路径无关条件**: ∂Q/∂x = ∂P/∂y

## 二、曲面积分
**第一类**(对面积): ∬_Σ f(x,y,z)dS
- 投影: dS = √(1+z_x²+z_y²)dxdy

**第二类**(对坐标): ∬_Σ Pdydz+Qdzdx+Rdxdy
- 投影到坐标面

**高斯公式**: ∯_Σ Pdydz+Qdzdx+Rdxdy = ∭_Ω (∂P/∂x+∂Q/∂y+∂R/∂z)dV

**斯托克斯公式**: 联系曲线积分与曲面积分`,
      createdAt: new Date().toISOString()
    }
  ]
  
  localStorage.setItem('mathReinforcement_topics', JSON.stringify(topics))
  console.log('✅ 已初始化高等数学9个章节的所有知识点卡片(共23个知识点)')
}
</script>

<style scoped>
.reinforcement-dashboard {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 24px;
  background: linear-gradient(180deg, #f5f7fa 0%, #e8ecf1 100%);
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 40px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
}

.page-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: pulse 4s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

.page-header h1 {
  font-size: 36px;
  color: #ffffff;
  margin-bottom: 12px;
  font-weight: 700;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1;
}

.subtitle {
  color: rgba(255, 255, 255, 0.95);
  font-size: 16px;
  margin: 0;
  font-weight: 400;
  letter-spacing: 1px;
  position: relative;
  z-index: 1;
}

/* 总体进度 */
.progress-overview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

@media (max-width: 768px) {
  .progress-overview {
    grid-template-columns: 1fr;
  }
}

.subject-progress-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid rgba(255, 255, 255, 0.8);
  position: relative;
  overflow: hidden;
}

.subject-progress-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.subject-progress-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.2);
  border-color: #667eea;
}

.subject-progress-card:hover::before {
  opacity: 1;
}

.subject-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: bold;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.subject-progress-card:hover .subject-icon {
  transform: scale(1.05) rotate(5deg);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.subject-icon.math {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  box-shadow: 0 4px 12px rgba(245, 87, 108, 0.3);
}

.subject-progress-card:hover .subject-icon.math {
  box-shadow: 0 6px 20px rgba(245, 87, 108, 0.4);
}

.subject-icon.linear {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  box-shadow: 0 4px 12px rgba(79, 172, 254, 0.3);
}

.subject-progress-card:hover .subject-icon.linear {
  box-shadow: 0 6px 20px rgba(79, 172, 254, 0.4);
}

.subject-icon.prob {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  box-shadow: 0 4px 12px rgba(67, 233, 123, 0.3);
}

.subject-progress-card:hover .subject-icon.prob {
  box-shadow: 0 6px 20px rgba(67, 233, 123, 0.4);
}

.subject-info {
  flex: 1;
}

.subject-info h3 {
  margin: 0 0 6px 0;
  font-size: 20px;
  color: #1a1a1a;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.teacher-name {
  font-size: 13px;
  color: #666;
  margin: 0 0 12px 0;
  font-weight: 500;
}

.progress-text {
  margin: 10px 0 6px 0;
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.progress-detail {
  font-size: 12px;
  color: #999;
  margin: 0;
  font-weight: 400;
}

/* 今日任务 */
.today-tasks-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 2px solid rgba(255, 255, 255, 0.8);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f0f0f0;
}

.section-header h2 {
  margin: 0;
  font-size: 22px;
  color: #1a1a1a;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border-radius: 12px;
  background: linear-gradient(135deg, #fafbfc 0%, #f5f7fa 100%);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  margin-bottom: 12px;
}

.task-item:hover {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-color: #667eea;
  transform: translateX(4px);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.15);
}

.task-item.completed {
  opacity: 0.7;
  background: linear-gradient(135deg, #f0f9f0 0%, #e8f5e9 100%);
  border-color: #43e97b;
}

.task-content {
  flex: 1;
}

.task-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 6px;
}

.task-meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.task-type, .task-time, .task-problems {
  font-size: 13px;
  padding: 4px 10px;
  border-radius: 6px;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  font-weight: 500;
}

/* 智能提醒 */
.alerts-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}

.alert-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-radius: 16px;
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  border: 2px solid rgba(255, 255, 255, 0.8);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.alert-card:hover {
  transform: translateX(6px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
  border-color: #667eea;
}

.alert-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.alert-icon.warning {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.alert-icon.info {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.alert-icon.success {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.alert-desc {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* 统计 */
.statistics-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 2px solid rgba(255, 255, 255, 0.8);
}

.statistics-section h2 {
  margin: 0 0 24px 0;
  font-size: 22px;
  color: #1a1a1a;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
}

.stat-card {
  text-align: center;
  padding: 20px 16px;
  border-radius: 14px;
  background: linear-gradient(135deg, #fafbfc 0%, #f5f7fa 100%);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
}

.stat-card:hover {
  transform: translateY(-4px);
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-color: #667eea;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
}

.stat-card.highlight {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}

.stat-card.highlight:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.4);
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 8px;
  letter-spacing: 1px;
}

.stat-card.highlight .stat-number {
  color: white;
}

.stat-label {
  font-size: 13px;
  color: #666;
  font-weight: 500;
}

.stat-card.highlight .stat-label {
  color: rgba(255, 255, 255, 0.95);
}

.ratio-tip {
  margin-top: 8px;
  font-size: 12px;
  color: #999;
}

.ratio-tip.good {
  color: #43e97b;
  font-weight: 600;
}

/* 快速操作 */
.quick-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  padding: 20px 0;
}

.quick-actions .el-button {
  border-radius: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.quick-actions .el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.empty-state {
  padding: 40px 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .reinforcement-dashboard {
    padding: 16px;
  }
  
  .page-header {
    padding: 24px 0;
    border-radius: 16px;
  }
  
  .page-header h1 {
    font-size: 28px;
  }
  
  .progress-overview {
    gap: 12px;
  }
  
  .subject-progress-card {
    padding: 16px;
  }
  
  .subject-icon {
    width: 56px;
    height: 56px;
    font-size: 24px;
  }
}
</style>

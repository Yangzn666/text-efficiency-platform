<template>
  <div class="cs408-progress-container">
    <div class="progress-header">
      <div class="header-content">
        <div>
          <h2 class="page-title">💻 408计算机专业课进度</h2>
          <p class="page-subtitle">基础阶段：数据结构 → 组成原理 → 计算机网络 → 操作系统</p>
        </div>
        <el-button 
          type="success" 
          size="large"
          icon="Monitor"
          @click="openVisualIndex"
          class="visual-link-btn"
        >
          🎨 408可视化学习平台
        </el-button>
      </div>
    </div>
    
    <!-- 总体进度概览 -->
    <div class="progress-overview">
      <div class="overview-card">
        <div class="card-icon">📚</div>
        <div class="card-content">
          <h3>已完成科目</h3>
          <div class="progress-numbers">
            <span class="current">{{ completedSubjects }}</span>
            <span class="separator">/</span>
            <span class="total">{{ totalSubjects }}</span>
          </div>
          <div class="progress-percent">{{ overallPercent }}%</div>
          <el-progress 
            :percentage="overallPercent" 
            :stroke-width="8"
            color="#4CAF50"
            class="progress-bar"
          />
        </div>
      </div>
      
      <div class="overview-card">
        <div class="card-icon">🎯</div>
        <div class="card-content">
          <h3>当前学习</h3>
          <div class="current-subject">
            <span class="subject-name">{{ currentSubjectName }}</span>
            <el-tag type="warning" size="small">进行中</el-tag>
          </div>
          <div class="subject-status">{{ currentSubjectStatus }}</div>
        </div>
      </div>
    </div>
    
    <!-- 四门课详细进度 -->
    <div class="subjects-section">
      <div class="section-header">
        <h3>📖 四门课程进度详情</h3>
      </div>
      
      <div class="subjects-grid">
        <div 
          v-for="subject in subjects" 
          :key="subject.id"
          :class="[
            'subject-card',
            getSubjectStatusClass(subject.status)
          ]"
          @click="goToSubjectLearning(subject.id)"
        >
          <div class="subject-header">
            <div class="subject-icon">{{ subject.icon }}</div>
            <div class="subject-info">
              <h4>{{ subject.name }}</h4>
              <el-tag 
                :type="getSubjectTagType(subject.status)"
                size="small"
              >
                {{ getSubjectStatusText(subject.status) }}
              </el-tag>
            </div>
          </div>
          
          <div class="subject-details">
            <div class="detail-item">
              <span class="label">阶段：</span>
              <span class="value">{{ subject.phase }}</span>
            </div>
            <div class="detail-item" v-if="subject.completedDate">
              <span class="label">完成时间：</span>
              <span class="value">{{ subject.completedDate }}</span>
            </div>
            <div class="detail-item" v-if="subject.startDate">
              <span class="label">开始时间：</span>
              <span class="value">{{ subject.startDate }}</span>
            </div>
          </div>
          
          <div class="subject-description">
            {{ subject.description }}
          </div>
          
          <!-- 所有课程显示提示 -->
          <div class="click-hint">
            <el-icon><Right /></el-icon>
            <span>点击查看{{ subject.status === 'completed' ? '复习' : '学习' }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 学习路线时间线 -->
    <div class="timeline-section">
      <div class="section-header">
        <h3>🗓️ 基础阶段学习路线</h3>
      </div>
      
      <div class="timeline">
        <div 
          v-for="(subject, index) in subjects" 
          :key="'timeline-' + subject.id"
          class="timeline-item"
          :class="getSubjectStatusClass(subject.status)"
        >
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <div class="timeline-header">
              <span class="timeline-order">{{ index + 1 }}</span>
              <h4>{{ subject.name }}</h4>
              <el-tag 
                :type="getSubjectTagType(subject.status)"
                size="small"
              >
                {{ getSubjectStatusText(subject.status) }}
              </el-tag>
            </div>
            <p class="timeline-desc">{{ subject.description }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 下一步提醒 -->
    <div class="next-step-section">
      <el-alert
        title="下一步学习计划"
        type="info"
        show-icon
        :closable="false"
      >
        <template #default>
          <div class="next-step-content">
            <p><strong>当前任务：</strong>继续完成{{ currentSubjectName }}的基础学习</p>
            <p><strong>后续安排：</strong></p>
            <ul>
              <li v-for="subject in upcomingSubjects" :key="subject.id">
                {{ subject.name }} - {{ subject.phase }}
              </li>
            </ul>
            
            <!-- 计组学习入口 -->
            <div class="composition-learning-entry">
              <el-divider />
              <div class="entry-content">
                <span class="entry-text">📖 想系统学习计算机组成原理？</span>
                <el-button 
                  type="primary" 
                  size="small"
                  @click="goToCompositionLearning"
                >
                  进入计组学习模块 →
                </el-button>
              </div>
            </div>
          </div>
        </template>
      </el-alert>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Right } from '@element-plus/icons-vue'

const router = useRouter()

// 四门课程数据
const subjects = ref([
  {
    id: 'data-structure',
    name: '数据结构',
    icon: '🌳',
    status: 'completed',
    phase: '基础阶段',
    description: '线性表、栈、队列、树、图、查找、排序等核心数据结构与算法',
    startDate: '2026-04-16',
    completedDate: '2026-04-29'
  },
  {
    id: 'computer-org',
    name: '计算机组成原理',
    icon: '🔧',
    status: 'in-progress',
    phase: '基础阶段',
    description: '数据的表示和运算、存储系统、指令系统、中央处理器、总线、输入输出系统',
    startDate: '2026-05-01'
  },
  {
    id: 'computer-network',
    name: '计算机网络',
    icon: '🌐',
    status: 'pending',
    phase: '基础阶段',
    description: '计算机网络体系结构、物理层、数据链路层、网络层、传输层、应用层'
  },
  {
    id: 'operating-system',
    name: '操作系统',
    icon: '⚙️',
    status: 'pending',
    phase: '基础阶段',
    description: '操作系统基本概念、进程管理、内存管理、文件管理、输入输出管理'
  }
])

// 计算属性
const totalSubjects = computed(() => subjects.value.length)

const completedSubjects = computed(() => {
  return subjects.value.filter(s => s.status === 'completed').length
})

const overallPercent = computed(() => {
  return Math.round((completedSubjects.value / totalSubjects.value) * 100)
})

const currentSubject = computed(() => {
  return subjects.value.find(s => s.status === 'in-progress')
})

const currentSubjectName = computed(() => {
  return currentSubject.value?.name || '无'
})

const currentSubjectStatus = computed(() => {
  if (!currentSubject.value) return '暂无进行中的科目'
  return `已开始基础学习 · ${currentSubject.value.phase}`
})

const upcomingSubjects = computed(() => {
  return subjects.value.filter(s => s.status === 'pending')
})

// 方法
const getSubjectStatusClass = (status) => {
  const classMap = {
    'completed': 'completed',
    'in-progress': 'in-progress',
    'pending': 'pending'
  }
  return classMap[status] || 'pending'
}

const getSubjectTagType = (status) => {
  const typeMap = {
    'completed': 'success',
    'in-progress': 'warning',
    'pending': 'info'
  }
  return typeMap[status] || 'info'
}

const getSubjectStatusText = (status) => {
  const textMap = {
    'completed': '已完成',
    'in-progress': '学习中',
    'pending': '未开始'
  }
  return textMap[status] || '未开始'
}

// 跳转到科目学习模块
const goToSubjectLearning = (subjectId) => {
  const routeMap = {
    'data-structure': '/cs408/datastructure',
    'computer-org': '/cs408/composition',
    'computer-network': '/cs408/network',
    'operating-system': '/cs408/operating'
  }
  const route = routeMap[subjectId]
  if (route) {
    router.push(route)
  } else {
    console.warn(`路由未配置: ${subjectId}`)
  }
}

// 打开408可视化学习网站
const openVisualIndex = () => {
  window.open('https://www.codebrick.tech/visual-index.html', '_blank')
}
</script>

<style scoped>
.cs408-progress-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.progress-header {
  text-align: center;
  margin-bottom: 40px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}

.header-content > div:first-child {
  flex: 1;
  text-align: left;
}

.visual-link-btn {
  white-space: nowrap;
  font-size: 1.1rem;
  padding: 12px 24px;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  transition: all 0.3s ease;
}

.visual-link-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);
}

.page-title {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 10px;
}

.page-subtitle {
  font-size: 1.2rem;
  color: #666;
}

.progress-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

.overview-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: transform 0.3s ease;
}

.overview-card:hover {
  transform: translateY(-5px);
}

.card-icon {
  font-size: 3rem;
}

.card-content {
  flex: 1;
}

.card-content h3 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.3rem;
}

.progress-numbers {
  display: flex;
  align-items: baseline;
  gap: 5px;
  margin-bottom: 10px;
}

.current {
  font-size: 2.5rem;
  font-weight: bold;
  color: #4CAF50;
}

.separator {
  font-size: 1.5rem;
  color: #999;
}

.total {
  font-size: 1.5rem;
  color: #999;
}

.progress-percent {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 15px;
}

.progress-bar {
  margin-top: 10px;
}

.current-subject {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.subject-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: #FF9800;
}

.subject-status {
  font-size: 1rem;
  color: #666;
}

.subjects-section {
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.section-header {
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

.section-header h3 {
  color: #333;
  font-size: 1.5rem;
}

.subjects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.subject-card {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
}

.subject-card.completed {
  background: #e8f5e8;
  border-color: #4CAF50;
}

.subject-card.in-progress {
  background: #fff3e0;
  border-color: #FF9800;
  animation: pulse 2s infinite;
}

.subject-card.pending {
  background: #f5f5f5;
  border-color: #9e9e9e;
}

/* 所有卡片都可点击 */
.subject-card {
  cursor: pointer;
  position: relative;
}

.subject-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.subject-card:active {
  transform: translateY(-2px);
}

.click-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 12px;
  padding: 8px 12px;
  background: rgba(255, 152, 0, 0.1);
  border-radius: 6px;
  color: #FF9800;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s;
}

.subject-card.clickable:hover .click-hint {
  background: rgba(255, 152, 0, 0.2);
}

.click-hint .el-icon {
  font-size: 1.1rem;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

.subject-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.subject-icon {
  font-size: 2.5rem;
}

.subject-info {
  flex: 1;
}

.subject-info h4 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 8px;
}

.subject-details {
  margin-bottom: 15px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.detail-item:last-child {
  border-bottom: none;
}

.label {
  color: #666;
  font-size: 0.9rem;
}

.value {
  color: #333;
  font-weight: 500;
  font-size: 0.9rem;
}

.subject-description {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.6;
}

.timeline-section {
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.timeline {
  position: relative;
  padding-left: 40px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(to bottom, #4CAF50, #FF9800, #9e9e9e);
  border-radius: 2px;
}

.timeline-item {
  position: relative;
  margin-bottom: 30px;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-dot {
  position: absolute;
  left: -33px;
  top: 5px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 0 0 3px #ddd;
}

.timeline-item.completed .timeline-dot {
  background: #4CAF50;
  box-shadow: 0 0 0 3px #4CAF50;
}

.timeline-item.in-progress .timeline-dot {
  background: #FF9800;
  box-shadow: 0 0 0 3px #FF9800;
  animation: blink 1.5s infinite;
}

.timeline-item.pending .timeline-dot {
  background: #9e9e9e;
  box-shadow: 0 0 0 3px #9e9e9e;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.timeline-content {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 10px;
  border-left: 4px solid #ddd;
}

.timeline-item.completed .timeline-content {
  background: #e8f5e8;
  border-left-color: #4CAF50;
}

.timeline-item.in-progress .timeline-content {
  background: #fff3e0;
  border-left-color: #FF9800;
}

.timeline-item.pending .timeline-content {
  background: #f5f5f5;
  border-left-color: #9e9e9e;
}

.timeline-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.timeline-order {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #667eea;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
}

.timeline-header h4 {
  flex: 1;
  font-size: 1.1rem;
  color: #333;
}

.timeline-desc {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0;
}

.next-step-section {
  margin-top: 30px;
}

.next-step-content ul {
  margin-top: 10px;
  padding-left: 20px;
}

.next-step-content li {
  margin-bottom: 5px;
  color: #666;
}

/* 计组学习入口样式 */
.composition-learning-entry {
  margin-top: 16px;
  
  .entry-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    
    .entry-text {
      font-size: 14px;
      color: #595959;
    }
  }
}

@media (max-width: 768px) {
  .progress-overview {
    grid-template-columns: 1fr;
  }
  
  .subjects-grid {
    grid-template-columns: 1fr;
  }
  
  .page-title {
    font-size: 2rem;
  }
}
</style>

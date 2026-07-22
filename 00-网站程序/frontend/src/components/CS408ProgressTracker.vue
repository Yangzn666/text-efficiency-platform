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
    status: 'completed',
    phase: '基础阶段',
    description: '数据的表示和运算、存储系统、指令系统、中央处理器、总线、输入输出系统',
    startDate: '2026-05-01',
    completedDate: '2026-05-18'
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
    status: 'in-progress',
    phase: '基础阶段',
    description: '操作系统基本概念、进程管理、内存管理、文件管理、输入输出管理',
    startDate: '2026-05-19'
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
    'operating-system': '/cs408/os'
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

// 进入计组学习模块
const goToCompositionLearning = () => {
  router.push('/cs408/composition')
}

// 进入操作系统学习模块
const goToOSLearning = () => {
  router.push('/cs408/os')
}
</script>

<style scoped>
.cs408-progress-container {
  --navy-deep: #0d2137;
  --navy: #16345c;
  --gold: #ffc53d;
  --line: #e4ebf3;
  --bg-soft: #f5f8fc;
  --ink: #1f2d3d;
  --muted: #5b6b7f;
  --font-mono: 'JetBrains Mono', monospace;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.progress-header {
  margin-bottom: 4px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.header-content > div:first-child {
  flex: 1;
}

.visual-link-btn {
  white-space: nowrap;
  font-size: 0.92rem;
  padding: 10px 20px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--navy) 0%, #1e4576 100%);
  border: none;
  box-shadow: 0 4px 14px rgba(13, 33, 55, 0.2);
  transition: all 0.25s ease;
}

.visual-link-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(13, 33, 55, 0.3);
}

.page-title {
  font-size: 1.4rem;
  color: var(--ink);
  margin-bottom: 6px;
  font-weight: 700;
}

.page-subtitle {
  font-size: 0.9rem;
  color: var(--muted);
}

.progress-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.overview-card {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(13, 33, 55, 0.05);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.25s ease;
}

.overview-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(13, 33, 55, 0.1);
  border-color: var(--gold);
}

.card-icon {
  font-size: 2.2rem;
  flex-shrink: 0;
}

.card-content {
  flex: 1;
}

.card-content h3 {
  color: var(--ink);
  margin-bottom: 10px;
  font-size: 1rem;
  font-weight: 600;
}

.progress-numbers {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 8px;
}

.current {
  font-size: 2rem;
  font-weight: 800;
  color: var(--navy);
  font-family: var(--font-mono);
}

.separator {
  font-size: 1.2rem;
  color: var(--muted);
}

.total {
  font-size: 1.2rem;
  color: var(--muted);
  font-family: var(--font-mono);
}

.progress-percent {
  font-size: 0.9rem;
  color: var(--muted);
  margin-bottom: 10px;
  font-family: var(--font-mono);
}

.progress-bar {
  margin-top: 8px;
}

.current-subject {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.subject-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--gold);
}

.subject-status {
  font-size: 0.88rem;
  color: var(--muted);
}

.subjects-section {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 22px;
  box-shadow: 0 4px 16px rgba(13, 33, 55, 0.05);
}

.section-header {
  margin-bottom: 20px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--line);
}

.section-header h3 {
  color: var(--ink);
  font-size: 1.1rem;
  font-weight: 700;
}

.subjects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 14px;
}

.subject-card {
  background: var(--bg-soft);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 16px;
  transition: all 0.25s ease;
  cursor: pointer;
  position: relative;
}

.subject-card.completed {
  background: #f0f9eb;
  border-color: #b3e19d;
}

.subject-card.in-progress {
  background: #fffbe6;
  border-color: var(--gold);
  box-shadow: 0 0 0 1px rgba(255, 197, 61, 0.2);
}

.subject-card.pending {
  background: var(--bg-soft);
  border-color: var(--line);
  opacity: 0.8;
}

.subject-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(13, 33, 55, 0.1);
}

.subject-card:active {
  transform: translateY(-1px);
}

.click-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 12px;
  padding: 8px 12px;
  background: rgba(22, 52, 92, 0.06);
  border-radius: 8px;
  color: var(--navy);
  font-size: 0.82rem;
  font-weight: 500;
  transition: all 0.2s;
}

.subject-card:hover .click-hint {
  background: rgba(22, 52, 92, 0.1);
}

.click-hint .el-icon {
  font-size: 1rem;
}

.subject-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.subject-icon {
  font-size: 1.8rem;
  flex-shrink: 0;
}

.subject-info {
  flex: 1;
}

.subject-info h4 {
  font-size: 1.05rem;
  color: var(--ink);
  margin-bottom: 6px;
  font-weight: 700;
}

.subject-details {
  margin-bottom: 12px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid rgba(228, 235, 243, 0.6);
}

.detail-item:last-child {
  border-bottom: none;
}

.label {
  color: var(--muted);
  font-size: 0.82rem;
}

.value {
  color: var(--ink);
  font-weight: 500;
  font-size: 0.82rem;
  font-family: var(--font-mono);
}

.subject-description {
  color: var(--muted);
  font-size: 0.85rem;
  line-height: 1.6;
}

.timeline-section {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 22px;
  box-shadow: 0 4px 16px rgba(13, 33, 55, 0.05);
}

.timeline {
  position: relative;
  padding-left: 36px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 13px;
  top: 4px;
  bottom: 4px;
  width: 2px;
  background: linear-gradient(to bottom, var(--gold), var(--navy), #c0c4cc);
  border-radius: 1px;
}

.timeline-item {
  position: relative;
  margin-bottom: 24px;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-dot {
  position: absolute;
  left: -30px;
  top: 6px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #fff;
}

.timeline-item.completed .timeline-dot {
  background: #67c23a;
  box-shadow: 0 0 0 2px #67c23a;
}

.timeline-item.in-progress .timeline-dot {
  background: var(--gold);
  box-shadow: 0 0 0 2px var(--gold);
}

.timeline-item.pending .timeline-dot {
  background: #c0c4cc;
  box-shadow: 0 0 0 2px #c0c4cc;
}

.timeline-content {
  background: var(--bg-soft);
  padding: 14px 16px;
  border-radius: 10px;
  border-left: 3px solid var(--line);
}

.timeline-item.completed .timeline-content {
  background: #f0f9eb;
  border-left-color: #67c23a;
}

.timeline-item.in-progress .timeline-content {
  background: #fffbe6;
  border-left-color: var(--gold);
}

.timeline-item.pending .timeline-content {
  background: var(--bg-soft);
  border-left-color: #c0c4cc;
}

.timeline-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.timeline-order {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--navy);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.78rem;
  font-family: var(--font-mono);
}

.timeline-header h4 {
  flex: 1;
  font-size: 1rem;
  color: var(--ink);
  font-weight: 600;
}

.timeline-desc {
  color: var(--muted);
  font-size: 0.85rem;
  line-height: 1.6;
  margin: 0;
}

.next-step-section {
  margin-top: 4px;
}

.next-step-section :deep(.el-alert) {
  border-radius: 12px;
  border: 1px solid var(--line);
}

.next-step-content ul {
  margin-top: 8px;
  padding-left: 18px;
}

.next-step-content li {
  margin-bottom: 4px;
  color: var(--muted);
  font-size: 0.88rem;
}

.composition-learning-entry {
  margin-top: 14px;
}

.composition-learning-entry .entry-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.composition-learning-entry .entry-text {
  font-size: 0.88rem;
  color: var(--muted);
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 12px;
  }
  .header-content > div:first-child {
    text-align: center;
  }
  .page-title {
    font-size: 1.2rem;
  }
  .visual-link-btn {
    width: 100%;
    font-size: 0.88rem;
  }
  .progress-overview {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .overview-card {
    padding: 16px;
  }
  .subjects-grid {
    grid-template-columns: 1fr;
  }
  .subjects-section,
  .timeline-section {
    padding: 16px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .overview-card,
  .subject-card {
    transition: none;
  }
}
</style>

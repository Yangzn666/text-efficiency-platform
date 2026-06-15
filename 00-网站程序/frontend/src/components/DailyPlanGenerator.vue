<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStudyStore } from '@/stores/study'
import { ElMessage } from 'element-plus'
import { Calendar, Clock, Target, Check } from '@element-plus/icons-vue'

const studyStore = useStudyStore()

// 今日计划任务
const todayTasks = ref<any[]>([])
const completedTasks = ref<Set<string>>(new Set())

// 计算属性
const completionRate = computed(() => {
  if (todayTasks.value.length === 0) return 0
  return Math.round((completedTasks.value.size / todayTasks.value.length) * 100)
})

const remainingTasks = computed(() => {
  return todayTasks.value.length - completedTasks.value.size
})

const totalDuration = computed(() => {
  return todayTasks.value.reduce((sum, task) => {
    return completedTasks.value.has(task.id) ? sum : sum + task.duration
  }, 0)
})

// 六月冲刺计划数据
const junePlanData: any = {
  '2026-06-14': {
    tasks: [
      { id: 'math_1', subject: '数学一', title: '武忠祥高数第3章视频（中值定理）+ 笔记整理', duration: 90, priority: 'high', type: 'study', color: '#409EFF' },
      { id: 'math_2', subject: '数学一', title: '1000题第3章基础题练习', duration: 60, priority: 'high', type: 'practice', color: '#409EFF' },
      { id: 'cs_1', subject: '408专业课', title: '操作系统第3章（内存管理）学习 + 课后习题', duration: 90, priority: 'high', type: 'study', color: '#67C23A' },
      { id: 'eng_1', subject: '英语一', title: '背单词30分钟', duration: 30, priority: 'high', type: 'vocabulary', color: '#E6A23C' },
      { id: 'eng_2', subject: '英语一', title: '长难句分析30分钟', duration: 30, priority: 'medium', type: 'grammar', color: '#E6A23C' }
    ]
  },
  '2026-06-15': {
    tasks: [
      { id: 'math_1', subject: '数学一', title: '继续高数第3章剩余内容', duration: 60, priority: 'high', type: 'study', color: '#409EFF' },
      { id: 'math_2', subject: '数学一', title: '1000题B组第3章', duration: 60, priority: 'high', type: 'practice', color: '#409EFF' },
      { id: 'cs_1', subject: '408专业课', title: '操作系统第3章深入（虚拟内存、页面置换）', duration: 60, priority: 'high', type: 'study', color: '#67C23A' },
      { id: 'cs_2', subject: '408专业课', title: '王道习题集对应章节', duration: 60, priority: 'medium', type: 'practice', color: '#67C23A' },
      { id: 'eng_1', subject: '英语一', title: '单词复习', duration: 30, priority: 'high', type: 'vocabulary', color: '#E6A23C' },
      { id: 'eng_2', subject: '英语一', title: '2006年阅读Text 1精读', duration: 60, priority: 'medium', type: 'reading', color: '#E6A23C' }
    ]
  },
  '2026-06-16': {
    tasks: [
      { id: 'math_1', subject: '数学一', title: '高数第4章（不定积分）开始', duration: 60, priority: 'high', type: 'study', color: '#409EFF' },
      { id: 'math_2', subject: '数学一', title: '基本积分公式记忆', duration: 30, priority: 'high', type: 'study', color: '#409EFF' },
      { id: 'math_3', subject: '数学一', title: '1000题第4章基础题', duration: 60, priority: 'medium', type: 'practice', color: '#409EFF' },
      { id: 'cs_1', subject: '408专业课', title: '操作系统第4章（文件管理）开始', duration: 60, priority: 'high', type: 'study', color: '#67C23A' },
      { id: 'cs_2', subject: '408专业课', title: '文件系统概念梳理', duration: 60, priority: 'medium', type: 'study', color: '#67C23A' },
      { id: 'eng_1', subject: '英语一', title: '单词30分钟', duration: 30, priority: 'high', type: 'vocabulary', color: '#E6A23C' },
      { id: 'eng_2', subject: '英语一', title: '语法复习（倒装句）', duration: 30, priority: 'medium', type: 'grammar', color: '#E6A23C' }
    ]
  },
  '2026-06-17': {
    tasks: [
      { id: 'math_1', subject: '数学一', title: '高数第4章继续（换元积分法）', duration: 60, priority: 'high', type: 'study', color: '#409EFF' },
      { id: 'math_2', subject: '数学一', title: '1000题第4章', duration: 60, priority: 'high', type: 'practice', color: '#409EFF' },
      { id: 'cs_1', subject: '408专业课', title: '操作系统第4章深入（目录结构、磁盘管理）', duration: 60, priority: 'high', type: 'study', color: '#67C23A' },
      { id: 'cs_2', subject: '408专业课', title: '习题练习', duration: 60, priority: 'medium', type: 'practice', color: '#67C23A' },
      { id: 'eng_1', subject: '英语一', title: '单词30分钟', duration: 30, priority: 'high', type: 'vocabulary', color: '#E6A23C' },
      { id: 'eng_2', subject: '英语一', title: '2006年阅读Text 2精读', duration: 60, priority: 'medium', type: 'reading', color: '#E6A23C' }
    ]
  },
  '2026-06-18': {
    tasks: [
      { id: 'math_1', subject: '数学一', title: '高数第4章收尾（分部积分法）', duration: 60, priority: 'high', type: 'study', color: '#409EFF' },
      { id: 'math_2', subject: '数学一', title: '综合练习', duration: 60, priority: 'medium', type: 'practice', color: '#409EFF' },
      { id: 'cs_1', subject: '408专业课', title: '操作系统第4章完成', duration: 60, priority: 'high', type: 'study', color: '#67C23A' },
      { id: 'cs_2', subject: '408专业课', title: '本章重点整理', duration: 60, priority: 'medium', type: 'review', color: '#67C23A' },
      { id: 'eng_1', subject: '英语一', title: '单词30分钟', duration: 30, priority: 'high', type: 'vocabulary', color: '#E6A23C' },
      { id: 'eng_2', subject: '英语一', title: '翻译练习30分钟', duration: 30, priority: 'medium', type: 'translation', color: '#E6A23C' },
      { id: 'math_3', subject: '数学一', title: '本周内容复盘（第3-4章）', duration: 60, priority: 'medium', type: 'review', color: '#409EFF' }
    ]
  },
  '2026-06-19': {
    tasks: [
      { id: 'math_1', subject: '数学一', title: '高数第5章（定积分）开始', duration: 60, priority: 'high', type: 'study', color: '#409EFF' },
      { id: 'math_2', subject: '数学一', title: '牛顿-莱布尼茨公式', duration: 30, priority: 'high', type: 'study', color: '#409EFF' },
      { id: 'math_3', subject: '数学一', title: '1000题第5章基础题', duration: 60, priority: 'medium', type: 'practice', color: '#409EFF' },
      { id: 'cs_1', subject: '408专业课', title: '操作系统第5章（I/O管理）开始', duration: 60, priority: 'high', type: 'study', color: '#67C23A' },
      { id: 'cs_2', subject: '408专业课', title: 'I/O控制方式', duration: 60, priority: 'medium', type: 'study', color: '#67C23A' },
      { id: 'eng_1', subject: '英语一', title: '单词30分钟', duration: 30, priority: 'high', type: 'vocabulary', color: '#E6A23C' },
      { id: 'eng_2', subject: '英语一', title: '2006年阅读Text 3精读', duration: 60, priority: 'medium', type: 'reading', color: '#E6A23C' }
    ]
  },
  '2026-06-20': {
    tasks: [
      { id: 'math_1', subject: '数学一', title: '高数第5章继续', duration: 60, priority: 'high', type: 'study', color: '#409EFF' },
      { id: 'math_2', subject: '数学一', title: '1000题第5章', duration: 60, priority: 'high', type: 'practice', color: '#409EFF' },
      { id: 'cs_1', subject: '408专业课', title: '操作系统第5章完成', duration: 60, priority: 'high', type: 'study', color: '#67C23A' },
      { id: 'cs_2', subject: '408专业课', title: '全书复习框架梳理', duration: 60, priority: 'medium', type: 'review', color: '#67C23A' },
      { id: 'eng_1', subject: '英语一', title: '单词40分钟', duration: 40, priority: 'high', type: 'vocabulary', color: '#E6A23C' },
      { id: 'eng_2', subject: '英语一', title: '2006年阅读Text 4精读', duration: 60, priority: 'medium', type: 'reading', color: '#E6A23C' },
      { id: 'math_3', subject: '数学一', title: '本周错题集中突破', duration: 60, priority: 'medium', type: 'review', color: '#409EFF' },
      { id: 'review_1', subject: '总结', title: '周总结：检查进度，调整下周计划', duration: 30, priority: 'low', type: 'review', color: '#909399' }
    ]
  },
  '2026-06-21': {
    tasks: [
      { id: 'math_1', subject: '数学一', title: '高数第6章（定积分应用）开始', duration: 60, priority: 'high', type: 'study', color: '#409EFF' },
      { id: 'math_2', subject: '数学一', title: '几何应用（面积、体积）', duration: 60, priority: 'high', type: 'study', color: '#409EFF' },
      { id: 'math_3', subject: '数学一', title: '1000题第6章', duration: 60, priority: 'medium', type: 'practice', color: '#409EFF' },
      { id: 'cs_1', subject: '408专业课', title: '计算机网络第1章（概述）开始', duration: 60, priority: 'high', type: 'study', color: '#67C23A' },
      { id: 'cs_2', subject: '408专业课', title: '网络体系结构', duration: 60, priority: 'medium', type: 'study', color: '#67C23A' },
      { id: 'eng_1', subject: '英语一', title: '单词30分钟', duration: 30, priority: 'high', type: 'vocabulary', color: '#E6A23C' },
      { id: 'eng_2', subject: '英语一', title: '完型填空练习', duration: 30, priority: 'medium', type: 'practice', color: '#E6A23C' }
    ]
  },
  '2026-06-22': {
    tasks: [
      { id: 'math_1', subject: '数学一', title: '高数第6章完成 + 物理应用', duration: 60, priority: 'high', type: 'study', color: '#409EFF' },
      { id: 'math_2', subject: '数学一', title: '1000题第6章', duration: 60, priority: 'high', type: 'practice', color: '#409EFF' },
      { id: 'cs_1', subject: '408专业课', title: '计网第1章完成 + 性能指标计算', duration: 60, priority: 'high', type: 'study', color: '#67C23A' },
      { id: 'cs_2', subject: '408专业课', title: '课后习题', duration: 60, priority: 'medium', type: 'practice', color: '#67C23A' },
      { id: 'eng_1', subject: '英语一', title: '单词30分钟', duration: 30, priority: 'high', type: 'vocabulary', color: '#E6A23C' },
      { id: 'eng_2', subject: '英语一', title: '2007年阅读Text 1精读', duration: 60, priority: 'medium', type: 'reading', color: '#E6A23C' }
    ]
  },
  '2026-06-23': {
    tasks: [
      { id: 'math_1', subject: '数学一', title: '高数第7章（多元函数微分学）开始', duration: 60, priority: 'high', type: 'study', color: '#409EFF' },
      { id: 'math_2', subject: '数学一', title: '偏导数、全微分', duration: 60, priority: 'high', type: 'study', color: '#409EFF' },
      { id: 'math_3', subject: '数学一', title: '1000题第7章基础题', duration: 60, priority: 'medium', type: 'practice', color: '#409EFF' },
      { id: 'cs_1', subject: '408专业课', title: '计网第2章（物理层）开始', duration: 60, priority: 'high', type: 'study', color: '#67C23A' },
      { id: 'cs_2', subject: '408专业课', title: '传输介质、编码调制', duration: 60, priority: 'medium', type: 'study', color: '#67C23A' },
      { id: 'eng_1', subject: '英语一', title: '单词30分钟', duration: 30, priority: 'high', type: 'vocabulary', color: '#E6A23C' },
      { id: 'eng_2', subject: '英语一', title: '长难句专项30分钟', duration: 30, priority: 'medium', type: 'grammar', color: '#E6A23C' }
    ]
  },
  '2026-06-24': {
    tasks: [
      { id: 'math_1', subject: '数学一', title: '高数第7章继续（极值、条件极值）', duration: 60, priority: 'high', type: 'study', color: '#409EFF' },
      { id: 'math_2', subject: '数学一', title: '1000题第7章', duration: 60, priority: 'high', type: 'practice', color: '#409EFF' },
      { id: 'cs_1', subject: '408专业课', title: '计网第2章完成 + 信道容量', duration: 60, priority: 'high', type: 'study', color: '#67C23A' },
      { id: 'cs_2', subject: '408专业课', title: '习题练习', duration: 60, priority: 'medium', type: 'practice', color: '#67C23A' },
      { id: 'eng_1', subject: '英语一', title: '单词30分钟', duration: 30, priority: 'high', type: 'vocabulary', color: '#E6A23C' },
      { id: 'eng_2', subject: '英语一', title: '2007年阅读Text 2精读', duration: 60, priority: 'medium', type: 'reading', color: '#E6A23C' }
    ]
  },
  '2026-06-25': {
    tasks: [
      { id: 'math_1', subject: '数学一', title: '高数第8章（二重积分）开始', duration: 60, priority: 'high', type: 'study', color: '#409EFF' },
      { id: 'math_2', subject: '数学一', title: '直角坐标计算', duration: 60, priority: 'high', type: 'study', color: '#409EFF' },
      { id: 'math_3', subject: '数学一', title: '1000题第8章基础题', duration: 60, priority: 'medium', type: 'practice', color: '#409EFF' },
      { id: 'cs_1', subject: '408专业课', title: '计网第3章（数据链路层）开始', duration: 60, priority: 'high', type: 'study', color: '#67C23A' },
      { id: 'cs_2', subject: '408专业课', title: '帧、差错控制', duration: 60, priority: 'medium', type: 'study', color: '#67C23A' },
      { id: 'eng_1', subject: '英语一', title: '单词30分钟', duration: 30, priority: 'high', type: 'vocabulary', color: '#E6A23C' },
      { id: 'eng_2', subject: '英语一', title: '翻译练习30分钟', duration: 30, priority: 'medium', type: 'translation', color: '#E6A23C' }
    ]
  },
  '2026-06-26': {
    tasks: [
      { id: 'math_1', subject: '数学一', title: '高数第8章继续（极坐标、换元法）', duration: 60, priority: 'high', type: 'study', color: '#409EFF' },
      { id: 'math_2', subject: '数学一', title: '1000题第8章', duration: 60, priority: 'high', type: 'practice', color: '#409EFF' },
      { id: 'cs_1', subject: '408专业课', title: '计网第3章继续（MAC协议、以太网）', duration: 60, priority: 'high', type: 'study', color: '#67C23A' },
      { id: 'cs_2', subject: '408专业课', title: '习题练习', duration: 60, priority: 'medium', type: 'practice', color: '#67C23A' },
      { id: 'eng_1', subject: '英语一', title: '单词30分钟', duration: 30, priority: 'high', type: 'vocabulary', color: '#E6A23C' },
      { id: 'eng_2', subject: '英语一', title: '2007年阅读Text 3精读', duration: 60, priority: 'medium', type: 'reading', color: '#E6A23C' }
    ]
  },
  '2026-06-27': {
    tasks: [
      { id: 'math_1', subject: '数学一', title: '高数第8章完成 + 综合应用', duration: 60, priority: 'high', type: 'study', color: '#409EFF' },
      { id: 'math_2', subject: '数学一', title: '1000题第8章难题突破', duration: 60, priority: 'high', type: 'practice', color: '#409EFF' },
      { id: 'cs_1', subject: '408专业课', title: '计网第3章完成', duration: 60, priority: 'high', type: 'study', color: '#67C23A' },
      { id: 'cs_2', subject: '408专业课', title: '前三章知识框架梳理', duration: 60, priority: 'medium', type: 'review', color: '#67C23A' },
      { id: 'eng_1', subject: '英语一', title: '单词40分钟', duration: 40, priority: 'high', type: 'vocabulary', color: '#E6A23C' },
      { id: 'eng_2', subject: '英语一', title: '2007年阅读Text 4精读', duration: 60, priority: 'medium', type: 'reading', color: '#E6A23C' },
      { id: 'math_3', subject: '数学一', title: '本周内容系统复习', duration: 60, priority: 'medium', type: 'review', color: '#409EFF' },
      { id: 'review_1', subject: '总结', title: '周总结：评估进度，准备下周冲刺', duration: 30, priority: 'low', type: 'review', color: '#909399' }
    ]
  },
  '2026-06-28': {
    tasks: [
      { id: 'math_1', subject: '数学一', title: '高数第9章（三重积分）开始', duration: 60, priority: 'high', type: 'study', color: '#409EFF' },
      { id: 'math_2', subject: '数学一', title: '直角坐标、柱面坐标', duration: 60, priority: 'high', type: 'study', color: '#409EFF' },
      { id: 'math_3', subject: '数学一', title: '1000题第9章基础题', duration: 60, priority: 'medium', type: 'practice', color: '#409EFF' },
      { id: 'cs_1', subject: '408专业课', title: '计网第4章（网络层）开始', duration: 60, priority: 'high', type: 'study', color: '#67C23A' },
      { id: 'cs_2', subject: '408专业课', title: 'IP协议、路由算法', duration: 60, priority: 'medium', type: 'study', color: '#67C23A' },
      { id: 'eng_1', subject: '英语一', title: '单词30分钟', duration: 30, priority: 'high', type: 'vocabulary', color: '#E6A23C' },
      { id: 'eng_2', subject: '英语一', title: '新题型练习30分钟', duration: 30, priority: 'medium', type: 'practice', color: '#E6A23C' }
    ]
  },
  '2026-06-29': {
    tasks: [
      { id: 'math_1', subject: '数学一', title: '高数第9章完成 + 球面坐标', duration: 60, priority: 'high', type: 'study', color: '#409EFF' },
      { id: 'math_2', subject: '数学一', title: '1000题第9章', duration: 60, priority: 'high', type: 'practice', color: '#409EFF' },
      { id: 'cs_1', subject: '408专业课', title: '计网第4章继续（NAT、ICMP、IPv6）', duration: 60, priority: 'high', type: 'study', color: '#67C23A' },
      { id: 'cs_2', subject: '408专业课', title: '习题练习', duration: 60, priority: 'medium', type: 'practice', color: '#67C23A' },
      { id: 'eng_1', subject: '英语一', title: '单词30分钟', duration: 30, priority: 'high', type: 'vocabulary', color: '#E6A23C' },
      { id: 'eng_2', subject: '英语一', title: '2008年阅读Text 1精读', duration: 60, priority: 'medium', type: 'reading', color: '#E6A23C' }
    ]
  },
  '2026-06-30': {
    tasks: [
      { id: 'math_1', subject: '数学一', title: '高数第10章（曲线曲面积分）开始', duration: 60, priority: 'high', type: 'study', color: '#409EFF' },
      { id: 'math_2', subject: '数学一', title: '第一类曲线积分', duration: 60, priority: 'high', type: 'study', color: '#409EFF' },
      { id: 'cs_1', subject: '408专业课', title: '计网第4章完成', duration: 60, priority: 'high', type: 'study', color: '#67C23A' },
      { id: 'cs_2', subject: '408专业课', title: '本月学习内容总复习', duration: 60, priority: 'medium', type: 'review', color: '#67C23A' },
      { id: 'eng_1', subject: '英语一', title: '单词40分钟', duration: 40, priority: 'high', type: 'vocabulary', color: '#E6A23C' },
      { id: 'eng_2', subject: '英语一', title: '本月学习总结', duration: 40, priority: 'medium', type: 'review', color: '#E6A23C' },
      { id: 'math_3', subject: '数学一', title: '本月进度评估 + 七月计划制定', duration: 60, priority: 'medium', type: 'review', color: '#409EFF' },
      { id: 'review_1', subject: '总结', title: '月度总结：统计各科学习时长、分析完成情况、调整七月目标', duration: 30, priority: 'low', type: 'review', color: '#909399' }
    ]
  }
}

// 生成今日计划
const generateTodayPlan = () => {
  const today = new Date().toISOString().split('T')[0]
  
  // 查找今日计划
  const todayPlan = junePlanData[today]
  
  if (todayPlan) {
    todayTasks.value = todayPlan.tasks
  } else {
    // 如果没有找到对应日期的计划，显示默认提示
    todayTasks.value = [
      {
        id: 'default_1',
        subject: '提示',
        title: '今日无特定计划',
        description: '当前日期不在六月冲刺计划范围内（6.14-6.30）。请查看计划文档或联系管理员更新计划。',
        duration: 0,
        priority: 'low',
        type: 'info',
        color: '#909399'
      }
    ]
  }
}

// 切换任务完成状态
const toggleTask = (taskId: string) => {
  if (completedTasks.value.has(taskId)) {
    completedTasks.value.delete(taskId)
    ElMessage.info('任务标记为未完成')
  } else {
    completedTasks.value.add(taskId)
    ElMessage.success('任务完成！+10积分')
  }
}

// 获取优先级标签
const getPriorityLabel = (priority: string) => {
  const labels: any = {
    high: '高优先级',
    medium: '中优先级',
    low: '低优先级'
  }
  return labels[priority] || priority
}

const getPriorityColor = (priority: string) => {
  const colors: any = {
    high: '#F56C6C',
    medium: '#E6A23C',
    low: '#909399'
  }
  return colors[priority] || '#909399'
}

onMounted(() => {
  generateTodayPlan()
})
</script>

<template>
  <div class="daily-plan-generator">
    <!-- 顶部统计 -->
    <div class="plan-stats">
      <div class="stat-card">
        <div class="stat-icon">📋</div>
        <div class="stat-info">
          <div class="stat-value">{{ todayTasks.length }}</div>
          <div class="stat-label">总任务数</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-info">
          <div class="stat-value">{{ completedTasks.size }}</div>
          <div class="stat-label">已完成</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">⏰</div>
        <div class="stat-info">
          <div class="stat-value">{{ remainingTasks }}</div>
          <div class="stat-label">待完成</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">🎯</div>
        <div class="stat-info">
          <div class="stat-value">{{ completionRate }}%</div>
          <div class="stat-label">完成率</div>
        </div>
      </div>
    </div>

    <!-- 进度条 -->
    <div class="progress-section">
      <div class="progress-header">
        <span>今日进度</span>
        <span>{{ completionRate }}%</span>
      </div>
      <el-progress 
        :percentage="completionRate" 
        :color="completionRate >= 80 ? '#67C23A' : completionRate >= 50 ? '#E6A23C' : '#409EFF'"
        :stroke-width="12"
      />
      <div class="time-estimate">
        预计还需 {{ totalDuration }} 分钟完成剩余任务
      </div>
    </div>

    <!-- 任务列表 -->
    <div class="tasks-section">
      <h3 class="section-title">
        <el-icon><Calendar /></el-icon>
        今日学习计划
      </h3>
      
      <div class="task-list">
        <div 
          v-for="task in todayTasks" 
          :key="task.id"
          class="task-card"
          :class="{ completed: completedTasks.has(task.id) }"
        >
          <div class="task-header">
            <div class="task-subject" :style="{ backgroundColor: task.color }">
              {{ task.subject }}
            </div>
            <div class="task-priority" :style="{ color: getPriorityColor(task.priority) }">
              {{ getPriorityLabel(task.priority) }}
            </div>
          </div>
          
          <div class="task-content">
            <h4 class="task-title">{{ task.title }}</h4>
            <p v-if="task.description" class="task-description">{{ task.description }}</p>
          </div>
          
          <div class="task-footer">
            <div class="task-meta">
              <span class="task-duration">
                <el-icon><Clock /></el-icon>
                {{ task.duration }}分钟
              </span>
              <span class="task-type">{{ task.type }}</span>
            </div>
            
            <button 
              class="complete-btn"
              :class="{ done: completedTasks.has(task.id) }"
              @click="toggleTask(task.id)"
            >
              <el-icon v-if="completedTasks.has(task.id)"><Check /></el-icon>
              <span>{{ completedTasks.has(task.id) ? '已完成' : '标记完成' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 建议提示 -->
    <div class="suggestions">
      <h4 class="suggestion-title">💡 学习建议</h4>
      <ul class="suggestion-list">
        <li>优先完成高优先级任务，确保核心学习内容</li>
        <li>每个学习任务后休息5-10分钟，保持专注力</li>
        <li>遇到困难时不要卡太久，先标记后回头复习</li>
        <li>晚上睡前回顾今日所学，加深记忆</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.daily-plan-generator {
  max-width: 1000px;
  margin: 0 auto;
}

/* 顶部统计 */
.plan-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 25px;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.stat-icon {
  font-size: 2.5em;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 2em;
  font-weight: 700;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.9em;
  opacity: 0.9;
}

/* 进度条 */
.progress-section {
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 1.1em;
  font-weight: 600;
  color: #333;
}

.time-estimate {
  margin-top: 10px;
  text-align: center;
  color: #666;
  font-size: 0.95em;
}

/* 任务列表 */
.tasks-section {
  margin-bottom: 25px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.4em;
  color: #333;
  margin-bottom: 20px;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.task-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.task-card:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

.task-card.completed {
  opacity: 0.7;
  background: #f5f7fa;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.task-subject {
  padding: 6px 15px;
  border-radius: 20px;
  color: white;
  font-size: 0.9em;
  font-weight: 600;
}

.task-priority {
  font-size: 0.85em;
  font-weight: 600;
}

.task-content {
  margin-bottom: 15px;
}

.task-title {
  font-size: 1.2em;
  color: #333;
  margin-bottom: 8px;
}

.task-description {
  color: #666;
  font-size: 0.95em;
  line-height: 1.6;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-meta {
  display: flex;
  gap: 15px;
}

.task-duration {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #409EFF;
  font-weight: 600;
}

.task-type {
  color: #999;
  font-size: 0.9em;
}

.complete-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: 2px solid #67C23A;
  border-radius: 10px;
  background: white;
  color: #67C23A;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.complete-btn:hover {
  background: #67C23A;
  color: white;
}

.complete-btn.done {
  background: #67C23A;
  color: white;
  border-color: #67C23A;
}

/* 建议提示 */
.suggestions {
  background: linear-gradient(135deg, #fff9e6 0%, #fff3cd 100%);
  border-radius: 15px;
  padding: 25px;
  border-left: 4px solid #E6A23C;
}

.suggestion-title {
  font-size: 1.2em;
  color: #333;
  margin-bottom: 15px;
}

.suggestion-list {
  list-style: none;
  padding: 0;
}

.suggestion-list li {
  padding: 10px 0;
  color: #666;
  line-height: 1.6;
  position: relative;
  padding-left: 25px;
}

.suggestion-list li:before {
  content: "•";
  position: absolute;
  left: 10px;
  color: #E6A23C;
  font-weight: bold;
  font-size: 1.2em;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .plan-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .task-footer {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  
  .complete-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>

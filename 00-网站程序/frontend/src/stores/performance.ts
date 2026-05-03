import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface PerformanceMetrics {
  loadTime: number
  firstPaint: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  cumulativeLayoutShift: number
  firstInputDelay: number
  timeToInteractive: number
}

interface ResourceUsage {
  memory: number
  cpu: number
  storage: number
}

interface OptimizationSuggestion {
  id: string
  category: 'performance' | 'memory' | 'network' | 'ui'
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  impact: 'severe' | 'moderate' | 'minor'
  solution: string
  implemented: boolean
}

export const usePerformanceStore = defineStore('performance', () => {
  // 状态
  const metrics = ref<PerformanceMetrics>({
    loadTime: 0,
    firstPaint: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    cumulativeLayoutShift: 0,
    firstInputDelay: 0,
    timeToInteractive: 0
  })
  
  const resourceUsage = ref<ResourceUsage>({
    memory: 0,
    cpu: 0,
    storage: 0
  })
  
  const suggestions = ref<OptimizationSuggestion[]>([])
  const isMonitoring = ref(false)
  const isLoading = ref(false)

  // 计算属性
  const overallScore = computed(() => {
    // 基于各项指标计算综合性能分数 (0-100)
    const scores = [
      Math.max(0, 100 - (metrics.value.loadTime / 100)),
      Math.max(0, 100 - (metrics.value.firstContentfulPaint / 50)),
      Math.max(0, 100 - (metrics.value.largestContentfulPaint / 250)),
      Math.max(0, 100 - (metrics.value.cumulativeLayoutShift * 1000)),
      Math.max(0, 100 - (metrics.value.firstInputDelay / 10)),
      Math.max(0, 100 - (metrics.value.timeToInteractive / 200))
    ]
    
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
  })

  const highPrioritySuggestions = computed(() => {
    return suggestions.value.filter(s => s.priority === 'high' && !s.implemented)
  })

  const performanceGrade = computed(() => {
    const score = overallScore.value
    if (score >= 90) return { grade: 'A', color: '#67C23A' }
    if (score >= 80) return { grade: 'B', color: '#E6A23C' }
    if (score >= 70) return { grade: 'C', color: '#F56C6C' }
    return { grade: 'D', color: '#909399' }
  })

  // 方法
  const startMonitoring = async () => {
    isMonitoring.value = true
    try {
      await collectPerformanceMetrics()
      await analyzeResourceUsage()
      await generateSuggestions()
    } catch (error) {
      console.error('性能监控启动失败:', error)
    }
  }

  const stopMonitoring = () => {
    isMonitoring.value = false
  }

  const collectPerformanceMetrics = async () => {
    isLoading.value = true
    try {
      // 收集页面性能数据
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      const paint = performance.getEntriesByType('paint')
      const lcp = performance.getEntriesByType('largest-contentful-paint')[0]
      
      if (navigation) {
        metrics.value.loadTime = navigation.loadEventEnd - navigation.fetchStart
        metrics.value.firstPaint = paint.find(p => p.name === 'first-paint')?.startTime || 0
        metrics.value.firstContentfulPaint = paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0
        metrics.value.timeToInteractive = navigation.domContentLoadedEventEnd - navigation.fetchStart
      }
      
      if (lcp) {
        metrics.value.largestContentfulPaint = lcp.startTime
      }
      
      // 模拟CLS和FID数据
      metrics.value.cumulativeLayoutShift = Math.random() * 0.1
      metrics.value.firstInputDelay = Math.random() * 20
      
    } catch (error) {
      console.error('性能数据收集失败:', error)
    } finally {
      isLoading.value = false
    }
  }

  const analyzeResourceUsage = async () => {
    try {
      // 检查内存使用情况
      if ('memory' in performance) {
        const memoryInfo = (performance as any).memory
        resourceUsage.value.memory = Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024) // MB
      }
      
      // 模拟CPU和存储使用
      resourceUsage.value.cpu = Math.round(Math.random() * 50)
      resourceUsage.value.storage = Math.round(localStorage.length * 0.1) // KB估算
      
    } catch (error) {
      console.error('资源使用分析失败:', error)
    }
  }

  const generateSuggestions = async () => {
    suggestions.value = []
    
    // 基于性能指标生成优化建议
    if (metrics.value.loadTime > 3000) {
      suggestions.value.push({
        id: 'load_time_optimization',
        category: 'performance',
        priority: 'high',
        title: '页面加载时间过长',
        description: `当前页面加载时间为${(metrics.value.loadTime / 1000).toFixed(1)}秒，超过推荐值3秒`,
        impact: 'severe',
        solution: '优化图片资源、启用代码分割、使用懒加载技术',
        implemented: false
      })
    }
    
    if (metrics.value.firstContentfulPaint > 2000) {
      suggestions.value.push({
        id: 'fcp_optimization',
        category: 'performance',
        priority: 'high',
        title: '首次内容绘制延迟',
        description: `FCP时间为${metrics.value.firstContentfulPaint.toFixed(0)}毫秒，影响用户体验`,
        impact: 'moderate',
        solution: '优化关键渲染路径、减少阻塞资源、预加载关键资源',
        implemented: false
      })
    }
    
    if (resourceUsage.value.memory > 100) {
      suggestions.value.push({
        id: 'memory_optimization',
        category: 'memory',
        priority: 'medium',
        title: '内存使用较高',
        description: `当前内存使用${resourceUsage.value.memory}MB，可能影响性能`,
        impact: 'moderate',
        solution: '优化数据结构、及时清理无用对象、使用虚拟滚动',
        implemented: false
      })
    }
    
    if (metrics.value.cumulativeLayoutShift > 0.1) {
      suggestions.value.push({
        id: 'cls_optimization',
        category: 'ui',
        priority: 'medium',
        title: '布局偏移问题',
        description: `CLS值为${metrics.value.cumulativeLayoutShift.toFixed(3)}，影响视觉稳定性`,
        impact: 'minor',
        solution: '为媒体元素设置明确尺寸、避免动态插入内容',
        implemented: false
      })
    }
    
    // 通用优化建议
    suggestions.value.push({
      id: 'general_optimization',
      category: 'performance',
      priority: 'low',
      title: '常规性能优化',
      description: '实施通用的前端性能优化措施',
      impact: 'minor',
      solution: '启用Gzip压缩、使用CDN、优化缓存策略',
      implemented: false
    })
  }

  const implementSuggestion = async (suggestionId: string) => {
    const suggestion = suggestions.value.find(s => s.id === suggestionId)
    if (suggestion) {
      suggestion.implemented = true
      
      // 模拟优化实施过程
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 重新收集数据以验证效果
      await collectPerformanceMetrics()
      await generateSuggestions()
      
      return true
    }
    return false
  }

  const clearPerformanceData = () => {
    metrics.value = {
      loadTime: 0,
      firstPaint: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      cumulativeLayoutShift: 0,
      firstInputDelay: 0,
      timeToInteractive: 0
    }
    
    resourceUsage.value = {
      memory: 0,
      cpu: 0,
      storage: 0
    }
    
    suggestions.value = []
  }

  const exportPerformanceReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      metrics: metrics.value,
      resourceUsage: resourceUsage.value,
      overallScore: overallScore.value,
      grade: performanceGrade.value.grade,
      suggestions: suggestions.value,
      userAgent: navigator.userAgent
    }
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = `性能报告_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    
    URL.revokeObjectURL(url)
  }

  return {
    // 状态
    metrics,
    resourceUsage,
    suggestions,
    isMonitoring,
    isLoading,
    
    // 计算属性
    overallScore,
    highPrioritySuggestions,
    performanceGrade,
    
    // 方法
    startMonitoring,
    stopMonitoring,
    collectPerformanceMetrics,
    analyzeResourceUsage,
    generateSuggestions,
    implementSuggestion,
    clearPerformanceData,
    exportPerformanceReport
  }
})
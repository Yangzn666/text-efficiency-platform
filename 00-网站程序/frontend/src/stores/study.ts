import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import localforage from 'localforage'
import { usePsychologyStore } from './psychology'
import { buildApiUrl } from '@/utils/apiConfig'
import { isCloudSyncEnabled, pullFromCloud, pushToCloudDebounced } from '@/utils/cloudSync'

// 学习记录云同步表名（与 today_status 分开存放）
const STUDY_TABLE = 'study_data'

interface StudyRecord {
  id: string
  date: string
  subject: string
  duration: number // 分钟
  content: string
  type: 'study' | 'review' | 'practice' | 'exam'
  createdAt: string
}

interface SubjectProgress {
  [subject: string]: {
    totalTime: number
    lastStudyDate: string
    weeklyGoal: number
    completionRate: number
  }
}

export const useStudyStore = defineStore('study', () => {
  // 状态
  const studyRecords = ref<StudyRecord[]>([])
  const subjectProgress = ref<SubjectProgress>({})
  const isLoading = ref(false)
  const currentStreak = ref(0)

  // 计算属性
  const todayStudyTime = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return studyRecords.value
      .filter(record => record.date === today)
      .reduce((total, record) => total + record.duration, 0)
  })

  const weeklyStudyTime = computed(() => {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    return studyRecords.value
      .filter(record => new Date(record.date) >= oneWeekAgo)
      .reduce((total, record) => total + record.duration, 0)
  })

  const monthlyStudyTime = computed(() => {
    const today = new Date()
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    
    return studyRecords.value
      .filter(record => new Date(record.date) >= firstDayOfMonth)
      .reduce((total, record) => total + record.duration, 0)
  })

  const yearlyStudyTime = computed(() => {
    const today = new Date()
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1)
    
    return studyRecords.value
      .filter(record => new Date(record.date) >= firstDayOfYear)
      .reduce((total, record) => total + record.duration, 0)
  })

  const totalStudyDays = computed(() => {
    const uniqueDates = new Set(studyRecords.value.map(record => record.date))
    return uniqueDates.size
  })

  const subjectStats = computed(() => {
    const stats: Record<string, { totalTime: number; sessions: number }> = {}
    
    studyRecords.value.forEach(record => {
      if (!stats[record.subject]) {
        stats[record.subject] = { totalTime: 0, sessions: 0 }
      }
      stats[record.subject].totalTime += record.duration
      stats[record.subject].sessions += 1
    })
    
    return stats
  })

  // 将学习记录同步到云端（Supabase study_data 表），跨设备可用
  const syncStudyToCloud = () => {
    if (!isCloudSyncEnabled) return
    pushToCloudDebounced(
      {
        studyRecords: studyRecords.value,
        subjectProgress: subjectProgress.value,
        _updatedAt: Date.now()
      },
      1500,
      STUDY_TABLE
    )
  }

  // 方法
  const addStudyRecord = async (record: Omit<StudyRecord, 'id' | 'createdAt'>) => {
    isLoading.value = true
    try {
      const newRecord: StudyRecord = {
        ...record,
        id: 'record_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString()
      }
      
      studyRecords.value.push(newRecord)
      
      // 更新科目进度
      updateSubjectProgress(record.subject, record.duration)
      
      // 给予积分奖励
      const psychologyStore = usePsychologyStore()
      psychologyStore.integrateWithStudy(record.duration, record.subject)
      
      // 保存到本地存储
      await localforage.setItem('studyRecords', studyRecords.value)
      await localforage.setItem('subjectProgress', subjectProgress.value)
      
      // 同步到云端
      syncStudyToCloud()
      
      return { success: true, record: newRecord }
    } catch (error) {
      return { success: false, error: '添加学习记录失败' }
    } finally {
      isLoading.value = false
    }
  }

  const updateSubjectProgress = (subject: string, duration: number) => {
    if (!subjectProgress.value[subject]) {
      subjectProgress.value[subject] = {
        totalTime: 0,
        lastStudyDate: '',
        weeklyGoal: 300, // 默认每周300分钟
        completionRate: 0
      }
    }
    
    const progress = subjectProgress.value[subject]
    progress.totalTime += duration
    progress.lastStudyDate = new Date().toISOString().split('T')[0]
    
    // 计算完成率
    const weeklyTime = getWeeklySubjectTime(subject)
    progress.completionRate = Math.min(100, (weeklyTime / progress.weeklyGoal) * 100)
  }

  const getWeeklySubjectTime = (subject: string): number => {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    return studyRecords.value
      .filter(record => 
        record.subject === subject && 
        new Date(record.date) >= oneWeekAgo
      )
      .reduce((total, record) => total + record.duration, 0)
  }

  const getStudyRecordsByDate = (date: string): StudyRecord[] => {
    return studyRecords.value.filter(record => record.date === date)
  }

  const getMonthlyReport = (year: number, month: number) => {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)
    
    const monthlyRecords = studyRecords.value.filter(record => {
      const recordDate = new Date(record.date)
      return recordDate >= startDate && recordDate <= endDate
    })
    
    const dailyStats: Record<string, number> = {}
    const subjectStats: Record<string, number> = {}
    
    monthlyRecords.forEach(record => {
      // 按日期统计
      if (!dailyStats[record.date]) {
        dailyStats[record.date] = 0
      }
      dailyStats[record.date] += record.duration
      
      // 按科目统计
      if (!subjectStats[record.subject]) {
        subjectStats[record.subject] = 0
      }
      subjectStats[record.subject] += record.duration
    })
    
    return {
      totalHours: monthlyRecords.reduce((sum, record) => sum + record.duration, 0) / 60,
      studyDays: Object.keys(dailyStats).length,
      averageDaily: Object.values(dailyStats).reduce((sum, time) => sum + time, 0) / Object.keys(dailyStats).length,
      subjectDistribution: subjectStats,
      dailyRecords: dailyStats
    }
  }

  const initializeStudyData = async () => {
    isLoading.value = true
    try {
      // 1. 优先从云端加载（跨设备可用）
      if (isCloudSyncEnabled) {
        try {
          console.log('☁️ 从云端加载学习数据...')
          const remote = await pullFromCloud(STUDY_TABLE)
          const payload = remote?.data as {
            studyRecords?: StudyRecord[]
            subjectProgress?: SubjectProgress
          } | undefined
          if (payload && Array.isArray(payload.studyRecords) && payload.studyRecords.length > 0) {
            studyRecords.value = payload.studyRecords
            if (payload.subjectProgress) {
              subjectProgress.value = payload.subjectProgress
            }
            console.log(`✅ 云端加载了 ${payload.studyRecords.length} 条学习记录`)
            // 同步一份到本地缓存，离线也能用
            await localforage.setItem('studyRecords', studyRecords.value)
            await localforage.setItem('subjectProgress', subjectProgress.value)
            return
          }
        } catch (error) {
          console.warn('⚠️  云端加载失败，回退到后端/本地数据', error)
        }
      }

      // 2. 回退：从后端 API加载数据（直接读取JSON文件）
      try {
        console.log('🔄 从后端 API加载学习数据...')
          
        // 添加超时控制（3秒）
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 3000)
          
        const response = await fetch(buildApiUrl('/api/study-data'), {
          signal: controller.signal
        })
          
        clearTimeout(timeoutId)
          
        if (response.ok) {
          const result = await response.json()
            
          if (result.success && result.data) {
            console.log('✅ 成功加载学习数据')
              
            if (result.data.studyRecords) {
              studyRecords.value = result.data.studyRecords
              console.log(`📊 加载了 ${result.data.studyRecords.length} 条学习记录`)
            }
              
            if (result.data.subjectProgress) {
              subjectProgress.value = result.data.subjectProgress
              console.log('📈 加载了科目进度数据')
            }

            // 后端有数据而云端为空时，回填到云端（首次种子）
            if (isCloudSyncEnabled && studyRecords.value.length > 0) {
              syncStudyToCloud()
            }
          } else {
            console.warn('⚠️  API返回数据格式错误')
          }
        } else {
          console.error('❌ API请求失败:', response.status)
        }
      } catch (error) {
        // 静默失败，不影响页面加载
        if (error instanceof DOMException && error.name === 'AbortError') {
          console.warn('⚠️  API请求超时，使用本地数据')
        } else {
          console.warn('⚠️  无法连接后端 API，使用本地数据')
        }
      }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 清除所有模拟学习数据，从今天开始记录真实数据
   * 注意：会保留3月1日的真实学习记录
   */
  const clearMockData = async () => {
    isLoading.value = true
    try {
      console.log('🧹 开始清除模拟学习数据...')
      
      // 保存3月1日的真实学习记录
      const march1Records = studyRecords.value.filter(record => record.date === '2026-03-01');
      
      // 清除本地存储中的学习数据
      await localforage.removeItem('studyRecords')
      await localforage.removeItem('subjectProgress')
      
      // 重置内存中的数据
      studyRecords.value = []
      subjectProgress.value = {}
      currentStreak.value = 0
      
      // 如果有3月1日的真实记录，重新添加
      if (march1Records.length > 0) {
        console.log(`✅ 保留 ${march1Records.length} 条3月1日真实学习记录`);
        studyRecords.value = march1Records;
        
        // 重新计算科目进度
        subjectProgress.value = {};
        march1Records.forEach(record => {
          if (!subjectProgress.value[record.subject]) {
            subjectProgress.value[record.subject] = {
              totalTime: 0,
              lastStudyDate: '',
              weeklyGoal: 300,
              completionRate: 0
            };
          }
          subjectProgress.value[record.subject].totalTime += record.duration;
          subjectProgress.value[record.subject].lastStudyDate = record.date;
          
          // 计算完成率
          const weeklyTime = march1Records
            .filter(r => r.subject === record.subject && r.date === '2026-03-01')
            .reduce((sum, r) => sum + r.duration, 0);
          subjectProgress.value[record.subject].completionRate = Math.min(100, (weeklyTime / 300) * 100);
        });
        
        // 保存到本地存储
        await localforage.setItem('studyRecords', march1Records);
        await localforage.setItem('subjectProgress', subjectProgress.value);
      }
      
      // 同步清除后的状态到云端
      syncStudyToCloud()
      
      console.log('✅ 模拟学习数据已清除，系统将从今天开始记录真实学习数据');
      
      return { success: true, message: '模拟数据已清除，保留了3月1日的真实学习记录' }
    } catch (error) {
      console.error('清除模拟数据失败:', error)
      return { success: false, error: '清除数据失败' }
    } finally {
      isLoading.value = false
    }
  }


  // 更新学习统计数据
  const updateStudyStats = async (stats: { 
    todayStudyTime?: number;
    weeklyStudyTime?: number;
    monthlyStudyTime?: number;
    yearlyStudyTime?: number 
  }) => {
    // 这个方法用于更新学习统计信息
    // 实际应用中应该通过添加具体的学习记录来更新统计
    
    console.log('Updating study stats:', stats)
    
    // 如果传入了新的学习时间数据，创建相应的学习记录
    if (stats.todayStudyTime || stats.weeklyStudyTime) {
      const duration = stats.todayStudyTime || stats.weeklyStudyTime || 0
      if (duration > 0) {
        // 创建一个模拟的学习记录
        await addStudyRecord({
          date: new Date().toISOString().split('T')[0],
          subject: '综合学习',
          duration: duration,
          content: '通过学习路径系统记录的学习时间',
          type: 'study'
        })
      }
    }
    
    // 触发计算属性重新计算
    void todayStudyTime.value
    void weeklyStudyTime.value
    void monthlyStudyTime.value
    void yearlyStudyTime.value
    
    return { success: true }
  }

  return {
    // 状态
    studyRecords,
    subjectProgress,
    isLoading,
    currentStreak,
    
    // 计算属性
    todayStudyTime,
    weeklyStudyTime,
    monthlyStudyTime,
    yearlyStudyTime,
    totalStudyDays,
    subjectStats,
    
    // 方法
    addStudyRecord,
    updateStudyStats,
    getStudyRecordsByDate,
    getMonthlyReport,
    initializeStudyData,
    clearMockData  // 添加清除模拟数据的方法
  }
})
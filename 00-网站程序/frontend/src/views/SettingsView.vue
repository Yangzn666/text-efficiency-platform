<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useStudyStore } from '@/stores/study'
import { ElMessage, ElMessageBox } from 'element-plus'

const userStore = useUserStore()
const studyStore = useStudyStore()

// 设置选项状态
const activeTab = ref('profile')
const isSaving = ref(false)
const isClearingData = ref(false)

// 用户设置
const userSettings = ref({
  nickname: userStore.displayName || '考研学子',
  email: 'student@example.com',
  avatar: '',
  notification: true,
  emailNotification: false,
  studyReminders: true,
  goalNotifications: true
})

// 学习设置
const studySettings = ref({
  dailyGoal: 180, // 分钟
  weeklyGoal: 1260, // 分钟
  focusMode: true,
  pomodoroDuration: 25, // 分钟
  breakDuration: 5, // 分钟
  autoStartNext: true,
  soundEnabled: true,
  theme: 'light'
})

// 系统设置
const systemSettings = ref({
  language: 'zh-CN',
  timezone: 'Asia/Shanghai',
  autoSync: true,
  dataBackup: true,
  cacheSize: '15.2MB',
  lastBackup: '2024-01-15'
})

// 计算属性
const studyProgress = computed(() => {
  const dailyProgress = Math.min(100, (studyStore.todayStudyTime / studySettings.value.dailyGoal) * 100)
  const weeklyProgress = Math.min(100, (studyStore.weeklyStudyTime / studySettings.value.weeklyGoal) * 100)
  return { dailyProgress, weeklyProgress }
})

// 方法
const saveSettings = async () => {
  isSaving.value = true
  try {
    // 模拟保存过程
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 更新用户存储
    userStore.updateUserProfile({
      username: userSettings.value.nickname
    })
    
    ElMessage.success('设置已保存')
  } catch (error) {
    ElMessage.error('保存失败，请重试')
  } finally {
    isSaving.value = false
  }
}

const resetSettings = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要重置所有设置到默认值吗？此操作不可撤销。',
      '确认重置',
      {
        confirmButtonText: '确定重置',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 重置到默认值
    userSettings.value = {
      nickname: '考研学子',
      email: 'student@example.com',
      avatar: '',
      notification: true,
      emailNotification: false,
      studyReminders: true,
      goalNotifications: true
    }
    
    studySettings.value = {
      dailyGoal: 180,
      weeklyGoal: 1260,
      focusMode: true,
      pomodoroDuration: 25,
      breakDuration: 5,
      autoStartNext: true,
      soundEnabled: true,
      theme: 'light'
    }
    
    ElMessage.success('设置已重置为默认值')
  } catch {
    // 用户取消操作
  }
}

const clearCache = async () => {
  try {
    await ElMessageBox.confirm(
      '清除缓存将删除本地存储的所有数据，确定要继续吗？',
      '清除缓存',
      {
        confirmButtonText: '确定清除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    localStorage.clear()
    sessionStorage.clear()
    systemSettings.value.cacheSize = '0MB'
    ElMessage.success('缓存已清除')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('清除缓存失败')
    }
  }
}

const clearMockStudyData = async () => {
  try {
    await ElMessageBox.confirm(
      '此操作将清除所有模拟的学习记录和时长数据，从今天开始记录真实的学习数据。代办事项将保持不变。是否继续？',
      '清除模拟学习数据',
      {
        confirmButtonText: '确定清除',
        cancelButtonText: '取消',
        type: 'warning',
        distinguishCancelAndClose: true
      }
    )
    
    isClearingData.value = true
    const result = await studyStore.clearMockData()
    
    if (result.success) {
      ElMessage.success(result.message)
      // 刷新页面以显示更新后的状态
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } else {
      ElMessage.error(result.error || '清除数据失败')
    }
  } catch (error) {
    if (error !== 'cancel' && error !== 'close') {
      ElMessage.error('操作失败')
    }
  } finally {
    isClearingData.value = false
  }
}

const exportData = () => {
  try {
    // 收集所有学习数据
    const dataToExport = {
      studyRecords: studyStore.studyRecords,
      todos: JSON.parse(localStorage.getItem('todos') || '[]'),
      vocabularyNotes: JSON.parse(localStorage.getItem('vocabularyNotes') || '[]'),
      exportTime: new Date().toISOString(),
      version: '1.0'
    }
    
    // 转换为JSON字符串
    const jsonString = JSON.stringify(dataToExport, null, 2)
    
    // 创建Blob对象
    const blob = new Blob([jsonString], { type: 'application/json' })
    
    // 创建下载链接
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    
    // 生成文件名（包含日期）
    const dateStr = new Date().toISOString().split('T')[0]
    link.download = `考研效率平台数据备份_${dateStr}.json`
    
    // 触发下载
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    ElMessage.success(`数据已导出！文件大小：${(blob.size / 1024).toFixed(2)} KB`)
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败，请重试')
  }
}

const importData = async () => {
  try {
    // 创建文件选择器
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      
      try {
        // 读取文件内容
        const text = await file.text()
        const importedData = JSON.parse(text)
        
        // 验证数据格式
        if (!importedData.studyRecords && !importedData.todos) {
          throw new Error('无效的数据文件格式')
        }
        
        // 确认导入
        await ElMessageBox.confirm(
          `导入后将覆盖当前数据，确定要继续吗？\n\n` +
          `- 学习记录: ${importedData.studyRecords?.length || 0} 条\n` +
          `- 待办事项: ${importedData.todos?.length || 0} 条\n` +
          `- 词汇笔记: ${importedData.vocabularyNotes?.length || 0} 条`,
          '确认导入',
          {
            confirmButtonText: '确定导入',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        
        // 导入学习记录
        if (importedData.studyRecords) {
          localStorage.setItem('studyRecords', JSON.stringify(importedData.studyRecords))
          await studyStore.initializeStudyData()
        }
        
        // 导入待办事项
        if (importedData.todos) {
          localStorage.setItem('todos', JSON.stringify(importedData.todos))
        }
        
        // 导入词汇笔记
        if (importedData.vocabularyNotes) {
          localStorage.setItem('vocabularyNotes', JSON.stringify(importedData.vocabularyNotes))
        }
        
        ElMessage.success('数据导入成功！页面将刷新...')
        
        // 刷新页面
        setTimeout(() => {
          window.location.reload()
        }, 1500)
        
      } catch (parseError) {
        console.error('解析失败:', parseError)
        ElMessage.error('文件格式错误，请选择正确的备份文件')
      }
    }
    
    input.click()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('导入失败:', error)
      ElMessage.error('导入失败，请重试')
    }
  }
}

const changePassword = async () => {
  try {
    const { value } = await ElMessageBox.prompt(
      '请输入新密码',
      '修改密码',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'password'
      }
    )
    
    if (value && value.length >= 6) {
      ElMessage.success('密码修改成功')
    } else {
      ElMessage.error('密码长度至少6位')
    }
  } catch {
    // 用户取消操作
  }
}

const uploadAvatar = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        userSettings.value.avatar = event.target?.result as string
        ElMessage.success('头像上传成功')
      }
      reader.readAsDataURL(file)
    }
  }
  input.click()
}

const getThemeColor = (theme: string) => {
  const themes: Record<string, string> = {
    light: '#4CAF50',
    dark: '#333333',
    blue: '#2196F3',
    purple: '#9C27B0'
  }
  return themes[theme] || '#4CAF50'
}
</script>

<template>
  <div class="settings-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1 class="page-title">⚙️ 系统设置</h1>
      <p class="page-subtitle">个性化配置，打造专属学习环境</p>
    </div>

    <!-- 操作按钮组 -->
    <div class="settings-actions">
      <el-button 
        type="primary" 
        size="large"
        :loading="isSaving"
        @click="saveSettings"
      >
        <el-icon><Check /></el-icon>
        {{ isSaving ? '保存中...' : '保存设置' }}
      </el-button>
      <el-button size="large" @click="resetSettings">
        <el-icon><RefreshLeft /></el-icon>
        重置设置
      </el-button>
    </div>

    <!-- 主要设置内容 -->
    <div class="main-content">
      <el-tabs v-model="activeTab" class="settings-tabs">
        <!-- 个人信息 Tab -->
        <el-tab-pane label="👤 个人信息" name="profile">
          <div class="profile-settings">
            <div class="avatar-section">
              <div class="avatar-container">
                <img 
                  v-if="userSettings.avatar" 
                  :src="userSettings.avatar" 
                  alt="用户头像"
                  class="user-avatar"
                >
                <div v-else class="avatar-placeholder">
                  <el-icon size="40"><User /></el-icon>
                </div>
                <div class="avatar-overlay" @click="uploadAvatar">
                  <el-icon><Camera /></el-icon>
                  <span>更换头像</span>
                </div>
              </div>
            </div>

            <div class="profile-form">
              <el-form label-position="top" :model="userSettings">
                <el-form-item label="昵称">
                  <el-input 
                    v-model="userSettings.nickname" 
                    placeholder="请输入您的昵称"
                    size="large"
                  />
                </el-form-item>
                
                <el-form-item label="邮箱">
                  <el-input 
                    v-model="userSettings.email" 
                    placeholder="请输入邮箱地址"
                    size="large"
                    disabled
                  />
                  <div class="form-tip">邮箱用于接收重要通知，暂不支持修改</div>
                </el-form-item>
                
                <el-form-item label="修改密码">
                  <el-button @click="changePassword">修改登录密码</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-tab-pane>

        <!-- 学习设置 Tab -->
        <el-tab-pane label="📚 学习设置" name="study">
          <div class="study-settings">
            <div class="goals-section">
              <h3>🎯 学习目标设置</h3>
              <div class="goal-cards">
                <div class="goal-card">
                  <div class="goal-header">
                    <h4>每日学习目标</h4>
                    <div class="goal-value">{{ studySettings.dailyGoal }}分钟</div>
                  </div>
                  <el-slider 
                    v-model="studySettings.dailyGoal" 
                    :min="30" 
                    :max="480" 
                    :step="30"
                    show-input
                    size="large"
                  />
                  <div class="goal-progress">
                    <el-progress 
                      :percentage="studyProgress.dailyProgress"
                      :stroke-width="12"
                      :color="studyProgress.dailyProgress >= 100 ? '#4CAF50' : '#FF9800'"
                    />
                    <div class="progress-text">
                      今日已完成 {{ studyStore.todayStudyTime }} 分钟
                    </div>
                  </div>
                </div>

                <div class="goal-card">
                  <div class="goal-header">
                    <h4>每周学习目标</h4>
                    <div class="goal-value">{{ studySettings.weeklyGoal }}分钟</div>
                  </div>
                  <el-slider 
                    v-model="studySettings.weeklyGoal" 
                    :min="210" 
                    :max="3360" 
                    :step="210"
                    show-input
                    size="large"
                  />
                  <div class="goal-progress">
                    <el-progress 
                      :percentage="studyProgress.weeklyProgress"
                      :stroke-width="12"
                      :color="studyProgress.weeklyProgress >= 100 ? '#4CAF50' : '#FF9800'"
                    />
                    <div class="progress-text">
                      本周已完成 {{ studyStore.weeklyStudyTime }} 分钟
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="pomodoro-section">
              <h3>⏰ 番茄工作法设置</h3>
              <div class="pomodoro-settings">
                <div class="setting-item">
                  <label>专注时长</label>
                  <el-select v-model="studySettings.pomodoroDuration" size="large">
                    <el-option label="15分钟" :value="15" />
                    <el-option label="25分钟" :value="25" />
                    <el-option label="30分钟" :value="30" />
                    <el-option label="45分钟" :value="45" />
                  </el-select>
                </div>
                
                <div class="setting-item">
                  <label>休息时长</label>
                  <el-select v-model="studySettings.breakDuration" size="large">
                    <el-option label="5分钟" :value="5" />
                    <el-option label="10分钟" :value="10" />
                    <el-option label="15分钟" :value="15" />
                  </el-select>
                </div>
                
                <div class="setting-item checkbox-item">
                  <el-checkbox v-model="studySettings.autoStartNext" size="large">
                    自动开始下一个番茄钟
                  </el-checkbox>
                </div>
              </div>
            </div>

            <div class="focus-section">
              <h3>🧘 专注模式</h3>
              <div class="focus-settings">
                <div class="setting-item checkbox-item">
                  <el-checkbox v-model="studySettings.focusMode" size="large">
                    启用专注模式（屏蔽干扰）
                  </el-checkbox>
                </div>
                
                <div class="setting-item checkbox-item">
                  <el-checkbox v-model="studySettings.soundEnabled" size="large">
                    启用提示音效
                  </el-checkbox>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 通知设置 Tab -->
        <el-tab-pane label="🔔 通知设置" name="notifications">
          <div class="notification-settings">
            <div class="notification-section">
              <h3>📱 应用内通知</h3>
              <div class="notification-options">
                <div class="option-item">
                  <el-checkbox v-model="userSettings.notification" size="large">
                    启用应用通知
                  </el-checkbox>
                </div>
                
                <div class="option-item">
                  <el-checkbox v-model="userSettings.studyReminders" size="large">
                    学习提醒通知
                  </el-checkbox>
                  <div class="option-desc">在设定时间提醒您开始学习</div>
                </div>
                
                <div class="option-item">
                  <el-checkbox v-model="userSettings.goalNotifications" size="large">
                    目标达成通知
                  </el-checkbox>
                  <div class="option-desc">当完成学习目标时发送通知</div>
                </div>
              </div>
            </div>

            <div class="email-section">
              <h3>📧 邮件通知</h3>
              <div class="email-options">
                <div class="option-item">
                  <el-checkbox v-model="userSettings.emailNotification" size="large" disabled>
                    邮件通知（开发中）
                  </el-checkbox>
                  <div class="option-desc">通过邮件接收重要通知和学习报告</div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 系统设置 Tab -->
        <el-tab-pane label="💻 系统设置" name="system">
          <div class="system-settings">
            <div class="appearance-section">
              <h3>🎨 外观设置</h3>
              <div class="theme-settings">
                <div class="setting-item">
                  <label>主题颜色</label>
                  <el-select v-model="studySettings.theme" size="large">
                    <el-option label="清新绿" value="light" />
                    <el-option label="深邃黑" value="dark" />
                    <el-option label="科技蓝" value="blue" />
                    <el-option label="优雅紫" value="purple" />
                  </el-select>
                </div>
                
                <div class="theme-preview">
                  <div 
                    class="preview-box"
                    :style="{ backgroundColor: getThemeColor(studySettings.theme) }"
                  >
                    主题预览
                  </div>
                </div>
              </div>
            </div>

            <div class="data-section">
              <h3>💾 数据管理</h3>
              <div class="data-actions">
                <div class="action-item">
                  <el-button @click="exportData" size="large" type="success">
                    <el-icon><Download /></el-icon>
                    导出学习数据
                  </el-button>
                  <div class="action-desc">将学习记录导出为JSON文件</div>
                </div>
                
                <div class="action-item">
                  <el-button @click="importData" size="large" type="primary">
                    <el-icon><Upload /></el-icon>
                    导入学习数据
                  </el-button>
                  <div class="action-desc">从备份文件恢复学习进度</div>
                </div>
                
                <div class="action-item" v-if="studyStore.studyRecords.length > 0">
                  <el-button @click="clearMockStudyData" size="large" type="danger" :loading="isClearingData">
                    <el-icon><Delete /></el-icon>
                    清除模拟学习数据
                  </el-button>
                  <div class="action-desc">清除所有模拟的学习记录，从今天开始记录真实数据</div>
                </div>
                
                <div class="action-item">
                  <el-button @click="clearCache" size="large" type="danger">
                    <el-icon><Delete /></el-icon>
                    清除缓存数据
                  </el-button>
                  <div class="action-desc">当前缓存大小：{{ systemSettings.cacheSize }}</div>
                </div>
              </div>
            </div>

            <div class="about-section">
              <h3>ℹ️ 关于应用</h3>
              <div class="about-info">
                <div class="info-item">
                  <label>应用版本</label>
                  <span>v1.0.0</span>
                </div>
                <div class="info-item">
                  <label>最后备份</label>
                  <span>{{ systemSettings.lastBackup }}</span>
                </div>
                <div class="info-item">
                  <label>技术支持</label>
                  <span>考研效率平台开发团队</span>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style scoped>
.settings-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 30px 0;
}

.page-title {
  font-size: 2.5em;
  color: white;
  margin-bottom: 15px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  font-weight: 700;
}

.page-subtitle {
  font-size: 1.2em;
  color: rgba(255, 255, 255, 0.9);
  opacity: 0.9;
  font-weight: 400;
}

.settings-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 30px;
}

/* 主要内容区域 */
.main-content {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
}

.settings-tabs :deep(.el-tabs__header) {
  margin-bottom: 30px;
}

.settings-tabs :deep(.el-tabs__nav-wrap)::after {
  display: none;
}

.settings-tabs :deep(.el-tabs__item) {
  font-size: 1.1em;
  font-weight: 500;
  padding: 0 25px;
  height: 55px;
  line-height: 55px;
  color: #666666;
}

.settings-tabs :deep(.el-tabs__item.is-active) {
  color: #4CAF50;
  font-weight: 600;
}

.settings-tabs :deep(.el-tabs__active-bar) {
  background: linear-gradient(90deg, #FF6B6B 0%, #4CAF50 100%);
  height: 4px;
  border-radius: 2px;
}

/* 个人信息设置 */
.profile-settings {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 40px;
}

.avatar-section {
  text-align: center;
}

.avatar-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.user-avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #4CAF50;
}

.avatar-placeholder {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid #4CAF50;
  color: #999999;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.avatar-container:hover .avatar-overlay {
  opacity: 1;
}

.avatar-overlay el-icon {
  font-size: 2em;
  margin-bottom: 5px;
}

.form-tip {
  color: #999999;
  font-size: 0.9em;
  margin-top: 5px;
}

/* 学习设置 */
.study-settings {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.goals-section h3,
.pomodoro-section h3,
.focus-section h3 {
  color: #333333;
  margin-bottom: 25px;
  font-size: 1.4em;
  padding-bottom: 10px;
  border-bottom: 2px solid #4CAF50;
}

.goal-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.goal-card {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 25px;
}

.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.goal-header h4 {
  color: #333333;
  margin: 0;
  font-size: 1.2em;
}

.goal-value {
  font-size: 1.5em;
  font-weight: 700;
  color: #4CAF50;
}

.goal-progress {
  margin-top: 20px;
}

.progress-text {
  text-align: center;
  color: #666666;
  margin-top: 10px;
  font-size: 0.9em;
}

.pomodoro-settings,
.focus-settings {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.setting-item.checkbox-item {
  justify-content: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
}

/* 通知设置 */
.notification-settings {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.notification-section h3,
.email-section h3 {
  color: #333333;
  margin-bottom: 25px;
  font-size: 1.4em;
  padding-bottom: 10px;
  border-bottom: 2px solid #4CAF50;
}

.option-item {
  padding: 15px 0;
  border-bottom: 1px solid #eeeeee;
}

.option-item:last-child {
  border-bottom: none;
}

.option-desc {
  color: #999999;
  font-size: 0.9em;
  margin-top: 5px;
  margin-left: 30px;
}

/* 系统设置 */
.system-settings {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.appearance-section h3,
.data-section h3,
.about-section h3 {
  color: #333333;
  margin-bottom: 25px;
  font-size: 1.4em;
  padding-bottom: 10px;
  border-bottom: 2px solid #4CAF50;
}

.theme-settings {
  display: flex;
  align-items: center;
  gap: 30px;
}

.theme-preview {
  flex: 1;
}

.preview-box {
  height: 80px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.1em;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.data-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.action-item {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
}

.action-desc {
  color: #999999;
  font-size: 0.9em;
  margin-top: 10px;
}

.about-info {
  display: grid;
  gap: 15px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.info-item label {
  font-weight: 500;
  color: #333333;
}

.info-item span {
  color: #666666;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .settings-container {
    padding: 15px;
  }
  
  .page-title {
    font-size: 2em;
  }
  
  .settings-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .profile-settings {
    grid-template-columns: 1fr;
    gap: 30px;
    text-align: center;
  }
  
  .goal-cards {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .pomodoro-settings,
  .focus-settings,
  .data-actions {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .theme-settings {
    flex-direction: column;
    align-items: stretch;
  }
  
  .settings-tabs :deep(.el-tabs__item) {
    padding: 0 15px;
    font-size: 0.9em;
  }
}
</style>
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface UserInfo {
  id: string
  username: string
  email: string
  avatar?: string
  createdAt: string
}

export const useUserStore = defineStore('user', () => {
  // 状态
  const userInfo = ref<UserInfo | null>(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)

  // 计算属性
  const displayName = computed(() => {
    return userInfo.value?.username || '学习者'
  })

  // 方法
  const login = async (username: string, password: string) => {
    isLoading.value = true
    try {
      // 模拟登录验证
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 简单的身份验证逻辑（个人使用，简化处理）
      if (username && password) {
        userInfo.value = {
          id: 'user_' + Date.now(),
          username: username,
          email: `${username}@studyplatform.local`,
          createdAt: new Date().toISOString()
        }
        isAuthenticated.value = true
        
        // 保存到本地存储
        localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
        localStorage.setItem('isAuthenticated', 'true')
        
        return { success: true, message: '登录成功' }
      } else {
        return { success: false, message: '用户名或密码不能为空' }
      }
    } catch (error) {
      return { success: false, message: '登录失败' }
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    userInfo.value = null
    isAuthenticated.value = false
    
    // 清除本地存储
    localStorage.removeItem('userInfo')
    localStorage.removeItem('isAuthenticated')
  }

  const register = async (username: string, email: string, password: string) => {
    isLoading.value = true
    try {
      // 模拟注册
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (username && email && password) {
        userInfo.value = {
          id: 'user_' + Date.now(),
          username: username,
          email: email,
          createdAt: new Date().toISOString()
        }
        isAuthenticated.value = true
        
        // 保存到本地存储
        localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
        localStorage.setItem('isAuthenticated', 'true')
        
        return { success: true, message: '注册成功' }
      } else {
        return { success: false, message: '请填写完整信息' }
      }
    } catch (error) {
      return { success: false, message: '注册失败' }
    } finally {
      isLoading.value = false
    }
  }

  // 更新用户资料
  const updateUserProfile = async (profileData: Partial<UserInfo>) => {
    if (!userInfo.value) return { success: false, message: '用户未登录' }
    
    try {
      isLoading.value = true
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 更新用户信息
      userInfo.value = {
        ...userInfo.value,
        ...profileData
      }
      
      // 保存到本地存储
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
      
      return { success: true, message: '资料更新成功' }
    } catch (error) {
      console.error('更新用户资料失败:', error)
      return { success: false, message: '更新失败，请稍后重试' }
    } finally {
      isLoading.value = false
    }
  }

  // 初始化用户状态
  const initializeUser = () => {
    const storedUserInfo = localStorage.getItem('userInfo')
    const storedAuthStatus = localStorage.getItem('isAuthenticated')
    
    if (storedUserInfo && storedAuthStatus === 'true') {
      userInfo.value = JSON.parse(storedUserInfo)
      isAuthenticated.value = true
    }
  }

  return {
    // 状态
    userInfo,
    isAuthenticated,
    isLoading,
    
    // 计算属性
    displayName,
    
    // 方法
    login,
    logout,
    register,
    updateUserProfile,
    initializeUser
  }
})
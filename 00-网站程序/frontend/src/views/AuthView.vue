<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const router = useRouter()

const activeTab = ref('login')
const isLoading = ref(false)

const loginForm = ref({
  username: '',
  password: ''
})

const registerForm = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const handleLogin = async () => {
  if (!loginForm.value.username || !loginForm.value.password) {
    ElMessage.warning('请输入用户名和密码')
    return
  }

  isLoading.value = true
  try {
    const result = await userStore.login(loginForm.value.username, loginForm.value.password)
    
    if (result.success) {
      ElMessage.success('登录成功')
      router.push('/')
    } else {
      ElMessage.error(result.message || '登录失败')
    }
  } catch (error) {
    ElMessage.error('登录过程中出现错误')
  } finally {
    isLoading.value = false
  }
}

const handleRegister = async () => {
  if (!registerForm.value.username || !registerForm.value.email || !registerForm.value.password) {
    ElMessage.warning('请填写完整信息')
    return
  }

  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    ElMessage.warning('两次输入的密码不一致')
    return
  }

  isLoading.value = true
  try {
    const result = await userStore.register(
      registerForm.value.username,
      registerForm.value.email,
      registerForm.value.password
    )
    
    if (result.success) {
      ElMessage.success('注册成功')
      activeTab.value = 'login'
      // 清空注册表单
      registerForm.value = {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      }
    } else {
      ElMessage.error(result.message || '注册失败')
    }
  } catch (error) {
    ElMessage.error('注册过程中出现错误')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  // 如果已经登录，直接跳转到主页
  if (userStore.isAuthenticated) {
    router.push('/')
  }
})
</script>

<template>
  <div class="auth-container">
    <div class="auth-box">
      <div class="auth-header">
        <h1 class="auth-title">考研效率平台</h1>
        <p class="auth-subtitle">专注学习，高效备考</p>
      </div>

      <el-tabs v-model="activeTab" class="auth-tabs">
        <el-tab-pane label="登录" name="login">
          <el-form :model="loginForm" class="auth-form">
            <el-form-item>
              <el-input
                v-model="loginForm.username"
                placeholder="用户名"
                size="large"
                prefix-icon="User"
              />
            </el-form-item>
            
            <el-form-item>
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="密码"
                size="large"
                prefix-icon="Lock"
                show-password
              />
            </el-form-item>
            
            <el-form-item>
              <el-button
                type="primary"
                size="large"
                class="auth-button"
                :loading="isLoading"
                @click="handleLogin"
              >
                登录
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="注册" name="register">
          <el-form :model="registerForm" class="auth-form">
            <el-form-item>
              <el-input
                v-model="registerForm.username"
                placeholder="用户名"
                size="large"
                prefix-icon="User"
              />
            </el-form-item>
            
            <el-form-item>
              <el-input
                v-model="registerForm.email"
                placeholder="邮箱"
                size="large"
                prefix-icon="Message"
                type="email"
              />
            </el-form-item>
            
            <el-form-item>
              <el-input
                v-model="registerForm.password"
                type="password"
                placeholder="密码"
                size="large"
                prefix-icon="Lock"
                show-password
              />
            </el-form-item>
            
            <el-form-item>
              <el-input
                v-model="registerForm.confirmPassword"
                type="password"
                placeholder="确认密码"
                size="large"
                prefix-icon="Lock"
                show-password
              />
            </el-form-item>
            
            <el-form-item>
              <el-button
                type="primary"
                size="large"
                class="auth-button"
                :loading="isLoading"
                @click="handleRegister"
              >
                注册
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <div class="auth-footer">
        <p class="demo-tip">
          💡 提示：这是个人使用版本，可以随意注册登录<br>
          推荐用户名：studylover 密码：123456
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4CAF50 0%, #FF6B6B 100%);
  padding: 20px;
}

.auth-box {
  width: 100%;
  max-width: 450px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.auth-header {
  text-align: center;
  padding: 40px 30px 20px;
  background: linear-gradient(135deg, #FF6B6B 0%, #4CAF50 100%);
}

.auth-title {
  color: white;
  font-size: 2.2em;
  margin-bottom: 10px;
  font-weight: 600;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
}

.auth-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1em;
  margin: 0;
}

.auth-tabs {
  padding: 30px;
}

.auth-form :deep(.el-form-item) {
  margin-bottom: 25px;
}

.auth-form :deep(.el-input__wrapper) {
  border-radius: 12px;
  height: 50px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.auth-form :deep(.el-input__inner) {
  font-size: 16px;
}

.auth-button {
  width: 100%;
  height: 50px;
  font-size: 18px;
  font-weight: 500;
  border-radius: 12px;
  background: linear-gradient(135deg, #FF6B6B 0%, #4CAF50 100%);
  border: none;
  letter-spacing: 1px;
}

.auth-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
}

.auth-footer {
  padding: 0 30px 30px;
  text-align: center;
}

.demo-tip {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 15px;
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  border-left: 4px solid #FF6B6B;
}

:deep(.el-tabs__nav-wrap::after) {
  display: none;
}

:deep(.el-tabs__item) {
  font-size: 18px;
  font-weight: 500;
  padding: 0 30px;
  height: 50px;
  line-height: 50px;
}

:deep(.el-tabs__active-bar) {
  background: linear-gradient(90deg, #FF6B6B 0%, #4CAF50 100%);
  height: 3px;
  border-radius: 2px;
}
</style>
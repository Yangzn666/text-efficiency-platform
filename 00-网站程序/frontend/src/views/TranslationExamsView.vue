<template>
  <div class="translation-exams">
    <div class="page-header">
      <el-button type="primary" link @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        返回翻译主页
      </el-button>
      <h2>📝 真题实战训练</h2>
      <p>历年真题 · 限时模拟 · 错题复盘</p>
    </div>

    <div class="content-section">
      <el-alert
        title="功能开发中"
        description="这里将提供历年真题翻译练习、限时模拟测试和错题复盘功能。"
        type="info"
        :closable="false"
        show-icon
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
  // 跳转到英语模块的翻译tab
  router.push({ path: '/english', query: { tab: 'translation' } })
}
</script>

<style scoped>
.translation-exams {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-header h2 {
  font-size: 2em;
  color: #43e97b;
  margin: 15px 0 10px;
}

.page-header p {
  font-size: 1.1em;
  color: #555;
}

.content-section {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}
</style>

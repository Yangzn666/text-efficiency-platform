<template>
  <div class="translation-tips">
    <div class="page-header">
      <el-button type="primary" link @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        返回翻译主页
      </el-button>
      <h2>⚡ 翻译技巧讲义</h2>
      <p>增词译法 · 词类转换 · 语序调整</p>
    </div>

    <div class="content-section">
      <el-alert
        title="功能开发中"
        description="这里将系统讲解翻译技巧，包括增词译法、词类转换、语序调整等实用方法。"
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
.translation-tips {
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
  color: #fa709a;
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

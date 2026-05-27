<template>
  <div class="translation-mistakes">
    <div class="page-header">
      <el-button type="primary" link @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        返回翻译主页
      </el-button>
      <h2>❌ 错题本</h2>
      <p>拼写错误 · 语法错误 · 表达问题</p>
    </div>

    <div class="content-section">
      <el-alert
        title="功能开发中"
        description="这里将记录你的翻译错题，包括拼写错误、语法错误和表达问题，方便复习巩固。"
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
.translation-mistakes {
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
  color: #ff6b6b;
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

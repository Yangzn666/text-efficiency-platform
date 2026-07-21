<script setup lang="ts">
import CSWrongProblems from '@/components/CSWrongProblems.vue'
</script>

<template>
  <div class="wrong-problems-page">
    <div class="page-header">
      <h1>📝 全科错题本</h1>
      <p>按科目记录、复习和掌握每一道错题</p>
    </div>
    
    <div class="page-content">
      <CSWrongProblems />
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrong-problems-page {
  min-height: calc(100vh - 64px);
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  
  .page-header {
    padding: 40px 24px 24px;
    text-align: center;
    
    h1 {
      margin: 0 0 8px 0;
      font-size: 2em;
      color: #303133;
      font-weight: 700;
    }
    
    p {
      margin: 0;
      color: #909399;
      font-size: 1.1em;
    }
  }
  
  .page-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px 40px;
  }
}
</style>

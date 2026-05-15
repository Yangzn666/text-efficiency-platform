<template>
  <div class="placeholder-component">
    <div class="placeholder-content">
      <el-icon size="60" color="#999"><Warning /></el-icon>
      <h3>组件暂不可用</h3>
      <p>该功能正在维护中，请稍后再试</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Warning } from '@element-plus/icons-vue'
</script>

<style scoped>
.placeholder-component {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  background: #f8f9fa;
  border-radius: 15px;
  border: 2px dashed #ddd;
}

.placeholder-content {
  text-align: center;
  color: #666;
}

.placeholder-content h3 {
  margin: 15px 0 10px 0;
  color: #999;
}

.placeholder-content p {
  margin: 0;
  font-size: 1em;
}
</style>
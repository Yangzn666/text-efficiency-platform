<template>
  <div class="math-reinforcement-nav">
    <el-menu
      :default-active="activeMenu"
      mode="horizontal"
      router
      class="reinforcement-menu"
    >
      <el-menu-item index="/math">
        <el-icon><DataAnalysis /></el-icon>
        <span>📊 仪表盘</span>
      </el-menu-item>
      
      <el-menu-item index="/math/reinforcement/topics">
        <el-icon><Document /></el-icon>
        <span>🔍 知识点</span>
      </el-menu-item>
      
      <el-menu-item index="/math/reinforcement/special-training">
        <el-icon><Document /></el-icon>
        <span>🎯 专题突破</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { DataAnalysis, Document } from '@element-plus/icons-vue'

const route = useRoute()

const activeMenu = computed(() => {
  const path = route.path
  
  // 精确匹配各个路由
  if (path === '/math' || path === '/math/') {
    return '/math'
  }
  if (path.includes('/topics')) {
    return '/math/reinforcement/topics'
  }
  if (path.includes('/special-training')) {
    return '/math/reinforcement/special-training'
  }
  
  return '/math'
})
</script>

<style scoped>
.math-reinforcement-nav {
  margin-bottom: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
  overflow: hidden;
  padding: 4px;
}

.reinforcement-menu {
  border: none;
  display: flex;
  justify-content: center;
  background: transparent;
}

.reinforcement-menu :deep(.el-menu-item) {
  font-size: 15px;
  padding: 0 28px;
  height: 52px;
  line-height: 52px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: rgba(255, 255, 255, 0.85);
  border-radius: 12px;
  margin: 0 4px;
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

.reinforcement-menu :deep(.el-menu-item)::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.reinforcement-menu :deep(.el-menu-item:hover)::before {
  opacity: 1;
}

.reinforcement-menu :deep(.el-menu-item:hover) {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.reinforcement-menu :deep(.el-menu-item.is-active) {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%);
  color: #667eea;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

.reinforcement-menu :deep(.el-menu-item .el-icon) {
  margin-right: 8px;
  font-size: 18px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .math-reinforcement-nav {
    margin-bottom: 16px;
    border-radius: 12px;
  }
  
  .reinforcement-menu :deep(.el-menu-item) {
    padding: 0 16px;
    font-size: 13px;
    height: 44px;
    line-height: 44px;
  }
  
  .reinforcement-menu :deep(.el-menu-item span) {
    display: none;
  }
}
</style>

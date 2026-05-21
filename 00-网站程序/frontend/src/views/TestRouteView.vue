<template>
  <div class="test-page">
    <h1>🧪 路由测试页面</h1>
    <p>当前路径: {{ $route.path }}</p>
    <p>当前名称: {{ $route.name }}</p>
    
    <div class="links">
      <router-link to="/math">去 /math (强化仪表盘)</router-link>
      <router-link to="/math/old-home">去 /math/old-home (旧版)</router-link>
      <router-link to="/math/reinforcement/topics">去知识点管理</router-link>
      <router-link to="/">回首页</router-link>
    </div>
    
    <div class="info">
      <h2>调试信息</h2>
      <pre>{{ debugInfo }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const debugInfo = computed(() => ({
  path: route.path,
  name: route.name,
  params: route.params,
  query: route.query,
  fullPath: route.fullPath,
  hash: route.hash
}))
</script>

<style scoped>
.test-page {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #2196F3;
  margin-bottom: 20px;
}

.links {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 20px 0;
}

.links a {
  padding: 10px 16px;
  background: #e3f2fd;
  color: #1976D2;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.links a:hover {
  background: #2196F3;
  color: white;
  transform: translateX(5px);
}

.info {
  margin-top: 30px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
}

.info h2 {
  margin-bottom: 12px;
  font-size: 18px;
}

pre {
  background: #263238;
  color: #aed581;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.6;
}
</style>

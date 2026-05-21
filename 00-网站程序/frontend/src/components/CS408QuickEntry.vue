<template>
  <div class="quick-entry-container">
    <div class="section-header">
      <h3>🚀 快速学习入口</h3>
      <p class="subtitle">点击卡片直接进入对应科目的知识点学习</p>
    </div>
    
    <div class="entry-grid">
      <!-- 数据结构 -->
      <div 
        class="entry-card data-structure"
        @click="navigateTo('/cs408/datastructure')"
      >
        <div class="card-icon">🌳</div>
        <div class="card-content">
          <h4>数据结构</h4>
          <p class="status-tag completed">✅ 已完成</p>
          <p class="description">线性表、栈队列、树图、查找排序</p>
          <div class="progress-info">
            <el-progress :percentage="100" :stroke-width="6" color="#4CAF50" />
            <span class="progress-text">100%</span>
          </div>
        </div>
      </div>

      <!-- 计算机组成原理 -->
      <div 
        class="entry-card computer-org"
        @click="navigateTo('/cs408/composition')"
      >
        <div class="card-icon">🔧</div>
        <div class="card-content">
          <h4>计算机组成原理</h4>
          <p class="status-tag completed">✅ 已完成</p>
          <p class="description">数据表示、存储系统、CPU、总线、I/O</p>
          <div class="progress-info">
            <el-progress :percentage="100" :stroke-width="6" color="#4CAF50" />
            <span class="progress-text">100%</span>
          </div>
        </div>
      </div>

      <!-- 操作系统 -->
      <div 
        class="entry-card operating-system"
        @click="navigateTo('/cs408/os')"
      >
        <div class="card-icon">⚙️</div>
        <div class="card-content">
          <h4>操作系统</h4>
          <p class="status-tag in-progress">🚀 进行中</p>
          <p class="description">进程管理、内存管理、文件管理、设备管理</p>
          <div class="progress-info">
            <el-progress :percentage="5" :stroke-width="6" color="#FF9800" />
            <span class="progress-text">5%</span>
          </div>
        </div>
      </div>

      <!-- 计算机网络 -->
      <div 
        class="entry-card computer-network"
        @click="navigateTo('/cs408/network')"
      >
        <div class="card-icon">🌐</div>
        <div class="card-content">
          <h4>计算机网络</h4>
          <p class="status-tag pending">⏳ 未开始</p>
          <p class="description">网络体系结构、物理层到应用层</p>
          <div class="progress-info">
            <el-progress :percentage="0" :stroke-width="6" color="#9E9E9E" />
            <span class="progress-text">0%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 学习建议 -->
    <div class="learning-tips">
      <el-alert
        title="💡 学习建议"
        type="info"
        :closable="false"
        show-icon
      >
        <template #default>
          <ul>
            <li><strong>当前重点：</strong>继续完成操作系统基础阶段学习（预计4周）</li>
            <li><strong>复习提醒：</strong>数据结构和计组已学完，建议每周安排1-2次复习</li>
            <li><strong>后续计划：</strong>操作系统完成后开始计算机网络基础学习</li>
          </ul>
        </template>
      </el-alert>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<style scoped>
.quick-entry-container {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
}

.section-header {
  text-align: center;
  margin-bottom: 30px;
}

.section-header h3 {
  font-size: 1.8em;
  color: #333;
  margin-bottom: 10px;
  font-weight: 700;
}

.subtitle {
  font-size: 1em;
  color: #666;
  margin: 0;
}

.entry-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 25px;
}

.entry-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border: 2px solid #e9ecef;
  border-radius: 15px;
  padding: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.entry-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  border-color: #2196F3;
}

.entry-card.data-structure:hover {
  border-color: #4CAF50;
  background: linear-gradient(135deg, #e8f5e8 0%, #ffffff 100%);
}

.entry-card.computer-org:hover {
  border-color: #2196F3;
  background: linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%);
}

.entry-card.operating-system:hover {
  border-color: #FF9800;
  background: linear-gradient(135deg, #fff3e0 0%, #ffffff 100%);
}

.entry-card.computer-network:hover {
  border-color: #9C27B0;
  background: linear-gradient(135deg, #f3e5f5 0%, #ffffff 100%);
}

.card-icon {
  font-size: 3em;
  flex-shrink: 0;
}

.card-content {
  flex: 1;
}

.card-content h4 {
  font-size: 1.3em;
  color: #333;
  margin: 0 0 10px 0;
  font-weight: 600;
}

.status-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85em;
  font-weight: 500;
  margin-bottom: 10px;
}

.status-tag.completed {
  background: #e8f5e8;
  color: #4CAF50;
}

.status-tag.in-progress {
  background: #fff3e0;
  color: #FF9800;
}

.status-tag.pending {
  background: #f5f5f5;
  color: #9E9E9E;
}

.description {
  font-size: 0.9em;
  color: #666;
  margin: 0 0 15px 0;
  line-height: 1.5;
}

.progress-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-info :deep(.el-progress) {
  flex: 1;
}

.progress-text {
  font-size: 0.9em;
  color: #666;
  font-weight: 500;
  min-width: 40px;
  text-align: right;
}

.learning-tips {
  margin-top: 20px;
}

.learning-tips :deep(.el-alert) {
  border-radius: 12px;
}

.learning-tips ul {
  margin: 10px 0 0 0;
  padding-left: 20px;
}

.learning-tips li {
  margin-bottom: 8px;
  line-height: 1.6;
  color: #555;
}

@media (max-width: 768px) {
  .quick-entry-container {
    padding: 20px;
  }

  .section-header h3 {
    font-size: 1.5em;
  }

  .entry-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .entry-card {
    padding: 20px;
  }

  .card-icon {
    font-size: 2.5em;
  }

  .card-content h4 {
    font-size: 1.1em;
  }
}

@media (max-width: 480px) {
  .quick-entry-container {
    padding: 15px;
  }

  .section-header h3 {
    font-size: 1.3em;
  }

  .entry-card {
    padding: 15px;
    gap: 15px;
  }

  .card-icon {
    font-size: 2em;
  }
}
</style>

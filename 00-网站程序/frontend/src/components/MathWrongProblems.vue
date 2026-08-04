<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref('gaoshu')
</script>

<template>
  <div class="math-wrong-problems">
    <el-tabs v-model="activeTab" class="sub-tabs">
      <el-tab-pane label="高数" name="gaoshu">
        <div class="empty-state">
          <el-icon size="48" color="#909399"><DocumentChecked /></el-icon>
          <p>暂无高数错题</p>
          <p class="hint">做题时遇到错题，拍照/截图发给 QoderWork 录入</p>
        </div>
      </el-tab-pane>
      <el-tab-pane label="线代" name="xiandai">
        <div class="empty-state">
          <el-icon size="48" color="#909399"><DocumentChecked /></el-icon>
          <p>暂无线代错题</p>
          <p class="hint">做题时遇到错题，拍照/截图发给 QoderWork 录入</p>
        </div>
      </el-tab-pane>
      <el-tab-pane label="概率论" name="gailv">
        <div class="empty-state">
          <el-icon size="48" color="#909399"><DocumentChecked /></el-icon>
          <p>暂无概率论错题</p>
          <p class="hint">做题时遇到错题，拍照/截图发给 QoderWork 录入</p>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.math-wrong-problems {
  padding: 20px 0;
}

.sub-tabs :deep(.el-tabs__header) {
  margin-bottom: 16px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #909399;
}

.empty-state p {
  margin: 12px 0 0;
  font-size: 1.05em;
}

.empty-state .hint {
  font-size: 0.9em;
  color: #c0c4cc;
}
</style>

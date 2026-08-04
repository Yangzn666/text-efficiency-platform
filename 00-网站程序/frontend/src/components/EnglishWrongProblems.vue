<script setup lang="ts">
</script>

<template>
  <div class="english-wrong-problems">
    <div class="empty-state">
      <el-icon size="48" color="#909399"><DocumentChecked /></el-icon>
      <p>暂无英语一错题</p>
      <p class="hint">做题时遇到错题，拍照/截图发给 QoderWork 录入</p>
    </div>
  </div>
</template>

<style scoped>
.english-wrong-problems {
  padding: 20px 0;
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

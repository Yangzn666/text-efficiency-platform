<template>
  <div class="phrase-list">
    <div v-if="phrases.length === 0" class="empty-state">
      <el-icon :size="60" color="#ddd"><Document /></el-icon>
      <p>暂无数据</p>
    </div>

    <div v-else class="phrase-grid">
      <div
        v-for="(phrase, index) in phrases"
        :key="index"
        class="phrase-card"
        :class="{ mastered: phrase.mastered }"
      >
        <!-- 优先级标记 -->
        <div class="priority-badge" :class="phrase.priority">
          {{ getPriorityText(phrase.priority) }}
        </div>

        <!-- 掌握状态按钮 -->
        <div class="status-btn" @click="toggleMastered(phrase)">
          <el-icon v-if="phrase.mastered" color="#4CAF50" :size="20">
            <CircleCheckFilled />
          </el-icon>
          <el-icon v-else color="#ccc" :size="20">
            <CircleClose />
          </el-icon>
        </div>

        <!-- 词组内容 -->
        <div class="phrase-content">
          <div class="phrase-en">{{ phrase.en }}</div>
          <div class="phrase-cn">{{ phrase.cn }}</div>
          <div class="phrase-example" v-if="showExamples">
            <el-icon><ChatDotRound /></el-icon>
            <span>{{ phrase.example }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Document, CircleCheckFilled, CircleClose, ChatDotRound } from '@element-plus/icons-vue'

interface Phrase {
  en: string
  cn: string
  category: string
  priority: 'high' | 'medium' | 'low'
  example: string
  mastered?: boolean
}

const props = defineProps<{
  phrases: Phrase[]
}>()

const emit = defineEmits<{
  (e: 'update:phrases', phrases: Phrase[]): void
}>()

const showExamples = ref(true)

function getPriorityText(priority: string): string {
  const map: Record<string, string> = {
    high: '⭐ 高频',
    medium: '⭐⭐ 重要',
    low: '⭐⭐⭐ 了解'
  }
  return map[priority] || ''
}

function toggleMastered(phrase: Phrase) {
  phrase.mastered = !phrase.mastered
  // 保存到localStorage
  saveProgress()
}

function saveProgress() {
  const masteredPhrases = props.phrases
    .filter(p => p.mastered)
    .map(p => p.en)
  localStorage.setItem('translation_phrases_mastered', JSON.stringify(masteredPhrases))
}
</script>

<style scoped>
.phrase-list {
  min-height: 400px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-state p {
  margin-top: 15px;
  font-size: 1.1em;
}

.phrase-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.phrase-card {
  position: relative;
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 2px solid #f0f0f0;
  transition: all 0.3s ease;
  cursor: pointer;
}

.phrase-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  transform: translateY(-2px);
}

.phrase-card.mastered {
  border-color: #4CAF50;
  background: linear-gradient(135deg, #f5fff5 0%, #ffffff 100%);
}

.priority-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75em;
  font-weight: 600;
}

.priority-badge.high {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  color: white;
}

.priority-badge.medium {
  background: linear-gradient(135deg, #ffa502 0%, #ff7f50 100%);
  color: white;
}

.priority-badge.low {
  background: linear-gradient(135deg, #a8e6cf 0%, #88d8b0 100%);
  color: #2d6a4f;
}

.status-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.status-btn:hover {
  background: #f5f5f5;
  transform: scale(1.1);
}

.phrase-content {
  margin-top: 35px;
}

.phrase-en {
  font-size: 1.1em;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.4;
}

.phrase-cn {
  font-size: 1em;
  color: #555;
  margin-bottom: 12px;
  line-height: 1.4;
}

.phrase-example {
  display: flex;
  gap: 8px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  color: #555;
  font-size: 0.9em;
  line-height: 1.5;
}

.phrase-example .el-icon {
  flex-shrink: 0;
  margin-top: 2px;
  color: #667eea;
}

@media (max-width: 768px) {
  .phrase-grid {
    grid-template-columns: 1fr;
  }
}
</style>

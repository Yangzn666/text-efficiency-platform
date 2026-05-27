<template>
  <div class="vocabulary-list">
    <div v-if="vocabulary.length === 0" class="empty-state">
      <el-icon :size="60" color="#ddd"><Reading /></el-icon>
      <p>暂无数据</p>
    </div>

    <div v-else class="vocab-grid">
      <div
        v-for="(word, index) in vocabulary"
        :key="index"
        class="vocab-card"
        :class="{ mastered: word.mastered }"
      >
        <!-- 优先级标记 -->
        <div class="priority-badge" :class="word.priority">
          {{ getPriorityText(word.priority) }}
        </div>

        <!-- 掌握状态按钮 -->
        <div class="status-btn" @click="toggleMastered(word)">
          <el-icon v-if="word.mastered" color="#4CAF50" :size="20">
            <CircleCheckFilled />
          </el-icon>
          <el-icon v-else color="#ccc" :size="20">
            <CircleClose />
          </el-icon>
        </div>

        <!-- 词汇内容 -->
        <div class="vocab-content">
          <div class="vocab-word">{{ word.word }}</div>
          <div class="vocab-phonetic" v-if="word.phonetic">{{ word.phonetic }}</div>
          <div class="vocab-meaning">{{ word.meaning }}</div>
          
          <!-- 熟词僻义标记 -->
          <div v-if="word.type === 'rare'" class="rare-badge">
            <el-icon><Warning /></el-icon>
            <span>熟词僻义</span>
          </div>

          <!-- 同义替换标记 -->
          <div v-if="word.type === 'synonym'" class="synonym-badge">
            <el-icon><Refresh /></el-icon>
            <span>同义替换</span>
          </div>

          <!-- 例句 -->
          <div class="vocab-example" v-if="showExamples && word.example">
            <el-icon><ChatDotRound /></el-icon>
            <div>
              <div class="example-en">{{ word.example }}</div>
              <div class="example-cn" v-if="word.exampleCn">{{ word.exampleCn }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Reading, CircleCheckFilled, CircleClose, ChatDotRound, Warning, Refresh } from '@element-plus/icons-vue'

interface Vocabulary {
  word: string
  phonetic?: string
  meaning: string
  type?: 'common' | 'rare' | 'synonym'
  priority: 'high' | 'medium' | 'low'
  example?: string
  exampleCn?: string
  mastered?: boolean
}

const props = defineProps<{
  vocabulary: Vocabulary[]
}>()

const emit = defineEmits<{
  (e: 'update:vocabulary', vocabulary: Vocabulary[]): void
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

function toggleMastered(word: Vocabulary) {
  word.mastered = !word.mastered
  saveProgress()
}

function saveProgress() {
  const masteredWords = props.vocabulary
    .filter(w => w.mastered)
    .map(w => w.word)
  localStorage.setItem('translation_vocabulary_mastered', JSON.stringify(masteredWords))
}
</script>

<style scoped>
.vocabulary-list {
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

.vocab-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 20px;
}

.vocab-card {
  position: relative;
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 2px solid #f0f0f0;
  transition: all 0.3s ease;
  cursor: pointer;
}

.vocab-card:hover {
  border-color: #f5576c;
  box-shadow: 0 4px 12px rgba(245, 87, 108, 0.15);
  transform: translateY(-2px);
}

.vocab-card.mastered {
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

.vocab-content {
  margin-top: 35px;
}

.vocab-word {
  font-size: 1.3em;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
}

.vocab-phonetic {
  font-size: 0.95em;
  color: #888;
  margin-bottom: 8px;
  font-style: italic;
}

.vocab-meaning {
  font-size: 1em;
  color: #555;
  margin-bottom: 10px;
  line-height: 1.5;
}

.rare-badge,
.synonym-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85em;
  font-weight: 600;
  margin-bottom: 10px;
}

.rare-badge {
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  color: #856404;
}

.synonym-badge {
  background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%);
  color: #0c5460;
}

.vocab-example {
  display: flex;
  gap: 10px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-top: 10px;
}

.vocab-example .el-icon {
  flex-shrink: 0;
  margin-top: 2px;
  color: #f5576c;
}

.example-en {
  font-size: 0.9em;
  color: #555;
  line-height: 1.5;
  margin-bottom: 4px;
}

.example-cn {
  font-size: 0.85em;
  color: #777;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .vocab-grid {
    grid-template-columns: 1fr;
  }
}
</style>

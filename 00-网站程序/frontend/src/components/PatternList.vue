<template>
  <div class="pattern-list">
    <div v-if="patterns.length === 0" class="empty-state">
      <el-icon :size="60" color="#ddd"><EditPen /></el-icon>
      <p>暂无数据</p>
    </div>

    <div v-else class="pattern-grid">
      <div
        v-for="(pattern, index) in patterns"
        :key="index"
        class="pattern-card"
        :class="{ mastered: pattern.mastered }"
      >
        <!-- 掌握状态按钮 -->
        <div class="status-btn" @click="toggleMastered(pattern)">
          <el-icon v-if="pattern.mastered" color="#4CAF50" :size="20">
            <CircleCheckFilled />
          </el-icon>
          <el-icon v-else color="#ccc" :size="20">
            <CircleClose />
          </el-icon>
        </div>

        <!-- 句型内容 -->
        <div class="pattern-content">
          <!-- 标签行：优先级 + 类型 -->
          <div class="badges-row">
            <div class="priority-badge" :class="pattern.priority">
              {{ getPriorityText(pattern.priority) }}
            </div>
            <div class="pattern-type-badge" :class="pattern.type">
              {{ getTypeText(pattern.type) }}
            </div>
          </div>
          
          <div class="pattern-en">{{ pattern.en }}</div>
          <div class="pattern-cn">{{ pattern.cn }}</div>
          
          <!-- 用法说明 -->
          <div v-if="pattern.usage" class="pattern-usage">
            <el-icon><InfoFilled /></el-icon>
            <span>{{ pattern.usage }}</span>
          </div>

          <!-- 例句 -->
          <div class="pattern-example" v-if="showExamples && pattern.example">
            <el-icon><ChatDotRound /></el-icon>
            <div>
              <div class="example-en">{{ pattern.example }}</div>
              <div class="example-cn" v-if="pattern.exampleCn">{{ pattern.exampleCn }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { EditPen, CircleCheckFilled, CircleClose, ChatDotRound, InfoFilled } from '@element-plus/icons-vue'

interface Pattern {
  en: string
  cn: string
  type: 'opening' | 'transition' | 'ending'
  priority: 'high' | 'medium' | 'low'
  usage?: string
  example?: string
  exampleCn?: string
  mastered?: boolean
}

const props = defineProps<{
  patterns: Pattern[]
}>()

const emit = defineEmits<{
  (e: 'update:patterns', patterns: Pattern[]): void
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

function getTypeText(type: string): string {
  const map: Record<string, string> = {
    opening: ' 开头句型',
    transition: '🔄 过渡句型',
    ending: '🎯 结尾句型'
  }
  return map[type] || ''
}

function toggleMastered(pattern: Pattern) {
  pattern.mastered = !pattern.mastered
  saveProgress()
}

function saveProgress() {
  const masteredPatterns = props.patterns
    .filter(p => p.mastered)
    .map(p => p.en)
  localStorage.setItem('translation_patterns_mastered', JSON.stringify(masteredPatterns))
}
</script>

<style scoped>
.pattern-list {
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

.pattern-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.pattern-card {
  position: relative;
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 2px solid #f0f0f0;
  transition: all 0.3s ease;
  cursor: pointer;
}

.pattern-card:hover {
  border-color: #4facfe;
  box-shadow: 0 4px 12px rgba(79, 172, 254, 0.15);
  transform: translateY(-2px);
}

.pattern-card.mastered {
  border-color: #4CAF50;
  background: linear-gradient(135deg, #f5fff5 0%, #ffffff 100%);
}

.priority-badge {
  display: inline-block;
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

.pattern-content {
  margin-top: 15px;
}

.badges-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.pattern-type-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85em;
  font-weight: 600;
}

.pattern-type-badge.opening {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.pattern-type-badge.transition {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.pattern-type-badge.ending {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.pattern-en {
  font-size: 1.15em;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.5;
}

.pattern-cn {
  font-size: 1em;
  color: #555;
  margin-bottom: 12px;
  line-height: 1.5;
}

.pattern-usage {
  display: flex;
  gap: 8px;
  padding: 10px 12px;
  background: #fff3cd;
  border-left: 3px solid #ffc107;
  border-radius: 6px;
  margin-bottom: 12px;
  color: #856404;
  font-size: 0.9em;
  line-height: 1.4;
}

.pattern-usage .el-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.pattern-example {
  display: flex;
  gap: 10px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-top: 10px;
}

.pattern-example .el-icon {
  flex-shrink: 0;
  margin-top: 2px;
  color: #4facfe;
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
  .pattern-grid {
    grid-template-columns: 1fr;
  }
}
</style>

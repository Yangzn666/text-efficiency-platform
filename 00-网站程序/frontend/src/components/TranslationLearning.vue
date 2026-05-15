<template>
  <div class="translation-learning">
    <div class="page-header">
      <h2>🌐 翻译学习系统</h2>
      <p>中英互译练习 + 翻译技巧讲义</p>
    </div>

    <!-- 翻译练习区域 -->
    <div class="practice-section">
      <div class="practice-header">
        <h3>翻译练习</h3>
        <el-button type="primary" @click="showAddPracticeDialog">
          <el-icon><Plus /></el-icon>
          添加练习
        </el-button>
      </div>

      <div class="practice-list">
        <div 
          v-for="(practice, index) in practices" 
          :key="practice.id"
          class="practice-card"
        >
          <div class="practice-header-card">
            <span class="practice-number">练习 {{ index + 1 }}</span>
            <div class="practice-actions">
              <el-button size="small" @click="toggleAnswer(practice.id)">
                {{ practice.showAnswer ? '隐藏答案' : '查看答案' }}
              </el-button>
              <el-button size="small" type="danger" @click="deletePractice(practice.id)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </div>
          
          <div class="practice-content">
            <div class="chinese-text">
              <strong>中文：</strong>{{ practice.chinese }}
            </div>
            
            <div class="user-translation">
              <el-input
                v-model="practice.userTranslation"
                type="textarea"
                :rows="3"
                placeholder="请输入您的英文翻译..."
                @input="savePractices"
              />
            </div>
            
            <div v-if="practice.showAnswer" class="answer-section">
              <div class="reference-answer">
                <strong>参考答案：</strong>
                <p>{{ practice.answer }}</p>
              </div>
              
              <div class="key-points">
                <strong>得分点：</strong>
                <ul>
                  <li v-for="(point, idx) in practice.keyPoints" :key="idx">
                    {{ point }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <el-empty v-if="practices.length === 0" description="暂无翻译练习，点击上方按钮添加" />
    </div>

    <!-- 翻译技巧 -->
    <div class="tips-section">
      <h3>翻译技巧</h3>
      <div class="tips-grid">
        <div 
          v-for="tip in translationTips" 
          :key="tip.id"
          class="tip-card"
          @click="showTipDetail(tip)"
        >
          <div class="tip-icon">{{ tip.icon }}</div>
          <h4>{{ tip.title }}</h4>
          <p>{{ tip.description }}</p>
        </div>
      </div>
    </div>

    <!-- 添加练习弹窗 -->
    <el-dialog 
      v-model="addPracticeVisible" 
      title="添加翻译练习"
      width="700px"
    >
      <el-form :model="practiceForm" label-width="100px">
        <el-form-item label="中文句子">
          <el-input 
            v-model="practiceForm.chinese" 
            type="textarea" 
            :rows="3"
            placeholder="请输入中文句子"
          />
        </el-form-item>
        <el-form-item label="参考答案">
          <el-input 
            v-model="practiceForm.answer" 
            type="textarea" 
            :rows="3"
            placeholder="请输入英文参考答案"
          />
        </el-form-item>
        <el-form-item label="得分点">
          <el-input 
            v-model="practiceForm.keyPointsInput" 
            type="textarea" 
            :rows="3"
            placeholder="多个得分点用换行分隔"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addPracticeVisible = false">取消</el-button>
        <el-button type="primary" @click="savePractice">保存</el-button>
      </template>
    </el-dialog>

    <!-- 技巧详情弹窗 -->
    <el-dialog 
      v-model="tipDetailVisible" 
      :title="selectedTip?.title"
      width="800px"
    >
      <div v-if="selectedTip" class="tip-detail">
        <div class="tip-examples">
          <h4>示例</h4>
          <div 
            v-for="(example, index) in selectedTip.examples" 
            :key="index"
            class="example-item"
          >
            <div class="example-chinese"><strong>中文：</strong>{{ example.chinese }}</div>
            <div class="example-english"><strong>英文：</strong>{{ example.english }}</div>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 使用提示 -->
    <div class="usage-tips">
      <el-icon><InfoFilled /></el-icon>
      <span>💡 使用建议：每天完成5-10句翻译练习，对照答案找差距，积累常用表达</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, Delete, InfoFilled } from '@element-plus/icons-vue'

// 翻译练习数据
const defaultPractices = [
  {
    id: 1,
    chinese: '中国经济的快速发展给世界带来了巨大的机遇。',
    answer: 'The rapid development of China\'s economy has brought tremendous opportunities to the world.',
    keyPoints: ['rapid development', 'tremendous opportunities', '现在完成时'],
    userTranslation: '',
    showAnswer: false
  },
  {
    id: 2,
    chinese: '我们应该重视环境保护，实现可持续发展。',
    answer: 'We should attach great importance to environmental protection and achieve sustainable development.',
    keyPoints: ['attach great importance to', 'environmental protection', 'sustainable development'],
    userTranslation: '',
    showAnswer: false
  },
  {
    id: 3,
    chinese: '随着科技的进步，人工智能在各个领域得到广泛应用。',
    answer: 'With the advancement of technology, artificial intelligence has been widely applied in various fields.',
    keyPoints: ['advancement of technology', 'artificial intelligence', 'widely applied', 'various fields'],
    userTranslation: '',
    showAnswer: false
  },
  {
    id: 4,
    chinese: '教育是国家的根本，关系到民族的未来。',
    answer: 'Education is the foundation of a nation, which is closely related to the future of the country.',
    keyPoints: ['foundation of a nation', 'closely related to', '定语从句'],
    userTranslation: '',
    showAnswer: false
  },
  {
    id: 5,
    chinese: '传统文化的保护和传承是我们每个人的责任。',
    answer: 'The protection and inheritance of traditional culture is the responsibility of every individual.',
    keyPoints: ['protection and inheritance', 'traditional culture', 'responsibility'],
    userTranslation: '',
    showAnswer: false
  }
]

const practices = ref<any[]>([])

// 翻译技巧数据
const translationTips = [
  {
    id: 1,
    icon: '📝',
    title: '增词译法',
    description: '根据英语表达习惯增加必要的词，使语义更完整',
    examples: [
      { chinese: '他昨天没来上课。', english: 'He did not come to class yesterday.' },
      { chinese: '这个问题很难。', english: 'This is a very difficult problem.' }
    ]
  },
  {
    id: 2,
    icon: '🔄',
    title: '词类转换',
    description: '翻译时转换词性，使表达更符合目标语言习惯',
    examples: [
      { chinese: '这部电影很感人。', english: 'This film is very moving.' },
      { chinese: '他的英语说得很流利。', english: 'He speaks English fluently.' }
    ]
  },
  {
    id: 3,
    icon: '🔀',
    title: '语序调整',
    description: '根据中英文表达差异调整句子结构',
    examples: [
      { chinese: '我昨天在图书馆遇到他了。', english: 'I met him in the library yesterday.' },
      { chinese: '这本书我读过三遍。', english: 'I have read this book three times.' }
    ]
  },
  {
    id: 4,
    icon: '✂️',
    title: '分句译法',
    description: '将长句拆分为多个短句，使表达更清晰',
    examples: [
      { chinese: '他是一个勤奋的学生，每天都学习到很晚。', english: 'He is a diligent student. He studies late into the night every day.' }
    ]
  },
  {
    id: 5,
    icon: '🔗',
    title: '合句译法',
    description: '将多个短句合并为一个复合句',
    examples: [
      { chinese: '天气很好。我们去公园吧。', english: 'Since the weather is nice, let\'s go to the park.' }
    ]
  },
  {
    id: 6,
    icon: '📚',
    title: '被动语态',
    description: '中文多用主动语态，英文翻译时常需转换为被动语态',
    examples: [
      { chinese: '这本书已经卖完了。', english: 'This book has been sold out.' },
      { chinese: '问题已经解决了。', english: 'The problem has been solved.' }
    ]
  }
]

const addPracticeVisible = ref(false)
const tipDetailVisible = ref(false)
const selectedTip = ref<any>(null)

const practiceForm = ref({
  chinese: '',
  answer: '',
  keyPointsInput: ''
})

function toggleAnswer(id: number) {
  const practice = practices.value.find(p => p.id === id)
  if (practice) {
    practice.showAnswer = !practice.showAnswer
  }
}

function showAddPracticeDialog() {
  practiceForm.value = {
    chinese: '',
    answer: '',
    keyPointsInput: ''
  }
  addPracticeVisible.value = true
}

function savePractice() {
  const keyPoints = practiceForm.value.keyPointsInput
    .split('\n')
    .map(k => k.trim())
    .filter(k => k)
  
  const newPractice = {
    id: Date.now(),
    chinese: practiceForm.value.chinese,
    answer: practiceForm.value.answer,
    keyPoints,
    userTranslation: '',
    showAnswer: false
  }
  
  practices.value.unshift(newPractice)
  savePractices()
  addPracticeVisible.value = false
}

function deletePractice(id: number) {
  practices.value = practices.value.filter(p => p.id !== id)
  savePractices()
}

function showTipDetail(tip: any) {
  selectedTip.value = tip
  tipDetailVisible.value = true
}

function savePractices() {
  localStorage.setItem('english-translation-practices', JSON.stringify(practices.value))
}

onMounted(() => {
  const saved = localStorage.getItem('english-translation-practices')
  if (saved) {
    practices.value = JSON.parse(saved)
  } else {
    practices.value = defaultPractices
    savePractices()
  }
})
</script>

<style scoped>
.translation-learning {
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-header h2 {
  font-size: 2em;
  color: #FF9800;
  margin-bottom: 10px;
}

.page-header p {
  font-size: 1.1em;
  color: #666;
}

.practice-section {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
}

.practice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.practice-header h3 {
  font-size: 1.5em;
  color: #333;
  margin: 0;
}

.practice-list {
  display: grid;
  gap: 20px;
}

.practice-card {
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
}

.practice-card:hover {
  border-color: #FF9800;
  box-shadow: 0 4px 15px rgba(255, 152, 0, 0.15);
}

.practice-header-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f5f5f5;
}

.practice-number {
  font-size: 1.1em;
  font-weight: 600;
  color: #FF9800;
}

.practice-actions {
  display: flex;
  gap: 10px;
}

.practice-content {
  display: grid;
  gap: 15px;
}

.chinese-text {
  padding: 15px;
  background: #fff3e0;
  border-radius: 8px;
  color: #333;
  font-size: 1.05em;
  line-height: 1.6;
}

.user-translation {
  margin-top: 10px;
}

.answer-section {
  padding: 20px;
  background: #e8f5e9;
  border-radius: 8px;
  border-left: 4px solid #4CAF50;
}

.reference-answer {
  margin-bottom: 15px;
}

.reference-answer p {
  margin-top: 8px;
  color: #2e7d32;
  font-size: 1.05em;
  line-height: 1.6;
}

.key-points h4 {
  color: #333;
  margin-bottom: 10px;
}

.key-points ul {
  list-style: none;
  padding: 0;
}

.key-points li {
  padding: 6px 0;
  color: #666;
  position: relative;
  padding-left: 20px;
}

.key-points li:before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #4CAF50;
  font-weight: bold;
}

.tips-section {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
}

.tips-section h3 {
  font-size: 1.5em;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.tip-card {
  padding: 20px;
  background: #fff9e6;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.tip-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  border-color: #FF9800;
}

.tip-icon {
  font-size: 2em;
  margin-bottom: 12px;
}

.tip-card h4 {
  font-size: 1.2em;
  color: #333;
  margin-bottom: 8px;
}

.tip-card p {
  color: #666;
  font-size: 0.95em;
  line-height: 1.5;
}

.tip-detail {
  padding: 10px;
}

.tip-examples {
  margin-top: 20px;
}

.tip-examples h4 {
  font-size: 1.2em;
  color: #333;
  margin-bottom: 15px;
}

.example-item {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 12px;
}

.example-chinese {
  margin-bottom: 8px;
  color: #333;
}

.example-english {
  color: #FF9800;
}

.usage-tips {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 20px;
  background: #fff3e0;
  border-radius: 10px;
  color: #F57C00;
  font-size: 0.95em;
}

@media (max-width: 768px) {
  .tips-grid {
    grid-template-columns: 1fr;
  }
  
  .practice-header {
    flex-direction: column;
    gap: 15px;
  }
}
</style>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  useFeynmanStore,
  type WeakPoint,
  type WeakPointSeverity,
  type WeakPointStatus,
  type FeynmanSubject
} from '@/stores/feynman'

const store = useFeynmanStore()

// 内部标签
const innerTab = ref('guide')

// ==================== 薄弱点管理 ====================
const showAddDialog = ref(false)
const filterStatus = ref<'all' | WeakPointStatus>('all')
const filterSeverity = ref<'all' | WeakPointSeverity>('all')

const newWp = ref({
  topic: '',
  concept: '',
  description: '',
  severity: 'medium' as WeakPointSeverity
})

const filteredWeakPoints = computed(() => {
  let list = store.data.weakPoints
  if (filterStatus.value !== 'all') {
    list = list.filter(w => w.status === filterStatus.value)
  }
  if (filterSeverity.value !== 'all') {
    list = list.filter(w => w.severity === filterSeverity.value)
  }
  return list
})

function submitWeakPoint() {
  if (!newWp.value.topic || !newWp.value.concept) {
    ElMessage.warning('请填写主题和概念')
    return
  }
  store.addWeakPoint({
    topic: newWp.value.topic,
    concept: newWp.value.concept,
    description: newWp.value.description,
    severity: newWp.value.severity,
    sessionId: null
  })
  ElMessage.success('已添加薄弱点')
  showAddDialog.value = false
  newWp.value = { topic: '', concept: '', description: '', severity: 'medium' }
}

function cycleStatus(wp: WeakPoint) {
  const order: WeakPointStatus[] = ['unresolved', 'reviewing', 'resolved']
  const next = order[(order.indexOf(wp.status) + 1) % order.length]
  store.updateWeakPointStatus(wp.id, next)
}

function handleDelete(wp: WeakPoint) {
  ElMessageBox.confirm(`确定删除「${wp.concept}」这条记录？`, '删除确认', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    store.removeWeakPoint(wp.id)
    ElMessage.success('已删除')
  }).catch(() => {})
}

// ==================== 科目切换 ====================
function switchSubject(subject: FeynmanSubject) {
  store.switchSubject(subject)
}

// ==================== 指令模板 ====================
const promptTemplates = [
  {
    id: 'start',
    title: '开始费曼讲解',
    icon: '🎬',
    prompt: `我要用费曼学习法复习【{科目}】的【{章节/知识点}】。

请你扮演一个完全不懂这个领域的人（比如一个高中生），我来给你讲解这个知识点。

规则：
1. 我讲解时，你要认真听，遇到听不懂的地方就追问"这是什么意思？"或"能再解释一下吗？"
2. 如果我用了专业术语但没解释清楚，你要指出"这个词我不懂，能用大白话说吗？"
3. 如果我讲错了，你要说"等等，我好像听出矛盾了..."然后指出问题
4. 每讲完一个小节，你总结一下你听懂了什么、哪里还迷糊
5. 最后给我一个评分（1-5星）和具体改进建议

现在开始，我先讲：`
  },
  {
    id: 'quiz',
    title: '反向提问测试',
    icon: '🧪',
    prompt: `我刚复习完【{科目}】的【{章节}】，请你用费曼反向提问法测试我：

1. 从基础概念开始，逐步深入到易混淆点
2. 每次只问一个问题，等我回答后再问下一个
3. 如果我答错了，不要直接给答案，而是给一个提示让我再想想
4. 如果我连续答对3个，提升难度
5. 记录我答错或犹豫的问题
6. 最后汇总我的薄弱点清单，格式：
   - 概念：xxx
   - 我的错误理解：xxx
   - 正确理解：xxx
   - 严重程度：高/中/低

开始提问吧：`
  },
  {
    id: 'compare',
    title: '对比辨析讲解',
    icon: '⚖️',
    prompt: `我在复习【{科目}】时，总是混淆以下概念：
- 【概念A】vs【概念B】

请你：
1. 先让我分别用自己的话解释这两个概念
2. 然后指出我解释中的不准确之处
3. 用一个生活类比帮我区分它们
4. 出2道辨析小题让我巩固
5. 如果我还是混淆，换一个角度再讲

我先说我的理解：`
  },
  {
    id: 'record',
    title: '记录薄弱点（对话中触发）',
    icon: '📝',
    prompt: `【指令：记录薄弱点】
请把我们刚才对话中我暴露的薄弱点整理成以下JSON格式，我会更新到网站：

{
  "topic": "章节名",
  "concept": "具体概念",
  "description": "我的错误理解或卡点描述",
  "severity": "high/medium/low"
}

如果有多个薄弱点，输出JSON数组。`
  },
  {
    id: 'review',
    title: '间隔复习提醒',
    icon: '🔁',
    prompt: `我要复习之前的薄弱点。以下是我需要复习的内容：

{粘贴薄弱点列表}

请你：
1. 针对每个薄弱点，设计一个情境题让我判断对错
2. 如果我答对了，追问"为什么"确认我真的理解了
3. 如果答错了，重新用类比讲解
4. 全部复习完后，告诉我哪些可以标记为"已解决"，哪些还需要继续

开始吧：`
  }
]

const copiedId = ref('')
function copyPrompt(template: typeof promptTemplates[0]) {
  navigator.clipboard.writeText(template.prompt).then(() => {
    copiedId.value = template.id
    ElMessage.success('已复制到剪贴板')
    setTimeout(() => { copiedId.value = '' }, 2000)
  })
}

// ==================== 状态映射 ====================
const severityMap: Record<WeakPointSeverity, { label: string; type: string; color: string }> = {
  high: { label: '高', type: 'danger', color: '#F56C6C' },
  medium: { label: '中', type: 'warning', color: '#E6A23C' },
  low: { label: '低', type: 'info', color: '#909399' }
}

const statusMap: Record<WeakPointStatus, { label: string; icon: string; cls: string }> = {
  unresolved: { label: '未解决', icon: '🔴', cls: 'st-unresolved' },
  reviewing: { label: '复习中', icon: '🟡', cls: 'st-reviewing' },
  resolved: { label: '已解决', icon: '🟢', cls: 'st-resolved' }
}

// ==================== 统计 ====================
const stats = computed(() => store.data.stats)
const resolveRate = computed(() => {
  if (stats.value.totalWeakPoints === 0) return 0
  return Math.round((stats.value.resolvedCount / stats.value.totalWeakPoints) * 100)
})
</script>

<template>
  <div class="feynman-page">
    <!-- 顶部统计条 -->
    <div class="stats-bar">
      <div class="stat-item">
        <span class="stat-num">{{ stats.totalSessions }}</span>
        <span class="stat-label">费曼会话</span>
      </div>
      <div class="stat-item">
        <span class="stat-num">{{ stats.totalWeakPoints }}</span>
        <span class="stat-label">薄弱点</span>
      </div>
      <div class="stat-item">
        <span class="stat-num" :class="{ good: resolveRate >= 60 }">{{ resolveRate }}%</span>
        <span class="stat-label">解决率</span>
      </div>
      <div class="stat-item">
        <span class="stat-num">{{ stats.streakDays }}</span>
        <span class="stat-label">连续天数</span>
      </div>
      <div class="stat-spacer"></div>
      <div class="subject-switch">
        <el-radio-group :model-value="store.currentSubject" size="small" @change="switchSubject">
          <el-radio-button value="cs408">💻 408</el-radio-button>
          <el-radio-button value="math">📐 数学一</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <!-- 内部导航 -->
    <div class="inner-nav">
      <button
        :class="{ active: innerTab === 'guide' }"
        @click="innerTab = 'guide'"
      >📖 方法论指南</button>
      <button
        :class="{ active: innerTab === 'prompts' }"
        @click="innerTab = 'prompts'"
      >🤖 AI对话指令</button>
      <button
        :class="{ active: innerTab === 'weakpoints' }"
        @click="innerTab = 'weakpoints'"
      >
        ⚠️ 薄弱点记录
        <el-badge v-if="store.unresolvedWeakPoints.length" :value="store.unresolvedWeakPoints.length" class="nav-badge" />
      </button>
      <button
        :class="{ active: innerTab === 'history' }"
        @click="innerTab = 'history'"
      >📋 会话历史</button>
    </div>

    <!-- ==================== 方法论指南 ==================== -->
    <div v-show="innerTab === 'guide'" class="section-guide">
      <div class="guide-hero">
        <h2>费曼学习法 · 408强化轮实操手册</h2>
        <p class="guide-subtitle">
          "如果你不能把它简单地解释出来，说明你还没有真正理解它。" —— 理查德·费曼
        </p>
      </div>

      <!-- 四步流程 -->
      <div class="steps-grid">
        <div class="step-card">
          <div class="step-num">01</div>
          <div class="step-icon">📚</div>
          <h3>选择概念</h3>
          <p>从408四门课中选一个具体知识点。不要贪多，一次只攻一个概念。</p>
          <div class="step-tip">
            <strong>408示例：</strong>进程调度算法、页面置换策略、TCP拥塞控制、B+树分裂
          </div>
        </div>

        <div class="step-card">
          <div class="step-num">02</div>
          <div class="step-icon">🗣️</div>
          <h3>用大白话讲出来</h3>
          <p>假装对面坐着一个完全不懂计算机的人，用最简单的语言把概念讲清楚。禁止照搬教材定义。</p>
          <div class="step-tip">
            <strong>关键：</strong>用类比、画图、举例。如果卡住了，说明这里就是你的盲区。
          </div>
        </div>

        <div class="step-card">
          <div class="step-num">03</div>
          <div class="step-icon">🔍</div>
          <h3>发现卡点并回填</h3>
          <p>讲不清楚的地方就是薄弱点。回到教材/视频重新学习，直到能用简单语言解释为止。</p>
          <div class="step-tip">
            <strong>操作：</strong>在下方「薄弱点记录」中记下卡点，标注严重程度，后续间隔复习。
          </div>
        </div>

        <div class="step-card">
          <div class="step-num">04</div>
          <div class="step-icon">🔄</div>
          <h3>简化再简化</h3>
          <p>重新组织语言，把解释压缩到最精简。能用一句话说清就不用两句。反复迭代直到流畅。</p>
          <div class="step-tip">
            <strong>检验标准：</strong>一个高中生能听懂 = 你真的懂了。
          </div>
        </div>
      </div>

      <!-- 408专属流程 -->
      <div class="workflow-panel">
        <h3>🎯 408强化轮 · 费曼学习完整流程</h3>
        <div class="workflow-steps">
          <div class="wf-step">
            <div class="wf-dot"></div>
            <div class="wf-content">
              <strong>Step 1 · 听课/看书（输入）</strong>
              <p>看王道/天勤视频或教材对应章节，做简要笔记。目标：建立初步印象。</p>
            </div>
          </div>
          <div class="wf-step">
            <div class="wf-dot"></div>
            <div class="wf-content">
              <strong>Step 2 · 微信对话费曼讲解（输出）</strong>
              <p>打开微信，给我发「开始费曼讲解」指令（见AI对话指令页），然后用自己的话讲解当天学的知识点。我会追问、质疑、指出矛盾。</p>
            </div>
          </div>
          <div class="wf-step">
            <div class="wf-dot"></div>
            <div class="wf-content">
              <strong>Step 3 · 记录薄弱点（沉淀）</strong>
              <p>对话中暴露的卡点，我会帮你整理成结构化记录。你也可以手动在「薄弱点记录」页添加。每条记录包含：概念、错误理解、严重程度。</p>
            </div>
          </div>
          <div class="wf-step">
            <div class="wf-dot"></div>
            <div class="wf-content">
              <strong>Step 4 · 刷题验证（检验）</strong>
              <p>做对应章节的真题/模拟题。正确率≥70%才算过关。错题回到Step 2重新讲解。</p>
            </div>
          </div>
          <div class="wf-step">
            <div class="wf-dot"></div>
            <div class="wf-content">
              <strong>Step 5 · 间隔复习（巩固）</strong>
              <p>按 1天→3天→7天→14天 的节奏复习薄弱点。复习时用「间隔复习提醒」指令，我出题你判断。全部答对→标记已解决。</p>
            </div>
          </div>
          <div class="wf-step">
            <div class="wf-dot done"></div>
            <div class="wf-content">
              <strong>Step 6 · 更新进度（闭环）</strong>
              <p>在「强化进度」标签页更新对应章节状态：听课✅ → 费曼讲解✅ → 正确率 → 错题补讲。四格全绿 = 章节通关。</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 与强化进度的关系 -->
      <div class="link-panel">
        <h3>🔗 与强化进度页的联动</h3>
        <p>
          费曼学习法页面和「强化进度」标签页是同一套系统的两个视角：
        </p>
        <div class="link-cards">
          <div class="link-card">
            <span class="link-icon">📊</span>
            <div>
              <strong>强化进度</strong>
              <p>宏观矩阵视角：26章 × 4维度，一眼看全局</p>
            </div>
          </div>
          <div class="link-card">
            <span class="link-icon">🔬</span>
            <div>
              <strong>费曼学习法（本页）</strong>
              <p>微观执行视角：每次对话的具体记录、薄弱点追踪、复习计划</p>
            </div>
          </div>
        </div>
        <p class="link-hint">
          工作流：强化进度页发现「费曼讲解=有卡点」的章节 → 来本页用AI指令针对性复习 → 解决后回强化进度页标记通过。
        </p>
      </div>
    </div>

    <!-- ==================== AI对话指令 ==================== -->
    <div v-show="innerTab === 'prompts'" class="section-prompts">
      <div class="prompts-intro">
        <h2>🤖 微信对话指令模板</h2>
        <p>
          以下指令用于在微信中与我（AI）进行费曼学习对话。复制后粘贴到微信对话框，
          把 <code>{花括号}</code> 中的内容替换为实际章节名即可开始。
        </p>
        <div class="prompts-tips">
          <span class="tip-tag">💡 使用技巧</span>
          <p>对话结束后，发「记录薄弱点」指令，我会输出JSON格式的记录，你粘贴到网站或直接告诉我"帮我更新到网站"即可。</p>
        </div>
      </div>

      <div class="prompt-list">
        <div v-for="t in promptTemplates" :key="t.id" class="prompt-card">
          <div class="prompt-header">
            <span class="prompt-icon">{{ t.icon }}</span>
            <h4>{{ t.title }}</h4>
            <button class="copy-btn" :class="{ copied: copiedId === t.id }" @click="copyPrompt(t)">
              {{ copiedId === t.id ? '✓ 已复制' : '📋 复制' }}
            </button>
          </div>
          <pre class="prompt-body">{{ t.prompt }}</pre>
        </div>
      </div>

      <!-- 对话示例 -->
      <div class="example-panel">
        <h3>💬 对话示例（操作系统 · 进程调度）</h3>
        <div class="chat-example">
          <div class="chat-msg user">
            <span class="chat-role">你</span>
            <p>我要用费曼学习法复习操作系统的「进程调度算法」。我先讲：进程调度就是CPU决定下一个该让谁运行...</p>
          </div>
          <div class="chat-msg ai">
            <span class="chat-role">AI</span>
            <p>等等，"决定下一个该让谁运行"——这个"决定"是谁在做？是硬件自动切换还是有个专门的管理者？</p>
          </div>
          <div class="chat-msg user">
            <span class="chat-role">你</span>
            <p>是操作系统里的调度程序（Scheduler）在做决定，它按照某种算法从就绪队列里选一个进程...</p>
          </div>
          <div class="chat-msg ai">
            <span class="chat-role">AI</span>
            <p>好，那"某种算法"具体有哪些？你能用排队买奶茶的比喻给我讲讲FCFS和SJF的区别吗？</p>
          </div>
          <div class="chat-msg user">
            <span class="chat-role">你</span>
            <p>FCFS就是先来后到...SJF就是...呃...短作业优先就是...让做得快的人先...</p>
          </div>
          <div class="chat-msg ai">
            <span class="chat-role">AI</span>
            <p>🚨 卡点发现！你在解释SJF时犹豫了。关键问题：SJF的"短"是指已经知道要运行多久，还是预估的？这涉及到SJF能否真正实现的考点。重新组织一下？</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== 薄弱点记录 ==================== -->
    <div v-show="innerTab === 'weakpoints'" class="section-weak">
      <div class="weak-toolbar">
        <h2>⚠️ 薄弱点记录</h2>
        <div class="weak-actions">
          <el-select v-model="filterStatus" size="small" style="width: 100px">
            <el-option label="全部状态" value="all" />
            <el-option label="未解决" value="unresolved" />
            <el-option label="复习中" value="reviewing" />
            <el-option label="已解决" value="resolved" />
          </el-select>
          <el-select v-model="filterSeverity" size="small" style="width: 100px">
            <el-option label="全部等级" value="all" />
            <el-option label="高" value="high" />
            <el-option label="中" value="medium" />
            <el-option label="低" value="low" />
          </el-select>
          <el-button type="primary" size="small" @click="showAddDialog = true">+ 手动添加</el-button>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredWeakPoints.length === 0" class="weak-empty-state">
        <div class="empty-icon">🎉</div>
        <p v-if="store.data.weakPoints.length === 0">
          暂无薄弱点记录。<br>通过微信费曼对话或手动添加来记录你的卡点。
        </p>
        <p v-else>当前筛选条件下无记录。</p>
      </div>

      <!-- 薄弱点列表 -->
      <div v-else class="weak-grid">
        <div
          v-for="wp in filteredWeakPoints"
          :key="wp.id"
          class="wp-card"
          :class="statusMap[wp.status].cls"
        >
          <div class="wp-top">
            <el-tag :type="severityMap[wp.severity].type as any" size="small" effect="dark">
              {{ severityMap[wp.severity].label }}
            </el-tag>
            <span class="wp-topic">{{ wp.topic }}</span>
            <span class="wp-date">{{ wp.createdAt }}</span>
          </div>
          <h4 class="wp-concept">{{ wp.concept }}</h4>
          <p v-if="wp.description" class="wp-desc">{{ wp.description }}</p>
          <div class="wp-footer">
            <button class="wp-status-btn" @click="cycleStatus(wp)">
              {{ statusMap[wp.status].icon }} {{ statusMap[wp.status].label }}
              <span v-if="wp.reviewCount > 0" class="wp-review-count">· 复习{{ wp.reviewCount }}次</span>
            </button>
            <button class="wp-delete-btn" @click="handleDelete(wp)">删除</button>
          </div>
        </div>
      </div>

      <!-- 添加对话框 -->
      <el-dialog v-model="showAddDialog" title="添加薄弱点" width="480px" :close-on-click-modal="false">
        <el-form label-position="top">
          <el-form-item label="所属章节/主题" required>
            <el-input v-model="newWp.topic" placeholder="如：操作系统 · 第2章 进程管理" />
          </el-form-item>
          <el-form-item label="具体概念" required>
            <el-input v-model="newWp.concept" placeholder="如：进程状态转换条件" />
          </el-form-item>
          <el-form-item label="错误/卡点描述">
            <el-input v-model="newWp.description" type="textarea" :rows="3" placeholder="描述你的错误理解或卡在哪里" />
          </el-form-item>
          <el-form-item label="严重程度">
            <el-radio-group v-model="newWp.severity">
              <el-radio value="high">高（完全不懂）</el-radio>
              <el-radio value="medium">中（似懂非懂）</el-radio>
              <el-radio value="low">低（小疏忽）</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="showAddDialog = false">取消</el-button>
          <el-button type="primary" @click="submitWeakPoint">确认添加</el-button>
        </template>
      </el-dialog>
    </div>

    <!-- ==================== 会话历史 ==================== -->
    <div v-show="innerTab === 'history'" class="section-history">
      <h2>📋 费曼会话历史</h2>
      <div v-if="store.data.sessions.length === 0" class="weak-empty-state">
        <div class="empty-icon">📭</div>
        <p>暂无会话记录。<br>通过微信进行费曼对话后，记录会自动出现在这里。</p>
      </div>
      <div v-else class="session-list">
        <div v-for="s in store.data.sessions" :key="s.id" class="session-card">
          <div class="session-header">
            <span class="session-date">{{ s.date }}</span>
            <span class="session-topic">{{ s.topic }}</span>
            <div class="session-mastery">
              <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= s.mastery }">★</span>
            </div>
          </div>
          <p class="session-summary">{{ s.summary }}</p>
          <div v-if="s.concepts.length" class="session-concepts">
            <el-tag v-for="c in s.concepts" :key="c" size="small" type="info">{{ c }}</el-tag>
          </div>
          <div v-if="s.weakPointIds.length" class="session-weak-ref">
            发现 {{ s.weakPointIds.length }} 个薄弱点
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.feynman-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 统计条 */
.stats-bar {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #0d2137 0%, #16345c 100%);
  border-radius: 12px;
  flex-wrap: wrap;
}
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.stat-num {
  font-size: 1.5rem;
  font-weight: 800;
  color: #ffc53d;
  font-family: 'JetBrains Mono', monospace;
}
.stat-num.good {
  color: #67c23a;
}
.stat-label {
  font-size: 0.75rem;
  color: #a8bdd4;
  letter-spacing: 0.05em;
}
.stat-spacer {
  flex: 1;
}
.subject-switch :deep(.el-radio-button__inner) {
  background: rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.2);
  color: #a8bdd4;
}
.subject-switch :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background: #ffc53d;
  border-color: #ffc53d;
  color: #0d2137;
  font-weight: 700;
}

/* 内部导航 */
.inner-nav {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.inner-nav button {
  position: relative;
  padding: 10px 18px;
  border: 1px solid #e4ebf3;
  border-radius: 10px;
  background: #fff;
  color: #5b6b7f;
  font-size: 0.92rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.inner-nav button:hover {
  border-color: #16345c;
  color: #16345c;
}
.inner-nav button.active {
  background: #16345c;
  border-color: #16345c;
  color: #fff;
  font-weight: 700;
}
.nav-badge {
  position: absolute;
  top: -4px;
  right: -4px;
}

/* ==================== 方法论指南 ==================== */
.guide-hero {
  text-align: center;
  padding: 20px 0 10px;
}
.guide-hero h2 {
  font-size: 1.5rem;
  color: #1f2d3d;
  margin: 0 0 8px;
}
.guide-subtitle {
  color: #5b6b7f;
  font-style: italic;
  font-size: 0.95rem;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
  margin: 20px 0;
}
.step-card {
  position: relative;
  background: #f5f8fc;
  border: 1px solid #e4ebf3;
  border-radius: 14px;
  padding: 22px 18px 18px;
  transition: all 0.25s;
}
.step-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(13, 33, 55, 0.1);
  border-color: #ffc53d;
}
.step-num {
  position: absolute;
  top: 12px;
  right: 14px;
  font-size: 2rem;
  font-weight: 900;
  color: rgba(22, 52, 92, 0.07);
  font-family: 'JetBrains Mono', monospace;
}
.step-icon {
  font-size: 1.8rem;
  margin-bottom: 10px;
}
.step-card h3 {
  margin: 0 0 8px;
  font-size: 1.05rem;
  color: #1f2d3d;
}
.step-card > p {
  margin: 0 0 12px;
  font-size: 0.9rem;
  color: #5b6b7f;
  line-height: 1.6;
}
.step-tip {
  background: #fff;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 0.82rem;
  color: #303133;
  border: 1px solid #e4ebf3;
  line-height: 1.5;
}

/* 工作流程 */
.workflow-panel {
  background: #fff;
  border: 1px solid #e4ebf3;
  border-radius: 14px;
  padding: 24px;
  margin: 20px 0;
}
.workflow-panel h3 {
  margin: 0 0 18px;
  font-size: 1.15rem;
  color: #1f2d3d;
}
.workflow-steps {
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
  padding-left: 20px;
}
.workflow-steps::before {
  content: '';
  position: absolute;
  left: 7px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  background: linear-gradient(to bottom, #ffc53d, #16345c);
  border-radius: 1px;
}
.wf-step {
  display: flex;
  gap: 16px;
  padding: 12px 0;
  position: relative;
}
.wf-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ffc53d;
  border: 2px solid #fff;
  box-shadow: 0 0 0 2px #ffc53d;
  flex-shrink: 0;
  margin-top: 4px;
  position: relative;
  z-index: 1;
}
.wf-dot.done {
  background: #67c23a;
  box-shadow: 0 0 0 2px #67c23a;
}
.wf-content strong {
  display: block;
  color: #16345c;
  font-size: 0.95rem;
  margin-bottom: 4px;
}
.wf-content p {
  margin: 0;
  font-size: 0.88rem;
  color: #5b6b7f;
  line-height: 1.6;
}

/* 联动面板 */
.link-panel {
  background: #fffbe6;
  border: 1px solid #ffd66b;
  border-radius: 14px;
  padding: 22px;
}
.link-panel h3 {
  margin: 0 0 10px;
  font-size: 1.1rem;
  color: #1f2d3d;
}
.link-panel > p {
  margin: 0 0 14px;
  font-size: 0.9rem;
  color: #5b6b7f;
}
.link-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 14px;
}
.link-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #fff;
  border-radius: 10px;
  padding: 14px;
  border: 1px solid #e4ebf3;
}
.link-icon {
  font-size: 1.5rem;
}
.link-card strong {
  display: block;
  color: #1f2d3d;
  font-size: 0.92rem;
  margin-bottom: 4px;
}
.link-card p {
  margin: 0;
  font-size: 0.82rem;
  color: #5b6b7f;
  line-height: 1.5;
}
.link-hint {
  font-size: 0.85rem;
  color: #8c6d1f;
  background: rgba(255, 197, 61, 0.1);
  padding: 10px 14px;
  border-radius: 8px;
  line-height: 1.5;
}

/* ==================== AI对话指令 ==================== */
.prompts-intro {
  margin-bottom: 20px;
}
.prompts-intro h2 {
  margin: 0 0 8px;
  font-size: 1.3rem;
  color: #1f2d3d;
}
.prompts-intro > p {
  margin: 0 0 12px;
  font-size: 0.92rem;
  color: #5b6b7f;
  line-height: 1.6;
}
.prompts-intro code {
  background: #f0f2f5;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.85em;
  color: #e6a23c;
}
.prompts-tips {
  background: #f0f9eb;
  border: 1px solid #b3e19d;
  border-radius: 10px;
  padding: 12px 16px;
}
.tip-tag {
  font-weight: 700;
  font-size: 0.85rem;
  color: #67c23a;
}
.prompts-tips p {
  margin: 6px 0 0;
  font-size: 0.85rem;
  color: #5b6b7f;
  line-height: 1.5;
}

.prompt-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.prompt-card {
  background: #fff;
  border: 1px solid #e4ebf3;
  border-radius: 14px;
  overflow: hidden;
  transition: border-color 0.2s;
}
.prompt-card:hover {
  border-color: #16345c;
}
.prompt-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  background: #f5f8fc;
  border-bottom: 1px solid #e4ebf3;
}
.prompt-icon {
  font-size: 1.3rem;
}
.prompt-header h4 {
  margin: 0;
  flex: 1;
  font-size: 1rem;
  color: #1f2d3d;
}
.copy-btn {
  padding: 6px 14px;
  border: 1px solid #e4ebf3;
  border-radius: 8px;
  background: #fff;
  color: #5b6b7f;
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.2s;
}
.copy-btn:hover {
  border-color: #16345c;
  color: #16345c;
}
.copy-btn.copied {
  background: #67c23a;
  border-color: #67c23a;
  color: #fff;
}
.prompt-body {
  margin: 0;
  padding: 16px 18px;
  font-size: 0.85rem;
  line-height: 1.7;
  color: #303133;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  max-height: 240px;
  overflow-y: auto;
}

/* 对话示例 */
.example-panel {
  margin-top: 24px;
  background: #fff;
  border: 1px solid #e4ebf3;
  border-radius: 14px;
  padding: 22px;
}
.example-panel h3 {
  margin: 0 0 16px;
  font-size: 1.05rem;
  color: #1f2d3d;
}
.chat-example {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.chat-msg {
  max-width: 85%;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 0.88rem;
  line-height: 1.6;
}
.chat-msg.user {
  align-self: flex-end;
  background: #16345c;
  color: #fff;
  border-bottom-right-radius: 4px;
}
.chat-msg.ai {
  align-self: flex-start;
  background: #f5f8fc;
  color: #303133;
  border: 1px solid #e4ebf3;
  border-bottom-left-radius: 4px;
}
.chat-role {
  display: block;
  font-size: 0.72rem;
  font-weight: 700;
  margin-bottom: 4px;
  opacity: 0.7;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.chat-msg p {
  margin: 0;
}

/* ==================== 薄弱点记录 ==================== */
.weak-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}
.weak-toolbar h2 {
  margin: 0;
  font-size: 1.2rem;
  color: #1f2d3d;
}
.weak-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.weak-empty-state {
  text-align: center;
  padding: 48px 20px;
  color: #5b6b7f;
}
.empty-icon {
  font-size: 3rem;
  margin-bottom: 12px;
}
.weak-empty-state p {
  font-size: 0.92rem;
  line-height: 1.7;
}

.weak-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 14px;
}
.wp-card {
  background: #fff;
  border: 1px solid #e4ebf3;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.2s;
  border-left: 4px solid #e4ebf3;
}
.wp-card.st-unresolved {
  border-left-color: #F56C6C;
}
.wp-card.st-reviewing {
  border-left-color: #E6A23C;
}
.wp-card.st-resolved {
  border-left-color: #67C23A;
  opacity: 0.75;
}
.wp-card:hover {
  box-shadow: 0 4px 16px rgba(13, 33, 55, 0.08);
}
.wp-top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.wp-topic {
  flex: 1;
  font-size: 0.8rem;
  color: #5b6b7f;
}
.wp-date {
  font-size: 0.75rem;
  color: #909399;
  font-family: 'JetBrains Mono', monospace;
}
.wp-concept {
  margin: 0 0 6px;
  font-size: 1rem;
  color: #1f2d3d;
}
.wp-desc {
  margin: 0 0 12px;
  font-size: 0.85rem;
  color: #5b6b7f;
  line-height: 1.5;
}
.wp-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.wp-status-btn {
  padding: 4px 10px;
  border: 1px solid #e4ebf3;
  border-radius: 6px;
  background: #f5f8fc;
  font-size: 0.8rem;
  cursor: pointer;
  color: #303133;
  transition: all 0.2s;
}
.wp-status-btn:hover {
  border-color: #16345c;
}
.wp-review-count {
  color: #909399;
  font-size: 0.75rem;
}
.wp-delete-btn {
  padding: 4px 8px;
  border: none;
  background: none;
  color: #909399;
  font-size: 0.78rem;
  cursor: pointer;
}
.wp-delete-btn:hover {
  color: #F56C6C;
}

/* ==================== 会话历史 ==================== */
.section-history h2 {
  margin: 0 0 16px;
  font-size: 1.2rem;
  color: #1f2d3d;
}
.session-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.session-card {
  background: #fff;
  border: 1px solid #e4ebf3;
  border-radius: 12px;
  padding: 16px 18px;
}
.session-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}
.session-date {
  font-size: 0.8rem;
  color: #909399;
  font-family: 'JetBrains Mono', monospace;
}
.session-topic {
  flex: 1;
  font-weight: 600;
  color: #1f2d3d;
  font-size: 0.95rem;
}
.session-mastery .star {
  color: #dcdfe6;
  font-size: 0.9rem;
}
.session-mastery .star.filled {
  color: #ffc53d;
}
.session-summary {
  margin: 0 0 10px;
  font-size: 0.88rem;
  color: #5b6b7f;
  line-height: 1.6;
}
.session-concepts {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}
.session-weak-ref {
  font-size: 0.8rem;
  color: #F56C6C;
  font-weight: 500;
}

/* ==================== 响应式 ==================== */
@media (max-width: 768px) {
  .stats-bar {
    gap: 16px;
    padding: 12px 14px;
  }
  .stat-num {
    font-size: 1.2rem;
  }
  .inner-nav {
    gap: 6px;
  }
  .inner-nav button {
    padding: 8px 12px;
    font-size: 0.82rem;
  }
  .steps-grid {
    grid-template-columns: 1fr;
  }
  .link-cards {
    grid-template-columns: 1fr;
  }
  .weak-grid {
    grid-template-columns: 1fr;
  }
  .chat-msg {
    max-width: 95%;
  }
  .prompt-body {
    font-size: 0.8rem;
    max-height: 180px;
  }
}
</style>

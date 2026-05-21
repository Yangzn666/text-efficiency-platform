<template>
  <div class="vocabulary-learning">
    <div class="page-header">
      <h2>📚 词汇学习系统</h2>
      <p>词根词缀 + 笔记整理，高效记忆单词</p>
    </div>

    <!-- 选项卡切换 -->
    <div class="tab-switcher">
      <button 
        :class="['tab-btn', { active: activeTab === 'roots' }]" 
        @click="activeTab = 'roots'"
      >
        词根词缀学习
      </button>
      <button 
        :class="['tab-btn', { active: activeTab === 'confusable' }]" 
        @click="activeTab = 'confusable'"
      >
        形近词对比
      </button>
      <button 
        :class="['tab-btn', { active: activeTab === 'notes' }]" 
        @click="activeTab = 'notes'"
      >
        学习笔记系统
      </button>
    </div>

    <!-- 词根词缀学习 -->
    <div v-if="activeTab === 'roots'" class="roots-section">
      <!-- 搜索框 -->
      <div class="search-box">
        <el-icon><Search /></el-icon>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="搜索词根词缀..."
          @input="filterRoots"
        />
      </div>

      <!-- 字母导航 -->
      <div class="letter-nav">
        <button 
          v-for="letter in letters" 
          :key="letter"
          :class="['letter-btn', { active: currentLetter === letter }]"
          @click="currentLetter = letter"
        >
          {{ letter }}
        </button>
      </div>

      <!-- 词根列表 -->
      <div class="roots-list">
        <div 
          v-for="group in filteredRoots" 
          :key="group.letter"
          class="roots-group"
        >
          <h3 class="group-title">{{ group.letter }}</h3>
          <div class="roots-grid">
            <div 
              v-for="root in group.items" 
              :key="root.id"
              class="root-card"
              @click="showRootDetail(root)"
            >
              <div class="root-word">{{ root.root }}</div>
              <div class="root-meaning">{{ root.meaning }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 词根详情弹窗 -->
      <el-dialog 
        v-model="detailDialogVisible" 
        :title="selectedRoot?.root"
        width="700px"
      >
        <div class="root-detail">
          <p class="detail-meaning">
            <strong>含义：</strong>{{ selectedRoot?.meaning }}
          </p>
          
          <div v-if="selectedRoot?.vocab && selectedRoot.vocab.length > 0" class="vocab-section">
            <h4>相关考研词汇</h4>
            <div class="vocab-list">
              <div 
                v-for="(word, index) in selectedRoot.vocab" 
                :key="index"
                class="vocab-item"
              >
                <div class="vocab-word">{{ word.word }}</div>
                <div class="vocab-meaning">{{ word.meaning }}</div>
                <div v-if="word.example" class="vocab-example">
                  <em>"{{ word.example }}"</em>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="no-vocab">
            <el-empty description="暂无相关词汇数据" :image-size="80" />
          </div>
        </div>
      </el-dialog>
    </div>

    <!-- 形近词对比 -->
    <div v-if="activeTab === 'confusable'" class="confusable-section">
      <div class="section-header">
        <h3>🔍 形近词对比学习</h3>
        <p>区分容易混淆的单词，避免考试出错</p>
      </div>

      <!-- 形近词组列表 -->
      <div class="confusable-groups">
        <div 
          v-for="group in confusableGroups" 
          :key="group.id"
          class="confusable-group-card"
        >
          <div class="group-header">
            <h4>{{ group.title }}</h4>
            <el-tag size="small" type="warning">{{ group.words.length }}个词</el-tag>
          </div>
          
          <div class="words-comparison">
            <div 
              v-for="(word, index) in group.words" 
              :key="index"
              class="word-item"
              @click="showWordDetail(word, group)"
            >
              <div class="word-main">
                <span class="word-text">{{ word.content }}</span>
                <el-icon><ArrowRight /></el-icon>
              </div>
              <div class="word-translation">{{ word.translation }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 单词详情弹窗 -->
      <el-dialog 
        v-model="wordDetailVisible" 
        :title="selectedWord?.content"
        width="500px"
      >
        <div class="word-detail-content">
          <p class="detail-translation">
            <strong>释义：</strong>{{ selectedWord?.translation }}
          </p>
          
          <div v-if="selectedGroup" class="similar-words">
            <h4>同组形近词</h4>
            <div class="similar-list">
              <div 
                v-for="word in selectedGroup.words" 
                :key="word.content"
                :class="['similar-item', { active: word.content === selectedWord?.content }]"
              >
                <strong>{{ word.content }}</strong>
                <span>{{ word.translation }}</span>
              </div>
            </div>
          </div>
          
          <div class="memory-tip">
            <el-alert
              title="记忆技巧"
              type="info"
              :closable="false"
              show-icon
            >
              <p>注意这些单词的拼写差异，重点关注不同的字母部分</p>
            </el-alert>
          </div>
        </div>
      </el-dialog>
    </div>

    <!-- 学习笔记系统 -->
    <div v-if="activeTab === 'notes'" class="notes-section">
      <div class="notes-header">
        <h3>我的学习笔记</h3>
        <el-button type="primary" @click="openNoteDialog()">
          <el-icon><Plus /></el-icon>
          添加笔记
        </el-button>
      </div>

      <!-- 笔记筛选 -->
      <div class="notes-filter">
        <el-select v-model="noteFilter" placeholder="筛选类型" clearable>
          <el-option label="全部" value="" />
          <el-option label="单词" value="word" />
          <el-option label="词组" value="phrase" />
          <el-option label="句子" value="sentence" />
          <el-option label="总结" value="summary" />
          <el-option label="易混淆" value="confusable" />
        </el-select>
      </div>

      <!-- 笔记列表 -->
      <div v-if="filteredNotes.length > 0" class="notes-list">
        <div 
          v-for="note in filteredNotes" 
          :key="note.id"
          :class="['note-card', `note-${note.type}`]"
        >
          <div class="note-header">
            <el-tag :type="getNoteTypeColor(note.type)" size="small">
              {{ getNoteTypeLabel(note.type) }}
            </el-tag>
            <span class="note-date">{{ note.date }}</span>
          </div>
          <div class="note-content">{{ note.content }}</div>
          <div v-if="note.tags && note.tags.length > 0" class="note-tags">
            <el-tag 
              v-for="tag in note.tags" 
              :key="tag"
              size="small"
              effect="plain"
            >
              {{ tag }}
            </el-tag>
          </div>
          <div class="note-actions">
            <el-button size="small" @click="editNote(note)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteNote(note.id)">删除</el-button>
          </div>
        </div>
      </div>
      <div v-else class="empty-notes">
        <el-empty description="暂无笔记，点击添加按钮开始记录吧~" />
      </div>
    </div>

    <!-- 笔记编辑弹窗 -->
    <el-dialog 
      v-model="noteDialogVisible" 
      :title="isEditing ? '编辑笔记' : '添加笔记'"
      width="600px"
    >
      <el-form :model="noteForm" label-width="80px">
        <el-form-item label="类型">
          <el-select v-model="noteForm.type" placeholder="选择类型">
            <el-option label="单词" value="word" />
            <el-option label="词组" value="phrase" />
            <el-option label="句子" value="sentence" />
            <el-option label="总结" value="summary" />
            <el-option label="易混淆" value="confusable" />
          </el-select>
        </el-form-item>
        <el-form-item label="内容">
          <el-input 
            v-model="noteForm.content" 
            type="textarea" 
            :rows="4"
            placeholder="输入单词、词组、句子或总结内容"
          />
        </el-form-item>
        <el-form-item label="标签">
          <el-input 
            v-model="noteForm.tagsInput" 
            placeholder="输入标签，用逗号分隔（如：考研,高频）"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="noteDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveNote">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Search, Plus, ArrowRight } from '@element-plus/icons-vue'

// 当前激活的选项卡
const activeTab = ref('roots')

// 词根词缀相关
const searchQuery = ref('')
const currentLetter = ref('ALL')
const detailDialogVisible = ref(false)
const selectedRoot = ref<any>(null)

// 字母列表
const letters = ['ALL', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'V', 'W']

// 词根数据（完整版 - 151个词根，包含词汇和例句）
const rootsData = [
  { letter: 'A', items: [
    { id: 1, root: 'apt', meaning: '合适的', vocab: [
      { word: 'apt', meaning: '恰当的，易于…的', example: 'She is apt to forget things under pressure.' },
      { word: 'aptitude', meaning: '天资，才能', example: 'He has an aptitude for learning languages.' },
      { word: 'inept', meaning: '不适当的，无能的', example: 'His inept handling of the situation made things worse.' },
      { word: 'adapt', meaning: '适应，改编', example: 'It\'s hard to adapt to a new culture.' },
      { word: 'adaptive', meaning: '适应的，有适应能力的', example: 'Humans are highly adaptive creatures.' }
    ]},
    { id: 2, root: 'arch', meaning: '统治者，主要的', vocab: [
      { word: 'arch', meaning: '主要的，首席的', example: 'The archbishop blessed the congregation.' },
      { word: 'architect', meaning: '建筑师', example: 'Frank Lloyd Wright was a famous architect.' },
      { word: 'architecture', meaning: '建筑学，建筑风格', example: 'Gothic architecture is beautiful.' },
      { word: 'archetype', meaning: '原型，范例', example: 'This character is the archetype of the hero.' },
      { word: 'monarch', meaning: '君主', example: 'The monarch ruled for fifty years.' }
    ]},
    { id: 3, root: 'aug', meaning: '增长', vocab: [
      { word: 'augment', meaning: '增加，增大', example: 'The company plans to augment its workforce.' },
      { word: 'augmentation', meaning: '增加，增大', example: 'The augmentation in salary was welcome.' },
      { word: 'auction', meaning: '拍卖', example: 'They sold the painting at auction.' },
      { word: 'august', meaning: '威严的，令人敬畏的', example: 'The professor had an august presence.' }
    ]}
  ]},
  
  { letter: 'B', items: [
    { id: 4, root: 'bare', meaning: '贫瘠的', vocab: [
      { word: 'bare', meaning: '赤裸的，仅仅的', example: 'She wore a bare dress to the beach.' },
      { word: 'barely', meaning: '仅仅，几乎不', example: 'He barely passed the exam.' },
      { word: 'barren', meaning: '贫瘠的，不毛的', example: 'The barren land could not support crops.' },
      { word: 'barest', meaning: 'bare的最高级', example: 'In the barest sense, it means survival.' }
    ]},
    { id: 5, root: 'bene', meaning: '好的', vocab: [
      { word: 'benefit', meaning: '利益，好处', example: 'Exercise has many health benefits.' },
      { word: 'benevolent', meaning: '慈善的，仁慈的', example: 'He made a benevolent donation.' },
      { word: 'beneficial', meaning: '有益的，有利的', example: 'A balanced diet is beneficial to health.' },
      { word: 'benign', meaning: '良性的，温和的', example: 'The tumor was benign.' }
    ]},
    { id: 6, root: 'bi', meaning: '二', vocab: [
      { word: 'bicycle', meaning: '自行车', example: 'I ride my bicycle to work.' },
      { word: 'bilingual', meaning: '会说两种语言的', example: 'She is bilingual in English and Spanish.' },
      { word: 'bilateral', meaning: '双边的，两侧的', example: 'They signed a bilateral agreement.' },
      { word: 'biology', meaning: '生物学', example: 'He studies marine biology.' },
      { word: 'biography', meaning: '传记', example: 'I read his biography last week.' }
    ]},
    { id: 7, root: 'bide', meaning: '停留', vocab: [
      { word: 'bide', meaning: '等待，居住', example: 'I will bide my time and wait for the right opportunity.' },
      { word: 'abide', meaning: '遵守，忍受', example: 'We must abide by the rules.' },
      { word: 'abiding', meaning: '持久的，始终不渝的', example: 'She has an abiding love for music.' }
    ]},
    { id: 8, root: 'bul', meaning: '球', vocab: [
      { word: 'bullet', meaning: '子弹', example: 'The gun fired a bullet.' },
      { word: 'bulletin', meaning: '公告，公报', example: 'The school posted a bulletin.' },
      { word: 'bull', meaning: '公牛', example: 'The bull charged at the matador.' },
      { word: 'bulb', meaning: '球状物，灯泡', example: 'Change the light bulb, please.' }
    ]}
  ]},
  
  { letter: 'C', items: [
    { id: 9, root: 'can', meaning: '管子', vocab: [
      { word: 'cancel', meaning: '取消，删去', example: 'They had to cancel the flight.' },
      { word: 'cannon', meaning: '大炮', example: 'The cannon fired loudly.' },
      { word: 'canvas', meaning: '帆布', example: 'The artist painted on canvas.' }
    ]},
    { id: 10, root: 'card', meaning: '心', vocab: [
      { word: 'cardiac', meaning: '心脏的', example: 'He suffered from cardiac arrest.' },
      { word: 'cardinal', meaning: '主要的，基本的', example: 'Honesty is a cardinal virtue.' },
      { word: 'card', meaning: '卡片', example: 'Please show your ID card.' }
    ]},
    { id: 11, root: 'ced', meaning: 'to do', vocab: [
      { word: 'precede', meaning: '领先于，先于', example: 'The introduction precedes the first chapter.' },
      { word: 'proceed', meaning: '继续进行，前进', example: 'Let\'s proceed with the meeting.' },
      { word: 'exceed', meaning: '超过，胜过', example: 'His performance exceeded expectations.' },
      { word: 'recede', meaning: '后退，减弱', example: 'The flood waters began to recede.' }
    ]},
    { id: 12, root: 'cern', meaning: '区分', vocab: [
      { word: 'concern', meaning: '关心，担心；有关的事', example: 'Her main concern is her children\'s education.' },
      { word: 'discern', meaning: '辨别，识别', example: 'It\'s hard to discern the truth.' },
      { word: 'discernible', meaning: '可辨别的', example: 'There was no discernible difference.' }
    ]},
    { id: 13, root: 'cert', meaning: '确定的，确信的', vocab: [
      { word: 'certain', meaning: '确定的，某些', example: 'I\'m certain about my decision.' },
      { word: 'certificate', meaning: '证书', example: 'He received a certificate of completion.' },
      { word: 'certify', meaning: '证明，证实', example: 'The document was certified by a notary.' }
    ]},
    { id: 14, root: 'cept', meaning: '拿取', vocab: [
      { word: 'concept', meaning: '概念，观念', example: 'I don\'t understand the concept.' },
      { word: 'conceive', meaning: '构思，怀孕', example: 'She conceived a brilliant idea.' },
      { word: 'perceive', meaning: '察觉，感知', example: 'I perceived a change in his attitude.' },
      { word: 'reception', meaning: '接待，接收', example: 'The hotel reception was very welcoming.' }
    ]},
    { id: 15, root: 'cens', meaning: '评定', vocab: [
      { word: 'censor', meaning: '审查，检查', example: 'The movie was censored for violence.' },
      { word: 'census', meaning: '人口普查', example: 'The census takes place every ten years.' },
      { word: 'censure', meaning: '谴责，指责', example: 'The senator faced public censure.' }
    ]},
    { id: 16, root: 'cess', meaning: '走', vocab: [
      { word: 'process', meaning: '过程，处理', example: 'The application process is lengthy.' },
      { word: 'access', meaning: '通道，进入', example: 'The password gives you access.' },
      { word: 'excess', meaning: '过度，过量', example: 'Eating in excess is unhealthy.' },
      { word: 'recess', meaning: '休息时间，凹处', example: 'The students played during recess.' }
    ]},
    { id: 17, root: 'cip', meaning: '拿取', vocab: [
      { word: 'incipient', meaning: '初期的，开始的', example: 'The fire was still incipient.' },
      { word: 'recipient', meaning: '接受者，接收器', example: 'She was the recipient of the award.' },
      { word: 'emancipate', meaning: '解放，解除束缚', example: 'The slaves were emancipated.' }
    ]},
    { id: 18, root: 'cis', meaning: '砍，杀', vocab: [
      { word: 'decisive', meaning: '决定性的，果断的', example: 'His vote was decisive.' },
      { word: 'precise', meaning: '精确的，准确的', example: 'Give me a precise time.' },
      { word: 'concise', meaning: '简洁的，简明的', example: 'Please be concise in your answer.' }
    ]},
    { id: 19, root: 'cit', meaning: '叫喊', vocab: [
      { word: 'excite', meaning: '使兴奋，激起', example: 'The news excited everyone.' },
      { word: 'cite', meaning: '引用，引证', example: 'You must cite your sources.' },
      { word: 'recite', meaning: '背诵，朗诵', example: 'The student recited a poem.' }
    ]},
    { id: 20, root: 'clam', meaning: '黏住', vocab: [
      { word: 'claim', meaning: '声称，要求', example: 'He claimed to be innocent.' },
      { word: 'acclaim', meaning: '称赞，喝彩', example: 'The movie received acclaim.' },
      { word: 'proclaim', meaning: '宣布，声明', example: 'The president proclaimed a holiday.' }
    ]},
    { id: 21, root: 'corp', meaning: '身体，主体', vocab: [
      { word: 'corporation', meaning: '公司，法人团体', example: 'He works for a multinational corporation.' },
      { word: 'corps', meaning: '军团，队', example: 'He joined the Marine Corps.' },
      { word: 'corpse', meaning: '尸体', example: 'The corpse was found by the river.' },
      { word: 'incorporate', meaning: '合并，包含', example: 'The contract incorporates all terms.' }
    ]},
    { id: 22, root: 'counter', meaning: '相反的', vocab: [
      { word: 'counter', meaning: '柜台，反对', example: 'Place your order at the counter.' },
      { word: 'counteract', meaning: '抵消，阻碍', example: 'The antidote will counteract the poison.' },
      { word: 'encounter', meaning: '遭遇，遇到', example: 'We encountered difficulties.' }
    ]},
    { id: 23, root: 'cre', meaning: '区分', vocab: [
      { word: 'create', meaning: '创造，创作', example: 'God created the world.' },
      { word: 'creature', meaning: '生物，动物', example: 'Every creature has value.' },
      { word: 'credible', meaning: '可信的，可靠的', example: 'That sounds credible.' }
    ]},
    { id: 24, root: 'crit', meaning: '判断，评论', vocab: [
      { word: 'criticize', meaning: '批评，评论', example: 'Don\'t criticize others unfairly.' },
      { word: 'critique', meaning: '批判，评论', example: 'She wrote a critique of the novel.' },
      { word: 'critical', meaning: '关键的，批评的', example: 'This is a critical moment.' }
    ]},
    { id: 25, root: 'cumb', meaning: '倾斜，躺', vocab: [
      { word: 'succumb', meaning: '屈服，死于', example: 'He succumbed to cancer.' },
      { word: 'encumber', meaning: '妨碍，阻挠', example: 'Debt encumbers him.' },
      { word: 'cumbersome', meaning: '笨重的，累赘的', example: 'The furniture is cumbersome to move.' }
    ]},
    { id: 26, root: 'curs', meaning: '跑', vocab: [
      { word: 'cursor', meaning: '光标', example: 'Move the cursor to select text.' },
      { word: 'course', meaning: '课程，过程', example: 'I\'m taking a computer course.' },
      { word: 'discourse', meaning: '论述，谈话', example: 'His discourse was enlightening.' }
    ]},
    { id: 27, root: 'cyn', meaning: '狗', vocab: [
      { word: 'cynical', meaning: '愤世嫉俗的，冷嘲的', example: 'He\'s cynical about politics.' },
      { word: 'cynicism', meaning: '犬儒主义，愤世嫉俗', example: 'His cynicism hides deep hurt.' },
      { word: 'cynic', meaning: '愤世嫉俗者', example: 'He became a cynic after his divorce.' }
    ]}
  ]},
  
  { letter: 'D', items: [
    { id: 28, root: 'dem', meaning: '人们', vocab: [
      { word: 'democracy', meaning: '民主，民主制度', example: 'Democracy is based on freedom.' },
      { word: 'democrat', meaning: '民主党人', example: 'He is a registered democrat.' },
      { word: 'demographic', meaning: '人口统计的', example: 'The demographic has changed.' }
    ]},
    { id: 29, root: 'div', meaning: '上帝', vocab: [
      { word: 'divine', meaning: '神圣的，神的', example: 'The cathedral has divine beauty.' },
      { word: 'divinity', meaning: '神性，神学', example: 'He studied divinity at university.' },
      { word: 'dividend', meaning: '红利，股息', example: 'The dividend was higher this year.' }
    ]},
    { id: 30, root: 'dign', meaning: '值得尊敬的', vocab: [
      { word: 'dignity', meaning: '尊严，高贵', example: 'He maintained his dignity.' },
      { word: 'dignified', meaning: '有威严的，体面的', example: 'She looked dignified in her uniform.' },
      { word: 'indignant', meaning: '愤怒的，愤慨的', example: 'He was indignant at the accusation.' }
    ]},
    { id: 31, root: 'doc', meaning: '教', vocab: [
      { word: 'document', meaning: '文件，证件', example: 'Please sign this document.' },
      { word: 'doctrine', meaning: '教义，学说', example: 'Marxist doctrine influenced him.' },
      { word: 'docile', meaning: '温顺的，易教导的', example: 'The dog is very docile.' }
    ]},
    { id: 32, root: 'dol', meaning: '感到悲痛', vocab: [
      { word: 'doleful', meaning: '悲伤的，忧愁的', example: 'She gave a doleful sigh.' },
      { word: 'condole', meaning: '慰问，哀悼', example: 'I condoled with her on her loss.' }
    ]},
    { id: 33, root: 'dors', meaning: '后背', vocab: [
      { word: 'dorsal', meaning: '背部的', example: 'The dorsal fin of a shark.' },
      { word: 'endorse', meaning: '支持，背书', example: 'The candidate endorsed the policy.' }
    ]}
  ]},
  
  { letter: 'E', items: [
    { id: 34, root: 'empt', meaning: '拿取', vocab: [
      { word: 'empty', meaning: '空的', example: 'The glass is empty.' },
      { word: 'exempt', meaning: '免除，豁免', example: 'Students are exempt from taxes.' },
      { word: 'attempt', meaning: '尝试，企图', example: 'He attempted to climb the mountain.' }
    ]}
  ]},
  
  { letter: 'F', items: [
    { id: 35, root: 'fect', meaning: '去做', vocab: [
      { word: 'perfect', meaning: '完美的', example: 'She gave a perfect performance.' },
      { word: 'defect', meaning: '缺点，缺陷', example: 'Every product has its defects.' },
      { word: 'effect', meaning: '效果，影响', example: 'The new law had a positive effect.' },
      { word: 'effective', meaning: '有效的', example: 'This is an effective solution.' },
      { word: 'affect', meaning: '影响', example: 'The rain will affect our plans.' }
    ]},
    { id: 36, root: 'feit', meaning: '做', vocab: [
      { word: 'feint', meaning: '假装，佯攻', example: 'The boxer made a feint to distract his opponent.' },
      { word: 'feat', meaning: '技艺，功绩', example: 'Finishing the marathon was quite a feat.' }
    ]},
    { id: 37, root: 'fess', meaning: '说话', vocab: [
      { word: 'confess', meaning: '承认，坦白', example: 'He confessed his guilt to the police.' },
      { word: 'profess', meaning: '声称， profess', example: 'She professes to be an expert.' },
      { word: 'profession', meaning: '职业，专业', example: 'Teaching is a noble profession.' }
    ]},
    { id: 38, root: 'fid', meaning: '信任', vocab: [
      { word: 'confident', meaning: '自信的', example: 'She felt confident about the exam.' },
      { word: 'confidence', meaning: '信心，信任', example: 'He has faith and confidence.' },
      { word: 'diffident', meaning: '缺乏自信的', example: 'He was too diffident to speak up.' },
      { word: 'fidelity', meaning: '忠诚，保真度', example: 'The dog showed great fidelity to its owner.' }
    ]},
    { id: 39, root: 'fix', meaning: '固定', vocab: [
      { word: 'fix', meaning: '修理，固定', example: 'Can you fix my bike?' },
      { word: 'fixture', meaning: '固定装置', example: 'The lights are permanent fixtures.' },
      { word: 'prefix', meaning: '前缀', example: 'The prefix "un" means "not".' }
    ]},
    { id: 40, root: 'firm', meaning: '强壮的', vocab: [
      { word: 'firm', meaning: '坚定的，稳固的', example: 'He has a firm belief in justice.' },
      { word: 'affirm', meaning: '肯定，确认', example: 'The court affirmed the decision.' },
      { word: 'confirm', meaning: '确认，证实', example: 'Please confirm your reservation.' },
      { word: 'infirm', meaning: '虚弱的，不牢固的', example: 'He became infirm with age.' }
    ]},
    { id: 41, root: 'fring', meaning: '打碎', vocab: [
      { word: 'infringe', meaning: '侵犯，违反', example: 'Don\'t infringe on others\' rights.' },
      { word: 'refrain', meaning: '避免，克制', example: 'Refrain from smoking here.' },
      { word: 'suffrage', meaning: '选举权，投票权', example: 'Women fought for suffrage.' }
    ]},
    { id: 42, root: 'fug', meaning: '逃跑', vocab: [
      { word: 'fugitive', meaning: '逃亡者', example: 'The fugitive was arrested.' },
      { word: 'refuge', meaning: '避难所，庇护', example: 'The refugees sought refuge.' },
      { word: 'subterfuge', meaning: '诡计，借口', example: 'He used subterfuge to escape.' }
    ]},
    { id: 44, root: 'fut fus', meaning: '流动', vocab: [
      { word: 'fusion', meaning: '融合，合并', example: 'The fusion of cultures creates diversity.' },
      { word: 'confuse', meaning: '使困惑，混淆', example: 'Don\'t confuse these two concepts.' },
      { word: 'diffuse', meaning: '扩散，散开', example: 'Heat diffuses through the metal.' },
      { word: 'infuse', meaning: '注入，泡制', example: 'Infuse the tea for five minutes.' }
    ]}
  ]},
  
  { letter: 'G', items: [
    { id: 45, root: 'greg', meaning: '人群', vocab: [
      { word: 'aggregate', meaning: '聚集，合计', example: 'Aggregate the data for analysis.' },
      { word: 'congregate', meaning: '聚集，集合', example: 'Birds congregate in the evening.' },
      { word: 'gregarious', meaning: '群居的，爱社交的', example: 'Dogs are gregarious animals.' }
    ]},
    { id: 46, root: 'grip', meaning: '抓', vocab: [
      { word: 'grip', meaning: '紧握，抓牢', example: 'Grip the handle firmly.' },
      { word: 'gripe', meaning: '抱怨， gripe', example: 'He griped about the poor service.' }
    ]}
  ]},
  
  { letter: 'H', items: [
    { id: 46, root: 'heav', meaning: '举起', vocab: [
      { word: 'heave', meaning: '举起，投掷', example: 'Heave the box onto the truck.' },
      { word: 'heavy', meaning: '重的，沉重的', example: 'This suitcase is heavy.' }
    ]},
    { id: 47, root: 'her', meaning: '粘，黏', vocab: [
      { word: 'adhere', meaning: '粘附，坚持', example: 'Adhere to the rules strictly.' },
      { word: 'coherent', meaning: '连贯的，一致的', example: 'Your argument should be coherent.' },
      { word: 'hereditary', meaning: '遗传的，世袭的', example: 'Haemophilia is hereditary.' }
    ]},
    { id: 48, root: 'hier', meaning: '神圣的', vocab: [
      { word: 'hierarchy', meaning: '等级制度', example: 'The company has a clear hierarchy.' },
      { word: 'hierarchical', meaning: '分层的，等级制的', example: 'The organization has a hierarchical structure.' }
    ]},
    { id: 49, root: 'hum', meaning: '泥土', vocab: [
      { word: 'human', meaning: '人类的', example: 'Human nature is complex.' },
      { word: 'humane', meaning: '人道的，仁慈的', example: 'The society ensures humane treatment.' },
      { word: 'humble', meaning: '谦逊的，卑微的', example: 'He remained humble despite success.' }
    ]},
    { id: 50, root: 'hypo', meaning: '在…之下', vocab: [
      { word: 'hypocrisy', meaning: '虚伪，伪善', example: 'His hypocrisy was obvious.' },
      { word: 'hypothesis', meaning: '假设，假说', example: 'Scientists tested the hypothesis.' },
      { word: 'hypothetical', meaning: '假设的，假想的', example: 'A hypothetical situation.' }
    ]}
  ]},
  
  { letter: 'I', items: [
    { id: 51, root: 'insul', meaning: '单一的', vocab: [
      { word: 'insulate', meaning: '隔离，绝缘', example: 'Insulate the walls to save energy.' },
      { word: 'insulin', meaning: '胰岛素', example: 'Diabetics need insulin injections.' },
      { word: 'peninsula', meaning: '半岛', example: 'Florida is a peninsula.' }
    ]}
  ]},
  
  { letter: 'J', items: [
    { id: 52, root: 'jac ject', meaning: '扔', vocab: [
      { word: 'inject', meaning: '注射，注入', example: 'The doctor will inject the medicine.' },
      { word: 'reject', meaning: '拒绝，驳回', example: 'The proposal was rejected.' },
      { word: 'project', meaning: '项目，投射', example: 'This is a research project.' },
      { word: 'eject', meaning: '弹出，驱逐', example: 'The pilot ejected from the plane.' }
    ]},
    { id: 53, root: 'jur', meaning: '发誓，法律', vocab: [
      { word: 'jury', meaning: '陪审团', example: 'The jury delivered the verdict.' },
      { word: 'jurisdiction', meaning: '司法权，管辖权', example: 'This court has jurisdiction.' },
      { word: 'injure', meaning: '伤害，损害', example: 'He was injured in the accident.' },
      { word: 'perjury', meaning: '伪证，伪誓', example: 'Perjury is a serious crime.' }
    ]}
  ]},
  
  { letter: 'L', items: [
    { id: 54, root: 'laps', meaning: '掉落', vocab: [
      { word: 'collapse', meaning: '倒塌，崩溃', example: 'The building collapsed in the earthquake.' },
      { word: 'lapse', meaning: '失效， lapse', example: 'His driving license has lapsed.' }
    ]},
    { id: 55, root: 'later', meaning: '边', vocab: [
      { word: 'lateral', meaning: '侧面的，横向的', example: 'Make a lateral move in chess.' },
      { word: 'collateral', meaning: '并行的，附属的', example: 'The bank required collateral.' }
    ]},
    { id: 56, root: 'lav', meaning: '洗，冲', vocab: [
      { word: 'lavish', meaning: '奢侈的，浪费的', example: 'They had a lavish wedding.' },
      { word: 'lavatory', meaning: '洗手间', example: 'The lavatory needs cleaning.' }
    ]},
    { id: 57, root: 'lect', meaning: '读', vocab: [
      { word: 'collect', meaning: '收集', example: 'Collect stamps as a hobby.' },
      { word: 'select', meaning: '选择', example: 'Select the best option.' },
      { word: 'elect', meaning: '选举，选择', example: 'Citizens elect their representatives.' },
      { word: 'lecture', meaning: '讲座，讲课', example: 'The professor gave a lecture.' }
    ]},
    { id: 58, root: 'len', meaning: '软的', vocab: [
      { word: 'lenient', meaning: '宽容的，宽大的', example: 'The judge was lenient with the offender.' },
      { word: 'dilate', meaning: '扩大，膨胀', example: 'The doctor dilated his pupils.' }
    ]},
    { id: 59, root: 'lev', meaning: '提起，轻', vocab: [
      { word: 'levitate', meaning: '使漂浮', example: 'Magicians levitate objects.' },
      { word: 'elevate', meaning: '提升，举起', example: 'Elevate your feet when resting.' },
      { word: 'lever', meaning: '杠杆', example: 'Use a lever to move heavy objects.' },
      { word: 'levity', meaning: '轻浮，轻率', example: 'This matter requires seriousness, not levity.' }
    ]},
    { id: 60, root: 'lic', meaning: '允许', vocab: [
      { word: 'license', meaning: '许可证', example: 'You need a driver\'s license.' },
      { word: 'delicate', meaning: '精致的，脆弱的', example: 'Handle the vase delicately.' }
    ]},
    { id: 61, root: 'lu', meaning: '冲，洗', vocab: [
      { word: 'flush', meaning: '冲洗，脸红', example: 'Flush the toilet after use.' },
      { word: 'elude', meaning: '逃避，躲避', example: 'The criminal eluded capture.' }
    ]},
    { id: 62, root: 'lubr', meaning: '滑的', vocab: [
      { word: 'lubricate', meaning: '润滑', example: 'Lubricate the engine regularly.' },
      { word: 'lubricant', meaning: '润滑油', example: 'Use lubricant on the hinges.' }
    ]},
    { id: 63, root: 'lucr', meaning: '钱', vocab: [
      { word: 'lucrative', meaning: '有利可图的', example: 'Investment banking is lucrative.' }
    ]},
    { id: 64, root: 'lud', meaning: '玩，笑', vocab: [
      { word: 'allude', meaning: '暗指，提及', example: 'He alluded to his past experiences.' },
      { word: 'delude', meaning: '欺骗，蒙骗', example: 'Don\'t delude yourself with false hopes.' }
    ]},
    { id: 65, root: 'ly', meaning: '结合，捆绑', vocab: [
      { word: 'ally', meaning: '盟友，同盟', example: 'The country found a strong ally.' },
      { word: 'rally', meaning: '集会，恢复', example: 'Supporters held a political rally.' }
    ]}
  ]},
  
  { letter: 'M', items: [
    { id: 66, root: 'mal', meaning: '坏，不良', vocab: [
      { word: 'malfunction', meaning: '故障，失灵', example: 'The machine malfunctioned.' },
      { word: 'malice', meaning: '恶意，怨恨', example: 'His actions were motivated by malice.' },
      { word: 'malady', meaning: '疾病，弊病', example: 'Pollution is a social malady.' }
    ]},
    { id: 67, root: 'man', meaning: '手', vocab: [
      { word: 'manual', meaning: '手工的，手册', example: 'Read the manual before operating.' },
      { word: 'manufacture', meaning: '制造', example: 'Cars are manufactured in factories.' }
    ]},
    { id: 68, root: 'mand', meaning: '命令', vocab: [
      { word: 'demand', meaning: '要求，需求', example: 'The job demands patience.' },
      { word: 'command', meaning: '命令，指挥', example: 'The officer commanded the troops.' }
    ]},
    { id: 69, root: 'mar', meaning: '战争', vocab: [
      { word: 'mar', meaning: '破坏，毁坏', example: 'Don\'t mar the reputation of others.' },
      { word: 'marine', meaning: '海洋的', example: 'Marine life is diverse.' }
    ]},
    { id: 70, root: 'mea', meaning: '通过', vocab: [
      { word: 'means', meaning: '方法，手段', example: 'We need more means to solve this.' },
      { word: 'meaning', meaning: '意思，意义', example: 'What\'s the meaning of this word?' }
    ]},
    { id: 71, root: 'mel', meaning: '甜的', vocab: [
      { word: 'mellow', meaning: '柔和的，醇厚的', example: 'The mellow music relaxed him.' }
    ]},
    { id: 72, root: 'mend', meaning: '错误', vocab: [
      { word: 'amend', meaning: '修改，改善', example: 'Amend the document before submission.' },
      { word: 'mend', meaning: '修补，修理', example: 'Mend the torn clothes.' }
    ]},
    { id: 73, root: 'mens', meaning: '测量', vocab: [
      { word: 'measure', meaning: '测量，措施', example: 'Measure twice, cut once.' },
      { word: 'immense', meaning: '巨大的，广大的', example: 'The ocean is immense.' }
    ]},
    { id: 74, root: 'meta', meaning: '改变，超越', vocab: [
      { word: 'metaphor', meaning: '隐喻，比喻', example: 'Life is a journey - that\'s a metaphor.' },
      { word: 'metabolism', meaning: '新陈代谢', example: 'Exercise boosts metabolism.' }
    ]},
    { id: 75, root: 'migr', meaning: '移民', vocab: [
      { word: 'migrate', meaning: '迁移，移居', example: 'Birds migrate south in winter.' },
      { word: 'emigrate', meaning: '移居国外', example: 'They emigrated to Canada.' },
      { word: 'immigrant', meaning: '移民', example: 'Many immigrants seek better lives.' }
    ]},
    { id: 76, root: 'ming', meaning: '混合', vocab: [
      { word: 'mingled', meaning: '混合的', example: 'Their voices were mingled in discussion.' },
      { word: 'commingle', meaning: '混合，交融', example: 'Oil and water do not commingle.' }
    ]},
    { id: 77, root: 'mis', meaning: '发送', vocab: [
      { word: 'mission', meaning: '使命，任务', example: 'Their mission is to help others.' },
      { word: 'missile', meaning: '导弹', example: 'The missile was launched.' }
    ]},
    { id: 78, root: 'mod', meaning: '方式，尺度', vocab: [
      { word: 'modern', meaning: '现代的', example: 'Modern technology changes lives.' },
      { word: 'modest', meaning: '谦虚的，适度的', example: 'She is modest about her achievements.' },
      { word: 'modify', meaning: '修改，改变', example: 'Modify your approach if needed.' }
    ]},
    { id: 79, root: 'mono', meaning: '一个', vocab: [
      { word: 'monopoly', meaning: '垄断，专卖', example: 'The company has a monopoly.' },
      { word: 'monologue', meaning: '独白', example: 'His monologue lasted twenty minutes.' }
    ]},
    { id: 80, root: 'mpt', meaning: '拿取', vocab: [
      { word: 'prompt', meaning: '提示，迅速的', example: 'The computer shows a prompt.' },
      { word: 'attempt', meaning: '尝试，企图', example: 'He attempted to solve the puzzle.' }
    ]}
  ]},
  
  { letter: 'N', items: [
    { id: 81, root: 'nex', meaning: '捆绑', vocab: [
      { word: 'annex', meaning: '附加， annex', example: 'The country annexed the territory.' },
      { word: 'connect', meaning: '连接，联系', example: 'Connect the dots to form a picture.' }
    ]},
    { id: 82, root: 'nic', meaning: '伤害', vocab: [
      { word: 'noxious', meaning: '有害的，有毒的', example: 'Smoking is noxious to health.' },
      { word: 'nuisance', meaning: '讨厌的人或事', example: 'The noise is a nuisance.' }
    ]}
  ]},
  
  { letter: 'O', items: [
    { id: 83, root: 'off', meaning: '脱离', vocab: [
      { word: 'offer', meaning: '提供，提议', example: 'I offer my services to you.' },
      { word: 'sufficient', meaning: '足够的', example: 'We have sufficient food.' }
    ]},
    { id: 84, root: 'onym', meaning: '名字', vocab: [
      { word: 'anonymous', meaning: '匿名的', example: 'The donor wishes to remain anonymous.' },
      { word: 'synonym', meaning: '同义词', example: '"Big" is a synonym for "large".' }
    ]},
    { id: 85, root: 'orn', meaning: '装饰', vocab: [
      { word: 'adorn', meaning: '装饰， adorn', example: 'She adorned herself with jewelry.' },
      { word: 'ornament', meaning: '装饰品', example: 'The tree was decorated with ornaments.' }
    ]}
  ]},
  
  { letter: 'P', items: [
    { id: 86, root: 'pact', meaning: '紧的', vocab: [
      { word: 'impact', meaning: '影响，冲击', example: 'The speech had a great impact.' },
      { word: 'compact', meaning: '紧凑的，契约', example: 'The car is small but compact.' }
    ]},
    { id: 87, root: 'pall', meaning: '苍白的', vocab: [
      { word: 'pallid', meaning: '苍白的，无生气的', example: 'His pallid face showed his illness.' }
    ]},
    { id: 88, root: 'pan', meaning: '全部的', vocab: [
      { word: 'panorama', meaning: '全景，概论', example: 'The mountain offered a fine panorama.' },
      { word: 'panic', meaning: '恐慌', example: 'The fire caused panic among people.' }
    ]},
    { id: 89, root: 'par', meaning: '安排', vocab: [
      { word: 'parade', meaning: '游行，炫耀', example: 'The soldiers marched in parade.' },
      { word: 'compare', meaning: '比较', example: 'Compare the prices before buying.' }
    ]},
    { id: 90, root: 'para', meaning: '超越，靠近', vocab: [
      { word: 'parallel', meaning: '平行的，并列的', example: 'The roads run parallel.' },
      { word: 'paragraph', meaning: '段落', example: 'Read the third paragraph carefully.' }
    ]},
    { id: 91, root: 'parl', meaning: '谈话', vocab: [
      { word: 'parley', meaning: '会谈，谈判', example: 'The enemies agreed to parley.' },
      { word: 'parlor', meaning: '客厅， parlor', example: 'Welcome to our parlor.' }
    ]},
    { id: 92, root: 'part', meaning: '分开', vocab: [
      { word: 'part', meaning: '部分', example: 'This is just one part of the story.' },
      { word: 'partial', meaning: '部分的，偏袒的', example: 'I only have partial information.' },
      { word: 'depart', meaning: '离开， depart', example: 'The train will depart at noon.' }
    ]},
    { id: 93, root: 'pat', meaning: '感受，受折磨', vocab: [
      { word: 'compassion', meaning: '同情，怜悯', example: 'Show compassion to others.' },
      { word: 'passion', meaning: '激情，热情', example: 'He has a passion for music.' }
    ]},
    { id: 94, root: 'patr', meaning: '爸爸，祖国', vocab: [
      { word: 'patriot', meaning: '爱国者', example: 'He is a true patriot.' },
      { word: 'patron', meaning: '赞助人，顾客', example: 'The arts depend on patrons.' },
      { word: 'paternal', meaning: '父亲的，父系的', example: 'His paternal grandfather was a doctor.' }
    ]},
    { id: 95, root: 'pir', meaning: '尝试，冒险', vocab: [
      { word: 'aspirate', meaning: '渴望， aspirate', example: 'She aspires to become a doctor.' },
      { word: 'conspire', meaning: '密谋， conspirate', example: 'The group conspired against the king.' }
    ]},
    { id: 96, root: 'plex', meaning: '折叠', vocab: [
      { word: 'complex', meaning: '复杂的', example: 'This is a complex problem.' },
      { word: 'perplex', meaning: '使困惑，使复杂化', example: 'The riddle perplexed the students.' }
    ]},
    { id: 97, root: 'pli', meaning: '填满', vocab: [
      { word: 'comply', meaning: '遵从， comply', example: 'All citizens must comply with laws.' },
      { word: 'implex', meaning: '缠绕，使复杂', example: 'The wire became implex.' }
    ]},
    { id: 98, root: 'plo', meaning: '折叠', vocab: [
      { word: 'explore', meaning: '探索，勘探', example: 'Scientists explore outer space.' },
      { word: 'implodent', meaning: '内爆的', example: 'The building had an implodent collapse.' }
    ]},
    { id: 99, root: 'plor', meaning: '大声呼喊', vocab: [
      { word: 'deplorer', meaning: '强烈反对', example: 'Many deplorer the violence in media.' },
      { word: 'exclaim', meaning: '呼喊，惊叫', example: 'She exclaimed with joy.' }
    ]},
    { id: 100, root: 'plu', meaning: '更多的', vocab: [
      { word: 'plumber', meaning: '水管工', example: 'Call a plumber to fix the leak.' },
      { word: 'plentiful', meaning: '丰富的，大量的', example: 'The region has plentiful rainfall.' }
    ]},
    { id: 101, root: 'pos, pon', meaning: '放置', vocab: [
      { word: 'position', meaning: '位置，职位', example: 'What\'s your position on this issue?' },
      { word: 'compose', meaning: '组成，作曲', example: 'Water is composed of hydrogen and oxygen.' },
      { word: 'opponent', meaning: '对手，反对者', example: 'The teams are opponents in the finals.' }
    ]},
    { id: 102, root: 'pot', meaning: '权利，力量', vocab: [
      { word: 'potential', meaning: '潜在的，潜力', example: 'She has potential as a leader.' },
      { word: 'potent', meaning: '强有力的， potent', example: 'The medicine is very potent.' }
    ]},
    { id: 103, root: 'pris', meaning: '抓取', vocab: [
      { word: 'prison', meaning: '监狱', example: 'The criminal was sent to prison.' },
      { word: 'enterprise', meaning: '企业，事业心', example: 'He started his own enterprise.' }
    ]},
    { id: 104, root: 'proof', meaning: '防…的', vocab: [
      { word: 'waterproof', meaning: '防水的', example: 'This jacket is waterproof.' },
      { word: 'fireproof', meaning: '防火的', example: 'The safe is fireproof.' }
    ]},
    { id: 105, root: 'proto', meaning: '原始的', vocab: [
      { word: 'prototype', meaning: '原型，雏形', example: 'This is the prototype of our new product.' },
      { word: 'protocol', meaning: '协议，礼仪', example: 'Follow diplomatic protocol.' }
    ]}
  ]},
  
  { letter: 'R', items: [
    { id: 106, root: 'rama', meaning: '视野', vocab: [
      { word: 'diorama', meaning: '透视画，模型', example: 'The museum has a dinosaur diorama.' },
      { word: 'panorama', meaning: '全景', example: 'The city looks beautiful from this panorama point.' }
    ]},
    { id: 107, root: 'ras', meaning: '摩擦', vocab: [
      { word: 'erase', meaning: '擦掉，抹去', example: 'Erase your mistakes with a rubber.' },
      { word: 'abrasive', meaning: '研磨的，刺激性的', example: 'Use an abrasive cleaner for tough stains.' }
    ]},
    { id: 108, root: 'rat', meaning: '估计，估算', vocab: [
      { word: 'rate', meaning: '比率，速度', example: 'The interest rate is rising.' },
      { word: 'ratio', meaning: '比例，比率', example: 'The ratio of boys to girls is 2:1.' }
    ]},
    { id: 109, root: 'reck', meaning: '注意 留心', vocab: [
      { word: 'reckon', meaning: '认为，估计', example: 'I reckon it will rain today.' },
      { word: 'wreck', meaning: '残骸，破坏', example: 'The shipwreck was found off the coast.' }
    ]},
    { id: 110, root: 'reg', meaning: '统治，控制', vocab: [
      { word: 'regulate', meaning: '调节，管理', example: 'The government regulates businesses.' },
      { word: 'regular', meaning: '规律的，定期的', example: 'Take regular exercise for good health.' }
    ]},
    { id: 111, root: 'rid', meaning: '笑', vocab: [
      { word: 'deride', meaning: '嘲笑，讥讽', example: 'Don\'t deride others\' efforts.' },
      { word: 'ridiculous', meaning: '荒谬的，可笑的', example: 'His excuse was ridiculous.' }
    ]},
    { id: 112, root: 'robe', meaning: '衣服', vocab: [
      { word: 'robust', meaning: '强健的， robust', example: 'He has a robust constitution.' },
      { word: 'arrogate', meaning: '冒称，霸占', example: 'He arrogated all the credit to himself.' }
    ]},
    { id: 113, root: 'rod', meaning: '咬', vocab: [
      { word: 'corrode', meaning: '腐蚀，侵蚀', example: 'Acid corrodes metal.' },
      { word: 'erosion', meaning: '侵蚀，磨损', example: 'Water causes erosion of soil.' }
    ]},
    { id: 114, root: 'rog', meaning: '问，要', vocab: [
      { word: 'arrogate', meaning: '冒称，霸占', example: 'He arrogated all the credit to himself.' },
      { word: 'interrogate', meaning: '审问，询问', example: 'The detective interrogated the suspect.' }
    ]}
  ]},
  
  { letter: 'S', items: [
    { id: 115, root: 'salv', meaning: '安全', vocab: [
      { word: 'salvation', meaning: '拯救，救助', example: 'The lifeguard provided salvation.' },
      { word: 'salvage', meaning: '抢救， salvaged', example: 'They salvaged what they could from the wreck.' }
    ]},
    { id: 116, root: 'san', meaning: '健康', vocab: [
      { word: 'sanitary', meaning: '卫生的，清洁的', example: 'The restaurant maintains sanitary conditions.' },
      { word: 'sanitize', meaning: '消毒，使卫生', example: 'Sanitize your hands before eating.' }
    ]},
    { id: 117, root: 'scal', meaning: '梯子', vocab: [
      { word: 'escalate', meaning: '升级， escalator', example: 'The argument escalated into a fight.' },
      { word: 'scalar', meaning: '标量的', example: 'Speed is a scalar quantity.' }
    ]},
    { id: 118, root: 'scen', meaning: '地点，场面', vocab: [
      { word: 'scene', meaning: '场景，景象', example: 'The crime scene was investigated.' },
      { word: 'scenery', meaning: '风景，景色', example: 'The mountain scenery is breathtaking.' }
    ]},
    { id: 119, root: 'script', meaning: '写', vocab: [
      { word: 'script', meaning: '脚本，剧本', example: 'He wrote the script for the play.' },
      { word: 'manuscript', meaning: '手稿，原稿', example: 'The author submitted his manuscript.' }
    ]},
    { id: 120, root: 'se', meaning: '分开', vocab: [
      { word: 'separate', meaning: '分离，分开', example: 'Separate the eggs carefully.' },
      { word: 'section', meaning: '部分，节', example: 'Read section three of the manual.' }
    ]},
    { id: 121, root: 'sen', meaning: '老的', vocab: [
      { word: 'senior', meaning: '年长的，高级的', example: 'She is the senior manager.' },
      { word: 'senate', meaning: '参议院', example: 'The bill passed the senate.' }
    ]},
    { id: 122, root: 'sever', meaning: '严肃的 严格的', vocab: [
      { word: 'severe', meaning: '严重的，严厉的', example: 'There was severe weather damage.' },
      { word: 'sever', meaning: '切断，断绝', example: 'The accident severed his leg.' }
    ]},
    { id: 123, root: 'sol', meaning: '舒适', vocab: [
      { word: 'sole', meaning: '唯一的', example: 'He was the sole survivor.' },
      { word: 'console', meaning: '安慰，控制台', example: 'She tried to console the crying child.' }
    ]},
    { id: 124, root: 'sort', meaning: '种类', vocab: [
      { word: 'sort', meaning: '种类，分类', example: 'What sort of music do you like?' },
      { word: 'resort', meaning: ' resort，求助', example: 'Violence should be the last resort.' }
    ]},
    { id: 125, root: 'sper', meaning: '希望', vocab: [
      { word: 'desperate', meaning: '绝望的，不顾一切的', example: 'He made a desperate attempt to escape.' },
      { word: 'prosper', meaning: '繁荣， prosper', example: 'Business began to prosper again.' }
    ]},
    { id: 126, root: 'spic', meaning: '看', vocab: [
      { word: 'suspect', meaning: '怀疑，嫌疑人', example: 'Police suspect foul play.' },
      { word: 'aspect', meaning: '方面，外观', example: 'Consider all aspects of the problem.' }
    ]},
    { id: 127, root: 'spir', meaning: '呼吸', vocab: [
      { word: 'spirit', meaning: '精神，灵魂', example: 'Team spirit is important for success.' },
      { word: 'aspire', meaning: '渴望，追求', example: 'She aspires to be a doctor.' },
      { word: 'conspire', meaning: '密谋， conspirate', example: 'They conspire against the government.' }
    ]},
    { id: 128, root: 'spit', meaning: '恶意', vocab: [
      { word: 'spite', meaning: '恶意，怨恨', example: 'He did it out of spite.' },
      { word: 'despite', meaning: '尽管', example: 'Despite the rain, we went out.' }
    ]},
    { id: 129, root: 'stig', meaning: '刺', vocab: [
      { word: 'stigma', meaning: '耻辱，污名', example: 'There is a stigma attached to mental illness.' },
      { word: 'instigate', meaning: '煽动， instigate', example: 'He instigated the rebellion.' }
    ]},
    { id: 130, root: 'su', meaning: '跟随', vocab: [
      { word: 'subsequent', meaning: '随后的，后来的', example: 'Subsequent events proved him right.' },
      { word: 'sue', meaning: '起诉', example: 'He decided to sue for damages.' }
    ]}
  ]},
  
  { letter: 'T', items: [
    { id: 131, root: 'tail', meaning: '切，剪', vocab: [
      { word: 'detail', meaning: '细节，详述', example: 'Pay attention to detail.' },
      { word: 'retail', meaning: '零售', example: 'This store sells goods retail.' }
    ]},
    { id: 132, root: 'tang', meaning: '触摸', vocab: [
      { word: 'tangible', meaning: '有形的，切实的', example: 'We need tangible results.' },
      { word: 'intangible', meaning: '无形的', example: 'Love is intangible.' }
    ]},
    { id: 133, root: 'tard', meaning: '慢', vocab: [
      { word: 'tardy', meaning: '迟的， tardy', example: 'He was tardy for the meeting.' },
      { word: 'retard', meaning: '延迟，阻碍', example: 'Don\'t retard the progress.' }
    ]},
    { id: 134, root: 'tend', meaning: '伸展', vocab: [
      { word: 'tend', meaning: '趋向，照料', example: 'Plants tend to grow toward light.' },
      { word: 'attend', meaning: '出席，照顾', example: 'Please attend the meeting.' },
      { word: 'extend', meaning: '延伸，扩展', example: 'Extend the deadline if needed.' }
    ]},
    { id: 135, root: 'test', meaning: '目击', vocab: [
      { word: 'testimony', meaning: '证词， testimony', example: 'His testimony was crucial to the case.' },
      { word: 'contest', meaning: '竞赛， contest', example: 'She won the beauty contest.' }
    ]},
    { id: 136, root: 'ter', meaning: '三', vocab: [
      { word: 'terminate', meaning: '终止，结束', example: 'The contract will terminate next month.' },
      { word: 'terrain', meaning: '地形，地带', example: 'The terrain is difficult to navigate.' }
    ]},
    { id: 137, root: 'tric', meaning: '花招，小障碍', vocab: [
      { word: 'trick', meaning: '诡计，戏法', example: 'Don\'t fall for his tricks.' },
      { word: 'intricate', meaning: '复杂的，错综的', example: 'The plot is intricate and fascinating.' }
    ]},
    { id: 138, root: 'trud', meaning: '刺，推', vocab: [
      { word: 'intrude', meaning: '闯入，打扰', example: 'Don\'t intrude on their privacy.' },
      { word: 'extrude', meaning: '挤出， extrude', example: 'The machine extrudes plastic shapes.' }
    ]},
    { id: 139, root: 'turb', meaning: '混乱', vocab: [
      { word: 'disturb', meaning: '打扰，扰乱', example: 'Please don\'t disturb me while I\'m working.' },
      { word: 'turbulent', meaning: '动荡的， turbulent', example: 'The plane encountered turbulent air.' }
    ]}
  ]},
  
  { letter: 'V', items: [
    { id: 140, root: 'vac', meaning: '空', vocab: [
      { word: 'vacant', meaning: '空的，空缺的', example: 'The apartment has been vacant for months.' },
      { word: 'evacuate', meaning: '疏散，撤离', example: 'Residents were evacuated from the building.' }
    ]},
    { id: 141, root: 'vag', meaning: '漫步', vocab: [
      { word: 'vagrant', meaning: '流浪汉', example: 'The vagrant asked for spare change.' },
      { word: 'deviate', meaning: '偏离， deviate', example: 'Don\'t deviate from the plan.' }
    ]},
    { id: 142, root: 'val', meaning: '价值；力量，力气', vocab: [
      { word: 'value', meaning: '价值，重视', example: 'Honesty is a core value.' },
      { word: 'valid', meaning: '有效的，合理的', example: 'Your ticket is valid for one year.' }
    ]},
    { id: 143, root: 'van', meaning: '空', vocab: [
      { word: 'vanish', meaning: '消失， vanishing', example: 'The magician made the rabbit vanish.' },
      { word: 'evanescent', meaning: '逐渐消失的', example: 'Youth is evanescent.' }
    ]},
    { id: 144, root: 'veng', meaning: '惩罚', vocab: [
      { word: 'avenge', meaning: '报仇， avenged', example: 'He vowed to avenge his brother\'s death.' },
      { word: 'vengeance', meaning: '复仇，报复', example: 'He sought vengeance for the wrong.' }
    ]},
    { id: 145, root: 'vent', meaning: '来', vocab: [
      { word: 'ventilate', meaning: '通风， ventilated', example: 'Open the windows to ventilate the room.' },
      { word: 'adventure', meaning: '冒险，奇遇', example: 'They went on an adventure in the mountains.' }
    ]},
    { id: 146, root: 'ver', meaning: '真的', vocab: [
      { word: 'verify', meaning: '核实，证实', example: 'Please verify your email address.' },
      { word: 'verdict', meaning: '裁决，判决', example: 'The jury reached a unanimous verdict.' }
    ]},
    { id: 147, root: 'vict', meaning: '征服', vocab: [
      { word: 'victory', meaning: '胜利', example: 'The team celebrated their victory.' },
      { word: 'convict', meaning: '定罪，罪犯', example: 'The court will convict the defendant.' }
    ]},
    { id: 148, root: 'vol', meaning: '意志', vocab: [
      { word: 'voluntary', meaning: '自愿的', example: 'This is a voluntary contribution.' },
      { word: 'volunteer', meaning: '志愿者', example: 'She volunteers at the animal shelter.' }
    ]},
    { id: 149, root: 'vor', meaning: '吃', vocab: [
      { word: 'voracious', meaning: '贪婪的， voracious', example: 'He is a voracious reader.' },
      { word: 'devour', meaning: '吞食， devour', example: 'The fire devoured the building.' }
    ]},
    { id: 150, root: 'voy', meaning: '路', vocab: [
      { word: 'voyage', meaning: '航行， voyage', example: 'The voyage across the Atlantic took a week.' },
      { word: 'envoy', meaning: '使者，外交官', example: 'The envoy delivered the message.' }
    ]}
  ]},
  
  { letter: 'W', items: [
    { id: 151, root: 'ward', meaning: '看管，看护', vocab: [
      { word: 'ward', meaning: '病房，监护', example: 'He stayed in the psychiatric ward.' },
      { word: 'reward', meaning: '奖励，报答', example: 'Hard work leads to reward.' }
    ]},
    { id: 152, root: 'wr', meaning: '扭，转', vocab: [
      { word: 'wrestle', meaning: '摔跤， wrestling', example: 'He wrestles professionally.' },
      { word: 'wring', meaning: '拧， wring', example: 'Wring out the wet cloth.' }
    ]}
  ]}
]

// 过滤后的词根
const filteredRoots = computed(() => {
  let result = rootsData
  
  // 按字母过滤
  if (currentLetter.value !== 'ALL') {
    result = result.filter(group => group.letter === currentLetter.value)
  }
  
  // 按搜索词过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.map(group => ({
      ...group,
      items: group.items.filter((item: any) => 
        item.root.toLowerCase().includes(query) || 
        item.meaning.includes(query)
      )
    })).filter((group: any) => group.items.length > 0)
  }
  
  return result
})

// 显示词根详情
function showRootDetail(root: any) {
  selectedRoot.value = root
  detailDialogVisible.value = true
}

// 过滤词根
function filterRoots() {
  // computed会自动更新
}

// 形近词对比相关
const wordDetailVisible = ref(false)
const selectedWord = ref<any>(null)
const selectedGroup = ref<any>(null)

// 形近词组数据（从六级网站提取）
const confusableGroups = [
  {
    id: 1,
    title: 'private vs pirate',
    words: [
      { content: 'private', translation: '私人的' },
      { content: 'pirate', translation: '海盗，盗版的' }
    ]
  },
  {
    id: 2,
    title: 'crow vs crown vs clown',
    words: [
      { content: 'crow', translation: '乌鸦' },
      { content: 'crown', translation: '王冠' },
      { content: 'clown', translation: '小丑' }
    ]
  },
  {
    id: 3,
    title: 'doze vs dozen',
    words: [
      { content: 'doze', translation: '打瞌睡' },
      { content: 'dozen', translation: '一打，十几个' }
    ]
  },
  {
    id: 4,
    title: 'gloom vs groom',
    words: [
      { content: 'gloom', translation: '忧郁' },
      { content: 'groom', translation: '打扮，梳毛' }
    ]
  },
  {
    id: 5,
    title: 'rush vs lush',
    words: [
      { content: 'rush', translation: '冲' },
      { content: 'lush', translation: '茂盛的，酒鬼' }
    ]
  },
  {
    id: 6,
    title: 'vow vs mow',
    words: [
      { content: 'vow', translation: '誓言，发誓' },
      { content: 'mow', translation: '割草' }
    ]
  },
  {
    id: 7,
    title: 'lump vs lamp vs lame vs lamb',
    words: [
      { content: 'lump', translation: '把…归并在一起' },
      { content: 'lamp', translation: '灯' },
      { content: 'lame', translation: '瘸的' },
      { content: 'lamb', translation: '羊羔' }
    ]
  },
  {
    id: 8,
    title: 'stalk vs stall vs stale',
    words: [
      { content: 'stalk', translation: '茎' },
      { content: 'stall', translation: '货摊' },
      { content: 'stale', translation: '不新鲜的' }
    ]
  },
  {
    id: 9,
    title: 'strike vs stride',
    words: [
      { content: 'strike', translation: '打' },
      { content: 'stride', translation: '大步走' }
    ]
  },
  {
    id: 10,
    title: 'lodge vs dodge',
    words: [
      { content: 'lodge', translation: '乡间小屋' },
      { content: 'dodge', translation: '躲避，花招' }
    ]
  },
  {
    id: 11,
    title: 'commence vs commerce',
    words: [
      { content: 'commence', translation: '开始，着手' },
      { content: 'commerce', translation: '商业' }
    ]
  },
  {
    id: 12,
    title: 'cradle vs scandal',
    words: [
      { content: 'cradle', translation: '摇篮' },
      { content: 'scandal', translation: '丑闻' }
    ]
  },
  {
    id: 13,
    title: 'vote vs veto',
    words: [
      { content: 'vote', translation: '投票' },
      { content: 'veto', translation: '否决' }
    ]
  },
  {
    id: 14,
    title: 'slim vs slum',
    words: [
      { content: 'slim', translation: '苗条' },
      { content: 'slum', translation: '贫民窟' }
    ]
  },
  {
    id: 15,
    title: 'petrol vs patron',
    words: [
      { content: 'petrol', translation: '汽油' },
      { content: 'patron', translation: '赞助人' }
    ]
  },
  {
    id: 16,
    title: 'ballot vs ballet',
    words: [
      { content: 'ballot', translation: '无记名投票' },
      { content: 'ballet', translation: '芭蕾舞' }
    ]
  },
  {
    id: 17,
    title: 'moral vs morale vs mortal',
    words: [
      { content: 'moral', translation: '道德' },
      { content: 'morale', translation: '士气，精神面貌' },
      { content: 'mortal', translation: '凡人' }
    ]
  },
  {
    id: 18,
    title: 'bail vs bait',
    words: [
      { content: 'bail', translation: '保释金' },
      { content: 'bait', translation: '给…上诱饵' }
    ]
  },
  {
    id: 19,
    title: 'tact vs pact',
    words: [
      { content: 'tact', translation: '得体' },
      { content: 'pact', translation: '协议' }
    ]
  },
  {
    id: 20,
    title: 'terrible vs terrific',
    words: [
      { content: 'terrible', translation: '糟糕的' },
      { content: 'terrific', translation: '极好的' }
    ]
  },
  {
    id: 21,
    title: 'canoe vs cane vs crane',
    words: [
      { content: 'canoe', translation: '独木舟' },
      { content: 'cane', translation: '茎，拐杖' },
      { content: 'crane', translation: '起重机，吊车' }
    ]
  },
  {
    id: 22,
    title: 'pedal vs peddle',
    words: [
      { content: 'pedal', translation: '踏板' },
      { content: 'peddle', translation: '叫卖' }
    ]
  },
  {
    id: 23,
    title: 'Anthony vs attorney',
    words: [
      { content: 'Anthony', translation: '安东尼' },
      { content: 'attorney', translation: '律师' }
    ]
  },
  {
    id: 24,
    title: 'poker vs poke',
    words: [
      { content: 'poker', translation: '扑克牌' },
      { content: 'poke', translation: '捅' }
    ]
  },
  {
    id: 25,
    title: 'scent vs recent',
    words: [
      { content: 'scent', translation: '香味' },
      { content: 'recent', translation: '最近的' }
    ]
  },
  {
    id: 26,
    title: 'expense vs dispense',
    words: [
      { content: 'expense', translation: '花费' },
      { content: 'dispense', translation: '分配' }
    ]
  },
  {
    id: 27,
    title: 'segregate vs propagate',
    words: [
      { content: 'segregate', translation: '隔离' },
      { content: 'propagate', translation: '宣传' }
    ]
  },
  {
    id: 28,
    title: 'beverage vs benevolent',
    words: [
      { content: 'beverage', translation: '饮料' },
      { content: 'benevolent', translation: '仁慈的' }
    ]
  },
  {
    id: 29,
    title: 'born vs barn',
    words: [
      { content: 'born', translation: '出生' },
      { content: 'barn', translation: '谷仓' }
    ]
  },
  {
    id: 30,
    title: 'achieve vs archive',
    words: [
      { content: 'achieve', translation: '实现' },
      { content: 'archive', translation: '档案' }
    ]
  },
  {
    id: 31,
    title: 'overhaul vs havoc',
    words: [
      { content: 'overhaul', translation: '大修' },
      { content: 'havoc', translation: '大破坏' }
    ]
  },
  {
    id: 32,
    title: 'loop vs loot',
    words: [
      { content: 'loop', translation: '圈，环' },
      { content: 'loot', translation: '战利品' }
    ]
  },
  {
    id: 33,
    title: 'synthetic vs synthesis',
    words: [
      { content: 'synthetic', translation: '合成的' },
      { content: 'synthesis', translation: '综合' }
    ]
  },
  {
    id: 34,
    title: 'tremble vs tumble',
    words: [
      { content: 'tremble', translation: '颤抖' },
      { content: 'tumble', translation: '跌倒' }
    ]
  },
  {
    id: 35,
    title: 'sake vs soak',
    words: [
      { content: 'sake', translation: '缘故' },
      { content: 'soak', translation: '浸泡' }
    ]
  },
  {
    id: 36,
    title: 'success vs successive',
    words: [
      { content: 'success', translation: '成功' },
      { content: 'successive', translation: '连续的' }
    ]
  },
  {
    id: 37,
    title: 'instance vs stance',
    words: [
      { content: 'instance', translation: '例子' },
      { content: 'stance', translation: '立场' }
    ]
  },
  {
    id: 38,
    title: 'haunt vs hunt',
    words: [
      { content: 'haunt', translation: '萦绕' },
      { content: 'hunt', translation: '打猎' }
    ]
  },
  {
    id: 39,
    title: 'coincide vs concise',
    words: [
      { content: 'coincide', translation: '巧合' },
      { content: 'concise', translation: '简洁的' }
    ]
  },
  {
    id: 40,
    title: 'deduce vs seduce',
    words: [
      { content: 'deduce', translation: '推断' },
      { content: 'seduce', translation: '引诱' }
    ]
  },
  {
    id: 41,
    title: 'patrol vs patriot',
    words: [
      { content: 'patrol', translation: '巡逻' },
      { content: 'patriot', translation: '爱国者' }
    ]
  },
  {
    id: 42,
    title: 'industrious vs indigenous',
    words: [
      { content: 'industrious', translation: '勤奋的' },
      { content: 'indigenous', translation: '本土的' }
    ]
  },
  {
    id: 43,
    title: 'delete vs deplete',
    words: [
      { content: 'delete', translation: '删除' },
      { content: 'deplete', translation: '耗尽' }
    ]
  },
  {
    id: 44,
    title: 'sob vs sober',
    words: [
      { content: 'sob', translation: '啜泣' },
      { content: 'sober', translation: '清醒的' }
    ]
  },
  {
    id: 45,
    title: 'consult vs assault',
    words: [
      { content: 'consult', translation: '咨询' },
      { content: 'assault', translation: '攻击' }
    ]
  },
  {
    id: 46,
    title: 'encode vs concede',
    words: [
      { content: 'encode', translation: '编码' },
      { content: 'concede', translation: '承认' }
    ]
  },
  {
    id: 47,
    title: 'blaze vs bizarre',
    words: [
      { content: 'blaze', translation: '火焰' },
      { content: 'bizarre', translation: '奇异的' }
    ]
  },
  {
    id: 48,
    title: 'immediate vs mediate',
    words: [
      { content: 'immediate', translation: '立即的' },
      { content: 'mediate', translation: '调解' }
    ]
  },
  {
    id: 49,
    title: 'promise vs premise',
    words: [
      { content: 'promise', translation: '承诺' },
      { content: 'premise', translation: '前提' }
    ]
  },
  {
    id: 50,
    title: 'grid vs grim vs grin',
    words: [
      { content: 'grid', translation: '网格' },
      { content: 'grim', translation: '严酷的' },
      { content: 'grin', translation: '露齿笑' }
    ]
  },
  {
    id: 51,
    title: 'elite vs elicit',
    words: [
      { content: 'elite', translation: '精英' },
      { content: 'elicit', translation: '引出' }
    ]
  },
  {
    id: 52,
    title: 'iron vs irony',
    words: [
      { content: 'iron', translation: '铁' },
      { content: 'irony', translation: '讽刺' }
    ]
  },
  {
    id: 53,
    title: 'reproach vs approach',
    words: [
      { content: 'reproach', translation: '责备' },
      { content: 'approach', translation: '接近' }
    ]
  },
  {
    id: 54,
    title: 'hinge vs mingle',
    words: [
      { content: 'hinge', translation: '铰链' },
      { content: 'mingle', translation: '混合' }
    ]
  },
  {
    id: 55,
    title: 'erect vs eject',
    words: [
      { content: 'erect', translation: '建立' },
      { content: 'eject', translation: '弹出' }
    ]
  },
  {
    id: 56,
    title: 'tranquil vs transient',
    words: [
      { content: 'tranquil', translation: '宁静的' },
      { content: 'transient', translation: '短暂的' }
    ]
  },
  {
    id: 57,
    title: 'shuttle vs shatter',
    words: [
      { content: 'shuttle', translation: '航天飞机' },
      { content: 'shatter', translation: '粉碎' }
    ]
  },
  {
    id: 58,
    title: 'preface vs pretext',
    words: [
      { content: 'preface', translation: '前言' },
      { content: 'pretext', translation: '借口' }
    ]
  },
  {
    id: 59,
    title: 'endure vs endorse',
    words: [
      { content: 'endure', translation: '忍受' },
      { content: 'endorse', translation: '支持' }
    ]
  },
  {
    id: 60,
    title: 'tempt vs attempt vs contempt',
    words: [
      { content: 'tempt', translation: '诱惑' },
      { content: 'attempt', translation: '尝试' },
      { content: 'contempt', translation: '轻视' }
    ]
  },
  {
    id: 61,
    title: 'recruit vs refute',
    words: [
      { content: 'recruit', translation: '招募' },
      { content: 'refute', translation: '反驳' }
    ]
  },
  {
    id: 62,
    title: 'summon vs summit',
    words: [
      { content: 'summon', translation: '召唤' },
      { content: 'summit', translation: '顶峰' }
    ]
  },
  {
    id: 63,
    title: 'whip vs worship',
    words: [
      { content: 'whip', translation: '鞭打' },
      { content: 'worship', translation: '崇拜' }
    ]
  },
  {
    id: 64,
    title: 'hostage vs hostile',
    words: [
      { content: 'hostage', translation: '人质' },
      { content: 'hostile', translation: '敌对的' }
    ]
  },
  {
    id: 65,
    title: 'inhabit vs inhibit',
    words: [
      { content: 'inhabit', translation: '居住' },
      { content: 'inhibit', translation: '抑制' }
    ]
  },
  {
    id: 66,
    title: 'texture vs pasture',
    words: [
      { content: 'texture', translation: '质地' },
      { content: 'pasture', translation: '牧场' }
    ]
  },
  {
    id: 67,
    title: 'imitate vs intimidate vs intimate',
    words: [
      { content: 'imitate', translation: '模仿' },
      { content: 'intimidate', translation: '恐吓' },
      { content: 'intimate', translation: '亲密的' }
    ]
  },
  {
    id: 68,
    title: 'insult vs insulate',
    words: [
      { content: 'insult', translation: '侮辱' },
      { content: 'insulate', translation: '隔离' }
    ]
  },
  {
    id: 69,
    title: 'context vs contend',
    words: [
      { content: 'context', translation: '上下文' },
      { content: 'contend', translation: '竞争' }
    ]
  },
  {
    id: 70,
    title: 'tame vs tamp',
    words: [
      { content: 'tame', translation: '驯服的' },
      { content: 'tamp', translation: '夯实' }
    ]
  },
  {
    id: 71,
    title: 'pray vs prey',
    words: [
      { content: 'pray', translation: '祈祷' },
      { content: 'prey', translation: '猎物' }
    ]
  },
  {
    id: 72,
    title: 'paradise vs jeopardize',
    words: [
      { content: 'paradise', translation: '天堂' },
      { content: 'jeopardize', translation: '危及' }
    ]
  },
  {
    id: 73,
    title: 'inherit vs herd',
    words: [
      { content: 'inherit', translation: '继承' },
      { content: 'herd', translation: '兽群' }
    ]
  },
  {
    id: 74,
    title: 'prevent vs prevalent',
    words: [
      { content: 'prevent', translation: '预防' },
      { content: 'prevalent', translation: '流行的' }
    ]
  },
  {
    id: 75,
    title: 'emit vs omit',
    words: [
      { content: 'emit', translation: '发射' },
      { content: 'omit', translation: '省略' }
    ]
  },
  {
    id: 76,
    title: 'deduct vs deduce',
    words: [
      { content: 'deduct', translation: '扣除，减去' },
      { content: 'deduce', translation: '推理' }
    ]
  },
  {
    id: 77,
    title: 'rare vs bare',
    words: [
      { content: 'rare', translation: '稀有的' },
      { content: 'bare', translation: '赤裸的' }
    ]
  },
  {
    id: 78,
    title: 'illusion vs illustration',
    words: [
      { content: 'illusion', translation: '错觉，幻觉' },
      { content: 'illustration', translation: '插图，说明' }
    ]
  },
  // 新增形近词组
  {
    id: 79,
    title: 'contract vs contradict vs extractive vs contrary vs contempt',
    words: [
      { content: 'contract', translation: '合同' },
      { content: 'contradict', translation: '反驳，否认' },
      { content: 'extractive', translation: '提取物' },
      { content: 'contrary', translation: '相反的' },
      { content: 'contempt', translation: '鄙视' }
    ]
  },
  {
    id: 80,
    title: 'stupid vs stipulate',
    words: [
      { content: 'stupid', translation: '愚蠢的' },
      { content: 'stipulate', translation: '规定' }
    ]
  },
  {
    id: 81,
    title: 'promise vs premise vs compromise',
    words: [
      { content: 'promise', translation: '承诺' },
      { content: 'premise', translation: '前提' },
      { content: 'compromise', translation: '妥协' }
    ]
  },
  {
    id: 82,
    title: 'simulate vs stipulate',
    words: [
      { content: 'simulate', translation: '模拟，模仿' },
      { content: 'stipulate', translation: '规定' }
    ]
  },
  {
    id: 83,
    title: 'narrative vs native',
    words: [
      { content: 'narrative', translation: '叙事的' },
      { content: 'native', translation: '本地的' }
    ]
  },
  {
    id: 84,
    title: 'stem vs stew',
    words: [
      { content: 'stem', translation: '秆，茎，阻止，源于' },
      { content: 'stew', translation: '炖菜' }
    ]
  },
  {
    id: 85,
    title: 'enterprise vs entertain',
    words: [
      { content: 'enterprise', translation: '企业' },
      { content: 'entertain', translation: '使快乐' }
    ]
  },
  {
    id: 86,
    title: 'monotonous vs monopoly',
    words: [
      { content: 'monotonous', translation: '单调的' },
      { content: 'monopoly', translation: '垄断' }
    ]
  },
  {
    id: 87,
    title: 'badge vs budget',
    words: [
      { content: 'badge', translation: '徽章' },
      { content: 'budget', translation: '预算' }
    ]
  },
  {
    id: 88,
    title: 'beacon vs beckon vs bacon',
    words: [
      { content: 'beacon', translation: '灯塔' },
      { content: 'beckon', translation: '示意，引诱' },
      { content: 'bacon', translation: '培根' }
    ]
  },
  {
    id: 89,
    title: 'boil vs spoil',
    words: [
      { content: 'boil', translation: '沸腾，煮熟' },
      { content: 'spoil', translation: '破坏，溺爱，变质' }
    ]
  },
  {
    id: 90,
    title: 'indignant vs diligent',
    words: [
      { content: 'indignant', translation: '愤怒的' },
      { content: 'diligent', translation: '勤奋的' }
    ]
  },
  {
    id: 91,
    title: 'epoch vs episode',
    words: [
      { content: 'epoch', translation: '时代，纪元' },
      { content: 'episode', translation: '一段经历，小插曲' }
    ]
  },
  {
    id: 92,
    title: 'extinguish vs distinguished',
    words: [
      { content: 'extinguish', translation: '熄灭，毁灭' },
      { content: 'distinguished', translation: '杰出的' }
    ]
  },
  {
    id: 93,
    title: 'support vs suppose',
    words: [
      { content: 'support', translation: '支持' },
      { content: 'suppose', translation: '推断' }
    ]
  },
  {
    id: 94,
    title: 'nation vs notion',
    words: [
      { content: 'nation', translation: '国家' },
      { content: 'notion', translation: '观念' }
    ]
  },
  {
    id: 95,
    title: 'travel vs travail vs trivial',
    words: [
      { content: 'travel', translation: '旅游' },
      { content: 'travail', translation: '艰苦劳动' },
      { content: 'trivial', translation: '琐碎的，微不足道的' }
    ]
  },
  {
    id: 96,
    title: 'regular vs regulate',
    words: [
      { content: 'regular', translation: '有规律的' },
      { content: 'regulate', translation: '管理，约束' }
    ]
  },
  {
    id: 97,
    title: 'instinct vs distinct',
    words: [
      { content: 'instinct', translation: '本能，天性' },
      { content: 'distinct', translation: '截然不同的' }
    ]
  },
  {
    id: 98,
    title: 'assumption vs consumption',
    words: [
      { content: 'assumption', translation: '假设' },
      { content: 'consumption', translation: '消耗 (量)，消费' }
    ]
  },
  {
    id: 99,
    title: 'swing vs wing',
    words: [
      { content: 'swing', translation: '(使) 摆动；(使) 转弯' },
      { content: 'wing', translation: '翅膀；机翼' }
    ]
  },
  {
    id: 100,
    title: 'involve vs revolve',
    words: [
      { content: 'involve', translation: '需要，包含' },
      { content: 'revolve', translation: '旋转' }
    ]
  },
  {
    id: 101,
    title: 'successive vs success',
    words: [
      { content: 'successive', translation: '连续的' },
      { content: 'success', translation: '成功，胜利' }
    ]
  },
  {
    id: 102,
    title: 'shutter vs shatter',
    words: [
      { content: 'shutter', translation: '快门' },
      { content: 'shatter', translation: '(使) 破碎；使 (希望等) 破灭' }
    ]
  },
  {
    id: 103,
    title: 'empire vs expire',
    words: [
      { content: 'empire', translation: '帝国；企业集团' },
      { content: 'expire', translation: '(协议等) 到期，失效；死亡' }
    ]
  },
  {
    id: 104,
    title: 'defeat vs feat',
    words: [
      { content: 'defeat', translation: '击败' },
      { content: 'feat', translation: '壮举，技艺' }
    ]
  },
  {
    id: 105,
    title: 'quarrel vs squirrel',
    words: [
      { content: 'quarrel', translation: '争吵' },
      { content: 'squirrel', translation: '松鼠' }
    ]
  },
  {
    id: 106,
    title: 'nominate vs nominal',
    words: [
      { content: 'nominate', translation: '提名；任命，指定' },
      { content: 'nominal', translation: '名义上的；象征性的，很少的' }
    ]
  }
]

// 显示单词详情
function showWordDetail(word: any, group: any) {
  selectedWord.value = word
  selectedGroup.value = group
  wordDetailVisible.value = true
}

// 笔记相关
const noteFilter = ref('')
const notes = ref<any[]>([])
const noteDialogVisible = ref(false)
const isEditing = ref(false)
const noteForm = ref({
  id: null as number | null,
  type: 'word',
  content: '',
  tagsInput: ''
})

// 过滤后的笔记
const filteredNotes = computed(() => {
  if (!noteFilter.value) return notes.value
  return notes.value.filter(note => note.type === noteFilter.value)
})

// 获取笔记类型标签
function getNoteTypeLabel(type: string) {
  const labels: Record<string, string> = {
    word: '单词',
    phrase: '词组',
    sentence: '句子',
    summary: '总结',
    confusable: '易混淆'
  }
  return labels[type] || type
}

// 获取笔记类型颜色
function getNoteTypeColor(type: string) {
  const colors: Record<string, any> = {
    word: '',
    phrase: 'success',
    sentence: 'warning',
    summary: 'info',
    confusable: 'danger'
  }
  return colors[type] || ''
}

// 打开笔记对话框
function openNoteDialog(note?: any) {
  if (note) {
    isEditing.value = true
    noteForm.value = {
      id: note.id,
      type: note.type,
      content: note.content,
      tagsInput: note.tags ? note.tags.join(', ') : ''
    }
  } else {
    isEditing.value = false
    noteForm.value = {
      id: null,
      type: 'word',
      content: '',
      tagsInput: ''
    }
  }
  noteDialogVisible.value = true
}

// 编辑笔记
function editNote(note: any) {
  openNoteDialog(note)
}

// 删除笔记
function deleteNote(id: number) {
  const index = notes.value.findIndex(n => n.id === id)
  if (index !== -1) {
    notes.value.splice(index, 1)
    localStorage.setItem('english-vocabulary-notes', JSON.stringify(notes.value))
  }
}

// 保存笔记
function saveNote() {
  const tags = noteForm.value.tagsInput
    .split(',')
    .map(t => t.trim())
    .filter(t => t)
  
  if (isEditing.value && noteForm.value.id) {
    // 编辑现有笔记
    const index = notes.value.findIndex(n => n.id === noteForm.value.id)
    if (index !== -1) {
      notes.value[index] = {
        ...notes.value[index],
        type: noteForm.value.type,
        content: noteForm.value.content,
        tags
      }
    }
  } else {
    // 添加新笔记
    const newNote = {
      id: Date.now(),
      type: noteForm.value.type,
      content: noteForm.value.content,
      tags,
      date: new Date().toLocaleDateString('zh-CN')
    }
    notes.value.unshift(newNote)
  }
  
  localStorage.setItem('english-vocabulary-notes', JSON.stringify(notes.value))
  noteDialogVisible.value = false
}

// 加载笔记
onMounted(() => {
  const saved = localStorage.getItem('english-vocabulary-notes')
  if (saved) {
    notes.value = JSON.parse(saved)
  }
})
</script>

<style scoped>
.vocabulary-learning {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-header h2 {
  font-size: 28px;
  color: #303133;
  margin-bottom: 10px;
}

.page-header p {
  font-size: 14px;
  color: #909399;
}

.tab-switcher {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: center;
}

.tab-btn {
  padding: 10px 24px;
  border: 2px solid #dcdfe6;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  color: #606266;
}

.tab-btn:hover {
  border-color: #409eff;
  color: #409eff;
}

.tab-btn.active {
  background: #409eff;
  border-color: #409eff;
  color: white;
}

/* 词根词缀样式 */
.roots-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.search-box {
  position: relative;
  margin-bottom: 20px;
}

.search-box .el-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #909399;
}

.search-box input {
  width: 100%;
  padding: 10px 12px 10px 40px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
}

.search-box input:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.letter-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.letter-btn {
  padding: 6px 12px;
  border: 1px solid #dcdfe6;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 13px;
  color: #606266;
}

.letter-btn:hover {
  border-color: #409eff;
  color: #409eff;
}

.letter-btn.active {
  background: #409eff;
  border-color: #409eff;
  color: white;
}

.roots-group {
  margin-bottom: 30px;
}

.group-title {
  font-size: 20px;
  color: #409eff;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e4e7ed;
}

.roots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}

.root-card {
  padding: 15px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
}

.root-card:hover {
  border-color: #409eff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
  transform: translateY(-2px);
}

.root-word {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 6px;
}

.root-meaning {
  font-size: 13px;
  color: #909399;
}

/* 词根详情样式 */
.root-detail {
  padding: 10px;
}

.detail-meaning {
  font-size: 15px;
  color: #606266;
  margin-bottom: 20px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 6px;
}

.vocab-section h4 {
  font-size: 16px;
  color: #303133;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e4e7ed;
}

.vocab-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.vocab-item {
  padding: 12px;
  background: #fafafa;
  border-radius: 6px;
  border-left: 3px solid #409eff;
}

.vocab-word {
  font-size: 15px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 4px;
}

.vocab-meaning {
  font-size: 14px;
  color: #606266;
  margin-bottom: 6px;
}

.vocab-example {
  font-size: 13px;
  color: #909399;
  font-style: italic;
}

.no-vocab {
  padding: 40px 0;
  text-align: center;
}

/* 形近词对比样式 */
.confusable-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.section-header {
  text-align: center;
  margin-bottom: 30px;
}

.section-header h3 {
  font-size: 22px;
  color: #303133;
  margin-bottom: 8px;
}

.section-header p {
  font-size: 14px;
  color: #909399;
}

.confusable-groups {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 16px;
}

.confusable-group-card {
  border: 1px solid #e4e7ed;
  border-radius: 10px;
  padding: 16px;
  transition: all 0.3s;
  background: linear-gradient(135deg, #fff9e6 0%, #ffffff 100%);
}

.confusable-group-card:hover {
  box-shadow: 0 4px 12px rgba(230, 162, 60, 0.2);
  transform: translateY(-2px);
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e6a23c;
}

.group-header h4 {
  font-size: 16px;
  color: #e6a23c;
  margin: 0;
}

.words-comparison {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.word-item {
  padding: 12px;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  border-left: 3px solid transparent;
}

.word-item:hover {
  border-left-color: #e6a23c;
  background: #fef9f0;
}

.word-main {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.word-text {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}

.word-translation {
  font-size: 13px;
  color: #909399;
}

/* 单词详情样式 */
.word-detail-content {
  padding: 10px;
}

.detail-translation {
  font-size: 15px;
  color: #606266;
  margin-bottom: 20px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 6px;
}

.similar-words h4 {
  font-size: 16px;
  color: #303133;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e4e7ed;
}

.similar-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.similar-item {
  padding: 10px 12px;
  background: #fafafa;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.similar-item.active {
  background: #e6a23c;
  color: white;
}

.similar-item.active strong,
.similar-item.active span {
  color: white;
}

.similar-item strong {
  font-size: 15px;
  color: #409eff;
}

.similar-item span {
  font-size: 13px;
  color: #909399;
}

.memory-tip {
  margin-top: 16px;
}

/* 笔记样式 */
.notes-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.notes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.notes-header h3 {
  font-size: 18px;
  color: #303133;
}

.notes-filter {
  margin-bottom: 20px;
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.note-card {
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  transition: all 0.3s;
}

.note-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.note-word {
  border-left: 4px solid #409eff;
}

.note-phrase {
  border-left: 4px solid #67c23a;
}

.note-sentence {
  border-left: 4px solid #e6a23c;
}

.note-summary {
  border-left: 4px solid #909399;
}

.note-confusable {
  border-left: 4px solid #f56c6c;
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.note-date {
  font-size: 12px;
  color: #909399;
}

.note-content {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  margin-bottom: 10px;
}

.note-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}

.note-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.empty-notes {
  padding: 60px 0;
  text-align: center;
}

@media (max-width: 768px) {
  .roots-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
  
  .tab-switcher {
    flex-direction: column;
  }
  
  .tab-btn {
    width: 100%;
  }
}
</style>

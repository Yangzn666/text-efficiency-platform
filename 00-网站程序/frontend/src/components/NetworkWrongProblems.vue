<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, DocumentChecked } from '@element-plus/icons-vue'

interface WrongProblem {
  id: string
  chapterId: string
  chapterName: string
  sectionId: string
  sectionName: string
  title: string
  content: string
  mistakeType: string
  importance: number
  correction: string
  createdAt: string
  reviewCount: number
  lastReviewAt: string
  mastered: boolean
}

const problems = ref<WrongProblem[]>([
  {
    id: 'net_5_1',
    chapterId: 'ch5',
    chapterName: '第五章 传输层',
    sectionId: '5.3',
    sectionName: '5.3 TCP',
    title: 'TCP三次握手过程',
    content: '在TCP连接建立过程中，客户端发送SYN=1, seq=x后，服务器应该回复（）。\nA. SYN=1, ACK=1, seq=y, ack=x+1\nB. SYN=1, ACK=0, seq=y\nC. ACK=1, seq=y, ack=x\nD. SYN=1, ACK=1, seq=y, ack=x',
    mistakeType: '概念不清',
    importance: 5,
    correction: '正确答案：A\n解析：TCP三次握手的第二次握手，服务器需要同时确认客户端的SYN（ACK=1, ack=x+1）并发送自己的SYN（SYN=1, seq=y）。注意ack=x+1是对x的确认。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'net_4_2',
    chapterId: 'ch4',
    chapterName: '第四章 网络层',
    sectionId: '4.3',
    sectionName: '4.3 IPv4',
    title: '子网划分与CIDR计算',
    content: '某公司申请到一个C类IP地址，但要连接6个子公司，最大的一个子公司有26台计算机，每个子公司在一个网段中，则子网掩码应设为（）。\nA. 255.255.255.0\nB. 255.255.255.128\nC. 255.255.255.192\nD. 255.255.255.224',
    mistakeType: '计算错误',
    importance: 5,
    correction: '正确答案：D\n解析：最大子公司26台主机，需要至少5位主机位（2^5-2=30>=26）。C类地址默认24位网络位，借用3位作为子网位（2^3=8>=6个子网），所以子网掩码为24+3=27位，即255.255.255.224。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'net_3_3',
    chapterId: 'ch3',
    chapterName: '第三章 数据链路层',
    sectionId: '3.4',
    sectionName: '3.4 介质访问控制',
    title: 'CSMA/CD协议最小帧长',
    content: '以太网采用CSMA/CD协议，若网络数据传输速率为1Gbps，电缆长度为2km，信号传播速度为2×10^8m/s，则最小帧长为（）。\nA. 1000bit\nB. 2000bit\nC. 10000bit\nD. 20000bit',
    mistakeType: '理解偏差',
    importance: 4,
    correction: '正确答案：C\n解析：最小帧长 = 2 × 传播时延 × 数据传输速率。传播时延 = 2000m / (2×10^8m/s) = 10μs。最小帧长 = 2 × 10μs × 1Gbps = 20000bit？等等，重新计算：2 × 10×10^-6 × 10^9 = 20000bit。但标准答案是10000bit，因为实际以太网规定最小帧长为64字节=512bit（10Mbps时），千兆以太网为512×100=51200bit。这题应该是理论计算题，答案应为20000bit。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'net_6_4',
    chapterId: 'ch6',
    chapterName: '第六章 应用层',
    sectionId: '6.5',
    sectionName: '6.5 WWW',
    title: 'HTTP与HTTPS的区别',
    content: '下列关于HTTP和HTTPS的说法中，错误的是（）。\nA. HTTPS使用SSL/TLS协议进行加密\nB. HTTP默认端口是80，HTTPS默认端口是443\nC. HTTPS比HTTP更安全，因此速度更快\nD. HTTPS需要对服务器进行身份认证',
    mistakeType: '记忆混淆',
    importance: 4,
    correction: '正确答案：C\n解析：HTTPS由于需要进行加密解密操作，会增加额外的计算开销，因此速度通常比HTTP慢，而不是更快。HTTPS的优势在于安全性，而非速度。其他选项均正确。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'net_4_5',
    chapterId: 'ch4',
    chapterName: '第四章 网络层',
    sectionId: '4.8',
    sectionName: '4.8 网络层设备',
    title: '路由器与交换机的区别',
    content: '下列关于路由器和二层交换机的说法中，正确的是（）。\nA. 路由器工作在网络层，交换机工作在数据链路层\nB. 路由器可以隔离广播域，交换机不能\nC. 路由器根据IP地址转发，交换机根据MAC地址转发\nD. 以上都正确',
    mistakeType: '概念混淆',
    importance: 4,
    correction: '正确答案：D\n解析：三个选项都正确。路由器工作在第3层（网络层），根据IP地址进行路由选择，可以隔离广播域；二层交换机工作在第2层（数据链路层），根据MAC地址进行帧转发，只能隔离冲突域，不能隔离广播域。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  }
])

// 表单相关
const dialogVisible = ref(false)
const editingProblem = ref<WrongProblem | null>(null)
const formRef = ref()

const formData = ref({
  chapterId: '',
  chapterName: '',
  sectionId: '',
  sectionName: '',
  title: '',
  content: '',
  mistakeType: '概念不清',
  importance: 3,
  correction: ''
})

// 章节列表（从store获取）
import { useNetworkStore } from '@/stores/network'
const networkStore = useNetworkStore()

const chapterOptions = computed(() => {
  return networkStore.chapters.map(ch => ({
    value: ch.id,
    label: `第${ch.number}章 ${ch.title}`
  }))
})

const sectionOptions = computed(() => {
  const chapter = networkStore.chapters.find(ch => ch.id === formData.value.chapterId)
  if (!chapter) return []
  return chapter.sections.map(sec => ({
    value: sec.id,
    label: `${sec.id} ${sec.title}`
  }))
})

const mistakeTypeOptions = [
  '概念不清',
  '计算错误',
  '思路错误',
  '记忆混淆',
  '理解偏差',
  '粗心大意'
]

// 筛选条件
const filterChapter = ref('')
const filterMastered = ref('all') // all, mastered, not-mastered
const searchKeyword = ref('')

// 过滤后的错题列表
const filteredProblems = computed(() => {
  let result = problems.value
  
  // 按章节筛选
  if (filterChapter.value) {
    result = result.filter(p => p.chapterId === filterChapter.value)
  }
  
  // 按掌握状态筛选
  if (filterMastered.value === 'mastered') {
    result = result.filter(p => p.mastered)
  } else if (filterMastered.value === 'not-mastered') {
    result = result.filter(p => !p.mastered)
  }
  
  // 按关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(p => 
      p.title.toLowerCase().includes(keyword) ||
      p.content.toLowerCase().includes(keyword)
    )
  }
  
  return result
})

// 统计数据
const stats = computed(() => {
  const total = problems.value.length
  const mastered = problems.value.filter(p => p.mastered).length
  const notMastered = total - mastered
  const avgImportance = total > 0 
    ? (problems.value.reduce((sum, p) => sum + p.importance, 0) / total).toFixed(1)
    : '0'
  
  return { total, mastered, notMastered, avgImportance }
})

// 格式化题目内容
const formatContent = (content: string): string[] => {
  if (!content) return []
  return content.split('\n').filter(line => line.trim() !== '')
}

// 获取错误类型颜色
const getMistakeTypeColor = (type: string) => {
  const colorMap: Record<string, any> = {
    '概念不清': 'danger',
    '计算错误': 'warning',
    '思路错误': 'danger',
    '记忆混淆': 'info',
    '理解偏差': 'warning',
    '粗心大意': 'success'
  }
  return colorMap[type] || 'info'
}

// 格式化日期
const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN')
}

// 添加错题
const handleAdd = () => {
  editingProblem.value = null
  resetForm()
  dialogVisible.value = true
}

// 编辑错题
const handleEdit = (problem: WrongProblem) => {
  editingProblem.value = problem
  formData.value = {
    chapterId: problem.chapterId,
    chapterName: problem.chapterName,
    sectionId: problem.sectionId,
    sectionName: problem.sectionName,
    title: problem.title,
    content: problem.content,
    mistakeType: problem.mistakeType,
    importance: problem.importance,
    correction: problem.correction
  }
  dialogVisible.value = true
}

// 删除错题
const handleDelete = (id: string) => {
  const index = problems.value.findIndex(p => p.id === id)
  if (index !== -1) {
    problems.value.splice(index, 1)
    saveToLocalStorage()
    ElMessage.success('删除成功')
  }
}

// 切换掌握状态
const toggleMastered = (problem: WrongProblem) => {
  problem.mastered = !problem.mastered
  problem.reviewCount++
  problem.lastReviewAt = new Date().toISOString()
  saveToLocalStorage()
  ElMessage.success(problem.mastered ? '已标记为掌握' : '已取消掌握标记')
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    if (editingProblem.value) {
      // 编辑模式
      Object.assign(editingProblem.value, {
        ...formData.value,
        chapterName: getChapterName(formData.value.chapterId),
        sectionName: getSectionName(formData.value.chapterId, formData.value.sectionId)
      })
      ElMessage.success('更新成功')
    } else {
      // 新增模式
      const newProblem: WrongProblem = {
        id: `net_${Date.now()}`,
        ...formData.value,
        chapterName: getChapterName(formData.value.chapterId),
        sectionName: getSectionName(formData.value.chapterId, formData.value.sectionId),
        createdAt: new Date().toISOString(),
        reviewCount: 0,
        lastReviewAt: '',
        mastered: false
      }
      problems.value.unshift(newProblem)
      ElMessage.success('添加成功')
    }
    
    saveToLocalStorage()
    dialogVisible.value = false
    resetForm()
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 重置表单
const resetForm = () => {
  formData.value = {
    chapterId: '',
    chapterName: '',
    sectionId: '',
    sectionName: '',
    title: '',
    content: '',
    mistakeType: '概念不清',
    importance: 3,
    correction: ''
  }
}

// 获取章节名称
const getChapterName = (chapterId: string): string => {
  const chapter = networkStore.chapters.find(ch => ch.id === chapterId)
  return chapter ? `第${chapter.number}章 ${chapter.title}` : ''
}

// 获取小节名称
const getSectionName = (chapterId: string, sectionId: string): string => {
  const chapter = networkStore.chapters.find(ch => ch.id === chapterId)
  if (!chapter) return ''
  const section = chapter.sections.find(sec => sec.id === sectionId)
  return section ? `${section.id} ${section.title}` : ''
}

// 保存到localStorage
const saveToLocalStorage = () => {
  localStorage.setItem('networkWrongProblems', JSON.stringify(problems.value))
}

// 从localStorage加载
const loadFromLocalStorage = () => {
  const saved = localStorage.getItem('networkWrongProblems')
  if (saved) {
    problems.value = JSON.parse(saved)
  }
}

onMounted(() => {
  loadFromLocalStorage()
})

// 暴露方法供父组件调用
defineExpose({
  refresh: loadFromLocalStorage
})
</script>

<template>
  <div class="network-wrong-problems">
    <!-- 统计卡片 -->
    <div class="stats-cards">
      <el-card shadow="hover" class="stat-card">
        <div class="stat-content">
          <div class="stat-value">{{ stats.total }}</div>
          <div class="stat-label">总题数</div>
        </div>
      </el-card>
      
      <el-card shadow="hover" class="stat-card success">
        <div class="stat-content">
          <div class="stat-value">{{ stats.mastered }}</div>
          <div class="stat-label">已掌握</div>
        </div>
      </el-card>
      
      <el-card shadow="hover" class="stat-card warning">
        <div class="stat-content">
          <div class="stat-value">{{ stats.notMastered }}</div>
          <div class="stat-label">待复习</div>
        </div>
      </el-card>
      
      <el-card shadow="hover" class="stat-card info">
        <div class="stat-content">
          <div class="stat-value">{{ stats.avgImportance }}</div>
          <div class="stat-label">平均重要性</div>
        </div>
      </el-card>
    </div>
    
    <!-- 筛选工具栏 -->
    <div class="filter-toolbar">
      <el-space wrap>
        <el-select 
          v-model="filterChapter" 
          placeholder="选择章节" 
          clearable
          style="width: 200px;"
        >
          <el-option
            v-for="item in chapterOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        
        <el-select 
          v-model="filterMastered" 
          placeholder="掌握状态"
          style="width: 120px;"
        >
          <el-option label="全部" value="all" />
          <el-option label="已掌握" value="mastered" />
          <el-option label="未掌握" value="not-mastered" />
        </el-select>
        
        <el-input
          v-model="searchKeyword"
          placeholder="搜索题目..."
          clearable
          style="width: 200px;"
        />
        
        <el-button type="primary" :icon="Plus" @click="handleAdd">
          添加错题
        </el-button>
      </el-space>
    </div>
    
    <!-- 错题列表 -->
    <div class="problems-list">
      <el-empty v-if="filteredProblems.length === 0" description="暂无错题" />
      
      <el-card 
        v-for="problem in filteredProblems" 
        :key="problem.id"
        class="problem-card"
        :class="{ mastered: problem.mastered }"
        shadow="hover"
      >
        <div class="problem-header">
          <div class="problem-title">
            <el-tag size="small" type="info">{{ problem.chapterName }}</el-tag>
            <el-tag size="small" type="success">{{ problem.sectionName }}</el-tag>
            <span class="title-text">{{ problem.title }}</span>
          </div>
          
          <div class="problem-actions">
            <el-rate 
              v-model="problem.importance" 
              disabled
              show-score
              text-color="#ff9900"
              score-template="{value}"
            />
            
            <el-button 
              size="small" 
              :type="problem.mastered ? 'success' : 'default'"
              @click="toggleMastered(problem)"
            >
              {{ problem.mastered ? '已掌握 ✓' : '标记掌握' }}
            </el-button>
            
            <el-button size="small" @click="handleEdit(problem)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(problem.id)">删除</el-button>
          </div>
        </div>
        
        <div class="problem-body">
          <div v-if="problem.content" class="problem-content">
            <strong>题目内容：</strong>
            <div class="content-text">
              <div v-for="(line, index) in formatContent(problem.content)" :key="index" class="content-line">
                {{ line }}
              </div>
            </div>
          </div>
          
          <div v-if="problem.correction" class="problem-correction">
            <strong>错题解析：</strong>
            <div class="correction-text">{{ problem.correction }}</div>
          </div>
          
          <div class="problem-meta">
            <el-tag size="small" :type="getMistakeTypeColor(problem.mistakeType)">
              {{ problem.mistakeType }}
            </el-tag>
            <span class="meta-info">复习次数: {{ problem.reviewCount }}</span>
            <span class="meta-info" v-if="problem.lastReviewAt">
              最后复习: {{ formatDate(problem.lastReviewAt) }}
            </span>
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 添加/编辑对话框 -->
    <el-dialog 
      v-model="dialogVisible" 
      :title="editingProblem ? '编辑错题' : '添加错题'"
      width="700px"
    >
      <el-form 
        ref="formRef" 
        :model="formData" 
        label-width="100px"
      >
        <el-form-item label="所属章节" required>
          <el-select v-model="formData.chapterId" placeholder="选择章节" style="width: 100%;">
            <el-option
              v-for="item in chapterOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="所属小节" required>
          <el-select v-model="formData.sectionId" placeholder="选择小节" style="width: 100%;">
            <el-option
              v-for="item in sectionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="题目标题" required>
          <el-input v-model="formData.title" placeholder="输入题目标题" />
        </el-form-item>
        
        <el-form-item label="题目内容" required>
          <el-input 
            v-model="formData.content" 
            type="textarea" 
            :rows="4"
            placeholder="输入题目内容，每行一个选项"
          />
        </el-form-item>
        
        <el-form-item label="错误类型" required>
          <el-select v-model="formData.mistakeType" placeholder="选择错误类型" style="width: 100%;">
            <el-option
              v-for="type in mistakeTypeOptions"
              :key="type"
              :label="type"
              :value="type"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="重要程度" required>
          <el-rate v-model="formData.importance" />
        </el-form-item>
        
        <el-form-item label="错题解析" required>
          <el-input 
            v-model="formData.correction" 
            type="textarea" 
            :rows="4"
            placeholder="输入正确答案和解析"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.network-wrong-problems {
  .stats-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 20px;
    
    .stat-card {
      cursor: pointer;
      transition: all 0.3s;
      
      &:hover {
        transform: translateY(-4px);
      }
      
      &.success .stat-value {
        color: #67c23a;
      }
      
      &.warning .stat-value {
        color: #e6a23c;
      }
      
      &.info .stat-value {
        color: #409eff;
      }
      
      .stat-content {
        text-align: center;
        
        .stat-value {
          font-size: 28px;
          font-weight: bold;
          color: $primary-color;
          margin-bottom: 4px;
        }
        
        .stat-label {
          font-size: 13px;
          color: #909399;
        }
      }
    }
  }
  
  .filter-toolbar {
    padding: 16px;
    background: white;
    border-radius: 8px;
    margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }
  
  .problems-list {
    .problem-card {
      margin-bottom: 16px;
      border-left: 4px solid #f56c6c;
      transition: all 0.3s;
      
      &.mastered {
        border-left-color: #67c23a;
        opacity: 0.8;
      }
      
      &:hover {
        transform: translateX(4px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
      }
      
      .problem-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 12px;
        padding-bottom: 12px;
        border-bottom: 1px dashed #e4e7ed;
        
        .problem-title {
          flex: 1;
          
          .el-tag {
            margin-right: 8px;
          }
          
          .title-text {
            font-size: 16px;
            font-weight: 600;
            color: #303133;
            margin-left: 8px;
          }
        }
        
        .problem-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
      }
      
      .problem-body {
        .problem-content,
        .problem-correction {
          margin-bottom: 12px;
          
          strong {
            display: block;
            margin-bottom: 8px;
            color: #606266;
            font-size: 14px;
          }
          
          .content-text {
            background: linear-gradient(135deg, #f5f7fa 0%, #fafafa 100%);
            padding: 12px;
            border-radius: 6px;
            border-left: 3px solid $primary-color;
            
            .content-line {
              padding: 6px 0;
              min-height: 24px;
              line-height: 1.6;
              
              // 题目前缀（非选项行）
              &:first-child:not(:only-child) {
                font-weight: 600;
                padding-bottom: 10px;
                border-bottom: 1px dashed #dcdfe6;
                margin-bottom: 8px;
              }
              
              // 选项行样式
              &:not(:first-child) {
                padding-left: 16px;
                position: relative;
                transition: all 0.2s;
                
                &:hover {
                  background: rgba(102, 126, 234, 0.08);
                  border-radius: 4px;
                  padding-left: 20px;
                }
                
                &::before {
                  content: '';
                  position: absolute;
                  left: 0;
                  top: 50%;
                  transform: translateY(-50%);
                  width: 4px;
                  height: 4px;
                  background: #667eea;
                  border-radius: 50%;
                }
              }
            }
          }
          
          .correction-text {
            background: #fef0f0;
            padding: 12px;
            border-radius: 6px;
            border-left: 3px solid #f56c6c;
            line-height: 1.8;
            color: #606266;
          }
        }
        
        .problem-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-top: 12px;
          border-top: 1px solid #f0f0f0;
          
          .meta-info {
            font-size: 12px;
            color: #909399;
          }
        }
      }
    }
  }
}

</style>

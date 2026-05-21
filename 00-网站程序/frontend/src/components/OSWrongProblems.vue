<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, DocumentChecked, Upload, Picture, MagicStick, ArrowDown } from '@element-plus/icons-vue'

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
    id: 'os_2_1',
    chapterId: 'ch2',
    chapterName: '第二章 进程管理',
    sectionId: '2.1',
    sectionName: '2.1 进程与线程',
    title: '进程的基本状态转换',
    content: '下列选项中，可能导致进程从运行状态变为就绪状态的是（）。\nA. 等待I/O完成\nB. 时间片用完\nC. I/O完成\nD. 进程被杀死',
    mistakeType: '概念不清',
    importance: 5,
    correction: '正确答案：B\n解析：时间片用完后，进程会从运行态转为就绪态，等待下一次调度。A选项会转为阻塞态，C选项从阻塞态转为就绪态，D选项直接终止。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'os_2_2',
    chapterId: 'ch2',
    chapterName: '第二章 进程管理',
    sectionId: '2.2',
    sectionName: '2.2 CPU调度',
    title: '调度算法的比较',
    content: '下列关于CPU调度算法的说法中，正确的是（）。\nA. FCFS算法不会产生饥饿现象\nB. SJF算法的平均等待时间最短\nC. RR算法的时间片越大越好\nD. 多级反馈队列算法不能保证响应时间',
    mistakeType: '理解偏差',
    importance: 4,
    correction: '正确答案：B\n解析：SJF（短作业优先）算法在理论上可以使平均等待时间最短。A错误，FCFS对短作业不利；C错误，RR时间片过大会退化为FCFS；D错误，多级反馈队列可以较好地平衡响应时间和吞吐量。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'os_3_1',
    chapterId: 'ch3',
    chapterName: '第三章 内存管理',
    sectionId: '3.2',
    sectionName: '3.2 分页存储管理',
    title: '页表的作用',
    content: '在分页存储管理系统中，页表的作用是（）。\nA. 实现虚拟地址到物理地址的映射\nB. 保护内存不被非法访问\nC. 实现内存共享\nD. 以上都是',
    mistakeType: '概念不清',
    importance: 5,
    correction: '正确答案：D\n解析：页表不仅实现地址映射，还可以通过权限位实现内存保护，通过标记共享页实现内存共享。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'os_4_1',
    chapterId: 'ch4',
    chapterName: '第四章 文件系统',
    sectionId: '4.2',
    sectionName: '4.2 文件目录',
    title: '索引节点的字段',
    content: '在UNIX文件系统中，索引节点（inode）不包含的信息是（）。\nA. 文件名\nB. 文件大小\nC. 文件所有者\nD. 数据块指针',
    mistakeType: '记忆混淆',
    importance: 4,
    correction: '正确答案：A\n解析：文件名存储在目录项中，不在inode中。inode包含文件大小、所有者、权限、时间戳和数据块指针等信息。一个文件可以有多个硬链接（多个文件名指向同一个inode）。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'os_5_1',
    chapterId: 'ch5',
    chapterName: '第五章 I/O管理',
    sectionId: '5.2',
    sectionName: '5.2 I/O核心子系统',
    title: '设备独立性软件的功能',
    content: '下列功能中，属于设备独立性软件层的是（）。\nA. 中断处理\nB. 设备驱动程序\nC. 统一命名和抽象\nD. DMA控制',
    mistakeType: '概念不清',
    importance: 4,
    correction: '正确答案：C\n解析：设备独立性软件提供统一的设备接口和命名，使应用程序不依赖于具体设备。A和D属于硬件层面，B属于设备驱动层。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  }
])

const activeTab = ref('list')
const showAddDialog = ref(false)

// 图片录入相关状态
const imageUploadMode = ref(false)
const uploadedImages = ref<string[]>([])
const ocrTipVisible = ref(true)

// 错题展开状态管理（记录每道题的订正笔记是否展开）
const expandedCorrections = ref<Set<string>>(new Set())

const newProblem = ref({
  chapterId: '',
  chapterName: '',
  sectionId: '',
  sectionName: '',
  title: '',
  content: '',
  mistakeType: '',
  importance: 3,
  correction: ''
})

const mistakeTypes = [
  { value: '概念不清', label: '概念理解不清' },
  { value: '计算错误', label: '计算错误' },
  { value: '思路错误', label: '解题思路错误' },
  { value: '粗心大意', label: '粗心/审题不清' },
  { value: '不会做', label: '完全不会做' },
  { value: '记忆混淆', label: '知识点记忆混淆' },
  { value: '理解偏差', label: '理解有偏差' }
]

const chapters = [
  { id: 'ch1', name: '第一章 操作系统概述' },
  { id: 'ch2', name: '第二章 进程管理' },
  { id: 'ch3', name: '第三章 内存管理' },
  { id: 'ch4', name: '第四章 文件系统' },
  { id: 'ch5', name: '第五章 I/O管理' }
]

const chapterFilter = ref('all')
const typeFilter = ref('all')
const masteredFilter = ref('all')

// 计算属性
const filteredProblems = computed(() => {
  return problems.value.filter(p => {
    if (chapterFilter.value !== 'all' && p.chapterId !== chapterFilter.value) return false
    if (typeFilter.value !== 'all' && p.mistakeType !== typeFilter.value) return false
    if (masteredFilter.value === 'mastered' && !p.mastered) return false
    if (masteredFilter.value === 'unmastered' && p.mastered) return false
    return true
  })
})

const stats = computed(() => {
  const total = problems.value.length
  const mastered = problems.value.filter(p => p.mastered).length
  const unmastered = total - mastered
  
  const typeStats: Record<string, number> = {}
  problems.value.forEach(p => {
    typeStats[p.mistakeType] = (typeStats[p.mistakeType] || 0) + 1
  })
  
  return { total, mastered, unmastered, typeStats }
})

// 方法
const openAddDialog = () => {
  // 重置表单
  newProblem.value = {
    chapterId: '',
    chapterName: '',
    sectionId: '',
    sectionName: '',
    title: '',
    content: '',
    mistakeType: '',
    importance: 3,
    correction: ''
  }
  showAddDialog.value = true
}

const addProblem = () => {
  if (!newProblem.value.title || !newProblem.value.mistakeType) {
    ElMessage.warning('请填写题目和错误类型')
    return
  }
  
  const problem: WrongProblem = {
    id: `wrong_${Date.now()}`,
    chapterId: newProblem.value.chapterId || 'unknown',
    chapterName: newProblem.value.chapterName || '未分类',
    sectionId: newProblem.value.sectionId || '',
    sectionName: newProblem.value.sectionName || '',
    title: newProblem.value.title,
    content: newProblem.value.content,
    mistakeType: newProblem.value.mistakeType,
    importance: newProblem.value.importance,
    correction: newProblem.value.correction,
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  }
  
  problems.value.unshift(problem)
  saveToLocalStorage()
  showAddDialog.value = false
  ElMessage.success('错题添加成功')
}

const toggleMastered = (problem: WrongProblem) => {
  problem.mastered = !problem.mastered
  if (problem.mastered) {
    problem.reviewCount++
    problem.lastReviewAt = new Date().toISOString()
  }
  saveToLocalStorage()
  ElMessage.success(problem.mastered ? '已标记为掌握' : '已取消掌握')
}

const deleteProblem = (id: string) => {
  problems.value = problems.value.filter(p => p.id !== id)
  saveToLocalStorage()
  ElMessage.success('已删除')
}

const saveToLocalStorage = () => {
  localStorage.setItem('os_wrong_problems', JSON.stringify(problems.value))
}

const loadFromLocalStorage = () => {
  const saved = localStorage.getItem('os_wrong_problems')
  if (saved) {
    try {
      problems.value = JSON.parse(saved)
    } catch (e) {
      console.error('加载错题失败:', e)
    }
  }
}

const getMistakeTypeTag = (type: string): 'success' | 'warning' | 'danger' | 'info' => {
  const map: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
    '概念不清': 'danger',
    '计算错误': 'warning',
    '思路错误': 'danger',
    '粗心大意': 'info',
    '不会做': 'danger',
    '记忆混淆': 'warning',
    '理解偏差': 'warning'
  }
  return map[type] || 'info'
}

const toggleCorrection = (problemId: string) => {
  if (expandedCorrections.value.has(problemId)) {
    expandedCorrections.value.delete(problemId)
  } else {
    expandedCorrections.value.add(problemId)
  }
}

const isCorrectionExpanded = (problemId: string) => {
  return expandedCorrections.value.has(problemId)
}

// 图片录入相关方法
const toggleImageMode = () => {
  imageUploadMode.value = !imageUploadMode.value
}

const handleImageChange = (file: any) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    uploadedImages.value.push(e.target?.result as string)
  }
  reader.readAsDataURL(file.raw)
}

const removeImage = (index: number) => {
  uploadedImages.value.splice(index, 1)
}

const updateChapterName = () => {
  const chapter = chapters.find(ch => ch.id === newProblem.value.chapterId)
  if (chapter) {
    newProblem.value.chapterName = chapter.name
  }
}

onMounted(() => {
  loadFromLocalStorage()
})

// 暴露方法供外部调用
defineExpose({
  openAddDialog,
  problems
})
</script>

<template>
  <div class="wrong-problems-container">
    <!-- 顶部统计 -->
    <div class="stats-bar">
      <div class="stat-item">
        <div class="stat-value">{{ stats.total }}</div>
        <div class="stat-label">总错题数</div>
      </div>
      <div class="stat-item mastered">
        <div class="stat-value">{{ stats.mastered }}</div>
        <div class="stat-label">已掌握</div>
      </div>
      <div class="stat-item unmastered">
        <div class="stat-value">{{ stats.unmastered }}</div>
        <div class="stat-label">未掌握</div>
      </div>
    </div>

    <!-- 功能标签页 -->
    <el-tabs v-model="activeTab" class="wrong-tabs">
      <el-tab-pane label="错题列表" name="list">
        <!-- 筛选栏 -->
        <div class="filter-bar">
          <el-button type="primary" @click="openAddDialog">
            <el-icon><Plus /></el-icon>
            添加错题
          </el-button>
          
          <el-space>
            <el-select v-model="chapterFilter" placeholder="按章节筛选" clearable style="width: 150px">
              <el-option label="全部章节" value="all" />
              <el-option 
                v-for="ch in chapters" 
                :key="ch.id" 
                :label="ch.name" 
                :value="ch.id" 
              />
            </el-select>
            
            <el-select v-model="typeFilter" placeholder="按类型筛选" clearable style="width: 150px">
              <el-option label="全部类型" value="all" />
              <el-option 
                v-for="type in mistakeTypes" 
                :key="type.value" 
                :label="type.label" 
                :value="type.value" 
              />
            </el-select>
            
            <el-select v-model="masteredFilter" placeholder="掌握状态" clearable style="width: 120px">
              <el-option label="全部" value="all" />
              <el-option label="已掌握" value="mastered" />
              <el-option label="未掌握" value="unmastered" />
            </el-select>
          </el-space>
        </div>

        <!-- 错题列表 -->
        <div class="problems-list">
          <el-card 
            v-for="problem in filteredProblems" 
            :key="problem.id"
            class="problem-card"
            :class="{ mastered: problem.mastered }"
          >
            <div class="problem-header">
              <div class="problem-title-section">
                <h4 class="problem-title">{{ problem.title }}</h4>
                <div class="problem-meta">
                  <el-tag size="small" :type="getMistakeTypeTag(problem.mistakeType)">
                    {{ problem.mistakeType }}
                  </el-tag>
                  <span class="meta-text">{{ problem.chapterName }}</span>
                  <span class="meta-text" v-if="problem.sectionName">{{ problem.sectionName }}</span>
                </div>
              </div>
              
              <div class="problem-actions">
                <el-rate 
                  v-model="problem.importance" 
                  disabled
                  show-score
                  text-color="#ff9900"
                  :max="5"
                />
                <el-button 
                  size="small" 
                  :type="problem.mastered ? 'success' : 'default'"
                  @click="toggleMastered(problem)"
                >
                  {{ problem.mastered ? '已掌握' : '标记掌握' }}
                </el-button>
                <el-button 
                  size="small" 
                  type="danger" 
                  link
                  @click="deleteProblem(problem.id)"
                >
                  删除
                </el-button>
              </div>
            </div>

            <div class="problem-content">
              <div class="content-section">
                <div class="section-label">题目内容：</div>
                <pre class="content-text">{{ problem.content }}</pre>
              </div>

              <div class="correction-section">
                <div 
                  class="correction-header"
                  @click="toggleCorrection(problem.id)"
                >
                  <span class="section-label">订正笔记：</span>
                  <el-icon>
                    <ArrowDown v-if="!isCorrectionExpanded(problem.id)" />
                    <ArrowDown class="rotated" v-else />
                  </el-icon>
                </div>
                <div v-show="isCorrectionExpanded(problem.id)" class="correction-content">
                  <pre>{{ problem.correction }}</pre>
                </div>
              </div>

              <div class="review-info">
                <span>复习次数：{{ problem.reviewCount }}</span>
                <span v-if="problem.lastReviewAt">
                  | 最后复习：{{ new Date(problem.lastReviewAt).toLocaleDateString('zh-CN') }}
                </span>
              </div>
            </div>
          </el-card>

          <div v-if="filteredProblems.length === 0" class="empty-state">
            <el-icon size="80" color="#c0c4cc"><DocumentChecked /></el-icon>
            <p>暂无错题记录</p>
            <el-button type="primary" @click="openAddDialog">添加第一道错题</el-button>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="统计分析" name="stats">
        <div class="stats-content">
          <el-card>
            <template #header>
              <h3>错误类型分布</h3>
            </template>
            <div class="type-stats">
              <div 
                v-for="(count, type) in stats.typeStats" 
                :key="type"
                class="type-stat-item"
              >
                <div class="type-label">
                  <el-tag :type="getMistakeTypeTag(type)">{{ type }}</el-tag>
                </div>
                <el-progress 
                  :percentage="Math.round((count / stats.total) * 100)" 
                  :stroke-width="20"
                />
                <div class="type-count">{{ count }} 题</div>
              </div>
            </div>
          </el-card>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 添加错题对话框 -->
    <el-dialog 
      v-model="showAddDialog" 
      title="添加错题"
      width="800px"
      :close-on-click-modal="false"
    >
      <!-- 图片录入模式切换按钮 -->
      <div style="margin-bottom: 16px; display: flex; gap: 12px; align-items: center;">
        <el-button 
          :type="imageUploadMode ? 'primary' : 'default'" 
          @click="toggleImageMode"
        >
          <el-icon><Picture /></el-icon>
          图片录入模式
        </el-button>
        <el-tooltip 
          v-if="ocrTipVisible"
          content="支持拍照或上传题目图片，自动识别文字（需接入OCR服务）"
          placement="top"
        >
          <el-icon style="color: #409eff; cursor: help;"><MagicStick /></el-icon>
        </el-tooltip>
      </div>

      <!-- 图片上传区域（仅在图片模式下显示） -->
      <div v-if="imageUploadMode" class="image-upload-area">
        <el-upload
          class="upload-demo"
          drag
          action="#"
          :auto-upload="false"
          :on-change="handleImageChange"
          accept="image/*"
          multiple
        >
          <el-icon class="el-icon--upload"><Upload /></el-icon>
          <div class="el-upload__text">
            拖拽图片到此处或<em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              支持jpg/png格式，可上传多张图片
            </div>
          </template>
        </el-upload>
        
        <!-- 图片预览 -->
        <div v-if="uploadedImages.length > 0" class="image-preview-grid">
          <div 
            v-for="(img, index) in uploadedImages" 
            :key="index"
            class="preview-item"
          >
            <img :src="img" alt="预览" />
            <el-button 
              size="small" 
              type="danger" 
              circle
              class="remove-btn"
              @click="removeImage(index)"
            >
              ×
            </el-button>
          </div>
        </div>
      </div>

      <div class="form-content">
        <el-form :model="newProblem" label-width="100px">
        <el-form-item label="所属章节">
          <el-select 
            v-model="newProblem.chapterId" 
            placeholder="选择章节" 
            style="width: 100%"
            @change="updateChapterName"
          >
            <el-option 
              v-for="ch in chapters" 
              :key="ch.id" 
              :label="ch.name" 
              :value="ch.id" 
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="所属小节">
          <el-input v-model="newProblem.sectionName" placeholder="例如：2.1 进程与线程" />
        </el-form-item>
        
        <el-form-item label="题目标题">
          <el-input v-model="newProblem.title" placeholder="简要描述题目" />
        </el-form-item>
        
        <el-form-item label="题目内容">
          <el-input 
            v-model="newProblem.content" 
            type="textarea" 
            :rows="4"
            placeholder="详细的题目内容..."
          />
        </el-form-item>
        
        <el-form-item label="错误类型">
          <el-select v-model="newProblem.mistakeType" placeholder="选择错误类型" style="width: 100%">
            <el-option 
              v-for="type in mistakeTypes" 
              :key="type.value" 
              :label="type.label" 
              :value="type.value" 
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="重要程度">
          <el-rate v-model="newProblem.importance" :max="5" />
        </el-form-item>
        
        <el-form-item label="订正笔记">
          <el-input 
            v-model="newProblem.correction" 
            type="textarea" 
            :rows="4"
            placeholder="正确的解题思路和答案（可选）"
          />
        </el-form-item>
      </el-form>
      </div>
      
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="addProblem">添加</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.wrong-problems-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  
  .stats-bar {
    display: flex;
    gap: 20px;
    padding: 16px;
    background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
    border-radius: 12px;
    margin-bottom: 16px;
    
    .stat-item {
      flex: 1;
      text-align: center;
      color: white;
      
      &.mastered {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        padding: 8px;
      }
      
      &.unmastered {
        background: rgba(255, 255, 255, 0.15);
        border-radius: 8px;
        padding: 8px;
      }
      
      .stat-value {
        font-size: 2em;
        font-weight: 700;
        margin-bottom: 4px;
      }
      
      .stat-label {
        font-size: 0.9em;
        opacity: 0.9;
      }
    }
  }
  
  .wrong-tabs {
    flex: 1;
    display: flex;
    flex-direction: column;
    
    :deep(.el-tabs__header) {
      margin: 0;
      padding: 0 16px;
    }
    
    :deep(.el-tabs__content) {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
    }
    
    :deep(.el-tab-pane) {
      height: 100%;
    }
  }
  
  .filter-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding: 12px;
    background: #f5f7fa;
    border-radius: 8px;
  }
  
  .problems-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    
    .problem-card {
      transition: all 0.3s;
      border-left: 4px solid #f56c6c;
      
      &.mastered {
        border-left-color: #67c23a;
        opacity: 0.8;
      }
      
      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      
      .problem-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 12px;
        
        .problem-title-section {
          flex: 1;
          
          .problem-title {
            margin: 0 0 8px 0;
            font-size: 16px;
            font-weight: 600;
            color: #303133;
          }
          
          .problem-meta {
            display: flex;
            gap: 8px;
            align-items: center;
            
            .meta-text {
              font-size: 12px;
              color: #909399;
            }
          }
        }
        
        .problem-actions {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
        }
      }
      
      .problem-content {
        .content-section,
        .correction-section {
          margin-bottom: 12px;
          
          .section-label {
            font-size: 13px;
            font-weight: 600;
            color: #606266;
            margin-bottom: 6px;
          }
          
          .content-text,
          pre {
            background: #f5f7fa;
            padding: 12px;
            border-radius: 6px;
            font-size: 14px;
            line-height: 1.6;
            white-space: pre-wrap;
            word-wrap: break-word;
            margin: 0;
          }
        }
        
        .correction-section {
          .correction-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            padding: 8px 12px;
            background: #ecf5ff;
            border-radius: 6px;
            transition: background 0.3s;
            
            &:hover {
              background: #d9ecff;
            }
            
            .rotated {
              transform: rotate(180deg);
              transition: transform 0.3s;
            }
          }
          
          .correction-content {
            margin-top: 8px;
            pre {
              background: #fef0f0;
              border-left: 3px solid #f56c6c;
            }
          }
        }
        
        .review-info {
          font-size: 12px;
          color: #909399;
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px dashed #dcdfe6;
        }
      }
    }
    
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #909399;
      
      p {
        margin: 16px 0 24px;
        font-size: 16px;
      }
    }
  }
  
  .stats-content {
    .type-stats {
      display: flex;
      flex-direction: column;
      gap: 16px;
      
      .type-stat-item {
        display: flex;
        align-items: center;
        gap: 12px;
        
        .type-label {
          min-width: 100px;
        }
        
        .el-progress {
          flex: 1;
        }
        
        .type-count {
          min-width: 60px;
          text-align: right;
          font-size: 14px;
          color: #606266;
        }
      }
    }
  }
  
  .image-upload-area {
    margin-bottom: 20px;
    padding: 16px;
    background: #f5f7fa;
    border-radius: 8px;
    
    .image-preview-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 12px;
      margin-top: 16px;
      
      .preview-item {
        position: relative;
        aspect-ratio: 1;
        border-radius: 8px;
        overflow: hidden;
        border: 2px solid #dcdfe6;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .remove-btn {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 24px;
          height: 24px;
          padding: 0;
        }
      }
    }
  }
}
</style>

<template>
  <div class="ds-learning-page">
    <!-- 顶部面包屑和进度 -->
    <div class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <router-link to="/cs408">408计算机</router-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item>数据结构</el-breadcrumb-item>
      </el-breadcrumb>
      
      <div class="progress-info">
        <el-progress 
          :percentage="overallProgress" 
          :stroke-width="8"
          style="width: 200px; margin-right: 16px;"
        />
        <span class="progress-text">总进度: {{ overallProgress }}%</span>
        
        <el-divider direction="vertical" />
        
        <span v-if="currentChapter">
          当前: 第{{ currentChapter.number }}章 - {{ currentChapter.title }}
        </span>
      </div>
    </div>
    
    <!-- 主体内容区 -->
    <div class="page-content">
      <!-- 左侧：章节导航 -->
      <div class="nav-panel">
        <DSChapterNav />
      </div>
      
      <!-- 中间：思维导图 -->
      <div class="mindmap-panel">
        <MindMapView subject="datastructure" />
      </div>
      
      <!-- 右侧：知识点文档 -->
      <div class="knowledge-panel">
        <!-- 标签页切换 -->
        <el-tabs v-model="activePanel" class="knowledge-tabs">
          <el-tab-pane label="知识点" name="knowledge">
            <div class="knowledge-header">
              <h3 v-if="currentSection">
                {{ currentSection.id }} {{ currentSection.title }}
              </h3>
              <el-space>
                <el-button 
                  size="small" 
                  :type="isCurrentSectionStudied ? 'primary' : 'default'"
                  @click="toggleCurrentSection"
                >
                  {{ isCurrentSectionStudied ? '已学习 ✓' : '标记为已学习' }}
                </el-button>
              </el-space>
            </div>
            
            <div class="knowledge-content markdown-body" v-html="renderedMarkdown"></div>
          </el-tab-pane>
          
          <el-tab-pane label="错题本" name="wrong-problems">
            <DSWrongProblems ref="wrongProblemsRef" />
          </el-tab-pane>
          
          <el-tab-pane label="薄弱点分析" name="weak-points">
            <div class="weak-points-content">
              <div class="wp-header">
                <h3>数据结构薄弱点分析</h3>
                <p class="wp-subtitle">基于62道未掌握错题的统计分析</p>
              </div>
              
              <!-- 总体概览 -->
              <div class="wp-section">
                <h4> 总体分布</h4>
                <div class="wp-stats-grid">
                  <div class="wp-stat-card">
                    <div class="wp-stat-value">62</div>
                    <div class="wp-stat-label">未掌握题目</div>
                  </div>
                  <div class="wp-stat-card warning">
                    <div class="wp-stat-value">14</div>
                    <div class="wp-stat-label">概念不清 (22.6%)</div>
                  </div>
                  <div class="wp-stat-card danger">
                    <div class="wp-stat-value">8</div>
                    <div class="wp-stat-label">计算错误 (12.9%)</div>
                  </div>
                  <div class="wp-stat-card">
                    <div class="wp-stat-value">53</div>
                    <div class="wp-stat-label">重要度⭐5题目</div>
                  </div>
                </div>
              </div>
              
              <!-- 章节薄弱点 -->
              <div class="wp-section">
                <h4> 章节薄弱点排名</h4>
                <div class="wp-chapter-list">
                  <div class="wp-chapter-item critical">
                    <div class="wp-chapter-rank">1</div>
                    <div class="wp-chapter-info">
                      <div class="wp-chapter-name">第二章 线性表</div>
                      <div class="wp-chapter-detail">16题 (25.8%) · 2.2链式存储7题 · 2.3链表应用8题</div>
                    </div>
                    <div class="wp-chapter-bar">
                      <div class="wp-bar-fill" style="width: 100%"></div>
                    </div>
                  </div>
                  <div class="wp-chapter-item high">
                    <div class="wp-chapter-rank">2</div>
                    <div class="wp-chapter-info">
                      <div class="wp-chapter-name">第七章 查找</div>
                      <div class="wp-chapter-detail">11题 (17.7%) · 7.3树表查找6题 · 7.4 B树3题</div>
                    </div>
                    <div class="wp-chapter-bar">
                      <div class="wp-bar-fill" style="width: 69%"></div>
                    </div>
                  </div>
                  <div class="wp-chapter-item high">
                    <div class="wp-chapter-rank">3</div>
                    <div class="wp-chapter-info">
                      <div class="wp-chapter-name">第八章 排序</div>
                      <div class="wp-chapter-detail">11题 (17.7%) · 8.6算法比较4题 · 8.4选择排序3题</div>
                    </div>
                    <div class="wp-chapter-bar">
                      <div class="wp-bar-fill" style="width: 69%"></div>
                    </div>
                  </div>
                  <div class="wp-chapter-item medium">
                    <div class="wp-chapter-rank">4</div>
                    <div class="wp-chapter-info">
                      <div class="wp-chapter-name">第六章 图</div>
                      <div class="wp-chapter-detail">10题 (16.1%) · 6.4最短路径/关键路径8题</div>
                    </div>
                    <div class="wp-chapter-bar">
                      <div class="wp-bar-fill" style="width: 63%"></div>
                    </div>
                  </div>
                  <div class="wp-chapter-item medium">
                    <div class="wp-chapter-rank">5</div>
                    <div class="wp-chapter-info">
                      <div class="wp-chapter-name">第一章 绪论</div>
                      <div class="wp-chapter-detail">6题 (9.7%) · 1.2时间复杂度分析6题</div>
                    </div>
                    <div class="wp-chapter-bar">
                      <div class="wp-bar-fill" style="width: 38%"></div>
                    </div>
                  </div>
                  <div class="wp-chapter-item medium">
                    <div class="wp-chapter-rank">6</div>
                    <div class="wp-chapter-info">
                      <div class="wp-chapter-name">第三章 栈和队列</div>
                      <div class="wp-chapter-detail">6题 (9.7%) · 3.2顺序栈和链栈6题</div>
                    </div>
                    <div class="wp-chapter-bar">
                      <div class="wp-bar-fill" style="width: 38%"></div>
                    </div>
                  </div>
                  <div class="wp-chapter-item low">
                    <div class="wp-chapter-rank">7</div>
                    <div class="wp-chapter-info">
                      <div class="wp-chapter-name">第四章 串</div>
                      <div class="wp-chapter-detail">3题 (4.8%) · 4.2 KMP算法3题</div>
                    </div>
                    <div class="wp-chapter-bar">
                      <div class="wp-bar-fill" style="width: 19%"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 核心薄弱知识点 -->
              <div class="wp-section">
                <h4>🎯 核心薄弱知识点</h4>
                <div class="wp-topics">
                  <div class="wp-topic critical">
                    <div class="wp-topic-header">
                      <span class="wp-topic-tag">最薄弱</span>
                      <span class="wp-topic-title">循环链表操作</span>
                    </div>
                    <div class="wp-topic-content">
                      <p><strong>问题表现</strong>：地址连续性判断、头尾相接O(1)操作、删除首元素时尾指针更新</p>
                      <p><strong>错误类型</strong>：概念不清、思路错误</p>
                      <p><strong>建议</strong>：画图理解循环链表结构，重点练习尾指针维护和边界条件</p>
                    </div>
                  </div>
                  <div class="wp-topic critical">
                    <div class="wp-topic-header">
                      <span class="wp-topic-tag">最薄弱</span>
                      <span class="wp-topic-title">嵌套循环时间复杂度分析</span>
                    </div>
                    <div class="wp-topic-content">
                      <p><strong>问题表现</strong>：双层循环（外层指数增长/内层线性）、等差数列求和识别</p>
                      <p><strong>错误类型</strong>：计算错误</p>
                      <p><strong>建议</strong>：掌握"外层次数×内层次数"分析法，熟悉常见数列求和公式</p>
                    </div>
                  </div>
                  <div class="wp-topic high">
                    <div class="wp-topic-header">
                      <span class="wp-topic-tag">薄弱</span>
                      <span class="wp-topic-title">AVL树与红黑树性质</span>
                    </div>
                    <div class="wp-topic-content">
                      <p><strong>问题表现</strong>：平衡因子计算、旋转操作判断、红黑树五条性质记忆混乱</p>
                      <p><strong>错误类型</strong>：概念不清、细节记错</p>
                      <p><strong>建议</strong>：对比记忆AVL和红黑树的平衡条件，理解旋转的触发条件</p>
                    </div>
                  </div>
                  <div class="wp-topic high">
                    <div class="wp-topic-header">
                      <span class="wp-topic-tag">薄弱</span>
                      <span class="wp-topic-title">最短路径与关键路径</span>
                    </div>
                    <div class="wp-topic-content">
                      <p><strong>问题表现</strong>：Dijkstra执行过程、Floyd算法理解、AOE网关键路径计算</p>
                      <p><strong>错误类型</strong>：算法性质理解错误</p>
                      <p><strong>建议</strong>：手动模拟Dijkstra每轮迭代，理解贪心策略；掌握AOE网的ve/vl计算</p>
                    </div>
                  </div>
                  <div class="wp-topic medium">
                    <div class="wp-topic-header">
                      <span class="wp-topic-tag">注意</span>
                      <span class="wp-topic-title">堆排序与Top-K问题</span>
                    </div>
                    <div class="wp-topic-content">
                      <p><strong>问题表现</strong>：建堆过程、筛选调整、Top-K算法选择</p>
                      <p><strong>错误类型</strong>：算法理解错误</p>
                      <p><strong>建议</strong>：理解大顶堆/小顶堆的应用场景，掌握堆排序的完整流程</p>
                    </div>
                  </div>
                  <div class="wp-topic medium">
                    <div class="wp-topic-header">
                      <span class="wp-topic-tag">注意</span>
                      <span class="wp-topic-title">排序算法综合特性</span>
                    </div>
                    <div class="wp-topic-content">
                      <p><strong>问题表现</strong>：稳定性判断、空间复杂度、适用场景选择</p>
                      <p><strong>错误类型</strong>：概念不清</p>
                      <p><strong>建议</strong>：背诵综合对比表（见8.6节），理解各算法的核心思想</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 复习建议 -->
              <div class="wp-section">
                <h4>💡 复习建议</h4>
                <div class="wp-advice">
                  <div class="wp-advice-item">
                    <span class="wp-advice-priority">P0</span>
                    <span class="wp-advice-text">线性表（第2章）：重点突破循环链表操作，这是最大薄弱点</span>
                  </div>
                  <div class="wp-advice-item">
                    <span class="wp-advice-priority">P1</span>
                    <span class="wp-advice-text">查找算法（第7章）：AVL树性质、B树结构、哈希表冲突处理</span>
                  </div>
                  <div class="wp-advice-item">
                    <span class="wp-advice-priority">P1</span>
                    <span class="wp-advice-text">排序算法（第8章）：堆排序过程、算法综合对比表必背</span>
                  </div>
                  <div class="wp-advice-item">
                    <span class="wp-advice-priority">P2</span>
                    <span class="wp-advice-text">图算法（第6章）：Dijkstra手动模拟、关键路径计算</span>
                  </div>
                  <div class="wp-advice-item">
                    <span class="wp-advice-priority">P2</span>
                    <span class="wp-advice-text">时间复杂度（第1章）：嵌套循环分析、常见数列求和</span>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    
    <!-- 知识卡片 -->
    <KnowledgeCard ref="knowledgeCardRef" />
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, ref } from 'vue'
import { useDataStructureStore } from '@/stores/dataStructure'
import DSChapterNav from '@/components/DSChapterNav.vue'
import MindMapView from '@/components/MindMapView.vue'
import KnowledgeCard from '@/components/KnowledgeCard.vue'
import DSWrongProblems from '@/components/DSWrongProblems.vue'
import MarkdownIt from 'markdown-it'
import { ElMessage } from 'element-plus'

const dsStore = useDataStructureStore()

const currentChapter = computed(() => dsStore.currentChapter)
const currentSection = computed(() => dsStore.currentSection)
const overallProgress = computed(() => dsStore.overallProgress)

// 激活的面板：知识点 / 错题本
const activePanel = ref('knowledge')
const wrongProblemsRef = ref()

// 监听当前小节变化
watch(currentSection, (newSection) => {
  console.log('当前小节切换为:', newSection?.id, newSection?.title)
})

// 知识卡片引用
const knowledgeCardRef = ref()

// 扩展Markdown渲染器，添加点击事件
const highlightCode = (str: string, _lang: string): string => {
  const mdTemp = new MarkdownIt()
  return `<pre class="code-block"><code>${mdTemp.utils.escapeHtml(str)}</code></pre>`
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: highlightCode
})

// 渲染Markdown，并为关键词添加点击事件
const renderedMarkdown = computed(() => {
  if (!currentSection.value) {
    return '<p class="empty-tip">请选择一个知识点开始学习</p>'
  }
  
  let content = md.render(currentSection.value.content)
  
  // 线性表相关关键词
  const linearListKeywords = ['线性表', '顺序表', '链表', '单链表', '双链表']
  linearListKeywords.forEach(keyword => {
    const regex = new RegExp(keyword, 'g')
    content = content.replace(regex, `<span class="knowledge-link" onclick="window.showKnowledgeCard('linearlist')">${keyword}</span>`)
  })
  
  // 栈和队列相关关键词
  const stackQueueKeywords = ['栈', '队列', '循环队列', '双端队列']
  stackQueueKeywords.forEach(keyword => {
    const regex = new RegExp(keyword, 'g')
    content = content.replace(regex, `<span class="knowledge-link" onclick="window.showKnowledgeCard('stackqueue')">${keyword}</span>`)
  })
  
  // 树相关关键词
  const treeKeywords = ['二叉树', '哈夫曼树', '线索二叉树', '平衡二叉树']
  treeKeywords.forEach(keyword => {
    const regex = new RegExp(keyword, 'g')
    content = content.replace(regex, `<span class="knowledge-link" onclick="window.showKnowledgeCard('tree')">${keyword}</span>`)
  })
  
  // 图相关关键词
  const graphKeywords = ['图', '邻接矩阵', '邻接表', '最小生成树', '最短路径']
  graphKeywords.forEach(keyword => {
    const regex = new RegExp(keyword, 'g')
    content = content.replace(regex, `<span class="knowledge-link" onclick="window.showKnowledgeCard('graph')">${keyword}</span>`)
  })
  
  // 排序相关关键词
  const sortKeywords = ['快速排序', '归并排序', '堆排序', '冒泡排序']
  sortKeywords.forEach(keyword => {
    const regex = new RegExp(keyword, 'g')
    content = content.replace(regex, `<span class="knowledge-link" onclick="window.showKnowledgeCard('sort')">${keyword}</span>`)
  })
  
  return content
})

// 在window对象上注册方法，供Markdown中的onclick调用
onMounted(() => {
  ;(window as any).showKnowledgeCard = (cardId: string) => {
    knowledgeCardRef.value?.show(cardId)
  }
})

const isCurrentSectionStudied = computed(() => {
  if (!currentSection.value) return false
  return dsStore.studiedSections.has(currentSection.value.id)
})

function toggleCurrentSection() {
  if (currentSection.value) {
    dsStore.toggleSectionStudied(currentSection.value.id)
  }
}
</script>

<style scoped lang="scss">
.ds-learning-page {
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
  
  .page-header {
    padding: 16px 24px;
    background: #fff;
    border-bottom: 1px solid #e8e8e8;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    
    .ant-breadcrumb {
      margin-bottom: 12px;
    }
    
    .progress-info {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #595959;
      
      .progress-text {
        white-space: nowrap;
      }
    }
  }
  
  .page-content {
    flex: 1;
    display: flex;
    overflow: hidden;
    
    .nav-panel {
      width: 280px;
      min-width: 280px;
      overflow-y: auto;
      background: #fff;
    }
    
    .mindmap-panel {
      flex: 1;
      min-width: 400px;
      overflow: hidden;
    }
    
    .knowledge-panel {
      width: 45%;
      min-width: 400px;
      display: flex;
      flex-direction: column;
      background: #fff;
      border-left: 1px solid #e8e8e8;
      
      .knowledge-tabs {
        height: 100%;
        display: flex;
        flex-direction: column;
        
        :deep(.el-tabs__header) {
          margin: 0;
          padding: 0 20px;
          border-bottom: 1px solid #e8e8e8;
        }
        
        :deep(.el-tabs__nav-wrap::after) {
          display: none;
        }
        
        :deep(.el-tabs__item) {
          font-size: 15px;
          font-weight: 500;
          color: #606266;
          height: 48px;
          line-height: 48px;
          
          &.is-active {
            color: #16345c;
          }
        }
        
        :deep(.el-tabs__content) {
          flex: 1;
          overflow-y: auto;
          padding: 0;
        }
        
        :deep(.el-tab-pane) {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
      }
      
      .knowledge-header {
        padding: 16px 20px;
        border-bottom: 1px solid #e8e8e8;
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #262626;
        }
      }
      
      .knowledge-content {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        
        .empty-tip {
          text-align: center;
          color: #8c8c8c;
          font-size: 14px;
          margin-top: 100px;
        }
        
        :deep(h2) {
          font-size: 20px;
          color: #16345c;
          border-bottom: 2px solid #e8e8e8;
          padding-bottom: 8px;
          margin-top: 24px;
          
          &:first-child {
            margin-top: 0;
          }
        }
        
        :deep(h3) {
          font-size: 17px;
          color: #262626;
          margin-top: 20px;
        }
        
        :deep(h4) {
          font-size: 15px;
          color: #595959;
          margin-top: 16px;
        }
        
        :deep(p) {
          line-height: 1.8;
          color: #262626;
          margin: 12px 0;
          font-size: 15px;
        }
        
        :deep(ul), :deep(ol) {
          padding-left: 24px;
          line-height: 1.8;
          color: #262626;
          font-size: 15px;
        }
        
        :deep(li) {
          margin: 6px 0;
        }
        
        :deep(strong) {
          color: #262626;
          font-weight: 600;
        }
        
        :deep(code) {
          background: #f5f5f5;
          padding: 2px 6px;
          border-radius: 3px;
          font-family: 'Consolas', 'Monaco', monospace;
          font-size: 13px;
          color: #c41d7f;
        }
        
        :deep(pre) {
          background: #f5f5f5;
          padding: 16px;
          border-radius: 4px;
          overflow-x: auto;
          
          code {
            background: none;
            padding: 0;
            color: #262626;
          }
        }
        
        :deep(.code-block) {
          background: #282c34;
          color: #abb2bf;
          padding: 16px;
          border-radius: 4px;
          overflow-x: auto;
          
          code {
            color: inherit;
          }
        }
        
        :deep(blockquote) {
          border-left: 4px solid #ffc53d;
          padding-left: 16px;
          margin: 16px 0;
          color: #595959;
          background: #f0f5ff;
          padding: 12px 16px;
          border-radius: 0 4px 4px 0;
        }
        
        :deep(table) {
          width: 100%;
          border-collapse: collapse;
          margin: 16px 0;
          
          th, td {
            border: 1px solid #e8e8e8;
            padding: 8px 12px;
            text-align: left;
          }
          
          th {
            background: #fafafa;
            font-weight: 600;
          }
          
          tr:nth-child(even) {
            background: #fafafa;
          }
        }
        
        // 知识链接样式
        :deep(.knowledge-link) {
          color: #409eff;
          cursor: pointer;
          text-decoration: underline;
          font-weight: 600;
          transition: all 0.3s;
          
          &:hover {
            color: #409eff;
            background: #ecf5ff;
            padding: 2px 4px;
            border-radius: 3px;
          }
        }
      }
    }
  }
}

// 响应式布局
@media (max-width: 1400px) {
  .ds-learning-page {
    .page-content {
      .nav-panel {
        width: 240px;
        min-width: 240px;
      }
      
      .knowledge-panel {
        width: 40%;
        min-width: 350px;
      }
    }
  }
}

@media (max-width: 1200px) {
  .ds-learning-page {
    .page-content {
      .nav-panel {
        display: none;
      }
      
      .mindmap-panel {
        min-width: 300px;
      }
      
      .knowledge-panel {
        width: 50%;
        min-width: 300px;
      }
    }
  }
}

@media (max-width: 768px) {
  .ds-learning-page {
    /* 页头进度条：窄屏下允许换行，进度条独占一行，避免横向溢出 */
    .page-header {
      padding: 12px 16px;

      .progress-info {
        flex-wrap: wrap;
        gap: 8px 12px;

        :deep(.el-progress) {
          width: 100% !important;
          margin-right: 0 !important;
        }
      }
    }

    .page-content {
      flex-direction: column;
      /* 桌面端靠 overflow:hidden 固定三栏；移动端改为可滚动，避免堆叠后知识点被裁切、滑不到 */
      overflow-y: auto;

      .mindmap-panel {
        height: 40vh;
        flex: none; /* 不再弹性扩张挤占下方知识点面板 */
        min-width: unset;

        /* 内部导图容器桌面端 min-height:500px，会超出 40vh 面板被裁掉，这里强制贴合面板 */
        :deep(.mindmap-container) {
          height: 100%;
          min-height: 0;
          max-height: none;
        }
      }

      .knowledge-panel {
        width: 100%;
        min-width: unset;
        border-left: none;
        border-top: 1px solid #e8e8e8;
      }
    }
  }
}

/* ── 薄弱点分析样式 ─────────────────────── */
.weak-points-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  
  .wp-header {
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 2px solid #16345c;
    
    h3 {
      margin: 0 0 8px 0;
      font-size: 20px;
      color: #16345c;
      font-weight: 700;
    }
    
    .wp-subtitle {
      margin: 0;
      font-size: 13px;
      color: #8c8c8c;
    }
  }
  
  .wp-section {
    margin-bottom: 28px;
    
    h4 {
      margin: 0 0 16px 0;
      font-size: 16px;
      color: #262626;
      font-weight: 600;
      padding-left: 12px;
      border-left: 4px solid #d4a012;
    }
  }
  
  // 统计卡片网格
  .wp-stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    
    .wp-stat-card {
      background: #f5f7fa;
      border-radius: 10px;
      padding: 16px;
      text-align: center;
      border: 1px solid #e8e8e8;
      transition: all 0.3s;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }
      
      &.warning {
        background: #fff7e6;
        border-color: #ffd591;
      }
      
      &.danger {
        background: #fff1f0;
        border-color: #ffa39e;
      }
      
      .wp-stat-value {
        font-family: 'JetBrains Mono', 'Fira Code', monospace;
        font-size: 28px;
        font-weight: 700;
        color: #16345c;
        line-height: 1.2;
      }
      
      .wp-stat-label {
        font-size: 12px;
        color: #595959;
        margin-top: 6px;
      }
    }
  }
  
  // 章节排名列表
  .wp-chapter-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    
    .wp-chapter-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: #fff;
      border-radius: 10px;
      border: 1px solid #e8e8e8;
      transition: all 0.3s;
      
      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
      }
      
      &.critical {
        border-left: 4px solid #e74c3c;
        background: #fff5f5;
      }
      
      &.high {
        border-left: 4px solid #f39c12;
        background: #fffaf0;
      }
      
      &.medium {
        border-left: 4px solid #3498db;
        background: #f0f7ff;
      }
      
      &.low {
        border-left: 4px solid #27ae60;
        background: #f0fff4;
      }
      
      .wp-chapter-rank {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: #16345c;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        font-weight: 700;
        flex-shrink: 0;
      }
      
      .wp-chapter-info {
        flex: 1;
        min-width: 0;
        
        .wp-chapter-name {
          font-size: 14px;
          font-weight: 600;
          color: #262626;
        }
        
        .wp-chapter-detail {
          font-size: 12px;
          color: #8c8c8c;
          margin-top: 2px;
        }
      }
      
      .wp-chapter-bar {
        width: 80px;
        height: 6px;
        background: #f0f0f0;
        border-radius: 3px;
        overflow: hidden;
        flex-shrink: 0;
        
        .wp-bar-fill {
          height: 100%;
          border-radius: 3px;
          background: linear-gradient(90deg, #16345c, #1e4576);
          transition: width 0.6s ease;
        }
      }
    }
  }
  
  // 核心薄弱知识点
  .wp-topics {
    display: flex;
    flex-direction: column;
    gap: 12px;
    
    .wp-topic {
      background: #fff;
      border-radius: 10px;
      border: 1px solid #e8e8e8;
      overflow: hidden;
      transition: all 0.3s;
      
      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
      }
      
      &.critical {
        border-left: 4px solid #e74c3c;
      }
      
      &.high {
        border-left: 4px solid #f39c12;
      }
      
      &.medium {
        border-left: 4px solid #3498db;
      }
      
      .wp-topic-header {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 16px;
        background: #fafafa;
        border-bottom: 1px solid #f0f0f0;
        
        .wp-topic-tag {
          font-size: 11px;
          padding: 2px 8px;
          border-radius: 10px;
          font-weight: 600;
          color: #fff;
          
          .wp-topic.critical & {
            background: #e74c3c;
          }
          
          .wp-topic.high & {
            background: #f39c12;
          }
          
          .wp-topic.medium & {
            background: #3498db;
          }
        }
        
        .wp-topic-title {
          font-size: 14px;
          font-weight: 600;
          color: #262626;
        }
      }
      
      .wp-topic-content {
        padding: 12px 16px;
        
        p {
          margin: 6px 0;
          font-size: 13px;
          line-height: 1.6;
          color: #595959;
          
          strong {
            color: #262626;
          }
        }
      }
    }
  }
  
  // 复习建议
  .wp-advice {
    display: flex;
    flex-direction: column;
    gap: 10px;
    
    .wp-advice-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: #fff;
      border-radius: 8px;
      border: 1px solid #e8e8e8;
      
      .wp-advice-priority {
        font-family: 'JetBrains Mono', monospace;
        font-size: 12px;
        font-weight: 700;
        padding: 3px 8px;
        border-radius: 4px;
        color: #fff;
        flex-shrink: 0;
        
        .wp-advice-item:nth-child(1) & {
          background: #e74c3c;
        }
        
        .wp-advice-item:nth-child(2) &,
        .wp-advice-item:nth-child(3) & {
          background: #f39c12;
        }
        
        .wp-advice-item:nth-child(4) &,
        .wp-advice-item:nth-child(5) & {
          background: #3498db;
        }
      }
      
      .wp-advice-text {
        font-size: 13px;
        color: #262626;
        line-height: 1.5;
      }
    }
  }
}
</style>

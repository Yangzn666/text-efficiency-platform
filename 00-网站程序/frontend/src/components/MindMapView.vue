<template>
  <div class="mindmap-view">
    <div class="mindmap-header">
      <h3>{{ section ? `${section.id} ${section.title}` : chapter?.title }}</h3>
      <el-tag type="primary">{{ chapter?.score }}</el-tag>
      <el-tag v-if="chapter?.importance === 'high'" type="danger">重点章节</el-tag>
      <el-tag v-else-if="chapter?.importance === 'medium'" type="warning">重要章节</el-tag>
    </div>
    
    <div class="mindmap-container">
      <div v-show="loading" class="loading-state">
        <div class="loading-text">🔄 加载思维导图中...</div>
      </div>
      
      <div v-show="error && !loading" class="error-state">
        <el-alert 
          title="思维导图加载失败" 
          :description="error" 
          type="error" 
          :closable="false"
        />
      </div>
      
      <div v-show="!loading && !error" class="mermaid-container" ref="mermaidRef"></div>
      
      <!-- 控制按钮 -->
      <div class="control-buttons">
        <el-button size="small" @click="zoomIn" :icon="ZoomIn">放大</el-button>
        <el-button size="small" @click="zoomOut" :icon="ZoomOut">缩小</el-button>
        <el-button size="small" @click="resetZoom">重置</el-button>
        <el-button size="small" @click="toggleFullscreen" :icon="FullScreen">
          {{ isFullscreen ? '退出全屏' : '全屏' }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useCompositionStore } from '@/stores/composition'
import { useDataStructureStore } from '@/stores/dataStructure'
import { useNetworkStore } from '@/stores/network'
import { ZoomIn, ZoomOut, FullScreen } from '@element-plus/icons-vue'
// 异步加载mermaid，减小主包体积
import type Mermaid from 'mermaid'

const props = defineProps<{
  subject?: 'composition' | 'datastructure' | 'network'
}>()

const mermaidModule = ref<typeof Mermaid | null>(null)

// 根据subject参数选择对应的store
const compositionStore = useCompositionStore()
const dataStructureStore = useDataStructureStore()
const networkStore = useNetworkStore()

const activeStore = computed(() => {
  if (props.subject === 'datastructure') return dataStructureStore
  if (props.subject === 'network') return networkStore
  return compositionStore
})
const mermaidRef = ref<HTMLElement | null>(null)
const loading = ref(false)
const error = ref('')
const isFullscreen = ref(false)
const currentZoom = ref(1)

// 初始化mermaid
const initMermaid = async () => {
  if (!mermaidModule.value) {
    const module = await import('mermaid')
    mermaidModule.value = module.default
    module.default.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose'
    })
  }
  return mermaidModule.value
}

const currentChapterId = computed(() => activeStore.value.currentChapterId)
const currentSectionId = computed(() => activeStore.value.currentSectionId)
const chapters = computed(() => activeStore.value.chapters)
const chapter = computed(() => activeStore.value.currentChapter)
const section = computed(() => activeStore.value.currentSection)

// 防抖定时器
let renderTimer: ReturnType<typeof setTimeout> | null = null

// 直接使用小节的思维导图（写死在数据中）
const currentMindMap = computed(() => {
  // 优先使用小节的思维导图
  if (section.value?.mindMap) {
    console.log('显示小节思维导图:', section.value.id, section.value.title)
    return section.value.mindMap
  }
  // 如果没有小节思维导图，使用章节的
  console.log('显示章节思维导图:', chapter.value?.id, chapter.value?.title)
  return chapter.value?.mindMap || ''
})

// 初始化Mermaid（已移至initMermaid函数中异步加载）
// mermaid.initialize({ ... }) - 在 initMermaid 中调用

// 渲染思维导图
const renderMindMap = async () => {
  if (!currentMindMap.value || !mermaidRef.value) {
    if (mermaidRef.value) {
      error.value = '暂无思维导图数据'
    }
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    // 初始化mermaid（异步加载）
    const mermaidLib = await initMermaid()
    
    if (!mermaidLib) {
      throw new Error('mermaid库加载失败')
    }
    
    // 清空容器
    mermaidRef.value.innerHTML = ''
    
    // 生成唯一ID
    const id = `mindmap-${Date.now()}`
    
    // 渲染Mermaid
    const { svg } = await mermaidLib.render(id, currentMindMap.value)
    
    // 插入SVG
    mermaidRef.value.innerHTML = svg
    
    // 等待DOM更新后调整大小
    await nextTick()
    await nextTick()
    
    // 自动适配容器
    fitMindMapToContainer()
    
    loading.value = false
    console.log('思维导图渲染成功')
  } catch (err) {
    console.error('渲染失败:', err)
    error.value = '渲染失败: ' + (err as Error).message
    loading.value = false
  }
}

// 切换章节
const switchChapter = (chapterId: string) => {
  activeStore.value.currentChapterId = chapterId
}

// 自动适配容器
const fitMindMapToContainer = () => {
  if (!mermaidRef.value) return
  
  const svg = mermaidRef.value.querySelector('svg')
  if (!svg) return
  
  // 固定放大1.5倍，避免溢出
  const scale = 1.5
  currentZoom.value = scale
  svg.style.transform = `scale(${scale})`
  svg.style.transformOrigin = 'center center'
  
  // 居中显示
  svg.style.marginLeft = 'auto'
  svg.style.marginRight = 'auto'
  svg.style.display = 'block'
  
  // 使用更强的方式强制应用圆角到所有图形元素
  const applyRoundedCorners = () => {
    // 处理所有矩形
    const rects = svg.querySelectorAll('rect')
    rects.forEach(rect => {
      rect.setAttribute('rx', '20')
      rect.setAttribute('ry', '20')
      rect.setAttribute('style', 'rx: 20px; ry: 20px;')
    })
    
    // 处理所有多边形（转换为圆角矩形）
    const polygons = svg.querySelectorAll('polygon')
    polygons.forEach(polygon => {
      const bbox = polygon.getBBox()
      if (bbox.width > 0 && bbox.height > 0) {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
        rect.setAttribute('x', bbox.x.toString())
        rect.setAttribute('y', bbox.y.toString())
        rect.setAttribute('width', bbox.width.toString())
        rect.setAttribute('height', bbox.height.toString())
        rect.setAttribute('rx', '20')
        rect.setAttribute('ry', '20')
        rect.setAttribute('fill', polygon.getAttribute('fill') || '#ffffff')
        rect.setAttribute('stroke', polygon.getAttribute('stroke') || 'none')
        rect.setAttribute('stroke-width', polygon.getAttribute('stroke-width') || '0')
        polygon.parentNode?.replaceChild(rect, polygon)
      }
    })
    
    // 处理所有路径
    const paths = svg.querySelectorAll('path')
    paths.forEach(path => {
      const d = path.getAttribute('d')
      if (d && d.includes('L') && !d.includes('M') && !d.includes('C')) {
        // 这是一个矩形路径，替换为圆角矩形
        const bbox = path.getBBox()
        if (bbox.width > 0 && bbox.height > 0) {
          const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
          rect.setAttribute('x', bbox.x.toString())
          rect.setAttribute('y', bbox.y.toString())
          rect.setAttribute('width', bbox.width.toString())
          rect.setAttribute('height', bbox.height.toString())
          rect.setAttribute('rx', '20')
          rect.setAttribute('ry', '20')
          rect.setAttribute('fill', path.getAttribute('fill') || '#ffffff')
          rect.setAttribute('stroke', path.getAttribute('stroke') || 'none')
          rect.setAttribute('stroke-width', path.getAttribute('stroke-width') || '0')
          path.parentNode?.replaceChild(rect, path)
        }
      }
    })
  }
  
  // 立即应用
  setTimeout(() => {
    applyRoundedCorners()
  }, 100)
  
  // 监听 DOM 变化，持续应用圆角
  const observer = new MutationObserver(() => {
    setTimeout(() => {
      applyRoundedCorners()
    }, 50)
  })
  
  observer.observe(svg, {
    childList: true,
    subtree: true,
    attributes: true
  })
  
  console.log('固定放大1.5倍并强制应用圆角到所有图形')
}

// 缩放功能
const zoomIn = () => {
  currentZoom.value = Math.min(currentZoom.value + 0.2, 3)
  applyZoom()
}

const zoomOut = () => {
  currentZoom.value = Math.max(currentZoom.value - 0.2, 0.3)
  applyZoom()
}

const resetZoom = () => {
  // 重置时重新自动适配
  fitMindMapToContainer()
}

const applyZoom = () => {
  if (mermaidRef.value) {
    const svg = mermaidRef.value.querySelector('svg')
    if (svg) {
      svg.style.transform = `scale(${currentZoom.value})`
      svg.style.transformOrigin = 'top left'
    }
  }
}

// 全屏功能
const toggleFullscreen = () => {
  const svg = mermaidRef.value?.querySelector('svg')
  if (!document.fullscreenElement && svg) {
    svg.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

// 监听全屏变化
document.addEventListener('fullscreenchange', () => {
  isFullscreen.value = !!document.fullscreenElement
})

// 监听章节和小节变化（添加防抖）
watch([currentChapterId, currentSectionId], async ([newChapterId, newSectionId]) => {
  // 清除之前的定时器
  if (renderTimer) {
    clearTimeout(renderTimer)
  }
  
  // 防抖：等待50ms，确保两个值都更新完成后再渲染
  renderTimer = setTimeout(async () => {
    console.log(`防抖后渲染: chapter=${newChapterId}, section=${newSectionId}`)
    await renderMindMap()
  }, 50)
})

// 组件挂载时渲染
onMounted(async () => {
  await renderMindMap()
})
</script>

<style scoped lang="scss">
.mindmap-view {
  padding: 20px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  .mindmap-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 2px solid #e4e7ed;
    
    h3 {
      margin: 0;
      color: #303133;
      font-size: 20px;
    }
  }
  
  .mindmap-container {
    height: 70vh;
    min-height: 500px;
    max-height: 800px;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    overflow: hidden;
    background: #fafafa;
    display: flex;
    flex-direction: column;
    
    .loading-state,
    .error-state {
      padding: 60px 20px;
      text-align: center;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .loading-text {
      color: #409eff;
      font-size: 16px;
    }
    
    .mermaid-container {
      flex: 1;
      min-height: 0;
      padding: 20px;
      overflow: auto;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      
      :deep(svg) {
        max-width: 100%;
        height: auto;
        background: #ffffff;
        
        // 强制所有矩形节点圆角
        rect,
        [class*="node"] rect,
        .cluster rect,
        .node rect,
        .default rect,
        .primary rect,
        .secondary rect,
        .tertiary rect {
          rx: 20px !important;
          ry: 20px !important;
        }
      }
    }
    
    .control-buttons {
      padding: 12px 20px;
      background: #ffffff;
      border-top: 1px solid #e4e7ed;
      display: flex;
      gap: 8px;
      justify-content: center;
      flex-shrink: 0;
    }
  }
}
</style>

<style lang="scss">
/* 全屏模式样式 */
.mindmap-container:fullscreen {
  background: #ffffff;
  display: flex;
  flex-direction: column;
  
  .mermaid-container {
    flex: 1;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    
    svg {
      max-width: 100%;
      max-height: 100%;
      background: #ffffff;
    }
  }
  
  .control-buttons {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(255, 255, 255, 0.95);
    padding: 12px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 9999;
  }
}
</style>

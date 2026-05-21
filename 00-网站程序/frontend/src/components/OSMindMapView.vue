<template>
  <div class="os-mindmap-view">
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
import { useOperatingSystemStore } from '@/stores/operatingSystem'
import { ZoomIn, ZoomOut, FullScreen } from '@element-plus/icons-vue'
import type Mermaid from 'mermaid'

const mermaidModule = ref<typeof Mermaid | null>(null)

const osStore = useOperatingSystemStore()
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

const currentChapterId = computed(() => osStore.currentChapterId)
const currentSectionId = computed(() => osStore.currentSectionId)
const chapters = computed(() => osStore.chapters)
const chapter = computed(() => osStore.currentChapter)
const section = computed(() => osStore.currentSection)

// 防抖定时器
let renderTimer: ReturnType<typeof setTimeout> | null = null

// 直接使用小节的思维导图
const currentMindMap = computed(() => {
  // 优先使用小节的思维导图
  if (section.value?.mindMap) {
    return section.value.mindMap
  }
  // 否则使用章节的思维导图
  return chapter.value?.mindMap || ''
})

// 渲染思维导图
const renderMindMap = async () => {
  if (!mermaidRef.value || !currentMindMap.value) {
    console.log('没有可渲染的内容')
    return
  }

  loading.value = true
  error.value = ''

  try {
    const mermaid = await initMermaid()
    
    await nextTick()
    
    const id = `mermaid-${Date.now()}`
    const { svg } = await mermaid.render(id, currentMindMap.value)
    
    if (mermaidRef.value) {
      mermaidRef.value.innerHTML = svg
      
      // 应用缩放
      const svgElement = mermaidRef.value.querySelector('svg')
      if (svgElement) {
        // 强制设置SVG背景为白色
        svgElement.style.background = '#ffffff'
        svgElement.style.transform = `scale(${currentZoom.value})`
        svgElement.style.transformOrigin = 'top left'
      }
    }
  } catch (err) {
    console.error('渲染思维导图失败:', err)
    error.value = err instanceof Error ? err.message : '未知错误'
  } finally {
    loading.value = false
  }
}

// 监听章节和小节变化
watch([currentChapterId, currentSectionId], () => {
  if (renderTimer) {
    clearTimeout(renderTimer)
  }
  renderTimer = setTimeout(() => {
    renderMindMap()
  }, 300)
}, { immediate: true })

// 缩放控制
const zoomIn = () => {
  currentZoom.value = Math.min(currentZoom.value + 0.2, 3)
  applyZoom()
}

const zoomOut = () => {
  currentZoom.value = Math.max(currentZoom.value - 0.2, 0.5)
  applyZoom()
}

const resetZoom = () => {
  currentZoom.value = 1
  applyZoom()
}

const applyZoom = () => {
  const svgElement = mermaidRef.value?.querySelector('svg')
  if (svgElement) {
    svgElement.style.transform = `scale(${currentZoom.value})`
    svgElement.style.transformOrigin = 'top left'
  }
}

// 全屏切换
const toggleFullscreen = () => {
  const svg = mermaidRef.value?.querySelector('svg')
  if (!document.fullscreenElement && svg) {
    // 强制设置SVG背景为白色
    svg.style.background = '#ffffff'
    svg.style.setProperty('background', '#ffffff', 'important')
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
  
  // 全屏时强制设置背景为白色
  if (document.fullscreenElement) {
    const svg = document.fullscreenElement.querySelector('svg')
    if (svg) {
      svg.style.background = '#ffffff'
    }
  }
})

onMounted(() => {
  renderMindMap()
})
</script>

<style scoped lang="scss">
.os-mindmap-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  
  .mindmap-header {
    padding: 16px 20px;
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    align-items: center;
    gap: 12px;
    
    h3 {
      margin: 0;
      font-size: 16px;
      color: #303133;
      flex: 1;
    }
  }
  
  .mindmap-container {
    flex: 1;
    position: relative;
    overflow: auto;
    padding: 20px;
    background: #fafafa;
    
    .loading-state,
    .error-state {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }
    
    .loading-text {
      font-size: 16px;
      color: #909399;
    }
    
    .mermaid-container {
      width: 100%;
      min-height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
      
      :deep(svg) {
        max-width: 100%;
        height: auto;
      }
    }
    
    .control-buttons {
      position: absolute;
      bottom: 20px;
      right: 20px;
      display: flex;
      gap: 8px;
      background: rgba(255, 255, 255, 0.9);
      padding: 8px;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    }
  }
}

/* 全屏时确保白色背景 */
:fullscreen,
:-webkit-full-screen,
:-moz-full-screen {
  background: #ffffff !important;
}
</style>

<style lang="scss">
/* 全屏模式样式 - 对SVG元素应用 */
svg:fullscreen,
svg:-webkit-full-screen,
svg:-moz-full-screen {
  background: #ffffff !important;
  width: 100vw !important;
  height: 100vh !important;
}

/* 全屏时容器的样式 */
.os-mindmap-view .mindmap-container:fullscreen,
.mindmap-container:-webkit-full-screen,
.mindmap-container:-moz-full-screen {
  background: #ffffff !important;
  display: flex;
  flex-direction: column;
  width: 100vw !important;
  height: 100vh !important;
  
  .mermaid-container {
    flex: 1;
    background: #ffffff !important;
    display: flex;
    align-items: center;
    justify-content: center;
    
    svg {
      max-width: 100%;
      max-height: 100%;
      background: #ffffff !important;
    }
  }
  
  .control-buttons {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(255, 255, 255, 0.95) !important;
    padding: 12px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 9999;
  }
}
</style>

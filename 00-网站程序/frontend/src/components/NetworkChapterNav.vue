<template>
  <div class="network-chapter-nav">
    <el-tree
      :data="treeData"
      :props="{ children: 'children', label: 'title' }"
      :default-expanded-keys="expandedKeys"
      :highlight-current="true"
      node-key="key"
      @node-click="handleNodeClick"
    >
      <template #default="{ node, data }">
        <div class="tree-node-content">
          <span class="node-title">{{ node.label }}</span>
          <el-tag 
            v-if="isSectionStudied(data.key)" 
            size="small" 
            type="success"
            class="studied-tag"
          >
            ✓
          </el-tag>
        </div>
      </template>
    </el-tree>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useNetworkStore } from '@/stores/network'

const networkStore = useNetworkStore()

const currentSectionId = computed(() => networkStore.currentSectionId)
const studiedSections = computed(() => networkStore.studiedSections)

// 展开的节点（默认展开所有章节）
const expandedKeys = ref<string[]>(
  networkStore.chapters.map(ch => ch.id)
)

// 构建树形数据
const treeData = computed(() => {
  return networkStore.chapters.map(chapter => ({
    key: chapter.id,
    title: `第${chapter.number}章 ${chapter.title}`,
    children: chapter.sections.map(section => ({
      key: section.id,
      title: `${section.id} ${section.title}`,
      isLeaf: true
    }))
  }))
})

// 判断小节是否已学习
const isSectionStudied = (key: string) => {
  return studiedSections.value.has(key)
}

// 处理节点点击
const handleNodeClick = (data: any) => {
  if (data.isLeaf) {
    // 点击的是小节
    networkStore.selectSection(data.key)
  } else {
    // 点击的是章节
    networkStore.selectChapter(data.key)
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.network-chapter-nav {
  height: 100%;
  overflow-y: auto;
  padding: 12px;
  
  // 美化滚动条
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
    
    &:hover {
      background: #a8a8a8;
    }
  }
  
  :deep(.el-tree) {
    background: transparent;
    
    .el-tree-node__content {
      height: 32px;
      padding: 4px 0;
      border-radius: 6px;
      transition: all 0.2s;
      
      &:hover {
        background: rgba(13, 33, 55, 0.08);
      }
    }
    
    .el-tree-node.is-current > .el-tree-node__content {
      background: linear-gradient(90deg, rgba(13, 33, 55, 0.15) 0%, rgba(30, 69, 118, 0.15) 100%);
      color: $primary-color;
      font-weight: 600;
    }
  }
  
  .tree-node-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding-right: 8px;
    
    .node-title {
      flex: 1;
      font-size: 13px;
      line-height: 1.5;
    }
    
    .studied-tag {
      margin-left: 8px;
      padding: 0 6px;
      height: 18px;
      line-height: 16px;
      font-size: 11px;
    }
  }
}
</style>

<template>
  <div class="ds-chapter-nav">
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
import { useDataStructureStore } from '@/stores/dataStructure'

const dsStore = useDataStructureStore()

const studiedSections = computed(() => dsStore.studiedSections)

// 展开的节点（默认展开所有章节）
const expandedKeys = ref<string[]>(
  dsStore.chapters.map((ch: any) => ch.id)
)

// 构建树形数据
const treeData = computed(() => {
  return dsStore.chapters.map((chapter: any) => ({
    key: chapter.id,
    title: `第${chapter.number}章 ${chapter.title}`,
    children: chapter.sections.map((section: any) => ({
      key: section.id,
      title: `${section.id} ${section.title}`,
      isLeaf: true
    }))
  }))
})

// 判断小节是否已学习
function isSectionStudied(sectionId: string): boolean {
  return studiedSections.value.has(sectionId)
}

// 处理节点点击
function handleNodeClick(data: any) {
  console.log('点击节点:', data.key, data)
  
  // 判断是章节还是小节
  if (data.key.includes('.')) {
    // 是小节
    console.log('切换到小节:', data.key)
    dsStore.selectSection(data.key)
  } else {
    // 是章节，切换到该章节的第一小节
    console.log('切换到章节:', data.key)
    dsStore.selectChapter(data.key)
  }
}
</script>

<style scoped lang="scss">
.ds-chapter-nav {
  height: 100%;
  overflow-y: auto;
  padding: 16px;
  background: #fff;
  border-right: 1px solid #e8e8e8;
  
  :deep(.el-tree) {
    .el-tree-node__content {
      height: 32px;
      
      &:hover {
        background-color: #f5f7fa;
      }
    }
    
    .el-tree-node.is-current > .el-tree-node__content {
      background-color: #e6f7ff;
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
      font-size: 14px;
    }
    
    .studied-tag {
      margin-left: 8px;
      padding: 0 4px;
      font-size: 12px;
    }
  }
}
</style>

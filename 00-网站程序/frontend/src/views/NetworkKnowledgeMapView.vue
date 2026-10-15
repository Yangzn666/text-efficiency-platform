<template>
  <div class="network-map-page">
    <!-- 顶栏：返回 + 面包屑 -->
    <div class="map-page-header">
      <router-link to="/cs408/network" class="back-link">
        <el-icon><ArrowLeft /></el-icon>
        返回计算机网络
      </router-link>
      <el-breadcrumb separator="/" class="map-breadcrumb">
        <el-breadcrumb-item>
          <router-link to="/cs408">408计算机</router-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <router-link to="/cs408/network">计算机网络</router-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item>知识体系地图</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 全屏知识体系地图 -->
    <div class="map-page-body">
      <NetworkKnowledgeMap />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from '@element-plus/icons-vue'
import NetworkKnowledgeMap from '@/components/NetworkKnowledgeMap.vue'
</script>

<style scoped lang="scss">
.network-map-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #eef2f7;

  .map-page-header {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 14px 24px;
    background: #fff;
    border-bottom: 1px solid #e4e7ed;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 14px;
      font-weight: 600;
      color: #16345c;
      text-decoration: none;
      cursor: pointer;

      &:hover {
        opacity: 0.75;
        text-decoration: underline;
      }
    }

    .map-breadcrumb {
      font-size: 14px;
    }
  }

  .map-page-body {
    flex: 1;
    min-height: 0;
    padding: 12px;

    > * {
      height: 100%;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    }
  }
}
</style>

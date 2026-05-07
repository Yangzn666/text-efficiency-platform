<template>
  <div class="study-progress-report">
    <div class="report-header">
      <h2 class="report-title">📊 语法学习情况报告</h2>
      <p class="report-subtitle">记录学习进度，追踪学习效果</p>
    </div>

    <!-- 报告列表 -->
    <div class="reports-container">
      <!-- Day 1-2 报告 -->
      <div class="report-card" v-if="day1Day2Report">
        <div class="report-card-header">
          <div class="report-info">
            <h3>📝 Day 1 & Day 2 学习情况报告</h3>
            <p class="report-date">学习日期：2026-05-06</p>
          </div>
          <el-tag type="success" size="large">✅ 已完成</el-tag>
        </div>
        
        <div class="report-content">
          <!-- 学习内容概览 -->
          <div class="content-section">
            <h4>📚 学习内容</h4>
            <div class="content-grid">
              <div class="content-item">
                <div class="item-icon">1️⃣</div>
                <div class="item-details">
                  <h5>Day 1: 长难句分析方法论</h5>
                  <p>四步法：找主干→找并列→找从句→去修饰</p>
                  <span class="duration">⏱️ 约2小时</span>
                </div>
              </div>
              <div class="content-item">
                <div class="item-icon">2️⃣</div>
                <div class="item-details">
                  <h5>Day 2: 虚拟语气三种形式</h5>
                  <p>与现在/过去/将来事实相反</p>
                  <span class="duration">⏱️ 约2小时</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 学习成果 -->
          <div class="content-section">
            <h4>✅ 学习成果</h4>
            <ul class="achievement-list">
              <li>✅ 掌握长难句四步法，能够初步分析复杂句子</li>
              <li>✅ 理解虚拟语气三种形式，建立系统知识框架</li>
              <li>✅ 学会使用AI辅助学习，提高效率</li>
              <li>✅ 整理清晰笔记，为后续复习打基础</li>
            </ul>
          </div>

          <!-- 学习评估 -->
          <div class="content-section">
            <h4>📈 学习评估</h4>
            <div class="evaluation-grid">
              <div class="eval-item">
                <div class="eval-label">理解程度</div>
                <el-rate v-model="evaluations.comprehension" disabled show-score text-color="#ff9900" />
              </div>
              <div class="eval-item">
                <div class="eval-label">应用能力</div>
                <el-rate v-model="evaluations.application" disabled show-score text-color="#ff9900" />
              </div>
              <div class="eval-item">
                <div class="eval-label">学习专注度</div>
                <el-rate v-model="evaluations.focus" disabled show-score text-color="#ff9900" />
              </div>
              <div class="eval-item">
                <div class="eval-label">笔记质量</div>
                <el-rate v-model="evaluations.notes" disabled show-score text-color="#ff9900" />
              </div>
            </div>
          </div>

          <!-- 统计数据 -->
          <div class="content-section">
            <h4>📊 学习数据</h4>
            <div class="stats-grid">
              <div class="stat-box">
                <div class="stat-value">4小时</div>
                <div class="stat-label">总学习时长</div>
              </div>
              <div class="stat-box">
                <div class="stat-value">11个</div>
                <div class="stat-label">分析例句</div>
              </div>
              <div class="stat-box">
                <div class="stat-value">15道</div>
                <div class="stat-label">完成练习</div>
              </div>
              <div class="stat-box">
                <div class="stat-value">4次</div>
                <div class="stat-label">AI模板使用</div>
              </div>
            </div>
          </div>

          <!-- 下一步计划 -->
          <div class="content-section">
            <h4>🎯 下一步计划</h4>
            <div class="next-steps">
              <div class="step-item today">
                <div class="step-badge">今日任务</div>
                <h5>Day 3: 非谓语动词</h5>
                <p>不定式/动名词/分词概念辨析 + 对比表格 + 15道练习</p>
              </div>
              <div class="upcoming-tasks">
                <p><strong>本周剩余：</strong></p>
                <ul>
                  <li>Day 4: 倒装句规则</li>
                  <li>Day 5: 独立主格结构</li>
                  <li>Day 6: 定语从句进阶</li>
                  <li>Day 7: 状语从句+插入语</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- 完整报告链接 -->
          <div class="content-section">
            <el-button type="primary" size="large" @click="viewFullReport">
              <el-icon><Document /></el-icon>
              查看完整报告文档
            </el-button>
          </div>
        </div>
      </div>

      <!-- 暂无更多报告提示 -->
      <div v-if="!day1Day2Report" class="empty-state">
        <el-icon size="80" color="#ddd"><Document /></el-icon>
        <h3>暂无学习报告</h3>
        <p>完成学习任务后会自动生成学习情况报告</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Document } from '@element-plus/icons-vue'

// 学习报告数据
const day1Day2Report = ref(true)

// 学习评估评分
const evaluations = ref({
  comprehension: 4,  // 理解程度
  application: 3,    // 应用能力
  focus: 5,          // 学习专注度
  notes: 4           // 笔记质量
})

// 查看完整报告
const viewFullReport = () => {
  // 打开本地文件
  const reportPath = 'd:\\学习\\效率\\02-英语一\\04-备考指南\\复习计划\\Day1-Day2学习情况报告-20260506.md'
  
  // 尝试使用系统默认应用打开
  window.open(`file:///${reportPath.replace(/\\/g, '/')}`)
  
  // 如果浏览器阻止，提示用户手动打开
  setTimeout(() => {
    alert('如果浏览器未自动打开，请手动打开文件：\n\n' + reportPath)
  }, 500)
}

onMounted(() => {
  console.log('📊 学习情况报告组件已加载')
})
</script>

<style scoped>
.study-progress-report {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.report-header {
  text-align: center;
  margin-bottom: 30px;
}

.report-title {
  font-size: 2em;
  color: #333;
  margin-bottom: 10px;
}

.report-subtitle {
  color: #666;
  font-size: 1.1em;
}

.reports-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.report-card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.report-card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.report-info h3 {
  margin: 0 0 8px 0;
  font-size: 1.4em;
}

.report-date {
  margin: 0;
  opacity: 0.9;
  font-size: 0.95em;
}

.report-content {
  padding: 30px;
}

.content-section {
  margin-bottom: 30px;
}

.content-section:last-child {
  margin-bottom: 0;
}

.content-section h4 {
  font-size: 1.3em;
  color: #333;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #667eea;
}

/* 学习内容网格 */
.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 15px;
}

.content-item {
  display: flex;
  gap: 15px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.content-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.item-icon {
  font-size: 2em;
  flex-shrink: 0;
}

.item-details h5 {
  margin: 0 0 8px 0;
  font-size: 1.1em;
  color: #333;
}

.item-details p {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 0.95em;
}

.duration {
  color: #2196F3;
  font-weight: 600;
  font-size: 0.9em;
}

/* 成就列表 */
.achievement-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.achievement-list li {
  padding: 10px 15px;
  margin-bottom: 8px;
  background: #e8f5e9;
  border-left: 4px solid #4CAF50;
  border-radius: 6px;
  color: #2e7d32;
  font-size: 0.95em;
}

/* 评估网格 */
.evaluation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.eval-item {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
  text-align: center;
}

.eval-label {
  font-size: 0.9em;
  color: #666;
  margin-bottom: 10px;
}

/* 统计网格 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.stat-box {
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 10px;
  text-align: center;
}

.stat-value {
  font-size: 2em;
  font-weight: bold;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 0.9em;
  opacity: 0.9;
}

/* 下一步计划 */
.next-steps {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.step-item {
  padding: 20px;
  background: #fff3e0;
  border-left: 4px solid #FF9800;
  border-radius: 10px;
}

.step-item.today {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.2);
}

.step-badge {
  display: inline-block;
  padding: 4px 12px;
  background: #FF9800;
  color: white;
  border-radius: 12px;
  font-size: 0.85em;
  font-weight: 600;
  margin-bottom: 10px;
}

.step-item h5 {
  margin: 0 0 8px 0;
  font-size: 1.1em;
  color: #333;
}

.step-item p {
  margin: 0;
  color: #666;
  font-size: 0.95em;
}

.upcoming-tasks {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
}

.upcoming-tasks p {
  margin: 0 0 10px 0;
  color: #333;
}

.upcoming-tasks ul {
  margin: 0;
  padding-left: 20px;
  color: #666;
}

.upcoming-tasks li {
  margin-bottom: 5px;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-state h3 {
  margin: 20px 0 10px;
  color: #666;
}

.empty-state p {
  margin: 0;
  font-size: 0.95em;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .study-progress-report {
    padding: 15px;
  }
  
  .report-title {
    font-size: 1.6em;
  }
  
  .report-card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .content-grid,
  .evaluation-grid,
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .report-content {
    padding: 20px;
  }
}
</style>

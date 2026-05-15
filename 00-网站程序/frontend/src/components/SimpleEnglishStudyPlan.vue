<template>
  <div class="simple-study-plan">
    <h2>📘 英语一考研学习计划</h2>
    <p>系统化学习路径，科学规划备考进度</p>
    
    <div class="plan-content">
      <h3>三大阶段</h3>
      <ol>
        <li><strong>基础阶段</strong> (开始—6月)：词汇、语法、长难句、阅读精读</li>
        <li><strong>暑期强化阶段</strong> (7月—9月)：五大题型强化训练</li>
        <li><strong>冲刺模拟阶段</strong> (10月—考前)：真题演练和写作带练</li>
      </ol>
      
      <div class="progress-section">
        <h4>学习进度追踪</h4>
        <div class="progress-item">
          <label>基础阶段进度：</label>
          <input type="range" min="0" max="100" v-model="fundamentalProgress">
          <span>{{ fundamentalProgress }}%</span>
        </div>
        <div class="progress-item">
          <label>暑期强化进度：</label>
          <input type="range" min="0" max="100" v-model="summerProgress">
          <span>{{ summerProgress }}%</span>
        </div>
        <div class="progress-item">
          <label>冲刺阶段进度：</label>
          <input type="range" min="0" max="100" v-model="finalProgress">
          <span>{{ finalProgress }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const fundamentalProgress = ref(0)
const summerProgress = ref(0)
const finalProgress = ref(0)
</script>

<style scoped>
.simple-study-plan {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.simple-study-plan h2 {
  color: #333;
  text-align: center;
  margin-bottom: 10px;
}

.simple-study-plan p {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
}

.plan-content h3 {
  color: #333;
  margin: 25px 0 15px 0;
}

.plan-content ol {
  padding-left: 20px;
}

.plan-content li {
  margin-bottom: 10px;
  line-height: 1.5;
}

.progress-section {
  margin-top: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
}

.progress-section h4 {
  margin: 0 0 20px 0;
  color: #333;
}

.progress-item {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.progress-item label {
  min-width: 120px;
  font-weight: 500;
}

.progress-item input[type="range"] {
  flex: 1;
  height: 8px;
  border-radius: 4px;
  background: #ddd;
  outline: none;
}

.progress-item span {
  min-width: 50px;
  font-weight: 500;
  color: #666;
}
</style>
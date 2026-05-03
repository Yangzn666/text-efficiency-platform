const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3001

// 中间件配置
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, '../frontend/dist')))

// 路由
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '个人考研效率平台后端服务运行正常' })
})

// 基础路由示例
app.get('/api/stats/today', (req, res) => {
  res.json({
    studyTime: '2h 30min',
    completedTasks: 18,
    totalTasks: 24,
    subjects: {
      '408': { progress: 75, time: '1h 15min' },
      '数学一': { progress: 68, time: '45min' },
      '英语一': { progress: 82, time: '30min' },
      '政治': { progress: 55, time: '40min' }
    }
  })
})

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
})

app.listen(PORT, () => {
  console.log(`个人考研效率平台后端服务启动成功，端口：${PORT}`)
})
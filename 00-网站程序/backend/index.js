const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')

const app = express()
const PORT = process.env.PORT || 3001

// 中间件配置
app.use(cors())
app.use(express.json())

// 导入路由
const readingQuestionsRouter = require('./routes/reading-questions')

// 注册API路由（必须在static之前）
app.use('/api/reading-questions', readingQuestionsRouter)

// 获取精读分析数据
app.get('/api/intensive-reading', (req, res) => {
  try {
    const key = req.query.key
    if (!key) {
      return res.status(400).json({ error: '请提供key参数' })
    }
    
    const dataPath = path.join(__dirname, 'data/intensive-reading-analysis.json')
    
    if (!fs.existsSync(dataPath)) {
      return res.status(404).json({ error: '精读数据文件不存在' })
    }
    
    const data = fs.readFileSync(dataPath, 'utf-8')
    const intensiveReadingData = JSON.parse(data)
    
    const readingData = intensiveReadingData[key]
    
    if (readingData) {
      res.json({
        success: true,
        intensiveReading: readingData
      })
    } else {
      res.status(404).json({ 
        error: '未找到该文章的分析数据',
        key: key 
      })
    }
  } catch (error) {
    console.error('读取精读数据失败:', error)
    res.status(500).json({ error: '读取数据失败' })
  }
})

// 静态文件服务
app.use(express.static(path.join(__dirname, '../frontend/dist')))

// 路由
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '个人考研效率平台后端服务运行正常' })
})

// 获取学习记录数据
app.get('/api/study-data', (req, res) => {
  try {
    const dataPath = path.join(__dirname, '../study-data/study-records.json')
    
    // 检查文件是否存在
    if (!fs.existsSync(dataPath)) {
      return res.status(404).json({ error: '数据文件不存在' })
    }
    
    // 读取JSON文件
    const data = fs.readFileSync(dataPath, 'utf-8')
    const studyData = JSON.parse(data)
    
    res.json({
      success: true,
      data: studyData
    })
  } catch (error) {
    console.error('读取学习数据失败:', error)
    res.status(500).json({ error: '读取数据失败' })
  }
})

// 保存学习记录数据
app.post('/api/study-data', (req, res) => {
  try {
    const dataPath = path.join(__dirname, '../study-data/study-records.json')
    const newData = req.body
    
    // 写入JSON文件
    fs.writeFileSync(dataPath, JSON.stringify(newData, null, 2), 'utf-8')
    
    res.json({
      success: true,
      message: '数据保存成功'
    })
  } catch (error) {
    console.error('保存学习数据失败:', error)
    res.status(500).json({ error: '保存数据失败' })
  }
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
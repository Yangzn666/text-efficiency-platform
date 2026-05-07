const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// 数据文件路径
const DATA_FILE = path.join(__dirname, '../data/reading-questions.json');

// 确保数据文件存在
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ questions: [] }, null, 2));
}

// 获取所有题目
router.get('/', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: '读取数据失败' });
  }
});

// 保存题目
router.post('/', (req, res) => {
  try {
    const { questions } = req.body;
    
    if (!Array.isArray(questions)) {
      return res.status(400).json({ error: '数据格式错误' });
    }
    
    // 读取现有数据
    const existingData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    
    // 合并新题目（去重）
    const existingIds = new Set(
      existingData.questions.map(q => `${q.year}-${q.number}`)
    );
    
    const newQuestions = questions.filter(
      q => !existingIds.has(`${q.year}-${q.number}`)
    );
    
    const updatedData = {
      questions: [...existingData.questions, ...newQuestions],
      lastUpdated: new Date().toISOString()
    };
    
    // 保存到文件
    fs.writeFileSync(DATA_FILE, JSON.stringify(updatedData, null, 2));
    
    res.json({
      success: true,
      message: `成功保存 ${newQuestions.length} 道新题目`,
      total: updatedData.questions.length
    });
  } catch (error) {
    res.status(500).json({ error: '保存数据失败' });
  }
});

// 清空所有题目
router.delete('/', (req, res) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ questions: [] }, null, 2));
    res.json({ success: true, message: '已清空所有题目' });
  } catch (error) {
    res.status(500).json({ error: '清空数据失败' });
  }
});

module.exports = router;

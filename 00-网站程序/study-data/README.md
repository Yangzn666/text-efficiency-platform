# 学习进度数据存储

## 📁 目录说明

本目录用于存储考研效率平台的学习进度数据，使用JSON格式保存，便于管理和备份。

## 📄 文件说明

### study-records.json
主数据文件，包含：
- `studyRecords`: 所有学习记录数组
- `subjectProgress`: 各科目学习进度统计

## 📊 数据结构

### 学习记录 (StudyRecord)
```json
{
  "id": "唯一标识",
  "date": "日期 (YYYY-MM-DD)",
  "subject": "科目名称",
  "duration": "学习时长（分钟）",
  "content": "学习内容描述",
  "type": "类型 (study/practice/review)",
  "createdAt": "创建时间 (ISO格式)"
}
```

### 科目进度 (SubjectProgress)
```json
{
  "totalTime": "总学习时长（分钟）",
  "lastStudyDate": "最后学习日期",
  "weeklyGoal": "每周目标（分钟）",
  "completionRate": "完成率（百分比）"
}
```

## 🔄 数据同步

### 从前端保存到文件
当用户在网站上添加学习记录时，数据会：
1. 首先保存到浏览器的 localStorage
2. 然后通过后端API同步到本JSON文件

### 从文件加载到前端
网站启动时：
1. 优先从后端API加载JSON文件数据
2. 如果API不可用，则使用localStorage中的数据
3. 确保数据一致性和持久化

## 💡 优势

✅ **文本格式**：易于阅读和编辑  
✅ **版本控制**：可以使用Git跟踪变化  
✅ **数据备份**：方便备份和恢复  
✅ **跨设备同步**：通过Git实现多设备同步  
✅ **避免浏览器限制**：不受localStorage大小限制  

## 📝 手动编辑

如需手动添加或修改学习记录，可以直接编辑 `study-records.json` 文件，然后：
1. 提交到Git
2. 刷新网站页面
3. 数据会自动加载

## ⚠️ 注意事项

- 编辑JSON文件时请保持格式正确
- 每次修改后建议验证JSON格式
- 定期提交到Git进行版本管理

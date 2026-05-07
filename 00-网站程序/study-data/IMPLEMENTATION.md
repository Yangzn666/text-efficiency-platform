# 学习数据持久化方案

## 🎯 目标

将学习进度数据从浏览器localStorage迁移到文件存储，实现：
- ✅ 数据持久化（不受浏览器清除影响）
- ✅ 版本控制（Git跟踪变化）
- ✅ 跨设备同步（通过Git）
- ✅ 易于备份和恢复

## 📁 目录结构

```
00-网站程序/
├── study-data/           # 学习数据存储目录
│   ├── study-records.json    # 主数据文件
│   └── README.md             # 说明文档
├── backend/              # 后端服务
│   └── index.js          # 添加API接口
└── frontend/             # 前端应用
    └── src/
        └── stores/
            └── study.ts  # 修改数据加载逻辑
```

## 🔄 工作流程

### 1. 数据加载优先级

```
启动网站
    ↓
尝试从后端API加载 (http://localhost:3001/api/study-data)
    ↓
成功？ → 使用JSON文件数据 + 同步到localStorage
    ↓
失败？ → 从localStorage加载（降级方案）
```

### 2. 数据保存流程

```
用户添加学习记录
    ↓
保存到localStorage（即时响应）
    ↓
异步调用后端API保存
    ↓
写入study-records.json文件
    ↓
提交到Git（可选，手动或自动）
```

## 🛠️ API接口

### GET /api/study-data
获取学习记录数据

**响应示例：**
```json
{
  "success": true,
  "data": {
    "studyRecords": [...],
    "subjectProgress": {...}
  }
}
```

### POST /api/study-data
保存学习记录数据

**请求体：**
```json
{
  "studyRecords": [...],
  "subjectProgress": {...}
}
```

**响应示例：**
```json
{
  "success": true,
  "message": "数据保存成功"
}
```

## 💡 优势对比

| 特性 | localStorage | JSON文件 + Git |
|------|-------------|----------------|
| 持久性 | ❌ 清除浏览器会丢失 | ✅ 永久保存 |
| 版本控制 | ❌ 无法追溯历史 | ✅ Git完整历史 |
| 跨设备 | ❌ 仅限单设备 | ✅ 通过Git同步 |
| 备份恢复 | ⚠️ 需手动导出 | ✅ 直接复制文件 |
| 数据大小 | ⚠️ 5-10MB限制 | ✅ 无限制 |
| 可读性 | ❌ 需开发者工具 | ✅ 文本编辑器可查看 |
| 协作分享 | ❌ 困难 | ✅ 通过Git共享 |

## 📝 使用指南

### 方式一：正常使用（推荐）

1. **启动后端服务**
   ```bash
   cd 00-网站程序/backend
   npm start
   ```

2. **启动前端服务**
   ```bash
   cd 00-网站程序/frontend
   npm run dev
   ```

3. **正常使用网站**
   - 添加学习记录会自动保存到JSON文件
   - 刷新页面数据不会丢失

### 方式二：手动编辑数据

1. **编辑JSON文件**
   ```bash
   # 用任意文本编辑器打开
   code 00-网站程序/study-data/study-records.json
   ```

2. **修改数据**
   - 添加/删除学习记录
   - 修改科目进度

3. **刷新页面**
   - 数据会自动加载

### 方式三：Git同步

1. **提交更改**
   ```bash
   git add 00-网站程序/study-data/study-records.json
   git commit -m "更新学习记录：添加5月6日英语学习150分钟"
   git push
   ```

2. **在其他设备上拉取**
   ```bash
   git pull
   # 刷新网页即可看到最新数据
   ```

## ⚠️ 注意事项

1. **后端服务必须运行**
   - 如果后端未启动，会自动降级到localStorage
   - 建议始终启动后端服务以获得最佳体验

2. **JSON格式正确性**
   - 手动编辑时注意保持JSON格式
   - 可以使用在线JSON验证工具检查

3. **并发问题**
   - 目前不支持多用户同时编辑
   - 个人使用无此问题

4. **定期备份**
   - 虽然使用了Git，仍建议定期备份
   - 可以复制整个study-data文件夹

## 🔧 故障排查

### 问题1：数据没有保存

**检查步骤：**
1. 确认后端服务是否运行
2. 查看浏览器控制台是否有错误
3. 检查study-records.json文件权限

**解决方案：**
```bash
# 重启后端服务
cd 00-网站程序/backend
npm start
```

### 问题2：数据加载失败

**检查步骤：**
1. 查看控制台输出
2. 确认API地址是否正确
3. 检查JSON文件格式

**解决方案：**
- 如果API失败，会自动使用localStorage数据
- 可以手动修复JSON文件后刷新

### 问题3：Git冲突

**解决方案：**
```bash
# 查看差异
git diff 00-网站程序/study-data/study-records.json

# 选择保留的版本
git checkout --ours 00-网站程序/study-data/study-records.json  # 保留本地
git checkout --theirs 00-网站程序/study-data/study-records.json  # 保留远程

# 重新提交
git add 00-网站程序/study-data/study-records.json
git commit -m "解决数据冲突"
```

## 📊 当前数据统计

截至2026-05-07：
- 总记录数：9条
- 总学习时长：350分钟
- 涉及科目：4个（经验贴/视频、数学、计划、英语一）
- 最近学习：2026-05-06 英语一 150分钟

## 🚀 未来优化

- [ ] 自动定时保存到JSON文件
- [ ] 数据变更自动提交Git
- [ ] 多用户支持
- [ ] 数据压缩和归档
- [ ] 统计分析功能

// 优化操作系统知识点内容的脚本
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/stores/operatingSystem.ts');
let content = fs.readFileSync(filePath, 'utf-8');

console.log('开始优化操作系统知识点内容...');

// 这里可以添加批量替换逻辑
console.log('优化完成！');

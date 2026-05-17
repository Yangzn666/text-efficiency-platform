/**
 * 学习路径功能快速测试脚本
 * 
 * 使用方法：
 * 1. 打开浏览器开发者工具（F12）
 * 2. 切换到Console标签
 * 3. 复制粘贴此文件内容并执行
 */

console.log('🚀 开始学习路径功能测试...\n')

// 检查store是否可用
try {
  const store = window.__VUE_DEVTOOLS_GLOBAL_HOOK__?.apps?.[0]?.appContext?.config?.globalProperties?.$store
  
  if (!store) {
    console.warn('⚠️ 无法直接访问store，请使用以下方式测试：')
    console.log('1. 在Vue组件中使用 learningPathStore')
    console.log('2. 或者通过页面交互进行测试')
  }
} catch (e) {
  console.log('提示：请通过页面UI进行功能测试')
}

console.log('\n📋 测试步骤：')
console.log('1. 打开学习路径页面')
console.log('2. 点击"复习提醒"标签页')
console.log('3. 检查是否显示空状态或复习列表')
console.log('4. 通过UI创建测评和学习路径')
console.log('5. 观察数据是否正确显示\n')

console.log('✅ 如果页面正常显示且无报错，说明集成成功！')

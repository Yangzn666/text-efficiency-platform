// 清理数学强化阶段旧的错题本数据
// 在浏览器控制台运行此脚本，或直接在页面中执行

console.log('开始清理旧的错题本数据...')

// 删除localStorage中的错题本数据
const removed = localStorage.removeItem('mathReinforcement_wrongProblems')

if (removed === undefined) {
  console.log('✅ 成功删除 mathReinforcement_wrongProblems')
} else {
  console.log('⚠️ 未找到 mathReinforcement_wrongProblems 数据（可能已被删除）')
}

console.log('清理完成！请刷新页面以应用更改。')

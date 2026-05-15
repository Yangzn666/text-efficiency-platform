// @ts-nocheck
// 检查408各科目的学习完成进度（从localStorage读取）
(function() {
  console.log('🔍 检查408各科目完成进度...\n');
  
  try {
    // 1. 计算机组成原理
    const compositionProgress = JSON.parse(localStorage.getItem('composition_studied_sections') || '[]');
    console.log('💻 计算机组成原理:');
    console.log(`   已完成小节数: ${compositionProgress.length}`);
    console.log(`   已完成的小节ID:`, compositionProgress);
    console.log('');
    
    // 2. 数据结构
    const dataStructureProgress = JSON.parse(localStorage.getItem('dataStructure_studied_sections') || '[]');
    console.log('📊 数据结构:');
    console.log(`   已完成小节数: ${dataStructureProgress.length}`);
    console.log(`   已完成的小节ID:`, dataStructureProgress);
    console.log('');
    
    // 3. 操作系统
    const osProgress = JSON.parse(localStorage.getItem('os_studied_sections') || '[]');
    console.log('🖥️ 操作系统:');
    console.log(`   已完成小节数: ${osProgress.length}`);
    console.log(`   已完成的小节ID:`, osProgress);
    console.log('');
    
    // 4. 计算机网络
    const networkProgress = JSON.parse(localStorage.getItem('network_studied_sections') || '[]');
    console.log('🌐 计算机网络:');
    console.log(`   已完成小节数: ${networkProgress.length}`);
    console.log(`   已完成的小节ID:`, networkProgress);
    console.log('');
    
    // 5. 数学进度
    const mathChapters = JSON.parse(localStorage.getItem('math_chapters') || '[]');
    console.log('📐 数学一:');
    console.log(`   总章节数: ${mathChapters.length}`);
    const completedMathChapters = mathChapters.filter(ch => ch.completed);
    console.log(`   已完成章节数: ${completedMathChapters.length}`);
    if (completedMathChapters.length > 0) {
      console.log('   已完成的章节:');
      completedMathChapters.forEach(ch => {
        console.log(`     - ${ch.title} (掌握度: ${ch.masteryLevel}%)`);
      });
    }
    console.log('');
    
    // 6. 英语进度
    const englishProgress = JSON.parse(localStorage.getItem('english_progress') || '{}');
    console.log('📚 英语一:');
    console.log('   进度数据:', englishProgress);
    console.log('');
    
    // 7. 总结
    console.log('📈 总体完成情况汇总:');
    console.log(`   计组: ${compositionProgress.length}个小节`);
    console.log(`   数据结构: ${dataStructureProgress.length}个小节`);
    console.log(`   操作系统: ${osProgress.length}个小节`);
    console.log(`   计算机网络: ${networkProgress.length}个小节`);
    console.log(`   数学: ${completedMathChapters.length}/${mathChapters.length}个章节`);
    console.log('');
    
    const total408Sections = compositionProgress.length + dataStructureProgress.length + 
                            osProgress.length + networkProgress.length;
    console.log(`   408总计完成: ${total408Sections}个小节`);
    
  } catch (error) {
    console.error('❌ 检查失败:', error);
  }
})();

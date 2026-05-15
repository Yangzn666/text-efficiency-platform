/**
 * 学习数据清理工具
 * 用于清除模拟的学习记录和时长数据
 */

export class DataCleanupUtil {
  /**
   * 清除所有模拟的学习数据
   */
  static clearMockStudyData(): void {
    console.log('🧹 开始清理模拟学习数据...');
    
    try {
      // 清除学习记录相关数据
      localStorage.removeItem('studyRecords');
      localStorage.removeItem('subjectProgress');
      localStorage.removeItem('studySessions');
      localStorage.removeItem('analyticsData');
      
      // 清除可能的本地存储数据
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (
          key.includes('study') || 
          key.includes('learning') || 
          key.includes('analytics') ||
          key.includes('progress')
        )) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        console.log(`🗑️ 已删除: ${key}`);
      });
      
      console.log('✅ 模拟学习数据清理完成');
      
    } catch (error) {
      console.error('❌ 清理学习数据时出错:', error);
    }
  }
  
  /**
   * 重置学习统计数据
   */
  static resetStudyStatistics(): void {
    console.log('📊 重置学习统计数据...');
    
    try {
      // 清除所有学习相关的本地存储
      this.clearMockStudyData();
      
      // 刷新页面以应用更改
      console.log('🔄 页面将在3秒后刷新以应用更改...');
      setTimeout(() => {
        window.location.reload();
      }, 3000);
      
    } catch (error) {
      console.error('❌ 重置统计数据时出错:', error);
    }
  }
  
  /**
   * 检查是否存在学习数据
   */
  static hasStudyData(): boolean {
    try {
      const studyRecords = localStorage.getItem('studyRecords');
      const subjectProgress = localStorage.getItem('subjectProgress');
      
      return !!(studyRecords || subjectProgress);
    } catch (error) {
      console.error('检查学习数据时出错:', error);
      return false;
    }
  }
  
  /**
   * 获取数据清理报告
   */
  static getCleanupReport(): {
    hasData: boolean;
    dataKeys: string[];
    cleanupNeeded: boolean;
  } {
    const dataKeys: string[] = [];
    const studyRelatedKeys: string[] = [];
    
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          dataKeys.push(key);
          if (
            key.includes('study') || 
            key.includes('learning') || 
            key.includes('analytics') ||
            key.includes('progress') ||
            key.includes('session')
          ) {
            studyRelatedKeys.push(key);
          }
        }
      }
      
      const hasData = studyRelatedKeys.length > 0;
      
      return {
        hasData,
        dataKeys: studyRelatedKeys,
        cleanupNeeded: hasData
      };
      
    } catch (error) {
      console.error('生成清理报告时出错:', error);
      return {
        hasData: false,
        dataKeys: [],
        cleanupNeeded: false
      };
    }
  }
}

// 立即执行清理（如果检测到模拟数据）
if (typeof window !== 'undefined') {
  const report = DataCleanupUtil.getCleanupReport();
  
  if (report.cleanupNeeded) {
    console.log('🔍 检测到模拟学习数据，准备清理...');
    console.log('📊 检测到的学习相关数据键:', report.dataKeys);
    
    // 可以在这里添加用户确认逻辑
    // DataCleanupUtil.resetStudyStatistics();
  } else {
    console.log('✅ 未检测到需要清理的模拟学习数据');
  }
}

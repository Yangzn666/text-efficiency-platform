const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const path = require('path')

// 创建数据库适配器
const adapter = new FileSync(path.join(__dirname, '../data/db.json'))
const db = low(adapter)

// 设置默认数据结构
db.defaults({
  users: [],
  studyRecords: [],
  settings: {
    theme: 'default',
    notifications: true,
    autoSave: true
  }
}).write()

class DatabaseService {
  // 用户相关操作
  static getUserByUsername(username) {
    return db.get('users').find({ username }).value()
  }

  static createUser(userData) {
    const newUser = {
      id: 'user_' + Date.now(),
      ...userData,
      createdAt: new Date().toISOString()
    }
    
    db.get('users').push(newUser).write()
    return newUser
  }

  // 学习记录相关操作
  static getStudyRecords(userId, date = null) {
    let query = db.get('studyRecords').filter({ userId })
    
    if (date) {
      query = query.filter({ date })
    }
    
    return query.value()
  }

  static addStudyRecord(recordData) {
    const newRecord = {
      id: 'record_' + Date.now(),
      ...recordData,
      createdAt: new Date().toISOString()
    }
    
    db.get('studyRecords').push(newRecord).write()
    return newRecord
  }

  static getSubjectStats(userId, subject, days = 7) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    const records = db.get('studyRecords')
      .filter(record => 
        record.userId === userId && 
        record.subject === subject &&
        new Date(record.date) >= startDate
      )
      .value()
    
    const totalTime = records.reduce((sum, record) => sum + record.duration, 0)
    
    return {
      totalTime,
      sessionCount: records.length,
      averageDuration: records.length > 0 ? totalTime / records.length : 0
    }
  }

  // 设置相关操作
  static getSettings(userId) {
    return db.get('settings').value()
  }

  static updateSettings(settings) {
    return db.set('settings', { ...db.get('settings').value(), ...settings }).write()
  }

  // 数据备份
  static backupData() {
    const data = db.getState()
    const backupName = `backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`
    const fs = require('fs')
    
    fs.writeFileSync(
      path.join(__dirname, '../backups', backupName),
      JSON.stringify(data, null, 2)
    )
    
    return backupName
  }
}

module.exports = DatabaseService
import localforage from 'localforage'

const BACKUP_VERSION = 1

interface BackupData {
  version: number
  exportedAt: string
  app: string
  localStorage: Record<string, string>
  localforage: Record<string, unknown>
}

/**
 * 导出全部本地数据（localStorage + IndexedDB/localforage）为 JSON 文件下载。
 * 采用通用遍历方式，自动覆盖所有 store 写入的键，无需逐个枚举。
 */
export async function exportAllData(): Promise<{ lsCount: number; lfCount: number }> {
  // 1. 收集 localStorage
  const lsData: Record<string, string> = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key) lsData[key] = localStorage.getItem(key) as string
  }

  // 2. 收集 localforage（IndexedDB）
  const lfData: Record<string, unknown> = {}
  const keys = await localforage.keys()
  for (const key of keys) {
    lfData[key] = await localforage.getItem(key)
  }

  const backup: BackupData = {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    app: '考研效率平台',
    localStorage: lsData,
    localforage: lfData
  }

  // 3. 触发浏览器下载
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const date = new Date().toISOString().split('T')[0]
  a.href = url
  a.download = `考研数据备份_${date}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  return { lsCount: Object.keys(lsData).length, lfCount: Object.keys(lfData).length }
}

/**
 * 从 JSON 备份文件导入全部数据，覆盖当前本地数据。
 * 导入后需刷新页面让各 store 重新加载。
 */
export async function importAllData(file: File): Promise<{ lsCount: number; lfCount: number }> {
  const text = await file.text()
  let backup: BackupData
  try {
    backup = JSON.parse(text)
  } catch {
    throw new Error('文件不是有效的 JSON 备份')
  }

  if (!backup || typeof backup !== 'object' || !backup.localStorage || !backup.localforage) {
    throw new Error('备份文件格式不正确，缺少 localStorage 或 localforage 字段')
  }

  // 1. 恢复 localStorage
  let lsCount = 0
  for (const [key, value] of Object.entries(backup.localStorage)) {
    localStorage.setItem(key, value)
    lsCount++
  }

  // 2. 恢复 localforage
  let lfCount = 0
  for (const [key, value] of Object.entries(backup.localforage)) {
    await localforage.setItem(key, value)
    lfCount++
  }

  return { lsCount, lfCount }
}

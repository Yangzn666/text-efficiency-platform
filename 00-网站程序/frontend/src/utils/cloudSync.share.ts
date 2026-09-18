// 共享版（公开知识库）云同步替身（P5 方案 B）
// `--mode share` 时由 vite 别名把 `@/utils/cloudSync` 指向本文件。
// 目的：公开构建不接入 Supabase、不把个人匿名密钥打进包，行为与 frontend-share
// 的「纯 localStorage」一致（srs/study/todayStatus 的云端调用退化为无操作）。
// 个人版仍使用真实 cloudSync.ts，本文件只在 share 模式装载。

/** 共享版恒不启用云同步 */
export const isCloudSyncEnabled = false

/** 无操作推送 */
export async function pushToCloud(_data: unknown, _table?: string): Promise<void> {
  // no-op
}

/** 无操作拉取：始终无云端数据 → 触发上层回退本地 */
export async function pullFromCloud(
  _table?: string
): Promise<{ data: any; updatedAt: string } | null> {
  return null
}

/** 无操作防抖推送 */
export function pushToCloudDebounced(
  _data: unknown,
  _delay?: number,
  _table?: string
): void {
  // no-op
}

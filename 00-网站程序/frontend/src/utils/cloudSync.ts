import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Supabase 云同步层
 * 解决 localStorage 各设备不通的问题：手机打卡 → 电脑自动同步。
 *
 * 未配置（缺少环境变量）时，所有方法均为无操作（no-op），
 * 应用自动回退为纯本地 localStorage 模式，不影响现有功能。
 *
 * 激活步骤见 网站改进计划.md「云同步配置说明」。
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** 是否已配置云同步 */
export const isCloudSyncEnabled = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

/** 单用户个人应用，固定用户标识 */
const USER_ID = 'default'
/** 数据表名 */
const TABLE = 'today_status'

let client: SupabaseClient | null = null

const getClient = (): SupabaseClient | null => {
  if (!isCloudSyncEnabled) return null
  if (!client) {
    client = createClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string)
  }
  return client
}

/**
 * 推送本地数据到云端（upsert）
 * @param data 要同步的完整状态对象（可 JSON 序列化）
 */
export async function pushToCloud(data: unknown): Promise<void> {
  const c = getClient()
  if (!c) return
  try {
    await c.from(TABLE).upsert({
      user_id: USER_ID,
      data,
      updated_at: new Date().toISOString()
    })
  } catch (e) {
    // 同步失败静默降级为本地模式，不打断用户
    console.warn('[云同步] 推送失败，已回退本地模式', e)
  }
}

/**
 * 从云端拉取最新数据
 * @returns 云端存储的状态对象；未配置或无数据时返回 null
 */
export async function pullFromCloud(): Promise<{ data: any; updatedAt: string } | null> {
  const c = getClient()
  if (!c) return null
  try {
    const { data: rows, error } = await c
      .from(TABLE)
      .select('data, updated_at')
      .eq('user_id', USER_ID)
      .maybeSingle()
    if (error || !rows) return null
    return { data: rows.data, updatedAt: rows.updated_at }
  } catch (e) {
    console.warn('[云同步] 拉取失败，已回退本地模式', e)
    return null
  }
}

/**
 * 防抖推送包装：避免频繁写云端
 */
let pushTimer: ReturnType<typeof setTimeout> | null = null
export function pushToCloudDebounced(data: unknown, delay = 1500): void {
  if (!isCloudSyncEnabled) return
  if (pushTimer) clearTimeout(pushTimer)
  pushTimer = setTimeout(() => {
    pushToCloud(data)
  }, delay)
}

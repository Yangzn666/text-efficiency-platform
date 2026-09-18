/**
 * 资料清单：本 store 现在只承担"我手头有哪些资料"的清单角色（名称/科目/备注）。
 * 进度权威在 stores/todayStatus.ts 的 plans（即「100 天作战计划 / 今日任务」），资料墙不再记进度。
 * done/total 字段保留仅为向后兼容旧 localStorage 与数据分析页的 materialStatus，UI 不再展示/编辑。
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * 资料进度墙数据引擎
 * 设计原则：纯前端 + localStorage 持久化
 * - 所有手头资料集中显示完成进度，一眼看清"还有什么没做"
 * - 状态三种：⬜未开始 / 🔄进行中 / ✅已完成（由 done/total 推导）
 * - 点击 +1 更新进度，也可编辑 done/total
 * - 支持手动添加新资料（后续买新卷子不用改代码）
 */

export type MaterialSubject = 'math' | 'cs408' | 'english' | 'politics'

export interface Material {
  id: string
  subject: MaterialSubject
  name: string
  /** 进度单位，如 套/章/篇/讲 */
  unit: string
  total: number
  done: number
  note?: string
}

export const MATERIAL_SUBJECTS: { key: MaterialSubject; name: string; color: string; icon: string }[] = [
  { key: 'math', name: '数学', color: '#F56C6C', icon: '📐' },
  { key: 'cs408', name: '408', color: '#409EFF', icon: '💻' },
  { key: 'english', name: '英语', color: '#67C23A', icon: '📖' },
  { key: 'politics', name: '政治', color: '#E6A23C', icon: '📕' }
]

export function materialStatus(m: Material): 'todo' | 'doing' | 'done' {
  if (m.done <= 0) return 'todo'
  if (m.done >= m.total) return 'done'
  return 'doing'
}

const STORAGE_KEY = 'materials-progress-v2'
/** 已废弃的条目 id：课程结构对账后改名的旧条目，加载时清除，避免与新条目重复计数 */
const LEGACY_IDS = ['politics-徐涛强化班视频']

function seed(): Material[] {
  const mk = (
    subject: MaterialSubject,
    name: string,
    unit: string,
    total: number,
    done = 0,
    note = ''
  ): Material => ({ id: `${subject}-${name}`, subject, name, unit, total, done, note })

  return [
    // ---- 数学 ----
    mk('math', '基础30讲', '讲', 30, 30, '已完成 · 基础阶段'),
    mk('math', '武忠详强化班', '讲', 18, 18, '已完成 · 视频+笔记'),
    mk('math', '660题', '节', 20, 0, '按章节/题数'),
    mk('math', '1000题（B组）', '节', 20, 0, '随强化同步'),
    mk('math', '李林880', '节', 20, 0, ''),
    mk('math', '李艳芳09-26真题', '套', 18, 3, '09-11已完成，11年错题明天整理'),
    mk('math', '25超越10套卷', '套', 10, 0, ''),
    mk('math', '26李林8+4', '套', 12, 0, ''),
    // ---- 408 ----
    mk('cs408', '王道选择题', '门', 4, 4, '已完成 · 四门课全部刷完'),
    mk('cs408', '王道四本书（大题）', '章', 26, 0, 'DS强化已完成(大题放最后)，明天启动计组强化'),
    mk('cs408', '王道26模拟卷', '套', 8, 0, ''),
    // ---- 英语 ----
    mk('english', '考研单词', '轮', 4, 4, '已完成 · 背完四轮'),
    mk('english', '05-26英一真题', '篇', 88, 8, '按篇'),
    mk('english', '写作功能句库', '模块', 10, 0, '8月中旬启动'),
    // ---- 政治 ----
    // 2026-09-16 课程结构对账：真实串讲课为五模块 58 讲（马原21/思修8/史纲9/毛中特7/新思想13），
    // 体积 59.4 GB ≈ 原始 44.5 h，2 倍速净看课仅 22.3 h，所以瓶颈在刷题不在看课。
    mk('politics', '考点串讲网课（五模块）', '讲', 58, 5, '09-15 看完马原第5讲 · 2倍速全程约22.3h'),
    mk('politics', '肖秀荣1000题', '章', 20, 0, '随课同步一刷（马原前5讲对应章节欠着）'),
    mk('politics', '肖八', '套', 8, 0, '11月出版'),
    mk('politics', '肖四', '套', 4, 0, '12月出版，选择题+背大题')
  ]
}

export const useMaterialsStore = defineStore('materials', () => {
  const materials = ref<Material[]>(seed())

  function load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        materials.value = (JSON.parse(saved) as Material[]).filter(m => m && !LEGACY_IDS.includes(m.id))
        // 版本升级合并：seed 中新增的资料自动补入已有存档
        const ids = new Set(materials.value.map(m => m.id))
        for (const item of seed()) {
          if (!ids.has(item.id)) materials.value.push(item)
        }
      }
    } catch {
      /* 忽略损坏数据 */
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(materials.value))
  }

  function increment(m: Material) {
    if (m.done < m.total) {
      m.done++
      save()
    }
  }

  function decrement(m: Material) {
    if (m.done > 0) {
      m.done--
      save()
    }
  }

  function update(m: Material, done: number, total: number) {
    m.total = Math.max(1, Math.round(total))
    m.done = Math.max(0, Math.min(m.total, Math.round(done)))
    save()
  }

  function addMaterial(data: Omit<Material, 'id'>) {
    materials.value.push({ ...data, id: `mat-${Date.now()}` })
    save()
  }

  function removeMaterial(id: string) {
    materials.value = materials.value.filter(m => m.id !== id)
    save()
  }

  /** 清单纯编辑：只改名称与备注（不涉及进度） */
  function rename(m: Material, name: string, note: string) {
    if (name.trim()) m.name = name.trim()
    m.note = note
    save()
  }

  function bySubject(key: MaterialSubject) {
    return computed(() => materials.value.filter(m => m.subject === key))
  }

  const overall = computed(() => {
    const total = materials.value.length
    const done = materials.value.filter(m => materialStatus(m) === 'done').length
    const doing = materials.value.filter(m => materialStatus(m) === 'doing').length
    return { total, done, doing, todo: total - done - doing }
  })

  load()

  return {
    materials,
    overall,
    bySubject,
    increment,
    decrement,
    update,
    rename,
    addMaterial,
    removeMaterial
  }
})

// 全科错题本统一条目类型（2026-09-18 P1 数据打通）
// 各科目此前各自内联/定义了同名 interface，字段完全一致；此处收敛为单一来源。
// subject 为可选归属标记，统一 store 会补齐。
export interface WrongProblem {
  id: string
  chapterId: string
  chapterName: string
  sectionId: string
  sectionName: string
  title: string
  content: string
  mistakeType: string
  importance: number
  correction: string
  createdAt: string
  reviewCount: number
  lastReviewAt: string
  mastered: boolean
  subject?: string
}

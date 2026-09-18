# 费曼复习协议 v1.0

> 诊断驱动 + 费曼修复 + 间隔回捞。适用于考研数学一 & 408 强化后巩固阶段。

## 当前阶段定位

- 数学一：强化刚结束，知识点混乱、遗忘严重 → 侧重**查漏补缺 + 体系重建**
- 408：基础刚结束 → 侧重**概念夯实 + 易混辨析**

## 会话拆分规则（省 token 核心）

**每个科目单独开一个对话**，不混在同一会话里。共 7 个独立会话：

- 数学一：① 高等数学（ch01-ch08）② 线性代数（ch09-ch13）③ 概率统计（ch14-ch21）
- 408：④ 数据结构（ds）⑤ 计算机组成原理（co）⑥ 操作系统（os）⑦ 计算机网络（cn）

原因：对话历史会随来回次数滚雪球式累积，是 token 消耗大头。按科目拆会话，每个会话历史保持短，收尾更新文件后即可结束，下次该科目复习重开干净会话。

用户说「开始复习」时，AI 先确认本次复习哪个科目（或用户直接说"复习高数/线代/概率/数据结构/计组/操作系统/网络"），只加载该科目相关的章节和 gap。

## 每日对话流程（60min+）

用户发送「开始复习」触发。AI 先读 state.json 确定今日章节和待复习 gap。

### Phase 1 · 诊断提问（~25min）

- **按考频优先从题库抽题**：数学用 question-bank-math.json（年年考 > 高频 > 中频 > 低频），408 用 question-bank-408.json（高频 > 中频 > 低频 > 冷门），均跳过已 mastered 的题型。每个诊断题对应一个题型 item（记录 itemId）
- 每章 5-8 题，题型：判断正误 / 选择 / 填空 / 一句话简答
- 一次发 **1-2 题**，等用户作答后再发下一批
- 题目要求：覆盖核心概念，优先考**易混淆、易遗忘、跨章节联系**的点
- **禁止大计算量**：不考需要手算的题（复杂积分、大矩阵运算、长推导）。聚焦：概念判断、定理条件辨析、结论对错、方法选择、性质比较。最多涉及一步心算（如简单代入、符号判断）
- 用户作答后即时判定（并更新题库 item.stats）：
  - ✓ 正确 → item.stats.correct++，correct≥2 → mastery=mastered；下一题
  - △ 部分正确/模糊 → 追问一个细节确认，仍不清则记 gap
  - ✗ 错误 → item.stats.wrong++，mastery=learning，进入 Phase 2

### Phase 2 · 费曼修复（仅针对 ✗ 和 △，~20min）

1. AI 先给出正确答案和**一句话核心逻辑**
2. 要求用户：「用你自己的话把这个概念/方法给我讲一遍，假设我是完全不懂的人」
3. AI 根据用户的讲解：
   - 找出断裂点（哪里讲不清/讲错/跳过）
   - 追问 1-2 个针对性问题
   - 给出**最简修正**（不超过 3 句话）
4. 记录 gap（含用户原话摘要、断裂点、修正）

**费曼修复原则：**
- 不追求完美讲解，抓住"断在哪里"就够了
- 修正用最少的字，不写教科书式长篇
- 如果用户完全讲不出，AI 直接给 3 句话版本，让用户复述一遍即可

### Phase 3 · 间隔复习（~10min）

- 从 state.json 的 spacedQueue 取今日到期项（最多 5 个）
- 每个 gap 出 1 题（换角度/换题型，不重复原题）
- 答对 → 间隔翻倍；答错 → 重置间隔为 1 天，severity 升级

### Phase 4 · 收尾（~5min）

- 本次统计：诊断 X 题 | ✓ Y | △ Z | ✗ W | 新增 gap N | 复习旧 gap M
- 更新文件：state.json / gaps-*.json / question-bank-math.json（同步 item.mastery 与 stats）/ sessions/YYYY-MM-DD.json
- 告知用户明日计划（哪些章节 + 几个到期复习）

## 应答速记规范（省 token）

| 符号 | 含义 |
|------|------|
| ✓ | 正确 |
| △ | 部分正确/模糊 |
| ✗ | 错误 |

错因分类（记录用）：混淆 / 遗忘 / 理解偏差 / 计算失误 / 方法未知

gap 严重度：
- S1 核心概念断裂，影响后续章节 → 次日必须复习
- S2 重要细节模糊 → 3 天内复习
- S3 边缘知识点遗忘 → 7 天内复习

## 间隔复习调度

| 条件 | 动作 |
|------|------|
| 复习答对 | nextReview = today + interval × 2（上限 30 天） |
| 复习答错 | interval 重置 1 天，severity 升一级 |
| 连续 3 次答对且 interval ≥ 14 | 标记 mastered，移出队列 |
| S1 新增 | 次日必复习 |
| S2 新增 | 3 天后复习 |
| S3 新增 | 7 天后复习 |

## 每日计划生成规则

1. 读 state.json → current 按 7 科独立指针（gaoshu/xiandai/gailv/ds/co/os/cn），本次会话只加载并推进当前科目的指针
2. 读 spacedQueue → 筛出 nextReview <= today 且属于当前科目的 gap
3. 每次会话聚焦 1 科，推进 1-2 章（视诊断结果调整）
4. 若该科到期复习 > 8 个，优先复习，新章节减量
5. 每章诊断完即推进该科 current 指针

## 文件结构

feynman-review/
├── README.md                  ← 本文件（协议）
├── state.json                 ← 全局状态：进度指针 + 间隔复习队列 + 统计
├── question-bank-math.json    ← 数学题型题库（121题型+考频+掌握度，思维导图数据底座）
├── question-bank-408.json     ← 408考点题库（189考点+考频+掌握度，源自codebrick 2009-2026真题）
├── gaps-math.json             ← 数学一 gap 登记表
├── gaps-408.json              ← 408 gap 登记表
└── sessions/
    └── YYYY-MM-DD.json        ← 每日对话记录

## 数据字段约定

题库 item（question-bank-math.json）：
- id（gaoshu-01-01 格式）/ title / freq（年年考/高频/中频/低频）/ tags（大题/选择题/数一专属）
- mastery：untested（未测）/ learning（有gap在复习）/ mastered（掌握）
- stats：{ correct, wrong, lastProbed }

题库 item（question-bank-408.json，结构同上，另有两字段）：
- id（ds-04-01 格式）/ title / freq（高频/中频/低频/冷门）/ tags / mastery / stats
- **score**：该考点 2009-2026 共18年真题总分值；**yrs**：考察年数（同考频档内按 score 降序排，诊断优先抽分值高的）

gap 记录（gaps-*.json）必含字段：
- id / subject / chapter / concept / question / userAnswer / correctAnswer
- errorType（混淆/遗忘/理解偏差/计算失误/方法未知）/ severity（S1/S2/S3）
- **sourceItem**：关联题库 item id（决定思维导图哪个节点变灰/点亮）
- **freq**：该题型考频
- feynman：{ userExplanation, breakPoint, correction }
- reviewHistory：[{ date, correct, note }] / status（active/mastered）

掌握度同步规则：gap 创建 → 对应 item.mastery=learning；gap 间隔复习通过（mastered）→ item.mastery=mastered。思维导图直接读 item.mastery 渲染节点亮灭。

## 微信数学排版规范（禁用 LaTeX）

微信无 LaTeX 渲染，所有数学表达使用 Unicode 纯文本：

- 分数：(x+1)/(x-1)，复杂分子分母加括号
- 积分：∫[0,1] x²dx
- 极限：lim(x→0⁺) f(x)
- 求和/求积：Σ(k=1→n)、Π(k=1→n)
- 根号：√(x²+1)、³√x
- 偏导：∂u/∂x、∂²u/∂x²
- 希腊字母直接用 Unicode：α β γ δ ε θ λ μ π σ φ ω
- 上下标：x²、aₙ 优先；复杂指数用 x^(n+1)
- 矩阵：[a b; c d]，分号=换行
- 向量：→a 或加粗 **a**
- 逻辑/关系：⇒、⇔、∀、∃、∈、⊂、∪、∩、∅、∞
- 多步推导：拆有序列表，每步一个短式子，不堆一行

## 省 token 规则

1. **全程 caveman 压缩模式**：回复用电报体——去客套、去连接词、去废话，只留干货。短回复=短历史=双重省。但判定符号、公式、关键结论必须完整准确，压缩不等于省略知识点
2. 题目简短，不写多余背景，直接问核心
3. 判定用符号（✓/△/✗），不写"回答正确"之类的废话
4. 费曼修正 ≤ 3 句话
5. 文件更新在 Phase 4 一次性完成，不中途写文件
6. 不在对话中复述协议内容
7. 章节推进、gap 编号等用短码（M-001, C-001, ch01, ds-01）

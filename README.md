# 🎯 考研冲刺工作区 · 目录地图

> 初试 2026-12-19。本工作区服务最后 40 多天的备考。
> **使用方式**：用户靠【打印物 + 与 AI 的对话】学习，不日常使用手机/电脑 App。
> 因此这里的"真相源"是生成打印手册的数据文件与脚本，网站 App 只作为数据底座和备份。

本文件是工作区总地图。进任何一个目录前先在这里定位，避免在重复目录里找错题、找手册。
**具体每个 JSON 谁是真相源，见同目录 `数据源总账.md`**（题库/gap/进度/手册四类逐一登记，含"数学题库只在 feynman-review、别去网站目录找"等易踩点）。

---

## 一、四科真相源（打印/对话都从这里取）

| 科目 | 真相源目录 | 说明 |
| :-- | :-- | :-- |
| 数学一 | `01-数学一/` | `03-个人笔记` 手写笔记；`02-真题与习题` 真题；变式题/ drill 状态在 `drill-system/` |
| 英语一 | `02-英语一/` | `03-个人笔记`、`复习图库`；作文与长难句 drill 在 `essay-recite/`、`long-sentence-drill/` |
| 政治 | `03-政治/` | 唯一政治真相源（旧 `02-考研政治` 已并入 archive）；背诵清单在 `03-个人笔记` |
| 408 专业课 | `04-408专业课/` | 唯一 408 真相源（旧 `02-408`、`03-专业课408` 已并入 archive）；`03-个人笔记` 存四科背诵手册+思维导图 |

> 2026-11-04 做过一次目录去重：把 3 个重复的 408/政治壳目录合并进上面的真相源，残壳移到 `archive/merge-*`，明细见 `archive/merge_log_2026-11-04.json`。

## 二、打印手册生成线（最常跑的两条）

**book2《四科考前补漏手册》** → `补漏手册book2/`
- 装配：`build2.py`（读 `sections_math.py` / `sections_408.py` / `sections_eng.py` / `sections_pol.py` 四科内容模块）
- 渲染：`python -X utf8 render.py out/book_print.html out/book_print.pdf`（Playwright Chromium A4，约 150–180s）
- 目录回填：`fill_toc_print.py`（两遍法；⚠ 政治分隔页会被误选，需按 `SUBJECT I/II/III/IV` 页手动校正范围）
- 成品在 `out/`：`book_print.pdf` 是彩印版；`408大题答案备份.pdf`、`数学答案备份.pdf` 是"题目版不附解析"的配套答案备份（彩印册里刻意删掉了答案）
- 当前定稿：**299 页彩印版**（压到 ≤300 页：删预测块 + 数学一刷二刷/用时标注 + 打卡格 + 章末反思 + 浅字加深）

**网站数据底座** → `00-网站程序/frontend/public/data/`
- `408-exam/`：王道 408 真题库 `questions.json`（126 道 09–26）+ `gaps-408.json` + `images/`
- `math/`、`english/`、`politics/`、`feynman/`、`formulas/`、`queues/`、`skilltree/`
- 预测等已从彩印册删除的内容，归档在 `english/考前预测_主题词预测库_存档.html`

## 三、Drill / 对话带刷状态（决定"今天刷哪科、哪题到期"）

- `drill-system/` — 数学带刷主状态：`drillState.json`、`math-真题已刷台账.json`
- `feynman-review/` — 408/数学 gap 驱动讲透：`gaps-408.json`、`gaps-math.json`、`question-bank-408.json`、`question-bank-math.json`，`figures/` 存截图配图
- `xray-drill/`、`bedtime-drill/`、`long-sentence-drill/`、`essay-recite/`、`writing-coach/` — 各自 `state.json` + `sessions/`
- `方法库/` — 跨题通用的解题方法沉淀（`考研方法库.md`、`级数命题判断·出法大全.md`）
- `数学错题分析/` — 错题诊断产物

## 四、其它

- `09-冲刺合订本/` — 早期 187 页合订本 PDF（历史版本，book2 是它的进化）
- `05-经验贴整理/`、`06-学习进度跟踪/`、`08-院校资料/` — 辅助资料
- `07-其他资源/` — 参考书原件（含 42MB《操作系统（含新大纲考点）》讲义）
- `research/`、`assets/`、`shots/`、`QQ群数学资料搜集/`、`海宁群热度氛围抽测/`、`生日礼物/`、`英语翻译检测小程序/` — 调研/素材/侧项目
- `00-网站程序/`（Vue3 前端 + Node/SQLite 后端 + `frontend-share`）— 网站 App 本体；`启动后端服务.bat`、`考研平台一键启动.bat` 可一键起。**用户不日常用 App，仅在需要重建数据或备份时启动。**
- `archive/` — 一次性脚本、被合并的旧目录、清理残骸都进这里，只移不删，可随时回溯
- `_backup/` — 每次大改前的 skills/数据/状态快照

## 五、Git

`.git/` 跟踪全部内容。重大改动前先备份（`_backup/`），改动后回原始逐条需求做内容验收再提交。

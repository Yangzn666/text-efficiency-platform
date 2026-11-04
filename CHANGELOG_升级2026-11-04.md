# CHANGELOG · 2026-11-04 工作区升级（5 小时冲刺辅助改造）

> 目标：整理优化工作区、升级/新建 skill、减少最后 40 多天的"可预知的麻烦"。
> 用户靠【打印物 + 与 AI 对话】学习，不日常用 App，故优先级放在真相源地图、手册管线、交付闭环、刷题规划上。

## 一、目录整理（只移不删，全部可回溯）
- **合并重复目录**：把 3 个重复的 408/政治壳目录（`02-408`、`03-专业课408`、`02-考研政治`）内容并入真相源 `04-408专业课`、`03-政治`，残壳移入 `archive/merge-*`，明细见 `archive/merge_log_2026-11-04.json`。
- **根目录清理**：一次性脚本与诊断残骸（`_refscan.py`、`_merge_folders.py`、`_rootclean.py`、`add_methods.py`、`gen-mobile-pdf*.ps1`、`pdf-check-p*.png`、`debug.log`、`_dump_co201544_fresh.txt`）→ `archive/root-cleanup-2026-11-04/`；42MB《操作系统（含新大纲考点）》讲义 → `07-其他资源/`；海宁 AI 备考报告 → `research/`；过期 `快速开始指南.md` → `archive/`。
- 根目录 `.md` 从 6 个收敛到 3 个：`README.md`（新地图）、`启动说明.md`、`学习进度记录.md`。

## 二、新增顶层文档
- **`README.md` 重写**：从旧的"CBT/番茄钟 App 介绍"改为「工作区总地图」——四科真相源、两条手册生成线、drill/对话状态目录、其它资源、Git 约定。
- **`数据源总账.md`（新）**：逐 JSON 登记真相源（题库/gap/进度/手册四类），含"数学题库只在 feynman-review、别去网站目录找""CO/DS 真题双数据源须跨源去重"等易踩点。

## 三、Skill 升级（在 ~/.qoderworkcn/skills，非本仓库）
- **`kaoyan-sprint-handbook-book2` v1.0→v2.0**：页数从过时"251页"更正为"约300页/定稿299"；补 `fill_toc_print.py`（book_print 彩印版目录回填）与 `map_pages.py`（book_final）两条真实管线；新增三条操作前提（git-bash 非 cmd 的 `cd /d` 坑、Read 拒 8.3 短名路径、本地 KaTeX）；补 fill_toc 政治 `cand[-1]` 误选分隔页的规避、浅字审计正则、压页杠杆（brush/spd/rec/chapnote/预测整删 + 平衡 div 剥除）、彩印不附答案/年份统一/结尾页等专属约定。
- **`kaoyan-handbook-deliver`（新建）**：打印物双信道交付闭环——微信 `qoder_send_channel_media` 发完整单文件（"不要切"）、prepare failed 原样重试 2–3 次、QQ 邮箱 SMTP_SSL/IMAP 核对兜底、present_files；含"判分/讲解轮零发图"IM 铁律、矢量 PDF deflate 压不动的真相、交付后回原始需求做内容验收门。
- **修悬空引用**：`kaoyan-sprint-handbook-book2/reference.md`、`handbook-whitespace-audit/{SKILL.md,reference.md}` 里指向不存在的 `kaoyan-sprint-handbook-book3`/`kaoyan-book3-print-pipeline` → 改为真实 skill 名。
- **消灭硬编码临时 workspace 路径**：`feynman-review` skill 的 `gen_website_data.py` 与 `book3-handbook-build-deliver` skill 的工作目录原指向会被清理的 `workspace/mrxleumz0icb79de`。已把 `gen_website_data.py` 固化到 `feynman-review/`、把 book3 源码固化到 `补漏手册book3/`（core 脚本用 `Path(__file__).parent` 相对定位，随目录平移可跑），skill 改指稳定路径并写明 git-bash cd 规范。

## 四、book2《四科考前补漏手册》定稿（本会话前半程）
- 316→**299 页**彩印版（≤300）：删英语主题词预测块（存档到网站数据）、数学一刷二刷三刷/用时标注、打卡格、章末反思、图例；156 处浅字加深保证彩印可读。完整单文件已发微信 + QQ 邮箱备份。

## 五、刷题状态一致性检查 + 45 天规划
- 核对各状态文件：数学 `drillState.plannedToday` 停在 10-30（陈旧指针，重跑带刷会刷新）、间隔队列 29 簇全到期 + xray 99 条(约90到期)已滞后堆积；408 轮次 DS/CN 待二刷、CO/OS 待三刷；政治漏洞地图 483 题；英语作文模板 小7/大3/范文1/主题词8。
- 产出 **`最后45天规划/最后45天冲刺总规划.pdf`**（4 页 A4，彩印可读）：现状对账 + 45 天切四块（广度清账→体系回炉→全真模考→考前补漏）+ 每日时间块模板（数学7h为锚）+ **到期队列分批处置预案**（避免回炉洪流）+ 里程碑清单 + 减麻烦预案 + "今日三问"对话钩子。

## 未改动（有意为之）
- `00-网站程序` App 源码本体、PWA 缓存、Supabase 云同步、前端性能——用户不用 App，仅在需要重建数据/备份时才启动，故未动。
- 各 study-state JSON（drillState/xray/gaps/question-bank 等）内容未手改，避免破坏带刷 skill 自有状态推进；到期队列处置写进规划册而非强改数据。
- `补漏手册book2`(186MB)、`补漏手册book3`(127MB) 为工作真相源（含字体/KaTeX/PDF），维持不入库。

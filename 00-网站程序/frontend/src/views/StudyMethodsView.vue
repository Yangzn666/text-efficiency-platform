<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useTodayStatusStore } from '@/stores/todayStatus'

const store = useTodayStatusStore()

// ---------- 科目页签（颜色与全站 store 保持一致） ----------
const subjectTabs = [
  { key: 'math', label: '数学一', icon: '📐', color: '#67C23A' },
  { key: 'cs408', label: '408计算机', icon: '💻', color: '#409EFF' },
  { key: 'english', label: '英语一', icon: '📖', color: '#E6A23C' },
  { key: 'politics', label: '政治', icon: '🚩', color: '#F56C6C' },
  { key: 'general', label: '高效学习', icon: '🧠', color: '#64748b' }
]

const studyMethods = {
  math: {
    title: '数学一', icon: '📐', color: '#67C23A',
    intensive: {
      period: '7月-9月 · 强化期',
      focus: '强化期核心 = 做题 + 复盘。数学就是【思路 + 计算】两点，即【理解 + 熟练度】。需要足够的刷题量，选一本主流习题册从头刷到尾。',
      actions: [
        { tag: '刷题', title: '1000题B组收尾', detail: '限时15分钟/题，卡壳立刻标记。二刷听《宇哥带你刷千题》解析，重点记录"关键破题点"。' },
        { tag: '刷题', title: '660题三轮贯穿', detail: '选择填空为主，难度贴近真题。一轮跟强化课刷，二轮全部动手做，冲刺只过错题和不会的题。' },
        { tag: '错题', title: '错题不抄本', detail: '20题错10题：先理解答案，次日看新课前独立重做这10题。错5题以内：先往下走，全章学完再回头二刷。' },
        { tag: '计算', title: '计算是生命线', detail: '三大计算（极限/求导/积分）天天练。考场上要一直算到最后一刻，计算是考研数学的重点。' },
        { tag: '比例', title: '听课:做题 = 1:3', detail: '看完视频立即做题，不要沉迷听课。听课很爽做题就废，做题才是关键。' },
        { tag: '复盘', title: '对着导图多次复盘', detail: '网上找对应习题册的题型整理，结合思维导图反复回顾，把零散知识点整合成体系。' }
      ],
      rhythm: { morning: '强化视频1讲 + 对应习题 (2.5h)', afternoon: '660/880 按题型刷 + 错题重做 (2h)', evening: '错题复盘 + 思维导图补充 (1h)' }
    },
    corePrinciples: [
      { title: '思维导图法', desc: '每章学完画知识框架图，理清知识点间的逻辑关系，不断完善形成"有生命"的导图。考前查缺补漏的最佳工具。', star: '⭐⭐⭐⭐⭐' },
      { title: '费曼学习法', desc: '找水平相当的同学互相讲解，或自己自言自语地讲。能清晰讲出来才算真正掌握。适用于学完一章、做错题后、考前快速过知识点。', star: '⭐⭐⭐⭐⭐' },
      { title: '一本保本两本血赚', desc: '千万不要要求自己把所有习题集做光。做完2本后应总结做题思路、形成自己的方法，把零散知识整合起来，进入冲刺而非继续买新题。', star: '⭐⭐⭐⭐⭐' },
      { title: '真题为王', desc: '真题反映命题规律和趋势，至少刷3遍。一遍按年份适应节奏，二遍按题型总结规律，三遍重做错题查缺补漏。', star: '⭐⭐⭐⭐⭐' }
    ],
    toolkit: [
      { icon: '🗣️', title: '费曼讲解法', when: '学完一章 / 做错题后', steps: ['合上书，假装给一个零基础的同学讲这个定理或题型', '讲卡壳的地方就是没真懂的地方，回去重看对应内容', '用大白话而不是术语，能让外行听懂才算过关', '进阶：把讲解写成文字发给AI，让它挑逻辑漏洞'] },
      { icon: '🔁', title: '错题重做法', when: '每天 / 每章结束', steps: ['错题不抄本，只标记页码题号（抄题是伪勤奋）', '次日看新课前，独立重做昨日错题，不看答案', '还错的再标记，周末集中三刷，直到全对', '每题问自己：为什么错？正确思路？下次怎么识别？'] },
      { icon: '🧮', title: '计算天天练', when: '每天15分钟', steps: ['三大计算（极限/求导/积分）每天各练2-3题', '限时训练，算到底，不许"思路会了就跳过"', '草稿纸写工整，方便回查具体哪一步出错', '计算力靠每天积累，考场要算到最后一刻'] },
      { icon: '🗺️', title: '思维导图法', when: '每章学完', steps: ['合上书凭记忆画本章知识框架，画不出=没掌握', '标注知识点间的联系、易混点和适用条件', '每学完一章就把新内容挂到已有导图上', '考前只看导图，快速过完整知识体系'] },
      { icon: '✍️', title: '证明题四分类攻坚', when: '强化专题 / 遇证明题', steps: ['先分四类：①中值定理类(罗尔/拉格朗日/柯西/泰勒) ②不等式证明 ③数列极限存在性 ④积分不等式', '辅助函数构造套路：积分还原法(把结论中的导数项还原成原函数F(x))、指数因子法(乘e^∫g(x)dx凑导数)、泰勒展开、柯西中值', '四步流程：先跟老师记经典构造(非现场硬想)→按题型分类刷题→扩充自己体系→输出总结', '性价比：证明题第一问常送分必拿，难题别死磕，时间留给计算大题'] },
      { icon: '🖊️', title: '草稿纸检查法', when: '做题 / 模拟', steps: ['黑笔做第一遍，红笔专门用来检查', '红笔检查当作独立的第二遍，而不是"有空再看"', '数学一计算量极大，检查能救回大量"会做但算错"的分', '从现在做880就开始练这个习惯'] },
      { icon: '⏱️', title: '选填限时训练', when: '每天', steps: ['每天10选择+6填空，限时40-70分钟', '选填占80分，是性价比最高的得分区', '限时能逼出考场节奏感', '从现在就加进日常，比硬刷难题更稳赚'] },
      { icon: '📅', title: '真题早接触', when: '每章复习完', steps: ['每复习完一章就做对应章节的真题分类题', '不用等到9月，基础强化期就并行做', '真题不是用来"测"的，是用来校准方向', '帮你判断哪些是真正考的、哪些是讲义过度展开'] },
      { icon: '📚', title: '线代先做后听法', when: '线代强化', steps: ['先硬着头皮独立做李永乐辅导讲义', '卡住了再回去听对应章节的课', '逼自己主动回忆，而不是被动接收', '线代特点：看课都懂、做题就废，先做能破'] },
      { icon: '🧩', title: '自己动手总结法', when: '每章 / 每专题', steps: ['思维导图和题型总结要自己动手做', '不要下载别人的——知识只有自己加工才长在身上', '输出即学习：边总结边用费曼法讲出来', '这个过程"训练神经元"，比收藏有用得多'] },
      { icon: '🤖', title: 'AI辅助学习', when: '卡壳 / 想检验时', ai: true, steps: ['概念不懂：让AI用生活例子解释（如"用排队讲极限"）', '错题不会：让AI讲思路，而不是直接抄答案', '让AI出同类型变式题，检验是否真的掌握', '把费曼讲解发给AI，让它指出你哪里讲错了'] }
    ],
    phases: [
      { name: '基础入门', time: '2025.5-12月', duration: '8个月',
        goals: ['完成三门课第一轮系统学习', '理解基本概念和定理（不只记公式，要懂推导）', '掌握三大计算（极限/求导/积分）', '每章画思维导图建立框架'],
        schedule: { morning: '看视频课1讲 (1.5h)', afternoon: '做对应章节习题', evening: '复习+整理笔记+补导图 (1h)' },
        materials: ['同济高数/线代/浙大概率论教材', '武忠祥基础班 / 张宇基础30讲', '李林880基础部分 / 660题 / 1000题A组'],
        warnings: ['每天2-3小时，循序渐进', '听课:做题=1:3，看完立即做题', '基础决定上限，不要急于求成'] },
      { name: '强化提升', time: '2026.1-9月', duration: '核心期', now: true,
        goals: ['深化知识点理解，掌握各类题型解法', '提高解题速度和准确率', '完善知识体系，建立错题复盘机制'],
        subPhases: [
          { name: '强化学习', tasks: ['看强化视频（武忠祥/张宇/李永乐）', '做强化习题（880强化 / 1000题BC组）', '整理错题，完善思维导图'] },
          { name: '专题突破', tasks: ['李林108 或 武忠祥十七堂课（选一本）', '按题型针对薄弱环节刷题', '难度大的专题看B站教学视频'] }],
        schedule: { morning: '强化视频+习题 (2h)', afternoon: '专题突破+错题整理 (1.5h)', evening: '完善导图+回顾 (1h)' },
        materials: ['武忠祥/张宇/李永乐强化班', '李林880强化 / 1000题BC组 / 660题', '李林108 或 武忠祥十七堂课'],
        warnings: ['每天3-4小时', '核心是做题+复盘', '数学就是思路+计算两点'] },
      { name: '真题攻坚', time: '2026.9-10月', duration: '2个月',
        goals: ['完成2005-2025真题训练', '查缺补漏，适应考试节奏', '总结命题规律'],
        subPhases: [
          { name: '早期真题', tasks: ['2005-2020年，每周2-3套', '对答案统计得分，分析错因', '整理错题本，总结命题规律'] },
          { name: '近期真题', tasks: ['2021-2025年，每周2套', '最能反映当前命题趋势'] }],
        schedule: { morning: '严格计时做真题 8:30-11:30 (3h)', afternoon: '详细复盘分析 (2h)', evening: '针对性补薄弱点 (1h)' },
        materials: ['2005-2025真题（至少20年）', '李艳芳真题解析（强推）/ 张宇真题解析', '喻老真题讲解（B站）'],
        warnings: ['严格按考试时间 8:30-11:30', '模拟考场环境', '每套卷子认真复盘'] },
      { name: '冲刺模拟', time: '2026.11-12月', duration: '2个月',
        goals: ['保持做题手感', '最后查缺补漏', '调整心态迎考'],
        subPhases: [
          { name: '11月', tasks: ['重做2020-2025真题（每周2套）', '模拟卷：李林6+4 / 张宇8+4 / 合工大超越', '张宇临门一脚（必听）'] },
          { name: '12月', tasks: ['重做错题本', '反复看思维导图', '背重要公式结论', '考前一周不做新题，只看笔记错题'] }],
        schedule: { morning: '真题/模拟卷 8:30-11:30', afternoon: '复盘+查缺补漏 (2h)', evening: '错题回顾+背公式 (1.5h)' },
        materials: ['重做2020-2025真题（二三遍）', '李林6+4 / 张宇8+4 / 合工大超越', '张宇临门一脚（必听）'],
        warnings: ['模拟卷非必须，真题最重要', '考前一天轻松复习早点休息'] }
    ],
    teacherComparison: [
      { name: '武忠祥', style: '前六章质量极高，高数首选，强化班方法论扎实', rating: '⭐⭐⭐⭐⭐', bestFor: '高等数学' },
      { name: '李永乐', style: '线代之王，《线性代数辅导讲义》经典', rating: '⭐⭐⭐⭐⭐', bestFor: '线性代数' },
      { name: '方浩', style: '技巧性强，无穷级数与概率论讲得好', rating: '⭐⭐⭐⭐⭐', bestFor: '概率论/级数' },
      { name: '张宇', style: '思路开阔适合冲高分，基础不好慎跟', rating: '⭐⭐⭐⭐', bestFor: '高分冲刺' },
      { name: '汤家凤', style: '手把手教学，适合基础薄弱', rating: '⭐⭐⭐⭐', bestFor: '打基础' }
    ],
    commonMistakes: [
      { mistake: '只看视频不做题', consequence: '听课很爽做题就废', solution: '听课:做题=1:3，做题才是关键' },
      { mistake: '贪多嚼不烂', consequence: '买了很多习题集每本都没做好', solution: '一本保本两本血赚，精选1-2本吃透' },
      { mistake: '忽视真题', consequence: '不了解命题规律', solution: '真题至少刷3遍' },
      { mistake: '焦虑进度', consequence: '和别人比进度学得不扎实', solution: '你时间充裕，稳扎稳打' },
      { mistake: '不重视计算', consequence: '会做的题也做错', solution: '重视三大计算（极限/求导/积分）' },
      { mistake: '不做错题复盘', consequence: '同样的错误反复犯', solution: '错题反复刷，定期回顾' }
    ],
    examTechniques: {
      timeAllocation: '选填题 60-70分钟（10选择+6填空）+ 大题 110-120分钟（6道大题）',
      strategies: ['选填题：先做会的标记不会的，可用特殊值法排除法', '大题：步骤清晰分步作答，写出相关公式和定理', '证明题：不要全放，至少拿第一问的分', '发卷后瞄一眼整体布局判断卷子类型', '做题顺序：先选填→简单大题→难题→留时间检查']
    },
    resources: [
      { type: '必备习题集', items: ['李林880题 ⭐⭐⭐⭐⭐', '李永乐660题', '张宇1000题'] },
      { type: '必做模拟卷', items: ['李林6+4 ⭐⭐⭐⭐⭐', '张宇8+4', '合工大超越'] },
      { type: '真题解析', items: ['李艳芳真题解析（强推）', '张宇真题解析'] },
      { type: 'B站UP主', items: ['喻老（真题讲解）⭐⭐⭐⭐⭐', '处江湖之远（880习题）', '夜雨教你考研竞赛（证明题）'] }
    ],
    levelAdvice: {
      weak: '选择汤家凤/武忠祥基础班，多做660基础部分，目标110-125分',
      average: '正常节奏按四轮复习法，选武忠祥/张宇，做880题，目标125-135分',
      good: '快速过基础压缩到6个月，多看张宇课程多做难题，目标135-150分'
    }
  },
  cs408: {
    title: '408计算机综合', icon: '💻', color: '#409EFF',
    intensive: {
      period: '7月-9月 · 强化期',
      focus: '7月回顾补漏 → 8-9月主攻大题。每天分给408约4小时，以真题为主，听完一个题型立刻做真题对应题检验。',
      actions: [
        { tag: '回顾', title: '7月：遗忘扫描', detail: '进强化前先检查基础遗忘程度，遗忘内容重点标注、反复记忆，再开始强化。' },
        { tag: '大题', title: '8-9月：大题题型突破', detail: '听网课学各类大题做法（节省思考时间），听完一个题型马上做真题对应题，有时间再做王道课后大题。' },
        { tag: '专题', title: '十大高频专题', detail: '树和图 / 排序查找 / Cache与存储系统 / 指令流水线 / PV与进程同步 / 死锁银行家 / 页面置换 / 子网划分 / TCP拥塞控制 / 算法大题。' },
        { tag: '错题', title: '错题本记三件事', detail: '① 我为什么错 ② 正确思路是什么 ③ 下次遇到同类题怎么做。不要做成抄题本。' },
        { tag: '选择', title: '选择题80分是基本盘', detail: '一轮重点攻选择题，二轮转大题。王道强化课的"骚图"帮你串联知识点间的关联。' },
        { tag: '真题', title: '真题重复率高', detail: '408很多题换个形式再考，把高频题型吃透分数提升明显。09-25年共17套以套卷形式做。' }
      ],
      rhythm: { morning: '王道强化课 / 大题网课 (2h)', afternoon: '真题对应题型 + 王道课后题 (1.5h)', evening: '错题三问复盘 + 知识框架图 (1h)' }
    },
    corePrinciples: [
      { title: '知识体系搭建法', desc: '先认识积木（单科知识点）再拼接积木（跨科联系）。四门课相互关联，可以交叉学习。', star: '⭐⭐⭐⭐⭐' },
      { title: '多思考少死记', desc: '408考察理解能力，要理解原理而不是死记硬背。换个问法就不会，说明没真懂。', star: '⭐⭐⭐⭐⭐' },
      { title: '真题为王', desc: '408真题重复率高，至少刷3遍，每题都要搞懂。有些题会换个形式再考。', star: '⭐⭐⭐⭐⭐' },
      { title: '王道为主', desc: '王道四本书是408备考的核心资料，覆盖90%以上考点，必须吃透。', star: '⭐⭐⭐⭐⭐' }
    ],
    toolkit: [
      { icon: '🧱', title: '知识体系搭建法', when: '每章 / 跨科联系', steps: ['先认"积木"：把单科知识点逐个弄懂', '再"拼接木"：找跨科联系（如计组Cache↔OS页面置换）', '每章学完画思维导图，把新节点挂到知识网络上', '四门课交叉学习，用联系对抗遗忘'] },
      { icon: '📝', title: '大题模板法', when: '强化期', steps: ['每类大题总结固定解题框架（如PV操作四步走）', '听完网课一个题型，立刻做真题对应题检验', '把模板写成自己的话，不要死记硬背', '算法题写注释说明思路，代码不完整也能拿分'] },
      { icon: '📊', title: '真题三刷法', when: '9月起', steps: ['一遍按年份做，适应考试节奏和风格', '二遍按题型分类，总结高频考点和命题套路', '三遍重做错题，408真题重复率高，吃透必涨分', '选择题控制80分钟内，留时间给综合题'] },
      { icon: '🗣️', title: '费曼讲解法', when: '学完一章 / 错题后', steps: ['用自己的话把知识点讲出来（如"什么是死锁"）', '讲不清=没真懂，换个问法就不会说明没理解', '重点讲"为什么"而不是"是什么"', '把讲解发给AI或同学，让对方挑毛病'] },
      { icon: '💡', title: '算法大题分层训练法', when: '强化全程', steps: ['大题=算法设计题约13分，固定三问：算法思想/代码/复杂度，第一三问是送分点', '第一层(跟王道每章)轻量版：读题→一两句话写算法思想→翻答案对核心操作，不写完整代码，攒"题型→数据结构/遍历框架"模式识别', '重灾区是线性表/树/图三章，要重点过', '第二层(强化收尾)3-5天大题专项：历年真题+王道模拟，限时动笔写完整代码，转成考场20分钟写对', '别现在逐题硬刚(打断节奏)，也别全押最后(算法是手感型技能)'] },
      { icon: '🔄', title: '主线串行+滚动保温', when: '强化节奏', steps: ['主线一科一科推(DS→CO→OS→CN)，每科集中做扎实王道大题+选择错题+题型套路，给深度+进度感', '不纯一本一本(学了后面忘前面，408是四科一张卷)，也不纯滚动(大题需持续专注才建得起套路)', '每天留30-45min给已完成科目轻量回捞(用费曼间隔复习卡/选择错题)，防遗忘保温而非重学', '比例动态滑动：DS主线时几乎全砸DS，进CO后DS入保温槽，到CN时前三科轮碰，冲刺四科全温直接上套卷'] },
      { icon: '🤖', title: 'AI辅助学习', when: '概念抽象时', ai: true, steps: ['抽象概念（如虚拟内存、TCP拥塞控制）让AI画图/举例子', '让AI把算法题思路一步步讲给你听', '让AI出同考点的选择题变式检验', '用AI快速查证细节，但结论以王道书为准'] }
    ],
    phases: [
      { name: '基础入门', time: '2025.5-2026.6', duration: '13个月',
        goals: ['完成四门课第一轮学习', '理解基本概念和原理', '建立知识体系', '完成王道课后习题'],
        schedule: { morning: '看王道视频课 (2h)', afternoon: '看王道书+做笔记 (1.5h)', evening: '做课后习题 (1h)' },
        methods: ['学习顺序：数据结构→计组→操作系统→计网', '每学完一章整理思维导图', '四门课有联系可交叉学习', '重视理解和实践，不要死记硬背'],
        warnings: ['408内容多要尽早开始', '每天保持2-3小时', '王道课后习题必须做'] },
      { name: '强化提升', time: '2026.7-9月', duration: '3个月', now: true,
        goals: ['第二轮复习加深理解', '大量做题，主攻大题', '总结考点和难点', '建立错题本'],
        schedule: { morning: '刷王道书+做习题 (2h)', afternoon: '专题突破 (1.5h)', evening: '整理错题+总结 (1h)' },
        methods: ['王道四本单科书吃透，课后习题至少2遍', '按专题突破：树和图/存储系统/进程同步/路由协议', '整理笔记和思维导图形成知识网络', '做历年真题选择题了解考试风格'],
        warnings: ['王道书要吃透，这是核心', '错题反复做直到完全掌握', '注重知识点之间的联系'] },
      { name: '真题攻坚', time: '2026.10-11月', duration: '2个月',
        goals: ['系统训练历年真题（2009-2026）', '模拟考试', '查漏补缺'],
        schedule: { morning: '严格计时做一套真题 (3h)', afternoon: '详细分析试卷 (2h)', evening: '针对性复习 (1.5h)' },
        methods: ['历年真题至少做3遍', '严格计时3小时模拟考场', '分析每道错题', '按知识点分类找出高频考点'],
        warnings: ['真题是最宝贵的资源', '选择题控制在80分钟内', '保留最近3年真题作冲刺模拟'] },
      { name: '冲刺模拟', time: '2026.12-考前', duration: '1个月',
        goals: ['模拟题训练', '回归基础', '调整心态'],
        schedule: { morning: '模拟题或重做真题 (2h)', afternoon: '背重点+回顾错题 (1.5h)', evening: '轻量练习 (1h)' },
        methods: ['做高质量模拟题如王道8套卷', '回归基础重温重要概念', '反复看错题本', '按考试时间安排作息'],
        warnings: ['模拟题不要做太多，质量比数量重要', '回归基础不钻偏题怪题', '先易后难注意时间分配'] }
    ],
    teacherComparison: [
      { name: '王道团队', style: '408权威，书籍和视频质量高，强化课"骚图"串联知识点', rating: '⭐⭐⭐⭐⭐', bestFor: '全程核心' },
      { name: '袁春风', style: '南京大学教授，计组讲得深入浅出，配套《计算机系统基础》', rating: '⭐⭐⭐⭐⭐', bestFor: '计算机组成原理' },
      { name: '蒋炎岩（jyy）', style: '南京大学，操作系统并发/PV操作讲得透彻，专治理解难点', rating: '⭐⭐⭐⭐⭐', bestFor: '操作系统' },
      { name: '湖科大教书匠', style: '计网讲得清晰，补充王道不足', rating: '⭐⭐⭐⭐', bestFor: '计网专项' },
      { name: '中科大郑烇', style: '《计算机网络：自顶向下方法》配套课，计网经典', rating: '⭐⭐⭐⭐', bestFor: '计网专项' }
    ],
    commonMistakes: [
      { mistake: '开始太晚', consequence: '408内容多后期压力大', solution: '尽早开始，至少提前1年' },
      { mistake: '只看不练', consequence: '眼高手低考场上不会做题', solution: '王道课后习题必须做' },
      { mistake: '忽视真题', consequence: '不了解考试风格', solution: '真题至少刷3遍' },
      { mistake: '死记硬背', consequence: '换个问法就不会了', solution: '理解原理多思考' },
      { mistake: '不建体系', consequence: '知识点零散综合运用差', solution: '每章画思维导图建知识网络' },
      { mistake: '忽视算法题', consequence: '算法大题丢分', solution: '熟练掌握常见算法，多练手写代码' }
    ],
    examTechniques: {
      timeAllocation: '选择题 80分钟 + 综合题 100分钟',
      strategies: ['选择题快速准确，控制在80分钟内', '综合题先审题理清思路再作答', '算法题写注释说明思路，代码不完整也有分', '不会的题不要空着，写相关知识点可能有分']
    },
    resources: [
      { type: '核心书籍', items: ['王道四本单科书', '王道历年真题解析'] },
      { type: '视频课', items: ['王道全程班', 'B站王道官方账号'] },
      { type: '辅助资料', items: ['天勤数据结构', '月暗哥笔记', 'Beokayy笔记'] },
      { type: '模拟卷', items: ['王道8套卷', '王道4套卷'] }
    ],
    levelAdvice: {
      weak: '跨专业考生：从数据结构开始循序渐进，多花时间理解概念',
      average: '本专业基础一般：按正常进度，重点攻克薄弱环节',
      good: '本专业基础好：可加快速度，重点刷真题和模拟题'
    }
  },
  english: {
    title: '英语一', icon: '📖', color: '#E6A23C',
    intensive: {
      period: '7月-9月 · 强化期',
      focus: '得阅读者得天下（阅读占50分）。真题阅读刷三遍，单词每天100个不断线。英语没有模拟题，只有真题。',
      actions: [
        { tag: '一刷', title: '裸刷摸底', detail: '计时18-20分钟/篇，不硬用技巧。错题复盘时搞懂为什么错，生词一半猜一半查，查漏补缺。' },
        { tag: '二刷', title: '技巧上手', detail: '不看翻译硬读，把握情感倾向。先题干→再文章→再选项，分段做题。判断每个选项错在哪：张冠李戴/主语错误/描述错误。' },
        { tag: '三刷', title: '精准匹配', detail: '把每个选项对应的原文位置标出来，旁写abcd。梳理行文逻辑，把握主旨态度，不会的词汇加强记忆。' },
        { tag: '单词', title: '每天100个底线', detail: '不背单词APP + 红宝书 + 艾宾浩斯。断两三天就2倍补回来，底线是每天100个，不能中断。' },
        { tag: '精读', title: '精读五步法', detail: '通读全文 → 逐句翻译 → 分析题目 → 总结错题 → 背诵好句。长难句每天拆解3-5个真题句。' },
        { tag: '听课', title: '错题才看解析', detail: '唐迟方法论课别开2倍速（最快1.5），做好笔记。做完真题后只针对错题看讲解，省时间。' }
      ],
      rhythm: { morning: '背单词100个 (30min) + 精读真题阅读1篇 (1.5h)', afternoon: '长难句拆解 + 翻译练习 (30min)', evening: '复习单词 + 错题题型归类 (30min)' }
    },
    corePrinciples: [
      { title: '单词是基础', desc: '5500考研词汇必须滚瓜烂熟，每天都要背。结合真题语境记忆，重点关注熟词僻义。', star: '⭐⭐⭐⭐⭐' },
      { title: '阅读是核心', desc: '得阅读者得天下，阅读理解占50分。阅读不是翻译，而是找逻辑对应。', star: '⭐⭐⭐⭐⭐' },
      { title: '真题是关键', desc: '英语没有模拟题只有真题，真题至少刷3遍。模拟题质量参差不齐，别浪费时间。', star: '⭐⭐⭐⭐⭐' },
      { title: '作文靠模板', desc: '提前准备自己的模板，不要考前临时抱佛脚。形成自己的框架，不要直接背别人的。', star: '⭐⭐⭐⭐' }
    ],
    toolkit: [
      { icon: '📖', title: '精读五步法', when: '每天1篇真题阅读', steps: ['通读全文，计时18-20分钟，不硬用技巧', '逐句翻译，长难句拆分主干和修饰', '分析题目：定位原文→对比选项→找出干扰项错法', '总结错题：张冠李戴/主语错误/描述错误各归一类', '背诵好句，积累写作素材'] },
      { icon: '🔤', title: '单词艾宾浩斯法', when: '每天30分钟', steps: ['每天100个是底线，断了要2倍补回来', '用APP（不背单词/墨墨）自动安排复习曲线', '结合真题语境记，重点关注熟词僻义', '阅读中不认识的词单独记入生词本'] },
      { icon: '✂️', title: '长难句拆解法', when: '每天3-5句', steps: ['先找主干（主谓宾），再看修饰（定状补）', '标出连接词，判断从句类型', '翻译时先主干后修饰，符合中文语序', '坚持拆真题句，比看语法书有效'] },
      { icon: '✍️', title: '作文模板积累法', when: '9月起', steps: ['分类整理：图表/图画/话题各准备框架', '背万能句型，但组合成自己的模板', '每周动手写1-2篇，不能只看不练', '写完找人/AI批改，重点看逻辑和语法错误'] },
      { icon: '🤖', title: 'AI辅助学习', when: '随时', ai: true, steps: ['长难句看不懂：发给AI，让它拆分结构并逐段翻译', '作文写完：让AI批改，指出语法错误和逻辑问题', '让AI解释某个熟词僻义在真题中的用法', '阅读错题：让AI分析干扰项为什么错'] }
    ],
    phases: [
      { name: '词汇积累', time: '现在-持续', duration: '贯穿全程',
        goals: ['掌握5500考研核心词汇', '熟悉高频词组和搭配', '能够识别熟词僻义'],
        schedule: { morning: '背单词50-100个（墨墨/不背单词）30min', afternoon: '复习昨日单词 20min', evening: '阅读外刊或真题文章1篇 30min' },
        methods: ['用APP背单词利用艾宾浩斯曲线', '结合真题语境记忆', '制作个人生词本', '重点关注动词形容词副词', '学会识别熟词僻义'],
        warnings: ['单词每天都要背不能中断', '不要只在APP上认识，要在阅读中能识别', '重点关注真题高频词'] },
      { name: '阅读专项', time: '2025.6-2026.9', duration: '15个月', now: true,
        goals: ['掌握阅读理解解题技巧', '提高长难句分析能力', '培养英语思维'],
        schedule: { morning: '精读真题阅读1篇 (1.5h)', afternoon: '分析长难句+翻译练习 30min', evening: '复习单词+泛读外刊 30min' },
        methods: ['精读五步法：通读→逐句翻译→分析题目→总结错题→背诵好句', '总结出题规律：主旨/细节/推理/态度/词义题', '分析干扰项特征'],
        warnings: ['得阅读者得天下必须高度重视', '不要只对答案，要分析为什么错', '学会定位关键信息'] },
      { name: '小三门突破', time: '2026.10-12月', duration: '3个月',
        goals: ['掌握完形填空解题技巧', '熟悉新题型解题方法', '提高翻译准确性'],
        schedule: { morning: '完形填空1篇 30min', afternoon: '新题型1篇 40min', evening: '翻译5句 30min' },
        methods: ['完形：考察词汇辨析语法结构逻辑关系', '新题型：找关键词逻辑词指代关系', '翻译：拆分句子结构，先主干后修饰'],
        warnings: ['完形控制在15分钟内', '新题型掌握技巧很容易拿满分', '翻译要忠实原文'] },
      { name: '写作冲刺', time: '2026.9-考前', duration: '4个月',
        goals: ['掌握写作模板和句型', '形成自己的写作框架', '积累高分表达'],
        schedule: { morning: '背诵优秀范文1篇 30min', afternoon: '练习写作1篇（大小作文交替）1h', evening: '修改润色+积累好句 30min' },
        methods: ['6-8月：准备模板整理万能句型', '9-10月：形成自己的模板，每周练1-2篇', '11-12月：背模板模拟考试，找人批改'],
        warnings: ['作文要动手写不能只看', '找老师或同学批改', '字迹工整很重要'] }
    ],
    teacherComparison: [
      { name: '唐迟', style: '阅读逻辑清晰方法论强，重逻辑讲技巧', rating: '⭐⭐⭐⭐⭐', bestFor: '阅读理解' },
      { name: '王江涛', style: '作文权威，模板实用', rating: '⭐⭐⭐⭐⭐', bestFor: '写作' },
      { name: '田静', style: '语法讲解细致，适合基础薄弱', rating: '⭐⭐⭐⭐', bestFor: '长难句' },
      { name: '刘晓艳', style: '幽默风趣激励人心', rating: '⭐⭐⭐⭐', bestFor: '全程陪伴' }
    ],
    commonMistakes: [
      { mistake: '单词背了不用', consequence: '只在APP上认识，阅读中不认识', solution: '结合真题语境记忆' },
      { mistake: '阅读只对答案', consequence: '不知道错在哪，下次还错', solution: '详细分析每道题' },
      { mistake: '不做真题做模拟', consequence: '模拟题质量参差不齐', solution: '英语只有真题' },
      { mistake: '作文考前才准备', consequence: '临时抱佛脚写不出东西', solution: '提前3-4个月准备' },
      { mistake: '忽视小三门', consequence: '白白丢掉30分', solution: '小三门性价比高' },
      { mistake: '字迹潦草', consequence: '影响阅卷老师印象', solution: '平时练习注意字迹工整' }
    ],
    examTechniques: {
      timeAllocation: '完形15min + 阅读70min + 新题型20min + 翻译25min + 小作文25min + 大作文35min',
      strategies: ['先做阅读，因为分值最高', '完形填空放在最后', '作文一定要写完，时间不够也要写框架', '涂卡留出5分钟时间']
    },
    resources: [
      { type: '词汇', items: ['考研英语大纲词汇', '恋练有词', '红宝书'] },
      { type: '真题', items: ['《考研真相》', '《黄皮书》', '历年真题（2005-2026）'] },
      { type: '阅读', items: ['唐迟《阅读的逻辑》', '真题阅读手译本'] },
      { type: '写作', items: ['王江涛高分写作', '潘赟九宫格写作'] },
      { type: '语法', items: ['田静句句真研', '刘晓艳语法长难句'] }
    ],
    levelAdvice: {
      weak: '四级未过：从单词和语法开始，先打好基础再攻阅读',
      average: '四级刚过：重点攻阅读，同时准备作文模板',
      good: '六级500+：可加快进度，重点突破阅读和写作高分'
    }
  },
  politics: {
    title: '政治', icon: '🚩', color: '#F56C6C',
    intensive: {
      period: '7月-9月 · 启动期',
      focus: '7月启动正当时。徐涛强化课 + 肖1000题，选择题是生命线。前期重点仍给数学和408，政治每天2小时内。',
      actions: [
        { tag: '顺序', title: '五科时间分配', detail: '马原18天 → 史纲11天 → 思修6天 → 毛中特14天 → 时政3天。马原最难要理解透，毛中特最多靠记忆。' },
        { tag: '节奏', title: '听一节练一节', detail: '看徐涛强化课（可倍速），听完立刻刷肖1000对应章节，错题及时订正，不用急着背。' },
        { tag: '避坑', title: '精讲精练要对上', detail: '徐涛课配《核心考案》，但1000题对应肖秀荣《精讲精练》。听完课做1000题正确率低，就去啃精讲精练。' },
        { tag: '重点', title: '多选是拉分王', detail: '政治拉分主要在选择题，多选尤其重要。大题靠后期肖四，现在不用背。' },
        { tag: '理解', title: '马原重理解', detail: '近年政治考得灵活、重理解，纯背诵题在减少。马原的哲学和政治经济学要花时间真正弄懂。' },
        { tag: '心态', title: '不用太早焦虑', detail: '政治7月开始完全来得及，多数同学冲刺学习可考60+。把更多时间投入数学和408。' }
      ],
      rhythm: { morning: '徐涛强化课 (1.5h，可倍速)', afternoon: '肖1000对应章节 (1h)', evening: '错题订正 + 易混点整理 (30min)' }
    },
    corePrinciples: [
      { title: '选择题为王', desc: '政治拉分主要在选择题，多选题尤其重要。选择题决定下限，大题决定上限。', star: '⭐⭐⭐⭐⭐' },
      { title: '理解大于死记', desc: '马原重在理解原理，毛中特重在记忆要点。死记硬背换个问法就不会了。', star: '⭐⭐⭐⭐⭐' },
      { title: '肖秀荣体系为核心', desc: '肖秀荣的书籍和押题是核心必须重视。肖四肖八是神书，大题必须背。', star: '⭐⭐⭐⭐⭐' },
      { title: '时政不可忽视', desc: '时政占16分且与其他科目结合考查，关注全年热点。', star: '⭐⭐⭐⭐' }
    ],
    toolkit: [
      { icon: '✅', title: '选择题刷题法', when: '每天1小时', steps: ['听一节徐涛课，立刻刷肖1000对应章节', '错题及时订正，标记原因（不会/粗心/理解偏差）', '多选题是拉分王，宁可慢一点也要想全', '《1000题》至少刷2-3遍，错题反复做'] },
      { icon: '🗂️', title: '易混点整理法', when: '每章结束', steps: ['整理各种"第一次"/"根本"/"核心"/"本质"类表述', '对比记忆：如"根本原因"vs"直接原因"', '马原的哲学概念和政治经济学要真正理解', '做成卡片或用Anki，定期快速过'] },
      { icon: '📕', title: '肖四背诵法', when: '12月', steps: ['肖四大题必须全部背下来，这是神书', '背诵有技巧：理解逻辑→抓关键词→分点记忆', '不要死记硬背，要能结合材料展开', '最后两周全力背，配合腿姐冲刺手册'] },
      { icon: '🤖', title: 'AI辅助学习', when: '理解困难时', ai: true, steps: ['马原概念抽象：让AI用例子讲清楚（如"用商品讲价值规律"）', '让AI帮你梳理某段历史的时间线和事件联系', '时政热点：让AI总结全年大事及可能考点', '让AI出选择题变式，检验易混点是否分清'] }
    ],
    phases: [
      { name: '前期了解', time: '现在-2026.6', duration: '可选',
        goals: ['了解政治考试基本框架', '关注时事热点'],
        schedule: { morning: '偶尔看看新闻联播', afternoon: '无需专门安排', evening: '浏览肖秀荣公众号' },
        methods: ['偶尔看看新闻联播', '浏览肖秀荣公众号', '了解五部分：马原/毛中特/史纲/思修/时政'],
        warnings: ['政治不用太早开始', '保持对时事的敏感度即可', '前期重点是数学英语和专业课'] },
      { name: '系统学习', time: '2026.7-9月', duration: '3个月', now: true,
        goals: ['完成第一轮系统学习', '掌握基本概念和原理', '做配套选择题'],
        schedule: { morning: '看徐涛视频课 (1.5h)', afternoon: '看《精讲精练》对应章节 1h', evening: '刷《1000题》对应章节 1h' },
        methods: ['组合：徐涛视频课+肖秀荣《精讲精练》+《1000题》', '马原最难要理解透彻', '毛中特内容最多需要记忆', '史纲要理清时间线', '刷《1000题》第一遍标记错题'],
        warnings: ['马原花时间理解哲学和政治经济学', '毛中特结合时政理解', '选择题是关键，特别是多选题'] },
      { name: '强化刷题', time: '2026.10-11月', duration: '2个月',
        goals: ['大量刷选择题', '《1000题》刷2-3遍', '总结错题和易混点'],
        schedule: { morning: '刷《1000题》 (1.5h)', afternoon: '复习错题+背诵要点 1h', evening: '看时政新闻 30min' },
        methods: ['《1000题》至少刷2-3遍', '整理易混淆点：各种"第一次"/"根本"/"核心"', '做肖八选择题部分', '背腿姐《冲刺背诵手册》或徐涛《小黄书》'],
        warnings: ['选择题决定下限必须大量练习', '多选题是难点要特别注意', '错题反复做直到完全掌握'] },
      { name: '冲刺背诵', time: '2026.12-考前', duration: '1个月',
        goals: ['背诵分析题要点', '做肖八肖四', '关注时政热点'],
        schedule: { morning: '背诵肖四大题 (2h)', afternoon: '做肖八选择题+分析 1.5h', evening: '复习背诵手册+时政 1h' },
        methods: ['肖八（11月）：重点做选择题，分析题浏览', '肖四（12月）：选择和大题都认真做，大题必须背', '背诵有技巧：理解逻辑抓关键词分点记忆', '最后两周全力背肖四大题'],
        warnings: ['肖四大题是神书必须全部背下来', '大题要背但别死记硬背，要理解逻辑', '北京地区主观题给分严，选择题更要拿高分'] }
    ],
    teacherComparison: [
      { name: '肖秀荣', style: '政治权威，押题准确，书籍必备', rating: '⭐⭐⭐⭐⭐', bestFor: '全程核心' },
      { name: '徐涛', style: '讲课生动，马原讲得好', rating: '⭐⭐⭐⭐⭐', bestFor: '基础阶段' },
      { name: '腿姐', style: '技巧性强，冲刺背诵手册好用', rating: '⭐⭐⭐⭐⭐', bestFor: '强化冲刺' },
      { name: '米鹏', style: '选择题讲得好', rating: '⭐⭐⭐⭐', bestFor: '选择题专项' },
      { name: '空卡空卡空空卡', style: 'B站政治带背UP主，肖四肖八带背口诀好用，冲刺期必备', rating: '⭐⭐⭐⭐⭐', bestFor: '冲刺带背' }
    ],
    commonMistakes: [
      { mistake: '开始太早', consequence: '前期投入产出比低，后期忘记', solution: '7月开始即可' },
      { mistake: '只看不练', consequence: '选择题正确率低', solution: '《1000题》至少刷2-3遍' },
      { mistake: '忽视多选', consequence: '多选题失分严重', solution: '多选题要特别重视' },
      { mistake: '不背肖四', consequence: '分析题无话可说', solution: '肖四大题必须全部背下来' },
      { mistake: '死记硬背', consequence: '换个问法就不会了', solution: '理解逻辑抓住关键词' },
      { mistake: '忽视时政', consequence: '时政题丢分', solution: '关注全年热点' }
    ],
    examTechniques: {
      timeAllocation: '选择题 50分钟 + 分析题 70分钟',
      strategies: ['选择题快速准确，控制在50分钟内', '多选题宁缺毋滥', '分析题分点作答条理清晰', '结合材料作答，不要脱离材料空谈理论', '字迹工整洁面整洁']
    },
    resources: [
      { type: '核心书籍', items: ['肖秀荣《精讲精练》', '肖秀荣《1000题》', '肖八', '肖四'] },
      { type: '视频课', items: ['徐涛强化班', '腿姐技巧班'] },
      { type: '背诵资料', items: ['腿姐《冲刺背诵手册》', '徐涛《小黄书》', '肖四分析题'] },
      { type: '模拟卷', items: ['肖八', '肖四', '腿姐4套卷', '徐涛6套卷'] }
    ],
    levelAdvice: {
      weak: '理科生政治基础弱：跟着徐涛视频系统学习，多做选择题',
      average: '文科生有一定基础：可加快速度，重点刷选择题和背肖四',
      good: '政治基础好：可适当减少时间，但要保证选择题正确率'
    }
  },
  general: {
    title: '高效学习 & 抗拖延', icon: '🧠', color: '#64748b',
    isGeneral: true,
    corePrinciples: [
      { title: '5分钟启动法', desc: '不想学？告诉自己"只做5分钟"。坐下来开始5分钟后，行为惯性会带着你继续。挡在行动面前的只是最初2分钟的摩擦力。', star: '⭐⭐⭐⭐⭐' },
      { title: '任务具体化', desc: '拒绝"今天学英语"这种模糊指令。改成"背list1前30词+复习昨日错词"。任务越具体，大脑越不会逃避。', star: '⭐⭐⭐⭐⭐' },
      { title: '番茄工作法', desc: '25分钟专注+5分钟休息，或45/15。强迫自己进入"深度学习"窗口。计时器是对抗拖延最有效的武器。', star: '⭐⭐⭐⭐⭐' },
      { title: '物理隔断', desc: '手机放在看不见够不着的地方，桌面只留当前学科资料。混杂环境不断发出诱惑信号，单靠意志力对抗注定失败。', star: '⭐⭐⭐⭐⭐' },
      { title: '即时反馈', desc: '把每日任务写在纸面上，完成一项用力划掉。这种视觉化反馈比任何电子打卡都踏实，是你每天需要的"进度条"。', star: '⭐⭐⭐⭐' },
      { title: '交叉复习', desc: '学不进去这科就换那科。用换科目打破厌学情绪，避免长时间集中在同一门课上导致疲劳和效率下降。', star: '⭐⭐⭐⭐' }
    ],
    toolkit: [
      { icon: '🗣️', title: '费曼学习法（通用）', when: '学完任何知识点', steps: ['第一步：拿出一张白纸，写下你要讲的概念', '第二步：假装教给一个完全不懂的人，用大白话讲', '第三步：讲卡壳的地方就是漏洞，回去重学', '第四步：简化语言、打比方，直到能流畅讲完', '检验标准：外行能听懂=你真懂了'] },
      { icon: '📆', title: '间隔重复（Anki法）', when: '对抗遗忘', steps: ['遗忘规律：学完1天后忘70%，必须及时复习', '复习节点：次日→3天后→1周后→2周后', '用Anki/墨墨等工具自动安排复习卡片', '把易混点、公式、单词做成卡片，碎片时间刷'] },
      { icon: '🍅', title: '番茄工作法', when: '难以专注时', steps: ['25分钟专注+5分钟休息，或45/15节奏', '番茄钟内手机放远，只做当前一件事', '每完成一个番茄打个勾，积累成就感', '状态好就连续做，状态差就只做1个番茄'] },
      { icon: '🗺️', title: '思维导图法', when: '建立体系', steps: ['学完一章合上书凭记忆画框架', '画不出=没掌握，回去补', '把知识点间的逻辑关系画出来', '考前用导图快速过完整体系'] },
      { icon: '🤖', title: 'AI辅助学习', when: '全流程', ai: true, steps: ['把AI当费曼听众：你讲给它听，让它挑毛病', '概念不懂：让AI用生活例子和类比解释', '让AI出变式题检验掌握程度', '让AI帮你总结一章的重点和易错点', '注意：AI是助手不是拐杖，先自己想再问'] }
    ],
    antiProcrastination: [
      { title: '🔥 为什么会拖延（认清根源）',
        items: ['畏难心理：题目难、知识点不会，害怕做错，干脆逃避不做', '目标太大：一想到一堆任务，压力爆棚，无从下手', '完美主义：宁愿不开始也不愿做得不够好', '反馈缺失：努力了但看不到进步，动力消失', '环境诱惑：手机、短视频、游戏触手可及'] },
      { title: '⚡ 7个实战抗拖延技巧',
        items: ['【5分钟启动】不想做题？先拿出题库做1个题。不想背书？先读5分钟。开始了就自然继续', '【任务拆到最小】"背完考研词汇"→"今天背list1前30词"。小到不用耗费意志力就能启动', '【设下限不设上限】告诉自己"只做15分钟，之后可以停"。往往坐下后就会进入状态', '【固定时间固定科目】每天同一时段用同一套动作开始学习，坚持一周身体会形成条件反射', '【找学习搭子】每天互发任务完成截图，让"脸面"成为约束力', '【允许中断但不允许自弃】某天状态差可以只完成3项核心任务，主动调整不算失败', '【连续两天走样立刻复盘】不是咬牙硬撑，而是把难度回调到"能重新完成"的程度'] },
      { title: '📋 每日执行框架',
        items: ['早上：写下今天必须完成的3件决定性任务（不超过3件）', '每个任务写清"时间+动作+内容"，如"14:00-15:30 精读2007-Text1"', '用番茄钟执行：25min专注 + 5min休息，每完成一个打勾', '晚上复盘10分钟：记录进步或卡点，写下明天的解决方案', '完成比完美重要一万倍，放过自己才能轻装上阵'] },
      { title: '🧘 心态管理（持久战必备）',
        items: ['不内耗不自责：偶尔懈怠是正常的，关键是"快速重启"，下一个小时就是新的开始', '不和别人比进度：每个人基础、报考难度、节奏完全不同，强行对标只会打乱自己', '用规律作息治愈焦虑：焦虑的本质是想得多做得少，持续行动可以消解内心焦虑', '别把"休息"变成"消耗"：刷短视频不是休息。真正休息=闭眼/散步/拉伸', '记住：完成 > 完美，每天进步0.5%，累积起来你就是那个人'] }
    ],
    commonMistakes: [
      { mistake: '等"完美时机"再开始', consequence: '拖着拖着别人都二轮了你还在原地', solution: '没有完美时刻，现在就是最好的时机，先做5分钟' },
      { mistake: '以为刷手机是休息', consequence: '大脑被碎片信息刺激更累，放下手机又后悔焦虑', solution: '真正休息：闭眼、散步、喝水、拉伸，远离屏幕' },
      { mistake: '计划定得太满太完美', consequence: '一天没完成就破罐破摔连续摆烂', solution: '每天只定3件核心任务，完成就是胜利' },
      { mistake: '一次中断就全盘放弃', consequence: '一天没学好→这周废了→下个月再说', solution: '中断后立刻重启，下一个小时就是新的开始' },
      { mistake: '只输入不输出', consequence: '看了很多经验贴但从不执行', solution: '看完立刻选1个方法今天就用，行动>收藏' },
      { mistake: '和别人比进度', consequence: '越比越焦虑，越焦虑越学不进去', solution: '只和昨天的自己比，每天进步一点就是胜利' }
    ],
    resources: [
      { type: '时间管理工具', items: ['番茄TODO / Forest（专注计时）', '滴答清单（任务管理）', '手机锁盒 / 专注模式（物理隔断）'] },
      { type: '记忆与复习', items: ['Anki（间隔重复卡片，可自制题库）', '墨墨背单词 / 不背单词（英语词汇）', 'XMind / 幕布（思维导图）'] },
      { type: 'AI学习助手', items: ['AI讲解概念：让它用生活例子解释难点', 'AI当费曼听众：你讲它挑错', 'AI出变式题：检验是否真掌握', 'AI批改作文 / 讲解错题思路'] },
      { type: '抗拖延心法', items: ['5分钟启动法：先做再说', '任务最小化：小到不需要意志力', '固定时间固定地点：形成条件反射', '学习搭子互相监督'] }
    ]
  }
}

// ---------- 当前科目 ----------
const activeSubject = ref('math')
const cm = computed(() => (studyMethods as any)[activeSubject.value])

// ---------- 实时数据（倒计时 / 各科进度） ----------
const daysToExam = computed(() => store.daysToExam)
const overallPrep = computed(() => store.overallPrep.actual)
const progressMap = computed(() => {
  const m: Record<string, number> = {}
  store.plans.forEach((p: any) => { m[p.key] = Math.round((p.completedUnits / p.totalUnits) * 100) })
  return m
})

// ---------- 方法论座右铭轮换 ----------
const mottos = [
  '听课:做题 = 1:3，做题才是硬道理',
  '一本保本，两本血赚，贪多嚼不烂',
  '错题不抄本，重做才是真复盘',
  '得阅读者得天下，得选择者得政治',
  '计算是数学的生命线，坚持到最后一刻',
  '完成大于完美，现在就是最好的时机'
]
const mottoIdx = ref(0)
const currentMotto = computed(() => mottos[mottoIdx.value % mottos.length])
let mottoTimer: ReturnType<typeof setInterval> | null = null

// ---------- 阶段手风琴 ----------
const openPhases = ref<number[]>([1])
const togglePhase = (i: number) => {
  const idx = openPhases.value.indexOf(i)
  if (idx >= 0) openPhases.value.splice(idx, 1)
  else openPhases.value.push(i)
}

const switchSubject = (key: string) => {
  activeSubject.value = key
  openPhases.value = [1]
}

onMounted(() => {
  store.load()
  mottoTimer = setInterval(() => {
    mottoIdx.value = (mottoIdx.value + 1) % mottos.length
  }, 6000)
})
onUnmounted(() => { if (mottoTimer) clearInterval(mottoTimer) })
</script>

<template>
  <div class="methods">
    <!-- ① 作战手册头 -->
    <header class="hero">
      <div class="hero-grid"></div>
      <div class="hero-glow"></div>
      <div class="hero-top">
        <div class="hero-title-block">
          <span class="hero-kicker">STUDY PLAYBOOK · 27考研 · 浙大海宁</span>
          <h1 class="hero-title">学习方法<span class="gold">作战手册</span></h1>
          <div class="hero-phase">
            <span class="phase-pulse"></span>
            当前阶段 · 强化期（7-9月）
          </div>
        </div>
        <div class="hero-stats">
          <div class="hero-stat">
            <span class="stat-num">{{ daysToExam }}</span>
            <span class="stat-label">距初试（天）</span>
          </div>
          <div class="hero-divider"></div>
          <div class="hero-stat">
            <span class="stat-num">{{ overallPrep }}<i>%</i></span>
            <span class="stat-label">整体备考进度</span>
          </div>
        </div>
      </div>
      <div class="hero-motto">
        <transition name="motto-fade" mode="out-in">
          <span :key="mottoIdx">「{{ currentMotto }}」</span>
        </transition>
      </div>
    </header>

    <!-- ② 科目页签 -->
    <nav class="tab-rail">
      <button
        v-for="t in subjectTabs"
        :key="t.key"
        class="tab"
        :class="{ active: activeSubject === t.key }"
        :style="{ '--tab-color': t.color }"
        @click="switchSubject(t.key)"
      >
        <span class="tab-icon">{{ t.icon }}</span>
        <span class="tab-label">{{ t.label }}</span>
        <span v-if="progressMap[t.key] !== undefined" class="tab-prog">{{ progressMap[t.key] }}%</span>
      </button>
    </nav>

    <!-- ③ 内容区 -->
    <div class="content">
      <!-- 强化期作战图 -->
      <section v-if="cm.intensive" class="battle">
        <div class="battle-head">
          <div class="battle-title">
            <span class="battle-pulse" :style="{ background: cm.color }"></span>
            <h2>强化期作战图</h2>
            <span class="battle-period">{{ cm.intensive.period }}</span>
          </div>
          <span class="battle-note">基于最新高分经验贴 · 针对当前阶段</span>
        </div>
        <div class="battle-focus">{{ cm.intensive.focus }}</div>
        <div class="battle-actions">
          <div v-for="(a, i) in cm.intensive.actions" :key="i" class="action">
            <div class="a-top">
              <span class="a-tag" :style="{ background: cm.color + '1f', color: cm.color, borderColor: cm.color + '55' }">{{ a.tag }}</span>
              <strong>{{ a.title }}</strong>
            </div>
            <p>{{ a.detail }}</p>
          </div>
        </div>
        <div class="battle-rhythm">
          <div class="rhythm">
            <span class="r-label">上午</span>
            <p>{{ cm.intensive.rhythm.morning }}</p>
          </div>
          <div class="rhythm">
            <span class="r-label">下午</span>
            <p>{{ cm.intensive.rhythm.afternoon }}</p>
          </div>
          <div class="rhythm">
            <span class="r-label">晚上</span>
            <p>{{ cm.intensive.rhythm.evening }}</p>
          </div>
        </div>
      </section>

      <!-- 核心军规 -->
      <section class="card">
        <div class="card-head">
          <h2>核心军规</h2>
          <span class="head-note">{{ cm.corePrinciples.length }} 条铁律</span>
        </div>
        <div class="principle-list">
          <div v-for="(p, i) in (cm.corePrinciples as any[])" :key="i" class="principle">
            <span class="p-num">{{ String(i + 1).padStart(2, '0') }}</span>
            <div class="p-body">
              <div class="p-top">
                <strong>{{ p.title }}</strong>
                <span class="p-star">{{ p.star }}</span>
              </div>
              <p>{{ p.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 方法论工具箱 -->
      <section v-if="cm.toolkit" class="card">
        <div class="card-head">
          <h2>方法论工具箱</h2>
          <span class="head-note">{{ cm.toolkit.length }} 个方法 · 可直接套用</span>
        </div>
        <div class="toolkit-grid">
          <div v-for="(tk, ti) in (cm.toolkit as any[])" :key="ti" class="toolkit-card" :class="{ 'tk-ai': tk.ai }">
            <div class="tk-head">
              <span class="tk-icon">{{ tk.icon }}</span>
              <div class="tk-title-block">
                <strong>{{ tk.title }}</strong>
                <span class="tk-when">适用 · {{ tk.when }}</span>
              </div>
            </div>
            <ol class="tk-steps">
              <li v-for="(s, si) in tk.steps" :key="si">{{ s }}</li>
            </ol>
          </div>
        </div>
      </section>

      <!-- 专题指南（题型识别决策树 / 题型归类清单，通用） -->
      <section v-if="cm.topicGuide" class="card guide-card">
        <div class="card-head">
          <h2>{{ cm.topicGuide.head }}</h2>
          <span class="head-note">{{ cm.topicGuide.note }}</span>
        </div>
        <p class="guide-intro">{{ cm.topicGuide.intro }}</p>
        <div class="guide-list">
          <div v-for="(g, gi) in (cm.topicGuide.items as any[])" :key="gi" class="guide-item">
            <div class="gi-head">
              <span class="gi-icon">{{ g.icon }}</span>
              <strong>{{ g.title }}</strong>
              <span class="gi-tag">{{ g.tag }}</span>
            </div>
            <ul class="gi-points">
              <li v-for="(p, pi) in g.points" :key="pi">{{ p }}</li>
            </ul>
            <div v-if="g.tip" class="gi-tip">⚠️ {{ g.tip }}</div>
          </div>
        </div>
      </section>

      <!-- 全程阶段规划（手风琴时间轴） -->
      <section v-if="cm.phases" class="card">
        <div class="card-head">
          <h2>全程阶段规划</h2>
          <span class="head-note">点击展开详情</span>
        </div>
        <div class="timeline">
          <div
            v-for="(ph, i) in (cm.phases as any[])"
            :key="i"
            class="phase"
            :class="{ now: ph.now, open: openPhases.includes(i) }"
          >
            <button class="phase-head" @click="togglePhase(i)">
              <span class="phase-dot"></span>
              <span class="phase-num">第{{ i + 1 }}轮</span>
              <span class="phase-name">{{ ph.name }}</span>
              <span class="phase-time">{{ ph.time }} · {{ ph.duration }}</span>
              <span v-if="ph.now" class="phase-now-badge">当前</span>
              <span class="phase-chevron">▾</span>
            </button>
            <div v-show="openPhases.includes(i)" class="phase-body">
              <div class="pb-block">
                <h4>🎯 阶段目标</h4>
                <ul class="pb-list"><li v-for="(g, gi) in ph.goals" :key="gi">{{ g }}</li></ul>
              </div>
              <div v-if="ph.subPhases" class="pb-block">
                <h4>📋 阶段细分</h4>
                <div v-for="(sub, si) in ph.subPhases" :key="si" class="subphase">
                  <strong>{{ sub.name }}</strong>
                  <ul class="pb-list"><li v-for="(t, ti) in sub.tasks" :key="ti">{{ t }}</li></ul>
                </div>
              </div>
              <div v-if="ph.schedule" class="pb-block sched-block">
                <h4>⏰ 每日节奏</h4>
                <div class="sched-row"><span class="s-label">上午</span>{{ ph.schedule.morning }}</div>
                <div class="sched-row"><span class="s-label">下午</span>{{ ph.schedule.afternoon }}</div>
                <div class="sched-row"><span class="s-label">晚上</span>{{ ph.schedule.evening }}</div>
              </div>
              <div v-if="ph.materials || ph.methods" class="pb-block">
                <h4>📖 {{ ph.materials ? '推荐资料' : '学习方法' }}</h4>
                <ul class="pb-list"><li v-for="(m, mi) in (ph.materials || ph.methods)" :key="mi">{{ m }}</li></ul>
              </div>
              <div v-if="ph.warnings" class="pb-block caution-block">
                <h4>⚠️ 注意事项</h4>
                <ul class="pb-list"><li v-for="(w, wi) in ph.warnings" :key="wi">{{ w }}</li></ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 抗拖延实战指南（仅高效学习） -->
      <section v-if="cm.antiProcrastination" class="card">
        <div class="card-head">
          <h2>抗拖延实战指南</h2>
          <span class="head-note">立即开始</span>
        </div>
        <div class="anti-grid">
          <div v-for="(b, bi) in cm.antiProcrastination" :key="bi" class="anti-block">
            <h3>{{ b.title }}</h3>
            <ul class="pb-list"><li v-for="(it, ii) in b.items" :key="ii">{{ it }}</li></ul>
          </div>
        </div>
      </section>

      <!-- 名师推荐 + 考场答题技巧 -->
      <div class="duo">
        <section v-if="cm.teacherComparison" class="card">
          <div class="card-head">
            <h2>名师推荐</h2>
            <span class="head-note">按擅长领域</span>
          </div>
          <div class="teacher-list">
            <div v-for="(t, i) in cm.teacherComparison" :key="i" class="teacher">
              <div class="t-top">
                <strong>{{ t.name }}</strong>
                <span class="t-rating">{{ t.rating }}</span>
              </div>
              <p class="t-style">{{ t.style }}</p>
              <span class="t-best">适用 · {{ t.bestFor }}</span>
            </div>
          </div>
        </section>
        <section v-if="cm.examTechniques" class="card">
          <div class="card-head">
            <h2>考场答题技巧</h2>
            <span class="head-note">实战策略</span>
          </div>
          <div class="time-alloc">
            <span class="ta-label">⏱ 时间分配</span>
            <p>{{ cm.examTechniques.timeAllocation }}</p>
          </div>
          <ol class="strat-list">
            <li v-for="(s, i) in cm.examTechniques.strategies" :key="i">{{ s }}</li>
          </ol>
        </section>
      </div>

      <!-- 常见误区 · 避坑清单 -->
      <section class="card">
        <div class="card-head">
          <h2>常见误区 · 避坑清单</h2>
          <span class="head-note">{{ cm.commonMistakes.length }} 个坑</span>
        </div>
        <div class="mistake-grid">
          <div v-for="(m, i) in cm.commonMistakes" :key="i" class="mistake">
            <div class="m-wrong">❌ {{ m.mistake }}</div>
            <div class="m-conseq">后果 · {{ m.consequence }}</div>
            <div class="m-fix">✅ {{ m.solution }}</div>
          </div>
        </div>
      </section>

      <!-- 按基础分层策略 -->
      <section v-if="cm.levelAdvice" class="card">
        <div class="card-head">
          <h2>按基础分层策略</h2>
          <span class="head-note">对号入座</span>
        </div>
        <div class="level-list">
          <div class="level lv-weak"><span class="lv-tag">基础薄弱</span><p>{{ cm.levelAdvice.weak }}</p></div>
          <div class="level lv-mid"><span class="lv-tag">基础一般</span><p>{{ cm.levelAdvice.average }}</p></div>
          <div class="level lv-good"><span class="lv-tag">基础较好</span><p>{{ cm.levelAdvice.good }}</p></div>
        </div>
      </section>

      <!-- 推荐学习资料 -->
      <section class="card">
        <div class="card-head">
          <h2>推荐学习资料</h2>
          <span class="head-note">精选清单</span>
        </div>
        <div class="res-grid">
          <div v-for="(cat, ci) in cm.resources" :key="ci" class="res-group">
            <h4>{{ cat.type }}</h4>
            <div class="res-tags">
              <span v-for="(it, ii) in cat.items" :key="ii" class="res-tag">{{ it }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.methods {
  --font-display: 'Barlow Condensed', 'Arial Narrow', 'PingFang SC', sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', 'Consolas', monospace;
  --ink: #1f2d3d;
  --body: #303133;
  --muted: #5b6b7f;
  --gold: #ffc53d;
  --navy-deep: #0d2137;
  --navy: #16345c;
  --navy-light: #1e4576;
  --line: #e4ebf3;
  --bg-soft: #f5f8fc;
  max-width: 1380px;
  margin: 0 auto;
  padding: 22px 20px 60px;
  color: var(--body);
  display: flex;
  flex-direction: column;
  gap: 18px;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  -webkit-tap-highlight-color: transparent;
}

/* ==================== ① 作战手册头 ==================== */
.hero {
  position: relative;
  overflow: hidden;
  border-radius: 18px;
  background: linear-gradient(150deg, var(--navy-deep) 0%, var(--navy) 55%, var(--navy-light) 100%);
  color: #fff;
  padding: 32px 38px 26px;
}
.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.045) 1px, transparent 1px);
  background-size: 44px 44px;
  pointer-events: none;
}
.hero-glow {
  position: absolute;
  width: 460px;
  height: 460px;
  right: -140px;
  top: -200px;
  background: radial-gradient(circle, rgba(255, 197, 61, 0.2) 0%, transparent 65%);
  pointer-events: none;
}
.hero-top {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  flex-wrap: wrap;
}
.hero-title-block { display: flex; flex-direction: column; gap: 10px; }
.hero-kicker {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 3px;
  color: #a9c2e0;
  text-transform: uppercase;
}
.hero-title {
  margin: 0;
  font-size: clamp(2rem, 4.5vw, 3rem);
  font-weight: 800;
  letter-spacing: 2px;
  line-height: 1.15;
  color: #fff;
}
.hero-title .gold { color: var(--gold); margin-left: 6px; }
.hero-phase {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  align-self: flex-start;
  font-size: 0.85rem;
  font-weight: 600;
  color: #dbe7f5;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 5px 14px;
  border-radius: 999px;
}
.phase-pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--gold);
  animation: pulse 1.6s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.45; transform: scale(1.35); }
}
.hero-stats { display: flex; align-items: center; gap: 26px; }
.hero-stat { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.stat-num {
  font-family: var(--font-display);
  font-size: clamp(2.6rem, 5vw, 3.8rem);
  font-weight: 700;
  line-height: 1;
  color: var(--gold);
  font-variant-numeric: tabular-nums;
}
.stat-num i { font-style: normal; font-size: 0.5em; color: #dbe7f5; margin-left: 2px; }
.stat-label { font-size: 0.78rem; color: #a9c2e0; letter-spacing: 2px; }
.hero-divider { width: 1px; align-self: stretch; background: rgba(255, 255, 255, 0.16); }
.hero-motto {
  position: relative;
  margin-top: 22px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 0.95rem;
  color: #e8eef7;
  letter-spacing: 1px;
  min-height: 1.6em;
}
.motto-fade-enter-active, .motto-fade-leave-active { transition: opacity 0.5s ease, transform 0.5s ease; }
.motto-fade-enter-from { opacity: 0; transform: translateY(8px); }
.motto-fade-leave-to { opacity: 0; transform: translateY(-8px); }

/* ==================== ② 科目页签 ==================== */
.tab-rail {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  gap: 10px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  border: 1px solid var(--line);
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(22, 52, 92, 0.08);
  overflow-x: auto;
  scroll-snap-type: x proximity;
  scrollbar-width: none;
  -webkit-tap-highlight-color: transparent;
}
.tab-rail::-webkit-scrollbar { display: none; }
.tab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  scroll-snap-align: start;
  padding: 9px 18px;
  border: none;
  border-bottom: 3px solid transparent;
  border-radius: 10px;
  background: transparent;
  cursor: pointer;
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--muted);
  transition: all 0.2s ease;
}
.tab:hover { background: var(--bg-soft); color: var(--ink); transform: translateY(-1px); }
.tab.active {
  color: var(--ink);
  background: color-mix(in srgb, var(--tab-color) 10%, #fff);
  border-bottom-color: var(--tab-color);
}
.tab-icon { font-size: 1.1rem; }
.tab-prog {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--tab-color);
  background: color-mix(in srgb, var(--tab-color) 14%, #fff);
  padding: 2px 8px;
  border-radius: 999px;
}

/* ==================== ③ 通用卡片 ==================== */
.content { display: flex; flex-direction: column; gap: 18px; }
.card {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 24px 26px;
  box-shadow: 0 2px 10px rgba(22, 52, 92, 0.05);
}
.card-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 20px;
}
.card-head h2 {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--ink);
  margin: 0;
  position: relative;
  padding-left: 13px;
}
.card-head h2::before {
  content: '';
  position: absolute;
  left: 0;
  top: 3px;
  bottom: 3px;
  width: 4px;
  border-radius: 2px;
  background: var(--gold);
}
.head-note { font-size: 0.76rem; color: var(--muted); font-family: var(--font-mono); }

/* ==================== 强化期作战图 ==================== */
.battle {
  background: linear-gradient(160deg, #fffdf5, #fff8e6);
  border: 1px solid #f3e5b8;
  border-radius: 18px;
  padding: 26px 28px;
  box-shadow: 0 3px 14px rgba(184, 134, 11, 0.08);
}
.battle-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.battle-title { display: flex; align-items: center; gap: 10px; }
.battle-pulse {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  animation: pulse 1.6s ease-in-out infinite;
}
.battle-title h2 {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--ink);
  letter-spacing: 1px;
}
.battle-period {
  font-family: var(--font-mono);
  font-size: 0.76rem;
  font-weight: 700;
  color: #9a7b2e;
  background: rgba(255, 197, 61, 0.25);
  border: 1px solid #f0d98c;
  padding: 3px 12px;
  border-radius: 999px;
}
.battle-note { font-size: 0.76rem; color: #9a7b2e; font-family: var(--font-mono); }
.battle-focus {
  font-size: 1.02rem;
  font-weight: 600;
  line-height: 1.7;
  color: var(--navy);
  background: rgba(255, 255, 255, 0.7);
  border-left: 4px solid var(--gold);
  border-radius: 0 10px 10px 0;
  padding: 12px 16px;
  margin-bottom: 18px;
}
.battle-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 18px;
}
.action {
  background: #fff;
  border: 1px solid #f0e3b5;
  border-radius: 12px;
  padding: 14px 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.action:hover { transform: translateY(-3px); box-shadow: 0 6px 16px rgba(184, 134, 11, 0.14); }
.a-top { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.a-tag {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 10px;
  border-radius: 999px;
  border: 1px solid;
  flex-shrink: 0;
}
.a-top strong { font-size: 0.95rem; color: var(--ink); }
.action p { margin: 0; font-size: 0.84rem; line-height: 1.65; color: var(--body); }
.battle-rhythm {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}
.rhythm {
  background: var(--navy);
  border-radius: 12px;
  padding: 12px 16px;
  color: #dbe7f5;
}
.r-label {
  display: block;
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--gold);
  margin-bottom: 4px;
}
.rhythm p { margin: 0; font-size: 0.82rem; line-height: 1.55; color: #c8d8ec; }

/* ==================== 核心军规 ==================== */
.principle-list { display: flex; flex-direction: column; gap: 14px; }
.principle {
  display: flex;
  gap: 18px;
  padding: 16px 18px;
  border-radius: 12px;
  background: var(--bg-soft);
  border: 1px solid var(--line);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.principle:hover { transform: translateX(4px); box-shadow: 0 3px 12px rgba(22, 52, 92, 0.08); }
.p-num {
  font-family: var(--font-display);
  font-size: 2.4rem;
  font-weight: 700;
  line-height: 1;
  color: var(--gold);
  text-shadow: 0 1px 0 rgba(184, 134, 11, 0.25);
  flex-shrink: 0;
}
.p-body { flex: 1; min-width: 0; }
.p-top { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; margin-bottom: 4px; }
.p-top strong { font-size: 1.02rem; color: var(--ink); }
.p-star { font-size: 0.8rem; flex-shrink: 0; }
.p-body p { margin: 0; font-size: 0.9rem; line-height: 1.7; color: var(--body); }

/* ==================== 方法论工具箱 ==================== */
.toolkit-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.toolkit-card {
  background: var(--bg-soft);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 18px 20px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.toolkit-card:hover { transform: translateY(-3px); box-shadow: 0 6px 16px rgba(22, 52, 92, 0.09); }
.toolkit-card.tk-ai {
  background: linear-gradient(160deg, #f0f7ff, #e9f1fd);
  border-color: #c9ddf6;
}
.toolkit-card.tk-ai:hover { box-shadow: 0 6px 16px rgba(64, 130, 226, 0.14); }
.tk-head { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; }
.tk-icon { font-size: 1.55rem; line-height: 1.2; flex-shrink: 0; }
.tk-title-block { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.tk-title-block strong { font-size: 1rem; color: var(--ink); }
.tk-when { font-size: 0.72rem; color: var(--muted); font-family: var(--font-mono); letter-spacing: 0.5px; }
.tk-steps { margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 7px; }
.tk-steps li { font-size: 0.86rem; line-height: 1.65; color: var(--body); }
.tk-steps li::marker { color: var(--gold); font-weight: 700; font-family: var(--font-display); }

/* ==================== 专题指南（决策树 / 题型清单） ==================== */
.guide-intro {
  margin: 0 0 18px 0;
  font-size: 0.92rem;
  line-height: 1.75;
  color: var(--navy);
  background: var(--bg-soft);
  border-left: 4px solid var(--gold);
  border-radius: 0 10px 10px 0;
  padding: 12px 16px;
}
.guide-list { display: flex; flex-direction: column; gap: 14px; }
.guide-item {
  border: 1px solid var(--line);
  border-left: 4px solid var(--navy-light);
  border-radius: 12px;
  background: #fff;
  padding: 16px 18px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.guide-item:hover { transform: translateX(4px); box-shadow: 0 3px 12px rgba(22, 52, 92, 0.08); }
.gi-head { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 10px; }
.gi-icon { font-size: 1.3rem; line-height: 1.2; flex-shrink: 0; }
.gi-head strong { font-size: 1rem; color: var(--ink); }
.gi-tag {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--navy);
  background: rgba(22, 52, 92, 0.07);
  padding: 3px 11px;
  border-radius: 999px;
  margin-left: auto;
}
.gi-points { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.gi-points li {
  position: relative;
  padding: 2px 0 2px 18px;
  font-size: 0.87rem;
  line-height: 1.65;
  color: var(--body);
}
.gi-points li::before {
  content: '';
  position: absolute;
  left: 2px;
  top: 11px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--gold);
}
.gi-tip {
  margin-top: 10px;
  font-size: 0.83rem;
  line-height: 1.6;
  color: #c08a1e;
  background: #fff6ec;
  border-radius: 8px;
  padding: 8px 12px;
}

/* ==================== 阶段时间轴（手风琴） ==================== */
.timeline { display: flex; flex-direction: column; gap: 12px; }
.phase {
  border: 1px solid var(--line);
  border-left: 4px solid #c9d6e5;
  border-radius: 12px;
  background: #fff;
  overflow: hidden;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.phase.now { border-left-color: var(--gold); background: #fffdf5; }
.phase.open { box-shadow: 0 3px 12px rgba(22, 52, 92, 0.07); }
.phase-head {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 15px 18px;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
}
.phase-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #c9d6e5;
  flex-shrink: 0;
}
.phase.now .phase-dot { background: var(--gold); animation: pulse 1.6s ease-in-out infinite; }
.phase-num {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  color: var(--navy);
  background: rgba(22, 52, 92, 0.07);
  padding: 3px 12px;
  border-radius: 999px;
  flex-shrink: 0;
}
.phase-name { font-weight: 700; color: var(--ink); font-size: 1rem; }
.phase-time { font-family: var(--font-mono); font-size: 0.74rem; color: var(--muted); margin-left: auto; }
.phase-now-badge {
  font-size: 0.68rem;
  font-weight: 700;
  color: #9a7b2e;
  background: rgba(255, 197, 61, 0.3);
  border: 1px solid #f0d98c;
  padding: 2px 10px;
  border-radius: 999px;
  flex-shrink: 0;
}
.phase-chevron { color: var(--muted); transition: transform 0.25s ease; flex-shrink: 0; }
.phase.open .phase-chevron { transform: rotate(180deg); }
.phase-body {
  padding: 4px 20px 20px 44px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.pb-block h4 { margin: 0 0 8px 0; font-size: 0.92rem; font-weight: 700; color: var(--navy); }
.pb-list { list-style: none; margin: 0; padding: 0; }
.pb-list li {
  position: relative;
  padding: 4px 0 4px 18px;
  font-size: 0.88rem;
  line-height: 1.65;
  color: var(--body);
}
.pb-list li::before {
  content: '';
  position: absolute;
  left: 2px;
  top: 12px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--gold);
}
.subphase {
  background: var(--bg-soft);
  border-radius: 10px;
  padding: 12px 14px;
  margin-bottom: 10px;
}
.subphase:last-child { margin-bottom: 0; }
.subphase strong { display: block; font-size: 0.88rem; color: var(--navy); margin-bottom: 6px; }
.sched-block { background: #f3f0fb; border-radius: 10px; padding: 12px 14px; }
.sched-row { font-size: 0.86rem; color: var(--body); padding: 4px 0; line-height: 1.6; }
.s-label {
  display: inline-block;
  font-weight: 700;
  color: #6d5bb8;
  min-width: 44px;
  margin-right: 8px;
}
.caution-block { background: #fff6ec; border-radius: 10px; padding: 12px 14px; }
.caution-block .pb-list li::before { background: #e6a23c; }

/* ==================== 抗拖延（高效学习） ==================== */
.anti-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.anti-block {
  background: var(--bg-soft);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 18px 20px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.anti-block:hover { transform: translateY(-3px); box-shadow: 0 5px 14px rgba(22, 52, 92, 0.08); }
.anti-block h3 { margin: 0 0 12px 0; font-size: 1rem; font-weight: 700; color: var(--ink); }

/* ==================== 名师 + 答题技巧 ==================== */
.duo { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; align-items: start; }
.teacher-list { display: flex; flex-direction: column; gap: 12px; }
.teacher {
  padding: 14px 16px;
  border-radius: 12px;
  background: var(--bg-soft);
  border: 1px solid var(--line);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.teacher:hover { transform: translateX(4px); box-shadow: 0 3px 12px rgba(22, 52, 92, 0.08); }
.t-top { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; margin-bottom: 4px; }
.t-top strong { font-size: 1rem; color: var(--ink); }
.t-rating { font-size: 0.78rem; }
.t-style { margin: 0 0 8px 0; font-size: 0.86rem; line-height: 1.6; color: var(--body); }
.t-best {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--navy);
  background: rgba(22, 52, 92, 0.07);
  padding: 3px 10px;
  border-radius: 999px;
}
.time-alloc {
  background: rgba(22, 52, 92, 0.06);
  border-radius: 10px;
  padding: 12px 16px;
  margin-bottom: 16px;
}
.ta-label { display: block; font-size: 0.78rem; font-weight: 700; color: var(--navy); margin-bottom: 4px; }
.time-alloc p { margin: 0; font-size: 0.9rem; font-weight: 600; color: var(--ink); line-height: 1.6; }
.strat-list { margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 8px; }
.strat-list li { font-size: 0.88rem; line-height: 1.65; color: var(--body); }
.strat-list li::marker { color: var(--gold); font-weight: 700; }

/* ==================== 常见误区 ==================== */
.mistake-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.mistake {
  border-radius: 12px;
  border: 1px solid var(--line);
  border-left: 4px solid #f56c6c;
  background: #fffafa;
  padding: 15px 17px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.mistake:hover { transform: translateY(-3px); box-shadow: 0 5px 14px rgba(217, 79, 79, 0.1); }
.m-wrong { font-weight: 700; color: #d94f4f; font-size: 0.95rem; margin-bottom: 6px; }
.m-conseq { font-size: 0.82rem; color: var(--muted); margin-bottom: 8px; }
.m-fix { font-size: 0.86rem; font-weight: 600; color: #4a9c2d; background: #f0faea; border-radius: 8px; padding: 8px 10px; }

/* ==================== 分层策略 ==================== */
.level-list { display: flex; flex-direction: column; gap: 12px; }
.level {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  border-radius: 12px;
  border: 1px solid var(--line);
  padding: 14px 16px;
}
.level p { margin: 0; font-size: 0.88rem; line-height: 1.65; color: var(--body); flex: 1; }
.lv-tag {
  font-size: 0.78rem;
  font-weight: 700;
  padding: 3px 12px;
  border-radius: 999px;
  flex-shrink: 0;
}
.lv-weak { border-left: 4px solid #f56c6c; background: #fffafa; }
.lv-weak .lv-tag { background: #fde8e8; color: #d94f4f; }
.lv-mid { border-left: 4px solid #e6a23c; background: #fffcf5; }
.lv-mid .lv-tag { background: #fdf3e0; color: #c08a1e; }
.lv-good { border-left: 4px solid #67c23a; background: #fafff7; }
.lv-good .lv-tag { background: #e8f7e0; color: #4a9c2d; }

/* ==================== 推荐资料 ==================== */
.res-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
.res-group {
  background: var(--bg-soft);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 16px 18px;
}
.res-group h4 {
  margin: 0 0 12px 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--navy);
  padding-bottom: 8px;
  border-bottom: 2px solid var(--gold);
}
.res-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.res-tag {
  font-size: 0.8rem;
  color: var(--body);
  background: #fff;
  border: 1px solid var(--line);
  padding: 5px 12px;
  border-radius: 999px;
  transition: all 0.2s ease;
}
.res-tag:hover { border-color: var(--navy); color: var(--navy); transform: translateY(-1px); }

/* ==================== 响应式 ==================== */
@media (max-width: 1080px) {
  .battle-actions { grid-template-columns: 1fr 1fr; }
  .duo { grid-template-columns: 1fr; }
}
@media (max-width: 860px) {
  .battle-actions, .battle-rhythm { grid-template-columns: 1fr; }
  .mistake-grid, .anti-grid, .toolkit-grid { grid-template-columns: 1fr; }
  .hero-stats { width: 100%; justify-content: flex-start; }
  .hero { padding: 28px 24px 22px; }
  .card { padding: 20px 18px; }
  .battle { padding: 22px 20px; }
}
@media (max-width: 600px) {
  .methods { padding: 14px 12px 40px; gap: 14px; }
  .content { gap: 14px; }
  .hero { padding: 24px 18px 20px; border-radius: 14px; }
  .hero-top { gap: 18px; }
  .hero-stats { gap: 18px; }
  .stat-num { font-size: 2.2rem; }
  .hero-motto { font-size: 0.85rem; margin-top: 16px; padding-top: 12px; }
  .tab-rail { padding: 8px 10px; gap: 6px; border-radius: 12px; }
  .tab { padding: 8px 14px; font-size: 0.86rem; }
  .card { padding: 18px 15px; border-radius: 14px; }
  .card-head { margin-bottom: 16px; }
  .card-head h2 { font-size: 1.08rem; }
  .battle { padding: 20px 16px; }
  .battle-title h2 { font-size: 1.2rem; }
  .battle-focus { font-size: 0.95rem; padding: 10px 14px; }
  .phase-head { padding: 13px 14px; gap: 9px; }
  .phase-body { padding: 4px 16px 16px 20px; }
  .phase-time { display: none; }
  .principle { gap: 12px; padding: 14px 14px; }
  .p-num { font-size: 1.8rem; }
  .tk-steps { padding-left: 16px; }
  .res-grid { grid-template-columns: 1fr; }
}
@media (max-width: 400px) {
  .methods { padding: 12px 10px 36px; }
  .hero { padding: 20px 15px 18px; }
  .hero-title { letter-spacing: 1px; }
  .stat-num { font-size: 1.9rem; }
  .tab { padding: 7px 11px; font-size: 0.82rem; gap: 6px; }
  .tab-icon { font-size: 1rem; }
  .card { padding: 16px 13px; }
  .action, .rhythm { padding: 12px 13px; }
  .principle { padding: 12px 12px; }
  .p-top { flex-wrap: wrap; }
  .level { flex-direction: column; gap: 8px; }
}

/* 动效可访问性 */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>

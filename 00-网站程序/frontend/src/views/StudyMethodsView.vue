<script setup lang="ts">
import { ref, computed } from 'vue'
import { Reading, Document, EditPen, TrendCharts, StarFilled, WarningFilled, CircleCheck, Lightning, Trophy, Timer } from '@element-plus/icons-vue'

const activeSubject = ref('math')
const studyMethods = {
  math: {
    title: '数学一', icon: '📐', color: '#667eea',
    examDate: '2026年12月', totalTime: '19个月(2025.5-2026.12)',
    corePrinciples: [
      { title: '思维导图法', desc: '每章学完画知识框架图，理清知识点间的逻辑关系，不断完善形成“有生命”的导图。考前查缺补漏的最佳工具，能快速回顾所有知识点。Deya考研数学交流群(860957136)分享最新版本PDF。', star: '⭐⭐⭐⭐⭐' },
      { title: '费曼学习法', desc: '找一个水平相当的同学互相讲解，或者自己自言自语地讲解。能清晰讲出来才算真正掌握。应用场景：学完一章后尝试给别人讲解、做错题后分析错误原因并讲解、考前复习快速过一遍知识点。', star: '⭐⭐⭐⭐⭐' },
      { title: '一本保本两本血赚', desc: '邢道荣提出的忠告：“千万不要要求自己去把所有习题集做光”。做完2本后应该准备总结做题思路，形成自己的做题方法，把零散知识点整合起来，不应再做更多习题集，应进入冲刺阶段。', star: '⭐⭐⭐⭐⭐' },
      { title: '真题为王', desc: '真题是最宝贵的资料，反映命题规律和趋势，至少刷3遍以上。第一遍按年份做适应考试节奏，第二遍按题型做总结命题规律，第三遍重做错题查缺补漏。推荐使用李艳芳真题解析或张宇真题解析。', star: '⭐⭐⭐⭐⭐' }
    ],
    phases: [
      {
        name: '第一轮：基础入门', time: '2025.5-12月', duration: '8个月',
        goals: ['完成三门课程第一轮系统学习', '理解基本概念和定理（不要只记公式，要理解推导过程）', '掌握基本计算方法（求极限、求导数、求积分三大计算）', '建立初步知识框架（每章画思维导图）'],
        subjects: {
          highMath: { time: '2025.5-8月(4个月)', teachers: [
            { name: '武忠祥', star: '⭐⭐⭐⭐⭐', note: '强烈推荐，前六章质量极高' },
            { name: '张宇', star: '⭐⭐⭐⭐', note: '思路开阔适合冲高分，基础不好慎跟' },
            { name: '汤家凤', star: '⭐⭐⭐⭐', note: '手把手教学，适合基础薄弱' }
          ], tips: ['前六章：只需要跟武忠祥', '无穷级数：可以跟方浩', '三重积分/曲线曲面积分：武忠祥+张宇23版《高数十八讲》习题'] },
          linearAlgebra: { time: '2025.9-10月(2个月)', teachers: [
            { name: '李永乐', star: '⭐⭐⭐⭐⭐', note: '线代之王，《线性代数辅导讲义》经典' },
            { name: '没咋了(B站)', star: '⭐⭐⭐⭐⭐', note: '线代救命课，适合基础差' }
          ]},
          probability: { time: '2025.11-12月(2个月)', teachers: [
            { name: '方浩', star: '⭐⭐⭐⭐⭐', note: '技巧性强，个人强烈推荐' },
            { name: '王式安', star: '⭐⭐⭐⭐', note: '概率论权威' }
          ]}
        },
        schedule: { morning: '看视频课1讲(1.5h)', afternoon: '做对应章节习题', evening: '复习+整理笔记+补充思维导图(1h)' },
        materials: ['教材：同济高数+同济线代+浙大概率论(可选)', '视频：武忠祥基础班/张宇基础30讲', '习题：李林880题基础部分/李永乐660题/张宇1000题A组'],
        warnings: ['每天2-3小时，前期可少一些逐步增加', '听课:做题=1:3，看完视频立即做题', '不要沉迷于听课，做题才是关键']
      },
      {
        name: '第二轮：强化提升', time: '2026.1-6月', duration: '6个月',
        goals: ['深化知识点理解', '掌握各类题型解法', '提高解题速度和准确率', '完善知识体系'],
        subPhases: [
          { name: '强化学习(1-3月)', tasks: ['看强化视频课(武忠祥/张宇/李永乐)', '做强化习题(李林880题强化/张宇1000题BC组)', '整理错题本', '完善思维导图'] },
          { name: '专题突破(4-6月)', tasks: ['购买李林108或武忠祥十七堂课(选一本)', '针对薄弱环节按题型刷题', '难度大的专题去B站看教学视频'] }
        ],
        subjectFocus: {
          highMath: ['中值定理专项(B站众多UP的中值定理专题)', '积分不等式、积分中值定理', '三重积分、曲线曲面积分要熟练掌握', '无穷级数要多练习'],
          linearAlgebra: ['特征值和特征向量是重点', '二次型要理解', '线性方程组要多做'],
          probability: ['多维随机变量是难点', '参数估计要掌握', '假设检验要了解']
        },
        schedule: { morning: '看强化视频+做习题(2h)', afternoon: '专题突破+整理错题(1.5h)', evening: '完善思维导图+回顾(1h)' },
        materials: ['视频：武忠祥强化班/张宇强化班/李永乐强化班', '习题：李林880题强化部分/张宇1000题BC组/李永乐660题', '专题：李林108/武忠祥十七堂课(选一本)'],
        warnings: ['每天3-4小时', '周末可以做整套真题', '专题资料目的是查缺补漏']
      },
      {
        name: '第三轮：真题攻坚', time: '2026.7-9月', duration: '3个月',
        goals: ['完成所有真题训练(2005-2025)', '查缺补漏', '适应考试节奏', '总结命题规律'],
        subPhases: [
          { name: '早期真题(7-8月)', range: '2005-2020年', freq: '每周2-3套', review: ['对答案统计得分', '分析错题原因', '整理错题本', '总结命题规律'] },
          { name: '近期真题(9月)', range: '2021-2025年', note: '最能反映当前命题趋势', freq: '每周2套' }
        ],
        schedule: { morning: '严格计时做真题(8:30-11:30,3h)', afternoon: '详细复盘分析(2h)', evening: '针对性复习薄弱点(1h)' },
        materials: ['真题：2005-2025年真题(至少20年)', '解析：李艳芳真题解析(强烈推荐)/张宇真题解析', '视频：喻老真题讲解(B站)'],
        warnings: ['每天4-5小时', '严格按照考试时间(上午8:30-11:30)', '模拟考场环境', '每套卷子认真复盘']
      },
      {
        name: '第四轮：冲刺模拟', time: '2026.10-12月', duration: '3个月',
        goals: ['保持做题手感', '最后查缺补漏', '调整心态迎接考试'],
        subPhases: [
          { name: '10月', tasks: ['重做2020-2025年真题(每周2套)', '开始做模拟卷：李林6套卷/张宇8套卷/合工大超越/方浩模拟卷'] },
          { name: '11月', tasks: ['继续做模拟卷：李林4套卷/张宇4套卷', '张宇临门一脚(必听)：精准预测考点'] },
          { name: '12月', tasks: ['重做错题本上的题目', '反复查看思维导图', '背诵重要公式和结论', '考前一周：不再做新题，只看笔记和错题'] }
        ],
        schedule: { morning: '做真题/模拟卷(8:30-11:30)', afternoon: '复盘分析+查缺补漏(2h)', evening: '回顾错题+背诵公式(1.5h)' },
        materials: ['真题：重做2020-2025年真题(第二遍、第三遍)', '模拟卷：李林6+4/张宇8+4/合工大超越/方浩模拟卷', '押题课：张宇临门一脚(必听)'],
        warnings: ['每天4-5小时', '严格按照考试时间', '模拟卷不是必须的，真题才是最重要的', '考前一天：轻松复习，早点休息']
      }
    ],
    commonMistakes: [
      { mistake: '只看视频不做题', consequence: '听课很爽做题就废', solution: '听课:做题=1:3，做题才是关键' },
      { mistake: '贪多嚼不烂', consequence: '买了很多习题集每本都没做好', solution: '一本保本两本血赚，精选1-2本吃透' },
      { mistake: '忽视真题', consequence: '不了解命题规律', solution: '真题至少刷3遍' },
      { mistake: '焦虑进度', consequence: '和别人比进度学得不扎实', solution: '你是27考研时间充裕，稳扎稳打' },
      { mistake: '不重视计算', consequence: '会做的题也做错', solution: '重视三大计算(求极限/求导数/求积分)' },
      { mistake: '不做错题复盘', consequence: '同样的错误反复犯', solution: '错题一定要反复刷，定期回顾' }
    ],
    examTechniques: {
      timeAllocation: '选填题60-70分钟(10选择+6填空) + 大题110-120分钟(6道大题)',
      strategies: [
        '选填题：先做会的标记不会的，可用特殊值法排除法',
        '大题：步骤清晰分步骤作答，写出相关公式和定理',
        '证明题：不要全放至少拿第一问的分，决定成败的是常规题',
        '发卷后瞄一眼整体布局判断卷子类型',
        '做题顺序：先选填→简单大题→难题→留时间检查'
      ]
    },
    resources: [
      { type: '高等数学名师', items: ['武忠祥(⭐⭐⭐⭐⭐)', '张宇(思路开阔)', '汤家凤(基础薄弱)', '方浩(级数专题⭐⭐⭐⭐⭐)'] },
      { type: '线性代数名师', items: ['李永乐(线代之王⭐⭐⭐⭐⭐)', '没咋了B站(线代救命课⭐⭐⭐⭐⭐)'] },
      { type: '概率论名师', items: ['方浩(⭐⭐⭐⭐⭐)', '王式安(概率权威)', '余丙森'] },
      { type: '必备习题集', items: ['李林880题(⭐⭐⭐⭐⭐)', '李永乐660题', '张宇1000题'] },
      { type: '必做模拟卷', items: ['李林6+4(⭐⭐⭐⭐⭐)', '张宇8+4', '合工大超越'] },
      { type: 'B站UP主', items: ['喻老(真题讲解⭐⭐⭐⭐⭐)', '处江湖之远(880习题)', '夜雨教你考研竞赛(证明题)'] }
    ],
    levelAdvice: {
      weak: '基础薄弱：选择汤家凤/武忠祥基础班，多做660题基础部分，目标110-125分',
      average: '基础一般：正常节奏按四轮复习法，选择武忠祥/张宇，做880题，目标125-135分',
      good: '基础较好：快速过基础压缩到6个月，多看张宇课程多做难题，目标135-150分'
    }
  },
  english: {
    title: '英语一', icon: '📚', color: '#f093fb',
    examDate: '2026年12月', totalTime: '贯穿全程',
    corePrinciples: [
      { title: '单词是基础', desc: '5500考研词汇必须滚瓜烂熟，每天都要背', star: '⭐⭐⭐⭐⭐' },
      { title: '阅读是核心', desc: '得阅读者得天下，阅读理解占50分', star: '⭐⭐⭐⭐⭐' },
      { title: '真题是关键', desc: '英语没有模拟题只有真题，真题至少刷3遍', star: '⭐⭐⭐⭐⭐' },
      { title: '作文靠模板', desc: '提前准备自己的模板，不要考前临时抱佛脚', star: '⭐⭐⭐⭐' }
    ],
    phases: [
      {
        name: '词汇积累期', time: '现在-持续', duration: '贯穿全程',
        goals: ['掌握5500考研核心词汇', '熟悉高频词组和搭配', '能够识别熟词僻义'],
        schedule: { morning: '背单词50-100个(墨墨/扇贝)30min', afternoon: '复习昨日单词20min', evening: '阅读外刊或真题文章1篇30min' },
        methods: ['使用APP背单词利用艾宾浩斯曲线', '结合真题语境记忆', '制作个人生词本', '重点关注动词形容词副词', '学会识别熟词僻义'],
        warnings: ['单词每天都要背不能中断', '不要只在APP上认识要在阅读中能识别', '重点关注真题高频词']
      },
      {
        name: '阅读专项训练', time: '2025.6-2026.9', duration: '15个月',
        goals: ['掌握阅读理解解题技巧', '提高长难句分析能力', '培养英语思维'],
        schedule: { morning: '精读真题阅读1篇1.5h', afternoon: '分析长难句+翻译练习30min', evening: '复习单词+泛读外刊30min' },
        methods: ['精读五步法：通读全文→逐句翻译→分析题目→总结错题→背诵好句', '总结出题规律：主旨题/细节题/推理题/态度题/词义题', '分析干扰项特征'],
        warnings: ['得阅读者得天下必须高度重视', '不要只对答案要分析为什么错', '学会定位关键信息']
      },
      {
        name: '小三门突破', time: '2026.10-12月', duration: '3个月',
        goals: ['掌握完形填空解题技巧', '熟悉新题型解题方法', '提高翻译准确性'],
        schedule: { morning: '完形填空1篇30min', afternoon: '新题型1篇40min', evening: '翻译5句30min' },
        methods: ['完形填空：考察词汇辨析语法结构逻辑关系', '新题型：找关键词逻辑词指代关系', '翻译：拆分句子结构先主干后修饰'],
        warnings: ['完形填空控制在15分钟内', '新题型掌握了技巧很容易拿满分', '翻译要忠实原文']
      },
      {
        name: '写作冲刺', time: '2026.9-考前', duration: '4个月',
        goals: ['掌握写作模板和句型', '形成自己的写作框架', '积累高分表达'],
        schedule: { morning: '背诵优秀范文1篇30min', afternoon: '练习写作1篇(大小作文交替)1h', evening: '修改润色+积累好句30min' },
        methods: ['4-6月：听课学习写作方法（王江涛/潘赟）', '6-8月：准备模板整理万能句型', '9-10月：形成自己的模板每周练习1-2篇', '11-12月：背诵模板模拟考试找人批改'],
        warnings: ['作文要动手写不能只看', '找老师或同学批改', '形成自己的模板不要直接背别人的', '字迹工整很重要']
      }
    ],
    teacherComparison: [
      { name: '唐迟', style: '阅读逻辑清晰方法论强', rating: '⭐⭐⭐⭐⭐', bestFor: '阅读理解' },
      { name: '王江涛', style: '作文权威模板实用', rating: '⭐⭐⭐⭐⭐', bestFor: '写作' },
      { name: '田静', style: '语法讲解细致适合基础薄弱', rating: '⭐⭐⭐⭐', bestFor: '长难句' },
      { name: '刘晓艳', style: '幽默风趣激励人心', rating: '⭐⭐⭐⭐', bestFor: '全程陪伴' }
    ],
    commonMistakes: [
      { mistake: '单词背了不用', consequence: '只在APP上认识阅读中不认识', solution: '结合真题语境记忆' },
      { mistake: '阅读只对答案', consequence: '不知道错在哪里下次还错', solution: '详细分析每道题' },
      { mistake: '不做真题做模拟', consequence: '模拟题质量参差不齐', solution: '英语只有真题' },
      { mistake: '作文考前才准备', consequence: '临时抱佛脚写不出东西', solution: '提前3-4个月准备' },
      { mistake: '忽视小三门', consequence: '白白丢掉30分', solution: '小三门性价比高' },
      { mistake: '字迹潦草', consequence: '影响阅卷老师印象', solution: '平时练习注意字迹工整' }
    ],
    examTechniques: {
      timeAllocation: '完形15min+阅读70min+新题型20min+翻译25min+小作文25min+大作文35min',
      strategies: ['先做阅读因为分值最高', '完形填空放在最后', '作文一定要写完即使时间不够也要写个框架', '涂卡要留出5分钟时间']
    },
    resources: [
      { type: '词汇', items: ['考研英语大纲词汇', '恋练有词', '红宝书'] },
      { type: '真题', items: ['《考研真相》', '《黄皮书》', '历年真题（2005-2026）'] },
      { type: '阅读', items: ['唐迟阅读逻辑', '何凯文长难句'] },
      { type: '写作', items: ['王江涛高分写作', '潘赟九宫格写作'] },
      { type: '语法', items: ['田静句句真研', '刘晓艳语法长难句'] }
    ],
    levelAdvice: {
      weak: '四级未过：从单词和语法开始先打好基础再攻阅读',
      average: '四级刚过：重点攻阅读同时准备作文模板',
      good: '六级500+：可以加快进度重点突破阅读和写作高分'
    }
  },
  politics: {
    title: '政治', icon: '🎯', color: '#ff6b6b',
    examDate: '2026年12月', totalTime: '2026.7开始(6个月)',
    corePrinciples: [
      { title: '选择题为王', desc: '政治拉分主要在选择题，多选题尤其重要', star: '⭐⭐⭐⭐⭐' },
      { title: '理解大于死记', desc: '马原重在理解原理，毛中特重在记忆要点', star: '⭐⭐⭐⭐⭐' },
      { title: '肖秀荣体系为核心', desc: '肖秀荣的书籍和押题是核心必须重视', star: '⭐⭐⭐⭐⭐' },
      { title: '时政不可忽视', desc: '时政占16分且与其他科目结合考查', star: '⭐⭐⭐⭐' }
    ],
    phases: [
      {
        name: '前期了解(可选)', time: '现在-2026.6', duration: '可选',
        goals: ['了解政治考试基本框架', '关注时事热点'],
        schedule: { morning: '偶尔看看新闻联播', afternoon: '无需专门安排', evening: '浏览肖秀荣公众号' },
        methods: ['偶尔看看新闻联播', '浏览肖秀荣公众号', '了解五部分内容：马原/毛中特/史纲/思修/时政'],
        warnings: ['政治不用太早开始', '保持对时事的敏感度即可', '前期重点是数学英语和专业课']
      },
      {
        name: '系统学习期', time: '2026.7-9月', duration: '3个月',
        goals: ['完成第一轮系统学习', '掌握基本概念和原理', '做配套选择题'],
        schedule: { morning: '看徐涛视频课1.5h', afternoon: '看《精讲精练》对应章节1h', evening: '刷《1000题》对应章节1h' },
        methods: ['推荐组合：徐涛视频课+肖秀荣《精讲精练》+《1000题》', '马原部分最难要理解透彻', '毛中特内容最多需要记忆', '史纲要理清时间线', '刷《1000题》第一遍标记错题'],
        warnings: ['马原最难要花时间理解哲学和政治经济学', '毛中特最多建议结合时政理解', '选择题是关键特别是多选题']
      },
      {
        name: '强化刷题期', time: '2026.10-11月', duration: '2个月',
        goals: ['大量刷选择题', '《1000题》刷2-3遍', '总结错题和易混点'],
        schedule: { morning: '刷《1000题》1.5h', afternoon: '复习错题+背诵要点1h', evening: '看时政新闻30min' },
        methods: ['《1000题》至少刷2-3遍', '整理易混淆知识点如各种"第一次"/"根本"/"核心"', '关注肖秀荣腿姐的时政汇总', '可以做肖秀荣《8套卷》选择题部分', '开始背诵腿姐《冲刺背诵手册》或徐涛《小黄书》'],
        warnings: ['选择题决定下限必须大量练习', '多选题是难点要特别注意', '错题要反复做直到完全掌握']
      },
      {
        name: '冲刺背诵期', time: '2026.12-考前', duration: '1个月',
        goals: ['背诵分析题要点', '做肖八肖四', '关注时政热点'],
        schedule: { morning: '背诵肖四大题2h', afternoon: '做肖八选择题+分析1.5h', evening: '复习背诵手册+时政1h' },
        methods: ['肖八（11月出版）：重点做选择题分析题浏览即可', '肖四（12月出版）：选择题和分析题都要认真做大题必须背', '肖四大题是神书必须全部背下来', '背诵要有技巧：理解逻辑抓住关键词分点记忆', '最后两周全力背诵肖四大题'],
        warnings: ['肖四肖八是神书必须重视特别是肖四大题', '大题要背但不要死记硬背要理解逻辑', '选择题决定下限大题决定上限', '北京地区主观题给分严选择题更要拿高分']
      }
    ],
    teacherComparison: [
      { name: '肖秀荣', style: '政治权威押题准确书籍必备', rating: '⭐⭐⭐⭐⭐', bestFor: '全程核心' },
      { name: '徐涛', style: '讲课生动马原讲得好', rating: '⭐⭐⭐⭐⭐', bestFor: '基础阶段' },
      { name: '腿姐', style: '技巧性强冲刺背诵手册好用', rating: '⭐⭐⭐⭐⭐', bestFor: '强化冲刺' },
      { name: '米鹏', style: '选择题讲得好', rating: '⭐⭐⭐⭐', bestFor: '选择题专项' }
    ],
    commonMistakes: [
      { mistake: '开始太早', consequence: '前期投入产出比低后期忘记', solution: '7月开始即可' },
      { mistake: '只看不练', consequence: '选择题正确率低', solution: '《1000题》至少刷2-3遍' },
      { mistake: '忽视多选', consequence: '多选题失分严重', solution: '多选题要特别重视' },
      { mistake: '不背肖四', consequence: '分析题无话可说', solution: '肖四大题必须全部背下来' },
      { mistake: '死记硬背', consequence: '换个问法就不会了', solution: '理解逻辑抓住关键词' },
      { mistake: '忽视时政', consequence: '时政题丢分', solution: '关注全年热点' }
    ],
    examTechniques: {
      timeAllocation: '选择题50分钟+分析题70分钟',
      strategies: ['选择题要快速准确控制在50分钟内', '多选题宁缺毋滥', '分析题要分点作答条理清晰', '结合材料作答不要脱离材料空谈理论', '字迹工整洁面整洁']
    },
    resources: [
      { type: '核心书籍', items: ['肖秀荣《精讲精练》', '肖秀荣《1000题》', '肖八', '肖四'] },
      { type: '视频课', items: ['徐涛强化班', '腿姐技巧班'] },
      { type: '背诵资料', items: ['腿姐《冲刺背诵手册》', '徐涛《小黄书》', '肖四分析题'] },
      { type: '模拟卷', items: ['肖八', '肖四', '腿姐4套卷', '徐涛6套卷'] }
    ],
    levelAdvice: {
      weak: '理科生政治基础弱：跟着徐涛视频系统学习多做选择题',
      average: '文科生有一定基础：可以加快速度重点刷选择题和背肖四',
      good: '政治基础好：可以适当减少时间但要保证选择题正确率'
    }
  },
  cs408: {
    title: '408计算机综合', icon: '💻', color: '#4facfe',
    examDate: '2026年12月', totalTime: '19个月(2025.5-2026.12)',
    corePrinciples: [
      { title: '知识体系搭建法', desc: '先认识积木（单科知识点）再拼接积木（跨科联系）', star: '⭐⭐⭐⭐⭐' },
      { title: '多思考少死记', desc: '408考察理解能力要理解原理而不是死记硬背', star: '⭐⭐⭐⭐⭐' },
      { title: '真题为王', desc: '408真题重复率高至少刷3遍每题都要搞懂', star: '⭐⭐⭐⭐⭐' },
      { title: '王道为主', desc: '王道四本书是408备考的核心资料必须吃透', star: '⭐⭐⭐⭐⭐' }
    ],
    phases: [
      {
        name: '第一轮：基础入门', time: '2025.5-2026.6', duration: '13个月',
        goals: ['完成四门课程第一轮学习', '理解基本概念和原理', '建立知识体系', '完成王道课后习题'],
        subjects: {
          dataStructure: { time: '优先学习', teachers: ['王道视频+《王道数据结构》'], tips: '重点理解算法思想' },
          computerOrg: { time: '第二个学习', teachers: ['王道视频+《王道计组》'], tips: '难点是指令系统和CPU' },
          os: { time: '第三个学习', teachers: ['王道视频+《王道操作系统》'], tips: '重点理解进程管理和内存管理' },
          network: { time: '最后学习', teachers: ['王道视频+《王道计网》'], tips: '重点理解TCP/IP协议栈' }
        },
        schedule: { morning: '看王道视频课2h', afternoon: '看王道书+做笔记1.5h', evening: '做课后习题1h' },
        methods: ['学习顺序：数据结构→计组→操作系统→计算机网络', '每学完一章整理思维导图', '四门课有联系可以交叉学习', '重视理解和实践不要死记硬背'],
        warnings: ['408内容多要尽早开始', '每天保持2-3小时', '王道课后习题必须做', '不要只看不练']
      },
      {
        name: '第二轮：强化提升', time: '2026.7-9月', duration: '3个月',
        goals: ['第二轮复习加深理解', '大量做题', '总结考点和难点', '建立错题本'],
        schedule: { morning: '刷王道书+做习题2h', afternoon: '专题突破1.5h', evening: '整理错题+总结1h' },
        methods: ['王道四本单科书要吃透课后习题至少做2遍', '按专题突破：数据结构的树和图/计组的存储系统/OS的进程同步/计网的路由协议', '整理笔记和思维导图形成知识网络', '做历年真题选择题了解考试风格'],
        warnings: ['王道书要吃透这是408备考的核心', '错题要反复做直到完全掌握', '注重知识点之间的联系', '开始接触综合题']
      },
      {
        name: '第三轮：真题攻坚', time: '2026.10-11月', duration: '2个月',
        goals: ['系统训练历年真题（2009-2026）', '模拟考试', '查漏补缺'],
        schedule: { morning: '严格计时做一套真题3h', afternoon: '详细分析试卷2h', evening: '针对性复习1.5h' },
        methods: ['历年真题（2009-2026）至少做3遍', '严格计时3小时模拟考场环境', '分析每道错题', '将真题按知识点分类找出高频考点'],
        warnings: ['真题是最宝贵的资源认真对待每一套', '408真题重复率高有些题会换个形式再考', '注意时间分配选择题控制在80分钟内', '保留最近3年真题作为最后冲刺模拟']
      },
      {
        name: '第四轮：冲刺模拟', time: '2026.12-考前', duration: '1个月',
        goals: ['模拟题训练', '回归基础', '调整心态'],
        schedule: { morning: '做模拟题或重做真题2h', afternoon: '背诵重点+回顾错题1.5h', evening: '轻量练习1h' },
        methods: ['做高质量模拟题如王道8套卷', '回归基础重温重要概念和原理', '反复看错题本确保同样的错误不再犯', '调整作息按照考试时间安排学习'],
        warnings: ['模拟题不要做太多质量比数量重要', '最后阶段回归基础不要钻研偏题怪题', '注意时间分配策略先易后难']
      }
    ],
    teacherComparison: [
      { name: '王道团队', style: '408权威书籍和视频质量高', rating: '⭐⭐⭐⭐⭐', bestFor: '全程核心' },
      { name: 'Beokayy', style: 'B站UP主讲解通俗易懂', rating: '⭐⭐⭐⭐', bestFor: '辅助学习' },
      { name: '就是氧气', style: 'B站UP主笔记整理好', rating: '⭐⭐⭐⭐', bestFor: '笔记参考' },
      { name: '湖科大教书匠', style: '计网讲得好', rating: '⭐⭐⭐⭐', bestFor: '计网专项' }
    ],
    commonMistakes: [
      { mistake: '开始太晚', consequence: '408内容多后期压力大', solution: '尽早开始至少提前1年' },
      { mistake: '只看不练', consequence: '眼高手低考场上不会做题', solution: '王道课后习题必须做' },
      { mistake: '忽视真题', consequence: '不了解考试风格', solution: '真题至少刷3遍' },
      { mistake: '死记硬背', consequence: '换个问法就不会了', solution: '理解原理多思考' },
      { mistake: '不建体系', consequence: '知识点零散综合运用能力差', solution: '每章画思维导图建立知识网络' },
      { mistake: '忽视算法题', consequence: '算法大题丢分', solution: '熟练掌握常见算法多练习手写代码' }
    ],
    examTechniques: {
      timeAllocation: '选择题80分钟+综合题100分钟',
      strategies: ['选择题要快速准确控制在80分钟内', '综合题要先审题理清思路再作答', '算法题要写注释说明思路即使代码不完整也有分', '遇到不会的题不要空着写上相关知识点可能有分']
    },
    resources: [
      { type: '核心书籍', items: ['王道四本单科书', '王道历年真题解析'] },
      { type: '视频课', items: ['王道全程班', 'B站王道官方账号'] },
      { type: '辅助资料', items: ['天勤数据结构', '月暗哥笔记', 'Beokayy笔记'] },
      { type: '真题', items: ['408历年真题（2009-2026）', '王道真题解析'] },
      { type: '模拟卷', items: ['王道8套卷', '王道4套卷'] }
    ],
    levelAdvice: {
      weak: '跨专业考生：从数据结构开始循序渐进多花时间理解概念',
      average: '本专业基础一般：按正常进度学习重点攻克薄弱环节',
      good: '本专业基础好：可以加快速度重点刷真题和模拟题'
    }
  }
}

const currentMethod = computed(() => studyMethods[activeSubject.value as keyof typeof studyMethods])
const switchSubject = (subject: string) => { activeSubject.value = subject }
</script>

<template>
  <div class="study-methods-page">
    <div class="page-header">
      <h1 class="page-title"><el-icon><Reading /></el-icon>考研学习方法指南</h1>
      <p class="page-subtitle">基于100+高分学长经验贴整理 · 27考研版</p>
    </div>

    <div class="subject-selector">
      <div v-for="(method, key) in studyMethods" :key="key" class="subject-card" :class="{ active: activeSubject === key }" @click="switchSubject(key)" :style="{ '--subject-color': method.color }">
        <div class="subject-icon">{{ method.icon }}</div>
        <div class="subject-name">{{ method.title }}</div>
        <div class="exam-info">{{ method.examDate }}</div>
      </div>
    </div>

    <div class="content-area">
      <!-- 核心理念 -->
      <section class="doc-section">
        <h2 class="section-title"><el-icon><Lightning /></el-icon>一、核心理念</h2>
        <div class="principles-list">
          <div v-for="(p, i) in currentMethod.corePrinciples" :key="i" class="principle-item">
            <span class="principle-star">{{ p.star }}</span>
            <strong>{{ p.title }}：</strong>{{ p.desc }}
          </div>
        </div>
      </section>

      <!-- 四轮复习规划 -->
      <section class="doc-section">
        <h2 class="section-title"><el-icon><TrendCharts /></el-icon>二、四轮复习规划</h2>
        
        <div v-for="(phase, idx) in currentMethod.phases" :key="idx" class="phase-doc">
          <div class="phase-doc-header">
            <span class="phase-num">第{{ idx + 1 }}轮</span>
            <h3>{{ phase.name }}</h3>
            <span class="phase-time-badge">{{ phase.time }} · {{ phase.duration }}</span>
          </div>
          
          <div class="phase-doc-body">
            <!-- 阶段目标 -->
            <div class="doc-block">
              <h4>🎯 阶段目标</h4>
              <ul class="simple-list">
                <li v-for="(g, i) in phase.goals" :key="i">{{ g }}</li>
              </ul>
            </div>

            <!-- 分科学习(仅数学和408) -->
            <div v-if="(phase as any).subjects" class="doc-block subject-block">
              <h4>📚 分科学习安排</h4>
              
              <!-- 数学分科 -->
              <div v-if="activeSubject === 'math'" class="subject-doc">
                <div class="subject-group">
                  <h5>高等数学（{{ (phase as any).subjects.highMath.time }}）</h5>
                  <div v-if="(phase as any).subjects.highMath.teachers" class="teacher-inline">
                    <span v-for="(t, i) in (phase as any).subjects.highMath.teachers" :key="i" class="teacher-tag">
                      {{ t.name }} {{ t.star }} - {{ t.note }}
                    </span>
                  </div>
                  <div v-if="(phase as any).subjects.highMath.tips" class="tips-inline">
                    <p v-for="(tip, i) in (phase as any).subjects.highMath.tips" :key="i">• {{ tip }}</p>
                    <p>• 每日计划示例：上午看视频课1讲(1.5h)，下午做对应章节习题，晚上复习上午内容+整理笔记+补充思维导图(1h)</p>
                    <p>• 前六章只需要跟武忠祥即可，后三章可以结合其他老师</p>
                  </div>
                </div>
                
                <div class="subject-group">
                  <h5>线性代数（{{ (phase as any).subjects.linearAlgebra.time }}）</h5>
                  <div v-if="(phase as any).subjects.linearAlgebra.teachers" class="teacher-inline">
                    <span v-for="(t, i) in (phase as any).subjects.linearAlgebra.teachers" :key="i" class="teacher-tag">
                      {{ t.name }} {{ t.star }} - {{ t.note }}
                    </span>
                  </div>
                </div>
                
                <div class="subject-group">
                  <h5>概率论（{{ (phase as any).subjects.probability.time }}）</h5>
                  <div v-if="(phase as any).subjects.probability.teachers" class="teacher-inline">
                    <span v-for="(t, i) in (phase as any).subjects.probability.teachers" :key="i" class="teacher-tag">
                      {{ t.name }} {{ t.star }} - {{ t.note }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- 408分科 -->
              <div v-if="activeSubject === 'cs408'" class="subject-doc">
                <div class="subject-group">
                  <h5>数据结构（{{ (phase as any).subjects.dataStructure.time }}）</h5>
                  <p>{{ (phase as any).subjects.dataStructure.teachers.join(' + ') }}</p>
                  <p class="tip-note">💡 {{ (phase as any).subjects.dataStructure.tips }}</p>
                </div>
                <div class="subject-group">
                  <h5>计组（{{ (phase as any).subjects.computerOrg.time }}）</h5>
                  <p>{{ (phase as any).subjects.computerOrg.teachers.join(' + ') }}</p>
                  <p class="tip-note">💡 {{ (phase as any).subjects.computerOrg.tips }}</p>
                </div>
                <div class="subject-group">
                  <h5>操作系统（{{ (phase as any).subjects.os.time }}）</h5>
                  <p>{{ (phase as any).subjects.os.teachers.join(' + ') }}</p>
                  <p class="tip-note">💡 {{ (phase as any).subjects.os.tips }}</p>
                </div>
                <div class="subject-group">
                  <h5>计网（{{ (phase as any).subjects.network.time }}）</h5>
                  <p>{{ (phase as any).subjects.network.teachers.join(' + ') }}</p>
                  <p class="tip-note">💡 {{ (phase as any).subjects.network.tips }}</p>
                </div>
              </div>
            </div>

            <!-- 子阶段 -->
            <div v-if="(phase as any).subPhases" class="doc-block">
              <h4>📋 阶段细分</h4>
              <div v-for="(sub, si) in (phase as any).subPhases" :key="si" class="sub-phase-doc">
                <strong>{{ sub.name }}：</strong>
                <ul class="simple-list">
                  <li v-for="(task, ti) in sub.tasks" :key="ti">{{ task }}</li>
                </ul>
              </div>
            </div>

            <!-- 每日计划 -->
            <div class="doc-block schedule-doc">
              <h4>⏰ 每日计划示例</h4>
              <div class="schedule-inline">
                <span><strong>上午：</strong>{{ phase.schedule.morning }}</span>
                <span><strong>下午：</strong>{{ phase.schedule.afternoon }}</span>
                <span><strong>晚上：</strong>{{ phase.schedule.evening }}</span>
              </div>
            </div>

            <!-- 资料/方法 -->
            <div class="doc-block">
              <h4>📖 {{ (phase as any).materials ? '推荐资料' : '学习方法' }}</h4>
              <ul class="simple-list">
                <li v-for="(item, i) in ((phase as any).materials || (phase as any).methods)" :key="i">{{ item }}</li>
              </ul>
              <p v-if="idx === 0" style="margin-top: 12px; padding: 10px; background: #e3f2fd; border-radius: 6px; font-size: 0.9em; color: #1976d2;">
                💡 <strong>提示：</strong>听课:做题 = 1:3，看完视频立即做题，不要沉迷于听课，做题才是关键。每天2-3小时，前期可以少一些逐步增加。
              </p>
              <p v-if="idx === 1" style="margin-top: 12px; padding: 10px; background: #e3f2fd; border-radius: 6px; font-size: 0.9em; color: #1976d2;">
                💡 <strong>提示：</strong>强化阶段核心是【做题+复盘】，数学就是【思路+计算】两点，即【理解+熟练度】。需要一定的刷题量，选择一本主流习题册从头到尾刷（如李林880）。可以网上找对应习题册的题型整理，对着思维导图多次复盘。
              </p>
            </div>

            <!-- 注意事项 -->
            <div class="doc-block warning-doc">
              <h4>⚠️ 注意事项</h4>
              <ul class="simple-list">
                <li v-for="(w, i) in phase.warnings" :key="i">{{ w }}</li>
              </ul>
              <p v-if="idx === 0" style="margin-top: 12px; padding: 10px; background: #fff3e0; border-radius: 6px; font-size: 0.9em; color: #f57c00;">
                ⚡ <strong>重要提醒：</strong>基础阶段决定你能否上120+，不要急于求成，基础打牢最重要。遇到不懂的概念立刻查资料或问老师，不要积累疑问。
              </p>
              <p v-if="idx === 2" style="margin-top: 12px; padding: 10px; background: #fff3e0; border-radius: 6px; font-size: 0.9em; color: #f57c00;">
                ⚡ <strong>重要提醒：</strong>真题是最重要的资料，建议先吃透真题再做模拟卷。有学长因为10-11月停摆了一段时间，重拾时只专注于计算、错题和整体，没有狂热追求模拟卷，最后效果很好。考场上要一直算到最后一刻，计算是考研数学的重点。
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- 名师对比 -->
      <section class="doc-section">
        <h2 class="section-title"><el-icon><StarFilled /></el-icon>三、名师推荐对比</h2>
        <div class="teacher-doc-list">
          <div v-for="(t, i) in (currentMethod as any).teacherComparison" :key="i" class="teacher-doc-item">
            <strong>{{ t.name }}</strong>（{{ t.rating }}）：{{ t.style }}<br>
            <span class="teacher-best">适用：{{ t.bestFor }}</span>
          </div>
        </div>
      </section>

      <!-- 常见误区 -->
      <section class="doc-section">
        <h2 class="section-title"><el-icon><WarningFilled /></el-icon>四、常见误区与避坑</h2>
        <div class="mistake-doc-list">
          <div v-for="(m, i) in currentMethod.commonMistakes" :key="i" class="mistake-doc-item">
            <strong>❌ {{ m.mistake }}</strong><br>
            <span class="mistake-consequence">后果：{{ m.consequence }}</span><br>
            <span class="mistake-solution">✅ 建议：{{ m.solution }}</span>
          </div>
        </div>
      </section>

      <!-- 答题技巧 -->
      <section class="doc-section">
        <h2 class="section-title"><el-icon><EditPen /></el-icon>五、考试答题技巧</h2>
        <div class="technique-doc">
          <p><strong>⏰ 时间分配：</strong>{{ currentMethod.examTechniques.timeAllocation }}</p>
          <h4>💡 答题策略</h4>
          <ul class="simple-list">
            <li v-for="(s, i) in currentMethod.examTechniques.strategies" :key="i">{{ s }}</li>
          </ul>
        </div>
      </section>

      <!-- 针对不同基础的建议 -->
      <section class="doc-section">
        <h2 class="section-title"><el-icon><Reading /></el-icon>六、针对不同基础的学习策略</h2>
        <div class="advice-doc-list">
          <div class="advice-doc-item">
            <strong>📌 基础薄弱：</strong>{{ currentMethod.levelAdvice.weak }}
          </div>
          <div class="advice-doc-item">
            <strong>📌 基础一般：</strong>{{ currentMethod.levelAdvice.average }}
          </div>
          <div class="advice-doc-item">
            <strong>📌 基础较好：</strong>{{ currentMethod.levelAdvice.good }}
          </div>
        </div>
      </section>

      <!-- 推荐资料 -->
      <section class="doc-section">
        <h2 class="section-title"><el-icon><Document /></el-icon>七、推荐学习资料</h2>
        <div class="resources-doc-list">
          <div v-for="(cat, ci) in currentMethod.resources" :key="ci" class="resource-doc-group">
            <h4>{{ cat.type }}</h4>
            <ul class="simple-list">
              <li v-for="(item, ii) in cat.items" :key="ii">{{ item }}</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.study-methods-page { 
  max-width: 1200px; 
  margin: 0 auto; 
  padding: 20px; 
  font-family: 'FZCuHei', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.8; 
}
.page-header { 
  text-align: center; 
  padding: 35px 20px; 
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
  border-radius: 12px; 
  margin-bottom: 30px; 
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.2); 
}
.page-title { 
  font-size: 2.2em; 
  color: white; 
  margin: 0 0 10px 0; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  gap: 12px; 
  font-weight: 700; 
}
.page-subtitle { 
  font-size: 1em; 
  color: rgba(255, 255, 255, 0.95); 
  margin: 0; 
}
.subject-selector { 
  display: grid; 
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); 
  gap: 15px; 
  margin-bottom: 35px; 
}
.subject-card { 
  background: white; 
  border-radius: 10px; 
  padding: 20px; 
  text-align: center; 
  cursor: pointer; 
  transition: all 0.3s; 
  border: 2px solid transparent; 
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08); 
}
.subject-card:hover { 
  transform: translateY(-3px); 
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12); 
}
.subject-card.active { 
  border-color: var(--subject-color, #667eea); 
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%); 
}
.subject-icon { 
  font-size: 2.5em; 
  margin-bottom: 8px; 
}
.subject-name { 
  font-size: 1.2em; 
  font-weight: 600; 
  color: #333; 
  margin-bottom: 5px; 
}
.exam-info { 
  font-size: 0.8em; 
  color: #666; 
  font-weight: 500; 
}
.content-area { 
  display: flex; 
  flex-direction: column; 
  gap: 40px; 
}

/* 文档式布局 */
.doc-section { 
  background: white; 
  border-radius: 12px; 
  padding: 35px; 
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08); 
}
.section-title { 
  font-size: 1.8em; 
  color: #333; 
  margin: 0 0 28px 0; 
  display: flex; 
  align-items: center; 
  gap: 12px; 
  font-weight: 700; 
  padding-bottom: 15px; 
  border-bottom: 3px solid #667eea; 
}

/* 核心理念列表 */
.principles-list { 
  display: flex; 
  flex-direction: column; 
  gap: 15px; 
}
.principle-item { 
  padding: 15px 18px; 
  background: #f8f9fa; 
  border-left: 4px solid #667eea; 
  border-radius: 8px; 
  font-size: 1em; 
  line-height: 1.8; 
}
.principle-star { 
  color: #ff9800; 
  margin-right: 10px; 
  font-size: 1.1em;
}

/* 阶段文档 */
.phase-doc { 
  margin-bottom: 35px; 
  padding-bottom: 35px; 
  border-bottom: 2px dashed #e0e0e0; 
}
.phase-doc:last-child { 
  margin-bottom: 0; 
  padding-bottom: 0; 
  border-bottom: none; 
}
.phase-doc-header { 
  display: flex; 
  align-items: center; 
  gap: 15px; 
  margin-bottom: 25px; 
  padding: 18px 20px; 
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
  border-radius: 10px; 
  color: white; 
}
.phase-num { 
  background: white; 
  color: #667eea; 
  padding: 8px 15px; 
  border-radius: 20px; 
  font-weight: 700; 
  font-size: 0.95em; 
}
.phase-doc-header h3 { 
  margin: 0; 
  flex: 1; 
  font-size: 1.3em; 
  font-weight: 600; 
}
.phase-time-badge { 
  background: rgba(255, 255, 255, 0.2); 
  padding: 6px 15px; 
  border-radius: 15px; 
  font-size: 0.9em; 
  white-space: nowrap; 
}

.phase-doc-body { 
  display: flex; 
  flex-direction: column; 
  gap: 20px; 
}
.doc-block { 
  padding: 22px; 
  background: #fafafa; 
  border-radius: 10px; 
}
.doc-block h4 { 
  font-size: 1.15em; 
  color: #333; 
  margin: 0 0 15px 0; 
  font-weight: 600; 
}
.simple-list { 
  list-style: none; 
  padding: 0; 
  margin: 0; 
}
.simple-list li { 
  padding: 8px 0; 
  padding-left: 20px; 
  position: relative; 
  color: #555; 
  line-height: 1.8; 
  font-size: 0.95em; 
}
.simple-list li::before { 
  content: '•'; 
  position: absolute; 
  left: 0; 
  color: #667eea; 
  font-weight: bold; 
  font-size: 1.2em;
}

/* 分科学习 */
.subject-block { 
  background: #fef5f7; 
  border-left: 4px solid #e91e63; 
}
.subject-doc { 
  display: flex; 
  flex-direction: column; 
  gap: 18px; 
}
.subject-group { 
  background: white; 
  padding: 18px; 
  border-radius: 8px; 
}
.subject-group h5 { 
  font-size: 1.05em; 
  color: #333; 
  margin: 0 0 12px 0; 
  font-weight: 600; 
}
.subject-group p { 
  font-size: 0.92em; 
  color: #666; 
  margin: 6px 0; 
  line-height: 1.8; 
}
.tip-note { 
  color: #e91e63 !important; 
  font-style: italic; 
  margin-top: 10px !important; 
  font-weight: 500;
}
.teacher-inline { 
  display: flex; 
  flex-wrap: wrap; 
  gap: 10px; 
  margin-bottom: 10px; 
}
.teacher-tag { 
  background: #e3f2fd; 
  padding: 6px 12px; 
  border-radius: 15px; 
  font-size: 0.9em; 
  color: #1976d2; 
  font-weight: 500;
}
.tips-inline p { 
  font-size: 0.9em; 
  color: #666; 
  margin: 5px 0; 
  padding-left: 12px; 
  line-height: 1.7;
}

/* 子阶段 */
.sub-phase-doc { 
  background: white; 
  padding: 15px 18px; 
  border-radius: 8px; 
  margin-bottom: 12px; 
}
.sub-phase-doc:last-child { 
  margin-bottom: 0; 
}
.sub-phase-doc strong { 
  color: #009688; 
  font-size: 0.95em; 
  font-weight: 600;
}

/* 每日计划 */
.schedule-doc { 
  background: #f3e5f5; 
  border-left: 4px solid #9c27b0; 
}
.schedule-inline { 
  display: flex; 
  flex-direction: column; 
  gap: 10px; 
}
.schedule-inline span { 
  font-size: 0.95em; 
  color: #555; 
  line-height: 1.7;
}
.schedule-inline strong { 
  color: #9c27b0; 
  font-weight: 600;
}

/* 注意事项 */
.warning-doc { 
  background: #fff3e0; 
  border-left: 4px solid #ff9800; 
}

/* 名师列表 */
.teacher-doc-list { 
  display: flex; 
  flex-direction: column; 
  gap: 15px; 
}
.teacher-doc-item { 
  padding: 15px 18px; 
  background: #f8f9fa; 
  border-radius: 8px; 
  font-size: 0.95em; 
  line-height: 1.8; 
}
.teacher-best { 
  color: #667eea; 
  font-size: 0.9em; 
  font-weight: 500;
}

/* 误区列表 */
.mistake-doc-list { 
  display: flex; 
  flex-direction: column; 
  gap: 15px; 
}
.mistake-doc-item { 
  padding: 18px; 
  background: #fff5f5; 
  border-left: 4px solid #ff6b6b; 
  border-radius: 8px; 
  font-size: 0.95em; 
  line-height: 1.8; 
}
.mistake-consequence { 
  color: #d32f2f; 
  display: block; 
  margin: 8px 0; 
  font-weight: 500;
}
.mistake-solution { 
  color: #388e3c; 
  display: block; 
  margin-top: 8px; 
  font-weight: 500;
}

/* 答题技巧 */
.technique-doc { 
  padding: 25px; 
  background: #f8f9fa; 
  border-radius: 10px; 
}
.technique-doc p { 
  font-size: 1em; 
  margin: 0 0 18px 0; 
  padding: 15px; 
  background: #e3f2fd; 
  border-radius: 8px; 
  border-left: 4px solid #2196f3; 
  line-height: 1.8;
}
.technique-doc h4 { 
  font-size: 1.15em; 
  color: #333; 
  margin: 0 0 15px 0; 
  font-weight: 600;
}

/* 基础建议 */
.advice-doc-list { 
  display: flex; 
  flex-direction: column; 
  gap: 15px; 
}
.advice-doc-item { 
  padding: 18px; 
  background: #f8f9fa; 
  border-radius: 8px; 
  font-size: 0.95em; 
  line-height: 1.8; 
}
.advice-doc-item:nth-child(1) { 
  border-left: 4px solid #ff6b6b; 
}
.advice-doc-item:nth-child(2) { 
  border-left: 4px solid #ffa726; 
}
.advice-doc-item:nth-child(3) { 
  border-left: 4px solid #66bb6a; 
}

/* 资料列表 */
.resources-doc-list { 
  display: grid; 
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
  gap: 20px; 
}
.resource-doc-group { 
  padding: 22px; 
  background: #f8f9fa; 
  border-radius: 10px; 
}
.resource-doc-group h4 { 
  font-size: 1.15em; 
  color: #333; 
  margin: 0 0 15px 0; 
  padding-bottom: 10px; 
  border-bottom: 2px solid #667eea; 
  font-weight: 600; 
}

@media (max-width: 768px) {
  .page-title { 
    font-size: 1.8em; 
  }
  .subject-selector { 
    grid-template-columns: repeat(2, 1fr); 
  }
  .doc-section { 
    padding: 25px; 
  }
  .phase-doc-header { 
    flex-wrap: wrap; 
  }
  .schedule-inline { 
    gap: 8px; 
  }
  .resources-doc-list { 
    grid-template-columns: 1fr; 
  }
}
</style>

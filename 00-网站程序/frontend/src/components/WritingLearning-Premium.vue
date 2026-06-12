<script setup lang="ts">
import { ref, computed } from 'vue'

const activeTab = ref('grading-standards')

// ========== 核心理念：基于一线教师教学体系 ==========
// 三大核心原则：
// 1. 阅卷标准导向 - 第一印象、避免低级错误
// 2. 灵活结构 - 提供思维框架而非固定模板
// 3. 深度论证 - 三级递进法（what→how→why it matters）
// 
// ⚠️ 重要提醒：避免明显套模板！
// - 不要每篇都用Recently, the issue of... has aroused wide concern
// - 不要机械使用First and foremost/Furthermore/Last but not least
// - 要多样化表达，自然流畅才是高分关键

// ========== Tab 1: Grading Standards - 阅卷标准与基本原则 ==========
const gradingStandards = {
  firstImpression: {
    title: '第一印象至关重要',
    items: [
      { icon: '✨', text: '干净整洁：卷面整洁，无涂改痕迹' },
      { icon: '📐', text: '大方得体：字体工整，段落分明' },
      { icon: '✍️', text: '干净漂亮：书写清晰，布局合理' }
    ],
    tip: '字迹工整至少能多拿1-2分！'
  },
  wordCount: {
    title: '字数要求',
    content: '建议150字左右（实际上没人会数，但少于120会被扣分）',
    range: '控制在130-180字之间最为稳妥',
    warning: '写得太长反而容易出错'
  },
  timeManagement: {
    title: '时间分配（总共30分钟）',
    breakdown: [
      { phase: '审题', time: '3分钟', task: '仔细阅读题目，圈出关键词' },
      { phase: '构思', time: '2分钟', task: '确定中心论点，列提纲' },
      { phase: '写作', time: '20分钟', task: '正式写作，注意逻辑连贯' },
      { phase: '检查', time: '5分钟', task: '检查拼写、语法、标点' }
    ]
  },
  avoidErrors: {
    title: '必须避免的低级错误（区分14分和11分的关键）',
    basic: [
      { error: '主谓一致', example: 'The list of items are... ❌ → is... ✅' },
      { error: '时态统一', example: '全文时态保持一致' },
      { error: '拼写准确', example: '常见单词拼写无误' },
      { error: '标点规范', example: '逗号、句号使用得当' }
    ],
    advanced: [
      { error: '句子不完整', example: '缺少主语或谓语' },
      { error: '逻辑连接词误用', example: 'however/therefore使用不当' },
      { error: '中式英语表达', example: 'With the development of society...' },
      { error: '词汇重复率过高', example: '连续使用important/think等词' }
    ]
  },
  noErrorStrategy: {
    title: '如何做到“不犯错”？',
    strategies: [
      { strategy: '写简单句', desc: '宁可写短句，不要写复杂但错误的长句' },
      { strategy: '用熟悉词', desc: '优先使用自己掌握牢固的词汇' },
      { strategy: '反复检查', desc: '写完后再读一遍，重点检查动词形式和名词单复数' },
      { strategy: '避免创新', desc: '不要用生僻词或不确定的语法结构' }
    ]
  }
}

// ========== Tab 1: Frameworks Data ==========
const expandedFramework = ref<number | null>(1)

const frameworks = [
  {
    id: 1,
    type: 'argumentative',
    badge: '议论文',
    title: 'Argumentative Essay',
    subtitle: '议论文/观点类（最常考）',
    structure: [
      {
        title: '第一段：引出话题 + 表明立场',
        description: '2-3句话，明确表达你的观点',
        examples: [
          { en: 'Recently, the issue of ___ has aroused wide concern.', cn: '最近，___问题引起了广泛关注。' },
          { en: 'From my perspective, I firmly believe that...', cn: '在我看来，我坚信...' }
        ]
      },
      {
        title: '第二段：论证理由（2-3个论点）',
        description: '每点用First/Furthermore/Last连接，提供具体例子',
        examples: [
          { en: 'First and foremost, ...', cn: '首先且最重要的是...' },
          { en: 'Furthermore, ...', cn: '此外，...' },
          { en: 'Last but not least, ...', cn: '最后但同样重要的是...' }
        ]
      },
      {
        title: '第三段：总结 + 建议/展望',
        description: '重申观点，提出建议或未来展望',
        examples: [
          { en: 'In conclusion, ...', cn: '总之，...' },
          { en: 'It is high time that we took effective measures to...', cn: '是时候采取有效措施来...' }
        ]
      }
    ],
    mnemonic: '引表论总',
    mnemonicDesc: '引（引出话题）→ 表（表明立场）→ 论（论证理由）→ 总（总结展望）',
    logicChain: {
      level1: '表面现象（what）- 描述题目给出的现象或问题',
      level2: '深层原因（how）- 分析现象背后的原因或机制',
      level3: '本质影响（why it matters）- 探讨对个人/社会的深远影响'
    },
    writingTips: [
      '✅ 开头段必须明确表明立场（支持/反对/中立）',
      '✅ 每段只论证一个理由，不要堆砌多个观点',
      '✅ 使用对立假想敌增强说服力',
      '❌ 避免中式英语开头（With the development of society...）',
      '❌ 不要使用过于绝对的词汇（always/never）'
    ],
    tips: [
      '观点要明确，不要模棱两可',
      '每个论点都要有具体例子支撑',
      '使用高级词汇替换简单词（good→beneficial）',
      '注意段落间的逻辑连接词'
    ]
  },
  {
    id: 2,
    type: 'chart',
    badge: '图表作文',
    title: 'Chart/Graph Description',
    subtitle: '图表/数据类',
    structure: [
      {
        title: '第一段：描述图表趋势',
        description: '客观描述数据变化，不加入主观判断',
        examples: [
          { en: 'As is clearly shown in the chart, ...', cn: '如图表所示，...' },
          { en: 'The percentage of ___ increased/decreased from ___ to ___.', cn: '___的百分比从___增加到/减少到___。' }
        ]
      },
      {
        title: '第二段：分析原因',
        description: '解释数据变化的可能原因',
        examples: [
          { en: 'Several factors contribute to this phenomenon.', cn: '几个因素导致了这一现象。' },
          { en: 'On the one hand, ... On the other hand, ...', cn: '一方面...另一方面...' }
        ]
      },
      {
        title: '第三段：预测/建议',
        description: '基于数据分析做出预测或提出建议',
        examples: [
          { en: 'Based on the analysis above, it can be predicted that...', cn: '基于以上分析，可以预测...' },
          { en: 'Therefore, it is advisable to...', cn: '因此，建议...' }
        ]
      }
    ],
    mnemonic: '描析预',
    mnemonicDesc: '描（描述数据）→ 析（分析原因）→ 预（预测趋势/建议）',
    logicChain: {
      level1: '数据描述（what）- 客观呈现图表中的关键信息',
      level2: '原因分析（how）- 解释数据变化背后的原因',
      level3: '趋势预测（why it matters）- 推断未来发展或提出建议'
    },
    writingTips: [
      '✅ 选择2-3个关键数据点，不要罗列所有数据',
      '✅ 使用比较句型（higher than/increased by）',
      '✅ 数据描述用过去时，预测用将来时',
      '❌ 避免主观臆断，保持客观描述',
      '❌ 不要忽略图表标题和单位'
    ],
    tips: [
      '不要罗列所有数据，选择关键趋势',
      '使用比较和对比的表达方式',
      '时态要正确（过去数据用过去时）',
      '避免主观臆断，保持客观描述'
    ]
  },
  {
    id: 3,
    type: 'letter',
    badge: '书信',
    title: 'Letter Writing',
    subtitle: '书信/应用文（通知、建议信等）',
    structure: [
      {
        title: '开头：说明写信目的',
        description: '直接表明写信意图',
        examples: [
          { en: 'I am writing to express my concern about...', cn: '我写此信是为了表达我对...的关注。' },
          { en: 'I would like to offer some suggestions regarding...', cn: '我想就...提供一些建议。' }
        ]
      },
      {
        title: '正文：具体内容（分点陈述）',
        description: '清晰列出要点，逻辑分明',
        examples: [
          { en: 'Firstly, ...', cn: '首先，...' },
          { en: 'Secondly, ...', cn: '其次，...' },
          { en: 'Finally, ...', cn: '最后，...' }
        ]
      },
      {
        title: '结尾：期待回复/感谢',
        description: '礼貌结束，表达期望',
        examples: [
          { en: 'I would appreciate it if you could take my suggestions into consideration.', cn: '如果您能考虑我的建议，我将不胜感激。' },
          { en: 'Looking forward to your early reply.', cn: '期待您的早日回复。' }
        ]
      }
    ],
    mnemonic: '目内结',
    mnemonicDesc: '目（说明目的）→ 内（具体内容）→ 结（结尾致谢）',
    logicChain: {
      level1: '写信目的（what）- 清楚说明为什么写这封信',
      level2: '具体内容（how）- 分点陈述核心信息',
      level3: '礼貌结尾（why it matters）- 表达期望或感谢'
    },
    writingTips: [
      '✅ 开头直接说明写信目的',
      '✅ 正文分点陈述（Firstly/Secondly/Finally）',
      '✅ 语气礼貌得体，符合书信规范',
      '❌ 不要遗漏题目要求的任何要点',
      '❌ 避免口语化表达'
    ],
    tips: [
      '注意书信格式（称呼、署名）',
      '语气要礼貌得体',
      '内容要完整，涵盖所有要点',
      '字数控制在100-120词左右'
    ]
  }
]

// ========== Tab 3: Argumentation Methods - 深度论证方法 ==========
const argumentationMethods = {
  imaginaryOpponent: {
    title: '找对立假想敌',
    subtitle: '增强说服力的终极武器',
    description: '通过设想对立观点并反驳，让你的论证无懈可击',
    steps: [
      {
        step: 1,
        title: '提出自己的观点',
        example: 'I believe that online education is beneficial for students.'
      },
      {
        step: 2,
        title: '设想对立观点',
        example: 'However, some people argue that online education lacks interaction.'
      },
      {
        step: 3,
        title: '反驳对立观点',
        example: 'While this concern is valid, modern technology has addressed this issue through video conferencing and discussion forums.'
      },
      {
        step: 4,
        title: '强化自己的立场',
        example: 'Therefore, the advantages of online education far outweigh its disadvantages.'
      }
    ],
    templates: [
      'Some people may argue that..., but...',
      'While it is true that..., we cannot ignore that...',
      'Admittedly, ..., however...',
      'Critics may claim that..., yet...'
    ]
  },
  threeLevelProgression: {
    title: '三级递进法',
    subtitle: '从表面到本质的深度论证',
    description: '通过what→how→why it matters三层递进，让立意深刻',
    levels: [
      {
        level: 1,
        name: '一级：表面现象（What）',
        description: '描述题目给出的现象或问题',
        example: 'Teachers impart knowledge to students.'
      },
      {
        level: 2,
        name: '二级：深层原因（How）',
        description: '分析现象背后的原因或机制',
        example: 'They teach students how to think critically and solve problems independently.'
      },
      {
        level: 3,
        name: '三级：本质影响（Why it matters）',
        description: '探讨对个人/社会的深远影响',
        example: 'Ultimately, teachers shape students\' character and values, preparing them to become responsible citizens.'
      }
    ],
    beforeAfter: {
      before: {
        title: '修改前（浅层）',
        content: 'Teachers are important. They teach us knowledge. We should respect them.'
      },
      after: {
        title: '修改后（深度）',
        content: 'Teachers do more than transmit facts; they cultivate our ability to think independently. More importantly, through their dedication and passion, they inspire us to pursue excellence and become better versions of ourselves.'
      }
    }
  },
  fiveContinuationMethods: {
    title: '五种续写法',
    subtitle: '解决写作卡壳问题',
    description: '当你不知道下一句写什么时，使用以下5种方法',
    methods: [
      {
        name: '方法1：找对立假想敌',
        description: '提出一个可能的反对意见，然后反驳',
        template: 'Some might argue that..., but...',
        example: 'Some might argue that technology isolates people, but in reality, it connects us across geographical boundaries.'
      },
      {
        name: '方法2：举三种例子',
        description: '从三个不同角度举例（个人/社会/历史）',
        template: 'For instance, at the individual level... At the societal level... Historically...',
        example: 'For instance, at the individual level, reading expands our horizons. At the societal level, it promotes cultural understanding. Historically, great thinkers have always been avid readers.'
      },
      {
        name: '方法3：高分例证三标准',
        description: '具体（specific）+ 相关（relevant）+ 简洁（concise）',
        template: 'Take ___ as an example. ... This illustrates that...',
        example: 'Take Elon Musk as an example. Despite numerous failures, he persisted in developing reusable rockets. This illustrates that perseverance is the key to success.'
      },
      {
        name: '方法4：同义替换',
        description: '用不同的词表达同一个意思，避免重复',
        template: 'In other words, ... / That is to say, ... / To put it differently, ...',
        example: 'Technology has transformed our lives. In other words, the way we live, work, and communicate has been fundamentally changed by digital innovation.'
      },
      {
        name: '方法5：车辘话来回说',
        description: '从不同角度重申同一个观点（正反对比）',
        template: 'On the one hand, ... On the other hand, ...',
        example: 'On the one hand, competition drives innovation. On the other hand, it may also lead to excessive stress. Therefore, we need to strike a balance.'
      }
    ]
  }
}

function toggleFramework(id: number) {
  expandedFramework.value = expandedFramework.value === id ? null : id
}

// ========== Tab 2: Sentences Data ==========
const sentenceDetailVisible = ref(false)
const selectedSentence = ref<any>(null)

const sentenceCategories = [
  {
    id: 1,
    icon: '🔝',
    title: '开头引入 | Opening (去模板化版)',
    sentences: [
      {
        id: 1,
        english: 'In contemporary society, ___ has emerged as a focal point of public discourse.',
        chinese: '在当代社会，___已成为公众讨论的焦点。',
        tags: ['universal', 'formal'],
        structure: '<strong>In contemporary society,</strong> [话题] <strong>has emerged as a focal point of public discourse.</strong>',
        examples: [
          { context: '科技话题', sentence: 'In contemporary society, artificial intelligence has emerged as a focal point of public discourse.' },
          { context: '教育话题', sentence: 'In contemporary society, educational equity has emerged as a focal point of public discourse.' }
        ],
        tips: ['用contemporary替代recently', 'emerged as比become更生动', 'discourse比concern更学术'],
        memoryTip: '"当代焦点"句式 - 🎯靶心联想：contemporary=当代靶心，focal point=焦点，精准命中话题',
        usage: '万能开头，适合80%议论文题目，避免使用烂俗的Recently...has aroused wide concern'
      },
      {
        id: 2,
        english: 'While opinions diverge on ___, a growing consensus recognizes its profound implications.',
        chinese: '尽管人们对___看法分歧，但越来越多的人认识到其深远影响。',
        tags: ['contrast', 'balanced'],
        structure: '<strong>While opinions diverge on</strong> [话题], <strong>a growing consensus recognizes</strong> [影响].',
        examples: [
          { context: '社交媒体', sentence: 'While opinions diverge on social media regulation, a growing consensus recognizes its profound implications for privacy.' },
          { context: '远程办公', sentence: 'While opinions diverge on remote work policies, a growing consensus recognizes their profound implications for work-life balance.' }
        ],
        tips: ['diverge比vary更正式', 'consensus强调共识', 'implications比impact更深层'],
        memoryTip: '"分歧共识"句式 - ⚖️天平联想：一边是opinions diverge（分歧），另一边是growing consensus（共识）',
        usage: '适合有争议的话题，展现辩证思维，避免单一的Recently...句式'
      },
      {
        id: 3,
        english: 'The advent of ___ has precipitated a paradigm shift in how we perceive ___.',
        chinese: '___的出现引发了我们对___认知的范式转变。',
        tags: ['trend', 'academic'],
        structure: '<strong>The advent of</strong> [事物A] <strong>has precipitated a paradigm shift in how we perceive</strong> [事物B].',
        examples: [
          { context: '互联网', sentence: 'The advent of the internet has precipitated a paradigm shift in how we perceive information access.' },
          { context: 'AI技术', sentence: 'The advent of AI technology has precipitated a paradigm shift in how we perceive human creativity.' }
        ],
        tips: ['advent比development更精确', 'precipitated比caused更学术', 'paradigm shift是高级表达'],
        memoryTip: '"范式转变"句式 - 🔄循环箭头联想：advent=出现→precipitated=引发→paradigm shift=范式转变',
        usage: '适合科技/社会发展类话题，展现学术深度，避免平庸的With the development of...'
      }
    ]
  },
  {
    id: 2,
    icon: '️',
    title: '论证过渡 | Transition (去模板化版)',
    sentences: [
      {
        id: 4,
        english: 'What deserves special attention is that...',
        chinese: '值得特别关注的是...',
        tags: ['emphasis', 'progressive'],
        structure: '[前一句]. <strong>What deserves special attention is that</strong> [深入观点].',
        examples: [
          { context: '科技影响', sentence: 'Technology has transformed communication. What deserves special attention is that it has also reshaped our cognitive patterns.' }
        ],
        tips: ['比Furthermore更有层次感', 'deserves special attention强调重要性'],
        memoryTip: '"值得关注"句式 - 🔍放大镜联想：deserves=值得，special attention=特别关注→放大细节',
        usage: '用于深化论证，引出更深层次的分析，避免机械使用First/Furthermore'
      },
      {
        id: 5,
        english: 'Not only does ___..., but it also...',
        chinese: '不仅...，而且...',
        tags: ['addition', 'emphasis'],
        structure: '<strong>Not only does</strong> [主语] [动词], <strong>but it also</strong> [动词].',
        examples: [
          { context: '教育价值', sentence: 'Not only does education expand knowledge, but it also cultivates critical thinking.' }
        ],
        tips: ['倒装句结构（does提前）', '语气强烈，展现语言功底'],
        memoryTip: '"不仅而且"句式 - ➕加号联想：not only=第一个加号，but also=第二个加号→双重强调',
        usage: '适合递进论证，展现句式多样性，避免单调的Moreover/In addition'
      },
      {
        id: 6,
        english: 'Admittedly, ..., yet this concern can be mitigated by...',
        chinese: '诚然，...，但这一担忧可以通过...来缓解。',
        tags: ['contrast', 'balanced'],
        structure: '<strong>Admittedly,</strong> [对立观点], <strong>yet this concern can be mitigated by</strong> [反驳方式].',
        examples: [
          { context: 'AI就业', sentence: 'Admittedly, AI may replace certain jobs, yet this concern can be mitigated by reskilling the workforce.' }
        ],
        tips: ['⭐⭐⭐高分技巧：对立假想敌', 'mitigated比solved更精确', '展现辩证思维'],
        memoryTip: '"诚然但是"句式 - ⚔️剑盾联想：Admittedly=盾牌（承认对方），yet=剑（反驳）→攻防兼备',
        usage: '这是阅卷老师最喜欢看到的辩证论证，必背！避免单一的However转折'
      }
    ]
  },
  {
    id: 3,
    icon: '✅',
    title: '结论总结 | Conclusion (去模板化版)',
    sentences: [
      {
        id: 7,
        english: 'In essence, the key to addressing ___ lies not in ___, but in ___.',
        chinese: '本质上，解决___的关键不在于___，而在于___。',
        tags: ['comprehensive', 'balanced'],
        structure: '<strong>In essence, the key to addressing</strong> [问题] <strong>lies not in</strong> [错误方式], <strong>but in</strong> [正确方式].',
        examples: [
          { context: '环保问题', sentence: 'In essence, the key to addressing climate change lies not in rejecting technology, but in harnessing it responsibly.' }
        ],
        tips: ['In essence比In conclusion更有深度', 'not in...but in...展现辩证思维'],
        memoryTip: '"本质关键"句式 - 🗝️钥匙联想：essence=本质精华，key=钥匙→找到解决问题的钥匙',
        usage: '适合复杂话题的总结，展现思辨深度，避免简单的In conclusion重申'
      },
      {
        id: 8,
        english: 'Looking ahead, it is imperative that we strike a balance between ___ and ___.',
        chinese: '展望未来，我们必须在___和___之间取得平衡。',
        tags: ['trend', 'action'],
        structure: '<strong>Looking ahead, it is imperative that we strike a balance between</strong> [方面A] <strong>and</strong> [方面B].',
        examples: [
          { context: '科技发展', sentence: 'Looking ahead, it is imperative that we strike a balance between innovation and ethical considerations.' }
        ],
        tips: ['imperative比important更紧迫', 'strike a balance是地道表达'],
        memoryTip: '"展望未来"句式 - 🔭望远镜联想：looking ahead=向前看，strike balance=天平→平衡未来',
        usage: '适合科技/社会发展类话题的结尾，避免平庸的In the future'
      },
      {
        id: 9,
        english: 'Only through concerted efforts can we hope to ___,' ,
        chinese: '只有通过共同努力，我们才能希望___。',
        tags: ['urgent', 'collective'],
        structure: '<strong>Only through concerted efforts can we hope to</strong> [目标].',
        examples: [
          { context: '社会问题', sentence: 'Only through concerted efforts can we hope to bridge the gap between rich and poor.' }
        ],
        tips: ['concerted强调协同合作', '倒装句结构增强语气'],
        memoryTip: '"共同努力"句式 - 🤝握手联想：concerted=协力的，efforts=努力→携手共进',
        usage: '适合呼吁集体行动的话题，避免老套的We should take measures'
      }
    ]
  },
  {
    id: 4,
    icon: '📈',
    title: '数据描述 | Data Description (去模板化版)',
    sentences: [
      {
        id: 10,
        english: 'The data reveals a striking upward/downward trajectory in ___.',
        chinese: '数据显示___呈现出显著的上升/下降趋势。',
        tags: ['trend', 'chart'],
        structure: '<strong>The data reveals a striking</strong> [upward/downward] <strong>trajectory in</strong> [主题].',
        examples: [
          { context: '增长描述', sentence: 'The data reveals a striking upward trajectory in online education enrollment.' }
        ],
        tips: ['trajectory比trend更精确', 'striking强调显著性', 'reveals比shows更学术'],
        memoryTip: '"轨迹趋势"句式 - 📈曲线图联想：trajectory=飞行轨迹→数据的变化路径',
        usage: '适合图表作文，避免平庸的has increased significantly'
      },
      {
        id: 11,
        english: 'In stark contrast to ___, ___ exhibits a markedly different pattern.',
        chinese: '与___形成鲜明对比的是，___呈现出明显不同的模式。',
        tags: ['comparison', 'chart'],
        structure: '<strong>In stark contrast to</strong> [对比对象1], [对比对象2] <strong>exhibits a markedly different pattern.</strong>',
        examples: [
          { context: '对比描述', sentence: 'In stark contrast to urban areas, rural regions exhibit a markedly different consumption pattern.' }
        ],
        tips: ['stark contrast强调强烈对比', 'exhibits比shows更正式', 'pattern比trend更全面'],
        memoryTip: '"鲜明对比"句式 - ⚖️天平倾斜联想：stark=鲜明的，contrast=对比→天平两端差异巨大',
        usage: '适合两个群体或时间点的对比，避免简单的Compared with...is higher'
      },
      {
        id: 12,
        english: 'This figure constitutes approximately ___% of the overall total.',
        chinese: '这一数字约占总体总数的___%。',
        tags: ['proportion', 'chart'],
        structure: '[某物] <strong>constitutes approximately</strong> [数字]% <strong>of the overall total.</strong>',
        examples: [
          { context: '比例描述', sentence: 'Renewable energy constitutes approximately 30% of the overall energy mix.' }
        ],
        tips: ['constitutes比accounts for更正式', 'approximately比about更学术'],
        memoryTip: '"构成比例"句式 - 🥧饼图分块联想：constitutes=构成，approximately=大约→饼图中的一块',
        usage: '适合饼图或占比描述，避免重复使用accounts for'
      }
    ]
  },
  {
    id: 5,
    icon: '💎',
    title: '高级替换 | Advanced Substitution (去模板化版)',
    sentences: [
      {
        id: 13,
        english: 'Instead of "important", use: pivotal / instrumental / paramount',
        chinese: '用pivotal/instrumental/paramount替换important',
        tags: ['vocabulary', 'upgrade'],
        structure: 'Replace <del>important</del> with <ins>pivotal/instrumental/paramount</ins>',
        examples: [
          { context: '原句', sentence: 'Education is important for success.' },
          { context: '升级', sentence: 'Education plays a pivotal role in achieving success.' }
        ],
        tips: ['pivotal强调关键转折点', 'instrumental强调工具性作用', 'paramount强调至高无上'],
        memoryTip: '"关键重要"句式 - 🗝️钥匙联想：pivotal=枢纽，instrumental=乐器/工具→关键要素',
        usage: '避免重复使用crucial/vital，这三个词更少见且精准'
      },
      {
        id: 14,
        english: 'Instead of "think/believe", use: contend / posit / assert',
        chinese: '用contend/posit/assert替换think/believe',
        tags: ['vocabulary', 'academic'],
        structure: 'Replace <del>I think/believe</del> with <ins>I contend/posit/assert that</ins>',
        examples: [
          { context: '原句', sentence: 'I believe that technology benefits society.' },
          { context: '升级', sentence: 'I contend that technology serves as a catalyst for social progress.' }
        ],
        tips: ['contend强调辩论立场', 'posi提出假设', 'assert强调断言'],
        memoryTip: '"主张认为"句式 - 🎤麦克风联想：contend=争论，posit=提出，assert=断言→学术表达',
        usage: '适合学术写作，展现词汇深度，避免平庸的argue/maintain'
      },
      {
        id: 15,
        english: 'Instead of "help/improve", use: facilitate / bolster / catalyze',
        chinese: '用facilitate/bolster/catalyze替换help/improve',
        tags: ['vocabulary', 'action'],
        structure: 'Replace <del>help/improve</del> with <ins>facilitate/bolster/catalyze</ins>',
        examples: [
          { context: '原句', sentence: 'Technology helps people communicate better.' },
          { context: '升级', sentence: 'Technology facilitates seamless communication across geographical barriers.' }
        ],
        tips: ['facilitate强调促进过程', 'bolster强调支撑加强', 'catalyze强调催化加速'],
        memoryTip: '"促进提升"句式 - ⚡闪电联想：facilitate=使便利，bolster=支撑，catalyze=催化→能量提升',
        usage: '避免重复使用promote/enhance，这三个词更具动态感'
      }
    ]
  },
  {
    id: 6,
    icon: '🎯',
    title: '举例论证 | Examples (去模板化版)',
    sentences: [
      {
        id: 16,
        english: 'To illustrate this point, consider the case of...',
        chinese: '为了说明这一点，考虑...的案例。',
        tags: ['example', 'emphasis'],
        structure: '<strong>To illustrate this point, consider the case of</strong> [例子].',
        examples: [
          { context: '科技例子', sentence: 'To illustrate this point, consider the case of Tesla\'s disruption of the automotive industry.' }
        ],
        tips: ['To illustrate比For example更正式', 'consider the case of引导具体案例'],
        memoryTip: '"案例说明"句式 - 🔍放大镜联想：illustrate=阐明，case=案例→聚焦具体实例',
        usage: '适合引入详细案例，避免平庸的For instance'
      },
      {
        id: 17,
        english: 'A compelling illustration of this is...',
        chinese: '对此的一个有力说明是...',
        tags: ['example', 'formal'],
        structure: '<strong>A compelling illustration of this is</strong> [例子].',
        examples: [
          { context: '教育例子', sentence: 'A compelling illustration of this is Finland\'s education reform in the 1990s.' }
        ],
        tips: ['compelling强调说服力', 'illustration比example更生动'],
        memoryTip: '"有力说明"句式 - 💪肌肉联想：compelling=引人注目的，illustration=图示→强有力的证据',
        usage: '适合学术写作，展现词汇丰富度，避免重复使用example'
      },
      {
        id: 18,
        english: '___ serves as a paradigmatic example of this phenomenon.',
        chinese: '___是这一现象的典型例证。',
        tags: ['example', 'academic'],
        structure: '[例子] <strong>serves as a paradigmatic example of</strong> [现象].',
        examples: [
          { context: '环保例子', sentence: 'The Paris Agreement serves as a paradigmatic example of international climate cooperation.' }
        ],
        tips: ['paradigmatic强调典型性', 'serves as比is更正式'],
        memoryTip: '"典型例证"句式 - 🏆奖杯联想：paradigmatic=典范的，example=例子→模范案例',
        usage: '适合引入经典案例，展现学术深度，避免简单的Take...as an example'
      }
    ]
  },
  {
    id: 7,
    icon: '⚖️',
    title: '因果分析 | Cause & Effect (去模板化版)',
    sentences: [
      {
        id: 19,
        english: 'This phenomenon can be attributed to a confluence of factors, chief among which is...',
        chinese: '这一现象可归因于多种因素的汇聚，其中最主要的是...',
        tags: ['cause', 'explanation'],
        structure: '<strong>This phenomenon can be attributed to a confluence of factors, chief among which is</strong> [主要原因].',
        examples: [
          { context: '解释原因', sentence: 'The rise of remote work can be attributed to a confluence of factors, chief among which is technological advancement.' }
        ],
        tips: ['confluence强调多因素汇聚', 'chief among which是高级定语从句', '比mainly because更学术'],
        memoryTip: '"多因汇聚"句式 - 🌊河流汇合联想：confluence=汇流，factors=因素→多条河流汇聚成主因',
        usage: '适合复杂现象的原因分析，避免简单的This is because'
      },
      {
        id: 20,
        english: 'The ramifications of this extend far beyond ___, affecting ___ in profound ways.',
        chinese: '其影响远不止___，还以深刻的方式影响着___。',
        tags: ['effect', 'impact'],
        structure: '<strong>The ramifications of this extend far beyond</strong> [范围A], <strong>affecting</strong> [范围B] <strong>in profound ways.</strong>',
        examples: [
          { context: '说明结果', sentence: 'The ramifications of AI extend far beyond automation, affecting employment structures in profound ways.' }
        ],
        tips: ['ramifications比consequences更深层', 'extend far beyond强调影响广泛'],
        memoryTip: '"深远影响"句式 - 🌊波纹扩散联想：ramifications=分支后果，extend far beyond→波纹扩散到远处',
        usage: '适合描述连锁反应或长期影响，避免平庸的As a result'
      },
      {
        id: 21,
        english: 'Underpinning this trend is the fundamental shift in...',
        chinese: '支撑这一趋势的是...的根本性转变。',
        tags: ['cause', 'deep'],
        structure: '<strong>Underpinning this trend is the fundamental shift in</strong> [深层原因].',
        examples: [
          { context: '深层分析', sentence: 'Underpinning this trend is the fundamental shift in consumer preferences toward sustainability.' }
        ],
        tips: ['Underpinning强调底层支撑', 'fundamental shift强调根本性变化', '倒装句结构'],
        memoryTip: '"底层支撑"句式 - 🏛️建筑地基联想：underpinning=支撑基础，fundamental=根本的→地基层',
        usage: '适合深入分析现象背后的本质原因，展现思辨深度'
      }
    ]
  },
  {
    id: 8,
    icon: '💡',
    title: '建议措施 | Suggestions (去模板化版)',
    sentences: [
      {
        id: 22,
        english: 'It is incumbent upon ___ to take proactive steps toward...',
        chinese: '___有责任采取积极措施朝着...迈进。',
        tags: ['suggestion', 'responsibility'],
        structure: '<strong>It is incumbent upon</strong> [责任主体] <strong>to take proactive steps toward</strong> [目标].',
        examples: [
          { context: '提建议', sentence: 'It is incumbent upon governments to take proactive steps toward carbon neutrality.' }
        ],
        tips: ['incumbent upon强调责任担当', 'proactive比effective更主动', '比advisable更正式'],
        memoryTip: '"责任担当"句式 - 🎯靶心联想：incumbent=责无旁贷的，proactive=主动的→瞄准目标行动',
        usage: '适合呼吁政府或机构承担责任，避免平庸的We should'
      },
      {
        id: 23,
        english: 'A multifaceted approach encompassing ___ and ___ is warranted.',
        chinese: '需要一种包含___和___的多层面方法。',
        tags: ['action', 'comprehensive'],
        structure: '<strong>A multifaceted approach encompassing</strong> [方面A] <strong>and</strong> [方面B] <strong>is warranted.</strong>',
        examples: [
          { context: '呼吁行动', sentence: 'A multifaceted approach encompassing policy reform and public education is warranted to address this issue.' }
        ],
        tips: ['multifaceted强调多层面', 'encompassing比including更全面', 'warranted强调必要性'],
        memoryTip: '"多层面方法"句式 - 🧩拼图联想：multifaceted=多方面的，encompassing=包含→拼凑完整方案',
        usage: '适合复杂问题的解决方案，展现系统性思维，避免简单的take measures'
      },
      {
        id: 24,
        english: 'Only by fostering a culture of ___ can we hope to achieve ___.',
        chinese: '只有通过培养___的文化，我们才能希望实现___。',
        tags: ['condition', 'cultural'],
        structure: '<strong>Only by fostering a culture of</strong> [文化/理念] <strong>can we hope to achieve</strong> [目标].',
        examples: [
          { context: '强调条件', sentence: 'Only by fostering a culture of innovation can we hope to achieve sustainable economic growth.' }
        ],
        tips: ['fostering强调培育过程', 'culture of强调文化氛围', '倒装句增强语气'],
        memoryTip: '"文化培育"句式 - 🌱种子发芽联想：fostering=培育，culture=文化→种子长成大树',
        usage: '适合强调长期文化建设，避免机械的Only by...can we'
      }
    ]
  }
]

// ========== Tab 7: Anti-Template Strategies - 去模板化写作策略 ==========
const antiTemplateStrategies = {
  warning: {
    title: '⚠️ 为什么套模板会得低分？',
    reasons: [
      '阅卷老师每天看数百篇作文，能一眼识别模板痕迹',
      '模板语言与个人表达风格不匹配，显得生硬',
      '过度依赖模板导致思维僵化，无法灵活应对不同题目',
      '高分作文的关键是"自然流畅"而非"机械套用"'
    ]
  },
  openingVariations: {
    title: '开头多样化表达（避免都用Recently...）',
    strategies: [
      {
        name: '策略1：现象描述法',
        examples: [
          'In contemporary society, ___ has become an increasingly prominent issue.',
          'The phenomenon of ___ has sparked heated debates in recent years.',
          'With the advent of ___, our daily lives have undergone profound changes.'
        ],
        tip: '用contemporary/prominent/sparked等词替换常见的wide concern'
      },
      {
        name: '策略2：对比引入法',
        examples: [
          'While some people embrace ___, others remain skeptical about its benefits.',
          'The traditional view holds that ___, but modern perspectives suggest otherwise.',
          'There is a growing consensus that ___, yet dissenting voices persist.'
        ],
        tip: '通过对比展现思辨能力，比单一陈述更有深度'
      },
      {
        name: '策略3：数据/事实引入法',
        examples: [
          'According to a recent survey, over 60% of respondents believe that ___.',
          'Statistics reveal that ___ has increased by 50% in the past decade.',
          'A case study conducted by Harvard University shows that ___.'
        ],
        tip: '引用具体数据或研究，增强说服力（可以虚构但要合理）'
      },
      {
        name: '策略4：问题引导法',
        examples: [
          'Have you ever wondered why ___ has become so prevalent?',
          'What lies behind the rapid growth of ___?',
          'Is ___ a blessing or a curse? This question deserves careful consideration.'
        ],
        tip: '用问句吸引读者注意，但全文只能出现1-2个问句'
      }
    ]
  },
  transitionVariations: {
    title: '连接词多样化（避免机械使用First/Furthermore/Last）',
    categories: [
      {
        name: '递进关系（替换Furthermore）',
        alternatives: [
          'Moreover / In addition / Besides',
          'What\'s more / Equally important',
          'Another compelling argument is that...',
          'Not only does ___..., but it also...'
        ]
      },
      {
        name: '转折关系（替换However）',
        alternatives: [
          'Nevertheless / Nonetheless',
          'On the contrary / Conversely',
          'Despite this / In spite of this',
          'Yet / Still / Even so'
        ]
      },
      {
        name: '因果关系（替换Therefore）',
        alternatives: [
          'Consequently / As a result',
          'Hence / Thus',
          'For this reason / Due to this',
          'This explains why...'
        ]
      },
      {
        name: '举例论证（替换For example）',
        alternatives: [
          'To illustrate / To demonstrate',
          'A case in point is...',
          'Consider the case of...',
          '___ serves as a prime example.'
        ]
      }
    ]
  },
  conclusionVariations: {
    title: '结尾多样化（避免都用In conclusion...）',
    strategies: [
      {
        name: '策略1：重申+升华',
        examples: [
          'To sum up, while ___ presents challenges, its benefits are undeniable. What matters most is how we harness its potential responsibly.',
          'In essence, the key to addressing ___ lies not in rejection, but in balanced and thoughtful integration.'
        ],
        tip: '不仅总结，还要提升到更高层面'
      },
      {
        name: '策略2：展望未来',
        examples: [
          'Looking ahead, it is imperative that we strike a balance between ___ and ___.',
          'As we move forward, the challenge will be to preserve ___ while embracing ___.',
          'The future of ___ depends largely on our collective willingness to ___.'
        ],
        tip: '用Looking ahead/As we move forward替代简单的In the future'
      },
      {
        name: '策略3：呼吁行动',
        examples: [
          'It is high time that we took concrete actions to address this pressing issue.',
          'Only through collaborative efforts can we hope to overcome these challenges.',
          'The responsibility falls on each of us to contribute to a better ___.'
        ],
        tip: '强调紧迫性和责任感，增强感染力'
      }
    ]
  },
  vocabularyUpgrade: {
    title: '词汇升级对照表（避免重复使用简单词）',
    upgrades: [
      { basic: 'important', advanced: ['crucial', 'vital', 'paramount', 'indispensable'] },
      { basic: 'good', advanced: ['beneficial', 'advantageous', 'favorable', 'positive'] },
      { basic: 'bad', advanced: ['detrimental', 'adverse', 'harmful', 'negative'] },
      { basic: 'think', advanced: ['argue', 'maintain', 'contend', 'assert'] },
      { basic: 'show', advanced: ['demonstrate', 'illustrate', 'reveal', 'indicate'] },
      { basic: 'get', advanced: ['obtain', 'acquire', 'gain', 'attain'] },
      { basic: 'help', advanced: ['facilitate', 'assist', 'aid', 'contribute to'] },
      { basic: 'change', advanced: ['transform', 'alter', 'modify', 'reshape'] }
    ]
  },
  naturalFlow: {
    title: '如何让文章更自然流畅？',
    tips: [
      {
        tip: '1. 避免每段开头都用连接词',
        explanation: '不是每段都要First/Furthermore，有时直接陈述观点更自然'
      },
      {
        tip: '2. 句式长短结合',
        explanation: '不要全是长句或全是短句，交替使用增加节奏感'
      },
      {
        tip: '3. 适当使用插入语',
        explanation: '如", however,", ", in fact,", ", surprisingly," 增加口语化感觉'
      },
      {
        tip: '4. 避免绝对化表达',
        explanation: '用may/might/could代替must/should，用some/many代替all/every'
      },
      {
        tip: '5. 前后呼应',
        explanation: '结尾要回应开头的观点，形成闭环，但不要简单重复'
      }
    ]
  }
}

function tagLabel(tag: string): string {
  const labels: Record<string, string> = {
    universal: '通用',
    formal: '正式',
    current: '时事',
    social: '社会',
    emphasis: '强调',
    contrast: '对比',
    balanced: '平衡',
    addition: '递进',
    progressive: '渐进',
    '转折': '转折',
    summary: '总结',
    final: '结尾',
    comprehensive: '综合',
    urgent: '紧迫',
    action: '行动',
    trend: '趋势',
    chart: '图表',
    comparison: '比较',
    proportion: '比例',
    vocabulary: '词汇',
    upgrade: '升级',
    academic: '学术'
  }
  return labels[tag] || tag
}

function showSentenceDetail(sentence: any) {
  selectedSentence.value = sentence
  sentenceDetailVisible.value = true
}

// 记忆技巧函数
function getMemoryMnemonic(sentence: any): string {
  const mnemonics: Record<number, string> = {
    1: '“当代焦点” - In contemporary society...has emerged as a focal point（在当代社会...已成为焦点）',
    2: '“分歧共识” - While opinions diverge...a growing consensus recognizes（尽管分歧...但共识认可）',
    3: '“范式转变” - The advent of...has precipitated a paradigm shift（...的出现引发范式转变）',
    4: '“值得关注” - What deserves special attention is that（值得特别关注的是）',
    5: '“不仅而且” - Not only does..., but it also...（倒装句：不仅...而且）',
    6: '“诚然但是” - Admittedly..., yet this concern can be mitigated by（诚然...但可通过...缓解）⭐高分',
    7: '“本质关键” - In essence, the key lies not in..., but in...（本质关键在于不是...而是）',
    8: '“展望未来” - Looking ahead, it is imperative to strike a balance（展望未来必须平衡）',
    9: '“共同努力” - Only through concerted efforts can we（只有通过共同努力才能）',
    10: '“轨迹趋势” - The data reveals a striking trajectory（数据显示显著轨迹）',
    11: '“鲜明对比” - In stark contrast to..., ...exhibits a different pattern（与...形成鲜明对比）',
    12: '“构成比例” - This figure constitutes approximately...%（这一数字约占...%）',
    13: '“关键重要” - important→pivotal/instrumental/paramount（重要的升级词）',
    14: '“主张认为” - think/believe→contend/posit/assert（认为的学术表达）',
    15: '“促进提升” - help/improve→facilitate/bolster/catalyze（帮助/提升的动态词）',
    16: '“案例说明” - To illustrate this point, consider the case of（为说明这点，考虑...案例）',
    17: '“有力说明” - A compelling illustration of this is（对此的有力说明是）',
    18: '“典型例证” - ...serves as a paradigmatic example（...是典型例证）',
    19: '“多因汇聚” - attributed to a confluence of factors, chief among which is（归因于多因素汇聚，主因是）',
    20: '“深远影响” - ramifications extend far beyond..., affecting...（影响远不止...还影响）',
    21: '“底层支撑” - Underpinning this trend is the fundamental shift（支撑趋势的是根本转变）',
    22: '“责任担当” - It is incumbent upon...to take proactive steps（...有责任采取积极措施）',
    23: '“多层面法” - A multifaceted approach encompassing...is warranted（需要包含...的多层面方法）',
    24: '“文化培育” - Only by fostering a culture of...can we（只有培养...文化才能）'
  }
  return mnemonics[sentence.id] || '记住句型结构和关键词'
}

function getMemoryAssociation(sentence: any): string {
  const associations: Record<number, string> = {
    1: '想象靶心🎯：contemporary society（当代社会）→ focal point（焦点）→ 精准命中话题',
    2: '想象天平⚖️：opinions diverge（分歧）←→ growing consensus（共识）→ 平衡观点',
    3: '想象循环箭头🔄：advent（出现）→ precipitated（引发）→ paradigm shift（范式转变）',
    4: '想象放大镜🔍：deserves special attention（值得特别关注）→ 放大细节深入分析',
    5: '想象加号➕：Not only（第一个加号）+ but also（第二个加号）→ 双重强调',
    6: '想象剑盾⚔️：Admittedly（盾牌承认）→ yet（剑反驳）→ mitigated（缓解）→ 攻防兼备⭐',
    7: '想象钥匙🗝️：In essence（本质）→ key（钥匙）→ not in...but in...（不是...而是）→ 找到关键',
    8: '想象望远镜🔭：Looking ahead（向前看）→ strike balance（天平平衡）→ 未来展望',
    9: '想象握手🤝：concerted efforts（协力努力）→ hope to achieve（希望实现）→ 携手共进',
    10: '想象曲线图📈：data reveals（数据揭示）→ striking trajectory（显著轨迹）→ 趋势变化',
    11: '想象倾斜天平⚖️：stark contrast（鲜明对比）→ markedly different（明显不同）→ 差异巨大',
    12: '想象饼图分块🥧：constitutes（构成）→ approximately（大约）→ % of total（占总数的百分比）',
    13: '想象钥匙🗝️：important→pivotal（枢纽）/instrumental（工具）/paramount（至高）→ 升级表达',
    14: '想象麦克风🎤：contend（争论）/posit（提出）/assert（断言）→ 学术表达观点',
    15: '想象闪电⚡：facilitate（促进）/bolster（支撑）/catalyze（催化）→ 动态能量提升',
    16: '想象放大镜🔍：To illustrate（阐明）→ consider the case（考虑案例）→ 聚焦实例',
    17: '想象肌肉💪：compelling（引人注目的）→ illustration（图示）→ 强有力的证据',
    18: '想象奖杯🏆：paradigmatic（典范的）→ example（例子）→ 模范案例',
    19: '想象河流汇合🌊：confluence（汇流）→ factors（因素）→ chief among which（主因）→ 多因汇聚',
    20: '想象波纹扩散🌊：ramifications（分支后果）→ extend far beyond（远不止）→ 影响深远',
    21: '想象建筑地基🏛️：Underpinning（支撑基础）→ fundamental shift（根本转变）→ 地基层',
    22: '想象靶心🎯：incumbent upon（责无旁贷）→ proactive steps（积极措施）→ 瞄准目标行动',
    23: '想象拼图🧩：multifaceted（多方面的）→ encompassing（包含）→ 拼凑完整方案',
    24: '想象种子发芽🌱：fostering（培育）→ culture（文化）→ achieve（实现）→ 种子长成大树'
  }
  return associations[sentence.id] || '联想句型的实际应用场景'
}

function getMemoryUsage(sentence: any): string {
  const usages: Record<number, string> = {
    1: '适用：万能开头，适合80%议论文题目，避免烂俗的Recently...句式',
    2: '适用：有争议的话题，展现辩证思维，避免单一陈述',
    3: '适用：科技/社会发展类话题，展现学术深度',
    4: '适用：深化论证，引出更深层次分析，避免机械使用Furthermore',
    5: '适用：递进论证，展现句式多样性，避免单调的Moreover',
    6: '适用：⭐⭐⭐高分技巧！对立假想敌，阅卷老师最爱看到的辩证论证',
    7: '适用：复杂话题总结，展现思辨深度，避免简单In conclusion重申',
    8: '适用：科技/社会发展类结尾，避免平庸的In the future',
    9: '适用：呼吁集体行动，避免老套的We should take measures',
    10: '适用：图表作文趋势描述，避免平庸的has increased significantly',
    11: '适用：两个群体或时间点强烈对比，避免简单的Compared with',
    12: '适用：饼图或占比描述，避免重复使用accounts for',
    13: '适用：词汇升级，避免重复使用crucial/vital，这三个词更少见',
    14: '适用：学术写作表达观点，避免平庸的argue/maintain',
    15: '适用：动态表达促进/提升，避免重复使用promote/enhance',
    16: '适用：引入详细案例，避免平庸的For instance',
    17: '适用：学术写作展现词汇丰富度，避免重复使用example',
    18: '适用：引入经典案例，展现学术深度，避免Take...as an example',
    19: '适用：复杂现象原因分析，避免简单的This is because',
    20: '适用：描述连锁反应或长期影响，避免平庸的As a result',
    21: '适用：深入分析现象背后的本质原因，展现思辨深度',
    22: '适用：呼吁政府或机构承担责任，避免平庸的We should',
    23: '适用：复杂问题解决方案，展现系统性思维，避免take measures',
    24: '适用：强调长期文化建设，避免机械的Only by...can we'
  }
  return usages[sentence.id] || '根据句型特点灵活使用'
}

// ========== Tab 3: Practice Data ==========
const isPracticing = ref(false)
const remainingTime = ref(1800) // 30分钟 = 1800秒
const userEssay = ref('')
const autoSaveStatus = ref('')
let timer: any = null
let autoSaveTimer: any = null

const practiceTopics = [
  {
    id: 1,
    type: 'argumentative',
    typeLabel: '议论文',
    year: '2025模拟',
    title: 'The Impact of Social Media on Interpersonal Communication',
    content: `
      <p><strong>Directions:</strong></p>
      <p>For this part, you are allowed 30 minutes to write an essay on the impact of social media on interpersonal communication. You should write at least 150 words but no more than 200 words.</p>
      <p><strong>Outline:</strong></p>
      <ol>
        <li>Describe the phenomenon of social media usage</li>
        <li>Analyze its positive and negative effects</li>
        <li>Give your opinion and suggestions</li>
      </ol>
    `,
    requirements: '至少150词，不超过200词；三段式结构；使用至少2个高级句型'
  },
  {
    id: 2,
    type: 'chart',
    typeLabel: '图表作文',
    year: '2024真题',
    title: 'Changes in Online Shopping Trends (2020-2024)',
    content: `
      <p><strong>Directions:</strong></p>
      <p>Write an essay based on the following chart. In your essay, you should:</p>
      <ol>
        <li>Describe the changes shown in the chart</li>
        <li>Analyze the reasons for these changes</li>
        <li>Predict future trends or give suggestions</li>
      </ol>
      <p>You should write at least 150 words but no more than 200 words.</p>
    `,
    requirements: '客观描述数据 → 分析原因 → 预测趋势；使用数据描述句型'
  },
  {
    id: 3,
    type: 'letter',
    typeLabel: '书信',
    year: '2023真题',
    title: 'A Letter of Suggestion to University Library',
    content: `
      <p><strong>Directions:</strong></p>
      <p>Suppose you are a student in your university. Write a letter to the library to suggest improvements. In your letter, you should:</p>
      <ol>
        <li>Introduce yourself and state the purpose</li>
        <li>Provide specific suggestions (at least 2)</li>
        <li>Express your hope for consideration</li>
      </ol>
      <p>You should write about 100-120 words.</p>
    `,
    requirements: '正式书信格式；语气礼貌；建议具体可行'
  },
  {
    id: 4,
    type: 'argumentative',
    typeLabel: '议论文',
    year: '2025模拟',
    title: 'The Importance of Lifelong Learning',
    content: `
      <p><strong>Directions:</strong></p>
      <p>For this part, you are allowed 30 minutes to write an essay on the importance of lifelong learning. You should write at least 150 words but no more than 200 words.</p>
      <p><strong>Outline:</strong></p>
      <ol>
        <li>Explain what lifelong learning means</li>
        <li>Discuss why it is important in modern society</li>
        <li>Give suggestions on how to practice lifelong learning</li>
      </ol>
    `,
    requirements: '定义终身学习 → 论述重要性 → 提出建议；使用举例论证'
  },
  {
    id: 5,
    type: 'chart',
    typeLabel: '图表作文',
    year: '2024模拟',
    title: 'Changes in College Students\' Exercise Habits (2019-2024)',
    content: `
      <p><strong>Directions:</strong></p>
      <p>Write an essay based on the following chart showing the changes in college students' exercise habits from 2019 to 2024. In your essay, you should:</p>
      <ol>
        <li>Describe the data shown in the chart</li>
        <li>Analyze the possible reasons for these changes</li>
        <li>Give your comments or suggestions</li>
      </ol>
      <p>You should write at least 150 words but no more than 200 words.</p>
    `,
    requirements: '描述数据变化 → 分析原因 → 给出建议；使用对比句型'
  },
  {
    id: 6,
    type: 'letter',
    typeLabel: '书信',
    year: '2023模拟',
    title: 'A Letter of Complaint to the Canteen Manager',
    content: `
      <p><strong>Directions:</strong></p>
      <p>Suppose you are a student who is not satisfied with the service in the university canteen. Write a letter of complaint to the manager. In your letter, you should:</p>
      <ol>
        <li>State the purpose of your letter</li>
        <li>Describe the problems you encountered</li>
        <li>Suggest improvements and express your expectations</li>
      </ol>
      <p>You should write about 100-120 words.</p>
    `,
    requirements: '礼貌投诉；问题描述清晰；建议合理；语气得体'
  }
]

const currentTopic = ref<any>(null)

function startPractice() {
  isPracticing.value = true
  remainingTime.value = 1800
  userEssay.value = ''
  autoSaveStatus.value = '💾 已启用自动保存'
  // 随机选择一个题目
  currentTopic.value = practiceTopics[Math.floor(Math.random() * practiceTopics.length)]
  
  // 启动计时器
  timer = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--
    } else {
      stopPractice()
      alert('时间到！请停止写作。')
    }
  }, 1000)
  
  // 启动自动保存（每30秒保存一次）
  autoSaveTimer = setInterval(() => {
    if (userEssay.value.trim().length > 0) {
      const draft = {
        topic: currentTopic.value?.title,
        content: userEssay.value,
        wordCount: wordCount.value,
        timestamp: new Date().toISOString()
      }
      localStorage.setItem('writing-draft', JSON.stringify(draft))
      autoSaveStatus.value = '✅ 已自动保存 (' + formatTime(remainingTime.value) + ')'
      
      // 2秒后清除提示
      setTimeout(() => {
        autoSaveStatus.value = '💾 自动保存中...'
      }, 2000)
    }
  }, 30000)
}

function stopPractice() {
  isPracticing.value = false
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  if (autoSaveTimer) {
    clearInterval(autoSaveTimer)
    autoSaveTimer = null
  }
  autoSaveStatus.value = ''
  
  // 保存练习记录
  if (userEssay.value.trim().length > 0) {
    const practiceRecord = {
      date: new Date().toISOString(),
      topic: currentTopic.value?.title,
      wordCount: wordCount.value,
      timeUsed: 1800 - remainingTime.value,
      essay: userEssay.value
    }
    const records = JSON.parse(localStorage.getItem('writing-practice-records') || '[]')
    records.push(practiceRecord)
    localStorage.setItem('writing-practice-records', JSON.stringify(records))
    
    // 最后一次保存草稿
    const draft = {
      topic: currentTopic.value?.title,
      content: userEssay.value,
      wordCount: wordCount.value,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('writing-draft', JSON.stringify(draft))
  }
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const wordCount = computed(() => {
  if (!userEssay.value.trim()) return 0
  return userEssay.value.trim().split(/\s+/).length
})

// ========== Tab 4: Examples Data ==========
const exampleDetailVisible = ref(false)
const selectedExample = ref<any>(null)
const exampleFilter = ref('')
const yearFilter = ref('')

const modelExamples = [
  {
    id: 1,
    type: 'argumentative',
    typeLabel: '议论文',
    year: '2025',
    score: 13,
    title: 'The Role of Technology in Education',
    excerpt: 'With the rapid development of technology, online learning has become increasingly popular...',
    fullEssay: `
      <p>With the rapid development of technology, online learning has become increasingly popular in recent years. From my perspective, I firmly believe that technology plays a crucial role in modern education.</p>
      
      <p>First and foremost, technology makes education more accessible. Students from remote areas can now access quality educational resources through online platforms. Furthermore, interactive learning tools enhance students' engagement and understanding. For instance, virtual reality allows students to explore historical sites without leaving the classroom. Last but not least, personalized learning algorithms help students learn at their own pace.</p>
      
      <p>In conclusion, technology has revolutionized education in numerous ways. It is high time that we embraced these changes and made full use of technological advantages to improve learning outcomes.</p>
    `,
    highlights: [
      { category: '开头引入', description: '使用"With the rapid development of"经典开头，自然引出话题', example: 'With the rapid development of technology...' },
      { category: '观点明确', description: '第二段首句直接表明立场，使用"I firmly believe that"增强语气' },
      { category: '逻辑清晰', description: '使用First and foremost/Furthermore/Last but not least三个连接词，层次分明' },
      { category: '举例论证', description: '提供具体例子（virtual reality）支撑论点，增强说服力' },
      { category: '结尾有力', description: '使用"It is high time that"虚拟语气，表达紧迫感' }
    ],
    vocabulary: [
      { word: 'accessible', meaning: '可获得的，易接近的' },
      { word: 'interactive', meaning: '互动的' },
      { word: 'engagement', meaning: '参与度' },
      { word: 'personalized', meaning: '个性化的' },
      { word: 'revolutionized', meaning: '彻底改变' }
    ]
  },
  {
    id: 2,
    type: 'chart',
    typeLabel: '图表作文',
    year: '2024',
    score: 12,
    title: 'Changes in Energy Consumption Patterns',
    excerpt: 'As is clearly shown in the chart, renewable energy consumption has increased significantly...',
    fullEssay: `
      <p>As is clearly shown in the chart, renewable energy consumption has increased significantly from 15% in 2010 to 35% in 2024. Meanwhile, fossil fuel usage has decreased correspondingly.</p>
      
      <p>Several factors contribute to this phenomenon. On the one hand, growing environmental awareness has prompted governments and individuals to seek cleaner energy sources. On the other hand, technological advancements have made renewable energy more cost-effective. Compared with traditional energy, solar and wind power are becoming increasingly competitive.</p>
      
      <p>Based on the analysis above, it can be predicted that renewable energy will account for an even larger proportion in the future. Therefore, it is advisable to invest more in green technology research and development.</p>
    `,
    highlights: [
      { category: '数据描述准确', description: '使用具体数字（15% to 35%）和趋势词（increased significantly）', example: 'from 15% in 2010 to 35% in 2024' },
      { category: '对比分析', description: '使用Meanwhile展示同时发生的变化，体现数据关联性' },
      { category: '原因分析', description: '使用On the one hand...On the other hand...从两个角度分析原因' },
      { category: '预测合理', description: '基于数据分析做出预测，使用"it can be predicted that"句型' }
    ],
    vocabulary: [
      { word: 'renewable', meaning: '可再生的' },
      { word: 'correspondingly', meaning: '相应地' },
      { word: 'prompted', meaning: '促使' },
      { word: 'cost-effective', meaning: '性价比高的' },
      { word: 'competitive', meaning: '有竞争力的' }
    ]
  },
  {
    id: 3,
    type: 'letter',
    typeLabel: '书信',
    year: '2023',
    score: 14,
    title: 'Suggestion Letter to Campus Canteen',
    excerpt: 'Dear Sir/Madam, I am writing to express my concern about the food quality in our campus canteen...',
    fullEssay: `
      <p>Dear Sir/Madam,</p>
      
      <p>I am writing to express my concern about the food quality in our campus canteen. As a regular customer, I would like to offer some suggestions for improvement.</p>
      
      <p>Firstly, I suggest diversifying the menu to include more healthy options. Many students are concerned about nutrition, and providing salads and low-fat meals would be beneficial. Secondly, improving hygiene standards is crucial. Regular cleaning and staff training should be implemented. Finally, extending opening hours during exam periods would greatly help students who study late.</p>
      
      <p>I would appreciate it if you could take my suggestions into consideration. Looking forward to seeing positive changes.</p>
      
      <p>Yours sincerely,<br>Li Ming</p>
    `,
    highlights: [
      { category: '格式规范', description: '完整的书信格式（称呼、正文分段、结尾敬语、署名）' },
      { category: '目的明确', description: '首段直接说明写信目的，使用"I am writing to express..."句型' },
      { category: '建议具体', description: '三点建议都有具体措施和理由，逻辑清晰' },
      { category: '语气得体', description: '使用"I would appreciate it if..."礼貌表达期望' }
    ],
    vocabulary: [
      { word: 'diversifying', meaning: '多样化' },
      { word: 'nutrition', meaning: '营养' },
      { word: 'hygiene', meaning: '卫生' },
      { word: 'implemented', meaning: '实施' },
      { word: 'appreciate', meaning: '感激' }
    ]
  },
  {
    id: 4,
    type: 'argumentative',
    typeLabel: '议论文',
    year: '2025',
    score: 14,
    title: 'The Importance of Cultural Heritage Protection',
    excerpt: 'In recent years, the protection of cultural heritage has become a matter of public concern...',
    fullEssay: `
      <p>In recent years, the protection of cultural heritage has become a matter of public concern. It is universally acknowledged that cultural heritage represents the identity and history of a nation.</p>
      
      <p>First and foremost, cultural heritage serves as a bridge connecting the past and the present. Take the Great Wall as an example. It not only demonstrates ancient Chinese wisdom but also inspires national pride. Furthermore, preserving cultural sites promotes tourism and economic development. Many historical cities have benefited greatly from cultural tourism. Last but not least, cultural heritage education helps young people understand their roots and develop a sense of belonging.</p>
      
      <p>In conclusion, protecting cultural heritage is of vital importance. Only by raising public awareness and taking effective measures can we ensure that these precious treasures are passed down to future generations.</p>
    `,
    highlights: [
      { category: '开头引入', description: '使用"matter of public concern"和"universally acknowledged"两个高级句型', example: 'has become a matter of public concern' },
      { category: '举例论证', description: '使用"Take...as an example"引入具体案例（长城）', example: 'Take the Great Wall as an example' },
      { category: '逻辑严密', description: '三个论点层层递进：历史价值 → 经济价值 → 教育价值' },
      { category: '结尾强调', description: '使用倒装句"Only by...can we"增强语气', example: 'Only by raising public awareness...' },
      { category: '词汇丰富', description: '使用vital/precious/treasures等高级词汇' }
    ],
    vocabulary: [
      { word: 'heritage', meaning: '遗产' },
      { word: 'demonstrates', meaning: '展示，证明' },
      { word: 'inspires', meaning: '激发' },
      { word: 'belonging', meaning: '归属感' },
      { word: 'treasures', meaning: '珍宝' }
    ]
  },
  {
    id: 5,
    type: 'chart',
    typeLabel: '图表作文',
    year: '2024',
    score: 13,
    title: 'Changes in College Students\' Reading Habits',
    excerpt: 'The chart clearly illustrates the changes in college students\' reading habits from 2018 to 2024...',
    fullEssay: `
      <p>The chart clearly illustrates the changes in college students' reading habits from 2018 to 2024. According to the data, the percentage of students reading e-books has increased dramatically from 30% to 65%, while traditional paper book reading has decreased from 70% to 35%.</p>
      
      <p>This phenomenon is mainly because digital devices have become more accessible and convenient. Due to the rapid development of technology, students can now carry thousands of books in their smartphones or tablets. As a result, e-reading has become increasingly popular among young people. Moreover, online platforms offer discounted or even free e-books, which is more cost-effective than buying paper books.</p>
      
      <p>Taking all these factors into consideration, it can be predicted that e-reading will continue to dominate in the future. However, it is advisable to maintain a balance between digital and traditional reading to protect our eyesight and enjoy the unique experience of paper books.</p>
    `,
    highlights: [
      { category: '数据描述', description: '使用具体百分比和趋势词（increased dramatically/decreased）', example: 'from 30% to 65%' },
      { category: '因果分析', description: '使用"This is mainly because"和"Due to"解释原因', example: 'This is mainly because digital devices...' },
      { category: '结果说明', description: '使用"As a result"连接因果关系', example: 'As a result, e-reading has become...' },
      { category: '综合结论', description: '使用"Taking all these factors into consideration"总结', example: 'Taking all these factors into consideration...' },
      { category: '平衡观点', description: '提出平衡建议，体现思考深度' }
    ],
    vocabulary: [
      { word: 'illustrates', meaning: '说明，展示' },
      { word: 'dramatically', meaning: '显著地' },
      { word: 'accessible', meaning: '可获得的' },
      { word: 'cost-effective', meaning: '性价比高的' },
      { word: 'dominate', meaning: '占主导地位' }
    ]
  },
  {
    id: 6,
    type: 'letter',
    typeLabel: '书信',
    year: '2023',
    score: 13,
    title: 'A Letter of Apology to Professor Smith',
    excerpt: 'Dear Professor Smith, I am writing to express my sincere apologies for...',
    fullEssay: `
      <p>Dear Professor Smith,</p>
      
      <p>I am writing to express my sincere apologies for missing your lecture last Monday. Due to a sudden illness, I was unable to attend the class, and I deeply regret any inconvenience this may have caused.</p>
      
      <p>To make up for my absence, I have already borrowed the lecture notes from my classmates and studied them carefully. Furthermore, I would like to schedule a meeting with you to discuss the key points I missed. I would appreciate it if you could spare some time for this purpose.</p>
      
      <p>Once again, I apologize for my absence and thank you for your understanding. I promise that such a situation will not happen again.</p>
      
      <p>Yours sincerely,<br>Li Ming</p>
    `,
    highlights: [
      { category: '道歉诚恳', description: '首段直接道歉并说明原因，使用"sincere apologies"和"deeply regret"', example: 'express my sincere apologies' },
      { category: '补救措施', description: '提出具体补救方案（借笔记、约见面）', example: 'borrowed the lecture notes' },
      { category: '礼貌请求', description: '使用"I would appreciate it if..."礼貌请求时间', example: 'I would appreciate it if you could spare some time' },
      { category: '承诺改进', description: '结尾承诺不再犯，表达诚意' },
      { category: '格式完整', description: '完整的道歉信格式，语气得体' }
    ],
    vocabulary: [
      { word: 'sincere', meaning: '真诚的' },
      { word: 'inconvenience', meaning: '不便' },
      { word: 'make up for', meaning: '弥补' },
      { word: 'spare', meaning: '抽出（时间）' },
      { word: 'regret', meaning: '后悔，遗憾' }
    ]
  }
]

const filteredExamples = computed(() => {
  let result = modelExamples
  
  if (exampleFilter.value) {
    result = result.filter(e => e.type === exampleFilter.value)
  }
  
  if (yearFilter.value) {
    result = result.filter(e => e.year === yearFilter.value)
  }
  
  return result
})

function showExampleDetail(example: any) {
  selectedExample.value = example
  exampleDetailVisible.value = true
}
</script>

<template>
  <div class="writing-learning-premium">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">✍️ Writing Mastery</h1>
        <p class="hero-subtitle">Master English Writing in 5 Days | 六级作文冲刺系统</p>
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-number">3</span>
            <span class="stat-label">核心模板</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">50+</span>
            <span class="stat-label">高分句型</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">∞</span>
            <span class="stat-label">实战练习</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Premium Tabs -->
    <div class="premium-tabs">
      <button 
        :class="['tab-pill', { active: activeTab === 'grading-standards' }]" 
        @click="activeTab = 'grading-standards'"
      >
        <span class="tab-icon">📋</span>
        <span class="tab-text">阅卷标准</span>
      </button>
      <button 
        :class="['tab-pill', { active: activeTab === 'frameworks' }]" 
        @click="activeTab = 'frameworks'"
      >
        <span class="tab-icon">🏗️</span>
        <span class="tab-text">三大框架</span>
      </button>
      <button 
        :class="['tab-pill', { active: activeTab === 'argumentation' }]" 
        @click="activeTab = 'argumentation'"
      >
        <span class="tab-icon"></span>
        <span class="tab-text">深度论证</span>
      </button>
      <button 
        :class="['tab-pill', { active: activeTab === 'sentences' }]" 
        @click="activeTab = 'sentences'"
      >
        <span class="tab-icon">💎</span>
        <span class="tab-text">功能句库</span>
      </button>
      <button 
        :class="['tab-pill', { active: activeTab === 'examples' }]" 
        @click="activeTab = 'examples'"
      >
        <span class="tab-icon">📖</span>
        <span class="tab-text">范文库</span>
      </button>
      <button 
        :class="['tab-pill', { active: activeTab === 'practice' }]" 
        @click="activeTab = 'practice'"
      >
        <span class="tab-icon">⚡</span>
        <span class="tab-text">实战演练</span>
      </button>
      <button 
        :class="['tab-pill', { active: activeTab === 'anti-template' }]" 
        @click="activeTab = 'anti-template'"
      >
        <span class="tab-icon"></span>
        <span class="tab-text">去模板化</span>
      </button>
    </div>

    <!-- Tab 1: Grading Standards - 阅卷标准 -->
    <div v-if="activeTab === 'grading-standards'" class="content-section grading-section">
      <div class="section-header">
        <h2>📋 阅卷标准与基本原则 | Grading Standards</h2>
        <p class="section-desc">了解评分规则，避免低级错误，稳拿基础分</p>
      </div>

      <!-- 第一印象 -->
      <div class="grading-card first-impression">
        <h3>{{ gradingStandards.firstImpression.title }}</h3>
        <div class="impression-items">
          <div v-for="item in gradingStandards.firstImpression.items" :key="item.text" class="impression-item">
            <span class="item-icon">{{ item.icon }}</span>
            <span class="item-text">{{ item.text }}</span>
          </div>
        </div>
        <div class="grading-tip">💡 {{ gradingStandards.firstImpression.tip }}</div>
      </div>

      <!-- 字数要求 -->
      <div class="grading-card word-count">
        <h3>{{ gradingStandards.wordCount.title }}</h3>
        <p class="word-content">{{ gradingStandards.wordCount.content }}</p>
        <div class="word-range">✅ {{ gradingStandards.wordCount.range }}</div>
        <div class="word-warning">⚠️ {{ gradingStandards.wordCount.warning }}</div>
      </div>

      <!-- 时间分配 -->
      <div class="grading-card time-management">
        <h3>{{ gradingStandards.timeManagement.title }}</h3>
        <div class="time-breakdown">
          <div v-for="phase in gradingStandards.timeManagement.breakdown" :key="phase.phase" class="time-phase">
            <div class="phase-info">
              <span class="phase-name">{{ phase.phase }}</span>
              <span class="phase-time">{{ phase.time }}</span>
            </div>
            <p class="phase-task">{{ phase.task }}</p>
          </div>
        </div>
      </div>

      <!-- 避免错误 -->
      <div class="grading-card avoid-errors">
        <h3>{{ gradingStandards.avoidErrors.title }}</h3>
        
        <div class="error-category">
          <h4>基础语法错误</h4>
          <div class="error-list">
            <div v-for="err in gradingStandards.avoidErrors.basic" :key="err.error" class="error-item">
              <strong>{{ err.error }}：</strong>
              <code>{{ err.example }}</code>
            </div>
          </div>
        </div>

        <div class="error-category">
          <h4>高级错误（影响得分上限）</h4>
          <div class="error-list">
            <div v-for="err in gradingStandards.avoidErrors.advanced" :key="err.error" class="error-item">
              <strong>{{ err.error }}：</strong>
              <code>{{ err.example }}</code>
            </div>
          </div>
        </div>
      </div>

      <!-- 不犯错策略 -->
      <div class="grading-card no-error-strategy">
        <h3>{{ gradingStandards.noErrorStrategy.title }}</h3>
        <div class="strategy-list">
          <div v-for="strat in gradingStandards.noErrorStrategy.strategies" :key="strat.strategy" class="strategy-item">
            <strong>{{ strat.strategy }}：</strong>
            <span>{{ strat.desc }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 2: Frameworks -->
    <div v-if="activeTab === 'frameworks'" class="content-section frameworks-section">
      <div class="section-header">
        <h2>三大核心框架 | Three Core Frameworks</h2>
        <p class="section-desc">掌握议论文/图表/书信的结构骨架，考场快速搭建</p>
      </div>

      <div class="frameworks-grid">
        <div 
          v-for="framework in frameworks" 
          :key="framework.id"
          class="framework-card"
          :class="{ expanded: expandedFramework === framework.id }"
          @click="toggleFramework(framework.id)"
        >
          <div class="framework-header">
            <div class="framework-badge" :class="framework.type">{{ framework.badge }}</div>
            <h3>{{ framework.title }}</h3>
            <p class="framework-subtitle">{{ framework.subtitle }}</p>
            
            <!-- 口诀记忆 -->
            <div class="mnemonic-box">
              <span class="mnemonic-icon"></span>
              <span class="mnemonic-text">{{ framework.mnemonic }}</span>
              <span class="mnemonic-desc">{{ framework.mnemonicDesc }}</span>
            </div>
          </div>

          <div class="framework-body" v-show="expandedFramework === framework.id">
            <!-- 三级递进法 -->
            <div class="logic-chain-box">
              <h4>📊 三级递进法（深化立意）</h4>
              <div class="chain-levels">
                <div class="chain-level level-1">
                  <span class="level-badge">一级</span>
                  <span class="level-text">{{ framework.logicChain.level1 }}</span>
                </div>
                <div class="chain-arrow">↓</div>
                <div class="chain-level level-2">
                  <span class="level-badge">二级</span>
                  <span class="level-text">{{ framework.logicChain.level2 }}</span>
                </div>
                <div class="chain-arrow">↓</div>
                <div class="chain-level level-3">
                  <span class="level-badge">三级</span>
                  <span class="level-text">{{ framework.logicChain.level3 }}</span>
                </div>
              </div>
            </div>

            <div class="structure-flow">
              <div 
                v-for="(step, index) in framework.structure" 
                :key="index"
                class="flow-step"
              >
                <div class="step-indicator">{{ index + 1 }}</div>
                <div class="step-content">
                  <h4>{{ step.title }}</h4>
                  <p>{{ step.description }}</p>
                  <div class="step-examples">
                    <div v-for="(example, idx) in step.examples" :key="idx" class="example-line">
                      <span class="example-en">{{ example.en }}</span>
                      <span class="example-cn">{{ example.cn }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="framework-tips">
              <strong> 使用要点（Writing Tips）：</strong>
              <div class="writing-tips-list">
                <div v-for="(tip, index) in framework.writingTips" :key="index" class="tip-item">
                  {{ tip }}
                </div>
              </div>
              
              <div class="original-tips">
                <strong>💡 注意事项：</strong>
                <ul>
                  <li v-for="tip in framework.tips" :key="tip">{{ tip }}</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="framework-footer">
            <span class="expand-hint">{{ expandedFramework === framework.id ? '点击收起 ↑' : '点击展开详情 ↓' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 3: Argumentation Methods - 深度论证 -->
    <div v-if="activeTab === 'argumentation'" class="content-section argumentation-section">
      <div class="section-header">
        <h2> 深度论证方法 | Advanced Argumentation</h2>
        <p class="section-desc">掌握高级论证技巧，让文章逻辑更严密、立意更深刻</p>
      </div>

      <!-- 对立假想敌 -->
      <div class="argumentation-card">
        <div class="card-header">
          <h3>{{ argumentationMethods.imaginaryOpponent.title }}</h3>
          <span class="card-subtitle">{{ argumentationMethods.imaginaryOpponent.subtitle }}</span>
        </div>
        <p class="card-desc">{{ argumentationMethods.imaginaryOpponent.description }}</p>
        
        <div class="steps-flow">
          <div v-for="s in argumentationMethods.imaginaryOpponent.steps" :key="s.step" class="step-card">
            <div class="step-number">{{ s.step }}</div>
            <div class="step-info">
              <strong>{{ s.title }}</strong>
              <code>{{ s.example }}</code>
            </div>
          </div>
        </div>

        <div class="templates-box">
          <h4> 常用模板句式：</h4>
          <div class="template-list">
            <code v-for="(t, i) in argumentationMethods.imaginaryOpponent.templates" :key="i">{{ t }}</code>
          </div>
        </div>
      </div>

      <!-- 三级递进法 -->
      <div class="argumentation-card">
        <div class="card-header">
          <h3>{{ argumentationMethods.threeLevelProgression.title }}</h3>
          <span class="card-subtitle">{{ argumentationMethods.threeLevelProgression.subtitle }}</span>
        </div>
        <p class="card-desc">{{ argumentationMethods.threeLevelProgression.description }}</p>
        
        <div class="levels-flow">
          <div v-for="lvl in argumentationMethods.threeLevelProgression.levels" :key="lvl.level" class="level-card">
            <div class="level-badge">{{ lvl.name }}</div>
            <p class="level-desc">{{ lvl.description }}</p>
            <code class="level-example">{{ lvl.example }}</code>
          </div>
        </div>

        <div class="before-after-comparison">
          <div class="comparison-box before">
            <h4>{{ argumentationMethods.threeLevelProgression.beforeAfter.before.title }}</h4>
            <code>{{ argumentationMethods.threeLevelProgression.beforeAfter.before.content }}</code>
          </div>
          <div class="comparison-arrow">→</div>
          <div class="comparison-box after">
            <h4>{{ argumentationMethods.threeLevelProgression.beforeAfter.after.title }}</h4>
            <code>{{ argumentationMethods.threeLevelProgression.beforeAfter.after.content }}</code>
          </div>
        </div>
      </div>

      <!-- 五种续写法 -->
      <div class="argumentation-card">
        <div class="card-header">
          <h3>{{ argumentationMethods.fiveContinuationMethods.title }}</h3>
          <span class="card-subtitle">{{ argumentationMethods.fiveContinuationMethods.subtitle }}</span>
        </div>
        <p class="card-desc">{{ argumentationMethods.fiveContinuationMethods.description }}</p>
        
        <div class="methods-grid">
          <div v-for="(m, i) in argumentationMethods.fiveContinuationMethods.methods" :key="i" class="method-card">
            <h4>{{ m.name }}</h4>
            <p class="method-desc">{{ m.description }}</p>
            <div class="method-template">
              <strong>模板：</strong>
              <code>{{ m.template }}</code>
            </div>
            <div class="method-example">
              <strong>示例：</strong>
              <p>{{ m.example }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 4: Sentences -->
    <div v-if="activeTab === 'sentences'" class="content-section sentences-section">
      <div class="section-header">
        <h2>高分句型库 | Premium Sentence Bank</h2>
        <p class="section-desc">按功能分类，即拿即用，提升语言档次</p>
      </div>

      <div class="sentences-categories">
        <div 
          v-for="category in sentenceCategories" 
          :key="category.id"
          class="sentence-category"
        >
          <div class="category-header">
            <span class="category-icon">{{ category.icon }}</span>
            <h3>{{ category.title }}</h3>
            <span class="category-count">{{ category.sentences.length }} 句</span>
          </div>

          <div class="sentences-list">
            <div 
              v-for="sentence in category.sentences" 
              :key="sentence.id"
              class="sentence-card"
              @click="showSentenceDetail(sentence)"
            >
              <div class="sentence-main">
                <div class="sentence-en">{{ sentence.english }}</div>
                <div class="sentence-cn">{{ sentence.chinese }}</div>
              </div>
              <div class="sentence-tags">
                <span 
                  v-for="tag in sentence.tags" 
                  :key="tag" 
                  class="tag"
                  :class="tag"
                >
                  {{ tagLabel(tag) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sentence Detail Dialog -->
      <el-dialog 
        v-model="sentenceDetailVisible" 
        title="句型详解 | Sentence Breakdown"
        width="750px"
        class="sentence-detail-dialog"
      >
        <div v-if="selectedSentence" class="sentence-breakdown">
          <div class="breakdown-section original">
            <h4>原句 | Original</h4>
            <p class="original-text">{{ selectedSentence.english }}</p>
          </div>
          
          <div class="breakdown-section translation">
            <h4>翻译 | Translation</h4>
            <p>{{ selectedSentence.chinese }}</p>
          </div>

          <div class="breakdown-section structure">
            <h4>结构分析 | Structure</h4>
            <div class="structure-highlight" v-html="selectedSentence.structure"></div>
          </div>

          <div v-if="selectedSentence.examples && selectedSentence.examples.length > 0" class="breakdown-section examples">
            <h4>应用场景 | Usage Examples</h4>
            <div 
              v-for="(example, index) in selectedSentence.examples" 
              :key="index"
              class="usage-example"
            >
              <div class="example-context">{{ example.context }}</div>
              <div class="example-sentence">{{ example.sentence }}</div>
            </div>
          </div>

          <div v-if="selectedSentence.memoryTip" class="breakdown-section memory-tip">
            <h4>🧠 记忆技巧 | Memory Tip</h4>
            <p>{{ selectedSentence.memoryTip }}</p>
          </div>

          <div v-if="selectedSentence.usage" class="breakdown-section usage-note">
            <h4>📝 使用场景 | Usage Notes</h4>
            <p>{{ selectedSentence.usage }}</p>
          </div>

          <div class="breakdown-section tips">
            <h4>⚠️ 注意事项</h4>
            <ul>
              <li v-for="tip in selectedSentence.tips" :key="tip">{{ tip }}</li>
            </ul>
          </div>

          <!-- 记忆贴士 -->
          <div class="breakdown-section memory-tip-detail">
            <h4>🧠 记忆技巧</h4>
            <div class="memory-method">
              <div class="method-item">
                <strong>📝 口诀记忆：</strong>
                <p>{{ getMemoryMnemonic(selectedSentence) }}</p>
              </div>
              <div class="method-item">
                <strong>🔗 联想记忆：</strong>
                <p>{{ getMemoryAssociation(selectedSentence) }}</p>
              </div>
              <div class="method-item">
                <strong>🎯 使用场景：</strong>
                <p>{{ getMemoryUsage(selectedSentence) }}</p>
              </div>
            </div>
          </div>
        </div>
      </el-dialog>
    </div>

    <!-- Tab 3: Practice -->
    <div v-if="activeTab === 'practice'" class="content-section practice-section">
      <div class="section-header">
        <h2>限时实战训练 | Timed Practice</h2>
        <p class="section-desc">模拟考场环境，30分钟完成一篇作文</p>
      </div>

      <div class="practice-controls">
        <div class="timer-display">
          <span class="timer-label">剩余时间</span>
          <span class="timer-value">{{ formatTime(remainingTime) }}</span>
        </div>
        <div class="control-buttons">
          <el-button 
            v-if="!isPracticing" 
            type="primary" 
            size="large"
            @click="startPractice"
          >
            🚀 开始练习
          </el-button>
          <el-button 
            v-else 
            type="danger" 
            size="large"
            @click="stopPractice"
          >
            ⏹️ 结束练习
          </el-button>
        </div>
      </div>

      <div class="practice-workspace" v-if="currentTopic">
        <div class="topic-card">
          <div class="topic-header">
            <span class="topic-type" :class="currentTopic.type">{{ currentTopic.typeLabel }}</span>
            <span class="topic-year">{{ currentTopic.year }}</span>
          </div>
          <h3 class="topic-title">{{ currentTopic.title }}</h3>
          <div class="topic-content" v-html="currentTopic.content"></div>
          <div class="topic-requirements">
            <strong>要求：</strong>{{ currentTopic.requirements }}
          </div>
        </div>

        <div class="writing-area">
          <textarea 
            v-model="userEssay" 
            placeholder="在此输入你的作文...&#10;&#10;建议结构：&#10;第一段：引出话题 + 表明立场&#10;第二段：论证理由（2-3个论点）&#10;第三段：总结 + 建议/展望"
            class="essay-textarea"
            :disabled="!isPracticing"
          ></textarea>
          <div class="word-count">
            字数：{{ wordCount }} / 建议 150-200 词
          </div>
        </div>

        <div class="quick-reference">
          <h4>📌 快速参考 | Quick Reference</h4>
          <div class="reference-cards">
            <div class="ref-card">
              <h5>开头句型 | Opening</h5>
              <ul>
                <li><strong>With the rapid development of</strong> technology/society, ...</li>
                <li><strong>Nowadays,</strong> ___ has become a hot topic.</li>
                <li><strong>It is universally acknowledged that</strong> ...</li>
                <li><strong>Recently, the issue of</strong> ___ <strong>has aroused wide concern.</strong></li>
              </ul>
            </div>
            <div class="ref-card">
              <h5>论证连接 | Transitions</h5>
              <ul>
                <li><strong>First and foremost,</strong> ...</li>
                <li><strong>Furthermore / Moreover,</strong> ...</li>
                <li><strong>Last but not least,</strong> ...</li>
                <li><strong>On the one hand,</strong> ... <strong>On the other hand,</strong> ...</li>
                <li><strong>However / Nevertheless,</strong> ...</li>
              </ul>
            </div>
            <div class="ref-card">
              <h5>结尾总结 | Conclusion</h5>
              <ul>
                <li><strong>In conclusion / To sum up,</strong> ...</li>
                <li><strong>It is high time that we took</strong> effective measures to...</li>
                <li><strong>Taking all these factors into consideration,</strong> ...</li>
                <li><strong>Therefore, it is advisable to</strong> ...</li>
              </ul>
            </div>
            <div class="ref-card ref-card-highlight">
              <h5>💡 深度论证技巧</h5>
              <ul>
                <li>三级递进：what → how → why it matters</li>
                <li>对立假想敌：Some may argue that..., but...</li>
                <li>举例论证：Take ___ as an example</li>
                <li>因果分析：This is mainly because...</li>
              </ul>
            </div>
          </div>
          
          <div class="auto-save-indicator" v-if="isPracticing">
            <span class="save-status">{{ autoSaveStatus }}</span>
          </div>
        </div>
      </div>

      <el-empty v-else description="点击上方按钮开始练习" />
    </div>

    <!-- Tab 4: Examples -->
    <div v-if="activeTab === 'examples'" class="content-section examples-section">
      <div class="section-header">
        <h2>高分范文库 | Model Essays</h2>
        <p class="section-desc">历年真题范文 + 详细解析</p>
      </div>

      <div class="examples-filter">
        <el-select v-model="exampleFilter" placeholder="筛选类型" clearable style="width: 180px;">
          <el-option label="议论文" value="argumentative" />
          <el-option label="图表作文" value="chart" />
          <el-option label="书信" value="letter" />
        </el-select>
        <el-select v-model="yearFilter" placeholder="年份" clearable style="width: 120px;">
          <el-option label="2025" value="2025" />
          <el-option label="2024" value="2024" />
          <el-option label="2023" value="2023" />
        </el-select>
      </div>

      <div class="examples-list">
        <div 
          v-for="example in filteredExamples" 
          :key="example.id"
          class="example-card"
          @click="showExampleDetail(example)"
        >
          <div class="example-preview">
            <div class="example-meta">
              <span class="example-type" :class="example.type">{{ example.typeLabel }}</span>
              <span class="example-year">{{ example.year }}</span>
              <span class="example-score">⭐ {{ example.score }}/15</span>
            </div>
            <h3 class="example-title">{{ example.title }}</h3>
            <p class="example-excerpt">{{ example.excerpt }}</p>
          </div>
          <div class="example-action">
            <el-button type="primary" size="small">查看详情 →</el-button>
          </div>
        </div>
      </div>

      <el-empty v-if="filteredExamples.length === 0" description="暂无范文" />

      <!-- Example Detail Dialog -->
      <el-dialog 
        v-model="exampleDetailVisible" 
        title="范文详解"
        width="900px"
        class="example-detail-dialog"
      >
        <div v-if="selectedExample" class="example-full">
          <div class="example-header-info">
            <span class="example-type" :class="selectedExample.type">{{ selectedExample.typeLabel }}</span>
            <span class="example-year">{{ selectedExample.year }}</span>
            <span class="example-score">⭐ {{ selectedExample.score }}/15</span>
          </div>

          <div class="example-essay">
            <h4>范文原文</h4>
            <div class="essay-text" v-html="selectedExample.fullEssay"></div>
          </div>

          <div class="example-analysis">
            <h4>📊 亮点分析 | Writing Highlights</h4>
            <div class="analysis-points">
              <div 
                v-for="(point, index) in selectedExample.highlights" 
                :key="index"
                class="highlight-point"
              >
                <span class="point-number">{{ Number(index) + 1 }}</span>
                <div class="point-content">
                  <strong>{{ point.category }}</strong>
                  <p>{{ point.description }}</p>
                  <div class="point-example" v-if="point.example">
                    <em>示例：</em>{{ point.example }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="example-vocabulary">
            <h4>📚 高分词汇 | Advanced Vocabulary</h4>
            <div class="vocab-list">
              <div 
                v-for="(word, index) in selectedExample.vocabulary" 
                :key="index"
                class="vocab-item"
              >
                <span class="vocab-word">{{ word.word }}</span>
                <span class="vocab-meaning">{{ word.meaning }}</span>
              </div>
            </div>
          </div>

          <div class="writing-tips-section">
            <h4>💡 写作建议 | Writing Tips</h4>
            <div class="tips-grid">
              <div class="tip-card do-tip">
                <span class="tip-icon"></span>
                <strong>值得借鉴</strong>
                <ul>
                  <li>学习文章的结构布局</li>
                  <li>掌握连接词的使用技巧</li>
                  <li>积累高分词汇和表达</li>
                </ul>
              </div>
              <div class="tip-card avoid-tip">
                <span class="tip-icon"></span>
                <strong>避免模仿</strong>
                <ul>
                  <li>不要死记硬背整篇文章</li>
                  <li>避免使用过于复杂的句式</li>
                  <li>注意语境的适用性</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </el-dialog>
    </div>

    <!-- Tab 7: Anti-Template Strategies - 去模板化写作策略 -->
    <div v-if="activeTab === 'anti-template'" class="content-section anti-template-section">
      <div class="section-header">
        <h2>🚫 去模板化写作指南 | Anti-Template Writing</h2>
        <p class="section-desc">避免机械套用，打造自然流畅的高分作文</p>
      </div>

      <!-- Warning Box -->
      <div class="warning-box">
        <h3>{{ antiTemplateStrategies.warning.title }}</h3>
        <ul>
          <li v-for="(reason, index) in antiTemplateStrategies.warning.reasons" :key="index">
            {{ reason }}
          </li>
        </ul>
      </div>

      <!-- Opening Variations -->
      <div class="strategy-card">
        <h3>{{ antiTemplateStrategies.openingVariations.title }}</h3>
        <div class="strategies-grid">
          <div 
            v-for="(strategy, index) in antiTemplateStrategies.openingVariations.strategies" 
            :key="index"
            class="strategy-item"
          >
            <h4>{{ strategy.name }}</h4>
            <ul class="example-list">
              <li v-for="(example, idx) in strategy.examples" :key="idx">
                {{ example }}
              </li>
            </ul>
            <div class="strategy-tip">
              <strong>💡 提示：</strong>{{ strategy.tip }}
            </div>
          </div>
        </div>
      </div>

      <!-- Transition Variations -->
      <div class="strategy-card">
        <h3>{{ antiTemplateStrategies.transitionVariations.title }}</h3>
        <div class="transition-categories">
          <div 
            v-for="(category, index) in antiTemplateStrategies.transitionVariations.categories" 
            :key="index"
            class="category-box"
          >
            <h4>{{ category.name }}</h4>
            <ul>
              <li v-for="(alt, idx) in category.alternatives" :key="idx">
                {{ alt }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Conclusion Variations -->
      <div class="strategy-card">
        <h3>{{ antiTemplateStrategies.conclusionVariations.title }}</h3>
        <div class="strategies-grid">
          <div 
            v-for="(strategy, index) in antiTemplateStrategies.conclusionVariations.strategies" 
            :key="index"
            class="strategy-item"
          >
            <h4>{{ strategy.name }}</h4>
            <ul class="example-list">
              <li v-for="(example, idx) in strategy.examples" :key="idx">
                {{ example }}
              </li>
            </ul>
            <div class="strategy-tip">
              <strong>💡 提示：</strong>{{ strategy.tip }}
            </div>
          </div>
        </div>
      </div>

      <!-- Vocabulary Upgrade -->
      <div class="strategy-card">
        <h3>{{ antiTemplateStrategies.vocabularyUpgrade.title }}</h3>
        <div class="vocab-upgrade-table">
          <table>
            <thead>
              <tr>
                <th>基础词汇</th>
                <th>升级替换</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in antiTemplateStrategies.vocabularyUpgrade.upgrades" :key="index">
                <td class="basic-word">{{ item.basic }}</td>
                <td class="advanced-words">
                  <span v-for="(word, idx) in item.advanced" :key="idx" class="upgrade-tag">
                    {{ word }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Natural Flow Tips -->
      <div class="strategy-card">
        <h3>{{ antiTemplateStrategies.naturalFlow.title }}</h3>
        <div class="flow-tips">
          <div 
            v-for="(tip, index) in antiTemplateStrategies.naturalFlow.tips" 
            :key="index"
            class="flow-tip-item"
          >
            <strong>{{ tip.tip }}</strong>
            <p>{{ tip.explanation }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Tips -->
    <div class="premium-tips">
      <div class="tips-icon">💡</div>
      <div class="tips-content">
        <strong>5天冲刺建议：</strong>
        <span>每天练习1篇 → 对照范文找差距 → 背诵3个万能句型 → 默写1个框架</span>
      </div>
    </div>

    <!-- Memory Master Section -->
    <div class="memory-master-section">
      <div class="memory-header">
        <h2>🧠 记忆力强化专区 | Memory Boost Zone</h2>
        <p class="memory-subtitle">专为记忆力较弱的同学设计，三重记忆法助你轻松掌握</p>
      </div>

      <div class="memory-cards-grid">
        <div class="memory-card mnemonic">
          <div class="card-icon">📝</div>
          <h3>口诀记忆法</h3>
          <p class="card-desc">将复杂句型简化为3-4字口诀</p>
          <div class="examples">
            <div class="example-item">
              <strong>“引表论总”</strong>
              <span>议论文四步走</span>
            </div>
            <div class="example-item">
              <strong>“描析预”</strong>
              <span>图表作文三步</span>
            </div>
            <div class="example-item">
              <strong>“随着发”</strong>
              <span>With the rapid development</span>
            </div>
          </div>
        </div>

        <div class="memory-card association">
          <div class="card-icon">🔗</div>
          <h3>联想记忆法</h3>
          <p class="card-desc">通过图像、场景建立联系</p>
          <div class="examples">
            <div class="example-item">
              <strong>🚀 火箭发射</strong>
              <span>With rapid development</span>
            </div>
            <div class="example-item">
              <strong>⚖️ 天平平衡</strong>
              <span>On the one hand...other hand</span>
            </div>
            <div class="example-item">
              <strong>⏰ 闹钟响起</strong>
              <span>It is high time</span>
            </div>
          </div>
        </div>

        <div class="memory-card repetition">
          <div class="card-icon">🔄</div>
          <h3>重复记忆法</h3>
          <p class="card-desc">科学复习间隔，巩固记忆</p>
          <div class="examples">
            <div class="example-item">
              <strong>第1天</strong>
              <span>初次学习 + 当晚复习</span>
            </div>
            <div class="example-item">
              <strong>第3天</strong>
              <span>第二次复习 + 造句练习</span>
            </div>
            <div class="example-item">
              <strong>第7天</strong>
              <span>第三次复习 + 实战应用</span>
            </div>
          </div>
        </div>
      </div>

      <div class="memory-action-tips">
        <h3>💪 每日记忆训练计划</h3>
        <div class="action-steps">
          <div class="step">
            <span class="step-number">1</span>
            <div class="step-content">
              <strong>早晨（15分钟）</strong>
              <p>背诵3个新句型 + 对应口诀</p>
            </div>
          </div>
          <div class="step">
            <span class="step-number">2</span>
            <div class="step-content">
              <strong>中午（10分钟）</strong>
              <p>复习早晨内容 + 联想图像</p>
            </div>
          </div>
          <div class="step">
            <span class="step-number">3</span>
            <div class="step-content">
              <strong>晚上（20分钟）</strong>
              <p>默写句型 + 造2个句子</p>
            </div>
          </div>
          <div class="step">
            <span class="step-number">4</span>
            <div class="step-content">
              <strong>睡前（5分钟）</strong>
              <p>快速回顾今日所有句型</p>
            </div>
          </div>
        </div>
      </div>

      <div class="memory-warning">
        <strong>⚠️ 记忆力弱同学的特别提醒：</strong>
        <ul>
          <li>✅ <strong>不要一次背太多</strong>：每天3-5个句型足够，贪多嚼不烂</li>
          <li>✅ <strong>一定要动笔写</strong>：手写比眼看记忆效果好3倍</li>
          <li>✅ <strong>多用口诀和联想</strong>：大脑更容易记住有画面感的内容</li>
          <li>✅ <strong>及时复习</strong>：遗忘曲线显示，24小时内复习效果最佳</li>
          <li>✅ <strong>实际应用</strong>：用新学的句型写作文，用中学才是真学会</li>
          <li>❌ <strong>不要死记硬背</strong>：理解句型结构和用法比机械记忆更重要</li>
          <li>❌ <strong>不要熬夜背书</strong>：睡眠不足会严重影响记忆巩固</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Premium Design System - Anti AI Slop */
.writing-learning-premium {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0;
  /* Premium Font Stack - Elegant & Readable */
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  line-height: 1.8; /* 增加基础行高 */
}

/* Hero Section - Cinematic Impact */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60px 40px;
  border-radius: 0 0 30px 30px;
  margin-bottom: 40px;
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.3);
}

.hero-content {
  text-align: center;
  color: white;
}

.hero-title {
  font-size: 3em;
  font-weight: 800;
  margin: 0 0 15px 0;
  letter-spacing: -1px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  /* Enhanced Typography */
  font-family: 'Georgia', 'Times New Roman', serif;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.3em;
  opacity: 0.95;
  margin: 0 0 30px 0;
  font-weight: 300;
  /* Better readability */
  font-family: 'Inter', 'Helvetica Neue', sans-serif;
  letter-spacing: 0.5px;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 50px;
  margin-top: 30px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2.5em;
  font-weight: 700;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.95em;
  opacity: 0.85;
}

/* Premium Tabs - Pill Design */
.premium-tabs {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 40px;
  padding: 0 20px;
}

.tab-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1em;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #666;
}

.tab-pill:hover {
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.15);
}

.tab-pill.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  color: white;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.tab-icon {
  font-size: 1.3em;
}

/* Content Sections */
.content-section {
  padding: 0 30px 50px;
}

.section-header {
  text-align: center;
  margin-bottom: 45px;
}

.section-header h2 {
  font-size: 2.2em;
  color: #333;
  margin: 0 0 15px 0;
  font-weight: 700;
  /* Premium heading font */
  font-family: 'Georgia', serif;
  letter-spacing: -0.5px;
  line-height: 1.3;
}

.section-desc {
  color: #555;
  font-size: 1.1em;
  margin: 0;
  line-height: 1.7;
}

/* Grading Standards Section */
.grading-section {
  max-width: 900px;
  margin: 0 auto;
}

.grading-card {
  background: white;
  border-radius: 20px;
  padding: 35px;
  margin-bottom: 30px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  line-height: 1.8;
}

.grading-card h3 {
  font-size: 1.5em;
  color: #333;
  margin: 0 0 25px 0;
  font-weight: 700;
  font-family: 'Georgia', serif;
  line-height: 1.4;
}

/* First Impression */
.impression-items {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 20px;
}

.impression-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 18px 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

.item-icon {
  font-size: 1.8em;
}

.item-text {
  color: #333;
  font-size: 1.05em;
  line-height: 1.7;
}

.grading-tip {
  padding: 15px 20px;
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  border-radius: 10px;
  border-left: 4px solid #FF9800;
  color: #E65100;
  font-weight: 600;
  font-size: 1.05em;
}

/* Word Count */
.word-content {
  color: #555;
  font-size: 1.05em;
  line-height: 1.8;
  margin-bottom: 15px;
}

.word-range {
  padding: 12px 18px;
  background: #e8f5e9;
  border-radius: 10px;
  color: #2E7D32;
  font-weight: 600;
  margin-bottom: 12px;
}

.word-warning {
  padding: 12px 18px;
  background: #ffebee;
  border-radius: 10px;
  color: #C62828;
  font-weight: 600;
}

/* Time Management */
.time-breakdown {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.time-phase {
  padding: 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

.phase-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.phase-name {
  font-weight: 700;
  color: #333;
  font-size: 1.1em;
}

.phase-time {
  padding: 6px 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.95em;
}

.phase-task {
  color: #555;
  margin: 0;
  line-height: 1.7;
  font-size: 1em;
}

/* Avoid Errors */
.error-category {
  margin-bottom: 25px;
}

.error-category:last-child {
  margin-bottom: 0;
}

.error-category h4 {
  font-size: 1.2em;
  color: #333;
  margin: 0 0 15px 0;
  font-weight: 600;
}

.error-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.error-item {
  padding: 15px 18px;
  background: #f8f9fa;
  border-radius: 10px;
  line-height: 1.7;
}

.error-item strong {
  color: #333;
  font-weight: 600;
}

.error-item code {
  display: block;
  margin-top: 8px;
  padding: 10px 12px;
  background: white;
  border-radius: 8px;
  color: #555;
  font-family: 'Courier New', monospace;
  font-size: 0.95em;
  line-height: 1.6;
}

/* No Error Strategy */
.strategy-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.strategy-item {
  padding: 18px 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 12px;
  border-left: 4px solid #4CAF50;
  line-height: 1.7;
}

.strategy-item strong {
  color: #2E7D32;
  font-weight: 600;
  display: block;
  margin-bottom: 8px;
  font-size: 1.05em;
}

.strategy-item span {
  color: #555;
  font-size: 1em;
}

/* Mnemonic Box */
.mnemonic-box {
  margin-top: 15px;
  padding: 15px 20px;
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  border-radius: 12px;
  border-left: 4px solid #FF9800;
  display: flex;
  align-items: center;
  gap: 12px;
}

.mnemonic-icon {
  font-size: 1.5em;
}

.mnemonic-text {
  font-size: 1.4em;
  font-weight: 700;
  color: #E65100;
  font-family: 'Georgia', serif;
  letter-spacing: 2px;
}

.mnemonic-desc {
  color: #555;
  font-size: 0.95em;
  line-height: 1.6;
}

/* Logic Chain Box */
.logic-chain-box {
  margin-bottom: 30px;
  padding: 25px;
  background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
  border-radius: 15px;
  border-left: 4px solid #9C27B0;
}

.logic-chain-box h4 {
  font-size: 1.2em;
  color: #6A1B9A;
  margin: 0 0 20px 0;
  font-weight: 600;
}

.chain-levels {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chain-level {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 18px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.level-badge {
  padding: 6px 14px;
  background: linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%);
  color: white;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9em;
  white-space: nowrap;
}

.level-text {
  color: #333;
  font-size: 1.05em;
  line-height: 1.6;
}

.chain-arrow {
  text-align: center;
  font-size: 1.5em;
  color: #9C27B0;
  font-weight: 700;
}

/* Writing Tips List */
.writing-tips-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.tip-item {
  padding: 12px 15px;
  background: #f8f9fa;
  border-radius: 8px;
  color: #333;
  font-size: 1.05em;
  line-height: 1.7;
  border-left: 3px solid #4CAF50;
}

.original-tips {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px dashed #ddd;
}

.original-tips ul {
  margin: 10px 0 0 0;
  padding-left: 20px;
}

.original-tips li {
  color: #555;
  line-height: 1.8;
  margin-bottom: 8px;
}

/* Argumentation Section */
.argumentation-section {
  max-width: 900px;
  margin: 0 auto;
}

.argumentation-card {
  background: white;
  border-radius: 20px;
  padding: 35px;
  margin-bottom: 30px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  line-height: 1.8;
}

.card-header {
  margin-bottom: 15px;
}

.card-header h3 {
  font-size: 1.5em;
  color: #333;
  margin: 0 0 8px 0;
  font-weight: 700;
  font-family: 'Georgia', serif;
}

.card-subtitle {
  display: block;
  color: #667eea;
  font-size: 1.05em;
  font-weight: 600;
  margin-bottom: 12px;
}

.card-desc {
  color: #555;
  font-size: 1.05em;
  margin: 0 0 25px 0;
  line-height: 1.7;
}

/* Steps Flow */
.steps-flow {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 25px;
}

.step-card {
  display: flex;
  gap: 15px;
  padding: 18px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

.step-number {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1em;
  flex-shrink: 0;
}

.step-info {
  flex: 1;
}

.step-info strong {
  display: block;
  color: #333;
  font-size: 1.05em;
  margin-bottom: 8px;
}

.step-info code {
  display: block;
  padding: 10px 12px;
  background: white;
  border-radius: 8px;
  color: #555;
  font-family: 'Courier New', monospace;
  font-size: 0.95em;
  line-height: 1.6;
}

/* Templates Box */
.templates-box {
  padding: 20px;
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  border-radius: 12px;
  border-left: 4px solid #FF9800;
}

.templates-box h4 {
  font-size: 1.1em;
  color: #E65100;
  margin: 0 0 15px 0;
  font-weight: 600;
}

.template-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.template-list code {
  padding: 12px 15px;
  background: white;
  border-radius: 8px;
  color: #333;
  font-family: 'Courier New', monospace;
  font-size: 0.95em;
  line-height: 1.6;
}

/* Levels Flow */
.levels-flow {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 25px;
}

.level-card {
  padding: 20px;
  background: linear-gradient(135deg, #f3e5f5 0%, #ffffff 100%);
  border-radius: 12px;
  border-left: 4px solid #9C27B0;
}

.level-card .level-badge {
  display: inline-block;
  padding: 6px 14px;
  background: linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%);
  color: white;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.95em;
  margin-bottom: 10px;
}

.level-desc {
  color: #555;
  font-size: 1.05em;
  margin: 0 0 12px 0;
  line-height: 1.7;
}

.level-example {
  display: block;
  padding: 12px 15px;
  background: white;
  border-radius: 8px;
  color: #333;
  font-family: 'Courier New', monospace;
  font-size: 0.95em;
  line-height: 1.6;
}

/* Before-After Comparison */
.before-after-comparison {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
}

.comparison-box {
  flex: 1;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.comparison-box h4 {
  font-size: 1.1em;
  margin: 0 0 12px 0;
  font-weight: 600;
}

.comparison-box.before h4 {
  color: #D32F2F;
}

.comparison-box.after h4 {
  color: #388E3C;
}

.comparison-box code {
  display: block;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  color: #555;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
  line-height: 1.6;
}

.comparison-arrow {
  font-size: 2em;
  color: #667eea;
  font-weight: 700;
}

/* Methods Grid */
.methods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.method-card {
  padding: 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 12px;
  border: 2px solid #e0e0e0;
  transition: all 0.3s ease;
}

.method-card:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.15);
}

.method-card h4 {
  font-size: 1.1em;
  color: #333;
  margin: 0 0 10px 0;
  font-weight: 600;
}

.method-desc {
  color: #555;
  font-size: 0.95em;
  margin: 0 0 15px 0;
  line-height: 1.6;
}

.method-template {
  margin-bottom: 12px;
}

.method-template strong {
  display: block;
  color: #333;
  font-size: 0.9em;
  margin-bottom: 6px;
}

.method-template code {
  display: block;
  padding: 8px 10px;
  background: white;
  border-radius: 6px;
  color: #667eea;
  font-family: 'Courier New', monospace;
  font-size: 0.85em;
  line-height: 1.5;
}

.method-example {
  margin-top: 12px;
}

.method-example strong {
  display: block;
  color: #333;
  font-size: 0.9em;
  margin-bottom: 6px;
}

.method-example p {
  color: #555;
  font-size: 0.9em;
  margin: 0;
  line-height: 1.6;
  font-style: italic;
}

/* Frameworks - Single Column Layout */
.frameworks-grid {
  display: flex;
  flex-direction: column;
  gap: 30px;
  max-width: 900px;
  margin: 0 auto;
}

.framework-card {
  background: white;
  border-radius: 20px;
  padding: 35px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  line-height: 1.8;
}

.framework-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.2);
  border-color: #667eea;
}

.framework-header {
  margin-bottom: 25px;
}

.framework-badge {
  display: inline-block;
  padding: 8px 18px;
  border-radius: 20px;
  font-size: 0.9em;
  font-weight: 600;
  margin-bottom: 15px;
}

.framework-badge.argumentative {
  background: #e3f2fd;
  color: #1976D2;
}

.framework-badge.chart {
  background: #f3e5f5;
  color: #7B1FA2;
}

.framework-badge.letter {
  background: #e8f5e9;
  color: #388E3C;
}

.framework-card h3 {
  font-size: 1.5em;
  color: #333;
  margin: 0 0 10px 0;
  line-height: 1.4;
}

.framework-subtitle {
  color: #666;
  font-size: 1em;
  margin: 0;
  line-height: 1.6;
}

.framework-body {
  margin-top: 25px;
  padding-top: 25px;
  border-top: 2px dashed #e0e0e0;
}

.structure-flow {
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin-bottom: 25px;
}

.flow-step {
  display: flex;
  gap: 18px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border-left: 4px solid #667eea;
  line-height: 1.7;
}

.step-indicator {
  width: 32px;
  height: 32px;
  min-width: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.95em;
}

.step-content h4 {
  color: #333;
  margin: 0 0 10px 0;
  font-size: 1.1em;
  line-height: 1.4;
}

.step-content p {
  color: #666;
  margin: 0 0 15px 0;
  font-size: 1em;
  line-height: 1.7;
}

.step-examples {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.example-line {
  padding: 12px 15px;
  background: white;
  border-radius: 8px;
  font-size: 0.95em;
  line-height: 1.7;
}

.example-en {
  display: block;
  color: #333;
  margin-bottom: 6px;
  font-style: italic;
  line-height: 1.7;
}

.example-cn {
  display: block;
  color: #999;
  font-size: 0.9em;
  line-height: 1.6;
}

.framework-tips {
  padding: 20px;
  background: #fff3e0;
  border-radius: 10px;
  border-left: 4px solid #FF9800;
  color: #333;
  line-height: 1.7;
}

.framework-tips ul {
  margin: 12px 0 0 0;
  padding-left: 20px;
}

.framework-tips li {
  margin-bottom: 8px;
  line-height: 1.7;
}

.framework-footer {
  margin-top: 15px;
  text-align: center;
}

.expand-hint {
  color: #667eea;
  font-size: 0.9em;
  font-weight: 500;
}

/* Memory Tip Section */
.memory-tip {
  padding: 20px;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-radius: 12px;
  border-left: 4px solid #2196F3;
  margin-bottom: 20px;
}

.memory-tip h4 {
  font-size: 1.1em;
  color: #1565C0;
  margin: 0 0 12px 0;
  font-weight: 600;
}

.memory-tip p {
  color: #333;
  font-size: 1.05em;
  line-height: 1.7;
  margin: 0;
}

/* Usage Note Section */
.usage-note {
  padding: 20px;
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  border-radius: 12px;
  border-left: 4px solid #4CAF50;
}

.usage-note h4 {
  font-size: 1.1em;
  color: #2E7D32;
  margin: 0 0 12px 0;
  font-weight: 600;
}

.usage-note p {
  color: #333;
  font-size: 1.05em;
  line-height: 1.7;
  margin: 0;
}

/* Sentences - Single Column Layout */
.sentences-categories {
  display: flex;
  flex-direction: column;
  gap: 45px;
  max-width: 900px;
  margin: 0 auto;
}

.sentence-category {
  background: white;
  border-radius: 20px;
  padding: 35px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  line-height: 1.8;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
  padding-bottom: 18px;
  border-bottom: 2px solid #f0f0f0;
}

.category-icon {
  font-size: 2em;
}

.category-header h3 {
  flex: 1;
  font-size: 1.4em;
  color: #333;
  margin: 0;
  line-height: 1.4;
}

.category-count {
  padding: 8px 16px;
  background: #f0f0f0;
  border-radius: 20px;
  font-size: 0.9em;
  color: #666;
  font-weight: 600;
}

.sentences-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sentence-card {
  padding: 25px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid #e9ecef;
  line-height: 1.8;
}

.sentence-card:hover {
  background: white;
  border-color: #667eea;
  transform: translateX(8px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2);
}

.sentence-main {
  margin-bottom: 15px;
}

.sentence-en {
  font-size: 1.1em;
  color: #333;
  margin-bottom: 10px;
  line-height: 1.8;
  font-weight: 500;
  /* English text optimization */
  font-family: 'Merriweather', 'Georgia', serif;
  letter-spacing: 0.2px;
}

.sentence-cn {
  color: #666;
  font-size: 1em;
  line-height: 1.7;
}

.sentence-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tag {
  padding: 6px 14px;
  border-radius: 12px;
  font-size: 0.85em;
  font-weight: 600;
  background: #e0e0e0;
  color: #666;
}

.tag.universal { background: #e3f2fd; color: #1976D2; }
.tag.formal { background: #f3e5f5; color: #7B1FA2; }
.tag.current { background: #fff3e0; color: #F57C00; }
.tag.social { background: #e8f5e9; color: #388E3C; }
.tag.contrast { background: #fce4ec; color: #C2185B; }
.tag.vocabulary { background: #e0f2f1; color: #00796B; }

/* Sentence Detail Dialog */
.sentence-breakdown {
  padding: 10px;
}

.breakdown-section {
  margin-bottom: 25px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
}

.breakdown-section h4 {
  color: #667eea;
  margin: 0 0 15px 0;
  font-size: 1.15em;
  line-height: 1.4;
}

.original-text {
  font-size: 1.2em;
  color: #333;
  line-height: 1.9;
  font-style: italic;
  padding: 18px;
  background: white;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.structure-highlight {
  color: #333;
  line-height: 1.9;
  padding: 18px;
  background: white;
  border-radius: 8px;
}

.usage-example {
  padding: 15px;
  background: white;
  border-radius: 8px;
  margin-bottom: 12px;
  line-height: 1.7;
}

.example-context {
  color: #667eea;
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 0.95em;
}

.example-sentence {
  color: #333;
  line-height: 1.8;
  font-size: 1.05em;
}

.breakdown-section.tips ul {
  margin: 0;
  padding-left: 20px;
}

.breakdown-section.tips li {
  margin-bottom: 10px;
  line-height: 1.7;
  color: #666;
  font-size: 1em;
}

/* Practice Section */
.practice-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px;
  background: white;
  border-radius: 16px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.timer-display {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.timer-label {
  color: #666;
  font-size: 0.9em;
}

.timer-value {
  font-size: 2.5em;
  font-weight: 700;
  color: #667eea;
  font-family: 'Courier New', monospace;
}

.control-buttons {
  display: flex;
  gap: 15px;
}

.practice-workspace {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.topic-card {
  padding: 25px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.topic-header {
  display: flex;
  gap: 12px;
  margin-bottom: 15px;
}

.topic-type {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85em;
  font-weight: 600;
}

.topic-type.argumentative { background: #e3f2fd; color: #1976D2; }
.topic-type.chart { background: #f3e5f5; color: #7B1FA2; }
.topic-type.letter { background: #e8f5e9; color: #388E3C; }

.topic-year {
  padding: 6px 14px;
  background: #f0f0f0;
  border-radius: 20px;
  font-size: 0.85em;
  color: #666;
  font-weight: 600;
}

.topic-title {
  font-size: 1.4em;
  color: #333;
  margin: 0 0 15px 0;
}

.topic-content {
  color: #666;
  line-height: 1.8;
  margin-bottom: 15px;
}

.topic-requirements {
  padding: 12px 15px;
  background: #fff3e0;
  border-radius: 8px;
  border-left: 4px solid #FF9800;
  color: #333;
}

.writing-area {
  position: relative;
}

.essay-textarea {
  width: 100%;
  min-height: 400px;
  padding: 20px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1em;
  line-height: 1.8;
  font-family: 'Merriweather', 'Georgia', 'Times New Roman', serif;
  resize: vertical;
  transition: border-color 0.3s ease;
  /* Better writing experience */
  letter-spacing: 0.3px;
}

.essay-textarea:focus {
  outline: none;
  border-color: #667eea;
}

.essay-textarea:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.word-count {
  position: absolute;
  bottom: 15px;
  right: 15px;
  padding: 8px 14px;
  background: white;
  border-radius: 8px;
  font-size: 0.9em;
  color: #666;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.quick-reference {
  padding: 25px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.quick-reference h4 {
  color: #333;
  margin: 0 0 20px 0;
  font-size: 1.2em;
}

.reference-cards {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.ref-card {
  padding: 22px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 14px;
  border-left: 4px solid #667eea;
  line-height: 1.7;
}

.ref-card h5 {
  color: #667eea;
  margin: 0 0 12px 0;
  font-size: 1em;
}

.ref-card ul {
  margin: 0;
  padding-left: 18px;
}

.ref-card li {
  margin-bottom: 10px;
  color: #666;
  font-size: 0.95em;
  line-height: 1.7;
}

.ref-card-highlight {
  background: linear-gradient(135deg, #fff9c4 0%, #fff59d 100%);
  border-left-color: #FFC107;
}

.ref-card-highlight h5 {
  color: #F57F17;
}

/* Auto Save Indicator */
.auto-save-indicator {
  margin-top: 20px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  border-radius: 10px;
  text-align: center;
  animation: pulse 2s ease-in-out infinite;
}

.save-status {
  color: #2E7D32;
  font-weight: 600;
  font-size: 0.95em;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* Examples - Single Column Layout */
.examples-filter {
  display: flex;
  gap: 18px;
  margin-bottom: 30px;
  justify-content: center;
}

.examples-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
  max-width: 900px;
  margin: 0 auto;
}

.example-card {
  padding: 30px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  line-height: 1.8;
}

.example-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.2);
  border-color: #667eea;
}

.example-preview {
  margin-bottom: 15px;
}

.example-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.example-type {
  padding: 8px 18px;
  border-radius: 20px;
  font-size: 1em;
  font-weight: 600;
}

.example-type.argumentative { background: #e3f2fd; color: #1976D2; }
.example-type.chart { background: #f3e5f5; color: #7B1FA2; }
.example-type.letter { background: #e8f5e9; color: #388E3C; }

.example-year {
  padding: 8px 18px;
  background: #f0f0f0;
  border-radius: 20px;
  font-size: 1em;
  color: #555;
  font-weight: 600;
}

.example-score {
  padding: 8px 18px;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  border-radius: 20px;
  font-size: 1em;
  color: #333;
  font-weight: 700;
}

.example-title {
  font-size: 1.5em;
  color: #333;
  margin: 0 0 20px 0;
  font-weight: 700;
  line-height: 1.5;
}

.example-excerpt {
  color: #555;
  font-size: 1.05em;
  line-height: 1.8;
  margin: 0;
}

.example-action {
  text-align: right;
}

/* Example Detail Dialog */
.example-full {
  padding: 15px;
  font-size: 1.05em;
}

.example-header-info {
  display: flex;
  gap: 12px;
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
  flex-wrap: wrap;
}

.example-essay {
  margin-bottom: 35px;
}

.example-essay h4 {
  color: #667eea;
  margin: 0 0 18px 0;
  font-size: 1.4em;
  font-weight: 700;
}

.essay-text {
  padding: 25px;
  background: #f8f9fa;
  border-radius: 14px;
  line-height: 2.2;
  color: #333;
  font-size: 1.15em;
  letter-spacing: 0.3px;
}

.essay-text p {
  margin-bottom: 15px;
}

.example-analysis {
  margin-bottom: 35px;
}

.example-analysis h4 {
  color: #667eea;
  margin: 0 0 25px 0;
  font-size: 1.4em;
  font-weight: 700;
}

.analysis-points {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.highlight-point {
  display: flex;
  gap: 18px;
  padding: 22px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 14px;
  border-left: 4px solid #667eea;
  line-height: 1.8;
}

.point-number {
  width: 36px;
  height: 36px;
  min-width: 36px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1em;
}

.point-content strong {
  display: block;
  color: #333;
  margin-bottom: 10px;
  font-size: 1.15em;
  font-weight: 700;
}

.point-content p {
  color: #555;
  margin: 0 0 12px 0;
  line-height: 1.8;
  font-size: 1.05em;
}

.point-example {
  padding: 12px 15px;
  background: white;
  border-radius: 10px;
  color: #667eea;
  font-style: italic;
  font-size: 1.05em;
  line-height: 1.7;
}

.example-vocabulary h4 {
  color: #667eea;
  margin: 0 0 25px 0;
  font-size: 1.4em;
  font-weight: 700;
}

.vocab-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.vocab-item {
  padding: 18px 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 12px;
  border-left: 4px solid #667eea;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  line-height: 1.7;
}

.vocab-word {
  font-weight: 700;
  color: #667eea;
  font-size: 1.15em;
}

.vocab-meaning {
  color: #555;
  font-size: 1.05em;
}

/* Writing Tips Section */
.writing-tips-section {
  margin-top: 30px;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.tip-card {
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.tip-card strong {
  display: block;
  font-size: 1.1em;
  margin-bottom: 15px;
  color: #333;
}

.tip-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tip-card li {
  padding: 8px 0;
  padding-left: 25px;
  position: relative;
  color: #555;
  line-height: 1.6;
}

.do-tip {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  border-left: 4px solid #4CAF50;
}

.do-tip .tip-icon::before {
  content: '✅';
  position: absolute;
  left: 0;
}

.do-tip li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #4CAF50;
  font-weight: bold;
}

.avoid-tip {
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
  border-left: 4px solid #F44336;
}

.avoid-tip .tip-icon::before {
  content: '⚠️';
  position: absolute;
  left: 0;
}

.avoid-tip li::before {
  content: '✗';
  position: absolute;
  left: 0;
  color: #F44336;
  font-weight: bold;
}

/* Footer Tips */
.premium-tips {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px 30px;
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  border-radius: 16px;
  margin: 0 30px 30px;
  box-shadow: 0 4px 15px rgba(255, 152, 0, 0.15);
}

.tips-icon {
  font-size: 2em;
}

.tips-content {
  flex: 1;
  color: #333;
  line-height: 1.6;
}

.tips-content strong {
  color: #F57C00;
}

/* Memory Tips Styles */
.memory-tip {
  margin-top: 15px;
  padding: 15px;
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  border-radius: 10px;
  border-left: 4px solid #4CAF50;
}

.memory-tip strong {
  color: #2E7D32;
  display: block;
  margin-bottom: 8px;
}

.memory-tip p {
  margin: 6px 0;
  color: #333;
  line-height: 1.6;
  font-size: 0.95em;
}

.memory-tip-detail {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-left: 4px solid #2196F3;
}

.memory-method {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.method-item {
  padding: 12px;
  background: white;
  border-radius: 8px;
}

.method-item strong {
  color: #1976D2;
  display: block;
  margin-bottom: 6px;
}

.method-item p {
  margin: 0;
  color: #333;
  line-height: 1.6;
}

/* Memory Master Section */
.memory-master-section {
  margin: 40px 30px;
  padding: 40px;
  background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(156, 39, 176, 0.15);
}

.memory-header {
  text-align: center;
  margin-bottom: 40px;
}

.memory-header h2 {
  font-size: 2.2em;
  color: #6A1B9A;
  margin: 0 0 10px 0;
  font-family: 'Georgia', serif;
}

.memory-subtitle {
  font-size: 1.1em;
  color: #7B1FA2;
  margin: 0;
}

.memory-cards-grid {
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-bottom: 45px;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

.memory-card {
  background: white;
  border-radius: 20px;
  padding: 35px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  line-height: 1.8;
}

.memory-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.memory-card.mnemonic {
  border-top: 5px solid #FF6F00;
}

.memory-card.association {
  border-top: 5px solid #2196F3;
}

.memory-card.repetition {
  border-top: 5px solid #4CAF50;
}

.card-icon {
  font-size: 3em;
  margin-bottom: 15px;
}

.memory-card h3 {
  font-size: 1.5em;
  color: #333;
  margin: 0 0 10px 0;
  font-family: 'Georgia', serif;
}

.card-desc {
  color: #666;
  margin: 0 0 25px 0;
  line-height: 1.8;
  font-size: 1.05em;
}

.memory-card .examples {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.example-item {
  padding: 15px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 1.7;
}

.example-item strong {
  color: #333;
  font-size: 1.05em;
}

.example-item span {
  color: #666;
  font-size: 0.9em;
}

.memory-action-tips {
  background: white;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.memory-action-tips h3 {
  font-size: 1.8em;
  color: #6A1B9A;
  margin: 0 0 25px 0;
  text-align: center;
  font-family: 'Georgia', serif;
}

.action-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.step {
  display: flex;
  gap: 15px;
  align-items: flex-start;
}

.step-number {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2em;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-content strong {
  display: block;
  color: #333;
  margin-bottom: 5px;
  font-size: 1.1em;
}

.step-content p {
  margin: 0;
  color: #666;
  line-height: 1.5;
}

.memory-warning {
  background: linear-gradient(135deg, #fff9c4 0%, #fff59d 100%);
  border-left: 5px solid #FBC02D;
  border-radius: 12px;
  padding: 25px;
}

.memory-warning strong {
  display: block;
  color: #F57F17;
  font-size: 1.2em;
  margin-bottom: 15px;
}

.memory-warning ul {
  margin: 0;
  padding-left: 20px;
}

.memory-warning li {
  margin: 10px 0;
  color: #333;
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-section {
    padding: 40px 20px;
  }
  
  .hero-title {
    font-size: 2.2em;
  }
  
  .hero-stats {
    gap: 25px;
  }
  
  .stat-number {
    font-size: 2em;
  }
  
  .premium-tabs {
    flex-wrap: wrap;
  }
  
  .tab-pill {
    padding: 12px 20px;
    font-size: 0.9em;
  }
  
  .frameworks-grid,
  .sentences-list,
  .reference-cards,
  .vocab-list {
    grid-template-columns: 1fr;
  }
  
  .practice-controls {
    flex-direction: column;
    gap: 20px;
  }
  
  .examples-filter {
    flex-direction: column;
  }
  
  .content-section {
    padding: 0 15px 30px;
  }
}

/* Placeholder */
.content-placeholder {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-size: 1.1em;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-section {
    padding: 40px 20px;
  }
  
  .hero-title {
    font-size: 2.2em;
  }
  
  .hero-stats {
    gap: 25px;
  }
  
  .stat-number {
    font-size: 2em;
  }
  
  .premium-tabs {
    flex-wrap: wrap;
  }
  
  .tab-pill {
    padding: 12px 20px;
    font-size: 0.9em;
  }
}

/* Anti-Template Section */
.warning-box {
  padding: 25px;
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
  border-radius: 15px;
  border-left: 5px solid #F44336;
  margin-bottom: 30px;
}

.warning-box h3 {
  color: #D32F2F;
  margin-bottom: 15px;
  font-size: 1.3em;
}

.warning-box ul {
  list-style: none;
  padding: 0;
}

.warning-box li {
  padding: 10px 0;
  padding-left: 30px;
  position: relative;
  color: #555;
  line-height: 1.7;
}

.warning-box li::before {
  content: '⚠️';
  position: absolute;
  left: 0;
}

.strategy-card {
  margin-bottom: 30px;
  padding: 30px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.strategy-card h3 {
  color: #667eea;
  margin-bottom: 25px;
  font-size: 1.4em;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

.strategies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.strategy-item {
  padding: 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

.strategy-item h4 {
  color: #764ba2;
  margin-bottom: 15px;
  font-size: 1.1em;
}

.example-list {
  list-style: none;
  padding: 0;
  margin: 15px 0;
}

.example-list li {
  padding: 10px 15px;
  margin: 8px 0;
  background: white;
  border-radius: 8px;
  color: #555;
  font-family: 'Courier New', monospace;
  font-size: 0.95em;
  line-height: 1.6;
  border: 1px solid #e0e0e0;
}

.strategy-tip {
  margin-top: 15px;
  padding: 12px 15px;
  background: linear-gradient(135deg, #fff9c4 0%, #fff59d 100%);
  border-radius: 8px;
  color: #F57F17;
  font-size: 0.95em;
  line-height: 1.6;
}

.transition-categories {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.category-box {
  padding: 20px;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-radius: 12px;
  border-left: 4px solid #2196F3;
}

.category-box h4 {
  color: #1976D2;
  margin-bottom: 15px;
  font-size: 1.1em;
}

.category-box ul {
  list-style: none;
  padding: 0;
}

.category-box li {
  padding: 8px 0;
  color: #555;
  line-height: 1.7;
  font-size: 0.95em;
}

.vocab-upgrade-table {
  overflow-x: auto;
}

.vocab-upgrade-table table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

.vocab-upgrade-table th {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px;
  text-align: left;
  font-weight: 600;
}

.vocab-upgrade-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
}

.basic-word {
  font-weight: 600;
  color: #F44336;
  background: #ffebee;
  padding: 8px 12px;
  border-radius: 6px;
  display: inline-block;
}

.advanced-words {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.upgrade-tag {
  padding: 6px 12px;
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  color: #2E7D32;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.95em;
}

.flow-tips {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.flow-tip-item {
  padding: 20px;
  background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
  border-radius: 12px;
  border-left: 4px solid #9C27B0;
}

.flow-tip-item strong {
  display: block;
  color: #7B1FA2;
  margin-bottom: 10px;
  font-size: 1.1em;
}

.flow-tip-item p {
  color: #555;
  line-height: 1.7;
  margin: 0;
}
</style>

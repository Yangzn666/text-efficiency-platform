<script setup lang="ts">
import { ref, computed } from 'vue'

const activeTab = ref('frameworks')

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
    tips: [
      '注意书信格式（称呼、署名）',
      '语气要礼貌得体',
      '内容要完整，涵盖所有要点',
      '字数控制在100-120词左右'
    ]
  }
]

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
    title: '开头引入 | Opening',
    sentences: [
      {
        id: 1,
        english: 'With the rapid development of technology/society/economy, ...',
        chinese: '随着科技/社会/经济的快速发展，...',
        tags: ['universal', 'formal'],
        structure: '<strong>With the rapid development of</strong> [主题], [主句].',
        examples: [
          { context: '科技话题', sentence: 'With the rapid development of technology, our lives have changed dramatically.' },
          { context: '教育话题', sentence: 'With the rapid development of online education, learning has become more accessible.' }
        ],
        tips: ['适用于大多数话题开头', 'development后可接不同领域']
      },
      {
        id: 2,
        english: 'Nowadays, ___ has become a hot topic / a matter of public concern.',
        chinese: '如今，___已成为热门话题/公众关注的问题。',
        tags: ['current', 'social'],
        structure: '<strong>Nowadays,</strong> [话题] <strong>has become</strong> [a hot topic/a matter of public concern].',
        examples: [
          { context: '环保话题', sentence: 'Nowadays, environmental protection has become a matter of public concern.' },
          { context: '健康话题', sentence: 'Nowadays, mental health has become a hot topic among young people.' }
        ],
        tips: ['hot topic更口语化', 'matter of public concern更正式']
      },
      {
        id: 3,
        english: 'It is universally acknowledged that ...',
        chinese: '众所周知，...',
        tags: ['formal', 'emphasis'],
        structure: '<strong>It is universally acknowledged that</strong> [观点].',
        examples: [
          { context: '教育重要性', sentence: 'It is universally acknowledged that education is the key to success.' },
          { context: '健康重要性', sentence: 'It is universally acknowledged that health is wealth.' }
        ],
        tips: ['语气强烈，用于公认事实', '避免用于有争议的观点']
      }
    ]
  },
  {
    id: 2,
    icon: '️',
    title: '论证过渡 | Transition',
    sentences: [
      {
        id: 4,
        english: 'On the one hand, ... On the other hand, ...',
        chinese: '一方面...另一方面...',
        tags: ['contrast', 'balanced'],
        structure: '<strong>On the one hand,</strong> [观点1]. <strong>On the other hand,</strong> [观点2].',
        examples: [
          { context: '科技利弊', sentence: 'On the one hand, technology brings convenience. On the other hand, it also causes problems.' }
        ],
        tips: ['用于对比两种观点', '确保两方面平衡论述']
      },
      {
        id: 5,
        english: 'Furthermore / Moreover / In addition, ...',
        chinese: '此外/而且/另外，...',
        tags: ['addition', 'progressive'],
        structure: '[前一句]. <strong>Furthermore/Moreover/In addition,</strong> [补充观点].',
        examples: [
          { context: '递进论证', sentence: 'Reading expands our knowledge. Furthermore, it improves our critical thinking skills.' }
        ],
        tips: ['三个词可互换', 'furthermore最正式']
      },
      {
        id: 6,
        english: 'However / Nevertheless, ...',
        chinese: '然而/尽管如此，...',
        tags: ['contrast', '转折'],
        structure: '[前一句]. <strong>However/Nevertheless,</strong> [转折观点].',
        examples: [
          { context: '转折论证', sentence: 'Technology has many benefits. However, it also poses challenges to privacy.' }
        ],
        tips: ['nevertheless比however更正式', '用于引入相反观点']
      }
    ]
  },
  {
    id: 3,
    icon: '✅',
    title: '结论总结 | Conclusion',
    sentences: [
      {
        id: 7,
        english: 'In conclusion / To sum up, ...',
        chinese: '总之/总而言之，...',
        tags: ['summary', 'final'],
        structure: '<strong>In conclusion/To sum up,</strong> [总结观点].',
        examples: [
          { context: '环保总结', sentence: 'In conclusion, we should take immediate action to protect the environment.' }
        ],
        tips: ['in conclusion更常用', 'to sum up稍显口语']
      },
      {
        id: 8,
        english: 'Taking all these factors into consideration, ...',
        chinese: '综合考虑所有因素，...',
        tags: ['comprehensive', 'formal'],
        structure: '<strong>Taking all these factors into consideration,</strong> [结论].',
        examples: [
          { context: '综合结论', sentence: 'Taking all these factors into consideration, I believe that online learning will play an increasingly important role.' }
        ],
        tips: ['显得思考全面', '适合复杂话题']
      },
      {
        id: 9,
        english: 'It is high time that we took effective measures to ...',
        chinese: '是时候采取有效措施来...',
        tags: ['urgent', 'action'],
        structure: '<strong>It is high time that we took effective measures to</strong> [行动].',
        examples: [
          { context: '呼吁行动', sentence: 'It is high time that we took effective measures to reduce pollution.' }
        ],
        tips: ['虚拟语气（took不是take）', '表达紧迫感']
      }
    ]
  },
  {
    id: 4,
    icon: '📈',
    title: '数据描述 | Data Description',
    sentences: [
      {
        id: 10,
        english: 'The number/percentage has increased/decreased significantly.',
        chinese: '数量/百分比显著增长/下降。',
        tags: ['trend', 'chart'],
        structure: '<strong>The number/percentage</strong> [of某物] <strong>has increased/decreased significantly.</strong>',
        examples: [
          { context: '增长描述', sentence: 'The number of college students has increased significantly in recent years.' }
        ],
        tips: ['significantly可替换为dramatically/sharply', '注意时态用完成时']
      },
      {
        id: 11,
        english: 'Compared with ___, ___ is higher/lower.',
        chinese: '与___相比，___更高/更低。',
        tags: ['comparison', 'chart'],
        structure: '<strong>Compared with</strong> [对比对象1], [对比对象2] <strong>is higher/lower.</strong>',
        examples: [
          { context: '对比描述', sentence: 'Compared with 2010, the unemployment rate in 2020 is lower.' }
        ],
        tips: ['用于两个时间点或群体对比', 'higher/lower可替换为greater/smaller']
      },
      {
        id: 12,
        english: 'It accounts for ___ percent of the total.',
        chinese: '它占总数的___百分比。',
        tags: ['proportion', 'chart'],
        structure: '[某物] <strong>accounts for</strong> [数字] percent <strong>of the total.</strong>',
        examples: [
          { context: '比例描述', sentence: 'Renewable energy accounts for 25 percent of the total energy consumption.' }
        ],
        tips: ['account for=占据/构成', '可用于饼图描述']
      }
    ]
  },
  {
    id: 5,
    icon: '💎',
    title: '高级替换 | Advanced Substitution',
    sentences: [
      {
        id: 13,
        english: 'Instead of "good", use: beneficial / advantageous / favorable',
        chinese: '用beneficial/advantageous/favorable替换good',
        tags: ['vocabulary', 'upgrade'],
        structure: 'Replace <del>good</del> with <ins>beneficial/advantageous/favorable</ins>',
        examples: [
          { context: '原句', sentence: 'Exercise is good for health.' },
          { context: '升级', sentence: 'Exercise is beneficial to health.' }
        ],
        tips: ['beneficial最通用', 'advantageous强调优势', 'favorable强调有利条件']
      },
      {
        id: 14,
        english: 'Instead of "think", use: argue / maintain / contend',
        chinese: '用argue/maintain/contend替换think',
        tags: ['vocabulary', 'academic'],
        structure: 'Replace <del>I think</del> with <ins>I argue/maintain/contend that</ins>',
        examples: [
          { context: '原句', sentence: 'I think that education is important.' },
          { context: '升级', sentence: 'I argue that education plays a crucial role.' }
        ],
        tips: ['argue最常用', 'maintain强调坚持观点', 'contend更正式']
      },
      {
        id: 15,
        english: 'Instead of "important", use: crucial / vital / indispensable',
        chinese: '用crucial/vital/indispensable替换important',
        tags: ['vocabulary', 'emphasis'],
        structure: 'Replace <del>important</del> with <ins>crucial/vital/indispensable</ins>',
        examples: [
          { context: '原句', sentence: 'Water is important for life.' },
          { context: '升级', sentence: 'Water is indispensable for life.' }
        ],
        tips: ['crucial强调关键性', 'vital强调生命攸关', 'indispensable强调不可或缺']
      }
    ]
  },
  {
    id: 6,
    icon: '🎯',
    title: '举例论证 | Examples',
    sentences: [
      {
        id: 16,
        english: 'For instance / For example, ...',
        chinese: '例如，...',
        tags: ['example', 'universal'],
        structure: '[观点]. <strong>For instance/For example,</strong> [具体例子].',
        examples: [
          { context: '科技例子', sentence: 'Many technologies have improved our lives. For instance, smartphones allow us to communicate instantly.' }
        ],
        tips: ['for instance更正式', 'for example更常用']
      },
      {
        id: 17,
        english: 'Take ... as an example.',
        chinese: '以...为例。',
        tags: ['example', 'emphasis'],
        structure: '<strong>Take</strong> [例子] <strong>as an example.</strong>',
        examples: [
          { context: '教育例子', sentence: 'Online learning has many advantages. Take Coursera as an example.' }
        ],
        tips: ['用于引入具体案例', '语气较强']
      },
      {
        id: 18,
        english: 'A case in point is ...',
        chinese: '一个恰当的例子是...',
        tags: ['example', 'formal'],
        structure: '<strong>A case in point is</strong> [例子].',
        examples: [
          { context: '环保例子', sentence: 'Environmental problems are serious. A case in point is air pollution in big cities.' }
        ],
        tips: ['非常正式的表迖', '适合学术写作']
      }
    ]
  },
  {
    id: 7,
    icon: '⚖️',
    title: '因果分析 | Cause & Effect',
    sentences: [
      {
        id: 19,
        english: 'This is mainly because ...',
        chinese: '这主要是因为...',
        tags: ['cause', 'explanation'],
        structure: '[现象]. <strong>This is mainly because</strong> [原因].',
        examples: [
          { context: '解释原因', sentence: 'Many people prefer online shopping. This is mainly because it is more convenient.' }
        ],
        tips: ['直接说明原因', 'mainly可省略']
      },
      {
        id: 20,
        english: 'As a result / Consequently, ...',
        chinese: '因此/结果是，...',
        tags: ['effect', 'result'],
        structure: '[原因]. <strong>As a result/Consequently,</strong> [结果].',
        examples: [
          { context: '说明结果', sentence: 'He studied hard every day. As a result, he passed the exam with high scores.' }
        ],
        tips: ['consequently更正式', 'as a result更常用']
      },
      {
        id: 21,
        english: 'Due to / Owing to ..., ...',
        chinese: '由于...，...',
        tags: ['cause', 'formal'],
        structure: '<strong>Due to/Owing to</strong> [原因], [结果].',
        examples: [
          { context: '正式表达', sentence: 'Due to the rapid development of technology, our lives have changed dramatically.' }
        ],
        tips: ['due to和owing to可互换', '后接名词或名词短语']
      }
    ]
  },
  {
    id: 8,
    icon: '💡',
    title: '建议措施 | Suggestions',
    sentences: [
      {
        id: 22,
        english: 'It is advisable to ...',
        chinese: '建议...',
        tags: ['suggestion', 'formal'],
        structure: '<strong>It is advisable to</strong> [建议内容].',
        examples: [
          { context: '提建议', sentence: 'It is advisable to start preparing for the exam early.' }
        ],
        tips: ['比should更正式', '适合书面语']
      },
      {
        id: 23,
        english: 'We should take effective measures to ...',
        chinese: '我们应该采取有效措施来...',
        tags: ['action', 'urgent'],
        structure: '<strong>We should take effective measures to</strong> [行动].',
        examples: [
          { context: '呼吁行动', sentence: 'We should take effective measures to protect the environment.' }
        ],
        tips: ['强调行动的必要性', 'effective可替换为immediate']
      },
      {
        id: 24,
        english: 'Only by doing ... can we ...',
        chinese: '只有通过...我们才能...',
        tags: ['condition', 'emphasis'],
        structure: '<strong>Only by</strong> [方式] <strong>can we</strong> [结果].',
        examples: [
          { context: '强调条件', sentence: 'Only by working hard can we achieve our goals.' }
        ],
        tips: ['倒装句结构', '语气强烈，强调唯一途径']
      }
    ]
  }
]

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
    1: '“随着发” - With the rapid development of...（随着...的快速发展）',
    2: '“如今热” - Nowadays...has become a hot topic（如今...成热门）',
    3: '“众所周” - It is universally acknowledged that（众所周知）',
    4: '“一方另” - On the one hand...On the other hand（一方面...另一方面）',
    5: '“此外而” - Furthermore/Moreover/In addition（此外/而且/另外）',
    6: '“然而尽” - However/Nevertheless（然而/尽管如此）',
    7: '“总之总” - In conclusion/To sum up（总之/总而言之）',
    8: '“综合考” - Taking all these factors into consideration（综合考虑）',
    9: '“是时候” - It is high time that we took...（是时候...）',
    10: '“数增减” - The number has increased/decreased（数量增长/下降）',
    11: '“相比高” - Compared with...is higher/lower（与...相比更高/低）',
    12: '“占百分” - It accounts for...percent（占...百分比）',
    13: '“好替换” - good→beneficial/advantageous（好的替换词）',
    14: '“想替换” - think→argue/maintain/contend（想的替换词）',
    15: '“重替换” - important→crucial/vital/indispensable（重要的替换词）',
    16: '“例如举” - For instance/For example（例如/举例）',
    17: '“以为例” - Take...as an example（以...为例）',
    18: '“恰当例” - A case in point is...（一个恰当的例子是）',
    19: '“主要因” - This is mainly because（这主要是因为）',
    20: '“因此结” - As a result/Consequently（因此/结果是）',
    21: '“由于因” - Due to/Owing to（由于/因为）',
    22: '“建议宜” - It is advisable to（建议/适宜）',
    23: '“采措施” - take effective measures to（采取有效措施）',
    24: '“只有才” - Only by...can we（只有...才能）'
  }
  return mnemonics[sentence.id] || '记住句型结构和关键词'
}

function getMemoryAssociation(sentence: any): string {
  const associations: Record<number, string> = {
    1: '想象火箭发射🚀：With the rapid development（随着快速发展）→ 火箭升空',
    2: '想象热搜榜🔥：Nowadays...hot topic（如今...热门话题）→ 上热搜',
    3: '想象全班点头👥：universally acknowledged（众所周知）→ 大家都同意',
    4: '想象天平⚖️：on the one hand...on the other hand → 两边平衡',
    5: '想象搭积木🧱：Furthermore（此外）→ 再加一块',
    6: '想象转弯🔄：However（然而）→ 方向改变',
    7: '想象句号⭕：In conclusion（总之）→ 画龙点睛',
    8: '想象拼图🧩：Taking all factors（综合考虑）→ 拼凑完整',
    9: '想象闹钟⏰：It is high time（是时候了）→ 时间紧迫',
    10: '想象箭头📈：increased/decreased（增长/下降）→ 上下箭头',
    11: '想象比较📊：Compared with（与...相比）→ 左右对比',
    12: '想象饼图🥧：accounts for percent（占百分比）→ 饼图分块',
    13: '想象升级⭐：good→beneficial → 普通变高级',
    14: '想象辩论🎤：think→argue → 从想法到论证',
    15: '想象钻石💎：important→crucial → 重要变关键',
    16: '想象手指👉：For example（例如）→  pointing举例',
    17: '想象放大镜🔍：Take...as example → 聚焦案例',
    18: '想象靶心🎯：A case in point → 精准例子',
    19: '想象问号❓：This is because → 解释原因',
    20: '想象结果✅：As a result → 因果关系',
    21: '想象链条🔗：Due to → 因果连接',
    22: '想象灯泡💡：advisable → 好主意',
    23: '想象工具箱🛠️：take measures → 采取措施',
    24: '想象钥匙🔑：Only by...can we → 唯一方法'
  }
  return associations[sentence.id] || '联想句型的实际应用场景'
}

function getMemoryUsage(sentence: any): string {
  const usages: Record<number, string> = {
    1: '适用：所有话题开头，万能句型',
    2: '适用：社会热点、时事话题',
    3: '适用：公认事实、科学真理',
    4: '适用：对比两种观点、利弊分析',
    5: '适用：递进论证、补充论点',
    6: '适用：转折、引入相反观点',
    7: '适用：结尾总结、重申观点',
    8: '适用：复杂话题、综合结论',
    9: '适用：呼吁行动、表达紧迫',
    10: '适用：图表作文、数据描述',
    11: '适用：图表作文、对比分析',
    12: '适用：图表作文、比例描述',
    13: '适用：词汇升级、避免重复',
    14: '适用：学术写作、表达观点',
    15: '适用：强调重要性、提升档次',
    16: '适用：举例论证、支撑论点',
    17: '适用：引入具体案例',
    18: '适用：正式写作、学术文章',
    19: '适用：解释原因、因果分析',
    20: '适用：说明结果、因果连接',
    21: '适用：正式表达、书面语',
    22: '适用：提建议、正式场合',
    23: '适用：呼吁行动、解决问题',
    24: '适用：强调条件、倒装句式'
  }
  return usages[sentence.id] || '根据句型特点灵活使用'
}

// ========== Tab 3: Practice Data ==========
const isPracticing = ref(false)
const remainingTime = ref(1800) // 30分钟 = 1800秒
const userEssay = ref('')
let timer: any = null

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
}

function stopPractice() {
  isPracticing.value = false
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  
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
        :class="['tab-pill', { active: activeTab === 'frameworks' }]" 
        @click="activeTab = 'frameworks'"
      >
        <span class="tab-icon">🏗️</span>
        <span class="tab-text">框架模板</span>
      </button>
      <button 
        :class="['tab-pill', { active: activeTab === 'sentences' }]" 
        @click="activeTab = 'sentences'"
      >
        <span class="tab-icon">💎</span>
        <span class="tab-text">万能句型</span>
      </button>
      <button 
        :class="['tab-pill', { active: activeTab === 'practice' }]" 
        @click="activeTab = 'practice'"
      >
        <span class="tab-icon">⚡</span>
        <span class="tab-text">实战演练</span>
      </button>
      <button 
        :class="['tab-pill', { active: activeTab === 'examples' }]" 
        @click="activeTab = 'examples'"
      >
        <span class="tab-icon">📖</span>
        <span class="tab-text">范文库</span>
      </button>
    </div>

    <!-- Tab 1: Frameworks -->
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
          </div>

          <div class="framework-body" v-show="expandedFramework === framework.id">
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
              <strong>💡 使用要点：</strong>
              <ul>
                <li v-for="tip in framework.tips" :key="tip">{{ tip }}</li>
              </ul>
              
              <!-- 记忆贴士 -->
              <div class="memory-tip">
                <strong>🧠 记忆技巧：</strong>
                <p v-if="framework.id === 1">
                  <strong>口诀：</strong>“引表论总” - 引出话题→表明立场→论证理由→总结展望<br>
                  <strong>联想：</strong>想象你在演讲：先说主题(引)，再站队(表)，然后讲道理(论)，最后收尾(总)<br>
                  <strong>关键词：</strong>Recently... / From my perspective... / First...Furthermore...Last... / In conclusion...
                </p>
                <p v-if="framework.id === 2">
                  <strong>口诀：</strong>“描析预” - 描述数据→分析原因→预测趋势<br>
                  <strong>联想：</strong>像天气预报：先看图表(描)，再解释为什么(析)，最后预测未来(预)<br>
                  <strong>关键词：</strong>As shown... / Several factors... / It can be predicted...
                </p>
                <p v-if="framework.id === 3">
                  <strong>口诀：</strong>“目内结” - 目的→内容→结尾<br>
                  <strong>联想：</strong>写信三步骤：为何写(目)→写什么(内)→怎么结束(结)<br>
                  <strong>关键词：</strong>I am writing to... / Firstly...Secondly...Finally... / I would appreciate...
                </p>
              </div>
            </div>
          </div>

          <div class="framework-footer">
            <span class="expand-hint">{{ expandedFramework === framework.id ? '点击收起 ↑' : '点击展开详情 ↓' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 2: Sentences -->
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
          <h4>📌 快速参考</h4>
          <div class="reference-cards">
            <div class="ref-card">
              <h5>开头句型</h5>
              <ul>
                <li>Recently, the issue of ___ has aroused wide concern.</li>
                <li>From my perspective, I firmly believe that...</li>
              </ul>
            </div>
            <div class="ref-card">
              <h5>论证连接</h5>
              <ul>
                <li>First and foremost, ...</li>
                <li>Furthermore, ...</li>
                <li>Last but not least, ...</li>
              </ul>
            </div>
            <div class="ref-card">
              <h5>结尾总结</h5>
              <ul>
                <li>In conclusion, ...</li>
                <li>It is high time that we took effective measures to...</li>
              </ul>
            </div>
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
            <h4>📊 亮点分析</h4>
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
            <h4>📚 高分词汇</h4>
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
        </div>
      </el-dialog>
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
  padding: 0 30px 40px;
}

.section-header {
  text-align: center;
  margin-bottom: 35px;
}

.section-header h2 {
  font-size: 2em;
  color: #333;
  margin: 0 0 10px 0;
  font-weight: 700;
  /* Premium heading font */
  font-family: 'Georgia', serif;
  letter-spacing: -0.5px;
}

.section-desc {
  color: #666;
  font-size: 1.05em;
  margin: 0;
}

/* Frameworks Grid */
.frameworks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 25px;
}

.framework-card {
  background: white;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.framework-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
  border-color: #667eea;
}

.framework-header {
  margin-bottom: 20px;
}

.framework-badge {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.85em;
  font-weight: 600;
  margin-bottom: 12px;
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
  font-size: 1.4em;
  color: #333;
  margin: 0 0 8px 0;
}

.framework-subtitle {
  color: #666;
  font-size: 0.95em;
  margin: 0;
}

.framework-body {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px dashed #e0e0e0;
}

.structure-flow {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}

.flow-step {
  display: flex;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 12px;
  border-left: 4px solid #667eea;
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
  margin: 0 0 8px 0;
  font-size: 1.05em;
}

.step-content p {
  color: #666;
  margin: 0 0 12px 0;
  font-size: 0.95em;
  line-height: 1.6;
}

.step-examples {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.example-line {
  padding: 8px 12px;
  background: white;
  border-radius: 8px;
  font-size: 0.9em;
}

.example-en {
  display: block;
  color: #333;
  margin-bottom: 4px;
  font-style: italic;
}

.example-cn {
  display: block;
  color: #999;
  font-size: 0.85em;
}

.framework-tips {
  padding: 15px;
  background: #fff3e0;
  border-radius: 10px;
  border-left: 4px solid #FF9800;
  color: #333;
}

.framework-tips ul {
  margin: 10px 0 0 0;
  padding-left: 20px;
}

.framework-tips li {
  margin-bottom: 6px;
  line-height: 1.5;
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

/* Sentences Section */
.sentences-categories {
  display: flex;
  flex-direction: column;
  gap: 35px;
}

.sentence-category {
  background: white;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.category-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

.category-icon {
  font-size: 1.8em;
}

.category-header h3 {
  flex: 1;
  font-size: 1.3em;
  color: #333;
  margin: 0;
}

.category-count {
  padding: 6px 14px;
  background: #f0f0f0;
  border-radius: 20px;
  font-size: 0.85em;
  color: #666;
  font-weight: 600;
}

.sentences-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 15px;
}

.sentence-card {
  padding: 18px;
  background: #f8f9fa;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.sentence-card:hover {
  background: white;
  border-color: #667eea;
  transform: translateX(5px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.15);
}

.sentence-main {
  margin-bottom: 12px;
}

.sentence-en {
  font-size: 1.05em;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.6;
  font-weight: 500;
  /* English text optimization */
  font-family: 'Merriweather', 'Georgia', serif;
  letter-spacing: 0.2px;
}

.sentence-cn {
  color: #666;
  font-size: 0.95em;
}

.sentence-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8em;
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
  margin: 0 0 12px 0;
  font-size: 1.1em;
}

.original-text {
  font-size: 1.15em;
  color: #333;
  line-height: 1.8;
  font-style: italic;
  padding: 15px;
  background: white;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.structure-highlight {
  color: #333;
  line-height: 1.8;
  padding: 15px;
  background: white;
  border-radius: 8px;
}

.usage-example {
  padding: 12px;
  background: white;
  border-radius: 8px;
  margin-bottom: 10px;
}

.example-context {
  color: #667eea;
  font-weight: 600;
  margin-bottom: 6px;
  font-size: 0.9em;
}

.example-sentence {
  color: #333;
  line-height: 1.6;
}

.breakdown-section.tips ul {
  margin: 0;
  padding-left: 20px;
}

.breakdown-section.tips li {
  margin-bottom: 8px;
  line-height: 1.6;
  color: #666;
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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.ref-card {
  padding: 18px;
  background: #f8f9fa;
  border-radius: 12px;
  border-left: 4px solid #667eea;
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
  margin-bottom: 8px;
  color: #666;
  font-size: 0.9em;
  line-height: 1.5;
}

/* Examples Section */
.examples-filter {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  justify-content: center;
}

.examples-list {
  display: grid;
  gap: 20px;
}

.example-card {
  padding: 25px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.example-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
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
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85em;
  font-weight: 600;
}

.example-type.argumentative { background: #e3f2fd; color: #1976D2; }
.example-type.chart { background: #f3e5f5; color: #7B1FA2; }
.example-type.letter { background: #e8f5e9; color: #388E3C; }

.example-year {
  padding: 6px 14px;
  background: #f0f0f0;
  border-radius: 20px;
  font-size: 0.85em;
  color: #666;
  font-weight: 600;
}

.example-score {
  padding: 6px 14px;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  border-radius: 20px;
  font-size: 0.85em;
  color: #333;
  font-weight: 700;
}

.example-title {
  font-size: 1.3em;
  color: #333;
  margin: 0 0 10px 0;
}

.example-excerpt {
  color: #666;
  font-size: 0.95em;
  line-height: 1.6;
  margin: 0;
}

.example-action {
  text-align: right;
}

/* Example Detail Dialog */
.example-full {
  padding: 10px;
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
  margin-bottom: 30px;
}

.example-essay h4 {
  color: #667eea;
  margin: 0 0 15px 0;
  font-size: 1.2em;
}

.essay-text {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  line-height: 2;
  color: #333;
}

.essay-text p {
  margin-bottom: 15px;
}

.example-analysis {
  margin-bottom: 30px;
}

.example-analysis h4 {
  color: #667eea;
  margin: 0 0 20px 0;
  font-size: 1.2em;
}

.analysis-points {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.highlight-point {
  display: flex;
  gap: 15px;
  padding: 18px;
  background: #f8f9fa;
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

.point-number {
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
}

.point-content strong {
  display: block;
  color: #333;
  margin-bottom: 8px;
  font-size: 1.05em;
}

.point-content p {
  color: #666;
  margin: 0 0 10px 0;
  line-height: 1.6;
}

.point-example {
  padding: 10px 12px;
  background: white;
  border-radius: 8px;
  color: #667eea;
  font-style: italic;
  font-size: 0.95em;
}

.example-vocabulary h4 {
  color: #667eea;
  margin: 0 0 20px 0;
  font-size: 1.2em;
}

.vocab-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.vocab-item {
  padding: 12px 15px;
  background: #f8f9fa;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.vocab-word {
  font-weight: 600;
  color: #667eea;
  font-size: 1.05em;
}

.vocab-meaning {
  color: #666;
  font-size: 0.9em;
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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

.memory-card {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.memory-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
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
  margin: 0 0 20px 0;
  line-height: 1.6;
}

.memory-card .examples {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.example-item {
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
</style>

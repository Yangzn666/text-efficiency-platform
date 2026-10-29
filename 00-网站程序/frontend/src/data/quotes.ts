// 励志语录库 · 全部为可署名的真实名言（国外心理学 / 哲学 / 社会学 / 体育界 + 中国古文 / 近代）
// 原则：宁少不假——只收有明确出处、原文可查的条目；不写"AI味"的自造鸡汤，也不收网络伪托（如"杨绛一百岁感言"）。
// 用法：各页面按主题取一组，用 alternateWithChinese() 让中外名言交替轮播；今日一句卡额外显示 scene（适用场景）。

export interface MotivationQuote {
  text: string
  author: string
  src?: string    // 出处（书名/篇名/场合）
  scene?: string  // 适合在什么时刻用它（今日一句卡用）
}

/** 韧性 · 扛住苦难 */
export const QUOTES_RESILIENCE: MotivationQuote[] = [
  { text: '那些杀不死我的，终将使我更强大。', author: '尼采', src: '《偶像的黄昏》', scene: '被一套卷子打回原形、觉得白学的时候' },
  { text: '人所拥有的一切都可以被剥夺，唯独最后一项自由不行——在任何境遇下选择自己态度的自由。', author: '维克多·弗兰克尔', src: '《活出生命的意义》', scene: '环境不顺、进度被别人甩开时' },
  { text: '在隆冬，我终于发现，我心里有一个不可战胜的夏天。', author: '加缪', src: '《重返蒂巴萨》', scene: '十一月十二月最难熬的那几天' },
  { text: '生活总是让我们遍体鳞伤，但那些受伤的地方，最后会变成我们最强壮的地方。', author: '海明威', src: '《永别了，武器》', scene: '同一类错误反复扣分，想砸书的时候' },
  { text: '试过。失败过。没关系。再试。再败。败得更好。', author: '贝克特', src: '《如何是这样》', scene: '二刷还错的题，第三遍开工前' },
  { text: '你无法控制所有落在你身上的事，但你可以决定不被它们压垮。', author: '玛雅·安杰卢', scene: '题目难度、报名时间这些外部变量卡住你时' },
  { text: '我投丢过超过九千次球，输了将近三百场比赛；我失败了一次又一次——而这正是我成功的原因。', author: '迈克尔·乔丹', scene: '错题本越攒越厚，怀疑自己时' },
  { text: '当我们无法改变处境时，我们被挑战去改变自己。', author: '维克多·弗兰克尔', scene: '倒计时已定、只剩自己能动的当天' },
]

/** 专注 · 对付焦虑 */
export const QUOTES_FOCUS: MotivationQuote[] = [
  { text: '我们常在想象中受苦，多于在现实中受苦。', author: '塞涅卡', src: '《道德书简》', scene: '还没做就预演考砸后果的深夜' },
  { text: '扰乱人的不是事情本身，而是人对事情的看法。', author: '爱比克泰德', src: '《手册》', scene: '把"这题字数多"直接读成"这题难"时' },
  { text: '焦虑，是自由的眩晕。', author: '克尔凯郭尔', src: '《恐惧的概念》', scene: '站在择校 / 换方向的选择关口' },
  { text: '你无需离开房间。只需安静、独处、静止，世界自会向你展示自己。', author: '卡夫卡', scene: '总想换书桌、换环境、换计划的坐不住时' },
  { text: '你没有选择的潜意识，会主导你的人生，而你会把它称为命运。', author: '荣格', scene: '发现自己每次都栽在同一个坑里' },
  { text: '我们这一代人最伟大的领悟是：人可以通过改变内心的态度，改变生命的面向。', author: '威廉·詹姆斯', scene: '开刷前那五分钟的心态调整' },
  { text: '行动的障碍推动行动；挡在路上的，从此成为路。', author: '马可·奥勒留', src: '《沉思录》', scene: '最不想碰的那一科，正好当今天第一件' },
  { text: '重要的不是你拥有什么，而是你如何使用你所拥有的。', author: '阿德勒', scene: '嫌基础差、嫌时间不够的那个念头' },
]

/** 努力 · 刻意练习 */
export const QUOTES_EFFORT: MotivationQuote[] = [
  { text: '我憎恨每一分钟的训练。但我告诉自己：别放弃，现在吃这份苦，余生做冠军。', author: '穆罕默德·阿里', scene: '第七个小时，纯靠意志力续的那段' },
  { text: '坐起我不计数，我只从开始疼的那一刻才数——因为只有那些才算数。', author: '穆罕默德·阿里', scene: '统计学习时长时：舒服的部分不算数' },
  { text: '天赋什么都不算，努力算两次。', author: '安杰拉·达克沃斯', src: '《坚毅》', scene: '看见别人一学就会、自己得刷三遍时' },
  { text: '卓越不是天赋的产物，而是刻意练习的结果。', author: '安德斯·艾利克森', src: '《刻意练习》', scene: '设计今天练什么：专挑不会的那段' },
  { text: '最优的体验，往往发生在身心为有价值的目标自愿运转到极限之时。', author: '契克森米哈赖', src: '《心流》', scene: '题目难度刚好压住能力的那半小时' },
  { text: '天赋如果不努力，就毫无意义。', author: 'C 罗', scene: '靠小聪明做对、没落到笔上时' },
  { text: '成功不是偶然，它是努力、坚持、学习、钻研、训练，以及对你所做之事的热爱的结果。', author: '贝利', scene: '把成绩归因成"运气好"的那道题' },
  { text: '今日之我胜于昨日之我，此乃武芸之道。', author: '宫本武藏', src: '《五轮书》', scene: '只跟昨天的自己比的那本账' },
  { text: '如果你害怕失败，那你大概率不会成功。', author: '科比·布莱恩特', scene: '不敢动笔写大题第一问的时刻' },
]

/** 自信 · 立刻行动 */
export const QUOTES_CONFIDENCE: MotivationQuote[] = [
  { text: '成功的一把关键钥匙是自信；而自信的一把关键钥匙，是准备。', author: '阿瑟·阿什', scene: '进场前发虚：靠昨天备好的东西撑住' },
  { text: '压力是一种特权。', author: '比尔·简·金', scene: '被截止日追着跑的那一周' },
  { text: '多关心品格，少关心名声：品格是你真正是什么，名声只是别人怎么看你。', author: '约翰·伍登', scene: '不敢承认"这题我不会"的场合' },
  { text: '完美不可企及，但追逐完美，我们能抓住卓越。', author: '文斯·隆巴迪', scene: '因追求"全对"而拖着不开工' },
  { text: '人类没有极限。', author: '埃鲁德·基普乔格', src: 'No human is limited', scene: '打破自己当天纪录的那一下' },
  { text: '纪律，即自由。', author: '埃鲁德·基普乔格', scene: '不想执行计划、想凭感觉来的早上' },
  { text: '人对自己能力的信念，深刻影响他如何行动、如何思考、如何感受。', author: '班杜拉', scene: '一开口就是"我不擅长这个"的时候' },
  { text: '习得性乐观，就是你不必被自己的念头和情绪牵着走。', author: '塞利格曼', scene: '情绪上来但流程照走的训练' },
  { text: '把自己作为方法。', author: '项飙', scene: '复盘自己的错题、时间分配、卡点' },
]

/** 中国古文 · 近代硬料（与上面国外批次交替轮播） */
export const QUOTES_CHINESE: MotivationQuote[] = [
  { text: '古之立大事者，不惟有超世之才，亦必有坚忍不拔之志。', author: '苏轼', src: '《晁错论》', scene: '拼到最后靠的不是聪明，是撑得住' },
  { text: '天下有大勇者，卒然临之而不惊，无故加之而不怒。', author: '苏轼', src: '《留侯论》', scene: '考场上撞见没见过的新题型' },
  { text: '世之奇伟、瑰怪，非常之观，常在于险远，而人之所罕至焉。', author: '王安石', src: '《游褒禅山记》', scene: '愿意去啃别人绕开的那道难题' },
  { text: '有为者辟若掘井，掘井九轫而不及泉，犹为弃井也。', author: '孟子', src: '《孟子·尽心上》', scene: '刷到一半就想换资料的那个念头' },
  { text: '锲而舍之，朽木不折；锲而不舍，金石可镂。', author: '荀子', src: '《荀子·劝学》', scene: '背诵手册要过第三遍的时候' },
  { text: '旧书不厌百回读，熟读深思子自知。', author: '苏轼', src: '《送安惇秀才失解西归》', scene: '二轮重刷同一条讲义' },
  { text: '纸上得来终觉浅，绝知此事要躬行。', author: '陆游', src: '《冬夜读书示子聿》', scene: '看答案看懂了≠自己写得出来' },
  { text: '持志如心痛，一心在痛上，岂有工夫说闲话、管闲事。', author: '王阳明', src: '《传习录》', scene: '一天里被杂事和手机切碎的那些段' },
  { text: '知是行之始，行是知之成。', author: '王阳明', src: '《传习录》', scene: '方法背得滚熟、题量却没上去' },
  { text: '志不立，天下无可成之事。', author: '王阳明', src: '《教条示龙场诸生》', scene: '当天开工前先把目标写成一句话' },
  { text: '破山中贼易，破心中贼难。', author: '王阳明', src: '《与杨仕德薛尚谦书》', scene: '同一个老毛病（不看清题就动笔）改了又犯' },
  { text: '险夷原不滞胸中，何异浮云过太空。', author: '王阳明', src: '《泛海》', scene: '一次模拟考的分数，别让它在心里过夜' },
  { text: '不满是向上的车轮。', author: '鲁迅', src: '《热风》', scene: '对了答案却还想"就这样算了"' },
  { text: '其实地上本没有路，走的人多了，也便成了路。', author: '鲁迅', src: '《故乡》', scene: '没人给过你这条路的做法，只能自己趟' },
  { text: '所谓万丈深渊，下去，也是前程万里。', author: '木心', src: '《素履之往》', scene: '觉得自己已经跌到谷底的那天' },
  { text: '发上等愿，结中等缘，享下等福；择高处立，寻平处住，向宽处行。', author: '左宗棠', src: '联语', scene: '定目标时敢往高看，做事时肯往实处落' },
  { text: '为往圣继绝学，为万世开太平。', author: '张载', src: '横渠四句', scene: '需要给这段苦日子接一个更大意义时' },
  { text: '独立之精神，自由之思想。', author: '陈寅恪', src: '《王国维纪念碑铭》', scene: '不被经验贴和别人的节奏裹着走' },
  { text: '一万年太久，只争朝夕。', author: '毛泽东', src: '《满江红·和郭沫若同志》', scene: '倒计时压到个位数的那几天' },
  { text: '世上无难事，只要肯登攀。', author: '毛泽东', src: '《水调歌头·重上井冈山》', scene: '面对一整章没碰过的空白' },
  { text: '女排精神不是赢得冠军，而是有时候明知道不会赢，也竭尽全力。', author: '郎平', scene: '知道这一科可能拉分，仍然练到底' },
  { text: '聪明出于勤奋，天才在于积累。', author: '华罗庚', scene: '羡慕别人反应快，其实是他算得多' },
]

/** 主题分组（今日一句卡按组导航用） */
export const QUOTE_GROUPS: { key: string; name: string; icon: string; items: MotivationQuote[] }[] = [
  { key: 'resilience', name: '韧性 · 扛住苦难', icon: '🪵', items: QUOTES_RESILIENCE },
  { key: 'focus', name: '专注 · 对付焦虑', icon: '🎯', items: QUOTES_FOCUS },
  { key: 'effort', name: '努力 · 刻意练习', icon: '⚒️', items: QUOTES_EFFORT },
  { key: 'confidence', name: '自信 · 立刻行动', icon: '🚩', items: QUOTES_CONFIDENCE },
  { key: 'chinese', name: '古文 · 近代硬料', icon: '📜', items: QUOTES_CHINESE },
]

/** 国外四组（按主题顺序） */
const FOREIGN_QUOTES: MotivationQuote[] = [
  ...QUOTES_RESILIENCE, ...QUOTES_FOCUS, ...QUOTES_EFFORT, ...QUOTES_CONFIDENCE,
]

/** 全库：已经做过中外交替，直接引用即可中西对照轮播 */
export const ALL_QUOTES: MotivationQuote[] = alternateWithChinese(FOREIGN_QUOTES)

/**
 * 中外交替：把一组国外名言与中国硬料穿插排列（foreign[0], cn[0], foreign[1], cn[1]…），
 * 轮播时中西对照出现，不会连着念一整串同一来源。
 */
export function alternateWithChinese(foreign: MotivationQuote[]): MotivationQuote[] {
  const out: MotivationQuote[] = []
  const n = Math.max(foreign.length, QUOTES_CHINESE.length)
  for (let i = 0; i < n; i++) {
    if (foreign[i]) out.push(foreign[i])
    if (QUOTES_CHINESE[i]) out.push(QUOTES_CHINESE[i])
  }
  return out
}

/** 今日一句：按当天日期确定性取样（同一天刷新不变，隔天自动换） */
export function quoteOfToday(pool: MotivationQuote[] = ALL_QUOTES): MotivationQuote {
  const now = new Date()
  const dayIdx = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000)
  const i = ((dayIdx % pool.length) + pool.length) % pool.length
  return pool[i]
}

/** 短标语（进度条/看板角落用）：全部取自上面名言的骨架，替代"越努力越幸运"类空话 */
export const SLOGANS: string[] = [
  '杀不死我的 · 使我更强',
  'No human is limited',
  '努力 · 算两次',
  '败得更好',
  '品格重于名声',
  '准备生自信',
  '追逐卓越',
  '今日胜于昨日',
  '不可战胜的夏天',
  '纪律即自由',
  '锲而不舍 · 金石可镂',
  '只争朝夕',
]

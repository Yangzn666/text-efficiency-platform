import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * 英语阅读记录数据引擎
 * - 按年份（2005-2026）记录每年 4 篇阅读（Text1-4）的完成情况
 * - 每篇记录：是否完成 + 正确数（0-5）+ 生词/长难句笔记
 * - 总进度：已完成篇数 / 88
 */

export interface PassageRecord {
  year: number
  text: number
  done: boolean
  /** 正确题数 0-5 */
  correct: number
  /** 生词/长难句笔记 */
  notes: string
}

export const START_YEAR = 2005
export const END_YEAR = 2026
export const TEXTS_PER_YEAR = 4
export const TOTAL_PASSAGES = (END_YEAR - START_YEAR + 1) * TEXTS_PER_YEAR

const STORAGE_KEY = 'english-reading-log-v1'

/**
 * 已完成篇目的种子数据：key = `${year}-${text}`，value = 已知正确题数。
 * 该映射同时驱动 seedCompletedPassages 的遍历范围，新做完一篇只需在此加一行。
 * 数值与 reading-questions.json 中的 userAnswer 保持一致。
 */
const SEEDED_CORRECT: Record<string, number> = {
  '2005-1': 1,
  '2005-2': 2,
  '2005-3': 3,
  '2005-4': 1,
  '2006-1': 2,
  '2006-2': 3,
  '2006-3': 5,
  '2006-4': 3,
  '2008-1': 3,
  '2008-2': 3,
  '2008-3': 2,
  '2008-4': 1,
  '2009-1': 2,
  '2009-2': 3,
  '2009-3': 4,
  '2009-4': 1,
  '2010-1': 2,
  '2010-2': 0,
  '2010-3': 1,
  '2010-4': 1,
  '2011-1': 3,
  '2011-2': 3,
  '2011-3': 3,
  '2011-4': 3,
  '2012-1': 4,
  '2012-2': 3,
  '2012-3': 3,
  '2012-4': 3,
  '2013-1': 5
}

/** 已知作答结果的篇目生词/长难句笔记（仅在用户未填写时注入） */
const SEEDED_NOTES: Record<string, string> = {
  '2006-4':
    'function as = 充当/起到…的作用（同义：serve as / act as）。' +
    '第5题错因：不认识 function as，无法解码 A 选项 Religion once functioned as a reminder of misery（宗教曾充当痛苦的提醒物），' +
    '转而误选 D（媒体倾向报道灾难死亡，与原文“媒体只贩卖快乐”相反）。' +
    '补救信号：选项中的时间副词 once / used to / now 常是定位钥匙，本文全程是“过去宗教提醒痛苦 vs 现在广告贩卖幸福”的二元对照。',
  '2008-1':
    '第1题错因（形近词误读）：vulnerable（易受伤害的）看成 voluntary（自愿的），误解文意为“女性乐于承受压力”，直接排除了正确答案 A。' +
    '第3题错因（原词照抄陷阱）：domestic 误读为“动态的”；且看到原文出现该词就直接选含原词的选项，未识别出正确答案 C 是同义替换。' +
    '共性教训：① 选项词汇要逐字确认再排除；② 原文照抄的选项先怀疑，换了说法的选项先相信。',
  '2008-2':
    '3/5。第2题误选 D：原文是 the OECD report makes heavy reading for publishers who have made handsome profits（报告读来令获利丰厚的出版商心情沉重），正确项 C 的 upsets 即 makes heavy reading 的同义替换；D“对科研大有裨益”属常识代入，原文无据。' +
    '第3题误选 C：C“突显科学知识的关键作用”取自3段1句 the value of knowledge，但题干问 online publication 为何重要，答案在2段2句——网络使人直接查阅科研成果（对照1段5句过去必须订阅刊物）= easier access。' +
    '本篇两错属新病灶“宏大叙事偏好”：选了听起来更有道理的大话，而正确答案永远是原文具体某句的精确改写。' +
    '生词：make heavy reading for sb = 令某人读来心情沉重；handsome profits = 丰厚利润（handsome 兼指数量可观，a handsome sum）；access to = 获取途径。',
  '2008-3':
    '限时8分钟，2/5。第1题（例证题）误选 D：Wilt Chamberlain 一例是为说明“NBA球员身高的变化”，例子本身的成就/人气信息一律不是答案。' +
    '第2题误选 A：原文是 genetic architecture（基因结构）限制身高，选项 Genetic modification（基因改变）属偷换概念；真正推动 body growth 的是饮食与健康改善 = living standards。' +
    '第5题（主旨）误选 B：末段“可预测”是因为身高保持不变，B 把结论扩大成“越来越可预测”，属过度推理。' +
    '教训：8分钟做完意味着没有回文定位复查，例证题与主旨题都必须回读例子前后各一句。',
  '2008-4':
    '限时12分钟，1/5（历史最低）。第1题（例证题）误选 B：开头华盛顿换牙轶事是为引出“他不为人知的另一面”，而非论证奴隶制残酷。' +
    '第2题误选 D：正确项 B 是 the fragile nature of the country’s infancy 的同义转述（early days ↔ infancy，delicate ↔ fragile），D 把“建国初期”泛化成“整个美国历史”。' +
    '第4题误选 C：Owning slaves was “like having a large bank account” 是比喻，字面理解成“真有巨额存款”即中陷阱。' +
    '第5题误选 A：原文有 moral 一词，但题干问的是解放奴隶的起因，答案在“看到黑人在独立战争中的英勇表现”= military experience。' +
    '本篇7道错题中5道的错误选项都含原文出现过的原词，与 2008-1 的 domestic 同一陷阱：原词照抄先怀疑，同义替换先相信。',
  '2009-1':
    '2/5《习惯的机制》。第1题（态度）误选 B familiar，根因是把 unreflecting 误读成“无意识”，进而把全文主旨带偏成“习惯在无意识中形成”；' +
    '实际 un-=不 + reflect=反思，unreflecting herd=不思考的羊群=被习惯牵着的机器→mechanical（C）；familiar 只是作者上句描写 routine 的原词。' +
    '真正主旨与之相反：2-3段说我们可以 consciously 培养新习惯以促进创新，“无意识”是旧的负面看法而非论点。口诀：会反思的是人，不反思的是机器。' +
    '第2题（细节）误选 C traced：看到“大脑形成新分支”就过度推理成“可追踪习惯变化”；新分支=路可以修（guided，同3段1句 direct），不是路可以被看见（traced）。口诀：长新枝=能修新路，不是能看旧路。' +
    '第4题险错：把 The first thing needed for innovation is a fascination with wonder 误译成“完美主义的思考”；fascination=着迷、wonder=惊奇，合起来=对世界保持好奇。口诀：fascinate 迷住 + wonder 哇! = 好奇心。' +
    '第5题（标主旨实为观点推理）误选 B：题干 comment=看法/评语；B 对原文 fosters commonness 加 no longer 反转方向；正确项 A prevents new habits from being formed 中 formed=养成/形成（form），不是格式化（format），=阻止思维固化。口诀：选项见 no longer 回原文核动词方向；being formed 想“养成”别想“格式化”。' +
    '共性：原词照抄（familiar）+ 过度推理（新分支→可追踪）+ 否定反转（no longer）三病同现。',
  '2009-2':
    '3/5《DNA与父亲身份》。第1题（推理）误选 C successful promotion：1-2段只说药妆店$30可买、免处方、6万人购买=easy availability（A）；' +
    '“促销成功”是脑补原文没写的营销动作，与T1第2题“新分支→可追踪”同病——连篇两现过度推理，升级为首要病灶。口诀：shows类题答案=原文直说的，要推两步的都是陷阱。' +
    '根因补录：把 PTK 与 DNA 检测看成两个并列事物（实际 PTK 是 DNA 检测中最受欢迎的一种，例证—类别关系，信号词 Among the most popular）；且把 promotion 读成“推广成功”——6万人销量是结果不是营销手段，$30+药妆店+免处方三件套全指向容易买到。口诀：三件套=容易买，销量=结果非推广。' +
    '第3题（态度）误选 A trace distant ancestors：5段怀疑论者质疑的是 hawked precision is false=达不到其宣称的精确度（D：claimed=hawked、accuracy=precision、fails to=false，完整同义替换链）；' +
    'A 把原文“只揭示一两个祖先”（覆盖有限）曲解成“追不到遥远祖先”，偷换概念。口诀：怀疑论者质疑“准不准”，不是“追多远”；题干有立场词就锁立场句做核心词替换。' +
    '根因补录：没认出 hawked 是 hawk（鹰）的动词义=叫卖/兜售，误读成“盘旋”，同义链 claimed=hawked 断裂→只能抓 5段表面词→掉进 A 陷阱。口诀：鹰在街头叫卖=叫卖（hawk/hawker 小贩）；熟词字面讲不通，立刻想它的动词义/僻义。' +
    '好消息：细节题2/2全对、主旨题回正、T1的否定反转未复发。',
  '2009-3':
    '4/5《穷国教育误读》，T1 2→T2 3→T3 4 三连涨。唯一错Q2（细节）选 A challenges economists and politicians：用1段1句原词 economists and politicians 拼贴（原文中他们是“误解者”，非“被挑战者”）；' +
    '正确 B takes efforts of generations = 段3句 would require two or three generations 的同义替换。本题四个选项全用1段原词设干扰（economists and politicians/priorities/enough people），教科书级原词照抄题。' +
    '口诀：选项含原文连续原词先怀疑，正确答案多半换说法（generations ↔ two or three generations）；stated类题=找直说句+同义替换。' +
    '根因补录：把1段3句长句的谓语 would require two or three generations 挂到了中间目的状语 to improve economic performance 上，误读成“经济提升需要三代人”；真正主语是 building…and putting… 两个并列动名词，主谓间隔20余词，读快就近抓取名词。' +
    '口诀：长句先找动词再问“谁干的”，回头跳过 to+动词 短语找动名词主语；见 to improve 先默念“为了提升”，它永远不是主语。',
  '2009-4':
    '1/5《清教徒的思想遗产》，历史级最难篇（抽象学术名词密集+思想史文体），属篇目难度离群非能力回落，09阅读曲线T1-3（2→3→4）仍是真上升。' +
    '四错=四个已知陷阱：Q1选A（intellectual被换成political，偷换概念；全文讲知识/精神生活非政治；正B=importance attached to intellectual pursuits↔intellectual interests encouraged）；' +
    'Q2选D（But转折前的“标准观点”theological innovations，作者观点在But后=carriers of European culture=B，转折后才是答案）；' +
    'Q3选A（famous for writings过度推理，原文只说published广泛+readers众；正D=atmosphere of intellectual earnestness↔created intellectual atmosphere）；' +
    'Q5选B（illusory prospect只对应裁缝John Dane，以偏概全；正C=不同知识背景=高知精英(3段)+未受教育多数(4段)）。' +
    '真正瓶颈=抽象名词密度非逻辑。篇章骨架：1段新英格兰重视知识追求→2段作者观点(转折后)清教徒是欧洲文化承载者适应新大陆→3段高知精英(Winthrop/90牧师)著述广创求知氛围→4段未受教育多数(工匠农民裁缝Dane)少记录→综合:移民知识背景各异。' +
    '生词：preoccupations念念不忘之事/theo-logy神学/civility and virtuosity文明与德行/earnestness诚挚求知/illusory虚幻的(illusion幻觉)/Old World旧大陆New World新大陆。本篇精读性价比最高，建议带词重读。' +
    'settle两张脸(熟词僻义典型):名词settler=定居者/移民(settle定居+-er人,全文核心词,Q5问的就是early settlers);动词settle=决定/解决(settle his fate决定命运、settle a dispute解决争端,非“定居”),核心意象=从悬到定。',
  '2010-1':
    '2/5《艺术报道的衰落》（2010=英一史上最难年）。全文主旨：英语报纸的艺术评论在衰退（昔日繁荣→今日消亡），用户其实已抓到（“报纸以前很多批评现在少了”）。' +
    'Q1（推理）选C正B：B“英语报刊过去刊载更多艺术评论”是1段decline（衰退）的逆否推理；A把decline（衰退）偷换成disappeared（消失）；C无中生有。推理题“感觉都不对”时先找“原文句的反向改写”。' +
    'Q2（细节）选B正A：定位句unfocused（内容包罗万象）=A free themes；用户自述“没注意unfocused”；B casual style是反向干扰——同段Theirs was a serious business（严肃事业）正相反。口诀：un(不)+focused(聚焦)=主题自由；见serious排除casual。' +
    'Q5（主旨）选D正B：D Prominent Critics是“以偏概全”（卡达斯仅4段论据）；用户自述“critics出现多次以为是主旨”——正中“高频词=主旨”陷阱；正B Lost Horizon=消亡的艺术评论之喻。铁律：词在文中出现频次≠主旨，论据才高频，论点藏在论据背后。',
  '2010-2':
    '0/5《商业方法专利之争》（最难年最难篇，词汇墙是根因）。根因：patent=专利不认识，全文主题business-method patents崩塌。口诀：patent=专利，pat(开)+ent=政府“公开”授予的独占文书；patent leather漆皮(表面发亮)。' +
    'Q1（推理）选D正C：题干recently是钥匙，C“授予可能受限”=原文Now…scale back+broad review；D“授权争议”是“10年前授权以来”的旧事，时间错位答非所问。铁律：题干时间词是闸门，答案必须对齐它。' +
    'Q2（细节）选B正D：B“大额商业交易”中了deal一词多义——原文a very big deal=事关重大，非商业交易；D“可能改变法律惯例”=has the potential to eliminate an entire class of patents同义。口诀：big deal=要紧事/大人物(口语)，不是大买卖；deal僻义再现（同domestic/hawked/settle）。' +
    'Q3（词义）选D正C：about-face=军队“向后转”=180度大转弯=态度改变；3段逻辑=法院1998批准商业方法专利→如今要限制=about-face；D“尊严”无中生有。口诀：about(转)+face(脸)=转过脸=态度大转弯。' +
    'Q4（细节）选A正B：用户自述“法律元素出现多次选A”，但A“不受法律挑战”与原文（满是挑战）相反=反向干扰；B“常无必要授予”=5段“太多显而易见的发明被授予专利”。高频词≠答案，看意思方向对不对。' +
    'Q5（主旨）选C正A：C“一个法律案件”以偏概全（Bilski案仅论据）；A“ looming threat”=全文讲专利面临限制。又是“出现多次就选”。' +
    '全篇病灶：Q1时间词、Q2/Q3熟词僻义（big deal/about-face）、Q4/Q5“高频词=答案”反向或以偏概全。跨篇铁律：选项高频词/论据多是例子不是答案，论点与正确答案常是抽象同义改写。',
  '2010-3':
    '1/5《社会流行风潮》(Gladwell《引爆点》/influentials话题)。主旨:社会流行潮不是靠少数“有影响力的人”推动,而是靠“一大批容易被影响的人”(末段critical mass of easily influenced people)。' +
    'Q1(例证目的)选C正B:开头引《引爆点》的作用=引出要讨论的话题(influentials在思想传播中的作用);C用intuitively偷换成“人们的直觉反应”。例证/引用作用题问“它服务哪个话题”。' +
    'Q2(推理)选B正D:定位句plausible-sounding BUT largely untested(听着有理但未经检验)→D需确凿证据;B“has helped explain”过于肯定,原文seems to explain是存疑语气。语气词but/seems/untested就是答案。' +
    'Q3(推理)选C正A:研究者观察=influentials并不与很多人互动→影响力靠社交连锁传递(A influence goes with social interactions);C“更多渠道”无中生有过度推理。' +
    'Q5(细节)选A正C:末段critical mass of easily influenced people→C readiness to be influenced(乐于被影响);A eagerness to be accepted(渴望被接受)无中生有,原文无be accepted。' +
    '用户自我诊断到位:“不能完全看懂文章,要靠方法+选项求同存异”。本篇核心欠缺=四步思考路径未走:定位句→识别语气词→同义替换匹配→排除无中生有/过度推理。',
  '2010-4':
    '1/5《会计准则与银行博弈》(FASB/IASB 公允价值),2010=英一史上最难年,本篇金融术语密集属词汇+背景双墙。正确 ADCBD,你 DACDB,仅 Q3(推理)对。' +
    'Q1(细节)选D正A:D“re-evaluate”无中生有;A=被迫遵循不利的资产评估规则(首段末句 value...at the price a third party would pay)。' +
    'Q2(篇章结构)选A正D:A“管理作用削弱”与原文 enhance the use of judgment by management 反向;D“独立性削弱”=第二段 independence...being compromised。' +
    'Q4(细节)选D正B:on the wrong planet=账户 vastly overvalued assets→B“夸大资产真实价值”;D“否认人账损失”方向相反。' +
    'Q5(态度)选B正D:作者对准则制定者是同情/支持(银行与制定者对立、作者挺制定者),非怀疑。' +
    '此篇与 T1-T3 共同构成 2010 谷底(全年阅读 4/20),属难度离群非能力回落。',
  '2011-1':
    '3/5。Q1(态度观点)选B正C:acclaim误当“宣布”、received误当“被收回”,实则 received acclaim=广受好评;acclaim=ac(加强)+claim(喊)→大家一起喊好→称赞。' +
    'Q4(推理判断)选A正B:inferior方向记反,inferior=更差的(“劣”字辈,in-向下),superior=更好的;记“inferior劣、superior优”,褒贬方向永不反。' +
    '本篇病灶=词汇,逻辑与定位无碍。',
  '2011-2':
    '3/5。Q2(细节)选C正D:senior误当“年老”(此处=级别高的,senior management高管),board=董事会不认识(board meeting董事会会议),被第二段末句带去选C。' +
    'Q5(推理)选A正C:一句俗语没背过,误判成陷阱而排除正确项;熟词僻义/俗语是考研重灾区,平时按“字面讲不通就想僻义”处理。' +
    '铁律:senior一词多义先想“资深/级别高”,board先想“董事会”。',
  '2011-3':
    '3/5。Q1(细节)选C正D:passionate不认识=充满激情的、热爱的(passion激情+ate)。' +
    'Q5(主旨大意)选B正A:用户自己悟出“B的面太小、A的面更大更像主旨”——这正是颉斌斌「范围定律」(两选项相近时选范围更大的),方法论意识觉醒的证据,继续强化。',
  '2011-4':
    '3/5。Q1(细节)选D正C:D选项理解有误(误当“延迟享受”,实为“持续的汇报”),自述做太快;细节题回读定位句再选,别凭第一印象。' +
    'Q2(推理)选C正D:主旨理解偏差(误读成“名人育儿被过度宣传、令人压力大”),DC间犹豫很久选错;推理题答案=原文近义改写,先锁主旨方向再排除带情绪的过度引申。',
  '2012-1':
    '4/5。Q1(细节)选A正D。本篇近满分,是 2006 T3 以来最好的一篇。',
  '2012-2':
    '3/5。Q1(推理)选B正C;Q5(细节)选C正A。两错均在“原文同义改写”未对上,需回定位句逐字比对选项。',
  '2012-3':
    '3/5《科学的发现与分享》。Q1(细节)选B正A:ambiguous 误当“夸大”(=exaggerated/overstate),实为“模棱两可的、含糊不清的”,首段特征直接读反→选错。口诀:ambi-=双/两边→两种说法都成立=含糊不确定;“夸大”是另一个词。' +
    'Q2(推理)选C正B:自述“看到个人智慧集合形成科学发现就秒选C”,属想当然/常识代入;再想一步应锁全文“分享(sharing)”主旨=B。铁律:推理题秒选的多半是陷阱,答案=原文同义改写而非脑补。',
  '2012-4':
    '3/5。Q3(推理)选C正B;Q4(推理)选B正C——两道推理题都把方向选反。' +
    '跨篇信号:2012 五道错题里 3 道是推理判断,病灶已从 2011 的“词汇”转向“推理题秒选/想当然”。颉斌斌铁律:推理题不要推理,答案永远是原文某句的同义改写,要你想两步的选项先怀疑。',
  '2013-1':
    '5/5 全对🎉——自 2006 T3 以来的首个满分篇,里程碑。与 2011、2012 的“秒选/想当然”相比,本篇零失误说明“回原文逐字比对、不秒选”的纪律开始落地。保持这个手感往后刷近年。'
}

function keyOf(year: number, text: number) {
  return `${year}-${text}`
}

export const useReadingLogStore = defineStore('readingLog', () => {
  /** key: `${year}-${text}` */
  const records = ref<Record<string, PassageRecord>>({})

  function load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) records.value = JSON.parse(saved)
    } catch {
      /* 忽略损坏数据 */
    }
    seedCompletedPassages()
  }

  /** 预置已完成的真题记录（遍历范围由 SEEDED_CORRECT 的 key 决定，支持跨年不连续篇目） */
  function seedCompletedPassages() {
    let changed = false
    for (const k of Object.keys(SEEDED_CORRECT)) {
      const [year, text] = k.split('-').map(Number)
      const seededCorrect = SEEDED_CORRECT[k]
      if (!records.value[k]) {
        records.value[k] = { year, text, done: true, correct: seededCorrect, notes: SEEDED_NOTES[k] || '' }
        changed = true
        continue
      }
      const rec = records.value[k]
      if (!rec.done) {
        rec.done = true
        changed = true
      }
      // 仅在用户尚未手动填写时同步，避免覆盖手工记录
      if (seededCorrect > 0 && rec.correct === 0) {
        rec.correct = seededCorrect
        changed = true
      }
      const seededNotes = SEEDED_NOTES[k]
      if (seededNotes && !rec.notes) {
        rec.notes = seededNotes
        changed = true
      }
    }
    if (changed) save()
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records.value))
  }

  function get(year: number, text: number): PassageRecord {
    const k = keyOf(year, text)
    if (!records.value[k]) {
      records.value[k] = { year, text, done: false, correct: 0, notes: '' }
    }
    return records.value[k]
  }

  function update(year: number, text: number, patch: Partial<PassageRecord>) {
    const rec = get(year, text)
    Object.assign(rec, patch)
    save()
  }

  const years = computed(() => {
    const list: number[] = []
    for (let y = END_YEAR; y >= START_YEAR; y--) list.push(y)
    return list
  })

  function yearStats(year: number) {
    let done = 0
    let totalCorrect = 0
    let answered = 0
    for (let t = 1; t <= TEXTS_PER_YEAR; t++) {
      const k = keyOf(year, t)
      const rec = records.value[k]
      if (rec && rec.done) {
        done++
        totalCorrect += rec.correct
        answered += 5
      }
    }
    return {
      done,
      accuracy: answered ? Math.round((totalCorrect / answered) * 100) : 0
    }
  }

  const overall = computed(() => {
    let done = 0
    let totalCorrect = 0
    let answered = 0
    Object.values(records.value).forEach(rec => {
      if (rec.done) {
        done++
        totalCorrect += rec.correct
        answered += 5
      }
    })
    return {
      done,
      total: TOTAL_PASSAGES,
      accuracy: answered ? Math.round((totalCorrect / answered) * 100) : 0
    }
  })

  load()

  return { records, years, get, update, yearStats, overall }
})

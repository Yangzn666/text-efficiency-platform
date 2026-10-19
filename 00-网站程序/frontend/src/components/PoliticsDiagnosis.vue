<script setup lang="ts">
import { ref, computed } from 'vue'

/* ══════════════════════════════════════════════════════════════
   政治错因诊断 · 数据层
   来源：肖1000 马原+史纲 选择题错题 317 题（单选127 / 多选190）
   错因结构由「我的答案 vs 正确答案」客观推导，非主观臆断
   ══════════════════════════════════════════════════════════════ */

// 重点字词标红加粗：把「」/“”里的关键术语 + 绝对化陷阱词渲染成红色粗体
const HL_WORDS = ['唯一', '完全', '彻底', '永远', '任何', '取决于', '不再是', '只要']
function hl(s?: string): string {
  if (!s) return ''
  let t = String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const pool: string[] = []
  // 1) 先抽出「」与“”里的术语，用占位符保护，避免被后面的陷阱词二次切割
  t = t.replace(/「([^」]+)」|“([^”]+)”/g, (_m, a, b) => {
    pool.push(a ?? b)
    return `\u0000${pool.length - 1}\u0000`
  })
  // 2) 绝对化 / 帽子陷阱词单独标红
  for (const w of HL_WORDS) t = t.split(w).join(`\u0001${w}\u0002`)
  t = t.replace(/\u0001([^\u0002]*)\u0002/g, '<b class="hl">$1</b>')
  // 3) 回填术语（保留「」样式）
  t = t.replace(/\u0000(\d+)\u0000/g, (_m, i) => `<b class="hl">「${pool[+i]}」</b>`)
  return t
}

const TOTAL = 317
const SUBJECT = { my: 192, sg: 125 }
const TYPE = { single: 127, multi: 190 }

// 五大错因桶（按占比降序，附真实错题示例）
const buckets = [
  { key: 'over', label: '多选 · 没认出干扰项', count: 90, pct: 28.4, color: 'coral',
    diag: '多选题里那个「看着对、实则绝对化 / 偷换概念 / 张冠李戴」的错项没揪出来，全选了。',
    cure: '做完先问「有没有一个选项话说太满 / 换了主语」，宁可回读题干圈关键词。',
    eg: '例：马克思主义当代价值题，你把「现成方案」也选了（导论多选 #1）。' },
  { key: 'pair', label: '单选 · 概念对偶混淆', count: 70, pct: 22.1, color: 'gold',
    diag: '马原政经 & 哲学的成对概念分不清：具体↔抽象劳动、绝对↔相对超额剩余价值、不变可变资本…',
    cure: '给每对概念写「一句话判据」，靠判据而非语感作答（见下方补丁卡）。',
    eg: '例：量的考察与质的区分，谁是谁的前提，说反了（一章多选 #31）。' },
  { key: 'under', label: '多选 · 漏选（记不全）', count: 61, pct: 19.2, color: 'blue',
    diag: '知识点掌握不完整，正确的选项不敢选，导致少选丢分。',
    cure: '把「四大 / 三全 / 三个有利于」这类成套结论做成清单，先补全再判断。',
    eg: '例：中共三大政治口号「抗战、团结、进步」只记住两个（六章多选 #9）。' },
  { key: 'mem', label: '单选 · 史纲记忆不精确', count: 57, pct: 18.0, color: 'navy',
    diag: '史纲的时间、会议、人物、著作「差不多」就选，被相近项带偏。',
    cure: '用时间轴 + 会议速查表钉死「谁 / 何时 / 提了什么」，见下方混淆速查。',
    eg: '例：九一八=局部抗战序幕 / 卢沟桥=全民族抗战，反复错（六章单选）。' },
  { key: 'both', label: '多选 · 又多又漏（边界模糊）', count: 39, pct: 12.3, color: 'grey',
    diag: '该考点整体框架没建立起来，选多也选漏。',
    cure: '回炉该节视频/思维导图，先搭框架再刷题，别急着纠错选项。',
    eg: '例：辛亥革命"成功面/失败面"两面，既漏选又多选（三章多选）。' },
]

// 章节错题热力（降序）
const heat = [
  { label: '马原·第四章 政治经济学', n: 73, s: 'my' },
  { label: '马原·第五章 垄断资本主义', n: 29, s: 'my' },
  { label: '马原·第二章 认识论真理价值', n: 27, s: 'my' },
  { label: '史纲·第六章 抗日战争', n: 26, s: 'sg' },
  { label: '马原·第三章 唯物史观', n: 25, s: 'my' },
  { label: '马原·第一章 唯物论辩证法', n: 22, s: 'my' },
  { label: '史纲·第四章 建党与大革命', n: 18, s: 'sg' },
  { label: '史纲·第八章 新中国成立·社革', n: 18, s: 'sg' },
  { label: '史纲·第一章 近代开端·侵略', n: 14, s: 'sg' },
  { label: '史纲·第二章 洋务·维新', n: 11, s: 'sg' },
  { label: '史纲·第三章 辛亥革命', n: 11, s: 'sg' },
  { label: '史纲·第七章 解放战争', n: 11, s: 'sg' },
  { label: '马原·第六章 社会主义发展史', n: 10, s: 'my' },
  { label: '史纲·第五章 土地革命', n: 9, s: 'sg' },
  { label: '马原·导论 + 第七章', n: 7, s: 'my' },
  { label: '史纲·第九章 改革开放', n: 3, s: 'sg' },
  { label: '史纲·第十章 新时代', n: 4, s: 'sg' },
]
const heatMax = computed(() => Math.max(...heat.map(h => h.n)))

// 多选失分结构（用于 conic 甜甜圈）
const multiStruct = [
  { label: '没认出干扰项(多选)', n: 90, color: 'var(--dg-coral)' },
  { label: '漏选(记不全)', n: 61, color: 'var(--dg-blue)' },
  { label: '又多又漏', n: 39, color: 'var(--dg-grey)' },
]
const multiTotal = multiStruct.reduce((s, x) => s + x.n, 0)
const donut = computed(() => {
  let acc = 0
  const stops = multiStruct.map(x => {
    const from = (acc / multiTotal) * 100
    acc += x.n
    const to = (acc / multiTotal) * 100
    return `${x.color} ${from}% ${to}%`
  })
  return `conic-gradient(${stops.join(',')})`
})

/* ── 漏洞补丁卡（按考点聚类）── */
interface Patch {
  subject: 'my' | 'sg'
  title: string
  hot?: boolean
  wrong: string[]      // 你反复错的具体表现（含关联题号）
  fuzzy: string        // 模糊 / 遗忘的知识点
  patch: string[]      // 补丁：正确表述 / 判据 / 口诀
  traps?: string[]     // 陷阱词
}

const patches: Patch[] = [
  {
    subject: 'my', title: '政经 · 劳动二重性与商品二因素', hot: true,
    wrong: ['把「创造使用价值 / 转移旧价值」错记成抽象劳动（四章单选 Q5、Q6、Q21）', '个别劳动时间 ↔ 社会必要劳动时间混淆，越懒越有价值这类反例判不对（Q13）', '私人劳动和社会劳动是「基本矛盾/根源」还是「决定命运」分不清（Q10、Q21、Q25）'],
    fuzzy: '具体劳动 / 抽象劳动各干什么，价值量由谁决定，简单商品经济的基本矛盾是什么。',
    patch: ['具体劳动 → 创造使用价值 + 转移生产资料旧价值；抽象劳动 → 创造价值（新价值）。二重劳动决定二因素。', '价值量由「社会必要劳动时间」决定，与个别劳动时间无关；个别 < 社会 → 竞争占优、得超额剩余价值。', '私人劳动 ↔ 社会劳动的矛盾 = 以私有制为基础商品经济的「基本矛盾 / 一切矛盾的根源」。', '口诀：质看具体、量看抽象；使用价值认具体、价值认抽象。'],
    traps: ['「劳动是一切财富的唯一源泉」→ 错（自然也是使用价值源泉）', '「价值寓于使用价值」别说反'],
  },
  {
    subject: 'my', title: '政经 · 剩余价值家族辨析', hot: true,
    wrong: ['绝对 / 相对 / 超额剩余价值互相套错（Q42、Q43、Q51、Q25、Q26）', '不变资本↔可变资本、固定↔流动资本混用（Q47、Q49、Q23）', '资本有机构成、生产价格、利润平均化的「依据/结果」记串（Q48、Q60、Q61）'],
    fuzzy: '四种剩余价值、两种资本划分、有机构成、生产价格的定义与因果链。',
    patch: ['绝对剩余价值 = 延长工作日 / 提高劳动强度；相对剩余价值 = 缩短必要劳动时间（全社会劳动生产率提高）；超额剩余价值 = 个别企业率先提效（暂时）。相对剩余价值是各资本家追逐超额剩余价值的结果。', '不变资本 c（生产资料，转移价值）↔ 可变资本 v（劳动力，创造剩余价值）：划分依据 = 在剩余价值生产中的作用不同。固定 / 流动资本划分依据 = 价值周转方式不同，别混。', '资本有机构成 = c : v（由技术构成决定并反映其变化的价值构成），提高是趋势 → 相对过剩人口。', '生产价格 = 成本价格 + 平均利润；平均利润 = 预付总资本 × 平均利润率；利润平均化是「部门之间」竞争的结果（部门内竞争形成市场价值）。'],
    traps: ['「技术/科学是独立的剩余价值源泉」→ 错，活劳动才是唯一源泉', '「不变资本就是固定资本」→ 错'],
  },
  {
    subject: 'my', title: '认识论 · 实践与认识的四个定位',
    wrong: ['「实践是动力 / 来源 / 目的 / 检验标准」四选一选错（二章单选 Q7、Q8）', '认识的反复性无限性、两次飞跃谁更重要判断错（多选 Q10、Q14）', '真理与价值的关系、价值评价有无对错搞反（Q23、多选 Q16、Q25、Q26）'],
    fuzzy: '实践决定认识的四个维度分别对应什么题干；真理一元 vs 价值多元。',
    patch: ['实践是认识的来源、动力、目的、检验真理的唯一标准。题干强调「因为要解决 X 才去研究」→ 动力；「做没做成来验证」→ 检验标准；「最终要落地」→ 目的。', '第一次飞跃 感性→理性；第二次飞跃 理性→实践（更重要，因为检验并实现认识）。', '真理：客观的、一元的（对同一确定对象的正确认识只有一个）、绝对性与相对性统一。价值：多元的、有主体性，但价值评价仍有科学与非科学、正确与错误之分（不能说「没有对错」）。', '自由 = 对必然的认识 + 对客观世界的改造；不以规律为条件的「绝对自由」是幻想。'],
    traps: ['「事物的性质取决于观察角度」→ 主观唯心，错', '「认识总是超前于实践 / 真理任何条件都能变谬误」→ 绝对化，错'],
  },
  {
    subject: 'my', title: '唯物论 · 唯心主义两型 & 辩证法范畴',
    wrong: ['主观唯心 vs 客观唯心判据不清，「物是绝对观念的外化」当成主观唯心（一章多选 Q1）', '联系的客观性/普遍性/条件性选错（单选 Q16、Q18）', '矛盾同一性/斗争性、量变质变、否定之否定的适用判断错（多选 Q22、Q26、Q33、Q36、Q45）'],
    fuzzy: '两大唯心型的判据、辩证法各对偶范畴的边界。',
    patch: ['主观唯心 = 将「我」的主观精神（心 / 感觉 / 存在即被感知 / 万物皆备于我）当本原；客观唯心 = 将独立于人的「客观精神」（绝对观念 / 理 / 天命 / 理念）当本原。判据：本原带不带「我」。', '联系四性：客观性（不以人意志转移，"喜鹊叫喜"违背它）、普遍性、多样性、条件性。', '矛盾：同一性（相互依存、相互贯通与转化）与斗争性；斗争性寓于同一性之中。主要矛盾（决定全局、一个）↔ 矛盾主要方面（决定事物性质、每对矛盾里都有），两点论与重点论统一。', '量变→度→质变；否定之否定 = 两次否定三个阶段、螺旋式上升（"团结—批评—团结""实践—认识—实践"）。'],
    traps: ['「斗争性是事物存在发展的前提」→ 颠倒，同一性才是', '「将发展永远控制在量变范围」→ 否认质变，错'],
  },
  {
    subject: 'my', title: '唯物史观 · 谁才是「决定力量」',
    wrong: ['把地理环境 / 人口因素 / 科技 当成「决定力量」（三章单选 Q3、Q17、多选 Q1、Q5）', '社会意识「总是起积极作用」这类绝对化没排除（多选 Q7）', '上层建筑「只要服务经济基础就进步」判断错（多选 Q15）'],
    fuzzy: '生产力 / 生产方式 / 地理环境 / 人口 各自地位；社会意识、上层建筑反作用的条件性。',
    patch: ['生产力 = 社会发展的最终决定力量、最活跃最根本的因素；生产方式（生产力+生产关系）= 社会存在和发展的基础及决定力量。地理环境、人口因素只是「重要条件」，起加速/延缓作用，非决定力量。', '社会存在决定社会意识；社会意识有相对独立性，最突出表现为能动反作用——正确意识促进、错误意识阻碍（不是「总是积极」）。', '经济基础决定上层建筑；上层建筑只有为「适合生产力发展的先进经济基础」服务时才推动社会进步（不是「只要服务就进步」）。', '人民群众是历史的创造者（唯物史观），个人作用受历史条件制约。'],
    traps: ['「科技决定对资源开发的深度广度」→ 夸大，实践/生产力才是', '「社会意识总是落后/总是积极」→ 绝对化'],
  },
  {
    subject: 'my', title: '垄断资本主义 · 特征与新变化',
    wrong: ['垄断四特征、金融寡头「经济/政治」两种控制手段记混（五章单选 Q1、Q5）', '垄断与竞争的关系、资本输出、国家垄断形式判断错（Q6、多选 Q1–Q5）'],
    fuzzy: '列宁帝国主义五特征、金融资本形成途径、二战后新变化。',
    patch: ['金融资本 = 工业垄断资本 + 银行垄断资本融合；形成途径：金融联系、资本参与、人事参与。金融寡头：经济上「参与制」，政治上「个人联合」。', '垄断不能消除竞争，反而使竞争更复杂（垄断组织内部、之间、与非垄断之间并存）。', '二战后新变化：劳资关系缓和（职工持股、终身雇佣）但不改变剥削；所有权与经营权分离（"资本家不资本、经营者不经营"）；福利国家；宏观调控。'],
    traps: ['「终身雇佣使劳动者成为资本家代理人」→ 错', '「垄断消除了竞争的经济条件」→ 错'],
  },
  {
    subject: 'my', title: '导论 · 著作时间线 & 马克思主义特征',
    wrong: ['1844 首次合作《神圣家族》错选《德意志意识形态》（导论单选 Q5）', '马克思主义鲜明特征「科学性与革命性的统一」选成「科学性实践性」（Q7）', '把马克思主义当「现成方案」的错项没排除（导论多选 Q1）'],
    fuzzy: '早期著作与事件对应、根本特征表述。',
    patch: ['1844《神圣家族》= 马恩首次合作；《德意志意识形态》= 首次系统阐述唯物史观；1848《共产党宣言》= 马克思主义公开问世的标志。', '马克思主义最鲜明的特征 = 科学性与革命性的统一（建立在实践基础上）。', '马克思主义是「认识工具 / 行动指南 / 科学真理」，但不是「指导革命的现成方案」——不提供具体答案。'],
  },
  {
    subject: 'sg', title: '近代开端 · 侵略与觉醒的「第一 / 节点」',
    wrong: ['最主要的矛盾在特定阶段的体现、瓜分狂潮时间点选错（一章单选 Q3、Q9）', '最早出现的新阶级（工人阶级）错选民族资产阶级（Q5）', '反侵略失败「最根本原因 = 社会制度腐败」错选经济技术落后（Q11）'],
    fuzzy: '一系列"最早 / 第一次 / 起点 / 标志"的精确归属。',
    patch: ['鸦片战争(1840) = 近代史起点、旧民主主义革命开端；中日甲午战争失败 → 瓜分狂潮 + 民族意识「普遍」觉醒（此前只是少数人朦胧觉醒）。', '中国近代最早出现的新阶级 = 工人阶级（先于资产阶级，诞生于外资企业）。', '近代反侵略斗争失败的根源：社会制度腐败（根本）+ 经济技术落后（重要）——问「最重要」答制度。', '「振兴中华」最早由孙中山提出；睁眼看世界第一人 = 林则徐。'],
    traps: ['「开始形成于第一次鸦片战争后」的普遍民族意识 → 错，甲午后'],
  },
  {
    subject: 'sg', title: '辛亥革命 · 性质、成败与局限',
    wrong: ['三民主义中「推翻清朝、建独立国家」属政治革命还是民族革命混淆（三章单选 Q3）', '《临时约法》性质、失败根本原因判断错（Q10、Q11）', '辛亥革命 vs 戊戌变法共同点、成功/失败两面多漏选（多选 Q8、Q9、Q10）'],
    fuzzy: '辛亥革命的历史地位、失败根源（主观/客观）、与维新的区别。',
    patch: ['《中华民国临时约法》= 中国历史上第一部资产阶级共和国性质的宪法，带革命性、民主性（否定了君主专制，非否定封建土地所有制）。', '失败根本原因：客观=半殖民地半封建下资本主义建国方案行不通；主观=资产阶级革命派的软弱性与妥协性（没提彻底反帝反封建纲领、没发动群众、没坚强政党）。', '成功：结束帝制、建立亚洲第一个共和国、思想解放；失败：没改变半社半封性质、没完成两大历史任务。'],
    traps: ['「临时约法否定封建土地所有制」→ 错', '「点亮民族复兴灯塔」是五四/建党意义，非辛亥'],
  },
  {
    subject: 'sg', title: '建党与大革命 · 一大二大四大 + 失败原因',
    wrong: ['一大中心任务「组织工人」错选「研究宣传马克思主义」（四章单选 Q12）', '二大「民主革命纲领 / 第一部党章 / 统一战线」等"第一"漏选（多选 Q14、Q15）', '大革命失败原因、中共的历史贡献多漏选（多选 Q20、Q21、Q22）'],
    fuzzy: '中共早期各大会的关键结论、大革命国共两党各自角色。',
    patch: ['一大(1921)：定名、中心任务是组织工人阶级、没提民主革命纲领。二大(1922)：第一次提出反帝反封建民主革命纲领、第一部《党章》、统一战线思想。四大(1925)：无产阶级领导权 + 工农联盟。', '第一次国共合作政治基础 = 新三民主义（联俄联共扶助农工）。', '大革命失败：客观=反革命力量强大(蒋汪叛变)+共产国际错误指导；主观=党幼年、不擅结合马列与实际、陈独秀右倾机会主义。'],
    traps: ['「中共是统一战线领导者」→ 大革命时期领导权在国民党右派手中，错'],
  },
  {
    subject: 'sg', title: '土地革命 · 三大会议 + 毛泽东著作',
    wrong: ['秋收起义后「支部建在连上」、古田会议「思想建党政治建军」记混（五章单选 Q6、Q7）', '《反对本本主义》的两个核心论断漏选（多选 Q4）', '八七会议「土地革命+武装反抗」总方针与 1927.7 政治局常委会决定混淆（多选 Q2）'],
    fuzzy: '三湾改编 / 古田 / 八七 各自贡献；关键著作的核心命题。',
    patch: ['三湾改编(1927.9) = 支部建在连上（党对军队领导的开端）；古田会议(1929.12) = 思想建党、政治建军；八七会议(1927.8.7) = 确定土地革命和武装反抗国民党反动派的总方针（"枪杆子里面出政权"）。', '《反对本本主义》(1930) = "没有调查，没有发言权" + "中国革命斗争的胜利要靠中国同志了解中国情况"（首次提出思想路线雏形）。', '革命能在白色恐怖下坚持发展的根本原因 = 紧紧依靠农民、进行土地革命。'],
    traps: ['「开始确立以毛泽东为代表的正确路线」= 遵义会议，非八七'],
  },
  {
    subject: 'sg', title: '抗日战争 · 会议 / 战线 / 政策（重灾区）',
    wrong: ['九一八=序幕/局部抗战 vs 卢沟桥=全民族抗战，反复错（六章单选 Q1、Q8）', '瓦窑堡(统一战线策略) ↔ 洛川(全面抗战路线)混淆（Q6、多选 Q2）', '统一战线策略总方针、三三制、减租减息、整风中心、七大意义多漏选（多选 Q8–Q15）'],
    fuzzy: '抗战各节点标志 + 中共一整套政策的精确表述。',
    patch: ['九一八(1931) = 揭开世界反法西斯战争序幕、中国局部抗战起点；卢沟桥/七七(1937.7) = 全民族抗战开始。', '瓦窑堡会议(1935.12) = 确立抗日民族统一战线策略方针；洛川会议(1937.8) = 制定全面抗战路线 + 《抗日救国十大纲领》。', '统一战线策略总方针 = 发展进步势力、争取中间势力、孤立顽固势力；对顽固派斗争「有理、有利、有节」。中间势力 = 民族资产阶级、开明绅士、地方实力派。', '三三制政权人员构成：共产党员、非党左派进步分子、中间派各约三分之一（开明绅士属中间派）。抗战时期土地政策 = 地主减租减息、农民交租交息。整风中心任务 = 反对主观主义以整顿学风。七大 = 毛泽东思想写入党章、确立为指导思想。'],
    traps: ['「实事求是思想路线全党确立」= 延安整风后，非瓦窑堡', '「抗日民族统一战线正式形成标志」= 国民党中央通讯社发表合作宣言 + 蒋介石谈话，非西安事变'],
  },
  {
    subject: 'sg', title: '解放战争 & 新中国 · 工作重心与主要任务',
    wrong: ['杨家沟会议、七届二中全会「工作重心由乡村→城市」记不清（七章单选/多选）', '新中国成立最初三年「民主革命遗留任务 + 社会主义革命」定位错（八章单选 Q3）', '社会主义革命和建设时期「主要任务」多选混淆（八章多选）'],
    fuzzy: '解放战争时期各会议 + 过渡时期总路线/主要任务。',
    patch: ['七届二中全会(1949 春) = 工作重心由乡村转移到城市、提出"两个务必"。', '新中国成立最初三年：完成民主革命遗留任务（土改、镇压反革命）同时开始社会主义革命（没收官僚资本、确立领导地位）。', '社会主义改造基本完成后，党面临的主要任务 = 在新的条件下保护和发展生产力。'],
    traps: ['「实现第二个百年奋斗目标新征程」是新时代(十八大后)表述，别安到建国初'],
  },
  {
    subject: 'sg', title: '改革开放 & 新时代 · 关键论断与提法',
    wrong: ['1979 邓小平《坚持四项基本原则》、1992 南方谈话「最主要内容」记不牢（九章）', '十八大=进入新时代、二十大中心任务、十四五主题等最新提法错（十章单选 Q1、Q3、多选 Q1、Q3）'],
    fuzzy: '改革开放几个标志性会议/谈话的核心命题 + 新时代最新政治提法。',
    patch: ['真理标准问题大讨论(1978) + 十一届三中全会 = 重新确立实事求是、改革开放开端。南方谈话(1992) 最主要 = 计划和市场都是经济手段、社会主义本质解放发展生产力。', '党的十八大以来 = 中国特色社会主义进入新时代；党的中心任务 = 团结带领全国各族人民全面建成社会主义现代化强国、实现第二个百年奋斗目标，以中国式现代化全面推进中华民族伟大复兴。', '从"一五"到"十四五"一以贯之的主题 = 把我国建设成为社会主义现代化国家。'],
    traps: ['「提供更为完善的制度保证…精神力量」= 改革开放和社会主义现代化建设时期？答：新时代中国特色社会主义的伟大成就'],
  },
]

// 多选专项 · 判断法
const multiTactics = [
  { name: '「多选」陷阱识别（对应 90 题失分）', color: 'coral',
    points: [
      '绝对化词：唯一 / 完全 / 彻底 / 永远 / 任何 / 都 / 取决于 / 消除 / 决定 —— 见到先扣分。',
      '偷换主语：把 A 会议的意义安到 B 会议头上（史纲高发）。',
      '因果颠倒 / 条件缺失：去掉限定词后命题才成立 → 原命题错。',
      '操作：先通读四个选项，把「最可疑」的那个单独回读题干，宁可漏不可滥。',
    ] },
  { name: '「漏选」补全（对应 61 题失分）', color: 'blue',
    points: [
      '成套结论先背全：三大法宝、三大作风、三大经济纲领、四个全面、两个务必…',
      '「四个特征 / 三性 / 两重性」这类数量词，选项数与题干数量对不上就是漏。',
      '拿不准的正确项：只要它不违背原理、不是绝对化，倾向选上（多选少选同样丢分）。',
    ] },
  { name: '「帽子题」定位法', color: 'gold',
    points: [
      '题干问「根本 / 最 / 第一 / 标志 / 前提」→ 答案往往是那个层级最高的固定表述。',
      '问「根源 / 根本原因」多为制度、生产力、基本矛盾；问「前提 / 基础」多为某具体条件。',
      '同一史实不同帽子（性质 / 意义 / 影响 / 标志）分开记，别互相顶替。',
    ] },
]

/* ── 多选「找茬」演练（由你 76 道纯多选错题里挑出的高频陷阱项）── */
interface Drill {
  id: string; topic: string; subject: 'my' | 'sg'
  stem: string; opts: { k: string; t: string }[]
  ans: string; trap: string; why: string
}
const drills: Drill[] = [
  { id: 'd1', topic: '导论 · 马克思主义当代价值', subject: 'my', ans: 'ABC', trap: 'D',
    stem: '马克思主义的当代价值在于，它是',
    opts: [
      { k: 'A', t: '观察当代世界变化的认识工具' },
      { k: 'B', t: '指引当代中国发展的行动指南' },
      { k: 'C', t: '引领人类社会进步的科学真理' },
      { k: 'D', t: '指导革命、建设、改革的现成方案' },
    ],
    why: '「现成方案」帽子扣太大——马克思主义给的是立场、观点、方法，不提供现成答案。典型"看似对实则夸大"。' },
  { id: 'd2', topic: '一章 · 主观唯心主义', subject: 'my', ans: 'ABD', trap: 'C',
    stem: '下列命题中，属于主观唯心主义观点的有',
    opts: [
      { k: 'A', t: '心外无物' },
      { k: 'B', t: '存在就是被感知' },
      { k: 'C', t: '物是绝对观念的外化' },
      { k: 'D', t: '万物皆备于我' },
    ],
    why: '「绝对观念」是黑格尔的客观精神，C 属客观唯心，被张冠李戴塞进主观唯心。判据：本原带不带"我"。' },
  { id: 'd3', topic: '一章 · 量与质的关系', subject: 'my', ans: 'AB', trap: 'D',
    stem: '恩格斯说，任何一门科学的真正完善在于数学工具的广泛应用。这说明',
    opts: [
      { k: 'A', t: '只有精确地认识量，才能更深刻地把握质' },
      { k: 'B', t: '认识事物的量是认识的深化和精确化' },
      { k: 'C', t: '量和事物的存在是直接同一的' },
      { k: 'D', t: '考察量是认识质的前提，区分质是认识量的深化' },
    ],
    why: 'D 把关系说反——应是「区分质是认识量的前提、考察量才是深化精确化」，前提与深化颠倒。' },
  { id: 'd4', topic: '二章 · 设施农业突破自然条件', subject: 'my', ans: 'ABC', trap: 'D',
    stem: '"向设施农业要食物"逐步成为现实表明',
    opts: [
      { k: 'A', t: '人类智慧和能力的发展决定着对物质资源开发的深度和广度' },
      { k: 'B', t: '实践的发展是范围扩大、程度加深、效果提升的过程' },
      { k: 'C', t: '实践的需要推动人类的科学发现和技术发明' },
      { k: 'D', t: '自然地理环境不再是人类社会生存和发展的必要条件' },
    ],
    why: '「不再是必要条件」绝对化。地理环境始终是社会存在发展的必要条件，只是非"决定"力量。' },
  { id: 'd5', topic: '二章 · 真理的绝对性与相对性', subject: 'my', ans: 'ABC', trap: 'D',
    stem: '毛泽东把真理的绝对性与相对性比作"长河"与"水滴"。以下说法正确的有',
    opts: [
      { k: 'A', t: '任何真理都是相对性向绝对性转化过程中的一个环节' },
      { k: 'B', t: '绝对性与相对性根源于认识能力无限与有限的矛盾' },
      { k: 'C', t: '真理的绝对性通过真理的相对性表现出来' },
      { k: 'D', t: '绝对真理和相对真理是对同一真理的不同表述方式' },
    ],
    why: 'D 偷换概念——二者是同一真理的两重属性、辩证统一，不是"两种不同表述方式"。' },
  { id: 'd6', topic: '三章 · 南水北调与自由', subject: 'my', ans: 'ABD', trap: 'C',
    stem: '通过南水北调工程解决华北水资源问题，这说明',
    opts: [
      { k: 'A', t: '实践能改变自然事物的形态，使之成为人化的自然' },
      { k: 'B', t: '人在自然面前不是被动的、无能为力的' },
      { k: 'C', t: '摆脱必然性的制约，是获得自由的前提' },
      { k: 'D', t: '人与自然的和谐是在不断解决矛盾中实现的' },
    ],
    why: '「摆脱必然性制约」错——自由 = 对必然的认识 + 对世界的改造，须以尊重规律为前提，不能"摆脱"。' },
  { id: 'd7', topic: '三章 · "投资于人"的依据', subject: 'my', ans: 'AB', trap: 'D',
    stem: '"投资于人"这一政策导向的深刻现实与理论依据在于',
    opts: [
      { k: 'A', t: '人民群众是历史的创造者，投资于人是坚持以人民为中心' },
      { k: 'B', t: '劳动者是生产力中最活跃的因素，投资于人就是投资未来生产力' },
      { k: 'C', t: '人的物质欲望是社会发展的根本动力' },
      { k: 'D', t: '人口因素是社会存在和发展的基础及决定力量' },
    ],
    why: 'D「决定力量」帽子错——人口只是重要条件，生产力才是最终决定力量。（C 也错，你没选，是对的。）' },
  { id: 'd8', topic: '四章 · 价值与财富的源泉', subject: 'my', ans: 'AB', trap: 'D',
    stem: '商品的价值是凝结在商品中的无差别的一般人类劳动。由此可见',
    opts: [
      { k: 'A', t: '商品交换实际上是生产者之间相互交换劳动的关系' },
      { k: 'B', t: '商品的价值本质上体现了生产者之间的社会关系' },
      { k: 'C', t: '使用价值寓于价值之中并通过价值表现出来' },
      { k: 'D', t: '劳动是一切社会财富的唯一源泉' },
    ],
    why: 'D「唯一源泉」绝对化——劳动是"价值"的唯一源泉，"使用价值（财富）"的源泉还有自然界。' },
  { id: 'd9', topic: '史纲 · 辛亥革命失败（主观）', subject: 'sg', ans: 'ABC', trap: 'D',
    stem: '辛亥革命之所以失败，从主观方面说，在于资产阶级革命派的弱点和错误，主要是',
    opts: [
      { k: 'A', t: '没有提出彻底的反帝反封建的革命纲领' },
      { k: 'B', t: '不能充分发动和依靠人民群众' },
      { k: 'C', t: '不能建立坚强的革命政党' },
      { k: 'D', t: '资本主义的建国方案行不通' },
    ],
    why: '题干问「主观」，D 是客观根源（半社半封条件下建国方案行不通），帽子错位、张冠李戴。' },
  { id: 'd10', topic: '史纲 · 为何叫"大革命"', subject: 'sg', ans: 'ABC', trap: 'D',
    stem: '1924—1927 年的革命被称作"大革命"，是因为与以往任何一次革命相比，它有很',
    opts: [
      { k: 'A', t: '群众的动员程度更为广泛' },
      { k: 'B', t: '斗争的规模更加宏伟' },
      { k: 'C', t: '革命的社会内涵更为深刻' },
      { k: 'D', t: '革命的背景更加复杂' },
    ],
    why: 'D 不是教材定论特征（标准三项：动员、规模、内涵）。看似合理的"第四项"常是凑数干扰。' },
  { id: 'd11', topic: '史纲 · 相持阶段三大政治口号', subject: 'sg', ans: 'ABD', trap: 'C',
    stem: '针对国民党消极抗日、积极反共，中国共产党坚持的三大政治口号是',
    opts: [
      { k: 'A', t: '坚持抗战到底，反对中途妥协' },
      { k: 'B', t: '巩固国内团结，反对内部分裂' },
      { k: 'C', t: '坚持全面抗战，反对限共溶共' },
      { k: 'D', t: '力求全国进步，反对向后倒退' },
    ],
    why: '三口号对应"抗战、团结、进步"，反对"妥协、分裂、倒退"。C 措辞是编造的近义干扰项。' },
  { id: 'd12', topic: '史纲 · 中共八大', subject: 'sg', ans: 'ABD', trap: 'C',
    stem: '1956 年中共八大对建设社会主义道路的探索站得比较高，因为八大',
    opts: [
      { k: 'A', t: '正确分析国内形势和主要矛盾变化，提出主要任务' },
      { k: 'B', t: '坚持既反保守又反冒进、在综合平衡中稳步前进的方针' },
      { k: 'C', t: '肯定"三个主体三个补充"，突破苏联模式开始经济体制改革' },
      { k: 'D', t: '通过了党在全国执政后制定的第一部党章' },
    ],
    why: '「开始经济体制改革」时间错置（那是 1978 年以后）——C 把改革开放的成就安到了八大头上。' },
]

const drillRevealed = ref<string[]>([])
const drillSolved = ref<string[]>([])
const drillScore = computed(() => drillSolved.value.length)
function pickDrill(d: Drill, k: string) {
  if (drillRevealed.value.includes(d.id)) return
  drillRevealed.value.push(d.id)
  if (k === d.trap && !drillSolved.value.includes(d.id)) drillSolved.value.push(d.id)
}
function resetDrill() { drillRevealed.value = []; drillSolved.value = [] }
function optClass(d: Drill, k: string) {
  if (!drillRevealed.value.includes(d.id)) return ''
  if (k === d.trap) return 'is-trap'
  if (d.ans.includes(k)) return 'is-right'
  return 'is-off'
}

// 混淆速查表
const meetingTable = [
  { m: '中共一大 · 1921', c: '定名、中心任务组织工人阶级', g: '未提民主革命纲领' },
  { m: '中共二大 · 1922', c: '首个反帝反封建民主革命纲领、第一部党章', g: '最高纲领≠最低纲领' },
  { m: '中共四大 · 1925', c: '无产阶级领导权 + 工农联盟', g: '别记成一大的组织工人' },
  { m: '八七会议 · 1927.8.7', c: '土地革命 + 武装反抗国民党总方针', g: '"枪杆子里面出政权"' },
  { m: '三湾改编 · 1927.9', c: '支部建在连上', g: '党对军队领导开端' },
  { m: '古田会议 · 1929.12', c: '思想建党、政治建军', g: '非确立毛泽东领导' },
  { m: '遵义会议 · 1935.1', c: '纠正军事组织错误、生死攸关转折点', g: '开始确立毛泽东代表正确路线' },
  { m: '瓦窑堡会议 · 1935.12', c: '抗日民族统一战线策略方针', g: '≠洛川的全面抗战路线' },
  { m: '洛川会议 · 1937.8', c: '全面抗战路线 + 抗日救国十大纲领', g: '≠瓦窑堡' },
  { m: '中共七大 · 1945', c: '毛泽东思想写入党章、确立指导思想', g: '三大作风' },
  { m: '七届二中全会 · 1949 春', c: '工作重心由乡村→城市、两个务必', g: '西柏坡' },
]
const pairTable = [
  { a: '具体劳动', b: '抽象劳动', note: '创造使用价值+转移旧价值 ↔ 创造价值' },
  { a: '个别劳动时间', b: '社会必要劳动时间', note: '价值量由后者决定；个别<社会→超额剩余价值' },
  { a: '绝对剩余价值', b: '相对剩余价值', note: '延长工作日/提强度 ↔ 缩短必要劳动时间；超额=个别企业率先' },
  { a: '不变资本 c', b: '可变资本 v', note: '按"剩余价值生产中的作用"划分；固定/流动按"周转方式"' },
  { a: '主观唯心', b: '客观唯心', note: '"我"的心/感觉 ↔ 独立"客观精神"(绝对观念/理/天命)' },
  { a: '主要矛盾', b: '矛盾主要方面', note: '决定全局(一个) ↔ 决定性质(每对矛盾里)' },
  { a: '社会存在', b: '社会意识', note: '决定 ↔ 相对独立+能动反作用(非总是积极)' },
  { a: '生产力', b: '生产方式', note: '最终决定力量 ↔ 社会存在发展基础及决定力量' },
]
const bookTable = [
  { t: '《神圣家族》1844', w: '马克思·恩格斯', k: '两人首次合作' },
  { t: '《德意志意识形态》', w: '马克思·恩格斯', k: '首次系统阐述唯物史观' },
  { t: '《共产党宣言》1848', w: '马克思·恩格斯', k: '马克思主义公开问世标志；陈望道 1920 首译' },
  { t: '《反对本本主义》1930', w: '毛泽东', k: '"没有调查，没有发言权"' },
  { t: '《论反对日本帝国主义的策略》1935', w: '毛泽东', k: '总结瓦窑堡后政治路线、抗日统一战线' },
  { t: '《论持久战》1938', w: '毛泽东', k: '批亡国论/速胜论，预见三阶段' },
  { t: '《改造我们的学习》1941', w: '毛泽东', k: '整风开篇、反对主观主义' },
]

// 速查表自测遮挡
const maskMode = ref(false)
const revealed = ref<string[]>([])
function toggleMask() { maskMode.value = !maskMode.value; revealed.value = [] }
function reveal(key: string) {
  if (!maskMode.value) return
  if (!revealed.value.includes(key)) revealed.value.push(key)
}
const isMasked = (key: string) => maskMode.value && !revealed.value.includes(key)

const activeSection = ref('overview')
const subjectFilter = ref<'all' | 'my' | 'sg'>('all')
const filteredPatches = computed(() =>
  subjectFilter.value === 'all' ? patches : patches.filter(p => p.subject === subjectFilter.value)
)
const patchCount = { my: patches.filter(p => p.subject === 'my').length, sg: patches.filter(p => p.subject === 'sg').length }
</script>

<template>
  <div class="dg">
    <!-- ══ 诊断结论横幅 ══ -->
    <div class="dg-verdict">
      <div class="dv-left">
        <span class="dv-kicker">DIAGNOSIS · 错因诊断</span>
        <h2 class="dv-title">你的政治失分，<span class="coral">六成卡在多选题</span></h2>
        <p class="dv-sub">基于肖1000 马原 + 史纲 <b>{{ TOTAL }}</b> 道错题的客观比对（我的答案 vs 正确答案）。先看病灶，再补漏洞。</p>
      </div>
      <div class="dv-right">
        <div class="dv-ring" :style="{ background: donut }">
          <div class="dv-ring-hole">
            <strong>{{ TYPE.multi }}</strong>
            <span>多选错题</span>
          </div>
        </div>
        <div class="dv-legend">
          <div v-for="m in multiStruct" :key="m.label" class="dvl-row">
            <i :style="{ background: m.color }"></i>
            <span>{{ m.label }}</span><b>{{ m.n }}</b>
          </div>
        </div>
      </div>
    </div>

    <!-- 关键指标 -->
    <div class="dg-kpis">
      <div class="kpi"><strong>{{ SUBJECT.my }}</strong><span>马原错题</span></div>
      <div class="kpi"><strong>{{ SUBJECT.sg }}</strong><span>史纲错题</span></div>
      <div class="kpi"><strong>{{ TYPE.multi }}</strong><span>多选 · 占 {{ Math.round(TYPE.multi/TOTAL*100) }}%</span></div>
      <div class="kpi hot"><strong>28.4%</strong><span>头号病灶 · 没认出干扰项</span></div>
    </div>

    <!-- 内层导航 -->
    <div class="dg-nav">
      <button :class="{ on: activeSection==='overview' }" @click="activeSection='overview'">🩺 诊断总览</button>
      <button :class="{ on: activeSection==='patch' }" @click="activeSection='patch'">🧩 漏洞补丁卡</button>
      <button :class="{ on: activeSection==='multi' }" @click="activeSection='multi'">📐 多选判断法</button>
      <button :class="{ on: activeSection==='drill' }" @click="activeSection='drill'">🎯 找茬演练</button>
      <button :class="{ on: activeSection==='table' }" @click="activeSection='table'">📊 混淆速查表</button>
    </div>

    <!-- ══════════ 1 诊断总览 ══════════ -->
    <section v-show="activeSection==='overview'" class="dg-panel">
      <h3 class="dg-h">错因五大病灶 · 按占比排序</h3>
      <div class="buckets">
        <div v-for="b in buckets" :key="b.key" class="bucket" :class="b.color">
          <div class="bk-head">
            <span class="bk-label">{{ b.label }}</span>
            <span class="bk-count">{{ b.count }} 题 · {{ b.pct }}%</span>
          </div>
          <div class="bk-bar"><i :style="{ width: b.pct + '%' }"></i></div>
          <p class="bk-diag"><b>病因：</b><span v-html="hl(b.diag)"></span></p>
          <p class="bk-cure"><b>对策：</b><span v-html="hl(b.cure)"></span></p>
          <p class="bk-eg"><span v-html="hl(b.eg)"></span></p>
        </div>
      </div>

      <h3 class="dg-h" style="margin-top:34px">章节错题热力 · 从哪补最划算</h3>
      <p class="dg-note">条越长 = 该章错题越多，优先回炉。马原第四章政治经济学是<b>超级重灾区（73 题，占全部 23%）</b>。</p>
      <div class="heat">
        <div v-for="h in heat" :key="h.label" class="heat-row" :class="h.s">
          <span class="heat-name">{{ h.label }}</span>
          <div class="heat-track"><i :style="{ width: (h.n/heatMax*100) + '%' }"></i></div>
          <span class="heat-n">{{ h.n }}</span>
        </div>
      </div>
    </section>

    <!-- ══════════ 2 漏洞补丁卡 ══════════ -->
    <section v-show="activeSection==='patch'" class="dg-panel">
      <div class="pf-filter">
        <button :class="{on:subjectFilter==='all'}" @click="subjectFilter='all'">全部 {{ patches.length }}</button>
        <button :class="{on:subjectFilter==='my'}" @click="subjectFilter='my'">马原 {{ patchCount.my }}</button>
        <button :class="{on:subjectFilter==='sg'}" @click="subjectFilter='sg'">史纲 {{ patchCount.sg }}</button>
      </div>
      <div class="cards">
        <article v-for="(p,i) in filteredPatches" :key="p.title" class="card" :class="[p.subject, { hotp: p.hot }]">
          <header class="cd-head">
            <span class="cd-tag">{{ p.subject==='my' ? '马原' : '史纲' }}</span>
            <h4 class="cd-title">{{ p.title }}</h4>
            <span v-if="p.hot" class="cd-hot">🔥重灾</span>
          </header>

          <div class="cd-block wrong">
            <span class="cd-bk">你反复错</span>
            <ul><li v-for="(w,j) in p.wrong" :key="j" v-html="hl(w)"></li></ul>
          </div>
          <div class="cd-block fuzzy">
            <span class="cd-bk">模糊 / 遗忘</span>
            <p v-html="hl(p.fuzzy)"></p>
          </div>
          <div class="cd-block patch">
            <span class="cd-bk">✅ 补丁 · 记这几句</span>
            <ul><li v-for="(pt,j) in p.patch" :key="j" v-html="hl(pt)"></li></ul>
          </div>
          <div v-if="p.traps" class="cd-traps">
            <span v-for="(t,j) in p.traps" :key="j" class="trap" v-html="hl(t)"></span>
          </div>
        </article>
      </div>
    </section>

    <!-- ══════════ 3 多选判断法 ══════════ -->
    <section v-show="activeSection==='multi'" class="dg-panel">
      <p class="dg-lead">多选题错 1 个就少分，是你与 70+ 之间最大的那道坎。三套判断法，对应上面三种失分结构。练完直接去 <b>🎯 找茬演练</b> 实战。</p>
      <div class="tactics">
        <div v-for="t in multiTactics" :key="t.name" class="tactic" :class="t.color">
          <h4>{{ t.name }}</h4>
          <ul><li v-for="(p,j) in t.points" :key="j" v-html="hl(p)"></li></ul>
        </div>
      </div>
    </section>

    <!-- ══════════ 4 多选找茬演练 ══════════ -->
    <section v-show="activeSection==='drill'" class="dg-panel">
      <div class="dr-bar">
        <div class="dr-bar-txt">
          <h3 class="dg-h" style="margin:0">从你 76 道「多选选多了」的错题里，还原出的高频陷阱</h3>
          <p class="dg-note" style="margin:6px 0 0">每题的正确答案里都藏着你上次<b>多选了、其实却是错的</b>那一个干扰项——把它揪出来。</p>
        </div>
        <div class="dr-score">
          <strong>{{ drillScore }}<em>/{{ drills.length }}</em></strong>
          <span>已揪出</span>
          <button class="dr-reset" @click="resetDrill">↺ 重练</button>
        </div>
      </div>

      <div class="drills">
        <article v-for="d in drills" :key="d.id" class="drill" :class="[d.subject, { done: drillRevealed.includes(d.id), ok: drillSolved.includes(d.id) }]">
          <header class="dr-head">
            <span class="dr-tag">{{ d.subject==='my' ? '马原' : '史纲' }}</span>
            <h4 class="dr-topic">{{ d.topic }}</h4>
            <span v-if="drillSolved.includes(d.id)" class="dr-badge">✓ 揪对了</span>
          </header>
          <p class="dr-stem">{{ d.stem }}</p>
          <div class="dr-opts">
            <button v-for="o in d.opts" :key="o.k" class="dr-opt" :class="optClass(d,o.k)" :disabled="drillRevealed.includes(d.id)" @click="pickDrill(d,o.k)">
              <span class="dr-key">{{ o.k }}</span>
              <span class="dr-txt" v-html="hl(o.t)"></span>
            </button>
          </div>
          <div v-if="drillRevealed.includes(d.id)" class="dr-why">
            <span class="dr-ans">正解 {{ d.ans }} · 陷阱项 <b>{{ d.trap }}</b></span>
            <p v-html="hl(d.why)"></p>
          </div>
          <p v-else class="dr-hint">👆 点你认为"上次多选了但其实错"的那一项</p>
        </article>
      </div>
    </section>

    <!-- ══════════ 5 混淆速查表 ══════════ -->
    <section v-show="activeSection==='table'" class="dg-panel">
      <div class="tbl-tools">
        <button class="tt-btn" :class="{on:maskMode}" @click="toggleMask">🙈 自测遮挡：{{ maskMode ? '开' : '关' }}</button>
        <span v-if="maskMode" class="tt-hint">答案已遮罩，先自己在心里回忆，点一下格子核对</span>
        <button v-if="maskMode" class="tt-reset" @click="revealed=[]">全部重置</button>
      </div>

      <h3 class="dg-h">党史重要会议 · 谁提了什么</h3>
      <div class="tbl-wrap">
        <table class="tbl">
          <thead><tr><th>会议 · 时间</th><th>核心内容</th><th>易混点 / 口诀</th></tr></thead>
          <tbody>
            <tr v-for="(r,i) in meetingTable" :key="r.m">
              <td class="t-strong">{{ r.m }}</td>
              <td><span class="mk" :class="{on:isMasked('mt'+i)}" @click="reveal('mt'+i)" v-html="hl(r.c)"></span></td>
              <td class="t-warn"><span class="mk" :class="{on:isMasked('mt'+i+'g')}" @click="reveal('mt'+i+'g')" v-html="hl(r.g)"></span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="dg-h" style="margin-top:30px">马原对偶概念 · 一句话判据</h3>
      <div class="tbl-wrap">
        <table class="tbl">
          <thead><tr><th>A</th><th>B</th><th>怎么分</th></tr></thead>
          <tbody>
            <tr v-for="(r,i) in pairTable" :key="r.a">
              <td class="t-strong">{{ r.a }}</td>
              <td class="t-strong">{{ r.b }}</td>
              <td><span class="mk" :class="{on:isMasked('pr'+i)}" @click="reveal('pr'+i)" v-html="hl(r.note)"></span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="dg-h" style="margin-top:30px">关键著作 · 作者与命题</h3>
      <div class="tbl-wrap">
        <table class="tbl">
          <thead><tr><th>著作 · 年份</th><th>作者</th><th>记住这句</th></tr></thead>
          <tbody>
            <tr v-for="(r,i) in bookTable" :key="r.t">
              <td class="t-strong">{{ r.t }}</td>
              <td>{{ r.w }}</td>
              <td><span class="mk" :class="{on:isMasked('bk'+i)}" @click="reveal('bk'+i)" v-html="hl(r.k)"></span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <p class="dg-foot">💡 每张补丁卡里的「Q×」对应错题本同章题目，可回 <router-link to="/wrong-problems" class="dg-link">全科错题本</router-link> 逐题重做。</p>
  </div>
</template>

<style scoped>
.dg {
  --dg-ink: #1f2d3d; --dg-body: #303133; --dg-muted: #5b6b7f;
  --dg-gold: #ffc53d; --dg-navy: #16345c; --dg-navy-deep: #0d2137;
  --dg-coral: #e8604c; --dg-blue: #3a7ca5; --dg-grey: #90a0b0;
  --dg-green: #2e9e6b; --dg-line: #e4ebf3; --dg-soft: #f5f8fc;
  --font-display: 'Barlow Condensed', 'FZCuHei', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  color: var(--dg-body);
}
/* 重点字词标红加粗（v-html 内容不受 scoped 约束，用 :deep） */
.dg :deep(.hl) { color: var(--dg-coral); font-weight: 800; }

/* 结论横幅 */
.dg-verdict {
  display: flex; gap: 28px; align-items: center; flex-wrap: wrap;
  background: linear-gradient(150deg, var(--dg-navy-deep) 0%, var(--dg-navy) 70%, #1e4576 100%);
  border-radius: 16px; padding: 28px 32px; color: #fff; position: relative; overflow: hidden;
}
.dg-verdict::after {
  content: ''; position: absolute; inset: 0;
  background-image: linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);
  background-size: 40px 40px; pointer-events: none;
}
.dv-left { flex: 1; min-width: 260px; position: relative; z-index: 1; }
.dv-kicker { font-family: var(--font-mono); font-size: .72rem; letter-spacing: .2em; color: var(--dg-gold); }
.dv-title { font-size: clamp(1.4rem,2.6vw,2rem); margin: 8px 0 10px; font-weight: 800; }
.dv-title .coral { color: #ff8a76; }
.dv-sub { color: #b9cbe0; font-size: .92rem; line-height: 1.7; margin: 0; }
.dv-sub b { color: var(--dg-gold); }
.dv-right { display: flex; align-items: center; gap: 20px; position: relative; z-index: 1; }
.dv-ring { width: 128px; height: 128px; border-radius: 50%; display: grid; place-items: center; flex-shrink: 0; }
.dv-ring-hole { width: 84px; height: 84px; border-radius: 50%; background: var(--dg-navy-deep); display: grid; place-items: center; text-align: center; }
.dv-ring-hole strong { font-family: var(--font-display); font-size: 1.9rem; color: var(--dg-gold); line-height: 1; }
.dv-ring-hole span { font-size: .68rem; color: #b9cbe0; }
.dv-legend { display: flex; flex-direction: column; gap: 8px; }
.dvl-row { display: flex; align-items: center; gap: 8px; font-size: .82rem; color: #d5e2f0; }
.dvl-row i { width: 12px; height: 12px; border-radius: 3px; flex-shrink: 0; }
.dvl-row b { margin-left: auto; color: #fff; font-family: var(--font-mono); }

/* KPI */
.dg-kpis { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin: 18px 0 6px; }
.kpi { background: #fff; border: 1px solid var(--dg-line); border-radius: 12px; padding: 16px 18px; text-align: center; }
.kpi strong { display: block; font-family: var(--font-display); font-size: 2rem; color: var(--dg-navy); line-height: 1.1; }
.kpi span { font-size: .8rem; color: var(--dg-muted); }
.kpi.hot { border-color: rgba(232,96,76,.4); background: linear-gradient(135deg,#fff2ef,#fff); }
.kpi.hot strong { color: var(--dg-coral); }

/* 内层导航 */
.dg-nav { display: flex; gap: 8px; flex-wrap: wrap; margin: 22px 0 18px; }
.dg-nav button {
  border: 1px solid var(--dg-line); background: #fff; color: var(--dg-muted);
  padding: 9px 18px; border-radius: 999px; font-size: .92rem; font-weight: 600; cursor: pointer;
  transition: all .2s;
}
.dg-nav button:hover { border-color: var(--dg-navy); color: var(--dg-navy); }
.dg-nav button.on { background: var(--dg-navy); color: #fff; border-color: var(--dg-navy); box-shadow: 0 4px 14px rgba(22,52,92,.28); }

.dg-panel { animation: fade .3s ease; }
@keyframes fade { from { opacity: 0; transform: translateY(6px);} to { opacity:1; transform:none;} }
.dg-h { font-size: 1.12rem; color: var(--dg-ink); margin: 4px 0 14px; padding-left: 12px; border-left: 4px solid var(--dg-gold); }
.dg-note, .dg-lead { color: var(--dg-muted); font-size: .9rem; line-height: 1.7; margin: 0 0 16px; }
.dg-note b, .dg-lead b { color: var(--dg-coral); }

/* 错因桶 */
.buckets { display: grid; grid-template-columns: repeat(auto-fit,minmax(300px,1fr)); gap: 14px; }
.bucket { border: 1px solid var(--dg-line); border-radius: 12px; padding: 16px 18px; background: #fff; border-top: 3px solid var(--dg-grey); }
.bucket.coral { border-top-color: var(--dg-coral);} .bucket.gold{border-top-color:var(--dg-gold);}
.bucket.blue{border-top-color:var(--dg-blue);} .bucket.navy{border-top-color:var(--dg-navy);} .bucket.grey{border-top-color:var(--dg-grey);}
.bk-head { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
.bk-label { font-weight: 700; color: var(--dg-ink); font-size: .98rem; }
.bk-count { font-family: var(--font-mono); font-size: .82rem; color: var(--dg-muted); white-space: nowrap; }
.bk-bar { height: 8px; background: var(--dg-soft); border-radius: 5px; margin: 10px 0; overflow: hidden; }
.bk-bar i { display: block; height: 100%; border-radius: 5px; background: linear-gradient(90deg,var(--dg-navy),var(--dg-blue)); }
.bucket.coral .bk-bar i { background: linear-gradient(90deg,var(--dg-coral),#ff8a76); }
.bucket.gold .bk-bar i { background: linear-gradient(90deg,#e0a92e,var(--dg-gold)); }
.bk-diag, .bk-cure { font-size: .84rem; line-height: 1.65; margin: 6px 0 0; color: var(--dg-body); }
.bk-diag b { color: var(--dg-coral); } .bk-cure b { color: var(--dg-green); }
.bk-eg { font-size: .8rem; line-height: 1.55; margin: 8px 0 0; padding: 7px 10px; background: var(--dg-soft); border-radius: 7px; border-left: 3px solid var(--dg-blue); color: var(--dg-navy); }

/* 热力 */
.heat { display: flex; flex-direction: column; gap: 8px; }
.heat-row { display: grid; grid-template-columns: 200px 1fr 40px; align-items: center; gap: 12px; }
.heat-name { font-size: .86rem; color: var(--dg-body); }
.heat-track { height: 18px; background: var(--dg-soft); border-radius: 5px; overflow: hidden; }
.heat-track i { display: block; height: 100%; border-radius: 5px; }
.heat-row.my .heat-track i { background: linear-gradient(90deg,#c98a1e,var(--dg-gold)); }
.heat-row.sg .heat-track i { background: linear-gradient(90deg,var(--dg-navy),var(--dg-blue)); }
.heat-n { font-family: var(--font-mono); font-size: .86rem; color: var(--dg-muted); text-align: right; }

/* 补丁卡 */
.pf-filter { display: flex; gap: 8px; margin-bottom: 16px; }
.pf-filter button { border: 1px solid var(--dg-line); background: #fff; color: var(--dg-muted); padding: 6px 16px; border-radius: 8px; cursor: pointer; font-size: .88rem; }
.pf-filter button.on { background: var(--dg-gold); color: #5a4300; border-color: var(--dg-gold); font-weight: 700; }
.cards { display: grid; grid-template-columns: repeat(auto-fill,minmax(360px,1fr)); gap: 16px; }
.card { border: 1px solid var(--dg-line); border-radius: 14px; background: #fff; padding: 18px 20px; transition: box-shadow .2s, transform .2s; }
.card:hover { box-shadow: 0 10px 26px rgba(13,33,55,.1); transform: translateY(-2px); }
.card.hotp { border-color: rgba(232,96,76,.35); }
.cd-head { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.cd-tag { font-size: .72rem; font-weight: 700; padding: 3px 10px; border-radius: 6px; color: #fff; }
.card.my .cd-tag { background: linear-gradient(135deg,#c98a1e,var(--dg-gold)); color:#5a4300; }
.card.sg .cd-tag { background: linear-gradient(135deg,var(--dg-navy),var(--dg-blue)); }
.cd-title { font-size: 1.02rem; color: var(--dg-ink); margin: 0; font-weight: 700; flex: 1; }
.cd-hot { font-size: .74rem; color: var(--dg-coral); font-weight: 700; white-space: nowrap; }
.cd-block { margin-top: 10px; }
.cd-bk { display: inline-block; font-size: .74rem; font-weight: 700; letter-spacing: .04em; margin-bottom: 4px; }
.cd-block.wrong .cd-bk { color: var(--dg-coral); }
.cd-block.fuzzy .cd-bk { color: var(--dg-blue); }
.cd-block.patch .cd-bk { color: var(--dg-green); }
.cd-block.wrong ul, .cd-block.patch ul { margin: 0; padding-left: 18px; }
.cd-block.wrong li { font-size: .84rem; line-height: 1.6; color: var(--dg-body); margin: 3px 0; }
.cd-block.wrong { background: #fff4f1; border-radius: 8px; padding: 10px 12px; }
.cd-block.fuzzy p { margin: 0; font-size: .84rem; line-height: 1.6; color: var(--dg-muted); font-style: italic; }
.cd-block.patch { background: #eef8f2; border-radius: 8px; padding: 10px 12px; }
.cd-block.patch li { font-size: .85rem; line-height: 1.65; color: #1f4d38; margin: 4px 0; }
.cd-traps { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
.trap { font-size: .76rem; color: var(--dg-coral); background: #fff; border: 1px dashed var(--dg-coral); border-radius: 6px; padding: 3px 9px; }
.trap :deep(.hl) { color: inherit; }

/* 多选判断法 */
.tactics { display: grid; grid-template-columns: repeat(auto-fit,minmax(280px,1fr)); gap: 16px; }
.tactic { border-radius: 14px; padding: 20px 22px; color: #fff; }
.tactic.coral { background: linear-gradient(150deg,#d9503c,#e8604c); }
.tactic.blue { background: linear-gradient(150deg,#2c6485,#3a7ca5); }
.tactic.gold { background: linear-gradient(150deg,#c98a1e,#e0a92e); }
.tactic h4 { margin: 0 0 12px; font-size: 1.05rem; }
.tactic ul { margin: 0; padding-left: 18px; }
.tactic li { font-size: .88rem; line-height: 1.7; margin: 6px 0; }
.tactic li :deep(.hl) { color: #ffe08a; }

/* 找茬演练 */
.dr-bar { display: flex; justify-content: space-between; align-items: flex-start; gap: 18px; flex-wrap: wrap; margin-bottom: 16px; }
.dr-score { display: flex; align-items: center; gap: 10px; background: var(--dg-navy); color: #fff; border-radius: 12px; padding: 10px 16px; }
.dr-score strong { font-family: var(--font-display); font-size: 1.7rem; color: var(--dg-gold); line-height: 1; }
.dr-score strong em { font-style: normal; font-size: .95rem; color: #b9cbe0; }
.dr-score span { font-size: .78rem; color: #b9cbe0; }
.dr-reset { border: 1px solid rgba(255,255,255,.4); background: transparent; color: #fff; border-radius: 8px; padding: 5px 12px; cursor: pointer; font-size: .82rem; }
.dr-reset:hover { background: rgba(255,255,255,.12); }
.drills { display: grid; grid-template-columns: repeat(auto-fill,minmax(360px,1fr)); gap: 16px; }
.drill { border: 1px solid var(--dg-line); border-radius: 14px; background: #fff; padding: 16px 18px; border-left: 4px solid var(--dg-blue); }
.drill.my { border-left-color: var(--dg-gold); }
.drill.sg { border-left-color: var(--dg-navy); }
.drill.done.ok { border-color: rgba(46,158,107,.5); }
.dr-head { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.dr-tag { font-size: .7rem; font-weight: 700; padding: 2px 8px; border-radius: 5px; }
.drill.my .dr-tag { background: #fdf1d6; color: #8a6100; }
.drill.sg .dr-tag { background: #e7eef6; color: var(--dg-navy); }
.dr-topic { font-size: .95rem; margin: 0; flex: 1; color: var(--dg-ink); font-weight: 700; }
.dr-badge { font-size: .76rem; color: var(--dg-green); font-weight: 700; }
.dr-stem { font-size: .88rem; line-height: 1.6; color: var(--dg-body); margin: 0 0 12px; padding: 10px 12px; background: var(--dg-soft); border-radius: 8px; }
.dr-opts { display: flex; flex-direction: column; gap: 8px; }
.dr-opt { display: flex; align-items: flex-start; gap: 10px; text-align: left; border: 1.5px solid var(--dg-line); background: #fff; border-radius: 9px; padding: 9px 12px; cursor: pointer; transition: all .15s; font-size: .85rem; line-height: 1.5; color: var(--dg-body); }
.dr-opt:hover:not(:disabled) { border-color: var(--dg-navy); background: #f8fbff; }
.dr-opt:disabled { cursor: default; }
.dr-key { font-family: var(--font-mono); font-weight: 700; color: var(--dg-navy); flex-shrink: 0; }
.dr-txt { flex: 1; }
.dr-opt.is-right { border-color: var(--dg-green); background: #eef8f2; }
.dr-opt.is-right .dr-key { color: var(--dg-green); }
.dr-opt.is-trap { border-color: var(--dg-coral); background: #fff1ee; box-shadow: 0 0 0 2px rgba(232,96,76,.15); }
.dr-opt.is-trap .dr-key { color: var(--dg-coral); }
.dr-opt.is-trap::after { content: '⚠ 你多选的错项'; margin-left: auto; font-size: .72rem; color: var(--dg-coral); font-weight: 700; white-space: nowrap; }
.dr-opt.is-off { opacity: .5; }
.dr-why { margin-top: 10px; padding: 10px 12px; border-radius: 8px; background: #fff8ec; border-left: 3px solid var(--dg-gold); }
.dr-ans { font-size: .78rem; font-family: var(--font-mono); color: var(--dg-navy); }
.dr-ans b { color: var(--dg-coral); }
.dr-why p { margin: 5px 0 0; font-size: .84rem; line-height: 1.6; color: var(--dg-body); }
.dr-why p :deep(.hl) { color: var(--dg-coral); }
.dr-hint { margin: 8px 0 0; font-size: .78rem; color: var(--dg-grey); }

/* 表格 */
.tbl-tools { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 16px; }
.tt-btn { border: 1px solid var(--dg-line); background: #fff; color: var(--dg-muted); padding: 7px 16px; border-radius: 8px; cursor: pointer; font-size: .88rem; font-weight: 600; }
.tt-btn.on { background: var(--dg-coral); color: #fff; border-color: var(--dg-coral); }
.tt-hint { font-size: .82rem; color: var(--dg-muted); }
.tt-reset { border: none; background: transparent; color: var(--dg-blue); cursor: pointer; font-size: .82rem; text-decoration: underline; }
.tbl-wrap { border: 1px solid var(--dg-line); border-radius: 12px; overflow: hidden; }
.tbl { width: 100%; border-collapse: collapse; font-size: .86rem; }
.tbl thead th { background: var(--dg-navy); color: #fff; text-align: left; padding: 11px 14px; font-weight: 600; }
.tbl tbody td { padding: 10px 14px; border-top: 1px solid var(--dg-line); vertical-align: top; line-height: 1.55; }
.tbl tbody tr:nth-child(even) { background: var(--dg-soft); }
.t-strong { font-weight: 700; color: var(--dg-ink); white-space: nowrap; }
.t-warn { color: var(--dg-coral); }
.mk { transition: filter .2s; border-radius: 4px; }
.mk.on { filter: blur(6px); cursor: pointer; user-select: none; }
.mk.on:hover { filter: blur(3px); }

.dg-foot { margin-top: 26px; font-size: .84rem; color: var(--dg-muted); }
.dg-link { color: var(--dg-navy); font-weight: 700; text-decoration: none; border-bottom: 1px solid var(--dg-gold); }

/* 响应式 */
@media (max-width: 768px) {
  .dg-verdict { padding: 20px; }
  .dv-right { width: 100%; justify-content: space-around; }
  .dg-kpis { grid-template-columns: repeat(2,1fr); }
  .heat-row { grid-template-columns: 128px 1fr 34px; gap: 8px; }
  .heat-name { font-size: .78rem; }
  .cards, .drills { grid-template-columns: 1fr; }
  .t-strong { white-space: normal; }
  .dr-opt.is-trap::after { font-size: .66rem; }
}
</style>

<script setup lang="ts">
import { useWrongProblemsStore } from '@/stores/wrongProblems'
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, DocumentChecked, Upload, Picture, CopyDocument, MagicStick, ArrowDown } from '@element-plus/icons-vue'
import { WANGDAO_CS_SEED } from '../data/wangdao'

interface WrongProblem {
  id: string
  chapterId: string
  chapterName: string
  sectionId: string
  sectionName: string
  title: string
  content: string
  mistakeType: string
  importance: number
  correction: string
  createdAt: string
  reviewCount: number
  lastReviewAt: string
  mastered: boolean
  subject?: string
}

const wp = useWrongProblemsStore(); const problems = wp.bind('cs', [
  {
    id: 'co_1_1',
    chapterId: 'ch1',
    chapterName: '第一章 计算机系统概述',
    sectionId: '1.2',
    sectionName: '1.2.1 计算机系统的基本组成',
    title: '完整的计算机系统（CO-WD-1.2.7-XT-1）',
    content: '完整的计算机系统应包括（）。\nA. 运算器、存储器、控制器\nB. 外部设备和主机\nC. 主机和应用程序\nD. 配套的硬件设备和软件系统',
    mistakeType: '概念不清',
    importance: 5,
    correction: '正确答案：D\n解析：完整的计算机系统应包括配套的硬件设备和软件系统。A选项只是硬件中的CPU和存储器部分，B只提到了硬件，C只提到了硬件和应用软件，都不完整。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'co_1_5',
    chapterId: 'ch1',
    chapterName: '第一章 计算机系统概述',
    sectionId: '1.2',
    sectionName: '1.2 计算机系统层次结构',
    title: '计算机系统层次化结构顺序（CO-WD-1.2.7-XT-5）',
    content: '计算机系统采用层次化结构，从最上层的应用程序到最底层的硬件，其典型层次自上而下依次为（）。\nA. 高级语言虚拟机→操作系统虚拟机→汇编语言虚拟机→机器语言机器\nB. 高级语言虚拟机→汇编语言虚拟机→机器语言机器→操作系统虚拟机\nC. 高级语言虚拟机→汇编语言虚拟机→操作系统虚拟机→机器语言机器\nD. 操作系统虚拟机→高级语言虚拟机→汇编语言虚拟机→机器语言机器',
    mistakeType: '概念不清',
    importance: 5,
    correction: '正确答案：C\n解析：计算机系统的层次结构自上而下为：高级语言虚拟机→汇编语言虚拟机→操作系统虚拟机→机器语言机器。注意操作系统在汇编语言之下。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'co_1_6',
    chapterId: 'ch1',
    chapterName: '第一章 计算机系统概述',
    sectionId: '1.2',
    sectionName: '1.2 计算机系统层次结构',
    title: '计算机系统层次结构的概念（CO-WD-1.2.7-XT-6）',
    content: '下列关于计算机系统层次结构的说法中，正确的是（）\nA. 高级语言程序经编译生成汇编语言后，可直接在机器上执行\nB. ISA仅定义指令功能，不涉及硬件实现细节\nC. 同一ISA可由不同微体系结构实现，软件无须修改即可兼容\nD. 高级语言中的每条语句与ISA的机器指令一一对应',
    mistakeType: '概念不清',
    importance: 5,
    correction: '正确答案：C\n解析：ISA（指令集架构）是软硬件的接口，同一ISA可以由不同的微体系结构（硬件实现）来实现，这就是兼容性的基础。选项A错误，汇编语言还需要汇编成机器语言；选项B错误，ISA定义了硬件必须实现的功能；选项D错误，高级语言语句与机器指令不是一一对应关系。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'co_1_7',
    chapterId: 'ch1',
    chapterName: '第一章 计算机系统概述',
    sectionId: '1.2',
    sectionName: '1.2.4 高级语言程序与机器语言程序之间的转换',
    title: '编译程序和解释程序的区别（CO-WD-1.2.7-XT-7）',
    content: '关于编译程序和解释程序，下列说法中错误的是（）。\nA. 编译程序和解释程序的作用都是将高级语言程序转换成机器语言程序\nB. 编译程序编译时间较长，运行速度较快\nC. 解释程序方法较简单，运行速度也较快\nD. 解释程序将源程序翻译成机器语言，并且翻译一条以后，立即执行这条语句',
    mistakeType: '概念不清',
    importance: 5,
    correction: '正确答案：C（说法错误）\n解析：解释程序的缺点是运行速度较慢，因为每次执行都需要翻译。编译程序虽然编译时间长，但生成的目标程序运行速度快。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'co_1_8',
    chapterId: 'ch1',
    chapterName: '第一章 计算机系统概述',
    sectionId: '1.2',
    sectionName: '1.2.4 高级语言程序与机器语言程序之间的转换',
    title: '解释和汇编的概念（CO-WD-1.2.7-XT-8）',
    content: '只有当程序执行时才将源程序翻译成机器语言，并且一次只能翻译一行语句，边翻译边执行的是（）程序。把汇编语言源程序转变为机器语言程序的过程是（）。\nI. 编译 II. 目标 III. 汇编 IV. 解释\nA. I、II\nB. IV、II\nC. IV、I\nD. IV、III',
    mistakeType: '概念不清',
    importance: 5,
    correction: '正确答案：D\n解析：解释程序是边翻译边执行（IV），汇编语言转为机器语言的过程叫汇编（III）。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'co_1_12',
    chapterId: 'ch1',
    chapterName: '第一章 计算机系统概述',
    sectionId: '1.2',
    sectionName: '1.2.4 高级语言程序与机器语言程序之间的转换',
    title: '【2016统考真题12】编译程序的作用（CO-WD-1.2.7-XT-12）',
    content: '将高级语言源程序转换为机器级目标代码文件的程序是（）。\nA. 汇编程序\nB. 链接程序\nC. 编译程序\nD. 解释程序',
    mistakeType: '概念不清',
    importance: 5,
    correction: '正确答案：C\n解析：编译程序将高级语言源程序转换为机器级目标代码文件（.obj或.o文件）。汇编程序处理汇编语言，链接程序将多个目标文件链接成可执行文件。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'co_1_14',
    chapterId: 'ch1',
    chapterName: '第一章 计算机系统概述',
    sectionId: '1.2',
    sectionName: '1.2.4 高级语言程序与机器语言程序之间的转换',
    title: '【2022统考真题20】程序转换过程（CO-WD-1.2.7-XT-14）',
    content: '将高级语言源程序转换为可执行目标文件的主要过程是（）。\nA. 预处理→编译→汇编→链接\nB. 预处理→汇编→编译→链接\nC. 预处理→编译→链接→汇编\nD. 预处理→汇编→链接→编译',
    mistakeType: '概念不清',
    importance: 5,
    correction: '正确答案：A\n解析：完整的编译过程为：预处理（处理宏、头文件等）→编译（高级语言→汇编语言）→汇编（汇编语言→机器语言目标文件）→链接（将多个目标文件和库文件链接成可执行文件）。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'cs_co2013_44',
    chapterId: 'ch-instr',
    chapterName: '指令系统',
    sectionId: '4.3',
    sectionName: '4.3 寻址方式与条件转移指令',
    title: '【2013统考真题44】条件转移指令·相对寻址·标志检测位',
    content: '16位定长指令，标志寄存器含CF/ZF/NF。条件转移指令格式：OP[15-11]、C[10]、Z[9]、N[8]、OFFSET[7-0]。C/Z/N分别是CF/ZF/NF的检测位：某检测位=1则检测对应标志，被检测的标志中只要有一个为1就转移，否则不转移。OFFSET为相对偏移量、补码表示。转移执行时目标地址=(PC)+2+2×OFFSET；顺序执行时下条地址=(PC)+2。\n(1)该计算机按字节还是按字编址？该条件转移指令向后最多可跳转多少条指令？\n(2)某转移指令地址为200CH，指令内容为 C=0,Z=1,N=1、OFFSET=11100011B。若执行时CF=0,ZF=0,NF=1，执行后PC是多少？若CF=1,ZF=0,NF=0，PC又是多少？\n(3)实现"无符号数比较小于等于时转移"的指令中，C、Z、N各应是什么？\n(4)给出该指令数据通路示意图中部件①~③的名称或功能。',
    mistakeType: '审题不清',
    importance: 5,
    correction: '正确答案：\n(1)按字节编址——下条地址是(PC)+2而指令为2字节，说明每个地址只管1字节。OFFSET是8位补码∈[-128,127]，向后取-128，位移=2×(-128)=-256字节=-128条指令，故向后最多跳128条（按"距下条"口径；按"距本条"为127条，均可）。\n(2)先读图：C=0,Z=1,N=1 → 只检测ZF、NF（CF未启用）。OFFSET=11100011B是补码=-29，2×OFFSET=-58=-3AH。情形A(CF=0,ZF=0,NF=1)：NF=1命中→转移→PC=200CH+2-3AH=200EH-3AH=1FD4H。情形B(CF=1,ZF=0,NF=0)：被检测的ZF=0且NF=0→不转移→PC=200CH+2=200EH（CF=1是干扰项，C=0根本没让它参与）。\n(3)无符号比较只看CF(借位)和ZF(相等)，与NF无关。a≤b ⟺ a=b(ZF=1) 或 a<b(CF=1)，需同时检测CF和ZF → C=1, Z=1, N=0。\n(4)①指令寄存器IR（存放当前指令，向判定逻辑供C/Z/N字段、向地址计算供OFFSET字段）；②左移器（左移1位，实现2×OFFSET）；③加法器（完成(PC)+2+(2×OFFSET)，算出转移目标地址）。\n\n错因：OFFSET位读反（误当成00001100）、整段跳过"检测位"语义、(3)答成三个标志的名字而非取值、(4)背通用CPU部件名而非顺着数据流连线读图。核心病根=条件没读满就动手，与数学错题同源。\n\n同类提醒：相对转移题固定三步——读检测位定"看哪些标志"→判转不转→套(PC)+2+2×OFFSET(OFFSET先化补码)；编址方式看PC自增量(+1按字、+2且指令2字节按字节)；无符号比较用CF/ZF，带符号才用NF/OF。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'cs_co2021_43',
    chapterId: 'ch-instr',
    chapterName: '指令系统',
    sectionId: '4.2',
    sectionName: '4.2 指令格式（R/I/J 型）与寄存器位宽',
    title: '【2021统考真题43】R/I/J三格式·位宽来源表·操作种类数法',
    content: '16位定长指令，M字长16位、按字节编址，地址线20位、数据线8位。三种指令格式：\nR型[15-10]=000000,[9-8]rs,[7-6]rt,[5-4]rd,[3-0]op1，功能R[rd]←R[rs] op1 R[rt]\nI型[15-10]op2,[9-8]rs,[7-6]rt,[5-0]imm，含ALU运算/条件转移/访存\nJ型[15-10]op3,[9-0]target，功能PC低10位←target\n(1)ALU宽度？可寻址主存空间多少字节？IR、MAR、MDR各多少位？\n(2)R型最多几种操作？I型和J型共最多几种？通用寄存器最多几个？\n(3)op1=0010减法、0011乘法。指令01B2H功能？若R1=B052H、R2=0008H、R3=0020H，执行01B2H和01B3H后R3各是什么、是否溢出？\n(4)I型访存指令imm为带符号数，地址计算时零扩展还是符号扩展？\n(5)无条件转移可用哪种格式？',
    mistakeType: '审题不清',
    importance: 5,
    correction: '正确答案：\n(1)ALU=16位（=字长）；主存空间=2^20=1MB（地址线20位、按字节编址）；IR=16位（=指令字长）；MAR=20位（=地址线）；MDR=8位（=数据线，不因字长16而扩到16）。位宽来源表：ALU←字长、IR←指令长、MAR←地址线、MDR←数据线，别张冠李戴。\n(2)R型操作码=低4位op1→2^4=16种；I型和J型共享高6位，但000000已划给R型→共2^6-1=63种；寄存器编号rs/rt/rd各2位→2^2=4个。\n(3)01B2H=0000 00 01 10 11 0010→R型,rs=R1,rt=R2,rd=R3,op1=0010减法→R[3]←R[1]-R[2]=B052H-0008H=B04AH；负减正结果仍为负(B04A最高位1)，符号未跳变→不溢出。01B3H op1=0011乘法→R[3]←R[1]×R[2]，真实值-20398×8=-163184远超16位补码范围[-32768,32767]→溢出；按位低16位=B052H×0008H=58290H取低16位=8290H。\n(4)符号扩展。imm是带符号偏移，零扩展会把负偏移变成大正数跳错地址，符号扩展保留正负。\n(5)J型。target直接写入PC低10位（段内绝对寻址），无条件、不需判标志。\n\n错因：位数题把字段看错/漏看——ALU答32(应16)、主存空间漏算、MAR整栏漏答；操作种类数把"数寄存器编号位数"和"数整个操作数字段"混淆；十六进制手算粗心(减法算成B046、乘法低16位算成0290H)。病根=位数来源表没背熟+条件没读满就上工具，与co-2013-44同源。\n\n同类提醒：位宽题先默写来源表(ALU←字长/IR←指令长/MAR←地址线/MDR←数据线)；操作种类数=看该格式独占或共享的操作码位数、别忘了全0前缀已被别格式占用；寄存器个数=看单个寄存器编号字段位数(2位→4个)；hex手算完回头对一遍最高位和借位。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  }
])
const activeTab = ref('list')
const showAddDialog = ref(false)
const selectedProblem = ref<WrongProblem | null>(null)

// 图片录入相关状态
const imageUploadMode = ref(false)
const uploadedImages = ref<string[]>([])
const imagePreviewUrl = ref('')
const ocrTipVisible = ref(true)

// 错题展开状态管理（记录每道题的订正笔记是否展开）
const expandedCorrections = ref<Set<string>>(new Set())

const newProblem = ref({
  subject: '408计算机',
  chapterId: '',
  chapterName: '',
  sectionId: '',
  sectionName: '',
  title: '',
  content: '',
  mistakeType: '',
  importance: 3,
  correction: ''
})

const mistakeTypes = [
  { value: '概念不清', label: '概念理解不清' },
  { value: '计算错误', label: '计算错误' },
  { value: '思路错误', label: '解题思路错误' },
  { value: '粗心大意', label: '粗心/审题不清' },
  { value: '不会做', label: '完全不会做' }
]

// 科目选项（全科错题本）
const subjectOptions = [
  { value: '数学一', label: '数学一' },
  { value: '英语一', label: '英语一' },
  { value: '政治', label: '政治' },
  { value: '408计算机', label: '408计算机' }
]

const getSubjectTagType = (subject?: string) => {
  const map: Record<string, string> = {
    '数学一': 'danger',
    '英语一': 'success',
    '政治': 'warning',
    '408计算机': 'primary'
  }
  return (map[subject || ''] || 'info') as 'danger' | 'success' | 'warning' | 'primary' | 'info'
}

const chapterFilter = ref('all')
const typeFilter = ref('all')
const masteredFilter = ref('all')
const subjectFilter = ref('all')

// 计算属性
const filteredProblems = computed(() => {
  return problems.value.filter(p => {
    if (subjectFilter.value !== 'all' && (p.subject || '408计算机') !== subjectFilter.value) return false
    if (chapterFilter.value !== 'all' && p.chapterId !== chapterFilter.value) return false
    if (typeFilter.value !== 'all' && p.mistakeType !== typeFilter.value) return false
    if (masteredFilter.value === 'mastered' && !p.mastered) return false
    if (masteredFilter.value === 'unmastered' && p.mastered) return false
    return true
  })
})

const chapters = computed(() => {
  const unique = new Map()
  problems.value.forEach(p => {
    if (!unique.has(p.chapterId)) {
      unique.set(p.chapterId, { id: p.chapterId, name: p.chapterName })
    }
  })
  return Array.from(unique.values())
})

const stats = computed(() => {
  const total = problems.value.length
  const mastered = problems.value.filter(p => p.mastered).length
  const unmastered = total - mastered
  
  const typeStats: Record<string, number> = {}
  problems.value.forEach(p => {
    typeStats[p.mistakeType] = (typeStats[p.mistakeType] || 0) + 1
  })
  
  return { total, mastered, unmastered, typeStats }
})

// 方法
const openAddDialog = () => {
  newProblem.value = {
    subject: '408计算机',
    chapterId: '',
    chapterName: '',
    sectionId: '',
    sectionName: '',
    title: '',
    content: '',
    mistakeType: '',
    importance: 3,
    correction: ''
  }
  showAddDialog.value = true
}

const addProblem = () => {
  if (!newProblem.value.title || !newProblem.value.mistakeType) {
    ElMessage.warning('请填写题目和错误类型')
    return
  }
  
  const problem: WrongProblem = {
    id: `wrong_${Date.now()}`,
    subject: newProblem.value.subject || '408计算机',
    chapterId: newProblem.value.chapterId || 'unknown',
    chapterName: newProblem.value.chapterName || '未分类',
    sectionId: newProblem.value.sectionId || '',
    sectionName: newProblem.value.sectionName || '',
    title: newProblem.value.title,
    content: newProblem.value.content,
    mistakeType: newProblem.value.mistakeType,
    importance: newProblem.value.importance,
    correction: newProblem.value.correction,
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  }
  
  problems.value.unshift(problem)
  saveToLocalStorage()
  showAddDialog.value = false
  ElMessage.success('错题添加成功')
}

const toggleMastered = (problem: WrongProblem) => {
  problem.mastered = !problem.mastered
  if (problem.mastered) {
    problem.reviewCount++
    problem.lastReviewAt = new Date().toISOString()
  }
  saveToLocalStorage()
  ElMessage.success(problem.mastered ? '已标记为掌握' : '已取消掌握')
}

const deleteProblem = (id: string) => {
  problems.value = problems.value.filter(p => p.id !== id)
  saveToLocalStorage()
  ElMessage.success('已删除')
}

const saveToLocalStorage = () => {
  wp.persist()
}

const loadFromLocalStorage = () => {
  mergeWangdaoSeed()
}

// 合并王道小程序错题重练卷种子数据（记录3400/3401/3402，计组90题）
// 按 id 与题干前20字（去空白后）双重去重，重复导入不会产生冗余
const mergeWangdaoSeed = () => {
  const norm = (s: string) => s.replace(/\s/g, '').slice(0, 20)
  const knownIds = new Set(problems.value.map(p => p.id))
  const knownStems = new Set(problems.value.map(p => norm(p.content)))
  const fresh = WANGDAO_CS_SEED.filter(s => !knownIds.has(s.id) && !knownStems.has(norm(s.content)))
  if (fresh.length > 0) {
    problems.value.push(...fresh)
    saveToLocalStorage()
  }
}

// ==================== 图片录入相关函数 ====================

const handleImageUpload = (file: File) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const base64 = e.target?.result as string
    uploadedImages.value.push(base64)
    imagePreviewUrl.value = base64
    ElMessage.success('图片上传成功！请手动提取题目内容并填写到下方表单')
  }
  reader.readAsDataURL(file)
  return false
}

const removeImage = (index: number) => {
  uploadedImages.value.splice(index, 1)
  if (uploadedImages.value.length === 0) {
    imagePreviewUrl.value = ''
  } else {
    imagePreviewUrl.value = uploadedImages.value[uploadedImages.value.length - 1]
  }
}

const toggleImageMode = () => {
  imageUploadMode.value = !imageUploadMode.value
  if (!imageUploadMode.value) {
    uploadedImages.value = []
    imagePreviewUrl.value = ''
  }
}

const copyOcrTemplate = () => {
  const template = `【题目标题】
【题目内容】
A. 
B. 
C. 
D. 
【正确答案】
【错误原因/解析】`
  navigator.clipboard.writeText(template).then(() => {
    ElMessage.success('模板已复制到剪贴板，请根据图片内容填写')
  })
}

const fillExampleData = () => {
  newProblem.value = {
    subject: '408计算机',
    chapterId: 'ch1',
    chapterName: '第一章 计算机系统概述',
    sectionId: '1.2',
    sectionName: '1.2 计算机系统的层次结构',
    title: '完整的计算机系统',
    content: '一个完整的计算机系统应包括（）。\nA. 系统硬件和系统软件\nB. 硬件系统和软件系统\nC. 主机、键盘、显示器和辅助存储器\nD. 主机及其外部设备',
    mistakeType: '概念不清',
    importance: 5,
    correction: '正确答案：B\n解析：计算机系统由硬件系统和软件系统两大部分组成。A选项的"系统硬件"和"系统软件"表述不准确；C、D只列举了部分硬件。'
  }
  ElMessage.success('已填充示例数据，您可以根据实际图片内容修改')
}

// ==================== 错题展开/折叠功能 ====================

// 切换订正笔记的展开/折叠状态
const toggleCorrection = (problemId: string) => {
  if (expandedCorrections.value.has(problemId)) {
    expandedCorrections.value.delete(problemId)
  } else {
    expandedCorrections.value.add(problemId)
  }
}

// 检查某道题的订正笔记是否展开
const isCorrectionExpanded = (problemId: string) => {
  return expandedCorrections.value.has(problemId)
}

const getMistakeTypeTag = (type: string) => {
  const map: Record<string, string> = {
    '概念不清': 'danger',
    '计算错误': 'warning',
    '思路错误': 'info',
    '粗心大意': 'success',
    '不会做': 'danger'
  }
  return map[type] || 'default'
}

const getImportanceStars = (level: number) => {
  return '⭐'.repeat(level)
}

// 格式化题目内容，按行分割
const formatContent = (content: string): string[] => {
  if (!content) return []
  // 按换行符分割，过滤空行
  return content.split('\n').filter(line => line.trim() !== '')
}

onMounted(() => {
  loadFromLocalStorage()
})

// 暴露方法供外部调用
defineExpose({
  openAddDialog,
  problems
})
</script>

<template>
  <div class="wrong-problems-container">
    <!-- 顶部统计 -->
    <div class="stats-bar">
      <div class="stat-item">
        <div class="stat-value">{{ stats.total }}</div>
        <div class="stat-label">总错题数</div>
      </div>
      <div class="stat-item mastered">
        <div class="stat-value">{{ stats.mastered }}</div>
        <div class="stat-label">已掌握</div>
      </div>
      <div class="stat-item unmastered">
        <div class="stat-value">{{ stats.unmastered }}</div>
        <div class="stat-label">未掌握</div>
      </div>
    </div>

    <!-- 功能标签页 -->
    <el-tabs v-model="activeTab" class="wrong-tabs">
      <el-tab-pane label="错题列表" name="list">
        <!-- 筛选栏 -->
        <div class="filter-bar">
          <el-button type="primary" @click="openAddDialog">
            <el-icon><Plus /></el-icon>
            添加错题
          </el-button>
          
          <el-space>
            <el-select v-model="subjectFilter" placeholder="按科目筛选" clearable style="width: 140px">
              <el-option label="全部科目" value="all" />
              <el-option
                v-for="sub in subjectOptions"
                :key="sub.value"
                :label="sub.label"
                :value="sub.value"
              />
            </el-select>

            <el-select v-model="chapterFilter" placeholder="按章节筛选" clearable style="width: 150px">
              <el-option label="全部章节" value="all" />
              <el-option 
                v-for="ch in chapters" 
                :key="ch.id" 
                :label="ch.name" 
                :value="ch.id" 
              />
            </el-select>
            
            <el-select v-model="typeFilter" placeholder="按类型筛选" clearable style="width: 150px">
              <el-option label="全部类型" value="all" />
              <el-option 
                v-for="type in mistakeTypes" 
                :key="type.value" 
                :label="type.label" 
                :value="type.value" 
              />
            </el-select>
            
            <el-select v-model="masteredFilter" placeholder="掌握状态" clearable style="width: 130px">
              <el-option label="全部" value="all" />
              <el-option label="已掌握" value="mastered" />
              <el-option label="未掌握" value="unmastered" />
            </el-select>
          </el-space>
        </div>

        <!-- 错题列表 -->
        <div class="problems-list">
          <el-card 
            v-for="problem in filteredProblems" 
            :key="problem.id"
            class="problem-card"
            :class="{ mastered: problem.mastered }"
          >
            <div class="problem-header">
              <div class="problem-title">
                <h4>{{ problem.title }}</h4>
                <div class="problem-tags">
                  <el-tag :type="getSubjectTagType(problem.subject)" size="small" effect="dark">
                    {{ problem.subject || '408计算机' }}
                  </el-tag>
                  <el-tag :type="getMistakeTypeTag(problem.mistakeType)" size="small">
                    {{ problem.mistakeType }}
                  </el-tag>
                  <span class="importance">{{ getImportanceStars(problem.importance) }}</span>
                </div>
              </div>
              <div class="problem-actions">
                <el-button 
                  :type="problem.mastered ? 'success' : 'default'"
                  size="small"
                  @click="toggleMastered(problem)"
                >
                  {{ problem.mastered ? '已掌握 ✓' : '标记掌握' }}
                </el-button>
                <el-button 
                  type="danger" 
                  size="small"
                  @click="deleteProblem(problem.id)"
                >
                  删除
                </el-button>
              </div>
            </div>
            
            <div class="problem-meta">
              <span>📚 {{ problem.chapterName }}</span>
              <span v-if="problem.sectionName">| {{ problem.sectionName }}</span>
              <span>| 📅 {{ new Date(problem.createdAt).toLocaleDateString() }}</span>
              <span v-if="problem.reviewCount > 0">| 复习 {{ problem.reviewCount }} 次</span>
            </div>
            
            <div v-if="problem.content" class="problem-content">
              <strong>题目内容：</strong>
              <div class="content-text">
                <div v-for="(line, index) in formatContent(problem.content)" :key="index" class="content-line">
                  {{ line }}
                </div>
              </div>
            </div>
            
            <div v-if="problem.correction" class="problem-correction">
              <div class="correction-header" @click="toggleCorrection(problem.id)">
                <strong>订正笔记</strong>
                <el-icon 
                  class="expand-icon" 
                  :class="{ expanded: isCorrectionExpanded(problem.id) }"
                >
                  <ArrowDown />
                </el-icon>
              </div>
              <transition name="expand">
                <div v-show="isCorrectionExpanded(problem.id)" class="correction-text">
                  {{ problem.correction }}
                </div>
              </transition>
            </div>
          </el-card>
          
          <div v-if="filteredProblems.length === 0" class="empty-state">
            <el-icon size="80" color="#c0c4cc"><DocumentChecked /></el-icon>
            <p>暂无错题记录</p>
            <el-button type="primary" @click="openAddDialog">添加第一道错题</el-button>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="统计分析" name="stats">
        <div class="stats-content">
          <el-card>
            <template #header>
              <h3>错误类型分布</h3>
            </template>
            <div class="type-stats">
              <div 
                v-for="(count, type) in stats.typeStats" 
                :key="type"
                class="type-stat-item"
              >
                <div class="type-label">
                  <el-tag :type="getMistakeTypeTag(type)">{{ type }}</el-tag>
                </div>
                <el-progress 
                  :percentage="Math.round((count / stats.total) * 100)" 
                  :stroke-width="20"
                />
                <div class="type-count">{{ count }} 题</div>
              </div>
            </div>
          </el-card>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 添加错题对话框 -->
    <el-dialog 
      v-model="showAddDialog" 
      title="添加错题"
      width="800px"
      :close-on-click-modal="false"
    >
      <!-- 图片录入模式切换按钮 -->
      <div style="margin-bottom: 16px; display: flex; gap: 12px; align-items: center;">
        <el-button 
          :type="imageUploadMode ? 'primary' : 'default'" 
          @click="toggleImageMode"
          :icon="Picture"
        >
          {{ imageUploadMode ? '关闭图片预览' : '启用图片录入模式' }}
        </el-button>
        <el-button 
          v-if="imageUploadMode" 
          @click="copyOcrTemplate"
          :icon="CopyDocument"
          size="small"
        >
          复制填写模板
        </el-button>
        <el-button 
          v-if="imageUploadMode && uploadedImages.length === 0" 
          @click="fillExampleData"
          :icon="MagicStick"
          size="small"
        >
          填充示例数据
        </el-button>
      </div>

      <!-- 图片上传和预览区域 -->
      <div v-if="imageUploadMode" style="margin-bottom: 20px; padding: 16px; background: #f5f7fa; border-radius: 8px;">
        <el-alert
          v-if="ocrTipVisible"
          title="💡 使用提示"
          type="info"
          :closable="true"
          @close="ocrTipVisible = false"
          style="margin-bottom: 12px"
        >
          <p style="margin: 4px 0;">1. 点击下方上传按钮或拖拽图片到此处</p>
          <p style="margin: 4px 0;">2. 查看右侧图片，手动提取题目内容</p>
          <p style="margin: 4px 0;">3. 将提取的内容填写到下方表单中</p>
          <p style="margin: 4px 0; color: #e6a23c;">⚠️ 目前需要手动录入，未来可集成OCR自动识别</p>
        </el-alert>

        <el-upload
          class="image-uploader"
          action="#"
          :auto-upload="false"
          :on-change="(file: any) => handleImageUpload(file.raw)"
          :show-file-list="false"
          accept="image/*"
          drag
          multiple
        >
          <el-icon class="el-icon--upload"><Upload /></el-icon>
          <div class="el-upload__text">
            拖拽图片到此处或 <em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">支持 JPG/PNG 格式，可同时上传多张图片</div>
          </template>
        </el-upload>

        <!-- 图片预览区 -->
        <div v-if="uploadedImages.length > 0" style="margin-top: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-weight: bold; color: #606266;">已上传 {{ uploadedImages.length }} 张图片</span>
            <el-button size="small" @click="uploadedImages = []; imagePreviewUrl = ''">清空全部</el-button>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px;">
            <div 
              v-for="(img, index) in uploadedImages" 
              :key="index"
              style="position: relative; border: 2px solid #dcdfe6; border-radius: 8px; overflow: hidden; cursor: pointer;"
              :style="{ borderColor: imagePreviewUrl === img ? '#409eff' : '#dcdfe6' }"
              @click="imagePreviewUrl = img"
            >
              <img :src="img" style="width: 100%; height: 150px; object-fit: cover;" />
              <div 
                style="position: absolute; top: 4px; right: 4px; background: rgba(0,0,0,0.6); color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; cursor: pointer;"
                @click.stop="removeImage(index)"
              >
                ×
              </div>
              <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.5); color: white; text-align: center; font-size: 12px; padding: 2px;">
                {{ index + 1 }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style="display: flex; gap: 20px;">
        <!-- 左侧：图片预览（大图） -->
        <div v-if="imageUploadMode && imagePreviewUrl" style="flex: 1; max-width: 400px;">
          <div style="border: 2px solid #409eff; border-radius: 8px; overflow: hidden; background: #fff;">
            <img :src="imagePreviewUrl" style="width: 100%; max-height: 600px; object-fit: contain;" />
          </div>
          <p style="text-align: center; color: #909399; font-size: 12px; margin-top: 8px;">
            👆 点击图片放大查看细节
          </p>
        </div>

        <!-- 右侧：表单填写区 -->
        <el-form :model="newProblem" label-position="top" :style="{ flex: imageUploadMode ? 1 : 1 }">
        <el-form-item label="所属科目">
          <el-select v-model="newProblem.subject" placeholder="选择科目" style="width: 100%">
            <el-option
              v-for="sub in subjectOptions"
              :key="sub.value"
              :label="sub.label"
              :value="sub.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="所属章节">
          <el-input v-model="newProblem.chapterName" placeholder="例如：第一章 计算机系统概述" />
        </el-form-item>
        
        <el-form-item label="所属小节">
          <el-input v-model="newProblem.sectionName" placeholder="例如：1.1 计算机发展历程（可选）" />
        </el-form-item>
        
        <el-form-item label="题目标题">
          <el-input v-model="newProblem.title" placeholder="简要描述题目" />
        </el-form-item>
        
        <el-form-item label="题目内容">
          <el-input 
            v-model="newProblem.content" 
            type="textarea" 
            :rows="4"
            placeholder="详细的题目内容..."
          />
        </el-form-item>
        
        <el-form-item label="错误类型">
          <el-select v-model="newProblem.mistakeType" placeholder="选择错误类型" style="width: 100%">
            <el-option 
              v-for="type in mistakeTypes" 
              :key="type.value" 
              :label="type.label" 
              :value="type.value" 
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="重要程度">
          <el-rate v-model="newProblem.importance" :max="5" />
        </el-form-item>
        
        <el-form-item label="订正笔记">
          <el-input 
            v-model="newProblem.correction" 
            type="textarea" 
            :rows="4"
            placeholder="正确的解题思路和答案（可选）"
          />
        </el-form-item>
      </el-form>
      </div>
      
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="addProblem">添加</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.wrong-problems-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  
  .stats-bar {
    display: flex;
    gap: 20px;
    padding: 16px;
    background: linear-gradient(135deg, #16345c 0%, #1e4576 100%);
    border-radius: 12px;
    margin-bottom: 16px;
    
    .stat-item {
      flex: 1;
      text-align: center;
      color: white;
      
      &.mastered {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        padding: 8px;
      }
      
      &.unmastered {
        background: rgba(255, 255, 255, 0.15);
        border-radius: 8px;
        padding: 8px;
      }
      
      .stat-value {
        font-size: 2em;
        font-weight: 700;
        margin-bottom: 4px;
      }
      
      .stat-label {
        font-size: 0.9em;
        opacity: 0.9;
      }
    }
  }
  
  .wrong-tabs {
    flex: 1;
    display: flex;
    flex-direction: column;
    
    :deep(.el-tabs__content) {
      flex: 1;
      overflow-y: auto;
      padding: 16px 0;
    }
  }
  
  .filter-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding: 12px;
    background: #f5f7fa;
    border-radius: 8px;
  }
  
  .problems-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    
    .problem-card {
      transition: all 0.3s;
      border-left: 4px solid #ffc53d;
      
      &.mastered {
        border-left-color: #67c23a;
        opacity: 0.7;
        
        .problem-title h4 {
          text-decoration: line-through;
          color: #909399;
        }
      }
      
      &:hover {
        transform: translateX(4px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      
      .problem-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 12px;
        
        .problem-title {
          flex: 1;
          
          h4 {
            margin: 0 0 8px 0;
            color: #303133;
            font-size: 1.1em;
          }
          
          .problem-tags {
            display: flex;
            gap: 8px;
            align-items: center;
            
            .importance {
              font-size: 0.9em;
            }
          }
        }
        
        .problem-actions {
          display: flex;
          gap: 8px;
        }
      }
      
      .problem-meta {
        font-size: 0.85em;
        color: #909399;
        margin-bottom: 12px;
        padding-bottom: 12px;
        border-bottom: 1px solid #ebeef5;
        
        span {
          margin-right: 8px;
        }
      }
      
      .problem-content,
      .problem-correction {
        margin-bottom: 12px;
        
        strong {
          display: block;
          margin-bottom: 8px;
          color: #606266;
          font-size: 0.95em;
        }
        
        // 订正笔记头部（可点击）
        .correction-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 12px;
          background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          user-select: none;
          
          &:hover {
            background: linear-gradient(135deg, #ffe0b2 0%, #ffcc80 100%);
            box-shadow: 0 2px 8px rgba(255, 152, 0, 0.2);
          }
          
          strong {
            margin: 0;
            color: #e65100;
            font-weight: 600;
          }
          
          .expand-icon {
            transition: transform 0.3s;
            color: #ff9800;
            font-size: 18px;
            
            &.expanded {
              transform: rotate(180deg);
            }
          }
        }
        
        .content-text,
        .correction-text {
          padding: 16px;
          background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
          border-radius: 8px;
          line-height: 1.8;
          color: #303133;
          font-size: 0.95em;
        }
        
        .content-text {
          .content-line {
            padding: 6px 0;
            min-height: 24px;
            
            // 题目前缀（非选项行）
            &:first-child:not(:only-child) {
              font-weight: 600;
              color: #303133;
              padding-bottom: 10px;
              border-bottom: 1px dashed #dcdfe6;
              margin-bottom: 8px;
            }
            
            // 选项行样式
            &:not(:first-child) {
              padding-left: 16px;
              position: relative;
              transition: all 0.2s;
              
              &:hover {
                background: rgba(13, 33, 55, 0.06);
                border-radius: 4px;
                padding-left: 20px;
              }
              
              // 选项标识符（A. B. C. D.）加粗
              &::before {
                content: '';
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                width: 4px;
                height: 4px;
                background: #16345c;
                border-radius: 50%;
              }
            }
          }
        }
        
        .correction-text {
          white-space: pre-wrap;
          background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
          border-left: 3px solid #ff9800;
          margin-top: 8px;
        }
      }
    }
    
    // 展开/折叠动画
    .expand-enter-active,
    .expand-leave-active {
      transition: all 0.3s ease;
      overflow: hidden;
    }
    
    .expand-enter-from,
    .expand-leave-to {
      opacity: 0;
      max-height: 0;
      padding: 0 16px;
    }
    
    .expand-enter-to,
    .expand-leave-from {
      opacity: 1;
      max-height: 500px;
      padding: 16px;
    }
    
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #909399;
      
      p {
        margin: 16px 0;
        font-size: 1.1em;
      }
    }
  }
  
  .stats-content {
    .type-stats {
      display: flex;
      flex-direction: column;
      gap: 16px;
      
      .type-stat-item {
        display: flex;
        align-items: center;
        gap: 12px;
        
        .type-label {
          min-width: 100px;
        }
        
        :deep(.el-progress) {
          flex: 1;
        }
        
        .type-count {
          min-width: 60px;
          text-align: right;
          font-weight: 600;
          color: #606266;
        }
      }
    }
  }
}
</style>

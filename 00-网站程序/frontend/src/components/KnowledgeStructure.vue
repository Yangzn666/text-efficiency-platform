<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import katex from 'katex'
import 'katex/dist/katex.min.css'

interface KnowledgePoint {
  id: string
  title: string
  content: string
  category: string
  difficulty: '基础' | '中等' | '困难'
  importance: 'high' | 'medium' | 'low'
  progress: number
  keyPoints: string[]
  prerequisites?: string[]
  relatedPoints?: string[]
}

interface SubjectConfig {
  name: string
  color: string
  description: string
  categories: string[]
}

const props = defineProps<{
  subject: string
}>()

const activeCategory = ref('')
const selectedPoint = ref<KnowledgePoint | null>(null)
const searchTerm = ref('')

// 学科配置
const subjectConfigs: Record<string, SubjectConfig> = {
  math: {
    name: '数学',
    color: '#FF6B6B',
    description: '高等数学、线性代数、概率论与数理统计',
    categories: ['高等数学', '线性代数', '概率论与数理统计']
  },
  english: {
    name: '英语',
    color: '#4ECDC4',
    description: '阅读理解、完形填空、翻译、写作',
    categories: ['词汇', '语法', '阅读', '写作']
  },
  politics: {
    name: '政治',
    color: '#45B7D1',
    description: '马原、毛中特、史纲、思修法基',
    categories: ['马克思主义原理', '毛泽东思想', '中国近现代史', '思想道德修养']
  },
  cs408: {
    name: '计算机专业课',
    color: '#96CEB4',
    description: '数据结构、计算机组成原理、操作系统、计算机网络',
    categories: ['数据结构', '组成原理', '操作系统', '计算机网络']
  }
}

const currentConfig = computed(() => {
  return subjectConfigs[props.subject] || subjectConfigs.math
})

// 知识点数据
const knowledgePoints = ref<KnowledgePoint[]>([
  // 高等数学知识点（从本地文件导入）
  {
    id: 'am_chapter1',
    title: '第1讲 函数、极限、连续',
    content: `★ 第1讲 函数、极限、连续核心知识点

1. 函数的概念与性质
   - 函数的定义域、值域、对应法则
   - 复合函数、反函数
   - 基本初等函数：幂函数、指数函数、对数函数、三角函数、反三角函数
   - 函数的奇偶性、单调性、周期性、有界性

2. 极限的概念
   - 数列极限：$\lim_{n\to\infty} x_n = a$
   - 函数极限：$\lim_{x\to x_0} f(x) = A$，$\lim_{x\to\infty} f(x) = A$
   - 左极限与右极限：$\lim_{x\to x_0^-} f(x)$，$\lim_{x\to x_0^+} f(x)$
   - 极限的性质：唯一性、局部有界性、保号性

3. 极限的运算法则
   - 四则运算法则
   - 复合函数的极限
   - 夹逼准则
   - 单调有界准则

4. 无穷小与无穷大
   - 无穷小的比较：高阶、低阶、同阶、等价无穷小
   - 无穷大的定义与性质
   - 重要等价无穷小：$\sin x \sim x$，$\tan x \sim x$，$\arcsin x \sim x$，$\arctan x \sim x$，$e^x-1 \sim x$，$\ln(1+x) \sim x$

5. 函数的连续性
   - 连续的定义：$\lim_{x\to x_0} f(x) = f(x_0)$
   - 间断点的分类：第一类间断点（可去间断点、跳跃间断点）、第二类间断点
   - 连续函数的运算性质
   - 初等函数在其定义区间内连续

6. 闭区间上连续函数的性质
   - 最大值最小值定理
   - 介值定理
   - 零点定理`,
    category: '高等数学',
    difficulty: '基础',
    importance: 'high',
    progress: 0,
    keyPoints: ['函数性质', '极限概念', '连续性', '间断点']
  },
  {
    id: 'am_chapter2',
    title: '第2讲 数列极限',
    content: `★ 第2讲 数列极限核心知识点

1. 数列极限的定义
   - 定义：若对于任意给定的正数$\varepsilon$，总存在正整数N，使得当$n>N$时，恒有$|x_n-a|<\varepsilon$成立，则称常数a是数列$\{x_n\}$的极限
   - 几何意义：在a的$\varepsilon$邻域之外，数列$\{x_n\}$中至多只有有限项

2. 收敛数列的性质
   - 极限的唯一性
   - 收敛数列必定有界
   - 收敛数列的保号性
   - 收敛数列与其子数列的关系

3. 数列极限存在的准则
   - 夹逼准则：若$y_n \leq x_n \leq z_n$，且$\lim y_n = \lim z_n = a$，则$\lim x_n = a$
   - 单调有界准则：单调有界数列必有极限

4. 重要极限
   - $\lim_{n\to\infty} (1+\frac{1}{n})^n = e$
   - $\lim_{n\to\infty} \sqrt[n]{n} = 1$
   - $\lim_{n\to\infty} \frac{a^n}{n!} = 0$ (其中$a$为常数)

5. 数列极限的计算方法
   - 利用极限的四则运算法则
   - 利用重要极限
   - 利用夹逼准则
   - 利用单调有界准则
   - 利用等价无穷小替换`,
    category: '高等数学',
    difficulty: '基础',
    importance: 'high',
    progress: 0,
    keyPoints: ['数列极限定义', '收敛准则', '重要极限', '计算方法']
  },
  {
    id: 'am_chapter3',
    title: '第3讲 一元函数微分学的概念',
    content: `★ 第3讲 一元函数微分学的概念核心知识点

1. 导数的概念
   - 导数的定义：$f'(x_0) = \lim_{\Delta x\to 0} \frac{f(x_0+\Delta x)-f(x_0)}{\Delta x} = \lim_{x\to x_0} \frac{f(x)-f(x_0)}{x-x_0}$
   - 导数的几何意义：函数在某点处切线的斜率
   - 导数的物理意义：瞬时变化率
   - 左导数与右导数

2. 求导法则
   - 基本初等函数的导数公式
   - 四则运算法则
   - 复合函数求导法则（链式法则）
   - 反函数求导法则
   - 隐函数求导法
   - 参数方程求导法

3. 高阶导数
   - 二阶导数：$f''(x) = [f'(x)]'$
   - n阶导数的一般表达式
   - 莱布尼茨公式：$(uv)^{(n)} = \sum_{k=0}^{n} C_n^k u^{(k)} v^{(n-k)}$

4. 微分
   - 微分的定义：$dy = f'(x)dx$
   - 微分的几何意义
   - 微分的运算法则
   - 微分形式不变性

5. 导数与微分的关系
   - 可导必可微，可微必可导
   - $dy = f'(x)dx$，$\Delta y = f'(x)\Delta x + o(\Delta x)$`,
    category: '高等数学',
    difficulty: '中等',
    importance: 'high',
    progress: 0,
    keyPoints: ['导数定义', '求导法则', '高阶导数', '微分概念']
  },
  {
    id: 'am_chapter4',
    title: '第4讲 一元函数微分学的计算',
    content: `★ 第4讲 一元函数微分学的计算核心知识点

1. 基本求导公式
   - $(c)\' = 0$ (c为常数)
   - $(x^\\mu)\' = \\mu x^{\\mu-1}$ (μ为常数)
   - $(\\sin x)\' = \\cos x$
   - $(\\cos x)\' = -\\sin x$
   - $(\\tan x)\' = \\sec^2 x$

2. 求导法则
   - 四则运算法则：$(u\\pm v)\' = u\'\\pm v\'$，$(uv)\' = u\'v + uv\'$
   - 复合函数求导法则：$[f(\\varphi(x))]\' = f\'(u)\\varphi\'(x)$

3. 隐函数求导法和参数方程求导法`,
    category: '高等数学',
    difficulty: '中等',
    importance: 'high',
    progress: 0,
    keyPoints: ['基本公式', '求导法则', '隐函数求导']
  },
  {
    id: 'am_chapter5',
    title: '第5讲 一元函数微分学的应用(一)',
    content: `★ 第5讲 核心知识点

1. 微分中值定理
   - 罗尔定理、拉格朗日中值定理

2. 洛必达法则
   - 处理未定式极限

3. 函数的单调性与极值

4. 曲线的凹凸性与拐点`,
    category: '高等数学',
    difficulty: '中等',
    importance: 'high',
    progress: 0,
    keyPoints: ['中值定理', '洛必达法则', '单调性极值']
  },
  {
    id: 'am_chapter6',
    title: '第6讲 一元函数微分学的应用(二)',
    content: `★ 第6讲 核心知识点

1. 泰勒公式
   - 带余项的泰勒公式
   - 常用麦克劳林公式

2. 函数的最值

3. 弧微分与曲率`,
    category: '高等数学',
    difficulty: '困难',
    importance: 'high',
    progress: 0,
    keyPoints: ['泰勒公式', '函数最值', '曲率']
  },
  // 继续添加更多高等数学章节...
  {
    id: 'am_chapter7',
    title: '第7讲 一元函数微分学的应用(三)',
    content: `★ 第7讲 物理应用与经济应用

1. 相关变化率问题
2. 最大值最小值应用问题
3. 经济学中的边际分析`,
    category: '高等数学',
    difficulty: '中等',
    importance: 'high',
    progress: 0,
    keyPoints: ['相关变化率', '最值应用', '边际分析']
  },
  {
    id: 'am_chapter8',
    title: '第8讲 一元函数积分学的概念与性质',
    content: `★ 第8讲 核心知识点

1. 原函数与不定积分
2. 定积分的概念与性质
3. 微积分基本定理`,
    category: '高等数学',
    difficulty: '中等',
    importance: 'high',
    progress: 0,
    keyPoints: ['不定积分', '定积分', '微积分基本定理']
  },
  {
    id: 'am_chapter9',
    title: '第9讲 一元函数积分学的计算',
    content: `★ 第9讲 核心知识点

1. 基本积分公式
2. 换元积分法
3. 分部积分法`,
    category: '高等数学',
    difficulty: '中等',
    importance: 'high',
    progress: 0,
    keyPoints: ['基本公式', '换元法', '分部积分']
  },
  {
    id: 'am_chapter10',
    title: '第10讲 一元函数积分学的应用(一)',
    content: `★ 第10讲 核心知识点

1. 平面图形的面积
2. 旋转体的体积
3. 曲线的弧长`,
    category: '高等数学',
    difficulty: '中等',
    importance: 'high',
    progress: 0,
    keyPoints: ['面积计算', '体积计算', '弧长计算']
  },
  {
    id: 'am_chapter11',
    title: '第11讲 多元函数积分学的应用',
    content: `★ 第11讲 核心知识点

1. 二重积分的概念与性质
2. 二重积分的计算
3. 三重积分`,
    category: '高等数学',
    difficulty: '困难',
    importance: 'high',
    progress: 0,
    keyPoints: ['二重积分', '三重积分', '多重积分']
  },
  {
    id: 'am_chapter12',
    title: '第12讲 一元函数积分学的应用(三)',
    content: `★ 第12讲 核心知识点

1. 物理应用
2. 几何应用
3. 经济应用`,
    category: '高等数学',
    difficulty: '中等',
    importance: 'high',
    progress: 0,
    keyPoints: ['物理应用', '几何应用', '经济应用']
  },
  {
    id: 'am_chapter13',
    title: '第13讲 多元函数微分学',
    content: `★ 第13讲 核心知识点

1. 多元函数的极限与连续
2. 偏导数
3. 全微分`,
    category: '高等数学',
    difficulty: '困难',
    importance: 'high',
    progress: 0,
    keyPoints: ['偏导数', '全微分', '多元函数']
  },
  {
    id: 'am_chapter14',
    title: '第14讲 二重积分',
    content: `★ 第14讲 核心知识点

1. 二重积分的概念
2. 直角坐标系下计算
3. 极坐标系下计算`,
    category: '高等数学',
    difficulty: '困难',
    importance: 'high',
    progress: 0,
    keyPoints: ['二重积分计算', '坐标变换', '应用']
  },
  {
    id: 'am_chapter15',
    title: '第15讲 微分方程',
    content: `★ 第15讲 核心知识点

1. 微分方程的基本概念
2. 一阶微分方程
3. 二阶线性微分方程`,
    category: '高等数学',
    difficulty: '困难',
    importance: 'high',
    progress: 0,
    keyPoints: ['一阶方程', '二阶方程', '线性方程']
  },
  {
    id: 'am_chapter16',
    title: '第16讲 无穷级数',
    content: `★ 第16讲 核心知识点

1. 数项级数的概念与性质
2. 正项级数审敛法
3. 交错级数
4. 幂级数`,
    category: '高等数学',
    difficulty: '困难',
    importance: 'high',
    progress: 0,
    keyPoints: ['级数收敛', '幂级数', '傅里叶级数']
  },
  {
    id: 'am_chapter17',
    title: '第17讲 多元函数积分学的预备知识',
    content: `★ 第17讲 核心知识点

1. 向量代数
2. 空间解析几何
3. 多元函数的极限`,
    category: '高等数学',
    difficulty: '中等',
    importance: 'medium',
    progress: 0,
    keyPoints: ['向量代数', '空间几何', '多元极限']
  },
  {
    id: 'am_chapter18',
    title: '第18讲 多元函数积分学',
    content: `★ 第18讲 核心知识点

1. 三重积分
2. 曲线积分
3. 曲面积分
4. 各种积分之间的关系`,
    category: '高等数学',
    difficulty: '困难',
    importance: 'high',
    progress: 0,
    keyPoints: ['三重积分', '曲线积分', '曲面积分']
  },
  // 完全同步你本地的线性代数知识点内容
  {
    id: 'la_chapter1',
    title: '第一章 行列式',
    content: `★ 第一章 行列式核心知识点

1. 行列式的定义
   - 二阶行列式：$\\begin{vmatrix} a_{11} & a_{12} \\\\ a_{21} & a_{22} \\end{vmatrix} = a_{11}a_{22} - a_{12}a_{21}$
   - n阶行列式：$D = \\sum_{j_1 j_2 \\cdots j_n} (-1)^{t(j_1 j_2 \\cdots j_n)} a_{1j_1} a_{2j_2} \\cdots a_{nj_n}$，其中t为逆序数

2. 行列式的性质
   - 性质1：行列式与它的转置行列式相等
   - 性质2：互换行列式的两行（列），行列式变号
   - 性质3：行列式中某行（列）的所有元素的公因子可以提到行列式符号外面
   - 性质4：若行列式中有两行（列）元素成比例，则此行列式等于零
   - 性质5：若行列式中有一行（列）全为零，则此行列式等于零
   - 性质6：把行列式的某一行（列）的各元素都乘以同一数后加到另一行（列）对应的元素上去，行列式不变

3. 行列式的计算方法
   - 化三角形法
   - 降阶法（按行或列展开）
   - 加边法
   - 递推法
   - 范德蒙德行列式：$\\begin{vmatrix} 1 & 1 & \\cdots & 1 \\\\ x_1 & x_2 & \\cdots & x_n \\\\ \\vdots & \\vdots & & \\vdots \\\\ x_1^{n-1} & x_2^{n-1} & \\cdots & x_n^{n-1} \\end{vmatrix} = \\prod_{i>j}(x_i-x_j)$
   - 爪型行列式、循环行列式等特殊类型

4. 重要公式和结论
   - $|A| = |A^T|$
   - $|kA| = k^n|A|$ (A为n阶方阵)
   - $|AB| = |A||B|$
   - $|A^{-1}| = \\frac{1}{|A|}$
   - $|A^*| = |A|^{n-1}$ (A为n阶方阵)
   - $A \\cdot A^* = A^* \\cdot A = |A|E$`,
    category: '线性代数',
    difficulty: '基础',
    importance: 'high',
    progress: 85,
    keyPoints: ['行列式定义', '性质应用', '计算方法', '范德蒙德行列式']
  },
  {
    id: 'la_chapter2',
    title: '第二章 矩阵',
    content: `★ 第二章 矩阵核心知识点

1. 矩阵的概念
   - 由m×n个数$a_{ij}(i=1,2,...,m;j=1,2,...,n)$排成的m行n列的数表称为m×n矩阵
   - 特殊矩阵：零矩阵、单位矩阵、对角矩阵、数量矩阵、上（下）三角矩阵、对称矩阵、反对称矩阵、正交矩阵

2. 矩阵的运算
   - 加法：$A+B=B+A$，$(A+B)+C=A+(B+C)$
   - 数乘：$k(A+B)=kA+kB$，$(k+l)A=kA+lA$
   - 乘法：$AB≠BA$（一般情况下），$(AB)C=A(BC)$
   - 转置：$(A^T)^T=A$，$(A+B)^T=A^T+B^T$，$(kA)^T=kA^T$，$(AB)^T=B^TA^T$
   - 方阵多项式：对于方阵A，$f(A)=a_0E+a_1A+...+a_mA^m$

3. 逆矩阵
   - 定义：设A为n阶方阵，若存在n阶方阵B使得$AB=BA=E$，则称A可逆，B为A的逆矩阵
   - 判定：A可逆 $\\iff |A|≠0$
   - 求法：$A^{-1} = \\frac{A^*}{|A|}$，其中$A^*$为A的伴随矩阵
   - 重要性质：$(AB)^{-1} = B^{-1}A^{-1}$，$(A^T)^{-1} = (A^{-1})^T$

4. 矩阵的初等变换
   - 初等行变换与初等列变换
   - 初等矩阵的定义及性质
   - 矩阵的标准形：任意矩阵可通过初等变换化为标准形$\\begin{pmatrix} I_r & 0 \\\\ 0 & 0 \\end{pmatrix}$
   - 矩阵的秩：行阶梯形矩阵的非零行数

5. 分块矩阵
   - 分块对角矩阵的性质
   - 分块矩阵的运算规律
   - 准对角矩阵的行列式：$\\begin{vmatrix} A & 0 \\\\ 0 & D \\end{vmatrix} = |A||D|$

6. 重要公式和结论
   - $(A^{-1})^{-1} = A$
   - $(A^T)^{-1} = (A^{-1})^T$
   - $(kA)^{-1} = \\frac{1}{k}A^{-1} (k≠0)$
   - $A^{-1} = \\frac{1}{|A|}A^*$`,
    category: '线性代数',
    difficulty: '中等',
    importance: 'high',
    progress: 78,
    keyPoints: ['矩阵运算', '逆矩阵', '矩阵秩', '分块矩阵']
  },
  {
    id: 'la_chapter3',
    title: '第三章 向量',
    content: `★ 第三章 向量核心知识点

1. 向量的概念
   - n维向量：n个数组成的有序数组
   - 向量的线性运算：加法、数乘

2. 向量组的线性相关性
   - 线性组合与线性表示
   - 线性相关与线性无关的定义
   - 线性相关性的判定定理
   - 线性相关性的充要条件：向量组$\\alpha_1,\\alpha_2,...,\\alpha_s$线性相关$\\iff$存在某个向量可由其余向量线性表示

3. 向量组的秩
   - 极大线性无关组
   - 向量组的秩与矩阵的秩的关系
   - 向量组等价的概念

4. 线性方程组解的结构
   - 齐次线性方程组的基础解系
   - 非齐次线性方程组解的结构

5. 向量空间
   - 向量空间的定义与性质
   - 向量空间的基与维数
   - 向量在基下的坐标
   - 过渡矩阵与坐标变换

6. 线性无关向量组的正交规范化
   - 向量的内积：$(\\alpha,\\beta) = \\alpha^T\\beta$
   - 正交向量组：$(\\alpha_i,\\alpha_j) = 0 (i≠j)$
   - 施密特正交化方法：$\\beta_1 = \\alpha_1$，$\\beta_2 = \\alpha_2 - \\frac{(\\alpha_2,\\beta_1)}{(\\beta_1,\\beta_1)}\\beta_1$，...
   - 正交矩阵：$Q^TQ = E$，$Q^T = Q^{-1}$，$|Q| = ±1$

7. 重要结论
   - n+1个n维向量必线性相关
   - 线性无关向量组的任意部分组线性无关
   - 线性无关向量组可扩充为线性无关向量组`,
    category: '线性代数',
    difficulty: '中等',
    importance: 'high',
    progress: 72,
    keyPoints: ['线性相关性', '向量组秩', '正交化', '向量空间']
  },
  {
    id: 'la_chapter4',
    title: '第四章 线性方程组',
    content: `★ 第四章 线性方程组核心知识点

1. 线性方程组的表达形式
   - 一般形式：$a_{11}x_1+a_{12}x_2+...+a_{1n}x_n=b_1$
              $a_{21}x_1+a_{22}x_2+...+a_{2n}x_n=b_2$
              $...$
              $a_{m1}x_1+a_{m2}x_2+...+a_{mn}x_n=b_m$
   - 矩阵形式：$AX=b$
   - 向量形式：$x_1\\alpha_1+x_2\\alpha_2+...+x_n\\alpha_n=b$

2. 线性方程组解的判定
   - $R(A)≠R(A,b) \\iff$ 方程组无解
   - $R(A)=R(A,b)=n \\iff$ 方程组有唯一解
   - $R(A)=R(A,b)<n \\iff$ 方程组有无穷多解

3. 线性方程组的求解方法
   - 高斯消元法
   - 克拉默法则（仅适用于系数矩阵为方阵且行列式不为零的情况）

4. 齐次线性方程组 $AX=0$
   - 解的性质：若$X_1,X_2$是解，则$k_1X_1+k_2X_2$也是解
   - 解空间：解集合构成向量空间
   - 基础解系：解空间的基
   - 基础解系所含向量个数 $= n - R(A)$

5. 非齐次线性方程组 $AX=b$
   - 解的性质：
     * 若$X_1,X_2$是$AX=b$的解，则$X_1-X_2$是$AX=0$的解
     * 若$X$是$AX=0$的解，$X^*$是$AX=b$的特解，则$X+X^*$是$AX=b$的解
   - 通解结构：$AX=b$的通解 $=$ $AX=0$的通解 $+$ $AX=b$的特解

6. 公共解与同解问题
   - 两个方程组有公共解的判定方法
   - 两个方程组同解的充要条件

7. 重要结论
   - $AX=0$的解都是$BX=0$的解$\\iff R(A)≥R(B)$
   - $AX=0$与$BX=0$同解$\\iff R(A)=R(B)$，且A,B行向量组等价`,
    category: '线性代数',
    difficulty: '中等',
    importance: 'high',
    progress: 65,
    keyPoints: ['解的判定', '求解方法', '解的结构', '公共解']
  },
  {
    id: 'la_chapter5',
    title: '第五章 特征值与特征向量',
    content: `★ 第五章 特征值与特征向量核心知识点

1. 特征值与特征向量
   - 定义：设A为n阶方阵，若存在数λ和非零向量α使得$A\\alpha=\\lambda\\alpha$，则λ为A的特征值，α为对应的特征向量
   - 特征值的求法：解特征方程$|\\lambda E-A|=0$
   - 特征向量的求法：解齐次方程组$(\\lambda E-A)x=0$

2. 相似矩阵
   - 定义：若存在可逆矩阵P使得$B=P^{-1}AP$，则称A与B相似
   - 相似矩阵的性质：特征值相同，行列式相等，迹相等

3. 矩阵的对角化
   - n阶方阵A可对角化的充要条件：A有n个线性无关的特征向量
   - 实对称矩阵一定可以对角化，且可用正交矩阵对角化

4. 特征值与特征向量的性质
   - 设λ是A的特征值，则：
     * kλ是kA的特征值
     * $\\lambda^m$是$A^m$的特征值（A可逆时，m可为负数）
     * $\\frac{1}{\\lambda}$是$A^{-1}$的特征值（A可逆时）
     * $\\frac{|A|}{\\lambda}$是$A^*$的特征值（A可逆时）
   - A的各行元素之和为k，则k是A的特征值，$(1,1,...,1)^T$是其特征向量
   - $tr(A) = \\sum\\lambda_i = \\sum a_{ii}$
   - $|A| = \\prod\\lambda_i$

5. 实对称矩阵的性质
   - 特征值全为实数
   - 不同特征值对应的特征向量正交
   - 对于r重特征值λ，齐次方程组$(\\lambda E-A)x=0$的基础解系含r个解向量
   - 必可对角化，且存在正交矩阵Q，使$Q^TAQ = \\Lambda$

6. 矩阵可对角化的判定
   - A有n个不同的特征值$\\implies$A可对角化
   - A的任一特征值的几何重数等于代数重数$\\iff$A可对角化
   - 对A的r重特征值λ，$R(\\lambda E-A) = n-r\\iff$λ的几何重数等于代数重数

7. 重要结论
   - $A\\sim B\\implies A^k\\sim B^k$
   - $A\\sim B\\implies \\varphi(A)\\sim \\varphi(B)$，其中φ为多项式`,
    category: '线性代数',
    difficulty: '困难',
    importance: 'high',
    progress: 58,
    keyPoints: ['特征值特征向量', '相似矩阵', '对角化', '实对称矩阵']
  },
  {
    id: 'la_chapter6',
    title: '第六章 二次型',
    content: `★ 第六章 二次型核心知识点

1. 二次型及其矩阵表示
   - 二次型：$f(x_1,x_2,...,x_n)=\\sum\\sum a_{ij}x_ix_j$
   - 二次型的矩阵表示：$f=X^TAX$

2. 标准形
   - 用配方法化二次型为标准形
   - 用正交变换化二次型为标准形
   - 用合同变换化二次型为标准形

3. 规范形（惯性定理）
   - 二次型的标准形不唯一，但正负惯性指数唯一
   - 正惯性指数：标准形中正平方项的个数
   - 负惯性指数：标准形中负平方项的个数
   - 符号差 = 正惯性指数 - 负惯性指数

4. 合同矩阵
   - 定义：若存在可逆矩阵C，使得$B=C^TAC$，则称A与B合同
   - 合同变换保持矩阵的秩和正负惯性指数
   - A与B合同$\\iff$A与B有相同的秩和正负惯性指数

5. 正定二次型与正定矩阵
   - 定义：对于任意非零向量X，都有$X^TAX>0$，则称A为正定矩阵
   - 判定方法：
     * 所有特征值大于零
     * 各阶顺序主子式大于零
     * A的各阶顺序主子式均为正
     * A与E合同
     * A可逆且$A=C^TC$（C可逆）

6. 其他有定性
   - 负定：$\\forall X≠0$，$X^TAX<0$，$\\iff$特征值全小于0，或顺序主子式奇数阶为负、偶数阶为正
   - 半正定：$\\forall X$，$X^TAX≥0$，$\\iff$特征值全非负
   - 半负定：$\\forall X$，$X^TAX≤0$，$\\iff$特征值全非正
   - 不定：既不是半正定也不是半负定，$\\iff$特征值既有正数又有负数

7. 重要结论
   - 二次型$f=X^TAX$经可逆线性变换$X=CY$化为$f=Y^T(C^TAC)Y$
   - 实对称矩阵A正定$\\iff$A的特征值全大于零
   - 实对称矩阵A负定$\\iff$A的特征值全小于零
   - 实对称矩阵A半正定$\\iff$A的特征值全非负`,
    category: '线性代数',
    difficulty: '中等',
    importance: 'high',
    progress: 52,
    keyPoints: ['二次型', '标准形', '正定性', '合同矩阵']
  }
])

// 计算属性
const filteredPoints = computed(() => {
  let points = knowledgePoints.value
  
  if (activeCategory.value) {
    points = points.filter(point => point.category === activeCategory.value)
  }
  
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    points = points.filter(point => 
      point.title.toLowerCase().includes(term) ||
      point.content.toLowerCase().includes(term) ||
      point.keyPoints.some(kp => kp.toLowerCase().includes(term))
    )
  }
  
  return points
})

const pointsByCategory = computed(() => {
  const grouped: Record<string, KnowledgePoint[]> = {}
  filteredPoints.value.forEach(point => {
    if (!grouped[point.category]) {
      grouped[point.category] = []
    }
    grouped[point.category].push(point)
  })
  return grouped
})

const getDifficultyColor = (difficulty: string) => {
  const colors: Record<string, string> = {
    '基础': '#4CAF50',
    '中等': '#FF9800',
    '困难': '#F44336'
  }
  return colors[difficulty] || '#9E9E9E'
}

const getImportanceIcon = (importance: string) => {
  const icons: Record<string, string> = {
    'high': '⭐',
    'medium': '🌟',
    'low': '✨'
  }
  return icons[importance] || '⚪'
}

// 方法
const selectPoint = (point: KnowledgePoint) => {
  selectedPoint.value = point
  // 在下一帧渲染完成后执行公式渲染
  setTimeout(() => {
    renderMathFormulas()
  }, 100)
}

const renderMathFormulas = () => {
  const contentElement = document.querySelector('.point-content')
  if (!contentElement) return
  
  // 渲染块级公式 $$...$$
  const blockFormulas = contentElement.querySelectorAll('[data-latex-block]')
  blockFormulas.forEach(span => {
    try {
      const formula = span.getAttribute('data-latex-block') || ''
      katex.render(formula, span as HTMLElement, {
        displayMode: true,
        throwOnError: false,
        strict: false
      })
    } catch (e) {
      console.error('块级公式渲染失败:', e)
    }
  })
  
  // 渲染行内公式 $...$
  const inlineFormulas = contentElement.querySelectorAll('[data-latex-inline]')
  inlineFormulas.forEach(span => {
    try {
      const formula = span.getAttribute('data-latex-inline') || ''
      katex.render(formula, span as HTMLElement, {
        displayMode: false,
        throwOnError: false,
        strict: false
      })
    } catch (e) {
      console.error('行内公式渲染失败:', e)
    }
  })
}

const formatContent = (content: string) => {
  // 处理LaTeX公式标记
  let formatted = content.replace(/\$\$(.*?)\$\$/gs, (match, formula) => {
    return `<span data-latex-block="${formula.trim().replace(/"/g, '&quot;')}"></span>`
  }).replace(/\$(.*?)\$/g, (match, formula) => {
    return `<span data-latex-inline="${formula.trim().replace(/"/g, '&quot;')}"></span>`
  })
  
  // 处理换行和重点标识
  formatted = formatted.replace(/\n/g, '<br>').replace(/★/g, '<span class="highlight-star">★</span>')
  
  return formatted
}

const startPractice = () => {
  if (selectedPoint.value) {
    console.log(`开始练习: ${selectedPoint.value.title}`)
    // 这里可以跳转到练习页面
  }
}

const markAsMastered = () => {
  if (selectedPoint.value) {
    selectedPoint.value.progress = Math.min(100, selectedPoint.value.progress + 10)
    console.log(`标记掌握: ${selectedPoint.value.title}`)
  }
}

onMounted(() => {
  activeCategory.value = currentConfig.value.categories[0] || ''
})
</script>

<template>
  <div class="knowledge-structure">
    <!-- 顶部信息 -->
    <div class="header-section">
      <h2 class="subject-title" :style="{ color: currentConfig.color }">
        📚 {{ currentConfig.name }}知识体系
      </h2>
      <p class="subject-description">{{ currentConfig.description }}</p>
    </div>

    <!-- 搜索和筛选 -->
    <div class="controls-section">
      <div class="search-bar">
        <el-input
          v-model="searchTerm"
          placeholder="搜索知识点..."
          clearable
          size="large"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>
      
      <div class="category-filters">
        <el-button
          :type="!activeCategory ? 'primary' : 'default'"
          @click="activeCategory = ''"
        >
          全部
        </el-button>
        <el-button
          v-for="category in currentConfig.categories"
          :key="category"
          :type="activeCategory === category ? 'primary' : 'default'"
          @click="activeCategory = category"
        >
          {{ category }}
        </el-button>
      </div>
    </div>

    <div class="content-layout">
      <!-- 知识点列表 -->
      <div class="points-sidebar">
        <div 
          v-for="(points, category) in pointsByCategory"
          :key="category"
          class="category-group"
        >
          <h3 class="category-title">{{ category }}</h3>
          <div class="points-list">
            <div
              v-for="point in points"
              :key="point.id"
              class="point-card"
              :class="{ 'active': selectedPoint?.id === point.id }"
              @click="selectPoint(point)"
            >
              <div class="point-header">
                <div class="point-title">
                  {{ getImportanceIcon(point.importance) }}
                  {{ point.title }}
                </div>
                <el-tag 
                  :color="getDifficultyColor(point.difficulty)"
                  size="small"
                >
                  {{ point.difficulty }}
                </el-tag>
              </div>
              <div class="point-meta">
                <el-progress 
                  :percentage="point.progress"
                  :stroke-width="4"
                  :show-text="false"
                />
                <div class="progress-text">{{ point.progress }}%</div>
              </div>
              <div class="key-points">
                <el-tag
                  v-for="kp in point.keyPoints"
                  :key="kp"
                  size="small"
                  type="info"
                >
                  {{ kp }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="filteredPoints.length === 0" class="no-results">
          <el-icon size="40" color="#999"><Document /></el-icon>
          <p>暂无匹配的知识点</p>
        </div>
      </div>

      <!-- 知识点详情 -->
      <div class="point-detail">
        <div v-if="selectedPoint" class="detail-content">
          <div class="detail-header">
            <h2>{{ selectedPoint.title }}</h2>
            <div class="header-tags">
              <el-tag :color="currentConfig.color" effect="dark">
                {{ selectedPoint.category }}
              </el-tag>
              <el-tag :type="selectedPoint.difficulty === '基础' ? 'success' : selectedPoint.difficulty === '中等' ? 'warning' : 'danger'">
                {{ selectedPoint.difficulty }}
              </el-tag>
              <el-tag v-if="selectedPoint.importance === 'high'" type="danger">
                重点
              </el-tag>
            </div>
          </div>
          
          <div class="progress-section">
            <div class="progress-info">
              <span>掌握进度:</span>
              <el-progress 
                :percentage="selectedPoint.progress"
                :stroke-width="12"
                :text-inside="true"
                :color="currentConfig.color"
              />
            </div>
          </div>
          
          <div class="point-content" v-html="formatContent(selectedPoint.content)"></div>
          
          <div class="detail-actions">
            <el-button type="primary" size="large" @click="startPractice">
              <el-icon><Edit /></el-icon>
              开始练习
            </el-button>
            <el-button size="large" @click="markAsMastered">
              <el-icon><Check /></el-icon>
              标记掌握
            </el-button>
          </div>
        </div>
        
        <div v-else class="placeholder">
          <el-icon size="80" color="#999"><Collection /></el-icon>
          <h3>请选择知识点</h3>
          <p>从左侧列表中选择要学习的知识点</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.knowledge-structure {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf9 100%);
  border-radius: 25px;
  padding: 35px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.1);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.header-section {
  text-align: center;
  margin-bottom: 40px;
  padding: 25px 0;
}

.subject-title {
  font-size: 2.5em;
  margin-bottom: 15px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subject-description {
  font-size: 1.3em;
  color: #555;
  margin-bottom: 0;
  font-weight: 400;
}

.controls-section {
  margin-bottom: 35px;
  background: white;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
}

.search-bar {
  max-width: 450px;
  margin-bottom: 25px;
}

.category-filters {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
}

.content-layout {
  display: flex;
  flex: 1;
  gap: 35px;
  min-height: 0;
}

.points-sidebar {
  width: 400px;
  overflow-y: auto;
  background: white;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  height: fit-content;
  max-height: calc(100vh - 300px);
}

.category-group {
  margin-bottom: 35px;
}

.category-title {
  color: #2c3e50;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 3px solid #667eea;
  font-size: 1.4em;
  font-weight: 700;
}

.points-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.point-card {
  padding: 25px;
  border-radius: 16px;
  background: #fafbff;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 3px solid transparent;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

.point-card:hover {
  transform: translateX(8px) translateY(-3px);
  border-color: #667eea;
  background: #f0f5ff;
  box-shadow: 0 12px 30px rgba(102, 126, 234, 0.2);
}

.point-card.active {
  border-color: #667eea;
  background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
  box-shadow: 0 15px 35px rgba(102, 126, 234, 0.3);
}

.point-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.point-title {
  font-weight: 700;
  color: #2c3e50;
  font-size: 1.2em;
  flex: 1;
  margin-right: 15px;
  line-height: 1.4;
}

.point-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.progress-text {
  font-size: 1em;
  color: #666;
  min-width: 50px;
  font-weight: 500;
}

.key-points {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.key-point-tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85em;
  font-weight: 500;
}

.no-results {
  text-align: center;
  padding: 80px 30px;
  color: #999;
  background: white;
  border-radius: 15px;
}

.no-results p {
  margin-top: 20px;
  font-size: 1.2em;
  color: #666;
}

.point-detail {
  flex: 1;
  overflow-y: auto;
  padding-left: 25px;
}

.detail-content {
  max-width: 900px;
  background: white;
  border-radius: 20px;
  padding: 35px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.1);
}

.detail-header {
  margin-bottom: 35px;
  padding-bottom: 25px;
  border-bottom: 3px solid #f0f0f0;
}

.detail-header h2 {
  color: #2c3e50;
  margin-bottom: 25px;
  font-size: 2.3em;
  font-weight: 800;
  line-height: 1.3;
}

.header-tags {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.progress-section {
  margin-bottom: 35px;
  padding: 25px;
  background: linear-gradient(135deg, #f8f9ff 0%, #eef2ff 100%);
  border-radius: 16px;
  border: 1px solid #e0e7ff;
}

.progress-info {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.progress-info span {
  font-weight: 600;
  color: #2c3e50;
  min-width: 100px;
  font-size: 1.1em;
}

.point-content {
  line-height: 2.0;
  color: #34495e;
  font-size: 1.15em;
  margin-bottom: 45px;
  padding: 5px 0;
}

.point-content :deep(h1) {
  font-size: 1.6em;
  color: #2c3e50;
  margin: 35px 0 20px 0;
  padding-bottom: 15px;
  border-bottom: 3px solid #667eea;
  font-weight: 700;
}

.point-content :deep(h2) {
  font-size: 1.4em;
  color: #34495e;
  margin: 30px 0 18px 0;
  font-weight: 600;
}

.point-content :deep(h3) {
  font-size: 1.2em;
  color: #4a5568;
  margin: 25px 0 15px 0;
  font-weight: 500;
}

.point-content :deep(p) {
  margin: 18px 0;
  line-height: 1.9;
}

.point-content :deep(ul),
.point-content :deep(ol) {
  margin: 20px 0;
  padding-left: 30px;
}

.point-content :deep(li) {
  margin: 12px 0;
  line-height: 1.7;
}

.point-content :deep(strong) {
  color: #667eea;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.highlight-star {
  color: #FFD700;
  font-weight: 800;
  font-size: 1.2em;
}

.detail-actions {
  display: flex;
  gap: 25px;
  padding-top: 35px;
  border-top: 2px solid #f0f0f0;
  justify-content: center;
}

.placeholder {
  text-align: center;
  padding: 120px 30px;
  color: #999;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}

.placeholder h3 {
  margin: 25px 0 15px 0;
  color: #666;
  font-size: 1.8em;
}

/* 滚动条样式 */
.points-sidebar::-webkit-scrollbar,
.point-detail::-webkit-scrollbar {
  width: 8px;
}

.points-sidebar::-webkit-scrollbar-track,
.point-detail::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.points-sidebar::-webkit-scrollbar-thumb,
.point-detail::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
}

.points-sidebar::-webkit-scrollbar-thumb:hover,
.point-detail::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .content-layout {
    flex-direction: column;
  }
  
  .points-sidebar {
    width: 100%;
    max-height: 400px;
    margin-bottom: 25px;
  }
  
  .point-detail {
    padding-left: 0;
  }
}

@media (max-width: 768px) {
  .knowledge-structure {
    padding: 25px;
    border-radius: 20px;
  }
  
  .subject-title {
    font-size: 2em;
  }
  
  .controls-section {
    text-align: center;
    padding: 20px;
  }
  
  .category-filters {
    justify-content: center;
    gap: 10px;
  }
  
  .point-card {
    padding: 20px;
  }
  
  .detail-header h2 {
    font-size: 1.8em;
  }
  
  .detail-content {
    padding: 25px;
  }
  
  .detail-actions {
    flex-direction: column;
    gap: 15px;
  }
  
  .detail-actions .el-button {
    width: 100%;
  }
  
  .point-content {
    font-size: 1.05em;
  }
}
</style>
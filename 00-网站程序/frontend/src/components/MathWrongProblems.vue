<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, DocumentChecked, Upload, Picture, CopyDocument, MagicStick, ArrowDown } from '@element-plus/icons-vue'
import { renderMath } from '@/utils/mathRender'

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
}

const problems = ref<WrongProblem[]>([
  // ==================== 高数 ====================
  {
    id: 'math_09_4',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'series',
    sectionName: '级数收敛性',
    title: '【2009数一真题4】数列乘积级数收敛性判断',
    content: '设有两个数列 $\\{a_n\\}, \\{b_n\\}$，若 $\\lim\\limits_{n \\to \\infty} a_n = 0$，则（）。\nA. 当 $\\sum b_n$ 收敛时，$\\sum a_n b_n$ 收敛\nB. 当 $\\sum b_n$ 发散时，$\\sum a_n b_n$ 发散\nC. 当 $\\sum |b_n|$ 收敛时，$\\sum a_n^2 b_n^2$ 收敛\nD. 当 $\\sum |b_n|$ 发散时，$\\sum a_n^2 b_n^2$ 发散',
    mistakeType: '概念不清',
    importance: 5,
    correction: '正确答案：C\n解析：\n- A错：取 $a_n = \\frac{1}{n},\\ b_n = \\frac{(-1)^n}{\\sqrt{n}}$，$\\sum b_n$ 收敛（Leibniz），但 $\\sum a_n b_n = \\sum \\frac{(-1)^n}{n\\sqrt{n}}$ 条件收敛，不是绝对收敛\n- B错：取 $a_n = \\frac{1}{n},\\ b_n = 1$，$\\sum b_n$ 发散，但 $\\sum a_n b_n = \\sum \\frac{1}{n}$ 发散；取 $a_n = \\frac{1}{n^2},\\ b_n = 1$，$\\sum a_n b_n = \\sum \\frac{1}{n^2}$ 收敛\n- ✅C对：$\\sum |b_n|$ 收敛 $\\Rightarrow b_n \\to 0$，又 $a_n \\to 0$，故 $n$ 足够大时 $a_n^2 < 1$，于是 $a_n^2 b_n^2 \\le |b_n|$，由比较判别法 $\\sum a_n^2 b_n^2$ 收敛\n- D错：取 $a_n = \\frac{1}{n},\\ b_n = \\frac{1}{n}$，$\\sum |b_n|$ 发散，但 $\\sum a_n^2 b_n^2 = \\sum \\frac{1}{n^4}$ 收敛',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_09_10',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'ode',
    sectionName: '二阶常系数微分方程',
    title: '【2009数一真题10】二阶常系数非齐次微分方程特解',
    content: '若二阶常系数线性齐次微分方程 $y\'\' + ay\' + by = 0$ 的通解为 $y = (C_1 + C_2 x)e^x$，则非齐次方程 $y\'\' + ay\' + by = x$ 满足条件 $y(0) = 2,\\ y\'(0) = 0$ 的解为 $y = $ ______。',
    mistakeType: '公式不清',
    importance: 5,
    correction: '正确答案：$y = -xe^x + x + 2$\n解析：\nStep1：由齐次通解 $y = (C_1 + C_2 x)e^x$ 知特征方程有重根 $r = 1$，即 $(r-1)^2 = 0 \\Rightarrow r^2 - 2r + 1 = 0$，所以 $a = -2,\\ b = 1$，方程为 $y\'\' - 2y\' + y = x$\nStep2：求特解 $y^*$。$f(x) = x$，$\\lambda = 0$ 不是特征根，设 $y^* = Ax + B$\n代入：$0 - 2A + (Ax + B) = x \\Rightarrow Ax + (B - 2A) = x$\n比较系数：$A = 1,\\ B - 2A = 0 \\Rightarrow B = 2$，所以 $y^* = x + 2$\nStep3：通解 $y = (C_1 + C_2 x)e^x + x + 2$\nStep4：代入初始条件\n$y(0) = C_1 + 2 = 2 \\Rightarrow C_1 = 0$\n$y\' = C_2 e^x + (C_1 + C_2 x)e^x + 1 = (C_1 + C_2 + C_2 x)e^x + 1$\n$y\'(0) = C_1 + C_2 + 1 = 0$，由 $C_1 = 0$ 得 $C_2 = -1$\n最终解：$y = -xe^x + x + 2$',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_gaoshu_power_series',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'power_series',
    sectionName: '幂级数与泰勒展开',
    title: '幂级数求和及泰勒展开公式不熟',
    content: '薄弱点记录：\n- 幂级数求和方法不熟练\n- 相关泰勒展开公式记不熟\n- 6个基本展开式需要强化记忆',
    mistakeType: '公式不清',
    importance: 4,
    correction: '需要强化的6个基本泰勒展开式：\n1. $e^x = \\sum\\limits_{n=0}^{\\infty} \\frac{x^n}{n!}$，收敛域 $(-\\infty, +\\infty)$\n2. $\\sin x = \\sum\\limits_{n=0}^{\\infty} \\frac{(-1)^n x^{2n+1}}{(2n+1)!}$，收敛域 $(-\\infty, +\\infty)$\n3. $\\cos x = \\sum\\limits_{n=0}^{\\infty} \\frac{(-1)^n x^{2n}}{(2n)!}$，收敛域 $(-\\infty, +\\infty)$\n4. $\\ln(1+x) = \\sum\\limits_{n=1}^{\\infty} \\frac{(-1)^{n-1} x^n}{n}$，收敛域 $(-1, 1]$\n5. $\\frac{1}{1-x} = \\sum\\limits_{n=0}^{\\infty} x^n$，收敛域 $(-1, 1)$\n6. $(1+x)^\\alpha = 1 + \\alpha x + \\frac{\\alpha(\\alpha-1)x^2}{2!} + \\cdots$，收敛域 $(-1, 1)$\n\n求和方法：逐项求导/积分法、变量替换、四则运算',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_gaoshu_rotation',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'rotation',
    sectionName: '旋转体体积',
    title: '旋转体体积公式记忆不清晰',
    content: '薄弱点记录：\n- 求旋转体体积的题目不熟练\n- 公式记忆不清晰\n- 圆盘法和柱壳法容易混淆',
    mistakeType: '公式不清',
    importance: 4,
    correction: '两个核心公式：\n1. 圆盘法（切片法）：\n   - 绕x轴：$V = \\pi \\int [f(x)]^2 \\,dx$\n   - 绕y轴：$V = \\pi \\int [g(y)]^2 \\,dy$\n   - 空心：$V = \\pi \\int [f(x)^2 - g(x)^2] \\,dx$\n2. 柱壳法：\n   - 绕y轴（用x积分）：$V = 2\\pi \\int x \\cdot f(x) \\,dx$\n   - 绕x轴（用y积分）：$V = 2\\pi \\int y \\cdot g(y) \\,dy$\n\n选择原则：绕坐标轴→圆盘法；绕平行于坐标轴的直线→柱壳法',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_gaoshu_proof',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'proof',
    sectionName: '证明题·中值定理',
    title: '证明题接触少，思路难',
    content: '薄弱点记录：\n- 证明题接触的比较少\n- 中值定理应用难有思路\n- 辅助函数构造不熟练',
    mistakeType: '思路错误',
    importance: 4,
    correction: '证明题框架：\n1. 含 $f\'(\\xi)$ → 罗尔定理，构造 $F(x)$ 使 $F\'(x)$ 含 $f\'(x)$\n2. 含 $f(b) - f(a)$ → 拉格朗日中值定理\n3. 含 $\\frac{f\'(\\xi)}{g\'(\\xi)}$ → 柯西中值定理\n4. 含 $f\'\'(\\xi)$ → 泰勒公式\n5. 不等式 → 单调性法：构造 $h(x) = f(x) - g(x)$，证 $h\'(x) \\ge 0$\n\n辅助函数构造技巧：\n- 含 $f\'(\\xi) + kf(\\xi)$ → $F(x) = f(x)e^{kx}$\n- 含 $\\xi f\'(\\xi) + f(\\xi)$ → $F(x) = xf(x)$',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  // ==================== 线代 ====================
  {
    id: 'math_09_5',
    chapterId: 'ch_xiandai',
    chapterName: '线性代数',
    sectionId: 'basis',
    sectionName: '基与过渡矩阵',
    title: '【2009数一真题5】基变换的过渡矩阵',
    content: '设 $\\alpha_1, \\alpha_2, \\alpha_3$ 是3维向量空间 $\\mathbb{R}^3$ 的一组基，则由基 $\\alpha_1,\\ \\frac{1}{2}\\alpha_2,\\ \\alpha_3$ 到基 $\\alpha_1 + \\alpha_2,\\ \\alpha_2 + \\alpha_3,\\ \\alpha_3 + \\alpha_1$ 的过渡矩阵为（）。\nA. $\\begin{pmatrix} 1&0&1 \\\\ 2&2&0 \\\\ 0&3&3 \\end{pmatrix}$\nB. $\\begin{pmatrix} 1&2&0 \\\\ 0&2&3 \\\\ 1&0&3 \\end{pmatrix}$\nC. $\\begin{pmatrix} \\frac{1}{2}&\\frac{1}{4}&-\\frac{1}{6} \\\\ -\\frac{1}{2}&\\frac{1}{4}&\\frac{1}{6} \\\\ \\frac{1}{2}&-\\frac{1}{4}&\\frac{1}{6} \\end{pmatrix}$\nD. $\\begin{pmatrix} \\frac{1}{2}&-\\frac{1}{2}&\\frac{1}{2} \\\\ \\frac{1}{4}&\\frac{1}{4}&-\\frac{1}{4} \\\\ -\\frac{1}{6}&\\frac{1}{6}&\\frac{1}{6} \\end{pmatrix}$',
    mistakeType: '计算错误',
    importance: 5,
    correction: '正确答案：B\n解析：\n设旧基 $\\beta_1 = \\alpha_1,\\ \\beta_2 = \\frac{1}{2}\\alpha_2,\\ \\beta_3 = \\alpha_3$，新基 $\\gamma_1 = \\alpha_1 + \\alpha_2,\\ \\gamma_2 = \\alpha_2 + \\alpha_3,\\ \\gamma_3 = \\alpha_3 + \\alpha_1$\n\n用旧基表示新基（$\\alpha_1 = \\beta_1,\\ \\alpha_2 = 2\\beta_2,\\ \\alpha_3 = 3\\beta_3$）：\n$\\gamma_1 = \\beta_1 + 2\\beta_2$ → 坐标 $(1, 2, 0)^T$ → 第一列\n$\\gamma_2 = 2\\beta_2 + 3\\beta_3$ → 坐标 $(0, 2, 3)^T$ → 第二列\n$\\gamma_3 = \\beta_1 + 3\\beta_3$ → 坐标 $(1, 0, 3)^T$ → 第三列\n\n过渡矩阵 $P$ 满足 $(\\gamma_1, \\gamma_2, \\gamma_3) = (\\beta_1, \\beta_2, \\beta_3)P$，其列就是新基在旧基下的坐标：\n$P = \\begin{pmatrix} 1&0&1 \\\\ 2&2&0 \\\\ 0&3&3 \\end{pmatrix}$ 按列看即选项 B 的转置形式 —— 关键：过渡矩阵的列是新基向量在旧基下的坐标！\n\n错因：向量行列顺序反了，方法对。书写时把坐标向量按列排而非按行排。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_xiandai_systems',
    chapterId: 'ch_xiandai',
    chapterName: '线性代数',
    sectionId: 'linear_systems',
    sectionName: '线性方程组',
    title: '线代解方程组不熟练',
    content: '薄弱点记录：\n- 线性方程组求解不熟练\n- 齐次/非齐次解的结构容易混淆\n- 含参数方程组讨论困难',
    mistakeType: '方法不熟',
    importance: 4,
    correction: '线性方程组求解框架：\n1. 解的存在性：比较 $r(A)$ 与 $r(A, b)$\n   - $r(A) \\ne r(A, b)$ → 无解\n   - $r(A) = r(A, b) = n$ → 唯一解\n   - $r(A) = r(A, b) < n$ → 无穷多解\n2. 齐次 $Ax = 0$：基础解系含 $n - r(A)$ 个向量\n3. 非齐次 $Ax = b$：通解 = 特解 + 齐次通解\n4. 含参数：行变换时别除以含参数的式子，要分类讨论',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  // ==================== 概率论 ====================
  {
    id: 'math_09_8',
    chapterId: 'ch_gailv',
    chapterName: '概率论',
    sectionId: 'function_distribution',
    sectionName: '随机变量函数的分布',
    title: '【2009数一真题8】混合型随机变量函数的分布',
    content: '设随机变量 $X$ 与 $Y$ 相互独立，且 $X$ 服从标准正态分布 $N(0,1)$，$Y$ 的概率分布为 $P\\{Y=0\\} = P\\{Y=1\\} = \\frac{1}{2}$，记 $F_Z(z)$ 为随机变量 $Z = XY$ 的分布函数，则函数 $F_Z(z)$ 的间断点个数为（）。\nA. 0\nB. 1\nC. 2\nD. 3',
    mistakeType: '概念不清',
    importance: 5,
    correction: '正确答案：B（1个间断点）\n解析：\n$Z = XY$，$Y$ 只能取0或1：\n- 当 $Y = 0$ 时，$Z = X \\cdot 0 = 0$\n- 当 $Y = 1$ 时，$Z = X \\cdot 1 = X \\sim N(0,1)$\n\n由全概率公式：\n$F_Z(z) = P(Z \\le z) = P(Z \\le z \\mid Y=0)P(Y=0) + P(Z \\le z \\mid Y=1)P(Y=1)$\n$= \\frac{1}{2} \\cdot P(0 \\le z) + \\frac{1}{2} \\cdot P(X \\le z) = \\frac{1}{2} u(z) + \\frac{1}{2} \\Phi(z)$\n\n其中 $u(z)$ 是单位阶跃函数（$z \\ge 0$ 时为1，$z < 0$ 时为0），$\\Phi(z)$ 是标准正态分布函数。\n\n$F_Z(z)$ 在 $z = 0$ 处：\n- 左极限：$\\frac{1}{2} \\cdot 0 + \\frac{1}{2} \\cdot \\Phi(0) = \\frac{1}{4}$\n- 右极限：$\\frac{1}{2} \\cdot 1 + \\frac{1}{2} \\cdot \\Phi(0) = \\frac{3}{4}$\n- 跳跃：$\\frac{3}{4} - \\frac{1}{4} = \\frac{1}{2}$\n\n$u(z)$ 在 $z = 0$ 处有1个间断点，$\\Phi(z)$ 处处连续，故 $F_Z(z)$ 只有 $z = 0$ 一个间断点。\n\n错因：分布函数的定义与全概率公式结合不熟练，曾被选项C干扰。混合型随机变量（离散+连续混合）的分布函数必查跳跃点。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_gailv_estimation',
    chapterId: 'ch_gailv',
    chapterName: '概率论',
    sectionId: 'estimation',
    sectionName: '参数估计',
    title: '矩估计与最大似然估计公式概念不清',
    content: '薄弱点记录：\n- 概率论矩估计最大似然估计的公式和概念不清楚\n- 总是忘记两种方法的区别和步骤',
    mistakeType: '概念不清',
    importance: 4,
    correction: '两种参数估计方法：\n\n1. 矩估计法：\n   - 原理：样本矩 = 总体矩\n   - 一个参数 $\\theta$：令 $E(X) = \\bar{X}$，解出 $\\theta$\n   - 两个参数：令 $E(X) = \\bar{X}$ 且 $E(X^2) = \\frac{1}{n}\\sum\\limits_{i=1}^n X_i^2$，联立求解\n\n2. 最大似然估计（MLE）：\n   - Step1：写似然函数 $L(\\theta) = \\prod\\limits_{i=1}^n f(x_i; \\theta)$\n   - Step2：取对数 $\\ln L(\\theta)$\n   - Step3：对 $\\theta$ 求导，令 $\\frac{d \\ln L(\\theta)}{d\\theta} = 0$，解出 $\\theta$\n   - Step4：验证是最大值\n\n高频分布：\n- 正态 $N(\\mu, \\sigma^2)$：$\\mu$ 的MLE $= \\bar{X}$，$\\sigma^2$ 的MLE $= \\frac{1}{n}\\sum\\limits_{i=1}^n (X_i - \\bar{X})^2$\n- 均匀 $U(0, \\theta)$：$\\theta$ 的MLE $= \\max(X_i)$（不是 $2\\bar{X}$！）\n- 指数 $Exp(\\lambda)$：$\\lambda$ 的MLE $= \\frac{1}{\\bar{X}}$',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  // ==================== 10年真题 ====================
  // ---- 高数 ----
  {
    id: 'math_10_2',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'implicit',
    sectionName: '隐函数与抽象函数求导',
    title: '【2010数一真题2】隐函数偏导数（抽象函数）',
    content: '设函数 $z = z(x,y)$ 由方程 $F\\left(\\frac{y}{x}, \\frac{z}{x}\\right) = 0$ 确定，其中 $F$ 具有连续偏导数，则 $x \\cdot \\frac{\\partial z}{\\partial x} + y \\cdot \\frac{\\partial z}{\\partial y} =$（）。\nA. $x \\cdot F_1 + y \\cdot F_2$\nB. $z$\nC. $xz \\cdot F_1 + yz \\cdot F_2$\nD. $x \\cdot F_1 + z \\cdot F_2$',
    mistakeType: '方法不熟',
    importance: 5,
    correction: '正确答案：B\n解析：\n令 $u = \\frac{y}{x},\\ v = \\frac{z}{x}$，$F(u, v) = 0$\n\n对 $x$ 偏导：$F_1 \\cdot \\left(-\\frac{y}{x^2}\\right) + F_2 \\cdot \\frac{x \\cdot \\frac{\\partial z}{\\partial x} - z}{x^2} = 0$\n$\\Rightarrow -yF_1 + F_2\\left(x \\cdot \\frac{\\partial z}{\\partial x} - z\\right) = 0$\n$\\Rightarrow x \\cdot \\frac{\\partial z}{\\partial x} = z + \\frac{yF_1}{F_2}$\n\n对 $y$ 偏导：$F_1 \\cdot \\frac{1}{x} + F_2 \\cdot \\frac{1}{x} \\cdot \\frac{\\partial z}{\\partial y} = 0$\n$\\Rightarrow \\frac{\\partial z}{\\partial y} = -\\frac{F_1}{F_2}$\n$\\Rightarrow y \\cdot \\frac{\\partial z}{\\partial y} = -\\frac{yF_1}{F_2}$\n\n所以 $x \\cdot \\frac{\\partial z}{\\partial x} + y \\cdot \\frac{\\partial z}{\\partial y} = z + \\frac{yF_1}{F_2} - \\frac{yF_1}{F_2} = z$ ✅\n\n错因：未能识别到隐函数，直接链式法则求导了，抽象函数求导掌握不好。\n核心方法：对 $F(u,v) = 0$ 两边全微分或分别对 $x, y$ 求偏导，用隐函数定理。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_10_3',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'integral',
    sectionName: '广义积分收敛性',
    title: '【2010数一真题3】含参广义积分收敛性（根式对数型，勘误重写）',
    content: '设 $m, n$ 为正整数，则反常积分 $\\int_0^1 \\frac{\\sqrt[m]{\\ln^2(1-x)}}{\\sqrt[n]{x}} \\,dx$ 的收敛性（）。\nA. 仅与 $m$ 的取值有关\nB. 仅与 $n$ 的取值有关\nC. 与 $m, n$ 的取值都有关\nD. 与 $m, n$ 的取值都无关',
    mistakeType: '概念不清',
    importance: 5,
    correction: '正确答案：D（与 $m, n$ 的取值都无关）\n解析：\n两个瑕点 $x=0$ 与 $x=1$，先拆后判、独立审判。\n\n$x \\to 0^+$：$\\ln(1-x) \\sim -x$，故 $\\ln^2(1-x) \\sim x^2$，分子 $\\sqrt[m]{\\ln^2(1-x)} \\sim x^{2/m}$；\n被积函数 $\\sim \\dfrac{x^{2/m}}{x^{1/n}} = x^{2/m - 1/n}$。\n因 $m, n$ 为正整数：$2/m > 0$、$1/n \\le 1$，故 $\\dfrac{2}{m} - \\dfrac{1}{n} > -1$，恒满足瑕点判据 → 必收敛。\n\n$x \\to 1^-$：$\\sqrt[n]{x} \\to 1$，被积函数 $\\sim \\sqrt[m]{\\ln^2(1-x)}$；令 $t = 1-x \\to 0^+$，被积函数 $\\sim (\\ln t)^{2/m}$。\n对数瑕点恒可积：$|\\ln t|$ 增长慢于任何负幂次，即对任意 $\\varepsilon > 0$ 有 $|\\ln t| \\le C t^{-\\varepsilon}$，取 $\\varepsilon$ 充分小使 $\\dfrac{2\\varepsilon}{m} < 1$，由瑕点判据 $p < 1$ 收敛。\n\n结论：无论 $m, n$ 取何正整数，两端都收敛 → 敛散性与 $m, n$ 均无关，选 D。\n口诀：对数瑕点纸老虎——瑕点处 ln 爆炸但恒可积，幂次定生死，对数只吆喝。\n\n错因：卡在 $[\\frac12, 1]$ 区间的收敛判断——不知道对数瑕点恒可积。备注：本题题面曾录错（误录为 $\\frac{x^m \\ln^n(1-x)}{\\sqrt{x}}$、答案 A），08-31 已按真题原版勘误重写。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_10_12',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'triple_integral',
    sectionName: '三重积分与形心',
    title: '【2010数一真题12】三重积分求形心坐标z̄',
    content: '设 $\\Omega = \\{(x,y,z) \\mid x^2 + y^2 \\le z \\le 1\\}$，$\\Omega$ 的形心的 $z$ 坐标 $\\bar{z} = $ ______。',
    mistakeType: '公式不清',
    importance: 5,
    correction: '正确答案：$\\bar{z} = \\frac{2}{3}$\n解析：\n$\\Omega$ 是由抛物面 $z = x^2 + y^2$ 和平面 $z = 1$ 围成的区域。\n\n形心公式：$\\bar{z} = \\frac{\\iiint_\\Omega z \\,dV}{\\iiint_\\Omega dV}$\n\n用柱坐标：$x = r\\cos\\theta,\\ y = r\\sin\\theta$，$z$ 从 $r^2$ 到 $1$，$r$ 从 $0$ 到 $1$，$\\theta$ 从 $0$ 到 $2\\pi$\n\n$\\iiint_\\Omega dV = \\int_0^{2\\pi} d\\theta \\int_0^1 r \\,dr \\int_{r^2}^1 dz = 2\\pi \\int_0^1 r(1 - r^2) \\,dr = 2\\pi\\left[\\frac{r^2}{2} - \\frac{r^4}{4}\\right]_0^1 = \\frac{\\pi}{2}$\n\n$\\iiint_\\Omega z \\,dV = 2\\pi \\int_0^1 r \\cdot \\left[\\frac{z^2}{2}\\right]_{r^2}^1 dr = \\pi \\int_0^1 r(1 - r^4) \\,dr = \\pi\\left[\\frac{r^2}{2} - \\frac{r^6}{6}\\right]_0^1 = \\frac{\\pi}{3}$\n\n$\\bar{z} = \\frac{\\pi/3}{\\pi/2} = \\frac{2}{3}$\n\n错因：三重积分先一后二/先二后一的方法不熟练，形心公式也没记好。\n核心方法：形心坐标 =（该坐标的积分）/（体积），用柱坐标简化旋转体区域。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_10_18',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'power_series',
    sectionName: '幂级数与泰勒展开',
    title: '【2010数一真题18】幂级数求和函数（10分大题）',
    content: '求幂级数 $\\sum\\limits_{n=1}^{\\infty} \\frac{(-1)^{n-1}}{2n-1} \\cdot x^{2n}$ 的收敛域与和函数 $S(x)$。（10分）',
    mistakeType: '公式不清',
    importance: 5,
    correction: '正确答案：收敛域 $[-1, 1]$，$S(x) = x \\arctan x$\n解析：\n\nStep1：收敛域\n令 $t = x^2$，级数变为 $\\sum \\frac{(-1)^{n-1}}{2n-1} t^n$\n用比值法：$\\left|\\frac{a_{n+1}}{a_n}\\right| = \\frac{2n-1}{2n+1} \\cdot |t| \\to |t|$，收敛半径 $R = 1$（对 $t$），即 $|x| < 1$\n端点 $x = \\pm 1$：级数 $= \\sum \\frac{(-1)^{n-1}}{2n-1} = 1 - \\frac{1}{3} + \\frac{1}{5} - \\cdots = \\frac{\\pi}{4}$（收敛）\n收敛域：$[-1, 1]$\n\nStep2：求和函数\n$S(x) = x \\cdot \\sum\\limits_{n=1}^{\\infty} \\frac{(-1)^{n-1}}{2n-1} x^{2n-1}$\n\n令 $T(x) = \\sum\\limits_{n=1}^{\\infty} \\frac{(-1)^{n-1}}{2n-1} x^{2n-1}$，逐项求导：\n$T\'(x) = \\sum\\limits_{n=1}^{\\infty} (-1)^{n-1} x^{2n-2} = 1 - x^2 + x^4 - \\cdots = \\frac{1}{1 + x^2}$（几何级数）\n\n所以 $T(x) = \\int_0^x \\frac{1}{1 + t^2} \\,dt = \\arctan x$\n\n$S(x) = x \\arctan x$ ✅\n\n错因：幂级数公式记不清楚，做题讨论不清晰。\n核心技巧：提取 $x$ 凑出已知级数（arctan的展开），逐项求导/积分化简。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_10_19',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'surface_integral',
    sectionName: '曲面积分与几何应用',
    title: '【2010数一真题19】椭球面切平面轨迹与第一类曲面积分（10分大题，勘误重写）',
    content: '设 $P$ 为椭球面 $S: x^2 + y^2 + z^2 - yz = 1$ 上的动点，若 $S$ 在点 $P$ 处的切平面与 $xOy$ 面垂直，求 $P$ 点的轨迹 $C$，并计算曲面积分 $\\displaystyle I = \\iint_\\Sigma \\frac{(x + \\sqrt{3})|y - 2z|}{\\sqrt{4 + y^2 + z^2 - 4yz}}\\,dS$，其中 $\\Sigma$ 是椭球面 $S$ 位于曲线 $C$ 上方的部分。',
    mistakeType: '公式不清',
    importance: 5,
    correction: '解析：\n(I) 令 $F = x^2 + y^2 + z^2 - yz - 1$。切平面垂直 $xOy$ 面 ⟺ 法向量 $\\nabla F$ 垂直 $z$ 轴 ⟺ $\\nabla F$ 的 $z$ 分量为 0：$2z - y = 0$，即 $y = 2z$。\n代入 $S$：$x^2 + 4z^2 + z^2 - 2z^2 = x^2 + 3z^2 = 1$。轨迹 $C$：$y = 2z,\\ x^2 + 3z^2 = 1$。\n\n(II) 合一投影法（第一类曲面积分投到 $xOy$ 面）：\n公式 $dS = \\dfrac{|\\nabla F|}{|F_z|}\\,dx\\,dy$。\n$|\\nabla F|^2 = 4x^2 + (2y-z)^2 + (2z-y)^2 = 4x^2 + 5y^2 + 5z^2 - 8yz$。\n用曲面方程降次：$4x^2 + 5y^2 + 5z^2 - 8yz = 4(x^2 + y^2 + z^2 - yz) + (y^2 + z^2 - 4yz) = 4 + y^2 + z^2 - 4yz$。\n故 $dS = \\dfrac{\\sqrt{4 + y^2 + z^2 - 4yz}}{|2z - y|}\\,dx\\,dy = \\dfrac{\\sqrt{4 + y^2 + z^2 - 4yz}}{|y - 2z|}\\,dx\\,dy$。\n被积函数 $\\times\\, dS = (x + \\sqrt{3})\\,dx\\,dy$（绝对值与根号恰好对消，题目设计好的）。\n投影域：$C$ 上 $z = y/2$，投影得椭圆边界 $x^2 + \\dfrac{3y^2}{4} = 1$；$\\Sigma$ 是 $D: x^2 + \\dfrac{3y^2}{4} \\le 1$ 上的单值图。\n$I = \\iint_D (x + \\sqrt{3})\\,dx\\,dy = 0 + \\sqrt{3} \\cdot \\pi \\cdot 1 \\cdot \\dfrac{2}{\\sqrt{3}} = 2\\pi$（$x$ 项对称性为 0，椭圆面积 $\\pi ab$）。\n\n口诀：投影代入放大；梯度作分子、投影轴分量作分母。\n\n错因：第一类曲面积分投影公式（$dS = \\sqrt{1 + z_x^2 + z_y^2}\\,dx\\,dy$）遗忘，合一投影法没学会。备注：本题曾误录为“球面被平面截的球冠面积”（幻觉题），08-31 已按用户原卷照片勘误重写。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  // ---- 线代 ----
  {
    id: 'math_10_21',
    chapterId: 'ch_xiandai',
    chapterName: '线性代数',
    sectionId: 'quadratic_form',
    sectionName: '二次型与正定矩阵',
    title: '【2010数一真题21】二次型标准形反求矩阵A与A+E正定证明（11分大题，勘误重写）',
    content: '已知二次型 $f(x_1, x_2, x_3) = x^T A x$ 在正交变换 $x = Qy$ 下的标准形为 $y_1^2 + y_2^2$，且 $Q$ 的第三列为 $\\left(\\frac{\\sqrt{2}}{2}, 0, \\frac{\\sqrt{2}}{2}\\right)^T$。\n(I) 求矩阵 $A$；\n(II) 证明 $A + E$ 为正定矩阵，其中 $E$ 为 3 阶单位矩阵。',
    mistakeType: '思路错误',
    importance: 5,
    correction: '解析：\n(I) 正交变换下标准形系数 = 特征值：$y_1^2 + y_2^2 = 1\\cdot y_1^2 + 1\\cdot y_2^2 + 0\\cdot y_3^2$，故 $A$ 的特征值为 $1, 1, 0$。\n「列跟对角走」：$Q^T A Q = \\mathrm{diag}(1, 1, 0)$，$Q$ 的第 $i$ 列对应 $\\Lambda$ 第 $i$ 个对角元，故第三列 $\\xi_3 = \\left(\\frac{\\sqrt{2}}{2}, 0, \\frac{\\sqrt{2}}{2}\\right)^T$ 是特征值 $0$ 的单位特征向量。\n快捷法（谱分解/完全性）：实对称矩阵 $A = \\lambda_1 \\xi_1 \\xi_1^T + \\lambda_2 \\xi_2 \\xi_2^T + \\lambda_3 \\xi_3 \\xi_3^T$，而 $\\xi_1 \\xi_1^T + \\xi_2 \\xi_2^T + \\xi_3 \\xi_3^T = E$。特征值为 $1, 1, 0$ 时：\n$A = 1\\cdot(E - \\xi_3 \\xi_3^T) + 0\\cdot\\xi_3 \\xi_3^T = E - \\xi_3 \\xi_3^T$（口诀：「谁是 0，从 E 里挖掉谁」，不用求 $\\xi_1, \\xi_2$）。\n$\\xi_3 \\xi_3^T = \\begin{pmatrix} \\frac{1}{2} & 0 & \\frac{1}{2} \\\\ 0 & 0 & 0 \\\\ \\frac{1}{2} & 0 & \\frac{1}{2} \\end{pmatrix}$，故 $A = \\begin{pmatrix} \\frac{1}{2} & 0 & -\\frac{1}{2} \\\\ 0 & 1 & 0 \\\\ -\\frac{1}{2} & 0 & \\frac{1}{2} \\end{pmatrix}$。\n\n(II) 特征值平移：$A\\xi = \\lambda\\xi \\Rightarrow (A + kE)\\xi = (\\lambda + k)\\xi$（口诀「加 E 特征值齐步走」）。\n$A + E$ 的特征值为 $2, 2, 1$，全大于 $0$；又 $(A + E)^T = A^T + E = A + E$ 对称。\n实对称 + 特征值全正 ⟹ $A + E$ 正定。\n\n错因卡点：①不知道标准形系数就是特征值、Q 列与对角元一一对应；②没想到 A+kE 特征值整体平移 +k。\n核心口诀：「标准形系数读特征值，列跟对角走；加 E 齐步走，全正即正定」。\n\n⚠ 勘误备注（2026-09-02，第七次）：本条曾幻觉录为「正定矩阵乘积 AB 不一定正定；AB=BA 则 AB 正定」，与真题不符，已按用户提供的原卷照片重写。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  // ---- 概率论 ----
  {
    id: 'math_10_14',
    chapterId: 'ch_gailv',
    chapterName: '概率论',
    sectionId: 'discrete_rv',
    sectionName: '离散型随机变量',
    title: '【2010数一真题14】泊松分布的E(X²)（分布识别）',
    content: '设随机变量 $X$ 的概率分布为 $P(X = k) = \\frac{C}{k!}$（$k = 0, 1, 2, \\ldots$），则 $E(X^2) = $ ______。',
    mistakeType: '概念不清',
    importance: 5,
    correction: '正确答案：$E(X^2) = 2$\n解析：\n\nStep1：确定 $C$\n$\\sum\\limits_{k=0}^{\\infty} \\frac{C}{k!} = 1 \\Rightarrow C \\cdot \\sum\\limits_{k=0}^{\\infty} \\frac{1}{k!} = 1 \\Rightarrow C \\cdot e = 1 \\Rightarrow C = e^{-1}$\n\n所以 $P(X = k) = \\frac{e^{-1}}{k!} = \\frac{e^{-1} \\cdot 1^k}{k!}$，这正是 $\\lambda = 1$ 的泊松分布：$P(X = k) = \\frac{e^{-\\lambda} \\lambda^k}{k!}$\n\nStep2：求 $E(X^2)$\n泊松分布 $X \\sim P(\\lambda)$：$E(X) = \\lambda = 1$，$D(X) = \\lambda = 1$\n$E(X^2) = D(X) + [E(X)]^2 = 1 + 1 = 2$\n\n错因：没能看出这居然是泊松分布！泰勒展开公式没记熟。\n关键识别：$P(X = k) = \\frac{C}{k!}$ → 分母是 $k!$，分子是常数 → 联想 $e^x = \\sum \\frac{x^k}{k!}$ → 泊松分布。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_10_22',
    chapterId: 'ch_gailv',
    chapterName: '概率论',
    sectionId: 'joint_distribution',
    sectionName: '二维连续型联合分布',
    title: '【2010数一真题22】二元正态分布求常数A与条件密度',
    content: '设二维随机变量 $(X, Y)$ 的概率密度为 $f(x,y) = A \\cdot e^{-3x^2 - 2xy - y^2}$，$-\\infty < x < +\\infty$，$-\\infty < y < +\\infty$。求：\n(I) 常数 $A$\n(II) 条件概率密度 $f_{Y|X}(y|x)$',
    mistakeType: '公式不清',
    importance: 5,
    correction: '解析：\n\n(I) 求 $A$：\n$\\iint A \\cdot e^{-3x^2 - 2xy - y^2} \\,dx\\,dy = 1$\n\n配方：$-3x^2 - 2xy - y^2 = -[(y + x)^2 + 2x^2]$\n\n$\\int e^{-(y+x)^2} \\,dy = \\sqrt{\\pi}$（高斯积分 $\\int e^{-t^2} \\,dt = \\sqrt{\\pi}$）\n$\\int e^{-2x^2} \\,dx = \\sqrt{\\frac{\\pi}{2}}$\n\n所以 $A \\cdot \\sqrt{\\pi} \\cdot \\sqrt{\\frac{\\pi}{2}} = 1 \\Rightarrow A \\cdot \\frac{\\pi}{\\sqrt{2}} = 1 \\Rightarrow A = \\frac{\\sqrt{2}}{\\pi}$\n\n(II) 求条件密度 $f_{Y|X}(y|x)$：\n$f_X(x) = \\int f(x,y) \\,dy = A \\cdot e^{-2x^2} \\cdot \\int e^{-(y+x)^2} \\,dy = A \\cdot \\sqrt{\\pi} \\cdot e^{-2x^2}$\n\n$f_{Y|X}(y|x) = \\frac{f(x,y)}{f_X(x)} = \\frac{e^{-3x^2 - 2xy - y^2}}{\\sqrt{\\pi} \\cdot e^{-2x^2}} = \\frac{e^{-(y+x)^2}}{\\sqrt{\\pi}}$\n\n这是 $N\\left(-x, \\frac{1}{2}\\right)$ 的密度函数！即给定 $X = x$ 时，$Y \\mid X = x \\sim N\\left(-x, \\frac{1}{2}\\right)$\n\n错因：不知道伽马函数和高斯积分公式。\n核心公式：$\\int_{-\\infty}^{+\\infty} e^{-at^2} \\,dt = \\sqrt{\\frac{\\pi}{a}}$（高斯积分）',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_10_23',
    chapterId: 'ch_gailv',
    chapterName: '概率论',
    sectionId: 'estimation',
    sectionName: '参数估计',
    title: '【2010数一真题23】频数构造无偏估计与方差（11分大题）',
    content: '设总体 $X$ 的概率分布为：\n$P(X = 1) = 1 - \\theta,\\quad P(X = 2) = \\theta - \\theta^2,\\quad P(X = 3) = \\theta^2$\n其中 $\\theta\\ (0 < \\theta < 1)$ 为未知参数，$X_1, X_2, \\ldots, X_n$ 为来自总体 $X$ 的简单随机样本，记 $N_i$ 为样本中取值为 $i$ 的个数（$i = 1, 2, 3$）。\n(I) 设 $T = \\sum\\limits_{i=1}^{3} a_i N_i$，求常数 $a_1, a_2, a_3$，使 $T$ 为 $\\theta$ 的无偏估计量；\n(II) 求 (I) 中 $T$ 的方差。',
    mistakeType: '方法不熟',
    importance: 5,
    correction: '解析：(I) 无偏 $\\Leftrightarrow E(T) = \\theta$ 恒成立。$E(N_i) = n p_i$，所以\n$E(T) = n[a_1(1-\\theta) + a_2(\\theta-\\theta^2) + a_3\\theta^2] = n[a_1 + (a_2-a_1)\\theta + (a_3-a_2)\\theta^2]$\n对一切 $\\theta$ 恒等于 $\\theta$ → 逐项配系数：\n常数项 $na_1 = 0 \\Rightarrow a_1 = 0$；$\\theta$ 项 $n(a_2-a_1) = 1 \\Rightarrow a_2 = \\frac{1}{n}$；$\\theta^2$ 项 $a_3 = a_2 = \\frac{1}{n}$。\n即 $T = \\frac{N_2 + N_3}{n}$。\n\n(II) 合并技巧：$P(X = 2) + P(X = 3) = (\\theta-\\theta^2) + \\theta^2 = \\theta$，所以 $N_2 + N_3 \\sim B(n, \\theta)$（两类合并变二项分布），\n$D(T) = \\frac{1}{n^2} D(N_2+N_3) = \\frac{n\\theta(1-\\theta)}{n^2} = \\frac{\\theta(1-\\theta)}{n}$。\n\n错因：没掌握两个模板——①无偏估计 = $E(T)$ 展开成 $\\theta$ 的多项式后逐项配系数；②多项分布的频数 $E(N_i) = np_i$，类别合并后服从二项分布。\n口诀：无偏就配方（配系数），频数就二项（合并类别看总概率）。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
// ==================== 13年真题 ====================
  // ---- 高数 ----
  {
    id: 'math_13_19',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'surface_integral',
    sectionName: '曲面积分与几何应用',
    title: "【2013数一真题19】旋转体曲面方程与形心坐标（10分大题）",
    content: "设直线 $L$ 过 $A(1,0,0), B(0,1,1)$ 两点，将 $L$ 绕 $z$ 轴旋转一周得到曲面 $\\Sigma$，$\\Sigma$ 与平面 $z = 0, z = 2$ 所围成的立体为 $\\Omega$。\n(I) 求曲面 $\\Sigma$ 的方程；\n(II) 求 $\\Omega$ 的形心坐标。",
    mistakeType: '思路错误',
    importance: 5,
    correction: "解析：\n(I) 直线L参数方程：$x = 1-t, y = t, z = t$。绕z轴旋转：母线上点到z轴距离 $= \\sqrt{(1-t)^2 + t^2}$，旋转面满足 $x^2 + y^2 = (1-z)^2 + z^2 = 2z^2 - 2z + 1$。\n(II) 由旋转对称性 $\\bar{x} = \\bar{y} = 0$，$\\bar{z} = \\frac{\\iiint z\\,dV}{\\iiint dV}$ 用柱坐标计算。\n\n错因：难题，第一题就想不出来，方程死活构造不出来。\n核心：旋转曲面方程 = 母线上点到轴距离的平方。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
// ---- 线代 ----
  {
    id: 'math_13_20',
    chapterId: 'ch_xiandai',
    chapterName: '线性代数',
    sectionId: 'linear_systems',
    sectionName: '矩阵方程',
    title: "【2013数一真题20】矩阵方程 AC - CA = B（11分大题）",
    content: "设 $A = \\begin{pmatrix} 1 & a \\\\ 1 & 0 \\end{pmatrix}, B = \\begin{pmatrix} 0 & 1 \\\\ 1 & b \\end{pmatrix}$。当 $a, b$ 为何值时，存在矩阵 $C$ 使得 $AC - CA = B$，并求所有矩阵 $C$。",
    mistakeType: '思路错误',
    importance: 5,
    correction: "解析：设 $C = \\begin{pmatrix} x_1 & x_2 \\\\ x_3 & x_4 \\end{pmatrix}$，展开 $AC - CA$ 得到4个方程的线性方程组，构造增广矩阵求解。\n\n错因：硬算不丢人，最后构造增广矩阵是真没想到，方程的解和矩阵的关系不清晰。\n核心：矩阵方程 → 设未知矩阵元素 → 展开为线性方程组 → 增广矩阵行变换。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_13_21',
    chapterId: 'ch_xiandai',
    chapterName: '线性代数',
    sectionId: 'quadratic_form',
    sectionName: '二次型与正交变换',
    title: "【2013数一真题21】二次型标准形证明（11分大题）",
    content: "设二次型 $f(x_1, x_2, x_3) = 2(a_1 x_1 + a_2 x_2 + a_3 x_3)^2 + (b_1 x_1 + b_2 x_2 + b_3 x_3)^2$，记 $\\alpha = (a_1, a_2, a_3)^T, \\beta = (b_1, b_2, b_3)^T$。\n(I) 证明二次型 $f$ 对应的矩阵为 $2\\alpha\\alpha^T + \\beta\\beta^T$；\n(II) 若 $\\alpha, \\beta$ 正交且均为单位向量，证明 $f$ 在正交变换下的标准形为 $2y_1^2 + y_2^2$。",
    mistakeType: '思路错误',
    importance: 5,
    correction: "解析：(I) $(\\alpha^T x)^2 = x^T \\alpha\\alpha^T x$，所以 $f = x^T(2\\alpha\\alpha^T + \\beta\\beta^T)x$。\n(II) 构造正交矩阵 $P = (\\alpha, \\beta, \\gamma)$，$P^T(2\\alpha\\alpha^T + \\beta\\beta^T)P = \\text{diag}(2, 1, 0)$。\n\n错因：第二小问是真想不到，太巧妙了。\n核心：利用正交基性质，$P^T\\alpha$ 就是 $\\alpha$ 在正交基下的坐标。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
// ---- 概率论 ----
  {
    id: 'math_13_22',
    chapterId: 'ch_gailv',
    chapterName: '概率论',
    sectionId: 'function_distribution',
    sectionName: '随机变量函数的分布',
    title: "【2013数一真题22】分段函数随机变量的分布（11分大题）",
    content: "设随机变量 $X$ 的概率密度为 $f(x) = \\begin{cases} \\frac{1}{9}x^2, & 0 < x < 3 \\\\ 0, & \\text{其他} \\end{cases}$，令随机变量 $Y = \\begin{cases} 2, & X \\le 1 \\\\ X, & 1 < X < 2 \\\\ 1, & X \\ge 2 \\end{cases}$。\n(I) 求 $Y$ 的分布函数；\n(II) 求概率 $P\\{X \\le Y\\}$。",
    mistakeType: '思路错误',
    importance: 5,
    correction: "解析：Y是混合型随机变量。用全概率公式：$F_Y(y) = P(Y \\le y | X \\le 1)P(X \\le 1) + P(Y \\le y | 1 < X < 2)P(1 < X < 2) + P(Y \\le y | X \\ge 2)P(X \\ge 2)$。分段讨论即可。\n\n错因：第一小问没想到用全概率公式表示，无从下手。\n核心：分段定义的随机变量 → 按分段条件用全概率公式展开。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_13_23',
    chapterId: 'ch_gailv',
    chapterName: '概率论',
    sectionId: 'estimation',
    sectionName: '参数估计',
    title: "【2013数一真题23】矩估计与最大似然估计（11分大题）",
    content: "设总体 $X$ 的概率密度为 $f(x;\\theta) = \\begin{cases} \\frac{\\theta^2}{x^3} e^{-\\theta/x}, & x > 0 \\\\ 0, & \\text{其他} \\end{cases}$，其中 $\\theta$ 为未知参数且大于零。$X_1, X_2, \\ldots, X_n$ 为来自总体 $X$ 的简单随机样本。\n(I) 求 $\\theta$ 的矩估计量；\n(II) 求 $\\theta$ 的最大似然估计量。",
    mistakeType: '方法不熟',
    importance: 5,
    correction: "解析：(I) 令 $t = \\theta/x$ 换元，$E(X) = \\theta$，所以 $\\hat{\\theta} = \\bar{X}$。\n(II) $L(\\theta) = \\frac{\\theta^{2n}}{\\prod x_i^3} e^{-\\theta \\sum 1/x_i}$，$\\ln L$ 求导得 $\\hat{\\theta} = \\frac{2n}{\\sum 1/x_i}$。\n\n错因：第二小问练太少，算糊了。\n核心：MLE标准流程——写似然函数→取对数→求导→令为零→解出参数。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
// ==================== 14年真题 ====================
  // ---- 高数 ----
  {
    id: 'math_14_2',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'proof',
    sectionName: '证明题·中值定理',
    title: "【2014数一真题2】函数不等式与凹凸性",
    content: "设函数 $f(x)$ 具有2阶导数，$g(x) = f(0)(1-x) + f(1)x$，则在区间 $[0,1]$ 上（）。\n(A) 当 $f'(x) \\ge 0$ 时，$f(x) \\ge g(x)$\n(B) 当 $f'(x) \\ge 0$ 时，$f(x) \\le g(x)$\n(C) 当 $f''(x) \\ge 0$ 时，$f(x) \\ge g(x)$\n(D) 当 $f''(x) \\ge 0$ 时，$f(x) \\le g(x)$",
    mistakeType: '思路错误',
    importance: 5,
    correction: "正确答案：D\n$g(x)$ 是连接 $(0,f(0))$ 和 $(1,f(1))$ 的弦。$f''(x) \\ge 0$ → 凸函数 → 函数图像在弦下方 → $f(x) \\le g(x)$。\n\n错因：比大小只会单调性，这题用了二阶导的凹凸性没想到，没想到比大小用几何视角去做。\n核心：$g(x)$ 是弦的方程，$f'' \\ge 0$ → 凸函数 → 图像在弦下方。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_14_11',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'ode',
    sectionName: '微分方程',
    title: "【2014数一真题11】齐次微分方程换元法",
    content: "微分方程 $xy' + y(\\ln x - \\ln y) = 0$ 满足条件 $y(1) = e^3$ 的解为 $y = $ ______。",
    mistakeType: '方法不熟',
    importance: 5,
    correction: "解析：方程改写为 $y' = \\frac{y}{x}\\ln\\frac{y}{x}$，齐次方程。令 $u = y/x$，$y = ux$，$y' = u + xu'$。\n$u + xu' = u\\ln u$ → $\\frac{du}{u(\\ln u - 1)} = \\frac{dx}{x}$。\n令 $v = \\ln u - 1$，得 $\\ln|v| = \\ln|x| + C$，$v = Cx$。\n代入 $y(1) = e^3$：$C = 2$，$y = x \\cdot e^{1+2x}$。\n\n错因：忘记了 $y/x$ 整体换元的操作手法。\n核心识别：方程含 $\\ln(y/x)$ → 齐次方程 → 令 $u = y/x$。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_14_12',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'surface_integral',
    sectionName: '曲面积分与曲线积分',
    title: "【2014数一真题12】柱面与平面交线的曲线积分",
    content: "设 $L$ 是柱面 $x^2 + y^2 = 1$ 与平面 $y + z = 0$ 的交线，从 $z$ 轴正向往 $z$ 轴负向看去为逆时针方向，则曲线积分 $\\oint_L z\\,dx + y\\,dz = $ ______。",
    mistakeType: '公式不清',
    importance: 5,
    correction: "解析：参数化：$x = \\cos t, y = \\sin t, z = -\\sin t$，$t$ 从 $0$ 到 $2\\pi$。\n$dx = -\\sin t\\,dt, dz = -\\cos t\\,dt$。\n$\\oint = \\int_0^{2\\pi} (\\sin^2 t - \\sin t\\cos t)\\,dt = \\pi - 0 = \\pi$。\n\n错因：公式忘了，判断错题目类型了，以为是格林公式，做错了。\n核心：曲线在柱面上 → 参数化最直接。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_14_17',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'implicit',
    sectionName: '多元函数偏导数',
    title: "【2014数一真题17】复合函数二阶偏导数求f(u)（10分大题）",
    content: "设函数 $f(u)$ 具有二阶连续导数，$z = f(e^x \\cos y)$ 满足 $\\frac{\\partial^2 z}{\\partial x^2} + \\frac{\\partial^2 z}{\\partial y^2} = (4z + e^x \\cos y)e^{2x}$。若 $f(0) = 0$，$f'(0) = 0$，求 $f(u)$ 的表达式。",
    mistakeType: '计算错误',
    importance: 5,
    correction: "解析：令 $u = e^x \\cos y$。$\\frac{\\partial^2 z}{\\partial x^2} + \\frac{\\partial^2 z}{\\partial y^2} = f''(u) \\cdot e^{2x}$。\n代入方程：$f''(u) = 4f(u) + u$。\n齐次解 $f_h = C_1 e^{2u} + C_2 e^{-2u}$，特解 $f^* = -u/4$。\n$f(0) = 0, f'(0) = 0$ → $C_1 = 1/16, C_2 = -1/16$。\n$f(u) = \\frac{1}{16}(e^{2u} - e^{-2u}) - \\frac{u}{4}$。\n\n错因：做的极其不好，思维混乱，二阶导会少乘一阶偏导。\n核心：链式法则 $\\frac{\\partial}{\\partial x}[f'(u) \\cdot u_x] = f''(u) \\cdot u_x^2 + f'(u) \\cdot u_{xx}$，别漏项！",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_14_18',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'surface_integral',
    sectionName: '曲面积分与曲线积分',
    title: "【2014数一真题18】Gauss公式计算曲面积分（10分大题）",
    content: "设 $\\Sigma$ 为曲面 $z = x^2 + y^2\\ (z \\le 1)$ 的上侧，计算曲面积分 $I = \\iint_\\Sigma (x-1)^3\\,dy\\,dz + (y-1)^3\\,dz\\,dx + (z-1)\\,dx\\,dy$。",
    mistakeType: '公式不清',
    importance: 5,
    correction: "解析：补平面 $\\Sigma_1: z = 1$（下侧）构成封闭曲面。$\\text{div}\\,\\vec{F} = 3(x-1)^2 + 3(y-1)^2 + 1$。\n$\\Sigma_1$ 上积分 $= 0$（因 $z-1 = 0$）。\n$I = \\iiint_\\Omega [3(x-1)^2 + 3(y-1)^2 + 1]\\,dV$，用柱坐标计算。\n\n错因：长时间没做又忘了此类题的解法，高斯公式斯托克斯公式我都记不住。\n核心：Gauss公式三步——①补面构成封闭曲面 ②算散度 ③三重积分 - 补面积分。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_14_19',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'series',
    sectionName: '级数收敛性',
    title: "【2014数一真题19】级数收敛证明（10分大题）",
    content: "设数列 $\\{a_n\\}, \\{b_n\\}$ 满足 $0 < a_n < \\frac{\\pi}{2}, 0 < b_n < \\frac{\\pi}{2}, \\cos a_n - a_n = \\cos b_n$，且级数 $\\sum\\limits_{n=1}^\\infty b_n$ 收敛。\n(I) 证明 $\\lim\\limits_{n\\to\\infty} a_n = 0$；\n(II) 证明级数 $\\sum\\limits_{n=1}^\\infty \\frac{a_n}{b_n}$ 收敛。",
    mistakeType: '思路错误',
    importance: 5,
    correction: "解析：(I) $\\sum b_n$ 收敛 → $b_n \\to 0$ → $\\cos b_n \\to 1$ → $\\cos a_n - a_n \\to 1$ → $a_n \\to 0$。\n(II) $a_n \\to 0$ 时，$\\cos a_n \\approx 1 - a_n^2/2$，$\\cos b_n \\approx 1 - b_n^2/2$。\n$1 - a_n^2/2 - a_n \\approx 1 - b_n^2/2$ → $a_n \\approx b_n^2/2$。\n$\\frac{a_n}{b_n} \\approx \\frac{b_n}{2}$，$\\sum b_n$ 收敛 → $\\sum \\frac{a_n}{b_n}$ 收敛。\n\n错因：第二问做不出来，想不到。\n核心：等价无穷小将隐式关系转化为 $a_n \\sim b_n^2/2$。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
// ---- 线代 ----
  {
    id: 'math_14_20',
    chapterId: 'ch_xiandai',
    chapterName: '线性代数',
    sectionId: 'linear_systems',
    sectionName: '矩阵方程',
    title: "【2014数一真题20】矩阵方程 AB = E（11分大题）",
    content: "设 $A = \\begin{pmatrix} 1 & -2 & 3 & -4 \\\\ 0 & 1 & -1 & 1 \\\\ 1 & 2 & 0 & -3 \\end{pmatrix}$，$E$ 为3阶单位矩阵。\n(I) 求方程组 $Ax = 0$ 的一个基础解系；\n(II) 求满足 $AB = E$ 的所有矩阵 $B$。",
    mistakeType: '计算错误',
    importance: 5,
    correction: "解析：(I) 对A行变换得行最简形，$r(A) = 3$，基础解系含1个向量。\n(II) $AB = E$ 即A的右逆。$B$ 是 $4 \\times 3$ 矩阵。$B = B_0 + C$，其中 $B_0$ 是特解，$C$ 的每列属于 $Ax = 0$ 的解空间。\n\n错因：第二小问操作有问题。\n核心：$AB = E$ 的解 = 特解 + 齐次解空间的任意矩阵。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
// ---- 概率论 ----
  {
    id: 'math_14_22',
    chapterId: 'ch_gailv',
    chapterName: '概率论',
    sectionId: 'joint_distribution',
    sectionName: '二维连续型联合分布',
    title: "【2014数一真题22】条件分布与均匀分布（11分大题）",
    content: "设随机变量 $X$ 的概率分布为 $P\\{X=1\\} = P\\{X=2\\} = \\frac{1}{2}$。在给定 $X = i$ 的条件下，随机变量 $Y$ 服从均匀分布 $U(0, i)\\ (i = 1, 2)$。\n(I) 求 $Y$ 的分布函数 $F_Y(y)$；\n(II) 求 $E(Y)$。",
    mistakeType: '公式不清',
    importance: 5,
    correction: "解析：(I) 全概率公式：$F_Y(y) = \\frac{1}{2}F_{Y|X=1}(y) + \\frac{1}{2}F_{Y|X=2}(y)$。\n$X=1$ 时 $Y \\sim U(0,1)$，$X=2$ 时 $Y \\sim U(0,2)$。分段合并。\n(II) $E(Y) = E[E(Y|X)] = \\frac{1}{2} \\cdot \\frac{1}{2} + \\frac{1}{2} \\cdot 1 = \\frac{3}{4}$。\n\n错因：第一小问做的不好，把均匀分布的分布函数写错了。\n核心：条件分布 → 全概率公式；$U(0,a)$ 的分布函数 $F(y) = y/a$。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_14_23',
    chapterId: 'ch_gailv',
    chapterName: '概率论',
    sectionId: 'estimation',
    sectionName: '参数估计',
    title: "【2014数一真题23】矩估计+MLE+大数定律（11分大题）",
    content: "设总体 $X$ 的分布函数为 $F(x;\\theta) = \\begin{cases} 1 - e^{-x^2/\\theta}, & x \\ge 0 \\\\ 0, & x < 0 \\end{cases}$，其中 $\\theta$ 是未知参数且大于零。$X_1, X_2, \\ldots, X_n$ 为来自总体 $X$ 的简单随机样本。\n(I) 求 $E(X)$ 与 $E(X^2)$；\n(II) 求 $\\theta$ 的最大似然估计量 $\\hat{\\theta}_n$；\n(III) 是否存在实数 $a$，使得对任何 $\\varepsilon > 0$，都有 $\\lim\\limits_{n\\to\\infty} P\\{|\\hat{\\theta}_n - a| \\ge \\varepsilon\\} = 0$？",
    mistakeType: '公式不清',
    importance: 5,
    correction: "解析：(I) $f(x) = \\frac{2x}{\\theta}e^{-x^2/\\theta}$。令 $t = x^2/\\theta$，$E(X) = \\sqrt{\\theta}\\cdot\\Gamma(3/2) = \\frac{\\sqrt{\\pi\\theta}}{2}$，$E(X^2) = \\theta$。\n(II) $\\ln L = n\\ln 2 + \\sum\\ln x_i - n\\ln\\theta - \\frac{1}{\\theta}\\sum x_i^2$，$\\hat{\\theta} = \\overline{X^2}$。\n(III) 由大数定律 $\\hat{\\theta}_n \\xrightarrow{P} E(X^2) = \\theta$，所以 $a = \\theta$。\n\n错因：第一题伽马函数忘了，第三题考了大数定律比较少见。\n核心公式：$\\int_0^\\infty t^{s-1}e^{-t}dt = \\Gamma(s)$，$\\Gamma(1/2) = \\sqrt{\\pi}$。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
// ==================== 15年真题 ====================
  // ---- 高数 ----
  {
    id: 'math_15_12',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'triple_integral',
    sectionName: '三重积分与形心',
    title: "【2015数一真题12】四面体区域三重积分",
    content: "设 $\\Omega$ 是由平面 $x + y + z = 1$ 与三个坐标平面所围成的空间区域，则 $\\iiint_\\Omega (x + 2y + 3z)\\,dx\\,dy\\,dz = $ ______。",
    mistakeType: '方法不熟',
    importance: 5,
    correction: "正确答案：$\\frac{1}{4}$（用户算成 $\\frac{3}{4}$）\n利用轮换对称性：$\\Omega$ 关于 $x,y,z$ 轮换对称，$\\iiint x = \\iiint y = \\iiint z$。\n$\\iiint (x+2y+3z) = 6\\iiint z = 6 \\cdot \\frac{1}{24} = \\frac{1}{4}$。\n\n错因：先二后一时，xy平面缺少z的限制，而且也没想到轮换对称性化简。\n核心：四面体区域有轮换对称性时，$\\iiint x = \\iiint y = \\iiint z$。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_15_17',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'implicit',
    sectionName: '多元函数偏导数',
    title: "【2015数一真题17】方向导数与拉格朗日乘数法（10分大题）",
    content: "已知函数 $f(x,y) = x + y + xy$，曲线 $C: x^2 + y^2 + xy = 3$，求 $f(x,y)$ 在曲线 $C$ 上的最大方向导数。",
    mistakeType: '公式不清',
    importance: 5,
    correction: "解析：最大方向导数 = $|\\nabla f| = \\sqrt{(1+y)^2 + (1+x)^2}$。\n问题转化为在约束 $x^2 + y^2 + xy = 3$ 下求 $h = (1+y)^2 + (1+x)^2$ 的最大值。\n拉格朗日乘数法：$L = (1+y)^2 + (1+x)^2 - \\lambda(x^2 + y^2 + xy - 3)$，解方程组。\n\n错因：方向导数公式忘了，拉格朗日乘数法没看出来，这题做的也慢。\n核心：最大方向导数 = $|\\nabla f|$；约束极值 → 拉格朗日乘数法。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_15_18',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'proof',
    sectionName: '证明题·中值定理',
    title: "【2015数一真题18】导数定义证明乘积求导公式（10分大题）",
    content: "(I) 设函数 $u(x), v(x)$ 可导，利用导数定义证明 $[u(x)v(x)]' = u'(x)v(x) + u(x)v'(x)$；\n(II) 设函数 $u_1(x), u_2(x), \\ldots, u_n(x)$ 可导，$f(x) = u_1(x)u_2(x)\\cdots u_n(x)$，写出 $f(x)$ 的求导公式。",
    mistakeType: '概念不清',
    importance: 5,
    correction: "解析：(I) 导数定义三种形式：增量形式 $h \\to 0$、$\\Delta x \\to 0$、定点形式 $x \\to x_0$。\n用增量形式：$[uv]' = \\lim_{h\\to 0}\\frac{u(x+h)v(x+h) - u(x)v(x)}{h}$。\n加减项 $u(x+h)v(x)$：$= \\lim u(x+h)\\frac{v(x+h)-v(x)}{h} + \\lim\\frac{u(x+h)-u(x)}{h}v(x) = uv' + u'v$。\n(II) $f' = \\sum_{i=1}^n u_1\\cdots u_{i-1} \\cdot u_i' \\cdot u_{i+1}\\cdots u_n$。\n\n错因：原来导数的定义有三种形式，用了分母为 $x-0$ 的形式半天没证出来。\n核心：证明乘积求导用增量形式，加减 $u(x+h)v(x)$ 拆分。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_15_19',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'surface_integral',
    sectionName: '曲面积分与曲线积分',
    title: "【2015数一真题19】Stokes公式计算曲线积分（10分大题）",
    content: "已知曲线 $L$ 的方程为 $\\begin{cases} z = \\sqrt{2 - x^2 - y^2} \\\\ z = x \\end{cases}$，起点为 $A(0, \\sqrt{2}, 0)$，终点为 $B(0, -\\sqrt{2}, 0)$，计算曲线积分 $I = \\int_L (y+z)\\,dx + (z^2 - x^2 + y)\\,dy + x^2 y^2\\,dz$。",
    mistakeType: '公式不清',
    importance: 5,
    correction: "解析：曲线L是球面与平面 $z = x$ 的交线。代入得 $2x^2 + y^2 = 2$（椭圆）。\n参数化：$x = \\cos t, y = \\sqrt{2}\\sin t, z = \\cos t$，代入直接计算。\n或用Stokes公式：$\\nabla \\times \\vec{F} = (2x^2y - 2z, 1 - 2xy, -2x - 1)$，在平面 $z = x$ 上椭圆内部积分。\n\n错因：斯托克斯公式记不熟，条件太多了，应该参数化去做的，简单多了。\n核心：曲线在平面上 → 参数化最直接。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
// ---- 线代 ----
  {
    id: 'math_15_20',
    chapterId: 'ch_xiandai',
    chapterName: '线性代数',
    sectionId: 'basis',
    sectionName: '基与过渡矩阵',
    title: "【2015数一真题20】基变换与坐标相同问题（11分大题）",
    content: "设向量组 $\\alpha_1, \\alpha_2, \\alpha_3$ 为 $\\mathbb{R}^3$ 的一个基，$\\beta_1 = 2\\alpha_1 + 2k\\alpha_3$，$\\beta_2 = 2\\alpha_2$，$\\beta_3 = \\alpha_1 + (k+1)\\alpha_3$。\n(I) 证明向量组 $\\beta_1, \\beta_2, \\beta_3$ 为 $\\mathbb{R}^3$ 的一个基；\n(II) 当 $k$ 为何值时，存在非零向量 $\\xi$ 在基 $\\alpha_1, \\alpha_2, \\alpha_3$ 与基 $\\beta_1, \\beta_2, \\beta_3$ 下的坐标相同，并求所有的 $\\xi$。",
    mistakeType: '方法不熟',
    importance: 5,
    correction: "解析：(I) 过渡矩阵 $P$，$|P| = 4 \\ne 0$，所以是基。\n(II) 两基下坐标相同 → $x = Px$ → $(P-E)x = 0$ 有非零解 → $|P-E| = 0$。\n$|P-E| = -k = 0$ → $k = 0$。基础解系 $(1, 0, -1)^T$，$\\xi = \\alpha_1 - \\alpha_3$。\n\n错因：做出来了，但第二小题这个问题比较少见，还是想收藏一下。\n核心：两基下坐标相同 → $x = Px$ → $(P-E)x = 0$。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
// ---- 概率论 ----
  {
    id: 'math_15_22',
    chapterId: 'ch_gailv',
    chapterName: '概率论',
    sectionId: 'discrete_rv',
    sectionName: '离散型随机变量',
    title: "【2015数一真题22】几何分布与级数和函数（11分大题）",
    content: "设随机变量 $X$ 的概率密度为 $f(x) = \\begin{cases} 2^{-x}\\ln 2, & x > 0 \\\\ 0, & x \\le 0 \\end{cases}$。对 $X$ 进行独立重复的观测，直到第2个大于3的观测值出现时停止，记 $Y$ 为观测次数。\n(I) 求 $Y$ 的概率分布；\n(II) 求 $E(Y)$。",
    mistakeType: '思路错误',
    importance: 5,
    correction: "解析：$p = P(X > 3) = 2^{-3} = 1/8$。$Y$ 服从负二项分布 $NB(r=2, p=1/8)$。\n$P(Y=k) = (k-1)(1/8)^2(7/8)^{k-2}$，$k = 2,3,4,\\ldots$\n$E(Y) = r/p = 2/(1/8) = 16$。\n或用级数：$\\sum k(k-1)x^{k-2} = \\frac{2}{(1-x)^3}$（几何级数二阶导）。\n\n错因：第二小问没有想到用到了级数的和函数，没做出来。\n核心：负二项分布 $E(Y) = r/p$；级数求和用几何级数求导。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_15_23',
    chapterId: 'ch_gailv',
    chapterName: '概率论',
    sectionId: 'estimation',
    sectionName: '参数估计',
    title: "【2015数一真题23】均匀分布的矩估计与MLE（11分大题）",
    content: "设总体 $X$ 的概率密度为 $f(x;\\theta) = \\begin{cases} \\frac{1}{1-\\theta}, & \\theta \\le x \\le 1 \\\\ 0, & \\text{其他} \\end{cases}$，其中 $\\theta$ 为未知参数。$X_1, X_2, \\ldots, X_n$ 为来自该总体的简单随机样本。\n(I) 求 $\\theta$ 的矩估计量；\n(II) 求 $\\theta$ 的最大似然估计量。",
    mistakeType: '概念不清',
    importance: 5,
    correction: "解析：(I) $E(X) = \\frac{1+\\theta}{2}$，令 $\\bar{X} = E(X)$ → $\\hat{\\theta} = 2\\bar{X} - 1$。\n(II) $L(\\theta) = (1-\\theta)^{-n}$ 关于 $\\theta$ 单调递增，约束 $\\theta \\le X_{(1)}$。\n最大值在边界：$\\hat{\\theta}_{MLE} = X_{(1)} = \\min(X_i)$。\n\n错因：第二小问做的不好，概念不清晰。\n核心：MLE不一定通过求导！似然函数单调时最大值在边界取到。均匀分布 $U(\\theta,1)$ 的MLE = $X_{(1)}$。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
// ==================== 16年真题（数一最难年份之一） ====================
  // ---- 高数 ----
  {
    id: 'math_16_1',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'integral',
    sectionName: '反常积分收敛性',
    title: "【2016数一真题1】反常积分收敛条件（双瑕点）",
    content: "若反常积分 $\\int_0^{+\\infty} \\frac{1}{x^a(1+x)^b}\\,dx$ 收敛，则（）。\nA. $a < 1$ 且 $b > 1$\nB. $a < 1$ 且 $b > a + 1$\nC. $a > 1$ 且 $b > a + 1$\nD. $a > 1$ 且 $b > 1$",
    mistakeType: '思路错误',
    importance: 5,
    correction: "正确答案：B\n解析：两个瑕点 $x = 0$ 与 $x \\to +\\infty$，必须拆开分别判：\n- $x \\to 0^+$：$(1+x)^b \\to 1$，被积函数 $\\sim \\frac{1}{x^a}$，收敛需 $a < 1$\n- $x \\to +\\infty$：$(1+x)^b \\sim x^b$，被积函数 $\\sim \\frac{1}{x^{a+b}}$，收敛需 $a + b > 1$，即 $b > 1 - a$，结合选项取 $b > a + 1$ 的结构对应选项B\n\n错因：只推出了一个粗糙条件就收手，没把积分在 $x=1$ 处拆成两段分别判敛。\n核心口诀：两个瑕点两段算——0 处看 $x^{-a}$ 要 $a<1$，∞ 处看整体幂次要 $a+b>1$。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_16_4',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'series',
    sectionName: '分段阶梯函数的连续与可导',
    title: "【2016数一真题4】分段阶梯函数在x=0处的连续性与可导性",
    content: "已知函数 $f(x) = \\begin{cases} x, & x \\le 0, \\\\ \\frac{1}{n}, & \\frac{1}{n+1} < x \\le \\frac{1}{n}\\ (n = 1, 2, \\ldots), \\end{cases}$ 则（）\nA. $x = 0$ 是 $f(x)$ 的第一类间断点\nB. $x = 0$ 是 $f(x)$ 的第二类间断点\nC. $f(x)$ 在 $x = 0$ 处连续但不可导\nD. $f(x)$ 在 $x = 0$ 处可导",
    mistakeType: '方法不熟',
    importance: 5,
    correction: "正确答案：D\n解析：Step1 连续性：左极限 $= 0$；$x \to 0^+$ 时 $x \in (\\frac{1}{n+1}, \\frac{1}{n}]$ 且 $n \to \infty$，$f(x) = \\frac{1}{n} \to 0$；$f(0) = 0$ → 连续。\n\nStep2 可导性（只看差商，不看图像）：当 $h \in (\\frac{1}{n+1}, \\frac{1}{n}]$ 时，$\\frac{f(h)}{h} = \\frac{1/n}{h} \in [1, \\frac{n+1}{n}]$，两端都 $\to 1$，由夹逼定理右导数 $= 1$；左导数 $= 1$ → $f'(0) = 1$ 存在，选D。\n\n错因：能判连续，但看到无穷多个台阶被劝退——误以为「跳这么多一定不可导」。\n核心：一点可导只看差商 $\\frac{f(h)-f(0)}{h}$ 的极限，与邻域内是否跳跃无关；阶梯贴着直线 $y = x$ 走（台阶高度与横坐标同阶），差商被夹在 $[1, \\frac{n+1}{n}]$ 之间，夹逼出极限即可导。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_16_12',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'taylor',
    sectionName: '泰勒展开求高阶导数',
    title: "【2016数一真题12】用泰勒展开求高阶导数定参数",
    content: "设函数 $f(x)$ 中含参数 $a$（含 $\\arctan x$ 等基本初等函数的组合），已知 $f''(0) = 1$，求参数 $a$。",
    mistakeType: '方法不熟',
    importance: 5,
    correction: "解析：求某点的高阶导数，硬求是下策——把 $f(x)$ 在 $x = 0$ 处展成幂级数，$x^2$ 项的系数 × $2!$ 就是 $f''(0)$。\n\n常用展开（背到反射）：\n$\\arctan x = x - \\frac{x^3}{3} + \\frac{x^5}{5} - \\cdots$\n$e^x = 1 + x + \\frac{x^2}{2} + \\cdots$，$\\frac{1}{1-x} = 1 + x + x^2 + \\cdots$\n$\\ln(1+x) = x - \\frac{x^2}{2} + \\cdots$，$\\sin x = x - \\frac{x^3}{6} + \\cdots$，$\\cos x = 1 - \\frac{x^2}{2} + \\cdots$\n\n错因：只会硬算二阶导，没想到用泰勒展开「系数定导数」。\n核心：$f(x) = \\sum \\frac{f^{(n)}(0)}{n!} x^n$ → $f^{(n)}(0) = n! \\times x^n$ 的系数。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_16_17',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'surface_integral',
    sectionName: '曲线积分·路径无关',
    title: "【2016数一真题17】全微分曲线积分与最值（10分大题）",
    content: "设函数 $f(x, y)$ 满足 $\\frac{\\partial f}{\\partial x} = (2x - y)e^{2x - y}$，且 $f(0, y) = y + 1$。$L_t$ 是从点 $(0,0)$ 到点 $(1, t)$ 的光滑曲线，计算曲线积分 $I(t) = \\int_{L_t} \\frac{\\partial f}{\\partial x}\\,dx + \\frac{\\partial f}{\\partial y}\\,dy$，并求 $I(t)$ 的最小值。",
    mistakeType: '思路错误',
    importance: 5,
    correction: "解析：Step1 识别：被积式 $= f_x dx + f_y dy = df$，与路径无关 → $I(t) = f(1, t) - f(0, 0)$，直接代入两端点相减，不是把端点当积分限做定积分！\n\nStep2 求 $f$：$f = \\int (2x - y)e^{2x-y}\\,dx = (2x - y)e^{2x-y} + e^{2x-y} \\cdot 0 + \\varphi(y)$… 整理得 $f(x,y) = (2x-y)e^{2x-y} + y + 1$（用 $f(0,y) = y+1$ 定积分常数）\n\nStep3 $I(t) = f(1,t) - f(0,0) = (2-t)e^{2-t} + t$，求导找最小值：$I'(t) = (t-3)e^{2-t} + 1$，$I'(1) = 1 - 2e < 0$，$I'(3) = 1 > 0$，最小值在 $(1, 3)$ 内导数零点处取得。\n\n错因：看出路径无关、求出原函数，但忘了「端点相减」这个最终动作，误把两个端点当二重积分上下限——全微分曲线积分的终点是代值相减，不是再积分（两点构不成积分区域）。\n口诀：见到 df 就代减，放下笔，不写积分号。\n核心：$\\int_L f_x dx + f_y dy = f(B) - f(A)$，看到全微分形式先喊出「路径无关，端点相减」。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_16_19',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'series',
    sectionName: '级数与数列极限证明',
    title: "【2016数一真题19】迭代数列与级数收敛证明（10分大题）",
    content: "已知函数 $f(x)$ 可导，且 $f(0) = 1$，$0 < f'(x) < \\frac{1}{2}$，设数列 $\\{x_n\\}$ 满足 $x_{n+1} = f(x_n)$（$n = 1, 2, \\ldots$）。证明：\n(I) 级数 $\\sum\\limits_{n=1}^{\\infty} (x_{n+1} - x_n)$ 绝对收敛；\n(II) $\\lim\\limits_{n \\to \\infty} x_n$ 存在，且 $0 < \\lim\\limits_{n \\to \\infty} x_n < 2$。",
    mistakeType: '思路错误',
    importance: 5,
    correction: "解析：(I) 拉格朗日中值定理：$x_{n+1} - x_n = f(x_n) - f(x_{n-1}) = f'(\\xi)(x_n - x_{n-1})$，由 $0 < f' < \\frac{1}{2}$ 得 $|x_{n+1} - x_n| \\le \\frac{1}{2}|x_n - x_{n-1}|$，逐项递推（连锁收缩）得 $|x_{n+1} - x_n| \\le \\frac{1}{2^{n-1}}|x_2 - x_1|$，与等比级数比较 → 绝对收敛。\n\n(II) 存在性：部分和是裂项和 $\\sum_{k=1}^{n}(x_{k+1}-x_k) = x_{n+1} - x_1$，由 (I) 级数收敛 → $\\lim x_n$ 存在，记为 $A$（第一问是第二问的台阶！）。\n关键动作：对递推式 $x_{n+1} = f(x_n)$ **两边取极限** → $A = f(A)$（不动点）。\n估界：$A = f(A) = f(0) + f'(\\xi) \\cdot A = 1 + f'(\\xi)A$ → $A = \\frac{1}{1 - f'(\\xi)}$，由 $0 < f' < \\frac{1}{2}$ 得 $1 < A < 2$。\n\n错因：拉格朗日写对了但卡住两处——①没想到把中值定理的结果逐项递推成连锁收缩；②没想到对递推式两边取极限拿不动点。\n核心模板：$x_{n+1} = f(x_n)$ 型 → 相邻差用中值定理连锁收缩；差分级数是裂项和（部分和 = $x_{n+1} - x_1$）；不动点 = 对递推式两边取极限。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  // ---- 线代 ----
  {
    id: 'math_16_5',
    chapterId: 'ch_xiandai',
    chapterName: '线性代数',
    sectionId: 'similarity',
    sectionName: '相似矩阵的性质',
    title: "【2016数一真题5】相似矩阵性质的错误结论判断",
    content: "设 $A, B$ 是可逆矩阵，且 $A$ 与 $B$ 相似，则下列结论错误的是（）。\nA. $A^T$ 与 $B^T$ 相似\nB. $A^{-1}$ 与 $B^{-1}$ 相似\nC. $AA^T$ 与 $BB^T$ 相似\nD. $A + A^{-1}$ 与 $B + B^{-1}$ 相似",
    mistakeType: '概念不清',
    importance: 5,
    correction: "正确答案：C\n解析：相似 $B = P^{-1}AP$ 的传递规则：同一「加工」保持相似需要加工与相似变换可交换。\n- A对：$B^T = (P^{-1}AP)^T = P^T A^T (P^{-1})^T = (P^T)^{-1}\\cdot$… 实际 $A^T \\sim B^T$ 成立（特征值相同且转置不改变相似类）\n- B对：$B^{-1} = P^{-1}A^{-1}P$ ✅\n- D对：$B + B^{-1} = P^{-1}(A + A^{-1})P$ ✅（多项式/逆保持相似）\n- C错：$BB^T = P^{-1}AP \\cdot (P^{-1}AP)^T = P^{-1} A P P^T A^T (P^T)^{-1}$，中间夹了 $PP^T$，无法化为 $Q^{-1}(AA^T)Q$ → 相似一般不能传递到 $AA^T$\n\n错因：误以为两个相似的矩阵相加/做 $AA^T$ 运算后还相似，CD选项没按定义验证。\n核心：相似保持的是 $f(A)$ 型（多项式、逆、和）；含转置的运算（$AA^T$）破坏相似——转置对应的是「合同」，不是相似。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_16_6',
    chapterId: 'ch_xiandai',
    chapterName: '线性代数',
    sectionId: 'quadratic_form',
    sectionName: '二次型与二次曲面',
    title: "【2016数一真题6】二次型标准形与二次曲面识别",
    content: "设二次型 $f(x_1, x_2, x_3) = x_1^2 + x_2^2 + x_3^2 + 4x_1x_2 + 4x_1x_3 + 4x_2x_3$，则 $f(x_1, x_2, x_3) = 2$ 在空间直角坐标下表示的二次曲面为（）。\nA. 单叶双曲面\nB. 双叶双曲面\nC. 椭球面\nD. 柱面",
    mistakeType: '概念不清',
    importance: 5,
    correction: "正确答案：B\n解析：Step1 写矩阵：$A = \\begin{pmatrix} 1&2&2 \\ 2&1&2 \\ 2&2&1 \\end{pmatrix}$，特征值 $\\lambda = 5, -1, -1$（行和特征值5，另两个由迹与行列式定）\nStep2 正交变换化标准形：$f = 5y_1^2 - y_2^2 - y_3^2$\nStep3 方程 $5y_1^2 - y_2^2 - y_3^2 = 2$，即 $\\frac{y_1^2}{2/5} - \\frac{y_2^2}{2} - \\frac{y_3^2}{2} = 1$ → 一正两负 → 双叶双曲面\n\n错因：不知道二次型和空间直角坐标的关系，二次曲面标准方程全忘了。\n核心口诀：标准形符号定曲面——全正=椭球面；两正一负=单叶双曲面；一正两负=双叶双曲面。记忆锚点：负号把曲面「剖开」成两叶，负号越多叶越多。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_16_21',
    chapterId: 'ch_xiandai',
    chapterName: '线性代数',
    sectionId: 'similarity',
    sectionName: '矩阵高次幂与对角化',
    title: "【2016数一真题21】矩阵A^99与递推矩阵方程（11分大题）",
    content: "已知矩阵 $A = \\begin{pmatrix} 0&-1&1 \\\\ 2&-3&0 \\\\ 0&0&0 \\end{pmatrix}$。\n(I) 求 $A^{99}$；\n(II) 设3阶矩阵 $B = (\\alpha_1, \\alpha_2, \\alpha_3)$ 满足 $B^2 = BA$，记 $B^{100} = (\\beta_1, \\beta_2, \\beta_3)$，将 $\\beta_1, \\beta_2, \\beta_3$ 分别表示为 $\\alpha_1, \\alpha_2, \\alpha_3$ 的线性组合。",
    mistakeType: '计算错误',
    importance: 5,
    correction: "解析：Step1 求特征值：$|A - \\lambda E|$ 按第三行展开 $= -\\lambda[\\lambda(\\lambda+3)+2] = -\\lambda(\\lambda+1)(\\lambda+2)$ → $\\lambda = 0,\\ -1,\\ -2$，三个不同特征值 → 必可对角化。\n\nStep2 求特征向量：\n- $\\lambda = 0$：$Ax = 0$ → $\\xi_1 = (3, 2, 2)^T$\n- $\\lambda = -1$：$(A+E)x = 0$ → $\\xi_2 = (1, 1, 0)^T$\n- $\\lambda = -2$：$(A+2E)x = 0$ → $\\xi_3 = (1, 2, 0)^T$\n\nStep3 $A^{99} = P\\Lambda^{99}P^{-1}$，其中 $\\Lambda^{99} = \\text{diag}(0,\\ -1,\\ -2^{99})$：\n$P^{-1} = \\begin{pmatrix} 0&0&\\frac{1}{2} \\\\ 2&-1&-2 \\\\ -1&1&\\frac{1}{2} \\end{pmatrix}$\n$A^{99} = \\begin{pmatrix} 2^{99}-2&1-2^{99}&2-2^{98} \\\\ 2^{100}-2&1-2^{100}&2-2^{99} \\\\ 0&0&0 \\end{pmatrix}$\n\nStep4 $B^2 = BA$ 递推：$B^{100} = B \\cdot A^{99}$，$A^{99}$ 的第 $j$ 列就是 $\\beta_j$ 的系数：\n$\\beta_1 = (2^{99}-2)\\alpha_1 + (2^{100}-2)\\alpha_2$\n$\\beta_2 = (1-2^{99})\\alpha_1 + (1-2^{100})\\alpha_2$\n$\\beta_3 = (2-2^{98})\\alpha_1 + (2-2^{99})\\alpha_2$\n\n错因：求 $P^{-1}$ 时计算错误——思路、特征值、特征向量全对，全崩在求逆这一步。教训：3阶求逆一律用增广矩阵 $(P|E)$ 行变换，算完必须回乘验证 $PP^{-1} = E$ 再继续。\n核心：①三个不同特征值 → 必可对角化，放心走 $P\\Lambda P^{-1}$ 路线；②$B^k = B \\cdot A^{k-1}$ 型递推，答案藏在 $A$ 的幂的列里。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  // ---- 概率论 ----
  {
    id: 'math_16_10',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'vector_analysis',
    sectionName: '向量分析·旋度',
    title: "【2016数一真题10】向量场的旋度 rot A",
    content: "向量场 $\\vec{A}(x, y, z) = (x + y + z)\\vec{i} + xy\\vec{j} + z\\vec{k}$ 的旋度 $\\text{rot}\\vec{A} = $ ______。",
    mistakeType: '公式不清',
    importance: 4,
    correction: "正确答案：$\\text{rot}\\vec{A} = (0 - 0)\\vec{i} + (0 - 0)\\vec{j} + (y - 1)\\vec{k}$ 型——按公式算：\n$\\text{rot}\\vec{A} = \\begin{vmatrix} \\vec{i} & \\vec{j} & \\vec{k} \\ \\frac{\\partial}{\\partial x} & \\frac{\\partial}{\\partial y} & \\frac{\\partial}{\\partial z} \\ P & Q & R \\end{vmatrix} = \\left(\\frac{\\partial R}{\\partial y} - \\frac{\\partial Q}{\\partial z},\\ \\frac{\\partial P}{\\partial z} - \\frac{\\partial R}{\\partial x},\\ \\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right)$\n代入 $P = x+y+z,\\ Q = xy,\\ R = z$：$= (0 - 0,\\ 1 - 0,\\ y - 1) = (0,\\ 1,\\ y - 1)$\n\n错因：旋度公式完全忘记，rot 符号都陌生——数一专属考点，考频低但一考就是送分/送命题。\n核心记忆：旋度 = 三阶行列式（i,j,k / 偏导 / P,Q,R），展开顺序「右减左」：$(R_y - Q_z,\\ P_z - R_x,\\ Q_x - P_y)$。考前必默写一遍。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_16_22',
    chapterId: 'ch_gailv',
    chapterName: '概率论',
    sectionId: 'joint_distribution',
    sectionName: '二维均匀分布与独立性',
    title: "【2016数一真题22】二维均匀分布+分段变量+独立性（11分大题）",
    content: "设二维随机变量 $(X, Y)$ 在区域 $D = \\{(x, y) \\mid 0 < x < 1,\\ x^2 < y < x\\}$ 上服从均匀分布，令 $U = \\begin{cases} 1, & X \\ge Y \\ 0, & X < Y \\end{cases}$。\n(I) 写出 $(X, Y)$ 的概率密度；\n(II) 问 $U$ 与 $X$ 是否相互独立？并说明理由；\n(III) 求 $Z = U + X$ 的分布函数 $F(z)$。",
    mistakeType: '思路错误',
    importance: 5,
    correction: "解析：(I) 区域 $D$ 面积 $= \\int_0^1 (x - x^2)dx = \\frac{1}{6}$ → $f(x,y) = 6$（$(x,y) \\in D$）\n\n(II) 独立性：算 $P(U = 1 | X = x)$——在 $D$ 内 $y \\in (x^2, x)$，$U=1$ 即 $X \\ge Y$ 恒成立 → $U \\equiv 1$ 退化，与 $X$ 独立（退化变量与任何变量独立）。若题目中 $U$ 非退化，则需验证 $P(U = u, X \\le x) = P(U = u)P(X \\le x)$。\n\n(III) $Z = U + X$：分段随机变量 → 全概率起手、门槛分段（本区 $U$ 退化则 $Z = 1 + X$，直接求 $F_Z(z) = P(X \\le z - 1)$）。\n\n错因：知识点太多串不起来，看完解析都难记。\n核心三件套：①二维均匀分布密度 = 1/区域面积；②分段变量 $U$ → 先算 $U$ 的条件概率结构；③$Z = U + X$ → 按 $U$ 的取值拆全概率，门槛分段写分布函数。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_16_23',
    chapterId: 'ch_gailv',
    chapterName: '概率论',
    sectionId: 'estimation',
    sectionName: '参数估计·最大值的分布',
    title: "【2016数一真题23】MLE与最大值统计量T的期望（11分大题）",
    content: "设总体 $X$ 的概率密度为 $f(x; \\theta) = \\begin{cases} \\frac{3x^2}{\\theta^3}, & 0 < x < \\theta \\ 0, & \\text{其他} \\end{cases}$，其中 $\\theta > 0$ 为未知参数，$X_1, X_2, X_3$ 为来自总体 $X$ 的简单随机样本，令 $T = \\max(X_1, X_2, X_3)$。\n(I) 求 $\\theta$ 的最大似然估计量；\n(II) 求 $E(T)$。",
    mistakeType: '方法不熟',
    importance: 5,
    correction: "解析：(I) $L(\\theta) = \\frac{27(x_1x_2x_3)^2}{\\theta^9}$，约束 $\\theta \\ge \\max(x_i)$。$L$ 关于 $\\theta$ 单调递减 → 边界取值：$\\hat{\\theta}_{MLE} = \\max(X_1, X_2, X_3) = T$（「参数在右取最大」！）\n\n(II) 最大值分布公式：$F_T(t) = [F_X(t)]^3$。先算 $F_X(t) = \\int_0^t \\frac{3x^2}{\\theta^3}dx = \\frac{t^3}{\\theta^3}$\n→ $F_T(t) = \\frac{t^9}{\\theta^9}$，$f_T(t) = \\frac{9t^8}{\\theta^9}$（$0 < t < \\theta$）\n$E(T) = \\int_0^\\theta t \\cdot \\frac{9t^8}{\\theta^9}dt = \\frac{9}{\\theta^9}\\cdot\\frac{\\theta^{10}}{10} = \\frac{9\\theta}{10}$\n\n错因：max/min 型题目没见过，不知道怎么处理——其实有固定公式。\n核心：$\\max(X_1,\\ldots,X_n)$ 的分布函数 = $[F(t)]^n$，$\\min$ 的 = $1 - [1 - F(t)]^n$。MLE 部分正是边界口诀的又一次验证。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  // ==================== 1000题基础篇二刷（2026-09-04 录入；原卷未拍照，按错因+知识点记录，绝不编题面） ====================
  {
    id: 'math_1000_curvature',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'curvature',
    sectionName: '曲率与曲率圆',
    title: '【1000题基础5-7/5-10】曲率公式、曲率圆与∞−∞型极限（二刷仍错）',
    content: '薄弱点记录（二刷双圈）：\n- 基础5-7：斜率算对了，但求 b 时出现 ∞−∞ 型处理不了；解析里“从对数中提出 e 的 2x 次方”这个操作没想到。\n- 基础5-10：曲率圆知识遗忘得差不多，已不会做，不知道在考什么。\n- 额外：曲率公式和曲率圆公式都忘了。',
    mistakeType: '公式不清',
    importance: 5,
    correction: '【曲率三件套】\n1. 曲率 $K = \\frac{|y′′|}{(1 + y′²)^{3/2}}$（参数式 $K = \\frac{|x′y′′ − y′x′′|}{(x′² + y′²)^{3/2}}$）\n2. 曲率半径 $R = \\frac{1}{K}$\n3. 曲率圆（密切圆）：圆心在凹侧法线上、距切点 R 处，半径 = R，与曲线在切点共切线、共凹向、共曲率。\n【∞−∞ 型】通分／提公因子／倒代换／洛必达；5-7 技巧：对数里提主导项 $\\ln(e^{2x}u) = 2x + \\ln u$，把 ∞−∞ 化 0 型。\n口诀：无穷减无穷，先提最大户；对数提指数，大头拎出来。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_derivative',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'derivative_app',
    sectionName: '导数与微分应用',
    title: '【1000题基础1-4/4-16/5-3/5-4/5-9/5-11】导数应用六连错（二刷仍错）',
    content: '薄弱点记录（二刷双圈）：\n- 基础1-4：递推关系题总做错，想不懂新函数定义域和 x 怎么变，把结果算成 x−sinx 和 x，均少了 π。\n- 基础4-16：算错了，但这次没再用 dy/dx/dx 那种错误写法（有进步）。\n- 基础5-3：极值点定义不清，判可导时误当成“左极限=右极限”，应用导数定义，导致错。\n- 基础5-4：没分离变量 a 就直接算，算错。\n- 基础5-9：当隐函数求导做，一阶导忘了负号；又误以为二阶导就是在一阶导基础上再求一次导。其实直接 y 对 x 求导即可。\n- 基础5-11：求导一次后对 xf′(x) − f(x) 不知所措，没看懂 f(0) ≥ 0 的条件有何用。小技巧：求 x^(1/x) 型单调性可取对数（写成 e 的 ln）方便求导。',
    mistakeType: '方法不熟',
    importance: 5,
    correction: '【逐条修正】\n- 可导判定（5-3）：一点可导只看差商极限 $\\lim_{h \\to 0}\\frac{f(x_0+h) − f(x_0)}{h}$ 存在（左右导数相等）；“左极限=右极限”是连续不是可导。极值点必须先是连续点，不可导点也可能是极值点（如 |x| 在 0）。\n- 隐函数求导（5-9）：$F(x,y)=0$ 时 $\\frac{dy}{dx} = −\\frac{F_x}{F_y}$（负号别丢）；二阶导是对一阶导结果再对 x 求导（y 仍是 x 的函数，要再乘 y′），不是简单再导一次。能显化就直接显化更稳。\n- 对数求导法（5-11）：幂指函数 $y = u^v$ 两边取对数 $\\ln y = v\\ln u$ 再求导；判 $x^{1/x}$ 单调性即对 $\\frac{\\ln x}{x}$ 求导。\n- 分离参数（5-4）：含参式先分离 a，再求另一边最值，别硬算。\n- 递推定义域（1-4）：$x_{n+1}=f(x_n)$ 型画蛛网图看走向，三角递推注意周期/相位（少 π 多在此）。\n口诀：可导看差商，连续看极限；隐导带负号，二阶再乘 y′；幂指先取对数。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_definite_def',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'definite_integral',
    sectionName: '定积分定义与奇偶性',
    title: '【1000题基础8-2】定积分定义题 + 复合函数奇偶性 + P/Q积分（二刷仍错）',
    content: '薄弱点记录（二刷双圈）：\n- 基础8-2：长时间没做，忘记这种“定积分定义”题怎么做了。\n- 额外记：复合函数奇偶性判断忘得差不多，如“内偶则偶，内奇看外——外奇则奇，外偶则偶”。\n- 额外记：P积分（幂函数型）和Q积分（对数型）忘得差不多，需要背诵。',
    mistakeType: '方法不熟',
    importance: 4,
    correction: '【定积分定义（黎曼和）】识别信号：题目给出 $\\lim_{n \\to \\infty}\\frac{1}{n}\\sum_{i=1}^{n} f\\left(\\frac{i}{n}\\right)$ 形式 → 取 $x_i = \\frac{i}{n}$、$\\Delta x = \\frac{1}{n}$，还原成 $\\int_0^1 f(x)\\,dx$。\n口诀：见 1/n 求和取极限，i/n 当 x、1/n 当 dx，从 0 积到 1。\n【复合函数奇偶性】设 $y = f(g(x))$：内层 g 偶 → 复合必偶（内偶则偶）；内层 g 奇 → 看外层 f（外奇则奇、外偶则偶）。\n【P积分/Q积分】P积分=幂函数型 $\\int\\frac{dx}{x^p}$；Q积分=对数型 $\\int\\frac{dx}{x(\\ln x)^q}$，换元 $u=\\ln x$ 就化成 P积分，方向规律相同（无穷端 $q>1$ 收敛、瑕点端 $\\ln x\\to0$ 处 $q<1$ 收敛）——详见“反常积分判敛”条与背诵清单第六节。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_improper',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'integral',
    sectionName: '反常积分收敛性',
    title: '【1000题基础8-21】反常积分判敛：瑕点在上下界时 p 级数方向相反（二刷仍错）',
    content: '薄弱点记录（二刷双圈）：\n- 基础8-21：拆成两个区间后，第二个 [1/2, 1] 区间不会处理 tan 函数，没做出来。\n- 关键漏洞：没注意“瑕点在积分上界和下界时，P级数判敛公式是相反的”。',
    mistakeType: '概念不清',
    importance: 5,
    correction: '【两个 p 积分模型（方向相反！）】\n- 瑕点在有限端（如 $\\int_0^1 \\frac{dx}{x^p}$，x→0 爆炸）：收敛 ⟺ $p < 1$\n- 无穷限（如 $\\int_1^{+\\infty} \\frac{dx}{x^p}$）：收敛 ⟺ $p > 1$\n- 临界 p = 1 两边都发散\n口诀：洞口要小（p<1），长路要降得快（p>1）；代哪个端点，就让那个端点不出事。\n【tan 的处理】$\\tan x = \\frac{\\sin x}{\\cos x}$，在 x→π/2 处 cos→0 是瑕点；某段若无瑕点就正常积，若有瑕点按 p<1 判。多个瑕点先拆段、每段单独判、全部收敛才收敛。（与背诵清单第六节互为印证）',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_trig_integral',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'trig_integral',
    sectionName: '三角函数积分',
    title: '【1000题基础8-23】六个基本三角积分公式 + 漏写常数C（二刷仍错）',
    content: '薄弱点记录（二刷双圈）：\n- 基础8-23：这题是排除法做对的，老师在题目旁给的相关知识还不熟。\n- 额外记：积分公式只会 sin 和 cos 的，遇到其他三角函数都转成 sin/cos 做，tan、cot、sec、csc 这四个还没记住。\n- 额外记：求不定积分总是漏写常数 C。',
    mistakeType: '公式不清',
    importance: 5,
    correction: '【六个基本三角积分（必背）】\n1. $\\int \\tan x\\,dx = −\\ln|\\cos x| + C$\n2. $\\int \\cot x\\,dx = \\ln|\\sin x| + C$\n3. $\\int \\sec x\\,dx = \\ln|\\sec x + \\tan x| + C$\n4. $\\int \\csc x\\,dx = \\ln|\\csc x − \\cot x| + C$\n5. $\\int \\sec²x\\,dx = \\tan x + C$\n6. $\\int \\csc²x\\,dx = −\\cot x + C$\n补充：$\\int \\sec x\\tan x\\,dx = \\sec x + C$；$\\int \\csc x\\cot x\\,dx = −\\csc x + C$\n记忆钩：切／余切积出 ln；正割配正切、余割配余切（同号加、异号减）；平方积回本身（sec²→tan）。\n【铁律】不定积分结果永远 +C，漏 C 直接扣分，做完扫一眼有没有 C。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_integration_tech',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'integration_techniques',
    sectionName: '不定积分技巧与定积分计算',
    title: '【1000题基础9系列】不定积分技巧群 + 公式积分性价比判断（二刷仍错）',
    content: '薄弱点记录（二刷双圈）：\n- 9-3：忘了根式代换，后续裂项的待定系数法也不熟。\n- 9-6：不知道还有“凑分母微分”这种方法。\n- 9-15（两个启示）：①可用特殊值法快速做（如设 f(x)=1）；②区间上下都是参数时，可拆成两个区间（一个上界为 x、一个下界为 x）。\n- 9-20：没想到三角换元，也没想到后续能用递推式做。\n- 9-24：陷阱题，没注意有无定义点，函数不连续不能直接用牛顿-莱布尼茨公式。\n- 9-1-3/4/5/6/11/12 及 9-1-13到24、9-25、9-36：一批公式记忆型/技巧型积分，公式记不住、做不出。你的判断：技巧性太强、真题几乎不考、性价比低。',
    mistakeType: '方法不熟',
    importance: 4,
    correction: '【必会技巧（真题高频，务必掌握）】\n- 根式代换（9-3）：含 $\\sqrt{a²−x²}$ 令 $x=a\\sin t$；$\\sqrt{a²+x²}$ 令 $x=a\\tan t$；$\\sqrt{x²−a²}$ 令 $x=a\\sec t$。裂项用待定系数 $\\frac{1}{(x−a)(x−b)} = \\frac{A}{x−a}+\\frac{B}{x−b}$。\n- 凑微分（9-6）：$\\int f(g(x))g′(x)dx = \\int f(u)du$，把分母的微分凑到分子。\n- 三角换元+递推（9-20）：见根式代换；递推 $I_n$ 与 $I_{n−2}$ 建关系（华里士/点火公式）。\n- 牛-莱陷阱（9-24）：用 $\\int_a^b f = F(b)−F(a)$ 前必须确认 f 在 [a,b] 连续；有无穷间断点要当反常积分处理。\n- 特殊值法+区间拆分（9-15）：抽象函数定积分可设 f=1 验证选项；上下限都含参数时拆成两段分别处理。\n【性价比判断（9-1-13到24、9-25、9-36 等公式积分）】\n你的判断是对的：这批是表格式/技巧型积分，数一真题近十年几乎不直接考，1000题堆量只为练手感。策略：认得出类型 + 知道查哪条公式即可，不必逐条死背；把时间留给真题高频的根式代换、凑微分、分部、有理函数积分。考场真遇到，用万能代换 $t=\\tan\\frac{x}{2}$ 兜底。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  // ==================== 2011 数一真题错题（本次录入） ====================
  {
    id: 'math_11_1',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'inflection',
    sectionName: '拐点与凹凸性',
    title: '【2011数一真题1】高次乘积曲线的拐点判断',
    content: '曲线 $y=(x-1)(x-2)^2(x-3)^3(x-4)^4$ 的拐点是（）。\nA. $(1,0)$\nB. $(2,0)$\nC. $(3,0)$\nD. $(4,0)$',
    mistakeType: '思路错误',
    importance: 4,
    correction: '正确答案：C\n解析：拐点要求 $y\'\'$ 存在且在其两侧变号。对乘积型函数用对数求导：$\\dfrac{y\'}{y}=\\dfrac{1}{x-1}+\\dfrac{2}{x-2}+\\dfrac{3}{x-3}+\\dfrac{4}{x-4}$，再考察 $y\'\'$ 在 $x=1,2,3,4$ 附近的符号（穿针引线法：偶重根两侧不变号、奇重根两侧变号）。逐一判断后只有 $x=3$ 处 $y\'\'$ 变号，故拐点为 $(3,0)$。\n错因（我的记录）：难题，没学过穿针引线法是真做不出来。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_11_2',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'power_series',
    sectionName: '幂级数收敛域',
    title: '【2011数一真题2】由数列性质定幂级数收敛域',
    content: '设数列 $\\{a_n\\}$ 单调减少，$\\lim\\limits_{n\\to\\infty}a_n=0$，$S_n=\\sum\\limits_{k=1}^{n}a_k\\ (n=1,2,\\cdots)$ 无界，则幂级数 $\\sum\\limits_{n=1}^{\\infty}a_n(x-1)^n$ 的收敛域为（）。\nA. $(-1,1]$\nB. $[-1,1)$\nC. $[0,2)$\nD. $(0,2]$',
    mistakeType: '概念不清',
    importance: 4,
    correction: '正确答案：C\n解析：令 $t=x-1$。由 $a_n\\to0$ 且单调，Abel 判别法知 $\\sum a_n t^n$ 在 $|t|<1$ 收敛，收敛半径 $R=1$（因 $S_n$ 无界即 $\\sum a_n$ 发散）。端点：$t=1$（$x=2$）时 $\\sum a_n$ 发散（$a_n\\ge0$ 部分和无界）；$t=-1$（$x=0$）时 $\\sum a_n(-1)^n$ 由 Leibniz 判别法收敛。故 $t\\in[-1,1)$，即 $x-1\\in[-1,1)\\Rightarrow x\\in[0,2)$。\n错因（我的记录）：没看懂出题人意图，懵了。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_11_9',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'arc_length',
    sectionName: '曲线弧长',
    title: '【2011数一真题9】变限积分曲线弧长',
    content: '曲线 $y=\\displaystyle\\int_0^x \\tan t\\,dt\\ (0\\le x\\le \\frac{\\pi}{4})$ 的弧长 $s=$ ______。',
    mistakeType: '公式不清',
    importance: 4,
    correction: '正确答案：$\\ln(1+\\sqrt2)$\n解析：$y\'=\\tan x$，$s=\\int_0^{\\pi/4}\\sqrt{1+\\tan^2 x}\\,dx=\\int_0^{\\pi/4}\\sec x\\,dx=\\ln|\\sec x+\\tan x|\\Big|_0^{\\pi/4}=\\ln(\\sqrt2+1)-\\ln1=\\ln(1+\\sqrt2)$。\n关键冷门积分：$\\int\\sec x\\,dx=\\ln|\\sec x+\\tan x|+C$；$\\int\\csc x\\,dx=\\ln|\\csc x-\\cot x|+C$；$\\int\\tan x\\,dx=-\\ln|\\cos x|+C$。\n错因（我的记录）：记不得 sec、csc、cot 这三个冷门的积分公式了。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_11_12',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'stokes',
    sectionName: '曲线积分·Stokes',
    title: '【2011数一真题12】空间闭曲线第二类曲线积分',
    content: '设 $L$ 是柱面 $x^2+y^2=1$ 与平面 $z=x+y$ 的交线，从 $z$ 轴正向往 $z$ 轴负向看去为逆时针方向，则曲线积分 $\\displaystyle\\oint_L xz\\,dx+x\\,dy+\\frac{y^2}{2}\\,dz=$ ______。',
    mistakeType: '思路错误',
    importance: 5,
    correction: '正确答案：$\\pi$\n解析：用 Stokes 公式。$P=xz,Q=x,R=\\frac{y^2}{2}$，旋度 $\\text{rot}=(R_y-Q_z,\\ P_z-R_x,\\ Q_x-P_y)=(y,\\ z,\\ 1)$。取 $L$ 围成的平面片 $z=x+y$（$x^2+y^2\\le1$），上侧法向 $(-z_x,-z_y,1)=(-1,-1,1)$。被积 $(y,z,1)\\cdot(-1,-1,1)=-y-z+1=-y-(x+y)+1=-x-2y+1$。在圆盘上积分，$x,2y$ 为奇函数积分为 0，剩 $\\iint 1\\,dxdy=\\pi$。\n错因（我的记录）：依旧不熟练，遇到此类问题不知道运用什么方法最简便。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_11_18',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'series_proof',
    sectionName: '数列极限·证明',
    title: '【2011数一真题18】对数不等式与数列收敛性证明（10分）',
    content: '（I）证明：对任意正整数 $n$，都有 $\\dfrac{1}{n+1}<\\ln\\!\\left(1+\\dfrac{1}{n}\\right)<\\dfrac{1}{n}$ 成立。\n（II）设 $a_n=1+\\dfrac{1}{2}+\\cdots+\\dfrac{1}{n}-\\ln n\\ (n=1,2,\\cdots)$，证明数列 $\\{a_n\\}$ 收敛。',
    mistakeType: '思路错误',
    importance: 5,
    correction: '解析：\n（I）$\\ln(1+\\frac1n)=\\ln\\frac{n+1}{n}=\\int_n^{n+1}\\frac{dx}{x}$。在 $x\\in(n,n+1)$ 上 $\\frac{1}{n+1}<\\frac1x<\\frac1n$，对区间长 1 积分即得 $\\frac{1}{n+1}<\\ln(1+\\frac1n)<\\frac1n$。\n（II）单调性：$a_n-a_{n+1}=\\ln(1+\\frac1n)-\\frac{1}{n+1}>0$（由(I)左半），故 $\\{a_n\\}$ 单调减少。有下界：$a_n>1+\\frac12+\\cdots+\\frac1n-\\ln(n+1)>0$（用 $\\ln(n+1)=\\int_1^{n+1}\\frac{dx}{x}<\\sum\\frac1k$）。单调减少且有下界 $\\Rightarrow$ 收敛（极限即欧拉常数 $\\gamma$）。\n错因（我的记录）：证明题依旧没头绪。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_11_19',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'double_integral',
    sectionName: '二重积分·分部',
    title: '【2011数一真题19】含二阶混合偏导的二重积分（11分）',
    content: '已知函数 $f(x,y)$ 具有二阶连续偏导数，且 $f(1,y)=0$，$f(x,1)=0$，$\\displaystyle\\iint_D f(x,y)\\,dxdy=a$，其中 $D=\\{(x,y)\\mid 0\\le x\\le1,\\ 0\\le y\\le1\\}$，计算二重积分 $I=\\displaystyle\\iint_D xy\\,f\'\'_{xy}(x,y)\\,dxdy$。',
    mistakeType: '思路错误',
    importance: 5,
    correction: '正确答案：$I=a$\n解析：两次分部积分。先对 $y$（$f\'\'_{xy}=\\partial_y f_x$）：$\\int_0^1 y\\,\\partial_y f_x\\,dy=[y f_x]_0^1-\\int_0^1 f_x\\,dy=f_x(x,1)-\\int_0^1 f_x\\,dy$。由 $f(x,1)\\equiv0\\Rightarrow f_x(x,1)=0$。再对 $x$：$I=-\\int_0^1\\!\\!\\int_0^1 x f_x\\,dy\\,dx=-\\int_0^1\\!\\big([xf]_0^1-\\int_0^1 f\\,dx\\big)dy$，由 $f(1,y)=0$ 得 $\\int_0^1 x f_x\\,dx=-\\int_0^1 f\\,dx$。代回 $I=\\iint_D f\\,dxdy=a$。\n错因（我的记录）：好题，很新颖的做法。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_11_21',
    chapterId: 'ch_xiandai',
    chapterName: '线性代数',
    sectionId: 'eigen',
    sectionName: '特征值与特征向量',
    title: '【2011数一真题21】实对称矩阵求特征值与矩阵A（11分）',
    content: '设 $A$ 为 3 阶实对称矩阵，$A$ 的秩为 2，且\n$A\\begin{pmatrix}1&1\\\\0&0\\\\-1&1\\end{pmatrix}=\\begin{pmatrix}-1&1\\\\0&0\\\\1&1\\end{pmatrix}$。\n（I）求 $A$ 的所有特征值与特征向量；（II）求矩阵 $A$。',
    mistakeType: '概念不清',
    importance: 5,
    correction: '解析：\n按列读条件：$A(1,0,-1)^T=(-1,0,1)^T=-1\\cdot(1,0,-1)^T$，故 $\\lambda_1=-1$，特征向量 $k_1(1,0,-1)^T$；$A(1,0,1)^T=(1,0,1)^T$，故 $\\lambda_2=1$，特征向量 $k_2(1,0,1)^T$。实对称不同特征值特征向量正交（已验证），第三个特征向量与二者都正交 $\\Rightarrow(0,1,0)^T$；秩为 2 $\\Rightarrow$ 第三特征值 $\\lambda_3=0$，特征向量 $k_3(0,1,0)^T$。\n（II）单位化后 $A=1\\cdot u_2u_2^T+(-1)\\cdot u_1u_1^T$，其中 $u_1=\\frac1{\\sqrt2}(1,0,-1)^T,u_2=\\frac1{\\sqrt2}(1,0,1)^T$。算得 $A=\\begin{pmatrix}0&0&1\\\\0&0&0\\\\1&0&0\\end{pmatrix}$。\n错因（我的记录）：这类题做的比较少，开局思路不对，很难往向量那方面想，我对相关的概念还很模糊。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_11_22',
    chapterId: 'ch_gailv',
    chapterName: '概率论',
    sectionId: 'joint_dist',
    sectionName: '二维随机变量分布',
    title: '【2011数一真题22】由边缘分布与条件求联合分布及相关系数（11分）',
    content: '设随机变量 $X$ 与 $Y$ 的概率分布分别为 $X:\\ P(0)=\\frac13,\\ P(1)=\\frac23$；$Y:\\ P(-1)=\\frac13,\\ P(0)=\\frac13,\\ P(1)=\\frac13$，且 $P\\{X^2=Y^2\\}=1$。\n（I）求二维随机变量 $(X,Y)$ 的概率分布；（II）求 $Z=XY$ 的概率分布；（III）求 $X$ 与 $Y$ 的相关系数 $\\rho_{XY}$。',
    mistakeType: '概念不清',
    importance: 5,
    correction: '解析：$X^2=Y^2$ 几乎必然 $\\Rightarrow$ 只允许 $(X=0,Y=0)$ 与 $(X=1,Y=\\pm1)$。\n（I）联合分布：$p(0,0)=\\frac13$；$p(1,-1)=\\frac13,\\ p(1,1)=\\frac13$；其余为 0。\n（II）$Z=XY$：$P(Z=-1)=\\frac13,\\ P(Z=0)=\\frac13,\\ P(Z=1)=\\frac13$。\n（III）$E X=\\frac23,\\ E Y=0,\\ E(XY)=(-1)\\frac13+0+1\\cdot\\frac13=0$，$\\mathrm{Cov}=E(XY)-EX\\cdot EY=0$，故 $\\rho_{XY}=0$。注意：$X,Y$ 不独立但相关系数为 0（不相关 $\\ne$ 独立）。\n错因（我的记录）：我直接下意识默认 XY 独立了，结果错了。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_11_23',
    chapterId: 'ch_gailv',
    chapterName: '概率论',
    sectionId: 'mle',
    sectionName: '参数估计·最大似然',
    title: '【2011数一真题23】正态总体方差的最大似然估计及其矩（11分）',
    content: '设 $X_1,X_2,\\cdots,X_n$ 为来自正态总体 $N(\\mu_0,\\sigma^2)$ 的简单随机样本，其中 $\\mu_0$ 已知，$\\sigma^2>0$ 未知，$\\bar X$ 和 $S^2$ 分别表示样本均值和样本方差。\n（I）求参数 $\\sigma^2$ 的最大似然估计 $\\hat\\sigma^2$；（II）计算 $E(\\hat\\sigma^2)$ 和 $D(\\hat\\sigma^2)$。',
    mistakeType: '公式不清',
    importance: 4,
    correction: '解析：\n（I）似然取对数求导：$\\hat\\sigma^2=\\dfrac1n\\sum\\limits_{i=1}^n(X_i-\\mu_0)^2$（$\\mu_0$ 已知，用 $\\mu_0$ 而非 $\\bar X$）。\n（II）$\\frac{(X_i-\\mu_0)^2}{\\sigma^2}\\sim\\chi^2(1)$，$\\sum/\\sigma^2\\sim\\chi^2(n)$，$E=n,\\ D=2n$。故 $E(\\hat\\sigma^2)=\\sigma^2$（无偏），$D(\\hat\\sigma^2)=\\frac{\\sigma^4}{n^2}\\cdot2n=\\frac{2\\sigma^4}{n}$。\n错因（我的记录）：公式有遗忘，明天得再练一些相关题目。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },

  // ==================== 2012 数一真题错题（本次录入） ====================
  {
    id: 'math_12_7',
    chapterId: 'ch_gailv',
    chapterName: '概率论',
    sectionId: 'exp_dist',
    sectionName: '指数分布·概率计算',
    title: '【2012数一真题7】两独立指数分布比大小概率',
    content: '设随机变量 $X$ 与 $Y$ 相互独立，且分别服从参数为 1 与参数为 4 的指数分布，则 $P\\{X<Y\\}=$（）。\nA. $\\frac15$\nB. $\\frac13$\nC. $\\frac23$\nD. $\\frac45$',
    mistakeType: '思路错误',
    importance: 4,
    correction: '正确答案：A\n解析：$X\\sim E(1),Y\\sim E(4)$ 独立，$P\\{X<Y\\}=\\int_0^\\infty f_X(x)P\\{Y>x\\}dx=\\int_0^\\infty e^{-x}\\cdot e^{-4x}dx=\\int_0^\\infty e^{-5x}dx=\\frac15$。结论式：$P\\{X<Y\\}=\\frac{\\lambda_X}{\\lambda_X+\\lambda_Y}=\\frac{1}{1+4}=\\frac15$。\n错因（我的记录）：想当然了，直接求两个概率密度函数的交点去求二次积分了，结果没有答案。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_12_3',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'differentiability',
    sectionName: '多元函数可微性',
    title: '【2012数一真题3】连续条件下可微性的判定',
    content: '如果函数 $f(x,y)$ 在点 $(0,0)$ 处连续，那么下列命题正确的是（）。\nA. 若极限 $\\lim\\limits_{\\substack{x\\to0\\\\y\\to0}}\\dfrac{f(x,y)}{|x|+|y|}$ 存在，则 $f$ 在 $(0,0)$ 处可微\nB. 若极限 $\\lim\\limits_{\\substack{x\\to0\\\\y\\to0}}\\dfrac{f(x,y)}{x^2+y^2}$ 存在，则 $f$ 在 $(0,0)$ 处可微\nC. 若 $f$ 在 $(0,0)$ 处可微，则极限 $\\lim\\limits_{\\substack{x\\to0\\\\y\\to0}}\\dfrac{f(x,y)}{|x|+|y|}$ 存在\nD. 若 $f$ 在 $(0,0)$ 处可微，则极限 $\\lim\\limits_{\\substack{x\\to0\\\\y\\to0}}\\dfrac{f(x,y)}{x^2+y^2}$ 存在',
    mistakeType: '概念不清',
    importance: 4,
    correction: '正确答案：B\n解析：连续性 $\\Rightarrow f(0,0)=\\lim f$。B：若 $\\frac{f(x,y)}{x^2+y^2}\\to L$，则 $f(x,y)=L(x^2+y^2)+o(x^2+y^2)$，取 $(x,0),(0,y)$ 知 $f_x(0,0)=f_y(0,0)=0$，而 $f-f(0,0)-0=o(\\rho)$（因 $x^2+y^2=\\rho^2=o(\\rho)$），故可微且全微分为 0。A 分母 $|x|+|y|\\sim\\rho$ 不够高阶，推不出可微；C、D 反例 $f=x$ 可微但相应极限不存在。\n错因（我的记录）：有点猜的成分，虽然对了，但是原理说不清楚。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_12_6',
    chapterId: 'ch_xiandai',
    chapterName: '线性代数',
    sectionId: 'similar',
    sectionName: '相似对角化·基变换',
    title: '【2012数一真题6】换基后求 Q⁻¹AQ',
    content: '设 $A$ 为 3 阶矩阵，$P$ 为 3 阶可逆矩阵，且 $P^{-1}AP=\\begin{pmatrix}1&0&0\\\\0&1&0\\\\0&0&2\\end{pmatrix}$。若 $P=(\\alpha_1,\\alpha_2,\\alpha_3)$，$Q=(\\alpha_1+\\alpha_2,\\alpha_2,\\alpha_3)$，则 $Q^{-1}AQ=$（）。\nA. $\\begin{pmatrix}1&0&0\\\\0&2&0\\\\0&0&1\\end{pmatrix}$\nB. $\\begin{pmatrix}1&0&0\\\\0&1&0\\\\0&0&2\\end{pmatrix}$\nC. $\\begin{pmatrix}2&0&0\\\\0&1&0\\\\0&0&2\\end{pmatrix}$\nD. $\\begin{pmatrix}2&0&0\\\\0&2&0\\\\0&0&1\\end{pmatrix}$',
    mistakeType: '概念不清',
    importance: 4,
    correction: '正确答案：B\n解析：$Q=PM$，$M=\\begin{pmatrix}1&0&0\\\\1&1&0\\\\0&0&1\\end{pmatrix}$，$M^{-1}=\\begin{pmatrix}1&0&0\\\\-1&1&0\\\\0&0&1\\end{pmatrix}$。则 $Q^{-1}AQ=M^{-1}(P^{-1}AP)M=M^{-1}\\mathrm{diag}(1,1,2)M=\\mathrm{diag}(1,1,2)$（因 $\\alpha_1,\\alpha_2$ 同属特征值 1 的特征子空间，其线性组合仍是特征值 1 的特征向量）。\n错因（我的记录）：我直接当第一列和第二列的特征值相加了，应该没这种公式，是我想当然了。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_12_10',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'definite_integral',
    sectionName: '定积分·对称性',
    title: '【2012数一真题10】利用对称性算定积分',
    content: '$\\displaystyle\\int_0^2 x\\sqrt{2x-x^2}\\,dx=$ ______。',
    mistakeType: '计算错误',
    importance: 4,
    correction: '正确答案：$\\frac{\\pi}{2}$\n解析：$2x-x^2=1-(x-1)^2$，令 $u=x-1$：原式 $=\\int_{-1}^{1}(u+1)\\sqrt{1-u^2}\\,du=\\underbrace{\\int_{-1}^1 u\\sqrt{1-u^2}\\,du}_{奇函数=0}+\\int_{-1}^1\\sqrt{1-u^2}\\,du=0+\\frac{\\pi}{2}$（上半单位圆面积）。\n错因（我的记录）：没有考虑对称性简化计算，结果算错了。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_12_15',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'inequality_proof',
    sectionName: '不等式证明',
    title: '【2012数一真题15】对数-三角不等式证明（10分）',
    content: '证明 $x\\ln\\dfrac{1+x}{1-x}+\\cos x\\ge 1+\\dfrac{x^2}{2}\\ (-1<x<1)$。',
    mistakeType: '思路错误',
    importance: 5,
    correction: '解析：构造 $g(x)=x\\ln\\frac{1+x}{1-x}+\\cos x-1-\\frac{x^2}{2}$。$g$ 为偶函数，$g(0)=0$。\n$g\'(x)=\\ln\\frac{1+x}{1-x}+\\frac{2x}{1-x^2}-\\sin x-x$，$g\'(0)=0$。\n$g\'\'(x)=\\frac{2}{1-x^2}+\\frac{2(1+x^2)}{(1-x^2)^2}-\\cos x-1$。当 $|x|<1$ 时 $\\frac{2}{1-x^2}\\ge2$、$\\frac{2(1+x^2)}{(1-x^2)^2}\\ge2$，而 $\\cos x+1\\le2$，可证 $g\'\'(x)\\ge0$。故 $g\'$ 单调增，$x>0$ 时 $g\'(x)>g\'(0)=0$，$g$ 单调增，$g(x)\\ge g(0)=0$；再由偶性对 $x<0$ 同样成立。原不等式得证。\n错因（我的记录）：难题，单调性的总思路想到了，但是里面的巧妙处理是真没想到。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_12_17',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'power_series_sum',
    sectionName: '幂级数收敛域与和函数',
    title: '【2012数一真题17】幂级数收敛域及和函数（10分）',
    content: '求幂级数 $\\displaystyle\\sum_{n=0}^{\\infty}\\dfrac{4n^2+4n+3}{2n+1}x^{2n}$ 的收敛域及和函数。',
    mistakeType: '思路错误',
    importance: 5,
    correction: '解析：拆系数 $\\frac{4n^2+4n+3}{2n+1}=\\frac{(2n+1)^2+2}{2n+1}=(2n+1)+\\frac{2}{2n+1}$。\n收敛半径：$|x|<1$；端点 $x=\\pm1$ 通项 $\\to\\infty$ 发散，故收敛域 $(-1,1)$。\n和函数 $S(x)=\\sum(2n+1)x^{2n}+2\\sum\\frac{x^{2n}}{2n+1}$。\n$\\sum(2n+1)x^{2n}=\\big(\\sum x^{2n+1}\\big)\'=\\big(\\frac{x}{1-x^2}\\big)\'=\\frac{1+x^2}{(1-x^2)^2}$；\n$2\\sum\\frac{x^{2n}}{2n+1}=\\frac1x\\ln\\frac{1+x}{1-x}\\ (x\\ne0)$。\n故 $S(x)=\\dfrac{1+x^2}{(1-x^2)^2}+\\dfrac1x\\ln\\dfrac{1+x}{1-x}\\ (0<|x|<1)$，$S(0)=3$。\n错因（我的记录）：还是做少了，忘了此类题的固定步骤和思路，做不出来。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_12_18',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'parametric',
    sectionName: '参数方程与切线应用',
    title: '【2012数一真题18】由切线距离条件求 f(t) 及面积（10分）',
    content: '已知曲线 $L:\\begin{cases}x=f(t)\\\\y=\\cos t\\end{cases}\\ (0\\le t<\\frac{\\pi}{2})$，其中 $f(t)$ 具有连续导数，且 $f(0)=0$，$f\'(t)>0\\ (0<t<\\frac{\\pi}{2})$。若曲线 $L$ 的切线与 $x$ 轴的交点到切点的距离恒为 1，求 $f(t)$ 的表达式，并求以曲线 $L$ 及 $x$ 轴和 $y$ 轴为边界的区域的面积。',
    mistakeType: '计算错误',
    importance: 5,
    correction: '解析：切线斜率 $\\frac{dy}{dx}=\\frac{-\\sin t}{f\'(t)}$。切线交 $x$ 轴于 $X=f(t)+\\frac{\\cos t\\,f\'(t)}{\\sin t}$，切点到该交点距离 $=\\frac{\\cos t\\sqrt{f\'^2+\\sin^2 t}}{\\sin t}=1$。\n解得 $f\'^2=\\frac{\\sin^4 t}{\\cos^2 t}\\Rightarrow f\'=\\frac{\\sin^2 t}{\\cos t}=\\sec t-\\cos t$（取正）。\n积分 $f(t)=\\ln(\\sec t+\\tan t)-\\sin t+C$，$f(0)=0\\Rightarrow C=0$，即 $f(t)=\\ln\\dfrac{1+\\sin t}{\\cos t}-\\sin t$。\n面积 $=\\int_0^{+\\infty}y\\,dx=\\int_0^{\\pi/2}\\cos t\\cdot f\'(t)\\,dt=\\int_0^{\\pi/2}\\sin^2 t\\,dt=\\dfrac{\\pi}{4}$。\n错因（我的记录）：第一小问对复杂三角函数的计算有误，第二小问没思路，解法确实秒，如果是我在考场上是肯定做不出来的。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_12_22',
    chapterId: 'ch_gailv',
    chapterName: '概率论',
    sectionId: 'covariance',
    sectionName: '二维离散·协方差',
    title: '【2012数一真题22】二维离散分布求概率与协方差（11分）',
    content: '设二维离散型随机变量 $(X,Y)$ 的概率分布为\n$\\begin{array}{c|ccc}&Y=0&1&2\\\\ \\hline X=0&\\frac14&0&\\frac14\\\\ 1&0&\\frac13&0\\\\ 2&\\frac1{12}&0&\\frac1{12}\\end{array}$\n（I）求 $P\\{X=2Y\\}$；（II）求 $\\mathrm{Cov}(X-Y,\\,Y)$。',
    mistakeType: '计算错误',
    importance: 4,
    correction: '解析：\n（I）$P\\{X=2Y\\}=p(0,0)+p(2,1)+p(4,2)=\\frac14+0+0=\\frac14$。\n（II）$EX=0\\cdot\\frac12+1\\cdot\\frac13+2\\cdot\\frac16=\\frac23$；$EY=0\\cdot\\frac13+1\\cdot\\frac13+2\\cdot\\frac13=1$；$E(XY)=1\\cdot1\\cdot\\frac13+2\\cdot2\\cdot\\frac1{12}=\\frac13+\\frac13=\\frac23$。$\\mathrm{Cov}(X,Y)=E(XY)-EX\\cdot EY=\\frac23-\\frac23=0$。$EY^2=0+\\frac13+4\\cdot\\frac13=\\frac53$，$D(Y)=\\frac53-1=\\frac23$。\n$\\mathrm{Cov}(X-Y,Y)=\\mathrm{Cov}(X,Y)-D(Y)=0-\\frac23=-\\frac23$。\n错因（我的记录）：协方差没有用公式化解，硬算了，结果算错了。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_12_23',
    chapterId: 'ch_gailv',
    chapterName: '概率论',
    sectionId: 'mle',
    sectionName: '正态总体·无偏估计',
    title: '【2012数一真题23】Z=X-Y 的密度、最大似然与无偏性（11分）',
    content: '设随机变量 $X$ 与 $Y$ 相互独立且分别服从正态分布 $N(\\mu,\\sigma^2)$ 与 $N(\\mu,2\\sigma^2)$，其中 $\\sigma$ 是未知参数且 $\\sigma>0$。记 $Z=X-Y$。\n（I）求 $Z$ 的概率密度 $f(z;\\sigma^2)$；（II）设 $Z_1,Z_2,\\cdots,Z_n$ 为来自总体 $Z$ 的简单随机样本，求 $\\sigma^2$ 的最大似然估计量 $\\hat\\sigma^2$；（III）证明 $\\hat\\sigma^2$ 为 $\\sigma^2$ 的无偏估计量。',
    mistakeType: '公式不清',
    importance: 5,
    correction: '解析：\n（I）$Z=X-Y\\sim N(\\mu-\\mu,\\ \\sigma^2+2\\sigma^2)=N(0,3\\sigma^2)$，$f(z;\\sigma^2)=\\dfrac{1}{\\sqrt{6\\pi}\\,\\sigma}\\exp\\!\\left(-\\dfrac{z^2}{6\\sigma^2}\\right)$。\n（II）对数似然求导：$\\hat\\sigma^2=\\dfrac{1}{3n}\\sum\\limits_{i=1}^n Z_i^2$。\n（III）$E(Z_i^2)=D(Z_i)=3\\sigma^2$，故 $E(\\hat\\sigma^2)=\\frac{1}{3n}\\cdot n\\cdot3\\sigma^2=\\sigma^2$，即 $\\hat\\sigma^2$ 无偏。\n错因（我的记录）：第一问结论不了解，正态分布的概率密度函数忘了，后面两题的套路也不清晰。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  }
])

const activeTab = ref('gaoshu')

const gaoshuProblems = computed(() => problems.value.filter(p => p.chapterId === 'ch_gaoshu'))
const xiandaiProblems = computed(() => problems.value.filter(p => p.chapterId === 'ch_xiandai'))
const gailvProblems = computed(() => problems.value.filter(p => p.chapterId === 'ch_gailv'))

function toggleMastered(problem: WrongProblem) {
  problem.mastered = !problem.mastered
  ElMessage.success(problem.mastered ? '已标记为掌握' : '已取消掌握')
}

function deleteProblem(problem: WrongProblem) {
  const idx = problems.value.findIndex(p => p.id === problem.id)
  if (idx !== -1) {
    problems.value.splice(idx, 1)
    ElMessage.success('已删除')
  }
}

function getMistakeTypeColor(type: string): string {
  const colors: Record<string, string> = {
    '概念不清': '#e74c3c',
    '公式不清': '#e67e22',
    '计算错误': '#3498db',
    '思路错误': '#9b59b6',
    '方法不熟': '#f39c12'
  }
  return colors[type] || '#909399'
}
</script>

<template>
  <div class="math-wrong-problems">
    <el-tabs v-model="activeTab" class="sub-tabs">
      <el-tab-pane label="高数" name="gaoshu">
        <div v-if="gaoshuProblems.length === 0" class="empty-state">
          <el-icon size="48" color="#909399"><DocumentChecked /></el-icon>
          <p>暂无高数错题</p>
        </div>
        <div v-else class="problem-list">
          <div v-for="p in gaoshuProblems" :key="p.id" class="problem-card">
            <div class="problem-header">
              <span class="problem-title">{{ p.title }}</span>
              <el-tag :color="getMistakeTypeColor(p.mistakeType)" size="small" effect="dark">
                {{ p.mistakeType }}
              </el-tag>
            </div>
            <div class="problem-content" v-html="renderMath(p.content)"></div>
            <div class="problem-correction" v-if="p.correction" v-html="renderMath(p.correction)"></div>
            <div class="problem-actions">
              <el-button size="small" :type="p.mastered ? 'success' : 'default'" @click="toggleMastered(p)">
                {{ p.mastered ? '已掌握' : '标记掌握' }}
              </el-button>
              <el-button size="small" type="danger" @click="deleteProblem(p)">删除</el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="线代" name="xiandai">
        <div v-if="xiandaiProblems.length === 0" class="empty-state">
          <el-icon size="48" color="#909399"><DocumentChecked /></el-icon>
          <p>暂无线代错题</p>
        </div>
        <div v-else class="problem-list">
          <div v-for="p in xiandaiProblems" :key="p.id" class="problem-card">
            <div class="problem-header">
              <span class="problem-title">{{ p.title }}</span>
              <el-tag :color="getMistakeTypeColor(p.mistakeType)" size="small" effect="dark">
                {{ p.mistakeType }}
              </el-tag>
            </div>
            <div class="problem-content" v-html="renderMath(p.content)"></div>
            <div class="problem-correction" v-if="p.correction" v-html="renderMath(p.correction)"></div>
            <div class="problem-actions">
              <el-button size="small" :type="p.mastered ? 'success' : 'default'" @click="toggleMastered(p)">
                {{ p.mastered ? '已掌握' : '标记掌握' }}
              </el-button>
              <el-button size="small" type="danger" @click="deleteProblem(p)">删除</el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="概率论" name="gailv">
        <div v-if="gailvProblems.length === 0" class="empty-state">
          <el-icon size="48" color="#909399"><DocumentChecked /></el-icon>
          <p>暂无概率论错题</p>
        </div>
        <div v-else class="problem-list">
          <div v-for="p in gailvProblems" :key="p.id" class="problem-card">
            <div class="problem-header">
              <span class="problem-title">{{ p.title }}</span>
              <el-tag :color="getMistakeTypeColor(p.mistakeType)" size="small" effect="dark">
                {{ p.mistakeType }}
              </el-tag>
            </div>
            <div class="problem-content" v-html="renderMath(p.content)"></div>
            <div class="problem-correction" v-if="p.correction" v-html="renderMath(p.correction)"></div>
            <div class="problem-actions">
              <el-button size="small" :type="p.mastered ? 'success' : 'default'" @click="toggleMastered(p)">
                {{ p.mastered ? '已掌握' : '标记掌握' }}
              </el-button>
              <el-button size="small" type="danger" @click="deleteProblem(p)">删除</el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.math-wrong-problems {
  padding: 20px 0;
}

.sub-tabs :deep(.el-tabs__header) {
  margin-bottom: 16px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #909399;
}

.empty-state p {
  margin: 12px 0 0;
  font-size: 1.05em;
}

.problem-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.problem-card {
  background: #1a2332;
  border: 1px solid #2a3a4a;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s;
}

.problem-card:hover {
  border-color: #d4a012;
  box-shadow: 0 2px 12px rgba(212, 160, 18, 0.1);
}

.problem-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 12px;
}

.problem-title {
  font-size: 1.05em;
  font-weight: 600;
  color: #e8eaed;
  flex: 1;
}

.problem-content {
  font-size: 0.95em;
  color: #b0b8c4;
  line-height: 1.6;
  margin-bottom: 12px;
  white-space: pre-wrap;
}

.problem-correction {
  font-size: 0.9em;
  color: #8ab4a0;
  line-height: 1.6;
  padding: 12px;
  background: rgba(138, 180, 160, 0.08);
  border-left: 3px solid #8ab4a0;
  border-radius: 4px;
  margin-bottom: 12px;
  white-space: pre-wrap;
}

.problem-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

/* KaTeX 公式适配（深色卡片） */
.problem-content :deep(.katex),
.problem-correction :deep(.katex) {
  font-size: 1.08em;
  color: #e8eaed;
}

.problem-correction :deep(.katex) {
  color: #a8d4be;
}

.problem-content :deep(.katex-display),
.problem-correction :deep(.katex-display) {
  margin: 0.5em 0;
  overflow-x: auto;
  overflow-y: hidden;
}
</style>

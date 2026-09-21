<script setup lang="ts">
import { useWrongProblemsStore } from '@/stores/wrongProblems'
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

const wp = useWrongProblemsStore(); const problems = wp.bind('math', [
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
    content: '题面：\n- 5-7：曲线 $y(x)=\\ln|e^{2x}-1|$ 的斜渐近线为（　）A. $y=2x+\\frac1e$　B. $y=2x$　C. $y=-2x+\\frac1e$　D. $y=-2x$\n- 5-10：已知曲线 $y=f(x)$ 在点 $(0,1)$ 处的曲率圆方程为 $(x-1)^2+y^2=2$，且 $x\\to0$ 时二阶可导函数 $f(x)$ 与 $a+bx+cx^2$ 之差为 $o(x^2)$，则（　）A. $a=0,b=1,c=\\frac32$　B. $a=1,b=0,c=1$　C. $a=1,b=1,c=-1$　D. $a=1,b=0,c=-1$\n薄弱点记录（二刷双圈）：\n- 基础5-7：斜率算对了，但求 b 时出现 ∞−∞ 型处理不了；解析里“从对数中提出 e 的 2x 次方”这个操作没想到。\n- 基础5-10：曲率圆知识遗忘得差不多，已不会做，不知道在考什么。\n- 额外：曲率公式和曲率圆公式都忘了。',
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
    content: '题面：\n- 1-4：设 $f(x)$ 在 $(-\\infty,+\\infty)$ 上满足 $f(x)=f(x-\\pi)+\\sin x$，且 $f(x)=x,\\ x\\in[0,\\pi)$，求 $f(x)$ 在 $[\\pi,3\\pi)$ 上的表达式。\n- 4-16：若 $\\begin{cases}x=\\ln|t|\\\\y=e^{-t^2}\\end{cases}$，则 $\\frac{d^2y}{dx^2}\\Big|_{t=\\sqrt2}=$______。\n- 5-3：设 $f(x)=\\begin{cases}\\cos|x|-1,&x\\le0\\\\x\\ln x,&x>0\\end{cases}$，则 $x=0$ 是 $f(x)$ 的（　）A.可导点,极值点　B.不可导点,极值点　C.可导点,非极值点　D.不可导点,非极值点\n- 5-4：已知 $x^2+ax^{-3}\\ge\\frac{10}3\\ (x>0)$ 恒成立，则 $a$ 的取值范围为______。\n- 5-9：曲线 $x^2-xy+y^2=1$ 在点 $(1,1)$ 处的曲率为______。\n- 5-11：设在 $(-\\infty,+\\infty)$ 内 $f″(x)<0$、$f(0)\\ge0$，则函数 $\\frac{f(x)}x$（　）A.在$(-\\infty,0)$减、$(0,+\\infty)$增　B.在两区间都减　C.在$(-\\infty,0)$增、$(0,+\\infty)$减　D.在两区间都增\n薄弱点记录（二刷双圈）：\n- 基础1-4：递推关系题总做错，想不懂新函数定义域和 x 怎么变，把结果算成 x−sinx 和 x，均少了 π。\n- 基础4-16：算错了，但这次没再用 dy/dx/dx 那种错误写法（有进步）。\n- 基础5-3：极值点定义不清，判可导时误当成“左极限=右极限”，应用导数定义，导致错。\n- 基础5-4：没分离变量 a 就直接算，算错。\n- 基础5-9：当隐函数求导做，一阶导忘了负号；又误以为二阶导就是在一阶导基础上再求一次导。其实直接 y 对 x 求导即可。\n- 基础5-11：求导一次后对 xf′(x) − f(x) 不知所措，没看懂 f(0) ≥ 0 的条件有何用。小技巧：求 x^(1/x) 型单调性可取对数（写成 e 的 ln）方便求导。',
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
    content: '题面：\n- 8-2：$\\lim\\limits_{n\\to\\infty}\\frac1{n^3}\\left[\\ln\\frac1n+4\\ln\\frac2n+\\cdots+(n-1)^2\\ln\\frac{n-1}n\\right]=$______。\n薄弱点记录（二刷双圈）：\n- 基础8-2：长时间没做，忘记这种“定积分定义”题怎么做了。\n- 额外记：复合函数奇偶性判断忘得差不多，如“内偶则偶，内奇看外——外奇则奇，外偶则偶”。\n- 额外记：P积分（幂函数型）和Q积分（对数型）忘得差不多，需要背诵。',
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
    content: '题面：\n- 8-21：设 $a,b$ 为常数，$\\int_0^1\\frac{\\ln x}{x^a(\\tan\\frac x2)^b}dx$ 收敛，则（　）A. $a+b>1$且$b>-2$　B. $a+b<1$且$b>-2$　C. $a+b>1$且$b<-2$　D. $a+b<1$且$b<-2$\n薄弱点记录（二刷双圈）：\n- 基础8-21：拆成两个区间后，第二个 [1/2, 1] 区间不会处理 tan 函数，没做出来。\n- 关键漏洞：没注意“瑕点在积分上界和下界时，P级数判敛公式是相反的”。',
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
    content: '题面：\n- 8-23：下列命题中不成立的是（　）A.若$f(x)$连续,$x\\in[a,b]$，则$\\int_a^x f(t)dt$必为$f(x)$的原函数　B.若$f(x)$可积,$x\\in[a,b]$，则$f(x)$在$(a,b)$内存在原函数　C.若$f(x)$连续且为奇函数,$x\\in[-a,a]$，则$\\int_{-a}^0 f(x)dx=0$　D.若$f(x)$连续,$T$为其周期，则$\\int_a^{a+T}f(x)dx=\\int_0^T f(x)dx$\n薄弱点记录（二刷双圈）：\n- 基础8-23：这题是排除法做对的，老师在题目旁给的相关知识还不熟。\n- 额外记：积分公式只会 sin 和 cos 的，遇到其他三角函数都转成 sin/cos 做，tan、cot、sec、csc 这四个还没记住。\n- 额外记：求不定积分总是漏写常数 C。',
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
    content: '题面：\n- 9-1-3：$\\int\\sec x\\,dx$；9-1-4：$\\int\\sec^3x\\,dx$\n- 9-1-5：$\\int\\frac{dx}{a^2-x^2}(a\\ne0)$；9-1-6：$\\int\\frac{dx}{x^2-a^2}(a\\ne0)$\n- 9-1-11：$\\int\\frac{dx}{\\sqrt{x^2\\pm a^2}}(a>0)$；9-1-12：$\\int\\frac{dx}{\\sqrt{a^2-x^2}}(a>0)$\n- 9-1-13~24（公式积分群）：$\\int\\frac{dx}{\\sqrt{x^2+a^2}}$、$\\int\\csc^3x\\,dx$、$\\int\\tan^2x\\,dx$、$\\int\\tan^3x\\,dx$、$\\int\\tan^4x\\,dx$、$\\int\\cot^3x\\,dx$、$\\int\\frac{\\cos x}{1+\\sin x}dx$、$\\int\\frac{dx}{a^2\\sin^2x+b^2\\cos^2x}$、$\\int\\frac{dx}{\\sin2x}$、$\\int\\frac{dx}{\\cos2x}$、$\\int\\frac{dx}{a+b\\cos x}$、$\\int\\frac{dx}{a+b\\sin x}$\n- 9-3：$\\int\\ln\\left(1+\\sqrt{\\frac{1+x}x}\\right)dx\\ (x>0)$\n- 9-6：$\\int_0^1\\frac{4x-3}{x^2-x+1}dx$\n- 9-15：设$f(x)$在$[-a,a]$上连续偶函数,$a>0$,$g(x)=\\int_{-a}^a|x-t|\\cdot f(t)dt$，则在$[-a,a]$上（　）A.$g$单调增　B.$g$单调减　C.$g$是偶函数　D.$g$是奇函数\n- 9-20：设$a_n=\\int_0^1x^n\\sqrt{1-x^2}dx\\ (n=0,1,2,\\cdots)$，则$\\lim\\limits_{n\\to\\infty}\\left(\\frac{a_n}{a_{n-2}}\\right)^n=$______。\n- 9-24：$\\int_{-1}^1\\left(\\frac1{1+2^{1/x}}\\right)′dx=$______。\n- 9-25：$\\int_{-1/2}^{1/2}\\frac{|x|(\\arcsin x+\\arccos x)}{\\sqrt{1-x^2}}dx=$______。\n- 9-36：设$f′(e^x)=\\sin x$，求$f(x)$的表达式。\n薄弱点记录（二刷双圈）：\n- 9-3：忘了根式代换，后续裂项的待定系数法也不熟。\n- 9-6：不知道还有“凑分母微分”这种方法。\n- 9-15（两个启示）：①可用特殊值法快速做（如设 f(x)=1）；②区间上下都是参数时，可拆成两个区间（一个上界为 x、一个下界为 x）。\n- 9-20：没想到三角换元，也没想到后续能用递推式做。\n- 9-24：陷阱题，没注意有无定义点，函数不连续不能直接用牛顿-莱布尼茨公式。\n- 9-1-3/4/5/6/11/12 及 9-1-13到24、9-25、9-36：一批公式记忆型/技巧型积分，公式记不住、做不出。你的判断：技巧性太强、真题几乎不考、性价比低。',
    mistakeType: '方法不熟',
    importance: 4,
    correction: '【必会技巧（真题高频，务必掌握）】\n- 根式代换（9-3）：含 $\\sqrt{a²−x²}$ 令 $x=a\\sin t$；$\\sqrt{a²+x²}$ 令 $x=a\\tan t$；$\\sqrt{x²−a²}$ 令 $x=a\\sec t$。裂项用待定系数 $\\frac{1}{(x−a)(x−b)} = \\frac{A}{x−a}+\\frac{B}{x−b}$。\n- 凑微分（9-6）：$\\int f(g(x))g′(x)dx = \\int f(u)du$，把分母的微分凑到分子。\n- 三角换元+递推（9-20）：见根式代换；递推 $I_n$ 与 $I_{n−2}$ 建关系（华里士/点火公式）。\n- 牛-莱陷阱（9-24）：用 $\\int_a^b f = F(b)−F(a)$ 前必须确认 f 在 [a,b] 连续；有无穷间断点要当反常积分处理。\n- 特殊值法+区间拆分（9-15）：抽象函数定积分可设 f=1 验证选项；上下限都含参数时拆成两段分别处理。\n【性价比判断（9-1-13到24、9-25、9-36 等公式积分）】\n你的判断是对的：这批是表格式/技巧型积分，数一真题近十年几乎不直接考，1000题堆量只为练手感。策略：认得出类型 + 知道查哪条公式即可，不必逐条死背；把时间留给真题高频的根式代换、凑微分、分部、有理函数积分。考场真遇到，用万能代换 $t=\\tan\\frac{x}{2}$ 兜底。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  // ==================== 1000题基础篇10~16讲二刷错题（薄弱点记录 · 09-07） ====================
  // ==================== 1000题10~16讲 逐题录入（题面+解析）· 09-07 ====================
  {
    id: 'math_1000_b10_7',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'double_integral',
    sectionName: '二重积分·交换次序',
    title: '【1000题基础10-7】套娃积分求平均值·交换积分次序',
    content: '已知函数 $f(x)=x\\int_1^x\\frac{e^{t^2}}{t}\\,dt$，则 $f(x)$ 在 $(0,1)$ 上的平均值为______。',
    mistakeType: '方法不熟',
    importance: 5,
    correction: '解析：平均值 $=\\int_0^1 f(x)dx=\\int_0^1 x\\int_1^x\\frac{e^{t^2}}{t}dt\\,dx$。化为二重积分并交换次序（区域 $0\\le x\\le t\\le1$）：$=-\\int_0^1\\frac{e^{t^2}}{t}\\int_0^t x\\,dx\\,dt=-\\frac12\\int_0^1 t e^{t^2}dt=-\\frac14(e-1)$，即平均值 $=\\frac{1-e}{4}$。\n错因（我的记录）：直接算二重积分算不出来，应该交换积分次序的，没想到去交换。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_b10_13',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'defint_geometry',
    sectionName: '旋转体体积',
    title: '【1000题基础10-13】无穷远旋转体体积·旋转体公式',
    content: '（数一13/数二13/数三10）曲线 $y=x^2e^{-x}\\ (0\\le x<+\\infty)$ 绕 x 轴旋转一周所得延伸到无穷远的旋转体的体积为______。',
    mistakeType: '公式不清',
    importance: 4,
    correction: '解析：$V=\\pi\\int_0^{+\\infty}y^2dx=\\pi\\int_0^{+\\infty}x^4e^{-2x}dx$。用 $\\int_0^\\infty x^ne^{-ax}dx=\\frac{n!}{a^{n+1}}$：$=\\pi\\cdot\\frac{4!}{2^5}=\\frac{3\\pi}{4}$。\n配套公式：绕x轴 $V=\\pi\\int y^2dx$；绕y轴柱壳 $V=2\\pi\\int xy\\,dx$；二重积分法 $V=2\\pi\\iint_D r(x,y)d\\sigma$。\n错因（我的记录）：右侧的旋转体公式忘掉了，记得的话还蛮好算的。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_b10_17',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'defint_geometry',
    sectionName: '旋转体侧面积',
    title: '【1000题基础10-17】弧绕y轴旋转侧面积·侧面积公式',
    content: '（数一/数二）曲线 $y=x^2$ 从点 $(1,1)$ 到点 $(2,4)$ 的一段弧绕 y 轴旋转一周所得旋转体的侧面积为______。',
    mistakeType: '公式不清',
    importance: 4,
    correction: '解析：绕 y 轴侧面积 $S=2\\pi\\int x\\,ds=2\\pi\\int_1^2 x\\sqrt{1+y′^2}dx=2\\pi\\int_1^2 x\\sqrt{1+4x^2}dx$。令 $u=1+4x^2$：$=\\frac{\\pi}{4}\\int_5^{17}\\sqrt u\\,du=\\frac{\\pi}{6}(17\\sqrt{17}-5\\sqrt5)$。\n错因（我的记录）：我也是不知道这也有公式，没算出来。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_b13_5',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'multivariable_diff',
    sectionName: '变限积分·分离变量',
    title: '【1000题基础13-5】变限积分二阶偏导和·先分离变量',
    content: '设 $F(x,y)=\\int_0^{x-y}(x-y-t)e^t\\,dt$，则 $\\frac{\\partial^2F}{\\partial x^2}+\\frac{\\partial^2F}{\\partial y^2}=$______。',
    mistakeType: '思路错误',
    importance: 4,
    correction: '解析：先分离变量——令 $u=x-y$，把被积的 $(x-y-t)$ 拆成 $u-t$：$F=u\\int_0^ue^tdt-\\int_0^ute^tdt=u(e^u-1)-(ue^u-e^u+1)=e^u-u-1$，即 $F=e^{x-y}-(x-y)-1$。故 $F_{xx}=e^{x-y}$、$F_{yy}=e^{x-y}$，和 $=2e^{x-y}$。\n错因（我的记录）：变限积分，不知道为啥，我直接把 t 代入 x−y 直接为 0 了，应该先把两个变量和 t 分离的。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_b13_7',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'multivariable_diff',
    sectionName: '混合偏导·隐含条件',
    title: '【1000题基础13-7】混合偏导反求函数·隐含f(0,0)=0',
    content: '设函数 $f(x,y)$ 具有二阶连续偏导数，且满足 $\\frac{\\partial^2[f(x,y)]}{\\partial x\\partial y}=1$，$f(0,y)=\\sin y$，$f(x,0)=\\sin x$，则 $f(\\frac{\\pi}{2},\\frac{\\pi}{2})=$______。',
    mistakeType: '思路错误',
    importance: 4,
    correction: '解析：$f_{xy}=1\\Rightarrow f=xy+G(x)+H(y)$。由 $f(0,y)=H(y)=\\sin y$；由 $f(x,0)=G(x)+H(0)=G(x)=\\sin x$（用到隐含条件 $f(0,0)=H(0)=\\sin0=0$）。故 $f=xy+\\sin x+\\sin y$，$f(\\frac\\pi2,\\frac\\pi2)=\\frac{\\pi^2}{4}+2$。\n错因（我的记录）：最后没想到这题隐含了 f(0,0)=0 的条件，没这个条件做不出来。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_b13_8',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'multivariable_diff',
    sectionName: '抽象复合·设中间变量',
    title: '【1000题基础13-8】f(x+y,x/y)求偏导·设u/v反解万能法',
    content: '设 $f(x+y,\\frac xy)=x^2-xy+y^2$，则 $f_x′(x,y)=$______。',
    mistakeType: '方法不熟',
    importance: 4,
    correction: '解析：万能方法——设 $u=x+y,\\ v=\\frac xy$，反解 $x=\\frac{uv}{v+1},\\ y=\\frac{u}{v+1}$，代入：$f(u,v)=\\frac{u^2(v^2-v+1)}{(v+1)^2}$。故 $f_x′=\\frac{\\partial f}{\\partial u}=\\frac{2u(v^2-v+1)}{(v+1)^2}$，回代 $u=x,v=y$ 得 $f_x′(x,y)=\\frac{2x(y^2-y+1)}{(y+1)^2}$。\n错因（我的记录）：我直接去用 x+y 和 x/y 凑后面的形式凑不出来，看答案是设 u 和 v 等于两者再反解出 x,y 写完整表达式，看来这是万能的方法。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_b13_9',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'multivariable_diff',
    sectionName: '绝对值·分类讨论',
    title: '【1000题基础13-9】√|xy| 求偏导·绝对值分类讨论',
    content: '设函数 $f(x,y)=\\sqrt{|xy|}$，求 $\\frac{\\partial[f(x,y)]}{\\partial x}$。',
    mistakeType: '概念不清',
    importance: 4,
    correction: '解析：含绝对值必须分类讨论，不能当它没用直接去掉！① $xy>0$：$f=\\sqrt{xy}$，$f_x=\\frac{y}{2\\sqrt{xy}}=\\frac12\\sqrt{\\frac yx}$；② $xy<0$：$f=\\sqrt{-xy}$，$f_x=\\frac{-y}{2\\sqrt{-xy}}$；③ $y=0$：$f\\equiv0$，$f_x=0$；④ $x=0,y\\ne0$：$f_x=\\lim_{h\\to0}\\frac{\\sqrt{|hy|}}{h}$ 不存在。\n错因（我的记录）：我想根号下面只能是正数，就认为绝对值没用可以直接去掉，但是不能这样想，题目要分类讨论。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_b13_16',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'multivariable_diff',
    sectionName: '变量代换·链式求导',
    title: '【1000题基础13-16】偏微分方程变量代换·链式求导',
    content: '设函数 $u=f(x,y)$ 具有二阶连续偏导数，作变量代换 $\\xi=x,\\ \\eta=y-x$，将方程 $\\frac{\\partial^2u}{\\partial x^2}+2\\frac{\\partial^2u}{\\partial x\\partial y}+\\frac{\\partial^2u}{\\partial y^2}=0$ 化为以 $\\xi,\\eta$ 为自变量的方程。',
    mistakeType: '概念不清',
    importance: 4,
    correction: '解析：链式求导：$u_x=u_\\xi-u_\\eta$，$u_y=u_\\eta$；二阶：$u_{xx}=u_{\\xi\\xi}-2u_{\\xi\\eta}+u_{\\eta\\eta}$，$u_{xy}=u_{\\xi\\eta}-u_{\\eta\\eta}$，$u_{yy}=u_{\\eta\\eta}$。代入原式：$u_{\\xi\\xi}-2u_{\\xi\\eta}+u_{\\eta\\eta}+2u_{\\xi\\eta}-2u_{\\eta\\eta}+u_{\\eta\\eta}=u_{\\xi\\xi}=0$。即化为 $\\frac{\\partial^2u}{\\partial\\xi^2}=0$。\n错因（我的记录）：奇怪的题，不知道在问我什么，看答案才知道这才考链式求导。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_b14_3',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'double_integral',
    sectionName: '二重积分·中值定理',
    title: '【1000题基础14-3】二重积分中值定理·收缩圆盘求极限',
    content: '求极限 $\\lim\\limits_{r\\to0^+}\\dfrac{1}{\\pi r^2}\\displaystyle\\iint\\limits_{x^2+y^2\\le r^2}e^{x^2-y^2}\\cos(x+y)\\,dxdy=$（　）\nA. $0$　　B. $1$　　C. $\\pi r^2$　　D. $\\dfrac{1}{\\pi r^2}$',
    mistakeType: '方法不熟',
    importance: 5,
    correction: '正确答案：B\n解析：二重积分中值定理——$f$ 在闭区域 $D$ 上连续，则存在 $(\\xi,\\eta)\\in D$ 使 $\\iint_D f\\,d\\sigma=f(\\xi,\\eta)\\cdot S$。这里 $S=\\pi r^2$，故原式 $=f(\\xi,\\eta)=e^{\\xi^2-\\eta^2}\\cos(\\xi+\\eta)$。当 $r\\to0^+$ 时圆盘收缩到原点，$(\\xi,\\eta)\\to(0,0)$，由连续性极限 $=f(0,0)=e^0\\cos0=1$。\n错因（我的记录）：不知道有“二重积分中值定理”，看到极限+积不出的二重积分没想到用。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_b14_5',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'double_integral',
    sectionName: '二重积分·换序+分部抵项',
    title: '【1000题基础14-5】积不出换序·分部产生抵消项',
    content: '计算 $\\displaystyle\\int_0^1 dx\\int_0^{\\sqrt{x}}e^{-y^2/2}\\,dy=$ ______。',
    mistakeType: '方法不熟',
    importance: 5,
    correction: '正确答案：$e^{-1/2}$\n解析：内层 $\\int e^{-y^2/2}dy$ 积不出 → 换序。区域 $0\\le x\\le1,\\ 0\\le y\\le\\sqrt{x}$ 即 $0\\le y\\le1,\\ y^2\\le x\\le1$：原式 $=\\int_0^1 e^{-y^2/2}(1-y^2)\\,dy=\\int_0^1 e^{-y^2/2}dy-\\int_0^1 y^2e^{-y^2/2}dy$。第二项分部：$y^2e^{-y^2/2}=-y\\cdot(e^{-y^2/2})′$，$\\int_0^1 y^2e^{-y^2/2}dy=[-ye^{-y^2/2}]_0^1+\\int_0^1 e^{-y^2/2}dy$。两个积不出的项恰好抵消：原式 $=-e^{-1/2}+2\\int_0^1 e^{-y^2/2}dy-2\\int_0^1 e^{-y^2/2}dy$——即原式 $=e^{-1/2}$。\n错因（我的记录）：想到换序，但换完有一个积分积不出；没想到后面分部会产生一项把积不出的抵掉。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_b14_12',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'double_integral',
    sectionName: '二重积分·偏心圆极坐标',
    title: '【1000题基础14-12】偏心半圆域极坐标·极点钉原点',
    content: '设 $a>0$，$D=\\{(x,y)\\mid(x-a)^2+y^2\\le a^2,\\ y\\ge0\\}$，求 $\\displaystyle\\iint_D\\sqrt{4a^2-x^2-y^2}\\,dxdy$。',
    mistakeType: '概念不清',
    importance: 5,
    correction: '正确答案：$\\dfrac{4a^3(3\\pi-4)}{9}$\n解析：圆心 $(a,0)$ 半径 $a$ 的圆，极坐标方程 $r=2a\\cos\\theta$（极点永远钉在原点，不能给 $x$ 代 $r\\cos\\theta+a$！）。上半圆：$\\theta\\in[0,\\frac\\pi2]$，$r\\in[0,2a\\cos\\theta]$。原式 $=\\int_0^{\\pi/2}\\!\\!d\\theta\\int_0^{2a\\cos\\theta}\\!\\!\\sqrt{4a^2-r^2}\\cdot r\\,dr=\\frac13\\int_0^{\\pi/2}\\big[8a^3-(4a^2-4a^2\\cos^2\\theta)^{3/2}\\big]d\\theta=\\frac{8a^3}3\\int_0^{\\pi/2}(1-\\sin^3\\theta)\\,d\\theta$。华里士 $\\int_0^{\\pi/2}\\sin^3=\\frac23$，得 $\\frac{8a^3}3(\\frac\\pi2-\\frac23)=\\frac{4a^3(3\\pi-4)}{9}$。\n错因（我的记录）：错误地把极坐标 $x$ 代成 $r\\cos\\theta+a$；错误认知“极坐标一定要圆心在原点”。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_b14_14',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'double_integral',
    sectionName: '二重积分·轮换对称性',
    title: '【1000题基础14-14】轮换对称化简·分母 x+y 对消',
    content: '设 $D=\\{(x,y)\\mid1\\le x^2+y^2\\le4,\\ x\\ge0,\\ y\\ge0\\}$，求 $\\displaystyle\\iint_D\\frac{x\\cos\\sqrt{x^2+y^2}}{x+y}\\,dxdy$。',
    mistakeType: '方法不熟',
    importance: 5,
    correction: '正确答案：$\\dfrac\\pi4(2\\sin2-\\sin1+\\cos2-\\cos1)$\n解析：$D$ 关于 $y=x$ 对称 → 轮换对称性 $\\iint_D f(x,y)=\\iint_D f(y,x)$。记 $I_x=\\iint\\frac{x\\cos\\sqrt{x^2+y^2}}{x+y}$，$I_y=\\iint\\frac{y\\cos\\sqrt{x^2+y^2}}{x+y}$，则 $I_x=I_y$，$2I_x=I_x+I_y=\\iint_D\\cos\\sqrt{x^2+y^2}\\,dxdy$（分母 $x+y$ 对消！）。极坐标：$=\\int_0^{\\pi/2}\\!\\!d\\theta\\int_1^2\\cos r\\cdot r\\,dr=\\frac\\pi2[r\\sin r+\\cos r]_1^2$。故 $I_x=\\frac\\pi4(2\\sin2+\\cos2-\\sin1-\\cos1)$。\n错因（我的记录）：看到 $x^2+y^2$ 直接上极坐标很难积，应先用轮换对称性化简；偏心圆用换元法（雅可比）更方便但不会。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_b14_17',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'double_integral',
    sectionName: '二重积分·辅助线构对称',
    title: '【1000题基础14-17】无对称区域·辅助线构造对称+奇偶消项',
    content: '设 $a\\ge1$，$f(x)$ 在 $[-a,a]$ 上连续，$D=\\{(x,y)\\mid x^3\\le y\\le1,\\ -1\\le x\\le1\\}$，求 $\\displaystyle\\iint_D\\big[(x+1)f(x)+(x-1)f(-x)\\big]\\sin y\\,dxdy$。',
    mistakeType: '思路错误',
    importance: 4,
    correction: '解析：$D$ 本身无对称性，作辅助线 $y=-x^3$ 把 $D$ 分成两块：$D_1$（$-x^3\\le y\\le x^3$ 型，关于 $x$ 轴对称）与 $D_2$（上半剩余部分关于原点对称的配对区）。在关于原点对称的区域上，被积函数按 $(x,y)\\to(-x,-y)$ 判奇偶：$(x+1)f(x)\\sin y$ 与 $(x-1)f(-x)\\sin y$ 的奇部相互抵消，只剩偶部贡献；在关于 $x$ 轴对称的 $D_1$ 上，含 $\\sin y$ 奇函数项积分为 0。核心思想：无对称 → 添辅助线补出对称区域，用「大区域 − 补的部分」+奇偶消项，全程不需要求出 $f$ 的具体形式。\n错因（我的记录）：区域无对称性，没想到用辅助线构造两个对称区域。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_b14_20',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'double_integral',
    sectionName: '二重积分·极坐标sec技巧',
    title: '【1000题基础14-20】分段函数二重积分·上下同除cosθ',
    content: '计算 $\\displaystyle\\iint_D f(x,y)\\,d\\sigma$，其中 $D=\\{(x,y)\\mid x^2+y^2\\ge2x\\}$，$f(x,y)=\\begin{cases}y,&1\\le x\\le2,\\ 0\\le y\\le x\\\\0,&\\text{其他}\\end{cases}$。',
    mistakeType: '方法不熟',
    importance: 4,
    correction: '正确答案：$\\dfrac56$\n解析：有效区域 = 矩形三角区 $\\{1\\le x\\le2,\\ 0\\le y\\le x\\}$ 挖去圆盘 $x^2+y^2<2x$。极坐标：$\\theta\\in[0,\\frac\\pi4]$，$r$ 从 $2\\cos\\theta$（圆）到 $2\\sec\\theta$（直线 $x=2$）。原式 $=\\int_0^{\\pi/4}\\!\\!d\\theta\\int_{2\\cos\\theta}^{2\\sec\\theta}\\!\\!r\\sin\\theta\\cdot r\\,dr=\\frac{\\sin\\theta}3\\Big[\\frac{r^3}3\\Big]$ 代入后关键是“上下同除 $\\cos\\theta$”：$\\frac{8\\sec^3\\theta-8\\cos^3\\theta}{3}$ 同除 $\\cos$ 化出 $\\tan$ 的幂再凑微分，逐项积分（$\\int\\tan^2=\\tan\\theta-\\theta$ 等）得 $\\frac56$。\n错因（我的记录）：极坐标换元后积分难积，“上下同除 $\\cos\\theta$”想不到，且 $\\sec$ 不熟。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_b15_4',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'ode',
    sectionName: '微分方程·x视为y的函数',
    title: '【1000题基础15-4】把 x 视为 y 的函数·一阶线性',
    content: '求微分方程 $(2x-3xy^2-y^3)y′+y^3=0$ 的通解。',
    mistakeType: '方法不熟',
    importance: 5,
    correction: '解析：x 关于 y 更简单，把 x 看作 y 的函数。$\\frac{dy}{dx}=\\frac{-y^3}{2x-3xy^2-y^3}$，取倒数 $\\frac{dx}{dy}=\\frac{(3y^2-2)x}{y^3}+1$，即一阶线性 $\\frac{dx}{dy}-\\frac{3y^2-2}{y^3}x=1$。积分因子 $\\mu=y^{-3}e^{-1/y^2}$，$\\int y^{-3}e^{-1/y^2}dy=\\frac12e^{-1/y^2}$，故通解 $x=\\frac{y^3}2+Cy^3e^{1/y^2}$。\n错因（我的记录）：x 比 y 的形式明显简单，将 x 作为被求导的函数会简单很多，但我没想到。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_b15_5',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'ode',
    sectionName: '微分方程·换元u=x+y',
    title: '【1000题基础15-5】(x+y)² 型换元·幂指极限',
    content: '设 $y=y(x)$ 过原点且满足 $\\frac{dy}{dx}=(x+y)^2$，求 $\\lim\\limits_{x\\to0^+}[y(x)]^x$。',
    mistakeType: '方法不熟',
    importance: 5,
    correction: '正确答案：$1$\n解析：令 $u=x+y$，则 $\\frac{du}{dx}=1+u^2$，分离变量 $\\arctan u=x+C$，$u=\\tan(x+C)$。过原点 $y(0)=0\\Rightarrow u(0)=0\\Rightarrow C=0$，故 $y=\\tan x-x$。极限：$\\tan x-x\\sim\\frac{x^3}3$，$[y]^x=e^{x\\ln(x^3/3)}=e^{x(3\\ln x-\\ln3)}$，$x\\to0^+$ 时 $x\\ln x\\to0$，故极限 $=e^0=1$。\n错因（我的记录）：遇到 xy 组合形式的微分方程应换元（把 x+y 换成 u），长时间没做微分方程有些经验不足。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_b15_6',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'ode',
    sectionName: '微分方程·凑导数(siny)′',
    title: '【1000题基础15-6】乘 cos y 凑 (sin y)′·一阶线性',
    content: '求微分方程 $y′=(x+1)\\sec y-\\tan y$ 的通解。',
    mistakeType: '方法不熟',
    importance: 5,
    correction: '解析：两边乘 $\\cos y$：$y′\\cos y=(x+1)-\\sin y$。关键识别 $y′\\cos y=(\\sin y)′$，令 $z=\\sin y$ 得 $z′+z=x+1$。积分因子 $e^x$：$(ze^x)′=(x+1)e^x$，$\\int(x+1)e^x dx=xe^x$，故 $ze^x=xe^x+C$，$z=x+Ce^{-x}$，即通解 $\\sin y=x+Ce^{-x}$。\n错因（我的记录）：做不出来，中间把 $y′\\cos y$ 看作 $(\\sin y)′$ 的操作是真想不到。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_b15_8',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'ode',
    sectionName: '微分方程·旋转体应用',
    title: '【1000题基础15-8】旋转容器注水·变截面微分方程',
    content: 'yOz 面上曲线 $y=f(z)\\ (z\\ge0)$ 绕 z 轴旋转成容器，以 $3\\,cm^3/s$ 注水，水面面积以 $\\pi\\,cm^2/s$ 增大，底面积 $16\\pi\\,cm^2$，求 $f(z)$。',
    mistakeType: '方法不熟',
    importance: 3,
    correction: '正确答案：$f(z)=4e^{\\pi z/6}$\n解析：底面积 $\\pi f(0)^2=16\\pi\\Rightarrow f(0)=4$。水面高 z 时体积 $V=\\int_0^z\\pi f^2 dt$，$\\frac{dV}{dt}=\\pi f^2\\frac{dz}{dt}=3$；水面面积 $S=\\pi f^2$，$\\frac{dS}{dt}=2\\pi f f′\\frac{dz}{dt}=\\pi$。两式相除：$\\frac{2f′}{f}=\\frac{\\pi}3$，即 $\\frac{f′}f=\\frac\\pi6$，解得 $f=4e^{\\pi z/6}$。\n错因（我的记录）：此类物理应用题很少做，解析很烦，优先级放后面。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_b15_10',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'ode',
    sectionName: '微分方程·变限积分初值',
    title: '【1000题基础15-10】变限积分定特解·不等式放缩',
    content: '设 $\\varphi(x)$ 连续且 $|\\varphi(x)|\\le k$，求 $\\frac{dy}{dx}+y=\\varphi(x)$ 满足 $y(0)=0$ 的特解，并证明 $x\\ge0$ 时 $|y(x)|\\le k(1-e^{-x})$。',
    mistakeType: '方法不熟',
    importance: 4,
    correction: '解析：积分因子 $e^x$：$(ye^x)′=\\varphi e^x$，变限积分 $ye^x=\\int_0^x\\varphi(t)e^t dt+C$，代入 $y(0)=0$ 得 $C=0$，特解 $y=e^{-x}\\int_0^x\\varphi(t)e^t dt$。放缩：$|y|\\le e^{-x}\\int_0^x|\\varphi|e^t dt\\le e^{-x}\\cdot k\\int_0^x e^t dt=ke^{-x}(e^x-1)=k(1-e^{-x})$。变限积分的好处：直接代初值消去 C，积分区间明确便于放缩。\n错因（我的记录）：变限积分用于带初值的微分方程这一后续处理不熟。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_b15_16',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'ode',
    sectionName: '微分方程·由通解反求方程',
    title: '【1000题基础15-16】由通解定特征根·反求三阶方程',
    content: '已知某三阶常系数齐次线性方程的通解为 $y=C_1+e^x(C_2\\cos2x+C_3\\sin2x)$，求该方程。',
    mistakeType: '概念不清',
    importance: 5,
    correction: '正确答案：$y‴-2y″+5y′=0$\n解析：从通解读特征根——常数项 $C_1$ 对应 $\\lambda=0$；$e^x(\\cos2x,\\sin2x)$ 对应共轭复根 $\\lambda=1\\pm2i$。特征多项式 $\\lambda(\\lambda-(1+2i))(\\lambda-(1-2i))=\\lambda(\\lambda^2-2\\lambda+5)=\\lambda^3-2\\lambda^2+5\\lambda$，故方程 $y‴-2y″+5y′=0$。设解形式（含三角）：$e^{\\alpha x}(C_1\\cos\\beta x+C_2\\sin\\beta x)$ 对应 $\\alpha\\pm\\beta i$。\n错因（我的记录）：此类题型设解的形式（尤其含三角）总忘，已补进背诵清单十三节。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_b15_21',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'ode',
    sectionName: '微分方程·欧拉方程',
    title: '【1000题基础15-21】欧拉方程·固定解法',
    content: '求欧拉方程 $x^2y″+3xy′+3y=0$ 满足 $y(1)=0,\\ y′(1)=\\sqrt2$ 的特解。',
    mistakeType: '方法不熟',
    importance: 4,
    correction: '正确答案：$y=\\frac{\\sin(\\sqrt2\\ln x)}{x}$\n解析：欧拉方程令 $y=x^m$：$m(m-1)+3m+3=m^2+2m+3=0$，$m=-1\\pm\\sqrt2 i$。通解 $y=x^{-1}[C_1\\cos(\\sqrt2\\ln x)+C_2\\sin(\\sqrt2\\ln x)]$。$y(1)=0\\Rightarrow C_1=0$。求导代 $y′(1)=\\sqrt2$ 得 $C_2=1$，故 $y=\\frac{\\sin(\\sqrt2\\ln x)}{x}$。欧拉方程固定步骤：令 $x=e^t$ 化常系数，或直接设 $y=x^m$ 解特征方程。\n错因（我的记录）：欧拉方程解题步骤固定但我忘光了，冷门但数一要掌握，已补进背诵清单十三节。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_b16_1',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'series',
    sectionName: '级数·等比+p级数判敛',
    title: '【1000题基础16-1】两级数均收敛求 p·抓大头+等比/p级数',
    content: '设 $p$ 为常数，若级数 $\\sum\\limits_{n=1}^\\infty\\frac{(\\sqrt{n+1}-\\sqrt n)^p}{n}$ 与 $\\sum\\limits_{n=1}^\\infty\\left[\\frac1{n^p}-\\frac1{(n+1)^p}\\right]$ 均收敛，则（　）\nA. $-2<p\\le-1$　B. $-1\\le p<0$　C. $-1<p\\le0$　D. $p>0$',
    mistakeType: '概念不清',
    importance: 5,
    correction: '正确答案：D\n解析：第一级数：$\\sqrt{n+1}-\\sqrt n=\\frac1{\\sqrt{n+1}+\\sqrt n}\\sim\\frac1{2\\sqrt n}$，故 $\\frac{(\\sqrt{n+1}-\\sqrt n)^p}{n}\\sim\\frac1{2^p n^{1+p/2}}$，收敛 $\\iff1+\\frac p2>1\\iff p>0$（抓大头后读 p 级数）。第二级数是 telescoping：部分和 $=1-\\frac1{(n+1)^p}$，仅当 $p>0$ 时 $\\to1$ 收敛。两都收敛 $\\iff p>0$，选 D。\n错因（我的记录）：只有相加和相乘才能抓大头，开局直接抓大头分子为 0；等比级数知识点也不知道，已补进背诵清单十四节。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_b16_3',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'series',
    sectionName: '级数·泰勒判敛+条件收敛',
    title: '【1000题基础16-3】泰勒展开判敛·条件收敛',
    content: '设 $\\lambda>0$ 是常数，则 $\\sum\\limits_{n=1}^\\infty(-1)^n\\sin\\frac{\\lambda+2n^2}{n^3}$（　）\nA. 发散　B. 条件收敛　C. 绝对收敛　D. 敛散性与 $\\lambda$ 有关',
    mistakeType: '方法不熟',
    importance: 5,
    correction: '正确答案：B\n解析：$\\frac{\\lambda+2n^2}{n^3}=\\frac2n+\\frac{\\lambda}{n^3}\\to0$，泰勒 $\\sin x=x-\\frac{x^3}6+\\cdots$：$\\sin\\frac{\\lambda+2n^2}{n^3}=\\frac2n+\\frac{\\lambda-4/3}{n^3}+o(\\frac1{n^3})$。通项 $=(-1)^n\\frac2n+(-1)^nO(\\frac1{n^3})$：前者莱布尼茨收敛（交错调和），后者绝对收敛，故原级数收敛；但取绝对值 $\\sim\\frac2n$ 调和发散，故条件收敛，选 B。$\\lambda$ 只落在绝对收敛的余项里，与敛散性无关。\n错因（我的记录）：没想到用泰勒展开和等价替换；交错级数敛散性判别、条件收敛、绝对收敛的定义都遗忘了，已补进背诵清单十四节。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_b16_4',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'series',
    sectionName: '级数·偶/奇次方敛散',
    title: '【1000题基础16-4】偶次方必绝对收敛·奇次方举反例',
    content: '以下结论，正确的是（　）\nA. 若 $\\sum\\limits_{n=0}^\\infty a_n^2$ 收敛，则 $\\sum\\limits_{n=0}^\\infty a_n^3$ 收敛\nB. 若 $\\sum\\limits_{n=0}^\\infty a_n^2$ 发散，则 $\\sum\\limits_{n=0}^\\infty a_n^3$ 发散\nC. 若 $\\sum\\limits_{n=0}^\\infty a_n^3$ 收敛，则 $\\sum\\limits_{n=0}^\\infty a_n^4$ 收敛\nD. 若 $\\sum\\limits_{n=0}^\\infty a_n^3$ 发散，则 $\\sum\\limits_{n=0}^\\infty a_n^4$ 发散',
    mistakeType: '概念不清',
    importance: 5,
    correction: '正确答案：A\n解析：偶次方天然非负：$\\sum a_n^2$ 收敛本身就是绝对收敛；且 $a_n\\to0\\Rightarrow$ 充分大 n 有 $|a_n|\\le1\\Rightarrow|a_n^3|=|a_n|\\cdot a_n^2\\le a_n^2$，比较判别绝对收敛，A 正确。奇次方符号可变、可能条件收敛，故 B/D 的“发散”推断不成立。反例库：B 取 $a_n=\\frac{(-1)^n}{\\sqrt n}$（$\\sum a_n^2=\\sum\\frac1n$ 发散但 $\\sum a_n^3$ 收敛）；C 取 $a_n=\\frac{(-1)^n}{n^{1/4}}$（$\\sum a_n^3=\\sum\\frac{(-1)^n}{n^{3/4}}$ 收敛但 $\\sum a_n^4=\\sum\\frac1n$ 发散）；D 取 $a_n=\\frac1{n^{1/3}}$（$\\sum a_n^3=\\sum\\frac1n$ 发散但 $\\sum a_n^4=\\sum\\frac1{n^{4/3}}$ 收敛）。\n错因（我的记录）：偶次方天然非负若收敛必绝对收敛、奇次方符号可变若收敛可能条件收敛；无穷级数太弱，反例级数库已补进背诵清单十四节。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_b16_6',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'series',
    sectionName: '级数·telescoping+反例',
    title: '【1000题基础16-6】telescoping 收敛·举反例排除',
    content: '设 $\\sum\\limits_{n=1}^\\infty(u_{n+1}-u_n)$ 收敛，则下列级数中收敛的是（　）\nA. $\\sum\\limits_{n=1}^\\infty\\frac{u_n}{n}$　B. $\\sum\\limits_{n=1}^\\infty(-1)^n\\frac1{u_n}$　C. $\\sum\\limits_{n=1}^\\infty\\left(1-\\frac{u_n}{u_{n+1}}\\right)$　D. $\\sum\\limits_{n=1}^\\infty(u_{n+1}^2-u_n^2)$',
    mistakeType: '方法不熟',
    importance: 4,
    correction: '正确答案：D\n解析：$\\sum(u_{n+1}-u_n)$ 收敛 $\\iff$ telescoping 部分和 $S_N=u_{N+1}-u_1$ 有极限 $\\iff u_n\\to L$ 存在。D 又是 telescoping：部分和 $=u_{N+1}^2-u_1^2\\to L^2-u_1^2$，必收敛，选 D。反例排除（取 $u_n=\\frac1n$，满足前提 $u_n\\to0$）：B 的 $(-1)^n\\frac1{u_n}=(-1)^n n$ 通项无界发散；C 的 $1-\\frac{u_n}{u_{n+1}}=1-\\frac{n+1}n=-\\frac1n$ 发散。取 $u_n=1+\\frac1n$（$u_n\\to1$）：A 的 $\\frac{u_n}n\\sim\\frac1n$ 发散。故只有 D 必收敛。\n错因（我的记录）：太难做了，举反例速度快；收敛区间/收敛域与反例级数库已补进背诵清单十四节。',
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
    correction: '正确答案：$\\pi$\n解析：用 Stokes 公式。$P=xz,Q=x,R=\\frac{y^2}{2}$，旋度 $\\text{rot}=(R_y-Q_z,\\ P_z-R_x,\\ Q_x-P_y)=(y,\\ x,\\ 1)$。取 $L$ 围成的平面片 $z=x+y$（$x^2+y^2\\le1$），上侧法向 $(-z_x,-z_y,1)=(-1,-1,1)$。被积 $(y,x,1)\\cdot(-1,-1,1)=-y-x+1$。在圆盘上积分，$x,y$ 为奇函数积分为 0，剩 $\\iint 1\\,dxdy=\\pi$。\n错因（我的记录）：依旧不熟练，遇到此类问题不知道运用什么方法最简便。',
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
  },
  // ==================== 1000题基础15-18讲二刷错题（薄弱点记录+例题 · 09-08 重灾区专项）====================
  {
    id: 'math_1000_b15_7',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'green_formula',
    sectionName: '曲线积分·格林公式',
    title: '【1000题基础15-7】格林公式几何意义+使用条件（二刷仍错·重灾区）',
    content: '格林公式的几何意义和使用条件我都忘了，这道题基本没怎么看懂。（二刷双圈·数一重灾区）',
    mistakeType: '概念不清',
    importance: 5,
    correction: '【格林公式】$\\oint_L P\\,dx+Q\\,dy=\\iint_D\\left(\\frac{\\partial Q}{\\partial x}-\\frac{\\partial P}{\\partial y}\\right)dxdy$\n【三个使用条件】①L 必须封闭（不封闭先补线，最后减去补的那段）②正向：沿 L 行走时区域 D 始终在左侧（即逆时针）③P、Q 在 D 上有连续偏导数（D 内有奇点要挖去，用小圆周围绕）\n【几何意义】$\\frac{\\partial Q}{\\partial x}-\\frac{\\partial P}{\\partial y}$ 是向量场的二维旋度，格林公式把边界环量转成内部旋度之和；特别取 $P=-y,\\ Q=x$ 得面积公式 $\\oint_L x\\,dy-y\\,dx=2\\iint_D dxdy=2S$。\n【简单例题】求 $\\oint_L(x^2-y)dx+(x^2+y)dy$，L 为单位圆盘 $x^2+y^2\\le1$ 的正向边界。解：$Q_x-P_y=2x-(-1)=2x+1$，原式 $=\\iint_D(2x+1)dxdy=\\iint_D 2x\\,dxdy+\\iint_D 1\\,dxdy=0+\\pi$（$2x$ 关于 y 轴奇对称为 0，常数 1 的积分=面积 π）。\n口诀：格林三条件——封闭、正向、偏导连续；不封闭补线要减，有奇点挖洞要绕。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_b15_9',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'power_series',
    sectionName: '幂级数·收敛半径不变性',
    title: '【1000题基础15-9】收敛半径四条不变性+收敛区间vs收敛域（二刷仍错·重灾区）',
    content: '此类题不太会做，得记住四个收敛半径不变性；同时记住收敛区间不考虑端点、收敛域才考虑端点。（二刷双圈·重灾区）',
    mistakeType: '概念不清',
    importance: 4,
    correction: '【收敛半径四条不变性】幂级数 $\\sum a_nx^n$ 与下列级数收敛半径 R 完全相同：①$\\sum a_nx^{n+1}$（整体乘 x）②$\\sum\\frac{a_n}{n+1}x^{n+1}$（逐项积分）③$\\sum na_nx^{n-1}$（逐项求导）。即“乘除 x、逐项求导、逐项积分都不改变收敛半径 R”。\n【收敛区间 vs 收敛域】收敛区间 $(-R,R)$ 是开区间，天然不含端点；收敛域 = 收敛区间 + 单独验证端点 $x=\\pm R$ 后收敛的那些端点。求导/积分后 R 不变，但端点敛散性可能变，必须重新验证。\n口诀：求导积分不动 R，收敛区间开区间，收敛域才验端点。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_b16_14',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'power_series_sum',
    sectionName: '幂级数·求和函数综合',
    title: '【1000题基础16-14】幂级数求和函数综合：先判收敛域+统一幂次+积分公式（究极难题·重灾区）',
    content: '究极难题，全方位考察：①求和函数前就忘记判断收敛域了 ②和函数的化简、统一幂次等操作不熟练 ③里面的积分公式都没怎么记清楚。这题质量确实太高了。（二刷双圈·重灾区）',
    mistakeType: '方法不熟',
    importance: 5,
    correction: '【求和函数三步铁律】①先求收敛域：算半径 R + 验端点，和函数表达式只在收敛域内成立（这题就栽在求和前忘了判收敛域）②统一幂次：把通项通过提出 x 的幂、逐项求导或逐项积分，凑成标准形（$\\sum x^n$、$\\sum nx^{n-1}$、$\\sum\\frac{x^n}{n}$、$\\sum\\frac{x^n}{n!}$ 之一）③套基本和函数。\n【四个基本和函数（|x|<1）】$\\sum_{n=0}^{\\infty}x^n=\\frac1{1-x}$；$\\sum_{n=1}^{\\infty}nx^{n-1}=\\frac1{(1-x)^2}$；$\\sum_{n=1}^{\\infty}\\frac{x^n}{n}=-\\ln(1-x)$；$\\sum_{n=0}^{\\infty}\\frac{x^n}{n!}=e^x$。\n【积分公式回顾】化简中常用 $\\int xe^xdx=(x-1)e^x+C$、$\\int\\frac{dx}{\\sqrt{1+x^2}}=\\ln(x+\\sqrt{1+x^2})+C$ 等，详见背诵清单第三章。\n口诀：求和先问收敛域，统一幂次凑标准；导一次升幂分母、积一次出对数，端点最后单独验。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_b17_1',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'total_differential',
    sectionName: '多元微分·全微分四种等价',
    title: '【1000题基础17-1】全微分的四种等价表示（二刷仍错·重灾区）',
    content: '微分相关定义忘差不多了，背诵讲义得添加全微分的四种等价表示。（二刷双圈·重灾区）',
    mistakeType: '概念不清',
    importance: 5,
    correction: '【全微分定义】若 $\\Delta z=A\\Delta x+B\\Delta y+o(\\rho)$（$\\rho=\\sqrt{(\\Delta x)^2+(\\Delta y)^2}$），则称 f 可微，$dz=A\\,dx+B\\,dy$。\n【四种等价表示】①$dz=\\frac{\\partial z}{\\partial x}dx+\\frac{\\partial z}{\\partial y}dy$　②$dz=f_x(x,y)dx+f_y(x,y)dy$　③可微 $\\iff\\Delta z-f_x\\Delta x-f_y\\Delta y=o(\\rho)$（余项是 ρ 的高阶无穷小）　④一阶全微分形式不变性：无论 x、y 是自变量还是中间变量，$dz=\\frac{\\partial z}{\\partial x}dx+\\frac{\\partial z}{\\partial y}dy$ 形式不变。\n【三者关系链】偏导连续 $\\Rightarrow$ 可微 $\\Rightarrow$ 连续、偏导存在（反向都不成立；可微必连续，但偏导存在未必连续）。\n口诀：全微分=两偏导各乘增量再相加；可微看余项是不是 o(ρ)；偏导连续是可微的充分非必要条件。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_b17_7',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'surface_equation',
    sectionName: '空间曲面·准线与母线',
    title: '【1000题基础17-7】准线与母线定义+空间曲面方程（二刷仍错·重灾区）',
    content: '准线和母线的定义忘完了，此类题型完全不会，不知道如何描述这样一个空间体的方程。（二刷双圈·重灾区）',
    mistakeType: '概念不清',
    importance: 4,
    correction: '【柱面定义】一条动直线（母线）沿一条定曲线（准线）平行移动形成的曲面。准线是空间一条曲线（通常由两个曲面方程联立给出），母线是平行于某坐标轴的直线。\n【柱面方程】母线平行于 z 轴时，方程只含 x、y：$F(x,y)=0$。规律：方程缺哪个变量，母线就平行于哪个轴（缺 z → 母线平行 z 轴）。\n【旋转曲面】平面曲线绕轴旋转——“绕谁转谁不动，另一个换成 ±√(另两坐标平方和)”。如 xOy 面上曲线 $f(x,y)=0$ 绕 x 轴旋转得 $f(x,\\pm\\sqrt{y^2+z^2})=0$。\n【简单例题】yOz 面上直线 $z=2y$ 绕 z 轴旋转：z 不动，把 y 换成 $\\pm\\sqrt{x^2+y^2}$，得 $z=2(\\pm\\sqrt{x^2+y^2})$，两边平方即 $z^2=4(x^2+y^2)$（圆锥面）。\n口诀：缺谁平行谁（柱面）；绕谁谁不动，另两平方开根带 ±（旋转面）。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_b17_8',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'directional_derivative',
    sectionName: '多元微分·方向导数与旋度',
    title: '【1000题基础17-8】方向导数(l°单位向量)+旋度公式概念（二刷仍错·重灾区）',
    content: '方向导数的内容真忘得差不多了，图中下方老师给的知识点和公式完全忘了，需要加一个简单例题辅助记忆；甚至这个 l°（lo）符号都不知道啥意思。补充：旋度的相关公式和概念也忘差不多了。（二刷双圈·重灾区）',
    mistakeType: '公式不清',
    importance: 5,
    correction: '【$l^0$ 是什么】方向 $l$ 的单位向量（上标 0 = 单位化），$l^0=(\\cos\\alpha,\\cos\\beta)$，α、β 是方向 l 与 x 轴、y 轴正向的夹角（方向角）。\n【方向导数】$\\frac{\\partial f}{\\partial l}=\\nabla f\\cdot l^0=f_x\\cos\\alpha+f_y\\cos\\beta$，表示 f 沿 l 方向的变化率；最大方向导数沿梯度 $\\nabla f$ 方向，最大值 $=|\\nabla f|$。\n【简单例题】$f=x^2+2xy$ 在点 (1,0) 沿与 x 轴成 45° 方向：$\\nabla f=(2x+2y,\\,2x)$ 在 (1,0) 处 $=(2,2)$；$l^0=(\\cos45°,\\sin45°)=(\\frac{\\sqrt2}2,\\frac{\\sqrt2}2)$；$\\frac{\\partial f}{\\partial l}=2\\cdot\\frac{\\sqrt2}2+2\\cdot\\frac{\\sqrt2}2=2\\sqrt2$。\n【旋度】$\\operatorname{rot}\\vec F=\\nabla\\times\\vec F=(R_y-Q_z,\\ P_z-R_x,\\ Q_x-P_y)$（写成 i、j、k 三阶行列式按第一行展开）；概念：描述向量场在某点旋转的强弱与转轴方向，每个分量“右减左”、j 分量天然带负号。\n口诀：l° 是单位方向向量；方向导数=梯度点单位；最大沿梯度=模长；旋度画行列式右减左。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_b18_1',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'solid_revolution',
    sectionName: '重积分应用·旋转曲面方程',
    title: '【1000题基础18-1】旋转体（旋转曲面）方程记错（二刷仍错·重灾区）',
    content: '旋转体的公式记错了，这题写成 $(y+z)^2=2x$ 了，导致后面都算错了。（二刷双圈·重灾区）',
    mistakeType: '公式不清',
    importance: 5,
    correction: '【旋转曲面方程】平面曲线绕轴旋转——“绕谁转谁不动，另一个换成 ±√(另两坐标平方和)”。xOy 面上曲线 $f(x,y)=0$ 绕 x 轴 $\\Rightarrow f(x,\\pm\\sqrt{y^2+z^2})=0$；绕 y 轴 $\\Rightarrow f(\\pm\\sqrt{x^2+z^2},y)=0$。\n【错因针对】旋转半径是到旋转轴的**距离**，绕 x 轴时半径 $=\\sqrt{y^2+z^2}$，不是 $y+z$！把 $(y+z)^2$ 当半径平方是概念错误（两个坐标相加≠到轴距离）。\n【简单例题】xOy 面上抛物线 $y^2=2x$ 绕 x 轴旋转：把 y 换成 $\\pm\\sqrt{y^2+z^2}$，得 $y^2+z^2=2x$（旋转抛物面）——注意是 $y^2+z^2$ 不是 $(y+z)^2$。\n【旋转体体积】绕 x 轴 $V=\\pi\\int_a^b y^2dx$；绕 y 轴柱壳 $V=2\\pi\\int_a^b xy\\,dx$。\n口诀：绕 x 轴，半径是 √(y²+z²)；谁转谁留，另两平方开根，绝不是两坐标相加。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_b18_2',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'triple_integral_order',
    sectionName: '三重积分·先一后二/先二后一+对称性',
    title: '【1000题基础18-2】三重积分先一后二vs先二后一步骤+对称性优先（二刷仍错·重灾区）',
    content: '先二后一和先一后二的步骤记混了，需要用简单例题告诉我两者步骤以及如何选择。补充：做重积分总是忘记先考虑对称性，直接就猛干了，记得多提醒我。（二刷双圈·重灾区）',
    mistakeType: '方法不熟',
    importance: 5,
    correction: '【先一后二（投影穿针法）】先对 z 积分（z 上下限是 x、y 的函数），再在 xOy 投影域 D 上做二重积分：$\\iiint_\\Omega f\\,dV=\\iint_D[\\int_{z_1(x,y)}^{z_2(x,y)}f\\,dz]dxdy$。适用：Ω 上下边界曲面易解出 z。\n【先二后一（切片截面法）】先用平面 z=c 截 Ω 得截面 $D_z$，在 $D_z$ 上做二重积分，再对 z 从 $c_1$ 到 $c_2$ 积分：$\\iiint_\\Omega f\\,dV=\\int_{c_1}^{c_2}[\\iint_{D_z}f\\,dxdy]dz$。适用：f 只含 z（如 $z^2$）且截面 $D_z$ 是圆/矩形等易算区域。\n【简单例题】$\\iiint_\\Omega z^2dV$，Ω 为球 $x^2+y^2+z^2\\le R^2$。选**先二后一**（f=z² 只含 z、截面是圆）：固定 z，截面 $D_z$ 半径 $\\sqrt{R^2-z^2}$、面积 $\\pi(R^2-z^2)$，原式 $=\\int_{-R}^R z^2\\cdot\\pi(R^2-z^2)dz=\\pi\\int_{-R}^R(R^2z^2-z^4)dz=\\frac{4\\pi R^5}{15}$。\n【对称性优先铁律】（用户要求多提醒）动手前必看 Ω 与被积函数的对称性：Ω 关于 xOy 面对称、f 关于 z 是奇函数 $\\Rightarrow$ 积分=0；f 关于 z 偶 $\\Rightarrow$ =2 倍上半区域。同理看 x、y。\n口诀：f 只含一个变量、截面规整 → 先二后一；边界曲面易解 z → 先一后二；动手前先问对称性，能砍一半砍一半，奇函数对称直接零。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_b18_5',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'curve_integral',
    sectionName: '曲线积分·第一类+路径无关',
    title: '【1000题基础18-5】第一类曲线积分步骤+参数方程表达几何图形+路径无关（二刷仍错·重灾区）',
    content: '第一类曲线积分的步骤也忘了，只记得格林公式，请用简单例题的方式补上；类似用参数方程表达几何图形的能力也不足。补充：曲线积分与路径无关的知识点也忘差不多了。（二刷双圈·重灾区）',
    mistakeType: '方法不熟',
    importance: 5,
    correction: '【第一类曲线积分（对弧长）四步】①写曲线 L 的参数方程 $x=x(t),y=y(t),t\\in[\\alpha,\\beta]$ ②算弧微分 $ds=\\sqrt{x′^2+y′^2}\\,dt$ ③把 $f(x,y)$ 用 t 表示 ④$\\int_L f\\,ds=\\int_\\alpha^\\beta f(x(t),y(t))\\sqrt{x′^2+y′^2}\\,dt$。注意：ds 恒正，下限必小于上限。\n【简单例题】$\\int_L(x^2+y^2)ds$，L 为圆 $x^2+y^2=4$ 一周。参数 $x=2\\cos t,y=2\\sin t,t\\in[0,2\\pi]$，$ds=\\sqrt{(-2\\sin t)^2+(2\\cos t)^2}dt=2dt$，被积 $x^2+y^2=4$，$\\int_0^{2\\pi}4\\cdot2\\,dt=16\\pi$。\n【参数方程表达几何图形】圆 $x^2+y^2=a^2\\to(a\\cos t,a\\sin t)$；椭圆 $\\frac{x^2}{a^2}+\\frac{y^2}{b^2}=1\\to(a\\cos t,b\\sin t)$；两点 $(x_0,y_0)$ 到 $(x_1,y_1)$ 的直线段 $\\to x=x_0+(x_1-x_0)t,y=y_0+(y_1-y_0)t,t\\in[0,1]$。\n【曲线积分与路径无关四等价】（单连通域、P/Q 有连续偏导）①$\\int_L P\\,dx+Q\\,dy$ 与路径无关 ②沿任意闭曲线 $\\oint_L P\\,dx+Q\\,dy=0$ ③$\\frac{\\partial Q}{\\partial x}=\\frac{\\partial P}{\\partial y}$ ④$P\\,dx+Q\\,dy$ 是某函数 u 的全微分。\n口诀：第一类弧长 ds 恒正、参数化四步走；路径无关看 $Q_x=P_y$（等价于闭曲线积分为零）。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_xd2_6',
    chapterId: 'ch_xiandai',
    chapterName: '线性代数',
    sectionId: 'det_scalar',
    sectionName: '行列式·提常数',
    title: '基础2-6 行列式提常数要带阶数',
    content: '二刷仍错：行列式中提出常数忘记带阶数，3 阶 |2A| 算成 2|A|（应为 8|A|）。',
    mistakeType: '公式不清',
    importance: 4,
    correction: '知识点：n 阶矩阵提常数 $|kA|=k^n|A|$——每一行都提出一个 k，共 n 个。别与伴随混：$|A^*|=|A|^{n-1}$。\n例题：3 阶 $|A|=2$，则 $|2A|=2^3\\times2=16$；$|A^*|=|A|^2=4$。\n口诀：「提常数、带阶数，几阶就几次方」。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_xd2_7',
    chapterId: 'ch_xiandai',
    chapterName: '线性代数',
    sectionId: 'block_matrix',
    sectionName: '分块矩阵',
    title: '基础2-7 分块矩阵的逆与行列式',
    content: '分块矩阵的逆相关公式不清楚，二刷仍写不出；分块性质需补进背诵手册。',
    mistakeType: '公式不清',
    importance: 4,
    correction: '分块公式群（A、B 可逆）：$\\begin{pmatrix}A&O\\\\O&B\\end{pmatrix}^{-1}=\\begin{pmatrix}A^{-1}&O\\\\O&B^{-1}\\end{pmatrix}$；$\\begin{pmatrix}O&A\\\\B&O\\end{pmatrix}^{-1}=\\begin{pmatrix}O&B^{-1}\\\\A^{-1}&O\\end{pmatrix}$；$\\begin{pmatrix}A&C\\\\O&B\\end{pmatrix}^{-1}=\\begin{pmatrix}A^{-1}&-A^{-1}CB^{-1}\\\\O&B^{-1}\\end{pmatrix}$。\n行列式：$\\begin{vmatrix}A&C\\\\O&B\\end{vmatrix}=|A||B|$；$\\begin{vmatrix}O&A\\\\B&O\\end{vmatrix}=(-1)^{mn}|A||B|$（A 为 m 阶、B 为 n 阶）。\n口诀：「副对角分块求逆：换位再各逆；副对角行列式带符号 $(-1)^{mn}$」。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_xd2_14',
    chapterId: 'ch_xiandai',
    chapterName: '线性代数',
    sectionId: 'matrix_rank',
    sectionName: '矩阵的秩',
    title: '基础2-14 矩阵的秩性质群',
    content: '不知道 AB=O 能得 r(A)+r(B)≤n；秩的性质（乘秩变小？乘可逆不变？）几乎全忘。',
    mistakeType: '公式不清',
    importance: 5,
    correction: '秩性质群：①$AB=O\\Rightarrow r(A)+r(B)\\le n$（B 的列全是 Ax=0 的解）；②$r(AB)\\le\\min(r(A),r(B))$——乘一次、缩一次；③乘可逆矩阵秩不变：$r(PA)=r(AQ)=r(PAQ)=r(A)$；④$r(A+B)\\le r(A)+r(B)$；⑤Sylvester：$r(AB)\\ge r(A)+r(B)-n$。\n例题：A 为 4×6、B 为 6×5 且 AB=O ⟹ r(A)+r(B)≤6。\n口诀：「乘可逆不变、乘一般只缩、乘成零约束和」。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_xd2_17',
    chapterId: 'ch_xiandai',
    chapterName: '线性代数',
    sectionId: 'matrix_binomial',
    sectionName: '矩阵二项式定理',
    title: '基础2-17 矩阵的二项式定理',
    content: '完全没想到矩阵也能用二项式定理，二刷没思路。',
    mistakeType: '方法不熟',
    importance: 4,
    correction: '矩阵二项式定理：当 $AB=BA$ 时 $(A+B)^n=\\sum_{k=0}^{n}C_n^kA^kB^{n-k}$（不交换不能用！）。常配幂零：$A^2=O\\Rightarrow(E+A)^n=E+nA$。\n例题：$A^2=O$，$(2E+A)^n=2^nE+n2^{n-1}A$（2E 与 A 可交换，按二项式展开，$A^2$ 及以后全零）。\n口诀：「可交换才二项式；幂零截尾只留前两项」。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_xd3_1',
    chapterId: 'ch_xiandai',
    chapterName: '线性代数',
    sectionId: 'linear_dependence',
    sectionName: '向量组相关性',
    title: '基础3-1 线性相关/无关定义与等价定义',
    content: '线性相关和线性无关的定义都不清楚，等价定义更说不上来。',
    mistakeType: '概念不清',
    importance: 5,
    correction: '定义：$k_1\\alpha_1+\\cdots+k_s\\alpha_s=0$ 只有零解 ⟺ 线性无关；存在不全为零的 k 使等式成立 ⟺ 线性相关。\n等价说法（相关）：①至少一个向量可由其余向量线性表出；②$r(\\alpha_1,\\ldots,\\alpha_s)<s$；③以它们为列的 A 满足 $Ax=0$ 有非零解；④s=n 时 $|A|=0$。\n口诀：「相关=有人能被表出=秩不够人数=齐次有非零解」。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_xd3_13',
    chapterId: 'ch_xiandai',
    chapterName: '线性代数',
    sectionId: 'schmidt',
    sectionName: '施密特正交化',
    title: '基础3-13 施密特正交化（配例题）',
    content: '没看出考施密特正交化，直接用正交定义硬解，解出来算错了。',
    mistakeType: '方法不熟',
    importance: 5,
    correction: '施密特正交化：$\\beta_1=\\alpha_1$；$\\beta_2=\\alpha_2-\\frac{(\\alpha_2,\\beta_1)}{(\\beta_1,\\beta_1)}\\beta_1$；$\\beta_3=\\alpha_3-\\frac{(\\alpha_3,\\beta_1)}{(\\beta_1,\\beta_1)}\\beta_1-\\frac{(\\alpha_3,\\beta_2)}{(\\beta_2,\\beta_2)}\\beta_2$；最后单位化 $\\gamma_i=\\beta_i/|\\beta_i|$。\n例题：$\\alpha_1=(1,1,0),\\alpha_2=(1,0,1)$：$\\beta_2=(1,0,1)-\\frac{1}{2}(1,1,0)=(\\frac12,-\\frac12,1)$。\n口诀：「新的减旧的投影；分母是旧的自己点自己」。看到「求标准正交基/两两正交的单位向量组」就启动它。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_xd_rank_sol',
    chapterId: 'ch_xiandai',
    chapterName: '线性代数',
    sectionId: 'rank_solution',
    sectionName: '方程组秩-解关系',
    title: '薄弱点 线性方程组：秩-解关系 + 解的结构',
    content: '系数矩阵与增广矩阵秩的关系对应无解/唯一解/无穷解忘差不多；解的结构（通解怎么拼）也忘了。',
    mistakeType: '公式不清',
    importance: 5,
    correction: '秩-解三档（Ax=b，A 为 m×n）：$r(A)<r(\\bar A)$ 无解；$r(A)=r(\\bar A)=n$ 唯一解；$r(A)=r(\\bar A)<n$ 无穷多解（自由未知量 n−r 个）。齐次 Ax=0：$r(A)=n$ 只有零解；$r(A)<n$ 有非零解，基础解系含 $n-r$ 个向量。\n解的结构：齐次通解 $=k_1\\xi_1+\\cdots+k_{n-r}\\xi_{n-r}$；非齐次通解 = 特解 $\\eta^*$ + 齐次通解；非齐次两解之差是齐次解。\n口诀：「秩不等无解、秩等看满不满：满唯一、不满无穷；通解=特解+齐次通解」。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_xd4_6',
    chapterId: 'ch_xiandai',
    chapterName: '线性代数',
    sectionId: 'adjoint_rank',
    sectionName: '伴随矩阵的秩',
    title: '基础4-6 伴随是零矩阵的识别',
    content: '没看出 A* 是零矩阵，题目给的信息推不出来。',
    mistakeType: '概念不清',
    importance: 4,
    correction: '伴随秩三档：$r(A)=n\\Rightarrow r(A^*)=n$；$r(A)=n-1\\Rightarrow r(A^*)=1$；$r(A)<n-1\\Rightarrow r(A^*)=0$ 即 $A^*=O$。\n用法：题给 $r(A)\\le n-2$（如 AB=O 且 r(B)≥2 推出）⟹ 直接 $A^*=O$，从而 $|A^*|=0$、$A^*x=0$ 任意向量都是解。\n口诀：「满秩伴随满、掉一秩伴随一、再掉伴随零」。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_xd4_9',
    chapterId: 'ch_xiandai',
    chapterName: '线性代数',
    sectionId: 'nilpotent_rank',
    sectionName: '幂零矩阵的秩',
    title: '基础4-9 A²=O 推秩',
    content: 'A²=0 没能判断出 r(A)=1；配套知识点也忘了。',
    mistakeType: '概念不清',
    importance: 5,
    correction: '$A^2=O$ 且 A 为 n 阶非零：Sylvester $r(A^2)\\ge 2r(A)-n\\Rightarrow r(A)\\le\\lfloor n/2\\rfloor$；又 $A\\ne O\\Rightarrow r(A)\\ge1$。故 3 阶非零且 $A^2=O\\Rightarrow r(A)=1$。\n机制（秩1分解）：$r(A)=1\\Leftrightarrow A=\\alpha\\beta^T$，此时 $A^2=(\\beta^T\\alpha)A$，故 $A^2=O\\Leftrightarrow\\beta^T\\alpha=0(=\\operatorname{tr}A)$。\n口诀：「平方零、秩减半；三阶非零平方零，秩必是 1」。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_b18_9',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'green_formula',
    sectionName: '曲线积分·格林公式',
    title: '基础18-9 格林公式·区域内含奇点',
    content: '区域中含奇点的格林公式题仍不会做，不知道合理步骤是什么。',
    mistakeType: '方法不熟',
    importance: 5,
    correction: '四步法（挖奇点）：①找奇点——令 $P,Q$ 的分母为 0，判断该点是否落在积分区域 $D$ 内。②挖洞——若在内，以奇点为心作小圆 $l_\\varepsilon:x^2+y^2=\\varepsilon^2$（$\\varepsilon$ 充分小，使小圆盘整个含于 $D$），从 $D$ 中挖去小圆盘，得复连通区域 $D_\\varepsilon$。③用格林——$\\oint_{L^+}(Pdx+Qdy)+\\oint_{l_\\varepsilon^-}(Pdx+Qdy)=\\iint_{D_\\varepsilon}\\left(\\frac{\\partial Q}{\\partial x}-\\frac{\\partial P}{\\partial y}\\right)dxdy$；奇点挖掉后括号内常为 0，故右端 $=0$。④改算小圆——原积分 $=\\oint_{l_\\varepsilon^+}(Pdx+Qdy)$（小圆改回逆时针），代参数 $x=\\varepsilon\\cos t,\\ y=\\varepsilon\\sin t\\ (0\\le t\\le2\\pi)$ 直接算，结果通常与 $\\varepsilon$ 无关。\n例题：$L$ 为逆时针包围原点的闭曲线，求 $\\oint_L\\frac{y\\,dx-x\\,dy}{x^2+y^2}$。奇点 $(0,0)$ 在 $D$ 内，小圆上 $y\\,dx-x\\,dy=-\\varepsilon^2dt$、分母 $=\\varepsilon^2$，故原式 $=\\int_0^{2\\pi}\\frac{-\\varepsilon^2}{\\varepsilon^2}dt=-2\\pi$。\n若奇点不在 $D$ 内：直接套格林公式，不必挖洞。\n口诀：「奇点在域内，必挖小圆洞；洞边取负向，二重积分为零；原积分改算小圆逆时针」。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_b18_12',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'integral_type',
    sectionName: '多元积分·类型判别',
    title: '基础18-12 第一类还是第二类积分',
    content: '很难判断是第一类还是第二类积分，类型不明就无法选方法——自述多元积分的最大困难。',
    mistakeType: '概念不清',
    importance: 5,
    correction: '三看判别：①看微元——$ds$、$dS$ 是第一类（对弧长/对面积，无方向、恒正）；$dx,dy,dz$、$dydz,dzdx,dxdy$、$\\vec F\\cdot d\\vec r$ 是第二类（对坐标，有方向、可正可负）。②看给不给方向——题面出现「逆时针/正向/上侧/下侧/外侧/后侧」必是第二类；只写「曲线 $L$」「曲面 $\\Sigma$」而不提方向的多是第一类。③看物理意义——求质量、长度、面积、形心、转动惯量走第一类；求功、流量、环流量走第二类。\n类型定了再选方法：第一类曲线→参数化 $ds=\\sqrt{x_t^2+y_t^2}\\,dt$（$x_t=dx/dt$）加对称性；第二类曲线→平面闭合用格林公式，或 $\\frac{\\partial Q}{\\partial x}=\\frac{\\partial P}{\\partial y}$ 时路径无关、改走折线；第一类曲面→投影 $dS=\\sqrt{1+z_x^2+z_y^2}\\,dxdy$ 加对称性；第二类曲面→封闭用高斯公式，空间闭曲线用斯托克斯，非封闭片用合一投影法。\n两类互化桥梁：$dxdy=\\cos\\gamma\\,dS$、$dydz=\\cos\\alpha\\,dS$、$dzdx=\\cos\\beta\\,dS$（$\\alpha,\\beta,\\gamma$ 为法向量方向角）。\n例题：$\\int_L(x^2+y^2)ds$ 是第一类（微元 $ds$）；$\\oint_L(x^2+y^2)dx+xy\\,dy$ 是第二类（微元 $dx,dy$ 且闭合给正向）。\n口诀：「见 $ds,dS$ 第一类，见 $dx,dy$ 第二类；给方向必第二类，算质量形心必第一类」。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_b18_13',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'surface_integral',
    sectionName: '曲面积分与几何应用',
    title: '基础18-13 高斯公式·侧的含义与补面法',
    content: '不知道「后侧」是什么意思；补面法知道怎么补，但补完后两部分各自怎么积分不清楚。',
    mistakeType: '概念不清',
    importance: 5,
    correction: '一、侧＝法向量的指向。封闭曲面：外侧指法向量朝区域外，内侧相反。平面片：$z=c$ 的圆盘上侧 $\\Leftrightarrow\\cos\\gamma>0$、下侧 $\\Leftrightarrow\\cos\\gamma<0$；$x=c$ 的平面片前侧 $\\Leftrightarrow\\cos\\alpha>0$（法向量指 $x$ 轴正向）、后侧 $\\Leftrightarrow\\cos\\alpha<0$（指 $x$ 轴负向）。落到积分上：取后侧就是给 $dydz$ 项整体加负号，因为 $dydz=\\cos\\alpha\\,dS<0$。\n二、补面法完整三步：①补——$\\Sigma$ 不封闭时补一片简单曲面 $\\Sigma_1$（常取平面区域），使 $\\Sigma+\\Sigma_1$ 封闭并围成 $\\Omega$；$\\Sigma_1$ 的方向要与 $\\Sigma$ 一致（同为外侧或同为上侧）。②用高斯——$\\iint_{\\Sigma+\\Sigma_1}(Pdydz+Qdzdx+Rdxdy)=\\iiint_\\Omega\\left(\\frac{\\partial P}{\\partial x}+\\frac{\\partial Q}{\\partial y}+\\frac{\\partial R}{\\partial z}\\right)dV$。③减——$\\iint_\\Sigma=\\iiint_\\Omega(\\cdots)dV-\\iint_{\\Sigma_1}$，补面片单独算。\n三、$\\Sigma_1$ 上怎么算：若 $\\Sigma_1$ 是 $z=c$ 平面片，则 $\\cos\\alpha=\\cos\\beta=0$，$dydz$、$dzdx$ 两项直接为 0，只剩 $\\iint_{\\Sigma_1}R\\,dxdy=\\pm\\iint_{D_{xy}}R(x,y,c)\\,dxdy$（上侧取 $+$、下侧取 $-$）。同理 $x=c$ 片只剩 $dydz$ 项、$y=c$ 片只剩 $dzdx$ 项。\n例题：$\\iint_\\Sigma z\\,dxdy$，$\\Sigma:z=\\sqrt{1-x^2-y^2}$ 取上侧。补 $\\Sigma_1:z=0,\\ x^2+y^2\\le1$ 取下侧（与上侧合成封闭外法向）。此处 $P=Q=0,\\ R=z$，$\\frac{\\partial R}{\\partial z}=1$，$\\iiint_\\Omega dV=\\frac{2\\pi}{3}$（上半球体积）；而 $\\iint_{\\Sigma_1}z\\,dxdy=0$（面上 $z=0$）。故原式 $=\\frac{2\\pi}{3}-0=\\frac{2\\pi}{3}$。\n口诀：「补面成闭用高斯，减去补面自己算；平面补面只剩垂直那一项，符号看侧不看天」。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'math_1000_b18_15',
    chapterId: 'ch_gaoshu',
    chapterName: '高数',
    sectionId: 'surface_integral',
    sectionName: '曲面积分与几何应用',
    title: '基础18-15 合一投影法（一投二代三换）',
    content: '又长又难的曲面积分题有畏惧感，很少算对，中间一步错步步错；合一投影法记不住。',
    mistakeType: '方法不熟',
    importance: 5,
    correction: '合一投影法：把 $\\iint_\\Sigma P\\,dydz+Q\\,dzdx+R\\,dxdy$ 的三项一次性化成同一个二重积分。设 $\\Sigma:z=z(x,y)$、$(x,y)\\in D_{xy}$，记 $z_x=\\frac{\\partial z}{\\partial x},\\ z_y=\\frac{\\partial z}{\\partial y}$，取上侧时$$\\iint_\\Sigma P\\,dydz+Q\\,dzdx+R\\,dxdy=\\iint_{D_{xy}}\\left(-Pz_x-Qz_y+R\\right)\\Big|_{z=z(x,y)}dxdy$$取下侧则整体乘 $-1$。\n三步：①一投——求投影域 $D_{xy}$ 并定侧（上/下）。②二代——把 $z=z(x,y)$ 代进 $P,Q,R$ 三个函数，统一到 $x,y$ 两个变量。③三换——$dydz\\to-z_x\\,dxdy$、$dzdx\\to-z_y\\,dxdy$、$dxdy\\to dxdy$。\n符号来源：上侧单位法向量 $\\vec n=(-z_x,-z_y,1)/\\sqrt{1+z_x^2+z_y^2}$，由 $dydz=\\cos\\alpha\\,dS$ 与 $dS\\cos\\gamma=dxdy$ 得 $dydz=\\frac{\\cos\\alpha}{\\cos\\gamma}dxdy=-z_x\\,dxdy$，同理 $dzdx=-z_y\\,dxdy$。\n例题：$\\iint_\\Sigma x\\,dydz+z\\,dxdy$，$\\Sigma:z=x^2+y^2\\ (0\\le z\\le1)$ 取下侧。$z_x=2x$、$D_{xy}:x^2+y^2\\le1$；括号内 $=-x\\cdot2x+z=-2x^2+(x^2+y^2)=-x^2+y^2$，下侧乘 $-1$ 得 $\\iint_{D_{xy}}(x^2-y^2)dxdy=0$（区域关于两轴对称，两项相消）。\n长题抗错法：一行只做一个动作（投→代→换→算二重积分），每步结果单独成行，回看时只查一步。\n口诀：「一投二代三换：投出 $D$、代进 $z$、换掉 $dydz$；上侧 $-z_x,-z_y,+1$，下侧全体翻号」。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_1000_xd4_11",
    chapterId: "ch_xiandai",
    chapterName: "线性代数",
    sectionId: "eigen",
    sectionName: "特征值与特征向量",
    title: "基础4-11 证明某数是特征值的三条路",
    content: "线代证明题一直是我的弱项。这题我已经看出来 A 有一个特征值是 3 了，但卡在这之后——不知道「看出特征值」之后合理的证明步骤该怎么往下写、写成什么形式才算证明完。",
    mistakeType: "思路缺失",
    importance: 4,
    correction: "知识点：证明「$\\lambda_0$ 是 $A$ 的特征值」只有三条路，按题目给的条件选：\n\n① 定义法（最硬）：找一个非零向量 $\\xi$ 使 $A\\xi=\\lambda_0\\xi$。适合 $A$ 以列向量或 $\\alpha\\beta^T$ 形式给出。\n② 特征多项式法：证 $|\\lambda_0E-A|=0$。适合 $A$ 的元素含参数、或给了行列式条件。\n③ 秩法：证 $R(\\lambda_0E-A)\\lt n$，即 $\\lambda_0E-A$ 不可逆。适合给了秩条件或 $A^2=kA$ 这类等式。\n\n「看出 $\\lambda=3$ 之后」的标准收尾三步：\n第一步 写出齐次组 $(3E-A)x=0$，并说明它有非零解（因为 $|3E-A|=0$ 或 $R(3E-A)\\lt n$）；\n第二步 求出基础解系 $\\xi$，明确写出 $\\xi\\ne0$；\n第三步 回代验证 $A\\xi=3\\xi$，一句「故 3 是 $A$ 的特征值，$\\xi$ 是属于它的特征向量」收尾。\n\n证明题的结尾必须落在定义式 $A\\xi=\\lambda\\xi$ 那一行。只说「特征值是 3」而不写 $\\xi$，扣分点就在这。\n\n例题（同类题，非原卷）：3 阶矩阵 $A$ 满足 $A^2=3A$ 且 $R(A)=2$，证明 3 是 $A$ 的特征值。\n\n解：由 $R(A)=2\\lt3$ 知 $Ax=0$ 有非零解，故 $A\\ne O$，存在 $x_0$ 使 $\\eta=Ax_0\\ne0$。\n对 $\\eta$ 作用 $A$：$A\\eta=A^2x_0=3Ax_0=3\\eta$，且 $\\eta\\ne0$。\n由定义，3 是 $A$ 的特征值，$\\eta$ 是它的一个特征向量。证毕。\n\n口诀：「证特征值三条路：凑向量、算行列式、看秩不够；收尾必写 $A\\xi=\\lambda\\xi$ 并且 $\\xi$ 非零」。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_1000_xd4_13",
    chapterId: "ch_xiandai",
    chapterName: "线性代数",
    sectionId: "subspace",
    sectionName: "列空间与解空间",
    title: "基础4-13 四个子空间的本质与隐含条件提取",
    content: "对列空间、解空间这些线性代数的本质不清楚，看到题目提取不出隐含条件，只能干瞪眼。图片右侧那几个知识点我已经让背诵手册补上了。",
    mistakeType: "概念混淆",
    importance: 4,
    correction: "知识点：四个空间的一句话本质（设 $A$ 为 $m\\times n$，$R(A)=r$）：\n\n① 列空间 $C(A)=\\{Ax\\mid x\\in R^n\\}\\subset R^m$——就是「$A$ 的列向量的一切线性组合」，维数 $=r$。$Ax=b$ 有解 $\\iff b\\in C(A)$。\n② 行空间 $C(A^T)\\subset R^n$——$A$ 的行向量的线性组合，维数也 $=r$。行空间与列空间维数相同，这就是「秩」的统一含义。\n③ 解空间（零空间）$N(A)=\\{x\\mid Ax=0\\}\\subset R^n$——维数 $=n-r$，基就是基础解系。\n④ 左零空间 $N(A^T)=\\{y\\mid A^Ty=0\\}\\subset R^m$——维数 $=m-r$。\n\n秩-零化度定理：$\\dim C(A^T)+\\dim N(A)=r+(n-r)=n$。\n\n隐含条件的提取套路（题目给什么、你想什么）：\n\n- 「$Ax=b$ 有解 / 无解」⟹ $b$ 能否被 $A$ 的列线性表示 ⟹ 比较 $R(A)$ 与 $R(A\\mid b)$。\n- 「$Ax=0$ 与 $Bx=0$ 同解」⟹ $N(A)=N(B)$ ⟹ $R(A)=R(B)$ 且行向量组等价（可互相线性表示）。\n- 「$A$ 的列向量线性无关」⟹ $C(A)$ 维数 $=n$ ⟹ $R(A)=n$ ⟹ $Ax=0$ 只有零解。\n- 「$\\xi$ 是 $Ax=0$ 的解」⟹ $\\xi$ 与 $A$ 的每一个行向量都正交 ⟹ $\\xi\\perp$ 行空间。这一条最常用也最容易漏。\n- 「$\\eta_1,\\eta_2$ 都是 $Ax=b$ 的解」⟹ $\\eta_1-\\eta_2\\in N(A)$，是齐次解。\n\n例题（同类题，非原卷）：$A$ 为 $4\\times3$ 矩阵，$R(A)=2$，$\\eta_1=(1,0,1)^T$、$\\eta_2=(0,1,1)^T$ 是 $Ax=b$（$b\\ne0$）的两个解。求通解。\n\n解：解空间维数 $=n-r=3-2=1$，一个非零齐次解即为基础解系。\n$\\eta_1-\\eta_2=(1,-1,0)^T$ 是 $Ax=0$ 的非零解，故它就是基础解系。\n通解 $x=(1,0,1)^T+k(1,-1,0)^T$，$k$ 任意。\n\n口诀：「列空间装得下 $b$ 才有解；解空间维数是 $n$ 减 $r$；齐次解与行向量正交；两个特解相减就是齐次解」。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_1000_xd5_4",
    chapterId: "ch_xiandai",
    chapterName: "线性代数",
    sectionId: "eigen",
    sectionName: "特征值与特征向量",
    title: "基础5-4 特征值定义的四条边界",
    content: "概念定义不清，这种题我老是错，当时选成了 C。根子在没抓住「特征向量必须非零」和「特征值是数、特征向量是向量」这两条定义边界。",
    mistakeType: "概念混淆",
    importance: 4,
    correction: "知识点：定义 $A\\xi=\\lambda\\xi$（$\\xi\\ne0$）里被反复考的四个边界：\n\n① $\\xi$ 必须非零。零向量满足 $A\\cdot0=\\lambda\\cdot0$ 对任何 $\\lambda$ 都成立，所以定义里排除它——「$\\lambda$ 是特征值」的前提是存在非零 $\\xi$。\n② $\\lambda$ 可以为 0。$A\\xi=0$ 且 $\\xi\\ne0$ ⟹ 0 是特征值 $\\iff A$ 不可逆 $\\iff|A|=0$。\n③ 一个特征向量只属于一个特征值（若 $A\\xi=\\lambda_1\\xi=\\lambda_2\\xi$ 且 $\\xi\\ne0$，则 $\\lambda_1=\\lambda_2$）。反过来一个特征值有无穷多特征向量（整个特征子空间去掉零向量）。\n④ 特征向量的线性组合未必还是特征向量：属于同一特征值的非零组合才是；属于不同特征值的特征向量之和一定不是特征向量。\n\n选 C 这类错的常见诱因：把「$A$ 与 $B$ 有相同特征值」当成「$A$ 与 $B$ 相似」（不充分），或把「有相同特征向量」当成「$A=B$」。\n\n例题（同类题，非原卷）：$\\xi_1,\\xi_2$ 是 $A$ 属于不同特征值 $\\lambda_1\\ne\\lambda_2$ 的特征向量，问 $\\xi_1+\\xi_2$ 是否为 $A$ 的特征向量？\n\n解：不是。反设 $A(\\xi_1+\\xi_2)=\\mu(\\xi_1+\\xi_2)$。左边 $=\\lambda_1\\xi_1+\\lambda_2\\xi_2$，移项得 $(\\lambda_1-\\mu)\\xi_1+(\\lambda_2-\\mu)\\xi_2=0$。\n由「属于不同特征值的特征向量线性无关」得 $\\lambda_1-\\mu=\\lambda_2-\\mu=0$，即 $\\lambda_1=\\lambda_2$，与已知矛盾。\n\n口诀：「特征向量必非零，特征值可以是零；同值可加、异值不可加；特征值相同未必相似」。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_1000_xd5_5",
    chapterId: "ch_xiandai",
    chapterName: "线性代数",
    sectionId: "eigen",
    sectionName: "特征值与特征向量",
    title: "基础5-5 三阶特征多项式系数与迹验算",
    content: "公式没背熟，服了。特征多项式展开、迹与行列式和特征值的关系，考场上现推就来不及了。",
    mistakeType: "公式不清",
    importance: 4,
    correction: "知识点：三阶特征多项式必须能直接写出来。设 $A$ 为 3 阶：\n\n$$|\\lambda E-A|=\\lambda^3-(\\operatorname{tr}A)\\lambda^2+S_2\\lambda-|A|$$\n\n其中 $\\operatorname{tr}A=a_{11}+a_{22}+a_{33}=\\lambda_1+\\lambda_2+\\lambda_3$；$S_2=A_{11}+A_{22}+A_{33}$（三个主子式之和，即对角元的代数余子式之和）$=\\lambda_1\\lambda_2+\\lambda_1\\lambda_3+\\lambda_2\\lambda_3$；$|A|=\\lambda_1\\lambda_2\\lambda_3$。\n\n注意符号：$|\\lambda E-A|$ 与 $|A-\\lambda E|$ 差一个 $(-1)^n$，3 阶时互为相反数。用哪个都行，但系数符号会翻，选定一个背死。\n\n两条推论（秒杀选择题）：\n\n① $A$ 可逆 $\\iff$ 所有 $\\lambda_i\\ne0$；此时 $A^{-1}$ 的特征值是 $1/\\lambda_i$，$A^*$ 的特征值是 $|A|/\\lambda_i$。\n② $\\sum\\lambda_i=\\operatorname{tr}A$ 是最好的验算工具：算完三个特征值，加起来对一下迹，错了立刻知道。\n\n例题（同类题，非原卷）：$A=\\begin{pmatrix}2&1&0\\\\1&2&0\\\\0&0&1\\end{pmatrix}$，求特征值。\n\n解：分块结构，第三行第三列独立 ⟹ $\\lambda=1$ 是一个特征值，对应 $\\xi_3=(0,0,1)^T$。\n左上 2 阶块 $B=\\begin{pmatrix}2&1\\\\1&2\\end{pmatrix}$：$|\\lambda E-B|=(\\lambda-2)^2-1=\\lambda^2-4\\lambda+3=(\\lambda-1)(\\lambda-3)$，得 1 与 3。\n故 $\\lambda=1,1,3$。\n验算：$\\operatorname{tr}A=2+2+1=5=1+1+3$ ✓；$|A|=1\\times(4-1)=3=1\\times1\\times3$ ✓。\n\n口诀：「三次多项式：$\\lambda^3$ 减迹 $\\lambda^2$ 加主子式和 $\\lambda$ 减行列式；算完拿迹和行列式各验一遍」。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_1000_xd5_22",
    chapterId: "ch_xiandai",
    chapterName: "线性代数",
    sectionId: "rank_one",
    sectionName: "秩一矩阵",
    title: "基础5-22 秩一矩阵全套性质",
    content: "这类计算题我总是做不出来，性质定义还是掌握得不好。秩一矩阵是反复栽的地方，已经让背诵清单单独补一节。",
    mistakeType: "公式不清",
    importance: 5,
    correction: "知识点：秩一矩阵全套（$A$ 为 $n$ 阶，$R(A)=1$）：\n\n① 结构：$R(A)=1\\iff A=\\alpha\\beta^T$（$\\alpha,\\beta$ 为非零列向量）。$\\alpha$ 撑起列空间，$\\beta^T$ 决定各行的比例。\n② 幂：$A^2=(\\alpha\\beta^T)(\\alpha\\beta^T)=\\alpha(\\beta^T\\alpha)\\beta^T=(\\beta^T\\alpha)A$，而 $\\beta^T\\alpha$ 是一个数且恰等于 $\\operatorname{tr}A$，故\n\n$$A^k=(\\operatorname{tr}A)^{k-1}A,\\qquad \\operatorname{tr}A=\\beta^T\\alpha$$\n\n③ 特征值：$n$ 个特征值为 $\\operatorname{tr}A$ 与 $n-1$ 个 0（因 $R(A)=1$ ⟹ 0 的几何重数 $=n-1$）。\n④ 可对角化判据：$R(A)=1$ 时，$A$ 可对角化 $\\iff\\operatorname{tr}A\\ne0$（此时相似于 $\\operatorname{diag}(\\operatorname{tr}A,0,\\dots,0)$）。若 $\\operatorname{tr}A=0$ 则 $A^2=O$，是幂零阵，不可对角化。\n⑤ 行列式：$n\\ge2$ 时 $|A|=0$；而\n\n$$|A+kE|=k^{n-1}(k+\\operatorname{tr}A)$$\n\n这一条最常考——由特征值平移：$A+kE$ 的特征值是 $\\operatorname{tr}A+k$ 与 $n-1$ 个 $k$，全乘起来即得。\n⑥ 行列互换：$\\alpha\\beta^T$ 是 $n$ 阶阵，$\\beta^T\\alpha$ 是 1 阶（一个数）；$\\operatorname{tr}(\\alpha\\beta^T)=\\beta^T\\alpha$。\n\n例题（同类题，非原卷）：$\\alpha=(1,2,-1)^T$，$\\beta=(1,1,1)^T$，$A=\\alpha\\beta^T$。求 $A^{100}$ 与 $|A+2E|$。\n\n解：$A=\\begin{pmatrix}1&1&1\\\\2&2&2\\\\-1&-1&-1\\end{pmatrix}$，$R(A)=1$。\n$\\operatorname{tr}A=\\beta^T\\alpha=1+2-1=2$。\n$A^{100}=(\\operatorname{tr}A)^{99}A=2^{99}\\alpha\\beta^T$。\n$|A+2E|=2^{3-1}(2+2)=4\\times4=16$。\n验：$A+2E$ 的特征值是 $2+2=4$ 与两个 2，乘积 $4\\times2\\times2=16$ ✓。\n\n口诀：「秩一就是 $\\alpha\\beta$ 转置；平方等于迹乘自己，$k$ 次方是迹的 $k-1$ 次方乘 $A$；特征值一个迹、其余全是零；$|A+kE|$ 是 $k$ 的 $n-1$ 次方乘 $(k+\\text{迹})$」。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_1000_xd5_24",
    chapterId: "ch_xiandai",
    chapterName: "线性代数",
    sectionId: "spectral",
    sectionName: "谱分解",
    title: "基础5-24 谱分解的定义与三步法",
    content: "还是一样的问题，公式记不住、式子算不出来。谱分解我还不太会，已经让背诵讲义补充相关知识点和简单例题辅助记忆。",
    mistakeType: "公式不清",
    importance: 4,
    correction: "知识点：谱分解 = 把可对角化矩阵写成「特征值 × 投影块」的和。\n\n若 $P^{-1}AP=\\Lambda=\\operatorname{diag}(\\lambda_1,\\dots,\\lambda_n)$，$P=(\\xi_1,\\dots,\\xi_n)$，则\n\n$$A=P\\Lambda P^{-1}=\\lambda_1\\xi_1\\eta_1^T+\\lambda_2\\xi_2\\eta_2^T+\\cdots+\\lambda_n\\xi_n\\eta_n^T$$\n\n其中 $\\eta_i^T$ 是 $P^{-1}$ 的第 $i$ 行。每个 $\\xi_i\\eta_i^T$ 都是秩一矩阵，称为属于 $\\lambda_i$ 的投影块。\n\n实对称阵的特例（正交谱分解，最常考）：此时 $P$ 可取正交阵 $Q$，$Q^{-1}=Q^T$，于是\n\n$$A=\\lambda_1\\xi_1\\xi_1^T+\\lambda_2\\xi_2\\xi_2^T+\\cdots+\\lambda_n\\xi_n\\xi_n^T$$\n\n（$\\xi_i$ 为单位正交特征向量）。\n\n三步法：①求特征值 ②求特征向量并单位化（实对称时不同特征值的向量自动正交，只有同一特征值的多个向量才需施密特）③按 $\\lambda_i\\xi_i\\xi_i^T$ 逐项相加。\n\n快捷结论（背诵清单九.8 的来历）：若特征值是 $1,1,0$，则 $A=\\xi_1\\xi_1^T+\\xi_2\\xi_2^T+0\\cdot\\xi_3\\xi_3^T$。又因 $\\xi_1\\xi_1^T+\\xi_2\\xi_2^T+\\xi_3\\xi_3^T=QQ^T=E$，故 $A=E-\\xi_3\\xi_3^T$——「谁是 0，从 $E$ 里挖掉谁」。\n一般化：特征值 $a,a,b$ ⟹ $A=aE+(b-a)\\xi_3\\xi_3^T$（$\\xi_3$ 是 $b$ 的单位特征向量）。\n\n例题（同类题，非原卷）：$A$ 为 3 阶实对称阵，特征值 $2,2,-1$，$\\xi_3=(1,1,1)^T$ 是属于 $-1$ 的特征向量。求 $A$。\n\n解：单位化 $\\eta_3=\\frac1{\\sqrt3}(1,1,1)^T$，则\n\n$$\\eta_3\\eta_3^T=\\frac13\\begin{pmatrix}1&1&1\\\\1&1&1\\\\1&1&1\\end{pmatrix}$$\n\n$A=2E+(-1-2)\\eta_3\\eta_3^T=2E-\\begin{pmatrix}1&1&1\\\\1&1&1\\\\1&1&1\\end{pmatrix}=\\begin{pmatrix}1&-1&-1\\\\-1&1&-1\\\\-1&-1&1\\end{pmatrix}$。\n\n验算：$\\operatorname{tr}A=1+1+1=3=2+2-1$ ✓；每行和 $=-1$，即 $A(1,1,1)^T=(-1,-1,-1)^T=-1\\cdot(1,1,1)^T$ ✓。\n\n口诀：「谱分解＝特征值乘投影块求和；实对称就写 $\\lambda\\xi\\xi$ 转置；两同一异写成 $aE+(b-a)$ 挖掉那个」。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_1000_xd6_5",
    chapterId: "ch_xiandai",
    chapterName: "线性代数",
    sectionId: "eigen",
    sectionName: "特征值与特征向量",
    title: "基础6-5 负号只动特征值不动特征向量",
    content: "和 15 年的一道真题相似，还是不理解背后的几何原理——为什么加个负号不对特征向量产生变化，这类原理我一直没搞懂。",
    mistakeType: "概念混淆",
    importance: 4,
    correction: "知识点：$A\\xi=\\lambda\\xi$ ⟹ $(-A)\\xi=-\\lambda\\xi$。特征值变号，特征向量一个都不动。\n\n几何原理：特征向量是「$A$ 作用下方向不变的那条直线」（特征子空间）。$-A$ 的作用是先把向量沿该直线拉伸 $\\lambda$ 倍，再整体关于原点做中心对称。中心对称把一条过原点的直线映射到它自己，所以方向所在的直线没变，只是指向反了。而特征向量只认「方向所在的直线」，不认指向也不认长度——$\\xi$ 与 $-\\xi$ 是同一个特征子空间里的元素。\n\n由此得一整串「保留特征向量、只改特征值」的平移表：\n\n$$kA\\to k\\lambda,\\quad A+kE\\to\\lambda+k,\\quad A^k\\to\\lambda^k,\\quad A^{-1}\\to\\frac1\\lambda,\\quad A^*\\to\\frac{|A|}\\lambda,\\quad f(A)\\to f(\\lambda)$$\n\n唯一例外：$A^T$ 与 $A$ 特征值相同，但特征向量一般不同。\n\n二次型语境下的应用：$A$ 负定 $\\iff-A$ 正定 $\\iff A$ 的所有特征值 $\\lt0\\iff$ 负惯性指数 $=n$。所以判负定不必重算，把 $A$ 变号后按正定判即可（顺序主子式奇负偶正）。\n\n例题（同类题，非原卷）：3 阶实对称阵 $A$ 的特征值为 $1,-2,-2$。问 $A$ 与 $-A$ 的定性，以及特征向量是否改变。\n\n解：$A$ 一正两负 ⟹ 正惯性指数 $p=1$、负惯性指数 $q=2$，不定。\n$-A$ 的特征值为 $-1,2,2$ ⟹ $p=2$、$q=1$，同样不定。\n两者的特征向量完全相同（仍是那三条主轴方向），只是标准形系数整体变号：$f=y_1^2-2y_2^2-2y_3^2$ 变成 $-f=-y_1^2+2y_2^2+2y_3^2$。\n对照：若 $A$ 的特征值是 $-1,-2,-3$，则 $A$ 负定、$-A$ 正定，特征向量一字不差。\n\n口诀：「变号只动特征值、不动特征向量；负定就是负 $A$ 正定，标准形系数整体翻符号」。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_1000_xd6_6",
    chapterId: "ch_xiandai",
    chapterName: "线性代数",
    sectionId: "quadratic_form",
    sectionName: "二次型与正定矩阵",
    title: "基础6-6 二次型化标准形的三条路",
    content: "我对求解二次型和标准型的步骤又有些忘了，已经让背诵清单补充相应步骤和相关简单例题辅助记忆。",
    mistakeType: "方法不熟",
    importance: 5,
    correction: "知识点：化标准形三条路，题目要什么就走什么。\n\n【路一 · 正交变换法】题面出现「用正交变换」「求正交矩阵 $Q$」⟹ 必走这条，答案唯一（标准形系数就是特征值）。\n五步：①写出二次型矩阵 $A$（对角放平方项系数，非对角放交叉项系数的一半）②解 $|\\lambda E-A|=0$ 得特征值 ③求各特征值的特征向量 ④同一特征值的多个向量做施密特正交化，全部单位化（不同特征值的实对称特征向量自动正交，不用施密特）⑤按列拼 $Q$，则 $x=Qy$ 把 $f$ 化为 $\\lambda_1y_1^2+\\lambda_2y_2^2+\\lambda_3y_3^2$。\n\n【路二 · 配方法】题面说「用可逆变换」「用配方法」⟹ 走这条，快，但 $C$ 不正交。\n规则：有平方项就按某个 $x_i$ 配完全平方，把含 $x_i$ 的项全吃掉；一个平方项都没有时，先做可逆替换 $x_1=y_1+y_2,\\ x_2=y_1-y_2,\\ x_3=y_3$ 造出平方项再配。最后写出 $x=Cy$（$C$ 可逆）。\n\n【路三 · 初等矩阵合同变换】题面给「用合同变换」或要同时求 $C$ 使 $C^TAC=\\Lambda$ ⟹ 见基础6-18 那条。\n\n判据速查：正交变换 ⟹ $Q^TAQ=\\Lambda$ 且 $Q^T=Q^{-1}$；配方 ⟹ $C^TAC=\\Lambda$，$C$ 只要求可逆。两者得到的 $\\Lambda$ 对角元不一定相同，但正负个数（惯性指数）一定相同。\n\n例题（同类题，非原卷）：$f=2x_1x_2+2x_1x_3-6x_2x_3$，用配方法化标准形并写出变换。\n\n解：无平方项，先令 $x_1=y_1+y_2,\\ x_2=y_1-y_2,\\ x_3=y_3$。\n$2x_1x_2=2(y_1+y_2)(y_1-y_2)=2y_1^2-2y_2^2$；\n$2x_1x_3-6x_2x_3=2(y_1+y_2)y_3-6(y_1-y_2)y_3=-4y_1y_3+8y_2y_3$。\n故 $f=2y_1^2-2y_2^2-4y_1y_3+8y_2y_3$。\n配方：$2(y_1-y_3)^2=2y_1^2-4y_1y_3+2y_3^2$，$-2(y_2-2y_3)^2=-2y_2^2+8y_2y_3-8y_3^2$，两式相加比 $f$ 多了 $-6y_3^2$，故\n\n$$f=2(y_1-y_3)^2-2(y_2-2y_3)^2+6y_3^2$$\n\n令 $z_1=y_1-y_3,\\ z_2=y_2-2y_3,\\ z_3=y_3$，得标准形 $f=2z_1^2-2z_2^2+6z_3^2$，正惯性指数 $p=2$、负惯性指数 $q=1$。\n回代：$y_1=z_1+z_3,\\ y_2=z_2+2z_3,\\ y_3=z_3$，于是 $x_1=z_1+z_2+3z_3,\\ x_2=z_1-z_2-z_3,\\ x_3=z_3$，即\n\n$$C=\\begin{pmatrix}1&1&3\\\\1&-1&-1\\\\0&0&1\\end{pmatrix},\\quad |C|=-2\\ne0\\ \\checkmark$$\n\n口诀：「有平方项直接配，没平方项先换 $x_1=y_1+y_2,\\ x_2=y_1-y_2$；要正交矩阵就走特征值加施密特」。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_1000_xd6_7",
    chapterId: "ch_xiandai",
    chapterName: "线性代数",
    sectionId: "schmidt",
    sectionName: "施密特正交化",
    title: "基础6-7 什么时候可以免做施密特（叉乘替代）",
    content: "好题，综合题，但我做得又慢又错。解析中用到了一个「避免施密特正交化」的方法，我没看懂。",
    mistakeType: "方法不熟",
    importance: 4,
    correction: "知识点：什么时候可以不做施密特？三条免做信号：\n\n① 不同特征值的特征向量自动正交（实对称阵）。所以若 $\\lambda_1,\\lambda_2,\\lambda_3$ 互不相同，求出三个特征向量后直接单位化就能拼 $Q$，完全不用施密特——这是最常见的「避免」场景，也最容易被漏掉。\n② 只有当同一个特征值的特征子空间维数 $\\ge2$（需要从里面取两个以上向量）时，才对这一组内部做施密特。二重特征值只用一个向量时不必。\n③ 题目只要「可逆变换」不要「正交变换」时，根本不需要正交化，配方法更快。\n\n替代技巧（解析里那种）：三维情形下，若已知两个线性无关向量 $\\xi_1,\\xi_2$，要求一个与它们都正交的方向，直接用叉积\n\n$$\\xi_1\\times\\xi_2=\\begin{vmatrix}i&j&k\\\\a_1&a_2&a_3\\\\b_1&b_2&b_3\\end{vmatrix}$$\n\n结果自动与两者正交，省掉施密特的两步投影与两次分数运算。实对称阵里这一招尤其好用：已知属于 $\\lambda_1$ 的 $\\xi_1$ 与属于 $\\lambda_3$ 的 $\\xi_3$，则属于第三个特征值的方向必与两者正交，叉乘即得。\n\n例题（同类题，非原卷）：3 阶实对称阵 $A$，$\\lambda=1$（二重）的两个线性无关特征向量 $\\xi_1=(1,1,0)^T$、$\\xi_2=(1,0,1)^T$，$\\lambda_3=-2$。求属于 $-2$ 的单位特征向量。\n\n解：$-2$ 与 $1$ 不同 ⟹ $\\xi_3$ 自动与 $\\xi_1,\\xi_2$ 都正交 ⟹ 直接叉乘：\n$\\xi_1\\times\\xi_2=(1\\cdot1-0\\cdot0,\\ 0\\cdot1-1\\cdot1,\\ 1\\cdot0-1\\cdot1)=(1,-1,-1)^T$。\n验：$\\xi_3\\cdot\\xi_1=1-1+0=0$ ✓，$\\xi_3\\cdot\\xi_2=1+0-1=0$ ✓。\n单位化 $\\eta_3=\\frac1{\\sqrt3}(1,-1,-1)^T$。全程没做施密特。\n\n对照：若题目要求的是「$\\lambda=1$ 的两个正交特征向量」，则 $\\xi_1$ 与 $\\xi_2$ 属同一特征值且 $\\xi_1\\cdot\\xi_2=1\\ne0$，此时必须施密特，叉乘帮不上忙。\n\n口诀：「不同特征值免施密特，直接单位化；同值多个才正交化；三维求正交方向直接叉乘」。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_1000_xd6_11",
    chapterId: "ch_xiandai",
    chapterName: "线性代数",
    sectionId: "quadratic_form",
    sectionName: "二次型与正定矩阵",
    title: "基础6-11 二次型六组等价关系（正定/合同/相似）",
    content: "相关性质不熟，忘得差不多了，已经让背诵讲义补充。",
    mistakeType: "概念混淆",
    importance: 4,
    correction: "知识点：二次型与实对称阵的六组等价关系，背成一张表。设 $f=x^TAx$，$A$ 实对称，$n$ 元。\n\n① 正定的六个等价：$f$ 正定 $\\iff A$ 的所有特征值 $\\gt0\\iff$ 正惯性指数 $p=n\\iff A$ 的顺序主子式全 $\\gt0\\iff$ 存在可逆 $C$ 使 $A=C^TC\\iff A$ 与 $E$ 合同。\n② 负定：$f$ 负定 $\\iff-A$ 正定 $\\iff$ 所有特征值 $\\lt0\\iff p=0\\iff$ 顺序主子式奇数阶 $\\lt0$、偶数阶 $\\gt0$（符号交替）。\n③ 合同的判据：$A$ 与 $B$ 合同 $\\iff$ 存在可逆 $C$ 使 $C^TAC=B\\iff$ 两者正惯性指数 $p$ 与负惯性指数 $q$ 分别相同（惯性定理，实对称阵的充要条件）。\n④ 合同 / 相似 / 等价的强弱：相似 ⟹ 等价；合同 ⟹ 等价；相似与合同互不蕴含。但实对称阵是特例：两个实对称阵相似 $\\iff$ 它们合同 $\\iff$ 特征值集合（含重数）相同。\n⑤ 秩与惯性指数：$r(A)=p+q$；符号差 $s=p-q$。标准形里非零系数的个数就是秩。\n⑥ 可逆线性变换不改变正定性、不改变秩、不改变惯性指数，但会改变特征值（正交变换除外）。正交变换是唯一同时保持相似与合同的变换。\n\n例题（同类题，非原卷）：$A=\\begin{pmatrix}1&2\\\\2&a\\end{pmatrix}$。问 $a$ 取何值时 $A$ 正定？此时 $A$ 与 $E$ 合同吗？\n\n解：顺序主子式 $\\Delta_1=1\\gt0$；$\\Delta_2=|A|=a-4\\gt0$ ⟹ $a\\gt4$。\n此时两个特征值都为正，$p=2=n$、$q=0$，与 $E$ 的 $(p,q)=(2,0)$ 相同 ⟹ 合同（正定阵必与 $E$ 合同）。\n若 $a=4$，$|A|=0$，$r=1$，$(p,q)=(1,0)$，秩与 $E$ 不同 ⟹ 不合同。\n若 $a=3$，$\\Delta_2=-1\\lt0$，$p=q=1$，不定。\n\n口诀：「正定看主子式全正或特征值全正；负定符号奇负偶正；合同只比正负惯性指数；实对称里相似与合同是一回事」。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_1000_xd6_12",
    chapterId: "ch_xiandai",
    chapterName: "线性代数",
    sectionId: "quadratic_form",
    sectionName: "二次型与正定矩阵",
    title: "基础6-12 二次型整章考点地图（补盲区）",
    content: "不知道题目左下角那个知识点，完全做不出来。二次型是我一大弱点，已经让背诵清单补充相关内容。",
    mistakeType: "概念混淆",
    importance: 5,
    correction: "知识点：把二次型整章的考点列成一张地图，考场看到陌生问法先对号入座，盲区就藏在里面。\n\nA. 表示层：$f=x^TAx$，$A$ 必须取对称（交叉项系数对半分）。二次型的秩 $=R(A)$。两个二次型相同 $\\iff$ 矩阵相同。\nB. 标准化层：标准形（只有平方项，系数不唯一）→ 规范形（系数只有 $1,-1,0$，由 $(p,q)$ 唯一决定）。规范形是合同分类的完全不变量。\nC. 变换层：正交变换（$Q^T=Q^{-1}$，系数 $=$ 特征值）/ 可逆变换（配方法，系数不定但 $p,q$ 定）/ 合同变换（成对初等变换）。\nD. 判定层：正定（全 $\\gt0$）、负定（全 $\\lt0$）、半正定（全 $\\ge0$ 且至少一个 $=0$，即 $p=r\\lt n$）、不定（$p,q$ 均 $\\ge1$）。\nE. 常考的隐含结论（最容易成为「左下角那个知识点」）：\n\n- $A$ 正定 ⟹ $A^{-1},A^*,A^k,A^T$ 都正定；$kA$（$k\\gt0$）正定。\n- $A,B$ 都正定 ⟹ $A+B$ 正定；但 $AB$ 未必对称，故未必正定。\n- $A$ 正定 ⟺ 存在可逆 $C$ 使 $A=C^TC$ ⟺ $A$ 与 $E$ 合同。\n- $A$ 正定 ⟹ $a_{ii}\\gt0$、$|A|\\gt0$、$\\operatorname{tr}A\\gt0$（反之都不成立）。\n- 半正定不能用「顺序主子式 $\\ge0$」判：反例 $\\operatorname{diag}(0,-1)$ 顺序主子式为 $0$ 与 $0$，却不是半正定。要用所有主子式 $\\ge0$，或直接看特征值 $\\ge0$。\n- $f$ 正定 ⟹ $A$ 可逆 ⟹ $x^TAx=0$ 只有零解。\n\nF. 与其他章的接口：实对称阵必可正交对角化 ⟹ 二次型章的题往往披着「求正交矩阵 $Q$」的皮在考特征值；$A$ 与 $B$ 合同且 $A$ 可逆 ⟹ $B$ 可逆。\n\n例题（同类题，非原卷）：$A$ 为 3 阶正定矩阵，判断 $A^2$、$A^*$、$A-2E$、$A^TA$ 是否正定。\n\n解：设 $A$ 的特征值 $\\lambda_1,\\lambda_2,\\lambda_3$ 全 $\\gt0$。\n$A^2$：特征值 $\\lambda_i^2\\gt0$ ⟹ 正定 ✓。\n$A^*$：特征值 $|A|/\\lambda_i$，而 $|A|=\\lambda_1\\lambda_2\\lambda_3\\gt0$ ⟹ 全 $\\gt0$ ⟹ 正定 ✓。\n$A-2E$：特征值 $\\lambda_i-2$，若 $\\lambda_1=1$ 则为 $-1\\lt0$ ⟹ 不一定正定 ✗。\n$A^TA$：$A$ 对称 ⟹ $A^TA=A^2$，正定 ✓。（即使 $A$ 不对称，$A^TA$ 也总是半正定，$A$ 可逆时正定。）\n\n口诀：「正定阵的平方、伴随、转置、逆都正定，加减常数说不准；半正定别拿顺序主子式判」。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_1000_xd6_16",
    chapterId: "ch_xiandai",
    chapterName: "线性代数",
    sectionId: "quadratic_form",
    sectionName: "二次型与正定矩阵",
    title: "基础6-16 算完特征值后题目后半句在问什么",
    content: "特征值我都算出来了，但不知道题目后半句话在问我啥，不知道是啥意思，白算一场。",
    mistakeType: "审题失误",
    importance: 4,
    correction: "知识点：二次型题算完特征值之后，后半句通常只在问这五件事之一。看到关键词就翻译成动作：\n\n① 「求 $a$ 的取值范围使 $f$ 正定 / 负定」⟹ 把特征值写成含 $a$ 的式子令全 $\\gt0$（或全 $\\lt0$），或用顺序主子式。两者等价，主子式法通常更快、不必解三次方程。\n② 「写出 $f$ 的标准形 / 规范形」⟹ 标准形 $=$ 特征值当系数（正交变换下）；规范形 $=$ 只留符号，$p$ 个 $1$、$q$ 个 $-1$、其余 $0$。先看清问的是哪个词。\n③ 「$A$ 与 $B$ 是否合同 / 相似」⟹ 合同比 $(p,q)$；相似比特征值集合（含重数）。实对称阵时两者等价。\n④ 「求正交矩阵 $Q$ 使 $Q^TAQ=\\Lambda$」⟹ 特征向量单位化 + 同值施密特 + 按 $\\Lambda$ 中特征值的顺序排列 $Q$ 的列（顺序必须与对角元一一对应）。\n⑤ 「求 $A^k$」或「求 $f$ 在 $\\|x\\|=1$ 上的最大值」⟹ 前者用 $P\\Lambda^kP^{-1}$；后者答案就是最大特征值 $\\lambda_{\\max}$，在对应的单位特征向量处取到。这一条最容易被当成「没问什么」而漏掉。\n\n审题落地动作：算完特征值后，把后半句里的名词圈出来（正定？标准形？合同？$Q$？最大值？），再回上面五条对号。不要凭「感觉答完了」就交卷。\n\n例题（同类题，非原卷）：$f=x_1^2+x_2^2+5x_3^2+2tx_1x_2-2x_1x_3+4x_2x_3$，问 $t$ 取何值时 $f$ 正定。\n\n解：后半句问的是「正定」⟹ 走判据①，用顺序主子式，不必真解特征值。\n$A=\\begin{pmatrix}1&t&-1\\\\t&1&2\\\\-1&2&5\\end{pmatrix}$。\n$\\Delta_1=1\\gt0$；$\\Delta_2=1-t^2\\gt0$ ⟹ $-1\\lt t\\lt1$；\n$\\Delta_3=|A|=1\\cdot(5-4)-t\\cdot(5t+2)+(-1)\\cdot(2t+1)=1-5t^2-2t-2t-1=-5t^2-4t\\gt0$ ⟹ $5t^2+4t\\lt0$ ⟹ $-\\frac45\\lt t\\lt0$。\n三者取交集：$-\\frac45\\lt t\\lt0$。\n\n口诀：「算完特征值先圈后半句的名词：正定解不等式、标准形抄系数、合同比 $p q$、要 $Q$ 就单位化排序、最大值就是 $\\lambda_{\\max}$」。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_1000_xd6_17",
    chapterId: "ch_xiandai",
    chapterName: "线性代数",
    sectionId: "quadratic_form",
    sectionName: "二次型与正定矩阵",
    title: "基础6-17 由等式反推秩与惯性指数（秩不等于正惯性指数）",
    content: "没想到题目给的信息暗示秩为 2，我以为特征值是两个为正、一个为 0，方向完全搞反了。",
    mistakeType: "概念混淆",
    importance: 4,
    correction: "知识点：从题设条件反推秩与惯性指数的五条链，看到就要条件反射：\n\n① $|A|=0$ ⟹ 至少一个特征值为 0 ⟹ $r\\lt n$，但 $r$ 具体多少要看更多信息。\n② $A^2=A$（幂等）⟹ $\\lambda^2=\\lambda$ ⟹ $\\lambda\\in\\{0,1\\}$ ⟹ $R(A)=\\operatorname{tr}(A)=1$ 的个数 $=p$，且 $A$ 半正定。\n③ $A^2=E$（对合）⟹ $\\lambda\\in\\{\\pm1\\}$ ⟹ $R(A)=n$，$p+q=n$，$\\operatorname{tr}(A)=p-q$。\n④ $A^2=O$（幂零）⟹ 特征值全 0 ⟹ $R(A)\\le n/2$，且 $A\\ne O$ 时不可对角化。\n⑤ $A^2=kA$（$k\\ne0$）⟹ $\\lambda\\in\\{0,k\\}$ ⟹ 非零特征值个数 $=R(A)$（实对称可对角化时），$\\operatorname{tr}(A)=k\\cdot R(A)$。\n⑥ $AB=O$ ⟹ $R(A)+R(B)\\le n$。\n\n关键区分（这次栽的地方）：「$R(A)=2$」与「特征值两正一零」不是一回事。$r=2$ 只说明 0 的几何重数是 1，即恰好一个特征值为 0，另两个非零，但它们的符号不定——可以两正、两负、或一正一负。所以由 $r=2$ 推不出正惯性指数。\n反过来，只有已知 $p=2,q=0$ 才叫「两正一零」，此时 $A$ 半正定。题目若只给 $r=2$：问「是否正定」答「不一定」，问「标准形有几个非零项」答 2。\n\n补充：实对称阵可对角化，故 $R(A)=$ 非零特征值的个数（计重数），$r=p+q$。知道 $r$ 与 $\\operatorname{tr}(A)$ 的符号常常就能定出 $(p,q)$。\n\n例题（同类题，非原卷）：3 阶实对称阵 $A$ 满足 $A^2=A$，$\\operatorname{tr}(A)=2$。求 $R(A)$、$(p,q)$ 与规范形。\n\n解：$A^2=A$ ⟹ $\\lambda\\in\\{0,1\\}$。$\\operatorname{tr}(A)=2$ ⟹ 两个 1、一个 0。\n故 $R(A)=2$，$p=2$、$q=0$，$A$ 半正定（不正定，因为有 0）。\n标准形 $f=y_1^2+y_2^2$，规范形同为 $f=z_1^2+z_2^2$。\n对照：若条件改成只给 $R(A)=2$ 而不给 $A^2=A$，则 $(p,q)$ 可能是 $(2,0)$、$(1,1)$，无法确定。\n\n口诀：「幂等特征值 0 和 1、秩就等于迹；对合特征值正负 1、秩是满的；秩只告诉你有几个非零，不告诉你几个正」。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_1000_xd6_18",
    chapterId: "ch_xiandai",
    chapterName: "线性代数",
    sectionId: "quadratic_form",
    sectionName: "二次型与正定矩阵",
    title: "基础6-18 初等矩阵合同变换法（(A|E) 操作法）",
    content: "没想到用初等矩阵来做，我一开始就往特征值方向硬算，绕了很远还没算对。",
    mistakeType: "方法不熟",
    importance: 4,
    correction: "知识点：合同变换法（初等矩阵法）的完整机制。\n\n原理：一次初等行变换 $=$ 左乘初等矩阵 $P$；同类型的一次初等列变换 $=$ 右乘 $P^T$。所以「对 $A$ 做一次列变换，紧接着做转置对应的行变换」$=$ 计算 $P^TAP$，这正是合同变换。连做若干次得 $C^TAC=\\Lambda$。\n\n操作法（最实用）：构造左右分块矩阵 $(A\\mid E)$，规则是\n\n- 对 $A$ 施行一次列初等变换，同时对 $E$ 施行同一次列变换；\n- 再对 $A$ 施行转置对应的行变换（$E$ 那一半不动）。\n\n当 $A$ 化为对角阵 $\\Lambda$ 时，$E$ 那一半化成的就是 $C$，满足 $C^TAC=\\Lambda$，可逆线性变换为 $x=Cy$。\n\n三种初等矩阵：$P(i,j)$ 交换、$P(i(k))$ 第 $i$ 行乘 $k$（$k\\ne0$）、$P(ij(k))$ 第 $j$ 行的 $k$ 倍加到第 $i$ 行；它们的转置就是对应的列变换矩阵。\n\n识别信号：题面出现「用合同变换」「求可逆矩阵 $C$ 使 $C^TAC=\\Lambda$」「不求特征值」⟹ 走这条；若出现「正交矩阵 $Q$」⟹ 必须走特征值，不能用合同变换（$C$ 一般不正交）。\n优点：全程只做算术，不解特征多项式，避免三次方程求根。缺点：标准形系数不是特征值（但正负个数一致）。\n\n例题（同类题，非原卷）：$A=\\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}$，用合同变换求可逆 $C$ 使 $C^TAC$ 为对角阵。\n\n解：$(A\\mid E)=\\left(\\begin{array}{cc|cc}0&1&1&0\\\\1&0&0&1\\end{array}\\right)$。\n第一步 列变换「第 2 列加到第 1 列」，$E$ 同做；再行变换「第 2 行加到第 1 行」，$E$ 不动：\n$A\\to\\begin{pmatrix}1&1\\\\1&0\\end{pmatrix}\\to\\begin{pmatrix}2&1\\\\1&0\\end{pmatrix}$，$E\\to\\begin{pmatrix}1&0\\\\1&1\\end{pmatrix}$。\n第二步 列变换「第 1 列的 $-\\frac12$ 倍加到第 2 列」，$E$ 同做；再行变换「第 1 行的 $-\\frac12$ 倍加到第 2 行」：\n$A\\to\\begin{pmatrix}2&0\\\\1&-\\frac12\\end{pmatrix}\\to\\begin{pmatrix}2&0\\\\0&-\\frac12\\end{pmatrix}$，$E\\to\\begin{pmatrix}1&-\\frac12\\\\1&\\frac12\\end{pmatrix}=C$。\n验：$|C|=\\frac12+\\frac12=1\\ne0$ ✓；$C^TA=\\begin{pmatrix}1&1\\\\-\\frac12&\\frac12\\end{pmatrix}\\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}=\\begin{pmatrix}1&1\\\\\\frac12&-\\frac12\\end{pmatrix}$，再乘 $C$ 得 $\\begin{pmatrix}2&0\\\\0&-\\frac12\\end{pmatrix}$ ✓。\n$p=1,q=1$，与 $A$ 的特征值 $\\pm1$ 符号一致。\n\n口诀：「$(A\\mid E)$ 里 $A$ 行列都做、$E$ 只做列；$A$ 成对角时 $E$ 就是 $C$；要正交矩阵别用这招」。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_1000_xd6_19",
    chapterId: "ch_xiandai",
    chapterName: "线性代数",
    sectionId: "quadratic_form",
    sectionName: "二次型与正定矩阵",
    title: "基础6-19 二次型的几何本体：换一个只做伸缩的坐标系",
    content: "还是二次型背后的原理不太懂。我会套步骤，但不知道为什么这么套，所以步骤一变形就崩。",
    mistakeType: "概念混淆",
    importance: 5,
    correction: "知识点：二次型的全部原理其实只有一句话——**找一个更好的坐标系，让这个变换在新坐标系下只做伸缩、不做旋转**。\n\n① 几何本体：$f=x^TAx$ 在二维画出来是一族等值线（椭圆 / 双曲线 / 一对直线）。椭圆的轴一般不与 $x_1,x_2$ 轴重合，是歪的。「化标准形」就是把坐标轴旋到椭圆的轴上去，歪着的交叉项 $x_1x_2$ 随之消失。\n② 为什么用正交变换：旋转不改变图形的形状与大小，所以正交变换（$Q^T=Q^{-1}$）化出的系数是**几何上真实的量**——就是特征值，也是椭球半轴长度的决定因素。而配方法做的是一般可逆的「拉伸 + 剪切」，图形被拉变形了，系数不再是特征值，但正负号个数（惯性指数）不变，因为拉伸不会把椭圆变成双曲线。\n③ 特征向量为什么是主轴方向：$A\\xi=\\lambda\\xi$ 的意思是「$\\xi$ 这个方向经 $A$ 作用后还落在自己身上」，即这个方向不被旋转。不被旋转的方向 $=$ 椭圆的轴 $=$ 主轴。这就是「特征向量 $=$ 曲面主轴方向」的来历。\n④ 惯性定理为什么成立：$p$ 与 $q$ 是图形的拓扑属性（有几个方向是封闭的、几个是开放的），任何可逆线性变换都是连续可逆的形变，改变不了这个数。所以标准形不唯一、规范形唯一。\n⑤ 正定为什么等价于「顺序主子式全 $\\gt0$」：正定 $=$ 图形是椭球 $=$ 任何低维截面还是椭球 $=$ 任何主子阵仍正定 $=$ 各阶行列式 $\\gt0$。\n⑥ 秩为什么是 $p+q$：秩 $=$ 标准形里非零系数的个数 $=$ 图形真正「活着」的维数；系数为 0 的方向是被压扁的退化方向。\n\n一句话总纲：二次型章 $=$ 用坐标变换把歪的图形摆正。正交变换是旋转（保形，系数是特征值），可逆变换是拉伸（不保形，系数不定但符号定）。\n\n例题（同类题，非原卷）：$f=5x_1^2+5x_2^2+8x_1x_2$。说出等值线形状、主轴方向与标准形。\n\n解：$A=\\begin{pmatrix}5&4\\\\4&5\\end{pmatrix}$（交叉项 8 对半分成 4 和 4）。\n$|\\lambda E-A|=(\\lambda-5)^2-16=0$ ⟹ $\\lambda=9,1$。\n$\\lambda=9$：$(A-9E)x=0$ 即 $\\begin{pmatrix}-4&4\\\\4&-4\\end{pmatrix}x=0$ ⟹ $\\xi_1=(1,1)^T$；\n$\\lambda=1$：$\\begin{pmatrix}4&4\\\\4&4\\end{pmatrix}x=0$ ⟹ $\\xi_2=(1,-1)^T$。\n两者已正交（不同特征值），单位化后 $Q$ 就是一个旋转 $45^\\circ$ 的矩阵。\n标准形 $f=9y_1^2+y_2^2$。等值线 $f=c$（$c\\gt0$）是椭圆，短轴沿 $(1,1)$ 方向（系数 9 大、更陡），长轴沿 $(1,-1)$ 方向（系数 1 小、更平）。\n两个特征值都正 ⟹ 正定 ⟹ 封闭椭圆，与几何图像自洽。\n\n口诀：「二次型就是摆正歪图形；正交变换是旋转、系数就是特征值；配方是拉伸、只保符号不保数值；特征向量指的方向就是不被转的方向」。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_1000_xd6_21",
    chapterId: "ch_xiandai",
    chapterName: "线性代数",
    sectionId: "quadratic_form",
    sectionName: "二次型与正定矩阵",
    title: "基础6-21 二次型结论清单（按条件→结论组织）",
    content: "已经让背诵讲义补充题目右侧那几条结论。二次型还是难，难在结论太多、彼此像，一到考场就抓不准该用哪条。",
    mistakeType: "公式不清",
    importance: 5,
    correction: "知识点：二次型章的结论清单，按「看到什么条件、得到什么结论」组织，考场直接查。\n\n【由 $A$ 的性质推】\n- $A$ 实对称 ⟹ 必可正交对角化 ⟹ 必与对角阵合同 ⟹ 二次型必有标准形。\n- $A$ 正定 ⟹ $|A|\\gt0$、$a_{ii}\\gt0$、$\\operatorname{tr}A\\gt0$、$A$ 可逆、$A^{-1}/A^*/A^k/A^T$ 正定、$A=C^TC$（$C$ 可逆）、$A$ 与 $E$ 合同、$A$ 的任意主子阵正定。\n- $A,B$ 都正定 ⟹ $A+B$ 正定；$AB$ 未必对称，故未必正定。\n\n【由等式推】\n- $A^2=A$ ⟹ $\\lambda\\in\\{0,1\\}$ ⟹ $r=\\operatorname{tr}(A)$ ⟹ 半正定。\n- $A^2=E$ ⟹ $\\lambda\\in\\{\\pm1\\}$ ⟹ $r=n$ ⟹ $A$ 可逆。\n- $A^2=O$ ⟹ $\\lambda$ 全 0 ⟹ $r\\le n/2$ ⟹ $A\\ne O$ 时不可对角化。\n- $A^2=kA$（$k\\ne0$）⟹ $\\lambda\\in\\{0,k\\}$ ⟹ 非零特征值个数 $=r$ ⟹ $\\operatorname{tr}(A)=kr$。\n- $AB=O$ ⟹ $r(A)+r(B)\\le n$ ⟹ $B$ 的每一列都是 $Ax=0$ 的解。\n- $A=\\alpha\\beta^T$ ⟹ $r=1$ ⟹ $\\lambda=\\operatorname{tr}A$ 与 $n-1$ 个 0 ⟹ $A^2=(\\operatorname{tr}A)A$。\n\n【由数量关系推】\n- $r(A)=p+q$；符号差 $=p-q$；规范形由 $(p,q)$ 唯一决定。\n- $A$ 与 $B$ 合同 $\\iff p,q$ 分别相同（实对称）；$A$ 与 $B$ 相似 $\\iff$ 特征值集合相同（可对角化时）。\n- 实对称阵：相似 $\\iff$ 合同 $\\iff$ 特征值相同。正交变换既是相似又是合同：$Q^TAQ=Q^{-1}AQ$。\n\n【由参数推（求取值范围类）】\n- $f$ 正定 $\\iff$ 所有特征值 $\\gt0\\iff$ 顺序主子式全 $\\gt0$。\n- $f$ 负定 $\\iff$ 顺序主子式奇负偶正。\n- $f$ 半正定 $\\iff$ 所有特征值 $\\ge0$（不能用顺序主子式 $\\ge0$ 判，反例 $\\operatorname{diag}(0,-1)$）。\n\n例题（同类题，非原卷）：3 阶实对称阵 $A$ 满足 $A^2=3A$，$R(A)=2$。判断 $A$ 是否正定并写出规范形。\n\n解：$A^2=3A$ ⟹ $\\lambda^2=3\\lambda$ ⟹ $\\lambda\\in\\{0,3\\}$。$R(A)=2$ ⟹ 非零特征值 2 个 ⟹ $\\lambda=3,3,0$。\n全部 $\\ge0$ 且含 0 ⟹ $A$ 半正定，不正定（正定要求全 $\\gt0$）。\n$p=2,q=0$ ⟹ 规范形 $f=z_1^2+z_2^2$；正交变换下的标准形 $f=3y_1^2+3y_2^2$。\n顺带 $\\operatorname{tr}(A)=6=3\\times R(A)$，与结论 $\\operatorname{tr}(A)=kr$ 吻合。注意「$r=\\operatorname{tr}$」只对 $A^2=A$（即 $k=1$）成立，别套错。\n\n口诀：「正定推一串：行列式正、对角元正、可逆、逆与伴随都正定、与 $E$ 合同；平方等于自己就是幂等、秩等于迹；半正定别拿主子式判」。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_1000_gl1_4",
    chapterId: "ch_gailv",
    chapterName: "概率论",
    sectionId: "cond_prob",
    sectionName: "条件概率与全概率",
    title: "基础1-4 条件概率三工具的选择判据",
    content: "比较难想清楚的题目，我是用条件概率去做的，但做错了。方向选对了，卡在条件概率的展开与还原上。",
    mistakeType: "方法不熟",
    importance: 4,
    correction: "知识点：条件概率只有三个工具，用错顺序就崩。\n\n① 定义（乘法公式的来源）：$P(A\\mid B)=\\dfrac{P(AB)}{P(B)}$（$P(B)\\gt0$）。变形即乘法公式 $P(AB)=P(B)P(A\\mid B)=P(A)P(B\\mid A)$。\n② 全概率公式（由因求果，「先分情况再合并」）：若 $B_1,\\dots,B_n$ 是样本空间的一个划分（两两互斥、并为全集），则\n\n$$P(A)=\\sum_{i=1}^n P(B_i)P(A\\mid B_i)$$\n\n③ 贝叶斯公式（由果溯因）：\n\n$$P(B_k\\mid A)=\\frac{P(B_k)P(A\\mid B_k)}{\\sum_i P(B_i)P(A\\mid B_i)}$$\n\n选工具的判据：\n\n- 题面问「在已发生某事的条件下」⟹ 定义式，直接找 $P(AB)$ 与 $P(B)$。\n- 题面有「分两批 / 三个厂 / 先抽后抽」⟹ 全概率，划分就是那几批。\n- 题面问「已知结果，问来自哪个源」⟹ 贝叶斯。\n\n最常见的两个错：把 $P(A\\mid B)$ 当成 $P(AB)$；在全概率里漏掉一个分支（划分不完备）。检查方法：所有 $P(B_i)$ 加起来必须等于 1。\n\n另一条实用恒等式：$P(AB)=P(A)-P(A\\bar B)$。当 $P(AB)$ 难直接算时，用「$A$ 发生」减去「$A$ 发生但 $B$ 不发生」。\n\n例题（同类题，非原卷）：袋中 10 件产品，7 件正品 3 件次品。不放回连取两次，已知第二次取到正品，求第一次也取到正品的概率。\n\n解：设 $A=$ 第一次正品，$B=$ 第二次正品，求 $P(A\\mid B)$。\n抽签公平性：任何一次抽到正品的概率都等于 $\\frac7{10}$，故 $P(B)=\\frac7{10}$。\n$P(AB)=\\dfrac7{10}\\cdot\\dfrac69=\\dfrac{42}{90}$。\n\n$$P(A\\mid B)=\\frac{42/90}{7/10}=\\frac{42}{90}\\cdot\\frac{10}7=\\frac69=\\frac23$$\n\n口诀：「问条件就写 $P(AB)$ 除 $P(B)$；见分批就上全概率、划分概率和必为 1；由果溯因才用贝叶斯」。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_1000_gl1_11",
    chapterId: "ch_gailv",
    chapterName: "概率论",
    sectionId: "cond_prob",
    sectionName: "条件概率与全概率",
    title: "基础1-11 事件运算是集合代数（幂等律与吸收律）",
    content: "没能推断出 $P(A(A\\cup BC))$ 等于 $P(A)$。我单纯把 A 乘进去了，然后得出等于 $P(A^2)$ 之类的东西，当场蒙住。根子是把事件运算当成了代数乘法。",
    mistakeType: "概念混淆",
    importance: 4,
    correction: "知识点：事件的「乘」是交（$\\cap$，常省略写成并列），不是数值相乘。事件运算满足的是集合代数，最关键的五组：\n\n① 幂等律：$AA=A$，$A\\cup A=A$。**这就是为什么不存在 $A^2$、$P(A^2)$ 这种写法。**\n② 吸收律：$A(A\\cup B)=A$，$A\\cup(AB)=A$。\n③ 分配律：$A(B\\cup C)=AB\\cup AC$；$A\\cup(BC)=(A\\cup B)(A\\cup C)$。\n④ 德摩根：$\\overline{A\\cup B}=\\bar A\\bar B$；$\\overline{AB}=\\bar A\\cup\\bar B$；推广 $n$ 个：$\\overline{\\bigcup A_i}=\\bigcap\\bar A_i$。\n⑤ 差事件与加法公式：$A-B=A\\bar B=A-AB$，故 $P(A-B)=P(A)-P(AB)$；$P(A\\cup B)=P(A)+P(B)-P(AB)$；三个事件 $P(A\\cup B\\cup C)=\\sum P(A)-\\sum P(AB)+P(ABC)$。\n\n本题的推理链（两条路都通）：\n\n路一（吸收律）：$A(A\\cup BC)=A$（因为 $A\\cap(A\\cup BC)=A$），故 $P(A(A\\cup BC))=P(A)$。\n路二（分配律兜底，不敢直接套吸收律时用）：$A(A\\cup BC)=AA\\cup A(BC)=A\\cup ABC$。又 $ABC\\subset A$，故 $A\\cup ABC=A$。同样得 $P(A)$。\n\n幂等律是这类题的钥匙：$AA=A$，永远不会有 $A^2$。看到自己写出 $P(A\\cdot A)=P(A)^2$ 就立刻停手——后者只在 $A$ 与 $A$ 独立时成立，而 $A$ 与自身独立意味着 $P(A)=0$ 或 $1$，是退化情形。\n\n例题（同类题，非原卷）：化简 $P[(A\\cup B)(A\\cup\\bar B)(\\bar A\\cup B)]$。\n\n解：前两个用分配律 $(A\\cup B)(A\\cup\\bar B)=A\\cup(B\\bar B)=A\\cup\\varnothing=A$。\n再与第三个交：$A(\\bar A\\cup B)=A\\bar A\\cup AB=\\varnothing\\cup AB=AB$。\n故原式 $=P(AB)$。\n\n口诀：「事件的乘是交不是数值乘；$AA$ 就是 $A$、没有平方；$A$ 交（$A$ 并 $B$）还是 $A$；先分配、再用互斥消项」。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_1000_gl2_9",
    chapterId: "ch_gailv",
    chapterName: "概率论",
    sectionId: "function_distribution",
    sectionName: "随机变量函数的分布",
    title: "基础2-9 必须分类讨论的四个触发点",
    content: "缺少分类讨论，此题型不熟悉。我只按一种情况算到底，漏掉了另一半。",
    mistakeType: "条件遗漏",
    importance: 4,
    correction: "知识点：一维随机变量里必须分类讨论的四个触发点，看到就停下来列情况：\n\n① 分段定义的分布函数或密度：$F(x)$、$f(x)$ 在不同区间表达式不同 ⟹ 求概率、求反函数、求 $Y=g(X)$ 的分布时，必须按区间断点分段处理。断点就是分类的界。\n② 含绝对值：$|X|$、$|X-a|$ ⟹ 按 $X\\ge a$ 与 $X\\lt a$ 分两类，两类各自算完再合并。\n③ 离散型取值范围有限：如 $X\\sim B(n,p)$ 只取 $0,1,\\dots,n$ ⟹ 求 $P(Y=k)$ 时 $k$ 超出范围必须单独说明为 0，别把公式套到范围外。\n④ 参数的符号或大小关系未定：题面给了参数 $a$ 但没说正负 ⟹ 按 $a\\gt0$、$a=0$、$a\\lt0$ 分三类，或按两个断点的大小关系分类。\n\n$Y=g(X)$ 的分布函数法本身就是「分类讨论」的载体，四步：\n\n第一步 写定义 $F_Y(y)=P(g(X)\\le y)$；\n第二步 把不等式 $g(X)\\le y$ 解成 $X$ 的范围——**这一步必须按 $g$ 的单调区间分开解**，$g$ 非单调时至少分两段；\n第三步 用 $F_X$ 或 $f_X$ 算出概率，分段写出 $F_Y(y)$；\n第四步 求导得 $f_Y(y)$，并**逐段标明 $y$ 的范围**，范围外补 0。\n\n漏解自查清单：① $y$ 的取值范围是否覆盖全体实数 ② 每段端点是否接得上（$F_Y$ 必须连续、单调不减、$F_Y(-\\infty)=0$、$F_Y(+\\infty)=1$）③ 是否漏了 $g$ 取不到某些 $y$ 值的空档。\n\n例题（同类题，非原卷）：$X\\sim U(-1,2)$，求 $Y=X^2$ 的密度。这是必须分类的典型——$g(x)=x^2$ 在 $[-1,0]$ 递减、在 $[0,2]$ 递增，且值域分两段。\n\n解：$f_X(x)=\\frac13$（$-1\\le x\\le2$）。$Y$ 的取值范围是 $[0,4]$。\n分类一 $0\\le y\\lt1$：$X^2\\le y\\iff-\\sqrt y\\le X\\le\\sqrt y$，两个端点都在 $[-1,2]$ 内，故\n$F_Y(y)=\\int_{-\\sqrt y}^{\\sqrt y}\\frac13 dx=\\frac{2\\sqrt y}3$。\n分类二 $1\\le y\\lt4$：$-\\sqrt y\\lt-1$ 超出定义域左端，下限被截断为 $-1$，故\n$F_Y(y)=\\int_{-1}^{\\sqrt y}\\frac13 dx=\\frac{\\sqrt y+1}3$。\n求导：\n\n$$f_Y(y)=\\begin{cases}\\dfrac1{3\\sqrt y},&0\\lt y\\lt1\\\\[2mm]\\dfrac1{6\\sqrt y},&1\\le y\\lt4\\\\[1mm]0,&\\text{其他}\\end{cases}$$\n\n验：$F_Y(1)$ 左式 $=\\frac23$、右式 $=\\frac23$，连续 ✓；$F_Y(4)=\\frac{2+1}3=1$ ✓。\n**漏掉分类一就会把下限错写成 $-1$，整段密度翻倍。**\n\n口诀：「$g$ 不单调就分段、绝对值就分正负、离散就查取值范围、参数未定就分符号；写完用 $F(-\\infty)=0$、$F(+\\infty)=1$、端点连续三查」。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_1000_gl2_11",
    chapterId: "ch_gailv",
    chapterName: "概率论",
    sectionId: "function_distribution",
    sectionName: "随机变量函数的分布",
    title: "基础2-11 定义域是 X 的、值域是 Y 的",
    content: "还是老问题，把 $Y$ 当成 $X$ 的定义域了，应该是值域，这类题我总是算错。",
    mistakeType: "概念混淆",
    importance: 5,
    correction: "知识点：$Y=g(X)$ 里三个集合必须分清，混一个就全盘错：\n\n- $X$ 的**定义域**（准确说是支撑集）$D_X=\\{x:f_X(x)\\gt0\\}$——自变量的取值范围。\n- $g$ 的**映射规则**——把 $D_X$ 里的每个 $x$ 送到一个 $y$。\n- $Y$ 的**值域** $D_Y=g(D_X)=\\{g(x):x\\in D_X\\}$——因变量的取值范围，也就是 $f_Y(y)$ 非零的地方。\n\n关系是 $D_Y$ 由 $D_X$ 经 $g$ **推出来**，不是反过来。所以做题的第一步永远是：先写出 $D_X$，再算 $D_Y=g(D_X)$，然后才在 $D_Y$ 上分段求 $f_Y$。$D_Y$ 之外一律 $f_Y(y)=0$。\n\n最典型的三个错法：\n\n① 把 $D_X$ 的范围直接当成 $y$ 的范围写进答案（本题的错法）。例：$X\\in(0,1)$、$Y=-2\\ln X$，则 $Y\\in(0,+\\infty)$，不是 $(0,1)$。\n② $g$ 单调递减时忘记 $y$ 的大小方向翻转。$g$ 递减 ⟹ $x$ 的下界对应 $y$ 的上界。\n③ 公式法里漏掉绝对值：$f_Y(y)=f_X(h(y))|h'(y)|$，$h=g^{-1}$，$|h'|$ 必须取绝对值，否则递减情形出负密度。\n\n单调情形公式法（$y=g(x)$ 严格单调、$x=h(y)$）：\n\n$$f_Y(y)=f_X(h(y))\\,|h'(y)|,\\qquad y\\in D_Y$$\n\n例题（同类题，非原卷）：$X\\sim U(0,1)$，求 $Y=-2\\ln X$ 的密度与分布，并指出它是什么分布。\n\n解：$D_X=(0,1)$，$f_X(x)=1$。\n值域：$x\\to0^+$ 时 $y\\to+\\infty$；$x\\to1^-$ 时 $y\\to0^+$。故 $D_Y=(0,+\\infty)$。**不是 $(0,1)$**。\n反解：$y=-2\\ln x\\iff x=e^{-y/2}=h(y)$，$h'(y)=-\\frac12e^{-y/2}$，$|h'(y)|=\\frac12e^{-y/2}$。\n\n$$f_Y(y)=1\\cdot\\frac12e^{-y/2},\\quad y\\gt0$$\n\n这正是参数 $\\lambda=\\frac12$ 的指数分布，即 $Y\\sim E(\\frac12)$，$E(Y)=2$、$D(Y)=4$。\n验：$\\int_0^{+\\infty}\\frac12e^{-y/2}dy=1$ ✓。（这条就是「指数分布由均匀分布经对数变换产生」，也是逆变换采样法的原理。）\n\n口诀：「定义域是 $X$ 的、值域是 $Y$ 的，值域由 $g$ 推出来；递减要翻方向、公式法带绝对值；写完先查值域端点对不对」。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_1000_gl3_1",
    chapterId: "ch_gailv",
    chapterName: "概率论",
    sectionId: "joint_dist",
    sectionName: "二维随机变量分布",
    title: "基础3-1 二维离散先列联合分布律表",
    content: "考虑两个离散型的随机变量，最好把联合分布律拿出来算一算。我当时是在脑子里硬凑，凑着凑着就乱了。",
    mistakeType: "方法不熟",
    importance: 4,
    correction: "知识点：二维离散型的铁律——**先把联合分布律列成表格，再做任何计算**。表格一旦列出，边缘、条件、独立性、协方差全变成读数与加法，不用思考。\n\n表的结构：行是 $X$ 的取值 $x_1,\\dots,x_m$，列是 $Y$ 的取值 $y_1,\\dots,y_n$，格子里填 $p_{ij}=P(X=x_i,Y=y_j)$，最右一列是行和 $=P(X=x_i)$，最下一行是列和 $=P(Y=y_j)$，右下角总和必须 $=1$。\n\n$$p_{ij}\\ge0,\\qquad \\sum_i\\sum_j p_{ij}=1,\\qquad P(X=x_i)=\\sum_j p_{ij},\\qquad P(Y=y_j)=\\sum_i p_{ij}$$\n\n四件事在表上怎么做：\n\n① 边缘分布：行和 / 列和，直接读。\n② 条件分布：$P(X=x_i\\mid Y=y_j)=\\dfrac{p_{ij}}{\\text{第 }j\\text{ 列的列和}}$——「锁定一列，格子里的数除以列和」。\n③ 独立性：$X$ 与 $Y$ 独立 $\\iff$ **每一个格子**都满足 $p_{ij}=$ 行和 $\\times$ 列和。只验一个格子不够，必须全验（或验秩：把表格看成矩阵，独立 $\\iff$ 该矩阵秩为 1）。\n④ $Z=g(X,Y)$ 的分布：把所有格子按 $g(x_i,y_j)$ 的值归类，同一 $z$ 值的格子概率相加。\n\n建表的三种来源：\n\n- 题面直接给 $p_{ij}$ ⟹ 直接填。\n- 给的是「$X,Y$ 的取值组合由某试验决定」⟹ 先算每种组合的概率再填，注意组合总数。\n- 只给边缘与某个条件（如「$X$ 与 $Y$ 独立」）⟹ 用 $p_{ij}=$ 行和 $\\times$ 列和反推。\n\n例题（同类题，非原卷）：袋中 3 红 2 白，不放回取 2 次。$X=$ 第一次取到的红球数，$Y=$ 第二次取到的红球数（各取 0 或 1）。列联合分布律表，判断 $X$ 与 $Y$ 是否独立。\n\n解：$P(X=1,Y=1)=\\frac35\\cdot\\frac24=\\frac6{20}$；$P(X=1,Y=0)=\\frac35\\cdot\\frac24=\\frac6{20}$；\n$P(X=0,Y=1)=\\frac25\\cdot\\frac34=\\frac6{20}$；$P(X=0,Y=0)=\\frac25\\cdot\\frac14=\\frac2{20}$。\n\n$$\\begin{array}{c|cc|c} & Y=0 & Y=1 & \\text{行和}\\\\\\hline X=0 & 2/20 & 6/20 & 8/20\\\\ X=1 & 6/20 & 6/20 & 12/20\\\\\\hline\\text{列和} & 8/20 & 12/20 & 1\\ \\checkmark\\end{array}$$\n\n独立性检查：$P(X=0,Y=0)=\\frac2{20}$，而行和 $\\times$ 列和 $=\\frac8{20}\\cdot\\frac8{20}=\\frac{64}{400}\\ne\\frac2{20}$ ⟹ **不独立**（不放回抽样必然不独立，这是常识核对）。\n条件分布示例：$P(X=1\\mid Y=1)=\\dfrac{6/20}{12/20}=\\frac12$。\n\n口诀：「二维离散先列表，行和列和是边缘；条件就是格子除列和；独立要每格都验、行和乘列和」。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_1000_gl3_8",
    chapterId: "ch_gailv",
    chapterName: "概率论",
    sectionId: "joint_dist",
    sectionName: "二维随机变量分布",
    title: "基础3-8 二维随机变量函数分布的四步法",
    content: "好题，这类题我缺少清晰的步骤，又做错了。每次都是凭感觉凑积分限，凑错了也不知道错在哪。",
    mistakeType: "方法不熟",
    importance: 5,
    correction: "知识点：求 $Z=g(X,Y)$ 的分布，统一走「分布函数法四步」，任何 $g$ 都适用。\n\n第一步 写定义：$F_Z(z)=P(g(X,Y)\\le z)=\\iint\\limits_{D_z}f(x,y)\\,dxdy$，其中 $D_z=\\{(x,y):g(x,y)\\le z\\}$。\n第二步 **画图**：在 $xy$ 平面上画出 $f$ 的非零区域 $D$（联合密度的支撑），再画出曲线 $g(x,y)=z$，标出 $D_z=D\\cap\\{g\\le z\\}$。这一步是整个方法的核心，不画图必错。\n第三步 定积分限：把 $D_z$ 写成累次积分（先 $y$ 后 $x$ 或反之），下限上限从图上读。\n第四步 对 $z$ 求导得 $f_Z(z)$，并标明 $z$ 的有效范围（范围外为 0）。求导时用变限积分求导法则，边界含 $z$ 的项才留下。\n\n两个高频特例的现成结论（仍建议会推，别只背）：\n\n① 和 $Z=X+Y$（卷积公式）：\n\n$$f_Z(z)=\\int_{-\\infty}^{+\\infty}f(x,z-x)\\,dx=\\int_{-\\infty}^{+\\infty}f(z-y,y)\\,dy$$\n\n$X,Y$ 独立时 $f_Z(z)=\\int f_X(x)f_Y(z-x)dx$。积分限由「$x$ 在 $f_X$ 的支撑内**且** $z-x$ 在 $f_Y$ 的支撑内」两个条件同时决定，这是最容易错的地方。\n② 最大最小（$X,Y$ 独立时）：$F_{\\max}(z)=F_X(z)F_Y(z)$，$F_{\\min}(z)=1-[1-F_X(z)][1-F_Y(z)]$。$n$ 个独立同分布时取 $n$ 次幂。\n\n自查：$\\int f_Z(z)dz$ 必须 $=1$；$F_Z$ 必须单调不减、连续、两端极限为 0 与 1。\n\n例题（同类题，非原卷）：$X,Y$ 独立同分布于 $U(0,1)$，求 $Z=X+Y$ 的密度。\n\n解：$f(x,y)=1$ 在单位正方形 $0\\le x\\le1,\\ 0\\le y\\le1$ 内，其余为 0。$Z$ 的范围是 $(0,2)$。\n第二步画图：直线 $x+y=z$ 扫过正方形。\n分类一 $0\\lt z\\le1$：$D_z$ 是左下角三角形，$x$ 从 0 到 $z$，对每个 $x$，$y$ 从 0 到 $z-x$。\n$F_Z(z)=\\int_0^z(z-x)dx=z^2-\\frac{z^2}2=\\frac{z^2}2$。\n分类二 $1\\lt z\\lt2$：$D_z$ 是正方形去掉右上角三角形，用补集更快：\n$F_Z(z)=1-\\int_z^2\\cdots$，即 $1-\\frac{(2-z)^2}2$。\n求导：\n\n$$f_Z(z)=\\begin{cases}z,&0\\lt z\\le1\\\\2-z,&1\\lt z\\lt2\\\\0,&\\text{其他}\\end{cases}$$\n\n这就是三角分布。验：$\\int_0^1z\\,dz+\\int_1^2(2-z)dz=\\frac12+\\frac12=1$ ✓；$f_Z$ 在 $z=1$ 处连续 ✓。\n**只算分类一而漏掉分类二，是最常见的错——因为 $z$ 越过 1 之后积分限的形态变了。**\n\n口诀：「先画图、再定限、后求导；$X+Y$ 用卷积、积分限是两个支撑的交集；最大最小用分布函数相乘」。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_1000_gl3_10",
    chapterId: "ch_gailv",
    chapterName: "概率论",
    sectionId: "joint_dist",
    sectionName: "二维随机变量分布",
    title: "基础3-10 二维综合题漏解的三个来源",
    content: "好题，综合题，容易漏解。我不是不会做，是做完总觉得对了，一对答案就少一块。",
    mistakeType: "条件遗漏",
    importance: 4,
    correction: "知识点：二维随机变量的综合题，漏解只来自三个地方，逐个设卡就不会漏。\n\n来源一 · 分段区域的边界没接上\n联合密度的支撑 $D$ 往往不整齐（三角形、梯形、被直线切开的区域）。求边缘密度时，$x$ 在不同区间内，$y$ 的上下限表达式不同 ⟹ 必须分段写 $f_X(x)$，每段标明 $x$ 的范围。\n设卡动作：把 $D$ 的投影区间找出来，再找出投影内使积分限表达式改变的「分界 $x$ 值」（通常是 $D$ 的顶点横坐标），有几个分界就分几段。\n\n来源二 · $X$ 与 $Y$ 的角色不对称被当成对称\n题面看着对称，实际支撑不对称（例如 $0\\le y\\le x\\le1$）。此时 $f_X$ 与 $f_Y$ 的表达式不同，不能照抄。\n设卡动作：求完 $f_X$ 后，把 $x,y$ 互换重推一遍 $f_Y$，不要用「对称性」直接写答案。$0\\le y\\le x\\le1$ 时 $f_X(x)=\\int_0^x f\\,dy$（上限是 $x$），$f_Y(y)=\\int_y^1 f\\,dx$（下限是 $y$）——形态完全不同。\n\n来源三 · 离散与连续混合、或有概率质量的奇异点\n若 $X$ 连续而 $Y$ 离散（或 $Z$ 的取值里有一个孤立的点，如 $Z=|X-Y|$ 在 0 处、$Z=\\max(X,Y)$ 在边界处），则 $Z$ 不是纯连续型，那一点上有集中概率 $P(Z=z_0)\\gt0$，必须单独列出来，密度里再加一个「点质量」项。\n设卡动作：算完 $F_Z(z)$ 后检查它是否处处连续。有跳跃点就说明有集中概率，跳跃高度 $=P(Z=z_0)$。\n\n通用兜底三查：① $\\int f_X(x)dx=1$、$\\int f_Y(y)dy=1$ ② $F_Z(-\\infty)=0$、$F_Z(+\\infty)=1$ ③ 用 $f_X,f_Y$ 反算 $P((X,Y)\\in D)=1$。\n\n例题（同类题，非原卷）：$(X,Y)$ 在区域 $D=\\{0\\le y\\le x\\le1\\}$ 上服从均匀分布。求 $f_X(x)$、$f_Y(y)$，并求 $Z=X-Y$ 的密度。\n\n解：$D$ 是三角形，面积 $\\frac12$，故 $f(x,y)=2$（$(x,y)\\in D$），其余为 0。\n$f_X(x)=\\int_0^x2\\,dy=2x$，$0\\le x\\le1$；$f_Y(y)=\\int_y^12\\,dx=2(1-y)$，$0\\le y\\le1$。**两者形态不同，不能照抄。**\n验：$\\int_0^12x\\,dx=1$ ✓，$\\int_0^12(1-y)dy=1$ ✓。\n$Z=X-Y$：范围 $[0,1)$。$F_Z(z)=P(X-Y\\le z)=1-P(X-Y\\gt z)$。\n$P(X-Y\\gt z)$ 的区域是 $\\{y\\le x-z,\\ 0\\le y\\le x\\le1\\}$，即顶点 $(z,0),(1,0),(1,1-z)$ 的三角形，面积 $\\frac{(1-z)^2}2$，概率 $=2\\cdot\\frac{(1-z)^2}2=(1-z)^2$。\n故 $F_Z(z)=1-(1-z)^2$，$f_Z(z)=2(1-z)$，$0\\lt z\\lt1$。\n注意 $P(Z=0)=P(X=Y)=0$（连续型，直线面积为零），无点质量，$F_Z$ 连续 ✓。\n\n口诀：「分段看支撑顶点，角色不对称就重推一遍，算完 $F_Z$ 查有没有跳跃点；三个 1 兜底：两个边缘各积分为 1、$F_Z$ 两端为 0 和 1」。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_1000_gl3_11",
    chapterId: "ch_gailv",
    chapterName: "概率论",
    sectionId: "joint_dist",
    sectionName: "二维随机变量分布",
    title: "基础3-11 边缘分布与条件分布的定限口诀",
    content: "长时间没做又忘了此类题怎么做了，不该错的。卡在积分上下限怎么定。",
    mistakeType: "方法不熟",
    importance: 4,
    correction: "知识点：边缘与条件分布的全部技术难点就是「定限」，一句口诀解决：**穿过法**。\n\n求 $f_X(x)$：在联合密度的支撑 $D$ 上，过点 $(x,0)$ 作一条**竖直线**（平行 $y$ 轴），看它从哪进入 $D$、从哪离开 $D$——进入点的纵坐标是下限 $y_1(x)$，离开点的纵坐标是上限 $y_2(x)$。于是\n\n$$f_X(x)=\\int_{y_1(x)}^{y_2(x)}f(x,y)\\,dy,\\qquad x\\in D\\text{ 在 }x\\text{ 轴上的投影}$$\n\n求 $f_Y(y)$：过 $(0,y)$ 作**水平线**，进入点横坐标是下限 $x_1(y)$、离开点是上限 $x_2(y)$：\n\n$$f_Y(y)=\\int_{x_1(y)}^{x_2(y)}f(x,y)\\,dx,\\qquad y\\in D\\text{ 在 }y\\text{ 轴上的投影}$$\n\n「外层变量的范围 = $D$ 在对应坐标轴上的投影」这一句最容易被忘，漏了它就会把 $x$ 的范围写成全体实数或写错端点。\n\n条件分布（连续型）：\n\n$$f_{X\\mid Y}(x\\mid y)=\\frac{f(x,y)}{f_Y(y)}\\ (f_Y(y)\\gt0),\\qquad f_{Y\\mid X}(y\\mid x)=\\frac{f(x,y)}{f_X(x)}$$\n\n条件密度的支撑是 $D$ 被直线 $y=y_0$（或 $x=x_0$）截出的那一段，**不是** $D$ 的整个投影。这一点是条件分布最常见的错。\n\n独立的判据（连续型）：$X$ 与 $Y$ 独立 $\\iff f(x,y)=f_X(x)f_Y(y)$ 几乎处处成立。实操两条：① 支撑 $D$ 必须是**矩形**（边平行坐标轴）——只要 $D$ 是三角形、圆形、$\\{y\\le x\\}$ 这类，就直接判不独立，不必算；② 在矩形内 $f$ 能写成 $g(x)h(y)$ 的乘积形式。\n\n例题（同类题，非原卷）：$f(x,y)=\\begin{cases}c(x+y),&0\\le x\\le1,\\ 0\\le y\\le x\\\\0,&\\text{其他}\\end{cases}$。求 $c$、$f_X(x)$、$f_Y(y)$，并判断独立性。\n\n解：定 $c$：$\\int_0^1\\!\\!\\int_0^x c(x+y)\\,dy\\,dx=c\\int_0^1(xy+\\frac{y^2}2)\\Big|_0^x dx=c\\int_0^1(x^2+\\frac{x^2}2)dx=c\\cdot\\frac12=1$ ⟹ $c=2$。\n$f_X(x)$：竖直线过 $(x,0)$，从 $y=0$ 进入、从 $y=x$ 离开 ⟹ $f_X(x)=\\int_0^x2(x+y)dy=2(xy+\\frac{y^2}2)\\big|_0^x=2x^2+x^2=3x^2$，$0\\le x\\le1$。\n$f_Y(y)$：水平线过 $(0,y)$，从 $x=y$ 进入（因为要满足 $y\\le x$）、从 $x=1$ 离开 ⟹ $f_Y(y)=\\int_y^12(x+y)dx=(x^2+2xy)\\big|_y^1=1+2y-3y^2$，$0\\le y\\le1$。\n验：$\\int_0^13x^2dx=1$ ✓；$\\int_0^1(1+2y-3y^2)dy=1+1-1=1$ ✓。\n独立性：支撑 $\\{0\\le y\\le x\\le1\\}$ 是三角形不是矩形 ⟹ **直接判不独立**，无需再算。\n条件密度：$f_{X\\mid Y}(x\\mid y)=\\dfrac{2(x+y)}{1+2y-3y^2}$，$y\\le x\\le1$（支撑是被截的那一段，不是 $[0,1]$）。\n\n口诀：「求谁的边缘就用竖线或横线穿过支撑，进入是下限、离开是上限；外层范围是投影；条件密度分母是边缘、支撑是截段；支撑不是矩形就一定不独立」。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_1000_gl4_1",
    chapterId: "ch_gailv",
    chapterName: "概率论",
    sectionId: "numeric_feature",
    sectionName: "期望与方差的性质",
    title: "基础4-1 函数的期望不等于期望的函数",
    content: "函数的期望不等于期望的函数，我直接填 $e^2$ 了。当时觉得 $E(e^X)$ 就等于 $e^{EX}$，一秒作答，秒错。",
    mistakeType: "公式不清",
    importance: 5,
    correction: "知识点：$E[g(X)]\\ne g(E[X])$，除非 $g$ 是线性函数。这一条是数字特征章的第一号陷阱。\n\n正确的算法有两条，按 $X$ 的类型选：\n\n① 离散型（用联合律，不必先求 $Y=g(X)$ 的分布）：\n\n$$E[g(X)]=\\sum_i g(x_i)p_i$$\n\n② 连续型：\n\n$$E[g(X)]=\\int_{-\\infty}^{+\\infty}g(x)f(x)\\,dx$$\n\n**关键：不要把 $g$ 塞进 $E$ 里面。** 想求 $E(e^X)$，就写 $\\int e^xf(x)dx$，而不是 $e^{EX}$。\n\n线性时才成立的四条（这些可以用）：\n\n- $E(aX+b)=aE(X)+b$（**只有这里 $b$ 能直接加**）\n- $E(X+Y)=E(X)+E(Y)$（无条件成立，不要求独立）\n- $E(XY)=E(X)E(Y)$ **需要 $X,Y$ 独立**（或至少不相关）\n- $D(aX+b)=a^2D(X)$（$b$ 消失、$a$ 平方）\n- $D(X)=E(X^2)-[E(X)]^2$（这条把「平方的期望」与「期望的平方」连起来，是最常用的换算）\n\n由 $E(X^2)\\ne[E(X)]^2$ 可知：$E(X^2)=[E(X)]^2+D(X)$。所以求 $E(X^2)$ 不必重新积分，用方差换算更快——反过来也成立。\n\n凸函数情形有詹森不等式定方向：$g$ 凸 ⟹ $E[g(X)]\\ge g(E[X])$。$e^x$、$x^2$ 都是凸函数，所以 $E(e^X)\\ge e^{EX}$、$E(X^2)\\ge[E(X)]^2$。填 $e^2$ 的错方向就是「取了等号」，而等号只在 $X$ 退化（方差为 0）时成立。\n\n例题（同类题，非原卷）：$X\\sim U(0,2)$，求 $E(e^X)$ 与 $D(e^X)$ 的思路，并说明为什么答案不是 $e^{EX}=e^1=e$。\n\n解：$f(x)=\\frac12$（$0\\le x\\le2$），$EX=1$，若误用「期望的函数」会得 $e^1=e\\approx2.718$。\n正解：\n\n$$E(e^X)=\\int_0^2e^x\\cdot\\frac12dx=\\frac12(e^2-1)\\approx\\frac12(7.389-1)=3.19$$\n\n确实 $3.19\\gt e=2.718$，与詹森不等式（$e^x$ 凸）方向一致。\n$E(e^{2X})=\\int_0^2e^{2x}\\cdot\\frac12dx=\\frac14(e^4-1)\\approx\\frac14(54.6-1)=13.4$。\n$D(e^X)=E(e^{2X})-[E(e^X)]^2\\approx13.4-10.2=3.2$。\n**注意 $D(e^X)$ 不等于 $e^{2DX}$，也不等于 $D(X)$ 的任何简单函数——方差对非线性变换没有传递公式，只能回到定义算。**\n\n口诀：「函数的期望要积分，期望的函数是陷阱；只有线性能拆，$E(XY)$ 还要独立；$E(X^2)=[EX]^2+DX$；凸函数用詹森定方向，$E[g(X)]\\ge g(E[X])$」。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_17_3",
    chapterId: "ch_gaoshu",
    chapterName: "高数",
    sectionId: "directional_derivative",
    sectionName: "多元微分·方向导数与旋度",
    title: "2017数一真题3 方向导数公式与「余弦」的来源",
    content: "忘了方向导数的公式，尤其不知道公式里那个余弦是怎么来的——没意识到「余弦」就是把方向向量单位化之后剩下的分量，它不是另外要记的东西。",
    mistakeType: "公式不清",
    importance: 4,
    correction: "方向导数公式里的 $\\cos\\alpha,\\cos\\beta,\\cos\\gamma$ 叫「方向余弦」，来源只有一步：把方向 $l$ 单位化。\n\n设 $l=(l_1,l_2,l_3)$，则 $l^0=\\dfrac{l}{|l|}=(\\cos\\alpha,\\cos\\beta,\\cos\\gamma)$，其中 $\\alpha,\\beta,\\gamma$ 是 $l$ 与 $x,y,z$ 轴正向的夹角。因为 $l^0$ 是单位向量，三个分量天然满足 $\\cos^2\\alpha+\\cos^2\\beta+\\cos^2\\gamma=1$，所以「单位化的结果」就等于「方向余弦」。\n\n$$\\frac{\\partial f}{\\partial l}=\\nabla f\\cdot l^0=f_x\\cos\\alpha+f_y\\cos\\beta+f_z\\cos\\gamma$$\n\n例（2017 数一第 3 题）：$f(x,y,z)=x^2y+z^2$ 在点 $(1,2,0)$ 沿 $n=(1,2,2)$。\n\n① 梯度：$\\nabla f=(2xy,\\ x^2,\\ 2z)$，代 $(1,2,0)$ 得 $(4,1,0)$。\n② 单位化：$|n|=\\sqrt{1^2+2^2+2^2}=3$，$n^0=\\left(\\dfrac13,\\dfrac23,\\dfrac23\\right)$。\n③ 点乘：$\\dfrac{\\partial f}{\\partial n}=4\\cdot\\dfrac13+1\\cdot\\dfrac23+0\\cdot\\dfrac23=2$。\n\n最大方向导数 $=|\\nabla f|$，方向取梯度方向本身。\n\n口诀：「先单位化，分量即余弦；梯度点单位，最大是模长」。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_17_6",
    chapterId: "ch_xiandai",
    chapterName: "线性代数",
    sectionId: "similarity",
    sectionName: "相似矩阵的性质",
    title: "2017数一真题6 特征值相同 ⇏ 相似（可对角化要数特征向量）",
    content: "对相似的定义不了解：以为只要 A、B 和 C 的特征值一样，就一定可以相似对角化，于是 A∼C、B∼C 都成立。忽略了「相似」要求存在可逆 P 使 $P^{-1}AP=B$，而可对角化要求凑够 n 个线性无关的特征向量。",
    mistakeType: "概念混淆",
    importance: 5,
    correction: "相似是「存在可逆 P 使 $P^{-1}AP=B$」，特征值相同只是必要条件，不是充分条件。\n\n$n$ 阶矩阵 $A$ 相似于对角阵 $\\Lambda$ 的三条等价判据：\n① $A$ 有 $n$ 个线性无关的特征向量；\n② 每个特征值的几何重数 = 代数重数，即 $n-r(\\lambda_i E-A)$ = 该根的重数；\n③ 最小多项式无重根。\n单根自动满足，只有重根需要查；$n$ 个特征值互异是充分而非必要。\n\n例（2017 数一第 6 题）：\n$A=\\begin{pmatrix}2&0&0\\\\0&2&1\\\\0&0&1\\end{pmatrix}$，$B=\\begin{pmatrix}2&1&0\\\\0&2&0\\\\0&0&1\\end{pmatrix}$，$C=\\begin{pmatrix}1&0&0\\\\0&2&0\\\\0&0&2\\end{pmatrix}$。\n三者都是上三角或对角阵，特征值同为 $2,2,1$，所以只能查 $\\lambda=2$（二重）的几何重数。\n\n$2E-A=\\begin{pmatrix}0&0&0\\\\0&0&-1\\\\0&0&1\\end{pmatrix}$，$r=1$，几何重数 $3-1=2$ = 代数重数 $\\Rightarrow$ $A$ 可对角化 $\\Rightarrow$ $A\\sim C$。\n$2E-B=\\begin{pmatrix}0&-1&0\\\\0&0&0\\\\0&0&1\\end{pmatrix}$，$r=2$，几何重数 $3-2=1<2$ $\\Rightarrow$ $B$ 不可对角化 $\\Rightarrow$ $B$ 与 $C$ 不相似。\n故选 (B)。\n\n口诀：「特征值相同只是入场券；重根减秩数几何，够数才配谈相似」。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_17_8",
    chapterId: "ch_gailv",
    chapterName: "概率论",
    sectionId: "sampling_dist",
    sectionName: "正态总体抽样分布",
    title: "2017数一真题8 正态总体 χ² 构造判别（μ 已知 vs 未知）",
    content: "四个选项都声称「服从 $\\chi^2$ 分布」，我分不清哪个是真哪个是假：$\\sum(X_i-\\mu)^2$ 与 $\\sum(X_i-\\bar X)^2$ 的自由度差别、以及 $X_n-X_1$ 这种线性组合到底能不能配成 $\\chi^2$，都没有判据。",
    mistakeType: "概念混淆",
    importance: 5,
    correction: "$\\chi^2$ 的唯一入口：$k$ 个相互独立的标准正态变量平方和 $\\sim\\chi^2(k)$。判任何式子是不是 $\\chi^2$，一律走三步：①把括号里的量化成 $N(0,1)$；②看有几个独立项；③系数必须正好是「除以方差」，多出来的常数因子说明它只是 $\\chi^2$ 的倍数，不再是 $\\chi^2$。\n\n单个正态总体 $X\\sim N(\\mu,\\sigma^2)$ 的五大定理（$\\bar X$ 均值、$S^2$ 样本方差）：\n（1）$\\bar X$ 与 $S^2$ 相互独立（只背不证）；\n（2）$\\dfrac{n-1}{\\sigma^2}S^2=\\dfrac{1}{\\sigma^2}\\sum_{i=1}^{n}(X_i-\\bar X)^2\\sim\\chi^2(n-1)$；\n（3）$\\bar X\\sim N\\left(\\mu,\\dfrac{\\sigma^2}{n}\\right)$，即 $\\dfrac{\\bar X-\\mu}{\\sigma/\\sqrt n}\\sim N(0,1)$；\n（4）$\\dfrac{\\bar X-\\mu}{S/\\sqrt n}\\sim t(n-1)$；\n（5）$\\dfrac{1}{\\sigma^2}\\sum_{i=1}^{n}(X_i-\\mu)^2\\sim\\chi^2(n)$。\n\n分岔口：减 $\\mu$ 用满 $n$ 个自由度，减 $\\bar X$ 被「估均值」吃掉 1 个，只剩 $n-1$。看到 $\\mu$ 已知走 (5)，$\\mu$ 未知走 (2)。\n\n例（2017 数一第 8 题）：$X_1,\\dots,X_n\\sim N(\\mu,1)$，$\\sigma^2=1$，选不正确的。\n(A) $\\sum(X_i-\\mu)^2\\sim\\chi^2(n)$ ✓ 定理(5)。\n(C) $\\sum(X_i-\\bar X)^2\\sim\\chi^2(n-1)$ ✓ 定理(2)。\n(D) $\\sqrt n(\\bar X-\\mu)\\sim N(0,1)$，平方得 $n(\\bar X-\\mu)^2\\sim\\chi^2(1)$ ✓ 定理(3)。\n(B) $X_n-X_1\\sim N(0,2)$，故 $\\dfrac{(X_n-X_1)^2}{2}\\sim\\chi^2(1)$，而 $2(X_n-X_1)^2=4\\cdot\\dfrac{(X_n-X_1)^2}{2}$ 是 $\\chi^2(1)$ 的 4 倍，不是 $\\chi^2$ ✗。选 (B)。\n\n口诀：「独立标准正态平方和；减 μ 满自由度、减 X 拔一；系数不是除方差，就只是 χ² 的倍数」。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_17_10",
    chapterId: "ch_gaoshu",
    chapterName: "高数",
    sectionId: "ode",
    sectionName: "二阶常系数微分方程",
    title: "2017数一真题10 共轭复根通解形式（虚数解记不牢）",
    content: "最不该错的题：特征根是一对共轭复数时，通解写成 $e^{\\alpha x}(C_1\\cos\\beta x+C_2\\sin\\beta x)$ 这个形式忘了，式子比较长没能记住，考场上现推来不及。",
    mistakeType: "公式不清",
    importance: 4,
    correction: "二阶常系数齐次方程 $y''+py'+qy=0$，特征方程 $\\lambda^2+p\\lambda+q=0$。\n\n判别式 $\\Delta<0$ 时根为 $\\lambda_{1,2}=\\alpha\\pm\\beta i$（$\\alpha=-\\dfrac p2$ 是两根实部的平均，$\\beta=\\dfrac{\\sqrt{|\\Delta|}}{2}$ 是虚半轴），通解\n$$y=e^{\\alpha x}\\left(C_1\\cos\\beta x+C_2\\sin\\beta x\\right)$$\n\n这个形式不是硬记的，是欧拉公式推出来的：复根给出 $e^{(\\alpha\\pm\\beta i)x}=e^{\\alpha x}\\left(\\cos\\beta x\\pm i\\sin\\beta x\\right)$，两个复解线性组合取实部与虚部，就得到两个实解 $e^{\\alpha x}\\cos\\beta x$ 与 $e^{\\alpha x}\\sin\\beta x$。所以「指数前因子取实部、三角里取虚部」。\n\n三种根对照（$n$ 阶同理）：\n① 相异实根 $\\lambda_1,\\dots,\\lambda_n$：$y=\\sum C_ie^{\\lambda_ix}$；\n② $k$ 重实根 $\\lambda_0$：贡献 $(C_1+C_2x+\\cdots+C_kx^{k-1})e^{\\lambda_0x}$；\n③ 一对 $k$ 重共轭复根 $\\alpha\\pm\\beta i$：贡献 $e^{\\alpha x}\\left[P_{k-1}(x)\\cos\\beta x+Q_{k-1}(x)\\sin\\beta x\\right]$。\n\n例：$y''+4y'+8y=0$，$\\lambda^2+4\\lambda+8=0\\Rightarrow\\lambda=-2\\pm2i$（$\\alpha=-2,\\beta=2$）\n$$y=e^{-2x}\\left(C_1\\cos2x+C_2\\sin2x\\right)$$\n验算：两根之和 $=-p=-4=-2\\alpha$ ✓，两根之积 $=q=8=\\alpha^2+\\beta^2=4+4$ ✓。\n\n非齐次 $y''+py'+qy=e^{ax}P_m(x)$ 时，若 $a\\pm bi$ 恰是特征根，特解要乘 $x^k$（$k$ 为该复根重数），形式仍照抄 $e^{ax}x^k[Q\\cos bx+R\\sin bx]$。\n\n口诀：「复根拆两半：实部进指数、虚部进三角；积等于 α²+β² 用来验算」。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_17_15",
    chapterId: "ch_gaoshu",
    chapterName: "高数",
    sectionId: "implicit",
    sectionName: "隐函数与抽象函数求导",
    title: "2017数一真题15 抽象复合函数二阶导·标准解答五步",
    content: "思路是对的，但格式有问题：$f_1',f_{11}''$ 的记号前后不统一，代值时机没选好（过早把 $x=0$ 代进去导致丢项），二阶求导时对 $f_1'$ 再套一层链式写得跳步，卷面拿不满步骤分。",
    mistakeType: "方法不熟",
    importance: 4,
    correction: "抽象复合函数求导的规范卷面只有五步，一步都不能省。\n\n设 $y=f(u(x),v(x))$，求 $y''(x_0)$：\n第1步 标中间变量并算其在 $x_0$ 的值：$u_0=u(x_0),v_0=v(x_0)$，写在旁边备用。\n第2步 一阶链式，逐项写不代值：$y'=f_1'\\cdot u'+f_2'\\cdot v'$。\n第3步 二阶：把 $y'$ 整体再对 $x$ 求导。关键——$f_1',f_2'$ 本身仍是 $(u,v)$ 的复合函数，必须再套一次链式：\n$$y''=f_{11}''(u')^2+2f_{12}''u'v'+f_{22}''(v')^2+f_1'u''+f_2'v''$$\n第4步 代 $x_0$，把 $u_0,v_0$ 补进自变量，并利用二阶偏导连续时 $f_{12}''=f_{21}''$ 合并同类项。\n第5步 结果统一写成 $f_1'(u_0,v_0),f_{11}''(u_0,v_0)$ 这类带自变量的记号，别只写 $f_1'$。\n\n例（2017 数一第 15 题）：$f(u,v)$ 有二阶连续偏导，$y=f(e^x,\\cos x)$，求 $y'(0),y''(0)$。\n第1步 $u=e^x,v=\\cos x$；$x=0$ 时 $u_0=1,v_0=1$；$u'(0)=1,v'(0)=0$；$u''(0)=1,v''(0)=-1$。\n第2步 $y'=f_1'\\cdot e^x+f_2'\\cdot(-\\sin x)$，故 $y'(0)=f_1'(1,1)$。\n第3步 $y''=\\left[f_{11}''e^x+f_{12}''(-\\sin x)\\right]e^x+f_1'e^x-\\left\\{\\left[f_{21}''e^x+f_{22}''(-\\sin x)\\right]\\sin x+f_2'\\cos x\\right\\}$。\n第4步 代 $x=0$（$\\sin0=0,\\cos0=1$）：\n$$y''(0)=f_{11}''(1,1)+f_1'(1,1)-f_2'(1,1)$$\n\n易错点：$v'(0)=-\\sin0=0$ 会把 $f_{12}'',f_{22}''$ 两项整体清零，但 $f_2'v''=-f_2'$ 这一项来自 $v''=-\\cos x$，不能跟着一起丢——这是「二阶导里 $f_1'u''+f_2'v''$ 那一层」最常被漏掉的部分。\n\n口诀：「一阶逐项、二阶套两层；先不代值、合并交叉偏导、末了补自变量」。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_17_16",
    chapterId: "ch_gaoshu",
    chapterName: "高数",
    sectionId: "definite_integral",
    sectionName: "定积分定义与奇偶性",
    title: "2017数一真题16 凑定积分定义（求和型极限三岔路）",
    content: "没想到定积分的定义，第一反应是把它当成无穷级数求和，结果通项和根本求不出来，整道题卡死。",
    mistakeType: "思路缺失",
    importance: 5,
    correction: "形如 $\\lim\\limits_{n\\to\\infty}\\sum\\limits_{k=1}^{n}f(n,k)$ 的极限只有三条路，先花五秒判路：\n\n第1路 前后相消：通项能拆成 $g(k)-g(k+1)$（裂项），求和后只剩头尾。信号：分母是相邻因子的乘积，如 $\\dfrac{1}{k(k+1)}$、$\\dfrac{1}{(n+k-1)(n+k)}$。\n第2路 夹逼准则：项数 $n$ 项、每项分母只差一点点，放缩后上下限同极限。信号：分母是 $n+1,\\dots,n+n$ 这类但分子也随 $k$ 变，凑不出统一的 $\\dfrac1n\\cdot F\\!\\left(\\dfrac kn\\right)$。\n第3路 定积分定义：能提出一个 $\\dfrac1n$、剩下的写成 $\\dfrac kn$ 的函数。信号：$\\sum\\dfrac1n\\,\\varphi\\!\\left(\\dfrac kn\\right)$。\n三条可以混用（先裂项再凑定积分、先夹逼再定积分）。\n\n凑定积分定义四步万能套路（区间未必是 $[0,1]$）：\n第1步 凑出 $\\dfrac1n$（把 $\\dfrac{k}{n^2}$ 拆成 $\\dfrac1n\\cdot\\dfrac kn$ 这类）；\n第2步 认出被积函数 $\\varphi(x)$，并写出首、次、末项的自变量 $\\varepsilon_1,\\varepsilon_2,\\varepsilon_n$；\n第3步 求 $\\lim\\limits_{n\\to\\infty}\\varepsilon_1=a$、$\\lim\\limits_{n\\to\\infty}\\varepsilon_n=b$，定出积分上下限；\n第4步 由 $\\varepsilon_2-\\varepsilon_1=\\Delta x_i$ 去调整 $\\dfrac1n$ 前面的系数（差几个 $\\dfrac1n$ 就乘几个）。\n$$\\lim_{n\\to\\infty}\\frac1n\\sum_{k=1}^{n}\\varphi\\!\\left(a+(b-a)\\frac kn\\right)=(b-a)\\int_0^1\\varphi\\,=\\int_a^b\\varphi(x)\\,dx$$\n\n例（2017 数一第 16 题）：$\\lim\\limits_{n\\to\\infty}\\sum\\limits_{k=1}^{n}\\dfrac k{n^2}\\ln\\left(1+\\dfrac kn\\right)$。\n第1步 $\\dfrac{k}{n^2}=\\dfrac1n\\cdot\\dfrac kn$，第2步 $\\varphi(x)=x\\ln(1+x)$，区间 $\\varepsilon_1=\\dfrac1n\\to0$、$\\varepsilon_n=\\dfrac nn\\to1$，系数正好 $\\dfrac1n$ 不用调。\n$$I=\\int_0^1x\\ln(1+x)\\,dx=\\frac{x^2}2\\ln(1+x)\\Big|_0^1-\\frac12\\int_0^1\\frac{x^2}{1+x}\\,dx$$\n$\\dfrac{x^2}{1+x}=x-1+\\dfrac{1}{1+x}$，$\\int_0^1=\\dfrac12-1+\\ln2=\\ln2-\\dfrac12$。\n$$I=\\frac12\\ln2-\\frac12\\left(\\ln2-\\frac12\\right)=\\frac14$$\n\n口诀：「看到 n 项和先问三条路：能拆就消、能放就夹、剩下才凑定积分；凑定积分一凑 1/n、二认函数、三定上下限、四调系数」。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_17_17",
    chapterId: "ch_gaoshu",
    chapterName: "高数",
    sectionId: "implicit",
    sectionName: "隐函数与抽象函数求导",
    title: "2017数一真题17 一元隐函数极值（误当多元极值做）",
    content: "多元函数极值做多了形成定势，看到 $x,y$ 混在一起就想找驻点、算 $AC-B^2$。这题 $y(x)$ 是由方程确定的一元函数，正确路线是隐函数求导令 $y'=0$，再判 $y''$ 符号。",
    mistakeType: "审题失误",
    importance: 4,
    correction: "题型分岔只看一句话：题目求的是「$y(x)$ 的极值」还是一元，求的是「$z=f(x,y)$ 的极值」才是多元。\n- 说「函数 $y=y(x)$ 由方程确定，求 $y(x)$ 的极值」⟹ 一元隐函数：$y'=0$ 定驻点，$y''$ 定极大极小。\n- 说「求 $f(x,y)$ 的极值」⟹ 多元：解 $f_x=f_y=0$，用 $AC-B^2$ 判。\n\n一元隐函数极值三步：\n① 方程两边对 $x$ 求导（$y$ 视为 $x$ 的函数），解出 $y'$；\n② 令 $y'=0$ 得 $x$ 的值，代回原方程解出对应的 $y$（这一步最容易漏，极值点是 $(x,y)$ 一对）；\n③ 对 $y'$ 再求导得 $y''$，代该点：$y''<0$ 极大、$y''>0$ 极小。\n\n例（2017 数一第 17 题）：$x^3+y^3-3x+3y-2=0$ 确定 $y(x)$，求极值。\n① 求导：$3x^2+3y^2y'-3+3y'=0\\Rightarrow y'=\\dfrac{1-x^2}{1+y^2}$。\n② $y'=0\\Rightarrow x=\\pm1$。\n $x=1$：$1+y^3-3+3y-2=0\\Rightarrow y^3+3y-4=0\\Rightarrow(y-1)(y^2+y+4)=0\\Rightarrow y=1$。\n $x=-1$：$-1+y^3+3+3y-2=0\\Rightarrow y^3+3y=0\\Rightarrow y(y^2+3)=0\\Rightarrow y=0$。\n③ $y''=\\dfrac{-2x(1+y^2)-(1-x^2)\\cdot2yy'}{(1+y^2)^2}$，在 $y'=0$ 处第二项消失，$y''=\\dfrac{-2x}{1+y^2}$。\n 点 $(1,1)$：$y''=-\\dfrac{2}{2}=-1<0\\Rightarrow$ 极大值 $y(1)=1$。\n 点 $(-1,0)$：$y''=\\dfrac{2}{1}=2>0\\Rightarrow$ 极小值 $y(-1)=0$。\n\n技巧：$y'=0$ 时算 $y''$，分子里所有含 $y'$ 的项整片消失，只剩 $\\dfrac{-2x}{1+y^2}$——先代 $y'=0$ 再化简能省一半计算。\n\n口诀：「求 y(x) 极值走一元：一导令零、代回原方程配对、二导定号；看到 AC−B² 先确认是不是真多元」。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_17_18",
    chapterId: "ch_gaoshu",
    chapterName: "高数",
    sectionId: "proof",
    sectionName: "证明题·中值定理",
    title: "2017数一真题18 构造辅助函数证两根（碰运气→套路）",
    content: "第二小题思路不清晰，基本在碰运气：看不出 $ff''+(f')^2$ 就是 $(ff')'$，也没想到先用 (I) 的零点凑出两个等值点、再对 $\\varphi=ff'$ 套罗尔。",
    mistakeType: "思路缺失",
    importance: 5,
    correction: "中值定理证明题只有三种问法，每种对应固定套路，先对号再动手。\n\n第(1)类 证存在 $\\xi$ 使 $f(\\xi)=g(\\xi)$（即方程 $f(x)=g(x)$ 有根、$f-g$ 有零点）：\n ① 先设 $F(x)=f(x)-g(x)$，用零点定理找变号区间（$F(a)F(b)<0$）；\n ② 若结论带导数，构造辅助函数 $\\varphi(x)$ 使 $\\varphi'(x)=F(x)$ 或 $\\varphi'(x)=F(x)\\cdot(\\ )$，再对 $\\varphi$ 用罗尔定理（凑 $\\varphi(a)=\\varphi(b)$）。\n 构造辅助函数的唯一原则：谁的导数会出现我们需要的形式。\n第(2)类 证存在 $\\xi$ 使 $f^{(n)}(\\xi)=0\\ (n\\ge1)$：反复用罗尔定理（$n$ 个等值点 ⟹ $f^{(n-1)}$ 有根）。\n第(3)类 证存在 $\\xi$ 使 $f^{(n)}(\\xi)\\ge$ 或 $\\le$：用泰勒展式或反复用拉格朗日中值定理。\n\n常用「谁求导长成这样」反查表：\n$ff''+(f')^2\\Rightarrow(f f')'$； $f''+2f'\\Rightarrow(e^{2x}f')'\\cdot e^{-2x}$； $f'+f\\Rightarrow(e^xf)'$； $f'-f\\Rightarrow(e^{-x}f)'$；\n$xf'+f\\Rightarrow(xf)'$； $xf'-f\\Rightarrow\\left(\\dfrac{f}{x}\\right)'\\cdot x^2$； $f'+kf\\Rightarrow(e^{kx}f)'$。\n\n例（2017 数一第 18 题）：$f$ 在 $[0,1]$ 有二阶导数，$f(1)>0$，$\\lim\\limits_{x\\to0^+}\\dfrac{f(x)}{x}<0$。\n(I) 极限存在且分母 $\\to0^+$、极限为负 $\\Rightarrow f(0^+)=0$（连续故 $f(0)=0$），且极限 $<0$ 说明在 $0$ 的右侧附近 $\\dfrac{f(x)}{x}<0\\Rightarrow$ 存在 $c\\in(0,1)$ 使 $f(c)<0$。又 $f(1)>0$，在 $[c,1]$ 上用零点定理 $\\Rightarrow\\exists\\,\\eta\\in(c,1)\\subset(0,1)$，$f(\\eta)=0$。\n(II) 记 $\\varphi(x)=f(x)f'(x)$。由 (I)：$f(0)=f(\\eta)=0$，对 $f$ 在 $[0,\\eta]$ 用罗尔 $\\Rightarrow\\exists\\,\\xi_1\\in(0,\\eta)$，$f'(\\xi_1)=0\\Rightarrow\\varphi(\\xi_1)=0$。\n 又 $f(\\eta)=f(1)=0$，对 $f$ 在 $[\\eta,1]$ 用罗尔 $\\Rightarrow\\exists\\,\\xi_2\\in(\\eta,1)$，$f'(\\xi_2)=0\\Rightarrow\\varphi(\\xi_2)=0$。\n $0<\\xi_1<\\eta<\\xi_2<1$，$\\varphi$ 在 $[\\xi_1,\\xi_2]$ 连续可导且 $\\varphi(\\xi_1)=\\varphi(\\xi_2)=0$，对 $\\varphi$ 用罗尔：\n $$\\exists\\,\\xi\\in(\\xi_1,\\xi_2)\\subset(0,1),\\quad \\varphi'(\\xi)=f(\\xi)f''(\\xi)+[f'(\\xi)]^2=0$$\n 要证「至少两个不同实根」，就照上面再凑一对等值点（对 $f'$ 或换一个零点区间再走一遍罗尔），每多一组 $\\varphi$ 等值点就多一个根。\n\n口诀：「先翻译再构造：见等式想零点定理、见导数想罗尔；辅助函数问一句『谁求导长这样』；要 n 个根就凑 n 组等值点」。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_17_22",
    chapterId: "ch_gailv",
    chapterName: "概率论",
    sectionId: "function_distribution",
    sectionName: "随机变量函数的分布",
    title: "2017数一真题22 离散×连续求 Z=X+Y 密度的分段讨论",
    content: "第二问对 $z$ 的分类讨论有错：$X$ 只取 $0$ 和 $2$、$Y$ 的支撑是 $(0,1)$，所以 $Z$ 的支撑是 $(0,1)\\cup(2,3)$ 两段、中间 $[1,2]$ 上密度为 $0$。我当时把两段连起来写，也没按 $z$ 的分界逐段核。",
    mistakeType: "条件遗漏",
    importance: 5,
    correction: "离散型 × 连续型之和，不要套卷积公式硬算，用全概率分解最快：\n$$f_Z(z)=\\sum_i P\\{X=x_i\\}\\,f_Y(z-x_i)$$\n几何解释：$Y$ 的密度图像按每个 $x_i$ 平移，再按概率加权相加。所以支撑是各段平移后支撑的并，段与段之间可以是空的。\n\n分类讨论三步（防漏防重）：\n① 先写出 $Z$ 的支撑 = $\\bigcup_i\\{x_i\\}+\\operatorname{supp}(Y)$，把并集画在数轴上；\n② 只在支撑的每一段内部写表达式，段外一律填 $0$（不要假设连续）；\n③ 用 $\\int f_Z=1$ 验算，不为 1 说明有段漏了或系数错。\n\n例（2017 数一第 22 题）：$X,Y$ 独立，$P\\{X=0\\}=P\\{X=2\\}=\\dfrac12$，$f_Y(y)=\\begin{cases}2y,&0<y<1\\\\0,&\\text{其他}\\end{cases}$。\n(I) $E(Y)=\\int_0^1y\\cdot2y\\,dy=\\dfrac23$；$P\\{Y\\le E(Y)\\}=\\int_0^{2/3}2y\\,dy=\\dfrac49$。\n(II) $f_Z(z)=\\dfrac12 f_Y(z)+\\dfrac12 f_Y(z-2)$，其中 $f_Y(z)=2z\\ (0<z<1)$、$f_Y(z-2)=2(z-2)\\ (2<z<3)$：\n$$f_Z(z)=\\begin{cases}z,&0<z<1\\\\z-2,&2<z<3\\\\0,&\\text{其他}\\end{cases}$$\n验算：$\\int_0^1z\\,dz+\\int_2^3(z-2)\\,dz=\\dfrac12+\\dfrac12=1$ ✓。中间 $[1,2]$ 上确实是 $0$。\n\n口诀：「离散乘连续，全概率加权平移；先画支撑再写式，积分不等于一就有段漏了」。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_17_23",
    chapterId: "ch_gailv",
    chapterName: "概率论",
    sectionId: "estimation",
    sectionName: "参数估计",
    title: "2017数一真题23 绝对误差折叠密度 + 矩估计 + MLE",
    content: "正态分布的概率密度函数忘了，写不出 $f(x)=\\dfrac{1}{\\sqrt{2\\pi}\\sigma}e^{-(x-\\mu)^2/2\\sigma^2}$，于是 $Z=|X-\\mu|$ 的密度、似然函数全都推不下去。这题以后还得多做。",
    mistakeType: "公式不清",
    importance: 5,
    correction: "两个正态密度必须默写出来：\n$$X\\sim N(\\mu,\\sigma^2)\\Rightarrow f(x)=\\frac{1}{\\sqrt{2\\pi}\\,\\sigma}\\exp\\left\\{-\\frac{(x-\\mu)^2}{2\\sigma^2}\\right\\},\\qquad \\varphi(x)=\\frac{1}{\\sqrt{2\\pi}}e^{-x^2/2}\\ (N(0,1))$$\n标准化桥：$\\dfrac{X-\\mu}{\\sigma}\\sim N(0,1)$，所以 $f(x)=\\dfrac1\\sigma\\varphi\\!\\left(\\dfrac{x-\\mu}\\sigma\\right)$。\n\n取绝对值（折叠）密度的通用做法：$Z=|g(X)|$ 先写分布函数再求导。\n$$F_Z(z)=P\\{|X-\\mu|\\le z\\}=P\\{-z\\le X-\\mu\\le z\\}=2\\Phi\\!\\left(\\frac z\\sigma\\right)-1\\ (z\\ge0)$$\n$$f_Z(z)=F_Z'(z)=\\frac{2}{\\sigma}\\varphi\\!\\left(\\frac z\\sigma\\right)=\\begin{cases}\\dfrac{2}{\\sqrt{2\\pi}\\,\\sigma}e^{-z^2/2\\sigma^2},&z>0\\\\0,&z\\le0\\end{cases}$$\n系数 2 的来源：$\\pm z$ 两侧各贡献一份，折叠后合并。\n\n矩估计：算 $E(Z_1)=\\int_0^{\\infty}z\\cdot\\dfrac{2}{\\sqrt{2\\pi}\\sigma}e^{-z^2/2\\sigma^2}dz$，令 $t=\\dfrac z\\sigma$\n$$E(Z_1)=\\frac{2\\sigma}{\\sqrt{2\\pi}}\\int_0^{\\infty}te^{-t^2/2}dt=\\frac{2\\sigma}{\\sqrt{2\\pi}}\\cdot1=\\sigma\\sqrt{\\frac2\\pi}$$\n令 $\\bar Z=E(Z_1)$ 解出 $\\hat\\sigma=\\bar Z\\sqrt{\\dfrac{\\pi}2}$。\n\n最大似然：$L=\\prod\\limits_{i=1}^{n}\\dfrac{2}{\\sqrt{2\\pi}\\sigma}e^{-Z_i^2/2\\sigma^2}$\n$$\\ln L=n\\ln2-\\frac n2\\ln(2\\pi)-n\\ln\\sigma-\\frac{1}{2\\sigma^2}\\sum Z_i^2,\\qquad \\frac{d}{d\\sigma}=-\\frac n\\sigma+\\frac{1}{\\sigma^3}\\sum Z_i^2=0$$\n$$\\hat\\sigma=\\sqrt{\\frac1n\\sum_{i=1}^{n}Z_i^2}$$\n\n口诀：「绝对值先分布后密度、系数 2 是两边合；矩估计一阶矩解 σ、似然取对数求导；正态密度带 σ 在根号外，指数分母是 2σ²」。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_18_1",
    chapterId: "ch_gaoshu",
    chapterName: "高数",
    sectionId: "derivative_app",
    sectionName: "导数与微分应用",
    title: "18数一1 可导判定：左右导数定义优先",
    content: "题面：下列函数中在 $x=0$ 处不可导的是（A）$y=|x|\\sin|x|$ （B）$y=|x|\\sin\\sqrt{|x|}$ （C）$y=\\cos|x|$ （D）$y=\\cos\\sqrt{|x|}$。\n纯做快了，应该用定义去做的，想当然直接心算结果整错了。",
    mistakeType: "计算错误",
    importance: 3,
    correction: "判可导只有定义这一条路：$f'(0)=\\lim\\limits_{x\\to0}\\dfrac{f(x)-f(0)}{x}$，含绝对值或根号时必须分别算左右极限。\n\n例题（18 数一 1）：\n(A) 两侧都化成 $x\\sin x$、(C) 就是 $\\cos x$，都可导；\n(B) $\\dfrac{|x|\\sin\\sqrt{|x|}}{x}$，分子是 $|x|^{3/2}$ 阶，$\\to0$，可导且 $f'(0)=0$；\n(D) $\\dfrac{\\cos\\sqrt{|x|}-1}{x}\\approx-\\dfrac{|x|/2}{x}$，右极限 $-\\dfrac12$、左极限 $+\\dfrac12$，左右导数不等 $\\Rightarrow$ 不可导。\n选 (D)。\n\n口诀：「见绝对值先拆左右，等价无穷小只给阶、不给号」。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_18_5",
    chapterId: "ch_xiandai",
    chapterName: "线性代数",
    sectionId: "similarity",
    sectionName: "相似矩阵的性质",
    title: "18数一5 相似判定：比 $A-\\lambda E$ 的秩序列",
    content: "题面：下列矩阵中，与矩阵 $A=\\begin{pmatrix}1&1&0\\\\0&1&1\\\\0&0&1\\end{pmatrix}$ 相似的是（）\n(A)$\\begin{pmatrix}1&1&-1\\\\0&1&1\\\\0&0&1\\end{pmatrix}$ (B)$\\begin{pmatrix}1&0&-1\\\\0&1&1\\\\0&0&1\\end{pmatrix}$ (C)$\\begin{pmatrix}1&1&-1\\\\0&1&0\\\\0&0&1\\end{pmatrix}$ (D)$\\begin{pmatrix}1&0&-1\\\\0&1&0\\\\0&0&1\\end{pmatrix}$\n好题，常规思路很难做出来——四个选项特征值全是 1、行列式全是 1、迹全是 3，常规不变量一个都分不出来。",
    mistakeType: "方法不熟",
    importance: 4,
    correction: "特征值相同只是必要条件。相似的完整不变量族：$\\lambda$ 相同 $+\\ r(A-\\lambda E)$ 相同 $+\\ r\\big[(A-\\lambda E)^2\\big]$ 相同（即 Jordan 块结构相同）。\n\n例题（18 数一 5）：$A-E=\\begin{pmatrix}0&1&0\\\\0&0&1\\\\0&0&0\\end{pmatrix}$，$r(A-E)=2$ → 几何重数 $3-2=1$ → 一个三阶 Jordan 块；$(A-E)^2$ 秩 1，$(A-E)^3=0$。\n逐个验 $B-E$ 的秩：(A) 秩 2 且平方秩 1 → 同结构，相似 ✓；(B)(C)(D) 的 $B-E$ 秩都是 1 → 几何重数 2，Jordan 结构是 $2+1$ 或 $1+1+1$，都不相似。\n选 (A)。\n\n口诀：「比完特征值，再比 $A-\\lambda E$ 的秩序列；秩序列相同才同 Jordan 形」。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_18_6",
    chapterId: "ch_xiandai",
    chapterName: "线性代数",
    sectionId: "matrix_rank",
    sectionName: "矩阵的秩",
    title: "18数一6 分块秩：左乘管列、右乘管行",
    content: "题面：设 $A,B$ 为 $n$ 阶矩阵，记 $r(X)$ 为矩阵 $X$ 的秩，$(X,Y)$ 表示分块矩阵，则（）\n(A)$r(A,AB)=r(A)$ (B)$r(A,BA)=r(A)$ (C)$r(A,B)=\\max\\{r(A),r(B)\\}$ (D)$r(A,B)=r(A^T,B^T)$\n好题，分块矩阵的秩和列向量行向量的关系，属于我的知识盲区，这题确实难。",
    mistakeType: "概念混淆",
    importance: 5,
    correction: "把 $AB=C$ 按列分块读：$AB=A[\\beta_1,\\dots,\\beta_n]=[A\\beta_1,\\dots,A\\beta_n]$ → **$AB$ 的每一列都是 $A$ 的列向量的线性组合** → 加进 $(A,AB)$ 不增加列空间维数 → $r(A,AB)=r(A)$，(A) 对。\n按行分块读：$AB$ 的每一行是 $B$ 的行的线性组合 → $BA$ 的行由 $A$ 的行表示，但 $BA$ 的**列**与 $A$ 的列无关 → (B) 错。\n(C) 错：一般只有 $\\max\\{r(A),r(B)\\}\\le r(A,B)\\le r(A)+r(B)$；\n(D) 错：$r(A,B)$ 是列空间维数，$r(A^T,B^T)$ 是把行拼起来的秩，反例 $A=(1\\ 0),\\ B=(0\\ 1)$：前者 1、后者 2。\n\n口诀：「左乘管列、右乘管行」——$AB$ 的列归 $A$ 管，$AB$ 的行归 $B$ 管。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_18_8",
    chapterId: "ch_gailv",
    chapterName: "概率论",
    sectionId: "hypothesis_test",
    sectionName: "假设检验·显著性水平",
    title: "18数一8 $\\alpha$ 越小越难拒绝 $H_0$",
    content: "题面：设总体 $X$ 服从正态分布 $N(\\mu,\\sigma^2)$，$\\sigma^2$ 已知，$X_1,\\dots,X_n$ 是简单随机样本，据此检验 $H_0:\\mu=\\mu_0$ vs $H_1:\\mu\\ne\\mu_0$，则（）\n(A) 若 $\\alpha=0.05$ 下拒绝 $H_0$，那么 $\\alpha=0.01$ 下必拒绝\n(B) 若 $\\alpha=0.05$ 下拒绝 $H_0$，那么 $\\alpha=0.01$ 下必接受\n(C) 若 $\\alpha=0.05$ 下接受 $H_0$，那么 $\\alpha=0.01$ 下必拒绝\n(D) 若 $\\alpha=0.05$ 下接受 $H_0$，那么 $\\alpha=0.01$ 下必接受\n薄弱点：我以为 $\\alpha$ 越低、假设成立的要求会越严，和正式情况刚好反过来了。",
    mistakeType: "概念混淆",
    importance: 4,
    correction: "$\\alpha=P\\{\\text{拒绝 }H_0\\mid H_0\\text{ 真}\\}$（弃真概率）。$\\alpha$ 越小 → 拒绝域越小 → **拒绝 $H_0$ 的门槛越高**，也就是「更容易接受 $H_0$」，不是更严。\n包含关系：$\\alpha=0.01$ 的拒绝域 $\\subset$ $\\alpha=0.05$ 的拒绝域；反过来 $0.05$ 的接受域 $\\subset$ $0.01$ 的接受域。\n\n例题（18 数一 8）：$U=\\dfrac{\\bar X-\\mu_0}{\\sigma/\\sqrt n}$，$|U|>z_{\\alpha/2}$ 时拒绝；$\\alpha=0.05\\Rightarrow z=1.96$，$\\alpha=0.01\\Rightarrow z=2.58$。\n若 $|U|=2.2$：$0.05$ 下拒绝、$0.01$ 下接受 → (A)(B) 都不成立；\n若 $0.05$ 下接受（$|U|\\le1.96$），则必有 $|U|\\le2.58$ → $0.01$ 下必接受 → 选 (D)。\n\n口诀：「$\\alpha$ 是拒绝的门槛，门槛抬高难拒绝；小 $\\alpha$ 接受 ⇒ 大 $\\alpha$ 必接受」。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_18_11",
    chapterId: "ch_gaoshu",
    chapterName: "高数",
    sectionId: "vector_analysis",
    sectionName: "向量分析·旋度",
    title: "18数一11 旋度三行行列式默写",
    content: "题面：设 $F(x,y,z)=xy\\,i-yz\\,j+zx\\,k$，则 $rot\\,F(1,1,0)=$____。\n概念遗忘，最不该错的题。",
    mistakeType: "公式不清",
    importance: 5,
    correction: "旋度必须能默写：\n$$rot\\,F=\\nabla\\times F=\\begin{vmatrix}i&j&k\\\\[2pt]\\dfrac{\\partial}{\\partial x}&\\dfrac{\\partial}{\\partial y}&\\dfrac{\\partial}{\\partial z}\\\\[2pt]P&Q&R\\end{vmatrix}=\\big(R_y-Q_z,\\ P_z-R_x,\\ Q_x-P_y\\big)$$\n\n例题（18 数一 11）：$P=xy,\\ Q=-yz,\\ R=zx$。\n$R_y-Q_z=0-(-y)=y$；$P_z-R_x=0-z=-z$；$Q_x-P_y=0-x=-x$。\n故 $rot\\,F=(y,-z,-x)$，在 $(1,1,0)$ 处 $rot\\,F=(1,0,-1)$。\n\n口诀：「三行式：单位向量 / 偏导 / 分量；$i,j,k$ 交叉相减」。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_18_12",
    chapterId: "ch_gaoshu",
    chapterName: "高数",
    sectionId: "curve_integral",
    sectionName: "曲线积分·第一类",
    title: "18数一12 $\\oint ds$ 就是弧长，别漏乘 $2\\pi$",
    content: "题面：设 $L$ 为球面 $x^2+y^2+z^2=1$ 与平面 $x+y+z=0$ 的交线，则 $\\oint_L xy\\,ds=$____。\n方法完全对，最后求积分忘记乘周长 $2\\pi$ 了，限时下确实低级错误变多了，真不该错。",
    mistakeType: "计算错误",
    importance: 4,
    correction: "交线是过球心的大圆 → 半径 1 的圆，$\\oint_L ds=2\\pi$。第一类曲线积分里 $\\oint ds$ 恒等于弧长，这是最容易漏的那个因子。\n\n例题（18 数一 12）：在 $L$ 上 $x+y+z=0$，平方得 $x^2+y^2+z^2+2(xy+yz+zx)=0$，而 $x^2+y^2+z^2=1$ → $xy+yz+zx=-\\dfrac12$。\n由轮换对称性 $\\oint xy\\,ds=\\oint yz\\,ds=\\oint zx\\,ds$，三式相加：\n$$3\\oint_L xy\\,ds=\\oint_L\\left(-\\frac12\\right)ds=-\\frac12\\cdot2\\pi\\ \\Rightarrow\\ \\oint_L xy\\,ds=-\\frac{\\pi}{3}$$\n\n口诀：「对称性换成 $\\dfrac13$ 乘总和，最后一定乘弧长」。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_18_13",
    chapterId: "ch_xiandai",
    chapterName: "线性代数",
    sectionId: "eigen",
    sectionName: "特征值与特征向量",
    title: "18数一13 平方都是 1 且互异 ⇒ 一正一负",
    content: "题面：设 2 阶矩阵 $A$ 有两个不同的特征值，$\\alpha_1,\\alpha_2$ 是 $A$ 的线性无关的特征向量，且满足 $A^2(\\alpha_1+\\alpha_2)=\\alpha_1+\\alpha_2$，则 $|A|=$____。\n卧槽了，想都没想就写了 1，这个不该错，确实做太快了，选填就做了 52 分钟。",
    mistakeType: "审题失误",
    importance: 4,
    correction: "$A^2(\\alpha_1+\\alpha_2)=\\lambda_1^2\\alpha_1+\\lambda_2^2\\alpha_2=\\alpha_1+\\alpha_2$，由 $\\alpha_1,\\alpha_2$ 线性无关（系数对应相等）得 $\\lambda_1^2=\\lambda_2^2=1$。\n卡点在下一句：题设明说**两个特征值不同**，所以只能是 $\\{1,-1\\}$，不能同为 $1$ 或同为 $-1$。\n于是 $|A|=\\lambda_1\\lambda_2=-1$。\n\n口诀：「平方都等于 1 又互不相同 ⇒ 必一正一负，乘积取 $-1$」。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_18_15",
    chapterId: "ch_gaoshu",
    chapterName: "高数",
    sectionId: "integration_techniques",
    sectionName: "不定积分技巧与定积分计算",
    title: "18数一15 换元清根号，$\\arctan$ 求导别忘内层",
    content: "题面：求不定积分 $\\displaystyle\\int e^{2x}\\arctan\\sqrt{e^x-1}\\,dx$。（本题满分 10 分）\n真不该错，分部积分法后，对 $\\arctan$ 这个东西求导忘记对内部再求一次导了，低级错误。",
    mistakeType: "计算错误",
    importance: 3,
    correction: "复合求导要逐层乘，别停在最外层：\n$$\\left(\\arctan\\sqrt{e^x-1}\\right)'=\\frac{1}{1+(e^x-1)}\\cdot\\frac{e^x}{2\\sqrt{e^x-1}}=\\frac{1}{2\\sqrt{e^x-1}}$$\n漏掉第二个因子（内层导数）就是这道题的失分点。\n\n例题（18 数一 15）：令 $t=\\sqrt{e^x-1}$，则 $e^x=1+t^2$、$e^{2x}dx=2t(1+t^2)dt$，\n$$I=\\int(2t+2t^3)\\arctan t\\,dt=\\left(t^2+\\frac{t^4}{2}\\right)\\arctan t-\\int\\left(\\frac{t^2+1}{2}-\\frac{1}{2(1+t^2)}\\right)dt$$\n$$=\\left(t^2+\\frac{t^4}{2}+\\frac12\\right)\\arctan t-\\frac{t^3}{6}-\\frac t2+C=\\frac{e^{2x}}{2}\\arctan\\sqrt{e^x-1}-\\frac{(e^x+2)\\sqrt{e^x-1}}{6}+C$$\n回代时用到 $t^2+\\dfrac{t^4}{2}+\\dfrac12=\\dfrac{e^{2x}}{2}$（把 $t^2=e^x-1$ 展开即可验证）。\n\n口诀：「换元把根号清掉，分部只碰一次，回代必合并」。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_18_17",
    chapterId: "ch_gaoshu",
    chapterName: "高数",
    sectionId: "surface_integral",
    sectionName: "曲面积分与几何应用",
    title: "18数一17 高斯公式散度全加号 + 椭球体积",
    content: "题面：设 $\\Sigma$ 是曲面 $x=\\sqrt{1-3y^2-3z^2}$ 的前侧，计算曲面积分 $I=\\iint_\\Sigma x\\,dydz+(y^3+2)\\,dzdx+z^3\\,dxdy$。（本题满分 10 分）\n高斯公式里面的散度符号写成负号了，然后后面积分的时候，不知道椭圆面积公式和椭球体的体积公式。",
    mistakeType: "公式不清",
    importance: 4,
    correction: "高斯公式（取外侧时直接带正号）：\n$$\\iint_\\Sigma P\\,dydz+Q\\,dzdx+R\\,dxdy=\\iiint_\\Omega\\left(P_x+Q_y+R_z\\right)dV$$\n三个偏导之间是**加号**，不是正负交替。\n几何公式：椭球 $\\dfrac{x^2}{a^2}+\\dfrac{y^2}{b^2}+\\dfrac{z^2}{c^2}\\le1$ 的体积 $=\\dfrac43\\pi abc$；椭圆 $\\dfrac{x^2}{a^2}+\\dfrac{y^2}{b^2}\\le1$ 的面积 $=\\pi ab$。\n\n例题（18 数一 17）：$\\Sigma$ 是半椭球面 $x^2+3y^2+3z^2=1\\ (x\\ge0)$ 的前侧，补 $x=0$ 上的圆盘 $3y^2+3z^2\\le1$。补面上 $P=x=0$ 且法向沿 $x$，$dzdx$、$dxdy$ 投影为零 → 补面不贡献。\n$$I=\\iiint_\\Omega(1+3y^2+3z^2)dV=\\pi\\int_0^{1/3}(1+3s)\\sqrt{1-3s}\\,ds=\\frac{\\pi}{3}\\int_0^1(2-w)w^{1/2}dw=\\frac{\\pi}{3}\\left(\\frac43-\\frac25\\right)=\\frac{14\\pi}{45}$$\n（$s=y^2+z^2$，$w=1-3s$）。\n\n口诀：「散度全加号，补面看投影；椭球 $\\frac43\\pi abc$，椭圆 $\\pi ab$」。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_18_18",
    chapterId: "ch_gaoshu",
    chapterName: "高数",
    sectionId: "ode",
    sectionName: "微分方程",
    title: "18数一18 周期解：一个 $y(0)=y(T)$ 钉死常数",
    content: "题面：已知微分方程 $y'+y=f(x)$，其中 $f(x)$ 是 $R$ 上的连续函数。(I) 若 $f(x)=x$，求方程的通解；(II) 若 $f(x)$ 是周期 $T$ 的函数，证明：方程存在唯一的以 $T$ 为周期的解。（本题满分 10 分）\n就做对了第一小问，第二小问太难了，直接给了，完全没思路，我解析都不想看。",
    mistakeType: "思路缺失",
    importance: 5,
    correction: "(I) 一阶线性：$y'+y=x\\Rightarrow y=x-1+Ce^{-x}$。\n(II) 通解写成 $y(x)=e^{-x}\\left(C+\\displaystyle\\int_0^x f(t)e^tdt\\right)$。周期解的必要条件是 $y(T)=y(0)$：\n$$e^{-T}\\left(C+\\int_0^T f(t)e^tdt\\right)=C\\ \\Longrightarrow\\ C=\\frac{\\displaystyle\\int_0^T f(t)e^tdt}{e^T-1}$$\n因为 $T>0\\Rightarrow e^T-1\\ne0$，$C$ 被**唯一**确定；把它代回去得到的解满足 $y(x+T)=y(x)$（用 $f$ 的周期性验证一次即可）→ 存在。\n而齐次解 $Ce^{-x}$ 只有 $C=0$ 才周期 → 不可能再叠加出第二个周期解 → 唯一。\n\n口诀：「证周期解三步：写通解、令 $y(0)=y(T)$ 定 $C$、说齐次不周期保唯一」。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_18_21",
    chapterId: "ch_xiandai",
    chapterName: "线性代数",
    sectionId: "elementary_matrix",
    sectionName: "初等矩阵与矩阵方程",
    title: "18数一21 $A$ 不可逆时 $AP=B$ 按列拆方程组",
    content: "题面：已知 $a$ 是常数，且矩阵 $A=\\begin{pmatrix}1&2&a\\\\1&3&0\\\\2&7&-a\\end{pmatrix}$ 可经初等列变换化为矩阵 $B=\\begin{pmatrix}1&a&2\\\\0&1&1\\\\-1&1&1\\end{pmatrix}$。(I) 求 $a$；(II) 求满足 $AP=B$ 的可逆矩阵 $P$。（本题满分 11 分）\n服了，第二小题算 $P$ 等于 $A$ 逆 $B$，然后用初等行变换去算 $A$ 逆，发现 $A$ 不可逆，然后不会做了。",
    mistakeType: "思路缺失",
    importance: 5,
    correction: "「可经初等列变换化为」$\\Leftrightarrow$ 存在可逆矩阵 $P$ 使 $AP=B$（左乘初等矩阵 = 行变换，右乘 = 列变换）。\n本题 $|A|\\equiv0$ 恒成立，所以 $A$ 永远不可逆，$P=A^{-1}B$ 这条路根本不存在。\n\n(I) 由 $|A||P|=|B|$：$|B|=2-a$，而 $|A|=0$ → $2-a=0$ → $a=2$。\n(II) 把 $P=[\\xi_1,\\xi_2,\\xi_3]$ 按列拆开，解三个非齐次方程 $A\\xi_i=b_i$。$a=2$ 时\n$b_1=(1,0,-1)^T,\\quad b_2=b_3=(2,1,1)^T$，齐次解为 $k(-6,2,1)^T$。\n取 $\\xi_1=(3,-1,0)^T,\\ \\xi_2=(4,-1,0)^T,\\ \\xi_3=(-2,1,1)^T$（$\\xi_2,\\xi_3$ 右端相同，只能靠零空间取不同的 $k$ 拉开），得\n$$P=\\begin{pmatrix}3&4&-2\\\\-1&-1&1\\\\0&0&1\\end{pmatrix},\\qquad |P|=1\\ne0\\ \\checkmark$$\n\n口诀：「$AP=B$ 拆成列，$A\\xi_i=b_i$ 各解各；右端相同靠零空间拉开，最后必验 $|P|\\ne0$」。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_18_22",
    chapterId: "ch_gailv",
    chapterName: "概率论",
    sectionId: "discrete_rv",
    sectionName: "离散型随机变量",
    title: "18数一22 泊松是离散型：写分布律不写密度",
    content: "题面：设随机变量 $X$ 与 $Y$ 相互独立，$X$ 的概率分布为 $P\\{X=1\\}=P\\{X=-1\\}=\\dfrac12$，$Y$ 服从参数为 $\\lambda$ 的泊松分布。令 $Z=XY$。(I) 求 $Cov(X,Z)$；(II) 求 $Z$ 的概率分布。（本题满分 11 分）\n连续型×离散型的做多了，把泊松分布当成连续型的了，第二小问做错了。",
    mistakeType: "概念混淆",
    importance: 4,
    correction: "(I) $E[X]=0$，$E[Z]=E[X]E[Y]=0$；$E[XZ]=E[X^2Y]=E[X^2]E[Y]=1\\cdot\\lambda=\\lambda$ → $Cov(X,Z)=\\lambda\\ne0$（$X,Z$ 相关，虽然 $Z$ 的分布关于 0 对称）。\n(II) $Z$ 只能取 $0,\\pm1,\\pm2,\\dots$，是**离散型**，必须列分布律，不能写密度：\n$$P\\{Z=0\\}=P\\{Y=0\\}=e^{-\\lambda},\\qquad P\\{Z=k\\}=P\\{Z=-k\\}=\\frac12\\cdot\\frac{\\lambda^k}{k!}e^{-\\lambda}\\quad(k=1,2,\\dots)$$\n\n口诀：「泊松、二项、几何都是离散，见着就列表；$Z=XY$ 先把取值集合写出来再算概率」。",
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: "math_18_23",
    chapterId: "ch_gailv",
    chapterName: "概率论",
    sectionId: "mle",
    sectionName: "参数估计·最大似然",
    title: "18数一23 双指数：扒掉绝对值就是指数分布",
    content: "题面：设总体 $X$ 的概率密度为 $f(x;\\sigma)=\\dfrac{1}{2\\sigma}e^{-\\frac{|x|}{\\sigma}},\\ -\\infty<x<+\\infty$，其中 $\\sigma\\in(0,+\\infty)$ 为未知参数，$X_1,X_2,\\dots,X_n$ 为来自总体 $X$ 的简单随机样本，记 $\\sigma$ 的最大似然估计量为 $\\hat\\sigma$。(I) 求 $\\hat\\sigma$；(II) 求 $E(\\hat\\sigma),D(\\hat\\sigma)$。（本题满分 11 分）\n第二问计算复杂算错了，做到后面注意力下降了，没注意到积分形式和指数分布很像，理论上可以快速计算的。",
    mistakeType: "方法不熟",
    importance: 4,
    correction: "(I) $\\ln L=-n\\ln(2\\sigma)-\\dfrac1\\sigma\\sum\\limits_{i=1}^n|X_i|$，令 $\\dfrac{d\\ln L}{d\\sigma}=-\\dfrac n\\sigma+\\dfrac{1}{\\sigma^2}\\sum|X_i|=0$ → $\\hat\\sigma=\\dfrac1n\\sum\\limits_{i=1}^n|X_i|$。\n(II) 关键一步：当 $t>0$ 时 $P\\{|X|>t\\}=\\displaystyle\\int_t^{+\\infty}\\frac{1}{\\sigma}e^{-x/\\sigma}dx=e^{-t/\\sigma}$ → $|X|$ 服从参数为 $\\dfrac1\\sigma$ 的**指数分布**，于是直接搬结论 $E|X|=\\sigma,\\ D|X|=\\sigma^2$，不必再算广义积分：\n$$E(\\hat\\sigma)=\\sigma,\\qquad D(\\hat\\sigma)=\\frac{D|X|}{n}=\\frac{\\sigma^2}{n}$$\n\n口诀：「带绝对值的双指数，扒掉绝对值就是指数分布；$E=\\sigma$、$D=\\sigma^2$ 直接搬」。",
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

const openCorrections = ref<Set<string>>(new Set())

function isCorrectionOpen(id: string): boolean {
  return openCorrections.value.has(id)
}

function toggleCorrection(id: string) {
  const s = openCorrections.value
  if (s.has(id)) {
    s.delete(id)
  } else {
    s.add(id)
  }
}

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
            <div class="correction-collapse" v-if="p.correction">
              <div class="correction-toggle" @click="toggleCorrection(p.id)">
                <span class="toggle-arrow">{{ isCorrectionOpen(p.id) ? '▾' : '▸' }}</span>
                <span>{{ isCorrectionOpen(p.id) ? '收起解析与错因' : '展开解析与错因' }}</span>
              </div>
              <div class="problem-correction" v-show="isCorrectionOpen(p.id)" v-html="renderMath(p.correction)"></div>
            </div>
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
            <div class="correction-collapse" v-if="p.correction">
              <div class="correction-toggle" @click="toggleCorrection(p.id)">
                <span class="toggle-arrow">{{ isCorrectionOpen(p.id) ? '▾' : '▸' }}</span>
                <span>{{ isCorrectionOpen(p.id) ? '收起解析与错因' : '展开解析与错因' }}</span>
              </div>
              <div class="problem-correction" v-show="isCorrectionOpen(p.id)" v-html="renderMath(p.correction)"></div>
            </div>
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
            <div class="correction-collapse" v-if="p.correction">
              <div class="correction-toggle" @click="toggleCorrection(p.id)">
                <span class="toggle-arrow">{{ isCorrectionOpen(p.id) ? '▾' : '▸' }}</span>
                <span>{{ isCorrectionOpen(p.id) ? '收起解析与错因' : '展开解析与错因' }}</span>
              </div>
              <div class="problem-correction" v-show="isCorrectionOpen(p.id)" v-html="renderMath(p.correction)"></div>
            </div>
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

.correction-collapse {
  margin-bottom: 12px;
}

.correction-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: #8ab4a0;
  font-size: 0.85em;
  user-select: none;
  padding: 4px 0;
}

.correction-toggle:hover {
  color: #a8d4be;
}

.toggle-arrow {
  font-size: 0.8em;
}

.correction-collapse .problem-correction {
  margin-bottom: 0;
  margin-top: 6px;
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

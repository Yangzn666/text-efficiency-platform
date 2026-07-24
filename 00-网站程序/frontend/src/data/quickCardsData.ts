/**
 * 数学速查卡片数据（LaTeX 版）
 * - 高等数学 9 章 + 线性代数 6 章 + 概率统计 8 章，与网站知识点章节一一对应
 * - 公式用 $...$（行内）与 $$...$$（块级）包裹，由 QuickCards.vue 的 texify 交给 KaTeX 渲染
 * - 注意：TS 字符串里 LaTeX 反斜杠需写成 \\
 */

export interface QuickCard {
  id: string
  /** 正面：自测问题 */
  front: string
  /** 背面：核心公式/定理/结论 */
  back: string
}

export interface QuickChapter {
  id: string
  title: string
  cards: QuickCard[]
}

export type QuickSubjectKey = 'higher' | 'linear' | 'gailv'

// ==================== 高等数学（9章） ====================
const higherChapters: QuickChapter[] = [
  {
    id: 'gaoshu-01',
    title: '第1章 函数 极限 连续',
    cards: [
      { id: 'gaoshu-01-1', front: '两个重要极限是什么？', back: '$$\\lim_{x\\to 0}\\frac{\\sin x}{x}=1$$\n$$\\lim_{x\\to\\infty}\\left(1+\\frac{1}{x}\\right)^x=e$$\n第二个也常写作 $\\lim_{t\\to 0}(1+t)^{1/t}=e$。' },
      { id: 'gaoshu-01-2', front: 'x→0 时常用等价无穷小有哪些？', back: '$\\sin x\\sim x$，$\\tan x\\sim x$，$\\arcsin x\\sim x$，$\\arctan x\\sim x$\n$\\ln(1+x)\\sim x$，$e^x-1\\sim x$\n$1-\\cos x\\sim\\dfrac{x^2}{2}$，$(1+x)^a-1\\sim ax$' },
      { id: 'gaoshu-01-3', front: '洛必达法则适用条件？', back: '仅适用于 $\\frac{0}{0}$ 或 $\\frac{\\infty}{\\infty}$ 型未定式：\n$$\\lim\\frac{f(x)}{g(x)}=\\lim\\frac{f\'(x)}{g\'(x)}$$\n（右端极限存在或为 $\\infty$）。使用前先化简，可配合等价无穷小替换。' },
      { id: 'gaoshu-01-4', front: '常用泰勒展开（x→0）？', back: '$e^x=1+x+\\dfrac{x^2}{2!}+\\dfrac{x^3}{3!}+o(x^3)$\n$\\ln(1+x)=x-\\dfrac{x^2}{2}+\\dfrac{x^3}{3}+o(x^3)$\n$\\sin x=x-\\dfrac{x^3}{3!}+o(x^3)$\n$\\cos x=1-\\dfrac{x^2}{2!}+o(x^2)$\n$\\dfrac{1}{1-x}=1+x+x^2+o(x^2)$' },
      { id: 'gaoshu-01-5', front: '极限的夹逼准则与单调有界准则？', back: '夹逼：若 $g(x)\\le f(x)\\le h(x)$ 且 $\\lim g=\\lim h=A$，则 $\\lim f=A$。\n单调有界：单调递增有上界（或递减有下界）的数列必收敛。常用于递推数列求极限。' },
      { id: 'gaoshu-01-6', front: '间断点如何分类？', back: '第一类：左右极限都存在。\n  可去间断点：$\\lim_{x\\to x_0}f$ 存在但 $\\ne f(x_0)$（或未定义）\n  跳跃间断点：左右极限不相等\n第二类：左右极限至少一个不存在（如 $\\infty$、振荡）。' }
    ]
  },
  {
    id: 'gaoshu-02',
    title: '第2章 一元函数微分学',
    cards: [
      { id: 'gaoshu-02-1', front: '导数的定义式与几何意义？', back: '$$f\'(x_0)=\\lim_{\\Delta x\\to 0}\\frac{f(x_0+\\Delta x)-f(x_0)}{\\Delta x}$$\n几何意义：曲线在该点切线斜率。可导必连续，连续不一定可导。' },
      { id: 'gaoshu-02-2', front: '复合函数求导（链式法则）？', back: '$$\\frac{dy}{dx}=\\frac{dy}{du}\\cdot\\frac{du}{dx}$$\n逐层求导，由外向内。' },
      { id: 'gaoshu-02-3', front: '罗尔、拉格朗日、柯西中值定理？', back: '罗尔：$f$ 在 $[a,b]$ 连续、$(a,b)$ 可导且 $f(a)=f(b)$，则 $\\exists\\xi$ 使 $f\'(\\xi)=0$。\n拉格朗日：$f(b)-f(a)=f\'(\\xi)(b-a)$。\n柯西：$\\dfrac{f(b)-f(a)}{g(b)-g(a)}=\\dfrac{f\'(\\xi)}{g\'(\\xi)}$。' },
      { id: 'gaoshu-02-4', front: '极值的判定方法？', back: '必要条件：$f\'(x_0)=0$（驻点）。\n第一充分条件：$f\'$ 左正右负→极大，左负右正→极小。\n第二充分条件：$f\'(x_0)=0$ 且 $f\'\'(x_0)<0$→极大，$f\'\'(x_0)>0$→极小。' },
      { id: 'gaoshu-02-5', front: '凹凸性与拐点怎么判断？', back: '$f\'\'(x)>0$ → 曲线凹（向上）；$f\'\'(x)<0$ → 凸。\n拐点：凹凸性改变的分界点，候选点为 $f\'\'(x)=0$ 或不存在处，需验证两侧 $f\'\'$ 变号。' },
      { id: 'gaoshu-02-6', front: '曲率与曲率半径？', back: '$$K=\\frac{|y\'\'|}{(1+y\'^2)^{3/2}},\\quad R=\\frac{1}{K}$$\n圆的曲率处处为 $1/R$。' }
    ]
  },
  {
    id: 'gaoshu-03',
    title: '第3章 一元函数积分学',
    cards: [
      { id: 'gaoshu-03-1', front: '牛顿-莱布尼茨公式？', back: '$$\\int_a^b f(x)\\,dx=F(b)-F(a)$$\n其中 $F$ 是 $f$ 的任一原函数。' },
      { id: 'gaoshu-03-2', front: '分部积分公式与口诀？', back: '$$\\int u\\,dv=uv-\\int v\\,du$$\n口诀：反、对、幂、三、指（优先作 $u$ 的顺序）。' },
      { id: 'gaoshu-03-3', front: '旋转体体积公式？', back: '绕 $x$ 轴（圆盘法）：$V=\\pi\\int_a^b f^2(x)\\,dx$\n绕 $y$ 轴（柱壳法）：$V=2\\pi\\int_a^b x\\,f(x)\\,dx$' },
      { id: 'gaoshu-03-4', front: '变上限积分求导？', back: '$$\\frac{d}{dx}\\int_a^{\\varphi(x)}f(t)\\,dt=f(\\varphi(x))\\cdot\\varphi\'(x)$$\n更一般：$\\dfrac{d}{dx}\\int_{\\alpha(x)}^{\\beta(x)}f(t)dt=f(\\beta)\\beta\'-f(\\alpha)\\alpha\'$。' },
      { id: 'gaoshu-03-5', front: '定积分的常用性质？', back: '区间可加性、保号性、估值定理、积分中值定理：\n$\\int_a^b f=g(\\xi)(b-a)$ 不成立——正确的是 $\\int_a^b f(x)dx=f(\\xi)(b-a)$（$f$ 连续）。\n奇函数在对称区间积分为 $0$，偶函数为 $2$ 倍半区间。' },
      { id: 'gaoshu-03-6', front: '反常积分收敛怎么判断？', back: '$\\int_a^{+\\infty}\\dfrac{dx}{x^p}$：$p>1$ 收敛，$p\\le 1$ 发散。\n$\\int_a^b\\dfrac{dx}{(x-a)^p}$（瑕点 $a$）：$p<1$ 收敛，$p\\ge 1$ 发散。\n用比较审敛法与极限形式判定一般情形。' }
    ]
  },
  {
    id: 'gaoshu-04',
    title: '第4章 常微分方程',
    cards: [
      { id: 'gaoshu-04-1', front: '一阶线性方程 y′+P(x)y=Q(x) 通解？', back: '$$y=e^{-\\int P\\,dx}\\left[\\int Q\\,e^{\\int P\\,dx}dx+C\\right]$$\n先求 $\\int P\\,dx$，再套公式。' },
      { id: 'gaoshu-04-2', front: '可分离变量方程怎么解？', back: '形如 $\\dfrac{dy}{dx}=g(x)h(y)$。\n分离：$\\dfrac{dy}{h(y)}=g(x)dx$，两边积分。' },
      { id: 'gaoshu-04-3', front: '二阶常系数齐次方程解法？', back: '$y\'\'+py\'+qy=0$ → 特征方程 $r^2+pr+q=0$。\n$\\Delta>0$：两单实根 → $C_1e^{r_1x}+C_2e^{r_2x}$\n$\\Delta=0$：重根 → $(C_1+C_2x)e^{rx}$\n$\\Delta<0$：共轭复根 $\\alpha\\pm\\beta i$ → $e^{\\alpha x}(C_1\\cos\\beta x+C_2\\sin\\beta x)$' },
      { id: 'gaoshu-04-4', front: '非齐次方程通解结构？', back: '$$y=Y+y^*$$\n$Y$ 为对应齐次方程通解，$y^*$ 为一个特解。' },
      { id: 'gaoshu-04-5', front: 'f(x)=Pₙ(x)e^{λx} 型特解怎么设？', back: '设 $y^*=x^k Q_n(x)e^{\\lambda x}$。\n$k$ 为 $\\lambda$ 作为特征根的重数：不是根取 $0$，单根取 $1$，重根取 $2$。$Q_n$ 与 $P_n$ 同次。' },
      { id: 'gaoshu-04-6', front: '可降阶的两类方程？', back: '$y\'\'=f(x,y\')$：令 $p=y\'$ 化为一阶方程。\n$y\'\'=f(y,y\')$：令 $p=y\'$，则 $y\'\'=p\\dfrac{dp}{dy}$。' }
    ]
  },
  {
    id: 'gaoshu-05',
    title: '第5章 多元函数微分学',
    cards: [
      { id: 'gaoshu-05-1', front: '全微分公式？', back: '$$dz=\\frac{\\partial z}{\\partial x}dx+\\frac{\\partial z}{\\partial y}dy$$\n偏导连续 ⇒ 可微 ⇒ 偏导存在。' },
      { id: 'gaoshu-05-2', front: '多元复合函数求导法则？', back: '$$\\frac{\\partial z}{\\partial x}=\\frac{\\partial z}{\\partial u}\\frac{\\partial u}{\\partial x}+\\frac{\\partial z}{\\partial v}\\frac{\\partial v}{\\partial x}$$\n画变量关系图，逐条路径相加。' },
      { id: 'gaoshu-05-3', front: '二元函数极值的必要条件？', back: '在驻点处 $\\dfrac{\\partial z}{\\partial x}=0$ 且 $\\dfrac{\\partial z}{\\partial y}=0$。\n极值点一定是驻点，驻点不一定是极值点。' },
      { id: 'gaoshu-05-4', front: '二元函数极值的充分条件？', back: '设 $A=f_{xx}\'\',B=f_{xy}\'\',C=f_{yy}\'\'$：\n$AC-B^2>0$ 且 $A<0$ → 极大\n$AC-B^2>0$ 且 $A>0$ → 极小\n$AC-B^2<0$ → 无极值（鞍点）' },
      { id: 'gaoshu-05-5', front: '条件极值用什么方法？', back: '拉格朗日乘数法：求 $F(x,y,\\lambda)=f+\\lambda\\varphi$ 的驻点，\n$$\\begin{cases}f_x+\\lambda\\varphi_x=0\\\\f_y+\\lambda\\varphi_y=0\\\\\\varphi(x,y)=0\\end{cases}$$\n实际问题中最值往往就是唯一驻点。' },
      { id: 'gaoshu-05-6', front: '方向导数与梯度？', back: '方向导数 $\\dfrac{\\partial f}{\\partial l}=f_x\\cos\\alpha+f_y\\cos\\beta$。\n梯度 $\\nabla f=(f_x,f_y)$，指向方向导数最大（增长最快）的方向，模为最大方向导数。' }
    ]
  },
  {
    id: 'gaoshu-06',
    title: '第6章 二重积分',
    cards: [
      { id: 'gaoshu-06-1', front: '二重积分化累次积分？', back: 'X型：$\\iint f\\,dxdy=\\int_a^b dx\\int_{y_1(x)}^{y_2(x)} f\\,dy$\nY型：$\\iint f\\,dxdy=\\int_c^d dy\\int_{x_1(y)}^{x_2(y)} f\\,dx$\n先画图确定积分区域类型，必要时交换积分次序。' },
      { id: 'gaoshu-06-2', front: '极坐标变换？', back: '$x=r\\cos\\theta$，$y=r\\sin\\theta$，面积元 $dxdy=r\\,drd\\theta$（别漏 $r$！）。\n适用：圆形区域、$x^2+y^2$ 型被积函数。' },
      { id: 'gaoshu-06-3', front: '二重积分的对称性？', back: '区域关于 $x$ 轴对称：\n$f$ 关于 $y$ 为奇函数 → 积分为 $0$\n$f$ 关于 $y$ 为偶函数 → $2$ 倍半区域积分。\n轮换对称：区域关于 $y=x$ 对称时可互换 $x,y$。' },
      { id: 'gaoshu-06-4', front: '二重积分的估值与中值定理？', back: '$m\\cdot S\\le\\iint_D f\\,d\\sigma\\le M\\cdot S$（$m,M$ 为 $f$ 在 $D$ 上的最小、最大值，$S$ 为面积）。\n中值定理：$\\iint_D f\\,d\\sigma=f(\\xi,\\eta)\\cdot S$。' }
    ]
  },
  {
    id: 'gaoshu-07',
    title: '第7章 无穷级数',
    cards: [
      { id: 'gaoshu-07-1', front: '级数收敛的必要条件？', back: '若 $\\sum a_n$ 收敛，则 $\\lim a_n=0$。\n必要不充分：调和级数 $\\sum\\dfrac{1}{n}$ 发散。' },
      { id: 'gaoshu-07-2', front: '比值审敛法（达朗贝尔）？', back: '$\\lim\\left|\\dfrac{a_{n+1}}{a_n}\\right|=\\rho$：\n$\\rho<1$ 收敛；$\\rho>1$ 发散；$\\rho=1$ 失效。\n适合含 $n!$ 或 $a^n$ 的级数。' },
      { id: 'gaoshu-07-3', front: '幂级数收敛半径怎么求？', back: '$$R=\\frac{1}{\\lim|a_{n+1}/a_n|}$$\n收敛区间 $(-R,R)$，端点 $x=\\pm R$ 需单独代入判断。' },
      { id: 'gaoshu-07-4', front: '几何级数展开式？', back: '$$\\frac{1}{1-x}=\\sum_{n=0}^{\\infty}x^n=1+x+x^2+\\cdots\\quad(|x|<1)$$\n逐项求导/积分可推出 $\\ln(1+x)$、$\\arctan x$ 等展开。' },
      { id: 'gaoshu-07-5', front: '交错级数的莱布尼茨判别法？', back: '若 $|a_n|$ 单调递减趋于 $0$，则 $\\sum(-1)^{n-1}a_n$ 收敛。\n余项估计：$|R_n|\\le a_{n+1}$。' },
      { id: 'gaoshu-07-6', front: '绝对收敛与条件收敛？', back: '$\\sum|a_n|$ 收敛 → 绝对收敛（必收敛）。\n$\\sum a_n$ 收敛但 $\\sum|a_n|$ 发散 → 条件收敛（如 $\\sum\\dfrac{(-1)^{n-1}}{n}$）。' }
    ]
  },
  {
    id: 'gaoshu-08',
    title: '第8章 空间解析几何',
    cards: [
      { id: 'gaoshu-08-1', front: '向量数量积（点乘）？', back: '$\\vec a\\cdot\\vec b=|\\vec a||\\vec b|\\cos\\theta=a_1b_1+a_2b_2+a_3b_3$\n$\\vec a\\perp\\vec b\\Leftrightarrow\\vec a\\cdot\\vec b=0$' },
      { id: 'gaoshu-08-2', front: '向量向量积（叉乘）？', back: '$|\\vec a\\times\\vec b|=|\\vec a||\\vec b|\\sin\\theta$，方向右手定则。\n$\\vec a\\parallel\\vec b\\Leftrightarrow\\vec a\\times\\vec b=\\vec 0$\n几何意义：以 $\\vec a,\\vec b$ 为邻边的平行四边形面积。' },
      { id: 'gaoshu-08-3', front: '平面方程（点法式）？', back: '$$A(x-x_0)+B(y-y_0)+C(z-z_0)=0$$\n法向量 $\\vec n=(A,B,C)$，过点 $(x_0,y_0,z_0)$。' },
      { id: 'gaoshu-08-4', front: '直线方程与点到平面距离？', back: '点向式：$\\dfrac{x-x_0}{m}=\\dfrac{y-y_0}{n}=\\dfrac{z-z_0}{p}$（方向向量 $(m,n,p)$）。\n点到平面距离：$d=\\dfrac{|Ax_0+By_0+Cz_0+D|}{\\sqrt{A^2+B^2+C^2}}$' },
      { id: 'gaoshu-08-5', front: '常见二次曲面？', back: '球面 $x^2+y^2+z^2=R^2$\n椭球面 $\\dfrac{x^2}{a^2}+\\dfrac{y^2}{b^2}+\\dfrac{z^2}{c^2}=1$\n圆锥面 $z^2=\\dfrac{x^2+y^2}{\\tan^2\\alpha}$\n旋转抛物面 $z=x^2+y^2$' }
    ]
  },
  {
    id: 'gaoshu-09',
    title: '第9章 多元积分学',
    cards: [
      { id: 'gaoshu-09-1', front: '三重积分柱面坐标？', back: '$x=r\\cos\\theta$，$y=r\\sin\\theta$，$z=z$，体积元 $dv=r\\,drd\\theta dz$。\n适用：圆柱、圆锥、球对称区域。' },
      { id: 'gaoshu-09-2', front: '格林公式？', back: '$$\\oint_L Pdx+Qdy=\\iint_D\\left(\\frac{\\partial Q}{\\partial x}-\\frac{\\partial P}{\\partial y}\\right)dxdy$$\n$L$ 为区域 $D$ 的正向（逆时针）边界曲线。' },
      { id: 'gaoshu-09-3', front: '曲线积分与路径无关的条件？', back: '在单连通区域内：\n$\\dfrac{\\partial Q}{\\partial x}=\\dfrac{\\partial P}{\\partial y}\\Leftrightarrow$ 曲线积分与路径无关 $\\Leftrightarrow$ 存在 $u$ 使 $du=Pdx+Qdy$。' },
      { id: 'gaoshu-09-4', front: '高斯公式（散度定理）？', back: '$$\\oiint_\\Sigma Pdydz+Qdzdx+Rdxdy=\\iiint_\\Omega\\left(\\frac{\\partial P}{\\partial x}+\\frac{\\partial Q}{\\partial y}+\\frac{\\partial R}{\\partial z}\\right)dv$$\n$\\Sigma$ 为闭曲面外侧。' },
      { id: 'gaoshu-09-5', front: '斯托克斯公式？', back: '$\\oint_L Pdx+Qdy+Rdz=\\iint_\\Sigma\\left(\\dfrac{\\partial R}{\\partial y}-\\dfrac{\\partial Q}{\\partial z}\\right)dydz+\\left(\\dfrac{\\partial P}{\\partial z}-\\dfrac{\\partial R}{\\partial x}\\right)dzdx+\\left(\\dfrac{\\partial Q}{\\partial x}-\\dfrac{\\partial P}{\\partial y}\\right)dxdy$\n空间闭曲线与以它为边界的曲面之间的转化。' }
    ]
  }
]

// ==================== 线性代数（6章，按知识链） ====================
const linearChapters: QuickChapter[] = [
  {
    id: 'xiandai-01',
    title: '第1章 行列式',
    cards: [
      { id: 'xiandai-01-1', front: 'n阶行列式的定义？', back: '$n!$ 项的代数和，每项是取自不同行不同列的 $n$ 个元素之积，符号由列标排列的逆序数决定：$(-1)^{\\tau(j_1\\cdots j_n)}$。' },
      { id: 'xiandai-01-2', front: '行列式的重要性质？', back: '$|A^T|=|A|$\n$|kA|=k^n|A|$（$n$ 阶矩阵，$k$ 要乘 $n$ 次方！）\n$|AB|=|A|\\cdot|B|$' },
      { id: 'xiandai-01-3', front: '行列式按行（列）展开？', back: '$$|A|=\\sum_{k=1}^n a_{ik}A_{ik}$$\n代数余子式 $A_{ik}=(-1)^{i+k}M_{ik}$（对任意第 $i$ 行成立）。' },
      { id: 'xiandai-01-4', front: '克拉默法则？', back: '$n$ 个方程 $n$ 个未知数，系数行列式 $D=|A|\\ne 0$ 时：\n$$x_i=\\frac{D_i}{D}$$\n$D_i$ 为用 $b$ 替换第 $i$ 列后的行列式。' },
      { id: 'xiandai-01-5', front: '范德蒙行列式？', back: '$$\\begin{vmatrix}1&1&\\cdots&1\\\\x_1&x_2&\\cdots&x_n\\\\\\vdots&\\vdots&&\\vdots\\\\x_1^{n-1}&x_2^{n-1}&\\cdots&x_n^{n-1}\\end{vmatrix}=\\prod_{1\\le j<i\\le n}(x_i-x_j)$$\n大下标减小下标，逐项相乘。' }
    ]
  },
  {
    id: 'xiandai-02',
    title: '第2章 矩阵',
    cards: [
      { id: 'xiandai-02-1', front: '矩阵可逆的充要条件？', back: '$|A|\\ne 0\\Leftrightarrow r(A)=n\\Leftrightarrow A$ 可经初等变换化为 $E$\n$\\Leftrightarrow Ax=0$ 只有零解 $\\Leftrightarrow A$ 可表示为初等矩阵之积。' },
      { id: 'xiandai-02-2', front: '逆矩阵的性质？', back: '$(AB)^{-1}=B^{-1}A^{-1}$（穿脱原则）\n$(A^T)^{-1}=(A^{-1})^T$\n$(kA)^{-1}=\\dfrac{1}{k}A^{-1}$，$(A^{-1})^{-1}=A$' },
      { id: 'xiandai-02-3', front: '矩阵的秩的性质？', back: '$r(A)$ = 最高阶非零子式的阶数。\n$r(AB)\\le\\min(r(A),r(B))$\n$r(A+B)\\le r(A)+r(B)$\n$A$ 可逆时 $r(AB)=r(B)$。' },
      { id: 'xiandai-02-4', front: '初等变换与秩的关系？', back: '初等行（列）变换不改变矩阵的秩。\n$A\\sim B$（等价）$\\Leftrightarrow r(A)=r(B)$。\n求秩：化为行阶梯形，数非零行。' },
      { id: 'xiandai-02-5', front: '伴随矩阵 A* 的性质？', back: '$AA^*=A^*A=|A|E$\n$|A^*|=|A|^{n-1}$\n$(A^*)^{-1}=(A^{-1})^*=\\dfrac{A}{|A|}$\n$r(A^*)$：$r(A)=n$ 时为 $n$；$r(A)=n-1$ 时为 $1$；否则为 $0$。' }
    ]
  },
  {
    id: 'xiandai-03',
    title: '第3章 向量',
    cards: [
      { id: 'xiandai-03-1', front: '向量组线性相关的定义？', back: '存在不全为零的 $k_1,\\cdots,k_s$ 使 $k_1\\alpha_1+\\cdots+k_s\\alpha_s=0$。\n相关 $\\Leftrightarrow$ 至少有一个向量可由其余向量线性表示。' },
      { id: 'xiandai-03-2', front: '秩与线性相关性的关系？', back: '向量组 $\\alpha_1,\\cdots,\\alpha_s$：\n线性相关 $\\Leftrightarrow r(\\alpha_1,\\cdots,\\alpha_s)<s$\n线性无关 $\\Leftrightarrow r(\\alpha_1,\\cdots,\\alpha_s)=s$' },
      { id: 'xiandai-03-3', front: '线性相关与方程组的联系？', back: '以 $\\alpha_i$ 为列构成 $A$：\n$\\alpha_1,\\cdots,\\alpha_n$ 线性相关 $\\Leftrightarrow Ax=0$ 有非零解\n线性无关 $\\Leftrightarrow Ax=0$ 只有零解。' },
      { id: 'xiandai-03-4', front: '极大线性无关组的性质？', back: '向量组中任一向量都可由极大无关组唯一线性表示。\n极大无关组所含向量个数 = 向量组的秩。' },
      { id: 'xiandai-03-5', front: '向量个数与维数的关系？', back: '$n$ 维空间中任意 $n+1$ 个向量必线性相关。\n$n$ 个 $n$ 维向量线性无关 $\\Leftrightarrow$ 行列式 $\\ne 0$。' }
    ]
  },
  {
    id: 'xiandai-04',
    title: '第4章 线性方程组',
    cards: [
      { id: 'xiandai-04-1', front: '齐次方程组 Ax=0 何时有非零解？', back: '$r(A)<n$（未知数个数）时有非零解；\n$r(A)=n$ 时只有零解。' },
      { id: 'xiandai-04-2', front: 'Ax=0 通解结构？', back: '$$x=k_1\\xi_1+\\cdots+k_{n-r}\\xi_{n-r}$$\n$\\xi_i$ 为基础解系，含 $n-r(A)$ 个线性无关解。' },
      { id: 'xiandai-04-3', front: '非齐次方程组 Ax=b 有解条件？', back: '有解 $\\Leftrightarrow r(A)=r(A|b)$。\n$r(A)=n$ → 唯一解；$r(A)<n$ → 无穷多解。\n$r(A)<r(A|b)$ → 无解。' },
      { id: 'xiandai-04-4', front: 'Ax=b 通解结构？', back: '$$x=\\eta^*+k_1\\xi_1+\\cdots+k_{n-r}\\xi_{n-r}$$\n$\\eta^*$ 为一个特解，后项为 $Ax=0$ 的通解。' },
      { id: 'xiandai-04-5', front: '非齐次解的性质？', back: '$\\eta_1,\\eta_2$ 都是 $Ax=b$ 的解，则 $\\eta_1-\\eta_2$ 是 $Ax=0$ 的解。\n$k\\eta_1+(1-k)\\eta_2$ 仍是 $Ax=b$ 的解（系数和为 $1$）。' }
    ]
  },
  {
    id: 'xiandai-05',
    title: '第5章 特征值与特征向量',
    cards: [
      { id: 'xiandai-05-1', front: '特征值与特征向量的定义？', back: '$$A\\alpha=\\lambda\\alpha\\quad(\\alpha\\ne 0)$$\n$\\lambda$ 为特征值，$\\alpha$ 为属于 $\\lambda$ 的特征向量。' },
      { id: 'xiandai-05-2', front: '如何求特征值与特征向量？', back: '解特征方程 $|\\lambda E-A|=0$ 得 $\\lambda$。\n再解 $(\\lambda E-A)x=0$ 得基础解系，即特征向量。' },
      { id: 'xiandai-05-3', front: '特征值的重要性质？', back: '$\\sum\\lambda_i=\\mathrm{tr}(A)$（主对角线元素之和）\n$\\prod\\lambda_i=|A|$\n$A$ 可逆 $\\Rightarrow\\lambda\\ne 0$，且 $A^{-1}$ 特征值为 $1/\\lambda$，$A^k$ 特征值为 $\\lambda^k$。' },
      { id: 'xiandai-05-4', front: '矩阵可对角化的条件？', back: '$A$ 有 $n$ 个线性无关特征向量 $\\Leftrightarrow A\\sim\\Lambda$。\n充分条件：$n$ 个互异特征值；或 $A$ 为实对称矩阵。\n重特征值需验证几何重数 = 代数重数。' },
      { id: 'xiandai-05-5', front: '实对称矩阵的性质？', back: '特征值全为实数。\n不同特征值的特征向量正交。\n必可正交对角化：$Q^{-1}AQ=Q^TAQ=\\Lambda$（$Q$ 为正交矩阵）。' },
      { id: 'xiandai-05-6', front: '相似矩阵的性质？', back: '$A\\sim B$（存在可逆 $P$ 使 $P^{-1}AP=B$）则：\n特征值相同、行列式相同、秩相同、迹相同、特征多项式相同。' }
    ]
  },
  {
    id: 'xiandai-06',
    title: '第6章 二次型',
    cards: [
      { id: 'xiandai-06-1', front: '二次型的矩阵表示？', back: '$$f=x^TAx$$\n$A$ 为实对称矩阵。二次型的秩 $=r(A)=$ 标准形中非零项个数。' },
      { id: 'xiandai-06-2', front: '如何化二次型为标准形？', back: '正交变换 $x=Qy$：$f=\\lambda_1y_1^2+\\cdots+\\lambda_ny_n^2$。\n$\\lambda_i$ 为 $A$ 的特征值，$Q$ 由正交单位化特征向量构成。也可用配方法（合同变换）。' },
      { id: 'xiandai-06-3', front: '正定的充要条件？', back: '特征值全 $>0$\n$\\Leftrightarrow$ 各阶顺序主子式全 $>0$\n$\\Leftrightarrow$ 正惯性指数 $=n$ $\\Leftrightarrow$ $A$ 合同于 $E$。' },
      { id: 'xiandai-06-4', front: '惯性定理？', back: '经可逆线性变换化成的标准形中，正平方项个数（正惯性指数 $p$）与负平方项个数（负惯性指数 $q$）是唯一确定的。$p+q=r(A)$。' },
      { id: 'xiandai-06-5', front: '合同与相似的区别？', back: '合同：$C^TAC=B$（$C$ 可逆），保持正负惯性指数，实对称矩阵必合同于对角阵。\n相似：$P^{-1}AP=B$，保持特征值。正交变换下二者同时成立。' }
    ]
  }
]

// ==================== 概率统计（8章） ====================
const gailvChapters: QuickChapter[] = [
  {
    id: 'gailv-01',
    title: '第1章 随机事件与概率',
    cards: [
      { id: 'gailv-01-1', front: '概率的加法公式？', back: '$$P(A\\cup B)=P(A)+P(B)-P(AB)$$\n推广到三事件需加回两两交、减去三交。互斥时 $P(AB)=0$。' },
      { id: 'gailv-01-2', front: '条件概率与乘法公式？', back: '$$P(B|A)=\\frac{P(AB)}{P(A)}\\quad(P(A)>0)$$\n乘法公式：$P(AB)=P(A)P(B|A)=P(B)P(A|B)$。' },
      { id: 'gailv-01-3', front: '全概率公式与贝叶斯公式？', back: '设 $B_1,\\cdots,B_n$ 为完备事件组：\n全概率 $P(A)=\\sum P(B_i)P(A|B_i)$\n贝叶斯 $P(B_k|A)=\\dfrac{P(B_k)P(A|B_k)}{\\sum P(B_i)P(A|B_i)}$（先验→后验）。' },
      { id: 'gailv-01-4', front: '事件独立的定义与性质？', back: '$A,B$ 独立 $\\Leftrightarrow P(AB)=P(A)P(B)$。\n独立则 $A$ 与 $\\bar B$、$\\bar A$ 与 $B$、$\\bar A$ 与 $\\bar B$ 都独立。\n独立 $\\ne$ 互斥（互斥且概率非零必不独立）。' },
      { id: 'gailv-01-5', front: '伯努利概型（n重独立试验）？', back: '$n$ 重独立试验中事件恰好发生 $k$ 次：\n$$P_n(k)=C_n^k p^k(1-p)^{n-k}$$' }
    ]
  },
  {
    id: 'gailv-02',
    title: '第2章 随机变量及其分布',
    cards: [
      { id: 'gailv-02-1', front: '分布函数的定义与性质？', back: '$F(x)=P(X\\le x)$。\n性质：单调不减、右连续、$F(-\\infty)=0$、$F(+\\infty)=1$。\n$P(a<X\\le b)=F(b)-F(a)$。' },
      { id: 'gailv-02-2', front: '概率密度与分布函数的关系？', back: '$$F(x)=\\int_{-\\infty}^x f(t)\\,dt,\\quad f(x)=F\'(x)$$\n$f(x)\\ge 0$，$\\int_{-\\infty}^{+\\infty}f(x)dx=1$。\n$P(a<X<b)=\\int_a^b f(x)dx$（单点概率为 $0$）。' },
      { id: 'gailv-02-3', front: '常见离散分布？', back: '0-1分布：$P(X=k)=p^k(1-p)^{1-k}$\n二项分布 $B(n,p)$：$P(X=k)=C_n^kp^k(1-p)^{n-k}$\n泊松分布 $P(\\lambda)$：$P(X=k)=\\dfrac{\\lambda^k e^{-\\lambda}}{k!}$\n几何分布：$P(X=k)=(1-p)^{k-1}p$' },
      { id: 'gailv-02-4', front: '常见连续分布？', back: '均匀分布 $U(a,b)$：$f=\\dfrac{1}{b-a}$（$a<x<b$）\n指数分布 $E(\\lambda)$：$f=\\lambda e^{-\\lambda x}$（$x>0$），无记忆性\n正态分布 $N(\\mu,\\sigma^2)$：$f=\\dfrac{1}{\\sqrt{2\\pi}\\sigma}e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}$' },
      { id: 'gailv-02-5', front: '标准正态分布怎么查表？', back: '$X\\sim N(\\mu,\\sigma^2)$，则 $\\dfrac{X-\\mu}{\\sigma}\\sim N(0,1)$。\n$P(X\\le x)=\\Phi\\left(\\dfrac{x-\\mu}{\\sigma}\\right)$，$\\Phi(-x)=1-\\Phi(x)$。' }
    ]
  },
  {
    id: 'gailv-03',
    title: '第3章 二维随机变量及其分布',
    cards: [
      { id: 'gailv-03-1', front: '联合分布与边缘分布？', back: '联合分布函数 $F(x,y)=P(X\\le x,Y\\le y)$。\n边缘分布 $F_X(x)=F(x,+\\infty)$。\n连续型：$f_X(x)=\\int_{-\\infty}^{+\\infty}f(x,y)dy$。' },
      { id: 'gailv-03-2', front: '随机变量独立的判定？', back: '$X,Y$ 独立 $\\Leftrightarrow F(x,y)=F_X(x)F_Y(y)$。\n连续型：$f(x,y)=f_X(x)f_Y(y)$（几乎处处）。\n离散型：$p_{ij}=p_{i\\cdot}p_{\\cdot j}$。' },
      { id: 'gailv-03-3', front: '两个随机变量函数的分布？', back: '$Z=X+Y$（独立）卷积公式：$f_Z(z)=\\int f_X(x)f_Y(z-x)dx$\n$M=\\max(X,Y)$：$F_M(z)=F_X(z)F_Y(z)$\n$N=\\min(X,Y)$：$F_N(z)=1-[1-F_X(z)][1-F_Y(z)]$' },
      { id: 'gailv-03-4', front: '条件分布？', back: '连续型条件密度：\n$$f_{Y|X}(y|x)=\\frac{f(x,y)}{f_X(x)}$$\n条件分布函数 $F_{Y|X}(y|x)=\\int_{-\\infty}^y f_{Y|X}(t|x)dt$。' }
    ]
  },
  {
    id: 'gailv-04',
    title: '第4章 随机变量的数字特征',
    cards: [
      { id: 'gailv-04-1', front: '数学期望的定义与性质？', back: '离散 $E(X)=\\sum x_kp_k$；连续 $E(X)=\\int xf(x)dx$。\n线性性：$E(aX+bY)=aE(X)+bE(Y)$（无条件）。\n独立时 $E(XY)=E(X)E(Y)$。' },
      { id: 'gailv-04-2', front: '方差的定义与性质？', back: '$D(X)=E[X-E(X)]^2=E(X^2)-[E(X)]^2$。\n$D(aX+b)=a^2D(X)$\n独立时 $D(X+Y)=D(X)+D(Y)$。' },
      { id: 'gailv-04-3', front: '常见分布的期望与方差？', back: '$B(n,p)$：$E=np$，$D=np(1-p)$\n$P(\\lambda)$：$E=D=\\lambda$\n$U(a,b)$：$E=\\dfrac{a+b}{2}$，$D=\\dfrac{(b-a)^2}{12}$\n$E(\\lambda)$：$E=\\dfrac{1}{\\lambda}$，$D=\\dfrac{1}{\\lambda^2}$\n$N(\\mu,\\sigma^2)$：$E=\\mu$，$D=\\sigma^2$' },
      { id: 'gailv-04-4', front: '协方差与相关系数？', back: '$\\mathrm{Cov}(X,Y)=E(XY)-E(X)E(Y)$\n$$\\rho_{XY}=\\frac{\\mathrm{Cov}(X,Y)}{\\sqrt{D(X)}\\sqrt{D(Y)}}$$\n$|\\rho|\\le 1$；$|\\rho|=1\\Leftrightarrow X,Y$ 线性相关。独立 $\\Rightarrow\\rho=0$（反之不真）。' },
      { id: 'gailv-04-5', front: '切比雪夫不等式？', back: '$$P(|X-E(X)|\\ge\\varepsilon)\\le\\frac{D(X)}{\\varepsilon^2}$$\n等价形式 $P(|X-\\mu|<\\varepsilon)\\ge 1-\\dfrac{\\sigma^2}{\\varepsilon^2}$。' }
    ]
  },
  {
    id: 'gailv-05',
    title: '第5章 大数定律与中心极限定理',
    cards: [
      { id: 'gailv-05-1', front: '三个大数定律？', back: '切比雪夫：方差一致有界、两两不相关 → 依概率收敛。\n伯努利：频率依概率收敛于概率。\n辛钦：独立同分布、期望存在 → $\\bar X\\xrightarrow{P}\\mu$。' },
      { id: 'gailv-05-2', front: '独立同分布中心极限定理（林德伯格-莱维）？', back: '设 $X_i$ 独立同分布，$E(X_i)=\\mu$，$D(X_i)=\\sigma^2$，则：\n$$\\frac{\\sum X_i-n\\mu}{\\sqrt{n}\\sigma}\\xrightarrow{d}N(0,1)$$\n即 $n$ 足够大时和近似正态。' },
      { id: 'gailv-05-3', front: '棣莫弗-拉普拉斯定理？', back: '二项分布的正态近似：$X\\sim B(n,p)$，则\n$$\\frac{X-np}{\\sqrt{np(1-p)}}\\xrightarrow{d}N(0,1)$$\n是中心极限定理的特例。' }
    ]
  },
  {
    id: 'gailv-06',
    title: '第6章 数理统计的基本概念',
    cards: [
      { id: 'gailv-06-1', front: '样本均值与样本方差？', back: '$\\bar X=\\dfrac{1}{n}\\sum X_i$\n$$S^2=\\frac{1}{n-1}\\sum(X_i-\\bar X)^2$$\n注意分母是 $n-1$（无偏性），且 $E(S^2)=\\sigma^2$。' },
      { id: 'gailv-06-2', front: '三大抽样分布？', back: '$\\chi^2$ 分布：$\\sum_{i=1}^n Z_i^2$（$Z_i$ 独立标准正态），$E=n$，$D=2n$。\n$t$ 分布：$\\dfrac{Z}{\\sqrt{\\chi^2/n}}$，关于 $0$ 对称。\n$F$ 分布：$\\dfrac{\\chi^2_m/m}{\\chi^2_n/n}$，$F_{1-\\alpha}(m,n)=\\dfrac{1}{F_\\alpha(n,m)}$。' },
      { id: 'gailv-06-3', front: '正态总体的抽样分布？', back: '设 $X\\sim N(\\mu,\\sigma^2)$，则：\n$\\dfrac{\\bar X-\\mu}{\\sigma/\\sqrt n}\\sim N(0,1)$\n$\\dfrac{(n-1)S^2}{\\sigma^2}\\sim\\chi^2(n-1)$\n$\\dfrac{\\bar X-\\mu}{S/\\sqrt n}\\sim t(n-1)$\n$\\bar X$ 与 $S^2$ 独立。' }
    ]
  },
  {
    id: 'gailv-07',
    title: '第7章 参数估计',
    cards: [
      { id: 'gailv-07-1', front: '矩估计法？', back: '用样本矩估计总体矩：\n$\\hat\\mu=\\bar X$，$\\hat\\sigma^2=\\dfrac{1}{n}\\sum(X_i-\\bar X)^2$（注意分母是 $n$，有偏）。\n几个未知参数就列几阶矩方程。' },
      { id: 'gailv-07-2', front: '最大似然估计（MLE）步骤？', back: '① 写似然函数 $L(\\theta)=\\prod f(x_i;\\theta)$\n② 取对数 $\\ln L$\n③ 对 $\\theta$ 求导令为 $0$，解似然方程。\n多个参数联立求偏导。' },
      { id: 'gailv-07-3', front: '估计量的评选标准？', back: '无偏性：$E(\\hat\\theta)=\\theta$。\n有效性：方差更小者更优。\n一致性（相合性）：$\\hat\\theta_n\\xrightarrow{P}\\theta$。' },
      { id: 'gailv-07-4', front: '正态均值的置信区间？', back: '$\\sigma^2$ 已知（用 $Z$）：$\\bar X\\pm u_{\\alpha/2}\\dfrac{\\sigma}{\\sqrt n}$\n$\\sigma^2$ 未知（用 $t$）：$\\bar X\\pm t_{\\alpha/2}(n-1)\\dfrac{S}{\\sqrt n}$\n置信水平 $1-\\alpha$。' }
    ]
  },
  {
    id: 'gailv-08',
    title: '第8章 假设检验',
    cards: [
      { id: 'gailv-08-1', front: '假设检验的基本概念？', back: '原假设 $H_0$ 与备择假设 $H_1$。\n显著性水平 $\\alpha$ = 犯第一类错误（拒真）的概率上限。\n小概率原理：一次试验中概率 $\\le\\alpha$ 的事件视为不发生。' },
      { id: 'gailv-08-2', front: '两类错误？', back: '第一类错误（弃真）：$H_0$ 为真却拒绝，概率 $\\le\\alpha$。\n第二类错误（取伪）：$H_0$ 为假却接受，概率记为 $\\beta$。\n通常只控制第一类错误。' },
      { id: 'gailv-08-3', front: '单个正态均值的检验？', back: '$\\sigma^2$ 已知 → $Z$ 检验：$Z=\\dfrac{\\bar X-\\mu_0}{\\sigma/\\sqrt n}$，拒绝域 $|Z|>u_{\\alpha/2}$。\n$\\sigma^2$ 未知 → $t$ 检验：$t=\\dfrac{\\bar X-\\mu_0}{S/\\sqrt n}$，拒绝域 $|t|>t_{\\alpha/2}(n-1)$。' },
      { id: 'gailv-08-4', front: '假设检验的一般步骤？', back: '① 提出 $H_0,H_1$\n② 选检验统计量及其分布\n③ 由 $\\alpha$ 定拒绝域\n④ 代入样本值计算\n⑤ 判断：落入拒绝域则拒绝 $H_0$。' }
    ]
  }
]

export const QUICK_CARDS: Record<QuickSubjectKey, { name: string; icon: string; chapters: QuickChapter[] }> = {
  higher: { name: '高等数学', icon: '📐', chapters: higherChapters },
  linear: { name: '线性代数', icon: '🔢', chapters: linearChapters },
  gailv: { name: '概率统计', icon: '🎲', chapters: gailvChapters }
}

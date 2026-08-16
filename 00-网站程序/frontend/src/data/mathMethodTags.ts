/**
 * 考研数学一 · 方法标签索引（Method Tag Index）
 * 跨章节按招法索引，看清哪些方法反复出现、哪些方法互为替代
 */

export interface MathMethod {
  /** 唯一标识，如 'limit-lhopital' */
  id: string
  /** 方法全称，如 '洛必达法则求极限' */
  name: string
  /** 简称，如 '洛必达' */
  shortName: string
  /** 所属科目：高数 / 线代 / 概率 */
  category: string
  /** 所属子章节，如 '函数极限'、'一元微分' */
  subCategory: string
  /** 关联/替代方法的 ID 列表（跨章节交叉引用） */
  relatedMethods: string[]
  /** 一句话描述：什么时候用这个方法 */
  description: string
  /** 走不通时换什么方法尝试 */
  fallback: string
  /** 考频：必考 / 高频 / 中频 / 低频 */
  frequency: '必考' | '高频' | '中频' | '低频'
}

export const mathMethods: MathMethod[] = [

  // ═══════════════════════════════════════════════════════
  // 高数 —— 函数极限
  // ═══════════════════════════════════════════════════════
  {
    id: 'limit-equiv-inf',
    name: '等价无穷小替换',
    shortName: '等价无穷小',
    category: '高数',
    subCategory: '函数极限',
    relatedMethods: ['limit-lhopital', 'limit-taylor', 'series-power-sum'],
    description: '乘除关系时用等价无穷小替换简化计算，如 sinx~x、ln(1+x)~x',
    fallback: '换泰勒展开或洛必达法则',
    frequency: '必考'
  },
  {
    id: 'limit-lhopital',
    name: '洛必达法则',
    shortName: '洛必达',
    category: '高数',
    subCategory: '函数极限',
    relatedMethods: ['limit-equiv-inf', 'limit-taylor', 'deriv-chain'],
    description: '0/0 或 ∞/∞ 型未定式，分子分母分别求导后再求极限',
    fallback: '先等价无穷小化简，或用泰勒展开',
    frequency: '必考'
  },
  {
    id: 'limit-taylor',
    name: '泰勒展开求极限',
    shortName: '泰勒展开',
    category: '高数',
    subCategory: '函数极限',
    relatedMethods: ['limit-equiv-inf', 'limit-lhopital', 'series-power-sum', 'mvt-taylor'],
    description: '展开到关键阶次后比较主部，适用于含 e^x、sinx、ln(1+x) 等的极限',
    fallback: '退回到洛必达法则逐阶求导',
    frequency: '必考'
  },
  {
    id: 'limit-1inf',
    name: '1^∞ 型极限（凑e法）',
    shortName: '凑e法',
    category: '高数',
    subCategory: '函数极限',
    relatedMethods: ['limit-lhopital', 'limit-taylor', 'limit-equiv-inf'],
    description: '底→1、指数→∞ 时，令底=1+u，凑 lim(1+u)^{1/u}=e 的形式',
    fallback: '取对数转化为 ∞·0 型再用洛必达',
    frequency: '高频'
  },
  {
    id: 'limit-squeeze',
    name: '夹逼准则与单调有界准则',
    shortName: '夹逼/单调有界',
    category: '高数',
    subCategory: '函数极限',
    relatedMethods: ['limit-lhopital', 'integral-improper'],
    description: '数列极限不易直接求时，找上下界夹逼；或证单调有界后设极限解方程',
    fallback: '尝试定积分定义（n项和）或级数方法',
    frequency: '高频'
  },

  // ═══════════════════════════════════════════════════════
  // 高数 —— 一元微分
  // ═══════════════════════════════════════════════════════
  {
    id: 'deriv-chain',
    name: '复合函数链式求导',
    shortName: '链式求导',
    category: '高数',
    subCategory: '一元微分',
    relatedMethods: ['deriv-implicit', 'deriv-parametric', 'multi-partial'],
    description: '多层复合函数由外向内逐层求导，是求导的基本功',
    fallback: '先化简（取对数、换元）再求导',
    frequency: '必考'
  },
  {
    id: 'deriv-implicit',
    name: '隐函数求导',
    shortName: '隐函数求导',
    category: '高数',
    subCategory: '一元微分',
    relatedMethods: ['deriv-chain', 'deriv-parametric', 'multi-partial'],
    description: '方程 F(x,y)=0 两边对 x 求导，解出 dy/dx',
    fallback: '用偏导数公式 dy/dx = -F_x/F_y',
    frequency: '高频'
  },
  {
    id: 'deriv-parametric',
    name: '参数方程求导',
    shortName: '参数方程求导',
    category: '高数',
    subCategory: '一元微分',
    relatedMethods: ['deriv-chain', 'integral-substitution', 'multi-curve-int'],
    description: 'x=φ(t)、y=ψ(t) 时，dy/dx = ψ\'(t)/φ\'(t)',
    fallback: '消参数转为显函数再求导',
    frequency: '高频'
  },
  {
    id: 'deriv-higher',
    name: '高阶导数计算',
    shortName: '高阶导数',
    category: '高数',
    subCategory: '一元微分',
    relatedMethods: ['deriv-chain', 'mvt-taylor', 'series-power-sum'],
    description: '利用莱布尼茨公式、递推、或泰勒展开系数求 n 阶导数',
    fallback: '用泰勒展开反推各阶导数值',
    frequency: '中频'
  },

  // ═══════════════════════════════════════════════════════
  // 高数 —— 中值定理
  // ═══════════════════════════════════════════════════════
  {
    id: 'mvt-rolle',
    name: '罗尔定理',
    shortName: '罗尔定理',
    category: '高数',
    subCategory: '中值定理',
    relatedMethods: ['mvt-lagrange', 'mvt-cauchy', 'integral-variant'],
    description: 'f(a)=f(b) 时存在 ξ 使 f\'(ξ)=0，证明等式含 f\' 的零点',
    fallback: '构造辅助函数 F(x) 使其满足罗尔条件',
    frequency: '高频'
  },
  {
    id: 'mvt-lagrange',
    name: '拉格朗日中值定理',
    shortName: '拉氏中值',
    category: '高数',
    subCategory: '中值定理',
    relatedMethods: ['mvt-rolle', 'mvt-cauchy', 'mvt-taylor', 'mvt-integral'],
    description: 'f(b)-f(a)=f\'(ξ)(b-a)，证明不等式或估计差值',
    fallback: '升级到泰勒公式（带余项）获得更高精度',
    frequency: '必考'
  },
  {
    id: 'mvt-cauchy',
    name: '柯西中值定理',
    shortName: '柯西中值',
    category: '高数',
    subCategory: '中值定理',
    relatedMethods: ['mvt-lagrange', 'mvt-rolle', 'limit-lhopital'],
    description: '[f(b)-f(a)]/[g(b)-g(a)] = f\'(ξ)/g\'(ξ)，处理两个函数之比',
    fallback: '退回拉格朗日中值定理 + 分别估计',
    frequency: '中频'
  },
  {
    id: 'mvt-taylor',
    name: '泰勒公式证明',
    shortName: '泰勒证明',
    category: '高数',
    subCategory: '中值定理',
    relatedMethods: ['mvt-lagrange', 'limit-taylor', 'deriv-higher', 'series-power-sum'],
    description: '用带拉格朗日余项的泰勒公式证明含高阶导数的等式或不等式',
    fallback: '降阶用拉格朗日中值定理',
    frequency: '高频'
  },
  {
    id: 'mvt-integral',
    name: '积分中值定理',
    shortName: '积分中值',
    category: '高数',
    subCategory: '中值定理',
    relatedMethods: ['mvt-lagrange', 'integral-substitution', 'integral-variant'],
    description: '∫f(x)dx = f(ξ)(b-a)，估计积分值或证明积分等式',
    fallback: '用夹逼或换元后直接计算',
    frequency: '中频'
  },

  // ═══════════════════════════════════════════════════════
  // 高数 —— 一元积分
  // ═══════════════════════════════════════════════════════
  {
    id: 'integral-substitution',
    name: '换元积分法',
    shortName: '换元积分',
    category: '高数',
    subCategory: '一元积分',
    relatedMethods: ['integral-parts', 'deriv-parametric', 'multi-double-int'],
    description: '第一类（凑微分）和第二类（三角/倒代换），处理根式、三角函数积分',
    fallback: '尝试分部积分或有理化',
    frequency: '必考'
  },
  {
    id: 'integral-parts',
    name: '分部积分法',
    shortName: '分部积分',
    category: '高数',
    subCategory: '一元积分',
    relatedMethods: ['integral-substitution', 'integral-variant', 'series-power-sum'],
    description: '∫udv = uv - ∫vdu，按"反对幂三指"选 u，处理两类不同函数相乘',
    fallback: '先换元简化再分部，或用表格法（重复分部）',
    frequency: '必考'
  },
  {
    id: 'integral-variant',
    name: '变限积分求导',
    shortName: '变限积分',
    category: '高数',
    subCategory: '一元积分',
    relatedMethods: ['integral-substitution', 'deriv-chain', 'mvt-rolle', 'ode-linear-first'],
    description: 'd/dx ∫_a^{φ(x)} f(t)dt = f(φ(x))·φ\'(x)，常与极限、导数综合出题',
    fallback: '先把积分算出来再求导',
    frequency: '必考'
  },
  {
    id: 'integral-improper',
    name: '反常积分判敛',
    shortName: '反常积分',
    category: '高数',
    subCategory: '一元积分',
    relatedMethods: ['limit-squeeze', 'series-converge', 'limit-lhopital'],
    description: '∫1/x^p 的 p 判敛 + 比较审敛法，判断无穷区间或瑕积分的收敛性',
    fallback: '直接计算原函数取极限',
    frequency: '高频'
  },

  // ═══════════════════════════════════════════════════════
  // 高数 —— 多元微积分
  // ═══════════════════════════════════════════════════════
  {
    id: 'multi-partial',
    name: '偏导数与全微分',
    shortName: '偏导与全微分',
    category: '高数',
    subCategory: '多元微积分',
    relatedMethods: ['deriv-chain', 'deriv-implicit', 'multi-lagrange'],
    description: '多元函数对各变量分别求导，判断可微性（全微分存在条件）',
    fallback: '用定义验证可微性：Δz = AΔx + BΔy + o(ρ)',
    frequency: '必考'
  },
  {
    id: 'multi-lagrange',
    name: '拉格朗日乘数法（条件极值）',
    shortName: '拉氏乘数法',
    category: '高数',
    subCategory: '多元微积分',
    relatedMethods: ['multi-partial', 'linalg-eigenvalue'],
    description: '约束 g(x,y)=0 下求 f(x,y) 极值，构造 L = f - λg 联立方程组',
    fallback: '消元法将条件极值化为无条件极值',
    frequency: '高频'
  },
  {
    id: 'multi-double-int',
    name: '二重积分计算',
    shortName: '二重积分',
    category: '高数',
    subCategory: '多元微积分',
    relatedMethods: ['integral-substitution', 'multi-triple-int', 'multi-green'],
    description: '直角坐标（X型/Y型）或极坐标下化为累次积分，注意积分区域对称性',
    fallback: '换极坐标或做变量替换简化区域',
    frequency: '必考'
  },
  {
    id: 'multi-triple-int',
    name: '三重积分（先一后二/先二后一）',
    shortName: '三重积分',
    category: '高数',
    subCategory: '多元微积分',
    relatedMethods: ['multi-double-int', 'multi-gauss'],
    description: '直角坐标、柱坐标、球坐标三种方式，按区域形状选择坐标系',
    fallback: '利用对称性降维或用高斯公式转化',
    frequency: '高频'
  },
  {
    id: 'multi-curve-int',
    name: '曲线积分（第一/第二类）',
    shortName: '曲线积分',
    category: '高数',
    subCategory: '多元微积分',
    relatedMethods: ['multi-surface-int', 'multi-green', 'multi-stokes', 'deriv-parametric'],
    description: '第一类对弧长（标量场），第二类对坐标（向量场），参数化后代入计算',
    fallback: '利用格林公式或斯托克斯公式化为面积分',
    frequency: '必考'
  },
  {
    id: 'multi-surface-int',
    name: '曲面积分',
    shortName: '曲面积分',
    category: '高数',
    subCategory: '多元微积分',
    relatedMethods: ['multi-curve-int', 'multi-gauss', 'multi-stokes'],
    description: '第一类对面积（标量场），第二类对坐标（向量场/通量），投影法或合一投影',
    fallback: '用高斯公式化为三重积分',
    frequency: '高频'
  },
  {
    id: 'multi-green',
    name: '格林公式',
    shortName: '格林公式',
    category: '高数',
    subCategory: '多元微积分',
    relatedMethods: ['multi-curve-int', 'multi-double-int', 'multi-gauss'],
    description: '∮Pdx+Qdy = ∬(∂Q/∂x - ∂P/∂y)dxdy，将闭合曲线积分转为二重积分',
    fallback: '补线使其闭合，或直接参数化计算',
    frequency: '必考'
  },
  {
    id: 'multi-gauss',
    name: '高斯公式',
    shortName: '高斯公式',
    category: '高数',
    subCategory: '多元微积分',
    relatedMethods: ['multi-surface-int', 'multi-triple-int', 'multi-green'],
    description: '∯Pdx∧dy = ∭(∂P/∂x+∂Q/∂y+∂R/∂z)dV，将闭合曲面积分转为三重积分',
    fallback: '补面使其封闭，或直接投影计算',
    frequency: '高频'
  },
  {
    id: 'multi-stokes',
    name: '斯托克斯公式',
    shortName: '斯托克斯',
    category: '高数',
    subCategory: '多元微积分',
    relatedMethods: ['multi-curve-int', 'multi-surface-int', 'multi-green'],
    description: '空间曲线积分 ↔ 曲面积分的互换，旋度的曲面积分 = 环量',
    fallback: '直接参数化曲线积分',
    frequency: '中频'
  },

  // ═══════════════════════════════════════════════════════
  // 高数 —— 无穷级数
  // ═══════════════════════════════════════════════════════
  {
    id: 'series-converge',
    name: '级数敛散性判别',
    shortName: '级数判敛',
    category: '高数',
    subCategory: '无穷级数',
    relatedMethods: ['integral-improper', 'limit-squeeze', 'limit-lhopital'],
    description: '正项级数用比较/比值/根值/积分判别，交错级数用莱布尼茨判别',
    fallback: '与 p 级数或等比级数比较',
    frequency: '必考'
  },
  {
    id: 'series-power-sum',
    name: '幂级数求和函数',
    shortName: '幂级数求和',
    category: '高数',
    subCategory: '无穷级数',
    relatedMethods: ['limit-taylor', 'integral-parts', 'deriv-higher', 'series-converge'],
    description: '先求收敛域，再通过逐项求导/积分化为已知展开式（如 1/(1-x)、e^x）',
    fallback: '先逐项求导或积分简化，再求和',
    frequency: '必考'
  },
  {
    id: 'series-fourier',
    name: '傅里叶级数展开',
    shortName: '傅里叶级数',
    category: '高数',
    subCategory: '无穷级数',
    relatedMethods: ['integral-substitution', 'series-converge'],
    description: '将周期函数展开为 a0/2 + Σ(aₙcosnx + bₙsinnx)，计算傅里叶系数',
    fallback: '利用奇偶性简化（奇函数只含 sin，偶函数只含 cos）',
    frequency: '中频'
  },

  // ═══════════════════════════════════════════════════════
  // 高数 —— 常微分方程
  // ═══════════════════════════════════════════════════════
  {
    id: 'ode-separable',
    name: '可分离变量方程',
    shortName: '分离变量',
    category: '高数',
    subCategory: '常微分方程',
    relatedMethods: ['integral-substitution', 'ode-linear-first'],
    description: 'dy/dx = f(x)g(y)，分离后两边分别积分',
    fallback: '换元化为可分离形式（如齐次方程令 u=y/x）',
    frequency: '高频'
  },
  {
    id: 'ode-linear-first',
    name: '一阶线性微分方程',
    shortName: '一阶线性ODE',
    category: '高数',
    subCategory: '常微分方程',
    relatedMethods: ['ode-separable', 'integral-variant', 'integral-substitution'],
    description: 'y\' + P(x)y = Q(x)，通解公式 y = e^{-∫Pdx}[∫Qe^{∫Pdx}dx + C]',
    fallback: '常数变易法推导通解',
    frequency: '必考'
  },
  {
    id: 'ode-linear-second',
    name: '二阶常系数线性方程',
    shortName: '二阶常系数',
    category: '高数',
    subCategory: '常微分方程',
    relatedMethods: ['ode-linear-first', 'linalg-eigenvalue'],
    description: 'y\'\'+py\'+qy=f(x)，特征方程 r²+pr+q=0，按根的情况写齐次通解+待定系数法求特解',
    fallback: '降阶法（令 p=y\'）或参数变易法',
    frequency: '必考'
  },

  // ═══════════════════════════════════════════════════════
  // 线性代数
  // ═══════════════════════════════════════════════════════
  {
    id: 'linalg-det',
    name: '行列式展开与计算',
    shortName: '行列式计算',
    category: '线代',
    subCategory: '行列式',
    relatedMethods: ['linalg-inverse', 'linalg-eigenvalue', 'linalg-system'],
    description: '按行(列)展开、三角化、加边法、递推法等计算 n 阶行列式',
    fallback: '利用行列式性质化为上三角',
    frequency: '高频'
  },
  {
    id: 'linalg-inverse',
    name: '矩阵求逆与伴随矩阵',
    shortName: '矩阵求逆',
    category: '线代',
    subCategory: '矩阵',
    relatedMethods: ['linalg-det', 'linalg-rank', 'linalg-system'],
    description: 'A^{-1} = A*/|A|，初等行变换法 [A|E]→[E|A^{-1}]，分块矩阵求逆',
    fallback: '用伴随矩阵公式或直接高斯消元',
    frequency: '高频'
  },
  {
    id: 'linalg-rank',
    name: '矩阵秩的计算',
    shortName: '矩阵秩',
    category: '线代',
    subCategory: '矩阵',
    relatedMethods: ['linalg-system', 'linalg-eigenvalue', 'linalg-similar'],
    description: '化为行阶梯形数非零行数，r(A)=r ↔ 齐次方程组解空间维数=n-r',
    fallback: '用子式法（找最大非零子式阶数）',
    frequency: '必考'
  },
  {
    id: 'linalg-eigenvalue',
    name: '特征值与特征向量',
    shortName: '特征值/特征向量',
    category: '线代',
    subCategory: '特征值',
    relatedMethods: ['linalg-similar', 'linalg-orthogonal', 'linalg-det', 'ode-linear-second'],
    description: '解 |A-λI|=0 得特征值，代回 (A-λI)x=0 得特征向量，是二次型和对角化的基础',
    fallback: '利用迹和行列式的关系 tr(A)=Σλᵢ, |A|=∏λᵢ 验证',
    frequency: '必考'
  },
  {
    id: 'linalg-orthogonal',
    name: '正交变换化二次型',
    shortName: '正交变换',
    category: '线代',
    subCategory: '二次型',
    relatedMethods: ['linalg-eigenvalue', 'linalg-similar'],
    description: '二次型 f=xᵀAx 经正交变换 x=Py 化为标准型，特征值即系数',
    fallback: '配方法或合同变换化标准型（非正交变换）',
    frequency: '必考'
  },
  {
    id: 'linalg-similar',
    name: '相似对角化判定',
    shortName: '相似对角化',
    category: '线代',
    subCategory: '特征值',
    relatedMethods: ['linalg-eigenvalue', 'linalg-rank', 'linalg-orthogonal'],
    description: 'A 可对角化 ↔ 有 n 个线性无关特征向量 ↔ 每个重根几何重数=代数重数',
    fallback: '判断是否实对称（实对称一定可对角化）',
    frequency: '高频'
  },
  {
    id: 'linalg-system',
    name: '线性方程组求解（高斯消元）',
    shortName: '高斯消元',
    category: '线代',
    subCategory: '方程组',
    relatedMethods: ['linalg-rank', 'linalg-det', 'linalg-inverse'],
    description: '增广矩阵行变换化行阶梯/最简形，判 r(A) 与 r(A|b) 定解的存在性与个数',
    fallback: '克莱默法则（n 个方程 n 个未知数且 |A|≠0）',
    frequency: '必考'
  },

  // ═══════════════════════════════════════════════════════
  // 概率论与数理统计
  // ═══════════════════════════════════════════════════════
  {
    id: 'prob-classical',
    name: '古典概型与几何概型',
    shortName: '古典/几何概型',
    category: '概率',
    subCategory: '随机事件与概率',
    relatedMethods: ['prob-conditional', 'prob-distribution'],
    description: '等可能事件用计数法（排列组合），几何概型用面积/长度/体积之比',
    fallback: '转化为条件概率或用全概率公式',
    frequency: '高频'
  },
  {
    id: 'prob-conditional',
    name: '条件概率与乘法公式',
    shortName: '条件概率',
    category: '概率',
    subCategory: '随机事件与概率',
    relatedMethods: ['prob-total', 'prob-classical', 'prob-independence'],
    description: 'P(B|A) = P(AB)/P(A)，乘法公式 P(AB) = P(A)·P(B|A)，用于逐步缩小样本空间',
    fallback: '画树形图或列表枚举',
    frequency: '高频'
  },
  {
    id: 'prob-total',
    name: '全概率公式与贝叶斯公式',
    shortName: '全概率/贝叶斯',
    category: '概率',
    subCategory: '随机事件与概率',
    relatedMethods: ['prob-conditional', 'prob-classical', 'prob-distribution'],
    description: '全概率：P(B)=ΣP(Aᵢ)P(B|Aᵢ)，贝叶斯：由结果反推原因的后验概率',
    fallback: '直接枚举所有路径求和',
    frequency: '必考'
  },
  {
    id: 'prob-independence',
    name: '独立性判定',
    shortName: '独立性',
    category: '概率',
    subCategory: '随机事件与概率',
    relatedMethods: ['prob-conditional', 'prob-joint', 'prob-distribution'],
    description: 'P(AB)=P(A)P(B) 则独立；不相关≠独立（正态除外），独立⇒不相关',
    fallback: '验证联合分布 = 边缘分布之积',
    frequency: '高频'
  },
  {
    id: 'prob-distribution',
    name: '常见分布（二项/泊松/正态/指数）',
    shortName: '常见分布',
    category: '概率',
    subCategory: '随机变量分布',
    relatedMethods: ['prob-expectation', 'prob-clt', 'prob-total'],
    description: '熟记八大分布的概率函数/密度、期望、方差，以及分布间的关系',
    fallback: '直接用定义（分布函数法/密度函数法）推导',
    frequency: '必考'
  },
  {
    id: 'prob-expectation',
    name: '数学期望与方差计算',
    shortName: '期望与方差',
    category: '概率',
    subCategory: '数字特征',
    relatedMethods: ['prob-distribution', 'prob-joint', 'prob-conditional-density'],
    description: 'E(X)=∫xf(x)dx 或 Σxₖpₖ，D(X)=E(X²)-[E(X)]²，利用性质简化',
    fallback: '用定义硬算，或引入指示变量拆分',
    frequency: '必考'
  },
  {
    id: 'prob-joint',
    name: '联合分布与边缘分布',
    shortName: '联合/边缘分布',
    category: '概率',
    subCategory: '多维随机变量',
    relatedMethods: ['prob-conditional-density', 'prob-independence', 'prob-expectation'],
    description: '联合密度 f(x,y) 对 y 积分得边缘密度 f_X(x)，离散型对列/行求和',
    fallback: '先画图确定积分上下限',
    frequency: '必考'
  },
  {
    id: 'prob-conditional-density',
    name: '条件密度（二元正态配方）',
    shortName: '条件密度',
    category: '概率',
    subCategory: '多维随机变量',
    relatedMethods: ['prob-joint', 'prob-distribution', 'prob-expectation'],
    description: 'f(y|x) = f(x,y)/f_X(x)，二元正态的条件分布仍是正态，配方求均值和方差',
    fallback: '直接代入联合密度和边缘密度公式',
    frequency: '高频'
  },
  {
    id: 'prob-clt',
    name: '中心极限定理应用',
    shortName: '中心极限定理',
    category: '概率',
    subCategory: '大数定律与中心极限',
    relatedMethods: ['prob-distribution', 'prob-expectation'],
    description: '大量独立同分布随机变量之和近似正态，用于近似计算概率 P(Sₙ≤a)',
    fallback: '切比雪夫不等式给出粗略估计',
    frequency: '中频'
  },
  {
    id: 'prob-mle',
    name: '最大似然估计',
    shortName: '最大似然',
    category: '概率',
    subCategory: '参数估计',
    relatedMethods: ['prob-moment', 'prob-distribution', 'deriv-chain'],
    description: '构造似然函数 L(θ)=∏f(xᵢ;θ)，取对数后求导令其为零解出 θ̂',
    fallback: '矩估计（用样本矩代替总体矩）',
    frequency: '必考'
  },
  {
    id: 'prob-moment',
    name: '矩估计',
    shortName: '矩估计',
    category: '概率',
    subCategory: '参数估计',
    relatedMethods: ['prob-mle', 'prob-expectation', 'prob-distribution'],
    description: '令样本矩 = 总体矩（如 X̄=E(X)），解方程组得参数估计值',
    fallback: '改用最大似然估计（通常更有效）',
    frequency: '高频'
  }
]

/**
 * 按科目筛选方法
 * @param category 科目名称，如 '高数'、'线代'、'概率'
 */
export function getMethodsByCategory(category: string): MathMethod[] {
  return mathMethods.filter(m => m.category === category)
}

/**
 * 获取某方法的所有关联方法
 * @param methodId 方法 ID
 */
export function getRelatedMethods(methodId: string): MathMethod[] {
  const method = mathMethods.find(m => m.id === methodId)
  if (!method) return []
  return mathMethods.filter(m => method.relatedMethods.includes(m.id))
}

/**
 * 获取所有科目列表（去重）
 */
export function getCategories(): string[] {
  return [...new Set(mathMethods.map(m => m.category))]
}

/**
 * 获取某科目下的所有子分类
 * @param category 科目名称
 */
export function getSubCategories(category: string): string[] {
  return [...new Set(mathMethods.filter(m => m.category === category).map(m => m.subCategory))]
}

/**
 * 统计交叉引用总数（去重）
 */
export function getCrossLinkCount(): number {
  const links = new Set<string>()
  mathMethods.forEach(m => {
    m.relatedMethods.forEach(rid => {
      const key = [m.id, rid].sort().join('|')
      links.add(key)
    })
  })
  return links.size
}

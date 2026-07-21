/**
 * 数学速查卡片数据
 * - 高数9章 + 线代6章，每章若干翻转卡（正面自测问题 / 背面核心公式+定理）
 * - 线代按知识链排列：行列式→矩阵→向量→方程组→特征值→二次型
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

export type QuickSubjectKey = 'higher' | 'linear'

// ==================== 高等数学（9章） ====================
const higherChapters: QuickChapter[] = [
  {
    id: 'h1',
    title: '第1章 函数 极限 连续',
    cards: [
      { id: 'h1-1', front: '两个重要极限是什么？', back: '① lim(x→0) sinx/x = 1\n② lim(x→∞) (1+1/x)^x = e\n（第二个也常写作 lim(t→0)(1+t)^(1/t)=e）' },
      { id: 'h1-2', front: 'x→0 时常用等价无穷小有哪些？', back: 'sinx~x, tanx~x, arcsinx~x, arctanx~x\nln(1+x)~x, e^x−1~x\n1−cosx~x²/2, (1+x)^a−1~ax' },
      { id: 'h1-3', front: '洛必达法则适用条件？', back: '仅适用于 0/0 或 ∞/∞ 型未定式：\nlim f/g = lim f′/g（右端极限存在或为∞）\n使用前先化简，可配合等价无穷小替换。' },
      { id: 'h1-4', front: '常用泰勒展开（x→0）？', back: 'e^x = 1+x+x²/2!+x³/3!+o(x³)\nln(1+x) = x−x²/2+x³/3+o(x³)\nsinx = x−x³/3!+o(x³)\ncosx = 1−x²/2!+o(x²)\n1/(1−x) = 1+x+x²+o(x²)' }
    ]
  },
  {
    id: 'h2',
    title: '第2章 一元函数微分学',
    cards: [
      { id: 'h2-1', front: '导数的定义式？', back: 'f′(x₀) = lim(Δx→0) [f(x₀+Δx)−f(x₀)]/Δx\n几何意义：曲线在该点切线斜率。' },
      { id: 'h2-2', front: '复合函数求导（链式法则）？', back: 'dy/dx = dy/du · du/dx\n逐层求导，由外向内。' },
      { id: 'h2-3', front: '拉格朗日中值定理？', back: 'f 在[a,b]连续、(a,b)可导，则 ∃ξ∈(a,b)：\nf(b)−f(a) = f′(ξ)(b−a)\n用途：不等式证明、方程根的讨论。' },
      { id: 'h2-4', front: '极值的判定方法？', back: '必要条件：f′(x₀)=0（驻点）\n第一充分条件：f′ 左正右负→极大\n第二充分条件：f′(x₀)=0 且 f″(x₀)<0→极大，f″(x₀)>0→极小' }
    ]
  },
  {
    id: 'h3',
    title: '第3章 一元函数积分学',
    cards: [
      { id: 'h3-1', front: '牛顿-莱布尼茨公式？', back: '∫[a,b] f(x)dx = F(b) − F(a)\n其中 F 是 f 的任一原函数。' },
      { id: 'h3-2', front: '分部积分公式？', back: '∫u dv = uv − ∫v du\n口诀：反、对、幂、三、指（优先作 u 的顺序）。' },
      { id: 'h3-3', front: '旋转体体积（绕x轴）？', back: 'V = π∫[a,b] f²(x)dx\n绕y轴（柱壳法）：V = 2π∫[a,b] x·f(x)dx' },
      { id: 'h3-4', front: '变上限积分求导？', back: 'd/dx ∫[a,φ(x)] f(t)dt = f(φ(x))·φ′(x)\n复合函数形式，注意上限求导。' }
    ]
  },
  {
    id: 'h4',
    title: '第4章 常微分方程',
    cards: [
      { id: 'h4-1', front: '一阶线性方程 y′+P(x)y=Q(x) 通解？', back: 'y = e^(−∫P dx)·[∫Q·e^(∫P dx)dx + C]\n先求 ∫P dx，再套公式。' },
      { id: 'h4-2', front: '可分离变量方程怎么解？', back: '形如 dy/dx = g(x)h(y)\n分离：dy/h(y) = g(x)dx，两边积分。' },
      { id: 'h4-3', front: '二阶常系数齐次方程解法？', back: 'y″+py′+qy=0 → 特征方程 r²+pr+q=0\nΔ>0：两单实根 → C₁e^(r₁x)+C₂e^(r₂x)\nΔ=0：重根 → (C₁+C₂x)e^(rx)\nΔ<0：共轭复根 α±βi → e^(αx)(C₁cosβx+C₂sinβx)' },
      { id: 'h4-4', front: '非齐次方程通解结构？', back: 'y = Y（对应齐次通解）+ y*（一个特解）' }
    ]
  },
  {
    id: 'h5',
    title: '第5章 多元函数微分学',
    cards: [
      { id: 'h5-1', front: '全微分公式？', back: 'dz = (∂z/∂x)dx + (∂z/∂y)dy\n可微 ⇒ 偏导存在且连续。' },
      { id: 'h5-2', front: '多元复合函数求导法则？', back: '∂z/∂x = ∂z/∂u·∂u/∂x + ∂z/∂v·∂v/∂x\n画变量关系图，逐条路径相加。' },
      { id: 'h5-3', front: '二元函数极值的必要条件？', back: '在驻点处 ∂z/∂x=0 且 ∂z/∂y=0\n（极值点一定是驻点，驻点不一定是极值点）' },
      { id: 'h5-4', front: '二元函数极值的充分条件？', back: 'A=f″xx, B=f″xy, C=f″yy\nAC−B²>0 且 A<0 → 极大\nAC−B²>0 且 A>0 → 极小\nAC−B²<0 → 无极值' }
    ]
  },
  {
    id: 'h6',
    title: '第6章 二重积分',
    cards: [
      { id: 'h6-1', front: '二重积分化累次积分？', back: 'X型：∬f dxdy = ∫[a,b]dx ∫[y₁(x),y₂(x)] f dy\nY型：∬f dxdy = ∫[c,d]dy ∫[x₁(y),x₂(y)] f dx\n先画图确定积分区域类型。' },
      { id: 'h6-2', front: '极坐标变换？', back: 'x = rcosθ, y = rsinθ\n面积元 dxdy = r·drdθ（别漏 r！）\n适用：圆形区域、x²+y² 型被积函数。' },
      { id: 'h6-3', front: '二重积分的对称性？', back: '区域关于x轴对称，f 关于 y 为奇函数 → 积分为0\n偶函数 → 2倍半区域积分。' }
    ]
  },
  {
    id: 'h7',
    title: '第7章 无穷级数',
    cards: [
      { id: 'h7-1', front: '级数收敛的必要条件？', back: '若 Σaₙ 收敛，则 lim aₙ = 0\n（必要不充分：调和级数 Σ1/n 发散）' },
      { id: 'h7-2', front: '比值审敛法（达朗贝尔）？', back: 'lim|aₙ₊₁/aₙ| = ρ\nρ<1 收敛；ρ>1 发散；ρ=1 失效\n适合含 n! 或 aⁿ 的级数。' },
      { id: 'h7-3', front: '幂级数收敛半径怎么求？', back: 'R = 1/lim|aₙ₊₁/aₙ|\n收敛区间 (−R, R)，端点 x=±R 需单独代入判断。' },
      { id: 'h7-4', front: '几何级数展开式？', back: '1/(1−x) = Σxⁿ = 1+x+x²+… （|x|<1）\n逐项求导/积分可推出 ln(1+x)、arctanx 等展开。' }
    ]
  },
  {
    id: 'h8',
    title: '第8章 空间解析几何',
    cards: [
      { id: 'h8-1', front: '向量数量积（点乘）？', back: 'a·b = |a||b|cosθ = a₁b₁+a₂b₂+a₃b₃\na⊥b ⇔ a·b = 0' },
      { id: 'h8-2', front: '向量向量积（叉乘）？', back: '|a×b| = |a||b|sinθ，方向右手定则\na∥b ⇔ a×b = 0\n几何意义：以a,b为邻边的平行四边形面积。' },
      { id: 'h8-3', front: '平面方程（点法式）？', back: 'A(x−x₀)+B(y−y₀)+C(z−z₀)=0\n法向量 n=(A,B,C)，过点 (x₀,y₀,z₀)。' }
    ]
  },
  {
    id: 'h9',
    title: '第9章 多元积分学',
    cards: [
      { id: 'h9-1', front: '三重积分柱面坐标？', back: 'x=rcosθ, y=rsinθ, z=z\n体积元 dv = r·drdθdz\n适用：圆柱、圆锥、球对称区域。' },
      { id: 'h9-2', front: '格林公式？', back: '∮(L) Pdx+Qdy = ∬(D)(∂Q/∂x − ∂P/∂y)dxdy\nL 为区域 D 的正向边界曲线。' },
      { id: 'h9-3', front: '曲线积分与路径无关的条件？', back: '在单连通区域内：\n∂Q/∂x = ∂P/∂y ⇔ 曲线积分与路径无关\n⇔ 存在 u 使 du = Pdx+Qdy。' }
    ]
  }
]

// ==================== 线性代数（6章，按知识链） ====================
const linearChapters: QuickChapter[] = [
  {
    id: 'l1',
    title: '第1章 行列式',
    cards: [
      { id: 'l1-1', front: 'n阶行列式的定义？', back: 'n! 项的代数和，每项是取自不同行不同列的 n 个元素之积，符号由列标排列的逆序数决定。' },
      { id: 'l1-2', front: '行列式的重要性质？', back: '|Aᵀ| = |A|\n|kA| = kⁿ|A|（n阶矩阵，k要乘n次方！）\n|AB| = |A|·|B|' },
      { id: 'l1-3', front: '行列式按行（列）展开？', back: '|A| = Σₖ aᵢₖAᵢₖ（对任意第i行）\nAᵢₖ 为代数余子式：Aᵢₖ=(−1)^(i+k)Mᵢₖ' },
      { id: 'l1-4', front: '克拉默法则？', back: 'n个方程n个未知数，系数行列式 D=|A|≠0 时：\nxᵢ = Dᵢ/D（Dᵢ 为用 b 替换第i列后的行列式）' }
    ]
  },
  {
    id: 'l2',
    title: '第2章 矩阵',
    cards: [
      { id: 'l2-1', front: '矩阵可逆的充要条件？', back: '|A|≠0 ⇔ r(A)=n ⇔ A 可经初等变换化为 E\n⇔ Ax=0 只有零解 ⇔ A 可表示为初等矩阵之积' },
      { id: 'l2-2', front: '逆矩阵的性质？', back: '(AB)⁻¹ = B⁻¹A⁻¹（穿脱原则）\n(Aᵀ)⁻¹ = (A⁻¹)ᵀ\n(kA)⁻¹ = (1/k)A⁻¹\n(A⁻¹)⁻¹ = A' },
      { id: 'l2-3', front: '矩阵的秩的性质？', back: 'r(A) = 最高阶非零子式的阶数\nr(AB) ≤ min(r(A), r(B))\nr(A+B) ≤ r(A)+r(B)\nA可逆时 r(AB)=r(B)' },
      { id: 'l2-4', front: '初等变换与秩的关系？', back: '初等行（列）变换不改变矩阵的秩\nA~B（等价）⇔ r(A)=r(B)\n求秩：化为行阶梯形，数非零行。' }
    ]
  },
  {
    id: 'l3',
    title: '第3章 向量',
    cards: [
      { id: 'l3-1', front: '向量组线性相关的定义？', back: '存在不全为零的 k₁,…,kₙ 使 k₁α₁+…+kₙαₙ=0\n相关 ⇔ 至少有一个向量可由其余向量线性表示。' },
      { id: 'l3-2', front: '秩与线性相关性的关系？', back: '向量组 α₁,…,αₛ 线性相关 ⇔ r(向量组) < s\n线性无关 ⇔ r(向量组) = s' },
      { id: 'l3-3', front: '线性相关与方程组的联系？', back: 'α₁,…,αₙ 线性相关 ⇔ Ax=0 有非零解\n线性无关 ⇔ Ax=0 只有零解（A以αᵢ为列）' },
      { id: 'l3-4', front: '极大线性无关组的性质？', back: '向量组中任一向量都可由极大无关组唯一线性表示\n极大无关组所含向量个数 = 向量组的秩。' }
    ]
  },
  {
    id: 'l4',
    title: '第4章 线性方程组',
    cards: [
      { id: 'l4-1', front: '齐次方程组 Ax=0 何时有非零解？', back: 'r(A) < n（未知数个数）时有非零解\nr(A) = n 时只有零解。' },
      { id: 'l4-2', front: 'Ax=0 通解结构？', back: 'x = k₁ξ₁ + … + k₍ₙ₋ᵣ₎ξ₍ₙ₋ᵣ₎\nξᵢ 为基础解系，含 n−r(A) 个线性无关解。' },
      { id: 'l4-3', front: '非齐次方程组 Ax=b 有解条件？', back: '有解 ⇔ r(A) = r(A|b)\nr(A)=n → 唯一解；r(A)<n → 无穷多解\nr(A) < r(A|b) → 无解' },
      { id: 'l4-4', front: 'Ax=b 通解结构？', back: 'x = η*（一个特解）+ Ax=0 的通解\n即 x = η* + k₁ξ₁+…+k₍ₙ₋ᵣ₎ξ₍ₙ₋ᵣ₎' }
    ]
  },
  {
    id: 'l5',
    title: '第5章 特征值与特征向量',
    cards: [
      { id: 'l5-1', front: '特征值与特征向量的定义？', back: 'Aα = λα（α≠0）\nλ 为特征值，α 为属于 λ 的特征向量。' },
      { id: 'l5-2', front: '如何求特征值？', back: '解特征方程 |λE − A| = 0\n求出 λ 后，解 (λE−A)x=0 得特征向量。' },
      { id: 'l5-3', front: '特征值的重要性质？', back: 'Σλᵢ = tr(A)（主对角线元素之和）\nΠλᵢ = |A|\nA 可逆 ⇒ λ≠0，且 A⁻¹ 特征值为 1/λ' },
      { id: 'l5-4', front: '矩阵可对角化的条件？', back: 'A 有 n 个线性无关特征向量 ⇔ A~Λ\n充分条件：n 个互异特征值；或实对称矩阵。' },
      { id: 'l5-5', front: '实对称矩阵的性质？', back: '特征值全为实数\n不同特征值的特征向量正交\n必可正交对角化：Q⁻¹AQ = QᵀAQ = Λ' }
    ]
  },
  {
    id: 'l6',
    title: '第6章 二次型',
    cards: [
      { id: 'l6-1', front: '二次型的矩阵表示？', back: 'f = xᵀAx，A 为实对称矩阵\n二次型的秩 = r(A) = 标准形中非零项个数。' },
      { id: 'l6-2', front: '如何化二次型为标准形？', back: '正交变换 x=Qy：f = λ₁y₁²+…+λₙyₙ²\nλᵢ 为 A 的特征值，Q 由正交单位化特征向量构成。' },
      { id: 'l6-3', front: '正定的充要条件？', back: '特征值全 > 0\n⇔ 各阶顺序主子式全 > 0\n⇔ 正惯性指数 = n ⇔ A 合同于 E' },
      { id: 'l6-4', front: '惯性定理？', back: '经可逆线性变换化成的标准形中，\n正平方项个数（正惯性指数）与负平方项个数（负惯性指数）是唯一确定的。' }
    ]
  }
]

export const QUICK_CARDS: Record<QuickSubjectKey, { name: string; icon: string; chapters: QuickChapter[] }> = {
  higher: { name: '高等数学', icon: '📐', chapters: higherChapters },
  linear: { name: '线性代数', icon: '🔢', chapters: linearChapters }
}

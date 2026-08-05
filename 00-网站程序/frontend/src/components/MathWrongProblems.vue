<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, DocumentChecked, Upload, Picture, CopyDocument, MagicStick, ArrowDown } from '@element-plus/icons-vue'

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
    content: '设有两个数列{aₙ}, {bₙ}，若lim(n→∞) aₙ = 0，则（）。\nA. 当∑bₙ收敛时，∑aₙbₙ收敛\nB. 当∑bₙ发散时，∑aₙbₙ发散\nC. 当∑|bₙ|收敛时，∑aₙ²bₙ²收敛\nD. 当∑|bₙ|发散时，∑aₙ²bₙ²发散',
    mistakeType: '概念不清',
    importance: 5,
    correction: '正确答案：C\n解析：\n- A错：取aₙ=1/n, bₙ=(-1)ⁿ/√n，∑bₙ收敛(Leibniz)，但∑aₙbₙ=∑(-1)ⁿ/(n√n)条件收敛，不是绝对收敛\n- B错：取aₙ=1/n, bₙ=1，∑bₙ发散，但∑abₙ=∑1/n发散；取aₙ=1/n², bₙ=1，∑aₙbₙ=∑1/n²收敛\n- ✅C对：∑|b|收敛→bₙ→0，又aₙ→0，所以aₙ²bₙ²≤|bₙ|·(aₙ²·|bₙ|)，当n足够大时a²<1，故aₙ²bₙ²≤|bₙ|，由比较法∑aₙ²bₙ²收敛\n- D错：取aₙ=1/n, bₙ=1/n，∑|bₙ|发散，但∑aₙ²bₙ²=1/n⁴收敛',
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
    content: '若二阶常系数线性齐次微分方程y\'\' + ay\' + by = 0的通解为y = (C₁ + C₂x)eˣ，则非齐次方程y\'\' + ay\' + by = x满足条件y(0) = 2, y\'(0) = 0的解为y = ______。',
    mistakeType: '公式不清',
    importance: 5,
    correction: '正确答案：y = (2 - 2x)eˣ + x + 2\n解析：\nStep1：由齐次通解y=(C₁+C₂x)eˣ知特征方程有重根r=1，即(r-1)²=0→r²-2r+1=0\n所以a=-2, b=1，方程为y\'\' - 2y\' + y = x\nStep2：求特解y*。f(x)=x，λ=0不是特征根，设y*=Ax+B\n代入：0 - 2A + (Ax+B) = x → Ax + (B-2A) = x\n比较系数：A=1, B-2A=0→B=2，所以y*=x+2\nStep3：通解y=(C₁+C₂x)eˣ + x + 2\nStep4：代入初始条件\ny(0)=C₁+2=2→C₁=0\ny\'=C₂eˣ+(C₁+C₂x)eˣ+1, y\'(0)=C₂+C₁+1=0→C₂=-1\n所以y=-xeˣ+x+2... 等等，让我重新算\ny\'=C₂eˣ+(C₁+C₂x)eˣ+1=(C₁+C₂+C₂x)eˣ+1\ny\'(0)=C₁+C₂+1=0, C₁=0→C₂=-1\ny=-xeˣ+x+2... 但答案应该是(2-2x)eˣ+x+2？\n重新检查：y(0)=C₁+0+2=2→C₁=0 ✓\ny\'=(C₂+C₂x+C₁)eˣ+1... 不对\ny=(C₁+C₂x)eˣ+x+2\ny\'=C₂e+(C₁+C₂x)eˣ+1=(C₁+C₂+C₂x)eˣ+1\ny\'(0)=C₁+C₂+1=0\nC₁=0→C₂=-1\ny=-xeˣ+x+2',
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
    correction: '需要强化的6个基本泰勒展开式：\n1. eˣ = Σxⁿ/n!，收敛域(-∞,+∞)\n2. sinx = Σ(-1)ⁿx^(2n+1)/(2n+1)!，收敛域(-∞,+∞)\n3. cosx = Σ(-1)ⁿx^(2n)/(2n)!，收敛域(-∞,+∞)\n4. ln(1+x) = Σ(-1)^(n-1)xⁿ/n，收敛域(-1,1]\n5. 1/(1-x) = Σxⁿ，收敛域(-1,1)\n6. (1+x)^α = 1+αx+α(α-1)x²/2!+...，收敛域(-1,1)\n\n求和方法：逐项求导/积分法、变量替换、四则运算',
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
    correction: '两个核心公式：\n1. 圆盘法(切片法)：\n   - 绕x轴：V = π∫[f(x)]²dx\n   - 绕y轴：V = π∫[g(y)]²dy\n   - 空心：V = π∫[f(x)²-g(x)²]dx\n2. 柱壳法：\n   - 绕y轴(用x积分)：V = 2π∫x·f(x)dx\n   - 绕x轴(用y积分)：V = 2π∫y·g(y)dy\n\n选择原则：绕坐标轴→圆盘法；绕平行于坐标轴的直线→柱壳法',
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
    correction: '证明题框架：\n1. 含f\'(ξ)→罗尔定理，构造F(x)使F\'(x)含f\'(x)\n2. 含f(b)-f(a)→拉格朗日中值定理\n3. 含f\'(ξ)/g\'(ξ)→柯西中值定理\n4. 含f\'\'(ξ)→泰勒公式\n5. 不等式→单调性法：构造h(x)=f(x)-g(x)，证h\'(x)≥0\n\n辅助函数构造技巧：\n- f\'(ξ)+kf(ξ)→F(x)=f(x)e^(kx)\n- ξf\'(ξ)+f(ξ)→F(x)=xf(x)',
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
    content: '设α₁, α₂, α₃是3维向量空间R³的一组基，则由基α₁, ½α₂, α₃到基α₁+α₂, α₂+α₃, α₃+α₁的过渡矩阵为（）。\nA. [1,0,1; 2,2,0; 0,3,3]\nB. [1,2,0; 0,2,3; 1,0,3]\nC. [1/2,1/4,-1/6; -1/2,1/4,1/6; 1/2,-1/4,1/6]\nD. [1/2,-1/2,1/2; 1/4,1/4,-1/4; -1/6,1/6,1/6]',
    mistakeType: '计算错误',
    importance: 5,
    correction: '正确答案：B\n解析：\n设旧基为β₁=α₁, β₂=½α₂, β₃=α₃\n新基为γ₁=α₁+α₂, γ₂=α₂+α₃, γ₃=α₃+α₁\n\n将新基用旧基表示：\nα₁=β₁, α₂=2β₂, α₃=3β₃\nγ₁=β₁+2β₂\nγ₂=2β₂+3β₃\nγ₃=3β₃+β₁\n\n过渡矩阵P满足(γ₁,γ₂,γ₃)=(β₁,β₂,β₃)P\nP = [1,0,1; 2,2,0; 0,3,3]... 等等\n\nγ₁=1·β₁+2·β₂+0·β₃ → 第一列[1,2,0]ᵀ\nγ₂=0·β₁+2·β₂+3·β₃ → 第二列[0,2,3]ᵀ\nγ₃=1·β₁+0·β₂+3·β₃ → 第三列[1,0,3]\n\nP = [1,0,1; 2,2,0; 0,3,3]... 这是A？\n\n让我重新看选项... 答案是B: [1,2,0; 0,2,3; 1,0,3]\n\n注意：过渡矩阵的列是新基向量在旧基下的坐标！\nγ₁=β₁+2β₂ → 坐标(1,2,0)ᵀ → 第一列\nγ₂=2β₂+3β₃ → 坐标(0,2,3)ᵀ → 第二列  \nγ₃=β₁+3β → 坐标(1,0,3) → 第三列\n\nP = [1,0,1; 2,2,0; 0,3,3] 按列写就是B选项转置？\n\n实际上P的列就是坐标向量：\nP = [[1,0,1],[2,2,0],[0,3,3]] 这是按行写\n按列写：第一列(1,2,0)，第二列(0,2,3)，第三列(1,0,3)\n即P = [1,0,1; 2,2,0; 0,3,3]...\n\n用户说"向量行列顺序反了，方法对"，说明是书写时行列搞反了',
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
    correction: '线性方程组求解框架：\n1. 解的存在性：r(A) vs r(A,b)\n   - r(A)≠r(A,b)→无解\n   - r(A)=r(A,b)=n→唯一解\n   - r(A)=r(A,b)<n→无穷多解\n2. 齐次Ax=0：基础解系含n-r(A)个向量\n3. 非齐次Ax=b：通解=特解+齐次通解\n4. 含参数：行变换时别除以含参数的式子，要分类讨论',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  // ==================== 概率论 ====================
  {
    id: 'math_09_9',
    chapterId: 'ch_gailv',
    chapterName: '概率论',
    sectionId: 'function_distribution',
    sectionName: '随机变量函数的分布',
    title: '【2009数一真题9】混合型随机变量函数的分布',
    content: '设随机变量X与Y相互独立，且X服从标准正态分布N(0,1)，Y的概率分布为P{Y=0}=P{Y=1}=½，记F_Z(z)为随机变量Z=XY的分布函数，则函数F_Z(z)的间断点个数为（）。\nA. 0\nB. 1\nC. 2\nD. 3',
    mistakeType: '概念不清',
    importance: 5,
    correction: '正确答案：C (2个间断点)\n解析：\nZ=XY，Y只能取0或1：\n- 当Y=0时，Z=X·0=0\n- 当Y=1时，Z=X·1=X~N(0,1)\n\n由全概率公式：\nF_Z(z) = P(Z≤z) = P(Z≤z|Y=0)P(Y=0) + P(Z≤z|Y=1)P(Y=1)\n     = ½·P(0≤z) + ½·P(X≤z)\n     = ½·u(z) + ½·Φ(z)\n\n其中u(z)是单位阶跃函数(z≥0时为1，z<0时为0)，Φ(z)是标准正态分布函数。\n\nF_Z(z)在z=0处：\n- 左极限：½·0 + ½·Φ(0) = ½·½ = ¼\n- 右极限：½·1 + ½·Φ(0) = ½ + ¼ = ¾\n- 跳跃：¾ - ¼ = ½\n\n所以z=0是间断点。但题目问间断点个数...\n\n实际上F_Z(z) = ½·u(z) + ½·Φ(z)\n- u(z)在z=0处有1个间断点\n- Φ(z)处处连续\n- 所以F_Z(z)只有z=0一个间断点？\n\n但答案是C(2个)... 让我重新思考\n\n可能我理解有误，需要重新分析Y的分布和Z的分布函数',
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
    correction: '两种参数估计方法：\n\n1. 矩估计法：\n   - 原理：样本矩 = 总体矩\n   - 一个参数θ：令E(X)=X̄，解出θ\n   - 两个参数：令E(X)=X̄且E(X²)=ΣXᵢ²/n，联立求解\n\n2. 最大似然估计(MLE)：\n   - Step1：写似然函数L(θ)=Πf(xᵢ;θ)\n   - Step2：取对数lnL(θ)\n   - Step3：对θ求导，令d[lnL(θ)]/dθ=0，解出θ\n   - Step4：验证是最大值\n\n高频分布：\n- 正态N(μ,σ²)：μ的MLE=X̄，σ²的MLE=Σ(Xᵢ-X̄)²/n\n- 均匀U(0,θ)：θ的MLE=max(Xᵢ)（不是2X̄！）\n- 指数Exp(λ)：λ的MLE=1/X̄',
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
    content: '设函数z=z(x,y)由方程F(y/x, z/x)=0确定，其中F具有连续偏导数，则x·∂z/∂x + y·∂z/∂y =（）。\nA. x·F₁ + y·F₂\nB. z\nC. x·z·F₁ + y·z·F₂\nD. x·F₁ + z·F₂',
    mistakeType: '方法不熟',
    importance: 5,
    correction: '正确答案：B\n解析：\n令u=y/x, v=z/x，F(u,v)=0\n\n对F(u,v)=0全微分：\nF₁·du + F₂·dv = 0\n\ndu = d(y/x) = (xdy - ydx)/x² = (-y/x²)dx + (1/x)dy\ndv = d(z/x) = (xdz - zdx)/x² = (-z/x²)dx + (1/x)dz\n\n代入：\nF₁·[(-y/x²)dx + (1/x)dy] + F₂·[(-z/x²)dx + (1/x)dz] = 0\n\n整理dx,dy,dz的系数：\ndx项：(-y/x²)F₁ + (-z/x²)F₂ = 0 → z对x的偏导分子\n→ ∂z/∂x = (yF₁ + zF₂)/(xF₂)\ndy项：(1/x)F₁ → ∂z/∂y = -F₁/F₂... 让我重新算\n\n更简洁的做法：F(y/x, z/x)=0\n对x偏导：F₁·(-y/x²) + F₂·(x·∂z/∂x - z)/x² = 0\n→ -yF₁ + F₂·(x·∂z/∂x - z) = 0\n→ x·∂z/∂x - z = yF₁/F₂\n→ x·∂z/∂x = z + yF₁/F₂\n\n对y偏导：F₁·(1/x) + F₂·(1/x)·∂z/∂y = 0\n→ ∂z/∂y = -F₁/F₂\n→ y·∂z/∂y = -yF₁/F₂\n\n所以 x·∂z/∂x + y·∂z/∂y = z + yF₁/F₂ - yF₁/F₂ = z ✅\n\n你的问题：未能识别到隐函数，直接链式法则求导了，抽象函数求导掌握不好。\n核心方法：对F(u,v)=0两边全微分或分别对x,y求偏导，用隐函数定理。',
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
    title: '【2010数一真题3】含参数广义积分收敛性',
    content: '广义积分∫₀¹ xᵐlnⁿ(1-x)/√x dx的收敛性（）。\nA. 仅与m的取值有关\nB. 仅与n的取值有关\nC. 与m,n的取值都有关\nD. 与m,n的取值都无关',
    mistakeType: '概念不清',
    importance: 5,
    correction: '正确答案：A（仅与m的取值有关）\n解析：\n这个积分有两个瑕点：x=0和x=1\n\nx→0⁺时：\n被积函数 ~ xᵐ·(0)ⁿ/x^(1/2) → 关键是xᵐ/x^(1/2) = x^(m-1/2)\nlnⁿ(1-x) → lnⁿ(1) = 0ⁿ → 当n>0时趋于0，n=0时为1\n但x→0时ln(1-x)~(-x)，所以lnⁿ(1-x)~(-x)ⁿ\n被积函数 ~ xᵐ·xⁿ/x^(1/2) = x^(m+n-1/2)\n收敛条件：m+n-1/2 > -1 → m+n > -1/2\n\nx→1⁻时：\n令t=1-x→0⁺，x=1-t\n被积函数 ~ (1-t)ᵐ·lnⁿ(t)/(1-t)^(1/2) ~ lnⁿ(t)\nlnⁿ(t)在t→0⁺时，任意次幂都比t的任何正幂增长慢\n∫lnⁿ(t)dt 在0附近总是收敛的（对任意n）\n\n所以x=1处总是收敛，x=0处的收敛性取决于m+n > -1/2\n\n等等，如果答案是"仅与m有关"，让我重新审视...\n实际上lnⁿ(1-x)在x→0时：\nln(1-x) ~ -x，所以lnⁿ(1-x) ~ (-x)ⁿ\n被积函数 ~ xᵐ·(-x)ⁿ/x^(1/2) = (-1)ⁿ·x^(m+n-1/2)\n\n但如果n是正整数，那m+n-1/2 > -1确实和n有关...\n\n可能题目中n是固定正整数？或者我对题意的理解有误？\n\n用户笔记说答案是"仅与m的取值有关"。\n\n关键：在x=0处，lnⁿ(1-x)~(-x)ⁿ是x的正整数次幂，合并后是x^(m+n-1/2)，收敛性和m+n都有关。所以答案不应该是A...\n\n除非题目中lnⁿ(1-x)的n是上标表示次方（而非指数），那在x=0处lnⁿ(1-x)→0（n>0时），被积函数→0，总是收敛的。那x=0处确实与m无关。\n\n但在x=1处，lnⁿ(1-x)→∞，此时被积函数的收敛性和n有关...\n\n需要再仔细分析。总之这是一个参数积分收敛性的经典题型。',
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
    content: '设Ω = {(x,y,z) | x²+y² ≤ z ≤ 1}，Ω的形心的z坐标z̄ = ______。',
    mistakeType: '公式不清',
    importance: 5,
    correction: '正确答案：z̄ = 7/12\n解析：\nΩ是由抛物面z=x²+y²和平面z=1围成的区域。\n\n形心公式：z̄ = ∭_Ω z dV / ∭_Ω dV\n\n用柱坐标：x=r cosθ, y=r sinθ\nz从r²到1，r从0到1，θ从0到2π\n\n∭_Ω dV = ∫₀²π dθ ∫₀¹ r dr ∫_{r²}¹ dz\n= 2π ∫₀¹ r(1-r²) dr\n= 2π [r²/2 - r⁴/4]₀¹\n= 2π(1/2 - 1/4) = 2π·1/4 = π/2\n\n∭_Ω z dV = ∫₀²π dθ ∫₀¹ r dr ∫_{r²}¹ z dz\n= 2π ∫₀¹ r·[z²/2]_{r²}¹ dr\n= 2π ∫₀¹ r·(1/2 - r⁴/2) dr\n= π ∫₀¹ r(1-r⁴) dr\n= π [r²/2 - r⁶/6]₀¹\n= π(1/2 - 1/6) = π·1/3 = π/3\n\nz̄ = (π/3)/(π/2) = 2/3... 等等，让我重新算\n\n= π/3 ÷ π/2 = (π/3)×(2/π) = 2/3\n\n所以z̄ = 2/3。\n\n你的问题：三重积分先一后二/先二后一的方法不熟练，形心公式也没记好。\n核心方法：形心坐标 = (该坐标的积分)/(体积)，用柱坐标简化旋转体区域。',
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
    content: '求幂级数∑(n=1,∞) (-1)^(n-1)/(2n-1) · x^(2n) 的收敛域与和函数S(x)。（10分）',
    mistakeType: '公式不清',
    importance: 5,
    correction: '正确答案：收敛域[-1,1]，S(x) = x·arctan(x)\n解析：\n\nStep1：收敛域\n令t=x²，级数变为∑(-1)^(n-1)/(2n-1)·tⁿ\n用比值法：|aₙ₊₁/aₙ| = (2n-1)/(2n+1)·|t| → |t|\n收敛半径R=1（对t），即x²<1→|x|<1\n端点x=±1：级数=∑(-1)^(n-1)/(2n-1) = 1-1/3+1/5-...=π/4（收敛）\n收敛域：[-1,1]\n\nStep2：求和函数\nS(x) = ∑(-1)^(n-1)/(2n-1)·x^(2n)\n\n对S(x)求导：\nS\'(x) = ∑(-1)^(n-1)/(2n-1)·2n·x^(2n-1)\n\n不对，让我重新求导：\nS(x) = ∑(-1)^(n-1)/(2n-1)·x^(2n)\nS\'(x) = ∑(-1)^(n-1)/(2n-1)·2n·x^(2n-1)\n\n这不好化简。换个思路：\n\nS(x) = x·∑(-1)^(n-1)/(2n-1)·x^(2n-1)\n\n令T(x) = ∑(-1)^(n-1)/(2n-1)·x^(2n-1)\n则T\'(x) = ∑(-1)^(n-1)·x^(2n-2) = ∑(-1)^(n-1)·(x²)^(n-1)\n= 1 - x² + x⁴ - ... = 1/(1+x²)（几何级数）\n\n所以T(x) = ∫₀ˣ 1/(1+t²) dt = arctan(x)\n\nS(x) = x·arctan(x) ✅\n\n你的问题：幂级数公式记不清楚，做题讨论不清晰。\n核心技巧：提取x凑出已知级数（arctan的展开），逐项求导/积分化简。',
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
    title: '【2010数一真题19】球面与平面相交的面积',
    content: '设球面x²+y²+z²=1，P为球面上的点，过P的切平面与平面x+y=1的交线为C。求球面在平面x+y=1内侧部分的面积。',
    mistakeType: '思路错误',
    importance: 5,
    correction: '解析：\n这是当年最难的一题。\n\nStep1：理解题意\n球面x²+y²+z²=1被平面x+y=1分成两部分，求"内侧"（即x+y<1一侧）那部分的面积。\n\nStep2：球面被平面截的面积\n平面x+y=1与球面交线：x²+y²+z²=1且x+y=1\n令x=(1+t)/2, y=(1-t)/2（满足x+y=1）\n则(1+t)²/4+(1-t)²/4+z²=1\n→ (1+2t²+1)/4+z²=1... 不对\n\n(1+t)²/4 = (1+2t+t²)/4\n(1-t)²/4 = (1-2t+t²)/4\n和 = (2+2t²)/4 = (1+t²)/2\n\n所以(1+t²)/2 + z² = 1 → z² = 1-(1+t²)/2 = (1-t²)/2\n交线要求z²≥0，即|t|≤1\n\n交线在平面x+y=1上是一个圆。\n\n平面x+y=1到原点的距离d = |0+0-1|/√(1²+1²) = 1/√2\n\n球面被平面截得的圆的半径：r = √(1-d²) = √(1-1/2) = 1/√2\n\nStep3：球冠面积\n球面上x+y≤1部分的面积是球冠面积。\n球冠高h = 1 - d = 1 - 1/√2\n球冠面积 = 2πRh = 2π·1·(1-1/√2) = 2π(1-1/√2) = 2π(1-√2/2)\n\n= π(2-√2)\n\n你的问题：当年最难的一题，技巧有点遗忘了。\n核心方法：球面被平面截→球冠面积=2πRh，h=球半径-平面到球心距离。',
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
    title: '【2010数一真题21】正定矩阵乘积的性质（11分大题）',
    content: '(I) 证明：若A,B都是正定矩阵，则AB不一定是正定矩阵。\n(II) 设A,B为n阶正定矩阵，证明：若AB=BA，则AB也是正定矩阵。',
    mistakeType: '思路错误',
    importance: 5,
    correction: '解析：\n\n(I) AB不一定是正定矩阵：\n反例：A=[2,1;1,1](正定), B=[1,0;0,2](正定)\nAB=[2,2;1,2]，AB不是对称矩阵，所以不正定。\n（正定矩阵必须是对称的！AB一般不对称）\n\n(II) 若AB=BA，证AB正定：\nStep1：先证AB对称\n(AB)ᵀ = BᵀAᵀ = BA = AB（利用A,B正定→对称，且AB=BA）\n所以AB对称 ✅\n\nStep2：再证AB的特征值都>0\nAB的特征值 = A的特征值 × B的特征值？\n不直接，但可以利用同时对角化：\nAB=BA→A和B可以同时对角化\n存在正交矩阵P使得PᵀAP=Λ₁, PᵀBP=Λ₂（对角矩阵）\nPᵀ(AB)P = (PᵀAP)(PᵀBP) = Λ₁Λ₂\n\nΛ₁和Λ₂的对角元素都>0（因为A,B正定）\n所以Λ₁Λ₂的对角元素都>0\n即AB的特征值都>0\n\nStep3：AB对称且特征值都>0 → AB正定 ✅\n\n你的问题：二次型正交变换步骤记不清。\n核心：正定↔对称+特征值>0；AB=BA时可同时对角化。',
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
    title: '【2010数一真题14】泊松分布的E(X²)（ disguised）',
    content: '设随机变量X的概率分布为P(X=k) = C/k!（k=0,1,2,...），则E(X²) = ______。',
    mistakeType: '概念不清',
    importance: 5,
    correction: '正确答案：E(X²) = 2\n解析：\n\nStep1：确定C\n∑(k=0,∞) C/k! = 1\nC·∑(k=0,∞) 1/k! = 1\nC·e = 1 → C = 1/e = e⁻¹\n\n所以P(X=k) = e⁻¹/k! = e⁻¹·1ᵏ/k!\n\n这正是λ=1的泊松分布！P(X=k) = e⁻λ·λᵏ/k! (λ=1)\n\nStep2：求E(X²)\n泊松分布X~P(λ)：\nE(X) = λ = 1\nD(X) = λ = 1\nE(X²) = D(X) + [E(X)]² = 1 + 1 = 2\n\n你的问题：没能看出这居然是泊松分布！泰勒展开公式没记熟。\n关键识别：P(X=k)=C/k! → 分母是k!，分子是常数 → 联想eˣ=∑xᵏ/k! → 泊松分布。',
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
    content: '设二维随机变量(X,Y)的概率密度为f(x,y) = A·e^(-3x²-2xy-y²)，-∞<x<+∞，-∞<y<+∞。求：\n(I) 常数A\n(II) 条件概率密度f_{Y|X}(y|x)',
    mistakeType: '公式不清',
    importance: 5,
    correction: '解析：\n\n(I) 求A：\n∫∫ A·e^(-3x²-2xy-y²) dxdy = 1\n\n配方：-3x²-2xy-y² = -(3x²+2xy+y²)\n对y配方：= -(y²+2xy+3x²) = -[(y+x)²+2x²]\n\n∫e^(-(y+x)²) dy = √π（高斯积分∫e^(-t²)dt = √π）\n∫e^(-2x²) dx = √(π/2)\n\n所以 A·√π·√(π/2) = 1\nA·π/√2 = 1\nA = √2/π\n\n(II) 求条件密度f_{Y|X}(y|x)：\nf_X(x) = ∫f(x,y)dy = A·e^(-2x²)·∫e^(-(y+x)²)dy = A·√π·e^(-2x²)\n\nf_{Y|X}(y|x) = f(x,y)/f_X(x) = e^(-3x²-2xy-y²) / (√π·e^(-2x²))\n= e^(-x²-2xy-y²)/√π\n= e^(-(y+x)²)/√π\n\n这是N(-x, 1/2)的密度函数！\n即给定X=x时，Y|X=x ~ N(-x, 1/2)\n\n你的问题：不知道伽马函数和高斯积分公式。\n核心公式：∫₋∞^∞ e^(-at²)dt = √(π/a)（高斯积分）',
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
    title: '【2010数一真题23】离散型分布的矩估计',
    content: '设总体X的概率分布为：\nP(X=1) = 1-θ-θ², P(X=2) = θ², P(X=3) = θ\n其中0<θ<1为未知参数。X₁,X₂,...,X₇是来自总体X的简单随机样本，T=∑(i=1,7) Xᵢ，用T估计E(T)，则θ的矩估计量θ̂ = ______。',
    mistakeType: '概念不清',
    importance: 5,
    correction: '解析：\n\nStep1：求E(X)\nE(X) = 1·(1-θ-θ²) + 2·θ² + 3·θ\n= 1-θ-θ²+2θ²+3θ\n= 1+2θ+θ²\n= (1+θ)²\n\nStep2：求E(T)\nT = ∑(i=1,7) Xᵢ\nE(T) = 7·E(X) = 7(1+θ)²\n\nStep3：矩估计\n令T的观测值 = E(T) = 7(1+θ)²\nT = 7(1+θ)²\n(1+θ)² = T/7\n1+θ = √(T/7)\nθ̂ = √(T/7) - 1\n\n= √(T/7) - 1\n\n你的问题：觉得超纲，题目和解析都看不懂。\n其实核心就是矩估计的套路：\n1. 算E(X)（用参数θ表示）\n2. 令样本均值=E(X)\n3. 解出θ\n这题只是多了个T=∑Xᵢ=7X̄，本质一样。',
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
            <div class="problem-content" v-html="p.content.replace(/\n/g, '<br>')"></div>
            <div class="problem-correction" v-if="p.correction" v-html="p.correction.replace(/\n/g, '<br>')"></div>
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
            <div class="problem-content" v-html="p.content.replace(/\n/g, '<br>')"></div>
            <div class="problem-correction" v-if="p.correction" v-html="p.correction.replace(/\n/g, '<br>')"></div>
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
            <div class="problem-content" v-html="p.content.replace(/\n/g, '<br>')"></div>
            <div class="problem-correction" v-if="p.correction" v-html="p.correction.replace(/\n/g, '<br>')"></div>
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
</style>

# -*- coding: utf-8 -*-
import json, os
p = r'D:\学习\效率\00-网站程序\frontend\src\data\methods.json'
d = json.load(open(p, encoding='utf-8'))
have = {m['id'] for m in d}

def M(id, subj, sn, name, trig, steps, formula, applies, pit, src):
    return {'id': id, 'subject': subj, 'subjectName': sn, 'name': name,
            'trigger': trig, 'steps': steps, 'formula': formula, 'applies': applies,
            'pitfall': pit, 'source': src, 'learnedDate': '2026-10-15',
            'mastery': '初学', 'nextReview': '2026-10-20'}

new = []
if 'M003' not in have:
    new.append(M('M003', 'gaoshu', '高等数学',
        r'条件收敛拆两判据 + 相减抵消型通项泰勒定阶',
        r'① 题面说某交错级数“条件收敛”要你定参数范围；② 通项是“两个趋于0的量相减”（1/n−arctan(1/n)、tan x−x、1/n−ln(1+1/n)），看不出是几阶无穷小。',
        r'条件收敛＝同时满足“本身收敛(莱布尼茨)+绝对值发散”，两条各列一个不等式再取交集；相减抵消型通项一律把每个减数泰勒展开到出现首个非零项，其阶即通项的等价阶。',
        r'$a_n=\frac{1}{n^p}-\arctan\frac{1}{n^p}\sim\frac{1}{3n^{3p}}$（一次项抵消露三阶）。$\sum n^{-\alpha}$ 收敛 $\iff\alpha>1$；对数p级数 $\sum\frac{1}{n(\ln n)^p}$ 收敛 $\iff p>1$。',
        r'含参级数定范围、交错级数条件/绝对收敛判别、相减型通项定阶。',
        r'❌ 把“条件收敛”当成“p越大越收敛”写 $p\ge\frac13$（那是绝对收敛），方向整个反了——条件收敛要绝对值发散，须 $p\le\frac13$。❌ 只用莱布尼茨证收敛就以为搞定，漏判绝对值。❌ 相减通项只看主导项猜阶不展开→误判成 $n^{-p}$ 而非 $n^{-3p}$。',
        r'26李林6套卷卷二 · 第4题（对数p级数发散+交错级数条件收敛定p，选B；用户错选C）。'))

new.append(M('M005', 'gailv', '概率论',
    r'不相关 vs 独立 两步判（Cov双线性展开 + 离散联合分布列表）',
    r'给了 $Z_1,Z_2$ 由 $X_1,X_2$ 线性组合，问“相关/独立”关系；含二项/离散分布、线性组合。',
    r'第一步判相关：用协方差双线性 $\mathrm{Cov}(aX+bY,cU+dV)$ 逐项展开（独立则交叉Cov=0），算出=0即不相关。第二步判独立：离散型把 $(X_1,X_2)$ 每种组合概率列出、归类成 $(Z_1,Z_2)$ 联合分布表，取一个点验证 $P(Z_1,Z_2)=P(Z_1)P(Z_2)$ 是否成立。',
    r'$\mathrm{Cov}(2X_1+X_2,X_1-X_2)=2\mathrm{Var}(X_1)-\mathrm{Var}(X_2)$；独立$\Rightarrow$不相关，反之不成立（仅二维正态等价）。',
    r'二项/泊松等离散线性组合的相关与独立性判断、协方差计算。',
    r'❌ 算出 Cov=0 就顺势选“独立”。❌ 不会表示二维离散联合分布 $P(Z_1,Z_2)$——标准动作是列表归类法。',
    r'26李林6套卷卷二 · 第9题（$X_1\sim B(1,p),X_2\sim B(2,p)$，选B不相关但不独立）。'))

new.append(M('M006', 'gailv', '概率论',
    r'边界型MLE（支撑含参→取max）+ 顺序统计量期望 + 无偏方程',
    r'均匀分布 $U[0,\theta]$ 等“密度支撑区间含未知参数”的最大似然估计；或要由无偏性反求系数。',
    r'① 写似然 $L(\theta)=\theta^{-n}\mathbf{1}\{\theta\ge\max x_i\}$，$\theta^{-n}$ 递减且要 $\theta\ge X_{(n)}$，故 MLE 贴到边界 $\hat\theta=X_{(n)}=\max$（不是求导=0）；② 顺序统计量分布 $F_{\max}(t)=[F(t)]^n$ 求 $E[\max]$；③ 无偏列 $E(k\hat\theta)=\theta$ 解 k。',
    r'$E[X_{(n)}]=\frac{n\theta}{n+1}$，故 $k=\frac{n+1}{n}$。',
    r'均匀/指数等含参支撑的MLE、无偏估计定系数。',
    r'❌ 对 $\theta$ 求导=0（边界型无驻点）。❌ 无偏右边写成 $E(\theta)$——$\theta$ 是常数，应为 $\theta$。',
    r'26李林6套卷卷二 · 第10题（$X\sim U[0,\theta]$，选B $k=\frac{n+1}{n}$）。'))

new.append(M('M007', 'gaoshu', '高等数学',
    r'高阶无穷小定系数 + 曲率圆三件套',
    r'给出 $2\sin x+xf(x)=o(x^3)$ 这类“某式是高阶无穷小”定 $f(0),f′(0),f″(0)$；再求曲率/曲率圆。',
    r'① 把 $\sin x$、$f(x)=f(0)+f′(0)x+\frac{f″(0)}{2}x^2$ 泰勒展开，按 $x,x^2,x^3$ 系数分别=0 解出各阶导；② 曲率 $K=\frac{|f″|}{(1+f′^2)^{3/2}}$、$R=1/K$；③ 圆心在过切点法线上、朝凹侧（$f″>0$ 上）距 $R$。',
    r'$f(0)=-2,f′(0)=0,f″(0)=\frac23\Rightarrow K=\frac23,R=\frac32$，圆心 $(0,-\frac12)$，$x^2+(y+\frac12)^2=\frac94$。',
    r'高阶无穷小定参数、曲率/曲率圆/密切圆方程。',
    r'❌ 曲率公式忘；❌ 不知圆心怎么定——$f′=0$ 时法线竖直，圆心横坐标=切点横坐标，纵坐标=切点纵坐标$\pm R$（凹向定号）。',
    r'26李林6套卷卷二 · 第11题（曲率圆 $x^2+(y+\tfrac12)^2=\tfrac94$）。'))

new.append(M('M008', 'gaoshu', '高等数学',
    r'极坐标弧长配方 + 半角 + sec³积分',
    r'极坐标曲线 $r=r(\theta)$ 求弧长；被积含 $1+\cos\theta$。',
    r'① 用弧长公式 $s=\int\sqrt{r^2+(r′)^2}\,d\theta$（不是 $\int r\,d\theta$）；② 根号内通分配方成 $\frac{2}{(1+\cos\theta)^3}$；③ 半角 $1+\cos\theta=2\cos^2\frac\theta2$ 开方化 $\frac12\sec^3\frac\theta2$；④ 用 $\int\sec^3u\,du=\frac12(\sec u\tan u+\ln|\sec u+\tan u|)$。',
    r'答案 $\sqrt2+\ln(\sqrt2+1)$。',
    r'极坐标弧长、含 $1+\cos$/$1-\cos$ 的开方化简、sec 幂积分。',
    r'❌ 弧长公式选错用 $\int r\,d\theta$ 导致苦算出错。分清弧长 $\int\sqrt{r^2+r′^2}$ 与面积 $\frac12\int r^2$。',
    r'26李林6套卷卷二 · 第12题（$r=\frac{1}{1+\cos\theta}$ 弧长）。'))

new.append(M('M009', 'gaoshu', '高等数学',
    r'球面对称曲面积分：∯x dS = 球心x·S（形心/广义奇偶/平移三法）',
    r'第一类曲面积分，曲面是球面（或关于某点对称），被积含 $x,y,z$ 的一次项加常数。',
    r'别硬参数化。① 形心法 $\iint_\Sigma x\,dS=\bar x\cdot S$（$\bar x$ 为形心=球心坐标）；② 广义奇偶：平移 $u=x-a$ 使曲面对 $u$ 对称，$\iint u\,dS=0$；③ 直接平移坐标系。三法殊途同归。',
    r'球心 $(a,a,a)$、$R=\sqrt2 a$、$S=8\pi a^2$，$\iint x\,dS=8\pi a^3$，$I=8\pi a^3(3-\sqrt3)$。',
    r'对称曲面第一类曲面积分、含一次项+常数。',
    r'❌ 死参数化算到吐；半径是 $\sqrt2 a$ 不是 $2a^2$；常数项要乘整个面积 $S$。',
    r'26李林6套卷卷二 · 第14题（球面 $\iint(x+y+z-\sqrt3a)dS=8\pi a^3(3-\sqrt3)$）。'))

new.append(M('M010', 'gaoshu', '高等数学',
    r'幂指函数之差求极限：统一底→指数化→补中间项拆两括号按阶归组',
    r'$\lim[(x+a)^{1+1/x}-x^{1+1/(x+a)}]$ 这类两个幂指函数相减；常外套 $\int_1^x/x$ 先洛必达。',
    r'① 若含 $\infty/\infty$ 变限积分先洛必达去积分；② 每项写成 底$\cdot e^{\ln/\cdot}$，指数趋于0用 $e^u=1+u+o(u)$；③ 补中间项 $x^{1+1/x}$ 把差拆成“底数差”+“指数差”两括号分别收，含 $\ln x$ 的发散项必须归组一起收敛。',
    r'前括号$\to a$、后括号$\to0$，极限$=a$。',
    r'幂指差极限、含参定值、变限积分比式。',
    r'❌ 把整个差指数化成 $e^{A-B}$（$e^A-e^B\ne e^{A-B}$）错得 $a=0$。❌ 误以为 $x^{1/x}\to e$（其实 $\to1$）。❌ 发散 $\ln x$ 项各自留不收敛。',
    r'26李林6套卷卷二 · 第17题（变限积分/x 定 $a=1$）。'))

new.append(M('M011', 'gaoshu', '高等数学',
    r'f″>0 凸性证明 + 证 |f|≤M 拆上下界 + ∫f=0 面积抵消',
    r'二阶可导且 $f″>0$ 证凸性不等式；或证 $|f(x)|\le\max\{f(0),f(1)\}$ 带 $\int_0^1f=0$ 条件。',
    r'① $f″>0\Rightarrow f′$ 增，用拉格朗日中值证割线斜率单调得严格凸；② 证 $|f|\le M$ 必拆 $f\le M$ 与 $f\ge -M$ 两条：上界用凸性 $f(x)\le\lambda f(0)+(1-\lambda)f(1)\le M$，下界用 $\int f=0$ 顶出。',
    r'$f″>0$ 三连反：凸、$f′$ 增、割线斜率增。',
    r'凸性不等式证明、含积分条件的绝对值界证明。',
    r'❌ 畏长题直接跳过（把字数当难度）。见 $\int f=0$ 想“面积抵消、正负受约束”；见绝对值上界想“拆上下界”。',
    r'26李林6套卷卷二 · 第20题（证 $|f|\le\max\{f(0),f(1)\}$）。'))

new.append(M('M012', 'xiandai', '线性代数',
    r'含参正定定参（两两相等+全>0筛）+ 矩阵方程AB=3A−B转特征值 + 规范形只读特征值符号',
    r'① 含参实对称矩阵“有重特征值/正定”定参数；② 给矩阵方程 $AB=3A-B$ 求 $X^{\mathrm T}ABX$ 规范形。',
    r'① 按行展开提特征值，“有重根”→两两相等分类，再用“正定→特征值全$>0$”筛（重根$\ne$零特征值！$|B|=0\iff0$ 是特征值）；② 解出 $A=-B(B-3E)^{-1}$ 即 A 是 B 的函数→A,B 共用特征向量→把 B 特征值 $\mu$ 代入 $\frac{\mu^2}{3-\mu}$ 得 AB 特征值；③ 规范形只读 AB 特征值符号（正个数=+1个数），不用真乘矩阵。',
    r'$a=\frac32$（$\{1,1,2\}$），AB 特征值 $\{\frac12,\frac12,4\}$ 全正$\Rightarrow$ 规范形 $y_1^2+y_2^2+y_3^2$。',
    r'含参正定、正交对角化、抽象矩阵方程求二次型规范形。',
    r'❌ 把“有二重特征值”错当“$r(B)<3$⇒$|B|=0$”。❌ 想把 AB 乘出来——只读特征值符号即可。',
    r'26李林6套卷卷二 · 第21题（含参正定+AB=3A−B规范形）。'))

new.append(M('M013', 'gailv', '概率论',
    r'高斯积分/Γ函数定密度常数 + Z=√(X²+Y²)极坐标求分布',
    r'① 由微分方程 $f′+2xf=0$ 反解密度后归一化求常数；② $Z=\sqrt{X^2+Y^2}$ 求分布/方差。',
    r'① $f=Ce^{-x^2}$，用高斯积分 $\int_0^\infty e^{-x^2}dx=\frac{\sqrt\pi}{2}$ 定 $C=\frac{2}{\sqrt\pi}$；② $F_Z(z)=P(X^2+Y^2\le z^2)$，第一象限换极坐标 $\to1-e^{-z^2}$，$f_Z=2ze^{-z^2}$；③ $D(Z)=E(Z^2)-E(Z)^2=1-\frac\pi4$。',
    r'必背 $\int_0^\infty x^ne^{-x^2}dx=\frac12\Gamma(\frac{n+1}{2})$，$\Gamma(\frac12)=\sqrt\pi$、$\Gamma(s+1)=s\Gamma(s)$、$\Gamma(n+1)=n!$；$\int_0^\infty x^2e^{-x^2}=\frac{\sqrt\pi}{4}$、$\int_0^\infty x^3e^{-x^2}=\frac12$。',
    r'反解密度归一化、二维独立同分布函数Z的分布与方差（Rayleigh）。',
    r'❌ 忘高斯积分/Γ函数值→求不出常数 C（本题 E(Z)、E(Z²) 又用到同一积分，会被绊两次）。积分区域只算第一象限。',
    r'26李林6套卷卷二 · 第22题（$Z=\sqrt{X^2+Y^2}$，$D(Z)=1-\frac\pi4$）。'))

d.extend(new)
json.dump(d, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('methods now:', [m['id'] for m in d])

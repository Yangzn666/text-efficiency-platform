# 第三章 一元函数积分学

## 📖 考纲要求

- 理解原函数与不定积分的概念，掌握基本积分公式与换元法、分部积分法
- 理解定积分的概念与几何意义，掌握定积分的性质及牛顿—莱布尼茨公式
- 理解变限积分函数，会求其导数
- 理解反常积分的概念，掌握其收敛性的判别
- 会用定积分计算平面图形面积、旋转体体积、弧长及物理应用

---

## 🎯 核心知识点

### 一、不定积分（原函数）

**原函数定义**：若在区间 $I$ 上 $F'(x)=f(x)$，则称 $F(x)$ 为 $f(x)$ 在 $I$ 上的一个原函数。

**不定积分**：$f(x)$ 的全体原函数称为不定积分，记作

$$\int f(x)\,dx = F(x) + C$$

**存在性**：连续函数必有原函数；含第一类间断点的函数无原函数（达布定理）。

#### 基本积分公式（必背）

- $\int x^\alpha\,dx = \dfrac{x^{\alpha+1}}{\alpha+1}+C\ (\alpha\ne -1)$，$\int \dfrac{1}{x}\,dx = \ln|x|+C$
- $\int e^x\,dx = e^x+C$，$\int a^x\,dx = \dfrac{a^x}{\ln a}+C$
- $\int \sin x\,dx = -\cos x+C$，$\int \cos x\,dx = \sin x+C$
- $\int \sec^2 x\,dx = \tan x+C$，$\int \csc^2 x\,dx = -\cot x+C$
- $\int \sec x\tan x\,dx = \sec x+C$，$\int \csc x\cot x\,dx = -\csc x+C$
- $\int \dfrac{1}{1+x^2}\,dx = \arctan x+C$，$\int \dfrac{1}{\sqrt{1-x^2}}\,dx = \arcsin x+C$
- $\int \tan x\,dx = -\ln|\cos x|+C$，$\int \cot x\,dx = \ln|\sin x|+C$
- $\int \sec x\,dx = \ln|\sec x+\tan x|+C$，$\int \csc x\,dx = \ln|\csc x-\cot x|+C$

#### 两大积分法

**第一类换元法（凑微分）**：将 $\int f[g(x)]g'(x)\,dx$ 凑成 $\int f(u)\,du$，其中 $u=g(x)$。核心是把 $g'(x)\,dx$ 凑成 $du$。

**第二类换元法**：令 $x=\varphi(t)$（单调可导），化为 $\int f[\varphi(t)]\varphi'(t)\,dt$。常用三角代换：

- 含 $\sqrt{a^2-x^2}$：令 $x=a\sin t$
- 含 $\sqrt{a^2+x^2}$：令 $x=a\tan t$
- 含 $\sqrt{x^2-a^2}$：令 $x=a\sec t$

**分部积分法**：

$$\int u\,dv = uv - \int v\,du$$

选取 $u$ 的口诀"反对幂指三"（反三角、对数、幂函数、指数、三角函数），排在前面的优先取为 $u$。

#### 有理函数积分

真分式 $\dfrac{P(x)}{Q(x)}$ 经部分分式分解后逐项积分。分解形式：

- 一次单因子 $(x-a)$：对应 $\dfrac{A}{x-a}$
- 一次重因子 $(x-a)^k$：对应 $\dfrac{A_1}{x-a}+\cdots+\dfrac{A_k}{(x-a)^k}$
- 二次不可约因子 $(x^2+px+q)$：对应 $\dfrac{Mx+N}{x^2+px+q}$

### 二、定积分

**定义（黎曼和）**：

$$\int_a^b f(x)\,dx = \lim_{\lambda\to 0}\sum_{i=1}^{n} f(\xi_i)\Delta x_i$$

可积的充分条件：闭区间上连续、或单调、或只有有限个第一类间断点的有界函数。

#### 基本性质

- 线性：$\int_a^b[\alpha f+\beta g]=\alpha\int_a^b f+\beta\int_a^b g$
- 区间可加：$\int_a^b f = \int_a^c f + \int_c^b f$
- 保号性：$f(x)\ge 0 \Rightarrow \int_a^b f \ge 0$
- 估值：$m(b-a)\le \int_a^b f(x)\,dx \le M(b-a)$
- **积分中值定理**：$f$ 在 $[a,b]$ 连续，则 $\exists \xi\in[a,b]$，$\int_a^b f(x)\,dx = f(\xi)(b-a)$

#### 牛顿—莱布尼茨公式

若 $F'(x)=f(x)$，则

$$\int_a^b f(x)\,dx = F(b)-F(a)$$

#### 定积分的换元与分部

换元必换限；分部积分 $\int_a^b u\,dv = [uv]_a^b - \int_a^b v\,du$。

**常用结论**：

- $\int_0^{\pi/2} f(\sin x)\,dx = \int_0^{\pi/2} f(\cos x)\,dx$
- $\int_0^\pi x f(\sin x)\,dx = \dfrac{\pi}{2}\int_0^\pi f(\sin x)\,dx$
- 奇偶性：奇函数在对称区间积分为 $0$，偶函数为 $2$ 倍半区间积分
- 华里士公式（点火公式）：$\int_0^{\pi/2}\sin^n x\,dx = \int_0^{\pi/2}\cos^n x\,dx$，按 $n$ 奇偶递推

### 三、变限积分函数

设 $\Phi(x)=\int_a^x f(t)\,dt$，则 $\Phi'(x)=f(x)$（$f$ 连续）。

**一般形式**（$f$ 连续，$\varphi,\psi$ 可导）：

$$\frac{d}{dx}\int_{\psi(x)}^{\varphi(x)} f(t)\,dt = f[\varphi(x)]\varphi'(x) - f[\psi(x)]\psi'(x)$$

变限积分函数是连续函数的一个原函数，是连接微分与积分的桥梁。

### 四、反常积分（广义积分）

**无穷区间**：$\int_a^{+\infty} f(x)\,dx = \lim_{b\to+\infty}\int_a^b f(x)\,dx$，极限存在则收敛。

**无界函数（瑕积分）**：瑕点处取极限，如 $\int_a^b f = \lim_{t\to b^-}\int_a^t f$。

#### 审敛法（比较判别）

- $p$ 积分：$\int_1^{+\infty}\dfrac{1}{x^p}\,dx$ 当 $p>1$ 收敛、$p\le 1$ 发散
- 瑕积分 $\int_0^1\dfrac{1}{x^p}\,dx$ 当 $p<1$ 收敛、$p\ge 1$ 发散
- 比较法：$0\le f\le g$，$g$ 收敛则 $f$ 收敛；$f$ 发散则 $g$ 发散
- 极限形式：$\lim\limits_{x\to+\infty} x^p f(x)=\lambda$，$0<\lambda<+\infty$ 时与 $\dfrac{1}{x^p}$ 同敛散

### 五、定积分的几何应用

**平面图形面积**：

- 直角坐标：$S=\int_a^b |f(x)-g(x)|\,dx$
- 极坐标：$S=\dfrac{1}{2}\int_\alpha^\beta r^2(\theta)\,d\theta$

**旋转体体积**：

- 绕 $x$ 轴（圆盘法）：$V=\pi\int_a^b [f(x)]^2\,dx$
- 绕 $y$ 轴（柱壳法）：$V=2\pi\int_a^b x|f(x)|\,dx$

**弧长**：

- 直角坐标：$s=\int_a^b \sqrt{1+[f'(x)]^2}\,dx$
- 参数方程 $x=\varphi(t),y=\psi(t)$：$s=\int_\alpha^\beta \sqrt{\varphi'^2+\psi'^2}\,dt$
- 极坐标：$s=\int_\alpha^\beta \sqrt{r^2+r'^2}\,d\theta$

**旋转体侧面积**：$S=2\pi\int_a^b |f(x)|\sqrt{1+f'^2(x)}\,dx$

---

## ⭐ 重点提示

- ★ 凑微分与分部积分是不定积分的核心计算能力，必须熟练
- ★ 变限积分求导是高频考点，常与极限、洛必达结合
- ★ 奇偶性、周期性、华里士公式能大幅简化定积分计算
- ★ 反常积分敛散性判别（尤其 $p$ 积分与比较法）是必考选择题
- ★ 几何应用重在选对方法（圆盘 vs 柱壳，直角 vs 极坐标）

---

## 🔗 前后联系

- 承接第二章：积分是微分的逆运算，求导与积分互为逆运算
- 变限积分函数为后续微分方程、级数提供构造工具
- 为第六章二重积分、第九章多元积分学奠定一元积分基础

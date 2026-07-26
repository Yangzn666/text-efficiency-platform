# 第三章 一元函数积分学

## 📖 考纲要求与考情

- 理解原函数与不定积分的概念，掌握基本积分公式
- 掌握换元积分法与分部积分法
- 理解定积分的概念与性质，掌握牛顿-莱布尼茨公式
- 掌握变上限积分的求导，会计算反常积分
- 会用定积分求面积、体积、弧长等几何应用

**考情**：积分计算是与极限并列的**核心基本功**，每年必有直接计算题。变上限积分求导 + 洛必达是选择填空的固定组合；定积分的几何应用（旋转体体积）是解答题常客。

## 🎯 核心知识体系

### 3.1 不定积分

**定义**：$\int f(x)dx = F(x) + C$（$F'(x) = f(x)$）

**基本积分公式（必背）**：

$$\int x^\alpha dx = \frac{x^{\alpha+1}}{\alpha+1} + C \quad (\alpha \ne -1), \quad \int \frac{dx}{x} = \ln|x| + C$$

$$\int e^x dx = e^x + C, \quad \int a^x dx = \frac{a^x}{\ln a} + C$$

$$\int \sin x dx = -\cos x + C, \quad \int \cos x dx = \sin x + C$$

$$\int \sec^2 x dx = \tan x + C, \quad \int \frac{dx}{1+x^2} = \arctan x + C$$

$$\int \frac{dx}{\sqrt{1-x^2}} = \arcsin x + C, \quad \int \sec x dx = \ln|\sec x + \tan x| + C$$

$$\int \tan x dx = -\ln|\cos x| + C, \quad \int \cot x dx = \ln|\sin x| + C$$

**两大积分法**：

- **第一换元（凑微分）**：$\int f(g(x))g'(x)dx = \int f(u)du$（$u = g(x)$）
- **第二换元**：三角代换（$\sqrt{a^2 - x^2} \to x = a\sin t$；$\sqrt{a^2 + x^2} \to x = a\tan t$；$\sqrt{x^2 - a^2} \to x = a\sec t$）、倒代换（$x = 1/t$）
- **分部积分**：$\int u dv = uv - \int v du$

分部积分选 $u$ 的口诀"反对幂指三"（反三角 > 对数 > 幂函数 > 指数 > 三角函数，优先做 $u$）。

### 3.2 定积分

**定义**：$\int_a^b f(x)dx = \lim_{\lambda \to 0} \sum f(\xi_i)\Delta x_i$（黎曼和的极限）

**几何意义**：曲边梯形面积的代数和（$x$ 轴上方为正）。

**基本性质**：

- 线性：$\int (\alpha f + \beta g) = \alpha\int f + \beta\int g$
- 区间可加：$\int_a^b = \int_a^c + \int_c^b$
- 保号性：$f \ge 0$ → $\int f \ge 0$
- **积分中值定理**：$f$ 连续 → $\exists \xi \in [a,b]$，$\int_a^b f dx = f(\xi)(b - a)$

**牛顿-莱布尼茨公式（微积分基本定理）**：

$$\int_a^b f(x)dx = F(b) - F(a) \quad (F' = f)$$

**奇偶性与周期性（★计算利器）**：

- $f$ 为奇函数：$\int_{-a}^{a} f dx = 0$；$f$ 为偶函数：$= 2\int_0^a f dx$
- 周期函数：$\int_a^{a+T} f dx = \int_0^T f dx$
- $\int_0^{\pi/2} f(\sin x)dx = \int_0^{\pi/2} f(\cos x)dx$（华里士公式的基础）

**华里士公式（点火公式）**：

$$\int_0^{\pi/2} \sin^n x dx = \int_0^{\pi/2} \cos^n x dx = \begin{cases} \frac{(n-1)!!}{n!!} \cdot \frac{\pi}{2}, & n为偶数 \\ \frac{(n-1)!!}{n!!}, & n为奇数 \end{cases}$$

### 3.3 变上限积分（★高频考点）

**核心定理**：$\Phi(x) = \int_a^x f(t)dt$ → $\Phi'(x) = f(x)$

**推广形式（必会）**：

$$\frac{d}{dx}\int_{\alpha(x)}^{\beta(x)} f(t)dt = f(\beta(x))\beta'(x) - f(\alpha(x))\alpha'(x)$$

$$\frac{d}{dx}\int_a^x f(x, t)dt \text{（被积函数含x）}：先换元分离，或用莱布尼茨公式$$

**变上限积分的极限**：$\lim_{x \to 0} \frac{\int_0^x f(t)dt}{x}$（$\frac{0}{0}$ 型）→ 洛必达 → $\frac{f(x)}{1} = f(0)$

### 3.4 反常积分

**无穷限**：$\int_a^{+\infty} f dx = \lim_{b \to +\infty} \int_a^b f dx$（极限存在则收敛）

**瑕积分**：$f$ 在 $x = a$ 无界 → $\int_a^b f dx = \lim_{\varepsilon \to 0^+} \int_{a+\varepsilon}^b f dx$

**常用收敛结论**：

$$\int_1^{+\infty} \frac{dx}{x^p} \begin{cases} 收敛, & p > 1 \\ 发散, & p \le 1 \end{cases} \quad \int_0^1 \frac{dx}{x^p} \begin{cases} 收敛, & p < 1 \\ 发散, & p \ge 1 \end{cases}$$

### 3.5 定积分的应用

**平面图形面积**：$S = \int_a^b |f(x) - g(x)|dx$（上下曲线之差）

极坐标：$S = \frac{1}{2}\int_\alpha^\beta r^2(\theta)d\theta$

**旋转体体积**：

- 绕 $x$ 轴：$V = \pi\int_a^b f^2(x)dx$
- 绕 $y$ 轴（柱壳法）：$V = 2\pi\int_a^b x|f(x)|dx$

[[figure:solid-of-revolution.png|旋转体体积：圆盘法（绕x轴）与柱壳法（绕y轴）]]

**弧长**：$L = \int_a^b \sqrt{1 + f'^2(x)}dx$；参数方程 $L = \int \sqrt{x'^2 + y'^2}dt$

## 📐 核心公式速查

$$\int u dv = uv - \int v du \quad (反对幂指三选u)$$

$$\frac{d}{dx}\int_{\alpha(x)}^{\beta(x)} f(t)dt = f(\beta)\beta' - f(\alpha)\alpha'$$

$$\int_{-a}^{a}奇 = 0, \quad \int_{-a}^{a}偶 = 2\int_0^a$$

$$绕x轴：V = \pi\int f^2 dx; \quad 绕y轴：V = 2\pi\int x f dx$$

## ✏️ 经典题型

:::fold 题型一 不定积分计算（换元/分部）（★年年考）
**例（分部积分）**：求 $\int x e^x dx$。

**解**：$u = x$，$dv = e^x dx$ → $\int xe^x dx = xe^x - \int e^x dx = (x - 1)e^x + C$

**例（三角代换）**：求 $\int \frac{dx}{\sqrt{4 - x^2}}$。

**解**：$x = 2\sin t$，$dx = 2\cos t dt$：

$\int \frac{2\cos t dt}{2\cos t} = t + C = \arcsin\frac{x}{2} + C$

**例（倒代换）**：$\int \frac{dx}{x\sqrt{x^2 - 1}}$ → $x = \sec t$ → $\int dt = t + C = \arccos\frac{1}{x} + C$
:::

:::fold 题型二 变上限积分求导 + 极限（★年年考）
**例**：求 $\lim_{x \to 0} \frac{\int_0^x (e^{t^2} - 1)dt}{x^3}$。

**解**：$\frac{0}{0}$ 型，洛必达：

$= \lim_{x \to 0} \frac{e^{x^2} - 1}{3x^2} = \lim_{x \to 0} \frac{x^2}{3x^2} = \frac{1}{3}$（等价无穷小 $e^{x^2} - 1 \sim x^2$）

**例（上下限都含x）**：设 $F(x) = \int_x^{x^2} e^{t^2}dt$，求 $F'(x)$。

$F'(x) = e^{x^4} \cdot 2x - e^{x^2} \cdot 1 = 2xe^{x^4} - e^{x^2}$

**例（被积函数含x）**：$F(x) = \int_0^x (x - t)f(t)dt = x\int_0^x f(t)dt - \int_0^x tf(t)dt$

$F'(x) = \int_0^x f(t)dt + xf(x) - xf(x) = \int_0^x f(t)dt$（★经典结论：导数 = 去掉 $(x - t)$ 因子）
:::

:::fold 题型三 定积分计算（奇偶性/周期性/华里士）（★年年考）
**例**：求 $\int_{-1}^{1} (x^2 + x\cos x + \sin^3 x)dx$。

**解**：$x^2$ 偶，$x\cos x$ 奇，$\sin^3 x$ 奇：

$= 2\int_0^1 x^2 dx + 0 + 0 = \frac{2}{3}$

**例（华里士）**：$\int_0^{\pi/2} \sin^4 x dx = \frac{3!!}{4!!} \cdot \frac{\pi}{2} = \frac{3}{4} \cdot \frac{1}{2} \cdot \frac{\pi}{2} = \frac{3\pi}{16}$

$\int_0^{\pi/2} \sin^5 x dx = \frac{4!!}{5!!} = \frac{4 \cdot 2}{5 \cdot 3 \cdot 1} = \frac{8}{15}$

**例（区间再现）**：$\int_0^\pi \frac{x\sin x}{1 + \cos^2 x}dx$，令 $t = \pi - x$：

$= \int_0^\pi \frac{(\pi - t)\sin t}{1 + \cos^2 t}dt$，两式相加 → $2I = \pi\int_0^\pi \frac{\sin x}{1 + \cos^2 x}dx = \pi[\arctan(-\cos x)]_0^\pi = \frac{\pi^2}{2}$...

$I = \frac{\pi^2}{4}$（★区间再现公式 $\int_0^\pi xf(\sin x)dx = \frac{\pi}{2}\int_0^\pi f(\sin x)dx$）
:::

:::fold 题型四 反常积分敛散性（高频）
**例**：判断 $\int_0^{+\infty} \frac{dx}{x^p(1+x)^q}$ 的收敛条件。

**解**：分段讨论：

$x \to 0^+$（瑕点）：$\frac{1}{x^p(1+x)^q} \sim \frac{1}{x^p}$ → 收敛需 $p < 1$

$x \to +\infty$：$\sim \frac{1}{x^{p+q}}$ → 收敛需 $p + q > 1$

**结论**：$p < 1$ 且 $p + q > 1$ 时收敛。

**方法**：找瑕点 → 分段 → 每段用等价无穷小/无穷大与 $p$-积分比较。
:::

:::fold 题型五 定积分的几何应用（旋转体体积）（高频·大题）
**例**：求 $y = \sqrt{x}$，$x = 1$，$y = 0$ 围成区域绕 $x$ 轴旋转的体积。

**解**：$V = \pi\int_0^1 (\sqrt{x})^2 dx = \pi\int_0^1 x dx = \frac{\pi}{2}$

**例（绕y轴，柱壳法）**：同一区域绕 $y$ 轴：

$V = 2\pi\int_0^1 x \cdot \sqrt{x} dx = 2\pi\int_0^1 x^{3/2} dx = 2\pi \cdot \frac{2}{5} = \frac{4\pi}{5}$

**要点**：绕 $x$ 轴用圆盘法 $\pi\int f^2 dx$；绕 $y$ 轴用柱壳法 $2\pi\int xf dx$（避免解反函数）。
:::

:::fold 题型六 积分等式/不等式证明（高频·大题）
**例（积分中值定理）**：设 $f$ 在 $[0,1]$ 连续，证明 $\int_0^1 f(x)dx = f(\xi)$（某 $\xi \in [0,1]$）。

**证**：$f$ 在 $[0,1]$ 连续，由积分中值定理，$\exists \xi \in [0,1]$：

$\int_0^1 f(x)dx = f(\xi)(1 - 0) = f(\xi)$

**例（构造辅助函数）**：设 $f$ 在 $[0,1]$ 连续，$f(1) = 0$，证明 $\exists \xi \in (0,1)$，$\int_0^\xi f(t)dt = \xi f(\xi)$...

**思路**：令 $F(x) = \frac{1}{x}\int_0^x f(t)dt$（或 $G(x) = \int_0^x f dt - xf(x)$ 后用罗尔），验证端点值后罗尔定理。
:::

:::fold 题型七 定积分的物理应用（功/压力/质心）（中频，数一专属）
**功**：$W = \int_a^b F(x)dx$

**例（抽水）**：水深 $H$ 的井，把水抽到井口（井口为原点，向下为正）：

$W = \int_0^H \rho g x dx = \frac{1}{2}\rho g H^2$

**水压力**：深度 $h$ 处压强 $p = \rho g h$，$dP = \rho g h \cdot l(h)dh$（$l(h)$ 为该深度处宽度）

**例（竖直平板）**：高 $H$ 宽 $b$ 的矩形板竖直浸没（上缘与水面齐平）：

$P = \int_0^H \rho g h \cdot b dh = \frac{1}{2}\rho g b H^2$

**质心**：$\bar{x} = \frac{\int x\rho(x)dx}{\int \rho(x)dx}$（均匀密度时分母 = 质量）

**方法**：微元法 —— 取微小区间 → 写物理量微分 → 积分。
:::

## ⭐ 重点提示

- **变上限积分求导**是每年必考的送分点，上下限含 $x$ 的推广形式必须熟练
- 定积分计算先看奇偶性/周期性化简，再动手算
- 华里士公式 + 区间再现是 $\int_0^{\pi/2}$ 与 $\int_0^\pi$ 型积分的两大加速器
- 旋转体体积：绕谁转就用谁的公式，绕 $y$ 轴优先柱壳法

## 🔗 前后联系

- **前置**：导数（第二章，原函数是导数的逆运算）；极限（第一章，定积分定义）
- **后续应用**：微分方程（第四章，积分是求解工具）；二重积分/三重积分（第六、九章的累次积分基础）；级数（第七章，积分判别法）


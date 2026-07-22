# 第六章 二重积分

## 📖 考纲要求与考情

- 理解二重积分的概念与性质
- 掌握直角坐标系下二重积分的计算（X型/Y型区域）
- 掌握极坐标系下二重积分的计算
- 会利用对称性与奇偶性化简

**考情**：二重积分计算是**每年必考的计算大题或填空题**。交换积分次序、极坐标变换是两大核心技能；对称性与奇偶性的运用是提速关键。

## 🎯 核心知识体系

### 6.1 概念与性质

**定义**：$\iint_D f(x, y)d\sigma = \lim_{\lambda \to 0} \sum f(\xi_i, \eta_i)\Delta\sigma_i$

**几何意义**：以 $D$ 为底、$z = f(x, y)$ 为顶的曲顶柱体体积（$f \ge 0$ 时）。

**性质**：

- 线性：$\iint(\alpha f + \beta g) = \alpha\iint f + \beta\iint g$
- 区域可加：$D = D_1 + D_2$（不重叠）→ $\iint_D = \iint_{D_1} + \iint_{D_2}$
- 保号性、估值定理
- **积分中值定理**：$\iint_D f d\sigma = f(\xi, \eta) \cdot S_D$（$f$ 连续）

### 6.2 直角坐标计算（★核心）

**X型区域**（先 $y$ 后 $x$）：$D: a \le x \le b, \varphi_1(x) \le y \le \varphi_2(x)$

$$\iint_D f d\sigma = \int_a^b dx \int_{\varphi_1(x)}^{\varphi_2(x)} f(x, y)dy$$

**Y型区域**（先 $x$ 后 $y$）：$D: c \le y \le d, \psi_1(y) \le x \le \psi_2(y)$

$$\iint_D f d\sigma = \int_c^d dy \int_{\psi_1(y)}^{\psi_2(y)} f(x, y)dx$$

**选择积分次序的原则**：

1. 看被积函数：$e^{x^2}$、$\frac{\sin x}{x}$ 等"积不出来"的函数 → 调整次序让它先积
2. 看区域形状：画草图，选分块少的次序
3. **交换积分次序**：先画出区域 $D$，再按另一方向重新写上下限

### 6.3 极坐标计算（★核心）

$$x = r\cos\theta, \quad y = r\sin\theta, \quad d\sigma = r dr d\theta$$

$$\iint_D f(x, y)d\sigma = \int_\alpha^\beta d\theta \int_{r_1(\theta)}^{r_2(\theta)} f(r\cos\theta, r\sin\theta) \cdot r dr$$

★ **面积元素是 $r dr d\theta$，不是 $dr d\theta$！**（雅可比行列式 $= r$）

**适用识别**：

- 区域是圆、圆环、扇形 → 极坐标
- 被积函数含 $x^2 + y^2$ → 极坐标（$x^2 + y^2 = r^2$）

**常见区域的极坐标表示**：

- 圆 $x^2 + y^2 \le R^2$：$0 \le \theta \le 2\pi$，$0 \le r \le R$
- 圆 $x^2 + y^2 \le 2ax$（圆心 $(a, 0)$）：$-\frac{\pi}{2} \le \theta \le \frac{\pi}{2}$，$0 \le r \le 2a\cos\theta$
- 圆 $x^2 + y^2 \le 2ay$（圆心 $(0, a)$）：$0 \le \theta \le \pi$，$0 \le r \le 2a\sin\theta$

### 6.4 对称性与奇偶性（★提速利器）

**$D$ 关于 $y$ 轴对称**（$(x, y) \in D \Rightarrow (-x, y) \in D$）：

- $f(-x, y) = -f(x, y)$（对 $x$ 为奇）→ $\iint_D f d\sigma = 0$
- $f(-x, y) = f(x, y)$（对 $x$ 为偶）→ $\iint_D = 2\iint_{D_{右半}}$

**$D$ 关于 $x$ 轴对称**：同理，看 $f$ 对 $y$ 的奇偶性。

**轮换对称性**：$D$ 关于 $y = x$ 对称 → $\iint_D f(x, y)d\sigma = \iint_D f(y, x)d\sigma$

★ 推论：$D$ 关于 $y = x$ 对称时，$\iint_D f(x)d\sigma = \iint_D f(y)d\sigma$，常用于简化。

### 6.5 二重积分的应用

- **面积**：$S = \iint_D d\sigma$
- **体积**：$V = \iint_D f(x, y)d\sigma$（曲顶柱体）
- **质心**：$\bar{x} = \frac{\iint x\rho d\sigma}{\iint \rho d\sigma}$，$\bar{y} = \frac{\iint y\rho d\sigma}{\iint \rho d\sigma}$（均匀薄板 $\rho = 1$）
- **转动惯量**：$I_x = \iint y^2\rho d\sigma$，$I_y = \iint x^2\rho d\sigma$

## 📐 核心公式速查

$$X型：\int_a^b dx\int_{\varphi_1(x)}^{\varphi_2(x)} f dy \quad Y型：\int_c^d dy\int_{\psi_1(y)}^{\psi_2(y)} f dx$$

$$极坐标：\iint f d\sigma = \int d\theta\int f(r\cos\theta, r\sin\theta) \cdot r dr$$

$$对称域上奇函数积分为0，偶函数折半乘2$$

$$x^2 + y^2 \le 2ax \Rightarrow 0 \le r \le 2a\cos\theta, -\frac{\pi}{2} \le \theta \le \frac{\pi}{2}$$

## ✏️ 经典题型

:::fold 题型一 直角坐标计算（选择积分次序）
**例**：计算 $\iint_D e^{y^2} dxdy$，$D$ 由 $y = x$，$y = 1$，$x = 0$ 围成。

**解**：$e^{y^2}$ 对 $y$ 积不出来 → 必须先对 $x$ 积分（Y型）：

$D: 0 \le y \le 1, 0 \le x \le y$

$\iint_D e^{y^2}d\sigma = \int_0^1 dy\int_0^y e^{y^2}dx = \int_0^1 ye^{y^2}dy = \frac{1}{2}[e^{y^2}]_0^1 = \frac{e - 1}{2}$

**要点**：看到 $e^{y^2}$、$\frac{\sin x}{x}$、$\frac{\cos x}{x}$ → 立即想到调整积分次序。
:::

:::fold 题型二 交换积分次序
**例**：交换 $I = \int_0^1 dy\int_y^{\sqrt{y}} f(x, y)dx$ 的积分次序。

**解**：区域 $D$：$y \le x \le \sqrt{y}$，$0 \le y \le 1$

即 $x^2 \le y \le x$（由 $x = \sqrt{y}$ 得 $y = x^2$），$0 \le x \le 1$

$I = \int_0^1 dx\int_{x^2}^{x} f(x, y)dy$

**方法**：画出 $y = x$ 与 $y = x^2$ 的草图 → 确定区域 → 按另一方向重写上下限。

**例2（分块型）**：$I = \int_0^1 dx\int_0^x f dy + \int_1^2 dx\int_0^{2-x} f dy$

区域：$0 \le y \le x$（$x \in [0,1]$）与 $0 \le y \le 2 - x$（$x \in [1,2]$）合并为三角形 $y \le x$，$y \le 2 - x$，$y \ge 0$

$I = \int_0^1 dy\int_y^{2-y} f dx$
:::

:::fold 题型三 极坐标计算
**例**：计算 $\iint_D \sqrt{x^2 + y^2} dxdy$，$D: x^2 + y^2 \le 2x$。

**解**：$D$ 是圆心 $(1, 0)$、半径1的圆：$-\frac{\pi}{2} \le \theta \le \frac{\pi}{2}$，$0 \le r \le 2\cos\theta$

$\iint_D r \cdot r dr d\theta = \int_{-\pi/2}^{\pi/2} d\theta\int_0^{2\cos\theta} r^2 dr = \int_{-\pi/2}^{\pi/2} \frac{8\cos^3\theta}{3}d\theta$

$= \frac{16}{3}\int_0^{\pi/2}\cos^3\theta d\theta = \frac{16}{3} \times \frac{2}{3} = \frac{32}{9}$（华里士：$\int_0^{\pi/2}\cos^3 = \frac{2}{3}$）

**例（含 $x^2 + y^2$ 的被积函数）**：$\iint_D e^{x^2 + y^2}dxdy$，$D: x^2 + y^2 \le 1$

$= \int_0^{2\pi}d\theta\int_0^1 e^{r^2}r dr = 2\pi \times \frac{e - 1}{2} = \pi(e - 1)$
:::

:::fold 题型四 利用对称性化简
**例**：计算 $\iint_D (x + y^2)dxdy$，$D: x^2 + y^2 \le 1$。

**解**：$D$ 关于 $y$ 轴对称，$x$ 对 $x$ 为奇函数 → $\iint_D x d\sigma = 0$

$\iint_D y^2 d\sigma$：由轮换对称性 $\iint x^2 = \iint y^2$，故

$\iint_D y^2 d\sigma = \frac{1}{2}\iint_D (x^2 + y^2)d\sigma = \frac{1}{2}\int_0^{2\pi}d\theta\int_0^1 r^2 \cdot r dr = \frac{1}{2} \times 2\pi \times \frac{1}{4} = \frac{\pi}{4}$

**答案**：$\frac{\pi}{4}$

**要点**：先看对称性消去奇函数项，再算剩余部分。
:::

:::fold 题型五 二重积分与极限/导数综合
**例**：设 $F(t) = \iint_{x^2 + y^2 \le t^2} f(x^2 + y^2)dxdy$（$f$ 连续），求 $F'(t)$。

**解**：极坐标：$F(t) = \int_0^{2\pi}d\theta\int_0^t f(r^2) r dr = 2\pi\int_0^t rf(r^2)dr$

$F'(t) = 2\pi t f(t^2)$

**例（变限二重积分）**：$G(x) = \int_0^x dy\int_0^y f(t)dt$，求 $G''(x)$。

$G'(x) = \int_0^x f(t)dt$，$G''(x) = f(x)$

**要点**：变限二重积分 → 先化为累次积分 → 用变上限积分求导法则。
:::

:::fold 题型六 二重积分的应用（面积/体积）
**例**：求由 $z = x^2 + y^2$ 与 $z = 4$ 围成立体的体积。

**解**：交线 $x^2 + y^2 = 4$（投影区域 $D$: $x^2 + y^2 \le 4$）

$V = \iint_D (4 - x^2 - y^2)d\sigma = \int_0^{2\pi}d\theta\int_0^2 (4 - r^2)r dr$

$= 2\pi[2r^2 - \frac{r^4}{4}]_0^2 = 2\pi(8 - 4) = 8\pi$

**要点**：体积 = 上曲面减下曲面的二重积分；先求交线确定投影区域。
:::

## ⭐ 重点提示

- **交换积分次序**和**极坐标变换**是两大必考技能，画图是前提
- 极坐标的面积元素 $r dr d\theta$ 中的 $r$ 绝不能漏
- 对称性分析永远放在计算之前（能消掉一半甚至全部计算量）
- 看到 $e^{x^2}$、$\frac{\sin x}{x}$ 积不出来 → 立即换次序；看到 $x^2 + y^2$ → 立即极坐标

## 🔗 前后联系

- **前置**：定积分（第三章，累次积分的基础）；多元函数（第五章）
- **后续应用**：三重积分（第九章，柱坐标/球坐标是极坐标的推广）；曲线/曲面积分（第九章，格林公式联系二重积分与曲线积分）


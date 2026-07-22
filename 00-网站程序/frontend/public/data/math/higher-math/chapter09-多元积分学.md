# 第九章 多元积分学

## 📖 考纲要求与考情

- 掌握三重积分的计算（直角坐标、柱坐标、球坐标）
- 掌握第一类/第二类曲线积分与曲面积分的计算
- 掌握格林公式、高斯公式、斯托克斯公式及其应用
- 了解梯度、散度、旋度（场论初步）

**考情**：本章是数一的**特色章节**（数二数三不考），大题年年考。高斯公式/格林公式化简曲面积分/曲线积分是解答题的固定题型；第二类曲面积分的计算是全书计算量最大的考点之一。

## 🎯 核心知识体系

### 9.1 三重积分

**直角坐标（先一后二/先二后一）**：

$$\iiint_\Omega f dV = \iint_D d\sigma \int_{z_1(x,y)}^{z_2(x,y)} f dz \quad (投影到xOy面)$$

**柱坐标**（$x = r\cos\theta$，$y = r\sin\theta$，$z = z$，$dV = r dr d\theta dz$）：

适用：区域或被积函数含 $x^2 + y^2$。

**球坐标**（$x = \rho\sin\varphi\cos\theta$，$y = \rho\sin\varphi\sin\theta$，$z = \rho\cos\varphi$，$dV = \rho^2\sin\varphi d\rho d\varphi d\theta$）：

适用：区域是球体、锥体；被积函数含 $x^2 + y^2 + z^2$。

- $\varphi$：与 $z$ 轴正方向的夹角（$0 \le \varphi \le \pi$）
- 球面 $x^2 + y^2 + z^2 = R^2$ → $\rho = R$
- 锥面 $z = \sqrt{x^2 + y^2}$ → $\varphi = \frac{\pi}{4}$

**对称性**：$\Omega$ 关于 $zOx$ 面对称，$f$ 对 $y$ 为奇 → 积分为0（类推）。

### 9.2 第一类曲线积分（对弧长）

$$\int_L f(x, y)ds = \int_\alpha^\beta f(x(t), y(t))\sqrt{x'^2 + y'^2}dt$$

- 几何意义：曲线形构件的质量（$f$ 为线密度）
- **无方向性**：$\int_{AB} = \int_{BA}$
- 参数化后化为定积分（$ds = \sqrt{x'^2 + y'^2}dt$）

### 9.3 第二类曲线积分（对坐标）

$$\int_L Pdx + Qdy = \int_\alpha^\beta [P(x(t), y(t))x'(t) + Q(x(t), y(t))y'(t)]dt$$

- **有方向性**：$\int_{AB} = -\int_{BA}$
- 物理意义：变力沿曲线做功

**格林公式（★核心）**：$L$ 为闭区域 $D$ 的正向边界（逆时针）：

$$\oint_L Pdx + Qdy = \iint_D (\frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y})dxdy$$

**应用**：
- 闭曲线积分 → 化为二重积分
- 非闭曲线 → 补线成闭曲线，用格林公式后减去补线部分
- **路径无关的判定**：$\frac{\partial Q}{\partial x} = \frac{\partial P}{\partial y}$（单连通域内）→ 积分与路径无关 → 可选简单路径或求原函数

### 9.4 第一类曲面积分（对面积）

$$\iint_\Sigma f dS = \iint_D f(x, y, z(x, y))\sqrt{1 + z_x^2 + z_y^2}dxdy$$

- 无方向性；几何意义：曲面形构件的质量
- 投影到 $xOy$ 面（或根据对称性选其他坐标面）

### 9.5 第二类曲面积分（对坐标）

$$\iint_\Sigma Pdydz + Qdzdx + Rdxdy$$

- **有方向性**（曲面的侧）
- 物理意义：流量（流速场穿过曲面的通量）

**计算（投影法）**：$\Sigma: z = z(x, y)$，取上侧（$+$）/下侧（$-$）：

$$\iint_\Sigma Rdxdy = \pm\iint_D R(x, y, z(x, y))dxdy$$

★ 上侧取正，下侧取负；$Pdydz$、$Qdzdx$ 同理投影到对应坐标面。

**高斯公式（★核心）**：$\Sigma$ 为闭曲面外侧，$\Omega$ 为其围成的区域：

$$\oiint_\Sigma Pdydz + Qdzdx + Rdxdy = \iiint_\Omega (\frac{\partial P}{\partial x} + \frac{\partial Q}{\partial y} + \frac{\partial R}{\partial z})dV$$

**应用**：闭曲面积分 → 三重积分；非闭曲面 → 补面成闭曲面。

### 9.6 斯托克斯公式（数一）

$$\oint_L Pdx + Qdy + Rdz = \iint_\Sigma \begin{vmatrix} dydz & dzdx & dxdy \\ \frac{\partial}{\partial x} & \frac{\partial}{\partial y} & \frac{\partial}{\partial z} \\ P & Q & R \end{vmatrix}$$

把空间闭曲线积分化为曲面积分（$\Sigma$ 是以 $L$ 为边界的曲面，方向按右手法则）。

### 9.7 场论初步（数一）

**梯度**：$\nabla f = (\frac{\partial f}{\partial x}, \frac{\partial f}{\partial y}, \frac{\partial f}{\partial z})$

**散度**：$div\vec{A} = \frac{\partial P}{\partial x} + \frac{\partial Q}{\partial y} + \frac{\partial R}{\partial z}$（高斯公式的被积函数）

**旋度**：$rot\vec{A} = \begin{vmatrix} \vec{i} & \vec{j} & \vec{k} \\ \partial_x & \partial_y & \partial_z \\ P & Q & R \end{vmatrix}$（斯托克斯公式的被积函数）

- 保守场（梯度场）$\Leftrightarrow$ 旋度为零 $\Leftrightarrow$ 曲线积分路径无关

## 📐 核心公式速查

$$格林：\oint Pdx + Qdy = \iint(Q_x - P_y)dxdy$$

$$高斯：\oiint Pdydz + Qdzdx + Rdxdy = \iiint(P_x + Q_y + R_z)dV$$

$$球坐标：dV = \rho^2\sin\varphi d\rho d\varphi d\theta$$

$$路径无关 \Leftrightarrow Q_x = P_y（单连通域）$$

## ✏️ 经典题型

:::fold 题型一 三重积分计算（高频）
**例（柱坐标）**：计算 $\iiint_\Omega z dV$，$\Omega$ 由 $z = x^2 + y^2$ 与 $z = 1$ 围成。

**解**：投影 $D$: $x^2 + y^2 \le 1$。柱坐标：

$\int_0^{2\pi}d\theta\int_0^1 r dr\int_{r^2}^1 z dz = 2\pi\int_0^1 r \cdot \frac{1 - r^4}{2}dr = \pi[\frac{r^2}{2} - \frac{r^6}{6}]_0^1 = \frac{\pi}{3}$

**例（球坐标）**：计算 $\iiint_\Omega \sqrt{x^2 + y^2 + z^2}dV$，$\Omega$: $x^2 + y^2 + z^2 \le R^2$。

$= \int_0^{2\pi}d\theta\int_0^\pi\sin\varphi d\varphi\int_0^R \rho \cdot \rho^2 d\rho = 2\pi \times 2 \times \frac{R^4}{4} = \pi R^4$
:::

:::fold 题型二 格林公式求曲线积分（★年年考·大题）
**例**：计算 $\oint_L (x^2 - y)dx + (y^2 + x)dy$，$L$ 为 $x^2 + y^2 = 1$ 逆时针。

**解**：$P = x^2 - y$，$Q = y^2 + x$。$Q_x = 1$，$P_y = -1$

格林公式：$= \iint_D (1 - (-1))dxdy = 2 \times \pi \times 1^2 = 2\pi$

**例（补线型）**：计算 $\int_L e^x\sin y dx + e^x\cos y dy$，$L$ 为从 $(0, 0)$ 到 $(1, 1)$ 的上半圆周 $y = \sqrt{2x - x^2}$...

先验证 $Q_x = e^x\cos y = P_y$ → 路径无关！改沿折线 $(0,0) \to (1,0) \to (1,1)$：

$= \int_0^1 0 dx + \int_0^1 e\cos y dy = e\sin 1$

**要点**：先检查路径无关（$Q_x = P_y$），能省大量计算。
:::

:::fold 题型三 第二类曲面积分（投影法）（高频·大题）
**例**：计算 $\iint_\Sigma z dxdy$，$\Sigma$ 为 $z = x^2 + y^2$（$z \le 1$）的下侧。

**解**：投影 $D$: $x^2 + y^2 \le 1$。下侧 → 取负号：

$\iint_\Sigma z dxdy = -\iint_D (x^2 + y^2)dxdy = -\int_0^{2\pi}d\theta\int_0^1 r^2 \cdot r dr = -2\pi \times \frac{1}{4} = -\frac{\pi}{2}$

**要点**：先定侧（上正下负），再投影计算。
:::

:::fold 题型四 高斯公式（★年年考·大题）
**例**：计算 $\oiint_\Sigma x dydz + y dzdx + z dxdy$，$\Sigma$ 为球面 $x^2 + y^2 + z^2 = R^2$ 外侧。

**解**：$P = x$，$Q = y$，$R = z$。$P_x + Q_y + R_z = 3$

高斯公式：$= \iiint_\Omega 3 dV = 3 \times \frac{4}{3}\pi R^3 = 4\pi R^3$

**例（补面型）**：$\Sigma$ 为 $z = 1 - x^2 - y^2$（$z \ge 0$）的上侧（非闭），求 $\oiint$...

补底面 $\Sigma_1$: $z = 0$（$x^2 + y^2 \le 1$）的下侧，构成闭曲面外侧... 用高斯公式后减去 $\Sigma_1$ 上的积分。

**要点**：非闭曲面 → 补面 → 高斯公式 → 减去补面部分。
:::

:::fold 题型五 斯托克斯公式（中频·大题）
**例**：计算 $\oint_L y dx + z dy + x dz$，$L$ 为平面 $x + y + z = 1$ 被三坐标面截下的三角形的正向边界（从 $z$ 轴正向看逆时针）。

**解**：取 $\Sigma$ 为该三角形平面（上侧），斯托克斯公式：

$rot\vec{A} = \begin{vmatrix} \vec{i} & \vec{j} & \vec{k} \\ \partial_x & \partial_y & \partial_z \\ y & z & x \end{vmatrix} = (0 - 1, 1 - 0, 0 - 1) = (-1, 1, -1)$

$\iint_\Sigma (-1)dydz + (1)dzdx + (-1)dxdy$

平面 $x + y + z = 1$ 的单位法向量 $\vec{n} = \frac{1}{\sqrt{3}}(1, 1, 1)$，面积 $S = \frac{\sqrt{3}}{2}$

$= (-1, 1, -1) \cdot \vec{n} \times S = \frac{-1}{\sqrt{3}} \times \frac{\sqrt{3}}{2} = -\frac{1}{2}$
:::

:::fold 题型六 路径无关与求原函数（高频）
**例**：验证 $(2xy + y^3)dx + (x^2 + 3xy^2)dy$ 路径无关，并求原函数。

**解**：$P = 2xy + y^3$，$Q = x^2 + 3xy^2$

$P_y = 2x + 3y^2 = Q_x$ ✓ → 路径无关

求原函数 $u$：$u_x = P$ → $u = x^2y + xy^3 + \varphi(y)$

$u_y = x^2 + 3xy^2 + \varphi'(y) = Q = x^2 + 3xy^2$ → $\varphi' = 0$

$u = x^2y + xy^3 + C$

**积分**：$\int_{(0,0)}^{(1,1)} = u(1,1) - u(0,0) = 2$
:::

:::fold 题型七 第一类曲线/曲面积分（中频）
**第一类曲线积分**（对弧长）：$\int_L f ds$，参数式 $ds = \sqrt{x'^2 + y'^2}dt$

**例**：$\int_L y ds$，$L$ 为 $y = \sqrt{x}$ 从 $(0,0)$ 到 $(1,1)$。

**解**：令 $x = t^2$，$y = t$ → $ds = \sqrt{4t^2 + 1}dt$

$\int_0^1 t\sqrt{4t^2 + 1}dt = \frac{1}{12}(5\sqrt{5} - 1)$

**第一类曲面积分**：$\iint_\Sigma f dS$，$dS = \sqrt{1 + z_x^2 + z_y^2}dxdy$

**对称性**：$L$/$\Sigma$ 对称、$f$ 奇偶 → 与二重积分同理化简。

**与第二类的区别**：第一类是标量积分、无方向（$ds > 0$ 恒正）；第二类是向量积分、有方向。
:::

## ⭐ 重点提示

- **高斯公式 + 格林公式**是每年大题的固定考点，"补面/补线成闭 → 公式 → 减去补的部分"是标准流程
- 第二类曲线/曲面积分的**方向（侧）**是最大失分点：闭曲线逆时针为正，闭曲面外侧为正
- 做题第一步永远先检查路径无关（$Q_x = P_y$）或能否用公式化简
- 三重积分选坐标：含 $x^2 + y^2$ → 柱坐标；含 $x^2 + y^2 + z^2$ 或球体 → 球坐标

## 🔗 前后联系

- **前置**：二重积分（第六章，格林公式联系曲线与二重积分）；偏导数（第五章）
- **综合地位**：三大公式（格林/高斯/斯托克斯）是多元微积分的"牛顿-莱布尼茨公式"，把边界积分与内部积分互相转化，是数一区别于数二数三的核心内容


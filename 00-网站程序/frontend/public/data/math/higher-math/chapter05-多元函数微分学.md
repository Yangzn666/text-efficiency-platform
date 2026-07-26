# 第五章 多元函数微分学

## 📖 考纲要求与考情

- 理解偏导数与全微分的概念，掌握偏导数的计算
- 掌握复合函数与隐函数的求导法则
- 理解多元函数极值与条件极值（拉格朗日乘数法）
- 理解方向导数与梯度（数一要求）

**考情**：复合函数求偏导是**每年必考的计算题**；隐函数求导、条件极值（拉格朗日乘数法）是解答题的常客。全微分与可微性的判定是选择题的理论考点。

## 🎯 核心知识体系

### 5.1 极限、连续、偏导、可微的关系

**偏导数**：

$$\frac{\partial f}{\partial x} = \lim_{\Delta x \to 0} \frac{f(x + \Delta x, y) - f(x, y)}{\Delta x}$$

（对 $x$ 求偏导时把 $y$ 当常数，反之亦然）

**全微分**：$dz = \frac{\partial f}{\partial x}dx + \frac{\partial f}{\partial y}dy$

**可微的判定**：$f$ 在 $(x_0, y_0)$ 可微 $\Leftrightarrow$

$$\lim_{\rho \to 0} \frac{f(x_0 + \Delta x, y_0 + \Delta y) - f(x_0, y_0) - f_x\Delta x - f_y\Delta y}{\sqrt{\Delta x^2 + \Delta y^2}} = 0$$

**四者关系（★选择题核心）**：

- 可微 → 连续；可微 → 偏导存在
- 偏导连续 → 可微（充分非必要）
- 偏导存在 $\nRightarrow$ 连续；连续 $\nRightarrow$ 偏导存在
- 偏导存在 $\nRightarrow$ 可微

**记忆**：偏导连续 → 可微 → {连续, 偏导存在}，其余互不蕴含。

### 5.2 复合函数求导（★年年考）

**链式法则**：$z = f(u, v)$，$u = \varphi(x, y)$，$v = \psi(x, y)$：

$$\frac{\partial z}{\partial x} = \frac{\partial f}{\partial u}\frac{\partial u}{\partial x} + \frac{\partial f}{\partial v}\frac{\partial v}{\partial x}$$

**全导数**：$z = f(u, v)$，$u = u(x)$，$v = v(x)$：$\frac{dz}{dx} = \frac{\partial f}{\partial u}\frac{du}{dx} + \frac{\partial f}{\partial v}\frac{dv}{dx}$

**抽象复合函数的高阶导数**：先求一阶（用 $f_1, f_2$ 记号），再对结果继续求导（注意 $f_1, f_2$ 仍是复合函数，继续链式）。

**记号约定**：$f_1$ = 对第一个中间变量求导，$f_2$ = 对第二个中间变量求导；$f_{12}$ = 先对第1个再对第2个。

### 5.3 隐函数求导

**一个方程确定一个隐函数**：$F(x, y) = 0$ 确定 $y = y(x)$：

$$\frac{dy}{dx} = -\frac{F_x}{F_y}$$

**一个方程确定两个隐函数**：$F(x, y, z) = 0$ 确定 $z = z(x, y)$：$\frac{\partial z}{\partial x} = -\frac{F_x}{F_z}$

**方程组确定隐函数组**：$\begin{cases} F(x, y, u, v) = 0 \\ G(x, y, u, v) = 0 \end{cases}$ 确定 $u = u(x, y)$，$v = v(x, y)$：

对每个方程两边对 $x$ 求偏导（$u, v$ 是 $x, y$ 的函数），解关于 $\frac{\partial u}{\partial x}$，$\frac{\partial v}{\partial x}$ 的方程组。

### 5.4 极值与最值

**必要条件**：可微函数的极值点必为驻点（$f_x = f_y = 0$）。

**充分条件**：驻点处 $A = f_{xx}$，$B = f_{xy}$，$C = f_{yy}$，$\Delta = AC - B^2$：

- $\Delta > 0$，$A < 0$ → 极大值；$\Delta > 0$，$A > 0$ → 极小值
- $\Delta < 0$ → 不是极值点（鞍点）
- $\Delta = 0$ → 无法判定

**条件极值——拉格朗日乘数法（★大题常客）**：

求 $f(x, y)$ 在约束 $\varphi(x, y) = 0$ 下的极值：

构造 $L = f(x, y) + \lambda\varphi(x, y)$，解方程组：

$$\begin{cases} L_x = f_x + \lambda\varphi_x = 0 \\ L_y = f_y + \lambda\varphi_y = 0 \\ \varphi(x, y) = 0 \end{cases}$$

**闭区域上的最值**：求内部驻点 + 边界上的条件极值，比较所有候选点的函数值。

### 5.5 方向导数与梯度（数一）

**方向导数**：$f$ 在 $(x_0, y_0)$ 沿方向 $\vec{l} = (\cos\alpha, \cos\beta)$ 的方向导数：

$$\frac{\partial f}{\partial l} = f_x\cos\alpha + f_y\cos\beta$$

**梯度**：$\nabla f = (f_x, f_y)$，方向导数 $= \nabla f \cdot \vec{l} = |\nabla f|\cos\theta$

- 梯度方向是方向导数最大的方向，最大值 $= |\nabla f|$
- 梯度垂直于等值线（等高线）

[[figure:gradient-level-curves.png|梯度垂直于等值线，指向函数增长最快的方向]]

## 📐 核心公式速查

$$dz = f_x dx + f_y dy$$

$$\frac{\partial z}{\partial x} = f_1 \cdot u_x + f_2 \cdot v_x \quad (链式法则)$$

$$隐函数：\frac{dy}{dx} = -\frac{F_x}{F_y}$$

$$极值：\Delta = AC - B^2 > 0且A < 0极大，A > 0极小$$

## ✏️ 经典题型

:::fold 题型一 复合函数求偏导（★年年考）
**例**：设 $z = f(x^2 - y^2, e^{xy})$，$f$ 有二阶连续偏导数，求 $\frac{\partial z}{\partial x}$，$\frac{\partial^2 z}{\partial x \partial y}$。

**解**：设 $u = x^2 - y^2$，$v = e^{xy}$。

$\frac{\partial z}{\partial x} = f_1 \cdot 2x + f_2 \cdot ye^{xy}$

$\frac{\partial^2 z}{\partial x \partial y} = \frac{\partial}{\partial y}[2xf_1 + ye^{xy}f_2]$

$= 2x[f_{11}(-2y) + f_{12}xe^{xy}] + e^{xy}f_2 + ye^{xy}[f_{21}(-2y) + f_{22}xe^{xy}] + xy e^{xy}f_2$

$= -4xyf_{11} + 2x^2e^{xy}f_{12} - 2y^2e^{xy}f_{21} + xy e^{2... }$

（注意 $f_{12} = f_{21}$（二阶连续偏导），合并同类项）

$= -4xyf_{11} + 2(x^2 - y^2)e^{xy}f_{12} + (1 + xy)e^{xy}f_2$

**要点**：$f_1, f_2$ 仍是 $u, v$ 的函数，对它们求导必须继续链式！
:::

:::fold 题型二 隐函数求导（★年年考）
**例**：设 $z = z(x, y)$ 由 $x^2 + y^2 + z^2 - 4z = 0$ 确定，求 $\frac{\partial z}{\partial x}$，$\frac{\partial^2 z}{\partial x^2}$。

**解**：$F = x^2 + y^2 + z^2 - 4z$，$F_x = 2x$，$F_z = 2z - 4$

$\frac{\partial z}{\partial x} = -\frac{F_x}{F_z} = -\frac{2x}{2z - 4} = \frac{x}{2 - z}$

$\frac{\partial^2 z}{\partial x^2} = \frac{\partial}{\partial x}(\frac{x}{2 - z}) = \frac{(2 - z) - x(-\frac{\partial z}{\partial x})}{(2 - z)^2}$

$= \frac{(2 - z) + \frac{x^2}{2 - z}}{(2 - z)^2} = \frac{(2 - z)^2 + x^2}{(2 - z)^3}$

**要点**：二阶导时 $\frac{\partial z}{\partial x}$ 中仍含 $z$，对 $x$ 求导要把 $z$ 当 $x$ 的函数继续求。
:::

:::fold 题型三 无条件极值（高频）
**例**：求 $f(x, y) = x^3 - y^3 + 3x^2 + 3y^2 - 9x$ 的极值。

**解**：

$f_x = 3x^2 + 6x - 9 = 3(x + 3)(x - 1) = 0$ → $x = -3$ 或 $1$

$f_y = -3y^2 + 6y = -3y(y - 2) = 0$ → $y = 0$ 或 $2$

驻点：$(-3, 0)$，$(-3, 2)$，$(1, 0)$，$(1, 2)$

$A = f_{xx} = 6x + 6$，$B = f_{xy} = 0$，$C = f_{yy} = -6y + 6$

- $(1, 0)$：$A = 12$，$C = 6$，$\Delta = 72 > 0$，$A > 0$ → 极小值 $f(1,0) = -5$
- $(1, 2)$：$A = 12$，$C = -6$，$\Delta = -72 < 0$ → 鞍点
- $(-3, 0)$：$A = -12$，$C = 6$，$\Delta < 0$ → 鞍点
- $(-3, 2)$：$A = -12$，$C = -6$，$\Delta = 72 > 0$，$A < 0$ → 极大值 $f(-3,2) = 31$
:::

:::fold 题型四 条件极值（拉格朗日乘数法）（高频·大题）
**例**：求 $u = xyz$ 在约束 $x + y + z = 12$（$x, y, z > 0$）下的最大值。

**解**：$L = xyz + \lambda(x + y + z - 12)$

$$\begin{cases} L_x = yz + \lambda = 0 \\ L_y = xz + \lambda = 0 \\ L_z = xy + \lambda = 0 \\ x + y + z = 12 \end{cases}$$

由前两式：$yz = xz$ → $x = y$（$z \ne 0$）；由后两式：$xz = xy$ → $y = z$

故 $x = y = z = 4$，$u_{max} = 64$

**几何意义**：周长固定时正三角形面积最大；表面积固定时长方体为正方体时体积最大。
:::

:::fold 题型五 可微性判定（选择题）（中频）
**例**：设 $f(x, y) = \begin{cases} \frac{xy}{\sqrt{x^2 + y^2}}, & x^2 + y^2 \ne 0 \\ 0, & x^2 + y^2 = 0 \end{cases}$，讨论 $f$ 在 $(0, 0)$ 的连续性与可微性。

**解**：

**连续性**：$|f| = \frac{|xy|}{\sqrt{x^2 + y^2}} \le \frac{(x^2 + y^2)/2}{\sqrt{x^2 + y^2}} = \frac{\sqrt{x^2 + y^2}}{2} \to 0$ → 连续 ✓

**偏导数**：$f_x(0, 0) = \lim_{\Delta x \to 0} \frac{f(\Delta x, 0) - 0}{\Delta x} = \lim \frac{0}{\Delta x} = 0$，同理 $f_y = 0$

**可微性**：$\lim_{\rho \to 0} \frac{f(\Delta x, \Delta y) - 0 - 0 - 0}{\sqrt{\Delta x^2 + \Delta y^2}} = \lim \frac{\Delta x\Delta y}{\Delta x^2 + \Delta y^2}$

沿 $\Delta y = \Delta x$：$= \frac{1}{2} \ne 0$ → **不可微**

**结论**：连续、偏导存在，但不可微（经典反例）。
:::

:::fold 题型六 方向导数与梯度（中频）
**例**：求 $f(x, y) = x^2 + xy + y^2$ 在 $(1, 1)$ 沿方向 $\vec{l} = (3, 4)$ 的方向导数。

**解**：$f_x = 2x + y$，$f_y = x + 2y$ → $(1, 1)$ 处 $\nabla f = (3, 3)$

$\vec{l}$ 的单位向量：$(\frac{3}{5}, \frac{4}{5})$

$\frac{\partial f}{\partial l} = 3 \times \frac{3}{5} + 3 \times \frac{4}{5} = \frac{21}{5}$

**最大方向导数**：$|\nabla f| = 3\sqrt{2}$，方向为 $\nabla f$ 方向 $(\frac{1}{\sqrt{2}}, \frac{1}{\sqrt{2}})$。
:::

:::fold 题型七 曲面切平面与法线（高频，数一专属）
[[figure:tangent-plane.png|曲面的切平面与法线]]

**曲面** $F(x,y,z) = 0$：法向量 $\vec{n} = (F_x, F_y, F_z)$

**例**：求曲面 $z = x^2 + y^2$ 在点 $(1, 1, 2)$ 的切平面与法线。

**解**：$F = x^2 + y^2 - z$，$\vec{n} = (2x, 2y, -1)|_{(1,1,2)} = (2, 2, -1)$

1. 切平面：$2(x - 1) + 2(y - 1) - (z - 2) = 0$，即 $2x + 2y - z = 2$
2. 法线：$\frac{x - 1}{2} = \frac{y - 1}{2} = \frac{z - 2}{-1}$

**空间曲线的切线**：$\Gamma: x = \varphi(t), y = \psi(t), z = \omega(t)$ 的切向量 $(\varphi', \psi', \omega')$

**关系**：曲面切平面 ⊥ 法线；曲线切线平行于切向量。
:::

## ⭐ 重点提示

- **复合函数求偏导**是每年必考的计算题，抽象函数 $f_1, f_2$ 的高阶导数是难点，务必多练
- 隐函数求导公式 $\frac{dy}{dx} = -\frac{F_x}{F_y}$ 和直接两边求导两种方法都要熟练
- 拉格朗日乘数法解方程组的技巧：先消 $\lambda$（两式相除），再利用对称性
- 可微性判定的反例（连续+偏导存在但不可微）是选择题的固定素材

## 🔗 前后联系

- **前置**：一元微分学（第二章，偏导数本质是一元导数）
- **后续应用**：二重积分的计算（第六章，被积函数的分析）；多元积分学（第九章，梯度与曲线积分的关系）；条件极值在几何应用题中常见


# 第九章 多元积分学

## 📖 考纲要求（数一）

- 理解第一类、第二类曲线积分与曲面积分的概念，掌握其计算
- 掌握格林公式、高斯公式、斯托克斯公式及其应用
- 理解曲线积分与路径无关的条件，会求全微分的原函数
- 理解散度、旋度的概念（场论初步）

---

## 🎯 核心知识点

### 一、第一类曲线积分（对弧长）

**定义**：$\int_L f(x,y)\,ds$，$ds$ 为弧长元素，与方向无关。

**计算**（参数式 $x=\varphi(t),y=\psi(t),\ \alpha\le t\le\beta$）：

$$\int_L f(x,y)\,ds = \int_\alpha^\beta f[\varphi(t),\psi(t)]\sqrt{\varphi'^2(t)+\psi'^2(t)}\,dt$$

直角坐标：$ds=\sqrt{1+y'^2}\,dx$；极坐标：$ds=\sqrt{r^2+r'^2}\,d\theta$。

### 二、第二类曲线积分（对坐标）

**定义**：$\int_L P\,dx+Q\,dy$，与方向有关（反向变号）。

**计算**（参数式，$t$ 从 $\alpha$ 到 $\beta$ 对应起点到终点）：

$$\int_L P\,dx+Q\,dy = \int_\alpha^\beta \{P[\varphi(t),\psi(t)]\varphi'(t)+Q[\varphi(t),\psi(t)]\psi'(t)\}\,dt$$

**两类关系**：$\int_L P\,dx+Q\,dy=\int_L(P\cos\alpha+Q\cos\beta)\,ds$，其中 $(\cos\alpha,\cos\beta)$ 为切向单位向量。

### 三、格林公式（平面）

设 $L$ 为区域 $D$ 的正向边界（逆时针），$P,Q$ 具有一阶连续偏导：

$$\oint_L P\,dx+Q\,dy = \iint_D\left(\frac{\partial Q}{\partial x}-\frac{\partial P}{\partial y}\right)d\sigma$$

**应用**：

- 求平面图形面积：$S=\dfrac{1}{2}\oint_L x\,dy-y\,dx$
- **路径无关条件**：$\dfrac{\partial Q}{\partial x}=\dfrac{\partial P}{\partial y}$（单连通域内）等价于存在 $u$ 使 $du=P\,dx+Q\,dy$
- 求原函数：$u(x,y)=\int_{(x_0,y_0)}^{(x,y)}P\,dx+Q\,dy$（沿折线积分）

### 四、第一类曲面积分（对面积）

**定义**：$\iint_\Sigma f(x,y,z)\,dS$，与侧无关。

**计算**（$\Sigma: z=z(x,y)$，投影域 $D_{xy}$）：

$$\iint_\Sigma f\,dS = \iint_{D_{xy}} f[x,y,z(x,y)]\sqrt{1+z_x^2+z_y^2}\,d\sigma$$

### 五、第二类曲面积分（对坐标）

**定义**：$\iint_\Sigma P\,dy\,dz+Q\,dz\,dx+R\,dx\,dy$，与侧有关。

**计算**（取上侧 $\Sigma:z=z(x,y)$）：

$$\iint_\Sigma R\,dx\,dy = \iint_{D_{xy}} R[x,y,z(x,y)]\,d\sigma$$

下侧取负号；$P\,dy\,dz$、$Q\,dz\,dx$ 类似投影到对应坐标面。

### 六、高斯公式（散度定理）

设 $\Sigma$ 为空间闭区域 $\Omega$ 的外侧边界：

$$\oiint_\Sigma P\,dy\,dz+Q\,dz\,dx+R\,dx\,dy = \iiint_\Omega\left(\frac{\partial P}{\partial x}+\frac{\partial Q}{\partial y}+\frac{\partial R}{\partial z}\right)dv$$

括号内即向量场 $\mathbf{F}=(P,Q,R)$ 的**散度** $\text{div}\,\mathbf{F}$。

### 七、斯托克斯公式（空间曲线↔曲面）

设 $\Sigma$ 为以 $L$ 为边界的曲面（右手法则定向）：

$$\oint_L P\,dx+Q\,dy+R\,dz = \iint_\Sigma \begin{vmatrix}dy\,dz&dz\,dx&dx\,dy\\\dfrac{\partial}{\partial x}&\dfrac{\partial}{\partial y}&\dfrac{\partial}{\partial z}\\P&Q&R\end{vmatrix}$$

括号内即**旋度** $\text{rot}\,\mathbf{F}=\nabla\times\mathbf{F}$。

### 八、场论初步（数一）

- **梯度**：$\nabla u=(u_x,u_y,u_z)$
- **散度**：$\text{div}\,\mathbf{F}=\dfrac{\partial P}{\partial x}+\dfrac{\partial Q}{\partial y}+\dfrac{\partial R}{\partial z}$
- **旋度**：$\text{rot}\,\mathbf{F}=\nabla\times\mathbf{F}=\begin{vmatrix}\mathbf{i}&\mathbf{j}&\mathbf{k}\\\partial_x&\partial_y&\partial_z\\P&Q&R\end{vmatrix}$
- 重要恒等式：$\text{div}(\text{rot}\,\mathbf{F})\equiv 0$，$\text{rot}(\nabla u)\equiv\mathbf{0}$

---

## ⭐ 重点提示

- ★ 格林公式、高斯公式、斯托克斯公式是数一压轴大题的常客
- ★ 使用三大公式前务必检查：封闭性、方向（正向/外侧）、偏导连续性
- ★ 不封闭曲线/曲面常用"补面/补线"凑成封闭再用公式
- ★ 路径无关与求原函数是高频小题
- ★ 散度、旋度的计算与物理意义需牢固掌握

---

## 🔗 前后联系

- 综合第二、三、五、六、八章的微分、积分与几何工具
- 三大公式是微积分基本定理在高维的推广
- 散度、旋度承接第五章梯度，构成完整场论体系

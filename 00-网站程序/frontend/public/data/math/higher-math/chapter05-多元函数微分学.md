# 第五章 多元函数微分学

## 📖 考纲要求

- 理解多元函数的极限、连续、偏导数、全微分的概念及相互关系
- 掌握复合函数与隐函数的求导法则（链式法则）
- 理解方向导数与梯度的概念（数一）
- 掌握空间曲线的切线与法平面、曲面的切平面与法线（数一）
- 掌握多元函数的极值、条件极值（拉格朗日乘数法）
- 会求多元函数的最值

---

## 🎯 核心知识点

### 一、基本概念与关系

**偏导数**：

$$f_x(x_0,y_0)=\lim_{\Delta x\to 0}\frac{f(x_0+\Delta x,y_0)-f(x_0,y_0)}{\Delta x}$$

**全微分**：若 $\Delta z = A\Delta x+B\Delta y+o(\rho)$，则 $dz=A\,dx+B\,dy$，且 $A=f_x,\ B=f_y$。

**四者关系（重要辨析）**：

- 可微 $\Rightarrow$ 连续，可微 $\Rightarrow$ 偏导存在
- 偏导存在 $\nRightarrow$ 连续，偏导存在 $\nRightarrow$ 可微
- 偏导连续 $\Rightarrow$ 可微（充分非必要）
- 连续 $\nRightarrow$ 偏导存在

### 二、复合函数求导（链式法则）

设 $z=f(u,v)$，$u=\varphi(x,y)$，$v=\psi(x,y)$，则

$$\frac{\partial z}{\partial x}=\frac{\partial f}{\partial u}\frac{\partial u}{\partial x}+\frac{\partial f}{\partial v}\frac{\partial v}{\partial x}$$

**全导数**：若 $z=f(u,v)$，$u=\varphi(t)$，$v=\psi(t)$，则

$$\frac{dz}{dt}=\frac{\partial f}{\partial u}\frac{du}{dt}+\frac{\partial f}{\partial v}\frac{dv}{dt}$$

要点：画"变量关系图"，逐条路径相乘再相加。

### 三、隐函数求导

**一个方程** $F(x,y,z)=0$ 确定 $z=z(x,y)$：

$$\frac{\partial z}{\partial x}=-\frac{F_x}{F_z},\qquad \frac{\partial z}{\partial y}=-\frac{F_y}{F_z}$$

**方程组** $\begin{cases}F(x,y,u,v)=0\\G(x,y,u,v)=0\end{cases}$ 确定 $u=u(x,y),v=v(x,y)$，对方程组两边对 $x$ 求偏导，解关于 $\dfrac{\partial u}{\partial x},\dfrac{\partial v}{\partial x}$ 的线性方程组（用雅可比行列式）。

### 四、方向导数与梯度（数一）

**方向导数**：沿单位向量 $\mathbf{e}_l=(\cos\alpha,\cos\beta,\cos\gamma)$ 的方向导数

$$\frac{\partial f}{\partial l}=f_x\cos\alpha+f_y\cos\beta+f_z\cos\gamma$$

**梯度**：$\nabla f=(f_x,f_y,f_z)$，方向是方向导数取最大值的方向，最大值为 $|\nabla f|$。

### 五、几何应用（数一）

**空间曲线**（参数式 $x=\varphi(t),y=\psi(t),z=\omega(t)$）在 $t_0$ 处：

- 切向量 $\mathbf{T}=(\varphi',\psi',\omega')$
- 切线：$\dfrac{x-x_0}{\varphi'}=\dfrac{y-y_0}{\psi'}=\dfrac{z-z_0}{\omega'}$
- 法平面：$\varphi'(x-x_0)+\psi'(y-y_0)+\omega'(z-z_0)=0$

**曲面** $F(x,y,z)=0$ 在 $P_0$ 处：

- 法向量 $\mathbf{n}=(F_x,F_y,F_z)$
- 切平面：$F_x(x-x_0)+F_y(y-y_0)+F_z(z-z_0)=0$
- 法线：$\dfrac{x-x_0}{F_x}=\dfrac{y-y_0}{F_y}=\dfrac{z-z_0}{F_z}$

### 六、多元函数极值

**必要条件**：极值点处 $f_x=0,\ f_y=0$（驻点）。

**充分条件**：设驻点处 $A=f_{xx},\ B=f_{xy},\ C=f_{yy}$，记 $\Delta=AC-B^2$：

- $\Delta>0$ 且 $A<0$：极大值
- $\Delta>0$ 且 $A>0$：极小值
- $\Delta<0$：非极值（鞍点）
- $\Delta=0$：方法失效

**条件极值（拉格朗日乘数法）**：在约束 $\varphi(x,y)=0$ 下求 $f(x,y)$ 极值，构造

$$L(x,y,\lambda)=f(x,y)+\lambda\varphi(x,y)$$

解方程组 $L_x=0,\ L_y=0,\ L_\varphi=0$。多个约束则加多个乘子。

**最值**：闭区域上连续函数最值 = 内部驻点值 与 边界值 比较。

---

## ⭐ 重点提示

- ★ 复合函数链式法则是计算核心，务必画变量关系图
- ★ 可微、连续、偏导存在的关系辨析是经典选择题
- ★ 隐函数求导（尤其方程组情形）是高频大题
- ★ 拉格朗日乘数法是条件极值的标准方法，常与最值应用结合
- ★ 梯度、切平面、法线（数一）几乎每年必考其一

---

## 🔗 前后联系

- 承接第二章一元微分，推广到多元情形
- 隐函数求导与线性代数方程组求解相通
- 为第六章二重积分、第九章曲线曲面积分提供几何与微分工具

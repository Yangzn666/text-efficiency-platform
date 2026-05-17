# 第五章 多元函数微分学

## 📖 学习目标
- 理解多元函数的基本概念
- 掌握偏导数和全微分的计算
- 能够求多元函数的极值
- 理解多元函数微分学的几何应用

## 🎯 核心知识点

### 5.1 多元函数的基本概念
#### 5.1.1 多元函数的定义
- 二元函数：$z = f(x, y)$
- 定义域：平面区域D
- 几何意义：空间曲面

#### 5.1.2 多元函数的极限与连续
- 极限：$\lim_{(x,y) \to (x_0,y_0)} f(x, y) = A$
- 连续：$\lim_{(x,y) \to (x_0,y_0)} f(x, y) = f(x_0, y_0)$
- 注意：多元函数极限与路径有关，需要证明任意路径极限相同

### 5.2 偏导数
#### 5.2.1 偏导数的定义
- 对x的偏导数：$$\frac{\partial z}{\partial x} = \lim_{\Delta x \to 0} \frac{f(x + \Delta x, y) - f(x, y)}{\Delta x}$$
- 对y的偏导数：$$\frac{\partial z}{\partial y} = \lim_{\Delta y \to 0} \frac{f(x, y + \Delta y) - f(x, y)}{\Delta y}$$

#### 5.2.2 高阶偏导数
- 二阶偏导数：$\frac{\partial^2 z}{\partial x^2}$, $\frac{\partial^2 z}{\partial y^2}$, $\frac{\partial^2 z}{\partial x \partial y}$, $\frac{\partial^2 z}{\partial y \partial x}$
- 混合偏导数相等条件：二阶偏导数连续

#### 5.2.3 复合函数求导
- 链式法则：$$\frac{dz}{dt} = \frac{\partial z}{\partial x} \cdot \frac{dx}{dt} + \frac{\partial z}{\partial y} \cdot \frac{dy}{dt}$$

#### 5.2.4 隐函数求导
- 由$F(x, y, z) = 0$确定的隐函数$z = z(x, y)$
- 公式：$$\frac{\partial z}{\partial x} = -\frac{F_x}{F_z}, \quad \frac{\partial z}{\partial y} = -\frac{F_y}{F_z}$$

### 5.3 全微分
#### 5.3.1 全微分的定义
- 定义：$$dz = \frac{\partial z}{\partial x}dx + \frac{\partial z}{\partial y}dy$$
- 可微的充分条件：偏导数连续

#### 5.3.2 全微分的应用
- 近似计算：$\Delta z \approx dz$
- 误差估计

### 5.4 多元函数微分学的几何应用
#### 5.4.1 空间曲线的切线与法平面
- 参数方程：$x = x(t), y = y(t), z = z(t)$
- 切向量：$\vec{T} = (x'(t), y'(t), z'(t))$

#### 5.4.2 曲面的切平面与法线
- 隐式方程$F(x, y, z) = 0$：
  - 法向量：$\vec{n} = (F_x, F_y, F_z)$
  - 切平面：$F_x(x-x_0) + F_y(y-y_0) + F_z(z-z_0) = 0$

### 5.5 多元函数的极值
#### 5.5.1 无条件极值
- 必要条件：$\frac{\partial z}{\partial x} = 0$, $\frac{\partial z}{\partial y} = 0$（驻点）
- 充分条件：记$A = f_{xx}, B = f_{xy}, C = f_{yy}$
  - $AC - B^2 > 0$且$A > 0$：极小值
  - $AC - B^2 > 0$且$A < 0$：极大值
  - $AC - B^2 < 0$：不是极值

#### 5.5.2 条件极值（拉格朗日乘数法）
- 问题：求$f(x, y)$在$\varphi(x, y) = 0$条件下的极值
- 构造：$L(x, y, \lambda) = f(x, y) + \lambda\varphi(x, y)$
- 解方程组：$$\begin{cases} L_x = 0 \\ L_y = 0 \\ L_\lambda = 0 \end{cases}$$

## ⭐ 重点提示
- 多元函数极限要考虑所有路径
- 偏导数存在不一定可微，但偏导数连续一定可微
- 条件极值的拉格朗日乘数法是重点
- 几何应用要结合图形理解

##  前后联系
- 前置知识：第二章一元函数微分学
- 后续应用：第六章二重积分、第九章多元积分学

## 📝 典型例题
（后续补充）

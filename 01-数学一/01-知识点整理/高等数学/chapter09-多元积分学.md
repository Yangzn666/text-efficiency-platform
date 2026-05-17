# 第九章 多元积分学

## 📖 学习目标
- 掌握三重积分的计算方法
- 掌握曲线积分和曲面积分的计算
- 理解格林公式、高斯公式和斯托克斯公式
- 能够用多元积分学解决实际问题

## 🎯 核心知识点

### 9.1 三重积分
#### 9.1.1 概念与性质
- 定义：$$\iiint_{\Omega} f(x, y, z)dV = \lim_{\lambda \to 0} \sum_{i=1}^{n} f(\xi_i, \eta_i, \zeta_i)\Delta V_i$$
- 物理意义：非均匀物体的质量

#### 9.1.2 三重积分的计算
**直角坐标系**：
$$\iiint_{\Omega} f(x, y, z)dxdydz = \int_{a}^{b} dx \int_{\varphi_1(x)}^{\varphi_2(x)} dy \int_{\psi_1(x,y)}^{\psi_2(x,y)} f(x, y, z)dz$$

**柱面坐标系**：
- $x = r\cos\theta, y = r\sin\theta, z = z$
- 体积元素：$dV = rdrd\theta dz$

**球面坐标系**：
- $x = r\sin\varphi\cos\theta, y = r\sin\varphi\sin\theta, z = r\cos\varphi$
- 体积元素：$dV = r^2\sin\varphi drd\varphi d\theta$

### 9.2 曲线积分
#### 9.2.1 第一类曲线积分（对弧长）
- 定义：$$\int_{L} f(x, y)ds$$
- 计算（参数方程）：$$\int_{L} f(x, y)ds = \int_{\alpha}^{\beta} f(x(t), y(t))\sqrt{[x'(t)]^2 + [y'(t)]^2}dt$$

#### 9.2.2 第二类曲线积分（对坐标）
- 定义：$$\int_{L} P(x, y)dx + Q(x, y)dy$$
- 计算（参数方程）：$$\int_{L} Pdx + Qdy = \int_{\alpha}^{\beta} [P(x(t), y(t))x'(t) + Q(x(t), y(t))y'(t)]dt$$
- 注意：与路径方向有关

#### 9.2.3 两类曲线积分的关系
$$\int_{L} Pdx + Qdy = \int_{L} (P\cos\alpha + Q\cos\beta)ds$$
其中$\cos\alpha, \cos\beta$是曲线切向量的方向余弦

### 9.3 格林公式
- 公式：$$\oint_{L} Pdx + Qdy = \iint_{D} \left(\frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y}\right)dxdy$$
- 条件：
  - L是分段光滑的闭曲线
  - P, Q在D上有一阶连续偏导数
  - L取正向（逆时针）
- 应用：
  - 简化曲线积分计算
  - 计算平面区域面积：$S = \frac{1}{2}\oint_{L} xdy - ydx$

### 9.4 曲面积分
#### 9.4.1 第一类曲面积分（对面积）
- 定义：$$\iint_{\Sigma} f(x, y, z)dS$$
- 计算：$$\iint_{\Sigma} f(x, y, z)dS = \iint_{D_{xy}} f(x, y, z(x,y))\sqrt{1 + z_x^2 + z_y^2}dxdy$$

#### 9.4.2 第二类曲面积分（对坐标）
- 定义：$$\iint_{\Sigma} Pdydz + Qdzdx + Rdxdy$$
- 计算：$$\iint_{\Sigma} Rdxdy = \pm\iint_{D_{xy}} R(x, y, z(x,y))dxdy$$
- 正负号由曲面的侧决定（上侧为正，下侧为负）

#### 9.4.3 两类曲面积分的关系
$$\iint_{\Sigma} Pdydz + Qdzdx + Rdxdy = \iint_{\Sigma} (P\cos\alpha + Q\cos\beta + R\cos\gamma)dS$$
其中$\cos\alpha, \cos\beta, \cos\gamma$是曲面法向量的方向余弦

### 9.5 高斯公式
- 公式：$$\oiint_{\Sigma} Pdydz + Qdzdx + Rdxdy = \iiint_{\Omega} \left(\frac{\partial P}{\partial x} + \frac{\partial Q}{\partial y} + \frac{\partial R}{\partial z}\right)dV$$
- 条件：
  - $\Sigma$是分片光滑的闭曲面
  - P, Q, R在$\Omega$上有一阶连续偏导数
  - $\Sigma$取外侧
- 物理意义：散度定理

### 9.6 斯托克斯公式
- 公式：$$\oint_{\Gamma} Pdx + Qdy + Rdz = \iint_{\Sigma} \begin{vmatrix} dydz & dzdx & dxdy \\ \frac{\partial}{\partial x} & \frac{\partial}{\partial y} & \frac{\partial}{\partial z} \\ P & Q & R \end{vmatrix}$$
- 联系：曲线积分与曲面积分的桥梁
- 应用：简化空间曲线积分计算

### 9.7 场论初步
#### 9.7.1 数量场的梯度
- 定义：$$\text{grad } u = \nabla u = \frac{\partial u}{\partial x}\vec{i} + \frac{\partial u}{\partial y}\vec{j} + \frac{\partial u}{\partial z}\vec{k}$$
- 物理意义：指向函数增长最快的方向

#### 9.7.2 向量场的散度
- 定义：$$\text{div } \vec{F} = \nabla \cdot \vec{F} = \frac{\partial P}{\partial x} + \frac{\partial Q}{\partial y} + \frac{\partial R}{\partial z}$$
- 物理意义：单位体积的源强度

#### 9.7.3 向量场的旋度
- 定义：$$\text{rot } \vec{F} = \nabla \times \vec{F} = \begin{vmatrix} \vec{i} & \vec{j} & \vec{k} \\ \frac{\partial}{\partial x} & \frac{\partial}{\partial y} & \frac{\partial}{\partial z} \\ P & Q & R \end{vmatrix}$$
- 物理意义：旋转强度

## ⭐ 重点提示
- 三重积分要根据区域形状选择合适的坐标系
- 曲线积分和曲面积分要注意方向
- 三大公式（格林、高斯、斯托克斯）是核心考点
- 场论的三个算子（梯度、散度、旋度）要理解物理意义

## 🔗 前后联系
- 前置知识：第三章积分学、第五章多元函数微分学、第六章二重积分
- 后续应用：物理学中的电磁场理论、流体力学等

## 📝 典型例题
（后续补充）

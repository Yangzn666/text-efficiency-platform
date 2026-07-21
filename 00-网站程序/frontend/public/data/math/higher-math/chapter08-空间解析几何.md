# 第八章 空间解析几何

## 📖 考纲要求（数一）

- 理解空间直角坐标系，掌握向量及其运算（数量积、向量积、混合积）
- 掌握平面方程与直线方程的各种形式
- 会求点到平面、点到直线的距离，平面与平面、直线与直线、平面与直线的夹角
- 理解常用二次曲面（球面、柱面、旋转曲面）的方程与图形

---

## 🎯 核心知识点

### 一、向量及其运算

设 $\mathbf{a}=(a_1,a_2,a_3)$，$\mathbf{b}=(b_1,b_2,b_3)$。

**数量积（点积）**：

$$\mathbf{a}\cdot\mathbf{b}=a_1b_1+a_2b_2+a_3b_3=|\mathbf{a}||\mathbf{b}|\cos\theta$$

应用：求夹角 $\cos\theta=\dfrac{\mathbf{a}\cdot\mathbf{b}}{|\mathbf{a}||\mathbf{b}|}$；垂直 $\Leftrightarrow \mathbf{a}\cdot\mathbf{b}=0$。

**向量积（叉积）**：

$$\mathbf{a}\times\mathbf{b}=\begin{vmatrix}\mathbf{i}&\mathbf{j}&\mathbf{k}\\a_1&a_2&a_3\\b_1&b_2&b_3\end{vmatrix}$$

结果是与 $\mathbf{a},\mathbf{b}$ 都垂直的向量，模 $|\mathbf{a}\times\mathbf{b}|=|\mathbf{a}||\mathbf{b}|\sin\theta$（平行四边形面积）。平行 $\Leftrightarrow \mathbf{a}\times\mathbf{b}=\mathbf{0}$。

**混合积**：$[\mathbf{a}\ \mathbf{b}\ \mathbf{c}]=(\mathbf{a}\times\mathbf{b})\cdot\mathbf{c}$，其绝对值为三向量张成的平行六面体体积；三向量共面 $\Leftrightarrow [\mathbf{a}\ \mathbf{b}\ \mathbf{c}]=0$。

### 二、平面方程

- **点法式**：过 $M_0(x_0,y_0,z_0)$、法向量 $\mathbf{n}=(A,B,C)$：$A(x-x_0)+B(y-y_0)+C(z-z_0)=0$
- **一般式**：$Ax+By+Cz+D=0$，法向量 $(A,B,C)$
- **截距式**：$\dfrac{x}{a}+\dfrac{y}{b}+\dfrac{z}{c}=1$
- **三点式**：由不共线三点确定的行列式方程

**两平面夹角**：$\cos\theta=\dfrac{|A_1A_2+B_1B_2+C_1C_2|}{\sqrt{A_1^2+B_1^2+C_1^2}\sqrt{A_2^2+B_2^2+C_2^2}}$

**点到平面距离**：$d=\dfrac{|Ax_0+By_0+Cz_0+D|}{\sqrt{A^2+B^2+C^2}}$

### 三、直线方程

- **点向式（对称式）**：过 $M_0$、方向向量 $\mathbf{s}=(m,n,p)$：$\dfrac{x-x_0}{m}=\dfrac{y-y_0}{n}=\dfrac{z-z_0}{p}$
- **参数式**：$x=x_0+mt,\ y=y_0+nt,\ z=z_0+pt$
- **一般式**：两平面交线 $\begin{cases}A_1x+B_1y+C_1z+D_1=0\\A_2x+B_2y+C_2z+D_2=0\end{cases}$，方向向量 $\mathbf{s}=\mathbf{n}_1\times\mathbf{n}_2$
- **两点式**：$\dfrac{x-x_1}{x_2-x_1}=\dfrac{y-y_1}{y_2-y_1}=\dfrac{z-z_1}{z_2-z_1}$

**两直线夹角**：用方向向量点积公式。

**直线与平面夹角**：$\sin\theta=\dfrac{|\mathbf{s}\cdot\mathbf{n}|}{|\mathbf{s}||\mathbf{n}|}$（方向向量与法向量夹角的余角）。

**点到直线距离**：$d=\dfrac{|\overrightarrow{M_0M_1}\times\mathbf{s}|}{|\mathbf{s}|}$。

### 四、曲面与曲线

**球面**：$(x-a)^2+(y-b)^2+(z-c)^2=R^2$。

**柱面**：母线平行于坐标轴，如 $x^2+y^2=R^2$（母线平行 $z$ 轴的圆柱面）。

**旋转曲面**：$yOz$ 平面上曲线 $f(y,z)=0$ 绕 $z$ 轴旋转得 $f(\pm\sqrt{x^2+y^2},z)=0$。

**常见二次曲面**：

- 椭球面：$\dfrac{x^2}{a^2}+\dfrac{y^2}{b^2}+\dfrac{z^2}{c^2}=1$
- 单叶双曲面：$\dfrac{x^2}{a^2}+\dfrac{y^2}{b^2}-\dfrac{z^2}{c^2}=1$
- 双叶双曲面：$\dfrac{x^2}{a^2}-\dfrac{y^2}{b^2}-\dfrac{z^2}{c^2}=1$
- 椭圆抛物面：$z=\dfrac{x^2}{a^2}+\dfrac{y^2}{b^2}$
- 圆锥面：$z^2=\dfrac{x^2}{a^2}+\dfrac{y^2}{b^2}$

**空间曲线投影**：联立两曲面方程消去一个变量得投影柱面，再与坐标面联立得投影曲线。

---

## ⭐ 重点提示

- ★ 向量积、混合积的几何意义（面积、体积、共面）是核心
- ★ 平面与直线方程的相互转化（点向式↔一般式）必须熟练
- ★ 各类夹角、距离公式是高频计算题
- ★ 旋转曲面方程的建立是经典题型
- ★ 投影柱面、投影曲线常与曲面积分结合考查

---

## 🔗 前后联系

- 向量运算与线性代数行列式、向量积相通
- 切平面、法线承接第五章多元微分
- 为第九章曲线积分、曲面积分提供几何对象

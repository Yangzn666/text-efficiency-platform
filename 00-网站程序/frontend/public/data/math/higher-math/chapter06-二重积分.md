# 第六章 二重积分

## 📖 考纲要求

- 理解二重积分的概念与几何意义，掌握其基本性质
- 掌握直角坐标与极坐标下二重积分的计算
- 会交换积分次序、选择合适的积分顺序
- 会利用对称性、奇偶性简化计算
- 理解二重积分的中值定理

---

## 🎯 核心知识点

### 一、概念与性质

**定义**：

$$\iint_D f(x,y)\,d\sigma = \lim_{\lambda\to 0}\sum_{i=1}^{n} f(\xi_i,\eta_i)\Delta\sigma_i$$

**几何意义**：当 $f(x,y)\ge 0$ 时，表示以 $D$ 为底、$z=f(x,y)$ 为顶的曲顶柱体体积。

**基本性质**：

- 线性：$\iint_D(\alpha f+\beta g)=\alpha\iint_D f+\beta\iint_D g$
- 区域可加：$D=D_1\cup D_2$ 不重叠，则 $\iint_D f=\iint_{D_1}f+\iint_{D_2}f$
- 保号性：$f\ge 0 \Rightarrow \iint_D f\ge 0$
- **中值定理**：$\iint_D f(x,y)\,d\sigma = f(\xi,\eta)\cdot S_D$
- 估值：$m\cdot S \le \iint_D f \le M\cdot S$

### 二、直角坐标计算

**X 型区域**（先 $y$ 后 $x$）：$D=\{(x,y)\mid a\le x\le b,\ y_1(x)\le y\le y_2(x)\}$

$$\iint_D f\,d\sigma = \int_a^b dx\int_{y_1(x)}^{y_2(x)} f(x,y)\,dy$$

**Y 型区域**（先 $x$ 后 $y$）：$D=\{(x,y)\mid c\le y\le d,\ x_1(y)\le x\le x_2(y)\}$

$$\iint_D f\,d\sigma = \int_c^d dy\int_{x_1(y)}^{x_2(y)} f(x,y)\,dx$$

**交换积分次序**：先画出积分区域，再按另一方向重新确定上下限。这是高频考点。

### 三、极坐标计算

变换 $x=r\cos\theta,\ y=r\sin\theta$，面积元 $d\sigma = r\,dr\,d\theta$：

$$\iint_D f(x,y)\,d\sigma = \iint_D f(r\cos\theta,r\sin\theta)\,r\,dr\,d\theta$$

**适用情形**：积分区域为圆、扇形、环形，或被积函数含 $x^2+y^2$。

**极点在区域内**：$\int_0^{2\pi}d\theta\int_0^{r(\theta)} f\cdot r\,dr$

**极点在边界上**：$\int_\alpha^\beta d\theta\int_0^{r(\theta)} f\cdot r\,dr$

**极点在外**：$\int_\alpha^\beta d\theta\int_{r_1(\theta)}^{r_2(\theta)} f\cdot r\,dr$

### 四、对称性与奇偶性

设 $D$ 关于 $x$ 轴对称，$D_1$ 为上半部分：

- $f(x,y)$ 关于 $y$ 为奇函数：$\iint_D f\,d\sigma = 0$
- $f(x,y)$ 关于 $y$ 为偶函数：$\iint_D f\,d\sigma = 2\iint_{D_1} f\,d\sigma$

关于 $y$ 轴、原点对称同理。**轮换对称性**：$D$ 关于 $y=x$ 对称时，$\iint_D f(x,y)\,d\sigma=\iint_D f(y,x)\,d\sigma$。

### 五、二重积分的应用

- 平面薄片质量：$M=\iint_D \rho(x,y)\,d\sigma$
- 形心坐标：$\bar{x}=\dfrac{1}{S}\iint_D x\,d\sigma$，$\bar{y}=\dfrac{1}{S}\iint_D y\,d\sigma$
- 转动惯量：$I_x=\iint_D y^2\rho\,d\sigma$，$I_y=\iint_D x^2\rho\,d\sigma$

---

## ⭐ 重点提示

- ★ 交换积分次序是必考题型，关键在于准确画出积分区域
- ★ 极坐标变换勿忘面积元中的因子 $r$
- ★ 对称性与奇偶性是简化计算的最强工具，做题先看对称性
- ★ 含 $x^2+y^2$ 的被积函数优先考虑极坐标
- ★ 分段函数、绝对值函数需先划分区域再积分

---

## 🔗 前后联系

- 承接第三章定积分，是其在二维区域的推广
- 计算依赖第五章偏导与区域分析
- 为第九章三重积分、曲线曲面积分奠定方法基础

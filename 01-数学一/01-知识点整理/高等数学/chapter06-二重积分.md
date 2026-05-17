# 第六章 二重积分

## 📖 学习目标
- 理解二重积分的概念和性质
- 掌握直角坐标和极坐标下二重积分的计算
- 能够用二重积分解决几何和物理问题

##  核心知识点

### 6.1 二重积分的概念
#### 6.1.1 定义
- 定义：$$\iint_{D} f(x, y)d\sigma = \lim_{\lambda \to 0} \sum_{i=1}^{n} f(\xi_i, \eta_i)\Delta \sigma_i$$
- 几何意义：曲顶柱体的体积（代数和）

#### 6.1.2 性质
- 线性性
- 区域可加性
- 保号性
- 估值定理
- 中值定理：$$\iint_{D} f(x, y)d\sigma = f(\xi, \eta) \cdot S_D$$

### 6.2 二重积分的计算
#### 6.2.1 直角坐标系
**X型区域**（先y后x）：
$$\iint_{D} f(x, y)dxdy = \int_{a}^{b} dx \int_{\varphi_1(x)}^{\varphi_2(x)} f(x, y)dy$$

**Y型区域**（先x后y）：
$$\iint_{D} f(x, y)dxdy = \int_{c}^{d} dy \int_{\psi_1(y)}^{\psi_2(y)} f(x, y)dx$$

#### 6.2.2 极坐标系
- 坐标变换：$x = r\cos\theta, y = r\sin\theta$
- 面积元素：$dxdy = rdrd\theta$
- 积分公式：$$\iint_{D} f(x, y)dxdy = \int_{\alpha}^{\beta} d\theta \int_{r_1(\theta)}^{r_2(\theta)} f(r\cos\theta, r\sin\theta)rdr$$

#### 6.2.3 坐标系的选择
- 区域D为圆域或扇形：用极坐标
- 被积函数含$x^2 + y^2$：用极坐标
- 区域D为矩形：用直角坐标

### 6.3 二重积分的应用
#### 6.3.1 几何应用
- 曲顶柱体的体积
- 平面图形的面积：$S = \iint_{D} dxdy$

#### 6.3.2 物理应用
- 平面薄片的质量：$M = \iint_{D} \rho(x, y)dxdy$
- 质心坐标：
  $$\bar{x} = \frac{1}{M}\iint_{D} x\rho(x, y)dxdy$$
  $$\bar{y} = \frac{1}{M}\iint_{D} y\rho(x, y)dxdy$$
- 转动惯量：
  $$I_x = \iint_{D} y^2\rho(x, y)dxdy$$
  $$I_y = \iint_{D} x^2\rho(x, y)dxdy$$

## ⭐ 重点提示
- 正确画出积分区域D是关键
- 根据区域形状和被积函数选择合适的坐标系
- 极坐标变换时要注意面积元素$rdrd\theta$中的$r$
- 利用对称性可以简化计算

## 🔗 前后联系
- 前置知识：第三章一元函数积分学、第五章多元函数微分学
- 后续应用：第九章多元积分学（三重积分、曲线曲面积分）

## 📝 典型例题
（后续补充）

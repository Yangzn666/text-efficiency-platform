# 第四章 随机变量的数字特征

## 📖 考纲要求

- 理解数学期望、方差的概念与性质，掌握其计算
- 掌握协方差、相关系数的概念与性质
- 理解矩的概念
- 熟记常见分布的数字特征
- 会求随机变量函数的期望

---

## 🎯 核心知识点

### 一、数学期望

**离散型**：$E(X)=\sum_k x_k p_k$（绝对收敛时存在）。

**连续型**：$E(X)=\int_{-\infty}^{+\infty} x f(x)\,dx$。

**性质**（设期望存在）：

- $E(C)=C$，$E(CX)=CE(X)$
- $E(X+Y)=E(X)+E(Y)$（无需独立）
- $X,Y$ 独立时 $E(XY)=E(X)E(Y)$

**随机变量函数的期望**：

- 一维：$E[g(X)]=\sum g(x_k)p_k$ 或 $\int g(x)f(x)\,dx$
- 二维：$E[g(X,Y)]=\iint g(x,y)f(x,y)\,dx\,dy$

### 二、方差

**定义**：$D(X)=E\{[X-E(X)]^2\}=E(X^2)-[E(X)]^2$。

**标准差**：$\sigma(X)=\sqrt{D(X)}$。

**性质**：

- $D(C)=0$，$D(CX)=C^2D(X)$
- $X,Y$ 独立时 $D(X+Y)=D(X)+D(Y)$
- 一般：$D(X\pm Y)=D(X)+D(Y)\pm 2\text{Cov}(X,Y)$

### 三、协方差与相关系数

**协方差**：$\text{Cov}(X,Y)=E\{[X-E(X)][Y-E(Y)]\}=E(XY)-E(X)E(Y)$。

**性质**：

- $\text{Cov}(X,X)=D(X)$
- 对称、双线性
- $X,Y$ 独立 $\Rightarrow \text{Cov}(X,Y)=0$（反之不然）

**相关系数**：

$$\rho_{XY}=\frac{\text{Cov}(X,Y)}{\sqrt{D(X)}\sqrt{D(Y)}}$$

**性质**：

- $|\rho_{XY}|\le 1$
- $|\rho_{XY}|=1 \Leftrightarrow X$ 与 $Y$ 线性相关（$P\{Y=aX+b\}=1$）
- $\rho=0$ 称为不相关；独立 $\Rightarrow$ 不相关，不相关 $\nRightarrow$ 独立
- 对正态分布：不相关 $\Leftrightarrow$ 独立

### 四、矩

- $k$ 阶原点矩：$E(X^k)$
- $k$ 阶中心矩：$E\{[X-E(X)]^k\}$
- 期望是一阶原点矩，方差是二阶中心矩，协方差是二阶混合中心矩

### 五、常见分布的数字特征（必背）

- $B(1,p)$：$E=p$，$D=p(1-p)$
- $B(n,p)$：$E=np$，$D=np(1-p)$
- $P(\lambda)$：$E=\lambda$，$D=\lambda$
- 几何分布：$E=\dfrac{1}{p}$，$D=\dfrac{1-p}{p^2}$
- $U(a,b)$：$E=\dfrac{a+b}{2}$，$D=\dfrac{(b-a)^2}{12}$
- $E(\lambda)$：$E=\dfrac{1}{\lambda}$，$D=\dfrac{1}{\lambda^2}$
- $N(\mu,\sigma^2)$：$E=\mu$，$D=\sigma^2$

### 六、切比雪夫不等式

设 $E(X)=\mu$，$D(X)=\sigma^2$，则对任意 $\varepsilon>0$：

$$P\{|X-\mu|\ge\varepsilon\}\le\frac{\sigma^2}{\varepsilon^2}$$

等价形式：$P\{|X-\mu|<\varepsilon\}\ge 1-\dfrac{\sigma^2}{\varepsilon^2}$。

---

## ⭐ 重点提示

- ★ 期望、方差的性质（尤其独立时方差可加）是计算核心
- ★ 协方差与相关系数的计算与性质是必考内容
- ★ "独立、不相关、线性相关"三者关系辨析是经典选择题
- ★ 八大分布的期望方差必须熟记，能大幅提速
- ★ 切比雪夫不等式是估计概率与衔接大数定律的工具

---

## 🔗 前后联系

- 综合第二、三章的分布与密度计算
- 协方差、相关系数刻画变量间线性关系，承接独立性
- 为第五章大数定律、中心极限定理提供期望方差工具

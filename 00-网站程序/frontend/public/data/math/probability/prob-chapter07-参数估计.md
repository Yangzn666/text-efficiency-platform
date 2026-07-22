# 第七章 参数估计

## 📖 考纲要求

- 掌握矩估计法与最大似然估计法
- 理解估计量的无偏性、有效性、一致性（相合性）
- 理解区间估计的概念，会求单个正态总体均值与方差的置信区间
- 会求两个正态总体均值差与方差比的置信区间

---

## 🎯 核心知识点

### 一、点估计

#### 矩估计法

用样本矩代替总体矩，建立方程解出参数。

- 一个参数：令 $E(X)=\bar{X}$
- 两个参数：令 $E(X)=\bar{X}$，$E(X^2)=\dfrac{1}{n}\sum X_i^2$（或 $D(X)=S^2$ 的矩估计形式 $B_2$）

**步骤**：求总体矩（含未知参数）→ 用样本矩替换 → 解方程。

#### 最大似然估计法（MLE）

**似然函数**：

- 离散型：$L(\theta)=\prod_{i=1}^n p(x_i;\theta)$
- 连续型：$L(\theta)=\prod_{i=1}^n f(x_i;\theta)$

**步骤**：

1. 写出似然函数 $L(\theta)$
2. 取对数 $\ln L(\theta)$
3. 对 $\theta$ 求导令其为 $0$（似然方程）
4. 解出 $\hat{\theta}$；若导数恒不为 $0$，则由定义直接找最大值点

**不变性**：若 $\hat{\theta}$ 是 $\theta$ 的 MLE，则 $g(\hat{\theta})$ 是 $g(\theta)$ 的 MLE。

### 二、估计量的评选标准

- **无偏性**：$E(\hat{\theta})=\theta$。如 $\bar{X}$ 是 $\mu$ 的无偏估计，$S^2$ 是 $\sigma^2$ 的无偏估计
- **有效性**：同为无偏估计，方差小者更有效
- **一致性（相合性）**：$\hat{\theta}_n\xrightarrow{P}\theta$（$n\to\infty$）

### 三、区间估计

**置信区间**：给定置信度 $1-\alpha$，找统计量构造区间 $(\hat{\theta}_1,\hat{\theta}_2)$，使 $P\{\hat{\theta}_1<\theta<\hat{\theta}_2\}=1-\alpha$。

#### 单个正态总体 $N(\mu,\sigma^2)$

**$\mu$ 的置信区间**：

- $\sigma^2$ 已知（用 $Z$）：$\left(\bar{X}\pm u_{\alpha/2}\dfrac{\sigma}{\sqrt{n}}\right)$
- $\sigma^2$ 未知（用 $t$）：$\left(\bar{X}\pm t_{\alpha/2}(n-1)\dfrac{S}{\sqrt{n}}\right)$

**$\sigma^2$ 的置信区间**（用 $\chi^2$）：

$$\left(\frac{(n-1)S^2}{\chi^2_{\alpha/2}(n-1)},\ \frac{(n-1)S^2}{\chi^2_{1-\alpha/2}(n-1)}\right)$$

#### 两个正态总体

**$\mu_1-\mu_2$ 的置信区间**：

- $\sigma_1^2,\sigma_2^2$ 已知：$(\bar{X}-\bar{Y})\pm u_{\alpha/2}\sqrt{\dfrac{\sigma_1^2}{n_1}+\dfrac{\sigma_2^2}{n_2}}$
- $\sigma_1^2=\sigma_2^2$ 未知：$(\bar{X}-\bar{Y})\pm t_{\alpha/2}(n_1+n_2-2)\,S_w\sqrt{\dfrac{1}{n_1}+\dfrac{1}{n_2}}$

**$\sigma_1^2/\sigma_2^2$ 的置信区间**（用 $F$）：

$$\left(\frac{S_1^2/S_2^2}{F_{\alpha/2}(n_1-1,n_2-1)},\ \frac{S_1^2/S_2^2}{F_{1-\alpha/2}(n_1-1,n_2-1)}\right)$$

---

## ✏️ 经典题型

:::fold 题型一 最大似然估计（★年年考·大题）
**例**：$X$ 的密度 $f(x; \theta) = \begin{cases} \theta x^{\theta - 1}, & 0 < x < 1 \\ 0, & \text{其他} \end{cases}$（$\theta > 0$），$X_1, \cdots, X_n$ 为样本，求 $\theta$ 的最大似然估计。

**解**：

1. 似然函数：$L(\theta) = \prod_{i=1}^n \theta x_i^{\theta - 1} = \theta^n (\prod x_i)^{\theta - 1}$
2. 取对数：$\ln L = n\ln\theta + (\theta - 1)\sum \ln x_i$
3. 求导令为零：$\frac{n}{\theta} + \sum \ln x_i = 0$ → $\hat{\theta} = -\frac{n}{\sum \ln X_i}$

**步骤**：写 $L$ → 取对数 → 求导令为零 → 解出；导数恒不为零时由定义（单调性）找最大值点。
:::

:::fold 题型二 矩估计（★年年考·大题）
**例**：$X \sim U(a, b)$，$a$、$b$ 未知，$X_1, \cdots, X_n$ 为样本，求 $a$、$b$ 的矩估计。

**解**：$E(X) = \frac{a + b}{2}$，$D(X) = \frac{(b - a)^2}{12}$

1. 令 $E(X) = \bar{X}$：$\frac{a + b}{2} = \bar{X}$
2. 令 $D(X) = B_2$（样本二阶中心矩）：$\frac{(b - a)^2}{12} = B_2$
3. 解得 $\hat{a} = \bar{X} - \sqrt{3B_2}$，$\hat{b} = \bar{X} + \sqrt{3B_2}$

**要点**：一个参数令 $E(X) = \bar{X}$；两个参数再令 $E(X^2) = \frac{1}{n}\sum X_i^2$（或 $D(X) = B_2$）。
:::

:::fold 题型三 无偏性验证（高频）
**例**：设 $\hat{\theta}_1 = \bar{X}$，$\hat{\theta}_2 = X_1$ 都是 $\mu$ 的估计量，验证无偏性并比较有效性。

**解**：

1. $E(\bar{X}) = \mu$ → 无偏；$E(X_1) = \mu$ → 无偏
2. $D(\bar{X}) = \frac{\sigma^2}{n}$，$D(X_1) = \sigma^2$
3. $D(\bar{X}) < D(X_1)$ → $\bar{X}$ 更有效

**要点**：无偏性 = $E(\hat{\theta}) = \theta$；有效性比方差（小者优）；$S^2$ 是 $\sigma^2$ 的无偏估计，但 $S$ 不是 $\sigma$ 的无偏估计。
:::

:::fold 题型四 置信区间（中频）
**例**：$X \sim N(\mu, \sigma^2)$，$\sigma^2$ 未知。测得 $n = 9$，$\bar{x} = 5$，$s = 2$，$t_{0.025}(8) = 2.306$，求 $\mu$ 的 $95\%$ 置信区间。

**解**：$\sigma^2$ 未知，用 $t$ 分布：

1. 置信区间为 $(\bar{x} \pm t_{\alpha/2}(n-1)\frac{s}{\sqrt{n}})$
2. $= 5 \pm 2.306 \times \frac{2}{3} = 5 \pm 1.537$
3. 即 $(3.463, 6.537)$

**要点**：方差已知用 $u$（正态），未知用 $t$；$\sigma^2$ 的置信区间用 $\chi^2$（注意大的分位数在分母左侧）。
:::

## ⭐ 重点提示

- ★ 矩估计与最大似然估计是必考大题，两种方法都要熟练
- ★ 最大似然估计的对数求导法是计算核心
- ★ 无偏性验证（$E(\hat{\theta})=\theta$）是高频小题
- ★ 单个正态总体 $\mu$、$\sigma^2$ 的置信区间（选 $Z$/$t$/$\chi^2$）必须分清
- ★ 区分"已知方差用 $u$，未知方差用 $t$"是关键

---

## 🔗 前后联系

- 综合第二章分布、第四章期望、第六章抽样分布
- 矩估计依赖样本矩，最大似然依赖似然函数构造
- 为第八章假设检验提供检验统计量与临界值思想

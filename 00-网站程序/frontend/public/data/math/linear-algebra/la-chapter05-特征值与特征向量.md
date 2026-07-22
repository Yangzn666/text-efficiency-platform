# 第五章 特征值与特征向量

## 📖 考纲要求与考情

- 理解特征值与特征向量的概念，掌握其性质与计算方法
- 理解相似矩阵的概念，掌握矩阵可相似对角化的条件
- 掌握实对称矩阵的特征值与特征向量的性质，会用正交变换化实对称矩阵为对角矩阵

**考情**：本章是线代的**综合枢纽**，大题年年考。相似对角化、实对称矩阵的正交对角化是解答题的固定班底，常与二次型（第六章）联动。特征值的性质是选择题的高频考点。

## 🎯 核心知识体系

### 5.1 特征值与特征向量

**定义**：$A\alpha = \lambda\alpha$（$\alpha \ne 0$），则 $\lambda$ 为特征值，$\alpha$ 为属于 $\lambda$ 的特征向量。

**求解流程**：

1. 解特征方程 $|\lambda E - A| = 0$，得特征值 $\lambda_1, \lambda_2, \cdots$
2. 对每个 $\lambda_i$，解 $(\lambda_i E - A)x = 0$，非零解即为特征向量

**特征值的性质（必背）**：

$$\lambda_1 + \lambda_2 + \cdots + \lambda_n = tr(A) = a_{11} + a_{22} + \cdots + a_{nn}$$

$$\lambda_1 \lambda_2 \cdots \lambda_n = |A|$$

- $A$ 可逆 $\Leftrightarrow$ 特征值全不为零；此时 $A^{-1}$ 的特征值为 $\frac{1}{\lambda}$
- $A^k$ 的特征值为 $\lambda^k$；$f(A)$ 的特征值为 $f(\lambda)$（$f$ 为多项式）
- $A$ 与 $A^T$ 特征值相同（特征向量一般不同）
- 属于不同特征值的特征向量线性无关

**特征向量的性质**：

- $k\alpha$（$k \ne 0$）仍是 $\lambda$ 的特征向量
- 同一 $\lambda$ 的特征向量的非零线性组合仍是 $\lambda$ 的特征向量
- 属于不同 $\lambda$ 的特征向量之和**不是**特征向量

### 5.2 相似矩阵

**定义**：存在可逆 $P$ 使 $P^{-1}AP = B$，则 $A \sim B$。

**相似的必要条件（判定不相似的快速工具）**：

$$A \sim B \Rightarrow \begin{cases} |A| = |B| \\ tr(A) = tr(B) \\ r(A) = r(B) \\ 特征值相同 \\ |\lambda E - A| = |\lambda E - B| \end{cases}$$

（注意：以上均为必要非充分条件，验否用它们，证否只需一条不满足）

**相似的性质**：$A \sim B$ → $A^k \sim B^k$，$f(A) \sim f(B)$，$A^{-1} \sim B^{-1}$（$A$ 可逆时），$A^T \sim B^T$

### 5.3 相似对角化（★大题核心）

**$A$ 可对角化的充要条件**：$A$ 有 $n$ 个线性无关的特征向量。

$$P^{-1}AP = \Lambda = diag(\lambda_1, \cdots, \lambda_n), \quad P = (\alpha_1, \cdots, \alpha_n)$$

★ **注意对应关系**：$\Lambda$ 对角线上特征值的顺序必须与 $P$ 中特征向量的列顺序一一对应！

**充分条件**：
- $A$ 有 $n$ 个互不相同的特征值 → 必可对角化
- $k$ 重特征值 $\lambda_k$ 对应 $k$ 个线性无关特征向量 $\Leftrightarrow r(\lambda_k E - A) = n - k$

**不可对角化的判定**：某 $k$ 重特征值只有 $< k$ 个无关特征向量（即 $r(\lambda E - A) > n - k$）。

**对角化的应用——求 $A^n$**：

$$A = P\Lambda P^{-1} \Rightarrow A^n = P\Lambda^n P^{-1}$$

### 5.4 实对称矩阵（★必考重点）

**三大性质**：

1. 特征值全为实数
2. 属于不同特征值的特征向量**正交**
3. **必可正交对角化**：存在正交矩阵 $Q$ 使 $Q^{-1}AQ = Q^TAQ = \Lambda$

**正交对角化的标准流程（大题模板）**：

1. 求特征值 $\lambda_1, \lambda_2, \cdots$
2. 对每个 $\lambda_i$ 求 $(\lambda_i E - A)x = 0$ 的基础解系
3. 单重根的特征向量直接用；重根的几个向量做**施密特正交化**
4. 全部单位化得 $\eta_1, \cdots, \eta_n$
5. $Q = (\eta_1, \cdots, \eta_n)$，则 $Q^TAQ = diag(\lambda_1, \cdots, \lambda_n)$

**注意**：不同特征值的特征向量自动正交，无需处理；只需对同一重根内的向量正交化。

### 5.5 由特征值反推矩阵信息

已知 $A$ 的特征值，可直接推出：

- $|A|$ = 全部特征值之积；$tr(A)$ = 全部特征值之和
- $A^k$、$A^{-1}$、$A^*$（$= |A|A^{-1}$，特征值 $\frac{|A|}{\lambda}$）、$A + kE$、$f(A)$ 的特征值
- $A$ 是否可逆、$r(A)$（非零特征值个数 $\ge r(A)$，实对称时取等）

## 📐 核心公式速查

$$|\lambda E - A| = 0 求特征值；(\lambda_i E - A)x = 0 求特征向量$$

$$\sum\lambda_i = tr(A), \quad \prod\lambda_i = |A|$$

$$A^n = P\Lambda^n P^{-1} \quad (A = P\Lambda P^{-1})$$

$$实对称：不同\lambda的\alpha正交；重根内施密特正交化；Q^TAQ = \Lambda$$

## ✏️ 经典题型

:::fold 题型一 求特征值与特征向量
**例**：求 $A = \begin{pmatrix} 2 & -1 & 0 \\ 0 & 1 & 0 \\ -1 & 1 & 1 \end{pmatrix}$ 的特征值与特征向量。

**解**：$|\lambda E - A| = \begin{vmatrix} \lambda-2 & 1 & 0 \\ 0 & \lambda-1 & 0 \\ 1 & -1 & \lambda-1 \end{vmatrix}$

按第2行展开：$(\lambda-1)\begin{vmatrix} \lambda-2 & 0 \\ 1 & \lambda-1 \end{vmatrix} = (\lambda-1)^2(\lambda-2)$

$\lambda_1 = \lambda_2 = 1$（二重），$\lambda_3 = 2$。

$\lambda = 1$：$(E - A)x = 0$，即 $\begin{pmatrix} -1 & 1 & 0 \\ 0 & 0 & 0 \\ 1 & -1 & 0 \end{pmatrix}x = 0$

1. $r = 1$，基础解系含2个向量
2. $\xi_1 = (1,1,0)^T$，$\xi_2 = (0,0,1)^T$

$\lambda = 2$：$(2E - A)x = 0$，得 $\xi_3 = (1,0,-1)^T$

**验证**：$r(E-A) = 1 = n - k = 3 - 2$ ✓（二重根有2个无关特征向量，可对角化）
:::

:::fold 题型二 判断能否对角化 + 求P
**例**：$A = \begin{pmatrix} 1 & 0 & 0 \\ -2 & 0 & -2 \\ -2 & -2 & 0 \end{pmatrix}$...

**标准判定流程**：

1. 求全部特征值
2. 对每个 $k$ 重特征值 $\lambda_k$，验证 $r(\lambda_k E - A) = n - k$ 是否成立
3. 全部成立 → 可对角化，收集 $n$ 个无关特征向量组成 $P$

**快速结论**：实对称矩阵一定可以对角化，无需验证。

**求 $A^n$ 的完整流程**：$A = P\Lambda P^{-1}$ → $A^n = P\Lambda^n P^{-1}$，其中 $\Lambda^n = diag(\lambda_1^n, \cdots, \lambda_n^n)$。
:::

:::fold 题型三 实对称矩阵的正交对角化（★大题模板）
**例**：设 $A = \begin{pmatrix} 2 & 1 & 1 \\ 1 & 2 & 1 \\ 1 & 1 & 2 \end{pmatrix}$，求正交矩阵 $Q$ 使 $Q^TAQ$ 为对角矩阵。

**解**（五步模板）：

1. **求特征值**：$|\lambda E - A| = (\lambda - 4)(\lambda - 1)^2$，得 $\lambda_1 = 4$，$\lambda_2 = \lambda_3 = 1$
2. **求特征向量**：$\lambda = 4$ 时 $(4E - A)x = 0$ → $\alpha_1 = (1,1,1)^T$；$\lambda = 1$ 时 $(E - A)x = 0$ 即 $x_1 + x_2 + x_3 = 0$ → $\alpha_2 = (1,-1,0)^T$，$\alpha_3 = (1,0,-1)^T$
3. **正交化**（仅重根需要）：$\beta_2 = \alpha_2 = (1,-1,0)^T$；$\beta_3 = \alpha_3 - \frac{(\alpha_3,\beta_2)}{(\beta_2,\beta_2)}\beta_2 = (1,0,-1)^T - \frac{1}{2}(1,-1,0)^T = (\frac{1}{2}, \frac{1}{2}, -1)^T$，取 $(1,1,-2)^T$
4. **单位化**：$\eta_1 = \frac{1}{\sqrt{3}}(1,1,1)^T$，$\eta_2 = \frac{1}{\sqrt{2}}(1,-1,0)^T$，$\eta_3 = \frac{1}{\sqrt{6}}(1,1,-2)^T$
5. **写Q**：$Q = (\eta_1, \eta_2, \eta_3)$，则 $Q^TAQ = diag(4, 1, 1)$
:::

:::fold 题型四 利用特征值性质求行列式/迹
**例**：设3阶矩阵 $A$ 的特征值为 $1, -2, 3$，求 $|A^* + 2A - E|$...

**思路**：$A^* = |A|A^{-1}$，$|A| = 1 \times (-2) \times 3 = -6$

$A^* + 2A - E$ 的特征值为 $\frac{-6}{\lambda} + 2\lambda - 1$：

- $\lambda = 1$：$-6 + 2 - 1 = -5$
- $\lambda = -2$：$3 - 4 - 1 = -2$
- $\lambda = 3$：$-2 + 6 - 1 = 3$

$|A^* + 2A - E| = (-5)(-2)(3) = 30$

**核心方法**：$f(A)$ 的特征值 = $f(\lambda)$，行列式 = 特征值之积。
:::

:::fold 题型五 抽象矩阵的特征值问题
**例1**：设 $A^2 = E$（对合矩阵），求 $A$ 的可能特征值。

**解**：设 $A\alpha = \lambda\alpha$，则 $A^2\alpha = \lambda^2\alpha$，又 $A^2\alpha = E\alpha = \alpha$，故 $\lambda^2 = 1$，$\lambda = \pm 1$。

**推广**：$A^2 = A$（幂等）→ $\lambda = 0$ 或 $1$；$A^k = O$（幂零）→ $\lambda$ 全为 $0$。

---

**例2**：设 $\alpha$ 是 $A$ 属于 $\lambda$ 的特征向量，证明 $\alpha$ 也是 $A^*$ 的特征向量。

**证**：

1. 由 $A\alpha = \lambda\alpha$，两侧左乘 $A^*$ 得 $A^*A\alpha = \lambda A^*\alpha$
2. 即 $|A|\alpha = \lambda A^*\alpha$
3. 若 $\lambda \ne 0$，则 $A^*\alpha = \frac{|A|}{\lambda}\alpha$
4. 故 $\alpha$ 是 $A^*$ 属于 $\frac{|A|}{\lambda}$ 的特征向量
:::

## ⭐ 重点提示

- **正交对角化大题每年必考**，五步流程必须练到条件反射（求特征值→求特征向量→正交化→单位化→写Q）
- $P$ 中列的顺序与 $\Lambda$ 对角元顺序必须对应，这是最常见的扣分点
- 特征值性质题（求 $|f(A)|$、$tr(f(A))$）是选择填空送分题，务必拿满
- 实对称矩阵不同特征值的特征向量正交 → 已知部分特征向量可"叉乘"推出其余

## 🔗 前后联系

- **前置**：行列式（特征方程）、方程组（求特征向量）、施密特正交化（第三章）
- **后续应用**：二次型的正交变换化标准形本质上就是实对称矩阵的正交对角化（第六章）；正定性与特征值符号（第六章）


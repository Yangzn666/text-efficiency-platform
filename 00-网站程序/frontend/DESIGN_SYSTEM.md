# 设计系统规范（Design System Guidelines）

> 基于 **design-taste-frontend** skill 制定的考研效率平台设计规范

---

## 🎯 Design Read

**Reading this as**: 考研学习工具平台 for 备考学生, with a functional/clean language, leaning toward Element Plus + custom design tokens.

**Dials Configuration**:
- `DESIGN_VARIANCE: 6` - 偏向对称和简洁（学习工具不需要太花哨）
- `MOTION_INTENSITY: 4` - 克制的动画（避免干扰学习）
- `VISUAL_DENSITY: 4` - 适中的信息密度（清晰易读）

---

## 📐 核心原则

### 1. COLOR CONSISTENCY LOCK（颜色一致性锁定）

**已选择的主色**：Material Blue (`#1976D2`)

**规则**：
- ✅ 整个项目只使用一个主色
- ✅ 所有蓝色系都从主色派生（light/dark/hover）
- ❌ 禁止突然引入其他色系（如紫色、绿色按钮）
- ❌ 禁止在同一页面混用冷暖灰色

**调色板**：
```scss
--color-primary: #1976D2        // 主色
--color-primary-light: #64B5F6  // 浅色（背景、hover）
--color-primary-dark: #0D47A1   // 深色（active、强调）
--color-primary-hover: #2196F3  // 悬停色
```

**中性色**：冷灰色系（保持一致）
```scss
--color-gray-50: #FAFAFA
--color-gray-100: #F5F5F5
...
--color-gray-900: #212121
```

---

### 2. SHAPE CONSISTENCY LOCK（形状一致性锁定）

**圆角规范**：混合但有明确规则

| 元素类型 | 圆角值 | CSS 变量 | 示例 |
|---------|--------|----------|------|
| 输入框、小标签 | `4px` | `--radius-sm` | `<input>`, `<tag>` |
| 卡片、中等容器 | `8px` | `--radius-md` | `.card`, `.panel` |
| 按钮、大元素 | `12px` | `--radius-lg` | `<button>`, `.nav-item` |
| 胶囊形、头像 | `9999px` | `--radius-full` | `.badge`, `.avatar` |

**规则**：
- ✅ 同类型元素必须使用相同圆角
- ✅ 按钮统一使用 `12px`
- ❌ 禁止在同一个页面混用不同风格的圆角（如圆角按钮+直角卡片）

---

### 3. TYPOGRAPHY DISCIPLINE（排版规范）

**字体家族**：
```scss
--font-family-base: 'FZCuHei', -apple-system, ...  // 主要字体
--font-family-mono: 'JetBrains Mono', ...          // 代码字体
```

**字号层级**：
```scss
--font-size-xs: 0.75rem    // 12px - 辅助文字、标签
--font-size-sm: 0.875rem   // 14px - 次要文字
--font-size-base: 1rem     // 16px - 正文
--font-size-lg: 1.125rem   // 18px - 小标题
--font-size-xl: 1.25rem    // 20px - 标题
--font-size-2xl: 1.5rem    // 24px - 大标题
--font-size-3xl: 1.875rem  // 30px - Hero 标题
--font-size-4xl: 2.25rem   // 36px - 超大标题
```

**对比度要求**（WCAG AA）：
- ✅ 正文文字对比度 ≥ 4.5:1
- ✅ 大文字（≥18px）对比度 ≥ 3:1
- ❌ 禁止使用 `#666` 在 `#f5f7fa` 背景上（对比度不足）
- ✅ 改用 `#333` 或 `#212121`

---

### 4. LAYOUT DISCIPLINE（布局规范）

**容器宽度**：
```scss
--container-max-width: 1400px  // 最大宽度
```

**Hero 区域规则**：
- ✅ Hero 必须在首屏完整显示（无需滚动）
- ✅ 标题最多 2 行
- ✅ 副标题最多 20 字，最多 4 行
- ✅ 最多 4 个文本元素（eyebrow + headline + subtext + CTAs）
- ❌ 禁止在 Hero 中放置"Trusted by"logo 墙
- ❌ Hero top padding 最大 `pt-24`（约 6rem）

**导航栏规则**：
- ✅ 桌面端必须单行显示，不换行
- ✅ 移动端使用汉堡菜单（<768px）
- ✅ 导航高度最大 80px，默认 64-72px
- ❌ 禁止桌面端导航换行或横向滚动

**Section 布局重复限制**：
- ✅ 同一布局家族最多出现 1 次
- ❌ 禁止连续 3 个 section 使用相同的 zigzag 布局

**Eyebrow  restraint**：
- ✅ 每 3 个 section 最多 1 个 eyebrow
- ❌ 禁止每个 section 都有 eyebrow

---

### 5. RESPONSIVE BREAKPOINTS（响应式断点）

**标准化断点**：
```scss
sm: 640px   // 小手机
md: 768px   // 平板/大手机
lg: 1024px  // 笔记本
xl: 1280px  // 桌面
2xl: 1536px // 大桌面
```

**使用方式**：
```scss
.element {
  font-size: 14px;
  
  @include respond-to(md) {
    font-size: 16px;
  }
  
  @include respond-to(lg) {
    font-size: 18px;
  }
}
```

---

### 6. MOTION GUIDELINES（动效指南）

**MOTION_INTENSITY: 4**（克制）

**允许的动效**：
- ✅ 按钮 hover/focus/active 状态
- ✅ Tab 切换过渡
- ✅ 下拉菜单展开/收起
- ✅ 轻量的页面加载动画

**禁止的动效**：
- ❌ 无限循环的微动画
- ❌ 过度的视差滚动
- ❌ 复杂的物理引擎效果
- ❌ 自动播放的背景动画

**过渡时长**：
```scss
--transition-fast: 150ms   // 微交互（按钮点击）
--transition-base: 300ms   // 标准过渡（tab切换）
--transition-slow: 500ms   // 大型过渡（页面切换）
```

---

### 7. ACCESSIBILITY（无障碍）

**对比度检查清单**：
- [ ] 所有按钮文字对比度 ≥ 4.5:1
- [ ] 表单 placeholder 对比度 ≥ 4.5:1
- [ ] 错误提示文字对比度 ≥ 4.5:1
- [ ] 链接文字有下划线或其他视觉区分

**键盘导航**：
- [ ] 所有交互元素可通过 Tab 键访问
- [ ] Focus 状态有明显视觉反馈
- [ ] 模态对话框支持 Esc 关闭

**ARIA 标签**：
- [ ] 图标按钮有 `aria-label`
- [ ] 动态内容有 `aria-live`
- [ ] 表单字段有 `aria-describedby`

---

## 🎨 组件规范

### Button（按钮）

```vue
<!-- ✅ 正确 -->
<button class="btn btn-primary">主要操作</button>
<button class="btn btn-secondary">次要操作</button>

<!-- ❌ 错误 -->
<button style="background: purple;">紫色按钮</button>
```

**样式**：
- 圆角：`12px` (`--radius-lg`)
- 内边距：`12px 22px`
- 阴影：`0 2px 8px rgba(0, 0, 0, 0.06)`
- Hover：向上移动 3px + 加深阴影
- Active：向下移动 1px 或 scale(0.98)

### Card（卡片）

```vue
<!-- ✅ 正确 -->
<div class="card">
  <div class="card-header">标题</div>
  <div class="card-body">内容</div>
</div>

<!-- ❌ 错误 -->
<div style="border-radius: 20px;">不规则圆角</div>
```

**样式**：
- 圆角：`8px` (`--radius-md`)
- 阴影：`0 4px 12px rgba(0, 0, 0, 0.08)`
- 内边距：`16px` 或 `24px`

### Input（输入框）

```vue
<!-- ✅ 正确：标签在上 -->
<label>用户名</label>
<input type="text" />

<!-- ❌ 错误：placeholder 当标签 -->
<input placeholder="用户名" />
```

**样式**：
- 圆角：`4px` (`--radius-sm`)
- 边框：`1px solid var(--color-border)`
- Focus：边框变为主色 + 轻微阴影

---

## 📝 开发检查清单

### Pre-Flight Check（交付前检查）

#### 视觉一致性
- [ ] 颜色系统一致（没有突然出现的紫色/绿色）
- [ ] 圆角规范一致（按钮都是 12px，卡片都是 8px）
- [ ] 字体大小符合层级（没有突兀的大/小字）
- [ ] 间距使用设计令牌（不是硬编码的 px 值）

#### 响应式
- [ ] 桌面端导航单行显示
- [ ] 移动端汉堡菜单正常工作
- [ ] 所有 section 在移动端正确折叠
- [ ] 图片在不同屏幕尺寸下不变形

#### 无障碍
- [ ] 所有按钮文字对比度 ≥ 4.5:1
- [ ] 表单标签在输入框上方
- [ ] 焦点状态有明显视觉反馈
- [ ] 图标按钮有 aria-label

#### 性能
- [ ] 图片使用合适的格式和尺寸
- [ ] 没有不必要的动画
- [ ] 懒加载长列表
- [ ] 骨架屏代替简单 spinner

#### 内容
- [ ] Hero 区域不超过 4 个文本元素
- [ ] 副标题不超过 20 字
- [ ] 没有重复的 CTA 意图
- [ ] Eyebrow 不超过每 3 个 section 1 个

---

## 🔧 工具与资源

### 设计令牌文件
- `src/styles/_design-tokens.scss` - 全局设计令牌
- `src/styles/_breakpoints.scss` - 响应式断点混入

### 在线工具
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) - 对比度检查
- [Can I Use](https://caniuse.com/) - CSS 特性兼容性
- [Responsively App](https://responsively.app/) - 多设备预览

### VS Code 扩展
- `stylelint` - CSS/SCSS  linting
- `Color Highlight` - 颜色预览
- `CSS Peek` - 快速查看样式定义

---

## 📚 参考资料

- [design-taste-frontend Skill](https://github.com/Leonxlnx/taste-skill)
- [Material Design Color System](https://material.io/design/color/the-color-system.html)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Vue.js Style Guide](https://vuejs.org/style-guide/)

---

**最后更新**: 2026-06-21  
**维护者**: 考研效率平台开发团队

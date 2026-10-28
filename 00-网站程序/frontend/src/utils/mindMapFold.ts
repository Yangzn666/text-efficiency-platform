// 思维导图（Mermaid mindmap）折叠工具
// Mermaid mindmap 本身不支持节点级折叠，这里通过按缩进层级裁剪源码实现“默认完全折叠”。
// 约定：`mindmap` 头行缩进 0；root 缩进 2 空格（深度 1）；子节点每层 +2 空格。
export function clampMindMapDepth(src: string, maxDepth: number): string {
  if (!src) return src
  const lines = src.split('\n')
  const out: string[] = []
  for (const line of lines) {
    if (!line.trim()) {
      out.push(line)
      continue
    }
    // 保留 mindmap 头行
    if (/^\s*mindmap(\s|$)/.test(line)) {
      out.push(line)
      continue
    }
    const leading = line.match(/^ */)![0].length
    const depth = leading / 2 // root(2 空格) => 1
    if (depth <= maxDepth) out.push(line)
  }
  return out.join('\n')
}

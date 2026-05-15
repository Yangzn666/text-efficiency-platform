# -*- coding: utf-8 -*-
import re

# 读取文件
with open('src/stores/composition.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 找到5.5和5.6节的完整内容
# 5.5节从 id: '5.5' 开始，到下一个 }, 结束
# 5.6节从 id: '5.6' 开始，到下一个 }, 结束

# 使用正则表达式匹配两个section
pattern_5_5 = r"(\s+\{\s+id: '5\.5',\s+title: '异常和中断机制',\s+content: `)([\s\S]*?)(`\s+\},)"
pattern_5_6 = r"(\s+\{\s+id: '5\.6',\s+title: '指令流水线',\s+content: `)([\s\S]*?)(`\s+\},)"

match_5_5 = re.search(pattern_5_5, content)
match_5_6 = re.search(pattern_5_6, content)

if match_5_5 and match_5_6:
    # 提取两个section的content部分
    content_5_5 = match_5_5.group(2)
    content_5_6 = match_5_6.group(2)
    
    print(f"找到5.5节，长度: {len(content_5_5)}")
    print(f"找到5.6节，长度: {len(content_5_6)}")
    
    # 交换两个content
    # 替换5.5的content为5.6的content
    new_content_5_5 = match_5_5.group(1) + content_5_6 + match_5_5.group(3)
    # 替换5.6的content为5.5的content  
    new_content_5_6 = match_5_6.group(1) + content_5_5 + match_5_6.group(3)
    
    # 在原始content中进行替换
    # 先替换5.5
    content = content[:match_5_5.start()] + new_content_5_5 + content[match_5_5.end():]
    
    # 重新计算5.6的位置（因为5.5被替换后，位置可能变化）
    match_5_6_new = re.search(pattern_5_6, content)
    if match_5_6_new:
        content = content[:match_5_6_new.start()] + new_content_5_6 + content[match_5_6_new.end():]
        
        # 写回文件
        with open('src/stores/composition.ts', 'w', encoding='utf-8') as f:
            f.write(content)
        
        print("成功交换5.5和5.6的内容！")
    else:
        print("错误：替换5.5后找不到5.6节")
else:
    print("错误：未找到5.5或5.6节")
    if not match_5_5:
        print("  - 未找到5.5节")
    if not match_5_6:
        print("  - 未找到5.6节")

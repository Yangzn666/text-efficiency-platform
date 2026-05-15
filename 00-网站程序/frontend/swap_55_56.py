# -*- coding: utf-8 -*-
import re

# 读取文件
with open('src/stores/composition.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# 找到5.5和5.6节的起始和结束行
section_5_5_start = None
section_5_5_end = None
section_5_6_start = None
section_5_6_end = None

for i, line in enumerate(lines):
    if "id: '5.5'," in line:
        # 找到前一个 { 的位置
        for j in range(i-1, -1, -1):
            if '{' in lines[j] and 'id:' not in lines[j]:
                section_5_5_start = j
                break
        # 找到这个section的结束 }
        brace_count = 0
        for j in range(i, len(lines)):
            brace_count += lines[j].count('{') - lines[j].count('}')
            if brace_count == 0 and j > i:
                section_5_5_end = j + 1
                break
    
    if "id: '5.6'," in line:
        # 找到前一个 { 的位置
        for j in range(i-1, -1, -1):
            if '{' in lines[j] and 'id:' not in lines[j]:
                section_5_6_start = j
                break
        # 找到这个section的结束 }
        brace_count = 0
        for j in range(i, len(lines)):
            brace_count += lines[j].count('{') - lines[j].count('}')
            if brace_count == 0 and j > i:
                section_5_6_end = j + 1
                break

print(f"5.5节: 行 {section_5_5_start+1} - {section_5_5_end}")
print(f"5.6节: 行 {section_5_6_start+1} - {section_5_6_end}")

if section_5_5_start is not None and section_5_6_start is not None:
    # 提取两个section
    section_5_5 = lines[section_5_5_start:section_5_5_end]
    section_5_6 = lines[section_5_6_start:section_5_6_end]
    
    # 交换它们
    new_lines = (
        lines[:section_5_5_start] + 
        section_5_6 + 
        lines[section_5_5_end:section_5_6_start] + 
        section_5_5 + 
        lines[section_5_6_end:]
    )
    
    # 写回文件
    with open('src/stores/composition.ts', 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    
    print("成功交换5.5和5.6节的位置！")
else:
    print("错误：未找到5.5或5.6节")

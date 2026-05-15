import re

# 读取文件
with open('src/stores/composition.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# 找到5.9节的开始和结束行
start_line = None
end_line = None

for i, line in enumerate(lines):
    if "id: '5.9'" in line:
        start_line = i - 1  # 包括前面的 {
        break

if start_line:
    # 找到对应的结束位置（下一个 }, 或 ]）
    brace_count = 0
    for i in range(start_line, len(lines)):
        if '{' in lines[i]:
            brace_count += lines[i].count('{')
        if '}' in lines[i]:
            brace_count -= lines[i].count('}')
        if brace_count == 0 and i > start_line:
            end_line = i
            break
    
    if end_line:
        # 删除5.9节
        del lines[start_line:end_line + 1]
        
        # 写回文件
        with open('src/stores/composition.ts', 'w', encoding='utf-8') as f:
            f.writelines(lines)
        
        print(f'Successfully removed section 5.9 (lines {start_line+1} to {end_line+1})')
    else:
        print('Could not find end of section 5.9')
else:
    print('Could not find section 5.9')

import re

file_path = r'00-网站程序\frontend\src\stores\operatingSystem.ts'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

print("查找未转义的反引号（在模板字符串中）:")
print("="*60)

in_content = False
for i, line in enumerate(lines, 1):
    # 检查是否在content字段内
    if 'content: `' in line:
        in_content = True
    
    # 如果在content内，查找未转义的反引号
    if in_content:
        # 匹配单反引号但不是转义的
        matches = re.finditer(r'(?<!\\)`([^`]+)`', line)
        for match in matches:
            print(f"第{i}行: {line.rstrip()}")
            print(f"       位置: {match.start()}-{match.end()}, 内容: {match.group(0)}")
    
    # 检查是否退出content
    if in_content and line.strip().endswith('`,'):
        in_content = False
    elif in_content and line.strip().endswith('`'):
        in_content = False

print("\n完成检查")

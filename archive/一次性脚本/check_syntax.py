import re

file_path = r'00-网站程序\frontend\src\stores\operatingSystem.ts'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# 检查第2223行附近
print("检查第2220-2240行:")
for i in range(2219, min(2240, len(lines))):
    print(f"{i+1}: {lines[i]}", end='')

print("\n" + "="*60)

# 查找所有未转义的代码块
print("\n查找未转义的代码块标记:")
for i, line in enumerate(lines, 1):
    if line.strip() == '```' and not line.strip().startswith('\\'):
        print(f"第{i}行: {line.rstrip()}")

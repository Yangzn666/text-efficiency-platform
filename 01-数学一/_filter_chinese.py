# -*- coding: utf-8 -*-
"""过滤提取文本中的干净中文行（去掉碎片化公式行），生成浓缩视图"""
import re
import glob
import os

OUT = "d:/学习/效率/01-数学一/_extracted"

def chinese_ratio(line):
    """计算一行中中文字符占比"""
    line = line.strip()
    if not line:
        return 0, 0
    cn = len(re.findall(r'[\u4e00-\u9fff]', line))
    return cn, len(line)

def is_meaningful(line):
    """保留有意义的中文行：含>=4个汉字，或含>=2汉字且较长"""
    line = line.strip()
    # 去掉页码、水印
    if re.match(r'^\d+$', line):
        return False
    if 'B站' in line or '一高数' in line:
        return False
    if re.match(r'^=+ *PDF第\d+页 *=+$', line):
        return True  # 保留页标记
    cn, total = chinese_ratio(line)
    if cn >= 4:
        return True
    if cn >= 2 and total <= 30:
        return True
    return False

for src in sorted(glob.glob(f"{OUT}/kira_0*.txt")):
    name = os.path.basename(src).replace('.txt', '')
    with open(src, encoding='utf-8') as f:
        lines = f.readlines()
    kept = [l.rstrip() for l in lines if is_meaningful(l)]
    # 压缩连续空行
    out_lines = []
    prev_blank = False
    for l in kept:
        if l.strip() == '':
            if not prev_blank:
                out_lines.append('')
            prev_blank = True
        else:
            out_lines.append(l)
            prev_blank = False
    dst = f"{OUT}/浓缩_{name}.txt"
    with open(dst, 'w', encoding='utf-8') as f:
        f.write('\n'.join(out_lines))
    print(f"{name}: {len(lines)}行 -> {len(out_lines)}行")

print("DONE")

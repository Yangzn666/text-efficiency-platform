# -*- coding: utf-8 -*-
"""提取武忠详高数强化24讲全部文本，检测章节结构"""
import fitz
import re
import os
import glob

OUT = "d:/学习/效率/01-数学一/_extracted"
os.makedirs(OUT, exist_ok=True)
folder = "d:/学习/效率/01-数学一/05-武忠详强化笔记"

# 只取 高数强化NN.pdf（排除重复的(1)文件和辅导讲义）
files = sorted(glob.glob(f"{folder}/高数强化*.pdf"))
files = [f for f in files if "(1)" not in os.path.basename(f)]

def num(f):
    m = re.search(r'高数强化(\d+)', os.path.basename(f))
    return int(m.group(1)) if m else 0
files.sort(key=num)

print(f"共 {len(files)} 个讲次PDF")

all_out = []
for f in files:
    lec = num(f)
    doc = fitz.open(f)
    pages_text = []
    for i in range(doc.page_count):
        t = doc[i].get_text()
        pages_text.append(t)
    doc.close()
    full = "\n".join(pages_text)
    all_out.append(f"\n\n{'#'*3} 高数强化{lec:02d}讲 ({doc.page_count if False else len(pages_text)}页) {'#'*3}\n" + "\n---PAGE---\n".join(pages_text))
    # 检测本讲出现的章节标记
    chs = sorted(set(re.findall(r'第([一二三四五六七八九])章', full)))
    print(f"  讲{lec:02d}: {len(pages_text)}页, 涉及章节: {chs}")

with open(f"{OUT}/wjx_高数强化_全部.txt", "w", encoding="utf-8") as f:
    f.write("".join(all_out))
print("DONE -> wjx_高数强化_全部.txt")

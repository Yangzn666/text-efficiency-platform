# -*- coding: utf-8 -*-
"""提取Kira线代全文按章分割 + 测试武忠详高数可提取性"""
import fitz
import re
import os

OUT = "d:/学习/效率/01-数学一/_extracted"
os.makedirs(OUT, exist_ok=True)

# ========== 1. Kira线代：全文提取 + 按章分割 ==========
kira_path = "d:/学习/效率/01-数学一/06-Kira老师资料/Kira·27线性代数强化讲义+习题.pdf"
doc = fitz.open(kira_path)

# 章名映射（用于检测章节起始）
chapter_names = {
    "一": "01-行列式",
    "二": "02-矩阵",
    "三": "03-向量",
    "四": "04-线性方程组",
    "五": "05-特征值与特征向量",
    "六": "06-二次型",
}

chapters = {}  # chapter_key -> list of (page_idx, text)
current = None
full_text_pages = []

for i in range(doc.page_count):
    text = doc[i].get_text()
    full_text_pages.append(f"\n\n===== PDF第{i+1}页 =====\n{text}")
    # 检测章节标题行，形如 "第一章 行列式"
    m = re.search(r'第([一二三四五六])章\s*[\s ]*([^\n]*)', text)
    if m:
        num = m.group(1)
        key = chapter_names.get(num)
        if key:
            # 只有当页面看起来是章节起始（标题在靠前位置）才切换
            # 找到标题在文本中的位置
            pos = text.find(f"第{num}章")
            if pos < 200:  # 标题在页面前部
                current = key
                if current not in chapters:
                    chapters[current] = []
    if current:
        chapters[current].append((i, text))

# 写入全文
with open(f"{OUT}/kira_全文.txt", "w", encoding="utf-8") as f:
    f.write("".join(full_text_pages))

# 写入各章
for key, pages in chapters.items():
    with open(f"{OUT}/kira_{key}.txt", "w", encoding="utf-8") as f:
        for pidx, text in pages:
            f.write(f"\n\n===== PDF第{pidx+1}页 =====\n{text}")
    print(f"Kira {key}: {len(pages)} 页 (PDF第{pages[0][0]+1}-{pages[-1][0]+1}页)")

doc.close()

# ========== 2. 武忠详辅导讲义 文本测试 ==========
print("\n===== 武忠详辅导讲义第一章 测试 =====")
wjx_path = "d:/学习/效率/01-数学一/05-武忠详强化笔记/高等数学辅导讲义 第一章.pdf"
doc2 = fitz.open(wjx_path)
sample = []
for i in range(min(3, doc2.page_count)):
    t = doc2[i].get_text()
    sample.append(f"\n--- 第{i+1}页 (文本长{len(t)}, 图片{len(doc2[i].get_images())}) ---\n{t[:600]}")
with open(f"{OUT}/wjx_辅导讲义_sample.txt", "w", encoding="utf-8") as f:
    f.write("".join(sample))
doc2.close()
print("已写入 wjx_辅导讲义_sample.txt")

# ========== 3. 武忠详高数强化01 测试 ==========
print("\n===== 武忠详高数强化01 测试 =====")
qh_path = "d:/学习/效率/01-数学一/05-武忠详强化笔记/高数强化01.pdf"
doc3 = fitz.open(qh_path)
sample3 = []
for i in range(min(2, doc3.page_count)):
    t = doc3[i].get_text()
    sample3.append(f"\n--- 第{i+1}页 (文本长{len(t)}, 图片{len(doc3[i].get_images())}) ---\n{t[:300]}")
with open(f"{OUT}/wjx_高数强化01_sample.txt", "w", encoding="utf-8") as f:
    f.write("".join(sample3))
doc3.close()
print("已写入 wjx_高数强化01_sample.txt")
print("\nDONE")

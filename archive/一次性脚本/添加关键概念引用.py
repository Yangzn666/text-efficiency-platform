#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
为408数据结构知识点添加关键概念互相引用
在正文内容中为重要概念添加超链接，并在文件末尾添加"关键概念链接"部分
"""

import os
import re

BASE_DIR = r"D:\yang'zhen'ning\Documents\我的obsidian库\YangYang\408数据结构"

# 概念索引：概念名 -> 对应的知识点文件
CONCEPT_INDEX = {
    # 第2章 - 线性表
    '线性表': '2.1_线性表的定义和基本操作.md',
    '顺序表': '2.2_顺序表.md',
    '链表': '2.3_链表.md',
    '单链表': '2.3_链表.md',
    '双链表': '2.3_链表.md',
    '循环链表': '2.3_链表.md',
    
    # 第3章 - 栈和队列
    '栈': '3.1_栈的基本概念.md',
    '顺序栈': '3.2_顺序栈和链栈.md',
    '链栈': '3.2_顺序栈和链栈.md',
    '队列': '3.4_队列的基本概念.md',
    '顺序队列': '3.5_顺序队列和链队列.md',
    '链队列': '3.5_顺序队列和链队列.md',
    '循环队列': '3.5_顺序队列和链队列.md',
    '双端队列': '3.6_双端队列和应用.md',
    
    # 第4章 - 串、数组和广义表
    '串': '4.1_串的基本概念.md',
    '模式匹配': '4.2_串的模式匹配算法.md',
    'KMP算法': '4.2_串的模式匹配算法.md',
    '数组': '4.3_数组的存储结构.md',
    '广义表': '4.4_广义表.md',
    
    # 第5章 - 树和二叉树
    '树': '5.1_树的基本概念.md',
    '二叉树': '5.2_二叉树的概念和性质.md',
    '二叉树的遍历': '5.4_二叉树的遍历.md',
    '先序遍历': '5.4_二叉树的遍历.md',
    '中序遍历': '5.4_二叉树的遍历.md',
    '后序遍历': '5.4_二叉树的遍历.md',
    '层序遍历': '5.4_二叉树的遍历.md',
    '线索二叉树': '5.5_线索二叉树.md',
    '哈夫曼树': '5.7_哈夫曼树.md',
    
    # 第6章 - 图
    '图': '6.1_图的基本概念.md',
    '有向图': '6.1_图的基本概念.md',
    '无向图': '6.1_图的基本概念.md',
    '邻接矩阵': '6.2_图的存储结构.md',
    '邻接表': '6.2_图的存储结构.md',
    '深度优先搜索': '6.3_图的遍历.md',
    '广度优先搜索': '6.3_图的遍历.md',
    '最小生成树': '6.4_最小生成树.md',
    'Prim算法': '6.4_最小生成树.md',
    'Kruskal算法': '6.4_最小生成树.md',
    '最短路径': '6.5_最短路径.md',
    'Dijkstra算法': '6.5_最短路径.md',
    'Floyd算法': '6.5_最短路径.md',
    '拓扑排序': '6.6_拓扑排序和关键路径.md',
    '关键路径': '6.6_拓扑排序和关键路径.md',
    
    # 第7章 - 查找
    '顺序查找': '7.2_顺序查找和折半查找.md',
    '折半查找': '7.2_顺序查找和折半查找.md',
    '二分查找': '7.2_顺序查找和折半查找.md',
    '二叉排序树': '7.3_二叉排序树和平衡二叉树.md',
    'BST': '7.3_二叉排序树和平衡二叉树.md',
    '平衡二叉树': '7.3_二叉排序树和平衡二叉树.md',
    'AVL树': '7.3_二叉排序树和平衡二叉树.md',
    'B树': '7.4_B树和B+树.md',
    'B+树': '7.4_B树和B+树.md',
    '散列表': '7.5_散列表.md',
    '哈希表': '7.5_散列表.md',
    
    # 第8章 - 排序
    '插入排序': '8.2_插入排序.md',
    '希尔排序': '8.2_插入排序.md',
    '冒泡排序': '8.3_交换排序.md',
    '快速排序': '8.3_交换排序.md',
    '简单选择排序': '8.4_选择排序.md',
    '堆排序': '8.4_选择排序.md',
    '归并排序': '8.5_归并排序和基数排序.md',
    '基数排序': '8.5_归并排序和基数排序.md',
    
    # 基础概念
    '时间复杂度': '1.2_算法和算法评价.md',
    '空间复杂度': '1.2_算法和算法评价.md',
    '算法': '1.2_算法和算法评价.md',
}

def get_all_md_files(base_dir):
    """获取所有Markdown文件"""
    md_files = []
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith('.md') and not file.startswith('📖') and file != 'README-使用指南.md':
                md_files.append(os.path.join(root, file))
    return md_files

def find_existing_links(content):
    """找出所有已有的[[...]]链接位置"""
    links = []
    for match in re.finditer(r'\[\[.*?\]\]', content):
        links.append((match.start(), match.end()))
    return links

def is_inside_link(pos, existing_links):
    """检查某个位置是否在已有的链接内"""
    for start, end in existing_links:
        if start <= pos < end:
            return True
    return False

def add_concept_links_in_body(body, current_filename):
    """在正文中添加概念链接"""
    # 找出所有已有的链接
    existing_links = find_existing_links(body)
    
    # 按概念长度降序排列（优先匹配长概念）
    sorted_concepts = sorted(CONCEPT_INDEX.keys(), key=len, reverse=True)
    
    for concept in sorted_concepts:
        target_file = CONCEPT_INDEX[concept]
        
        # 如果是当前文件，跳过
        if target_file == current_filename:
            continue
        
        # 构建正则表达式
        if concept in ['树', '图', '栈', '队列', '串']:
            # 单字概念需要边界保护
            pattern = r'(?<![二哈AVLB+])(?<![\u4e00-\u9fa5])' + re.escape(concept) + r'(?![\u4e00-\u9fa5])'
        else:
            pattern = re.escape(concept)
        
        def replacer(match):
            # 检查是否在已有链接内
            if is_inside_link(match.start(), existing_links):
                return match.group(0)
            
            # 更新existing_links（添加了这个新链接后的位置）
            new_start = match.start()
            new_end = match.end()
            existing_links.append((new_start, new_end))
            
            return f'[[{target_file}|{concept}]]'
        
        body = re.sub(pattern, replacer, body)
    
    return body

def add_key_concepts_section(filepath):
    """为文件添加关键概念互相引用部分"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 获取文件名
    filename = os.path.basename(filepath)
    
    # 提取section_id和chapter
    section_id_match = re.search(r'section_id:\s*"([^"]+)"', content)
    chapter_match = re.search(r'chapter:\s*"([^"]+)"', content)
    
    if not section_id_match:
        return False
    
    current_section_id = section_id_match.group(1)
    current_chapter = chapter_match.group(1) if chapter_match else ""
    
    # 分离frontmatter和body
    parts = content.split('---', 2)
    if len(parts) < 3:
        return False
    
    yaml_front = parts[0] + '---' + parts[1] + '---'
    body = parts[2]
    
    # 删除已有的"## 🔗 关键概念链接"和"### 同章节知识点"等部分
    body = re.sub(r'\n##  关键概念链接\n.*$', '', body, flags=re.DOTALL)
    body = re.sub(r'\n### 同章节知识点\n.*$', '', body, flags=re.DOTALL)
    body = re.sub(r'\n### 前置知识\n.*$', '', body, flags=re.DOTALL)
    body = re.sub(r'\n### 相关知识\n.*$', '', body, flags=re.DOTALL)
    body = re.sub(r'\n---\n\n📖.*$', '', body, flags=re.DOTALL)
    
    # 在正文中添加概念链接
    body = add_concept_links_in_body(body, filename)
    
    # 添加关键概念链接部分
    key_concepts = []
    
    # 1. 同章节知识点
    same_chapter_files = [
        f for f in os.listdir(os.path.dirname(filepath))
        if f.endswith('.md') and f != filename and not f.startswith('📖')
    ]
    if same_chapter_files:
        key_concepts.append("### 同章节知识点")
        for f in sorted(same_chapter_files):
            key_concepts.append(f"- [[{f}]]")
        key_concepts.append("")
    
    # 2. 前置知识（根据章节逻辑）
    prerequisites_map = {
        '2.2': ['2.1_线性表的定义和基本操作.md'],
        '2.3': ['2.1_线性表的定义和基本操作.md', '2.2_顺序表.md'],
        '3.2': ['2.2_顺序表.md', '2.3_链表.md'],
        '3.5': ['2.2_顺序表.md', '2.3_链表.md'],
        '5.4': ['5.2_二叉树的概念和性质.md', '5.3_二叉树的存储结构.md'],
        '6.3': ['5.4_二叉树的遍历.md'],
        '7.2': ['2.1_线性表的定义和基本操作.md'],
        '7.3': ['5.2_二叉树的概念和性质.md'],
        '8.2': ['2.2_顺序表.md'],
    }
    if current_section_id in prerequisites_map:
        key_concepts.append("### 前置知识")
        for prereq in prerequisites_map[current_section_id]:
            key_concepts.append(f"- [[{prereq}]]")
        key_concepts.append("")
    
    # 3. 跨章节相关概念
    related_map = {
        '2.2': ['7.2_顺序查找和折半查找.md', '8.2_插入排序.md'],
        '2.3': ['3.2_顺序栈和链栈.md', '3.5_顺序队列和链队列.md'],
        '3.1': ['3.3_栈的应用.md'],
        '3.4': ['3.6_双端队列和应用.md'],
        '5.2': ['7.3_二叉排序树和平衡二叉树.md', '5.7_哈夫曼树.md'],
        '5.4': ['6.3_图的遍历.md'],
        '6.2': ['2.2_顺序表.md', '2.3_链表.md'],
        '7.3': ['5.2_二叉树的概念和性质.md', '5.4_二叉树的遍历.md'],
        '7.5': ['4.3_数组的存储结构.md'],
        '8.1': ['1.2_算法和算法评价.md'],
        '8.6': ['8.2_插入排序.md', '8.3_交换排序.md', '8.4_选择排序.md', '8.5_归并排序和基数排序.md'],
    }
    if current_section_id in related_map:
        key_concepts.append("### 跨章节关联")
        for related in related_map[current_section_id]:
            key_concepts.append(f"- [[{related}]]")
        key_concepts.append("")
    
    key_concepts.append("---")
    key_concepts.append("")
    key_concepts.append("📖 [[📖 数据结构总览]]")
    
    # 组合内容
    content = yaml_front + body + '\n\n## 🔗 关键概念链接\n\n' + '\n'.join(key_concepts) + '\n'
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return True

def main():
    print("=" * 60)
    print("为408数据结构添加关键概念互相引用")
    print("=" * 60)
    print()
    
    md_files = get_all_md_files(BASE_DIR)
    print(f"📂 找到 {len(md_files)} 个知识点文件")
    print(f" 概念索引包含 {len(CONCEPT_INDEX)} 个关键概念")
    print()
    
    success_count = 0
    for filepath in md_files:
        try:
            if add_key_concepts_section(filepath):
                filename = os.path.basename(filepath)
                print(f"✅ {filename}")
                success_count += 1
        except Exception as e:
            print(f"❌ {os.path.basename(filepath)} - {e}")
    
    print()
    print("=" * 60)
    print(f"✅ 完成！成功处理 {success_count} 个文件")
    print("=" * 60)
    print()
    print("🎯 已完成的优化：")
    print("   ✓ 正文中的关键概念添加了超链接")
    print("   ✓ 例如：'顺序表'链接到2.2章节")
    print("   ✓ 例如：'快速排序'链接到8.3章节")
    print("   ✓ 文件末尾添加了'关键概念链接'部分")
    print("   ✓ 包含：同章节知识点、前置知识、跨章节关联")
    print()
    print("🔄 现在请在Obsidian中刷新，查看更新后的关系图谱！")
    print("   图谱会显示知识点之间的语义关联网络")

if __name__ == "__main__":
    main()

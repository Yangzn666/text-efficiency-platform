#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
为408数据结构知识点添加内部链接，优化Obsidian关系图谱
"""

import os
import re

def get_all_md_files(base_dir):
    """获取所有Markdown文件"""
    md_files = []
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith('.md') and not file.startswith('📖') and file != 'README-使用指南.md':
                md_files.append(os.path.join(root, file))
    return md_files

def extract_section_info(filepath):
    """从文件中提取章节信息"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 提取section_id
    match = re.search(r'section_id:\s*"([^"]+)"', content)
    section_id = match.group(1) if match else ""
    
    # 提取chapter
    match = re.search(r'chapter:\s*"([^"]+)"', content)
    chapter = match.group(1) if match else ""
    
    # 提取tags
    tags = []
    tag_match = re.search(r'tags:\s*\n((?:\s+-\s+.+\n)+)', content)
    if tag_match:
        tags = [tag.strip().replace('- ', '') for tag in tag_match.group(1).strip().split('\n')]
    
    return {
        'filepath': filepath,
        'section_id': section_id,
        'chapter': chapter,
        'tags': tags,
        'filename': os.path.basename(filepath)
    }

def generate_links(section_info, all_sections):
    """为知识点生成相关链接"""
    links = []
    
    section_id = section_info['section_id']
    chapter_num = int(section_id.split('.')[0]) if '.' in section_id else 0
    chapter_name = section_info['chapter']
    
    # 1. 同章节的其他知识点
    same_chapter = [s for s in all_sections 
                    if s['chapter'] == chapter_name and s['section_id'] != section_id]
    if same_chapter:
        links.append("### 同章节知识点")
        for s in same_chapter:
            rel_path = os.path.relpath(s['filepath'], os.path.dirname(section_info['filepath']))
            # 只显示section_id和简洁的标题
            title = os.path.splitext(s['filename'])[0]
            links.append(f"- [[{rel_path}|{title}]]")
        links.append("")
    
    # 2. 前置知识点（按逻辑关系）
    prerequisites = get_prerequisites(section_id)
    if prerequisites:
        links.append("### 前置知识")
        for prereq in prerequisites:
            prereq_section = next((s for s in all_sections if s['section_id'] == prereq), None)
            if prereq_section:
                rel_path = os.path.relpath(prereq_section['filepath'], os.path.dirname(section_info['filepath']))
                title = os.path.splitext(prereq_section['filename'])[0]
                links.append(f"- [[{rel_path}|{title}]]")
        links.append("")
    
    # 3. 相关知识点（跨章节）
    related = get_related_sections(section_id, all_sections)
    if related:
        links.append("### 相关知识")
        for rel_id in related:
            rel_section = next((s for s in all_sections if s['section_id'] == rel_id), None)
            if rel_section:
                rel_path = os.path.relpath(rel_section['filepath'], os.path.dirname(section_info['filepath']))
                title = os.path.splitext(rel_section['filename'])[0]
                links.append(f"- [[{rel_path}|{title}]]")
        links.append("")
    
    # 4. 返回总览
    links.append("---")
    links.append("")
    links.append("📖 [[📖 数据结构总览.md|返回总览]]")
    
    return '\n'.join(links)

def get_prerequisites(section_id):
    """根据知识点编号返回前置知识"""
    chapter = int(section_id.split('.')[0])
    section = int(section_id.split('.')[1])
    
    prereqs = {
        '2.2': ['2.1'],  # 顺序表需要先学线性表定义
        '2.3': ['2.1', '2.2'],  # 链表
        '2.4': ['2.2', '2.3'],  # 比较
        '3.2': ['2.2', '2.3'],  # 栈实现需要顺序表和链表
        '3.5': ['2.2', '2.3'],  # 队列实现
        '4.2': ['2.1'],  # 串匹配
        '5.2': ['1.2'],  # 二叉树需要算法基础
        '5.4': ['5.2', '5.3'],  # 遍历
        '6.3': ['5.4'],  # 图的遍历类似二叉树遍历
        '7.2': ['2.1'],  # 查找需要线性表
        '7.3': ['5.2', '5.4'],  # 二叉排序树
        '8.2': ['2.2'],  # 插入排序
    }
    
    return prereqs.get(section_id, [])

def get_related_sections(section_id, all_sections):
    """获取相关知识点"""
    related_map = {
        '2.2': ['7.2', '8.2'],  # 顺序表与查找、排序相关
        '2.3': ['3.2', '3.5'],  # 链表与栈、队列相关
        '3.1': ['3.3'],  # 栈概念与应用
        '3.4': ['3.6'],  # 队列与双端队列
        '5.2': ['7.3', '5.7'],  # 二叉树与BST、哈夫曼树
        '5.4': ['6.3'],  # 树遍历与图遍历
        '6.2': ['2.2', '2.3'],  # 图的存储
        '7.3': ['5.2', '5.4'],  # BST与二叉树
        '7.5': ['4.3'],  # 散列表与数组
        '8.1': ['1.2'],  # 排序需要算法分析
        '8.6': ['8.2', '8.3', '8.4', '8.5'],  # 排序比较
    }
    
    return related_map.get(section_id, [])

def add_links_to_file(filepath, links_content):
    """在文件末尾添加链接"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 如果已经有"##  相关链接"部分，先删除
    content = re.sub(r'\n## 🔗 相关链接\n.*$', '', content, flags=re.DOTALL)
    content = re.sub(r'\n---\n\n📖.*$', '', content, flags=re.DOTALL)
    
    # 添加新的链接部分
    content = content.rstrip() + '\n\n' + links_content + '\n'
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    base_dir = r"D:\yang'zhen'ning\Documents\我的obsidian库\YangYang\408数据结构"
    
    print("=" * 60)
    print("为408数据结构知识点添加内部链接")
    print("=" * 60)
    print()
    
    # 获取所有文件
    md_files = get_all_md_files(base_dir)
    print(f" 找到 {len(md_files)} 个知识点文件")
    print()
    
    # 提取所有知识点信息
    all_sections = []
    for filepath in md_files:
        info = extract_section_info(filepath)
        all_sections.append(info)
    
    print(f"📊 解析了 {len(all_sections)} 个知识点")
    print()
    
    # 为每个文件添加链接
    updated_count = 0
    for section_info in all_sections:
        try:
            links = generate_links(section_info, all_sections)
            add_links_to_file(section_info['filepath'], links)
            updated_count += 1
            print(f"✅ {section_info['section_id']} {section_info['filename']}")
        except Exception as e:
            print(f"❌ {section_info['section_id']} - 错误: {e}")
    
    print()
    print("=" * 60)
    print(f"✅ 完成！更新了 {updated_count} 个文件")
    print("=" * 60)
    print()
    print("💡 现在请在Obsidian中刷新，查看更新后的关系图谱！")

if __name__ == "__main__":
    main()

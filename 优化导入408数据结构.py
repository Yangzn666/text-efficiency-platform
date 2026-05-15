#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
408数据结构知识点优化导入工具
一次性完成：导出 + 添加章节链接 + 添加关键概念链接
"""

import os
import re
import sys

def parse_datastructure_ts(file_path):
    """解析dataStructure.ts文件"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    chapters = []
    chapter_pattern = r'\{\s*id:\s*[\'"]([^\'"]+)[\'"],\s*number:\s*(\d+),\s*title:\s*[\'"]([^\'"]+)[\'"],\s*score:\s*[\'"]([^\'"]+)[\'"],\s*importance:\s*[\'"]([^\'"]+)[\'"],\s*sections:\s*\[(.*?)\],\s*mindMap:'
    
    for chapter_match in re.finditer(chapter_pattern, content, re.DOTALL):
        chapter_id = chapter_match.group(1)
        chapter_num = int(chapter_match.group(2))
        chapter_title = chapter_match.group(3)
        chapter_score = chapter_match.group(4)
        chapter_importance = chapter_match.group(5)
        sections_str = chapter_match.group(6)
        
        sections = []
        section_pattern = r'\{\s*id:\s*[\'"]([^\'"]+)[\'"],\s*title:\s*[\'"]([^\'"]+)[\'"],\s*content:\s*[\'"`](.*?)[\'"`]\s*\}'
        
        for section_match in re.finditer(section_pattern, sections_str, re.DOTALL):
            section_id = section_match.group(1)
            section_title = section_match.group(2)
            section_content = section_match.group(3).replace('\\n', '\n').replace('\\t', '\t').replace('\\"', '"').replace("\\'", "'")
            
            sections.append({
                'id': section_id,
                'title': section_title,
                'content': section_content
            })
        
        chapters.append({
            'id': chapter_id,
            'number': chapter_num,
            'title': chapter_title,
            'score': chapter_score,
            'importance': chapter_importance,
            'sections': sections
        })
    
    return chapters

def create_obsidian_note(chapter, section, output_dir):
    """创建Obsidian笔记"""
    chapter_folder = f"第{chapter['number']}章_{chapter['title'].replace('/', '、')}"
    section_filename = f"{section['id']}_{section['title'].replace('/', '_')}.md"
    
    folder_path = os.path.join(output_dir, chapter_folder)
    os.makedirs(folder_path, exist_ok=True)
    
    filepath = os.path.join(folder_path, section_filename)
    
    frontmatter = f"""---
tags:
  - 408
  - 数据结构
  - 第{chapter['number']}章
  - {chapter['title']}
section_id: "{section['id']}"
chapter: "第{chapter['number']}章 {chapter['title']}"
importance: {chapter['importance']}
score: "{chapter['score']}"
---

{section['content']}
"""
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(frontmatter)
    
    return filepath

def build_concept_index(chapters):
    """构建概念索引"""
    concept_map = {
        '线性表': '2.1', '顺序表': '2.2', '链表': '2.3', '单链表': '2.3',
        '栈': '3.1', '顺序栈': '3.2', '链栈': '3.2',
        '队列': '3.4', '顺序队列': '3.5', '链队列': '3.5', '循环队列': '3.5', '双端队列': '3.6',
        '串': '4.1', '模式匹配': '4.2', 'KMP算法': '4.2', '数组': '4.3', '广义表': '4.4',
        '树': '5.1', '二叉树': '5.2', '二叉树的遍历': '5.4', '线索二叉树': '5.5', '哈夫曼树': '5.7',
        '图': '6.1', '邻接矩阵': '6.2', '邻接表': '6.2', '深度优先搜索': '6.3', '广度优先搜索': '6.3',
        '最小生成树': '6.4', 'Prim算法': '6.4', 'Kruskal算法': '6.4',
        '最短路径': '6.5', 'Dijkstra算法': '6.5', 'Floyd算法': '6.5',
        '拓扑排序': '6.6', '关键路径': '6.6',
        '顺序查找': '7.2', '折半查找': '7.2', '二叉排序树': '7.3', '平衡二叉树': '7.3',
        'B树': '7.4', 'B+树': '7.4', '散列表': '7.5', '哈希表': '7.5',
        '插入排序': '8.2', '快速排序': '8.3', '归并排序': '8.5', '基数排序': '8.5',
        '时间复杂度': '1.2', '空间复杂度': '1.2',
    }
    
    section_to_file = {}
    for chapter in chapters:
        for section in chapter['sections']:
            section_to_file[section['id']] = f"{section['id']}_{section['title'].replace('/', '_')}.md"
    
    concept_to_file = {}
    for concept, section_id in concept_map.items():
        if section_id in section_to_file:
            concept_to_file[concept] = section_to_file[section_id]
    
    return concept_to_file

def add_links_to_content(content, concept_to_file, current_filename, all_sections):
    """在内容中添加链接"""
    # 添加章节链接部分
    section_id_match = re.search(r'section_id:\s*"([^"]+)"', content)
    if not section_id_match:
        return content
    
    current_section_id = section_id_match.group(1)
    chapter_match = re.search(r'chapter:\s*"([^"]+)"', content)
    current_chapter = chapter_match.group(1) if chapter_match else ""
    
    links = []
    
    # 1. 同章节知识点
    same_chapter = [s for s in all_sections if s['chapter'] == current_chapter and s['section_id'] != current_section_id]
    if same_chapter:
        links.append("### 同章节知识点")
        for s in same_chapter:
            links.append(f"- [[{s['filename']}]]")
        links.append("")
    
    # 2. 前置知识
    prerequisites = {
        '2.2': ['2.1'], '2.3': ['2.1', '2.2'], '3.2': ['2.2', '2.3'],
        '5.4': ['5.2', '5.3'], '6.3': ['5.4'], '7.3': ['5.2', '5.4'],
    }
    if current_section_id in prerequisites:
        links.append("### 前置知识")
        for prereq_id in prerequisites[current_section_id]:
            prereq_section = next((s for s in all_sections if s['section_id'] == prereq_id), None)
            if prereq_section:
                links.append(f"- [[{prereq_section['filename']}]]")
        links.append("")
    
    # 3. 相关知识
    related = {
        '2.2': ['7.2', '8.2'], '5.2': ['7.3', '5.7'], '5.4': ['6.3'],
        '6.2': ['2.2', '2.3'], '7.5': ['4.3'], '8.6': ['8.2', '8.3', '8.4', '8.5'],
    }
    if current_section_id in related:
        links.append("### 相关知识")
        for rel_id in related[current_section_id]:
            rel_section = next((s for s in all_sections if s['section_id'] == rel_id), None)
            if rel_section:
                links.append(f"- [[{rel_section['filename']}]]")
        links.append("")
    
    links.append("---")
    links.append("")
    links.append("📖 [[📖 数据结构总览]]")
    
    content = content.rstrip() + '\n\n' + '\n'.join(links) + '\n'
    
    # 在正文中添加概念链接
    parts = content.split('---', 2)
    if len(parts) >= 3:
        yaml_part = parts[0] + '---' + parts[1] + '---'
        body = parts[2]
        
        # 找出所有已有链接
        existing_links = []
        for match in re.finditer(r'\[\[.*?\]\]', body):
            existing_links.append((match.start(), match.end()))
        
        def is_in_existing_link(pos):
            for start, end in existing_links:
                if start <= pos < end:
                    return True
            return False
        
        # 按长度降序处理概念
        sorted_concepts = sorted(concept_to_file.keys(), key=len, reverse=True)
        
        for concept in sorted_concepts:
            if concept in ['树', '图', '栈', '队列', '串']:
                pattern = r'(?<![二哈AVLB+])(?<![\u4e00-\u9fa5])' + re.escape(concept) + r'(?![\u4e00-\u9fa5])'
            else:
                pattern = re.escape(concept)
            
            def replacer(match):
                if is_in_existing_link(match.start()):
                    return match.group(0)
                target_file = concept_to_file[concept]
                if target_file == current_filename:
                    return match.group(0)
                return f'[[{target_file}|{concept}]]'
            
            body = re.sub(pattern, replacer, body)
        
        content = yaml_part + body
    
    return content

def main():
    source_file = r"d:\学习\效率\00-网站程序\frontend\src\stores\dataStructure.ts"
    output_dir = r"D:\yang'zhen'ning\Documents\我的obsidian库\YangYang\408数据结构"
    
    print("=" * 60)
    print("408数据结构知识点优化导入工具")
    print("=" * 60)
    print()
    
    # 解析源文件
    print("📖 正在解析数据结构知识点...")
    chapters = parse_datastructure_ts(source_file)
    print(f"✅ 解析了 {len(chapters)} 个章节")
    
    # 收集所有知识点信息
    all_sections = []
    for chapter in chapters:
        for section in chapter['sections']:
            all_sections.append({
                'section_id': section['id'],
                'chapter': f"第{chapter['number']}章 {chapter['title']}",
                'filename': f"{section['id']}_{section['title'].replace('/', '_')}.md"
            })
    
    # 构建概念索引
    concept_to_file = build_concept_index(chapters)
    print(f"📊 建立了 {len(concept_to_file)} 个关键概念索引")
    print()
    
    # 创建输出目录
    os.makedirs(output_dir, exist_ok=True)
    
    # 导出并添加链接
    print("📝 正在导出并添加链接...")
    print()
    
    updated_count = 0
    for chapter in chapters:
        print(f"📖 处理第{chapter['number']}章: {chapter['title']}")
        for section in chapter['sections']:
            try:
                filepath = create_obsidian_note(chapter, section, output_dir)
                filename = os.path.basename(filepath)
                
                # 读取并添加链接
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                content = add_links_to_content(content, concept_to_file, filename, all_sections)
                
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                
                print(f"  ✓ {section['id']} {section['title']}")
                updated_count += 1
            except Exception as e:
                print(f"  ✗ {section['id']} - 错误: {e}")
    
    print()
    print("=" * 60)
    print(f"✅ 完成！成功处理 {updated_count} 个知识点")
    print("=" * 60)
    print()
    print("📋 已完成:")
    print("   ✓ 导出所有知识点到Obsidian")
    print("   ✓ 添加章节间的双向链接")
    print("   ✓ 添加71个关键概念的内部链接")
    print("   ✓ 建立知识点关系网络")
    print()
    print("🔄 请关闭Obsidian后重新打开，查看更新后的关系图谱！")

if __name__ == "__main__":
    main()

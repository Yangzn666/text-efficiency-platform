#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
为408数据结构知识点添加正文中的关键概念双向链接
将重要概念（如"线性表"、"顺序表"、"链表"、"栈"等）在正文中添加超链接
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
    
    match = re.search(r'section_id:\s*"([^"]+)"', content)
    section_id = match.group(1) if match else ""
    
    match = re.search(r'chapter:\s*"([^"]+)"', content)
    chapter = match.group(1) if match else ""
    
    return {
        'filepath': filepath,
        'section_id': section_id,
        'chapter': chapter,
        'filename': os.path.basename(filepath)
    }

def build_concept_index(all_sections):
    """构建概念索引：概念名 -> 对应的知识点文件"""
    concept_map = {
        # 第2章概念
        '线性表': '2.1',
        '顺序表': '2.2',
        '链表': '2.3',
        '单链表': '2.3',
        '双链表': '2.3',
        '循环链表': '2.3',
        '静态链表': '2.3',
        
        # 第3章概念
        '栈': '3.1',
        '栈顶': '3.1',
        '栈底': '3.1',
        '顺序栈': '3.2',
        '链栈': '3.2',
        '队列': '3.4',
        '顺序队列': '3.5',
        '链队列': '3.5',
        '循环队列': '3.5',
        '双端队列': '3.6',
        
        # 第4章概念
        '串': '4.1',
        '字符串': '4.1',
        '模式匹配': '4.2',
        'KMP算法': '4.2',
        '数组': '4.3',
        '广义表': '4.4',
        
        # 第5章概念
        '树': '5.1',
        '二叉树': '5.2',
        '二叉树的遍历': '5.4',
        '先序遍历': '5.4',
        '中序遍历': '5.4',
        '后序遍历': '5.4',
        '层序遍历': '5.4',
        '线索二叉树': '5.5',
        '哈夫曼树': '5.7',
        '哈夫曼编码': '5.7',
        
        # 第6章概念
        '图': '6.1',
        '有向图': '6.1',
        '无向图': '6.1',
        '邻接矩阵': '6.2',
        '邻接表': '6.2',
        '图的遍历': '6.3',
        '深度优先搜索': '6.3',
        '广度优先搜索': '6.3',
        '最小生成树': '6.4',
        'Prim算法': '6.4',
        'Kruskal算法': '6.4',
        '最短路径': '6.5',
        'Dijkstra算法': '6.5',
        'Floyd算法': '6.5',
        '拓扑排序': '6.6',
        '关键路径': '6.6',
        
        # 第7章概念
        '顺序查找': '7.2',
        '折半查找': '7.2',
        '二分查找': '7.2',
        '二叉排序树': '7.3',
        'BST': '7.3',
        '平衡二叉树': '7.3',
        'AVL树': '7.3',
        'B树': '7.4',
        'B+树': '7.4',
        '散列表': '7.5',
        '哈希表': '7.5',
        
        # 第8章概念
        '插入排序': '8.2',
        '希尔排序': '8.2',
        '冒泡排序': '8.3',
        '快速排序': '8.3',
        '简单选择排序': '8.4',
        '堆排序': '8.4',
        '归并排序': '8.5',
        '基数排序': '8.5',
        
        # 算法基础
        '时间复杂度': '1.2',
        '空间复杂度': '1.2',
        '算法': '1.2',
    }
    
    # 根据section_id找到对应的文件
    concept_to_file = {}
    for concept, section_id in concept_map.items():
        for section in all_sections:
            if section['section_id'] == section_id:
                concept_to_file[concept] = section['filename']
                break
    
    return concept_to_file

def add_concept_links(content, concept_to_file, current_filename):
    """在正文中添加概念链接"""
    # 按概念长度降序排列，优先匹配长概念
    sorted_concepts = sorted(concept_to_file.keys(), key=len, reverse=True)
    
    # 先找出所有已有的[[...]]链接区域，避免在这些区域内替换
    existing_links = []
    for match in re.finditer(r'\[\[.*?\]\]', content):
        existing_links.append((match.start(), match.end()))
    
    def is_in_existing_link(pos):
        """检查位置是否在已有的链接内"""
        for start, end in existing_links:
            if start <= pos < end:
                return True
        return False
    
    for concept in sorted_concepts:
        if concept in ['树', '图', '栈', '队列', '串']:
            # 单字概念需要更严格的匹配，避免误替换
            pattern = r'(?<![二哈AVLB+])(?<![\u4e00-\u9fa5])' + re.escape(concept) + r'(?![\u4e00-\u9fa5])'
        else:
            pattern = re.escape(concept)
        
        # 使用回调函数检查是否在已有链接内
        def replacer(match):
            # 检查匹配位置是否在已有链接内
            if is_in_existing_link(match.start()):
                return match.group(0)
            
            target_file = concept_to_file[concept]
            if target_file == current_filename:
                # 如果是当前文件，不添加链接
                return match.group(0)
            
            return f'[[{target_file}|{concept}]]'
        
        content = re.sub(pattern, replacer, content)
    
    return content

def add_links_to_file(filepath, concept_to_file):
    """为文件添加概念链接"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    filename = os.path.basename(filepath)
    
    # 删除已有的"## 🔗 关键概念链接"部分（如果有）
    content = re.sub(r'\n## 🔗 关键概念链接\n.*$', '', content, flags=re.DOTALL)
    
    # 只在正文部分添加链接（跳过YAML frontmatter）
    parts = content.split('---', 2)
    if len(parts) >= 3:
        yaml_front = parts[0] + '---' + parts[1] + '---'
        body = parts[2]
        
        # 在正文中添加概念链接
        body = add_concept_links(body, concept_to_file, filename)
        
        content = yaml_front + body
    else:
        content = add_concept_links(content, concept_to_file, filename)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    base_dir = r"D:\yang'zhen'ning\Documents\我的obsidian库\YangYang\408数据结构"
    
    print("=" * 60)
    print("为408数据结构知识点添加关键概念双向链接")
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
    
    # 构建概念索引
    concept_to_file = build_concept_index(all_sections)
    print(f"📊 建立了 {len(concept_to_file)} 个关键概念的索引")
    print()
    
    # 为每个文件添加概念链接
    updated_count = 0
    for section_info in all_sections:
        try:
            add_links_to_file(section_info['filepath'], concept_to_file)
            updated_count += 1
            print(f"✅ {section_info['section_id']} {section_info['filename']}")
        except Exception as e:
            print(f"❌ {section_info['section_id']} - 错误: {e}")
    
    print()
    print("=" * 60)
    print(f"✅ 完成！更新了 {updated_count} 个文件")
    print("=" * 60)
    print()
    print(" 关键改进：")
    print("   - 正文中的重要概念现在有超链接")
    print("   - 例如：提到'二叉树'时会自动链接到5.2章节")
    print("   - 例如：提到'快速排序'时会自动链接到8.3章节")
    print()
    print("🔄 现在请在Obsidian中刷新，查看效果！")

if __name__ == "__main__":
    main()

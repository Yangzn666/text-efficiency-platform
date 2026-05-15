#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
修复408数据结构知识点的嵌套链接问题
清理所有错误的嵌套链接，然后正确添加概念链接
"""

import os
import re

def fix_nested_links(content):
    """修复嵌套链接：[[file1[[file2|text]].md|...]] -> [[file2|text]]"""
    # 检测是否有嵌套链接
    while re.search(r'\[\[.*?\[\[.*?\]\].*?\]\]', content):
        # 找到最内层的[[...]]
        content = re.sub(r'\[\[(.*?)\[\[(.*?)\|(.*?)\]\](.*?)\]\]', r'[[\2|\3]]', content)
    return content

def clean_content(filepath):
    """清理文件中的嵌套链接"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 修复嵌套链接
    content = fix_nested_links(content)
    
    # 删除重复的链接部分
    # 保留最后一个"### 同章节知识点"到文件末尾的内容
    sections_pattern = r'(### 同章节知识点.*?)(?=\n### 同章节知识点|\n---\n\n)'
    sections = list(re.finditer(sections_pattern, content, re.DOTALL))
    
    if len(sections) > 1:
        # 有多个重复的部分，只保留最后一个
        last_section = sections[-1]
        before = content[:sections[0].start()]
        after = content[last_section.end():]
        content = before + last_section.group(1) + after
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return content

def main():
    base_dir = r"D:\yang'zhen'ning\Documents\我的obsidian库\YangYang\408数据结构"
    
    print("=" * 60)
    print("修复408数据结构知识点链接问题")
    print("=" * 60)
    print()
    
    # 获取所有md文件
    md_files = []
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith('.md') and not file.startswith('📖') and file != 'README-使用指南.md':
                md_files.append(os.path.join(root, file))
    
    print(f"📂 找到 {len(md_files)} 个文件")
    print()
    
    # 修复每个文件
    fixed_count = 0
    for filepath in md_files:
        try:
            clean_content(filepath)
            filename = os.path.basename(filepath)
            print(f"✅ {filename}")
            fixed_count += 1
        except Exception as e:
            print(f"❌ {os.path.basename(filepath)} - {e}")
    
    print()
    print("=" * 60)
    print(f"✅ 修复完成！处理了 {fixed_count} 个文件")
    print("=" * 60)
    print()
    print("🔄 现在请关闭Obsidian后重新打开，查看修复后的效果！")

if __name__ == "__main__":
    main()

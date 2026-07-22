#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
将408数据结构知识点导出为Obsidian格式的Markdown文件
"""

import re
import os
from pathlib import Path

def parse_datastructure_ts(file_path):
    """
    解析dataStructure.ts文件，提取章节和小节数据
    """
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    chapters = []
    
    # 匹配章节定义
    chapter_pattern = r'\{\s*id:\s*[\'"]([^\'"]+)[\'"],\s*number:\s*(\d+),\s*title:\s*[\'"]([^\'"]+)[\'"],\s*score:\s*[\'"]([^\'"]+)[\'"],\s*importance:\s*[\'"]([^\'"]+)[\'"],'
    
    chapter_matches = list(re.finditer(chapter_pattern, content))
    
    for i, chapter_match in enumerate(chapter_matches):
        chapter_id = chapter_match.group(1)
        chapter_number = int(chapter_match.group(2))
        chapter_title = chapter_match.group(3)
        chapter_score = chapter_match.group(4)
        chapter_importance = chapter_match.group(5)
        
        # 找到当前章节的sections范围
        start_pos = chapter_match.end()
        end_pos = chapter_matches[i + 1].start() if i + 1 < len(chapter_matches) else len(content)
        chapter_content = content[start_pos:end_pos]
        
        # 提取该章节的所有小节
        sections = []
        section_pattern = r'\{\s*id:\s*[\'"](\d+\.\d+)[\'"],\s*title:\s*[\'"]([^\'"]+)[\'"],\s*content:\s*[\'"`]((?:[^\'"`]|\\.)*)[\'"`]\s*\}'
        
        # 使用更宽松的模式匹配content（因为content可能包含多行）
        section_start_pattern = r'\{\s*id:\s*[\'"](\d+\.\d+)[\'"],\s*title:\s*[\'"]([^\'"]+)[\'"],\s*content:\s*[\'"`]'
        
        section_starts = list(re.finditer(section_start_pattern, chapter_content))
        
        for j, section_start in enumerate(section_starts):
            section_id = section_start.group(1)
            section_title = section_start.group(2)
            
            # 找到content的开始位置
            content_start = section_start.end()
            
            # 找到下一个section或章节结束的位置
            if j + 1 < len(section_starts):
                content_end = section_starts[j + 1].start()
            else:
                # 查找章节结束标志
                next_chapter = re.search(r'\},\s*\{', chapter_content[content_start:])
                if next_chapter:
                    content_end = content_start + next_chapter.start()
                else:
                    content_end = len(chapter_content)
            
            # 提取content内容
            raw_content = chapter_content[content_start:content_end].strip()
            
            # 清理content（去除末尾的引号和逗号）
            raw_content = re.sub(r'[\'"`]\s*[,}]?\s*$', '', raw_content)
            
            # 处理转义字符
            section_content = process_content(raw_content)
            
            sections.append({
                'id': section_id,
                'title': section_title,
                'content': section_content
            })
        
        chapters.append({
            'id': chapter_id,
            'number': chapter_number,
            'title': chapter_title,
            'score': chapter_score,
            'importance': chapter_importance,
            'sections': sections
        })
    
    return chapters


def process_content(content):
    """
    处理内容字符串，清理转义字符和多余空格
    """
    # 去除首尾空白
    content = content.strip()
    
    # 处理常见的转义字符
    content = content.replace('\\n', '\n')
    content = content.replace('\\t', '\t')
    content = content.replace('\\"', '"')
    content = content.replace("\\'", "'")
    content = content.replace('\\\\', '\\')
    
    # 去除模板字符串的反引号
    if content.startswith('`'):
        content = content[1:]
    if content.endswith('`'):
        content = content[:-1]
    
    return content


def create_obsidian_note(chapter, section, output_dir):
    """
    创建单个Obsidian笔记文件
    """
    # 创建章节目录
    chapter_dir = os.path.join(output_dir, f"第{chapter['number']}章_{chapter['title']}")
    os.makedirs(chapter_dir, exist_ok=True)
    
    # 生成文件名
    filename = f"{section['id']}_{section['title']}.md"
    filepath = os.path.join(chapter_dir, filename)
    
    # 生成YAML frontmatter
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

"""
    
    # 生成笔记内容
    note_content = frontmatter
    note_content += section['content']
    
    # 添加思维导图（如果有）
    if 'mindMap' in chapter and chapter['mindMap']:
        note_content += f"\n\n## 思维导图\n\n```mermaid\n{chapter['mindMap']}\n```\n"
    
    # 写入文件
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(note_content)
    
    return filepath


def create_index_file(chapters, output_dir):
    """
    创建索引文件，包含所有章节的链接
    """
    index_content = """# 408数据结构知识点总览

> 本知识库包含408计算机专业课《数据结构》的全部知识点，按照王道考研教材的8章结构组织。

## 📚 章节目录

"""
    
    for chapter in chapters:
        index_content += f"### 第{chapter['number']}章 {chapter['title']} ({chapter['score']})\n\n"
        
        for section in chapter['sections']:
            # 生成相对路径链接
            link_path = f"第{chapter['number']}章_{chapter['title']}/{section['id']}_{section['title']}.md"
            index_content += f"- [[{link_path}|{section['id']} {section['title']}]]\n"
        
        index_content += "\n"
    
    # 添加标签统计
    index_content += """
## 🏷️ 标签说明

- `408`: 408计算机专业课
- `数据结构`: 数据结构科目
- `第X章`: 章节分类
- 重要性标记: high(高)、medium(中)、low(低)

## 💡 使用建议

1. 按照章节顺序系统学习
2. 利用双向链接建立知识关联
3. 使用Dataview插件进行知识点查询和统计
4. 定期复习标注为重点的内容

---
*最后更新: 自动生成*
"""
    
    index_path = os.path.join(output_dir, "📖 数据结构总览.md")
    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(index_content)
    
    return index_path


def main():
    """
    主函数：执行导出流程
    """
    print("=" * 60)
    print("408数据结构知识点导出工具")
    print("=" * 60)
    
    # 配置路径
    ts_file = r"d:\学习\效率\00-网站程序\frontend\src\stores\dataStructure.ts"
    obsidian_base = r"D:\Obsidian"
    output_dir = os.path.join(obsidian_base, "408-数据结构")
    
    # 检查源文件是否存在
    if not os.path.exists(ts_file):
        print(f"❌ 错误：找不到源文件 {ts_file}")
        return
    
    print(f"📂 源文件: {ts_file}")
    print(f"📁 输出目录: {output_dir}")
    print()
    
    # 创建输出目录
    os.makedirs(output_dir, exist_ok=True)
    
    # 解析TypeScript文件
    print("⏳ 正在解析数据结构知识点...")
    try:
        chapters = parse_datastructure_ts(ts_file)
        print(f"✅ 成功解析 {len(chapters)} 个章节")
    except Exception as e:
        print(f"❌ 解析失败: {e}")
        import traceback
        traceback.print_exc()
        return
    
    # 统计信息
    total_sections = sum(len(ch['sections']) for ch in chapters)
    print(f"📊 共 {total_sections} 个小节")
    print()
    
    # 导出每个小节
    print("⏳ 正在导出知识点...")
    exported_count = 0
    
    for chapter in chapters:
        print(f"\n📖 处理第{chapter['number']}章: {chapter['title']}")
        
        for section in chapter['sections']:
            try:
                filepath = create_obsidian_note(chapter, section, output_dir)
                exported_count += 1
                print(f"  ✓ {section['id']} {section['title']}")
            except Exception as e:
                print(f"  ✗ {section['id']} {section['title']} - 错误: {e}")
    
    print()
    
    # 创建索引文件
    print("⏳ 正在创建索引文件...")
    try:
        index_path = create_index_file(chapters, output_dir)
        print(f"✅ 索引文件已创建: {index_path}")
    except Exception as e:
        print(f"⚠️  索引文件创建失败: {e}")
    
    # 输出总结
    print()
    print("=" * 60)
    print("✅ 导出完成！")
    print("=" * 60)
    print(f"📊 导出统计:")
    print(f"   - 章节数: {len(chapters)}")
    print(f"   - 知识点数: {exported_count}")
    print(f"   - 输出目录: {output_dir}")
    print()
    print("💡 下一步操作:")
    print(f"   1. 在Obsidian中打开文件夹: {output_dir}")
    print(f"   2. 阅读索引文件: 📖 数据结构总览.md")
    print(f"   3. 根据需要调整标签和链接")
    print("=" * 60)


if __name__ == "__main__":
    main()

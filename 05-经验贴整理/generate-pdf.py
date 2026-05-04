#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
11408考研经验贴 Markdown转PDF工具
使用WeasyPrint生成美观的PDF文档
"""

import os
import markdown
from weasyprint import HTML, CSS
from pathlib import Path

# 配置
BASE_DIR = Path(__file__).parent
OUTPUT_DIR = BASE_DIR / 'PDF输出'

# 要转换的文件列表
FILES_TO_CONVERT = [
    {
        'input': '分析与总结/按科目汇总/数学一备考终极精炼指南.md',
        'output': '数学一备考终极精炼指南.pdf',
        'title': '数学一备考终极精炼指南',
        'subtitle': '基于37篇11408高分经验贴深度提炼 | 目标分数: 130-150分'
    },
    {
        'input': '分析与总结/按科目汇总/英语一备考终极精炼指南.md',
        'output': '英语一备考终极精炼指南.pdf',
        'title': '英语一备考终极精炼指南',
        'subtitle': '基于37篇11408高分经验贴深度提炼 | 目标分数: 70-90分'
    },
    {
        'input': '分析与总结/按科目汇总/政治备考终极精炼指南.md',
        'output': '政治备考终极精炼指南.pdf',
        'title': '政治备考终极精炼指南',
        'subtitle': '基于37篇11408高分经验贴深度提炼 | 目标分数: 70-85分'
    },
    {
        'input': '分析与总结/按科目汇总/408专业课备考终极精炼指南.md',
        'output': '408专业课备考终极精炼指南.pdf',
        'title': '408专业课备考终极精炼指南',
        'subtitle': '基于37篇11408高分经验贴深度提炼 | 目标分数: 120-140分'
    },
    {
        'input': '分析与总结/11408考研综合建议指南.md',
        'output': '11408考研综合建议指南.pdf',
        'title': '11408考研综合建议指南',
        'subtitle': '心态调整 + 学习工具 + 资源推荐 + 学习社群'
    }
]

# CSS样式
CSS_STYLE = """
@page {
    size: A4;
    margin: 20mm;
}

body {
    font-family: "Microsoft YaHei", "SimSun", sans-serif;
    font-size: 14px;
    line-height: 1.8;
    color: #2c3e50;
}

h1 {
    font-family: "Microsoft YaHei", "SimSun", serif;
    font-size: 28px;
    font-weight: bold;
    color: #1a1a1a;
    border-bottom: 3px solid #3498db;
    padding-bottom: 15px;
    margin-bottom: 20px;
}

h2 {
    font-family: "Microsoft YaHei", "SimSun", serif;
    font-size: 22px;
    font-weight: bold;
    color: #2c3e50;
    border-left: 4px solid #3498db;
    padding-left: 15px;
    margin-top: 35px;
    margin-bottom: 15px;
}

h3 {
    font-size: 18px;
    font-weight: bold;
    color: #34495e;
    margin-top: 25px;
    margin-bottom: 12px;
}

h4 {
    font-size: 16px;
    font-weight: bold;
    color: #555;
    margin-top: 20px;
    margin-bottom: 10px;
}

p {
    margin-bottom: 12px;
    text-align: justify;
}

ul, ol {
    margin-left: 25px;
    margin-bottom: 15px;
}

li {
    margin-bottom: 8px;
}

blockquote {
    background: #f8f9fa;
    border-left: 4px solid #3498db;
    padding: 15px 20px;
    margin: 20px 0;
    font-style: italic;
    color: #555;
}

pre {
    background: #f5f5f5;
    padding: 15px;
    border-radius: 5px;
    overflow-x: auto;
    margin: 15px 0;
    border: 1px solid #e0e0e0;
    font-family: "Consolas", "Monaco", monospace;
    font-size: 13px;
}

code {
    font-family: "Consolas", "Monaco", monospace;
    font-size: 13px;
    background: #f5f5f5;
    padding: 2px 6px;
    border-radius: 3px;
    color: #e74c3c;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 13px;
}

th {
    background: #3498db;
    color: white;
    padding: 12px;
    text-align: left;
    font-weight: bold;
}

td {
    padding: 10px 12px;
    border: 1px solid #ddd;
}

tr:nth-child(even) {
    background: #f8f9fa;
}

strong {
    font-weight: bold;
    color: #2c3e50;
}

em {
    font-style: italic;
    color: #555;
}

a {
    color: #3498db;
    text-decoration: none;
}

hr {
    border: none;
    border-top: 2px solid #ecf0f1;
    margin: 30px 0;
}

.header-info {
    text-align: center;
    color: #7f8c8d;
    font-size: 12px;
    margin-bottom: 30px;
    padding-bottom: 15px;
    border-bottom: 1px solid #ecf0f1;
}
"""

def convert_markdown_to_pdf(file_config):
    """转换单个Markdown文件为PDF"""
    input_path = BASE_DIR / file_config['input']
    output_path = OUTPUT_DIR / file_config['output']
    
    print(f"\n📄 开始转换: {file_config['title']}")
    print(f"   输入: {input_path}")
    print(f"   输出: {output_path}")
    
    # 检查文件是否存在
    if not input_path.exists():
        print(f"   ❌ 文件不存在: {input_path}")
        return False
    
    try:
        # 读取Markdown内容
        with open(input_path, 'r', encoding='utf-8') as f:
            md_content = f.read()
        
        # 转换为HTML
        html_body = markdown.markdown(
            md_content,
            extensions=['tables', 'fenced_code', 'codehilite']
        )
        
        # 构建完整HTML
        html_content = f"""
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
            <meta charset="UTF-8">
            <title>{file_config['title']}</title>
        </head>
        <body>
            <div class="header-info">
                {file_config['subtitle']}
            </div>
            {html_body}
        </body>
        </html>
        """
        
        # 生成PDF
        HTML(string=html_content).write_pdf(
            str(output_path),
            stylesheets=[CSS(string=CSS_STYLE)]
        )
        
        # 获取文件大小
        file_size = output_path.stat().st_size / 1024
        
        print(f"   ✅ 转换成功!")
        print(f"   📊 文件大小: {file_size:.2f} KB")
        
        return True
        
    except Exception as e:
        print(f"   ❌ 转换失败: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """主函数"""
    print("🚀 开始批量转换Markdown为PDF...\n")
    print("=" * 60)
    
    # 确保输出目录存在
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    success_count = 0
    fail_count = 0
    
    for file_config in FILES_TO_CONVERT:
        success = convert_markdown_to_pdf(file_config)
        if success:
            success_count += 1
        else:
            fail_count += 1
    
    print("\n" + "=" * 60)
    print(f"\n🎉 转换完成!")
    print(f"   ✅ 成功: {success_count} 个文件")
    print(f"   ❌ 失败: {fail_count} 个文件")
    print(f"   📁 输出目录: {OUTPUT_DIR}")
    print("\n💡 提示: PDF文件已保存到 'PDF输出' 文件夹\n")

if __name__ == '__main__':
    main()

"""
PDF转换工具 - 将武忠祥讲义转换为更易处理的格式
支持转换为: Word (.docx), HTML, Markdown
"""

import os
import sys

def check_dependencies():
    """检查并提示安装依赖"""
    dependencies = {
        'pdf2docx': '用于PDF转Word',
        'pdfplumber': '用于PDF文本提取',
        'Pillow': '用于图片处理'
    }
    
    missing = []
    for package, desc in dependencies.items():
        try:
            __import__(package.replace('-', '_'))
        except ImportError:
            missing.append((package, desc))
    
    if missing:
        print("需要安装以下依赖:")
        for pkg, desc in missing:
            print(f"  - {pkg} ({desc})")
        
        response = input("\n是否自动安装? (y/n): ").strip().lower()
        if response == 'y':
            for pkg, _ in missing:
                print(f"\n正在安装 {pkg}...")
                os.system(f"pip install {pkg}")
            return True
        else:
            return False
    return True

def convert_pdf_to_word(pdf_path, output_path):
    """使用pdf2docx将PDF转换为Word"""
    try:
        from pdf2docx import Converter
        
        print(f"正在转换: {os.path.basename(pdf_path)}")
        cv = Converter(pdf_path)
        cv.convert(output_path, start=0, end=None)
        cv.close()
        
        print(f"✓ 转换成功: {output_path}")
        return True
    except Exception as e:
        print(f"✗ 转换失败: {e}")
        return False

def convert_pdf_to_html(pdf_path, output_path):
    """将PDF转换为HTML（保留更多格式）"""
    try:
        import pdfplumber
        
        print(f"正在提取HTML: {os.path.basename(pdf_path)}")
        
        html_content = []
        html_content.append('<!DOCTYPE html>')
        html_content.append('<html><head><meta charset="utf-8">')
        html_content.append('<style>')
        html_content.append('body { font-family: "Microsoft YaHei", Arial; line-height: 1.8; padding: 20px; }')
        html_content.append('.page { margin-bottom: 30px; border-bottom: 2px solid #eee; padding-bottom: 20px; }')
        html_content.append('.page-number { color: #999; font-size: 12px; margin-bottom: 10px; }')
        html_content.append('.formula { background: #f5f5f5; padding: 10px; margin: 10px 0; border-left: 3px solid #4CAF50; }')
        html_content.append('</style></head><body>')
        
        with pdfplumber.open(pdf_path) as pdf:
            for page_num, page in enumerate(pdf.pages, 1):
                text = page.extract_text()
                
                html_content.append(f'<div class="page">')
                html_content.append(f'<div class="page-number">第 {page_num} 页</div>')
                
                if text:
                    # 简单处理文本，尝试识别公式
                    lines = text.split('\n')
                    for line in lines:
                        line = line.strip()
                        if not line:
                            continue
                        
                        # 检测可能的公式行（包含特殊字符较多）
                        special_chars = sum(1 for c in line if c in '∫∑√αβγδθλπ≠≤≥∞')
                        if special_chars > 2 or len(line) < 50:
                            html_content.append(f'<div class="formula">{line}</div>')
                        else:
                            html_content.append(f'<p>{line}</p>')
                
                html_content.append('</div>')
        
        html_content.append('</body></html>')
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(html_content))
        
        print(f"✓ HTML转换成功: {output_path}")
        return True
    except Exception as e:
        print(f"✗ HTML转换失败: {e}")
        import traceback
        traceback.print_exc()
        return False

def extract_structured_content(pdf_path, output_path):
    """提取结构化内容（更适合后续处理）"""
    try:
        import pdfplumber
        import json
        import re
        
        print(f"正在提取结构化内容: {os.path.basename(pdf_path)}")
        
        structured_data = {
            'source': os.path.basename(pdf_path),
            'pages': [],
            'chapters': [],
            'formulas': []
        }
        
        current_chapter = None
        chapter_content = []
        
        with pdfplumber.open(pdf_path) as pdf:
            for page_num, page in enumerate(pdf.pages, 1):
                text = page.extract_text()
                
                if not text or len(text.strip()) < 20:
                    continue
                
                page_data = {
                    'page_number': page_num,
                    'raw_text': text,
                    'cleaned_text': '',
                    'has_formulas': False,
                    'formulas': []
                }
                
                # 清理文本
                lines = [line.strip() for line in text.split('\n') if line.strip()]
                cleaned = '\n'.join(lines)
                page_data['cleaned_text'] = cleaned
                
                # 检测章节标题
                chapter_patterns = [
                    r'第[一二三四五六七八九十\d]+章\s+(.+)',
                    r'第[一二三四五六七八九十\d]+讲\s+(.+)',
                ]
                
                for pattern in chapter_patterns:
                    match = re.search(pattern, cleaned)
                    if match:
                        if current_chapter:
                            structured_data['chapters'].append({
                                'title': current_chapter,
                                'content': '\n'.join(chapter_content),
                                'pages': len(chapter_content)
                            })
                        
                        current_chapter = match.group(1)
                        chapter_content = [cleaned]
                        break
                else:
                    if current_chapter:
                        chapter_content.append(cleaned)
                
                # 检测公式（包含数学符号的行）
                formula_indicators = ['∫', '∑', '√', 'α', 'β', 'γ', 'δ', 'θ', 'λ', 'π', 
                                     '≠', '≤', '≥', '∞', '∈', '⊂', '∂', '∇']
                
                formulas_in_page = []
                for line in lines:
                    if any(indicator in line for indicator in formula_indicators):
                        formulas_in_page.append(line)
                
                if formulas_in_page:
                    page_data['has_formulas'] = True
                    page_data['formulas'] = formulas_in_page
                    structured_data['formulas'].extend(formulas_in_page)
                
                structured_data['pages'].append(page_data)
        
        # 保存最后一个章节
        if current_chapter and chapter_content:
            structured_data['chapters'].append({
                'title': current_chapter,
                'content': '\n'.join(chapter_content),
                'pages': len(chapter_content)
            })
        
        # 保存为JSON
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(structured_data, f, ensure_ascii=False, indent=2)
        
        print(f"✓ 结构化提取成功: {output_path}")
        print(f"  - 总页数: {len(structured_data['pages'])}")
        print(f"  - 章节数: {len(structured_data['chapters'])}")
        print(f"  - 公式数: {len(structured_data['formulas'])}")
        
        return True
    except Exception as e:
        print(f"✗ 结构化提取失败: {e}")
        import traceback
        traceback.print_exc()
        return False

def batch_convert(pdf_folder, output_folder, format_type='structured'):
    """批量转换PDF文件"""
    
    # 获取所有PDF文件
    pdf_files = []
    for file in sorted(os.listdir(pdf_folder)):
        if file.endswith('.pdf'):
            pdf_files.append(os.path.join(pdf_folder, file))
    
    print(f"\n找到 {len(pdf_files)} 个PDF文件\n")
    
    # 创建输出目录
    os.makedirs(output_folder, exist_ok=True)
    
    success_count = 0
    fail_count = 0
    
    for idx, pdf_path in enumerate(pdf_files, 1):
        print(f"\n{'='*60}")
        print(f"处理 [{idx}/{len(pdf_files)}]: {os.path.basename(pdf_path)}")
        print(f"{'='*60}")
        
        base_name = os.path.splitext(os.path.basename(pdf_path))[0]
        
        if format_type == 'word':
            output_path = os.path.join(output_folder, f"{base_name}.docx")
            success = convert_pdf_to_word(pdf_path, output_path)
        elif format_type == 'html':
            output_path = os.path.join(output_folder, f"{base_name}.html")
            success = convert_pdf_to_html(pdf_path, output_path)
        elif format_type == 'structured':
            output_path = os.path.join(output_folder, f"{base_name}.json")
            success = extract_structured_content(pdf_path, output_path)
        else:
            print(f"未知的格式类型: {format_type}")
            continue
        
        if success:
            success_count += 1
        else:
            fail_count += 1
        
        # 每5个文件暂停一下
        if idx % 5 == 0:
            print(f"\n已处理 {idx} 个文件，休息5秒...")
            import time
            time.sleep(5)
    
    print(f"\n{'='*60}")
    print(f"批量转换完成!")
    print(f"成功: {success_count} 个")
    print(f"失败: {fail_count} 个")
    print(f"输出目录: {output_folder}")
    print(f"{'='*60}")

def main():
    print("="*60)
    print("武忠祥高等数学强化讲义 - PDF转换工具")
    print("="*60)
    
    # 检查依赖
    if not check_dependencies():
        print("\n请先安装必要的依赖包")
        return
    
    # 配置路径
    pdf_folder = "d:/学习/效率/01-数学一/05-武忠详强化笔记"
    output_folder = "d:/学习/效率/01-数学一/05-武忠详强化笔记/converted"
    
    print(f"\nPDF文件夹: {pdf_folder}")
    print(f"输出文件夹: {output_folder}")
    
    # 选择转换格式
    print("\n请选择转换格式:")
    print("1. 结构化JSON（推荐 - 便于后续处理）")
    print("2. Word文档 (.docx)")
    print("3. HTML网页")
    
    choice = input("\n请输入选择 (1/2/3): ").strip()
    
    format_map = {
        '1': 'structured',
        '2': 'word',
        '3': 'html'
    }
    
    format_type = format_map.get(choice, 'structured')
    
    # 询问处理范围
    print("\n处理范围:")
    print("1. 所有PDF文件")
    print("2. 只处理第一个文件（测试）")
    print("3. 处理前5个文件")
    
    range_choice = input("\n请输入选择 (1/2/3): ").strip()
    
    if range_choice == '2':
        # 测试模式：只处理一个文件
        test_pdf = os.path.join(pdf_folder, "高等数学辅导讲义 第一章.pdf")
        if os.path.exists(test_pdf):
            output_path = os.path.join(output_folder, "测试输出.json")
            extract_structured_content(test_pdf, output_path)
        else:
            print("测试文件不存在")
    elif range_choice == '3':
        # 处理前5个
        pdf_files = sorted([f for f in os.listdir(pdf_folder) if f.endswith('.pdf')])[:5]
        for pdf_file in pdf_files:
            pdf_path = os.path.join(pdf_folder, pdf_file)
            base_name = os.path.splitext(pdf_file)[0]
            output_path = os.path.join(output_folder, f"{base_name}.json")
            extract_structured_content(pdf_path, output_path)
    else:
        # 处理所有
        batch_convert(pdf_folder, output_folder, format_type)

if __name__ == "__main__":
    main()

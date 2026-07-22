"""
快速测试：转换第一个PDF为结构化JSON
"""
import os
import json
import re
import pdfplumber

pdf_path = "d:/学习/效率/01-数学一/05-武忠详强化笔记/高等数学辅导讲义 第一章.pdf"
output_path = "d:/学习/效率/01-数学一/05-武忠详强化笔记/converted/第一章_结构化.json"

os.makedirs(os.path.dirname(output_path), exist_ok=True)

print("="*60)
print("开始转换PDF为结构化JSON")
print("="*60)
print(f"\n输入: {os.path.basename(pdf_path)}")
print(f"输出: {os.path.basename(output_path)}\n")

structured_data = {
    'source': os.path.basename(pdf_path),
    'total_pages': 0,
    'chapters': [],
    'sections': [],
    'formulas_count': 0
}

current_chapter = None
current_section = None
section_content = []
formula_indicators = ['∫', '∑', '√', 'α', 'β', 'γ', 'δ', 'θ', 'λ', 'π', 
                     '≠', '≤', '≥', '∞', '∈', '⊂', '∂', '∇', 'lim', 'sin', 'cos', 'tan']

try:
    with pdfplumber.open(pdf_path) as pdf:
        structured_data['total_pages'] = len(pdf.pages)
        print(f"总页数: {len(pdf.pages)}\n")
        
        for page_num, page in enumerate(pdf.pages, 1):
            text = page.extract_text()
            
            if not text or len(text.strip()) < 30:
                continue
            
            # 清理文本
            lines = [line.strip() for line in text.split('\n') if line.strip()]
            cleaned = '\n'.join(lines)
            
            # 检测章节标题
            chapter_patterns = [
                r'第[一二三四五六七八九十\d]+章\s+(.+)',
                r'第[一二三四五六七八九十\d]+讲\s+(.+)',
                r'Chapter\s+\d+\s+(.+)',
            ]
            
            chapter_found = False
            for pattern in chapter_patterns:
                match = re.search(pattern, cleaned)
                if match:
                    chapter_title = match.group(1).strip()
                    
                    # 保存之前的章节
                    if current_chapter and section_content:
                        structured_data['chapters'].append({
                            'title': current_chapter,
                            'content_preview': section_content[0][:200] if section_content else '',
                            'pages_count': len(section_content)
                        })
                    
                    current_chapter = chapter_title
                    current_section = chapter_title
                    section_content = [cleaned]
                    chapter_found = True
                    
                    print(f"✓ 发现章节 (第{page_num}页): {chapter_title}")
                    break
            
            if not chapter_found:
                # 检测小节标题
                section_patterns = [
                    r'第[一二三四五六七八九十\d]+节\s+(.+)',
                    r'[\d]+\.[\d]+\s+(.+)',
                    r'[、]\s*(.{5,30})$',
                ]
                
                section_found = False
                for pattern in section_patterns:
                    match = re.search(pattern, cleaned)
                    if match:
                        section_title = match.group(1).strip()
                        
                        # 避免过长的标题（可能是正文）
                        if len(section_title) < 50:
                            # 保存之前的小节
                            if current_section and section_content:
                                structured_data['sections'].append({
                                    'chapter': current_chapter or '未知章节',
                                    'title': current_section,
                                    'content_length': sum(len(c) for c in section_content),
                                    'has_formulas': any(any(ind in line for ind in formula_indicators) for line in section_content)
                                })
                            
                            current_section = section_title
                            section_content = [cleaned]
                            section_found = True
                            
                            if page_num <= 10:  # 只显示前10页的小节
                                print(f"  → 小节: {section_title}")
                            break
                
                if not section_found:
                    section_content.append(cleaned)
            
            # 统计公式
            for line in lines:
                if any(indicator in line for indicator in formula_indicators):
                    structured_data['formulas_count'] += 1
            
            # 进度提示
            if page_num % 10 == 0:
                print(f"  已处理 {page_num}/{len(pdf.pages)} 页...")
    
    # 保存最后一个章节和小节
    if current_chapter and section_content:
        structured_data['chapters'].append({
            'title': current_chapter,
            'content_preview': section_content[0][:200],
            'pages_count': len(section_content)
        })
    
    if current_section and section_content:
        structured_data['sections'].append({
            'chapter': current_chapter or '未知章节',
            'title': current_section,
            'content_length': sum(len(c) for c in section_content),
            'has_formulas': any(any(ind in line for ind in formula_indicators) for line in section_content)
        })
    
    # 保存JSON
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(structured_data, f, ensure_ascii=False, indent=2)
    
    print(f"\n{'='*60}")
    print("转换完成!")
    print(f"{'='*60}")
    print(f"总页数: {structured_data['total_pages']}")
    print(f"章节数: {len(structured_data['chapters'])}")
    print(f"小节数: {len(structured_data['sections'])}")
    print(f"公式行数: {structured_data['formulas_count']}")
    print(f"\n输出文件: {output_path}")
    print(f"{'='*60}")
    
    # 显示章节列表
    if structured_data['chapters']:
        print("\n识别到的章节:")
        for i, chapter in enumerate(structured_data['chapters'], 1):
            print(f"  {i}. {chapter['title']} ({chapter['pages_count']} 页)")
    
except Exception as e:
    print(f"\n❌ 错误: {e}")
    import traceback
    traceback.print_exc()

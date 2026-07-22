"""
武忠祥数学强化讲义PDF内容提取与知识点整理工具
功能：
1. 提取PDF文本内容
2. 按章节分类整理
3. 转换为网站可用的Markdown格式
4. 自动识别公式并转换为LaTeX格式
"""

import os
import re
from pathlib import Path

try:
    import pdfplumber
except ImportError:
    print("正在安装pdfplumber库...")
    os.system("pip install pdfplumber")
    import pdfplumber


class MathKnowledgeExtractor:
    def __init__(self, pdf_folder, output_base_dir="d:/学习/效率/01-数学一/01-知识点整理"):
        self.pdf_folder = pdf_folder
        self.output_base_dir = output_base_dir
        self.chapter_name = "高等数学"  # 固定为高等数学
        self.sections = []
        
    def get_pdf_files(self):
        """获取文件夹中所有PDF文件并按序号排序"""
        pdf_files = []
        for file in os.listdir(self.pdf_folder):
            if file.endswith('.pdf'):
                pdf_files.append(os.path.join(self.pdf_folder, file))
        
        # 按文件名中的数字排序
        def extract_number(filename):
            match = re.search(r'(\d+)', os.path.basename(filename))
            return int(match.group(1)) if match else 0
        
        pdf_files.sort(key=extract_number)
        print(f"找到 {len(pdf_files)} 个PDF文件")
        return pdf_files
    
    def extract_text_from_pdfs(self):
        """从多个PDF文件中提取文本"""
        pdf_files = self.get_pdf_files()
        
        all_text_content = []
        total_files = len(pdf_files)
        
        for file_idx, pdf_path in enumerate(pdf_files, 1):
            print(f"\n正在处理 [{file_idx}/{total_files}]: {os.path.basename(pdf_path)}")
            
            try:
                with pdfplumber.open(pdf_path) as pdf:
                    total_pages = len(pdf.pages)
                    print(f"  共 {total_pages} 页")
                    
                    for i, page in enumerate(pdf.pages, 1):
                        text = page.extract_text()
                        if text:
                            all_text_content.append({
                                'source_file': os.path.basename(pdf_path),
                                'page': i,
                                'text': text
                            })
                    
                    print(f"  ✓ 完成")
            except Exception as e:
                print(f"  ✗ 错误: {e}")
        
        print(f"\n✅ 文本提取完成，共 {len(all_text_content)} 页内容")
        return all_text_content
    

    
    def convert_to_latex(self, text):
        """将数学公式转换为LaTeX格式"""
        # 这里可以添加更复杂的公式识别逻辑
        # 目前做简单的处理
        
        # 替换常见的数学符号
        replacements = {
            '∫': r'\int',
            '∑': r'\sum',
            '∞': r'\infty',
            '√': r'\sqrt',
            '≠': r'\neq',
            '≤': r'\leq',
            '≥': r'\geq',
            'α': r'\alpha',
            'β': r'\beta',
            'γ': r'\gamma',
            'δ': r'\delta',
            'ε': r'\epsilon',
            'θ': r'\theta',
            'λ': r'\lambda',
            'μ': r'\mu',
            'σ': r'\sigma',
            'π': r'\pi',
        }
        
        for old, new in replacements.items():
            text = text.replace(old, new)
        
        return text
    
    def organize_content(self, text_content):
        """整理内容到对应章节"""
        current_section = None
        section_content = []
        start_page = 1
        global_page = 1
        
        for page_data in text_content:
            text = page_data['text']
            source_file = page_data['source_file']
            
            # 检测章节标题（多种格式）
            chapter_patterns = [
                r'第[一二三四五六七八九十\d]+章\s+(.+)',
                r'第[一二三四五六七八九十\d]+讲\s+(.+)',
                r'Chapter\s+\d+\s+(.+)',
            ]
            
            section_patterns = [
                r'第[一二三四五六七八九十\d]+节\s+(.+)',
                r'[\d]+\.\d+\s+(.+)',
            ]
            
            chapter_title = None
            for pattern in chapter_patterns:
                match = re.search(pattern, text)
                if match:
                    chapter_title = match.group(1).strip()
                    break
            
            if chapter_title:
                # 保存之前的章节内容
                if section_content:
                    self.sections.append({
                        'section': current_section or f'第{len(self.sections)+1}章',
                        'content': '\n'.join(section_content),
                        'pages': f"{start_page}-{global_page-1}",
                        'source': source_file
                    })
                
                current_section = chapter_title
                section_content = [f"# {chapter_title}\n"]
                start_page = global_page
            else:
                # 检测小节标题
                section_title = None
                for pattern in section_patterns:
                    match = re.search(pattern, text)
                    if match:
                        section_title = match.group(1).strip()
                        break
                
                if section_title and len(section_title) < 50:  # 避免误判长句子
                    if section_content:
                        self.sections.append({
                            'section': current_section or f'第{len(self.sections)+1}章',
                            'content': '\n'.join(section_content),
                            'pages': f"{start_page}-{global_page-1}",
                            'source': source_file
                        })
                    
                    current_section = section_title
                    section_content = [f"## {section_title}\n"]
                    start_page = global_page
                else:
                    # 普通内容
                    cleaned_text = self.convert_to_latex(text)
                    section_content.append(cleaned_text)
            
            global_page += 1
        
        # 保存最后一节
        if section_content:
            self.sections.append({
                'section': current_section or f'第{len(self.sections)+1}章',
                'content': '\n'.join(section_content),
                'pages': f"{start_page}-{global_page}",
                'source': source_file
            })
    
    def save_to_markdown(self):
        """保存为Markdown格式"""
        print("\n开始保存知识点文件...")
        
        chapter_dir = os.path.join(self.output_base_dir, self.chapter_name)
        os.makedirs(chapter_dir, exist_ok=True)
        
        print(f"\n处理 {self.chapter_name}: {len(self.sections)} 个章节")
        
        for i, section in enumerate(self.sections, 1):
            # 创建文件名
            filename = f"{i:02d}_{section['section']}.md"
            # 移除非法字符
            filename = re.sub(r'[<>:"/\\|?*]', '_', filename)
            filepath = os.path.join(chapter_dir, filename)
            
            # 写入内容
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(f"---\ntitle: {section['section']}\nchapter: {self.chapter_name}\nsource: 武忠祥高等数学强化讲义\npages: {section['pages']}\nsource_file: {section['source']}\n---\n\n")
                f.write(section['content'])
            
            print(f"  ✓ {filename}")
        
        print(f"\n✅ 所有知识点已保存到: {chapter_dir}")
    
    def process(self):
        """完整处理流程"""
        print("="*60)
        print("武忠祥高等数学强化讲义 - 知识点提取工具")
        print("="*60)
        
        # 1. 提取文本
        text_content = self.extract_text_from_pdfs()
        
        # 2. 整理内容
        print("\n正在分析章节结构...")
        self.organize_content(text_content)
        
        # 3. 统计结果
        print(f"\n提取结果统计:")
        print(f"  {self.chapter_name}: {len(self.sections)} 个章节")
        
        # 4. 保存文件
        self.save_to_markdown()
        
        print("\n" + "="*60)
        print("处理完成！")
        print("="*60)


def main():
    # PDF文件夹路径
    pdf_folder = "d:/学习/效率/01-数学一/05-武忠详强化笔记"
    
    if not os.path.exists(pdf_folder):
        print(f"❌ 文件夹不存在: {pdf_folder}")
        return
    
    try:
        extractor = MathKnowledgeExtractor(pdf_folder)
        extractor.process()
    except Exception as e:
        print(f"\n❌ 错误: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()

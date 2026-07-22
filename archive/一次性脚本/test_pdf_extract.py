"""
测试单个PDF文件的提取
"""
import pdfplumber
import os

pdf_path = "d:/学习/效率/01-数学一/05-武忠详强化笔记/高等数学辅导讲义 第一章.pdf"

print(f"正在读取: {pdf_path}")
print(f"文件存在: {os.path.exists(pdf_path)}")

try:
    with pdfplumber.open(pdf_path) as pdf:
        print(f"总页数: {len(pdf.pages)}")
        
        # 读取第一页
        if len(pdf.pages) > 0:
            page = pdf.pages[0]
            text = page.extract_text()
            print("\n第一页内容预览:")
            print(text[:500] if text else "无文本内容")
            
except Exception as e:
    print(f"错误: {e}")
    import traceback
    traceback.print_exc()

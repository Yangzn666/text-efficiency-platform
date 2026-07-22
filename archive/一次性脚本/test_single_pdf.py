"""
详细测试PDF提取效果
"""
import pdfplumber
import os

pdf_path = "d:/学习/效率/01-数学一/05-武忠详强化笔记/高等数学辅导讲义 第一章.pdf"

print("="*60)
print("PDF提取测试")
print("="*60)
print(f"\n文件: {os.path.basename(pdf_path)}")
print(f"大小: {os.path.getsize(pdf_path) / 1024 / 1024:.2f} MB")

try:
    with pdfplumber.open(pdf_path) as pdf:
        total_pages = len(pdf.pages)
        print(f"总页数: {total_pages}")
        
        # 测试前5页
        test_pages = min(5, total_pages)
        print(f"\n测试前 {test_pages} 页的内容提取:\n")
        
        for page_num in range(test_pages):
            page = pdf.pages[page_num]
            text = page.extract_text()
            
            print(f"\n{'='*60}")
            print(f"第 {page_num + 1} 页")
            print(f"{'='*60}")
            
            if text:
                # 清理多余的空行和特殊字符
                lines = [line.strip() for line in text.split('\n') if line.strip()]
                clean_text = '\n'.join(lines)
                
                print(f"文本长度: {len(clean_text)} 字符")
                print(f"行数: {len(lines)}")
                print(f"\n内容预览 (前800字符):")
                print(clean_text[:800])
                
                if len(clean_text) > 800:
                    print("\n... (内容过长，仅显示部分)")
            else:
                print("⚠️ 该页无文本内容（可能是图片或扫描页）")
        
        # 统计有内容的页数
        pages_with_text = 0
        total_text_length = 0
        
        print(f"\n{'='*60}")
        print("整体统计:")
        print(f"{'='*60}")
        
        for i, page in enumerate(pdf.pages):
            text = page.extract_text()
            if text and len(text.strip()) > 50:  # 至少有50个字符才算有内容
                pages_with_text += 1
                total_text_length += len(text)
        
        print(f"有内容的页数: {pages_with_text}/{total_pages}")
        print(f"总文本长度: {total_text_length} 字符")
        print(f"平均每页: {total_text_length // max(pages_with_text, 1)} 字符")
        
except Exception as e:
    print(f"\n❌ 错误: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "="*60)
print("测试完成")
print("="*60)

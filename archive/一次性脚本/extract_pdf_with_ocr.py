"""
使用OCR识别PDF中的数学公式和内容
需要安装: pip install paddlepaddle paddleocr pdf2image
"""

import os
import sys

def check_and_install_dependencies():
    """检查并安装必要的依赖"""
    required_packages = [
        'paddleocr',
        'pdf2image',
        'Pillow'
    ]
    
    missing_packages = []
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print("需要安装以下依赖包:")
        for pkg in missing_packages:
            print(f"  - {pkg}")
        
        response = input("\n是否自动安装? (y/n): ").strip().lower()
        if response == 'y':
            for pkg in missing_packages:
                print(f"\n正在安装 {pkg}...")
                os.system(f"pip install {pkg}")
        else:
            print("请手动安装依赖后重新运行")
            sys.exit(1)

def extract_with_ocr(pdf_path, output_dir):
    """使用OCR提取PDF内容"""
    from paddleocr import PaddleOCR
    from pdf2image import convert_from_path
    import re
    
    print(f"\n开始OCR处理: {os.path.basename(pdf_path)}")
    
    # 初始化OCR引擎（支持中英文和数学公式）
    ocr = PaddleOCR(
        use_angle_cls=True, 
        lang='ch',
        use_gpu=False  # 如果有GPU可以改为True
    )
    
    # 将PDF转换为图片
    print("正在转换PDF为图片...")
    images = convert_from_path(pdf_path, dpi=300)
    print(f"共 {len(images)} 页")
    
    # 创建输出目录
    os.makedirs(output_dir, exist_ok=True)
    
    all_content = []
    
    for page_num, image in enumerate(images, 1):
        print(f"处理第 {page_num}/{len(images)} 页...")
        
        # 保存图片临时文件
        temp_img_path = f"temp_page_{page_num}.png"
        image.save(temp_img_path)
        
        # OCR识别
        result = ocr.ocr(temp_img_path, cls=True)
        
        # 提取文本
        page_text = []
        if result and result[0]:
            for line in result[0]:
                text = line[1][0]  # 提取识别的文本
                confidence = line[1][1]  # 置信度
                
                # 只保留置信度较高的文本
                if confidence > 0.5:
                    page_text.append(text)
        
        # 清理临时文件
        if os.path.exists(temp_img_path):
            os.remove(temp_img_path)
        
        # 保存页面内容
        page_content = '\n'.join(page_text)
        all_content.append({
            'page': page_num,
            'content': page_content
        })
        
        # 每5页保存一次进度
        if page_num % 5 == 0:
            save_progress(all_content, output_dir, page_num)
            print(f"  ✓ 已处理 {page_num} 页")
    
    # 保存最终结果
    save_progress(all_content, output_dir, len(images))
    
    return all_content

def save_progress(content_list, output_dir, page_num):
    """保存处理进度"""
    output_file = os.path.join(output_dir, f"ocr_result_page_{page_num}.md")
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(f"# OCR识别结果 (前{page_num}页)\n\n")
        
        for item in content_list:
            f.write(f"## 第 {item['page']} 页\n\n")
            f.write(item['content'])
            f.write("\n\n")
    
    print(f"  进度已保存到: {output_file}")

def main():
    print("="*60)
    print("武忠祥高等数学强化讲义 - OCR提取工具")
    print("="*60)
    
    # 检查依赖
    check_and_install_dependencies()
    
    # PDF文件夹
    pdf_folder = "d:/学习/效率/01-数学一/05-武忠详强化笔记"
    output_base = "d:/学习/效率/01-数学一/01-知识点整理/高等数学"
    
    # 获取所有PDF文件
    pdf_files = []
    for file in sorted(os.listdir(pdf_folder)):
        if file.endswith('.pdf'):
            pdf_files.append(os.path.join(pdf_folder, file))
    
    print(f"\n找到 {len(pdf_files)} 个PDF文件")
    
    # 询问用户处理方式
    print("\n请选择处理方式:")
    print("1. 处理所有PDF文件（可能需要较长时间）")
    print("2. 只处理第一个文件进行测试")
    
    choice = input("\n请输入选择 (1/2): ").strip()
    
    if choice == '2':
        pdf_files = pdf_files[:1]
    
    # 处理每个PDF
    for idx, pdf_path in enumerate(pdf_files, 1):
        print(f"\n{'='*60}")
        print(f"处理 [{idx}/{len(pdf_files)}]: {os.path.basename(pdf_path)}")
        print(f"{'='*60}")
        
        output_dir = os.path.join(output_base, "ocr_temp")
        
        try:
            extract_with_ocr(pdf_path, output_dir)
            print(f"✓ 完成: {os.path.basename(pdf_path)}")
        except Exception as e:
            print(f"✗ 错误: {e}")
            import traceback
            traceback.print_exc()
    
    print("\n" + "="*60)
    print("所有文件处理完成！")
    print(f"结果保存在: {output_base}/ocr_temp")
    print("="*60)

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
OCR识别院校图片中的考研录取数据
使用pytesseract进行文字识别，提取分数线、录取分数等信息
"""

import os
import re
import csv
import json
from pathlib import Path
from PIL import Image
import pytesseract
import cv2
import numpy as np

# 配置
IMAGE_FOLDER = Path(r"d:\学习\效率\08-院校资料\院校整理")
OUTPUT_CSV = Path(r"d:\学习\效率\08-院校资料\ocr提取结果_待校对.csv")

# Tesseract路径配置（Windows系统）
# 如果Tesseract不在PATH中，需要指定完整路径
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'


def preprocess_image(image_path):
    """
    图像预处理：提高OCR识别率
    """
    # 使用PIL读取图片（支持中文路径）
    pil_img = Image.open(image_path)
    
    # 转换为RGB模式
    if pil_img.mode != 'RGB':
        pil_img = pil_img.convert('RGB')
    
    # 转换为OpenCV格式进行预处理
    img_array = np.array(pil_img)
    img_cv = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
    
    # 转换为灰度图
    gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)
    
    # 二值化处理
    _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    
    # 去噪
    denoised = cv2.fastNlMeansDenoising(binary, None, 10, 7, 21)
    
    # 转换回PIL格式
    pil_processed = Image.fromarray(denoised)
    
    return pil_processed


def extract_school_info(text, image_name):
    """
    从OCR文本中提取院校信息
    """
    info = {
        '图片文件名': image_name,
        '原始文本': text[:200],  # 保存前200字符用于调试
        '院校名称': '',
        '复试线': '',
        '录取最低分': '',
        '录取最高分': '',
        '录取平均分': '',
        '招生人数': '',
        '备注': '',
        '置信度': '待评估'
    }
    
    # 提取院校名称（通常在开头或标题位置）
    # 匹配常见的院校名称模式
    school_patterns = [
        r'([\u4e00-\u9fa5]{2,6}(?:大学|学院|科技大学|工业大学))',
    ]
    
    for pattern in school_patterns:
        match = re.search(pattern, text)
        if match:
            info['院校名称'] = match.group(1)
            break
    
    # 提取分数线（数字+分的模式）
    score_patterns = {
        '复试线': r'复试线[:：]?\s*(\d+)\s*分',
        '录取最低分': r'(?:录取最低分|最低分|进复试最低分)[:：]?\s*(\d+)\s*分',
        '录取最高分': r'(?:录取最高分|最高分|进复试最高分)[:：]?\s*(\d+)\s*分',
        '录取平均分': r'(?:录取平均分|平均分|复试均分)[:：]?\s*(\d+(?:\.\d+)?)\s*分',
        '招生人数': r'(?:招生人数|统考名额|计划招生)[:：]?\s*(\d+)',
    }
    
    for field, pattern in score_patterns.items():
        match = re.search(pattern, text)
        if match:
            info[field] = match.group(1)
    
    # 如果没有找到明确的标签，尝试提取所有数字
    if not any([info['复试线'], info['录取最低分'], info['录取最高分']]):
        numbers = re.findall(r'(\d{3})\s*分', text)
        if numbers:
            # 通常第一个三位数是复试线
            if not info['复试线']:
                info['复试线'] = numbers[0]
            if len(numbers) > 1 and not info['录取最低分']:
                info['录取最低分'] = numbers[1]
    
    return info


def ocr_image(image_path):
    """
    对单张图片进行OCR识别
    """
    try:
        # 预处理图片
        processed_img = preprocess_image(image_path)
        
        # 使用pytesseract进行OCR识别
        # lang='chi_sim' 表示简体中文
        custom_config = r'--oem 3 --psm 6'  # PSM 6: 假设是一个统一的文本块
        text = pytesseract.image_to_string(processed_img, lang='chi_sim', config=custom_config)
        
        return text.strip()
    
    except Exception as e:
        print(f"  ❌ OCR识别失败: {str(e)}")
        return ""


def main():
    print("=" * 80)
    print("🚀 开始OCR识别院校图片数据")
    print("=" * 80)
    
    # 检查图片文件夹
    if not IMAGE_FOLDER.exists():
        print(f"❌ 图片文件夹不存在: {IMAGE_FOLDER}")
        return
    
    # 获取所有jpg图片
    jpg_files = sorted(IMAGE_FOLDER.glob('*.jpg'))
    
    if not jpg_files:
        print("❌ 未找到任何jpg图片文件")
        return
    
    print(f"\n📸 找到 {len(jpg_files)} 张图片\n")
    
    # 存储所有识别结果
    results = []
    
    # 逐张处理图片
    for i, jpg_file in enumerate(jpg_files, 1):
        print(f"[{i}/{len(jpg_files)}] 处理: {jpg_file.name}")
        
        # OCR识别
        text = ocr_image(jpg_file)
        
        if text:
            print(f"  ✅ 识别成功，文本长度: {len(text)} 字符")
            
            # 提取结构化信息
            info = extract_school_info(text, jpg_file.name)
            results.append(info)
            
            # 打印提取的关键信息
            if info['院校名称']:
                print(f"  📍 院校: {info['院校名称']}")
            if info['复试线']:
                print(f"  📊 复试线: {info['复试线']}分")
            if info['录取最低分']:
                print(f"  📊 最低分: {info['录取最低分']}分")
        else:
            print(f"  ⚠️  识别结果为空")
            results.append({
                '图片文件名': jpg_file.name,
                '原始文本': '',
                '院校名称': '',
                '复试线': '',
                '录取最低分': '',
                '录取最高分': '',
                '录取平均分': '',
                '招生人数': '',
                '备注': 'OCR识别失败',
                '置信度': '低'
            })
        
        print()
    
    # 保存结果到CSV
    print("\n💾 保存识别结果到CSV文件...")
    
    fieldnames = [
        '图片文件名', '院校名称', '复试线', '录取最低分', 
        '录取最高分', '录取平均分', '招生人数', '备注', '置信度', '原始文本'
    ]
    
    with open(OUTPUT_CSV, 'w', encoding='utf-8-sig', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(results)
    
    print(f"✅ 结果已保存到: {OUTPUT_CSV}")
    print(f"\n📊 统计信息:")
    print(f"   - 总图片数: {len(jpg_files)}")
    print(f"   - 成功识别: {sum(1 for r in results if r['院校名称'])}")
    print(f"   - 识别失败: {sum(1 for r in results if not r['院校名称'])}")
    
    print("\n" + "=" * 80)
    print("✨ OCR识别完成！")
    print("=" * 80)
    print("\n⚠️  重要提示:")
    print("1. 请打开CSV文件人工校对识别结果")
    print("2. 重点检查数字（分数线、分数等）是否准确")
    print("3. 补充缺失的院校名称和备注信息")
    print("4. 校对完成后，继续执行后续的数据整合步骤")


if __name__ == "__main__":
    main()

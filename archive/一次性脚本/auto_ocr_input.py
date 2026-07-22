#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
OCR识别并自动录入错题到网站
使用阿里云/腾讯云OCR API识别图片中的题目
"""

import os
import json
import re
from pathlib import Path
from PIL import Image
import base64
import requests

# 配置区域 - 请填入您的OCR API密钥
OCR_CONFIG = {
    # 方案1: 阿里云OCR（推荐，准确率高）
    'aliyun': {
        'access_key_id': 'YOUR_ACCESS_KEY_ID',
        'access_key_secret': 'YOUR_ACCESS_KEY_SECRET',
        'endpoint': 'ocr-api.cn-hangzhou.aliyuncs.com'
    },
    # 方案2: 腾讯云OCR
    'tencent': {
        'secret_id': 'YOUR_SECRET_ID',
        'secret_key': 'YOUR_SECRET_KEY',
        'endpoint': 'ocr.tencentcloudapi.com'
    }
}

# 网站中已有的题目编号
existing_titles = {
    'DS-WD-2.1.3-XT-1', 'DS-WD-2.2.3-XT-2', 'DS-WD-2.2.3-XT-5',
    'DS-WD-2.2.3-XT-12', 'DS-WD-2.3.7-XT-3', 'DS-WD-2.3.7-XT-4',
    'DS-WD-2.3.7-XT-7', 'DS-WD-2.3.7-XT-8', 'DS-WD-2.3.7-XT-9',
    'DS-WD-2.3.7-XT-10', 'DS-WD-2.3.7-XT-13', 'DS-WD-2.3.7-XT-17',
    'DS-WD-2.3.7-XT-19', 'DS-WD-2.3.7-XT-21', 'DS-WD-2.3.7-XT-24',
    'DS-WD-2.3.7-XT-25', 'DS-WD-2.3.7-XT-26', 'DS-WD-2.3.7-XT-27'
}

def extract_question_info(text):
    """
    从OCR识别的文本中提取题目信息
    """
    # 提取题目编号
    title_match = re.search(r'DS[-_]WD[-_](\d+)\.(\d+)\.(\d+)[-_]XT[-_](\d+)', text)
    
    # 提取题目内容
    content_match = re.search(r'(线性表是.*?)(?=\n*A\.|\n*B\.|\n*C\.|\n*D\.)', text, re.DOTALL)
    
    # 提取选项
    options = {}
    for match in re.finditer(r'([A-D])[\.、]\s*(.+?)(?=\n[A-D][\.、]|\n\n|$)', text, re.DOTALL):
        options[match.group(1)] = match.group(2).strip()
    
    # 提取正确答案（如果有）
    answer_match = re.search(r'答案[:：]\s*([A-D])', text)
    
    return {
        'title_number': title_match.group(0) if title_match else None,
        'chapter': int(title_match.group(1)) if title_match else None,
        'section': f"{title_match.group(2)}.{title_match.group(3)}" if title_match else None,
        'content': content_match.group(1).strip() if content_match else None,
        'options': options,
        'answer': answer_match.group(1) if answer_match else None
    }

def generate_vue_code(question_info, image_path):
    """
    生成Vue组件中需要的题目代码
    """
    if not question_info['title_number']:
        return None
    
    title_id = f"ds_{question_info['chapter']}_{question_info['title_number'].split('-XT-')[1]}"
    
    # 构建选项文本
    options_text = '\n'.join([f"{k}. {v}" for k, v in question_info['options'].items()])
    
    # 构建完整题目内容
    full_content = f"{question_info['content']}\n{options_text}"
    
    vue_code = f"""  {{
    id: '{title_id}',
    chapterId: 'ch{question_info['chapter']}',
    chapterName: '第{question_info['chapter']}章 线性表',
    sectionId: '{question_info['section']}',
    sectionName: '2.{question_info['section'].split('.')[1]} 小节',
    title: '题目（{question_info['title_number']}）',
    content: '{full_content.replace("'", "\\'")}',
    mistakeType: '待补充',
    importance: 5,
    correction: '正确答案：{question_info['answer'] or "待补充"}\\n解析：待补充',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  }},"""
    
    return vue_code

def main():
    print("=" * 80)
    print("数据结构第二章错题自动录入工具")
    print("=" * 80)
    
    image_folder = Path(r'd:\学习\效率\新建文件夹 (2)')
    jpg_files = sorted(image_folder.glob('*.jpg'))
    
    print(f"\n找到 {len(jpg_files)} 张图片\n")
    
    # 存储所有生成的代码
    all_codes = []
    missing_titles = []
    
    for i, jpg_file in enumerate(jpg_files, 1):
        print(f"[{i}/{len(jpg_files)}] 处理: {jpg_file.name}")
        
        try:
            # 读取图片
            img = Image.open(jpg_file)
            
            # TODO: 这里调用OCR API
            # 目前使用模拟数据，实际使用时需要替换为真实的OCR调用
            print("  ⚠️  需要配置OCR API密钥才能自动识别")
            print("  💡 建议：直接在网页中使用图片录入功能手动录入")
            
        except Exception as e:
            print(f"  ❌ 处理失败: {str(e)}")
    
    print("\n" + "=" * 80)
    print("处理完成！")
    print("=" * 80)
    print("\n由于OCR API需要配置密钥，建议使用以下方案：")
    print("1. 在网页中使用优化后的图片录入功能（推荐）")
    print("2. 或者配置OCR API密钥后重新运行此脚本")

if __name__ == '__main__':
    main()

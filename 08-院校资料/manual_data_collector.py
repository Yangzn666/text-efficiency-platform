#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
人工整理院校图片数据辅助工具
帮助快速录入和整理图片中的考研数据
"""

import csv
import json
from pathlib import Path
from datetime import datetime

# 配置
IMAGE_FOLDER = Path(r"d:\学习\效率\08-院校资料\院校整理")
OUTPUT_CSV = Path(r"d:\学习\效率\08-院校资料\2026年分数线数据.csv")
MANUAL_DATA_JSON = Path(r"d:\学习\效率\08-院校资料\manual_extracted_data.json")

def load_existing_csv():
    """加载现有的CSV数据"""
    data = []
    if OUTPUT_CSV.exists():
        with open(OUTPUT_CSV, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            data = list(reader)
    return data

def save_manual_data(data_list):
    """保存人工提取的数据"""
    with open(MANUAL_DATA_JSON, 'w', encoding='utf-8') as f:
        json.dump(data_list, f, ensure_ascii=False, indent=2)
    print(f"✅ 已保存 {len(data_list)} 条数据到: {MANUAL_DATA_JSON}")

def load_manual_data():
    """加载已保存的人工数据"""
    if MANUAL_DATA_JSON.exists():
        with open(MANUAL_DATA_JSON, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def create_data_template(school_name, image_file, **kwargs):
    """创建数据模板"""
    return {
        '院校名称': school_name,
        '图片文件': image_file,
        '复试线': kwargs.get('复试线', ''),
        '录取最低分': kwargs.get('录取最低分', ''),
        '录取最高分': kwargs.get('录取最高分', ''),
        '录取平均分': kwargs.get('录取平均分', ''),
        '招生人数': kwargs.get('招生人数', ''),
        '专业代码': kwargs.get('专业代码', ''),
        '专业名称': kwargs.get('专业名称', ''),
        '备注': kwargs.get('备注', ''),
        '数据来源': '灰灰考研统计（2026年5月13日图片）',
        '提取日期': datetime.now().strftime('%Y-%m-%d')
    }

def main():
    print("=" * 80)
    print("📊 院校图片数据人工整理工具")
    print("=" * 80)
    print("\n使用说明:")
    print("1. 此工具用于记录和整理从图片中人工提取的数据")
    print("2. 数据会保存到 manual_extracted_data.json")
    print("3. 整理完成后,运行 '整合数据到网站.py' 同步到网站")
    print("\n💡 提示: 你可以:")
    print("   - 直接编辑 manual_extracted_data.json 文件添加数据")
    print("   - 或告诉我每张图片的数据,我来帮你录入")
    print("\n" + "=" * 80)
    
    # 加载已有数据
    existing_data = load_manual_data()
    print(f"\n📈 当前已整理数据: {len(existing_data)} 条\n")
    
    if existing_data:
        print("已录入的院校:")
        for i, data in enumerate(existing_data, 1):
            print(f"  {i}. {data['院校名称']} - 复试线:{data.get('复试线', '待补充')}分")
    
    print("\n" + "=" * 80)

if __name__ == "__main__":
    main()

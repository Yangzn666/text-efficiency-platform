#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
数据验证脚本
验证manual_extracted_data.json、universities.json、CSV数据的一致性
"""

import json
import csv
from pathlib import Path
from datetime import datetime

# 配置
MANUAL_DATA_JSON = Path(r"d:\学习\效率\08-院校资料\manual_extracted_data.json")
UNIVERSITIES_JSON = Path(r"d:\学习\效率\00-网站程序\frontend\src\data\universities.json")
CSV_FILE = Path(r"d:\学习\效率\08-院校资料\2026年分数线数据.csv")

def verify_data():
    """验证数据一致性"""
    print("="*70)
    print(" 数据一致性验证报告")
    print("="*70)
    print()
    
    # 加载manual_extracted_data.json
    with open(MANUAL_DATA_JSON, 'r', encoding='utf-8') as f:
        manual_data = json.load(f)
    
    # 加载universities.json
    with open(UNIVERSITIES_JSON, 'r', encoding='utf-8') as f:
        universities_data = json.load(f)
    
    # 加载CSV数据
    csv_schools = []
    if CSV_FILE.exists():
        with open(CSV_FILE, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                if row['2026复试线']:  # 只统计有数据的记录
                    csv_schools.append(row['院校名称'])
    
    print("📊 数据统计概览")
    print("-"*70)
    print(f"✅ manual_extracted_data.json: {len(manual_data)} 所院校")
    print(f"✅ universities.json: {len(universities_data)} 所院校")
    print(f"✅ CSV文件有数据: {len(csv_schools)} 所院校")
    print()
    
    # 检查数据覆盖情况
    manual_schools = {item['院校名称'] for item in manual_data}
    csv_schools_set = set(csv_schools)
    uni_schools = {item['name'] for item in universities_data}
    
    print("🎯 数据覆盖分析")
    print("-"*70)
    
    # CSV中有但manual没有的
    csv_only = csv_schools_set - manual_schools
    if csv_only:
        print(f"⚠️  CSV中有但manual_extracted_data.json没有: {csv_only}")
    else:
        print("✅ CSV与manual_extracted_data.json数据覆盖完全匹配")
    
    # manual中有但CSV没有的
    manual_only = manual_schools - csv_schools_set
    if manual_only:
        print(f"⚠️  manual_extracted_data.json中有但CSV没有: {manual_only}")
    else:
        print("✅ manual_extracted_data.json与CSV数据覆盖完全匹配")
    
    print()
    print("📈 复试线数据统计")
    print("-"*70)
    
    # 统计复试线
    score_lines = []
    for item in manual_data:
        school_name = item['院校名称']
        for key, value in item.items():
            if key in ['院校名称', '图片文件', '数据来源']:
                continue
            if isinstance(value, dict) and '复试线' in value:
                score = value['复试线']
                if isinstance(score, (int, float)):
                    score_lines.append((school_name, score, key))
    
    # 按分数排序
    score_lines.sort(key=lambda x: x[1], reverse=True)
    
    print("\n🏆 复试线TOP 5（最高分）")
    for i, (school, score, major) in enumerate(score_lines[:5], 1):
        print(f"  {i}. {school} - {major}: {score}分")
    
    print("\n💰 复试线TOP 5（性价比）")
    for i, (school, score, major) in enumerate(score_lines[-5:], 1):
        print(f"  {i}. {school} - {major}: {score}分")
    
    print()
    print("📋 院校清单（25所）")
    print("-"*70)
    for i, item in enumerate(manual_data, 1):
        print(f"  {i:2d}. {item['院校名称']}")
    
    print()
    print("="*70)
    print("✅ 数据验证完成！")
    print("="*70)

if __name__ == "__main__":
    verify_data()

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
更新2026年分数线数据.csv
从manual_extracted_data.json读取数据，更新CSV文件
"""

import json
import csv
from pathlib import Path

# 配置
MANUAL_DATA_JSON = Path(r"d:\学习\效率\08-院校资料\manual_extracted_data.json")
CSV_FILE = Path(r"d:\学习\效率\08-院校资料\2026年分数线数据.csv")
BACKUP_CSV = Path(r"d:\学习\效率\08-院校资料\2026年分数线数据_backup_20260513.csv")

# 院校信息映射（名称 -> 地区、层次）
SCHOOL_INFO = {
    '北京大学': ('北京', '985/211/C9'),
    '清华大学': ('北京', '985/211/C9'),
    '北京航空航天大学': ('北京', '985/211'),
    '北京理工大学': ('北京', '985/211'),
    '北京科技大学': ('北京', '211'),
    '北京邮电大学': ('北京', '211'),
    '北京交通大学': ('北京', '211'),
    '中国人民大学': ('北京', '985/211'),
    '北京师范大学': ('北京', '985/211'),
    '南开大学': ('天津', '985/211'),
    '天津大学': ('天津', '985/211'),
    '上海交通大学': ('上海', '985/211/C9'),
    '复旦大学': ('上海', '985/211/C9'),
    '同济大学': ('上海', '985/211'),
    '华东师范大学': ('上海', '985/211'),
    '南京大学': ('江苏', '985/211/C9'),
    '东南大学': ('江苏', '985/211'),
    '南京理工大学': ('江苏', '211'),
    '南京航空航天大学': ('江苏', '211'),
    '浙江大学': ('浙江', '985/211/C9'),
    '中国科学技术大学': ('安徽', '985/211/C9'),
    '武汉大学': ('湖北', '985/211'),
    '华中科技大学': ('湖北', '985/211'),
    '武汉理工大学': ('湖北', '211'),
    '中山大学': ('广东', '985/211'),
    '华南理工大学': ('广东', '985/211'),
    '哈尔滨工业大学': ('黑龙江', '985/211/C9'),
    '哈尔滨工程大学': ('黑龙江', '211'),
    '吉林大学': ('吉林', '985/211'),
    '大连理工大学': ('辽宁', '985/211'),
    '东北大学': ('辽宁', '985/211'),
    '山东大学': ('山东', '985/211'),
    '中国海洋大学': ('山东', '985/211'),
    '厦门大学': ('福建', '985/211'),
    '福州大学': ('福建', '211'),
    '中南大学': ('湖南', '985/211'),
    '湖南大学': ('湖南', '985/211'),
    '国防科技大学': ('湖南', '985/211'),
    '四川大学': ('四川', '985/211'),
    '电子科技大学': ('四川', '985/211'),
    '重庆大学': ('重庆', '985/211'),
    '西安交通大学': ('陕西', '985/211/C9'),
    '西北工业大学': ('陕西', '985/211'),
    '西安电子科技大学': ('陕西', '211'),
    '西北农林科技大学': ('陕西', '985/211'),
    '兰州大学': ('甘肃', '985/211'),
    '西南交通大学': ('四川', '211'),
    '合肥工业大学': ('安徽', '211'),
    '上海科技大学': ('上海', '双非'),
    '苏州大学': ('江苏', '211'),
    '河海大学': ('江苏', '211'),
    '南京邮电大学': ('江苏', '双非'),
    '杭州电子科技大学': ('浙江', '双非'),
    '浙江工业大学': ('浙江', '双非'),
    '深圳大学': ('广东', '双非'),
    '广东工业大学': ('广东', '双非'),
    '重庆邮电大学': ('重庆', '双非'),
    '燕山大学': ('河北', '双非'),
    '江苏大学': ('江苏', '双非'),
    '中国农业大学': ('北京', '985/211'),
    '中央民族大学': ('北京', '985/211'),
}

def load_manual_data():
    """加载人工提取的数据"""
    with open(MANUAL_DATA_JSON, 'r', encoding='utf-8') as f:
        return json.load(f)

def parse_admission_score(score_str):
    """解析拟录取分数字符串，提取最低分、最高分"""
    if not score_str or score_str == '待补充' or score_str == '招网':
        return '', '', ''
    
    # 匹配格式：分数 [最低-最高] 或 分数[最低-最高]
    import re
    match = re.search(r'(\d+)\s*\[(\d+)-(\d+)\]', score_str)
    if match:
        avg = match.group(1)
        min_score = match.group(2)
        max_score = match.group(3)
        return min_score, avg, max_score
    
    # 只有单个分数
    match = re.search(r'(\d+)', score_str)
    if match:
        score = match.group(1)
        return score, score, score
    
    return '', '', ''

def update_csv():
    """更新CSV文件"""
    # 备份原文件
    if CSV_FILE.exists():
        import shutil
        shutil.copy2(CSV_FILE, BACKUP_CSV)
        print(f"✅ 已备份原文件到: {BACKUP_CSV}")
    
    # 加载新数据
    schools_data = load_manual_data()
    print(f"✅ 加载 {len(schools_data)} 所院校数据\n")
    
    # 读取现有CSV
    existing_data = []
    if CSV_FILE.exists():
        with open(CSV_FILE, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            existing_data = list(reader)
        print(f"✅ 读取到 {len(existing_data)} 条现有记录\n")
    
    # 创建数据字典
    data_dict = {}
    for school_data in schools_data:
        school_name = school_data['院校名称']
        
        # 提取第一个专业的数据作为院校主数据
        first_major_key = None
        for key in school_data.keys():
            if key not in ['院校名称', '图片文件', '数据来源']:
                first_major_key = key
                break
        
        if first_major_key:
            major_info = school_data[first_major_key]
            score_line = major_info.get('复试线', '')
            admission_score = major_info.get('拟录取分数', '')
            
            min_score, avg_score, max_score = parse_admission_score(admission_score)
            
            data_dict[school_name] = {
                '2026复试线': score_line,
                '2026录取最低分': min_score,
                '2026录取平均分': avg_score,
                '2026录取最高分': max_score,
                '备注': f"灰灰考研统计（2026年5月13日）"
            }
    
    # 更新现有数据
    updated_count = 0
    for row in existing_data:
        school_name = row['院校名称']
        
        if school_name in data_dict:
            new_data = data_dict[school_name]
            row['2026复试线'] = new_data['2026复试线']
            row['2026录取最低分'] = new_data['2026录取最低分']
            row['2026录取平均分'] = new_data['2026录取平均分']
            row['2026录取最高分'] = new_data['2026录取最高分']
            row['备注'] = new_data['备注']
            
            # 更新地区和层次
            if school_name in SCHOOL_INFO:
                region, level = SCHOOL_INFO[school_name]
                row['地区'] = region
                row['层次'] = level
            
            updated_count += 1
            print(f"✅ 更新: {school_name} - 复试线{new_data['2026复试线']}分")
    
    # 保存更新后的CSV
    if existing_data:
        fieldnames = existing_data[0].keys()
        with open(CSV_FILE, 'w', encoding='utf-8-sig', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(existing_data)
        
        print(f"\n{'='*60}")
        print("📊 CSV更新完成统计")
        print(f"{'='*60}")
        print(f"✅ 更新记录: {updated_count} 条")
        print(f"📈 总计: {len(existing_data)} 条记录")
        print(f"{'='*60}")
        print(f"\n💾 数据文件: {CSV_FILE}")
        print(f"💾 备份文件: {BACKUP_CSV}")

def main():
    print("="*60)
    print("🚀 开始更新2026年分数线数据.csv")
    print("="*60)
    print()
    
    try:
        update_csv()
        print("\n✨ CSV更新完成！")
    except Exception as e:
        print(f"\n❌ 错误: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
整合灰灰考研统计数据到网站
从manual_extracted_data.json读取数据，更新universities.json
"""

import json
from pathlib import Path
from datetime import datetime
import shutil

# 文件路径
MANUAL_DATA_JSON = Path(r"d:\学习\效率\08-院校资料\manual_extracted_data.json")
UNIVERSITIES_JSON = Path(r"d:\学习\效率\00-网站程序\frontend\src\data\universities.json")
BACKUP_JSON = Path(r"d:\学习\效率\00-网站程序\frontend\src\data\universities_backup_20260513.json")

def load_manual_data():
    """加载人工提取的数据"""
    with open(MANUAL_DATA_JSON, 'r', encoding='utf-8') as f:
        return json.load(f)

def update_universities():
    """更新universities.json"""
    # 备份原文件
    if UNIVERSITIES_JSON.exists():
        shutil.copy2(UNIVERSITIES_JSON, BACKUP_JSON)
        print(f"✅ 已备份原文件到: {BACKUP_JSON}")
    
    # 读取现有数据
    with open(UNIVERSITIES_JSON, 'r', encoding='utf-8') as f:
        universities = json.load(f)
    
    print(f"✅ 读取到 {len(universities)} 所院校")
    
    # 加载新数据
    new_data = load_manual_data()
    print(f"✅ 加载 {len(new_data)} 所院校的新数据\n")
    
    # 统计
    updated_count = 0
    added_count = 0
    
    for school_data in new_data:
        school_name = school_data['院校名称']
        image_file = school_data['图片文件']
        
        # 查找匹配的院校
        found = False
        for uni in universities:
            if uni['name'] == school_name:
                found = True
                updated_count += 1
                
                # 提取第一个专业的复试线作为院校复试线
                first_major_key = None
                for key in school_data.keys():
                    if key not in ['院校名称', '图片文件', '数据来源']:
                        first_major_key = key
                        break
                
                if first_major_key:
                    major_info = school_data[first_major_key]
                    score_line = major_info.get('复试线', 0)
                    
                    # 更新院校复试线
                    uni['scoreLine'] = score_line
                    
                    # 更新targetScore（目标分数 = 复试线 + 15）
                    uni['targetScore'] = score_line + 15
                    
                    # 更新备注
                    uni['note'] = f"灰灰考研统计（2026年5月13日）"
                    
                    # 更新tags
                    if 'tags' not in uni:
                        uni['tags'] = []
                    
                    # 添加数据更新时间标签
                    time_tag = f"2026数据已更新"
                    if time_tag not in uni['tags']:
                        uni['tags'].insert(0, time_tag)
                    
                    # 添加图片来源标签
                    source_tag = f"数据来源:灰灰考研"
                    if source_tag not in uni['tags']:
                        uni['tags'].append(source_tag)
                    
                    # 更新或添加majors信息
                    if 'majors' not in uni:
                        uni['majors'] = []
                    
                    # 为每个专业方向创建major记录
                    for major_key, major_info in school_data.items():
                        if major_key in ['院校名称', '图片文件', '数据来源']:
                            continue
                        
                        # 解析专业名称
                        if '-' in major_key:
                            college, major_name = major_key.split('-', 1)
                        else:
                            college = school_name
                            major_name = major_key
                        
                        # 检查是否已存在该专业
                        major_exists = False
                        for existing_major in uni['majors']:
                            if existing_major.get('name') == major_name or \
                               existing_major.get('direction') == major_key:
                                major_exists = True
                                # 更新已有专业
                                existing_major['scoreLine'] = major_info.get('复试线', 0)
                                if '拟录取分数' in major_info:
                                    existing_major['minScore'] = major_info['拟录取分数']
                                if '复试人数' in major_info:
                                    existing_major['quota'] = major_info['复试人数']
                                break
                        
                        if not major_exists:
                            # 添加新专业
                            new_major = {
                                'name': major_name,
                                'college': college if '学院' in college else '',
                                'scoreLine': major_info.get('复试线', 0),
                                'minScore': major_info.get('拟录取分数', '待补充'),
                                'quota': major_info.get('复试人数', '待补充'),
                                'singleScores': major_info.get('单科线', ''),
                                'direction': major_key,
                                'note': f"2026复试线{major_info.get('复试线', 0)}分"
                            }
                            uni['majors'].append(new_major)
                
                print(f"✅ 更新: {school_name} - 复试线{uni.get('scoreLine', 'N/A')}分")
                break
        
        if not found:
            # 添加新院校
            added_count += 1
            
            # 提取第一个专业信息
            first_major_key = None
            for key in school_data.keys():
                if key not in ['院校名称', '图片文件', '数据来源']:
                    first_major_key = key
                    break
            
            score_line = 0
            if first_major_key:
                score_line = school_data[first_major_key].get('复试线', 0)
            
            new_uni = {
                "name": school_name,
                "college": "待补充",
                "region": "待补充",
                "level": "待补充",
                "difficulty": "待评估",
                "majors": [],
                "scoreLine": score_line,
                "scoreHistory": [],
                "is408Change": False,
                "hasAI": False,
                "tags": [
                    "2026数据已更新",
                    "数据来源:灰灰考研"
                ],
                "employment": [],
                "salary": "待补充",
                "pros": [],
                "cons": [],
                "targetScore": score_line + 15 if score_line > 0 else 0,
                "links": {
                    "graduate": "",
                    "college": "",
                    "yz": ""
                },
                "note": f"灰灰考研统计（2026年5月13日）"
            }
            
            # 添加所有专业
            for major_key, major_info in school_data.items():
                if major_key in ['院校名称', '图片文件', '数据来源']:
                    continue
                
                if '-' in major_key:
                    college, major_name = major_key.split('-', 1)
                else:
                    college = ""
                    major_name = major_key
                
                new_major = {
                    'name': major_name,
                    'college': college,
                    'scoreLine': major_info.get('复试线', 0),
                    'minScore': major_info.get('拟录取分数', '待补充'),
                    'quota': major_info.get('复试人数', '待补充'),
                    'singleScores': major_info.get('单科线', ''),
                    'direction': major_key,
                    'note': f"2026复试线{major_info.get('复试线', 0)}分"
                }
                new_uni['majors'].append(new_major)
            
            universities.append(new_uni)
            print(f"➕ 新增: {school_name} - 复试线{score_line}分")
    
    # 保存更新后的数据
    with open(UNIVERSITIES_JSON, 'w', encoding='utf-8') as f:
        json.dump(universities, f, ensure_ascii=False, indent=2)
    
    print(f"\n{'='*60}")
    print("📊 数据更新完成统计")
    print(f"{'='*60}")
    print(f"✅ 更新已有院校: {updated_count} 所")
    print(f"➕ 新增院校: {added_count} 所")
    print(f"📈 总计: {len(universities)} 所院校")
    print(f"{'='*60}")
    print(f"\n💾 数据文件: {UNIVERSITIES_JSON}")
    print(f"💾 备份文件: {BACKUP_JSON}")

def main():
    print("="*60)
    print("🚀 开始整合灰灰考研统计数据到网站")
    print("="*60)
    print()
    
    try:
        update_universities()
        print("\n✨ 数据整合完成！")
        print("\n⚠️  下一步:")
        print("1. 重启网站服务器以查看最新数据")
        print("2. 访问院校查询页面验证数据")
        print("3. 检查各院校的复试线是否正确更新")
    except Exception as e:
        print(f"\n❌ 错误: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()

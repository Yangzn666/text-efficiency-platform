#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
修复universities.json中的分数线数据
只使用汇总文件中明确标注的真实数据
对于没有数据的院校，标记为"待补充"而不是使用5的倍数
"""

import json
import re
from pathlib import Path

# 文件路径
UNIVERSITIES_JSON = Path(r"d:\学习\效率\00-网站程序\frontend\src\data\universities.json")
SUMMARY_MD = Path(r"d:\学习\效率\08-院校资料\🌐_网络搜索录取数据汇总.md")

def parse_real_scores_from_summary():
    """从汇总文件中提取真实的分数线数据"""
    with open(SUMMARY_MD, 'r', encoding='utf-8') as f:
        content = f.read()
    
    real_scores = {}
    
    # 查找所有有具体分数线的院校
    # 匹配模式：### X. **院校名** ✅ 或 ⚠️
    school_pattern = r'### \d+\. \*\*(.+?)\*\*\s*(✅|⚠️)'
    
    for match in re.finditer(school_pattern, content):
        school_name = match.group(1).strip()
        status = match.group(2)
        
        # 获取该院校的信息块
        start_pos = match.end()
        next_match = re.search(r'### \d+\. \*\*', content[start_pos:])
        if next_match:
            end_pos = start_pos + next_match.start()
        else:
            end_pos = len(content)
        
        info_block = content[start_pos:end_pos]
        
        # 提取所有提到的分数
        scores_found = {}
        
        # 复试线
        score_matches = re.findall(r'复试线.*?(\d+)分', info_block)
        if score_matches:
            scores_found['scoreLine'] = int(score_matches[0])
        
        # 录取最低分
        min_matches = re.findall(r'(?:录取最低分|进复试最低分).*?(\d+)分', info_block)
        if min_matches:
            scores_found['minScore'] = int(min_matches[0])
        
        # 录取最高分
        max_matches = re.findall(r'(?:录取最高分|进复试最高分).*?(\d+)分', info_block)
        if max_matches:
            scores_found['maxScore'] = int(max_matches[0])
        
        # 录取平均分
        avg_matches = re.findall(r'(?:录取平均分|复试均分).*?([\d.]+)分', info_block)
        if avg_matches:
            scores_found['avgScore'] = float(avg_matches[0])
        
        # 招生人数
        quota_matches = re.findall(r'招生人数.*?(\d+)', info_block)
        if quota_matches:
            scores_found['quota'] = int(quota_matches[0])
        
        if scores_found:
            real_scores[school_name] = {
                'status': status,
                'scores': scores_found
            }
    
    print(f"✅ 从汇总文件中提取到 {len(real_scores)} 所院校的真实数据")
    return real_scores


def fix_universities_json(real_scores):
    """修复universities.json文件"""
    # 读取现有数据
    with open(UNIVERSITIES_JSON, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    fixed_count = 0
    marked_count = 0
    
    for school in data:
        school_name = school['name']
        
        # 检查是否有真实数据
        if school_name in real_scores:
            real_data = real_scores[school_name]['scores']
            
            # 更新majors中的分数线
            if 'majors' in school and school['majors']:
                for major in school['majors']:
                    if 'scoreLine' in real_data:
                        major['scoreLine'] = real_data['scoreLine']
                        fixed_count += 1
                    
                    if 'minScore' in real_data:
                        major['minScore'] = str(real_data['minScore'])
                    
                    if 'avgScore' in real_data:
                        major['avgScore'] = str(int(real_data['avgScore'])) if isinstance(real_data['avgScore'], float) else str(real_data['avgScore'])
            
            # 更新整体分数线
            if 'scoreLine' in real_data:
                school['scoreLine'] = real_data['scoreLine']
            
            # 更新targetScore
            if 'scoreLine' in real_data:
                school['targetScore'] = real_data['scoreLine'] + 10
        else:
            # 没有真实数据，标记为待补充
            if 'majors' in school and school['majors']:
                for major in school['majors']:
                    # 如果当前是5的倍数且不是真实数据，标记为待补充
                    if major.get('scoreLine', 0) % 5 == 0 and major.get('scoreLine', 0) > 0:
                        # 检查这个分数是否来自真实数据
                        if school_name not in real_scores:
                            major['scoreLine'] = 0  # 重置为0表示待补充
                            major['minScore'] = "待补充"
                            major['avgScore'] = "待补充"
                            marked_count += 1
            
            if school.get('scoreLine', 0) % 5 == 0 and school.get('scoreLine', 0) > 0:
                if school_name not in real_scores:
                    school['scoreLine'] = 0
                    school['targetScore'] = 0
                    marked_count += 1
    
    # 保存修复后的数据
    with open(UNIVERSITIES_JSON, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"\n{'='*60}")
    print("📊 修复完成统计")
    print(f"{'='*60}")
    print(f"✅ 更新了 {fixed_count} 个专业的真实分数线")
    print(f"⚠️  标记了 {marked_count} 个待补充的数据")
    print(f"{'='*60}")


def main():
    print("="*60)
    print("🔧 开始修复分数线数据")
    print("="*60)
    
    # 提取真实数据
    print("\n📖 正在从汇总文件中提取真实数据...")
    real_scores = parse_real_scores_from_summary()
    
    # 显示一些示例
    print("\n📋 真实数据示例：")
    for name, info in list(real_scores.items())[:5]:
        print(f"  - {name}: {info['scores']}")
    
    # 修复JSON文件
    print("\n🔄 正在修复universities.json...")
    fix_universities_json(real_scores)
    
    print("\n✨ 修复完成！")
    print("\n⚠️  请重启网站服务器以查看修复后的数据")


if __name__ == "__main__":
    main()

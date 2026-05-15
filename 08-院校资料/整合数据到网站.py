#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
将网络搜索的59所院校数据整合到网站的universities.json文件中
"""

import json
import re
from pathlib import Path

# 文件路径
UNIVERSITIES_JSON = Path(r"d:\学习\效率\00-网站程序\frontend\src\data\universities.json")
SUMMARY_MD = Path(r"d:\学习\效率\08-院校资料\🌐_网络搜索录取数据汇总.md")
BACKUP_JSON = Path(r"d:\学习\效率\00-网站程序\frontend\src\data\universities_backup.json")

def parse_summary_md():
    """解析汇总Markdown文件，提取院校数据"""
    with open(SUMMARY_MD, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 按院校分割
    schools = []
    school_blocks = re.split(r'### \d+\. \*\*(.+?)\*\*', content)
    
    # 跳过第一个空块
    for i in range(1, len(school_blocks), 2):
        school_name = school_blocks[i].strip()
        if i + 1 < len(school_blocks):
            info_block = school_blocks[i + 1]
            
            # 提取关键信息
            school_data = {
                'name': school_name,
                'status': '✅' if '✅' in school_name else ('⚠️' if '⚠️' in school_name else '❌'),
                'info': info_block
            }
            
            # 提取复试线
            score_match = re.search(r'复试线.*?(\d+)分', info_block)
            if score_match:
                school_data['scoreLine'] = int(score_match.group(1))
            
            # 提取最低分
            min_score_match = re.search(r'(?:录取最低分|进复试最低分).*?(\d+)分', info_block)
            if min_score_match:
                school_data['minScore'] = int(min_score_match.group(1))
            
            # 提取最高分
            max_score_match = re.search(r'(?:录取最高分|进复试最高分).*?(\d+)分', info_block)
            if max_score_match:
                school_data['maxScore'] = int(max_score_match.group(1))
            
            # 提取平均分
            avg_score_match = re.search(r'(?:录取平均分|复试均分).*?([\d.]+)分', info_block)
            if avg_score_match:
                school_data['avgScore'] = float(avg_score_match.group(1))
            
            # 提取招生人数
            quota_match = re.search(r'招生人数.*?(\d+)', info_block)
            if quota_match:
                school_data['quota'] = int(quota_match.group(1))
            
            # 提取备注
            note_match = re.search(r'备注.*?:\s*(.+?)(?:\n\n|\*\*数据来源)', info_block, re.DOTALL)
            if note_match:
                school_data['note'] = note_match.group(1).strip()
            
            # 提取数据来源
            source_match = re.search(r'\*\*数据来源\*\*:\s*(.+?)(?:\n|$)', info_block)
            if source_match:
                school_data['source'] = source_match.group(1).strip()
            
            schools.append(school_data)
    
    print(f"✅ 成功解析 {len(schools)} 所院校的数据")
    return schools


def determine_difficulty(score_line=None, school_name=""):
    """根据分数线和学校名称确定难度等级"""
    # 顶尖名校
    top_schools = ["清华大学", "北京大学", "复旦大学", "上海交通大学", "浙江大学"]
    if any(s in school_name for s in top_schools):
        return "S+"
    
    # C9和其他顶尖985
    c9_schools = ["中国科学技术大学", "南京大学", "哈尔滨工业大学", "西安交通大学"]
    if any(s in school_name for s in c9_schools):
        return "S"
    
    # 根据分数线判断
    if score_line:
        if score_line >= 380:
            return "S"
        elif score_line >= 360:
            return "A+"
        elif score_line >= 340:
            return "A"
        elif score_line >= 320:
            return "B+"
        elif score_line >= 300:
            return "B"
        else:
            return "C"
    
    return "B"


def update_universities_json(new_schools_data):
    """更新universities.json文件"""
    # 备份原文件
    if UNIVERSITIES_JSON.exists():
        import shutil
        shutil.copy2(UNIVERSITIES_JSON, BACKUP_JSON)
        print(f"✅ 已备份原文件到: {BACKUP_JSON}")
    
    # 读取现有数据
    existing_data = []
    if UNIVERSITIES_JSON.exists():
        with open(UNIVERSITIES_JSON, 'r', encoding='utf-8') as f:
            existing_data = json.load(f)
        print(f"✅ 读取到 {len(existing_data)} 所现有院校数据")
    
    # 创建现有院校的字典（以学校名为key）
    existing_dict = {school['name']: school for school in existing_data}
    
    # 更新或添加新数据
    updated_count = 0
    added_count = 0
    
    for new_school in new_schools_data:
        school_name = new_school['name'].replace('✅', '').replace('⚠️', '').replace('❌', '').strip()
        
        # 如果已存在，更新数据
        if school_name in existing_dict:
            existing_school = existing_dict[school_name]
            
            # 更新majors中的分数线信息
            if 'majors' in existing_school and existing_school['majors']:
                for major in existing_school['majors']:
                    if 'scoreLine' in new_school:
                        major['scoreLine'] = new_school['scoreLine']
                    if 'minScore' in new_school:
                        major['minScore'] = str(new_school['minScore'])
                    if 'avgScore' in new_school:
                        major['avgScore'] = str(int(new_school['avgScore'])) if isinstance(new_school['avgScore'], float) else new_school['avgScore']
            
            # 更新整体分数线
            if 'scoreLine' in new_school:
                existing_school['scoreLine'] = new_school['scoreLine']
            
            # 更新难度等级
            existing_school['difficulty'] = determine_difficulty(
                new_school.get('scoreLine'), 
                school_name
            )
            
            # 添加备注信息到tags
            if 'note' in new_school:
                if 'tags' not in existing_school:
                    existing_school['tags'] = []
                # 只添加不重复的标签
                note_tags = [tag.strip() for tag in new_school['note'].split('\n') if tag.strip()]
                for tag in note_tags[:3]:  # 最多添加3个标签
                    if tag not in existing_school['tags']:
                        existing_school['tags'].append(tag)
            
            updated_count += 1
        else:
            # 创建新的院校记录
            new_record = {
                "name": school_name,
                "college": "待补充",
                "region": "待补充",
                "level": "985 / 211",
                "difficulty": determine_difficulty(new_school.get('scoreLine'), school_name),
                "majors": [
                    {
                        "code": "081200",
                        "name": "计算机科学与技术",
                        "type": "学术型硕士",
                        "scoreLine": new_school.get('scoreLine', 0),
                        "politics": 50,
                        "english": 50,
                        "course1": 80,
                        "course2": 80,
                        "minScore": str(new_school.get('minScore', '待补充')),
                        "avgScore": str(int(new_school['avgScore'])) if 'avgScore' in new_school else "待补充",
                        "quota": new_school.get('quota')
                    }
                ],
                "scoreLine": new_school.get('scoreLine', 0),
                "scoreHistory": [],
                "is408Change": False,
                "hasAI": False,
                "tags": [],
                "employment": [],
                "salary": "待补充",
                "pros": [],
                "cons": [],
                "targetScore": new_school.get('scoreLine', 0) + 10 if 'scoreLine' in new_school else 0,
                "links": {
                    "graduate": "",
                    "college": "",
                    "yz": ""
                }
            }
            
            # 添加备注
            if 'note' in new_school:
                note_tags = [tag.strip() for tag in new_school['note'].split('\n') if tag.strip()]
                new_record['tags'] = note_tags[:3]
            
            existing_data.append(new_record)
            added_count += 1
    
    # 保存更新后的数据
    with open(UNIVERSITIES_JSON, 'w', encoding='utf-8') as f:
        json.dump(existing_data, f, ensure_ascii=False, indent=2)
    
    print(f"\n{'='*60}")
    print("📊 数据更新完成统计")
    print(f"{'='*60}")
    print(f"✅ 更新已有院校: {updated_count} 所")
    print(f"➕ 新增院校: {added_count} 所")
    print(f"📈 总计: {len(existing_data)} 所院校")
    print(f"{'='*60}")


def main():
    print("="*60)
    print("🚀 开始整合59所院校数据到网站")
    print("="*60)
    
    # 解析汇总文件
    print("\n📖 正在解析汇总文件...")
    schools_data = parse_summary_md()
    
    # 更新JSON文件
    print("\n🔄 正在更新universities.json...")
    update_universities_json(schools_data)
    
    print("\n✨ 数据整合完成！")
    print(f"💾 数据文件: {UNIVERSITIES_JSON}")
    print(f"💾 备份文件: {BACKUP_JSON}")
    print("\n⚠️  请重启网站服务器以查看最新数据")


if __name__ == "__main__":
    main()

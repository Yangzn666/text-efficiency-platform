#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
从10张图片中提取的数据更新到universities.json
数据来源：灰灰考研统计（官方官网已公开公示信息）
"""

import json
from pathlib import Path

# 文件路径
UNIVERSITIES_JSON = Path(r"d:\学习\效率\00-网站程序\frontend\src\data\universities.json")
BACKUP_JSON = Path(r"d:\学习\效率\00-网站程序\frontend\src\data\universities_backup2.json")

# 10所院校的关键数据（从图片中提取）
NEW_DATA = {
    "北京大学": {
        "college": "计算机学院/智能学院/软件与微电子学院",
        "scoreLine": 340,
        "majors": [
            {
                "code": "081200",
                "name": "计算机科学与技术",
                "type": "学术型硕士",
                "scoreLine": 340,
                "politics": 55,
                "english": 55,
                "course1": 90,
                "course2": 90,
                "minScore": "350",
                "avgScore": "385",
                "quota": 24
            },
            {
                "code": "085400",
                "name": "电子信息（软件工程）",
                "type": "专业型硕士",
                "scoreLine": 373,
                "politics": 55,
                "english": 90,
                "course1": 90,
                "course2": 90,
                "minScore": "378",
                "avgScore": "400",
                "quota": 60
            }
        ],
        "tags": ["C9联盟", "计算机A+", "深圳研究院招生"],
        "note": "图片数据来源：灰灰考研统计（2026年5月13日）"
    },
    "清华大学": {
        "college": "计算机科学与技术系/软件学院/深圳国际研究生院",
        "scoreLine": 330,
        "majors": [
            {
                "code": "081200",
                "name": "数据科学和信息技术",
                "type": "学术型硕士",
                "scoreLine": 340,
                "politics": 50,
                "english": 80,
                "course1": 70,
                "course2": 70,
                "minScore": "370",
                "avgScore": "390",
                "quota": 3
            },
            {
                "code": "085405",
                "name": "软件工程",
                "type": "专业型硕士",
                "scoreLine": 330,
                "politics": 50,
                "english": 50,
                "course1": 80,
                "course2": 80,
                "minScore": "364",
                "avgScore": "382",
                "quota": 79
            }
        ],
        "tags": ["C9联盟", "计算机A+", "深圳研究院"],
        "note": "图片数据来源：灰灰考研统计（2026年5月13日）"
    },
    "浙江大学": {
        "college": "计算机科学与技术学院/软件学院/海洋学院",
        "scoreLine": 332,
        "majors": [
            {
                "code": "081200",
                "name": "计算机科学与技术",
                "type": "学术型硕士",
                "scoreLine": 332,
                "politics": 50,
                "english": 75,
                "course1": 75,
                "course2": 75,
                "minScore": "386",
                "avgScore": "404",
                "quota": 9
            },
            {
                "code": "085405",
                "name": "软件工程",
                "type": "专业型硕士",
                "scoreLine": 378,
                "politics": 50,
                "english": 75,
                "course1": 75,
                "course2": 75,
                "minScore": "390",
                "avgScore": "408",
                "quota": 5
            }
        ],
        "tags": ["C9联盟", "计算机A+", "软件学院宁波校区"],
        "note": "图片数据来源：灰灰考研统计（2026年5月13日）"
    },
    "国防科技大学": {
        "college": "计算机学院/电子对抗学院/系统工程学院",
        "scoreLine": 325,
        "majors": [
            {
                "code": "081200",
                "name": "计算机科学与技术",
                "type": "学术型硕士",
                "scoreLine": 355,
                "politics": 50,
                "english": 45,
                "course1": 80,
                "course2": 80,
                "minScore": "371",
                "avgScore": "390",
                "quota": 13
            },
            {
                "code": "085404",
                "name": "软件工程",
                "type": "专业型硕士",
                "scoreLine": 325,
                "politics": 50,
                "english": 45,
                "course1": 80,
                "course2": 80,
                "minScore": "338",
                "avgScore": "355",
                "quota": 16
            }
        ],
        "tags": ["985高校", "计算机A+", "军校背景", "地方生招生"],
        "note": "图片数据来源：灰灰考研统计（2026年5月13日）"
    },
    "北京航空航天大学": {
        "college": "计算机学院/软件学院/人工智能研究院",
        "scoreLine": 310,
        "majors": [
            {
                "code": "081200",
                "name": "计算机科学与技术",
                "type": "学术型硕士",
                "scoreLine": 360,
                "politics": 40,
                "english": 60,
                "course1": 60,
                "course2": 60,
                "minScore": "371",
                "avgScore": "389",
                "quota": 38
            },
            {
                "code": "085405",
                "name": "软件工程",
                "type": "专业型硕士",
                "scoreLine": 330,
                "politics": 40,
                "english": 60,
                "course1": 60,
                "course2": 60,
                "minScore": "345",
                "avgScore": "356",
                "quota": 144
            }
        ],
        "tags": ["985高校", "计算机A", "杭州国际创新研究院"],
        "note": "图片数据来源：灰灰考研统计（2026年5月13日）"
    },
    "哈尔滨工业大学": {
        "college": "计算学部/未来学院/深圳校区",
        "scoreLine": 365,
        "majors": [
            {
                "code": "081200",
                "name": "计算机科学与技术",
                "type": "学术型硕士",
                "scoreLine": 395,
                "politics": 50,
                "english": 45,
                "course1": 70,
                "course2": 70,
                "minScore": "405",
                "avgScore": "420",
                "quota": 11
            },
            {
                "code": "085400",
                "name": "电子信息",
                "type": "专业型硕士",
                "scoreLine": 365,
                "politics": 50,
                "english": 45,
                "course1": 70,
                "course2": 70,
                "minScore": "376",
                "avgScore": "395",
                "quota": 100
            }
        ],
        "tags": ["C9联盟", "计算机A", "深圳校区", "多校区办学"],
        "note": "图片数据来源：灰灰考研统计（2026年5月13日）"
    },
    "上海交通大学": {
        "college": "计算机学院/人工智能学院/网络空间安全学院",
        "scoreLine": 360,
        "majors": [
            {
                "code": "081200",
                "name": "计算机科学与技术",
                "type": "学术型硕士",
                "scoreLine": 369,
                "politics": 60,
                "english": 60,
                "course1": 90,
                "course2": 90,
                "minScore": "390",
                "avgScore": "410",
                "quota": 5
            },
            {
                "code": "085405",
                "name": "软件工程",
                "type": "专业型硕士",
                "scoreLine": 378,
                "politics": 60,
                "english": 60,
                "course1": 90,
                "course2": 90,
                "minScore": "388",
                "avgScore": "405",
                "quota": 10
            }
        ],
        "tags": ["C9联盟", "计算机A", "人工智能学院"],
        "note": "图片数据来源：灰灰考研统计（2026年5月13日）"
    },
    "华中科技大学": {
        "college": "计算机科学与技术学院/软件学院/网络空间安全学院",
        "scoreLine": 360,
        "majors": [
            {
                "code": "081200",
                "name": "计算机科学与技术",
                "type": "学术型硕士",
                "scoreLine": 360,
                "politics": 50,
                "english": 90,
                "course1": 90,
                "course2": 90,
                "minScore": "372",
                "avgScore": "382",
                "quota": 13
            },
            {
                "code": "085404",
                "name": "计算机技术",
                "type": "专业型硕士",
                "scoreLine": 330,
                "politics": 50,
                "english": 90,
                "course1": 90,
                "course2": 90,
                "minScore": "371",
                "avgScore": "380",
                "quota": 125
            }
        ],
        "tags": ["985高校", "计算机A-", "人工智能学院"],
        "note": "图片数据来源：灰灰考研统计（2026年5月13日）"
    },
    "电子科技大学": {
        "college": "计算机科学与工程学院/信息与软件工程学院",
        "scoreLine": 340,
        "majors": [
            {
                "code": "081200",
                "name": "计算机科学与技术",
                "type": "学术型硕士",
                "scoreLine": 340,
                "politics": 50,
                "english": 90,
                "course1": 90,
                "course2": 90,
                "minScore": "366",
                "avgScore": "375",
                "quota": 18
            },
            {
                "code": "085404",
                "name": "计算机技术",
                "type": "专业型硕士",
                "scoreLine": 355,
                "politics": 50,
                "english": 90,
                "course1": 90,
                "course2": 90,
                "minScore": "366",
                "avgScore": "375",
                "quota": 126
            }
        ],
        "tags": ["985高校", "计算机A-", "深圳高等研究院"],
        "note": "图片数据来源：灰灰考研统计（2026年5月13日）"
    },
    "南京大学": {
        "college": "计算机科学与技术学院/软件学院/人工智能学院",
        "scoreLine": 363,
        "majors": [
            {
                "code": "081200",
                "name": "计算机科学与技术",
                "type": "学术型硕士",
                "scoreLine": 371,
                "politics": 50,
                "english": 75,
                "course1": 75,
                "course2": 75,
                "minScore": "378",
                "avgScore": "385",
                "quota": 12
            },
            {
                "code": "085405",
                "name": "软件工程",
                "type": "专业型硕士",
                "scoreLine": 341,
                "politics": 50,
                "english": 75,
                "course1": 75,
                "course2": 75,
                "minScore": "375",
                "avgScore": "380",
                "quota": 6
            }
        ],
        "tags": ["C9联盟", "计算机A", "人工智能学院"],
        "note": "图片数据来源：灰灰考研统计（2026年5月13日）"
    }
}


def update_with_image_data():
    """使用图片中的数据更新universities.json"""
    # 备份原文件
    import shutil
    if UNIVERSITIES_JSON.exists():
        shutil.copy2(UNIVERSITIES_JSON, BACKUP_JSON)
        print(f"✅ 已备份原文件到: {BACKUP_JSON}")
    
    # 读取现有数据
    with open(UNIVERSITIES_JSON, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    updated_count = 0
    
    for school in data:
        school_name = school['name']
        
        if school_name in NEW_DATA:
            new_info = NEW_DATA[school_name]
            
            # 更新学院信息
            if 'college' in new_info:
                school['college'] = new_info['college']
            
            # 更新分数线
            if 'scoreLine' in new_info:
                school['scoreLine'] = new_info['scoreLine']
                school['targetScore'] = new_info['scoreLine'] + 10
            
            # 更新专业数据
            if 'majors' in new_info and new_info['majors']:
                # 保留原有major，但更新数据
                for new_major in new_info['majors']:
                    # 查找匹配的major
                    for existing_major in school.get('majors', []):
                        if existing_major['code'] == new_major['code']:
                            existing_major.update(new_major)
                            break
                    else:
                        # 如果没有匹配的，添加新的
                        if 'majors' not in school:
                            school['majors'] = []
                        school['majors'].append(new_major)
            
            # 更新标签
            if 'tags' in new_info:
                if 'tags' not in school:
                    school['tags'] = []
                for tag in new_info['tags']:
                    if tag not in school['tags']:
                        school['tags'].append(tag)
            
            # 添加数据来源说明
            if 'note' in new_info:
                if 'note' not in school:
                    school['note'] = new_info['note']
            
            updated_count += 1
            print(f"✅ 已更新: {school_name}")
    
    # 保存更新后的数据
    with open(UNIVERSITIES_JSON, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"\n{'='*60}")
    print(f"📊 更新完成")
    print(f"{'='*60}")
    print(f"✅ 成功更新: {updated_count} 所院校")
    print(f"📈 总计: {len(data)} 所院校")
    print(f"{'='*60}")
    print(f"\n💾 数据文件: {UNIVERSITIES_JSON}")
    print(f"💾 备份文件: {BACKUP_JSON}")


if __name__ == "__main__":
    print("="*60)
    print("🚀 开始更新10所院校数据（来自图片）")
    print("="*60)
    print("\n📋 将要更新的院校:")
    for i, school in enumerate(NEW_DATA.keys(), 1):
        print(f"  {i}. {school}")
    
    print("\n🔄 正在更新...\n")
    update_with_image_data()
    
    print("\n✨ 更新完成！")
    print("\n⚠️  请重启网站服务器以查看最新数据")

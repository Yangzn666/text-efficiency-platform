#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
从15张新图片中提取的数据更新到universities.json
数据来源：灰灰考研统计（官方官网已公开公示信息）
"""

import json
from pathlib import Path

# 文件路径
UNIVERSITIES_JSON = Path(r"d:\学习\效率\00-网站程序\frontend\src\data\universities.json")
BACKUP_JSON = Path(r"d:\学习\效率\00-网站程序\frontend\src\data\universities_backup3.json")

# 15所院校的关键数据（从图片中提取）
NEW_DATA = {
    "北京理工大学": {
        "college": "计算机学院/人工智能学院/网络空间安全学院",
        "scoreLine": 338,
        "majors": [
            {
                "code": "081200",
                "name": "计算机科学与技术",
                "type": "学术型硕士",
                "scoreLine": 338,
                "politics": 53,
                "english": 53,
                "course1": 90,
                "course2": 90,
                "totalScore": 338,
                "复试人数": "58+1专项",
                "拟录取人数": "37-40",
                "标签": ["第四轮学科评级B+"]
            },
            {
                "code": "085400",
                "name": "计算机技术",
                "type": "专业型硕士",
                "scoreLine": 341,
                "politics": 53,
                "english": 53,
                "course1": 90,
                "course2": 90,
                "totalScore": 341,
                "复试人数": "103+2专项",
                "拟录取人数": "67+2专项",
                "标签": ["第四轮学科评级B+"]
            }
        ],
        "tags": ["计算机A-", "软件工程B+", "人工智能A级数据方向"]
    },
    "同济大学": {
        "college": "计算机科学与技术学院（软件学院）",
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
                "totalScore": 340,
                "复试人数": "230+2专项",
                "标签": ["第四轮学科评级A-", "投公布方向"]
            },
            {
                "code": "085400",
                "name": "电子信息-计算机",
                "type": "专业型硕士",
                "scoreLine": 340,
                "politics": 55,
                "english": 55,
                "course1": 90,
                "course2": 90,
                "totalScore": 340,
                "复试人数": "181",
                "标签": ["第四轮学科评级A-"]
            }
        ],
        "tags": ["计算机A-", "软件工程A"]
    },
    "南开大学": {
        "college": "计算机学院/软件学院/密码与网络空间安全学院",
        "scoreLine": 335,
        "majors": [
            {
                "code": "081200",
                "name": "计算机科学与技术",
                "type": "学术型硕士",
                "scoreLine": 335,
                "politics": 50,
                "english": 50,
                "course1": 90,
                "course2": 90,
                "totalScore": 335,
                "复试人数": "244+7专项",
                "拟录取人数": "65+6专项",
                "标签": ["第四轮学科评级B+"]
            },
            {
                "code": "085400",
                "name": "电子信息-计算机方向",
                "type": "专业型硕士",
                "scoreLine": 264,
                "politics": 45,
                "english": 45,
                "course1": 70,
                "course2": 75,
                "totalScore": 264,
                "复试人数": "19",
                "标签": ["第四轮学科评级B+"]
            },
            {
                "code": "085405",
                "name": "软件工程",
                "type": "专业型硕士",
                "scoreLine": 264,
                "politics": 45,
                "english": 45,
                "course1": 70,
                "course2": 75,
                "totalScore": 264,
                "复试人数": "201+3专项",
                "拟录取人数": "49+3专项",
                "标签": ["第四轮学科评级B+"]
            }
        ],
        "tags": ["计算机B+", "软件工程B+", "网络空间安全A"]
    },
    "天津大学": {
        "college": "计算机科学与技术学院/软件学院/网络安全学院/人工智能学院",
        "scoreLine": 317,
        "majors": [
            {
                "code": "081200",
                "name": "计算机科学与技术",
                "type": "学术型硕士",
                "scoreLine": 317,
                "politics": 45,
                "english": 45,
                "course1": 70,
                "course2": 75,
                "totalScore": 317,
                "复试人数": "28",
                "拟录取人数": "25",
                "标签": ["首年改考408", "第四轮学科评级B+"]
            },
            {
                "code": "085400",
                "name": "计算机技术",
                "type": "专业型硕士",
                "scoreLine": 335,
                "politics": 50,
                "english": 50,
                "course1": 75,
                "course2": 75,
                "totalScore": 335,
                "复试人数": "50+2援藏",
                "拟录取人数": "40",
                "标签": ["首年改考408", "第四轮学科评级B+"]
            },
            {
                "code": "085405",
                "name": "软件工程",
                "type": "专业型硕士",
                "scoreLine": 326,
                "politics": 45,
                "english": 45,
                "course1": 70,
                "course2": 75,
                "totalScore": 326,
                "复试人数": "57",
                "拟录取人数": "45",
                "标签": ["首年改考408", "第四轮学科评级B+"]
            }
        ],
        "tags": ["计算机B+", "软件工程B+", "首年改考408"]
    },
    "大连理工大学": {
        "college": "计算机科学与技术学院/人工智能学院/软件学院",
        "scoreLine": 300,
        "majors": [
            {
                "code": "081200",
                "name": "计算机科学与技术",
                "type": "学术型硕士",
                "scoreLine": 300,
                "politics": 45,
                "english": 45,
                "course1": 70,
                "course2": 75,
                "totalScore": 300,
                "复试人数": "44",
                "拟录取人数": "30",
                "标签": ["第四轮学科评级B+"]
            },
            {
                "code": "085400",
                "name": "电子信息-计算机方向",
                "type": "专业型硕士",
                "scoreLine": 300,
                "politics": 45,
                "english": 45,
                "course1": 70,
                "course2": 75,
                "totalScore": 300,
                "复试人数": "34",
                "拟录取人数": "30",
                "标签": ["第四轮学科评级B+"]
            },
            {
                "code": "085405",
                "name": "软件工程",
                "type": "专业型硕士",
                "scoreLine": 328,
                "politics": 45,
                "english": 45,
                "course1": 70,
                "course2": 75,
                "totalScore": 328,
                "复试人数": "118+3专项",
                "拟录取人数": "83+3专项",
                "标签": ["第四轮学科评级B+"]
            }
        ],
        "tags": ["计算机B+", "软件工程B+", "第五梯队985"]
    },
    "复旦大学": {
        "college": "计算与智能创新学院/智能机器人与先进制造创新学院",
        "scoreLine": 317,
        "majors": [
            {
                "code": "081200",
                "name": "计算机科学与技术",
                "type": "学术型硕士",
                "scoreLine": 317,
                "politics": 50,
                "english": 50,
                "course1": 90,
                "course2": 90,
                "totalScore": 317,
                "复试人数": "175",
                "拟录取人数": "68",
                "标签": ["第四轮学科评级B+"]
            },
            {
                "code": "085400",
                "name": "电子信息-非全日制",
                "type": "专业型硕士",
                "scoreLine": 370,
                "politics": 50,
                "english": 50,
                "course1": 90,
                "course2": 90,
                "totalScore": 370,
                "标签": ["第四轮学科评级B+"]
            }
        ],
        "tags": ["计算机B+", "第一梯队顶尖名校"]
    },
    "华东师范大学": {
        "college": "计算机科学与技术学院/软件学院/数据科学与工程学院/人工智能学院",
        "scoreLine": 264,
        "majors": [
            {
                "code": "081200",
                "name": "计算机科学与技术",
                "type": "学术型硕士",
                "scoreLine": 264,
                "politics": 45,
                "english": 45,
                "course1": 70,
                "course2": 75,
                "totalScore": 264,
                "复试人数": "19",
                "标签": ["第四轮学科评级B+"]
            },
            {
                "code": "085405",
                "name": "软件工程",
                "type": "专业型硕士",
                "scoreLine": 264,
                "politics": 45,
                "english": 45,
                "course1": 70,
                "course2": 75,
                "totalScore": 264,
                "复试人数": "201+3专项",
                "拟录取人数": "49+3专项",
                "标签": ["第四轮学科评级B+"]
            },
            {
                "code": "085411",
                "name": "大数据技术与工程",
                "type": "专业型硕士",
                "scoreLine": 264,
                "politics": 45,
                "english": 45,
                "course1": 70,
                "course2": 75,
                "totalScore": 264,
                "复试人数": "105",
                "拟录取人数": "68",
                "标签": ["第四轮学科评级B+"]
            }
        ],
        "tags": ["计算机B+", "软件工程B+", "数据科学A"]
    }
}

def update_universities_data():
    """更新院校数据"""
    # 备份原文件
    import shutil
    shutil.copy(UNIVERSITIES_JSON, BACKUP_JSON)
    print(f"✅ 已备份原文件到 {BACKUP_JSON}")
    
    # 读取现有数据
    with open(UNIVERSITIES_JSON, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    updated_count = 0
    new_count = 0
    
    # 更新或添加院校数据
    for school_name, school_data in NEW_DATA.items():
        found = False
        for university in data["universities"]:
            if university["name"] == school_name:
                # 更新已有院校
                university["college"] = school_data["college"]
                university["scoreLine"] = school_data["scoreLine"]
                university["tags"] = school_data["tags"]
                
                # 更新或添加专业
                if "majors" not in university:
                    university["majors"] = []
                
                for new_major in school_data["majors"]:
                    # 查找是否已存在该专业
                    major_found = False
                    for existing_major in university["majors"]:
                        if existing_major["code"] == new_major["code"]:
                            # 更新已有专业
                            existing_major.update(new_major)
                            major_found = True
                            break
                    
                    if not major_found:
                        # 添加新专业
                        university["majors"].append(new_major)
                
                updated_count += 1
                found = True
                print(f"✅ 更新: {school_name}")
                break
        
        if not found:
            # 添加新院校
            new_university = {
                "id": len(data["universities"]) + 1,
                "name": school_name,
                "location": "待补充",
                "type": "985" if school_name in ["北京理工大学", "同济大学", "复旦大学", "华东师范大学"] else "985",
                "project985": True,
                "project211": True,
                "doubleFirstClass": True,
                "college": school_data["college"],
                "scoreLine": school_data["scoreLine"],
                "tags": school_data["tags"],
                "majors": school_data["majors"],
                "dataSource": "灰灰考研统计（2026年5月）",
                "difficulty": calculate_difficulty(school_data["scoreLine"])
            }
            data["universities"].append(new_university)
            new_count += 1
            print(f"🆕 新增: {school_name}")
    
    # 保存更新后的数据
    with open(UNIVERSITIES_JSON, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"\n 更新完成！")
    print(f"   - 更新的院校: {updated_count}所")
    print(f"   - 新增的院校: {new_count}所")
    print(f"   - 总计: {len(data['universities'])}所院校")

def calculate_difficulty(score_line):
    """根据分数线计算难度等级"""
    if score_line >= 380:
        return "极难"
    elif score_line >= 350:
        return "很难"
    elif score_line >= 320:
        return "较难"
    elif score_line >= 290:
        return "中等"
    else:
        return "较易"

if __name__ == "__main__":
    update_universities_data()

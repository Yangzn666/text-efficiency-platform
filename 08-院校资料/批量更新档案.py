#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量更新院校档案文件
从manual_extracted_data.json读取数据，更新各院校的招生数据
"""

import json
from pathlib import Path
from datetime import datetime

# 配置
MANUAL_DATA_JSON = Path(r"d:\学习\效率\08-院校资料\manual_extracted_data.json")
ARCHIVES_BASE = Path(r"d:\学习\效率\08-院校资料\02-详细院校档案")

def load_manual_data():
    """加载人工提取的数据"""
    with open(MANUAL_DATA_JSON, 'r', encoding='utf-8') as f:
        return json.load(f)

def update_school_archive(school_name, school_data):
    """更新单个院校的档案文件"""
    school_dir = ARCHIVES_BASE / school_name
    info_file = school_dir / "基本信息.md"
    
    if not info_file.exists():
        print(f"  ⚠️  档案文件不存在: {info_file}")
        return False
    
    # 读取现有文件
    with open(info_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 构建2026年数据表格
    data_section = "### 复试分数线（2026年最新）\n\n"
    data_section += "| 学院/专业方向 | 复试线 | 单科线 | 复试人数 | 拟录取分数 | 备注 |\n"
    data_section += "|--------------|--------|--------|----------|-----------|------|\n"
    
    for key, value in school_data.items():
        if key in ['院校名称', '图片文件', '数据来源']:
            continue
        
        # 解析专业信息
        college_name = key.split('-')[0] if '-' in key else key
        score_line = value.get('复试线', '待补充')
        single_scores = value.get('单科线', '-')
        retest_count = value.get('复试人数', '待补充')
        admission_score = value.get('拟录取分数', '待补充')
        
        # 清理专业名称
        direction_name = key.split('-', 1)[1] if '-' in key else key
        
        data_section += f"| {direction_name} | {score_line} | {single_scores} | {retest_count} | {admission_score} | 408统考 |\n"
    
    data_section += f"\n**数据来源**: 灰灰考研统计（2026年5月13日）\n\n"
    
    # 查找并替换招生数据部分
    if "## 📊 招生数据" in content:
        # 在招生数据标题后插入2026年数据
        sections = content.split("## 📊 招生数据", 1)
        if len(sections) == 2:
            # 检查是否已有2026年数据
            if "### 复试分数线（2026年最新）" in sections[1]:
                # 替换已有的2026年数据
                parts = sections[1].split("### 复试分数线（2025年）", 1)
                if len(parts) == 2:
                    new_content = sections[0] + "## 📊 招生数据\n\n" + data_section + "### 复试分数线（2025年）" + parts[1]
                else:
                    new_content = sections[0] + "## 📊 招生数据\n\n" + data_section + sections[1]
            else:
                # 在2025年数据前插入2026年数据
                parts = sections[1].split("### 复试分数线", 1)
                if len(parts) == 2:
                    new_content = sections[0] + "## 📊 招生数据\n\n" + data_section + "### 复试分数线" + parts[1]
                else:
                    new_content = sections[0] + "## 📊 招生数据\n\n" + data_section + sections[1]
            
            # 更新最后更新时间
            new_content = new_content.replace(
                "**最后更新**：2026年5月12日",
                "**最后更新**：2026年5月13日（2026年数据已更新）"
            )
            new_content = new_content.replace(
                "**最后更新**：2026年5月13日（2026年数据已更新）",
                "**最后更新**：2026年5月13日（2026年数据已更新）"
            )
            
            # 更新数据来源
            if "灰灰考研统计" not in new_content:
                new_content = new_content.replace(
                    "**数据来源**：",
                    "**数据来源**：灰灰考研统计（2026年5月13日）、"
                )
            
            # 保存更新后的文件
            with open(info_file, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            return True
    
    return False

def main():
    print("="*60)
    print("🚀 开始批量更新院校档案文件")
    print("="*60)
    print()
    
    # 加载数据
    schools_data = load_manual_data()
    print(f"✅ 加载 {len(schools_data)} 所院校数据\n")
    
    # 统计
    success_count = 0
    fail_count = 0
    updated_schools = []
    
    # 逐所更新
    for school_data in schools_data:
        school_name = school_data['院校名称']
        print(f"📝 处理: {school_name}")
        
        if update_school_archive(school_name, school_data):
            success_count += 1
            updated_schools.append(school_name)
            print(f"  ✅ 更新成功")
        else:
            fail_count += 1
            print(f"  ❌ 更新失败")
        
        print()
    
    # 输出统计
    print(f"\n{'='*60}")
    print("📊 档案更新完成统计")
    print(f"{'='*60}")
    print(f"✅ 成功更新: {success_count} 所")
    print(f"❌ 更新失败: {fail_count} 所")
    print(f"\n已更新的院校:")
    for i, school in enumerate(updated_schools, 1):
        print(f"  {i}. {school}")
    print(f"{'='*60}")

if __name__ == "__main__":
    main()

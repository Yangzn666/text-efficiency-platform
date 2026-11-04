# -*- coding: utf-8 -*-
"""合并三个旧重复文件夹的有用内容到 canonical，再把空壳移入 archive。全程不删除。"""
import os, shutil, datetime, json

BASE = r'D:/学习/效率'
today = datetime.datetime.now().strftime('%Y-%m-%d')
log = {'moved': [], 'skipped': [], 'archived': []}

def merge_dir(src, dst):
    """把 src 目录内容并入 dst（同名文件跳过不覆盖）。"""
    os.makedirs(dst, exist_ok=True)
    for name in os.listdir(src):
        s = os.path.join(src, name)
        d = os.path.join(dst, name)
        if os.path.isdir(s):
            merge_dir(s, d)
        else:
            if os.path.exists(d):
                log['skipped'].append(d)
            else:
                shutil.move(s, d)
                log['moved'].append(d)

def merge_file(src, dst_dir):
    os.makedirs(dst_dir, exist_ok=True)
    d = os.path.join(dst_dir, os.path.basename(src))
    if os.path.exists(d):
        log['skipped'].append(d)
    else:
        shutil.move(src, d)
        log['moved'].append(d)

# --- 408: 精讲卡 + 复习图库 -> 04-408专业课/02-真题复盘图库 ---
ds408 = os.path.join(BASE, '04-408专业课', '02-真题复盘图库')
merge_dir(os.path.join(BASE, '02-408', '精讲卡'), os.path.join(ds408, '精讲卡'))
merge_dir(os.path.join(BASE, '03-专业课408', '复习图库'), os.path.join(ds408, '复习图库'))

# --- 政治: 错题分析图 -> 03-政治/05-错题分析(并入) ; 胡八PDF -> 03-政治/04-备考指南 ---
merge_dir(os.path.join(BASE, '02-考研政治', '错题分析图'),
          os.path.join(BASE, '03-政治', '05-错题分析(并入)'))
for f in os.listdir(os.path.join(BASE, '02-考研政治')):
    if f.lower().endswith('.pdf'):
        merge_file(os.path.join(BASE, '02-考研政治', f),
                   os.path.join(BASE, '03-政治', '04-备考指南'))

# --- 归档空壳（移入 archive，不删除）---
arch = os.path.join(BASE, 'archive', 'retired-dup-folders-' + today)
os.makedirs(arch, exist_ok=True)
for old in ['02-408', '03-专业课408', '02-考研政治']:
    p = os.path.join(BASE, old)
    if os.path.isdir(p):
        shutil.move(p, os.path.join(arch, old))
        log['archived'].append(old)

with open(os.path.join(BASE, 'archive', 'merge_log_' + today + '.json'), 'w', encoding='utf-8') as f:
    json.dump(log, f, ensure_ascii=False, indent=2)

print('moved=%d skipped=%d archived=%s' % (len(log['moved']), len(log['skipped']), log['archived']))
print('canonical 02-真题复盘图库 now:', os.listdir(ds408))
print('03-政治 now:', os.listdir(os.path.join(BASE, '03-政治')))

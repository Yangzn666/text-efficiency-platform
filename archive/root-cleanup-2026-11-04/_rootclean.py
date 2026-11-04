# -*- coding: utf-8 -*-
import os, shutil, datetime
BASE = r'D:/学习/效率'
today = datetime.datetime.now().strftime('%Y-%m-%d')
clean = os.path.join(BASE, 'archive', 'root-cleanup-' + today)
os.makedirs(clean, exist_ok=True)

junk = ['_dump_co201544_fresh.txt', 'debug.log', 'pdf-check-p1.png', 'pdf-check-p3.png',
        'gen-mobile-pdf.ps1', 'gen-mobile-pdf-408.ps1', '_refscan.py', '_merge_folders.py']
for f in junk:
    p = os.path.join(BASE, f)
    if os.path.exists(p):
        shutil.move(p, os.path.join(clean, f))
        print('junk->archive:', f)

# 42MB OS 参考书 -> 07-其他资源
ospdf = os.path.join(BASE, '操作系统（含新大纲考点）.pdf')
if os.path.exists(ospdf):
    shutil.move(ospdf, os.path.join(BASE, '07-其他资源', '操作系统（含新大纲考点）.pdf'))
    print('moved OS ref pdf -> 07-其他资源')

# 海宁报告 -> research
for f in ['海宁AI备考报告.html', '海宁AI备考报告.pdf']:
    p = os.path.join(BASE, f)
    if os.path.exists(p):
        shutil.move(p, os.path.join(BASE, 'research', f))
        print('moved', f, '-> research')

print('root files remaining:', sorted([x for x in os.listdir(BASE) if os.path.isfile(os.path.join(BASE, x))]))

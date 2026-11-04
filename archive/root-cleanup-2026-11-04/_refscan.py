# -*- coding: utf-8 -*-
import os, re
targets = ['02-408', '03-专业课408', '04-408专业课', '02-考研政治', '03-政治']
home = os.path.expanduser('~')
roots = [
    r'D:/学习/效率/00-网站程序',
    r'D:/学习/效率/补漏手册book2',
    os.path.join(home, '.qoderworkcn', 'skills'),
    r'D:/学习/效率',
]
exts = ('.py', '.js', '.mjs', '.ts', '.vue', '.md', '.json', '.bat', '.ps1')
hits = {t: set() for t in targets}
n = 0
for root in roots:
    for dp, dn, fn in os.walk(root):
        dn[:] = [d for d in dn if d not in ('node_modules', '__pycache__', '.git', 'dist', '_backup')]
        for f in fn:
            if not f.endswith(exts):
                continue
            p = os.path.join(dp, f)
            try:
                t = open(p, encoding='utf-8', errors='ignore').read()
            except Exception:
                continue
            n += 1
            for tg in targets:
                if tg in t:
                    hits[tg].add(p)
print('scanned files:', n)
for tg in targets:
    print('==', tg, '->', len(hits[tg]), 'files')
    for h in sorted(hits[tg])[:14]:
        print('   ', h.replace(chr(92), '/'))

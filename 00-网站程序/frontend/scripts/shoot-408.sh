#!/usr/bin/env bash
# 一键：把 408 真题大题渲染成手机友好的 PNG（供微信发送）
# 用法: bash scripts/shoot-408.sh <slug> [q|a]
#   q = 只题干(默认)   a = 题干+解析(带 KaTeX)
# 依赖: node(marked) + headless Edge + python(Pillow)
set -euo pipefail

SLUG="${1:?用法: shoot-408.sh <slug> [q|a]}"
MODE="${2:-q}"

FE="/d/学习/效率/00-网站程序/frontend"
EDGE="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
OUTDIR="/d/学习/效率/_408_render"
mkdir -p "$OUTDIR"
cd "$FE"

JSON="$(node scripts/gen-408-question-image.mjs "$SLUG" "$MODE")"
read -r FILE FILEURL <<< "$(printf '%s' "$JSON" | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const j=JSON.parse(s);process.stdout.write(j.file+' '+j.fileUrl)})")"

PNG="$OUTDIR/${FILE%.html}.png"
rm -f "$PNG"

# headless Edge 直连 file://，virtual-time-budget 给 KaTeX/字体留渲染时间
"$EDGE" --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=2 --virtual-time-budget=10000 \
  --user-data-dir="$OUTDIR/.edgeprofile" \
  --window-size=560,9000 \
  --screenshot="$PNG" "$FILEURL" >/dev/null 2>&1

# Pillow 自动裁掉底部纯背景(#f4f1ea)空白，保留 40px(2x) 余量
python - "$PNG" <<'PY'
import sys
from PIL import Image
p=sys.argv[1]
im=Image.open(p).convert('RGB'); w,h=im.size; px=im.load()
bg=(244,241,234)
def is_bg(y):
    for x in range(0,w,16):
        r,g,b=px[x,y]
        if abs(r-bg[0])+abs(g-bg[1])+abs(b-bg[2])>12: return False
    return True
bottom=h-1
while bottom>0 and is_bg(bottom): bottom-=1
im=im.crop((0,0,w,min(h,bottom+1+40)))
im.save(p)
print("saved",p,"->",im.size,"ratio 1:%.2f"%(im.size[1]/im.size[0]))
PY

echo "PNG_PATH=$PNG"

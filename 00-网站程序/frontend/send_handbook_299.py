# -*- coding: utf-8 -*-
"""把《四科考前补漏手册·299页·彩印版》PDF 作附件发到用户邮箱。"""
import smtplib, os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from email.header import Header
from smtp_auth import AUTH_CODE as PWD

SENDER = "2142744149@qq.com"
RECEIVER = "yangzhening@qq.com"
PDF = r"C:/shot/四科考前补漏手册·299页·彩印版.pdf"

msg = MIMEMultipart()
msg["From"] = SENDER
msg["To"] = RECEIVER
msg["Subject"] = Header("四科考前补漏手册 · 299页彩印版（已压到300内）", "utf-8")
body = (
    "已按你的要求压到 300 页内：\n\n"
    "· 总页数 299（数学 P4–P54 · 英语 P55–P110 · 政治 P111–P163 · 408 P164–P299）\n"
    "· 英语“主题词预测”整块（约8页）已移出书、存档到网站 english 目录，需要时回网站看\n"
    "· 数学每张题卡的“一刷/二刷/三刷”打卡条 + “用时/秒出/做对但慢/错”时间标注全部去掉，"
    "英语默写打卡格、数学章末反思行也删了（这些靠咱俩对话完成即可）\n"
    "· 全文把白底浅字压深（图注/淡知识点片/示意图箭头/序号），彩印不会看不清；"
    "深底白字与分隔页大水印属正常保留\n"
    "· 0 处公式乱码、无空白页、末页是最后一页\n\n"
    "附件为 A4 彩印版 PDF，可直接拿去打印。")
msg.attach(MIMEText(body, "plain", "utf-8"))

with open(PDF, "rb") as f:
    part = MIMEApplication(f.read(), Name=os.path.basename(PDF))
part["Content-Disposition"] = 'attachment; filename="handbook_299p.pdf"'
msg.attach(part)

with smtplib.SMTP_SSL("smtp.qq.com", 465) as s:
    s.login(SENDER, PWD)
    s.sendmail(SENDER, [RECEIVER], msg.as_string())
print("SENT ->", RECEIVER, "| size %.1fMB" % (os.path.getsize(PDF)/1e6))

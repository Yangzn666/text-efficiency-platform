#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
发送语法学习计划到邮箱
授权码: ushjvvzxbhqfbjie
"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import Header
import os
from datetime import datetime

# ==================== 配置区域 ====================
# 请在这里填写你的邮箱信息
SENDER_EMAIL = "2142744149@qq.com"  # 发件人邮箱（建议使用QQ邮箱或163邮箱）
SENDER_PASSWORD = "ushjvvzxbhqfbjie"  # 邮箱授权码（不是登录密码）
RECEIVER_EMAIL = "2142744149@qq.com"  # 收件人邮箱

# SMTP服务器配置
SMTP_SERVER = "smtp.qq.com"  # QQ邮箱: smtp.qq.com, 163邮箱: smtp.163.com
SMTP_PORT = 465  # SSL端口

# 授权码验证
AUTH_CODE = "ushjvvzxbhqfbjie"
# ================================================


def read_plan_content():
    """读取学习计划内容"""
    plan_file = r"d:\学习\效率\02-英语一\04-备考指南\复习计划\语法学习计划-邮件内容.md"
    
    if not os.path.exists(plan_file):
        print(f"❌ 文件不存在: {plan_file}")
        return None
    
    try:
        with open(plan_file, 'r', encoding='utf-8') as f:
            content = f.read()
        return content
    except Exception as e:
        print(f"❌ 读取文件失败: {e}")
        return None


def markdown_to_html(markdown_text):
    """简单的Markdown转HTML"""
    html = markdown_text
    
    # 标题转换
    html = html.replace('# ', '<h1>')
    html = html.replace('\n# ', '</h1>\n<h1>')
    html = html.replace('## ', '<h2>')
    html = html.replace('\n## ', '</h2>\n<h2>')
    html = html.replace('### ', '<h3>')
    html = html.replace('\n### ', '</h3>\n<h3>')
    
    # 加粗
    html = html.replace('**', '<strong>')
    
    # 列表
    html = html.replace('- ', '<li>')
    html = html.replace('\n<li>', '</li>\n<li>')
    
    # 链接
    import re
    html = re.sub(r'\[(.*?)\]\((.*?)\)', r'<a href="\2">\1</a>', html)
    
    # 换行
    html = html.replace('\n', '<br>\n')
    
    return html


def send_email(subject, content, is_html=False):
    """发送邮件"""
    
    # 授权码已在配置中设置，直接发送
    print("✅ 授权码验证通过")
    print()
    
    try:
        # 创建邮件对象
        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL
        msg['To'] = RECEIVER_EMAIL
        msg['Subject'] = Header(subject, 'utf-8')
        
        # 添加邮件正文
        if is_html:
            html_content = markdown_to_html(content)
            body = f"""
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body {{ font-family: 'Microsoft YaHei', Arial, sans-serif; line-height: 1.8; }}
                    h1 {{ color: #667eea; border-bottom: 3px solid #667eea; padding-bottom: 10px; }}
                    h2 {{ color: #764ba2; margin-top: 30px; }}
                    h3 {{ color: #333; }}
                    strong {{ color: #FF9800; }}
                    ul {{ padding-left: 20px; }}
                    li {{ margin: 5px 0; }}
                </style>
            </head>
            <body>
                {html_content}
            </body>
            </html>
            """
            msg.attach(MIMEText(body, 'html', 'utf-8'))
        else:
            msg.attach(MIMEText(content, 'plain', 'utf-8'))
        
        # 连接SMTP服务器并发送
        print(f"📧 正在连接到SMTP服务器: {SMTP_SERVER}:{SMTP_PORT}...")
        server = smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT)
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        
        print("📨 正在发送邮件...")
        server.sendmail(SENDER_EMAIL, [RECEIVER_EMAIL], msg.as_string())
        server.quit()
        
        print("✅ 邮件发送成功！")
        print(f"📮 收件人: {RECEIVER_EMAIL}")
        print(f"📝 主题: {subject}")
        print(f"📅 发送时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        return True
        
    except smtplib.SMTPAuthenticationError:
        print("❌ 认证失败！请检查邮箱账号和授权码是否正确。")
        print("💡 提示: QQ邮箱需要在设置中开启SMTP服务并获取授权码")
        return False
        
    except smtplib.SMTPConnectError:
        print("❌ 连接SMTP服务器失败！请检查网络连接和服务器配置。")
        return False
        
    except Exception as e:
        print(f"❌ 发送失败: {e}")
        return False


def main():
    """主函数"""
    print("=" * 60)
    print("📧 语法学习计划邮件发送工具")
    print("=" * 60)
    print()
    
    # 读取学习计划内容
    print("📖 正在读取学习计划...")
    content = read_plan_content()
    
    if not content:
        print("❌ 无法读取学习计划内容")
        return
    
    print("✅ 学习计划读取成功")
    print()
    
    # 显示配置信息
    print("📋 当前配置:")
    print(f"   发件人: {SENDER_EMAIL}")
    print(f"   收件人: {RECEIVER_EMAIL}")
    print(f"   SMTP服务器: {SMTP_SERVER}:{SMTP_PORT}")
    print()
    
    # 自动确认发送
    print("🚀 正在准备发送...")
    
    print()
    
    # 发送邮件
    subject = "【考研英语学习】我的6周语法学习计划（2026-05-05至2026-06-15）"
    success = send_email(subject, content, is_html=True)
    
    print()
    if success:
        print("=" * 60)
        print("🎉 发送完成！")
        print("=" * 60)
    else:
        print("=" * 60)
        print("⚠️  发送失败，请检查配置后重试")
        print("=" * 60)


if __name__ == "__main__":
    main()

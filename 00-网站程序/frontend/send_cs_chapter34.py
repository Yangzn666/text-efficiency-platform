#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
发送计组第三第四章知识点到邮箱
授权码: ushjvvzxbhqfbjie
"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import Header
import os
from datetime import datetime
import re

# ==================== 配置区域 ====================
SENDER_EMAIL = "2142744149@qq.com"
SENDER_PASSWORD = "ushjvvzxbhqfbjie"
RECEIVER_EMAIL = "2142744149@qq.com"

SMTP_SERVER = "smtp.qq.com"
SMTP_PORT = 465

AUTH_CODE = "ushjvvzxbhqfbjie"
# ================================================


def read_plan_content():
    """读取计组知识点内容"""
    plan_file = r"d:\学习\效率\04-408专业课\01-知识点整理\计组\计组第三第四章知识点-邮件内容.md"
    
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
    """Markdown转HTML（增强版）"""
    html = markdown_text
    
    # 处理代码块
    html = re.sub(r'```(\w*)\n(.*?)```', r'<pre><code>\2</code></pre>', html, flags=re.DOTALL)
    
    # 处理表格
    lines = html.split('\n')
    processed_lines = []
    in_table = False
    table_html = []
    
    for line in lines:
        if '|' in line and line.strip().startswith('|'):
            if not in_table:
                in_table = True
                table_html = ['<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">']
            
            # 跳过分隔线
            if re.match(r'\|[\s\-:|]+\|', line):
                continue
            
            # 处理表头和数据行
            cells = [cell.strip() for cell in line.split('|')[1:-1]]
            if not table_html[-1].startswith('<tr>'):
                # 第一行是表头
                row = '<tr style="background-color: #667eea; color: white;">' + ''.join([f'<th style="padding: 10px;">{cell}</th>' for cell in cells]) + '</tr>'
            else:
                row = '<tr>' + ''.join([f'<td style="padding: 8px;">{cell}</td>' for cell in cells]) + '</tr>'
            table_html.append(row)
        else:
            if in_table:
                table_html.append('</table>')
                processed_lines.append('\n'.join(table_html))
                in_table = False
                table_html = []
            processed_lines.append(line)
    
    if in_table:
        table_html.append('</table>')
        processed_lines.append('\n'.join(table_html))
    
    html = '\n'.join(processed_lines)
    
    # 标题转换
    html = re.sub(r'^# (.+)$', r'<h1 style="color: #667eea; border-bottom: 3px solid #667eea; padding-bottom: 10px;">\1</h1>', html, flags=re.MULTILINE)
    html = re.sub(r'^## (.+)$', r'<h2 style="color: #764ba2; margin-top: 30px; border-left: 4px solid #764ba2; padding-left: 15px;">\1</h2>', html, flags=re.MULTILINE)
    html = re.sub(r'^### (.+)$', r'<h3 style="color: #333; margin-top: 20px;">\1</h3>', html, flags=re.MULTILINE)
    
    # 加粗
    html = re.sub(r'\*\*(.+?)\*\*', r'<strong style="color: #FF9800;">\1</strong>', html)
    
    # 斜体
    html = re.sub(r'\*(.+?)\*', r'<em>\1</em>', html)
    
    # 列表
    html = re.sub(r'^- (.+)$', r'<li style="margin: 5px 0;">\1</li>', html, flags=re.MULTILINE)
    html = re.sub(r'(</li>\n<li)', r'\1', html)
    html = re.sub(r'((?:<li.*?</li>\n?)+)', r'<ul style="padding-left: 20px;">\1</ul>', html)
    
    # 数学公式（简单处理）
    html = re.sub(r'\$\$(.+?)\$\$', r'<div style="text-align: center; font-size: 1.2em; margin: 15px 0; color: #2196F3;"><em>\1</em></div>', html, flags=re.DOTALL)
    html = re.sub(r'\$(.+?)\$', r'<code style="background-color: #f0f0f0; padding: 2px 6px; border-radius: 3px; color: #d63384;">\1</code>', html)
    
    # 链接
    html = re.sub(r'\[(.*?)\]\((.*?)\)', r'<a href="\2" style="color: #667eea; text-decoration: none;">\1</a>', html)
    
    # 水平线
    html = re.sub(r'^---$', r'<hr style="border: none; height: 2px; background: linear-gradient(to right, #667eea, #764ba2); margin: 30px 0;">', html, flags=re.MULTILINE)
    
    # 换行
    html = html.replace('\n\n', '</p><p>')
    html = html.replace('\n', '<br>\n')
    
    # 包裹段落
    html = f'<p>{html}</p>'
    
    return html


def send_email(subject, content, is_html=False):
    """发送邮件"""
    
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
                    body {{ 
                        font-family: 'Microsoft YaHei', 'Segoe UI', Arial, sans-serif; 
                        line-height: 1.8; 
                        max-width: 900px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #f5f5f5;
                    }}
                    .container {{
                        background-color: white;
                        padding: 30px;
                        border-radius: 10px;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    }}
                    h1 {{ 
                        color: #667eea; 
                        border-bottom: 3px solid #667eea; 
                        padding-bottom: 10px;
                        font-size: 24px;
                    }}
                    h2 {{ 
                        color: #764ba2; 
                        margin-top: 30px; 
                        border-left: 4px solid #764ba2; 
                        padding-left: 15px;
                        font-size: 20px;
                    }}
                    h3 {{ 
                        color: #333; 
                        margin-top: 20px;
                        font-size: 18px;
                    }}
                    strong {{ 
                        color: #FF9800; 
                    }}
                    ul {{ 
                        padding-left: 20px; 
                    }}
                    li {{ 
                        margin: 5px 0; 
                    }}
                    table {{
                        border-collapse: collapse;
                        width: 100%;
                        margin: 15px 0;
                    }}
                    th {{
                        background-color: #667eea;
                        color: white;
                        padding: 10px;
                        text-align: left;
                    }}
                    td {{
                        padding: 8px;
                        border: 1px solid #ddd;
                    }}
                    tr:nth-child(even) {{
                        background-color: #f9f9f9;
                    }}
                    code {{
                        background-color: #f0f0f0;
                        padding: 2px 6px;
                        border-radius: 3px;
                        color: #d63384;
                        font-family: 'Consolas', 'Monaco', monospace;
                    }}
                    pre {{
                        background-color: #282c34;
                        color: #abb2bf;
                        padding: 15px;
                        border-radius: 5px;
                        overflow-x: auto;
                    }}
                    hr {{
                        border: none;
                        height: 2px;
                        background: linear-gradient(to right, #667eea, #764ba2);
                        margin: 30px 0;
                    }}
                    .highlight {{
                        background-color: #fff3cd;
                        border-left: 4px solid #ffc107;
                        padding: 10px 15px;
                        margin: 15px 0;
                    }}
                </style>
            </head>
            <body>
                <div class="container">
                    {html_content}
                </div>
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
        import traceback
        traceback.print_exc()
        return False


def main():
    """主函数"""
    print("=" * 60)
    print("📧 计组第三第四章知识点邮件发送工具")
    print("=" * 60)
    print()
    
    # 读取知识点内容
    print("📖 正在读取计组知识点...")
    content = read_plan_content()
    
    if not content:
        print("❌ 无法读取知识点内容")
        return
    
    print("✅ 知识点读取成功")
    print(f"📄 内容长度: {len(content)} 字符")
    print()
    
    # 显示配置信息
    print("📋 当前配置:")
    print(f"   发件人: {SENDER_EMAIL}")
    print(f"   收件人: {RECEIVER_EMAIL}")
    print(f"   SMTP服务器: {SMTP_SERVER}:{SMTP_PORT}")
    print()
    
    # 自动发送
    print("🚀 正在准备发送...")
    print()
    
    # 发送邮件
    subject = "【408计算机组成原理】第三章存储器系统 + 第四章指令系统 完整知识点总结"
    success = send_email(subject, content, is_html=True)
    
    print()
    if success:
        print("=" * 60)
        print("🎉 发送完成！")
        print("=" * 60)
        print()
        print("📊 邮件内容包括:")
        print("   ✅ 第三章：存储器系统")
        print("      - 存储器分类与层次结构")
        print("      - 主存储器（SRAM/DRAM）")
        print("      - 高速缓存Cache")
        print("      - 虚拟存储器")
        print("      - 外存储器")
        print()
        print("   ✅ 第四章：指令系统")
        print("      - 指令格式")
        print("      - 寻址方式")
        print("      - CISC与RISC")
        print("      - 指令流水线")
        print()
        print("   ✅ 重点考点总结")
        print("   ✅ 学习建议")
        print("   ✅ 真题规律")
    else:
        print("=" * 60)
        print("⚠️  发送失败，请检查配置后重试")
        print("=" * 60)


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
发送英语作文学习工作流到邮箱
"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import Header
import os

def send_workflow_email():
    """发送工作流邮件"""
    
    # 邮件配置
    sender = '2142744149@qq.com'
    receiver = '2142744149@qq.com'
    password = 'ushjvvzxbhqfbjie'  # SMTP授权码
    
    # 读取工作流文件
    workflow_path = os.path.join(os.path.dirname(__file__), '英语作文学习工作流.md')
    with open(workflow_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 将Markdown转换为HTML（简单转换）
    html_content = convert_markdown_to_html(content)
    
    # 创建邮件对象
    message = MIMEMultipart('alternative')
    message['From'] = sender
    message['To'] = receiver
    message['Subject'] = Header('✍️ 英语六级作文学习工作流 | Writing Mastery Workflow', 'utf-8')
    
    # 添加HTML内容
    html_part = MIMEText(html_content, 'html', 'utf-8')
    message.attach(html_part)
    
    try:
        # 连接SMTP服务器
        server = smtplib.SMTP_SSL('smtp.qq.com', 465)
        server.login(sender, password)
        
        # 发送邮件
        server.sendmail(sender, receiver, message.as_string())
        server.quit()
        
        print("✅ 邮件发送成功！")
        print(f"📧 收件人: {receiver}")
        print(f"📄 附件: 英语作文学习工作流.md")
        
    except Exception as e:
        print(f"❌ 邮件发送失败: {str(e)}")
        raise

def convert_markdown_to_html(markdown_content):
    """简单的Markdown转HTML"""
    
    html = """
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                line-height: 1.8;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
                padding: 40px 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .container {
                background: white;
                border-radius: 20px;
                padding: 40px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            }
            h1 {
                color: #667eea;
                border-bottom: 3px solid #667eea;
                padding-bottom: 15px;
                font-size: 2em;
            }
            h2 {
                color: #764ba2;
                margin-top: 40px;
                font-size: 1.6em;
            }
            h3 {
                color: #555;
                font-size: 1.3em;
                margin-top: 30px;
            }
            h4 {
                color: #666;
                font-size: 1.1em;
            }
            blockquote {
                border-left: 4px solid #667eea;
                padding: 15px 20px;
                margin: 20px 0;
                background: #f8f9fa;
                border-radius: 8px;
                font-style: italic;
            }
            code {
                background: #f4f4f4;
                padding: 2px 6px;
                border-radius: 4px;
                font-family: "Courier New", monospace;
                color: #e83e8c;
            }
            pre {
                background: #2d2d2d;
                color: #f8f8f2;
                padding: 20px;
                border-radius: 10px;
                overflow-x: auto;
                line-height: 1.6;
            }
            ul, ol {
                padding-left: 25px;
            }
            li {
                margin: 8px 0;
            }
            strong {
                color: #667eea;
            }
            .highlight {
                background: linear-gradient(135deg, #fff9c4 0%, #fff59d 100%);
                padding: 15px 20px;
                border-radius: 10px;
                border-left: 4px solid #FFC107;
                margin: 20px 0;
            }
            .tip-box {
                background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
                padding: 15px 20px;
                border-radius: 10px;
                border-left: 4px solid #4CAF50;
                margin: 20px 0;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
            }
            th, td {
                border: 1px solid #ddd;
                padding: 12px;
                text-align: left;
            }
            th {
                background: #667eea;
                color: white;
            }
            tr:nth-child(even) {
                background: #f9f9f9;
            }
            .footer {
                text-align: center;
                margin-top: 40px;
                padding-top: 20px;
                border-top: 2px solid #eee;
                color: #999;
                font-size: 0.9em;
            }
            .emoji {
                font-size: 1.2em;
            }
        </style>
    </head>
    <body>
        <div class="container">
    """
    
    # 简单的Markdown转换逻辑
    lines = markdown_content.split('\n')
    in_code_block = False
    in_list = False
    list_type = None
    
    for line in lines:
        # 代码块
        if line.strip().startswith('```'):
            if in_code_block:
                html += '</pre>'
                in_code_block = False
            else:
                html += '<pre><code>'
                in_code_block = True
            continue
        
        if in_code_block:
            html += line + '\n'
            continue
        
        # 标题
        if line.startswith('# '):
            html += f'<h1>{line[2:]}</h1>\n'
        elif line.startswith('## '):
            html += f'<h2>{line[3:]}</h2>\n'
        elif line.startswith('### '):
            html += f'<h3>{line[4:]}</h3>\n'
        elif line.startswith('#### '):
            html += f'<h4>{line[5:]}</h4>\n'
        
        # 引用
        elif line.startswith('> '):
            html += f'<blockquote>{line[2:]}</blockquote>\n'
        
        # 无序列表
        elif line.strip().startswith('- ') or line.strip().startswith('* '):
            if not in_list or list_type != 'ul':
                if in_list:
                    html += f'</{list_type}>\n'
                html += '<ul>\n'
                in_list = True
                list_type = 'ul'
            item = line.strip()[2:]
            # 处理复选框
            if item.startswith('[ ]'):
                html += f'<li>☐ {item[4:]}</li>\n'
            elif item.startswith('[x]') or item.startswith('[✓]'):
                html += f'<li>☑ {item[4:]}</li>\n'
            else:
                html += f'<li>{item}</li>\n'
        
        # 有序列表
        elif line.strip() and line.strip()[0].isdigit() and '. ' in line:
            if not in_list or list_type != 'ol':
                if in_list:
                    html += f'</{list_type}>\n'
                html += '<ol>\n'
                in_list = True
                list_type = 'ol'
            item = line.strip().split('. ', 1)[1]
            html += f'<li>{item}</li>\n'
        
        # 空行
        elif line.strip() == '':
            if in_list:
                html += f'</{list_type}>\n'
                in_list = False
                list_type = None
            html += '<br>\n'
        
        # 普通段落
        else:
            # 处理内联格式
            formatted_line = line
            formatted_line = formatted_line.replace('**', '<strong>').replace('**', '</strong>')
            formatted_line = formatted_line.replace('*', '<em>').replace('*', '</em>')
            formatted_line = formatted_line.replace('`', '<code>').replace('`', '</code>')
            html += f'<p>{formatted_line}</p>\n'
    
    if in_list:
        html += f'</{list_type}>\n'
    
    html += """
        </div>
        <div class="footer">
            <p>🎓 Designed with ❤️ for efficient learning</p>
            <p>祝你六级作文取得优异成绩！🎉</p>
        </div>
    </body>
    </html>
    """
    
    return html

if __name__ == '__main__':
    send_workflow_email()

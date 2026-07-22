#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
发送六级作文预测文档到邮箱
"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import Header
import os

def send_prediction_email():
    """发送作文预测邮件"""
    
    # 邮件配置
    sender = '2142744149@qq.com'
    receiver = '2142744149@qq.com'
    password = 'ushjvvzxbhqfbjie'  # SMTP授权码
    
    # 读取文档文件
    doc_path = os.path.join(os.path.dirname(__file__), 
                           '02-英语一/01-知识点整理/写作/六级作文预测-信息过载-完整解析.md')
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 将Markdown转换为HTML
    html_content = convert_markdown_to_html(content)
    
    # 创建邮件对象
    message = MIMEMultipart('alternative')
    message['From'] = sender
    message['To'] = receiver
    message['Subject'] = Header('🎯 六级作文预测：信息过载挑战 | 完整解析+范文', 'utf-8')
    
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
        print(f"📄 主题: 六级作文预测：信息过载挑战")
        print(f"📊 内容: 完整范文 + 译文 + 详细解析")
        
    except Exception as e:
        print(f"❌ 邮件发送失败: {str(e)}")
        raise

def convert_markdown_to_html(markdown_content):
    """Markdown转HTML（美化版）"""
    
    html = """
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                line-height: 1.8;
                color: #333;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 20px;
            }
            .container {
                max-width: 900px;
                margin: 0 auto;
                background: white;
                border-radius: 20px;
                padding: 50px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            }
            h1 {
                color: #667eea;
                border-bottom: 4px solid #667eea;
                padding-bottom: 20px;
                font-size: 2.2em;
                margin-bottom: 30px;
                text-align: center;
            }
            h2 {
                color: #764ba2;
                margin-top: 45px;
                margin-bottom: 20px;
                font-size: 1.8em;
                padding-left: 15px;
                border-left: 5px solid #764ba2;
            }
            h3 {
                color: #555;
                font-size: 1.4em;
                margin-top: 35px;
                margin-bottom: 15px;
            }
            h4 {
                color: #666;
                font-size: 1.2em;
                margin-top: 25px;
                margin-bottom: 12px;
            }
            p {
                margin: 12px 0;
                text-align: justify;
            }
            blockquote {
                border-left: 5px solid #667eea;
                padding: 20px 25px;
                margin: 25px 0;
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                border-radius: 10px;
                font-style: italic;
                color: #555;
            }
            code {
                background: #f4f4f4;
                padding: 3px 8px;
                border-radius: 5px;
                font-family: "Courier New", monospace;
                color: #e83e8c;
                font-size: 0.95em;
            }
            pre {
                background: #2d2d2d;
                color: #f8f8f2;
                padding: 25px;
                border-radius: 12px;
                overflow-x: auto;
                line-height: 1.7;
                margin: 20px 0;
                font-size: 0.95em;
            }
            ul, ol {
                padding-left: 30px;
                margin: 15px 0;
            }
            li {
                margin: 10px 0;
                line-height: 1.7;
            }
            strong {
                color: #667eea;
                font-weight: 600;
            }
            em {
                color: #764ba2;
                font-style: italic;
            }
            .highlight-box {
                background: linear-gradient(135deg, #fff9c4 0%, #fff59d 100%);
                padding: 20px 25px;
                border-radius: 12px;
                border-left: 5px solid #FFC107;
                margin: 25px 0;
            }
            .tip-box {
                background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
                padding: 20px 25px;
                border-radius: 12px;
                border-left: 5px solid #4CAF50;
                margin: 25px 0;
            }
            .info-box {
                background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
                padding: 20px 25px;
                border-radius: 12px;
                border-left: 5px solid #2196F3;
                margin: 25px 0;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin: 25px 0;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                border-radius: 10px;
                overflow: hidden;
            }
            th {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px;
                text-align: left;
                font-weight: 600;
            }
            td {
                padding: 12px 15px;
                border-bottom: 1px solid #eee;
            }
            tr:nth-child(even) {
                background: #f9f9f9;
            }
            tr:hover {
                background: #f0f0f0;
            }
            .footer {
                text-align: center;
                margin-top: 50px;
                padding-top: 30px;
                border-top: 3px solid #eee;
                color: #999;
                font-size: 0.95em;
            }
            .emoji {
                font-size: 1.3em;
            }
            .check-item {
                color: #4CAF50;
                font-weight: 600;
            }
            hr {
                border: none;
                height: 2px;
                background: linear-gradient(to right, #667eea, #764ba2);
                margin: 40px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
    """
    
    # Markdown转换逻辑
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
            if item.startswith('[x]') or item.startswith('[✓]'):
                html += f'<li><span class="check-item">✅</span> {item[4:]}</li>\n'
            elif item.startswith('[ ]'):
                html += f'<li>☐ {item[4:]}</li>\n'
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
            <p class="emoji">🎓 📝 ✍️</p>
            <p><strong>祝你六级作文取得优异成绩！</strong></p>
            <p>Designed with ❤️ for efficient learning</p>
            <p style="margin-top: 15px; color: #bbb; font-size: 0.85em;">
                Document created: 2026-06-08 | For CET-6 Writing Practice
            </p>
        </div>
    </body>
    </html>
    """
    
    return html

if __name__ == '__main__':
    send_prediction_email()

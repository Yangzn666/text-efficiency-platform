#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
发送计组第四章和第五章知识点到邮箱
每个小节单独一封邮件，格式美观
"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import Header
import re

# 邮箱配置
SMTP_SERVER = "smtp.qq.com"
SMTP_PORT = 465  # 使用SSL端口
SENDER_EMAIL = "2142744149@qq.com"  # 使用记忆中的邮箱
AUTH_CODE = "ushjvvzxbhqfbjie"  # 使用记忆中的授权码
RECEIVER_EMAIL = "2142744149@qq.com"

def extract_sections():
    """从composition.ts中提取第四章和第五章的小节内容"""
    
    # 读取文件
    with open('d:/学习/效率/00-网站程序/frontend/src/stores/composition.ts', 'r', encoding='utf-8') as f:
        content = f.read()
    
    sections = []
    
    # 提取第四章（指令系统）的小节
    chapter4_pattern = r"id:\s*'4\.\d+',\s*title:\s*'([^']+)',[\s\S]*?content:\s*`([\s\S]*?)`\s*\},"
    chapter4_matches = re.finditer(chapter4_pattern, content)
    
    for match in chapter4_matches:
        title = match.group(1)
        raw_content = match.group(2)
        # 清理Markdown内容
        clean_content = clean_markdown(raw_content)
        sections.append({
            'chapter': 4,
            'title': title,
            'content': clean_content
        })
    
    # 提取第五章（CPU）的小节  
    chapter5_pattern = r"id:\s*'5\.\d+',\s*title:\s*'([^']+)',[\s\S]*?content:\s*`([\s\S]*?)`\s*\},"
    chapter5_matches = re.finditer(chapter5_pattern, content)
    
    for match in chapter5_matches:
        title = match.group(2)
        raw_content = match.group(2)
        # 清理Markdown内容
        clean_content = clean_markdown(raw_content)
        sections.append({
            'chapter': 5,
            'title': title,
            'content': clean_content
        })
    
    return sections

def clean_markdown(text):
    """清理Markdown文本，转换为HTML友好的格式"""
    # 移除转义的反引号
    text = text.replace('\\`', '`')
    # 移除Unicode转义
    text = text.encode().decode('unicode_escape')
    # 替换特殊字符
    text = text.replace('\\n', '\n')
    text = text.replace('\\t', '\t')
    return text

def markdown_to_html(markdown_text):
    """简单的Markdown转HTML"""
    html = markdown_text
    
    # 转换标题
    html = re.sub(r'^## (.+)$', r'<h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; margin-top: 30px;">\1</h2>', html, flags=re.MULTILINE)
    html = re.sub(r'^### (.+)$', r'<h3 style="color: #2980b9; margin-top: 25px; margin-bottom: 15px;">\1</h3>', html, flags=re.MULTILINE)
    html = re.sub(r'^#### (.+)$', r'<h4 style="color: #16a085; margin-top: 20px; margin-bottom: 10px;">\1</h4>', html, flags=re.MULTILINE)
    
    # 转换代码块
    html = re.sub(r'```(\w*)\n([\s\S]*?)```', r'<pre style="background: #f8f9fa; padding: 15px; border-left: 4px solid #3498db; border-radius: 5px; overflow-x: auto;"><code>\2</code></pre>', html)
    
    # 转换表格
    # 这里简化处理，实际应该更复杂
    html = re.sub(r'\|(.+)\|', r'<tr><td>\1</td></tr>', html)
    
    # 转换粗体
    html = re.sub(r'\*\*(.+?)\*\*', r'<strong style="color: #e74c3c;">\1</strong>', html)
    
    # 转换列表
    html = re.sub(r'^- (.+)$', r'<li style="margin: 8px 0; line-height: 1.8;">\1</li>', html, flags=re.MULTILINE)
    
    # 转换换行
    html = html.replace('\n\n', '</p><p style="line-height: 1.8; margin: 15px 0;">')
    
    return f'<div style="font-family: Microsoft YaHei, Arial, sans-serif; font-size: 15px; color: #333; line-height: 1.8;">{html}</div>'

def send_email(subject, html_content):
    """发送邮件"""
    try:
        # 创建邮件对象
        msg = MIMEMultipart('alternative')
        msg['From'] = SENDER_EMAIL
        msg['To'] = RECEIVER_EMAIL
        msg['Subject'] = Header(subject, 'utf-8')
        
        # 添加HTML内容
        html_part = MIMEText(html_content, 'html', 'utf-8')
        msg.attach(html_part)
        
        # 连接SMTP服务器（使用SSL）
        server = smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT)
        server.ehlo()
        server.login(SENDER_EMAIL, AUTH_CODE)
        
        # 发送邮件
        server.sendmail(SENDER_EMAIL, RECEIVER_EMAIL, msg.as_string())
        server.quit()
        
        print(f"✅ 邮件发送成功: {subject}")
        return True
        
    except Exception as e:
        print(f"❌ 邮件发送失败: {subject}")
        print(f"错误信息: {str(e)}")
        return False

def create_email_template(chapter, title, content):
    """创建邮件HTML模板"""
    
    chapter_name = "第四章 指令系统" if chapter == 4 else "第五章 中央处理器"
    
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {{
                font-family: 'Microsoft YaHei', Arial, sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }}
            .container {{
                background: white;
                border-radius: 15px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.1);
                overflow: hidden;
            }}
            .header {{
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
            }}
            .header h1 {{
                margin: 0;
                font-size: 28px;
                font-weight: bold;
            }}
            .header .subtitle {{
                margin-top: 10px;
                font-size: 16px;
                opacity: 0.9;
            }}
            .content {{
                padding: 40px;
            }}
            .footer {{
                background: #f8f9fa;
                padding: 20px;
                text-align: center;
                color: #666;
                font-size: 14px;
                border-top: 1px solid #eee;
            }}
            .badge {{
                display: inline-block;
                background: #3498db;
                color: white;
                padding: 5px 15px;
                border-radius: 20px;
                font-size: 14px;
                margin-right: 10px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>{chapter_name}</h1>
                <div class="subtitle">
                    <span class="badge">{title}</span>
                    <span>计算机组成原理考研重点</span>
                </div>
            </div>
            <div class="content">
                {markdown_to_html(content)}
            </div>
            <div class="footer">
                <p>📚 考研加油！祝你成功上岸！</p>
                <p style="font-size: 12px; color: #999;">此邮件由自动学习助手发送 | {chapter_name} - {title}</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    return html

def main():
    """主函数"""
    print("开始提取知识点内容...")
    
    # 提取章节内容
    sections = extract_sections()
    
    print(f"共提取到 {len(sections)} 个小节")
    
    # 只发送剩余的3个小节（索引7-9）
    remaining_sections = sections[7:10]
    
    print(f"\n将发送剩余的 {len(remaining_sections)} 个小节:\n")
    for i, section in enumerate(remaining_sections, 8):
        print(f"  {i}. {section['title']}")
    print()
    
    # 发送每封邮件
    success_count = 0
    for idx, section in enumerate(remaining_sections, 8):
        print(f"\n[{idx}/{len(sections)}] 正在发送: {section['title']}")
        
        subject = f"【计组知识点】第{section['chapter']}章 - {section['title']}"
        html_content = create_email_template(
            section['chapter'],
            section['title'],
            section['content']
        )
        
        if send_email(subject, html_content):
            success_count += 1
            print(f"等待5秒后发送下一封...")
            import time
            time.sleep(5)  # 增加等待时间，避免被限制
        else:
            print("跳过此邮件，继续下一封...")
            import time
            time.sleep(3)
    
    print(f"\n{'='*60}")
    print(f"发送完成！成功: {success_count}/{len(remaining_sections)}")
    print(f"{'='*60}")

if __name__ == '__main__':
    main()

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
发送操作系统第三章内存管理知识点到邮箱（分5封邮件）
针对手机阅读优化：小边距、清晰排版、无MD痕迹
"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import Header
import re

# 邮箱配置
SMTP_SERVER = 'smtp.qq.com'
SMTP_PORT = 465
SENDER_EMAIL = '2142744149@qq.com'
AUTH_CODE = 'ushjvvzxbhqfbjie'  # QQ邮箱授权码
RECEIVER_EMAIL = '2142744149@qq.com'  # 收件人邮箱

def extract_sections_from_ts():
    """从TypeScript文件中提取第三章的5个小节内容"""
    
    ts_file = r'd:\学习\效率\00-网站程序\frontend\src\stores\operatingSystem.ts'
    
    with open(ts_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 找到第三章的开始位置
    ch3_start = content.find("id: 'ch3'")
    if ch3_start == -1:
        raise Exception("未找到第三章")
    
    # 找到sections数组
    sections_start = content.find('sections: [', ch3_start)
    if sections_start == -1:
        raise Exception("未找到sections")
    
    # 提取所有小节
    sections = []
    current_pos = sections_start
    
    # 查找5个小节
    for i in range(1, 6):
        section_id = f"3.{i}"
        
        # 找到该小节的开始
        id_pattern = f"id: '{section_id}'"
        id_pos = content.find(id_pattern, current_pos)
        if id_pos == -1:
            break
        
        # 提取title
        title_match = re.search(r"title:\s*'([^']+)'", content[id_pos:id_pos+200])
        if not title_match:
            continue
        title = title_match.group(1)
        
        # 提取content
        content_match = re.search(r"content:\s*`([\s\S]*?)`,?\s*\n\s*\},", content[id_pos:])
        if not content_match:
            continue
        
        section_content = content_match.group(1)
        
        # 清理转义字符
        section_content = section_content.replace('\\`', '`')
        section_content = section_content.replace('\\n', '\n')
        
        sections.append({
            'id': section_id,
            'title': title,
            'content': section_content
        })
        
        current_pos = id_pos + 100
    
    return sections

def clean_markdown_to_plain_html(markdown_text):
    """将Markdown转换为干净的HTML，完全去除MD痕迹"""
    
    html = markdown_text
    
    # 1. 先处理代码块（避免被其他规则干扰）
    def replace_code_block(match):
        code = match.group(1).strip()
        # 清理代码中的HTML特殊字符
        code = code.replace('&', '&amp;')
        code = code.replace('<', '&lt;')
        code = code.replace('>', '&gt;')
        return f'<div style="background:#2c3e50;color:#ecf0f1;padding:12px;border-radius:6px;margin:10px 0;font-size:13px;line-height:1.6;overflow-x:auto;"><pre style="margin:0;">{code}</pre></div>'
    html = re.sub(r'```[\w]*\n([\s\S]*?)```', replace_code_block, html)
    
    # 2. 处理标题（从大到小）
    html = re.sub(r'^## (.+?)\s*$', r'<h2 style="color:#2c3e50;font-size:20px;font-weight:700;margin:20px 0 12px 0;padding-bottom:8px;border-bottom:2px solid #3498db;">\1</h2>', html, flags=re.MULTILINE)
    html = re.sub(r'^### (.+?)\s*$', r'<h3 style="color:#34495e;font-size:17px;font-weight:600;margin:16px 0 10px 0;padding-left:10px;border-left:3px solid #3498db;">\1</h3>', html, flags=re.MULTILINE)
    html = re.sub(r'^#### (.+?)\s*$', r'<h4 style="color:#7f8c8d;font-size:15px;font-weight:600;margin:14px 0 8px 0;">\1</h4>', html, flags=re.MULTILINE)
    
    # 3. 处理加粗（在列表和表格之前）
    html = re.sub(r'\*\*(.+?)\*\*', r'<strong style="color:#e74c3c;font-weight:600;">\1</strong>', html)
    
    # 4. 处理行内代码
    html = re.sub(r'`([^`]+)`', r'<code style="background:#fff3cd;padding:2px 6px;border-radius:3px;font-family:monospace;color:#856404;font-size:13px;">\1</code>', html)
    
    # 5. 处理表格
    def replace_table(match):
        table_text = match.group(0)
        rows = [r.strip() for r in table_text.strip().split('\n') if r.strip()]
        
        if not rows:
            return ''
        
        html_table = '<table style="border-collapse:collapse;width:100%;margin:12px 0;font-size:13px;background:white;">'
        
        for idx, row in enumerate(rows):
            # 跳过分隔行
            if re.match(r'^\|?\s*[-:|]+\s*\|?$', row):
                continue
            
            # 提取单元格
            cells = [c.strip() for c in row.split('|') if c.strip()]
            if not cells:
                continue
            
            html_table += '<tr>'
            for cell in cells:
                # 清理单元格内的MD符号
                cell = re.sub(r'\*\*(.+?)\*\*', r'<strong style="color:#e74c3c;">\1</strong>', cell)
                cell = re.sub(r'`([^`]+)`', r'<code style="background:#fff3cd;padding:1px 4px;border-radius:2px;font-size:12px;">\1</code>', cell)
                
                if idx == 0:
                    html_table += f'<th style="border:1px solid #bdc3c7;padding:8px 10px;background:#ecf0f1;color:#2c3e50;font-weight:600;text-align:left;">{cell}</th>'
                else:
                    html_table += f'<td style="border:1px solid #bdc3c7;padding:8px 10px;color:#34495e;">{cell}</td>'
            html_table += '</tr>'
        
        html_table += '</table>'
        return html_table
    
    html = re.sub(r'(\|.+(?:\n\|.+)*)', replace_table, html)
    
    # 6. 处理无序列表
    def replace_list(match):
        items = match.group(0).strip().split('\n')
        html_list = '<ul style="margin:10px 0;padding-left:20px;">'
        for item in items:
            item = re.sub(r'^[\-\*]\s+', '', item).strip()
            if item:
                # 清理列表项内的MD
                item = re.sub(r'\*\*(.+?)\*\*', r'<strong style="color:#e74c3c;">\1</strong>', item)
                item = re.sub(r'`([^`]+)`', r'<code style="background:#fff3cd;padding:1px 4px;border-radius:2px;font-size:12px;">\1</code>', item)
                html_list += f'<li style="margin:6px 0;line-height:1.7;color:#34495e;">{item}</li>'
        html_list += '</ul>'
        return html_list
    
    html = re.sub(r'^(?:[\-\*] .+\n?)+', replace_list, html, flags=re.MULTILINE)
    
    # 7. 处理有序列表
    def replace_ordered_list(match):
        items = match.group(0).strip().split('\n')
        html_list = '<ol style="margin:10px 0;padding-left:20px;">'
        for item in items:
            item = re.sub(r'^\d+[\.\)]\s+', '', item).strip()
            if item:
                item = re.sub(r'\*\*(.+?)\*\*', r'<strong style="color:#e74c3c;">\1</strong>', item)
                item = re.sub(r'`([^`]+)`', r'<code style="background:#fff3cd;padding:1px 4px;border-radius:2px;font-size:12px;">\1</code>', item)
                html_list += f'<li style="margin:6px 0;line-height:1.7;color:#34495e;">{item}</li>'
        html_list += '</ol>'
        return html_list
    
    html = re.sub(r'^(?:\d+[\.\)] .+\n?)+', replace_ordered_list, html, flags=re.MULTILINE)
    
    # 8. 处理普通段落（排除已经处理的标签）
    lines = html.split('\n')
    processed_lines = []
    in_paragraph = False
    paragraph_content = []
    
    for line in lines:
        line_stripped = line.strip()
        
        # 跳过空行
        if not line_stripped:
            if in_paragraph and paragraph_content:
                para_text = ' '.join(paragraph_content)
                # 清理段落内的MD
                para_text = re.sub(r'\*\*(.+?)\*\*', r'<strong style="color:#e74c3c;">\1</strong>', para_text)
                para_text = re.sub(r'`([^`]+)`', r'<code style="background:#fff3cd;padding:1px 4px;border-radius:2px;font-size:12px;">\1</code>', para_text)
                processed_lines.append(f'<p style="margin:10px 0;line-height:1.8;color:#34495e;font-size:14px;">{para_text}</p>')
                paragraph_content = []
                in_paragraph = False
            continue
        
        # 如果已经是HTML标签，直接添加
        if line_stripped.startswith('<'):
            if in_paragraph and paragraph_content:
                para_text = ' '.join(paragraph_content)
                para_text = re.sub(r'\*\*(.+?)\*\*', r'<strong style="color:#e74c3c;">\1</strong>', para_text)
                para_text = re.sub(r'`([^`]+)`', r'<code style="background:#fff3cd;padding:1px 4px;border-radius:2px;font-size:12px;">\1</code>', para_text)
                processed_lines.append(f'<p style="margin:10px 0;line-height:1.8;color:#34495e;font-size:14px;">{para_text}</p>')
                paragraph_content = []
                in_paragraph = False
            processed_lines.append(line)
        else:
            # 普通文本，收集到段落中
            in_paragraph = True
            paragraph_content.append(line_stripped)
    
    # 处理最后一个段落
    if in_paragraph and paragraph_content:
        para_text = ' '.join(paragraph_content)
        para_text = re.sub(r'\*\*(.+?)\*\*', r'<strong style="color:#e74c3c;">\1</strong>', para_text)
        para_text = re.sub(r'`([^`]+)`', r'<code style="background:#fff3cd;padding:1px 4px;border-radius:2px;font-size:12px;">\1</code>', para_text)
        processed_lines.append(f'<p style="margin:10px 0;line-height:1.8;color:#34495e;font-size:14px;">{para_text}</p>')
    
    html = '\n'.join(processed_lines)
    
    # 9. 清理多余的空行和空白
    html = re.sub(r'\n{3,}', '\n\n', html)
    html = re.sub(r'>\s+<', '><', html)  # 移除标签间的多余空格
    
    return html

def create_mobile_email_html(section):
    """为单个小节创建移动端优化的HTML邮件"""
    
    section_id = section['id']
    section_title = section['title']
    section_content = clean_markdown_to_plain_html(section['content'])
    
    html_content = f'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>{section_id} {section_title}</title>
</head>
<body style="margin:0;padding:0;background:#f5f7fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
    <div style="max-width:100%;margin:0 auto;background:white;">
        <!-- 头部 -->
        <div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:16px 12px;text-align:center;">
            <div style="color:white;font-size:13px;opacity:0.9;margin-bottom:4px;">📚 操作系统第三章 · 内存管理</div>
            <h1 style="color:white;font-size:20px;font-weight:700;margin:0;">{section_id} {section_title}</h1>
        </div>
        
        <!-- 内容区 -->
        <div style="padding:12px;">
            {section_content}
        </div>
        
        <!-- 底部 -->
        <div style="padding:12px;background:#f8f9fa;text-align:center;border-top:1px solid #ecf0f1;">
            <div style="color:#95a5a6;font-size:12px;margin-bottom:4px;">💡 手机优化版 · 清晰易读</div>
            <div style="color:#7f8c8d;font-size:12px;">祝学习顺利，考研成功！💪🎓</div>
        </div>
    </div>
</body>
</html>'''
    
    return html_content

def send_single_email(section, index):
    """发送单个小节的邮件"""
    
    try:
        section_id = section['id']
        section_title = section['title']
        
        # 创建邮件对象
        msg = MIMEMultipart('alternative')
        msg['From'] = SENDER_EMAIL
        msg['To'] = RECEIVER_EMAIL
        subject_text = f'📚 3.{section_id} {section_title} | 操作系统第三章'
        msg['Subject'] = Header(subject_text, 'utf-8')
        
        # 生成HTML
        html_content = create_mobile_email_html(section)
        
        # 添加HTML内容
        html_part = MIMEText(html_content, 'html', 'utf-8')
        msg.attach(html_part)
        
        # 连接SMTP服务器并发送
        print(f'  [{index}/5] 正在发送 {section_id}...')
        server = smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT)
        server.login(SENDER_EMAIL, AUTH_CODE)
        server.sendmail(SENDER_EMAIL, RECEIVER_EMAIL, msg.as_string())
        server.quit()
        
        print(f'  ✅ {section_id} 发送成功')
        return True
        
    except Exception as e:
        print(f'  ❌ {section_id} 发送失败: {str(e)}')
        return False

def main():
    """主函数"""
    
    print('=' * 60)
    print('📧 操作系统第三章知识点邮件发送工具（分5封）')
    print('=' * 60)
    print()
    
    # 提取章节内容
    print('📖 正在提取第三章内容...')
    try:
        sections = extract_sections_from_ts()
        print(f'✅ 成功提取 {len(sections)} 个小节:')
        for section in sections:
            print(f'   - {section["id"]} {section["title"]}')
        print()
    except Exception as e:
        print(f'❌ 提取内容失败: {e}')
        return
    
    # 逐个发送邮件
    print('📤 开始发送邮件（共5封）...')
    print()
    
    success_count = 0
    for i, section in enumerate(sections, 1):
        success = send_single_email(section, i)
        if success:
            success_count += 1
        # 每封邮件间隔1秒，避免被限流
        if i < len(sections):
            import time
            time.sleep(1)
    
    print()
    print('=' * 60)
    if success_count == len(sections):
        print(f'✨ 全部发送完成！共 {success_count}/5 封')
        print('=' * 60)
        print()
        print('📱 邮件特点：')
        print('   • 完全去除Markdown痕迹')
        print('   • 纯HTML精美排版')
        print('   • 小边距设计，适配手机')
        print('   • 清晰的视觉层次')
        print()
        print('请检查邮箱查收5封邮件！')
    else:
        print(f'⚠️  部分发送完成：{success_count}/{len(sections)} 封')
        print('=' * 60)

if __name__ == '__main__':
    main()

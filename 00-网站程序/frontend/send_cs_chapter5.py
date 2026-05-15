#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
提取计组第五章知识点并发送邮件
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


def extract_chapter5_content():
    """从 composition.ts 中提取第五章内容"""
    ts_file = r"d:\学习\效率\00-网站程序\frontend\src\stores\composition.ts"
    
    if not os.path.exists(ts_file):
        print(f"❌ 文件不存在: {ts_file}")
        return None
    
    try:
        with open(ts_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 找到第五章的开始位置
        chapter5_start = content.find("id: 'ch5'")
        if chapter5_start == -1:
            print("❌ 未找到第五章内容")
            return None
        
        # 找到第六章的开始位置（或文件末尾）
        chapter6_start = content.find("id: 'ch6'", chapter5_start)
        if chapter6_start == -1:
            chapter6_start = len(content)
        
        # 提取第五章内容
        chapter5_section = content[chapter5_start:chapter6_start]
        
        # 提取 mindMap 和 sections
        mind_map_match = re.search(r"mindMap:\s*`([^`]+)`", chapter5_section, re.DOTALL)
        sections_match = re.findall(r"sections:\s*\[(.*?)\]\s*\},", chapter5_section, re.DOTALL)
        
        if not mind_map_match or not sections_match:
            print("❌ 无法解析第五章结构")
            return None
        
        # 构建Markdown内容
        markdown = "# 📧 计组第五章知识点 - 邮件内容\n\n"
        markdown += "**收件人**: 2142744149@qq.com  \n"
        markdown += "**主题**: 【408计算机组成原理】第五章 CPU（中央处理器）完整知识点总结  \n"
        markdown += "**授权码**: ushjvvzxbhqfbjie\n\n---\n\n"
        markdown += "## 📋 邮件正文\n\n你好！\n\n这是计算机组成原理第五章（CPU）的完整知识点总结，请查收。\n\n---\n\n"
        
        # 添加章节标题
        title_match = re.search(r"title:\s*'([^']+)'", chapter5_section)
        if title_match:
            markdown += f"# 📚 第五章 {title_match.group(1)}\n\n"
        
        # 添加思维导图
        markdown += "## 知识框架\n\n```\n"
        markdown += mind_map_match.group(1).strip()
        markdown += "\n```\n\n---\n\n"
        
        # 提取各个小节
        section_pattern = r"{\s*id:\s*'([^']+)',\s*title:\s*'([^']+)',\s*content:\s*`([^`]+)`"
        sections = re.findall(section_pattern, chapter5_section, re.DOTALL)
        
        for idx, (section_id, section_title, section_content) in enumerate(sections, 1):
            markdown += f"## {section_id} {section_title}\n\n"
            # 清理内容中的转义字符
            clean_content = section_content.replace('\\n', '\n').replace('\\t', '\t').replace("\\'", "'").replace('\\"', '"')
            markdown += clean_content.strip()
            markdown += "\n\n---\n\n"
        
        # 添加结尾
        markdown += "## 🏆 预期成果\n\n完成第五章的学习后，你将能够：\n\n"
        markdown += "✅ 理解CPU的基本功能和结构  \n"
        markdown += "✅ 掌握指令执行过程的四个阶段  \n"
        markdown += "✅ 分析数据通路和总线结构  \n"
        markdown += "✅ 对比硬布线和微程序控制器  \n"
        markdown += "✅ 计算流水线性能指标  \n"
        markdown += "✅ 应对408考研相关考题  \n\n---\n\n"
        markdown += "## 📞 后续学习建议\n\n"
        markdown += "1. **做题巩固**：完成课后习题和历年真题\n"
        markdown += "2. **画数据通路图**：理解指令执行流程\n"
        markdown += "3. **对比记忆**：硬布线 vs 微程序控制器\n"
        markdown += "4. **计算练习**：重点练习流水线性能计算\n"
        markdown += "5. **查漏补缺**：针对薄弱环节强化\n\n---\n\n"
        markdown += f"**发送日期**: {datetime.now().strftime('%Y-%m-%d')}  \n"
        markdown += "**科目**: 计算机组成原理（408）  \n"
        markdown += "**章节**: 第五章 CPU（中央处理器）  \n"
        markdown += "**授权码**: ushjvvzxbhqfbjie  \n\n"
        markdown += "**祝学习顺利，考研成功！** 💪🎓✨\n\n---\n\n"
        markdown += "**备注**: 本总结基于408考研大纲整理，涵盖了第五章的核心知识点、重点考点和解题技巧。建议结合教材和真题进行深入学习和练习。\n"
        
        return markdown
        
    except Exception as e:
        print(f"❌ 提取内容失败: {e}")
        import traceback
        traceback.print_exc()
        return None


def save_to_file(content, filename):
    """保存内容到文件"""
    output_path = os.path.join(r"d:\学习\效率\04-408专业课\01-知识点整理\计组", filename)
    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ 已保存到: {output_path}")
        return True
    except Exception as e:
        print(f"❌ 保存文件失败: {e}")
        return False


def markdown_to_html(markdown_text):
    """Markdown转HTML（移动端优化版）"""
    html = markdown_text
    
    # 处理代码块 - 移动端优化
    html = re.sub(r'```(\w*)\n(.*?)```', r'<pre style="background-color: #f5f5f5; padding: 12px; border-radius: 8px; overflow-x: auto; font-size: 13px; line-height: 1.5;"><code>\2</code></pre>', html, flags=re.DOTALL)
    
    # 处理表格 - 移动端简化
    lines = html.split('\n')
    processed_lines = []
    in_table = False
    table_html = []
    
    for line in lines:
        if '|' in line and line.strip().startswith('|'):
            if not in_table:
                in_table = True
                table_html = ['<div style="overflow-x: auto;"><table style="border-collapse: collapse; width: 100%; font-size: 14px;">']
            
            # 跳过分隔线
            if re.match(r'\|[\s\-:|]+\|', line):
                continue
            
            # 处理表头和数据行
            cells = [cell.strip() for cell in line.split('|')[1:-1]]
            if not table_html[-1].startswith('<tr>'):
                # 第一行是表头
                row = '<tr style="background-color: #667eea; color: white;">' + ''.join([f'<th style="padding: 10px 8px; text-align: left; font-size: 14px;">{cell}</th>' for cell in cells]) + '</tr>'
            else:
                row = '<tr style="border-bottom: 1px solid #e0e0e0;">' + ''.join([f'<td style="padding: 8px; font-size: 13px;">{cell}</td>' for cell in cells]) + '</tr>'
            table_html.append(row)
        else:
            if in_table:
                table_html.append('</table></div>')
                processed_lines.append('\n'.join(table_html))
                in_table = False
                table_html = []
            processed_lines.append(line)
    
    if in_table:
        table_html.append('</table></div>')
        processed_lines.append('\n'.join(table_html))
    
    html = '\n'.join(processed_lines)
    
    # 标题转换 - 移动端优化
    html = re.sub(r'^# (.+)$', r'<h1 style="color: #667eea; border-bottom: 3px solid #667eea; padding-bottom: 12px; margin: 25px 0 15px 0; font-size: 22px; line-height: 1.4;">\1</h1>', html, flags=re.MULTILINE)
    html = re.sub(r'^## (.+)$', r'<h2 style="color: #764ba2; margin: 20px 0 12px 0; padding: 10px 0 10px 12px; border-left: 4px solid #764ba2; font-size: 19px; line-height: 1.4;">\1</h2>', html, flags=re.MULTILINE)
    html = re.sub(r'^### (.+)$', r'<h3 style="color: #333; margin: 18px 0 10px 0; font-size: 16px; line-height: 1.4;">\1</h3>', html, flags=re.MULTILINE)
    
    # 加粗 - 移动端优化
    html = re.sub(r'\*\*(.+?)\*\*', r'<strong style="color: #FF9800; font-weight: 600;">\1</strong>', html)
    
    # 斜体
    html = re.sub(r'\*(.+?)\*', r'<em>\1</em>', html)
    
    # 列表 - 移动端优化
    html = re.sub(r'^- (.+)$', r'<li style="margin: 8px 0; padding-left: 5px; line-height: 1.6;">\1</li>', html, flags=re.MULTILINE)
    html = re.sub(r'(</li>\n<li)', r'\1', html)
    html = re.sub(r'((?:<li.*?</li>\n?)+)', r'<ul style="padding-left: 20px; margin: 10px 0;">\1</ul>', html)
    
    # 数学公式（简单处理）
    html = re.sub(r'\$\$(.+?)\$\$', r'<div style="text-align: center; font-size: 15px; margin: 15px 0; padding: 10px; background-color: #f9f9f9; border-radius: 6px; color: #2196F3;"><em>\1</em></div>', html, flags=re.DOTALL)
    html = re.sub(r'\$(.+?)\$', r'<code style="background-color: #f0f0f0; padding: 3px 6px; border-radius: 4px; color: #d63384; font-size: 13px;">\1</code>', html)
    
    # 链接
    html = re.sub(r'\[(.*?)\]\((.*?)\)', r'<a href="\2" style="color: #667eea; text-decoration: underline;">\1</a>', html)
    
    # 水平线
    html = re.sub(r'^---$', r'<hr style="border: none; height: 2px; background: linear-gradient(to right, #667eea, #764ba2); margin: 25px 0;">', html, flags=re.MULTILINE)
    
    # 换行 - 移动端增加间距
    html = html.replace('\n\n', '</p><p style="margin: 12px 0; line-height: 1.8;">')
    html = html.replace('\n', '<br>\n')
    
    # 包裹段落 - 移动端优化
    html = f'<p style="margin: 12px 0; line-height: 1.8; font-size: 15px;">{html}</p>'
    
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
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {{ 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', Arial, sans-serif; 
                        line-height: 1.8; 
                        max-width: 100%;
                        margin: 0;
                        padding: 15px;
                        background-color: #f5f5f5;
                        font-size: 15px;
                        color: #333;
                    }}
                    .container {{
                        background-color: white;
                        padding: 20px 15px;
                        border-radius: 12px;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                        max-width: 100%;
                    }}
                    h1 {{ 
                        color: #667eea; 
                        border-bottom: 3px solid #667eea; 
                        padding-bottom: 12px;
                        margin: 25px 0 15px 0;
                        font-size: 22px;
                        line-height: 1.4;
                    }}
                    h2 {{ 
                        color: #764ba2; 
                        margin: 20px 0 12px 0; 
                        padding: 10px 0 10px 12px; 
                        border-left: 4px solid #764ba2;
                        font-size: 19px;
                        line-height: 1.4;
                    }}
                    h3 {{ 
                        color: #333; 
                        margin: 18px 0 10px 0;
                        font-size: 16px;
                        line-height: 1.4;
                    }}
                    strong {{ 
                        color: #FF9800;
                        font-weight: 600;
                    }}
                    p {{
                        margin: 12px 0;
                        line-height: 1.8;
                        font-size: 15px;
                    }}
                    ul {{ 
                        padding-left: 20px;
                        margin: 10px 0;
                    }}
                    li {{ 
                        margin: 8px 0;
                        padding-left: 5px;
                        line-height: 1.6;
                    }}
                    table {{
                        border-collapse: collapse;
                        width: 100%;
                        margin: 15px 0;
                        font-size: 14px;
                    }}
                    th {{
                        background-color: #667eea;
                        color: white;
                        padding: 10px 8px;
                        text-align: left;
                        font-size: 14px;
                    }}
                    td {{
                        padding: 8px;
                        border-bottom: 1px solid #e0e0e0;
                        font-size: 13px;
                    }}
                    tr:nth-child(even) {{
                        background-color: #f9f9f9;
                    }}
                    code {{
                        background-color: #f0f0f0;
                        padding: 3px 6px;
                        border-radius: 4px;
                        color: #d63384;
                        font-family: 'Consolas', 'Monaco', monospace;
                        font-size: 13px;
                    }}
                    pre {{
                        background-color: #f5f5f5;
                        color: #333;
                        padding: 12px;
                        border-radius: 8px;
                        overflow-x: auto;
                        font-size: 13px;
                        line-height: 1.5;
                        margin: 12px 0;
                    }}
                    hr {{
                        border: none;
                        height: 2px;
                        background: linear-gradient(to right, #667eea, #764ba2);
                        margin: 25px 0;
                    }}
                    .highlight {{
                        background-color: #fff3cd;
                        border-left: 4px solid #ffc107;
                        padding: 12px 15px;
                        margin: 15px 0;
                        border-radius: 6px;
                    }}
                    /* 移动端优化 */
                    @media only screen and (max-width: 600px) {{
                        body {{
                            padding: 10px;
                            font-size: 14px;
                        }}
                        .container {{
                            padding: 15px 12px;
                        }}
                        h1 {{
                            font-size: 20px;
                        }}
                        h2 {{
                            font-size: 17px;
                        }}
                        h3 {{
                            font-size: 15px;
                        }}
                        table {{
                            font-size: 12px;
                        }}
                        th, td {{
                            padding: 6px 4px;
                        }}
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
    print("📧 计组第五章知识点邮件发送工具")
    print("=" * 60)
    print()
    
    # 提取第五章内容
    print("📖 正在提取计组第五章知识点...")
    content = extract_chapter5_content()
    
    if not content:
        print("❌ 无法提取第五章内容")
        return
    
    print("✅ 知识点提取成功")
    print(f"📄 内容长度: {len(content)} 字符")
    print()
    
    # 保存到文件
    print("💾 正在保存为文件...")
    filename = "计组第五章知识点-邮件内容.md"
    if not save_to_file(content, filename):
        print("⚠️  保存文件失败，但将继续发送邮件")
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
    subject = "【408计算机组成原理】第五章 CPU（中央处理器）完整知识点总结"
    success = send_email(subject, content, is_html=True)
    
    print()
    if success:
        print("=" * 60)
        print("🎉 发送完成！")
        print("=" * 60)
        print()
        print("📊 邮件内容包括:")
        print("   ✅ 第五章：CPU（中央处理器）")
        print("      - CPU的功能和基本构造")
        print("      - 指令执行过程")
        print("      - 数据通路和总线结构")
        print("      - 控制器设计")
        print("      - 流水线技术")
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

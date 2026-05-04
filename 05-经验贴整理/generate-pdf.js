const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const MarkdownIt = require('markdown-it');
const hljs = require('highlight.js');

// 初始化Markdown解析器
const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(str, { language: lang }).value;
            } catch (__) {}
        }
        return '';
    }
});

// 读取HTML模板
const template = fs.readFileSync(path.join(__dirname, 'pdf-template.html'), 'utf-8');

// 要转换的文件列表
const filesToConvert = [
    {
        input: '分析与总结/按科目汇总/数学一备考终极精炼指南.md',
        output: 'PDF输出/数学一备考终极精炼指南.pdf',
        title: '数学一备考终极精炼指南',
        headerInfo: '基于37篇11408高分经验贴深度提炼 | 目标分数: 130-150分'
    },
    {
        input: '分析与总结/按科目汇总/英语一备考终极精炼指南.md',
        output: 'PDF输出/英语一备考终极精炼指南.pdf',
        title: '英语一备考终极精炼指南',
        headerInfo: '基于37篇11408高分经验贴深度提炼 | 目标分数: 70-90分'
    },
    {
        input: '分析与总结/按科目汇总/政治备考终极精炼指南.md',
        output: 'PDF输出/政治备考终极精炼指南.pdf',
        title: '政治备考终极精炼指南',
        headerInfo: '基于37篇11408高分经验贴深度提炼 | 目标分数: 70-85分'
    },
    {
        input: '分析与总结/按科目汇总/408专业课备考终极精炼指南.md',
        output: 'PDF输出/408专业课备考终极精炼指南.pdf',
        title: '408专业课备考终极精炼指南',
        headerInfo: '基于37篇11408高分经验贴深度提炼 | 目标分数: 120-140分'
    },
    {
        input: '分析与总结/11408考研综合建议指南.md',
        output: 'PDF输出/11408考研综合建议指南.pdf',
        title: '11408考研综合建议指南',
        headerInfo: '心态调整 + 学习工具 + 资源推荐 + 学习社群'
    }
];

// 确保输出目录存在
const outputDir = path.join(__dirname, 'PDF输出');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// 转换单个文件
async function convertFile(fileConfig) {
    const inputPath = path.join(__dirname, fileConfig.input);
    const outputPath = path.join(__dirname, fileConfig.output);
    
    console.log(`\n📄 开始转换: ${fileConfig.title}`);
    console.log(`   输入: ${inputPath}`);
    console.log(`   输出: ${outputPath}`);
    
    // 检查文件是否存在
    if (!fs.existsSync(inputPath)) {
        console.error(`   ❌ 文件不存在: ${inputPath}`);
        return false;
    }
    
    try {
        // 读取Markdown内容
        const markdownContent = fs.readFileSync(inputPath, 'utf-8');
        
        // 转换为HTML
        const htmlContent = md.render(markdownContent);
        
        // 填充模板
        const finalHtml = template
            .replace('{{title}}', fileConfig.title)
            .replace('{{headerInfo}}', fileConfig.headerInfo)
            .replace('{{content}}', htmlContent);
        
        // 启动Puppeteer
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // 设置页面内容
        await page.setContent(finalHtml, {
            waitUntil: 'networkidle0'
        });
        
        // 生成PDF
        await page.pdf({
            path: outputPath,
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20mm',
                right: '20mm',
                bottom: '20mm',
                left: '20mm'
            },
            displayHeaderFooter: false,
            preferCSSPageSize: true
        });
        
        await browser.close();
        
        console.log(`   ✅ 转换成功!`);
        console.log(`   📊 文件大小: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);
        
        return true;
    } catch (error) {
        console.error(`   ❌ 转换失败: ${error.message}`);
        return false;
    }
}

// 主函数
async function main() {
    console.log('🚀 开始批量转换Markdown为PDF...\n');
    console.log('=' .repeat(60));
    
    let successCount = 0;
    let failCount = 0;
    
    for (const fileConfig of filesToConvert) {
        const success = await convertFile(fileConfig);
        if (success) {
            successCount++;
        } else {
            failCount++;
        }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log(`\n🎉 转换完成!`);
    console.log(`   ✅ 成功: ${successCount} 个文件`);
    console.log(`   ❌ 失败: ${failCount} 个文件`);
    console.log(`   📁 输出目录: ${outputDir}`);
    console.log('\n💡 提示: PDF文件已保存到 "PDF输出" 文件夹\n');
}

// 执行
main().catch(console.error);

/**
 * 408数据结构知识点优化导入工具（Node.js版本）
 * 使用TypeScript的import直接解析源文件
 */

const fs = require('fs');
const path = require('path');

// 源文件路径
const SOURCE_FILE = path.join(__dirname, '00-网站程序/frontend/src/stores/dataStructure.ts');
// 输出目录
const OUTPUT_DIR = "D:/yang'zhen'ning/Documents/我的obsidian库/YangYang/408数据结构";

function parseSourceFile(content) {
    console.log(' 正在解析TypeScript源文件...');
    
    const chapters = [];
    
    // 匹配章节：查找包含 number: 和 title: 的对象
    const chapterRegex = /\{\s*id:\s*['"]([^'"]+)['"],\s*number:\s*(\d+),\s*title:\s*['"]([^'"]+)['"],\s*score:\s*['"]([^'"]+)['"],\s*importance:\s*['"]([^'"]+)['"]/g;
    
    let chapterMatch;
    while ((chapterMatch = chapterRegex.exec(content)) !== null) {
        const chapterId = chapterMatch[1];
        const chapterNum = parseInt(chapterMatch[2]);
        const chapterTitle = chapterMatch[3];
        const chapterScore = chapterMatch[4];
        const chapterImportance = chapterMatch[5];
        
        // 查找该章节的sections
        const chapterStart = chapterMatch.index;
        const nextChapterMatch = chapterRegex.exec(content);
        const chapterEnd = nextChapterMatch ? nextChapterMatch.index : content.length;
        chapterRegex.lastIndex = chapterMatch.index; // 恢复位置
        
        const chapterContent = content.substring(chapterStart, chapterEnd);
        
        // 匹配sections
        const sectionRegex = /\{\s*id:\s*['"](\d+\.\d+)['"],\s*title:\s*['"]([^'"]+)['"],\s*content:\s*`([\s\S]*?)`\s*\}/g;
        const sections = [];
        
        let sectionMatch;
        while ((sectionMatch = sectionRegex.exec(chapterContent)) !== null) {
            const sectionId = sectionMatch[1];
            const sectionTitle = sectionMatch[2];
            let sectionContent = sectionMatch[3];
            
            // 处理转义字符
            sectionContent = sectionContent
                .replace(/\\n/g, '\n')
                .replace(/\\t/g, '\t')
                .replace(/\\`/g, '`')
                .replace(/\\\$/g, '$');
            
            sections.push({ id: sectionId, title: sectionTitle, content: sectionContent });
        }
        
        chapters.push({
            id: chapterId,
            number: chapterNum,
            title: chapterTitle,
            score: chapterScore,
            importance: chapterImportance,
            sections: sections
        });
    }
    
    console.log(`✅ 解析了 ${chapters.length} 个章节`);
    chapters.forEach(ch => {
        console.log(`  - 第${ch.number}章: ${ch.title} (${ch.sections.length}个知识点)`);
    });
    
    return chapters;
}

function createNote(chapter, section, outputDir) {
    const chapterFolder = `第${chapter.number}章_${chapter.title.replace(/[\/\\]/g, '、')}`;
    const sectionFilename = `${section.id}_${section.title.replace(/[\/\\]/g, '_')}.md`;
    
    const folderPath = path.join(outputDir, chapterFolder);
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
    
    const filepath = path.join(folderPath, sectionFilename);
    
    const frontmatter = `---
tags:
  - 408
  - 数据结构
  - 第${chapter.number}章
  - ${chapter.title}
section_id: "${section.id}"
chapter: "第${chapter.number}章 ${chapter.title}"
importance: ${chapter.importance}
score: "${chapter.score}"
---

${section.content}
`;
    
    fs.writeFileSync(filepath, frontmatter, 'utf-8');
    return filepath;
}

function main() {
    console.log('=' .repeat(60));
    console.log('408数据结构知识点优化导入工具');
    console.log('='.repeat(60));
    console.log();
    
    // 读取源文件
    const content = fs.readFileSync(SOURCE_FILE, 'utf-8');
    
    // 解析章节
    const chapters = parseSourceFile(content);
    
    // 创建输出目录
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    // 导出所有知识点
    console.log('\n📝 正在导出知识点...');
    let totalCount = 0;
    
    chapters.forEach(chapter => {
        console.log(`\n📖 第${chapter.number}章: ${chapter.title}`);
        chapter.sections.forEach(section => {
            try {
                createNote(chapter, section, OUTPUT_DIR);
                console.log(`  ✓ ${section.id} ${section.title}`);
                totalCount++;
            } catch (error) {
                console.error(`  ✗ ${section.id} - ${error.message}`);
            }
        });
    });
    
    console.log('\n' + '='.repeat(60));
    console.log(`✅ 成功导出 ${totalCount} 个知识点`);
    console.log('='.repeat(60));
    console.log('\n📁 输出位置:', OUTPUT_DIR);
}

main();

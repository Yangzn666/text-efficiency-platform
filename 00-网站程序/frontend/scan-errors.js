const fs = require('fs');
const path = require('path');

function scanDirectory(dir) {
    const errors = [];
    
    function walk(currentDir) {
        const files = fs.readdirSync(currentDir);
        
        files.forEach(file => {
            const filePath = path.join(currentDir, file);
            const stat = fs.statSync(filePath);
            
            if (stat.isDirectory()) {
                walk(filePath);
            } else if (file.endsWith('.vue')) {
                const content = fs.readFileSync(filePath, 'utf8');
                
                // 检查未闭合的标签
                const tagMatches = content.match(/<(\w+)(?:\s[^>]*)?(?<!\/)>/g);
                if (tagMatches) {
                    tagMatches.forEach(match => {
                        const tagName = match.match(/<(\w+)/)[1];
                        if (!content.includes(`</${tagName}>`) && !match.includes('/>')) {
                            errors.push({
                                file: filePath,
                                type: 'unclosed_tag',
                                tag: tagName,
                                content: match
                            });
                        }
                    });
                }
                
                // 检查编码问题
                if (content.includes('?') && /[^\x00-\x7F]/.test(content)) {
                    const lines = content.split('\n');
                    lines.forEach((line, index) => {
                        if (line.includes('?') && /[^\x00-\x7F]/.test(line)) {
                            errors.push({
                                file: filePath,
                                type: 'encoding_issue',
                                line: index + 1,
                                content: line.trim()
                            });
                        }
                    });
                }
                
                // 检查CSS大括号
                const styleMatch = content.match(/<style[^>]*>([\s\S]*)<\/style>/);
                if (styleMatch) {
                    const css = styleMatch[1];
                    const openBraces = (css.match(/{/g) || []).length;
                    const closeBraces = (css.match(/}/g) || []).length;
                    if (openBraces !== closeBraces) {
                        errors.push({
                            file: filePath,
                            type: 'css_brace_mismatch',
                            open: openBraces,
                            close: closeBraces
                        });
                    }
                }
            }
        });
    }
    
    walk(dir);
    return errors;
}

const errors = scanDirectory('./src');
console.log('发现的错误:');
console.log(JSON.stringify(errors, null, 2));
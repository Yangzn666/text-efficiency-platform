const fs = require('fs');
const path = require('path');

function findAllErrors(dir) {
    const errors = [];
    
    function walk(currentDir) {
        const files = fs.readdirSync(currentDir);
        
        files.forEach(file => {
            const filePath = path.join(currentDir, file);
            const stat = fs.statSync(filePath);
            
            if (stat.isDirectory()) {
                walk(filePath);
            } else if (file.endsWith('.vue')) {
                try {
                    const content = fs.readFileSync(filePath, 'utf8');
                    
                    // 检查编码问题
                    const encodingIssues = [];
                    const lines = content.split('\n');
                    lines.forEach((line, index) => {
                        if (line.includes('?') && /[^\x00-\x7F]/.test(line)) {
                            encodingIssues.push({
                                line: index + 1,
                                content: line.trim().substring(0, 100)
                            });
                        }
                    });
                    
                    if (encodingIssues.length > 0) {
                        errors.push({
                            file: filePath,
                            type: 'encoding',
                            issues: encodingIssues
                        });
                    }
                    
                    // 检查明显的语法错误
                    if (content.includes('<div class="stats-section">') && 
                        !content.includes('</div><!-- stats-section -->') &&
                        content.split('<div class="stats-section">').length > 
                        content.split('</div>').filter(d => d.includes('stats-section')).length) {
                        errors.push({
                            file: filePath,
                            type: 'unclosed_div',
                            element: 'stats-section'
                        });
                    }
                    
                } catch (err) {
                    errors.push({
                        file: filePath,
                        type: 'read_error',
                        error: err.message
                    });
                }
            }
        });
    }
    
    walk(dir);
    return errors;
}

const allErrors = findAllErrors('./src');
console.log('=== 发现的所有错误 ===');
allErrors.forEach(error => {
    console.log(`${error.file}: ${error.type}`);
    if (error.issues) {
        error.issues.forEach(issue => {
            console.log(`  行${issue.line}: ${issue.content}`);
        });
    }
});
console.log(`\n总共发现错误文件数: ${allErrors.length}`);
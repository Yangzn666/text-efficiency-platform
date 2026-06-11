const fs = require('fs');

// 读取数据
const data = JSON.parse(fs.readFileSync('data/reading-questions.json', 'utf8'));

// 找到Text4的所有题目
const text4Questions = data.questions.filter(q => 
  q.year === 2005 && 
  q.section === 'Traditional Reading' && 
  q.textNumber === 4
);

console.log(`\n📝 Text4 题目数量: ${text4Questions.length}\n`);

// 为每道题添加详细解析模板
text4Questions.forEach((q, index) => {
  console.log(`处理第${q.number}题...`);
  
  // 如果已经有detailedAnalysis,跳过
  if (q.detailedAnalysis) {
    console.log(`  ⏭️ 已有详细解析,跳过`);
    return;
  }
  
  // 根据题号添加不同的详细解析内容
  let detailedContent = {};
  
  switch(q.number) {
    case 37: // 词义题 - talking
      detailedContent = {
        articleStructure: [
          { paragraph: 1, content: "引出话题", keyPoint: "美国人不再期望精通英语" },
          { paragraph: 2, content: "McWhorter观点", keyPoint: "语言变化是自然的" },
          { paragraph: 3, content: "⭐关键段落!", keyPoint: "talking vs speaking的对比" },
          { paragraph: 4, content: "反驳误解", keyPoint: "语言形式≠思维能力" },
          { paragraph: 5, content: "文化对比", keyPoint: "paper plates vs china类比" }
        ],
        vocabulary: [
          { word: "authentic", meaning: "真实的,真诚的", example: "the cult of the authentic = 对真实性的崇拜" },
          { word: "elevated tone", meaning: "高雅的语调", context: "正式写作的特点" },
          { word: "performative", meaning: "表演性的", note: "指诗歌需要朗诵表演" },
          { word: "spontaneity", meaning: "自发性", contrast: "vs craft(精心制作)" },
          { word: "triumph over", meaning: "胜过,战胜", example: "talking triumphs over speaking" }
        ],
        questionBreakdown: {
          step1: "📍定位:第三段第6行'talking is triumphing over speaking'",
          step2: "找对比:talking vs speaking, spontaneity vs craft",
          step3: "✅理解:talking=随意交谈(非正式), speaking=正式演讲",
          step4: "❌排除:",
          elimination: [
            "A(modesty谦虚):文中没提到谦虚的概念",
            "B(personality个性):虽然提到personal,但强调的是表达方式,不是个性",
            "C(liveliness生动):文中说诗歌有liveliness,但不是talking的含义"
          ]
        },
        commonTraps: [
          "️ 陷阱1:看到personal就选personality - 要注意上下文,talking强调的是表达方式",
          "⚠️ 陷阱2:混淆不同段落的词汇 - liveliness在第三段形容诗歌,不是talking的意思",
          "⚠️ 陷阱3:忽视对比结构 - talking vs speaking是关键线索"
        ],
        memoryTechnique: {
          method: "【对比配对法】",
          explanation: "建立对比表:talking(随意)=informal, speaking(正式)=formal。就像聊天vs演讲的区别。",
          keyword: "talking = 聊天、闲谈 → 轻松随意 → informality(非正式性)",
          visualAid: "💬 talking(聊天) vs 🎤 speaking(演讲) = informal vs formal"
        }
      };
      break;
      
    case 38: // 推理题 - McWhorter观点
      detailedContent = {
        articleStructure: [
          { paragraph: 1, content: "引出话题", keyPoint: "反文化导致正式英语衰落" },
          { paragraph: 2, content: "核心观点", keyPoint: "语言变化是自然的" },
          { paragraph: 3, content: "解释原因", keyPoint: "个人主义文化的影响" },
          { paragraph: 4, content: "⭐关键段落!", keyPoint: "所有语言都有表现力" },
          { paragraph: 5, content: "文化对比", keyPoint: "哀悼失去美丽的东西" }
        ],
        vocabulary: [
          { word: "acknowledge", meaning: "承认", example: "he acknowledges that..." },
          { word: "powerfully expressive", meaning: "很有表现力的", context: "形容各种语言变体" },
          { word: "think straight", meaning: "清晰思考", note: "straight=清晰的,直接的" },
          { word: "talk proper", meaning: "说话规范", contrast: "vs talk improper(说话不规范)" },
          { word: "convey complex ideas", meaning: "传达复杂思想", example: "所有语言都能做到" }
        ],
        questionBreakdown: {
          step1: "📍定位:第四段最后一句'He is not arguing...that we can no longer think straight'",
          step2: "理解双重否定:not arguing + no longer = 认为可以",
          step3: "✅转换:不认为我们不能清晰思考 = 认为我们能清晰思考(即使说话不规范)",
          step4: "❌排除:",
          elimination: [
            "B(more expressive比较级):原文说'都可以很有表现力',没有比较谁更强",
            "C(entertaining有趣的):entertaining形容的是examples,不是language varieties",
            "D(best convey最好传达):原文明确说'没有不能传达的语言',所以没有'最好'"
          ]
        },
        commonTraps: [
          "⚠️ 陷阱1:比较级陷阱 - 看到more/better/than要警惕,原文没比较就别选",
          "⚠️ 陷阱2:偷换主语 - entertaining修饰的是examples,不是languages",
          "⚠️ 陷阱3:双重否定理解错误 - not...no = 肯定,要学会转换"
        ],
        memoryTechnique: {
          method: "【双重否定破解法】",
          explanation: "not arguing(不认为) + no longer think straight(不能再清晰思考) = 认为我们可以清晰思考",
          keyword: "think straight = logical thinking(逻辑思维)",
          visualAid: "🔄 not...no = ✅ 肯定 | 说话不规范 ≠ 思维不清晰"
        }
      };
      break;
      
    case 39: // 推理题 - Russians例子
      detailedContent = {
        articleStructure: [
          { paragraph: 1, content: "引出话题", keyPoint: "反文化导致正式英语衰落" },
          { paragraph: 2, content: "核心观点", keyPoint: "语言变化是自然的" },
          { paragraph: 3, content: "解释原因", keyPoint: "个人主义文化的影响" },
          { paragraph: 4, content: "反驳误解", keyPoint: "语言形式≠思维能力" },
          { paragraph: 5, content: "⭐关键段落!", keyPoint: "俄罗斯人和意大利人的例子" }
        ],
        vocabulary: [
          { word: "memorize", meaning: "背诵,记住", example: "memorized poetry = 背诵的诗歌" },
          { word: "elaborate", meaning: "精心制作的", example: "elaborate speech = 精心准备的演讲" },
          { word: "appreciation", meaning: "欣赏,赞赏", note: "比interest程度更深" },
          { word: "contempt", meaning: "蔑视,轻视", antonym: "admiration(钦佩)" },
          { word: "old-fashioned", meaning: "过时的,守旧的", context: "意大利政治家的演讲显得过时" }
        ],
        questionBreakdown: {
          step1: "📍定位:第五段'Russians have a deep love...and carry large chunks of memorized poetry'",
          step2: "找关键词:memorized(背诵)暗示努力和付出",
          step3: "✅理解:作者用正面例子表达对这种文化努力的欣赏(appreciation)",
          step4: "❌排除:",
          elimination: [
            "A(interest兴趣):太浅层,只是'感兴趣',没有体现作者的正面评价和赞赏",
            "C(memory记忆力):偏离重点,重点是热爱和努力,不是记忆力好",
            "D(contempt蔑视):完全相反,作者是正面态度"
          ]
        },
        commonTraps: [
          "⚠️ 陷阱1:把客观描述当主观评价 - interest太中性,不够准确",
          "⚠️ 陷阱2:关注表面词汇 - 看到memorized就想到memory,忽略了背后的努力含义",
          "⚠️ 陷阱3:忽视情感色彩 - 作者是正面赞赏,不是中立或负面"
        ],
        memoryTechnique: {
          method: "【关键词定位法】",
          explanation: "memorized(需要努力背诵) + elaborate(需要用心准备) = efforts(努力付出)",
          keyword: "memorized/elaborate → effort → appreciation of efforts",
          visualAid: "📚 memorized(背诵) + 🎨 elaborate(精心) = 💪 efforts(努力) → 👍 appreciation(赞赏)"
        }
      };
      break;
      
    case 40: // 类比题 - paper plates vs china
      detailedContent = {
        articleStructure: [
          { paragraph: 1, content: "引出话题", keyPoint: "反文化导致正式英语衰落" },
          { paragraph: 2, content: "核心观点", keyPoint: "语言变化是自然的" },
          { paragraph: 3, content: "解释原因", keyPoint: "个人主义文化的影响" },
          { paragraph: 4, content: "反驳误解", keyPoint: "语言形式≠思维能力" },
          { paragraph: 5, content: "⭐关键段落!", keyPoint: "paper plates vs china的类比" }
        ],
        vocabulary: [
          { word: "grieve over", meaning: "为...感到悲伤", example: "grieving over the loss = 为失去而悲伤" },
          { word: "beautiful more than useful", meaning: "美丽多于实用", note: "强调美感价值" },
          { word: "inevitable", meaning: "不可避免的", synonym: "unavoidable" },
          { word: "functional", meaning: "功能性的,实用的", contrast: "vs artistic(艺术性的)" },
          { word: "artistic", meaning: "艺术性的,美观的", example: "china represents artistic value" }
        ],
        questionBreakdown: {
          step1: "定位:最后一段'grieving over the loss of something beautiful more than useful'",
          step2: "🔍理解类比:paper plates(纸盘子)=实用,functional; china(瓷器)=美丽,artistic",
          step3: "✅匹配:C选项'functional is to artistic'(功能性对艺术性)完美对应",
          step4: "❌排除:",
          elimination: [
            "A(temporary vs permanent临时vs永久):不准确,区别在于功能和美感,不在使用时间",
            "B(radical vs conservative激进vs保守):与文意无关,文章没讨论激进保守",
            "D(humble vs noble卑微vs高贵):有阶级色彩,不符合文意"
          ]
        },
        commonTraps: [
          "⚠️ 陷阱1:表面理解 - 只看到纸盘子和瓷器的物理属性,没理解象征意义",
          "⚠️ 陷阱2:过度联想 - 加入阶级观念(humble/noble),超出原文范围",
          "⚠️ 陷阱3:忽视关键句 - 'beautiful more than useful'是解题核心"
        ],
        memoryTechnique: {
          method: "【功能vs美感联想法】",
          explanation: "纸盘子=便宜实用用完就扔,瓷器=精美昂贵值得收藏。就像快餐vs高级餐厅的区别。",
          keyword: "paper plates=functional(实用), china=artistic(艺术)",
          visualAid: "🍽️ paper plates(实用) : 🏺 china(美丽) = functional : artistic"
        }
      };
      break;
  }
  
  // 添加到题目对象中
  q.detailedAnalysis = detailedContent;
});

// 保存更新后的数据
fs.writeFileSync('data/reading-questions.json', JSON.stringify(data, null, 2), 'utf8');

console.log('\n✅ Text4所有题目的详细解析已添加完成!\n');

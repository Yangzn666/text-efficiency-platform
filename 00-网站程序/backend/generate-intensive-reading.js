// 生成精读分析数据
const fs = require('fs')
const path = require('path')

const data = {
  "2005-Traditional Reading-1": {
    "theme": "本文通过猴子实验揭示了公平感的进化起源。文章指出，卷尾猴与人类一样，具有社会情感和公平意识。当感受到不公平对待时，猴子会产生义愤并拒绝接受较差的奖励。研究表明，公平感可能并非人类独有，而是源于3500万年前的共同祖先，或在两个物种中独立进化。",
    "structure": "第一段：引出话题\n  ├─ 现象描述：人们喜欢加薪，但同事加薪更多会不满\n  ├─ 传统观点：这种行为是人类特有的\n  └─ 研究结论：猴子也有公平感\n\n第二段：介绍实验对象\n  ├─ 研究对象：雌性棕色卷尾猴\n  ├─ 性格特点：可爱、友善、合作、乐于分享\n  └─ 关键特征：像人类女性一样关注商品和服务的价值\n\n第三段：实验设计\n  ├─ 训练阶段：用两年时间教猴子用代币换食物\n  ├─ 正常情况：猴子愿意用石头换黄瓜片\n  └─ 实验设置：两只猴子分别观察对方的回报\n\n第四段：实验结果\n  ├─ 葡萄vs黄瓜：葡萄是奢侈品，更受欢迎\n  ├─ 不公平反应：拒绝用代币换黄瓜，甚至扔掉代币\n  └─ 关键发现：仅看到葡萄就足以引发怨恨\n\n第五段：研究意义\n  ├─ 核心结论：猴子像人类一样受社会情感引导\n  ├─ 进化意义：合作需要公平感维持稳定\n  └─ 未解之谜：公平感是独立进化还是共同祖先遗传",
    "writingTechniques": [
      "对比论证：人类vs猴子、葡萄vs黄瓜",
      "引用研究：引用Nature杂志增强权威性",
      "具体案例：用猴子实验说明抽象的公平概念",
      "设问结尾：用未解之谜引发思考",
      "类比手法：用人类加薪场景类比猴子实验"
    ],
    "readingStrategies": [
      "关注转折词：But、However引出核心观点",
      "识别研究引用：Nature提示科研类文章",
      "抓住实验逻辑：训练→实验→结果→结论",
      "理解类比：人类与猴子行为对比是主线",
      "注意专业术语：cooperative species等"
    ],
    "keyVocabulary": [
      {"word": "grievance", "meaning": "不满、委屈", "context": "sense of grievance 不公平感"},
      {"word": "outraged", "meaning": "愤怒的", "context": "you might even be outraged"},
      {"word": "capuchin", "meaning": "卷尾猴", "context": "brown capuchin monkeys"},
      {"word": "reluctant", "meaning": "不情愿的", "context": "was reluctant to hand over"},
      {"word": "induce", "meaning": "引起、诱导", "context": "induce resentment 引发怨恨"},
      {"word": "righteous indignation", "meaning": "义愤", "context": "Feelings of righteous indignation"},
      {"word": "preserve", "meaning": "专属领域", "context": "not the preserve of people alone"},
      {"word": "stems from", "meaning": "源于", "context": "stems from the common ancestor"}
    ],
    "grammarPoints": [
      "形式主语：Such behaviour is regarded as...（被动语态）",
      "定语从句：which has just been published in Nature",
      "比较结构：pay much closer attention to...than males",
      "结果状语：so that each could observe...",
      "插入语：like their female human counterparts"
    ],
    "examTips": [
      "考研常考科研类文章，掌握现象-实验-结果-结论结构",
      "注意首段，通常包含主旨信息",
      "实验细节题常考，区分训练和实验阶段",
      "作者态度：客观报道，中立偏积极",
      "词义猜测：注意上下文语境和同义替换",
      "推理题：根据实验结果推断观点或意义"
    ]
  },
  "2005-Use of English": {
    "theme": "本文探讨了人类嗅觉能力的真相，反驳了人类嗅觉不敏感的传统观点。文章指出，人类直立行走导致鼻子只能感知空气中的气味。但事实上，人类嗅觉极其敏感，能察觉到浓度低至百万分之一的气味。文章还解释了个体差异的原因（基因不同）以及大脑的高效调节机制。",
    "structure": "第一段：反驳传统观点\n  ├─ 传统认知：人类嗅觉不如动物灵敏\n  ├─ 原因分析：直立行走导致鼻子功能受限\n  ├─ 事实真相：人类嗅觉其实极其敏感\n  └─ 数据支撑：能感知百万分之一浓度的气味\n\n第二段：解释个体差异\n  ├─ 现象描述：有些人对某些气味不敏感\n  ├─ 基因原因：缺乏产生特定感受器的基因\n  ├─ 感受器功能：感知气味并向大脑发送信号\n  └─ 可塑性：通过频繁接触可以变得敏感\n\n第三段：大脑调节机制\n  ├─ 效率原则：大脑不会让所有感受器一直工作\n  ├─ 适应能力：需要时可以创造新的感受器\n  ├─ 生活实例：对自家气味不敏感，对别人家敏感\n  └─ 进化意义：保持感受器应对紧急信号",
    "writingTechniques": [
      "对比论证：人类vs动物、有些人vs另一些人",
      "转折论证：先提出错误观点，再用事实反驳",
      "让步论证：even if/even when承认事实引出更重要观点",
      "因果分析：层层递进解释原因",
      "举例说明：用烟味预示火灾的例子",
      "数据支撑：one part in one million增强说服力"
    ],
    "readingStrategies": [
      "关注转折词：but/In fact/However引出作者真实观点",
      "识别让步结构：although/though引导的是次要信息",
      "注意对比信号：compared with提示比较关系",
      "抓住主题句：段落首句通常是主题句",
      "理解长难句：先找主干，再分析修饰成分",
      "注意指代关系：it/this/that指代的内容在前文"
    ],
    "keyVocabulary": [
      {"word": "underrated", "meaning": "被低估的", "context": "an underrated tool"},
      {"word": "insensitive", "meaning": "不敏感的", "context": "insensitive smellers"},
      {"word": "upright", "meaning": "直立的", "context": "we stand upright"},
      {"word": "perceiving", "meaning": "感知", "context": "perceiving those smells"},
      {"word": "diluted", "meaning": "稀释的", "context": "diluted to far below"},
      {"word": "receptors", "meaning": "感受器", "context": "smell receptors"},
      {"word": "generate", "meaning": "产生、生成", "context": "generate smell receptors"},
      {"word": "inefficient", "meaning": "低效的", "context": "finds it inefficient"}
    ],
    "grammarPoints": [
      "形式宾语：finds it inefficient to keep...",
      "非限制性定语从句：which float through the air",
      "让步状语从句：even when these are diluted to...",
      "原因状语从句：because some people do not have...",
      "现在分词作后置定语：smells which stick to surfaces"
    ],
    "examTips": [
      "完形填空常考逻辑关系词：but/however/although",
      "注意上下文语义连贯性",
      "词义辨析：根据语境选择最合适的词",
      "固定搭配：capable of/in contrast to等",
      "语法结构：注意从句类型和连接词",
      "语篇理解：把握文章整体逻辑脉络"
    ]
  }
}

const outputPath = path.join(__dirname, 'data', 'intensive-reading-analysis.json')
fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8')
console.log('✅ 精读数据文件已生成：', outputPath)

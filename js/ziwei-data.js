/**
 * Zi Wei Dou Shu (紫微斗数) - Reference Data
 * 星曜、宫位、四化等参考数据
 * 数据来源：mingli-master 项目 references/
 */
var ZiWeiData = (function() {
    'use strict';

    // ==================== 十二宫位 ====================
    var PALACES = [
        { name: '命宫', nameEn: 'Life', desc: '先天禀赋、性格核心、一生运势基调' },
        { name: '兄弟宫', nameEn: 'Siblings', desc: '兄弟姐妹、同辈关系、合作伙伴' },
        { name: '夫妻宫', nameEn: 'Spouse', desc: '感情婚姻、配偶特征、缘分模式' },
        { name: '子女宫', nameEn: 'Children', desc: '子女缘、下属关系、创造力' },
        { name: '财帛宫', nameEn: 'Wealth', desc: '财运模式、赚钱能力、理财观念' },
        { name: '疾厄宫', nameEn: 'Health', desc: '身体健康、疾病倾向、体质' },
        { name: '迁移宫', nameEn: 'Travel', desc: '外出发展、环境变化、社交圈' },
        { name: '交友宫', nameEn: 'Friends', desc: '朋友关系、下属、合作伙伴' },
        { name: '官禄宫', nameEn: 'Career', desc: '事业发展、工作能力、职业倾向' },
        { name: '田宅宫', nameEn: 'Property', desc: '家庭环境、不动产、祖业' },
        { name: '福德宫', nameEn: 'Fortune', desc: '精神世界、福气、享受方式' },
        { name: '父母宫', nameEn: 'Parents', desc: '父母关系、长辈缘、上司关系' }
    ];

    // ==================== 十四主星 ====================
    var MAJOR_STARS = {
        '紫微': {
            prototype: '帝星、领袖星',
            prototypeEn: 'the Emperor Star, a natural leader',
            traits: '自尊心强、有领袖气场、不愿居人之下',
            traitsEn: 'Strong self-esteem, commanding presence, unwilling to be subordinate',
            analogy: '走进房间不用说话，别人自动给你让座的人',
            analogyEn: 'Someone who walks into a room and commands respect without saying a word',
            strengths: '统御力强、有主见、格局大',
            strengthsEn: 'Strong leadership, decisive, broad vision',
            risks: '孤高、好面子、不愿示弱',
            risksEn: 'Aloof, cares too much about face, unwilling to show weakness',
            palaces: {
                '命宫': '天生的领导者气质，但需要配合才能发挥',
                '官禄宫': '适合做管理层或自己当老板',
                '财帛宫': '赚钱格局大，但不屑于小钱'
            },
            palacesEn: {
                '命宫': 'Born leader qualities, but need the right support to shine',
                '官禄宫': 'Suited for management or entrepreneurship',
                '财帛宫': 'Big-picture wealth mindset, disdains small gains'
            }
        },
        '天机': {
            prototype: '谋士星、智慧星',
            prototypeEn: 'the Strategist Star, the Wisdom Star',
            traits: '思维敏捷、善变、多学少精',
            traitsEn: 'Quick-witted, adaptable, learns broadly but masters few',
            analogy: '永远在想"下一步怎么办"的军师',
            analogyEn: 'A strategist always thinking "what\'s the next move"',
            strengths: '聪明、反应快、善于分析和策划',
            strengthsEn: 'Intelligent, quick reflexes, excellent at analysis and planning',
            risks: '想太多做太少、容易变卦、焦虑倾向',
            risksEn: 'Overthinks, under-acts, prone to changing plans, anxiety tendencies',
            palaces: {
                '命宫': '思维活跃，适合策划型工作',
                '官禄宫': '适合咨询、策划、技术类工作',
                '夫妻宫': '伴侣聪明但多变'
            },
            palacesEn: {
                '命宫': 'Active mind, suited for strategic work',
                '官禄宫': 'Suited for consulting, planning, technical roles',
                '夫妻宫': 'Partner is intelligent but changeable'
            }
        },
        '太阳': {
            prototype: '光明星、付出星',
            prototypeEn: 'the Sun Star, the Giving Star',
            traits: '热情、慷慨、爱面子、利他',
            traitsEn: 'Warm, generous, cares about reputation, altruistic',
            analogy: '永远在发光发热，照亮别人但自己会累',
            analogyEn: 'Always shining bright, illuminating others but burning out oneself',
            strengths: '热情大方、有感染力、乐于助人',
            strengthsEn: 'Enthusiastic, infectious energy, eager to help others',
            risks: '过度付出、爱面子不愿求助、容易 burnout',
            risksEn: 'Over-giving, too proud to ask for help, prone to burnout',
            palaces: {
                '命宫': '天生的社交达人，但需要学会"收"',
                '官禄宫': '适合公众性强的工作（教育、媒体、销售）',
                '夫妻宫': '伴侣热情大方'
            },
            palacesEn: {
                '命宫': 'Natural social butterfly, but needs to learn restraint',
                '官禄宫': 'Suited for public-facing work (education, media, sales)',
                '夫妻宫': 'Partner is warm and generous'
            }
        },
        '武曲': {
            prototype: '财星、将星',
            prototypeEn: 'the Wealth Star, the General Star',
            traits: '务实、果断、拼搏、重义',
            traitsEn: 'Pragmatic, decisive, hardworking, values loyalty',
            analogy: '说干就干、不废话的实干家',
            analogyEn: 'A doer who acts first and talks later',
            strengths: '执行力强、有魄力、理财能力强',
            strengthsEn: 'Strong execution, bold, excellent financial management',
            risks: '过于刚硬、不善于表达感情、孤独感',
            risksEn: 'Too rigid, poor at expressing emotions, sense of loneliness',
            palaces: {
                '命宫': '行动派，适合创业或需要魄力的工作',
                '官禄宫': '事业上能拼出成绩',
                '财帛宫': '财运好，但要靠自己打拼'
            },
            palacesEn: {
                '命宫': 'Action-oriented, suited for entrepreneurship or bold roles',
                '官禄宫': 'Able to achieve significant career results',
                '财帛宫': 'Good wealth luck, but requires hard work'
            }
        },
        '天同': {
            prototype: '福星、享受星',
            prototypeEn: 'the Fortune Star, the Enjoyment Star',
            traits: '温和、乐观、重享受、不喜争斗',
            traitsEn: 'Gentle, optimistic, pleasure-seeking, dislikes conflict',
            analogy: '"差不多就行了，何必那么累"的生活家',
            analogyEn: 'A life enthusiast who says "good enough is good enough"',
            strengths: '人缘好、心态好、抗压能力强',
            strengthsEn: 'Popular, positive mindset, strong stress tolerance',
            risks: '缺乏进取心、容易满足现状、拖延',
            risksEn: 'Lacks ambition, easily content with status quo, procrastinates',
            palaces: {
                '命宫': '性格温和，适合服务型工作',
                '官禄宫': '事业上不争不抢，稳步前进',
                '福德宫': '精神世界丰富，懂得享受生活'
            },
            palacesEn: {
                '命宫': 'Gentle personality, suited for service-oriented work',
                '官禄宫': 'Steady career progress without aggressive competition',
                '福德宫': 'Rich inner world, knows how to enjoy life'
            }
        },
        '廉贞': {
            prototype: '囚星、桃花星',
            prototypeEn: 'the Prison Star, the Romance Star',
            traits: '执着、有魅力、爱恨分明、不服输',
            traitsEn: 'Persistent, charismatic, clear loves and hates, refuses to lose',
            analogy: '一旦爱上就全力以赴，一旦受伤就记一辈子的人',
            analogyEn: 'Someone who loves with full force and remembers hurts forever',
            strengths: '有魅力、执着、有艺术天赋',
            strengthsEn: 'Charismatic, persistent, artistic talent',
            risks: '过于执着、情绪化、容易走极端',
            risksEn: 'Overly obsessive, emotional, prone to extremes',
            palaces: {
                '命宫': '个性鲜明，适合创意类工作',
                '官禄宫': '事业上容易遇到波折但也能东山再起',
                '夫妻宫': '感情浓烈但波折多'
            },
            palacesEn: {
                '命宫': 'Distinct personality, suited for creative work',
                '官禄宫': 'Career may face twists but can always bounce back',
                '夫妻宫': 'Intense relationships with many ups and downs'
            }
        },
        '天府': {
            prototype: '库星、财星',
            prototypeEn: 'the Treasury Star, the Wealth Star',
            traits: '稳重、保守、善于积累、有福气',
            traitsEn: 'Steady, conservative, good at accumulating, blessed',
            analogy: '家里有粮仓就不慌的踏实人',
            analogyEn: 'A grounded person who stays calm because the granary is full',
            strengths: '稳重可靠、善于理财、有包容力',
            strengthsEn: 'Reliable, good at financial management, tolerant',
            risks: '过于保守、缺乏冒险精神、固执',
            risksEn: 'Too conservative, lacks risk-taking spirit, stubborn',
            palaces: {
                '命宫': '稳重型人格，适合管理类工作',
                '官禄宫': '事业上厚积薄发',
                '财帛宫': '财运稳定，善于积累'
            },
            palacesEn: {
                '命宫': 'Steady personality, suited for management roles',
                '官禄宫': 'Career builds slowly but surely',
                '财帛宫': 'Stable wealth, good at accumulation'
            }
        },
        '太阴': {
            prototype: '月亮星、母性星',
            prototypeEn: 'the Moon Star, the Maternal Star',
            traits: '细腻、感性、内省、有艺术气质',
            traitsEn: 'Delicate, sensitive, introspective, artistic temperament',
            analogy: '在深夜写日记、对情绪很敏感的文艺青年',
            analogyEn: 'An artistic soul who journals late at night, deeply attuned to emotions',
            strengths: '感受力强、有艺术天赋、善于照顾人',
            strengthsEn: 'Strong perception, artistic talent, caring nature',
            risks: '过于敏感、容易焦虑、情绪化',
            risksEn: 'Overly sensitive, prone to anxiety, moody',
            palaces: {
                '命宫': '内向细腻，适合艺术或心理类工作',
                '官禄宫': '适合夜间工作或需要细心的工作',
                '夫妻宫': '伴侣温柔体贴'
            },
            palacesEn: {
                '命宫': 'Introverted and refined, suited for arts or psychology',
                '官禄宫': 'Suited for night work or detail-oriented roles',
                '夫妻宫': 'Gentle and caring partner'
            }
        },
        '贪狼': {
            prototype: '桃花星、欲望星',
            prototypeEn: 'the Romance Star, the Desire Star',
            traits: '多才多艺、欲望强、善变、好奇心重',
            traitsEn: 'Multi-talented, strong desires, changeable, highly curious',
            analogy: '什么都想学、什么都想试、永远好奇的探险家',
            analogyEn: 'An explorer who wants to learn and try everything, eternally curious',
            strengths: '兴趣广泛、学习能力强、有魅力',
            strengthsEn: 'Broad interests, strong learning ability, charismatic',
            risks: '贪多嚼不烂、容易分心、对平淡缺乏耐心',
            risksEn: 'Bites off more than can chew, easily distracted, impatient with routine',
            palaces: {
                '命宫': '多才多艺但需要聚焦，适合创意类',
                '官禄宫': '事业上变化多，适合多元化工作',
                '夫妻宫': '感情丰富，桃花旺但需要定性'
            },
            palacesEn: {
                '命宫': 'Versatile but needs focus, suited for creative fields',
                '官禄宫': 'Career has many changes, suited for diverse work',
                '夫妻宫': 'Rich emotional life, strong romantic luck but needs stability'
            }
        },
        '巨门': {
            prototype: '暗星、口舌星',
            prototypeEn: 'the Dark Star, the Eloquence Star',
            traits: '口才好、好辩、多疑、有研究精神',
            traitsEn: 'Eloquent, argumentative, skeptical, research-oriented',
            analogy: '开会时总能提出尖锐问题的审计员',
            analogyEn: 'An auditor who always asks the sharpest questions in meetings',
            strengths: '口才出众、善于分析、有钻研精神',
            strengthsEn: 'Outstanding eloquence, analytical, diligent researcher',
            risks: '好辩、多疑、容易得罪人',
            risksEn: 'Argumentative, suspicious, easily offends others',
            palaces: {
                '命宫': '适合律师、教师、分析师等需要口才的工作',
                '官禄宫': '事业上靠嘴巴吃饭',
                '夫妻宫': '伴侣口才好，但容易吵架'
            },
            palacesEn: {
                '命宫': 'Suited for law, teaching, analysis — roles requiring eloquence',
                '官禄宫': 'Career relies on communication skills',
                '夫妻宫': 'Partner is eloquent but arguments may be frequent'
            }
        },
        '天相': {
            prototype: '印星、辅佐星',
            prototypeEn: 'the Seal Star, the Advisor Star',
            traits: '稳重、有原则、善于配合、重信誉',
            traitsEn: 'Steady, principled, cooperative, values integrity',
            analogy: '永远可靠、做事有章法的行政总管',
            analogyEn: 'A reliable chief administrator who always follows protocol',
            strengths: '可靠、有原则、善于协调',
            strengthsEn: 'Reliable, principled, excellent at coordination',
            risks: '过于保守、缺乏主见、容易被利用',
            risksEn: 'Too conservative, lacks independent opinions, easily exploited',
            palaces: {
                '命宫': '稳重型人格，适合行政或协调类工作',
                '官禄宫': '适合做副手或协调者',
                '财帛宫': '财运稳定但不够激进'
            },
            palacesEn: {
                '命宫': 'Steady personality, suited for administration or coordination',
                '官禄宫': 'Suited as deputy or coordinator',
                '财帛宫': 'Stable wealth but not aggressive enough'
            }
        },
        '天梁': {
            prototype: '荫星、老人星',
            prototypeEn: 'the Shelter Star, the Elder Star',
            traits: '有长者风范、乐于助人、正直、有原则',
            traitsEn: 'Elderly demeanor, helpful, upright, principled',
            analogy: '朋友圈里永远在给别人出主意的"老大哥"',
            analogyEn: 'The "big brother" in the friend group who always gives advice',
            strengths: '正直、有智慧、善于指导他人',
            strengthsEn: 'Upright, wise, skilled at guiding others',
            risks: '过于说教、固执、不够灵活',
            risksEn: 'Too preachy, stubborn, inflexible',
            palaces: {
                '命宫': '有长者气质，适合教育或咨询类工作',
                '官禄宫': '适合做导师或顾问',
                '福德宫': '精神世界丰富，喜欢思考人生'
            },
            palacesEn: {
                '命宫': 'Elderly demeanor, suited for education or consulting',
                '官禄宫': 'Suited as mentor or advisor',
                '福德宫': 'Rich spiritual world, enjoys contemplating life'
            }
        },
        '七杀': {
            prototype: '将星、孤星',
            prototypeEn: 'the General Star, the Lone Star',
            traits: '果断、独立、有魄力、不怕挑战',
            traitsEn: 'Decisive, independent, bold, unafraid of challenges',
            analogy: '敢一个人上战场的孤胆英雄',
            analogyEn: 'A lone hero who dares to face the battlefield alone',
            strengths: '果断、有魄力、敢于冒险',
            strengthsEn: 'Decisive, bold, willing to take risks',
            risks: '过于冲动、孤独、不善合作',
            risksEn: 'Too impulsive, lonely, poor at collaboration',
            palaces: {
                '命宫': '行动派，适合需要魄力的工作',
                '官禄宫': '事业上能独当一面',
                '夫妻宫': '伴侣个性强势'
            },
            palacesEn: {
                '命宫': 'Action-oriented, suited for roles requiring boldness',
                '官禄宫': 'Can handle career independently',
                '夫妻宫': 'Partner has a strong personality'
            }
        },
        '破军': {
            prototype: '耗星、变革星',
            prototypeEn: 'the Destruction Star, the Revolution Star',
            traits: '破旧立新、不安现状、有破坏力',
            traitsEn: 'Destroys the old to build the new, restless, disruptive',
            analogy: '永远在推翻旧制度、建立新秩序的改革者',
            analogyEn: 'A reformer always overthrowing old systems to establish new order',
            strengths: '敢于变革、有创新精神、不怕打破重来',
            strengthsEn: 'Courageous reformer, innovative, unafraid to start over',
            risks: '过于激进、破坏性强、不稳定',
            risksEn: 'Too radical, destructive, unstable',
            palaces: {
                '命宫': '变革型人格，适合创业或改革类工作',
                '官禄宫': '事业上破旧立新，每次成功都是打碎重来',
                '夫妻宫': '感情波折多，但也能重新开始'
            },
            palacesEn: {
                '命宫': 'Revolutionary personality, suited for entrepreneurship or reform',
                '官禄宫': 'Career succeeds by breaking and rebuilding',
                '夫妻宫': 'Relationships have many twists but can always restart'
            }
        }
    };

    // ==================== 六吉星 ====================
    var AUSPICIOUS_STARS = {
        '左辅': { meaning: '贵人、助力', analogy: '永远在你身边帮忙的好兄弟' },
        '右弼': { meaning: '贵人、助力', analogy: '同上，但更偏向女性贵人' },
        '文昌': { meaning: '文采、学术', analogy: '考试成绩永远很好的人' },
        '文曲': { meaning: '才艺、桃花', analogy: '唱歌好听画画也好的文艺青年' },
        '天魁': { meaning: '贵人、长辈缘', analogy: '永远有长辈罩着你的感觉' },
        '天钺': { meaning: '贵人、异性缘', analogy: '永远有异性帮忙的桃花贵人' }
    };

    // ==================== 六煞星 ====================
    var INAUSPICIOUS_STARS = {
        '擎羊': { meaning: '刑伤、固执', analogy: '那个永远不妥协的硬骨头', positive: '给人魄力和坚持' },
        '陀罗': { meaning: '拖延、纠缠', analogy: '那个永远在拖延的慢性子', positive: '给人耐心和深度' },
        '火星': { meaning: '暴躁、冲动', analogy: '那个一点就着的火药桶', positive: '给人行动力和爆发力' },
        '铃星': { meaning: '暗伤、郁闷', analogy: '那种闷在心里不说的压抑感', positive: '给人内省和敏感' },
        '地空': { meaning: '空想、虚幻', analogy: '那种永远在想"如果"的空想家', positive: '给人想象力和创意' },
        '地劫': { meaning: '劫夺、损失', analogy: '那种总觉得不够的匮乏感', positive: '给人危机意识和动力' }
    };

    // ==================== 四化 ====================
    var FOUR_HUA_MEANING = {
        '化禄': { meaning: '财禄、顺利、享受', meaningEn: 'Prosperity, smoothness, enjoyment', analogy: '天上掉馅饼的好运', direction: '正面，增加资源' },
        '化权': { meaning: '权力、掌控、主导', meaningEn: 'Authority, control, dominance', analogy: '拿到话筒就能主导全场', direction: '中性偏正，增加控制力' },
        '化科': { meaning: '名声、学术、贵人', meaningEn: 'Fame, academics, benefactors', analogy: '被点名表扬的那个优秀学生', direction: '正面，增加名声' },
        '化忌': { meaning: '执着、阻碍、消耗', meaningEn: 'Obsession, obstacles, drain', analogy: '永远在想"为什么是我"的那个心结', direction: '负面，但也代表在意' }
    };

    // 十天干四化对照表
    var FOUR_HUA_TABLE = {
        '甲': { '化禄': '廉贞', '化权': '破军', '化科': '武曲', '化忌': '太阳' },
        '乙': { '化禄': '天机', '化权': '天梁', '化科': '紫微', '化忌': '太阴' },
        '丙': { '化禄': '天同', '化权': '天机', '化科': '文昌', '化忌': '廉贞' },
        '丁': { '化禄': '太阴', '化权': '天同', '化科': '天机', '化忌': '巨门' },
        '戊': { '化禄': '贪狼', '化权': '太阴', '化科': '右弼', '化忌': '天机' },
        '己': { '化禄': '武曲', '化权': '贪狼', '化科': '天梁', '化忌': '文曲' },
        '庚': { '化禄': '太阳', '化权': '武曲', '化科': '太阴', '化忌': '天同' },
        '辛': { '化禄': '巨门', '化权': '太阳', '化科': '文曲', '化忌': '文昌' },
        '壬': { '化禄': '天梁', '化权': '紫微', '化科': '左辅', '化忌': '武曲' },
        '癸': { '化禄': '破军', '化权': '巨门', '化科': '太阴', '化忌': '贪狼' }
    };

    // 四化在宫位的解读
    var FOUR_HUA_PALACE = {
        '化禄': {
            '命宫': '天生有福气，做事相对顺利',
            '财帛宫': '财运好，赚钱能力强',
            '官禄宫': '事业上有贵人，容易得到机会',
            '夫妻宫': '感情甜蜜，伴侣对你好',
            '迁移宫': '出门遇贵人，适合外出发展',
            _en: {
                '命宫': 'Naturally blessed, things tend to go smoothly',
                '财帛宫': 'Good wealth luck, strong earning ability',
                '官禄宫': 'Career mentors appear, opportunities come easily',
                '夫妻宫': 'Sweet relationships, partner treats you well',
                '迁移宫': 'Meet benefactors when traveling, suited for ventures abroad'
            }
        },
        '化权': {
            '命宫': '天生有主导权，喜欢掌控局面',
            '官禄宫': '事业上有话语权，适合做领导',
            '财帛宫': '理财能力强，能守住财富',
            '夫妻宫': '在感情中占主导地位',
            _en: {
                '命宫': 'Natural authority, enjoys taking charge',
                '官禄宫': 'Has influence at work, suited for leadership',
                '财帛宫': 'Strong financial management, can preserve wealth',
                '夫妻宫': 'Takes the lead in relationships'
            }
        },
        '化科': {
            '命宫': '有学术气质，容易出名',
            '官禄宫': '事业上有名声，适合学术类',
            '父母宫': '与父母关系好，受家庭教育影响大',
            '福德宫': '精神世界丰富，有文化修养',
            _en: {
                '命宫': 'Scholarly temperament, easily gains recognition',
                '官禄宫': 'Career reputation, suited for academic pursuits',
                '父母宫': 'Good relationship with parents, strong family education influence',
                '福德宫': 'Rich spiritual world, culturally refined'
            }
        },
        '化忌': {
            '命宫': '对自己不满意，自我要求高但也容易自我否定',
            '官禄宫': '事业上波折多，容易遇到阻碍',
            '财帛宫': '钱财上容易有损耗，理财需谨慎',
            '夫妻宫': '感情中容易纠结，对伴侣要求高',
            '福德宫': '精神层面焦虑多，容易过度思考',
            '疾厄宫': '健康上需要注意，定期体检',
            '迁移宫': '出门容易遇到不顺，外出需谨慎',
            _en: {
                '命宫': 'Dissatisfied with oneself, high standards but prone to self-doubt',
                '官禄宫': 'Career obstacles, may encounter frequent setbacks',
                '财帛宫': 'Financial losses possible, manage money carefully',
                '夫妻宫': 'Prone to overthinking in relationships, high expectations of partner',
                '福德宫': 'Mental anxiety, tendency to overthink',
                '疾厄宫': 'Health requires attention, regular check-ups advised',
                '迁移宫': 'Travel may bring difficulties, exercise caution abroad'
            }
        }
    };

    // ==================== 手相特征库 ====================
    var HAND_FEATURES = {
        '生命线': {
            title: '生命线',
            titleEn: 'Life Line',
            features: {
                '弧大清晰': { desc: '生命力旺盛，精力充沛', descEn: 'Strong vitality, abundant energy', chartMatch: '命宫主星有力，身宫旺', chartMatchEn: 'Soul Palace has strong stars, Body Palace is prosperous' },
                '弧小平直': { desc: '体能有上限，需注意节奏', descEn: 'Limited stamina, need to pace yourself', chartMatch: '命宫空宫或煞星重', chartMatchEn: 'Empty Soul Palace or heavy affliction stars' },
                '岛纹链状': { desc: '体质有阶段性波动', descEn: 'Periodic health fluctuations', chartMatch: '疾厄宫有煞星或化忌', chartMatchEn: 'Health Palace has affliction stars or Hua Ji' },
                '双生命线': { desc: '有强韧的生命力后备', descEn: 'Strong vitality reserve', chartMatch: '命宫有吉星辅佐', chartMatchEn: 'Soul Palace has auspicious supporting stars' }
            }
        },
        '智慧线': {
            title: '智慧线',
            titleEn: 'Wisdom Line',
            features: {
                '平直修长': { desc: '理性务实，逻辑思维强', descEn: 'Rational, pragmatic, strong logical thinking', chartMatch: '命宫有天机/文昌/文曲', chartMatchEn: 'Soul Palace has Tian Ji / Wen Chang / Wen Qu' },
                '下弯至月丘': { desc: '想象力丰富，直觉敏锐', descEn: 'Rich imagination, sharp intuition', chartMatch: '命宫有太阴/贪狼/廉贞', chartMatchEn: 'Soul Palace has Tai Yin / Tan Lang / Lian Zhen' },
                '起点与生命线分离': { desc: '独立自主，敢于冒险', descEn: 'Independent, willing to take risks', chartMatch: '命宫有七杀/破军/武曲', chartMatchEn: 'Soul Palace has Qi Sha / Po Jun / Wu Qu' },
                '短而浅': { desc: '思考方式直接，不喜复杂', descEn: 'Direct thinking, dislikes complexity', chartMatch: '命宫有天同/太阳', chartMatchEn: 'Soul Palace has Tian Tong / Tai Yang' }
            }
        },
        '感情线': {
            title: '感情线',
            titleEn: 'Love Line',
            features: {
                '深长至食指': { desc: '感情热烈理想主义', descEn: 'Passionate, idealistic in love', chartMatch: '夫妻宫有桃花星', chartMatchEn: 'Spouse Palace has romance stars' },
                '平直至中指': { desc: '感情务实，重实际关怀', descEn: 'Pragmatic in love, values practical care', chartMatch: '夫妻宫有天府/天相', chartMatchEn: 'Spouse Palace has Tian Fu / Tian Xiang' },
                '短浅至无名指': { desc: '感情表达内敛', descEn: 'Reserved in expressing love', chartMatch: '夫妻宫有巨门/太阴', chartMatchEn: 'Spouse Palace has Ju Men / Tai Yin' },
                '岛纹锁链': { desc: '感情经历波折多', descEn: 'Many ups and downs in relationships', chartMatch: '夫妻宫有煞星或化忌', chartMatchEn: 'Spouse Palace has affliction stars or Hua Ji' }
            }
        },
        '掌型': {
            title: '掌型',
            titleEn: 'Palm Shape',
            features: {
                '掌长指细': { desc: '水型手，敏感细腻', descEn: 'Water hand, sensitive and refined', chartMatch: '命宫有太阴/天同', chartMatchEn: 'Soul Palace has Tai Yin / Tian Tong' },
                '掌方指短': { desc: '土型手，务实稳重', descEn: 'Earth hand, practical and steady', chartMatch: '命宫有天府/天相', chartMatchEn: 'Soul Palace has Tian Fu / Tian Xiang' },
                '掌宽指粗': { desc: '火型手，行动力强', descEn: 'Fire hand, strong action drive', chartMatch: '命宫有武曲/七杀/破军', chartMatchEn: 'Soul Palace has Wu Qu / Qi Sha / Po Jun' },
                '掌厚指长': { desc: '木型手，有领导力', descEn: 'Wood hand, leadership qualities', chartMatch: '命宫有紫微/太阳/天梁', chartMatchEn: 'Soul Palace has Zi Wei / Tai Yang / Tian Liang' }
            }
        },
        '掌纹': {
            title: '掌纹',
            titleEn: 'Palm Lines',
            features: {
                '纹路深而简洁': { desc: '目标明确，不纠结', descEn: 'Clear goals, decisive', chartMatch: '命宫主星单一且有力', chartMatchEn: 'Soul Palace has a single strong star' },
                '纹路细密杂乱': { desc: '思虑多，顾虑周全', descEn: 'Thoughtful, considers all aspects', chartMatch: '命宫有多个辅星或杂曜', chartMatchEn: 'Soul Palace has multiple supporting stars' },
                '掌心十字纹': { desc: '有玄学天赋或特殊直觉', descEn: 'Metaphysical talent or special intuition', chartMatch: '命宫有地空/地劫或华盖星', chartMatchEn: 'Soul Palace has Di Kong / Di Jie or Hua Gai star' }
            }
        }
    };

    // ==================== 宫位网格布局 ====================
    var BRANCH_GRID_MAP = {
        '巳': { row: 1, col: 1 }, '午': { row: 1, col: 2 }, '未': { row: 1, col: 3 }, '申': { row: 1, col: 4 },
        '辰': { row: 2, col: 1 }, '酉': { row: 2, col: 4 },
        '卯': { row: 3, col: 1 }, '戌': { row: 3, col: 4 },
        '寅': { row: 4, col: 1 }, '丑': { row: 4, col: 2 }, '子': { row: 4, col: 3 }, '亥': { row: 4, col: 4 }
    };

    var BRANCH_ORDER = ['巳', '午', '未', '申', '辰', '酉', '卯', '戌', '寅', '丑', '子', '亥'];

    // ==================== 时辰对照 ====================
    var HOUR_NAMES = {
        0: '早子时 (23:00-00:00)', 1: '丑时 (01:00-03:00)',
        2: '寅时 (03:00-05:00)', 3: '卯时 (05:00-07:00)',
        4: '辰时 (07:00-09:00)', 5: '巳时 (09:00-11:00)',
        6: '午时 (11:00-13:00)', 7: '未时 (13:00-15:00)',
        8: '申时 (15:00-17:00)', 9: '酉时 (17:00-19:00)',
        10: '戌时 (19:00-21:00)', 11: '亥时 (21:00-23:00)',
        12: '晚子时 (23:00-00:00)'
    };

    var HOUR_SHORT = {
        0: '子时', 1: '丑时', 2: '寅时', 3: '卯时', 4: '辰时', 5: '巳时',
        6: '午时', 7: '未时', 8: '申时', 9: '酉时', 10: '戌时', 11: '亥时', 12: '子时'
    };

    return {
        PALACES: PALACES,
        MAJOR_STARS: MAJOR_STARS,
        AUSPICIOUS_STARS: AUSPICIOUS_STARS,
        INAUSPICIOUS_STARS: INAUSPICIOUS_STARS,
        FOUR_HUA_MEANING: FOUR_HUA_MEANING,
        FOUR_HUA_TABLE: FOUR_HUA_TABLE,
        FOUR_HUA_PALACE: FOUR_HUA_PALACE,
        HAND_FEATURES: HAND_FEATURES,
        BRANCH_GRID_MAP: BRANCH_GRID_MAP,
        BRANCH_ORDER: BRANCH_ORDER,
        HOUR_NAMES: HOUR_NAMES,
        HOUR_SHORT: HOUR_SHORT
    };
})();
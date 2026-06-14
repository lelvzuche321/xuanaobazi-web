/**
 * Zi Wei Dou Shu (紫微斗数) - Engine
 * 使用 iztro CDN 库进行精确排盘，生成解读
 * 依赖：iztro CDN (iztro.astro), ZiWeiData
 */
var ZiWeiEngine = (function() {
    'use strict';

    var currentChart = null;
    var currentBirthInfo = null;

    // ==================== 工具函数 ====================

    function normalizeDate(dateStr) {
        // Convert "1990-01-15" to "1990-1-15" (iztro format)
        if (!dateStr) return dateStr;
        var parts = dateStr.split('-');
        if (parts.length === 3) {
            return parseInt(parts[0], 10) + '-' + parseInt(parts[1], 10) + '-' + parseInt(parts[2], 10);
        }
        return dateStr;
    }

    function extractStarName(star) {
        if (!star) return '';
        if (typeof star === 'string') return star;
        if (star.name) return star.name;
        return String(star);
    }

    function extractStarNames(stars) {
        if (!stars || !stars.length) return [];
        var names = [];
        for (var i = 0; i < stars.length; i++) {
            names.push(extractStarName(stars[i]));
        }
        return names;
    }

    // ==================== 排盘计算 ====================

    function calculateChart(birthDate, hourIndex, gender, isLunar) {
        if (typeof iztro === 'undefined' || typeof iztro.astro === 'undefined') {
            throw new Error('iztro library not loaded. Please ensure CDN script is included.');
        }

        // iztro accepts both '男'/'女' and 'male'/'female'
        var iztroGender = (gender === '女' || gender === 'female') ? '女' : '男';
        var normalizedDate = normalizeDate(birthDate);

        var astrolabe;
        if (isLunar) {
            astrolabe = iztro.astro.byLunar(normalizedDate, hourIndex, iztroGender, true, 'zh-CN');
        } else {
            astrolabe = iztro.astro.bySolar(normalizedDate, hourIndex, iztroGender, true, 'zh-CN');
        }

        // Soul palace: identified by earthlyBranchOfSoulPalace property
        var soulBranch = astrolabe.earthlyBranchOfSoulPalace || '';
        var bodyBranch = astrolabe.earthlyBranchOfBodyPalace || '';

        // Collect 12 palaces data
        var palaces = [];
        for (var i = 0; i < astrolabe.palaces.length; i++) {
            var p = astrolabe.palaces[i];
            var majorStars = extractStarNames(p.majorStars);
            var minorStars = extractStarNames(p.minorStars);

            var earthlyBranch = p.earthlyBranch || '';
            var heavenlyStem = p.heavenlyStem || '';
            var palaceName = p.name || '';

            var isSoul = (earthlyBranch === soulBranch);
            var isBody = p.isBodyPalace === true;

            palaces.push({
                index: i,
                name: palaceName,
                heavenlyStem: heavenlyStem,
                earthlyBranch: earthlyBranch,
                majorStars: majorStars,
                minorStars: minorStars,
                isSoul: isSoul,
                isBody: isBody,
                isEmpty: (majorStars.length === 0)
            });
        }

        // Five elements class - already a string like "木三局"
        var fiveElements = astrolabe.fiveElementsClass || '';

        // Four transformations (四化) - derive from year heavenly stem
        var chineseDate = astrolabe.chineseDate || '';
        var yearMutagens = [];
        if (chineseDate) {
            var yearStem = chineseDate.charAt(0); // First character of "庚辰 甲申..."
            var huaTable = ZiWeiData.FOUR_HUA_TABLE;
            if (huaTable[yearStem]) {
                var huaDict = huaTable[yearStem];
                var huaTypes = ['化禄', '化权', '化科', '化忌'];
                for (var h = 0; h < huaTypes.length; h++) {
                    var huaType = huaTypes[h];
                    var starName = huaDict[huaType];
                    if (starName) {
                        // Find which palace this star is in
                        var foundPalace = '';
                        var foundBranch = '';
                        for (var pi = 0; pi < palaces.length; pi++) {
                            var stars = palaces[pi].majorStars.concat(palaces[pi].minorStars);
                            if (stars.indexOf(starName) >= 0) {
                                foundPalace = palaces[pi].name;
                                foundBranch = palaces[pi].earthlyBranch;
                                break;
                            }
                        }
                        yearMutagens.push({
                            star: starName,
                            mutagen: huaType,
                            palace: foundPalace || '未知',
                            branch: foundBranch || ''
                        });
                    }
                }
            }
        }

        var lunarDate = astrolabe.lunarDate || '';
        var zodiac = astrolabe.zodiac || '';
        var soul = astrolabe.soul || '';
        var body = astrolabe.body || '';

        currentChart = {
            palaces: palaces,
            soulBranch: soulBranch,
            bodyBranch: bodyBranch,
            fiveElements: fiveElements,
            yearMutagens: yearMutagens,
            lunarDate: lunarDate,
            chineseDate: chineseDate,
            zodiac: zodiac,
            soul: soul,
            body: body,
            gender: gender,
            hourIndex: hourIndex
        };

        currentBirthInfo = {
            birthDate: birthDate,
            hourIndex: hourIndex,
            gender: gender,
            isLunar: isLunar
        };

        return currentChart;
    }

    // ==================== 解读生成 ====================

    function generateReading(chart, lang) {
        lang = lang || 'zh';
        var reading = {
            cards: []
        };

        var soulPalace = null;
        var bodyPalace = null;
        var careerPalace = null;
        var wealthPalace = null;
        var spousePalace = null;
        var fortunePalace = null;

        for (var i = 0; i < chart.palaces.length; i++) {
            var p = chart.palaces[i];
            if (p.isSoul) soulPalace = p;
            if (p.isBody) bodyPalace = p;
            if (p.name === '官禄') careerPalace = p;
            if (p.name === '财帛') wealthPalace = p;
            if (p.name === '夫妻') spousePalace = p;
            if (p.name === '福德') fortunePalace = p;
        }

        reading.cards.push(generateSoulCard(soulPalace, chart, lang));
        reading.cards.push(generateCareerCard(careerPalace, wealthPalace, chart, lang));
        reading.cards.push(generateSpouseCard(spousePalace, chart, lang));
        reading.cards.push(generateDecadalCard(soulPalace, bodyPalace, chart, lang));
        reading.cards.push(generateFourHuaCard(chart, lang));

        return reading;
    }

    function generateSoulCard(soulPalace, chart, lang) {
        var stars = soulPalace ? soulPalace.majorStars : [];
        var starNames = stars.join('·');
        var isEmpty = soulPalace ? soulPalace.isEmpty : true;
        var isEn = (lang === 'en');

        var body = '';
        var keywords = [];

        if (isEmpty) {
            if (isEn) {
                body = '<strong>Empty Soul Palace</strong> — Your life is not dominated by a single star, ';
                body += 'making you highly adaptable to changing circumstances. An empty palace does not mean nothing — ';
                body += 'it means your core personality is shaped more by environment and experience.';
                body += '<br><br><em>Borrowing the Opposite Palace</em> — Look to the Travel Palace (opposite) to understand your inner nature.';
                keywords = ['Adaptable', 'Flexible', 'Environment-Shaped', 'Versatile'];
            } else {
                body = '<strong>命宫空宫</strong>——这个格局的特点是你的人生不受单一星曜主导，';
                body += '更能灵活适应环境变化。空宫不代表没有，而是意味着你的性格底色更多由环境和经历塑造。';
                body += '<br><br><em>空宫借对宫之力</em>——你需要参照对宫（迁移宫）的星曜来理解自己的性格底层。';
                keywords = ['适应力强', '可塑性高', '环境塑造', '灵活多变'];
            }
        } else if (stars.length === 1) {
            var star = stars[0];
            var starData = ZiWeiData.MAJOR_STARS[star];
            if (starData) {
                if (isEn) {
                    body = '<strong>' + star + ' in Soul Palace (' + (soulPalace ? soulPalace.earthlyBranch : '') + ')</strong> — ' + (starData.traitsEn || starData.traits) + '.<br><br>';
                    body += '<em>Analogy:</em> ' + (starData.analogyEn || starData.analogy) + '.<br><br>';
                    body += '<span class="good">Strengths:</span> ' + (starData.strengthsEn || starData.strengths) + '.<br>';
                    body += '<span class="warn">Caution:</span> ' + (starData.risksEn || starData.risks) + '.';
                    keywords = (starData.traitsEn || starData.traits).split(/[、,,]/).slice(0, 4);
                } else {
                    body = '<strong>' + star + '坐命' + (soulPalace ? soulPalace.earthlyBranch : '') + '宫</strong>——' + starData.traits + '。<br><br>';
                    body += '<em>类比：</em>' + starData.analogy + '。<br><br>';
                    body += '<span class="good">优势：</span>' + starData.strengths + '。<br>';
                    body += '<span class="warn">注意：</span>' + starData.risks + '。';
                    keywords = starData.traits.split('、').slice(0, 4);
                }
            } else {
                if (isEn) {
                    body = '<strong>' + star + ' in Soul Palace</strong> — This star in the ' + (soulPalace ? soulPalace.earthlyBranch : '') + ' palace shapes your unique personality.';
                } else {
                    body = '<strong>' + star + '坐命</strong>——这颗星在' + (soulPalace ? soulPalace.earthlyBranch : '') + '宫，形成了你独特的性格底色。';
                }
                keywords = [star];
            }
        } else {
            if (isEn) {
                body = '<strong>' + starNames + ' in Soul Palace (' + (soulPalace ? soulPalace.earthlyBranch : '') + ')</strong> — The core theme: <em>fusion of dual forces</em>.<br><br>';
                for (var i = 0; i < stars.length; i++) {
                    var sd = ZiWeiData.MAJOR_STARS[stars[i]];
                    if (sd) {
                        body += '<strong>' + stars[i] + '</strong> is ' + (sd.prototypeEn || sd.prototype) + ', ' + (sd.traitsEn || sd.traits) + '.';
                        keywords = keywords.concat((sd.traitsEn || sd.traits).split(/[、,,]/).slice(0, 2));
                    }
                    if (i < stars.length - 1) body += '<br><br>';
                }
                body += '<br><br><em>Two stars layered together create a unique you.</em>';
            } else {
                body = '<strong>' + starNames + '坐命' + (soulPalace ? soulPalace.earthlyBranch : '') + '宫</strong>——这个组合的核心词是：<em>双重力量的融合</em>。<br><br>';
                for (var i = 0; i < stars.length; i++) {
                    var sd = ZiWeiData.MAJOR_STARS[stars[i]];
                    if (sd) {
                        body += '<strong>' + stars[i] + '</strong>是' + sd.prototype + '，' + sd.traits + '。';
                        keywords = keywords.concat(sd.traits.split('、').slice(0, 2));
                    }
                    if (i < stars.length - 1) body += '<br><br>';
                }
                body += '<br><br><em>两颗星叠在一起，造就了一个独特的你。</em>';
            }
        }

        if (chart.bodyBranch && chart.bodyBranch !== chart.soulBranch) {
            if (isEn) {
                body += '<br><br><span class="good">Body Palace in ' + chart.bodyBranch + '</span> — ';
                body += 'The Body Palace represents the direction of your acquired efforts. Your post-natal development focuses on this area.';
            } else {
                body += '<br><br><span class="good">身宫落' + chart.bodyBranch + '宫</span>——';
                body += '身宫代表后天努力的方向，你的后天发展重心在身宫所在的领域。';
            }
        }

        return {
            title: isEn ? 'Innate Nature · Soul Palace' : '命盘底色 · 先天禀赋',
            badge: starNames || (isEn ? 'Empty Palace' : '空宫'),
            full: true,
            highlight: true,
            body: body,
            keywords: keywords.slice(0, 5),
            probabilities: [
                { label: isEn ? 'Calculation Confidence' : '推算置信度', pct: 70 },
                { label: isEn ? 'After Calibration' : '校准后可达', pct: 85 }
            ]
        };
    }

    function generateCareerCard(careerPalace, wealthPalace, chart, lang) {
        var careerStars = careerPalace ? careerPalace.majorStars : [];
        var wealthStars = wealthPalace ? wealthPalace.majorStars : [];
        var isEn = (lang === 'en');
        var body = '';

        if (careerStars.length === 0) {
            if (isEn) {
                body = '<strong>Empty Career Palace</strong> — Your career development is not limited to a single pattern. Look to the Travel Palace (opposite) to understand your professional direction.';
                body += ' This gives you flexibility in career choices, but also requires more exploration to find the right field.';
            } else {
                body = '<strong>官禄宫空宫</strong>——你的事业发展不受单一模式限制，需要借迁移宫之力来理解职业方向。';
                body += '这让你在职业选择上更灵活，但也需要更多探索才能找到真正适合的领域。';
            }
        } else {
            if (isEn) {
                body = '<strong>Career Palace: ' + careerStars.join('·') + '</strong> in ' + (careerPalace ? careerPalace.earthlyBranch : '') + '.<br><br>';
            } else {
                body = '<strong>官禄宫：' + careerStars.join('·') + '</strong>坐守' + (careerPalace ? careerPalace.earthlyBranch : '') + '宫。<br><br>';
            }
            for (var i = 0; i < careerStars.length; i++) {
                var sd = ZiWeiData.MAJOR_STARS[careerStars[i]];
                if (sd) {
                    var careerDesc = '';
                    if (isEn && sd.palacesEn && sd.palacesEn['官禄宫']) {
                        careerDesc = sd.palacesEn['官禄宫'];
                    } else if (sd.palaces['官禄宫']) {
                        careerDesc = sd.palaces['官禄宫'];
                    }
                    if (careerDesc) body += careerDesc + (isEn ? '.<br>' : '。<br>');
                }
            }
        }

        if (isEn) {
            body += '<br><strong>Wealth Palace:</strong> ';
        } else {
            body += '<br><strong>财帛宫：</strong>';
        }
        if (wealthStars.length === 0) {
            if (isEn) {
                body += 'Empty — flexible wealth patterns, not tied to a single income source.';
            } else {
                body += '空宫，财运模式灵活，不固守单一收入来源。';
            }
        } else {
            if (isEn) {
                body += wealthStars.join('·') + ' ruling, ';
            } else {
                body += wealthStars.join('·') + '坐守，';
            }
            for (var j = 0; j < wealthStars.length; j++) {
                var wd = ZiWeiData.MAJOR_STARS[wealthStars[j]];
                if (wd) {
                    var wealthDesc = '';
                    if (isEn && wd.palacesEn && wd.palacesEn['财帛宫']) {
                        wealthDesc = wd.palacesEn['财帛宫'];
                    } else if (wd.palaces['财帛宫']) {
                        wealthDesc = wd.palaces['财帛宫'];
                    }
                    if (wealthDesc) body += wealthDesc + (isEn ? '.' : '。');
                }
            }
        }

        return {
            title: isEn ? 'Career & Wealth · Career + Wealth Palace' : '事业财运 · 官禄+财帛格局',
            badge: (careerStars.length > 0 ? careerStars.join('·') : (isEn ? 'Empty' : '空宫')) + ' | ' + (wealthStars.length > 0 ? wealthStars.join('·') : (isEn ? 'Empty' : '空宫')),
            body: body
        };
    }

    function generateSpouseCard(spousePalace, chart, lang) {
        var spouseStars = spousePalace ? spousePalace.majorStars : [];
        var isEn = (lang === 'en');
        var body = '';

        if (spouseStars.length === 0) {
            if (isEn) {
                body = '<strong>Empty Spouse Palace</strong> — Your relationship patterns are not fixed. You value actual connection over superficial matching.';
                body += '<br><br>Empty palace borrows from the opposite (Career Palace), meaning your relationships and career often influence each other.';
            } else {
                body = '<strong>夫妻宫空宫</strong>——你的感情模式不固定，更看重实际相处而非条件匹配。';
                body += '<br><br>空宫借对宫（官禄宫）之力，意味着你的感情和事业往往互相影响。';
            }
        } else {
            if (isEn) {
                body = '<strong>Spouse Palace: ' + spouseStars.join('·') + '</strong> ruling.<br><br>';
            } else {
                body = '<strong>夫妻宫：' + spouseStars.join('·') + '</strong>坐守。<br><br>';
            }
            for (var i = 0; i < spouseStars.length; i++) {
                var sd = ZiWeiData.MAJOR_STARS[spouseStars[i]];
                if (sd) {
                    if (isEn) {
                        body += '<strong>' + spouseStars[i] + '</strong> — ' + (sd.traitsEn || sd.traits) + '.<br>';
                        if (sd.palacesEn && sd.palacesEn['夫妻宫']) {
                            body += sd.palacesEn['夫妻宫'] + '.<br>';
                        } else if (sd.palaces['夫妻宫']) {
                            body += sd.palaces['夫妻宫'] + '.<br>';
                        }
                    } else {
                        body += '<strong>' + spouseStars[i] + '</strong>——' + sd.traits + '。<br>';
                        if (sd.palaces['夫妻宫']) {
                            body += sd.palaces['夫妻宫'] + '。<br>';
                        }
                    }
                }
            }
        }

        return {
            title: isEn ? 'Love & Marriage · Spouse Palace' : '感情婚姻 · 夫妻宫缘分',
            badge: spouseStars.length > 0 ? spouseStars.join('·') : (isEn ? 'Empty' : '空宫'),
            body: body
        };
    }

    function generateDecadalCard(soulPalace, bodyPalace, chart, lang) {
        var isEn = (lang === 'en');
        var body = '';

        if (isEn) {
            body = '<strong>Current Decade Analysis</strong> — In Zi Wei Dou Shu, each decade cycle shifts, representing the core themes of your life during this period.<br><br>';
        } else {
            body = '<strong>当前大限分析</strong>——紫微斗数中，大限每十年一换，代表了这十年间你人生的核心课题。<br><br>';
        }

        if (soulPalace) {
            if (isEn) {
                body += '<em>Soul Palace foundation:</em> ' + (soulPalace.isEmpty ? 'Empty — great room for change' : soulPalace.majorStars.join('·') + ' ruling') + '.<br>';
            } else {
                body += '<em>命宫基础：</em>' + (soulPalace.isEmpty ? '空宫，变化空间大' : soulPalace.majorStars.join('·') + '坐守') + '。<br>';
            }
        }
        if (bodyPalace) {
            if (isEn) {
                body += '<em>Body Palace hint:</em> Acquired development focuses on the ' + bodyPalace.earthlyBranch + ' palace. This decade centers around this area.<br>';
            } else {
                body += '<em>身宫提示：</em>后天发展重心在' + bodyPalace.earthlyBranch + '宫，这十年重点围绕此领域展开。<br>';
            }
        }

        if (isEn) {
            body += '<br><span class="good">Advice:</span> Pay attention to the themes of the Soul and Body Palaces. These two areas will see significant development this decade.';
        } else {
            body += '<br><span class="good">建议：</span>关注命宫和身宫所在的宫位主题，这十年在这两个领域会有重要发展。';
        }

        var jiMutagens = [];
        if (chart.yearMutagens) {
            for (var i = 0; i < chart.yearMutagens.length; i++) {
                if (chart.yearMutagens[i].mutagen === '化忌') {
                    jiMutagens.push(chart.yearMutagens[i]);
                }
            }
        }
        if (jiMutagens.length > 0) {
            if (isEn) {
                body += '<br><br><span class="warn">Hua Ji Warning:</span>';
            } else {
                body += '<br><br><span class="warn">化忌警示：</span>';
            }
            for (var j = 0; j < jiMutagens.length; j++) {
                body += jiMutagens[j].star + (isEn ? ' Hua Ji in ' : '化忌在') + jiMutagens[j].palace + '——';
                var huaData = ZiWeiData.FOUR_HUA_PALACE['化忌'];
                if (huaData) {
                    var huaDesc = null;
                    if (isEn && huaData._en && huaData._en[jiMutagens[j].palace]) {
                        huaDesc = huaData._en[jiMutagens[j].palace];
                    } else if (huaData[jiMutagens[j].palace]) {
                        huaDesc = huaData[jiMutagens[j].palace];
                    }
                    if (huaDesc) body += huaDesc + (isEn ? '.' : '。');
                }
            }
        }

        return {
            title: isEn ? 'Current Cycle · Core Themes' : '当前大限 · 核心课题',
            badge: isEn ? 'Decade Analysis' : '大限分析',
            full: true,
            teal: true,
            body: body
        };
    }

    function generateFourHuaCard(chart, lang) {
        var isEn = (lang === 'en');
        var body = '';

        if (isEn) {
            body = '<strong>The Four Transformations are the engine of Zi Wei Dou Shu</strong>, representing the flow of energy in your chart.<br><br>';
        } else {
            body = '<strong>四化飞星是紫微斗数的动力系统</strong>，代表了命盘中能量的流动方向。<br><br>';
        }

        if (chart.yearMutagens && chart.yearMutagens.length > 0) {
            var huaGrouped = {};
            for (var i = 0; i < chart.yearMutagens.length; i++) {
                var m = chart.yearMutagens[i];
                if (!huaGrouped[m.mutagen]) huaGrouped[m.mutagen] = [];
                huaGrouped[m.mutagen].push(m);
            }

            var order = ['化禄', '化权', '化科', '化忌'];
            var enOrder = { '化禄': 'Hua Lu (Prosperity)', '化权': 'Hua Quan (Authority)', '化科': 'Hua Ke (Fame)', '化忌': 'Hua Ji (Obstacle)' };
            for (var o = 0; o < order.length; o++) {
                var key = order[o];
                if (huaGrouped[key]) {
                    var huaInfo = ZiWeiData.FOUR_HUA_MEANING[key];
                    var label = isEn ? (enOrder[key] || key) : key;
                    body += '<span class="good">' + label + '</span>' + (isEn ? ' (' + (huaInfo ? (huaInfo.meaningEn || huaInfo.meaning) : '') + '): ' : '（' + (huaInfo ? huaInfo.meaning : '') + '）：');
                    for (var j = 0; j < huaGrouped[key].length; j++) {
                        body += huaGrouped[key][j].star + (isEn ? ' in ' : '在') + huaGrouped[key][j].palace + ' ';
                    }
                    body += '<br>';
                }
            }
        } else {
            if (isEn) {
                body += 'Four Transformations are determined by the year stem. Please check the chart details.';
            } else {
                body += '四化信息由出生年天干决定，请查看命盘详情。';
            }
        }

        return {
            title: isEn ? 'Four Transformations · Energy Flow' : '四化点睛 · 能量流向',
            badge: isEn ? 'Year Transformations' : '生年四化',
            body: body
        };
    }

    // ==================== 手相交叉认证 ====================

    function crossReferenceHand(handFeatures, chart, lang) {
        lang = lang || 'zh';
        var isEn = (lang === 'en');
        var results = [];
        var soulPalace = null;
        var spousePalace = null;

        for (var i = 0; i < chart.palaces.length; i++) {
            if (chart.palaces[i].isSoul) soulPalace = chart.palaces[i];
            if (chart.palaces[i].name === '夫妻') spousePalace = chart.palaces[i];
        }

        var soulStars = soulPalace ? soulPalace.majorStars : [];
        var spouseStars = spousePalace ? spousePalace.majorStars : [];

        for (var category in handFeatures) {
            if (!handFeatures[category]) continue;
            var featureData = ZiWeiData.HAND_FEATURES[category];
            if (!featureData) continue;

            var selectedFeature = featureData.features[handFeatures[category]];
            if (!selectedFeature) continue;

            var match = checkHandChartMatch(category, handFeatures[category], soulStars, spouseStars);
            var item = {
                title: isEn ? (featureData.titleEn || featureData.title) : featureData.title,
                body: isEn
                    ? 'You selected "<strong>' + handFeatures[category] + '</strong>" — ' + (selectedFeature.descEn || selectedFeature.desc) + '.<br>Chart correspondence: ' + (selectedFeature.chartMatchEn || selectedFeature.chartMatch) + '.'
                    : '你选择了"<strong>' + handFeatures[category] + '</strong>"——' + selectedFeature.desc + '。<br>命盘对应：' + selectedFeature.chartMatch + '。',
                status: match ? 'match' : 'conflict',
                statusText: match ? (isEn ? 'Resonates with chart ✓' : '与命盘特征共振 ✓') : (isEn ? 'Surface conflict with chart' : '与命盘有表面矛盾'),
                resolution: match ? null : (isEn ? 'Palm reflects acquired patterns; chart shows innate tendencies. Differences suggest you have reshaped your destiny through effort — a positive sign.' : '手相反映后天行为模式，命盘显示先天倾向。两者差异可能说明你通过后天努力改变了先天趋势，这是积极信号。')
            };
            results.push(item);
        }

        return results;
    }

    function checkHandChartMatch(category, feature, soulStars, spouseStars) {
        var matchMap = {
            '生命线': {
                '弧大清晰': function() { return soulStars.length > 0; },
                '弧小平直': function() { return soulStars.length === 0; }
            },
            '智慧线': {
                '平直修长': function() { return hasAnyStar(soulStars, ['天机', '文昌', '文曲']); },
                '下弯至月丘': function() { return hasAnyStar(soulStars, ['太阴', '贪狼', '廉贞']); },
                '起点与生命线分离': function() { return hasAnyStar(soulStars, ['七杀', '破军', '武曲']); },
                '短而浅': function() { return hasAnyStar(soulStars, ['天同', '太阳']); }
            },
            '感情线': {
                '深长至食指': function() { return hasAnyStar(spouseStars, ['贪狼', '廉贞']); },
                '平直至中指': function() { return hasAnyStar(spouseStars, ['天府', '天相']); },
                '短浅至无名指': function() { return hasAnyStar(spouseStars, ['巨门', '太阴']); },
                '岛纹锁链': function() { return spouseStars.length === 0; }
            },
            '掌型': {
                '掌长指细': function() { return hasAnyStar(soulStars, ['太阴', '天同']); },
                '掌方指短': function() { return hasAnyStar(soulStars, ['天府', '天相']); },
                '掌宽指粗': function() { return hasAnyStar(soulStars, ['武曲', '七杀', '破军']); },
                '掌厚指长': function() { return hasAnyStar(soulStars, ['紫微', '太阳', '天梁']); }
            }
        };

        if (matchMap[category] && matchMap[category][feature]) {
            return matchMap[category][feature]();
        }
        return true;
    }

    function hasAnyStar(stars, targetStars) {
        for (var i = 0; i < targetStars.length; i++) {
            if (stars.indexOf(targetStars[i]) >= 0) return true;
        }
        return false;
    }

    // ==================== 公开接口 ====================

    return {
        calculateChart: calculateChart,
        generateReading: generateReading,
        crossReferenceHand: crossReferenceHand,
        getCurrentChart: function() { return currentChart; },
        getBirthInfo: function() { return currentBirthInfo; }
    };
})();
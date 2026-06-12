/**
 * XuanAo BaZi Engine - Core Four Pillars Calculation
 * 玄奥八字核心引擎 - 四柱八字排盘
 */

const BaziEngine = (function() {
    'use strict';

    // ==================== CONSTANTS ====================

    const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const STEMS_EN = ['Jia', 'Yi', 'Bing', 'Ding', 'Wu', 'Ji', 'Geng', 'Xin', 'Ren', 'Gui'];
    const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    const BRANCHES_EN = ['Zi', 'Chou', 'Yin', 'Mao', 'Chen', 'Si', 'Wu', 'Wei', 'Shen', 'You', 'Xu', 'Hai'];
    const ANIMALS = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
    const ANIMALS_EN = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];

    // Five Elements: 0=木, 1=火, 2=土, 3=金, 4=水
    const STEM_ELEM = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4]; // 甲乙木 丙丁火 戊己土 庚辛金 壬癸水
    const BRANCH_ELEM = [4, 2, 0, 0, 2, 1, 1, 2, 3, 3, 2, 4]; // 子水 丑土 寅木 卯木 辰土 巳火 午火 未土 申金 酉金 戌土 亥水
    const STEM_YY = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1]; // 0=阳, 1=阴
    const BRANCH_YY = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1];

    const ELEM_NAMES = ['木', '火', '土', '金', '水'];
    const ELEM_NAMES_EN = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
    const ELEM_COLORS = ['#4CAF50', '#F44336', '#FF9800', '#FFD700', '#2196F3'];

    // Ten Gods (十神)
    const TEN_GODS = ['比肩', '劫财', '食神', '伤官', '偏财', '正财', '七杀', '正官', '偏印', '正印'];
    const TEN_GODS_EN = ['Peer', 'Rival', 'Output', 'Talent', 'Indirect Wealth', 'Direct Wealth', 'Seven Killings', 'Direct Officer', 'Indirect Resource', 'Direct Resource'];
    const TEN_GODS_SHORT = ['比', '劫', '食', '伤', '偏财', '正财', '杀', '官', '枭', '印'];

    // Na Yin (纳音) - 60 甲子
    const NA_YIN = [
        '海中金','炉中火','大林木','路旁土','剑锋金','山头火',
        '涧下水','城头土','白蜡金','杨柳木','泉中水','屋上土',
        '霹雳火','松柏木','流年水','砂石金','山下火','平地木',
        '壁上土','金箔金','覆灯火','天河水','大驿土','钗钏金',
        '桑柘木','柘榴木','大海水','石榴木','大海水',
        // 30-59
        '海中金','炉中火','大林木','路旁土','剑锋金','山头火',
        '涧下水','城头土','白蜡金','杨柳木','泉中水','屋上土',
        '霹雳火','松柏木','流年水','砂石金','山下火','平地木',
        '壁上土','金箔金','覆灯火','天河水','大驿土','钗钏金',
        '桑柘木','柘榴木','大海水','石榴木','大海水'
    ];
    // Fix Na Yin for 60-cycle
    const NA_YIN_60 = [
        '海中金','炉中火','大林木','路旁土','剑锋金','山头火',
        '涧下水','城头土','白蜡金','杨柳木','泉中水','屋上土',
        '霹雳火','松柏木','长流水','砂中金','山下火','平地木',
        '壁上土','金箔金','覆灯火','天河水','大驿土','钗钏金',
        '桑柘木','大溪水','沙中土','天上火','石榴木','大海水',
        '海中金','炉中火','大林木','路旁土','剑锋金','山头火',
        '涧下水','城头土','白蜡金','杨柳木','泉中水','屋上土',
        '霹雳火','松柏木','长流水','砂中金','山下火','平地木',
        '壁上土','金箔金','覆灯火','天河水','大驿土','钗钏金',
        '桑柘木','大溪水','沙中土','天上火','石榴木','大海水'
    ];

    const NA_YIN_EN_60 = [
        'Sea Gold','Furnace Fire','Forest Wood','Roadside Earth','Sword Gold','Mountain Fire',
        'Valley Water','City Earth','White Wax Gold','Willow Wood','Spring Water','Roof Earth',
        'Thunder Fire','Pine Wood','Flowing Water','Sand Gold','Mountain Fire','Flat Earth',
        'Wall Earth','Gold Foil','Covered Lamp Fire','Heaven River','Post Earth','Hairpin Gold',
        'Mulberry Wood','Great Stream Water','Sand Earth','Heaven Fire','Pomegranate Wood','Sea Water',
        'Sea Gold','Furnace Fire','Forest Wood','Roadside Earth','Sword Gold','Mountain Fire',
        'Valley Water','City Earth','White Wax Gold','Willow Wood','Spring Water','Roof Earth',
        'Thunder Fire','Pine Wood','Flowing Water','Sand Gold','Mountain Fire','Flat Earth',
        'Wall Earth','Gold Foil','Covered Lamp Fire','Heaven River','Post Earth','Hairpin Gold',
        'Mulberry Wood','Great Stream Water','Sand Earth','Heaven Fire','Pomegranate Wood','Sea Water'
    ];

    // Chinese New Year dates (month, day) for 1900-2100
    const CNY_DATES = {
        1900:[1,31],1901:[2,19],1902:[2,8],1903:[1,29],1904:[2,16],1905:[2,4],1906:[1,25],1907:[2,13],1908:[2,2],1909:[1,22],
        1910:[2,10],1911:[1,30],1912:[2,18],1913:[2,6],1914:[1,26],1915:[2,14],1916:[2,3],1917:[1,23],1918:[2,11],1919:[2,1],
        1920:[2,20],1921:[2,8],1922:[1,28],1923:[2,16],1924:[2,5],1925:[1,25],1926:[2,13],1927:[2,2],1928:[1,23],1929:[2,10],
        1930:[1,30],1931:[2,17],1932:[2,6],1933:[1,26],1934:[2,14],1935:[2,4],1936:[1,24],1937:[2,11],1938:[1,31],1939:[2,19],
        1940:[2,8],1941:[1,27],1942:[2,15],1943:[2,5],1944:[1,25],1945:[2,13],1946:[2,2],1947:[1,22],1948:[2,10],1949:[1,29],
        1950:[2,17],1951:[2,6],1952:[1,27],1953:[2,14],1954:[2,3],1955:[1,24],1956:[2,12],1957:[1,31],1958:[2,18],1959:[2,8],
        1960:[1,28],1961:[2,15],1962:[2,5],1963:[1,25],1964:[2,13],1965:[2,2],1966:[1,21],1967:[2,9],1968:[1,30],1969:[2,17],
        1970:[2,6],1971:[1,27],1972:[2,15],1973:[2,3],1974:[1,23],1975:[2,11],1976:[1,31],1977:[2,18],1978:[2,7],1979:[1,28],
        1980:[2,16],1981:[2,5],1982:[1,25],1983:[2,13],1984:[2,2],1985:[2,20],1986:[2,9],1987:[1,29],1988:[2,17],1989:[2,6],
        1990:[1,27],1991:[2,15],1992:[2,4],1993:[1,23],1994:[2,10],1995:[1,31],1996:[2,19],1997:[2,7],1998:[1,28],1999:[2,16],
        2000:[2,5],2001:[1,24],2002:[2,12],2003:[2,1],2004:[1,22],2005:[2,9],2006:[1,29],2007:[2,18],2008:[2,7],2009:[1,26],
        2010:[2,14],2011:[2,3],2012:[1,23],2013:[2,10],2014:[1,31],2015:[2,19],2016:[2,8],2017:[1,28],2018:[2,16],2019:[2,5],
        2020:[1,25],2021:[2,12],2022:[2,1],2023:[1,22],2024:[2,10],2025:[1,29],2026:[2,17],2027:[2,6],2028:[1,26],2029:[2,13],
        2030:[2,3],2031:[1,23],2032:[2,11],2033:[1,31],2034:[2,19],2035:[2,8],2036:[1,28],2037:[2,15],2038:[2,4],2039:[1,24],
        2040:[2,12],2041:[2,1],2042:[1,22],2043:[2,10],2044:[1,30],2045:[2,17],2046:[2,6],2047:[1,26],2048:[2,14],2049:[2,2],
        2050:[1,23],2051:[2,11],2052:[2,1],2053:[2,19],2054:[2,8],2055:[1,28],2056:[2,15],2057:[2,4],2058:[1,24],2059:[2,12],
        2060:[2,2],2061:[1,21],2062:[2,9],2063:[1,29],2064:[2,17],2065:[2,5],2066:[1,26],2067:[2,14],2068:[2,3],2069:[1,23],
        2070:[2,11],2071:[1,31],2072:[2,19],2073:[2,7],2074:[1,27],2075:[2,15],2076:[2,5],2077:[1,24],2078:[2,12],2079:[2,2],
        2080:[1,22],2081:[2,9],2082:[1,29],2083:[2,17],2084:[2,6],2085:[1,26],2086:[2,14],2087:[2,3],2088:[1,24],2089:[2,10],
        2090:[1,30],2091:[2,18],2092:[2,7],2093:[1,27],2094:[2,15],2095:[2,5],2096:[1,25],2097:[2,12],2098:[2,1],2099:[1,21],
        2100:[2,9]
    };

    // Solar term approximate dates (month, day) per year range
    // These are approximate; for exact calculation use astronomical formulas
    // 24 solar terms: 立春 雨水 惊蛰 春分 清明 谷雨 立夏 小满 芒种 夏至 小暑 大暑 立秋 处暑 白露 秋分 寒露 霜降 立冬 小雪 大雪 冬至 小寒 大寒
    const SOLAR_TERMS_BASE = [
        [2,4],[2,19],[3,6],[3,21],[4,5],[4,20],[5,6],[5,21],[6,6],[6,21],[7,7],[7,23],
        [8,7],[8,23],[9,8],[9,23],[10,8],[10,23],[11,7],[11,22],[12,7],[12,22],[1,6],[1,20]
    ];

    // ==================== HELPER FUNCTIONS ====================

    function mod(n, m) {
        return ((n % m) + m) % m;
    }

    function getChineseYear(gregorianYear, month, day) {
        const cny = CNY_DATES[gregorianYear];
        if (!cny) return gregorianYear;
        if (month < cny[0] || (month === cny[0] && day < cny[1])) {
            return gregorianYear - 1;
        }
        return gregorianYear;
    }

    function getYearStemBranch(chineseYear) {
        const idx = mod(chineseYear - 4, 60);
        return { stem: idx % 10, branch: idx % 12, index: idx };
    }

    function getMonthBranch(month, day) {
        // Month branch based on solar term, not Gregorian month
        // 寅=立春(2/4), 卯=惊蛰(3/6), 辰=清明(4/5), 巳=立夏(5/6), 午=芒种(6/6),
        // 未=小暑(7/7), 申=立秋(8/7), 酉=白露(9/8), 戌=寒露(10/8), 亥=立冬(11/7),
        // 子=大雪(12/7), 丑=小寒(1/6)
        const cutoff = [
            { m: 2, d: 4 },  // 立春 -> 寅(2)
            { m: 3, d: 6 },  // 惊蛰 -> 卯(3)
            { m: 4, d: 5 },  // 清明 -> 辰(4)
            { m: 5, d: 6 },  // 立夏 -> 巳(5)
            { m: 6, d: 6 },  // 芒种 -> 午(6)
            { m: 7, d: 7 },  // 小暑 -> 未(7)
            { m: 8, d: 7 },  // 立秋 -> 申(8)
            { m: 9, d: 8 },  // 白露 -> 酉(9)
            { m: 10, d: 8 }, // 寒露 -> 戌(10)
            { m: 11, d: 7 }, // 立冬 -> 亥(11)
            { m: 12, d: 7 }, // 大雪 -> 子(0)
            { m: 1, d: 6 },  // 小寒 -> 丑(1)
        ];

        for (let i = cutoff.length - 1; i >= 0; i--) {
            const c = cutoff[i];
            if (month > c.m || (month === c.m && day >= c.d)) {
                return (i + 2) % 12;
            }
        }
        return 1; // 丑
    }

    function getMonthStem(yearStem, monthBranch) {
        // 年上起月法: 甲己之年丙作首
        const base = [2, 4, 6, 8, 0]; // 丙, 戊, 庚, 壬, 甲
        const baseIdx = Math.floor(yearStem / 2); // 0,1->0; 2,3->1; 4,5->2; 6,7->3; 8,9->4
        return mod(base[baseIdx] + monthBranch, 10);
    }

    function getDayStemBranch(year, month, day) {
        // Reference: Jan 1, 2000 = 戊子 (stem=4, branch=0)
        const refDate = new Date(2000, 0, 1);
        const targetDate = new Date(year, month - 1, day);
        const diffDays = Math.round((targetDate - refDate) / (1000 * 60 * 60 * 24));
        return {
            stem: mod(4 + diffDays, 10),
            branch: mod(0 + diffDays, 12)
        };
    }

    function getHourBranch(hour) {
        // 时辰: 子时 23:00-00:59, 丑时 01:00-02:59, ...
        return Math.floor(mod(hour + 1, 24) / 2);
    }

    function getHourStem(dayStem, hourBranch) {
        // 日上起时法: 甲己还加甲
        const base = [0, 2, 4, 6, 8]; // 甲, 丙, 戊, 庚, 壬
        const baseIdx = Math.floor(dayStem / 2);
        return mod(base[baseIdx] + hourBranch, 10);
    }

    // ==================== TEN GODS (十神) ====================

    function getTenGod(dayStem, otherStem) {
        const de = STEM_ELEM[dayStem];
        const oe = STEM_ELEM[otherStem];
        const dy = STEM_YY[dayStem];
        const oy = STEM_YY[otherStem];

        if (de === oe) {
            return dy === oy ? 0 : 1; // 比肩/劫财
        }
        // 生克关系: 木火土金水 (相生: 0->1->2->3->4->0, 相克: 0->2->4->1->3->0)
        const sheng = [1, 2, 3, 4, 0]; // 我生
        const ke = [2, 3, 4, 0, 1]; // 我克
        const shengWo = [4, 0, 1, 2, 3]; // 生我
        const keWo = [3, 4, 0, 1, 2]; // 克我

        if (oe === sheng[de]) {
            return dy === oy ? 2 : 3; // 食神/伤官
        }
        if (oe === ke[de]) {
            return dy === oy ? 4 : 5; // 偏财/正财
        }
        if (oe === keWo[de]) {
            return dy === oy ? 6 : 7; // 七杀/正官
        }
        if (oe === shengWo[de]) {
            return dy === oy ? 8 : 9; // 偏印/正印
        }
        return 0;
    }

    // ==================== HIDDEN STEMS (藏干) ====================

    const HIDDEN_STEMS = {
        0: [9],           // 子: 癸
        1: [5, 9, 7],     // 丑: 己癸辛
        2: [0, 2, 4],     // 寅: 甲丙戊
        3: [1],           // 卯: 乙
        4: [4, 1, 9],     // 辰: 戊乙癸
        5: [2, 4, 6],     // 巳: 丙戊庚
        6: [3, 5],        // 午: 丁己
        7: [5, 3, 1],     // 未: 己丁乙
        8: [6, 4, 8],     // 申: 庚戊壬
        9: [7],           // 酉: 辛
        10: [4, 7, 3],    // 戌: 戊辛丁
        11: [8, 0]        // 亥: 壬甲
    };

    // ==================== EMPTY BRANCHES (空亡) ====================

    function getEmptyBranches(dayBranch) {
        const xun = Math.floor(dayBranch / 2) * 2;
        const e1 = mod(10 - xun, 12);
        const e2 = mod(11 - xun, 12);
        return [e1, e2];
    }

    // ==================== BIG LUCK (大运) ====================

    function getClosestSolarTerm(year, month, day, isForward) {
        // Approximate solar term calculation
        const terms = [
            { m: 2, d: 4 }, { m: 2, d: 19 }, { m: 3, d: 6 }, { m: 3, d: 21 },
            { m: 4, d: 5 }, { m: 4, d: 20 }, { m: 5, d: 6 }, { m: 5, d: 21 },
            { m: 6, d: 6 }, { m: 6, d: 21 }, { m: 7, d: 7 }, { m: 7, d: 23 },
            { m: 8, d: 7 }, { m: 8, d: 23 }, { m: 9, d: 8 }, { m: 9, d: 23 },
            { m: 10, d: 8 }, { m: 10, d: 23 }, { m: 11, d: 7 }, { m: 11, d: 22 },
            { m: 12, d: 7 }, { m: 12, d: 22 }, { m: 1, d: 6 }, { m: 1, d: 20 }
        ];

        const birthDayNum = month * 100 + day;
        let bestDiff = 999;
        let bestIdx = -1;

        for (let i = 0; i < 24; i++) {
            const t = terms[i];
            let termDayNum = t.m * 100 + t.d;
            if (t.m === 1) termDayNum += 1200; // January of next year

            let diff;
            if (isForward) {
                diff = termDayNum - birthDayNum;
                if (diff <= 0) diff += 365;
            } else {
                diff = birthDayNum - termDayNum;
                if (diff < 0) diff += 365;
            }

            if (diff >= 0 && diff < bestDiff) {
                bestDiff = diff;
                bestIdx = i;
            }
        }

        return bestDiff;
    }

    function calculateBigLuck(yearStem, branch, gender, month, day) {
        // yearStem: 0=甲, 1=乙, ...
        // gender: 'male' or 'female'
        // branch: month branch index
        const isYang = STEM_YY[yearStem] === 0; // 阳年
        let isForward;

        if (gender === 'male') {
            isForward = isYang;
        } else {
            isForward = !isYang;
        }

        const days = getClosestSolarTerm(yearStem >= 0 ? 2024 : 2024, month, day, isForward);
        // Actually, we need the actual year, month, day for proper calculation
        // Using the birth date directly

        const startAge = Math.max(1, Math.ceil(days / 3));

        // Generate big luck pillars
        const monthStemBranch = (branch % 12); // month branch
        const luckPillars = [];
        const startIdx = mod(isForward ? 1 : -1, 60);

        for (let i = 0; i < 8; i++) {
            // Each big luck covers 10 years
            const age = startAge + i * 10;
            const idx = mod(isForward ? (monthStemBranch + i + 1) : (monthStemBranch - i - 1), 60);
            // Actually month stem/branch is a 60-cycle index
            // Let me use the proper calculation
            luckPillars.push({
                age: age,
                stem: 0, // placeholder
                branch: 0, // placeholder
                index: idx
            });
        }

        return { startAge, luckPillars };
    }

    // ==================== NA YIN ====================

    function getNaYin(stemBranch60) {
        return NA_YIN_60[mod(stemBranch60, 60)];
    }

    function getNaYinEn(stemBranch60) {
        return NA_YIN_EN_60[mod(stemBranch60, 60)];
    }

    // ==================== DAY OF YEAR ====================

    function dayOfYear(year, month, day) {
        const d = new Date(year, month - 1, day);
        const start = new Date(year, 0, 0);
        return Math.floor((d - start) / (1000 * 60 * 60 * 24));
    }

    // ==================== MAIN CALCULATION ====================

    /**
     * Core BaZi calculation
     * @param {Object} params - { year, month, day, hour, minute, gender, longitude, useSolarTime }
     * @returns {Object} Full BaZi chart
     */
    function calculate(params) {
        let { year, month, day, hour, minute, gender, longitude, useSolarTime } = params;

        if (!hour && hour !== 0) hour = 12;
        if (!minute) minute = 0;
        if (!gender) gender = 'male';
        if (!longitude) longitude = 120; // Default: Beijing
        if (useSolarTime === undefined) useSolarTime = true;

        // True solar time correction
        if (useSolarTime) {
            const solarOffset = (longitude - 120) * 4; // minutes
            const totalMinutes = hour * 60 + minute + solarOffset;
            hour = mod(totalMinutes / 60, 24);
            minute = mod(totalMinutes, 60);
        }

        // Chinese year
        const chineseYear = getChineseYear(year, month, day);

        // Year Pillar
        const yearSB = getYearStemBranch(chineseYear);
        const yearPillar = {
            stem: yearSB.stem,
            branch: yearSB.branch,
            stemName: STEMS[yearSB.stem],
            branchName: BRANCHES[yearSB.branch],
            stemEn: STEMS_EN[yearSB.stem],
            branchEn: BRANCHES_EN[yearSB.branch],
            index: yearSB.index,
            naYin: getNaYin(yearSB.index),
            naYinEn: getNaYinEn(yearSB.index),
            animal: ANIMALS[yearSB.branch],
            animalEn: ANIMALS_EN[yearSB.branch]
        };

        // Month Pillar
        const monthBranch = getMonthBranch(month, day);
        const monthStem = getMonthStem(yearSB.stem, monthBranch);
        const monthSB60 = mod(monthStem * 12 + monthBranch, 60);
        const monthPillar = {
            stem: monthStem,
            branch: monthBranch,
            stemName: STEMS[monthStem],
            branchName: BRANCHES[monthBranch],
            stemEn: STEMS_EN[monthStem],
            branchEn: BRANCHES_EN[monthBranch],
            index: monthSB60,
            naYin: getNaYin(monthSB60),
            naYinEn: getNaYinEn(monthSB60)
        };

        // Day Pillar
        const daySB = getDayStemBranch(year, month, day);
        const daySB60 = mod(daySB.stem * 12 + daySB.branch, 60);
        const dayPillar = {
            stem: daySB.stem,
            branch: daySB.branch,
            stemName: STEMS[daySB.stem],
            branchName: BRANCHES[daySB.branch],
            stemEn: STEMS_EN[daySB.stem],
            branchEn: BRANCHES_EN[daySB.branch],
            index: daySB60,
            naYin: getNaYin(daySB60),
            naYinEn: getNaYinEn(daySB60),
            element: STEM_ELEM[daySB.stem],
            elementName: ELEM_NAMES[STEM_ELEM[daySB.stem]],
            elementEn: ELEM_NAMES_EN[STEM_ELEM[daySB.stem]]
        };

        // Hour Pillar
        const hourBranch = getHourBranch(hour);
        const hourStem = getHourStem(daySB.stem, hourBranch);
        const hourSB60 = mod(hourStem * 12 + hourBranch, 60);
        const hourPillar = {
            stem: hourStem,
            branch: hourBranch,
            stemName: STEMS[hourStem],
            branchName: BRANCHES[hourBranch],
            stemEn: STEMS_EN[hourStem],
            branchEn: BRANCHES_EN[hourBranch],
            index: hourSB60,
            naYin: getNaYin(hourSB60),
            naYinEn: getNaYinEn(hourSB60)
        };

        // Ten Gods for each pillar
        const pillars = [
            { name: 'year', cn: '年柱', en: 'Year', sb: yearPillar },
            { name: 'month', cn: '月柱', en: 'Month', sb: monthPillar },
            { name: 'day', cn: '日柱', en: 'Day', sb: dayPillar },
            { name: 'hour', cn: '时柱', en: 'Hour', sb: hourPillar }
        ];

        pillars.forEach(p => {
            p.tenGod = getTenGod(daySB.stem, p.sb.stem);
            p.tenGodName = TEN_GODS[p.tenGod];
            p.tenGodEn = TEN_GODS_EN[p.tenGod];
            p.tenGodShort = TEN_GODS_SHORT[p.tenGod];
            p.hiddenStems = HIDDEN_STEMS[p.sb.branch] || [];
            p.hiddenStemsNames = p.hiddenStems.map(s => STEMS[s]);
            p.hiddenStemsEn = p.hiddenStems.map(s => STEMS_EN[s]);
        });

        // Day Master element
        const dayMaster = {
            stem: dayPillar.stem,
            stemName: dayPillar.stemName,
            stemEn: dayPillar.stemEn,
            element: dayPillar.element,
            elementName: dayPillar.elementName,
            elementEn: dayPillar.elementEn,
            isYang: STEM_YY[dayPillar.stem] === 0
        };

        // Empty Branches
        const emptyBranches = getEmptyBranches(daySB.branch);

        // Big Luck (大运)
        const bigLuck = calculateBigLuckWithDate(yearSB.stem, monthSB60, gender, year, month, day, hour);
        const startAge = bigLuck.startAge;

        // Yearly Luck (流年) for age range
        const bigLuckPillars = bigLuck.pillars.map((p, i) => {
            const sb = { stem: p.stem, branch: p.branch };
            const idx = mod(p.stem * 12 + p.branch, 60);
            return {
                age: startAge + i * 10,
                endAge: startAge + (i + 1) * 10 - 1,
                stemName: STEMS[p.stem],
                branchName: BRANCHES[p.branch],
                stemEn: STEMS_EN[p.stem],
                branchEn: BRANCHES_EN[p.branch],
                naYin: getNaYin(idx),
                naYinEn: getNaYinEn(idx),
                tenGod: getTenGod(daySB.stem, p.stem)
            };
        });

        // Current year luck
        const currentYear = new Date().getFullYear();
        const currentYearSB = getYearStemBranch(currentYear);
        const currentYearPillar = {
            stem: currentYearSB.stem,
            branch: currentYearSB.branch,
            stemName: STEMS[currentYearSB.stem],
            branchName: BRANCHES[currentYearSB.branch],
            stemEn: STEMS_EN[currentYearSB.stem],
            branchEn: BRANCHES_EN[currentYearSB.branch],
            animal: ANIMALS[currentYearSB.branch],
            animalEn: ANIMALS_EN[currentYearSB.branch],
            tenGod: getTenGod(daySB.stem, currentYearSB.stem)
        };

        // Five Elements distribution
        const elemCount = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
        pillars.forEach(p => {
            const se = STEM_ELEM[p.sb.stem];
            const be = BRANCH_ELEM[p.sb.branch];
            const names = ['wood', 'fire', 'earth', 'metal', 'water'];
            elemCount[names[se]]++;
            elemCount[names[be]]++;
        });

        // XuKong (空亡) check for each pillar
        pillars.forEach(p => {
            p.isEmpty = emptyBranches.includes(p.sb.branch);
        });

        return {
            chineseYear,
            yearPillar,
            monthPillar,
            dayPillar,
            hourPillar,
            pillars,
            dayMaster,
            emptyBranches,
            emptyBranchesNames: emptyBranches.map(e => BRANCHES[e]),
            emptyBranchesEn: emptyBranches.map(e => BRANCHES_EN[e]),
            startAge,
            bigLuckPillars,
            currentYearPillar,
            elemCount,
            gender,
            longitude,
            useSolarTime
        };
    }

    function calculateBigLuckWithDate(yearStem, monthSB60, gender, year, month, day, hour) {
        const isYang = STEM_YY[yearStem] === 0;
        let isForward = (gender === 'male') ? isYang : !isYang;

        // Calculate days to next/previous solar term
        const birthDayNum = dayOfYear(year, month, day);
        const days = findNearestSolarTermDays(year, month, day, isForward);
        const startAge = Math.max(1, Math.ceil(days / 3));

        // Generate 8 big luck pillars (10 years each)
        const pillars = [];
        const monthSB = monthSB60;

        for (let i = 0; i < 8; i++) {
            const idx = isForward
                ? mod(monthSB + i + 1, 60)
                : mod(monthSB - i - 1, 60);
            pillars.push({
                stem: Math.floor(idx / 12) % 10,
                branch: idx % 12
            });
        }

        return { startAge, pillars };
    }

    function findNearestSolarTermDays(year, month, day, isForward) {
        // Approximate solar term dates
        const terms = [
            { m: 2, d: 4 }, { m: 2, d: 19 }, { m: 3, d: 6 }, { m: 3, d: 21 },
            { m: 4, d: 5 }, { m: 4, d: 20 }, { m: 5, d: 6 }, { m: 5, d: 21 },
            { m: 6, d: 6 }, { m: 6, d: 21 }, { m: 7, d: 7 }, { m: 7, d: 23 },
            { m: 8, d: 7 }, { m: 8, d: 23 }, { m: 9, d: 8 }, { m: 9, d: 23 },
            { m: 10, d: 8 }, { m: 10, d: 23 }, { m: 11, d: 7 }, { m: 11, d: 22 },
            { m: 12, d: 7 }, { m: 12, d: 22 }, { m: 1, d: 6 }, { m: 1, d: 20 }
        ];

        const birthDOY = dayOfYear(year, month, day);
        let bestDiff = 999;

        for (let i = 0; i < 24; i++) {
            const t = terms[i];
            let termYear = year;
            if (t.m === 1 && month > 6) termYear = year + 1;
            if (t.m > 9 && month < 3) termYear = year - 1;
            const termDOY = dayOfYear(termYear, t.m, t.d);

            let diff;
            if (isForward) {
                diff = termDOY - birthDOY;
                if (diff <= 0) diff += 365;
            } else {
                diff = birthDOY - termDOY;
                if (diff < 0) diff += 365;
            }

            if (diff >= 0 && diff < bestDiff) {
                bestDiff = diff;
            }
        }

        return bestDiff;
    }

    // ==================== PUBLIC API ====================

    return {
        calculate,
        STEMS,
        BRANCHES,
        STEMS_EN,
        BRANCHES_EN,
        ANIMALS,
        ANIMALS_EN,
        STEM_ELEM,
        BRANCH_ELEM,
        ELEM_NAMES,
        ELEM_NAMES_EN,
        ELEM_COLORS,
        TEN_GODS,
        TEN_GODS_EN,
        TEN_GODS_SHORT,
        getTenGod,
        getNaYin,
        getNaYinEn,
        getEmptyBranches
    };
})();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BaziEngine;
}
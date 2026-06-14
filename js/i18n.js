/**
 * XuanAo BaZi i18n - Bilingual Translations (Chinese / English)
 * 玄奥八字国际化 - 中英双语翻译
 */
const I18n = (function() {
    'use strict';

    let currentLang = localStorage.getItem('xuanaobazi_lang') || 'zh'; // Default: Chinese, persist preference

    const translations = {
        // Navigation
        nav_home: { zh: '首页', en: 'Home' },
        nav_calculator: { zh: '八字', en: 'BaZi' },
        nav_ziwei: { zh: '紫微', en: 'ZiWei' },
        nav_about: { zh: '关于', en: 'About' },

        // Hero
        hero_subtitle: { zh: '古老智慧 · 现代洞察 — 洞悉您的命运蓝图', en: 'Ancient Wisdom Meets Modern Insight — Unveil the Blueprint of Your Destiny' },
        hero_cta: { zh: '开始测算', en: 'Begin Your Journey' },

        // Calculator
        calc_title: { zh: '八字排盘', en: 'BaZi Calculator' },
        calc_subtitle: { zh: '请输入您的出生信息，揭示命运密码', en: 'Enter your birth details to reveal your destiny chart' },

        // Input
        label_name: { zh: '姓名 (选填)', en: 'Your Name (Optional)' },
        label_gender: { zh: '性别', en: 'Gender' },
        male: { zh: '男', en: 'Male' },
        female: { zh: '女', en: 'Female' },
        label_date: { zh: '出生日期 *', en: 'Birth Date *' },
        label_time: { zh: '出生时间', en: 'Birth Time' },
        label_location: { zh: '出生地点', en: 'Birth Location' },
        auto_detect: { zh: '自动检测', en: 'Auto Detect' },
        solar_time: { zh: '应用真太阳时校正 (推荐)', en: 'Use True Solar Time (Recommended)' },
        btn_calculate: { zh: '揭示命运', en: 'Reveal My Destiny' },

        // Result
        result_title: { zh: '您的四柱八字', en: 'Your Four Pillars' },
        free_preview_title: { zh: '免费预览', en: 'Free Preview' },
        lock_banner_text: { zh: '解锁全部 <strong>13 个维度</strong> 的深度解析，仅需 <strong>8 USDT</strong>', en: 'Unlock all <strong>13 dimensions</strong> of analysis for just <strong>8 USDT</strong>' },
        btn_unlock: { zh: '解锁完整报告', en: 'Unlock Full Report' },
        unlocked_badge: { zh: '✦ 高级报告已解锁 ✦', en: '✦ Premium Report Unlocked ✦' },

        // Payment
        payment_title: { zh: '解锁完整报告', en: 'Unlock Full Report' },
        payment_step1: { zh: '向下方地址发送 <strong>8 USDT</strong> (仅限 Solana 网络)', en: 'Send exactly <strong>8 USDT</strong> to the address below (Solana network only)' },
        payment_step2: { zh: '在下方粘贴您的 <strong>交易哈希 (TxID)</strong>', en: 'Paste your <strong>Transaction Hash (TxID)</strong> below' },
        payment_step3: { zh: '点击验证 — 报告即刻解锁', en: 'Click verify — your report unlocks instantly' },
        btn_verify: { zh: '验证支付', en: 'Verify Payment' },
        payment_network: { zh: 'Solana 网络 (SPL-USDT)', en: 'Solana Network (SPL-USDT)' },
        verify_btn_text: { zh: '验证支付', en: 'Verify Payment' },
        verify_btn_checking: { zh: '验证中...', en: 'Verifying...' },
        payment_note: { zh: '解锁永久有效，绑定当前浏览器。重新打开网站将自动恢复访问权限。', en: 'Your unlock is permanent and tied to this browser. Reopening the site will restore your access.' },
        verify_enter_hash: { zh: '请输入交易哈希', en: 'Please enter your transaction hash' },
        verify_checking: { zh: '验证中...', en: 'Verifying...' },
        verify_pending: { zh: '正在区块链上验证交易，请稍候...', en: 'Verifying transaction on blockchain, please wait...' },
        verify_success: { zh: '支付验证成功！报告已解锁。', en: 'Payment verified! Your report is now unlocked.' },
        verify_error: { zh: '网络错误，请稍后重试', en: 'Network error, please try again later' },
        copy: { zh: '复制', en: 'Copy' },
        qr_hint: { zh: '或扫描二维码支付', en: 'Or scan QR code to pay' },
        share_copy: { zh: '复制结果', en: 'Copy Result' },
        share_twitter: { zh: '转发', en: 'Tweet' },
        share_telegram: { zh: '电报分享', en: 'Telegram' },
        share_facebook: { zh: '脸书分享', en: 'Facebook' },
        share_copied: { zh: '已复制！', en: 'Copied!' },

        // About
        about_title: { zh: '关于玄奥八字', en: 'About XuanAo BaZi' },
        about_subtitle: { zh: '源起与哲学', en: 'Origins and Philosophy' },
        about_p1: {
            zh: '玄奥八字根植于中国古代四柱命理（八字）的玄学传统。这一体系可追溯至一千多年前的宋代，历经世代传承与精炼，是中华文化中最深奥的智慧结晶之一。',
            en: 'XuanAo BaZi is rooted in the ancient Chinese metaphysical tradition of the Four Pillars of Destiny (BaZi). This system dates back over a thousand years to the Song Dynasty and has been refined across generations.'
        },
        about_p2: {
            zh: '我们的引擎解码您出生时刻所蕴含的宇宙密码——天干、地支、五行及其相互作用——为您提供全面的人生路径分析。',
            en: 'Our engine decodes the cosmic patterns encoded in your birth moment — the Heavenly Stems, Earthly Branches, Five Elements, and their interactions — providing you with a comprehensive analysis of your life path.'
        },
        about_p3: {
            zh: '八字不是算命，而是一张地图。它揭示您与生俱来的优势、挑战以及人生旅途的自然节奏，帮助您在命运中找到方向，做出更明智的决策。',
            en: 'BaZi is not fortune-telling; it is a map. It reveals your innate strengths, challenges, and the natural rhythms of your life journey, empowering you to make better decisions in alignment with your destiny.'
        },
        about_disclaimer: {
            zh: '<strong>免责声明：</strong>此命理分析仅供娱乐和参考之用，不能替代专业的财务、医疗或法律建议。请始终运用自己的判断力做出人生决策。',
            en: '<strong>Disclaimer:</strong> This reading is for reference and entertainment purposes only. It is not a substitute for professional financial, medical, or legal advice. Always use your own judgment in making life decisions.'
        },

        // Chart labels
        chart_year: { zh: '年柱', en: 'Year' },
        chart_month: { zh: '月柱', en: 'Month' },
        chart_day: { zh: '日柱', en: 'Day' },
        chart_hour: { zh: '时柱', en: 'Hour' },
        chart_day_master: { zh: '日主', en: 'Day Master' },
        chart_ten_god: { zh: '十神', en: 'Ten God' },
        chart_hidden: { zh: '藏干', en: 'Hidden' },
        chart_na_yin: { zh: '纳音', en: 'Na Yin' },
        chart_empty: { zh: '空亡', en: 'Empty' },
        chart_big_luck: { zh: '大运', en: 'Big Luck' },
        chart_start_age: { zh: '起运年龄', en: 'Starting Age' },
        chart_current_year: { zh: '当前流年', en: 'Current Year' },
        chart_elements: { zh: '五行分布', en: 'Elements' },

        // Report tabs
        tab_personality: { zh: '性格', en: 'Personality' },
        tab_career: { zh: '职业', en: 'Career' },
        tab_wealth: { zh: '财运', en: 'Wealth' },
        tab_official: { zh: '官运', en: 'Authority' },
        tab_marriage: { zh: '婚姻', en: 'Marriage' },
        tab_education: { zh: '学业', en: 'Education' },
        tab_family: { zh: '家业', en: 'Family' },
        tab_parents: { zh: '父母兄弟', en: 'Family Ties' },
        tab_children: { zh: '子女', en: 'Children' },
        tab_achievement: { zh: '功名', en: 'Achievement' },
        tab_health: { zh: '健康', en: 'Health' },
        tab_appearance: { zh: '仪表', en: 'Appearance' },
        tab_special: { zh: '特殊命格', en: 'Special Destiny' },

        // Misc
        loading: { zh: '正在连接宇宙...', en: 'Connecting to the cosmos...' },
        calculating: { zh: '正在推演命盘...', en: 'Calculating your destiny...' },
        no_data: { zh: '尚未输入出生信息', en: 'No birth data entered yet' },
        copy_success: { zh: '已复制！', en: 'Copied!' },
        payment_verified: { zh: '支付验证成功！报告已解锁。', en: 'Payment verified! Report unlocked.' },
        payment_failed: { zh: '支付验证失败，请检查交易哈希。', en: 'Payment verification failed. Please check your TxID.' },
        payment_pending: { zh: '正在验证交易...', en: 'Verifying transaction...' },
        payment_not_found: { zh: '未找到此交易，请确认交易已确认后再试。', en: 'Transaction not found. Please wait for confirmation and try again.' },
        plain_lang: { zh: '白话解读', en: 'Plain Language' },
        original_text: { zh: '古典原文', en: 'Classical Text' },

        // Preview limited
        preview_intro: { zh: '以下为免费预览内容。解锁后可查看全部 13 个维度的完整解析。', en: 'Below is the free preview. Unlock to access all 13 dimensions of complete analysis.' },
        preview_personality: { zh: '您是一个{0}的人，具有{1}的特质。', en: 'You are a person of {0} nature, with qualities of {1}.' },
        preview_career: { zh: '适合从事{0}相关领域的工作。', en: 'Well-suited for careers in {0} related fields.' },
        privacy_notice: { zh: '🔒 您的命理数据仅在您的浏览器中运算，不会上传到任何服务器。关闭页面后数据自动销毁。', en: '🔒 Your data is computed entirely in your browser. Nothing is sent to any server. Data is destroyed when you leave.' },
        privacy_clear: { zh: '清除我的数据', en: 'Clear My Data' },

        // ==================== ZI WEI DOU SHU ====================
        zw_section_title: { zh: '紫微斗数 · Zi Wei Dou Shu', en: 'Zi Wei Dou Shu · Purple Star Astrology' },
        zw_section_subtitle: { zh: 'Purple Star Astrology — 精准排盘 · 十二宫位 · 四化飞星 · 手相互证', en: 'Precise Chart · 12 Palaces · Four Transformations · Palm Reading' },
        zw_intro_p1: { zh: '紫微斗数是"帝王之术"，通过出生年月日时排出十二宫位，分析星曜分布、四化飞星，精准解读命盘底色、事业财运、感情婚姻。', en: 'Zi Wei Dou Shu is the "Emperor\'s Art" — charting the 12 palaces through birth data to analyze star distributions and the Four Transformations, revealing your innate nature, career, wealth, and relationships.' },
        zw_intro_p2: { zh: '本系统基于 <strong>iztro 开源算法</strong>精确排盘，融合<strong>三合派 + 中州派</strong>理论，支持<strong>手相交叉认证</strong>。', en: 'This system uses the <strong>iztro open-source algorithm</strong> for precise chart calculation, integrating <strong>San He + Zhong Zhou</strong> school theories, with <strong>palm reading cross-validation</strong>.' },
        zw_birth_date: { zh: '出生日期', en: 'Birth Date' },
        zw_birth_hour: { zh: '出生时辰', en: 'Birth Hour' },
        zw_gender: { zh: '性别', en: 'Gender' },
        zw_calendar: { zh: '历法', en: 'Calendar' },
        zw_lunar: { zh: '农历', en: 'Lunar' },
        zw_calculate: { zh: '排盘解读', en: 'Calculate Chart' },
        zw_result_title: { zh: '命盘解读 · Chart Reading', en: 'Chart Reading' },
        zw_lock_banner: { zh: '解锁完整命盘解读——<strong>事业财运、感情婚姻、大限分析、手相互证</strong>', en: 'Unlock full chart reading — <strong>Career, Wealth, Marriage, Cycles, Palm Reading</strong>' },
        zw_btn_unlock: { zh: '解锁完整解读 (8 USDT)', en: 'Unlock Full Reading (8 USDT)' },
        zw_unlocked_badge: { zh: '✦ 完整命盘解读已解锁 ✦', en: '✦ Full Chart Reading Unlocked ✦' },
        zw_loading: { zh: '正在排盘计算...', en: 'Calculating your chart...' },
        zw_err_no_date: { zh: '请输入出生日期', en: 'Please enter your birth date' },
        zw_err_iztro: { zh: '排盘失败：iztro 库加载失败，请检查网络连接。', en: 'Chart calculation failed: iztro library not loaded. Please check your network.' },
        zw_err_unknown: { zh: '排盘失败：未知错误', en: 'Chart calculation failed: unknown error' },
        zw_free_preview: { zh: '免费预览解读', en: 'Free Preview' },
        zw_palaces_title: { zh: '十二宫位分布', en: '12 Palaces Distribution' },
        zw_empty_palace: { zh: '空宫', en: 'Empty' },
        zw_soul_label: { zh: '命宫', en: 'Soul' },
        zw_body_label: { zh: '身宫', en: 'Body' },
        zw_center_title: { zh: '紫微斗数', en: 'Zi Wei Dou Shu' },
        zw_locked_divider: { zh: '🔒 以下内容需解锁后查看', en: '🔒 Unlock to view full content below' },
        zw_full_reading: { zh: '完整命盘解读', en: 'Full Chart Reading' },
        zw_hand_section: { zh: '手相互证（可选）', en: 'Palm Reading Cross-Validation (Optional)' },
        zw_cal_title: { zh: '校准问答', en: 'Calibration Q&A' },
        zw_cal_desc: { zh: '当前解读准确度约 65-75%。以下问题的反馈可以把它推到 85% 以上。', en: 'Current accuracy ~65-75%. Your feedback on these questions can push it above 85%.' },
        zw_cal_q1: { zh: '目前从事的行业或工作性质是什么？', en: 'What industry or type of work are you currently in?' },
        zw_cal_q1_hint: { zh: '这有助于校准事业宫位的解读', en: 'Helps calibrate career palace reading' },
        zw_cal_q2: { zh: '感情状态如何？是否已婚或有稳定伴侣？', en: 'What is your relationship status? Married or in a stable relationship?' },
        zw_cal_q2_hint: { zh: '用于校准夫妻宫解读', en: 'Calibrates spouse palace reading' },
        zw_cal_q3: { zh: '近1-2年是否有明显的转折或压力事件？', en: 'Have you experienced major transitions or stress in the last 1-2 years?' },
        zw_cal_q3_hint: { zh: '用于校准流年运势', en: 'Calibrates annual luck reading' },
        zw_cal_q4: { zh: '父母中哪一方对你影响更深？', en: 'Which parent has influenced you more deeply?' },
        zw_cal_q4_hint: { zh: '用于校准父母宫和福德宫', en: 'Calibrates parents & fortune palace' },
        zw_cal_q5: { zh: '目前最困扰你的事情是什么领域？', en: 'What area of life troubles you most right now?' },
        zw_cal_q5_hint: { zh: '帮助定位当前大限的核心课题', en: 'Helps locate the core theme of your current cycle' },
        zw_info_five_elements: { zh: '五行局', en: 'Five Elements' },
        zw_info_soul_palace: { zh: '命宫', en: 'Soul Palace' },
        zw_info_soul_star: { zh: '命主星', en: 'Ruling Star' },
        zw_info_hour: { zh: '时辰', en: 'Hour' },

        // Hand Reading
        hand_intro: { zh: '手相是命盘的实物锚点。选择你的手相特征，或上传手掌照片，系统将自动与命盘进行交叉比对。', en: 'Palm reading serves as a physical anchor for your chart. Select features or upload a palm photo for cross-validation.' },
        hand_note: { zh: '（可选功能，不选择也可以正常解读命盘）', en: '(Optional — you can skip this and still read your chart)' },
        hand_skip: { zh: '跳过', en: 'Skip' },
        hand_upload_btn: { zh: '📷 上传手掌照片', en: '📷 Upload Palm Photo' },
        hand_upload_hint: { zh: '支持 JPG/PNG，拍照或从相册选择', en: 'Supports JPG/PNG, take photo or choose from gallery' },
        hand_crossref_btn: { zh: '开始手相互证', en: 'Start Cross-Validation' },
        hand_no_chart: { zh: '请先生成命盘再进行手相互证。', en: 'Please generate your chart first before cross-validation.' },
        hand_no_feature: { zh: '未选择任何手相特征。手相互证为可选功能，你可以直接查看命盘解读。', en: 'No features selected. Palm reading is optional — you can view your chart reading directly.' },
        hand_match: { zh: '与命盘特征共振 ✓', en: 'Resonates with chart ✓' },
        hand_conflict: { zh: '与命盘有表面矛盾', en: 'Surface conflict with chart' },
        hand_resolution: { zh: '手相反映后天行为模式，命盘显示先天倾向。两者差异可能说明你通过后天努力改变了先天趋势，这是积极信号。', en: 'Palm reflects acquired patterns; chart shows innate tendencies. Differences suggest you have reshaped your destiny through effort — a positive sign.' },
        hand_upload_placeholder: { zh: '点击上传手掌照片，或拖拽到此处', en: 'Click to upload palm photo, or drag here' },
        hand_upload_remove: { zh: '移除图片', en: 'Remove' },
        hand_upload_title: { zh: '手掌照片上传（可选）', en: 'Palm Photo Upload (Optional)' },
    };

    function t(key, params) {
        let text = translations[key] ? (translations[key][currentLang] || key) : key;
        if (params && typeof params === 'object') {
            Object.keys(params).forEach((k, i) => {
                text = text.replace('{' + i + '}', params[k]);
            });
        }
        return text;
    }

    function setLang(lang) {
        currentLang = lang;
        localStorage.setItem('xuanaobazi_lang', lang);
        document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
        updatePage();
    }

    function getLang() {
        return currentLang;
    }

    function toggleLang() {
        setLang(currentLang === 'zh' ? 'en' : 'zh');
    }

    function updatePage() {
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[key]) {
                if (el.tagName === 'INPUT' && el.type === 'submit') {
                    el.value = translations[key][currentLang];
                } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translations[key][currentLang];
                } else {
                    el.innerHTML = translations[key][currentLang];
                }
            }
        });

        // Update language toggle
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            langToggle.classList.toggle('lang-en-active', currentLang === 'en');
        }

        // Trigger custom event for other modules
        document.dispatchEvent(new CustomEvent('langChange', { detail: { lang: currentLang } }));
    }

    return {
        t,
        setLang,
        getLang,
        toggleLang,
        updatePage,
        currentLang
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18n;
}
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
        nav_calculator: { zh: '测算', en: 'Calculator' },
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
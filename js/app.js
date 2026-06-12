/**
 * XuanAo BaZi - Main Application Controller
 * 玄奥八字 - 主应用控制器
 */
(function() {
    'use strict';

    // Current BaZi chart
    var currentChart = null;
    var currentGender = 'male';

    // DOM Events
    var $ = function(sel) { return document.querySelector(sel); };
    var $$ = function(sel) { return document.querySelectorAll(sel); };

    // ==================== PRIVACY: Auto-destroy on leave ====================
    function clearAllData() {
        currentChart = null;
        var fullReport = $('#fullReport');
        if (fullReport) { fullReport.style.display = 'none'; fullReport.innerHTML = ''; }
        var freePreview = $('#freePreview');
        if (freePreview) { freePreview.style.display = 'block'; }
        var reportContent = $('#reportContent');
        if (reportContent) { reportContent.innerHTML = ''; }
        var reportTabs = $('#reportTabs');
        if (reportTabs) { reportTabs.innerHTML = ''; }
        var previewCards = $('#previewCards');
        if (previewCards) { previewCards.innerHTML = ''; }
        var baziChart = $('#baziChart');
        if (baziChart) { baziChart.innerHTML = ''; }
        var chartMeta = $('#chartMeta');
        if (chartMeta) { chartMeta.innerHTML = ''; }
        var shareButtons = $('#shareButtons');
        if (shareButtons) { shareButtons.style.display = 'none'; }
        var privacyNotice = $('#privacyNotice');
        if (privacyNotice) { privacyNotice.style.display = 'none'; }
    }

    // ==================== INITIALIZATION ====================

    function init() {
        // Apply language on initial load
        I18n.updatePage();

        // Loading screen
        setTimeout(function() {
            var loader = $('#loadingScreen');
            if (loader) loader.style.opacity = '0';
            setTimeout(function() { if (loader) loader.style.display = 'none'; }, 500);
        }, 800);

        // Populate location dropdown
        populateLocations();

        // Language toggle
        $('#langToggle').addEventListener('click', function() {
            I18n.toggleLang();
        });

        // Gender buttons
        $$('.gender-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                $$('.gender-btn').forEach(function(b) { b.classList.remove('active'); });
                this.classList.add('active');
                currentGender = this.dataset.gender;
            });
        });

        // Form submission
        $('#baziForm').addEventListener('submit', handleFormSubmit);

        // Unlock button
        $('#btnUnlock').addEventListener('click', function() {
            if (!currentChart) {
                alert(I18n.getLang() === 'zh' ? '请先输入您的生辰八字' : 'Please enter your birth details first');
                return;
            }
            $('#paymentModal').style.display = 'flex';
            document.getElementById('usdtAddress').textContent = PaymentModule.WALLET_ADDRESS;
        });

        // Close payment modal
        $('#closePayment').addEventListener('click', function() {
            $('#paymentModal').style.display = 'none';
        });
        $('#paymentModal').addEventListener('click', function(e) {
            if (e.target === this) this.style.display = 'none';
        });

        // Copy address
        if ($('#btnCopyAddress')) {
            $('#btnCopyAddress').addEventListener('click', function() {
                var addr = PaymentModule.WALLET_ADDRESS;
                navigator.clipboard.writeText(addr).then(function() {
                    var btn = $('#btnCopyAddress');
                    btn.textContent = I18n.t('share_copied');
                    setTimeout(function() { btn.textContent = I18n.t('copy'); }, 2000);
                }).catch(function() {
                    // Fallback for browsers without clipboard API
                    var btn = $('#btnCopyAddress');
                    btn.textContent = I18n.getLang() === 'zh' ? '复制失败' : 'Failed';
                    setTimeout(function() { btn.textContent = I18n.t('copy'); }, 2000);
                });
            });
        }

        // Verify payment - EXPOSE GLOBALLY
        window._onPaymentSuccess = function() {
            if (currentChart) {
                renderFullReport(currentChart);
                var resultSection = $('#sectionResult');
                if (resultSection) resultSection.scrollIntoView({ behavior: 'smooth' });
            }
        };

        // Share buttons
        if ($('#btnShareCopy')) $('#btnShareCopy').addEventListener('click', handleShareCopy);
        if ($('#btnShareTwitter')) $('#btnShareTwitter').addEventListener('click', handleShareTwitter);
        if ($('#btnShareTelegram')) $('#btnShareTelegram').addEventListener('click', handleShareTelegram);

        // Clear data button
        if ($('#btnClearData')) $('#btnClearData').addEventListener('click', function() {
            clearAllData();
            var form = $('#baziForm');
            if (form) form.reset();
            var sectionResult = $('#sectionResult');
            if (sectionResult) sectionResult.style.display = 'none';
            var about = $('#about');
            if (about) about.style.display = 'none';
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            alert(I18n.getLang() === 'zh' ? '您的数据已从浏览器中清除，请放心。' : 'Your data has been cleared from this browser. Your privacy is safe.');
        });

        // Nav links - handle About section visibility
        var navAbout = document.querySelector('.nav-links a[href="#about"]');
        if (navAbout) {
            navAbout.addEventListener('click', function(e) {
                e.preventDefault();
                var about = $('#about');
                if (about) {
                    about.style.display = 'block';
                    about.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        // Hide About section when navigating to Home or Calculator
        var navHome = document.querySelector('.nav-links a[href="#home"]');
        var navCalc = document.querySelector('.nav-links a[href="#calculator"]');
        [navHome, navCalc].forEach(function(link) {
            if (link) {
                link.addEventListener('click', function() {
                    var about = $('#about');
                    if (about) about.style.display = 'none';
                });
            }
        });

        // Nav buttons
        // Language change listener
        document.addEventListener('langChange', function() {
            if (currentChart) {
                renderChart(currentChart);
                renderPreview(currentChart);
                if (PaymentModule.isUnlocked()) {
                    renderFullReport(currentChart);
                }
            }
        });

        // Navbar scroll effect
        window.addEventListener('scroll', function() {
            var navbar = $('#navbar');
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Auto-destroy data on page leave (privacy)
        window.addEventListener('beforeunload', function() {
            clearAllData();
        });
    }

    // ==================== LOCATION DROPDOWN ====================

    function populateLocations() {
        var select = $('#inputLocation');
        if (!select) return;

        var continents = GeoData.CONTINENTS;

        Object.keys(continents).forEach(function(key) {
            var cont = continents[key];
            var group = document.createElement('optgroup');
            group.label = cont.emoji + ' ' + cont.name + ' / ' + cont.cn;

            var cities = GeoData.getCitiesByContinent(key);
            cities.forEach(function(city) {
                var opt = document.createElement('option');
                opt.value = JSON.stringify({ lon: city.lon, lat: city.lat, name: city.city + ', ' + city.country });
                opt.textContent = city.city + ' (' + city.cn + ') - ' + city.country;
                group.appendChild(opt);
            });

            select.appendChild(group);
        });
    }

    // ==================== FORM HANDLER ====================

    function handleFormSubmit(e) {
        e.preventDefault();

        var name = $('#inputName').value;
        var dateVal = $('#inputDate').value;
        var timeVal = $('#inputTime').value;
        var locVal = $('#inputLocation').value;
        var useSolarTime = $('#inputSolarTime').checked;

        if (!dateVal) {
            alert(I18n.getLang() === 'zh' ? '请选择出生日期' : 'Please select a birth date');
            return;
        }

        var parts = dateVal.split('-');
        var gy = parseInt(parts[0], 10);
        var gm = parseInt(parts[1], 10);
        var gd = parseInt(parts[2], 10);
        var hour = 12, minute = 0;
        if (timeVal) {
            var tp = timeVal.split(':');
            hour = parseInt(tp[0], 10);
            minute = parseInt(tp[1], 10);
        }

        var longitude = 120;
        var locationName = '';
        if (locVal) {
            try {
                var loc = JSON.parse(locVal);
                longitude = loc.lon;
                locationName = loc.name;
            } catch (ex) {}
        }

        // Calculate
        var chart = BaziEngine.calculate({
            year: gy,
            month: gm,
            day: gd,
            hour: hour,
            minute: minute,
            gender: currentGender,
            longitude: longitude,
            useSolarTime: useSolarTime
        });

        currentChart = chart;
        chart.name = name;
        chart.birthDate = dateVal;
        chart.birthTime = timeVal;
        chart.locationName = locationName;

        // Show result section
        var resultSection = $('#sectionResult');
        resultSection.style.display = 'block';

        // Render chart
        renderChart(chart);

        // Render free preview
        renderPreview(chart);

        // Check if unlocked
        if (PaymentModule.isUnlocked()) {
            renderFullReport(chart);
            $('#freePreview').style.display = 'none';
        }

        // Show privacy notice
        var privacyNotice = $('#privacyNotice');
        if (privacyNotice) { privacyNotice.style.display = 'block'; }

        // Scroll to result
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }

    // ==================== CHART RENDERING ====================

    function renderChart(chart) {
        var chartEl = $('#baziChart');
        var metaEl = $('#chartMeta');
        if (!chartEl) return;

        var B = BaziEngine;
        var isZh = I18n.getLang() === 'zh';

        var pillars = chart.pillars;
        var colLabels = isZh
            ? ['年柱', '月柱', '日柱', '时柱']
            : ['Year', 'Month', 'Day', 'Hour'];

        var html = '<div class="bazi-table">';

        // Column headers
        html += '<div class="bazi-row bazi-header">';
        html += '<div class="bazi-cell bazi-label"></div>';
        pillars.forEach(function(p, i) {
            html += '<div class="bazi-cell bazi-col-header">' + colLabels[i] + '</div>';
        });
        html += '</div>';

        // Heavenly Stem row
        html += '<div class="bazi-row bazi-stem-row">';
        html += '<div class="bazi-cell bazi-label">' + (isZh ? '天干' : 'Stem') + '</div>';
        pillars.forEach(function(p) {
            var color = B.ELEM_COLORS[B.STEMS.indexOf(p.sb.stemName) % 5] || B.ELEM_COLORS[0];
            html += '<div class="bazi-cell bazi-stem" style="color:' + color + '">';
            html += '<span class="stem-cn">' + p.sb.stemName + '</span>';
            html += '<span class="stem-en">' + p.sb.stemEn + '</span>';
            html += '</div>';
        });
        html += '</div>';

        // Earthly Branch row
        html += '<div class="bazi-row bazi-branch-row">';
        html += '<div class="bazi-cell bazi-label">' + (isZh ? '地支' : 'Branch') + '</div>';
        pillars.forEach(function(p) {
            var be = B.BRANCH_ELEM[p.sb.branch];
            var color = B.ELEM_COLORS[be] || B.ELEM_COLORS[0];
            html += '<div class="bazi-cell bazi-branch" style="color:' + color + '">';
            html += '<span class="branch-cn">' + p.sb.branchName + '</span>';
            html += '<span class="branch-en">' + p.sb.branchEn + '</span>';
            html += '</div>';
        });
        html += '</div>';

        // Ten Gods row
        html += '<div class="bazi-row bazi-tengod-row">';
        html += '<div class="bazi-cell bazi-label">' + (isZh ? '十神' : '10 God') + '</div>';
        pillars.forEach(function(p) {
            html += '<div class="bazi-cell bazi-tengod">';
            html += '<span class="tg-cn">' + p.tenGodName + '</span>';
            html += '<span class="tg-en">' + p.tenGodEn + '</span>';
            html += '</div>';
        });
        html += '</div>';

        // Hidden Stems row
        html += '<div class="bazi-row bazi-hidden-row">';
        html += '<div class="bazi-cell bazi-label">' + (isZh ? '藏干' : 'Hidden') + '</div>';
        pillars.forEach(function(p) {
            html += '<div class="bazi-cell bazi-hidden">';
            html += p.hiddenStemsNames.join(' ');
            html += '</div>';
        });
        html += '</div>';

        // Na Yin row
        html += '<div class="bazi-row bazi-nayin-row">';
        html += '<div class="bazi-cell bazi-label">' + (isZh ? '纳音' : 'Na Yin') + '</div>';
        pillars.forEach(function(p) {
            html += '<div class="bazi-cell bazi-nayin">';
            html += '<span class="ny-cn">' + p.sb.naYin + '</span>';
            html += '<span class="ny-en">' + p.sb.naYinEn + '</span>';
            html += '</div>';
        });
        html += '</div>';

        // XuKong row
        html += '<div class="bazi-row bazi-xukong-row">';
        html += '<div class="bazi-cell bazi-label">' + (isZh ? '空亡' : 'Empty') + '</div>';
        pillars.forEach(function(p) {
            html += '<div class="bazi-cell bazi-xukong">';
            html += p.isEmpty ? '✓' : '-';
            html += '</div>';
        });
        html += '</div>';

        html += '</div>'; // bazi-table

        chartEl.innerHTML = html;

        // Show share bar
        $('#shareButtons').style.display = 'flex';

        // Meta info
        var dm = chart.dayMaster;
        var metaHtml = '';
        metaHtml += '<div class="meta-grid">';
        metaHtml += '<div class="meta-item"><span class="meta-label">' + (isZh ? '日主' : 'Day Master') + '</span><span class="meta-value" style="color:' + B.ELEM_COLORS[dm.element] + '">' + dm.stemName + ' ' + dm.stemEn + ' (' + (isZh ? dm.elementName : dm.elementEn) + ')</span></div>';
        metaHtml += '<div class="meta-item"><span class="meta-label">' + (isZh ? '生肖' : 'Zodiac') + '</span><span class="meta-value">' + (isZh ? chart.yearPillar.animal : chart.yearPillar.animalEn) + '</span></div>';
        metaHtml += '<div class="meta-item"><span class="meta-label">' + (isZh ? '空亡' : 'Void') + '</span><span class="meta-value">' + (isZh ? chart.emptyBranchesNames.join(' ') : chart.emptyBranchesEn.join(' ')) + '</span></div>';
        metaHtml += '<div class="meta-item"><span class="meta-label">' + (isZh ? '起运' : 'Luck Start') + '</span><span class="meta-value">' + chart.startAge + (isZh ? ' 岁' : ' yrs') + '</span></div>';
        metaHtml += '<div class="meta-item"><span class="meta-label">' + (isZh ? '当前流年' : 'Curr Year') + '</span><span class="meta-value">' + chart.currentYearPillar.stemName + chart.currentYearPillar.branchName + ' (' + (isZh ? chart.currentYearPillar.animal : chart.currentYearPillar.animalEn) + ')</span></div>';
        metaHtml += '</div>';

        // Big Luck
        metaHtml += '<div class="big-luck-section">';
        metaHtml += '<h4>' + (isZh ? '大运排盘' : 'Big Luck Cycles') + '</h4>';
        metaHtml += '<div class="big-luck-grid">';
        chart.bigLuckPillars.forEach(function(bl) {
            metaHtml += '<div class="big-luck-item">';
            metaHtml += '<span class="bl-age">' + bl.age + '-' + bl.endAge + '</span>';
            metaHtml += '<span class="bl-pillar">' + bl.stemName + bl.branchName + '</span>';
            metaHtml += '<span class="bl-nayin">' + bl.naYin + '</span>';
            metaHtml += '</div>';
        });
        metaHtml += '</div></div>';

        // Five Elements
        metaHtml += '<div class="elements-section">';
        metaHtml += '<h4>' + (isZh ? '五行分布' : 'Five Elements') + '</h4>';
        metaHtml += '<div class="elements-bars">';
        var maxCount = Math.max.apply(null, Object.values(chart.elemCount));
        if (maxCount === 0) maxCount = 1;
        var elemKeys = ['wood', 'fire', 'earth', 'metal', 'water'];
        var elemNames = isZh ? B.ELEM_NAMES : B.ELEM_NAMES_EN;
        elemKeys.forEach(function(ek, i) {
            var pct = Math.round((chart.elemCount[ek] / maxCount) * 100);
            metaHtml += '<div class="elem-bar-item">';
            metaHtml += '<span class="elem-name" style="color:' + B.ELEM_COLORS[i] + '">' + elemNames[i] + '</span>';
            metaHtml += '<div class="elem-bar-track"><div class="elem-bar-fill" style="width:' + pct + '%;background:' + B.ELEM_COLORS[i] + '"></div></div>';
            metaHtml += '<span class="elem-count">' + chart.elemCount[ek] + '</span>';
            metaHtml += '</div>';
        });
        metaHtml += '</div></div>';

        metaEl.innerHTML = metaHtml;
    }

    // ==================== FREE PREVIEW ====================

    function renderPreview(chart) {
        var previewEl = $('#previewCards');
        if (!previewEl) return;

        var isZh = I18n.getLang() === 'zh';
        var personality = CommentaryEngine.getCommentary(chart, 'personality');
        var career = CommentaryEngine.getCommentary(chart, 'career');

        var html = '';

        // Personality card
        html += '<div class="preview-card">';
        html += '<div class="preview-card-header">';
        html += '<span class="preview-icon">🧠</span>';
        html += '<h4>' + (isZh ? '性格特质' : 'Personality') + '</h4>';
        html += '</div>';
        personality.slice(0, 2).forEach(function(rule) {
            html += '<div class="commentary-item">';
            html += '<p class="commentary-text">' + rule.text + '</p>';
            html += '<p class="commentary-text-en">' + rule.en + '</p>';
            html += '<div class="commentary-plain">';
            html += '<span class="plain-label">' + (isZh ? '白话解读' : 'Plain Language') + '</span>';
            html += '</div>';
            html += '<p class="commentary-plain-cn">' + rule.plain + '</p>';
            html += '<p class="commentary-plain-en">' + rule.plainEn + '</p>';
            html += '</div>';
        });
        html += '</div>';

        // Career card
        html += '<div class="preview-card">';
        html += '<div class="preview-card-header">';
        html += '<span class="preview-icon">💼</span>';
        html += '<h4>' + (isZh ? '职业方向' : 'Career') + '</h4>';
        html += '</div>';
        career.slice(0, 2).forEach(function(rule) {
            html += '<div class="commentary-item">';
            html += '<p class="commentary-text">' + rule.text + '</p>';
            html += '<p class="commentary-text-en">' + rule.en + '</p>';
            html += '<div class="commentary-plain">';
            html += '<span class="plain-label">' + (isZh ? '白话解读' : 'Plain Language') + '</span>';
            html += '</div>';
            html += '<p class="commentary-plain-cn">' + rule.plain + '</p>';
            html += '<p class="commentary-plain-en">' + rule.plainEn + '</p>';
            html += '</div>';
        });
        html += '</div>';

        previewEl.innerHTML = html;
    }

    // ==================== FULL REPORT ====================

    function renderFullReport(chart) {
        var tabsEl = $('#reportTabs');
        var contentEl = $('#reportContent');
        if (!tabsEl || !contentEl) return;

        var isZh = I18n.getLang() === 'zh';

        $('#fullReport').style.display = 'block';
        $('#freePreview').style.display = 'none';

        var categories = CommentaryEngine.getAllCategories();

        // Render tabs
        var tabsHtml = '';
        categories.forEach(function(cat, i) {
            tabsHtml += '<button class="report-tab' + (i === 0 ? ' active' : '') + '" data-cat="' + cat.key + '">';
            tabsHtml += '<span class="tab-icon">' + cat.icon + '</span>';
            tabsHtml += '<span class="tab-name">' + (isZh ? cat.name : cat.nameEn) + '</span>';
            tabsHtml += '</button>';
        });
        tabsEl.innerHTML = tabsHtml;

        // Show first category
        showCategory(chart, categories[0].key);

        // Tab click handlers
        $$('.report-tab').forEach(function(tab) {
            tab.addEventListener('click', function() {
                $$('.report-tab').forEach(function(t) { t.classList.remove('active'); });
                this.classList.add('active');
                showCategory(chart, this.dataset.cat);
            });
        });
    }

    function showCategory(chart, categoryKey) {
        var contentEl = $('#reportContent');
        if (!contentEl) return;

        var isZh = I18n.getLang() === 'zh';
        var rules = CommentaryEngine.getCommentary(chart, categoryKey);

        var html = '';
        rules.forEach(function(rule) {
            html += '<div class="commentary-card">';
            html += '<div class="commentary-original">';
            html += '<span class="original-label">' + (isZh ? '古典原文' : 'Classical Text') + '</span>';
            html += '<p class="commentary-text">' + rule.text + '</p>';
            html += '<p class="commentary-text-en">' + rule.en + '</p>';
            html += '</div>';
            html += '<div class="commentary-plain-section">';
            html += '<span class="plain-label">' + (isZh ? '白话解读' : 'Plain Language') + '</span>';
            html += '<p class="commentary-plain-cn">' + rule.plain + '</p>';
            html += '<p class="commentary-plain-en">' + rule.plainEn + '</p>';
            html += '</div>';
            html += '</div>';
        });

        contentEl.innerHTML = html;
    }

    // ==================== SHARE ====================

    function getSiteUrl() {
        return window.location.origin + window.location.pathname;
    }

    function buildShareText() {
        if (!currentChart) return '';
        var dm = currentChart.dayMaster;
        var siteUrl = getSiteUrl();
        var isZh = I18n.getLang() === 'zh';

        if (isZh) {
            return '🔮 我在「玄奥八字」查看了我的命理分析！\n'
                + '日主：' + dm.stemName + '（' + dm.elementName + '）\n'
                + '生肖：' + currentChart.yearPillar.animal + '\n'
                + '解锁13维度完整报告仅需 8 USDT\n'
                + '关注 @YXL9999 推特 | @LinX1997 电报\n'
                + siteUrl;
        } else {
            return '🔮 I checked my BaZi destiny at XuanAo BaZi!\n'
                + 'Day Master: ' + dm.stemEn + ' (' + dm.elementEn + ')\n'
                + 'Zodiac: ' + currentChart.yearPillar.animalEn + '\n'
                + 'Unlock 13-dimension full report for only 8 USDT\n'
                + 'Follow @YXL9999 Twitter | @LinX1997 Telegram\n'
                + siteUrl;
        }
    }

    function handleShareCopy() {
        var text = buildShareText();
        navigator.clipboard.writeText(text).then(function() {
            var btn = $('#btnShareCopy');
            var orig = btn.innerHTML;
            btn.innerHTML = '✅ ' + I18n.t('share_copied');
            setTimeout(function() { btn.innerHTML = orig; }, 2000);
        }).catch(function() {
            alert('Copy failed. Please try again.');
        });
    }

    function handleShareTwitter() {
        var isZh = I18n.getLang() === 'zh';
        var tweetText = isZh
            ? '🔮 我的八字命理分析揭晓了！来看看你的：' + getSiteUrl() + '\n@YXL9999 #BaZi #四柱八字 #命理'
            : '🔮 My BaZi Destiny revealed! Check yours: ' + getSiteUrl() + '\n@YXL9999 #BaZi #ChineseAstrology';
        var url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(tweetText);
        window.open(url, '_blank');
    }

    function handleShareTelegram() {
        var text = buildShareText();
        var url = 'https://t.me/share/url?url=' + encodeURIComponent(getSiteUrl()) + '&text=' + encodeURIComponent(text.substring(0, 200));
        window.open(url, '_blank');
    }

    document.addEventListener('DOMContentLoaded', init);

})();
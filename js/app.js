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
        // Clear Zi Wei data
        var zwPreview = $('#zwPreview');
        if (zwPreview) { zwPreview.innerHTML = ''; zwPreview.style.display = 'none'; }
        var zwFullReport = $('#zwFullReport');
        if (zwFullReport) { zwFullReport.style.display = 'none'; zwFullReport.innerHTML = ''; }
        var zwLockBanner = $('#zwLockBanner');
        if (zwLockBanner) { zwLockBanner.style.display = 'none'; }
        var zwShareButtons = $('#ziweiShareButtons');
        if (zwShareButtons) { zwShareButtons.style.display = 'none'; }
        var zwPrivacyNotice = $('#zwPrivacyNotice');
        if (zwPrivacyNotice) { zwPrivacyNotice.style.display = 'none'; }
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

        // Gender buttons - only for BaZi form
        $$('#calculator .gender-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                $$('#calculator .gender-btn').forEach(function(b) { b.classList.remove('active'); });
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
            window._paymentContext = 'bazi';
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
        if ($('#btnShareFacebook')) $('#btnShareFacebook').addEventListener('click', handleShareFacebook);

        // Zi Wei share buttons
        if ($('#btnZWShareCopy')) $('#btnZWShareCopy').addEventListener('click', handleZWShareCopy);
        if ($('#btnZWShareTwitter')) $('#btnZWShareTwitter').addEventListener('click', handleZWShareTwitter);
        if ($('#btnZWShareTelegram')) $('#btnZWShareTelegram').addEventListener('click', handleZWShareTelegram);
        if ($('#btnZWShareFacebook')) $('#btnZWShareFacebook').addEventListener('click', handleZWShareFacebook);

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
                    var zwResult = $('#sectionZiweiResult');
                    if (zwResult) zwResult.style.display = 'none';
                });
            }
        });

        // ==================== ZI WEI DOU SHU INTEGRATION ====================

        // Initialize Zi Wei UI
        if (typeof ZiWeiUI !== 'undefined') {
            ZiWeiUI.init();
        }

        // Quick hand upload (in ZiWei form section)
        initQuickHandUpload();

        // Zi Wei unlock button
        var btnZWUnlock = $('#btnZWUnlock');
        if (btnZWUnlock) {
            btnZWUnlock.addEventListener('click', function() {
                var chart = ZiWeiEngine.getCurrentChart();
                if (!chart) {
                    alert(I18n.getLang() === 'zh' ? '请先生成命盘' : 'Please generate your chart first');
                    return;
                }
                $('#paymentModal').style.display = 'flex';
                document.getElementById('usdtAddress').textContent = PaymentModule.WALLET_ADDRESS;
                // Set context to Zi Wei
                window._paymentContext = 'ziwei';
            });
        }

        // Update payment success handler for Zi Wei
        var origPaymentSuccess = window._onPaymentSuccess;
        window._onPaymentSuccess = function() {
            if (window._paymentContext === 'ziwei') {
                if (typeof ZiWeiUI !== 'undefined') {
                    ZiWeiUI.unlock();
                }
                var zwResult = $('#sectionZiweiResult');
                if (zwResult) zwResult.scrollIntoView({ behavior: 'smooth' });
                window._paymentContext = null;
            } else {
                // Original BaZi flow
                if (origPaymentSuccess) origPaymentSuccess();
            }
        };

        // Zi Wei navigation
        var navZiwei = document.querySelector('.nav-links a[href="#ziweidoushu"]');
        if (navZiwei) {
            navZiwei.addEventListener('click', function(e) {
                e.preventDefault();
                var about = $('#about');
                if (about) about.style.display = 'none';
                var ziwei = $('#ziweidoushu');
                if (ziwei) ziwei.scrollIntoView({ behavior: 'smooth' });
            });
        }

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
            // Re-render Zi Wei UI if chart is active
            if (typeof ZiWeiUI !== 'undefined' && typeof ZiWeiUI.reRender === 'function') {
                ZiWeiUI.reRender();
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

    // ==================== QUICK HAND UPLOAD (ZiWei form area) ====================

    // Store uploaded hand image globally for cross-module access
    window._quickHandImage = null;

    function initQuickHandUpload() {
        var uploadArea = $('#quickHandUploadArea');
        var fileInput = $('#quickHandFileInput');
        if (!uploadArea || !fileInput) return;

        uploadArea.addEventListener('click', function() {
            fileInput.click();
        });

        fileInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    window._quickHandImage = e.target.result;
                    var placeholder = $('#quickHandUploadPlaceholder');
                    var preview = $('#quickHandUploadPreview');
                    var img = $('#quickHandUploadImg');
                    if (placeholder) placeholder.style.display = 'none';
                    if (preview) preview.style.display = 'block';
                    if (img) img.src = window._quickHandImage;
                };
                reader.readAsDataURL(this.files[0]);
            }
        });

        var removeBtn = $('#quickHandUploadRemove');
        if (removeBtn) {
            removeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                window._quickHandImage = null;
                var placeholder = $('#quickHandUploadPlaceholder');
                var preview = $('#quickHandUploadPreview');
                if (placeholder) placeholder.style.display = '';
                if (preview) preview.style.display = 'none';
                if (fileInput) fileInput.value = '';
            });
        }
    }

    // ==================== SHARE ====================

    function getSiteUrl() {
        return window.location.origin + window.location.pathname;
    }

    // ---- BaZi share text ----
    function buildBaziShareText() {
        if (!currentChart) return '';
        var dm = currentChart.dayMaster;
        var siteUrl = getSiteUrl();
        var isZh = I18n.getLang() === 'zh';

        if (isZh) {
            return '🔮 我在「玄奥八字」测了命盘！\n'
                + '日主：' + dm.stemName + '（' + dm.elementName + '）\n'
                + '生肖：' + currentChart.yearPillar.animal + '\n'
                + '━━━━━━━━━━━━━━━━\n'
                + '💰 测命理还能赚2USDT！\n'
                + '每推荐1人消费，你得2U返佣\n'
                + '分享给朋友一起赚 ⬇\n'
                + '━━━━━━━━━━━━━━━━\n'
                + siteUrl;
        } else {
            return '🔮 My BaZi reading at XuanAo BaZi!\n'
                + 'Day Master: ' + dm.stemEn + ' (' + dm.elementEn + ')\n'
                + 'Zodiac: ' + currentChart.yearPillar.animalEn + '\n'
                + '━━━━━━━━━━━━━━━━\n'
                + '💰 Earn 2 USDT per referral!\n'
                + 'Share with friends & get paid\n'
                + 'Get your destiny blueprint ⬇\n'
                + '━━━━━━━━━━━━━━━━\n'
                + siteUrl;
        }
    }

    function buildBaziTweetText() {
        if (!currentChart) return getSiteUrl();
        var dm = currentChart.dayMaster;
        var siteUrl = getSiteUrl();
        var isZh = I18n.getLang() === 'zh';

        if (isZh) {
            return '🔮 我刚测了八字命盘！日主' + dm.stemName + '（' + dm.elementName + '），生肖' + currentChart.yearPillar.animal
                + '。测命理还能赚2U！来测你的命盘，分享给朋友一起赚💰\n'
                + siteUrl + '\n#八字 #命理';
        } else {
            return '🔮 My BaZi: ' + dm.stemEn + ' (' + dm.elementEn + '), Zodiac: ' + currentChart.yearPillar.animalEn
                + '. Earn 2 USDT per referral! Get your destiny blueprint ⬇\n'
                + siteUrl + '\n#BaZi #ChineseAstrology';
        }
    }

    // ---- ZiWei share text ----
    function buildZiweiShareText() {
        var chart = (typeof ZiWeiEngine !== 'undefined') ? ZiWeiEngine.getCurrentChart() : null;
        if (!chart) return '';
        var siteUrl = getSiteUrl();
        var isZh = I18n.getLang() === 'zh';
        var sp = chart.soulPalace || {};
        var bp = chart.bodyPalace || {};
        var spStars = (sp.majorStars && sp.majorStars.length > 0) ? sp.majorStars.slice(0, 2).join('+') : '—';
        var spName = sp.name || '命宫';
        var bpName = bp.name || '身宫';

        if (isZh) {
            return '🔮 我刚测了紫微斗数命盘！\n'
                + spName + '主星：' + spStars + '\n'
                + '身宫：' + bpName + '\n'
                + '━━━━━━━━━━━━━━━━\n'
                + '💰 测命理还能赚2USDT！\n'
                + '每推荐1人消费，你得2U返佣\n'
                + '分享给朋友一起赚 ⬇\n'
                + '━━━━━━━━━━━━━━━━\n'
                + siteUrl;
        } else {
            return '🔮 My ZiWei DouShu chart revealed!\n'
                + spName + ' Stars: ' + spStars + '\n'
                + 'Body Palace: ' + bpName + '\n'
                + '━━━━━━━━━━━━━━━━\n'
                + '💰 Earn 2 USDT per referral!\n'
                + 'Share with friends & get paid\n'
                + 'Unlock your destiny blueprint ⬇\n'
                + '━━━━━━━━━━━━━━━━\n'
                + siteUrl;
        }
    }

    function buildZiweiTweetText() {
        var chart = (typeof ZiWeiEngine !== 'undefined') ? ZiWeiEngine.getCurrentChart() : null;
        if (!chart) return getSiteUrl();
        var siteUrl = getSiteUrl();
        var isZh = I18n.getLang() === 'zh';
        var sp = chart.soulPalace || {};
        var spStars = (sp.majorStars && sp.majorStars.length > 0) ? sp.majorStars.slice(0, 2).join('+') : '—';
        var spName = sp.name || '命宫';

        if (isZh) {
            return '🔮 我的紫微斗数命盘：' + spName + '坐' + spStars
                + '。测命理还能赚2U！来测你的命盘，分享给朋友一起赚💰\n'
                + siteUrl + '\n#紫微斗数 #命理';
        } else {
            return '🔮 My ZiWei chart: ' + spName + ' has ' + spStars
                + '. Earn 2 USDT per referral! Get your reading ⬇\n'
                + siteUrl + '\n#ZiWeiDouShu #ChineseAstrology';
        }
    }

    // ---- generic helpers ----
    function getCurrentShareText() {
        // auto-detect which module is active
        var zwSection = $('#ziweidoushu');
        if (zwSection && window.getComputedStyle(zwSection).display !== 'none') {
            var zwChart = (typeof ZiWeiEngine !== 'undefined') ? ZiWeiEngine.getCurrentChart() : null;
            if (zwChart) return buildZiweiShareText();
        }
        if (currentChart) return buildBaziShareText();
        return getSiteUrl();
    }

    function getCurrentTweetText() {
        var zwSection = $('#ziweidoushu');
        if (zwSection && window.getComputedStyle(zwSection).display !== 'none') {
            var zwChart = (typeof ZiWeiEngine !== 'undefined') ? ZiWeiEngine.getCurrentChart() : null;
            if (zwChart) return buildZiweiTweetText();
        }
        if (currentChart) return buildBaziTweetText();
        return getSiteUrl();
    }

    function flashButton(btnId, icon, text) {
        var btn = $(btnId);
        if (!btn) return;
        var orig = btn.innerHTML;
        btn.innerHTML = icon + ' ' + text;
        btn.style.pointerEvents = 'none';
        setTimeout(function() {
            btn.innerHTML = orig;
            btn.style.pointerEvents = '';
        }, 2000);
    }

    // ---- BaZi handlers ----
    function handleShareCopy() {
        var text = buildBaziShareText();
        navigator.clipboard.writeText(text).then(function() {
            flashButton('#btnShareCopy', '✅', I18n.t('share_copied'));
        }).catch(function() {
            alert('Copy failed. Please try again.');
        });
    }

    function handleShareTwitter() {
        window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(buildBaziTweetText()), '_blank');
    }

    function handleShareTelegram() {
        var text = buildBaziShareText().replace(/\n/g, '%0A');
        window.open('https://t.me/share/url?url=' + encodeURIComponent(getSiteUrl()) + '&text=' + text, '_blank');
    }

    function handleShareFacebook() {
        window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(getSiteUrl()) + '&quote=' + encodeURIComponent(buildBaziShareText()), '_blank');
    }

    // ---- ZiWei handlers ----
    function handleZWShareCopy() {
        var text = buildZiweiShareText();
        if (!text) return;
        navigator.clipboard.writeText(text).then(function() {
            flashButton('#btnZWShareCopy', '✅', I18n.t('share_copied'));
        }).catch(function() {
            alert('Copy failed. Please try again.');
        });
    }

    function handleZWShareTwitter() {
        window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(buildZiweiTweetText()), '_blank');
    }

    function handleZWShareTelegram() {
        var text = buildZiweiShareText().replace(/\n/g, '%0A');
        if (!text) return;
        window.open('https://t.me/share/url?url=' + encodeURIComponent(getSiteUrl()) + '&text=' + text, '_blank');
    }

    function handleZWShareFacebook() {
        var text = buildZiweiShareText();
        if (!text) return;
        window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(getSiteUrl()) + '&quote=' + encodeURIComponent(text), '_blank');
    }

    document.addEventListener('DOMContentLoaded', init);

})();
/**
 * Zi Wei Dou Shu (紫微斗数) - UI Module
 * 命盘可视化渲染、解读卡片展示、双语支持
 */
var ZiWeiUI = (function() {
    'use strict';

    var currentReading = null;
    var currentChart = null;
    var isUnlocked = false;
    var _ = function(k) { return (typeof I18n !== 'undefined' && I18n.t) ? I18n.t(k) : k; };
    var getLang = function() { return (typeof I18n !== 'undefined') ? I18n.getLang() : 'zh'; };

    function init() {
        console.log('ZiWeiUI: init called');
        var form = document.getElementById('ziweiForm');
        if (form) {
            form.addEventListener('submit', handleFormSubmit);
            console.log('ZiWeiUI: form submit listener attached');
        } else {
            console.warn('ZiWeiUI: #ziweiForm not found');
        }

        // Gender buttons - use correct scope
        var genderBtns = document.querySelectorAll('#ziweidoushu .gender-btn');
        genderBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                var allBtns = document.querySelectorAll('#ziweidoushu .gender-btn');
                allBtns.forEach(function(b) { b.classList.remove('active'); });
                this.classList.add('active');
            });
        });
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        console.log('ZiWei form submitted');

        var birthDate = document.getElementById('zwBirthDate').value;
        var birthHour = parseInt(document.getElementById('zwBirthHour').value) || 0;
        var genderEl = document.querySelector('#ziweidoushu .gender-btn.active');
        var gender = genderEl ? genderEl.dataset.gender : '男';
        var isLunar = document.getElementById('zwIsLunar') ? document.getElementById('zwIsLunar').checked : false;

        if (!birthDate) {
            alert(_('zw_err_no_date'));
            return;
        }

        var preview = document.getElementById('zwPreview');
        if (preview) {
            preview.innerHTML = '<div class="loading-spinner"><span class="spinner"></span> ' + _('zw_loading') + '</div>';
            preview.style.display = 'block';
        }

        var sectionResult = document.getElementById('sectionZiweiResult');
        if (sectionResult) sectionResult.style.display = 'block';

        // Hide full report and lock banner initially
        var fullReport = document.getElementById('zwFullReport');
        if (fullReport) fullReport.style.display = 'none';
        var lockBanner = document.getElementById('zwLockBanner');
        if (lockBanner) lockBanner.style.display = 'none';

        try {
            if (typeof iztro === 'undefined' || typeof iztro.astro === 'undefined') {
                throw new Error('iztro library not loaded');
            }
            if (typeof ZiWeiEngine === 'undefined') {
                throw new Error('ZiWeiEngine not loaded');
            }

            currentChart = ZiWeiEngine.calculateChart(birthDate, birthHour, gender, isLunar);
            currentReading = ZiWeiEngine.generateReading(currentChart, getLang());

            renderFreePreview(currentChart, currentReading);

        } catch (err) {
            console.error('ZiWei calculation error:', err);
            if (preview) {
                preview.innerHTML = '<div class="error-message">' + _('zw_err_iztro') + '<br><small>' + (err.message || '') + '</small></div>';
            }
        }
    }

    function renderFreePreview(chart, reading) {
        var preview = document.getElementById('zwPreview');
        if (!preview) return;

        var html = '';
        html += buildInfoBar(chart);
        html += buildPalaceGrid(chart);
        html += '<div class="zw-section-title">' + _('zw_free_preview') + '</div>';
        html += '<div class="zw-reading-grid">';
        if (reading.cards.length > 0) html += buildReadingCardHTML(reading.cards[0]);
        if (reading.cards.length > 4) html += buildReadingCardHTML(reading.cards[4]);
        html += '</div>';

        // Hand reading section (visible in free preview)
        html += '<div class="zw-section-title">' + _('zw_hand_section') + '</div>';
        html += '<div id="handReadingContainer"></div>';

        html += buildLockedPreview(reading);

        preview.innerHTML = html;
        preview.style.display = 'block';

        var sectionResult = document.getElementById('sectionZiweiResult');
        if (sectionResult) sectionResult.style.display = 'block';

        var lockBanner = document.getElementById('zwLockBanner');
        if (lockBanner) lockBanner.style.display = 'block';

        var privacyNotice = document.getElementById('zwPrivacyNotice');
        if (privacyNotice) privacyNotice.style.display = 'block';

        var shareButtons = document.getElementById('ziweiShareButtons');
        if (shareButtons) shareButtons.style.display = 'flex';

        // Initialize hand reading module in free preview
        if (typeof HandReading !== 'undefined') {
            HandReading.init('handReadingContainer', window._quickHandImage || null);
        }

        if (sectionResult) sectionResult.scrollIntoView({ behavior: 'smooth' });
    }

    function buildInfoBar(chart) {
        var soulStars = '';
        for (var i = 0; i < chart.palaces.length; i++) {
            if (chart.palaces[i].isSoul) {
                soulStars = chart.palaces[i].majorStars.join('·') || _('zw_empty_palace');
                break;
            }
        }
        var hourName = ZiWeiData.HOUR_SHORT[chart.hourIndex] || '';

        return '<div class="zw-info-bar">' +
            '<div class="zw-info-cell"><div class="zw-info-label">' + _('zw_info_five_elements') + '</div><div class="zw-info-value">' + (chart.fiveElements || '') + '</div></div>' +
            '<div class="zw-info-cell"><div class="zw-info-label">' + _('zw_info_soul_palace') + '</div><div class="zw-info-value">' + chart.soulBranch + '</div></div>' +
            '<div class="zw-info-cell"><div class="zw-info-label">' + _('zw_info_soul_star') + '</div><div class="zw-info-value">' + soulStars + '</div></div>' +
            '<div class="zw-info-cell"><div class="zw-info-label">' + _('zw_info_hour') + '</div><div class="zw-info-value">' + hourName + '</div></div>' +
        '</div>';
    }

    function buildPalaceGrid(chart) {
        var branchMap = {};
        for (var i = 0; i < chart.palaces.length; i++) {
            branchMap[chart.palaces[i].earthlyBranch] = chart.palaces[i];
        }

        var html = '<div class="zw-section-title">' + _('zw_palaces_title') + '</div>';
        html += '<div class="zw-palace-grid">';

        var order = ZiWeiData.BRANCH_ORDER;
        var grid = ZiWeiData.BRANCH_GRID_MAP;

        for (var o = 0; o < order.length; o++) {
            var branch = order[o];
            var palace = branchMap[branch];
            var pos = grid[branch];
            if (!pos) continue;

            var style = 'grid-row:' + pos.row + ';grid-column:' + pos.col + ';';
            var classes = 'zw-palace';
            if (palace && palace.isSoul) classes += ' zw-active';
            if (palace && palace.isBody) classes += ' zw-body';

            var starsHtml = '';
            if (palace) {
                if (palace.isEmpty) {
                    starsHtml = '<span class="zw-star zw-empty">' + _('zw_empty_palace') + '</span>';
                } else {
                    for (var s = 0; s < palace.majorStars.length; s++) {
                        starsHtml += '<span class="zw-star zw-main">' + palace.majorStars[s] + '</span>';
                    }
                    for (var m = 0; m < palace.minorStars.length; m++) {
                        starsHtml += '<span class="zw-star">' + palace.minorStars[m] + '</span>';
                    }
                }
            }

            html += '<div class="' + classes + '" style="' + style + '">' +
                '<div class="zw-palace-name">' + (palace ? palace.name : '') + '</div>' +
                '<div class="zw-palace-branch">' + branch + '</div>' +
                '<div class="zw-palace-stars">' + starsHtml + '</div>';

            if (palace && palace.isSoul) {
                html += '<div class="zw-palace-badge badge-soul">' + _('zw_soul_label') + '</div>';
            }
            if (palace && palace.isBody) {
                html += '<div class="zw-palace-badge badge-body">' + _('zw_body_label') + '</div>';
            }

            html += '</div>';
        }

        html += '<div class="zw-palace-center" style="grid-row:2/4;grid-column:2/4;">' +
            '<div class="zw-center-bagua">☯</div>' +
            '<div class="zw-center-title">' + _('zw_center_title') + '</div>' +
            '<div class="zw-center-info">' +
                (chart.chineseDate || '') + '<br>' +
                (chart.lunarDate || '') + '<br>' +
                _('zw_info_five_elements') + '：' + (chart.fiveElements || '') +
            '</div>';

        if (chart.yearMutagens && chart.yearMutagens.length > 0) {
            html += '<div class="zw-four-hua-bar">';
            for (var h = 0; h < chart.yearMutagens.length; h++) {
                var m = chart.yearMutagens[h];
                var huaClass = '';
                if (m.mutagen === '化禄') huaClass = 'hua-lu';
                else if (m.mutagen === '化权') huaClass = 'hua-quan';
                else if (m.mutagen === '化科') huaClass = 'hua-ke';
                else if (m.mutagen === '化忌') huaClass = 'hua-ji';
                html += '<span class="zw-hua-tag ' + huaClass + '">' + m.star + m.mutagen + '</span>';
            }
            html += '</div>';
        }

        html += '</div></div>';
        return html;
    }

    function buildReadingCardHTML(card) {
        var classes = 'zw-reading-card';
        if (card.full) classes += ' zw-full';
        if (card.highlight) classes += ' zw-highlight';
        if (card.teal) classes += ' zw-teal';

        var probHtml = '';
        if (card.probabilities) {
            for (var i = 0; i < card.probabilities.length; i++) {
                var pb = card.probabilities[i];
                probHtml += '<div class="zw-prob-bar">' +
                    '<span class="zw-prob-label">' + pb.label + '</span>' +
                    '<div class="zw-prob-track"><div class="zw-prob-fill" style="width:' + pb.pct + '%"></div></div>' +
                    '<span class="zw-prob-pct">' + pb.pct + '%</span></div>';
            }
        }

        return '<div class="' + classes + '">' +
            '<div class="zw-card-title">' + card.title + '</div>' +
            (card.badge ? '<div class="zw-card-badge">' + card.badge + '</div>' : '') +
            '<div class="zw-card-body">' + card.body + '</div>' +
            (probHtml ? '<div class="zw-prob-section">' + probHtml + '</div>' : '') +
        '</div>';
    }

    function buildLockedPreview(reading) {
        var html = '<div class="zw-locked-section">';
        html += '<div class="zw-locked-divider"><span>' + _('zw_locked_divider') + '</span></div>';

        if (reading.cards.length > 1) {
            html += '<div class="zw-locked-cards">';
            for (var i = 1; i < Math.min(reading.cards.length, 5); i++) {
                if (i === 4) continue;
                html += '<div class="zw-locked-card-item">' +
                    '<div class="zw-locked-icon">🔒</div>' +
                    '<div class="zw-locked-card-title">' + reading.cards[i].title + '</div>' +
                    '<div class="zw-locked-card-badge">' + (reading.cards[i].badge || '') + '</div>' +
                    '<div class="zw-locked-card-preview">' + getPreviewSnippet(reading.cards[i].body) + '</div>' +
                '</div>';
            }
            html += '</div>';
        }

        html += '</div>';
        return html;
    }

    function getPreviewSnippet(body) {
        var text = body.replace(/<[^>]+>/g, '');
        return text.substring(0, 60) + '...';
    }

    function renderFullReport(chart, reading) {
        var fullReport = document.getElementById('zwFullReport');
        if (!fullReport) return;

        var html = '';
        html += '<div class="zw-section-title">' + _('zw_full_reading') + '</div>';
        html += '<div class="zw-reading-grid">';
        for (var i = 0; i < reading.cards.length; i++) {
            html += buildReadingCardHTML(reading.cards[i]);
        }
        html += '</div>';

        html += '<div class="zw-section-title">' + _('zw_hand_section') + '</div>';
        html += '<div id="handReadingContainerFull"></div>';

        html += buildCalibrationSection();

        fullReport.innerHTML = html;
        fullReport.style.display = 'block';

        if (typeof HandReading !== 'undefined') {
            HandReading.init('handReadingContainerFull', window._quickHandImage || null);
        }

        var preview = document.getElementById('zwPreview');
        if (preview) preview.style.display = 'none';
    }

    function buildCalibrationSection() {
        var questions = [
            { text: _('zw_cal_q1'), hint: _('zw_cal_q1_hint') },
            { text: _('zw_cal_q2'), hint: _('zw_cal_q2_hint') },
            { text: _('zw_cal_q3'), hint: _('zw_cal_q3_hint') },
            { text: _('zw_cal_q4'), hint: _('zw_cal_q4_hint') },
            { text: _('zw_cal_q5'), hint: _('zw_cal_q5_hint') }
        ];

        var html = '<div class="zw-calibration">';
        html += '<div class="zw-cal-title">' + _('zw_cal_title') + '</div>';
        html += '<div class="zw-cal-desc">' + _('zw_cal_desc') + '</div>';
        html += '<div class="zw-cal-questions">';

        var nums = ['一', '二', '三', '四', '五'];
        for (var i = 0; i < questions.length; i++) {
            html += '<div class="zw-cal-q">' +
                '<div class="zw-cal-num">' + nums[i] + '</div>' +
                '<div class="zw-cal-text">' + questions[i].text +
                '<span>' + questions[i].hint + '</span></div>' +
            '</div>';
        }

        html += '</div></div>';
        return html;
    }

    function unlock() {
        isUnlocked = true;
        var chart = ZiWeiEngine.getCurrentChart();
        if (chart && currentReading) {
            renderFullReport(chart, currentReading);
        }
        var lockBanner = document.getElementById('zwLockBanner');
        if (lockBanner) lockBanner.style.display = 'none';
    }

    function isReportUnlocked() {
        return isUnlocked;
    }

    // Re-render for language change
    function reRender() {
        var chart = ZiWeiEngine.getCurrentChart();
        if (!chart) return;

        var reading = ZiWeiEngine.generateReading(chart, getLang());
        currentChart = chart;
        currentReading = reading;

        var fullReport = document.getElementById('zwFullReport');
        if (fullReport && fullReport.style.display !== 'none' && isUnlocked) {
            renderFullReport(chart, reading);
        } else {
            var preview = document.getElementById('zwPreview');
            if (preview && preview.style.display !== 'none') {
                renderFreePreview(chart, reading);
            }
        }
    }

    return {
        init: init,
        unlock: unlock,
        reRender: reRender,
        isReportUnlocked: isReportUnlocked
    };
})();
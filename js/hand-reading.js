/**
 * Hand Reading (手相交叉认证) Module
 * 交互式手相特征选择 + 图片上传 + 与紫微斗数命盘交叉比对
 * 手机端：自动拉起相机/相册 | 电脑端：文件选择器
 */
var HandReading = (function() {
    'use strict';

    var FEATURES = (typeof ZiWeiData !== 'undefined' && ZiWeiData.HAND_FEATURES) ? ZiWeiData.HAND_FEATURES : {};
    var _ = function(k) { return (typeof I18n !== 'undefined' && I18n.t) ? I18n.t(k) : k; };
    var getLang = function() { return (typeof I18n !== 'undefined') ? I18n.getLang() : 'zh'; };
    var uploadedImage = null;

    function init(containerId, preImage) {
        var container = document.getElementById(containerId);
        if (!container) return;

        // Accept pre-uploaded image from quick upload
        if (preImage) {
            uploadedImage = preImage;
        } else if (typeof window !== 'undefined' && window._quickHandImage) {
            uploadedImage = window._quickHandImage;
        }

        container.innerHTML = buildFormHTML();
        bindEvents(container);

        // Show pre-uploaded image if available
        if (uploadedImage) {
            var placeholder = container.querySelector('#handUploadPlaceholder');
            var preview = container.querySelector('#handUploadPreview');
            var img = container.querySelector('#handUploadImg');
            if (placeholder) placeholder.style.display = 'none';
            if (preview) preview.style.display = 'block';
            if (img) img.src = uploadedImage;
        }
    }

    function buildFormHTML() {
        var isEn = (getLang() === 'en');
        var html = '<div class="hand-reading-form">';
        html += '<div class="hand-intro">';
        html += '<p>' + _('hand_intro') + '</p>';
        html += '<p class="hand-note">' + _('hand_note') + '</p>';
        html += '</div>';

        // Image upload section
        html += '<div class="hand-upload-section">';
        html += '<div class="hand-upload-area" id="handUploadArea">';
        html += '<div class="hand-upload-placeholder" id="handUploadPlaceholder">';
        html += '<div class="hand-upload-icon">📷</div>';
        html += '<div class="hand-upload-text">' + _('hand_upload_placeholder') + '</div>';
        html += '<div class="hand-upload-hint">' + _('hand_upload_hint') + '</div>';
        html += '</div>';
        html += '<div class="hand-upload-preview" id="handUploadPreview" style="display:none;">';
        html += '<img id="handUploadImg" src="" alt="Palm">';
        html += '<button type="button" class="hand-upload-remove" id="handUploadRemove">' + _('hand_upload_remove') + '</button>';
        html += '</div>';
        html += '</div>';
        html += '<input type="file" id="handFileInput" accept="image/*" style="display:none;">';
        html += '</div>';

        // Feature selection
        for (var category in FEATURES) {
            if (!FEATURES.hasOwnProperty(category)) continue;
            var f = FEATURES[category];
            var catTitle = isEn ? (f.titleEn || f.title) : f.title;
            html += '<div class="hand-category">';
            html += '<div class="hand-cat-title">' + catTitle + '</div>';
            html += '<div class="hand-options" data-category="' + category + '">';
            for (var key in f.features) {
                if (!f.features.hasOwnProperty(key)) continue;
                var feat = f.features[key];
                var featDesc = isEn ? (feat.descEn || feat.desc) : feat.desc;
                html += '<label class="hand-option">';
                html += '<input type="radio" name="hand_' + category + '" value="' + key + '">';
                html += '<span class="hand-opt-label">' + key + '</span>';
                html += '<span class="hand-opt-desc">' + featDesc + '</span>';
                html += '</label>';
            }
            html += '<label class="hand-option hand-skip">';
            html += '<input type="radio" name="hand_' + category + '" value="" checked>';
            html += '<span class="hand-opt-label">' + _('hand_skip') + '</span>';
            html += '</label>';
            html += '</div>';
            html += '</div>';
        }

        html += '<div class="hand-actions">';
        html += '<button type="button" id="btnHandCrossRef" class="btn-hand-crossref">' + _('hand_crossref_btn') + '</button>';
        html += '</div>';
        html += '<div id="handResult" class="hand-result" style="display:none;"></div>';
        html += '</div>';

        return html;
    }

    function bindEvents(container) {
        // Upload area click/tap
        var uploadArea = container.querySelector('#handUploadArea');
        var fileInput = container.querySelector('#handFileInput');
        if (uploadArea && fileInput) {
            uploadArea.addEventListener('click', function() {
                fileInput.click();
            });
            fileInput.addEventListener('change', function() {
                if (this.files && this.files[0]) {
                    handleImageUpload(this.files[0], container);
                }
            });
        }

        // Remove button
        var removeBtn = container.querySelector('#handUploadRemove');
        if (removeBtn) {
            removeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                clearImage(container);
            });
        }

        // Cross-ref button
        var btn = container.querySelector('#btnHandCrossRef');
        if (btn) {
            btn.addEventListener('click', function() {
                var features = collectFeatures(container);
                var hasImage = uploadedImage !== null;
                var hasFeatures = Object.keys(features).length > 0;

                if (!hasFeatures && !hasImage) {
                    showResult(container, null);
                    return;
                }

                var chart = ZiWeiEngine.getCurrentChart();
                if (!chart) {
                    showResult(container, null, _('hand_no_chart'));
                    return;
                }

                var results = ZiWeiEngine.crossReferenceHand(features, chart, getLang());
                showResult(container, results, null, hasImage);
            });
        }
    }

    function handleImageUpload(file, container) {
        var reader = new FileReader();
        reader.onload = function(e) {
            uploadedImage = e.target.result;
            var placeholder = container.querySelector('#handUploadPlaceholder');
            var preview = container.querySelector('#handUploadPreview');
            var img = container.querySelector('#handUploadImg');

            if (placeholder) placeholder.style.display = 'none';
            if (preview) preview.style.display = 'block';
            if (img) img.src = uploadedImage;
        };
        reader.readAsDataURL(file);
    }

    function clearImage(container) {
        uploadedImage = null;
        var placeholder = container.querySelector('#handUploadPlaceholder');
        var preview = container.querySelector('#handUploadPreview');
        var fileInput = container.querySelector('#handFileInput');

        if (placeholder) placeholder.style.display = '';
        if (preview) preview.style.display = 'none';
        if (fileInput) fileInput.value = '';
    }

    function collectFeatures(container) {
        var features = {};
        var radios = container.querySelectorAll('input[type="radio"]:checked');
        for (var i = 0; i < radios.length; i++) {
            var radio = radios[i];
            if (radio.value === '') continue;
            var category = radio.name.replace('hand_', '');
            features[category] = radio.value;
        }
        return features;
    }

    function showResult(container, results, errorMsg, hasImage) {
        var resultDiv = container.querySelector('#handResult');
        if (!resultDiv) return;

        if (errorMsg) {
            resultDiv.innerHTML = '<div class="hand-error">' + errorMsg + '</div>';
            resultDiv.style.display = 'block';
            return;
        }

        if ((!results || results.length === 0) && !hasImage) {
            resultDiv.innerHTML = '<div class="hand-empty">' + _('hand_no_feature') + '</div>';
            resultDiv.style.display = 'block';
            return;
        }

        var html = '';

        // Show uploaded image if present
        if (hasImage && uploadedImage) {
            html += '<div class="hand-image-result">';
            html += '<img src="' + uploadedImage + '" alt="Palm" class="hand-result-img">';
            html += '<div class="hand-image-note">' + _('hand_upload_btn') + '</div>';
            html += '</div>';
        }

        if (results && results.length > 0) {
            html += '<div class="hand-grid">';
            for (var i = 0; i < results.length; i++) {
                var r = results[i];
                html += '<div class="hand-card">';
                html += '<div class="hand-card-title">' + r.title + '</div>';
                html += '<div class="hand-card-body">' + r.body + '</div>';
                if (r.status === 'match') {
                    html += '<div class="conflict-tag match">' + _('hand_match') + '</div>';
                } else {
                    html += '<div class="conflict-tag conflict">' + _('hand_conflict') + '</div>';
                    if (r.resolution) {
                        html += '<div class="hand-resolution">' + _('hand_resolution') + '</div>';
                    }
                }
                html += '</div>';
            }
            html += '</div>';
        }

        resultDiv.innerHTML = html;
        resultDiv.style.display = 'block';
    }

    return {
        init: init
    };
})();
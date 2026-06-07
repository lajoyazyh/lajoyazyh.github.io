// Global language switch functionality
(function() {
    'use strict';

    // Storage key for language preference
    const STORAGE_KEY = 'site-lang-preference';

    // Get saved language preference or default to Chinese
    function getInitialLang() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved || 'zh'; // Default to Chinese
        } catch (e) {
            return 'zh'; // Fallback to Chinese if localStorage is unavailable
        }
    }

    // Save language preference
    function saveLang(lang) {
        try {
            localStorage.setItem(STORAGE_KEY, lang);
        } catch (e) {
            // Ignore if localStorage is unavailable
        }
    }

    // Show specified language
    window.showLang = function(lang) {
        const en = document.getElementById('content-en');
        const zh = document.getElementById('content-zh');
        const btnEn = document.getElementById('btn-en');
        const btnZh = document.getElementById('btn-zh');

        if (lang === 'en') {
            if (en) en.style.display = 'block';
            if (zh) zh.style.display = 'none';
            
            if (btnEn) btnEn.classList.add('active');
            if (btnZh) btnZh.classList.remove('active');
        } else {
            if (en) en.style.display = 'none';
            if (zh) zh.style.display = 'block';
            
            if (btnEn) btnEn.classList.remove('active');
            if (btnZh) btnZh.classList.add('active');
        }

        // Save preference
        saveLang(lang);
    };

    // Initialize on load (default to Chinese, use saved preference if available)
    const initLang = getInitialLang();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            showLang(initLang);
        });
    } else {
        showLang(initLang);
    }
})();

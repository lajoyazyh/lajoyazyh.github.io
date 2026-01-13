(function() {
    // SVGs for icons
    const sunIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
    const moonIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

    function getTheme() {
        // Default to 'dark' if no preference is found
        return localStorage.getItem('theme') || 'dark';
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateButtonState(theme);
    }

    function toggleTheme() {
        const current = getTheme();
        const next = current === 'dark' ? 'light' : 'dark';
        setTheme(next);
    }

    function updateButtonState(theme) {
        const btn = document.getElementById('fixed-theme-btn');
        if (btn) {
            // Dark mode -> Moon icon, Light mode -> Sun icon (Current State indicator)
            btn.innerHTML = theme === 'dark' ? moonIcon : sunIcon;
            
            // Adjust styles based on theme
            if (theme === 'dark') {
                btn.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                btn.style.color = '#fff';
                btn.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
            } else {
                btn.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
                btn.style.color = '#333';
                btn.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            }
        }
    }

    function createFloatingButton() {
        // Prevent duplicate creation
        if (document.getElementById('fixed-theme-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'fixed-theme-btn';
        
        // Styles
        Object.assign(btn.style, {
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            zIndex: '9999',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            webkitBackdropFilter: 'blur(10px)'
        });

        // Hover effect helper
        btn.onmouseenter = () => btn.style.transform = 'scale(1.1)';
        btn.onmouseleave = () => btn.style.transform = 'scale(1)';
        
        btn.onclick = toggleTheme;
        
        document.body.appendChild(btn);
        
        // Apply current state state
        updateButtonState(getTheme());
    }

    // Initialize
    const savedTheme = getTheme();
    document.documentElement.setAttribute('data-theme', savedTheme);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createFloatingButton);
    } else {
        createFloatingButton();
    }

    // Listen for PJAX/Turbo transitions if any (cover standard Hexo valid events)
    document.addEventListener('pjax:complete', createFloatingButton);
    document.addEventListener('turbolinks:load', createFloatingButton);

})();
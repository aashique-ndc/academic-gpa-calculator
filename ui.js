// assets/js/ui.js
let currentTab = 0;

function showTab(tabIndex) {
    currentTab = tabIndex;
    document.querySelectorAll('.tab-content').forEach((tab, index) => {
        tab.classList.toggle('hidden', index !== tabIndex);
    });
    
    document.querySelectorAll('.tab-btn').forEach((btn, index) => {
        btn.classList.toggle('active', index === tabIndex);
    });
}

function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    const icon = document.getElementById('theme-toggle').querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
}

function setCreditMode(mode) {
    // Logic for equal/variable credit will be handled in app.js
    showToast(`Credit mode set to ${mode}`);
}

export { showTab, toggleTheme, setCreditMode };
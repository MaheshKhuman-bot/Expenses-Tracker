/** Read saved theme from localStorage */
export function getStoredTheme() {
    return localStorage.getItem('theme') || 'dark';
}

/** Store theme preference */
export function storeTheme(theme) {
    localStorage.setItem('theme', theme);
}

/** Apply theme to the document root */
export function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    storeTheme(theme);
}

/** Toggle between dark and light */
export function toggleTheme() {
    const current = getStoredTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    return next;
}

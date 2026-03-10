// Map of currency codes → { symbol, name, locale }
export const CURRENCIES = [
    { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
    { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
    { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', locale: 'zh-CN' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA' },
    { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', locale: 'de-CH' },
    { code: 'KRW', symbol: '₩', name: 'South Korean Won', locale: 'ko-KR' },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', locale: 'en-SG' },
    { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', locale: 'ar-AE' },
    { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', locale: 'pt-BR' },
    { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso', locale: 'es-MX' },
    { code: 'ZAR', symbol: 'R', name: 'South African Rand', locale: 'en-ZA' },
    { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', locale: 'en-NG' },
    { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound', locale: 'ar-EG' },
    { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', locale: 'id-ID' },
    { code: 'TRY', symbol: '₺', name: 'Turkish Lira', locale: 'tr-TR' },
    { code: 'RUB', symbol: '₽', name: 'Russian Ruble', locale: 'ru-RU' },
];

/** Get currency metadata by code */
export function getCurrencyInfo(code) {
    return CURRENCIES.find((c) => c.code === code) || CURRENCIES[0];
}

/** Format a number as a currency string using Intl.NumberFormat */
export function formatMoney(amount, currencyCode = 'USD') {
    const { locale } = getCurrencyInfo(currencyCode);
    try {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currencyCode,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(amount);
    } catch {
        const { symbol } = getCurrencyInfo(currencyCode);
        return `${symbol}${Number(amount).toLocaleString()}`;
    }
}

/** Get just the symbol for a currency code */
export function getCurrencySymbol(code = 'USD') {
    return getCurrencyInfo(code).symbol;
}

/** Read currency preference from localStorage (set alongside user settings) */
export function getStoredCurrency() {
    return localStorage.getItem('currency') || 'USD';
}

/** Persist currency preference to localStorage */
export function storeCurrency(code) {
    localStorage.setItem('currency', code);
}

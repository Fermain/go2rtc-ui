import { writable } from 'svelte/store';
import { getLocale, setLocale, locales, baseLocale, isLocale } from '$lib/paraglide/runtime';
import { browser } from '$app/environment';

// Create a reactive store for the current locale
function createLanguageStore() {
	const { subscribe, set } = writable(getLocale());
	
	return {
		subscribe,
		// Get current locale
		get: () => getLocale(),
		// Set new locale
		set: (locale: string) => {
			if (isLocale(locale)) {
				setLocale(locale, { reload: false });
				set(locale);
			}
		},
		// Set locale with page reload (useful for full re-render)
		setWithReload: (locale: string) => {
			if (isLocale(locale)) {
				setLocale(locale, { reload: true });
			}
		},
		// Get all available locales
		getAvailableLocales: () => locales,
		// Get base locale
		getBaseLocale: () => baseLocale
	};
}

export const currentLanguage = createLanguageStore();

// Update store when locale changes (e.g., from URL routing)
if (browser) {
	// Check for locale changes periodically
	setInterval(() => {
		const currentLocale = getLocale();
		currentLanguage.set(currentLocale);
	}, 1000);
} 
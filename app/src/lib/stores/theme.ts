import { persist, createLocalStorage } from '@macfja/svelte-persistent-store';
import { derived, writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Theme = 'light' | 'dark' | 'system';

// Persisted theme preference store
export const themePreference = persist(writable<Theme>('system'), createLocalStorage<Theme>(), 'theme');

// System dark mode media query store
function createSystemDarkModeStore() {
	const store = persist(writable<boolean>(false), createLocalStorage<boolean>(), 'system-dark-mode');

	if (browser) {
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		store.set(mediaQuery.matches);

		// Listen for system theme changes
		const handleChange = (e: MediaQueryListEvent) => {
			store.set(e.matches);
		};

		mediaQuery.addEventListener('change', handleChange);
	}

	return store;
}

export const systemDarkMode = createSystemDarkModeStore();

// Derived store that computes the actual theme to apply
export const resolvedTheme = derived(
	[themePreference, systemDarkMode],
	([$themePreference, $systemDarkMode]) => {
		if ($themePreference === 'system') {
			return $systemDarkMode ? 'dark' : 'light';
		}
		return $themePreference;
	}
);

// Theme management functions
export const themeActions = {
	setTheme: (newTheme: Theme) => {
		themePreference.set(newTheme);
		applyThemeToDOM();
	},

	toggle: () => {
		themePreference.update((current: Theme) => {
			if (current === 'system') {
				// If currently system, toggle to opposite of current system preference
				const isSystemDark = browser && window.matchMedia('(prefers-color-scheme: dark)').matches;
				return isSystemDark ? 'light' : 'dark';
			}
			return current === 'light' ? 'dark' : 'light';
		});
		applyThemeToDOM();
	},

	init: () => {
		if (browser) {
			applyThemeToDOM();

			// Set up reactive DOM updates
			resolvedTheme.subscribe(() => {
				applyThemeToDOM();
			});
		}
	}
};

function applyThemeToDOM() {
	if (!browser) return;

	// Get current resolved theme value
	let currentTheme: string = 'light';
	const unsubscribe = resolvedTheme.subscribe((theme: string) => {
		currentTheme = theme;
	});
	unsubscribe();

	const root = document.documentElement;
	root.classList.toggle('dark', currentTheme === 'dark');
}

// Convenience export for the main theme store
export const theme = {
	...themeActions,
	preference: themePreference,
	resolved: resolvedTheme,
	systemDark: systemDarkMode
};

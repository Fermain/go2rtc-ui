import type { AppInfo } from '$lib/services/api.js';

export async function load({ fetch }) {
	try {
		// Use SvelteKit's fetch for proper SSR/hydration behavior
		const response = await fetch('/api');
		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}
		
		const appInfo: AppInfo = await response.json();
		return {
			appInfo: {
				version: appInfo.version || 'Unknown',
				config_path: appInfo.config_path || '/config/go2rtc.yaml'
			}
		};
	} catch (error) {
		console.error('Failed to load app info:', error);
		// Return fallback data instead of breaking the app
		return {
			appInfo: {
				version: 'Error',
				config_path: '/config/go2rtc.yaml'
			}
		};
	}
}

export type PageData = {
	appInfo: {
		version: string;
		config_path: string;
	};
}; 
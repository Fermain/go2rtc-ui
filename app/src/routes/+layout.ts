import { AppService } from '$lib/services/api.js';

export async function load() {
	try {
		const appInfo = await AppService.getAppInfo();
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
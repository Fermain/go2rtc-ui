import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';

export type ShortcutAction = 
	| 'refresh-streams'
	| 'add-stream' 
	| 'save-config'
	| 'go-back'
	| 'toggle-theme';

export interface ShortcutConfig {
	key: string;
	modifier?: ('ctrl' | 'meta' | 'shift' | 'alt')[];
	description: string;
	action: ShortcutAction;
	callback?: () => void;
}

// Platform-aware modifier key detection
export const modifierKey = writable<'⌘' | 'Ctrl'>('⌘');

function detectPlatform() {
	if (browser && navigator?.platform) {
		const platform = navigator.platform.toLowerCase();
		const isMac = platform.includes('mac');
		modifierKey.set(isMac ? '⌘' : 'Ctrl');
		return isMac ? 'meta' : 'ctrl';
	}
	return 'meta';
}

// Get the appropriate modifier for the current platform
export function getPlatformModifier(): 'meta' | 'ctrl' {
	return detectPlatform();
}

// Shortcut actions registry - callbacks can be dynamically registered
const actionCallbacks = new Map<ShortcutAction, () => void>();

export function registerShortcutAction(action: ShortcutAction, callback: () => void) {
	actionCallbacks.set(action, callback);
}

export function unregisterShortcutAction(action: ShortcutAction) {
	actionCallbacks.delete(action);
}

export function executeShortcutAction(action: ShortcutAction) {
	const callback = actionCallbacks.get(action);
	if (callback) {
		callback();
	} else {
		// Fallback for global actions
		switch (action) {
			case 'add-stream':
				goto('/add');
				break;
			case 'go-back':
				if (browser) window.history.back();
				break;
		}
	}
}

// Global shortcuts that work everywhere
export const globalShortcuts: ShortcutConfig[] = [
	{
		key: 'k',
		modifier: [getPlatformModifier()],
		description: 'Add new stream',
		action: 'add-stream'
	},
	{
		key: 'Escape',
		description: 'Go back',
		action: 'go-back'
	}
];

// Page-specific shortcuts
export const pageShortcuts = {
	streams: [
		{
			key: 'r',
			modifier: [getPlatformModifier()],
			description: 'Refresh streams',
			action: 'refresh-streams' as ShortcutAction
		}
	],
	config: [
		{
			key: 's',
			modifier: [getPlatformModifier()],
			description: 'Save configuration',
			action: 'save-config' as ShortcutAction
		}
	]
} as const;

// Initialize platform detection
if (browser) {
	detectPlatform();
} 
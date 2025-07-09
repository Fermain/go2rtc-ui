import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';

// Simple action types we actually use
export type ShortcutAction = 'refresh-streams' | 'add-stream' | 'save-config' | 'go-back';

// Platform-aware modifier key detection
export const modifierKey = writable<'⌘' | 'Ctrl'>('⌘');

function detectPlatform(): 'meta' | 'ctrl' {
	if (browser && navigator?.platform) {
		const platform = navigator.platform.toLowerCase();
		const isMac = platform.includes('mac');
		modifierKey.set(isMac ? '⌘' : 'Ctrl');
		return isMac ? 'meta' : 'ctrl';
	}
	return 'meta';
}

// Simple registry for page-specific shortcuts
const actionCallbacks = new Map<ShortcutAction, () => void>();

export function registerShortcutAction(action: ShortcutAction, callback: () => void) {
	actionCallbacks.set(action, callback);
}

export function unregisterShortcutAction(action: ShortcutAction) {
	actionCallbacks.delete(action);
}

function executeAction(action: ShortcutAction) {
	const callback = actionCallbacks.get(action);
	if (callback) {
		callback();
	} else {
		// Simple fallback for global actions
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

// Global shortcuts in @svelte-put/shortcut format
export const globalShortcuts = [
	{
		key: 'k',
		modifier: [detectPlatform()],
		callback: () => executeAction('add-stream')
	},
	{
		key: 'Escape',
		callback: () => executeAction('go-back')
	}
];

// Initialize platform detection
if (browser) {
	detectPlatform();
} 
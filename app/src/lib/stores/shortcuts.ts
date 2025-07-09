import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';

// Simple action types we actually use
export type ShortcutAction = 'refresh-streams' | 'add-stream' | 'save-config' | 'go-back';

// Platform-aware modifier key detection  
export const modifierKey = writable<'⌘' | 'Ctrl'>('⌘');
export const modifierText = writable<'⌘' | 'Ctrl+'>('⌘');

function detectPlatform(): 'meta' | 'ctrl' {
	if (browser && navigator?.platform) {
		const platform = navigator.platform.toLowerCase();
		const isMac = platform.includes('mac');
		modifierKey.set(isMac ? '⌘' : 'Ctrl');
		modifierText.set(isMac ? '⌘' : 'Ctrl+');
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

// Global shortcuts in @svelte-put/shortcut format - separate for each platform
export const globalShortcuts = [
	// Add stream - Cmd+K or Ctrl+K
	{
		key: 'k',
		modifier: ['meta'],
		callback: () => executeAction('add-stream')
	},
	{
		key: 'k', 
		modifier: ['ctrl'],
		callback: () => executeAction('add-stream')
	},
	// Go back - Escape
	{
		key: 'Escape',
		callback: () => executeAction('go-back')
	},
	// Save config - Cmd+Enter or Ctrl+Enter
	{
		key: 'Enter',
		modifier: ['meta'],
		callback: () => executeAction('save-config')
	},
	{
		key: 'Enter',
		modifier: ['ctrl'],
		callback: () => executeAction('save-config')
	},
	// Refresh - Cmd+Shift+R or Ctrl+Shift+R
	{
		key: 'r',
		modifier: ['meta', 'shift'],
		callback: () => executeAction('refresh-streams')
	},
	{
		key: 'r',
		modifier: ['ctrl', 'shift'],
		callback: () => executeAction('refresh-streams')
	}
];

// Initialize platform detection
if (browser) {
	detectPlatform();
} 
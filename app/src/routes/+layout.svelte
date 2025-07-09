<script lang="ts">
	import '../app.css';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { queryClient } from '$lib/queryClient';
	import { Header } from '$lib/components/navigation';
	import { ModeWatcher } from 'mode-watcher';
	import { shortcut } from '@svelte-put/shortcut';
	import { globalShortcuts, executeShortcutAction } from '$lib/stores/shortcuts';

	let { children, data } = $props();

	// Version info from load function
	let versionInfo = $state(data.appInfo);

	// Set up global shortcuts
	function setupGlobalShortcuts() {
		return globalShortcuts.map(shortcut => ({
			key: shortcut.key,
			modifier: shortcut.modifier,
			callback: () => executeShortcutAction(shortcut.action)
		}));
	}
</script>

<ModeWatcher />

<!-- Global keyboard shortcuts -->
<svelte:window 
	use:shortcut={{
		trigger: setupGlobalShortcuts()
	}}
/>

<QueryClientProvider client={queryClient}>
	<div class="bg-background min-h-screen">
		<Header version={versionInfo.version} configPath={versionInfo.config_path} />

		<!-- Main content -->
		<main class="p-4">
			{@render children()}
		</main>
	</div>
</QueryClientProvider>

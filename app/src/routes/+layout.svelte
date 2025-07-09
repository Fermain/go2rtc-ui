<script lang="ts">
	import '../app.css';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { queryClient } from '$lib/queryClient';
	import { Header } from '$lib/components/navigation';
	import { ModeWatcher } from 'mode-watcher';

	let { children, data } = $props();

	// Version info from load function
	let versionInfo = $state(data.appInfo);
</script>

<ModeWatcher />
<QueryClientProvider client={queryClient}>
	<div class="bg-background min-h-screen">
		<Header version={versionInfo.version} configPath={versionInfo.config_path} />

		<!-- Main content -->
		<main class="p-4">
			{@render children()}
		</main>
	</div>
</QueryClientProvider>

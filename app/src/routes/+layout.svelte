<script lang="ts">
	import '../app.css';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { queryClient } from '$lib/queryClient';
	import { theme } from '$lib/stores/theme';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		theme.init();
	});
</script>

<QueryClientProvider client={queryClient}>
	<div class="flex h-screen bg-background">
		<!-- Sidebar -->
		<aside class="w-64 bg-card border-r border-border">
			<div class="p-4">
				<h1 class="text-xl font-bold text-foreground">go2rtc</h1>
			</div>
			<nav class="px-2 space-y-1">
				<a href="/" class="flex items-center px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-md">
					Streams
				</a>
				<a href="/config" class="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md">
					Config
				</a>
				<a href="/logs" class="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md">
					Logs
				</a>
			</nav>
		</aside>

		<!-- Main content -->
		<main class="flex-1 overflow-auto">
			<div class="p-6">
				{@render children()}
			</div>
		</main>
	</div>
</QueryClientProvider>

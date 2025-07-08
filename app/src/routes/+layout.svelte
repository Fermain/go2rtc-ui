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
	<div class="bg-background flex h-screen">
		<!-- Sidebar -->
		<aside class="bg-card border-border w-64 border-r">
			<div class="p-4">
				<h1 class="text-foreground text-xl font-bold">go2rtc</h1>
			</div>
			<nav class="space-y-1 px-2">
				<a
					href="/"
					class="text-foreground hover:bg-accent hover:text-accent-foreground flex items-center rounded-md px-3 py-2 text-sm font-medium"
				>
					Streams
				</a>
				<a
					href="/config"
					class="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center rounded-md px-3 py-2 text-sm font-medium"
				>
					Config
				</a>
				<a
					href="/logs"
					class="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center rounded-md px-3 py-2 text-sm font-medium"
				>
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

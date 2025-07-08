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
	<div class="bg-background min-h-screen">
		<!-- Top Navigation -->
		<nav class="border-border bg-card border-b">
			<div class="px-4 py-3">
				<div class="flex items-center gap-6">
					<span class="text-xl font-semibold">go2rtc</span>
					<div class="flex gap-4">
						<a href="/" class="hover:text-foreground text-foreground/80 text-sm"> Streams </a>
						<a href="/config" class="hover:text-foreground text-foreground/80 text-sm"> Config </a>
						<a href="/logs" class="hover:text-foreground text-foreground/80 text-sm"> Logs </a>
					</div>
				</div>
			</div>
		</nav>

		<!-- Main content -->
		<main class="px-4 py-6">
			{@render children()}
		</main>
	</div>
</QueryClientProvider>

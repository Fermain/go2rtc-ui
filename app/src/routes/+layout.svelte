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
	<div class="min-h-screen bg-background">
		<!-- Top Navigation -->
		<nav class="border-b border-border bg-card">
			<div class="px-4 py-3">
				<div class="flex items-center gap-6">
					<span class="text-xl font-semibold">go2rtc</span>
					<div class="flex gap-4">
						<a href="/" class="text-sm hover:text-foreground text-foreground/80">
							Streams
						</a>
						<a href="/config" class="text-sm hover:text-foreground text-foreground/80">
							Config
						</a>
						<a href="/logs" class="text-sm hover:text-foreground text-foreground/80">
							Logs
						</a>
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

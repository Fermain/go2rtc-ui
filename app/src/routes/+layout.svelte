<script lang="ts">
	import '../app.css';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { queryClient } from '$lib/queryClient';
	import { theme, resolvedTheme } from '$lib/stores/theme';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { Switch } from '$lib/components/ui/switch';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Info, Sun, Moon } from 'lucide-svelte';

	let { children } = $props();

	// Version info (TODO: Replace with actual API call)
	let versionInfo = $state({
		version: '1.9.4',
		config_path: '/config/go2rtc.yaml'
	});

	onMount(() => {
		theme.init();
	});

	function handleThemeToggle() {
		theme.toggle();
	}
</script>

<QueryClientProvider client={queryClient}>
	<div class="bg-background min-h-screen">
		<!-- Top Navigation -->
		<nav class="border-border bg-card border-b">
			<div class="px-4 py-3">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-6">
						<span class="text-xl font-semibold">go2rtc</span>
						<div class="flex gap-4">
							<a
								href="/"
								class="hover:text-foreground text-sm {$page.url.pathname === '/'
									? 'text-foreground underline underline-offset-4'
									: 'text-foreground/80'}"
							>
								Streams
							</a>
							<a
								href="/add"
								class="hover:text-foreground text-sm {$page.url.pathname === '/add'
									? 'text-foreground underline underline-offset-4'
									: 'text-foreground/80'}"
							>
								Add
							</a>
							<a
								href="/config"
								class="hover:text-foreground text-sm {$page.url.pathname === '/config'
									? 'text-foreground underline underline-offset-4'
									: 'text-foreground/80'}"
							>
								Config
							</a>
							<a
								href="/logs"
								class="hover:text-foreground text-sm {$page.url.pathname === '/logs'
									? 'text-foreground underline underline-offset-4'
									: 'text-foreground/80'}"
							>
								Logs
							</a>
						</div>
					</div>

					<div class="flex items-center gap-3">
						<!-- Add Stream Button -->
						<Button variant="outline" size="sm">
							<a href="/add" class="text-inherit no-underline">Add Stream</a>
						</Button>

						<!-- Version Info Dropdown -->
						<DropdownMenu.Root>
							<DropdownMenu.Trigger>
								<Button variant="ghost" size="sm">
									<Info class="h-4 w-4" />
								</Button>
							</DropdownMenu.Trigger>
							<DropdownMenu.Content>
								<DropdownMenu.Label>System Info</DropdownMenu.Label>
								<DropdownMenu.Separator />
								<DropdownMenu.Item>
									<div class="flex flex-col gap-1">
										<span class="text-muted-foreground text-xs">Version</span>
										<span class="text-sm">{versionInfo.version}</span>
									</div>
								</DropdownMenu.Item>
								<DropdownMenu.Item>
									<div class="flex flex-col gap-1">
										<span class="text-muted-foreground text-xs">Config Path</span>
										<span class="font-mono text-sm">{versionInfo.config_path}</span>
									</div>
								</DropdownMenu.Item>
							</DropdownMenu.Content>
						</DropdownMenu.Root>

						<!-- Theme Toggle -->
						<Button variant="ghost" size="sm" onclick={handleThemeToggle}>
							{#if $resolvedTheme === 'dark'}
								<Sun class="h-4 w-4" />
							{:else}
								<Moon class="h-4 w-4" />
							{/if}
						</Button>
					</div>
				</div>
			</div>
		</nav>

		<!-- Main content -->
		<main class="p-4">
			{@render children()}
		</main>
	</div>
</QueryClientProvider>

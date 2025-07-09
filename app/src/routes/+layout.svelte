<script lang="ts">
	import '../app.css';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { queryClient } from '$lib/queryClient';
	import { theme, resolvedTheme } from '$lib/stores/theme';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Info, Sun, Moon } from 'lucide-svelte';

	let { children } = $props();

	// Version info - loaded from API in production
	let versionInfo = $state({
		version: '1.9.4',
		config_path: '/config/go2rtc.yaml'
	});

	// Platform-aware modifier key display
	let modifierKey = $state('⌘');

	function detectPlatform() {
		if (typeof navigator !== 'undefined') {
			const platform = navigator.platform.toLowerCase();
			modifierKey = platform.includes('mac') ? '⌘' : 'Ctrl';
		}
	}

	onMount(() => {
		theme.init();
		detectPlatform();

		// Keyboard shortcut handler for Cmd/Ctrl+K (add stream)
		function handleKeydown(e: KeyboardEvent) {
			// Check for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
				e.preventDefault();
				goto('/add');
			}
		}

		document.addEventListener('keydown', handleKeydown);

		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
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
								class="hover:text-foreground text-sm {page.url.pathname === '/'
									? 'text-foreground underline underline-offset-4'
									: 'text-foreground/80'}"
							>
								Streams
							</a>
							<a
								href="/add"
								class="hover:text-foreground text-sm {page.url.pathname === '/add'
									? 'text-foreground underline underline-offset-4'
									: 'text-foreground/80'}"
							>
								Add
							</a>
							<a
								href="/config"
								class="hover:text-foreground text-sm {page.url.pathname === '/config'
									? 'text-foreground underline underline-offset-4'
									: 'text-foreground/80'}"
							>
								Config
							</a>
							<a
								href="/logs"
								class="hover:text-foreground text-sm {page.url.pathname === '/logs'
									? 'text-foreground underline underline-offset-4'
									: 'text-foreground/80'}"
							>
								Logs
							</a>
							<a
								href="/network"
								class="hover:text-foreground text-sm {page.url.pathname === '/network'
									? 'text-foreground underline underline-offset-4'
									: 'text-foreground/80'}"
							>
								Net
							</a>
						</div>
					</div>

					<div class="flex items-center gap-3">
						<!-- Add Stream Button with keyboard shortcut -->
						<Button
							variant="outline"
							size="sm"
							onclick={() => goto('/add')}
							aria-label="Add Stream (Keyboard shortcut: {modifierKey}+K)"
							title="Add Stream ({modifierKey}+K)"
						>
							<span class="flex items-center gap-2">
								Add Stream
								<kbd
									class="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none"
								>
									<span class="text-xs">{modifierKey}</span>K
								</kbd>
							</span>
						</Button>

						<!-- Version Info Dropdown -->
						<DropdownMenu.Root>
							<DropdownMenu.Trigger
								class="hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
							>
								<Info class="h-4 w-4" />
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

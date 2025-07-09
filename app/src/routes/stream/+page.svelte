<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import Go2rtcPlayer from '$lib/components/Go2rtcPlayer.svelte';
	import { Button } from '$lib/components/ui/button';

	// Get stream source from URL parameter
	let streamSrc = $derived(page.url.searchParams.get('src'));

	// Add keyboard shortcut to go back
	onMount(() => {
		function handleKeydown(e: KeyboardEvent) {
			if (e.key === 'Escape') {
				window.history.back();
			}
		}
		window.addEventListener('keydown', handleKeydown);
		return () => window.removeEventListener('keydown', handleKeydown);
	});
</script>

<svelte:head>
	<title>{streamSrc ? `${streamSrc} - go2rtc` : 'Stream - go2rtc'}</title>
	<style>
		body {
			margin: 0 !important;
			padding: 0 !important;
			overflow: hidden;
		}
	</style>
</svelte:head>

{#if streamSrc}
	<!-- Fullscreen single stream view -->
	<div class="fixed inset-0 bg-black">
		<Go2rtcPlayer streamName={streamSrc} class="h-full w-full" />

		<!-- Back button overlay -->
		<div class="absolute top-4 left-4 z-10">
			<Button variant="secondary" size="sm" onclick={() => window.history.back()}>← Back</Button>
		</div>

		<!-- Stream name overlay -->
		<div class="absolute top-4 right-4 z-10">
			<div class="rounded bg-black/50 px-3 py-1 text-sm text-white">
				{streamSrc}
			</div>
		</div>
	</div>
{:else}
	<!-- No stream specified -->
	<div class="flex h-screen items-center justify-center">
		<div class="text-center">
			<h1 class="mb-4 text-2xl font-bold">No Stream Specified</h1>
			<p class="text-muted-foreground mb-4">
				Please provide a stream source via the 'src' parameter.
			</p>
			<Button onclick={() => (window.location.href = '/')}>← Back to Streams</Button>
		</div>
	</div>
{/if}

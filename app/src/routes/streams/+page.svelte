<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Go2rtcPlayer from '$lib/components/Go2rtcPlayer.svelte';

	// Get selected streams from URL
	$: selectedStreams = $page.url.searchParams.getAll('src');
	$: streamCount = selectedStreams.length;
	$: selectedModes = $page.url.searchParams.get('mode')?.split(',') || ['webrtc', 'mse', 'hls'];

	// Calculate responsive grid classes
	$: gridClasses = getResponsiveGridClasses(streamCount);

	function getResponsiveGridClasses(count: number): string {
		// Mobile first approach with Tailwind 4 breakpoints
		// Default (mobile): always single column
		// sm (640px+): 2 columns for 2+ streams
		// md (768px+): optimal for tablet
		// lg (1024px+): optimal for desktop

		if (count <= 1) {
			return 'grid-cols-1';
		}

		if (count === 2) {
			return 'grid-cols-1 sm:grid-cols-2';
		}

		if (count <= 4) {
			return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2';
		}

		if (count <= 6) {
			return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
		}

		if (count <= 9) {
			return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3';
		}

		if (count <= 16) {
			return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
		}

		if (count <= 25) {
			return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5';
		}

		// For larger numbers
		return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8';
	}

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
	<style>
		body {
			margin: 0 !important;
			padding: 0 !important;
			overflow: hidden;
		}
	</style>
</svelte:head>

<div class="fixed inset-0 grid bg-black {gridClasses} h-dvh w-full gap-0.5 overflow-auto">
	{#each selectedStreams as stream}
		<div class="relative aspect-video bg-neutral-900 sm:aspect-auto sm:h-full">
			<Go2rtcPlayer
				streamName={stream}
				class="h-full w-full"
			/>
		</div>
	{/each}
</div>

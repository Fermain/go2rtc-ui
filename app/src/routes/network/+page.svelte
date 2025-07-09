<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';

	// vis-network will be imported dynamically for SSR compatibility
	let vis: any;
	let Network: any;

	let networkContainer: HTMLElement;
	let network: any;
	let updateInterval: number;
	let isLoading = $state(true);
	let errorMessage = $state('');
	let isInitialized = $state(false);

	// Get stream filter from URL params (matches original ?src=camera1)
	const streamFilter = $derived(page.url.searchParams.getAll('src'));

	const networkOptions = {
		edges: {
			font: { align: 'middle' },
			smooth: false
		},
		nodes: { shape: 'box' },
		physics: false
	};

	async function updateNetwork() {
		if (!browser || !vis) return;

		try {
			// Build URL with stream filter support (matches original)
			let apiUrl = '/api/streams.dot';
			if (streamFilter.length > 0) {
				const params = new URLSearchParams();
				streamFilter.forEach((src) => params.append('src', src));
				apiUrl += '?' + params.toString();
			}

			const response = await fetch(apiUrl, { cache: 'no-cache' });
			if (!response.ok) {
				throw new Error(`Failed to fetch network data: ${response.statusText}`);
			}

			const dotData = await response.text();

			const data = vis.parseDOTNetwork(dotData);

			if (!network) {
				// First initialization - create the network
				network = new Network(networkContainer, data, networkOptions);
				network.storePositions();
				isInitialized = true;
			} else {
				// Update existing network while preserving state
				// This is the key feature that makes the original work so well
				const positions = network.getPositions();
				const viewPosition = network.getViewPosition();
				const scale = network.getScale();
				const selectedNodes = network.getSelectedNodes();

				// Update the data
				network.setData(data);

				// Restore all the preserved state
				for (const nodeId in positions) {
					network.moveNode(nodeId, positions[nodeId].x, positions[nodeId].y);
				}

				network.moveTo({ position: viewPosition, scale: scale });
				network.selectNodes(selectedNodes);
			}

			errorMessage = '';
		} catch (error) {
			console.error('Error fetching or updating network data:', error);
			errorMessage = `Network update failed: ${error}`;
		} finally {
			isLoading = false;
		}
	}

	onMount(async () => {
		if (!browser) return;

		try {
			// Import vis-network dynamically to avoid SSR issues
			vis = await import('vis-network');
			Network = vis.Network;

			// Initial network load
			await updateNetwork();

			// Set up auto-refresh every 5 seconds (matches original)
			updateInterval = window.setInterval(updateNetwork, 5000);
		} catch (error) {
			console.error('Failed to load vis-network:', error);
			errorMessage = 'Failed to load network visualization library';
			isLoading = false;
		}
	});

	onDestroy(() => {
		if (updateInterval) {
			clearInterval(updateInterval);
		}
		if (network) {
			network.destroy();
		}
	});
</script>

<svelte:head>
	<title>go2rtc - Network</title>
</svelte:head>

<div class="relative h-[calc(100vh-8rem)]">
	{#if isLoading && !isInitialized}
		<div class="bg-background/50 absolute inset-0 flex items-center justify-center">
			<div class="text-muted-foreground text-sm">Loading network...</div>
		</div>
	{/if}

	{#if errorMessage}
		<div class="absolute top-4 right-4 left-4 z-10">
			<Alert variant="destructive">
				<AlertDescription>{errorMessage}</AlertDescription>
			</Alert>
		</div>
	{/if}

	<div bind:this={networkContainer} class="h-full w-full"></div>
</div>

<style>
	/* Ensure the vis-network container fills the space properly */
	:global(.vis-network) {
		width: 100% !important;
		height: 100% !important;
	}

	/* Style the vis-network canvas to match our theme */
	:global(.vis-network canvas) {
		border-radius: 6px;
	}

	/* Dark mode support for vis-network */
	:global(.dark .vis-network) {
		background-color: hsl(var(--background)) !important;
	}
</style>

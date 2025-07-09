<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { browser } from '$app/environment';

	// Get stream source from URL parameter
	let src = $derived(page.url.searchParams.get('src'));
	let mp4 = $derived(page.url.searchParams.has('mp4'));

	let videoElement: HTMLVideoElement;
	let hls: any = null;
	let isLoading = $state(false);
	let error = $state<string | null>(null);
	let connectionStatus = $state('disconnected');

	async function loadHLS() {
		if (!browser || !src) return;

		// Build HLS URL
		const url = new URL('/api/stream.m3u8', window.location.href);
		url.searchParams.set('src', src);
		if (mp4) {
			url.searchParams.set('mp4', '');
		}

		isLoading = true;
		error = null;
		connectionStatus = 'connecting';

		try {
			// Load HLS.js dynamically
			const Hls = (await import('hls.js')).default;

			if (Hls.isSupported()) {
				// Use HLS.js for browsers that support it
				hls = new Hls({
					enableWorker: true,
					lowLatencyMode: true,
					backBufferLength: 30
				});

				hls.loadSource(url.toString());
				hls.attachMedia(videoElement);

				hls.on(Hls.Events.MEDIA_ATTACHED, () => {
					console.log('HLS media attached');
				});

				hls.on(Hls.Events.MANIFEST_PARSED, () => {
					console.log('HLS manifest parsed');
					connectionStatus = 'connected';
					videoElement.play().catch((e) => console.warn('Autoplay failed:', e));
				});

				hls.on(Hls.Events.ERROR, (event: any, data: any) => {
					console.error('HLS error:', data);
					if (data.fatal) {
						connectionStatus = 'error';
						error = `HLS Error: ${data.type} - ${data.details}`;
						switch (data.type) {
							case Hls.ErrorTypes.NETWORK_ERROR:
								// Try to recover network errors
								hls.startLoad();
								break;
							case Hls.ErrorTypes.MEDIA_ERROR:
								hls.recoverMediaError();
								break;
							default:
								// Cannot recover
								hls.destroy();
								hls = null;
								break;
						}
					}
				});
			} else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
				// Use native HLS support (Safari)
				videoElement.src = url.toString();
				videoElement.addEventListener('loadstart', () => {
					connectionStatus = 'connected';
				});
				videoElement.addEventListener('error', () => {
					connectionStatus = 'error';
					error = 'Failed to load HLS stream';
				});
			} else {
				connectionStatus = 'error';
				error = 'HLS is not supported by this browser';
			}
		} catch (e) {
			connectionStatus = 'error';
			error = e instanceof Error ? e.message : 'Failed to load HLS';
			console.error('HLS loading failed:', e);
		} finally {
			isLoading = false;
		}
	}

	function disconnect() {
		if (hls) {
			hls.destroy();
			hls = null;
		}
		if (videoElement) {
			videoElement.src = '';
		}
		connectionStatus = 'disconnected';
		error = null;
	}

	function reconnect() {
		disconnect();
		loadHLS();
	}

	function getStatusColor() {
		switch (connectionStatus) {
			case 'connected':
				return 'text-green-500';
			case 'connecting':
				return 'text-yellow-500';
			case 'error':
				return 'text-red-500';
			default:
				return 'text-gray-500';
		}
	}

	onMount(() => {
		if (src) {
			loadHLS();
		}

		return () => {
			disconnect();
		};
	});
</script>

<svelte:head>
	<title>HLS Player - go2rtc</title>
	<style>
		body {
			margin: 0 !important;
			padding: 0 !important;
			background-color: black;
			overflow: hidden;
		}
	</style>
</svelte:head>

<div class="fixed inset-0 bg-black">
	<!-- Video element -->
	<video
		bind:this={videoElement}
		autoplay
		controls
		playsinline
		muted
		class="h-full w-full object-contain"
	>
		Your browser does not support the video tag.
	</video>

	<!-- Controls overlay -->
	<div class="absolute top-4 left-4 z-10 flex gap-2">
		<Button variant="secondary" size="sm" onclick={() => window.history.back()}>← Back</Button>

		{#if connectionStatus === 'error'}
			<Button variant="default" size="sm" onclick={reconnect} disabled={isLoading}>
				{isLoading ? 'Connecting...' : 'Retry'}
			</Button>
		{:else if connectionStatus === 'connected'}
			<Button variant="destructive" size="sm" onclick={disconnect}>Disconnect</Button>
		{/if}
	</div>

	<!-- Status overlay -->
	<div class="absolute top-4 right-4 z-10">
		<div class="flex items-center gap-2 rounded bg-black/50 px-3 py-1 text-sm text-white">
			<div
				class="h-2 w-2 rounded-full {getStatusColor()} {connectionStatus === 'connecting'
					? 'animate-pulse'
					: ''}"
			></div>
			<span class="capitalize">{connectionStatus}</span>
			{#if src}
				<span class="opacity-70">| {src}</span>
			{/if}
			{#if mp4}
				<span class="opacity-70">| fMP4</span>
			{:else}
				<span class="opacity-70">| TS</span>
			{/if}
		</div>
	</div>

	<!-- Error overlay -->
	{#if error}
		<div class="absolute inset-0 flex items-center justify-center">
			<div class="max-w-md rounded-lg bg-red-900/90 p-6 text-center text-white backdrop-blur-sm">
				<h2 class="mb-4 text-xl font-bold">Playback Error</h2>
				<p class="mb-4">{error}</p>
				<div class="flex justify-center gap-2">
					<Button variant="outline" onclick={reconnect}>Retry</Button>
					<Button variant="outline" onclick={() => window.history.back()}>Go Back</Button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Help overlay -->
	{#if !src}
		<div class="absolute inset-0 flex items-center justify-center">
			<div class="max-w-md rounded-lg bg-white/10 p-6 text-center text-white backdrop-blur-sm">
				<h2 class="mb-4 text-xl font-bold">HLS Player</h2>
				<p class="mb-4">No stream source specified. Add parameters to the URL:</p>
				<div class="space-y-2 text-left text-sm">
					<div><code>?src=stream_name</code> - Stream to play</div>
					<div><code>&mp4</code> - Use fMP4 format (optional)</div>
				</div>
				<div class="mt-4">
					<Button variant="outline" onclick={() => (window.location.href = '/')}>
						← Back to Streams
					</Button>
				</div>
			</div>
		</div>
	{/if}
</div>

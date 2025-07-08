<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import shaka from 'shaka-player/dist/shaka-player.compiled.js';

	type Props = {
		streamName: string;
		mode?: string[];
		class?: string;
		autoplay?: boolean;
		muted?: boolean;
	};

	let {
		streamName,
		mode = ['mjpeg', 'hls', 'mse', 'webrtc'],
		class: className = '',
		autoplay = true,
		muted = true
	}: Props = $props();

	let videoElement: HTMLVideoElement;
	let player: any;
	let error = $state<string | null>(null);
	let isLoading = $state(true);
	let isConnected = $state(false);
	let currentMode = $state<string>('');

	onMount(async () => {
		if (!browser) return;

		try {
			// Install Shaka Player polyfills
			shaka.polyfill.installAll();

			// Check browser support
			if (!shaka.Player.isBrowserSupported()) {
				error = 'Browser not supported for video streaming';
				isLoading = false;
				return;
			}

			// Initialize player
			player = new shaka.Player(videoElement);

			// Set up event listeners
			player.addEventListener('error', onPlayerError);
			player.addEventListener('buffering', onBuffering);

			// Try different streaming modes in order of preference
			await initializeStream();
		} catch (err) {
			console.error('Failed to initialize stream player:', err);
			error = err instanceof Error ? err.message : 'Failed to initialize player';
			isLoading = false;
		}
	});

	onDestroy(() => {
		if (player) {
			player.destroy();
		}
	});

	async function initializeStream() {
		isLoading = true;
		error = null;

		// Try modes in order
		for (const streamMode of mode) {
			try {
				const success = await tryStreamMode(streamMode);
				if (success !== false) {
					currentMode = streamMode;
					isConnected = true;
					isLoading = false;
					return;
				}
			} catch (err) {
				console.warn(`Failed to connect with ${streamMode}:`, err);
				continue;
			}
		}

		// If all modes failed
		error = 'Failed to connect with any streaming mode';
		isLoading = false;
	}

	async function tryStreamMode(streamMode: string) {
		const encodedStreamName = encodeURIComponent(streamName);

		switch (streamMode) {
			case 'hls':
				// Try different HLS approaches
				try {
					// First try the direct HLS endpoint
					const hlsUrl = `/api/stream.m3u8?src=${encodedStreamName}`;
					await player.load(hlsUrl);
				} catch (err) {
					// Fallback: try WebSocket-based HLS (like original implementation)
					console.warn('Direct HLS failed, trying WebSocket approach:', err);
					await tryWebSocketHLS(encodedStreamName);
				}
				break;

			case 'mse':
				// MSE mode using WebSocket (like original)
				await tryWebSocketMSE(encodedStreamName);
				break;

			case 'webrtc':
				// WebRTC mode - needs custom implementation
				throw new Error('WebRTC mode not yet implemented');

			case 'mjpeg':
				// MJPEG fallback - use video src directly (no Shaka needed)
				if (videoElement) {
					const mjpegUrl = `/api/stream.mjpeg?src=${encodedStreamName}`;
					console.log('Trying MJPEG:', mjpegUrl);

					// Set up event listeners for debugging
					const onLoadStart = () => console.log('MJPEG: loadstart');
					const onCanPlay = () => console.log('MJPEG: canplay');
					const onError = (e: any) => console.error('MJPEG error:', e);

					videoElement.addEventListener('loadstart', onLoadStart);
					videoElement.addEventListener('canplay', onCanPlay);
					videoElement.addEventListener('error', onError);

					videoElement.src = mjpegUrl;
					videoElement.load();

					// Return success immediately for MJPEG (it's a stream, not a discrete load)
					return true;
				}
				throw new Error('Video element not available for MJPEG');

			default:
				throw new Error(`Unknown streaming mode: ${streamMode}`);
		}
	}

	async function tryWebSocketHLS(encodedStreamName: string) {
		// This would connect to WebSocket and get HLS URL dynamically
		// For now, let's try a simpler approach
		throw new Error('WebSocket HLS not yet implemented');
	}

	async function tryWebSocketMSE(encodedStreamName: string) {
		// This would connect to WebSocket and handle MSE streaming
		throw new Error('WebSocket MSE not yet implemented');
	}

	function onPlayerError(event: any) {
		console.error('Player error:', event.detail);
		error = event.detail?.message || 'Streaming error occurred';
		isConnected = false;
	}

	function onBuffering(event: any) {
		isLoading = event.buffering;
	}

	async function retry() {
		await initializeStream();
	}
</script>

<div class="relative {className}">
	<video
		bind:this={videoElement}
		class="h-full w-full bg-black"
		{autoplay}
		{muted}
		controls
		playsinline
	></video>

	<!-- Loading overlay -->
	{#if isLoading}
		<div class="absolute inset-0 flex items-center justify-center bg-black/50">
			<div class="flex items-center gap-2 text-white">
				<div
					class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
				></div>
				<span class="text-sm">Connecting...</span>
			</div>
		</div>
	{/if}

	<!-- Error overlay -->
	{#if error}
		<div class="absolute inset-0 flex items-center justify-center bg-black/75">
			<div class="p-4 text-center text-white">
				<div class="mb-2 text-red-400">⚠️ Stream Error</div>
				<div class="mb-3 text-sm">{error}</div>
				<button
					onclick={retry}
					class="rounded bg-blue-600 px-3 py-1 text-sm transition-colors hover:bg-blue-700"
				>
					Retry
				</button>
			</div>
		</div>
	{/if}

	<!-- Stream info overlay (optional) -->
	{#if isConnected && !error && !isLoading}
		<div class="absolute top-2 left-2 rounded bg-black/50 px-2 py-1 text-xs text-white">
			{streamName} ({currentMode})
		</div>
	{/if}
</div>

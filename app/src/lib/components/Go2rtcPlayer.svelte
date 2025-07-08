<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	type Props = {
		streamName: string;
		class?: string;
	};

	let { streamName, class: className = '' }: Props = $props();
	let containerElement: HTMLDivElement;
	let videoElement: any; // Will be the VideoRTC custom element
	let isLoading = $state(true);
	let errorMessage = $state('');

	onMount(async () => {
		if (!browser) return;

		try {
			console.log(`[${streamName}] Starting Go2rtc player initialization`);
			
			// Load the original VideoRTC implementation
			await loadVideoRTC();
			
			// Create video-stream element
			videoElement = document.createElement('video-stream');
			videoElement.style.width = '100%';
			videoElement.style.height = '100%';
			
			// Set the WebSocket source URL - use the exact pattern from original stream.html
			const wsUrl = `/api/ws?src=${encodeURIComponent(streamName)}`;
			console.log(`[${streamName}] Connecting to WebSocket:`, wsUrl);
			
			// Configure the element first
			videoElement.mode = 'webrtc,mse,hls,mjpeg'; // All supported modes
			videoElement.background = false; // Don't run in background
			
			// Set up event listeners to track loading states
			videoElement.addEventListener('loadstart', () => {
				console.log(`[${streamName}] Video loadstart`);
				isLoading = true;
			});
			
			videoElement.addEventListener('canplay', () => {
				console.log(`[${streamName}] Video canplay`);
				isLoading = false;
				errorMessage = '';
			});
			
			videoElement.addEventListener('playing', () => {
				console.log(`[${streamName}] Video playing`);
				isLoading = false;
			});
			
			videoElement.addEventListener('error', (e: Event) => {
				console.error(`[${streamName}] Video error:`, e);
				errorMessage = `Video error: ${(e as any).message || 'Unknown error'}`;
				isLoading = false;
			});
			
			// Append to DOM first, then set src (important for custom elements)
			containerElement.appendChild(videoElement);
			
			// Set source after element is in DOM
			videoElement.src = wsUrl;
			
			// Monitor connection state
			setTimeout(() => {
				console.log(`[${streamName}] Element state after 3s:`, {
					wsState: videoElement.wsState,
					pcState: videoElement.pcState,
					connected: videoElement.isConnected,
					hasVideo: !!videoElement.querySelector('video')
				});
				
				if (videoElement.wsState === WebSocket.CLOSED && videoElement.pcState === WebSocket.CLOSED) {
					errorMessage = 'Failed to connect to stream';
					isLoading = false;
				}
			}, 3000);
			
		} catch (err) {
			console.error(`[${streamName}] Failed to initialize:`, err);
			errorMessage = `Initialization failed: ${err instanceof Error ? err.message : 'Unknown error'}`;
			isLoading = false;
		}
	});

	onDestroy(() => {
		if (videoElement) {
			// Clean disconnect
			if (typeof videoElement.ondisconnect === 'function') {
				videoElement.ondisconnect();
			}
			if (containerElement.contains(videoElement)) {
				containerElement.removeChild(videoElement);
			}
		}
	});

	async function loadVideoRTC() {
		// Check if already loaded
		if (window.customElements.get('video-stream')) {
			console.log('video-stream custom element already registered');
			return;
		}

		try {
			// Import the video-stream.js which will register the custom element
			// @ts-ignore - Dynamic import of JS file from static directory
			await import('/static/www/video-stream.js');
			console.log('video-stream.js loaded from static files');
			
			// Wait a moment for custom element registration
			await new Promise(resolve => setTimeout(resolve, 100));
			
			if (!window.customElements.get('video-stream')) {
				throw new Error('video-stream custom element not registered after import');
			}
		} catch (err) {
			console.error('Failed to load video-stream.js:', err);
			// Fallback: try from lib directory
			try {
				await import('$lib/video-stream.js');
				console.log('video-stream.js loaded from lib directory');
			} catch (fallbackErr) {
				console.error('Fallback import also failed:', fallbackErr);
				throw new Error(`Could not load video-stream.js: ${err}`);
			}
		}
	}
</script>

<div bind:this={containerElement} class="relative {className}">
	<!-- The video-stream element will be inserted here -->
	
	<!-- Loading overlay -->
	{#if isLoading}
		<div class="absolute inset-0 flex items-center justify-center bg-black/50">
			<div class="flex items-center gap-2 text-white">
				<div class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
				<span class="text-sm">Loading {streamName}...</span>
			</div>
		</div>
	{/if}

	<!-- Error overlay -->
	{#if errorMessage}
		<div class="absolute inset-0 flex items-center justify-center bg-black/75">
			<div class="p-4 text-center text-white">
				<div class="mb-2 text-red-400">⚠️ Stream Error</div>
				<div class="mb-3 text-sm">{errorMessage}</div>
				<button
					onclick={() => window.location.reload()}
					class="rounded bg-blue-600 px-3 py-1 text-sm transition-colors hover:bg-blue-700"
				>
					Retry
				</button>
			</div>
		</div>
	{/if}
</div>
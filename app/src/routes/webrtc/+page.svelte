<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';

	// Get parameters from URL
	let src = $derived(page.url.searchParams.get('src'));
	let dst = $derived(page.url.searchParams.get('dst'));
	let media = $derived(page.url.searchParams.get('media') || 'video+audio');

	let videoElement: HTMLVideoElement;
	let localTracks: MediaStreamTrack[] = [];
	let pc: RTCPeerConnection | null = null;
	let ws: WebSocket | null = null;
	let isConnecting = $state(false);
	let connectionStatus = $state('disconnected');

	async function getMediaTracks(
		mediaType: 'user' | 'display',
		constraints: MediaStreamConstraints
	): Promise<MediaStreamTrack[]> {
		try {
			const stream =
				mediaType === 'user'
					? await navigator.mediaDevices.getUserMedia(constraints)
					: await navigator.mediaDevices.getDisplayMedia(constraints);
			return stream.getTracks();
		} catch (e) {
			console.warn('Failed to get media tracks:', e);
			return [];
		}
	}

	async function createPeerConnection(mediaMode: string): Promise<RTCPeerConnection> {
		const peerConnection = new RTCPeerConnection({
			iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
		});

		localTracks = [];

		// Handle outgoing media (camera/microphone/display)
		if (/camera|microphone/.test(mediaMode)) {
			const tracks = await getMediaTracks('user', {
				video: mediaMode.includes('camera'),
				audio: mediaMode.includes('microphone')
			});
			tracks.forEach((track) => {
				peerConnection.addTransceiver(track, { direction: 'sendonly' });
				if (track.kind === 'video') localTracks.push(track);
			});
		}

		if (mediaMode.includes('display')) {
			const tracks = await getMediaTracks('display', {
				video: true,
				audio: mediaMode.includes('speaker')
			});
			tracks.forEach((track) => {
				peerConnection.addTransceiver(track, { direction: 'sendonly' });
				if (track.kind === 'video') localTracks.push(track);
			});
		}

		// Handle incoming media (video/audio)
		if (/video|audio/.test(mediaMode)) {
			const receiveTracks = ['video', 'audio']
				.filter((kind) => mediaMode.includes(kind))
				.map(
					(kind) => peerConnection.addTransceiver(kind, { direction: 'recvonly' }).receiver.track
				);
			localTracks.push(...receiveTracks);
		}

		// Set video element source
		if (videoElement) {
			videoElement.srcObject = new MediaStream(localTracks);
		}

		return peerConnection;
	}

	async function connect() {
		if (isConnecting || (!src && !dst)) return;

		isConnecting = true;
		connectionStatus = 'connecting';

		try {
			pc = await createPeerConnection(media);

			// Build WebSocket URL
			const streamParam = src || dst;
			if (!streamParam) return;

			const wsUrl = new URL('/api/ws', window.location.href);
			wsUrl.searchParams.set(src ? 'src' : 'dst', streamParam);
			wsUrl.protocol = wsUrl.protocol.replace('http', 'ws');

			ws = new WebSocket(wsUrl.toString());

			ws.addEventListener('open', async () => {
				connectionStatus = 'connected';

				if (!pc) return;

				pc.addEventListener('icecandidate', (ev) => {
					if (!ev.candidate || !ws) return;
					const msg = { type: 'webrtc/candidate', value: ev.candidate.candidate };
					ws.send(JSON.stringify(msg));
				});

				// Create and send offer
				const offer = await pc.createOffer();
				await pc.setLocalDescription(offer);
				if (ws && pc.localDescription) {
					const msg = { type: 'webrtc/offer', value: pc.localDescription.sdp };
					ws.send(JSON.stringify(msg));
				}
			});

			ws.addEventListener('message', async (ev) => {
				if (!pc) return;

				const msg = JSON.parse(ev.data);
				if (msg.type === 'webrtc/candidate') {
					await pc.addIceCandidate({ candidate: msg.value, sdpMid: '0' });
				} else if (msg.type === 'webrtc/answer') {
					await pc.setRemoteDescription({ type: 'answer', sdp: msg.value });
				}
			});

			ws.addEventListener('close', () => {
				connectionStatus = 'disconnected';
				cleanup();
			});

			ws.addEventListener('error', (error) => {
				console.error('WebSocket error:', error);
				connectionStatus = 'error';
				cleanup();
			});
		} catch (error) {
			console.error('Connection failed:', error);
			connectionStatus = 'error';
			cleanup();
		} finally {
			isConnecting = false;
		}
	}

	function disconnect() {
		cleanup();
		connectionStatus = 'disconnected';
	}

	function cleanup() {
		if (ws) {
			ws.close();
			ws = null;
		}
		if (pc) {
			pc.close();
			pc = null;
		}
		localTracks.forEach((track) => track.stop());
		localTracks = [];
		if (videoElement) {
			videoElement.srcObject = null;
		}
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
		// Auto-connect if parameters are present
		if ((src || dst) && media) {
			connect();
		}

		// Cleanup on unmount
		return cleanup;
	});
</script>

<svelte:head>
	<title>WebRTC Viewer - go2rtc</title>
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

		{#if connectionStatus === 'disconnected'}
			<Button variant="default" size="sm" onclick={connect} disabled={isConnecting}>
				{isConnecting ? 'Connecting...' : 'Connect'}
			</Button>
		{:else}
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
			{:else if dst}
				<span class="opacity-70">| Publishing to {dst}</span>
			{/if}
			<span class="opacity-70">| {media}</span>
		</div>
	</div>

	<!-- Help overlay -->
	{#if !src && !dst}
		<div class="absolute inset-0 flex items-center justify-center">
			<div class="max-w-md rounded-lg bg-white/10 p-6 text-center text-white backdrop-blur-sm">
				<h2 class="mb-4 text-xl font-bold">WebRTC Viewer</h2>
				<p class="mb-4">No stream source specified. Add parameters to the URL:</p>
				<div class="space-y-2 text-left text-sm">
					<div><code>?src=stream_name</code> - View a stream</div>
					<div><code>?dst=stream_name</code> - Publish to stream</div>
					<div><code>&media=video+audio</code> - Media type</div>
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

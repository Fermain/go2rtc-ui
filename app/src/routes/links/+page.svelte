<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { onMount } from 'svelte';

	// Get stream source from URL parameter
	let streamSrc = $derived(page.url.searchParams.get('src'));
	let encodedStreamSrc = $derived(streamSrc ? encodeURIComponent(streamSrc) : '');

	// Server config data
	let serverConfig = $state<any>(null);
	let rtspHost = $state('localhost:8554');

	// Two-way audio state
	let audioAction = $state('file');
	let audioUrl = $state('');

	// Stream publishing state
	let publishUrl = $state('');

	// WebRTC sharing state
	let webrtcMedia = $state('video+audio');
	let shareData = $state<any>(null);

	// Generate various stream URLs
	let streamUrls = $derived(() => {
		if (!streamSrc) return {};
		return {
			webrtc: `/api/webrtc?src=${encodedStreamSrc}`,
			hls: `/api/stream.m3u8?src=${encodedStreamSrc}`,
			mjpeg: `/api/stream.mjpeg?src=${encodedStreamSrc}`,
			mp4: `/api/stream.mp4?src=${encodedStreamSrc}`,
			mpegts: `/api/stream.ts?src=${encodedStreamSrc}`,
			flv: `/api/stream.flv?src=${encodedStreamSrc}`,
			websocket: `/api/ws?src=${encodedStreamSrc}`,
			rtsp: `rtsp://${rtspHost}/${streamSrc}`,
			rtspMp4: `rtsp://${rtspHost}/${streamSrc}?mp4`,
			rtspAll: `rtsp://${rtspHost}/${streamSrc}?video=all&audio=all`,
			frame: `/api/frame.jpeg?src=${encodedStreamSrc}`,
			frameMp4: `/api/frame.mp4?src=${encodedStreamSrc}`,
			info: `/api/streams?src=${encodedStreamSrc}`
		};
	});

	function copyToClipboard(text: string) {
		navigator.clipboard.writeText(text).then(() => {
			console.log('Copied to clipboard:', text);
		});
	}

	function getFullUrl(path: string): string {
		return new URL(path, window.location.href).toString();
	}

	async function sendAudio() {
		if (!streamSrc || !audioUrl) return;

		const url = new URL('/api/ffmpeg', window.location.href);
		url.searchParams.set('dst', streamSrc);
		url.searchParams.set(audioAction, audioUrl);

		try {
			await fetch(url, { method: 'POST' });
			console.log('Audio command sent');
		} catch (error) {
			console.error('Failed to send audio:', error);
		}
	}

	async function publishStream() {
		if (!streamSrc || !publishUrl) return;

		const url = new URL('/api/streams', window.location.href);
		url.searchParams.set('src', streamSrc);
		url.searchParams.set('dst', publishUrl);

		try {
			await fetch(url, { method: 'POST' });
			console.log('Stream publishing started');
		} catch (error) {
			console.error('Failed to publish stream:', error);
		}
	}

	async function shareAdd() {
		if (!streamSrc) return;

		const url = new URL('/api/webtorrent', window.location.href);
		url.searchParams.set('src', streamSrc);

		try {
			const response = await fetch(url, { method: 'POST', cache: 'no-cache' });
			shareData = await response.json();
		} catch (error) {
			console.error('Failed to create share:', error);
		}
	}

	async function shareDelete() {
		if (!streamSrc) return;

		const url = new URL('/api/webtorrent', window.location.href);
		url.searchParams.set('src', streamSrc);

		try {
			await fetch(url, { method: 'DELETE', cache: 'no-cache' });
			shareData = null;
		} catch (error) {
			console.error('Failed to delete share:', error);
		}
	}

	function getShareLink(): string {
		if (!shareData) return '';
		return `https://alexxit.github.io/go2rtc/#share=${shareData.share}&pwd=${shareData.pwd}&media=${webrtcMedia}`;
	}

	function getWebRTCUrl(): string {
		const direction = webrtcMedia.includes('video') || webrtcMedia === 'audio' ? 'src' : 'dst';
		return `/webrtc?${direction}=${encodedStreamSrc}&media=${webrtcMedia}`;
	}

	onMount(async () => {
		// Load server config
		try {
			const response = await fetch('/api');
			serverConfig = await response.json();

			// Extract RTSP host and port
			if (serverConfig.host && serverConfig.rtsp?.listen) {
				const host = serverConfig.host.match(/^[^:]+/)?.[0] || 'localhost';
				const port = serverConfig.rtsp.listen.match(/[0-9]+$/)?.[0] || '8554';
				rtspHost = `${host}:${port}`;
			}
		} catch (error) {
			console.error('Failed to load server config:', error);
		}

		// Check for existing share
		if (streamSrc) {
			try {
				const url = new URL('/api/webtorrent', window.location.href);
				url.searchParams.set('src', streamSrc);
				const response = await fetch(url, { method: 'GET', cache: 'no-cache' });
				if (response.ok) {
					shareData = await response.json();
				}
			} catch (error) {
				console.error('Failed to check share status:', error);
			}
		}
	});
</script>

<svelte:head>
	<title>{streamSrc ? `${streamSrc} Links - go2rtc` : 'Stream Links - go2rtc'}</title>
</svelte:head>

<div class="container mx-auto space-y-6 p-6">
	{#if streamSrc}
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold">Stream Links</h1>
				<p class="text-muted-foreground">
					Various access URLs for stream: <strong>{streamSrc}</strong>
				</p>
			</div>
			<Button variant="outline" onclick={() => window.history.back()}>← Back</Button>
		</div>

		<div class="grid gap-6 lg:grid-cols-2">
			<!-- Any Codec -->
			<Card>
				<CardHeader>
					<CardTitle>Any Codec in Source</CardTitle>
					<CardDescription>Universal access with auto-detection</CardDescription>
				</CardHeader>
				<CardContent class="space-y-3">
					<div class="rounded border p-3">
						<div class="mb-1 flex items-center justify-between">
							<span class="font-medium">Stream Viewer</span>
							<Button
								size="sm"
								variant="outline"
								onclick={() =>
									streamSrc && window.open(`/stream?src=${encodedStreamSrc}`, '_blank')}
							>
								Open
							</Button>
						</div>
						<p class="text-muted-foreground mb-2 text-sm">
							Auto-select mode / All browsers / H264, H265, MJPEG, AAC, OPUS
						</p>
					</div>
					<div class="rounded border p-3">
						<div class="mb-1 flex items-center justify-between">
							<span class="font-medium">Stream Info (JSON)</span>
							<Button
								size="sm"
								variant="outline"
								onclick={() => streamUrls().info && window.open(streamUrls().info, '_blank')}
							>
								Open
							</Button>
						</div>
						<p class="text-muted-foreground mb-2 text-sm">Active connections and stream details</p>
					</div>
				</CardContent>
			</Card>

			<!-- RTSP Links -->
			<Card>
				<CardHeader>
					<CardTitle>RTSP Protocol</CardTitle>
					<CardDescription>Direct RTSP access for external players</CardDescription>
				</CardHeader>
				<CardContent class="space-y-3">
					{#each [{ name: 'RTSP Standard', url: streamUrls().rtsp, desc: 'One video + one audio track' }, { name: 'RTSP for MP4', url: streamUrls().rtspMp4, desc: 'For recording (Hass, Frigate) / H264, H265, AAC' }, { name: 'RTSP All Tracks', url: streamUrls().rtspAll, desc: 'All available video and audio tracks' }] as link}
						<div class="rounded border p-3">
							<div class="mb-1 flex items-center justify-between">
								<span class="font-medium">{link.name}</span>
								<Button size="sm" variant="outline" onclick={() => link.url && copyToClipboard(link.url)}>
									Copy
								</Button>
							</div>
							<p class="text-muted-foreground mb-2 text-sm">{link.desc}</p>
							<code class="bg-muted block rounded p-1 text-xs break-all">{link.url}</code>
						</div>
					{/each}
					<div class="bg-muted mt-3 rounded p-3">
						<p class="mb-1 text-sm font-medium">FFplay command:</p>
						<code class="text-xs"
							>ffplay -fflags nobuffer -flags low_delay -rtsp_transport tcp "{streamUrls()
								.rtsp}"</code
						>
					</div>
				</CardContent>
			</Card>

			<!-- H264/H265 Specific -->
			<Card>
				<CardHeader>
					<CardTitle>H264/H265 Streams</CardTitle>
					<CardDescription>Encoded video stream formats</CardDescription>
				</CardHeader>
				<CardContent class="space-y-3">
					{#each [{ name: 'WebRTC Stream', url: `/stream?src=${encodedStreamSrc}&mode=webrtc`, desc: 'Low latency / All browsers / H264, OPUS' }, { name: 'MSE Stream', url: `/stream?src=${encodedStreamSrc}&mode=mse`, desc: 'Chrome, Firefox, Safari / H264, H265, AAC' }, { name: 'MP4 Stream', url: streamUrls().mp4, desc: 'Direct MP4 / Chrome, Firefox / H264, H265, AAC' }, { name: 'HLS Stream', url: streamUrls().hls, desc: 'HTTP Live Streaming / Safari, Chrome mobile' }] as link}
						<div class="rounded border p-3">
							<div class="mb-1 flex items-center justify-between">
								<span class="font-medium">{link.name}</span>
								<div class="flex gap-2">
									<Button
										size="sm"
										variant="outline"
										onclick={() => window.open(link.url, '_blank')}
									>
										Open
									</Button>
									<Button
										size="sm"
										variant="outline"
										onclick={() => link.url && copyToClipboard(getFullUrl(link.url))}
									>
										Copy
									</Button>
								</div>
							</div>
							<p class="text-muted-foreground text-sm">{link.desc}</p>
						</div>
					{/each}
				</CardContent>
			</Card>

			<!-- MJPEG Specific -->
			<Card>
				<CardHeader>
					<CardTitle>MJPEG/JPEG Streams</CardTitle>
					<CardDescription>Motion JPEG and snapshots</CardDescription>
				</CardHeader>
				<CardContent class="space-y-3">
					{#each [{ name: 'MJPEG Viewer', url: `/stream?src=${encodedStreamSrc}&mode=mjpeg`, desc: 'MJPEG mode / All browsers' }, { name: 'MJPEG Stream', url: streamUrls().mjpeg, desc: 'Direct MJPEG stream' }, { name: 'JPEG Snapshot', url: streamUrls().frame, desc: 'Single frame capture' }] as link}
						<div class="rounded border p-3">
							<div class="mb-1 flex items-center justify-between">
								<span class="font-medium">{link.name}</span>
								<div class="flex gap-2">
									<Button
										size="sm"
										variant="outline"
										onclick={() => window.open(link.url, '_blank')}
									>
										Open
									</Button>
									<Button
										size="sm"
										variant="outline"
										onclick={() => link.url && copyToClipboard(getFullUrl(link.url))}
									>
										Copy
									</Button>
								</div>
							</div>
							<p class="text-muted-foreground text-sm">{link.desc}</p>
						</div>
					{/each}
				</CardContent>
			</Card>

			<!-- Two-way Audio -->
			<Card>
				<CardHeader>
					<CardTitle>Play Audio</CardTitle>
					<CardDescription>Two-way audio support for cameras</CardDescription>
				</CardHeader>
				<CardContent class="space-y-4">
					<div class="space-y-2">
						<label class="flex items-center space-x-2">
							<input type="radio" bind:group={audioAction} value="file" />
							<span class="text-sm">File - play remote or local file</span>
						</label>
						<label class="flex items-center space-x-2">
							<input type="radio" bind:group={audioAction} value="live" />
							<span class="text-sm">Live - play remote live stream</span>
						</label>
						<label class="flex items-center space-x-2">
							<input type="radio" bind:group={audioAction} value="text" />
							<span class="text-sm">Text - Text To Speech (if FFmpeg supports)</span>
						</label>
					</div>
					<div class="flex gap-2">
						<Input bind:value={audioUrl} placeholder="path / url / text" class="flex-1" />
						<Button onclick={sendAudio} disabled={!audioUrl}>Send</Button>
					</div>
				</CardContent>
			</Card>

			<!-- Stream Publishing -->
			<Card>
				<CardHeader>
					<CardTitle>Publish Stream</CardTitle>
					<CardDescription>Broadcast to external services</CardDescription>
				</CardHeader>
				<CardContent class="space-y-4">
					<div class="space-y-1 text-sm">
						<div>
							<strong>YouTube:</strong> rtmps://xxx.rtmp.youtube.com/live2/xxxx-xxxx-xxxx-xxxx
						</div>
						<div>
							<strong>Telegram:</strong> rtmps://xxx-x.rtmp.t.me/s/xxxxxxxxxx:xxxxxxxxxxxxxxxxxxxxxx
						</div>
					</div>
					<div class="flex gap-2">
						<Input bind:value={publishUrl} placeholder="RTMP/RTMPS URL" class="flex-1" />
						<Button onclick={publishStream} disabled={!publishUrl}>Publish</Button>
					</div>
				</CardContent>
			</Card>

			<!-- WebRTC Magic -->
			<Card>
				<CardHeader>
					<CardTitle>WebRTC Magic</CardTitle>
					<CardDescription>Interactive WebRTC modes</CardDescription>
				</CardHeader>
				<CardContent class="space-y-4">
					<div class="space-y-2">
						<label class="flex items-center space-x-2">
							<input type="radio" bind:group={webrtcMedia} value="video+audio" />
							<span class="text-sm">Video + Audio - Simple viewer</span>
						</label>
						<label class="flex items-center space-x-2">
							<input type="radio" bind:group={webrtcMedia} value="video+audio+microphone" />
							<span class="text-sm">Video + Audio + Microphone - Two way audio</span>
						</label>
						<label class="flex items-center space-x-2">
							<input type="radio" bind:group={webrtcMedia} value="camera+microphone" />
							<span class="text-sm">Camera + Microphone - Stream from browser</span>
						</label>
						<label class="flex items-center space-x-2">
							<input type="radio" bind:group={webrtcMedia} value="display+speaker" />
							<span class="text-sm">Display + Speaker - Broadcast software</span>
						</label>
					</div>

					<div class="space-y-2">
						<Button
							variant="outline"
							class="w-full justify-start"
							onclick={() => window.open(getWebRTCUrl(), '_blank')}
						>
							🎥 Local WebRTC Viewer
						</Button>

						<div class="flex gap-2">
							{#if !shareData}
								<Button variant="outline" onclick={shareAdd} class="flex-1">
									📤 Create Share Link
								</Button>
							{:else}
								<Button
									variant="outline"
									onclick={() => copyToClipboard(getShareLink())}
									class="flex-1"
								>
									📋 Copy Share Link
								</Button>
								<Button variant="outline" onclick={shareDelete}>🗑️ Delete</Button>
							{/if}
						</div>

						{#if shareData}
							<p class="text-muted-foreground text-xs">
								External viewers can access via:
								<a href={getShareLink()} class="underline" target="_blank">
									alexxit.github.io/go2rtc
								</a>
							</p>
						{/if}
					</div>
				</CardContent>
			</Card>

			<!-- Quick Actions -->
			<Card>
				<CardHeader>
					<CardTitle>Quick Actions</CardTitle>
					<CardDescription>Direct links to specialized viewers</CardDescription>
				</CardHeader>
				<CardContent class="space-y-2">
					<Button
						variant="outline"
						class="w-full justify-start"
						onclick={() => streamSrc && window.open(`/webrtc?src=${encodedStreamSrc}`, '_blank')}
					>
						🎮 WebRTC Viewer
					</Button>
					<Button
						variant="outline"
						class="w-full justify-start"
						onclick={() => window.open(`/hls?src=${encodedStreamSrc}`, '_blank')}
					>
						📺 HLS Player
					</Button>
					<Button
						variant="outline"
						class="w-full justify-start"
						onclick={() => window.open('/codecs', '_blank')}
					>
						🔧 Codec Capabilities
					</Button>
					<Button
						variant="outline"
						class="w-full justify-start"
						onclick={() => window.open(`/network?src=${encodedStreamSrc}`, '_blank')}
					>
						🌐 Network Info
					</Button>
				</CardContent>
			</Card>
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
</div>

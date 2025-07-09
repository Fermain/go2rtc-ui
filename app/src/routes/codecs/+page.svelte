<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { onMount } from 'svelte';

	let codecData = $state<string>('Loading codec information...');

	function formatCodecCapabilities(name: string, caps: RTCRtpCapabilities) {
		let output = `${name}\n`;
		caps.codecs.forEach((codec) => {
			const parts = [
				codec.mimeType,
				codec.channels?.toString(),
				codec.clockRate?.toString(),
				codec.sdpFmtpLine
			].filter(Boolean);
			output += `  ${parts.join(' | ')}\n`;
		});
		return output + '\n';
	}

	function testMediaSourceTypes() {
		const types = [
			'video/mp4; codecs="avc1.42401E"',
			'video/mp4; codecs="avc1.42C01E"',
			'video/mp4; codecs="avc1.42E01E"',
			'video/mp4; codecs="avc1.42001E"',
			'video/mp4; codecs="avc1.4D401E"',
			'video/mp4; codecs="avc1.4D001E"',
			'video/mp4; codecs="avc1.640032"',
			'video/mp4; codecs="avc1.640C32"',
			'video/mp4; codecs="avc1.F4001F"',
			'video/mp4; codecs="hvc1.1.6.L93.B0"',
			'video/mp4; codecs="hev1.1.6.L93.B0"',
			'video/mp4; codecs="hev1.2.4.L120.B0"',
			'video/mp4; codecs="flac"',
			'video/mp4; codecs="opus"',
			'video/mp4; codecs="mp3"',
			'video/mp4; codecs="null"',
			'application/vnd.apple.mpegurl'
		];

		const video = document.createElement('video');
		let output = 'MediaSource & Video Element Support\n';

		types.forEach((type) => {
			const mediaSourceSupported =
				'MediaSource' in window && (window as any).MediaSource.isTypeSupported(type);
			const videoElementSupported = video.canPlayType(type);
			output += `${type}\n`;
			output += `  MediaSource: ${mediaSourceSupported}\n`;
			output += `  Video Element: ${videoElementSupported || 'not supported'}\n\n`;
		});

		return output;
	}

	function copyToClipboard() {
		navigator.clipboard
			.writeText(codecData)
			.then(() => {
				console.log('Codec data copied to clipboard');
			})
			.catch((err) => {
				console.error('Failed to copy codec data:', err);
			});
	}

	onMount(() => {
		let output = '';

		// Get WebRTC capabilities
		if (typeof RTCRtpReceiver !== 'undefined' && RTCRtpReceiver.getCapabilities) {
			try {
				const receiverVideo = RTCRtpReceiver.getCapabilities('video');
				const receiverAudio = RTCRtpReceiver.getCapabilities('audio');
				const senderVideo = RTCRtpSender.getCapabilities('video');
				const senderAudio = RTCRtpSender.getCapabilities('audio');

				if (receiverVideo)
					output += formatCodecCapabilities('WebRTC Receiver Video', receiverVideo);
				if (receiverAudio)
					output += formatCodecCapabilities('WebRTC Receiver Audio', receiverAudio);
				if (senderVideo) output += formatCodecCapabilities('WebRTC Sender Video', senderVideo);
				if (senderAudio) output += formatCodecCapabilities('WebRTC Sender Audio', senderAudio);
			} catch (e) {
				output += `WebRTC capabilities error: ${e}\n\n`;
			}
		} else {
			output += 'WebRTC capabilities not available\n\n';
		}

		// Test media source and video element support
		output += testMediaSourceTypes();

		// Browser information
		output += 'Browser Information\n';
		output += `User Agent: ${navigator.userAgent}\n`;
		output += `Platform: ${navigator.platform}\n`;
		output += `Languages: ${navigator.languages?.join(', ') || 'Unknown'}\n`;
		output += `Cookies Enabled: ${navigator.cookieEnabled}\n`;
		output += `Online: ${navigator.onLine}\n\n`;

		// Screen information
		output += 'Display Information\n';
		output += `Screen Resolution: ${screen.width}x${screen.height}\n`;
		output += `Available Resolution: ${screen.availWidth}x${screen.availHeight}\n`;
		output += `Color Depth: ${screen.colorDepth} bits\n`;
		output += `Pixel Depth: ${screen.pixelDepth} bits\n`;
		output += `Device Pixel Ratio: ${window.devicePixelRatio || 1}\n\n`;

		// Media devices
		if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
			navigator.mediaDevices
				.enumerateDevices()
				.then((devices) => {
					const audioInputs = devices.filter((d) => d.kind === 'audioinput').length;
					const audioOutputs = devices.filter((d) => d.kind === 'audiooutput').length;
					const videoInputs = devices.filter((d) => d.kind === 'videoinput').length;

					output += 'Media Devices\n';
					output += `Audio Inputs: ${audioInputs}\n`;
					output += `Audio Outputs: ${audioOutputs}\n`;
					output += `Video Inputs: ${videoInputs}\n\n`;

					codecData = output;
				})
				.catch(() => {
					output += 'Media Devices\nError accessing media devices\n\n';
					codecData = output;
				});
		} else {
			output += 'Media Devices\nNot available\n\n';
			codecData = output;
		}
	});
</script>

<svelte:head>
	<title>Codec Capabilities - go2rtc</title>
</svelte:head>

<div class="container mx-auto space-y-6 p-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold">Codec Capabilities</h1>
			<p class="text-muted-foreground">Browser support for various codecs and formats</p>
		</div>
		<div class="flex gap-2">
			<Button variant="outline" onclick={copyToClipboard}>📋 Copy Data</Button>
			<Button variant="outline" onclick={() => window.history.back()}>← Back</Button>
		</div>
	</div>

	<Card>
		<CardHeader>
			<CardTitle>Codec Support Report</CardTitle>
			<CardDescription>
				Comprehensive analysis of your browser's codec and media format support
			</CardDescription>
		</CardHeader>
		<CardContent>
			<div class="bg-muted rounded-lg p-4">
				<pre
					class="max-h-[70vh] overflow-auto font-mono text-sm whitespace-pre-wrap">{codecData}</pre>
			</div>
		</CardContent>
	</Card>

	<div class="grid gap-4 md:grid-cols-2">
		<Card>
			<CardHeader>
				<CardTitle>What This Shows</CardTitle>
			</CardHeader>
			<CardContent class="space-y-2 text-sm">
				<p>
					<strong>WebRTC Capabilities:</strong> Audio/video codecs supported for real-time communication
				</p>
				<p><strong>MediaSource Support:</strong> Codecs available for MSE streaming</p>
				<p><strong>Video Element:</strong> Native HTML5 video codec support</p>
				<p><strong>Device Info:</strong> Browser, screen, and media device capabilities</p>
			</CardContent>
		</Card>

		<Card>
			<CardHeader>
				<CardTitle>Common Codecs</CardTitle>
			</CardHeader>
			<CardContent class="space-y-2 text-sm">
				<p><strong>H.264 (AVC):</strong> Most compatible video codec</p>
				<p><strong>H.265 (HEVC):</strong> Better compression, limited support</p>
				<p><strong>VP8/VP9:</strong> Google codecs, good WebRTC support</p>
				<p><strong>AAC:</strong> Standard audio codec</p>
				<p><strong>OPUS:</strong> High-quality audio for WebRTC</p>
				<p><strong>MJPEG:</strong> Motion JPEG for IP cameras</p>
			</CardContent>
		</Card>
	</div>
</div>

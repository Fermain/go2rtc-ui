<script lang="ts">
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	// Dummy data for streams
	const dummyStreams = [
		{
			name: 'camera.front_door',
			info: {
				producers: [
					{
						url: 'rtsp://192.168.1.100:554/stream1',
						format: 'rtsp',
						remote_addr: '192.168.1.100:554',
						user_agent: 'ffmpeg/go2rtc',
						recv: 1234567,
						send: 0
					}
				],
				consumers: [
					{
						url: 'webrtc',
						format: 'webrtc',
						remote_addr: '192.168.1.50:51234',
						user_agent: 'Mozilla/5.0',
						recv: 0,
						send: 987654
					},
					{
						url: 'rtsp',
						format: 'rtsp',
						remote_addr: '192.168.1.51:45678',
						user_agent: 'VLC/3.0.18',
						recv: 0,
						send: 456789
					}
				]
			},
			status: 'online'
		},
		{
			name: 'camera.garage',
			info: {
				producers: [
					{
						url: 'rtsp://192.168.1.101:554/stream1',
						format: 'rtsp',
						remote_addr: '192.168.1.101:554',
						user_agent: 'ffmpeg/go2rtc',
						recv: 2345678,
						send: 0
					}
				],
				consumers: []
			},
			status: 'online'
		},
		{
			name: 'camera.backyard',
			info: {
				producers: [],
				consumers: []
			},
			status: 'offline'
		}
	];

	// Selection state
	let selectedStreams = $state<Set<string>>(new Set());
	let isAllSelected = $derived(
		selectedStreams.size === dummyStreams.length && dummyStreams.length > 0
	);
	let isPartiallySelected = $derived(
		selectedStreams.size > 0 && selectedStreams.size < dummyStreams.length
	);

	// Mode selection state
	let modes = $state({
		webrtc: true,
		mse: true,
		hls: true,
		mjpeg: true
	});


	// Auto-refresh interval
	let refreshInterval: number | undefined;

	function toggleAllSelection() {
		if (isAllSelected) {
			selectedStreams = new Set();
		} else {
			selectedStreams = new Set(dummyStreams.map((s) => s.name));
		}
	}

	function toggleStreamSelection(streamName: string) {
		const newSelection = new Set(selectedStreams);
		if (newSelection.has(streamName)) {
			newSelection.delete(streamName);
		} else {
			newSelection.add(streamName);
		}
		selectedStreams = newSelection;
	}

	function viewSelected() {
		if (selectedStreams.size === 0) return;

		const url = new URL('/streams', window.location.href);
		selectedStreams.forEach((stream) => {
			url.searchParams.append('src', stream);
		});

		// Add selected modes
		const selectedModes = Object.entries(modes)
			.filter(([_, enabled]) => enabled)
			.map(([mode]) => mode)
			.join(',');
		url.searchParams.set('mode', selectedModes);

		window.location.href = url.toString();
	}

	async function deleteStream(streamName: string) {
		const message = `Please type the name of the stream "${streamName}" to confirm its deletion from the configuration. This action is irreversible.`;
		const confirmation = prompt(message);

		if (confirmation !== streamName) {
			alert('Stream name does not match. Deletion cancelled.');
			return;
		}

		// TODO: Implement actual delete API call
		console.log(`Would delete stream: ${streamName}`);
	}


	async function refreshStreams() {
		// TODO: Replace with actual API call to refresh stream data
		console.log('Refreshing streams...');
	}

	onMount(() => {
		refreshStreams();
		// Auto-refresh every second
		refreshInterval = window.setInterval(refreshStreams, 1000);
	});

	onDestroy(() => {
		if (refreshInterval) {
			clearInterval(refreshInterval);
		}
	});
</script>

<div class="space-y-4">
	<div class="flex flex-wrap items-center justify-between gap-4">

		<div class="flex flex-wrap items-center gap-4">
			{#if selectedStreams.size > 0}
				<Button size="sm" variant="default" onclick={viewSelected}>Stream</Button>

				<div class="flex items-center gap-2">
					<label class="flex items-center gap-1 text-sm">
						<Checkbox bind:checked={modes.webrtc} />
						webrtc
					</label>
					<label class="flex items-center gap-1 text-sm">
						<Checkbox bind:checked={modes.mse} />
						mse
					</label>
					<label class="flex items-center gap-1 text-sm">
						<Checkbox bind:checked={modes.hls} />
						hls
					</label>
					<label class="flex items-center gap-1 text-sm">
						<Checkbox bind:checked={modes.mjpeg} />
						mjpeg
					</label>
				</div>

				<span class="text-muted-foreground text-sm">{selectedStreams.size} selected</span>
			{/if}
		</div>
	</div>

	<div class="rounded-md border">
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead class="w-12">
						<Checkbox
							checked={isAllSelected}
							indeterminate={isPartiallySelected}
							onCheckedChange={toggleAllSelection}
							aria-label="Select all"
						/>
					</TableHead>
					<TableHead>Name</TableHead>
					<TableHead>Online</TableHead>
					<TableHead>Commands</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{#each dummyStreams as stream}
					<TableRow>
						<TableCell>
							<Checkbox
								checked={selectedStreams.has(stream.name)}
								onCheckedChange={() => toggleStreamSelection(stream.name)}
								aria-label={`Select ${stream.name}`}
							/>
						</TableCell>
						<TableCell class="font-medium">{stream.name}</TableCell>
						<TableCell>
							<div class="flex items-center gap-1 text-sm">
								<a
									href="/api/streams?src={encodeURIComponent(stream.name)}"
									class="hover:underline"
								>
									{stream.info.consumers.length} / info
								</a>
								<span>/</span>
								<a
									href="/api/streams?src={encodeURIComponent(
										stream.name
									)}&video=all&audio=all&microphone"
									class="hover:underline"
								>
									probe
								</a>
								<span>/</span>
								<a href="/network?src={encodeURIComponent(stream.name)}" class="hover:underline">
									net
								</a>
							</div>
						</TableCell>
						<TableCell>
							<div class="flex items-center gap-2">
								<a
									href="/stream?src={encodeURIComponent(stream.name)}"
									class="text-sm hover:underline"
								>
									stream
								</a>
								<a
									href="/links?src={encodeURIComponent(stream.name)}"
									class="text-sm hover:underline"
								>
									links
								</a>
								<button
									onclick={() => deleteStream(stream.name)}
									class="text-destructive text-sm hover:underline"
								>
									delete
								</button>
							</div>
						</TableCell>
					</TableRow>
				{/each}
			</TableBody>
		</Table>
	</div>
</div>

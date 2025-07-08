<script lang="ts">
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	// Types for stream data
	interface StreamProducer {
		url: string;
		format?: string;
		remote_addr?: string;
		user_agent?: string;
		recv?: number;
		send?: number;
	}

	interface StreamConsumer {
		url: string;
		format?: string;
		remote_addr?: string;
		user_agent?: string;
		recv?: number;
		send?: number;
	}

	interface StreamInfo {
		producers: StreamProducer[];
		consumers: StreamConsumer[];
	}

	interface Stream {
		name: string;
		info: StreamInfo;
		status: 'online' | 'offline';
	}

	// Stream data state
	let streams = $state<Stream[]>([]);
	let isLoading = $state(false);
	let error = $state<string | null>(null);

	// Selection state
	let selectedStreams = $state<Set<string>>(new Set());
	let isAllSelected = $derived(selectedStreams.size === streams.length && streams.length > 0);
	let isPartiallySelected = $derived(
		selectedStreams.size > 0 && selectedStreams.size < streams.length
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
	let refreshAttempts = 0;
	const maxRefreshAttempts = 5;

	function toggleAllSelection() {
		if (isAllSelected) {
			selectedStreams = new Set();
		} else {
			selectedStreams = new Set(streams.map((s) => s.name));
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

	async function refreshStreams(isManual = false) {
		if (!browser) return;

		// Don't show loading for auto-refresh unless it's the first load
		if (isManual || streams.length === 0) {
			isLoading = true;
		}

		if (isManual) {
			error = null;
			refreshAttempts = 0;
		}

		try {
			const response = await fetch('/api/streams');
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();

			// Transform the go2rtc response format to our internal format
			const transformedStreams: Stream[] = Object.entries(data).map(([name, info]) => {
				const streamInfo = info as StreamInfo;
				const hasProducers = streamInfo.producers && streamInfo.producers.length > 0;
				const hasConsumers = streamInfo.consumers && streamInfo.consumers.length > 0;

				return {
					name,
					info: {
						producers: streamInfo.producers || [],
						consumers: streamInfo.consumers || []
					},
					status: hasProducers ? 'online' : 'offline'
				};
			});

			streams = transformedStreams;
			refreshAttempts = 0; // Reset attempts on success

			// Clear any previous error
			if (error) {
				error = null;
			}
		} catch (err) {
			refreshAttempts++;
			const errorMessage = err instanceof Error ? err.message : 'Failed to fetch streams';

			// Only show error if manual refresh or if we've exceeded max attempts
			if (isManual || refreshAttempts >= maxRefreshAttempts) {
				error = errorMessage;
			}

			console.error('Error fetching streams:', err);
		} finally {
			isLoading = false;
		}
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

		<div class="flex items-center gap-2">
			<Button size="sm" variant="outline" onclick={() => refreshStreams(true)} disabled={isLoading}>
				{isLoading ? 'Refreshing...' : 'Refresh'}
			</Button>
			{#if error}
				<span class="text-sm text-red-600">Connection error</span>
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
				{#if isLoading}
					<TableRow>
						<TableCell colspan="4" class="py-8 text-center">
							<div class="flex items-center justify-center gap-2">
								<div
									class="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"
								></div>
								Loading streams...
							</div>
						</TableCell>
					</TableRow>
				{:else if error}
					<TableRow>
						<TableCell colspan="4" class="py-8 text-center">
							<div class="text-red-600">
								<p class="font-medium">Error loading streams</p>
								<p class="mt-1 text-sm">{error}</p>
								<Button
									size="sm"
									variant="outline"
									class="mt-2"
									onclick={() => refreshStreams(true)}
								>
									Retry
								</Button>
							</div>
						</TableCell>
					</TableRow>
				{:else if streams.length === 0}
					<TableRow>
						<TableCell colspan="4" class="text-muted-foreground py-8 text-center">
							No streams configured
						</TableCell>
					</TableRow>
				{:else}
					{#each streams as stream}
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
				{/if}
			</TableBody>
		</Table>
	</div>
</div>

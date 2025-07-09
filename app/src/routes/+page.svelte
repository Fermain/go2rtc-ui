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
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { useDeleteStreamMutation, useStreamsQuery } from '$lib/queries/streams.js';
	import type { Stream, StreamInfo } from '$lib/services/api.js';

	// Using Stream type from API service

	// TanStack Query for streams with proper polling
	const streamsQuery = useStreamsQuery(1000); // Poll every second like original

	// Derived state from query
	let streams = $derived($streamsQuery.data || []);
	let isLoading = $derived($streamsQuery.isLoading);
	let isManualRefreshing = $derived($streamsQuery.isFetching && !$streamsQuery.isLoading);
	let error = $derived($streamsQuery.error?.message || null);

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

	// Delete mutation
	const deleteStreamMutation = useDeleteStreamMutation();

	// Platform-aware modifier key display
	let modifierKey = $state('⌘');

	function detectPlatform() {
		if (typeof navigator !== 'undefined') {
			const platform = navigator.platform.toLowerCase();
			modifierKey = platform.includes('mac') ? '⌘' : 'Ctrl';
		}
	}

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

		try {
			await $deleteStreamMutation.mutateAsync(streamName);
			// The mutation will automatically invalidate and refetch the streams list
		} catch (error) {
			console.error('Failed to delete the stream:', error);
			alert(
				'Failed to delete stream: ' + (error instanceof Error ? error.message : 'Unknown error')
			);
		}
	}

	async function manualRefresh() {
		await $streamsQuery.refetch();
	}

	onMount(() => {
		detectPlatform();

		// Keyboard shortcut handler for Cmd/Ctrl+R (manual refresh)
		function handleKeydown(e: KeyboardEvent) {
			// Check for Cmd+R (Mac) or Ctrl+R (Windows/Linux)
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'r') {
				e.preventDefault();
				manualRefresh();
			}
		}

		window.addEventListener('keydown', handleKeydown);

		return () => {
			window.removeEventListener('keydown', handleKeydown);
		};
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
			<Button
				size="sm"
				variant="outline"
				onclick={manualRefresh}
				disabled={isManualRefreshing}
				aria-label="Refresh streams (Keyboard shortcut: {modifierKey}+R)"
				title="Refresh streams ({modifierKey}+R)"
			>
				<span class="flex items-center gap-2">
					{isManualRefreshing ? 'Refreshing...' : 'Refresh'}
					<kbd
						class="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none"
					>
						<span class="text-xs">{modifierKey}</span>R
					</kbd>
				</span>
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
						<TableCell colspan={4} class="py-8 text-center">
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
						<TableCell colspan={4} class="py-8 text-center">
							<div class="text-red-600">
								<p class="font-medium">Error loading streams</p>
								<p class="mt-1 text-sm">{error}</p>
								<Button size="sm" variant="outline" class="mt-2" onclick={manualRefresh}>
									Retry
								</Button>
							</div>
						</TableCell>
					</TableRow>
				{:else if streams.length === 0}
					<TableRow>
						<TableCell colspan={4} class="text-muted-foreground py-8 text-center">
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

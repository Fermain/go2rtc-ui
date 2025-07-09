<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	interface LogEntry {
		time: string;
		level: string;
		message: string;
		[key: string]: any;
	}

	let logs: LogEntry[] = $state([]);
	let autoUpdate = $state(true);
	let reverseOrder = $state(false);
	let refreshInterval: number | undefined;
	let isLoading = $state(false); // For initial load and table content
	let isRefreshing = $state(false); // For manual refresh button
	let isClearing = $state(false); // For clear button
	let error: string | null = $state(null);

	function formatTime(isoString: string): string {
		const date = new Date(isoString);
		return date.toLocaleString(undefined, {
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric',
			fractionalSecondDigits: 3
		});
	}

	function formatMessage(entry: LogEntry): string {
		const KEYS = ['time', 'level', 'message'];
		return Object.keys(entry).reduce((msg, key) => {
			return KEYS.indexOf(key) < 0 ? `${msg} ${key}=${entry[key]}` : msg;
		}, entry.message);
	}

	function getLevelVariant(level: string): 'default' | 'secondary' | 'destructive' | 'outline' {
		switch (level) {
			case 'error':
				return 'destructive';
			case 'warn':
				return 'outline';
			case 'info':
				return 'default';
			case 'debug':
				return 'secondary';
			case 'trace':
				return 'secondary';
			default:
				return 'secondary';
		}
	}

	async function loadLogs(isManual = false) {
		if (!browser) return;

		try {
			// Set appropriate loading state
			if (isManual) {
				isRefreshing = true;
			} else {
				isLoading = true;
			}
			error = null;

			const response = await fetch('/api/log', {
				cache: 'no-cache',
				headers: {
					Accept: 'application/json, text/plain, */*'
				}
			});

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			// Handle text response (newline-delimited JSON)
			const textData = await response.text();
			let parsedLogs: LogEntry[] = [];

			if (textData.trim()) {
				const lines = textData.trim().split('\n');
				parsedLogs = lines
					.filter((line) => line.trim())
					.map((line) => {
						try {
							return JSON.parse(line);
						} catch (e) {
							// If line is not valid JSON, treat as plain text log
							return {
								time: new Date().toISOString(),
								level: 'info',
								message: line,
								raw: true
							};
						}
					});
			}

			// Process and format logs
			const processedLogs = parsedLogs.map((log) => ({
				...log,
				time: log.time || new Date().toISOString(),
				level: log.level || 'info',
				message: log.raw ? log.message : formatMessage(log)
			}));

			// Apply reverse order if enabled
			logs = reverseOrder ? processedLogs.reverse() : processedLogs;

			// Clear any previous error on successful load
			error = null;
		} catch (err) {
			console.error('Failed to load logs:', err);
			error = err instanceof Error ? err.message : 'Failed to load logs';
		} finally {
			isLoading = false;
			isRefreshing = false;
		}
	}

	async function clearLogs() {
		if (!browser) return;

		try {
			isClearing = true;
			error = null;

			const response = await fetch('/api/log', {
				method: 'DELETE',
				headers: {
					Accept: 'application/json, text/plain, */*'
				}
			});

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			// Clear logs locally and reload
			logs = [];
			await loadLogs();

			// Show success message
			const message = await response.text().catch(() => 'Logs cleared successfully');
			alert(message || 'Logs cleared successfully');
		} catch (err) {
			console.error('Failed to clear logs:', err);
			const errorMessage = err instanceof Error ? err.message : 'Failed to clear logs';
			error = errorMessage;
			alert(errorMessage);
		} finally {
			isClearing = false;
		}
	}

	function toggleAutoUpdate() {
		autoUpdate = !autoUpdate;
	}

	function toggleReverseOrder() {
		reverseOrder = !reverseOrder;
		loadLogs(); // Reload to apply new order
	}

	function manualRefresh() {
		loadLogs(true);
	}

	function retryLoad() {
		error = null;
		loadLogs(true);
	}

	onMount(() => {
		loadLogs();

		// Auto-refresh every 5 seconds
		refreshInterval = window.setInterval(() => {
			if (autoUpdate && !isLoading && !isRefreshing) {
				loadLogs(); // Use false (default) for auto-refresh to avoid manual loading state
			}
		}, 5000);
	});

	onDestroy(() => {
		if (refreshInterval) {
			clearInterval(refreshInterval);
		}
	});
</script>

<svelte:head>
	<title>go2rtc - Logs</title>
	<style>
		.info {
			color: #0174df;
		}
		.debug {
			color: #808080;
		}
		.error {
			color: #df0101;
		}
		.trace {
			color: #585858;
		}
		.warn {
			color: #ff9966;
		}
	</style>
</svelte:head>

<div class="space-y-4">
	<div class="flex flex-wrap items-center justify-between gap-4">
		<div class="flex items-center gap-2">
			<Button size="sm" variant="outline" onclick={clearLogs} disabled={isClearing}>
				<span class="flex items-center gap-2">
					{#if isClearing}
						<div class="h-3 w-3 animate-spin rounded-full border border-gray-300 border-t-gray-600"></div>
					{/if}
					Clean
				</span>
			</Button>
			<Button size="sm" variant="outline" onclick={toggleAutoUpdate}>
				Auto Update: {autoUpdate ? 'ON' : 'OFF'}
			</Button>
			<Button size="sm" variant="outline" onclick={toggleReverseOrder}>
				Reverse Log Order: {reverseOrder ? 'ON' : 'OFF'}
			</Button>
			<Button size="sm" variant="outline" onclick={manualRefresh} disabled={isLoading || isRefreshing}>
				<span class="flex items-center gap-2">
					{#if isRefreshing}
						<div class="h-3 w-3 animate-spin rounded-full border border-gray-300 border-t-gray-600"></div>
					{/if}
					Refresh
				</span>
			</Button>
		</div>
		{#if error}
			<div class="flex items-center gap-2">
				<span class="text-sm text-red-600">Connection error</span>
				<Button
					size="sm"
					variant="ghost"
					onclick={retryLoad}
					disabled={isRefreshing}
					class="h-6 px-2 text-xs"
				>
					Retry
				</Button>
			</div>
		{/if}
	</div>

	<div class="rounded-md border">
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead style="width: 100px">Time</TableHead>
					<TableHead style="width: 40px">Level</TableHead>
					<TableHead>Message</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{#if isLoading && logs.length === 0}
					<TableRow>
						<TableCell colspan={3} class="py-8 text-center">
							<div class="flex items-center justify-center gap-2">
								<div class="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
								Loading logs...
							</div>
						</TableCell>
					</TableRow>
				{:else if logs.length === 0}
					<TableRow>
						<TableCell colspan={3} class="py-8 text-center text-gray-500">
							No logs available
						</TableCell>
					</TableRow>
				{:else}
					{#each logs as log}
						<TableRow class={log.level}>
							<TableCell class="align-top font-mono text-xs">
								{formatTime(log.time)}
							</TableCell>
							<TableCell class="align-top text-xs">
								<Badge variant={getLevelVariant(log.level)}>
									{log.level}
								</Badge>
							</TableCell>
							<TableCell class="align-top font-mono text-xs whitespace-pre-wrap">
								{@html log.message.replace(/\n/g, '<br>')}
							</TableCell>
						</TableRow>
					{/each}
				{/if}
			</TableBody>
		</Table>
	</div>
</div>

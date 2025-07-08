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

	// Generate dummy logs for development
	const dummyLogs = [
		{
			time: new Date().toISOString(),
			level: 'info',
			message: 'Starting go2rtc server',
			version: '1.9.4'
		},
		{
			time: new Date(Date.now() - 1000).toISOString(),
			level: 'debug',
			message: 'Loading configuration',
			path: '/config/go2rtc.yaml'
		},
		{
			time: new Date(Date.now() - 2000).toISOString(),
			level: 'info',
			message: 'WebRTC server listening',
			port: 8555
		},
		{
			time: new Date(Date.now() - 3000).toISOString(),
			level: 'info',
			message: 'RTSP server listening',
			port: 8554
		},
		{
			time: new Date(Date.now() - 4000).toISOString(),
			level: 'warn',
			message: 'Stream connection timeout, retrying...',
			stream: 'dvr_channel_1',
			attempt: 2
		},
		{
			time: new Date(Date.now() - 5000).toISOString(),
			level: 'error',
			message: 'Failed to connect to stream',
			stream: 'dvr_channel_4',
			error: 'connection refused'
		},
		{
			time: new Date(Date.now() - 6000).toISOString(),
			level: 'debug',
			message: 'Consumer connected via WebRTC',
			stream: 'dvr_channel_1',
			remote_addr: '192.168.1.50:51234'
		},
		{
			time: new Date(Date.now() - 7000).toISOString(),
			level: 'trace',
			message: 'Processing frame',
			stream: 'dvr_channel_1',
			frame_type: 'video'
		}
	];

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

	async function loadLogs() {
		try {
			// TODO: Replace with actual API call when backend is available
			// For now, use dummy data
			if (browser) {
				const processedLogs = dummyLogs.map((log) => ({
					...log,
					time: log.time,
					level: log.level,
					message: formatMessage(log)
				}));

				logs = reverseOrder ? processedLogs.reverse() : processedLogs;
			}

			// Original implementation when backend is available:
			/*
			const response = await fetch('/api/log', { cache: 'no-cache' });
			if (response.ok) {
				const data = await response.text();
				const jsonLines = '[' + data.trimEnd().replaceAll('\n', ',') + ']';
				let parsedLogs = JSON.parse(jsonLines);
				
				if (reverseOrder) {
					parsedLogs = parsedLogs.reverse();
				}
				
				logs = parsedLogs.map(log => ({
					...log,
					message: formatMessage(log)
				}));
			}
			*/
		} catch (error) {
			console.error('Failed to load logs:', error);
		}
	}

	async function clearLogs() {
		try {
			// TODO: Replace with actual API call when backend is available
			if (browser) {
				logs = [];
				// Simulate success
				alert('Logs cleared successfully');
			}

			// Original implementation when backend is available:
			/*
			const response = await fetch('/api/log', { method: 'DELETE' });
			if (response.ok) {
				await loadLogs();
			}
			alert(await response.text());
			*/
		} catch (error) {
			console.error('Failed to clear logs:', error);
			alert('Failed to clear logs');
		}
	}

	function toggleAutoUpdate() {
		autoUpdate = !autoUpdate;
	}

	function toggleReverseOrder() {
		reverseOrder = !reverseOrder;
		loadLogs(); // Reload to apply new order
	}

	onMount(() => {
		loadLogs();

		// Auto-refresh every 5 seconds
		refreshInterval = window.setInterval(() => {
			if (autoUpdate) {
				loadLogs();
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
			<Button size="sm" variant="outline" onclick={clearLogs}>Clean</Button>
			<Button size="sm" variant="outline" onclick={toggleAutoUpdate}>
				Auto Update: {autoUpdate ? 'ON' : 'OFF'}
			</Button>
			<Button size="sm" variant="outline" onclick={toggleReverseOrder}>
				Reverse Log Order: {reverseOrder ? 'ON' : 'OFF'}
			</Button>
		</div>
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
			</TableBody>
		</Table>
	</div>
</div>

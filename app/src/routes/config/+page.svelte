<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { Button } from '$lib/components/ui/button';
	import { registerShortcutAction, unregisterShortcutAction, modifierKey } from '$lib/stores/shortcuts';

	// Import types
	interface AppInfo {
		config_path: string;
		version: string;
	}

	// State
	let editor: any = null;
	let configEditor: HTMLElement = $state();
	let isLoading = $state(false);
	let isSaving = $state(false);
	let error = $state<string | null>(null);
	let success = $state<string | null>(null);
	let appInfo = $state<AppInfo | null>(null);

	async function loadAppInfo() {
		try {
			const response = await fetch('/api');
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			appInfo = await response.json();
		} catch (err) {
			console.error('Failed to load app info:', err);
			error = 'Failed to load application info';
		}
	}

	async function loadConfig() {
		if (!appInfo?.config_path || !editor) return;

		isLoading = true;
		error = null;

		try {
			const response = await fetch('/api/config');
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const configData = await response.text();
			editor.dispatch({
				changes: { from: 0, to: editor.state.doc.length, insert: configData }
			});
		} catch (err) {
			console.error('Failed to load config:', err);
			error = 'Failed to load configuration file';
		} finally {
			isLoading = false;
		}
	}

	async function saveConfig() {
		if (!editor || isSaving) return;

		isSaving = true;
		error = null;
		success = null;

		try {
			const configContent = editor.state.doc.toString();

			const response = await fetch('/api/config', {
				method: 'PUT',
				headers: {
					'Content-Type': 'text/plain'
				},
				body: configContent
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(errorText || `HTTP error! status: ${response.status}`);
			}

			success = 'Configuration saved successfully!';
			setTimeout(() => {
				success = null;
			}, 3000);
		} catch (err) {
			console.error('Failed to save config:', err);
			error = err instanceof Error ? err.message : 'Failed to save configuration';
		} finally {
			isSaving = false;
		}
	}

	onMount(() => {
		if (!browser) return;

		// Register keyboard shortcut action
		registerShortcutAction('save-config', saveConfig);

		// Load app info first to get config path
		loadAppInfo();

		// Initialize CodeMirror asynchronously
		(async () => {
			// Import CodeMirror dynamically
			const { EditorView } = await import('@codemirror/view');
			const { EditorState } = await import('@codemirror/state');
			const { yaml } = await import('@codemirror/lang-yaml');
			const { basicSetup } = await import('codemirror');
			const { githubDark } = await import('@uiw/codemirror-theme-github');

			// Custom extension to force editor to fill height
			const fillHeight = EditorView.theme({
				'&': {
					height: '100%',
					width: '100%',
					display: 'flex',
					flexDirection: 'column'
				},
				'.cm-editor': {
					height: '100%',
					fontSize: '14px',
					display: 'flex',
					flexDirection: 'column'
				},
				'.cm-scroller': {
					fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
					flex: '1 1 0%',
					minHeight: '0'
				},
				'.cm-content': {
					padding: '12px',
					minHeight: '100%'
				},
				'.cm-focused': {
					outline: '2px solid hsl(var(--ring))',
					outlineOffset: '2px'
				}
			});

			// Initialize CodeMirror editor
			const state = EditorState.create({
				doc: '',
				extensions: [basicSetup, yaml(), githubDark, fillHeight, EditorView.lineWrapping]
			});

			editor = new EditorView({
				state,
				parent: configEditor
			});

			// Load initial config
			loadConfig();
		})();

		return () => {
			unregisterShortcutAction('save-config');
			if (editor) {
				editor.destroy();
			}
		};
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});
</script>

<svelte:head>
	<title>go2rtc - Config</title>
</svelte:head>

<div class="container mx-auto py-6">
	<!-- Header -->
	<div class="mb-6 flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold">Configuration</h1>
			{#if appInfo?.config_path}
				<p class="text-muted-foreground text-sm">{appInfo.config_path}</p>
			{/if}
		</div>

		<div class="flex items-center gap-2">
			{#if success}
				<span class="text-sm text-green-600">{success}</span>
			{/if}
			{#if error}
				<span class="text-sm text-red-600">{error}</span>
			{/if}

			<Button
				onclick={saveConfig}
				disabled={isSaving || isLoading}
				aria-label="Save configuration (Keyboard shortcut: {$modifierKey}+S)"
				title="Save configuration ({$modifierKey}+S)"
			>
				<span class="flex items-center gap-2">
					{isSaving ? 'Saving...' : 'Save Config'}
					<kbd
						class="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none"
					>
						<span class="text-xs">{$modifierKey}</span>S
					</kbd>
				</span>
			</Button>
		</div>
	</div>

	<!-- Editor Container -->
	<div class="rounded-lg border bg-card shadow-sm" style="height: calc(100vh - 200px);">
		{#if isLoading}
			<div class="flex h-full items-center justify-center">
				<div class="flex items-center gap-2">
					<div
						class="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"
					></div>
					Loading configuration...
				</div>
			</div>
		{:else}
			<div bind:this={configEditor} class="h-full w-full overflow-hidden rounded-lg"></div>
		{/if}
	</div>
</div>

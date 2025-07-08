<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Alert, AlertDescription, AlertTitle } from '$lib/components/ui/alert';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let configEditor: HTMLElement;
	let editor: any;
	let originalConfig = '';
	let isLoading = true;
	let errorMessage = '';
	let successMessage = '';
	let isSaving = false;
	let configPath = 'Configuration';

	async function loadAppInfo() {
		try {
			const response = await fetch('/api', { cache: 'no-cache' });
			if (response.ok) {
				const appInfo = await response.json();
				configPath = appInfo.config_path || 'Configuration';
			}
		} catch (error) {
			console.error('Failed to load app info:', error);
		}
	}

	async function loadConfig() {
		try {
			isLoading = true;
			errorMessage = '';

			// Make real API call to get configuration
			const response = await fetch('/api/config', { cache: 'no-cache' });

			if (response.status === 410) {
				errorMessage = 'Config file is not set';
				if (editor) {
					editor.dispatch({
						changes: { from: 0, to: editor.state.doc.length, insert: '' }
					});
				}
			} else if (response.status === 404) {
				// Config file doesn't exist
				originalConfig = '';
				if (editor) {
					editor.dispatch({
						changes: { from: 0, to: editor.state.doc.length, insert: '' }
					});
				}
			} else if (response.ok) {
				originalConfig = await response.text();
				if (editor) {
					editor.dispatch({
						changes: { from: 0, to: editor.state.doc.length, insert: originalConfig }
					});
				}
			} else {
				errorMessage = `Unknown error: ${response.statusText} (${response.status})`;
			}
		} catch (error) {
			errorMessage = `Failed to load config: ${error}`;
		} finally {
			isLoading = false;
		}
	}

	async function saveConfig() {
		if (!editor) return;

		try {
			isSaving = true;
			errorMessage = '';
			successMessage = '';

			// Check if config was changed elsewhere
			const checkResponse = await fetch('/api/config', { cache: 'no-cache' });
			if (checkResponse.ok && originalConfig !== (await checkResponse.text())) {
				errorMessage =
					'Config was changed from another place. Refresh the page and make changes again';
				return;
			}

			// Save the config
			const saveResponse = await fetch('/api/config', {
				method: 'POST',
				body: editor.state.doc.toString()
			});

			if (saveResponse.ok) {
				successMessage = 'Config saved successfully';
				originalConfig = editor.state.doc.toString();

				// Restart the service
				await fetch('/api/restart', { method: 'POST' });

				// Clear success message after 3 seconds
				setTimeout(() => {
					successMessage = '';
				}, 3000);
			} else {
				errorMessage = await saveResponse.text();
			}
		} catch (error) {
			errorMessage = `Failed to save config: ${error}`;
		} finally {
			isSaving = false;
		}
	}

	onMount(() => {
		if (!browser) return;

		// Load app info first to get config path
		loadAppInfo();

		// Keyboard shortcut handler
		function handleKeydown(e: KeyboardEvent) {
			if ((e.metaKey || e.ctrlKey) && e.key === 's') {
				e.preventDefault();
				saveConfig();
			}
		}

		window.addEventListener('keydown', handleKeydown);

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
			window.removeEventListener('keydown', handleKeydown);
			if (editor) {
				editor.destroy();
			}
		};
	});
</script>

<svelte:head>
	<title>go2rtc - Config</title>
</svelte:head>

<div class="flex h-full flex-col space-y-4">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold">{configPath}</h1>
		<Button size="sm" onclick={saveConfig} disabled={isSaving || isLoading}>
			{isSaving ? 'Saving...' : 'Save & Restart'}
			{#if !isSaving && !isLoading}
				<span class="ml-2 text-xs opacity-60">⌘S</span>
			{/if}
		</Button>
	</div>

	{#if errorMessage}
		<Alert variant="destructive">
			<AlertTitle>Error</AlertTitle>
			<AlertDescription>{errorMessage}</AlertDescription>
		</Alert>
	{/if}

	{#if successMessage}
		<Alert>
			<AlertTitle>Success</AlertTitle>
			<AlertDescription>{successMessage}</AlertDescription>
		</Alert>
	{/if}

	<div class="relative flex-1 rounded-md border">
		{#if isLoading}
			<div class="bg-background/80 absolute inset-0 flex items-center justify-center">
				<div class="text-muted-foreground">Loading configuration...</div>
			</div>
		{/if}

		<div
			bind:this={configEditor}
			class="h-full w-full overflow-hidden"
			style="display: flex; flex-direction: column;"
		></div>
	</div>
</div>

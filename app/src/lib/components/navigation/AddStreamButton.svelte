<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	// Platform-aware modifier key display
	let modifierKey = $state('⌘');

	function detectPlatform() {
		if (typeof navigator !== 'undefined') {
			const platform = navigator.platform.toLowerCase();
			modifierKey = platform.includes('mac') ? '⌘' : 'Ctrl';
		}
	}

	function handleAddStream() {
		goto('/add');
	}

	onMount(() => {
		detectPlatform();

		// Keyboard shortcut handler for Cmd/Ctrl+K (add stream)
		function handleKeydown(e: KeyboardEvent) {
			// Check for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
				e.preventDefault();
				goto('/add');
			}
		}

		document.addEventListener('keydown', handleKeydown);

		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

<!-- Add Stream Button with keyboard shortcut -->
<Button
	variant="outline"
	size="sm"
	onclick={handleAddStream}
	aria-label="Add Stream (Keyboard shortcut: {modifierKey}+K)"
	title="Add Stream ({modifierKey}+K)"
>
	<span class="flex items-center gap-2">
		Add Stream
		<kbd
			class="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none"
		>
			<span class="text-xs">{modifierKey}</span>K
		</kbd>
	</span>
</Button> 
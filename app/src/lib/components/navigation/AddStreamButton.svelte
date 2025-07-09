<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	import { modifierKey } from '$lib/stores/shortcuts';

	function handleAddStream() {
		goto('/add');
	}
</script>

<!-- Add Stream Button with keyboard shortcut -->
<Button
	variant="outline"
	size="sm"
	onclick={handleAddStream}
	aria-label="Add Stream (Keyboard shortcut: {$modifierKey}+K)"
	title="Add Stream ({$modifierKey}+K)"
>
	<span class="flex items-center gap-2">
		Add Stream
		<kbd
			class="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none"
		>
			<span class="text-xs">{$modifierKey}</span>K
		</kbd>
	</span>
</Button> 
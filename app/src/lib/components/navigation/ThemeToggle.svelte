<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Sun, Moon } from 'lucide-svelte';
	import { theme, toggleMode } from '$lib/stores/theme';
	import * as m from '$lib/paraglide/messages';

	function handleThemeToggle() {
		toggleMode();
	}
</script>

<!-- Theme Toggle -->
<Button 
	variant="ghost" 
	size="sm" 
	onclick={handleThemeToggle}
	aria-label={m.header_toggle_theme()}
	title={m.header_toggle_theme()}
>
	{#if theme.current === 'dark'}
		<Sun class="h-4 w-4" />
	{:else}
		<Moon class="h-4 w-4" />
	{/if}
</Button> 
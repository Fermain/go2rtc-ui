<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Languages } from 'lucide-svelte';
	import { locales } from '$lib/paraglide/runtime';
	import { currentLanguage } from '$lib/stores/language';
	import * as m from '$lib/paraglide/messages';

	// Language names for display
	const languageNames: Record<string, string> = {
		en: 'English',
		ru: 'Русский'
	};

	function handleLanguageChange(locale: string) {
		currentLanguage.setWithReload(locale);
	}
</script>

<!-- Language Switcher Dropdown -->
<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class="hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
		aria-label={m.header_select_language()}
		title={m.header_select_language()}
	>
		<Languages class="h-4 w-4" />
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Label>{m.header_select_language()}</DropdownMenu.Label>
		<DropdownMenu.Separator />
		{#each locales as locale}
			<DropdownMenu.Item
				class="cursor-pointer"
				onclick={() => handleLanguageChange(locale)}
			>
				<div class="flex items-center justify-between w-full">
					<span>{languageNames[locale] || locale}</span>
					{#if locale === $currentLanguage}
						<span class="text-sm text-muted-foreground">✓</span>
					{/if}
				</div>
			</DropdownMenu.Item>
		{/each}
	</DropdownMenu.Content>
</DropdownMenu.Root> 
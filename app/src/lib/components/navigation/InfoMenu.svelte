<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Info } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages';

	interface Props {
		version: string;
		configPath: string;
	}

	let { version, configPath }: Props = $props();
</script>

<!-- Version Info Dropdown -->
<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class="hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
		aria-label={m.header_system_info()}
		title={m.header_system_info()}
	>
		<Info class="h-4 w-4" />
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Label>{m.header_system_info()}</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<DropdownMenu.Item>
			<div class="flex flex-col gap-1">
				<span class="text-muted-foreground text-xs">{m.header_version()}</span>
				<span class="text-sm">{version}</span>
			</div>
		</DropdownMenu.Item>
		<DropdownMenu.Item>
			<div class="flex flex-col gap-1">
				<span class="text-muted-foreground text-xs">{m.header_config_path()}</span>
				<span class="font-mono text-sm">{configPath}</span>
			</div>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root> 
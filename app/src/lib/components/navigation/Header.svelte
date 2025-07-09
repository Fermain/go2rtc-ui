<script lang="ts">
	import { NavigationMenu, AddStreamButton, InfoMenu, ThemeToggle } from '$lib/components/navigation';

	interface Props {
		version: string;
		configPath: string;
	}

	let { version, configPath }: Props = $props();
</script>

<!-- Top Navigation Header -->
<header>
	<nav class="border-border bg-card border-b">
		<div class="px-4 py-3">
			<div class="flex items-center justify-between">
				<NavigationMenu />

				<div class="flex items-center gap-3">
					<!-- Add Stream Button with keyboard shortcut -->
					<AddStreamButton />

					<!-- Version Info Dropdown -->
					<InfoMenu {version} {configPath} />

					<!-- Theme Toggle -->
					<ThemeToggle />
				</div>
			</div>
		</div>
	</nav>
</header> 
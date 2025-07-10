<script lang="ts">
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages';

	interface NavigationLink {
		href: string;
		labelKey: () => string;
	}

	const navigationLinks: NavigationLink[] = [
		{ href: '/', labelKey: m.nav_streams },
		{ href: '/add', labelKey: m.nav_add },
		{ href: '/config', labelKey: m.nav_config },
		{ href: '/logs', labelKey: m.nav_logs },
		{ href: '/network', labelKey: m.nav_network }
	];

	function getLinkClasses(href: string): string {
		const isActive = page.url.pathname === href;
		const baseClasses = 'hover:text-foreground text-sm';
		const activeClasses = 'text-foreground underline underline-offset-4';
		const inactiveClasses = 'text-foreground/80';
		
		return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
	}
</script>

<div class="flex items-center gap-6">
	<span class="text-xl font-semibold">{m.app_title()}</span>
	<nav class="flex gap-4" aria-label="Main navigation">
		{#each navigationLinks as link}
			<a
				href={link.href}
				class={getLinkClasses(link.href)}
				aria-current={page.url.pathname === link.href ? 'page' : undefined}
			>
				{link.labelKey()}
			</a>
		{/each}
	</nav>
</div> 
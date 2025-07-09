<script lang="ts">
	import { page } from '$app/state';

	interface NavigationLink {
		href: string;
		label: string;
	}

	const navigationLinks: NavigationLink[] = [
		{ href: '/', label: 'Streams' },
		{ href: '/add', label: 'Add' },
		{ href: '/config', label: 'Config' },
		{ href: '/logs', label: 'Logs' },
		{ href: '/network', label: 'Net' }
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
	<span class="text-xl font-semibold">go2rtc</span>
	<nav class="flex gap-4" aria-label="Main navigation">
		{#each navigationLinks as link}
			<a
				href={link.href}
				class={getLinkClasses(link.href)}
				aria-current={page.url.pathname === link.href ? 'page' : undefined}
			>
				{link.label}
			</a>
		{/each}
	</nav>
</div> 
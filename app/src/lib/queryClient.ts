import { QueryClient } from '@tanstack/svelte-query';
import { browser } from '$app/environment';

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			enabled: browser, // Disable on server for SSR
			staleTime: 5000, // Consider data stale after 5 seconds
			refetchOnWindowFocus: true,
			retry: 3,
			retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
		},
		mutations: {
			retry: 1,
		},
	},
});
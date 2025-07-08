import { createQuery } from '@tanstack/svelte-query';
import { NetworkService } from '$lib/services/api.js';

// Network graph query with real-time updates
export function useNetworkGraphQuery(streamFilter?: string[], pollInterval = 5000, enabled = true) {
	return createQuery({
		queryKey: ['network', 'graph', streamFilter],
		queryFn: () => NetworkService.getNetworkGraph(streamFilter),
		refetchInterval: enabled ? pollInterval : false,
		refetchOnWindowFocus: true,
		enabled,
		staleTime: 2000, // Network topology can change quickly
	});
}
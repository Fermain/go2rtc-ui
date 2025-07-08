import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
import { LogService } from '$lib/services/api.js';

// Real-time logs query
export function useLogsQuery(pollInterval = 5000, enabled = true) {
	return createQuery({
		queryKey: ['logs'],
		queryFn: LogService.getLogs,
		refetchInterval: enabled ? pollInterval : false,
		refetchOnWindowFocus: true,
		enabled
	});
}

// Mutation for clearing logs
export function useClearLogsMutation() {
	const queryClient = useQueryClient();

	return createMutation({
		mutationFn: LogService.clearLogs,
		onSuccess: () => {
			// Invalidate logs query to show empty state
			queryClient.invalidateQueries({ queryKey: ['logs'] });
		},
		onError: (error) => {
			console.error('Failed to clear logs:', error);
		}
	});
}

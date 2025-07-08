import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
import { ConfigService } from '$lib/services/api.js';

// Configuration query
export function useConfigQuery(enabled = true) {
	return createQuery({
		queryKey: ['config'],
		queryFn: ConfigService.getConfig,
		enabled,
		refetchOnWindowFocus: false, // Config doesn't change often
		staleTime: 30000, // 30 seconds
	});
}

// Mutation for updating configuration
export function useUpdateConfigMutation() {
	const queryClient = useQueryClient();
	
	return createMutation({
		mutationFn: (yamlConfig: string) => ConfigService.updateConfig(yamlConfig),
		onSuccess: () => {
			// Invalidate config query to refetch
			queryClient.invalidateQueries({ queryKey: ['config'] });
		},
		onError: (error) => {
			console.error('Failed to update configuration:', error);
		},
	});
}

// Mutation for restarting the service
export function useRestartMutation() {
	const queryClient = useQueryClient();
	
	return createMutation({
		mutationFn: ConfigService.restart,
		onSuccess: () => {
			// Invalidate all queries after restart
			queryClient.invalidateQueries();
		},
		onError: (error) => {
			console.error('Failed to restart service:', error);
		},
	});
}
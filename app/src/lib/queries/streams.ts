import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
import { StreamService, type NewStreamRequest } from '$lib/services/api.js';

// Real-time stream status polling
export function useStreamsQuery(pollInterval = 3000, enabled = true) {
	return createQuery({
		queryKey: ['streams'],
		queryFn: StreamService.getStreams,
		refetchInterval: enabled ? pollInterval : false,
		refetchOnWindowFocus: true,
		enabled,
	});
}

// Single stream info query
export function useStreamQuery(streamId: string, enabled = true) {
	return createQuery({
		queryKey: ['stream', streamId],
		queryFn: () => StreamService.getStreamInfo(streamId),
		enabled: enabled && !!streamId,
		refetchInterval: enabled ? 5000 : false,
	});
}

// Mutation for adding streams
export function useAddStreamMutation() {
	const queryClient = useQueryClient();
	
	return createMutation({
		mutationFn: (request: NewStreamRequest) => StreamService.addStream(request),
		onSuccess: () => {
			// Invalidate and refetch streams list
			queryClient.invalidateQueries({ queryKey: ['streams'] });
		},
		onError: (error) => {
			console.error('Failed to add stream:', error);
		},
	});
}

// Mutation for deleting streams
export function useDeleteStreamMutation() {
	const queryClient = useQueryClient();
	
	return createMutation({
		mutationFn: (streamId: string) => StreamService.deleteStream(streamId),
		onSuccess: () => {
			// Invalidate and refetch streams list
			queryClient.invalidateQueries({ queryKey: ['streams'] });
		},
		onError: (error) => {
			console.error('Failed to delete stream:', error);
		},
	});
}
import { createQuery } from '@tanstack/svelte-query';
import { DiscoveryService } from '$lib/services/api.js';

// Discovery queries with longer stale times since device lists don't change frequently
const DISCOVERY_STALE_TIME = 60000; // 1 minute
const DISCOVERY_REFETCH_INTERVAL = 30000; // 30 seconds

export function useALSADevicesQuery(enabled = true) {
	return createQuery({
		queryKey: ['discovery', 'alsa'],
		queryFn: DiscoveryService.getALSADevices,
		enabled,
		staleTime: DISCOVERY_STALE_TIME,
		refetchInterval: enabled ? DISCOVERY_REFETCH_INTERVAL : false,
	});
}

export function useHomeKitDevicesQuery(enabled = true) {
	return createQuery({
		queryKey: ['discovery', 'homekit'],
		queryFn: DiscoveryService.getHomeKitDevices,
		enabled,
		staleTime: DISCOVERY_STALE_TIME,
		refetchInterval: enabled ? DISCOVERY_REFETCH_INTERVAL : false,
	});
}

export function useHomeAssistantDevicesQuery(enabled = true) {
	return createQuery({
		queryKey: ['discovery', 'hass'],
		queryFn: DiscoveryService.getHomeAssistantDevices,
		enabled,
		staleTime: DISCOVERY_STALE_TIME,
		refetchInterval: enabled ? DISCOVERY_REFETCH_INTERVAL : false,
	});
}

export function useONVIFDevicesQuery(enabled = true) {
	return createQuery({
		queryKey: ['discovery', 'onvif'],
		queryFn: DiscoveryService.getONVIFDevices,
		enabled,
		staleTime: DISCOVERY_STALE_TIME,
		refetchInterval: enabled ? DISCOVERY_REFETCH_INTERVAL : false,
	});
}

export function useNestDevicesQuery(enabled = true) {
	return createQuery({
		queryKey: ['discovery', 'nest'],
		queryFn: DiscoveryService.getNestDevices,
		enabled,
		staleTime: DISCOVERY_STALE_TIME,
		refetchInterval: enabled ? DISCOVERY_REFETCH_INTERVAL : false,
	});
}

export function useRoborockDevicesQuery(enabled = true) {
	return createQuery({
		queryKey: ['discovery', 'roborock'],
		queryFn: DiscoveryService.getRoborockDevices,
		enabled,
		staleTime: DISCOVERY_STALE_TIME,
		refetchInterval: enabled ? DISCOVERY_REFETCH_INTERVAL : false,
	});
}

export function useDVRIPDevicesQuery(enabled = true) {
	return createQuery({
		queryKey: ['discovery', 'dvrip'],
		queryFn: DiscoveryService.getDVRIPDevices,
		enabled,
		staleTime: DISCOVERY_STALE_TIME,
		refetchInterval: enabled ? DISCOVERY_REFETCH_INTERVAL : false,
	});
}

export function useFFmpegDevicesQuery(enabled = true) {
	return createQuery({
		queryKey: ['discovery', 'ffmpeg-devices'],
		queryFn: DiscoveryService.getFFmpegDevices,
		enabled,
		staleTime: DISCOVERY_STALE_TIME,
		refetchInterval: enabled ? DISCOVERY_REFETCH_INTERVAL : false,
	});
}

export function useFFmpegHardwareQuery(enabled = true) {
	return createQuery({
		queryKey: ['discovery', 'ffmpeg-hardware'],
		queryFn: DiscoveryService.getFFmpegHardware,
		enabled,
		staleTime: DISCOVERY_STALE_TIME,
		refetchInterval: enabled ? DISCOVERY_REFETCH_INTERVAL : false,
	});
}
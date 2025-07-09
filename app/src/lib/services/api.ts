// Base API configuration
export const API_BASE_URL = '/api';

// Application info from /api endpoint
export interface AppInfo {
	version: string;
	revision: string;
	host: string;
	config_path?: string;
	rtsp?: {
		listen: string;
		default_query?: string;
	};
	[key: string]: unknown;
}

// Stream data structures
export interface Producer {
	url: string;
	state?: string;
	[key: string]: unknown;
}

export interface Consumer {
	id?: string;
	type?: string;
	[key: string]: unknown;
}

export interface StreamInfo {
	producers: Producer[];
	consumers: Consumer[];
}

export interface StreamsResponse {
	[streamName: string]: StreamInfo;
}

// Derived stream interface for UI usage
export interface Stream {
	name: string;
	info: StreamInfo;
	status: 'online' | 'offline' | 'error';
	consumerCount: number;
}

export interface NewStreamRequest {
	src: string;
	name?: string;
}

// Configuration (raw YAML string)
export type ConfigResponse = string;

// Log entries
export interface LogEntry {
	time: string;
	level: 'info' | 'debug' | 'error' | 'trace' | 'warn';
	message: string;
	[key: string]: unknown;
}

// Discovery endpoints
export interface DiscoverySource {
	id?: string;
	name: string;
	info?: string;
	url: string;
	location?: string;
}

export interface DiscoveryResponse {
	sources: DiscoverySource[];
}

// WebTorrent
export interface WebTorrentResponse {
	share: string;
	pwd: string;
}

// Network graph (DOT format)
export type NetworkGraphResponse = string;

// Base fetch wrapper with error handling
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
	const url = `${API_BASE_URL}${endpoint}`;

	try {
		const response = await fetch(url, {
			headers: {
				'Content-Type': 'application/json',
				...options?.headers
			},
			...options
		});

		if (!response.ok) {
			throw new Error(`API Error: ${response.status} ${response.statusText}`);
		}

		// Handle different content types
		const contentType = response.headers.get('content-type');
		if (contentType?.includes('application/json')) {
			return response.json();
		} else if (contentType?.includes('text/')) {
			return response.text() as unknown as T;
		} else {
			return response.arrayBuffer() as unknown as T;
		}
	} catch (error) {
		console.error(`API request failed for ${endpoint}:`, error);
		throw error;
	}
}

// App Service
export class AppService {
	static async getAppInfo(): Promise<AppInfo> {
		return apiFetch<AppInfo>('/');
	}
}

// Stream Service
export class StreamService {
	// Get raw streams data from API
	static async getStreamsRaw(): Promise<StreamsResponse> {
		return apiFetch<StreamsResponse>('/streams');
	}

	// Get processed streams for UI consumption (matches original UI logic)
	static async getStreams(): Promise<Stream[]> {
		const streamsResponse = await this.getStreamsRaw();
		return Object.entries(streamsResponse).map(([name, info]) => {
			const hasProducers = info.producers && info.producers.length > 0;

			return {
				name,
				info: {
					producers: info.producers || [],
					consumers: info.consumers || []
				},
				status: hasProducers ? 'online' : 'offline', // Original logic: based on producers
				consumerCount: info.consumers.length
			};
		});
	}

	static async addStream(request: NewStreamRequest): Promise<void> {
		const params = new URLSearchParams({ src: request.src });
		if (request.name) {
			params.append('name', request.name);
		}
		return apiFetch<void>(`/streams?${params.toString()}`, {
			method: 'PUT'
		});
	}

	static async deleteStream(streamName: string): Promise<void> {
		return apiFetch<void>(`/streams?src=${encodeURIComponent(streamName)}`, {
			method: 'DELETE'
		});
	}

	static async getStreamInfo(
		streamName: string,
		filters?: {
			video?: string;
			audio?: string;
			microphone?: boolean;
		}
	): Promise<StreamInfo> {
		const params = new URLSearchParams({ src: streamName });
		if (filters?.video) params.append('video', filters.video);
		if (filters?.audio) params.append('audio', filters.audio);
		if (filters?.microphone) params.append('microphone', '');

		return apiFetch<StreamInfo>(`/streams?${params.toString()}`);
	}

	static async publishStream(src: string, dst: string): Promise<void> {
		const params = new URLSearchParams({ src, dst });
		return apiFetch<void>(`/streams?${params.toString()}`, {
			method: 'POST'
		});
	}
}

// Config Service
export class ConfigService {
	static async getConfig(): Promise<ConfigResponse> {
		return apiFetch<ConfigResponse>('/config');
	}

	static async updateConfig(yamlConfig: string): Promise<void> {
		return apiFetch<void>('/config', {
			method: 'POST',
			headers: {
				'Content-Type': 'text/plain'
			},
			body: yamlConfig
		});
	}

	static async restart(): Promise<void> {
		return apiFetch<void>('/restart', {
			method: 'POST'
		});
	}
}

// Log Service
export class LogService {
	// Parse JSON Lines format to LogEntry array
	static async getLogs(): Promise<LogEntry[]> {
		const jsonLines = await apiFetch<string>('/log');
		return jsonLines
			.split('\n')
			.filter((line) => line.trim())
			.map((line) => {
				try {
					return JSON.parse(line) as LogEntry;
				} catch {
					// Fallback for malformed lines
					return {
						time: new Date().toISOString(),
						level: 'error' as const,
						message: line
					};
				}
			});
	}

	static async clearLogs(): Promise<void> {
		return apiFetch<void>('/log', {
			method: 'DELETE'
		});
	}
}

// Network Service
export class NetworkService {
	static async getNetworkGraph(streamFilter?: string[]): Promise<NetworkGraphResponse> {
		const params = new URLSearchParams();
		if (streamFilter) {
			streamFilter.forEach((src) => params.append('src', src));
		}
		const query = params.toString();
		return apiFetch<NetworkGraphResponse>(`/streams.dot${query ? `?${query}` : ''}`);
	}
}

// Discovery Services
export class DiscoveryService {
	static async getALSADevices(): Promise<DiscoveryResponse> {
		return apiFetch<DiscoveryResponse>('/alsa');
	}

	static async getHomeKitDevices(): Promise<DiscoveryResponse> {
		return apiFetch<DiscoveryResponse>('/homekit');
	}

	static async getHomeAssistantDevices(): Promise<DiscoveryResponse> {
		return apiFetch<DiscoveryResponse>('/hass');
	}

	static async getONVIFDevices(): Promise<DiscoveryResponse> {
		return apiFetch<DiscoveryResponse>('/onvif');
	}

	static async getNestDevices(): Promise<DiscoveryResponse> {
		return apiFetch<DiscoveryResponse>('/nest');
	}

	static async getRoborockDevices(): Promise<DiscoveryResponse> {
		return apiFetch<DiscoveryResponse>('/roborock');
	}

	static async getDVRIPDevices(): Promise<DiscoveryResponse> {
		return apiFetch<DiscoveryResponse>('/dvrip');
	}

	static async getFFmpegDevices(): Promise<DiscoveryResponse> {
		return apiFetch<DiscoveryResponse>('/ffmpeg/devices');
	}

	static async getFFmpegHardware(): Promise<DiscoveryResponse> {
		return apiFetch<DiscoveryResponse>('/ffmpeg/hardware');
	}

	static async getWebTorrentShare(streamName: string): Promise<WebTorrentResponse> {
		return apiFetch<WebTorrentResponse>(`/webtorrent?src=${encodeURIComponent(streamName)}`);
	}
}

import { paraglideVitePlugin } from '@inlang/paraglide-js';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide'
		})
	],
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:1984',
				changeOrigin: true,
				secure: false,
				ws: true,
				timeout: 0,
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				configure: (proxy: any) => {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					proxy.on('error', (err: any) => {
						console.log('proxy error', err);
					});
					// eslint-disable-next-line @typescript-eslint/no-explicit-any  
					proxy.on('proxyReq', (proxyReq: any, req: any) => {
						console.log('Sending Request to the Target:', req.method, req.url);
					});
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					proxy.on('proxyReqWs', (proxyReq: any, req: any) => {
						console.log('WebSocket proxy request:', req.url);
						// Set Origin header for go2rtc compatibility
						proxyReq.setHeader('Origin', 'http://localhost:1984');
					});
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					proxy.on('proxyRes', (proxyRes: any, req: any) => {
						console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
					});
				},
			}
		}
	},
	test: {
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'client',
					environment: 'browser',
					browser: {
						enabled: true,
						provider: 'playwright',
						instances: [{ browser: 'chromium' }]
					},
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**'],
					setupFiles: ['./vitest-setup-client.ts']
				}
			},
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});

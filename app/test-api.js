#!/usr/bin/env node

// Quick test script to verify go2rtc API connectivity
// Run with: node test-api.js

const testEndpoints = [
	'http://localhost:1984/api',
	'http://localhost:1984/api/streams',
	'http://localhost:1984/api/streams.dot',
	'http://localhost:1984/api/config'
];

async function testEndpoint(url) {
	try {
		const response = await fetch(url);
		const status = response.ok ? '✅' : '❌';
		const statusText = response.status === 200 ? 'OK' : `${response.status} ${response.statusText}`;
		console.log(`${status} ${url} - ${statusText}`);

		if (response.ok && url.includes('/api/streams.dot')) {
			const text = await response.text();
			console.log(`   DOT data length: ${text.length} characters`);
		}
	} catch (error) {
		console.log(`❌ ${url} - ${error.message}`);
	}
}

async function main() {
	console.log('Testing go2rtc API endpoints...\n');

	for (const url of testEndpoints) {
		await testEndpoint(url);
	}

	console.log('\nIf you see ❌ errors, make sure go2rtc is running:');
	console.log('docker run -it --rm -p 1984:1984 alexxit/go2rtc');
}

main();

<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table';
	import * as Accordion from '$lib/components/ui/accordion';
	import {
		TempStreamForm,
		OnvifTestForm,
		HomeKitPairForm,
		HomeKitUnpairForm,
		GoogleNestLoginForm,
		RingCredentialsLoginForm,
		RingTokenLoginForm,
		RoborockLoginForm
	} from '$lib/components/forms';

	// Loading state
	let isLoading = $state(false);

	// Table data states
	let alsaData = $state<any[]>([]);
	let dvripData = $state<any[]>([]);
	let devicesData = $state<any[]>([]);
	let hardwareData = $state<any[]>([]);
	let homeKitData = $state<any[]>([]);
	let nestData = $state<any[]>([]);
	let ringData = $state<any[]>([]);
	let goProData = $state<any[]>([]);
	let hassData = $state<any[]>([]);
	let onvifData = $state<any[]>([]);
	let roborockData = $state<any[]>([]);
	let v4l2Data = $state<any[]>([]);
	let webTorrentData = $state<any[]>([]);

	// API helper functions
	async function fetchModuleData(endpoint: string) {
		const response = await fetch(endpoint, { cache: 'no-cache' });
		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}
		return response.json();
	}

	async function loadModuleData(module: string) {
		isLoading = true;
		try {
			const data = await fetchModuleData(`/api/${module}`);

			switch (module) {
				case 'alsa':
					alsaData = data.sources || [];
					break;
				case 'dvrip':
					dvripData = data.sources || [];
					break;
				case 'ffmpeg/devices':
					devicesData = data.sources || [];
					break;
				case 'ffmpeg/hardware':
					hardwareData = data.sources || [];
					break;
				case 'homekit':
					homeKitData = data.sources || [];
					break;
				case 'nest':
					nestData = data.sources || [];
					break;
				case 'ring':
					ringData = data.sources || [];
					break;
				case 'gopro':
					goProData = data.sources || [];
					break;
				case 'hass':
					hassData = data.sources || [];
					break;
				case 'onvif':
					onvifData = data.sources || [];
					break;
				case 'roborock':
					roborockData = data.sources || [];
					break;
				case 'v4l2':
					v4l2Data = data.sources || [];
					break;
				case 'webtorrent':
					webTorrentData = data.sources || [];
					break;
			}
		} catch (error) {
			console.error(`Failed to load ${module} data:`, error);
			// Set error state for the specific module
			switch (module) {
				case 'alsa':
					alsaData = [];
					break;
				case 'dvrip':
					dvripData = [];
					break;
				case 'ffmpeg/devices':
					devicesData = [];
					break;
				case 'ffmpeg/hardware':
					hardwareData = [];
					break;
				case 'homekit':
					homeKitData = [];
					break;
				case 'nest':
					nestData = [];
					break;
				case 'ring':
					ringData = [];
					break;
				case 'gopro':
					goProData = [];
					break;
				case 'hass':
					hassData = [];
					break;
				case 'onvif':
					onvifData = [];
					break;
				case 'roborock':
					roborockData = [];
					break;
				case 'v4l2':
					v4l2Data = [];
					break;
				case 'webtorrent':
					webTorrentData = [];
					break;
			}
		} finally {
			isLoading = false;
		}
	}

	// Form submit handlers
	async function handleTempStream(data: { name: string; src: string }) {
		try {
			const url = new URL('/api/streams', window.location.origin);
			url.searchParams.set('name', data.name);
			url.searchParams.set('src', data.src);

			const response = await fetch(url, { method: 'PUT' });
			const result = response.ok
				? 'Stream added successfully'
				: 'ERROR: ' + (await response.text());
			alert(result);
		} catch (error) {
			alert('Error creating stream: ' + error);
		}
	}

	async function handleOnvifTest(data: { src: string }) {
		try {
			const url = new URL('/api/onvif', window.location.origin);
			url.searchParams.set('src', data.src);

			const response = await fetch(url.toString());
			if (response.ok) {
				await loadModuleData('onvif');
			} else {
				alert('Error testing ONVIF: ' + (await response.text()));
			}
		} catch (error) {
			alert('Error testing ONVIF: ' + error);
		}
	}

	async function handleHomeKitPair(data: { id: string; url: string; pin: string }) {
		try {
			const formData = new FormData();
			formData.set('id', data.id);
			formData.set('url', data.url + '&pin=' + data.pin);

			const response = await fetch('/api/homekit', { method: 'POST', body: formData });
			const result = response.ok
				? 'HomeKit device paired successfully'
				: 'ERROR: ' + (await response.text());
			alert(result);

			if (response.ok) {
				await loadModuleData('homekit');
			}
		} catch (error) {
			alert('Error pairing HomeKit: ' + error);
		}
	}

	async function handleHomeKitUnpair(data: { id: string }) {
		try {
			const formData = new FormData();
			formData.set('id', data.id);

			const response = await fetch('/api/homekit', { method: 'DELETE', body: formData });
			const result = response.ok
				? 'HomeKit device unpaired successfully'
				: 'ERROR: ' + (await response.text());
			alert(result);

			if (response.ok) {
				await loadModuleData('homekit');
			}
		} catch (error) {
			alert('Error unpairing HomeKit: ' + error);
		}
	}

	async function handleNestLogin(data: {
		client_id: string;
		client_secret: string;
		refresh_token: string;
		project_id: string;
	}) {
		try {
			const query = new URLSearchParams(data);
			const url = new URL('/api/nest?' + query.toString(), window.location.origin);

			const response = await fetch(url, { cache: 'no-cache' });
			if (response.ok) {
				await loadModuleData('nest');
			} else {
				const errorData = await response.json();
				alert('Error: ' + (errorData.error || 'Unknown error'));
			}
		} catch (error) {
			alert('Error logging into Nest: ' + error);
		}
	}

	async function handleRingCredentials(data: { email: string; password: string; code?: string }) {
		try {
			const query = new URLSearchParams();
			query.set('email', data.email);
			query.set('password', data.password);
			if (data.code) {
				query.set('code', data.code);
			}

			const url = new URL('/api/ring?' + query.toString(), window.location.origin);
			const response = await fetch(url, { cache: 'no-cache' });
			const responseData = await response.json();

			if (responseData.needs_2fa) {
				alert(responseData.prompt || 'Enter 2FA code and submit again');
				return;
			}

			if (!response.ok) {
				alert('Error: ' + (responseData.error || 'Unknown error'));
				return;
			}

			await loadModuleData('ring');
		} catch (error) {
			alert('Error logging into Ring: ' + error);
		}
	}

	async function handleRingToken(data: { refresh_token: string }) {
		try {
			const query = new URLSearchParams(data);
			const url = new URL('/api/ring?' + query.toString(), window.location.origin);

			const response = await fetch(url, { cache: 'no-cache' });
			if (response.ok) {
				await loadModuleData('ring');
			} else {
				const errorData = await response.json();
				alert('Error: ' + (errorData.error || 'Unknown error'));
			}
		} catch (error) {
			alert('Error logging into Ring: ' + error);
		}
	}

	async function handleRoborockLogin(data: { username: string; password: string }) {
		try {
			const formData = new FormData();
			formData.set('username', data.username);
			formData.set('password', data.password);

			const response = await fetch('/api/roborock', { method: 'POST', body: formData });
			if (response.ok) {
				await loadModuleData('roborock');
			} else {
				const errorData = await response.json();
				alert('Error: ' + (errorData.error || 'Unknown error'));
			}
		} catch (error) {
			alert('Error logging into Roborock: ' + error);
		}
	}

	// Table rendering helper
	function renderTable(data: any[]) {
		if (!data || data.length === 0) {
			return []; // Return empty array for consistent rendering
		}
		return data;
	}
</script>

<svelte:head>
	<title>go2rtc - Add Stream</title>
</svelte:head>

<div class="space-y-6">
	<Accordion.Root type="single">
		<!-- Temporary Stream -->
		<Accordion.Item value="stream">
			<Accordion.Trigger>Temporary Stream</Accordion.Trigger>
			<Accordion.Content>
				<TempStreamForm onsubmit={handleTempStream} />
			</Accordion.Content>
		</Accordion.Item>

		<!-- ALSA -->
		<Accordion.Item value="alsa">
			<Accordion.Trigger onclick={() => loadModuleData('alsa')}>
				ALSA (Linux Audio)
			</Accordion.Trigger>
			<Accordion.Content>
				{#if isLoading}
					<div class="p-4 text-center">Loading...</div>
				{:else}
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>ID</TableHead>
								<TableHead>Name</TableHead>
								<TableHead>Info</TableHead>
								<TableHead>URL</TableHead>
								<TableHead>Location</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{#each renderTable(alsaData) as item}
								<TableRow>
									<TableCell>{item.id}</TableCell>
									<TableCell>{item.name}</TableCell>
									<TableCell>{item.info}</TableCell>
									<TableCell class="break-words">{item.url}</TableCell>
									<TableCell>{item.location}</TableCell>
								</TableRow>
							{/each}
						</TableBody>
					</Table>
				{/if}
			</Accordion.Content>
		</Accordion.Item>

		<!-- Apple HomeKit -->
		<Accordion.Item value="homekit">
			<Accordion.Trigger onclick={() => loadModuleData('homekit')}>Apple HomeKit</Accordion.Trigger>
			<Accordion.Content>
				<div class="space-y-4">
					<div>
						<h4 class="mb-2 font-medium">Pair Device</h4>
						<HomeKitPairForm onsubmit={handleHomeKitPair} />
					</div>
					<div>
						<h4 class="mb-2 font-medium">Unpair Device</h4>
						<HomeKitUnpairForm onsubmit={handleHomeKitUnpair} />
					</div>
					{#if isLoading}
						<div class="p-4 text-center">Loading...</div>
					{:else}
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>ID</TableHead>
									<TableHead>Name</TableHead>
									<TableHead>Info</TableHead>
									<TableHead>URL</TableHead>
									<TableHead>Location</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{#each renderTable(homeKitData) as item}
									<TableRow>
										<TableCell>{item.id}</TableCell>
										<TableCell>{item.name}</TableCell>
										<TableCell>{item.info}</TableCell>
										<TableCell class="break-words">{item.url}</TableCell>
										<TableCell>{item.location}</TableCell>
									</TableRow>
								{/each}
							</TableBody>
						</Table>
					{/if}
				</div>
			</Accordion.Content>
		</Accordion.Item>

		<!-- DVRIP -->
		<Accordion.Item value="dvrip">
			<Accordion.Trigger onclick={() => loadModuleData('dvrip')}>DVRIP</Accordion.Trigger>
			<Accordion.Content>
				{#if isLoading}
					<div class="p-4 text-center">Loading...</div>
				{:else}
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>ID</TableHead>
								<TableHead>Name</TableHead>
								<TableHead>Info</TableHead>
								<TableHead>URL</TableHead>
								<TableHead>Location</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{#each renderTable(dvripData) as item}
								<TableRow>
									<TableCell>{item.id}</TableCell>
									<TableCell>{item.name}</TableCell>
									<TableCell>{item.info}</TableCell>
									<TableCell class="break-words">{item.url}</TableCell>
									<TableCell>{item.location}</TableCell>
								</TableRow>
							{/each}
						</TableBody>
					</Table>
				{/if}
			</Accordion.Content>
		</Accordion.Item>

		<!-- FFmpeg Devices -->
		<Accordion.Item value="ffmpeg-devices">
			<Accordion.Trigger onclick={() => loadModuleData('ffmpeg/devices')}>
				FFmpeg Devices (USB)
			</Accordion.Trigger>
			<Accordion.Content>
				{#if isLoading}
					<div class="p-4 text-center">Loading...</div>
				{:else}
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>ID</TableHead>
								<TableHead>Name</TableHead>
								<TableHead>Info</TableHead>
								<TableHead>URL</TableHead>
								<TableHead>Location</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{#each renderTable(devicesData) as item}
								<TableRow>
									<TableCell>{item.id}</TableCell>
									<TableCell>{item.name}</TableCell>
									<TableCell>{item.info}</TableCell>
									<TableCell class="break-words">{item.url}</TableCell>
									<TableCell>{item.location}</TableCell>
								</TableRow>
							{/each}
						</TableBody>
					</Table>
				{/if}
			</Accordion.Content>
		</Accordion.Item>

		<!-- FFmpeg Hardware -->
		<Accordion.Item value="ffmpeg-hardware">
			<Accordion.Trigger onclick={() => loadModuleData('ffmpeg/hardware')}>
				FFmpeg Hardware
			</Accordion.Trigger>
			<Accordion.Content>
				{#if isLoading}
					<div class="p-4 text-center">Loading...</div>
				{:else}
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>ID</TableHead>
								<TableHead>Name</TableHead>
								<TableHead>Info</TableHead>
								<TableHead>URL</TableHead>
								<TableHead>Location</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{#each renderTable(hardwareData) as item}
								<TableRow>
									<TableCell>{item.id}</TableCell>
									<TableCell>{item.name}</TableCell>
									<TableCell>{item.info}</TableCell>
									<TableCell class="break-words">{item.url}</TableCell>
									<TableCell>{item.location}</TableCell>
								</TableRow>
							{/each}
						</TableBody>
					</Table>
				{/if}
			</Accordion.Content>
		</Accordion.Item>

		<!-- Google Nest -->
		<Accordion.Item value="nest">
			<Accordion.Trigger onclick={() => loadModuleData('nest')}>Google Nest</Accordion.Trigger>
			<Accordion.Content>
				<div class="space-y-4">
					<GoogleNestLoginForm onsubmit={handleNestLogin} />
					{#if isLoading}
						<div class="p-4 text-center">Loading...</div>
					{:else}
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>ID</TableHead>
									<TableHead>Name</TableHead>
									<TableHead>Info</TableHead>
									<TableHead>URL</TableHead>
									<TableHead>Location</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{#each renderTable(nestData) as item}
									<TableRow>
										<TableCell>{item.id}</TableCell>
										<TableCell>{item.name}</TableCell>
										<TableCell>{item.info}</TableCell>
										<TableCell class="break-words">{item.url}</TableCell>
										<TableCell>{item.location}</TableCell>
									</TableRow>
								{/each}
							</TableBody>
						</Table>
					{/if}
				</div>
			</Accordion.Content>
		</Accordion.Item>

		<!-- Ring -->
		<Accordion.Item value="ring">
			<Accordion.Trigger onclick={() => loadModuleData('ring')}>Ring</Accordion.Trigger>
			<Accordion.Content>
				<div class="space-y-4">
					<div>
						<h4 class="mb-2 font-medium">Login with Credentials</h4>
						<RingCredentialsLoginForm onsubmit={handleRingCredentials} />
					</div>
					<div>
						<h4 class="mb-2 font-medium">Login with Token</h4>
						<RingTokenLoginForm onsubmit={handleRingToken} />
					</div>
					{#if isLoading}
						<div class="p-4 text-center">Loading...</div>
					{:else}
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>ID</TableHead>
									<TableHead>Name</TableHead>
									<TableHead>Info</TableHead>
									<TableHead>URL</TableHead>
									<TableHead>Location</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{#each renderTable(ringData) as item}
									<TableRow>
										<TableCell>{item.id}</TableCell>
										<TableCell>{item.name}</TableCell>
										<TableCell>{item.info}</TableCell>
										<TableCell class="break-words">{item.url}</TableCell>
										<TableCell>{item.location}</TableCell>
									</TableRow>
								{/each}
							</TableBody>
						</Table>
					{/if}
				</div>
			</Accordion.Content>
		</Accordion.Item>

		<!-- GoPro -->
		<Accordion.Item value="gopro">
			<Accordion.Trigger onclick={() => loadModuleData('gopro')}>GoPro</Accordion.Trigger>
			<Accordion.Content>
				{#if isLoading}
					<div class="p-4 text-center">Loading...</div>
				{:else}
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>ID</TableHead>
								<TableHead>Name</TableHead>
								<TableHead>Info</TableHead>
								<TableHead>URL</TableHead>
								<TableHead>Location</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{#each renderTable(goProData) as item}
								<TableRow>
									<TableCell>{item.id}</TableCell>
									<TableCell>{item.name}</TableCell>
									<TableCell>{item.info}</TableCell>
									<TableCell class="break-words">{item.url}</TableCell>
									<TableCell>{item.location}</TableCell>
								</TableRow>
							{/each}
						</TableBody>
					</Table>
				{/if}
			</Accordion.Content>
		</Accordion.Item>

		<!-- Home Assistant -->
		<Accordion.Item value="hass">
			<Accordion.Trigger onclick={() => loadModuleData('hass')}>Home Assistant</Accordion.Trigger>
			<Accordion.Content>
				{#if isLoading}
					<div class="p-4 text-center">Loading...</div>
				{:else}
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>ID</TableHead>
								<TableHead>Name</TableHead>
								<TableHead>Info</TableHead>
								<TableHead>URL</TableHead>
								<TableHead>Location</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{#each renderTable(hassData) as item}
								<TableRow>
									<TableCell>{item.id}</TableCell>
									<TableCell>{item.name}</TableCell>
									<TableCell>{item.info}</TableCell>
									<TableCell class="break-words">{item.url}</TableCell>
									<TableCell>{item.location}</TableCell>
								</TableRow>
							{/each}
						</TableBody>
					</Table>
				{/if}
			</Accordion.Content>
		</Accordion.Item>

		<!-- ONVIF -->
		<Accordion.Item value="onvif">
			<Accordion.Trigger onclick={() => loadModuleData('onvif')}>ONVIF</Accordion.Trigger>
			<Accordion.Content>
				<div class="space-y-4">
					<OnvifTestForm onsubmit={handleOnvifTest} />
					{#if isLoading}
						<div class="p-4 text-center">Loading...</div>
					{:else}
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>ID</TableHead>
									<TableHead>Name</TableHead>
									<TableHead>Info</TableHead>
									<TableHead>URL</TableHead>
									<TableHead>Location</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{#each renderTable(onvifData) as item}
									<TableRow>
										<TableCell>{item.id}</TableCell>
										<TableCell>{item.name}</TableCell>
										<TableCell>{item.info}</TableCell>
										<TableCell class="break-words">{item.url}</TableCell>
										<TableCell>{item.location}</TableCell>
									</TableRow>
								{/each}
							</TableBody>
						</Table>
					{/if}
				</div>
			</Accordion.Content>
		</Accordion.Item>

		<!-- Roborock -->
		<Accordion.Item value="roborock">
			<Accordion.Trigger onclick={() => loadModuleData('roborock')}>Roborock</Accordion.Trigger>
			<Accordion.Content>
				<div class="space-y-4">
					<RoborockLoginForm onsubmit={handleRoborockLogin} />
					{#if isLoading}
						<div class="p-4 text-center">Loading...</div>
					{:else}
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>ID</TableHead>
									<TableHead>Name</TableHead>
									<TableHead>Info</TableHead>
									<TableHead>URL</TableHead>
									<TableHead>Location</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{#each renderTable(roborockData) as item}
									<TableRow>
										<TableCell>{item.id}</TableCell>
										<TableCell>{item.name}</TableCell>
										<TableCell>{item.info}</TableCell>
										<TableCell class="break-words">{item.url}</TableCell>
										<TableCell>{item.location}</TableCell>
									</TableRow>
								{/each}
							</TableBody>
						</Table>
					{/if}
				</div>
			</Accordion.Content>
		</Accordion.Item>

		<!-- V4L2 -->
		<Accordion.Item value="v4l2">
			<Accordion.Trigger onclick={() => loadModuleData('v4l2')}>
				V4L2 (Linux video)
			</Accordion.Trigger>
			<Accordion.Content>
				{#if isLoading}
					<div class="p-4 text-center">Loading...</div>
				{:else}
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>ID</TableHead>
								<TableHead>Name</TableHead>
								<TableHead>Info</TableHead>
								<TableHead>URL</TableHead>
								<TableHead>Location</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{#each renderTable(v4l2Data) as item}
								<TableRow>
									<TableCell>{item.id}</TableCell>
									<TableCell>{item.name}</TableCell>
									<TableCell>{item.info}</TableCell>
									<TableCell class="break-words">{item.url}</TableCell>
									<TableCell>{item.location}</TableCell>
								</TableRow>
							{/each}
						</TableBody>
					</Table>
				{/if}
			</Accordion.Content>
		</Accordion.Item>

		<!-- WebTorrent -->
		<Accordion.Item value="webtorrent">
			<Accordion.Trigger onclick={() => loadModuleData('webtorrent')}>
				WebTorrent Shares
			</Accordion.Trigger>
			<Accordion.Content>
				{#if isLoading}
					<div class="p-4 text-center">Loading...</div>
				{:else}
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>ID</TableHead>
								<TableHead>Name</TableHead>
								<TableHead>Info</TableHead>
								<TableHead>URL</TableHead>
								<TableHead>Location</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{#each renderTable(webTorrentData) as item}
								<TableRow>
									<TableCell>{item.id}</TableCell>
									<TableCell>{item.name}</TableCell>
									<TableCell>{item.info}</TableCell>
									<TableCell class="break-words">{item.url}</TableCell>
									<TableCell>{item.location}</TableCell>
								</TableRow>
							{/each}
						</TableBody>
					</Table>
				{/if}
			</Accordion.Content>
		</Accordion.Item>
	</Accordion.Root>
</div>

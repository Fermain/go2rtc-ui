<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table';
	import * as Accordion from '$lib/components/ui/accordion';

	// Loading state
	let isLoading = $state(false);

	// Form states
	let tempStreamForm = $state({
		name: '',
		src: ''
	});

	let onvifForm = $state({
		src: 'onvif://user:pass@192.168.1.123:80'
	});

	let homeKitForm = $state({
		id: '',
		url: '',
		pin: ''
	});

	let homeKitUnpairForm = $state({
		id: ''
	});

	let nestForm = $state({
		client_id: '',
		client_secret: '',
		refresh_token: '',
		project_id: ''
	});

	let ringCredentialsForm = $state({
		email: '',
		password: '',
		code: ''
	});

	let ringTokenForm = $state({
		refresh_token: ''
	});

	let roborockForm = $state({
		username: '',
		password: ''
	});

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

	// Helper functions
	function loadModuleDataOnExpand(module: string) {
		loadModuleData(module);
	}

	async function loadModuleData(module: string) {
		isLoading = true;
		try {
			// TODO: Replace with actual API calls
			// For now, simulate loading with dummy data
			await new Promise((resolve) => setTimeout(resolve, 500));

			switch (module) {
				case 'alsa':
					alsaData = [
						{
							id: 'default',
							name: 'Default Audio Device',
							info: 'ALSA PCM',
							url: 'alsa://default',
							location: 'local'
						},
						{
							id: 'hw:0,0',
							name: 'Built-in Audio',
							info: 'Hardware device',
							url: 'alsa://hw:0,0',
							location: 'local'
						}
					];
					break;
				case 'dvrip':
					dvripData = [
						{
							id: 'cam1',
							name: 'DVR Camera 1',
							info: 'DVRIP Device',
							url: 'dvrip://192.168.1.200',
							location: 'network'
						},
						{
							id: 'cam2',
							name: 'DVR Camera 2',
							info: 'DVRIP Device',
							url: 'dvrip://192.168.1.201',
							location: 'network'
						}
					];
					break;
				case 'homekit':
					homeKitData = [
						{
							id: 'camera1',
							name: 'HomeKit Camera',
							info: 'status=1',
							url: 'homekit://...',
							location: 'network'
						}
					];
					break;
				case 'ffmpeg-devices':
					devicesData = [
						{
							id: 'video0',
							name: 'USB Camera',
							info: 'Video4Linux2',
							url: 'ffmpeg:device?video=/dev/video0',
							location: 'local'
						},
						{
							id: 'video1',
							name: 'Webcam',
							info: 'Video4Linux2',
							url: 'ffmpeg:device?video=/dev/video1',
							location: 'local'
						}
					];
					break;
				case 'ffmpeg-hardware':
					hardwareData = [
						{
							id: 'vaapi',
							name: 'Intel VAAPI',
							info: 'Hardware acceleration',
							url: 'ffmpeg:device?hwaccel=vaapi',
							location: 'local'
						},
						{
							id: 'nvenc',
							name: 'NVIDIA NVENC',
							info: 'Hardware acceleration',
							url: 'ffmpeg:device?hwaccel=nvenc',
							location: 'local'
						}
					];
					break;
				case 'nest':
					nestData = [
						{
							id: 'nest1',
							name: 'Front Door Camera',
							info: 'Nest Cam',
							url: 'nest://device123',
							location: 'network'
						},
						{
							id: 'nest2',
							name: 'Backyard Camera',
							info: 'Nest Cam',
							url: 'nest://device456',
							location: 'network'
						}
					];
					break;
				case 'ring':
					ringData = [
						{
							id: 'ring1',
							name: 'Ring Doorbell',
							info: 'Doorbell Pro',
							url: 'ring://doorbell123',
							location: 'network'
						},
						{
							id: 'ring2',
							name: 'Ring Camera',
							info: 'Stick Up Cam',
							url: 'ring://camera456',
							location: 'network'
						}
					];
					break;
				case 'gopro':
					goProData = [
						{
							id: 'gopro1',
							name: 'GoPro Hero 11',
							info: 'WiFi Connected',
							url: 'gopro://192.168.1.100',
							location: 'network'
						},
						{
							id: 'gopro2',
							name: 'GoPro Hero 10',
							info: 'WiFi Connected',
							url: 'gopro://192.168.1.101',
							location: 'network'
						}
					];
					break;
				case 'hass':
					hassData = [
						{
							id: 'hass1',
							name: 'Security Camera',
							info: 'Home Assistant',
							url: 'hass://camera.security',
							location: 'network'
						},
						{
							id: 'hass2',
							name: 'Doorbell Camera',
							info: 'Home Assistant',
							url: 'hass://camera.doorbell',
							location: 'network'
						}
					];
					break;
				case 'onvif':
					onvifData = [
						{
							id: 'onvif1',
							name: 'ONVIF Camera 1',
							info: 'PTZ Camera',
							url: 'onvif://192.168.1.150',
							location: 'network'
						},
						{
							id: 'onvif2',
							name: 'ONVIF Camera 2',
							info: 'Fixed Camera',
							url: 'onvif://192.168.1.151',
							location: 'network'
						}
					];
					break;
				case 'roborock':
					roborockData = [
						{
							id: 'roborock1',
							name: 'Roborock S7',
							info: 'Vacuum Camera',
							url: 'roborock://vacuum123',
							location: 'network'
						}
					];
					break;
				case 'v4l2':
					v4l2Data = [
						{
							id: 'video0',
							name: 'USB Webcam',
							info: 'UVC Camera',
							url: 'v4l2:///dev/video0',
							location: 'local'
						},
						{
							id: 'video1',
							name: 'Internal Camera',
							info: 'Built-in Camera',
							url: 'v4l2:///dev/video1',
							location: 'local'
						}
					];
					break;
				case 'webtorrent':
					webTorrentData = [
						{
							id: 'torrent1',
							name: 'Shared Camera Feed',
							info: 'WebTorrent Stream',
							url: 'webtorrent://magnet:?xt=...',
							location: 'network'
						}
					];
					break;
			}
		} catch (error) {
			console.error('Failed to load module data:', error);
		} finally {
			isLoading = false;
		}
	}

	async function submitTempStream() {
		if (!tempStreamForm.name || !tempStreamForm.src) {
			alert('Please fill in both name and URL');
			return;
		}

		try {
			// TODO: Replace with actual API call
			console.log('Would create temp stream:', tempStreamForm);
			alert('Stream created successfully');
			tempStreamForm = { name: '', src: '' };
		} catch (error) {
			alert('Error creating stream: ' + error);
		}
	}

	async function submitOnvifTest() {
		if (!onvifForm.src) {
			alert('Please enter ONVIF URL');
			return;
		}

		try {
			// TODO: Replace with actual API call
			console.log('Would test ONVIF:', onvifForm.src);
			loadModuleData('onvif');
		} catch (error) {
			alert('Error testing ONVIF: ' + error);
		}
	}

	async function submitHomeKitPair() {
		if (!homeKitForm.id || !homeKitForm.url || !homeKitForm.pin) {
			alert('Please fill in all fields');
			return;
		}

		try {
			// TODO: Replace with actual API call
			console.log('Would pair HomeKit:', homeKitForm);
			alert('HomeKit device paired successfully');
			homeKitForm = { id: '', url: '', pin: '' };
			loadModuleData('homekit');
		} catch (error) {
			alert('Error pairing HomeKit: ' + error);
		}
	}

	async function submitHomeKitUnpair() {
		if (!homeKitUnpairForm.id) {
			alert('Please enter stream ID');
			return;
		}

		try {
			// TODO: Replace with actual API call
			console.log('Would unpair HomeKit:', homeKitUnpairForm.id);
			alert('HomeKit device unpaired successfully');
			homeKitUnpairForm = { id: '' };
			loadModuleData('homekit');
		} catch (error) {
			alert('Error unpairing HomeKit: ' + error);
		}
	}

	async function submitNest() {
		if (
			!nestForm.client_id ||
			!nestForm.client_secret ||
			!nestForm.refresh_token ||
			!nestForm.project_id
		) {
			alert('Please fill in all fields');
			return;
		}

		try {
			// TODO: Replace with actual API call
			console.log('Would login to Nest:', nestForm);
			loadModuleData('nest');
		} catch (error) {
			alert('Error logging into Nest: ' + error);
		}
	}

	async function submitRingCredentials() {
		if (!ringCredentialsForm.email || !ringCredentialsForm.password) {
			alert('Please enter email and password');
			return;
		}

		try {
			// TODO: Replace with actual API call
			console.log('Would login to Ring with credentials:', ringCredentialsForm);
			loadModuleData('ring');
		} catch (error) {
			alert('Error logging into Ring: ' + error);
		}
	}

	async function submitRingToken() {
		if (!ringTokenForm.refresh_token) {
			alert('Please enter refresh token');
			return;
		}

		try {
			// TODO: Replace with actual API call
			console.log('Would login to Ring with token:', ringTokenForm.refresh_token);
			loadModuleData('ring');
		} catch (error) {
			alert('Error logging into Ring: ' + error);
		}
	}

	async function submitRoborock() {
		if (!roborockForm.username || !roborockForm.password) {
			alert('Please enter username and password');
			return;
		}

		try {
			// TODO: Replace with actual API call
			console.log('Would login to Roborock:', roborockForm);
			loadModuleData('roborock');
		} catch (error) {
			alert('Error logging into Roborock: ' + error);
		}
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
				<div class="flex gap-4">
					<div class="flex-1">
						<Input type="text" placeholder="name" bind:value={tempStreamForm.name} />
					</div>
					<div class="flex-1">
						<Input type="text" placeholder="url" bind:value={tempStreamForm.src} />
					</div>
					<Button onclick={submitTempStream}>add</Button>
				</div>
			</Accordion.Content>
		</Accordion.Item>

		<!-- ALSA -->
		<Accordion.Item value="alsa">
			<Accordion.Trigger onclick={() => loadModuleDataOnExpand('alsa')}
				>ALSA (Linux Audio)</Accordion.Trigger
			>
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
							{#each alsaData as item}
								<TableRow>
									<TableCell>{item.id}</TableCell>
									<TableCell>{item.name}</TableCell>
									<TableCell>{item.info}</TableCell>
									<TableCell style="word-break: break-word; white-space: normal;"
										>{item.url}</TableCell
									>
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
			<Accordion.Trigger onclick={() => loadModuleDataOnExpand('homekit')}
				>Apple HomeKit</Accordion.Trigger
			>
			<Accordion.Content>
				<div class="space-y-4">
					<div class="flex gap-4">
						<Input type="text" placeholder="stream id" bind:value={homeKitForm.id} class="w-48" />
						<Input type="text" placeholder="url" bind:value={homeKitForm.url} class="w-80" />
						<Input type="text" placeholder="pin" bind:value={homeKitForm.pin} class="w-24" />
						<Button onclick={submitHomeKitPair}>Pair</Button>
					</div>

					<div class="flex gap-4">
						<Input
							type="text"
							placeholder="stream id"
							bind:value={homeKitUnpairForm.id}
							class="w-48"
						/>
						<Button onclick={submitHomeKitUnpair}>Unpair</Button>
					</div>

					{#if homeKitData.length > 0}
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>ID</TableHead>
									<TableHead>Name</TableHead>
									<TableHead>Info</TableHead>
									<TableHead>URL</TableHead>
									<TableHead>Location</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{#each homeKitData as item}
									<TableRow>
										<TableCell>{item.id}</TableCell>
										<TableCell>{item.name}</TableCell>
										<TableCell>{item.info}</TableCell>
										<TableCell style="word-break: break-word; white-space: normal;"
											>{item.url}</TableCell
										>
										<TableCell>{item.location}</TableCell>
										<TableCell>
											{#if item.info.includes('status=1')}
												<button class="text-blue-600 hover:underline">pair</button>
											{:else if item.url}
												<button class="text-blue-600 hover:underline">unpair</button>
											{/if}
										</TableCell>
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
			<Accordion.Trigger onclick={() => loadModuleDataOnExpand('dvrip')}>DVRIP</Accordion.Trigger>
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
							{#each dvripData as item}
								<TableRow>
									<TableCell>{item.id}</TableCell>
									<TableCell>{item.name}</TableCell>
									<TableCell>{item.info}</TableCell>
									<TableCell style="word-break: break-word; white-space: normal;"
										>{item.url}</TableCell
									>
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
			<Accordion.Trigger onclick={() => loadModuleDataOnExpand('onvif')}>ONVIF</Accordion.Trigger>
			<Accordion.Content>
				<div class="space-y-4">
					<div class="flex gap-4">
						<Input
							type="text"
							placeholder="onvif://user:pass@192.168.1.123:80"
							bind:value={onvifForm.src}
							class="flex-1"
						/>
						<Button onclick={submitOnvifTest}>test</Button>
					</div>

					{#if onvifData.length > 0}
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
								{#each onvifData as item}
									<TableRow>
										<TableCell>{item.id}</TableCell>
										<TableCell>{item.name}</TableCell>
										<TableCell>{item.info}</TableCell>
										<TableCell style="word-break: break-word; white-space: normal;"
											>{item.url}</TableCell
										>
										<TableCell>{item.location}</TableCell>
									</TableRow>
								{/each}
							</TableBody>
						</Table>
					{/if}
				</div>
			</Accordion.Content>
		</Accordion.Item>

		<!-- Google Nest -->
		<Accordion.Item value="nest">
			<Accordion.Trigger onclick={() => loadModuleDataOnExpand('nest')}
				>Google Nest</Accordion.Trigger
			>
			<Accordion.Content>
				<div class="space-y-4">
					<div class="flex gap-4">
						<Input type="text" placeholder="client_id" bind:value={nestForm.client_id} />
						<Input type="text" placeholder="client_secret" bind:value={nestForm.client_secret} />
						<Input type="text" placeholder="refresh_token" bind:value={nestForm.refresh_token} />
						<Input type="text" placeholder="project_id" bind:value={nestForm.project_id} />
						<Button onclick={submitNest}>Login</Button>
					</div>

					{#if nestData.length > 0}
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
								{#each nestData as item}
									<TableRow>
										<TableCell>{item.id}</TableCell>
										<TableCell>{item.name}</TableCell>
										<TableCell>{item.info}</TableCell>
										<TableCell style="word-break: break-word; white-space: normal;"
											>{item.url}</TableCell
										>
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
			<Accordion.Trigger onclick={() => loadModuleDataOnExpand('ring')}>Ring</Accordion.Trigger>
			<Accordion.Content>
				<div class="space-y-4">
					<div class="flex gap-4">
						<Input type="email" placeholder="email" bind:value={ringCredentialsForm.email} />
						<Input
							type="password"
							placeholder="password"
							bind:value={ringCredentialsForm.password}
						/>
						<Input type="text" placeholder="2FA code" bind:value={ringCredentialsForm.code} />
						<Button onclick={submitRingCredentials}>Login</Button>
					</div>

					<div class="flex gap-4">
						<Input
							type="text"
							placeholder="refresh_token"
							bind:value={ringTokenForm.refresh_token}
							class="flex-1"
						/>
						<Button onclick={submitRingToken}>Login</Button>
					</div>

					{#if ringData.length > 0}
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
								{#each ringData as item}
									<TableRow>
										<TableCell>{item.id}</TableCell>
										<TableCell>{item.name}</TableCell>
										<TableCell>{item.info}</TableCell>
										<TableCell style="word-break: break-word; white-space: normal;"
											>{item.url}</TableCell
										>
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
			<Accordion.Trigger onclick={() => loadModuleDataOnExpand('roborock')}
				>Roborock</Accordion.Trigger
			>
			<Accordion.Content>
				<div class="space-y-4">
					<div class="flex gap-4">
						<Input type="text" placeholder="username" bind:value={roborockForm.username} />
						<Input type="password" placeholder="password" bind:value={roborockForm.password} />
						<Button onclick={submitRoborock}>Login</Button>
					</div>

					{#if roborockData.length > 0}
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
								{#each roborockData as item}
									<TableRow>
										<TableCell>{item.id}</TableCell>
										<TableCell>{item.name}</TableCell>
										<TableCell>{item.info}</TableCell>
										<TableCell style="word-break: break-word; white-space: normal;"
											>{item.url}</TableCell
										>
										<TableCell>{item.location}</TableCell>
									</TableRow>
								{/each}
							</TableBody>
						</Table>
					{/if}
				</div>
			</Accordion.Content>
		</Accordion.Item>

		<!-- FFmpeg Devices -->
		<Accordion.Item value="ffmpeg-devices">
			<Accordion.Trigger onclick={() => loadModuleDataOnExpand('ffmpeg-devices')}
				>FFmpeg Devices (USB)</Accordion.Trigger
			>
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
							{#each devicesData as item}
								<TableRow>
									<TableCell>{item.id}</TableCell>
									<TableCell>{item.name}</TableCell>
									<TableCell>{item.info}</TableCell>
									<TableCell style="word-break: break-word; white-space: normal;"
										>{item.url}</TableCell
									>
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
			<Accordion.Trigger onclick={() => loadModuleDataOnExpand('ffmpeg-hardware')}
				>FFmpeg Hardware</Accordion.Trigger
			>
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
							{#each hardwareData as item}
								<TableRow>
									<TableCell>{item.id}</TableCell>
									<TableCell>{item.name}</TableCell>
									<TableCell>{item.info}</TableCell>
									<TableCell style="word-break: break-word; white-space: normal;"
										>{item.url}</TableCell
									>
									<TableCell>{item.location}</TableCell>
								</TableRow>
							{/each}
						</TableBody>
					</Table>
				{/if}
			</Accordion.Content>
		</Accordion.Item>

		<!-- GoPro -->
		<Accordion.Item value="gopro">
			<Accordion.Trigger onclick={() => loadModuleDataOnExpand('gopro')}>GoPro</Accordion.Trigger>
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
							{#each goProData as item}
								<TableRow>
									<TableCell>{item.id}</TableCell>
									<TableCell>{item.name}</TableCell>
									<TableCell>{item.info}</TableCell>
									<TableCell style="word-break: break-word; white-space: normal;"
										>{item.url}</TableCell
									>
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
			<Accordion.Trigger onclick={() => loadModuleDataOnExpand('hass')}
				>Home Assistant</Accordion.Trigger
			>
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
							{#each hassData as item}
								<TableRow>
									<TableCell>{item.id}</TableCell>
									<TableCell>{item.name}</TableCell>
									<TableCell>{item.info}</TableCell>
									<TableCell style="word-break: break-word; white-space: normal;"
										>{item.url}</TableCell
									>
									<TableCell>{item.location}</TableCell>
								</TableRow>
							{/each}
						</TableBody>
					</Table>
				{/if}
			</Accordion.Content>
		</Accordion.Item>

		<!-- V4L2 -->
		<Accordion.Item value="v4l2">
			<Accordion.Trigger onclick={() => loadModuleDataOnExpand('v4l2')}
				>V4L2 (Linux Video)</Accordion.Trigger
			>
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
							{#each v4l2Data as item}
								<TableRow>
									<TableCell>{item.id}</TableCell>
									<TableCell>{item.name}</TableCell>
									<TableCell>{item.info}</TableCell>
									<TableCell style="word-break: break-word; white-space: normal;"
										>{item.url}</TableCell
									>
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
			<Accordion.Trigger onclick={() => loadModuleDataOnExpand('webtorrent')}
				>WebTorrent Shares</Accordion.Trigger
			>
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
							{#each webTorrentData as item}
								<TableRow>
									<TableCell>{item.id}</TableCell>
									<TableCell>{item.name}</TableCell>
									<TableCell>{item.info}</TableCell>
									<TableCell style="word-break: break-word; white-space: normal;"
										>{item.url}</TableCell
									>
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

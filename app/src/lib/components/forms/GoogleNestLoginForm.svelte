<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';

	type GoogleNestLoginData = {
		client_id: string;
		client_secret: string;
		refresh_token: string;
		project_id: string;
	};

	type Props = {
		disabled?: boolean;
		onsubmit?: (data: GoogleNestLoginData) => void;
	};

	let { disabled = false, onsubmit }: Props = $props();

	let formData = $state<GoogleNestLoginData>({
		client_id: '',
		client_secret: '',
		refresh_token: '',
		project_id: ''
	});

	function handleSubmit(event: Event) {
		event.preventDefault();

		if (
			!formData.client_id ||
			!formData.client_secret ||
			!formData.refresh_token ||
			!formData.project_id
		) {
			alert('Please fill in all fields');
			return;
		}

		onsubmit?.({ ...formData });

		// Reset form after successful submission
		formData = {
			client_id: '',
			client_secret: '',
			refresh_token: '',
			project_id: ''
		};
	}
</script>

<form onsubmit={handleSubmit} class="space-y-3" role="group" aria-labelledby="nest-login-heading">
	<div class="flex gap-4">
		<div class="flex-1">
			<Input
				type="text"
				placeholder="Client ID"
				bind:value={formData.client_id}
				{disabled}
				aria-label="Google Cloud Client ID"
				required
			/>
		</div>
		<div class="flex-1">
			<Input
				type="password"
				placeholder="Client Secret"
				bind:value={formData.client_secret}
				{disabled}
				aria-label="Google Cloud Client Secret"
				required
			/>
		</div>
	</div>
	<div class="flex gap-4">
		<div class="flex-1">
			<Input
				type="password"
				placeholder="Refresh Token"
				bind:value={formData.refresh_token}
				{disabled}
				aria-label="Google Cloud Refresh Token"
				required
			/>
		</div>
		<div class="flex-1">
			<Input
				type="text"
				placeholder="Project ID"
				bind:value={formData.project_id}
				{disabled}
				aria-label="Google Cloud Project ID"
				required
			/>
		</div>
	</div>
	<div class="flex justify-end">
		<Button type="submit" {disabled}>Login</Button>
	</div>
</form>

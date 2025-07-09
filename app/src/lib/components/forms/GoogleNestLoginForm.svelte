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
		formData = { client_id: '', client_secret: '', refresh_token: '', project_id: '' };
	}
</script>

<form
	onsubmit={handleSubmit}
	class="space-y-3"
	role="group"
	aria-labelledby="google-nest-login-heading"
>
	<div class="grid grid-cols-2 gap-4">
		<div>
			<Input
				type="text"
				placeholder="Client ID"
				bind:value={formData.client_id}
				{disabled}
				aria-label="Google Nest client ID"
				required
				minlength={10}
				maxlength={100}
				title="Client ID must be 10-100 characters"
			/>
		</div>
		<div>
			<Input
				type="password"
				placeholder="Client Secret"
				bind:value={formData.client_secret}
				{disabled}
				aria-label="Google Nest client secret"
				required
				minlength={10}
				maxlength={100}
				title="Client secret must be 10-100 characters"
			/>
		</div>
	</div>
	<div class="grid grid-cols-2 gap-4">
		<div>
			<Input
				type="text"
				placeholder="Refresh Token"
				bind:value={formData.refresh_token}
				{disabled}
				aria-label="Google Nest refresh token"
				required
				minlength={10}
				maxlength={200}
				title="Refresh token must be 10-200 characters"
			/>
		</div>
		<div>
			<Input
				type="text"
				placeholder="Project ID"
				bind:value={formData.project_id}
				{disabled}
				aria-label="Google Nest project ID"
				required
				minlength={5}
				maxlength={50}
				pattern="[a-zA-Z0-9-]+"
				title="Project ID: letters, numbers, and hyphens only (5-50 chars)"
			/>
		</div>
	</div>
	<div class="flex justify-end">
		<Button type="submit" {disabled}>Login</Button>
	</div>
</form>

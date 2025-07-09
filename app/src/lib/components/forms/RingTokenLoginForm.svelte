<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';

	type RingTokenLoginData = {
		refresh_token: string;
	};

	type Props = {
		disabled?: boolean;
		onsubmit?: (data: RingTokenLoginData) => void;
	};

	let { disabled = false, onsubmit }: Props = $props();

	let formData = $state<RingTokenLoginData>({
		refresh_token: ''
	});

	function handleSubmit(event: Event) {
		event.preventDefault();

		if (!formData.refresh_token) {
			alert('Please enter refresh token');
			return;
		}

		onsubmit?.({ ...formData });

		// Reset form after successful submission
		formData = { refresh_token: '' };
	}
</script>

<form onsubmit={handleSubmit} class="flex gap-4" role="group" aria-labelledby="ring-token-heading">
	<div class="flex-1">
		<Input
			type="text"
			placeholder="Refresh Token"
			bind:value={formData.refresh_token}
			{disabled}
			aria-label="Ring refresh token"
			required
			minlength={20}
			maxlength={500}
			title="Refresh token must be at least 20 characters"
		/>
	</div>
	<Button type="submit" {disabled}>Login</Button>
</form>

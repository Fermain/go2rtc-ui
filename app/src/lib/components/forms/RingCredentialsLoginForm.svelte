<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';

	type RingCredentialsLoginData = {
		email: string;
		password: string;
		code?: string;
	};

	type Props = {
		disabled?: boolean;
		onsubmit?: (data: RingCredentialsLoginData) => void;
	};

	let { disabled = false, onsubmit }: Props = $props();

	let formData = $state<RingCredentialsLoginData>({
		email: '',
		password: '',
		code: ''
	});

	function handleSubmit(event: Event) {
		event.preventDefault();

		if (!formData.email || !formData.password) {
			alert('Please fill in email and password');
			return;
		}

		onsubmit?.({ ...formData });

		// Reset form after successful submission
		formData = { email: '', password: '', code: '' };
	}
</script>

<form
	onsubmit={handleSubmit}
	class="space-y-3"
	role="group"
	aria-labelledby="ring-credentials-heading"
>
	<div class="flex gap-4">
		<div class="flex-1">
			<Input
				type="email"
				placeholder="Email"
				bind:value={formData.email}
				{disabled}
				aria-label="Ring account email"
				required
				maxlength={100}
				title="Must be a valid email address"
			/>
		</div>
		<div class="flex-1">
			<Input
				type="password"
				placeholder="Password"
				bind:value={formData.password}
				{disabled}
				aria-label="Ring account password"
				required
				minlength={6}
				maxlength={100}
				title="Password must be at least 6 characters"
			/>
		</div>
	</div>
	<div class="flex gap-4">
		<div class="flex-1">
			<Input
				type="text"
				placeholder="2FA Code (optional)"
				bind:value={formData.code}
				{disabled}
				aria-label="Two-factor authentication code"
				pattern="[0-9]{6}"
				maxlength={6}
				title="6-digit numeric code"
			/>
		</div>
		<Button type="submit" {disabled}>Login</Button>
	</div>
</form>

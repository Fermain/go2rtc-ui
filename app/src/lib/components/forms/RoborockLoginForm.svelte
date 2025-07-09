<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';

	type RoborockLoginData = {
		username: string;
		password: string;
	};

	type Props = {
		disabled?: boolean;
		onsubmit?: (data: RoborockLoginData) => void;
	};

	let { disabled = false, onsubmit }: Props = $props();

	let formData = $state<RoborockLoginData>({
		username: '',
		password: ''
	});

	function handleSubmit(event: Event) {
		event.preventDefault();

		if (!formData.username || !formData.password) {
			alert('Please fill in both username and password');
			return;
		}

		onsubmit?.({ ...formData });

		// Reset form after successful submission
		formData = { username: '', password: '' };
	}
</script>

<form
	onsubmit={handleSubmit}
	class="space-y-3"
	role="group"
	aria-labelledby="roborock-login-heading"
>
	<div class="flex gap-4">
		<div class="flex-1">
			<Input
				type="text"
				placeholder="Username"
				bind:value={formData.username}
				{disabled}
				aria-label="Roborock username"
				required
				minlength={3}
				maxlength={50}
				title="Username must be 3-50 characters"
			/>
		</div>
		<div class="flex-1">
			<Input
				type="password"
				placeholder="Password"
				bind:value={formData.password}
				{disabled}
				aria-label="Roborock password"
				required
				minlength={6}
				maxlength={100}
				title="Password must be at least 6 characters"
			/>
		</div>
	</div>
	<div class="flex justify-end">
		<Button type="submit" {disabled}>Login</Button>
	</div>
</form>

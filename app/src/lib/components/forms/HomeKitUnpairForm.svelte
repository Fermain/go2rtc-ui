<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';

	type HomeKitUnpairData = {
		id: string;
	};

	type Props = {
		disabled?: boolean;
		onsubmit?: (data: HomeKitUnpairData) => void;
	};

	let { disabled = false, onsubmit }: Props = $props();

	let formData = $state<HomeKitUnpairData>({
		id: ''
	});

	function handleSubmit(event: Event) {
		event.preventDefault();

		if (!formData.id) {
			alert('Please enter stream ID');
			return;
		}

		onsubmit?.({ ...formData });

		// Reset form after successful submission
		formData = { id: '' };
	}
</script>

<form
	onsubmit={handleSubmit}
	class="flex gap-4"
	role="group"
	aria-labelledby="homekit-unpair-heading"
>
	<div class="flex-1">
		<Input
			type="text"
			placeholder="Stream ID"
			bind:value={formData.id}
			{disabled}
			aria-label="Stream ID"
			required
			minlength={1}
			maxlength={50}
			pattern="[a-zA-Z0-9_-]+"
			title="Only letters, numbers, underscores, and hyphens allowed"
		/>
	</div>
	<Button type="submit" {disabled}>Unpair</Button>
</form>

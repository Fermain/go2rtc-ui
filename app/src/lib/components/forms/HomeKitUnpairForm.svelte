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
			alert('Please provide a Stream ID');
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
		/>
	</div>
	<Button type="submit" {disabled}>Unpair</Button>
</form>

<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';

	type HomeKitPairData = {
		id: string;
		url: string;
		pin: string;
	};

	type Props = {
		disabled?: boolean;
		onsubmit?: (data: HomeKitPairData) => void;
	};

	let { disabled = false, onsubmit }: Props = $props();

	let formData = $state<HomeKitPairData>({
		id: '',
		url: '',
		pin: ''
	});

	function handleSubmit(event: Event) {
		event.preventDefault();

		if (!formData.id || !formData.url || !formData.pin) {
			alert('Please fill in all fields');
			return;
		}

		onsubmit?.({ ...formData });

		// Reset form after successful submission
		formData = { id: '', url: '', pin: '' };
	}
</script>

<form onsubmit={handleSubmit} class="space-y-3" role="group" aria-labelledby="homekit-pair-heading">
	<div class="flex gap-4">
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
		<div class="flex-1">
			<Input
				type="text"
				placeholder="HomeKit URL"
				bind:value={formData.url}
				{disabled}
				aria-label="HomeKit URL"
				required
			/>
		</div>
	</div>
	<div class="flex gap-4">
		<div class="flex-1">
			<Input
				type="text"
				placeholder="HomeKit PIN"
				bind:value={formData.pin}
				{disabled}
				aria-label="HomeKit PIN"
				required
			/>
		</div>
		<Button type="submit" {disabled}>Pair</Button>
	</div>
</form>

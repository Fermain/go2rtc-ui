<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';

	type TempStreamData = {
		name: string;
		src: string;
	};

	type Props = {
		disabled?: boolean;
		onsubmit?: (data: TempStreamData) => void;
	};

	let { disabled = false, onsubmit }: Props = $props();

	let formData = $state<TempStreamData>({
		name: '',
		src: ''
	});

	function handleSubmit(event: Event) {
		event.preventDefault();

		if (!formData.name || !formData.src) {
			alert('Please fill in both name and URL');
			return;
		}

		onsubmit?.({ ...formData });

		// Reset form after successful submission
		formData = { name: '', src: '' };
	}
</script>

<form onsubmit={handleSubmit} class="flex gap-4" role="group" aria-labelledby="temp-stream-heading">
	<div class="flex-1">
		<Input
			type="text"
			placeholder="Stream name"
			bind:value={formData.name}
			{disabled}
			aria-label="Stream name"
			required
		/>
	</div>
	<div class="flex-1">
		<Input
			type="text"
			placeholder="Stream URL"
			bind:value={formData.src}
			{disabled}
			aria-label="Stream URL"
			required
		/>
	</div>
	<Button type="submit" {disabled}>Add</Button>
</form>

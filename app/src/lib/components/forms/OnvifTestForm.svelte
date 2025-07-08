<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';

	type OnvifTestData = {
		src: string;
	};

	type Props = {
		disabled?: boolean;
		onsubmit?: (data: OnvifTestData) => void;
	};

	let { disabled = false, onsubmit }: Props = $props();

	let formData = $state<OnvifTestData>({
		src: 'onvif://user:pass@192.168.1.123:80'
	});

	function handleSubmit(event: Event) {
		event.preventDefault();

		if (!formData.src) {
			alert('Please provide an ONVIF URL');
			return;
		}

		onsubmit?.({ ...formData });
	}
</script>

<form onsubmit={handleSubmit} class="flex gap-4" role="group" aria-labelledby="onvif-test-heading">
	<div class="flex-1">
		<Input
			type="text"
			placeholder="onvif://user:pass@192.168.1.123:80"
			bind:value={formData.src}
			{disabled}
			aria-label="ONVIF URL"
			required
		/>
	</div>
	<Button type="submit" {disabled}>Test</Button>
</form>

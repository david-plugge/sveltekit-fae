<script lang="ts">
	import { fae } from '../actions/fae.js';

	const form = fae.newsletter.subscribe.createForm();
</script>

<form
	id="subscribe-to-newsletter"
	action="?{form.queryParam}#subscribe-to-newsletter"
	method="post"
	class="bg-neutral-800 rounded-lg p-4 flex flex-col gap-4 mx-auto max-w-lg"
>
	<div class="text-xl">Subscribe to newsletter</div>

	<div class="flex flex-col gap-2">
		<label for="email">Email</label>
		<input class="bg-neutral-900 text-white border-none" id="email" name="email" type="text" />
		{#if $form.data?.errors?.email}
			<p class="error">{$form.data.errors.email}</p>
		{/if}
	</div>

	<button
		disabled={$form.isLoading}
		type="submit"
		class="bg-blue-600 font-semibold px-4 py-2 hover:bg-blue-700 transition-colors"
	>
		Subscribe
	</button>
</form>

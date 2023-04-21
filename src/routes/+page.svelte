<script lang="ts">
	import { fae } from '../actions/fae.js';

	const form = fae.auth.signin.createForm();
</script>

<form
	use:form.enhance
	action={form.action}
	method="post"
	class="mx-auto max-w-md bg-neutral-800 rounded-lg p-4 flex flex-col gap-4 mt-32"
>
	<div class="flex flex-col gap-2">
		<label for="username">Username</label>
		<input
			class="bg-neutral-900 text-white border-none"
			id="username"
			name="username"
			type="text"
			value={$form.data?.values?.username ?? ''}
		/>
		{#if $form.data?.errors?.username}
			<p class="error">{$form.data.errors.username}</p>
		{/if}
	</div>
	<div class="flex flex-col gap-2">
		<label for="password">Password</label>
		<input
			class="bg-neutral-900 text-white border-none"
			id="password"
			name="password"
			type="password"
		/>
		{#if $form.data?.errors?.password}
			<p class="error">{$form.data.errors.password}</p>
		{/if}
	</div>

	<button
		disabled={$form.isLoading}
		type="submit"
		class="bg-blue-600 font-semibold px-4 py-2 hover:bg-blue-700 transition-colors">Sign in</button
	>
</form>

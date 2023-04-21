<script lang="ts">
	import '../app.css';
	import SigninForm from './SigninForm.svelte';
	import SubscribeForm from './SubscribeForm.svelte';
</script>

<div class="min-h-screen flex flex-col">
	<header class="flex justify-center bg-neutral-800">
		<SigninForm />
	</header>

	<main class="flex-1">
		<slot />
	</main>

	<footer class="flex justify-center bg-neutral-800">
		<SubscribeForm />
	</footer>
</div>

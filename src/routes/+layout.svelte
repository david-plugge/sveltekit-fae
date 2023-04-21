<script lang="ts">
	import '../app.css';
	import SigninForm from './SigninForm.svelte';
	import SubscribeForm from './SubscribeForm.svelte';
</script>

<div class="min-h-screen flex flex-col">
	<header class="flex justify-center items-center bg-neutral-800">
		<SigninForm />
		<a href="#subscribe-to-newsletter" class="underline text-blue-500">subscribe to newsletter</a>
	</header>

	<main class="flex-1">
		<slot />
	</main>

	<footer class="flex justify-center bg-neutral-800 p-8">
		<SubscribeForm />
	</footer>
</div>

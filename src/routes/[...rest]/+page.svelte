<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="h-screen flex flex-col items-center justify-center">
	<h1>
		Hello from <span class="bg-neutral-800 rounded-lg px-2 py-1 inline-block">
			{$page.url.pathname}
		</span>
	</h1>
</div>

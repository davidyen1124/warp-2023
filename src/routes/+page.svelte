<script lang="ts">
	import App from '$lib/components/App.svelte';
	import '../app.css';
</script>

<div>
	<App />
</div>

<section>
	<h1 class="text-4xl text-white">roomba time!</h1>
	<h3 class="text-xl italic text-white">why must we clean? is there no end?</h3>
	<br />
	<p>wasd / arrow keys to navigate</p>
	<p>SPACE / ENTER to empty dust</p>
</section>

<style>
	:global(body) {
		margin: 0;
	}

	div {
		position: fixed;
		width: 100vw;
		height: 100vh;
		/* background: rgb(178, 174, 156); */
		/* background: rgb(13, 19, 32); */
		background: linear-gradient(180deg, rgba(13, 19, 32, 1) 0%, rgba(8, 12, 21, 1) 100%);
	}

	section {
		left: 10px;
		top: 10px;
		position: absolute;
	}

	p {
		@apply text-white;
	}
</style>

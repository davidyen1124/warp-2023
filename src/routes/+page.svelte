<script lang="ts">
	import App from '$lib/components/App.svelte';

	// import { socket } from '$lib/socket-client';
	// import { onMount } from 'svelte';
	// onMount(() => {
	// 	socket.on('eventFromServer', (e) => {
	// 		console.log(e);
	// 	});

	// 	// socket.emit('eventFromClient', 'hello');
	// });
</script>

<div>
	<App />
</div>

<style>
	:global(body) {
		margin: 0;
	}

	div {
		position: fixed;
		width: 100vw;
		height: 100vh;
		/* background: rgb(13, 19, 32); */
		background: linear-gradient(180deg, rgba(13, 19, 32, 1) 0%, rgba(8, 12, 21, 1) 100%);
	}
</style>

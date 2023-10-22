import { webSocketServer } from '$lib/socket-server';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), webSocketServer],
	ssr: {
		noExternal: ['three']
	}
});

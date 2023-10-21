<script lang="ts">
	import type { Player } from '$lib';
	import { T } from '@threlte/core';
	import { ContactShadows, Float, Grid, OrbitControls } from '@threlte/extras';

	import { interactivity } from '@threlte/extras';
	interactivity();

	export let props: Player;
</script>

<T.Mesh
	position={[props.position.x, props.position.y, 0]}
	on:pointerenter={() => console.log('mouseover')}
	on:click={() => console.log('clicked')}
>
	<T.CylinderGeometry />
	<T.MeshStandardMaterial color="#F8EBCE" />
</T.Mesh>

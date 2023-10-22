<script lang="ts">
	import type { Item } from '$lib';
	import { T } from '@threlte/core';
	import { ContactShadows, Float, Grid, OrbitControls } from '@threlte/extras';

	import { interactivity } from '@threlte/extras';
	import { randFloat } from 'three/src/math/MathUtils.js';
	interactivity();

	export let props: Item;
</script>

{#if props.cleaned == false}
	<Float floatIntensity={1} rotationIntensity={0.1} rotationSpeed={1}>
		<T.Mesh
			position={[props.position.x, 0, props.position.y]}
			on:pointerenter={() => console.log('mouseover')}
			on:click={() => console.log('clicked')}
			scale={0.1}
		>
			<T.BoxGeometry />
			<T.MeshStandardMaterial color={[randFloat(0, 1), randFloat(0, 1), randFloat(0, 1)]} />
		</T.Mesh>
	</Float>
{/if}

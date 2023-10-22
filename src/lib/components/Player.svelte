<script lang="ts">
	import type { Player } from '$lib';
	import { T } from '@threlte/core';
	import { ContactShadows, Float, Grid, OrbitControls } from '@threlte/extras';
	import { AutoColliders, RigidBody } from '@threlte/rapier';

	export let props: Player;
</script>

<T.Group position={[props.position.x, 0.125, props.position.y]} rotation={[0, -props.heading, 0]}>
	<T.Mesh>
		<T.CylinderGeometry args={[1, 1, 0.5]} />
		<T.MeshStandardMaterial color={[0.1, 0.1, 0.1]} />
	</T.Mesh>
	<T.Mesh position={[0.3, 0.25, 0]}>
		<T.CylinderGeometry args={[0.5, 0.5, 0.1]} />
		<T.MeshStandardMaterial color={[0.05, 0.05, 0.05]} />
	</T.Mesh>
	<T.Mesh position={[0.6, 0, 0]}>
		<T.BoxGeometry args={[1, 0.4, 1]} />
		<T.MeshStandardMaterial color={1} opacity={0.5} transparent />
	</T.Mesh>
</T.Group>

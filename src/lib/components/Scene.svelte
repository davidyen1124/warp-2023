<script lang="ts">
	import { T } from '@threlte/core';
	import { ContactShadows, Float, Grid, OrbitControls } from '@threlte/extras';

	import Player from './Player.svelte';

	import { ItemType, defaultPlayer } from '$lib';
	import { randFloat } from 'three/src/math/MathUtils.js';
	import Item from './Item.svelte';
	import {
		MeshStandardMaterial,
		OrthographicCamera,
		PerspectiveCamera,
		PlaneGeometry
	} from 'three';

	const RANGE = 40;
	const AMOUNT = 500;

	let items: any = {};
	for (let i = 0; i < AMOUNT; i++) {
		items[i] = {
			id: i.toString(),
			position: { x: randFloat(-RANGE, RANGE), y: randFloat(-RANGE, RANGE) },
			type: ItemType.DEBRIS,
			cleaned: false
		};
	}

	let player = defaultPlayer;

	const dumpDebris = (player: any) => {
		console.log('called');
		player.collected.forEach((id: string) => {
			items[id].position = {
				x: player.position.x + randFloat(-1, 1) - 2 * Math.cos(player.heading),
				y: player.position.y + randFloat(-1, 1) - 2 * Math.sin(player.heading)
			};
			items[id].cleaned = false;
		});
		player.collected = new Set();
	};

	const dist = (a: any, b: any) => Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));

	const move = (d: number) => {
		player.position.x += d * Math.cos(player.heading);
		player.position.y += d * Math.sin(player.heading);

		for (let i = 0; i < AMOUNT; i++) {
			if (dist(player.position, items[i].position) < 1) {
				items[i].cleaned = true;
				player.collected.add(items[i].id);
			}
		}
		console.log(player.collected);
	};

	const handleKeydown = (e: any) => {
		switch (e.code) {
			case 'KeyD':
			case 'ArrowRight':
				player.heading += 0.1;
				break;
			case 'KeyA':
			case 'ArrowLeft':
				player.heading -= 0.1;
				break;
			case 'KeyW':
			case 'ArrowUp':
				move(0.1);
				break;
			case 'KeyS':
			case 'ArrowDown':
				move(-0.1);
				break;
			case 'Enter':
			case 'Space':
				dumpDebris(player);
				break;
		}
	};
</script>

<svelte:window on:keydown={handleKeydown} />

<T.PerspectiveCamera
	makeDefault
	position={[player.position.x - 10, 20, player.position.y + 10]}
	fov={20}
	zoom={0.4}
>
	<OrbitControls
		enableDamping
		target={[player.position.x, 0, player.position.y]}
		enablePan={true}
		enableZoom={true}
		enableRotate={true}
	/>
</T.PerspectiveCamera>

<T.DirectionalLight intensity={0.8} position.x={5} position.y={10} />
<T.AmbientLight intensity={0.8} />

<Grid
	position.y={-0.001}
	cellColor="#aaa"
	sectionColor="#aaa"
	sectionThickness={0}
	fadeDistance={25}
	cellSize={2}
	infiniteGrid
/>

<!-- <T.Mesh rotation={[0, Math.PI, 0]} scale={10}>
	<T.PlaneGeometry />
	<T.MeshStandardMaterial />
</T.Mesh> -->

<ContactShadows scale={10} blur={2} far={2.5} opacity={0.5} />

<Player props={player} />

{#each Object.entries(items) as [id, item]}
	<Item props={item} />
{/each}

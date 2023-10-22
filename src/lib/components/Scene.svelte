<script lang="ts">
	import { T } from '@threlte/core';
	import { Grid, OrbitControls } from '@threlte/extras';

	import Player from './Player.svelte';

	import { ItemType, defaultPlayer, type ItemProps, type ObstacleProps } from '$lib';
	import { randFloat, randInt } from 'three/src/math/MathUtils.js';
	import Item from './Item.svelte';
	import {
		MeshStandardMaterial,
		OrthographicCamera,
		PerspectiveCamera,
		PlaneGeometry
	} from 'three';
	import Obstacle from './Obstacle.svelte';

	import { socket } from '$lib/socket-client';
	import { onMount } from 'svelte';

	let status: string;
	let clientData: any = {};
	let serverData: any = {};
	onMount(() => {
		// update status when server tells us whether they approve or reject our request to join a room
		socket.on('connection-approve', function (data) {
			status = 'approve';
			clientData.id = socket.id;
			console.log('approved');
		});
		socket.on('connection-reject', function (data) {
			status = 'reject';
			console.log('rejected');
		});

		// update our copy everytime the server sends us an update
		socket.on('server-update', function (data) {
			serverData = data;
		});

		// socket.on('eventFromServer', (e) => {
		// 	console.log(e);
		// });
	});

	// obstacles
	const SPAWN_RANGE = 30;
	const OBSTACLE_AMOUNT = 15;

	let obstacles: ObstacleProps[] = [];
	for (let i = 0; i < OBSTACLE_AMOUNT; i++) {
		obstacles.push({
			position: {
				x: randFloat(-SPAWN_RANGE, SPAWN_RANGE),
				y: randFloat(-SPAWN_RANGE, SPAWN_RANGE)
			},
			type: randInt(0, 13)
		});
	}

	// items
	const AMOUNT = 1000;

	const ROTATE_AMOUNT = 0.1;
	const MOVE_AMOUNT = 0.1;

	let items: { [id: string]: ItemProps } = {};
	for (let i = 0; i < AMOUNT; i++) {
		items[i] = {
			id: i.toString(),
			position: {
				x: randFloat(-SPAWN_RANGE, SPAWN_RANGE),
				y: randFloat(-SPAWN_RANGE, SPAWN_RANGE)
			},
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
				player.heading += ROTATE_AMOUNT;
				break;
			case 'KeyA':
			case 'ArrowLeft':
				player.heading -= ROTATE_AMOUNT;
				break;
			case 'KeyW':
			case 'ArrowUp':
				move(MOVE_AMOUNT);
				break;
			case 'KeyS':
			case 'ArrowDown':
				move(-MOVE_AMOUNT);
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
	position={[player.position.x - 10, 15, player.position.y + 10]}
	fov={20}
	zoom={0.4}
>
	<OrbitControls
		enableDamping
		target={[player.position.x, 0, player.position.y]}
		enablePan={false}
		enableZoom={false}
		enableRotate={false}
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
	cellSize={3}
	infiniteGrid
/>

<Player props={player} />

{#each Object.entries(items) as [id, item]}
	<Item props={item} />
{/each}

{#each obstacles as o}
	<Obstacle props={o} />
{/each}

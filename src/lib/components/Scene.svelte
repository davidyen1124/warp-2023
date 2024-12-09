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

	import { onMount } from 'svelte';

	let clientData: any = {};
	let serverData: any = {};

	// obstacles
	const SPAWN_RANGE = 30;
	const OBSTACLE_AMOUNT = 15;
	const MOUSE_SENSITIVITY = 0.003;

	let obstacles: ObstacleProps[] = [];
	for (let i = 0; i < OBSTACLE_AMOUNT; i++) {
		obstacles.push({
			position: {
				x: randFloat(-SPAWN_RANGE, SPAWN_RANGE),
				z: randFloat(-SPAWN_RANGE, SPAWN_RANGE)
			},
			type: randInt(0, 13)
		});
	}

	// items
	const AMOUNT = 1000;

	const ROTATE_AMOUNT = 0.1;
	const MOVE_AMOUNT = 0.1;

	const ACCELERATION = 0.01;
	const DECELERATION = 0.9;
	const MAX_SPEED = 0.2;

	let velocity = { x: 0, z: 0 };
	let keysPressed = {
		up: false,
		down: false,
		left: false,
		right: false
	};

	let isPointerLocked = false;

	const handleMouseMove = (e: MouseEvent) => {
		if (isPointerLocked) {
			player.heading -= e.movementX * MOUSE_SENSITIVITY;
		}
	};

	const handleCanvasClick = (e: MouseEvent) => {
		const canvas = document.querySelector('canvas');
		if (canvas) {
			canvas.requestPointerLock();
		}
	};

	const handlePointerLockChange = () => {
		isPointerLocked = document.pointerLockElement === document.querySelector('canvas');
		document.body.classList.toggle('pointer-locked', isPointerLocked);
	};

	let items: { [id: string]: ItemProps } = {};
	for (let i = 0; i < AMOUNT; i++) {
		items[i] = {
			id: i.toString(),
			position: {
				x: randFloat(-SPAWN_RANGE, SPAWN_RANGE),
				z: randFloat(-SPAWN_RANGE, SPAWN_RANGE)
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
				z: player.position.z + randFloat(-1, 1) - 2 * Math.sin(player.heading)
			};
			items[id].cleaned = false;
		});
		player.collected = new Set();
	};

	const dist = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.z - b.z) ** 2);

	const handleKeydown = (e: any) => {
		switch (e.code) {
			case 'KeyW':
			case 'ArrowUp':
				keysPressed.up = true;
				break;
			case 'KeyS':
			case 'ArrowDown':
				keysPressed.down = true;
				break;
			case 'KeyA':
			case 'ArrowLeft':
				keysPressed.left = true;
				break;
			case 'KeyD':
			case 'ArrowRight':
				keysPressed.right = true;
				break;
			case 'Enter':
			case 'Space':
				dumpDebris(player);
				break;
		}
	};

	const handleKeyup = (e: any) => {
		switch (e.code) {
			case 'KeyW':
			case 'ArrowUp':
				keysPressed.up = false;
				break;
			case 'KeyS':
			case 'ArrowDown':
				keysPressed.down = false;
				break;
			case 'KeyA':
			case 'ArrowLeft':
				keysPressed.left = false;
				break;
			case 'KeyD':
			case 'ArrowRight':
				keysPressed.right = false;
				break;
		}
	};

	const updateMovement = () => {
		// Direction vectors: heading=0 means facing -Z.
		const forwardX = -Math.sin(player.heading);
		const forwardZ = -Math.cos(player.heading);

		const rightX = Math.cos(player.heading);
		const rightZ = -Math.sin(player.heading);

		// Compute acceleration based on keys
		let ax = 0;
		let az = 0;

		// Forward/backward
		if (keysPressed.up) {
			ax += forwardX * ACCELERATION;
			az += forwardZ * ACCELERATION;
		}
		if (keysPressed.down) {
			ax -= forwardX * ACCELERATION;
			az -= forwardZ * ACCELERATION;
		}

		// Strafe left/right
		if (keysPressed.left) {
			ax -= rightX * ACCELERATION;
			az -= rightZ * ACCELERATION;
		}
		if (keysPressed.right) {
			ax += rightX * ACCELERATION;
			az += rightZ * ACCELERATION;
		}

		// Update velocity with acceleration
		velocity.x += ax;
		velocity.z += az;

		// Apply deceleration/friction to gradually slow down when no keys are pressed
		velocity.x *= DECELERATION;
		velocity.z *= DECELERATION;

		// Clamp speed to MAX_SPEED
		const speed = Math.sqrt(velocity.x * velocity.x + velocity.z * velocity.z);
		if (speed > MAX_SPEED) {
			velocity.x = (velocity.x / speed) * MAX_SPEED;
			velocity.z = (velocity.z / speed) * MAX_SPEED;
		}

		// Update position directly
		player.position.x += velocity.x;
		player.position.z += velocity.z;

		requestAnimationFrame(updateMovement);
	};

	onMount(() => {
		// Start the movement update loop
		let animationFrameId = requestAnimationFrame(updateMovement);

		// Add pointer lock event listeners
		document.addEventListener('pointerlockchange', handlePointerLockChange);
		document.addEventListener('mozpointerlockchange', handlePointerLockChange);
		document.addEventListener('mousemove', handleMouseMove);

		const canvas = document.querySelector('canvas');
		if (canvas) {
			canvas.addEventListener('click', handleCanvasClick);
		}

		return () => {
			cancelAnimationFrame(animationFrameId);
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('pointerlockchange', handlePointerLockChange);
			document.removeEventListener('mozpointerlockchange', handlePointerLockChange);
			const canvas = document.querySelector('canvas');
			if (canvas) {
				canvas.removeEventListener('click', handleCanvasClick);
			}
		};
	});
</script>

<svelte:window on:keydown={handleKeydown} on:keyup={handleKeyup} />

<T.PerspectiveCamera
	makeDefault
	position={[player.position.x, 0.5, player.position.z]}
	rotation={[0, player.heading, 0]}
	fov={60}
/>

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

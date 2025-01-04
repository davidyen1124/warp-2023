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

	let gamepads: Record<number, Gamepad> = {};
	let lastButtonPressTime = 0;
	const BUTTON_COOLDOWN = 250; // 250ms cooldown between button presses

	// Called when a gamepad is connected
	function handleGamepadConnected(e: GamepadEvent) {
		gamepads[e.gamepad.index] = e.gamepad;
	}

	// Called when a gamepad is disconnected
	function handleGamepadDisconnected(e: GamepadEvent) {
		delete gamepads[e.gamepad.index];
	}

	// obstacles
	const SPAWN_RANGE = 30;
	const OBSTACLE_AMOUNT = 15;
	const ROTATION_SPEED = 0.003;

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

	let gamepadInput = {
		forward: 0, // -1 (back) to +1 (forward)
		strafe: 0, // -1 (left) to +1 (right)
		rotate: 0 // -1 (left) to +1 (right) for camera rotation
	};

	let isPointerLocked = false;

	const handleMouseMove = (e: MouseEvent) => {
		if (isPointerLocked) {
			player.heading -= e.movementX * ROTATION_SPEED;
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
		// Poll gamepads for input
		const connectedGamepads = navigator.getGamepads();
		for (let i = 0; i < connectedGamepads.length; i++) {
			const gp = connectedGamepads[i];
			if (!gp) continue; // skip empty slots

			// Left stick for movement
			const axisLeftRight = gp.axes[0]; // Left stick X
			const axisUpDown = gp.axes[1]; // Left stick Y
			const axisRightX = gp.axes[2]; // Right stick X

			// Apply deadzone to prevent drift
			const DEADZONE = 0.1;

			// Update gamepad input state with deadzoned values
			gamepadInput.forward = Math.abs(axisUpDown) > DEADZONE ? -axisUpDown : 0;
			gamepadInput.strafe = Math.abs(axisLeftRight) > DEADZONE ? axisLeftRight : 0;
			gamepadInput.rotate = Math.abs(axisRightX) > DEADZONE ? axisRightX : 0;

			// A button (index 0) for dumping debris with cooldown
			const currentTime = performance.now();
			if (gp.buttons[0].pressed && currentTime - lastButtonPressTime > BUTTON_COOLDOWN) {
				dumpDebris(player);
				lastButtonPressTime = currentTime;
			}
		}

		// Direction vectors: heading=0 means facing -Z.
		const forwardX = -Math.sin(player.heading);
		const forwardZ = -Math.cos(player.heading);

		const rightX = Math.cos(player.heading);
		const rightZ = -Math.sin(player.heading);

		// Compute acceleration based on both keyboard and gamepad
		let ax = 0;
		let az = 0;

		// Gamepad analog movement
		ax += forwardX * (gamepadInput.forward * ACCELERATION);
		az += forwardZ * (gamepadInput.forward * ACCELERATION);
		ax += rightX * (gamepadInput.strafe * ACCELERATION);
		az += rightZ * (gamepadInput.strafe * ACCELERATION);

		// Keyboard digital movement
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

		// Apply gamepad rotation
		player.heading -= gamepadInput.rotate * ROTATION_SPEED * 10;

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

		// Add gamepad event listeners
		window.addEventListener('gamepadconnected', handleGamepadConnected);
		window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

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
			window.removeEventListener('gamepadconnected', handleGamepadConnected);
			window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
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

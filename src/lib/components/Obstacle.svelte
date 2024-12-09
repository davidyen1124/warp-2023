<script lang="ts">
	import type { ObstacleProps } from '$lib';
	import { T } from '@threlte/core';
	import AirHockey from './models/air_hockey.svelte';
	import Bed from './models/bed.svelte';
	import CoffeeTable from './models/coffee_table.svelte';
	import Dresser from './models/dresser.svelte';
	import KitchenSink from './models/kitchen_sink.svelte';
	import KitchenTable from './models/kitchen_table.svelte';
	import LoungeChair from './models/lounge_chair.svelte';
	import MusicalInstrument from './models/musical_instrument.svelte';
	import OfficeTable from './models/office_table.svelte';
	import ScratchingPost from './models/scratching_post.svelte';
	import Sofa from './models/sofa.svelte';
	import Threlte from './models/threlte.svelte';
	import TrainingItem from './models/training_item.svelte';
	import TvWall from './models/tv_wall.svelte';
	import { randInt } from 'three/src/math/MathUtils.js';

	export let props: ObstacleProps;

	let options = [
		AirHockey,
		Bed,
		CoffeeTable,
		Dresser,
		KitchenSink,
		KitchenTable,
		LoungeChair,
		MusicalInstrument,
		OfficeTable,
		ScratchingPost,
		Sofa,
		Threlte,
		TrainingItem,
		TvWall
	];

	let type = props.type;
</script>

<T.Group
	position={[props.position.x, 0, props.position.z]}
	rotation={[0, randInt(0, 2) * Math.PI, 0]}
>
	<!-- <svelte:component this={options[type]} /> -->
	<!-- <Threlte /> -->
	{#if type == 0}
		<AirHockey scale={4} />
	{:else if type == 1}
		<Bed scale={4} />
	{:else if type == 2}
		<CoffeeTable scale={5} />
	{:else if type == 3}
		<Dresser scale={6} />
	{:else if type == 4}
		<KitchenSink scale={4} />
	{:else if type == 5}
		<KitchenTable scale={4} />
	{:else if type == 6}
		<LoungeChair scale={4} />
	{:else if type == 7}
		<MusicalInstrument scale={6} />
	{:else if type == 8}
		<OfficeTable scale={6} />
	{:else if type == 9}
		<ScratchingPost scale={10} />
	{:else if type == 10}
		<Sofa scale={5} />
	{:else if type == 11}
		<Threlte scale={1} />
	{:else if type == 12}
		<TrainingItem scale={4} />
	{:else if type == 13}
		<TvWall scale={5} />
	{/if}
</T.Group>

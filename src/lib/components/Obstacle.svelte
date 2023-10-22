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

</script>

<T.Group position={[props.position.x, 0, props.position.y]}>
	<svelte:component this={options[props.type]} />
	<!-- <Threlte /> -->
</T.Group>

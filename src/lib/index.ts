// place files you want to import through the `$lib` alias in this folder.

export type Position = {
	x: number;
	y: number;
};

export enum ItemType {
	DEBRIS = 'Debris',
	VALUABLE = 'Valuable'
}

export type ItemProps = {
	id: string;
	type: ItemType;
	position: Position;
	cleaned: boolean;
};

export enum ObstacleType {
	AIR_HOCKEY,
	BED,
	COFFEE_TABLE,
	DRESSER,
	KITCHEN_SINK,
	KITCHEN_TABLE,
	LOUNGE_CHAIR,
	MUSICAL_INSTRUMENT,
	OFFICE_TABLE,
	SCRATCHING_POST,
	SOFA,
	THRELTE,
	TRAINING_ITEM,
	TV_WALL
}

export type ObstacleProps = {
	position: Position;
	type: ObstacleType;
};

export type PlayerProps = {
	id: string;
	position: Position;
	heading: number;
	collected: Set<string>;
};

export const defaultPlayer: PlayerProps = {
	id: 'default',
	position: { x: 0, y: 0 },
	heading: 0,
	collected: new Set()
};

// export type Dustbin = {
// 	position: Position;
// };

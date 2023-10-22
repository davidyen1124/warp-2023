// place files you want to import through the `$lib` alias in this folder.

export type Position = {
	x: number;
	y: number;
};

export enum ItemType {
	DEBRIS = 'Debris',
	VALUABLE = 'Valuable'
}

export type Item = {
	id: string;
	type: ItemType;
	position: Position;
	cleaned: boolean;
};

export type Player = {
	id: string;
	position: Position;
	heading: number;
	collected: Set<string>;
};

export const defaultPlayer: Player = {
	id: 'default',
	position: { x: 0, y: 0 },
	heading: 0,
	collected: new Set()
};

export type Dustbin = {
	position: Position;
};

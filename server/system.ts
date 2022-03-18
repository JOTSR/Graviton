import { Body, Coord3D, Length, Time } from './definitions.ts';

export const field = 6.674_30e-11; //G
export const τ = 10 as Time;

export class System {
	/**
	 * Consrtuct a sandbox universe with fixed properties
	 * @param size 3D volume of the system
	 * @param bodiesQuantity Quantity of bodies which will placed randomly
	 */
	constructor(size: Coord3D<Length>, bodiesQuantity: number) {
	}

	/**
	 * Array of bodies of the system
	 */
	get bodies() {
		throw new Error('Not implemented');
	}

	/**
	 * Array of bodies of the system
	 */
	set bodies(bodies: Body[]) {
		throw new Error('Not implemented');
	}
}

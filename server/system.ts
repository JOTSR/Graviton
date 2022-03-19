import {
	Acceleration,
	Body,
	Coord2D,
	Length,
	Mass,
	Time,
} from './definitions.ts';

import { randomIntArray } from '../deps.ts';

export class System {
	#bodiesQuantity: number;
	#size: Coord2D<Length>;
	#bodies = [] as Body[];

	τ = 10 as Time;
	field = 6.674_30e-11; //G

	/**
	 * Consrtuct a sandbox universe with fixed properties
	 * @param size 2D volume of the system
	 * @param bodiesQuantity Quantity of bodies which will placed randomly
	 */
	constructor(size: Coord2D<Length>, bodiesQuantity: number) {
		this.#bodiesQuantity = bodiesQuantity;
		this.#size = size;
		this.generateBodies(1);
	}

	/**
	 * Array of bodies of the system
	 */
	get bodies() {
		return [...this.#bodies];
	}

	/**
	 * Array of bodies of the system
	 */
	set bodies(bodies: Body[]) {
		if (bodies.length !== this.#bodiesQuantity) {
			throw new RangeError(
				`Bodies[] length do not match bodiesQuantity: ${this.#bodiesQuantity}`,
			);
		}
		this.#bodies = bodies;
	}

	configFromUI(
		{ body, random_mass, mean_mass, update_time }: Record<string, string>,
	) {
		this.#bodiesQuantity = 10 ** Math.round(Number(body));
		this.τ = Number(update_time) as Time;
		this.generateBodies(Number(mean_mass), random_mass === 'on');
	}

	generateBodies(meanMass: number, randomMass = true) {
		for (let index = 0; index < this.#bodiesQuantity; index++) {
			const mass = (randomMass
				? meanMass * (0.5 + 0.5 * Math.random())
				: meanMass) as Mass;
			this.#bodies?.push({
				mass,
				position: randomIntArray(
					0,
					this.#size[0],
					this.#size.length,
				) as Coord2D<Length>,
				acceleration: [0, 0] as Coord2D<Acceleration>,
			});
		}
	}

	toPixelArray(): Uint8ClampedArray {
		const array = new Array(
			this.#size.reduce((prev, curr) => ((prev * curr) * 4) as Length),
		).fill(0) as number[];
		for (const { position } of this.#bodies) {
			//possible overflow > 255
			const index = matrixIndexToPixelLinearIndex(position, this.#size);
			const value = array[index] + 10;
			array.splice(index, 4, value, value, value, 255);
		}

		return Uint8ClampedArray.from(array);
	}
}

function matrixIndexToPixelLinearIndex(
	position: number[],
	matrixSize: number[],
): number {
	const rawIndex = position[0] * 4 + position[1] * matrixSize[1] * 4;
	const pixelArrayLength = matrixSize[0] * matrixSize[1] * 4;
	return rawIndex % pixelArrayLength;
}

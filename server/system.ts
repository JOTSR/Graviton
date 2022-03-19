import {
	Acceleration,
	Body,
	Coord2D,
	Length,
	Mass,
	Time,
} from './definitions.ts';

import { randomArray } from '../deps.ts';

export class System {
	#bodiesQuantity: number;
	#size: Coord2D<Length>;
	#bodies = [] as Body[];

	τ = 17 as Time;
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

	/**
	 * Update system from the UI controls form
	 * @param controls FormData
	 */
	configFromUI(
		{ bodies, random_mass, mean_mass, update_time }: Record<string, string>,
	) {
		this.#bodiesQuantity = 10 ** Math.round(Number(bodies));
		this.τ = Number(update_time) as Time;
		this.generateBodies(Number(mean_mass), random_mass === 'on');
	}

	/**
	 * Generate array of bodies of the system
	 * @param meanMass Mean mass of bodies
	 * @param randomMass Is a dispersion arround meanMass ?
	 */
	generateBodies(meanMass: number, randomMass = true) {
		const bodies: Body[] = [];
		for (let index = 0; index < this.#bodiesQuantity; index++) {
			const mass = (randomMass
				? meanMass * (0.5 + 0.5 * Math.random())
				: meanMass) as Mass;
			bodies.push({
				mass,
				position: randomArray(
					0,
					this.#size[0],
					this.#size.length,
				) as Coord2D<Length>,
				acceleration: [0, 0] as Coord2D<Acceleration>,
			});
		}
		this.#bodies = [...bodies];
	}

	/**
	 * Transform a 2d position matrix to a 1D pixel array
	 * @returns 8bits pixels array (RVBA)
	 */
	toPixelArray(): Uint8ClampedArray {
		const array = new Array(
			this.#size.reduce((prev, curr) => ((prev * curr) * 4) as Length),
		).fill(0) as number[];
		for (const { position } of this.#bodies) {
			//possible overflow > 255
			const index = matrixIndexToPixelLinearIndex(position, this.#size);
			const value = /*array[index] +*/ 255;
			array.splice(index, 4, value, value, value, 255);
		}

		return Uint8ClampedArray.from(array);
	}
}

/**
 * Compute the index in 1D îxe array from 2d position matrix
 * @param position body  position
 * @param matrixSize system size
 * @returns index in pixel array
 */
function matrixIndexToPixelLinearIndex(
	position: number[],
	matrixSize: number[],
): number {
	const rawIndex = Math.round(position[0]) * 4 +
		Math.round(position[1]) * matrixSize[1] * 4;
	const pixelArrayLength = matrixSize[0] * matrixSize[1] * 4;
	return rawIndex % pixelArrayLength;
}

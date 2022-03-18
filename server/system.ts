import {
	Acceleration,
	Body,
	Coord2D,
	Coord3D,
	Length,
	Mass,
	Time,
} from './definitions.ts';

export class System {
	#bodiesQuantity: number;
	#size: Coord3D<Length> | Coord2D<Length>;
	#bodies = [] as Body[];

	τ = 10 as Time;
	field = 6.674_30e-11; //G

	/**
	 * Consrtuct a sandbox universe with fixed properties
	 * @param size 3D volume of the system
	 * @param bodiesQuantity Quantity of bodies which will placed randomly
	 */
	constructor(size: Coord3D<Length> | Coord2D<Length>, bodiesQuantity: number) {
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
				//@ts-ignore same type of size
				position: this.#size.map((coord) =>
					coord * Math.random()
				),
				acceleration: [0, 0, 0] as Coord3D<Acceleration>,
			});
		}
	}
}

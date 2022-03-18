import { Coord3D, Length } from './definitions.ts';
import { Display } from './display.ts';
import { updatePosition } from './gravitation.ts';
import { field, System, τ } from './system.ts';

const system = new System([10, 10, 10] as Coord3D<Length>, 200);

const display = new Display(system);

await display.start();

while (false) {
	const bodies = system.bodies;

	const updatedBodies = updatePosition(bodies, field, τ);

	display.update(bodies);

	system.bodies = updatedBodies;
}

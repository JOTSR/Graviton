import { Coord3D, Length } from './definitions.ts';
import { Display } from './display.ts';
import { updatePosition } from './gravitation.ts';
import { System } from './system.ts';

const system = new System([10, 10, 10] as Coord3D<Length>, 200);

const display = new Display(system);

display.start();

setInterval(() => {
	const { bodies, field, τ } = system;

	const updatedBodies = updatePosition(bodies, field, τ);
	display.update();

	system.bodies = updatedBodies;
}, 0);

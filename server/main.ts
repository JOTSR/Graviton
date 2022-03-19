import { Coord2D, Length } from './definitions.ts';
import { Display } from './display.ts';
import { updatePosition } from './gravitation.ts';
import { System } from './system.ts';

const system = new System([800, 800] as Coord2D<Length>, 1e5);

const display = new Display(system);

display.start();

setInterval(() => {
	const { bodies, field, τ } = system;

	const updatedBodies = updatePosition(bodies, field, τ);
	display.update(system.toPixelArray());

	system.bodies = updatedBodies;
}, 17);
//60 fps max

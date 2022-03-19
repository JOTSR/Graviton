import { Acceleration, Coord2D, Length, Mass } from './definitions.ts';
import { Display } from './display.ts';
import { updatePosition } from './gravitation.ts';
import { System } from './system.ts';

const system = new System([800, 800] as Coord2D<Length>, 1e3);

const display = new Display(system);

//Black hole
system.bodies[0].mass = 1e5 as Mass;
system.bodies[0].acceleration = [0, 0] as Coord2D<Acceleration>;
system.bodies[0].position = [400, 400] as Coord2D<Length>;
system.bodies[0].color = [255, 0, 0];

display.start();

/**
 * Update bodies position at the given interval in ms
 */
setInterval(() => {
	const { bodies, field, τ } = system;

	const updatedBodies = updatePosition(bodies, field, τ);
	display.update(system.toPixelArray());

	system.bodies = updatedBodies;
}, 17);
//60 fps max

import { Acceleration, Coord2D, Length, Mass } from './definitions.ts';
import { Display } from './ui/display.ts';
import { updatePosition } from './model/position.ts';
import { System } from './system/system.ts';

const system = new System([800, 800] as Coord2D<Length>, 1e3); //System 2d of 800x800 with 1000 random bodies
const display = new Display(system);

//Black hole for testing a central mass orbitation
system.bodies[0].mass = 1e5 as Mass;
system.bodies[0].acceleration = [0, 0] as Coord2D<Acceleration>;
system.bodies[0].position = [400, 400] as Coord2D<Length>;
system.bodies[0].color = [0, 255, 0];

display.start();

/**
 * Update bodies position at the given interval in ms
 */
setInterval(() => {
	const { bodies, field, τ } = system;
	display.update(system.toPixelArray());
	const updatedBodies = updatePosition(bodies, field, τ);
	system.bodies = updatedBodies;
}, 17);
//60 fps max

import { Acceleration, Body, Coord2D } from '../definitions.ts';

export function computeAcceleration(
	refBody: Body,
	field: number,
	...otherBodies: Body[]
): Coord2D<Acceleration> {
	let accelerationX = refBody.acceleration[0] as number;
	let accelerationY = refBody.acceleration[1] as number;
	//Iterate on all bodies to compute acceleration of refBody
	for (const body of otherBodies) {
		const Δx = body.position[0] - refBody.position[0];
		if (Δx > 1e3) continue; //skip computations to diminish cpu load
		const Δy = body.position[1] - refBody.position[1];
		if (Δy > 1e3) continue; //skip computations to diminish cpu load

		if (Δx === 0 || Δy === 0) continue;
		//a = G * m_2 / r^2
		accelerationX += Math.sign(Δx) * field * body.mass / Δx ** 2;
		accelerationY += Math.sign(Δy) * field * body.mass / Δy ** 2;
	}
	return [accelerationX, accelerationY] as Coord2D<Acceleration>;
}

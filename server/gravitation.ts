import { Acceleration, Body, Coord2D, Length, Time } from './definitions.ts';

/**
 * Update the position of given bodies in function of time and G field
 * @param currentState Array of bodies
 * @param field Gravitaional constant
 * @param τ Time integration constant
 * @returns updated array of bodies
 */
export function updatePosition(
	currentState: Body[],
	field: number,
	τ: Time,
): Body[] {
	//Iterate over all bodies to update their position
	const updatedState = currentState.map(({ mass, position, acceleration }) => {
		const updatedAcceleration = computeAcceleration({
			mass,
			position,
			acceleration,
		}, ...currentState);
		//TODO express τ in ms and fix position rounding to avoid arbitrary constant
		const Δposition = acceleration.map((acc) => acc * (τ / 5) ** 2);
		const updatedPosition = position.map((coord, index) => {
			const rawUpdatedCoord = coord + Δposition[index];
			const updatedCoord = Math.round(rawUpdatedCoord) % 400 as Length;
			return updatedCoord;
		}) as Coord2D<Length>;

		return {
			mass,
			position: updatedPosition,
			acceleration: updatedAcceleration,
		};
	});

	//TODO Implement real physic model
	return updatedState;
}

function computeAcceleration(
	refBody: Body,
	...otherBodies: Body[]
): Coord2D<Acceleration> {
	const size = otherBodies.length;
	let accelerationX = refBody.acceleration[0] as number;
	let accelerationY = refBody.acceleration[1] as number;
	//TODO add mass and G
	for (const body of otherBodies) {
		if (body.position[0] === refBody.position[0]) continue;
		if (body.position[1] === refBody.position[1]) continue;
		accelerationX +=
			fastInvSqrt(body.position[0] ** 2 - refBody.position[0] ** 2) / size;
		accelerationY +=
			fastInvSqrt(body.position[1] ** 2 - refBody.position[1] ** 2) / size;
	}
	return [accelerationX, accelerationY] as Coord2D<Acceleration>;
}

/**
 * Fast inverse square root
 */
//https://fr.wikipedia.org/wiki/Racine_carr%C3%A9e_inverse_rapide
//https://stackoverflow.com/questions/41414426/faster-alternative-to-math-sqrt
const m = 0x5F375A86;
// Creating the buffer and view outside the function
// for performance, but this is not thread safe like so:
const buffer = new ArrayBuffer(4);
const view = new DataView(buffer);

function fastInvSqrt(n: number) {
	n = Math.abs(n);
	const n2 = n * 0.5;
	const th = 1.5;
	view.setFloat32(0, n);
	view.setUint32(0, m - (view.getUint32(0) >> 1));
	let f = view.getFloat32(0);
	f *= th - (n2 * f * f);
	f *= th - (n2 * f * f);
	return f;
}

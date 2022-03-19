import { Body, Length, Time } from './definitions.ts';

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
	const updatedState = currentState.map(({ mass, position, acceleration }) => {
		const updatedPosition = position.map((coord) => {
			// return coord
			return (coord + 1e-4 * Math.random()) % 800 as Length;
		}) as typeof position;

		return { mass, position: updatedPosition, acceleration };
	});

	//Implement real physic model
	return updatedState;
}

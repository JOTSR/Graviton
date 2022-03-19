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
	//Iterate over all bodies to update their position
	const updatedState = currentState.map(({ mass, position, acceleration }) => {
		const updatedPosition = position.map((coord) => {
			//random path
			const speed = (τ / (100 - 16)) + 1;
			const rawUpdatedCoord = coord + speed * (2 * Math.random() - 1);
			const updatedCoord = Math.round(rawUpdatedCoord) % 400 as Length;
			return updatedCoord;
		}) as typeof position;

		return { mass, position: updatedPosition, acceleration };
	});

	//TODO Implement real physic model
	return updatedState;
}

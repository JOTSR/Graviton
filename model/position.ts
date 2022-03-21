import { Body, Coord2D, Length, Time } from '../definitions.ts';
import { computeAcceleration } from './acceleration.ts';

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
		const updatedAcceleration = computeAcceleration(
			{
				mass,
				position,
				acceleration,
			},
			field,
			...currentState,
		);
		//TODO express τ in ms
		const Δposition = acceleration.map((acc) => acc * (τ / 100) ** 2);
		const updatedPosition = position.map((coord, index) =>
			coord + Δposition[index] as Length
		) as Coord2D<Length>;

		return {
			mass,
			position: updatedPosition,
			acceleration: updatedAcceleration,
		};
	});

	//TODO Implement real physic model
	return updatedState;
}

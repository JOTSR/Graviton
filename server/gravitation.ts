import { Body, Time } from './definitions.ts';

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
	const updatedState = currentState;
	throw new Error('Not implemented');
	return updatedState;
}

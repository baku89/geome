import {scalar} from 'linearly'

/**
 * EN: Normalize the angle to the range of -180 < angle <= 180.
 * @param degrees - The angle to normalize in degrees
 * @returns The normalized angle in degrees
 */
export function normalizeAngle(deg: number): number {
	const normalized = scalar.mod(deg, 360)
	if (normalized > 180) {
		return normalized - 360
	}
	return normalized
}

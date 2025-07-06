import {scalar, vec2} from 'linearly'

/**
 * A line represented by the angle of its normal vector (in degrees) and the signed distance from the origin.
 * Lines have direction, so two lines with opposite directions are considered different.
 * @category Types
 */
export type Line = {readonly theta: number; readonly offset: number}

/**
 * Functions for manipulating lines represented as {@link Line}.
 * @category Modules
 */
export namespace Line {
	/** A line parallel to the x-axis. */
	export const xAxis = Object.freeze({theta: 90, offset: 0})

	/** A line parallel to the y-axis. */
	export const yAxis = Object.freeze({theta: 0, offset: 0})

	/**
	 * Returns a line passing through the given two points.
	 * @param p1 The first point
	 * @param p2 The second point
	 * @returns A line passing through the given two points
	 */
	export function fromPoints(p1: vec2, p2: vec2): Line {
		// Normal vector is perpendicular to the line direction
		const delta = vec2.sub(p2, p1)
		const theta = scalar.mod(vec2.angle(delta) + 90, 360)

		// Calculate signed distance from origin
		const normal = vec2.dir(theta)
		const offset = vec2.dot(p1, normal)

		return {theta, offset}
	}

	/**
	 * Returns a line passing through the given point and making the given angle with the positive x-axis.
	 * @param p The point
	 * @param deg The angle in degrees
	 * @returns A line passing through the given point and making the given angle with the positive x-axis
	 */
	export function fromPointAngle(p: vec2, deg: number): Line {
		const theta = scalar.mod(deg + 90, 360)
		const normal = vec2.dir(theta)
		const offset = vec2.dot(p, normal)

		return {theta, offset}
	}

	/**
	 * Returns the closest point on the given line to the given point.
	 * @param l The line
	 * @param p The point
	 * @returns The closest point on the given line to the given point
	 */
	export function closest(l: Line, p: vec2): vec2 {
		const normal = vec2.dir(l.theta)

		// Distance from point to line along normal direction
		const t = vec2.dot(p, normal) - l.offset

		// Project point onto line
		return vec2.sub(p, vec2.scale(normal, t))
	}

	/**
	 * Returns the distance from the given point to the given line.
	 * @param l The line
	 * @param p The point
	 * @returns The distance from the given point to the given line
	 */
	export function distance(l: Line, p: vec2): number {
		const normal = vec2.dir(l.theta)
		return Math.abs(vec2.dot(p, normal) - l.offset)
	}

	/**
	 * Returns the intersection point of the given two lines.
	 * @param l1 The first line
	 * @param l2 The second line
	 * @returns The intersection point of the given two lines. Returns `null` if the lines are parallel.
	 */
	export function intersection(l1: Line, l2: Line): vec2 | null {
		// Convert lines to normal form: ax + by = c
		const normal1 = vec2.dir(l1.theta)
		const normal2 = vec2.dir(l2.theta)

		const a1 = normal1[0]
		const b1 = normal1[1]
		const c1 = l1.offset

		const a2 = normal2[0]
		const b2 = normal2[1]
		const c2 = l2.offset

		// Solve the system of equations using Cramer's rule
		const det = a1 * b2 - a2 * b1

		if (scalar.approx(det, 0)) {
			return null
		}

		const x = (c1 * b2 - c2 * b1) / det
		const y = (a1 * c2 - a2 * c1) / det

		return [x, y]
	}

	/**
	 * Returns whether the given two lines are approximately equal.
	 * @param l1 The first line
	 * @param l2 The second line
	 * @returns Whether the given two lines are approximately equal
	 */
	export function approx(l1: Line, l2: Line): boolean {
		// Normalize angles to 0-360 range
		const theta1 = ((l1.theta % 360) + 360) % 360
		const theta2 = ((l2.theta % 360) + 360) % 360

		// Check if angles are approximately equal (considering both directions)
		const angleDiff = Math.abs(theta1 - theta2)
		const isAngleEqual =
			scalar.approx(angleDiff, 0) || scalar.approx(angleDiff, 180)

		// If angles are equal, check offset
		if (isAngleEqual) {
			const offsetDiff = Math.abs(l1.offset - l2.offset)
			return scalar.approx(offsetDiff, 0)
		}

		return false
	}

	/**
	 * Returns whether the given two lines are parallel.
	 * @param l1 The first line
	 * @param l2 The second line
	 * @returns Whether the given two lines are parallel
	 */
	export function isParallel(l1: Line, l2: Line): boolean {
		// Normalize angles to 0-360 range
		const theta1 = ((l1.theta % 360) + 360) % 360
		const theta2 = ((l2.theta % 360) + 360) % 360

		// Check if angles are approximately equal or opposite
		const angleDiff = Math.abs(theta1 - theta2)
		return scalar.approx(angleDiff, 0) || scalar.approx(angleDiff, 180)
	}

	/**
	 * Returns whether the given two lines are perpendicular.
	 * @param l1 The first line
	 * @param l2 The second line
	 * @returns Whether the given two lines are perpendicular
	 */
	export function isPerpendicular(l1: Line, l2: Line): boolean {
		// Normalize angles to 0-360 range
		const theta1 = ((l1.theta % 360) + 360) % 360
		const theta2 = ((l2.theta % 360) + 360) % 360

		// Check if angles differ by 90 degrees
		const angleDiff = Math.abs(theta1 - theta2)
		return scalar.approx(angleDiff, 90) || scalar.approx(angleDiff, 270)
	}
}

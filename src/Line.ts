import {mat2d, scalar, vec2} from 'linearly'

/**
 * A line represented by the angle of its normal vector (in degrees) and the signed distance from the origin.
 * Lines have direction, so two lines with opposite directions are considered different.
 * @category Types
 */
export type Line = {
	/** The angle of the normal vector in degrees (should be normalized to 0-360) */
	readonly theta: number
	/** The signed distance from the origin */
	readonly offset: number
}

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
	 * Creates a line from theta and offset values.
	 * @param theta The angle of the normal vector in degrees (will be normalized to 0-360)
	 * @param offset The signed distance from the origin
	 * @returns A line with the given theta and offset
	 */
	export function of(theta: number, offset: number): Line {
		return {
			theta: scalar.mod(theta, 360),
			offset,
		}
	}

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
	 * Returns a line passing through the given point in the given direction.
	 * @param p The point
	 * @param deg The direction angle in degrees (0 = x+)
	 * @returns A line passing through the given point in the given direction
	 */
	export function fromPointDirection(p: vec2, deg: number): Line {
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
	 * Returns whether the given two lines are approximately equal. Lines with opposite direction are considered different.
	 * @param l1 The first line
	 * @param l2 The second line
	 * @returns Whether the given two lines are approximately equal
	 */
	export function approx(l1: Line, l2: Line): boolean {
		return (
			scalar.approx(l1.theta, l2.theta) && scalar.approx(l1.offset, l2.offset)
		)
	}

	/**
	 * Returns whether the given two lines are approximately equal, including lines with opposite directions.
	 * @param l1 The first line
	 * @param l2 The second line
	 * @returns Whether the given two lines are approximately equal (including opposite directions)
	 */
	export function same(l1: Line, l2: Line): boolean {
		// Check if lines are exactly the same
		if (approx(l1, l2)) {
			return true
		}

		// Check if lines have opposite directions (theta differs by 180 degrees)
		const oppositeTheta = scalar.mod(l1.theta + 180, 360)
		const oppositeLine: Line = {theta: oppositeTheta, offset: -l1.offset}

		return approx(oppositeLine, l2)
	}

	/**
	 * Returns whether the given two lines are parallel.
	 * @param l1 The first line
	 * @param l2 The second line
	 * @returns Whether the given two lines are parallel
	 */
	export function isParallel(l1: Line, l2: Line): boolean {
		const theta1 = scalar.mod(l1.theta, 180)
		const theta2 = scalar.mod(l2.theta, 180)

		return scalar.approx(theta1, theta2)
	}

	/**
	 * Returns whether the given two lines are perpendicular.
	 * @param l1 The first line
	 * @param l2 The second line
	 * @returns Whether the given two lines are perpendicular
	 */
	export function isPerpendicular(l1: Line, l2: Line): boolean {
		// Normalize angles to [0, 180) range and check if they differ by 90 degrees
		const theta1 = scalar.mod(l1.theta, 180)
		const theta2 = scalar.mod(l2.theta, 180)

		const angleDiff = Math.abs(theta1 - theta2)
		return scalar.approx(angleDiff, 90)
	}

	/**
	 * Returns a line with the opposite direction.
	 * @param line The line to invert
	 * @returns A line with the opposite direction
	 */
	export function invert(line: Line): Line {
		const oppositeTheta = scalar.mod(line.theta + 180, 360)
		return {theta: oppositeTheta, offset: -line.offset}
	}

	/**
	 * Returns a mat2d that reflects points across the given line.
	 * @param line The line to use as the axis of reflection
	 * @returns A mat2d transformation matrix for reflection
	 */
	export function reflectionMatrix(line: Line): mat2d {
		// Convert line to normal form: ax + by + c = 0
		// where (a, b) is the normal vector
		const [a, b] = vec2.dir(line.theta)
		const c = line.offset

		// Reflection matrix formula: I - 2 * n * n^T
		// where n is the normalized normal vector
		return [
			1 - 2 * a * a,
			-2 * a * b,
			-2 * a * b,
			1 - 2 * b * b,
			2 * c * a,
			2 * c * b,
		]
	}

	export function transform(line: Line, matrix: mat2d): Line {
		// Transform two points on the line using the matrix,
		// then create a new line from those transformed points

		const normal = vec2.dir(line.theta)

		// Get two points on the line by using the normal and offset
		// Point 1: closest point to origin
		const p1 = vec2.scale(normal, line.offset)

		// Point 2: move along line direction (perpendicular to normal)
		const p2 = vec2.dir(line.theta - 90, 1, p1)

		// Transform both points using the matrix
		const transformedP1 = vec2.transformMat2d(p1, matrix)
		const transformedP2 = vec2.transformMat2d(p2, matrix)

		// Create new line from transformed points
		return fromPoints(transformedP1, transformedP2)
	}
}

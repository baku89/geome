import {scalar, vec2} from 'linearly'

/**
 * A line represented as a equation of the form `ax + by + c = 0`. It does not distinguish the orientation of the line.
 * @category Types
 */
export type Line = {readonly a: number; readonly b: number; readonly c: number}

/**
 * Functions for manipulating lines represented as {@link Line}.
 * @category Modules
 */
export namespace Line {
	/** A line parallel to the x-axis. */
	export const xAxis = Object.freeze({a: 0, b: 1, c: 0})

	/** A line parallel to the y-axis. */
	export const yAxis = Object.freeze({a: 1, b: 0, c: 0})

	/**
	 * Returns a line passing through the given two points.
	 * @param p1 The first point
	 * @param p2 The second point
	 * @returns A line passing through the given two points
	 */
	export function fromPoints(p1: vec2, p2: vec2): Line {
		const a = p2[1] - p1[1]
		const b = p1[0] - p2[0]
		const c = p1[0] * p2[1] - p1[1] * p2[0]

		return {a, b, c}
	}

	/**
	 * Returns a line passing through the given point and making the given angle with the positive x-axis.
	 * @param p The point
	 * @param deg The angle in degrees
	 * @returns A line passing through the given point and making the given angle with the positive x-axis
	 */
	export function fromPointAngle(p: vec2, deg: number): Line {
		return {
			a: scalar.sin(deg),
			b: -scalar.cos(deg),
			c: p[0] * scalar.sin(deg) - p[1] * scalar.cos(deg),
		}
	}

	/**
	 * Returns the projection of the given point onto the given line.
	 * @param l The line
	 * @param p The point
	 * @returns The projection of the given point onto the given line
	 */
	export function project(l: Line, p: vec2): vec2 {
		const a = l.a
		const b = l.b
		const c = l.c

		const t = (a * p[0] + b * p[1] + c) / (a * a + b * b)
		return [p[0] - a * t, p[1] - b * t]
	}

	/**
	 * Returns the distance from the given point to the given line.
	 * @param l The line
	 * @param p The point
	 * @returns The distance from the given point to the given line
	 */
	export function distance(l: Line, p: vec2): number {
		return Math.abs((l.a * p[0] + l.b * p[1] + l.c) / vec2.len([l.a, l.b]))
	}

	/**
	 * Returns the intersection point of the given two lines.
	 * @param l1 The first line
	 * @param l2 The second line
	 * @returns The intersection point of the given two lines. Returns `null` if the lines are parallel.
	 */
	export function intersection(l1: Line, l2: Line): vec2 | null {
		const d = l1.a * l2.b - l1.b * l2.a

		if (scalar.approx(d, 0)) {
			return null
		}

		// Cramer's rule
		const x = (l1.c * l2.b - l1.b * l2.c) / d
		const y = (l1.a * l2.c - l1.c * l2.a) / d

		return [x, y]
	}

	/**
	 * Returns whether the given two lines are approximately equal.
	 * @param l1 The first line
	 * @param l2 The second line
	 * @returns Whether the given two lines are approximately equal
	 */
	export function approx(l1: Line, l2: Line): boolean {
		// First, normalize the lines and ensure normal vector points to 0-pi direction
		const len1 = vec2.len([l1.a, l1.b])
		const len2 = vec2.len([l2.a, l2.b])

		// Make sure a is positive, or if a is zero, b is positive
		const sign1 = l1.a > 0 || (l1.a === 0 && l1.b > 0) ? 1 : -1
		const sign2 = l2.a > 0 || (l2.a === 0 && l2.b > 0) ? 1 : -1

		const l1n = {
			a: (l1.a / len1) * sign1,
			b: (l1.b / len1) * sign1,
			c: (l1.c / len1) * sign1,
		}

		const l2n = {
			a: (l2.a / len2) * sign2,
			b: (l2.b / len2) * sign2,
			c: (l2.c / len2) * sign2,
		}

		return (
			scalar.approx(l1n.a, l2n.a) &&
			scalar.approx(l1n.b, l2n.b) &&
			scalar.approx(l1n.c, l2n.c)
		)
	}

	/**
	 * Returns whether the given two lines are parallel.
	 * @param l1 The first line
	 * @param l2 The second line
	 * @returns Whether the given two lines are parallel
	 */
	export function isParallel(l1: Line, l2: Line): boolean {
		return scalar.approx(l1.a * l2.b, l1.b * l2.a)
	}

	/**
	 * Returns whether the given two lines are perpendicular.
	 * @param l1 The first line
	 * @param l2 The second line
	 * @returns Whether the given two lines are perpendicular
	 */
	export function isPerpendicular(l1: Line, l2: Line): boolean {
		return scalar.approx(l1.a * l2.a + l1.b * l2.b, 0)
	}
}

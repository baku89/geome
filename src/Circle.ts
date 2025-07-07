import {scalar, vec2} from 'linearly'

/**
 * A circle represented as a tuple of a center and a radius.
 * @category Types
 */
export type Circle = {readonly center: vec2; readonly radius: number}

/**
 * Functions for manipulating circles represented as {@link Circle}.
 * @category Modules
 */
export namespace Circle {
	/**
	 * A unit circle.
	 * @category Constants
	 */
	export const unit = Object.freeze({center: [0, 0], radius: 1})

	/**
	 * Returns the circumscribed circle of the given triangle.
	 * @param a The first point of the triangle
	 * @param b The second point of the triangle
	 * @param c The third point of the triangle
	 * @returns The circumscribed circle of the given triangle
	 * @category Generators
	 */
	export function circumcircle(a: vec2, b: vec2, c: vec2): Circle | null {
		const d =
			2 * (a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1]))

		if (scalar.approx(d, 0)) {
			return null
		}

		const A2 = vec2.sqrLen(a)
		const B2 = vec2.sqrLen(b)
		const C2 = vec2.sqrLen(c)

		const center: vec2 = [
			(A2 * (b[1] - c[1]) + B2 * (c[1] - a[1]) + C2 * (a[1] - b[1])) / d,
			(A2 * (c[0] - b[0]) + B2 * (a[0] - c[0]) + C2 * (b[0] - a[0])) / d,
		]

		const radius = vec2.dist(center, a)

		return {center, radius}
	}

	/**
	 * Returns whether the given two circles are approximately equal.
	 * @param c1 The first circle
	 * @param c2 The second circle
	 * @returns Whether the given two circles are approximately equal
	 * @category Functions
	 */
	export function approx(c1: Circle, c2: Circle): boolean {
		return (
			vec2.approx(c1.center, c2.center) && scalar.approx(c1.radius, c2.radius)
		)
	}
}

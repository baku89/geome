import {mat2d, scalar, vec2} from 'linearly'

import {Line} from './Line'

/**
 * A ray represented by the point it starts from and the angle it goes at (in degrees, 0 = x+).
 * Unlike {@link Line}, a ray has an origin, so two rays on the same line from different points are
 * different.
 * @category Types
 */
export type Ray = {
	/** The point the ray starts from */
	readonly origin: vec2
	/** The angle of the direction in degrees (should be normalized to 0-360) */
	readonly angle: number
}

/**
 * Functions for manipulating rays represented as {@link Ray}.
 * @category Modules
 */
export namespace Ray {
	/**
	 * A ray from the origin along the x-axis.
	 * @category Constants
	 */
	export const xAxis: Ray = Object.freeze({origin: [0, 0] as vec2, angle: 0})

	/**
	 * Creates a ray from an origin and an angle.
	 * @param origin The point the ray starts from
	 * @param angle The angle of the direction in degrees (will be normalized to 0-360)
	 * @returns A ray with the given origin and angle
	 * @category Generators
	 */
	export function of(origin: vec2, angle: number): Ray {
		return {origin, angle: scalar.mod(angle, 360)}
	}

	/**
	 * Returns a ray starting from `origin` and going through `through`. If the points are the same,
	 * returns `null`.
	 * @param origin The point the ray starts from
	 * @param through A point the ray goes through
	 * @returns A ray from `origin` through `through`
	 * @category Generators
	 */
	export function fromPoints(origin: vec2, through: vec2): Ray | null {
		if (vec2.eq(origin, through)) return null
		return of(origin, vec2.angle(vec2.sub(through, origin)))
	}

	/**
	 * Returns a ray starting from `origin` and going in the direction of `direction`. If the
	 * direction is zero, returns `null`.
	 * @param origin The point the ray starts from
	 * @param direction The direction of the ray, of any length
	 * @returns A ray from `origin` along `direction`
	 * @category Generators
	 */
	export function fromPointDirection(origin: vec2, direction: vec2): Ray | null {
		if (vec2.eq(direction, vec2.zero)) return null
		return of(origin, vec2.angle(direction))
	}

	/**
	 * Returns the ray a matrix places: from its translation along its x-axis. If the x-axis is zero,
	 * returns `null`.
	 * @param matrix The matrix
	 * @returns The ray along the x-axis of the matrix
	 * @category Generators
	 */
	export function fromMat2d(matrix: mat2d): Ray | null {
		const [a, b, , , tx, ty] = matrix
		return fromPointDirection([tx, ty], [a, b])
	}

	/**
	 * Returns the unit vector of the direction of the ray.
	 * @param ray The ray
	 * @returns The unit vector of the direction
	 * @category Properties
	 */
	export function direction(ray: Ray): vec2 {
		return vec2.dir(ray.angle)
	}

	/**
	 * Returns the unit vector perpendicular to the ray, rotated 90 degrees from its direction as
	 * `vec2.rotate90` does: clockwise in a Y-down coordinate system.
	 * @param ray The ray
	 * @returns The unit normal of the ray
	 * @category Properties
	 */
	export function normal(ray: Ray): vec2 {
		return vec2.rotate90(direction(ray))
	}

	/**
	 * Returns the point at the given distance from the origin along the ray.
	 * @param ray The ray
	 * @param distance The distance from the origin, which may be negative
	 * @returns The point at the distance
	 * @category Functions
	 */
	export function at(ray: Ray, distance: number): vec2 {
		return vec2.add(ray.origin, vec2.dir(ray.angle, distance))
	}

	/**
	 * Returns the closest point on the ray to the given point. A point behind the origin comes to
	 * the origin.
	 * @param ray The ray
	 * @param p The point
	 * @returns The closest point on the ray
	 * @category Functions
	 */
	export function closest(ray: Ray, p: vec2): vec2 {
		const t = vec2.dot(vec2.sub(p, ray.origin), direction(ray))
		return t <= 0 ? ray.origin : at(ray, t)
	}

	/**
	 * Returns the matrix whose x-axis is the unit vector of the direction of the ray, whose y-axis is
	 * its normal, and whose translation is its origin. What is drawn along the x-axis then goes
	 * along the ray.
	 * @param ray The ray
	 * @returns The matrix placing the ray
	 * @category Converters
	 */
	export function toMat2d(ray: Ray): mat2d {
		const x = direction(ray)
		const y = vec2.rotate90(x)
		return [...x, ...y, ...ray.origin] as mat2d
	}

	/**
	 * Returns the line the ray goes along, in the same direction.
	 * @param ray The ray
	 * @returns The line through the ray
	 * @category Converters
	 */
	export function toLine(ray: Ray): Line {
		return Line.fromPointDirection(ray.origin, ray.angle)
	}

	/**
	 * Returns the ray from the same origin in the opposite direction.
	 * @param ray The ray
	 * @returns The inverted ray
	 * @category Functions
	 */
	export function invert(ray: Ray): Ray {
		return of(ray.origin, ray.angle + 180)
	}

	/**
	 * Transforms the ray by the given matrix: its origin as a point, and its direction as a vector.
	 * If the matrix collapses the direction, returns `null`.
	 * @param ray The ray
	 * @param matrix The matrix
	 * @returns The transformed ray
	 * @category Functions
	 */
	export function transform(ray: Ray, matrix: mat2d): Ray | null {
		const [a, b, c, d] = matrix
		const [x, y] = direction(ray)
		const turned: vec2 = [a * x + c * y, b * x + d * y]
		if (scalar.approx(vec2.len(turned), 0)) return null
		return fromPointDirection(vec2.transformMat2d(ray.origin, matrix), turned)
	}

	/**
	 * Returns whether the two rays are approximately the same: their origins are, and their
	 * directions are.
	 * @param r1 The first ray
	 * @param r2 The second ray
	 * @returns Whether the two rays are approximately the same
	 * @category Predicates
	 */
	export function approx(r1: Ray, r2: Ray): boolean {
		const turn = scalar.mod(r1.angle - r2.angle + 180, 360) - 180
		return vec2.approx(r1.origin, r2.origin) && scalar.approx(turn, 0)
	}
}

import {scalar, vec2} from 'linearly'

import {Line} from './Line'

/**
 * A segment defined by two points. It distinguishes the order of the points.
 */
export type Segment = [point1: vec2, point2: vec2]

export namespace Segment {
	/**
	 * Returns the length of the segment.
	 * @param segment The segment
	 * @returns The length of the segment
	 */
	export function length(segment: Segment): number {
		return vec2.dist(segment[0], segment[1])
	}

	/**
	 * Returns the midpoint of the segment.
	 * @param segment The segment
	 * @returns The midpoint of the segment
	 */
	export function midpoint(segment: Segment): vec2 {
		return vec2.add(segment[0], segment[1])
	}

	/**
	 * Returns the closest point on the segment to the given point.
	 * @param segment The segment
	 * @param point The point
	 * @returns The closest point on the segment to the given point
	 */
	export function closestPoint(segment: Segment, point: vec2): vec2 {
		const a = segment[0]
		const b = segment[1]
		const c = point

		const len = vec2.dist(a, b)
		if (scalar.approx(len, 0)) {
			return a
		}

		const t = vec2.dot(vec2.sub(c, a), vec2.sub(b, a)) / len
		if (t < 0) {
			return a
		}
		if (t > len) {
			return b
		}

		return vec2.add(a, vec2.scale(vec2.sub(b, a), t))
	}

	/**
	 * Returns the distance from a point to a segment.
	 * @param segment The segment
	 * @param point The point
	 * @returns The distance from the point to the segment
	 */
	export function distance(segment: Segment, point: vec2): number {
		return vec2.dist(point, closestPoint(segment, point))
	}

	export function intersection(
		segment1: Segment,
		segment2: Segment
	): vec2 | null {
		const [x1, y1] = segment1
		const [x2, y2] = segment2

		const ab = Line.fromPoints(x1, y1)
		const cd = Line.fromPoints(x2, y2)

		const intersection = Line.intersection(ab, cd)
		if (intersection === null) {
			return null
		}

		// Check if the intersection point is on both segments
		if (
			vec2.dist(intersection, x1) <= vec2.dist(intersection, y1) &&
			vec2.dist(intersection, x2) <= vec2.dist(intersection, y2)
		) {
			return intersection
		}

		return null
	}
}

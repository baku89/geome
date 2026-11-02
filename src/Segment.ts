import {scalar, vec2} from 'linearly'

/**
 * A segment defined by two points. It distinguishes the order of the points.
 * @category Types
 */
export type Segment = [point1: vec2, point2: vec2]

/**
 * An intersection of two segments.
 * @category Types
 */
export type SegmentIntersection = {
	/** The parameter on the first segment, in [0, 1] */
	readonly t1: number
	/** The parameter on the second segment, in [0, 1] */
	readonly t2: number
	/** The intersection point */
	readonly point: vec2
	/** True when the point bounds a stretch on which both segments coincide */
	readonly overlap?: boolean
}

const EPSILON = 1e-6

function cross(a: vec2, b: vec2): number {
	return a[0] * b[1] - a[1] * b[0]
}

/**
 * Functions for manipulating segments represented as {@link Segment}.
 * @category Modules
 */
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
		return vec2.lerp(segment[0], segment[1], 0.5)
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

	/**
	 * Returns the intersection point of two segments, or null if they do not intersect.
	 * @param segment1 The first segment
	 * @param segment2 The second segment
	 * @returns The intersection point, or null
	 */
	export function intersection(
		segment1: Segment,
		segment2: Segment
	): vec2 | null {
		return intersections(segment1, segment2)[0]?.point ?? null
	}

	/**
	 * Returns all intersections of two segments with the parameters on both segments. Collinear segments report the end points of their overlap, flagged with `overlap`.
	 * @param segment1 The first segment
	 * @param segment2 The second segment
	 * @param tolerance The distance within which end points count as touching
	 * @returns The intersections, sorted by `t1`
	 */
	export function intersections(
		segment1: Segment,
		segment2: Segment,
		tolerance = EPSILON
	): SegmentIntersection[] {
		const [a0, a1] = segment1
		const [b0, b1] = segment2
		const r = vec2.sub(a1, a0)
		const s = vec2.sub(b1, b0)
		const qp = vec2.sub(b0, a0)
		const rl = vec2.len(r)
		const sl = vec2.len(s)
		const denom = cross(r, s)

		if (rl === 0 || sl === 0) {
			return []
		}

		if (Math.abs(denom) <= 1e-12 * rl * sl) {
			// Parallel: intersect only if collinear
			if (Math.abs(cross(qp, r)) > tolerance * rl) {
				return []
			}

			const out: SegmentIntersection[] = []
			const rr = vec2.dot(r, r)
			const ss = vec2.dot(s, s)

			const push = (t1: number, t2: number) => {
				const slack1 = tolerance / rl
				const slack2 = tolerance / sl
				if (t1 < -slack1 || t1 > 1 + slack1) return
				if (t2 < -slack2 || t2 > 1 + slack2) return
				t1 = scalar.clamp(t1, 0, 1)
				t2 = scalar.clamp(t2, 0, 1)
				const point = vec2.lerp(a0, a1, t1)
				if (out.some(o => vec2.dist(o.point, point) <= tolerance)) return
				out.push({t1, t2, point, overlap: true})
			}

			push(vec2.dot(qp, r) / rr, 0)
			push(vec2.dot(vec2.sub(b1, a0), r) / rr, 1)
			push(0, -vec2.dot(qp, s) / ss)
			push(1, vec2.dot(vec2.sub(a1, b0), s) / ss)

			return out.sort((p, q) => p.t1 - q.t1)
		}

		const t1 = cross(qp, s) / denom
		const t2 = cross(qp, r) / denom
		const slack1 = tolerance / rl
		const slack2 = tolerance / sl

		if (t1 < -slack1 || t1 > 1 + slack1 || t2 < -slack2 || t2 > 1 + slack2) {
			return []
		}

		const c1 = scalar.clamp(t1, 0, 1)
		const c2 = scalar.clamp(t2, 0, 1)
		const point = vec2.lerp(vec2.lerp(a0, a1, c1), vec2.lerp(b0, b1, c2), 0.5)

		return [{t1: c1, t2: c2, point}]
	}
}

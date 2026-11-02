import {describe, expect, it} from 'vitest'

import {Segment} from './Segment'

describe('Segment', () => {
	it('midpoint', () => {
		expect(
			Segment.midpoint([
				[0, 0],
				[4, 2],
			])
		).toEqual([2, 1])
	})

	describe('intersections', () => {
		it('finds a crossing with parameters on both segments', () => {
			const hits = Segment.intersections(
				[
					[0, 0],
					[10, 0],
				],
				[
					[2, -5],
					[2, 5],
				]
			)
			expect(hits).toHaveLength(1)
			expect(hits[0].t1).toBeCloseTo(0.2)
			expect(hits[0].t2).toBeCloseTo(0.5)
			expect(hits[0].point).toEqual([2, 0])
			expect(hits[0].overlap).toBeUndefined()
		})

		it('returns nothing when the lines cross outside the segments', () => {
			expect(
				Segment.intersections(
					[
						[0, 0],
						[10, 0],
					],
					[
						[12, -5],
						[12, 5],
					]
				)
			).toEqual([])
		})

		it('returns nothing for parallel segments', () => {
			expect(
				Segment.intersections(
					[
						[0, 0],
						[10, 0],
					],
					[
						[0, 1],
						[10, 1],
					]
				)
			).toEqual([])
		})

		it('reports touching end points', () => {
			const hits = Segment.intersections(
				[
					[0, 0],
					[10, 0],
				],
				[
					[10, 0],
					[10, 5],
				]
			)
			expect(hits).toHaveLength(1)
			expect(hits[0].t1).toBe(1)
			expect(hits[0].t2).toBe(0)
		})

		it('reports the overlap of collinear segments', () => {
			const hits = Segment.intersections(
				[
					[0, 0],
					[10, 0],
				],
				[
					[4, 0],
					[14, 0],
				]
			)
			expect(hits).toHaveLength(2)
			expect(hits[0]).toEqual({t1: 0.4, t2: 0, point: [4, 0], overlap: true})
			expect(hits[1]).toEqual({t1: 1, t2: 0.6, point: [10, 0], overlap: true})
		})

		it('ignores zero-length segments', () => {
			expect(
				Segment.intersections(
					[
						[1, 1],
						[1, 1],
					],
					[
						[0, 0],
						[2, 2],
					]
				)
			).toEqual([])
		})
	})

	it('intersection returns the first point or null', () => {
		expect(
			Segment.intersection(
				[
					[0, 0],
					[10, 0],
				],
				[
					[2, -5],
					[2, 5],
				]
			)
		).toEqual([2, 0])
		expect(
			Segment.intersection(
				[
					[0, 0],
					[10, 0],
				],
				[
					[0, 1],
					[10, 1],
				]
			)
		).toBeNull()
	})
})

import {scalar} from 'linearly'
import {describe, expect, it} from 'vitest'

import {Line} from './Line'

describe('Line', () => {
	describe('fromPoints', () => {
		it('should create a line from two points', () => {
			const line = Line.fromPoints([0, 0], [1, 1])
			expect(line).toEqual({a: 1, b: -1, c: 0})
		})
	})

	describe('fromPointAngle', () => {
		it('should create a line from a point and an angle', () => {
			const line = Line.fromPointAngle([0, 0], 45)
			expect(line).toMatchObject({
				a: expect.closeTo(1 / scalar.sqrt(2), 6),
				b: expect.closeTo(-1 / scalar.sqrt(2), 6),
				c: 0,
			})
		})
	})

	describe('distance', () => {
		it('should return the distance from a point to a line', () => {
			const line = Line.fromPoints([0, 0], [1, 0])
			expect(Line.distance(line, [0, 1])).toEqual(1)
		})
	})

	describe('approx', () => {
		it('should return true if for the two inverted lines', () => {
			const line1 = Line.fromPoints([0, 0], [1, 0])
			const line2 = Line.fromPoints([1, 0], [0, 0])
			expect(Line.approx(line1, line2)).toBe(true)
		})
	})
})

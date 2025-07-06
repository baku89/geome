import {mat2d} from 'linearly'
import {describe, expect, it} from 'vitest'

import {Line} from './Line'

describe('Line', () => {
	describe('fromPoints', () => {
		it('should create a line from two points', () => {
			const line = Line.fromPoints([0, 0], [1, 1])
			expect(line).toEqual({theta: 135, offset: 0})
		})
	})

	describe('fromPointDirection', () => {
		it('should create a line from a point and a direction', () => {
			const line = Line.fromPointDirection([0, 0], 45)
			expect(line).toEqual({theta: 135, offset: 0})
		})
	})

	describe('distance', () => {
		it('should return the distance from a point to a line', () => {
			const line = Line.fromPoints([0, 0], [1, 0])
			expect(Line.distance(line, [0, 1])).toEqual(1)
		})
	})

	describe('approx', () => {
		it('should return true if the two lines are the same', () => {
			const line1 = Line.fromPoints([0, 0], [1, 0])
			expect(Line.approx(line1, line1)).toBe(true)
		})
		it('should return false if for the two inverted lines', () => {
			const line1 = Line.fromPoints([0, 0], [1, 0])
			const line2 = Line.fromPoints([1, 0], [0, 0])
			expect(Line.approx(line1, line2)).toBe(false)
		})
	})

	describe('same', () => {
		it('should return true if the two lines are exactly the same', () => {
			const line1 = Line.fromPoints([0, 0], [1, 0])
			expect(Line.same(line1, line1)).toBe(true)
		})
		it('should return true if the two lines have opposite directions', () => {
			const line1 = Line.fromPoints([0, 0], [1, 0])
			const line2 = Line.fromPoints([1, 0], [0, 0])
			expect(Line.same(line1, line2)).toBe(true)
		})
		it('should return false for different lines', () => {
			const line1 = Line.fromPoints([0, 0], [1, 0])
			const line2 = Line.fromPoints([0, 0], [0, 1])
			expect(Line.same(line1, line2)).toBe(false)
		})
	})

	describe('intersection', () => {
		it('should return the intersection point of two lines', () => {
			const line1 = Line.fromPoints([0, 0], [1, 0])
			const line2 = Line.fromPoints([1, 0], [1, 1])
			expect(Line.intersection(line1, line2)).toEqual([1, 0])
		})
		it('should return null if the lines are parallel', () => {
			const line1 = Line.fromPoints([0, 0], [1, 0])
			const line2 = Line.fromPoints([0, 1], [1, 1])
			expect(Line.intersection(line1, line2)).toBeNull()
		})
	})

	describe('closest', () => {
		it('should return the closest point on the line to the given point', () => {
			const line = Line.fromPoints([0, 0], [1, 0])
			// Closest point on x-axis to (1, 1)
			expect(Line.closest(line, [1, 1])).toEqual([1, 0])
		})
	})

	describe('isParallel', () => {
		it('should return true for parallel lines', () => {
			const l1 = Line.fromPoints([0, 0], [1, 1])
			const l2 = Line.fromPoints([1, 1], [2, 2])
			expect(Line.isParallel(l1, l2)).toBe(true)
		})
		it('should return false for non-parallel lines', () => {
			const l1 = Line.fromPoints([0, 0], [1, 0])
			const l2 = Line.fromPoints([0, 0], [0, 1])
			expect(Line.isParallel(l1, l2)).toBe(false)
		})
	})

	describe('isPerpendicular', () => {
		it('should return true for perpendicular lines', () => {
			const l1 = Line.fromPoints([0, 0], [1, 0])
			const l2 = Line.fromPoints([0, 0], [0, 1])
			expect(Line.isPerpendicular(l1, l2)).toBe(true)
		})
		it('should return true for perpendicular lines whose two theta values cross X axis', () => {
			const l1 = Line.fromPoints([0, 0], [1, 1])
			const l2 = Line.fromPoints([0, 0], [1, -1])
			expect(Line.isPerpendicular(l1, l2)).toBe(true)
		})
		it('should return false for non-perpendicular lines', () => {
			const l1 = Line.fromPoints([0, 0], [1, 0])
			const l2 = Line.fromPoints([0, 0], [1, 1])
			expect(Line.isPerpendicular(l1, l2)).toBe(false)
		})
	})

	describe('invert', () => {
		it('should return a line with opposite direction', () => {
			const line = Line.of(45, 2)
			const inverted = Line.invert(line)

			// Check that theta is rotated by 180 degrees
			expect(inverted.theta).toBe(225)
			// Check that offset is negated
			expect(inverted.offset).toBe(-2)
		})

		it('should handle theta values that wrap around 360 degrees', () => {
			const line = Line.of(270, 1)
			const inverted = Line.invert(line)

			// 270 + 180 = 450, which should be normalized to 90
			expect(inverted.theta).toBe(90)
			expect(inverted.offset).toBe(-1)
		})

		it('should preserve the original line when inverted twice', () => {
			const original = Line.of(60, 3)
			const inverted = Line.invert(original)
			const doubleInverted = Line.invert(inverted)

			expect(Line.approx(original, doubleInverted)).toBe(true)
		})
	})

	describe('reflectionMatrix', () => {
		it('should return a matrix that reflects points across the x-axis', () => {
			const line = Line.xAxis
			const matrix = Line.reflectionMatrix(line)
			expect(matrix).toEqual([1, 0, 0, -1, 0, 0])
		})
		it('should return a matrix that reflects points across the y-axis', () => {
			const line = Line.yAxis
			const matrix = Line.reflectionMatrix(line)
			expect(matrix).toEqual([-1, 0, 0, 1, 0, 0])
		})
		it('should return a matrix that reflects points across the line y = x', () => {
			const line = Line.fromPoints([0, 0], [1, 1])
			const matrix = Line.reflectionMatrix(line)
			expect(matrix).toEqual([0, 1, 1, 0, 0, 0])
		})
		it('should return a matrix that reflects points across the line x = 1', () => {
			const line = Line.fromPoints([1, 0], [1, 1])
			const matrix = Line.reflectionMatrix(line)
			expect(matrix).toEqual([-1, 0, 0, 1, 2, 0])
		})
		it('should return a matrix that reflects points across the line y = -1', () => {
			const line = Line.fromPoints([0, -1], [1, -1])
			const matrix = Line.reflectionMatrix(line)
			expect(matrix).toEqual([1, 0, 0, -1, 0, -2])
		})
		it('should return a matrix that reflects points across the line y = -x + 1', () => {
			const line = Line.fromPoints([0, 1], [1, 0])
			const matrix = Line.reflectionMatrix(line)
			expect(matrix).toEqual([0, -1, -1, 0, 1, 1])
		})
	})

	describe('transform', () => {
		it('should return a line that is transformed by the given matrix', () => {
			const line = Line.fromPoints([0, 0], [1, 1])
			const matrix = mat2d.scaling([-1, 1])
			const transformed = Line.transform(line, matrix)
			expect(transformed).toEqual(Line.of(225, 0))
		})
	})
})

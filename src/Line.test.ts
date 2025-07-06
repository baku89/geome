import {describe, expect, it} from 'vitest'

import {Line} from './Line'

describe('Line', () => {
	describe('fromPoints', () => {
		it('should create a line from two points', () => {
			const line = Line.fromPoints([0, 0], [1, 1])
			expect(line).toEqual({theta: 135, offset: 0})
		})
	})

	describe('fromPointAngle', () => {
		it('should create a line from a point and an angle', () => {
			const line = Line.fromPointAngle([0, 0], 45)
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
		it('should return true if for the two inverted lines', () => {
			const line1 = Line.fromPoints([0, 0], [1, 0])
			const line2 = Line.fromPoints([1, 0], [0, 0])
			expect(Line.approx(line1, line2)).toBe(true)
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
		it('should return false for non-perpendicular lines', () => {
			const l1 = Line.fromPoints([0, 0], [1, 0])
			const l2 = Line.fromPoints([0, 0], [1, 1])
			expect(Line.isPerpendicular(l1, l2)).toBe(false)
		})
	})
})

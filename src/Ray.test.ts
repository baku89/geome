import {mat2d, vec2} from 'linearly'
import {describe, expect, it} from 'vitest'

import {Line} from './Line'
import {Ray} from './Ray'

const close = (a: readonly number[], b: readonly number[]) =>
	a.forEach((x, i) => expect(x).toBeCloseTo(b[i]!))

describe('Ray', () => {
	describe('of', () => {
		it('should normalize the angle', () => {
			expect(Ray.of([1, 2], -90)).toEqual({origin: [1, 2], angle: 270})
			expect(Ray.of([0, 0], 360)).toEqual({origin: [0, 0], angle: 0})
		})
	})

	describe('fromPoints', () => {
		it('should create a ray from an origin through a point', () => {
			expect(Ray.fromPoints([0, 0], [0, 10])).toEqual({origin: [0, 0], angle: 90})
		})
		it('should return null if the two points are the same', () => {
			expect(Ray.fromPoints([1, 1], [1, 1])).toBeNull()
		})
	})

	describe('toMat2d', () => {
		it('should put the x-axis along the direction, and the translation at the origin', () => {
			const m = Ray.toMat2d(Ray.of([10, 20], 90))
			close(vec2.transformMat2d([1, 0], m), [10, 21])
			close(vec2.transformMat2d([0, 0], m), [10, 20])
			close(m, [0, 1, -1, 0, 10, 20])
		})
		it('should come back by fromMat2d', () => {
			const ray = Ray.of([3, 4], 30)
			expect(Ray.approx(Ray.fromMat2d(Ray.toMat2d(ray))!, ray)).toBe(true)
		})
	})

	describe('at and closest', () => {
		it('should go along the direction', () => {
			close(Ray.at(Ray.of([1, 1], 0), 5), [6, 1])
		})
		it('should project a point, and stop at the origin behind it', () => {
			const ray = Ray.of([0, 0], 0)
			close(Ray.closest(ray, [3, 4]), [3, 0])
			close(Ray.closest(ray, [-3, 4]), [0, 0])
		})
	})

	describe('transform', () => {
		it('should move the origin and turn the direction', () => {
			const turned = Ray.transform(Ray.of([1, 0], 0), mat2d.fromRotation(90))!
			close(turned.origin, [0, 1])
			expect(turned.angle).toBeCloseTo(90)
		})
		it('should return null when the direction collapses', () => {
			expect(Ray.transform(Ray.xAxis, mat2d.fromScaling([0, 1]))).toBeNull()
		})
	})

	describe('invert and toLine', () => {
		it('should go the other way from the same origin', () => {
			expect(Ray.invert(Ray.of([1, 1], 45))).toEqual({origin: [1, 1], angle: 225})
		})
		it('should lie on its line', () => {
			const ray = Ray.of([2, 3], 60)
			expect(Line.distance(Ray.toLine(ray), Ray.at(ray, 7))).toBeCloseTo(0)
		})
	})

	describe('approx', () => {
		it('should take an angle around 0 as the same as around 360', () => {
			expect(Ray.approx({origin: [0, 0], angle: 359.9999999}, Ray.xAxis)).toBe(true)
			expect(Ray.approx(Ray.of([0, 0], 1), Ray.xAxis)).toBe(false)
		})
	})
})

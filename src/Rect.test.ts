import {describe, expect, it} from 'vitest'

import {Rect} from './Rect'

describe('unite', () => {
	it('should unite multiple rects correctly', () => {
		const bbox1: Rect = [
			[0, 0],
			[2, 2],
		]
		const bbox2: Rect = [
			[1, 1],
			[3, 3],
		]
		const bbox3: Rect = [
			[-1, -1],
			[1, 1],
		]
		const result = Rect.unite(bbox1, bbox2, bbox3)
		expect(result).toEqual([
			[-1, -1],
			[3, 3],
		])
	})
})

describe('Rect.offset', () => {
	it('grows by a number or a vector', () => {
		const rect: Rect = [
			[0, 1],
			[2, 3],
		]
		expect(Rect.offset(rect, 1)).toEqual([
			[-1, 0],
			[3, 4],
		])
		expect(Rect.offset(rect, [1, 2])).toEqual([
			[-1, -1],
			[3, 5],
		])
	})
})

describe('Rect.unite', () => {
	it('contains all the rects', () => {
		expect(
			Rect.unite(
				[
					[0, 1],
					[2, 3],
				],
				[
					[-1, 2],
					[1, 5],
				]
			)
		).toEqual([
			[-1, 1],
			[2, 5],
		])
	})
})

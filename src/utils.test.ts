import {describe, expect, it} from 'vitest'
import {vec2} from 'linearly'

import {normalizeAngle} from './utils'

describe('normalizeAngle', () => {
	it('should work', () => {
		expect(normalizeAngle(0)).toEqual(0)
		expect(normalizeAngle(360)).toEqual(0)
		expect(normalizeAngle(720)).toEqual(0)
		expect(normalizeAngle(-360)).toEqual(0)
		expect(normalizeAngle(-720)).toEqual(0)
		expect(normalizeAngle(180)).toEqual(180)
		expect(normalizeAngle(-180)).toEqual(180)
		expect(normalizeAngle(90)).toEqual(90)
		expect(normalizeAngle(-90)).toEqual(-90)
		expect(normalizeAngle(450)).toEqual(90)
	})
})

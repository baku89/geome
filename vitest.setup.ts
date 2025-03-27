import {expect} from 'vitest'

const EPSILON = 0.000001

function nearlyEqual(a: number, b: number) {
	return (
		Math.abs(a - b) <= EPSILON * Math.max(1, Math.abs(a), Math.abs(b)) ||
		undefined
	)
}

expect.addEqualityTesters([nearlyEqual])

/**
 * A range of numbers. It must be guaranteed that `min <= max`.
 * @category Types
 */
export type Range = readonly [min: number, max: number]

/**
 * Functions for manipulating ranges.
 * @category Modules
 */
export namespace Range {
	/**
	 * Creates a range from two given values.
	 * @param a The first value of the range.
	 * @param b The second value of the range.
	 * @returns The created range.
	 */
	export function of(a: number, b: number): Range {
		return [Math.min(a, b), Math.max(a, b)]
	}

	/**
	 * Get the minimum value of the given range.
	 * @param range The range to get the minimum value of.
	 * @category Properties
	 * @returns The minimum value of the range.
	 */
	export function min(range: Range): number {
		return range[0]
	}

	/**
	 * Get the maximum value of the given range.
	 * @param range The range to get the maximum value of.
	 * @category Properties
	 * @returns The maximum value of the range.
	 */
	export function max(range: Range): number {
		return range[1]
	}

	/**
	 * Get the span of the given range.
	 * @param range The range to get the span of.
	 * @category Properties
	 * @returns The span of the range.
	 */
	export function span(range: Range): number {
		return range[1] - range[0]
	}

	/**
	 * Get the center of the given range.
	 * @param range The range to get the center of.
	 * @category Properties
	 * @returns The center of the range.
	 */
	export function center(range: Range): number {
		return (range[0] + range[1]) / 2
	}

	export function offset(range: Range, offset: number): Range {
		return [range[0] + offset, range[1] + offset]
	}

	/**
	 * Scale the given range by the given scale factor and origin. If no center is provided, the origin will be zero.
	 * @param range The range to scale.
	 * @param scale The scale factor.
	 * @param origin The center of the range to scale around.
	 * @returns The scaled range.
	 */
	export function scale(range: Range, scale: number, origin = 0): Range {
		return [
			(range[0] - origin) * scale + origin,
			(range[1] - origin) * scale + origin,
		]
	}
}

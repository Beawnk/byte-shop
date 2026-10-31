import { describe, it, expect } from 'vitest'
import { pageRange } from './pageRange'

describe('pageRange', () => {
	it('shows every page when there are few', () => {
		expect(pageRange(1, 1)).toEqual([1])
		expect(pageRange(1, 3)).toEqual([1, 2, 3])
		expect(pageRange(3, 4)).toEqual([1, 2, 3, 4])
	})

	it('always offers the first and last page', () => {
		expect(pageRange(10, 20)).toEqual([1, null, 9, 10, 11, null, 20])
	})

	it('handles the edges', () => {
		expect(pageRange(1, 20)).toEqual([1, 2, null, 20])
		expect(pageRange(20, 20)).toEqual([1, null, 19, 20])
	})

	it('shows a single hidden page instead of a gap', () => {
		expect(pageRange(3, 20)).toEqual([1, 2, 3, 4, null, 20])
		expect(pageRange(18, 20)).toEqual([1, null, 17, 18, 19, 20])
	})
})

import { describe, it, expect } from 'vitest'
import { useGetVendorStars } from './getVendorStars'

describe('useGetVendorStars', () => {
	it('fills whole and half stars', () => {
		expect(useGetVendorStars(3.5)).toEqual(['full', 'full', 'full', 'half', 'empty'])
	})

	it('handles the edges', () => {
		expect(useGetVendorStars(0)).toEqual(Array(5).fill('empty'))
		expect(useGetVendorStars(5)).toEqual(Array(5).fill('full'))
	})
})

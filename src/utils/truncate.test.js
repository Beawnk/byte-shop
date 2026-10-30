import { describe, it, expect } from 'vitest'
import { truncate } from './truncate'

describe('truncate', () => {
	it('cuts the text and adds the ending', () => {
		expect(truncate('Headphone sem fio', 9)).toBe('Headphone')
		expect(truncate('Headphone sem fio', 9, '...')).toBe('Headphone...')
	})

	it('accepts missing text (older rows have no description)', () => {
		expect(truncate(null, 10)).toBe('')
	})
})

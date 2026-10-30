import { describe, it, expect } from 'vitest'
import { formatDate } from './formatDate'

describe('formatDate', () => {
	it('shows a UTC timestamp in São Paulo time', () => {
		expect(formatDate('2025-01-07T09:20:00Z')).toBe('07/01/2025 06:20')
	})

	it('accepts the Postgres timestamptz format', () => {
		expect(formatDate('2025-01-07 09:20:00+00')).toBe('07/01/2025 06:20')
	})

	it('returns an empty string for missing or invalid values', () => {
		expect(formatDate(null)).toBe('')
		expect(formatDate('')).toBe('')
		expect(formatDate('not a date')).toBe('')
	})
})

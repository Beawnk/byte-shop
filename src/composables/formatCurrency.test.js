import { describe, it, expect } from 'vitest'
import { formatCurrency } from './formatCurrency'

// Intl separates "R$" from the value with a non-breaking space.
const normalize = (value) => value.replace(/\s/g, ' ')

describe('formatCurrency', () => {
	it('formats numbers as BRL', () => {
		expect(normalize(formatCurrency(1299))).toBe('R$ 1.299,00')
		expect(normalize(formatCurrency(10.5))).toBe('R$ 10,50')
	})

	it('accepts numeric strings (older rows store the price as text)', () => {
		expect(normalize(formatCurrency('300'))).toBe('R$ 300,00')
	})

	it('falls back to zero instead of throwing', () => {
		expect(normalize(formatCurrency(null))).toBe('R$ 0,00')
		expect(normalize(formatCurrency('abc'))).toBe('R$ 0,00')
	})
})

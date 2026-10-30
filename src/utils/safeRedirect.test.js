import { describe, it, expect } from 'vitest'
import { safeRedirect } from './safeRedirect'

describe('safeRedirect', () => {
	it('accepts paths on this site', () => {
		expect(safeRedirect('/comprar/tablet')).toBe('/comprar/tablet')
		expect(safeRedirect('/usuario/pedidos?x=1')).toBe('/usuario/pedidos?x=1')
	})

	it('rejects anything that could leave the site', () => {
		expect(safeRedirect('//evil.com')).toBeNull()
		expect(safeRedirect('/\\evil.com')).toBeNull()
		expect(safeRedirect('https://evil.com')).toBeNull()
		expect(safeRedirect('comprar/tablet')).toBeNull()
	})

	it('rejects missing or non-string values', () => {
		expect(safeRedirect(undefined)).toBeNull()
		expect(safeRedirect(['/a'])).toBeNull()
	})
})

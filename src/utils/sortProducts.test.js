import { describe, it, expect } from 'vitest'
import { sortProducts } from './sortProducts'

const products = [
	{ name: 'Câmera', price: '300', created_date: '2026-01-10T10:00:00Z' },
	{ name: 'Áudio', price: 1200, created_date: '2026-03-10T10:00:00Z' },
	{ name: 'Mouse', price: 50, created_date: null },
]

const names = (sort) => sortProducts(products, sort).map((product) => product.name)

describe('sortProducts', () => {
	it('puts the last added product first by default', () => {
		expect(names('recentes')).toEqual(['Áudio', 'Câmera', 'Mouse'])
		expect(names(undefined)).toEqual(['Áudio', 'Câmera', 'Mouse'])
	})

	it('sorts by oldest', () => {
		expect(names('antigos')).toEqual(['Mouse', 'Câmera', 'Áudio'])
	})

	it('sorts prices as numbers, even when stored as text', () => {
		expect(names('menor')).toEqual(['Mouse', 'Câmera', 'Áudio'])
		expect(names('maior')).toEqual(['Áudio', 'Câmera', 'Mouse'])
	})

	it('sorts names with accents in the right place', () => {
		expect(names('nome')).toEqual(['Áudio', 'Câmera', 'Mouse'])
	})

	it('does not change the original list', () => {
		const original = [...products]
		sortProducts(products, 'menor')
		expect(products).toEqual(original)
	})
})

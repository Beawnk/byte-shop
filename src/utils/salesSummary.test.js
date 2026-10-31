import { describe, it, expect } from 'vitest'
import { periodOptions, summarizeSales } from './salesSummary'

const now = new Date('2026-10-30T15:00:00Z')

describe('summarizeSales', () => {
	it('adds up revenue, count and average', () => {
		const summary = summarizeSales(
			[
				{ total: 100, created_at: '2026-10-05T12:00:00Z' },
				{ total: '300', created_at: '2026-09-05T12:00:00Z' },
			],
			{ now }
		)

		expect(summary.revenue).toBe(400)
		expect(summary.count).toBe(2)
		expect(summary.average).toBe(200)
	})

	it('shows the last 6 months in order, with empty months at zero', () => {
		const { monthly } = summarizeSales([{ total: 50, created_at: '2026-08-10T12:00:00Z' }], { now, period: '6m' })

		expect(monthly.map((month) => month.key)).toEqual([
			'2026-05',
			'2026-06',
			'2026-07',
			'2026-08',
			'2026-09',
			'2026-10',
		])
		expect(monthly.map((month) => month.total)).toEqual([0, 0, 0, 50, 0, 0])
		expect(monthly[3].label).toBe('ago')
	})

	it('shows all 12 months of a year and only that year\'s sales', () => {
		const orders = [
			{ id: 'a', total: 100, created_at: '2025-03-10T12:00:00Z' },
			{ id: 'b', total: 200, created_at: '2026-03-10T12:00:00Z' },
		]

		const summary = summarizeSales(orders, { now, period: '2025' })

		expect(summary.monthly).toHaveLength(12)
		expect(summary.monthly[0].key).toBe('2025-01')
		expect(summary.monthly[11].key).toBe('2025-12')
		expect(summary.monthly[2].total).toBe(100)
		expect(summary.revenue).toBe(100)
		expect(summary.orders.map((order) => order.id)).toEqual(['a'])
	})

	it('uses Brazil time to pick the month', () => {
		// 02:00 UTC on Nov 1st is still Oct 31st in São Paulo.
		const { monthly } = summarizeSales([{ total: 10, created_at: '2026-11-01T02:00:00Z' }], { now, period: '6m' })

		expect(monthly[5].key).toBe('2026-10')
		expect(monthly[5].total).toBe(10)
	})

	it('crosses the year boundary', () => {
		const { monthly } = summarizeSales([], { now: new Date('2026-01-15T12:00:00Z'), period: '6m' })

		expect(monthly[0].key).toBe('2025-08')
		expect(monthly[5].key).toBe('2026-01')
	})

	it('leaves sales outside the period out of every figure', () => {
		const summary = summarizeSales([{ total: 70, created_at: '2020-01-01T12:00:00Z' }], { now, period: '12m' })

		expect(summary.revenue).toBe(0)
		expect(summary.count).toBe(0)
		expect(summary.orders).toEqual([])
	})

	it('handles no sales', () => {
		const summary = summarizeSales([], { now })

		expect(summary.average).toBe(0)
		expect(summary.revenue).toBe(0)
	})
})

describe('periodOptions', () => {
	it('offers the fixed ranges plus the years with sales, newest first', () => {
		const options = periodOptions([
			{ created_at: '2024-05-10T12:00:00Z' },
			{ created_at: '2026-05-10T12:00:00Z' },
			{ created_at: '2026-06-10T12:00:00Z' },
		])

		expect(options.map((option) => option.value)).toEqual(['12m', '6m', '2026', '2024'])
	})
})

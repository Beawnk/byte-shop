import { describe, it, expect } from 'vitest'
import { nextTick, ref } from 'vue'
import { usePagination } from './usePagination'

const numbers = (length) => Array.from({ length }, (_, index) => index + 1)

describe('usePagination', () => {
	it('shows one page of items at a time', async () => {
		const { totalPages, visibleItems, goToPage } = usePagination(ref(numbers(25)))

		expect(totalPages.value).toBe(3)
		expect(visibleItems.value).toEqual(numbers(10))

		await goToPage(3)
		expect(visibleItems.value).toEqual([21, 22, 23, 24, 25])
	})

	it('accepts a getter and a custom page size', () => {
		const { totalPages, visibleItems } = usePagination(() => numbers(13), 12)

		expect(totalPages.value).toBe(2)
		expect(visibleItems.value).toHaveLength(12)
	})

	it('has one page when the list is empty', () => {
		const { totalPages, visibleItems } = usePagination(ref([]))

		expect(totalPages.value).toBe(1)
		expect(visibleItems.value).toEqual([])
	})

	it('goes back to the last page when the list shrinks', async () => {
		const items = ref(numbers(11))
		const { page, goToPage } = usePagination(items)

		await goToPage(2)
		items.value = numbers(10)
		await nextTick()

		expect(page.value).toBe(1)
	})
})

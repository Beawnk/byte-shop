import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick } from 'vue'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('@/lib/supabaseClient', () => ({
	supabase: {
		auth: {
			getSession: async () => ({ data: { session: null } }),
			onAuthStateChange: () => {},
		},
	},
}))

const { useCartStore } = await import('./cartStore')
const { useUserStore } = await import('./UserState')

describe('cartStore', () => {
	beforeEach(() => {
		localStorage.clear()
		setActivePinia(createPinia())
	})

	it('adds a product only once (each product is a single unit)', () => {
		const cart = useCartStore()
		cart.add('tablet')
		cart.add('tablet')
		expect(cart.ids).toEqual(['tablet'])
		expect(cart.count).toBe(1)
	})

	it('removes one, several or all products', () => {
		const cart = useCartStore()
		;['a', 'b', 'c', 'd'].forEach(cart.add)

		cart.remove('a')
		expect(cart.ids).toEqual(['b', 'c', 'd'])

		cart.removeMany(['b', 'c'])
		expect(cart.ids).toEqual(['d'])

		cart.clear()
		expect(cart.count).toBe(0)
	})

	it('survives a reload', () => {
		useCartStore().add('tablet')

		setActivePinia(createPinia())

		expect(useCartStore().ids).toEqual(['tablet'])
	})

	it('moves the guest cart into the account on login', async () => {
		const cart = useCartStore()
		const userStore = useUserStore()
		localStorage.setItem('cart:user-1', JSON.stringify(['notebook']))
		cart.add('tablet')

		userStore.user.id = 'user-1'
		await nextTick()

		expect(cart.ids).toEqual(['notebook', 'tablet'])
		expect(JSON.parse(localStorage.getItem('cart:guest'))).toEqual([])
	})

	it("doesn't show one account's cart to the next person on the browser", async () => {
		const cart = useCartStore()
		const userStore = useUserStore()
		userStore.user.id = 'user-1'
		await nextTick()
		cart.add('tablet')

		userStore.user.id = ''
		await nextTick()

		expect(cart.ids).toEqual([])
	})

	it('falls back to an empty cart when the stored value is corrupted', () => {
		localStorage.setItem('cart:guest', 'not json')
		expect(useCartStore().ids).toEqual([])
	})
})

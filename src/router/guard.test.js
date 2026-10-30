import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

// supabase-js keeps its own fetch reference, so the client module itself is replaced
// (stubbing window.fetch would not intercept anything).
const auth = {
	getSession: vi.fn(),
	onAuthStateChange: vi.fn(),
	signOut: vi.fn(async () => ({ error: null })),
}
const profile = { id: 'user-1', name: 'Bia Silva', email: 'bia@example.com' }

vi.mock('@/lib/supabaseClient', () => ({
	supabase: {
		auth,
		from: () => ({
			select: () => ({
				eq: () => ({ single: async () => ({ data: profile, error: null }) }),
			}),
		}),
	},
}))

const { default: router } = await import('@/router')

describe('router guard', () => {
	beforeEach(async () => {
		setActivePinia(createPinia())
		auth.getSession.mockResolvedValue({ data: { session: null } })
		await router.replace('/')
		// A fresh Pinia = a fresh user store, so each test's session mock is the one restored.
		setActivePinia(createPinia())
	})

	it('sends a logged-out user from a private page to login, keeping the destination', async () => {
		auth.getSession.mockResolvedValue({ data: { session: null } })

		await router.push('/usuario/pedidos')

		expect(router.currentRoute.value.name).toBe('user')
		expect(router.currentRoute.value.query).toEqual({ page: 'login', redirect: '/usuario/pedidos' })
	})

	it('waits for the restored session before deciding (reload on a private page)', async () => {
		auth.getSession.mockResolvedValue({ data: { session: { user: { id: profile.id } } } })

		await router.push('/usuario/pedidos')

		expect(router.currentRoute.value.name).toBe('orders')
	})

	it('leaves public pages alone', async () => {
		auth.getSession.mockResolvedValue({ data: { session: null } })

		await router.push('/produtos')

		expect(router.currentRoute.value.name).toBe('products')
	})
})

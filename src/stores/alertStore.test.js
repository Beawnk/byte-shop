import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAlertStore } from './alertStore'

describe('alertStore', () => {
	beforeEach(() => {
		setActivePinia(createPinia())
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('removes each message after 5 seconds', () => {
		const store = useAlertStore()
		store.addGlobalSuccess('Salvo')
		expect(store.globalSuccesses.map((m) => m.text)).toEqual(['Salvo'])

		vi.advanceTimersByTime(5000)
		expect(store.globalSuccesses).toEqual([])
	})

	it("an old timer doesn't remove a newer message after clearNotifications", () => {
		const store = useAlertStore()
		store.addGlobalError('Antigo')
		vi.advanceTimersByTime(3000)

		store.clearNotifications()
		store.addGlobalError('Novo')
		vi.advanceTimersByTime(2000) // the old message's timer fires now

		expect(store.globalErrors.map((m) => m.text)).toEqual(['Novo'])
	})
})

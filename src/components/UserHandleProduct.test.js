import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia } from 'pinia'
import UserHandleProduct from './UserHandleProduct.vue'
import { supabase } from '@/lib/supabaseClient'
import { uploadImage, removeImages } from '@/composables/imageStorage'

const savedProduct = {
	id: 'p1',
	name: 'Mouse',
	description: 'Mouse sem fio',
	price: 100,
	image_url: ['https://x/images/u1/old-1.jpg', 'https://images.unsplash.com/old-2'],
}

vi.mock('@/lib/supabaseClient', () => ({ supabase: { from: vi.fn() } }))
vi.mock('@/composables/imageStorage', () => ({ uploadImage: vi.fn(), removeImages: vi.fn() }))
vi.mock('@/stores/UserState', () => ({
	useUserStore: () => ({ user: { id: 'u1' }, getProduct: () => savedProduct }),
}))

let result
let table

const mockTable = () => {
	table = { insert: vi.fn(() => table), update: vi.fn(() => table), eq: vi.fn(() => table), select: vi.fn(() => Promise.resolve(result)) }
	supabase.from.mockReturnValue(table)
}

const mountModal = (mode) =>
	mount(UserHandleProduct, {
		props: { mode, productId: 'p1' },
		global: { plugins: [createPinia()], stubs: { FieldNotifications: true } },
	})

const pickFile = async (wrapper, name) => {
	const input = wrapper.find('input[type="file"]')
	const file = new File(['x'], name, { type: 'image/png' })
	Object.defineProperty(input.element, 'files', { value: [file], configurable: true })
	await input.trigger('change')
	return file
}

const fillForm = async (wrapper) => {
	await wrapper.find('#name').setValue('Teclado')
	await wrapper.find('#description').setValue('Teclado mecânico')
	await wrapper.find('#price').setValue('250')
}

const submit = async (wrapper) => {
	await wrapper.find('form').trigger('submit')
	// vee-validate debounces validation with a real timer, so flushing promises isn't enough.
	await new Promise((resolve) => setTimeout(resolve, 50))
	await flushPromises()
}

describe('UserHandleProduct', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		let previews = 0
		URL.createObjectURL = vi.fn(() => `blob:preview-${++previews}`)
		URL.revokeObjectURL = vi.fn()
		result = { data: [{ id: 'p1' }], error: null }
		mockTable()
	})

	it('uploads the picked file and saves its public url, not the preview', async () => {
		uploadImage.mockResolvedValue('https://x/images/u1/new.jpg')
		const wrapper = mountModal('add')
		await fillForm(wrapper)
		const file = await pickFile(wrapper, 'a.png')

		await submit(wrapper)

		expect(uploadImage).toHaveBeenCalledWith(file, 'u1')
		expect(table.insert.mock.calls[0][0][0].image_url).toEqual(['https://x/images/u1/new.jpg'])
		expect(wrapper.emitted('productSaved')).toHaveLength(1)
	})

	it('removes what was uploaded when the save fails', async () => {
		uploadImage.mockResolvedValue('https://x/images/u1/new.jpg')
		result = { data: null, error: new Error('denied') }
		const wrapper = mountModal('add')
		await fillForm(wrapper)
		await pickFile(wrapper, 'a.png')

		await submit(wrapper)

		expect(removeImages).toHaveBeenCalledWith(['https://x/images/u1/new.jpg'])
		expect(wrapper.emitted('productSaved')).toBeUndefined()
	})

	it('removes uploads already done when a later upload fails', async () => {
		uploadImage.mockResolvedValueOnce('https://x/images/u1/first.jpg').mockRejectedValueOnce(new Error('too big'))
		const wrapper = mountModal('add')
		await fillForm(wrapper)
		await pickFile(wrapper, 'a.png')
		await pickFile(wrapper, 'b.png')

		await submit(wrapper)

		expect(table.insert).not.toHaveBeenCalled()
		expect(removeImages).toHaveBeenCalledWith(['https://x/images/u1/first.jpg'])
	})

	it('only deletes images taken out on edit after the save worked', async () => {
		const wrapper = mountModal('edit')
		await wrapper.find('button.remove').trigger('click')

		await submit(wrapper)

		expect(table.update.mock.calls[0][0].image_url).toEqual(['https://images.unsplash.com/old-2'])
		expect(removeImages).toHaveBeenCalledWith(['https://x/images/u1/old-1.jpg'])
	})

	it('keeps the old files when RLS blocks the update without an error', async () => {
		result = { data: [], error: null }
		const wrapper = mountModal('edit')
		await wrapper.find('button.remove').trigger('click')

		await submit(wrapper)

		expect(wrapper.emitted('productSaved')).toBeUndefined()
		expect(removeImages).not.toHaveBeenCalledWith(['https://x/images/u1/old-1.jpg'])
	})
})

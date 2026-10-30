import { describe, it, expect } from 'vitest'
import { getUserSchema } from './userSchema'

const address = {
	cep: '01310-100',
	street: 'Av. Paulista',
	number: '1000',
	district: 'Bela Vista',
	city: 'São Paulo',
	state: 'SP',
	country: 'Brasil',
}

const errorsOf = async (schema, values) => {
	try {
		await schema.validate(values, { abortEarly: false })
		return []
	} catch (error) {
		return error.inner.map((issue) => issue.path)
	}
}

describe('getUserSchema', () => {
	it('strips the CEP mask', async () => {
		const values = await getUserSchema('address').validate(address)
		expect(values.cep).toBe('01310100')
	})

	it('address mode validates only the address', async () => {
		expect(await errorsOf(getUserSchema('address'), address)).toEqual([])
	})

	it('edit mode also requires email and name', async () => {
		expect(await errorsOf(getUserSchema('edit'), address)).toEqual(
			expect.arrayContaining(['email', 'name'])
		)
	})

	it('create mode requires a password of at least 6 characters', async () => {
		const values = { ...address, email: 'bia@example.com', name: 'Bia Silva', password: '123' }
		expect(await errorsOf(getUserSchema('create'), values)).toEqual(['password'])
	})

	it('reports a missing CEP instead of crashing on null', async () => {
		expect(await errorsOf(getUserSchema('address'), { ...address, cep: null })).toContain('cep')
	})
})

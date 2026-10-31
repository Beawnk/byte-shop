import { describe, it, expect } from 'vitest'
import { storagePath } from './storagePath'

describe('storagePath', () => {
	it('returns the path inside the images bucket', () => {
		const url = 'https://abc.supabase.co/storage/v1/object/public/images/user-1/foto.jpg'
		expect(storagePath(url)).toBe('user-1/foto.jpg')
	})

	it('ignores files outside the bucket', () => {
		expect(storagePath('https://abc.supabase.co/storage/v1/object/public/byte/avatars/profile-default.png')).toBeNull()
		expect(storagePath('https://images.unsplash.com/photo-1?w=900')).toBeNull()
	})

	it('ignores base64 and missing values', () => {
		expect(storagePath('data:image/png;base64,AAAA')).toBeNull()
		expect(storagePath(null)).toBeNull()
	})
})

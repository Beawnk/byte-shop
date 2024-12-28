import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'

export const useLoginStore = defineStore('login', () => {
	const logged = ref(false)
	const user = {
		id: ref(''),
		name: ref(''),
		email: ref(''),
		password: ref(''),
		is_vendor: ref(false),
		avatar: ref(
			'https://tnwvrtitkleeayjechmy.supabase.co/storage/v1/object/public/byte/avatars/profile-default.png'
		),
		street: ref(''),
		number: ref(''),
		district: ref(''),
		city: ref(''),
		state: ref(''),
		country: ref(''),
		zip_code: ref(''),
	}

	function updateLogin() {
		logged.value = true
	}

	function updateLogout() {
		logged.value = false
	}

	function unwrapUser() {
		return {
			name: user.name.value,
			email: user.email.value,
			password: user.password.value,
			is_vendor: user.is_vendor.value,
			avatar: user.avatar.value,
			address_street: user.street.value,
			address_number: user.number.value,
			address_district: user.district.value,
			address_city: user.city.value,
			address_state: user.state.value,
			address_country: user.country.value,
			address_cep: user.zip_code.value,
		}
	}
	async function createAccount() {
		const userData = unwrapUser()
		const { data, error } = await supabase
			.from('users')
			.insert([userData])
			.select()

		if (error) {
			console.error('Error creating account:', error.message)
		}
	}

	return {
		logged,
		user,
		updateLogin,
		updateLogout,
		createAccount,
	}
})
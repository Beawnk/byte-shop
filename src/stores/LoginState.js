import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoginStore = defineStore('login', () => {
    const logged = ref(false)
    const user = {
        id: ref(''),
        name: ref(''),
        email: ref(''),
        password: ref(''),
        is_vendor: ref(false),
        avatar: ref(new URL('@/assets/img/profile/profile-default.png', import.meta.url).href),
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

    function createAccount() {
        console.log('createAccount')
    }

    return {
        logged,
        user,
        updateLogin,
        updateLogout,
        createAccount
    }
})
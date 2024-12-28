import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoginStore = defineStore('login', () => {
    const logged = ref(false)
    const user = {
        id: ref(''),
        name: ref('Bianca Sineleck'),
        email: ref(''),
        password: ref(''),
        is_vendor: ref(false),
        avatar: ref(''),
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
<template>
  <section id="account" class="container" :class="{ login: loginStore.page === 'login', signup: loginStore.page === 'signup', user: loginStore.page === 'user' }">
    <UserMenu v-if="loginStore.logged" />
    <div class="account-wrapper">
        <Transition mode="out-in" appear><Login v-if="!loginStore.logged && loginStore.page == 'login'"  @emit-sign-up-page="onSignUpPage"/></Transition>
        <Transition mode="out-in" appear><SignUp v-if="!loginStore.logged && loginStore.page == 'signup'" @emit-login-page="onLoginPage"/></Transition>
        <Transition mode="out-in" appear><User v-if="loginStore.logged"/></Transition>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Login from '@/components/Login.vue';
import SignUp from '@/components/SignUp.vue';
import User from '@/components/User.vue';
import UserMenu from '@/components/UserMenu.vue';
import { useLoginStore } from '@/stores/LoginState';
import { useRoute, useRouter } from 'vue-router'

const loginStore = useLoginStore();
const route = useRoute()
const router = useRouter()

const onSignUpPage = () => {
    loginStore.page = 'signup';
    router.replace({ query: { page: 'signup' } })
};

const onLoginPage = () => {
    loginStore.page = 'login';
    router.replace({ query: { page: 'login' } }) 
};

onMounted(() => {
    if (route.query.page === 'signup') {
        loginStore.page = 'signup';
    } else if (loginStore.page === 'login') {
        router.replace({ query: { page: 'login' } })
    }
    if (loginStore.logged) {
        loginStore.page = 'user';
        router.replace({ query: { user: loginStore.user.name } })
    }
});
</script>

<style lang="scss">
#account {
    background-image: linear-gradient(180deg, var(--primary-color) 10%, var(--secondary-color) 90%);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    &.signup {
        padding-top: calc(var(--section) + var(--header-height));
        .account-wrapper {
            max-width: 900px;
        }
    }
    &.user {
        padding-top: calc(var(--section) + var(--header-height));
        align-items: flex-start;
        gap: 10px;
        .account-wrapper {
            max-width: 900px;
        }
    }
    .account-wrapper {
        width: 100%;
        max-width: 600px;
        background-color: var(--background-color);
        padding: 40px;
        border-radius: 10px;
        transition: max-width 0.5s ease;
    }
    .border {
        width: 100%;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 20px 0;
        color: var(--text-color);
        &::before {
            content: '';
            display: block;
            height: 1px;
            width: 100px;
            background-color: var(--gray-color);
            margin-right: 10px;
        }
        &::after {
            content: '';
            display: block;
            height: 1px;
            width: 100px;
            background-color: var(--gray-color);
            margin-left: 10px;
        }
    }
    .action {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        button {
            min-width: 160px;
        }
    }
}
</style>
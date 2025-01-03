<template>
  <section id="account" class="container" :class="{ login: userStore.page === 'login', signup: userStore.page === 'signup', user: userStore.page === 'user' }">
    <transition name="down" mode="out-in" appear>
        <div class="wrapper">
            <UserMenu v-if="userStore.logged" />
            <div class="account-wrapper">
                <Transition mode="out-in" appear><Login v-if="!userStore.logged && userStore.page == 'login'"  @emit-sign-up-page="onSignUpPage"/></Transition>
                <Transition mode="out-in" appear><SignUp v-if="!userStore.logged && userStore.page == 'signup'" @emit-login-page="onLoginPage"/></Transition>
                <Transition mode="out-in" appear><User v-if="userStore.logged"/></Transition>
            </div>
        </div>
    </transition>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Login from '@/components/Login.vue';
import SignUp from '@/components/SignUp.vue';
import User from '@/components/User.vue';
import UserMenu from '@/components/UserMenu.vue';
import { useUserStore } from '@/stores/UserState';
import { useRoute, useRouter } from 'vue-router'

const userStore = useUserStore();
const route = useRoute()
const router = useRouter()

const onSignUpPage = () => {
    userStore.page = 'signup';
    router.replace({ query: { page: 'signup' } })
};

const onLoginPage = () => {
    userStore.page = 'login';
    router.replace({ query: { page: 'login' } }) 
};

onMounted(() => {
    if (route.query.page === 'signup') {
        userStore.page = 'signup';
    } else if (userStore.page === 'login') {
        router.replace({ query: { page: 'login' } })
    }
    if (userStore.logged) {
        userStore.page = 'user';
        if (route.path !== '/usuario/alterar-senha') {
            router.replace({ query: { user: userStore.user.name } })
        }
    }
});
</script>

<style lang="scss">
#account {
    background-image: linear-gradient(180deg, var(--primary-color) 10%, var(--secondary-color) 90%);
    min-height: 100vh;
    &.signup {
        .wrapper {
            padding-top: calc(var(--section) + var(--header-height));
            .account-wrapper {
                max-width: 900px;
            }
        }
    }
    &.user {
        .wrapper {
            padding-top: calc(var(--section) + var(--header-height));
            align-items: flex-start;
            gap: 10px;
            .account-wrapper {
                max-width: 900px;
            }
        }
    }
    .wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
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
}
</style>
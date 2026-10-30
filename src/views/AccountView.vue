<template>
  <section id="account" class="container" :class="{ login: view === 'login', signup: view === 'signup', user: view === 'user' }">
    <transition name="down" mode="out-in" appear>
        <div class="wrapper">
            <UserMenu v-if="view === 'user'" />
            <div class="account-wrapper">
                <Transition mode="out-in" appear><Login v-if="view === 'login'" @emit-sign-up-page="goTo('signup')" @emit-forgot-pass-page="goTo('email-nova-senha')"/></Transition>
                <Transition mode="out-in" appear><SignUp v-if="view === 'signup'" @emit-login-page="goTo('login')"/></Transition>
                <Transition mode="out-in" appear><ForgotPass v-if="view === 'forgot-pass'" @emit-login-page="goTo('login')"/></Transition>
                <Transition mode="out-in" appear><ChangePass v-if="view === 'change-pass'" @emit-login-page="goTo('login')"/></Transition>
                <Transition mode="out-in" appear><User v-if="view === 'user'"/></Transition>
            </div>
        </div>
    </transition>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import Login from '@/components/Login.vue';
import SignUp from '@/components/SignUp.vue';
import User from '@/components/User.vue';
import UserMenu from '@/components/UserMenu.vue';
import { useUserStore } from '@/stores/UserState';
import { useRoute, useRouter } from 'vue-router'
import ForgotPass from '@/components/ForgotPass.vue';
import ChangePass from '@/components/ChangePass.vue';

const userStore = useUserStore();
const route = useRoute()
const router = useRouter()

// What this page shows comes from the route and the session, so back/forward and reloads keep it.
const view = computed(() => {
    if (route.name === 'change-password') return 'change-pass';
    if (userStore.logged) return 'user';
    if (route.query.page === 'signup') return 'signup';
    if (route.query.page === 'email-nova-senha') return 'forgot-pass';
    return 'login';
});

// Keeps ?redirect= so the user still lands where they were going after logging in.
const goTo = (page) => {
    router.replace({ name: 'user', query: { ...route.query, page } });
};
</script>

<style lang="scss" scoped>
@use '@/assets/style/main.scss' as m;

#account {
    background-image: linear-gradient(180deg, var(--primary-color) 10%, var(--secondary-color) 90%);
    min-height: 100vh;
    position: relative;
    &.signup {
        .wrapper {
            padding-top: var(--section);
            .account-wrapper {
                max-width: 900px;
            }
        }
    }
    &.user {
        .wrapper {
            padding-top: var(--section);
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
        min-height: calc(100vh - var(--header-height));
        .account-wrapper {
            width: 100%;
            max-width: 600px;
            background-color: var(--background-color);
            padding: 40px;
            border-radius: 10px;
            transition: max-width 0.5s ease;

            @include m.media(sm) {
                padding: 30px;
                max-width: 100%;
            }
        }
        :deep(.border) {
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
        :deep(.action) {
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
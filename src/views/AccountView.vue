<template>
  <section id="account" class="container" :class="{ login: userStore.page === 'login', signup: userStore.page === 'signup', user: userStore.page === 'user' }">
    <transition name="down" mode="out-in" appear>
        <div class="wrapper">
            <UserMenu v-if="userStore.logged" />
            <div class="account-wrapper">
                <Transition mode="out-in" appear><Login v-if="!userStore.logged && userStore.page == 'login'"  @emit-sign-up-page="onSignUpPage" @emit-forgot-pass-page="onForgotPassPage"/></Transition>
                <Transition mode="out-in" appear><SignUp v-if="!userStore.logged && userStore.page == 'signup'" @emit-login-page="onLoginPage"/></Transition>
                <Transition mode="out-in" appear><ForgotPass v-if="!userStore.logged && userStore.page == 'forgot-pass'" @emit-login-page="onLoginPage"/></Transition>
                <Transition mode="out-in" appear><ChangePass v-if="!userStore.logged && userStore.page == 'change-pass'" @emit-login-page="onLoginPage"/></Transition>
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
import ForgotPass from '@/components/ForgotPass.vue';
import ChangePass from '@/components/ChangePass.vue';

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

const onForgotPassPage = () => {
    userStore.page = 'forgot-pass';
    router.replace({ query: { page: 'email-nova-senha' } })
};

// function handleLoggedInUser() {
//     if (!route.path.startsWith('/usuario/alterar-senha')) {
//         console.log('1');
//         userStore.page = 'user';
//     }
// }

// function handleLoggedOutUser() {
//     console.log(route.path);
//     if (!route.path.startsWith('/usuario/alterar-senha')) {
//         if (route.query.page === 'signup') {
//             userStore.page = 'signup';
//             console.log('2');
//         } else if (userStore.page === 'login' && !redirect) {
//             if (route.query.page !== 'login') {
//                 router.replace({ query: { page: 'login' } });
//             }
//             console.log('3');
//         }
//     } else {
//         handleAccessToken();
//     }
// }

// function handleAccessToken() {
//     let accessToken = route.query.access_token;
//     if (!accessToken) {
//         const fragment = window.location.hash.substring(1);
//         const params = new URLSearchParams(fragment);
//         accessToken = params.get('access_token');
//     }
//     console.log(accessToken);
//     userStore.userToken = accessToken;
//     userStore.page = 'change-pass';
//     console.log('4');
// }

// onMounted(() => {
//     if (userStore.logged) {
//         handleLoggedInUser();
//     } else {
//         handleLoggedOutUser();
//     }
// });

onMounted(() => {
    const redirect = route.query.redirect;
    if (userStore.logged) {
        if (!route.path.startsWith('/usuario/alterar-senha')) {
            console.log('1')
            userStore.page = 'user';
        }
    } else {
        console.log(route.path)
        if (!route.path.startsWith('/usuario/alterar-senha')) {
            if (route.query.page === 'signup') {
                userStore.page = 'signup';
                console.log('2')
            } else if (userStore.page === 'login' && !redirect) {
                router.replace({ query: { page: 'login' } })
                console.log('3')
            }
        } else {
            let accessToken = route.query.access_token;
	  
		    // If not found, extract it from the URL fragment (#access_token)
		    if (!accessToken) {
		    	const fragment = window.location.hash.substring(1); // Get everything after #
		    	const params = new URLSearchParams(fragment);
		    	accessToken = params.get('access_token');
		    }
            console.log(accessToken)
            userStore.userToken = accessToken;
            userStore.page = 'change-pass';
            console.log('4')
        }
    }
});
</script>

<style lang="scss">
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
<template>
    <header>
        <div class="logo">
            <!-- alt="" because the visible text "byte" already names the link. -->
            <router-link to="/" aria-label="Byte Shop, página inicial"><img :src="logo" alt="" />byte</router-link>
        </div>
        <nav aria-label="Principal">
            <router-link to="/">Home</router-link>
            <router-link to="/produtos">Produtos</router-link>
        </nav>
        <div class="user">
            <router-link :to="{ name: 'cart' }" class="cart-link" :aria-label="`Carrinho, ${cart.count} ${cart.count === 1 ? 'item' : 'itens'}`">
                <CartIcon :size="26" />
                <span class="count" v-if="cart.count">{{ cart.count }}</span>
            </router-link>
            <router-link to="/usuario" v-if="!isLogged" class="btn primary">Login</router-link>
            <router-link to="/usuario" v-else class="username">{{ userName }}</router-link>
        </div>
    </header>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/UserState';
import { useCartStore } from '@/stores/cartStore';
import CartIcon from '@/components/CartIcon.vue';

const userStore = useUserStore();
const cart = useCartStore();
const route = useRoute();
const logoWhite = new URL('@/assets/img/logo-white.png', import.meta.url).href;
const logoDefault = new URL('@/assets/img/logo.png', import.meta.url).href;

const isLogged = computed(() => userStore.logged);
const userName = computed(() => (userStore.user.name ?? '').replace(/ .*/, ''));

// White logo over the gradient pages (home and account). Computed from the route, so the
// header renders right away instead of waiting for mount to pick a logo.
const logo = computed(() =>
    route.path === '/' || route.path.startsWith('/usuario') ? logoWhite : logoDefault
);
</script>

<style lang="scss" scoped>
@use '@/assets/style/main.scss' as m;

header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 40px;
    position: absolute;
    top: 0;
    left: 0;
    height: var(--header-height);
    width: 100%;
    box-shadow: var(--shadow);
    z-index: 10;
    @include m.media(xs) {
        padding: 20px;
    }
    .gradient & {
        box-shadow: none;
    }
    .logo {
        a {
            display: flex;
            align-items: center;
            font-family: var(--ff-primary-semiBold);
            color: var(--primary-color);
            font-size: var(--subtitle-big);
            position: relative;
            padding-bottom: 3px;
            @include m.media(xxs) {
                font-size: 0;
            }
            .gradient & {
                color: var(--white-color);
            }
            &::after {
                //gradient border bottom
                content: '';
                display: none;
                position: absolute;
                left: 50px;
                bottom: 0;
                width: 0;
                height: 3px;
                display: block;
                background-image: linear-gradient(120deg, var(--primary-color), var(--secondary-color));
                transition-property: overlay, display, width;
                transition-duration: 0.3s;
                transition-behavior: allow-discrete;
                @include m.media(xs) {
                    left: 40px;
                    height: 2px;
                }
            }
            .gradient &::after {
                background-color: var(--white-color);
                background-image: none;
            }
            &:hover {
                &::after {
                    display: block;
                    width: 55px;
                    @include m.media(xs) {
                        width: 45px;
                    }
                    @starting-style {
                        width: 0;
                    }
                }
            }
            img {
                width: 40px;
                margin-right: 10px;
                @include m.media(xs) {
                    width: 30px;
                }
                @include m.media(xxs) {
                    margin-right: 0;
                }
            }
        }
    }
    nav {
        display: flex;
        align-items: center;
        padding: 3px;
        background-color: var(--white-color);
        border-radius: 30px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        // On small phones the header holds logo, nav and cart side by side instead of centering the nav.
        @include m.media(xxs) {
            position: static;
            transform: none;
        }
        a {
            margin-right: 10px;
            font-family: var(--ff-primary);
            color: var(--primary-color);
            font-size: var(--text-medium);
            transition: var(--transition);
            padding: 10px;
            border-radius: 30px;
            @include m.media(xs) {
                padding: 6px;
            }
            &:last-child {
                margin-right: 0;
            }
            &:hover {
                color: var(--secondary-color);
            }
            &.router-link-active {
                color: var(--white-color);
                background-color: var(--primary-color);
            }
        }
    }
    .user {
        display: flex;
        align-items: center;
        gap: 15px;
        @include m.media(xs) {
            gap: 8px;
        }
        .cart-link {
            position: relative;
            display: flex;
            color: var(--primary-color);
            transition: var(--transition);
            .gradient & {
                color: var(--white-color);
            }
            &:hover {
                color: var(--secondary-color);
            }
            .count {
                position: absolute;
                top: -8px;
                right: -8px;
                min-width: 18px;
                height: 18px;
                padding: 0 4px;
                border-radius: 9px;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: var(--secondary-color);
                color: var(--white-color);
                font-family: var(--ff-primary-semiBold);
                font-size: 12px;
            }
        }
        .username {
            color: var(--primary-color);
            font-size: var(--text-medium);
            padding: 10px;
            border-radius: 30px;
            background-color: var(--white-color);
            transition: var(--transition);
            &:hover {
                background-color: var(--secondary-color);
                color: var(--white-color);
            }
        }
    }
}
</style>
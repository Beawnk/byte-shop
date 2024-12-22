<template>
    <header>
        <div class="logo">
            <router-link to="/" exact><img src="../assets/img/logo.png" alt="Byte" />byte</router-link>
        </div>
        <nav>
            <router-link to="/" exact>Home</router-link>
            <router-link to="/about">About</router-link>
            <router-link to="/contact">Contact</router-link>
        </nav>
        <div class="user">
            <router-link to="/login">Login</router-link>
        </div>
    </header>
</template>

<script setup>

</script>

<style lang="scss" scoped>
header {
    display: flex;
    justify-content: space-between;
    padding: 20px 40px;
    .logo {
        a {
            display: flex;
            align-items: center;
            font-family: var(--ff-primary-semiBold);
            color: var(--primary-color);
            font-size: var(--subtitle-big);
            position: relative;
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
            }
            &:hover {
                &::after {
                    display: block;
                    width: 55px;
                    @starting-style {
                        width: 0;
                    }
                }
            }
            img {
                width: 40px;
                margin-right: 10px;
            }
        }
    }
    nav {
        display: flex;
        align-items: center;
        padding: 3px;
        background-color: var(--white-color);
        border-radius: 30px;
        a {
            margin-right: 10px;
            font-family: var(--ff-primary-Medium);
            color: var(--primary-color);
            font-size: var(--subtitle-small);
            transition: var(--transition);
            padding: 10px;
            border-radius: 30px;
            &:last-child {
                margin-right: 0;
            }
            &:hover {
                color: var(--secondary-color);
            }
            &.router-link-exact-active {
                color: var(--white-color);
                background-color: var(--primary-color);
            }
        }
    }
}
</style>
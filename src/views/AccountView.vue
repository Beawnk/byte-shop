<template>
  <section id="account" class="container">
    <div class="account-wrapper">
        <Login v-if="page === 'login'" />
        <SignUp v-if="page === 'signup'"/>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Login from '@/components/Login.vue';
import SignUp from '@/components/SignUp.vue';

const page = ref('login');
</script>

<style lang="scss" scoped>
#account {
    background-image: linear-gradient(180deg, var(--primary-color) 10%, var(--secondary-color) 90%);
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    .account-wrapper {
        width: 100%;
        max-width: 600px;
        background-color: var(--background-color);
        padding: 40px;
        border-radius: 10px;
    }
}
</style>
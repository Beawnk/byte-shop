<template>
  <footer>
    <p>&copy; {{ year }} Byte Shop. <router-link :to="{ name: 'about' }">Sobre o projeto</router-link></p>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear();
</script>

<style lang="scss" scoped>
@use '@/assets/style/main.scss' as m;

footer {
    a {
        color: inherit;
        text-decoration: underline;
    }
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
    background-color: var(--primary-color);
    color: var(--white-color);
    position: relative;
    top: 60px;
    @include m.media(xs) {
        top: 40px;
        height: 40px;
    }
    .gradient & {
      background-color: var(--secondary-color);
      top: 0;
    }
}
</style>
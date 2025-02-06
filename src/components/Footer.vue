<template>
  <footer>
    <p>&copy; 2024 All rights reserved</p>
  </footer>
</template>

<script setup>

</script>

<style lang="scss" scoped>
@use '@/assets/style/main.scss' as m;

footer {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
    background-color: var(--primary-color);
    color: var(--white-color);
    position: relative;
    top: 60px;
    @include m.media(540px) {
        top: 40px;
        height: 40px;
    }
    .gradient & {
      background-color: var(--secondary-color);
      top: 0;
    }
}
</style>
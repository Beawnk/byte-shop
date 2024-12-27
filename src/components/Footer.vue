<template>
  <footer>
    <p>&copy; 2024 All rights reserved</p>
  </footer>
</template>

<script setup>

</script>

<style lang="scss" scoped>
footer {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
    background-color: var(--primary-color);
    color: var(--white-color);
    position: relative;
    top: 60px;
    .gradient & {
      background-color: var(--secondary-color);
      top: 0;
    }
}
</style>
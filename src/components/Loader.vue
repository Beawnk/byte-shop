<template>
    <div class="loader">
        <div class="loader-spinner"></div>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.loader {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;
}

.loader-spinner {
  width: 48px;
  height: 48px;
  display: inline-block;
  position: relative;
}
.loader-spinner::after,
.loader-spinner::before {
  content: '';  
  box-sizing: border-box;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: 3px solid var(--primary-color);
  position: absolute;
  left: 0;
  top: 0;
  animation: animloader 2s linear infinite;
}
.loader-spinner::after {
  animation-delay: 1s;
  border-color: var(--secondary-color);
}

@keyframes animloader {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}
</style>
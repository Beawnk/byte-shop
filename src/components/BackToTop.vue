<template>
  <Transition name="back-to-top">
    <button v-if="visible" class="back-to-top" type="button" aria-label="Voltar ao topo" @click="scrollToTop">
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 19V5" />
        <path d="m5 12 7-7 7 7" />
      </svg>
    </button>
  </Transition>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

const SCROLL_LIMIT = 400;

const visible = ref(false);

const updateVisible = () => {
  visible.value = window.scrollY > SCROLL_LIMIT;
};

const scrollToTop = () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
};

onMounted(() => {
  updateVisible();
  window.addEventListener('scroll', updateVisible, { passive: true });
});

onBeforeUnmount(() => window.removeEventListener('scroll', updateVisible));
</script>

<style lang="scss" scoped>
@use '@/assets/style/main.scss' as m;

.back-to-top {
  display: none;
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 20;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: var(--white-color);
  box-shadow: var(--shadow);
  cursor: pointer;
  @include m.media(md) {
    display: flex;
  }
}

.back-to-top-enter-active,
.back-to-top-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.back-to-top-enter-from,
.back-to-top-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>

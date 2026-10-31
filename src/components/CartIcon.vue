<template>
  <svg viewBox="0 0 24 24" :width="size" :height="size" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="9" cy="20" r="1.5" />
    <circle cx="18" cy="20" r="1.5" />
    <path d="M2 3h3l2.6 12.4a1.5 1.5 0 0 0 1.5 1.2h8.8a1.5 1.5 0 0 0 1.5-1.2L21 7H6" />
    <path v-if="checked" d="M10 11l2.5 2.5L17 9.5" />
  </svg>
</template>

<script setup>
defineProps({
  size: {
    type: Number,
    default: 24
  },
  // The check mark shows "already in the cart" without relying on color alone.
  checked: {
    type: Boolean,
    default: false
  }
})
</script>

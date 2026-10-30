<template>
  <div class="modal modal-reviews">
    <div class="modal-content" ref="modal">
      <button class="close" type="button" aria-label="Fechar avaliações" @click="closeModal"></button>
      <VendorInfo :vendor="vendor" />
      <ReviewList :reviews="reviews" :loading="loading" />
      <Loader v-if="loading" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import VendorInfo from '@/components/VendorInfo.vue'
import ReviewList from '@/components/ReviewList.vue'
import { useClickOutside } from '@/composables/clickOutside';
import { useReviews } from '@/composables/useReviews';

const props = defineProps({
  vendor: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['emitCloseModal'])

const { reviews, loading, load } = useReviews()
const modal = ref(null)

const closeModal = () => {
  emit('emitCloseModal')
}

useClickOutside(modal, closeModal)

// Reload when the same component is reused for another vendor (e.g. navigating between products).
watch(() => props.vendor.id, (id) => load({ vendorId: id }), { immediate: true })
</script>

<style lang="scss" scoped>
.modal {
  .modal-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
}
</style>

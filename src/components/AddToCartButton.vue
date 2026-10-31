<template>
  <!-- compact: icon only, for the product cards. -->
  <button
    type="button"
    class="btn add-to-cart"
    :class="[compact ? 'compact' : '', inCart ? 'in-cart secondary' : compact ? 'primary' : 'secondary']"
    :aria-pressed="inCart"
    :aria-label="compact ? `${actionLabel}: ${productName}` : undefined"
    @click="toggle"
  >
    <CartIcon v-if="compact" :checked="inCart" />
    <template v-else>{{ actionLabel }}</template>
  </button>
</template>

<script setup>
import { computed } from 'vue';
import CartIcon from '@/components/CartIcon.vue';
import { useCartStore } from '@/stores/cartStore';

const props = defineProps({
  productId: {
    type: String,
    required: true
  },
  productName: {
    type: String,
    default: ''
  },
  compact: {
    type: Boolean,
    default: false
  }
})

const cart = useCartStore();

const inCart = computed(() => cart.has(props.productId));
const actionLabel = computed(() => (inCart.value ? 'Remover do carrinho' : 'Adicionar ao carrinho'));

const toggle = () => {
  if (inCart.value) {
    cart.remove(props.productId);
  } else {
    cart.add(props.productId);
  }
};
</script>

<style lang="scss" scoped>
.compact {
  display: flex;
  align-items: center;
  justify-content: center;
  // 8px + 24px icon + the .btn border = same 44px height as the favorite button.
  padding: 8px;
  svg {
    display: block;
  }
  // Inverted so "in the cart" doesn't look like the hover state of the green button.
  &.in-cart {
    background-color: var(--white-color);
    border-color: var(--primary-color);
    color: var(--primary-color);
    &:hover {
      background-color: var(--gray-color);
    }
  }
}
</style>

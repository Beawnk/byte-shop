<template>
	<div class="user-products">
		<h2>Seus produtos</h2>
		<button class="btn primary add" v-if="!showAddProduct" @click="showAddProduct = true">Adicionar produto</button>
		<transition name="down" mode="out-in" appear><UserAddProduct v-show="showAddProduct" @hide-add-product="showAddProduct = false"/></transition>
		<UserProducts />
	</div>
</template>

<script setup>
import { ref } from 'vue';
import UserAddProduct from '@/components/UserAddProduct.vue';
import UserProducts from '@/components/UserProducts.vue';

const showAddProduct = ref(false);
</script>

<style lang="scss" scoped>
.user-products {
	h2 {
		color: var(--text-color);
	}
	.add {
		margin-top: 20px;
	}
}
</style>
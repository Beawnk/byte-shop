<template>
	<div class="user-products">
		<h2>Seus produtos</h2>
		<button class="btn primary add" v-if="!showHandleProduct" @click="addNewProduct">Adicionar produto</button>
		<transition name="down" mode="out-in" appear><UserHandleProduct v-show="showHandleProduct" :productId="editedProduct" :mode="handleProductMode" @hide-product-modal="showHandleProduct = false" @product-saved="fetchProducts++" :class="[{open: showHandleProduct}, handleProductMode]"/></transition>
		<UserProducts :fetchProducts="fetchProducts" @handle-product-mode-edit="editProduct" />
	</div>
</template>

<script setup>
import { ref } from 'vue';
import UserHandleProduct from '@/components/UserHandleProduct.vue';
import UserProducts from '@/components/UserProducts.vue';

const showHandleProduct = ref(false);
const handleProductMode = ref('');
const fetchProducts = ref(0);
const editedProduct = ref(null);

const addNewProduct = () => {
	handleProductMode.value = 'add';
	showHandleProduct.value = true;
};

const editProduct = (productId) => {
	editedProduct.value = productId;
	handleProductMode.value = 'edit';
	showHandleProduct.value = true;
};
</script>

<style lang="scss" scoped>
.user-products {
	h2 {
		color: var(--text-color);
	}
	.btn.add {
		margin-top: 20px;
	}
}
</style>
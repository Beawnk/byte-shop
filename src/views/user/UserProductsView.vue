<template>
	<div class="user-products">
		<h2>Seus produtos</h2>
		<button class="btn primary add" v-if="!showHandleProduct" @click="addNewProduct">Adicionar produto</button>
		<!-- v-if (not v-show): the form mounts fresh on every open, so it never shows stale values. -->
		<transition name="down" mode="out-in" appear><UserHandleProduct v-if="showHandleProduct" :key="editedProduct ?? 'new'" :productId="editedProduct" :mode="handleProductMode" @hide-product-modal="showHandleProduct = false" @product-saved="fetchProducts++" :class="[{open: showHandleProduct}, handleProductMode]"/></transition>
		<UserProducts :fetchProducts="fetchProducts" @handle-product-mode-edit="editProduct" />
	</div>
</template>

<script setup>
import { ref } from 'vue';
import UserHandleProduct from '@/components/UserHandleProduct.vue';
import UserProducts from '@/components/UserProducts.vue';
import { useAlertStore } from '@/stores/alertStore';

const alertStore = useAlertStore();

const showHandleProduct = ref(false);
const handleProductMode = ref('');
const fetchProducts = ref(0);
const editedProduct = ref(null);

const addNewProduct = () => {
	editedProduct.value = null;
	handleProductMode.value = 'add';
	showHandleProduct.value = true;
};

const editProduct = (productId, isSold) => {
	if (!isSold) {
		editedProduct.value = productId;
		handleProductMode.value = 'edit';
		showHandleProduct.value = true;
	} else {
		alertStore.addGlobalError('Produto vendido não pode ser editado.');
	}
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
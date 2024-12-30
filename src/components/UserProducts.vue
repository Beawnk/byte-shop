<template>
	<div class="products">
		<p>produtos</p>
		<div class="products-list" v-if="products">
			<div v-for="product in products" :key="product.id" class="product">
				<p>{{ product.name }}</p>
			</div>
		</div>
		<div v-else>
			<p>Nenhum produto encontrado</p>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/UserState';

const userStore = useUserStore();
const products = ref([]);

onMounted(async () => {
	console.log(userStore.user.id);
	if(userStore.user.id) {
		products.value = await userStore.loadProducts();
	}
});
</script>

<style lang="scss" scoped>

</style>
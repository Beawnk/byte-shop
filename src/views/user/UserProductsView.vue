<template>
	<div class="user-products">
		<h1>Seus produtos</h1>
		<UserProducts />
		<UserAddProduct />
	</div>
</template>

<script setup>
import UserAddProduct from '@/components/UserAddProduct.vue';
import UserProducts from '@/components/UserProducts.vue';
</script>

<style lang="scss" scoped>

</style>
<template>
  	<router-link :to="{name: 'product', params: {id: product.id}}" class="product-link">
		<div class="product-image">
			<img :src="product.image_url" alt="product.name" />
		</div>
		<div class="product-info">
			<h5>{{ product.name }}</h5>
			<p>{{ product.description }}</p>
			<p class="price">{{ formatCurrency(product.price) }}</p>
		</div>
	</router-link>
</template>

<script setup>
import { formatCurrency } from '@/composables/formatCurrency';

const props = defineProps(['product'])
</script>

<style lang="scss" scoped>
.product-link {
	background-color: var(--white-color);
	border-radius: var(--border-radius);
	overflow: hidden;
	margin-top: 20px;
	box-shadow: var(--shadow);
	display: flex;
	align-items: center;
	transition: var(--transition);
	&:hover {
		transform: scale(1.02);
	}
	.product-image {
		width: 150px;
		height: 150px;
		img {
			width: 150px;
			height: 150px;
			object-fit: cover;
		}
	}
	.product-info {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 20px;
		h5 {
			color: var(--text-color);
			font-family: var(--ff-primary-semiBold);
			margin-bottom: 10px;
		}
		p {
			color: var(--text-color);
			font-size: var(--text-small);
		}
		.price {
			color: var(--primary-color);
			font-size: var(--text-medium);
			font-family: var(--ff-primary-semiBold);
			margin-top: 10px;
		}
	}
}

</style>
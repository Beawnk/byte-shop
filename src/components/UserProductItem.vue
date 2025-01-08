<template>
  	<router-link :to="{name: 'product', params: {id: product.id}}" class="product-link">
		<div class="product-image">
			<img :src="product.image_url[0]" alt="product.name" />
		</div>
		<div class="product-info">
			<h5>{{ truncatedText(product.name, 40) }}</h5>
			<p class="description">{{ truncatedText(product.description, 150, '...') }}</p>
			<p class="price">{{ formatCurrency(product.price) }}</p>
		</div>
		<slot></slot>
	</router-link>
</template>

<script setup>
import { formatCurrency } from '@/composables/formatCurrency';

const props = defineProps(['product'])

const truncatedText = (string, letters, end = '') => {
	return string.substring(0, letters) + end
}
</script>

<style lang="scss" scoped>
.product-link {
	width: 100%;
	background-color: var(--white-color);
	border-radius: var(--border-radius);
	overflow: hidden;
	box-shadow: var(--shadow);
	display: flex;
	align-items: center;
	transition: width 0.5s ease;
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
.show-actions {
	&.sold {
		.product-link {
			width: 100%;
		}
	}
	.product-link {
    	width: calc(100% - 50px);
	}
}

</style>
<template>
  	<router-link :to="{name: 'product', params: {id: product.id}}" class="product-link">
		<div class="product-image">
			<img :src="product.image_url?.[0]" :alt="product.name" />
		</div>
		<div class="product-info">
			<h5>{{ truncate(product.name, 40) }}</h5>
			<p class="description">{{ truncate(product.description, 150, '...') }}</p>
			<p class="price">{{ formatCurrency(product.price) }}</p>
		</div>
	</router-link>
</template>

<script setup>
import { formatCurrency } from '@/composables/formatCurrency';
import { truncate } from '@/utils/truncate';

defineProps(['product'])

</script>

<style lang="scss" scoped>
@use '@/assets/style/main.scss' as m;

.product-link {
	width: 100%;
	background-color: var(--white-color);
	border-radius: var(--border-radius);
	overflow: hidden;
	box-shadow: var(--shadow);
	display: flex;
	align-items: center;
	transition: width 0.5s ease;

	@include m.media(sm) {
		flex-direction: column;
		padding-bottom: 50px;
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
.show-actions {
	&.sold {
		.product-link {
			width: 100%;
		}
	}
	.product-link {
    	width: calc(100% - 50px);

		@include m.media(sm) {
			width: 100%;
		}
	}
}

.sold {
	@include m.media(sm) {
		.product-link {
			padding-bottom: 0;
		}
	}
}

</style>
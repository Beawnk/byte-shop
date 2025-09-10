<template>
	<div class="id-date">
		<p><strong>ID:</strong> {{ truncatedText(order.id, 8, '...') }}</p>
		<p><strong>Data:</strong> {{ dateTimeFormatted }}</p>
	</div>
	<div class="order-wrapper">
		<router-link :to="{name: 'product', params: {id: order.product_id}}" class="product-item" v-if="order.product">
			<div class="product-image">
			  	<img :src="order.product.pictures[0]" alt="Product image" />
			</div>
			<div class="product-info">
				<h5>{{ order.product.name }}</h5>
			  	<p>{{ truncatedText(order.product.description, 70) }}</p>
			  	<p class="price">{{ formatCurrency(order.product.price) }}</p>
			</div>
  		</router-link>
		<div class="order-item" v-if="order">
			<div class="address">
				<p><strong>Endereço de entrega:</strong></p>
				<p>{{ order.address.cep }}</p>
				<p>{{ order.address.street }}, {{ order.address.number }}</p>
				<p>{{ order.address.district }}</p>
				<p>{{ order.address.city }} - {{ order.address.state }}</p>
				<p>{{ order.address.country }}</p>
			</div>
			<div class="order-info">
				<p><strong>Total:</strong> {{ formatCurrency(order.total) }}</p>
			</div>
		</div>
	</div>
	<slot></slot>
</template>

<script setup>
import { formatCurrency } from '@/composables/formatCurrency';
import { DateTime } from 'luxon';

const props = defineProps(['order'])

const dateTime = DateTime.fromISO(props.order.created_at, { zone: 'utc' }).setZone('America/Sao_Paulo');

const dateTimeFormatted = dateTime.toFormat('dd/MM/yyyy HH:mm:ss')

const truncatedText = (string, letters, end = '') => {
	return string.substring(0, letters) + end
}
</script>

<style lang="scss" scoped>
@use '@/assets/style/main.scss' as m;

.id-date {
	display: flex;
	gap: 10px;
	margin-bottom: 20px;
	border-bottom: 1px solid var(--gray-color);
	padding-bottom: 20px;
	justify-content: space-between;
	p {
		color: var(--text-color);
	}
}
.order-wrapper {
	display: flex;
	justify-content: space-between;
	.product-item {
		display: flex;
		align-items: flex-start;
		margin-bottom: 20px;
		gap: 20px;
		width: 50%;
		&:hover {
			h5 {
				text-decoration: underline;
			}
		}
		.product-image {
			width: 150px;
			height: 150px;
			border-radius: var(--border-radius);
			overflow: hidden;
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
			width: calc(100% - 170px);
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
	.order-item {
		border-left: 1px solid var(--gray-color);
		padding-left: 20px;
		.address {
			p {
				color: var(--text-color);
				margin-bottom: 5px;
			}
		}
		.order-info {
			margin-top: 20px;
			p {
				color: var(--text-color);
				margin-bottom: 5px;
			}
		}
	}
}
</style>
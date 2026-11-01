<template>
	<div class="user-orders">
		<h2>Seus pedidos</h2>
		<div class="orders paged-list" ref="listTop">
			<TransitionGroup class="orders-list" v-if="orders.length" name="list" tag="div" :css="false" @before-enter="onBeforeEnter" @enter="onEnter" @leave="onLeave" appear>
				<div v-for="(order, index) in visibleItems" :key="order.id" :data-index="index" class="order">
					<UserOrderItem :order="order">
						<button class="btn primary" @click.prevent="openReviewModal(order)" :disabled="isReviewed(order)">Avaliar</button>
					</UserOrderItem>
				</div>
			</TransitionGroup>
			<div class="no-orders" v-else-if="orders.length === 0 && !loading">
				<h5>Nenhum pedido encontrado</h5>
			</div>
			<ListPagination :page="page" :total-pages="totalPages" label="Páginas dos seus pedidos" @change="goToPage" />
			<Loader v-if="loading"/>
		</div>
	</div>
	<UserAddReview v-if="showAddReviewModal" :class="{open: showAddReviewModal}" @close-modal="toggleModal" @reviewed-order="fetchUserReviews" :order="selectedOrder"/>
</template>

<script setup>
import { useListAnimation } from '@/composables/useListAnimation';
import { usePagination } from '@/composables/usePagination';
import { ref, onMounted } from 'vue';
import UserOrderItem from '@/components/UserOrderItem.vue';
import UserAddReview from "@/components/UserAddReview.vue";
import ListPagination from '@/components/ListPagination.vue';
import { useUserStore } from '@/stores/UserState';
import { useAlertStore } from '@/stores/alertStore';
import { supabase } from '@/lib/supabaseClient';

const userStore = useUserStore();
const alertStore = useAlertStore();

const orders = ref([]);
const showAddReviewModal = ref(false);
const selectedOrder = ref(null);
const userReviews = ref([]);
const loading = ref(false);

const { page, totalPages, visibleItems, listTop, goToPage } = usePagination(orders);

const fetchOrders = async () => {
	loading.value = true;
	const { data, error } = await supabase
		.from('orders')
		.select('*')
		.eq('buyer_id', userStore.user.id)
		.order('created_at', { ascending: false });
	loading.value = false;

	if (error) {
		alertStore.addGlobalError('Erro ao carregar seus pedidos.', error);
	} else {
		orders.value = data;
	}
};

const fetchUserReviews = async () => {
	const { data, error } = await supabase
		.from('reviews')
		.select('product_id')
		.eq('user_id', userStore.user.id);

	if (error) {
		alertStore.addGlobalError('Erro ao carregar suas avaliações.', error);
	} else {
		userReviews.value = data;
	}
};

const isReviewed = (order) => {
	return userReviews.value.some(review => review.product_id === order.product_id);
};

const openReviewModal = (order) => {
	selectedOrder.value = order;
	toggleModal();
};

const toggleModal = () => {
	showAddReviewModal.value = !showAddReviewModal.value;
};

onMounted(() => {
	fetchOrders();
	fetchUserReviews();
});

const { onBeforeEnter, onEnter, onLeave } = useListAnimation({ enterDuration: 0.3, enterStagger: 0.04, leaveDuration: 0 });
</script>

<style lang="scss" scoped>
.user-orders {
	position: relative;
	min-height: 400px;
	h2 {
		color: var(--text-color);
	}
	.orders {
		margin-top: 20px;
		.no-orders {
			text-align: center;
			height: 400px;
			display: flex;
			justify-content: center;
			align-items: center;
			h5 {
				color: var(--text-color);
			}
		}
		
		.orders-list {
			.order {
				background-color: var(--white-color);
				box-shadow: var(--shadow);
				padding: 20px;
				border-radius: var(--border-radius);
				margin-top: 20px;
			}
		}
	}
}
</style>
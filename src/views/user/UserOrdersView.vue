<template>
	<div class="user-orders">
		<h2>Seus pedidos</h2>
		<div class="orders">
			<TransitionGroup class="orders-list" v-if="orders.length" name="list" tag="div" :css="false" @before-enter="onBeforeEnter" @enter="onEnter" @leave="onLeave" appear>
				<div v-for="(order, index) in orders" :key="order.id" :data-index="index" class="order">
					<UserOrderItem :order="order">
						<button class="btn primary" @click.prevent="openReviewModal(order)" :disabled="isReviewed(order)">Avaliar</button>
					</UserOrderItem>
				</div>
			</TransitionGroup>
			<div class="no-orders" v-else-if="orders.length === 0 && !loading">
				<h5>Nenhum pedido encontrado</h5>
			</div>
			<Loader v-if="loading"/>
		</div>
	</div>
	<UserAddReview v-if="showAddReviewModal" :class="{open: showAddReviewModal}" @close-modal="toggleModal" @reviewed-order="fetchUserReviews" :order="selectedOrder"/>
</template>

<script setup>
import { gsap } from "gsap";
import { ref, onMounted } from 'vue';
import UserOrderItem from '@/components/UserOrderItem.vue';
import UserAddReview from "@/components/UserAddReview.vue";
import { useUserStore } from '@/stores/UserState';
import { supabase } from '@/lib/supabaseClient';

const userStore = useUserStore();

const orders = ref([]);
const showAddReviewModal = ref(false);
const selectedOrder = ref(null);
const userReviews = ref([]);
const loading = ref(false);

const fetchOrders = async () => {
	loading.value = true;
	const { data, error } = await supabase
		.from('orders')
		.select('*')
		.eq('buyer_id', userStore.user.id);

	if (error) {
		console.error(error);
	} else {
		orders.value = data;
		loading.value = false;
	}
};

const fetchUserReviews = async () => {
	const { data, error } = await supabase
		.from('reviews')
		.select('*')
		.eq('user_id', userStore.user.id);

	if (error) {
		console.error(error);
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

// GSAP Hooks
function onBeforeEnter(el) {
  el.style.opacity = 0;
  el.style.transform = "translateX(-30px)";
}

function onEnter(el, done) {
  gsap.fromTo(
    el,
    { opacity: 0, x: -30 },
    {
      opacity: 1,
      x: 0,
      duration: 0.5,
      delay: parseInt(el.dataset.index) * 0.15, // Stagger based on index
      clearProps: "transform",
      onComplete: done,
    }
  );
}

function onLeave(el, done) {
  gsap.to(el, {
    opacity: 0,
    x: 30,
    duration: 0.5,
    delay: parseInt(el.dataset.index) * 0.15, // Stagger based on index
    onComplete: done,
  });
}
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
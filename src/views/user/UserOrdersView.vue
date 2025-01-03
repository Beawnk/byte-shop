<template>
	<div class="user-orders">
		<h2>Seus pedidos</h2>
		<div class="orders">
			<TransitionGroup class="orders-list" v-if="orders" name="list" tag="div" :css="false" @before-enter="onBeforeEnter" @enter="onEnter" @leave="onLeave" appear>
				<div v-for="(order, index) in orders" :key="order.id" :data-index="index" class="order">
					<UserOrderItem :order="order">
						<button class="btn primary">Avaliar</button>
					</UserOrderItem>
				</div>
			</TransitionGroup>
		</div>
	</div>
</template>

<script setup>
import { gsap } from "gsap";
import { ref, onMounted } from 'vue';
import UserOrderItem from '@/components/UserOrderItem.vue';
import { useUserStore } from '@/stores/UserState';
import { supabase } from '@/lib/supabaseClient';

const userStore = useUserStore();

const orders = ref([]);

const fetchOrders = async () => {
	const { data, error } = await supabase
		.from('orders')
		.select('*')
		.eq('buyer_id', userStore.user.id);

	if (error) {
		console.error(error);
	} else {
		orders.value = data;
	}
};

onMounted(() => {
	fetchOrders();
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
	h2 {
		color: var(--text-color);
	}
	.orders {
		margin-top: 20px;
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
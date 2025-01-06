<template>
	<div class="user-sales">
		<h2>Suas vendas</h2>
		<div class="sales">
			<TransitionGroup class="sales-list" v-if="sales.length" name="list" tag="div" :css="false" @before-enter="onBeforeEnter" @enter="onEnter" @leave="onLeave" appear>
				<div v-for="(sale, index) in sales" :key="sale.id" :data-index="index" class="sale">
					<UserOrderItem :order="sale">
						<p v-if="sale.buyer" class="buyer"><strong>Comprador:</strong> {{ sale.buyer.name }}</p>
					</UserOrderItem>
				</div>
			</TransitionGroup>
			<div class="no-sales" v-else>
				<h5>Nenhuma venda encontrada</h5>
			</div>
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

const sales = ref([]);

const fetchSales = async () => {
	try {
		const { data: salesData, error: salesError } = await supabase
			.from('orders')
			.select('*')
			.eq('buyer_id', userStore.user.id);

		if (salesError) {
			console.error('Error fetching sales:', salesError);
			return;
		}

		for (const sale of salesData) {
			const { data: buyerData, error: buyerError } = await supabase
				.from('users')
				.select('name')
				.eq('id', sale.buyer_id)
				.single();

			if (buyerError) {
				console.error(`Error fetching buyer for sale ${sale.id}:`, buyerError);
				sale.buyer = { name: 'Desconhecido' };
			} else {
				sale.buyer = buyerData;
			}
		}

		sales.value = salesData;
	} catch (error) {
		console.error('Error in fetchsales:', error);
	}
};

onMounted(() => {
	fetchSales();
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
.user-sales {
	h2 {
		color: var(--text-color);
	}
	.sales {
		margin-top: 20px;
		.no-sales {
			text-align: center;
			height: 400px;
			display: flex;
			justify-content: center;
			align-items: center;
			h5 {
				color: var(--text-color);
			}
		}
		.sales-list {
			.sale {
				background-color: var(--white-color);
				box-shadow: var(--shadow);
				padding: 20px;
				border-radius: var(--border-radius);
				margin-top: 20px;
				.buyer {
					color: var(--text-color);
					border-top: 1px solid var(--gray-color);
					padding-top: 10px;
					margin-top: 20px;
				}
			}
		}
	}
}
</style>
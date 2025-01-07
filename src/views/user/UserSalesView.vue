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
			<div class="no-sales" v-else-if="sales.length === 0 && !loading">
				<h5>Nenhuma venda encontrada</h5>
			</div>
			<Loader v-if="loading"/>
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
const loading = ref(false);

const fetchSales = async () => {
	loading.value = true;
  	try {
  	  	// Step 1: Fetch all products where the vendor_id matches the current user
  	  	const { data: products, error: productsError } = await supabase
  	  	  	.from('products')
  	  	  	.select('id')
  	  	  	.eq('vendor_id', userStore.user.id);

  	  	if (productsError) {
  	  	  	console.error('Error fetching products:', productsError);
  	  	  	return;
  	  	}

  	  	if (!products || products.length === 0) {
  	  	  	console.log('No products found for this vendor.');
  	  	  	sales.value = [];
  	  	  	return;
  	  	}

  	  	// Step 2: Fetch orders where the product ID matches one of the fetched products
  	  	const productIds = products.map((product) => product.id);

  	  	const { data: orders, error: ordersError } = await supabase
  	  	  	.from('orders')
  	  	  	.select('*')
  	  	  	.in('product_id', productIds); // Assuming 'product' in 'orders' references the product ID

  	  	if (ordersError) {
  	  	 	console.error('Error fetching orders:', ordersError);
  	  	 	return;
  	  	}

  	  	// Step 3: Fetch all buyers in a single query
  	  	const buyerIds = [...new Set(orders.map((order) => order.buyer_id))];

  	  	const { data: buyers, error: buyersError } = await supabase
  	  	  	.from('users')
  	  	  	.select('id, name')
  	  	  	.in('id', buyerIds);

  	  	if (buyersError) {
  	  	  	console.error('Error fetching buyers:', buyersError);
  	  	  	return;
  	  	}

  	  	// Step 4: Map buyer data to the orders
  	  	const buyerMap = Object.fromEntries(buyers.map((buyer) => [buyer.id, buyer.name]));

  	  	sales.value = orders.map((order) => ({
  	  	  	...order,
  	  	  	buyer: { name: buyerMap[order.buyer_id] || 'Desconhecido' },
  	  	}));

  	  	console.log('Sales:', sales.value);
  	} catch (error) {
  	  	console.error('Error in fetchSales:', error);
  	} finally {
  	  	loading.value = false;
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
	position: relative;
	min-height: 500px;
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
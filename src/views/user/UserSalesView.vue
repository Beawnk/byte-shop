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
import { useListAnimation } from '@/composables/useListAnimation';
import { ref, onMounted } from 'vue';
import UserOrderItem from '@/components/UserOrderItem.vue';
import { useUserStore } from '@/stores/UserState';
import { useAlertStore } from '@/stores/alertStore';
import { supabase } from '@/lib/supabaseClient';

const userStore = useUserStore();
const alertStore = useAlertStore();

const sales = ref([]);
const loading = ref(false);

const fetchSales = async () => {
	loading.value = true;
	try {
		// Products of this vendor, then the orders for them (RLS lets the vendor read those orders).
		const { data: products, error: productsError } = await supabase
			.from('products')
			.select('id')
			.eq('vendor_id', userStore.user.id);
		if (productsError) throw productsError;

		if (!products.length) {
			sales.value = [];
			return;
		}

		const { data: orders, error: ordersError } = await supabase
			.from('orders')
			.select('*')
			.in('product_id', products.map((product) => product.id))
			.order('created_at', { ascending: false });
		if (ordersError) throw ordersError;

		// All buyers' public names in one query.
		const buyerIds = [...new Set(orders.map((order) => order.buyer_id))];
		const { data: buyers, error: buyersError } = buyerIds.length
			? await supabase.from('public_profiles').select('id, name').in('id', buyerIds)
			: { data: [], error: null };
		if (buyersError) throw buyersError;

		const buyerMap = Object.fromEntries(buyers.map((buyer) => [buyer.id, buyer.name]));
		sales.value = orders.map((order) => ({
			...order,
			buyer: { name: buyerMap[order.buyer_id] || 'Desconhecido' },
		}));
	} catch (error) {
		alertStore.addGlobalError('Erro ao carregar suas vendas.', error);
	} finally {
		loading.value = false;
	}
};

onMounted(() => {
	fetchSales();
});

const { onBeforeEnter, onEnter, onLeave } = useListAnimation();
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
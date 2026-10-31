<template>
	<div class="user-sales">
		<h2>Suas vendas</h2>
		<section class="dashboard" v-if="sales.length" aria-label="Resumo das vendas">
			<div class="period">
				<label for="sales-period">Período</label>
				<select id="sales-period" v-model="period">
					<option v-for="option in periods" :key="option.value" :value="option.value">{{ option.label }}</option>
				</select>
			</div>
			<dl class="stats">
				<div class="stat"><dt>Total vendido</dt><dd>{{ formatCurrency(summary.revenue) }}</dd></div>
				<div class="stat"><dt>Vendas</dt><dd>{{ summary.count }}</dd></div>
				<div class="stat"><dt>Ticket médio</dt><dd>{{ formatCurrency(summary.average) }}</dd></div>
				<div class="stat" v-if="vendor?.reviews"><dt>Nota média</dt><dd>{{ vendor.rating }}</dd></div>
			</dl>
			<SalesChart :monthly="summary.monthly" />
		</section>
		<div class="sales">
			<TransitionGroup class="sales-list" v-if="summary.orders.length" name="list" tag="div" :css="false" @before-enter="onBeforeEnter" @enter="onEnter" @leave="onLeave" appear>
				<div v-for="(sale, index) in summary.orders" :key="sale.id" :data-index="index" class="sale">
					<UserOrderItem :order="sale">
						<p v-if="sale.buyer" class="buyer"><strong>Comprador:</strong> {{ sale.buyer.name }}</p>
					</UserOrderItem>
				</div>
			</TransitionGroup>
			<div class="no-sales" v-else-if="!loading">
				<h5>{{ sales.length ? 'Nenhuma venda nesse período' : 'Nenhuma venda encontrada' }}</h5>
			</div>
			<Loader v-if="loading"/>
		</div>
	</div>
</template>

<script setup>
import { useListAnimation } from '@/composables/useListAnimation';
import { computed, ref, onMounted } from 'vue';
import UserOrderItem from '@/components/UserOrderItem.vue';
import SalesChart from '@/components/SalesChart.vue';
import { formatCurrency } from '@/composables/formatCurrency';
import { fetchVendor } from '@/composables/fetchVendor';
import { periodOptions, summarizeSales } from '@/utils/salesSummary';
import { useUserStore } from '@/stores/UserState';
import { useAlertStore } from '@/stores/alertStore';
import { supabase } from '@/lib/supabaseClient';

const userStore = useUserStore();
const alertStore = useAlertStore();

const sales = ref([]);
const vendor = ref(null);
const loading = ref(false);

const period = ref('12m');

// All sales are already loaded, so changing the period needs no new query.
const periods = computed(() => periodOptions(sales.value));
const summary = computed(() => summarizeSales(sales.value, { period: period.value }));

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
	// The rating is a nice-to-have on the dashboard: without it the other figures still show.
	fetchVendor(userStore.user.id).then((data) => { vendor.value = data; }).catch(() => {});
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
	.dashboard {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-top: 20px;
	}
	.period {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 10px;
		color: var(--text-color);
		select {
			padding: 10px 12px;
			border: 1px solid transparent;
			border-radius: var(--border-radius);
			background-color: var(--white-color);
			box-shadow: var(--shadow);
			color: var(--text-color);
			font-family: var(--ff-primary);
			&:focus {
				border-color: var(--primary-color);
				outline: none;
			}
		}
	}
	.stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 10px;
		margin: 0;
	}
	.stat {
		padding: 15px 20px;
		background-color: var(--white-color);
		border-radius: var(--border-radius);
		box-shadow: var(--shadow);
		color: var(--text-color);
		dt {
			font-size: var(--text-small);
		}
		dd {
			margin: 5px 0 0;
			font-family: var(--ff-primary-semiBold);
			font-size: var(--subtitle-medium);
		}
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
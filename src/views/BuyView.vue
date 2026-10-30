<template>
	<section id="buy" class="container">
		<transition name="down" mode="out-in" appear>
			<div class="buy-page">
				<div class="user-info">
					<div class="user-address" v-if="!editAddress">
						<h3>Endereço de entrega</h3>
						<div class="address">
							<p>{{ userStore.user.name }}</p>
							<p>{{ userStore.user.address_cep }}</p>
							<p>{{ userStore.user.address_street }}, {{ userStore.user.address_number }}</p>
							<p>{{ userStore.user.address_district }}</p>
							<p>{{ userStore.user.address_city }} - {{ userStore.user.address_state }}</p>
							<p>{{ userStore.user.address_country }}</p>
						</div>
						<button class="btn primary edit" @click="onEditAddress">Editar</button>
					</div>
					<div class="edit-address" v-if="editAddress">
						<UserData v-slot="{ saving }" :mode="'address'" @saved="editAddress = false">
							<button class="btn primary" type="submit" :disabled="saving">Salvar</button>
						</UserData>
					</div>
				</div>
				<div class="product-info">
					<Loader v-if="loading || buying" />
					<div class="product" v-if="product">
						<div class="img">
							<img :src="product.image_url?.[0]" :alt="product.name" />
						</div>
						<div class="info">
							<h4>{{ product.name }}</h4>
							<p>{{ product.description }}</p>
							<p class="price">{{ formatCurrency(product.price) }}</p>
						</div>
					</div>
					<p class="unavailable" v-if="unavailableReason">{{ unavailableReason }}</p>
					<div class="action">
						<button class="btn primary buy-now" @click.prevent="completeBuy" :disabled="!product || !!unavailableReason || buying">Finalizar</button>
					</div>
				</div>
			</div>
		</transition>
	</section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import UserData from '@/components/UserData.vue';
import { useUserStore } from '@/stores/UserState';
import { useAlertStore } from '@/stores/alertStore';
import { formatCurrency } from '@/composables/formatCurrency';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'vue-router';

const props = defineProps(['id']);

const userStore = useUserStore();
const alertStore = useAlertStore();
const router = useRouter();

const editAddress = ref(false);
const product = ref(null);
const buying = ref(false);
const loading = ref(false);

// The database checks all of this again (supabase/02-purchase-rpc.sql); here it's just so the
// button doesn't offer a purchase that will fail.
const unavailableReason = computed(() => {
	if (!product.value) return '';
	if (product.value.sold) return 'Este produto já foi vendido.';
	if (product.value.vendor_id === userStore.user.id) return 'Você não pode comprar o seu próprio produto.';
	return '';
});

const onEditAddress = () => {
	editAddress.value = !editAddress.value;
};

const fetchProduct = async () => {
	loading.value = true;
	const { data, error } = await supabase
		.from('products')
		.select('*')
		.eq('id', props.id)
		.maybeSingle();
	loading.value = false;

	if (error) {
		alertStore.addGlobalError('Erro ao carregar o produto.', error);
	} else if (!data) {
		alertStore.addGlobalError('Produto não encontrado.');
	} else {
		product.value = data;
	}
};

// One transaction in the database: price, buyer and address come from there, not from the browser.
const completeBuy = async () => {
	if (buying.value) return;
	buying.value = true;
	alertStore.clearNotifications();

	const { error } = await supabase.rpc('purchase_products', { p_product_ids: [product.value.id] });

	buying.value = false;
	if (error) {
		// The function raises messages written for the buyer (unavailable product, missing address).
		alertStore.addGlobalError(error.code === 'P0001' || error.code === '22023' ? error.message : 'Erro ao finalizar a compra.');
		await fetchProduct();
		return;
	}

	alertStore.addGlobalSuccess('Compra finalizada com sucesso.');
	router.push({ name: 'orders' });
};

// The router guard already sends logged-out users to the login page.
onMounted(fetchProduct);

</script>

<style lang="scss" scoped>
@use '@/assets/style/main.scss' as m;

#buy {
	.buy-page {
		display: flex;
		justify-content: space-between;
		gap: 20px;

		@include m.media(xl) {
			flex-direction: column;
		}
	}
	.user-info {
		width: 70%;
		background-color: var(--white-color);
		padding: 20px;
		border-radius: var(--border-radius);

		@include m.media(xl) {
			width: 100%;
		}

		:deep(.user-form) {
			h4 {
				margin-top: 0;
			}
			.action {
				margin-top: 0;
			}
		}
	}
	.product-info {
		width: 30%;
		height: 100%;

		@include m.media(xl) {
			width: 100%;
		}

		.product {
			display: flex;
			gap: 20px;
			background-color: var(--white-color);
			padding: 20px;
			border-radius: var(--border-radius);

			@include m.media(xxs) {
				flex-direction: column;
			}

			.img {
				width: 40%;
				max-height: 300px;

				@include m.media(xxs) {
					width: 100%;
				}

				img {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
			}
			.info {
				width: 60%;

				@include m.media(xxs) {
					width: 100%;
				}
				h4 {
					color: var(--text-color);
					margin-bottom: 20px;
				}
				p {
					color: var(--text-color);
					margin-bottom: 20px;
				}
				.price {
					font-family: var(--ff-primary-Medium);
				}
			}
		}
		.unavailable {
			margin-top: 20px;
			text-align: center;
			color: var(--text-color);
		}
		.action {
			margin-top: 20px;
			display: flex;
			justify-content: center;
			.btn {
				width: 100%;
			}
		}
	}
	.user-address {
		h3 {
			color: var(--text-color);
		}
		.address {
			margin-top: 20px;
			p {
				margin-bottom: 10px;
				color: var(--text-color);
			}
		}
		.edit {
			margin-top: 10px;
		}
	}
}
</style>
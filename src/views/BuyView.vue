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
						<UserData v-slot="{ update }" :mode="'edit'">
							<button class="btn primary" @click.prevent="onAddressSave(update)">Salvar</button>
						</UserData>
					</div>
				</div>
				<div class="product-info">
					<div class="product" v-if="product">
						<div class="img">
							<img :src="product.image_url[0]" :alt="product.name" />
						</div>
						<div class="info">
							<h4>{{ product.name }}</h4>
							<p>{{ product.description }}</p>
							<p class="price">{{ formatCurrency(product.price) }}</p>
						</div>
					</div>
					<div class="action">
						<button class="btn primary buy-now" @click.prevent="completeBuy">Finalizar</button>
					</div>
				</div>
			</div>
		</transition>
	</section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import UserData from '@/components/UserData.vue';
import { useUserStore } from '@/stores/UserState';
import { formatCurrency } from '@/composables/formatCurrency';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'vue-router';

const props = defineProps(['id']);

const userStore = useUserStore();
const router = useRouter();

const editAddress = ref(false);
const product = ref(null);

const onEditAddress = () => {
	editAddress.value = !editAddress.value;
};

const onAddressSave = (callback) => {
	callback();
	editAddress.value = !editAddress.value;
};

const fetchProduct = async () => {
	const { data, error } = await supabase
		.from('products')
		.select('*')
		.eq('id', props.id)
		.single();

	if (error) {
		console.error(error);
	} else {
		product.value = data;
	}
};

const completeBuy = async () => {
	const { data, error } = await supabase.from('orders').insert([
		{
			buyer_id: userStore.user.id,
			product: {
				id: product.value.id,
				name: product.value.name,
				pictures: product.value.image_url,
				price: product.value.price,
				vendor_id: product.value.vendor_id, 
				description: product.value.description
			},
			total: product.value.price,
			address: {
				cep: userStore.user.address_cep,
				street: userStore.user.address_street,
				number: userStore.user.address_number,
				district: userStore.user.address_district,
				city: userStore.user.address_city,
				state: userStore.user.address_state,
				country: userStore.user.address_country
			}
		},
	]);
	if (error) {
		console.error(error);
	} else {
		const { data: productData, error: productError } = await supabase
			.from('products')
			.update({ sold: true })
			.eq('id', product.value.id);
		if (productError) {
			console.error(productError);
		} else {
			router.push({ name: 'orders' });
		}
	}
};

onMounted(() => {
	if (userStore.logged === false) {
		router.push({ name: 'user', query: { redirect: `comprar/${props.id}` } });
		userStore.page = 'login';
	} else {
		fetchProduct();
	}
});

</script>

<style lang="scss">
#buy {
	.buy-page {
		display: flex;
		justify-content: space-between;
		gap: 20px;
	}
	.user-info {
		width: 70%;
		background-color: var(--white-color);
		padding: 20px;
		border-radius: var(--border-radius);
		.user-form {
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
		.product {
			display: flex;
			gap: 20px;
			background-color: var(--white-color);
			padding: 20px;
			border-radius: var(--border-radius);
			.img {
				width: 40%;
				max-height: 300px;
				img {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
			}
			.info {
				width: 60%;
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
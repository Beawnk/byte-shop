<template>
  	<div class="user-favorites">
  		<h2>Seus favoritos</h2>
  		<div class="favorites" v-if="favoriteProducts.length">
  		  <div v-for="(product, index) in favoriteProducts" :key="product.id" class="favorite" @mouseover="productHoverIndex = index" @mouseleave="productHoverIndex = null">
  		    <UserProductItem :product="product">
				<button class="btn remove" v-show="productHoverIndex === index" @click.prevent="removeProduct(product.id)"></button>
			</UserProductItem>
  		  </div>
  		</div>
		<div class="no-favorites" v-else-if="favoriteProducts.length === 0 && !loading">
  		  <h5>Você não tem nenhum produto nos favoritos</h5>
		</div>
		<Loader v-if="loading" />
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/UserState';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { useAlertStore } from '@/stores/alertStore';
import UserProductItem from '@/components/UserProductItem.vue';
import { supabase } from '@/lib/supabaseClient';

const userStore = useUserStore();
const favoritesStore = useFavoritesStore();
const alertStore = useAlertStore();

const favoriteProducts = ref([]);
const productHoverIndex = ref(null);
const loading = ref(false);

const fetchFavoriteProducts = async () => {
  await favoritesStore.fetchFavorites(userStore.user.id);
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .in('id', favoritesStore.favorites);

  if (error) {
    alertStore.addGlobalError('Erro ao buscar favoritos', error.message);
  } else {
    favoriteProducts.value = data;
  }
};

const removeProduct = async (productId) => {
  await favoritesStore.removeFavorite(productId);
  fetchFavoriteProducts();
};

onMounted(async () => {
	loading.value = true;
  	await fetchFavoriteProducts();
	loading.value = false;
});
</script>

<style lang="scss">
@use '@/assets/style/main.scss' as m;

.user-favorites {
	position: relative;
	min-height: 400px;
 	h2 {
		color: var(--text-color);
 	}
 	.favorites {
		margin-top: 20px;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
		gap: 1rem;
		.favorite {
			.product-link {
				flex-direction: column;
				align-items: center;
				min-height: 250px;
				position: relative;
				.product-image {
					width: 100%;
					height: 150px;
					img {
						width: 100%;
						height: 100%;
						object-fit: cover;
					}
				}
				.product-info {
					padding: 10px;
					width: 100%;
					align-items: center;
					h5 {
						font-size: var(--text-medium);
						text-align: center;
					}
					.description {
						display: none;
					}
					.price {
						margin-top: 0;
					}
				}
				.remove {
					position: absolute;
					top: 0;
					right: 0;
					width: 30px;
					height: 30px;
					background-color: var(--white-color);
					border-radius: 0 var(--border-radius) 0 var(--border-radius);
					box-shadow: var(--shadow);
					background-image: url('@/assets/img/icons/remove.png');
					background-size: 20px;
					background-repeat: no-repeat;
					background-position: center;

					@include m.media(600px) {
						opacity: 1 !important;
    					visibility: visible !important;
    					pointer-events: auto !important;
    					display: inline-flex !important;
					}
				}
			}
		}
 	}
  	.no-favorites {
		text-align: center;
		height: 400px;
		display: flex;
		justify-content: center;
		align-items: center;
		h5 {
			color: var(--text-color);
		}
	}
}
</style>
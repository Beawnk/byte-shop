<template>
	<div class="modal modal-reviews" v-if="vendorId">
	  <div class="modal-content" ref="modal">
		<button class="close" type="button" aria-label="Fechar" @click="closeModal"></button>
		<div class="reviews" v-if="reviews.length">
		  <div class="review" v-for="review in reviews" :key="review.id">
			<div class="user">
			  <div class="user-info">
				<div class="name-date">
				  <span class="date">{{ review.date }}</span>
				</div>
				<StarRating :rating="Number(review.stars)" />
			  </div>
			</div>
			<div class="text">
			  <p class="product"><strong>Produto avaliado: </strong>{{ review.product_name }}</p>
			  <h6 class="title">"{{ review.title }}"</h6>
			  <p class="review-text">{{ review.review }}</p>
			</div>
		  </div>
		</div>
		<div class="no-reviews" v-else-if="!reviews.length && !loading">
		  <h4>Nenhuma avaliação encontrada</h4>
		</div>
		<Loader v-if="loading" />
	  </div>
	</div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import StarRating from '@/components/StarRating.vue'
import { useAlertStore } from '@/stores/alertStore';
import { formatDate } from '@/utils/formatDate';

// Reviews this user wrote. Shown inline in the "Avaliações enviadas" tab.
const props = defineProps(['vendorId'])

const emit = defineEmits(['emitCloseModal'])

const reviews = ref([])
const modal = ref(null)
const loading = ref(false)
const alertStore = useAlertStore()

const fetchReviews = async () => {
	const { data, error } = await supabase
	  .from('reviews')
	  .select('*')
	  .eq('user_id', props.vendorId)

	if (error) throw error

	reviews.value = await Promise.all(data.map(async (review) => ({
		...review,
		date: formatDate(review.created_at),
		product_name: await fetchProductName(review.product_id),
	})))
}

const fetchProductName = async (productId) => {
	const { data, error } = await supabase
	  .from('products')
	  .select('name')
	  .eq('id', productId)
	  .single()
  
	if (error) {
	  console.error(error)
	} else {
	  return data.name
	}
}
  
const closeModal = () => {
	emit('emitCloseModal')
}
  
onMounted(async () => {
	loading.value = true
	try {
		await fetchReviews()
	} catch (error) {
		alertStore.addGlobalError('Erro ao carregar suas avaliações.', error)
	} finally {
		loading.value = false
	}
})
</script>
  
<style lang="scss" scoped>
.modal {
	.modal-content{
	  display: flex;
	  flex-direction: column;
	  gap: 20px;
	  .reviews {
		display: flex;
		flex-direction: column;
		gap: 20px;
		overflow-y: auto;
		.review {
		  background-color: var(--white-color);
		  padding: 20px;
		  border-radius: var(--border-radius);
		  .user {
			display: flex;
			gap: 20px;
			margin-bottom: 20px;
			.avatar {
			  width: 50px;
			  height: 50px;
			  border-radius: 50%;
			  overflow: hidden;
			  img {
				object-fit: cover;
				width: 100%;
				height: 100%;
			  }
			}
			.user-info {
			  display: flex;
			  flex-direction: row-reverse;
			  justify-content: space-between;
			  align-items: center;
			  gap: 5px;
			  width: 100%;
			  .name-date {
				display: flex;
				align-items: center;
				justify-content: space-between;
				gap: 5px;
				h5 {
				  color: var(--text-color);
				}
				.date {
				  color: var(--text-color);
				}
			  }
			}
		  }
		  .text {
			p {
			  color: var(--text-color);
			}
			.product {
			  margin-bottom: 10px;
			}
			h6 {
			  color: var(--text-color);
			  margin-bottom: 10px;
			}
		  }
		}
	}
	.no-reviews {
		background-color: var(--white-color);
		padding: 20px;
		border-radius: var(--border-radius);
		box-shadow: var(--shadow);
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 20vh;
		h4 {
		  color: var(--text-color);
		}
	  }
	}
}
</style>
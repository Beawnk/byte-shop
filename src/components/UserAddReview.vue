<template>
	<div class="modal add-review">
		<div class="modal-content" ref="modal">
			<button class="close" @click="$emit('closeModal')"></button>
			<h4>Adicionar avaliação ao vendedor</h4>
			<form class="review-form">
				<div class="star-rating">
        		  	<span 
        		  	  v-for="n in 5" 
        		  	  :key="n" 
        		  	  class="star" 
        		  	  :class="{ filled: n <= (hoverRating || rating) }"
        		  	  @click="setRating(n)"
        		  	  @mouseover="hoverRating = n"
        		  	  @mouseleave="hoverRating = 0"
        		  	>
        		  	</span>
					<p class="rating">{{ rating }}</p>
        		</div>
				<FieldNotifications :field="'stars'"/>
				<div class="input">
					<label for="title">Título</label>
					<input type="text" id="title" name="title" v-model="title"/>
					<FieldNotifications :field="'title'"/>
				</div>
				<div class="input">
					<label for="review">Avaliação</label>
					<textarea id="review" name="review" rows="5" cols="50" v-model="review"></textarea>
					<FieldNotifications :field="'review'"/>
				</div>
				<div class="actions">
					<button class="btn primary" @click.prevent="sendReview">Enviar</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/UserState';
import { supabase } from '@/lib/supabaseClient';
import { useClickOutside } from '@/composables/clickOutside';
import { useAlertStore } from '@/stores/alertStore';

const props = defineProps(['order']);

const emit = defineEmits(['closeModal', 'reviewedOrder']);

const userStore = useUserStore();
const alertStore = useAlertStore();

const modal = ref(null);

const rating = ref(0);
const hoverRating = ref(0);
const title = ref('');
const review = ref('');

const setRating = (value) => {
  	rating.value = value;
};

const sendReview = async () => {
	alertStore.clearNotifications();

	if (!rating.value) alertStore.setFieldError('stars', 'Selecione uma avaliação');
	if (!title.value) alertStore.setFieldError('title', 'Digite um título');
	if (!review.value) alertStore.setFieldError('review', 'Digite uma avaliação');

	if (!rating.value || !title.value || !review.value) return;

	const { data, error } = await supabase
	.from('reviews')
	.insert([
		{
			vendor_id: props.order.product.vendor_id,
			user_id: userStore.user.id,
			product_id: props.order.product_id,
			stars: rating.value,
			title: title.value,
			review: review.value
		}
	]);

	if (error) {
		alertStore.addGlobalError('Erro ao enviar avaliação', error.message);
	} else {
		alertStore.addGlobalSuccess('Avaliação enviada com sucesso');

		emit('closeModal');
		emit('reviewedOrder');
	}
}

onMounted(() => {
	useClickOutside(modal, () => emit('closeModal'));
});
</script>

<style lang="scss" scoped>
.modal.add-review {
  	.modal-content {
		height: fit-content;
		min-height: 10vh;
		h4 {
		  	margin-bottom: 40px;
			color: var(--text-color);
		}
		.star-rating {
		  	display: flex;
		  	margin-bottom: 20px;
		  	align-items: center;
		  	.star {
				width: 30px;
				height: 30px;
				margin-right: 5px;
				background-image: url('../assets/img/icons/star-empty.png');
				background-size: contain;
				background-repeat: no-repeat;
				background-position: center;
				cursor: pointer;
				transition: var(--transition);
				&.filled {
				  	background-image: url('../assets/img/icons/star-full.png');
				}
				&:last-child {
				  	margin-right: 0;
				}
		  	}
		  	.rating {
				margin-left: 10px;
				font-size: var(--text-big);
				color: var(--text-color);
		  	}
		}
		.actions {
			display: flex;
			justify-content: flex-end;
		}
  	}
}
</style>
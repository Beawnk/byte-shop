<template>
	<div class="add-product">
		<div class="add-product-form">
			<form>
				<div class="input">
					<label for="name">Nome do produto</label>
					<input type="text" id="name" v-model="name" />
				</div>
				<div class="input">
					<label for="description">Descrição</label>
					<textarea id="description" rows="4" cols="50" v-model="description"></textarea>
				</div>
				<div class="input price">
					<label for="price">Preço</label>
					<input type="text" id="price" v-model="price"/>
				</div>
				<div class="input image">
					<label for="image">Imagem</label>
					<input type="file" id="image" @change="onFileChange" multiple />
				</div>
				<div class="images" v-if="images.length > 0">
					<div class="image" v-for="(image, index) in images" :key="index">
						<img :src="image" alt="Imagem do produto" />
					</div>
				</div>
			</form>
		</div>
		<button class="btn secondary cancel" @click="$emit('hideAddProduct')">Cancelar</button>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { useHandleImages } from '@/composables/handleImages';

const emit = defineEmits(['hideAddProduct']);

const name = ref('');
const description = ref('');
const price = ref('');
const images = ref([]);

const onFileChange = (e) => {
  images.value = useHandleImages(images.value, e);
  console.log(images.value);
};
</script>

<style lang="scss" scoped>
.add-product {
	margin-top: 20px;
	.add-product-form {
		.images {
			display: flex;
			background-color: var(--white-color);
			border-radius: var(--border-radius);
			overflow: hidden;
			padding: 10px;
			gap: 10px;
			margin-bottom: 20px;
			.image {
				border-radius: var(--border-radius);
				overflow: hidden;
				width: 100px;
				height: 100px;
				img {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
			}
		}
	}
}
</style>
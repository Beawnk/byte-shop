<template>
	<div class="modal product-modal">
		<div class="modal-content" ref="modal"> 
			<div class="handle-product">
				<div class="handle-product-form">
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
							<div class="images">
								<div class="image" v-for="(image, index) in images" :key="index" @mouseover="imgHoverIndex = index" @mouseleave="imgHoverIndex = null">
									<img :src="image" alt="Imagem do produto" />
									<button class="remove" v-show="imgHoverIndex === index" @click.prevent="removeImage(index)"></button>
								</div>
								<div class="input-image">
									<input type="file" id="image" @change="onFileChange" multiple />
								</div>
							</div>
						</div>
					</form>
				</div>
				<div class="actions">
					<button class="btn secondary cancel" @click="$emit('hideProductModal')">Cancelar</button>
					<button class="btn primary save" @click.prevent="saveProduct">Salvar</button>
				</div>
			</div>
		</div>
	</div>

</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useHandleImages } from '@/composables/handleImages';
import { useUserStore } from '@/stores/UserState';
import { supabase } from '@/lib/supabaseClient'
import { useClickOutside } from '@/composables/clickOutside';

const props = defineProps(['productId', 'mode']);
const emit = defineEmits(['hideProductModal', 'productSaved']);
const userStore = useUserStore();

const name = ref('');
const description = ref('');
const price = ref('');
const images = ref([]);

const modal = ref(null)

const imgHoverIndex = ref(null);

const onFileChange = (e) => {
  	images.value = useHandleImages(images.value, e);
};

const removeImage = (index) => {
  	images.value.splice(index, 1);
};

const saveProduct = async () => {
	if (props.mode === 'add') {
  		const { data, error } = await supabase
		.from('products')
		.insert([
		  	{
				id: name.value.toLowerCase().replace(/ /g, '-'),
				name: name.value,
				description: description.value,
				price: price.value,
				image_url: images.value,
				vendor_id: userStore.user.id,
				sold: false
		  	}
		]);
		
  		if (error) {
			console.error(error);
  		} else {
			emit('hideProductModal');
			emit('productSaved');
  		}
	} else if (props.mode === 'edit') {
    	const { data, error } = await supabase
    	  .from('products')
    	  .update({
    	    name: name.value,
    	    description: description.value,
    	    price: price.value,
    	    image_url: images.value,
    	  })
    	  .eq('id', props.productId);
    	if (error) {
    	  console.error(error);
    	} else {
			emit('hideProductModal');
  			emit('productSaved');	
		}
  	}
};

watch(() => props.productId, async () => {
	if (props.mode === 'edit' && props.productId) {
		const product = await userStore.getProduct(props.productId);
		name.value = product.name;
		description.value = product.description;
		price.value = product.price;
		images.value = product.image_url;
  	} else if (props.mode === 'add') {
		name.value = '';
		description.value = '';
		price.value = '';
		images.value = [];
  	}
},{ immediate: true });

onMounted(() => {
	useClickOutside(modal, () => emit('hideProductModal'));
});
</script>

<style lang="scss" scoped>
.handle-product {
	.handle-product-form {
		.images {
			display: flex;
			background-color: var(--white-color);
			border-radius: var(--border-radius);
			overflow: hidden;
			padding: 10px;
			gap: 10px;
			margin-bottom: 20px;
			.image {
				position: relative;
				border-radius: var(--border-radius);
				width: 100px;
				height: 100px;
				img {
					width: 100%;
					height: 100%;
					object-fit: cover;
					border-radius: var(--border-radius);
				}
				.remove {
					position: absolute;
					top: -8px;
					right: -8px;
					width: 25px;
					height: 25px;
					background-color: var(--error-color);
					border-radius: var(--border-radius);
					background-image: url('../assets/img/icons/remove-white.png');
					background-size: 15px;
					background-repeat: no-repeat;
					background-position: center;
				}
			}
			.input-image {
				position: relative;
				width: 100px;
				height: 100px;
				overflow: hidden;
				border-radius: var(--border-radius);
				background-color: var(--gray-color);	
				&::before {
					content: '+';
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					font-size: 30px;
					color: var(--text-color);
					opacity: 0.5;
				}
				input {
					opacity: 0;
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					cursor: pointer;
				}
			}
		}
	}
	.actions {
		display: flex;
		gap: 10px;
	}
}
</style>
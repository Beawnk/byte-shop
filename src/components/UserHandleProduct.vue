<template>
	<div class="modal product-modal">
		<div class="modal-content" ref="modal">
			<div class="handle-product">
				<div class="handle-product-form">
					<form @submit.prevent="saveProduct">
						<div class="input">
							<label for="name">Nome do produto</label>
							<input
								type="text"
								id="name"
								v-model="name"
								@blur="validateName"
							/>
							<FieldNotifications :field="'name'" />
						</div>
						<div class="input">
							<label for="description">Descrição</label>
							<textarea
								id="description"
								rows="4"
								cols="50"
								v-model="description"
								@blur="validateDescription"
							></textarea>
							<FieldNotifications :field="'description'" />
						</div>
						<div class="input price">
							<label for="price">Preço</label>
							<input
								type="text"
								id="price"
								v-model="price"
								@blur="validatePrice"
							/>
							<FieldNotifications :field="'price'" />
						</div>
						<div class="input image">
							<label for="image">Imagem</label>
							<div class="images">
								<div
									class="image"
									v-for="(image, index) in images"
									:key="index"
									@mouseover="imgHoverIndex = index"
									@mouseleave="imgHoverIndex = null"
								>
									<img :src="image" alt="Imagem do produto" />
									<button
										class="remove"
										type="button"
										v-show="imgHoverIndex === index"
										@click.prevent="removeImage(index)"
									></button>
								</div>
								<div class="input-image">
									<input
										type="file"
										id="image"
										@change="onFileChange"
										multiple
									/>
								</div>
							</div>
							<FieldNotifications :field="'images'" />
						</div>
						<div class="actions">
							<button class="btn secondary cancel" type="button" @click="$emit('hideProductModal')">
								Cancelar
							</button>
							<button class="btn primary save" type="submit" :disabled="saving">
								Salvar
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { useHandleImages } from '@/composables/handleImages';
import { useUserStore } from '@/stores/UserState';
import { supabase } from '@/lib/supabaseClient';
import { useClickOutside } from '@/composables/clickOutside';
import { useAlertStore } from '@/stores/alertStore';
import * as yup from 'yup';
import { useForm, useField } from 'vee-validate';

const props = defineProps(['productId', 'mode']);
const emit = defineEmits(['hideProductModal', 'productSaved']);

const userStore = useUserStore();
const alertStore = useAlertStore();

const modal = ref(null);
const imgHoverIndex = ref(null);
const saving = ref(false);

const productSchema = yup.object({
  name: yup.string().required('Insira o nome do produto'),
  description: yup.string().required('Insira a descrição do produto'),
  price: yup
    .number()
    .typeError('Insira um número válido para o preço')
    .positive('O preço deve ser positivo')
    .required('Insira o preço do produto'),
  images: yup
    .array()
    .min(1, 'Adicione pelo menos uma imagem')
    .max(5, 'Você só pode adicionar até 5 imagens'),
});

const { handleSubmit, resetForm } = useForm({
  validationSchema: productSchema,
  validateOnMount: false,
  initialValues: {
    name: '',
    description: '',
    price: '',
    images: [],
  },
});

const { value: name, validate: validateName } = useField('name', undefined, {
	validateOnValueUpdate: false
});
const { value: description, validate: validateDescription } = useField('description', undefined, {
	validateOnValueUpdate: false
});
const { value: price, validate: validatePrice } = useField('price', undefined, {
	validateOnValueUpdate: false
});
const { value: images } = useField('images', undefined, {
	validateOnValueUpdate: false
});

const onFileChange = async (e) => {
	images.value = await useHandleImages(images.value, e);
};

const removeImage = (index) => {
	images.value.splice(index, 1);
};

// The id is also the product URL (/produtos/:id). It's created once and never changes on edit,
// otherwise favorites, orders and reviews pointing at it would break. The random suffix keeps
// two products with the same name from colliding.
const createProductId = (productName) => {
	const slug = productName
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 60);
	return `${slug || 'produto'}-${crypto.randomUUID().slice(0, 8)}`;
};

const saveProduct = handleSubmit(async (values) => {
	if (saving.value) return;
	saving.value = true;
	alertStore.clearNotifications();

	// Only the columns the seller may edit; id, vendor_id and sold are protected in the database.
	const fields = {
		name: values.name,
		description: values.description,
		price: Number(values.price),
		image_url: values.images,
	};

	// supabase-js returns { error } instead of throwing, so it has to be checked.
	const { error } = props.mode === 'add'
		? await supabase
			.from('products')
			.insert([{ ...fields, id: createProductId(values.name), vendor_id: userStore.user.id }])
		: await supabase
			.from('products')
			.update(fields)
			.eq('id', props.productId);

	saving.value = false;
	if (error) {
		alertStore.addGlobalError('Erro ao salvar produto.');
		return;
	}

	alertStore.addGlobalSuccess(props.mode === 'add' ? 'Produto adicionado com sucesso.' : 'Produto atualizado com sucesso.');
	emit('hideProductModal');
	emit('productSaved');
});

// The parent mounts this component fresh on every open (v-if + key), so the form is
// filled once here. The image list is copied: editing it must not change the store's
// product until the save succeeds.
const editedProduct = props.mode === 'edit' ? userStore.getProduct(props.productId) : null;
if (editedProduct) {
	resetForm({
		values: {
			name: editedProduct.name,
			description: editedProduct.description,
			price: editedProduct.price,
			images: [...(editedProduct.image_url ?? [])],
		},
	});
}

useClickOutside(modal, () => emit('hideProductModal'));
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
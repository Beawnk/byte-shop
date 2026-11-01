<template>
	<div class="products paged-list" ref="listTop">
		<div class="sort" v-if="products.length > 1">
			<label for="products-sort">Ordenar por</label>
			<select id="products-sort" v-model="sort">
				<option v-for="option in PRODUCT_SORTS" :key="option.value" :value="option.value">{{ option.label }}</option>
			</select>
		</div>
		<TransitionGroup class="products-list" v-if="products.length" name="list" tag="div" :css="false" @before-enter="onBeforeEnter" @enter="onEnter" @leave="onLeave" appear>
			<div v-for="(product, index) in visibleItems" :key="product.id" :data-index="index" class="product" @mouseover="productHoverIndex = index" @mouseleave="productHoverIndex = null" :class="{'show-actions': productHoverIndex === index, sold: product.sold}">
				<UserProductItem :product="product" />
        <div class="actions">
          <button class="delete" type="button" :aria-label="`Excluir ${product.name}`" @click="deleteProduct(product)"></button>
          <button class="edit" type="button" :aria-label="`Editar ${product.name}`" @click="$emit('handleProductModeEdit', product.id, product.sold)"></button>
        </div>
			</div>
		</TransitionGroup>
		<div class="no-products" v-else-if="products.length === 0 && !loading">
			<p>Você não tem nenhum produto à venda</p>
		</div>
		<ListPagination :page="page" :total-pages="totalPages" label="Páginas dos seus produtos" @change="goToPage" />
    <Loader v-if="loading"/>
	</div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue';
import { useUserStore } from '@/stores/UserState';
import UserProductItem from '@/components/UserProductItem.vue';
import ListPagination from '@/components/ListPagination.vue';
import { useListAnimation } from '@/composables/useListAnimation';
import { usePagination } from '@/composables/usePagination';
import { PRODUCT_SORTS, sortProducts } from '@/utils/sortProducts';

const props = defineProps(["fetchProducts"]);

defineEmits(["handleProductModeEdit"]);

const userStore = useUserStore();
const products = ref([]);
const loading = ref(false);
const sort = ref('recentes');

const productHoverIndex = ref(null);

const sortedProducts = computed(() => sortProducts(products.value, sort.value));
const { page, totalPages, visibleItems, listTop, goToPage } = usePagination(sortedProducts);

const { onBeforeEnter, onEnter, onLeave } = useListAnimation({ enterDuration: 0.3, enterStagger: 0.04, leaveDuration: 0 });

const load = async () => {
  const previousCount = products.value.length;
  loading.value = true;
  try {
    products.value = [...await userStore.loadProducts()];
    if (products.value.length > previousCount) page.value = 1;
  } catch {
  } finally {
    loading.value = false;
  }
};

const deleteProduct = async (product) => {
  try {
    await userStore.deleteProduct(product.id, product.sold);
    products.value = [...userStore.userProducts];
  } catch {
  }
};

watch(() => props.fetchProducts, load);
watch(sort, () => { page.value = 1; });
onMounted(load);
</script>

<style lang="scss" scoped>
@use '@/assets/style/main.scss' as m;

.products {
  position: relative;
  min-height: 300px;
  .sort {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
    color: var(--text-color);
    label {
      white-space: nowrap;
    }
    select {
      min-width: 0;
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
	.products-list {
    margin-top: 20px;
		.product {
			margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      position: relative;

      @include m.media(sm) {
        position: relative;
      }

      &:last-child {
        margin-bottom: 0;
      }
      &.sold {
        &::after {
          content: 'Vendido';
          position: absolute;
          top: 19px;
          right: 0;
          padding: 10px;
          background-color: var(--primary-color);
          transform: translateY(-50%);
          font-weight: bold;
          color: var(--white-color);
          border-radius: 0 var(--border-radius) 0 var(--border-radius);
          font-size: var(--text-small);
        }
        &.show-actions,
        &:focus-within {
          .actions {
            display: none;
            width: 0;
            opacity: 0;
          }
        }

        @include m.media(sm) {
          .actions {
            display: none !important;
            width: 0 !important;
            opacity: 0 !important;
          }
        }
      }
      &.show-actions,
      &:focus-within {
        .actions {
          width: fit-content;
          opacity: 1;
          @starting-style {
            width: 0;
            opacity: 0;
          }
          button {
            opacity: 1;
            width: 50px;
            @starting-style {
              opacity: 0;
              width: 0;
            }
          }
        }
      }
      .actions {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 10px;
        width: 0;
        opacity: 0;
        transition-property: overlay, display, opacity, width;
        transition-duration: 0.5s;
        transition-behavior: allow-discrete;

        @include m.media(sm) {
          opacity: 1 !important;
          visibility: visible !important;
          pointer-events: auto !important;
          display: flex !important;
          width: 100% !important;
          flex-direction: row-reverse;
          justify-content: space-around;
          position: absolute;
          bottom: 0px;
          left: 0;
          border-top: 1px solid var(--shadow-color);
          padding: 5px;
        }

        button {
          height: 50px;
          background-size: 20px;
          background-repeat: no-repeat;
          background-position: center;
          width: 0;
          opacity: 0;
          transition-property: overlay, opacity, width, transform;
          transition-duration: 0.5s;
          transition-behavior: allow-discrete;

          @include m.media(sm) {
            opacity: 1 !important;
            visibility: visible !important;
            pointer-events: auto !important;
            width: 40px !important;
            height: 40px;
            background-size: 17px;
          }

          &.delete {
            background-image: url('../assets/img/icons/remove.png');
          }
          &.edit {
            background-image: url('../assets/img/icons/edit.png');
          }
          &:hover {
            transform: scale(1.2);
          }
        }
      }
		}
	}
  .no-products {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 400px;
    p {
      font-size: var(--text-big);
      color: var(--text-color);
    }
  }
}
</style>
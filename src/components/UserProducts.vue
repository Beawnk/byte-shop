<template>
	<div class="products">
		<TransitionGroup class="products-list" v-if="products.length" name="list" tag="div" :css="false" @before-enter="onBeforeEnter" @enter="onEnter" @leave="onLeave" appear>
			<div v-for="(product, index) in products" :key="product.id" :data-index="index" class="product" @mouseover="productHoverIndex = index" @mouseleave="productHoverIndex = null" :class="{'show-actions': productHoverIndex === index, sold: product.sold}">
				<UserProductItem :product="product" />
        <div class="actions" v-show="productHoverIndex === index">
          <button class="delete" @click.prevent="userStore.deleteProduct(product.id, product.sold)"></button>
          <button class="edit" @click.prevent="$emit('handleProductModeEdit', product.id, product.sold)"></button>
        </div>
			</div>
		</TransitionGroup>
		<div class="no-products" v-else-if="products.length === 0 && !loading">
			<p>Você não tem nenhum produto à venda</p>
		</div>
    <Loader v-if="loading"/>
	</div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useUserStore } from '@/stores/UserState';
import UserProductItem from '@/components/UserProductItem.vue';
import { gsap } from "gsap";

const props = defineProps(["fetchProducts"]);

const emit = defineEmits(["handleProductModeEdit"]);

const userStore = useUserStore();
const products = ref([]);
const loading = ref(false);

const productHoverIndex = ref(null);

// GSAP Hooks
function onBeforeEnter(el) {
  el.style.opacity = 0;
  el.style.transform = "translateX(-30px)";
}

function onEnter(el, done) {
  gsap.fromTo(
    el,
    { opacity: 0, x: -30 },
    {
      opacity: 1,
      x: 0,
      duration: 0.5,
      delay: parseInt(el.dataset.index) * 0.15, // Stagger based on index
      clearProps: "transform",
      onComplete: done,
    }
  );
}

function onLeave(el, done) {
  gsap.to(el, {
    opacity: 0,
    x: 30,
    duration: 0.5,
    delay: parseInt(el.dataset.index) * 0.15, // Stagger based on index
    onComplete: done,
  });
}

watch(() => props.fetchProducts, async () => {
  products.value = await userStore.loadProducts();
});

onMounted(async () => {
  loading.value = true;
	if(userStore.user.id) {
		products.value = await userStore.loadProducts();
    loading.value = false;
	}
});
</script>

<style lang="scss" scoped>
.products {
  position: relative;
  min-height: 300px;
	.products-list {
    margin-top: 20px;
		.product {
			margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      position: relative;
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
        &.show-actions {
          .actions {
            display: none;
            width: 0;
            opacity: 0;
          }
        }
      }
      &.show-actions {
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
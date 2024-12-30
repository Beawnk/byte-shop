<template>
	<div class="products">
		<TransitionGroup class="products-list" v-if="products" name="list" tag="div" :css="false" @before-enter="onBeforeEnter" @enter="onEnter" @leave="onLeave" appear>
			<div v-for="(product, index) in products" :key="product.id" :data-index="index" class="product">
				<UserProductItem :product="product" />
			</div>
		</TransitionGroup>
		<div v-else>
			<p>Nenhum produto encontrado</p>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/UserState';
import UserProductItem from '@/components/UserProductItem.vue';
import { gsap } from "gsap";

const userStore = useUserStore();
const products = ref([]);

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

onMounted(async () => {
	console.log(userStore.user.id);
	if(userStore.user.id) {
		products.value = await userStore.loadProducts();
	}
});
</script>

<style lang="scss" scoped>
.products {
	.products-list {
		.product {
			margin-top: 20px;
		}
	}
}
</style>
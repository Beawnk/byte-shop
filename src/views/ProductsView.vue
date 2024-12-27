<template>
  <section id="products-list" class="container">
    <ProductsSearch @emit-search-products="onSearchProducts" :searchValue="searchValue" :vendorName="vendorName"/>
    <div class="grid" v-if="products.length">
      <TransitionGroup name="grid" :css="false" @before-enter="onBeforeEnter" @enter="onEnter" @leave="onLeave">
        <div class="product" v-for="(product, index) in products" :key="product.id" :data-index="index">
          <router-link :to="{name: 'product', params: {id: product.id}}" class="product-link">
            <div class="img">
              <img :src="product.image_url" :alt="product.name" />
            </div>
            <h2>{{ product.name }}</h2>
            <p>{{ formatCurrency(product.price) }}</p>
            <div class="actions">
              <button class="btn primary buy-now">Comprar</button>
            </div>
          </router-link>
        </div>
      </TransitionGroup>
    </div>
    <div class="no-products" v-else-if="products === null">
      <h4>Nenhum produto encontrado</h4>
    </div>
    <div class="pagination" v-if="products.length">
      <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductsSearch from '@/components/ProductsSearch.vue';
import { supabase } from '@/lib/supabaseClient'
import { formatCurrency } from '@/composables/formatCurrency';
import { gsap } from "gsap";

const route = useRoute()
const router = useRouter()
const products = ref([])
const currentPage = ref(1)
const itemsPerPage = 10
const totalPages = ref(1)
const searchValue = ref('')
const vendorName = ref('')

const getQuery = async () => {
  const vendorProducts = JSON.parse(route.query.vendorProducts)
  vendorName.value = route.query.vendorName
  const name = vendorName.value
  products.value = vendorProducts

  router.replace({ query: { name } })
  searchValue.value = vendorName.value
}

const fetchProducts = async (page = 1) => {
  const from = (page - 1) * itemsPerPage
  const to = from + itemsPerPage - 1

  const { data, error, count } = await supabase
    .from('products')
    .select('*', { count: 'exact' })
    .range(from, to)

  if (error) {
    console.error(error)
  } else if (data.length === 0) {
    products.value = null
  } else {
    products.value = data
    totalPages.value = Math.ceil(count / itemsPerPage)
  }
}

const cleanSearchValue = (value) => {
  router.replace({ query: {  } })
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

const onSearchProducts = async (search) => {
  const cleanedSearch = cleanSearchValue(search);

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .ilike('id', `%${cleanedSearch}%`)
    .range(0, itemsPerPage - 1)
  if (error) {
    console.error(error)
  } else {
    products.value = data
    totalPages.value = 1
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchProducts(currentPage.value)
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchProducts(currentPage.value)
  }
}

// GSAP Hooks
function onBeforeEnter(el) {
  el.style.opacity = 0;
  el.style.transform = "translateY(30px)";
}

function onEnter(el, done) {
  gsap.fromTo(
    el,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
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
    y: -30,
    duration: 0.5,
    delay: parseInt(el.dataset.index) * 0.15, // Stagger based on index
    onComplete: done,
  });
}

onMounted(async () => {
  if (route.query.vendorProducts) {
    await getQuery();
  } else {
    await fetchProducts();
  }
});
</script>

<style lang="scss" scoped>
#products-list {
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    .product {
      border-radius: var(--border-radius);
      box-shadow: var(--shadow);
      transition: var(--transition);
      overflow: hidden;
      &:hover {
        transform: scale(1.02);
      }
    }
    .product-link {
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: var(--white-color);
      padding: 10px;
      .img {
        width: 100%;
        height: 400px;
        object-fit: cover;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      h2 {
        margin-top: 10px;
        font-size: var(--subtitle-big);
        color: var(--text-color);
      }
      p {
        margin-top: 10px;
        font-size: var(--subtitle-medium);
        color: var(--text-color);
        font-family: var(--ff-primary);
      }
      .actions {
        display: flex;
        margin-top: 10px;
        .btn {
          margin-right: 10px;
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
  }
  .no-products {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60vh;
    h4 {
      font-size: var(--subtitle-big);
      color: var(--text-color);
      font-family: var(--ff-primary);
    }
  }
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 40px;
    button {
      padding: 10px 20px;
      margin: 0 10px;
      border: 1px solid var(--gray-color);
      border-radius: var(--border-radius);
      background-color: var(--white-color);
      color: var(--text-color);
      font-family: var(--ff-primary);
      cursor: pointer;
      transition: var(--transition);
      &:hover {
        background-color: var(--gray-color);
        color: var(--white-color);
      }
      &:disabled {
        opacity: 0.5;
        &:hover {
          background-color: var(--white-color);
          color: var(--text-color);
        }
      }
    }
    span {
      font-family: var(--ff-primary);
      font-size: var(--text-medium);
      color: var(--text-color);
    }
  }
}

</style>
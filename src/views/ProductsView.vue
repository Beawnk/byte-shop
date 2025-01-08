<template>
  <section id="products-list" class="container">
    <transition name="down" mode="out-in" appear>
      <div class="wrapper">
        <ProductsSearch @emit-search-products="onSearchProducts" :searchValue="searchValue" :vendorName="vendorName"/>
        <div class="grid" v-if="products">
          <TransitionGroup name="grid" :css="false" @before-enter="onBeforeEnter" @enter="onEnter" @leave="onLeave">
            <div class="product" v-for="(product, index) in products" :key="product.id" :data-index="index">
              <router-link :to="{name: 'product', params: {id: product.id}}" class="product-link">
                <div class="img">
                  <img :src="product.image_url[0]" :alt="product.name" />
                </div>
                <h2>{{ truncatedText(product.name, 30) }}</h2>
                <p>{{ formatCurrency(product.price) }}</p>
                <div class="actions">
                  <router-link :to="{name: 'buy', params: {id: product.id}}" class="btn primary buy-now" v-if="userStore.logged === true">Comprar</router-link>
                  <router-link :to="{name: 'user', query: {redirect: `comprar/${product.id}`}}" class="btn primary buy-now" v-if="userStore.logged === false">Comprar</router-link>
                  <FavoriteButton :productId="product.id" @click.stop />
                </div>
              </router-link>
            </div>
          </TransitionGroup>
        </div>
        <div class="no-products" v-else-if="products === null && !loading">
          <h4>Nenhum produto encontrado</h4>
        </div>
        <div class="pagination" v-if="products && !loading">
          <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
        </div>
        <Loader v-if="loading" />
      </div>
    </transition>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductsSearch from '@/components/ProductsSearch.vue';
import { supabase } from '@/lib/supabaseClient'
import { formatCurrency } from '@/composables/formatCurrency';
import { useUserStore } from '@/stores/UserState';
import FavoriteButton from '@/components/FavoriteButton.vue';
import { gsap } from "gsap";

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const products = ref([])
const currentPage = ref(1)
const itemsPerPage = 10
const totalPages = ref(1)
const searchValue = ref('')
const vendorName = ref('')
const loading = ref(false)

const getQuery = async () => {
  const vendorProducts = JSON.parse(route.query.vendorProducts)
  vendorName.value = route.query.vendorName
  const name = vendorName.value
  products.value = vendorProducts

  router.replace({ query: { vendedor: name } })
  searchValue.value = vendorName.value
}

const fetchProducts = async (page = 1) => {
  loading.value = true
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  const { data, error, count } = await supabase
    .from('products')
    .select('*', { count: 'exact' })
    .eq('sold', false)
    .order('created_date', { ascending: false })
    .range(from, to);

  if (error) {
    console.error(error);
  } else if (data.length === 0) {
    products.value = null;
  } else {
    products.value = data;
    totalPages.value = Math.ceil(count / itemsPerPage);
    loading.value = false;
  }
};

const cleanSearchValue = (value) => {
  // Normalize input by removing diacritics and spaces
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/\s+/g, '') // Remove spaces
    .toLowerCase(); // Convert to lowercase
};

const onSearchProducts = async (search) => {
  // Clean the search value
  const cleanedSearch = cleanSearchValue(search);

  // Query Supabase for products by name
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .ilike('name', `%${cleanedSearch}%`) // Case-insensitive partial match
    .range(0, itemsPerPage - 1); // Pagination

  if (error) {
    console.error(error);
  } else {
    // Update products list and pagination
    products.value = data;
    totalPages.value = 1; // Adjust as needed if total results are tracked
  }
};

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

const truncatedText = (string, letters, end = '') => {
	return string.substring(0, letters) + end
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
  .wrapper {
    position: relative;
    min-height: 600px;
  }
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
        font-size: var(--subtitle-medium);
        color: var(--text-color);
      }
      p {
        margin-top: 10px;
        font-size: var(--subtitle-small);
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
}

</style>
<template>
  <section id="products-list" class="container" v-if="products.length">
    <ProductsSearch @emit-search-products="onSearchProducts" />
    <div class="grid" v-if="products.length">
      <div class="product" v-for="product in products" :key="product.id">
        <div class="img">
          <img :src="product.image_url" :alt="product.name" />
        </div>
        <h2>{{ product.name }}</h2>
        <p>{{ formatCurrency(product.price) }}</p>
        <div class="actions">
          <button class="btn secondary add-to-cart">+ Carrinho</button>
          <button class="btn primary  buy-now">Comprar</button>
        </div>
      </div>
    </div>
    <div class="no-products" v-else>
      <h4>Nenhum produto encontrado</h4>
    </div>
    <div class="pagination" v-if="products">
      <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
    </div>
  </section>
  <Loader v-else/>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ProductsSearch from '@/components/ProductsSearch.vue';
import { supabase } from '@/lib/supabaseClient'
import { formatCurrency } from '@/composables/formatCurrency';

const products = ref({})
const currentPage = ref(1)
const itemsPerPage = 10
const totalPages = ref(1)

const fetchProducts = async (page = 1) => {
  const from = (page - 1) * itemsPerPage
  const to = from + itemsPerPage - 1

  const { data, error, count } = await supabase
    .from('products')
    .select('*', { count: 'exact' })
    .range(from, to)

  if (error) {
    console.error(error)
  } else {
    products.value = data
    totalPages.value = Math.ceil(count / itemsPerPage)
  }
}

const cleanSearchValue = (value) => {
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
    console.log(data)
    totalPages.value = 1 // Reset pagination for search results
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

onMounted(() => {
  setTimeout(() => {
    fetchProducts()
  }, 500)
})
</script>

<style lang="scss" scoped>
#products-list {
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    .product {
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: var(--white-color);
      padding: 10px;
      border-radius: var(--border-radius);
      box-shadow: var(--shadow);
      transition: var(--transition);
      cursor: pointer;
      &:hover {
        transform: scale(1.02);
      }
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
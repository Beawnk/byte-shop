<template>
  <section id="products-list" class="container">
    <transition name="down" mode="out-in" appear>
      <div class="wrapper">
        <ProductsSearch :searchValue="search" @emit-search-products="onSearchProducts" />
        <ProductsFilters :minPrice="minPrice" :maxPrice="maxPrice" :sortBy="sortBy" @apply-filters="onApplyFilters" />
        <p class="vendor-filter" v-if="vendorId">
          <span class="chip">
            <span>Produtos de <strong>{{ vendorName || 'vendedor' }}</strong></span>
            <button type="button" aria-label="Remover filtro de vendedor" @click="updateQuery({ vendedor: undefined, pagina: undefined })">&times;</button>
          </span>
        </p>
        <div class="grid" v-if="loading && !products.length" aria-hidden="true">
          <div class="product skeleton" v-for="n in 6" :key="n">
            <div class="img skeleton-block"></div>
            <div class="line title skeleton-block"></div>
            <div class="line price skeleton-block"></div>
            <div class="line action skeleton-block"></div>
          </div>
        </div>
        <div class="grid" v-else-if="products.length">
          <TransitionGroup name="grid" :css="false" @before-enter="onBeforeEnter" @enter="onEnter" @leave="onLeave">
            <div class="product" v-for="(product, index) in products" :key="product.id" :data-index="index">
              <!-- The actions sit outside the card link: a link or button inside another link is invalid HTML. -->
              <router-link :to="{name: 'product', params: {id: product.id}}" class="product-link">
                <div class="img">
                  <img :src="product.image_url?.[0]" :alt="product.name" loading="lazy" decoding="async" />
                </div>
                <h2>{{ truncate(product.name, 30) }}</h2>
                <p>{{ formatCurrency(product.price) }}</p>
              </router-link>
              <div class="actions">
                <AddToCartButton v-if="product.vendor_id !== userStore.user.id" compact :productId="product.id" :productName="product.name" />
                <FavoriteButton :productId="product.id" />
              </div>
            </div>
          </TransitionGroup>
        </div>
        <div class="no-products" v-else-if="!loading">
          <h4>{{ emptyMessage }}</h4>
          <button v-if="loadError" class="btn primary" type="button" @click="fetchProducts">Tentar de novo</button>
        </div>
        <nav class="pagination" aria-label="Páginas de produtos" v-if="totalPages > 1 && !loading">
          <button type="button" @click="goToPage(page - 1)" :disabled="page === 1">Anterior</button>
          <template v-for="(item, index) in pageItems" :key="index">
            <span v-if="item === null" aria-hidden="true">&hellip;</span>
            <button
              v-else
              type="button"
              :class="{ current: item === page }"
              :aria-label="`Página ${item}`"
              :aria-current="item === page ? 'page' : undefined"
              @click="goToPage(item)"
            >{{ item }}</button>
          </template>
          <button type="button" @click="goToPage(page + 1)" :disabled="page === totalPages">Próxima</button>
        </nav>
        <Loader v-if="loading && products.length" />
      </div>
    </transition>
  </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductsSearch from '@/components/ProductsSearch.vue';
import ProductsFilters from '@/components/ProductsFilters.vue';
import { supabase } from '@/lib/supabaseClient'
import { formatCurrency } from '@/composables/formatCurrency';
import { truncate } from '@/utils/truncate';
import { pageRange } from '@/utils/pageRange';
import { useAlertStore } from '@/stores/alertStore';
import FavoriteButton from '@/components/FavoriteButton.vue';
import AddToCartButton from '@/components/AddToCartButton.vue';
import { useUserStore } from '@/stores/UserState';
import { useListAnimation } from '@/composables/useListAnimation';

// Divides evenly into the 5 columns of a 1920px screen and the 3 of a 1366px one.
const PAGE_SIZE = 15

// ?ordem= value -> column and direction
const SORT_OPTIONS = {
  recentes: { column: 'created_date', ascending: false },
  menor: { column: 'price', ascending: true },
  maior: { column: 'price', ascending: false },
}

const alertStore = useAlertStore()
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

const products = ref([])
const total = ref(0)
const vendorName = ref('')
const loading = ref(false)
const loadError = ref(false)

// Search, filters, page and vendor live in the URL, so reload, back/forward and shared links
// show the same list.
const search = computed(() => (route.query.busca ?? '').toString())
const page = computed(() => Math.max(1, parseInt(route.query.pagina, 10) || 1))
const vendorId = computed(() => (route.query.vendedor ?? '').toString())
const priceParam = (value) => {
  const price = parseFloat(value)
  return Number.isFinite(price) && price >= 0 ? String(price) : ''
}
const minPrice = computed(() => priceParam(route.query.preco_min))
const maxPrice = computed(() => priceParam(route.query.preco_max))
const sortBy = computed(() => (SORT_OPTIONS[route.query.ordem] ? route.query.ordem : 'recentes'))
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / PAGE_SIZE)))
const pageItems = computed(() => pageRange(page.value, totalPages.value))

const emptyMessage = computed(() => {
  if (loadError.value) return 'Não foi possível carregar os produtos.'
  if (search.value) return `Nenhum produto encontrado para "${search.value}".`
  if (minPrice.value || maxPrice.value) return 'Nenhum produto nessa faixa de preço.'
  return 'Nenhum produto encontrado'
})

// % and _ are wildcards in LIKE; typed by the user they should match literally.
const escapeLike = (value) => value.replace(/[\\%_]/g, (char) => `\\${char}`)

let latestRequest = 0

const fetchProducts = async () => {
  const request = ++latestRequest
  loading.value = true
  loadError.value = false

  const from = (page.value - 1) * PAGE_SIZE
  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .eq('sold', false)
    .order(SORT_OPTIONS[sortBy.value].column, { ascending: SORT_OPTIONS[sortBy.value].ascending })
    .range(from, from + PAGE_SIZE - 1)

  if (search.value) query = query.ilike('name', `%${escapeLike(search.value)}%`)
  if (vendorId.value) query = query.eq('vendor_id', vendorId.value)
  if (minPrice.value) query = query.gte('price', minPrice.value)
  if (maxPrice.value) query = query.lte('price', maxPrice.value)

  const vendorQuery = vendorId.value
    ? supabase.from('public_profiles').select('name').eq('id', vendorId.value).maybeSingle()
    : Promise.resolve({ data: null })

  const [{ data, error, count }, { data: vendor }] = await Promise.all([query, vendorQuery])

  // A slower, older request (e.g. the previous page) must not overwrite a newer one.
  if (request !== latestRequest) return
  loading.value = false

  if (error) {
    loadError.value = true
    products.value = []
    alertStore.addGlobalError('Erro ao carregar os produtos.', error)
    return
  }

  products.value = data
  total.value = count ?? data.length
  vendorName.value = vendor?.name ?? ''
}

const updateQuery = (changes) => {
  const query = { ...route.query, ...changes }
  Object.keys(query).forEach((key) => {
    if (query[key] === '' || query[key] === undefined || query[key] === null) delete query[key]
  })
  router.push({ name: 'products', query })
}

const onSearchProducts = (term) => {
  // A new search starts back at page 1.
  updateQuery({ busca: term.trim(), pagina: undefined })
}

const onApplyFilters = ({ min, max, sort }) => {
  updateQuery({
    preco_min: min,
    preco_max: max,
    ordem: sort === 'recentes' ? undefined : sort,
    pagina: undefined,
  })
}

const goToPage = (target) => {
  if (target < 1 || target > totalPages.value) return
  updateQuery({ pagina: target > 1 ? target : undefined })
}

const { onBeforeEnter, onEnter, onLeave } = useListAnimation({ axis: 'y', enterFrom: 20, enterDuration: 0.3, enterStagger: 0.04, leaveDuration: 0 });

// Refetch whenever the list's query changes; ignore the route change that leaves this page.
watch(
  () => (route.name === 'products' ? route.fullPath : null),
  (path) => { if (path) fetchProducts() },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
@use '@/assets/style/main.scss' as m;

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
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: var(--white-color);
      padding: 10px;
      border-radius: var(--border-radius);
      box-shadow: var(--shadow);
      transition: var(--transition);
      overflow: hidden;
      &:hover,
      &:focus-within {
        transform: scale(1.02);
      }
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
    .product-link {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      .img {
        width: 100%;
        height: 400px;
        object-fit: cover;
        overflow: hidden;
        @include m.media(xs) {
          height: 300px;
        }
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
    }
  }
  .skeleton {
    .img {
      width: 100%;
      height: 400px;
      @include m.media(xs) {
        height: 300px;
      }
    }
    .line {
      margin-top: 10px;
      height: 20px;
      &.title {
        width: 60%;
      }
      &.price {
        width: 35%;
      }
      &.action {
        width: 45%;
        height: 40px;
      }
    }
  }
  .vendor-filter {
    display: flex;
    justify-content: center;
    margin: -20px 0 30px;
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 8px 8px 8px 16px;
      border-radius: 20px;
      background-color: var(--secondary-color);
      color: var(--light-dark-color);
      button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        color: inherit;
        font-size: 18px;
        line-height: 1;
        &:hover {
          background-color: var(--white-color);
        }
      }
    }
  }
  .no-products {
    display: flex;
    flex-direction: column;
    gap: 20px;
    justify-content: center;
    align-items: center;
    height: 60vh;
    text-align: center;
    h4 {
      font-size: var(--subtitle-big);
      color: var(--text-color);
      font-family: var(--ff-primary);
    }
  }
}

</style>
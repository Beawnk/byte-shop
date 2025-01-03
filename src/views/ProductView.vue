<template>
  <section id="product-page" class="container">
    <transition name="down" mode="out-in" appear>
      <div class="product" v-if="product">
        <div class="img">
          <img :src="product.image_url" :alt="product.name" />
        </div>
        <div class="info">
          <div class="product-info">
            <h2>{{ product.name }}</h2>
            <p>{{ formatCurrency(product.price) }}</p>
            <p>{{ product.description }}</p>
            <div class="actions">
              <router-link :to="{name: 'buy', params: {id: product.id}}" class="btn primary buy-now" v-if="product.sold === false">Comprar</router-link>
              <button class="btn primary" disabled v-else>Vendido</button>
              <button class="btn secondary save"></button>
            </div>
          </div>
          <VendorInfo :vendor="vendor" @emitOpenReviews="onEmitOpenReviews" />
        </div>
      </div>
    </transition>
    <VendorReviews v-if="product" v-show="modalReviews" @emit-vendor-info="onVendorInfo" @emit-close-modal="onEmitCloseReviews" :vendor-id="product.vendor_id" :class="{open: modalReviews}"/>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { formatCurrency } from '@/composables/formatCurrency';
import VendorReviews from '@/components/VendorReviews.vue';
import VendorInfo from '@/components/VendorInfo.vue';

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const product = ref(null)
const vendor = ref(null)
const modalReviews = ref(false)

const fetchProduct = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', props.id)
    .single()

  if (error) {
    console.error(error)
    setTimeout(() => {
    }, 500)
  } else {
    product.value = data
    setTimeout(() => {
    }, 500)
  }
}

const onVendorInfo = async (vendorInfo) => {
  vendor.value = await vendorInfo
}

const onEmitOpenReviews = () => {
  modalReviews.value = !modalReviews.value
}

const onEmitCloseReviews = () => {
  modalReviews.value = false
}

onMounted(() => {
  fetchProduct()
})
</script>

<style lang="scss" scoped>
#product-page {
    padding: calc(var(--section) + var(--header-height)) 200px var(--section) 200px;
    .product {
        display: flex;
        gap: 40px;
        .img {
            width: calc(50% - 40px);
            height: 800px;
            border-radius: 8px;
            overflow: hidden;
            padding: 20px;
            box-shadow: var(--shadow);
            background-color: var(--white-color);
            img {
                object-fit: cover;
                width: 100%;
                height: 100%;
            }
        }
        .info {
            display: flex;
            flex-direction: column;
            gap: 40px;
            width: calc(50% - 40px);
            .product-info {
              display: flex;
              flex-direction: column;
              gap: 20px;
              background-color: var(--white-color);
              padding: 40px;
              border-radius: var(--border-radius);
              box-shadow: var(--shadow);
              h2 {
                  color: var(--text-color);
              }
              p {
                  color: var(--text-color);
              }
              .actions {
                  display: flex;
                  gap: 10px;
                  .save {
                      background-image: url('../assets/img/icons/favorite.png');
                      background-size: 25px;
                      background-repeat: no-repeat;
                      background-position: 50% calc(50% + 2px);
                      padding: 20px;
                      cursor: pointer;
                      transition: var(--transition);
                      background-color: transparent;
                      border: 2px solid var(--gray-color);
                      &:hover {
                          background-color: var(--gray-color);
                          background-image: url('../assets/img/icons/favorited.png');
                      }
                      &.saved {
                          background-color: var(--gray-color);
                          background-image: url('../assets/img/icons/favorited.png');
                      }
                  }
              }
            }
        }
    }
}
</style>
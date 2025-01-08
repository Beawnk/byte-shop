<template>
  <section id="product-page" class="container">
    <transition name="down" mode="out-in" appear>
      <div class="product" v-if="product && vendor">
        <div class="images">
          <div class="img">
            <img :src="selectedImage" :alt="product.name" />
          </div>
          <div class="thumbnails">
            <div class="thumb" v-for="(image, index) in product.image_url" :key="index">
              <img :src="image" :alt="`${product.name} - image ${index + 1}`" @click="selectImage(image)" :class="{ active: selectedImage === image }" />
            </div>
          </div>
        </div>
        <div class="info">
          <div class="product-info">
            <h2>{{ product.name }}</h2>
            <p>{{ formatCurrency(product.price) }}</p>
            <p>{{ product.description }}</p>
            <div class="actions">
              <router-link :to="{name: 'buy', params: {id: product.id}}" class="btn primary buy-now" v-if="product.sold === false && userStore.logged === true">Comprar</router-link>
              <router-link :to="{name: 'user', query: {redirect: `comprar/${product.id}`}}" class="btn primary buy-now" v-if="product.sold === false && userStore.logged === false">Comprar</router-link>
              <button class="btn primary" disabled v-if="product.sold === true">Vendido</button>
              <FavoriteButton :productId="product.id" />
            </div>
          </div>
          <VendorInfo :vendor="vendor" @emitOpenReviews="onEmitOpenReviews" />
        </div>
      </div>
    </transition>
    <Loader v-if="loading"/>
    <VendorReviews v-if="product" v-show="modalReviews" @emit-vendor-info="onVendorInfo" @emit-close-modal="onEmitCloseReviews" :vendor-id="product.vendor_id" :class="{open: modalReviews}"/>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { formatCurrency } from '@/composables/formatCurrency';
import VendorReviews from '@/components/VendorReviews.vue';
import VendorInfo from '@/components/VendorInfo.vue';
import { useUserStore } from '@/stores/UserState';
import FavoriteButton from '@/components/FavoriteButton.vue';

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const userStore = useUserStore()

const product = ref(null)
const vendor = ref(null)
const modalReviews = ref(false)
const selectedImage = ref('');
const loading = ref(false)

const fetchProduct = async () => {
  loading.value = true
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', props.id)
    .single()

  if (error) {
    console.error(error)
  } else {
    product.value = data
    selectedImage.value = data.image_url[0];
    loading.value = false
  }
}

const selectImage = (image) => {
  selectedImage.value = image;
};

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
    position: relative;
    min-height: 600px;
    .product {
        display: flex;
        gap: 40px;
        .images {
            width: calc(50% - 40px);
            .img {
                width: 100%;
                height: 100%;
                background-color: var(--white-color);
                border-radius: 8px;
                overflow: hidden;
                padding: 20px;
                box-shadow: var(--shadow);
                height: 700px;
                img {
                    object-fit: cover;
                    width: 100%;
                    height: 100%;
                }
            }
            .thumbnails {
                display: flex;
                gap: 10px;
                margin-top: 20px;
                .thumb {
                    width: 120px;
                    height: 120px;
                    background-color: var(--white-color);
                    border-radius: 8px;
                    padding: 10px;
                    overflow: hidden;
                    box-shadow: var(--shadow);
                    img {
                        object-fit: cover;
                        width: 100%;
                        height: 100%;
                        cursor: pointer;
                        transition: var(--transition);
                        &:hover {
                            transform: scale(1.05);
                        }
                    }
                }
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
              }
            }
        }
    }
}
</style>
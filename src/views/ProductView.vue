<template>
  <section id="product-page" class="container">
    <transition name="down" mode="out-in" appear>
      <div class="product" v-if="product">
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
              <router-link :to="{name: 'buy', params: {id: product.id}}" class="btn primary buy-now" v-if="product.sold === false">Comprar</router-link>
              <button class="btn primary" disabled v-if="product.sold === true">Vendido</button>
              <FavoriteButton :productId="product.id" />
            </div>
          </div>
          <VendorInfo v-if="vendor" :vendor="vendor" @emitOpenReviews="onEmitOpenReviews" />
        </div>
      </div>
      <div class="not-found" v-else-if="notFound">
        <h2>Produto não encontrado</h2>
        <p>Ele pode ter sido removido ou o link está incorreto.</p>
        <router-link :to="{ name: 'products' }" class="btn primary">Ver produtos</router-link>
      </div>
    </transition>
    <Loader v-if="loading"/>
    <VendorReviews v-if="product" v-show="modalReviews" @emit-close-modal="onEmitCloseReviews" :vendor-id="product.vendor_id" :class="{open: modalReviews}"/>
  </section>
</template>

<script setup>
import { ref, watch } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { formatCurrency } from '@/composables/formatCurrency';
import { fetchVendor } from '@/composables/fetchVendor';
import { useAlertStore } from '@/stores/alertStore';
import VendorReviews from '@/components/VendorReviews.vue';
import VendorInfo from '@/components/VendorInfo.vue';
import FavoriteButton from '@/components/FavoriteButton.vue';

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const alertStore = useAlertStore()

const product = ref(null)
const vendor = ref(null)
const notFound = ref(false)
const modalReviews = ref(false)
const selectedImage = ref('');
const loading = ref(false)

const fetchProduct = async () => {
  loading.value = true
  notFound.value = false
  product.value = null
  vendor.value = null
  modalReviews.value = false

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', props.id)
      .maybeSingle()

    if (error) throw error
    if (!data) {
      notFound.value = true
      return
    }

    product.value = data
    document.title = `${data.name} | Byte Shop`
    selectedImage.value = data.image_url?.[0] ?? '';
    // The vendor card is secondary: if it fails, the product still shows.
    vendor.value = await fetchVendor(data.vendor_id).catch(() => null)
  } catch (error) {
    alertStore.addGlobalError('Erro ao carregar o produto.', error)
  } finally {
    loading.value = false
  }
}

const selectImage = (image) => {
  selectedImage.value = image;
};

const onEmitOpenReviews = () => {
  modalReviews.value = !modalReviews.value
}

const onEmitCloseReviews = () => {
  modalReviews.value = false
}

// The same component is reused between /produtos/a and /produtos/b, so refetch when the id changes.
watch(() => props.id, fetchProduct, { immediate: true })
</script>

<style lang="scss" scoped>
@use '@/assets/style/main.scss' as m;

#product-page {
    padding: calc(var(--section) + var(--header-height)) 200px var(--section) 200px;
    position: relative;
    min-height: 600px;

    @include m.media(1450px) {
        padding: calc(var(--section) + var(--header-height)) 50px var(--section) 50px;
    }

    .product {
        display: flex;
        gap: 40px;

        @include m.media(1051px) {
            flex-direction: column;
        }

        .images {
            width: calc(50% - 40px);

            @include m.media(1051px) {
                width: 100%;
            }

            .img {
                width: 100%;
                height: 100%;
                background-color: var(--white-color);
                border-radius: 8px;
                overflow: hidden;
                padding: 20px;
                box-shadow: var(--shadow);
                height: 700px;

                @include m.media(600px) {
                    height: 400px;
                }

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

                @include m.media(1051px) {
                    justify-content: center;
                }

                .thumb {
                    width: 120px;
                    height: 120px;
                    background-color: var(--white-color);
                    border-radius: 8px;
                    padding: 10px;
                    overflow: hidden;
                    box-shadow: var(--shadow);

                    @include m.media(600px) {
                        width: 80px;
                        height: 80px;
                        padding: 5px;
                    }

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

            @include m.media(1051px) {
                width: 100%;
            }

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

#product-page .not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: var(--section) 0;
    text-align: center;
    color: var(--text-color);
}
</style>
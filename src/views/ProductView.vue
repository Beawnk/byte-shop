<template>
  <section id="product-page" class="container" v-if="!loading">
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
            <router-link to="/products" class="btn primary buy-now">Comprar</router-link>
            <button class="btn secondary save"></button>
          </div>
        </div>
        <div class="vendor" v-if="vendor">
            <h4>Vendedor</h4>
            <div class="avatar">
                <img :src="vendor.avatar" :alt="vendor.name" />
            </div>
            <h5>{{ vendor.name }}</h5>
            <VendorRating :vendor="vendor"/>
            <router-link to="/produtos" class="vendor-products btn primary">Ver todos os produtos</router-link>
        </div>
      </div>
    </div>
    <VendorReviews v-if="product" @emit-vendor-info="onVendorInfo" :vendor-id="product.vendor_id"/>
  </section>
  <Loader v-if="loading"/>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { formatCurrency } from '@/composables/formatCurrency';
import VendorReviews from '@/components/VendorReviews.vue';
import VendorRating from '@/components/VendorRating.vue';

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const product = ref(null)
const loading = ref(false)
const vendor = ref(null)

const fetchProduct = async () => {
  loading.value = true
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', props.id)
    .single()

  if (error) {
    console.error(error)
    setTimeout(() => {
      loading.value = false
    }, 500)
  } else {
    product.value = data
    setTimeout(() => {
      loading.value = false
    }, 500)
  }
}

const onVendorInfo = (vendorName, vendorRating, vendorReviews, vendorAvatar) => {
  vendor.value = {
    name: vendorName,
    rating: vendorRating,
    reviews: vendorReviews,
    avatar: vendorAvatar
  }
  console.log(useGetVendorStars(vendorRating))
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
            .vendor {
                background-color: var(--white-color);
                padding: 20px;
                border-radius: var(--border-radius);
                display: flex;
                flex-direction: column;
                gap: 10px;
                align-items: center;
                justify-content: center;
                min-height: 300px;
                height: 100%;
                width: 100%;
                box-shadow: var(--shadow);
                h4 {
                    color: var(--text-color);
                    margin-bottom: 20px;
                }
                .avatar {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    overflow: hidden;
                    img {
                        object-fit: cover;
                        width: 100%;
                        height: 100%;
                    }
                }
                h5 {
                    color: var(--text-color);
                }
                p {
                    color: var(--text-color);
                }
                .btn {
                  margin-top: 10px;
                }
            }
        }
    }
}
</style>
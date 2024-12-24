<template>
  <section id="product-page" class="container" v-if="!loading">
    <div class="product" v-if="product">
      <div class="img">
        <img :src="product.image_url" :alt="product.name" />
      </div>
      <div class="info">
        <h2>{{ product.name }}</h2>
        <p>{{ formatCurrency(product.price) }}</p>
        <p>{{ product.description }}</p>
        <div class="actions">
          <button class="btn primary buy-now">Comprar</button>
          <button class="btn secondary save"></button>
        </div>
        <div class="vendor" v-if="vendor">
            <h5>{{ vendor.name }}</h5>
            <div class="rating">
                <p class="rating-number">{{ vendor.rating }}</p>
                <div class="stars">
                    <span v-for="star in useGetVendorStars(vendor.rating)" :key="star" class="star" :class="{full: star == 'full', half: star == 'half', empty: star == 'empty'}"></span>
                </div>
                <p class="total-reviews">{{ vendor.reviews }} avaliações</p>
            </div>
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
import { useGetVendorStars } from '@/composables/getVendorStars';

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

const onVendorInfo = (vendorName, vendorRating, vendorReviews) => {
  vendor.value = {
    name: vendorName,
    rating: vendorRating,
    reviews: vendorReviews
  }
  console.log(useGetVendorStars(vendorRating))
}

onMounted(() => {
  fetchProduct()
})
</script>

<style lang="scss" scoped>
#product-page {
    .product {
        display: flex;
        gap: 40px;
        .img {
            width: 600px;
            height: 600px;
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
            gap: 20px;
            h2 {
                color: var(--text-color);
            }
            p {
                color: var(--text-color);
            }
            .actions {
                display: flex;
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
                h5 {
                    color: var(--text-color);
                }
                p {
                    color: var(--text-color);
                }
                .rating {
                    display: flex;
                    gap: 10px;
                    align-items: center;
                    .rating-number {
                        font-size: var(--text-big);
                    }
                    .stars {
                        display: flex;
                        gap: 5px;
                        .star {
                            width: 20px;
                            height: 20px;
                            background-size: contain;
                            background-repeat: no-repeat;
                            background-position: center;

                            &.full {
                                background-image: url('../assets/img/icons/star-full.png');
                            }
                            &.half {
                                background-image: url('..assets/img/icons/star-half.png');
                            }
                            &.empty {
                                background-image: url('../assets/img/icons/star-empty.png');
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
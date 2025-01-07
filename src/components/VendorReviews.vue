<template>
  <div class="modal modal-reviews" v-if="vendorId">
    <div class="modal-content" ref="modal">
      <button class="close" @click="closeModal"></button>
      <VendorInfo :vendor="vendor" />
      <div class="reviews" v-if="reviews.length">
        <div class="review" v-for="review in reviews" :key="review.id">
          <div class="user">
            <div class="avatar">
              <img :src="review.user_avatar" :alt="review.user_name" />
            </div>
            <div class="user-info">
              <div class="name-date">
                <h5>{{ review.user_name }}</h5>
                <span class="date">{{ review.date }}</span>
              </div>
              <div class="stars">
                <span v-for="star in useGetVendorStars(review.stars)" :key="star" class="star" :class="{full: star == 'full', half: star == 'half', empty: star == 'empty'}"></span>
              </div>
            </div>
          </div>
          <div class="text">
            <p class="product"><strong>Produto avaliado: </strong>{{ review.product_name }}</p>
            <h6 class="title">"{{ review.title }}"</h6>
            <p class="review-text">{{ review.review }}</p>
          </div>
        </div>
      </div>
      <div class="no-reviews" v-else>
        <h4>Nenhuma avaliação encontrada</h4>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import VendorInfo from '@/components/VendorInfo.vue'
import { useGetVendorStars } from '@/composables/getVendorStars'
import { useClickOutside } from '@/composables/clickOutside';

const props = defineProps(['vendorId'])

const emit = defineEmits(['emitVendorInfo', 'emitCloseModal'])

const reviews = ref([])
const vendor = ref(null)
const averageRating = ref(0)
const modal = ref(null)

const fetchReviews = async () => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('vendor_id', props.vendorId)

  if (error) {
    console.error(error)
  } else {
    if (data) {
      console.log(data)
      const reviewsWithUser = await Promise.all(data.map(async (review) => {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('name, avatar')
          .eq('id', review.user_id)
          .single()
      
        if (userError) {
          console.error(userError)
          return review
        } else {
          const product = await fetchProductName(review.product_id);
          return { ...review, user_name: userData.name, user_avatar: userData.avatar, product_name: product }
        }
      }))
    
      reviews.value = reviewsWithUser
      const stars = await Promise.all(reviews.value.map(review => review.stars))
    
      getStars(stars)
      const { data: vendorData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', props.vendorId)
        .single()

      if (error) {
        console.error(error)
      } else {
        if (vendorData) {
          vendor.value = {
            id: vendorData.id,
            name: vendorData.name,
            rating: averageRating.value,
            reviews: reviews.value.length,
            avatar: vendorData.avatar,
          }
          emit('emitVendorInfo', vendor.value)
          useClickOutside(modal, closeModal)
        } else {
          vendor.value = {
            id: data.id,
            name: data.name,
            rating: 0,
            reviews: 0,
            avatar: data.avatar,
          }
          emit('emitVendorInfo', vendor.value)
          useClickOutside(modal, closeModal)
        }
      }
    }
  }
}

const fetchProductName = async (productId) => {
  const { data, error } = await supabase
    .from('products')
    .select('name')
    .eq('id', productId)
    .single()

  if (error) {
    console.error(error)
  } else {
    return data.name
  }
}

const getStars = (stars) => {
    const averageStars = stars.reduce((acc, star) => acc + star, 0) / stars.length
    averageRating.value = roundRating(averageStars)
}

const roundRating = (rating) => {
    return Math.round(rating * 2) / 2;
};

const closeModal = () => {
  emit('emitCloseModal')
}

onMounted(() => {
  fetchReviews()
})
</script>

<style lang="scss" scoped>
.modal {
  .modal-content{
    display: flex;
    flex-direction: column;
    gap: 20px;
    .reviews {
      display: flex;
      flex-direction: column;
      gap: 20px;
      overflow-y: auto;
      padding-right: 20px;
      .review {
        background-color: var(--white-color);
        padding: 20px;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
        .user {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
          .avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            overflow: hidden;
            img {
              object-fit: cover;
              width: 100%;
              height: 100%;
            }
          }
          .user-info {
            display: flex;
            flex-direction: column;
            gap: 5px;
            width: calc(100% - 70px);
            .name-date {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 5px;
              h5 {
                color: var(--text-color);
              }
              .date {
                color: var(--text-color-light);
              }
            }
          }
        }
        .text {
          p {
            color: var(--text-color);
          }
          .product {
            margin-bottom: 10px;
          }
          h6 {
            color: var(--text-color);
            margin-bottom: 10px;
          }
        }
      }
    }
    .no-reviews {
      background-color: var(--white-color);
      padding: 20px;
      border-radius: var(--border-radius);
      box-shadow: var(--shadow);
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 20vh;
      h4 {
        color: var(--text-color);
      }
    }
  }
}
</style>
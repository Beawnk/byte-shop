<template>
  <div class="modal">
    <div class="modal-content">
      <VendorInfo :vendor="vendor" />
      <div class="reviews" v-if="reviews.length">
        <h3>Reviews</h3>
        <div class="review" v-for="review in reviews" :key="review.id">
          <p>{{ review.user_name }}</p>
          <p>{{ review.stars }}</p>
          <p>{{ review.review }}</p>
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

const props = defineProps({
  vendorId: {
    type: Number,
    required: true
  }
})

const emit = defineEmits('emitVendorInfo')

const reviews = ref([])
const vendor = ref(null)
const averageRating = ref(0)

const fetchReviews = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', props.vendorId)
    .single()

  if (error) {
    console.error(error)
  } else {
    const reviewsWithUserNames = await Promise.all(data.reviews.map(async (review) => {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('name')
        .eq('id', review.user_id)
        .single()

      if (userError) {
        console.error(userError)
        return review
      } else {
        return { ...review, user_name: userData.name }
      }
    }))

    reviews.value = reviewsWithUserNames
    const stars = await Promise.all(reviews.value.map(review => review.stars))

    getStars(stars)
    vendor.value = {
      name: data.name,
      rating: averageRating.value,
      reviews: reviews.value.length,
      avatar: data.avatar
    }
    emit('emitVendorInfo', vendor.value)
  }
}

const getStars = (stars) => {
    const averageStars = stars.reduce((acc, star) => acc + star, 0) / stars.length
    averageRating.value = averageStars
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
      background-color: var(--white-color);
      padding: 20px;
      border-radius: var(--border-radius);
      box-shadow: var(--shadow);
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
    }
  }
}
</style>
<template>
  <div class="modal modal-reviews" v-if="vendorId">
    <div class="modal-content" ref="modal">
      <button class="close" type="button" aria-label="Fechar avaliações" @click="closeModal"></button>
      <VendorInfo v-if="vendor" :vendor="vendor" />
      <div class="reviews" v-if="reviews.length">
        <div class="review" v-for="review in reviews" :key="review.id">
          <div class="user">
            <div class="avatar">
              <img :src="review.user_avatar" :alt="review.user_name" />
            </div>
            <div class="user-info">
              <div class="name-date">
                <h5>{{ getUserName(review.user_name) }}</h5>
                <span class="date">{{ review.date }}</span>
              </div>
              <StarRating :rating="Number(review.stars)" />
            </div>
          </div>
          <div class="text">
            <p class="product"><strong>Produto avaliado: </strong>{{ review.product_name }}</p>
            <h6 class="title">"{{ review.title }}"</h6>
            <p class="review-text">{{ review.review }}</p>
          </div>
        </div>
      </div>
      <div class="no-reviews" v-else-if="!reviews.length && !loading">
        <h4>Nenhuma avaliação encontrada</h4>
      </div>
      <Loader v-if="loading" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import VendorInfo from '@/components/VendorInfo.vue'
import StarRating from '@/components/StarRating.vue'
import { useClickOutside } from '@/composables/clickOutside';
import { fetchVendor } from '@/composables/fetchVendor';
import { useAlertStore } from '@/stores/alertStore';
import { DEFAULT_AVATAR } from '@/stores/UserState';
import { formatDate } from '@/utils/formatDate';

const props = defineProps(['vendorId'])

const emit = defineEmits(['emitCloseModal'])

const reviews = ref([])
const vendor = ref(null)
const modal = ref(null)
const loading = ref(false)
const alertStore = useAlertStore()

useClickOutside(modal, () => emit('emitCloseModal'))

const fetchReviews = async () => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('vendor_id', props.vendorId)

  if (error) throw error

  reviews.value = await Promise.all(data.map(async (review) => {
    const { data: userData } = await supabase
      .from('public_profiles')
      .select('name, avatar')
      .eq('id', review.user_id)
      .maybeSingle()

    const product = await fetchProductName(review.product_id);
    return {
      ...review,
      date: formatDate(review.created_at),
      user_name: userData?.name ?? 'Usuário',
      user_avatar: userData?.avatar ?? DEFAULT_AVATAR,
      product_name: product,
    }
  }))
}

const load = async () => {
  loading.value = true
  try {
    const [vendorData] = await Promise.all([fetchVendor(props.vendorId), fetchReviews()])
    vendor.value = vendorData
  } catch (error) {
    alertStore.addGlobalError('Erro ao carregar as avaliações.', error)
  } finally {
    loading.value = false
  }
}

const getUserName = (name) => {
  return name.split(' ').slice(0, 2).join(' ')
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

const closeModal = () => {
  emit('emitCloseModal')
}

// Reload when the same component is reused for another vendor (e.g. navigating between products).
watch(() => props.vendorId, (id) => { if (id) load() }, { immediate: true })
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
                color: var(--text-color);
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
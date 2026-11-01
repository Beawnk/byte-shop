<template>
  <div class="review-list paged-list" ref="listTop" v-if="reviews.length">
    <div class="reviews" :key="page">
      <div class="review" v-for="review in visibleItems" :key="review.id">
        <div class="user" :class="{ 'no-author': !showAuthor }">
          <div class="avatar" v-if="showAuthor">
            <img :src="review.authorAvatar" :alt="review.authorName" />
          </div>
          <div class="user-info">
            <div class="name-date">
              <h5 v-if="showAuthor">{{ shortName(review.authorName) }}</h5>
              <span class="date">{{ review.date }}</span>
            </div>
            <StarRating :rating="review.stars" />
          </div>
        </div>
        <div class="text">
          <p class="product"><strong>Produto avaliado: </strong>{{ review.productName }}</p>
          <h6 class="title">"{{ review.title }}"</h6>
          <p class="review-text">{{ review.review }}</p>
        </div>
      </div>
    </div>
    <ListPagination :page="page" :total-pages="totalPages" label="Páginas das avaliações" @change="goToPage" />
  </div>
  <div class="no-reviews" v-else-if="!loading">
    <h4>Nenhuma avaliação encontrada</h4>
  </div>
</template>

<script setup>
import { watch } from 'vue'
import StarRating from '@/components/StarRating.vue'
import ListPagination from '@/components/ListPagination.vue'
import { usePagination } from '@/composables/usePagination'

const props = defineProps({
  reviews: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  showAuthor: {
    type: Boolean,
    default: true
  }
})

const { page, totalPages, visibleItems, listTop, goToPage } = usePagination(() => props.reviews)

watch(() => props.reviews, () => { page.value = 1 })

const shortName = (name) => name.split(' ').slice(0, 2).join(' ')
</script>

<style lang="scss" scoped>
@use '@/assets/style/main.scss' as m;

.review-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
  min-height: 0;
  @include m.media(sm) {
    flex: none;
  }
  .pagination {
    margin-top: 0;
  }
}
.reviews {
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  @include m.media(sm) {
    overflow-y: visible;
  }
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
          @include m.media(xs) {
            flex-direction: column;
            align-items: flex-start;
          }
          h5 {
            color: var(--text-color);
          }
          .date {
            color: var(--text-color);
          }
        }
      }
      &.no-author .user-info {
        flex-direction: row-reverse;
        justify-content: space-between;
        align-items: center;
        width: 100%;
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
</style>

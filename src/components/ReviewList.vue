<template>
  <div class="reviews" v-if="reviews.length">
    <div class="review" v-for="review in reviews" :key="review.id">
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
  <div class="no-reviews" v-else-if="!loading">
    <h4>Nenhuma avaliação encontrada</h4>
  </div>
</template>

<script setup>
import StarRating from '@/components/StarRating.vue'

defineProps({
  reviews: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  // Off in "Avaliações enviadas": the author is the user reading the list.
  showAuthor: {
    type: Boolean,
    default: true
  }
})

const shortName = (name) => name.split(' ').slice(0, 2).join(' ')
</script>

<style lang="scss" scoped>
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

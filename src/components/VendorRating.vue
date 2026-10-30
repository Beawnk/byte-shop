<template>
    <div class="rating" v-if="vendor">
        <p class="rating-number">{{ vendor.rating }}</p>
        <StarRating :rating="vendor.rating" />
        <p class="total-reviews">{{ vendor.reviews }} avaliações</p>
    </div>
</template>

<script setup>
import StarRating from '@/components/StarRating.vue';

defineProps({
    vendor: {
        type: Object,
        required: true
    }
})
</script>

<style lang="scss" scoped>
.rating {
    display: flex;
    gap: 10px;
    align-items: center;
    cursor: pointer;
    .rating-number {
        font-size: var(--subtitle-medium);
        transition: var(--transition);
        color: var(--text-color);
    }
    &:hover {
        :deep(.star) {
            &.full {
                background-image: url('../assets/img/icons/star-full-hover.png');
            }
            &.half {
                background-image: url('../assets/img/icons/star-half-hover.png');
            }
        }
        .total-reviews, .rating-number {
            color: var(--primary-color);
        }
    }
    .total-reviews {
        transition: var(--transition);
        font-size: var(--text-small);
        color: var(--text-color);
        margin-left: 10px;
    }
}
</style>

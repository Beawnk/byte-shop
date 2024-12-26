<template>
    <div class="rating" v-if="vendor">
        <p class="rating-number">{{ vendor.rating }}</p>
        <div class="stars">
            <span v-for="star in useGetVendorStars(vendor.rating)" :key="star" class="star" :class="{full: star == 'full', half: star == 'half', empty: star == 'empty'}"></span>
        </div>
        <p class="total-reviews">{{ vendor.reviews }} avaliações</p>
    </div>
</template>

<script setup>
import { useGetVendorStars } from '@/composables/getVendorStars';

const props = defineProps({
    vendor: {
        type: Object,
        required: true
    }
})
</script>

<style lang="scss">
.rating {
    display: flex;
    gap: 10px;
    align-items: center;
    cursor: pointer;
    .rating-number {
        font-size: var(--subtitle-medium);
        transition: var(--transition);
    }
    &:hover {
        .star {
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
        margin-left: 10px;
    }
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
        transition: var(--transition);
        &.full {
            background-image: url('../assets/img/icons/star-full.png');
        }
        &.half {
            background-image: url('../assets/img/icons/star-half.png');
        }
        &.empty {
            background-image: url('../assets/img/icons/star-empty.png');
        }
    }
}
</style>
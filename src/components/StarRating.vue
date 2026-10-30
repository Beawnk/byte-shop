<template>
    <div class="stars" role="img" :aria-label="`Nota ${rating} de 5`">
        <span v-for="(star, index) in useGetVendorStars(rating)" :key="index" class="star" :class="star"></span>
    </div>
</template>

<script setup>
import { useGetVendorStars } from '@/composables/getVendorStars';

defineProps({
    rating: {
        type: Number,
        required: true
    }
})
</script>

<style lang="scss" scoped>
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

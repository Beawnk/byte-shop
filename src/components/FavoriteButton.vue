<template>
  	<button v-if="userStore.logged" @click.prevent="toggleFavorite" :class="{ saved: isFavorite }" class="btn save"></button>
    <router-link v-else :to="{name: 'user', query: {redirect: `produtos/${props.productId}`}}" class="btn save"></router-link>
</template>

<script setup>
import { useFavoritesStore } from '@/stores/favoritesStore';
import { useUserStore } from '@/stores/UserState';
import { onMounted, computed } from 'vue';

const props = defineProps(['productId']);

const favoritesStore = useFavoritesStore();
const userStore = useUserStore();

onMounted(() => {
  if (userStore.logged) {
    favoritesStore.fetchFavorites();
  }
});

const isFavorite = computed(() => favoritesStore.isFavorite(props.productId));

const toggleFavorite = async () => {
  if (isFavorite.value) {
    await favoritesStore.removeFavorite(props.productId);
  } else {
    await favoritesStore.addFavorite(props.productId);
  }
};
</script>

<style lang="scss" scoped>
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
</style>

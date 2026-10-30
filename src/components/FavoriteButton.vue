<template>
  	<button v-if="userStore.logged" type="button" @click.prevent="toggleFavorite" :class="{ saved: isFavorite }" class="btn save" :aria-pressed="isFavorite" :aria-label="isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'"></button>
    <router-link v-else :to="{name: 'user', query: {page: 'login', redirect: `/produtos/${props.productId}`}}" class="btn save" aria-label="Entre para favoritar"></router-link>
</template>

<script setup>
import { useFavoritesStore } from '@/stores/favoritesStore';
import { useUserStore } from '@/stores/UserState';
import { computed, ref } from 'vue';

const props = defineProps(['productId']);

const favoritesStore = useFavoritesStore();
const userStore = useUserStore();

const isFavorite = computed(() => favoritesStore.isFavorite(props.productId));

// Ignore clicks while a toggle is in flight, so a double click doesn't add/remove twice.
const pending = ref(false);

const toggleFavorite = async () => {
  if (pending.value) return;
  pending.value = true;
  try {
    if (isFavorite.value) {
      await favoritesStore.removeFavorite(props.productId);
    } else {
      await favoritesStore.addFavorite(props.productId);
    }
  } finally {
    pending.value = false;
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

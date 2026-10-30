<template>
    <!-- A real form: Enter and the button both submit once (before, Enter fired the search twice). -->
    <form class="search-products" role="search" @submit.prevent="searchProducts">
        <input type="text" id="search" name="search" placeholder="Pesquisar produtos" aria-label="Pesquisar produtos" v-model="search"/>
        <input class="btn primary hover search-btn" type="submit" value="" aria-label="Buscar"/>
        <button class="clear" type="button" aria-label="Limpar busca" @click="clearSearch" v-show="search"></button>
    </form>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps(['searchValue']);

const emit = defineEmits(['emitSearchProducts']);

const search = ref('');

const searchProducts = () => {
    emit('emitSearchProducts', search.value);
}

const clearSearch = () => {
    search.value = '';
    emit('emitSearchProducts', search.value);
}

// Keeps the field in sync with ?busca= (back/forward, links).
watch(() => props.searchValue, (value) => {
    search.value = value ?? '';
}, { immediate: true });
</script>

<style lang="scss" scoped>
@use '@/assets/style/main.scss' as m;

.search-products {
    display: flex;
    justify-content: center;
    align-items: stretch;
    position: relative;
    width: fit-content;
    margin: 0 auto 40px;
    @include m.media(lg) {
        width: 100%;
    }
    @include m.media(xs) {
        margin: 0 auto 20px;
    }
    input#search {
        border-color: transparent;
        margin-right: 10px;
        width: 600px;
        box-shadow: var(--shadow);
        &:focus {
            border-color: var(--primary-color);
        }
    }
    .search-btn {
        width: 60px;
        display: block;
        background-image: url('../assets/img/icons/search.png');
        background-size: 30px;
        background-repeat: no-repeat;
        background-position: center;
        @include m.media(xs) {
            background-size: 25px;
        }
        &:hover {
            background-image: url('../assets/img/icons/search-hover.png');
        }
    }
    .clear {
        width: 10px;
        height: 10px;
        background-image: url('../assets/img/icons/clear.png');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        position: absolute;
        right: 85px;
        top: 50%;
        transform: translateY(-50%);
        @include m.media(xs) {
            right: 75px;
        }
    }
}
</style>
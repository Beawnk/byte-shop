<template>
    <div class="search-products"> 
        <input type="text" id="search" name="search" placeholder="Pesquisar produtos" v-model="search" @keyup.enter.prevent="searchProducts"/>
        <input class="btn primary hover search-btn" type="submit" @click.prevent="searchProducts" @keyup.enter.prevent="searchProducts" value=""/>
        <button class="clear" @click="clearSearch" v-show="search"></button>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps(['searchValue', 'vendorName']);

const emit = defineEmits(['emitSearchProducts']);

const search = ref('');

const searchProducts = () => {
    emit('emitSearchProducts', search.value);
}

const clearSearch = () => {
    search.value = '';
    emit('emitSearchProducts', search.value);
}

watch(() => props.vendorName, (newValue) => {
    search.value = newValue;
});
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
    @include m.media(900px) {
        width: 100%;
    }
    @include m.media(540px) {
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
        @include m.media(540px) {
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
        @include m.media(540px) {
            right: 75px;
        }
    }
}
</style>
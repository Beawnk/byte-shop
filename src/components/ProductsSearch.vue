<template>
    <div class="search-products"> 
        <input type="text" id="search" name="search" placeholder="Pesquisar produtos" v-model="search" @keyup.enter.prevent="searchProducts"  />
        <input class="btn primary hover search-btn" type="submit" @click.prevent="searchProducts" @keyup.enter.prevent="searchProducts" value="Pesquisar" />
    </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['emitSearchProducts']);

const search = ref('');

const searchProducts = () => {
    emit('emitSearchProducts', search.value);
}

</script>

<style lang="scss" scoped>
.search-products {
    display: flex;
    justify-content: center;
    margin-bottom: 40px;
    align-items: stretch;
    input#search {
        border-color: transparent;
        margin-right: 10px;
        width: 40%;
        &:focus {
            border-color: var(--primary-color);
        }
    }
}
</style>
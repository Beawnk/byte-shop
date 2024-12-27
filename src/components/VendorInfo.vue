<template>
    <div class="vendor" v-if="vendor">
        <h4>Vendedor</h4>
        <div class="avatar">
            <img :src="vendor.avatar" :alt="vendor.name" />
        </div>
        <h5>{{ vendor.name }}</h5>
        <VendorRating :vendor="vendor" @click="openReviews"/>
        <router-link :to="{ name: 'products', query: { vendorProducts: JSON.stringify(vendorProducts), vendorName: vendor.name } }" class="vendor-products btn primary">Ver todos os produtos</router-link>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import VendorRating from '@/components/VendorRating.vue'
import { supabase } from '@/lib/supabaseClient'

const props = defineProps({
    vendor: {
        required: true
    }
})

const emit = defineEmits('emitOpenReviews')

const vendorProducts = ref([]);

const openReviews = () => {
    emit('emitOpenReviews')
}

const fetchVendorProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('vendor_id', props.vendor.id)
    if (error) {
        console.error(error)
    } else {
        vendorProducts.value = data
    }
}

watch(
  () => props.vendor,
  (newVendor) => {
    if (newVendor) {
      fetchVendorProducts();
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.vendor {
    background-color: var(--white-color);
    padding: 20px;
    border-radius: var(--border-radius);
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    justify-content: center;
    min-height: 350px;
    height: 100%;
    width: 100%;
    box-shadow: var(--shadow);
    h4 {
        color: var(--text-color);
        margin-bottom: 20px;
    }
    .avatar {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        overflow: hidden;
        img {
            object-fit: cover;
            width: 100%;
            height: 100%;
        }
    }
    h5 {
        color: var(--text-color);
    }
    p {
        color: var(--text-color);
    }
    .btn {
      margin-top: 10px;
    }
}
</style>
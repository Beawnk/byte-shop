<template>
  <section id="cart" class="container">
    <transition name="down" mode="out-in" appear>
      <div class="cart-page">
        <h2>Carrinho</h2>
        <p class="notice" v-if="removedNotice" role="status">{{ removedNotice }}</p>
        <div class="items" v-if="products.length">
          <div class="item" v-for="product in products" :key="product.id">
            <router-link :to="{ name: 'product', params: { id: product.id } }" class="item-link">
              <div class="img">
                <img :src="product.image_url?.[0]" :alt="product.name" loading="lazy" decoding="async" />
              </div>
              <h5>{{ product.name }}</h5>
            </router-link>
            <p class="price">{{ formatCurrency(product.price) }}</p>
            <button class="remove" type="button" :aria-label="`Remover ${product.name} do carrinho`" @click="removeProduct(product.id)"></button>
          </div>
          <div class="summary">
            <p>Total: <strong>{{ formatCurrency(total) }}</strong></p>
            <router-link :to="{ name: 'checkout' }" class="btn primary">Finalizar compra</router-link>
          </div>
        </div>
        <div class="empty" v-else-if="!loading">
          <h4>Seu carrinho está vazio</h4>
          <router-link :to="{ name: 'products' }" class="btn primary">Ver produtos</router-link>
        </div>
        <Loader v-if="loading" />
      </div>
    </transition>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import { formatCurrency } from '@/composables/formatCurrency';
import { useAlertStore } from '@/stores/alertStore';
import { useCartStore } from '@/stores/cartStore';
import { useUserStore } from '@/stores/UserState';

const alertStore = useAlertStore();
const cart = useCartStore();
const userStore = useUserStore();

const products = ref([]);
const loading = ref(false);
const removedNotice = ref('');

const total = computed(() => products.value.reduce((sum, product) => sum + Number(product.price), 0));

const fetchCart = async () => {
  if (!cart.count) return;

  loading.value = true;
  const { data, error } = await supabase.from('products').select('*').in('id', cart.ids);
  loading.value = false;

  if (error) {
    alertStore.addGlobalError('Erro ao carregar o carrinho.', error);
    return;
  }

  // Someone else may have bought an item since it was added, or the seller deleted it.
  const available = data.filter((product) => !product.sold && product.vendor_id !== userStore.user.id);
  const availableIds = available.map((product) => product.id);
  const removed = cart.ids.filter((id) => !availableIds.includes(id));

  if (removed.length) {
    cart.removeMany(removed);
    removedNotice.value = removed.length === 1
      ? 'Um produto saiu do carrinho porque não está mais disponível.'
      : `${removed.length} produtos saíram do carrinho porque não estão mais disponíveis.`;
  }

  products.value = available;
};

const removeProduct = (productId) => {
  cart.remove(productId);
  products.value = products.value.filter((product) => product.id !== productId);
};

onMounted(fetchCart);
</script>

<style lang="scss" scoped>
@use '@/assets/style/main.scss' as m;

#cart {
  .cart-page {
    position: relative;
    max-width: 900px;
    min-height: 400px;
    margin: 0 auto;
  }
  h2 {
    margin-bottom: 20px;
    color: var(--text-color);
  }
  .notice {
    margin-bottom: 20px;
    padding: 15px;
    border-radius: var(--border-radius);
    background-color: var(--white-color);
    color: var(--text-color);
  }
  .items {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .item {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 10px 20px 10px 10px;
    background-color: var(--white-color);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    .item-link {
      display: flex;
      align-items: center;
      gap: 20px;
      flex: 1;
      min-width: 0;
      &:hover h5 {
        text-decoration: underline;
      }
    }
    .img {
      flex-shrink: 0;
      width: 80px;
      height: 80px;
      border-radius: var(--border-radius);
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    h5,
    .price {
      color: var(--text-color);
    }
    .price {
      font-family: var(--ff-primary-Medium);
      white-space: nowrap;
    }
    .remove {
      flex-shrink: 0;
      width: 30px;
      height: 30px;
      background-image: url('@/assets/img/icons/remove.png');
      background-size: 20px;
      background-repeat: no-repeat;
      background-position: center;
    }
    @include m.media(xs) {
      flex-wrap: wrap;
      gap: 10px;
      .item-link {
        flex-basis: 100%;
      }
      .price {
        flex: 1;
      }
    }
  }
  .summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    margin-top: 10px;
    padding: 20px;
    background-color: var(--white-color);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    color: var(--text-color);
    font-size: var(--subtitle-small);
  }
  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    min-height: 300px;
    text-align: center;
    h4 {
      color: var(--text-color);
    }
  }
}
</style>

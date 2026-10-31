<template>
  <form class="filters" aria-label="Filtros de produtos" @submit.prevent="apply">
    <div class="field">
      <label for="price-min">Preço mínimo</label>
      <input id="price-min" type="number" min="0" step="0.01" inputmode="decimal" placeholder="R$ 0" v-model="min" />
    </div>
    <div class="field">
      <label for="price-max">Preço máximo</label>
      <input id="price-max" type="number" min="0" step="0.01" inputmode="decimal" placeholder="Sem limite" v-model="max" />
    </div>
    <div class="field">
      <label for="sort">Ordenar por</label>
      <select id="sort" v-model="sort" @change="apply">
        <option value="recentes">Mais recentes</option>
        <option value="menor">Menor preço</option>
        <option value="maior">Maior preço</option>
      </select>
    </div>
    <button class="btn primary" type="submit">Filtrar</button>
    <button class="clear" type="button" v-if="hasFilters" @click="clearFilters">Limpar</button>
  </form>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
  minPrice: {
    type: String,
    default: ''
  },
  maxPrice: {
    type: String,
    default: ''
  },
  sortBy: {
    type: String,
    default: 'recentes'
  }
})

const emit = defineEmits(['applyFilters']);

const min = ref('');
const max = ref('');
const sort = ref('recentes');

const hasFilters = computed(() => props.minPrice || props.maxPrice || props.sortBy !== 'recentes');

const apply = () => {
  emit('applyFilters', { min: String(min.value ?? ''), max: String(max.value ?? ''), sort: sort.value });
};

const clearFilters = () => {
  emit('applyFilters', { min: '', max: '', sort: 'recentes' });
};

// Keeps the fields in sync with the URL (back/forward, shared links).
watch(
  () => [props.minPrice, props.maxPrice, props.sortBy],
  ([minPrice, maxPrice, sortBy]) => {
    min.value = minPrice;
    max.value = maxPrice;
    sort.value = sortBy;
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
@use '@/assets/style/main.scss' as m;

.filters {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 40px;
  @include m.media(xs) {
    gap: 10px;
    margin-bottom: 20px;
  }
  .field {
    display: flex;
    flex-direction: column;
    gap: 5px;
    width: 170px;
    @include m.media(xs) {
      width: calc(50% - 5px);
    }
  }
  label {
    color: var(--text-color);
    font-size: var(--text-small);
  }
  input,
  select {
    width: 100%;
    height: 46px;
    padding: 12px;
    border: 1px solid transparent;
    border-radius: var(--border-radius);
    background-color: var(--white-color);
    box-shadow: var(--shadow);
    color: var(--text-color);
    font-family: var(--ff-primary);
    &:focus {
      border-color: var(--primary-color);
      outline: none;
    }
  }
  .clear {
    align-self: center;
    color: var(--primary-color);
    font-family: var(--ff-primary);
    text-decoration: underline;
  }
}
</style>

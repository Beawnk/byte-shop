<template>
  <nav class="pagination" :aria-label="label" v-if="totalPages > 1">
    <button type="button" aria-label="Página anterior" @click="$emit('change', page - 1)" :disabled="page === 1">
      <span class="arrow" aria-hidden="true">&lsaquo;</span>
      <span class="text">Anterior</span>
    </button>
    <template v-for="(item, index) in items" :key="index">
      <span v-if="item === null" aria-hidden="true">&hellip;</span>
      <button
        v-else
        type="button"
        :class="{ current: item === page }"
        :aria-label="`Página ${item}`"
        :aria-current="item === page ? 'page' : undefined"
        @click="$emit('change', item)"
      >{{ item }}</button>
    </template>
    <button type="button" aria-label="Próxima página" @click="$emit('change', page + 1)" :disabled="page === totalPages">
      <span class="text">Próxima</span>
      <span class="arrow" aria-hidden="true">&rsaquo;</span>
    </button>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { pageRange } from '@/utils/pageRange';

const props = defineProps({
  page: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  label: {
    type: String,
    default: 'Páginas'
  }
})

defineEmits(['change'])

const items = computed(() => pageRange(props.page, props.totalPages))
</script>

<style lang="scss" scoped>
@use '@/assets/style/main.scss' as m;

.pagination {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 40px;
  @include m.media(xs) {
    gap: 6px;
    margin-top: 30px;
  }
  button {
    padding: 10px 16px;
    border: 1px solid var(--gray-color);
    border-radius: var(--border-radius);
    background-color: var(--white-color);
    color: var(--text-color);
    font-family: var(--ff-primary);
    cursor: pointer;
    transition: var(--transition);
    @include m.media(xs) {
      padding: 10px 12px;
    }
    &:hover {
      background-color: var(--gray-color);
      color: var(--white-color);
    }
    &:disabled {
      opacity: 0.5;
      &:hover {
        background-color: var(--white-color);
        color: var(--text-color);
      }
    }
    &.current {
      background-color: var(--primary-color);
      border-color: var(--primary-color);
      color: var(--white-color);
    }
  }
  > span {
    font-family: var(--ff-primary);
    font-size: var(--text-medium);
    color: var(--text-color);
  }
  .arrow {
    display: none;
    @include m.media(xs) {
      display: inline;
    }
  }
  .text {
    @include m.media(xs) {
      display: none;
    }
  }
}
</style>

<template>
  <figure class="sales-chart">
    <figcaption>Vendas por mês</figcaption>
    <!-- Scrolls sideways on phones: 12 months squeezed into 300px would be unreadable. -->
    <div class="plot">
    <svg :viewBox="`0 0 ${WIDTH} ${HEIGHT}`" role="group" aria-label="Valor vendido nos últimos meses">
      <line class="baseline" :x1="PADDING" :x2="WIDTH - PADDING" :y1="BASELINE" :y2="BASELINE" />
      <g v-for="(bar, index) in bars" :key="bar.key">
        <path v-if="bar.height" class="bar" :class="{ active: active === index }" :d="bar.path" />
        <text v-if="showValue(index)" class="value" :x="bar.center" :y="BASELINE - bar.height - 8">{{ formatCurrency(bar.total) }}</text>
        <text class="month" :x="bar.center" :y="BASELINE + 20">{{ bar.label }}</text>
        <!-- Bigger than the bar: the whole column reacts to hover and keyboard focus. -->
        <rect
          class="hit-area"
          :x="bar.center - slot / 2"
          y="0"
          :width="slot"
          :height="HEIGHT"
          tabindex="0"
          role="img"
          :aria-label="`${bar.label}: ${formatCurrency(bar.total)}, ${salesLabel(bar.count)}`"
          @mouseenter="active = index"
          @mouseleave="active = null"
          @focus="active = index"
          @blur="active = null"
        />
      </g>
    </svg>
    </div>
    <details>
      <summary>Ver como tabela</summary>
      <table>
        <thead>
          <tr><th scope="col">Mês</th><th scope="col">Vendas</th><th scope="col">Valor</th></tr>
        </thead>
        <tbody>
          <tr v-for="month in monthly" :key="month.key">
            <th scope="row">{{ month.label }}</th>
            <td>{{ month.count }}</td>
            <td>{{ formatCurrency(month.total) }}</td>
          </tr>
        </tbody>
      </table>
    </details>
  </figure>
</template>

<script setup>
import { computed, ref } from 'vue';
import { formatCurrency } from '@/composables/formatCurrency';

const props = defineProps({
  monthly: {
    type: Array,
    required: true
  }
})

const WIDTH = 600;
const HEIGHT = 220;
const PADDING = 10;
const BASELINE = 190;
const TOP = 30; // Room for the value label above the tallest bar.
const BAR_WIDTH = 24;
const RADIUS = 4;

const active = ref(null);

const slot = computed(() => (WIDTH - PADDING * 2) / props.monthly.length);
const maxTotal = computed(() => Math.max(...props.monthly.map((month) => month.total)));

// Rounded at the data end, square at the baseline.
const barPath = (center, height) => {
  const left = center - BAR_WIDTH / 2;
  const right = center + BAR_WIDTH / 2;
  const top = BASELINE - height;
  const radius = Math.min(RADIUS, height);
  return `M${left} ${BASELINE}V${top + radius}Q${left} ${top} ${left + radius} ${top}H${right - radius}Q${right} ${top} ${right} ${top + radius}V${BASELINE}Z`;
};

const bars = computed(() =>
  props.monthly.map((month, index) => {
    const center = PADDING + slot.value * (index + 0.5);
    const height = maxTotal.value ? (month.total / maxTotal.value) * (BASELINE - TOP) : 0;
    return { ...month, center, height, path: barPath(center, height) };
  })
);

const peakIndex = computed(() => props.monthly.findIndex((month) => month.total === maxTotal.value));

// Labels are selective: the best month, plus whichever column is being read.
const showValue = (index) => (active.value === null ? maxTotal.value > 0 && index === peakIndex.value : active.value === index);

const salesLabel = (count) => `${count} ${count === 1 ? 'venda' : 'vendas'}`;
</script>

<style lang="scss" scoped>
.sales-chart {
  margin: 0;
  padding: 20px;
  background-color: var(--white-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  figcaption {
    margin-bottom: 10px;
    color: var(--text-color);
    font-family: var(--ff-primary-semiBold);
  }
  .plot {
    overflow-x: auto;
  }
  svg {
    display: block;
    width: 100%;
    min-width: 460px;
    height: auto;
  }
  .baseline {
    stroke: var(--gray-color);
  }
  .bar {
    fill: var(--primary-color);
    transition: var(--transition);
    &.active {
      fill: var(--secondary-color);
    }
  }
  text {
    fill: var(--text-color);
    font-family: var(--ff-primary);
    font-size: 14px;
    text-anchor: middle;
  }
  .value {
    font-family: var(--ff-primary-semiBold);
  }
  .hit-area {
    fill: transparent;
    cursor: default;
    outline: none;
    &:focus-visible {
      stroke: var(--primary-color);
      stroke-width: 2;
    }
  }
  details {
    margin-top: 10px;
    color: var(--text-color);
    font-size: var(--text-small);
  }
  summary {
    cursor: pointer;
  }
  table {
    width: 100%;
    margin-top: 10px;
    border-collapse: collapse;
  }
  th,
  td {
    padding: 6px 0;
    text-align: left;
    font-weight: normal;
    border-top: 1px solid var(--gray-color);
  }
  td:last-child {
    text-align: right;
  }
}
</style>

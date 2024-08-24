<script setup lang="ts" generic="T extends number | string">
import { defineProps, computed } from 'vue';
import { useBrowserLocale } from '../../composables/use-browser-locale';
type Numeric = number | string;

const props = withDefaults(defineProps<{
  currency?: string;
  precision?: T;
  percent?: boolean;
  value?: T;
  nullable?: boolean;
}>(), {
  nullable: false,
});

const content = computed(() => {
  const locale = useBrowserLocale()

  if (props.nullable && !props.value) {
    return '-';
  }
  const numericValue = isNaN(+(props.value ?? 0)) ? 0 : +(props.value ?? 0)
  return Intl.NumberFormat(locale, {
    style: props.percent ? 'percent' : props.currency ? 'currency' : undefined,
    currency: props.currency,
    currencyDisplay: props.currency && 'narrowSymbol',
    maximumFractionDigits: props.precision ? +props.precision : (props.percent ? 2 : 0),
  }).format(numericValue);
});
</script>
<template>
  <data class="ui number" :value="value" :class="{ empty: content === '-' }">{{ content }}</data>
</template>
<style>
.ui.number {
  font-variant-numeric: slashed-zero tabular-nums;

  &.empty {
    color: #d1d5db;
  }
}
</style>
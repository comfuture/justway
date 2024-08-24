<script setup lang="ts">
import { defineProps, computed, inject, unref } from 'vue';
import { type DateLike, parseDate, formatDate, useBrowserLocale } from '#imports';

const props = withDefaults(defineProps<{
  value?: DateLike,
  month?: boolean,
  time?: boolean | 'auto'
  relative?: boolean,
}>(), {
  time: 'auto'
})
const locale = inject<string>('locale', useBrowserLocale())
const dateValue = computed(() => parseDate(props.value));
const dateString = computed(() => formatDate(props.value, {
  locale: unref(locale),
  time: props.time,
  relative: props.relative,
}))
</script>
<template>
  <time :datetime="dateValue?.toISOString()">{{ dateString }}</time>
</template>
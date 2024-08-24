<script setup lang="ts">
import { ref } from 'vue'

const thisMonth = new Date()
thisMonth.setDate(1)
thisMonth.setHours(0, 0, 0, 0)
const nextMonth = new Date(thisMonth)
nextMonth.setMonth(nextMonth.getMonth() + 1)

const popoverShown = ref(false)
const dateRange = defineModel<[Date, Date]>({
  required: false,
  default: () => {
    const start = new Date()
    start.setHours(0, 0, 0, 0)
    const end = new Date(start)
    end.setDate(start.getDate() + 1)
    return [start, end]
  }
})
const show = () => {
  popoverShown.value = true
}
</script>
<template>
  <ui-popover v-model="popoverShown">
    <template #trigger>
      <ui-input @focus="show" />
    </template>
    <div class="ui date-range-selector">
      <ui-calendar range v-model="dateRange" :month="thisMonth" />
      <ui-calendar range v-model="dateRange" :month="nextMonth" />
    </div>
  </ui-popover>
</template>
<style>
.ui.date-range-selector {
  background-color: var(--ui-panel-bg);
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3);
  border-radius: var(--ui-border-radius);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}
</style>
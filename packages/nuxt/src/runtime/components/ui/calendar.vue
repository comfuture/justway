<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import { isValidDateLike } from '../../util/date'

export type DateLike = Date | string | number;
type CalendarValue = DateLike | [DateLike, DateLike] // | { start: DateLike, end: DateLike }

const props = withDefaults(defineProps<{
  month?: DateLike
  range?: boolean
}>(), {
  range: false
})
/**
 * refers to the selected date(s)  
 * it can be a single date or a range of dates
 */
const selected = defineModel<CalendarValue>({
  required: false,
})

const isDateRange = (dates: unknown): dates is [DateLike, DateLike] => {
  return Array.isArray(dates) && dates?.length === 2 && dates.every(d => isValidDateLike(d))
}

/**
 * refers to the month to display  
 * if not specified,
 * it will be automatically try to set to the selected date or today
 */
const month = ref<DateLike>((() => {
  if (props.month) { // if month is specified, use it
    return props.month
  }
  if (selected.value !== undefined) {
    if (isDateRange(selected.value)) {
      return selected.value[0]
    } else if (isValidDateLike(selected.value)) {
      return selected.value
    }
  }
  return new Date() // fallback to today
})())

/** whether the selected date is a range */
const isRange = computed(() => props.range || Array.isArray(selected.value) && selected.value.length === 2)

const emit = defineEmits<{
  (event: 'click:date', value: DateLike): void
  (event: 'select', value: CalendarValue | undefined): void
}>()

/** language */
const lang = ref(inject('LOCALE', globalThis.navigator?.language ?? 'en'))

/** date casted from month */
const monthValue = computed(() => new Date(month.value))

/** month in ISO format */
const isoMonth = computed({
  get: () => {
    return monthValue.value.toISOString().substring(0, 7)
  },
  set: (v: DateLike) => {
    // XXX prevent delete date. we can not hide 'Remove' button from input[type=month]
    // if date deleted, set as today
    if (v === '') {
      // selected.value = undefined // XXX: instead of delete month, reset the selected date
      v = new Date().toISOString().substring(0, 10)
    }
    month.value = new Date(v)
  }
})

/** first day of the month */
const firstDay = computed(() => new Date(monthValue.value.getFullYear(), monthValue.value.getMonth(), 1).getDay())

/** number of days in the month */
const numDays = computed<number>(() => new Date(monthValue.value.getFullYear(), monthValue.value.getMonth() + 1, 0).getDate())
const days = computed<number[]>(() => Array(numDays.value).fill(0).map((_, i) => i + 1))

/** short weekday names of the current locale */
const weekdays = computed(() => {
  const weekdayFormatter = new Intl.DateTimeFormat(lang.value, {
    weekday: 'short'
  })
  return Array(7).fill(0).map((_, i) => {
    const d = new Date(2021, 7, i + 1)
    return weekdayFormatter.format(d)
  })
})

/** formatted month to display */
const displayMonth = computed(() => new Intl.DateTimeFormat(lang.value, {
  year: 'numeric', month: 'short'
}).format(monthValue.value))
const isToday = (d: number): boolean => {
  return monthValue.value.getMonth() === new Date().getMonth() && d === new Date().getDate()
}

/** whether the day is selected */
const isSelected = (d: number): boolean => {
  const date = new Date(monthValue.value.getFullYear(), monthValue.value.getMonth(), d)
  if (Array.isArray(selected.value)) {
    try {
      const [start, end] = selected.value.map(d => new Date(d))
      end.setHours(23, 59, 59, 999)
      return date >= start && date <= end
    } catch (e) {
      return false
    }
  } else {
    try {
      const start = new Date(selected.value as DateLike)
      return monthValue.value.getMonth() === start.getMonth() && d === start.getDate()
    } catch (e) {
      return false
    }
  }
}

/** click counter for range selection */
const nthClick = ref(0)
const isSelecting = ref(false)

/** click handler for day */
const handleClickDay = (d: number) => {
  emit('click:date', new Date(monthValue.value.getFullYear(), monthValue.value.getMonth(), d))
  if (isRange.value) { // ranged
    const clickedDate = new Date(monthValue.value.getFullYear(), monthValue.value.getMonth(), d)
    if (nthClick.value === 0) {
      selected.value = [clickedDate, clickedDate]
      nthClick.value = 1
      isSelecting.value = true
    } else if (nthClick.value === 1) {
      (selected.value as [Date, Date])[1] = clickedDate
      // if the second click is before the first click, swap them
      const [d1, d2] = selected.value as [Date, Date]
      if (d1 > d2) {
        selected.value = [d2, d1]
      }
      nthClick.value = 0
      isSelecting.value = false
      emit('select', selected.value)
    }
  } else {
    const newValue = new Date(monthValue.value.getFullYear(), monthValue.value.getMonth(), d)
    selected.value = newValue
    emit('select', newValue)
  }
}

/** mousemove handler for day */
const handleMouseMove = (d: number) => {
  const candidate = new Date(monthValue.value.getFullYear(), monthValue.value.getMonth(), d)
  if (nthClick.value === 1) {
    (selected.value as [Date, Date])[1] = candidate
  }
}

/** click handler for prev month button */
const prevMonth = () => {
  monthValue.value.setMonth(monthValue.value.getMonth() - 1)
  month.value = monthValue.value.toISOString().substring(0, 10)
}

/** click handler for next month button */
const nextMonth = () => {
  monthValue.value.setMonth(monthValue.value.getMonth() + 1)
  month.value = monthValue.value.toISOString().substring(0, 10)
}
</script>
<template>
  <div class="ui calendar">
    <slot name="header">
      <header>
        <ui-button @click="prevMonth" icon="chevron_left" />
        <h1>
          {{ displayMonth }}
          <input ref="picker" v-model="isoMonth" type="month">
        </h1>
        <ui-button @click="nextMonth" icon="chevron_right" />
      </header>
    </slot>
    <div class="weekdays">
      <div class="weekday" v-for="weekday in weekdays" :key="weekday">{{ weekday }}</div>
    </div>
    <div class="days">
      <kbd class="empty" v-for="_ in firstDay" :key="_" />
      <kbd :class="{ today: isToday(day), selected: isSelected(day), selecting: isSelecting && isSelected(day) }"
        :aria-selected="isSelected(day)" @click="handleClickDay(day)"
        @mousemove="nthClick > 0 && isSelecting && handleMouseMove(day)" v-for="day in days" :key="day">
        {{ day }}
      </kbd>
    </div>
  </div>
</template>
<style>
.ui.calendar {
  --weekday-text-color: #5a5a5a;

  display: inline-block;
  padding: 0.5rem;

  >header {
    /* @apply flex flex-row justify-center; */
    display: flex;
    flex-direction: row;
    justify-content: center;

    h1 {
      /* @apply text-base font-semibold my-1 flex-1 text-center relative; */
      font-size: 1rem;
      font-weight: 600;
      margin: 0.25rem 0;
      flex: 1;
      text-align: center;
      position: relative;


      [type="month"] {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
        box-sizing: border-box;

        &::-webkit-calendar-picker-indicator {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          cursor: pointer;
        }
      }
    }

    button.ui {
      i {
        margin: 0;
      }
    }
  }

  .weekdays {
    /* @apply flex flex-row my-1; */
    display: flex;
    flex-direction: row;
    margin: 0.25rem 0;

    .weekday {
      /* @apply flex-1 text-center text-gray-500; */
      flex: 1;
      text-align: center;
      color: var(--weekday-text-color);
    }
  }

  .days {
    /* @apply grid grid-cols-7 gap-y-1; */
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0.25rem 0;

    kbd {
      /* @apply px-2 py-0.5 text-sm text-right font-mono proportional-nums;
      @apply flex flex-col justify-center cursor-pointer; */
      padding: 0.125rem 0.25rem;
      font-size: 0.875rem;
      text-align: right;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      font-variant-numeric: proportional-nums;
      display: flex;
      flex-direction: column;
      justify-content: center;
      cursor: pointer;

      &.empty {
        /* @apply cursor-default; */
        cursor: default;
      }

      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }

      &.today {
        /* @apply font-bold; */
        font-weight: 700;
        color: rgba(0, 0, 0, 0.87);
      }

      &.selected {
        /* @apply bg-pink-500 text-white; */
        /* @apply bg-primary text-white; */
        color: white;
        background-color: var(--ui-text-selection-color);
      }

      &.selecting {
        /* @apply bg-pink-500/50; */
        /* @apply bg-primary/50; */
        background-color: var(--ui-text-selection-color);
      }
    }
  }
}
</style>
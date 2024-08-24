<script setup lang="ts">
const props = defineProps<{
  columns?: string[];
  data?: any[];
  bordered?: boolean;
}>()

</script>
<template>
  <table class="ui table" :class="{ bordered }">
    <thead>
      <tr>
        <slot name="header">
          <template v-if="columns && columns.length > 0">
            <th v-for="column in columns">{{ column }}</th>
          </template>
        </slot>
      </tr>
    </thead>
    <tbody>
      <slot>
        <template v-if="data && data.length > 0">
          <tr v-for="row in data">
            <td v-for="column in columns">{{ row[column] }}</td>
          </tr>
        </template>
      </slot>
    </tbody>
    <tfoot>
      <slot name="footer"></slot>
    </tfoot>
  </table>
</template>
<style lang="postcss">
.ui.table {
  @apply w-full;

  &.bordered {
    thead {
      @apply border-t border-l border-r border-gray-200 rounded-t;
    }

    tbody {
      @apply border-l border-r border-gray-200;
    }

    tfoot {
      @apply border-l border-r border-b border-gray-200 rounded-b;
    }
  }

  thead {
    @apply bg-gray-200;

    th {
      @apply font-semibold p-2 text-left;

      &.number {
        @apply text-right;
      }
    }
  }

  tbody,
  tfoot {
    tr {
      &:nth-child(even) {
        /* @apply bg-gray-50; */
      }
    }

    td {
      @apply p-2;

      &.number {
        @apply text-right;
      }
    }
  }

  tfoot {
    @apply bg-gray-200;
  }

  @media print {

    th,
    td {
      @apply border-gray-300 border bg-white;
    }
  }
}
</style>
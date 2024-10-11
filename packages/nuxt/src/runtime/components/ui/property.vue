<script setup lang="ts">
defineProps<{
  label?: string;
}>();
</script>
<template>
  <div class="ui property">
    <div class="label">{{ label }}</div>
    <div class="value">
      <slot />
    </div>
  </div>
</template>
<style lang="postcss">
.ui.property {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  .label {
    font-size: 0.875rem;
    color: #a0aec0;
  }

  .value {
    font-weight: 600;
  }
}

.tabular {
  .ui.property {
    display: table-row;

    >* {
      display: table-cell;
      padding: 0.25rem 0.5rem 0.25rem 0;
      word-break: keep-all;

      &.label {
        width: 1%;
        white-space: nowrap;
        text-align: right;
      }

      &.value {
        /* width: 100%; */
      }
    }
  }
}
</style>
<script setup lang="ts">
import { provide } from 'vue';
import { useId } from '#imports';

const props = defineProps<{
  segment?: boolean
  name?: string
}>();
const groupId = props.name ?? useId();
provide('accordionGroup', groupId);
provide('container', 'ui-accordion');
</script>
<template>
  <div class="ui accordion" :class="{ segment }">
    <slot :group="groupId" />
  </div>
</template>
<style>
.ui.accordion {
  display: flex;
  flex-direction: column;

  &.segment {
    background-color: var(--ui-panel-bg);
    border-radius: 0.25rem;

    summary {
      font-weight: 600;
      padding: 0.5rem;
      border-bottom: 1px solid var(--ui-border-color);
    }
  }

  details {
    summary {
      border-radius: 0.25rem 0.25rem 0 0;
      list-style: none;
      cursor: pointer;
      transition: margin 0.15s ease-out;
    }

    &[open] {
      summary {
        margin-bottom: 10px;
      }

      &+details>summary {
        border-top: 1px solid var(--ui-border-color);
      }
    }

    &:not([open]):last-child summary {
      margin-bottom: 0;
      border-bottom: 0;
    }

    .content {
      padding: 0.5rem;
    }
  }
}
</style>
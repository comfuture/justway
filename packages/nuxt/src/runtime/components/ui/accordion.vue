<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import '@justway/ui/style/accordion.css';
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

<script setup lang="ts">
import type { RouteLocation, RouteLocationRaw } from "#vue-router";
import { resolveComponent } from "#imports";

const props = withDefaults(defineProps<{
  defaultTag?: string
  to?: string | RouteLocation | RouteLocationRaw
  href?: string
}>(), {
  defaultTag: 'div'
})

const Tag = props.to || props.href ? resolveComponent('NuxtLink') : props.defaultTag;
</script>
<template>
  <component :is="Tag" :href="href" :to="to" v-bind="$attrs">
    <slot />
  </component>
</template>
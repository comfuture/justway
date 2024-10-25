<script setup lang="ts" generic="T extends Breadcrumb[]">
import "@justway/ui/style/breadcrumb.css";
import { h } from 'vue'

export type BreadcrumbItem = {
  label: string
  href?: string
} | string

const props = withDefaults(defineProps<{
  items?: T
}>(), {
  items: []
})

const renderItem = (def: BreadcrumbItem) => {
  const isString = (val: unknown): val is string => typeof val === 'string'
  const isObject = (val: unknown): val is BreadcrumbItem => typeof val === 'object'

  if (isString(def)) {
    return h('li', { 'aria-current': 'page' }, def)
    // return <li aria - current="page" > { def } </li>
  }

  if (isObject(def)) {
    return h('li', {}, h('a', { href: def.href }, def.label))
    // return <li><a href={ def.href }> { def.label } < /a></li >
  }
  return null
}
</script>

<template>
  <nav class="ui breadcrumb" aria-label="Breadcrumb">
    <ol>
      <slot>
        <template v-for="item in props.items">
          {{ renderItem(item) }}
        </template>
      </slot>
    </ol>
  </nav>
</template>

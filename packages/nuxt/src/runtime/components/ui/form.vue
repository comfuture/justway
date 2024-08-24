<script setup lang="ts">
import { computed } from 'vue';
import type { JSONSchema4 } from 'json-schema';
import { getFieldDefintions } from '../../util/form'

const props = defineProps<{
  schema?: JSONSchema4;
}>();

const model = defineModel<Record<string, any>>({
  default: () => ({}),
});

const fields = getFieldDefintions(props.schema ?? {})
const getInitialValue = (name: string) => {
  return model.value[name] ?? fields.find((field) => field.name === name)?.default
}
</script>
<template>
  <form class="ui form">
    {{ model }}
    <slot>
      <ui-form-field v-for="field in fields" :key="field.name" v-bind="field" v-model="model[field.name]"
        :initial-value="getInitialValue(field.name)" />
    </slot>
  </form>
</template>
<style>
.ui.form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &.tabular {
    display: table;
  }
}
</style>
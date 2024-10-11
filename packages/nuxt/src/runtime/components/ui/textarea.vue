<template>
  <ui-input v-bind="$attrs" #="{ attrs, id, value, onInput }">
    <textarea v-bind="attrs" :id :value @input="onInput"></textarea>
  </ui-input>
</template>

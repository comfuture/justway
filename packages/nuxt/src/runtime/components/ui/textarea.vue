<template>
  <ui-input v-bind="$attrs" #="{ attrs, id, value, onInput }">
    <textarea v-bind="attrs" :id :value @input="onInput" />
  </ui-input>
</template>

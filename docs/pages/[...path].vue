<script setup lang="ts">
definePageMeta({
  pageTransition: true
})
</script>
<template>
  <div>
    <ContentDoc />
    <nuxt-link to="/component/button">Button component</nuxt-link>
  </div>
</template>
<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>

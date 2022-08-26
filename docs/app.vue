<script setup lang="ts">
import '@justway/ui/theme/default.css'
import { UIButton } from "@justway/vue";
</script>
<template>
  <nuxt-layout name="default">
    <nuxt-page />
    <UIButton class="secondary bordered">This is button</UIButton>
  </nuxt-layout>
</template>

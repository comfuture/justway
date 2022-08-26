<script setup lang="ts">
import '@justway/ui/theme/default.css';
import UiAlert from './components/alert.vue';
// import UiButton from './components/button.vue';
// import UiButton from './components/button.vue';
import './components/button.vue';
import UiTab from './components/tab.vue';
</script>

<template>
  <ui-alert>Alert!</ui-alert>
  <div style="display: flex; gap: 0.2em">
    <!-- <ui-button>Hello</ui-button>
    <ui-button class="primary">Hello world this is button</ui-button> -->
    <button class="ui secondary">this is also button</button>
  </div>

  <ui-tab>
    <li>Item 1</li>
    <li class="active">Item 2</li>
    <li>Item 3</li>
    <a href="#" class="active">Item 4</a>
  </ui-tab>

</template>
<style>
aside {
  position: fixed;
  top: 0;
  left: 0;
  width: 200px;
  height: 100%;
  background: #777;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
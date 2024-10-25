<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useTimeoutFn } from '@vueuse/core';
import { messages, type ToastMessage } from '../../composables/use-toast'

const container = ref<HTMLElement>()
const iconName = (type: string) => {
  if (type === 'success') return 'check_circle';
  return type;
}

watchEffect(() => {
  // to bring the toast container to front when messages changed
  if (messages.value.length > 0) {
    container.value?.hidePopover()
    container.value?.showPopover()
  } else {
    // to hide the toast container when messages are empty
    useTimeoutFn(() => {
      container.value?.hidePopover()
    }, 500)
  }
})
</script>
<template>
  <div popover="manual" ref="container" class="ui toast">
    <transition-group name="toast" @after-leave="">
      <ui-item v-for="message in messages" :key="message.id">
        <template #leading>
          <ui-icon :name="iconName(message.type)" :class="message.type" />
        </template>
        <h3 v-if="message.title">{{ message.title }}</h3>
        <p>{{ message.message }}</p>
      </ui-item>
    </transition-group>
  </div>
</template>
<style>
.toast-enter-from {
  transform: translateY(-30px);

  /* @screen md {
    transform: translateY(0) translateX(30px);
  } */

  @media(min-width: 768px) {
    transform: translateY(0) translateX(30px);
  }

  @media(prefers-reduced-motion: no-preference) {
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
}

.toast-leave-to {
  opacity: 0.7;
  transform: scale(0.5);
}

.toast-leave-active {
  position: absolute;
}

.ui.toast {
  /* --ui- */
  /* @apply mr-0 mt-0 p-4 bg-transparent; */
  margin-right: 0;
  margin-top: 0;
  padding: 1rem;
  background-color: transparent;
  border: 0;

  &:popover-open {
    /* @apply flex flex-col gap-3 top-0 bottom-0 right-0; */
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    top: 0;
    bottom: 0;
    right: 0;
  }

  >.ui.item {
    transition: all 0.125s ease-out;
    /* @apply border-gray-200/70 bg-white/70 backdrop-blur rounded shadow-lg p-4 min-w-full select-none; */
    /* border: 1px solid rgba(209, 213, 219, 0.5); */
    background-color: var(--ui-panel-bg);
    backdrop-filter: blur(2px);
    border-radius: var(--ui-border-radius);
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.3);
    padding: 1rem;
    /* min-width: 20rem; */
    width: 20rem;
    user-select: none;

    >i.material-symbols-outlined {
      color: #5555ff;

      &.success {
        color: #10b981;
      }

      &.error {
        color: #ef4444;
      }

      &.warning {
        color: #f59e0b;
      }
    }
  }
}
</style>
<script setup lang="ts">
import { ref, watchEffect, nextTick, onMounted, provide, computed } from 'vue'
import { resolveComponent, useId } from '#imports';
// TODO: implement keep-alive
const props = defineProps<{
  title?: string
  lazy?: boolean
  form?: boolean | Record<string, any>
}>()

const open = defineModel<boolean>({
  required: false,
  default: false,
})

const contentTag = computed(() => props.form ? resolveComponent('ui-form') : 'section')
const formId = ref(props.form ? useId() : undefined)

const contentAttrs = ref<Record<string, any>>({
  id: formId.value,
})

provide('container', 'ui-modal')
provide('modalOpen', open)

const renderHTML = ref<boolean>(!!!props.lazy)
const emit = defineEmits<{
  open: []
  close: []
  submit: [event: SubmitEvent]
}>()

const dialog = ref<HTMLDialogElement>()
const openFunc = () => {
  renderHTML.value = true
  open.value = true
}
const closeFunc = () => {
  open.value = false
  dialog.value?.addEventListener('close', closeFunc)
}

watchEffect(() => {
  if (open.value) {
    nextTick(() => {
      dialog.value?.showModal()
      dialog.value?.addEventListener('close', closeFunc)
    })
  } else {
    dialog.value?.close()
  }
})

onMounted(() => {
  /** sync modal visibility with open prop when user close the modal */
  dialog.value?.addEventListener('animationend', () => {
    open.value ? emit('open') : emit('close');
  })
})
</script>
<template>
  <slot name="trigger" :open="openFunc" />
  <dialog class="ui modal" ref="dialog" v-if="renderHTML">
    <header>
      <h3>
        <slot name="header">{{ title }}</slot>
      </h3>
      <ui-icon class="close" name="close" @click="closeFunc" />
    </header>
    <component :is="contentTag" ref="content" class="content" v-bind="contentAttrs"
      @submit="($ev: SubmitEvent) => emit('submit', $ev)">
      <slot :open="openFunc" :close="closeFunc"></slot>
    </component>
    <section class="actions" v-if="$slots.actions">
      <slot name="actions" :close="closeFunc" :form-id="formId"></slot>
    </section>
  </dialog>
</template>
<style lang="postcss">
@keyframes appear {
  0% {
    opacity: 0;
    transform: scale(.75);
  }

  95% {
    transform: scale(1.02);
  }

  100% {
    opacity: 1;
    transform: scale(1.0);
  }
}

@keyframe slide-in {
  0% {
    transform: translateY(-20px);
    opacity: 0;
  }

  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

:root.dark {
  --ui-modal-bg: #2d3748;
  --ui-modal-text: #e2e8f0;
  --ui-modal-border: #4a5568;
}

.ui.modal {
  background-color: var(--ui-panel-bg, canvas);
  box-shadow: 0 0 1rem rgba(0, 0, 0, .2);
  overflow-y: auto;
  padding: 0;
  width: fit-content;
  min-width: calc(100vw - 2rem);
  max-width: calc(100vw - 2rem);
  border-radius: var(--ui-border-radius);

  &:focus {
    outline: none;
  }

  &:not(.confirm) {
    /* margin-top: 2rem; */
    /* @apply mt-8 md:mt-auto; */
  }

  @media (min-width: 768px) {
    min-width: 200px;
  }

  @media (min-width: 1024px) {
    min-width: 300px;
  }

  &[open] {
    animation: appear 0.125s ease-out normal;
    /* animation: slide-in 1.125s ease-in-out normal; */

    @screen md {
      animation: appear 0.125s ease-out normal;
    }
  }

  >header {
    padding: 0.5rem;
    border-bottom: 1px solid var(--ui-border-color);
    position: sticky;
    top: 0;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* @apply p-2 border-b border-gray-200 sticky top-0 font-bold;
    @apply flex justify-between items-center; */

    h3 {
      display: inline-flex;
      gap: 0.5rem;
      /* @apply flex gap-2; */
    }

    i.close {
      cursor: pointer;
      /* @apply cursor-pointer; */
    }
  }

  >section.content,
  >form.content {
    padding: 0.5rem;
    min-height: 1rem;
    /* @apply p-2 min-h-[1rem]; */
  }

  >.actions {
    padding: 0.5rem 0.25rem;
    border-top: 1px solid var(--ui-border-color);
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    /* @apply py-1 px-2 border-t border-gray-200 flex justify-end gap-2 sticky bottom-0 bg-white; */
  }

  &::backdrop {
    background-color: var(--ui-backdrop-color, rgba(0, 0, 0, 0.2));
    /* @apply bg-black/30; */
    backdrop-filter: blur(1px);
  }
}
</style>
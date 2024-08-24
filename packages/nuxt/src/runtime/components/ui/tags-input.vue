<script setup lang="ts">
import { ref, watch, nextTick, computed } from '#imports'

type CandidateCallback = (keyword: string) => Promise<string[]>

const props = defineProps<{
  candidates?: string[] | CandidateCallback
}>()

const tags = defineModel<string[]>({
  default: [],
})
const tag = ref('')
const input = ref<HTMLInputElement>()
const isDeleting = ref(false)

const filteredCandidates = ref<string[]>([])

const hasCarrot = (index: number) => {
  return tag.value === '' && isDeleting.value && index === tags.value.length - 1
}

const removeTag = (index: number) => {
  console.log('removeTag', index)
  tags.value.splice(index, 1)
  tags.value = [...tags.value] // trigger reactivity
  input.value?.focus()
}

const tryRemoveLastTag = () => {
  if (tag.value === '') {
    // when input is empty but not selected the last tag, then mark as (start) deleting
    if (!isDeleting.value) {
      isDeleting.value = true
      return
    }
    tags.value.splice(-1, 1)
    tags.value = [...tags.value] // trigger reactivity
    nextTick(() => {
      isDeleting.value = true
    })
  } else {
    isDeleting.value = false
  }

}

const addTag = () => {
  if (tag.value.trim() === '') return
  if (tags.value.includes(tag.value)) {
    tag.value = ''
    return
  }
  tag.value = input.value?.value || tag.value // XXX: hack IME automata bugs in multibyte languages
  tags.value.push(tag.value)
  tag.value = ''
  isDeleting.value = false
}

const handleInput = (ev: KeyboardEvent) => {
  if (ev.code === "Comma") {
    ev.preventDefault()
    ev.stopImmediatePropagation()
    if (input.value) {
      // TODO: support Japanese IME
      input.value.value = tag.value = input.value?.value.replace(/(,|、)$/g, '')
    }
    addTag()
  }
}

watch(() => tags.value, () => {
  isDeleting.value = false
})
</script>
<template>
  <div class="ui tags-input">
    <kbd :class="['tag', { focused: hasCarrot(i) }]" v-for="(tag, i) in tags" :key="tag">
      <span>{{ tag }}</span>
      <button @click.prevent="removeTag(i)">x</button>
    </kbd>
    <input ref="input" type="text" v-model="tag" @keydown.enter.prevent="addTag" @keyup="handleInput"
      @keydown.delete="tryRemoveLastTag">
  </div>
  <menu popover="manual">
    <slot></slot>
  </menu>
</template>
<style>
.ui.tags-input {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  align-items: center;
  border: 1px solid #ccc;
  padding: var(--ui-border-radius, 0.25rem);
  border-radius: 5px;

  &:focus-within {
    border-color: var(--ui-outline-color);
    border-width: 2px;
    border-collapse: separate;
  }

  input[type="text"] {
    flex: 1;
    outline: none;
  }

  kbd.tag {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.125rem 0.25rem;
    border-radius: 5px;
    background: var(--tag-bg, ButtonFace);
    color: var(--tag-text, ButtonText);
    font-size: 0.9rem;
    font-weight: 500;

    &.focused {
      background: color-mix(in lab, var(--tag-bg, ButtonFace) 80%, black 20%);
    }
  }
}
</style>
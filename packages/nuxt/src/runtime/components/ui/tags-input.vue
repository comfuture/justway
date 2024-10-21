<script setup lang="ts">
import { ref, computed, watch, nextTick, useAttrs, useId, type MaybeRef } from 'vue'
import { useDebounceFn } from '@vueuse/core'

type CandidateCallback = (keyword: string) => Promise<string[]>

const props = defineProps<{
  candidates?: MaybeRef<string[]> | CandidateCallback | MaybeRef<string>
  label?: string
  placeholder?: string
}>()

const attrs: Record<string, unknown> = { ...useAttrs() }

const tags = defineModel<string[]>({
  default: [],
})
const id = ref(attrs.id ?? useId())
const tag = ref('')
const input = ref<HTMLInputElement>()
const dropdown = ref<HTMLMenuElement>()
const isDeleting = ref(false)

const filteredCandidates = ref<string[]>([])
const focusIndex = ref(-1)
const dropdownVisible = computed(() => filteredCandidates.value.length > 0)
const computedPlaceholder = computed(() => tags.value.length === 0 ? props.placeholder : '')

const hasCaret = (index: number) => {
  return tag.value === '' && isDeleting.value && index === tags.value.length - 1
}

const removeTag = (index: number) => {
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
    removeTag(tags.value.length - 1)
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

const commit = (value: string) => {
  input.value?.focus()
  if (!value) return
  tags.value.push(value)
  filteredCandidates.value = []
  tag.value = ''
  isDeleting.value = false
}

const updateCandidates = useDebounceFn(async () => {
  if (!input.value?.value?.length) return
  if (typeof props.candidates === 'function') {
    const candidates = await props.candidates(input.value?.value ?? '')
    filteredCandidates.value = candidates.filter(v => !tags.value.includes(v))
  } else if (Array.isArray(props.candidates)) {
    filteredCandidates.value = props.candidates.filter(v => !tags.value.includes(v))
  } else {
    const url = `${props.candidates}`.replace('{keyword}', input.value?.value ?? '')
    const r = await $fetch<{ candidates: string[] }>(url)
    filteredCandidates.value = r.candidates.filter(v => !tags.value.includes(v))
  }
  focusIndex.value = -1
}, 100)

const handleInput = (ev: KeyboardEvent) => {
  if (ev.code === "Comma") {
    ev.preventDefault()
    ev.stopImmediatePropagation()
    if (input.value) {
      // TODO: support Japanese IME
      input.value.value = tag.value = input.value?.value.replace(/(,|、)$/g, '')
    }
    return addTag()
  }
  if (ev.code.startsWith("Arrow")) return
  updateCandidates()
}

const handleKeyDown = (ev: KeyboardEvent) => {
  if (ev.code === "ArrowDown") {
    ev.preventDefault()
    focusIndex.value = Math.min(focusIndex.value + 1, filteredCandidates.value.length - 1)
  } else if (ev.code === "ArrowUp") {
    ev.preventDefault()
    focusIndex.value = Math.max(focusIndex.value - 1, -1)
  } else if (ev.code === "Enter") {
    ev.preventDefault()
    if (focusIndex.value >= 0) {
      commit(filteredCandidates.value[focusIndex.value])
    } else {
      addTag()
    }
  }
}

const handleBlur = () => {
  setTimeout(() => {
    tag.value = ''
    filteredCandidates.value = []
  }, 100)
}


watch(() => tags.value, () => {
  isDeleting.value = false
})

// watch(dropdownVisible, (value: boolean) => {
//   if (value) {
//     nextTick(() => {
//       dropdown.value?.showPopover()
//     })
//   } else {
//     dropdown.value?.hidePopover()
//   }
// })
</script>
<template>
  <div class="ui wrapper">
    <label v-if="label" :for="id as string">
      <slot>
        {{ label }}
      </slot>
    </label>
    <div class="ui tags-input" :class="{ expanded: dropdownVisible }">
      <kbd :class="['tag', { focused: hasCaret(i) }]" v-for="(tag, i) in tags" :key="tag">
        <span>{{ tag }}</span>
        <button class="delete" @click.prevent="removeTag(i)" tabindex="-1">x</button>
      </kbd>
      <input ref="input" :id="id as string" type="search" v-model="tag" @keyup="handleInput" @keydown="handleKeyDown"
        :placeholder="computedPlaceholder" @keydown.delete="tryRemoveLastTag" @blur="handleBlur">
    </div>
    <menu ref="dropdown" v-show="dropdownVisible" aria-label="candidates">
      <ul>
        <li v-for="(candidate, i) in filteredCandidates" :key="candidate" role="option" @click="commit(candidate)"
          @mouseover="focusIndex = i" class="cursor-pointer" :aria-selected="i === focusIndex">
          {{ candidate }}
        </li>
      </ul>
    </menu>
  </div>
</template>
<style>
.ui.wrapper {
  position: relative;
}

.ui.tags-input {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  align-items: center;
  border: 1px solid #ccc;
  padding: var(--ui-border-radius, 0.25rem);
  border-radius: 5px;

  &.expanded {
    border-bottom-width: 0;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  &:focus-within {
    border-color: var(--ui-outline-color);
    border-width: 2px;
    border-collapse: separate;
  }

  input[type="search"] {
    flex: 1;
    outline: none;
    border: none;
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

    button.delete {
      border-radius: 50%;
      width: 0.75rem;
      background: transparent;
      color: var(--tag-text, ButtonText);
      font-size: 0.75rem;
      cursor: pointer;
    }
  }

  +menu {
    width: 100%;
    position: absolute;
    z-index: 100;
    min-height: fit-content;
    max-height: 200px;
    overflow-y: auto;
    background: white;
    border: 1px solid #ccc;
    border-top-width: 0;
    border-radius: 0 0 5px 5px;
    padding: 0.25rem;

    [aria-selected="true"] {
      background: var(--ui-outline-color, Highlight);
    }
  }
}
</style>
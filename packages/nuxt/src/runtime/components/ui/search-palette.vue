<script setup lang="ts">
import { onClickOutside } from '@vueuse/core';
import { ref, computed, onMounted, useId, useSlots } from '#imports';

type SearchCandidate = {
  id: string;
  name: string;
  description?: string;
  [key: string]: any;
};

const props = withDefaults(defineProps<{
  placeholder?: string;
  incremental?: boolean;
  hotkey?: string;
}>(), {
  placeholder: 'Search',
  incremental: true,
});

const emit = defineEmits<{
  (event: 'search', value: string): void;
  (event: 'select', value: SearchCandidate): void;
}>();

const candidates = ref<SearchCandidate[]>([
  { id: '1', name: 'First', description: 'First Description', icon: 'star' },
  { id: '2', name: 'Second', description: 'Second Description' },
  { id: '3', name: 'Third', description: 'Third Description' },
]);
const filteredCandidates = ref<SearchCandidate[]>(candidates.value);
const selectedIndex = ref<number>(-1);

const inputId = useId()
const slots = useSlots()
const popoverProp = computed<'manual' | undefined>(() => {
  if (slots.trigger) {
    return 'manual';
  }
  return undefined;
});

onMounted(() => {
  document.addEventListener("keyup", (e: KeyboardEvent) => {
    if (e.key === 'k' && e.ctrlKey) {
      open();
    }
    // if (e.key !== "/" || e.ctrlKey || e.metaKey) return;
    // if (/^(?:input|textarea|select|button)$/i.test(e.target.tagName)) return;

    // e.preventDefault();
    // document.getElementById("search").focus();
  });
})

const self = ref<HTMLElement>();
const search = ref<HTMLInputElement>();

const open = () => {
  self.value?.showPopover();
  search.value?.focus();
};

// const filteredCandidates = computed(() => {
//   const q = search.value?.value ?? '';
//   return candidates.value.filter(candidate => (
//     candidate.name.toLowerCase().includes(q) || candidate.description.toLowerCase().includes(q)
//   ));
// });

const handleSearch = (ev: Event) => {
  console.log('handleSearch', ev)
  const target = ev.target as HTMLInputElement;
  const value = target.value;
  if (!value) {
    console.log('no value')
    filteredCandidates.value = candidates.value;
    return;
  }
  filteredCandidates.value = candidates.value.filter(candidate => (
    candidate.name.toLowerCase().includes(value) || candidate.description?.toLowerCase().includes(value)
  ));
  emit('search', value);
}

const close = () => {
  if (!self.value?.hasAttribute('popover')) {
    return
  }
  if (!search.value?.value) {
    self.value?.hidePopover();
  }
};

onClickOutside(self, () => {
  if (popoverProp.value === 'manual') {
    search.value!.value = '';
    self.value?.hidePopover()
  }
});

const select = (candidate: SearchCandidate) => {
  emit('select', candidate);
  if (popoverProp.value === 'manual') {
    self.value?.hidePopover();
  } else {
    search.value?.focus();
  }
};
</script>
<template>
  <slot name="trigger" :open="open" />
  <section ref="self" :popover="popoverProp" class="ui search-palette" v-bind="$attrs">
    <header>
      <label :for="inputId">
        <ui-icon name="search" />
      </label>
      <input :id="inputId" type="search" ref="search" :incremental="incremental" :placeholder="placeholder"
        @search="handleSearch" @keydown.esc="close" />
    </header>
    <section class="results">
      <slot :items="filteredCandidates" :select="select">
        <ui-item tag="a" v-for="candidate in filteredCandidates" :key="candidate.id" @click="select(candidate)"
          style="cursor: pointer">
          <!-- <template #leading>
            <ui-icon :name="candidate.icon" />
          </template> -->
          <h3>{{ candidate.name }}</h3>
          <p class="description">{{ candidate.description }}</p>
        </ui-item>
      </slot>
      <slot name="empty" v-if="filteredCandidates?.length === 0">
        <p style="text-align: center">No results found</p>
      </slot>
    </section>
  </section>
</template>
<style>
.ui.search-palette {
  border: 1px solid var(--ui-border-color);
  border-radius: var(--ui-border-radius, 0.25rem);

  &[popover] {
    &::backdrop {
      /* user-select: none; */
      pointer-events: auto !important;
      background-color: var(--backdrop-color);
      backdrop-filter: blur(1px);
    }
  }

  >header {
    display: flex;
    align-items: stretch;
    border: none;
    border-bottom: 1px solid var(--ui-border-color);
    border-radius: var(--ui-border-radius, 0.25rem) var(--ui-border-radius, 0.25rem) 0 0;

    >label {
      padding: 0.75rem;
      border-radius: var(--ui-border-radius, 0.25rem) 0 0 0;
      background-color: var(--ui-field-color);
    }

    input[type="search"] {
      border: none;
      border-radius: 0 var(--ui-border-radius, 0.25rem) 0 0;
      padding: 0.75rem;
      width: 100%;
      outline: none;
    }
  }

  >.results {
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    .ui.item {
      &:hover {
        background-color: var(--ui-hover-color);
      }
    }
  }
}
</style>
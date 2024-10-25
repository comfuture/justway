<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, provide, onMounted, nextTick } from '#imports';

export type TabDefinition = {
  id: string
  title: string
  active?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{
  segment?: boolean
}>()

const emit = defineEmits<{
  (event: 'active', id: string): void
}>()

const tabDefinitions = ref<TabDefinition[]>([])
const activeId = ref('')
const self = ref<HTMLElement>()

/**
 * Register a tab definition to render tab headers
 * @param tab {TabDefinition} Tab definition
 */
const addTab = (tab: TabDefinition) => {
  const tabIds = tabDefinitions.value.map(t => t.id)
  if (tabIds.includes(tab.id)) {
    console.warn(`Tab with id "${tab.id}" already exists`)
    return
  }
  tabDefinitions.value.push(tab)
  if (tab.active) {
    activeId.value = tab.id
  }
}

/**
 * Set the active tab by id or element
 * @param id {string | HTMLElement} Tab(id) to activate
 */
const setActiveTab = (id: string | HTMLElement) => {
  const argIsString = (id: unknown): id is string => typeof id === 'string'
  if (!argIsString(id)) {
    const el = id as HTMLElement
    let idString = ''
    if (['A', 'LABEL'].includes(el.tagName)) {
      const href = el.getAttribute('href')
      const forAttr = el.getAttribute('for')
      if (href && href.startsWith('#')) {
        idString = href.slice(1)
      } else if (forAttr) {
        idString = forAttr
      }
      if (idString) {
        activeId.value = idString
        emit('active', idString)
      }
    }
  } else {
    if (!tabDefinitions.value.find(t => t.id === id)) {
      console.warn(`Tab with id "${id}" not found`)
      return
    }
    activeId.value = id
    emit('active', id)
  }
  renderTabStates()
}

provide('container', 'ui-tabs')
provide('addTab', addTab)
provide('setActiveTab', setActiveTab)

/**
 * Handle tab click event
 * @param ev {MouseEvent} Click event
 */
const handleTabClick = (ev: MouseEvent) => {
  ev.preventDefault()
  const target = ev.target as HTMLElement
  setActiveTab(target)
}

const handleKeypress = (ev: KeyboardEvent) => {
  const focusNode = self.value?.querySelector('.ui.tabs header > :focus')
  if (ev.key === 'Enter' || ev.key === ' ') {
    ev.preventDefault()
    setActiveTab(focusNode)
  } else if (ev.key == 'ArrowRight') {
    focusNode?.nextElementSibling?.focus()
  } else if (ev.key == 'ArrowLeft') {
    focusNode?.previousElementSibling?.focus()
  }
}

/**
 * Find the active tab id
 */
const findActiveId = () => {
  if (!self.value) {
    return
  }

  const tabs = Array.from<HTMLElement>(self.value.querySelectorAll('.ui.tabs header > a, .ui.tabs header > label'))
  const activeTab = tabs.find(tab => tab.classList?.contains('active'))
  if (activeTab) {
    setActiveTab(activeTab)
  }
}

/**
 * Check if the tab is active
 * @param tab {Element} Tab element
 * @returns {boolean} True if the tab is active
 */
const isActiveTab = (tab: Element) => {
  const href = tab.getAttribute('href')
  const forAttr = tab.getAttribute('for')
  return (href && href.startsWith('#') && href.slice(1) === activeId.value) ||
    (forAttr && forAttr === activeId.value)
}

const renderTabStates = () => {
  if (!self.value || !activeId.value) {
    return
  }
  const tabs = Array.from<HTMLElement>(self.value.querySelectorAll('.ui.tabs header > *'))
  tabs.forEach(tab => {
    if (isActiveTab(tab)) {
      tab.classList.add('active')
      tab.setAttribute('aria-selected', 'true')
      tab.focus()
    } else {
      tab.classList.remove('active')
      tab.setAttribute('aria-selected', 'false')
    }
  })
  const activePane = self.value.querySelector<HTMLElement>(`#${activeId.value}`)
  if (activePane) {
    const otherPanes = Array.from<HTMLElement>(self.value.querySelectorAll('.ui.tabs > section.pane > [id]'))
    otherPanes.forEach(pane => pane.classList.remove('active'))
    activePane.classList.add('active')
  }
}

onMounted(() => {
  findActiveId()
  nextTick(renderTabStates)
})

defineExpose({
  addTab,
  setActiveTab
})
</script>
<template>
  <section ref="self" role="tablist" class="ui tabs" :class="{ segment }">
    <ui-group tag="header" @click="handleTabClick" @keydown="handleKeypress">
      <slot name="tabs" />
      <a v-for="t in tabDefinitions" :key="t.id" :href="`#${t.id}`" :aria-controls="t.id" :class="{ active: t.active }">
        {{ t.title }}
      </a>
    </ui-group>
    <section class="pane">
      <slot>
        <nuxt-page />
      </slot>
    </section>
  </section>
</template>
<style>
.ui.tabs {

  &.segment {
    background-color: var(--ui-panel-bg);
    border-radius: 0.25rem;

    >.pane {
      padding: 0.5rem;
    }
  }

  header {
    padding: 0;
    display: flex;
    justify-content: initial;
    border-radius: 0.25rem 0.25rem 0 0;
    border-bottom: 1px solid var(--ui-border-color);
    overflow-y: auto;

    &:focus-within {

      a:focus:not([aria-selected="true"]) {
        border-bottom: 2px solid var(--ui-text-selection-color);
        /* text-decoration-line: underline;
          text-underline-offset: 0.2em;
          text-decoration-style: dotted;
          text-decoration-color: var(--ui-outline-color); */
      }
    }

    a,
    a[href^="#"],
    label[for] {
      display: inline-flex;
      padding: 0.5rem 1rem;
      white-space: nowrap;
      border: none;
      border-bottom: 2px solid transparent;
      border-color: transparent;
      background-color: transparent;
      color: var(--ui-text-color);
      cursor: pointer;
      text-decoration: none;
      transition: border-bottom-color 0.2s;

      &:hover {
        border-bottom: 2px solid var(--ui-text-selection-color);
      }

      &.active,
      &.router-link-active {
        border-bottom: 2px solid var(--ui-primary-color);
      }

      &[aria-selected="true"] {
        border-bottom: 2px solid var(--ui-primary-color);
      }
    }
  }

  section.pane {
    >[id] {
      display: none;

      &.active {
        display: inherit;
      }
    }
  }
}
</style>
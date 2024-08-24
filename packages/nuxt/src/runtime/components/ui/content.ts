import { defineComponent, inject, h } from 'vue'
import { useSlots, useAttrs, useId, resolveComponent } from '#imports'
import type { TabDefinition } from './tabs.vue'

/**
 * Content component
 * this is dynamic render component based on the container.
 */
export default defineComponent({
  name: 'ui-content',
  props: {
    title: {
      type: String,
      default: ''
    },
    active: {
      type: Boolean,
      default: undefined
    }
  },
  setup(props) {
    const container = inject<string>('container')
    const slots = useSlots()
    const attrs = useAttrs()

    if (container === 'ui-accordion') {
      // render accordion content using details/summary
      const name = inject<string>('accordionGroup')
      return () => {
        return h('details', { class: 'ui', name, open: props.active, ...attrs }, [
          h('summary', [
            slots.header ? slots.header() : props.title
          ]),
          h('div', { class: 'content' }, [
            slots.default?.()
          ])
        ])
      }
    } else if (container === 'ui-tabs') {
      // render tabs content and add tab to the ui-tab component

      // if id is not provided, generate a new id
      const id: string = attrs.id as string ?? useId()

      // register tab to the parent ui-tabs component
      const addTab = inject<(tab: TabDefinition) => void>('addTab')
      addTab?.({ id, title: props.title, active: props.active })

      // render tab content
      return () => {
        return h('section', { id, class: ['content', { active: props.active }], ...props, ...attrs }, [
          slots.default?.()
        ])
      }
    } else {
      // render normal content
      const tag = attrs.is ? resolveComponent(attrs.is as string) : 'section'
      const hasHeader = slots.header || props.title
      return () => {
        return h(tag, { class: 'ui content', ...props, ...attrs }, [
          hasHeader && h('header', slots.header?.() ?? props.title),
          slots.default?.()
        ])
      }
    }
  }
})

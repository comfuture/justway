<!-- eslint-disable vue/multi-word-component-names -->
<script lang="tsx">
import { inject, h } from 'vue'
import type { TabDefinition } from './tabs.vue'
import { useSlots, useAttrs, useId, resolveComponent, defineComponent, type PropType } from '#imports'

export default defineComponent({
  props: {
    title: {
      type: String as PropType<string>,
      default: '',
    },
    active: {
      type: Boolean as PropType<boolean>,
      default: undefined,
    }
  },
  setup(props) {
    const container = inject<string>('container', '')
    const slots = useSlots()
    const attrs = useAttrs()

    // if id is not provided, generate a new id
    const id: string = attrs.id as string ?? useId()
    const active = ref(props.active)

    if (container === 'ui-accordion') {
      // render accordion content using details/summary
      const name = inject<string>('accordionGroup', '')
      const handleToggle = (event: Event) => {
        event.preventDefault()
        event.stopPropagation()
        active.value = !active.value
        const el = event.target as HTMLDetailsElement
        el.setAttribute('aria-expanded', el.open ? 'true' : 'false')
      }
      return () => (
        h('details', {
          id,
          class: 'ui',
          name,
          open: active.value,
          ...attrs,
          'aria-expanded': active.value,
          onToggle: handleToggle,
        }, [
          h('summary', { 'aria-controls': id }, slots.header?.() ?? props.title),
          h('div', { class: 'content' }, slots.default?.()),
        ])
      )
    } else if (container === 'ui-tabs') {
      // render tabs content and add tab to the ui-tab component

      // register tab to the parent ui-tabs component
      const addTab = inject<(tab: TabDefinition) => void>('addTab')
      addTab?.({ id, title: props.title, active: props.active })

      // render tab content
      // return () => h('section', { id, class: ['content', { active: props.active }] }, slots.default?.())
      return () => (
        h('section', {
          role: 'tabpanel',
          'aria-label': props.title,
          id,
          class: ['content', { active: props.active }],
          ...props,
          ...attrs,
        },
          [
            slots.default?.()
          ]
        )
      )
    } else {
      // render normal content
      const Tag = attrs.is ? resolveComponent(attrs.is as string) : 'section'
      const hasHeader = slots.header || props.title
      return () => h(Tag, { ...props, ...attrs, class: ['ui content'] }, [
        hasHeader && h('header', {}, slots.header?.() ?? props.title),
        slots.default?.(),
      ])
    }
  }
})
</script>
<style>
.ui {

  /* .ui.content */
  .content,
  &.content {
    &.list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      @media screen and (max-width: 768px) {
        >.ui.segment {
          border-radius: 0;
          border-left: 0;
          border-right: 0;
        }
      }
    }

    &.columns,
    &.wrap {
      display: flex;
      flex-direction: row;
      gap: 0.5rem;
    }

    &.wrap {
      flex-wrap: wrap;
    }

    &.responsible {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      >.\* {
        flex: 1;
      }

      >.\*\* {
        flex: 2;
      }

      >.\*\*\* {
        flex: 3;
      }

      >.\*\*\*\* {
        flex: 4;
      }

      @media screen and (min-width: 768px) {
        flex-direction: row;
      }
    }
  }
}
</style>
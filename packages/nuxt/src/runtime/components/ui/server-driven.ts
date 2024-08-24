import { defineComponent, h, resolveComponent, type PropType, type VNode } from "#imports"

export interface ServerDrivenUI {
  tag: string
  attrs: Record<string, any>
  children?: ServerDrivenUI[]
}

export default defineComponent({
  name: 'ui-server-driven',
  props: {
    value: {
      type: Object as PropType<ServerDrivenUI>,
      required: true
    }
  },
  setup(props) {
    const render = (def: ServerDrivenUI): VNode => {
      const children: VNode[] | undefined = def.children?.map(render)
      return h(resolveComponent(def.tag), def.attrs, children)
    }

    return () => render(props.value)
  }
})
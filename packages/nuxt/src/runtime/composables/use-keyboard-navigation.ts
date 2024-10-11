import { type MaybeRef, ref, unref, onMounted, onBeforeUnmount } from "vue";

/** represents `<component>` in vue. that is, a component that can be a reference to an HTMLElement or a ProxyElement */
type ProxyElement = {
  $el: HTMLElement
}

export type KeyboardNavigationOptions = {
  /** The CSS selector for the elements that will be navigated. */
  selector?: string
  /** The CSS class that will be added to the active element when it is focused. */
  activeClass?: string
}

const defaultOptions: KeyboardNavigationOptions = {
  selector: '[tabindex]',
  activeClass: 'active',
}

/**
 * Enables keyboard navigation for a given element.
 * 
 * @param el - The element to enable keyboard navigation on. Can be a reference to an HTMLElement, ProxyElement, or a string selector.
 * @param options - The options for keyboard navigation.
 * @param [options.selector] - The CSS selector for the elements that will be navigated.
 * @param [options.activeClass] - The CSS class that will be added to the active element when it is focused.
 * @returns An object containing the selectedIndex.
 */
export function useKeyboardNavigation(el: MaybeRef<HTMLElement | ProxyElement | string> | undefined,
  options: KeyboardNavigationOptions = defaultOptions) {
  const selectedIndex = ref(-1)

  onMounted(() => {
    let wrapper = unref(el)
    if (!wrapper) return
    if (typeof wrapper === 'string') wrapper = document.querySelector(wrapper) as HTMLElement
    if ('$el' in wrapper) wrapper = wrapper.$el as HTMLElement // XXX

    // wrapper.setAttribute('aria-activedescendant', '')

    const selector = options.selector || '[tabindex]'
    const activeClass = options.activeClass || 'active'

    const elements = Array.from(wrapper.querySelectorAll(selector))
    let activeElement: HTMLElement

    // if element with activeClass exists, set selectedIndex to its index
    const activeElementIndex = elements.findIndex((el) => el.classList.contains(activeClass))
    if (activeElementIndex > -1) {
      selectedIndex.value = activeElementIndex
    }

    const keydownHandler = (ev: KeyboardEvent) => {
      if (ev.key === 'ArrowDown') {
        if (selectedIndex.value < elements.length - 1) {
          selectedIndex.value++
          setActiveElement(selectedIndex.value)
        }
      } else if (ev.key === 'ArrowUp') {
        if (selectedIndex.value > 0) {
          selectedIndex.value--
          setActiveElement(selectedIndex.value)
        }
      }
    }

    wrapper.addEventListener('keydown', keydownHandler)

    activeElement = elements[selectedIndex.value] as HTMLElement

    const setActiveElement = (index: number) => {
      if (activeElement) activeElement.classList.remove(activeClass)
      selectedIndex.value = index
      activeElement = elements[selectedIndex.value] as HTMLElement
      activeElement.classList.add(activeClass)
    }

    setActiveElement(selectedIndex.value)

    onBeforeUnmount(() => {
      // Clean up
      wrapper.removeEventListener('keydown', keydownHandler)
    })
  })


  return {
    selectedIndex,
  }
}
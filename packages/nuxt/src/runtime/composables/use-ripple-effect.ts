import color from "color";
import { type Ref, type MaybeRef, unref, onMounted } from "vue";
import { useElementBounding } from "@vueuse/core";

type ProxyElement = {
  $el: HTMLElement
}

/**
 * Creates a ripple effect on the given element when triggered by a mouse event.
 * 
 * <!> Please note that you use this composable on an element will make it relative and overflow hidden.
 * @param el - The HTML element on which the ripple effect will be applied.
 * @returns A function that can be used to trigger the ripple effect.
 */
export function useRippleEffect(target: MaybeRef<HTMLElement> | MaybeRef<ProxyElement>): (ev: MouseEvent) => void {
  let isRelative = false;
  const ensureElement = (): HTMLElement => {
    let el = unref(target)
    if (!el) return
    if ('$el' in el) el = el.$el as HTMLElement // XXX
    if (isRelative) return el
    // make el relative and overflow hidden
    if (el.style.position !== "fixed") {
      el.style.position = "relative";
    }
    el.style.overflow = "hidden";
    isRelative = true;
    return el
  }

  onMounted(() => {
  })

  const createRippleEffect = (ev: MouseEvent) => {
    const el = ensureElement()
    try {
      const bg = color(getComputedStyle(el).backgroundColor)
      const rippleColor = bg.isDark() ? bg.lighten(0.3) : bg.darken(0.3)
      el.style.setProperty("--ripple-color", rippleColor.hex());
    } catch (e) {
      el.style.setProperty("--ripple-color", 'rgba(255, 255, 255, 0.3)');
    }
    const ripple = document.createElement("ins");
    const rect = useElementBounding(el)
    ripple.className = "ripple";
    ripple.style.left = `${ev.x - rect.left.value}px`;
    ripple.style.top = `${ev.y - rect.top.value}px`;
    ripple.style.setProperty("--material-scale", '' + el.offsetWidth);
    el.appendChild(ripple);
    ripple.addEventListener("animationend", () => {
      ripple.offsetParent?.removeChild(ripple);
    });
  }
  return createRippleEffect
}


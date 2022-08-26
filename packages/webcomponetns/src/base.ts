import { render } from 'lit-html';
export { html } from 'lit-html';

type ElementPropMap = { [key in string]: any };
type ElementProps = string | ElementPropMap | HTMLElement | Array<HTMLElement | Comment>

export function createElement(tagName: string, ...props: ElementProps[]): HTMLElement {
  const el = document.createElement(tagName)

  for (const prop of props) {
    if (typeof prop === 'string') {
      el.textContent = prop
    }
    if (Array.isArray(prop)) {
      el.append(...prop)
    } else if (typeof prop === 'object') {
      for (const [key, value] of Object.entries(prop)) {
        el.setAttribute(key, '' + value)
      }
    }
    // if ([HTMLElement, Comment].includes(prop.constructor as typeof HTMLElement)) {
    //   el.append(prop);
    // }
  }
  return el
}

export const h = createElement


export class StyledElement extends HTMLElement {
  static style = ''
  static props: string[] = []
  static get observedAttributes(): string[] {
    return this.props
  }
  get props(): string[] {
    return (this.constructor as typeof StyledElement).observedAttributes
  }

  #rootStyle: HTMLStyleElement
  #rootElement: HTMLElement | Comment | null = null
  // #rootElement: ShadowRoot

  constructor() {
    super();
    this.#rootStyle = document.createElement('style');
    this.#rootStyle.textContent = (this.constructor as typeof StyledElement).style
    this.attachShadow({ mode: 'open' });
    this.shadowRoot!.append(this.#rootStyle);
  }

  connectedCallback(): void {
    this._renderElement()
    this.mounted?.();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (this.props.includes(name) && oldValue !== newValue) {
      this._renderElement()
    }
  }

  _renderElement(): void {
    // const tpl = this.render()
    // render(tpl, this.#rootElement);
    if (!this.#rootElement) {
      // this.#rootElement = this.render()
      this.shadowRoot!.append(this.#rootElement!)
    } else {
      let oldRootElement = this.#rootElement
      this.#rootElement = this.render();
      this.shadowRoot!.replaceChild(oldRootElement, this.#rootElement)
    }
  }

  mounted(): void {
  }

  render(): HTMLElement | Comment {
    return document.createComment(' ')
  }
}

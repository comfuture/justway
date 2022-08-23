import _style from '@justway/ui/css/button.css';
import { h, StyledElement } from './base';

class UIButton extends StyledElement {
  static style = _style
  static props = ['class']

  render() {
    return h('button', { class: `ui ${this.classList.value}` }, [
      h('slot')
    ])
  }
}

customElements.define('ui-button', UIButton);

declare global {
  interface HTMLElementTagNameMap {
    'ui-button': UIButton;
  }
}

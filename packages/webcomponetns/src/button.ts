import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import style from '@justway/ui/css/button.css';

const sheet = new CSSStyleSheet();
sheet.replace(`${style}`);

@customElement('ui-button')
export default class UIButton extends LitElement {

  firstUpdated() {
    this.renderRoot.adoptedStyleSheets = [sheet];
  }

  render() {
    return html`<button class="ui"><slot></slot></button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-button': UIButton;
  }
}

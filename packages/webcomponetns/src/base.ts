import { LitElement } from 'lit';

export class UIElement extends LitElement {

  firstUpdated() {
    this.renderRoot.adoptedStyleSheets = [];
  }
}
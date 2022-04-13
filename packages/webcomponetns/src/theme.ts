import { LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('ui-theme')
export default class UITheme extends LitElement {

  @property
  name = 'default'

  firstUpdated() {
    const sheet = new CSSStyleSheet();
    import(`@justway/ui/theme/${this.name}.css`).then(css => sheet.replace(css.default));
    console.log(sheet, css);
  }
}

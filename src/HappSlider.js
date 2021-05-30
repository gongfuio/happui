import { html, css, LitElement } from 'lit-element';

// Web Component definition
export class HappSlider extends LitElement {
  static get styles() {
    return css`
      :host {
        --happ-ui-text-color: #666;

        display: inline-block; padding: 0; margin: 0;
        color: var(--happ-ui-text-color);
      }
      .slider { width: 90% }
      span.label {
        font-weight: 300;
        letter-spacing: 0.2em;
      }
      span.repr {
        background-color: #bbb;
        padding: 0.1em 1em;
        color: #fff;
        font-size: 80%;
      }
    `;
  }

  static get properties() {
    return {
      value: { type: Number, reflect: true }, // Value in between 0.0 … 1.0
      label: { type: String },
    };
  }

  constructor() {
    super();

    // Observed properties
    this.value = 0.65;
    this.label = "";
  }

  render() {
    return html`
      <span class="label">${this.label}</span>
      <input type="range" value="${this.value}" @input="${this.handleChange}" min="0.0" max="1.0" step="0.05" class="slider">
      <span class="repr">${""+this.value.toFixed(1)}</span>
    `;
  }

  handleChange( e) {
    const newValue = parseFloat( e.target.value);
    this.value = newValue;
    let myChangeEvent = new CustomEvent( "slider-change", {
      detail: { value: newValue }, bubbles: true, composed: true });
    this.dispatchEvent(myChangeEvent);
  }
}

import { LitElement, html, css } from 'lit-element';

export class HappSliders extends LitElement {

  static get styles() {
    return css`
      :host { display: block; }
      .sliders { margin-top: 2em; }
      .theslider { margin-bottom: 1.5em; }
    `;
  }

  static get properties() {
    return {
      // Same properties as the ‹happ-ui› component
      sentir: { type: Number, reflect: true }, // Value in between 0.0 … 1.0
      connaitre: { type: Number, reflect: true }, // idem
      comprendre: { type: Number, reflect: true }, // idem
    };
  }

  constructor() {
    super();
    this.sentir = 0.65;
    this.connaitre = 0.65;
    this.comprendre = 0.65;
  }

  render() {
    return html`<div class="sliders">
      <happ-slider class="theslider" label="SEN" value="${this.sentir}" @slider-change="${this.handleChangeSEN}"></happ-slider>
      <happ-slider class="theslider" label="CON" value="${this.connaitre}" @slider-change="${this.handleChangeCON}"></happ-slider>
      <happ-slider class="theslider" label="COM" value="${this.comprendre}" @slider-change="${this.handleChangeCOM}"></happ-slider>
    </div>`;
  }

  handleChangeSEN( e) {
    const newValue = e.detail.value;
    this.sentir = newValue;
    this.dispatchChange( e, "sentir");
  }

  handleChangeCON( e) {
    const newValue = e.detail.value;
    this.connaitre = newValue;
    this.dispatchChange( e, "connaitre");
  }

  handleChangeCOM( e) {
    const newValue = e.detail.value;
    this.comprendre = newValue;
    this.dispatchChange( e, "comprendre");
  }

  dispatchChange( e, changed) {
    e.stopPropagation();
    const newValue = {
      sentir: this.sentir,
      connaitre: this.connaitre,
      comprendre: this.comprendre
    };
    const myChangeEvent = new CustomEvent( "sliders-change", {
      detail: { changed: changed, value: newValue },
      bubbles: true, composed: true
    });
    this.dispatchEvent( myChangeEvent);
  }
}

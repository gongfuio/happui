
import { LitElement, html, css } from 'lit-element';

export class HappContactSheet extends LitElement {
  static get styles() {
    return css`
      :host {
        --happ-ui-text-color: #000;

        display: block;
        padding: 10px;
        color: var(--happ-ui-text-color);
      }

      happ-ui-exp01,
      happ-ui-exp02,
      happ-ui-exp03a,
      happ-ui-exp03b,
      happ-ui-exp04 {
        width: 10%; height: 10%;
        padding: 0 1em 1em 0
      }

      button {
        text-align: center;
      }
    `;
  }

  static get properties() {
    return {
      variant: { type: String }
    };
  }

  constructor() {
    super();

    // Observed properties
    this.variant = "exp01";
  }

  happui( sen, con, com) {
    let fragment;
    switch( this.variant) {
      case "exp01":
        fragment = html`<happ-ui-exp01 title="Color Wheel Exp 01"
          sentir="${sen}" connaitre="${con}"  comprendre="${com}"></happ-ui-exp01>`;
        break;
      case "exp02":
        fragment = html`<happ-ui-exp02 title="Color Wheel Exp 02"
          sentir="${sen}" connaitre="${con}"  comprendre="${com}"></happ-ui-exp02>`;
        break;
      case "exp03A":
        fragment = html`<happ-ui-exp03a title="Color Wheel Exp 03A"
          sentir="${sen}" connaitre="${con}"  comprendre="${com}"></happ-ui-exp03a>`;
        break;
      case "exp03B":
        fragment = html`<happ-ui-exp03b title="Color Wheel Exp 03B"
          sentir="${sen}" connaitre="${con}"  comprendre="${com}"></happ-ui-exp03b>`;
        break;
      case "exp04":
        fragment = html`<happ-ui-exp04 title="Color Wheel Exp 04"
          sentir="${sen}" connaitre="${con}"  comprendre="${com}"></happ-ui-exp04>`;
        break;
      default:
        fragment = html`<p>(Choose a variant)</p>`;
        break;
    }
    return fragment;
  }

  happui8x5() {
    let htmlArr = [];
    let sen, con, com;
    for( let i = 0; i < 5; ++i) {
      htmlArr.push( html`<div>`);
      for( let j = 0; j < 8; ++j) {
        [ sen, con, com] = [ Math.random(), Math.random(), Math.random() ];
        console.log( [ sen, con, com]);
        htmlArr.push( this.happui( sen, con, com));
      }
      htmlArr.push( html`</div>`);
    };
    return htmlArr;
  }

  render() {
    return html`${this.happui8x5()}`;
  }
}

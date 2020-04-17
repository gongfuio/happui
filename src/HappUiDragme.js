import { html, svg, css, LitElement } from 'lit-element';

// from http://www.petercollingridge.co.uk/tutorials/svg/interactive/dragging/
// and https://github.com/petercollingridge/code-for-blog/blob/36ba73c7b763022731a72813249cdc56e7dba8c0/svg-interaction/draggable/draggable_groups.svg?short_path=be4270d

function toRadians(degrees) {
  return degrees * Math.PI / 180
}

function displacement(pt1, pt2) {
  return {x: pt2.x - pt1.x, y: pt2.y - pt1.y}
}

function projection(pt, angledeg) {
  let a = toRadians(angledeg)
  return pt.x * Math.cos(a) + pt.y * Math.sin(a)
}          

// Utility functions
function clamp( val, min, max) {
  return val <= min ? min : val >= max ? max : val;
}

// Web Component definition
export class HappUiDragme extends LitElement {
  static get styles() {
    return css`
      :host {
        --happ-ui-text-color: #000;

        display: inline-block;
        padding: 25px;
        color: var(--happ-ui-text-color);
      }
    `;
  }

  static get properties() {
    return {
      title: { type: String },
      sentir: { type: Number }, // Value in between 0.0 … 1.0
      connaitre: { type: Number }, // idem
      comprendre: { type: Number }, // idem
    };
  }

  constructor() {
    super();
    
    // Observed properties
    this.title = 'Color Wheel';
    this._sentir = 0.75;
    this._connaitre = 0.75;
    this._comprendre = 0.75;

    // Private properties
    this.__max = 0.90; // Maximum value of the properties { sentir, connaitre, comprendre }
    this.__min = 0.10; // Minimum value … idem …

    this._sentir_angle = 30
    this._connaitre_angle = 150
    this._comprendre_angle = 270

    // dragging variables
    this._pistil_names = {'p0:sprout': 'sentir', 'p1:sprout': 'connaitre', 'p2:sprout': 'comprendre'}
    this._dragged_pistil_name = undefined
    this._offset = undefined
  }

  get sentir() { return this._sentir; }  
  set sentir( val) {
    let oldVal = this._sentir;
    this._sentir = clamp( val, this.__min, this.__max);
    this.requestUpdate( 'sentir', oldVal);
  }

  get connaitre() { return this._connaitre; }
  set connaitre( val) {
    let oldVal = this._connaitre;
    this._connaitre = clamp( val, this.__min, this.__max);
    this.requestUpdate( 'connaitre', oldVal);
  }

  get comprendre() { return this._comprendre; }
  set comprendre( val) {
    let oldVal = this._comprendre;
    this._comprendre = clamp( val, this.__min, this.__max);
    this.requestUpdate( 'comprendre', oldVal);
  }

  _getPosition(evt) {
    let svg = evt.currentTarget
    let CTM = svg.getScreenCTM();
    let pt = svg.createSVGPoint();
    if (evt.touches) {
      pt.x = evt.touches[0].clientX; pt.y = evt.touches[0].clientY;
    } else {
      pt.x = evt.clientX; pt.y = evt.clientY;
    }    
    pt = pt.matrixTransform(CTM.inverse());
    //console.log('_getPosition', evt.target.id, 'svg', svg, 'CTM', CTM, 'pt', pt) 
    return pt
  }

  _dragStart(evt) {
    let pistil_name = this._pistil_names[evt.target.id]
    if (pistil_name) {
      let pos = this._getPosition(evt)
      this._offset = pos
      this._dragged_pistil_name = pistil_name
      //console.log('_dragStart', evt.target.id, 'mousePos', pos) 
    }
  }

  _dragMove(evt) {
    if (this._dragged_pistil_name) {
      let pistil_name = this._dragged_pistil_name
      //console.log('_dragMove', evt.target.id) 
      let pos = this._getPosition(evt)
      let displ = displacement(this._offset, pos)
      let proj = projection(displ, this[`_${pistil_name}_angle`])
      this._offset = pos
      const sprout_length = 47.0
      let new_length = this[pistil_name] + proj / sprout_length
      this[pistil_name] = new_length
      if (this[pistil_name] != new_length) {
        this._dragged_pistil_name = undefined
      }
    }
  }

  _dragEnd(event) {
    //console.log('_mouseup', event)
    this._dragged_pistil_name = undefined
  }

  render() {
    return svg`<svg width="200" height="200" viewBox="0 0 100 100"
        aria-label="${this.title}"
        @mousedown="${this._dragStart}"
        @mousemove="${this._dragMove}"
        @mouseup="${this._dragEnd}"
        @mouseleave="${this._dragEnd}"
        @touchstart="${this._dragStart}"
        @touchmove="${this._dragMove}"
        @touchend="${this._dragEnd}"
        @touchleave="${this._dragEnd}"
        @touchcancel="${this._dragEnd}"
      >
      <title>${this.title}</title>
      <style>
        .stem { stroke: white; stroke-width: 3.0; }
        .sprout { stroke: white; stroke-width: 3.0; fill-opacity: 0.0; }
      </style>
      <defs>
        <filter id="blur" color-interpolation-filters="linear" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="9"/>
        </filter>
        <mask id="circle">
          <circle cx="50" cy="50" r="50" fill="white"/>
        </mask>
      </defs>
      <g id="background-circle" mask="url(#circle)" filter="url(#blur)">
        <rect x="-10" width="110" height="110" fill="hsl(240,100%,${this._connaitre*52}%)"/> <!-- blue -->
        <rect x="50" width="60" height="110" fill="hsl(60,100%,${this._sentir*52}%)"/> <!-- yellow -->
        <polygon points="50,50, 60,110, 40,110" fill="hsl(150,100%,${(this._connaitre+this._sentir)*26}%)"/> <!-- #0f8 / green -->
        <polygon points="0,0, 100,0, 100,20, 50,50, 0,20" fill="hsl(0,100%,${this._comprendre*52}%)"/> <!-- red -->
        <polygon points="0,10, 50,50, 0,30" fill="hsl(300,100%,${(this._connaitre+this._comprendre)*26}%)"/> <!-- #f0f / magenta -->
        <polygon points="100,10, 100,30, 50,50" fill="hsl(30,100%,${(this._comprendre+this._sentir)*26}%)"/> <!-- #f80 / orange -->
      </g>
      <g id="pistils">
        <g id="p0" transform="translate(50 50) rotate(30 0 0)">
          <line id="p0:stem" class="stem" x1="0" y1="0" x2="${this._sentir * 47 - 5}" y2="0" />
          <circle id="p0:sprout" class="sprout" cx="${this._sentir * 47}" cy="0" r="5" />
        </g>
        <g id="p1" transform="translate(50 50) rotate(150 0 0)">
          <line id="p1:stem" class="stem" x1="0" y1="0" x2="${this._connaitre * 47 - 5}" y2="0" />
          <circle id="p1:sprout" class="sprout" cx="${this._connaitre * 47}" cy="0" r="5" />
        </g>
        <g id="p2" transform="translate(50 50) rotate(270 0 0)">
          <line id="p2:stem" class="stem" x1="0" y1="0" x2="${this._comprendre * 47 - 5}" y2="0" />
          <circle id="p2:sprout" class="sprout" cx="${this._comprendre * 47}" cy="0" r="5" />
        </g>
      </g>
    </svg>`;
  }
}

window.customElements.define('happ-ui-dragme', HappUiDragme);
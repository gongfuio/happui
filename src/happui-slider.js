
import { LitElement, html, css, svg } from 'lit-element';

/*
  Usage in html:

  <div>
    <happui-slider id='slider1' value='0.4'></happui-slider>
    <p id='para1'>...</p>
    <script>
      const para1 = document.getElementById('para1');
      const slider1 = document.getElementById('slider1');
      slider1.addEventListener('event-slider', (e) => {para1.innerHTML=`slider1 ${e.detail}`});
    </script>
  </div>

  Usage in another component:

    import { LitElement, html, css, svg } from 'lit-element';

    class FireEventsParent extends LitElement {
            ...
        sliderCallback(event) {
            this._messageFromChild = `child slider ${event.detail}`
        }

        render() {
            return html`
            <p>${this._messageFromChild}</p>
            <fire-events-slider @event-slider=${this.sliderCallback}></fire-events-slider>
            `;
        }
    }
 */

// Utility functions
function clamp( val, min, max) {
    return val <= min ? min : val >= max ? max : val;
  }

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

  class HappuiSlider extends LitElement {
    static get styles() {
      return css`
        :host {
          --happ-ui-text-color: #000;

          display: inline-block;
          padding: 0; margin: 0;
          color: var(--happ-ui-text-color);
        }
      `;
    }

    static get properties() {
      return {
        value: { type: Number },
      }
    }

    constructor() {
      super()
      this._drag_offset = undefined
      this._slider_value = 0.75  // 0.0...1.0
    }

    get value() { return this._slider_value; }
    set value(val) {
      let oldVal = this._slider_value;
      this._slider_value = clamp(val, 0.0, 1.0);
      this.requestUpdate('value', oldVal);
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
      if (evt.target.id == 'thumb') {
        this._drag_offset = this._getPosition(evt)
        //console.log('_dragStart', evt.target.id, 'mousePos', this.drag_)
      }
    }

    _dragMove(evt) {
      if (this._drag_offset && evt.target.id == 'thumb') {
        let pos = this._getPosition(evt)
        //console.log('_dragMove', evt.target.id, pos)
        let displ = displacement(this._drag_offset, pos)
        let proj = projection(displ, 0)
        this._drag_offset = pos
        const rect_length = 100.0
        let new_circlePos = this._slider_value + proj / rect_length
        this.dispatchEvent(new CustomEvent('event-slider', { detail: `${this.value.toFixed(3)}`}));
        this.value = new_circlePos
        if (this.value != new_circlePos) { // clamped at end
          this._drag_offset = undefined
        }
      }
    }

    _dragEnd(event) {
      //console.log('_dragEnd', event)
      this._drag_offset = undefined
    }

    render() {
      return svg`<svg width='100%' viewBox='0 0 120 30'
        @mousedown="${this._dragStart}"
        @mousemove="${this._dragMove}"
        @mouseup="${this._dragEnd}"
        @touchstart="${this._dragStart}"
        @touchmove="${this._dragMove}"
        @touchend="${this._dragEnd}"
        @touchcancel="${this._dragEnd}"A
      >
        <g transform='translate(10,5)'>
          <rect x='0' y='0' width='100' height='16' fill='gray'/>
          <line x1='1' y1='8' x2='99' y2='8' stroke='white'/>
          <circle id='thumb' cx='${this._slider_value * 100}' cy='8' r='10' fill='white' stroke='black'/>
        </g>
      </svg>`;
    }
  }

  customElements.define('happui-slider', HappuiSlider);

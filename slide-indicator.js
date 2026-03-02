import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";

/*
  slide-indicator
  this prints the dot navigation and tells the parent when a dot is clicked
  it does not change slides itself
  it just emits a custom event with the index that was clicked
*/
export class SlideIndicator extends DDDSuper(LitElement) {
  // tag name so you can use <slide-indicator> in HTML
  static get tag() {
    return "slide-indicator";
  }

  /*
    reactive properties:
    - count: how many dots to show (same as number of slides)
    - activeIndex: which dot should look "active"
    active-index is the attribute name so the parent can set it easily
  */
  static get properties() {
    return {
      ...super.properties,
      count: { type: Number },
      activeIndex: { type: Number, attribute: "active-index" },
    };
  }

  constructor() {
    super();
    // default values in case parent hasn't passed anything yet
    this.count = 0;
    this.activeIndex = 0;
  }

  /*
    styles:
    - dots are tiny buttons
    - active dot has higher opacity
    - focus-visible gives keyboard navigation support
  */
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: inline-flex;
          gap: var(--ddd-spacing-2);
          align-items: center;
        }

        button {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          border: 0;
          padding: 0;
          cursor: pointer;
          background: var(--ddd-theme-default-slateGray);
          opacity: 0.35;
        }

        /* highlight the currently active slide */
        button[aria-current="true"] {
          opacity: 1;
        }

        /* keyboard focus outline */
        button:focus-visible {
          outline: var(--ddd-border-sm);
          outline-offset: 2px;
        }
      `,
    ];
  }

  /*
    _onDotClick
    - reads data-index from the clicked dot
    - emits a custom event that bubbles up to the parent
    - parent listens for "play-list-index-changed"
  */
  _onDotClick(e) {
    // currentTarget is the button we attached the listener to
    const index = Number(e.currentTarget.dataset.index);

    const ev = new CustomEvent("play-list-index-changed", {
      bubbles: true,
      composed: true,
      detail: { index },
    });

    this.dispatchEvent(ev);
  }

  /*
    render:
    - create an array [0, 1, 2, ...] based on count
    - map it into buttons
    - aria-current is "true" for active dot (helps accessibility)
  */
  render() {
    const dots = Array.from({ length: this.count }, (_, i) => i);

    return html`
      ${dots.map(
        (i) => html`
          <button
            @click=${this._onDotClick}
            data-index=${i}
            aria-label="Go to slide ${i + 1}"
            aria-current="${i === this.activeIndex ? "true" : "false"}"
          ></button>
        `
      )}
    `;
  }
}

// register the custom element with the browser
globalThis.customElements.define(SlideIndicator.tag, SlideIndicator);
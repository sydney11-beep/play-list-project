import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";

/*
  slide-arrow
  this is a reusable arrow button that can point left or right
  it does not change slides itself
  it only tells the parent component "an arrow was clicked"
*/
export class SlideArrow extends DDDSuper(LitElement) {
  // tag name so you can use <slide-arrow> in HTML
  static get tag() {
    return "slide-arrow";
  }

  /*
    reactive properties:
    - direction: which arrow this is ("left" or "right")
    - disabled: if true, the button is disabled and won't fire events
    reflect: true means the attribute shows up in HTML too (useful for debugging)
  */
  static get properties() {
    return {
      ...super.properties,
      direction: { type: String }, // "left" or "right"
      disabled: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();
    // default arrow points left unless parent sets it
    this.direction = "left";
    // default is enabled
    this.disabled = false;
  }

  /*
    styles:
    we use DDD tokens for spacing/borders/colors so it matches the design system
    button is a circle and the svg icon sits centered inside it
  */
  static get styles() {
    return [
      super.styles,
      css`
        button {
          width: 44px;
          height: 44px;
          border-radius: 999px;
          border: var(--ddd-border-sm);
          background: var(--ddd-theme-default-white);
          cursor: pointer;
          display: grid;
          place-items: center;
        }

        /* dim + prevent clicking when disabled */
        button:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        /* keyboard focus outline */
        button:focus-visible {
          outline: var(--ddd-border-sm);
          outline-offset: 2px;
        }

        /* size of the icon */
        svg {
          width: 18px;
          height: 18px;
        }
      `,
    ];
  }

  /*
    _activate
    when the arrow is clicked, we dispatch a custom event upward
    the parent (play-list-project) listens for "play-list-arrow"
    and then decides how to update the index
  */
  _activate() {
    // safety: do nothing if disabled
    if (this.disabled) return;

    // custom event that bubbles up through the DOM
    const ev = new CustomEvent("play-list-arrow", {
      bubbles: true,
      composed: true,
      detail: { direction: this.direction },
    });

    // emit the event so the parent can handle it
    this.dispatchEvent(ev);
  }

  /*
    render:
    - uses direction to pick the correct svg path
    - aria-label helps screen readers understand the button
  */
  render() {
    const isLeft = this.direction === "left";
    return html`
      <button
        ?disabled=${this.disabled}
        @click=${this._activate}
        aria-label=${isLeft ? "Previous slide" : "Next slide"}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          ${isLeft
            ? html`<path
                d="M15.5 19 8.5 12 l7-7"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              />`
            : html`<path
                d="M8.5 5 15.5 12 l-7 7"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              />`}
        </svg>
      </button>
    `;
  }
}

// register the custom element with the browser
globalThis.customElements.define(SlideArrow.tag, SlideArrow);
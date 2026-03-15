import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";

export class SlideIndicator extends DDDSuper(LitElement) {
  static get tag() {
    return "slide-indicator";
  }

  static get properties() {
    return {
      ...super.properties,
      count: { type: Number },
      activeIndex: { type: Number, attribute: "active-index" },
    };
  }

  constructor() {
    super();
    this.count = 0;
    this.activeIndex = 0;
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: inline-flex;
          gap: var(--ddd-spacing-4, 16px);
          align-items: center;
        }

        button {
          width: 11px;
          height: 11px;
          border-radius: 999px;
          border: 0;
          padding: 0;
          margin: 0;
          cursor: pointer;

          background: #c7ccd2;
        }

        button[aria-current="true"] {
          background: #1d9bf0;
        }

        button:focus-visible {
          outline: 2px solid #1f448c;
          outline-offset: 2px;
        }
      `,
    ];
  }

  _onDotClick(e) {
    const index = Number(e.currentTarget.dataset.index);

    this.dispatchEvent(
      new CustomEvent("play-list-index-changed", {
        bubbles: true,
        composed: true,
        detail: { index },
      })
    );
  }

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

globalThis.customElements.define(SlideIndicator.tag, SlideIndicator);
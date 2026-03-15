import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";

export class PlayListSlide extends DDDSuper(LitElement) {
  static get tag() {
    return "play-list-slide";
  }

  static get properties() {
    return {
      ...super.properties,
      topHeading: { type: String, attribute: "top-heading" },
      secondHeading: { type: String, attribute: "second-heading" },
    };
  }

  constructor() {
    super();
    this.topHeading = "";
    this.secondHeading = "";
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          background: transparent;
        }

        .card {
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          padding: var(--ddd-spacing-10, 44px)
            var(--ddd-spacing-12, 56px)
            var(--ddd-spacing-4, 18px)
            var(--ddd-spacing-12, 56px);
          background: transparent;
        }

        .top {
          margin: 0;
          color: #3175bf;
          font-size: 17px;
          font-weight: var(--ddd-font-weight-bold, 700);
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        .title {
          margin: 8px 0 0 0;
          color: #2a4b8d;
          font-size: 65px;
          font-weight: var(--ddd-font-weight-bold, 700);
          line-height: 1.05;
          letter-spacing: -0.02em;
          white-space: nowrap;
        }

        .divider {
          width: 70px;
          height: 7px;
          background: #6fb7e3;
          border-radius: 999px;
          margin: 36px 0 14px 0;
          display: block;
          flex: 0 0 auto;
        }

        .body {
          width: 72%;
          flex: 1 1 auto;
          min-height: 0;
          overflow-y: auto;
          overflow-x: hidden;
          color: #000000;
          font-size: 17px;
          line-height: 1.35;
          margin-top: 0;
          padding-right: 8px;
          word-break: break-word;
          overflow-wrap: anywhere;
        }

        .body::-webkit-scrollbar {
          width: 12px;
        }

        .body::-webkit-scrollbar-track {
          background: #e8eaee;
        }

        .body::-webkit-scrollbar-thumb {
          background-color: #a6aebe;
          border-radius: 20px;
          border: 3px solid #e8eaee;
        }

        .body ::slotted(*) {
          margin: 0;
        }

        .body ::slotted(p) {
          margin: 0;
        }

        @media (max-width: 900px) {
          .card {
            padding: 34px 38px 28px 38px;
          }

          .title {
            max-width: 72%;
          }

          .body {
            width: 78%;
          }
        }

        @media (max-width: 700px) {
          .card {
            padding: 24px 24px 18px 24px;
          }

          .top {
            font-size: 13px;
          }

          .title {
            font-size: 2.4rem;
            max-width: 100%;
            margin-top: 8px;
            white-space: normal;
          }

          .divider {
            width: 120px;
            margin: 14px 0 6px 0;
          }

          .body {
            width: 100%;
            font-size: 15px;
            line-height: 1.4;
            padding-right: 8px;
          }
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="card">
        <p class="top">${this.topHeading}</p>
        <h2 class="title">${this.secondHeading}</h2>
        <div class="divider"></div>
        <div class="body">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

globalThis.customElements.define(PlayListSlide.tag, PlayListSlide);
/**
 * Copyright 2026 Sydney Anne Reiter
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";

/*
  play-list-slide
  this represents ONE slide
  it handles layout for:
  - top heading (small uppercase)
  - second heading (big title)
  - scrollable body area (slot)
*/
export class PlayListSlide extends DDDSuper(LitElement) {
  // tag name so you can use <play-list-slide> in HTML
  static get tag() {
    return "play-list-slide";
  }

  /*
    reactive properties:
    these come from attributes on the element:
    <play-list-slide top-heading="..." second-heading="...">
  */
  static get properties() {
    return {
      ...super.properties,
      topHeading: { type: String, attribute: "top-heading" },
      secondHeading: { type: String, attribute: "second-heading" },
    };
  }

  constructor() {
    super();
    // defaults in case headings are not provided
    this.topHeading = "";
    this.secondHeading = "";
  }

  /*
    styles:
    important parts:
    - fixed height so the body area can scroll
    - flex layout so headings take natural height and body fills the rest
    - .body has overflow so the scrollbar appears when content is long
  */
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: flex;
          flex-direction: column;
          box-sizing: border-box;

          /* fixed height creates the scroll area for the body */
          height: 260px;

          padding: var(--ddd-spacing-6);
          background-color: var(--ddd-theme-default-white);
          color: var(--ddd-theme-default-coalyGray);
          border-radius: var(--ddd-radius-lg);
        }

        /* top line heading (small, uppercase) */
        .top {
          font-size: var(--ddd-font-size-3xs);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: var(--ddd-font-weight-bold);
          color: var(--ddd-theme-default-slateGray);
          margin: 0 0 var(--ddd-spacing-2) 0;

          /* do not stretch, keep natural height */
          flex: 0 0 auto;
        }

        /* main title / sub-heading */
        .title {
          font-size: var(--ddd-font-size-2xl);
          font-weight: var(--ddd-font-weight-bold);
          line-height: 1.1;
          margin: 0 0 var(--ddd-spacing-4) 0;
          color: var(--ddd-theme-default-coalyGray);

          /* do not stretch, keep natural height */
          flex: 0 0 auto;
        }

        /*
          body content area
          - flex: 1 makes it take the remaining space
          - overflow: auto gives a scroll bar when content is long
          - padding-right gives some space so text doesn't sit on the scrollbar
        */
        .body {
          font-size: var(--ddd-font-size-s);
          line-height: 1.5;
          overflow: auto;
          flex: 1 1 auto;
          padding-right: var(--ddd-spacing-2);

          /*
            firefox scrollbar color
            (chrome sometimes ignores this, but it's still fine to include)
          */
          scrollbar-color: var(--ddd-primary-17) transparent;
        }

        /* mobile tweaks so it still looks usable */
        @media (max-width: 700px) {
          :host {
            height: 220px;
            padding: var(--ddd-spacing-4);
          }
        }
      `,
    ];
  }

  /*
    render:
    - headings come from attributes
    - slot holds whatever content the user puts in the slide
  */
  render() {
    return html`
      <p class="top">${this.topHeading}</p>
      <h2 class="title">${this.secondHeading}</h2>
      <div class="body">
        <slot></slot>
      </div>
    `;
  }
}

// register the custom element with the browser
globalThis.customElements.define(PlayListSlide.tag, PlayListSlide);
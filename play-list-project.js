/**
 * Copyright 2026 Sydney Anne Reiter
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";

/*
  imports:
  play-list-project uses these components in its render method
*/
import "./play-list-slide.js";
import "./slide-arrow.js";
import "./slide-indicator.js";

/*
  play-list-project
  this is the "wrapper" / slider component
  responsibilities:
  - read slides from the LightDOM using a slot
  - track current index (which slide is active)
  - move the track left/right using translateX
  - render arrows + dots
  - listen for custom events from arrows/dots
*/
export class PlayListProject extends DDDSuper(LitElement) {
  // tag name so you can use <play-list-project> in HTML
  static get tag() {
    return "play-list-project";
  }

  /*
    reactive properties:
    - index: current slide index (0 based)
      reflect: true means it shows as an attribute in HTML (handy for debugging)
    - slideCount: how many slides we found in the slot
      state: true means internal state (not meant to be set by HTML)
    - wrap: if true, arrows wrap from last -> first and first -> last
  */
  static get properties() {
    return {
      ...super.properties,
      index: { type: Number, reflect: true },
      slideCount: { type: Number, state: true },
      wrap: { type: Boolean },
    };
  }

  constructor() {
    super();
    // start at the first slide unless index attribute is provided
    this.index = 0;

    // slideCount will be computed based on slotted slides
    this.slideCount = 0;

    // wrap behavior on by default
    this.wrap = true;
  }

  /*
    styles:
    - .frame is a 3-column grid (left arrow / viewport / right arrow)
    - .viewport hides overflow so only one slide is visible at a time
    - .track is flex row of slides and we translate it based on index
    - ::slotted ensures each slide is exactly 100% width of the viewport
  */
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          background-color: var(
            --ddd-accent-2,
            var(--ddd-theme-default-skyLight)
          );
          color: var(--ddd-primary-17, var(--ddd-theme-default-coalyGray));
          border-radius: var(--ddd-radius-lg);
          box-sizing: border-box;
        }

        .frame {
          display: grid;
          grid-template-columns: 44px 1fr 44px;
          gap: var(--ddd-spacing-4);
          align-items: center;
          padding: var(--ddd-spacing-6);
        }

        /* "window" that shows only one slide */
        .viewport {
          overflow: hidden;
          border-radius: var(--ddd-radius-lg);
          background: transparent;
        }

        /* the long row of slides */
        .track {
          display: flex;
          width: 100%;
          transition: transform 250ms ease;
        }

        /* each slotted slide is exactly one viewport wide */
        ::slotted(play-list-slide) {
          flex: 0 0 100%;
          box-sizing: border-box;
        }

        /* dot navigation area */
        .footer {
          display: flex;
          justify-content: flex-start;
          padding: 0 var(--ddd-spacing-6) var(--ddd-spacing-6)
            var(--ddd-spacing-6);
        }

        /* make it usable on smaller screens */
        @media (max-width: 700px) {
          .frame {
            grid-template-columns: 44px 1fr 44px;
            padding: var(--ddd-spacing-4);
            gap: var(--ddd-spacing-2);
          }
          .footer {
            padding: 0 var(--ddd-spacing-4) var(--ddd-spacing-4)
              var(--ddd-spacing-4);
          }
        }
      `,
    ];
  }

  /*
    firstUpdated:
    after the component first renders, we can safely read the slot content
  */
  firstUpdated() {
    this._syncSlidesFromSlot();
  }

  /*
    _syncSlidesFromSlot:
    - reads assigned elements from the slot
    - counts only <play-list-slide> tags
    - updates slideCount
    - clamps index so it stays within bounds
  */
  _syncSlidesFromSlot() {
    const slot = this.shadowRoot.querySelector("slot");
    if (!slot) return;

    // grab all elements placed in the slot (LightDOM children)
    const slides = slot
      .assignedElements({ flatten: true })
      .filter((el) => el.tagName.toLowerCase() === "play-list-slide");

    // update number of slides
    this.slideCount = slides.length;

    // make sure index stays valid
    if (this.slideCount > 0) {
      this.index = Math.max(0, Math.min(this.index, this.slideCount - 1));
    } else {
      this.index = 0;
    }
  }

  /*
    _goTo:
    jump to a specific slide index (clamped)
  */
  _goTo(i) {
    if (this.slideCount === 0) return;
    const next = Math.max(0, Math.min(i, this.slideCount - 1));
    this.index = next;
  }

  /*
    _goNext:
    advance to the next slide
    if wrap is on, loop back to 0 at the end
  */
  _goNext() {
    if (this.slideCount === 0) return;

    if (this.wrap) {
      this.index = (this.index + 1) % this.slideCount;
      return;
    }

    this._goTo(this.index + 1);
  }

  /*
    _goPrev:
    go to the previous slide
    if wrap is on, loop to the last slide when going left from 0
  */
  _goPrev() {
    if (this.slideCount === 0) return;

    if (this.wrap) {
      this.index = (this.index - 1 + this.slideCount) % this.slideCount;
      return;
    }

    this._goTo(this.index - 1);
  }

  /*
    event handler for dot clicks
    slide-indicator dispatches "play-list-index-changed" with detail.index
  */
  _onDotIndexChanged(e) {
    const idx = Number(e.detail.index);
    this._goTo(idx);
  }

  /*
    event handler for arrow clicks
    slide-arrow dispatches "play-list-arrow" with detail.direction
  */
  _onArrow(e) {
    const dir = e.detail.direction;
    if (dir === "left") this._goPrev();
    if (dir === "right") this._goNext();
  }

  /*
    render:
    - translate moves the track so the current slide is visible
    - disabled states are only used when wrap is false
    - arrows + dots communicate through custom events
  */
  render() {
    const translate = `translateX(-${this.index * 100}%)`;
    const leftDisabled = !this.wrap && this.index === 0;
    const rightDisabled = !this.wrap && this.index === this.slideCount - 1;

    return html`
      <!-- listen for play-list-arrow events coming from slide-arrow -->
      <div class="frame" @play-list-arrow=${this._onArrow}>
        <slide-arrow direction="left" .disabled=${leftDisabled}></slide-arrow>

        <!-- viewport hides overflow, track slides left/right -->
        <div class="viewport">
          <div class="track" style="transform:${translate}">
            <!-- slotchange runs when LightDOM slides are added/removed -->
            <slot @slotchange=${this._syncSlidesFromSlot}></slot>
          </div>
        </div>

        <slide-arrow direction="right" .disabled=${rightDisabled}></slide-arrow>
      </div>

      <!-- dots; listen for play-list-index-changed event -->
      <div class="footer">
        <slide-indicator
          .count=${this.slideCount}
          .activeIndex=${this.index}
          @play-list-index-changed=${this._onDotIndexChanged}
        ></slide-indicator>
      </div>
    `;
  }
}

// register the custom element with the browser
globalThis.customElements.define(PlayListProject.tag, PlayListProject);
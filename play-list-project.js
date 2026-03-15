/**
 * Copyright 2026 Sydney Anne Reiter
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";

import "./play-list-slide.js";
import "./slide-arrow.js";
import "./slide-indicator.js";

export class PlayListProject extends DDDSuper(LitElement) {
  static get tag() {
    return "play-list-project";
  }

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
    this.index = 0;
    this.slideCount = 0;
    this.wrap = true;
    this.__observer = null;
    this.__isAutoScrolling = false;
    this.__scrollTimer = null;
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          box-sizing: border-box;
          width: 100%;
          max-width: 920px;
          position: relative;
          background: transparent;
          border: 0;
          box-shadow: none;
          margin: 0;
          padding: 0;
        }

        .shell {
          position: relative;
          width: 100%;
        }

        .viewport {
          position: relative;
          height: 420px;
          background: #eef2f5;
          border-radius: 10px;
          box-sizing: border-box;
          overflow: hidden;
          padding: 28px 28px 56px 28px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
        }

        .viewport::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image:
            linear-gradient(
              120deg,
              transparent 0 42%,
              rgba(255, 255, 255, 0.35) 42% 46%,
              transparent 46% 100%
            );
          background-size: 112px 56px;
          opacity: 0.28;
        }

        .slides {
          position: relative;
          z-index: 1;
          height: 100%;
          overflow-x: auto;
          overflow-y: hidden;
          scroll-behavior: smooth;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .slides::-webkit-scrollbar {
          display: none;
        }

        slot {
          display: flex;
          height: 100%;
          width: 100%;
        }

        ::slotted(play-list-slide) {
          flex: 0 0 100%;
          width: 100%;
          min-width: 100%;
          height: 100%;
          scroll-snap-align: start;
          box-sizing: border-box;
        }

        .left-arrow,
.right-arrow {
  position: absolute;
  top: calc(50% - 21px);
  z-index: 3;
}

        .left-arrow {
          left: -18px;
        }

        .right-arrow {
          right: -18px;
        }

        .dots {
          position: absolute;
          left: 83px;
          bottom: 22px;
          z-index: 3;
        }

        @media (max-width: 900px) {
          :host {
            max-width: 100%;
          }

          .viewport {
            height: 390px;
          }
        }

        @media (max-width: 700px) {
          .viewport {
            height: 320px;
            padding: 18px 18px 44px 18px;
            border-radius: 8px;
          }

          .left-arrow {
            left: -10px;
          }

          .right-arrow {
            right: -10px;
          }

          .dots {
            left: 30px;
            bottom: 14px;
          }
        }
      `,
    ];
  }

  firstUpdated() {
    this._syncSlidesFromSlot();
    this._setupObserver();
    this.updateComplete.then(() => this._scrollToIndex(this.index, false));
  }

  updated(changedProperties) {
    if (changedProperties.has("index")) {
      this._scrollToIndex(this.index, true);
    }
  }

  disconnectedCallback() {
    if (this.__observer) {
      this.__observer.disconnect();
      this.__observer = null;
    }

    clearTimeout(this.__scrollTimer);
    super.disconnectedCallback();
  }

  _setupObserver() {
    const slidesEl = this.shadowRoot.querySelector(".slides");
    if (!slidesEl) return;

    this.__observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible || this.__isAutoScrolling) return;

        const slides = this._getSlides();
        const foundIndex = slides.indexOf(visible.target);

        if (foundIndex !== -1 && foundIndex !== this.index) {
          this.index = foundIndex;
        }
      },
      {
        root: slidesEl,
        threshold: 0.6,
      }
    );

    this._getSlides().forEach((slide) => this.__observer.observe(slide));
  }

  _getSlides() {
    const slot = this.shadowRoot?.querySelector("slot");
    if (!slot) return [];

    return slot
      .assignedElements({ flatten: true })
      .filter((el) => el.tagName.toLowerCase() === "play-list-slide");
  }

  _syncSlidesFromSlot() {
    const slides = this._getSlides();
    this.slideCount = slides.length;

    if (this.slideCount === 0) {
      this.index = 0;
      return;
    }

    this.index = Math.max(0, Math.min(this.index, this.slideCount - 1));

    if (this.__observer) {
      this.__observer.disconnect();
      slides.forEach((slide) => this.__observer.observe(slide));
    }

    this.updateComplete.then(() => this._scrollToIndex(this.index, false));
  }

  _scrollToIndex(index, smooth = true) {
    const slidesEl = this.shadowRoot?.querySelector(".slides");
    const slides = this._getSlides();
    const target = slides[index];

    if (!slidesEl || !target) return;

    this.__isAutoScrolling = true;

    slidesEl.scrollTo({
      left: target.offsetLeft,
      behavior: smooth ? "smooth" : "auto",
    });

    if (!smooth) {
      this.__isAutoScrolling = false;
      return;
    }

    clearTimeout(this.__scrollTimer);
    this.__scrollTimer = setTimeout(() => {
      this.__isAutoScrolling = false;
    }, 450);
  }

  _goTo(i) {
    if (this.slideCount === 0) return;
    this.index = Math.max(0, Math.min(i, this.slideCount - 1));
  }

  _goNext() {
    if (this.slideCount === 0) return;

    if (this.wrap) {
      this.index = (this.index + 1) % this.slideCount;
    } else {
      this.index = Math.min(this.index + 1, this.slideCount - 1);
    }
  }

  _goPrev() {
    if (this.slideCount === 0) return;

    if (this.wrap) {
      this.index = (this.index - 1 + this.slideCount) % this.slideCount;
    } else {
      this.index = Math.max(this.index - 1, 0);
    }
  }

  _onDotIndexChanged(e) {
    this._goTo(Number(e.detail.index));
  }

  _onArrow(e) {
    if (e.detail.direction === "left") {
      this._goPrev();
    } else {
      this._goNext();
    }
  }

  render() {
    const leftDisabled = !this.wrap && this.index === 0;
    const rightDisabled = !this.wrap && this.index === this.slideCount - 1;

    return html`
      <div class="shell" @play-list-arrow=${this._onArrow}>
        <slide-arrow
          class="left-arrow"
          direction="left"
          .disabled=${leftDisabled}
        ></slide-arrow>

        <div class="viewport">
          <div class="slides">
            <slot @slotchange=${this._syncSlidesFromSlot}></slot>
          </div>

          <div class="dots">
            <slide-indicator
              .count=${this.slideCount}
              .activeIndex=${this.index}
              @play-list-index-changed=${this._onDotIndexChanged}
            ></slide-indicator>
          </div>
        </div>

        <slide-arrow
          class="right-arrow"
          direction="right"
          .disabled=${rightDisabled}
        ></slide-arrow>
      </div>
    `;
  }
}

globalThis.customElements.define(PlayListProject.tag, PlayListProject);
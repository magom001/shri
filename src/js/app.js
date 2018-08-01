import "babel-polyfill";
import "classlist-polyfill";
import isMobile from "is-mobile";

import { Modal } from "./Modal";
import { PageScroll } from "./PageScroll";

class App {
  constructor() {
    this.cancelScroll = this.cancelScroll.bind(this);
    this.scroll = this.scroll.bind(this);
    this.IS_MOBILE = isMobile();
    this.init();
  }

  init() {
    this.setupModal();
    if (!this.IS_MOBILE) {
      this.setupSelectedScenariosScroll();
      this.setupSelectedAppliancesScroll();
      this.setupMainWidgetScroll();
    }
  }

  cancelScroll() {
    this.isScrolling = false;
    cancelAnimationFrame(this.requestID);
  }

  scroll(value) {
    this.isScrolling = true;
    this.widgetAppliancesContent.scrollLeft += value;

    if (this.widgetAppliancesContent.scrollLeft > 0) {
      this.widgetAppliancesScrollLeftBtn.removeAttribute("disabled");
    } else {
      this.widgetAppliancesScrollLeftBtn.setAttribute("disabled", true);
      this.cancelScroll();
      return;
    }

    if (
      this.widgetAppliancesContent.scrollLeft <
      this.widgetAppliancesContentScrollWidth -
        this.widgetAppliancesContentWidth
    ) {
      this.widgetAppliancesScrollRightBtn.removeAttribute("disabled");
    } else {
      this.widgetAppliancesScrollRightBtn.setAttribute("disabled", true);
      this.cancelScroll();
      return;
    }

    this.requestID = requestAnimationFrame(() => this.scroll(value));
  }

  setupModal() {
    this.modal = new Modal();

    document.addEventListener(
      "click",
      e => {
        if (e.target.classList.contains("action-box")) {
          this.modal.openModal(e.target);
        }
      },
      true
    );
  }

  /**
   *
   * Setup selected appliances horizontal scroll
   *
   */
  setupSelectedAppliancesScroll() {
    this.widgetAppliancesScrollRightBtn = document
      .querySelector(".widget-appliances__scroll")
      .querySelector(".widget__scroll_right");
    this.widgetAppliancesScrollLeftBtn = document
      .querySelector(".widget-appliances__scroll")
      .querySelector(".widget__scroll_left");
    this.widgetAppliancesContent = document.querySelector(
      ".widget-appliances__content"
    );
    this.widgetAppliancesContentWidth = this.widgetAppliancesContent.getBoundingClientRect().width;
    this.widgetAppliancesContentScrollWidth = this.widgetAppliancesContent.scrollWidth;

    this.widgetAppliancesContent.addEventListener("wheel", e => {
      this.scroll(e.deltaY);
      this.cancelScroll();
    });

    this.widgetAppliancesScrollLeftBtn.addEventListener("mousedown", () => {
      this.scroll(-10);
    });

    this.widgetAppliancesScrollRightBtn.addEventListener("mousedown", () => {
      this.scroll(10);
    });
    document.addEventListener("mouseup", () => {
      if (this.isScrolling) {
        this.cancelScroll();
      }
    });
  }

  /**
   *
   * Selected scenarios full page scroll
   *
   */
  setupSelectedScenariosScroll() {
    this.leftBtn = document
      .getElementById("scenarios-scroll")
      .querySelector(".widget__scroll_left");
    this.rightBtn = document
      .getElementById("scenarios-scroll")
      .querySelector(".widget__scroll_right");
    this.target = document.getElementById("scenarios-pages");
    new PageScroll(this.leftBtn, this.rightBtn, this.target);
  }

  /**
   * Main widget right column scroll
   */
  setupMainWidgetScroll() {
    this.rightColumn = document.querySelector(".widget-main__column_right");
    this.rightColumnFirstChild = this.rightColumn.firstElementChild;
    this.scrollIndicator = document.querySelector(
      ".widget-main__scroll-indicator"
    );
    this.rightColumn.addEventListener("scroll", () => {
      const rcRect = this.rightColumn.getBoundingClientRect();
      const rcFcRect = this.rightColumnFirstChild.getBoundingClientRect();

      if (Math.floor(rcRect.top + 20) > Math.ceil(rcFcRect.top)) {
        this.scrollIndicator.classList.add(
          "widget-main__scroll-indicator--hidden"
        );
      } else {
        this.scrollIndicator.classList.remove(
          "widget-main__scroll-indicator--hidden"
        );
      }
    });
  }
}

new App();

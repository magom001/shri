import "babel-polyfill";
import "classlist-polyfill";

import { Modal } from "./Modal";
import { PageScroll } from "./PageScroll";

class App {
  constructor() {
    this.init();
  }

  init() {
    this.setupSelectedScenariosScroll();
    this.setupModal();
    this.setupMainWidgetScroll();
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

import "babel-polyfill";
import "classlist-polyfill";

import { Dial } from "./Dial";
import { Scroll } from "./Scroll";

const dials = document.querySelectorAll(".dial");
if (dials.length) {
  for (const dial of dials) {
    new Dial(dial);
  }
}

const leftBtn = document
  .getElementById("scenarios-scroll")
  .querySelector(".widget__scroll_left");
const rightBtn = document
  .getElementById("scenarios-scroll")
  .querySelector(".widget__scroll_right");
const target = document.getElementById("scenarios-pages");
new Scroll(leftBtn, rightBtn, target);

const modal = document.querySelector(".modal");
const modalControls = document.querySelector(".modal__controls");
const closeModalButton = document.getElementById("closeModal");

closeModalButton.addEventListener("click", () => {
  closeModal();
});

/**
 * Opening modal with animation
 */
document.addEventListener(
  "click",
  e => {
    if (e.target.classList.contains("action-box")) {
      openModal(e.target);
    }
  },
  true
);

/**
 * TODO: NEED TO POPULATE THE MODAL BEFORE ANIMATION
 */

function openModal(eventSource) {
  // Get event sources dimensions
  const sourceValues = eventSource.getBoundingClientRect();
  const modalWrapper = document.querySelector(".modal__wrapper");

  // Get the modal's init values;
  const { x, y, width, height } = modalWrapper.getBoundingClientRect();

  // Change modal's position to absolute and resize to initial values
  modalWrapper.style.position = "absolute";
  restore();

  // Request next animation frame and position on top of the event source
  requestAnimationFrame(reposition);

  function reposition() {
    modalWrapper.style.top = `${sourceValues.y}px`;
    modalWrapper.style.left = `${sourceValues.x}px`;

    // Scale to the source proportions
    modalWrapper.style.transform = `scaleX(${sourceValues.width /
      width}) scaleY(${sourceValues.height / height})`;

    modal.classList.add("modal_visible");

    // Add animation class
    requestAnimationFrame(() => {
      modalWrapper.classList.add("ready");
      // Ready to animate
      requestAnimationFrame(restore);
    });
  }

  function restore() {
    modalWrapper.addEventListener("transitionend", restorePosition);
    modalWrapper.style.top = `${y}px`;
    modalWrapper.style.left = `${x}px`;
    modalWrapper.style.width = `${width}px`;
    modalWrapper.style.height = `${height}px`;
    modalWrapper.style.transform = `scaleX(1) scaleY(1)`;
  }
  function restorePosition() {
    modalWrapper.removeEventListener("transitionend", restorePosition);
    modalWrapper.style = "";
    modalWrapper.classList.remove("ready");
    modalControls.classList.add("modal__controls_visible");
  }
}

function closeModal() {
  modal.classList.remove("modal_visible");
  modalControls.classList.remove("modal__controls_visible");
}

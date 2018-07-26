import "babel-polyfill";
import "classlist-polyfill";
import isMobile from "is-mobile";

import { Dial } from "./Dial";
import { Scroll } from "./Scroll";

const IS_MOBILE = isMobile();

const INPUT_TYPES = {
  RANGE_SLIDER: "range",
  RADIAL_SLIDER: "radial"
};

const modalContent = document.querySelector(".modal__content");
const modalContentInfo = modalContent.getBoundingClientRect();
// <span class="input-range input-range_rainbow" data-range-min="-18" data-range-max="+30">
const sliderContainer = document.createElement("span");
sliderContainer.setAttribute("data-range-min", "-18");
sliderContainer.setAttribute("data-range-max", "+30");

sliderContainer.classList.add("range-slider");
sliderContainer.classList.add("range-slider_rainbow");
if (IS_MOBILE) {
  sliderContainer.style.width = `${modalContentInfo.height}px`;
}

// <input type="range" min="18" max="30" />
const slider = document.createElement("input");
slider.setAttribute("type", "range");
slider.setAttribute("min", "-18");
slider.setAttribute("max", "30");
slider.setAttribute("value", "23");

// add slider to modal content
sliderContainer.appendChild(slider);
modalContent.appendChild(sliderContainer);
sliderContainer.style.display = "none";

// create a range slider
// <input data-size="221" type="range" class="dial" value="0" min="-30" max="30" />
const radialDial = document.createElement("input");
radialDial.setAttribute("type", "range");
let dialSize;
if (IS_MOBILE) {
  dialSize = Math.min(modalContentInfo.height, modalContentInfo.width);
} else {
  dialSize = 220;
}
radialDial.setAttribute("data-size", `${dialSize}`);
radialDial.classList.add("dial");
radialDial.setAttribute("value", "0");
radialDial.setAttribute("min", "-10");
radialDial.setAttribute("max", "30");

modalContent.appendChild(radialDial);
const radialDialInstance = new Dial(radialDial);
radialDialInstance.hideDial();

/**
 * Left scroll
 */
const leftBtn = document
  .getElementById("scenarios-scroll")
  .querySelector(".widget__scroll_left");
const rightBtn = document
  .getElementById("scenarios-scroll")
  .querySelector(".widget__scroll_right");
const target = document.getElementById("scenarios-pages");
new Scroll(leftBtn, rightBtn, target);

const globalWrapper = document.getElementById("page-wrapper");
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
  // determine type of input for the appliance
  const {
    type = INPUT_TYPES.RANGE_SLIDER,
    min = "-7",
    max = "29",
    value = "17"
  } = eventSource.dataset;

  switch (type) {
    case INPUT_TYPES.RANGE_SLIDER:
      sliderContainer.setAttribute("data-range-min", `${min}`);
      sliderContainer.setAttribute("data-range-max", `+${max}`);
      slider.value = value;
      slider.setAttribute("min", min);
      slider.setAttribute("max", max);
      sliderContainer.style.display = "block";
      break;
    case INPUT_TYPES.RADIAL_SLIDER:
      radialDial.setAttribute("value", value);
      radialDial.setAttribute("min", min);
      radialDial.setAttribute("max", max);
      radialDialInstance.repaintDial();
      radialDialInstance.unhideDial();
      break;
    default:
      break;
  }

  // Get event sources dimensions
  const sourceValues = eventSource.getBoundingClientRect();
  const modalWrapper = document.querySelector(".modal__wrapper");

  // Get the modal's init values;
  let { x, y, left, top, width, height } = modalWrapper.getBoundingClientRect();

  // IE and Edge fix
  x = x || left;
  y = y || top;

  // Change modal's position to absolute and resize to initial values
  modalWrapper.style.position = "absolute";
  restore();

  // Request next animation frame and position on top of the event source
  requestAnimationFrame(reposition);

  function reposition() {
    modalWrapper.style.top = `${sourceValues.y || sourceValues.top}px`;
    modalWrapper.style.left = `${sourceValues.x || sourceValues.left}px`;

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
    globalWrapper.classList.add("blurred");
    modalWrapper.addEventListener("transitionend", restorePosition);
    modalWrapper.style.top = `${y}px`;
    modalWrapper.style.left = `${x}px`;
    modalWrapper.style.width = `${width}px`;
    modalWrapper.style.height = `${height}px`;
    modalWrapper.style.transform = `scaleX(1) scaleY(1)`;
  }
  function restorePosition() {
    modalWrapper.removeEventListener("transitionend", restorePosition);
    modalWrapper.style.cssText = "";
    document.body.classList.add("frozen");
    modalWrapper.classList.remove("ready");
    modalControls.classList.add("modal__controls_visible");
  }
}

function closeModal() {
  radialDialInstance.hideDial();
  sliderContainer.style.display = "none";

  globalWrapper.classList.remove("blurred");
  modal.classList.remove("modal_visible");
  document.body.classList.remove("frozen");
  modalControls.classList.remove("modal__controls_visible");
}

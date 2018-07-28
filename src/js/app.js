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

const content = document.querySelector(".content");

const modalContent = document.querySelector(".modal__content");
const modalWrapper = document.querySelector(".modal__wrapper");
const modalDeviceType = modalWrapper.querySelector("[device-type]");
const modalDeviceName = modalWrapper.querySelector("[device-name]");
const modalDeviceStatus = modalWrapper.querySelector("[device-status]");
const modalDeviceIndication = modalWrapper.querySelector("[device-indication]");
const modalContentInfo = modalContent.getBoundingClientRect();
// <span class="input-range input-range_rainbow" data-range-min="-18" data-range-max="+30">
const sliderContainer = document.createElement("span");
sliderContainer.setAttribute("data-range-min", "-18");
sliderContainer.setAttribute("data-range-max", "+30");

sliderContainer.classList.add("range-slider");
if (IS_MOBILE) {
  sliderContainer.style.width = `${modalContentInfo.height}px`;
}

// <input type="range" min="18" max="30" />
const slider = document.createElement("input");
slider.setAttribute("type", "range");
slider.setAttribute("min", "-18");
slider.setAttribute("max", "30");
slider.addEventListener("input", event => {
  modalDeviceIndication.textContent =
    event.target.value > 0 ? `+${event.target.value}` : event.target.value;
});

// add slider to modal content
sliderContainer.appendChild(slider);
modalContent.appendChild(sliderContainer);
sliderContainer.style.display = "none";

// create a radial dial input
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

radialDial.addEventListener("input", event => {
  modalDeviceIndication.textContent =
    event.target.value > 0 ? `+${event.target.value}` : event.target.value;
});

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
  // Get event sources dimensions
  const sourceValues = eventSource.getBoundingClientRect();

  // determine type of input for the appliance
  const {
    type = INPUT_TYPES.RANGE_SLIDER,
    min = "-7",
    max = "29",
    value = "+17",
    active = "",
    device,
    status = ""
  } = eventSource.dataset;
  let deviceType = eventSource
    .querySelector("[device-type]")
    .getAttribute("device-type");

  if (!deviceType) deviceType = "temperature";

  modalDeviceType.setAttribute("device-type", deviceType);
  modalDeviceType.setAttribute("device-active", active);
  modalDeviceName.textContent = device;
  modalDeviceStatus.textContent = status;
  modalDeviceIndication.textContent = value;

  switch (type) {
    case INPUT_TYPES.RANGE_SLIDER:
      sliderContainer.setAttribute("data-range-min", `${min}`);
      sliderContainer.setAttribute("data-range-max", `+${max}`);
      slider.value = parseInt(value, 10);
      slider.setAttribute("min", min);
      slider.setAttribute("max", max);
      sliderContainer.setAttribute("device-type", deviceType);
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
    radialDialInstance.getCenterCoords();
    modalWrapper.style.cssText = "";
    content.classList.add("frozen");
    modalWrapper.classList.remove("ready");
    modalControls.classList.add("modal__controls_visible");
  }
}

function closeModal() {
  radialDialInstance.hideDial();
  sliderContainer.style.display = "none";

  globalWrapper.classList.remove("blurred");
  modal.classList.remove("modal_visible");
  content.classList.remove("frozen");
  modalControls.classList.remove("modal__controls_visible");
}

/**
 * Main widget right column scroll
 */

const rightColumn = document.querySelector(".widget-main__column_right");
const rightColumnFirstChild = rightColumn.firstElementChild;
const scrollIndicator = document.querySelector(
  ".widget-main__scroll-indicator"
);
rightColumn.addEventListener("scroll", () => {
  const rcRect = rightColumn.getBoundingClientRect();
  const rcFcRect = rightColumnFirstChild.getBoundingClientRect();

  if (Math.floor(rcRect.top + 20) > Math.ceil(rcFcRect.top)) {
    scrollIndicator.classList.add("widget-main__scroll-indicator--hidden");
  } else {
    scrollIndicator.classList.remove("widget-main__scroll-indicator--hidden");
  }
});

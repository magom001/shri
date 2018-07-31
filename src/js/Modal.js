import isMobile from "is-mobile";
import { Dial } from "./Dial";

export class Modal {
  constructor() {
    this.IS_MOBILE = isMobile();

    this.INPUT_TYPES = {
      RANGE_SLIDER: "range",
      RADIAL_SLIDER: "radial"
    };

    this.restorePosition = this.restorePosition.bind(this);
    this.restore = this.restore.bind(this);
    this.openModal = this.openModal.bind(this);
    this.reposition = this.reposition.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.init();
  }

  init() {
    this.getModalStructure();
    this.setupSlider();
    this.setupRadialDial();
  }

  getModalStructure() {
    this.content = document.querySelector(".content");
    this.globalWrapper = document.getElementById("page-wrapper");
    this.modal = document.querySelector(".modal");
    this.modalControls = document.querySelector(".modal__controls");
    this.closeModalButton = document.getElementById("closeModal");

    this.closeModalButton.addEventListener("click", () => {
      this.closeModal();
    });

    this.modalContent = document.querySelector(".modal__content");
    this.modalWrapper = document.querySelector(".modal__wrapper");
    this.modalDeviceType = this.modalWrapper.querySelector("[device-type]");
    this.modalDeviceName = this.modalWrapper.querySelector("[device-name]");
    this.modalDeviceStatus = this.modalWrapper.querySelector("[device-status]");
    this.modalDeviceIndication = this.modalWrapper.querySelector(
      "[device-indication]"
    );
    this.modalContentInfo = this.modalContent.getBoundingClientRect();
  }

  setupSlider() {
    // Example: <span class="input-range input-range_rainbow" data-range-min="-18" data-range-max="+30">
    this.sliderContainer = document.createElement("span");
    this.sliderContainer.setAttribute("data-range-min", "-18");
    this.sliderContainer.setAttribute("data-range-max", "+30");

    this.sliderContainer.classList.add("range-slider");
    if (this.IS_MOBILE) {
      this.sliderContainer.style.width = `${this.modalContentInfo.height}px`;
    }

    this.slider = document.createElement("input");
    this.slider.setAttribute("type", "range");
    this.slider.setAttribute("min", "-18");
    this.slider.setAttribute("max", "30");
    this.slider.addEventListener("input", event => {
      this.modalDeviceIndication.textContent =
        event.target.value > 0 ? `+${event.target.value}` : event.target.value;
    });

    this.sliderContainer.appendChild(this.slider);
    this.modalContent.appendChild(this.sliderContainer);
    this.sliderContainer.style.display = "none";
  }

  setupRadialDial() {
    this.radialDial = document.createElement("input");
    this.radialDial.setAttribute("type", "range");
    this.dialSize;
    if (this.IS_MOBILE) {
      this.dialSize = Math.min(
        this.modalContentInfo.height,
        this.modalContentInfo.width
      );
    } else {
      this.dialSize = 220;
    }
    this.radialDial.setAttribute("data-size", `${this.dialSize}`);
    this.radialDial.classList.add("dial");
    this.radialDial.setAttribute("value", "0");
    this.radialDial.setAttribute("min", "-10");
    this.radialDial.setAttribute("max", "30");

    this.modalContent.appendChild(this.radialDial);

    this.radialDial.addEventListener("input", event => {
      this.modalDeviceIndication.textContent =
        event.target.value > 0 ? `+${event.target.value}` : event.target.value;
    });

    this.radialDialInstance = new Dial(this.radialDial);
    this.radialDialInstance.hideDial();
  }

  restorePosition() {
    this.modalWrapper.removeEventListener(
      "transitionend",
      this.restorePosition
    );
    this.radialDialInstance.getCenterCoords();
    this.modalWrapper.style.cssText = "";
    this.content.classList.add("frozen");
    this.modalWrapper.classList.remove("ready");
    this.modalControls.classList.add("modal__controls_visible");
  }

  restore({ x, y, width, height }) {
    this.globalWrapper.classList.add("blurred");
    this.modalWrapper.addEventListener("transitionend", this.restorePosition);
    this.modalWrapper.style.top = `${y}px`;
    this.modalWrapper.style.left = `${x}px`;
    this.modalWrapper.style.width = `${width}px`;
    this.modalWrapper.style.height = `${height}px`;
    this.modalWrapper.style.transform = `scaleX(1) scaleY(1)`;
  }

  reposition({ sourceValues, x, y, height, width }) {
    this.modalWrapper.style.top = `${sourceValues.y || sourceValues.top}px`;
    this.modalWrapper.style.left = `${sourceValues.x || sourceValues.left}px`;

    // Scale to the source proportions
    this.modalWrapper.style.transform = `scaleX(${sourceValues.width /
      width}) scaleY(${sourceValues.height / height})`;

    this.modal.classList.add("modal_visible");

    // Add animation class
    requestAnimationFrame(() => {
      this.modalWrapper.classList.add("ready");
      // Ready to animate
      requestAnimationFrame(() => {
        this.restore({ x, y, width, height });
      });
    });
  }

  openModal(eventSource) {
    // Get event sources dimensions
    const sourceValues = eventSource.getBoundingClientRect();

    // determine type of input for the appliance
    const {
      type = this.INPUT_TYPES.RANGE_SLIDER,
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

    this.modalDeviceType.setAttribute("device-type", deviceType);
    this.modalDeviceType.setAttribute("device-active", active);
    this.modalDeviceName.textContent = device;
    this.modalDeviceStatus.textContent = status;
    this.modalDeviceIndication.textContent = value;

    switch (type) {
      case this.INPUT_TYPES.RANGE_SLIDER:
        this.sliderContainer.setAttribute("data-range-min", `${min}`);
        this.sliderContainer.setAttribute("data-range-max", `+${max}`);
        this.slider.value = parseInt(value, 10);
        this.slider.setAttribute("min", min);
        this.slider.setAttribute("max", max);
        this.sliderContainer.setAttribute("device-type", deviceType);
        this.sliderContainer.style.display = "block";
        break;
      case this.INPUT_TYPES.RADIAL_SLIDER:
        this.radialDial.setAttribute("value", value);
        this.radialDial.setAttribute("min", min);
        this.radialDial.setAttribute("max", max);
        this.radialDialInstance.repaintDial();
        this.radialDialInstance.unhideDial();
        break;
      default:
        break;
    }

    // Get the modal's init values;
    let {
      x,
      y,
      left,
      top,
      width,
      height
    } = this.modalWrapper.getBoundingClientRect();

    // IE and Edge fix
    x = x || left;
    y = y || top;

    // Change modal's position to absolute and resize to initial values
    this.modalWrapper.style.position = "absolute";
    this.restore({ x, y, width, height });

    // Request next animation frame and position on top of the event source
    requestAnimationFrame(() => {
      this.reposition({ sourceValues, x, y, height, width });
    });
  }

  closeModal() {
    this.radialDialInstance.hideDial();
    this.sliderContainer.style.display = "none";

    this.globalWrapper.classList.remove("blurred");
    this.modal.classList.remove("modal_visible");
    this.content.classList.remove("frozen");
    this.modalControls.classList.remove("modal__controls_visible");
  }
}

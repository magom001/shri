import "babel-polyfill";

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
const closeModalButton = document.getElementById("closeModal");

closeModalButton.addEventListener("click", () => {
  closeModal();
});

document.addEventListener(
  "click",
  e => {
    if (e.target.classList.contains("action-box")) {
      openModal();
    }
  },
  true
);

function openModal() {
  modal.style.visibility = "visible";
}

function closeModal() {
  modal.style.visibility = "hidden";
}

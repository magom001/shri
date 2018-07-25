import "babel-polyfill";

import { Dial } from "./Dial";

const dials = document.querySelectorAll(".dial");
if (dials.length) {
  for (const dial of dials) {
    new Dial(dial);
  }
}

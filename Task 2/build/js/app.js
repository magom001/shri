"use strict";

function mapScaleToRange(v, min, max, range) {
  var step = range / (max - min);
  return Math.floor(v / step + min);
}

function rotateKnob(v, range) {
  var arcPerDegree = range / 360;
  return v / arcPerDegree;
}

var range = document.getElementById("test-range");
var scale = document.getElementById("scale");
var display = document.getElementById("display");
var knob = document.getElementById("knob");
range.addEventListener("input", function (e) {
  display.childNodes[0].textContent = "+".concat(mapScaleToRange(e.target.value, 18, 30, 1194));
  knob.setAttribute("transform", "rotate(".concat(rotateKnob(e.target.value, 1194), " 0 0)"));
  scale.style.strokeDashoffset = 1194 - e.target.value;
});
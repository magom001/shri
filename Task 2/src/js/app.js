function mapScaleToRange(v, min, max, range) {
  const step = range / (max - min);
  return Math.floor(v / step + min);
}

function rotateKnob(v, range) {
  const arcPerDegree = range / 360;

  return v / arcPerDegree;
}

const range = document.getElementById("test-range");
const scale = document.getElementById("scale");
const display = document.getElementById("display");
const knob = document.getElementById("knob");

range.addEventListener("input", e => {
  display.childNodes[0].textContent = `+${mapScaleToRange(
    e.target.value,
    18,
    30,
    1194
  )}`;
  knob.setAttribute(
    "transform",
    `rotate(${rotateKnob(e.target.value, 1194)} 0 0)`
  );
  scale.style.strokeDashoffset = 1194 - e.target.value;
});

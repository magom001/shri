export class Dial {
  constructor(dial) {
    this.dial = dial;
    this.radius = 90;
    this.circumference = Math.PI * 2 * this.radius;
    this.isDragging = false;
    this.prevAngle;
    this.center;
    this.init();
  }

  init() {
    this.calculateMapping();

    this.dial.style.display = "none";

    this.dial.insertAdjacentHTML(
      "afterend",
      `<svg shape-rendering="geometricPrecision" width="${
        this.dial.dataset.size
      }" height="${this.dial.dataset.size}" viewBox="0 0 220 220">
    <style>
        text {
            font: 60px Verdana, Helvetica, Arial, sans-serif;
            font-weight: bold;
            fill: #333333;
            user-select: none;
        }
    </style>
    <defs>
        <circle id="sector" cx="110" cy="110" r="90" transform="rotate(120 110 110)" stroke-dashoffset="${(this
          .circumference *
          30) /
          360}" stroke-dasharray="${this.circumference -
        (this.circumference * 30) / 360}"
            stroke="white" stroke-width="20" fill="none" />
        <circle id="indicator" cx="110" cy="110" r="90" transform="rotate(120 110 110)" stroke-dasharray="565.4866776461628" stroke-width="20"
            fill="none" />
        <circle id="scale" cx="110" cy="110" r="90" transform="rotate(120 110 110)" stroke-dasharray="1 4" stroke-width="20" fill="none"
        />
  
        <filter xmlns="http://www.w3.org/2000/svg" id="dropshadow" height="130%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="0" dy="2" result="offsetblur" />
            <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>
    </defs>
    <mask id="mask">
        <use xlink:href="#sector" />
    </mask>
    <mask id="scale-mask">
        <use xlink:href="#scale" stroke="white" />
    </mask>
    <use xlink:href="#scale" mask="url(#mask)" stroke="#333333" />
    <!-- 
      stroke-dashoffset = circumference - circumference / 360 * deg
    -->
    <use xlink:href="#indicator" class="indicator" mask="url(#scale-mask)" stroke-dashoffset="500" stroke="#F5A623" />
    <circle cx="110" cy="110" r="80" fill="#fff" fill-opacity="1" filter="url(#dropshadow)" />
    <g transform="translate(110 110) rotate(-240)">
        <g class="meter" transform="rotate(57)">
            <circle cx="0" cy="0" r="70" fill="#fff" fill-opacity="1" />
            <polygon points="0,-5 5,0 0,5" style="fill:#333333;stroke:none;" transform="translate(75 0)" />
        </g>
    </g>
    <text class="display" x="110" y="130" text-anchor="middle">
        +18
    </text>
    <circle cx="110" cy="110" r="100" fill="white" fill-opacity="0" class="knob" />
  </svg>`
    );
    this.svg = this.dial.nextSibling;
    this.knob = this.svg.querySelector(".knob");
    this.meter = this.svg.querySelector(".meter");
    this.indicator = this.svg.querySelector(".indicator");
    this.display = this.svg.querySelector(".display");
    this.sector = this.svg.querySelector("#sector");

    this.getCenterCoords();

    this.knob.addEventListener("mousedown", () => {
      this.isDragging = true;
    });
    this.knob.addEventListener("touchstart", () => {
      this.isDragging = true;
    });

    window.addEventListener("mousemove", e => {
      this.update(e);
    });
    window.addEventListener("touchmove", e => {
      const [touch] = e.touches;
      this.update(touch);
    });

    window.addEventListener("mouseup", e => {
      if (this.isDragging) {
        this.isDragging = false;
      }
    });
    window.addEventListener("touchend", e => {
      if (this.isDragging) {
        this.isDragging = false;
      }
    });

    this.positionAll();

    window.addEventListener("resize", this.getCenterCoords.bind(this));
    window.addEventListener("scroll", this.getCenterCoords.bind(this));
  }

  calculateMapping() {
    this.min = parseInt(this.dial.getAttribute("min"), 10);
    this.max = parseInt(this.dial.getAttribute("max"), 10);
    this.initValue = this.dial.getAttribute("value");

    this.k = (this.max - this.min) / 300;
  }

  positionAll() {
    this.setText((this.initValue - this.min) / this.k);
    this.rotateMeter((this.initValue - this.min) / this.k);
    this.setIndicator((this.initValue - this.min) / this.k);
    this.rotateSector((this.initValue - this.min) / this.k);
  }

  repaintDial() {
    this.calculateMapping();
    this.positionAll();
    this.prevAngle = this.angle;
  }

  hideDial() {
    this.svg.style.display = "none";
  }

  unhideDial() {
    this.svg.style.display = "block";
  }

  update(e) {
    if (this.isDragging) {
      const mouseCoords = {
        x: e.clientX,
        y: e.clientY
      };
      const deltaX = this.center.x - mouseCoords.x;
      const deltaY = this.center.y - mouseCoords.y;

      let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 180;

      angle = angle - 90 < 0 ? angle + 360 - 90 : angle - 90;
      angle = angle - 30;
      angle = angle > 300 ? 300 : angle;
      angle = angle < 0 ? 0 : angle;

      if (this.prevAngle !== undefined) {
        if (Math.abs(this.prevAngle - angle) > 59) return;
      }

      this.rotateMeter(angle);
      this.rotateSector(angle);
      this.setIndicator(angle);
      this.setText(angle);
      this.prevAngle = angle;
    }
  }

  getCenterCoords() {
    const { top, left, width, height } = this.svg.getBoundingClientRect();
    this.center = {
      x: left + width / 2,
      y: top + height / 2
    };
  }

  rotateSector(angle) {
    this.sector.setAttribute("transform", `rotate(${120 + angle} 110 110)`);
    if (angle < 270) {
      this.sector.setAttribute(
        "stroke-dashoffset",
        `${(this.circumference * (30 + angle)) / 360}`
      );
      this.sector.setAttribute(
        "stroke-dasharray",
        `${this.circumference - (this.circumference * 30) / 360}`
      );
    } else {
      this.sector.setAttribute(
        "stroke-dashoffset",
        `${(this.circumference * (30 + angle)) / 360 +
          (this.circumference / 360) * (angle - 270)}`
      );
      this.sector.setAttribute(
        "stroke-dasharray",
        `${this.circumference -
          (this.circumference * 30) / 360 +
          (this.circumference / 360) * (angle - 270)}`
      );
    }
  }

  rotateMeter(angle) {
    this.meter.setAttribute("transform", `rotate(${angle})`);
  }

  setIndicator(angle) {
    const offset = this.circumference - (this.circumference / 360) * angle;
    this.indicator.setAttribute("stroke-dashoffset", offset);
  }

  mapToScale(angle) {
    return this.k * angle + this.min;
  }

  setText(angle) {
    const value = Math.round(this.mapToScale(angle));
    this.dial.value = value;

    const event = new Event("input");

    this.dial.dispatchEvent(event);

    const displayValue = value > 0 ? `+${value}` : value;
    this.display.childNodes[0].textContent = displayValue;
  }
}

"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Dial =
/*#__PURE__*/
function () {
  function Dial(dial) {
    _classCallCheck(this, Dial);

    this.dial = dial;
    this.radius = 90;
    this.circumference = Math.PI * 2 * this.radius;
    this.isDragging = false;
    this.prevAngle;
    this.center;
    this.init();
  }

  _createClass(Dial, [{
    key: "init",
    value: function init() {
      var _this = this;

      this.min = parseInt(this.dial.getAttribute("min"), 10);
      this.max = parseInt(this.dial.getAttribute("max"), 10);
      this.initValue = this.dial.getAttribute("value");
      this.k = (this.max - this.min) / 300;
      this.dial.style.display = "none";
      this.dial.insertAdjacentHTML("afterend", "<svg shape-rendering=\"geometricPrecision\" width=\"".concat(this.dial.dataset.size, "\" height=\"").concat(this.dial.dataset.size, "\" viewBox=\"0 0 220 220\">\n  <style>\n      text {\n          font: 60px Verdana, Helvetica, Arial, sans-serif;\n          font-weight: bold;\n          fill: #333333;\n          user-select: none;\n      }\n  </style>\n  <defs>\n      <circle id=\"sector\" cx=\"110\" cy=\"110\" r=\"90\" transform=\"rotate(120 110 110)\" stroke-dashoffset=\"").concat(this.circumference * 30 / 360, "\" stroke-dasharray=\"").concat(this.circumference - this.circumference * 30 / 360, "\"\n          stroke=\"white\" stroke-width=\"20\" fill=\"none\" />\n      <circle id=\"indicator\" cx=\"110\" cy=\"110\" r=\"90\" transform=\"rotate(120 110 110)\" stroke-dasharray=\"565.4866776461628\" stroke-width=\"20\"\n          fill=\"none\" />\n      <circle id=\"scale\" cx=\"110\" cy=\"110\" r=\"90\" transform=\"rotate(120 110 110)\" stroke-dasharray=\"1 4\" stroke-width=\"20\" fill=\"none\"\n      />\n\n      <filter xmlns=\"http://www.w3.org/2000/svg\" id=\"dropshadow\" height=\"130%\">\n          <feGaussianBlur in=\"SourceAlpha\" stdDeviation=\"2\" />\n          <feOffset dx=\"0\" dy=\"2\" result=\"offsetblur\" />\n          <feMerge>\n              <feMergeNode/>\n              <feMergeNode in=\"SourceGraphic\" />\n          </feMerge>\n      </filter>\n  </defs>\n  <mask id=\"mask\">\n      <use xlink:href=\"#sector\" />\n  </mask>\n  <mask id=\"scale-mask\">\n      <use xlink:href=\"#scale\" stroke=\"white\" />\n  </mask>\n  <use xlink:href=\"#scale\" mask=\"url(#mask)\" stroke=\"#333333\" />\n  <!-- \n  stroke-dashoffset = circumference - circumference / 360 * deg\n-->\n  <use xlink:href=\"#indicator\" class=\"indicator\" mask=\"url(#scale-mask)\" stroke-dashoffset=\"500\" stroke=\"#F5A623\" />\n  <circle cx=\"110\" cy=\"110\" r=\"80\" fill=\"#fff\" fill-opacity=\"1\" filter=\"url(#dropshadow)\" />\n  <g transform=\"translate(110 110) rotate(-240)\">\n      <g class=\"meter\" transform=\"rotate(57)\">\n          <circle cx=\"0\" cy=\"0\" r=\"70\" fill=\"#fff\" fill-opacity=\"1\" />\n          <polygon points=\"0,-5 5,0 0,5\" style=\"fill:#333333;stroke:none;\" transform=\"translate(75 0)\" />\n      </g>\n  </g>\n  <text class=\"display\" x=\"110\" y=\"130\" text-anchor=\"middle\">\n      +18\n  </text>\n  <circle cx=\"110\" cy=\"110\" r=\"100\" fill=\"white\" fill-opacity=\"0\" class=\"knob\" />\n</svg>"));
      this.svg = this.dial.nextSibling;
      this.knob = this.svg.querySelector(".knob");
      this.meter = this.svg.querySelector(".meter");
      this.indicator = this.svg.querySelector(".indicator");
      this.display = this.svg.querySelector(".display");
      this.getCenterCoords();
      this.knob.addEventListener("mousedown", function () {
        _this.isDragging = true;
      });
      this.knob.addEventListener("touchstart", function () {
        _this.isDragging = true;
      });
      window.addEventListener("mousemove", function (e) {
        _this.update(e);
      });
      window.addEventListener("touchmove", function (e) {
        var _e$touches = _slicedToArray(e.touches, 1),
            touch = _e$touches[0];

        _this.update(touch);
      });
      window.addEventListener("mouseup", function (e) {
        if (_this.isDragging) {
          _this.isDragging = false;
        }
      });
      window.addEventListener("touchend", function (e) {
        if (_this.isDragging) {
          _this.isDragging = false;
        }
      });
      this.setText((this.initValue - this.min) / this.k);
      this.rotateMeter((this.initValue - this.min) / this.k);
      this.setIndicator((this.initValue - this.min) / this.k);
      window.addEventListener("resize", this.getCenterCoords.bind(this));
    }
  }, {
    key: "update",
    value: function update(e) {
      if (this.isDragging) {
        var mouseCoords = {
          x: e.pageX,
          y: e.pageY
        };
        var deltaX = this.center.x - mouseCoords.x;
        var deltaY = this.center.y - mouseCoords.y;
        var angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 180;
        angle = angle - 90 < 0 ? angle + 360 - 90 : angle - 90;
        angle = angle - 30;
        angle = angle > 300 ? 300 : angle;
        angle = angle < 0 ? 0 : angle;

        if (this.prevAngle !== undefined) {
          if (Math.abs(this.prevAngle - angle) > 59) return;
        }

        this.rotateMeter(angle);
        this.setIndicator(angle);
        this.setText(angle);
        this.prevAngle = angle;
      }
    }
  }, {
    key: "getCenterCoords",
    value: function getCenterCoords() {
      var _this$svg$getBounding = this.svg.getBoundingClientRect(),
          top = _this$svg$getBounding.top,
          left = _this$svg$getBounding.left,
          width = _this$svg$getBounding.width,
          height = _this$svg$getBounding.height;

      this.center = {
        x: left + width / 2,
        y: top + height / 2
      };
    }
  }, {
    key: "rotateMeter",
    value: function rotateMeter(angle) {
      this.meter.setAttribute("transform", "rotate(".concat(angle, ")"));
    }
  }, {
    key: "setIndicator",
    value: function setIndicator(angle) {
      var offset = this.circumference - this.circumference / 360 * angle;
      this.indicator.setAttribute("stroke-dashoffset", offset);
    }
  }, {
    key: "mapToScale",
    value: function mapToScale(angle) {
      return this.k * angle + this.min;
    }
  }, {
    key: "setText",
    value: function setText(angle) {
      var value = Math.round(this.mapToScale(angle));
      this.dial.setAttribute("value", value);
      var displayValue = value > 0 ? "+".concat(value) : value;
      this.display.childNodes[0].textContent = value;
    }
  }]);

  return Dial;
}();

var dials = document.querySelectorAll(".dial");

if (dials.length) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = dials[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var dial = _step.value;
      new Dial(dial);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}
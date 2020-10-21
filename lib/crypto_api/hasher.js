'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Hasher = function () {
  function Hasher(options) {
    _classCallCheck(this, Hasher);

    this.unitSize = 4;
    this.unitOrder = 0;
    this.blockSize = 16;
    this.blockSizeInBytes = this.blockSize * this.unitSize;
    this.options = options || {};
    this.reset();
  }

  _createClass(Hasher, [{
    key: 'reset',
    value: function reset() {
      this.state = {};
      this.state.message = '';
      this.state.length = 0;
    }
  }, {
    key: 'getState',
    value: function getState() {
      return JSON.parse(JSON.stringify(this.state));
    }
  }, {
    key: 'setState',
    value: function setState(state) {
      this.state = state;
    }
  }, {
    key: 'update',
    value: function update(message) {
      this.state.message += message;
      this.state.length += message.length;
      this.process();
    }
  }, {
    key: 'process',
    value: function process() {}
  }, {
    key: 'finalize',
    value: function finalize() {
      return '';
    }
  }, {
    key: 'getStateHash',
    value: function getStateHash(size) {
      return '';
    }
  }, {
    key: 'addPaddingPKCS7',
    value: function addPaddingPKCS7(length) {
      this.state.message += new Array(length + 1).join(String.fromCharCode(length));
    }
  }, {
    key: 'addPaddingISO7816',
    value: function addPaddingISO7816(length) {
      this.state.message += "\x80" + new Array(length).join("\x00");
    }
  }, {
    key: 'addPaddingZero',
    value: function addPaddingZero(length) {
      this.state.message += new Array(length + 1).join("\x00");
    }
  }]);

  return Hasher;
}();

exports.default = Hasher;
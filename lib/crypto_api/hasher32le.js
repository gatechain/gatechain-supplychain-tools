'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _hasher = require('./hasher.js');

var _hasher2 = _interopRequireDefault(_hasher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Hasher32le = function (_Hasher) {
  _inherits(Hasher32le, _Hasher);

  function Hasher32le(options) {
    _classCallCheck(this, Hasher32le);

    var _this = _possibleConstructorReturn(this, (Hasher32le.__proto__ || Object.getPrototypeOf(Hasher32le)).call(this, options));

    _this.blockUnits = [];
    return _this;
  }

  _createClass(Hasher32le, [{
    key: 'process',
    value: function process() {
      while (this.state.message.length >= this.blockSizeInBytes) {
        this.blockUnits = [];
        for (var b = 0; b < this.blockSizeInBytes; b += 4) {
          this.blockUnits.push(this.state.message.charCodeAt(b) | this.state.message.charCodeAt(b + 1) << 8 | this.state.message.charCodeAt(b + 2) << 16 | this.state.message.charCodeAt(b + 3) << 24);
        }
        this.state.message = this.state.message.substr(this.blockSizeInBytes);
        this.processBlock(this.blockUnits);
      }
    }
  }, {
    key: 'processBlock',
    value: function processBlock(M) {}
  }, {
    key: 'getStateHash',
    value: function getStateHash(size) {
      size = size || this.state.hash.length;
      var hash = '';
      for (var i = 0; i < size; i++) {
        hash += String.fromCharCode(this.state.hash[i] & 0xff) + String.fromCharCode(this.state.hash[i] >> 8 & 0xff) + String.fromCharCode(this.state.hash[i] >> 16 & 0xff) + String.fromCharCode(this.state.hash[i] >> 24 & 0xff);
      }
      return hash;
    }
  }, {
    key: 'addLengthBits',
    value: function addLengthBits() {
      // @todo fix length to 64 bit
      this.state.message += String.fromCharCode(this.state.length << 3 & 0xff) + String.fromCharCode(this.state.length >> 5 & 0xff) + String.fromCharCode(this.state.length >> 13 & 0xff) + String.fromCharCode(this.state.length >> 21 & 0xff) + String.fromCharCode(this.state.length >> 29 & 0xff) + "\x00\x00\x00";
    }
  }]);

  return Hasher32le;
}(_hasher2.default);

exports.default = Hasher32le;
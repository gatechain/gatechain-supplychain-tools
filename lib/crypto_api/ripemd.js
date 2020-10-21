'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _hasher32le = require("./hasher32le.js");

var _hasher32le2 = _interopRequireDefault(_hasher32le);

var _tools = require("./tools.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @type {number[]} */
var ZL = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13];
/** @type {number[]} */
var ZR = [5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11];
/** @type {number[]} */
var SL = [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6];
/** @type {number[]} */
var SR = [8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11];

var Ripemd = function (_Hasher32le) {
  _inherits(Ripemd, _Hasher32le);

  function Ripemd(options) {
    _classCallCheck(this, Ripemd);

    options = options || {};
    options.length = options.length || 160;
    return _possibleConstructorReturn(this, (Ripemd.__proto__ || Object.getPrototypeOf(Ripemd)).call(this, options));
  }

  _createClass(Ripemd, [{
    key: "reset",
    value: function reset() {
      _get(Ripemd.prototype.__proto__ || Object.getPrototypeOf(Ripemd.prototype), "reset", this).call(this);
      switch (this.options.length) {
        case 128:
          this.state.hash = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476];
          this.processBlock = this.processBlock128;
          break;
        case 256:
          this.state.hash = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0x76543210, 0xfedcba98, 0x89abcdef, 0x01234567];
          this.processBlock = this.processBlock256;
          break;
        case 320:
          this.state.hash = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0, 0x76543210, 0xfedcba98, 0x89abcdef, 0x01234567, 0x3c2d1e0f];
          this.processBlock = this.processBlock320;
          break;
        default:
          // 160
          this.state.hash = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];
          this.processBlock = this.processBlock160;
      }
    }
  }, {
    key: "processBlock128",
    value: function processBlock128(block) {
      // Working variables
      var al = this.state.hash[0] | 0;
      var bl = this.state.hash[1] | 0;
      var cl = this.state.hash[2] | 0;
      var dl = this.state.hash[3] | 0;
      var ar = al;
      var br = bl;
      var cr = cl;
      var dr = dl;

      for (var i = 0; i < 64; i++) {
        var _t = al + block[ZL[i]] | 0;
        _t = _t + Ripemd.T(i, bl, cl, dl) | 0;
        _t = (0, _tools.rotateLeft)(_t, SL[i]);
        al = dl;
        dl = cl;
        cl = bl;
        bl = _t;

        _t = ar + block[ZR[i]] | 0;
        _t = _t + Ripemd.T64(i, br, cr, dr) | 0;
        _t = (0, _tools.rotateLeft)(_t, SR[i]);
        ar = dr;
        dr = cr;
        cr = br;
        br = _t;
      }
      var t = this.state.hash[1] + cl + dr | 0;
      this.state.hash[1] = this.state.hash[2] + dl + ar | 0;
      this.state.hash[2] = this.state.hash[3] + al + br | 0;
      this.state.hash[3] = this.state.hash[0] + bl + cr | 0;
      this.state.hash[0] = t;
    }
  }, {
    key: "processBlock160",
    value: function processBlock160(block) {
      // Working variables
      var al = this.state.hash[0] | 0;
      var bl = this.state.hash[1] | 0;
      var cl = this.state.hash[2] | 0;
      var dl = this.state.hash[3] | 0;
      var el = this.state.hash[4] | 0;
      var ar = al;
      var br = bl;
      var cr = cl;
      var dr = dl;
      var er = el;

      for (var i = 0; i < 80; i++) {
        var _t2 = al + block[ZL[i]] | 0;
        _t2 = _t2 + Ripemd.T(i, bl, cl, dl) | 0;
        _t2 = (0, _tools.rotateLeft)(_t2, SL[i]);
        _t2 = _t2 + el | 0;
        al = el;
        el = dl;
        dl = (0, _tools.rotateLeft)(cl, 10);
        cl = bl;
        bl = _t2;

        _t2 = ar + block[ZR[i]] | 0;
        _t2 = _t2 + Ripemd.T80(i, br, cr, dr) | 0;
        _t2 = (0, _tools.rotateLeft)(_t2, SR[i]);
        _t2 = _t2 + er | 0;
        ar = er;
        er = dr;
        dr = (0, _tools.rotateLeft)(cr, 10);
        cr = br;
        br = _t2;
      }
      var t = this.state.hash[1] + cl + dr | 0;
      this.state.hash[1] = this.state.hash[2] + dl + er | 0;
      this.state.hash[2] = this.state.hash[3] + el + ar | 0;
      this.state.hash[3] = this.state.hash[4] + al + br | 0;
      this.state.hash[4] = this.state.hash[0] + bl + cr | 0;
      this.state.hash[0] = t;
    }
  }, {
    key: "processBlock256",
    value: function processBlock256(block) {
      // Working variables
      var al = this.state.hash[0] | 0;
      var bl = this.state.hash[1] | 0;
      var cl = this.state.hash[2] | 0;
      var dl = this.state.hash[3] | 0;
      var ar = this.state.hash[4] | 0;
      var br = this.state.hash[5] | 0;
      var cr = this.state.hash[6] | 0;
      var dr = this.state.hash[7] | 0;

      for (var i = 0; i < 64; i += 1) {
        var t = al + block[ZL[i]] | 0;
        t = t + Ripemd.T(i, bl, cl, dl) | 0;
        t = (0, _tools.rotateLeft)(t, SL[i]);
        al = dl;
        dl = cl;
        cl = bl;
        bl = t;

        t = ar + block[ZR[i]] | 0;
        t = t + Ripemd.T64(i, br, cr, dr) | 0;
        t = (0, _tools.rotateLeft)(t, SR[i]);
        ar = dr;
        dr = cr;
        cr = br;
        br = t;
        switch (i) {
          case 15:
            t = al;
            al = ar;
            ar = t;
            break;
          case 31:
            t = bl;
            bl = br;
            br = t;
            break;
          case 47:
            t = cl;
            cl = cr;
            cr = t;
            break;
          case 63:
            t = dl;
            dl = dr;
            dr = t;
            break;
        }
      }
      this.state.hash[0] = this.state.hash[0] + al | 0;
      this.state.hash[1] = this.state.hash[1] + bl | 0;
      this.state.hash[2] = this.state.hash[2] + cl | 0;
      this.state.hash[3] = this.state.hash[3] + dl | 0;
      this.state.hash[4] = this.state.hash[4] + ar | 0;
      this.state.hash[5] = this.state.hash[5] + br | 0;
      this.state.hash[6] = this.state.hash[6] + cr | 0;
      this.state.hash[7] = this.state.hash[7] + dr | 0;
    }
  }, {
    key: "processBlock320",
    value: function processBlock320(block) {
      // Working variables
      var al = this.state.hash[0] | 0;
      var bl = this.state.hash[1] | 0;
      var cl = this.state.hash[2] | 0;
      var dl = this.state.hash[3] | 0;
      var el = this.state.hash[4] | 0;
      var ar = this.state.hash[5] | 0;
      var br = this.state.hash[6] | 0;
      var cr = this.state.hash[7] | 0;
      var dr = this.state.hash[8] | 0;
      var er = this.state.hash[9] | 0;

      for (var i = 0; i < 80; i += 1) {
        var t = al + block[ZL[i]] | 0;
        t = t + Ripemd.T(i, bl, cl, dl) | 0;
        t = (0, _tools.rotateLeft)(t, SL[i]);
        t = t + el | 0;
        al = el;
        el = dl;
        dl = (0, _tools.rotateLeft)(cl, 10);
        cl = bl;
        bl = t;

        t = ar + block[ZR[i]] | 0;
        t = t + Ripemd.T80(i, br, cr, dr) | 0;
        t = (0, _tools.rotateLeft)(t, SR[i]);
        t = t + er | 0;
        ar = er;
        er = dr;
        dr = (0, _tools.rotateLeft)(cr, 10);
        cr = br;
        br = t;
        switch (i) {
          case 15:
            t = bl;
            bl = br;
            br = t;
            break;
          case 31:
            t = dl;
            dl = dr;
            dr = t;
            break;
          case 47:
            t = al;
            al = ar;
            ar = t;
            break;
          case 63:
            t = cl;
            cl = cr;
            cr = t;
            break;
          case 79:
            t = el;
            el = er;
            er = t;
            break;
        }
      }
      this.state.hash[0] = this.state.hash[0] + al | 0;
      this.state.hash[1] = this.state.hash[1] + bl | 0;
      this.state.hash[2] = this.state.hash[2] + cl | 0;
      this.state.hash[3] = this.state.hash[3] + dl | 0;
      this.state.hash[4] = this.state.hash[4] + el | 0;
      this.state.hash[5] = this.state.hash[5] + ar | 0;
      this.state.hash[6] = this.state.hash[6] + br | 0;
      this.state.hash[7] = this.state.hash[7] + cr | 0;
      this.state.hash[8] = this.state.hash[8] + dr | 0;
      this.state.hash[9] = this.state.hash[9] + er | 0;
    }
  }, {
    key: "finalize",
    value: function finalize() {
      this.addPaddingISO7816(this.state.message.length < 56 ? 56 - this.state.message.length | 0 : 120 - this.state.message.length | 0);
      this.addLengthBits();
      this.process();
      return this.getStateHash();
    }
  }], [{
    key: "F",
    value: function F(x, y, z) {
      return x ^ y ^ z;
    }
  }, {
    key: "G",
    value: function G(x, y, z) {
      return x & y | ~x & z;
    }
  }, {
    key: "H",
    value: function H(x, y, z) {
      return (x | ~y) ^ z;
    }
  }, {
    key: "I",
    value: function I(x, y, z) {
      return x & z | y & ~z;
    }
  }, {
    key: "J",
    value: function J(x, y, z) {
      return x ^ (y | ~z);
    }
  }, {
    key: "T",
    value: function T(i, bl, cl, dl) {
      if (i < 16) {
        return this.F(bl, cl, dl);
      }
      if (i < 32) {
        return this.G(bl, cl, dl) + 0x5a827999 | 0;
      }
      if (i < 48) {
        return this.H(bl, cl, dl) + 0x6ed9eba1 | 0;
      }
      if (i < 64) {
        return this.I(bl, cl, dl) + 0x8f1bbcdc | 0;
      }
      return this.J(bl, cl, dl) + 0xa953fd4e | 0;
    }
  }, {
    key: "T64",
    value: function T64(i, br, cr, dr) {
      if (i < 16) {
        return this.I(br, cr, dr) + 0x50a28be6 | 0;
      }
      if (i < 32) {
        return this.H(br, cr, dr) + 0x5c4dd124 | 0;
      }
      if (i < 48) {
        return this.G(br, cr, dr) + 0x6d703ef3 | 0;
      }
      return this.F(br, cr, dr);
    }
  }, {
    key: "T80",
    value: function T80(i, br, cr, dr) {
      if (i < 16) {
        return this.J(br, cr, dr) + 0x50a28be6 | 0;
      }
      if (i < 32) {
        return this.I(br, cr, dr) + 0x5c4dd124 | 0;
      }
      if (i < 48) {
        return this.H(br, cr, dr) + 0x6d703ef3 | 0;
      }
      if (i < 64) {
        return this.G(br, cr, dr) + 0x7a6d76e9 | 0;
      }
      return this.F(br, cr, dr);
    }
  }]);

  return Ripemd;
}(_hasher32le2.default);

exports.default = Ripemd;
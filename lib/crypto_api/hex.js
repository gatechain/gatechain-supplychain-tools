'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toHex = toHex;
function toHex(raw) {
  var str = '';
  for (var i = 0, l = raw.length; i < l; i++) {
    str += (raw.charCodeAt(i) < 16 ? '0' : '') + raw.charCodeAt(i).toString(16);
  }
  return str;
}
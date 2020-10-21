'use strict';

/**
 * Convert ArrayBuffer to binary input for hasher
 *
 * @param {ArrayBuffer} buffer
 * @returns {string}
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromArrayBuffer = fromArrayBuffer;
function fromArrayBuffer(buffer) {
  var s = '';
  var bytes = new Uint8Array(buffer);
  for (var i = 0; i < bytes.length; i++) {
    s += String.fromCharCode(bytes[i]);
  }
  return s;
}
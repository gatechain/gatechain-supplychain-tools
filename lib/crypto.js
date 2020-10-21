'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.verify = exports.sign = exports.getPublicKey = exports.hash256 = exports.hash160 = exports.sha512 = exports.sha256 = exports.ripemd320 = exports.ripemd160 = exports.sha1 = undefined;

var _safeBuffer = require('safe-buffer');

var _createHash = require('create-hash');

var _createHash2 = _interopRequireDefault(_createHash);

var _bip32Ed = require('bip32-ed25519');

var _bip32Ed2 = _interopRequireDefault(_bip32Ed);

var _ripemd = require('./crypto_api/ripemd.js');

var Ripemd = _interopRequireWildcard(_ripemd);

var _hex = require('./crypto_api/hex.js');

var _arrayBuffer = require('./crypto_api/array-buffer');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sha1 = exports.sha1 = function sha1(buffer) {
    return (0, _createHash2.default)('sha1').update(buffer).digest();
};

var ripemd160 = exports.ripemd160 = function ripemd160(buffer) {
    return (0, _createHash2.default)('rmd160').update(buffer).digest();
};

var ripemd320 = exports.ripemd320 = function ripemd320(buffer) {
    var hasher = new Ripemd.default({ length: 320 });
    hasher.update((0, _arrayBuffer.fromArrayBuffer)(buffer));
    return (0, _hex.toHex)(hasher.finalize());
};

var sha256 = exports.sha256 = function sha256(buffer) {
    return (0, _createHash2.default)('sha256').update(buffer).digest();
};

var sha512 = exports.sha512 = function sha512(buffer) {
    return (0, _createHash2.default)('sha512').update(buffer).digest();
};

var hash160 = exports.hash160 = function hash160(buffer) {
    return ripemd160(sha256(buffer));
};

var hash256 = exports.hash256 = function hash256(buffer) {
    return sha256(sha256(buffer));
};

var getPublicKey = exports.getPublicKey = function getPublicKey(privateKey) {
    if (typeof privateKey === 'string') {
        privateKey = _safeBuffer.Buffer.from(privateKey, 'hex');
    }
    return _bip32Ed2.default.toPublic(privateKey);
};

var sign = exports.sign = function sign(privateKey, message) {
    if (typeof privateKey === 'string') {
        privateKey = _safeBuffer.Buffer.from(privateKey, 'hex');
    }

    if (typeof message === 'string') {
        message = _safeBuffer.Buffer.from(message, 'hex');
    }

    return _safeBuffer.Buffer.from(_bip32Ed2.default.sign(message, privateKey));
};

var verify = exports.verify = function verify(publicKey, message, signature) {
    if (typeof message === 'string') {
        message = _safeBuffer.Buffer.from(message, 'hex');
    }

    return _bip32Ed2.default.verify(message, signature, publicKey);
};
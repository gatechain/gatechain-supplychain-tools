'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.convertAddress = exports.checkAddress = exports.genMultiSigAddress = exports.genSingleSigAddress = exports.genAddress = exports.VAULT_MULTI_SIG_ADDRESS_PREFIX = exports.VAULT_SINGLE_SIG_ADDRESS_PREFIX = exports.NORMAL_MULTI_SIG_ADDRESS_PREFIX = exports.NORMAL_SINGLE_SIG_ADDRESS_PREFIX = undefined;

var _safeBuffer = require('safe-buffer');

var _bech = require('bech32');

var _bech2 = _interopRequireDefault(_bech);

var _crypto = require('./crypto');

var crypto = _interopRequireWildcard(_crypto);

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NORMAL_SINGLE_SIG_ADDRESS_PREFIX = exports.NORMAL_SINGLE_SIG_ADDRESS_PREFIX = 'gt1';
var NORMAL_MULTI_SIG_ADDRESS_PREFIX = exports.NORMAL_MULTI_SIG_ADDRESS_PREFIX = 'gt2';
var VAULT_SINGLE_SIG_ADDRESS_PREFIX = exports.VAULT_SINGLE_SIG_ADDRESS_PREFIX = 'vault1';
var VAULT_MULTI_SIG_ADDRESS_PREFIX = exports.VAULT_MULTI_SIG_ADDRESS_PREFIX = 'vault2';

var genAddress = exports.genAddress = function genAddress(publicKey, prefix) {
    return genSingleSigAddress(publicKey, prefix);
};

var genSingleSigAddress = exports.genSingleSigAddress = function genSingleSigAddress(publicKey, prefix) {
    if (typeof publicKey === 'string') {
        publicKey = _safeBuffer.Buffer.from(publicKey, 'hex');
    }

    prefix = prefix || NORMAL_SINGLE_SIG_ADDRESS_PREFIX;
    var sha512 = crypto.sha512(publicKey);
    var ripemd320 = crypto.ripemd320(sha512);

    var words = _bech2.default.toWords(_safeBuffer.Buffer.from(ripemd320, 'hex'));
    return _bech2.default.encode(prefix, words);
};

var genMultiSigAddress = exports.genMultiSigAddress = function genMultiSigAddress(pubKeys, threshold, prefix) {
    var bytes = utils.encodeMultiSigPubKey(pubKeys, threshold);
    bytes = _safeBuffer.Buffer.from(bytes, 'hex');

    var sha512 = crypto.sha512(bytes);
    var ripemd320 = crypto.ripemd320(sha512);

    prefix = prefix || NORMAL_MULTI_SIG_ADDRESS_PREFIX;
    var words = _bech2.default.toWords(_safeBuffer.Buffer.from(ripemd320, 'hex'));
    return _bech2.default.encode(prefix, words);
};

var checkAddress = exports.checkAddress = function checkAddress(address) {
    try {
        var decoded = _bech2.default.decode(address);
        return decoded.prefix === NORMAL_SINGLE_SIG_ADDRESS_PREFIX || decoded.prefix === NORMAL_MULTI_SIG_ADDRESS_PREFIX || decoded.prefix === VAULT_SINGLE_SIG_ADDRESS_PREFIX || decoded.prefix === VAULT_MULTI_SIG_ADDRESS_PREFIX;
    } catch (err) {
        return false;
    }
};

var convertAddress = exports.convertAddress = function convertAddress(address) {
    var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : NORMAL_SINGLE_SIG_ADDRESS_PREFIX;

    var decoded = _bech2.default.decode(address);
    if (decoded.prefix === prefix) {
        return address;
    }

    return _bech2.default.encode(prefix, decoded.words);
};
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.genPubKeyBech32 = exports.genMultiSigPubKeyBech32 = exports.encodeMultiSigPubKey = exports.compareBuffer = undefined;

var _bech = require('bech32');

var _bech2 = _interopRequireDefault(_bech);

var _crypto = require('./crypto');

var crypto = _interopRequireWildcard(_crypto);

var _encoder = require('./encoder');

var cdc = _interopRequireWildcard(_encoder);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import * as amino from '@tendermint/amino-js'
var PUBLIC_KEY_PREFIX = 'gt1pub';

var compareBuffer = exports.compareBuffer = function compareBuffer(buffer1, buffer2) {
    if (buffer1.length > buffer2.length) {
        return 1;
    } else if (buffer1.length < buffer2.length) {
        return -1;
    }

    for (var i = 0; i < buffer1.length; i++) {
        if (buffer1[i] > buffer2[i]) {
            return 1;
        } else if (buffer1[i] < buffer2[i]) {
            return -1;
        }
    }

    return 0;
};

var encodeMultiSigPubKey = exports.encodeMultiSigPubKey = function encodeMultiSigPubKey(pubKeys, threshold) {
    var obj = {
        K: parseInt(threshold),
        PubKeys: pubKeys.sort(function (pk1, pk2) {
            if (typeof pk1 === 'string') {
                pk1 = Buffer.from(pk1, 'hex');
            }
            var hash1 = crypto.hash160(pk1);

            if (typeof pk2 === 'string') {
                pk2 = Buffer.from(pk2, 'hex');
            }
            var hash2 = crypto.hash160(pk2);

            return compareBuffer(hash1, hash2);
        }).map(function (pk) {
            if (typeof pk === 'string') {
                pk = Buffer.from(pk, 'hex');
            }
            return Buffer.concat([Buffer.from('e1e1a0fa', 'hex'), Buffer.from([pk.length]), pk]);
        })
    };

    return '38149471' + cdc.marshalBinaryBare(obj);
    // return Buffer.from(amino.marshalPubKeyMultisigThreshold(obj)).toString('hex')
};

var genMultiSigPubKeyBech32 = exports.genMultiSigPubKeyBech32 = function genMultiSigPubKeyBech32(pubKeys, threshold) {
    var buffer = Buffer.from(encodeMultiSigPubKey(pubKeys, threshold), 'hex');
    return _bech2.default.encode(PUBLIC_KEY_PREFIX, _bech2.default.toWords(buffer), 900);
};

var genPubKeyBech32 = exports.genPubKeyBech32 = function genPubKeyBech32(publicKey) {
    if (typeof publicKey === 'string') {
        publicKey = Buffer.from(publicKey, 'hex');
    }
    var buffer = Buffer.concat([Buffer.from('e1e1a0fa', 'hex'), Buffer.from([publicKey.length]), publicKey]);
    return _bech2.default.encode(PUBLIC_KEY_PREFIX, _bech2.default.toWords(buffer), 900);
};
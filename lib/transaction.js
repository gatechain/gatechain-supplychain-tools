'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TxType = exports.PubKeyType = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _safeBuffer = require('safe-buffer');

var _crypto = require('./crypto');

var crypto = _interopRequireWildcard(_crypto);

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

var _encoder = require('./encoder');

var cdc = _interopRequireWildcard(_encoder);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var randomBuffer = require('random-buffer');

var PubKeyType = exports.PubKeyType = {
    PubKeySecp256k1: 'gatechain/PubKeySecp256k1',
    PubKeyEd25519: 'gatechain/PubKeyEd25519',
    PubKeyMultisigThreshold: 'gatechain/PubKeyMultisigThreshold'
};

var TxType = exports.TxType = {
    StdTx: 'auth/StdTx'
};

var sortObject = function sortObject(obj) {
    if (obj === null) return null;
    if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') return obj;

    if (Array.isArray(obj)) return obj.map(sortObject);

    var sortedKeys = Object.keys(obj).sort();
    var result = {};
    sortedKeys.forEach(function (key) {
        result[key] = sortObject(obj[key]);
    });
    return result;
};

var genNonces = function genNonces() {
    return randomBuffer(32, Date.now() + '').toString('base64');
};

var CompactBitArray = function () {
    function CompactBitArray(bits) {
        _classCallCheck(this, CompactBitArray);

        bits = parseInt(bits);
        if (isNaN(bits) || bits <= 0) {
            throw new Error('invalid bits');
        }

        this.extraBitsStored = bits % 8;
        this.elems = [];
        for (var i = 0; i < parseInt((bits + 7) / 8); i++) {
            this.elems.push(0);
        }
    }

    _createClass(CompactBitArray, [{
        key: 'size',
        value: function size() {
            return (this.elems.length - 1) * 8 + this.extraBitsStored;
        }
    }, {
        key: 'getIndex',
        value: function getIndex(i) {
            if (i < 0 || i > this.size()) {
                return false;
            }

            return !!(this.elems[i >> 3] & 1 << 7 - i % 8);
        }
    }, {
        key: 'setIndex',
        value: function setIndex(i, v) {
            if (i < 0 || i > this.size()) {
                return false;
            }

            if (v) {
                this.elems[i >> 3] |= 1 << 7 - i % 8;
            } else {
                this.elems[i >> 3] &= ~(1 << 7 - i % 8);
            }
        }
    }, {
        key: 'numTrueBitsBefore',
        value: function numTrueBitsBefore(index) {
            var count = 0;
            for (var i = 0; i < index; i++) {
                if (this.getIndex(i)) {
                    count++;
                }
            }

            return count;
        }
    }, {
        key: 'toObject',
        value: function toObject() {
            return {
                extraBitsStored: this.extraBitsStored,
                elems: _safeBuffer.Buffer.from(this.elems)
            };
        }
    }]);

    return CompactBitArray;
}();

var Transaction = function () {
    function Transaction(data) {
        _classCallCheck(this, Transaction);

        data = data || {};

        if (!data.chainId) {
            throw new TypeError('chainId is required');
        }

        if (!data.validHeight) {
            throw new TypeError('validHeight is required');
        }

        var validHeight = [];
        if (Array.isArray(data.validHeight)) {
            validHeight[0] = data.validHeight[0] + '';
            validHeight[1] = data.validHeight[1] + '';
        } else {
            validHeight[0] = '1';
            validHeight[1] = data.validHeight + '';
        }

        this.nonces = data.nonces || [genNonces()];
        this.chainId = data.chainId;
        this.validHeight = validHeight;
        this.msgs = data.msgs ? data.msgs : data.msg ? Array.isArray(data.msg) ? data.msg : [data.msg] : [];
        this.fee = data.fee || {};
        this.memo = data.memo;
        this.signatures = data.signatures || [];
    }

    _createClass(Transaction, [{
        key: 'toObject',
        value: function toObject(txType) {
            var tx = {
                'fee': this.fee,
                'memo': this.memo,
                'msg': this.msgs,
                'nonces': this.nonces,
                'valid_height': this.validHeight
            };

            if (this.signatures && this.signatures.length > 0) {
                tx.signatures = this.signatures;
            }

            var obj = sortObject(tx);
            if (txType) {
                return {
                    'type': txType,
                    'value': obj
                };
            }

            return obj;
        }
    }, {
        key: 'addMsg',
        value: function addMsg(msg) {
            this.msgs.push(msg);
        }
    }, {
        key: 'setFee',
        value: function setFee(fee) {
            this.fee = fee;
        }
    }, {
        key: 'getSignBytes',
        value: function getSignBytes() {
            var message = {
                'chain_id': this.chainId,
                'fee': this.fee,
                'memo': this.memo,
                'msgs': this.msgs,
                'nonces': this.nonces,
                'valid_height': this.validHeight
            };
            return _safeBuffer.Buffer.from(JSON.stringify(sortObject(message)));
        }
    }, {
        key: 'setSignature',
        value: function setSignature(publicKey, signature) {
            this.clearSignatures();
            this.addSignature(publicKey, signature);
        }
    }, {
        key: 'setMultiSignatures',
        value: function setMultiSignatures(signatures, threshold, pubKeys) {
            var sort = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

            this.clearSignatures();

            pubKeys = pubKeys.map(function (pk) {
                return typeof pk === 'string' ? _safeBuffer.Buffer.from(pk, 'hex') : pk;
            });

            if (sort) {
                pubKeys.sort(function (pk1, pk2) {
                    return utils.compareBuffer(crypto.hash160(pk1), crypto.hash160(pk2));
                });
            }

            var sig = {
                pub_key: {
                    type: PubKeyType.PubKeyMultisigThreshold,
                    value: {
                        threshold: threshold + '',
                        pubkeys: []
                    }
                },
                signature: ''
            };

            signatures = signatures.map(function (sig) {
                // signature object like: {"pub_key":{"type":"tendermint/PubKeySecp256k1","value":"..base64.."},"signature":"..base64.."} or {publicKey: Buffer, signature: Buffer}
                if (_typeof(sig.pub_key) === 'object' && typeof sig.signature === 'string') {
                    return {
                        publicKey: _safeBuffer.Buffer.from(sig.pub_key.value, 'base64'),
                        signature: _safeBuffer.Buffer.from(sig.signature, 'base64')
                    };
                } else if (sig.publicKey && sig.signature) {
                    return {
                        publicKey: typeof sig.publicKey === 'string' ? _safeBuffer.Buffer.from(sig.publicKey, 'hex') : sig.publicKey,
                        signature: typeof sig.signature === 'string' ? _safeBuffer.Buffer.from(sig.signature, 'hex') : sig.signature
                    };
                } else {
                    throw new Error('unrecognized signature');
                }
            });

            var bitArray = new CompactBitArray(pubKeys.length);
            var sigs = [];
            for (var i = 0; i < pubKeys.length; i++) {
                sig.pub_key.value.pubkeys.push({
                    type: PubKeyType.PubKeyEd25519,
                    value: pubKeys[i].toString('base64')
                });

                var found = false;
                var index = 0;
                for (; index < signatures.length; index++) {
                    if (utils.compareBuffer(pubKeys[i], signatures[index].publicKey) === 0) {
                        found = true;
                        break;
                    }
                }

                bitArray.setIndex(i, found);
                if (found) {
                    sigs.push(signatures[index].signature);
                }
            }

            var ms = {
                bitArray: bitArray.toObject(),
                sigs: sigs
            };
            sig.signature = _safeBuffer.Buffer.from(cdc.marshalBinaryBare(ms), 'hex').toString('base64');

            this.signatures.push(sig);
        }

        /**
         *
         *  @param signature object like: {"pub_key":{"type":"gatechain/PubKeySecp256k1","value":"..base64.."},"signature":"..base64.."}
         *  or (publicKey, signature) like: (Buffer, Buffer)
         *
         * */

    }, {
        key: 'addSignature',
        value: function addSignature() {
            if (!this.signatures) {
                this.signatures = [];
            }

            var sig = void 0;
            if (_typeof(arguments[0]) === 'object' && _typeof(arguments[0].pub_key) === 'object' && typeof arguments[0].signature === 'string') {
                sig = arguments[0];
            } else if (arguments[0] && arguments[1]) {
                var publicKey = arguments[0];
                var signature = arguments[1];

                if (typeof publicKey === 'string') {
                    publicKey = _safeBuffer.Buffer.from(publicKey, 'hex');
                }

                if (typeof signature === 'string') {
                    signature = _safeBuffer.Buffer.from(signature, 'hex');
                }

                sig = {
                    pub_key: {
                        type: PubKeyType.PubKeyEd25519,
                        value: publicKey.toString('base64')
                    },
                    signature: signature.toString('base64')
                };
            } else {
                throw new Error('unrecognized signature: ' + arguments);
            }

            this.signatures.push(sig);
        }
    }, {
        key: 'clearSignatures',
        value: function clearSignatures() {
            this.signatures = [];
        }
    }, {
        key: 'sign',
        value: function sign(privateKey) {
            var set = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            if (typeof privateKey === 'string') {
                privateKey = _safeBuffer.Buffer.from(privateKey, 'hex');
            }

            var signBytes = this.getSignBytes();

            var signature = crypto.sign(privateKey, crypto.sha256(signBytes));
            var publicKey = crypto.getPublicKey(privateKey);

            var sig = {
                pub_key: {
                    type: PubKeyType.PubKeyEd25519,
                    value: publicKey.toString('base64')
                },
                signature: signature.toString('base64')
            };

            if (set) {
                this.setSignature(sig);
            }

            return sig;
        }
    }], [{
        key: 'fromObject',
        value: function fromObject(tx, chainId) {
            var data = JSON.parse(JSON.stringify(tx));
            data.chainId = chainId;
            data.nonces = tx.nonces;
            data.msgs = tx.msg;
            data.fee = tx.fee;
            data.memo = tx.memo;
            data.signatures = tx.signatures;
            data.validHeight = tx.valid_height;

            return new Transaction(data);
        }
    }]);

    return Transaction;
}();

Transaction.PubKeyType = PubKeyType;
Transaction.TxType = TxType;

exports.default = Transaction;
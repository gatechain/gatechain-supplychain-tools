'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.encodeArrayBinary = exports.encodeObjectBinary = exports.encodeBinaryByteArray = exports.encodeBinary = exports.marshalBinaryBare = exports.marshalBinary = exports.encodeTime = exports.encodeString = exports.encodeBool = exports.encodeNumber = undefined;

var _varstruct = require('varstruct');

var _varstruct2 = _interopRequireDefault(_varstruct);

var _safeBuffer = require('safe-buffer');

var _is_js = require('is_js');

var _is_js2 = _interopRequireDefault(_is_js);

var _varint = require('./varint');

var _varint2 = _interopRequireDefault(_varint);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @module amino
 */

var VarString = _varstruct2.default.VarString(_varint.UVarInt);

/**
 * encode number
 * @param num
 */
var encodeNumber = exports.encodeNumber = function encodeNumber(num) {
    return _varint.UVarInt.encode(num);
};

/**
 * encode bool
 * @param b
 */
var encodeBool = exports.encodeBool = function encodeBool(b) {
    return b ? _varint2.default.encode(1) : _varint2.default.encode(0);
};

/**
 * encode string
 * @param str
 */
var encodeString = exports.encodeString = function encodeString(str) {
    return VarString.encode(str);
};

/**
 * encode time
 * @param value
 */
var encodeTime = exports.encodeTime = function encodeTime(value) {
    var millis = new Date(value).getTime();
    var seconds = Math.floor(millis / 1000);
    var nanos = Number(seconds.toString().padEnd(9, '0'));

    var buffer = _safeBuffer.Buffer.alloc(14);

    buffer[0] = 1 << 3 | 1; // field 1, typ3 1
    buffer.writeUInt32LE(seconds, 1);

    buffer[9] = 2 << 3 | 5; // field 2, typ3 5
    buffer.writeUInt32LE(nanos, 10);

    return buffer;
};

/**
 * js amino MarshalBinary
 * @param {Object} obj
 *  */
var marshalBinary = exports.marshalBinary = function marshalBinary(obj) {
    if (!_is_js2.default.object(obj)) throw new TypeError('data must be an object');

    return encodeBinary(obj, null, true).toString('hex');
};

/**
 * js amino MarshalBinaryBare
 * @param {Object} obj
 *  */
var marshalBinaryBare = exports.marshalBinaryBare = function marshalBinaryBare(obj) {
    if (!_is_js2.default.object(obj)) throw new TypeError('data must be an object');

    return encodeBinary(obj).toString('hex');
};

/**
 * This is the main entrypoint for encoding all types in binary form.
 * @param {*} val data type (not null, not undefined)
 * @param {Number} field index of object
 * @param {Boolean} isByteLenPrefix
 * @return {Buffer} binary of object.
 */
var encodeBinary = exports.encodeBinary = function encodeBinary(val, field, isByteLenPrefix) {
    if (val === null || val === undefined) throw new TypeError('unsupported type');

    if (_safeBuffer.Buffer.isBuffer(val)) {
        if (isByteLenPrefix) {
            return _safeBuffer.Buffer.concat([_varint.UVarInt.encode(val.length), val]);
        }
        return val;
    }

    if (_is_js2.default.array(val)) {
        return encodeArrayBinary(field, val, isByteLenPrefix);
    }

    if (_is_js2.default.number(val)) {
        return encodeNumber(val);
    }

    if (_is_js2.default.boolean(val)) {
        return encodeBool(val);
    }

    if (_is_js2.default.string(val)) {
        return encodeString(val);
    }

    if (_is_js2.default.object(val)) {
        return encodeObjectBinary(val, isByteLenPrefix);
    }
};

/**
 * prefixed with bytes length
 * @param {Buffer} bytes
 * @return {Buffer} with bytes length prefixed
 */
var encodeBinaryByteArray = exports.encodeBinaryByteArray = function encodeBinaryByteArray(bytes) {
    var lenPrefix = bytes.length;
    return _safeBuffer.Buffer.concat([_varint.UVarInt.encode(lenPrefix), bytes]);
};

/**
 *
 * @param {Object} obj
 * @param {Boolean} isByteLenPrefix
 * @return {Buffer} with bytes length prefixed
 */
var encodeObjectBinary = exports.encodeObjectBinary = function encodeObjectBinary(obj, isByteLenPrefix) {
    var bufferArr = [];

    Object.keys(obj).forEach(function (key, index) {
        if (key === 'msgType' || key === 'version') return;

        if (isDefaultValue(obj[key])) return;

        if (_is_js2.default.array(obj[key]) && obj[key].length > 0) {
            bufferArr.push(encodeArrayBinary(index, obj[key]));
        } else {
            bufferArr.push(encodeTypeAndField(index, obj[key]));
            bufferArr.push(encodeBinary(obj[key], index, true));
        }
    });

    var bytes = _safeBuffer.Buffer.concat(bufferArr);

    // Write byte-length prefixed.
    if (isByteLenPrefix) {
        var lenBytes = _varint.UVarInt.encode(bytes.length);
        bytes = _safeBuffer.Buffer.concat([lenBytes, bytes]);
    }

    return bytes;
};

/**
 * @param {Number} fieldNum object field index
 * @param {Array} arr
 * @param {Boolean} isByteLenPrefix
 * @return {Buffer} bytes of array
 */
var encodeArrayBinary = exports.encodeArrayBinary = function encodeArrayBinary(fieldNum, arr, isByteLenPrefix) {
    var result = [];

    arr.forEach(function (item) {
        result.push(encodeTypeAndField(fieldNum, item));

        if (isDefaultValue(item)) {
            result.push(_safeBuffer.Buffer.from([0]));
            return;
        }

        result.push(encodeBinary(item, fieldNum, true));
    });

    //encode length
    if (isByteLenPrefix) {
        var length = result.reduce(function (prev, item) {
            return prev + item.length;
        }, 0);
        result.unshift(_varint.UVarInt.encode(length));
    }

    return _safeBuffer.Buffer.concat(result);
};

// Write field key.
var encodeTypeAndField = function encodeTypeAndField(index, field) {
    var value = index + 1 << 3 | typeToTyp3(field);
    return _varint.UVarInt.encode(value);
};

// typeToTyp3
//amino type convert
var typeToTyp3 = function typeToTyp3(type) {
    if (_is_js2.default.boolean(type)) {
        return 0;
    }

    if (_is_js2.default.number(type)) {
        if (_is_js2.default.integer(type)) {
            return 0;
        } else {
            return 1;
        }
    }

    if (_is_js2.default.string(type) || _is_js2.default.array(type) || _is_js2.default.object(type)) {
        return 2;
    }
};

var isDefaultValue = function isDefaultValue(obj) {
    if (obj === null) return false;

    return _is_js2.default.number(obj) && obj === 0 || _is_js2.default.string(obj) && obj === '' || _is_js2.default.array(obj) && obj.length === 0;
};
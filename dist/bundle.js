/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 32);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _Utils = __webpack_require__(4);

var _Utils2 = _interopRequireDefault(_Utils);

var _TwoVector = __webpack_require__(6);

var _TwoVector2 = _interopRequireDefault(_TwoVector);

var _ThreeVector = __webpack_require__(31);

var _ThreeVector2 = _interopRequireDefault(_ThreeVector);

var _Quaternion = __webpack_require__(75);

var _Quaternion2 = _interopRequireDefault(_Quaternion);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var MAX_UINT_16 = 0xFFFF;

/**
 * The Serializer is responsible for serializing the game world and its
 * objects on the server, before they are sent to each client.  On the client side the
 * Serializer deserializes these objects.
 *
 * The Serializer defines the data types which can be serialized.
 */

var Serializer = function () {
    function Serializer() {
        _classCallCheck(this, Serializer);

        this.registeredClasses = {};
        this.customTypes = {};
        this.registerClass(_TwoVector2.default);
        this.registerClass(_ThreeVector2.default);
        this.registerClass(_Quaternion2.default);
    }

    /**
     * Adds a custom primitive to the serializer instance.
     * This will enable you to use it in an object's netScheme
     * @param customType
     */
    // TODO: the function below is not used, and it is not clear what that
    // first argument is supposed to be


    _createClass(Serializer, [{
        key: 'addCustomType',
        value: function addCustomType(customType) {
            this.customTypes[customType.type] = customType;
        }

        /**
         * Checks if type can be assigned by value.
         * @param {String} type Type to Checks
         * @return {Boolean} True if type can be assigned
         */

    }, {
        key: 'registerClass',

        /**
         * Registers a new class with the serializer, so it may be deserialized later
         * @param {Function} classObj reference to the class (not an instance!)
         * @param {String} classId Unit specifying a class ID
         */
        value: function registerClass(classObj, classId) {
            // if no classId is specified, hash one from the class name
            classId = classId ? classId : _Utils2.default.hashStr(classObj.name);
            if (this.registeredClasses[classId]) {
                console.error('Serializer: accidental override of classId ' + classId + ' when registering class', classObj);
            }

            this.registeredClasses[classId] = classObj;
        }
    }, {
        key: 'deserialize',
        value: function deserialize(dataBuffer, byteOffset) {
            byteOffset = byteOffset ? byteOffset : 0;
            var localByteOffset = 0;

            var dataView = new DataView(dataBuffer);

            var objectClassId = dataView.getUint8(byteOffset + localByteOffset);

            // todo if classId is 0 - take care of dynamic serialization.
            var objectClass = this.registeredClasses[objectClassId];
            if (objectClass == null) {
                console.error('Serializer: unable to find class with objectClassId ' + objectClassId);
            }

            localByteOffset += Uint8Array.BYTES_PER_ELEMENT; // advance the byteOffset after the classId

            // create de-referenced instance of the class. gameEngine and id will be 'tacked on' later at the sync strategies
            var obj = new objectClass(null, { id: null });
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.keys(objectClass.netScheme).sort()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var property = _step.value;

                    var read = this.readDataView(dataView, byteOffset + localByteOffset, objectClass.netScheme[property]);
                    obj[property] = read.data;
                    localByteOffset += read.bufferSize;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return { obj: obj, byteOffset: localByteOffset };
        }
    }, {
        key: 'writeDataView',
        value: function writeDataView(dataView, value, bufferOffset, netSchemProp) {
            if (netSchemProp.type == Serializer.TYPES.FLOAT32) {
                dataView.setFloat32(bufferOffset, value);
            } else if (netSchemProp.type == Serializer.TYPES.INT32) {
                dataView.setInt32(bufferOffset, value);
            } else if (netSchemProp.type == Serializer.TYPES.INT16) {
                dataView.setInt16(bufferOffset, value);
            } else if (netSchemProp.type == Serializer.TYPES.INT8) {
                dataView.setInt8(bufferOffset, value);
            } else if (netSchemProp.type == Serializer.TYPES.UINT8) {
                dataView.setUint8(bufferOffset, value);
            } else if (netSchemProp.type == Serializer.TYPES.STRING) {

                //   MAX_UINT_16 is a reserved (length) value which indicates string hasn't changed
                if (value === null) {
                    dataView.setUint16(bufferOffset, MAX_UINT_16);
                } else {
                    var strLen = value.length;
                    dataView.setUint16(bufferOffset, strLen);
                    var localBufferOffset = 2;
                    for (var i = 0; i < strLen; i++) {
                        dataView.setUint16(bufferOffset + localBufferOffset + i * 2, value.charCodeAt(i));
                    }
                }
            } else if (netSchemProp.type == Serializer.TYPES.CLASSINSTANCE) {
                value.serialize(this, {
                    dataBuffer: dataView.buffer,
                    bufferOffset: bufferOffset
                });
            } else if (netSchemProp.type == Serializer.TYPES.LIST) {
                var _localBufferOffset = 0;

                // a list is comprised of the number of items followed by the items
                dataView.setUint16(bufferOffset + _localBufferOffset, value.length);
                _localBufferOffset += Uint16Array.BYTES_PER_ELEMENT;

                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = value[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var item = _step2.value;

                        // TODO: inelegant, currently doesn't support list of lists
                        if (netSchemProp.itemType == Serializer.TYPES.CLASSINSTANCE) {
                            var serializedObj = item.serialize(this, {
                                dataBuffer: dataView.buffer,
                                bufferOffset: bufferOffset + _localBufferOffset
                            });
                            _localBufferOffset += serializedObj.bufferOffset;
                        } else {
                            this.writeDataView(dataView, item, bufferOffset + _localBufferOffset, { type: netSchemProp.itemType });
                            _localBufferOffset += this.getTypeByteSize(netSchemProp.itemType);
                        }
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }
            } else if (this.customTypes[netSchemProp.type]) {
                // this is a custom data property which needs to define its own write method
                this.customTypes[netSchemProp.type].writeDataView(dataView, value, bufferOffset);
            } else {
                console.error('No custom property ' + netSchemProp.type + ' found!');
            }
        }
    }, {
        key: 'readDataView',
        value: function readDataView(dataView, bufferOffset, netSchemProp) {
            var data = void 0,
                bufferSize = void 0;

            if (netSchemProp.type == Serializer.TYPES.FLOAT32) {
                data = dataView.getFloat32(bufferOffset);
                bufferSize = this.getTypeByteSize(netSchemProp.type);
            } else if (netSchemProp.type == Serializer.TYPES.INT32) {
                data = dataView.getInt32(bufferOffset);
                bufferSize = this.getTypeByteSize(netSchemProp.type);
            } else if (netSchemProp.type == Serializer.TYPES.INT16) {
                data = dataView.getInt16(bufferOffset);
                bufferSize = this.getTypeByteSize(netSchemProp.type);
            } else if (netSchemProp.type == Serializer.TYPES.INT8) {
                data = dataView.getInt8(bufferOffset);
                bufferSize = this.getTypeByteSize(netSchemProp.type);
            } else if (netSchemProp.type == Serializer.TYPES.UINT8) {
                data = dataView.getUint8(bufferOffset);
                bufferSize = this.getTypeByteSize(netSchemProp.type);
            } else if (netSchemProp.type == Serializer.TYPES.STRING) {
                var length = dataView.getUint16(bufferOffset);
                var localBufferOffset = Uint16Array.BYTES_PER_ELEMENT;
                bufferSize = localBufferOffset;
                if (length === MAX_UINT_16) {
                    data = null;
                } else {
                    var a = [];
                    for (var i = 0; i < length; i++) {
                        a[i] = dataView.getUint16(bufferOffset + localBufferOffset + i * 2);
                    }data = String.fromCharCode.apply(null, a);
                    bufferSize += length * Uint16Array.BYTES_PER_ELEMENT;
                }
            } else if (netSchemProp.type == Serializer.TYPES.CLASSINSTANCE) {
                var deserializeData = this.deserialize(dataView.buffer, bufferOffset);
                data = deserializeData.obj;
                bufferSize = deserializeData.byteOffset;
            } else if (netSchemProp.type == Serializer.TYPES.LIST) {
                var _localBufferOffset2 = 0;

                var items = [];
                var itemCount = dataView.getUint16(bufferOffset + _localBufferOffset2);
                _localBufferOffset2 += Uint16Array.BYTES_PER_ELEMENT;

                for (var x = 0; x < itemCount; x++) {
                    var read = this.readDataView(dataView, bufferOffset + _localBufferOffset2, { type: netSchemProp.itemType });
                    items.push(read.data);
                    _localBufferOffset2 += read.bufferSize;
                }

                data = items;
                bufferSize = _localBufferOffset2;
            }
            // this is a custom data property which needs to define its own read method
            else if (this.customTypes[netSchemProp.type] != null) {
                    data = this.customTypes[netSchemProp.type].readDataView(dataView, bufferOffset);
                } else {
                    console.error('No custom property ' + netSchemProp.type + ' found!');
                }

            return { data: data, bufferSize: bufferSize };
        }
    }, {
        key: 'getTypeByteSize',
        value: function getTypeByteSize(type) {

            switch (type) {
                case Serializer.TYPES.FLOAT32:
                    {
                        return Float32Array.BYTES_PER_ELEMENT;
                    }
                case Serializer.TYPES.INT32:
                    {
                        return Int32Array.BYTES_PER_ELEMENT;
                    }
                case Serializer.TYPES.INT16:
                    {
                        return Int16Array.BYTES_PER_ELEMENT;
                    }
                case Serializer.TYPES.INT8:
                    {
                        return Int8Array.BYTES_PER_ELEMENT;
                    }
                case Serializer.TYPES.UINT8:
                    {
                        return Uint8Array.BYTES_PER_ELEMENT;
                    }

                // not one of the basic properties
                default:
                    {
                        if (this.customTypes[type] == null) {
                            console.error('netScheme property ' + type + ' undefined! Did you forget to add it to the serializer?');
                            break;
                        } else {
                            return this.customTypes[type].BYTES_PER_ELEMENT;
                        }
                    }

            }
        }
    }], [{
        key: 'typeCanAssign',
        value: function typeCanAssign(type) {
            return type !== Serializer.TYPES.CLASSINSTANCE && type !== Serializer.TYPES.LIST;
        }
    }]);

    return Serializer;
}();

/**
* The TYPES object defines the supported serialization types
* @constant
*/

exports.default = Serializer;
Serializer.TYPES = {
    FLOAT32: 'FLOAT32',
    INT32: 'INT32',
    INT16: 'INT16',
    INT8: 'INT8',
    UINT8: 'UINT8',
    STRING: 'STRING',
    CLASSINSTANCE: 'CLASSINSTANCE',
    LIST: 'LIST'
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * Module dependencies.
 */

var keys = __webpack_require__(55);
var hasBinary = __webpack_require__(24);
var sliceBuffer = __webpack_require__(57);
var after = __webpack_require__(58);
var utf8 = __webpack_require__(59);

var base64encoder;
if (global && global.ArrayBuffer) {
  base64encoder = __webpack_require__(60);
}

/**
 * Check if we are running an android browser. That requires us to use
 * ArrayBuffer with polling transports...
 *
 * http://ghinda.net/jpeg-blob-ajax-android/
 */

var isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);

/**
 * Check if we are running in PhantomJS.
 * Uploading a Blob with PhantomJS does not work correctly, as reported here:
 * https://github.com/ariya/phantomjs/issues/11395
 * @type boolean
 */
var isPhantomJS = typeof navigator !== 'undefined' && /PhantomJS/i.test(navigator.userAgent);

/**
 * When true, avoids using Blobs to encode payloads.
 * @type boolean
 */
var dontSendBlobs = isAndroid || isPhantomJS;

/**
 * Current protocol version.
 */

exports.protocol = 3;

/**
 * Packet types.
 */

var packets = exports.packets = {
    open:     0    // non-ws
  , close:    1    // non-ws
  , ping:     2
  , pong:     3
  , message:  4
  , upgrade:  5
  , noop:     6
};

var packetslist = keys(packets);

/**
 * Premade error packet.
 */

var err = { type: 'error', data: 'parser error' };

/**
 * Create a blob api even for blob builder when vendor prefixes exist
 */

var Blob = __webpack_require__(61);

/**
 * Encodes a packet.
 *
 *     <packet type id> [ <data> ]
 *
 * Example:
 *
 *     5hello world
 *     3
 *     4
 *
 * Binary is encoded in an identical principle
 *
 * @api private
 */

exports.encodePacket = function (packet, supportsBinary, utf8encode, callback) {
  if ('function' == typeof supportsBinary) {
    callback = supportsBinary;
    supportsBinary = false;
  }

  if ('function' == typeof utf8encode) {
    callback = utf8encode;
    utf8encode = null;
  }

  var data = (packet.data === undefined)
    ? undefined
    : packet.data.buffer || packet.data;

  if (global.ArrayBuffer && data instanceof ArrayBuffer) {
    return encodeArrayBuffer(packet, supportsBinary, callback);
  } else if (Blob && data instanceof global.Blob) {
    return encodeBlob(packet, supportsBinary, callback);
  }

  // might be an object with { base64: true, data: dataAsBase64String }
  if (data && data.base64) {
    return encodeBase64Object(packet, callback);
  }

  // Sending data as a utf-8 string
  var encoded = packets[packet.type];

  // data fragment is optional
  if (undefined !== packet.data) {
    encoded += utf8encode ? utf8.encode(String(packet.data)) : String(packet.data);
  }

  return callback('' + encoded);

};

function encodeBase64Object(packet, callback) {
  // packet data is an object { base64: true, data: dataAsBase64String }
  var message = 'b' + exports.packets[packet.type] + packet.data.data;
  return callback(message);
}

/**
 * Encode packet helpers for binary types
 */

function encodeArrayBuffer(packet, supportsBinary, callback) {
  if (!supportsBinary) {
    return exports.encodeBase64Packet(packet, callback);
  }

  var data = packet.data;
  var contentArray = new Uint8Array(data);
  var resultBuffer = new Uint8Array(1 + data.byteLength);

  resultBuffer[0] = packets[packet.type];
  for (var i = 0; i < contentArray.length; i++) {
    resultBuffer[i+1] = contentArray[i];
  }

  return callback(resultBuffer.buffer);
}

function encodeBlobAsArrayBuffer(packet, supportsBinary, callback) {
  if (!supportsBinary) {
    return exports.encodeBase64Packet(packet, callback);
  }

  var fr = new FileReader();
  fr.onload = function() {
    packet.data = fr.result;
    exports.encodePacket(packet, supportsBinary, true, callback);
  };
  return fr.readAsArrayBuffer(packet.data);
}

function encodeBlob(packet, supportsBinary, callback) {
  if (!supportsBinary) {
    return exports.encodeBase64Packet(packet, callback);
  }

  if (dontSendBlobs) {
    return encodeBlobAsArrayBuffer(packet, supportsBinary, callback);
  }

  var length = new Uint8Array(1);
  length[0] = packets[packet.type];
  var blob = new Blob([length.buffer, packet.data]);

  return callback(blob);
}

/**
 * Encodes a packet with binary data in a base64 string
 *
 * @param {Object} packet, has `type` and `data`
 * @return {String} base64 encoded message
 */

exports.encodeBase64Packet = function(packet, callback) {
  var message = 'b' + exports.packets[packet.type];
  if (Blob && packet.data instanceof global.Blob) {
    var fr = new FileReader();
    fr.onload = function() {
      var b64 = fr.result.split(',')[1];
      callback(message + b64);
    };
    return fr.readAsDataURL(packet.data);
  }

  var b64data;
  try {
    b64data = String.fromCharCode.apply(null, new Uint8Array(packet.data));
  } catch (e) {
    // iPhone Safari doesn't let you apply with typed arrays
    var typed = new Uint8Array(packet.data);
    var basic = new Array(typed.length);
    for (var i = 0; i < typed.length; i++) {
      basic[i] = typed[i];
    }
    b64data = String.fromCharCode.apply(null, basic);
  }
  message += global.btoa(b64data);
  return callback(message);
};

/**
 * Decodes a packet. Changes format to Blob if requested.
 *
 * @return {Object} with `type` and `data` (if any)
 * @api private
 */

exports.decodePacket = function (data, binaryType, utf8decode) {
  if (data === undefined) {
    return err;
  }
  // String data
  if (typeof data == 'string') {
    if (data.charAt(0) == 'b') {
      return exports.decodeBase64Packet(data.substr(1), binaryType);
    }

    if (utf8decode) {
      data = tryDecode(data);
      if (data === false) {
        return err;
      }
    }
    var type = data.charAt(0);

    if (Number(type) != type || !packetslist[type]) {
      return err;
    }

    if (data.length > 1) {
      return { type: packetslist[type], data: data.substring(1) };
    } else {
      return { type: packetslist[type] };
    }
  }

  var asArray = new Uint8Array(data);
  var type = asArray[0];
  var rest = sliceBuffer(data, 1);
  if (Blob && binaryType === 'blob') {
    rest = new Blob([rest]);
  }
  return { type: packetslist[type], data: rest };
};

function tryDecode(data) {
  try {
    data = utf8.decode(data);
  } catch (e) {
    return false;
  }
  return data;
}

/**
 * Decodes a packet encoded in a base64 string
 *
 * @param {String} base64 encoded message
 * @return {Object} with `type` and `data` (if any)
 */

exports.decodeBase64Packet = function(msg, binaryType) {
  var type = packetslist[msg.charAt(0)];
  if (!base64encoder) {
    return { type: type, data: { base64: true, data: msg.substr(1) } };
  }

  var data = base64encoder.decode(msg.substr(1));

  if (binaryType === 'blob' && Blob) {
    data = new Blob([data]);
  }

  return { type: type, data: data };
};

/**
 * Encodes multiple messages (payload).
 *
 *     <length>:data
 *
 * Example:
 *
 *     11:hello world2:hi
 *
 * If any contents are binary, they will be encoded as base64 strings. Base64
 * encoded strings are marked with a b before the length specifier
 *
 * @param {Array} packets
 * @api private
 */

exports.encodePayload = function (packets, supportsBinary, callback) {
  if (typeof supportsBinary == 'function') {
    callback = supportsBinary;
    supportsBinary = null;
  }

  var isBinary = hasBinary(packets);

  if (supportsBinary && isBinary) {
    if (Blob && !dontSendBlobs) {
      return exports.encodePayloadAsBlob(packets, callback);
    }

    return exports.encodePayloadAsArrayBuffer(packets, callback);
  }

  if (!packets.length) {
    return callback('0:');
  }

  function setLengthHeader(message) {
    return message.length + ':' + message;
  }

  function encodeOne(packet, doneCallback) {
    exports.encodePacket(packet, !isBinary ? false : supportsBinary, true, function(message) {
      doneCallback(null, setLengthHeader(message));
    });
  }

  map(packets, encodeOne, function(err, results) {
    return callback(results.join(''));
  });
};

/**
 * Async array map using after
 */

function map(ary, each, done) {
  var result = new Array(ary.length);
  var next = after(ary.length, done);

  var eachWithIndex = function(i, el, cb) {
    each(el, function(error, msg) {
      result[i] = msg;
      cb(error, result);
    });
  };

  for (var i = 0; i < ary.length; i++) {
    eachWithIndex(i, ary[i], next);
  }
}

/*
 * Decodes data when a payload is maybe expected. Possible binary contents are
 * decoded from their base64 representation
 *
 * @param {String} data, callback method
 * @api public
 */

exports.decodePayload = function (data, binaryType, callback) {
  if (typeof data != 'string') {
    return exports.decodePayloadAsBinary(data, binaryType, callback);
  }

  if (typeof binaryType === 'function') {
    callback = binaryType;
    binaryType = null;
  }

  var packet;
  if (data == '') {
    // parser error - ignoring payload
    return callback(err, 0, 1);
  }

  var length = ''
    , n, msg;

  for (var i = 0, l = data.length; i < l; i++) {
    var chr = data.charAt(i);

    if (':' != chr) {
      length += chr;
    } else {
      if ('' == length || (length != (n = Number(length)))) {
        // parser error - ignoring payload
        return callback(err, 0, 1);
      }

      msg = data.substr(i + 1, n);

      if (length != msg.length) {
        // parser error - ignoring payload
        return callback(err, 0, 1);
      }

      if (msg.length) {
        packet = exports.decodePacket(msg, binaryType, true);

        if (err.type == packet.type && err.data == packet.data) {
          // parser error in individual packet - ignoring payload
          return callback(err, 0, 1);
        }

        var ret = callback(packet, i + n, l);
        if (false === ret) return;
      }

      // advance cursor
      i += n;
      length = '';
    }
  }

  if (length != '') {
    // parser error - ignoring payload
    return callback(err, 0, 1);
  }

};

/**
 * Encodes multiple messages (payload) as binary.
 *
 * <1 = binary, 0 = string><number from 0-9><number from 0-9>[...]<number
 * 255><data>
 *
 * Example:
 * 1 3 255 1 2 3, if the binary contents are interpreted as 8 bit integers
 *
 * @param {Array} packets
 * @return {ArrayBuffer} encoded payload
 * @api private
 */

exports.encodePayloadAsArrayBuffer = function(packets, callback) {
  if (!packets.length) {
    return callback(new ArrayBuffer(0));
  }

  function encodeOne(packet, doneCallback) {
    exports.encodePacket(packet, true, true, function(data) {
      return doneCallback(null, data);
    });
  }

  map(packets, encodeOne, function(err, encodedPackets) {
    var totalLength = encodedPackets.reduce(function(acc, p) {
      var len;
      if (typeof p === 'string'){
        len = p.length;
      } else {
        len = p.byteLength;
      }
      return acc + len.toString().length + len + 2; // string/binary identifier + separator = 2
    }, 0);

    var resultArray = new Uint8Array(totalLength);

    var bufferIndex = 0;
    encodedPackets.forEach(function(p) {
      var isString = typeof p === 'string';
      var ab = p;
      if (isString) {
        var view = new Uint8Array(p.length);
        for (var i = 0; i < p.length; i++) {
          view[i] = p.charCodeAt(i);
        }
        ab = view.buffer;
      }

      if (isString) { // not true binary
        resultArray[bufferIndex++] = 0;
      } else { // true binary
        resultArray[bufferIndex++] = 1;
      }

      var lenStr = ab.byteLength.toString();
      for (var i = 0; i < lenStr.length; i++) {
        resultArray[bufferIndex++] = parseInt(lenStr[i]);
      }
      resultArray[bufferIndex++] = 255;

      var view = new Uint8Array(ab);
      for (var i = 0; i < view.length; i++) {
        resultArray[bufferIndex++] = view[i];
      }
    });

    return callback(resultArray.buffer);
  });
};

/**
 * Encode as Blob
 */

exports.encodePayloadAsBlob = function(packets, callback) {
  function encodeOne(packet, doneCallback) {
    exports.encodePacket(packet, true, true, function(encoded) {
      var binaryIdentifier = new Uint8Array(1);
      binaryIdentifier[0] = 1;
      if (typeof encoded === 'string') {
        var view = new Uint8Array(encoded.length);
        for (var i = 0; i < encoded.length; i++) {
          view[i] = encoded.charCodeAt(i);
        }
        encoded = view.buffer;
        binaryIdentifier[0] = 0;
      }

      var len = (encoded instanceof ArrayBuffer)
        ? encoded.byteLength
        : encoded.size;

      var lenStr = len.toString();
      var lengthAry = new Uint8Array(lenStr.length + 1);
      for (var i = 0; i < lenStr.length; i++) {
        lengthAry[i] = parseInt(lenStr[i]);
      }
      lengthAry[lenStr.length] = 255;

      if (Blob) {
        var blob = new Blob([binaryIdentifier.buffer, lengthAry.buffer, encoded]);
        doneCallback(null, blob);
      }
    });
  }

  map(packets, encodeOne, function(err, results) {
    return callback(new Blob(results));
  });
};

/*
 * Decodes data when a payload is maybe expected. Strings are decoded by
 * interpreting each byte as a key code for entries marked to start with 0. See
 * description of encodePayloadAsBinary
 *
 * @param {ArrayBuffer} data, callback method
 * @api public
 */

exports.decodePayloadAsBinary = function (data, binaryType, callback) {
  if (typeof binaryType === 'function') {
    callback = binaryType;
    binaryType = null;
  }

  var bufferTail = data;
  var buffers = [];

  var numberTooLong = false;
  while (bufferTail.byteLength > 0) {
    var tailArray = new Uint8Array(bufferTail);
    var isString = tailArray[0] === 0;
    var msgLength = '';

    for (var i = 1; ; i++) {
      if (tailArray[i] == 255) break;

      if (msgLength.length > 310) {
        numberTooLong = true;
        break;
      }

      msgLength += tailArray[i];
    }

    if(numberTooLong) return callback(err, 0, 1);

    bufferTail = sliceBuffer(bufferTail, 2 + msgLength.length);
    msgLength = parseInt(msgLength);

    var msg = sliceBuffer(bufferTail, 0, msgLength);
    if (isString) {
      try {
        msg = String.fromCharCode.apply(null, new Uint8Array(msg));
      } catch (e) {
        // iPhone Safari doesn't let you apply to typed arrays
        var typed = new Uint8Array(msg);
        msg = '';
        for (var i = 0; i < typed.length; i++) {
          msg += String.fromCharCode(typed[i]);
        }
      }
    }

    buffers.push(msg);
    bufferTail = sliceBuffer(bufferTail, msgLength);
  }

  var total = buffers.length;
  buffers.forEach(function(buffer, i) {
    callback(exports.decodePacket(buffer, binaryType, true), i, total);
  });
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _Utils = __webpack_require__(4);

var _Utils2 = _interopRequireDefault(_Utils);

var _Serializer = __webpack_require__(1);

var _Serializer2 = _interopRequireDefault(_Serializer);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var Serializable = function () {
    function Serializable() {
        _classCallCheck(this, Serializable);
    }

    _createClass(Serializable, [{
        key: 'serialize',

        /**
         *  Class can be serialized using either:
             - a class based netScheme
             - an instance based netScheme
             - completely dynamically (not implemented yet)
          * @param {Object} serializer
         * @param {Object} [options] - Options object
         * @param {Object} options.dataBuffer [optional] - Data buffer to write to. If null a new data buffer will be created
         * @param {Number} options.bufferOffset [optional] - The buffer data offset to start writing at. Default: 0
         * @param {String} options.dry [optional] - Does not actually write to the buffer (useful to gather serializeable size)
         * @returns {Object} the serialized object.  Contains attributes: dataBuffer - buffer which contains the serialized data;  bufferOffset - offset where the serialized data starts.
         */
        value: function serialize(serializer, options) {
            options = Object.assign({
                bufferOffset: 0
            }, options);

            var netScheme = void 0;
            var dataBuffer = void 0;
            var dataView = void 0;
            var classId = 0;
            var bufferOffset = options.bufferOffset;
            var localBufferOffset = 0; // used for counting the bufferOffset

            // instance classId
            if (this.classId) {
                classId = this.classId;
            } else {
                classId = _Utils2.default.hashStr(this.constructor.name);
            }

            // instance netScheme
            if (this.netScheme) {
                netScheme = this.netScheme;
            } else if (this.constructor.netScheme) {
                netScheme = this.constructor.netScheme;
            } else {
                // todo define behaviour when a netScheme is undefined
                console.warn('no netScheme defined! This will result in awful performance');
            }

            // TODO: currently we serialize every node twice, once to calculate the size
            //       of the buffers and once to write them out.  This can be reduced to
            //       a single pass by starting with a large (and static) ArrayBuffer and
            //       recursively building it up.
            // buffer has one Uint8Array for class id, then payload
            if (options.dataBuffer == null && options.dry != true) {
                var bufferSize = this.serialize(serializer, { dry: true }).bufferOffset;
                dataBuffer = new ArrayBuffer(bufferSize);
            } else {
                dataBuffer = options.dataBuffer;
            }

            if (options.dry != true) {
                dataView = new DataView(dataBuffer);
                // first set the id of the class, so that the deserializer can fetch information about it
                dataView.setUint8(bufferOffset + localBufferOffset, classId);
            }

            // advance the offset counter
            localBufferOffset += Uint8Array.BYTES_PER_ELEMENT;

            if (netScheme) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = Object.keys(netScheme).sort()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var property = _step.value;

                        // write the property to buffer
                        if (options.dry != true) {
                            serializer.writeDataView(dataView, this[property], bufferOffset + localBufferOffset, netScheme[property]);
                        }

                        if (netScheme[property].type === _Serializer2.default.TYPES.STRING) {
                            // derive the size of the string
                            localBufferOffset += Uint16Array.BYTES_PER_ELEMENT;
                            if (this[property] !== null) localBufferOffset += this[property].length * Uint16Array.BYTES_PER_ELEMENT;
                        } else if (netScheme[property].type == _Serializer2.default.TYPES.CLASSINSTANCE) {
                            // derive the size of the included class
                            var objectInstanceBufferOffset = this[property].serialize(serializer, { dry: true }).bufferOffset;
                            localBufferOffset += objectInstanceBufferOffset;
                        } else if (netScheme[property].type == _Serializer2.default.TYPES.LIST) {
                            // derive the size of the list
                            // list starts with number of elements
                            localBufferOffset += Uint16Array.BYTES_PER_ELEMENT;

                            var _iteratorNormalCompletion2 = true;
                            var _didIteratorError2 = false;
                            var _iteratorError2 = undefined;

                            try {
                                for (var _iterator2 = this[property][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                    var item = _step2.value;

                                    // todo inelegant, currently doesn't support list of lists
                                    if (netScheme[property].itemType == _Serializer2.default.TYPES.CLASSINSTANCE) {
                                        var listBufferOffset = item.serialize(serializer, { dry: true }).bufferOffset;
                                        localBufferOffset += listBufferOffset;
                                    } else {
                                        localBufferOffset += serializer.getTypeByteSize(netScheme[property].itemType);
                                    }
                                }
                            } catch (err) {
                                _didIteratorError2 = true;
                                _iteratorError2 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                        _iterator2.return();
                                    }
                                } finally {
                                    if (_didIteratorError2) {
                                        throw _iteratorError2;
                                    }
                                }
                            }
                        } else {
                            // advance offset
                            localBufferOffset += serializer.getTypeByteSize(netScheme[property].type);
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            } else {
                // TODO no netScheme, dynamic class
            }

            return { dataBuffer: dataBuffer, bufferOffset: localBufferOffset };
        }

        // build a clone of this object with pruned strings (if necessary)

    }, {
        key: 'prunedStringsClone',
        value: function prunedStringsClone(serializer, prevObject) {
            var _this = this;

            if (!prevObject) return this;
            prevObject = serializer.deserialize(prevObject).obj;

            // get list of string properties which changed
            var netScheme = this.constructor.netScheme;
            var isString = function isString(p) {
                return netScheme[p].type === _Serializer2.default.TYPES.STRING;
            };
            var hasChanged = function hasChanged(p) {
                return prevObject[p] !== _this[p];
            };
            var changedStrings = Object.keys(netScheme).filter(isString).filter(hasChanged);
            if (changedStrings.length == 0) return this;

            // build a clone with pruned strings
            var prunedCopy = new this.constructor(null, { id: null });
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = Object.keys(netScheme)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var p = _step3.value;

                    prunedCopy[p] = changedStrings.indexOf(p) < 0 ? this[p] : null;
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            return prunedCopy;
        }
    }, {
        key: 'syncTo',
        value: function syncTo(other) {
            var netScheme = this.constructor.netScheme;
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = Object.keys(netScheme)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var p = _step4.value;

                    // ignore classes and lists
                    if (netScheme[p].type === _Serializer2.default.TYPES.LIST || netScheme[p].type === _Serializer2.default.TYPES.CLASSINSTANCE) continue;

                    // strings might be pruned
                    if (netScheme[p].type === _Serializer2.default.TYPES.STRING) {
                        if (typeof other[p] === 'string') this[p] = other[p];
                        continue;
                    }

                    // all other values are copied
                    this[p] = other[p];
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }
        }
    }]);

    return Serializable;
}();

exports.default = Serializable;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var Utils = function () {
    function Utils() {
        _classCallCheck(this, Utils);
    }

    _createClass(Utils, null, [{
        key: 'hashStr',
        value: function hashStr(str, bits) {
            var hash = 5381;
            var i = str.length;
            bits = bits ? bits : 8;

            while (i) {
                hash = hash * 33 ^ str.charCodeAt(--i);
            }
            hash = hash >>> 0;
            hash = hash % (Math.pow(2, bits) - 1);

            // JavaScript does bitwise operations (like XOR, above) on 32-bit signed
            // integers. Since we want the results to be always positive, convert the
            // signed int to an unsigned by doing an unsigned bitshift. */
            return hash;
        }
    }, {
        key: 'arrayBuffersEqual',
        value: function arrayBuffersEqual(buf1, buf2) {
            if (buf1.byteLength !== buf2.byteLength) return false;
            var dv1 = new Int8Array(buf1);
            var dv2 = new Int8Array(buf2);
            for (var i = 0; i !== buf1.byteLength; i++) {
                if (dv1[i] !== dv2[i]) return false;
            }
            return true;
        }
    }, {
        key: 'httpGetPromise',
        value: function httpGetPromise(url) {
            return new Promise(function (resolve, reject) {
                var req = new XMLHttpRequest();
                req.open('GET', url, true);
                req.onload = function () {
                    if (req.status >= 200 && req.status < 400) resolve(JSON.parse(req.responseText));else reject();
                };
                req.onerror = function () {};
                req.send();
            });
        }
    }]);

    return Utils;
}();

exports.default = Utils;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = Object.prototype.hasOwnProperty;

//
// We store our EE objects in a plain object whose properties are event names.
// If `Object.create(null)` is not supported we prefix the event names with a
// `~` to make sure that the built-in object properties are not overridden or
// used as an attack vector.
// We also assume that `Object.create(null)` is available when the event name
// is an ES6 Symbol.
//
var prefix = typeof Object.create !== 'function' ? '~' : false;

/**
 * Representation of a single EventEmitter function.
 *
 * @param {Function} fn Event handler to be called.
 * @param {Mixed} context Context for function execution.
 * @param {Boolean} [once=false] Only emit once
 * @api private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Minimal EventEmitter interface that is molded against the Node.js
 * EventEmitter interface.
 *
 * @constructor
 * @api public
 */
function EventEmitter() { /* Nothing to set */ }

/**
 * Hold the assigned EventEmitters by name.
 *
 * @type {Object}
 * @private
 */
EventEmitter.prototype._events = undefined;

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @api public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var events = this._events
    , names = []
    , name;

  if (!events) return names;

  for (name in events) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return a list of assigned event listeners.
 *
 * @param {String} event The events that should be listed.
 * @param {Boolean} exists We only need to know if there are listeners.
 * @returns {Array|Boolean}
 * @api public
 */
EventEmitter.prototype.listeners = function listeners(event, exists) {
  var evt = prefix ? prefix + event : event
    , available = this._events && this._events[evt];

  if (exists) return !!available;
  if (!available) return [];
  if (available.fn) return [available.fn];

  for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
    ee[i] = available[i].fn;
  }

  return ee;
};

/**
 * Emit an event to all registered event listeners.
 *
 * @param {String} event The name of the event.
 * @returns {Boolean} Indication if we've emitted an event.
 * @api public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events || !this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if ('function' === typeof listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Register a new EventListener for the given event.
 *
 * @param {String} event Name of the event.
 * @param {Function} fn Callback function.
 * @param {Mixed} [context=this] The context of the function.
 * @api public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  var listener = new EE(fn, context || this)
    , evt = prefix ? prefix + event : event;

  if (!this._events) this._events = prefix ? {} : Object.create(null);
  if (!this._events[evt]) this._events[evt] = listener;
  else {
    if (!this._events[evt].fn) this._events[evt].push(listener);
    else this._events[evt] = [
      this._events[evt], listener
    ];
  }

  return this;
};

/**
 * Add an EventListener that's only called once.
 *
 * @param {String} event Name of the event.
 * @param {Function} fn Callback function.
 * @param {Mixed} [context=this] The context of the function.
 * @api public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  var listener = new EE(fn, context || this, true)
    , evt = prefix ? prefix + event : event;

  if (!this._events) this._events = prefix ? {} : Object.create(null);
  if (!this._events[evt]) this._events[evt] = listener;
  else {
    if (!this._events[evt].fn) this._events[evt].push(listener);
    else this._events[evt] = [
      this._events[evt], listener
    ];
  }

  return this;
};

/**
 * Remove event listeners.
 *
 * @param {String} event The event we want to remove.
 * @param {Function} fn The listener that we need to find.
 * @param {Mixed} context Only remove listeners matching this context.
 * @param {Boolean} once Only remove once listeners.
 * @api public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events || !this._events[evt]) return this;

  var listeners = this._events[evt]
    , events = [];

  if (fn) {
    if (listeners.fn) {
      if (
           listeners.fn !== fn
        || (once && !listeners.once)
        || (context && listeners.context !== context)
      ) {
        events.push(listeners);
      }
    } else {
      for (var i = 0, length = listeners.length; i < length; i++) {
        if (
             listeners[i].fn !== fn
          || (once && !listeners[i].once)
          || (context && listeners[i].context !== context)
        ) {
          events.push(listeners[i]);
        }
      }
    }
  }

  //
  // Reset the array, or remove it completely if we have no more listeners.
  //
  if (events.length) {
    this._events[evt] = events.length === 1 ? events[0] : events;
  } else {
    delete this._events[evt];
  }

  return this;
};

/**
 * Remove all listeners or only the listeners for the specified event.
 *
 * @param {String} event The event want to remove all listeners for.
 * @api public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  if (!this._events) return this;

  if (event) delete this._events[prefix ? prefix + event : event];
  else this._events = prefix ? {} : Object.create(null);

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// This function doesn't apply anymore.
//
EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
  return this;
};

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Expose the module.
//
if (true) {
  module.exports = EventEmitter;
}


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _Serializable2 = __webpack_require__(3);

var _Serializable3 = _interopRequireDefault(_Serializable2);

var _Serializer = __webpack_require__(1);

var _Serializer2 = _interopRequireDefault(_Serializer);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

/**
 * A TwoVector is a geometric object which is completely described
 * by two values.
 */
var TwoVector = function (_Serializable) {
    _inherits(TwoVector, _Serializable);

    _createClass(TwoVector, null, [{
        key: 'netScheme',
        get: function get() {
            return {
                x: { type: _Serializer2.default.TYPES.FLOAT32 },
                y: { type: _Serializer2.default.TYPES.FLOAT32 }
            };
        }

        /**
        * Creates an instance of a TwoVector.
        * @param {Number} x - first value
        * @param {Number} y - second value
        * @return {TwoVector} v - the new TwoVector
        */

    }]);

    function TwoVector(x, y) {
        var _ret;

        _classCallCheck(this, TwoVector);

        var _this = _possibleConstructorReturn(this, (TwoVector.__proto__ || Object.getPrototypeOf(TwoVector)).call(this));

        _this.x = x;
        _this.y = y;

        return _ret = _this, _possibleConstructorReturn(_this, _ret);
    }

    /**
     * Formatted textual description of the TwoVector.
     * @return {String} description
     */

    _createClass(TwoVector, [{
        key: 'toString',
        value: function toString() {
            function round3(x) {
                return Math.round(x * 1000) / 1000;
            }
            return '(' + round3(this.x) + ', ' + round3(this.y) + ')';
        }
    }, {
        key: 'set',
        value: function set(x, y) {
            this.x = x;
            this.y = y;
            return this;
        }
    }, {
        key: 'multiply',
        value: function multiply(other) {
            this.x *= other.x;
            this.y *= other.y;

            return this;
        }
    }, {
        key: 'multiplyScalar',
        value: function multiplyScalar(s) {
            this.x *= s;
            this.y *= s;

            return this;
        }
    }, {
        key: 'add',
        value: function add(other) {
            this.x += other.x;
            this.y += other.y;

            return this;
        }
    }, {
        key: 'subtract',
        value: function subtract(other) {
            this.x -= other.x;
            this.y -= other.y;

            return this;
        }
    }, {
        key: 'length',
        value: function length() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }
    }, {
        key: 'normalize',
        value: function normalize() {
            this.multiplyScalar(1 / this.length());
            return this;
        }
    }, {
        key: 'copy',
        value: function copy(sourceObj) {
            this.x = sourceObj.x;
            this.y = sourceObj.y;

            return this;
        }
    }, {
        key: 'clone',
        value: function clone() {
            return new TwoVector(this.x, this.y);
        }
    }, {
        key: 'lerp',
        value: function lerp(target, p) {
            this.x += (target.x - this.x) * p;
            this.y += (target.y - this.y) * p;
        }
    }]);

    return TwoVector;
}(_Serializable3.default);

exports.default = TwoVector;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {
/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(40);
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && 'WebkitAppearance' in document.documentElement.style) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (window.console && (console.firebug || (console.exception && console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs() {
  var args = arguments;
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return args;

  var c = 'color: ' + this.color;
  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
  return args;
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    return exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (typeof process !== 'undefined' && 'env' in process) {
    return process.env.DEBUG;
  }
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage(){
  try {
    return window.localStorage;
  } catch (e) {}
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(18)))

/***/ }),
/* 8 */
/***/ (function(module, exports) {


module.exports = function(a, b){
  var fn = function(){};
  fn.prototype = b.prototype;
  a.prototype = new fn;
  a.prototype.constructor = a;
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {
/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(62);
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && 'WebkitAppearance' in document.documentElement.style) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (window.console && (console.firebug || (console.exception && console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs() {
  var args = arguments;
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return args;

  var c = 'color: ' + this.color;
  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
  return args;
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    return exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (typeof process !== 'undefined' && 'env' in process) {
    return process.env.DEBUG;
  }
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage(){
  try {
    return window.localStorage;
  } catch (e) {}
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(18)))

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * Module dependencies.
 */

var debug = __webpack_require__(42)('socket.io-parser');
var json = __webpack_require__(45);
var Emitter = __webpack_require__(47);
var binary = __webpack_require__(48);
var isBuf = __webpack_require__(20);

/**
 * Protocol version.
 *
 * @api public
 */

exports.protocol = 4;

/**
 * Packet types.
 *
 * @api public
 */

exports.types = [
  'CONNECT',
  'DISCONNECT',
  'EVENT',
  'ACK',
  'ERROR',
  'BINARY_EVENT',
  'BINARY_ACK'
];

/**
 * Packet type `connect`.
 *
 * @api public
 */

exports.CONNECT = 0;

/**
 * Packet type `disconnect`.
 *
 * @api public
 */

exports.DISCONNECT = 1;

/**
 * Packet type `event`.
 *
 * @api public
 */

exports.EVENT = 2;

/**
 * Packet type `ack`.
 *
 * @api public
 */

exports.ACK = 3;

/**
 * Packet type `error`.
 *
 * @api public
 */

exports.ERROR = 4;

/**
 * Packet type 'binary event'
 *
 * @api public
 */

exports.BINARY_EVENT = 5;

/**
 * Packet type `binary ack`. For acks with binary arguments.
 *
 * @api public
 */

exports.BINARY_ACK = 6;

/**
 * Encoder constructor.
 *
 * @api public
 */

exports.Encoder = Encoder;

/**
 * Decoder constructor.
 *
 * @api public
 */

exports.Decoder = Decoder;

/**
 * A socket.io Encoder instance
 *
 * @api public
 */

function Encoder() {}

/**
 * Encode a packet as a single string if non-binary, or as a
 * buffer sequence, depending on packet type.
 *
 * @param {Object} obj - packet object
 * @param {Function} callback - function to handle encodings (likely engine.write)
 * @return Calls callback with Array of encodings
 * @api public
 */

Encoder.prototype.encode = function(obj, callback){
  debug('encoding packet %j', obj);

  if (exports.BINARY_EVENT == obj.type || exports.BINARY_ACK == obj.type) {
    encodeAsBinary(obj, callback);
  }
  else {
    var encoding = encodeAsString(obj);
    callback([encoding]);
  }
};

/**
 * Encode packet as string.
 *
 * @param {Object} packet
 * @return {String} encoded
 * @api private
 */

function encodeAsString(obj) {
  var str = '';
  var nsp = false;

  // first is type
  str += obj.type;

  // attachments if we have them
  if (exports.BINARY_EVENT == obj.type || exports.BINARY_ACK == obj.type) {
    str += obj.attachments;
    str += '-';
  }

  // if we have a namespace other than `/`
  // we append it followed by a comma `,`
  if (obj.nsp && '/' != obj.nsp) {
    nsp = true;
    str += obj.nsp;
  }

  // immediately followed by the id
  if (null != obj.id) {
    if (nsp) {
      str += ',';
      nsp = false;
    }
    str += obj.id;
  }

  // json data
  if (null != obj.data) {
    if (nsp) str += ',';
    str += json.stringify(obj.data);
  }

  debug('encoded %j as %s', obj, str);
  return str;
}

/**
 * Encode packet as 'buffer sequence' by removing blobs, and
 * deconstructing packet into object with placeholders and
 * a list of buffers.
 *
 * @param {Object} packet
 * @return {Buffer} encoded
 * @api private
 */

function encodeAsBinary(obj, callback) {

  function writeEncoding(bloblessData) {
    var deconstruction = binary.deconstructPacket(bloblessData);
    var pack = encodeAsString(deconstruction.packet);
    var buffers = deconstruction.buffers;

    buffers.unshift(pack); // add packet info to beginning of data list
    callback(buffers); // write all the buffers
  }

  binary.removeBlobs(obj, writeEncoding);
}

/**
 * A socket.io Decoder instance
 *
 * @return {Object} decoder
 * @api public
 */

function Decoder() {
  this.reconstructor = null;
}

/**
 * Mix in `Emitter` with Decoder.
 */

Emitter(Decoder.prototype);

/**
 * Decodes an ecoded packet string into packet JSON.
 *
 * @param {String} obj - encoded packet
 * @return {Object} packet
 * @api public
 */

Decoder.prototype.add = function(obj) {
  var packet;
  if ('string' == typeof obj) {
    packet = decodeString(obj);
    if (exports.BINARY_EVENT == packet.type || exports.BINARY_ACK == packet.type) { // binary packet's json
      this.reconstructor = new BinaryReconstructor(packet);

      // no attachments, labeled binary but no binary data to follow
      if (this.reconstructor.reconPack.attachments === 0) {
        this.emit('decoded', packet);
      }
    } else { // non-binary full packet
      this.emit('decoded', packet);
    }
  }
  else if (isBuf(obj) || obj.base64) { // raw binary data
    if (!this.reconstructor) {
      throw new Error('got binary data when not reconstructing a packet');
    } else {
      packet = this.reconstructor.takeBinaryData(obj);
      if (packet) { // received final buffer
        this.reconstructor = null;
        this.emit('decoded', packet);
      }
    }
  }
  else {
    throw new Error('Unknown type: ' + obj);
  }
};

/**
 * Decode a packet String (JSON data)
 *
 * @param {String} str
 * @return {Object} packet
 * @api private
 */

function decodeString(str) {
  var p = {};
  var i = 0;

  // look up type
  p.type = Number(str.charAt(0));
  if (null == exports.types[p.type]) return error();

  // look up attachments if type binary
  if (exports.BINARY_EVENT == p.type || exports.BINARY_ACK == p.type) {
    var buf = '';
    while (str.charAt(++i) != '-') {
      buf += str.charAt(i);
      if (i == str.length) break;
    }
    if (buf != Number(buf) || str.charAt(i) != '-') {
      throw new Error('Illegal attachments');
    }
    p.attachments = Number(buf);
  }

  // look up namespace (if any)
  if ('/' == str.charAt(i + 1)) {
    p.nsp = '';
    while (++i) {
      var c = str.charAt(i);
      if (',' == c) break;
      p.nsp += c;
      if (i == str.length) break;
    }
  } else {
    p.nsp = '/';
  }

  // look up id
  var next = str.charAt(i + 1);
  if ('' !== next && Number(next) == next) {
    p.id = '';
    while (++i) {
      var c = str.charAt(i);
      if (null == c || Number(c) != c) {
        --i;
        break;
      }
      p.id += str.charAt(i);
      if (i == str.length) break;
    }
    p.id = Number(p.id);
  }

  // look up json data
  if (str.charAt(++i)) {
    p = tryParse(p, str.substr(i));
  }

  debug('decoded %s as %j', str, p);
  return p;
}

function tryParse(p, str) {
  try {
    p.data = json.parse(str);
  } catch(e){
    return error();
  }
  return p; 
};

/**
 * Deallocates a parser's resources
 *
 * @api public
 */

Decoder.prototype.destroy = function() {
  if (this.reconstructor) {
    this.reconstructor.finishedReconstruction();
  }
};

/**
 * A manager of a binary event's 'buffer sequence'. Should
 * be constructed whenever a packet of type BINARY_EVENT is
 * decoded.
 *
 * @param {Object} packet
 * @return {BinaryReconstructor} initialized reconstructor
 * @api private
 */

function BinaryReconstructor(packet) {
  this.reconPack = packet;
  this.buffers = [];
}

/**
 * Method to be called when binary data received from connection
 * after a BINARY_EVENT packet.
 *
 * @param {Buffer | ArrayBuffer} binData - the raw binary data received
 * @return {null | Object} returns null if more binary data is expected or
 *   a reconstructed packet object if all buffers have been received.
 * @api private
 */

BinaryReconstructor.prototype.takeBinaryData = function(binData) {
  this.buffers.push(binData);
  if (this.buffers.length == this.reconPack.attachments) { // done with buffer list
    var packet = binary.reconstructPacket(this.reconPack, this.buffers);
    this.finishedReconstruction();
    return packet;
  }
  return null;
};

/**
 * Cleans up binary packet reconstruction variables.
 *
 * @api private
 */

BinaryReconstructor.prototype.finishedReconstruction = function() {
  this.reconPack = null;
  this.buffers = [];
};

function error(data){
  return {
    type: exports.ERROR,
    data: 'parser error'
  };
}


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {// browser shim for xmlhttprequest module

var hasCORS = __webpack_require__(53);

module.exports = function (opts) {
  var xdomain = opts.xdomain;

  // scheme must be same when usign XDomainRequest
  // http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
  var xscheme = opts.xscheme;

  // XDomainRequest has a flow of not sending cookie, therefore it should be disabled as a default.
  // https://github.com/Automattic/engine.io-client/pull/217
  var enablesXDR = opts.enablesXDR;

  // XMLHttpRequest can be disabled on IE
  try {
    if ('undefined' !== typeof XMLHttpRequest && (!xdomain || hasCORS)) {
      return new XMLHttpRequest();
    }
  } catch (e) { }

  // Use XDomainRequest for IE8 if enablesXDR is true
  // because loading bar keeps flashing when using jsonp-polling
  // https://github.com/yujiosaka/socke.io-ie8-loading-example
  try {
    if ('undefined' !== typeof XDomainRequest && !xscheme && enablesXDR) {
      return new XDomainRequest();
    }
  } catch (e) { }

  if (!xdomain) {
    try {
      return new global[['Active'].concat('Object').join('X')]('Microsoft.XMLHTTP');
    } catch (e) { }
  }
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Module dependencies.
 */

var parser = __webpack_require__(2);
var Emitter = __webpack_require__(13);

/**
 * Module exports.
 */

module.exports = Transport;

/**
 * Transport abstract constructor.
 *
 * @param {Object} options.
 * @api private
 */

function Transport (opts) {
  this.path = opts.path;
  this.hostname = opts.hostname;
  this.port = opts.port;
  this.secure = opts.secure;
  this.query = opts.query;
  this.timestampParam = opts.timestampParam;
  this.timestampRequests = opts.timestampRequests;
  this.readyState = '';
  this.agent = opts.agent || false;
  this.socket = opts.socket;
  this.enablesXDR = opts.enablesXDR;

  // SSL options for Node.js client
  this.pfx = opts.pfx;
  this.key = opts.key;
  this.passphrase = opts.passphrase;
  this.cert = opts.cert;
  this.ca = opts.ca;
  this.ciphers = opts.ciphers;
  this.rejectUnauthorized = opts.rejectUnauthorized;
  this.forceNode = opts.forceNode;

  // other options for Node.js client
  this.extraHeaders = opts.extraHeaders;
  this.localAddress = opts.localAddress;
}

/**
 * Mix in `Emitter`.
 */

Emitter(Transport.prototype);

/**
 * Emits an error.
 *
 * @param {String} str
 * @return {Transport} for chaining
 * @api public
 */

Transport.prototype.onError = function (msg, desc) {
  var err = new Error(msg);
  err.type = 'TransportError';
  err.description = desc;
  this.emit('error', err);
  return this;
};

/**
 * Opens the transport.
 *
 * @api public
 */

Transport.prototype.open = function () {
  if ('closed' === this.readyState || '' === this.readyState) {
    this.readyState = 'opening';
    this.doOpen();
  }

  return this;
};

/**
 * Closes the transport.
 *
 * @api private
 */

Transport.prototype.close = function () {
  if ('opening' === this.readyState || 'open' === this.readyState) {
    this.doClose();
    this.onClose();
  }

  return this;
};

/**
 * Sends multiple packets.
 *
 * @param {Array} packets
 * @api private
 */

Transport.prototype.send = function (packets) {
  if ('open' === this.readyState) {
    this.write(packets);
  } else {
    throw new Error('Transport not open');
  }
};

/**
 * Called upon open
 *
 * @api private
 */

Transport.prototype.onOpen = function () {
  this.readyState = 'open';
  this.writable = true;
  this.emit('open');
};

/**
 * Called with data.
 *
 * @param {String} data
 * @api private
 */

Transport.prototype.onData = function (data) {
  var packet = parser.decodePacket(data, this.socket.binaryType);
  this.onPacket(packet);
};

/**
 * Called with a decoded packet.
 */

Transport.prototype.onPacket = function (packet) {
  this.emit('packet', packet);
};

/**
 * Called upon close.
 *
 * @api private
 */

Transport.prototype.onClose = function () {
  this.readyState = 'closed';
  this.emit('close');
};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * Expose `Emitter`.
 */

if (true) {
  module.exports = Emitter;
}

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};


/***/ }),
/* 14 */
/***/ (function(module, exports) {

/**
 * Compiles a querystring
 * Returns string representation of the object
 *
 * @param {Object}
 * @api private
 */

exports.encode = function (obj) {
  var str = '';

  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      if (str.length) str += '&';
      str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]);
    }
  }

  return str;
};

/**
 * Parses a simple querystring into an object
 *
 * @param {String} qs
 * @api private
 */

exports.decode = function(qs){
  var qry = {};
  var pairs = qs.split('&');
  for (var i = 0, l = pairs.length; i < l; i++) {
    var pair = pairs[i].split('=');
    qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  }
  return qry;
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var SyncStrategy = function () {
    function SyncStrategy(clientEngine, inputOptions) {
        _classCallCheck(this, SyncStrategy);

        this.clientEngine = clientEngine;
        this.gameEngine = clientEngine.gameEngine;
        this.options = Object.assign({}, inputOptions);
        this.gameEngine.on('client__syncReceived', this.collectSync.bind(this));
        this.requiredSyncs = [];
    }

    // collect a sync and its events
    // maintain a "lastSync" member which describes the last sync we received from
    // the server.  the lastSync object contains:
    //  - syncObjects: all events in the sync indexed by the id of the object involved
    //  - syncSteps: all events in the sync indexed by the step on which they occurred
    //  - objCount
    //  - eventCount
    //  - stepCount


    _createClass(SyncStrategy, [{
        key: 'collectSync',
        value: function collectSync(e) {

            // on first connect we need to wait for a full world update
            if (this.needFirstSync) {
                if (!e.fullUpdate) return;
            } else {

                // TODO: there is a problem below in the case where the client is 10 steps behind the server,
                // and the syncs that arrive are always in the future and never get processed.  To address this
                // we may need to store more than one sync.

                // ignore syncs which are older than the latest
                if (this.lastSync && this.lastSync.stepCount && this.lastSync.stepCount > e.stepCount) return;
            }

            // before we overwrite the last sync, check if it was a required sync
            // syncs that create or delete objects are saved because they must be applied.
            if (this.lastSync && this.lastSync.required) {
                this.requiredSyncs.push(this.lastSync);
            }

            // build new sync object
            var lastSync = this.lastSync = {
                stepCount: e.stepCount,
                fullUpdate: e.fullUpdate,
                syncObjects: {},
                syncSteps: {}
            };

            e.syncEvents.forEach(function (sEvent) {

                // keep a reference of events by object id
                if (sEvent.objectInstance) {
                    var objectId = sEvent.objectInstance.id;
                    if (!lastSync.syncObjects[objectId]) lastSync.syncObjects[objectId] = [];
                    lastSync.syncObjects[objectId].push(sEvent);
                }

                // keep a reference of events by step
                var stepCount = sEvent.stepCount;
                var eventName = sEvent.eventName;
                if (eventName === 'objectDestroy' || eventName === 'objectCreate') lastSync.required = true;

                if (!lastSync.syncSteps[stepCount]) lastSync.syncSteps[stepCount] = {};
                if (!lastSync.syncSteps[stepCount][eventName]) lastSync.syncSteps[stepCount][eventName] = [];
                lastSync.syncSteps[stepCount][eventName].push(sEvent);
            });

            var eventCount = e.syncEvents.length;
            var objCount = Object.keys(lastSync.syncObjects).length;
            var stepCount = Object.keys(lastSync.syncSteps).length;
            this.gameEngine.trace.debug(function () {
                return 'sync contains ' + objCount + ' objects ' + eventCount + ' events ' + stepCount + ' steps';
            });
        }
    }]);

    return SyncStrategy;
}();

exports.default = SyncStrategy;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);if (parent === null) {
            return undefined;
        } else {
            return get(parent, property, receiver);
        }
    } else if ("value" in desc) {
        return desc.value;
    } else {
        var getter = desc.get;if (getter === undefined) {
            return undefined;
        }return getter.call(receiver);
    }
};

var _TwoVector = __webpack_require__(6);

var _TwoVector2 = _interopRequireDefault(_TwoVector);

var _GameObject2 = __webpack_require__(85);

var _GameObject3 = _interopRequireDefault(_GameObject2);

var _Serializer = __webpack_require__(1);

var _Serializer2 = _interopRequireDefault(_Serializer);

var _MathUtils = __webpack_require__(86);

var _MathUtils2 = _interopRequireDefault(_MathUtils);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

/**
 * DynamicObject is the base class of the game's objects, for games which
 * rely on SimplePhysicsEngine.  It defines the
 * base object which can move around in the game world.  The
 * extensions of this object (the subclasses)
 * will be periodically synchronized from the server to every client.
 *
 * The dynamic objects have pseudo-physical properties, which
 * allow the client to extrapolate the position
 * of dynamic objects in-between server updates.
 */
var DynamicObject = function (_GameObject) {
    _inherits(DynamicObject, _GameObject);

    _createClass(DynamicObject, null, [{
        key: 'netScheme',

        /**
        * The netScheme is a dictionary of attributes in this game
        * object.  The attributes listed in the netScheme are those exact
        * attributes which will be serialized and sent from the server
        * to each client on every server update.
        * The netScheme member is implemented as a getter.
        *
        * You may choose not to implement this method, in which
        * case your object only transmits the default attributes
        * which are already part of {@link DynamicObject}.
        * But if you choose to add more attributes, make sure
        * the return value includes the netScheme of the super class.
        *
        * @memberof DynamicObject
        * @member {Object} netScheme
        * @example
        *     static get netScheme() {
        *       return Object.assign({
        *           mojo: { type: Serializer.TYPES.UINT8 },
        *         }, super.netScheme);
        *     }
        */
        get: function get() {
            return Object.assign({
                playerId: { type: _Serializer2.default.TYPES.INT16 },
                position: { type: _Serializer2.default.TYPES.CLASSINSTANCE },
                width: { type: _Serializer2.default.TYPES.INT16 },
                height: { type: _Serializer2.default.TYPES.INT16 },
                velocity: { type: _Serializer2.default.TYPES.CLASSINSTANCE },
                angle: { type: _Serializer2.default.TYPES.FLOAT32 }
            }, _get(DynamicObject.__proto__ || Object.getPrototypeOf(DynamicObject), 'netScheme', this));
        }

        /**
        * Creates an instance of a dynamic object.
        * NOTE: all subclasses of this class must comply with this constructor signature.
        *       This is required because the engine will create temporary instances when
        *       syncs arrive on the clients.
        * @param {GameEngine} gameEngine - the gameEngine this object will be used in
        * @param {Object} options - options for the new object. See {@link GameObject}
        * @param {Object} props - properties to be set in the new object
        * @param {TwoVector} props.position - position vector
        * @param {TwoVector} props.velocity - velocity vector
        */

    }]);

    function DynamicObject(gameEngine, options, props) {
        _classCallCheck(this, DynamicObject);

        /**
        * ID of player who created this object
        * @member {Number}
        */
        var _this = _possibleConstructorReturn(this, (DynamicObject.__proto__ || Object.getPrototypeOf(DynamicObject)).call(this, gameEngine, options));

        _this.playerId = 0;

        _this.position = new _TwoVector2.default(0, 0);
        _this.velocity = new _TwoVector2.default(0, 0);

        /**
         * Object width for collision detection purposes. Default is 1
         * @member {Number}
         */
        _this.width = 1;

        /**
         * Object Height for collision detection purposes. Default is 1
         * @member {Number}
         */
        _this.height = 1;

        /**
         * The friction coefficient. Velocity is multiplied by this for each step. Default is (1,1)
         * @member {TwoVector}
         */
        _this.friction = new _TwoVector2.default(1, 1);

        /**
         * Whether this object is affected by gravity.
         * @member {Boolean}
         */
        _this.affectedByGravity = true;

        /**
        * position
        * @member {TwoVector}
        */
        if (props && props.position) _this.position.copy(props.position);

        /**
        * velocity
        * @member {TwoVector}
        */
        if (props && props.velocity) _this.velocity.copy(props.velocity);

        /**
        * object orientation angle in degrees
        * @member {Number}
        */
        _this.angle = 90;

        /**
        * should rotate left by {@link DynamicObject#rotationSpeed} on next step
        * @member {Boolean}
        */
        _this.isRotatingLeft = false;

        /**
        * should rotate right by {@link DynamicObject#rotationSpeed} on next step
        * @member {Boolean}
        */
        _this.isRotatingRight = false;

        /**
        * should accelerate by {@link DynamicObject#acceleration} on next step
        * @member {Boolean}
        */
        _this.isAccelerating = false;

        /**
        * angle rotation per step
        * @member {Number}
        */
        _this.rotationSpeed = 2.5;

        /**
        * acceleration per step
        * @member {Number}
        */
        _this.acceleration = 0.1;

        _this.bending = new _TwoVector2.default(0, 0);
        _this.bendingAngle = 0;
        _this.deceleration = 0.99;
        return _this;
    }

    // convenience getters


    _createClass(DynamicObject, [{
        key: 'toString',

        /**
         * Formatted textual description of the dynamic object.
         * The output of this method is used to describe each instance in the traces,
         * which significantly helps in debugging.
         *
         * @return {String} description - a string describing the DynamicObject
         */
        value: function toString() {
            function round3(x) {
                return Math.round(x * 1000) / 1000;
            }
            return this.constructor.name + '[' + this.id + '] player' + this.playerId + ' Pos=' + this.position + ' Vel=' + this.velocity + ' angle' + round3(this.angle);
        }

        /**
         * Formatted textual description of the game object's current bending properties.
         * @return {String} description - a string description
         */

    }, {
        key: 'bendingToString',
        value: function bendingToString() {
            if (this.bendingIncrements) return 'bend=' + this.bending + ' angle=' + this.bendingAngle + ' num_increments=' + this.bendingIncrements;
            return 'no bending';
        }

        /**
        * The maximum velocity allowed.  If returns null then ignored.
        * @memberof DynamicObject
        * @member {Number} maxSpeed
        */

    }, {
        key: 'syncTo',
        value: function syncTo(other) {
            _get(DynamicObject.prototype.__proto__ || Object.getPrototypeOf(DynamicObject.prototype), 'syncTo', this).call(this, other);
            this.position.copy(other.position);
            this.velocity.copy(other.velocity);
            this.bending.copy(other.bending);
            this.bendingAngle = other.bendingAngle;
            this.rotationSpeed = other.rotationSpeed;
            this.acceleration = other.acceleration;
            this.deceleration = other.deceleration;
        }
    }, {
        key: 'bendToCurrent',
        value: function bendToCurrent(original, bending, worldSettings, isLocal, bendingIncrements) {

            // TODO: the bending parameters should now be an object,
            //     with a single getter bendingMultiples which has local
            //     and remote values for position, velocity, and angle
            this.bendingIncrements = bendingIncrements;

            // if the object has defined a bending multiples for this object, use them
            if (typeof this.bendingMultiple === 'number') bending = this.bendingMultiple;

            // velocity bending factor
            var velocityBending = bending;
            if (typeof this.bendingVelocityMultiple === 'number') velocityBending = this.bendingVelocityMultiple;

            // angle bending factor
            var angleBending = bending;
            if (typeof this.bendingAngleMultiple === 'number') angleBending = this.bendingAngleMultiple;
            if (isLocal && typeof this.bendingAngleLocalMultiple === 'number') angleBending = this.bendingAngleLocalMultiple;

            // bend to position, velocity, and angle gradually
            // TODO: consider using lerp() method of TwoVector instead.
            //     you will need implement lerpWrapped() first.
            if (worldSettings.worldWrap) {
                this.bending.x = _MathUtils2.default.interpolateDeltaWithWrapping(original.position.x, this.position.x, bending, 0, worldSettings.width) / bendingIncrements;
                this.bending.y = _MathUtils2.default.interpolateDeltaWithWrapping(original.position.y, this.position.y, bending, 0, worldSettings.height) / bendingIncrements;
            } else {
                this.bending.x = _MathUtils2.default.interpolateDelta(original.position.x, this.position.x, bending) / bendingIncrements;
                this.bending.y = _MathUtils2.default.interpolateDelta(original.position.y, this.position.y, bending) / bendingIncrements;
            }
            this.bendingAngle = _MathUtils2.default.interpolateDeltaWithWrapping(original.angle, this.angle, angleBending, 0, 360) / bendingIncrements;
            this.velocity.x = _MathUtils2.default.interpolate(original.velocity.x, this.velocity.x, velocityBending);
            this.velocity.y = _MathUtils2.default.interpolate(original.velocity.y, this.velocity.y, velocityBending);

            // revert to original
            this.position.copy(original.position);
            this.angle = original.angle;
        }
    }, {
        key: 'applyIncrementalBending',
        value: function applyIncrementalBending() {
            if (this.bendingIncrements === 0) return;

            this.position.add(this.bending);
            this.angle += this.bendingAngle;
            this.bendingIncrements--;
        }
    }, {
        key: 'interpolate',
        value: function interpolate(nextObj, playPercentage, worldSettings) {

            var px = this.position.x;
            var py = this.position.y;
            var angle = this.angle;

            // TODO allow netscheme to designate interpolatable attribute (power, shield, etc)
            // first copy all the assignable attributes
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.keys(this.constructor.netScheme)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var k = _step.value;

                    var val = nextObj[k];
                    if (_Serializer2.default.typeCanAssign(this.constructor.netScheme[k].type)) this[k] = val;else if (typeof val.clone === 'function') this[k] = val.clone();
                }

                // update other objects with interpolation
                // TODO interpolate using TwoVector methods, including wrap-around
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            function calcInterpolate(start, end, wrap, p) {
                if (Math.abs(end - start) > wrap / 2) return end;
                return (end - start) * p + start;
            }
            this.position.x = calcInterpolate(px, nextObj.position.x, worldSettings.width, playPercentage);
            this.position.y = calcInterpolate(py, nextObj.position.y, worldSettings.height, playPercentage);

            var shortestAngle = ((nextObj.angle - angle) % 360 + 540) % 360 - 180;
            this.angle = angle + shortestAngle * playPercentage;
        }
    }, {
        key: 'getAABB',
        value: function getAABB() {
            // todo take rotation into account
            // registration point is in the middle
            return {
                min: [this.x - this.width / 2, this.y - this.height / 2],
                max: [this.x + this.width / 2, this.y + this.height / 2]
            };
        }
    }, {
        key: 'x',
        get: function get() {
            return this.position.x;
        }
    }, {
        key: 'y',
        get: function get() {
            return this.position.y;
        }
    }, {
        key: 'maxSpeed',
        get: function get() {
            return null;
        }
    }]);

    return DynamicObject;
}(_GameObject3.default);

exports.default = DynamicObject;

/***/ }),
/* 17 */
/***/ (function(module, exports) {

/**
 * Parses an URI
 *
 * @author Steven Levithan <stevenlevithan.com> (MIT license)
 * @api private
 */

var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

var parts = [
    'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'
];

module.exports = function parseuri(str) {
    var src = str,
        b = str.indexOf('['),
        e = str.indexOf(']');

    if (b != -1 && e != -1) {
        str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ';') + str.substring(e, str.length);
    }

    var m = re.exec(str || ''),
        uri = {},
        i = 14;

    while (i--) {
        uri[parts[i]] = m[i] || '';
    }

    if (b != -1 && e != -1) {
        uri.source = src;
        uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ':');
        uri.authority = uri.authority.replace('[', '').replace(']', '').replace(/;/g, ':');
        uri.ipv6uri = true;
    }

    return uri;
};


/***/ }),
/* 18 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {
module.exports = isBuf;

/**
 * Returns true if obj is a buffer or an arraybuffer.
 *
 * @api private
 */

function isBuf(obj) {
  return (global.Buffer && global.Buffer.isBuffer(obj)) ||
         (global.ArrayBuffer && obj instanceof ArrayBuffer);
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * Module dependencies.
 */

var eio = __webpack_require__(50);
var Socket = __webpack_require__(27);
var Emitter = __webpack_require__(28);
var parser = __webpack_require__(10);
var on = __webpack_require__(29);
var bind = __webpack_require__(30);
var debug = __webpack_require__(7)('socket.io-client:manager');
var indexOf = __webpack_require__(26);
var Backoff = __webpack_require__(69);

/**
 * IE6+ hasOwnProperty
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Module exports
 */

module.exports = Manager;

/**
 * `Manager` constructor.
 *
 * @param {String} engine instance or engine uri/opts
 * @param {Object} options
 * @api public
 */

function Manager (uri, opts) {
  if (!(this instanceof Manager)) return new Manager(uri, opts);
  if (uri && ('object' === typeof uri)) {
    opts = uri;
    uri = undefined;
  }
  opts = opts || {};

  opts.path = opts.path || '/socket.io';
  this.nsps = {};
  this.subs = [];
  this.opts = opts;
  this.reconnection(opts.reconnection !== false);
  this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
  this.reconnectionDelay(opts.reconnectionDelay || 1000);
  this.reconnectionDelayMax(opts.reconnectionDelayMax || 5000);
  this.randomizationFactor(opts.randomizationFactor || 0.5);
  this.backoff = new Backoff({
    min: this.reconnectionDelay(),
    max: this.reconnectionDelayMax(),
    jitter: this.randomizationFactor()
  });
  this.timeout(null == opts.timeout ? 20000 : opts.timeout);
  this.readyState = 'closed';
  this.uri = uri;
  this.connecting = [];
  this.lastPing = null;
  this.encoding = false;
  this.packetBuffer = [];
  this.encoder = new parser.Encoder();
  this.decoder = new parser.Decoder();
  this.autoConnect = opts.autoConnect !== false;
  if (this.autoConnect) this.open();
}

/**
 * Propagate given event to sockets and emit on `this`
 *
 * @api private
 */

Manager.prototype.emitAll = function () {
  this.emit.apply(this, arguments);
  for (var nsp in this.nsps) {
    if (has.call(this.nsps, nsp)) {
      this.nsps[nsp].emit.apply(this.nsps[nsp], arguments);
    }
  }
};

/**
 * Update `socket.id` of all sockets
 *
 * @api private
 */

Manager.prototype.updateSocketIds = function () {
  for (var nsp in this.nsps) {
    if (has.call(this.nsps, nsp)) {
      this.nsps[nsp].id = this.engine.id;
    }
  }
};

/**
 * Mix in `Emitter`.
 */

Emitter(Manager.prototype);

/**
 * Sets the `reconnection` config.
 *
 * @param {Boolean} true/false if it should automatically reconnect
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnection = function (v) {
  if (!arguments.length) return this._reconnection;
  this._reconnection = !!v;
  return this;
};

/**
 * Sets the reconnection attempts config.
 *
 * @param {Number} max reconnection attempts before giving up
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnectionAttempts = function (v) {
  if (!arguments.length) return this._reconnectionAttempts;
  this._reconnectionAttempts = v;
  return this;
};

/**
 * Sets the delay between reconnections.
 *
 * @param {Number} delay
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnectionDelay = function (v) {
  if (!arguments.length) return this._reconnectionDelay;
  this._reconnectionDelay = v;
  this.backoff && this.backoff.setMin(v);
  return this;
};

Manager.prototype.randomizationFactor = function (v) {
  if (!arguments.length) return this._randomizationFactor;
  this._randomizationFactor = v;
  this.backoff && this.backoff.setJitter(v);
  return this;
};

/**
 * Sets the maximum delay between reconnections.
 *
 * @param {Number} delay
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnectionDelayMax = function (v) {
  if (!arguments.length) return this._reconnectionDelayMax;
  this._reconnectionDelayMax = v;
  this.backoff && this.backoff.setMax(v);
  return this;
};

/**
 * Sets the connection timeout. `false` to disable
 *
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.timeout = function (v) {
  if (!arguments.length) return this._timeout;
  this._timeout = v;
  return this;
};

/**
 * Starts trying to reconnect if reconnection is enabled and we have not
 * started reconnecting yet
 *
 * @api private
 */

Manager.prototype.maybeReconnectOnOpen = function () {
  // Only try to reconnect if it's the first time we're connecting
  if (!this.reconnecting && this._reconnection && this.backoff.attempts === 0) {
    // keeps reconnection from firing twice for the same reconnection loop
    this.reconnect();
  }
};

/**
 * Sets the current transport `socket`.
 *
 * @param {Function} optional, callback
 * @return {Manager} self
 * @api public
 */

Manager.prototype.open =
Manager.prototype.connect = function (fn, opts) {
  debug('readyState %s', this.readyState);
  if (~this.readyState.indexOf('open')) return this;

  debug('opening %s', this.uri);
  this.engine = eio(this.uri, this.opts);
  var socket = this.engine;
  var self = this;
  this.readyState = 'opening';
  this.skipReconnect = false;

  // emit `open`
  var openSub = on(socket, 'open', function () {
    self.onopen();
    fn && fn();
  });

  // emit `connect_error`
  var errorSub = on(socket, 'error', function (data) {
    debug('connect_error');
    self.cleanup();
    self.readyState = 'closed';
    self.emitAll('connect_error', data);
    if (fn) {
      var err = new Error('Connection error');
      err.data = data;
      fn(err);
    } else {
      // Only do this if there is no fn to handle the error
      self.maybeReconnectOnOpen();
    }
  });

  // emit `connect_timeout`
  if (false !== this._timeout) {
    var timeout = this._timeout;
    debug('connect attempt will timeout after %d', timeout);

    // set timer
    var timer = setTimeout(function () {
      debug('connect attempt timed out after %d', timeout);
      openSub.destroy();
      socket.close();
      socket.emit('error', 'timeout');
      self.emitAll('connect_timeout', timeout);
    }, timeout);

    this.subs.push({
      destroy: function () {
        clearTimeout(timer);
      }
    });
  }

  this.subs.push(openSub);
  this.subs.push(errorSub);

  return this;
};

/**
 * Called upon transport open.
 *
 * @api private
 */

Manager.prototype.onopen = function () {
  debug('open');

  // clear old subs
  this.cleanup();

  // mark as open
  this.readyState = 'open';
  this.emit('open');

  // add new subs
  var socket = this.engine;
  this.subs.push(on(socket, 'data', bind(this, 'ondata')));
  this.subs.push(on(socket, 'ping', bind(this, 'onping')));
  this.subs.push(on(socket, 'pong', bind(this, 'onpong')));
  this.subs.push(on(socket, 'error', bind(this, 'onerror')));
  this.subs.push(on(socket, 'close', bind(this, 'onclose')));
  this.subs.push(on(this.decoder, 'decoded', bind(this, 'ondecoded')));
};

/**
 * Called upon a ping.
 *
 * @api private
 */

Manager.prototype.onping = function () {
  this.lastPing = new Date();
  this.emitAll('ping');
};

/**
 * Called upon a packet.
 *
 * @api private
 */

Manager.prototype.onpong = function () {
  this.emitAll('pong', new Date() - this.lastPing);
};

/**
 * Called with data.
 *
 * @api private
 */

Manager.prototype.ondata = function (data) {
  this.decoder.add(data);
};

/**
 * Called when parser fully decodes a packet.
 *
 * @api private
 */

Manager.prototype.ondecoded = function (packet) {
  this.emit('packet', packet);
};

/**
 * Called upon socket error.
 *
 * @api private
 */

Manager.prototype.onerror = function (err) {
  debug('error', err);
  this.emitAll('error', err);
};

/**
 * Creates a new socket for the given `nsp`.
 *
 * @return {Socket}
 * @api public
 */

Manager.prototype.socket = function (nsp, opts) {
  var socket = this.nsps[nsp];
  if (!socket) {
    socket = new Socket(this, nsp, opts);
    this.nsps[nsp] = socket;
    var self = this;
    socket.on('connecting', onConnecting);
    socket.on('connect', function () {
      socket.id = self.engine.id;
    });

    if (this.autoConnect) {
      // manually call here since connecting evnet is fired before listening
      onConnecting();
    }
  }

  function onConnecting () {
    if (!~indexOf(self.connecting, socket)) {
      self.connecting.push(socket);
    }
  }

  return socket;
};

/**
 * Called upon a socket close.
 *
 * @param {Socket} socket
 */

Manager.prototype.destroy = function (socket) {
  var index = indexOf(this.connecting, socket);
  if (~index) this.connecting.splice(index, 1);
  if (this.connecting.length) return;

  this.close();
};

/**
 * Writes a packet.
 *
 * @param {Object} packet
 * @api private
 */

Manager.prototype.packet = function (packet) {
  debug('writing packet %j', packet);
  var self = this;
  if (packet.query && packet.type === 0) packet.nsp += '?' + packet.query;

  if (!self.encoding) {
    // encode, then write to engine with result
    self.encoding = true;
    this.encoder.encode(packet, function (encodedPackets) {
      for (var i = 0; i < encodedPackets.length; i++) {
        self.engine.write(encodedPackets[i], packet.options);
      }
      self.encoding = false;
      self.processPacketQueue();
    });
  } else { // add packet to the queue
    self.packetBuffer.push(packet);
  }
};

/**
 * If packet buffer is non-empty, begins encoding the
 * next packet in line.
 *
 * @api private
 */

Manager.prototype.processPacketQueue = function () {
  if (this.packetBuffer.length > 0 && !this.encoding) {
    var pack = this.packetBuffer.shift();
    this.packet(pack);
  }
};

/**
 * Clean up transport subscriptions and packet buffer.
 *
 * @api private
 */

Manager.prototype.cleanup = function () {
  debug('cleanup');

  var subsLength = this.subs.length;
  for (var i = 0; i < subsLength; i++) {
    var sub = this.subs.shift();
    sub.destroy();
  }

  this.packetBuffer = [];
  this.encoding = false;
  this.lastPing = null;

  this.decoder.destroy();
};

/**
 * Close the current socket.
 *
 * @api private
 */

Manager.prototype.close =
Manager.prototype.disconnect = function () {
  debug('disconnect');
  this.skipReconnect = true;
  this.reconnecting = false;
  if ('opening' === this.readyState) {
    // `onclose` will not fire because
    // an open event never happened
    this.cleanup();
  }
  this.backoff.reset();
  this.readyState = 'closed';
  if (this.engine) this.engine.close();
};

/**
 * Called upon engine close.
 *
 * @api private
 */

Manager.prototype.onclose = function (reason) {
  debug('onclose');

  this.cleanup();
  this.backoff.reset();
  this.readyState = 'closed';
  this.emit('close', reason);

  if (this._reconnection && !this.skipReconnect) {
    this.reconnect();
  }
};

/**
 * Attempt a reconnection.
 *
 * @api private
 */

Manager.prototype.reconnect = function () {
  if (this.reconnecting || this.skipReconnect) return this;

  var self = this;

  if (this.backoff.attempts >= this._reconnectionAttempts) {
    debug('reconnect failed');
    this.backoff.reset();
    this.emitAll('reconnect_failed');
    this.reconnecting = false;
  } else {
    var delay = this.backoff.duration();
    debug('will wait %dms before reconnect attempt', delay);

    this.reconnecting = true;
    var timer = setTimeout(function () {
      if (self.skipReconnect) return;

      debug('attempting reconnect');
      self.emitAll('reconnect_attempt', self.backoff.attempts);
      self.emitAll('reconnecting', self.backoff.attempts);

      // check again for the case socket closed in above events
      if (self.skipReconnect) return;

      self.open(function (err) {
        if (err) {
          debug('reconnect attempt error');
          self.reconnecting = false;
          self.reconnect();
          self.emitAll('reconnect_error', err.data);
        } else {
          debug('reconnect success');
          self.onreconnect();
        }
      });
    }, delay);

    this.subs.push({
      destroy: function () {
        clearTimeout(timer);
      }
    });
  }
};

/**
 * Called upon successful reconnect.
 *
 * @api private
 */

Manager.prototype.onreconnect = function () {
  var attempt = this.backoff.attempts;
  this.reconnecting = false;
  this.backoff.reset();
  this.updateSocketIds();
  this.emitAll('reconnect', attempt);
};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * Module dependencies
 */

var XMLHttpRequest = __webpack_require__(11);
var XHR = __webpack_require__(54);
var JSONP = __webpack_require__(64);
var websocket = __webpack_require__(65);

/**
 * Export transports.
 */

exports.polling = polling;
exports.websocket = websocket;

/**
 * Polling transport polymorphic constructor.
 * Decides on xhr vs jsonp based on feature detection.
 *
 * @api private
 */

function polling (opts) {
  var xhr;
  var xd = false;
  var xs = false;
  var jsonp = false !== opts.jsonp;

  if (global.location) {
    var isSSL = 'https:' === location.protocol;
    var port = location.port;

    // some user agents have empty `location.port`
    if (!port) {
      port = isSSL ? 443 : 80;
    }

    xd = opts.hostname !== location.hostname || port !== opts.port;
    xs = opts.secure !== isSSL;
  }

  opts.xdomain = xd;
  opts.xscheme = xs;
  xhr = new XMLHttpRequest(opts);

  if ('open' in xhr && !opts.forceJSONP) {
    return new XHR(opts);
  } else {
    if (!jsonp) throw new Error('JSONP disabled');
    return new JSONP(opts);
  }
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Module dependencies.
 */

var Transport = __webpack_require__(12);
var parseqs = __webpack_require__(14);
var parser = __webpack_require__(2);
var inherit = __webpack_require__(8);
var yeast = __webpack_require__(25);
var debug = __webpack_require__(9)('engine.io-client:polling');

/**
 * Module exports.
 */

module.exports = Polling;

/**
 * Is XHR2 supported?
 */

var hasXHR2 = (function () {
  var XMLHttpRequest = __webpack_require__(11);
  var xhr = new XMLHttpRequest({ xdomain: false });
  return null != xhr.responseType;
})();

/**
 * Polling interface.
 *
 * @param {Object} opts
 * @api private
 */

function Polling (opts) {
  var forceBase64 = (opts && opts.forceBase64);
  if (!hasXHR2 || forceBase64) {
    this.supportsBinary = false;
  }
  Transport.call(this, opts);
}

/**
 * Inherits from Transport.
 */

inherit(Polling, Transport);

/**
 * Transport name.
 */

Polling.prototype.name = 'polling';

/**
 * Opens the socket (triggers polling). We write a PING message to determine
 * when the transport is open.
 *
 * @api private
 */

Polling.prototype.doOpen = function () {
  this.poll();
};

/**
 * Pauses polling.
 *
 * @param {Function} callback upon buffers are flushed and transport is paused
 * @api private
 */

Polling.prototype.pause = function (onPause) {
  var self = this;

  this.readyState = 'pausing';

  function pause () {
    debug('paused');
    self.readyState = 'paused';
    onPause();
  }

  if (this.polling || !this.writable) {
    var total = 0;

    if (this.polling) {
      debug('we are currently polling - waiting to pause');
      total++;
      this.once('pollComplete', function () {
        debug('pre-pause polling complete');
        --total || pause();
      });
    }

    if (!this.writable) {
      debug('we are currently writing - waiting to pause');
      total++;
      this.once('drain', function () {
        debug('pre-pause writing complete');
        --total || pause();
      });
    }
  } else {
    pause();
  }
};

/**
 * Starts polling cycle.
 *
 * @api public
 */

Polling.prototype.poll = function () {
  debug('polling');
  this.polling = true;
  this.doPoll();
  this.emit('poll');
};

/**
 * Overloads onData to detect payloads.
 *
 * @api private
 */

Polling.prototype.onData = function (data) {
  var self = this;
  debug('polling got data %s', data);
  var callback = function (packet, index, total) {
    // if its the first message we consider the transport open
    if ('opening' === self.readyState) {
      self.onOpen();
    }

    // if its a close packet, we close the ongoing requests
    if ('close' === packet.type) {
      self.onClose();
      return false;
    }

    // otherwise bypass onData and handle the message
    self.onPacket(packet);
  };

  // decode payload
  parser.decodePayload(data, this.socket.binaryType, callback);

  // if an event did not trigger closing
  if ('closed' !== this.readyState) {
    // if we got data we're not polling
    this.polling = false;
    this.emit('pollComplete');

    if ('open' === this.readyState) {
      this.poll();
    } else {
      debug('ignoring poll - transport state "%s"', this.readyState);
    }
  }
};

/**
 * For polling, send a close packet.
 *
 * @api private
 */

Polling.prototype.doClose = function () {
  var self = this;

  function close () {
    debug('writing close packet');
    self.write([{ type: 'close' }]);
  }

  if ('open' === this.readyState) {
    debug('transport open - closing');
    close();
  } else {
    // in case we're trying to close while
    // handshaking is in progress (GH-164)
    debug('transport not open - deferring close');
    this.once('open', close);
  }
};

/**
 * Writes a packets payload.
 *
 * @param {Array} data packets
 * @param {Function} drain callback
 * @api private
 */

Polling.prototype.write = function (packets) {
  var self = this;
  this.writable = false;
  var callbackfn = function () {
    self.writable = true;
    self.emit('drain');
  };

  parser.encodePayload(packets, this.supportsBinary, function (data) {
    self.doWrite(data, callbackfn);
  });
};

/**
 * Generates uri for connection.
 *
 * @api private
 */

Polling.prototype.uri = function () {
  var query = this.query || {};
  var schema = this.secure ? 'https' : 'http';
  var port = '';

  // cache busting is forced
  if (false !== this.timestampRequests) {
    query[this.timestampParam] = yeast();
  }

  if (!this.supportsBinary && !query.sid) {
    query.b64 = 1;
  }

  query = parseqs.encode(query);

  // avoid port if default for schema
  if (this.port && (('https' === schema && Number(this.port) !== 443) ||
     ('http' === schema && Number(this.port) !== 80))) {
    port = ':' + this.port;
  }

  // prepend ? to query
  if (query.length) {
    query = '?' + query;
  }

  var ipv6 = this.hostname.indexOf(':') !== -1;
  return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
};


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {
/*
 * Module requirements.
 */

var isArray = __webpack_require__(56);

/**
 * Module exports.
 */

module.exports = hasBinary;

/**
 * Checks for binary data.
 *
 * Right now only Buffer and ArrayBuffer are supported..
 *
 * @param {Object} anything
 * @api public
 */

function hasBinary(data) {

  function _hasBinary(obj) {
    if (!obj) return false;

    if ( (global.Buffer && global.Buffer.isBuffer && global.Buffer.isBuffer(obj)) ||
         (global.ArrayBuffer && obj instanceof ArrayBuffer) ||
         (global.Blob && obj instanceof Blob) ||
         (global.File && obj instanceof File)
        ) {
      return true;
    }

    if (isArray(obj)) {
      for (var i = 0; i < obj.length; i++) {
          if (_hasBinary(obj[i])) {
              return true;
          }
      }
    } else if (obj && 'object' == typeof obj) {
      // see: https://github.com/Automattic/has-binary/pull/4
      if (obj.toJSON && 'function' == typeof obj.toJSON) {
        obj = obj.toJSON();
      }

      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key) && _hasBinary(obj[key])) {
          return true;
        }
      }
    }

    return false;
  }

  return _hasBinary(data);
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'.split('')
  , length = 64
  , map = {}
  , seed = 0
  , i = 0
  , prev;

/**
 * Return a string representing the specified number.
 *
 * @param {Number} num The number to convert.
 * @returns {String} The string representation of the number.
 * @api public
 */
function encode(num) {
  var encoded = '';

  do {
    encoded = alphabet[num % length] + encoded;
    num = Math.floor(num / length);
  } while (num > 0);

  return encoded;
}

/**
 * Return the integer value specified by the given string.
 *
 * @param {String} str The string to convert.
 * @returns {Number} The integer value represented by the string.
 * @api public
 */
function decode(str) {
  var decoded = 0;

  for (i = 0; i < str.length; i++) {
    decoded = decoded * length + map[str.charAt(i)];
  }

  return decoded;
}

/**
 * Yeast: A tiny growing id generator.
 *
 * @returns {String} A unique id.
 * @api public
 */
function yeast() {
  var now = encode(+new Date());

  if (now !== prev) return seed = 0, prev = now;
  return now +'.'+ encode(seed++);
}

//
// Map each character to its index.
//
for (; i < length; i++) map[alphabet[i]] = i;

//
// Expose the `yeast`, `encode` and `decode` functions.
//
yeast.encode = encode;
yeast.decode = decode;
module.exports = yeast;


/***/ }),
/* 26 */
/***/ (function(module, exports) {


var indexOf = [].indexOf;

module.exports = function(arr, obj){
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * Module dependencies.
 */

var parser = __webpack_require__(10);
var Emitter = __webpack_require__(28);
var toArray = __webpack_require__(68);
var on = __webpack_require__(29);
var bind = __webpack_require__(30);
var debug = __webpack_require__(7)('socket.io-client:socket');
var hasBin = __webpack_require__(24);

/**
 * Module exports.
 */

module.exports = exports = Socket;

/**
 * Internal events (blacklisted).
 * These events can't be emitted by the user.
 *
 * @api private
 */

var events = {
  connect: 1,
  connect_error: 1,
  connect_timeout: 1,
  connecting: 1,
  disconnect: 1,
  error: 1,
  reconnect: 1,
  reconnect_attempt: 1,
  reconnect_failed: 1,
  reconnect_error: 1,
  reconnecting: 1,
  ping: 1,
  pong: 1
};

/**
 * Shortcut to `Emitter#emit`.
 */

var emit = Emitter.prototype.emit;

/**
 * `Socket` constructor.
 *
 * @api public
 */

function Socket (io, nsp, opts) {
  this.io = io;
  this.nsp = nsp;
  this.json = this; // compat
  this.ids = 0;
  this.acks = {};
  this.receiveBuffer = [];
  this.sendBuffer = [];
  this.connected = false;
  this.disconnected = true;
  if (opts && opts.query) {
    this.query = opts.query;
  }
  if (this.io.autoConnect) this.open();
}

/**
 * Mix in `Emitter`.
 */

Emitter(Socket.prototype);

/**
 * Subscribe to open, close and packet events
 *
 * @api private
 */

Socket.prototype.subEvents = function () {
  if (this.subs) return;

  var io = this.io;
  this.subs = [
    on(io, 'open', bind(this, 'onopen')),
    on(io, 'packet', bind(this, 'onpacket')),
    on(io, 'close', bind(this, 'onclose'))
  ];
};

/**
 * "Opens" the socket.
 *
 * @api public
 */

Socket.prototype.open =
Socket.prototype.connect = function () {
  if (this.connected) return this;

  this.subEvents();
  this.io.open(); // ensure open
  if ('open' === this.io.readyState) this.onopen();
  this.emit('connecting');
  return this;
};

/**
 * Sends a `message` event.
 *
 * @return {Socket} self
 * @api public
 */

Socket.prototype.send = function () {
  var args = toArray(arguments);
  args.unshift('message');
  this.emit.apply(this, args);
  return this;
};

/**
 * Override `emit`.
 * If the event is in `events`, it's emitted normally.
 *
 * @param {String} event name
 * @return {Socket} self
 * @api public
 */

Socket.prototype.emit = function (ev) {
  if (events.hasOwnProperty(ev)) {
    emit.apply(this, arguments);
    return this;
  }

  var args = toArray(arguments);
  var parserType = parser.EVENT; // default
  if (hasBin(args)) { parserType = parser.BINARY_EVENT; } // binary
  var packet = { type: parserType, data: args };

  packet.options = {};
  packet.options.compress = !this.flags || false !== this.flags.compress;

  // event ack callback
  if ('function' === typeof args[args.length - 1]) {
    debug('emitting packet with ack id %d', this.ids);
    this.acks[this.ids] = args.pop();
    packet.id = this.ids++;
  }

  if (this.connected) {
    this.packet(packet);
  } else {
    this.sendBuffer.push(packet);
  }

  delete this.flags;

  return this;
};

/**
 * Sends a packet.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.packet = function (packet) {
  packet.nsp = this.nsp;
  this.io.packet(packet);
};

/**
 * Called upon engine `open`.
 *
 * @api private
 */

Socket.prototype.onopen = function () {
  debug('transport is open - connecting');

  // write connect packet if necessary
  if ('/' !== this.nsp) {
    if (this.query) {
      this.packet({type: parser.CONNECT, query: this.query});
    } else {
      this.packet({type: parser.CONNECT});
    }
  }
};

/**
 * Called upon engine `close`.
 *
 * @param {String} reason
 * @api private
 */

Socket.prototype.onclose = function (reason) {
  debug('close (%s)', reason);
  this.connected = false;
  this.disconnected = true;
  delete this.id;
  this.emit('disconnect', reason);
};

/**
 * Called with socket packet.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.onpacket = function (packet) {
  if (packet.nsp !== this.nsp) return;

  switch (packet.type) {
    case parser.CONNECT:
      this.onconnect();
      break;

    case parser.EVENT:
      this.onevent(packet);
      break;

    case parser.BINARY_EVENT:
      this.onevent(packet);
      break;

    case parser.ACK:
      this.onack(packet);
      break;

    case parser.BINARY_ACK:
      this.onack(packet);
      break;

    case parser.DISCONNECT:
      this.ondisconnect();
      break;

    case parser.ERROR:
      this.emit('error', packet.data);
      break;
  }
};

/**
 * Called upon a server event.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.onevent = function (packet) {
  var args = packet.data || [];
  debug('emitting event %j', args);

  if (null != packet.id) {
    debug('attaching ack callback to event');
    args.push(this.ack(packet.id));
  }

  if (this.connected) {
    emit.apply(this, args);
  } else {
    this.receiveBuffer.push(args);
  }
};

/**
 * Produces an ack callback to emit with an event.
 *
 * @api private
 */

Socket.prototype.ack = function (id) {
  var self = this;
  var sent = false;
  return function () {
    // prevent double callbacks
    if (sent) return;
    sent = true;
    var args = toArray(arguments);
    debug('sending ack %j', args);

    var type = hasBin(args) ? parser.BINARY_ACK : parser.ACK;
    self.packet({
      type: type,
      id: id,
      data: args
    });
  };
};

/**
 * Called upon a server acknowlegement.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.onack = function (packet) {
  var ack = this.acks[packet.id];
  if ('function' === typeof ack) {
    debug('calling ack %s with %j', packet.id, packet.data);
    ack.apply(this, packet.data);
    delete this.acks[packet.id];
  } else {
    debug('bad ack %s', packet.id);
  }
};

/**
 * Called upon server connect.
 *
 * @api private
 */

Socket.prototype.onconnect = function () {
  this.connected = true;
  this.disconnected = false;
  this.emit('connect');
  this.emitBuffered();
};

/**
 * Emit buffered events (received and emitted).
 *
 * @api private
 */

Socket.prototype.emitBuffered = function () {
  var i;
  for (i = 0; i < this.receiveBuffer.length; i++) {
    emit.apply(this, this.receiveBuffer[i]);
  }
  this.receiveBuffer = [];

  for (i = 0; i < this.sendBuffer.length; i++) {
    this.packet(this.sendBuffer[i]);
  }
  this.sendBuffer = [];
};

/**
 * Called upon server disconnect.
 *
 * @api private
 */

Socket.prototype.ondisconnect = function () {
  debug('server disconnect (%s)', this.nsp);
  this.destroy();
  this.onclose('io server disconnect');
};

/**
 * Called upon forced client/server side disconnections,
 * this method ensures the manager stops tracking us and
 * that reconnections don't get triggered for this.
 *
 * @api private.
 */

Socket.prototype.destroy = function () {
  if (this.subs) {
    // clean subscriptions to avoid reconnections
    for (var i = 0; i < this.subs.length; i++) {
      this.subs[i].destroy();
    }
    this.subs = null;
  }

  this.io.destroy(this);
};

/**
 * Disconnects the socket manually.
 *
 * @return {Socket} self
 * @api public
 */

Socket.prototype.close =
Socket.prototype.disconnect = function () {
  if (this.connected) {
    debug('performing disconnect (%s)', this.nsp);
    this.packet({ type: parser.DISCONNECT });
  }

  // remove socket from pool
  this.destroy();

  if (this.connected) {
    // fire events
    this.onclose('io client disconnect');
  }
  return this;
};

/**
 * Sets the compress flag.
 *
 * @param {Boolean} if `true`, compresses the sending data
 * @return {Socket} self
 * @api public
 */

Socket.prototype.compress = function (compress) {
  this.flags = this.flags || {};
  this.flags.compress = compress;
  return this;
};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * Expose `Emitter`.
 */

if (true) {
  module.exports = Emitter;
}

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};


/***/ }),
/* 29 */
/***/ (function(module, exports) {


/**
 * Module exports.
 */

module.exports = on;

/**
 * Helper for subscriptions.
 *
 * @param {Object|EventEmitter} obj with `Emitter` mixin or `EventEmitter`
 * @param {String} event name
 * @param {Function} callback
 * @api public
 */

function on (obj, ev, fn) {
  obj.on(ev, fn);
  return {
    destroy: function () {
      obj.removeListener(ev, fn);
    }
  };
}


/***/ }),
/* 30 */
/***/ (function(module, exports) {

/**
 * Slice reference.
 */

var slice = [].slice;

/**
 * Bind `obj` to `fn`.
 *
 * @param {Object} obj
 * @param {Function|String} fn or string
 * @return {Function}
 * @api public
 */

module.exports = function(obj, fn){
  if ('string' == typeof fn) fn = obj[fn];
  if ('function' != typeof fn) throw new Error('bind() requires a function');
  var args = slice.call(arguments, 2);
  return function(){
    return fn.apply(obj, args.concat(slice.call(arguments)));
  }
};


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _Serializable2 = __webpack_require__(3);

var _Serializable3 = _interopRequireDefault(_Serializable2);

var _Serializer = __webpack_require__(1);

var _Serializer2 = _interopRequireDefault(_Serializer);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

/**
 * A ThreeVector is a geometric object which is completely described
 * by three values.
 */
var ThreeVector = function (_Serializable) {
    _inherits(ThreeVector, _Serializable);

    _createClass(ThreeVector, null, [{
        key: 'netScheme',
        get: function get() {
            return {
                x: { type: _Serializer2.default.TYPES.FLOAT32 },
                y: { type: _Serializer2.default.TYPES.FLOAT32 },
                z: { type: _Serializer2.default.TYPES.FLOAT32 }
            };
        }

        /**
        * Creates an instance of a ThreeVector.
        * @param {Number} x - first value
        * @param {Number} y - second value
        * @param {Number} z - second value
        * @return {ThreeVector} v - the new ThreeVector
        */

    }]);

    function ThreeVector(x, y, z) {
        var _ret;

        _classCallCheck(this, ThreeVector);

        var _this = _possibleConstructorReturn(this, (ThreeVector.__proto__ || Object.getPrototypeOf(ThreeVector)).call(this));

        _this.x = x;
        _this.y = y;
        _this.z = z;

        return _ret = _this, _possibleConstructorReturn(_this, _ret);
    }

    /**
     * Formatted textual description of the ThreeVector.
     * @return {String} description
     */

    _createClass(ThreeVector, [{
        key: 'toString',
        value: function toString() {
            function round3(x) {
                return Math.round(x * 1000) / 1000;
            }
            return '(' + round3(this.x) + ', ' + round3(this.y) + ', ' + round3(this.z) + ')';
        }

        /**
         * Multiply this ThreeVector by a scalar
         *
         * @param {Number} s the scale
         * @return {ThreeVector} returns self
         */

    }, {
        key: 'multiplyScalar',
        value: function multiplyScalar(s) {
            this.x *= s;
            this.y *= s;
            this.z *= s;
            return this;
        }

        /**
         * Get vector length
         *
         * @return {Number} length of this vector
         */

    }, {
        key: 'length',
        value: function length() {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        }

        /**
         * Add other vector to this vector
         *
         * @param {ThreeVector} other the other vector
         * @return {ThreeVector} returns self
         */

    }, {
        key: 'add',
        value: function add(other) {
            this.x += other.x;
            this.y += other.y;
            this.z += other.z;
            return this;
        }

        /**
         * Subtract other vector from this vector
         *
         * @param {ThreeVector} other the other vector
         * @return {ThreeVector} returns self
         */

    }, {
        key: 'subtract',
        value: function subtract(other) {
            this.x -= other.x;
            this.y -= other.y;
            this.z -= other.z;
            return this;
        }

        /**
         * Normalize this vector, in-place
         *
         * @return {ThreeVector} returns self
         */

    }, {
        key: 'normalize',
        value: function normalize() {
            this.multiplyScalar(1 / this.length());
            return this;
        }

        /**
         * Copy values from another ThreeVector into this ThreeVector
         *
         * @param {ThreeVector} sourceObj the other vector
         * @return {ThreeVector} returns self
         */

    }, {
        key: 'copy',
        value: function copy(sourceObj) {
            this.x = sourceObj.x;
            this.y = sourceObj.y;
            this.z = sourceObj.z;
            return this;
        }

        /**
         * Set ThreeVector values
         *
         * @param {Number} x x-value
         * @param {Number} y y-value
         * @param {Number} z z-value
         * @return {ThreeVector} returns self
         */

    }, {
        key: 'set',
        value: function set(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
            return this;
        }

        /**
         * Apply in-place lerp (linear interpolation) to this ThreeVector
         * towards another ThreeVector
         * @param {ThreeVector} target the target vector
         * @param {Number} p The percentage to interpolate
         * @return {ThreeVector} returns self
         */

    }, {
        key: 'lerp',
        value: function lerp(target, p) {
            this.x += (target.x - this.x) * p;
            this.y += (target.y - this.y) * p;
            this.z += (target.z - this.z) * p;
            return this;
        }
    }]);

    return ThreeVector;
}(_Serializable3.default);

exports.default = ThreeVector;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _queryString = __webpack_require__(33);

var _queryString2 = _interopRequireDefault(_queryString);

var _MyClientEngine = __webpack_require__(36);

var _MyClientEngine2 = _interopRequireDefault(_MyClientEngine);

var _MyGameEngine = __webpack_require__(83);

var _MyGameEngine2 = _interopRequireDefault(_MyGameEngine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var qsOptions = _queryString2.default.parse(location.search);

// default options, overwritten by query-string options
// is sent to both game engine and client engine
var defaults = {
    traceLevel: 1,
    delayInputCount: 3,
    scheduler: 'render-schedule',
    syncOptions: {
        sync: qsOptions.sync || 'extrapolate',
        localObjBending: 0.0,
        remoteObjBending: 0.8,
        bendingIncrements: 6
    }
};
var options = Object.assign(defaults, qsOptions);

// create a client engine and a game engine
var gameEngine = new _MyGameEngine2.default(options);
var clientEngine = new _MyClientEngine2.default(gameEngine, options);

document.addEventListener('DOMContentLoaded', function (e) {
    clientEngine.start();
});

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var strictUriEncode = __webpack_require__(34);
var objectAssign = __webpack_require__(35);

function encoderForArrayFormat(opts) {
	switch (opts.arrayFormat) {
		case 'index':
			return function (key, value, index) {
				return value === null ? [
					encode(key, opts),
					'[',
					index,
					']'
				].join('') : [
					encode(key, opts),
					'[',
					encode(index, opts),
					']=',
					encode(value, opts)
				].join('');
			};

		case 'bracket':
			return function (key, value) {
				return value === null ? encode(key, opts) : [
					encode(key, opts),
					'[]=',
					encode(value, opts)
				].join('');
			};

		default:
			return function (key, value) {
				return value === null ? encode(key, opts) : [
					encode(key, opts),
					'=',
					encode(value, opts)
				].join('');
			};
	}
}

function parserForArrayFormat(opts) {
	var result;

	switch (opts.arrayFormat) {
		case 'index':
			return function (key, value, accumulator) {
				result = /\[(\d*)\]$/.exec(key);

				key = key.replace(/\[\d*\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				}

				if (accumulator[key] === undefined) {
					accumulator[key] = {};
				}

				accumulator[key][result[1]] = value;
			};

		case 'bracket':
			return function (key, value, accumulator) {
				result = /(\[\])$/.exec(key);
				key = key.replace(/\[\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				} else if (accumulator[key] === undefined) {
					accumulator[key] = [value];
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};

		default:
			return function (key, value, accumulator) {
				if (accumulator[key] === undefined) {
					accumulator[key] = value;
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};
	}
}

function encode(value, opts) {
	if (opts.encode) {
		return opts.strict ? strictUriEncode(value) : encodeURIComponent(value);
	}

	return value;
}

function keysSorter(input) {
	if (Array.isArray(input)) {
		return input.sort();
	} else if (typeof input === 'object') {
		return keysSorter(Object.keys(input)).sort(function (a, b) {
			return Number(a) - Number(b);
		}).map(function (key) {
			return input[key];
		});
	}

	return input;
}

exports.extract = function (str) {
	return str.split('?')[1] || '';
};

exports.parse = function (str, opts) {
	opts = objectAssign({arrayFormat: 'none'}, opts);

	var formatter = parserForArrayFormat(opts);

	// Create an object with no prototype
	// https://github.com/sindresorhus/query-string/issues/47
	var ret = Object.create(null);

	if (typeof str !== 'string') {
		return ret;
	}

	str = str.trim().replace(/^(\?|#|&)/, '');

	if (!str) {
		return ret;
	}

	str.split('&').forEach(function (param) {
		var parts = param.replace(/\+/g, ' ').split('=');
		// Firefox (pre 40) decodes `%3D` to `=`
		// https://github.com/sindresorhus/query-string/pull/37
		var key = parts.shift();
		var val = parts.length > 0 ? parts.join('=') : undefined;

		// missing `=` should be `null`:
		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
		val = val === undefined ? null : decodeURIComponent(val);

		formatter(decodeURIComponent(key), val, ret);
	});

	return Object.keys(ret).sort().reduce(function (result, key) {
		var val = ret[key];
		if (Boolean(val) && typeof val === 'object' && !Array.isArray(val)) {
			// Sort object keys, not values
			result[key] = keysSorter(val);
		} else {
			result[key] = val;
		}

		return result;
	}, Object.create(null));
};

exports.stringify = function (obj, opts) {
	var defaults = {
		encode: true,
		strict: true,
		arrayFormat: 'none'
	};

	opts = objectAssign(defaults, opts);

	var formatter = encoderForArrayFormat(opts);

	return obj ? Object.keys(obj).sort().map(function (key) {
		var val = obj[key];

		if (val === undefined) {
			return '';
		}

		if (val === null) {
			return encode(key, opts);
		}

		if (Array.isArray(val)) {
			var result = [];

			val.slice().forEach(function (val2) {
				if (val2 === undefined) {
					return;
				}

				result.push(formatter(key, val2, result.length));
			});

			return result.join('&');
		}

		return encode(key, opts) + '=' + encode(val, opts);
	}).filter(function (x) {
		return x.length > 0;
	}).join('&') : '';
};


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function (str) {
	return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
		return '%' + c.charCodeAt(0).toString(16).toUpperCase();
	});
};


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ClientEngine2 = __webpack_require__(37);

var _ClientEngine3 = _interopRequireDefault(_ClientEngine2);

var _MyRenderer = __webpack_require__(80);

var _MyRenderer2 = _interopRequireDefault(_MyRenderer);

var _KeyboardControls = __webpack_require__(82);

var _KeyboardControls2 = _interopRequireDefault(_KeyboardControls);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MyClientEngine = function (_ClientEngine) {
    _inherits(MyClientEngine, _ClientEngine);

    function MyClientEngine(gameEngine, options) {
        _classCallCheck(this, MyClientEngine);

        var _this = _possibleConstructorReturn(this, (MyClientEngine.__proto__ || Object.getPrototypeOf(MyClientEngine)).call(this, gameEngine, options, _MyRenderer2.default));

        _this.controls = new _KeyboardControls2.default(_this);
        _this.controls.bindKey('up', 'up', { repeat: true });
        _this.controls.bindKey('down', 'down', { repeat: true });
        _this.controls.bindKey('left', 'left', { repeat: true });
        _this.controls.bindKey('right', 'right', { repeat: true });
        _this.controls.bindKey('space', 'space');
        return _this;
    }

    return MyClientEngine;
}(_ClientEngine3.default);

exports.default = MyClientEngine;

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _socket = __webpack_require__(38);

var _socket2 = _interopRequireDefault(_socket);

var _Utils = __webpack_require__(4);

var _Utils2 = _interopRequireDefault(_Utils);

var _Scheduler = __webpack_require__(70);

var _Scheduler2 = _interopRequireDefault(_Scheduler);

var _Synchronizer = __webpack_require__(71);

var _Synchronizer2 = _interopRequireDefault(_Synchronizer);

var _Serializer = __webpack_require__(1);

var _Serializer2 = _interopRequireDefault(_Serializer);

var _NetworkMonitor = __webpack_require__(76);

var _NetworkMonitor2 = _interopRequireDefault(_NetworkMonitor);

var _NetworkTransmitter = __webpack_require__(77);

var _NetworkTransmitter2 = _interopRequireDefault(_NetworkTransmitter);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

// externalizing these parameters as options would add confusion to game
// developers, and provide no real benefit.
var STEP_DRIFT_THRESHOLDS = {
    onServerSync: { MAX_LEAD: 1, MAX_LAG: 3 }, // max step lead/lag allowed after every server sync
    onEveryStep: { MAX_LEAD: 7, MAX_LAG: 8 // max step lead/lag allowed at every step
    } };
var STEP_DRIFT_THRESHOLD__CLIENT_RESET = 20; // if we are behind this many steps, just reset the step counter
var GAME_UPS = 60; // default number of game steps per second
var STEP_DELAY_MSEC = 12; // if forward drift detected, delay next execution by this amount
var STEP_HURRY_MSEC = 8; // if backward drift detected, hurry next execution by this amount

/**
 * The client engine is the singleton which manages the client-side
 * process, starting the game engine, listening to network messages,
 * starting client steps, and handling world updates which arrive from
 * the server.
 */

var ClientEngine = function () {

    /**
      * Create a client engine instance.
      *
      * @param {GameEngine} gameEngine - a game engine
      * @param {Object} inputOptions - options object
      * @param {Boolean} inputOptions.autoConnect - if true, the client will automatically attempt connect to server.
      * @param {Boolean} inputOptions.standaloneMode - if true, the client will never try to connect to a server
      * @param {Number} inputOptions.delayInputCount - if set, inputs will be delayed by this many steps before they are actually applied on the client.
      * @param {Number} inputOptions.healthCheckInterval - health check message interval (millisec). Default is 1000.
      * @param {Number} inputOptions.healthCheckRTTSample - health check RTT calculation sample size. Default is 10.
      * @param {Object} inputOptions.syncOptions - an object describing the synchronization method. If not set, will be set to extrapolate, with local object bending set to 0.0 and remote object bending set to 0.6. If the query-string parameter "sync" is defined, then that value is passed to this object's sync attribute.
      * @param {String} inputOptions.scheduler - When set to "render-schedule" the game step scheduling is controlled by the renderer and step time is variable.  When set to "fixed" the game step is run independently with a fixed step time. Default is "fixed".
      * @param {String} inputOptions.syncOptions.sync - chosen sync option, can be interpolate, extrapolate, or frameSync
      * @param {Number} inputOptions.syncOptions.localObjBending - amount of bending towards original client position, after each sync, for local objects
      * @param {Number} inputOptions.syncOptions.remoteObjBending - amount of bending towards original client position, after each sync, for remote objects
      * @param {Renderer} Renderer - the Renderer class constructor
      */
    function ClientEngine(gameEngine, inputOptions, Renderer) {
        _classCallCheck(this, ClientEngine);

        this.options = Object.assign({
            autoConnect: true,
            healthCheckInterval: 1000,
            healthCheckRTTSample: 10,
            stepPeriod: 1000 / GAME_UPS,
            scheduler: 'fixed'
        }, inputOptions);

        /**
         * reference to serializer
         * @member {Serializer}
         */
        this.serializer = new _Serializer2.default();

        /**
         * reference to game engine
         * @member {GameEngine}
         */
        this.gameEngine = gameEngine;
        this.gameEngine.registerClasses(this.serializer);
        this.networkTransmitter = new _NetworkTransmitter2.default(this.serializer);
        this.networkMonitor = new _NetworkMonitor2.default();

        this.inboundMessages = [];
        this.outboundMessages = [];

        // create the renderer
        this.renderer = this.gameEngine.renderer = new Renderer(gameEngine, this);

        // step scheduler
        this.scheduler = null;
        this.lastStepTime = 0;
        this.correction = 0;

        if (this.options.standaloneMode !== true) {
            this.configureSynchronization();
        }

        // create a buffer of delayed inputs (fifo)
        if (inputOptions && inputOptions.delayInputCount) {
            this.delayedInputs = [];
            for (var i = 0; i < inputOptions.delayInputCount; i++) {
                this.delayedInputs[i] = [];
            }
        }
    }

    _createClass(ClientEngine, [{
        key: 'configureSynchronization',
        value: function configureSynchronization() {

            // the reflect syncronizer is just interpolate strategy,
            // configured to show server syncs
            var syncOptions = this.options.syncOptions;
            if (syncOptions.sync === 'reflect') {
                syncOptions.sync = 'interpolate';
                syncOptions.reflect = true;
            }

            var synchronizer = new _Synchronizer2.default(this, syncOptions);
        }

        /**
         * Makes a connection to the game server
         *
         * @param {Object} [options] additional socket.io options
         * @return {Promise} Resolved when the connection is made to the server
         */

    }, {
        key: 'connect',
        value: function connect() {
            var _this = this;

            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            var connectSocket = function connectSocket(matchMakerAnswer) {
                return new Promise(function (resolve, reject) {

                    if (matchMakerAnswer.status !== 'ok') reject();

                    console.log('connecting to game server ' + matchMakerAnswer.serverURL);
                    _this.socket = (0, _socket2.default)(matchMakerAnswer.serverURL, options);

                    _this.networkMonitor.registerClient(_this);

                    _this.socket.once('connect', function () {
                        console.log('connection made');
                        resolve();
                    });

                    _this.socket.on('playerJoined', function (playerData) {
                        _this.gameEngine.playerId = playerData.playerId;
                        _this.messageIndex = Number(_this.gameEngine.playerId) * 10000;
                    });

                    _this.socket.on('worldUpdate', function (worldData) {
                        _this.inboundMessages.push(worldData);
                    });
                });
            };

            var matchmaker = Promise.resolve({ serverURL: null, status: 'ok' });
            if (this.options.matchmaker) matchmaker = _Utils2.default.httpGetPromise(this.options.matchmaker);

            return matchmaker.then(connectSocket);
        }

        /**
         * Start the client engine, setting up the game loop, rendering loop and renderer.
         *
         * @return {Promise} Resolves once the Renderer has been initialized, and the game is
         * ready to connect
         */

    }, {
        key: 'start',
        value: function start() {
            var _this2 = this;

            // initialize the renderer
            // the render loop waits for next animation frame
            if (!this.renderer) alert('ERROR: game has not defined a renderer');
            var renderLoop = function renderLoop(timestamp) {
                _this2.lastTimestamp = _this2.lastTimestamp || timestamp;
                _this2.renderer.draw(timestamp, timestamp - _this2.lastTimestamp);
                _this2.lastTimestamp = timestamp;
                window.requestAnimationFrame(renderLoop);
            };

            return this.renderer.init().then(function () {
                _this2.gameEngine.start();

                if (_this2.options.scheduler === 'fixed') {
                    // schedule and start the game loop
                    _this2.scheduler = new _Scheduler2.default({
                        period: _this2.options.stepPeriod,
                        tick: _this2.step.bind(_this2),
                        delay: STEP_DELAY_MSEC
                    });
                    _this2.scheduler.start();
                }

                if (typeof window !== 'undefined') window.requestAnimationFrame(renderLoop);
                if (_this2.options.autoConnect && _this2.options.standaloneMode !== true) {
                    _this2.connect();
                }
            });
        }

        // check if client step is too far ahead (leading) or too far
        // behing (lagging) the server step

    }, {
        key: 'checkDrift',
        value: function checkDrift(checkType) {

            if (!this.gameEngine.serverStep) return;

            var maxLead = STEP_DRIFT_THRESHOLDS[checkType].MAX_LEAD;
            var maxLag = STEP_DRIFT_THRESHOLDS[checkType].MAX_LAG;
            var clientStep = this.gameEngine.world.stepCount;
            var serverStep = this.gameEngine.serverStep;
            if (clientStep > serverStep + maxLead) {
                this.gameEngine.trace.warn(function () {
                    return 'step drift ' + checkType + '. [' + clientStep + ' > ' + serverStep + ' + ' + maxLead + '] Client is ahead of server.  Delaying next step.';
                });
                if (this.scheduler) this.scheduler.delayTick();
                this.lastStepTime += STEP_DELAY_MSEC;
                this.correction += STEP_DELAY_MSEC;
            } else if (serverStep > clientStep + maxLag) {
                this.gameEngine.trace.warn(function () {
                    return 'step drift ' + checkType + '. [' + serverStep + ' > ' + clientStep + ' + ' + maxLag + '] Client is behind server.  Hurrying next step.';
                });
                if (this.scheduler) this.scheduler.hurryTick();
                this.lastStepTime -= STEP_HURRY_MSEC;
                this.correction -= STEP_HURRY_MSEC;
            }
        }
    }, {
        key: 'step',
        value: function step(t, dt, physicsOnly) {

            // physics only case
            if (physicsOnly) {
                this.gameEngine.step(false, t, dt, physicsOnly);
                return;
            }

            // first update the trace state
            this.gameEngine.trace.setStep(this.gameEngine.world.stepCount + 1);

            // skip one step if requested
            if (this.skipOneStep === true) {
                this.skipOneStep = false;
                return;
            }

            this.gameEngine.emit('client__preStep');
            while (this.inboundMessages.length > 0) {
                this.handleInboundMessage(this.inboundMessages.pop());
                this.checkDrift('onServerSync');
            }

            // check for server/client step drift without update
            this.checkDrift('onEveryStep');

            // perform game engine step
            if (this.options.standaloneMode !== true) {
                this.handleOutboundInput();
            }
            this.applyDelayedInputs();
            this.gameEngine.step(false, t, dt);
            this.gameEngine.emit('client__postStep', { dt: dt });

            if (this.options.standaloneMode !== true && this.gameEngine.trace.length && this.socket) {
                // socket might not have been initialized at this point
                this.socket.emit('trace', JSON.stringify(this.gameEngine.trace.rotate()));
            }
        }
    }, {
        key: 'doInputLocal',
        value: function doInputLocal(message) {
            if (this.gameEngine.passive) {
                return;
            }

            var inputEvent = { input: message.data, playerId: this.gameEngine.playerId };
            this.gameEngine.emit('client__processInput', inputEvent);
            this.gameEngine.emit('processInput', inputEvent);
            this.gameEngine.processInput(message.data, this.gameEngine.playerId, false);
        }
    }, {
        key: 'applyDelayedInputs',
        value: function applyDelayedInputs() {
            if (!this.delayedInputs) {
                return;
            }
            var that = this;
            var delayed = this.delayedInputs.shift();
            if (delayed && delayed.length) {
                delayed.forEach(that.doInputLocal.bind(that));
            }
            this.delayedInputs.push([]);
        }

        /**
         * This function should be called by the client whenever a user input
         * occurs.  This function will emit the input event,
         * forward the input to the client's game engine (with a delay if
         * so configured) and will transmit the input to the server as well.
         *
         * This function can be called by the extended client engine class,
         * typically at the beginning of client-side step processing (see event client__preStep)
         *
         * @param {Object} input - string representing the input
         * @param {Object} inputOptions - options for the input
         */

    }, {
        key: 'sendInput',
        value: function sendInput(input, inputOptions) {
            var _this3 = this;

            var message = {
                command: 'move',
                data: {
                    messageIndex: this.messageIndex,
                    step: this.gameEngine.world.stepCount,
                    input: input,
                    options: inputOptions
                }
            };

            this.gameEngine.trace.info(function () {
                return 'USER INPUT[' + _this3.messageIndex + ']: ' + input + ' ' + (inputOptions ? JSON.stringify(inputOptions) : '{}');
            });

            // if we delay input application on client, then queue it
            // otherwise apply it now
            if (this.delayedInputs) {
                this.delayedInputs[this.delayedInputs.length - 1].push(message);
            } else {
                this.doInputLocal(message);
            }

            if (this.options.standaloneMode !== true) {
                this.outboundMessages.push(message);
            }

            this.messageIndex++;
        }
    }, {
        key: 'handleInboundMessage',
        value: function handleInboundMessage(syncData) {
            var _this4 = this;

            var syncEvents = this.networkTransmitter.deserializePayload(syncData).events;
            var syncHeader = syncEvents.find(function (e) {
                return e.eventName === 'syncHeader';
            });

            // emit that a snapshot has been received
            this.gameEngine.serverStep = syncHeader.stepCount;
            this.gameEngine.emit('client__syncReceived', {
                syncEvents: syncEvents,
                stepCount: syncHeader.stepCount,
                fullUpdate: syncHeader.fullUpdate
            });

            this.gameEngine.trace.info(function () {
                return '========== inbound world update ' + syncHeader.stepCount + ' ==========';
            });

            // finally update the stepCount
            if (syncHeader.stepCount > this.gameEngine.world.stepCount + STEP_DRIFT_THRESHOLD__CLIENT_RESET) {
                this.gameEngine.trace.info(function () {
                    return '========== world step count updated from ' + _this4.gameEngine.world.stepCount + ' to  ' + syncHeader.stepCount + ' ==========';
                });
                this.gameEngine.emit('client__stepReset', { oldStep: this.gameEngine.world.stepCount, newStep: syncHeader.stepCount });
                this.gameEngine.world.stepCount = syncHeader.stepCount;
            }
        }
    }, {
        key: 'handleOutboundInput',
        value: function handleOutboundInput() {
            for (var x = 0; x < this.outboundMessages.length; x++) {
                this.socket.emit(this.outboundMessages[x].command, this.outboundMessages[x].data);
            }
            this.outboundMessages = [];
        }
    }]);

    return ClientEngine;
}();

exports.default = ClientEngine;

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * Module dependencies.
 */

var url = __webpack_require__(39);
var parser = __webpack_require__(10);
var Manager = __webpack_require__(21);
var debug = __webpack_require__(7)('socket.io-client');

/**
 * Module exports.
 */

module.exports = exports = lookup;

/**
 * Managers cache.
 */

var cache = exports.managers = {};

/**
 * Looks up an existing `Manager` for multiplexing.
 * If the user summons:
 *
 *   `io('http://localhost/a');`
 *   `io('http://localhost/b');`
 *
 * We reuse the existing instance based on same scheme/port/host,
 * and we initialize sockets for each namespace.
 *
 * @api public
 */

function lookup (uri, opts) {
  if (typeof uri === 'object') {
    opts = uri;
    uri = undefined;
  }

  opts = opts || {};

  var parsed = url(uri);
  var source = parsed.source;
  var id = parsed.id;
  var path = parsed.path;
  var sameNamespace = cache[id] && path in cache[id].nsps;
  var newConnection = opts.forceNew || opts['force new connection'] ||
                      false === opts.multiplex || sameNamespace;

  var io;

  if (newConnection) {
    debug('ignoring socket cache for %s', source);
    io = Manager(source, opts);
  } else {
    if (!cache[id]) {
      debug('new io instance for %s', source);
      cache[id] = Manager(source, opts);
    }
    io = cache[id];
  }
  if (parsed.query && !opts.query) {
    opts.query = parsed.query;
  } else if (opts && 'object' === typeof opts.query) {
    opts.query = encodeQueryString(opts.query);
  }
  return io.socket(parsed.path, opts);
}
/**
 *  Helper method to parse query objects to string.
 * @param {object} query
 * @returns {string}
 */
function encodeQueryString (obj) {
  var str = [];
  for (var p in obj) {
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }
  }
  return str.join('&');
}
/**
 * Protocol version.
 *
 * @api public
 */

exports.protocol = parser.protocol;

/**
 * `connect`.
 *
 * @param {String} uri
 * @api public
 */

exports.connect = lookup;

/**
 * Expose constructors for standalone build.
 *
 * @api public
 */

exports.Manager = __webpack_require__(21);
exports.Socket = __webpack_require__(27);


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {
/**
 * Module dependencies.
 */

var parseuri = __webpack_require__(17);
var debug = __webpack_require__(7)('socket.io-client:url');

/**
 * Module exports.
 */

module.exports = url;

/**
 * URL parser.
 *
 * @param {String} url
 * @param {Object} An object meant to mimic window.location.
 *                 Defaults to window.location.
 * @api public
 */

function url (uri, loc) {
  var obj = uri;

  // default to window.location
  loc = loc || global.location;
  if (null == uri) uri = loc.protocol + '//' + loc.host;

  // relative path support
  if ('string' === typeof uri) {
    if ('/' === uri.charAt(0)) {
      if ('/' === uri.charAt(1)) {
        uri = loc.protocol + uri;
      } else {
        uri = loc.host + uri;
      }
    }

    if (!/^(https?|wss?):\/\//.test(uri)) {
      debug('protocol-less url %s', uri);
      if ('undefined' !== typeof loc) {
        uri = loc.protocol + '//' + uri;
      } else {
        uri = 'https://' + uri;
      }
    }

    // parse
    debug('parse %s', uri);
    obj = parseuri(uri);
  }

  // make sure we treat `localhost:80` and `localhost` equally
  if (!obj.port) {
    if (/^(http|ws)$/.test(obj.protocol)) {
      obj.port = '80';
    } else if (/^(http|ws)s$/.test(obj.protocol)) {
      obj.port = '443';
    }
  }

  obj.path = obj.path || '/';

  var ipv6 = obj.host.indexOf(':') !== -1;
  var host = ipv6 ? '[' + obj.host + ']' : obj.host;

  // define unique id
  obj.id = obj.protocol + '://' + host + ':' + obj.port;
  // define href
  obj.href = obj.protocol + '://' + host + (loc && loc.port === obj.port ? '' : (':' + obj.port));

  return obj;
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug.debug = debug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = __webpack_require__(41);

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lowercased letter, i.e. "n".
 */

exports.formatters = {};

/**
 * Previously assigned color.
 */

var prevColor = 0;

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 *
 * @return {Number}
 * @api private
 */

function selectColor() {
  return exports.colors[prevColor++ % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function debug(namespace) {

  // define the `disabled` version
  function disabled() {
  }
  disabled.enabled = false;

  // define the `enabled` version
  function enabled() {

    var self = enabled;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // add the `color` if not set
    if (null == self.useColors) self.useColors = exports.useColors();
    if (null == self.color && self.useColors) self.color = selectColor();

    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %o
      args = ['%o'].concat(args);
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting
    args = exports.formatArgs.apply(self, args);

    var logFn = enabled.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }
  enabled.enabled = true;

  var fn = exports.enabled(namespace) ? enabled : disabled;

  fn.namespace = namespace;

  return fn;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  var split = (namespaces || '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/[\\^$+?.()|[\]{}]/g, '\\$&').replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}


/***/ }),
/* 41 */
/***/ (function(module, exports) {

/**
 * Helpers.
 */

var s = 1000
var m = s * 60
var h = m * 60
var d = h * 24
var y = d * 365.25

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} options
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function (val, options) {
  options = options || {}
  var type = typeof val
  if (type === 'string' && val.length > 0) {
    return parse(val)
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ?
			fmtLong(val) :
			fmtShort(val)
  }
  throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(val))
}

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str)
  if (str.length > 10000) {
    return
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str)
  if (!match) {
    return
  }
  var n = parseFloat(match[1])
  var type = (match[2] || 'ms').toLowerCase()
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y
    case 'days':
    case 'day':
    case 'd':
      return n * d
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n
    default:
      return undefined
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd'
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h'
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm'
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's'
  }
  return ms + 'ms'
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms'
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name
  }
  return Math.ceil(ms / n) + ' ' + name + 's'
}


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(43);
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // is webkit? http://stackoverflow.com/a/16459606/376773
  return ('WebkitAppearance' in document.documentElement.style) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (window.console && (console.firebug || (console.exception && console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  return JSON.stringify(v);
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs() {
  var args = arguments;
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return args;

  var c = 'color: ' + this.color;
  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
  return args;
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}
  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage(){
  try {
    return window.localStorage;
  } catch (e) {}
}


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = __webpack_require__(44);

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lowercased letter, i.e. "n".
 */

exports.formatters = {};

/**
 * Previously assigned color.
 */

var prevColor = 0;

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 *
 * @return {Number}
 * @api private
 */

function selectColor() {
  return exports.colors[prevColor++ % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function debug(namespace) {

  // define the `disabled` version
  function disabled() {
  }
  disabled.enabled = false;

  // define the `enabled` version
  function enabled() {

    var self = enabled;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // add the `color` if not set
    if (null == self.useColors) self.useColors = exports.useColors();
    if (null == self.color && self.useColors) self.color = selectColor();

    var args = Array.prototype.slice.call(arguments);

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %o
      args = ['%o'].concat(args);
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    if ('function' === typeof exports.formatArgs) {
      args = exports.formatArgs.apply(self, args);
    }
    var logFn = enabled.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }
  enabled.enabled = true;

  var fn = exports.enabled(namespace) ? enabled : disabled;

  fn.namespace = namespace;

  return fn;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  var split = (namespaces || '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}


/***/ }),
/* 44 */
/***/ (function(module, exports) {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} options
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options){
  options = options || {};
  if ('string' == typeof val) return parse(val);
  return options.long
    ? long(val)
    : short(val);
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = '' + str;
  if (str.length > 10000) return;
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
  if (!match) return;
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function short(ms) {
  if (ms >= d) return Math.round(ms / d) + 'd';
  if (ms >= h) return Math.round(ms / h) + 'h';
  if (ms >= m) return Math.round(ms / m) + 'm';
  if (ms >= s) return Math.round(ms / s) + 's';
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function long(ms) {
  return plural(ms, d, 'day')
    || plural(ms, h, 'hour')
    || plural(ms, m, 'minute')
    || plural(ms, s, 'second')
    || ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) return;
  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
  return Math.ceil(ms / n) + ' ' + name + 's';
}


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module, global) {var __WEBPACK_AMD_DEFINE_RESULT__;/*! JSON v3.3.2 | http://bestiejs.github.io/json3 | Copyright 2012-2014, Kit Cambridge | http://kit.mit-license.org */
;(function () {
  // Detect the `define` function exposed by asynchronous module loaders. The
  // strict `define` check is necessary for compatibility with `r.js`.
  var isLoader = "function" === "function" && __webpack_require__(46);

  // A set of types used to distinguish objects from primitives.
  var objectTypes = {
    "function": true,
    "object": true
  };

  // Detect the `exports` object exposed by CommonJS implementations.
  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

  // Use the `global` object exposed by Node (including Browserify via
  // `insert-module-globals`), Narwhal, and Ringo as the default context,
  // and the `window` object in browsers. Rhino exports a `global` function
  // instead.
  var root = objectTypes[typeof window] && window || this,
      freeGlobal = freeExports && objectTypes[typeof module] && module && !module.nodeType && typeof global == "object" && global;

  if (freeGlobal && (freeGlobal["global"] === freeGlobal || freeGlobal["window"] === freeGlobal || freeGlobal["self"] === freeGlobal)) {
    root = freeGlobal;
  }

  // Public: Initializes JSON 3 using the given `context` object, attaching the
  // `stringify` and `parse` functions to the specified `exports` object.
  function runInContext(context, exports) {
    context || (context = root["Object"]());
    exports || (exports = root["Object"]());

    // Native constructor aliases.
    var Number = context["Number"] || root["Number"],
        String = context["String"] || root["String"],
        Object = context["Object"] || root["Object"],
        Date = context["Date"] || root["Date"],
        SyntaxError = context["SyntaxError"] || root["SyntaxError"],
        TypeError = context["TypeError"] || root["TypeError"],
        Math = context["Math"] || root["Math"],
        nativeJSON = context["JSON"] || root["JSON"];

    // Delegate to the native `stringify` and `parse` implementations.
    if (typeof nativeJSON == "object" && nativeJSON) {
      exports.stringify = nativeJSON.stringify;
      exports.parse = nativeJSON.parse;
    }

    // Convenience aliases.
    var objectProto = Object.prototype,
        getClass = objectProto.toString,
        isProperty, forEach, undef;

    // Test the `Date#getUTC*` methods. Based on work by @Yaffle.
    var isExtended = new Date(-3509827334573292);
    try {
      // The `getUTCFullYear`, `Month`, and `Date` methods return nonsensical
      // results for certain dates in Opera >= 10.53.
      isExtended = isExtended.getUTCFullYear() == -109252 && isExtended.getUTCMonth() === 0 && isExtended.getUTCDate() === 1 &&
        // Safari < 2.0.2 stores the internal millisecond time value correctly,
        // but clips the values returned by the date methods to the range of
        // signed 32-bit integers ([-2 ** 31, 2 ** 31 - 1]).
        isExtended.getUTCHours() == 10 && isExtended.getUTCMinutes() == 37 && isExtended.getUTCSeconds() == 6 && isExtended.getUTCMilliseconds() == 708;
    } catch (exception) {}

    // Internal: Determines whether the native `JSON.stringify` and `parse`
    // implementations are spec-compliant. Based on work by Ken Snyder.
    function has(name) {
      if (has[name] !== undef) {
        // Return cached feature test result.
        return has[name];
      }
      var isSupported;
      if (name == "bug-string-char-index") {
        // IE <= 7 doesn't support accessing string characters using square
        // bracket notation. IE 8 only supports this for primitives.
        isSupported = "a"[0] != "a";
      } else if (name == "json") {
        // Indicates whether both `JSON.stringify` and `JSON.parse` are
        // supported.
        isSupported = has("json-stringify") && has("json-parse");
      } else {
        var value, serialized = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
        // Test `JSON.stringify`.
        if (name == "json-stringify") {
          var stringify = exports.stringify, stringifySupported = typeof stringify == "function" && isExtended;
          if (stringifySupported) {
            // A test function object with a custom `toJSON` method.
            (value = function () {
              return 1;
            }).toJSON = value;
            try {
              stringifySupported =
                // Firefox 3.1b1 and b2 serialize string, number, and boolean
                // primitives as object literals.
                stringify(0) === "0" &&
                // FF 3.1b1, b2, and JSON 2 serialize wrapped primitives as object
                // literals.
                stringify(new Number()) === "0" &&
                stringify(new String()) == '""' &&
                // FF 3.1b1, 2 throw an error if the value is `null`, `undefined`, or
                // does not define a canonical JSON representation (this applies to
                // objects with `toJSON` properties as well, *unless* they are nested
                // within an object or array).
                stringify(getClass) === undef &&
                // IE 8 serializes `undefined` as `"undefined"`. Safari <= 5.1.7 and
                // FF 3.1b3 pass this test.
                stringify(undef) === undef &&
                // Safari <= 5.1.7 and FF 3.1b3 throw `Error`s and `TypeError`s,
                // respectively, if the value is omitted entirely.
                stringify() === undef &&
                // FF 3.1b1, 2 throw an error if the given value is not a number,
                // string, array, object, Boolean, or `null` literal. This applies to
                // objects with custom `toJSON` methods as well, unless they are nested
                // inside object or array literals. YUI 3.0.0b1 ignores custom `toJSON`
                // methods entirely.
                stringify(value) === "1" &&
                stringify([value]) == "[1]" &&
                // Prototype <= 1.6.1 serializes `[undefined]` as `"[]"` instead of
                // `"[null]"`.
                stringify([undef]) == "[null]" &&
                // YUI 3.0.0b1 fails to serialize `null` literals.
                stringify(null) == "null" &&
                // FF 3.1b1, 2 halts serialization if an array contains a function:
                // `[1, true, getClass, 1]` serializes as "[1,true,],". FF 3.1b3
                // elides non-JSON values from objects and arrays, unless they
                // define custom `toJSON` methods.
                stringify([undef, getClass, null]) == "[null,null,null]" &&
                // Simple serialization test. FF 3.1b1 uses Unicode escape sequences
                // where character escape codes are expected (e.g., `\b` => `\u0008`).
                stringify({ "a": [value, true, false, null, "\x00\b\n\f\r\t"] }) == serialized &&
                // FF 3.1b1 and b2 ignore the `filter` and `width` arguments.
                stringify(null, value) === "1" &&
                stringify([1, 2], null, 1) == "[\n 1,\n 2\n]" &&
                // JSON 2, Prototype <= 1.7, and older WebKit builds incorrectly
                // serialize extended years.
                stringify(new Date(-8.64e15)) == '"-271821-04-20T00:00:00.000Z"' &&
                // The milliseconds are optional in ES 5, but required in 5.1.
                stringify(new Date(8.64e15)) == '"+275760-09-13T00:00:00.000Z"' &&
                // Firefox <= 11.0 incorrectly serializes years prior to 0 as negative
                // four-digit years instead of six-digit years. Credits: @Yaffle.
                stringify(new Date(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' &&
                // Safari <= 5.1.5 and Opera >= 10.53 incorrectly serialize millisecond
                // values less than 1000. Credits: @Yaffle.
                stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"';
            } catch (exception) {
              stringifySupported = false;
            }
          }
          isSupported = stringifySupported;
        }
        // Test `JSON.parse`.
        if (name == "json-parse") {
          var parse = exports.parse;
          if (typeof parse == "function") {
            try {
              // FF 3.1b1, b2 will throw an exception if a bare literal is provided.
              // Conforming implementations should also coerce the initial argument to
              // a string prior to parsing.
              if (parse("0") === 0 && !parse(false)) {
                // Simple parsing test.
                value = parse(serialized);
                var parseSupported = value["a"].length == 5 && value["a"][0] === 1;
                if (parseSupported) {
                  try {
                    // Safari <= 5.1.2 and FF 3.1b1 allow unescaped tabs in strings.
                    parseSupported = !parse('"\t"');
                  } catch (exception) {}
                  if (parseSupported) {
                    try {
                      // FF 4.0 and 4.0.1 allow leading `+` signs and leading
                      // decimal points. FF 4.0, 4.0.1, and IE 9-10 also allow
                      // certain octal literals.
                      parseSupported = parse("01") !== 1;
                    } catch (exception) {}
                  }
                  if (parseSupported) {
                    try {
                      // FF 4.0, 4.0.1, and Rhino 1.7R3-R4 allow trailing decimal
                      // points. These environments, along with FF 3.1b1 and 2,
                      // also allow trailing commas in JSON objects and arrays.
                      parseSupported = parse("1.") !== 1;
                    } catch (exception) {}
                  }
                }
              }
            } catch (exception) {
              parseSupported = false;
            }
          }
          isSupported = parseSupported;
        }
      }
      return has[name] = !!isSupported;
    }

    if (!has("json")) {
      // Common `[[Class]]` name aliases.
      var functionClass = "[object Function]",
          dateClass = "[object Date]",
          numberClass = "[object Number]",
          stringClass = "[object String]",
          arrayClass = "[object Array]",
          booleanClass = "[object Boolean]";

      // Detect incomplete support for accessing string characters by index.
      var charIndexBuggy = has("bug-string-char-index");

      // Define additional utility methods if the `Date` methods are buggy.
      if (!isExtended) {
        var floor = Math.floor;
        // A mapping between the months of the year and the number of days between
        // January 1st and the first of the respective month.
        var Months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        // Internal: Calculates the number of days between the Unix epoch and the
        // first day of the given month.
        var getDay = function (year, month) {
          return Months[month] + 365 * (year - 1970) + floor((year - 1969 + (month = +(month > 1))) / 4) - floor((year - 1901 + month) / 100) + floor((year - 1601 + month) / 400);
        };
      }

      // Internal: Determines if a property is a direct property of the given
      // object. Delegates to the native `Object#hasOwnProperty` method.
      if (!(isProperty = objectProto.hasOwnProperty)) {
        isProperty = function (property) {
          var members = {}, constructor;
          if ((members.__proto__ = null, members.__proto__ = {
            // The *proto* property cannot be set multiple times in recent
            // versions of Firefox and SeaMonkey.
            "toString": 1
          }, members).toString != getClass) {
            // Safari <= 2.0.3 doesn't implement `Object#hasOwnProperty`, but
            // supports the mutable *proto* property.
            isProperty = function (property) {
              // Capture and break the object's prototype chain (see section 8.6.2
              // of the ES 5.1 spec). The parenthesized expression prevents an
              // unsafe transformation by the Closure Compiler.
              var original = this.__proto__, result = property in (this.__proto__ = null, this);
              // Restore the original prototype chain.
              this.__proto__ = original;
              return result;
            };
          } else {
            // Capture a reference to the top-level `Object` constructor.
            constructor = members.constructor;
            // Use the `constructor` property to simulate `Object#hasOwnProperty` in
            // other environments.
            isProperty = function (property) {
              var parent = (this.constructor || constructor).prototype;
              return property in this && !(property in parent && this[property] === parent[property]);
            };
          }
          members = null;
          return isProperty.call(this, property);
        };
      }

      // Internal: Normalizes the `for...in` iteration algorithm across
      // environments. Each enumerated key is yielded to a `callback` function.
      forEach = function (object, callback) {
        var size = 0, Properties, members, property;

        // Tests for bugs in the current environment's `for...in` algorithm. The
        // `valueOf` property inherits the non-enumerable flag from
        // `Object.prototype` in older versions of IE, Netscape, and Mozilla.
        (Properties = function () {
          this.valueOf = 0;
        }).prototype.valueOf = 0;

        // Iterate over a new instance of the `Properties` class.
        members = new Properties();
        for (property in members) {
          // Ignore all properties inherited from `Object.prototype`.
          if (isProperty.call(members, property)) {
            size++;
          }
        }
        Properties = members = null;

        // Normalize the iteration algorithm.
        if (!size) {
          // A list of non-enumerable properties inherited from `Object.prototype`.
          members = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"];
          // IE <= 8, Mozilla 1.0, and Netscape 6.2 ignore shadowed non-enumerable
          // properties.
          forEach = function (object, callback) {
            var isFunction = getClass.call(object) == functionClass, property, length;
            var hasProperty = !isFunction && typeof object.constructor != "function" && objectTypes[typeof object.hasOwnProperty] && object.hasOwnProperty || isProperty;
            for (property in object) {
              // Gecko <= 1.0 enumerates the `prototype` property of functions under
              // certain conditions; IE does not.
              if (!(isFunction && property == "prototype") && hasProperty.call(object, property)) {
                callback(property);
              }
            }
            // Manually invoke the callback for each non-enumerable property.
            for (length = members.length; property = members[--length]; hasProperty.call(object, property) && callback(property));
          };
        } else if (size == 2) {
          // Safari <= 2.0.4 enumerates shadowed properties twice.
          forEach = function (object, callback) {
            // Create a set of iterated properties.
            var members = {}, isFunction = getClass.call(object) == functionClass, property;
            for (property in object) {
              // Store each property name to prevent double enumeration. The
              // `prototype` property of functions is not enumerated due to cross-
              // environment inconsistencies.
              if (!(isFunction && property == "prototype") && !isProperty.call(members, property) && (members[property] = 1) && isProperty.call(object, property)) {
                callback(property);
              }
            }
          };
        } else {
          // No bugs detected; use the standard `for...in` algorithm.
          forEach = function (object, callback) {
            var isFunction = getClass.call(object) == functionClass, property, isConstructor;
            for (property in object) {
              if (!(isFunction && property == "prototype") && isProperty.call(object, property) && !(isConstructor = property === "constructor")) {
                callback(property);
              }
            }
            // Manually invoke the callback for the `constructor` property due to
            // cross-environment inconsistencies.
            if (isConstructor || isProperty.call(object, (property = "constructor"))) {
              callback(property);
            }
          };
        }
        return forEach(object, callback);
      };

      // Public: Serializes a JavaScript `value` as a JSON string. The optional
      // `filter` argument may specify either a function that alters how object and
      // array members are serialized, or an array of strings and numbers that
      // indicates which properties should be serialized. The optional `width`
      // argument may be either a string or number that specifies the indentation
      // level of the output.
      if (!has("json-stringify")) {
        // Internal: A map of control characters and their escaped equivalents.
        var Escapes = {
          92: "\\\\",
          34: '\\"',
          8: "\\b",
          12: "\\f",
          10: "\\n",
          13: "\\r",
          9: "\\t"
        };

        // Internal: Converts `value` into a zero-padded string such that its
        // length is at least equal to `width`. The `width` must be <= 6.
        var leadingZeroes = "000000";
        var toPaddedString = function (width, value) {
          // The `|| 0` expression is necessary to work around a bug in
          // Opera <= 7.54u2 where `0 == -0`, but `String(-0) !== "0"`.
          return (leadingZeroes + (value || 0)).slice(-width);
        };

        // Internal: Double-quotes a string `value`, replacing all ASCII control
        // characters (characters with code unit values between 0 and 31) with
        // their escaped equivalents. This is an implementation of the
        // `Quote(value)` operation defined in ES 5.1 section 15.12.3.
        var unicodePrefix = "\\u00";
        var quote = function (value) {
          var result = '"', index = 0, length = value.length, useCharIndex = !charIndexBuggy || length > 10;
          var symbols = useCharIndex && (charIndexBuggy ? value.split("") : value);
          for (; index < length; index++) {
            var charCode = value.charCodeAt(index);
            // If the character is a control character, append its Unicode or
            // shorthand escape sequence; otherwise, append the character as-is.
            switch (charCode) {
              case 8: case 9: case 10: case 12: case 13: case 34: case 92:
                result += Escapes[charCode];
                break;
              default:
                if (charCode < 32) {
                  result += unicodePrefix + toPaddedString(2, charCode.toString(16));
                  break;
                }
                result += useCharIndex ? symbols[index] : value.charAt(index);
            }
          }
          return result + '"';
        };

        // Internal: Recursively serializes an object. Implements the
        // `Str(key, holder)`, `JO(value)`, and `JA(value)` operations.
        var serialize = function (property, object, callback, properties, whitespace, indentation, stack) {
          var value, className, year, month, date, time, hours, minutes, seconds, milliseconds, results, element, index, length, prefix, result;
          try {
            // Necessary for host object support.
            value = object[property];
          } catch (exception) {}
          if (typeof value == "object" && value) {
            className = getClass.call(value);
            if (className == dateClass && !isProperty.call(value, "toJSON")) {
              if (value > -1 / 0 && value < 1 / 0) {
                // Dates are serialized according to the `Date#toJSON` method
                // specified in ES 5.1 section 15.9.5.44. See section 15.9.1.15
                // for the ISO 8601 date time string format.
                if (getDay) {
                  // Manually compute the year, month, date, hours, minutes,
                  // seconds, and milliseconds if the `getUTC*` methods are
                  // buggy. Adapted from @Yaffle's `date-shim` project.
                  date = floor(value / 864e5);
                  for (year = floor(date / 365.2425) + 1970 - 1; getDay(year + 1, 0) <= date; year++);
                  for (month = floor((date - getDay(year, 0)) / 30.42); getDay(year, month + 1) <= date; month++);
                  date = 1 + date - getDay(year, month);
                  // The `time` value specifies the time within the day (see ES
                  // 5.1 section 15.9.1.2). The formula `(A % B + B) % B` is used
                  // to compute `A modulo B`, as the `%` operator does not
                  // correspond to the `modulo` operation for negative numbers.
                  time = (value % 864e5 + 864e5) % 864e5;
                  // The hours, minutes, seconds, and milliseconds are obtained by
                  // decomposing the time within the day. See section 15.9.1.10.
                  hours = floor(time / 36e5) % 24;
                  minutes = floor(time / 6e4) % 60;
                  seconds = floor(time / 1e3) % 60;
                  milliseconds = time % 1e3;
                } else {
                  year = value.getUTCFullYear();
                  month = value.getUTCMonth();
                  date = value.getUTCDate();
                  hours = value.getUTCHours();
                  minutes = value.getUTCMinutes();
                  seconds = value.getUTCSeconds();
                  milliseconds = value.getUTCMilliseconds();
                }
                // Serialize extended years correctly.
                value = (year <= 0 || year >= 1e4 ? (year < 0 ? "-" : "+") + toPaddedString(6, year < 0 ? -year : year) : toPaddedString(4, year)) +
                  "-" + toPaddedString(2, month + 1) + "-" + toPaddedString(2, date) +
                  // Months, dates, hours, minutes, and seconds should have two
                  // digits; milliseconds should have three.
                  "T" + toPaddedString(2, hours) + ":" + toPaddedString(2, minutes) + ":" + toPaddedString(2, seconds) +
                  // Milliseconds are optional in ES 5.0, but required in 5.1.
                  "." + toPaddedString(3, milliseconds) + "Z";
              } else {
                value = null;
              }
            } else if (typeof value.toJSON == "function" && ((className != numberClass && className != stringClass && className != arrayClass) || isProperty.call(value, "toJSON"))) {
              // Prototype <= 1.6.1 adds non-standard `toJSON` methods to the
              // `Number`, `String`, `Date`, and `Array` prototypes. JSON 3
              // ignores all `toJSON` methods on these objects unless they are
              // defined directly on an instance.
              value = value.toJSON(property);
            }
          }
          if (callback) {
            // If a replacement function was provided, call it to obtain the value
            // for serialization.
            value = callback.call(object, property, value);
          }
          if (value === null) {
            return "null";
          }
          className = getClass.call(value);
          if (className == booleanClass) {
            // Booleans are represented literally.
            return "" + value;
          } else if (className == numberClass) {
            // JSON numbers must be finite. `Infinity` and `NaN` are serialized as
            // `"null"`.
            return value > -1 / 0 && value < 1 / 0 ? "" + value : "null";
          } else if (className == stringClass) {
            // Strings are double-quoted and escaped.
            return quote("" + value);
          }
          // Recursively serialize objects and arrays.
          if (typeof value == "object") {
            // Check for cyclic structures. This is a linear search; performance
            // is inversely proportional to the number of unique nested objects.
            for (length = stack.length; length--;) {
              if (stack[length] === value) {
                // Cyclic structures cannot be serialized by `JSON.stringify`.
                throw TypeError();
              }
            }
            // Add the object to the stack of traversed objects.
            stack.push(value);
            results = [];
            // Save the current indentation level and indent one additional level.
            prefix = indentation;
            indentation += whitespace;
            if (className == arrayClass) {
              // Recursively serialize array elements.
              for (index = 0, length = value.length; index < length; index++) {
                element = serialize(index, value, callback, properties, whitespace, indentation, stack);
                results.push(element === undef ? "null" : element);
              }
              result = results.length ? (whitespace ? "[\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "]" : ("[" + results.join(",") + "]")) : "[]";
            } else {
              // Recursively serialize object members. Members are selected from
              // either a user-specified list of property names, or the object
              // itself.
              forEach(properties || value, function (property) {
                var element = serialize(property, value, callback, properties, whitespace, indentation, stack);
                if (element !== undef) {
                  // According to ES 5.1 section 15.12.3: "If `gap` {whitespace}
                  // is not the empty string, let `member` {quote(property) + ":"}
                  // be the concatenation of `member` and the `space` character."
                  // The "`space` character" refers to the literal space
                  // character, not the `space` {width} argument provided to
                  // `JSON.stringify`.
                  results.push(quote(property) + ":" + (whitespace ? " " : "") + element);
                }
              });
              result = results.length ? (whitespace ? "{\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "}" : ("{" + results.join(",") + "}")) : "{}";
            }
            // Remove the object from the traversed object stack.
            stack.pop();
            return result;
          }
        };

        // Public: `JSON.stringify`. See ES 5.1 section 15.12.3.
        exports.stringify = function (source, filter, width) {
          var whitespace, callback, properties, className;
          if (objectTypes[typeof filter] && filter) {
            if ((className = getClass.call(filter)) == functionClass) {
              callback = filter;
            } else if (className == arrayClass) {
              // Convert the property names array into a makeshift set.
              properties = {};
              for (var index = 0, length = filter.length, value; index < length; value = filter[index++], ((className = getClass.call(value)), className == stringClass || className == numberClass) && (properties[value] = 1));
            }
          }
          if (width) {
            if ((className = getClass.call(width)) == numberClass) {
              // Convert the `width` to an integer and create a string containing
              // `width` number of space characters.
              if ((width -= width % 1) > 0) {
                for (whitespace = "", width > 10 && (width = 10); whitespace.length < width; whitespace += " ");
              }
            } else if (className == stringClass) {
              whitespace = width.length <= 10 ? width : width.slice(0, 10);
            }
          }
          // Opera <= 7.54u2 discards the values associated with empty string keys
          // (`""`) only if they are used directly within an object member list
          // (e.g., `!("" in { "": 1})`).
          return serialize("", (value = {}, value[""] = source, value), callback, properties, whitespace, "", []);
        };
      }

      // Public: Parses a JSON source string.
      if (!has("json-parse")) {
        var fromCharCode = String.fromCharCode;

        // Internal: A map of escaped control characters and their unescaped
        // equivalents.
        var Unescapes = {
          92: "\\",
          34: '"',
          47: "/",
          98: "\b",
          116: "\t",
          110: "\n",
          102: "\f",
          114: "\r"
        };

        // Internal: Stores the parser state.
        var Index, Source;

        // Internal: Resets the parser state and throws a `SyntaxError`.
        var abort = function () {
          Index = Source = null;
          throw SyntaxError();
        };

        // Internal: Returns the next token, or `"$"` if the parser has reached
        // the end of the source string. A token may be a string, number, `null`
        // literal, or Boolean literal.
        var lex = function () {
          var source = Source, length = source.length, value, begin, position, isSigned, charCode;
          while (Index < length) {
            charCode = source.charCodeAt(Index);
            switch (charCode) {
              case 9: case 10: case 13: case 32:
                // Skip whitespace tokens, including tabs, carriage returns, line
                // feeds, and space characters.
                Index++;
                break;
              case 123: case 125: case 91: case 93: case 58: case 44:
                // Parse a punctuator token (`{`, `}`, `[`, `]`, `:`, or `,`) at
                // the current position.
                value = charIndexBuggy ? source.charAt(Index) : source[Index];
                Index++;
                return value;
              case 34:
                // `"` delimits a JSON string; advance to the next character and
                // begin parsing the string. String tokens are prefixed with the
                // sentinel `@` character to distinguish them from punctuators and
                // end-of-string tokens.
                for (value = "@", Index++; Index < length;) {
                  charCode = source.charCodeAt(Index);
                  if (charCode < 32) {
                    // Unescaped ASCII control characters (those with a code unit
                    // less than the space character) are not permitted.
                    abort();
                  } else if (charCode == 92) {
                    // A reverse solidus (`\`) marks the beginning of an escaped
                    // control character (including `"`, `\`, and `/`) or Unicode
                    // escape sequence.
                    charCode = source.charCodeAt(++Index);
                    switch (charCode) {
                      case 92: case 34: case 47: case 98: case 116: case 110: case 102: case 114:
                        // Revive escaped control characters.
                        value += Unescapes[charCode];
                        Index++;
                        break;
                      case 117:
                        // `\u` marks the beginning of a Unicode escape sequence.
                        // Advance to the first character and validate the
                        // four-digit code point.
                        begin = ++Index;
                        for (position = Index + 4; Index < position; Index++) {
                          charCode = source.charCodeAt(Index);
                          // A valid sequence comprises four hexdigits (case-
                          // insensitive) that form a single hexadecimal value.
                          if (!(charCode >= 48 && charCode <= 57 || charCode >= 97 && charCode <= 102 || charCode >= 65 && charCode <= 70)) {
                            // Invalid Unicode escape sequence.
                            abort();
                          }
                        }
                        // Revive the escaped character.
                        value += fromCharCode("0x" + source.slice(begin, Index));
                        break;
                      default:
                        // Invalid escape sequence.
                        abort();
                    }
                  } else {
                    if (charCode == 34) {
                      // An unescaped double-quote character marks the end of the
                      // string.
                      break;
                    }
                    charCode = source.charCodeAt(Index);
                    begin = Index;
                    // Optimize for the common case where a string is valid.
                    while (charCode >= 32 && charCode != 92 && charCode != 34) {
                      charCode = source.charCodeAt(++Index);
                    }
                    // Append the string as-is.
                    value += source.slice(begin, Index);
                  }
                }
                if (source.charCodeAt(Index) == 34) {
                  // Advance to the next character and return the revived string.
                  Index++;
                  return value;
                }
                // Unterminated string.
                abort();
              default:
                // Parse numbers and literals.
                begin = Index;
                // Advance past the negative sign, if one is specified.
                if (charCode == 45) {
                  isSigned = true;
                  charCode = source.charCodeAt(++Index);
                }
                // Parse an integer or floating-point value.
                if (charCode >= 48 && charCode <= 57) {
                  // Leading zeroes are interpreted as octal literals.
                  if (charCode == 48 && ((charCode = source.charCodeAt(Index + 1)), charCode >= 48 && charCode <= 57)) {
                    // Illegal octal literal.
                    abort();
                  }
                  isSigned = false;
                  // Parse the integer component.
                  for (; Index < length && ((charCode = source.charCodeAt(Index)), charCode >= 48 && charCode <= 57); Index++);
                  // Floats cannot contain a leading decimal point; however, this
                  // case is already accounted for by the parser.
                  if (source.charCodeAt(Index) == 46) {
                    position = ++Index;
                    // Parse the decimal component.
                    for (; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
                    if (position == Index) {
                      // Illegal trailing decimal.
                      abort();
                    }
                    Index = position;
                  }
                  // Parse exponents. The `e` denoting the exponent is
                  // case-insensitive.
                  charCode = source.charCodeAt(Index);
                  if (charCode == 101 || charCode == 69) {
                    charCode = source.charCodeAt(++Index);
                    // Skip past the sign following the exponent, if one is
                    // specified.
                    if (charCode == 43 || charCode == 45) {
                      Index++;
                    }
                    // Parse the exponential component.
                    for (position = Index; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
                    if (position == Index) {
                      // Illegal empty exponent.
                      abort();
                    }
                    Index = position;
                  }
                  // Coerce the parsed value to a JavaScript number.
                  return +source.slice(begin, Index);
                }
                // A negative sign may only precede numbers.
                if (isSigned) {
                  abort();
                }
                // `true`, `false`, and `null` literals.
                if (source.slice(Index, Index + 4) == "true") {
                  Index += 4;
                  return true;
                } else if (source.slice(Index, Index + 5) == "false") {
                  Index += 5;
                  return false;
                } else if (source.slice(Index, Index + 4) == "null") {
                  Index += 4;
                  return null;
                }
                // Unrecognized token.
                abort();
            }
          }
          // Return the sentinel `$` character if the parser has reached the end
          // of the source string.
          return "$";
        };

        // Internal: Parses a JSON `value` token.
        var get = function (value) {
          var results, hasMembers;
          if (value == "$") {
            // Unexpected end of input.
            abort();
          }
          if (typeof value == "string") {
            if ((charIndexBuggy ? value.charAt(0) : value[0]) == "@") {
              // Remove the sentinel `@` character.
              return value.slice(1);
            }
            // Parse object and array literals.
            if (value == "[") {
              // Parses a JSON array, returning a new JavaScript array.
              results = [];
              for (;; hasMembers || (hasMembers = true)) {
                value = lex();
                // A closing square bracket marks the end of the array literal.
                if (value == "]") {
                  break;
                }
                // If the array literal contains elements, the current token
                // should be a comma separating the previous element from the
                // next.
                if (hasMembers) {
                  if (value == ",") {
                    value = lex();
                    if (value == "]") {
                      // Unexpected trailing `,` in array literal.
                      abort();
                    }
                  } else {
                    // A `,` must separate each array element.
                    abort();
                  }
                }
                // Elisions and leading commas are not permitted.
                if (value == ",") {
                  abort();
                }
                results.push(get(value));
              }
              return results;
            } else if (value == "{") {
              // Parses a JSON object, returning a new JavaScript object.
              results = {};
              for (;; hasMembers || (hasMembers = true)) {
                value = lex();
                // A closing curly brace marks the end of the object literal.
                if (value == "}") {
                  break;
                }
                // If the object literal contains members, the current token
                // should be a comma separator.
                if (hasMembers) {
                  if (value == ",") {
                    value = lex();
                    if (value == "}") {
                      // Unexpected trailing `,` in object literal.
                      abort();
                    }
                  } else {
                    // A `,` must separate each object member.
                    abort();
                  }
                }
                // Leading commas are not permitted, object property names must be
                // double-quoted strings, and a `:` must separate each property
                // name and value.
                if (value == "," || typeof value != "string" || (charIndexBuggy ? value.charAt(0) : value[0]) != "@" || lex() != ":") {
                  abort();
                }
                results[value.slice(1)] = get(lex());
              }
              return results;
            }
            // Unexpected token encountered.
            abort();
          }
          return value;
        };

        // Internal: Updates a traversed object member.
        var update = function (source, property, callback) {
          var element = walk(source, property, callback);
          if (element === undef) {
            delete source[property];
          } else {
            source[property] = element;
          }
        };

        // Internal: Recursively traverses a parsed JSON object, invoking the
        // `callback` function for each value. This is an implementation of the
        // `Walk(holder, name)` operation defined in ES 5.1 section 15.12.2.
        var walk = function (source, property, callback) {
          var value = source[property], length;
          if (typeof value == "object" && value) {
            // `forEach` can't be used to traverse an array in Opera <= 8.54
            // because its `Object#hasOwnProperty` implementation returns `false`
            // for array indices (e.g., `![1, 2, 3].hasOwnProperty("0")`).
            if (getClass.call(value) == arrayClass) {
              for (length = value.length; length--;) {
                update(value, length, callback);
              }
            } else {
              forEach(value, function (property) {
                update(value, property, callback);
              });
            }
          }
          return callback.call(source, property, value);
        };

        // Public: `JSON.parse`. See ES 5.1 section 15.12.2.
        exports.parse = function (source, callback) {
          var result, value;
          Index = 0;
          Source = "" + source;
          result = get(lex());
          // If a JSON string contains multiple tokens, it is invalid.
          if (lex() != "$") {
            abort();
          }
          // Reset the parser state.
          Index = Source = null;
          return callback && getClass.call(callback) == functionClass ? walk((value = {}, value[""] = result, value), "", callback) : result;
        };
      }
    }

    exports["runInContext"] = runInContext;
    return exports;
  }

  if (freeExports && !isLoader) {
    // Export for CommonJS environments.
    runInContext(root, freeExports);
  } else {
    // Export for web browsers and JavaScript engines.
    var nativeJSON = root.JSON,
        previousJSON = root["JSON3"],
        isRestored = false;

    var JSON3 = runInContext(root, (root["JSON3"] = {
      // Public: Restores the original value of the global `JSON` object and
      // returns a reference to the `JSON3` object.
      "noConflict": function () {
        if (!isRestored) {
          isRestored = true;
          root.JSON = nativeJSON;
          root["JSON3"] = previousJSON;
          nativeJSON = previousJSON = null;
        }
        return JSON3;
      }
    }));

    root.JSON = {
      "parse": JSON3.parse,
      "stringify": JSON3.stringify
    };
  }

  // Export for asynchronous module loaders.
  if (isLoader) {
    !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
      return JSON3;
    }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  }
}).call(this);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(19)(module), __webpack_require__(0)))

/***/ }),
/* 46 */
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ }),
/* 47 */
/***/ (function(module, exports) {


/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/*global Blob,File*/

/**
 * Module requirements
 */

var isArray = __webpack_require__(49);
var isBuf = __webpack_require__(20);

/**
 * Replaces every Buffer | ArrayBuffer in packet with a numbered placeholder.
 * Anything with blobs or files should be fed through removeBlobs before coming
 * here.
 *
 * @param {Object} packet - socket.io event packet
 * @return {Object} with deconstructed packet and list of buffers
 * @api public
 */

exports.deconstructPacket = function(packet){
  var buffers = [];
  var packetData = packet.data;

  function _deconstructPacket(data) {
    if (!data) return data;

    if (isBuf(data)) {
      var placeholder = { _placeholder: true, num: buffers.length };
      buffers.push(data);
      return placeholder;
    } else if (isArray(data)) {
      var newData = new Array(data.length);
      for (var i = 0; i < data.length; i++) {
        newData[i] = _deconstructPacket(data[i]);
      }
      return newData;
    } else if ('object' == typeof data && !(data instanceof Date)) {
      var newData = {};
      for (var key in data) {
        newData[key] = _deconstructPacket(data[key]);
      }
      return newData;
    }
    return data;
  }

  var pack = packet;
  pack.data = _deconstructPacket(packetData);
  pack.attachments = buffers.length; // number of binary 'attachments'
  return {packet: pack, buffers: buffers};
};

/**
 * Reconstructs a binary packet from its placeholder packet and buffers
 *
 * @param {Object} packet - event packet with placeholders
 * @param {Array} buffers - binary buffers to put in placeholder positions
 * @return {Object} reconstructed packet
 * @api public
 */

exports.reconstructPacket = function(packet, buffers) {
  var curPlaceHolder = 0;

  function _reconstructPacket(data) {
    if (data && data._placeholder) {
      var buf = buffers[data.num]; // appropriate buffer (should be natural order anyway)
      return buf;
    } else if (isArray(data)) {
      for (var i = 0; i < data.length; i++) {
        data[i] = _reconstructPacket(data[i]);
      }
      return data;
    } else if (data && 'object' == typeof data) {
      for (var key in data) {
        data[key] = _reconstructPacket(data[key]);
      }
      return data;
    }
    return data;
  }

  packet.data = _reconstructPacket(packet.data);
  packet.attachments = undefined; // no longer useful
  return packet;
};

/**
 * Asynchronously removes Blobs or Files from data via
 * FileReader's readAsArrayBuffer method. Used before encoding
 * data as msgpack. Calls callback with the blobless data.
 *
 * @param {Object} data
 * @param {Function} callback
 * @api private
 */

exports.removeBlobs = function(data, callback) {
  function _removeBlobs(obj, curKey, containingObject) {
    if (!obj) return obj;

    // convert any blob
    if ((global.Blob && obj instanceof Blob) ||
        (global.File && obj instanceof File)) {
      pendingBlobs++;

      // async filereader
      var fileReader = new FileReader();
      fileReader.onload = function() { // this.result == arraybuffer
        if (containingObject) {
          containingObject[curKey] = this.result;
        }
        else {
          bloblessData = this.result;
        }

        // if nothing pending its callback time
        if(! --pendingBlobs) {
          callback(bloblessData);
        }
      };

      fileReader.readAsArrayBuffer(obj); // blob -> arraybuffer
    } else if (isArray(obj)) { // handle array
      for (var i = 0; i < obj.length; i++) {
        _removeBlobs(obj[i], i, obj);
      }
    } else if (obj && 'object' == typeof obj && !isBuf(obj)) { // and object
      for (var key in obj) {
        _removeBlobs(obj[key], key, obj);
      }
    }
  }

  var pendingBlobs = 0;
  var bloblessData = data;
  _removeBlobs(bloblessData);
  if (!pendingBlobs) {
    callback(bloblessData);
  }
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 49 */
/***/ (function(module, exports) {

module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {


module.exports = __webpack_require__(51);


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {


module.exports = __webpack_require__(52);

/**
 * Exports parser
 *
 * @api public
 *
 */
module.exports.parser = __webpack_require__(2);


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * Module dependencies.
 */

var transports = __webpack_require__(22);
var Emitter = __webpack_require__(13);
var debug = __webpack_require__(9)('engine.io-client:socket');
var index = __webpack_require__(26);
var parser = __webpack_require__(2);
var parseuri = __webpack_require__(17);
var parsejson = __webpack_require__(67);
var parseqs = __webpack_require__(14);

/**
 * Module exports.
 */

module.exports = Socket;

/**
 * Socket constructor.
 *
 * @param {String|Object} uri or options
 * @param {Object} options
 * @api public
 */

function Socket (uri, opts) {
  if (!(this instanceof Socket)) return new Socket(uri, opts);

  opts = opts || {};

  if (uri && 'object' === typeof uri) {
    opts = uri;
    uri = null;
  }

  if (uri) {
    uri = parseuri(uri);
    opts.hostname = uri.host;
    opts.secure = uri.protocol === 'https' || uri.protocol === 'wss';
    opts.port = uri.port;
    if (uri.query) opts.query = uri.query;
  } else if (opts.host) {
    opts.hostname = parseuri(opts.host).host;
  }

  this.secure = null != opts.secure ? opts.secure
    : (global.location && 'https:' === location.protocol);

  if (opts.hostname && !opts.port) {
    // if no port is specified manually, use the protocol default
    opts.port = this.secure ? '443' : '80';
  }

  this.agent = opts.agent || false;
  this.hostname = opts.hostname ||
    (global.location ? location.hostname : 'localhost');
  this.port = opts.port || (global.location && location.port
      ? location.port
      : (this.secure ? 443 : 80));
  this.query = opts.query || {};
  if ('string' === typeof this.query) this.query = parseqs.decode(this.query);
  this.upgrade = false !== opts.upgrade;
  this.path = (opts.path || '/engine.io').replace(/\/$/, '') + '/';
  this.forceJSONP = !!opts.forceJSONP;
  this.jsonp = false !== opts.jsonp;
  this.forceBase64 = !!opts.forceBase64;
  this.enablesXDR = !!opts.enablesXDR;
  this.timestampParam = opts.timestampParam || 't';
  this.timestampRequests = opts.timestampRequests;
  this.transports = opts.transports || ['polling', 'websocket'];
  this.readyState = '';
  this.writeBuffer = [];
  this.prevBufferLen = 0;
  this.policyPort = opts.policyPort || 843;
  this.rememberUpgrade = opts.rememberUpgrade || false;
  this.binaryType = null;
  this.onlyBinaryUpgrades = opts.onlyBinaryUpgrades;
  this.perMessageDeflate = false !== opts.perMessageDeflate ? (opts.perMessageDeflate || {}) : false;

  if (true === this.perMessageDeflate) this.perMessageDeflate = {};
  if (this.perMessageDeflate && null == this.perMessageDeflate.threshold) {
    this.perMessageDeflate.threshold = 1024;
  }

  // SSL options for Node.js client
  this.pfx = opts.pfx || null;
  this.key = opts.key || null;
  this.passphrase = opts.passphrase || null;
  this.cert = opts.cert || null;
  this.ca = opts.ca || null;
  this.ciphers = opts.ciphers || null;
  this.rejectUnauthorized = opts.rejectUnauthorized === undefined ? null : opts.rejectUnauthorized;
  this.forceNode = !!opts.forceNode;

  // other options for Node.js client
  var freeGlobal = typeof global === 'object' && global;
  if (freeGlobal.global === freeGlobal) {
    if (opts.extraHeaders && Object.keys(opts.extraHeaders).length > 0) {
      this.extraHeaders = opts.extraHeaders;
    }

    if (opts.localAddress) {
      this.localAddress = opts.localAddress;
    }
  }

  // set on handshake
  this.id = null;
  this.upgrades = null;
  this.pingInterval = null;
  this.pingTimeout = null;

  // set on heartbeat
  this.pingIntervalTimer = null;
  this.pingTimeoutTimer = null;

  this.open();
}

Socket.priorWebsocketSuccess = false;

/**
 * Mix in `Emitter`.
 */

Emitter(Socket.prototype);

/**
 * Protocol version.
 *
 * @api public
 */

Socket.protocol = parser.protocol; // this is an int

/**
 * Expose deps for legacy compatibility
 * and standalone browser access.
 */

Socket.Socket = Socket;
Socket.Transport = __webpack_require__(12);
Socket.transports = __webpack_require__(22);
Socket.parser = __webpack_require__(2);

/**
 * Creates transport of the given type.
 *
 * @param {String} transport name
 * @return {Transport}
 * @api private
 */

Socket.prototype.createTransport = function (name) {
  debug('creating transport "%s"', name);
  var query = clone(this.query);

  // append engine.io protocol identifier
  query.EIO = parser.protocol;

  // transport name
  query.transport = name;

  // session id if we already have one
  if (this.id) query.sid = this.id;

  var transport = new transports[name]({
    agent: this.agent,
    hostname: this.hostname,
    port: this.port,
    secure: this.secure,
    path: this.path,
    query: query,
    forceJSONP: this.forceJSONP,
    jsonp: this.jsonp,
    forceBase64: this.forceBase64,
    enablesXDR: this.enablesXDR,
    timestampRequests: this.timestampRequests,
    timestampParam: this.timestampParam,
    policyPort: this.policyPort,
    socket: this,
    pfx: this.pfx,
    key: this.key,
    passphrase: this.passphrase,
    cert: this.cert,
    ca: this.ca,
    ciphers: this.ciphers,
    rejectUnauthorized: this.rejectUnauthorized,
    perMessageDeflate: this.perMessageDeflate,
    extraHeaders: this.extraHeaders,
    forceNode: this.forceNode,
    localAddress: this.localAddress
  });

  return transport;
};

function clone (obj) {
  var o = {};
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      o[i] = obj[i];
    }
  }
  return o;
}

/**
 * Initializes transport to use and starts probe.
 *
 * @api private
 */
Socket.prototype.open = function () {
  var transport;
  if (this.rememberUpgrade && Socket.priorWebsocketSuccess && this.transports.indexOf('websocket') !== -1) {
    transport = 'websocket';
  } else if (0 === this.transports.length) {
    // Emit error on next tick so it can be listened to
    var self = this;
    setTimeout(function () {
      self.emit('error', 'No transports available');
    }, 0);
    return;
  } else {
    transport = this.transports[0];
  }
  this.readyState = 'opening';

  // Retry with the next transport if the transport is disabled (jsonp: false)
  try {
    transport = this.createTransport(transport);
  } catch (e) {
    this.transports.shift();
    this.open();
    return;
  }

  transport.open();
  this.setTransport(transport);
};

/**
 * Sets the current transport. Disables the existing one (if any).
 *
 * @api private
 */

Socket.prototype.setTransport = function (transport) {
  debug('setting transport %s', transport.name);
  var self = this;

  if (this.transport) {
    debug('clearing existing transport %s', this.transport.name);
    this.transport.removeAllListeners();
  }

  // set up transport
  this.transport = transport;

  // set up transport listeners
  transport
  .on('drain', function () {
    self.onDrain();
  })
  .on('packet', function (packet) {
    self.onPacket(packet);
  })
  .on('error', function (e) {
    self.onError(e);
  })
  .on('close', function () {
    self.onClose('transport close');
  });
};

/**
 * Probes a transport.
 *
 * @param {String} transport name
 * @api private
 */

Socket.prototype.probe = function (name) {
  debug('probing transport "%s"', name);
  var transport = this.createTransport(name, { probe: 1 });
  var failed = false;
  var self = this;

  Socket.priorWebsocketSuccess = false;

  function onTransportOpen () {
    if (self.onlyBinaryUpgrades) {
      var upgradeLosesBinary = !this.supportsBinary && self.transport.supportsBinary;
      failed = failed || upgradeLosesBinary;
    }
    if (failed) return;

    debug('probe transport "%s" opened', name);
    transport.send([{ type: 'ping', data: 'probe' }]);
    transport.once('packet', function (msg) {
      if (failed) return;
      if ('pong' === msg.type && 'probe' === msg.data) {
        debug('probe transport "%s" pong', name);
        self.upgrading = true;
        self.emit('upgrading', transport);
        if (!transport) return;
        Socket.priorWebsocketSuccess = 'websocket' === transport.name;

        debug('pausing current transport "%s"', self.transport.name);
        self.transport.pause(function () {
          if (failed) return;
          if ('closed' === self.readyState) return;
          debug('changing transport and sending upgrade packet');

          cleanup();

          self.setTransport(transport);
          transport.send([{ type: 'upgrade' }]);
          self.emit('upgrade', transport);
          transport = null;
          self.upgrading = false;
          self.flush();
        });
      } else {
        debug('probe transport "%s" failed', name);
        var err = new Error('probe error');
        err.transport = transport.name;
        self.emit('upgradeError', err);
      }
    });
  }

  function freezeTransport () {
    if (failed) return;

    // Any callback called by transport should be ignored since now
    failed = true;

    cleanup();

    transport.close();
    transport = null;
  }

  // Handle any error that happens while probing
  function onerror (err) {
    var error = new Error('probe error: ' + err);
    error.transport = transport.name;

    freezeTransport();

    debug('probe transport "%s" failed because of error: %s', name, err);

    self.emit('upgradeError', error);
  }

  function onTransportClose () {
    onerror('transport closed');
  }

  // When the socket is closed while we're probing
  function onclose () {
    onerror('socket closed');
  }

  // When the socket is upgraded while we're probing
  function onupgrade (to) {
    if (transport && to.name !== transport.name) {
      debug('"%s" works - aborting "%s"', to.name, transport.name);
      freezeTransport();
    }
  }

  // Remove all listeners on the transport and on self
  function cleanup () {
    transport.removeListener('open', onTransportOpen);
    transport.removeListener('error', onerror);
    transport.removeListener('close', onTransportClose);
    self.removeListener('close', onclose);
    self.removeListener('upgrading', onupgrade);
  }

  transport.once('open', onTransportOpen);
  transport.once('error', onerror);
  transport.once('close', onTransportClose);

  this.once('close', onclose);
  this.once('upgrading', onupgrade);

  transport.open();
};

/**
 * Called when connection is deemed open.
 *
 * @api public
 */

Socket.prototype.onOpen = function () {
  debug('socket open');
  this.readyState = 'open';
  Socket.priorWebsocketSuccess = 'websocket' === this.transport.name;
  this.emit('open');
  this.flush();

  // we check for `readyState` in case an `open`
  // listener already closed the socket
  if ('open' === this.readyState && this.upgrade && this.transport.pause) {
    debug('starting upgrade probes');
    for (var i = 0, l = this.upgrades.length; i < l; i++) {
      this.probe(this.upgrades[i]);
    }
  }
};

/**
 * Handles a packet.
 *
 * @api private
 */

Socket.prototype.onPacket = function (packet) {
  if ('opening' === this.readyState || 'open' === this.readyState ||
      'closing' === this.readyState) {
    debug('socket receive: type "%s", data "%s"', packet.type, packet.data);

    this.emit('packet', packet);

    // Socket is live - any packet counts
    this.emit('heartbeat');

    switch (packet.type) {
      case 'open':
        this.onHandshake(parsejson(packet.data));
        break;

      case 'pong':
        this.setPing();
        this.emit('pong');
        break;

      case 'error':
        var err = new Error('server error');
        err.code = packet.data;
        this.onError(err);
        break;

      case 'message':
        this.emit('data', packet.data);
        this.emit('message', packet.data);
        break;
    }
  } else {
    debug('packet received with socket readyState "%s"', this.readyState);
  }
};

/**
 * Called upon handshake completion.
 *
 * @param {Object} handshake obj
 * @api private
 */

Socket.prototype.onHandshake = function (data) {
  this.emit('handshake', data);
  this.id = data.sid;
  this.transport.query.sid = data.sid;
  this.upgrades = this.filterUpgrades(data.upgrades);
  this.pingInterval = data.pingInterval;
  this.pingTimeout = data.pingTimeout;
  this.onOpen();
  // In case open handler closes socket
  if ('closed' === this.readyState) return;
  this.setPing();

  // Prolong liveness of socket on heartbeat
  this.removeListener('heartbeat', this.onHeartbeat);
  this.on('heartbeat', this.onHeartbeat);
};

/**
 * Resets ping timeout.
 *
 * @api private
 */

Socket.prototype.onHeartbeat = function (timeout) {
  clearTimeout(this.pingTimeoutTimer);
  var self = this;
  self.pingTimeoutTimer = setTimeout(function () {
    if ('closed' === self.readyState) return;
    self.onClose('ping timeout');
  }, timeout || (self.pingInterval + self.pingTimeout));
};

/**
 * Pings server every `this.pingInterval` and expects response
 * within `this.pingTimeout` or closes connection.
 *
 * @api private
 */

Socket.prototype.setPing = function () {
  var self = this;
  clearTimeout(self.pingIntervalTimer);
  self.pingIntervalTimer = setTimeout(function () {
    debug('writing ping packet - expecting pong within %sms', self.pingTimeout);
    self.ping();
    self.onHeartbeat(self.pingTimeout);
  }, self.pingInterval);
};

/**
* Sends a ping packet.
*
* @api private
*/

Socket.prototype.ping = function () {
  var self = this;
  this.sendPacket('ping', function () {
    self.emit('ping');
  });
};

/**
 * Called on `drain` event
 *
 * @api private
 */

Socket.prototype.onDrain = function () {
  this.writeBuffer.splice(0, this.prevBufferLen);

  // setting prevBufferLen = 0 is very important
  // for example, when upgrading, upgrade packet is sent over,
  // and a nonzero prevBufferLen could cause problems on `drain`
  this.prevBufferLen = 0;

  if (0 === this.writeBuffer.length) {
    this.emit('drain');
  } else {
    this.flush();
  }
};

/**
 * Flush write buffers.
 *
 * @api private
 */

Socket.prototype.flush = function () {
  if ('closed' !== this.readyState && this.transport.writable &&
    !this.upgrading && this.writeBuffer.length) {
    debug('flushing %d packets in socket', this.writeBuffer.length);
    this.transport.send(this.writeBuffer);
    // keep track of current length of writeBuffer
    // splice writeBuffer and callbackBuffer on `drain`
    this.prevBufferLen = this.writeBuffer.length;
    this.emit('flush');
  }
};

/**
 * Sends a message.
 *
 * @param {String} message.
 * @param {Function} callback function.
 * @param {Object} options.
 * @return {Socket} for chaining.
 * @api public
 */

Socket.prototype.write =
Socket.prototype.send = function (msg, options, fn) {
  this.sendPacket('message', msg, options, fn);
  return this;
};

/**
 * Sends a packet.
 *
 * @param {String} packet type.
 * @param {String} data.
 * @param {Object} options.
 * @param {Function} callback function.
 * @api private
 */

Socket.prototype.sendPacket = function (type, data, options, fn) {
  if ('function' === typeof data) {
    fn = data;
    data = undefined;
  }

  if ('function' === typeof options) {
    fn = options;
    options = null;
  }

  if ('closing' === this.readyState || 'closed' === this.readyState) {
    return;
  }

  options = options || {};
  options.compress = false !== options.compress;

  var packet = {
    type: type,
    data: data,
    options: options
  };
  this.emit('packetCreate', packet);
  this.writeBuffer.push(packet);
  if (fn) this.once('flush', fn);
  this.flush();
};

/**
 * Closes the connection.
 *
 * @api private
 */

Socket.prototype.close = function () {
  if ('opening' === this.readyState || 'open' === this.readyState) {
    this.readyState = 'closing';

    var self = this;

    if (this.writeBuffer.length) {
      this.once('drain', function () {
        if (this.upgrading) {
          waitForUpgrade();
        } else {
          close();
        }
      });
    } else if (this.upgrading) {
      waitForUpgrade();
    } else {
      close();
    }
  }

  function close () {
    self.onClose('forced close');
    debug('socket closing - telling transport to close');
    self.transport.close();
  }

  function cleanupAndClose () {
    self.removeListener('upgrade', cleanupAndClose);
    self.removeListener('upgradeError', cleanupAndClose);
    close();
  }

  function waitForUpgrade () {
    // wait for upgrade to finish since we can't send packets while pausing a transport
    self.once('upgrade', cleanupAndClose);
    self.once('upgradeError', cleanupAndClose);
  }

  return this;
};

/**
 * Called upon transport error
 *
 * @api private
 */

Socket.prototype.onError = function (err) {
  debug('socket error %j', err);
  Socket.priorWebsocketSuccess = false;
  this.emit('error', err);
  this.onClose('transport error', err);
};

/**
 * Called upon transport close.
 *
 * @api private
 */

Socket.prototype.onClose = function (reason, desc) {
  if ('opening' === this.readyState || 'open' === this.readyState || 'closing' === this.readyState) {
    debug('socket close with reason: "%s"', reason);
    var self = this;

    // clear timers
    clearTimeout(this.pingIntervalTimer);
    clearTimeout(this.pingTimeoutTimer);

    // stop event from firing again for transport
    this.transport.removeAllListeners('close');

    // ensure transport won't stay open
    this.transport.close();

    // ignore further transport communication
    this.transport.removeAllListeners();

    // set ready state
    this.readyState = 'closed';

    // clear session id
    this.id = null;

    // emit close event
    this.emit('close', reason, desc);

    // clean buffers after, so users can still
    // grab the buffers on `close` event
    self.writeBuffer = [];
    self.prevBufferLen = 0;
  }
};

/**
 * Filters upgrades, returning only those matching client transports.
 *
 * @param {Array} server upgrades
 * @api private
 *
 */

Socket.prototype.filterUpgrades = function (upgrades) {
  var filteredUpgrades = [];
  for (var i = 0, j = upgrades.length; i < j; i++) {
    if (~index(this.transports, upgrades[i])) filteredUpgrades.push(upgrades[i]);
  }
  return filteredUpgrades;
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 53 */
/***/ (function(module, exports) {


/**
 * Module exports.
 *
 * Logic borrowed from Modernizr:
 *
 *   - https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cors.js
 */

try {
  module.exports = typeof XMLHttpRequest !== 'undefined' &&
    'withCredentials' in new XMLHttpRequest();
} catch (err) {
  // if XMLHttp support is disabled in IE then it will throw
  // when trying to create
  module.exports = false;
}


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * Module requirements.
 */

var XMLHttpRequest = __webpack_require__(11);
var Polling = __webpack_require__(23);
var Emitter = __webpack_require__(13);
var inherit = __webpack_require__(8);
var debug = __webpack_require__(9)('engine.io-client:polling-xhr');

/**
 * Module exports.
 */

module.exports = XHR;
module.exports.Request = Request;

/**
 * Empty function
 */

function empty () {}

/**
 * XHR Polling constructor.
 *
 * @param {Object} opts
 * @api public
 */

function XHR (opts) {
  Polling.call(this, opts);
  this.requestTimeout = opts.requestTimeout;

  if (global.location) {
    var isSSL = 'https:' === location.protocol;
    var port = location.port;

    // some user agents have empty `location.port`
    if (!port) {
      port = isSSL ? 443 : 80;
    }

    this.xd = opts.hostname !== global.location.hostname ||
      port !== opts.port;
    this.xs = opts.secure !== isSSL;
  } else {
    this.extraHeaders = opts.extraHeaders;
  }
}

/**
 * Inherits from Polling.
 */

inherit(XHR, Polling);

/**
 * XHR supports binary
 */

XHR.prototype.supportsBinary = true;

/**
 * Creates a request.
 *
 * @param {String} method
 * @api private
 */

XHR.prototype.request = function (opts) {
  opts = opts || {};
  opts.uri = this.uri();
  opts.xd = this.xd;
  opts.xs = this.xs;
  opts.agent = this.agent || false;
  opts.supportsBinary = this.supportsBinary;
  opts.enablesXDR = this.enablesXDR;

  // SSL options for Node.js client
  opts.pfx = this.pfx;
  opts.key = this.key;
  opts.passphrase = this.passphrase;
  opts.cert = this.cert;
  opts.ca = this.ca;
  opts.ciphers = this.ciphers;
  opts.rejectUnauthorized = this.rejectUnauthorized;
  opts.requestTimeout = this.requestTimeout;

  // other options for Node.js client
  opts.extraHeaders = this.extraHeaders;

  return new Request(opts);
};

/**
 * Sends data.
 *
 * @param {String} data to send.
 * @param {Function} called upon flush.
 * @api private
 */

XHR.prototype.doWrite = function (data, fn) {
  var isBinary = typeof data !== 'string' && data !== undefined;
  var req = this.request({ method: 'POST', data: data, isBinary: isBinary });
  var self = this;
  req.on('success', fn);
  req.on('error', function (err) {
    self.onError('xhr post error', err);
  });
  this.sendXhr = req;
};

/**
 * Starts a poll cycle.
 *
 * @api private
 */

XHR.prototype.doPoll = function () {
  debug('xhr poll');
  var req = this.request();
  var self = this;
  req.on('data', function (data) {
    self.onData(data);
  });
  req.on('error', function (err) {
    self.onError('xhr poll error', err);
  });
  this.pollXhr = req;
};

/**
 * Request constructor
 *
 * @param {Object} options
 * @api public
 */

function Request (opts) {
  this.method = opts.method || 'GET';
  this.uri = opts.uri;
  this.xd = !!opts.xd;
  this.xs = !!opts.xs;
  this.async = false !== opts.async;
  this.data = undefined !== opts.data ? opts.data : null;
  this.agent = opts.agent;
  this.isBinary = opts.isBinary;
  this.supportsBinary = opts.supportsBinary;
  this.enablesXDR = opts.enablesXDR;
  this.requestTimeout = opts.requestTimeout;

  // SSL options for Node.js client
  this.pfx = opts.pfx;
  this.key = opts.key;
  this.passphrase = opts.passphrase;
  this.cert = opts.cert;
  this.ca = opts.ca;
  this.ciphers = opts.ciphers;
  this.rejectUnauthorized = opts.rejectUnauthorized;

  // other options for Node.js client
  this.extraHeaders = opts.extraHeaders;

  this.create();
}

/**
 * Mix in `Emitter`.
 */

Emitter(Request.prototype);

/**
 * Creates the XHR object and sends the request.
 *
 * @api private
 */

Request.prototype.create = function () {
  var opts = { agent: this.agent, xdomain: this.xd, xscheme: this.xs, enablesXDR: this.enablesXDR };

  // SSL options for Node.js client
  opts.pfx = this.pfx;
  opts.key = this.key;
  opts.passphrase = this.passphrase;
  opts.cert = this.cert;
  opts.ca = this.ca;
  opts.ciphers = this.ciphers;
  opts.rejectUnauthorized = this.rejectUnauthorized;

  var xhr = this.xhr = new XMLHttpRequest(opts);
  var self = this;

  try {
    debug('xhr open %s: %s', this.method, this.uri);
    xhr.open(this.method, this.uri, this.async);
    try {
      if (this.extraHeaders) {
        xhr.setDisableHeaderCheck(true);
        for (var i in this.extraHeaders) {
          if (this.extraHeaders.hasOwnProperty(i)) {
            xhr.setRequestHeader(i, this.extraHeaders[i]);
          }
        }
      }
    } catch (e) {}
    if (this.supportsBinary) {
      // This has to be done after open because Firefox is stupid
      // http://stackoverflow.com/questions/13216903/get-binary-data-with-xmlhttprequest-in-a-firefox-extension
      xhr.responseType = 'arraybuffer';
    }

    if ('POST' === this.method) {
      try {
        if (this.isBinary) {
          xhr.setRequestHeader('Content-type', 'application/octet-stream');
        } else {
          xhr.setRequestHeader('Content-type', 'text/plain;charset=UTF-8');
        }
      } catch (e) {}
    }

    try {
      xhr.setRequestHeader('Accept', '*/*');
    } catch (e) {}

    // ie6 check
    if ('withCredentials' in xhr) {
      xhr.withCredentials = true;
    }

    if (this.requestTimeout) {
      xhr.timeout = this.requestTimeout;
    }

    if (this.hasXDR()) {
      xhr.onload = function () {
        self.onLoad();
      };
      xhr.onerror = function () {
        self.onError(xhr.responseText);
      };
    } else {
      xhr.onreadystatechange = function () {
        if (4 !== xhr.readyState) return;
        if (200 === xhr.status || 1223 === xhr.status) {
          self.onLoad();
        } else {
          // make sure the `error` event handler that's user-set
          // does not throw in the same tick and gets caught here
          setTimeout(function () {
            self.onError(xhr.status);
          }, 0);
        }
      };
    }

    debug('xhr data %s', this.data);
    xhr.send(this.data);
  } catch (e) {
    // Need to defer since .create() is called directly fhrom the constructor
    // and thus the 'error' event can only be only bound *after* this exception
    // occurs.  Therefore, also, we cannot throw here at all.
    setTimeout(function () {
      self.onError(e);
    }, 0);
    return;
  }

  if (global.document) {
    this.index = Request.requestsCount++;
    Request.requests[this.index] = this;
  }
};

/**
 * Called upon successful response.
 *
 * @api private
 */

Request.prototype.onSuccess = function () {
  this.emit('success');
  this.cleanup();
};

/**
 * Called if we have data.
 *
 * @api private
 */

Request.prototype.onData = function (data) {
  this.emit('data', data);
  this.onSuccess();
};

/**
 * Called upon error.
 *
 * @api private
 */

Request.prototype.onError = function (err) {
  this.emit('error', err);
  this.cleanup(true);
};

/**
 * Cleans up house.
 *
 * @api private
 */

Request.prototype.cleanup = function (fromError) {
  if ('undefined' === typeof this.xhr || null === this.xhr) {
    return;
  }
  // xmlhttprequest
  if (this.hasXDR()) {
    this.xhr.onload = this.xhr.onerror = empty;
  } else {
    this.xhr.onreadystatechange = empty;
  }

  if (fromError) {
    try {
      this.xhr.abort();
    } catch (e) {}
  }

  if (global.document) {
    delete Request.requests[this.index];
  }

  this.xhr = null;
};

/**
 * Called upon load.
 *
 * @api private
 */

Request.prototype.onLoad = function () {
  var data;
  try {
    var contentType;
    try {
      contentType = this.xhr.getResponseHeader('Content-Type').split(';')[0];
    } catch (e) {}
    if (contentType === 'application/octet-stream') {
      data = this.xhr.response || this.xhr.responseText;
    } else {
      if (!this.supportsBinary) {
        data = this.xhr.responseText;
      } else {
        try {
          data = String.fromCharCode.apply(null, new Uint8Array(this.xhr.response));
        } catch (e) {
          var ui8Arr = new Uint8Array(this.xhr.response);
          var dataArray = [];
          for (var idx = 0, length = ui8Arr.length; idx < length; idx++) {
            dataArray.push(ui8Arr[idx]);
          }

          data = String.fromCharCode.apply(null, dataArray);
        }
      }
    }
  } catch (e) {
    this.onError(e);
  }
  if (null != data) {
    this.onData(data);
  }
};

/**
 * Check if it has XDomainRequest.
 *
 * @api private
 */

Request.prototype.hasXDR = function () {
  return 'undefined' !== typeof global.XDomainRequest && !this.xs && this.enablesXDR;
};

/**
 * Aborts the request.
 *
 * @api public
 */

Request.prototype.abort = function () {
  this.cleanup();
};

/**
 * Aborts pending requests when unloading the window. This is needed to prevent
 * memory leaks (e.g. when using IE) and to ensure that no spurious error is
 * emitted.
 */

Request.requestsCount = 0;
Request.requests = {};

if (global.document) {
  if (global.attachEvent) {
    global.attachEvent('onunload', unloadHandler);
  } else if (global.addEventListener) {
    global.addEventListener('beforeunload', unloadHandler, false);
  }
}

function unloadHandler () {
  for (var i in Request.requests) {
    if (Request.requests.hasOwnProperty(i)) {
      Request.requests[i].abort();
    }
  }
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 55 */
/***/ (function(module, exports) {


/**
 * Gets the keys for an object.
 *
 * @return {Array} keys
 * @api private
 */

module.exports = Object.keys || function keys (obj){
  var arr = [];
  var has = Object.prototype.hasOwnProperty;

  for (var i in obj) {
    if (has.call(obj, i)) {
      arr.push(i);
    }
  }
  return arr;
};


/***/ }),
/* 56 */
/***/ (function(module, exports) {

module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};


/***/ }),
/* 57 */
/***/ (function(module, exports) {

/**
 * An abstraction for slicing an arraybuffer even when
 * ArrayBuffer.prototype.slice is not supported
 *
 * @api public
 */

module.exports = function(arraybuffer, start, end) {
  var bytes = arraybuffer.byteLength;
  start = start || 0;
  end = end || bytes;

  if (arraybuffer.slice) { return arraybuffer.slice(start, end); }

  if (start < 0) { start += bytes; }
  if (end < 0) { end += bytes; }
  if (end > bytes) { end = bytes; }

  if (start >= bytes || start >= end || bytes === 0) {
    return new ArrayBuffer(0);
  }

  var abv = new Uint8Array(arraybuffer);
  var result = new Uint8Array(end - start);
  for (var i = start, ii = 0; i < end; i++, ii++) {
    result[ii] = abv[i];
  }
  return result.buffer;
};


/***/ }),
/* 58 */
/***/ (function(module, exports) {

module.exports = after

function after(count, callback, err_cb) {
    var bail = false
    err_cb = err_cb || noop
    proxy.count = count

    return (count === 0) ? callback() : proxy

    function proxy(err, result) {
        if (proxy.count <= 0) {
            throw new Error('after called too many times')
        }
        --proxy.count

        // after first error, rest are passed to err_cb
        if (err) {
            bail = true
            callback(err)
            // future error callbacks will go to error handler
            callback = err_cb
        } else if (proxy.count === 0 && !bail) {
            callback(null, result)
        }
    }
}

function noop() {}


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module, global) {var __WEBPACK_AMD_DEFINE_RESULT__;/*! https://mths.be/wtf8 v1.0.0 by @mathias */
;(function(root) {

	// Detect free variables `exports`
	var freeExports = typeof exports == 'object' && exports;

	// Detect free variable `module`
	var freeModule = typeof module == 'object' && module &&
		module.exports == freeExports && module;

	// Detect free variable `global`, from Node.js or Browserified code,
	// and use it as `root`
	var freeGlobal = typeof global == 'object' && global;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
		root = freeGlobal;
	}

	/*--------------------------------------------------------------------------*/

	var stringFromCharCode = String.fromCharCode;

	// Taken from https://mths.be/punycode
	function ucs2decode(string) {
		var output = [];
		var counter = 0;
		var length = string.length;
		var value;
		var extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	// Taken from https://mths.be/punycode
	function ucs2encode(array) {
		var length = array.length;
		var index = -1;
		var value;
		var output = '';
		while (++index < length) {
			value = array[index];
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
		}
		return output;
	}

	/*--------------------------------------------------------------------------*/

	function createByte(codePoint, shift) {
		return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
	}

	function encodeCodePoint(codePoint) {
		if ((codePoint & 0xFFFFFF80) == 0) { // 1-byte sequence
			return stringFromCharCode(codePoint);
		}
		var symbol = '';
		if ((codePoint & 0xFFFFF800) == 0) { // 2-byte sequence
			symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0);
		}
		else if ((codePoint & 0xFFFF0000) == 0) { // 3-byte sequence
			symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
			symbol += createByte(codePoint, 6);
		}
		else if ((codePoint & 0xFFE00000) == 0) { // 4-byte sequence
			symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
			symbol += createByte(codePoint, 12);
			symbol += createByte(codePoint, 6);
		}
		symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
		return symbol;
	}

	function wtf8encode(string) {
		var codePoints = ucs2decode(string);
		var length = codePoints.length;
		var index = -1;
		var codePoint;
		var byteString = '';
		while (++index < length) {
			codePoint = codePoints[index];
			byteString += encodeCodePoint(codePoint);
		}
		return byteString;
	}

	/*--------------------------------------------------------------------------*/

	function readContinuationByte() {
		if (byteIndex >= byteCount) {
			throw Error('Invalid byte index');
		}

		var continuationByte = byteArray[byteIndex] & 0xFF;
		byteIndex++;

		if ((continuationByte & 0xC0) == 0x80) {
			return continuationByte & 0x3F;
		}

		// If we end up here, it’s not a continuation byte.
		throw Error('Invalid continuation byte');
	}

	function decodeSymbol() {
		var byte1;
		var byte2;
		var byte3;
		var byte4;
		var codePoint;

		if (byteIndex > byteCount) {
			throw Error('Invalid byte index');
		}

		if (byteIndex == byteCount) {
			return false;
		}

		// Read the first byte.
		byte1 = byteArray[byteIndex] & 0xFF;
		byteIndex++;

		// 1-byte sequence (no continuation bytes)
		if ((byte1 & 0x80) == 0) {
			return byte1;
		}

		// 2-byte sequence
		if ((byte1 & 0xE0) == 0xC0) {
			var byte2 = readContinuationByte();
			codePoint = ((byte1 & 0x1F) << 6) | byte2;
			if (codePoint >= 0x80) {
				return codePoint;
			} else {
				throw Error('Invalid continuation byte');
			}
		}

		// 3-byte sequence (may include unpaired surrogates)
		if ((byte1 & 0xF0) == 0xE0) {
			byte2 = readContinuationByte();
			byte3 = readContinuationByte();
			codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
			if (codePoint >= 0x0800) {
				return codePoint;
			} else {
				throw Error('Invalid continuation byte');
			}
		}

		// 4-byte sequence
		if ((byte1 & 0xF8) == 0xF0) {
			byte2 = readContinuationByte();
			byte3 = readContinuationByte();
			byte4 = readContinuationByte();
			codePoint = ((byte1 & 0x0F) << 0x12) | (byte2 << 0x0C) |
				(byte3 << 0x06) | byte4;
			if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
				return codePoint;
			}
		}

		throw Error('Invalid WTF-8 detected');
	}

	var byteArray;
	var byteCount;
	var byteIndex;
	function wtf8decode(byteString) {
		byteArray = ucs2decode(byteString);
		byteCount = byteArray.length;
		byteIndex = 0;
		var codePoints = [];
		var tmp;
		while ((tmp = decodeSymbol()) !== false) {
			codePoints.push(tmp);
		}
		return ucs2encode(codePoints);
	}

	/*--------------------------------------------------------------------------*/

	var wtf8 = {
		'version': '1.0.0',
		'encode': wtf8encode,
		'decode': wtf8decode
	};

	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		true
	) {
		!(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
			return wtf8;
		}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}	else if (freeExports && !freeExports.nodeType) {
		if (freeModule) { // in Node.js or RingoJS v0.8.0+
			freeModule.exports = wtf8;
		} else { // in Narwhal or RingoJS v0.7.0-
			var object = {};
			var hasOwnProperty = object.hasOwnProperty;
			for (var key in wtf8) {
				hasOwnProperty.call(wtf8, key) && (freeExports[key] = wtf8[key]);
			}
		}
	} else { // in Rhino or a web browser
		root.wtf8 = wtf8;
	}

}(this));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(19)(module), __webpack_require__(0)))

/***/ }),
/* 60 */
/***/ (function(module, exports) {

/*
 * base64-arraybuffer
 * https://github.com/niklasvh/base64-arraybuffer
 *
 * Copyright (c) 2012 Niklas von Hertzen
 * Licensed under the MIT license.
 */
(function(){
  "use strict";

  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  // Use a lookup table to find the index.
  var lookup = new Uint8Array(256);
  for (var i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
  }

  exports.encode = function(arraybuffer) {
    var bytes = new Uint8Array(arraybuffer),
    i, len = bytes.length, base64 = "";

    for (i = 0; i < len; i+=3) {
      base64 += chars[bytes[i] >> 2];
      base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
      base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
      base64 += chars[bytes[i + 2] & 63];
    }

    if ((len % 3) === 2) {
      base64 = base64.substring(0, base64.length - 1) + "=";
    } else if (len % 3 === 1) {
      base64 = base64.substring(0, base64.length - 2) + "==";
    }

    return base64;
  };

  exports.decode =  function(base64) {
    var bufferLength = base64.length * 0.75,
    len = base64.length, i, p = 0,
    encoded1, encoded2, encoded3, encoded4;

    if (base64[base64.length - 1] === "=") {
      bufferLength--;
      if (base64[base64.length - 2] === "=") {
        bufferLength--;
      }
    }

    var arraybuffer = new ArrayBuffer(bufferLength),
    bytes = new Uint8Array(arraybuffer);

    for (i = 0; i < len; i+=4) {
      encoded1 = lookup[base64.charCodeAt(i)];
      encoded2 = lookup[base64.charCodeAt(i+1)];
      encoded3 = lookup[base64.charCodeAt(i+2)];
      encoded4 = lookup[base64.charCodeAt(i+3)];

      bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
      bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
      bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }

    return arraybuffer;
  };
})();


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * Create a blob builder even when vendor prefixes exist
 */

var BlobBuilder = global.BlobBuilder
  || global.WebKitBlobBuilder
  || global.MSBlobBuilder
  || global.MozBlobBuilder;

/**
 * Check if Blob constructor is supported
 */

var blobSupported = (function() {
  try {
    var a = new Blob(['hi']);
    return a.size === 2;
  } catch(e) {
    return false;
  }
})();

/**
 * Check if Blob constructor supports ArrayBufferViews
 * Fails in Safari 6, so we need to map to ArrayBuffers there.
 */

var blobSupportsArrayBufferView = blobSupported && (function() {
  try {
    var b = new Blob([new Uint8Array([1,2])]);
    return b.size === 2;
  } catch(e) {
    return false;
  }
})();

/**
 * Check if BlobBuilder is supported
 */

var blobBuilderSupported = BlobBuilder
  && BlobBuilder.prototype.append
  && BlobBuilder.prototype.getBlob;

/**
 * Helper function that maps ArrayBufferViews to ArrayBuffers
 * Used by BlobBuilder constructor and old browsers that didn't
 * support it in the Blob constructor.
 */

function mapArrayBufferViews(ary) {
  for (var i = 0; i < ary.length; i++) {
    var chunk = ary[i];
    if (chunk.buffer instanceof ArrayBuffer) {
      var buf = chunk.buffer;

      // if this is a subarray, make a copy so we only
      // include the subarray region from the underlying buffer
      if (chunk.byteLength !== buf.byteLength) {
        var copy = new Uint8Array(chunk.byteLength);
        copy.set(new Uint8Array(buf, chunk.byteOffset, chunk.byteLength));
        buf = copy.buffer;
      }

      ary[i] = buf;
    }
  }
}

function BlobBuilderConstructor(ary, options) {
  options = options || {};

  var bb = new BlobBuilder();
  mapArrayBufferViews(ary);

  for (var i = 0; i < ary.length; i++) {
    bb.append(ary[i]);
  }

  return (options.type) ? bb.getBlob(options.type) : bb.getBlob();
};

function BlobConstructor(ary, options) {
  mapArrayBufferViews(ary);
  return new Blob(ary, options || {});
};

module.exports = (function() {
  if (blobSupported) {
    return blobSupportsArrayBufferView ? global.Blob : BlobConstructor;
  } else if (blobBuilderSupported) {
    return BlobBuilderConstructor;
  } else {
    return undefined;
  }
})();

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug.debug = debug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = __webpack_require__(63);

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lowercased letter, i.e. "n".
 */

exports.formatters = {};

/**
 * Previously assigned color.
 */

var prevColor = 0;

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 *
 * @return {Number}
 * @api private
 */

function selectColor() {
  return exports.colors[prevColor++ % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function debug(namespace) {

  // define the `disabled` version
  function disabled() {
  }
  disabled.enabled = false;

  // define the `enabled` version
  function enabled() {

    var self = enabled;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // add the `color` if not set
    if (null == self.useColors) self.useColors = exports.useColors();
    if (null == self.color && self.useColors) self.color = selectColor();

    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %o
      args = ['%o'].concat(args);
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting
    args = exports.formatArgs.apply(self, args);

    var logFn = enabled.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }
  enabled.enabled = true;

  var fn = exports.enabled(namespace) ? enabled : disabled;

  fn.namespace = namespace;

  return fn;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  var split = (namespaces || '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/[\\^$+?.()|[\]{}]/g, '\\$&').replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}


/***/ }),
/* 63 */
/***/ (function(module, exports) {

/**
 * Helpers.
 */

var s = 1000
var m = s * 60
var h = m * 60
var d = h * 24
var y = d * 365.25

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} options
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function (val, options) {
  options = options || {}
  var type = typeof val
  if (type === 'string' && val.length > 0) {
    return parse(val)
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ?
			fmtLong(val) :
			fmtShort(val)
  }
  throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(val))
}

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str)
  if (str.length > 10000) {
    return
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str)
  if (!match) {
    return
  }
  var n = parseFloat(match[1])
  var type = (match[2] || 'ms').toLowerCase()
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y
    case 'days':
    case 'day':
    case 'd':
      return n * d
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n
    default:
      return undefined
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd'
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h'
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm'
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's'
  }
  return ms + 'ms'
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms'
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name
  }
  return Math.ceil(ms / n) + ' ' + name + 's'
}


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {
/**
 * Module requirements.
 */

var Polling = __webpack_require__(23);
var inherit = __webpack_require__(8);

/**
 * Module exports.
 */

module.exports = JSONPPolling;

/**
 * Cached regular expressions.
 */

var rNewline = /\n/g;
var rEscapedNewline = /\\n/g;

/**
 * Global JSONP callbacks.
 */

var callbacks;

/**
 * Noop.
 */

function empty () { }

/**
 * JSONP Polling constructor.
 *
 * @param {Object} opts.
 * @api public
 */

function JSONPPolling (opts) {
  Polling.call(this, opts);

  this.query = this.query || {};

  // define global callbacks array if not present
  // we do this here (lazily) to avoid unneeded global pollution
  if (!callbacks) {
    // we need to consider multiple engines in the same page
    if (!global.___eio) global.___eio = [];
    callbacks = global.___eio;
  }

  // callback identifier
  this.index = callbacks.length;

  // add callback to jsonp global
  var self = this;
  callbacks.push(function (msg) {
    self.onData(msg);
  });

  // append to query string
  this.query.j = this.index;

  // prevent spurious errors from being emitted when the window is unloaded
  if (global.document && global.addEventListener) {
    global.addEventListener('beforeunload', function () {
      if (self.script) self.script.onerror = empty;
    }, false);
  }
}

/**
 * Inherits from Polling.
 */

inherit(JSONPPolling, Polling);

/*
 * JSONP only supports binary as base64 encoded strings
 */

JSONPPolling.prototype.supportsBinary = false;

/**
 * Closes the socket.
 *
 * @api private
 */

JSONPPolling.prototype.doClose = function () {
  if (this.script) {
    this.script.parentNode.removeChild(this.script);
    this.script = null;
  }

  if (this.form) {
    this.form.parentNode.removeChild(this.form);
    this.form = null;
    this.iframe = null;
  }

  Polling.prototype.doClose.call(this);
};

/**
 * Starts a poll cycle.
 *
 * @api private
 */

JSONPPolling.prototype.doPoll = function () {
  var self = this;
  var script = document.createElement('script');

  if (this.script) {
    this.script.parentNode.removeChild(this.script);
    this.script = null;
  }

  script.async = true;
  script.src = this.uri();
  script.onerror = function (e) {
    self.onError('jsonp poll error', e);
  };

  var insertAt = document.getElementsByTagName('script')[0];
  if (insertAt) {
    insertAt.parentNode.insertBefore(script, insertAt);
  } else {
    (document.head || document.body).appendChild(script);
  }
  this.script = script;

  var isUAgecko = 'undefined' !== typeof navigator && /gecko/i.test(navigator.userAgent);

  if (isUAgecko) {
    setTimeout(function () {
      var iframe = document.createElement('iframe');
      document.body.appendChild(iframe);
      document.body.removeChild(iframe);
    }, 100);
  }
};

/**
 * Writes with a hidden iframe.
 *
 * @param {String} data to send
 * @param {Function} called upon flush.
 * @api private
 */

JSONPPolling.prototype.doWrite = function (data, fn) {
  var self = this;

  if (!this.form) {
    var form = document.createElement('form');
    var area = document.createElement('textarea');
    var id = this.iframeId = 'eio_iframe_' + this.index;
    var iframe;

    form.className = 'socketio';
    form.style.position = 'absolute';
    form.style.top = '-1000px';
    form.style.left = '-1000px';
    form.target = id;
    form.method = 'POST';
    form.setAttribute('accept-charset', 'utf-8');
    area.name = 'd';
    form.appendChild(area);
    document.body.appendChild(form);

    this.form = form;
    this.area = area;
  }

  this.form.action = this.uri();

  function complete () {
    initIframe();
    fn();
  }

  function initIframe () {
    if (self.iframe) {
      try {
        self.form.removeChild(self.iframe);
      } catch (e) {
        self.onError('jsonp polling iframe removal error', e);
      }
    }

    try {
      // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
      var html = '<iframe src="javascript:0" name="' + self.iframeId + '">';
      iframe = document.createElement(html);
    } catch (e) {
      iframe = document.createElement('iframe');
      iframe.name = self.iframeId;
      iframe.src = 'javascript:0';
    }

    iframe.id = self.iframeId;

    self.form.appendChild(iframe);
    self.iframe = iframe;
  }

  initIframe();

  // escape \n to prevent it from being converted into \r\n by some UAs
  // double escaping is required for escaped new lines because unescaping of new lines can be done safely on server-side
  data = data.replace(rEscapedNewline, '\\\n');
  this.area.value = data.replace(rNewline, '\\n');

  try {
    this.form.submit();
  } catch (e) {}

  if (this.iframe.attachEvent) {
    this.iframe.onreadystatechange = function () {
      if (self.iframe.readyState === 'complete') {
        complete();
      }
    };
  } else {
    this.iframe.onload = complete;
  }
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * Module dependencies.
 */

var Transport = __webpack_require__(12);
var parser = __webpack_require__(2);
var parseqs = __webpack_require__(14);
var inherit = __webpack_require__(8);
var yeast = __webpack_require__(25);
var debug = __webpack_require__(9)('engine.io-client:websocket');
var BrowserWebSocket = global.WebSocket || global.MozWebSocket;
var NodeWebSocket;
if (typeof window === 'undefined') {
  try {
    NodeWebSocket = __webpack_require__(66);
  } catch (e) { }
}

/**
 * Get either the `WebSocket` or `MozWebSocket` globals
 * in the browser or try to resolve WebSocket-compatible
 * interface exposed by `ws` for Node-like environment.
 */

var WebSocket = BrowserWebSocket;
if (!WebSocket && typeof window === 'undefined') {
  WebSocket = NodeWebSocket;
}

/**
 * Module exports.
 */

module.exports = WS;

/**
 * WebSocket transport constructor.
 *
 * @api {Object} connection options
 * @api public
 */

function WS (opts) {
  var forceBase64 = (opts && opts.forceBase64);
  if (forceBase64) {
    this.supportsBinary = false;
  }
  this.perMessageDeflate = opts.perMessageDeflate;
  this.usingBrowserWebSocket = BrowserWebSocket && !opts.forceNode;
  if (!this.usingBrowserWebSocket) {
    WebSocket = NodeWebSocket;
  }
  Transport.call(this, opts);
}

/**
 * Inherits from Transport.
 */

inherit(WS, Transport);

/**
 * Transport name.
 *
 * @api public
 */

WS.prototype.name = 'websocket';

/*
 * WebSockets support binary
 */

WS.prototype.supportsBinary = true;

/**
 * Opens socket.
 *
 * @api private
 */

WS.prototype.doOpen = function () {
  if (!this.check()) {
    // let probe timeout
    return;
  }

  var uri = this.uri();
  var protocols = void (0);
  var opts = {
    agent: this.agent,
    perMessageDeflate: this.perMessageDeflate
  };

  // SSL options for Node.js client
  opts.pfx = this.pfx;
  opts.key = this.key;
  opts.passphrase = this.passphrase;
  opts.cert = this.cert;
  opts.ca = this.ca;
  opts.ciphers = this.ciphers;
  opts.rejectUnauthorized = this.rejectUnauthorized;
  if (this.extraHeaders) {
    opts.headers = this.extraHeaders;
  }
  if (this.localAddress) {
    opts.localAddress = this.localAddress;
  }

  try {
    this.ws = this.usingBrowserWebSocket ? new WebSocket(uri) : new WebSocket(uri, protocols, opts);
  } catch (err) {
    return this.emit('error', err);
  }

  if (this.ws.binaryType === undefined) {
    this.supportsBinary = false;
  }

  if (this.ws.supports && this.ws.supports.binary) {
    this.supportsBinary = true;
    this.ws.binaryType = 'nodebuffer';
  } else {
    this.ws.binaryType = 'arraybuffer';
  }

  this.addEventListeners();
};

/**
 * Adds event listeners to the socket
 *
 * @api private
 */

WS.prototype.addEventListeners = function () {
  var self = this;

  this.ws.onopen = function () {
    self.onOpen();
  };
  this.ws.onclose = function () {
    self.onClose();
  };
  this.ws.onmessage = function (ev) {
    self.onData(ev.data);
  };
  this.ws.onerror = function (e) {
    self.onError('websocket error', e);
  };
};

/**
 * Writes data to socket.
 *
 * @param {Array} array of packets.
 * @api private
 */

WS.prototype.write = function (packets) {
  var self = this;
  this.writable = false;

  // encodePacket efficient as it uses WS framing
  // no need for encodePayload
  var total = packets.length;
  for (var i = 0, l = total; i < l; i++) {
    (function (packet) {
      parser.encodePacket(packet, self.supportsBinary, function (data) {
        if (!self.usingBrowserWebSocket) {
          // always create a new object (GH-437)
          var opts = {};
          if (packet.options) {
            opts.compress = packet.options.compress;
          }

          if (self.perMessageDeflate) {
            var len = 'string' === typeof data ? global.Buffer.byteLength(data) : data.length;
            if (len < self.perMessageDeflate.threshold) {
              opts.compress = false;
            }
          }
        }

        // Sometimes the websocket has already been closed but the browser didn't
        // have a chance of informing us about it yet, in that case send will
        // throw an error
        try {
          if (self.usingBrowserWebSocket) {
            // TypeError is thrown when passing the second argument on Safari
            self.ws.send(data);
          } else {
            self.ws.send(data, opts);
          }
        } catch (e) {
          debug('websocket closed before onclose event');
        }

        --total || done();
      });
    })(packets[i]);
  }

  function done () {
    self.emit('flush');

    // fake drain
    // defer to next tick to allow Socket to clear writeBuffer
    setTimeout(function () {
      self.writable = true;
      self.emit('drain');
    }, 0);
  }
};

/**
 * Called upon close
 *
 * @api private
 */

WS.prototype.onClose = function () {
  Transport.prototype.onClose.call(this);
};

/**
 * Closes socket.
 *
 * @api private
 */

WS.prototype.doClose = function () {
  if (typeof this.ws !== 'undefined') {
    this.ws.close();
  }
};

/**
 * Generates uri for connection.
 *
 * @api private
 */

WS.prototype.uri = function () {
  var query = this.query || {};
  var schema = this.secure ? 'wss' : 'ws';
  var port = '';

  // avoid port if default for schema
  if (this.port && (('wss' === schema && Number(this.port) !== 443) ||
    ('ws' === schema && Number(this.port) !== 80))) {
    port = ':' + this.port;
  }

  // append timestamp to URI
  if (this.timestampRequests) {
    query[this.timestampParam] = yeast();
  }

  // communicate binary support capabilities
  if (!this.supportsBinary) {
    query.b64 = 1;
  }

  query = parseqs.encode(query);

  // prepend ? to query
  if (query.length) {
    query = '?' + query;
  }

  var ipv6 = this.hostname.indexOf(':') !== -1;
  return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
};

/**
 * Feature detection for WebSocket.
 *
 * @return {Boolean} whether this transport is available.
 * @api public
 */

WS.prototype.check = function () {
  return !!WebSocket && !('__initialize' in WebSocket && this.name === WS.prototype.name);
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 66 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * JSON parse.
 *
 * @see Based on jQuery#parseJSON (MIT) and JSON2
 * @api private
 */

var rvalidchars = /^[\],:{}\s]*$/;
var rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
var rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
var rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g;
var rtrimLeft = /^\s+/;
var rtrimRight = /\s+$/;

module.exports = function parsejson(data) {
  if ('string' != typeof data || !data) {
    return null;
  }

  data = data.replace(rtrimLeft, '').replace(rtrimRight, '');

  // Attempt to parse using the native JSON parser first
  if (global.JSON && JSON.parse) {
    return JSON.parse(data);
  }

  if (rvalidchars.test(data.replace(rvalidescape, '@')
      .replace(rvalidtokens, ']')
      .replace(rvalidbraces, ''))) {
    return (new Function('return ' + data))();
  }
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 68 */
/***/ (function(module, exports) {

module.exports = toArray

function toArray(list, index) {
    var array = []

    index = index || 0

    for (var i = index || 0; i < list.length; i++) {
        array[i - index] = list[i]
    }

    return array
}


/***/ }),
/* 69 */
/***/ (function(module, exports) {


/**
 * Expose `Backoff`.
 */

module.exports = Backoff;

/**
 * Initialize backoff timer with `opts`.
 *
 * - `min` initial timeout in milliseconds [100]
 * - `max` max timeout [10000]
 * - `jitter` [0]
 * - `factor` [2]
 *
 * @param {Object} opts
 * @api public
 */

function Backoff(opts) {
  opts = opts || {};
  this.ms = opts.min || 100;
  this.max = opts.max || 10000;
  this.factor = opts.factor || 2;
  this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
  this.attempts = 0;
}

/**
 * Return the backoff duration.
 *
 * @return {Number}
 * @api public
 */

Backoff.prototype.duration = function(){
  var ms = this.ms * Math.pow(this.factor, this.attempts++);
  if (this.jitter) {
    var rand =  Math.random();
    var deviation = Math.floor(rand * this.jitter * ms);
    ms = (Math.floor(rand * 10) & 1) == 0  ? ms - deviation : ms + deviation;
  }
  return Math.min(ms, this.max) | 0;
};

/**
 * Reset the number of attempts.
 *
 * @api public
 */

Backoff.prototype.reset = function(){
  this.attempts = 0;
};

/**
 * Set the minimum duration
 *
 * @api public
 */

Backoff.prototype.setMin = function(min){
  this.ms = min;
};

/**
 * Set the maximum duration
 *
 * @api public
 */

Backoff.prototype.setMax = function(max){
  this.max = max;
};

/**
 * Set the jitter
 *
 * @api public
 */

Backoff.prototype.setJitter = function(jitter){
  this.jitter = jitter;
};



/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
    return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _eventemitter = __webpack_require__(5);

var _eventemitter2 = _interopRequireDefault(_eventemitter);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var SIXTY_PER_SEC = 1000 / 60;
var LOOP_SLOW_THRESH = 0.3;
var LOOP_SLOW_COUNT = 10;

/**
 * Scheduler class
 *
 */

var Scheduler = function () {

    /**
     * schedule a function to be called
     *
     * @param {Object} options the options
     * @param {Function} options.tick the function to be called
     * @param {Number} options.period number of milliseconds between each invocation, not including the function's execution time
     * @param {Number} options.delay number of milliseconds to add when delaying or hurrying the execution
     */
    function Scheduler(options) {
        _classCallCheck(this, Scheduler);

        this.options = Object.assign({
            tick: null,
            period: SIXTY_PER_SEC,
            delay: SIXTY_PER_SEC / 3
        }, options);
        this.nextExecTime = null;
        this.requestedDelay = 0;
        this.delayCounter = 0;

        // build an event emitter
        var eventEmitter = new _eventemitter2.default();
        this.on = eventEmitter.on;
        this.once = eventEmitter.once;
        this.removeListener = eventEmitter.removeListener;
        this.emit = eventEmitter.emit;
    }

    // in same cases, setTimeout is ignored by the browser,
    // this is known to happen during the first 100ms of a touch event
    // on android chrome.  Double-check the game loop using requestAnimationFrame


    _createClass(Scheduler, [{
        key: 'nextTickChecker',
        value: function nextTickChecker() {
            var currentTime = new Date().getTime();
            if (currentTime > this.nextExecTime) {
                this.delayCounter++;
                this.callTick();
                this.nextExecTime = currentTime + this.options.stepPeriod;
            }
            window.requestAnimationFrame(this.nextTickChecker.bind(this));
        }
    }, {
        key: 'nextTick',
        value: function nextTick() {
            var stepStartTime = new Date().getTime();
            if (stepStartTime > this.nextExecTime + this.options.period * LOOP_SLOW_THRESH) {
                this.delayCounter++;
            } else this.delayCounter = 0;

            this.callTick();
            this.nextExecTime = stepStartTime + this.options.period + this.requestedDelay;
            this.requestedDelay = 0;
            setTimeout(this.nextTick.bind(this), this.nextExecTime - new Date().getTime());
        }
    }, {
        key: 'callTick',
        value: function callTick() {
            if (this.delayCounter >= LOOP_SLOW_COUNT) {
                this.emit('loopRunningSlow');
                this.delayCounter = 0;
            }
            this.options.tick();
        }

        /**
         * start the schedule
         * @return {Scheduler} returns this scheduler instance
         */

    }, {
        key: 'start',
        value: function start() {
            setTimeout(this.nextTick.bind(this));
            if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && typeof window.requestAnimationFrame === 'function') window.requestAnimationFrame(this.nextTickChecker.bind(this));
            return this;
        }

        /**
         * delay next execution
         */

    }, {
        key: 'delayTick',
        value: function delayTick() {
            this.requestedDelay += this.options.delay;
        }

        /**
         * hurry the next execution
         */

    }, {
        key: 'hurryTick',
        value: function hurryTick() {
            this.requestedDelay -= this.options.delay;
        }
    }]);

    return Scheduler;
}();

exports.default = Scheduler;

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _InterpolateStrategy = __webpack_require__(72);

var _InterpolateStrategy2 = _interopRequireDefault(_InterpolateStrategy);

var _ExtrapolateStrategy = __webpack_require__(73);

var _ExtrapolateStrategy2 = _interopRequireDefault(_ExtrapolateStrategy);

var _FrameSyncStrategy = __webpack_require__(74);

var _FrameSyncStrategy2 = _interopRequireDefault(_FrameSyncStrategy);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var strategies = {
    extrapolate: _ExtrapolateStrategy2.default,
    interpolate: _InterpolateStrategy2.default,
    frameSync: _FrameSyncStrategy2.default
};

var Synchronizer =
// create a synchronizer instance
function Synchronizer(clientEngine, options) {
    _classCallCheck(this, Synchronizer);

    this.clientEngine = clientEngine;
    this.options = options || {};
    if (!strategies.hasOwnProperty(this.options.sync)) {
        throw new Error('ERROR: unknown synchronzation strategy ' + this.options.sync);
    }
    this.syncStrategy = new strategies[this.options.sync](this.clientEngine, this.options);
};

exports.default = Synchronizer;

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);if (parent === null) {
            return undefined;
        } else {
            return get(parent, property, receiver);
        }
    } else if ("value" in desc) {
        return desc.value;
    } else {
        var getter = desc.get;if (getter === undefined) {
            return undefined;
        }return getter.call(receiver);
    }
};

var _SyncStrategy2 = __webpack_require__(15);

var _SyncStrategy3 = _interopRequireDefault(_SyncStrategy2);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var defaults = {
    syncsBufferLength: 6,
    clientStepHold: 6,
    reflect: false
};

var InterpolateStrategy = function (_SyncStrategy) {
    _inherits(InterpolateStrategy, _SyncStrategy);

    function InterpolateStrategy(clientEngine, inputOptions) {
        _classCallCheck(this, InterpolateStrategy);

        var options = Object.assign({}, defaults, inputOptions);

        var _this = _possibleConstructorReturn(this, (InterpolateStrategy.__proto__ || Object.getPrototypeOf(InterpolateStrategy)).call(this, clientEngine, options));

        _this.syncsBuffer = []; // buffer for server world updates
        _this.gameEngine = _this.clientEngine.gameEngine;
        _this.gameEngine.passive = true; // client side engine ignores inputs
        _this.gameEngine.on('client__postStep', _this.interpolate.bind(_this));
        return _this;
    }

    _createClass(InterpolateStrategy, [{
        key: 'collectSync',
        value: function collectSync(e) {

            _get(InterpolateStrategy.prototype.__proto__ || Object.getPrototypeOf(InterpolateStrategy.prototype), 'collectSync', this).call(this, e);

            if (!this.lastSync) return;

            this.syncsBuffer.push(this.lastSync);
            if (this.syncsBuffer.length >= this.options.syncsBufferLength) {
                this.syncsBuffer.shift();
            }
        }

        // add an object to our world

    }, {
        key: 'addNewObject',
        value: function addNewObject(objId, newObj, stepCount) {

            var curObj = new newObj.constructor(this.gameEngine, {
                id: objId
            });
            curObj.syncTo(newObj);
            curObj.passive = true;
            this.gameEngine.addObjectToWorld(curObj);
            console.log('adding new object ' + curObj);

            if (stepCount) {
                curObj.lastUpdateStep = stepCount;
            }

            return curObj;
        }

        /**
         * Perform client-side interpolation.
         */

    }, {
        key: 'interpolate',
        value: function interpolate() {
            var _this2 = this;

            // get the step we will perform
            var world = this.gameEngine.world;
            var stepToPlay = world.stepCount - this.options.clientStepHold;
            var nextSync = null;

            // get the closest sync to our next step
            for (var x = 0; x < this.syncsBuffer.length; x++) {
                if (this.syncsBuffer[x].stepCount >= stepToPlay) {
                    nextSync = this.syncsBuffer[x];
                    break;
                }
            }

            // we requires a sync before we proceed
            if (!nextSync) {
                this.gameEngine.trace.debug(function () {
                    return 'interpolate lacks future sync - requesting step skip';
                });
                this.clientEngine.skipOneStep = true;
                return;
            }

            this.gameEngine.trace.debug(function () {
                return 'interpolate past step [' + stepToPlay + '] using sync from step ' + nextSync.stepCount;
            });

            // create objects which are created at this step
            var stepEvents = nextSync.syncSteps[stepToPlay];
            if (stepEvents && stepEvents.objectCreate) {
                stepEvents.objectCreate.forEach(function (ev) {
                    _this2.addNewObject(ev.objectInstance.id, ev.objectInstance, stepToPlay);
                });
            }

            // create objects for events that imply a create-object
            if (stepEvents && stepEvents.objectUpdate) {
                stepEvents.objectUpdate.forEach(function (ev) {
                    if (!world.objects[ev.objectInstance.id]) _this2.addNewObject(ev.objectInstance.id, ev.objectInstance, stepToPlay);
                });
            }

            // remove objects which are removed at this step
            if (stepEvents && stepEvents.objectDestroy) {
                stepEvents.objectDestroy.forEach(function (ev) {
                    if (world.objects[ev.objectInstance.id]) _this2.gameEngine.removeObjectFromWorld(ev.objectInstance.id);
                });
            }

            // interpolate values for all objects in this world
            world.forEachObject(function (id, ob) {

                var nextObj = null;
                var nextStep = null;

                // if we already handled this object, continue
                // TODO maybe call it lastUpdatedStep
                if (ob.lastUpdateStep === stepToPlay) return;

                // get the nearest object we can interpolate to
                if (!nextSync.syncObjects.hasOwnProperty(id)) return;

                nextSync.syncObjects[id].forEach(function (ev) {
                    if (!nextObj && ev.stepCount >= stepToPlay) {
                        nextObj = ev.objectInstance;
                        nextStep = ev.stepCount;
                    }
                });

                if (nextObj) {
                    var playPercentage = 1 / (nextStep + 1 - stepToPlay);
                    if (_this2.options.reflect) playPercentage = 1.0;
                    _this2.interpolateOneObject(ob, nextObj, id, playPercentage);
                }
            });

            // destroy objects
            world.forEachObject(function (id, ob) {
                var objEvents = nextSync.syncObjects[id];
                if (!objEvents || Number(id) >= _this2.gameEngine.options.clientIDSpace) return;

                objEvents.forEach(function (e) {
                    if (e.eventName === 'objectDestroy') _this2.gameEngine.removeObjectFromWorld(id);
                });
            });
        }

        // TODO: prevObj is now just curObj
        //       and playPercentage is 1/(nextObj.step - now)
        //       so the code below should be easy to simplify now

    }, {
        key: 'interpolateOneObject',
        value: function interpolateOneObject(prevObj, nextObj, objId, playPercentage) {

            // update position and orientation with interpolation
            var curObj = this.gameEngine.world.objects[objId];
            if (typeof curObj.interpolate === 'function') {
                this.gameEngine.trace.trace(function () {
                    return 'object ' + objId + ' before ' + playPercentage + ' interpolate: ' + curObj.toString();
                });
                curObj.interpolate(nextObj, playPercentage, this.gameEngine.worldSettings);
                this.gameEngine.trace.trace(function () {
                    return 'object ' + objId + ' after interpolate: ' + curObj.toString();
                });
            }
        }
    }]);

    return InterpolateStrategy;
}(_SyncStrategy3.default);

exports.default = InterpolateStrategy;

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
    return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _SyncStrategy2 = __webpack_require__(15);

var _SyncStrategy3 = _interopRequireDefault(_SyncStrategy2);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof2(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof2(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var defaults = {
    syncsBufferLength: 5,
    maxReEnactSteps: 60, // maximum number of steps to re-enact
    RTTEstimate: 2, // estimate the RTT as two steps (for updateRate=6, that's 200ms)
    extrapolate: 2, // player performs method "X" which means extrapolate to match server time. that 100 + (0..100)
    localObjBending: 0.1, // amount of bending towards position of sync object
    remoteObjBending: 0.6, // amount of bending towards position of sync object
    bendingIncrements: 10 // the bending should be applied increments (how many steps for entire bend)
};

var ExtrapolateStrategy = function (_SyncStrategy) {
    _inherits(ExtrapolateStrategy, _SyncStrategy);

    function ExtrapolateStrategy(clientEngine, inputOptions) {
        _classCallCheck(this, ExtrapolateStrategy);

        var options = Object.assign({}, defaults, inputOptions);

        var _this = _possibleConstructorReturn(this, (ExtrapolateStrategy.__proto__ || Object.getPrototypeOf(ExtrapolateStrategy)).call(this, clientEngine, options));

        _this.lastSync = null;
        _this.needFirstSync = true;
        _this.recentInputs = {};
        _this.gameEngine = _this.clientEngine.gameEngine;
        _this.gameEngine.on('client__postStep', _this.extrapolate.bind(_this));
        _this.gameEngine.on('client__processInput', _this.clientInputSave.bind(_this));
        return _this;
    }

    // keep a buffer of inputs so that we can replay them on extrapolation


    _createClass(ExtrapolateStrategy, [{
        key: 'clientInputSave',
        value: function clientInputSave(inputData) {

            // if no inputs have been stored for this step, create an array
            if (!this.recentInputs[inputData.step]) {
                this.recentInputs[inputData.step] = [];
            }
            this.recentInputs[inputData.step].push(inputData);
        }

        // add an object to our world

    }, {
        key: 'addNewObject',
        value: function addNewObject(objId, newObj, options) {

            var curObj = new newObj.constructor(this.gameEngine, {
                id: objId
            });
            curObj.syncTo(newObj);
            this.gameEngine.addObjectToWorld(curObj);
            console.log('adding new object ' + curObj);

            return curObj;
        }

        // clean up the input buffer

    }, {
        key: 'cleanRecentInputs',
        value: function cleanRecentInputs() {
            var firstReplayStep = this.gameEngine.world.stepCount - this.options.extrapolate;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.keys(this.recentInputs)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var input = _step.value;

                    if (this.recentInputs[input].step < firstReplayStep) {
                        delete this.recentInputs[input];
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }

        // apply a new sync

    }, {
        key: 'applySync',
        value: function applySync(sync) {
            var _this2 = this;

            this.gameEngine.trace.debug(function () {
                return 'extrapolate applying sync';
            });

            //
            //    scan all the objects in the sync
            //
            // 1. if the object has a local shadow, adopt the server object,
            //    and destroy the shadow
            //
            // 2. if the object exists locally, sync to the server object,
            //    later we will re-enact the missing steps and then bend to
            //    the current position
            //
            // 3. if the object is new, just create it
            //
            this.needFirstSync = false;
            var world = this.gameEngine.world;
            var serverStep = sync.stepCount;
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                var _loop = function _loop() {
                    var ids = _step2.value;

                    // TODO: we are currently taking only the first event out of
                    // the events that may have arrived for this object
                    var ev = sync.syncObjects[ids][0];
                    var curObj = world.objects[ev.objectInstance.id];

                    var localShadowObj = _this2.gameEngine.findLocalShadow(ev.objectInstance);
                    if (localShadowObj) {
                        // case 1: this object has a local shadow object on the client
                        _this2.gameEngine.trace.debug(function () {
                            return 'object ' + ev.objectInstance.id + ' replacing local shadow ' + localShadowObj.id;
                        });

                        if (!world.objects.hasOwnProperty(ev.objectInstance.id)) {
                            var newObj = _this2.addNewObject(ev.objectInstance.id, ev.objectInstance, { visible: false });
                            newObj.saveState(localShadowObj);
                        }
                        _this2.gameEngine.removeObjectFromWorld(localShadowObj.id);
                    } else if (curObj) {

                        // case 2: this object already exists locally
                        _this2.gameEngine.trace.trace(function () {
                            return 'object before syncTo: ' + curObj.toString();
                        });
                        curObj.saveState();
                        curObj.syncTo(ev.objectInstance);
                        _this2.gameEngine.trace.trace(function () {
                            return 'object after syncTo: ' + curObj.toString() + ' synced to step[' + ev.stepCount + ']';
                        });
                    } else {

                        // case 3: object does not exist.  create it now
                        _this2.addNewObject(ev.objectInstance.id, ev.objectInstance);
                    }
                };

                for (var _iterator2 = Object.keys(sync.syncObjects)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    _loop();
                }

                //
                // reenact the steps that we want to extrapolate forwards
                //
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            this.cleanRecentInputs();
            this.gameEngine.trace.debug(function () {
                return 'extrapolate re-enacting steps from [' + serverStep + '] to [' + world.stepCount + ']';
            });
            if (serverStep < world.stepCount - this.options.maxReEnactSteps) {
                serverStep = world.stepCount - this.options.maxReEnactSteps;
                this.gameEngine.trace.info(function () {
                    return 'too many steps to re-enact.  Starting from [' + serverStep + '] to [' + world.stepCount + ']';
                });
            }

            var clientStep = world.stepCount;
            for (world.stepCount = serverStep; world.stepCount < clientStep;) {
                if (this.recentInputs[world.stepCount]) {
                    this.recentInputs[world.stepCount].forEach(function (inputData) {

                        // only movement inputs are re-enacted
                        if (!inputData.inputOptions || !inputData.inputOptions.movement) return;

                        _this2.gameEngine.trace.trace(function () {
                            return 'extrapolate re-enacting movement input[' + inputData.messageIndex + ']: ' + inputData.input;
                        });
                        _this2.gameEngine.processInput(inputData, _this2.gameEngine.playerId);
                    });
                }

                // run the game engine step in "reenact" mode
                this.gameEngine.step(true);
            }

            //
            // bend back to original state
            //
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                var _loop2 = function _loop2() {
                    var objId = _step3.value;

                    // shadow objects are not bent
                    if (objId >= _this2.gameEngine.options.clientIDSpace) return 'continue';

                    // TODO: using == instead of === because of string/number mismatch
                    //       These values should always be strings (which contain a number)
                    //       Reminder: the reason we use a string is that these
                    //       values are sometimes used as object keys
                    var obj = world.objects[objId];
                    var isLocal = obj.playerId == _this2.gameEngine.playerId; // eslint-disable-line eqeqeq
                    var bending = isLocal ? _this2.options.localObjBending : _this2.options.remoteObjBending;
                    obj.bendToCurrentState(bending, _this2.gameEngine.worldSettings, isLocal, _this2.options.bendingIncrements);
                    if (typeof obj.refreshRenderObject === 'function') obj.refreshRenderObject();
                    _this2.gameEngine.trace.trace(function () {
                        return 'object[' + objId + '] ' + obj.bendingToString();
                    });
                };

                for (var _iterator3 = Object.keys(world.objects)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var _ret2 = _loop2();

                    if (_ret2 === 'continue') continue;
                }

                // trace object state after sync
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                var _loop3 = function _loop3() {
                    var objId = _step4.value;

                    _this2.gameEngine.trace.trace(function () {
                        return 'object after extrapolate replay: ' + world.objects[objId].toString();
                    });
                };

                for (var _iterator4 = Object.keys(world.objects)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    _loop3();
                }

                // destroy objects
                // TODO: use world.forEachObject((id, ob) => {});
                // TODO: identical code is in InterpolateStrategy
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }

            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                var _loop4 = function _loop4() {
                    var objId = _step5.value;

                    var objEvents = sync.syncObjects[objId];

                    // if this was a full sync, and we did not get a corresponding object,
                    // remove the local object
                    if (sync.fullUpdate && !objEvents && objId < _this2.gameEngine.options.clientIDSpace) {
                        _this2.gameEngine.removeObjectFromWorld(objId);
                        return 'continue';
                    }

                    if (!objEvents || objId >= _this2.gameEngine.options.clientIDSpace) return 'continue';

                    // if we got an objectDestroy event, destroy the object
                    objEvents.forEach(function (e) {
                        if (e.eventName === 'objectDestroy') _this2.gameEngine.removeObjectFromWorld(objId);
                    });
                };

                for (var _iterator5 = Object.keys(world.objects)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var _ret4 = _loop4();

                    if (_ret4 === 'continue') continue;
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }
        }

        // Perform client-side extrapolation.

    }, {
        key: 'extrapolate',
        value: function extrapolate(stepDesc) {
            var _this3 = this;

            // apply incremental bending
            this.gameEngine.world.forEachObject(function (id, o) {
                if (typeof o.applyIncrementalBending === 'function') {
                    o.applyIncrementalBending(stepDesc);
                    o.refreshToPhysics();
                }
            });

            // apply all pending required syncs

            var _loop5 = function _loop5() {

                var requiredStep = _this3.requiredSyncs[0].stepCount;

                // if we haven't reached the corresponding step, it's too soon to apply syncs
                if (requiredStep > _this3.gameEngine.world.stepCount) return {
                    v: void 0
                };

                _this3.gameEngine.trace.trace(function () {
                    return 'applying a required sync ' + requiredStep;
                });
                _this3.applySync(_this3.requiredSyncs.shift());
            };

            while (this.requiredSyncs.length) {
                var _ret5 = _loop5();

                if ((typeof _ret5 === 'undefined' ? 'undefined' : _typeof(_ret5)) === "object") return _ret5.v;
            }

            // if there is a sync from the server, from the past or present, apply it now
            if (this.lastSync && this.lastSync.stepCount <= this.gameEngine.world.stepCount) {
                this.applySync(this.lastSync);
                this.lastSync = null;
            }
        }
    }]);

    return ExtrapolateStrategy;
}(_SyncStrategy3.default);

exports.default = ExtrapolateStrategy;

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _SyncStrategy2 = __webpack_require__(15);

var _SyncStrategy3 = _interopRequireDefault(_SyncStrategy2);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var defaults = {
    worldBufferLength: 60,
    clientStepLag: 0
};

var FrameSyncStrategy = function (_SyncStrategy) {
    _inherits(FrameSyncStrategy, _SyncStrategy);

    function FrameSyncStrategy(clientEngine, inputOptions) {
        _classCallCheck(this, FrameSyncStrategy);

        var _this = _possibleConstructorReturn(this, (FrameSyncStrategy.__proto__ || Object.getPrototypeOf(FrameSyncStrategy)).call(this, clientEngine, inputOptions));

        _this.options = Object.assign(defaults, inputOptions);

        _this.gameEngine = _this.clientEngine.gameEngine;
        _this.gameEngine.on('postStep', _this.frameSync.bind(_this));
        _this.gameEngine.on('client__syncReceived', _this.keepSnapshot.bind(_this));
        return _this;
    }

    // keep snapshot if it's the most recent we've seen


    _createClass(FrameSyncStrategy, [{
        key: 'keepSnapshot',
        value: function keepSnapshot(e) {
            if (!this.latestSnapshot || e.snapshot.stepCount > this.latestSnapshot.stepCount) {
                this.latestSnapshot = e.snapshot;
            }
        }

        /**
         * Perform client-side interpolation.
         */

    }, {
        key: 'frameSync',
        value: function frameSync() {

            var world = this.gameEngine.world;
            var nextWorld = this.latestSnapshot;

            // see if we need to sync
            // TODO: might as well exit this function now if (nextWorld.step == world.step)
            if (!nextWorld) {
                return;
            }

            // create new objects, interpolate existing objects
            for (var objId in nextWorld.objects) {
                if (nextWorld.objects.hasOwnProperty(objId)) {

                    var curObj = null;
                    var nextObj = nextWorld.objects[objId];

                    // if the object is new, add it
                    if (!world.objects.hasOwnProperty(objId)) {
                        console.log('adding new object ' + objId + ' at (' + nextObj.x + ',' + nextObj.y + ',' + nextObj.z + ') velocity (' + nextObj.velX + ',' + nextObj.velY + ',' + nextObj.velZ + ')');

                        curObj = new nextObj.constructor();
                        curObj.copyFrom(nextObj);
                        world.objects[objId] = curObj;
                        curObj.init({
                            velX: nextObj.velX,
                            velY: nextObj.velY,
                            velZ: nextObj.velZ
                        });
                        curObj.initRenderObject(this.gameEngine.renderer);

                        // if this game keeps a physics engine on the client side,
                        // we need to update it as well
                        if (this.gameEngine.physicsEngine) {
                            curObj.initPhysicsObject(this.gameEngine.physicsEngine);
                        }
                    } else {
                        curObj = world.objects[objId];
                        curObj.copy(nextObj);
                    }

                    // update render sub-object
                    curObj.updateRenderObject();
                }
            }
        }
    }]);

    return FrameSyncStrategy;
}(_SyncStrategy3.default);

exports.default = FrameSyncStrategy;

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _Serializable2 = __webpack_require__(3);

var _Serializable3 = _interopRequireDefault(_Serializable2);

var _Serializer = __webpack_require__(1);

var _Serializer2 = _interopRequireDefault(_Serializer);

var _ThreeVector = __webpack_require__(31);

var _ThreeVector2 = _interopRequireDefault(_ThreeVector);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

/**
 * A Quaternion is a geometric object which can be used to
 * represent a three-dimensional rotation.
 */
var Quaternion = function (_Serializable) {
    _inherits(Quaternion, _Serializable);

    _createClass(Quaternion, null, [{
        key: 'netScheme',
        get: function get() {
            return {
                w: { type: _Serializer2.default.TYPES.FLOAT32 },
                x: { type: _Serializer2.default.TYPES.FLOAT32 },
                y: { type: _Serializer2.default.TYPES.FLOAT32 },
                z: { type: _Serializer2.default.TYPES.FLOAT32 }
            };
        }

        /**
        * Creates an instance of a Quaternion.
        * @param {Number} w - first value
        * @param {Number} x - second value
        * @param {Number} y - third value
        * @param {Number} z - fourth value
        * @return {Quaternion} v - the new Quaternion
        */

    }]);

    function Quaternion(w, x, y, z) {
        var _ret;

        _classCallCheck(this, Quaternion);

        var _this = _possibleConstructorReturn(this, (Quaternion.__proto__ || Object.getPrototypeOf(Quaternion)).call(this));

        _this.w = w;
        _this.x = x;
        _this.y = y;
        _this.z = z;

        return _ret = _this, _possibleConstructorReturn(_this, _ret);
    }

    /**
     * Formatted textual description of the Quaternion.
     * @return {String} description
     */

    _createClass(Quaternion, [{
        key: 'toString',
        value: function toString() {
            function round3(x) {
                return Math.round(x * 1000) / 1000;
            }
            return 'quaternion(' + round3(this.w) + ', ' + round3(this.x) + ', ' + round3(this.y) + ', ' + round3(this.z) + ')';
        }

        /**
         * copy values from another quaternion into this quaternion
         *
         * @param {Quaternion} sourceObj the quaternion to copy from
         * @return {Quaternion} returns self
         */

    }, {
        key: 'copy',
        value: function copy(sourceObj) {
            this.set(sourceObj.w, sourceObj.x, sourceObj.y, sourceObj.z);
            return this;
        }

        /**
         * set quaternion values
         *
         * @param {Number} w w-value
         * @param {Number} x x-value
         * @param {Number} y y-value
         * @param {Number} z z-value
         * @return {Quaternion} returns self
         */

    }, {
        key: 'set',
        value: function set(w, x, y, z) {
            this.w = w;
            this.x = x;
            this.y = y;
            this.z = z;

            return this;
        }

        /**
         * return an axis-angle representation of this quaternion
         *
         * @return {Object} contains two attributes: axis (ThreeVector) and angle.
         */

    }, {
        key: 'toAxisAngle',
        value: function toAxisAngle() {

            // assuming quaternion normalised then w is less than 1, so term always positive.
            var axis = new _ThreeVector2.default(1, 0, 0);
            var angle = 2 * Math.acos(this.w);
            var s = Math.sqrt(1 - this.w * this.w);
            if (s > 0.001) {
                var divS = 1 / s;
                axis.x = this.x * divS;
                axis.y = this.y * divS;
                axis.z = this.z * divS;
            }
            return { axis: axis, angle: angle };
        }

        /**
         * set the values of this quaternion from an axis/angle representation
         *
         * @param {ThreeVector} axis The axis
         * @param {Number} angle angle in radians
         * @return {Quaternion} returns self
         */

    }, {
        key: 'setFromAxisAngle',
        value: function setFromAxisAngle(axis, angle) {

            var halfAngle = angle * 0.5;
            var s = Math.sin(halfAngle);
            this.x = axis.x * s;
            this.y = axis.y * s;
            this.z = axis.z * s;
            this.w = Math.cos(halfAngle);

            return this;
        }

        /**
         * conjugate the quaternion, in-place
         *
         * @return {Quaternion} returns self
         */

    }, {
        key: 'conjugate',
        value: function conjugate() {
            this.x *= -1;
            this.y *= -1;
            this.z *= -1;
            return this;
        }

        /* eslint-disable */
        /**
         * multiply this quaternion by another, in-place
         *
         * @param {Quaternion} other The other quaternion
         * @return {Quaternion} returns self
         */

    }, {
        key: 'multiply',
        value: function multiply(other) {
            var aw = this.w,
                ax = this.x,
                ay = this.y,
                az = this.z;
            var bw = other.w,
                bx = other.x,
                by = other.y,
                bz = other.z;

            this.x = ax * bw + aw * bx + ay * bz - az * by;
            this.y = ay * bw + aw * by + az * bx - ax * bz;
            this.z = az * bw + aw * bz + ax * by - ay * bx;
            this.w = aw * bw - ax * bx - ay * by - az * bz;

            return this;
        }
        /* eslint-enable */

        /* eslint-disable */
        /**
         * Apply in-place slerp (spherical linear interpolation) to this quaternion,
         * towards another quaternion.
         *
         * @param {Quaternion} target The target quaternion
         * @param {Number} bending The percentage to interpolate
         * @return {Quaternion} returns self
         */

    }, {
        key: 'slerp',
        value: function slerp(target, bending) {
            var aw = this.w,
                ax = this.x,
                ay = this.y,
                az = this.z;
            var bw = target.w,
                bx = target.x,
                by = target.y,
                bz = target.z;

            var cosHalfTheta = aw * bw + ax * bx + ay * by + az * bz;
            if (cosHalfTheta < 0) {
                this.set(-bw, -bx, -by, -bz);
                cosHalfTheta = -cosHalfTheta;
            } else {
                this.copy(target);
            }

            if (cosHalfTheta >= 1.0) {
                this.set(aw, ax, ay, az);
                return this;
            }

            var sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);
            if (Math.abs(sinHalfTheta) < 0.001) {
                this.set(0.5 * (aw + this.w), 0.5 * (ax + this.x), 0.5 * (ay + this.y), 0.5 * (az + this.z));
                return this;
            }

            var halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
            var ratioA = Math.sin((1 - bending) * halfTheta) / sinHalfTheta;
            var ratioB = Math.sin(bending * halfTheta) / sinHalfTheta;
            this.set(aw * ratioA + this.w * ratioB, ax * ratioA + this.x * ratioB, ay * ratioA + this.y * ratioB, az * ratioA + this.z * ratioB);
            return this;
        }
        /* eslint-enable */

    }]);

    return Quaternion;
}(_Serializable3.default);

exports.default = Quaternion;

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _eventemitter = __webpack_require__(5);

var _eventemitter2 = _interopRequireDefault(_eventemitter);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

/**
 * Measures network performance between the client and the server
 * Represents both the client and server portions of NetworkMonitor
 */
var NetworkMonitor = function () {
    function NetworkMonitor() {
        _classCallCheck(this, NetworkMonitor);

        // mixin for EventEmitter
        Object.assign(this, _eventemitter2.default.prototype);
    }

    // client


    _createClass(NetworkMonitor, [{
        key: 'registerClient',
        value: function registerClient(clientEngine) {
            this.queryIdCounter = 0;
            this.RTTQueries = {};

            this.movingRTTAverage = 0;
            this.movingRTTAverageFrame = [];
            this.movingFPSAverageSize = clientEngine.options.healthCheckRTTSample;
            this.clientEngine = clientEngine;
            clientEngine.socket.on("RTTResponse", this.onReceivedRTTQuery.bind(this));
            setInterval(this.sendRTTQuery.bind(this), clientEngine.options.healthCheckInterval);
        }
    }, {
        key: 'sendRTTQuery',
        value: function sendRTTQuery() {
            // todo implement cleanup of older timestamp
            this.RTTQueries[this.queryIdCounter] = new Date().getTime();
            this.clientEngine.socket.emit('RTTQuery', this.queryIdCounter);
            this.queryIdCounter++;
        }
    }, {
        key: 'onReceivedRTTQuery',
        value: function onReceivedRTTQuery(queryId) {
            var RTT = new Date().getTime() - this.RTTQueries[queryId];

            this.movingRTTAverageFrame.push(RTT);
            if (this.movingRTTAverageFrame.length > this.movingFPSAverageSize) {
                this.movingRTTAverageFrame.shift();
            }
            this.movingRTTAverage = this.movingRTTAverageFrame.reduce(function (a, b) {
                return a + b;
            }) / this.movingRTTAverageFrame.length;
            this.emit('RTTUpdate', {
                RTT: RTT,
                RTTAverage: this.movingRTTAverage
            });
        }

        // server

    }, {
        key: 'registerPlayerOnServer',
        value: function registerPlayerOnServer(socket) {
            socket.on('RTTQuery', this.respondToRTTQuery.bind(this, socket));
        }
    }, {
        key: 'respondToRTTQuery',
        value: function respondToRTTQuery(socket, queryId) {
            socket.emit("RTTResponse", queryId);
        }
    }]);

    return NetworkMonitor;
}();

exports.default = NetworkMonitor;

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _Serializer = __webpack_require__(1);

var _Serializer2 = _interopRequireDefault(_Serializer);

var _NetworkedEventFactory = __webpack_require__(78);

var _NetworkedEventFactory2 = _interopRequireDefault(_NetworkedEventFactory);

var _NetworkedEventCollection = __webpack_require__(79);

var _NetworkedEventCollection2 = _interopRequireDefault(_NetworkedEventCollection);

var _Utils = __webpack_require__(4);

var _Utils2 = _interopRequireDefault(_Utils);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var NetworkTransmitter = function () {
    function NetworkTransmitter(serializer) {
        _classCallCheck(this, NetworkTransmitter);

        this.serializer = serializer;

        this.registeredEvents = [];

        this.serializer.registerClass(_NetworkedEventCollection2.default);

        this.registerNetworkedEventFactory('objectUpdate', {
            netScheme: {
                stepCount: { type: _Serializer2.default.TYPES.INT32 },
                objectInstance: { type: _Serializer2.default.TYPES.CLASSINSTANCE }
            }
        });

        this.registerNetworkedEventFactory('objectCreate', {
            netScheme: {
                stepCount: { type: _Serializer2.default.TYPES.INT32 },
                objectInstance: { type: _Serializer2.default.TYPES.CLASSINSTANCE }
            }
        });

        this.registerNetworkedEventFactory('objectDestroy', {
            netScheme: {
                stepCount: { type: _Serializer2.default.TYPES.INT32 },
                objectInstance: { type: _Serializer2.default.TYPES.CLASSINSTANCE }
            }
        });

        this.registerNetworkedEventFactory('syncHeader', {
            netScheme: {
                stepCount: { type: _Serializer2.default.TYPES.INT32 },
                fullUpdate: { type: _Serializer2.default.TYPES.UINT8 }
            }
        });

        this.networkedEventCollection = new _NetworkedEventCollection2.default();
    }

    _createClass(NetworkTransmitter, [{
        key: 'registerNetworkedEventFactory',
        value: function registerNetworkedEventFactory(eventName, options) {
            options = Object.assign({}, options);

            var classHash = _Utils2.default.hashStr(eventName);

            var networkedEventPrototype = function networkedEventPrototype() {};
            networkedEventPrototype.prototype.classId = classHash;
            networkedEventPrototype.prototype.eventName = eventName;
            networkedEventPrototype.netScheme = options.netScheme;

            this.serializer.registerClass(networkedEventPrototype, classHash);

            this.registeredEvents[eventName] = new _NetworkedEventFactory2.default(this.serializer, eventName, options);
        }
    }, {
        key: 'addNetworkedEvent',
        value: function addNetworkedEvent(eventName, payload) {
            if (!this.registeredEvents[eventName]) {
                console.error('NetworkTransmitter: no such event ' + eventName);
                return null;
            }

            var stagedNetworkedEvent = this.registeredEvents[eventName].create(payload);
            this.networkedEventCollection.events.push(stagedNetworkedEvent);

            return stagedNetworkedEvent;
        }
    }, {
        key: 'serializePayload',
        value: function serializePayload() {
            if (this.networkedEventCollection.events.length === 0) return null;

            var dataBuffer = this.networkedEventCollection.serialize(this.serializer);

            return dataBuffer;
        }
    }, {
        key: 'deserializePayload',
        value: function deserializePayload(payload) {
            return this.serializer.deserialize(payload.dataBuffer).obj;
        }
    }, {
        key: 'clearPayload',
        value: function clearPayload() {
            this.networkedEventCollection.events = [];
        }
    }]);

    return NetworkTransmitter;
}();

exports.default = NetworkTransmitter;

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _Serializable = __webpack_require__(3);

var _Serializable2 = _interopRequireDefault(_Serializable);

var _Utils = __webpack_require__(4);

var _Utils2 = _interopRequireDefault(_Utils);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var NetworkedEventFactory = function () {
    function NetworkedEventFactory(serializer, eventName, options) {
        _classCallCheck(this, NetworkedEventFactory);

        options = Object.assign({}, options);

        this.seriazlier = serializer;
        this.options = options;

        this.eventName = eventName;
        this.netScheme = options.netScheme;
    }

    /**
     * Creates a new networkedEvent
     * @param {Object} payload an object representing the payload to be transferred over the wire
     * @return {Serializable} the new networkedEvent object
     */

    _createClass(NetworkedEventFactory, [{
        key: 'create',
        value: function create(payload) {
            var networkedEvent = new _Serializable2.default();
            networkedEvent.classId = _Utils2.default.hashStr(this.eventName);

            if (this.netScheme) {
                networkedEvent.netScheme = Object.assign({}, this.netScheme);

                // copy properties from the networkedEvent instance to its ad-hoc netsScheme
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = Object.keys(this.netScheme)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var property = _step.value;

                        networkedEvent[property] = payload[property];
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            } else {
                // todo take care of the event where no netScheme is defined
            }

            return networkedEvent;
        }
    }]);

    return NetworkedEventFactory;
}();

exports.default = NetworkedEventFactory;

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _Serializer = __webpack_require__(1);

var _Serializer2 = _interopRequireDefault(_Serializer);

var _Serializable2 = __webpack_require__(3);

var _Serializable3 = _interopRequireDefault(_Serializable2);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

/**
 * Defines a collection of NetworkEvents to be transmitted over the wire
 */
var NetworkedEventCollection = function (_Serializable) {
    _inherits(NetworkedEventCollection, _Serializable);

    _createClass(NetworkedEventCollection, null, [{
        key: 'netScheme',
        get: function get() {
            return {
                events: {
                    type: _Serializer2.default.TYPES.LIST,
                    itemType: _Serializer2.default.TYPES.CLASSINSTANCE
                }
            };
        }
    }]);

    function NetworkedEventCollection(events) {
        _classCallCheck(this, NetworkedEventCollection);

        var _this = _possibleConstructorReturn(this, (NetworkedEventCollection.__proto__ || Object.getPrototypeOf(NetworkedEventCollection)).call(this));

        _this.events = events || [];
        return _this;
    }

    return NetworkedEventCollection;
}(_Serializable3.default);

exports.default = NetworkedEventCollection;

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Renderer2 = __webpack_require__(81);

var _Renderer3 = _interopRequireDefault(_Renderer2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MyRenderer = function (_Renderer) {
    _inherits(MyRenderer, _Renderer);

    function MyRenderer(gameEngine, clientEngine) {
        _classCallCheck(this, MyRenderer);

        var _this = _possibleConstructorReturn(this, (MyRenderer.__proto__ || Object.getPrototypeOf(MyRenderer)).call(this, gameEngine, clientEngine));

        _this.sprites = {};
        return _this;
    }

    _createClass(MyRenderer, [{
        key: 'draw',
        value: function draw(t, dt) {
            _get(MyRenderer.prototype.__proto__ || Object.getPrototypeOf(MyRenderer.prototype), 'draw', this).call(this, t, dt);

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.keys(this.sprites)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var objId = _step.value;

                    if (this.sprites[objId].el) {
                        this.sprites[objId].el.style.top = this.gameEngine.world.objects[objId].position.y + 'px';
                        this.sprites[objId].el.style.left = this.gameEngine.world.objects[objId].position.x + 'px';
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }, {
        key: 'addSprite',
        value: function addSprite(obj, objName) {
            if (objName === 'paddle') objName += obj.playerId;
            this.sprites[obj.id] = {
                el: document.querySelector('.' + objName)
            };
        }
    }]);

    return MyRenderer;
}(_Renderer3.default);

exports.default = MyRenderer;

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _eventemitter = __webpack_require__(5);

var _eventemitter2 = _interopRequireDefault(_eventemitter);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var singleton = null;

var TIME_RESET_THRESHOLD = 100;

/**
 * The Renderer is the component which must *draw* the game on the client.
 * It will be instantiated once on each client, and must implement the draw
 * method.  The draw method will be invoked on every iteration of the browser's
 * render loop.
 */

var Renderer = function () {
    _createClass(Renderer, null, [{
        key: 'getInstance',
        value: function getInstance() {
            return singleton;
        }

        /**
        * Constructor of the Renderer singleton.
        * @param {GameEngine} gameEngine - Reference to the GameEngine instance.
        * @param {ClientEngine} clientEngine - Reference to the ClientEngine instance.
        */

    }]);

    function Renderer(gameEngine, clientEngine) {
        var _this = this;

        _classCallCheck(this, Renderer);

        this.gameEngine = gameEngine;
        this.clientEngine = clientEngine;
        this.gameEngine.on('client__stepReset', function () {
            _this.doReset = true;
        });
        gameEngine.on('objectAdded', this.addObject.bind(this));
        gameEngine.on('objectDestroyed', this.removeObject.bind(this));

        // mixin for EventEmitter
        Object.assign(this, _eventemitter2.default.prototype);

        // the singleton renderer has been created
        singleton = this;
    }

    /**
     * Initialize the renderer.
     * @return {Promise} Resolves when renderer is ready.
    */

    _createClass(Renderer, [{
        key: 'init',
        value: function init() {
            if (typeof window === 'undefined' || !document) {
                console.log('renderer invoked on server side.');
            }
            return Promise.resolve(); // eslint-disable-line new-cap
        }
    }, {
        key: 'reportSlowFrameRate',
        value: function reportSlowFrameRate() {
            this.gameEngine.emit('client__slowFrameRate');
        }

        /**
         * The main draw function.  This method is called at high frequency,
         * at the rate of the render loop.  Typically this is 60Hz, in WebVR 90Hz.
         * If the client engine has been configured to render-schedule, then this
         * method must call the clientEngine's step method.
         *
         * @param {Number} t - current time (only required in render-schedule mode)
         * @param {Number} dt - time elapsed since last draw (only required in render-schedule mode)
         */

    }, {
        key: 'draw',
        value: function draw(t, dt) {
            if (this.clientEngine.options.scheduler === 'render-schedule') this.runClientStep(t, dt);
        }

        /**
         * The main draw function.  This method is called at high frequency,
         * at the rate of the render loop.  Typically this is 60Hz, in WebVR 90Hz.
         *
         * @param {Number} t - current time
         * @param {Number} dt - time elapsed since last draw
         */

    }, {
        key: 'runClientStep',
        value: function runClientStep(t, dt) {
            var p = this.clientEngine.options.stepPeriod;

            // reset step time if we passed a threshold
            if (this.doReset || t > this.clientEngine.lastStepTime + TIME_RESET_THRESHOLD) {
                this.doReset = false;
                this.clientEngine.lastStepTime = t - p / 2;
                this.clientEngine.correction = p / 2;
            }

            // catch-up missed steps
            while (t > this.clientEngine.lastStepTime + p) {
                this.clientEngine.step(this.clientEngine.lastStepTime + p, p + this.clientEngine.correction);
                this.clientEngine.lastStepTime += p;
                this.clientEngine.correction = 0;
            }

            // if not ready for a real step yet, retun
            // this might happen after catch up above
            if (t < this.clientEngine.lastStepTime) {
                dt = t - this.clientEngine.lastStepTime + this.clientEngine.correction;
                if (dt < 0) dt = 0;
                this.clientEngine.correction = this.clientEngine.lastStepTime - t;
                this.clientEngine.step(t, dt, true);
                return;
            }

            // render-controlled step
            dt = t - this.clientEngine.lastStepTime + this.clientEngine.correction;
            this.clientEngine.lastStepTime += p;
            this.clientEngine.correction = this.clientEngine.lastStepTime - t;
            this.clientEngine.step(t, dt);
        }

        /**
         * Handle the addition of a new object to the world.
         * @param {Object} obj - The object to be added.
         */

    }, {
        key: 'addObject',
        value: function addObject(obj) {}

        /**
         * Handle the removal of an old object from the world.
         * @param {Object} obj - The object to be removed.
         */

    }, {
        key: 'removeObject',
        value: function removeObject(obj) {}
    }]);

    return Renderer;
}();

exports.default = Renderer;

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _eventemitter = __webpack_require__(5);

var _eventemitter2 = _interopRequireDefault(_eventemitter);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

// based on http://keycode.info/

// keyboard handling
var keyCodeTable = {
    3: "break",
    8: "backspace", //backspace / delete
    9: "tab",
    12: 'clear',
    13: "enter",
    16: "shift",
    17: "ctrl",
    18: "alt",
    19: "pause/break",
    20: "caps lock",
    27: "escape",
    28: "conversion",
    29: "non-conversion",
    32: "space",
    33: "page up",
    34: "page down",
    35: "end",
    36: "home",
    37: "left",
    38: "up",
    39: "right",
    40: "down",
    41: "select",
    42: "print",
    43: "execute",
    44: "Print Screen",
    45: "insert",
    46: "delete",
    48: "0",
    49: "1",
    50: "2",
    51: "3",
    52: "4",
    53: "5",
    54: "6",
    55: "7",
    56: "8",
    57: "9",
    58: ":",
    59: "semicolon (firefox), equals",
    60: "<",
    61: "equals (firefox)",
    63: "ß",
    64: "@",
    65: "a",
    66: "b",
    67: "c",
    68: "d",
    69: "e",
    70: "f",
    71: "g",
    72: "h",
    73: "i",
    74: "j",
    75: "k",
    76: "l",
    77: "m",
    78: "n",
    79: "o",
    80: "p",
    81: "q",
    82: "r",
    83: "s",
    84: "t",
    85: "u",
    86: "v",
    87: "w",
    88: "x",
    89: "y",
    90: "z",
    91: "Windows Key / Left ⌘ / Chromebook Search key",
    92: "right window key",
    93: "Windows Menu / Right ⌘",
    96: "numpad 0",
    97: "numpad 1",
    98: "numpad 2",
    99: "numpad 3",
    100: "numpad 4",
    101: "numpad 5",
    102: "numpad 6",
    103: "numpad 7",
    104: "numpad 8",
    105: "numpad 9",
    106: "multiply",
    107: "add",
    108: "numpad period (firefox)",
    109: "subtract",
    110: "decimal point",
    111: "divide",
    112: "f1",
    113: "f2",
    114: "f3",
    115: "f4",
    116: "f5",
    117: "f6",
    118: "f7",
    119: "f8",
    120: "f9",
    121: "f10",
    122: "f11",
    123: "f12",
    124: "f13",
    125: "f14",
    126: "f15",
    127: "f16",
    128: "f17",
    129: "f18",
    130: "f19",
    131: "f20",
    132: "f21",
    133: "f22",
    134: "f23",
    135: "f24",
    144: "num lock",
    145: "scroll lock",
    160: "^",
    161: '!',
    163: "#",
    164: '$',
    165: 'ù',
    166: "page backward",
    167: "page forward",
    169: "closing paren (AZERTY)",
    170: '*',
    171: "~ + * key",
    173: "minus (firefox), mute/unmute",
    174: "decrease volume level",
    175: "increase volume level",
    176: "next",
    177: "previous",
    178: "stop",
    179: "play/pause",
    180: "e-mail",
    181: "mute/unmute (firefox)",
    182: "decrease volume level (firefox)",
    183: "increase volume level (firefox)",
    186: "semi-colon / ñ",
    187: "equal sign",
    188: "comma",
    189: "dash",
    190: "period",
    191: "forward slash / ç",
    192: "grave accent / ñ / æ",
    193: "?, / or °",
    194: "numpad period (chrome)",
    219: "open bracket",
    220: "back slash",
    221: "close bracket / å",
    222: "single quote / ø",
    223: "`",
    224: "left or right ⌘ key (firefox)",
    225: "altgr",
    226: "< /git >",
    230: "GNOME Compose Key",
    231: "ç",
    233: "XF86Forward",
    234: "XF86Back",
    240: "alphanumeric",
    242: "hiragana/katakana",
    243: "half-width/full-width",
    244: "kanji",
    255: "toggle touchpad"
};

/**
 * This class allows easy usage of device keyboard controls
 */

var KeyboardControls = function () {
    function KeyboardControls(clientEngine) {
        var _this = this;

        _classCallCheck(this, KeyboardControls);

        Object.assign(this, _eventemitter2.default.prototype);
        this.clientEngine = clientEngine;
        this.gameEngine = clientEngine.gameEngine;

        this.setupListeners();

        // keep a reference for key press state
        this.keyState = {};

        // a list of bound keys and their corresponding actions
        this.boundKeys = {};

        this.gameEngine.on('client__preStep', function () {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.keys(_this.boundKeys)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var keyName = _step.value;

                    if (_this.keyState[keyName] && _this.keyState[keyName].isDown) {

                        //handle repeat press
                        if (_this.boundKeys[keyName].options.repeat || _this.keyState[keyName].count == 0) {
                            //todo movement is probably redundant
                            _this.clientEngine.sendInput(_this.boundKeys[keyName].actionName, { movement: true });
                            _this.keyState[keyName].count++;
                        }
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        });
    }

    _createClass(KeyboardControls, [{
        key: "setupListeners",
        value: function setupListeners() {
            var _this2 = this;

            document.addEventListener('keydown', function (e) {
                _this2.onKeyChange(e, true);
            });
            document.addEventListener('keyup', function (e) {
                _this2.onKeyChange(e, false);
            });
        }
    }, {
        key: "bindKey",
        value: function bindKey(keys, actionName, options) {
            var _this3 = this;

            if (!Array.isArray(keys)) keys = [keys];

            var keyOptions = Object.assign({
                repeat: false
            }, options);

            keys.forEach(function (keyName) {
                _this3.boundKeys[keyName] = { actionName: actionName, options: keyOptions };
            });
        }

        //todo implement unbindKey

    }, {
        key: "onKeyChange",
        value: function onKeyChange(e, isDown) {
            e = e || window.event;

            var keyName = keyCodeTable[e.keyCode];
            if (keyName && this.boundKeys[keyName]) {
                if (this.keyState[keyName] == null) {
                    this.keyState[keyName] = {
                        count: 0
                    };
                }
                this.keyState[keyName].isDown = isDown;

                //key up, reset press count
                if (!isDown) this.keyState[keyName].count = 0;

                // keep reference to the last key pressed to avoid duplicates
                this.lastKeyPressed = isDown ? e.keyCode : null;
                // this.renderer.onKeyChange({ keyName, isDown });
                e.preventDefault();
            }
        }
    }]);

    return KeyboardControls;
}();

exports.default = KeyboardControls;

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _TwoVector = __webpack_require__(6);

var _TwoVector2 = _interopRequireDefault(_TwoVector);

var _Paddle = __webpack_require__(84);

var _Paddle2 = _interopRequireDefault(_Paddle);

var _Ball = __webpack_require__(87);

var _Ball2 = _interopRequireDefault(_Ball);

var _GameEngine2 = __webpack_require__(88);

var _GameEngine3 = _interopRequireDefault(_GameEngine2);

var _SimplePhysicsEngine = __webpack_require__(92);

var _SimplePhysicsEngine2 = _interopRequireDefault(_SimplePhysicsEngine);

var _PlayerAvatar = __webpack_require__(97);

var _PlayerAvatar2 = _interopRequireDefault(_PlayerAvatar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PADDING = 20;
var WIDTH = 400;
var HEIGHT = 400;
var PADDLE_WIDTH = 10;
var PADDLE_HEIGHT = 50;

var MyGameEngine = function (_GameEngine) {
    _inherits(MyGameEngine, _GameEngine);

    function MyGameEngine(options) {
        _classCallCheck(this, MyGameEngine);

        var _this = _possibleConstructorReturn(this, (MyGameEngine.__proto__ || Object.getPrototypeOf(MyGameEngine)).call(this, options));

        _this.physicsEngine = new _SimplePhysicsEngine2.default({ gameEngine: _this });
        return _this;
    }

    _createClass(MyGameEngine, [{
        key: 'registerClasses',
        value: function registerClasses(serializer) {
            serializer.registerClass(_Paddle2.default);
            serializer.registerClass(_Ball2.default);
        }
    }, {
        key: 'start',
        value: function start() {
            var _this2 = this;

            _get(MyGameEngine.prototype.__proto__ || Object.getPrototypeOf(MyGameEngine.prototype), 'start', this).call(this);

            this.on('postStep', function () {
                _this2.postStepHandleBall();
            });
            this.on('objectAdded', function (object) {
                if (object.class === _Ball2.default) {
                    _this2.ball = object;
                } else if (object.playerId === 1) {
                    _this2.paddle1 = object;
                } else if (object.playerId === 2) {
                    _this2.paddle2 = object;
                }
            });
        }
    }, {
        key: 'processInput',
        value: function processInput(inputData, playerId) {

            _get(MyGameEngine.prototype.__proto__ || Object.getPrototypeOf(MyGameEngine.prototype), 'processInput', this).call(this, inputData, playerId);

            // get the player paddle tied to the player socket
            var playerPaddle = this.world.queryObject({ playerId: playerId });
            if (playerPaddle) {
                if (inputData.input === 'up') {
                    playerPaddle.position.y -= 5;
                } else if (inputData.input === 'down') {
                    playerPaddle.position.y += 5;
                }
            }
        }
    }, {
        key: 'initGame',
        value: function initGame() {

            // create the paddle objects
            this.addObjectToWorld(new _Paddle2.default(this, null, { position: new _TwoVector2.default(PADDING, 0), playerId: 1 }));
            this.addObjectToWorld(new _Paddle2.default(this, null, { position: new _TwoVector2.default(WIDTH - PADDING, 0), playerId: 2 }));
            this.addObjectToWorld(new _Ball2.default(this, null, { position: new _TwoVector2.default(WIDTH / 2, HEIGHT / 2) }));
        }
    }, {
        key: 'postStepHandleBall',
        value: function postStepHandleBall() {
            if (!this.ball) return;

            // CHECK LEFT EDGE:
            if (this.ball.position.x <= PADDING + PADDLE_WIDTH && this.ball.position.y >= this.paddle1.y && this.ball.position.y <= this.paddle1.position.y + PADDLE_HEIGHT && this.ball.velocity.x < 0) {

                // ball moving left hit player 1 paddle
                this.ball.velocity.x *= -1;
                this.ball.position.x = PADDING + PADDLE_WIDTH + 1;
            } else if (this.ball.position.x <= 0) {

                // ball hit left wall
                this.ball.velocity.x *= -1;
                this.ball.position.x = 0;
                console.log('player 2 scored');
            }

            // CHECK RIGHT EDGE:
            if (this.ball.position.x >= WIDTH - PADDING - PADDLE_WIDTH && this.ball.position.y >= this.paddle2.position.y && this.ball.position.y <= this.paddle2.position.y + PADDLE_HEIGHT && this.ball.velocity.x > 0) {

                // ball moving right hits player 2 paddle
                this.ball.velocity.x *= -1;
                this.ball.position.x = WIDTH - PADDING - PADDLE_WIDTH - 1;
            } else if (this.ball.position.x >= WIDTH) {

                // ball hit right wall
                this.ball.velocity.x *= -1;
                this.ball.position.x = WIDTH - 1;
                console.log('player 1 scored');
            }

            // ball hits top
            if (this.ball.position.y <= 0) {
                this.ball.position.y = 1;
                this.ball.velocity.y *= -1;
            } else if (this.ball.position.y >= HEIGHT) {
                // ball hits bottom
                this.ball.position.y = HEIGHT - 1;
                this.ball.velocity.y *= -1;
            }
        }
    }]);

    return MyGameEngine;
}(_GameEngine3.default);

exports.default = MyGameEngine;

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _DynamicObject2 = __webpack_require__(16);

var _DynamicObject3 = _interopRequireDefault(_DynamicObject2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Paddle = function (_DynamicObject) {
    _inherits(Paddle, _DynamicObject);

    function Paddle(gameEngine, options, props) {
        _classCallCheck(this, Paddle);

        var _this = _possibleConstructorReturn(this, (Paddle.__proto__ || Object.getPrototypeOf(Paddle)).call(this, gameEngine, options, props));

        if (props && props.playerId) _this.playerId = props.playerId;
        _this.class = Paddle;
        return _this;
    }

    _createClass(Paddle, [{
        key: 'onAddToWorld',
        value: function onAddToWorld(gameEngine) {
            if (gameEngine.renderer) {
                gameEngine.renderer.addSprite(this, 'paddle');
            }
        }
    }]);

    return Paddle;
}(_DynamicObject3.default);

exports.default = Paddle;

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);if (parent === null) {
            return undefined;
        } else {
            return get(parent, property, receiver);
        }
    } else if ("value" in desc) {
        return desc.value;
    } else {
        var getter = desc.get;if (getter === undefined) {
            return undefined;
        }return getter.call(receiver);
    }
};

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _Serializable2 = __webpack_require__(3);

var _Serializable3 = _interopRequireDefault(_Serializable2);

var _Serializer = __webpack_require__(1);

var _Serializer2 = _interopRequireDefault(_Serializer);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

/**
 * GameObject is the base class of all game objects.
 * It is created only for the purpose of clearly defining the game
 * object interface.
 * Game developers will use one of the subclasses such as DynamicObject,
 * or PhysicalObject.
 */
var GameObject = function (_Serializable) {
    _inherits(GameObject, _Serializable);

    _createClass(GameObject, null, [{
        key: 'netScheme',
        get: function get() {
            return {
                id: { type: _Serializer2.default.TYPES.INT32 }
            };
        }

        /**
        * Creates an instance of a game object.
        * @param {GameEngine} gameEngine - the gameEngine this object will be used in
        * @param {Object} options - options for instantiation of the GameObject
        * @param {Number} id - if set, the new instantiated object will be set to this id instead of being generated a new one. Use with caution!
        */

    }]);

    function GameObject(gameEngine, options) {
        _classCallCheck(this, GameObject);

        /**
         * The gameEngine this object will be used in
         * @member {GameEngine}
         */
        var _this = _possibleConstructorReturn(this, (GameObject.__proto__ || Object.getPrototypeOf(GameObject)).call(this));

        _this.gameEngine = gameEngine;

        /**
        * ID of this object's instance.
        * There are three cases of instance creation which can occur:
        * 1. In the normal case, the constructor is asked to assign an ID which is unique
        * across the entire game world, including the server and all the clients.
        * 2. In extrapolation mode, the client may have an object instance which does not
        * yet exist on the server, these objects are known as shadow objects.  Their IDs must
        * be allocated from a different range.
        * 3. Also, temporary objects are created on the client side each time a sync is received.
        * These are used for interpolation purposes and as bending targets of position, velocity,
        * angular velocity, and orientation.  In this case the id will be set to null.
        * @member {Number}
        */
        _this.id = null;
        if (options && 'id' in options) _this.id = options.id;else if (_this.gameEngine) _this.id = _this.gameEngine.world.getNewId();

        _this.components = {};
        return _this;
    }

    /**
     * Called after the object is added to to the game world.
     * This is the right place to add renderer sub-objects, physics sub-objects
     * and any other resources that should be created
     * @param {GameEngine} gameEngine the game engine
     */

    _createClass(GameObject, [{
        key: 'onAddToWorld',
        value: function onAddToWorld(gameEngine) {}

        /**
         * Called after the object is removed from game-world.
         * This is where renderer sub-objects and any other resources should be freed
         * @param {GameEngine} gameEngine the game engine
         */

    }, {
        key: 'onRemoveFromWorld',
        value: function onRemoveFromWorld(gameEngine) {}

        /**
         * Formatted textual description of the game object.
         * @return {String} description - a string description
         */

    }, {
        key: 'toString',
        value: function toString() {
            return 'game-object[' + this.id + ']';
        }

        /**
         * Formatted textual description of the game object's current bending properties.
         * @return {String} description - a string description
         */

    }, {
        key: 'bendingToString',
        value: function bendingToString() {
            return 'no bending';
        }
    }, {
        key: 'saveState',
        value: function saveState(other) {
            this.savedCopy = new this.constructor(this.gameEngine, { id: null });
            this.savedCopy.syncTo(other ? other : this);
        }

        // TODO:
        // rather than pass worldSettings on each bend, they could
        // be passed in on the constructor just once.

    }, {
        key: 'bendToCurrentState',
        value: function bendToCurrentState(bending, worldSettings, isLocal, bendingIncrements) {
            if (this.savedCopy) {
                this.bendToCurrent(this.savedCopy, bending, worldSettings, isLocal, bendingIncrements);
            }
            this.savedCopy = null;
        }
    }, {
        key: 'bendToCurrent',
        value: function bendToCurrent(original, bending, worldSettings, isLocal, bendingIncrements) {}

        /**
        * The bending multiple is a getter, which returns the
        * amount of bending.
        * Bending is defined as the amount of correction that will be applied
        * on the client side to a given object's position, incrementally, until the next
        * server broadcast is expected to arrive.
        * When this value is 0.0, the client ignores the server object's position.
        * When this value is null, the bending is taken from the synchronization
        * defaults.  Set this to zero for objects whose position
        * jumps suddenly - because the game intended a jump, not a gradual bend.
        * @memberof GameObject
        * @member {Number} bendingMultiple
        */

    }, {
        key: 'syncTo',

        /**
         * synchronize this object to the state of an other object
         * @param {GameObject} other the other object to synchronize to
         */
        value: function syncTo(other) {
            _get(GameObject.prototype.__proto__ || Object.getPrototypeOf(GameObject.prototype), 'syncTo', this).call(this, other);
        }

        // copy physical attributes to physics sub-object

    }, {
        key: 'refreshToPhysics',
        value: function refreshToPhysics() {}

        // copy physical attributes from physics sub-object

    }, {
        key: 'refreshFromPhysics',
        value: function refreshFromPhysics() {}

        // apply a single bending increment

    }, {
        key: 'applyIncrementalBending',
        value: function applyIncrementalBending() {}

        // clean up resources

    }, {
        key: 'destroy',
        value: function destroy() {}
    }, {
        key: 'addComponent',
        value: function addComponent(componentInstance) {
            componentInstance.parentObject = this;
            this.components[componentInstance.constructor.name] = componentInstance;

            // a gameEngine might not exist if this class is instantiated by the serializer
            if (this.gameEngine) {
                this.gameEngine.emit('componentAdded', this, componentInstance);
            }
        }
    }, {
        key: 'removeComponent',
        value: function removeComponent(componentName) {
            // todo cleanup of the component ?
            delete this.components[componentName];

            // a gameEngine might not exist if this class is instantiated by the serializer
            if (this.gameEngine) {
                this.gameEngine.emit('componentRemoved', this, componentName);
            }
        }

        /**
         * Check whether this game object has a certain component
         * @param componentClass the comp
         * @returns {Boolean} true if the gameObject contains this component
         */

    }, {
        key: 'hasComponent',
        value: function hasComponent(componentClass) {
            return componentClass.name in this.components;
        }
    }, {
        key: 'getComponent',
        value: function getComponent(componentClass) {
            return this.components[componentClass.name];
        }
    }, {
        key: 'bendingMultiple',
        get: function get() {
            return null;
        }

        /**
        * The velocity bending multiple is a getter, which returns the
        * amount of velocity bending.
        * @memberof GameObject
        * @member {Number} bendingVelocityMultiple
        */

    }, {
        key: 'bendingVelocityMultiple',
        get: function get() {
            return null;
        }
    }]);

    return GameObject;
}(_Serializable3.default);

exports.default = GameObject;

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var MathUtils = function () {
    function MathUtils() {
        _classCallCheck(this, MathUtils);
    }

    _createClass(MathUtils, null, [{
        key: 'interpolate',

        // interpolate from start to end, advancing "percent" of the way
        value: function interpolate(start, end, percent) {
            return (end - start) * percent + start;
        }

        // interpolate from start to end, advancing "percent" of the way
        //
        // returns just the delta. i.e. the value that must be added to the start value

    }, {
        key: 'interpolateDelta',
        value: function interpolateDelta(start, end, percent) {
            return (end - start) * percent;
        }

        // interpolate from start to end, advancing "percent" of the way
        // and noting that the dimension wraps around {x >= wrapMin, x < wrapMax}
        //
        // returns just the delta. i.e. the value that must be added to the start value

    }, {
        key: 'interpolateDeltaWithWrapping',
        value: function interpolateDeltaWithWrapping(start, end, percent, wrapMin, wrapMax) {
            var wrapTest = wrapMax - wrapMin;
            if (start - end > wrapTest / 2) end += wrapTest;else if (end - start > wrapTest / 2) start += wrapTest;
            if (Math.abs(start - end) > wrapTest / 3) {
                console.log('wrap interpolation is close to limit.  Not sure which edge to wrap to.');
            }
            return (end - start) * percent;
        }
    }, {
        key: 'interpolateWithWrapping',
        value: function interpolateWithWrapping(start, end, percent, wrapMin, wrapMax) {
            var interpolatedVal = start + this.interpolateDeltaWithWrapping(start, end, percent, wrapMin, wrapMax);
            var wrapLength = wrapMax - wrapMin;
            if (interpolatedVal >= wrapLength) interpolatedVal -= wrapLength;
            if (interpolatedVal < 0) interpolatedVal += wrapLength;
            return interpolatedVal;
        }
    }]);

    return MathUtils;
}();

exports.default = MathUtils;

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _DynamicObject2 = __webpack_require__(16);

var _DynamicObject3 = _interopRequireDefault(_DynamicObject2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Ball = function (_DynamicObject) {
    _inherits(Ball, _DynamicObject);

    _createClass(Ball, [{
        key: 'bendingMultiple',
        get: function get() {
            return 0.8;
        }
    }, {
        key: 'bendingVelocityMultiple',
        get: function get() {
            return 0;
        }
    }]);

    function Ball(gameEngine, options, props) {
        _classCallCheck(this, Ball);

        var _this = _possibleConstructorReturn(this, (Ball.__proto__ || Object.getPrototypeOf(Ball)).call(this, gameEngine, options, props));

        _this.class = Ball;
        _this.velocity.set(2, 2);
        return _this;
    }

    _createClass(Ball, [{
        key: 'onAddToWorld',
        value: function onAddToWorld(gameEngine) {
            if (gameEngine.renderer) {
                gameEngine.renderer.addSprite(this, 'ball');
            }
        }
    }]);

    return Ball;
}(_DynamicObject3.default);

exports.default = Ball;

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _GameWorld = __webpack_require__(89);

var _GameWorld2 = _interopRequireDefault(_GameWorld);

var _eventemitter = __webpack_require__(5);

var _eventemitter2 = _interopRequireDefault(_eventemitter);

var _Timer = __webpack_require__(90);

var _Timer2 = _interopRequireDefault(_Timer);

var _Trace = __webpack_require__(91);

var _Trace2 = _interopRequireDefault(_Trace);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/**
 * The GameEngine contains the game logic.  Extend this class
 * to implement game mechanics.  The GameEngine derived
 * instance runs once on the server, where the final decisions
 * are always taken, and one instance will run on each client as well,
 * where the client emulates what it expects to be happening
 * on the server.
 *
 * The game engine's logic must listen to user inputs and
 * act on these inputs to change the game state.  For example,
 * the game engine listens to controller/keyboard inputs to infer
 * movement for the player/ship/first-person.  The game engine listens
 * to clicks, button-presses to infer firing, etc..
 *
 * Note that the game engine runs on both the server and on the
 * clients - but the server decisions always have the final say,
 * and therefore clients must resolve server updates which conflict
 * with client-side predictions.
 */
var GameEngine = function () {

  /**
    * Create a game engine instance.  This needs to happen
    * once on the server, and once on each client.
    *
    * @param {Object} options - options object
    * @param {Number} options.traceLevel - the trace level from 0 to 5.  Lower value traces more.
    * @param {Number} options.delayInputCount - client side only.  Introduce an artificial delay on the client to better match the time it will occur on the server.  This value sets the number of steps the client will wait before applying the input locally
    */
  function GameEngine(options) {
    _classCallCheck(this, GameEngine);

    // TODO I think we should discuss this whole globals issues
    // place the game engine in the LANCE globals
    var isServerSide = typeof window === 'undefined';
    var glob = isServerSide ? global : window;
    glob.LANCE = { gameEngine: this };

    // set options
    var defaultOpts = { GameWorld: _GameWorld2.default, traceLevel: _Trace2.default.TRACE_NONE };
    if (!isServerSide) defaultOpts.clientIDSpace = 1000000;
    this.options = Object.assign(defaultOpts, options);

    /**
     * client's player ID, as a string. If running on the client, this is set at runtime by the clientEngine
     * @member {String}
     */
    this.playerId = NaN;

    // set up event emitting and interface
    var eventEmitter = new _eventemitter2.default();

    /**
     * Register a handler for an event
     *
     * @method on
     * @memberof GameEngine
     * @instance
     * @param {String} eventName - name of the event
     * @param {Function} eventHandler - handler function
     */
    this.on = eventEmitter.on;

    /**
     * Register a handler for an event, called just once (if at all)
     *
     * @method once
     * @memberof GameEngine
     * @instance
     * @param {String} eventName - name of the event
     * @param {Function} eventHandler - handler function
     */
    this.once = eventEmitter.once;

    /**
     * Remove a handler
     *
     * @method removeListener
     * @memberof GameEngine
     * @instance
     * @param {String} eventName - name of the event
     * @param {Function} eventHandler - handler function
     */
    this.removeListener = eventEmitter.removeListener;

    this.emit = eventEmitter.emit;

    // set up trace
    this.trace = new _Trace2.default({ traceLevel: this.options.traceLevel });
  }

  _createClass(GameEngine, [{
    key: 'findLocalShadow',
    value: function findLocalShadow(serverObj) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {

        for (var _iterator = Object.keys(this.world.objects)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var localId = _step.value;

          if (Number(localId) < this.options.clientIDSpace) continue;
          var localObj = this.world.objects[localId];
          if (localObj.hasOwnProperty('inputId') && localObj.inputId === serverObj.inputId) return localObj;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return null;
    }
  }, {
    key: 'initWorld',
    value: function initWorld(worldSettings) {

      this.world = new _GameWorld2.default();

      // on the client we have a different ID space
      if (this.options.clientIDSpace) {
        this.world.idCount = this.options.clientIDSpace;
      }

      /**
      * The worldSettings defines the game world constants, such
      * as width, height, depth, etc. such that all other classes
      * can reference these values.
      * @member {Object} worldSettings
      * @memberof GameEngine
      */
      this.worldSettings = Object.assign({}, worldSettings);
    }

    /**
      * Start the game. This method runs on both server
      * and client. Extending the start method is useful
      * for setting up the game's worldSettings attribute,
      * and registering methods on the event handler.
      */

  }, {
    key: 'start',
    value: function start() {
      var _this = this;

      this.trace.info(function () {
        return '========== game engine started ==========';
      });
      this.initWorld();

      // create the default timer
      this.timer = new _Timer2.default();
      this.timer.play();
      this.on('postStep', function (step, isReenact) {
        if (!isReenact) _this.timer.tick();
      });

      this.emit('start', { timestamp: new Date().getTime() });
    }

    /**
      * Single game step.
      *
      * @param {Boolean} isReenact - is this step a re-enactment of the past.
      * @param {Number} t - the current time (optional)
      * @param {Number} dt - elapsed time since last step was called.  (optional)
      * @param {Boolean} physicsOnly - do a physics step only, no game logic
      */

  }, {
    key: 'step',
    value: function step(isReenact, t, dt, physicsOnly) {
      var _this2 = this;

      // physics-only step
      if (physicsOnly) {
        if (dt) dt /= 1000; // physics engines work in seconds
        this.physicsEngine.step(dt, objectFilter);
        return;
      }

      // emit preStep event
      if (isReenact === undefined) throw new Error('game engine does not forward argument isReenact to super class');

      isReenact = Boolean(isReenact);
      var step = ++this.world.stepCount;
      var clientIDSpace = this.options.clientIDSpace;
      this.emit('preStep', { step: step, isReenact: isReenact, dt: dt });

      // skip physics for shadow objects during re-enactment
      function objectFilter(o) {
        return !isReenact || o.id < clientIDSpace;
      }

      // physics step
      if (this.physicsEngine) {
        if (dt) dt /= 1000; // physics engines work in seconds
        this.physicsEngine.step(dt, objectFilter);
      }

      // for each object
      // - apply incremental bending
      // - refresh object positions after physics
      this.world.forEachObject(function (id, o) {
        if (typeof o.refreshFromPhysics === 'function') o.refreshFromPhysics();
        _this2.trace.trace(function () {
          return 'object[' + id + '] after ' + (isReenact ? 'reenact' : 'step') + ' : ' + o.toString();
        });
      });

      // emit postStep event
      this.emit('postStep', { step: step, isReenact: isReenact });
    }

    /**
     * Add object to the game world.
     * On the client side, the object may not be created, if the server copy
     * of this object is already in the game world.  This could happen when the client
     * is using delayed-input, and the RTT is very low.
     *
     * @param {Object} object - the object.
     * @return {Object} object - the final object.
     */

  }, {
    key: 'addObjectToWorld',
    value: function addObjectToWorld(object) {

      // if we are asked to create a local shadow object
      // the server copy may already have arrived.
      if (Number(object.id) >= this.options.clientIDSpace) {
        var serverCopyArrived = false;
        this.world.forEachObject(function (id, o) {
          if (o.hasOwnProperty('inputId') && o.inputId === object.inputId) serverCopyArrived = true;
        });
        if (serverCopyArrived) {
          this.trace.info(function () {
            return '========== shadow object NOT added ' + object.toString() + ' ==========';
          });
          return null;
        }
      }

      this.world.addObject(object);

      // tell the object to join the game, by creating
      // its corresponding physical entities and renderer entities.
      if (typeof object.onAddToWorld === 'function') object.onAddToWorld(this);

      this.emit('objectAdded', object);
      this.trace.info(function () {
        return '========== object added ' + object.toString() + ' ==========';
      });

      return object;
    }

    /**
     * Override this function to implement input handling.
     * This method will be called on the specific client where the
     * input was received, and will also be called on the server
     * when the input reaches the server.  The client does not call this
     * method directly, rather the client calls {@link ClientEngine#sendInput}
     * so that the input is sent to both server and client, and so that
     * the input is delayed artificially if so configured.
     *
     * The input is described by a short string, and is given an index.
     * The index is used internally to keep track of inputs which have already been applied
     * on the client during synchronization.  The input is also associated with
     * the ID of a player.
     *
     * @param {Object} inputMsg - input descriptor object
     * @param {String} inputMsg.input - describe the input (e.g. "up", "down", "fire")
     * @param {Number} inputMsg.messageIndex - input identifier
     * @param {Number} playerId - the player ID
     * @param {Boolean} isServer - indicate if this function is being called on the server side
     */

  }, {
    key: 'processInput',
    value: function processInput(inputMsg, playerId, isServer) {
      this.trace.info(function () {
        return 'game engine processing input[' + inputMsg.messageIndex + '] <' + inputMsg.input + '> from playerId ' + playerId;
      });
    }

    /**
     * Remove an object from the game world.
     *
     * @param {Object|String} objectId - the object or object ID
     */

  }, {
    key: 'removeObjectFromWorld',
    value: function removeObjectFromWorld(objectId) {

      if ((typeof objectId === 'undefined' ? 'undefined' : _typeof(objectId)) === 'object') objectId = objectId.id;
      var object = this.world.objects[objectId];

      if (!object) {
        throw new Error('Game attempted to remove a game object which doesn\'t (or never did) exist, id=' + objectId);
      }
      this.trace.info(function () {
        return '========== destroying object ' + object.toString() + ' ==========';
      });

      if (typeof object.onRemoveFromWorld === 'function') object.onRemoveFromWorld(this);

      this.emit('objectDestroyed', object);
      this.world.removeObject(objectId);
    }

    /**
     * Check if a given object is owned by the player on this client
     *
     * @param {Object} object the game object to check
     * @return {Boolean} true if the game object is owned by the player on this client
     */

  }, {
    key: 'isOwnedByPlayer',
    value: function isOwnedByPlayer(object) {
      return object.playerId == this.playerId;
    }

    /**
     * Register Game Object Classes
     *
     * @example
     * registerClasses(serializer) {
     *   serializer.registerClass(require('../common/Paddle'));
     *   serializer.registerClass(require('../common/Ball'));
     * }
     *
     * @param {Serializer} serializer - the serializer
     */

  }, {
    key: 'registerClasses',
    value: function registerClasses(serializer) {}
  }]);

  return GameEngine;
}();

/**
 * EVENTS
 */

/**
 * Marks the beginning of a new game step
 *
 * @event GameEngine#preStep
 * @param {Number} stepNumber - the step number
 * @param {Boolean} isReenact - is this step a re-enactment
 */

/**
 * Marks the end of a game step
 *
 * @event GameEngine#postStep
 * @param {Number} stepNumber - the step number
 * @param {Boolean} isReenact - is this step a re-enactment
 */

/**
 * An object has been added to the world
 *
 * @event GameEngine#objectAdded
 * @param {Object} obj - the new object
 */

/**
 * An object has been removed from the world
 *
 * @event GameEngine#objectDestroyed
 * @param {Object} obj - the object
 */

/**
 * A player has joined
 *
 * @event GameEngine#playerJoined
 * @param {Number} joinTime - epoch of join time
 * @param {Object} playerDesc - player descriptor
 * @param {String} playerDesc.playerId - the player ID
 */

/**
 * A player has left
 *
 * @event GameEngine#playerDisconnected
 * @param {Number} joinTime - epoch of join time
 * @param {Number} disconnectTime - epoch of disconnect time
 * @param {Object} playerDesc - player descriptor
 * @param {String} playerDesc.playerId - the player ID
 */

/**
 * A player has joined on the server
 *
 * @event GameEngine#server__playerJoined
 * @param {Number} joinTime - epoch of join time
 * @param {Object} playerDesc - player descriptor
 * @param {String} playerDesc.playerId - the player ID
 */

/**
  * A player has left on the server
  *
  * @event GameEngine#server__playerDisconnected
  * @param {Number} joinTime - epoch of join time
  * @param {Number} disconnectTime - epoch of disconnect time
  * @param {Object} playerDesc - player descriptor
  * @param {String} playerDesc.playerId - the player ID
  */

/**
 * A synchronization update arrived from the server
 *
 * @event GameEngine#syncReceived
 * @param {Object} sync - the synchronization object
 */

/**
 * Marks the beginning of a game step on the client
 *
 * @event GameEngine#client__preStep
 */

/**
 * Marks the end of a game step on the client
 *
 * @event GameEngine#client__postStep
 */

/**
 * An input needs to be handled.  Emitted just before the GameEngine
 * method processInput is invoked.
 *
 * @event GameEngine#processInput
 * @param {Object} input - input descriptor object
 * @param {String} input.input - describe the input (e.g. "up", "down", "fire")
 * @param {Number} input.messageIndex - input identifier
 * @param {Object} input.options - the object which was passed as SendInput's InputOptions parameter
 * @param {Number} input.step - input execution step
 * @param {Number} playerId - the player ID
 */

/**
 * An input needs to be handled.
 * This event is emitted on the server only, just before the
 * general processInput event.
 *
 * @event GameEngine#server__processInput
 * @param {Object} input - input descriptor object
 * @param {String} input.input - describe the input (e.g. "up", "down", "fire")
 * @param {Number} input.messageIndex - input identifier
 * @param {Object} input.options - the object which was passed as SendInput's InputOptions parameter
 * @param {Number} input.step - input execution step
 * @param {Number} playerId - the player ID
 */

/**
 * An input needs to be handled.
 * This event is emitted on the client only, just before the
 * general processInput event.
 *
 * @event GameEngine#client__processInput
 * @param {Object} input - input descriptor object
 * @param {String} input.input - describe the input (e.g. "up", "down", "fire")
 * @param {Number} input.messageIndex - input identifier
 * @param {Object} input.options - the object which was passed as SendInput's InputOptions parameter
 * @param {Number} input.step - input execution step
 * @param {Number} playerId - the player ID
 */

/**
 * Client received a sync from the server
 *
 * @event GameEngine#client__syncReceived
 * @param {Object} sync - sync from the server
 * @param {Array} syncEvents - array of events in the sync
 * @param {Number} maxStepCount - highest step in the sync
 */

/**
 * Client reset the world step
 *
 * @event GameEngine#client__stepReset
 * @param {Object} resetDesc - sync from the server
 * @param {Number} oldStep - the old step count
 * @param {Number} newStep - the new step count
 */

/**
 * Marks the beginning of a game step on the server
 *
 * @event GameEngine#server__preStep
 * @param {Number} stepNumber - the step number
 */

/**
 * Marks the end of a game step on the server
 *
 * @event GameEngine#server__postStep
 * @param {Number} stepNumber - the step number
 */

/**
 * User input received on the server
 *
 * @event GameEngine#server__inputReceived
 * @param {Object} input - input descriptor
 * @param {Object} input.data - input descriptor
 * @param {String} input.playerId - player that sent the input
 */

/**
 * Report slow frame rate on the browser.
 * The browser did not achieve a reasonable frame rate
 *
 * @event GameEngine#client__slowFrameRate
 */

/**
 * server has started
 *
 * @event GameEngine#start
 * @param {Number} timestamp - UTC epoch of start time
 */

exports.default = GameEngine;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

/**
 * This class represents an instance of the game world,
 * where all data pertaining to the current state of the
 * world is saved.
 */
var GameWorld = function () {

    /**
     * Constructor of the World instance
     */
    function GameWorld() {
        _classCallCheck(this, GameWorld);

        this.stepCount = 0;
        this.objects = {};
        this.playerCount = 0;
        this.idCount = 0;
    }

    /**
     * Gets a new, fresh and unused id that can be used for a new object
     * @return {Number} the new id
     */

    _createClass(GameWorld, [{
        key: 'getNewId',
        value: function getNewId() {
            var possibleId = this.idCount;
            // find a free id
            while (possibleId in this.objects) {
                possibleId++;
            }this.idCount = possibleId + 1;
            return possibleId;
        }

        /**
         * Returns all the game world objects which match a criteria
         * @param {Object} query The query object
         * @param {Object} [query.id] object id
         * @param {Object} [query.playerId] player id
         * @param {Class} [query.instanceType] matches whether `object instanceof instanceType`
         * @param {Array} [query.components] An array of component names
         * @param {Boolean} [query.returnSingle] Return the first object matched
         * @returns {Array | Object} All game objects which match all the query parameters, or the first match if returnSingle was specified
         */

    }, {
        key: 'queryObjects',
        value: function queryObjects(query) {
            var queriedObjects = [];

            // todo this is currently a somewhat inefficient implementation for API testing purposes.
            // It should be implemented with cached dictionaries like in nano-ecs
            this.forEachObject(function (id, object) {
                var conditions = [];

                // object id condition
                conditions.push(!('id' in query) || query.id && object.id === query.id);

                // player id condition
                conditions.push(!('playerId' in query) || query.playerId && object.playerId === query.playerId);

                // instance type conditio
                conditions.push(!('instanceType' in query) || query.instanceType && object instanceof query.instanceType);

                // components conditions
                if ('components' in query) {
                    query.components.forEach(function (componentClass) {
                        conditions.push(object.hasComponent(componentClass));
                    });
                }

                // all conditions are true, object is qualified for the query
                if (conditions.every(function (value) {
                    return value;
                })) {
                    queriedObjects.push(object);
                    if (query.returnSingle) return false;
                }
            });

            // return a single object or null
            if (query.returnSingle) {
                return queriedObjects.length > 0 ? queriedObjects[0] : null;
            }

            return queriedObjects;
        }

        /**
         * Returns The first game object encountered which matches a criteria.
         * Syntactic sugar for {@link queryObject} with `returnSingle: true`
         * @param query See queryObjects
         * @returns {Object}
         */

    }, {
        key: 'queryObject',
        value: function queryObject(query) {
            return this.queryObjects(Object.assign(query, {
                returnSingle: true
            }));
        }

        /**
         * Remove an object from the game world
         * @param object
         */

    }, {
        key: 'addObject',
        value: function addObject(object) {
            this.objects[object.id] = object;
        }

        /**
         * Add an object to the game world
         * @param id
         */

    }, {
        key: 'removeObject',
        value: function removeObject(id) {
            delete this.objects[id];
        }

        /**
         * World object iterator.
         * Invoke callback(objId, obj) for each object
         *
         * @param {function} callback function receives id and object. If callback returns false, the iteration will cease
         */

    }, {
        key: 'forEachObject',
        value: function forEachObject(callback) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.keys(this.objects)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var id = _step.value;

                    var returnValue = callback(id, this.objects[id]); // TODO: the key should be Number(id)
                    if (returnValue === false) break;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }]);

    return GameWorld;
}();

exports.default = GameWorld;

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var Timer = function () {
    function Timer() {
        _classCallCheck(this, Timer);

        this.currentTime = 0;
        this.isActive = false;
        this.idCounter = 0;

        this.events = {};
    }

    _createClass(Timer, [{
        key: 'play',
        value: function play() {
            this.isActive = true;
        }
    }, {
        key: 'tick',
        value: function tick() {
            var event = void 0;
            var eventId = void 0;

            if (this.isActive) {
                this.currentTime++;

                for (eventId in this.events) {
                    event = this.events[eventId];
                    if (event) {

                        if (event.type == 'repeat') {
                            if ((this.currentTime - event.startOffset) % event.time == 0) {
                                event.callback.apply(event.thisContext, event.args);
                            }
                        }
                        if (event.type == 'single') {
                            if ((this.currentTime - event.startOffset) % event.time == 0) {
                                event.callback.apply(event.thisContext, event.args);
                                event.destroy();
                            }
                        }
                    }
                }
            }
        }
    }, {
        key: 'destroyEvent',
        value: function destroyEvent(eventId) {
            delete this.events[eventId];
        }
    }, {
        key: 'loop',
        value: function loop(time, callback) {
            var timerEvent = new TimerEvent(this, TimerEvent.TYPES.repeat, time, callback);

            this.events[timerEvent.id] = timerEvent;

            return timerEvent;
        }
    }, {
        key: 'add',
        value: function add(time, callback, thisContext, args) {
            var timerEvent = new TimerEvent(this, TimerEvent.TYPES.single, time, callback, thisContext, args);

            this.events[timerEvent.id] = timerEvent;
            return timerEvent;
        }

        // todo implement timer delete all events

    }, {
        key: 'destroy',
        value: function destroy(id) {
            delete this.events[id];
        }
    }]);

    return Timer;
}();

// timer event


exports.default = Timer;

var TimerEvent = function TimerEvent(timer, type, time, callback, thisContext, args) {
    _classCallCheck(this, TimerEvent);

    this.id = ++timer.idCounter;
    this.timer = timer;
    this.type = type;
    this.time = time;
    this.callback = callback;
    this.startOffset = timer.currentTime;
    this.thisContext = thisContext;
    this.args = args;

    this.destroy = function () {
        this.timer.destroy(this.id);
    };
};

TimerEvent.TYPES = {
    repeat: 'repeat',
    single: 'single'
};

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
    return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

/**
 * Tracing Services.
 * Use the trace functions to trace game state.  Turn on tracing by
 * specifying the minimum trace level which should be recorded.  For
 * example, setting traceLevel to Trace.TRACE_INFO will cause info,
 * warn, and error traces to be recorded.
 */
var Trace = function () {
    function Trace(options) {
        _classCallCheck(this, Trace);

        this.options = Object.assign({
            traceLevel: this.TRACE_DEBUG
        }, options);

        this.traceBuffer = [];
        this.step = 'initializing';

        // syntactic sugar functions
        this.error = this.trace.bind(this, Trace.TRACE_ERROR);
        this.warn = this.trace.bind(this, Trace.TRACE_WARN);
        this.info = this.trace.bind(this, Trace.TRACE_INFO);
        this.debug = this.trace.bind(this, Trace.TRACE_DEBUG);
        this.trace = this.trace.bind(this, Trace.TRACE_ALL);
    }

    /**
     * Include all trace levels.
     * @member {Number} TRACE_ALL
     */

    _createClass(Trace, [{
        key: 'trace',
        value: function trace(level, dataCB) {

            // all traces must be functions which return strings
            if (typeof dataCB !== 'function') {
                throw new Error('Lance trace was called but instead of passing a function, it received a [' + (typeof dataCB === 'undefined' ? 'undefined' : _typeof(dataCB)) + ']');
            }

            if (level < this.options.traceLevel) return;

            this.traceBuffer.push({ data: dataCB(), level: level, step: this.step, time: new Date() });
        }
    }, {
        key: 'rotate',
        value: function rotate() {
            var buffer = this.traceBuffer;
            this.traceBuffer = [];
            return buffer;
        }
    }, {
        key: 'setStep',
        value: function setStep(s) {
            this.step = s;
        }
    }, {
        key: 'length',
        get: function get() {
            return this.traceBuffer.length;
        }
    }], [{
        key: 'TRACE_ALL',
        get: function get() {
            return 0;
        }

        /**
         * Include debug traces and higher.
         * @member {Number} TRACE_DEBUG
         */

    }, {
        key: 'TRACE_DEBUG',
        get: function get() {
            return 1;
        }

        /**
         * Include info traces and higher.
         * @member {Number} TRACE_INFO
         */

    }, {
        key: 'TRACE_INFO',
        get: function get() {
            return 2;
        }

        /**
         * Include warn traces and higher.
         * @member {Number} TRACE_WARN
         */

    }, {
        key: 'TRACE_WARN',
        get: function get() {
            return 3;
        }

        /**
         * Include error traces and higher.
         * @member {Number} TRACE_ERROR
         */

    }, {
        key: 'TRACE_ERROR',
        get: function get() {
            return 4;
        }

        /**
         * Disable all tracing.
         * @member {Number} TRACE_NONE
         */

    }, {
        key: 'TRACE_NONE',
        get: function get() {
            return 1000;
        }
    }]);

    return Trace;
}();

exports.default = Trace;

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _PhysicsEngine2 = __webpack_require__(93);

var _PhysicsEngine3 = _interopRequireDefault(_PhysicsEngine2);

var _TwoVector = __webpack_require__(6);

var _TwoVector2 = _interopRequireDefault(_TwoVector);

var _HSHGCollisionDetection = __webpack_require__(94);

var _HSHGCollisionDetection2 = _interopRequireDefault(_HSHGCollisionDetection);

var _BruteCollisionDetection = __webpack_require__(96);

var _BruteCollisionDetection2 = _interopRequireDefault(_BruteCollisionDetection);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var dv = new _TwoVector2.default();
var dx = new _TwoVector2.default();
/**
 * SimplePhysicsEngine is a pseudo-physics engine which works with
 * objects of class DynamicObject.
 */

var SimplePhysicsEngine = function (_PhysicsEngine) {
    _inherits(SimplePhysicsEngine, _PhysicsEngine);

    function SimplePhysicsEngine(initOptions) {
        _classCallCheck(this, SimplePhysicsEngine);

        // todo does this mean both modules always get loaded?
        var _this = _possibleConstructorReturn(this, (SimplePhysicsEngine.__proto__ || Object.getPrototypeOf(SimplePhysicsEngine)).call(this, initOptions));

        if (initOptions.collisions && initOptions.collisions.type === 'HSHG') {
            _this.collisionDetection = new _HSHGCollisionDetection2.default();
        } else {
            _this.collisionDetection = new _BruteCollisionDetection2.default();
        }

        /**
         * The actor's name.
         * @member {TwoVector} constant gravity affecting all objects
         */
        _this.gravity = new _TwoVector2.default(0, 0);

        if (initOptions.gravity) _this.gravity.copy(initOptions.gravity);

        var collisionOptions = Object.assign({ gameEngine: _this.gameEngine }, initOptions.collisionOptions);
        _this.collisionDetection.init(collisionOptions);
        return _this;
    }

    // a single object advances, based on:
    // isRotatingRight, isRotatingLeft, isAccelerating, current velocity
    // wrap-around the world if necessary


    _createClass(SimplePhysicsEngine, [{
        key: 'objectStep',
        value: function objectStep(o, dt) {

            // calculate factor
            if (dt === 0) return;

            if (dt) dt /= 1 / 60;else dt = 1;

            var worldSettings = this.gameEngine.worldSettings;

            if (o.isRotatingRight) {
                o.angle += o.rotationSpeed;
            }
            if (o.isRotatingLeft) {
                o.angle -= o.rotationSpeed;
            }

            if (o.angle >= 360) {
                o.angle -= 360;
            }
            if (o.angle < 0) {
                o.angle += 360;
            }

            if (o.isAccelerating) {
                var rad = o.angle * (Math.PI / 180);
                dv.set(Math.cos(rad), Math.sin(rad)).multiplyScalar(o.acceleration).multiplyScalar(dt);
                o.velocity.add(dv);
            }

            // apply gravity
            if (o.affectedByGravity) o.velocity.add(this.gravity);

            var velMagnitude = o.velocity.length();
            if (o.maxSpeed !== null && velMagnitude > o.maxSpeed) {
                o.velocity.multiplyScalar(o.maxSpeed / velMagnitude);
            }

            o.isAccelerating = false;
            o.isRotatingLeft = false;
            o.isRotatingRight = false;

            dx.copy(o.velocity).multiplyScalar(dt);
            o.position.add(dx);

            o.velocity.multiply(o.friction);

            // wrap around the world edges
            if (worldSettings.worldWrap) {
                if (o.position.x >= worldSettings.width) {
                    o.position.x -= worldSettings.width;
                }
                if (o.position.y >= worldSettings.height) {
                    o.position.y -= worldSettings.height;
                }
                if (o.position.x < 0) {
                    o.position.x += worldSettings.width;
                }
                if (o.position.y < 0) {
                    o.position.y += worldSettings.height;
                }
            }
        }

        // entry point for a single step of the Simple Physics

    }, {
        key: 'step',
        value: function step(dt, objectFilter) {

            // each object should advance
            var objects = this.gameEngine.world.objects;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.keys(objects)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var objId = _step.value;

                    // shadow objects are not re-enacted
                    var ob = objects[objId];
                    if (!objectFilter(ob)) continue;

                    // run the object step
                    this.objectStep(ob, dt);
                }

                // emit event on collision
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            this.collisionDetection.detect(this.gameEngine);
        }
    }]);

    return SimplePhysicsEngine;
}(_PhysicsEngine3.default);

exports.default = SimplePhysicsEngine;

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

// The base Physics Engine class defines the expected interface
// for all physics engines
var PhysicsEngine = function () {
    function PhysicsEngine(options) {
        _classCallCheck(this, PhysicsEngine);

        this.options = options;
        this.gameEngine = options.gameEngine;

        if (!options.gameEngine) {
            console.warn('Physics engine initialized without gameEngine!');
        }
    }

    /**
     * A single Physics step.
     *
     * @param {Number} dt - time elapsed since last step
     * @param {Function} objectFilter - a test function which filters which objects should move
     */

    _createClass(PhysicsEngine, [{
        key: 'step',
        value: function step(dt, objectFilter) {}
    }]);

    return PhysicsEngine;
}();

exports.default = PhysicsEngine;

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _HSHG = __webpack_require__(95);

var _HSHG2 = _interopRequireDefault(_HSHG);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

// Collision detection based on Hierarchical Spatial Hash Grid
// uses this implementation https://gist.github.com/kirbysayshi/1760774
var HSHGCollisionDetection = function () {
    function HSHGCollisionDetection(options) {
        _classCallCheck(this, HSHGCollisionDetection);

        this.options = Object.assign({ COLLISION_DISTANCE: 28 }, options);
    }

    _createClass(HSHGCollisionDetection, [{
        key: 'init',
        value: function init(options) {
            var _this = this;

            this.gameEngine = options.gameEngine;
            this.grid = new _HSHG2.default();
            this.previousCollisionPairs = {};
            this.stepCollidingPairs = {};

            this.gameEngine.on('objectAdded', function (obj) {
                // add the gameEngine obj the the spatial grid
                _this.grid.addObject(obj);
            });

            this.gameEngine.on('objectDestroyed', function (obj) {
                // add the gameEngine obj the the spatial grid
                _this.grid.removeObject(obj);
            });
        }
    }, {
        key: 'detect',
        value: function detect() {
            this.grid.update();
            this.stepCollidingPairs = this.grid.queryForCollisionPairs().reduce(function (accumulator, currentValue, i) {
                var pairId = getArrayPairId(currentValue);
                accumulator[pairId] = { o1: currentValue[0], o2: currentValue[1] };
                return accumulator;
            }, {});

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.keys(this.previousCollisionPairs)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var pairId = _step.value;

                    var pairObj = this.previousCollisionPairs[pairId];

                    // existed in previous pairs, but not during this step: this pair stopped colliding
                    if (pairId in this.stepCollidingPairs === false) {
                        this.gameEngine.emit('collisionStop', pairObj);
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = Object.keys(this.stepCollidingPairs)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _pairId = _step2.value;

                    var _pairObj = this.stepCollidingPairs[_pairId];

                    // didn't exist in previous pairs, but exists now: this is a new colliding pair
                    if (_pairId in this.previousCollisionPairs === false) {
                        this.gameEngine.emit('collisionStart', _pairObj);
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            this.previousCollisionPairs = this.stepCollidingPairs;
        }

        /**
         * checks wheter two objects are currently colliding
         * @param o1 {Object} first object
         * @param o2 {Object} second object
         * @returns {boolean} are the two objects colliding?
         */

    }, {
        key: 'areObjectsColliding',
        value: function areObjectsColliding(o1, o2) {
            return getArrayPairId([o1, o2]) in this.stepCollidingPairs;
        }
    }]);

    return HSHGCollisionDetection;
}();

exports.default = HSHGCollisionDetection;

function getArrayPairId(arrayPair) {
    // make sure to get the same id regardless of object order
    var sortedArrayPair = arrayPair.slice(0).sort();
    return sortedArrayPair[0].id + '-' + sortedArrayPair[1].id;
}

module.exports = HSHGCollisionDetection;

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
// Hierarchical Spatial Hash Grid: HSHG
// source: https://gist.github.com/kirbysayshi/1760774

// ---------------------------------------------------------------------
// GLOBAL FUNCTIONS
// ---------------------------------------------------------------------

/**
 * Updates every object's position in the grid, but only if
 * the hash value for that object has changed.
 * This method DOES NOT take into account object expansion or
 * contraction, just position, and does not attempt to change
 * the grid the object is currently in; it only (possibly) changes
 * the cell.
 *
 * If the object has significantly changed in size, the best bet is to
 * call removeObject() and addObject() sequentially, outside of the
 * normal update cycle of HSHG.
 *
 * @return  void   desc
 */
function update_RECOMPUTE() {

    var i, obj, grid, meta, objAABB, newObjHash;

    // for each object
    for (i = 0; i < this._globalObjects.length; i++) {
        obj = this._globalObjects[i];
        meta = obj.HSHG;
        grid = meta.grid;

        // recompute hash
        objAABB = obj.getAABB();
        newObjHash = grid.toHash(objAABB.min[0], objAABB.min[1]);

        if (newObjHash !== meta.hash) {
            // grid position has changed, update!
            grid.removeObject(obj);
            grid.addObject(obj, newObjHash);
        }
    }
}

// not implemented yet :)
function update_REMOVEALL() {}

function testAABBOverlap(objA, objB) {
    var a = objA.getAABB(),
        b = objB.getAABB();

    // if(a.min[0] > b.max[0] || a.min[1] > b.max[1] || a.min[2] > b.max[2]
    // || a.max[0] < b.min[0] || a.max[1] < b.min[1] || a.max[2] < b.min[2]){

    if (a.min[0] > b.max[0] || a.min[1] > b.max[1] || a.max[0] < b.min[0] || a.max[1] < b.min[1]) {
        return false;
    }
    return true;
}

function getLongestAABBEdge(min, max) {
    return Math.max(Math.abs(max[0] - min[0]), Math.abs(max[1] - min[1])
    // ,Math.abs(max[2] - min[2])
    );
}

// ---------------------------------------------------------------------
// ENTITIES
// ---------------------------------------------------------------------

function HSHG() {

    this.MAX_OBJECT_CELL_DENSITY = 1 / 8; // objects / cells
    this.INITIAL_GRID_LENGTH = 256; // 16x16
    this.HIERARCHY_FACTOR = 2;
    this.HIERARCHY_FACTOR_SQRT = Math.SQRT2;
    this.UPDATE_METHOD = update_RECOMPUTE; // or update_REMOVEALL

    this._grids = [];
    this._globalObjects = [];
}

// HSHG.prototype.init = function(){
//	this._grids = [];
//	this._globalObjects = [];
// }

HSHG.prototype.addObject = function (obj) {
    var x,
        i,
        cellSize,
        objAABB = obj.getAABB(),
        objSize = getLongestAABBEdge(objAABB.min, objAABB.max),
        oneGrid,
        newGrid;

    // for HSHG metadata
    obj.HSHG = {
        globalObjectsIndex: this._globalObjects.length
    };

    // add to global object array
    this._globalObjects.push(obj);

    if (this._grids.length == 0) {
        // no grids exist yet
        cellSize = objSize * this.HIERARCHY_FACTOR_SQRT;
        newGrid = new Grid(cellSize, this.INITIAL_GRID_LENGTH, this);
        newGrid.initCells();
        newGrid.addObject(obj);

        this._grids.push(newGrid);
    } else {
        x = 0;

        // grids are sorted by cellSize, smallest to largest
        for (i = 0; i < this._grids.length; i++) {
            oneGrid = this._grids[i];
            x = oneGrid.cellSize;
            if (objSize < x) {
                x /= this.HIERARCHY_FACTOR;
                if (objSize < x) {
                    // find appropriate size
                    while (objSize < x) {
                        x /= this.HIERARCHY_FACTOR;
                    }
                    newGrid = new Grid(x * this.HIERARCHY_FACTOR, this.INITIAL_GRID_LENGTH, this);
                    newGrid.initCells();
                    // assign obj to grid
                    newGrid.addObject(obj);
                    // insert grid into list of grids directly before oneGrid
                    this._grids.splice(i, 0, newGrid);
                } else {
                    // insert obj into grid oneGrid
                    oneGrid.addObject(obj);
                }
                return;
            }
        }

        while (objSize >= x) {
            x *= this.HIERARCHY_FACTOR;
        }

        newGrid = new Grid(x, this.INITIAL_GRID_LENGTH, this);
        newGrid.initCells();
        // insert obj into grid
        newGrid.addObject(obj);
        // add newGrid as last element in grid list
        this._grids.push(newGrid);
    }
};

HSHG.prototype.removeObject = function (obj) {
    var meta = obj.HSHG,
        globalObjectsIndex,
        replacementObj;

    if (meta === undefined) {
        throw Error(obj + ' was not in the HSHG.');
        return;
    }

    // remove object from global object list
    globalObjectsIndex = meta.globalObjectsIndex;
    if (globalObjectsIndex === this._globalObjects.length - 1) {
        this._globalObjects.pop();
    } else {
        replacementObj = this._globalObjects.pop();
        replacementObj.HSHG.globalObjectsIndex = globalObjectsIndex;
        this._globalObjects[globalObjectsIndex] = replacementObj;
    }

    meta.grid.removeObject(obj);

    // remove meta data
    delete obj.HSHG;
};

HSHG.prototype.update = function () {
    this.UPDATE_METHOD.call(this);
};

HSHG.prototype.queryForCollisionPairs = function (broadOverlapTestCallback) {

    var i,
        j,
        k,
        l,
        c,
        grid,
        cell,
        objA,
        objB,
        offset,
        adjacentCell,
        biggerGrid,
        objAAABB,
        objAHashInBiggerGrid,
        possibleCollisions = [];

    // default broad test to internal aabb overlap test
    var broadOverlapTest = broadOverlapTestCallback || testAABBOverlap;

    // for all grids ordered by cell size ASC
    for (i = 0; i < this._grids.length; i++) {
        grid = this._grids[i];

        // for each cell of the grid that is occupied
        for (j = 0; j < grid.occupiedCells.length; j++) {
            cell = grid.occupiedCells[j];

            // collide all objects within the occupied cell
            for (k = 0; k < cell.objectContainer.length; k++) {
                objA = cell.objectContainer[k];
                for (l = k + 1; l < cell.objectContainer.length; l++) {
                    objB = cell.objectContainer[l];
                    if (broadOverlapTest(objA, objB) === true) {
                        possibleCollisions.push([objA, objB]);
                    }
                }
            }

            // for the first half of all adjacent cells (offset 4 is the current cell)
            for (c = 0; c < 4; c++) {
                offset = cell.neighborOffsetArray[c];

                // if(offset === null) { continue; }

                adjacentCell = grid.allCells[cell.allCellsIndex + offset];

                // collide all objects in cell with adjacent cell
                for (k = 0; k < cell.objectContainer.length; k++) {
                    objA = cell.objectContainer[k];
                    for (l = 0; l < adjacentCell.objectContainer.length; l++) {
                        objB = adjacentCell.objectContainer[l];
                        if (broadOverlapTest(objA, objB) === true) {
                            possibleCollisions.push([objA, objB]);
                        }
                    }
                }
            }
        }

        // forall objects that are stored in this grid
        for (j = 0; j < grid.allObjects.length; j++) {
            objA = grid.allObjects[j];
            objAAABB = objA.getAABB();

            // for all grids with cellsize larger than grid
            for (k = i + 1; k < this._grids.length; k++) {
                biggerGrid = this._grids[k];
                objAHashInBiggerGrid = biggerGrid.toHash(objAAABB.min[0], objAAABB.min[1]);
                cell = biggerGrid.allCells[objAHashInBiggerGrid];

                // check objA against every object in all cells in offset array of cell
                // for all adjacent cells...
                for (c = 0; c < cell.neighborOffsetArray.length; c++) {
                    offset = cell.neighborOffsetArray[c];

                    // if(offset === null) { continue; }

                    adjacentCell = biggerGrid.allCells[cell.allCellsIndex + offset];

                    // for all objects in the adjacent cell...
                    for (l = 0; l < adjacentCell.objectContainer.length; l++) {
                        objB = adjacentCell.objectContainer[l];
                        // test against object A
                        if (broadOverlapTest(objA, objB) === true) {
                            possibleCollisions.push([objA, objB]);
                        }
                    }
                }
            }
        }
    }

    // return list of object pairs
    return possibleCollisions;
};

HSHG.update_RECOMPUTE = update_RECOMPUTE;
HSHG.update_REMOVEALL = update_REMOVEALL;

/**
 * Grid
 *
 * @constructor
 * @param    int cellSize  the pixel size of each cell of the grid
 * @param    int cellCount  the total number of cells for the grid (width x height)
 * @param    HSHG parentHierarchy    the HSHG to which this grid belongs
 * @return  void
 */
function Grid(cellSize, cellCount, parentHierarchy) {
    this.cellSize = cellSize;
    this.inverseCellSize = 1 / cellSize;
    this.rowColumnCount = ~~Math.sqrt(cellCount);
    this.xyHashMask = this.rowColumnCount - 1;
    this.occupiedCells = [];
    this.allCells = Array(this.rowColumnCount * this.rowColumnCount);
    this.allObjects = [];
    this.sharedInnerOffsets = [];

    this._parentHierarchy = parentHierarchy || null;
}

Grid.prototype.initCells = function () {

    // TODO: inner/unique offset rows 0 and 2 may need to be
    // swapped due to +y being "down" vs "up"

    var i,
        gridLength = this.allCells.length,
        x,
        y,
        wh = this.rowColumnCount,
        isOnRightEdge,
        isOnLeftEdge,
        isOnTopEdge,
        isOnBottomEdge,
        innerOffsets = [
    // y+ down offsets
    // -1 + -wh, -wh, -wh + 1,
    // -1, 0, 1,
    // wh - 1, wh, wh + 1

    // y+ up offsets
    wh - 1, wh, wh + 1, -1, 0, 1, -1 + -wh, -wh, -wh + 1],
        leftOffset,
        rightOffset,
        topOffset,
        bottomOffset,
        uniqueOffsets = [],
        cell;

    this.sharedInnerOffsets = innerOffsets;

    // init all cells, creating offset arrays as needed

    for (i = 0; i < gridLength; i++) {

        cell = new Cell();
        // compute row (y) and column (x) for an index
        y = ~~(i / this.rowColumnCount);
        x = ~~(i - y * this.rowColumnCount);

        // reset / init
        isOnRightEdge = false;
        isOnLeftEdge = false;
        isOnTopEdge = false;
        isOnBottomEdge = false;

        // right or left edge cell
        if ((x + 1) % this.rowColumnCount == 0) {
            isOnRightEdge = true;
        } else if (x % this.rowColumnCount == 0) {
            isOnLeftEdge = true;
        }

        // top or bottom edge cell
        if ((y + 1) % this.rowColumnCount == 0) {
            isOnTopEdge = true;
        } else if (y % this.rowColumnCount == 0) {
            isOnBottomEdge = true;
        }

        // if cell is edge cell, use unique offsets, otherwise use inner offsets
        if (isOnRightEdge || isOnLeftEdge || isOnTopEdge || isOnBottomEdge) {

            // figure out cardinal offsets first
            rightOffset = isOnRightEdge === true ? -wh + 1 : 1;
            leftOffset = isOnLeftEdge === true ? wh - 1 : -1;
            topOffset = isOnTopEdge === true ? -gridLength + wh : wh;
            bottomOffset = isOnBottomEdge === true ? gridLength - wh : -wh;

            // diagonals are composites of the cardinals
            uniqueOffsets = [
            // y+ down offset
            // leftOffset + bottomOffset, bottomOffset, rightOffset + bottomOffset,
            // leftOffset, 0, rightOffset,
            // leftOffset + topOffset, topOffset, rightOffset + topOffset

            // y+ up offset
            leftOffset + topOffset, topOffset, rightOffset + topOffset, leftOffset, 0, rightOffset, leftOffset + bottomOffset, bottomOffset, rightOffset + bottomOffset];

            cell.neighborOffsetArray = uniqueOffsets;
        } else {
            cell.neighborOffsetArray = this.sharedInnerOffsets;
        }

        cell.allCellsIndex = i;
        this.allCells[i] = cell;
    }
};

Grid.prototype.toHash = function (x, y, z) {
    var i, xHash, yHash, zHash;

    if (x < 0) {
        i = -x * this.inverseCellSize;
        xHash = this.rowColumnCount - 1 - (~~i & this.xyHashMask);
    } else {
        i = x * this.inverseCellSize;
        xHash = ~~i & this.xyHashMask;
    }

    if (y < 0) {
        i = -y * this.inverseCellSize;
        yHash = this.rowColumnCount - 1 - (~~i & this.xyHashMask);
    } else {
        i = y * this.inverseCellSize;
        yHash = ~~i & this.xyHashMask;
    }

    // if(z < 0){
    //	i = (-z) * this.inverseCellSize;
    //	zHash = this.rowColumnCount - 1 - ( ~~i & this.xyHashMask );
    // } else {
    //	i = z * this.inverseCellSize;
    //	zHash = ~~i & this.xyHashMask;
    // }

    return xHash + yHash * this.rowColumnCount;
    // + zHash * this.rowColumnCount * this.rowColumnCount;
};

Grid.prototype.addObject = function (obj, hash) {
    var objAABB, objHash, targetCell;

    // technically, passing this in this should save some computational effort when updating objects
    if (hash !== undefined) {
        objHash = hash;
    } else {
        objAABB = obj.getAABB();
        objHash = this.toHash(objAABB.min[0], objAABB.min[1]);
    }
    targetCell = this.allCells[objHash];

    if (targetCell.objectContainer.length === 0) {
        // insert this cell into occupied cells list
        targetCell.occupiedCellsIndex = this.occupiedCells.length;
        this.occupiedCells.push(targetCell);
    }

    // add meta data to obj, for fast update/removal
    obj.HSHG.objectContainerIndex = targetCell.objectContainer.length;
    obj.HSHG.hash = objHash;
    obj.HSHG.grid = this;
    obj.HSHG.allGridObjectsIndex = this.allObjects.length;
    // add obj to cell
    targetCell.objectContainer.push(obj);

    // we can assume that the targetCell is already a member of the occupied list

    // add to grid-global object list
    this.allObjects.push(obj);

    // do test for grid density
    if (this.allObjects.length / this.allCells.length > this._parentHierarchy.MAX_OBJECT_CELL_DENSITY) {
        // grid must be increased in size
        this.expandGrid();
    }
};

Grid.prototype.removeObject = function (obj) {
    var meta = obj.HSHG,
        hash,
        containerIndex,
        allGridObjectsIndex,
        cell,
        replacementCell,
        replacementObj;

    hash = meta.hash;
    containerIndex = meta.objectContainerIndex;
    allGridObjectsIndex = meta.allGridObjectsIndex;
    cell = this.allCells[hash];

    // remove object from cell object container
    if (cell.objectContainer.length === 1) {
        // this is the last object in the cell, so reset it
        cell.objectContainer.length = 0;

        // remove cell from occupied list
        if (cell.occupiedCellsIndex === this.occupiedCells.length - 1) {
            // special case if the cell is the newest in the list
            this.occupiedCells.pop();
        } else {
            replacementCell = this.occupiedCells.pop();
            replacementCell.occupiedCellsIndex = cell.occupiedCellsIndex;
            this.occupiedCells[cell.occupiedCellsIndex] = replacementCell;
        }

        cell.occupiedCellsIndex = null;
    } else {
        // there is more than one object in the container
        if (containerIndex === cell.objectContainer.length - 1) {
            // special case if the obj is the newest in the container
            cell.objectContainer.pop();
        } else {
            replacementObj = cell.objectContainer.pop();
            replacementObj.HSHG.objectContainerIndex = containerIndex;
            cell.objectContainer[containerIndex] = replacementObj;
        }
    }

    // remove object from grid object list
    if (allGridObjectsIndex === this.allObjects.length - 1) {
        this.allObjects.pop();
    } else {
        replacementObj = this.allObjects.pop();
        replacementObj.HSHG.allGridObjectsIndex = allGridObjectsIndex;
        this.allObjects[allGridObjectsIndex] = replacementObj;
    }
};

Grid.prototype.expandGrid = function () {
    var i,
        j,
        currentCellCount = this.allCells.length,
        currentRowColumnCount = this.rowColumnCount,
        currentXYHashMask = this.xyHashMask,
        newCellCount = currentCellCount * 4,

    // double each dimension
    newRowColumnCount = ~~Math.sqrt(newCellCount),
        newXYHashMask = newRowColumnCount - 1,
        allObjects = this.allObjects.slice(0),

    // duplicate array, not objects contained
    aCell,
        push = Array.prototype.push;

    // remove all objects
    for (i = 0; i < allObjects.length; i++) {
        this.removeObject(allObjects[i]);
    }

    // reset grid values, set new grid to be 4x larger than last
    this.rowColumnCount = newRowColumnCount;
    this.allCells = Array(this.rowColumnCount * this.rowColumnCount);
    this.xyHashMask = newXYHashMask;

    // initialize new cells
    this.initCells();

    // re-add all objects to grid
    for (i = 0; i < allObjects.length; i++) {
        this.addObject(allObjects[i]);
    }
};

/**
 * A cell of the grid
 *
 * @constructor
 * @return  void   desc
 */
function Cell() {
    this.objectContainer = [];
    this.neighborOffsetArray;
    this.occupiedCellsIndex = null;
    this.allCellsIndex = null;
}

// ---------------------------------------------------------------------
// EXPORTS
// ---------------------------------------------------------------------

HSHG._private = {
    Grid: Grid,
    Cell: Cell,
    testAABBOverlap: testAABBOverlap,
    getLongestAABBEdge: getLongestAABBEdge
};

exports.default = HSHG;

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _TwoVector = __webpack_require__(6);

var _TwoVector2 = _interopRequireDefault(_TwoVector);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var differenceVector = new _TwoVector2.default();

// The collision detection of SimplePhysicsEngine is a brute-force approach

var CollisionDetection = function () {
    function CollisionDetection(options) {
        _classCallCheck(this, CollisionDetection);

        this.options = Object.assign({ COLLISION_DISTANCE: 28 }, options);
        this.collisionPairs = {};
    }

    _createClass(CollisionDetection, [{
        key: 'init',
        value: function init(options) {
            this.gameEngine = options.gameEngine;
        }

        // check if pair (id1, id2) have collided

    }, {
        key: 'checkPair',
        value: function checkPair(id1, id2) {
            var objects = this.gameEngine.world.objects;
            var o1 = objects[id1];
            var o2 = objects[id2];

            // make sure that objects actually exist. might have been destroyed
            if (!o1 || !o2) return;
            var pairId = [id1, id2].join(',');
            differenceVector.copy(o1.position).subtract(o2.position);

            if (differenceVector.length() < this.options.COLLISION_DISTANCE) {
                if (!(pairId in this.collisionPairs)) {
                    this.collisionPairs[pairId] = true;
                    this.gameEngine.emit('collisionStart', { o1: o1, o2: o2 });
                }
            } else if (pairId in this.collisionPairs) {
                this.gameEngine.emit('collisionStop', { o1: o1, o2: o2 });
                delete this.collisionPairs[pairId];
            }
        }

        // detect by checking all pairs

    }, {
        key: 'detect',
        value: function detect() {
            var objects = this.gameEngine.world.objects;
            var keys = Object.keys(objects);

            //Delete non existed object's pairs
            for (var pairId in this.collisionPairs) {
                if (this.collisionPairs.hasOwnProperty(pairId)) if (keys.indexOf(pairId.split(',')[0]) === -1 || keys.indexOf(pairId.split(',')[1]) === -1) delete this.collisionPairs[pairId];
            }var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var k1 = _step.value;
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = keys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var k2 = _step2.value;

                            if (k2 > k1) this.checkPair(k1, k2);
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }]);

    return CollisionDetection;
}();

exports.default = CollisionDetection;

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _DynamicObject2 = __webpack_require__(16);

var _DynamicObject3 = _interopRequireDefault(_DynamicObject2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PlayerAvatar = function (_DynamicObject) {
    _inherits(PlayerAvatar, _DynamicObject);

    _createClass(PlayerAvatar, null, [{
        key: 'netScheme',
        get: function get() {
            return Object.assign({
                // add serializable properties here
            }, _get(PlayerAvatar.__proto__ || Object.getPrototypeOf(PlayerAvatar), 'netScheme', this));
        }
    }]);

    function PlayerAvatar(gameEngine, options, props) {
        _classCallCheck(this, PlayerAvatar);

        var _this = _possibleConstructorReturn(this, (PlayerAvatar.__proto__ || Object.getPrototypeOf(PlayerAvatar)).call(this, gameEngine, options, props));

        _this.class = PlayerAvatar;
        return _this;
    }

    return PlayerAvatar;
}(_DynamicObject3.default);

exports.default = PlayerAvatar;

/***/ })
/******/ ]);
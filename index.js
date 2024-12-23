var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("types", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Utilities/getMinMax", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function getMinMax(arrayPixel) {
        var min = arrayPixel[0];
        var max = arrayPixel[0];
        for (var i = 1; i < arrayPixel.length; i++) {
            var pixel = arrayPixel[i];
            if (pixel < min)
                min = pixel;
            if (pixel > max)
                max = pixel;
        }
        return { min: min, max: max };
    }
    exports.default = getMinMax;
});
define("DecodedImage", ["require", "exports", "Utilities/getMinMax"], function (require, exports, getMinMax_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DecodedImage = /** @class */ (function () {
        function DecodedImage(transferSyntax, width, height, pixelData) {
            Object.defineProperty(this, "transferSyntax", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            Object.defineProperty(this, "width", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            Object.defineProperty(this, "height", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            Object.defineProperty(this, "min", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            Object.defineProperty(this, "max", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            Object.defineProperty(this, "windowWidth", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            Object.defineProperty(this, "windowCenter", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            Object.defineProperty(this, "pixelData", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            Object.defineProperty(this, "photometricInterpretation", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            Object.defineProperty(this, "pixelModule", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            Object.defineProperty(this, "scalingModule", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            Object.defineProperty(this, "voiLUTModule", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            Object.defineProperty(this, "arrayType", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            this.transferSyntax = transferSyntax;
            this.width = width;
            this.height = height;
            this.pixelData = pixelData;
        }
        Object.defineProperty(DecodedImage.prototype, "getMinMax", {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function () {
                if (!this.min || this.max) {
                    return (0, getMinMax_1.default)(this.pixelData);
                }
                return {
                    min: this.min,
                    max: this.max,
                };
            }
        });
        Object.defineProperty(DecodedImage.prototype, "getLUT", {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function () {
                return __assign(__assign({}, this.getMinMax()), { windowWidth: this.windowWidth, windowCenter: this.windowCenter });
            }
        });
        return DecodedImage;
    }());
    exports.default = DecodedImage;
});
define("JPEG2000", ["require", "exports", "@abasb75/jpeg2000-decoder"], function (require, exports, jpeg2000_decoder_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var JPEG2000 = /** @class */ (function () {
        function JPEG2000() {
        }
        Object.defineProperty(JPEG2000, "decode", {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function (pixelData) {
                return __awaiter(this, void 0, void 0, function () {
                    var arrayBuffer, offset, length, decoded;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                arrayBuffer = pixelData.buffer;
                                offset = pixelData.byteOffset;
                                length = pixelData.byteLength;
                                return [4 /*yield*/, (0, jpeg2000_decoder_1.decode)(arrayBuffer.slice(offset, length))];
                            case 1:
                                decoded = _a.sent();
                                return [2 /*return*/, decoded.decodedBuffer];
                        }
                    });
                });
            }
        });
        return JPEG2000;
    }());
    exports.default = JPEG2000;
});
define("JPEGBaselineLossyProcess1_8bit", ["require", "exports", "@abasb75/turbojpeg-decoder", "@abasb75/jpegjs"], function (require, exports, turbojpeg_decoder_1, jpegjs_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var JPEGBaselineLossyProcess1_8bit = /** @class */ (function () {
        function JPEGBaselineLossyProcess1_8bit() {
        }
        Object.defineProperty(JPEGBaselineLossyProcess1_8bit, "decode", {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function (pixelData, options) {
                return __awaiter(this, void 0, void 0, function () {
                    var _a, data;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 1, , 3]);
                                if (options.bitsAllocated === 8 &&
                                    [3, 4].includes(options.samplesPerPixel)) {
                                    return [2 /*return*/, JPEGBaselineLossyProcess1_8bit.browser(pixelData)];
                                }
                                else {
                                    return [2 /*return*/, JPEGBaselineLossyProcess1_8bit.jpegJS(pixelData, options)];
                                }
                                return [3 /*break*/, 3];
                            case 1:
                                _a = _b.sent();
                                return [4 /*yield*/, JPEGBaselineLossyProcess1_8bit.turboJpeg(pixelData)];
                            case 2:
                                data = _b.sent();
                                return [2 /*return*/, data];
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            }
        });
        Object.defineProperty(JPEGBaselineLossyProcess1_8bit, "jpegJS", {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function (pixelData, options) {
                return __awaiter(this, void 0, void 0, function () {
                    var jpeg;
                    return __generator(this, function (_a) {
                        jpeg = new jpegjs_1.default();
                        jpeg.parse(new Uint8Array(pixelData.buffer));
                        if (options.bitsAllocated > 8) {
                            return [2 /*return*/, jpeg.getData16(options.columns, options.rows)];
                        }
                        return [2 /*return*/, jpeg.getData(options.columns, options.rows)];
                    });
                });
            }
        });
        Object.defineProperty(JPEGBaselineLossyProcess1_8bit, "browser", {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function (pixelData) {
                return __awaiter(this, void 0, void 0, function () {
                    var createImage, arrayBufferView, blob, urlCreator, imageUrl, img, canvas, context, imageData;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                createImage = function (imageData) { return new Promise(function (resolve, reject) {
                                    var img = document.createElement('img');
                                    img.src = imageData;
                                    img.onload = function () {
                                        resolve(img);
                                    };
                                    img.onerror = function () {
                                        reject();
                                    };
                                }); };
                                arrayBufferView = new Uint8Array(pixelData.buffer);
                                blob = new Blob([arrayBufferView], { type: "image/jpeg" });
                                urlCreator = window.URL || window.webkitURL;
                                imageUrl = urlCreator.createObjectURL(blob);
                                return [4 /*yield*/, createImage(imageUrl)];
                            case 1:
                                img = _b.sent();
                                canvas = document.createElement('canvas');
                                canvas.height = img.height;
                                canvas.width = img.width;
                                context = canvas.getContext('2d');
                                context === null || context === void 0 ? void 0 : context.drawImage(img, 0, 0);
                                imageData = context === null || context === void 0 ? void 0 : context.getImageData(0, 0, img.width, img.height);
                                return [2 /*return*/, new Uint8Array((_a = imageData === null || imageData === void 0 ? void 0 : imageData.data) === null || _a === void 0 ? void 0 : _a.buffer)];
                        }
                    });
                });
            }
        });
        Object.defineProperty(JPEGBaselineLossyProcess1_8bit, "turboJpeg", {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function (pixelData) {
                return __awaiter(this, void 0, void 0, function () {
                    var decoded;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, turbojpeg_decoder_1.decode)(pixelData.buffer)];
                            case 1:
                                decoded = _a.sent();
                                return [2 /*return*/, decoded === null || decoded === void 0 ? void 0 : decoded.decodedBuffer];
                        }
                    });
                });
            }
        });
        return JPEGBaselineLossyProcess1_8bit;
    }());
    exports.default = JPEGBaselineLossyProcess1_8bit;
});
define("JPEGBaselineLossyProcess2_12bit", ["require", "exports", "JPEGBaselineLossyProcess1_8bit"], function (require, exports, JPEGBaselineLossyProcess1_8bit_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var JPEGBaselineLossyProcess2_12bit = /** @class */ (function (_super) {
        __extends(JPEGBaselineLossyProcess2_12bit, _super);
        function JPEGBaselineLossyProcess2_12bit() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(JPEGBaselineLossyProcess2_12bit, "decode", {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function (pixelData, options) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, this.jpegJS(pixelData, options)];
                    });
                });
            }
        });
        return JPEGBaselineLossyProcess2_12bit;
    }(JPEGBaselineLossyProcess1_8bit_1.default));
    exports.default = JPEGBaselineLossyProcess2_12bit;
});
define("JPEGLS", ["require", "exports", "@abasb75/charls-decoder"], function (require, exports, charls_decoder_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var JPEGLS = /** @class */ (function () {
        function JPEGLS() {
        }
        Object.defineProperty(JPEGLS, "decode", {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function (pixelData) {
                return __awaiter(this, void 0, void 0, function () {
                    var arrayBuffer, offset, length, decoded;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                arrayBuffer = pixelData.buffer;
                                offset = pixelData.byteOffset;
                                length = pixelData.byteLength;
                                return [4 /*yield*/, (0, charls_decoder_1.decode)(arrayBuffer.slice(offset, length))];
                            case 1:
                                decoded = _a.sent();
                                if (!(decoded.decodedBuffer instanceof Uint8Array)) {
                                    return [2 /*return*/, null];
                                }
                                return [2 /*return*/, decoded.decodedBuffer];
                        }
                    });
                });
            }
        });
        return JPEGLS;
    }());
    exports.default = JPEGLS;
});
define("JPEGLossLess", ["require", "exports", "jpeg-lossless-decoder-js"], function (require, exports, JpegLosslessDecoder) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var JPEGLossLess = /** @class */ (function () {
        function JPEGLossLess() {
        }
        Object.defineProperty(JPEGLossLess, "decode", {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function (pixelData) {
                var decoder = new JpegLosslessDecoder.Decoder();
                var decoded = decoder.decode(new Uint8Array(pixelData.buffer), pixelData.byteOffset, pixelData.byteLength);
                return decoded;
            }
        });
        return JPEGLossLess;
    }());
    exports.default = JPEGLossLess;
});
define("Uncompressed", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UncompressedDecoder = /** @class */ (function () {
        function UncompressedDecoder() {
        }
        Object.defineProperty(UncompressedDecoder, "decode", {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function (pixelData) {
                var arrayBuffer = pixelData.buffer;
                return new Uint8Array(arrayBuffer);
            }
        });
        return UncompressedDecoder;
    }());
    exports.default = UncompressedDecoder;
});
define("Utilities/changeTypedArray", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function changeTypedArray(pixelArray, minAfterScale, maxAfterScale) {
        if (Number.isInteger(minAfterScale) && Number.isInteger(maxAfterScale)) {
            if (minAfterScale >= 0 && minAfterScale <= 255) {
                return new Uint8Array(pixelArray);
            }
            else if (minAfterScale >= 0 && minAfterScale <= 65535) {
                return new Uint16Array(pixelArray);
            }
            else if (minAfterScale >= 0 && maxAfterScale <= 4294967295) {
                return new Uint32Array(pixelArray);
            }
            else if (minAfterScale >= -128 && minAfterScale <= 127) {
                return new Int8Array(pixelArray);
            }
            else if (minAfterScale >= -32768 && minAfterScale <= 32767) {
                return new Int16Array(pixelArray);
            }
            else if (minAfterScale >= -2147483648 && maxAfterScale <= 2147483647) {
                return new Int32Array(pixelArray);
            }
        }
        return new Float32Array(pixelArray);
    }
    exports.default = changeTypedArray;
});
define("Utilities/getIsArrayPixelHasValidType", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function getIsArrayPixelHasValidType(arrayPixel, min, max) {
        if (arrayPixel instanceof Uint8Array) {
            if (min < 0 || max > 255) {
                return false;
            }
        }
        else if (arrayPixel instanceof Int8Array) {
            if (min < -128 || max > 127) {
                return false;
            }
        }
        else if (arrayPixel instanceof Uint16Array) {
            if (min < 0 || max > 65535) {
                return false;
            }
        }
        else if (arrayPixel instanceof Int16Array) {
            if (min < -32768 || max > 32767) {
                return false;
            }
        }
        return true;
    }
    exports.default = getIsArrayPixelHasValidType;
});
define("Utilities/getMinMaxAfterScale", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function getMinMaxAfterScale(min, max, rescaleSlope, rescaleIntercept) {
        if (typeof rescaleSlope !== "number" || typeof rescaleIntercept !== "number") {
            return { min: min, max: max };
        }
        return {
            minAfterScale: min * rescaleSlope + rescaleIntercept,
            maxAfterScale: max * rescaleSlope + rescaleIntercept,
        };
    }
    exports.default = getMinMaxAfterScale;
});
define("RLE", ["require", "exports", "dicom-rle"], function (require, exports, dicom_rle_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RLE = /** @class */ (function () {
        function RLE() {
        }
        Object.defineProperty(RLE, "decode", {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function (pixelData, options) {
                var rows = options.rows, columns = options.columns, samplesPerPixel = options.samplesPerPixel, bitsAllocated = options.bitsAllocated, planarConfiguration = options.planarConfiguration;
                if (!rows || !columns || !samplesPerPixel) {
                    return null;
                }
                var decoder = new dicom_rle_1.default.RleDecoder();
                var decoded = decoder.decode(new Uint8Array(pixelData.buffer), {
                    height: rows,
                    width: columns,
                    samplesPerPixel: samplesPerPixel,
                    bitsAllocated: bitsAllocated,
                    planarConfiguration: planarConfiguration,
                });
                return decoded;
            }
        });
        return RLE;
    }());
    exports.default = RLE;
});
define("HTJ2K", ["require", "exports", "@abasb75/openjph"], function (require, exports, openjph_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HTJ2K = /** @class */ (function () {
        function HTJ2K() {
        }
        Object.defineProperty(HTJ2K, "decode", {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function (pixelData) {
                return __awaiter(this, void 0, void 0, function () {
                    var arrayBuffer, offset, length, decoded;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                arrayBuffer = pixelData.buffer;
                                offset = pixelData.byteOffset;
                                length = pixelData.byteLength;
                                return [4 /*yield*/, (0, openjph_1.decode)(arrayBuffer.slice(offset, length))];
                            case 1:
                                decoded = _a.sent();
                                return [2 /*return*/, decoded.decodedBuffer];
                        }
                    });
                });
            }
        });
        return HTJ2K;
    }());
    exports.default = HTJ2K;
});
define("Utilities/ybrFull", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function yrbFullToRgba(pixelData, pixelModule) {
        var columns = pixelModule.columns, rows = pixelModule.rows, planarConfiguration = pixelModule.planarConfiguration;
        if (!columns || !rows) {
            return pixelData;
        }
        if (pixelData.length !== columns * rows * 3) {
            return pixelData;
        }
        var pixelCounts = rows * columns;
        var _pixelData = new Uint8ClampedArray(pixelCounts * 4);
        if (planarConfiguration === 1) {
            for (var i = 0; i < pixelCounts; i++) {
                var y = pixelData[i];
                var cb = pixelData[pixelCounts + i];
                var cr = pixelData[(pixelCounts * 2) + i];
                _pixelData[i * 4] = y + 1.402 * (cr - 128);
                _pixelData[i * 4 + 1] = y - 0.34414 * (cb - 128) - 0.71414 * (cr - 128);
                _pixelData[i * 4 + 2] = y + 1.772 * (cb - 128);
                _pixelData[i * 4 + 3] = 255;
            }
        }
        else {
            for (var i = 0; i < pixelCounts; i++) {
                var y = pixelData[i * 3];
                var cb = pixelData[i * 3 + 1];
                var cr = pixelData[i * 3 + 2];
                _pixelData[i * 4] = y + 1.402 * (cr - 128);
                _pixelData[i * 4 + 1] = y - 0.34414 * (cb - 128) - 0.71414 * (cr - 128);
                _pixelData[i * 4 + 2] = y + 1.772 * (cb - 128);
                _pixelData[i * 4 + 3] = 255;
            }
        }
        return new Uint8Array(_pixelData);
    }
    exports.default = yrbFullToRgba;
});
define("Utilities/ybrFull422", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function ybrFull422ToRgba(pixelData, pixelModule) {
        var columns = pixelModule.columns, rows = pixelModule.rows;
        if (!columns || !rows) {
            return pixelData;
        }
        var pixelCounts = rows * columns;
        if (pixelData.length !== 2 * pixelCounts) {
            return pixelData;
        }
        var _pixelData = new Uint8ClampedArray(pixelCounts * 4);
        var ybrIndex = 0;
        for (var i = 0; i < pixelCounts; i += 2) {
            var y1 = pixelData[ybrIndex++];
            var y2 = pixelData[ybrIndex++];
            var cb = pixelData[ybrIndex++];
            var cr = pixelData[ybrIndex++];
            _pixelData[i * 4] = y1 + 1.402 * (cr - 128);
            _pixelData[i * 4 + 1] = y1 - 0.34414 * (cb - 128) - 0.71414 * (cr - 128);
            _pixelData[i * 4 + 2] = y1 + 1.772 * (cb - 128);
            _pixelData[i * 4 + 3] = 255;
            _pixelData[i * 4 + 4] = y2 + 1.402 * (cr - 128);
            _pixelData[i * 4 + 5] = y2 - 0.34414 * (cb - 128) - 0.71414 * (cr - 128);
            _pixelData[i * 4 + 6] = y2 + 1.772 * (cb - 128);
            _pixelData[i * 4 + 7] = 255;
        }
        return new Uint16Array(_pixelData);
    }
    exports.default = ybrFull422ToRgba;
});
define("Utilities/planerConfiguration", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function applyPlanerConfiguration(pixelData) {
        if (pixelData.length % 3 !== 0) {
            return pixelData;
        }
        var pixelCounts = pixelData.length / 3;
        var _pixelData = new Uint8ClampedArray(pixelCounts * 4);
        for (var i = 0; i < pixelCounts; i++) {
            _pixelData[i * 4] = pixelData[i];
            _pixelData[i * 4 + 1] = pixelData[pixelCounts + i];
            _pixelData[i * 4 + 2] = pixelData[2 * pixelCounts + i];
            _pixelData[i * 4 + 3] = 255;
        }
        return new Uint8Array(_pixelData);
    }
    exports.default = applyPlanerConfiguration;
});
define("UnSyntaxed", ["require", "exports", "Uncompressed"], function (require, exports, Uncompressed_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UnSyntaxed = /** @class */ (function () {
        function UnSyntaxed() {
        }
        Object.defineProperty(UnSyntaxed, "decode", {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function (pixelData, options) {
                return __awaiter(this, void 0, void 0, function () {
                    var columns, rows, bitsAllocated;
                    return __generator(this, function (_a) {
                        console.warn('image has no transfersyntax or supported syntax.');
                        columns = options.columns, rows = options.rows;
                        bitsAllocated = options.bitsAllocated ? options.bitsAllocated : 8;
                        if (!columns || !rows) {
                            throw new Error('image has not sepefected width & row!');
                        }
                        if (pixelData.byteLength) {
                            options.bitsAllocated = bitsAllocated || 8;
                            return [2 /*return*/, Uncompressed_1.default.decode(pixelData)];
                        }
                        return [2 /*return*/];
                    });
                });
            }
        });
        return UnSyntaxed;
    }());
    exports.default = UnSyntaxed;
});
define("Utilities/invertMonoChrome1", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function invertMonochrome1(image) {
        var _a = image.getMinMax(), min = _a.min, max = _a.max;
        for (var i = 0; i < image.pixelData.length; i++) {
            image.pixelData[i] = max - (image.pixelData[i] + min);
        }
        return image.pixelData;
    }
    exports.default = invertMonochrome1;
});
define("Decoder", ["require", "exports", "DecodedImage", "JPEG2000", "JPEGBaselineLossyProcess2_12bit", "JPEGBaselineLossyProcess1_8bit", "JPEGLS", "JPEGLossLess", "Uncompressed", "Utilities/changeTypedArray", "Utilities/getIsArrayPixelHasValidType", "Utilities/getMinMax", "Utilities/getMinMaxAfterScale", "RLE", "HTJ2K", "Utilities/ybrFull", "Utilities/ybrFull422", "Utilities/planerConfiguration", "UnSyntaxed", "Utilities/invertMonoChrome1"], function (require, exports, DecodedImage_1, JPEG2000_1, JPEGBaselineLossyProcess2_12bit_1, JPEGBaselineLossyProcess1_8bit_2, JPEGLS_1, JPEGLossLess_1, Uncompressed_2, changeTypedArray_1, getIsArrayPixelHasValidType_1, getMinMax_2, getMinMaxAfterScale_1, RLE_1, HTJ2K_1, ybrFull_1, ybrFull422_1, planerConfiguration_1, UnSyntaxed_1, invertMonoChrome1_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Decoder = /** @class */ (function () {
        function Decoder() {
        }
        Object.defineProperty(Decoder, "decode", {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function (pixelData, options) {
                return __awaiter(this, void 0, void 0, function () {
                    var transferSyntaxUID, decodedPixelData, _a, image, i;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                transferSyntaxUID = options.transferSyntaxUID;
                                decodedPixelData = null;
                                _a = transferSyntaxUID;
                                switch (_a) {
                                    case "1.2.840.10008.1.2": return [3 /*break*/, 1];
                                    case "1.2.840.10008.1.2.1": return [3 /*break*/, 1];
                                    case "1.2.840.10008.1.2.1.99": return [3 /*break*/, 1];
                                    case "1.2.840.10008.1.2.2": return [3 /*break*/, 1];
                                    case "1.2.840.10008.1.2.4.50": return [3 /*break*/, 2];
                                    case "1.2.840.10008.1.2.4.51": return [3 /*break*/, 4];
                                    case "1.2.840.10008.1.2.4.52": return [3 /*break*/, 4];
                                    case "1.2.840.10008.1.2.4.53": return [3 /*break*/, 4];
                                    case "1.2.840.10008.1.2.4.54": return [3 /*break*/, 4];
                                    case "1.2.840.10008.1.2.4.55": return [3 /*break*/, 4];
                                    case "1.2.840.10008.1.2.4.56": return [3 /*break*/, 4];
                                    case "1.2.840.10008.1.2.4.58": return [3 /*break*/, 4];
                                    case "1.2.840.10008.1.2.4.59": return [3 /*break*/, 4];
                                    case "1.2.840.10008.1.2.4.60": return [3 /*break*/, 4];
                                    case "1.2.840.10008.1.2.4.61": return [3 /*break*/, 4];
                                    case "1.2.840.10008.1.2.4.62": return [3 /*break*/, 4];
                                    case "1.2.840.10008.1.2.4.63": return [3 /*break*/, 4];
                                    case "1.2.840.10008.1.2.4.64": return [3 /*break*/, 4];
                                    case "1.2.840.10008.1.2.4.57": return [3 /*break*/, 6];
                                    case "1.2.840.10008.1.2.4.65": return [3 /*break*/, 6];
                                    case "1.2.840.10008.1.2.4.66": return [3 /*break*/, 6];
                                    case "1.2.840.10008.1.2.4.70": return [3 /*break*/, 6];
                                    case "1.2.840.10008.1.2.4.80": return [3 /*break*/, 8];
                                    case "1.2.840.10008.1.2.4.81": return [3 /*break*/, 8];
                                    case "1.2.840.10008.1.2.4.90": return [3 /*break*/, 10];
                                    case "1.2.840.10008.1.2.4.91": return [3 /*break*/, 10];
                                    case "1.2.840.10008.1.2.4.92": return [3 /*break*/, 10];
                                    case "1.2.840.10008.1.2.4.93": return [3 /*break*/, 10];
                                    case '3.2.840.10008.1.2.4.96': return [3 /*break*/, 12];
                                    case "1.2.840.10008.1.2.4.201": return [3 /*break*/, 12];
                                    case "1.2.840.10008.1.2.4.202": return [3 /*break*/, 12];
                                    case "1.2.840.10008.1.2.4.203": return [3 /*break*/, 12];
                                    case "1.2.840.10008.1.2.5": return [3 /*break*/, 14];
                                }
                                return [3 /*break*/, 16];
                            case 1:
                                decodedPixelData = Uncompressed_2.default.decode(pixelData);
                                return [3 /*break*/, 18];
                            case 2: return [4 /*yield*/, JPEGBaselineLossyProcess1_8bit_2.default.decode(pixelData, options)];
                            case 3:
                                decodedPixelData = _b.sent();
                                return [3 /*break*/, 18];
                            case 4: return [4 /*yield*/, JPEGBaselineLossyProcess2_12bit_1.default.decode(pixelData, options)];
                            case 5:
                                decodedPixelData = _b.sent();
                                return [3 /*break*/, 18];
                            case 6: return [4 /*yield*/, JPEGLossLess_1.default.decode(pixelData)];
                            case 7:
                                decodedPixelData = _b.sent();
                                return [3 /*break*/, 18];
                            case 8: return [4 /*yield*/, JPEGLS_1.default.decode(pixelData)];
                            case 9:
                                decodedPixelData = _b.sent();
                                return [3 /*break*/, 18];
                            case 10: return [4 /*yield*/, JPEG2000_1.default.decode(pixelData)];
                            case 11:
                                decodedPixelData = _b.sent();
                                return [3 /*break*/, 18];
                            case 12: return [4 /*yield*/, HTJ2K_1.default.decode(pixelData)];
                            case 13:
                                decodedPixelData = _b.sent();
                                return [3 /*break*/, 18];
                            case 14: return [4 /*yield*/, RLE_1.default.decode(pixelData, options)];
                            case 15:
                                decodedPixelData = _b.sent();
                                return [3 /*break*/, 18];
                            case 16: return [4 /*yield*/, UnSyntaxed_1.default.decode(pixelData, options)];
                            case 17:
                                decodedPixelData = _b.sent();
                                _b.label = 18;
                            case 18:
                                decodedPixelData = Decoder._toSutibleTypedArray(decodedPixelData, options);
                                if (!decodedPixelData)
                                    return [2 /*return*/, null];
                                if (!decodedPixelData) {
                                    return [2 /*return*/, null];
                                }
                                image = new DecodedImage_1.default(transferSyntaxUID, options.columns || 0, options.rows || 0, decodedPixelData);
                                if (options.pixelRepresentation === 1 && options.bitsStored) {
                                    for (i = 0; i < image.pixelData.length; i++) {
                                        image.pixelData[i] = (image.pixelData[i]
                                            << (32 - options.bitsStored)) >> (32 - options.bitsStored);
                                    }
                                }
                                image.photometricInterpretation = options.photometricInterpretation;
                                Decoder._applyColorSpace(image, options);
                                image.pixelData = Decoder._applyScaling(image, options);
                                Decoder._setLUT(image, options);
                                image.pixelData = Decoder._fixSize(image.pixelData, options);
                                return [2 /*return*/, image];
                        }
                    });
                });
            }
        });
        Object.defineProperty(Decoder, "_setLUT", {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function (image, options) {
                if (options.windowCenter && options.windowWidth) {
                    var windowWidth = options.windowWidth;
                    var windowCenter = options.windowCenter;
                    image.windowWidth = windowWidth;
                    image.windowCenter = windowCenter;
                    image.max = windowCenter - 0.5 + windowWidth / 2;
                    image.min = windowCenter - 0.5 - windowWidth / 2;
                    return;
                }
                var _a = image.getMinMax(), min = _a.min, max = _a.max;
                image.windowWidth = max - min;
                image.windowCenter = min + image.windowWidth / 2;
            }
        });
        Object.defineProperty(Decoder, "_applyScaling", {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function (image, options) {
                var _a = (0, getMinMax_2.default)(image.pixelData), min = _a.min, max = _a.max;
                image.min = min;
                image.max = max;
                var rescaleSlope = options.rescaleSlope, rescaleIntercept = options.rescaleIntercept;
                if (typeof rescaleSlope !== "number"
                    || typeof rescaleIntercept !== "number") {
                    return image.pixelData;
                }
                var _b = (0, getMinMaxAfterScale_1.default)(min, max, rescaleSlope, rescaleIntercept), minAfterScale = _b.minAfterScale, maxAfterScale = _b.maxAfterScale;
                if (min === minAfterScale && max === maxAfterScale) {
                    return image.pixelData;
                }
                var isValidType = (0, getIsArrayPixelHasValidType_1.default)(image.pixelData, minAfterScale || 0, maxAfterScale || 0);
                image.min = minAfterScale;
                image.max = maxAfterScale;
                var _decodedPixelData = isValidType ? image.pixelData : (0, changeTypedArray_1.default)(image.pixelData, image.min || 0, image.max || 0);
                for (var i = 0; i < _decodedPixelData.length; i++) {
                    _decodedPixelData[i] = _decodedPixelData[i] * rescaleSlope + rescaleIntercept;
                }
                return _decodedPixelData;
            }
        });
        Object.defineProperty(Decoder, "_applyColorSpace", {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function (image, options) {
                if (image.photometricInterpretation === 'MONOCHROME1') {
                    image.pixelData = (0, invertMonoChrome1_1.default)(image);
                }
                if (['RGB', 'YBR'].includes(options.photometricInterpretation)
                    && options.planarConfiguration) {
                    image.pixelData = (0, planerConfiguration_1.default)(image.pixelData);
                }
                if (options.photometricInterpretation === "YBR_FULL") {
                    image.pixelData = (0, ybrFull_1.default)(image.pixelData, options);
                }
                else if (options.photometricInterpretation === "YBR_FULL_422") {
                    image.pixelData = (0, ybrFull422_1.default)(image.pixelData, options);
                }
            }
        });
        Object.defineProperty(Decoder, "_toSutibleTypedArray", {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function (pixelData, options) {
                var bitsAllocated = options.bitsAllocated;
                var offset = pixelData.byteOffset;
                var length = pixelData.byteLength;
                if (bitsAllocated > 32) {
                    return new Float64Array(pixelData.buffer, offset, length / 8);
                }
                else if (bitsAllocated > 16) {
                    if (options.isFloat) {
                        return Decoder._endianFixer(new Float32Array(pixelData.buffer, offset, length / 4), !options.littleEndian);
                    }
                    if (options.pixelRepresentation === 0) {
                        return Decoder._endianFixer(new Uint32Array(pixelData.buffer, offset, length / 4), !options.littleEndian);
                    }
                    return Decoder._endianFixer(new Float32Array(pixelData.buffer, offset, length / 4), !options.littleEndian);
                }
                else if (bitsAllocated > 8) {
                    if (options.pixelRepresentation === 0) {
                        return Decoder._endianFixer(new Uint16Array(pixelData.buffer, offset, length / 2), !options.littleEndian);
                    }
                    return Decoder._endianFixer(new Int16Array(pixelData.buffer, offset, length / 2), !options.littleEndian);
                }
                else if (bitsAllocated === 8) {
                    if (options.pixelRepresentation === 0) {
                        return Decoder._endianFixer(new Uint8Array(pixelData), !options.littleEndian);
                    }
                    return Decoder._endianFixer(new Int8Array(pixelData), !options.littleEndian);
                }
                else if (bitsAllocated === 1) {
                    var buffer8 = new Uint8Array(pixelData);
                    var bits = new Uint8Array((options.rows || 0) * (options.columns || 0));
                    for (var i = 0; i < buffer8.length; i++) {
                        for (var j = 0; j < 8; j++) {
                            bits[i * 8 + j] = (buffer8[i] >> (j)) & 1;
                        }
                    }
                    return bits;
                }
            }
        });
        Object.defineProperty(Decoder, "_endianFixer", {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function (data, bigEndian) {
                if (bigEndian === void 0) { bigEndian = false; }
                if (!bigEndian) {
                    return data;
                }
                if (data instanceof Uint16Array || data instanceof Int16Array) {
                    for (var i = 0; i < data.byteLength; i++) {
                        data[i] = ((data[i] & 0xff) << 8) | ((data[i] >> 8) & 0xff);
                    }
                }
                return data;
            }
        });
        Object.defineProperty(Decoder, "_fixSize", {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function (pixelData, options) {
                var rows = (options === null || options === void 0 ? void 0 : options.rows) || 0;
                var columns = (options === null || options === void 0 ? void 0 : options.columns) || 0;
                if (rows * columns === pixelData.length) {
                    return pixelData;
                }
                else if (3 * rows * columns === pixelData.length) {
                    return pixelData;
                }
                else if (4 * rows * columns === pixelData.length) {
                    return pixelData;
                }
                var newLen = null;
                if (pixelData.length < rows * columns) {
                    newLen = columns * rows;
                }
                else if (pixelData.length < 3 * rows * columns) {
                    newLen = 3 * columns * rows;
                }
                else {
                    newLen = 4 * columns * rows;
                }
                var newPixelsArray = null;
                var minimum = 0;
                if (pixelData instanceof Int8Array) {
                    newPixelsArray = new Int8Array(newLen);
                    minimum = -128;
                }
                else if (pixelData instanceof Uint8Array) {
                    newPixelsArray = new Uint8Array(newLen);
                }
                else if (pixelData instanceof Int16Array) {
                    newPixelsArray = new Int16Array(newLen);
                    minimum = -32768;
                }
                else if (pixelData instanceof Uint16Array) {
                    newPixelsArray = new Uint16Array(newLen);
                }
                else if (pixelData instanceof Int32Array) {
                    newPixelsArray = new Int32Array(newLen);
                    minimum = -2147483648;
                }
                else if (pixelData instanceof Uint32Array) {
                    newPixelsArray = new Uint32Array(newLen);
                }
                else if (pixelData instanceof Float32Array) {
                    newPixelsArray = new Float32Array(newLen);
                    minimum = -3.4e38;
                }
                else if (pixelData instanceof Float64Array) {
                    newPixelsArray = new Float64Array(newLen);
                    minimum = -1.8e308;
                }
                if (!newPixelsArray)
                    return pixelData;
                for (var i = 0; i < newLen; i++) {
                    newPixelsArray[i] = (i < pixelData.length) ? pixelData[i] : minimum;
                }
                return newPixelsArray;
            }
        });
        return Decoder;
    }());
    exports.default = Decoder;
});
define("index", ["require", "exports", "Decoder"], function (require, exports, Decoder_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function decode(pixelData, options) {
        return __awaiter(this, void 0, void 0, function () {
            var pixelDataView;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (pixelData instanceof ArrayBuffer) {
                            pixelDataView = new DataView(pixelData);
                        }
                        else {
                            pixelDataView = pixelData;
                        }
                        return [4 /*yield*/, Decoder_1.default.decode(pixelDataView, options)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    }
    exports.default = decode;
});

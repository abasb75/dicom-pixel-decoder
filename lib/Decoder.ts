import DecodedImage from "./DecodedImage";
import JPEG2000 from "./JPEG2000";
import JPEGBaselineLossyProcess2_12bit from "./JPEGBaselineLossyProcess2_12bit";
import JPEGBaselineLossyProcess1_8bit from "./JPEGBaselineLossyProcess1_8bit";
import JPEGLS from "./JPEGLS";
import JPEGLossLess from "./JPEGLossLess";
import UncompressDecoderr from "./Uncompressed";
import changeTypedArray from "./Utilities/changeTypedArray";
import getIsArrayPixelHasValidType from "./Utilities/getIsArrayPixelHasValidType";
import getMinMax from "./Utilities/getMinMax";
import getMinMaxAfterScale from "./Utilities/getMinMaxAfterScale";
import { DecodeOptions, PixelArray } from "./types";
import RLE from "./RLE";
import HTJ2K from "./HTJ2K";
import ybrFullToRgba from "./Utilities/ybrFull";
import ybrFull422ToRgba from "./Utilities/ybrFull422";
import applyPlanerConfiguration from "./Utilities/planerConfiguration";
import UnSyntaxed from "./UnSyntaxed";
import invertMonochrome1 from "./Utilities/invertMonoChrome1";

class Decoder {

    static async decode(pixelData:DataView,options:DecodeOptions){
        const transferSyntaxUID = options.transferSyntaxUID;
        let decodedPixelData = null ;
        switch(transferSyntaxUID){
            case "1.2.840.10008.1.2":
            case "1.2.840.10008.1.2.1":
            case "1.2.840.10008.1.2.1.99":
            case "1.2.840.10008.1.2.2":
                decodedPixelData = UncompressDecoderr.decode(pixelData);
                break;
            case "1.2.840.10008.1.2.4.50":
                decodedPixelData = await JPEGBaselineLossyProcess1_8bit.decode(pixelData,options);
                break;
            case "1.2.840.10008.1.2.4.51":
            case "1.2.840.10008.1.2.4.52": /**untested */
            case "1.2.840.10008.1.2.4.53":
            case "1.2.840.10008.1.2.4.54": /**untested */
            case "1.2.840.10008.1.2.4.55":
            case "1.2.840.10008.1.2.4.56": /**untested */
            case "1.2.840.10008.1.2.4.58": /**untested */
            case "1.2.840.10008.1.2.4.59": /**untested */
            case "1.2.840.10008.1.2.4.60": /**untested */
            case "1.2.840.10008.1.2.4.61": /**untested */
            case "1.2.840.10008.1.2.4.62": /**untested */
            case "1.2.840.10008.1.2.4.63": /**untested */
            case "1.2.840.10008.1.2.4.64": /**untested */
                decodedPixelData = await JPEGBaselineLossyProcess2_12bit.decode(pixelData,options);
                break;
            case "1.2.840.10008.1.2.4.57":
            case "1.2.840.10008.1.2.4.65": /**untested */
            case "1.2.840.10008.1.2.4.66": /**untested */
            case "1.2.840.10008.1.2.4.70":
                decodedPixelData = await JPEGLossLess.decode(pixelData,options);
                break;
            case "1.2.840.10008.1.2.4.80":
            case "1.2.840.10008.1.2.4.81":
                decodedPixelData = await JPEGLS.decode(pixelData);
                break;
            case "1.2.840.10008.1.2.4.90":
            case "1.2.840.10008.1.2.4.91":
            case "1.2.840.10008.1.2.4.92": /**untested */
            case "1.2.840.10008.1.2.4.93": /**untested */
                decodedPixelData = await JPEG2000.decode(pixelData);
                break;
            case '3.2.840.10008.1.2.4.96': /**untested */
            case "1.2.840.10008.1.2.4.201":
            case "1.2.840.10008.1.2.4.202": /**untested */
            case "1.2.840.10008.1.2.4.203":
                decodedPixelData = await HTJ2K.decode(pixelData);
                break;
            case "1.2.840.10008.1.2.5":
                decodedPixelData = await RLE.decode(pixelData,options);
                break;
            default:
                decodedPixelData = await UnSyntaxed.decode(pixelData,options);
        }

        decodedPixelData = Decoder._toSutibleTypedArray(decodedPixelData,options);
        if(!decodedPixelData) return null;
        if(!decodedPixelData){
            return null;
        }

        const image:DecodedImage = new DecodedImage(
            transferSyntaxUID,
            options.columns || 0,
            options.rows || 0,
            decodedPixelData,
        );

        if(options.pixelRepresentation === 1 && options.bitsStored){
            for (let i = 0; i < image.pixelData.length; i++) {
                image.pixelData[i] = (image.pixelData[i] 
                    << (32-options.bitsStored)) >> (32-options.bitsStored);
            }
        }

        image.photometricInterpretation = options.photometricInterpretation;
        Decoder._applyColorSpace(image,options);
        image.pixelData = Decoder._applyScaling(image,options);
        Decoder._setLUT(image,options);
        image.pixelData = Decoder._fixSize(image.pixelData,options);
        return image;
    }

    static _setLUT(image:DecodedImage,options:DecodeOptions) {
        if(options.windowCenter && options.windowWidth){
            const windowWidth = options.windowWidth;
            const windowCenter = options.windowCenter;
            image.windowWidth = windowWidth;
            image.windowCenter = windowCenter;
            image.max = windowCenter - 0.5 + windowWidth / 2;
            image.min = windowCenter - 0.5 - windowWidth / 2;
            return;
        }
        const {min,max} = image.getMinMax();
        image.windowWidth = max - min;
        image.windowCenter = min + image.windowWidth / 2;
    }

    private static _applyScaling(image:DecodedImage,options:DecodeOptions){
        const {min,max} = getMinMax(image.pixelData);
        image.min = min;
        image.max = max;
        const {rescaleSlope,rescaleIntercept} = options;
        console.log('scaling module',rescaleSlope,rescaleIntercept);
        if(
            typeof rescaleSlope !== "number"
            || typeof rescaleIntercept !== "number"
        ){
            return image.pixelData;
        }

        const {minAfterScale,maxAfterScale} = getMinMaxAfterScale(
            min,
            max,
            rescaleSlope,
            rescaleIntercept
        );

        console.log({minAfterScale,maxAfterScale});
        if(min === minAfterScale && max === maxAfterScale){
            return image.pixelData;
        }

        const isValidType = getIsArrayPixelHasValidType(
            image.pixelData,
            minAfterScale || 0,
            maxAfterScale || 0
        );

        image.min = minAfterScale;
        image.max = maxAfterScale;
        const _decodedPixelData = isValidType ? image.pixelData : changeTypedArray(
            image.pixelData,
            image.min || 0,
            image.max || 0
        );
        for (let i=0;i<_decodedPixelData.length; i++) {
            _decodedPixelData[i] = _decodedPixelData[i] * rescaleSlope + rescaleIntercept;
        }
        
        return _decodedPixelData;

    }

    private static _applyColorSpace(image:DecodedImage,options:DecodeOptions){
        if(image.photometricInterpretation === 'MONOCHROME1'){
            image.pixelData = invertMonochrome1(
                image
            );
        }
        if(
            ['RGB','YBR'].includes(options.photometricInterpretation) 
            && options.planarConfiguration
        ){
            image.pixelData = applyPlanerConfiguration(image.pixelData);
        }
        if(options.photometricInterpretation === "YBR_FULL"){
            image.pixelData = ybrFullToRgba(image.pixelData,options);
        }else if(options.photometricInterpretation === "YBR_FULL_422"){
            image.pixelData = ybrFull422ToRgba(image.pixelData,options);
        }
    }
    
    private static _toSutibleTypedArray(pixelData:Uint8Array,options:DecodeOptions){
        const { bitsAllocated } = options;
        const offset = pixelData.byteOffset;
        const length = pixelData.byteLength;
        console.log({options,bitsAllocated,pixelData});
        if(bitsAllocated > 32){
            return new Float64Array(
                pixelData.buffer,
                offset,
                length/8
            );
        }else if(bitsAllocated > 16){
            if(options.isFloat){
                return Decoder._endianFixer(
                    new Float32Array(
                        pixelData.buffer,
                        offset,
                        length/4,
                    ),
                    !options.littleEndian
                );
            }
            if (options.pixelRepresentation === 0) {
                return Decoder._endianFixer(
                    new Uint32Array(
                        pixelData.buffer,
                        offset,
                        length/4
                    ),
                    !options.littleEndian,
                );    
            }
            return Decoder._endianFixer(
                new Float32Array(
                    pixelData.buffer,
                    offset,
                    length/4,
                ),
                !options.littleEndian
            );
        }else if(bitsAllocated > 8){
            if (options.pixelRepresentation === 0) {
                return Decoder._endianFixer(
                    new Uint16Array(
                        pixelData.buffer,
                        offset,
                        length/2
                    ),
                    !options.littleEndian,
                );    
            }
            return Decoder._endianFixer(
                new Int16Array(
                    pixelData.buffer,
                    offset,
                    length/2
                ),
                !options.littleEndian
            );
        }else if(bitsAllocated===8){
            if (options.pixelRepresentation === 0) {
                return Decoder._endianFixer(
                    new Uint8Array(pixelData),
                    !options.littleEndian,
                );    
            }
            return Decoder._endianFixer(
                new Int8Array(pixelData),
                !options.littleEndian
            );
        }else if(bitsAllocated === 1){
            const buffer8 = new Uint8Array(pixelData);
            const bits = new Uint8Array((options.rows || 0)*(options.columns || 0));
            for(let i=0;i<buffer8.length;i++){
                for(let j=0;j<8;j++){
                    bits[i*8+j] = (buffer8[i] >> (j)) & 1;
                }
            }
            return bits;
        }
    }

    private static _endianFixer(data:PixelArray,bigEndian:boolean=false){
        if(!bigEndian){
            return data;
        }
        if(data instanceof Uint16Array || data instanceof Int16Array){
            for(let i=0;i<data.byteLength;i++){
                data[i] = ((data[i] & 0xff) << 8) | ((data[i] >> 8) & 0xff);
            }
        }
        return data;
    }

    private static _fixSize(pixelData:PixelArray,options:DecodeOptions){
        const rows = options?.rows || 0;
        const columns = options?.columns || 0;
        if(rows*columns === pixelData.length){
            return pixelData;
        }else if( 3*rows*columns === pixelData.length){
            return pixelData;
        }else if( 4*rows*columns === pixelData.length){
            return pixelData;
        }

        let newLen = null;
        if(pixelData.length<rows*columns){
            newLen = columns*rows;
        }else if(pixelData.length<3*rows*columns){
            newLen = 3*columns*rows;
        }else{
            newLen = 4*columns*rows;
        }

        let newPixelsArray = null;
        let minimum = 0;
        if(pixelData instanceof Int8Array){
            newPixelsArray = new Int8Array(newLen);
            minimum = -128;
        }else if(pixelData instanceof Uint8Array){
            newPixelsArray = new Uint8Array(newLen);
        }else if(pixelData instanceof Int16Array){
            newPixelsArray = new Int16Array(newLen);
            minimum = -32768;
        }else if(pixelData instanceof Uint16Array){
            newPixelsArray = new Uint16Array(newLen);
        }else if(pixelData instanceof Int32Array){
            newPixelsArray = new Int32Array(newLen);
            minimum = -2147483648;
        }else if(pixelData instanceof Uint32Array){
            newPixelsArray = new Uint32Array(newLen);
        }else if(pixelData instanceof Float32Array){
            newPixelsArray = new Float32Array(newLen);
            minimum = -3.4e38;
        }else if(pixelData instanceof Float64Array){
            newPixelsArray = new Float64Array(newLen);
            minimum = -1.8e308;
        }
        if(!newPixelsArray) return pixelData;
        for(let i=0;i<newLen;i++){
            newPixelsArray[i] = (i<pixelData.length) ? pixelData[i] : minimum;
        }

        return newPixelsArray;
    }
}


export default Decoder;
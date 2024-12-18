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
import { DecodeOptions } from "./types";
import RLE from "./RLE";
import HTJ2K from "./HTJ2K";

class Decoder {

    static async decode(pixelData:DataView,options:DecodeOptions){
        const transferSyntaxUID = options.transferSyntaxUID;
        let decodedPixelData = null ;
        switch(transferSyntaxUID){
            case "1.2.840.10008.1.2":
            case "1.2.840.10008.1.2.1":
            case "1.2.840.10008.1.2.1.99":
            case "1.2.840.10008.1.2.2":
                decodedPixelData = UncompressDecoderr.decode(pixelData,options);
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
                throw new Error(`${transferSyntaxUID} Transfer syntax not supported!`);
        }

        if(!decodedPixelData){
            return null;
        }

        const image:DecodedImage = new DecodedImage(
            transferSyntaxUID,
            options.columns || 0,
            options.rows || 0,
            decodedPixelData,
        );
        
        image.pixelData = Decoder._applyScaling(image,options);
        Decoder._setLUT(image,options);
        return image;
    }

    private static _setLUT(image:DecodedImage,options:DecodeOptions) {
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
    
}

export default Decoder;
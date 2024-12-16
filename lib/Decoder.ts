import DecodedImage from "./DecodedImage";
import JPEG2000 from "./JPEG2000";
import JPEGBaselineLossyProcess1_8bit from "./JPEGBaselineLossyProcess1_8bit";
import JPEGLS from "./JPEGLS";
import JPEGLossLess from "./JPEGLossLess";
import UncompressDecoderr from "./Uncompressed";
import changeTypedArray from "./Utilities/changeTypedArray";
import getIsArrayPixelHasValidType from "./Utilities/getIsArrayPixelHasValidType";
import getMinMax from "./Utilities/getMinMax";
import getMinMaxAfterScale from "./Utilities/getMinMaxAfterScale";
import { DecodeOptions } from "./types";

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
            case "1.2.840.10008.1.2.4.57":
            case "1.2.840.10008.1.2.4.70":
                decodedPixelData = await JPEGLossLess.decode(pixelData,options);
                break;
            case "1.2.840.10008.1.2.4.80":
            case "1.2.840.10008.1.2.4.81":
                decodedPixelData = await JPEGLS.decode(pixelData);
                break;
            case "1.2.840.10008.1.2.4.90":
            case "1.2.840.10008.1.2.4.91":
                decodedPixelData = await JPEG2000.decode(pixelData,options);
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
        image.windowCenter = min + image.windowWidth / 2  - 0.5;
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
        const _decodedPixelData = isValidType ? image.pixelData : changeTypedArray(image.pixelData);
        for (let i=0;i<_decodedPixelData.length; i++) {
            _decodedPixelData[i] = _decodedPixelData[i] * rescaleSlope + rescaleIntercept;
        }

        return _decodedPixelData;

    }
    
}

export default Decoder;
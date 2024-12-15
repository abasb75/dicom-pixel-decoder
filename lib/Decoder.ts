

import JPEG2000 from "./JPEG2000";
import JPEGBaselineLossyProcess1_8bit from "./JPEGBaselineLossyProcess1_8bit";
import JPEGLS from "./JPEGLS";
import JPEGLossLess from "./JPEGLossLess";
import UncompressDecoderr from "./Uncompressed";
import { DecodeOptions } from "./types";

class Decoder {

    static async decode(pixelData:DataView,options:DecodeOptions){
        const transferSyntaxUID = options.transferSyntaxUID;
        console.log('big endian',!options.littleEndian)
        switch(transferSyntaxUID){
            case "1.2.840.10008.1.2":
            case "1.2.840.10008.1.2.1":
            case "1.2.840.10008.1.2.1.99":
            case "1.2.840.10008.1.2.2":
                return UncompressDecoderr.decode(pixelData,options);
            case "1.2.840.10008.1.2.4.50":
                return await JPEGBaselineLossyProcess1_8bit.decode(pixelData,options);
            case "1.2.840.10008.1.2.4.57":
            case "1.2.840.10008.1.2.4.70":
                return JPEGLossLess.decode(pixelData,options);
            case "1.2.840.10008.1.2.4.80":
            case "1.2.840.10008.1.2.4.81":
                return await JPEGLS.decode(pixelData);
            case "1.2.840.10008.1.2.4.90":
            case "1.2.840.10008.1.2.4.91":
                return await JPEG2000.decode(pixelData,options);
            default:
                throw new Error(`${transferSyntaxUID} Transfer syntax not supported!`)
        }
    }
    
}

export default Decoder;
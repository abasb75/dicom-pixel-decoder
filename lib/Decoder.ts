

import JPEG2000 from "./JPEG2000";
import JPEGBaselineLossyProcess1_8bit from "./JPEGBaselineLossyProcess1_8bit";
import JPEGLS from "./JPEGLS";
import UncompressDecoderr from "./Uncompressed";
import { DecodeOptions } from "./types";

class Decoder {

    static async decode(pixelData:DataView,options:DecodeOptions){
        const transferSyntaxUID = options.transferSyntaxUID;
        switch(transferSyntaxUID){
            case "1.2.840.10008.1.2.4.50":
                return await JPEGBaselineLossyProcess1_8bit.decode(pixelData,options);
            case "1.2.840.10008.1.2.4.80":
                return await JPEGLS.decode(pixelData,options);
            case "1.2.840.10008.1.2.4.90":
            case "1.2.840.10008.1.2.4.91":
                return await JPEG2000.decode(pixelData,options);
            case "1.2.840.10008.1.2":
            case "1.2.840.10008.1.2.1":
            case "1.2.840.10008.1.2.2":
            case "1.2.840.10008.1.2.1.99":
            default:
                return UncompressDecoderr.decode(pixelData,options);
        }
    }
}

export default Decoder;
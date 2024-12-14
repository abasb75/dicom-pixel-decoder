
//@ts-ignore
import * as JpegLosslessDecoder from "jpeg-lossless-decoder-js";
import { DecodeOptions } from "./types";

class JPEGLossLess{
    static decode(pixelData:DataView,options:DecodeOptions){

        const decoder = new JpegLosslessDecoder.Decoder();
        const decoded = decoder.decode(
            new Uint8Array(pixelData.buffer),
            pixelData.byteOffset,
            pixelData.byteLength,
        );

        if(options.bitsAllocated>8){
            if(options.pixelRepresentation === 0){
                return new Uint16Array(decoded.buffer);
            }
            return new Int16Array(decoded.buffer);
        }
        if(options.pixelRepresentation === 0){
            return decoded;
        }
        return new Int8Array(decoded.buffer);

    }
}


export default JPEGLossLess;
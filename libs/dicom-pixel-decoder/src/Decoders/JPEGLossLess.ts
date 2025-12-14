// is faster in vite from originanl jpeg-lossless-decoder-js package
import Decoder from "@abasb75/jpeg-lossless-decoder";
import { DecodeOptions } from "../types";

let decoder:any = null;

class JPEGLossLess{
    static decode(pixelData:DataView,options:DecodeOptions){

        if(!decoder){
            decoder = new Decoder();
        }

        const decoded = decoder.decode(
            pixelData.buffer,
            pixelData.byteOffset,
            pixelData.byteLength,
            options.bitsAllocated===8?1:2,
        );

        return decoded;
        
    }
}


export default JPEGLossLess;
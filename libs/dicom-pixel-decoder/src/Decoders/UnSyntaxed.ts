import UncompressDecoder from "./Uncompressed";
import { DecodeOptions } from "../types";

class UnSyntaxed {

    // for unsupported transfer syntax 
    // TODO: need to logic for identifying image type
    static async decode(pixelData:DataView,options:DecodeOptions){
        console.warn('image has no transfersyntax or supported syntax.');
        const {columns,rows} = options;
        const bitsAllocated = options.bitsAllocated ? options.bitsAllocated : 8;
        if(!columns || !rows){
            throw new Error('image has not sepefected width & row!');
        }
        if(pixelData.byteLength){
            options.bitsAllocated = bitsAllocated || 8;
            return UncompressDecoder.decode(pixelData);
        }
    }

}

export default UnSyntaxed;
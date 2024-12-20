import UncompressDecoder from "./Uncompressed";
import { DecodeOptions } from "./types";

class UnSyntaxed {

    static async decode(pixelData:DataView,options:DecodeOptions){
        console.warn('image has no transfersyntax or supported syntax.');
        const {columns,rows} = options;
        const bitsAllocated = options.bitsAllocated ? options.bitsAllocated : 8;
        if(!columns || !rows){
            throw new Error('image has not sepefected width & row!');
        }
        console.log('bytes',pixelData.byteLength);
        if(pixelData.byteLength === columns * rows * (bitsAllocated/8)){
            options.bitsAllocated = bitsAllocated || 8;
            return UncompressDecoder.decode(pixelData);
        }
    }

}

export default UnSyntaxed;
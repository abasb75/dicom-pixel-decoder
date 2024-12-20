import dicomRle from "dicom-rle";
import { DecodeOptions } from "./types";

class RLE {
    static decode(pixelData:DataView,options:DecodeOptions){

        const { 
            rows,
            columns,
            samplesPerPixel,
            bitsAllocated,
            planarConfiguration,
        } = options;
        
        if(!rows || !columns || !samplesPerPixel){
            return null;
        }

        const decoder = new dicomRle.RleDecoder();
        const decoded =  decoder.decode(new Uint8Array(pixelData.buffer),{
            height:rows,
            width:columns,
            samplesPerPixel,
            bitsAllocated,
            planarConfiguration,
        });

        return decoded;

        
        
        


    }

}

export default RLE;
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
            pixelRepresentation,
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

        if(bitsAllocated > 8){
            if(pixelRepresentation === 0){
                return new Uint16Array(decoded.buffer);
            }
            return new Int16Array(decoded.buffer);
        }
        return decoded;

        
        
        


    }

}

export default RLE;
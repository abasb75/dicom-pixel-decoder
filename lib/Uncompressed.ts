import { PixelArray } from "./types";
import { DecodeOptions } from "./types";



class UncompressDecoderr{

    static  decode(pixelData:DataView,dataset:DecodeOptions){
        let arrayBuffer = pixelData.buffer;
        let offset = pixelData.byteOffset;
        const length = pixelData.byteLength;
        const bitsAllocated = dataset.bitsAllocated;
        console.log('bitsAllocated',bitsAllocated);
        console.log('pixelRepresentation',dataset.pixelRepresentation);
        switch(bitsAllocated){
            case  8:
                return UncompressDecoderr._endianFixer(
                    new Uint8Array(arrayBuffer, offset, length),
                    !dataset.littleEndian,
                );
            case 16:
                if (dataset.pixelRepresentation === 0) {
                    return UncompressDecoderr._endianFixer(
                        new Uint16Array(arrayBuffer, offset, length / 2),
                        !dataset.littleEndian,
                    );    
                } else {
                    return UncompressDecoderr._endianFixer(
                        new Int16Array(arrayBuffer, offset, length / 2),
                        !dataset.littleEndian
                    );
                }
            case 32:
                console.log('float 32 array')
                return new Float32Array(arrayBuffer,offset,length/4);
                // return UncompressDecoderr._endianFixer(
                    
                //     !dataset.littleEndian
                // );
            default:
                return new Uint8Array(arrayBuffer);
        }

    }

    private static _endianFixer(data:PixelArray,bigEndian:boolean=false){

        console.log('bigEndian',bigEndian)
        if(!bigEndian){
            return data;
        }
        if(data instanceof Uint16Array || data instanceof Int16Array){
            for(let i=0;i<data.byteLength;i++){
                data[i] = ((data[i] & 0xff) << 8) | ((data[i] >> 8) & 0xff);
            }
        }
        return data;
    }

}

export  default UncompressDecoderr;
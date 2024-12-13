import { PixelArray } from "./types";
import { DecodeOptions } from "./types";



class UncompressDecoderr{

    static  decode(pixelData:DataView,dataset:DecodeOptions){
        let arrayBuffer = pixelData.buffer;
        let offset = pixelData.byteOffset;
        const length = pixelData.byteLength;
        const bitsAllocated = dataset.bitsAllocated;
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
                return UncompressDecoderr._endianFixer(
                    new Float32Array(arrayBuffer, offset, length / 4),
                    !dataset.littleEndian
                );
            default:
                return new Uint8Array(arrayBuffer);
        }

    }

    private static _endianFixer(data:PixelArray,bigEndian:boolean=false){
        if(!bigEndian){
            return data;
        }
        if(data instanceof Uint16Array){
            const _data = new Uint16Array(data.length);
            for(let i=0;i<_data.length;i++){
                _data[i] = ((data[i] & 0xFF) << 8)| ((data[i] >> 8) & 0xF)
            }
            return _data;
        }else if(data instanceof Int16Array){
            const _data = new Int16Array(data.length);
            for(let i=0;i<_data.length;i++){
                _data[i] = ((data[i] & 0xFF) << 8)| ((data[i] >> 8) & 0xF)
            }
            return _data;
        }else if(data instanceof Uint32Array){
            const _data = new Uint32Array(data.length);
            for(let i=0;i<_data.length;i++){
                _data[i] = ((data[i] & 0xFF) << 24) | ((data[i] & 0xFF00) << 8) | ((data[i] >> 8) & 0xFF00) | ((data[i] >> 24) & 0xFF);
            }
            return _data;
        }else if(data instanceof Float32Array){
            const _data = new Float32Array(data.length);
            for(let i=0;i<_data.length;i++){
                _data[i] = ((data[i] & 0xFF) << 24) | ((data[i] & 0xFF00) << 8) | ((data[i] >> 8) & 0xFF00) | ((data[i] >> 24) & 0xFF);
            }
            return _data;
        }
        return data;
    }

}

export  default UncompressDecoderr;
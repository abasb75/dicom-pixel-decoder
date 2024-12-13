import { DecodeOptions } from "./types";
import { PixelArray } from "./types";
import { decode } from "@abasb75/jpeg2000-decoder";

class JPEG2000{

    static async decode(pixelData:DataView,dataset:DecodeOptions){

        let arrayBuffer = pixelData.buffer;
        let offset = pixelData.byteOffset;
        const length = pixelData.byteLength;

        const decoded = await decode(
            arrayBuffer.slice(offset,length),
            {
                iterations:1,
            }
        );
        
        if(!(decoded.decodedBuffer instanceof Uint8Array)){
            return null;
        }

        const bitsAllocated = dataset.bitsAllocated;
        switch(bitsAllocated){
            case  8:
                if(decoded.frameInfo.isSigned){
                    return JPEG2000._endianFixer(
                        new Int8Array(
                            decoded.decodedBuffer.buffer,
                            decoded.decodedBuffer.byteOffset,
                            decoded.decodedBuffer.byteLength,
                        ),
                        !dataset.littleEndian
                    );
                }else{
                    return JPEG2000._endianFixer(
                        new Uint8Array(
                            decoded.decodedBuffer.buffer,
                            decoded.decodedBuffer.byteOffset,
                            decoded.decodedBuffer.byteLength,
                        ),
                        !dataset.littleEndian
                    );
                }
            case 16:
                if(decoded.frameInfo.isSigned){
                    return JPEG2000._endianFixer(
                        new Uint16Array(
                            decoded.decodedBuffer.buffer,
                            decoded.decodedBuffer.byteOffset,
                            decoded.decodedBuffer.byteLength/2,
                        ),
                        !dataset.littleEndian
                    );
                }else{
                    return JPEG2000._endianFixer(
                        new Int16Array(
                            decoded.decodedBuffer.buffer,
                            decoded.decodedBuffer.byteOffset,
                            decoded.decodedBuffer.byteLength/2,
                        ),
                        !dataset.littleEndian
                    );
                }
            case 32:
                return JPEG2000._endianFixer(
                    new Float32Array(
                        decoded.decodedBuffer.buffer,
                        decoded.decodedBuffer.byteOffset,
                        decoded.decodedBuffer.byteLength/4,
                    ),
                    !dataset.littleEndian
                );
            default:
                return new Uint8Array(arrayBuffer);
        }

    }

    private static _endianFixer(data:PixelArray,bigEndian:boolean=false){
        console.log('bigEndian',bigEndian);
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

export  default JPEG2000;
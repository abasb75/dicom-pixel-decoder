import { decode } from "@abasb75/charls-decoder";
import { DecodeOptions } from "./types";

class JPEGLS{
    static async decode(pixelData:DataView,dataset:DecodeOptions){

        console.log('pixelData',pixelData)
        let arrayBuffer = pixelData.buffer;
        let offset = pixelData.byteOffset;
        const length = pixelData.byteLength;

        const decoded = await decode(
            arrayBuffer.slice(offset,length),
        );

        if(!(decoded.decodedBuffer instanceof Uint8Array)){
            return null;
        }

        if(!(decoded.decodedBuffer instanceof Uint8Array)){
            return null;
        }

        const bitsAllocated = decoded.frameInfo.bitsPerSample;
        switch(bitsAllocated){
            case  8:
                if(dataset.pixelRepresentation){
                    return  new Int8Array(
                        decoded.decodedBuffer.buffer,
                        decoded.decodedBuffer.byteOffset,
                        decoded.decodedBuffer.byteLength,
                    );
                }else{
                    return new Uint8Array(
                        decoded.decodedBuffer.buffer,
                        decoded.decodedBuffer.byteOffset,
                        decoded.decodedBuffer.byteLength,
                    );
                }
            case 16:
                if(dataset.pixelRepresentation){
                    return new Uint16Array(
                        decoded.decodedBuffer.buffer,
                        decoded.decodedBuffer.byteOffset,
                        decoded.decodedBuffer.byteLength/2,
                    );
                }else{
                    return new Int16Array(
                        decoded.decodedBuffer.buffer,
                        decoded.decodedBuffer.byteOffset,
                        decoded.decodedBuffer.byteLength/2,
                    );
                }
            case 32:
                return new Float32Array(
                    decoded.decodedBuffer.buffer,
                    decoded.decodedBuffer.byteOffset,
                    decoded.decodedBuffer.byteLength/4,
                )
            default:
                return new Uint8Array(arrayBuffer);
        }

    }
}


export default JPEGLS;
import { decode } from "@abasb75/openjph";

class HTJ2K{

    static async decode(pixelData:DataView){

        let arrayBuffer = pixelData.buffer;
        let offset = pixelData.byteOffset;
        const length = pixelData.byteLength;

        const decoded = await decode(
            arrayBuffer.slice(offset,length),
        );
        
        if(!(decoded.decodedBuffer instanceof Uint8Array)){
            return null;
        }

        const bitsPerSample = decoded.frameInfo.bitsPerSample;
        if(bitsPerSample>8){
            if(decoded.frameInfo.isSigned){
                return new Int16Array(
                    decoded.decodedBuffer.buffer,
                    decoded.decodedBuffer.byteOffset,
                    decoded.decodedBuffer.byteLength/2,
                );
            }else{
                return new Uint16Array(
                    decoded.decodedBuffer.buffer,
                    decoded.decodedBuffer.byteOffset,
                    decoded.decodedBuffer.byteLength/2,
                );
            }
        }else{
            if(decoded.frameInfo.isSigned){
                return new Int8Array(
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
        }

    }

}

export  default HTJ2K;
import { decode } from "@abasb75/openjph";

class HTJ2K{

    static async decode(pixelData:DataView){

        let arrayBuffer = pixelData.buffer;
        let offset = pixelData.byteOffset;
        const length = pixelData.byteLength;

        const decoded = await decode(
            arrayBuffer.slice(offset,length),
        );
        
        return decoded.decodedBuffer;

    }

}

export  default HTJ2K;